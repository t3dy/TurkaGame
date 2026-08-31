# Ibn Turka Portal — Research Pipeline

A scholarly knowledge portal built from **Matthew Melvin-Koushki's complete published corpus** on Islamicate occult science, Islamic lettrism, and **Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī** (1369–1432), the Timurid judge and occult philosopher. 

Corpus: 43 sources (~6 million characters of full-text scholarly PDFs), converted to searchable markdown. Database: SQLite with a card/page system for encyclopedia-quality entries. Site: vanilla HTML/CSS/JS. Hosting: GitHub Pages + local preview.

**This portal is purely scholarly.** Game design work citing the portal lives in `../games/` and `../docs/`.

## Quick Start

### Run a fresh ingest (one-time setup)

```bash
# Convert all PDFs to markdown (idempotent)
python portal/scripts/convert_corpus.py

# Create the SQLite schema
python portal/scripts/init_db.py

# [Later, when entries are ready] Generate the site
python portal/scripts/build_site.py
```

### Search the corpus from the command line

The corpus is too large to read end-to-end. Search it by targeted retrieval:

```bash
# Which sources discuss Ibn Turka, Akhlati, Pythagorean?
python portal/scripts/mine_corpus.py rank "Ibn Turka" Akhlati Pythagorean

# What do they say about "Akhlati" in context?
python portal/scripts/mine_corpus.py kwic Akhlati --max 25

# Read a passage: find it, read around it
python portal/scripts/mine_corpus.py read melvin-koushki-dissertation-yale-2012 \
    --around "chief judge" --chars 3000

# Find all dated statements in a source
python portal/scripts/mine_corpus.py dates melvin-koushki-dissertation-yale-2012 --from-year 1350 --to-year 1450

# Get a frequency-ranked name candidates
python portal/scripts/mine_corpus.py names --max 80
```

All results include source slug + page number, so a hit becomes a cite immediately.

### Write encyclopedia entries

Entries are authored as markdown in `portal/data/seed.json`, then rendered to HTML. See `portal/docs/STYLE_ENTRIES.md` for:

- **Card**: 60–150 word index card (what is this thing?)
- **Body**: 1,000–2,200 word encyclopedia page (detailed treatment)

Both fields support `[[wiki-style]]` entity links and markdown formatting; the build script converts to HTML.

Entities:
- **Figures**: people (scholars, judges, mystics, patrons, modern scholars)
- **Concepts**: occult sciences, cosmological structures, techniques, terminology
- **Texts**: primary sources (treatises, grimoires, epistles, commentaries)
- **Institutions**: courts, networks, observatories, orders, judiciaries
- **Timeline**: dated events in Ibn Turka's life and the Islamicate tradition
- **Arguments**: historiographical claims (especially Melvin-Koushki's revisionist arguments)
- **Bibliography**: secondary sources with real summaries

For every entry, you can answer:
- What is this?
- Why does it matter?
- What do historians debate about it?
- Where in the corpus is evidence?

### Provenance discipline

**Every non-obvious claim must cite its source with a page number.** This enforces:

1. **You've actually read it.** No paraphrasing from abstracts or other summaries.
2. **The portal is citable.** A reader can follow the `scholarly_refs` row and open the PDF to the exact page.
3. **Confidence is honest.** Mark confidence HIGH only for claims you verified yourself.

When writing, follow the pattern:

```
Text: "According to Melvin-Koushki (Powers of One, p. 103), Ibn Turka argued..."
DB:   scholarly_refs row: entity_type='figure', entity_slug='ibn-turka',
      bib_source_id='melvin-koushki-powers-of-one-2017', page_ref='103'
```

## Architecture

### Corpus (`portal/corpus/`)

**`sources/*.md`** — Full-text conversions of the 43 Melvin-Koushki papers (gitignored). Footnotes and citations intact. Searchable via `mine_corpus.py`.

**`INDEX.md`** — Auto-generated catalog: what's converted, what needs OCR, what's too small to be text (scanned page).

**`corpus_manifest.json`** — Metadata for each source: author, title, year, relevance (PRIMARY/DIRECT/CONTEXTUAL), char count, conversion status.

### Database (`portal/db/turka.db`)

SQLite schema with 11 tables:
- `figures`, `concepts`, `texts`, `institutions`, `timeline_events`, `arguments`
- `bibliography` (metadata), `scholarly_refs` (citations)
- `images` (manuscript/diagram catalog), `essays` (synthesis pages)
- `schema_version`

Every entity carries:
- `card` (markdown) + `body` (markdown) — for the card/page system
- `source_method`, `review_status`, `confidence` — provenance discipline
- `literature` (JSON array of DGWE citations)

### Seed data (`portal/data/seed.json`)

Hand-authored JSON seed for the first-pass ingest. Structured as:

```json
{
  "figures": [
    {
      "slug": "ibn-turka",
      "name": "Ibn Turka",
      "name_full": "Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī",
      "lifespan": "1369-1432",
      "card": "Markdown index card...",
      "body": "Markdown encyclopedia page...",
      "literature": ["...DGWE citations..."],
      ...
    }
  ],
  "concepts": [...],
  "texts": [...],
  ...
}
```

When the build runs, `seed_from_json.py` loads this and populates the DB. Later runs append without overwriting (idempotent).

### Scripts

- **`convert_corpus.py`** — Stage 0: PDFs → markdown (full text with footnotes). Idempotent.
- **`init_db.py`** — Stage 1: Create SQLite schema. Idempotent.
- **`mine_corpus.py`** — Research tool: rank, kwic, read, dates, names. Non-writing; helps you find what to write about.
- **`seed_from_json.py`** — Stage 2: JSON → database. Idempotent.
- **`build_site.py`** — Stage 3: database → HTML. Idempotent.

### Site (`portal/site/`)

Generated static HTML with card/page navigation:
- `index.html` — Portal home, search interface
- `figures/`, `concepts/`, `texts/`, `institutions/`, `timeline/`, `arguments/`, `essays/` — entity pages
- `style.css` — Consistent styling across all pages

## Workflow

### For researchers (you)

**Pattern: rank → kwic → read → write → cite**

1. **Rank:** Which sources discuss your topic?
   ```bash
   python portal/scripts/mine_corpus.py rank "Ibn Turka" "Akhlati"
   ```

2. **KWIC:** What do they say, in context?
   ```bash
   python portal/scripts/mine_corpus.py kwic Akhlati --max 25
   ```

3. **Read:** Pull the full passage around a good hit.
   ```bash
   python portal/scripts/mine_corpus.py read melvin-koushki-dissertation-yale-2012 \
       --around "chief judge" --chars 3000
   ```

4. **Write:** Synthesize into an entry with explicit attribution.
   ```markdown
   Per Melvin-Koushki's *Powers of One* (p. 103), Ibn Turka argued...
   ```

5. **Cite:** Add the scholarly_refs row immediately with page number.

Every hit from `mine_corpus.py` includes page number — use it.

### Building the database and site

```bash
# One-time: convert corpus
python portal/scripts/convert_corpus.py

# One-time: create schema
python portal/scripts/init_db.py

# When you've authored seed entries
python portal/scripts/seed_from_json.py --seed-file portal/data/seed.json

# Generate the site
python portal/scripts/build_site.py
```

All scripts are idempotent and safe to re-run.

## Entry Checklist

Before adding an entry to `seed.json`:

- [ ] Have you read the source passage yourself?
- [ ] Does your card answer "what is this?" in 60–150 words?
- [ ] Does your body follow the structure for your entity type?
- [ ] Is every non-CONTEXT claim grounded with a `scholarly_refs` row?
- [ ] Is confidence set honestly? (HIGH only if you verified it)
- [ ] Do all `[[wiki-style]]` links point to existing entries or planned ones?
- [ ] Have you checked your work against `portal/docs/STYLE_ENTRIES.md`?

## What's Next

**Phase 1 (current):** Full-depth biography of Ibn Turka, his circle, core lettrist concepts, and the historiographical arguments that shape how we understand him.

**Phase 2 (later):** Secondary figures, institutions, other Islamicate occultists, and longer synthetic essays threading multiple entities together.

**Phase 3 (parallel):** Game design docs in `../docs/` and `../games/` cite portal slugs. The portal becomes the research spine the games stand on.

## Extending the Portal

### Add a new source to the corpus

1. Place the PDF in `research inbox/` with a filename following the convention:
   ```
   "Melvin-Koushki - Title of Paper - 2020.pdf"
   "Author - Title - Year.pdf"
   ```

2. Re-run the converter:
   ```bash
   python portal/scripts/convert_corpus.py
   ```

3. Search the new source:
   ```bash
   python portal/scripts/mine_corpus.py rank "your-term"
   ```

### Add an entity entry

1. Author the card and body as markdown in `portal/data/seed.json`.
2. Include `literature` (JSON array of DGWE citations) and `source_method`, `review_status`, `confidence`.
3. For every external claim, note the `scholarly_refs` row you'll add after the DB ingests the entry.
4. Run `seed_from_json.py` and `build_site.py`.

### Link to the portal from game design

In `../docs/` or `../games/*/`, cite portal entries by slug:

```markdown
See [[ibn-turka]] and [[ilm-al-huruf]] for the philosophical framework.
The [[treatise-on-barzakh]] explains the cosmology behind...
```

A separate script generates clickable links when needed.

---

**Last updated:** 2026-08-31  
**Corpus:** 43 sources, 42 converted (~6M characters), 1 scan-needs-OCR  
**Database:** 11 tables, ready for seed data  
**Portal status:** Scaffold complete; entries in progress
