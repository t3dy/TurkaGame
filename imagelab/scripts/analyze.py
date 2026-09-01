# -*- coding: utf-8 -*-
"""analyze.py — computational deconstruction of the visionary corpus.

This exists to turn an art-historical *claim* into a *measurement*.

The claim, from the Yusuf Ascent portal: Bihzad's impossible palace is a diagram
rather than a house, and the evidence is that "nothing in the building is
structurally possible, and every surface is finished to the same degree of
attention." The second half of that is not a metaphor — it is a statement about
the spatial distribution of detail, and it can be tested against a whole corpus.

So each image gets:

  attention_evenness   1 - normalised dispersion of detail density over a grid.
                       High = attention spread flat across the picture (a field).
                       Low  = attention concentrated (a focal subject on a ground).
  orientation_spread   normalised entropy of the edge-orientation histogram.
                       High = many competing straight directions (architecture that
                       does not agree with itself). Low = one or two (a page, a wall).
  rectilinearity       share of edge energy within 12 degrees of the page axes.
  ground_fraction      share of pixels that are near-uniform support (bare paper).
                       This is the Siyah Qalam measure: figures with no world.
  palette              k-means dominant colours in CIE Lab, with coverage.
  chroma_mean          mean Lab chroma. Separates the illuminated from the drawn.

  regions              auto-proposed interactable regions: colour-quantised,
                       connected-component boxes, filtered and merged. These are
                       *proposals* — the Yusuf folio's 43 regions were drawn by eye
                       and are better. The point is that a new image can enter the
                       pipeline with no hand work at all.
  layers               each region assigned to one of N papercraft/3D layers by a
                       stated heuristic (see LAYER_RULE). A heuristic, labelled.

Everything is deterministic: fixed k-means seed, no sampling.

    python imagelab/scripts/analyze.py [--only ID] [--layers 5]

Writes imagelab/data/analysis.json and imagelab/output/visionary/<id>/ debug maps.
"""

from __future__ import annotations

import argparse
import io
import json
import math
import sys
from pathlib import Path

import cv2
import numpy as np
from sklearn.cluster import KMeans

BASE = Path(__file__).resolve().parent.parent
ROOT = BASE.parent
SRC = ROOT / "research inbox" / "visionary"
OUT = BASE / "output" / "visionary"
MANIFEST = BASE / "data" / "visionary.json"
ANALYSIS = BASE / "data" / "analysis.json"

WORK_W = 900        # analysis resolution; every measure below is scale-normalised
GRID = 16           # attention grid is GRID x GRID cells
ORI_BINS = 36       # 5-degree orientation bins
N_PALETTE = 6
SEED = 20260831

LAYER_RULE = (
    "Layer index is a heuristic, not a reading. Each region scores "
    "0.45*(1 - normalised vertical centre) + 0.35*normalised detail density + "
    "0.20*normalised chroma, then regions are ranked ascending and cut into N equal "
    "bands, so layer 0 is deepest and layer n-1 frontmost. "
    "The reasoning: in Persianate painting higher on the page tends to read as "
    "further into the picture, and the elements that carry the most detail and the "
    "most saturated pigment tend to be the ones the painter wanted foremost. It "
    "ORDERS regions much the way the hand-drawn Yusuf rungs do (Spearman rho on the "
    "regions it finds), but it FINDS far fewer of them, and misses the ones carrying "
    "the argument. The measured figures are in imagelab/data/hand_vs_machine.json and "
    "on the gallery's Method page; nothing here is asserted."
)


# --------------------------------------------------------------- primitives --

def load(path):
    img = cv2.imdecode(np.fromfile(str(path), dtype=np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit("cannot read %s" % path)
    h, w = img.shape[:2]
    s = WORK_W / max(w, 1)
    if s < 1:
        img = cv2.resize(img, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA)
    return img


def detail_map(bgr):
    """Local high-frequency energy: the 'degree of attention' proxy.

    Gradient magnitude, blurred, so it measures density of incident rather than
    the incidents themselves. Normalised to [0,1] by its own 99th percentile so
    the measure is comparable between a saturated illumination and a pen drawing.
    """
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    mag = cv2.magnitude(gx, gy)
    dens = cv2.GaussianBlur(mag, (0, 0), sigmaX=max(bgr.shape) / 90.0)
    p99 = np.percentile(dens, 99) or 1.0
    return np.clip(dens / p99, 0, 1)


def attention_evenness(dens):
    """1 - (coefficient of variation of cell means, capped at 1).

    A picture whose attention is spread flat scores near 1; one with a bright
    subject on an empty ground scores low. Grid-based rather than pixel-based so
    it measures *composition*, not texture.
    """
    h, w = dens.shape
    ch, cw = h // GRID, w // GRID
    if ch < 2 or cw < 2:
        return None, None
    cells = dens[:ch * GRID, :cw * GRID].reshape(GRID, ch, GRID, cw).mean(axis=(1, 3))
    m = float(cells.mean())
    if m <= 1e-6:
        return 0.0, cells.tolist()
    cv_ = float(cells.std() / m)
    return float(max(0.0, 1.0 - min(cv_, 1.0))), cells.tolist()


def orientation_stats(bgr):
    """Edge-orientation histogram: how many directions the picture commits to."""
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    mag = cv2.magnitude(gx, gy)
    ang = (np.rad2deg(np.arctan2(gy, gx)) % 180.0)
    strong = mag > np.percentile(mag, 88)      # only real edges vote
    if strong.sum() < 100:
        return None, None, None
    hist, _ = np.histogram(ang[strong], bins=ORI_BINS, range=(0, 180),
                           weights=mag[strong])
    p = hist / (hist.sum() or 1.0)
    nz = p[p > 0]
    entropy = float(-(nz * np.log(nz)).sum() / math.log(ORI_BINS))
    # rectilinear = within 12 deg of 0 or 90
    bw = 180.0 / ORI_BINS
    axis = [i for i in range(ORI_BINS)
            if min(abs(i * bw + bw / 2 - 0), abs(i * bw + bw / 2 - 90),
                   abs(i * bw + bw / 2 - 180)) <= 12]
    rect = float(p[axis].sum())
    return entropy, rect, p.tolist()


def ground_fraction(bgr):
    """Share of the image that is bare, near-uniform support.

    Low local variance AND low chroma AND high lightness — i.e. paper. This is the
    measure that separates Siyah Qalam (figures floating on nothing) from a
    Timurid illumination (no bare paper anywhere inside the frame).
    """
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    L, a, b = lab[..., 0] * 100 / 255, lab[..., 1] - 128, lab[..., 2] - 128
    chroma = np.sqrt(a * a + b * b)
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    k = max(3, (max(bgr.shape) // 120) | 1)
    mean = cv2.blur(g, (k, k))
    var = cv2.blur(g * g, (k, k)) - mean * mean
    quiet = (var < 60) & (chroma < 26) & (L > 55)
    return float(quiet.mean())


def palette(bgr, k=N_PALETTE):
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    step = max(1, lab.shape[0] // 40000)
    sample = lab[::step]
    km = KMeans(n_clusters=k, n_init=6, random_state=SEED).fit(sample)
    labels = km.predict(lab)
    out = []
    for i, c in enumerate(km.cluster_centers_):
        px = np.uint8([[c]])
        rgb = cv2.cvtColor(px, cv2.COLOR_LAB2RGB)[0][0]
        cov = float((labels == i).mean())
        chroma = float(np.hypot(c[1] - 128, c[2] - 128))
        out.append({"hex": "#%02x%02x%02x" % tuple(int(v) for v in rgb),
                    "coverage": round(cov, 4), "chroma": round(chroma, 2)})
    out.sort(key=lambda d: -d["coverage"])
    return out


# ------------------------------------------------------------ deconstruction --

def propose_regions(bgr, dens, max_regions=40):
    """Auto-propose interactable regions.

    Quantise to a small palette, take connected components per colour, keep the
    ones big enough to be an element and small enough not to be the whole page,
    then suppress boxes that are mostly contained in a bigger kept box. Crude and
    honest: it finds fields of flat colour, which is exactly what Persianate
    painting is built out of, and it misses figures that share a ground.
    """
    h, w = bgr.shape[:2]
    area = h * w
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    sm = cv2.pyrMeanShiftFiltering(lab, sp=12, sr=18, maxLevel=1)
    flat = sm.reshape(-1, 3).astype(np.float32)
    step = max(1, flat.shape[0] // 30000)
    km = KMeans(n_clusters=10, n_init=5, random_state=SEED).fit(flat[::step])
    lbl = km.predict(flat).reshape(h, w).astype(np.int32)

    boxes = []
    for ci in range(10):
        mask = (lbl == ci).astype(np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
        n, _, stats, cent = cv2.connectedComponentsWithStats(mask, 8)
        for i in range(1, n):
            x, y, bw_, bh_, a = stats[i]
            if a < area * 0.0035 or a > area * 0.42:
                continue
            if bw_ < w * 0.03 or bh_ < h * 0.03:
                continue
            fill = a / float(bw_ * bh_)
            if fill < 0.30:                     # scattered speckle, not an element
                continue
            boxes.append({"box": [int(x), int(y), int(x + bw_), int(y + bh_)],
                          "area": int(a), "fill": round(float(fill), 3),
                          "cluster": int(ci)})

    boxes.sort(key=lambda b: -b["area"])
    kept = []
    for b in boxes:
        x1, y1, x2, y2 = b["box"]
        dup = False
        for k in kept:
            kx1, ky1, kx2, ky2 = k["box"]
            ix = max(0, min(x2, kx2) - max(x1, kx1))
            iy = max(0, min(y2, ky2) - max(y1, ky1))
            inter = ix * iy
            if inter > 0.62 * (x2 - x1) * (y2 - y1):
                dup = True
                break
        if not dup:
            kept.append(b)
        if len(kept) >= max_regions:
            break

    lab_f = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    for i, b in enumerate(kept):
        x1, y1, x2, y2 = b["box"]
        sub = lab_f[y1:y2, x1:x2]
        b["id"] = "r%02d" % i
        b["detail"] = round(float(dens[y1:y2, x1:x2].mean()), 4)
        b["chroma"] = round(float(np.hypot(sub[..., 1] - 128, sub[..., 2] - 128).mean()), 2)
        rgb = cv2.cvtColor(np.uint8([[sub.reshape(-1, 3).mean(axis=0)]]), cv2.COLOR_LAB2RGB)[0][0]
        b["hex"] = "#%02x%02x%02x" % tuple(int(v) for v in rgb)
        b["norm"] = [round(x1 / w, 5), round(y1 / h, 5),
                     round((x2 - x1) / w, 5), round((y2 - y1) / h, 5)]
    return kept


def assign_layers(regions, n_layers, h):
    """Rank regions by the stated heuristic and cut into n_layers equal bands."""
    if not regions:
        return
    def nrm(vals):
        lo, hi = min(vals), max(vals)
        rng = (hi - lo) or 1.0
        return [(v - lo) / rng for v in vals]

    ys = nrm([(r["box"][1] + r["box"][3]) / 2.0 for r in regions])
    ds = nrm([r["detail"] for r in regions])
    cs = nrm([r["chroma"] for r in regions])
    for r, y, d, c in zip(regions, ys, ds, cs):
        r["layer_score"] = round(0.45 * (1 - y) + 0.35 * d + 0.20 * c, 4)
    # Ascending: layer 0 is the deepest/least salient, layer n-1 the frontmost.
    # This runs the same direction as a cosmological rung, which makes the
    # machine-vs-hand confusion matrix in compare_hand.py legible, and it stops
    # the highest-salience regions being absorbed into the papercraft ground plate.
    order = sorted(regions, key=lambda r: r["layer_score"])
    per = max(1, math.ceil(len(order) / n_layers))
    for i, r in enumerate(order):
        r["layer"] = min(n_layers - 1, i // per)


# ------------------------------------------------------------------- debug ---

def write_debug(cid, bgr, dens, cells, regions):
    d = OUT / cid
    d.mkdir(parents=True, exist_ok=True)
    heat = cv2.applyColorMap(np.uint8(dens * 255), cv2.COLORMAP_INFERNO)
    cv2.imwrite(str(d / "detail.jpg"), heat, [cv2.IMWRITE_JPEG_QUALITY, 82])

    if cells:
        c = np.array(cells, dtype=np.float32)
        c = (c - c.min()) / ((c.max() - c.min()) or 1)
        grid = cv2.applyColorMap(np.uint8(cv2.resize(c, (bgr.shape[1], bgr.shape[0]),
                                 interpolation=cv2.INTER_NEAREST) * 255), cv2.COLORMAP_VIRIDIS)
        cv2.imwrite(str(d / "attention.jpg"), grid, [cv2.IMWRITE_JPEG_QUALITY, 78])

    over = bgr.copy()
    for r in regions:
        x1, y1, x2, y2 = r["box"]
        hue = int(180 * r.get("layer", 0) / 6.0)
        col = cv2.cvtColor(np.uint8([[[hue, 220, 255]]]), cv2.COLOR_HSV2BGR)[0][0].tolist()
        cv2.rectangle(over, (x1, y1), (x2, y2), col, 2)
        cv2.putText(over, r["id"], (x1 + 3, y1 + 15), cv2.FONT_HERSHEY_SIMPLEX,
                    0.42, col, 1, cv2.LINE_AA)
    cv2.imwrite(str(d / "regions.jpg"), over, [cv2.IMWRITE_JPEG_QUALITY, 85])


# -------------------------------------------------------------------- main ---

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--layers", type=int, default=5)
    args = ap.parse_args()

    man = json.load(io.open(MANIFEST, encoding="utf-8"))
    results = []
    for rec in man["images"]:
        cid = rec["id"]
        if args.only and args.only != cid:
            continue
        path = ROOT / rec["file"]
        if not path.exists():
            print("  skip %s (no file)" % cid)
            continue
        bgr = load(path)
        h, w = bgr.shape[:2]
        dens = detail_map(bgr)
        even, cells = attention_evenness(dens)
        ent, rect, ohist = orientation_stats(bgr)
        gfrac = ground_fraction(bgr)
        pal = palette(bgr)
        regions = propose_regions(bgr, dens)
        assign_layers(regions, args.layers, h)
        write_debug(cid, bgr, dens, cells, regions)

        lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
        chroma_mean = float(np.hypot(lab[..., 1] - 128, lab[..., 2] - 128).mean())

        results.append({
            "id": cid,
            "tradition": rec["tradition"],
            "work_size": [w, h],
            "metrics": {
                "attention_evenness": round(even, 4) if even is not None else None,
                "orientation_spread": round(ent, 4) if ent is not None else None,
                "rectilinearity": round(rect, 4) if rect is not None else None,
                "ground_fraction": round(gfrac, 4),
                "chroma_mean": round(chroma_mean, 2),
            },
            "palette": pal,
            "orientation_hist": [round(v, 5) for v in (ohist or [])],
            "attention_grid": [[round(v, 4) for v in row] for row in (cells or [])],
            "regions": regions,
            "n_regions": len(regions),
            "debug": {k: "imagelab/output/visionary/%s/%s.jpg" % (cid, k)
                      for k in ("detail", "attention", "regions")},
        })
        m = results[-1]["metrics"]
        print("  %-24s even=%.3f ori=%.3f rect=%.3f ground=%.3f chroma=%5.1f  regions=%d"
              % (cid, m["attention_evenness"] or 0, m["orientation_spread"] or 0,
                 m["rectilinearity"] or 0, m["ground_fraction"], m["chroma_mean"],
                 len(regions)))

    if not args.only:
        payload = {
            "_note": ("Computational deconstruction of the visionary corpus, produced by "
                      "imagelab/scripts/analyze.py. Metrics are measurements; region "
                      "proposals and layer assignment are heuristics and are labelled as "
                      "such. Deterministic: fixed k-means seed, no sampling."),
            "seed": SEED, "work_width": WORK_W, "grid": GRID,
            "n_layers": args.layers, "layer_rule": LAYER_RULE,
            "metric_notes": {
                "attention_evenness": "1 - CoV of detail density over a 16x16 grid. High = attention spread flat (a field). Low = a focal subject on a ground.",
                "orientation_spread": "Normalised entropy of the edge-orientation histogram. High = many competing straight directions.",
                "rectilinearity": "Share of edge energy within 12 degrees of the page axes.",
                "ground_fraction": "Share of pixels that are quiet, pale and near-neutral: bare support.",
                "chroma_mean": "Mean CIE Lab chroma. Separates illumination from drawing.",
            },
            "images": results,
        }
        with io.open(ANALYSIS, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print("\n%d analysed -> %s" % (len(results), ANALYSIS))
    return 0


if __name__ == "__main__":
    sys.exit(main())
