# CareerSim — Agent Guide

> **Ibn Turka: The Occult Court** — an FTL-style career roguelike in which
> scholarship, patronage, occult science, manuscripts, and political danger interact
> as a living intellectual network. The third TurkaGame prototype, and the first with
> its own backend (player accounts + editable run chronicles).

**New session? Read [HANDOVER.md](HANDOVER.md) first**, then [DESIGN.md](DESIGN.md)
and [docs/DECISIONS.md](docs/DECISIONS.md). The raw kickoff conversation is
`docs/DESIGN_CONVERSATION.md` — **open by grep/section only, never end to end.**

Inherits everything from the parent [`../CLAUDE.md`](../CLAUDE.md) (and through it
`C:\Dev\CLAUDE.md`'s Working Discipline): verify-before-done, no secrets in chat,
log decisions to `docs/DECISIONS.md`, provenance-gated assets, no copyrighted PDFs
in the repo, scenes reveal the real world.

## Doc routing — load only what the task needs

| Task | Read |
|---|---|
| Any design/mechanics question | [DESIGN.md](DESIGN.md) → [docs/SYSTEMS.md](docs/SYSTEMS.md) |
| UI, CSS, screens, menus, microcopy | [docs/UI_STYLE_GUIDE.md](docs/UI_STYLE_GUIDE.md) — normative, read before touching CSS or UX copy |
| Writing encounter/situation prose | [../games/visual-novel/WRITING_GUIDE.md](../games/visual-novel/WRITING_GUIDE.md) (applies here too) + grounding rules in [docs/ENCOUNTER_ATOMS.md](docs/ENCOUNTER_ATOMS.md) |
| Authoring/converting content | [docs/ENCOUNTER_ATOMS.md](docs/ENCOUNTER_ATOMS.md) |
| What to build next | [docs/ROADMAP.md](docs/ROADMAP.md) — slices with hard gates, in order |
| How the loop actually behaves | [docs/GAMELOOP.md](docs/GAMELOOP.md) — the as-built loop, measured (SYSTEMS.md is the spec; this is the reality) |
| Balance, tuning, meter/exposure numbers | [docs/ECONOMY.md](docs/ECONOMY.md) |
| Known defects and their evidence | [docs/MECHANICSISSUES.md](docs/MECHANICSISSUES.md) — ranked, with repro commands |
| What content to author next | [docs/ENCOUNTERSNEXTSTEP.md](docs/ENCOUNTERSNEXTSTEP.md) |
| Prose quality, voice, the glossary | [docs/WRITINGAUDIT.md](docs/WRITINGAUDIT.md) |
| The ending system: fate matrix, marginalia, Attested Life, tuning history | [docs/ENDINGS.md](docs/ENDINGS.md) |
| Why a decision was made | [docs/DECISIONS.md](docs/DECISIONS.md), then DESIGN_CONVERSATION.md by section |
| Research facts | [../docs/BIOGRAPHY.md](../docs/BIOGRAPHY.md) + [../site/data/timeline.json](../site/data/timeline.json) (canonical), portal corpus for depth |

## Ground rules specific to this subproject

- **Encounter engine is the spine** (DungeonAB v6 pattern): every option shows its
  `unlockedBy` provenance; locked options are shown with requirements named; every
  encounter has ≥1 free option and ≥1 capability-gated option; gradient outcomes
  (6-step), never pass/fail; every memory write must be read somewhere (lint rule).
- **No spell system, no XP, no gold.** The Occult Quintet supplies *verbs* by tier.
  Meters: Synthesis, Demonstration, Transmission, Exposure; reputations: Orthodox /
  Occult / Imperial / Scholarly (they must conflict). Exposure compounds and does not
  reset.
- **Grounding tags on every encounter** — ATTESTED needs a source pointer; the UI
  surfaces them as seals.
- **A gate that cannot be reached is worse than no gate.** The existing lints check that a
  science/flag is *referenced* somewhere, never that the reference can be *satisfied* — and
  9 Quintet gates were bricked shut for months while every test passed. Before adding a
  requirement above tier 1, run `node tools/analyze-content.mjs reach`.
- **Two-voice UI writing**: Chronicle voice for world text, Gloss voice (marginalia)
  for mechanics — see UI_STYLE_GUIDE §3. Never mix them in one string.
- **Engine stays framework-agnostic**: `src/engine/` has no React/Next imports and is
  covered by the Node test runner. React components consume it.
- **Anonymous play always works.** Auth (Supabase) adds persistence and chronicle
  editing; it never gates starting a run.
- **Supabase/Vercel secrets** go in `.env.local` / Vercel env vars only; `.env*` is
  gitignored; never echo a key into chat or a tracked file.

## Where things live (once code exists — see ROADMAP Slice 0)

```
CareerSim/
├── CLAUDE.md, HANDOVER.md, README.md, DESIGN.md
├── docs/            SYSTEMS, UI_STYLE_GUIDE, ENCOUNTER_ATOMS, ROADMAP, DECISIONS,
│                    DESIGN_CONVERSATION (raw kickoff, grep only)
├── content/         atoms/*.json, encounters/*.json  (data, lint-checked)
├── src/engine/      framework-agnostic game logic + tests
├── src/app/         Next.js App Router UI
└── tools/           content lint, VN→atom converter
```

## Run & verify

The game is a static site served from the repo root — serve the root and open
`/CareerSim/`. It is live on the parent repo's GitHub Pages at
https://t3dy.github.io/TurkaGame/CareerSim/ ; only the **witness service** deploys to
Vercel (`CareerSim/witness/`, project `turka-witness`, `vercel deploy --prod --yes`).
Use `preview_start` per workspace convention — don't run dev servers through raw Bash.

Tests: `node --test tools/test-engine.mjs` (engine + content lints) and
`node --test witness/test-edit.mjs` (the editor's rules and fold).

**Measure before claiming anything about balance or content.** Two harnesses:
`node tools/analyze-content.mjs [shape|gates|reach|invariants|economy|memory|prose|lexicon]`
(static) and `node tools/simulate-runs.mjs 2000 [random|greedy]` (plays complete runs
through the real engine). Every figure in GAMELOOP/ECONOMY/MECHANICSISSUES/
ENCOUNTERSNEXTSTEP/WRITINGAUDIT comes from these — regenerate rather than trusting a
number in a doc. If you change `src/main.js`'s turn loop, mirror it in
`tools/simulate-runs.mjs` or the numbers quietly stop describing the game.

To work on the witness editor without deploying, `.claude/launch.json` config
`witness-editor-dev` (port 7533) runs `witness/devserver.mjs`, which serves
`witness/public/` and stands in for the blob endpoints in memory, mirroring production's
storage shape.
