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

THE ATTESTED LAYER (added 2026-09-07)
-------------------------------------
Two further divisions are neither form nor grammar: they are things particular
medieval texts SAY about the letters, and the texts disagree with each other. They
are carried here, in `attested`, because they are checkable statements with page
citations -- not because the engine acts on them. Nothing in the engine reads them
yet; a ruleset that wants them must say so and cite. See LETTRISMRESEARCH.md §3.

  nature      hot / cold / wet / dry, seven each, cycling down the abjad order.
              SOURCE: Kitab Sharasim al-Hindiyya, fols. 322b-323a, translated by
              Jean-Charles Coulon in Saif, Leoni, Melvin-Koushki & Yahya (eds.),
              Islamicate Occult Sciences in Theory and Practice (Brill, 2021),
              pp. 346-347. The text itself reports three rival schemes and judges
              this one al-alyaq, "most appropriate"; al-Buni's own table differs
              again (Manba' usul al-hikma p. 66, REPORTED via Martin pp. 61-62).
  mansion     the lunar mansion, one per letter in abjad order; alif is al-natl.
              SOURCE: Shams al-ma'arif, Suleymaniye MS B89 f. 4r, translated by
              Daniel Martin Varisco, Arabica 64 (2017), pp. 501-502.
  omen        al-Buni's dot scale on the same folio: undotted letters are
              auspicious mansions, dotted ones inauspicious, "those with three
              diacritical points are the most inauspicious, such as the shin and
              the tha'." Degree = the number of dots.
  above       at any moment fourteen mansions "are visible above the earth and
              fourteen are below" (same folio). Recorded as the index parity that
              a turn scheduler would rotate; NOT a claim that this letter is up now.

--verify checks all of it the only way that means anything: the natures must come
out seven and seven and seven and seven, the mansions must be 1..28 with no gaps,
and the dotted/undotted split must match al-Buni's OWN LISTS, which he gives
letter by letter -- fifteen dotted, thirteen undotted. That check passes, and it is
the strongest evidence we have that our letter table and his are the same alphabet.

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


# --- the letternames, for taksir --------------------------------------------
#
# Taksir (cognate to Hebrew temurah) is described by Melvin-Koushki, Prologue to
# Pythagorean Renaissance, n. 35: it "involves the muqatta'at- and
# Moonsplitting-inspired separation of the letters of a name or word and the
# writing out of the letternames in full, then the elimination of repeated
# letters, the term zubur refers to the first letters in the full letternames
# (e.g., the A in ALF) and bayyinat to the remaining letters (LF in ALF) -- so by
# definition the occult code behind every manifest word, and therefore the world
# itself."
#
# To run that as an algorithm the game needs each letter's NAME SPELLED IN THE
# ALPHABET. These are the ordinary Arabic spellings, and two things about them are
# ours and are said here rather than buried:
#
#   1. HAMZA IS DROPPED. Sixteen names end in -a' and are ordinarily written with
#      a final hamza (ba' as BAA'). Hamza is not one of the twenty-eight, and
#      taksir operates on the twenty-eight, so the names are spelled without it
#      (BA). This matches MK's own worked example, which gives alif as ALF -- three
#      letters, no hamza. INTERPRETATION, ours.
#   2. SPELLINGS VARY IN THE TRADITION. Alif is written ALF here, after MK; other
#      lettrists write it ALYF, and the choice changes what a taksir yields. A
#      ruleset that wants the other convention should say so and cite it.
#
# --verify checks the structural fact that makes these checkable at all: EVERY
# LETTERNAME BEGINS WITH ITS OWN LETTER, and every letter used inside any name is
# one of the twenty-eight. If a name were mistyped, one of those two almost
# certainly breaks.
LETTERNAMES = {
    "\u0627": "\u0627\u0644\u0641",              # alif  ALF
    "\u0628": "\u0628\u0627",                    # ba    BA
    "\u062c": "\u062c\u064a\u0645",              # jim   JYM
    "\u062f": "\u062f\u0627\u0644",              # dal   DAL
    "\u0647": "\u0647\u0627",                    # ha    HA
    "\u0648": "\u0648\u0627\u0648",              # waw   WAW
    "\u0632": "\u0632\u0627\u064a",              # zay   ZAY
    "\u062d": "\u062d\u0627",                    # ha'   HA
    "\u0637": "\u0637\u0627",                    # ta'   TA
    "\u064a": "\u064a\u0627",                    # ya'   YA
    "\u0643": "\u0643\u0627\u0641",              # kaf   KAF
    "\u0644": "\u0644\u0627\u0645",              # lam   LAM
    "\u0645": "\u0645\u064a\u0645",              # mim   MYM
    "\u0646": "\u0646\u0648\u0646",              # nun   NWN
    "\u0633": "\u0633\u064a\u0646",              # sin   SYN
    "\u0639": "\u0639\u064a\u0646",              # 'ayn  'YN
    "\u0641": "\u0641\u0627",                    # fa'   FA
    "\u0635": "\u0635\u0627\u062f",              # sad   SAD
    "\u0642": "\u0642\u0627\u0641",              # qaf   QAF
    "\u0631": "\u0631\u0627",                    # ra'   RA
    "\u0634": "\u0634\u064a\u0646",              # shin  SHYN
    "\u062a": "\u062a\u0627",                    # ta'   TA
    "\u062b": "\u062b\u0627",                    # tha'  THA
    "\u062e": "\u062e\u0627",                    # kha'  KHA
    "\u0630": "\u0630\u0627\u0644",              # dhal  DHAL
    "\u0636": "\u0636\u0627\u062f",              # dad   DAD
    "\u0638": "\u0638\u0627",                    # za'   ZA
    "\u063a": "\u063a\u064a\u0646",              # ghayn GHYN
}

# --- the attested layer: what particular texts say, with citations -----------

# Kitab Sharasim al-Hindiyya, fols. 322b-323a (Coulon in Saif et al. 2021,
# pp. 346-347). The list simply cycles hot, cold, wet, dry down the abjad order,
# which the translation states outright: "Alif is hot, ba' is cold, jim is wet,
# dal is dry, ha' is hot, waw is cold..." Written as the cycle rather than as 28
# hand-typed values so that a transcription slip is impossible; --verify then
# checks the counts come out seven and seven and seven and seven.
NATURE_CYCLE = ("hot", "cold", "wet", "dry")

# Shams al-ma'arif, Suleymaniye B89 f. 4r (Varisco 2017, pp. 501-502): the letters
# take the mansions "according to the number of the twenty-eight mansions", in
# order. Only the first is named in the passage we hold.
MANSION_1 = "al-nath"

# The same folio's own lists, transliterated as Varisco prints them. Kept as the
# CHECK rather than as the source of the dot counts: the dots come from the form
# layer, and --verify asserts the two agree. If they ever disagree, one of us has
# the wrong alphabet, and it is worth knowing which.
BUNI_DOTTED = "\u0628\u062a\u062b\u062c\u062e\u0630\u0632\u0634\u0636\u0638\u063a\u0641\u0642\u0646\u064a"
BUNI_UNDOTTED = "\u0627\u062d\u062f\u0631\u0637\u0643\u0644\u0645\u0635\u0639\u0633\u0647\u0648"


def load_v1():
    with io.open(V1, encoding="utf-8") as f:
        return json.load(f)["letters"]


def build():
    letters = []
    for i, l in enumerate(load_v1()):
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
            # --- the attested layer: what particular texts SAY (see the docstring
            #     and LETTRISMRESEARCH.md §3). Evidence with citations, not doctrine;
            #     no engine code reads this yet, and a ruleset that wants it must cite.
            # --- the lettername, spelled in the alphabet, for taksir (engine/taksir.js) ---
            "lettername": LETTERNAMES[g],
            "zubur": LETTERNAMES[g][0],
            "bayyinat": LETTERNAMES[g][1:],
            "attested": {
                "nature": NATURE_CYCLE[i % 4],
                "nature_source": "Kitab Sharasim al-Hindiyya ff. 322b-323a, tr. Coulon in Saif et al. 2021, pp. 346-347",
                "mansion": i + 1,
                "mansion_name": MANSION_1 if i == 0 else None,
                "mansion_source": "Shams al-ma'arif, Suleymaniye B89 f. 4r, tr. Varisco, Arabica 64 (2017), pp. 501-502",
                "omen": ("auspicious" if (facts["dots_above"] + facts["dots_below"]) == 0
                         else "inauspicious"),
                "omen_degree": facts["dots_above"] + facts["dots_below"],
                "omen_source": "same folio: undotted mansions auspicious, dotted inauspicious, three dots most of all",
            },
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

    # --- the letternames: every name begins with its own letter, and uses only
    #     letters of the alphabet. That is what makes a typo detectable at all. ---
    alphabet = set(l["glyph"] for l in letters)
    if len(LETTERNAMES) != 28:
        problems.append("expected 28 letternames, have %d" % len(LETTERNAMES))
    for l in letters:
        name = l["lettername"]
        if not name:
            problems.append("%s has no lettername" % l["glyph"])
            continue
        if name[0] != l["glyph"]:
            problems.append("the name of %s should begin with %s, got %s" % (l["glyph"], l["glyph"], name[0]))
        stray = set(name) - alphabet
        if stray:
            problems.append("the name of %s uses %s, not in the alphabet" % (l["glyph"], "".join(stray)))
        if l["bayyinat"] != name[1:]:
            problems.append("%s: bayyinat should be the name minus its first letter" % l["glyph"])
    # taksir is only interesting if names introduce letters the word did not have
    introduced = set()
    for l in letters:
        introduced |= set(l["bayyinat"])
    if len(introduced) < 5:
        problems.append("the letternames introduce only %d distinct letters; taksir would be inert" % len(introduced))

    # --- the attested layer: the texts' own counts must come out ---
    natures = {}
    for l in letters:
        natures[l["attested"]["nature"]] = natures.get(l["attested"]["nature"], 0) + 1
    if sorted(natures.values()) != [7, 7, 7, 7]:
        problems.append("the Sharasim's natures should be seven each, got %s" % natures)
    mansions = [l["attested"]["mansion"] for l in letters]
    if mansions != list(range(1, 29)):
        problems.append("mansions should be 1..28 in abjad order, got %s" % mansions[:5])
    # adjacent letters in abjad order never share a nature, because the list cycles
    if any(letters[i]["attested"]["nature"] == letters[i + 1]["attested"]["nature"]
           for i in range(len(letters) - 1)):
        problems.append("the nature cycle should make adjacent letters differ")

    # --- and the check that matters: our dots are al-Buni's dots ---
    ours_dotted = "".join(l["glyph"] for l in letters
                          if l["facts"]["dots_above"] + l["facts"]["dots_below"] > 0)
    ours_undotted = "".join(l["glyph"] for l in letters
                            if l["facts"]["dots_above"] + l["facts"]["dots_below"] == 0)
    if set(ours_dotted) != set(BUNI_DOTTED):
        problems.append("our dotted letters differ from al-Buni's list (f. 4r): ours %s, his %s"
                        % (ours_dotted, BUNI_DOTTED))
    if set(ours_undotted) != set(BUNI_UNDOTTED):
        problems.append("our undotted letters differ from al-Buni's list (f. 4r): ours %s, his %s"
                        % (ours_undotted, BUNI_UNDOTTED))
    if len(ours_dotted) != 15 or len(ours_undotted) != 13:
        problems.append("al-Buni says fifteen dotted and thirteen undotted; we have %d and %d"
                        % (len(ours_dotted), len(ours_undotted)))

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
    print("verify: letternames OK — 28 names, each beginning with its own letter, "
          "each spelled only in the alphabet; their bayyinat draw on %d distinct letters (%s)"
          % (len(introduced), "".join(sorted(introduced))))
    print("verify: attested layer OK — natures 7/7/7/7 cycling so neighbours differ; "
          "mansions 1..28; and our %d dotted / %d undotted letters match al-Buni's own "
          "lists on Shams al-ma'arif f. 4r, letter for letter"
          % (len(ours_dotted), len(ours_undotted)))
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
