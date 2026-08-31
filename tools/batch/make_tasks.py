#!/usr/bin/env python3
"""
Task-manifest generators for run_batch.py.

Each subcommand surveys real state (corpus files on disk, rows in the portal DB)
and emits a .jsonl manifest of bounded, one-item-per-line tasks. Generators are
idempotent — re-run one after adding sources and it regenerates the full manifest;
run_batch.py skips whatever already has output.

The generators live here rather than inside run_batch.py so the runner stays
generic: it knows how to run and resume tasks, not what your tasks are.

Usage:
    python tools/batch/make_tasks.py corpus  [--chunk-chars 40000] [--sources a,b]
    python tools/batch/make_tasks.py images  [--limit 100] [--status DRAFT]
    python tools/batch/make_tasks.py --list

Then:
    python tools/batch/run_batch.py --tasks tools/batch/tasks/corpus.jsonl --limit 3
"""
import argparse
import json
import sqlite3
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
PORTAL = REPO_ROOT.parent / "IslamicateOccultPortal"
TASKS_DIR = Path(__file__).resolve().parent / "tasks"

# Portal paths are relative to the portal repo root, which becomes each task's cwd.
PORTAL_CWD = "../IslamicateOccultPortal"
CORPUS_DIR = PORTAL / "corpus" / "sources"
PORTAL_DB = PORTAL / "db" / "islamicate.db"

CHUNK_CHARS = 40_000   # ~10K tokens — small enough that Haiku reads it with room to think
CHUNK_OVERLAP = 2_000  # so a claim spanning a boundary is still fully visible once


def write_manifest(name: str, tasks: list) -> Path:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    path = TASKS_DIR / f"{name}.jsonl"
    with open(path, "w", encoding="utf-8") as f:
        for t in tasks:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")
    print(f"wrote {len(tasks)} tasks -> {path.relative_to(REPO_ROOT)}")
    return path


# --------------------------------------------------------------------------
# corpus: chunked extraction from the portal's converted sources
# --------------------------------------------------------------------------

def chunk_offsets(length: int, size: int, overlap: int):
    """Yield (start, end) windows. Overlap keeps a claim that straddles a boundary
    fully readable in at least one chunk."""
    start = 0
    while start < length:
        end = min(start + size, length)
        yield start, end
        if end >= length:
            return
        start = end - overlap


def gen_corpus(args) -> None:
    if not CORPUS_DIR.exists():
        sys.exit(f"no corpus dir at {CORPUS_DIR} — is IslamicateOccultPortal a sibling of TurkaGame?")

    wanted = {s.strip() for s in args.sources.split(",")} if args.sources else None
    tasks = []
    for src in sorted(CORPUS_DIR.glob("*.md")):
        stem = src.stem
        if wanted and stem not in wanted:
            continue
        text = src.read_text(encoding="utf-8", errors="replace")
        if len(text) < 2000:
            print(f"  skipping {stem} — {len(text)} chars, likely a conversion stub")
            continue

        windows = list(chunk_offsets(len(text), args.chunk_chars, CHUNK_OVERLAP))
        for i, (start, end) in enumerate(windows):
            task_id = f"{stem}--{i:03d}"
            out = f"research/extracted/{stem}/{i:03d}.json"
            prompt = (
                f"Read characters {start}-{end} of `corpus/sources/{src.name}` "
                f"(chunk {i + 1} of {len(windows)}). Use Read with offset/limit or a "
                f"Grep/sed slice — do NOT read the whole file, it is {len(text):,} characters.\n\n"
                "Extract every factual claim in that slice that could ground a portal "
                "encyclopedia entry or a TurkaGame scene. For each claim record: the claim "
                "in your own words (never a verbatim quotation longer than 15 words), the "
                "entity or concept it concerns, its category (person / text / concept / "
                "institution / event / practice), and a locator (page number if the text "
                "shows one, otherwise the character offset).\n\n"
                "Rules that matter more than coverage:\n"
                "- Extract only what this slice actually says. Do not supply background "
                "knowledge, and do not resolve an ambiguity by guessing.\n"
                "- This is OCR'd PDF text. Where a name, date, or term is garbled, record it "
                "as it appears and set confidence LOW rather than silently repairing it.\n"
                "- Mark every claim HIGH / MEDIUM / LOW confidence. LOW means a human must "
                "check it before it is published.\n\n"
                f"Write the result as JSON to `{out}` with shape: "
                '{"source": "<stem>", "chunk": <i>, "char_range": [start, end], '
                '"claims": [{"claim": "", "entity": "", "category": "", "locator": "", '
                '"confidence": "HIGH|MEDIUM|LOW"}]}. '
                "If the slice is front matter, references, or otherwise has no extractable "
                'claims, still write the file with an empty "claims" array.'
            )
            tasks.append({
                "id": task_id,
                "prompt": prompt,
                "output_file": out,
                "cwd": PORTAL_CWD,
                "model": args.model,
                "allowed_tools": "Read Write Grep Glob",
            })

    write_manifest("corpus", tasks)
    print("  Next: run 3 first and read the output before committing to the sweep:")
    print("    python tools/batch/run_batch.py --tasks tools/batch/tasks/corpus.jsonl --limit 3")


# --------------------------------------------------------------------------
# images: caption verification for auto-extracted plates
# --------------------------------------------------------------------------

def gen_images(args) -> None:
    if not PORTAL_DB.exists():
        sys.exit(f"no portal DB at {PORTAL_DB}")

    conn = sqlite3.connect(PORTAL_DB)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT id, slug, caption, extracted_file, source_bib_id, source_page "
        "FROM images WHERE review_status = ? ORDER BY id",
        (args.status,),
    ).fetchall()
    if args.limit:
        rows = rows[:args.limit]

    tasks = []
    for r in rows:
        if not r["extracted_file"]:
            continue
        if not (PORTAL / r["extracted_file"]).exists():
            print(f"  skipping image {r['id']} — file missing: {r['extracted_file']}")
            continue

        out = f"data/image_review/{r['slug']}.json"
        page = r["source_page"]
        prompt = (
            f"Look at the image `{r['extracted_file']}` with the Read tool.\n\n"
            f"Its current auto-generated caption is: \"{r['caption']}\"\n"
            f"It was extracted from `corpus/sources/{r['source_bib_id']}.md`"
            + (f", around page {page}." if page else ".") + "\n\n"
            "Decide whether that caption actually describes this image. Grep the corpus "
            "file for the page marker or nearby caption text to check — read only the "
            "surrounding few hundred lines, never the whole file.\n\n"
            "Then judge what the image IS: a manuscript page, a diagram or magic square, "
            "a printed plate, a photograph, a chart, or non-content (a publisher logo, a "
            "blank scan, a page-header fragment, a decorative rule). A large share of "
            "PDF-extracted images are non-content — saying so is a correct and useful "
            "answer, not a failure.\n\n"
            f"Write JSON to `{out}`: "
            '{"image_id": <id>, "slug": "", "verdict": "CAPTION_OK|CAPTION_WRONG|NON_CONTENT|UNCLEAR", '
            '"proposed_caption": "", "depicts": "", "image_type": "", '
            '"evidence": "what in the source text or the image itself supports this", '
            '"confidence": "HIGH|MEDIUM|LOW"}\n\n'
            "Do not invent an institution, shelfmark, or folio. If the source text does not "
            "state one, leave it out entirely — a provenance record with a guessed shelfmark "
            "is worse than none. Use UNCLEAR freely; a human reviews everything below HIGH."
        ).replace("<id>", str(r["id"]))

        tasks.append({
            "id": f"img-{r['id']:04d}",
            "prompt": prompt,
            "output_file": out,
            "cwd": PORTAL_CWD,
            "model": args.model,
            "allowed_tools": "Read Write Grep Glob",
        })

    conn.close()
    write_manifest("images", tasks)
    print("  Next: run 5 first and eyeball them against the actual plates:")
    print("    python tools/batch/run_batch.py --tasks tools/batch/tasks/images.jsonl --limit 5")


GENERATORS = {
    "corpus": (gen_corpus, "chunked claim-extraction over the portal's converted sources"),
    "images": (gen_images, "caption verification for auto-extracted plates in the portal DB"),
}


def main() -> None:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--list", action="store_true", help="list generators and exit")
    sub = ap.add_subparsers(dest="generator")

    p = sub.add_parser("corpus", help=GENERATORS["corpus"][1])
    p.add_argument("--chunk-chars", type=int, default=CHUNK_CHARS)
    p.add_argument("--sources", help="comma-separated source stems, default all")
    p.add_argument("--model", default="claude-haiku-4-5")

    p = sub.add_parser("images", help=GENERATORS["images"][1])
    p.add_argument("--status", default="DRAFT", help="review_status to select (default: DRAFT)")
    p.add_argument("--limit", type=int, help="cap the number of tasks generated")
    p.add_argument("--model", default="claude-haiku-4-5")

    args = ap.parse_args()

    if args.list or not args.generator:
        print("Generators:")
        for name, (_, desc) in GENERATORS.items():
            print(f"  {name:10} {desc}")
        return

    GENERATORS[args.generator][0](args)


if __name__ == "__main__":
    main()
