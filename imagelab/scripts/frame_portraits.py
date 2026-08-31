"""frame_portraits.py — build game-ready portrait assets by masking crops into a
pointed-arch niche.

Why this and not silhouette cutouts:

GrabCut works on the Samarkand mural (flat grounds, real figure/ground separation) and
fails on the two miniatures. That failure is structural, not a tuning problem. Colour-model
segmentation needs the subject to differ from the ground; in a Persian miniature the
tilework is the same saturated flat colour with the same hard edges as the robes, and the
three principals in the triple portrait physically overlap one another. Seeding GrabCut
with foreground/background points was tried and moved the numbers by ~0.03.

The source solves this problem itself: it frames its figures in a pointed-arch niche.
Masking a rect crop to that arch produces a clean, period-correct portrait token without
needing to isolate a silhouette at all — and it gives every character card one consistent
shape, which is what a game UI actually wants.

    python imagelab/scripts/frame_portraits.py
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

BASE = Path(__file__).resolve().parent.parent
OUT = BASE / "output"
PORTRAITS = OUT / "portraits"

SIZE = (420, 560)          # portrait token, 3:4
SS = 4                     # supersample factor for a clean arch edge
BORDER = 7                 # gold rule, px at final size
GOLD = (176, 141, 62)
INK = (38, 30, 22)

# region -> (source image id, crop id, focus) ; focus biases the framing vertically
SUBJECTS = [
    ("ibn-turka",        "turka-triple-portrait",        "ibn-turka",         0.16),
    ("qazizada-rumi",    "turka-triple-portrait",        "qazizada",          0.10),
    ("sharaf-al-din-yazdi", "turka-triple-portrait",     "yazdi",             0.10),
    ("ulugh-beg",        "samarkand-observatory-mural",  "ulugh-beg",         0.05),
    ("sayyid-husayn-akhlati", "akhlati-receiving-gifts", "akhlati",           0.05),
    ("the-apprentice",   "samarkand-observatory-mural",  "apprentice-globe",  0.05),
    ("the-watchers",     "akhlati-receiving-gifts",      "two-outside-wall",  0.05),
]


def arch_mask(size: tuple[int, int], k: float = 0.62, spring_at: float = 0.46) -> Image.Image:
    """A two-centred pointed arch, built by sampling both arcs into one polygon.

    Span W springs at `spring_at` of the height. The two arc centres sit on the spring
    line at x = kW and x = W - kW, each of radius kW, so the arcs meet at a point on the
    centreline sqrt(k^2 - 1/4) * W above the springing. k must exceed 0.5 or the arcs
    never meet.

    (Drawing this with two pieslices produced a notched battlement rather than an arch —
    the slices did not meet the apex cleanly. Sampling is unglamorous and correct.)
    """
    import math

    w, h = size
    W, H = w * SS, h * SS
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)

    spring = H * spring_at
    r = k * W
    rise = math.sqrt(max(r * r - (W / 2) ** 2, 1.0))

    pts = [(0, H), (0, spring)]
    steps = 240
    for i in range(steps + 1):                     # left centre at (r, spring)
        x = W / 2 * i / steps
        pts.append((x, spring - math.sqrt(max(r * r - (x - r) ** 2, 0.0))))
    for i in range(steps + 1):                     # right centre at (W - r, spring)
        x = W / 2 + W / 2 * i / steps
        pts.append((x, spring - math.sqrt(max(r * r - (x - (W - r)) ** 2, 0.0))))
    pts += [(W, spring), (W, H)]

    d.polygon(pts, fill=255)
    return m.resize(size, Image.LANCZOS)


def cover(img: Image.Image, size: tuple[int, int], focus: float) -> Image.Image:
    """Scale to cover, then crop, biasing the window toward the top by `focus`."""
    tw, th = size
    scale = max(tw / img.width, th / img.height)
    nw, nh = max(tw, int(img.width * scale + 0.5)), max(th, int(img.height * scale + 0.5))
    img = img.resize((nw, nh), Image.LANCZOS)
    left = (nw - tw) // 2
    top = int((nh - th) * focus)
    return img.crop((left, top, left + tw, top + th))


def main() -> int:
    PORTRAITS.mkdir(parents=True, exist_ok=True)
    mask = arch_mask(SIZE)
    inner = mask.filter(ImageFilter.MinFilter(2 * BORDER + 1))   # mask shrunk by BORDER
    rim = Image.eval(mask, lambda v: v)                          # copy
    made = []

    for slug, image_id, region_id, focus in SUBJECTS:
        src = OUT / image_id / f"{region_id}.png"
        if not src.exists():
            print(f"  MISSING {src}")
            continue

        art = cover(Image.open(src).convert("RGB"), SIZE, focus)

        card = Image.new("RGBA", SIZE, (0, 0, 0, 0))
        # gold rule sits between the outer arch and the inset arch
        gold = Image.new("RGBA", SIZE, GOLD + (255,))
        card.paste(gold, (0, 0), rim)
        card.paste(art.convert("RGBA"), (0, 0), inner)

        out = PORTRAITS / f"{slug}.png"
        card.save(out)
        made.append({"slug": slug, "file": f"portraits/{slug}.png",
                     "from": {"image": image_id, "region": region_id}})
        print(f"  {slug:24s} <- {image_id}/{region_id}")

    json.dump(made, open(PORTRAITS / "index.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"{len(made)} portrait tokens -> {PORTRAITS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
