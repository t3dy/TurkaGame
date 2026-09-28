-- artifacts.db — the KNOWLEDGE → NARRATIVE layers. Rebuilt from research/artifacts/**/*.json
-- and narrative/scenes/*.json by scripts/build_artifacts.py. The JSON files in git are the
-- truth; this database is an index over them for provenance and impact queries.
--
-- "The LLM is not the database. The LLM transforms artifacts." (voice chat §1)

DROP TABLE IF EXISTS artifacts;
DROP TABLE IF EXISTS edges;

-- Every artifact of every type, one row. body is the full JSON.
CREATE TABLE artifacts (
    id              TEXT PRIMARY KEY,      -- EV-0001, CL-0001, REC-0001, EVT-0001, SIT-0001, SCN-0001, DEC-0001, MOD-0001
    artifact_type   TEXT NOT NULL,         -- evidence | claim | reconstruction | event | biographical_model | situation | scene | decision
    title           TEXT,
    status          TEXT NOT NULL,         -- draft | needs_review | approved | rejected | superseded
    epistemic_type  TEXT,                  -- see schemas/common.schema.json
    confidence      TEXT,                  -- high | medium | low   (never a probability)
    author          TEXT,                  -- agent role or 'ted'
    file            TEXT NOT NULL,
    provenance_hash TEXT,                  -- sha1 of the file body at build time
    body            TEXT NOT NULL
);

-- The provenance graph. Every reference inside an artifact becomes an edge, so
-- "which scenes depend on this claim?" is a recursive query, not a grep.
CREATE TABLE edges (
    src TEXT NOT NULL,
    rel TEXT NOT NULL,                     -- supported_by | cites | uses | based_on | alternative_to | contradicts | counterevidence | decides
    dst TEXT NOT NULL,
    PRIMARY KEY (src, rel, dst)
);
CREATE INDEX edges_dst ON edges(dst);
