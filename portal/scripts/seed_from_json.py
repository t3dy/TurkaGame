"""
seed_from_json.py — Ingest hand-authored entries from seed.json into the database.

Idempotent: re-runs safely without duplicating data. Entries in seed.json are
inserted or updated based on slug uniqueness. If an entry already exists in the
database, the JSON data takes precedence (overwrites).

Usage:
    python portal/scripts/seed_from_json.py --seed-file portal/data/seed.json
"""

import argparse
import json
import sqlite3
import sys
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "db" / "turka.db"
SEED_DEFAULT = BASE_DIR / "data" / "seed.json"


def load_seed(path: Path) -> dict[str, Any]:
    with open(path, 'r', encoding='utf-8') as f:
        seed = json.load(f)
    assert_unique(seed)
    return seed


def assert_unique(seed: dict[str, Any]) -> None:
    """Fail loudly on duplicate keys.

    INSERT OR REPLACE silently collapses duplicates, so a seed file can carry two
    copies of an entry indefinitely while the database looks correct. It did:
    sharaf-al-din-yazdi and qazizada-rumi were each in there twice.
    """
    problems = []
    for table, key in (('figures', 'slug'), ('concepts', 'slug'),
                       ('institutions', 'slug'), ('texts', 'slug'),
                       ('arguments', 'slug'), ('timeline_events', 'slug'),
                       ('bibliography', 'source_id')):
        seen: set[str] = set()
        for item in seed.get(table, []):
            ident = item.get(key)
            if ident in seen:
                problems.append(f"  {table}: duplicate {key} {ident!r}")
            seen.add(ident)
    if problems:
        raise SystemExit("Duplicate entries in seed.json:\n" + "\n".join(problems))


def ingest_figures(conn: sqlite3.Connection, figures: list[dict]) -> int:
    c = conn.cursor()
    for fig in figures:
        c.execute("""
            INSERT OR REPLACE INTO figures (
                slug, name, name_full, name_variants, role, lifespan,
                birth_year, death_year, region, relation_to_turka,
                card, body, key_works, affiliations, literature,
                tags, source_method, review_status, confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            fig['slug'], fig['name'], fig.get('name_full'),
            json.dumps(fig.get('name_variants', [])),
            fig['role'], fig['lifespan'],
            fig.get('birth_year'), fig.get('death_year'),
            fig.get('region'), fig.get('relation_to_turka'),
            fig['card'], fig.get('body'),
            json.dumps(fig.get('key_works', [])),
            json.dumps(fig.get('affiliations', [])),
            json.dumps(fig.get('literature', [])),
            json.dumps(fig.get('tags', [])),
            fig.get('source_method', 'CORPUS_SYNTHESIS'),
            fig.get('review_status', 'DRAFT'),
            fig.get('confidence', 'MEDIUM')
        ))
    conn.commit()
    return len(figures)


def ingest_concepts(conn: sqlite3.Connection, concepts: list[dict]) -> int:
    c = conn.cursor()
    for con in concepts:
        c.execute("""
            INSERT OR REPLACE INTO concepts (
                slug, name, name_arabic, name_script, literal_meaning,
                category, card, body, hierarchy_note, related_concepts,
                literature, tags, source_method, review_status, confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            con['slug'], con['name'], con.get('name_arabic'),
            con.get('name_script'), con.get('literal_meaning'),
            con['category'], con['card'], con.get('body'),
            con.get('hierarchy_note'), json.dumps(con.get('related_concepts', [])),
            json.dumps(con.get('literature', [])),
            json.dumps(con.get('tags', [])),
            con.get('source_method', 'CORPUS_SYNTHESIS'),
            con.get('review_status', 'DRAFT'),
            con.get('confidence', 'MEDIUM')
        ))
    conn.commit()
    return len(concepts)


def ingest_bibliography(conn: sqlite3.Connection, bibs: list[dict]) -> int:
    c = conn.cursor()
    for bib in bibs:
        c.execute("""
            INSERT OR REPLACE INTO bibliography (
                source_id, author, title, year, publisher, journal, pub_type,
                relevance, card, body, key_arguments, corpus_file,
                conversion_status, char_count, page_count, online_url, access_note, sections
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            bib['source_id'], bib['author'], bib['title'],
            bib.get('year'), bib.get('publisher'), bib.get('journal'),
            bib['pub_type'], bib['relevance'],
            bib.get('card'), bib.get('body'),
            json.dumps(bib.get('key_arguments', [])),
            bib.get('corpus_file'),
            bib.get('conversion_status', 'CONVERTED'),
            bib.get('char_count'), bib.get('page_count'),
            bib.get('online_url'), bib.get('access_note'),
            json.dumps(bib.get('sections', []))
        ))
    conn.commit()
    return len(bibs)




def ingest_institutions(conn: sqlite3.Connection, institutions: list[dict]) -> int:
    c = conn.cursor()
    for inst in institutions:
        c.execute("""
            INSERT OR REPLACE INTO institutions (
                slug, name, institution_type, period, region, card, body,
                literature, tags, source_method, review_status, confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            inst['slug'], inst['name'], inst.get('type', 'SCHOLARLY_NETWORK'),
            inst.get('period'), inst.get('location'),
            inst.get('card'), inst.get('body'),
            json.dumps(inst.get('literature', [])),
            json.dumps(inst.get('tags', [])),
            inst.get('source_method', 'CORPUS_SYNTHESIS'),
            inst.get('review_status', 'DRAFT'),
            inst.get('confidence', 'MEDIUM')
        ))
    conn.commit()
    return len(institutions)


def ingest_texts(conn: sqlite3.Connection, texts: list[dict]) -> int:
    c = conn.cursor()
    for txt in texts:
        c.execute("""
            INSERT OR REPLACE INTO texts (
                slug, title, title_script, title_translated, author_figure_slug,
                text_type, language, date_or_period, card, body, known_manuscripts,
                modern_editions, literature, tags, source_method, review_status, confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            txt['slug'], txt['title'], txt.get('title_script'),
            txt.get('title_translated'), txt.get('author_figure_slug'),
            txt['text_type'], txt.get('language'),
            txt.get('date_or_period'), txt.get('card'), txt.get('body'),
            json.dumps(txt.get('known_manuscripts', [])),
            json.dumps(txt.get('modern_editions', [])),
            json.dumps(txt.get('literature', [])),
            json.dumps(txt.get('tags', [])),
            txt.get('source_method', 'CORPUS_SYNTHESIS'),
            txt.get('review_status', 'DRAFT'),
            txt.get('confidence', 'MEDIUM')
        ))
    conn.commit()
    return len(texts)


def ingest_arguments(conn: sqlite3.Connection, arguments: list[dict]) -> int:
    c = conn.cursor()
    for arg in arguments:
        c.execute("""
            INSERT OR REPLACE INTO arguments (
                slug, title, card, body, literature, tags,
                source_method, review_status, confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            arg['slug'], arg['title'], arg.get('card'), arg.get('body'),
            json.dumps(arg.get('literature', [])),
            json.dumps(arg.get('tags', [])),
            arg.get('source_method', 'CORPUS_SYNTHESIS'),
            arg.get('review_status', 'DRAFT'),
            arg.get('confidence', 'MEDIUM')
        ))
    conn.commit()
    return len(arguments)
def ingest_timeline(conn: sqlite3.Connection, events: list[dict]) -> int:
    c = conn.cursor()
    for ev in events:
        c.execute("""
            INSERT OR REPLACE INTO timeline_events (
                slug, title, year_start, year_end, date_precision, hijri_date, place,
                category, grounding, card, body, figures_involved, texts_involved,
                tags, source_method, review_status, confidence
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ev['slug'], ev['title'], ev.get('year_start'), ev.get('year_end'),
            ev.get('date_precision'), ev.get('hijri_date'), ev.get('place'),
            ev['category'], ev.get('grounding', 'ATTESTED'),
            ev['card'], ev.get('body'),
            json.dumps(ev.get('figures_involved', [])),
            json.dumps(ev.get('texts_involved', [])),
            json.dumps(ev.get('tags', [])),
            ev.get('source_method', 'CORPUS_SYNTHESIS'),
            ev.get('review_status', 'DRAFT'),
            ev.get('confidence', 'MEDIUM'),
        ))
    conn.commit()
    return len(events)


def prune(conn: sqlite3.Connection, seed: dict[str, Any]) -> int:
    """Delete rows whose entry is no longer in seed.json.

    INSERT OR REPLACE only ever adds or overwrites, so an entry removed from the seed
    file lingered in the database forever and build_site.py went on publishing a page
    for it. That is how five merged concept stubs stayed live after being merged away.
    seed.json is the source of truth; the database should not outlive it.
    """
    removed = 0
    c = conn.cursor()
    for table, key in (('figures', 'slug'), ('concepts', 'slug'),
                       ('institutions', 'slug'), ('texts', 'slug'),
                       ('arguments', 'slug'), ('timeline_events', 'slug'),
                       ('bibliography', 'source_id')):
        try:
            live = {i.get(key) for i in seed.get(table, [])}
            have = {r[0] for r in c.execute(f"SELECT {key} FROM {table}")}
        except sqlite3.OperationalError:
            continue  # table not in this schema version
        stale = have - live
        for ident in stale:
            c.execute(f"DELETE FROM {table} WHERE {key} = ?", (ident,))
            print(f"  pruned {table}: {ident}")
        removed += len(stale)
    conn.commit()
    return removed


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--seed-file', type=Path, default=SEED_DEFAULT)
    ap.add_argument('--no-prune', action='store_true',
                    help='keep database rows that are no longer in the seed file')
    args = ap.parse_args()

    if not args.seed_file.exists():
        print(f"Seed file not found: {args.seed_file}")
        return 1
    if not DB_PATH.exists():
        print(f"Database not found: {DB_PATH}")
        print("Run: python portal/scripts/init_db.py")
        return 1

    print(f"Loading seed from {args.seed_file}...")
    seed = load_seed(args.seed_file)

    conn = sqlite3.connect(DB_PATH)
    try:
        n_fig = ingest_figures(conn, seed.get('figures', []))
        n_con = ingest_concepts(conn, seed.get('concepts', []))
        n_inst = ingest_institutions(conn, seed.get('institutions', []))
        n_txt = ingest_texts(conn, seed.get('texts', []))
        n_arg = ingest_arguments(conn, seed.get('arguments', []))
        n_bib = ingest_bibliography(conn, seed.get('bibliography', []))
        n_tl = ingest_timeline(conn, seed.get('timeline_events', []))

        print(f"Ingested {n_fig} figures, {n_con} concepts, {n_inst} institutions, {n_txt} texts, {n_arg} arguments, {n_bib} bibliography entries, {n_tl} timeline events.")

        if not args.no_prune:
            n_pruned = prune(conn, seed)
            if n_pruned:
                print(f"Pruned {n_pruned} row(s) no longer present in the seed file.")

        # Verify
        c = conn.cursor()
        for table in ('figures', 'concepts', 'bibliography'):
            count = c.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            print(f"  {table}: {count} rows")
        return 0
    finally:
        conn.close()


if __name__ == "__main__":
    sys.exit(main())
