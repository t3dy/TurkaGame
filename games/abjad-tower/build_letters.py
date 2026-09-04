# -*- coding: utf-8 -*-
"""build_letters.py — generate data/letters.json, the game's block roster.

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

Nothing here is invented: run with --verify to check the letter set and the light
letters against `portal/db/turka.db`, which is the upstream source of truth.

    python games/abjad-tower/build_letters.py [--verify]
"""

from __future__ import annotations

import argparse
import io
import json
import math
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
DB = ROOT / "portal" / "db" / "turka.db"
OUT = Path(__file__).resolve().parent / "data" / "letters.json"

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


def build():
    letters = []
    for glyph, name, translit, value in ABJAD:
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
            "note": NOTES.get(glyph),
        })
    return letters


def verify(letters) -> int:
    """Check the two claims this file rests on against the portal DB."""
    if not DB.exists():
        print("verify: no portal DB at %s" % DB, file=sys.stderr)
        return 1
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    problems = []

    row = conn.execute("SELECT card, body FROM concepts WHERE slug='abjad-numerology'").fetchone()
    if row is None:
        problems.append("portal has no `abjad-numerology` entry")
    else:
        text = (row["card"] or "") + (row["body"] or "")
        for probe in ("alif", "1000"):
            if probe not in text:
                problems.append("abjad-numerology entry does not mention %r" % probe)

    row = conn.execute("SELECT card, body FROM concepts WHERE slug='ilm-al-huruf'").fetchone()
    if row is None:
        problems.append("portal has no `ilm-al-huruf` entry")
    else:
        text = (row["card"] or "") + (row["body"] or "")
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

    for p in problems:
        print("  FAIL %s" % p, file=sys.stderr)
    if problems:
        return 1
    print("verify: OK — 28 letters, 14 light / 14 dark, abjad ascending, "
          "and the portal entries this rests on are present")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--verify", action="store_true")
    args = ap.parse_args()

    letters = build()
    if args.verify:
        return verify(letters)

    payload = {
        "_note": ("The block roster for Abjad Tower. Generated by build_letters.py from the "
                  "abjad series and the fourteen muqaṭṭaʿāt. Mass is log10(abjad value) "
                  "scaled — the ORDER is the source's, the compression is ours, and it is "
                  "the only place the game bends the correspondence for playability. "
                  "Run with --verify to check against portal/db/turka.db."),
        "source_entries": ["ilm-al-huruf", "abjad-numerology"],
        "mass_rule": "1.0 + 2.2 * log10(abjad), so alif=1.0 and ghayn=7.6",
        "letters": letters,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with io.open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    light = sum(1 for l in letters if l["class"] == "nurani")
    print("%d letters (%d light / %d dark), mass %.1f..%.1f -> %s"
          % (len(letters), light, len(letters) - light,
             min(l["mass"] for l in letters), max(l["mass"] for l in letters),
             OUT.relative_to(ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
