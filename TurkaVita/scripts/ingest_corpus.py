#!/usr/bin/env python3
# ingest_corpus.py — Melvin-Koushki's scholarship -> db/corpus.db, page by page, FTS5-indexed.
#
#   python scripts/ingest_corpus.py            # resumable: a source already in the manifest with the
#                                              #   same file hash is skipped
#   python scripts/ingest_corpus.py --only Dissertation
#
# Two things differ from PLOTINUSGAME's ingester. (1) The sources are a few dozen PDFs, all with a
# text layer, so PyMuPDF is the only witness. (2) The 2012 dissertation carries a running head on
# every page ("chapter one  |  59"), so the PRINTED page is recorded beside the PDF page and a
# citation can be checked against the book, not just the file.
import argparse, datetime, glob, hashlib, io, json, os, re, sqlite3, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.path.join(ROOT, "db", "corpus.db")
MANIFEST = os.path.join(ROOT, "research", "ingest_manifest.json")
INBOX = os.path.abspath(os.path.join(ROOT, "..", "research inbox"))
EXTRA = [  # the three papers the older TurkaGame notes were written from live outside the repo
    r"E:\pdf\downloadstosort\Melvin-Koushki - Islamicate Occultism\Melvin-Koushki - Prologue to Pythagorean Renaissance.pdf",
    r"E:\pdf\downloadstosort\Melvin-Koushki - Islamicate Occultism\Melvin-Koushki - The occult court - 2025.pdf",
    r"E:\pdf\downloadstosort\Melvin-Koushki - Islamicate Occultism\Melvin-Koushki - The meanings of Islamic Magic.pdf",
]
HEAD = re.compile(r"\|\s*([ivxlc]+|\d+)\s*$", re.I)      # "chapter one  |  59"  or  "|  vi"
HEAD_L = re.compile(r"^\s*(\d+)\s*\|")                    # "58  |  chapter one"  (verso pages, some books)


def source_id(path):
    return "SRC-" + hashlib.sha1(os.path.basename(path).lower().encode()).hexdigest()[:10].upper()


def printed_page(text):
    lines = [l for l in text.strip().splitlines() if l.strip()]
    for l in (lines[:1] + lines[-1:]):
        m = HEAD.search(l.strip()) or HEAD_L.match(l)
        if m:
            return m.group(1)
    return None


def meta(path):
    name = os.path.splitext(os.path.basename(path))[0]
    year = (re.findall(r"(19|20)\d\d", name) and re.search(r"(?:19|20)\d\d", name).group(0)) or ""
    title = re.sub(r"^Melvin-Koushki( and [A-Za-z]+)? - ", "", name)
    title = re.sub(r"\s*-\s*(?:19|20)\d\d.*$", "", title).strip()
    return title, year


def ingest_one(con, path, manifest):
    import fitz
    fh = hashlib.sha1(open(path, "rb").read()).hexdigest()
    sid = source_id(path)
    if manifest.get(sid, {}).get("hash") == fh:
        return "skip"
    doc = fitz.open(path)
    title, year = meta(path)
    con.execute("DELETE FROM pages WHERE source_id=?", (sid,))
    con.execute("DELETE FROM sources WHERE id=?", (sid,))
    chars, thin = 0, 0
    for i, pg in enumerate(doc, 1):
        t = pg.get_text()
        chars += len(t)
        if len(t.strip()) < 200:
            thin += 1
        con.execute("INSERT INTO pages(source_id,page,printed_page,text) VALUES(?,?,?,?)",
                    (sid, i, printed_page(t), t))
    q = "good" if chars / max(1, len(doc)) > 800 else ("needs_ocr" if chars < 200 * len(doc) else "partial")
    con.execute("INSERT INTO sources VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                (sid, path, title, "Matthew Melvin-Koushki", year, "scholarship", len(doc), chars, q,
                 datetime.datetime.now().isoformat(timespec="seconds"), f"{thin} thin page(s)"))
    con.commit()
    manifest[sid] = {"hash": fh, "title": title, "pages": len(doc), "quality": q}
    json.dump(manifest, io.open(MANIFEST, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    return q


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    a = ap.parse_args()
    os.makedirs(os.path.dirname(DB), exist_ok=True)
    con = sqlite3.connect(DB)
    con.executescript(io.open(os.path.join(ROOT, "db", "corpus_schema.sql"), encoding="utf-8").read())
    manifest = json.load(io.open(MANIFEST, encoding="utf-8")) if os.path.exists(MANIFEST) else {}
    files = sorted(glob.glob(os.path.join(INBOX, "*.pdf"))) + [p for p in EXTRA if os.path.exists(p)]
    if a.only:
        files = [f for f in files if a.only.lower() in os.path.basename(f).lower()]
    for f in files:
        print(f"{ingest_one(con, f, manifest):9s} {source_id(f)}  {os.path.basename(f)}", flush=True)
    con.execute("INSERT INTO pages_fts(pages_fts) VALUES('rebuild')")
    con.commit()
    n = con.execute("SELECT COUNT(*), (SELECT COUNT(*) FROM pages) FROM sources").fetchone()
    print(f"corpus.db: {n[0]} sources, {n[1]} pages")


if __name__ == "__main__":
    main()
