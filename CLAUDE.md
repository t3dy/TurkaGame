# TurkaGame — Agent Guide

> Games and a research pipeline built on **Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī** (1369–1432),
> Chief Judge of Isfahan and the foremost occult philosopher of Timurid Iran — his life,
> his lettrist-Pythagorean cosmology, and the Islamicate occult courts he moved through.
> Assets are sourced from extant manuscripts and other historical material, not invented
> fantasy art.

## Status (2026-08-29, project init)

Sequencing decision: **research pipeline first**, then a visual-novel vertical slice, with
the roguelike and career-sim staying at design-doc stage until the VN slice proves the
pattern. See [docs/DECISIONS.md](docs/DECISIONS.md) for the full record of choices made at
kickoff (sequencing, asset sourcing, tech stack).

Nothing here is playable yet. What exists:
- A real research brief synthesized from the three source papers currently in hand
  ([docs/RESEARCH_BRIEF.md](docs/RESEARCH_BRIEF.md)).
- A working, dependency-free asset-provenance pipeline
  ([research/scripts/register_asset.py](research/scripts/register_asset.py)).
- Design docs for all three game concepts, most detailed for the visual novel since it's
  next ([docs/GAME_VISUAL_NOVEL.md](docs/GAME_VISUAL_NOVEL.md),
  [docs/GAME_ROGUELIKE.md](docs/GAME_ROGUELIKE.md),
  [docs/GAME_CAREER_SIM.md](docs/GAME_CAREER_SIM.md)).
- A placeholder showcase page ([site/index.html](site/index.html)).

## Ground rules for this project specifically

- **No copyrighted source PDFs in the repo.** The scholarly articles this project is built
  on (Melvin-Koushki's papers) stay in `research/library/`, which is gitignored. Only
  original, paraphrased synthesis (with citations) goes into tracked files. Never commit a
  PDF, and never quote more than a short attributed line from a source into a tracked file.
- **No manuscript image goes into `assets/` without a provenance record.** Every asset
  under `assets/manuscripts/` needs a matching entry in `assets/manuscripts/registry.json`
  (institution, shelfmark, folio, rights note) before it's used in any game. Use
  `research/scripts/register_asset.py add` — don't hand-edit the registry.
  See [assets/schema/asset-provenance.schema.json](assets/schema/asset-provenance.schema.json).
- **Games are separate, independently runnable folders** under `games/`, one per prototype.
  Don't reach across game folders for shared code until at least two prototypes are past
  their first slice — premature sharing here has bitten other projects in this workspace.
- **Mixed tech stack is intentional.** Pick the simplest stack that fits each prototype
  (see [docs/DECISIONS.md](docs/DECISIONS.md)) rather than forcing one framework across all
  three.

## Where things live

```
TurkaGame/
├── docs/                   design docs, research brief, decisions log
├── research/
│   ├── library/             (gitignored) the actual source PDFs — local only
│   ├── notes/                per-source synthesis notes, one file per source
│   └── scripts/               register_asset.py — the asset-provenance CLI
├── assets/
│   ├── manuscripts/          curated images + registry.json (provenance records)
│   └── schema/                 asset-provenance.schema.json
├── games/
│   ├── visual-novel/         next up — see docs/GAME_VISUAL_NOVEL.md
│   ├── roguelike/              design doc only, see docs/GAME_ROGUELIKE.md
│   └── career-sim/             design doc only, see docs/GAME_CAREER_SIM.md
└── site/                    showcase page, currently a placeholder
```

## Run & verify

Nothing has a build step yet. Once the VN slice exists, add its dev-server config to
`.claude/launch.json` and update this section — follow the no-build, `preview_start`-driven
pattern used in [EmblemRoguelike](../EmblemRoguelike/CLAUDE.md) and
[DungeonAB](../DungeonAB/CLAUDE.md) unless the VN's needs justify diverging (see
docs/DECISIONS.md).
