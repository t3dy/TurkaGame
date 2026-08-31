"""
convert_corpus.py — Stage 0 of the Ibn Turka portal pipeline.

Converts the scholarly PDFs in `research inbox/` to plain markdown under
`portal/corpus/sources/<slug>.md`, full text with **footnotes and citations
intact** (pdftotext -layout). Footnotes are where the manuscript shelfmarks,
folio references, and Persian/Arabic title leads live — stripping them would
throw away exactly the material this portal exists to index.

Metadata (author, title, year) is derived from the filename convention used in
the inbox:

    "Melvin-Koushki - Toward a Neopythagorean historiography - 2020.pdf"
    "Melvin-Koushki and Pickett - Mobilizing magic - 2016.pdf"
    "Melvin-Koushki - Ibn Turka's Pythagorean sensorium.pdf"      (no year)
    "Melvin-Koushki - Reading, ... [preprint].pdf"                (bracket tag)

Anything the parser can't confidently derive is written as null and flagged in
`portal/corpus/INDEX.md` for a human pass — it is never guessed.

Output is gitignored: these are full texts of copyrighted scholarly works kept
as local research material. Only the generated INDEX.md (metadata only) and
whatever gets synthesized into `portal/data/seed.json` are tracked.

Idempotent. Safe to re-run; skips existing output unless --force.

Usage:
    python portal/scripts/convert_corpus.py
    python portal/scripts/convert_corpus.py --force
    python portal/scripts/convert_corpus.py --list
"""

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from datetime import date
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent   # TurkaGame/
PORTAL_DIR = BASE_DIR / "portal"
INBOX_DIR = BASE_DIR / "research inbox"
LIBRARY_DIR = BASE_DIR / "research" / "library"
CORPUS_DIR = PORTAL_DIR / "corpus" / "sources"
INDEX_PATH = PORTAL_DIR / "corpus" / "INDEX.md"
MANIFEST_PATH = PORTAL_DIR / "data" / "corpus_manifest.json"

# Sources whose subject matter sits at the centre of this portal (Ibn Turka
# himself, his lettrism, his Timurid context) vs. the wider Islamicate occult
# world. Assigned by keyword on the title; a human can override in the manifest.
PRIMARY_KEYWORDS = [
    "ibn turka", "pythagorean", "lettrism", "'ilm-i huruf", "ilm-i huruf",
    "occult court", "new brethren", "neopythagorean", "powers of one",
    "timurid", "grammatology", "cosmic text", "second aristotle",
    "world as (arabic) text", "occult science",
]
CONTEXTUAL_KEYWORDS = [
    "dee", "venetian", "plague", "mir damad", "safavid", "qizilbash",
    "ottoman", "mughal", "selenocentrism", "heliocentrism",
]


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[''`]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


def parse_filename(path: Path) -> dict:
    """Derive author / title / year from the inbox naming convention."""
    stem = path.stem
    bracket_tags = re.findall(r"\[([^\]]+)\]", stem)
    stem = re.sub(r"\s*\[[^\]]+\]", "", stem).strip()

    parts = [p.strip() for p in stem.split(" - ")]
    author = parts[0] if parts else None
    year = None
    rest = parts[1:]

    if rest and re.fullmatch(r"(1|2)\d{3}", rest[-1]):
        year = int(rest[-1])
        rest = rest[:-1]

    title = " - ".join(rest).strip() if rest else None

    # Normalise the two-author forms to a citation-shaped string.
    if author and " and " in author:
        author = author.replace(" and ", " & ")

    return {
        "author": author or None,
        "title": title or None,
        "year": year,
        "tags": bracket_tags,
    }


def classify(title: str | None) -> str:
    t = (title or "").lower()
    if any(k in t for k in PRIMARY_KEYWORDS):
        return "PRIMARY"
    if any(k in t for k in CONTEXTUAL_KEYWORDS):
        return "CONTEXTUAL"
    return "DIRECT"


def build_manifest() -> list[dict]:
    """Scan the inbox (and research/library, for the 3 original papers)."""
    seen_slugs: dict[str, Path] = {}
    entries: list[dict] = []

    search_dirs = [d for d in (INBOX_DIR, LIBRARY_DIR) if d.is_dir()]
    for directory in search_dirs:
        for pdf in sorted(directory.glob("*.pdf")):
            meta = parse_filename(pdf)
            base = meta["title"] or pdf.stem
            slug = slugify(f"{(meta['author'] or 'unknown').split(' &')[0]}-{base}")
            if slug in seen_slugs:
                # Same paper present in both inbox and research/library.
                continue
            seen_slugs[slug] = pdf
            entries.append({
                "slug": slug,
                "src": str(pdf),
                "src_dir": directory.name,
                "author": meta["author"],
                "title": meta["title"],
                "year": meta["year"],
                "edition_tags": meta["tags"],
                "relevance": classify(meta["title"]),
                "pub_type": "dissertation" if "dissertation" in (meta["title"] or "").lower() else "article",
            })
    return entries


def write_md_header(meta: dict, char_count: int, page_hint: str) -> str:
    return (
        "---\n"
        f"slug: {meta['slug']}\n"
        f"title: {json.dumps(meta['title'])}\n"
        f"author: {json.dumps(meta['author'])}\n"
        f"year: {meta['year'] if meta['year'] is not None else 'null'}\n"
        f"relevance: {meta['relevance']}\n"
        f"source_file: {json.dumps(Path(meta['src']).name)}\n"
        f"converted: {date.today().isoformat()}\n"
        f"converter: pdftotext -layout -enc UTF-8\n"
        f"chars: {char_count}\n"
        f"pages: {page_hint}\n"
        "---\n\n"
        "> Full-text research conversion. Copyrighted scholarly work — local\n"
        "> research material only, never committed and never republished.\n\n"
    )


def convert_pdf(meta: dict, dest: Path) -> dict:
    src = Path(meta["src"])
    try:
        result = subprocess.run(
            ["pdftotext", "-enc", "UTF-8", "-layout", str(src), "-"],
            capture_output=True, timeout=600,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError) as exc:
        return {"status": "ERROR", "detail": str(exc), "chars": 0}

    if result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace")[:200]
        return {"status": "ERROR", "detail": detail, "chars": 0}

    text = result.stdout.decode("utf-8", errors="replace")
    text = text.replace("\r\n", "\n").replace("\f", "\n\n---- page break ----\n\n")
    pages = text.count("---- page break ----") + 1
    stripped = re.sub(r"\s+", "", text)

    status = "CONVERTED"
    # A scan with no text layer yields a handful of stray characters per page.
    if len(stripped) < pages * 40:
        status = "SCANNED_NEEDS_OCR"

    dest.write_text(
        write_md_header(meta, len(text), str(pages)) + text,
        encoding="utf-8",
    )
    return {"status": status, "detail": "", "chars": len(text), "pages": pages}


def write_index(records: list[dict]) -> None:
    converted = [r for r in records if r["status"] == "CONVERTED"]
    problems = [r for r in records if r["status"] != "CONVERTED"]
    total_chars = sum(r.get("chars", 0) for r in records)

    lines = [
        "# Corpus Index — Ibn Turka Portal",
        "",
        "Auto-generated by [`portal/scripts/convert_corpus.py`](../scripts/convert_corpus.py).",
        "Do not hand-edit; re-run the script instead.",
        "",
        f"**{len(converted)} of {len(records)} sources converted**, "
        f"~{total_chars // 1000:,}k characters of full text "
        f"(generated {date.today().isoformat()}).",
        "",
        "`corpus/sources/*.md` is **gitignored** — full text of copyrighted",
        "scholarly works, kept as local research material. Only this metadata",
        "index and the synthesis in `portal/data/seed.json` are tracked in git.",
        "",
        "## Converted sources",
        "",
        "| Slug | Title | Author | Year | Relevance | Pages | Chars |",
        "|------|-------|--------|------|-----------|-------|-------|",
    ]
    for r in sorted(converted, key=lambda x: (x["author"] or "", x["year"] or 0)):
        lines.append(
            f"| `{r['slug']}` | {r['title'] or '—'} | {r['author'] or '—'} | "
            f"{r['year'] or '—'} | {r['relevance']} | {r.get('pages', '—')} | "
            f"{r.get('chars', 0):,} |"
        )

    if problems:
        lines += [
            "",
            "## Needs attention",
            "",
            "| Slug | Status | Detail |",
            "|------|--------|--------|",
        ]
        for r in problems:
            lines.append(f"| `{r['slug']}` | {r['status']} | {r.get('detail', '')[:120]} |")

    lines += [
        "",
        "## Working pattern",
        "",
        "**grep → read → attribute → cite.** Search the corpus first",
        "(`grep -iln 'akhlati' portal/corpus/sources/*.md`), read the matched",
        "region with `sed -n`, synthesize with explicit attribution, then record",
        "a `scholarly_refs` row with a real page reference. Files run to several",
        "hundred KB — never read one end to end.",
        "",
    ]
    INDEX_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-convert everything")
    ap.add_argument("--list", action="store_true", help="print manifest and exit")
    args = ap.parse_args()

    manifest = build_manifest()
    if not manifest:
        print(f"No PDFs found in {INBOX_DIR}")
        return 1

    if args.list:
        for m in manifest:
            print(f"{m['relevance']:<11} {m['slug']:<62} {m['year'] or '----'}  {m['title']}")
        print(f"\n{len(manifest)} sources.")
        return 0

    CORPUS_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    records = []
    for m in manifest:
        dest = CORPUS_DIR / f"{m['slug']}.md"
        if dest.exists() and not args.force:
            text = dest.read_text(encoding="utf-8", errors="replace")
            rec = {**m, "status": "CONVERTED", "chars": len(text),
                   "pages": text.count("---- page break ----") + 1}
            print(f"  skip   {m['slug']}")
        else:
            print(f"  convert {m['slug']} ...", end=" ", flush=True)
            outcome = convert_pdf(m, dest)
            rec = {**m, **outcome}
            print(f"{outcome['status']} ({outcome.get('chars', 0):,} chars)")
        records.append(rec)

    MANIFEST_PATH.write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding="utf-8")
    write_index(records)

    ok = sum(1 for r in records if r["status"] == "CONVERTED")
    print(f"\n{ok}/{len(records)} converted. Index: {INDEX_PATH}")
    for r in records:
        if r["status"] != "CONVERTED":
            print(f"  !! {r['slug']}: {r['status']} {r.get('detail','')[:120]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
