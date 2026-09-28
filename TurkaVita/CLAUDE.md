# TurkaVita — Agent Guide

> A game in which you play **Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī** (1369–1432) through the years
> that were recorded — the courts, the trials, the works — making the decisions he made; then
> the unnamed copyist who assembles his collected works; then the historian who has to say
> who he was. Scored on biography, works, doctrine and **calibration**. A sibling of
> `C:\Dev\PLOTINUSGAME`, forked from its pipeline; the plan is `../docs/PLAN_TURKA_VITA_GAME.md`.

Inherits `../CLAUDE.md` and `C:\Dev\CLAUDE.md` in full (verify before "done", no secrets in chat,
decisions to a file at once, checkpoint long jobs, GitHub Pages hosting, AGENTS/PIPELINE/ORCHESTRATION).

**New session? Read [HANDOVER.md](HANDOVER.md) first.**

## The design in three sentences

External events (Temür takes Isfahan, Iskandar's revolt, the attempt on Shāhrukh) are **fixed points**
the player cannot prevent; the player's margin is **whom to attach to, what to write, and how to
defend it**. His main witness is himself, writing to the rulers who judged him, so the dispute mechanic
runs on a **duress rule**: only what he wrote freely (letters, colophons, autograph, early work, the
works themselves) can show what he *held*; an apology can show only what he *told whom*. The game does
**not** know who he was and never scores that.

## Where things are

| path | what |
|---|---|
| `docs/RESEARCHER_BRIEF.md` | the contract for anyone writing artifacts |
| `docs/DECISIONS.md` | append-only ledger |
| `docs/DESIGN.md` | the game: acts, scoring, court board, composer, the collection, the dispute |
| `docs/TURKA_AUDIT.md` | the reconciliation of the dissertation against our older docs (the older documents were corrected to it on 2026-09-28; section F says what, and what was left on purpose) |
| `docs/BIOGRAPHY.md`, `docs/OEUVRE.md` | generated from `research/` |
| `schemas/artifacts.schema.json` | forked from PLOTINUSGAME's; adds `work`, `institution`, the duress fields |
| `research/artifacts/<type>/*.json` | the knowledge layer. **The JSON files are the truth**; the DBs are indexes |
| `research/notes/` | each researcher's page-cited notes and discrepancies |
| `narrative/scenes/SCN-*.json` | scene specs |
| `game/` | the playable prototype (`content.js` is generated) |
| `tests/` | `python tests/run.py` — gates + unit tests + Python↔JS engine parity |

## Commands (from `C:\Dev\TurkaGame\TurkaVita`)

```
python scripts/ingest_corpus.py            # ../research inbox/*.pdf -> db/corpus.db (resumable)
python scripts/search.py "Nafsat AND Shahrukh" -n 10 --src SRC-610EE1D6BA
python scripts/search.py --page SRC-610EE1D6BA 75
python scripts/build_artifacts.py          # validate + rebuild db/artifacts.db + provenance graph
python scripts/build_artifacts.py --check --grep "EV-04"   # validate only (safe while others write)
python scripts/build_artifacts.py --ancestry SCN-0004      # why does this scene exist?
python scripts/lint_scenes.py              # narrative linter
python scripts/simulate.py [--random N]    # state simulation
python scripts/export_game.py              # gated on build + lint -> game/content.js
python tests/run.py
```

Serve: launch config `turkavita` (port 7560) in `C:\Dev\.claude\launch.json`.

## Rules specific to this project

1. Evidence cites `(source_id, witness_page)` **and** the printed page; the build checks the running head and
   that every quoted span of five words or more is on the cited page. Only write about a page you opened.
2. Epistemic type and confidence are separate fields. Never turn confidence into a probability.
3. **Whose account, not just which source.** Anything that comes through his apologies carries
   `subject_self_report`, `shaping_risk: high`.
4. Scene invariants rest on `attested`/`directly_inferred` claims. Reconstructions may only be labelled choices.
5. **The duress rule.** `HELD_KINDS = {letter, colophon, autograph, early_work, work}`. A commitment about what he
   held that leans only on `apology`/`creed_tract`/reports is charged `coerced_testimony`.
6. **The game must not know which position is right.** Nothing scores a commitment against a designer's answer,
   only against the player's own dossier. Melvin-Koushki's reading is one lens, attributed as such.
7. A date that may be transcription is never stated as composition (`date_kind`).
8. Nothing reaches `game/` without passing build + lint. Engine rules live twice (`scripts/narrative_lib.py`,
   `game/engine.js`); change both and run `python tests/run.py`.
9. `db/*.db` and every PDF hold copyrighted text: never commit. Quote short and attributed.
10. **How to play, in full sentences** (`../CLAUDE.md`): goal and how you win or lose, every control, what the cursor
    does, how to preview, how to reset. A one-line legend is in addition, never instead.
11. No contact with any European figure, ever. Dee/Cusa/Bruno are Melvin-Koushki's comparison, kept to the historian's layer.
12. Scenes reveal the real world (`../games/visual-novel/WRITING_GUIDE.md`): every scene surfaces a named text, person,
    institution or practice, never generic occult atmosphere.
