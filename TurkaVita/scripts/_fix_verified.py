#!/usr/bin/env python3
# one-off (2026-09-28): record what the corrections pass verified, in VERIFIED.md
import io, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(ROOT, "VERIFIED.md")
s = io.open(p, encoding="utf-8", newline="").read()
add = """
## Corrections pass (2026-09-28): what was verified

Ted's standing rule (DECISIONS 14) was applied across `TurkaGame/`, `IslamicateOccultPortal/`, the wiki and the workspace files; `docs/TURKA_AUDIT.md` section F lists every change.

- **Sweep:** the same patterns that found the errors (`1385`, `c. 1416`, "second and longer patron", "1420 pivot year", "first two inquisitions", "5 of 7", "not held / not in hand", "three source papers") were re-run over the whole workspace after the corrections. Every remaining hit is a correction note, a session record annotated "superseded", an append-only log, or a raw transcript.
- **Tests after the edits:** TurkaVita 31 tests OK (unchanged by this pass); CareerSim: 32 engine tests, 7 reachability, 1 thesis, 11 witness-edit, `analyze-content reach` 0 unsatisfiable gates, encounter ids/effects/gates unchanged; v2: the Tribunal verifier (three trials answerable, all four voices carry their citations) and the six v2 test files pass; portal DB and site rebuilt (69 pages, 50 chronology events); IslamicateOccultPortal DB and site rebuilt (59 timeline events); the plates catalogue regenerated from CareerSim's corrected labels; JSON files parse.
- **Live host after the push** (`0d7977e`; Pages build matched): `site/timeline.html` shows "59 dated events" with the Samarkand and seven-tier entries; `CareerSim/` reads "Samarkand 1387, Cairo from c. 1393 — exile 1427–1432" with no "1385"; `v2/apps/tribunal/` no longer says refusal is "what he actually did". The only "1385" and "1416" left on the timeline page sit inside the correction notes that quote the old claims.
- **Counts corrected:** CareerSim has 71 encounters (shape table: 14+14+16+13+14), not 70 or 58.

**Not verified in this pass:** the corrected prose documents were checked by pattern sweep and by the correctors' own reading, not re-audited by an independent agent (as the scenes were); the corrected portal pages on `IslamicateOccultPortal` were checked by reading generated HTML and row counts, not in a browser; the frozen visual novel's scenes still carry the old premises (`games/visual-novel/ERRATA.md`); no human playtest.
"""
s = s.rstrip("\n") + "\n" + add
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("ok")
