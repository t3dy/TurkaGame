# HANDOVER: current state

**2026-09-27: built end to end, committed (`3f8a294`) and live at https://t3dy.github.io/TurkaGame/TurkaVita/game/.** Read `CLAUDE.md`, then
`docs/DESIGN.md` (what was built), then `docs/DECISIONS.md` (the kickoff calls, four of them **assumed**: Ted said
"build the game" and did not answer the plan's questions), then `docs/TURKA_AUDIT.md` (where the older docs are wrong).

## What exists

| layer | state |
|---|---|
| corpus | `db/corpus.db`: 43 Melvin-Koushki texts, 1,954 pages, printed page read off the running head (`python scripts/ingest_corpus.py`) |
| knowledge | 1,087 evidence, 597 claims, 55 events, 49 works, 53 reconstructions, 17 institutions, 6 positions (HYP-A..F, 146 bearings on 118 evidence artifacts), 5 whole-life models. All `draft`, all page-cited, every quotation verified verbatim on its page by the build |
| research notes | `research/notes/R1..R8-*.md` (each researcher's page-cited discrepancy list) and `AUDIT-A1/A2-*.md` (independent audits of the evidence layer and the scenes) |
| scenes | 36: six acts (0101–0106, 0201–0206, 0301–0309, 0401–0407, 0501–0503, 0601–0605). Linter 0 errors, 0 warnings; 20,000 random walks, 0 stuck |
| game | `game/` vanilla JS; court board, composer (three writing scenes), sorter (the collection), rulings, dossier/lens/commitment, "How to play" in full sentences; driven end to end through the UI (VERIFIED.md) |
| tests | `python tests/run.py`: pipeline gates + 31 tests including Python↔JS engine parity (200 seeded runs), the historical-path walk, the dossier/duress-rule mechanics, source discipline |
| docs | `docs/BIOGRAPHY.md` and `docs/OEUVRE.md` are generated (`python scripts/render_docs.py`) |
| deploy | **live** on GitHub Pages; see `DEPLOY_STATE.md` |

## What needs Ted (in order)

1. **Read `docs/TURKA_AUDIT.md`.** It lists twelve places where the older BIOGRAPHY.md / timeline.json / LETTRISMRESEARCH.md / the plan differ
   from the dissertation, and nine where Melvin-Koushki's own papers disagree. **Nothing outside `TurkaVita/` has been corrected** (DECISIONS 5), except
   this game's own plan doc, which carries a correction banner. The VN (40 choices) and CareerSim (70 encounters) were built on the older picture
   (Cairo from 1385, Bāysunghur "from c. 1416"): decide whether they should be brought into line.
2. **The four assumed calls** (DECISIONS 3–6): slice-3-first (moot now: all acts are built), Act V as the unnamed copyist, no Persian edition fetched,
   corrections held for the audit. "Go" was taken as approval to commit and deploy, **not** as approval to edit the older docs: those are still uncorrected.
3. **It is public now** (Ted said "go" after the plan's open questions). The repo's rules check passed on 1,963 staged files (no PDFs, no corpus DB). `research/artifacts/` carries
   page-cited paraphrase of a copyrighted dissertation: 77 short quoted spans, 455 quoted words in total, none over 20 words in one artifact. Look at that once; if you would rather it
   were private, the artifacts can be dropped from the repo without touching the game (`game/content.js` embeds only the ones scenes cite).
4. **Read the audits** (`research/notes/AUDIT-A*.md`) and say which findings to apply. The lead applied the ones marked here as fixed.

## Known limits (say them in any write-up)

- **Everything rests on Melvin-Koushki.** No chronicle, manuscript or Persian edition of the apologies was read; the apologies exist here only through his summary.
- **The three-trial dating (c. 1422 / 1426 / 1427) is our reading**; MK's phrase is "three trials" (fn. 99) and he never lists them.
- **Folio numbers of MS Majlis 10196 are unreliable as an exact key** (overlaps, misprints); the collection puzzle uses only clean ones and says so.
- **Position D is Melvin-Koushki's, and the project's source.** The game presents it as one lens with attribution; it is not the game's answer.
- Bearings attributed to Lewisohn apply his documented face-value method to each datum; his article was never opened.
- Game abstractions (`court.*`, `press.*`) are not historical quantities and the board says so.
- No save file. No mini-game for the *Ṭahawī Circle*.

## Gotchas

- `search.py`/`find.py` take FTS5/plain words; run from the Bash tool (PowerShell mangles quotes). Python prints need `PYTHONIOENCODING=utf-8` on this machine (cp1252).
- After editing scenes: `python scripts/export_game.py`, and bump `?v=` in `game/index.html` (the static server sets no cache headers).
- `game/content.js` is generated and is 1 MB+; `window.__game.engine` and `window.__game.render()` are the test handles.
- The one-off generators (`scripts/_mkschema.py`, `_mkins.py`, `_mkact6.py`) are kept so the fork is auditable; the JSON files are the truth.
- `--check` on `build_artifacts.py` never rewrites `db/artifacts.db`: use it while agents are writing.
