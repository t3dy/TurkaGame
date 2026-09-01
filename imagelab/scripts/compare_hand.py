# -*- coding: utf-8 -*-
"""compare_hand.py — machine layers vs the hand-drawn Yusuf rungs.

The Yusuf folio is the one image in the corpus that exists in both forms: 43
regions drawn and argued by hand into seven cosmological rungs
(games/yusuf-ascent/data/palace.json), and 27 regions proposed and layered by
imagelab/scripts/analyze.py with nothing touched.

That makes it the only place we can ask what the automatic pipeline is worth. This
script matches the two sets by box overlap and reports:

  * how many hand regions the machine found at all, at several IoU thresholds
  * for matched pairs, Spearman rank correlation between the machine's
    layer_score and the hand's rung_n -- i.e. does the machine ORDER things the
    way the argument does, even at different granularity
  * the confusion between machine layer and hand rung

Writes imagelab/data/hand_vs_machine.json, which the gallery reads. The figure it
prints is the figure the site quotes; nothing here is asserted by hand.

    python imagelab/scripts/compare_hand.py
"""

from __future__ import annotations

import io
import json
from pathlib import Path

import numpy as np
from scipy.stats import spearmanr

BASE = Path(__file__).resolve().parent.parent
ROOT = BASE.parent
PALACE = ROOT / "games" / "yusuf-ascent" / "data" / "palace.json"
ANALYSIS = BASE / "data" / "analysis.json"
OUT = BASE / "data" / "hand_vs_machine.json"
TARGET = "bustan-yusuf-zulaykha"


def iou(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix = max(0, min(ax2, bx2) - max(ax1, bx1))
    iy = max(0, min(ay2, by2) - max(ay1, by1))
    inter = ix * iy
    if inter == 0:
        return 0.0
    ua = (ax2 - ax1) * (ay2 - ay1) + (bx2 - bx1) * (by2 - by1) - inter
    return inter / ua


def main():
    palace = json.load(io.open(PALACE, encoding="utf-8"))
    ana = json.load(io.open(ANALYSIS, encoding="utf-8"))
    rec = next(r for r in ana["images"] if r["id"] == TARGET)

    # Hand boxes are in the original 1588x2370 frame; machine boxes in WORK_W space.
    HW, HH = palace["source"]["dimensions"]
    MW, MH = rec["work_size"]
    sx, sy = MW / HW, MH / HH
    hand = [{"id": n["id"], "rung": n["rung_n"], "title": n["title"], "role": n["role"],
             "box": [n["box"][0] * sx, n["box"][1] * sy, n["box"][2] * sx, n["box"][3] * sy]}
            for n in palace["nodes"] if n["role"] != "frame"]
    mach = rec["regions"]

    # Greedy one-to-one match on IoU, best pair first.
    pairs = sorted(((iou(h["box"], m["box"]), hi, mi)
                    for hi, h in enumerate(hand) for mi, m in enumerate(mach)),
                   key=lambda t: -t[0])
    used_h, used_m, matched = set(), set(), []
    for score, hi, mi in pairs:
        if score <= 0 or hi in used_h or mi in used_m:
            continue
        used_h.add(hi); used_m.add(mi)
        matched.append({"iou": round(score, 4), "hand": hand[hi], "machine": mach[mi]})

    coverage = {}
    for thr in (0.1, 0.2, 0.3, 0.5):
        coverage["iou>=%.1f" % thr] = {
            "matched_hand_regions": sum(1 for m in matched if m["iou"] >= thr),
            "of_hand_total": len(hand),
            "share": round(sum(1 for m in matched if m["iou"] >= thr) / len(hand), 3),
        }

    # Ordering agreement, on the pairs that are real matches.
    good = [m for m in matched if m["iou"] >= 0.2]
    rho = p = None
    if len(good) >= 4:
        # layer_score rises with height on the page, detail and chroma; hand rung
        # rises from street to crown. Both run the same way, so agreement is a
        # POSITIVE rho. (An earlier note here said negative — it confused the score
        # with the layer index, which is a different quantity.)
        r = spearmanr([g["machine"]["layer_score"] for g in good],
                      [g["hand"]["rung"] for g in good])
        rho, p = float(r.statistic), float(r.pvalue)

    # Confusion: machine layer (0..n-1, deepest first) vs hand rung (0..6, lowest first)
    nL = ana["n_layers"]
    conf = [[0] * 7 for _ in range(nL)]
    for g in good:
        conf[g["machine"]["layer"]][g["hand"]["rung"]] += 1

    # Which hand regions the machine missed entirely, and what they are.
    missed = [h["title"] for i, h in enumerate(hand) if i not in used_h]

    payload = {
        "_note": ("Machine-proposed regions vs the hand-drawn Yusuf Ascent decomposition. "
                  "Produced by imagelab/scripts/compare_hand.py. This is the only image in "
                  "the corpus that exists in both forms, so it is the only honest test of "
                  "what the automatic pipeline is worth."),
        "image": TARGET,
        "hand_regions": len(hand),
        "machine_regions": len(mach),
        "coverage": coverage,
        "ordering": {
            "n_pairs": len(good),
            "spearman_rho": round(rho, 4) if rho is not None else None,
            "p_value": float("%.4g" % p) if p is not None else None,
            "expected_sign": "positive — layer_score and rung both rise from the street to the crown",
        },
        "confusion_layer_by_rung": conf,
        "rung_names": [r["name"] for r in palace["rungs"]],
        "missed_by_machine": missed,
        "matched": [{"iou": m["iou"], "hand_id": m["hand"]["id"], "hand_title": m["hand"]["title"],
                     "hand_rung": m["hand"]["rung"], "machine_id": m["machine"]["id"],
                     "machine_layer": m["machine"]["layer"],
                     "machine_score": m["machine"]["layer_score"]} for m in matched],
    }
    with io.open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print("hand regions   %d" % len(hand))
    print("machine regions %d" % len(mach))
    for k, v in coverage.items():
        print("  %-9s matched %2d/%d  (%.0f%%)" % (k, v["matched_hand_regions"],
                                                   v["of_hand_total"], v["share"] * 100))
    print("ordering: n=%d  rho=%s  p=%s" % (len(good), rho, p))
    print("missed entirely: %d  %s" % (len(missed), ", ".join(missed[:8])))
    print("->", OUT)


if __name__ == "__main__":
    main()
