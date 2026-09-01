# -*- coding: utf-8 -*-
"""papercraft.py — turn an analysed folio into a printable paper tunnel-book.

A tunnel book (or peepshow book) is a stack of cards held apart by concertina
side walls; each card is cut away except for what belongs on its plane, so
looking in through the front you see the picture reassembled with real depth
between its parts. It is the physical form of Yusuf Ascent's Prototype B, and it
predates it by about three hundred years.

That correspondence is not decoration. A tunnel book has exactly the property the
3D prototype was built to demonstrate: **the picture only coheres from the front.**
Step to the side and it falls into separate planes. So this script and
proto-b-stack are two renderings of one idea, and the paper one is the older.

For each image it emits, from the layers assigned in analysis.json:

    <id>-layer<N>.png     the card artwork, cut away to that layer's regions
    <id>-tunnel.svg       the printable sheet: cards, tabs, fold and cut lines,
                          two concertina side walls, registration marks
    <id>-preview.png      an exploded preview for the gallery

Cut lines are solid red (#e2001a), fold lines dashed blue (#0057b8) — the
conventional papercraft key, so the sheets are readable by anyone who has built
one before.

    python imagelab/scripts/papercraft.py [--only ID] [--width-mm 150]
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BASE = Path(__file__).resolve().parent.parent
ROOT = BASE.parent
ANALYSIS = BASE / "data" / "analysis.json"
MANIFEST = BASE / "data" / "visionary.json"
OUT = BASE / "output" / "papercraft"

CUT = "#e2001a"
FOLD = "#0057b8"
GUIDE = "#9a9a9a"
MM = 3.7795275591            # px per mm at 96dpi, for SVG user units

TAB_MM = 12.0                # width of the fold-back tab on each side of a card
GAP_MM = 8.0                 # spacing between layers in the built object
MARGIN_MM = 10.0
SHEET_W_MM = 210.0           # A4 portrait; the sheet grows downward as needed


# ------------------------------------------------------------------ layers ---

def layer_alpha(size, regions, feather_px):
    """Alpha mask for one layer: the union of its region boxes, softened.

    Boxes rather than silhouettes, deliberately. The analysis proposes boxes, and
    a box is what you can actually cut with a craft knife and a steel rule; a
    traced silhouette would be prettier on screen and unbuildable on a kitchen
    table.
    """
    w, h = size
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    r = max(2, int(min(w, h) * 0.006))
    for reg in regions:
        x1, y1, x2, y2 = reg["px_box"]
        d.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=255)
    if feather_px > 0:
        m = m.filter(ImageFilter.GaussianBlur(feather_px))
        m = m.point(lambda v: 255 if v > 110 else 0)
    return m


def build_layers(img, regions, n_layers):
    """Card 0 is the whole page as ground; then one card per layer, deepest first.

    An earlier version used layer 0 itself as the ground plate, which silently
    dropped every region assigned to it — and after the ordering fix in analyze.py
    those are the deepest regions. Ground is now its own card.
    """
    w, h = img.size
    feather = max(1, int(min(w, h) * 0.002))
    out = []
    for slot in range(n_layers + 1):
        if slot == 0:
            card = img.convert("RGBA")
            occupancy = 1.0
            li = -1                       # the page itself, not a layer
        else:
            li = slot - 1
            regs = [r for r in regions if r["layer"] == li]
            if not regs:
                continue
            a = layer_alpha((w, h), regs, feather)
            card = img.convert("RGBA")
            card.putalpha(a)
            occupancy = float(np.asarray(a).mean() / 255.0)
        # Crop to content. A layer at 8% occupancy embedded full-page is ~12x more
        # bytes than it needs, and the SVG carries every layer as a data URI.
        if slot == 0:
            box = (0, 0, w, h)
        else:
            bb = card.getchannel("A").getbbox() or (0, 0, w, h)
            pad = max(2, int(min(w, h) * 0.004))
            box = (max(0, bb[0] - pad), max(0, bb[1] - pad),
                   min(w, bb[2] + pad), min(h, bb[3] + pad))
        out.append({"index": slot, "layer": li, "image": card.crop(box),
                    "occupancy": round(occupancy, 4),
                    "frac": [box[0] / w, box[1] / h, (box[2] - box[0]) / w, (box[3] - box[1]) / h],
                    "n_regions": 0 if slot == 0 else len([r for r in regions if r["layer"] == li])})
    return out


# --------------------------------------------------------------------- svg ---

def data_uri(im, max_w=780):
    """Embed as JPEG when fully opaque, quantised PNG when it carries a cut-out.

    The sheet has to stay printable *and* committable: an uncompressed RGBA page
    per layer put these files at 8 MB each, which is not a thing to put in a repo.
    """
    im = im.copy()
    if im.width > max_w:
        im = im.resize((max_w, max(1, int(im.height * max_w / im.width))), Image.LANCZOS)
    buf = io.BytesIO()
    alpha = im.getchannel("A") if im.mode == "RGBA" else None
    if alpha is None or alpha.getextrema()[0] == 255:
        im.convert("RGB").save(buf, "JPEG", quality=82, optimize=True)
        return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")
    q = im.convert("RGB").quantize(colors=128, method=Image.MEDIANCUT, dither=Image.NONE)
    q = q.convert("RGBA")
    q.putalpha(alpha)
    q.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def tunnel_svg(cid, title, layers, card_w_mm, aspect, meta):
    """One printable sheet: N cards with tabs, plus two concertina side walls."""
    card_h_mm = card_w_mm / aspect
    total_w_mm = card_w_mm + 2 * TAB_MM
    cols = max(1, int((SHEET_W_MM - 2 * MARGIN_MM) // (total_w_mm + 6)))
    rows = math.ceil(len(layers) / cols)

    wall_h_mm = card_h_mm
    wall_w_mm = GAP_MM * (len(layers) - 1) * 2 + 20
    sheet_h_mm = (MARGIN_MM * 2 + rows * (card_h_mm + 22) + wall_h_mm + 46)

    W, H = SHEET_W_MM * MM, sheet_h_mm * MM
    p = []
    p.append('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
             'width="%.1fmm" height="%.1fmm" viewBox="0 0 %.2f %.2f">' % (
                 SHEET_W_MM, sheet_h_mm, W, H))
    p.append('<rect width="%.2f" height="%.2f" fill="#ffffff"/>' % (W, H))
    p.append('<style>'
             '.t{font-family:Helvetica,Arial,sans-serif;font-size:%.1fpx;fill:#333}'
             '.s{font-family:Helvetica,Arial,sans-serif;font-size:%.1fpx;fill:#777}'
             '.cut{fill:none;stroke:%s;stroke-width:%.2f}'
             '.fold{fill:none;stroke:%s;stroke-width:%.2f;stroke-dasharray:%.1f %.1f}'
             '.g{fill:none;stroke:%s;stroke-width:.6}'
             '</style>' % (3.2 * MM, 2.4 * MM, CUT, 0.5 * MM, FOLD, 0.4 * MM,
                           2.2 * MM, 1.6 * MM, GUIDE))

    y = MARGIN_MM
    p.append('<text class="t" x="%.2f" y="%.2f">%s — paper tunnel book</text>'
             % (MARGIN_MM * MM, y * MM, esc(title)))
    y += 5
    p.append('<text class="s" x="%.2f" y="%.2f">%s</text>' % (MARGIN_MM * MM, y * MM, esc(meta)))
    y += 4
    pages = math.ceil(sheet_h_mm / 297.0)
    p.append('<text class="s" x="%.2f" y="%.2f">'
             'Red = cut. Blue dashed = fold. Sheet is %.0f x %.0f mm - A4 wide but '
             '%d A4 pages tall, so print tiled (Poster/Tile in the print dialog) or on a '
             'roll. Print at 100%%; any scaling and the tabs stop fitting the notches.</text>'
             % (MARGIN_MM * MM, y * MM, SHEET_W_MM, sheet_h_mm, pages))
    y += 4
    p.append('<text class="s" x="%.2f" y="%.2f">'
             'Cut each card, fold both tabs back 90 degrees, and slot the tabs into the '
             'matching notches on the two side walls, card 1 at the back.</text>'
             % (MARGIN_MM * MM, y * MM))
    y += 8

    for i, L in enumerate(layers):
        c, r = i % cols, i // cols
        x0 = MARGIN_MM + c * (total_w_mm + 6)
        y0 = y + r * (card_h_mm + 22)

        # artwork, positioned by the crop fraction so a cut-away layer still
        # lands where it belongs on the card
        fx, fy, fw, fh = L.get("frac", (0.0, 0.0, 1.0, 1.0))
        p.append('<image x="%.2f" y="%.2f" width="%.2f" height="%.2f" '
                 'xlink:href="%s" preserveAspectRatio="none"/>'
                 % ((x0 + TAB_MM + fx * card_w_mm) * MM, (y0 + fy * card_h_mm) * MM,
                    fw * card_w_mm * MM, fh * card_h_mm * MM,
                    data_uri(L["image"])))
        # outer cut: card + both tabs
        p.append('<rect class="cut" x="%.2f" y="%.2f" width="%.2f" height="%.2f"/>'
                 % (x0 * MM, y0 * MM, total_w_mm * MM, card_h_mm * MM))
        # fold lines where the tabs turn back
        for fx in (x0 + TAB_MM, x0 + TAB_MM + card_w_mm):
            p.append('<line class="fold" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>'
                     % (fx * MM, y0 * MM, fx * MM, (y0 + card_h_mm) * MM))
        # for cut-away layers, mark the windows so the knife has a guide
        if L["index"] > 0:
            p.append('<text class="s" x="%.2f" y="%.2f">card %d — cut away everything '
                     'outside the printed shapes (%d shape%s)</text>'
                     % ((x0) * MM, (y0 + card_h_mm + 4) * MM, L["index"] + 1,
                        L["n_regions"], "" if L["n_regions"] == 1 else "s"))
        else:
            p.append('<text class="s" x="%.2f" y="%.2f">card 1 — the back plate, '
                     'no cutting inside the border</text>'
                     % ((x0) * MM, (y0 + card_h_mm + 4) * MM))
        p.append('<text class="t" x="%.2f" y="%.2f">%d</text>'
                 % ((x0 + 2) * MM, (y0 + 6) * MM, L["index"] + 1))

    y = y + rows * (card_h_mm + 22) + 6
    p.append('<text class="t" x="%.2f" y="%.2f">Side walls — cut two, fold the '
             'concertina, notch where marked</text>' % (MARGIN_MM * MM, y * MM))
    y += 5

    for wi in range(2):
        wx = MARGIN_MM + wi * (wall_w_mm + 8)
        p.append('<rect class="cut" x="%.2f" y="%.2f" width="%.2f" height="%.2f"/>'
                 % (wx * MM, y * MM, wall_w_mm * MM, wall_h_mm * MM))
        # concertina folds, one pleat per gap between cards
        for k in range(1, 2 * (len(layers) - 1) + 1):
            fx = wx + k * GAP_MM
            if fx >= wx + wall_w_mm:
                break
            p.append('<line class="fold" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>'
                     % (fx * MM, y * MM, fx * MM, (y + wall_h_mm) * MM))
        # notches: one per card, at the valley folds
        for k in range(len(layers)):
            nx = wx + k * 2 * GAP_MM + 2
            if nx + 3 >= wx + wall_w_mm:
                break
            for ny in (y + wall_h_mm * 0.22, y + wall_h_mm * 0.72):
                p.append('<rect class="cut" x="%.2f" y="%.2f" width="%.2f" height="%.2f"/>'
                         % (nx * MM, ny * MM, 3.0 * MM, wall_h_mm * 0.06 * MM))
        p.append('<text class="s" x="%.2f" y="%.2f">wall %d</text>'
                 % ((wx + 1) * MM, (y + wall_h_mm + 4) * MM, wi + 1))

    p.append('</svg>')
    return "\n".join(p)


def preview(layers, card_w=360):
    """Exploded stack preview: the built object, seen from three-quarters."""
    n = len(layers)
    shear, dz = 0.30, 26
    W = int(card_w + shear * card_w + dz * n + 40)
    H = int(card_w / (layers[0]["image"].width / layers[0]["image"].height) + dz * n + 60)
    canvas = Image.new("RGBA", (W, H), (24, 22, 28, 255))
    base_ar = layers[0]["image"].width / layers[0]["image"].height
    full_h = int(card_w / base_ar)
    for i, L in enumerate(reversed(layers)):
        li = n - 1 - i
        fx, fy, fw, fh = L.get("frac", (0.0, 0.0, 1.0, 1.0))
        piece = L["image"].resize((max(1, int(card_w * fw)), max(1, int(full_h * fh))),
                                  Image.LANCZOS)
        im = Image.new("RGBA", (card_w, full_h), (0, 0, 0, 0))
        im.alpha_composite(piece, (int(card_w * fx), int(full_h * fy)))
        ch = full_h
        sheared = Image.new("RGBA", (int(card_w + shear * ch), ch), (0, 0, 0, 0))
        for row in range(ch):
            off = int(shear * (ch - row))
            sheared.paste(im.crop((0, row, card_w, row + 1)), (off, row))
        x = 20 + dz * (n - 1 - li)
        yy = 20 + dz * li
        canvas.alpha_composite(sheared, (x, yy))
    return canvas.convert("RGB")


# -------------------------------------------------------------------- main ---

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--width-mm", type=float, default=120.0)
    args = ap.parse_args()

    A = json.load(io.open(ANALYSIS, encoding="utf-8"))
    M = {r["id"]: r for r in json.load(io.open(MANIFEST, encoding="utf-8"))["images"]}
    OUT.mkdir(parents=True, exist_ok=True)
    n_layers = A["n_layers"]
    index = []

    for rec in A["images"]:
        cid = rec["id"]
        if args.only and args.only != cid:
            continue
        src = ROOT / M[cid]["file"]
        img = Image.open(src).convert("RGB")
        if img.width > 1400:
            img = img.resize((1400, int(img.height * 1400 / img.width)), Image.LANCZOS)
        w, h = img.size
        # analysis boxes are in WORK_W space; rescale to this image
        sx, sy = w / rec["work_size"][0], h / rec["work_size"][1]
        regions = []
        for r in rec["regions"]:
            x1, y1, x2, y2 = r["box"]
            regions.append({**r, "px_box": [int(x1 * sx), int(y1 * sy),
                                            int(x2 * sx), int(y2 * sy)]})
        if not regions:
            print("  skip %s (no regions)" % cid)
            continue

        layers = build_layers(img, regions, n_layers)
        d = OUT / cid
        d.mkdir(parents=True, exist_ok=True)
        # Layer plates for the gallery's interactive viewer. The back plate is
        # opaque, so it ships as a JPEG; the cut-away layers need alpha, so they
        # ship as quantised PNG. Full-fidelity RGBA here cost 122 MB across the
        # corpus, which is not a thing to put in a repo.
        for L in layers:
            im = L["image"]
            if im.width > 700:
                im = im.resize((700, max(1, int(im.height * 700 / im.width))), Image.LANCZOS)
            a = im.getchannel("A") if im.mode == "RGBA" else None
            if a is None or a.getextrema()[0] == 255:
                im.convert("RGB").save(d / ("layer%d.jpg" % L["index"]),
                                       quality=84, optimize=True)
                L["plate"] = "layer%d.jpg" % L["index"]
            else:
                q = im.convert("RGB").quantize(colors=128, method=Image.MEDIANCUT,
                                               dither=Image.NONE).convert("RGBA")
                q.putalpha(a)
                q.save(d / ("layer%d.png" % L["index"]), optimize=True)
                L["plate"] = "layer%d.png" % L["index"]

        prov = M[cid]["provenance"]
        meta = " · ".join(x for x in [prov.get("institution"), prov.get("date"),
                                      M[cid]["rights"].get("licence")] if x)[:150]
        svg = tunnel_svg(cid, cid.replace("-", " "), layers, args.width_mm, w / h, meta)
        (d / "tunnel.svg").write_text(svg, encoding="utf-8")

        pv = preview(layers)
        pv.save(d / "preview.jpg", quality=88, optimize=True)

        index.append({
            "id": cid, "tradition": rec["tradition"], "n_layers": len(layers),
            "card_w_mm": args.width_mm,
            "layers": [{"index": L["index"], "occupancy": L["occupancy"],
                        "n_regions": L["n_regions"], "layer": L["layer"],
                        "frac": [round(v, 5) for v in L["frac"]],
                        "file": "imagelab/output/papercraft/%s/%s" % (cid, L["plate"])}
                       for L in layers],
            "svg": "imagelab/output/papercraft/%s/tunnel.svg" % cid,
            "preview": "imagelab/output/papercraft/%s/preview.jpg" % cid,
            "svg_kb": round((d / "tunnel.svg").stat().st_size / 1024, 1),
        })
        print("  %-24s %d cards  svg %5.0f KB  occupancy %s" % (
            cid, len(layers), index[-1]["svg_kb"],
            " ".join("%.2f" % L["occupancy"] for L in layers)))

    if not args.only:
        with io.open(BASE / "data" / "papercraft.json", "w", encoding="utf-8") as f:
            json.dump({"_note": "Printable tunnel-book sheets generated by "
                                "imagelab/scripts/papercraft.py from analysis.json layers.",
                       "cut_colour": CUT, "fold_colour": FOLD,
                       "sheets": index}, f, ensure_ascii=False, indent=2)
        print("\n%d sheets -> imagelab/data/papercraft.json" % len(index))
    return 0


if __name__ == "__main__":
    sys.exit(main())
