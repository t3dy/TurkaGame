# VERIFIED: what was driven, and what it showed

2026-09-27. Everything below was run in this session against the final build (`?v=4`), not read off a diff.

## Driven

| what | how | result |
|---|---|---|
| corpus | `ingest_corpus.py` over 40 PDFs in `research inbox/` + 3 papers on `E:\pdf` | 43 sources, 1,954 pages, 6.5 s; printed page captured on 563 of 614 dissertation pages (pdf p. = printed + 17 verified at pp. 20, 50, 75, 122, 315, 600) |
| citations | `build_artifacts.py` on 1,087 evidence artifacts | every witness page exists; every printed page equals the running head; every quotation of 5+ words is verbatim on its page; none exceeds 40 words (the build fails otherwise: all passing) |
| artifacts | schema validation + provenance graph | 598 claims, 55 events, 49 works, 53 reconstructions, 17 institutions, 6 hypotheses, 5 models, 36 scenes; 2,974 edges; 0 dangling |
| linter | `lint_scenes.py` | 36 scenes, 0 errors, 0 warnings (invariants rest on attested claims; no `documented` choice on a reconstruction; every gate is raisable; every position reachable; UNKNOWN offerable) |
| simulation | `simulate.py --random 20000` | 0 stuck, ~13,900 distinct score vectors, no unreachable choice. Exposure at the end runs 7–30 in random play; the record's own path ends at 8 |
| engine parity | `tests/test_engine_parity.py`: 200 seeded runs through `narrative_lib.py` and `game/engine.js` (rulings, commitments, composer picks, sorter shuffles, choices) | identical trails and identical final states, key for key; the runs diverge (it cannot pass by doing nothing); court, pressure, commitment and sorter state all exercised |
| the record can be followed | `tests/test_historical_path.py` (worst answers to rulings, first composer option, reversed sorter, the UNKNOWN commitment) | every scene's historical choice is open all the way to the end |
| duress rule | `tests/test_dossier.py`, synthetic dossiers | leaning only on apologies/creed tracts ⇒ `coerced_testimony`; free writings ⇒ not; a close dossier ⇒ `false_certainty`, and UNKNOWN ⇒ `calibrated_unknown`; `HELD_KINDS` identical in Python and JS |
| source discipline | `tests/test_sources.py` | every attested/directly-inferred claim resting on an apology carries `subject_self_report`/high; every claim and work grounds out in evidence |
| **the game, through the UI** | in the Browser pane: 6 full playthroughs by real button clicks (1 along the record, 5 random) | all 6 reached the ending screen; 0 console errors; every scene's controls worked (rulings, the commitment, three composers, the sorter's ▲/▼, choices, Continue); **closed options showed their reason** ("Closed to you: needs favour with … of at least …"); the random runs produced the commitment outcomes `calibrated_unknown`, `coherent`, `incoherent`, `false_certainty` and `coerced_testimony` |
| layout | screenshots: court board (desktop), the apology composer (desktop), the collection puzzle (375 px); `scrollWidth` measured at 375 px on the composer, sorter, commitment, ending and How-to-play | no horizontal overflow anywhere measured; text legible |

## Independently audited (a different agent from the writer, per AGENTS.md)

- `research/notes/AUDIT-A1-evidence.md`: 109 items sampled (72 evidence, 25 claims, 12 works): **73 PASS, 31 MINOR, 5 FAIL**; no invented fact, no altered number or date;
  errors were in evidence kinds (14 timeline entries typed `colophon`, two `letter`/`work` items that were MK's own analysis), one hedge held as `attested`, one date typed `composition`.
  **All five FAILs and the 14 timeline kinds are fixed** (`scripts/_fix_a1.py`); the MINOR items are recorded, not all applied.
- `research/notes/AUDIT-A2-scenes.md`: all 36 scenes: 2 CLEAN, 16 MINOR, 18 FIX (invented details such as "four provinces away" and "a prince's son"; hedges dropped; labels
  that claimed more than the claim said; a historian-desk ruling that scored a contested answer). **All FIX findings were applied** by three fixer passes and the lead, and the
  full suite was re-run after: 0 lint errors, 31 tests OK, 0 stuck in 20,000 walks. The audit found **no European contact and no "first/third trial"** anywhere.

## NOT verified

- **Not deployed and not committed.** No live URL exists (DEPLOY_STATE.md). Nothing was fetched from a host.
- **No human playtest.** Nobody unfamiliar with the design has played it; whether the closed-option notes read as intended consequences or dead ends is untested (as in NEXTSTEPS Tier 0).
- **The audits were samples**: 109 of ~1,900 artifacts, and a full read of the scenes *by one auditor*; MINOR findings were not all applied; the fix passes were not re-audited independently. Treat "clean" as "no known errors".
- **Everything rests on Melvin-Koushki.** The apologies, letters and manuscript are known only through his summary; no Persian or Arabic text, chronicle or manuscript was read. The duress rule is *his* position, adopted as a rule of the game.
- **A paraphrase can straddle a page break** that the quote checker cannot see (seven of 72 sampled artifacts cite one page for words that run onto the next).
- Lewisohn's readings are his documented method applied to each datum; his article was never opened.
- The 1422 / 1426 / 1427 dating of the three trials is our reading (MK writes "three trials", fn. 99, and does not list them).
- Desktop screenshots were taken at two screens only; the ending screen and Act VI were checked by text and by `scrollWidth`, not by eye.
