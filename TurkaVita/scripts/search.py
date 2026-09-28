#!/usr/bin/env python3
# search.py — page-cited full-text search over db/corpus.db.
#
#   python scripts/search.py "Nafsat AND Shahrukh" -n 10      (FTS5 syntax; run from Bash, not PowerShell)
#   python scripts/search.py --page SRC-XXXXXXXXXX 75          (print one PDF page)
#   python scripts/search.py --list                            (the sources and their ids)
import argparse, os, sqlite3, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
con = sqlite3.connect(os.path.join(ROOT, "db", "corpus.db"))

ap = argparse.ArgumentParser()
ap.add_argument("query", nargs="?")
ap.add_argument("-n", type=int, default=8)
ap.add_argument("--src")
ap.add_argument("--page", nargs=2, metavar=("SRC", "PAGE"))
ap.add_argument("--list", action="store_true")
a = ap.parse_args()

if a.list:
    for r in con.execute("SELECT id,year,n_pages,quality,title FROM sources ORDER BY title"):
        print(*r, sep="  ")
elif a.page:
    sid, pg = a.page[0], int(a.page[1])
    r = con.execute("SELECT printed_page,text FROM pages WHERE source_id=? AND page=?", (sid, pg)).fetchone()
    if not r:
        sys.exit("no such page")
    print(f"[{sid} pdf p.{pg} printed p.{r[0]}]\n{r[1]}")
elif a.query:
    sql = ("SELECT s.id, p.page, p.printed_page, s.title, snippet(pages_fts, 0, '[', ']', ' … ', 24) "
           "FROM pages_fts JOIN pages p ON p.rowid = pages_fts.rowid JOIN sources s ON s.id = p.source_id "
           "WHERE pages_fts MATCH ?" + (" AND s.id = ?" if a.src else "") + " ORDER BY rank LIMIT ?")
    args = [a.query] + ([a.src] if a.src else []) + [a.n]
    for sid, pg, pp, title, snip in con.execute(sql, args):
        print(f"{sid} pdf p.{pg} (printed {pp}) · {title[:50]}\n    {snip.strip()}")
