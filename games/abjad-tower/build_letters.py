# -*- coding: utf-8 -*-
"""build_letters.py — generate data/letters.json and data/correspondences.json.

The whole design rests on one fact from the portal's own `ilm-al-huruf` entry:

    "Ibn Turka systematized a correspondence between: the 28 letters, the 28
     divine names, the 28 lunar mansions, 28 levels of celestial and sublunary
     reality, 28 human faculties."

A correspondence table with a *number* attached to every row is already a game.
`abjad-numerology` supplies the number: alif = 1 through ghayn = 1000. So a block's
abjad value becomes its **mass**, and the table stops being a lookup and starts
being physics.

Two more facts do real mechanical work:

  * The letters divide into **light (nūrānī)** and **dark (ẓulmānī)**. The light
    ones are the fourteen *muqaṭṭaʿāt*, the detached letters that open twenty-nine
    Sūras — "exactly half the alphabet", and "naturally a primary matrix of
    lettrism" (Melvin-Koushki, *Being with a Capital B*, 2). A 14/14 split is a
    switch you can build a game mode on.
  * **B is "the first of the dark letters and the fountainhead of all duality"**,
    which is why the Qur'an opening on it rather than on A is a genuine puzzle in
    the tradition (portal entry `ilm-al-huruf`, citing the *R. al-Bāʾiyya*).

2026-09-03 — two more layers, per docs/PUZZLE_GAME_IDEAS.md:

  * **form** — what the written glyph observably is (orientation, dots and where
    they sit, whether it encloses a counter, whether it descends below the line).
    These are facts about the standard isolated naskh form, not occult claims, and
    a reviewer who disagrees with a row should correct the row, not the idea.
  * **registers** — the three levels of the letter Ibn Turka builds the *Mafāḥiṣ*
    on: mental, spoken, written (research/notes/02-prologue-to-pythagorean-
    renaissance.md). Here just the three names a block can be called by.

And a second file, **correspondences.json**: not a table but a list of *schemes*,
because the tradition does not agree on what a letter's temperament is, and the
game's play is finding out which scheme is operative. Each scheme carries its
grounding kind. Where the repo's corpus does not contain the historical table
(Ibn ʿArabī's hot/cold assignment is the main case) the file says so and ships
schemes that are explicitly ours, rather than inventing a "historical" one.

Nothing here is invented as history: run with --verify to check the letter set,
the light letters, the form facts and the scheme coverage against
`portal/db/turka.db`, which is the upstream source of truth.

    python games/abjad-tower/build_letters.py [--verify]
"""

from __future__ import annotations

import argparse
import io
import json
import math
import re
import sqlite3
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
DB = ROOT / "portal" / "db" / "turka.db"
OUT = Path(__file__).resolve().parent / "data" / "letters.json"
OUT_CORR = Path(__file__).resolve().parent / "data" / "correspondences.json"

# The twenty-eight, in abjad order (abjad hawwaz ḥuṭṭī…), which is the order the
# numbering follows — NOT the dictionary order.
#   glyph, name, translit, abjad value
ABJAD = [
    ("ا", "alif",  "ʾ", 1),    ("ب", "bāʾ",   "b", 2),    ("ج", "jīm",  "j", 3),
    ("د", "dāl",   "d", 4),    ("ه", "hāʾ",   "h", 5),    ("و", "wāw",  "w", 6),
    ("ز", "zāy",   "z", 7),    ("ح", "ḥāʾ",   "ḥ", 8),    ("ط", "ṭāʾ",  "ṭ", 9),
    ("ي", "yāʾ",   "y", 10),   ("ك", "kāf",   "k", 20),   ("ل", "lām",  "l", 30),
    ("م", "mīm",   "m", 40),   ("ن", "nūn",   "n", 50),   ("س", "sīn",  "s", 60),
    ("ع", "ʿayn",  "ʿ", 70),   ("ف", "fāʾ",   "f", 80),   ("ص", "ṣād",  "ṣ", 90),
    ("ق", "qāf",   "q", 100),  ("ر", "rāʾ",   "r", 200),  ("ش", "shīn", "š", 300),
    ("ت", "tāʾ",   "t", 400),  ("ث", "thāʾ",  "ṯ", 500),  ("خ", "khāʾ", "ḫ", 600),
    ("ذ", "dhāl",  "ḏ", 700),  ("ض", "ḍād",   "ḍ", 800),  ("ظ", "ẓāʾ",  "ẓ", 900),
    ("غ", "ghayn", "ġ", 1000),
]

# The fourteen muqaṭṭaʿāt — the "light" letters. Exactly half the alphabet, which
# is the numerical fact the tradition leans on hardest.
NURANI = {"ا", "ل", "م", "ص", "ر", "ك", "ه", "ي", "ع", "ط", "س", "ح", "ق", "ن"}

# A short gloss per letter where the tradition gives one worth surfacing in play.
# Absent = no gloss shown; the game does not invent lore to fill the gap.
NOTES = {
    "ا": "Avatar of divine Oneness and of the beginning of creation. Lightest of all: abjad 1.",
    "ب": "First of the dark letters and the fountainhead of all duality. The Qur'an and the "
         "Torah both open on it rather than on alif — the conundrum the Risāla al-Bāʾiyya "
         "was written to solve.",
    "غ": "Closes the series at 1000. Nothing in the tower is heavier.",
    "ن": "Opens Sūra 68, which is named for it. A light letter carrying a middling weight.",
    "ق": "Opens Sūra 50, which is named for it.",
    "ص": "Opens Sūra 38, which is named for it.",
}

# ---------------------------------------------------------------- form facts --
# Observable properties of the standard isolated naskh form. IMPLEMENTATION facts,
# not doctrine: the brief's idea is that al-Būnī gives each letter a *shakl*, but
# that doctrine is not in this repo's corpus, so the game uses only what anyone
# can see on the page. Fields:
#   orientation  vertical | horizontal | mixed   the dominant stroke direction
#   dots         0..3                             count of diacritical dots
#   dot_position above | below | none
#   closed       True if the form encloses a counter (a loop)
#   tail         True if the form descends below the baseline
#                                            orient      dots pos      closed tail
FORM = {
    "ا": ("vertical",   0, "none",  False, False),
    "ب": ("horizontal", 1, "below", False, False),
    "ج": ("mixed",      1, "below", False, True),
    "د": ("mixed",      0, "none",  False, False),
    "ه": ("mixed",      0, "none",  True,  False),
    "و": ("mixed",      0, "none",  True,  True),
    "ز": ("mixed",      1, "above", False, True),
    "ح": ("mixed",      0, "none",  False, True),
    "ط": ("mixed",      0, "none",  True,  False),
    "ي": ("horizontal", 2, "below", False, True),
    "ك": ("mixed",      0, "none",  False, False),
    "ل": ("vertical",   0, "none",  False, True),
    "م": ("mixed",      0, "none",  True,  True),
    "ن": ("horizontal", 1, "above", False, True),
    "س": ("horizontal", 0, "none",  False, True),
    "ع": ("mixed",      0, "none",  False, True),
    "ف": ("horizontal", 1, "above", True,  False),
    "ص": ("horizontal", 0, "none",  True,  True),
    "ق": ("mixed",      2, "above", True,  True),
    "ر": ("mixed",      0, "none",  False, True),
    "ش": ("horizontal", 3, "above", False, True),
    "ت": ("horizontal", 2, "above", False, False),
    "ث": ("horizontal", 3, "above", False, False),
    "خ": ("mixed",      1, "above", False, True),
    "ذ": ("mixed",      1, "above", False, False),
    "ض": ("horizontal", 1, "above", True,  True),
    "ظ": ("mixed",      1, "above", True,  False),
    "غ": ("mixed",      1, "above", False, True),
}

ELEMENTS = ["fire", "air", "water", "earth"]


def build():
    letters = []
    for glyph, name, translit, value in ABJAD:
        o, dots, pos, closed, tail = FORM[glyph]
        letters.append({
            "glyph": glyph,
            "name": name,
            "translit": translit,
            "abjad": value,
            # Light/dark is the 14/14 split; it drives the Inversion operation.
            "class": "nurani" if glyph in NURANI else "zulmani",
            # Mass is the abjad value, compressed: raw 1..1000 spans three orders of
            # magnitude and a solver hates that. log keeps the ORDER exact — which is
            # the part the correspondence actually asserts — while making a tower of
            # them stackable. Stated here rather than buried, because it is the one
            # place the game bends the source for playability.
            "mass": round(1.0 + 2.2 * math.log10(value), 3),
            "form": {"orientation": o, "dots": dots, "dot_position": pos,
                     "closed": closed, "tail": tail},
            # The three registers of the letter, per the Mafāḥiṣ's own structure.
            "registers": {"written": glyph, "spoken": translit, "mental": name},
            "note": NOTES.get(glyph),
        })
    return letters


def build_correspondences(letters):
    """Rival schemes. Each is a mapping glyph -> value plus its grounding."""
    by_glyph = {l["glyph"]: l for l in letters}

    # Scheme 1 — the cyclic four-element assignment in abjad order. This is the
    # common Būnian-style cycle, but the repo corpus does not give the table, so it
    # is labelled INTERPRETATION rather than SOURCED.
    cyclic = {l["glyph"]: ELEMENTS[i % 4] for i, l in enumerate(letters)}

    # Scheme 2 — by form. Entirely ours. vertical=hot, horizontal=cold, mixed=temperate;
    # closed=moist, open=dry. Fire = hot+dry, Air = hot+moist, Water = cold+moist,
    # Earth = cold+dry; 'mixed' falls to whichever side its dots put it (dots=odd hot).
    def by_form(l):
        f = l["form"]
        hot = f["orientation"] == "vertical" or (f["orientation"] == "mixed" and f["dots"] % 2 == 1)
        moist = f["closed"]
        return {(True, False): "fire", (True, True): "air",
                (False, True): "water", (False, False): "earth"}[(hot, moist)]
    formal = {g: by_form(l) for g, l in by_glyph.items()}

    # Scheme 3 — by light and dark, the one PORTAL-grounded split, read as hot/cold;
    # tail or no tail read as moist/dry. The split is sourced; the reading is ours.
    def by_light(l):
        hot = l["class"] == "nurani"
        moist = l["form"]["tail"]
        return {(True, False): "fire", (True, True): "air",
                (False, True): "water", (False, False): "earth"}[(hot, moist)]
    luminous = {g: by_light(l) for g, l in by_glyph.items()}

    return {
        "_note": ("Not a correspondence table: a list of rival SCHEMES. The tradition does "
                  "not agree on a letter's temperament, and the play is finding out which "
                  "scheme is operative in a given puzzle. Each scheme carries the kind of "
                  "ground it rests on. Generated by build_letters.py; do not hand-edit."),
        "grounding_kinds": {
            "PORTAL": "An entry in portal/db/turka.db supplies the fact.",
            "CORPUS": "A Melvin-Koushki paper in research/library supplies it, with a page.",
            "REPORTED": "PUZZLERIDEAS.txt reports it from a source NOT in this repo. Unverified here.",
            "INTERPRETATION": "Ours. A design reading, labelled as such wherever it is shown.",
        },
        "reported_but_absent": [
            {"claim": "Ibn ʿArabī assigns hot/cold and dry/moist qualities to groups of letters, "
                      "alif being responsive to its surroundings.",
             "kind": "REPORTED", "source": "PUZZLERIDEAS.txt §7, citing an Oxford study of Ottoman occultism",
             "status": "The actual assignment is not in this repo. When it is, add it as a fourth "
                       "temperament scheme; until then no scheme here claims to be his."},
            {"claim": "Kâtib Çelebi reports a division of the letters into four groups by their "
                      "ṭabāʾiʿ (natures), connected with taksīr.",
             "kind": "REPORTED", "source": "PUZZLERIDEAS.txt §6", "status": "same"},
            {"claim": "Two rival explanations of letter efficacy circulate: the mixture of letters, "
                      "and numerical proportionality between their values.",
             "kind": "REPORTED", "source": "PUZZLERIDEAS.txt §10, reporting Melvin-Koushki",
             "status": "Used as the frame for the two 'efficacy' schemes below."},
        ],
        "schemes": [
            {"id": "mizaj-cyclic", "domain": "temperament",
             "name": "The cycle", "kind": "INTERPRETATION",
             "source": "The common four-element cycle in abjad order (fire, air, water, earth, repeating). The repo corpus does not give this table; it is included as the most conventional candidate.",
             "values": ELEMENTS, "map": cyclic},
            {"id": "mizaj-form", "domain": "temperament",
             "name": "By form", "kind": "INTERPRETATION",
             "source": "Ours: vertical = hot, horizontal = cold, mixed by odd/even dots; closed = moist, open = dry. Built only from the observable form facts in letters.json.",
             "values": ELEMENTS, "map": formal},
            {"id": "mizaj-light", "domain": "temperament",
             "name": "By light", "kind": "PORTAL",
             "source": "portal entry `ilm-al-huruf`: the 14 light / 14 dark split is sourced. Reading light as hot, dark as cold, and a descending tail as moist, is INTERPRETATION.",
             "values": ELEMENTS, "map": luminous},
            {"id": "efficacy-mixture", "domain": "efficacy", "name": "Mixture", "kind": "REPORTED",
             "source": "PUZZLERIDEAS.txt §10: letters act by their combination. Rule here: two neighbours are stable when their temperaments are complementary (fire–air, water–earth share a quality; fire–water and air–earth oppose).",
             "rule": "complementary-neighbours"},
            {"id": "efficacy-proportion", "domain": "efficacy", "name": "Proportion", "kind": "REPORTED",
             "source": "PUZZLERIDEAS.txt §10: letters act by numerical proportionality. Rule here: two neighbours are stable when the ratio of their abjad values reduces to small integers (both terms ≤ 4 — the Pythagorean consonances, per portal entry `pythagorean-cosmology`).",
             "rule": "small-integer-ratio", "max_term": 4},
            {"id": "alif-singular", "domain": "rule", "name": "Alif is singular", "kind": "PORTAL",
             "source": "portal entry `abjad-numerology` (alif = 1) and `ilm-al-huruf` (alif as avatar of Oneness). Reading: the only block that may stand on end; it takes no alif on it — two alifs make a line, not two.",
             "rule": "alif-stands-alone"},
        ],
    }


def verify(letters, corr) -> int:
    """Check the claims these files rest on against the portal DB and Unicode."""
    if not DB.exists():
        print("verify: no portal DB at %s" % DB, file=sys.stderr)
        return 1
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    problems = []

    def entry(slug):
        row = conn.execute("SELECT card, body FROM concepts WHERE slug=?", (slug,)).fetchone()
        return None if row is None else (row["card"] or "") + (row["body"] or "")

    text = entry("abjad-numerology")
    if text is None:
        problems.append("portal has no `abjad-numerology` entry")
    else:
        for probe in ("alif", "1000"):
            if probe not in text:
                problems.append("abjad-numerology entry does not mention %r" % probe)

    text = entry("ilm-al-huruf")
    if text is None:
        problems.append("portal has no `ilm-al-huruf` entry")
    else:
        if "28" not in text:
            problems.append("ilm-al-huruf entry does not mention the 28-letter correspondence")
        if "muqa" not in text and "light" not in text.lower():
            problems.append("ilm-al-huruf entry does not mention the light/dark division")

    if len(letters) != 28:
        problems.append("expected 28 letters, built %d" % len(letters))
    n_light = sum(1 for l in letters if l["class"] == "nurani")
    if n_light != 14:
        problems.append("expected 14 light letters, got %d" % n_light)
    vals = [l["abjad"] for l in letters]
    if vals != sorted(vals):
        problems.append("abjad values are not in ascending order")

    # Form facts: every glyph has a row, and the dot COUNT agrees with the Unicode
    # name of the letter where Unicode records it (e.g. "ARABIC LETTER THEH" has no
    # count, so this only catches the two-/three-dot names that do).
    for l in letters:
        f = l["form"]
        if f["dots"] == 0 and f["dot_position"] != "none":
            problems.append("%s: no dots but a dot position" % l["glyph"])
        if f["dots"] > 0 and f["dot_position"] == "none":
            problems.append("%s: dots but no position" % l["glyph"])
        uname = unicodedata.name(l["glyph"], "")
        if "THREE DOTS" in uname and f["dots"] != 3:
            problems.append("%s: Unicode says three dots" % l["glyph"])
        if "TWO DOTS" in uname and f["dots"] != 2:
            problems.append("%s: Unicode says two dots" % l["glyph"])

    # Schemes: every temperament scheme covers all 28 with a legal value, and every
    # scheme labelled PORTAL names a portal slug that exists.
    for s in corr["schemes"]:
        if s["domain"] == "temperament":
            missing = [l["glyph"] for l in letters if l["glyph"] not in s["map"]]
            if missing:
                problems.append("scheme %s misses %s" % (s["id"], "".join(missing)))
            bad = [g for g, v in s["map"].items() if v not in s["values"]]
            if bad:
                problems.append("scheme %s has illegal values for %s" % (s["id"], "".join(bad)))
        if s["kind"] == "PORTAL":
            for slug in re.findall(r"`([a-z0-9-]+)`", s["source"]):
                if entry(slug) is None:
                    problems.append("scheme %s cites missing portal entry %s" % (s["id"], slug))
    # The three temperament schemes must actually disagree, or the "which scheme is
    # operative" play is empty.
    temps = [s for s in corr["schemes"] if s["domain"] == "temperament"]
    for a in temps:
        for b in temps:
            if a["id"] < b["id"]:
                agree = sum(1 for g in a["map"] if a["map"][g] == b["map"].get(g))
                if agree > 20:
                    problems.append("schemes %s and %s agree on %d/28 — not rival enough"
                                    % (a["id"], b["id"], agree))

    for p in problems:
        print("  FAIL %s" % p, file=sys.stderr)
    if problems:
        return 1
    print("verify: OK — 28 letters, 14 light / 14 dark, abjad ascending, form facts "
          "consistent, %d schemes cover the alphabet and disagree, and the portal entries "
          "this rests on are present" % len(corr["schemes"]))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify", action="store_true")
    args = ap.parse_args()

    letters = build()
    corr = build_correspondences(letters)
    if args.verify:
        return verify(letters, corr)

    payload = {
        "_note": ("The block roster for Abjad Tower. Generated by build_letters.py from the "
                  "abjad series and the fourteen muqaṭṭaʿāt. Mass is log10(abjad value) "
                  "scaled — the ORDER is the source's, the compression is ours, and it is "
                  "the only place the game bends the correspondence for playability. "
                  "`form` records what the written glyph observably is; `registers` the "
                  "three levels of the letter. Run with --verify to check against "
                  "portal/db/turka.db."),
        "source_entries": ["ilm-al-huruf", "abjad-numerology"],
        "mass_rule": "1.0 + 2.2 * log10(abjad), so alif=1.0 and ghayn=7.6",
        "form_note": ("Observable facts about the standard isolated naskh form — orientation, "
                      "dots and their position, whether the form encloses a counter, whether "
                      "it descends below the line. Not doctrine."),
        "letters": letters,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with io.open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    with io.open(OUT_CORR, "w", encoding="utf-8") as f:
        json.dump(corr, f, ensure_ascii=False, indent=2)
    light = sum(1 for l in letters if l["class"] == "nurani")
    print("%d letters (%d light / %d dark), mass %.1f..%.1f -> %s; %d schemes -> %s"
          % (len(letters), light, len(letters) - light,
             min(l["mass"] for l in letters), max(l["mass"] for l in letters),
             OUT.relative_to(ROOT), len(corr["schemes"]), OUT_CORR.relative_to(ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
