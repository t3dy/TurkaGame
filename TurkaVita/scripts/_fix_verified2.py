#!/usr/bin/env python3
# one-off (2026-09-28): record the illustration/QA/perf pass in VERIFIED.md
import io, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(ROOT, "VERIFIED.md")
s = io.open(p, encoding="utf-8", newline="").read()
add = """
## "Make the best game that actually works" pass (2026-09-28): what was verified

- **Illustrations:** 39 period plates (23 paintings, 14 manuscript pages, 2 printed sources; 5 from our own
  collections, 34 new from Commons through the rights gate) wired into the game, each with a provenance record
  and an honest "not a depiction of this event" caption. `tests/test_plates.py` (11 tests) enforces provenance,
  kind, licence and file-size rules. The upstream `imagelab/scripts/fetch_commons.py` rights gate had a real hole
  (it would pass `cc-by-nc-4.0`/`cc-by-nd-4.0`); fixed at the source, checked on eleven licence strings.
- **Save/resume:** `tests/test_snapshot.py` plays 80 state-driven runs, cuts each at a pseudo-random point
  (including mid-scene: an open ruling, a half-picked composer, a chosen-but-not-continued choice), round-trips
  the snapshot through JSON exactly as localStorage would, restores into a brand-new engine instance, and
  requires the same final state and trail as the uninterrupted run. All 80 pass; at least 8 of the cuts land
  mid-scene by design.
- **QA playtest** (a separate agent playing cold, by clicking, never touching the engine handle): found 3
  blockers and 9 major issues (`research/notes/QA-playtest.md`). All fixed; confirmed by six full automated
  playthroughs afterward (0 console errors, 0 leaked developer text, save/erase confirmed safe with dialogs).
- **Content pass independently audited:** a second agent (`research/notes/AUDIT-A3-rewrite.md`) diffed the
  content pass against the prior commit and against the underlying claims, scene by scene. **Zero FIX-level
  findings** on all 36 scenes; two MINOR findings, both applied. `simulate.py --random 20000`: 0 stuck, 14,757
  distinct score vectors. The historical path's final state is unchanged by the content pass (biography +53,
  exposure 8), confirming the added "agency" trades touched only non-historical options as intended.
- **Performance:** a real bug — every ruling/pick/sort click re-rendered the whole scene, re-fetching the plate
  image over the network each time (up to ~5.9s per scene measured via `performance.now()`, confirmed via
  `read_network_requests` showing repeated 200s for identical URLs). Fixed with a session blob-URL cache; after
  the fix, no scene in a 20-scene automated run exceeds 100ms.

## Still not verified

- No live human playtest (the QA pass was an agent, not a person).
- The illustration pass's Commons attributions were checked by the illustrator against the file description
  pages, not independently re-verified by a second agent.
- Not yet deployed: this pass's changes are staged for commit but the live URL still serves the pre-pass build
  until pushed (see the next HANDOVER entry for what to do next).
"""
s = s.rstrip("\n") + "\n" + add
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("ok")
