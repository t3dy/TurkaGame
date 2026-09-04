# -*- coding: utf-8 -*-
"""build_letters.py — the v2 letter table: layered properties, not one flat row.

v1 (games/abjad-tower/data/letters.json, now frozen) gave each letter a value, a
light/dark class, a mass and five form facts. v2 keeps every one of those and adds
the layers the v2 brief asks for, so the engine can answer

    "what does ب do under the current metaphysical ruleset?"

with a structured answer carrying BOTH the evidence and the affordance.

THE RULE THAT GOVERNS THIS FILE
-------------------------------
Every property here is an **observable fact about the written or spoken letter**
that a reader can check against a grammar, or a **number** the tradition states.
Nothing here is doctrine, and nothing here is invented. The doctrine lives in
../rulesets/*.json, which say who claimed what and on whose authority; this file
says only what is on the page. That division is the whole architecture: swap the
ruleset and the letters behave differently, because the ruleset is the
interpretation and this is the evidence.

The four independent divisions of the alphabet used here — and they ARE
independent, which is what makes them worth having:

  abjad value      1..1000, the series as the tradition numbers it.        PORTAL
  nūrānī/ẓulmānī   the 14 muqaṭṭaʿāt against the other 14.                 PORTAL
  sun/moon         14 letters that assimilate the lām of the definite      GRAMMAR
                   article (al-shams -> ash-shams) against 14 that do not
                   (al-qamar). Standard Arabic grammar, checkable.
  connecting       22 letters join to what follows; 6 (ا د ذ ر ز و) never  GRAMMAR
                   do, and break the written word into pieces.

Sun/moon and light/dark overlap on only six letters, which is the check that they
are two different facts rather than one fact told twice. --verify asserts it.

    python v2/data/build_letters.py [--verify]
"""

from __future__ import annotations

import argparse
import io
import json
import math
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
V1 = ROOT / "games" / "abjad-tower" / "data" / "letters.json"
DB = ROOT / "portal" / "db" / "turka.db"
OUT = HERE / "letters.json"

# The fourteen SUN letters (ḥurūf shamsiyya): the lām of the definite article
# assimilates to them. A point of grammar every Arabic primer states, and nothing
# to do with the occult — which is exactly why it is useful here.
SUN = set("تثدذرزسشصضطظلن")

# The six letters that never join to what follows. Also plain orthography: they
# are why an Arabic word can look like several pieces.
NON_CONNECTING = set("ادذرزو")

# Phonetic place of articulation, at the coarse grain every grammar agrees on.
# Used by rulesets that care where in the mouth a letter is made; no ruleset is
# obliged to use it.
ARTICULATION = {
    "ا": "throat", "ه": "throat", "ع": "throat", "ح": "throat", "غ": "throat", "خ": "throat",
    "ق": "back", "ك": "back", "ج": "palate", "ش": "palate", "ي": "palate",
    "ض": "side", "ل": "tongue-tip", "ن": "tongue-tip", "ر": "tongue-tip",
    "ط": "tongue-tip", "د": "tongue-tip", "ت": "tongue-tip",
    "ص": "whistling", "ز": "whistling", "س": "whistling",
    "ظ": "teeth", "ذ": "teeth", "ث": "teeth",
    "ف": "lip", "ب": "lip", "م": "lip", "و": "lip",
}

# The three registers of the letter. NOT invented for the game: Ibn Turka builds
# the Mafāḥiṣ out of three "Globes of Light" corresponding to the Mental, Written
# and Spoken letter, organised as an ascent, a descent, and an ascent again
# (research/notes/02-prologue-to-pythagorean-renaissance.md). The engine uses the
# three as its execution model — plan, utter, inscribe — which is where the whole
# "letters compile into world operations" idea comes from.
REGISTERS = {
    "mental": {
        "arabic": "عقلي", "translit": "ʿaqlī", "gloss": "the letter as concept",
        "engine": "DECLARE — the program is composed and its consequences computed, but the world is not touched.",
    },
    "spoken": {
        "arabic": "لفظي", "translit": "lafẓī", "gloss": "the letter as utterance",
        "engine": "ACT — the program runs once and its effects are transient; the world returns to itself.",
    },
    "written": {
        "arabic": "خطي", "translit": "khaṭṭī", "gloss": "the letter as inscription",
        "engine": "INSCRIBE — the program runs and its effects persist in the world.",
    },
}

# Which primitive each observable fact grants. The FACTS are evidence; this
# mapping is ours, and it is stated as ours in every ruleset that adopts it.
FACT_OPS = {
    "vertical":       ("AXIS",        "a single upright stroke"),
    "closed":         ("BIND",        "a form that encloses"),
    "tail":           ("POUR",        "a tail below the line"),
    "dots_above":     ("RAISE",       "dots above"),
    "dots_below":     ("LOWER",       "dots below"),
    "non_connecting": ("SEVER",       "a letter that never joins what follows"),
    "sun":            ("ASSIMILATE",  "a sun letter: the article's lām becomes it"),
    "moon":           ("DISTINGUISH", "a moon letter: the article's lām stays itself"),
}


def load_v1():
    with io.open(V1, encoding="utf-8") as f:
        return json.load(f)["letters"]


def build():
    letters = []
    for l in load_v1():
        g = l["glyph"]
        f = l["form"]
        facts = {
            "vertical": f["orientation"] == "vertical",
            "closed": bool(f["closed"]),
            "tail": bool(f["tail"]),
            "dots_above": f["dots"] if f["dot_position"] == "above" else 0,
            "dots_below": f["dots"] if f["dot_position"] == "below" else 0,
            "non_connecting": g in NON_CONNECTING,
            "sun": g in SUN,
            "moon": g not in SUN,
        }
        letters.append({
            "glyph": g,
            "name": l["name"],
            "translit": l["translit"],
            # --- numerical layer (PORTAL: abjad-numerology) ---
            "abjad": l["abjad"],
            # --- form layer (observable) ---
            "form": f,
            # --- grammar layer (observable, new in v2) ---
            "grammar": {
                "sun": g in SUN,
                "connects_forward": g not in NON_CONNECTING,
                "articulation": ARTICULATION.get(g),
            },
            # --- divisions the traditions actually use ---
            "class": l["class"],                       # nūrānī / ẓulmānī  (PORTAL)
            # --- the three registers (PORTAL via research note) ---
            "registers": {"mental": l["name"], "spoken": l["translit"], "written": g},
            # --- derived: which primitives this letter's body grants ---
            "facts": facts,
            "primitives": derive(facts),
            "note": l.get("note"),
        })
    return letters


def derive(facts):
    """The letter's instruction word, from its body. Order is fixed and matters."""
    ops = []
    for key in ("vertical", "dots_above", "dots_below", "closed", "tail",
                "non_connecting", "sun", "moon"):
        v = facts[key]
        if not v:
            continue
        op, why = FACT_OPS[key]
        ops.append({"op": op, "n": v if isinstance(v, int) else 1, "from": why})
    return ops


def verify(letters) -> int:
    problems = []

    # --- the four divisions are the sizes the tradition and the grammar state ---
    if len(letters) != 28:
        problems.append("expected 28 letters, built %d" % len(letters))
    n_sun = sum(1 for l in letters if l["grammar"]["sun"])
    if n_sun != 14:
        problems.append("expected 14 sun letters, got %d" % n_sun)
    n_light = sum(1 for l in letters if l["class"] == "nurani")
    if n_light != 14:
        problems.append("expected 14 light letters, got %d" % n_light)
    n_nc = sum(1 for l in letters if not l["grammar"]["connects_forward"])
    if n_nc != 6:
        problems.append("expected 6 non-connecting letters, got %d" % n_nc)

    # --- and they are INDEPENDENT: sun/moon is not light/dark told twice ---
    overlap = sum(1 for l in letters if l["grammar"]["sun"] and l["class"] == "nurani")
    if not (3 <= overlap <= 11):
        problems.append("sun and light overlap on %d/14 — that is one division, not two" % overlap)

    # --- every letter's abjad value is on the ladder, ascending ---
    vals = [l["abjad"] for l in letters]
    if vals != sorted(vals):
        problems.append("abjad values are not ascending")

    # --- the instruction set is derived, so its census is a fact, not a choice ---
    census = {}
    for l in letters:
        for p in l["primitives"]:
            census[p["op"]] = census.get(p["op"], 0) + 1
    # Every letter must do SOMETHING now (sun or moon is always true), which is a
    # real change from v1 where dāl and kāf were inert. Say so rather than hide it.
    inert = [l["glyph"] for l in letters if not l["primitives"]]
    if inert:
        problems.append("v2 letters should all carry at least their sun/moon primitive; inert: %s" % "".join(inert))

    # --- the portal entries the numerical layer rests on are present ---
    if DB.exists():
        conn = sqlite3.connect(DB)
        for slug in ("abjad-numerology", "ilm-al-huruf"):
            if conn.execute("SELECT 1 FROM concepts WHERE slug=?", (slug,)).fetchone() is None:
                problems.append("portal has no `%s` entry" % slug)
    else:
        problems.append("no portal DB at %s" % DB)

    for p in problems:
        print("  FAIL %s" % p, file=sys.stderr)
    if problems:
        return 1
    print("verify: OK — 28 letters; 14 sun / 14 moon, 14 light / 14 dark overlapping on "
          "%d (two divisions, not one); 6 non-connecting; abjad ascending; "
          "instruction census %s" % (overlap, census))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify", action="store_true")
    args = ap.parse_args()
    letters = build()
    if args.verify:
        return verify(letters)

    payload = {
        "_note": ("The v2 letter table. Every field is an observable fact about the written or "
                  "spoken letter, or a number the tradition states — never doctrine. Doctrine "
                  "lives in v2/rulesets/*.json, which name who claimed what. Swap the ruleset "
                  "and the letters behave differently, because the ruleset is the "
                  "interpretation and this is the evidence. Generated by v2/data/build_letters.py."),
        "divisions": {
            "abjad": "1..1000, the series as the tradition numbers it. PORTAL: abjad-numerology.",
            "nurani_zulmani": "The 14 muqaṭṭaʿāt against the other 14. PORTAL: ilm-al-huruf.",
            "sun_moon": "The 14 letters the definite article's lām assimilates to, against the 14 it does not. Standard grammar.",
            "connecting": "The 6 letters that never join what follows (ا د ذ ر ز و). Standard orthography.",
        },
        "registers": REGISTERS,
        "fact_to_primitive": {k: {"op": v[0], "from": v[1]} for k, v in FACT_OPS.items()},
        "primitive_note": ("The FACTS are evidence; the mapping from fact to primitive is OURS, "
                           "and every ruleset that adopts it says so at the point of use."),
        "letters": letters,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with io.open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    census = {}
    for l in letters:
        for p in l["primitives"]:
            census[p["op"]] = census.get(p["op"], 0) + 1
    print("%d letters -> %s\n  %s" % (len(letters), OUT.relative_to(ROOT),
          " · ".join("%s %d" % (k, v) for k, v in sorted(census.items()))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
