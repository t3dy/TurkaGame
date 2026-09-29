# HANDOVER: current state

**2026-09-28: illustrated, given save/resume, QA'd and re-audited; committed (`4d3f017`) and live at
https://t3dy.github.io/TurkaGame/TurkaVita/game/.** Read `CLAUDE.md`, then `docs/DESIGN.md` (what was built), then
`docs/DECISIONS.md` (the full ledger, including decisions 16–24 from this pass), then `docs/TURKA_AUDIT.md` (where the
older docs were wrong, and were corrected). `VERIFIED.md` has the detail of what was actually checked, pass by pass.

## What exists

| layer | state |
|---|---|
| corpus | `db/corpus.db`: 43 Melvin-Koushki texts, 1,954 pages, printed page read off the running head (`python scripts/ingest_corpus.py`) |
| knowledge | 1,087 evidence, 598 claims, 55 events, 49 works, 53 reconstructions, 17 institutions, 6 positions (HYP-A..F, 146 bearings on 118 evidence artifacts), 5 whole-life models. All `draft`, all page-cited, every quotation verified verbatim on its page by the build |
| research notes | `research/notes/R1..R8-*.md` (researcher discrepancy lists), `AUDIT-A1..A4-*.md` (independent audits: evidence layer, scenes, the agency/rulings rewrite, plate attributions), `QA-playtest*.md` (cold playtests) |
| scenes | 36: six acts (0101–0106, 0201–0206, 0301–0309, 0401–0407, 0501–0503, 0601–0605). Linter 0 errors, 0 warnings; 20,000 random walks, 0 stuck. Acts I–IV now carry real cost/benefit trades on non-historical options (DECISIONS 23), independently audited with zero FIX-level findings |
| illustrations | 39 period plates (paintings, manuscript pages, printed sources only — no photos, no object shots, no renders) in `game/img/` + `game/plates.js`, each provenance-recorded in `../assets/manuscripts/registry.json`; captions say what a plate is and is not (DECISIONS 16) |
| game | `game/` vanilla JS; court board, composer (three writing scenes), sorter (the collection, with a before/after comparison), rulings, dossier/lens/commitment, a glossary for jargon, act-card intros, a progress counter, save/resume (localStorage), an ending "margin" table against the record's own course, "How to play" in full sentences |
| tests | `python tests/run.py`: pipeline gates + 47 tests (up from 31): Python↔JS engine parity, the historical-path walk, dossier/duress-rule mechanics, source discipline, save/resume round-trip (80 runs cut mid-scene), plate provenance |
| docs | `docs/BIOGRAPHY.md` and `docs/OEUVRE.md` are generated (`python scripts/render_docs.py`) |
| deploy | **live** on GitHub Pages; see `DEPLOY_STATE.md` |

## What needs Ted (in order)

1. **The frozen visual novel still teaches the old, corrected-away picture in its scenes.** `games/visual-novel/ERRATA.md`
   lists 18 premises the corrected biography revises; the docs around it were corrected, but the game's own code/data
   were not touched, because `games/FROZEN.md` forbids it. Changing that is your call, not one made by default.
2. **CareerSim's remaining open questions** (`CareerSim/NEXTSTEPS.md`): stage the Samarkand years as scenes? Rebuild
   `trial_first`/`trial_second` around the sourced charges? Regenerate already-published witnesses with the corrected text?
3. **It is public.** The repo's rules check is clean at every commit (no PDFs, no corpus DB). `research/artifacts/`
   carries short page-cited paraphrase of a copyrighted dissertation (77 quoted spans, 455 words total, none over 20
   words). Look at that once if you'd rather it were private — it can come out of the repo without touching the game.
4. **No human has played it yet**, only agents (two cold playtests, `QA-playtest.md` and `QA-playtest-2.md`) and two
   independent content audits (`AUDIT-A3-rewrite.md`, `AUDIT-A4-plates.md`). Worth a real playthrough before calling it done.
5. **Read the audits** (`research/notes/AUDIT-A*.md`, `QA-playtest*.md`) for anything flagged but not applied.

## Known limits (say them in any write-up)

- **Everything rests on Melvin-Koushki.** No chronicle, manuscript or Persian edition of the apologies was read; the apologies exist here only through his summary.
- **The three-trial dating (c. 1422 / 1426 / 1427) is our reading**; MK's phrase is "three trials" (fn. 99) and he never lists them.
- **Folio numbers of MS Majlis 10196 are unreliable as an exact key** (overlaps, misprints); the collection puzzle uses only clean ones and says so.
- **Position D is Melvin-Koushki's, and the project's source.** The game presents it as one lens with attribution; it is not the game's answer.
- Bearings attributed to Lewisohn apply his documented face-value method to each datum; his article was never opened.
- Game abstractions (`court.*`, `press.*`) are not historical quantities and the board says so.
- **No mini-game for the *Ṭahawī Circle*.** No save-file EXPORT beyond "copy/download your record" — the save itself is
  localStorage only (per-browser, not portable). 12 of 36 scenes have no honest period plate to show (mostly Act VI and
  the exile letters); the act card is shown instead.

## Gotchas

- `search.py`/`find.py` take FTS5/plain words; run from the Bash tool (PowerShell mangles quotes). Python prints need `PYTHONIOENCODING=utf-8` on this machine (cp1252).
- After editing scenes: `python scripts/export_game.py`, and bump `?v=` in `game/index.html` (the static server sets no cache headers).
- `game/content.js` is generated and is 1 MB+; `window.__game.engine` and `window.__game.render()` are the test handles.
- The one-off generators (`scripts/_mkschema.py`, `_mkins.py`, `_mkact6.py`, `_fix_*.py`) are kept so the fork is auditable; the JSON files are the truth.
- `--check` on `build_artifacts.py` never rewrites `db/artifacts.db`: use it while agents are writing.
- **`window.__game` engine handles carry across page loads but not across `location.href` navigations** — a fresh
  navigation makes a new `window`, so a script variable captured before the navigation goes stale silently (it looks
  like buttons "stop responding"). If a browser-driven test does something odd right after a reload, suspect this first.
- Testing with the Browser pane hidden slows or times out `setTimeout`-based waits; state-changing clicks are
  synchronous, so drop `sleep()` calls in headless-style test scripts rather than relying on them.
