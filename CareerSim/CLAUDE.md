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

No code yet (docs-only kickoff state). Once Slice 0 lands: `npm run dev` via a
`.claude/launch.json` entry (preview_start, per workspace convention — don't run dev
servers through raw Bash), Node test runner for `src/engine/`, and Vercel for deploys
from Slice 2. The parent repo's GitHub Pages site is NOT this game's host — this
subproject deploys separately to Vercel (see docs/DECISIONS.md).
