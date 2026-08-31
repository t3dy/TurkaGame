"""build_gallery.py — an image-study site from images.json + regions.json + cut output.

Builds to imagelab/site/, which is gitignored along with the cutouts: every plate on
these pages is derived from a source whose rights are unresolved (FOUNDER.md §5), so the
site is a local research tool until that is settled. Promoting it to site/imagelab/ is a
one-line change to OUT once the sources are cleared.

    python imagelab/scripts/build_gallery.py
"""

from __future__ import annotations

import html
import json
import shutil
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SRC = BASE.parent / "research inbox" / "images"
CUTS = BASE / "output"
OUT = BASE / "site"

KIND_ORDER = ["scene", "figure", "face", "object", "architecture", "ornament", "text"]
KIND_LABEL = {"scene": "Scenes", "figure": "Figures", "face": "Heads", "object": "Objects",
              "architecture": "Architecture", "ornament": "Ornament", "text": "Text"}

RIGHTS_TONE = {"UNKNOWN": "bad", "BLOCKED": "bad", "NEEDS_VERIFICATION": "warn", "CLEARED": "ok"}

CSS = """
:root{--parchment:#f4ecd9;--deep:#e9dcc0;--ink:#2b2118;--faint:#7a6a56;
  --lapis:#1f4d8f;--vermillion:#9b2c1f;--gold:#a8842c;--verdigris:#3e6b5a;--line:#c9b992;}
@media (prefers-color-scheme:dark){:root{--parchment:#171310;--deep:#211b16;--ink:#e8dcc4;
  --faint:#8f8270;--lapis:#5b8bd0;--vermillion:#d0584a;--gold:#c9a648;--verdigris:#6fa08c;--line:#3a3128;}}
*{box-sizing:border-box}
body{margin:0;background:var(--parchment);color:var(--ink);
  font:16px/1.65 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;}
a{color:inherit}
.wrap{max-width:1080px;margin:0 auto;padding:0 28px 96px}
header.top{border-bottom:1px solid var(--line);margin-bottom:38px;padding:44px 0 26px}
.kicker{font:600 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.20em;
  text-transform:uppercase;color:var(--gold);margin-bottom:14px}
h1{font-size:34px;line-height:1.2;margin:0 0 10px;font-weight:600;letter-spacing:-.01em}
h2{font-size:15px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;
  color:var(--faint);margin:44px 0 16px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.lede{color:var(--faint);max-width:66ch;margin:0}
.back{font:600 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.16em;
  text-transform:uppercase;color:var(--faint);text-decoration:none;display:inline-block;margin-bottom:26px}
.back:hover{color:var(--lapis)}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:26px}
.card{border:1px solid var(--line);background:var(--deep);text-decoration:none;
  display:flex;flex-direction:column;overflow:hidden;transition:transform .16s,box-shadow .16s}
.card:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(0,0,0,.16)}
.card .thumb{aspect-ratio:4/5;overflow:hidden;background:var(--parchment)}
.card .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.card .body{padding:16px 18px 20px}
.card h3{margin:0 0 6px;font-size:18px;font-weight:600;line-height:1.25}
.card p{margin:0;font-size:13.5px;color:var(--faint);line-height:1.5}

.plate{border:1px solid var(--line);background:var(--deep);padding:14px;margin:0 0 10px;
  display:flex;justify-content:center}
/* tall folios (the Akhlati sheet is 640x1067) otherwise fill several screens and push
   every word of the research below the fold */
.plate img{max-width:100%;max-height:76vh;width:auto;height:auto;display:block}
figcaption{font-size:12.5px;color:var(--faint);margin-bottom:34px}

.cols{display:grid;grid-template-columns:1fr 1fr;gap:34px}
@media(max-width:820px){.cols{grid-template-columns:1fr}}
dl.meta{margin:0;font-size:14px}
dl.meta div{display:flex;gap:12px;padding:7px 0;border-bottom:1px solid var(--line)}
dl.meta dt{flex:0 0 116px;color:var(--faint);font:600 11px/1.5 ui-sans-serif,system-ui,sans-serif;
  letter-spacing:.10em;text-transform:uppercase;padding-top:2px}
dl.meta dd{margin:0;flex:1}

.rights{border-left:3px solid var(--line);padding:12px 16px;background:var(--deep);font-size:14px}
.rights.bad{border-left-color:var(--vermillion)}
.rights.warn{border-left-color:var(--gold)}
.rights.ok{border-left-color:var(--verdigris)}
.rights .tag{font:600 10px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;
  text-transform:uppercase;display:inline-block;margin-bottom:8px}
.rights.bad .tag{color:var(--vermillion)}
.rights.warn .tag{color:var(--gold)}
.rights.ok .tag{color:var(--verdigris)}

ul.icon{margin:0;padding-left:20px}
ul.icon li{margin-bottom:12px;max-width:70ch}

.claim{border-left:2px solid var(--line);padding:2px 0 2px 16px;margin-bottom:20px;max-width:72ch}
.claim .src{display:block;margin-top:5px;font-size:12.5px;color:var(--faint);font-style:italic}
.claim .kind{font:600 9.5px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.13em;
  text-transform:uppercase;padding:3px 7px;border:1px solid var(--line);margin-right:8px;
  vertical-align:2px;color:var(--faint)}
.claim.grounded{border-left-color:var(--verdigris)}
.claim.inference{border-left-color:var(--gold)}
.claim.curatorial{border-left-color:var(--lapis)}
.claim.negative-result{border-left-color:var(--vermillion)}

.swatches{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.sw{width:56px}
.sw i{display:block;height:44px;border:1px solid var(--line)}
.sw span{font:11px/1.6 ui-monospace,monospace;color:var(--faint)}

.regions{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:14px}
.rg{border:1px solid var(--line);background:var(--deep);padding:8px}
.rg img{width:100%;display:block;background:var(--parchment)}
.rg b{display:block;font-size:12px;font-weight:600;margin-top:7px;line-height:1.35}
.rg em{display:block;font-size:11px;color:var(--faint);font-style:normal}
.pill{display:inline-block;font:600 10px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.1em;
  text-transform:uppercase;color:var(--faint);border:1px solid var(--line);padding:4px 8px;
  margin:0 6px 6px 0;text-decoration:none}
.pill:hover{color:var(--lapis);border-color:var(--lapis)}
footer{margin-top:60px;padding-top:20px;border-top:1px solid var(--line);
  font-size:12.5px;color:var(--faint)}
"""


def e(s):
    return html.escape(str(s if s is not None else ""))


def page(title, body, depth=0):
    up = "../" * depth
    return (f"<!doctype html><html lang=en><head><meta charset=utf-8>"
            f"<meta name=viewport content='width=device-width,initial-scale=1'>"
            f"<title>{e(title)}</title><link rel=stylesheet href='{up}style.css'></head>"
            f"<body><div class=wrap>{body}</div></body></html>")


def build():
    images = json.load(open(BASE / "data" / "images.json", encoding="utf-8"))["images"]
    regions = {i["id"]: i for i in json.load(open(BASE / "data" / "regions.json", encoding="utf-8"))["images"]}
    cut_index = json.load(open(CUTS / "index.json", encoding="utf-8")) if (CUTS / "index.json").exists() else []
    cuts = {}
    for r in cut_index:
        cuts.setdefault(r["image"], {})[r["region"]] = r

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "plates").mkdir(exist_ok=True)
    (OUT / "style.css").write_text(CSS, encoding="utf-8")

    # ---- copy full plates and the cut regions we reference ----
    for img in images:
        src = SRC / img["file"]
        if src.exists():
            shutil.copy2(src, OUT / "plates" / f"{img['id']}{src.suffix}")
            img["_plate"] = f"plates/{img['id']}{src.suffix}"
    if CUTS.exists():
        dst = OUT / "regions"
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(CUTS, dst, ignore=shutil.ignore_patterns("_*", "index.json", "portraits"))

    # ---- index ----
    cards = []
    for img in images:
        thumb = img.get("_plate", "")
        cards.append(
            f"<a class=card href='{img['id']}.html'>"
            f"<div class=thumb><img loading=lazy src='{e(thumb)}' alt=''></div>"
            f"<div class=body><h3>{e(img['short_title'])}</h3>"
            f"<p>{e(img['provenance'].get('date') or '')}"
            f"{' · ' + e(img['provenance']['institution']) if img['provenance'].get('institution') else ''}</p>"
            f"</div></a>")

    n_reg = sum(len(regions.get(i["id"], {}).get("regions", [])) for i in images)
    body = (
        "<header class=top><div class=kicker>TurkaGame · Image Study</div>"
        "<h1>Four Illustrations</h1>"
        "<p class=lede>The visual sources for the Ibn Turka game and knowledge portal, "
        "read closely and checked against the scholarship. Each plate is broken into reusable "
        "elements; each claim carries its citation or is marked as inference.</p></header>"
        f"<div class=grid>{''.join(cards)}</div>"
        f"<footer>{len(images)} plates · {n_reg} catalogued regions · "
        "palettes measured by k-means over the painting area. "
        "Rights are unresolved for every source here — see FOUNDER.md §5.</footer>")
    (OUT / "index.html").write_text(page("Image Study — TurkaGame", body), encoding="utf-8")

    # ---- one page per image ----
    for img in images:
        p, r = img["provenance"], img["rights"]

        meta_rows = [("Title", img["title"])]
        for k, lbl in (("work", "In"), ("artist", "Artist"), ("date", "Date"), ("place", "Place"),
                       ("institution", "Institution"), ("shelfmark", "Shelfmark"), ("folio", "Folio")):
            if p.get(k):
                meta_rows.append((lbl, p[k]))
        meta_rows.append(("Dimensions", f"{img['dimensions'][0]} × {img['dimensions'][1]} px"))
        meta = "".join(f"<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>" for a, b in meta_rows)

        tone = RIGHTS_TONE.get(r["status"], "warn")
        rights = (f"<div class='rights {tone}'><span class=tag>Rights · {e(r['status'].replace('_',' '))}</span>"
                  f"<div>{e(r['blocker'])}</div>"
                  f"<div style='margin-top:8px;color:var(--faint)'>Usable as: {e(r['usable_as'])}</div></div>")

        prov_note = f"<p class=lede style='margin-top:16px'>{e(p['note'])}</p>" if p.get("note") else ""

        icon = "".join(f"<li>{e(x)}</li>" for x in img.get("iconography", []))
        claims = "".join(
            f"<div class='claim {e(c['kind'])}'><span class=kind>{e(c['kind'].replace('-',' '))}</span>"
            f"{e(c['claim'])}<span class=src>{e(c['source'])}</span></div>"
            for c in img.get("research", []))

        pal = img.get("palette", {})
        sw = "".join(f"<div class=sw><i style='background:{e(c)}'></i><span>{e(c)}</span></div>"
                     for c in pal.get("dominant", []) + pal.get("accents", []))
        sat = pal.get("max_saturation")
        sat_note = (f"<p class=lede style='font-size:14px'>Peak saturation "
                    f"<b>{sat}</b> — measured over the painting area, not the margins.</p>") if sat else ""

        links = "".join(
            f"<a class=pill href='../../site/portal/{kind}/{s}.html'>{e(s.replace('-',' '))}</a>"
            for s in img.get("portal_links", [])
            for kind in [_portal_kind(s)])

        # region gallery, grouped by kind
        by_kind = {}
        for rg in regions.get(img["id"], {}).get("regions", []):
            by_kind.setdefault(rg["kind"], []).append(rg)
        blocks = []
        for k in KIND_ORDER:
            if k not in by_kind:
                continue
            tiles = []
            for rg in by_kind[k]:
                rec = cuts.get(img["id"], {}).get(rg["id"], {})
                path = rec.get("matte") or rec.get("rect") or ""
                note = ""
                if "matte" in rec:
                    note = f"cutout · kept {rec.get('matte_kept', 0):.0%}"
                tiles.append(
                    f"<div class=rg><img loading=lazy src='regions/{e(path)}' alt=''>"
                    f"<b>{e(rg['label'])}</b><em>{e(note or rg['kind'])}</em></div>")
            blocks.append(f"<h2>{e(KIND_LABEL.get(k, k))}</h2><div class=regions>{''.join(tiles)}</div>")

        gu = "".join(f"<li>{e(x)}</li>" for x in img.get("game_use", []))

        body = (
            "<header class=top><a class=back href='index.html'>← All plates</a>"
            f"<div class=kicker>{e(p.get('place') or 'Image study')}</div>"
            f"<h1>{e(img['title'])}</h1></header>"
            f"<figure class=plate><img src='{e(img.get('_plate',''))}' alt=''></figure>"
            f"<figcaption>{e(img['file'])}</figcaption>"
            "<div class=cols>"
            f"<div><h2>Record</h2><dl class=meta>{meta}</dl>{prov_note}</div>"
            f"<div><h2>Rights</h2>{rights}"
            f"<h2>Palette</h2><div class=swatches>{sw}</div>{sat_note}</div>"
            "</div>"
            f"<h2>Description</h2><p style='max-width:72ch'>{e(img['description'])}</p>"
            f"<h2>Iconography</h2><ul class=icon>{icon}</ul>"
            f"<h2>What the scholarship says</h2>{claims}"
            f"<h2>Use in the game</h2><ul class=icon>{gu}</ul>"
            f"<h2>Portal entries</h2><div>{links}</div>"
            + "".join(blocks) +
            "<footer>Regions cut by imagelab/scripts/cut_regions.py. "
            "Cutouts marked with a kept-percentage are GrabCut mattes; low percentages mean the "
            "algorithm could not separate figure from ground, which is normal for dense "
            "miniature painting.</footer>")
        (OUT / f"{img['id']}.html").write_text(page(img["title"], body), encoding="utf-8")

    print(f"gallery: {len(images)} plates, {n_reg} regions -> {OUT}")
    return 0


_FIGURES = {"ibn-turka", "qazizada-rumi", "sharaf-al-din-yazdi", "sayyid-husayn-akhlati", "ulugh-beg"}
_INSTITUTIONS = {"isfahan-circle", "new-brethren-purity", "samarkand-observatory"}


def _portal_kind(slug: str) -> str:
    if slug in _FIGURES:
        return "figures"
    if slug in _INSTITUTIONS:
        return "institutions"
    return "concepts"


if __name__ == "__main__":
    raise SystemExit(build())
