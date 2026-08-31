"""
init_db.py — Create the Ibn Turka Portal SQLite schema.

Adapted from IslamicateOccultPortal's schema (which follows WitcherPortal /
AtalantaClaudiens / ALCHEMYTIMELINEMAP conventions), with three deliberate
differences:

  * **The card/page system is in the schema.** Every entity carries a `card`
    (60-150 word index card) and a `body` (1,000-2,200 word encyclopedia page),
    both authored as markdown in the seed files and rendered to HTML at build
    time. See `portal/docs/STYLE_ENTRIES.md` for what each must contain.

  * **`arguments` is a first-class entity.** This corpus is one scholar's
    sustained revisionist case; the historiographical arguments (against the
    "decline thesis", for occultism as science, for a Persianate Neopythagorean
    Renaissance) are load-bearing in their own right and need a
    claim / against / evidence / stakes structure that prose summary loses.

  * **No game material.** The portal is purely scholarly — no game_note fields,
    no game_connections table. Design work lives in TurkaGame's `docs/` and the
    individual `games/` folders and cites portal entries by slug. This is the
    fact/fiction separation rule, enforced by the schema rather than by
    discipline alone.

Provenance discipline is inherited unchanged: every content row carries
source_method, review_status, confidence. `confidence: HIGH` means a direct,
locatable attestation was actually read — never inferred, never guessed.

Idempotent. Load data with seed_from_json.py afterward.
"""

import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "db" / "turka.db"

SCHEMA = """
-- ============================================================
-- Ibn Turka Portal schema v1
-- ============================================================

-- Historical people: scholars, mystics, rulers, patrons, and (role
-- MODERN_SCHOLAR) the authors of the secondary literature itself.
CREATE TABLE IF NOT EXISTS figures (
    id                  INTEGER PRIMARY KEY,
    slug                TEXT UNIQUE NOT NULL,
    name                TEXT NOT NULL,         -- short display name
    name_full           TEXT,                  -- full name with nisbas/titles
    name_variants       TEXT,                  -- JSON array of transliterations
    role                TEXT CHECK(role IN ('SCHOLAR','MYSTIC','RULER','PATRON','SCRIBE','TRANSLATOR','JURIST','ASTRONOMER','PHYSICIAN','POET','MODERN_SCHOLAR')),
    lifespan            TEXT,                  -- "1369-1432", "d. 800/1397", "fl. c. 1420"
    birth_year          INTEGER,
    death_year          INTEGER,
    region              TEXT,
    relation_to_turka   TEXT,                  -- teacher / patron / rival / student / peer / posthumous / none
    card                TEXT NOT NULL,         -- 60-150 word index card (markdown)
    body                TEXT,                  -- 1,200-2,200 word encyclopedia page (markdown)
    key_works           TEXT,                  -- JSON array of text slugs
    affiliations        TEXT,                  -- JSON array of institution slugs
    literature          TEXT,                  -- JSON array of DGWE-format citation strings
    tags                TEXT,                  -- JSON array
    source_method       TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status       TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence          TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- The dictionary of concepts: occult sciences, cosmological structures,
-- techniques, diagrams, and the technical vocabulary of the tradition.
CREATE TABLE IF NOT EXISTS concepts (
    id                  INTEGER PRIMARY KEY,
    slug                TEXT UNIQUE NOT NULL,
    name                TEXT NOT NULL,
    name_arabic         TEXT,                  -- transliterated Arabic/Persian term
    name_script         TEXT,                  -- Arabic script where known
    literal_meaning     TEXT,
    category            TEXT CHECK(category IN ('OCCULT_SCIENCE','COSMOLOGY','TECHNIQUE','DIAGRAM','THEOLOGICAL','EPISTEMOLOGY','INSTITUTION_TERM','POLITICAL','HISTORIOGRAPHIC')),
    card                TEXT NOT NULL,         -- the dictionary definition, 60-150 words
    body                TEXT,                  -- 800-1,800 word encyclopedia page
    hierarchy_note      TEXT,                  -- place in a classification of the sciences
    related_concepts    TEXT,                  -- JSON array of concept slugs
    literature          TEXT,
    tags                TEXT,
    source_method       TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status       TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence          TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- Primary sources: treatises, grimoires, epistles, chronicles, commentaries.
CREATE TABLE IF NOT EXISTS texts (
    id                   INTEGER PRIMARY KEY,
    slug                 TEXT UNIQUE NOT NULL,
    title                TEXT NOT NULL,        -- transliterated title as displayed
    title_script         TEXT,                 -- Arabic/Persian script
    title_translated     TEXT,
    author_figure_slug   TEXT,                 -- soft FK -> figures.slug
    text_type            TEXT CHECK(text_type IN ('PRIMARY_TREATISE','PRIMARY_GRIMOIRE','PRIMARY_EPISTLE','PRIMARY_CHRONICLE','PRIMARY_COMMENTARY','PRIMARY_ANTHOLOGY','TRANSLATION')),
    language             TEXT,
    date_or_period       TEXT,
    card                 TEXT NOT NULL,        -- 80-150 word index card
    body                 TEXT,                 -- 1,000-1,800 word encyclopedia page
    known_manuscripts    TEXT,                 -- institution / shelfmark / folio leads
    modern_editions      TEXT,
    literature           TEXT,
    tags                 TEXT,
    source_method        TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status        TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence           TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- Courts, observatories, ateliers, orders, judiciaries, networks.
CREATE TABLE IF NOT EXISTS institutions (
    id                  INTEGER PRIMARY KEY,
    slug                TEXT UNIQUE NOT NULL,
    name                TEXT NOT NULL,
    institution_type    TEXT CHECK(institution_type IN ('COURT','OBSERVATORY','ATELIER','SUFI_ORDER','SCHOLARLY_NETWORK','JUDICIARY','MADRASA','CHANCERY','DYNASTY')),
    period              TEXT,
    region              TEXT,
    card                TEXT NOT NULL,
    body                TEXT,
    literature          TEXT,
    tags                TEXT,
    source_method       TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status       TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence          TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- The biographical timeline. `grounding` follows TurkaGame's existing
-- convention (docs/DECISIONS.md): ATTESTED / COMPARATIVE / CONTEXT.
CREATE TABLE IF NOT EXISTS timeline_events (
    id               INTEGER PRIMARY KEY,
    slug             TEXT UNIQUE NOT NULL,
    title            TEXT NOT NULL,
    year_start       INTEGER,
    year_end         INTEGER,
    date_precision   TEXT CHECK(date_precision IN ('EXACT','YEAR','CIRCA','RANGE','DISPUTED')),
    hijri_date       TEXT,
    place            TEXT,
    category         TEXT CHECK(category IN ('LIFE','POLITICS','TEXTS','OCCULT','NETWORK','INSTITUTION','CONTEXT')),
    grounding        TEXT DEFAULT 'ATTESTED' CHECK(grounding IN ('ATTESTED','COMPARATIVE','CONTEXT')),
    card             TEXT NOT NULL,            -- 40-120 word event summary
    body             TEXT,                     -- optional longer treatment
    figures_involved TEXT,                     -- JSON array of figure slugs
    texts_involved   TEXT,                     -- JSON array of text slugs
    tags             TEXT,
    source_method    TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status    TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence       TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- Historiographical arguments as first-class entities.
CREATE TABLE IF NOT EXISTS arguments (
    id                  INTEGER PRIMARY KEY,
    slug                TEXT UNIQUE NOT NULL,
    title               TEXT NOT NULL,
    proponent_slug      TEXT,                  -- soft FK -> figures.slug (MODERN_SCHOLAR)
    claim               TEXT NOT NULL,         -- what is argued, in one dense paragraph
    against             TEXT,                  -- the received view it contests
    evidence            TEXT,                  -- how it is argued
    stakes              TEXT,                  -- why it matters for the field
    scope               TEXT CHECK(scope IN ('IBN_TURKA','ISLAMICATE_OCCULT','PERIODIZATION','METHOD','COMPARATIVE')),
    contested           INTEGER DEFAULT 0,     -- 1 = other scholars have pushed back in print
    contested_note      TEXT,
    card                TEXT NOT NULL,
    body                TEXT,
    related_concepts    TEXT,                  -- JSON array of concept slugs
    literature          TEXT,
    tags                TEXT,
    source_method       TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status       TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence          TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- Scholarly secondary sources, with real document summaries.
CREATE TABLE IF NOT EXISTS bibliography (
    id                INTEGER PRIMARY KEY,
    source_id         TEXT UNIQUE NOT NULL,
    author            TEXT NOT NULL,
    title             TEXT NOT NULL,
    year              INTEGER,
    publisher         TEXT,
    journal           TEXT,
    pub_type          TEXT CHECK(pub_type IN ('monograph','article','chapter','review','encyclopedia','primary_source','edited_volume','dissertation','popular','website')),
    relevance         TEXT CHECK(relevance IN ('PRIMARY','DIRECT','CONTEXTUAL')),
    card              TEXT,                    -- 80-150 word document summary
    body              TEXT,                    -- longer summary: argument, evidence, contribution
    key_arguments     TEXT,                    -- JSON array of argument slugs
    corpus_file       TEXT,                    -- portal/corpus/sources/<slug>.md
    conversion_status TEXT DEFAULT 'CONVERTED' CHECK(conversion_status IN ('CONVERTED','SCANNED_NEEDS_OCR','NOT_CONVERTED','EXTERNAL')),
    char_count        INTEGER,
    page_count        INTEGER,
    online_url        TEXT,
    access_note       TEXT
);

-- Polymorphic link: any entity -> bibliography entry, with page reference.
-- This is the citation spine of the portal. Every non-CONTEXT claim should
-- eventually be reachable through one of these rows.
CREATE TABLE IF NOT EXISTS scholarly_refs (
    id              INTEGER PRIMARY KEY,
    entity_type     TEXT NOT NULL CHECK(entity_type IN ('figure','concept','text','institution','event','argument','image')),
    entity_slug     TEXT NOT NULL,
    bib_source_id   TEXT NOT NULL REFERENCES bibliography(source_id),
    page_ref        TEXT,
    quote_or_note   TEXT
);

-- Image catalog: what is *available*, distinct from
-- assets/manuscripts/registry.json, which tracks only images actually
-- rights-cleared and copied for game use.
CREATE TABLE IF NOT EXISTS images (
    id                INTEGER PRIMARY KEY,
    slug              TEXT UNIQUE NOT NULL,
    caption           TEXT NOT NULL,
    depicts           TEXT,
    image_type        TEXT CHECK(image_type IN ('MANUSCRIPT_PAGE','DIAGRAM','PORTRAIT','ARCHITECTURE','OBJECT','MAP','MAGIC_SQUARE','OTHER')),
    institution       TEXT,
    shelfmark         TEXT,
    folio             TEXT,
    date_or_period    TEXT,
    extracted_file    TEXT,
    extraction_method TEXT,
    rights_status     TEXT DEFAULT 'UNDETERMINED' CHECK(rights_status IN ('UNDETERMINED','LIKELY_PD_ARTIFACT_REPRO_RIGHTS_UNCLEAR','CLEARED','DO_NOT_USE')),
    source_bib_id     TEXT,
    source_page       INTEGER,
    notes             TEXT,
    tags              TEXT,
    source_method     TEXT DEFAULT 'PDF_EXTRACTION',
    review_status     TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence        TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

-- Long-form synthesis threading multiple entities together.
CREATE TABLE IF NOT EXISTS essays (
    id               INTEGER PRIMARY KEY,
    slug             TEXT UNIQUE NOT NULL,
    title            TEXT NOT NULL,
    subtitle         TEXT,
    card             TEXT,
    body             TEXT NOT NULL,
    related_entities TEXT,                     -- JSON array of {type, slug, label}
    literature       TEXT,
    source_method    TEXT DEFAULT 'CORPUS_SYNTHESIS',
    review_status    TEXT DEFAULT 'DRAFT' CHECK(review_status IN ('DRAFT','REVIEWED','VERIFIED')),
    confidence       TEXT DEFAULT 'MEDIUM' CHECK(confidence IN ('HIGH','MEDIUM','LOW'))
);

CREATE TABLE IF NOT EXISTS schema_version (
    version     INTEGER PRIMARY KEY,
    applied_at  TEXT DEFAULT (datetime('now')),
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_refs_entity ON scholarly_refs(entity_type, entity_slug);
CREATE INDEX IF NOT EXISTS idx_refs_bib    ON scholarly_refs(bib_source_id);
CREATE INDEX IF NOT EXISTS idx_events_year ON timeline_events(year_start);
CREATE INDEX IF NOT EXISTS idx_figs_death  ON figures(death_year);

INSERT OR IGNORE INTO schema_version (version, description)
VALUES (1, 'Ibn Turka Portal v1: figures, concepts, texts, institutions, timeline_events, arguments, bibliography, scholarly_refs, images, essays. Card/page system on every entity. Purely scholarly - no game tables by design.');
"""

EXPECTED = {
    'figures', 'concepts', 'texts', 'institutions', 'timeline_events',
    'arguments', 'bibliography', 'scholarly_refs', 'images', 'essays',
    'schema_version',
}


def main() -> int:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)
    tables = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'")}
    conn.close()

    print(f"Database: {DB_PATH}")
    print(f"Tables ({len(tables)}): {', '.join(sorted(tables))}")
    missing = EXPECTED - tables
    if missing:
        print(f"ERROR: missing tables: {missing}")
        return 1
    print("Schema v1 ready.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
