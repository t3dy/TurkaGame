"""cut_regions.py — slice the source illustrations into reusable visual elements.

Reads imagelab/data/regions.json (boxes supplied by visual inspection) and emits,
per region:

  * <region>.png      rectangular crop, always
  * <region>.cut.png  RGBA cutout with the background removed, where cut=="matte"

Matting uses OpenCV GrabCut seeded from the region box, padded so the algorithm has
some background to learn from. Dense Persian tilework is adversarial for GrabCut, so
every matte is written *alongside* its rect crop rather than replacing it — if a matte
comes out badly the rect is still usable, and contact sheets make bad mattes obvious.

    python imagelab/scripts/cut_regions.py [--only IMAGE_ID] [--no-matte]
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

BASE = Path(__file__).resolve().parent.parent
SRC = BASE.parent / "research inbox" / "images"
OUT = BASE / "output"
MANIFEST = BASE / "data" / "regions.json"

PAD = 0.14          # fraction of box size padded around the rect for GrabCut context
ITERS = 6           # GrabCut iterations
MIN_FG = 0.04       # if the matte keeps < this fraction of the box, call it a failure


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def matte(bgr: np.ndarray, box: tuple[int, int, int, int],
          seeds: dict | None = None) -> tuple[np.ndarray, float]:
    """GrabCut a region. Returns (RGBA of the padded window, kept-foreground fraction).

    A bare rect is the weakest possible initialization, and it fails badly on the
    miniatures: dense tilework reads as foreground, and figures that physically overlap
    cannot be told apart from their neighbours. Where the manifest supplies `seeds`
    ({"fg": [[x,y],...], "bg": [[x,y],...]} in original coords) those points are painted
    into the mask as certain foreground/background, which is what actually rescues the
    hard cases.
    """
    h, w = bgr.shape[:2]
    x1, y1, x2, y2 = box
    bw, bh = x2 - x1, y2 - y1
    px, py = int(bw * PAD), int(bh * PAD)

    wx1, wy1 = clamp(x1 - px, 0, w), clamp(y1 - py, 0, h)
    wx2, wy2 = clamp(x2 + px, 0, w), clamp(y2 + py, 0, h)
    window = bgr[wy1:wy2, wx1:wx2]

    # the subject rect, expressed inside the padded window
    rect = (x1 - wx1, y1 - wy1, bw, bh)

    mask = np.zeros(window.shape[:2], np.uint8)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    mode = cv2.GC_INIT_WITH_RECT

    if seeds:
        # rect first, so the seeds refine a sane starting partition rather than a blank one
        try:
            cv2.grabCut(window, mask, rect, bgd, fgd, 2, cv2.GC_INIT_WITH_RECT)
        except cv2.error:
            return None, 0.0
        brush = max(3, int(min(bw, bh) * 0.05))
        for sx, sy in seeds.get("fg", []):
            cv2.circle(mask, (sx - wx1, sy - wy1), brush, cv2.GC_FGD, -1)
        for sx, sy in seeds.get("bg", []):
            cv2.circle(mask, (sx - wx1, sy - wy1), brush, cv2.GC_BGD, -1)
        bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        mode = cv2.GC_INIT_WITH_MASK

    try:
        if mode == cv2.GC_INIT_WITH_MASK:
            cv2.grabCut(window, mask, None, bgd, fgd, ITERS, cv2.GC_INIT_WITH_MASK)
        else:
            cv2.grabCut(window, mask, rect, bgd, fgd, ITERS, cv2.GC_INIT_WITH_RECT)
    except cv2.error:
        return None, 0.0

    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

    # keep only the largest connected blob — drops speckle picked up from tilework
    n, labels, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        biggest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        fg = np.where(labels == biggest, 255, 0).astype(np.uint8)

    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    alpha = cv2.GaussianBlur(fg, (5, 5), 0)

    kept = float((fg > 0).sum()) / float(max(1, bw * bh))
    rgba = np.dstack([cv2.cvtColor(window, cv2.COLOR_BGR2RGB), alpha])
    return rgba, kept


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--only", help="limit to one image id")
    ap.add_argument("--no-matte", action="store_true", help="rect crops only")
    args = ap.parse_args()

    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    index, warnings = [], []

    for img in manifest["images"]:
        if args.only and img["id"] != args.only:
            continue
        path = SRC / img["file"]
        if not path.exists():
            warnings.append(f"MISSING SOURCE: {img['file']}")
            continue

        pil = Image.open(path).convert("RGB")
        if (pil.width, pil.height) != (img["width"], img["height"]):
            warnings.append(
                f"{img['id']}: manifest says {img['width']}x{img['height']}, "
                f"file is {pil.width}x{pil.height} — boxes will be off"
            )
        bgr = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)

        dest = OUT / img["id"]
        dest.mkdir(parents=True, exist_ok=True)

        for r in img["regions"]:
            x1, y1, x2, y2 = r["box"]
            x1, y1 = clamp(x1, 0, pil.width), clamp(y1, 0, pil.height)
            x2, y2 = clamp(x2, 0, pil.width), clamp(y2, 0, pil.height)
            if x2 - x1 < 8 or y2 - y1 < 8:
                warnings.append(f"{img['id']}/{r['id']}: degenerate box, skipped")
                continue

            rec = {"image": img["id"], "region": r["id"], "kind": r["kind"],
                   "label": r["label"], "depicts": r.get("depicts"),
                   "box": [x1, y1, x2, y2]}

            pil.crop((x1, y1, x2, y2)).save(dest / f"{r['id']}.png")
            rec["rect"] = f"{img['id']}/{r['id']}.png"

            if r.get("cut") == "matte" and not args.no_matte:
                rgba, kept = matte(bgr, (x1, y1, x2, y2), r.get("seeds"))
                if rgba is None or kept < MIN_FG:
                    warnings.append(
                        f"{img['id']}/{r['id']}: matte kept only {kept:.1%} — using rect only"
                    )
                else:
                    Image.fromarray(rgba).save(dest / f"{r['id']}.cut.png")
                    rec["matte"] = f"{img['id']}/{r['id']}.cut.png"
                    rec["matte_kept"] = round(kept, 3)

            index.append(rec)

    OUT.mkdir(parents=True, exist_ok=True)
    json.dump(index, open(OUT / "index.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)

    mattes = sum(1 for r in index if "matte" in r)
    print(f"{len(index)} regions cut ({mattes} matted) -> {OUT}")
    for w in warnings:
        print(f"  WARN {w}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
