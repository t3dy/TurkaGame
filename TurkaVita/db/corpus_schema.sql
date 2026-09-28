-- corpus.db — the SOURCE WORLD layer. Rebuildable from ../research inbox (and two papers on E:\pdf)
-- by scripts/ingest_corpus.py. Gitignored: it holds the full text of copyrighted scholarship.
-- Artifacts cite into it by (source_id, witness_page); they never copy more than a short
-- attributed quotation out of it.
CREATE TABLE IF NOT EXISTS sources (
    id           TEXT PRIMARY KEY,          -- SRC-xxxxxxxxxx, stable hash of the file name
    path         TEXT NOT NULL,
    title        TEXT,
    author       TEXT,
    year         TEXT,
    kind         TEXT,                      -- scholarship | primary_in_translation
    n_pages      INTEGER,
    chars        INTEGER,
    quality      TEXT,                      -- good | partial | needs_ocr
    ingested_at  TEXT,
    notes        TEXT
);
-- page = the 1-based PDF page. printed_page is what the book itself calls the page, read from
-- the running head where there is one (the 2012 dissertation has one on every page).
CREATE TABLE IF NOT EXISTS pages (
    rowid        INTEGER PRIMARY KEY,
    source_id    TEXT NOT NULL REFERENCES sources(id),
    page         INTEGER NOT NULL,
    printed_page TEXT,
    text         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS pages_src ON pages(source_id, page);
CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(
    text, content='pages', content_rowid='rowid', tokenize='unicode61 remove_diacritics 2'
);
