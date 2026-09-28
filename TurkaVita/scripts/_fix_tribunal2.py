#!/usr/bin/env python3
# one-off (2026-09-27): the Tribunal's UI comment and the v2 hub sentence still said refusal is "what he actually did".
import io, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def sub(rel, a, b):
    p = os.path.join(ROOT, rel)
    s = io.open(p, encoding="utf-8", newline="").read()
    assert a in s, rel
    io.open(p, "w", encoding="utf-8", newline="").write(s.replace(a, b, 1))


sub("v2/apps/tribunal/src/ui.js",
    "// danger and punishing consequences\" — so a game about him where refusal is\n// merely defeat would be lying about the one thing we know he chose.",
    "// danger and punishing consequences\" (an uncited remark; the 2012 dissertation shows him\n// answering, in two apologies written under duress). The sources differ, so refusal is\n// a real outcome here and not a claim about what he did (docs/DECISIONS.md, 2026-09-27).")
sub("v2/index.html",
    "You may also <b>refuse to answer</b>, which is what he actually did, three times.</p>",
    "You may also <b>refuse to answer</b>, which one Melvin-Koushki text says he did and another (his dissertation, with two apologies to the rulers who judged him) does not show; here it is a real outcome, not a claim about what he did.</p>")
print("ok")
