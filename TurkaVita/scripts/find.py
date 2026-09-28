#!/usr/bin/env python3
# find.py — grep the artifacts (not the corpus) for a word: which evidence/claims/events/works say it?
#
#   python scripts/find.py Iskandar                 # id, kind, page, first 160 chars, for EV and CL
#   python scripts/find.py "Shāhrukh" --type claim -n 60
#   python scripts/find.py --show CL-0100 EV-0200   # print whole artifacts
import argparse, glob, io, json, os, re, sys, unicodedata

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def fold(s):
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c) and c not in "ʿʾ'’‘").casefold()


def load():
    out = []
    for f in glob.glob(os.path.join(ROOT, "research", "artifacts", "**", "*.json"), recursive=True):
        out.append(json.load(io.open(f, encoding="utf-8")))
    return sorted(out, key=lambda a: a["id"])


def text_of(a):
    t = a["type"]
    if t == "evidence":
        return a["content"]
    if t == "claim":
        return a["proposition"]
    if t == "event":
        return a["description"]
    if t == "work":
        return " ".join(str(a.get(k, "")) for k in ("title", "summary", "addressee", "occasion"))
    if t == "reconstruction":
        return a["question"] + " " + a["proposition"]
    return json.dumps(a, ensure_ascii=False)


def line(a, width=170):
    t = a["type"]
    extra = ""
    if t == "evidence":
        c = a["citation"]
        extra = f"[{a.get('evidence_kind')}] pdf {c['witness_page']}"
    elif t == "claim":
        extra = f"[{a['epistemic_type']}/{a['confidence']}]"
    elif t == "event":
        extra = f"[{a['date'].get('start')}{'-' + a['date']['end'] if a['date'].get('end') and a['date']['end'] != a['date'].get('start') else ''} {a['date'].get('date_kind', '')}{' FIXED' if a.get('fixed_point') else ''}]"
    elif t == "work":
        extra = f"[{a.get('date_kind')} {a.get('date', {}).get('ce', '')}]"
    return f"{a['id']} {extra} {text_of(a)[:width]}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("word", nargs="?")
    ap.add_argument("--type", help="evidence|claim|event|work|reconstruction")
    ap.add_argument("-n", type=int, default=40)
    ap.add_argument("--show", nargs="+")
    a = ap.parse_args()
    arts = load()
    if a.show:
        by = {x["id"]: x for x in arts}
        for i in a.show:
            print(json.dumps(by.get(i), indent=1, ensure_ascii=False))
        return
    w = fold(a.word or "")
    n = 0
    for x in arts:
        if a.type and x["type"] != a.type:
            continue
        if x["type"] in ("scene", "hypothesis", "biographical_model", "institution", "decision"):
            continue
        if w in fold(text_of(x)):
            print(line(x))
            n += 1
            if n >= a.n:
                break
    print(f"-- {n} shown")


if __name__ == "__main__":
    main()
