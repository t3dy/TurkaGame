"""
mine_corpus.py — Stage 0.5: the corpus research tool.

The corpus is ~6 million characters across 43 sources. Reading files end to end
is not an option; this tool exists so research happens by targeted retrieval
instead. Every subcommand reports **source slug + page number**, so anything it
surfaces can go straight into a `scholarly_refs` row with a real page reference.

The working pattern this enforces:

    rank   -> which sources actually discuss this? (cheapest, always start here)
    kwic   -> what do they say, in one line of context each?
    read   -> pull the full passage around the best hit
    (then) -> synthesize with attribution, cite the page, set confidence honestly

Subcommands
-----------
  rank TERM [TERM...]     Per-source hit counts. Which files are worth opening.
  kwic TERM               Keyword-in-context concordance with page numbers.
  read SLUG               Read a region: --page N, --around TERM, --chars N.
  pages SLUG              Page/character map of one source.
  near TERM1 TERM2        Passages where two terms co-occur within a window.
  dates [SLUG]            Extract dated statements (Hijri/CE pairs, year ranges).
  names [SLUG]            Frequency-ranked capitalised name candidates.
  sources                 List the corpus with sizes and relevance.

All output is designed to be compact enough to read directly.

Usage:
    python portal/scripts/mine_corpus.py rank "Ibn Turka" Akhlati
    python portal/scripts/mine_corpus.py kwic "Akhlati" --max 25
    python portal/scripts/mine_corpus.py read melvin-koushki-dissertation-yale-2012 --around "chief judge" --chars 3000
    python portal/scripts/mine_corpus.py near "Ibn Turka" inquisition --window 600
"""

import argparse
import io
import json
import re
import sys
from collections import Counter
from pathlib import Path

# Force UTF-8 output on Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE_DIR = Path(__file__).resolve().parent.parent
CORPUS_DIR = BASE_DIR / "corpus" / "sources"
MANIFEST_PATH = BASE_DIR / "data" / "corpus_manifest.json"

PAGE_MARK = "---- page break ----"

# Transliteration is wildly inconsistent across these publications (Akhlati /
# Akhlātī / Akhlatī; huruf / ḥurūf). Searches fold diacritics so one query
# catches every spelling.
FOLD = str.maketrans({
    "ā": "a", "ă": "a", "á": "a", "à": "a", "â": "a",
    "ī": "i", "í": "i", "î": "i",
    "ū": "u", "ú": "u", "û": "u",
    "ē": "e", "é": "e", "ō": "o", "ó": "o",
    "ḥ": "h", "ḫ": "h", "ḵ": "k", "ḳ": "k",
    "ṣ": "s", "š": "s", "ś": "s", "ṡ": "s",
    "ḍ": "d", "ḏ": "d", "ḑ": "d",
    "ṭ": "t", "ṯ": "t", "ẓ": "z", "ż": "z", "ẕ": "z",
    "ġ": "g", "ǧ": "g", "ñ": "n", "ṇ": "n", "ṅ": "n",
    "ʿ": "", "ʾ": "", "'": "", "'": "", "'": "", "`": "", "ʻ": "",
    "ḷ": "l", "ṛ": "r", "ṃ": "m", "ç": "c",
})


def fold(s: str) -> str:
    return s.translate(FOLD).lower()


def load_manifest() -> dict[str, dict]:
    if not MANIFEST_PATH.exists():
        return {}
    return {r["slug"]: r for r in json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))}


def corpus_files(only: list[str] | None = None) -> list[Path]:
    files = sorted(CORPUS_DIR.glob("*.md"))
    if only:
        wanted = {o.lower() for o in only}
        files = [f for f in files if any(w in f.stem.lower() for w in wanted)]
    return files


class Source:
    """One converted source, with a page index built once on load."""

    def __init__(self, path: Path):
        self.slug = path.stem
        self.raw = path.read_text(encoding="utf-8", errors="replace")
        # Strip the YAML header so its metadata never shows up as a hit.
        body_start = self.raw.find("\n---\n", 4)
        self.offset0 = body_start + 5 if body_start > 0 else 0
        self.text = self.raw[self.offset0:]
        self.folded = fold(self.text)
        self.page_starts = [0] + [
            m.end() for m in re.finditer(re.escape(PAGE_MARK), self.text)
        ]

    def page_of(self, pos: int) -> int:
        lo, hi = 0, len(self.page_starts) - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if self.page_starts[mid] <= pos:
                lo = mid
            else:
                hi = mid - 1
        return lo + 1

    def n_pages(self) -> int:
        return len(self.page_starts)

    def finditer(self, term: str):
        ft = fold(term)
        start = 0
        while True:
            i = self.folded.find(ft, start)
            if i < 0:
                return
            yield i
            start = i + 1

    def count(self, term: str) -> int:
        return self.folded.count(fold(term))


def clean(snippet: str) -> str:
    """Collapse pdftotext's layout whitespace into one readable line."""
    s = snippet.replace(PAGE_MARK, " ")
    s = re.sub(r"\s+", " ", s).strip()
    # Windows console encoding fix
    return s.encode('utf-8', errors='replace').decode('utf-8', errors='replace')


# ------------------------------------------------------------------ commands

def cmd_sources(args) -> int:
    man = load_manifest()
    rows = []
    for f in corpus_files(args.only):
        m = man.get(f.stem, {})
        rows.append((m.get("relevance", "?"), f.stem, m.get("year") or "----",
                     f.stat().st_size // 1024, m.get("title") or ""))
    rows.sort(key=lambda r: ({"PRIMARY": 0, "DIRECT": 1, "CONTEXTUAL": 2}.get(r[0], 3), r[1]))
    for rel, slug, year, kb, title in rows:
        print(f"{rel:<11} {kb:>5}K  {year}  {slug}", flush=True)
        if args.titles:
            print(f"                        {title}", flush=True)
    print(f"\n{len(rows)} sources, {sum(r[3] for r in rows) / 1024:.1f} MB total.")
    return 0


def cmd_rank(args) -> int:
    """Per-source hit counts. Always the cheapest first move."""
    results = []
    for f in corpus_files(args.only):
        src = Source(f)
        counts = {t: src.count(t) for t in args.terms}
        total = sum(counts.values())
        if total:
            results.append((total, src.slug, counts, src.n_pages()))
    results.sort(reverse=True)

    if not results:
        print(f"No hits for {args.terms}")
        return 0

    width = max(len(r[1]) for r in results)
    print(f"{'total':>6}  {'source':<{width}}  pages  breakdown")
    for total, slug, counts, pages in results[: args.max]:
        parts = " ".join(f"{t}={c}" for t, c in counts.items() if c)
        print(f"{total:>6}  {slug:<{width}}  {pages:>5}  {parts}")
    print(f"\n{len(results)} sources with hits; "
          f"{sum(r[0] for r in results)} occurrences total.")
    return 0


def cmd_kwic(args) -> int:
    """Keyword-in-context concordance."""
    shown = 0
    for f in corpus_files(args.only):
        src = Source(f)
        hits = list(src.finditer(args.term))
        if not hits:
            continue
        print(f"\n=== {src.slug} ({len(hits)} hits) ===")
        for pos in hits[: args.per_source]:
            lo = max(0, pos - args.width)
            hi = min(len(src.text), pos + len(args.term) + args.width)
            print(f"  p{src.page_of(pos):<4} {clean(src.text[lo:hi])}")
            shown += 1
            if shown >= args.max:
                print(f"\n[stopped at --max {args.max}]")
                return 0
    if not shown:
        print(f"No hits for {args.term!r}")
    return 0


def cmd_near(args) -> int:
    """Passages where two terms co-occur inside a window."""
    shown = 0
    for f in corpus_files(args.only):
        src = Source(f)
        a_hits = list(src.finditer(args.term1))
        if not a_hits:
            continue
        b_folded = fold(args.term2)
        printed_header = False
        for pos in a_hits:
            lo = max(0, pos - args.window)
            hi = min(len(src.folded), pos + args.window)
            if b_folded not in src.folded[lo:hi]:
                continue
            if not printed_header:
                print(f"\n=== {src.slug} ===")
                printed_header = True
            print(f"  p{src.page_of(pos):<4} {clean(src.text[lo:hi])}\n")
            shown += 1
            if shown >= args.max:
                print(f"[stopped at --max {args.max}]")
                return 0
    if not shown:
        print(f"No co-occurrence of {args.term1!r} and {args.term2!r} "
              f"within {args.window} chars.")
    return 0


def cmd_read(args) -> int:
    matches = corpus_files([args.slug])
    if not matches:
        print(f"No source matching {args.slug!r}. Try: mine_corpus.py sources")
        return 1
    src = Source(matches[0])

    if args.around:
        hits = list(src.finditer(args.around))
        if not hits:
            print(f"{args.around!r} not found in {src.slug}")
            return 1
        pos = hits[min(args.nth, len(hits) - 1)]
        lo = max(0, pos - args.chars // 3)
        hi = min(len(src.text), pos + (args.chars * 2) // 3)
        print(f"# {src.slug} — around {args.around!r} "
              f"(hit {args.nth + 1}/{len(hits)}, p{src.page_of(pos)})\n")
    elif args.page:
        idx = min(args.page - 1, len(src.page_starts) - 1)
        lo = src.page_starts[idx]
        hi = min(len(src.text), lo + args.chars)
        print(f"# {src.slug} — from p{args.page}\n")
    else:
        lo, hi = 0, min(len(src.text), args.chars)
        print(f"# {src.slug} — from the start "
              f"({src.n_pages()} pages, {len(src.text):,} chars)\n")

    print(src.text[lo:hi])
    return 0


def cmd_pages(args) -> int:
    matches = corpus_files([args.slug])
    if not matches:
        print(f"No source matching {args.slug!r}")
        return 1
    src = Source(matches[0])
    print(f"{src.slug}: {src.n_pages()} pages, {len(src.text):,} chars")
    for i, start in enumerate(src.page_starts[: args.max], 1):
        end = src.page_starts[i] if i < len(src.page_starts) else len(src.text)
        head = clean(src.text[start:start + 90])
        print(f"  p{i:<4} @{start:<9} {end - start:>6}c  {head[:80]}")
    return 0


# Matches "800/1397", "d. 830/1427", "817-823/1414-1420" — the Hijri/CE pairing
# convention this literature uses throughout. That pairing is the single most
# reliable signal of a datable biographical statement.
DATE_RE = re.compile(r"\b(\d{2,4})(?:-\d{2,4})?/(1[0-9]{3})(?:-\d{2,4})?\b")


def cmd_dates(args) -> int:
    for f in corpus_files([args.slug] if args.slug else args.only):
        src = Source(f)
        seen: set[str] = set()
        rows = []
        for m in DATE_RE.finditer(src.text):
            ce = int(m.group(2))
            if not (args.from_year <= ce <= args.to_year):
                continue
            lo = max(0, m.start() - args.width)
            hi = min(len(src.text), m.end() + args.width)
            ctx = clean(src.text[lo:hi])
            key = ctx[:60]
            if key in seen:
                continue
            seen.add(key)
            rows.append((ce, src.page_of(m.start()), m.group(0), ctx))
        if not rows:
            continue
        print(f"\n=== {src.slug} ({len(rows)} dated statements "
              f"{args.from_year}-{args.to_year}) ===")
        for ce, page, raw, ctx in sorted(rows)[: args.per_source]:
            print(f"  {ce}  p{page:<4} [{raw}] {ctx}")
    return 0


NAME_RE = re.compile(
    r"\b(?:Ibn|Abu|Abū|Sayyid|Shaykh|Mawlana|Mawlānā|Mir|Mīr|Amir|Amīr|Qadi|Qāḍī|Khwaja|Khwāja)"
    r"[ -][A-ZĀĪŪʿʾ][\w'ʿʾāīūḥṣṭẓḍġšḵ-]+(?:[ -][a-zA-Zʿʾ][\w'ʿʾāīūḥṣṭẓḍġšḵ-]+){0,3}"
)


def cmd_names(args) -> int:
    counter: Counter[str] = Counter()
    where: dict[str, Counter[str]] = {}
    for f in corpus_files([args.slug] if args.slug else args.only):
        src = Source(f)
        for m in NAME_RE.finditer(src.text):
            name = re.sub(r"\s+", " ", m.group(0)).strip(" -,.")
            if len(name) < 6:
                continue
            counter[name] += 1
            where.setdefault(name, Counter())[src.slug] += 1
    for name, n in counter.most_common(args.max):
        top = ", ".join(s for s, _ in where[name].most_common(2))
        print(f"{n:>5}  {name:<44} {top}")
    print(f"\n{len(counter)} distinct name candidates.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", nargs="*", help="restrict to sources whose slug contains these substrings")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("sources", help="list the corpus")
    p.add_argument("--titles", action="store_true")
    p.set_defaults(func=cmd_sources)

    p = sub.add_parser("rank", help="per-source hit counts")
    p.add_argument("terms", nargs="+")
    p.add_argument("--max", type=int, default=25)
    p.set_defaults(func=cmd_rank)

    p = sub.add_parser("kwic", help="keyword-in-context concordance")
    p.add_argument("term")
    p.add_argument("--width", type=int, default=180)
    p.add_argument("--max", type=int, default=40)
    p.add_argument("--per-source", type=int, default=8)
    p.set_defaults(func=cmd_kwic)

    p = sub.add_parser("near", help="two terms co-occurring in a window")
    p.add_argument("term1")
    p.add_argument("term2")
    p.add_argument("--window", type=int, default=500)
    p.add_argument("--max", type=int, default=20)
    p.set_defaults(func=cmd_near)

    p = sub.add_parser("read", help="read a region of one source")
    p.add_argument("slug")
    p.add_argument("--page", type=int)
    p.add_argument("--around")
    p.add_argument("--nth", type=int, default=0, help="which hit of --around")
    p.add_argument("--chars", type=int, default=3000)
    p.set_defaults(func=cmd_read)

    p = sub.add_parser("pages", help="page map of one source")
    p.add_argument("slug")
    p.add_argument("--max", type=int, default=200)
    p.set_defaults(func=cmd_pages)

    p = sub.add_parser("dates", help="extract Hijri/CE dated statements")
    p.add_argument("slug", nargs="?")
    p.add_argument("--from-year", type=int, default=1300)
    p.add_argument("--to-year", type=int, default=1500)
    p.add_argument("--width", type=int, default=160)
    p.add_argument("--per-source", type=int, default=60)
    p.set_defaults(func=cmd_dates)

    p = sub.add_parser("names", help="frequency-ranked name candidates")
    p.add_argument("slug", nargs="?")
    p.add_argument("--max", type=int, default=60)
    p.set_defaults(func=cmd_names)

    args = ap.parse_args()
    if not CORPUS_DIR.exists() or not any(CORPUS_DIR.glob("*.md")):
        print(f"Corpus empty. Run: python portal/scripts/convert_corpus.py")
        return 1
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
