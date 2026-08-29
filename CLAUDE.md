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

## Broader research: IslamicateOccultPortal

`../IslamicateOccultPortal/` (sibling project, added 2026-08-30) is the broader
research home this game's world is drawn from — lettrism, the Brethren of Purity,
al-Buni, and the courtly networks beyond Ibn Turka's own story specifically. It holds:
- A larger source corpus (21 sources beyond TurkaGame's own 3 papers) with full text
  preserved for research (`../IslamicateOccultPortal/corpus/`).
- **The image catalog** — every manuscript/portrait/diagram image referenced or
  extracted from the scholarly sources, including TurkaGame's own 3 papers
  (`../IslamicateOccultPortal/CLAUDE.md` § "Image catalog"). This is a research index
  of what's *available*; it is not the same thing as this project's
  `assets/manuscripts/registry.json`, which tracks only images already cleared and
  copied for actual game use. When looking for a candidate manuscript image to bring
  into a TurkaGame prototype, start in the portal's image catalog
  (`../IslamicateOccultPortal/site/images/index.html` or query
  `../IslamicateOccultPortal/db/islamicate.db` directly), then run it through
  `research/scripts/register_asset.py` here once its rights are actually checked.
- A `game_connections` table recording which portal concepts/figures have been used
  in which of *this* project's design docs — query it before assuming a piece of
  research hasn't been tapped yet.

TurkaGame's own `research/` folder was deliberately kept separate rather than
migrated into the portal (see [docs/DECISIONS.md](docs/DECISIONS.md)) — this project
stays the game-prototypes workspace; the portal is the DH research project. Add new
biographical/cosmological facts about Ibn Turka's world to the portal's seed first if
they're general research, not TurkaGame-specific game design.

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
