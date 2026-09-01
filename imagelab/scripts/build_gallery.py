# -*- coding: utf-8 -*-
"""build_gallery.py — assemble the committed web assets for games/visionary-gallery.

imagelab/output/ and "research inbox/" are both gitignored: they hold full-size
sources and 60+ MB of intermediates. The gallery has to ship, so this script
produces the small, web-ready subset that actually goes in the repo, and a single
gallery.json the site reads.

Deliberately NOT copied, because the browser can do better with the raw numbers:
  * the attention heat map  -> drawn live to canvas from analysis.attention_grid
  * the region overlay      -> drawn live from analysis.regions
Copying them would be dead weight and a second source of truth.

    python imagelab/scripts/build_gallery.py [--svg-px 420] [--folio-px 900]
"""

from __future__ import annotations

import argparse
import io
import json
import shutil
import sys
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parent.parent
ROOT = BASE.parent
SITE = ROOT / "games" / "visionary-gallery"
ASSETS = SITE / "assets"

MANIFEST = BASE / "data" / "visionary.json"
ANALYSIS = BASE / "data" / "analysis.json"
PAPER = BASE / "data" / "papercraft.json"
PAPER_OUT = BASE / "output" / "papercraft"
VIS_OUT = BASE / "output" / "visionary"


def save_web(src_img, dst, max_px, quality=84):
    im = src_img.copy()
    if max(im.size) > max_px:
        s = max_px / max(im.size)
        im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.suffix == ".png":
        im.save(dst, optimize=True)
    else:
        im.convert("RGB").save(dst, quality=quality, optimize=True)
    return dst.stat().st_size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--folio-px", type=int, default=900)
    ap.add_argument("--plate-px", type=int, default=560)
    ap.add_argument("--thumb-px", type=int, default=380)
    ap.add_argument("--svg-px", type=int, default=420,
                    help="max embedded-image width inside the printable SVG")
    args = ap.parse_args()

    man = json.load(io.open(MANIFEST, encoding="utf-8"))
    ana = json.load(io.open(ANALYSIS, encoding="utf-8"))
    pap = json.load(io.open(PAPER, encoding="utf-8"))
    M = {r["id"]: r for r in man["images"]}
    A = {r["id"]: r for r in ana["images"]}
    P = {r["id"]: r for r in pap["sheets"]}

    if ASSETS.exists():
        shutil.rmtree(ASSETS)
    ASSETS.mkdir(parents=True)

    # Re-emit the print sheets at a web-committable embed size.
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import papercraft as pc
    pc_data_uri_orig = pc.data_uri
    pc.data_uri = lambda im, max_w=args.svg_px: pc_data_uri_orig(im, max_w)

    entries, total = [], 0
    for rec in ana["images"]:
        cid = rec["id"]
        m, p = M[cid], P.get(cid)
        d = ASSETS / cid
        d.mkdir(parents=True, exist_ok=True)

        src = Image.open(ROOT / m["file"]).convert("RGB")
        total += save_web(src, d / "folio.jpg", args.folio_px)
        total += save_web(src, d / "thumb.jpg", args.thumb_px, 80)

        det = VIS_OUT / cid / "detail.jpg"
        if det.exists():
            total += save_web(Image.open(det), d / "detail.jpg", 420, 72)

        plates = []
        if p:
            for L in p["layers"]:
                sp = ROOT / L["file"]
                if not sp.exists():
                    continue
                ext = ".png" if sp.suffix == ".png" else ".jpg"
                out = d / ("plate%d%s" % (L["index"], ext))
                total += save_web(Image.open(sp), out, args.plate_px)
                plates.append({"index": L["index"], "file": "assets/%s/%s" % (cid, out.name),
                               "frac": L.get("frac", [0, 0, 1, 1]),
                               "occupancy": L["occupancy"], "n_regions": L["n_regions"]})
            pv = PAPER_OUT / cid / "preview.jpg"
            if pv.exists():
                total += save_web(Image.open(pv), d / "preview.jpg", 620, 82)

            # regenerate the sheet at web embed size
            img = Image.open(ROOT / m["file"]).convert("RGB")
            if img.width > 1400:
                img = img.resize((1400, int(img.height * 1400 / img.width)), Image.LANCZOS)
            w, h = img.size
            sx, sy = w / rec["work_size"][0], h / rec["work_size"][1]
            regions = [{**r, "px_box": [int(r["box"][0] * sx), int(r["box"][1] * sy),
                                        int(r["box"][2] * sx), int(r["box"][3] * sy)]}
                       for r in rec["regions"]]
            layers = pc.build_layers(img, regions, ana["n_layers"])
            prov = m["provenance"]
            meta = " · ".join(x for x in [prov.get("institution"), prov.get("date"),
                                          m["rights"].get("licence")] if x)[:150]
            svg = pc.tunnel_svg(cid, cid.replace("-", " "), layers,
                                p["card_w_mm"], w / h, meta)
            (d / "tunnel.svg").write_text(svg, encoding="utf-8")
            total += (d / "tunnel.svg").stat().st_size

        entries.append({
            "id": cid,
            "tradition": rec["tradition"],
            "why_here": m["why_here"],
            "folio": "assets/%s/folio.jpg" % cid,
            "thumb": "assets/%s/thumb.jpg" % cid,
            "detail_map": ("assets/%s/detail.jpg" % cid) if (d / "detail.jpg").exists() else None,
            "preview": ("assets/%s/preview.jpg" % cid) if (d / "preview.jpg").exists() else None,
            "sheet": ("assets/%s/tunnel.svg" % cid) if (d / "tunnel.svg").exists() else None,
            "sheet_kb": round((d / "tunnel.svg").stat().st_size / 1024) if (d / "tunnel.svg").exists() else None,
            "plates": plates,
            "work_size": rec["work_size"],
            "metrics": rec["metrics"],
            "palette": rec["palette"],
            "orientation_hist": rec["orientation_hist"],
            "attention_grid": rec["attention_grid"],
            "regions": rec["regions"],
            "provenance": m["provenance"],
            "rights": m["rights"],
        })
        print("  %-24s %2d regions  %2d plates  sheet %s KB" % (
            cid, len(rec["regions"]), len(plates),
            entries[-1]["sheet_kb"] if entries[-1]["sheet_kb"] else "--"))

    traditions = {
        "cairo-bustan": ("The Cairo Būstān",
                         "Herat, 1488, Bihzād, one manuscript. Six folios from the same book as Yūsuf Ascent's — "
                         "the controlled comparison the portal asked for."),
        "miraj": ("Ascension",
                  "The miʿrāj: the ladder stated rather than inferred. Gates, gatekeepers, and a stated limit."),
        "haft-paykar": ("The Seven Pavilions",
                        "Nizami's seven domes, coloured for the seven planets that rule the seven climes."),
        "siyah-qalam": ("Siyah Qalam",
                        "Beings on blank paper. No ground line, no horizon — the world removed and the bodies kept."),
        "ajaib": ("Wonders of Creation",
                  "Qazwīnī's cosmography: a complete world model with an index."),
        "falnama": ("The Book of Omens",
                    "Monumental divinatory paintings a fortune-teller improvised from, for a fee."),
        "jalayirid": ("The Jalāyirid Margin",
                      "Baghdad and Tabriz, c. 1400 — Ibn Turka's own lifetime. Drawings growing out from under the text."),
        "mantiq": ("The Conference of the Birds",
                   "Attar's birds assembling to seek the Simurgh: the ascent as a crowd."),
    }

    payload = {
        "_note": ("Web assets and data for games/visionary-gallery. Generated by "
                  "imagelab/scripts/build_gallery.py from visionary.json + analysis.json + "
                  "papercraft.json. Do not hand-edit; re-run the script."),
        "generated": man["fetched"],
        "source": "Wikimedia Commons",
        "n_layers": ana["n_layers"],
        "layer_rule": ana["layer_rule"],
        "metric_notes": ana["metric_notes"],
        "traditions": traditions,
        "images": entries,
    }
    with io.open(SITE / "data" / "gallery.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print("\n%d images, %.1f MB of web assets -> %s"
          % (len(entries), total / 1e6, ASSETS))
    return 0


if __name__ == "__main__":
    (SITE / "data").mkdir(parents=True, exist_ok=True)
    sys.exit(main())
