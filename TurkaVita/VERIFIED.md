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

## Live (added after the push)

- Commit `3f8a294` pushed to `main`; `gh api repos/t3dy/TurkaGame/pages/builds/latest` reported `built` with that commit.
- `https://t3dy.github.io/TurkaGame/TurkaVita/game/`: the page and all five assets (`style.css`, `turka.css`, `content.js`, `engine.js`, `ui.js`, all `?v=4`) returned 200; 0 console errors; `CONTENT` had 36 scenes and 989 artifacts.
- Played on the live host by real clicks along the record: 36 scenes, ended at "The life you lived beside the record"; the Herat 1422 scene showed "The record: this is what the sources say he did"; the apology composer had 5 slots with "Send it" disabled until all were chosen.

## NOT verified

- **No human playtest on the live site**, and only one browser was used.
- **No human playtest.** Nobody unfamiliar with the design has played it; whether the closed-option notes read as intended consequences or dead ends is untested (as in NEXTSTEPS Tier 0).
- **The audits were samples**: 109 of ~1,900 artifacts, and a full read of the scenes *by one auditor*; MINOR findings were not all applied; the fix passes were not re-audited independently. Treat "clean" as "no known errors".
- **Everything rests on Melvin-Koushki.** The apologies, letters and manuscript are known only through his summary; no Persian or Arabic text, chronicle or manuscript was read. The duress rule is *his* position, adopted as a rule of the game.
- **A paraphrase can straddle a page break** that the quote checker cannot see (seven of 72 sampled artifacts cite one page for words that run onto the next).
- Lewisohn's readings are his documented method applied to each datum; his article was never opened.
- The 1422 / 1426 / 1427 dating of the three trials is our reading (MK writes "three trials", fn. 99, and does not list them).
- Desktop screenshots were taken at two screens only, and none on the live host; the ending screen and Act VI were checked by text and by `scrollWidth`, not by eye.

## Corrections pass (2026-09-28): what was verified

Ted's standing rule (DECISIONS 14) was applied across `TurkaGame/`, `IslamicateOccultPortal/`, the wiki and the workspace files; `docs/TURKA_AUDIT.md` section F lists every change.

- **Sweep:** the same patterns that found the errors (`1385`, `c. 1416`, "second and longer patron", "1420 pivot year", "first two inquisitions", "5 of 7", "not held / not in hand", "three source papers") were re-run over the whole workspace after the corrections. Every remaining hit is a correction note, a session record annotated "superseded", an append-only log, or a raw transcript.
- **Tests after the edits:** TurkaVita 31 tests OK (unchanged by this pass); CareerSim: 32 engine tests, 7 reachability, 1 thesis, 11 witness-edit, `analyze-content reach` 0 unsatisfiable gates, encounter ids/effects/gates unchanged; v2: the Tribunal verifier (three trials answerable, all four voices carry their citations) and the six v2 test files pass; portal DB and site rebuilt (69 pages, 50 chronology events); IslamicateOccultPortal DB and site rebuilt (59 timeline events); the plates catalogue regenerated from CareerSim's corrected labels; JSON files parse.
- **Live host after the push** (`0d7977e`; Pages build matched): `site/timeline.html` shows "59 dated events" with the Samarkand and seven-tier entries; `CareerSim/` reads "Samarkand 1387, Cairo from c. 1393 — exile 1427–1432" with no "1385"; `v2/apps/tribunal/` no longer says refusal is "what he actually did". The only "1385" and "1416" left on the timeline page sit inside the correction notes that quote the old claims.
- **Counts corrected:** CareerSim has 71 encounters (shape table: 14+14+16+13+14), not 70 or 58.

**Not verified in this pass:** the corrected prose documents were checked by pattern sweep and by the correctors' own reading, not re-audited by an independent agent (as the scenes were); the corrected portal pages on `IslamicateOccultPortal` were checked by reading generated HTML and row counts, not in a browser; the frozen visual novel's scenes still carry the old premises (`games/visual-novel/ERRATA.md`); no human playtest.

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

## Plate attributions, independently re-verified (2026-09-28, continued)

- **Resolved:** the item below used to read "not independently re-verified by a second agent." A second agent
  (`research/notes/AUDIT-A4-plates.md`) checked all 39 plates' attributions against the live Commons/source pages
  directly, not against the illustrator's own notes: 39/39 CONFIRMED, including every attribution the illustrator
  had flagged as uncertain. One unrelated pre-existing registry record was corrected to match (`docs/DECISIONS.md`
  §25).

## Second cold playtest, composer bug fixed (2026-09-28, continued)

- **A second, independent cold playtest** (`research/notes/QA-playtest-2.md`, a different agent from the first,
  playing by clicking with no engine access) re-checked all first-pass fixes and found 10 of 12 confirmed fixed,
  plus one still-live bug and two minor sub-fixes left undone.
- **The live composer bug** (SCN-0303: picking "no political prediction" at S2 left S3/S4 pickable, letting the
  player assemble a self-contradicting letter) is fixed via a new `requires_pick` schema field, mirrored in both
  engines (`docs/DECISIONS.md` §26). Verified live in the Browser pane against the exact repro: after S2 = "No,"
  `document.querySelectorAll('fieldset.slot.skip').length === 2` (S3 and S4), `#send` is enabled without them, and
  the post-Send reveal shows cards only for S1 and S2 — confirmed by reading the rendered page text, not just the
  DOM class. `python tests/run.py` (47/47) and `simulate.py --random 10000` (0 stuck, 8,401 distinct score
  vectors, no unreachable choice) both re-pass unchanged.
- **Two minor findings closed** (`docs/DECISIONS.md` §27): SCN-0307's "mafiosos (Melvin-Koushki's rendering)" →
  "gangsters"; SCN-0203's verbatim colophon dates moved out of the fixed "What the sources establish" box into
  `detail`. Both confirmed live by rendering each scene and reading the page text.
- **The sorter's live-preview sentence was restored** (`docs/DECISIONS.md` §28) — a feature the first pass
  removed the promise of rather than building. Confirmed live: at SCN-0502, moving rows keeps a note reading "As
  you have it now, the volume opens with **Nafsat al-Maṣdūr II** and closes with **Muhr al-Nubuwwa**," matching
  the current draft order.
- A full automated 36-scene playthrough after all four fixes: 0 console errors, all scenes reached, `END` state
  hit cleanly.

## Still not verified

- No live human playtest (both QA passes were agents, not a person).
- Whether the site actually serving `https://t3dy.github.io/TurkaGame/TurkaVita/game/` reflects this pass's
  commit — check the next HANDOVER entry for the push/poll/verify-live record, or re-run it if this line is
  older than the latest commit.
