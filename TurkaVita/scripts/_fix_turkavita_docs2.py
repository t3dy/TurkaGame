#!/usr/bin/env python3
# one-off (2026-09-28), second half of _fix_turkavita_docs.py (HANDOVER.md and CLAUDE.md), after its first half applied.
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def sub(rel, pairs):
    p = os.path.join(ROOT, rel)
    s = io.open(p, encoding="utf-8", newline="").read()
    for a, b in pairs:
        assert a in s, (rel, a[:60])
        s = s.replace(a, b, 1)
    io.open(p, "w", encoding="utf-8", newline="").write(s)


start = "1. **Read `docs/TURKA_AUDIT.md`.**"
p = os.path.join(ROOT, "HANDOVER.md")
s = io.open(p, encoding="utf-8", newline="").read()
i = s.index(start)
j = s.index("2. **The four assumed calls**")
new1 = ("1. **The older documents are corrected** (2026-09-28, Ted's standing rule *always correct older documents to match the most current information*, DECISIONS 14). "
        "`docs/TURKA_AUDIT.md` lists twelve places where the older BIOGRAPHY.md / timeline.json / LETTRISMRESEARCH.md / the plan differed from the dissertation and nine where Melvin-Koushki's own papers disagree; "
        "its section F says what was corrected (TurkaGame docs, site and timeline data, portal and the Islamicate portal, CareerSim, the Tribunal, the wiki and workspace files) and what was left on purpose (the frozen games under `games/`, archived snapshots, raw transcripts). "
        "**The frozen visual novel still teaches the old picture in its scenes**: `games/visual-novel/ERRATA.md` lists 18 premises; changing them means overriding `games/FROZEN.md`, which is your call.\n")
s = s[:i] + new1 + s[j:]
io.open(p, "w", encoding="utf-8", newline="").write(s)
sub("HANDOVER.md", [(
    "corrections held for the audit. \"Go\" was taken as approval to commit and deploy, **not** as approval to edit the older docs: those are still uncorrected.",
    "corrections (now made: see 1). \"Go\" was taken as approval to commit and deploy; the standing rule to correct older documents came next.")])
sub("CLAUDE.md", [("(nothing is corrected until Ted has seen it)",
                   "(the older documents were corrected to it on 2026-09-28; section F says what, and what was left on purpose)")])
print("ok")
