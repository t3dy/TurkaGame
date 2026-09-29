#!/usr/bin/env python3
# one-off (2026-09-28): DECISIONS 16-21 for the "make the best game that actually works" pass.
import io, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(ROOT, "docs", "DECISIONS.md")
s = io.open(p, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in s else "\n"
s = s.replace("\r\n", "\n").rstrip("\n")
s += """

## 2026-09-28: "use your judgement and do what you have to do to make the best game that actually works"

16. **Illustrations: period paintings, manuscript pages and printed sources only** (Ted, 2026-09-28: "begin with our collection of illustrations and source more from the web. always use period paintings, manuscript or printed sources").
    39 plates in `game/img/` (23 paintings, 14 manuscript pages, 2 printed pages), 5 from our collections and 34 new from Commons through the rights gate; all in `assets/manuscripts/registry.json` with provenance; 38 PD/CC0 and one CC BY 4.0 (its credit line is displayed). No object photographs (astrolabes, globes), no modern photographs, no renders; the portal's image catalogue was rejected wholesale (raster extracts of copyrighted PDFs with UNDETERMINED rights, including the Ṭahawī circle of MS 10196, which would have been ideal). Every plate is captioned "Illustrative plate, not a depiction of this event", with a one-sentence `relevance` saying what it is and is not. Twelve scenes have none rather than a dishonest one. `docs/PLATES.md` is the provenance table and the rejected list; `tests/test_plates.py` enforces the rules.
17. **The rights gate now blocks NC and ND licences** (`imagelab/scripts/fetch_commons.py`): its `FREE_KEY` also matched `cc-by-nc-4.0` and `cc-by-nd-4.0`, and `FREE_NAME` passed any "Creative Commons" name including NonCommercial. Found by the plates pass, fixed at the source and checked on eleven licence strings.
18. **Save and resume** (localStorage, guarded): `engine.snapshot()`/`restore()`, autosave after every step, "Continue" on the title. A run is a long sitting; a game that loses it on a refresh does not work. `tests/test_snapshot.py` cuts 80 runs at random points, including mid-scene, restores through JSON and requires the same final state.
19. **Act title cards, a progress counter and a first-scene hint.** The act cards say only what the act's scenes already establish; the plate on the card sets the period.
20. **The margin: an outcome the record can be measured against.** The four bars measure fidelity to the record; the game abstractions (exposure, enemies, livelihood, students, works) had no stake. The ending now sets the player's life beside where **the record's own course** leaves those abstractions (computed at export by walking the historical path), so following the sources and doing better than the record pull against each other. The game does not say which is right, and labels the numbers as abstractions. Rationale: with a visible "documented" chip and no rival goal, the documented option was always the right answer.
21. **Export of a run** ("Copy your record", "Download it"): each scene, the player's choice, its label, and what the record says.
"""
io.open(p, "w", encoding="utf-8", newline="").write(s.replace("\n", nl) + nl)
print("ok")
