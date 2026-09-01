"""
build_site.py — generate the Ibn Turka Knowledge Portal from db/turka.db plus the
markdown essays in essays/.

This portal is *dedicated to Ibn Turka*. Where the sibling IslamicateOccultPortal
carries general articles on the Islamicate occult sciences, this one carries
Turka-specific entries and, at its centre, the **Intersections** — articles on how
Ibn Turka meets each of those general contexts.

Output: site/portal/  (inside TurkaGame's published site directory, so the URL is
/TurkaGame/site/portal/ and relative links back to the landing page just work).

Run:  python portal/scripts/build_site.py
"""

import html
import json
import re
import sqlite3
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent          # portal/
REPO = BASE.parent                                      # TurkaGame/
DB = BASE / "db" / "turka.db"
ESSAYS = BASE / "essays"
OUT = REPO / "site" / "portal"

NAV = [
    ("Portal home", "index.html"),
    ("Intersections", "intersections/index.html"),
    ("Figures", "figures/index.html"),
    ("Concepts", "concepts/index.html"),
    ("Texts", "texts/index.html"),
    ("Institutions", "institutions/index.html"),
    ("Chronology", "chronology.html"),
    ("Scholarship", "scholarship.html"),
]

CSS = """/* Ibn Turka Knowledge Portal — the manuscript palette shared with the games. */
:root{--parchment:#f4ecd9;--deep:#e9dcc0;--ink:#2b2118;--faint:#7a6a56;
      --lapis:#1f4d8f;--vermillion:#9b2c1f;--gold:#a8842c;--verdigris:#3e6b5a;--line:#c9b992;}
@media (prefers-color-scheme:dark){:root{--parchment:#171310;--deep:#211b16;--ink:#e8dcc4;
      --faint:#8f8270;--lapis:#5b8bd0;--vermillion:#d0584a;--gold:#c9a648;--verdigris:#6fa08c;--line:#3a3128;}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--parchment);color:var(--ink);font-family:'EB Garamond',Georgia,serif;
     line-height:1.65;font-size:18px}
.wrap{max-width:52rem;margin:0 auto;padding:2rem 1.3rem 5rem}
a{color:var(--lapis)}
header.site{border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:2rem}
.brand{font-size:1.45rem;font-weight:600}
.brand a{color:inherit;text-decoration:none}
.tagline{color:var(--faint);font-style:italic;font-size:.92rem}
nav.site{display:flex;flex-wrap:wrap;gap:.4rem 1.1rem;margin-top:.8rem;font-size:.9rem}
nav.site a{text-decoration:none}
nav.site a:hover{text-decoration:underline}
.rubric{font-variant:small-caps;letter-spacing:.14em;color:var(--vermillion);
        text-align:center;font-size:.82rem;margin:2.2rem 0 1.1rem;display:flex;align-items:center;gap:.8rem}
.rubric::before,.rubric::after{content:'';flex:1;border-top:1px solid var(--line)}
h1{font-size:1.9rem;font-weight:600;line-height:1.25;margin-bottom:.3rem}
h2{font-size:1.3rem;font-weight:600;margin:1.8rem 0 .6rem;color:var(--vermillion)}
h3{font-size:1.05rem;font-weight:600;margin:1.2rem 0 .4rem}
p{margin-bottom:.9rem}
ul,ol{margin:0 0 .9rem 1.3rem}
li{margin-bottom:.3rem}
.sub{color:var(--faint);font-style:italic;margin-bottom:1.4rem}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:.9rem}
.card{border:1px solid var(--line);border-left:3px solid var(--lapis);border-radius:2px;
      background:var(--deep);padding:.85rem 1rem}
.card.intersection{border-left-color:var(--gold)}
.card h3{margin:0 0 .25rem}
.card h3 a{text-decoration:none}
.card p{font-size:.88rem;color:var(--ink);margin:0}
.card .meta{font-size:.76rem;color:var(--faint);font-variant:small-caps;letter-spacing:.05em;margin-top:.35rem}
.entry{background:var(--deep);border:1px solid var(--line);border-radius:3px;padding:1.6rem 1.8rem;margin-bottom:1.4rem}
.field{display:grid;grid-template-columns:9rem 1fr;gap:.2rem 1rem;font-size:.92rem;margin-bottom:1.2rem}
.field dt{color:var(--faint);font-variant:small-caps;letter-spacing:.05em}
blockquote{border-left:3px solid var(--gold);padding-left:1rem;margin:0 0 .9rem;font-style:italic;color:var(--faint)}
code{background:rgba(0,0,0,.06);padding:0 .25rem;border-radius:2px;font-size:.9em}
.tag{display:inline-block;font-size:.72rem;font-variant:small-caps;letter-spacing:.06em;
     border:1px solid var(--line);border-radius:2px;padding:0 .45rem;margin:0 .25rem .25rem 0;color:var(--faint)}
.sections{margin:18px 0 0;border-left:2px solid var(--line);padding-left:18px}
.sec-lead{font:600 10.5px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin:0 0 12px}
.sec{margin-bottom:16px}
.sec h4{font-size:15px;font-weight:600;margin:0 0 5px}
.tl-year{font:600 12px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:0 0 6px}
.tl-event{border-left:2px solid var(--line);padding-left:16px}
.tl-links .tag{font-size:11px;margin-right:6px}
.back{font-size:.85rem}
footer.site{margin-top:3rem;padding-top:1rem;border-top:1px solid var(--line);
            color:var(--faint);font-size:.8rem;font-style:italic;text-align:center}
.lede{font-size:1.05rem}
@media (max-width:640px){.field{grid-template-columns:1fr}.field dt{margin-top:.5rem}}
"""

E = lambda s: html.escape(str(s if s is not None else ""))


def inline(s):
    """Escape, then apply inline emphasis only - for short fields (cards, blurbs)
    that are not full markdown bodies but may still carry bold/italic markers."""
    t = E(s).replace(chr(10), " ")
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<em>\1</em>", t)
    return t


def page(title, body, depth=0, subtitle=None):
    up = "../" * depth
    nav = " · ".join(f'<a href="{up}{href}">{E(label)}</a>' for label, href in NAV)
    return f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)} — Ibn Turka Portal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{up}style.css">
</head><body><div class="wrap">
<header class="site">
  <div class="brand"><a href="{up}index.html">The Ibn Turka Knowledge Portal</a></div>
  <div class="tagline">{E(subtitle or "Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī (1369–1432) and the occult sciences of his world")}</div>
  <nav class="site">{nav}</nav>
</header>
{body}
<footer class="site">
  Built on the scholarship of Matthew Melvin-Koushki · part of the
  <a href="{up}../index.html">TurkaGame</a> project ·
  general Islamicate context lives in the sibling IslamicateOccultPortal
</footer>
</div></body></html>
"""


def md(text):
    """A deliberately small markdown subset: headings, bold, italic, lists, quotes.

    Wrapped lines inside a paragraph are joined first, so emphasis that spans a
    line break in the source still renders (it did not, before this pass).
    """
    joined, buf = [], []

    def flush():
        if buf:
            joined.append(" ".join(buf))
            buf.clear()

    for raw in text.split("\n"):
        line = raw.rstrip()
        stripped = line.lstrip()
        if not stripped:
            flush()
            joined.append("")
        elif line.startswith("#") or stripped.startswith(("- ", "* ", "> ")):
            flush()
            joined.append(line)
        else:
            buf.append(stripped)
    flush()
    text = "\n".join(joined)

    out, in_list = [], False
    for raw in text.split("\n"):
        line = raw.rstrip()
        if not line.strip():
            if in_list:
                out.append("</ul>")
                in_list = False
            continue
        esc = E(line.strip())
        esc = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", esc)
        esc = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<em>\1</em>", esc)
        esc = re.sub(r"`(.+?)`", r"<code>\1</code>", esc)
        if line.startswith("### "):
            out.append(f"<h3>{esc[4:]}</h3>")
        elif line.startswith("## "):
            out.append(f"<h2>{esc[3:]}</h2>")
        elif line.startswith("# "):
            out.append(f"<h1>{esc[2:]}</h1>")
        elif line.lstrip().startswith(("- ", "* ")):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{esc[2:].lstrip('-* ')}</li>")
        elif line.startswith("> "):
            out.append(f"<blockquote>{esc[2:]}</blockquote>")
        else:
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<p>{esc}</p>")
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def read_essays():
    essays = []
    for path in sorted(ESSAYS.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        meta = {}
        if text.startswith("---"):
            _, fm, text = text.split("---", 2)
            for line in fm.strip().split("\n"):
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip().strip('"')
        meta.setdefault("slug", path.stem)
        meta.setdefault("title", path.stem.replace("_", " ").title())
        meta.setdefault("kind", "essay")
        meta.setdefault("order", "99")
        meta["body"] = text.strip()
        essays.append(meta)
    return essays


def rows(conn, table):
    try:
        cur = conn.execute(f"SELECT * FROM {table}")
    except sqlite3.Error:
        return []
    cols = [d[0] for d in cur.description]
    return [dict(zip(cols, r)) for r in cur.fetchall()]


def write(rel, content):
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def entry_page(kind, item, name_key, depth=2):
    title = item.get(name_key) or item.get("slug")
    skip = {"body", "card", "slug", name_key, "id"}
    fields = "".join(
        f"<dt>{E(k.replace('_',' '))}</dt><dd>{E(v)}</dd>"
        for k, v in item.items()
        if k not in skip and v not in (None, "", 0, "[]")
    )
    tags = ""
    raw_tags = item.get("tags")
    if raw_tags:
        parts = [t.strip(' "[]') for t in str(raw_tags).split(",") if t.strip(' "[]')]
        tags = "".join(f'<span class="tag">{E(t)}</span>' for t in parts)
    body = f"""
<p class="back"><a href="index.html">← all {E(kind)}</a></p>
<h1>{E(title)}</h1>
{f'<p class="sub">{inline(item.get("card"))}</p>' if item.get("card") else ""}
{tags}
<div class="entry">{md(item.get("body") or "*No entry body yet.*")}</div>
{f'<dl class="field">{fields}</dl>' if fields else ""}
"""
    return page(title, body, depth=depth)


def main():
    conn = sqlite3.connect(DB)
    figures = rows(conn, "figures")
    concepts = rows(conn, "concepts")
    texts = rows(conn, "texts")
    institutions = rows(conn, "institutions")
    biblio = rows(conn, "bibliography")
    timeline = rows(conn, "timeline_events")
    conn.close()
    essays = read_essays()
    intersections = [e for e in essays if e.get("kind") == "intersection"]
    syntheses = [e for e in essays if e.get("kind") != "intersection"]
    intersections.sort(key=lambda e: int(e.get("order", 99)))

    if OUT.exists():
        for p in sorted(OUT.rglob("*"), reverse=True):
            (p.unlink() if p.is_file() else p.rmdir())
    write("style.css", CSS)

    # ---- home -------------------------------------------------------------
    def card(href, title, blurb, meta="", cls=""):
        return (f'<div class="card {cls}"><h3><a href="{href}">{E(title)}</a></h3>'
                f'<p>{inline(blurb)}</p>{f"<div class=meta>{inline(meta)}</div>" if meta else ""}</div>')

    top = "".join(card(f"intersections/{e['slug']}.html", e["title"],
                       e.get("subtitle", ""), e.get("context", ""), "intersection")
                  for e in intersections[:6])
    counts = (f"{len(figures)} figures · {len(concepts)} concepts · {len(texts)} texts · "
              f"{len(institutions)} institutions · {len(biblio)} sources")
    home = f"""
<h1>The Ibn Turka Knowledge Portal</h1>
<p class="sub lede">A research portal dedicated to Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī —
Chief Judge of Isfahan, and the most systematic occult philosopher of Timurid Iran.</p>
<p>This portal asks one question in many forms: <em>where does Ibn Turka meet the wider
world of Islamicate occult science, and what changes when he does?</em> The
<strong>Intersections</strong> below are its centre — each takes a general context and
follows Ibn Turka into it. Entries for the figures, concepts, texts and institutions
around him fill in the rest.</p>
<div class="rubric">INTERSECTIONS</div>
<div class="cards">{top}</div>
<div class="rubric">THE ENTRIES</div>
<div class="cards">
{card("figures/index.html", "Figures", "The people around him — masters, collaborators, patrons, rivals.", f"{len(figures)} entries")}
{card("concepts/index.html", "Concepts", "Lettrism, the divine names, the imaginal realm, the Quintet.", f"{len(concepts)} entries")}
{card("texts/index.html", "Texts", "The Investigations and the works around it.", f"{len(texts)} entries")}
{card("institutions/index.html", "Institutions", "The circles and courts he moved through.", f"{len(institutions)} entries")}
{card("chronology.html", "Chronology", "Ibn Turka’s life and its context, dated — from Melvin-Koushki’s own chronology of the sources.", f"{len(timeline)} events")}
{card("scholarship.html", "Scholarship", "The secondary literature this portal is built on.", f"{len(biblio)} sources")}
</div>
<div class="rubric">SYNTHESIS ESSAYS</div>
<div class="cards">{''.join(card(f"intersections/{e['slug']}.html", e['title'], e.get('subtitle',''), '') for e in syntheses)}</div>
<p class="sub" style="margin-top:2rem">{E(counts)}. Entries are research notes, not
finished scholarship; claims follow the project's grounding conventions.</p>
"""
    write("index.html", page("Home", home, depth=0))

    # ---- intersections + essays ------------------------------------------
    idx = "".join(card(f"{e['slug']}.html", e["title"], e.get("subtitle", ""),
                       e.get("context", ""), "intersection") for e in intersections)
    idx2 = "".join(card(f"{e['slug']}.html", e["title"], e.get("subtitle", ""), "")
                   for e in syntheses)
    write("intersections/index.html", page("Intersections", f"""
<h1>Intersections</h1>
<p class="sub lede">Each article takes one general context from the wider Islamicate
occult world and follows Ibn Turka into it — what he inherited, what he changed, and
what the sources will not tell us.</p>
<div class="cards">{idx}</div>
<div class="rubric">SYNTHESIS ESSAYS</div>
<div class="cards">{idx2}</div>
""", depth=1))
    for e in essays:
        write(f"intersections/{e['slug']}.html", page(e["title"], f"""
<p class="back"><a href="index.html">← all intersections</a></p>
{f'<div class="rubric">{E(e.get("context",""))}</div>' if e.get("context") else ""}
{md(e["body"])}
""", depth=1))

    # ---- entity sections --------------------------------------------------
    for kind, items, name_key, blurbkey in [
        ("figures", figures, "name", "role"),
        ("concepts", concepts, "name", "literal_meaning"),
        ("texts", texts, "title", "title_translated"),
        ("institutions", institutions, "name", "type"),
    ]:
        items = [i for i in items if i.get("slug")]
        listing = "".join(
            card(f"{i['slug']}.html", i.get(name_key) or i["slug"],
                 i.get("card") or i.get(blurbkey) or "",
                 i.get("relation_to_turka") or i.get("category") or "")
            for i in sorted(items, key=lambda x: str(x.get(name_key) or "")))
        write(f"{kind}/index.html", page(kind.title(), f"""
<h1>{kind.title()}</h1>
<p class="sub">{len(items)} entries.</p>
<div class="cards">{listing}</div>
""", depth=1))
        for i in items:
            write(f"{kind}/{i['slug']}.html", entry_page(kind, i, name_key, depth=1))


    # ---- chronology -------------------------------------------------------
    def yr(ev):
        y1, y2 = ev.get("year_start"), ev.get("year_end")
        ce = f"{y1}–{y2}" if y2 and y2 != y1 else str(y1 or "")
        h = ev.get("hijri_date")
        return f"{h}/{ce}" if h else ce

    tl = sorted(timeline, key=lambda e: (e.get("year_start") or 0, e.get("title") or ""))
    events_html = ""
    for ev in tl:
        figs = json.loads(ev.get("figures_involved") or "[]")
        links = " ".join(f'<a class="tag" href="figures/{E(f)}.html">{E(f.replace("-"," "))}</a>'
                         for f in figs)
        events_html += f"""<div class="entry tl-event">
<p class="tl-year">{E(yr(ev))}{f' · {E(ev.get("place"))}' if ev.get("place") else ''}</p>
<h3>{E(ev.get("title"))}</h3>
<p class="sub">{E(ev.get("category"))} · {E(ev.get("grounding"))} · {E(ev.get("date_precision"))}</p>
{md(ev.get("card") or "")}
{f'<p class="tl-links">{links}</p>' if links else ''}
</div>"""

    write("chronology.html", page("Chronology", f"""
<h1>Chronology</h1>
<p class="sub lede">{len(tl)} dated events in Ibn Turka’s life and its immediate
context, taken from the chronology Melvin-Koushki assembles in the addenda to
<em>The Quest for a Universal Science</em> (33–36). He notes there that, given the
sparseness of the record, some dates are conjectured or approximate; most rest on the
colophons of MS Majlis 10196 and on the two collections of letters, the
<em>Munshaʾāt-i Turka</em> and the <em>Munshaʾāt-i Yazdī</em>.</p>
{events_html}
""", depth=0))

    # ---- scholarship ------------------------------------------------------
    def sections_html(b):
        try:
            secs = json.loads(b.get("sections") or "[]")
        except Exception:
            secs = []
        if not secs:
            return ""
        items = "".join(f'<div class="sec"><h4>{E(x.get("heading"))}</h4>{md(x.get("summary") or "")}</div>'
                        for x in secs)
        return f'<div class="sections"><p class="sec-lead">Section by section</p>{items}</div>'

    lit = "".join(f"""<div class="entry">
<h3>{E(b.get('title'))}</h3>
<p class="sub">{E(b.get('author'))}{f" · {E(b.get('year'))}" if b.get('year') else ""}
{f" · {E(b.get('pub_type'))}" if b.get('pub_type') else ""}
{f" · {E(b.get('page_count'))} pp." if b.get('page_count') else ""}</p>
{md(b.get('card') or '')}
{md(b.get('body') or '')}
{sections_html(b)}
{f'<p class="back"><a href="{E(b.get("online_url"))}">source →</a></p>' if b.get('online_url') else ''}
</div>""" for b in biblio)
    write("scholarship.html", page("Scholarship", f"""
<h1>Scholarship</h1>
<p class="sub lede">Section-by-section summaries of the scholarship this portal is built on. This is a reading of other people's research — above all
Matthew Melvin-Koushki's, quoted and paraphrased with permission. Nothing here
supersedes the sources; it organizes them around one figure.</p>
{lit}
""", depth=0))

    pages = len(list(OUT.rglob("*.html")))
    print(f"Ibn Turka portal built: {pages} pages -> {OUT}")
    print(f"  {len(intersections)} intersections, {len(syntheses)} synthesis essays, {len(timeline)} chronology events, {counts}")


if __name__ == "__main__":
    main()
