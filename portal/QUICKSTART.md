# Ibn Turka Portal — Quick Start for Writers

You have a working knowledge portal scaffold. Here's the path from "I want to write an entry about Ibn Turka" to "my entry is in the database."

## The Three-Step Workflow

### 1. Search the corpus

Before writing, find what the sources actually say. The corpus is huge (~6M chars); don't read end-to-end.

```bash
# Which sources discuss Ibn Turka?
python portal/scripts/mine_corpus.py rank "Ibn Turka"

# What's in the #1 source? Get hits with page numbers.
python portal/scripts/mine_corpus.py kwic "Ibn Turka" --max 25

# Read a passage (pulls ~3000 chars around a hit)
python portal/scripts/mine_corpus.py read melvin-koushki-dissertation-yale-2012 \
    --around "chief judge" --chars 3000

# Find all dated statements in Ibn Turka's lifetime (1369-1432)
python portal/scripts/mine_corpus.py dates melvin-koushki-dissertation-yale-2012 \
    --from-year 1369 --to-year 1432
```

**Every hit includes page number.** Use that number in your `scholarly_refs` row.

### 2. Write the entry

Entries live in `portal/data/seed.json` as markdown. Follow this structure:

```json
{
  "figures": [
    {
      "slug": "ibn-turka",
      "name": "Ibn Turka",
      "name_full": "Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī",
      "name_variants": ["Ali ibn Turka", "Sayyid Ali Turka"],
      "role": "SCHOLAR",
      "lifespan": "1369-1432",
      "birth_year": 1369,
      "death_year": 1432,
      "region": "Isfahan / Cairo / Samarkand",
      "relation_to_turka": null,
      "card": "**Ibn Turka** (1369-1432), Chief Judge of Isfahan...",
      "body": "Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī was...",
      "key_works": ["treatise-on-barzakh", "book-of-radiant-lights"],
      "affiliations": ["isfahan-judiciary", "timurid-court"],
      "literature": [
        "Melvin-Koushki, Matthew. *Powers of One: Pythagorean Cosmos in Islamic Context*. Boston: BRILL, 2017.",
        "Melvin-Koushki, Matthew. *The Occult Court: Magic, Medicine, and Mathematics in the Fourteenth and Fifteenth-Century Isfahan*. Boston: BRILL, 2025."
      ],
      "tags": ["lettrism", "pythagorean", "timurid", "occult-philosophy"],
      "source_method": "CORPUS_SYNTHESIS",
      "review_status": "DRAFT",
      "confidence": "HIGH"
    }
  ]
}
```

**Card (60–150 words):** Answer "what is this?" in plain language. Example:
> Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī (1369–1432), Chief Judge of Isfahan and the foremost occult philosopher of Timurid Iran, was the first to systematize Islamic lettrism (*'ilm al-ḥurūf*) into a coherent philosophical-mathematical cosmology explicitly modeled on Pythagorean principles.

**Body (1,200–2,200 words):** Deep treatment with sections:
1. Opening (250–350 words)
2. Life and career (300–450 words)
3. Intellectual work (350–500 words)
4. Transmission and reception (250–400 words)
5. Historiographical debates (200–350 words)
6. Literature (5–12 DGWE citations)

**For a concept like *'ilm al-ḥurūf*:**
- Card: the dictionary definition
- Body: etymology → definition → history → Ibn Turka's role → technical operations → significance

See `portal/docs/STYLE_ENTRIES.md` for full templates for figures, concepts, texts, timeline events, arguments, bibliography.

### 3. Add the citations

For every non-obvious claim in your entry, add a row to `scholarly_refs` (you can do this after writing or during):

```python
scholarly_refs = [
    {
        "entity_type": "figure",
        "entity_slug": "ibn-turka",
        "bib_source_id": "melvin-koushki-dissertation-yale-2012",
        "page_ref": "35",
        "quote_or_note": "Chief Judge of Isfahan and Yazd"
    }
]
```

**Confidence levels:**
- `HIGH` — you read the passage yourself in the PDF
- `MEDIUM` — synthesized from multiple reliable sources or a good secondary summary
- `LOW` — plausible but not verified; flag it

## Add Your Entry to the Database

Once your entry is in `seed.json`:

```bash
# Ingest the seed data into the database
python portal/scripts/seed_from_json.py --seed-file portal/data/seed.json

# (Optional) Verify the entry was created
sqlite3 portal/db/turka.db "SELECT name, slug, confidence FROM figures WHERE slug='ibn-turka';"
```

That's it. Your entry is now in the database with full provenance.

## What Should I Write First?

Start with:
1. **Ibn Turka (figure)** — the central subject. Use the dissertation (350+ hits) + *Powers of One* + *Of Islamic Grammatology*.
2. **Akhlati (figure)** — his teacher. 117 hits in the dissertation, clearly attested.
3. ***'ilm al-ḥurūf* (concept)** — the core occult science. Discussed in almost every source.
4. ***Barzakh* (concept)** — the intermediate realm. Key to understanding his cosmology.
5. **Treatise on the Barzakh (text)** — his foundational work.

These five entries will establish the house style and give you confidence for the rest.

## Provenance Rules (Tl;dr)

- **Every claim outside of CONTEXT needs a source + page number.**
- **Don't write "alchemists believed X" — write "Melvin-Koushki argues (p. 42) that Ibn Turka..."**
- **If you haven't read it yourself, don't mark it `confidence: HIGH`.**
- **When in doubt, cite it.**

## Tools at Your Disposal

**Research:**
- `mine_corpus.py rank TERM` — Which sources discuss this?
- `mine_corpus.py kwic TERM` — Keyword in context (see it at a glance)
- `mine_corpus.py read SLUG --around TERM --chars N` — Pull the full passage
- `mine_corpus.py dates SLUG --from-year Y --to-year Y` — Dated events
- `mine_corpus.py names [SLUG]` — Frequency-ranked name candidates

**Database:**
- `sqlite3 portal/db/turka.db` — Query the DB directly if needed

**Writing:**
- `portal/docs/STYLE_ENTRIES.md` — Full entry templates and checklist
- `portal/data/seed.json` — Where your entries live

---

**Next:** Pick one topic above, run `rank` to find the best sources, then `read` to pull key passages. Start writing.

Questions? Check `portal/README.md` for the full architecture, or `docs/DECISIONS.md` for design rationale.
