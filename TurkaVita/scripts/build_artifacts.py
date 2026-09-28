#!/usr/bin/env python3
# build_artifacts.py — validate every artifact JSON against schemas/artifacts.schema.json,
# rebuild db/artifacts.db, and derive the provenance graph from the references inside them.
#
#   python scripts/build_artifacts.py                   # validate + rebuild; exit 1 on any error
#   python scripts/build_artifacts.py --check --grep 'EV-04'  # validate only, errors matching a pattern
#   python scripts/build_artifacts.py --impact CL-0003  # what depends on this artifact?
#   python scripts/build_artifacts.py --ancestry SCN-0002  # why does this scene exist?
#
# Beyond PLOTINUSGAME's build, three checks that make "an agent that opened the page" enforceable:
#   * an evidence artifact's witness_page must exist in corpus.db;
#   * its printed_page, if given, must equal the running head that corpus.db read off that page;
#   * every quoted span of five or more words in its content must actually occur on that page, and
#     no quotation may run past 40 words (the copyright rule, as a test).
import argparse, glob, hashlib, io, json, os, re, sqlite3, sys, unicodedata

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB = os.path.join(ROOT, "db", "artifacts.db")
CORPUS = os.path.join(ROOT, "db", "corpus.db")
SCHEMA = os.path.join(ROOT, "schemas", "artifacts.schema.json")

REF_FIELDS = {
    "supported_by": "supported_by", "counterevidence": "counterevidence", "observed_facts": "uses",
    "cites": "cites", "alternatives": "alternative_to", "claims": "uses", "open_questions": "uses",
    "based_on": "based_on", "claim": "uses", "decides": "decides", "uses": "uses",
    "evidence": "supported_by", "hypothesis": "uses", "hypotheses": "uses",
    "institution": "uses", "courts": "uses", "work": "uses",
}
PREFIXES = ("EV-", "CL-", "REC", "EVT", "MOD", "SIT", "SCN", "DEC", "HYP", "WRK", "INS")


def artifact_files():
    return sorted(glob.glob(os.path.join(ROOT, "research", "artifacts", "**", "*.json"), recursive=True)
                  + glob.glob(os.path.join(ROOT, "narrative", "scenes", "*.json")))


def walk_refs(node, rel=None):
    if isinstance(node, dict):
        for k, v in node.items():
            yield from walk_refs(v, REF_FIELDS.get(k, rel if k not in ("effects",) else None))
    elif isinstance(node, list):
        for v in node:
            yield from walk_refs(v, rel)
    elif isinstance(node, str) and rel:
        yield rel, node


# ------------------------------------------------------------------ quotation checking
def norm(t):
    t = unicodedata.normalize("NFKC", t)
    t = re.sub(r"-\s*\n\s*", "", t)                     # line-end hyphenation
    t = t.replace("­", "")
    t = re.sub(r"[‘’ʼ]", "'", t)
    t = re.sub(r"[“”]", '"', t)
    t = re.sub(r"[–—−]", "-", t)
    t = re.sub(r"\s+", " ", t)
    return t.casefold().strip()


SPAN = re.compile(r"[“\"]([^”\"]{10,})[”\"]")
CUT = re.compile(r"…|\.\.\.|\[[^\]]*\]")


def quote_problems(content, page_text):
    """[(problem, span)] for quoted spans that are too long or not on the page."""
    out, page = [], norm(page_text)
    for m in SPAN.finditer(content):
        span = m.group(1)
        if len(span.split()) > 40:
            out.append(("quotation runs past 40 words", span[:60]))
        for frag in CUT.split(span):
            frag = frag.strip(" ,.;:")
            if len(frag.split()) >= 5 and norm(frag).strip(" ,.;:") not in page:
                out.append(("quoted text not found on the cited page", frag[:70]))
    return out


def build(check=False, grep=None):
    import jsonschema
    schema = json.load(io.open(SCHEMA, encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    errors, rows, edges = [], [], []
    corpus = sqlite3.connect(CORPUS) if os.path.exists(CORPUS) else None

    for f in artifact_files():
        rel = os.path.relpath(f, ROOT)
        raw = io.open(f, encoding="utf-8").read()
        try:
            a = json.loads(raw)
        except json.JSONDecodeError as e:
            errors.append(f"{rel}: bad JSON: {e}")
            continue
        errs = list(validator.iter_errors(a))
        if errs:
            best = jsonschema.exceptions.best_match(errs)
            errors.append(f"{rel}: schema: {best.message[:300]}")
            continue
        if a["type"] == "evidence" and corpus:
            c = a["citation"]
            hit = corpus.execute("SELECT printed_page, text FROM pages WHERE source_id=? AND page=?",
                                 (c["source_id"], c["witness_page"])).fetchone()
            if not hit:
                errors.append(f"{rel}: citation {c['source_id']} p.{c['witness_page']} is not in corpus.db")
            else:
                if c.get("printed_page") and hit[0] and str(c["printed_page"]) != str(hit[0]):
                    errors.append(f"{rel}: printed_page {c['printed_page']} but the running head on pdf p.{c['witness_page']} reads {hit[0]}")
                for why, span in quote_problems(a["content"], hit[1]):
                    errors.append(f"{rel}: {why}: '{span}'")
        rows.append((a["id"], a["type"], a.get("title") or a.get("name") or a.get("proposition") or a.get("question")
                     or a.get("issue") or a.get("description") or a.get("content"),
                     a["status"], a.get("epistemic_type"), a.get("confidence"), a.get("author") or a.get("read_by"),
                     rel, hashlib.sha1(raw.encode()).hexdigest(), raw))
        for r, dst in walk_refs(a):
            if dst != a["id"] and dst[:3] in PREFIXES:
                edges.append((a["id"], r, dst))

    ids = {r[0] for r in rows}
    dup = len(rows) - len(ids)
    if dup:
        seen = {}
        for r in rows:
            seen.setdefault(r[0], []).append(r[7])
        for k, v in seen.items():
            if len(v) > 1:
                errors.append(f"duplicate artifact id {k}: {v}")
    for s, r, d in edges:
        if d not in ids:
            errors.append(f"{s}: dangling reference {r} -> {d}")

    if not check:
        con = sqlite3.connect(DB)
        con.executescript(io.open(os.path.join(ROOT, "db", "artifacts_schema.sql"), encoding="utf-8").read())
        con.executemany("INSERT OR REPLACE INTO artifacts VALUES(?,?,?,?,?,?,?,?,?,?)", rows)
        con.executemany("INSERT OR IGNORE INTO edges VALUES(?,?,?)", edges)
        con.commit()
    if grep:
        errors = [e for e in errors if re.search(grep, e)]

    by_type = {}
    for r in rows:
        by_type[r[1]] = by_type.get(r[1], 0) + 1
    print(f"artifacts: {by_type}  edges: {len(set(edges))}")
    for e in errors:
        print("ERROR", e)
    return 1 if errors else 0


def closure(con, start, direction):
    q = ("SELECT src, rel FROM edges WHERE dst=?" if direction == "up" else "SELECT dst, rel FROM edges WHERE src=?")
    seen, frontier, out = {start}, [(start, 0)], []
    while frontier:
        node, depth = frontier.pop(0)
        for nxt, rel in con.execute(q, (node,)):
            if rel == "alternative_to":
                continue
            if nxt not in seen:
                seen.add(nxt)
                t = con.execute("SELECT artifact_type, substr(title,1,90) FROM artifacts WHERE id=?", (nxt,)).fetchone() or ("?", "")
                out.append((depth + 1, rel, nxt, t[0], t[1]))
                frontier.append((nxt, depth + 1))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--impact")
    ap.add_argument("--ancestry")
    ap.add_argument("--check", action="store_true", help="validate only; do not rewrite db/artifacts.db (safe while others write)")
    ap.add_argument("--grep", help="with --check: show only errors matching this regex (e.g. 'EV-04|CL-01')")
    a = ap.parse_args()
    if a.impact or a.ancestry:
        con = sqlite3.connect(DB)
        target = a.impact or a.ancestry
        res = closure(con, target, "up" if a.impact else "down")
        print(f"{'depends on' if a.impact else 'rests on'} {target}: {len(res)} artifact(s)")
        for depth, rel, nid, typ, title in res:
            print(f"{'  ' * depth}{nid} [{typ}] ({rel}) {title}")
        return 0
    return build(a.check, a.grep)


if __name__ == "__main__":
    sys.exit(main())
