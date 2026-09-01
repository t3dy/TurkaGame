# TurkaGame — Agent Guide

> Games and a research pipeline built on **Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī** (1369–1432),
> Chief Judge of Isfahan and the foremost occult philosopher of Timurid Iran — his life,
> his lettrist-Pythagorean cosmology, and the Islamicate occult courts he moved through.
> Assets are sourced from extant manuscripts and other historical material, not invented
> fantasy art.

Also inherits `C:\Dev\CLAUDE.md`'s **Working Discipline** (verify-before-done, no secrets in chat, log decisions to a file, checkpoint long jobs) even where this file doesn't restate it.

**New session? Read [HANDOVER.md](HANDOVER.md) first** — current state, what's
verified vs. not, likely next step. Full kickoff-conversation rationale lives in
`CONVO1.md`, opened by section only when `HANDOVER.md` or `docs/DECISIONS.md` point
you there — don't read it end to end.

## Status (2026-08-29, project init)

Sequencing decision: **research pipeline first**, then a visual-novel vertical slice, with
the roguelike and career-sim staying at design-doc stage until the VN slice proves the
pattern. See [docs/DECISIONS.md](docs/DECISIONS.md) for the full record of choices made at
kickoff (sequencing, asset sourcing, tech stack).

**Update 2026-08-30 (later)**: the VN slice is playable and live; the **career sim
graduated to its own full subproject at [CareerSim/](CareerSim/CLAUDE.md)**
(design-complete, pre-code — entry `CareerSim/CLAUDE.md`, decisions
`CareerSim/docs/DECISIONS.md`). It supersedes `docs/GAME_CAREER_SIM.md` and the
`games/career-sim/` placeholder, and will deploy separately (Vercel + Supabase),
not via this repo's GitHub Pages.

What existed at project init:
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

- **Scenes reveal the real world, not generic occult-fantasy atmosphere.** Before
  writing or revising any VN scene text, read
  [games/visual-novel/WRITING_GUIDE.md](games/visual-novel/WRITING_GUIDE.md) —
  every scene should surface something specific and real (a named text,
  institution, practice, or historiographical fact) from
  [docs/BIOGRAPHY.md](docs/BIOGRAPHY.md) / [site/data/timeline.json](site/data/timeline.json),
  which are the canonical research-access layer, not `docs/RESEARCH_BRIEF.md`'s
  looser prose. This is a house rule, not a suggestion — it's the difference
  between this project and a fantasy VN with the serial numbers filed off.
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
- **Pick the model deliberately; Sonnet 5 is the default, not Opus.** Which model for
  which job, how much corpus belongs in a context, and the resumable batch harness for
  per-item sweeps are all in
  [CONTEXTENGINEERINGGAMEPIPELINES.md](CONTEXTENGINEERINGGAMEPIPELINES.md). Scene prose
  and schema decisions are Opus work; plumbing is Sonnet; bounded per-item rubrics are
  Haiku via `tools/batch/`.
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
│   ├── yusuf-ascent/           standalone puzzle minigame + research portal on one
│   │                             painting — see games/yusuf-ascent/README.md
│   ├── visionary-gallery/      22 folios fetched, measured, deconstructed, papercrafted,
│   │                             3D'd and made playable — games/visionary-gallery/README.md
│   └── career-sim/             pointer only — moved to CareerSim/
├── CareerSim/               the career-sim subproject (own CLAUDE.md/DESIGN.md/docs;
│                             Next.js+Supabase target, deploys separately to Vercel)
└── site/                    showcase page, currently a placeholder
```

## Deploy

**Live: https://t3dy.github.io/TurkaGame/** — GitHub Pages off `main` at the repo root;
`git push origin main` is the whole deploy. **Read [DEPLOY_STATE.md](DEPLOY_STATE.md)
before touching deploy config** — it holds the canonical URL map, the verification
checklist, and the traps (notably: `.nojekyll` is load-bearing, because Jekyll would
otherwise silently drop `vendor/` and `_`-prefixed files). A green push is not a deploy;
confirm the Pages build commit matches HEAD and fetch the live URL.

## Run & verify

No build step. `.claude/launch.json` config `turkagame-site` (port 7521) serves this
whole project directory as root — use it for both the showcase site
(`/site/index.html`, `/site/features.html`) and the VN prototype
(`/games/visual-novel/index.html`), since `features.html` links directly to the
game and both need the same served root to resolve correctly. Prefer `preview_start`
over raw Bash, per [EmblemRoguelike](../EmblemRoguelike/CLAUDE.md)'s convention.

VN debug handle: `window.__turkaVN` (`.state`, `.choices`, `.restart()`).
Yūsuf Ascent handles: `window.__yusufA` / `__yusufB` / `__yusufC` / `__yusufPortal`;
`__yusufB.checkStationInvariant()` is its numerical self-test.

## Yūsuf Ascent (added 2026-08-31)

[`games/yusuf-ascent/`](games/yusuf-ascent/README.md) — a **standalone** minigame on
Bihzād's *Yūsuf fleeing Zulaykha* (Cairo, Adab Farsi 22, f. 52b). The folio is cut into
43 interactable elements and rebuilt three ways (2D door-chain, 3D station-point stack,
drag-sort ladder), with a research portal doing the deep dive. Entry:
[`games/yusuf-ascent/README.md`](games/yusuf-ascent/README.md); design rationale in
`DESIGN.md`, forward proposals in `GRAPHICS.md` / `INTERFACE.md`.

Two house rules it establishes, worth reusing:

- **Region boxes live in `imagelab/data/regions.json`, never in a game folder.** Each
  game's build script merges boxes with its own interpretation. This kept crops
  re-cuttable when the reading changed mid-build.
- **Interpretation is labelled where the player is judging, not in an About page.** The
  game's seven-rung ascent and door chain are *ours*, not the painting's, and every
  surface that uses them says so at the point of use — including the negative result
  that no source in the 43-source corpus mentions Bihzād or Zulaykha at all.

## Visionary Gallery (added 2026-08-31)

[`games/visionary-gallery/`](games/visionary-gallery/README.md) — the **automatic**
counterpart to Yūsuf Ascent. 22 Commons folios fetched with structured-licence rights
checking, measured, auto-decomposed, turned into printable paper tunnel books and 3D
stacks, and made playable. Pipeline lives in `imagelab/scripts/`:
`fetch_commons.py` → `analyze.py` → `papercraft.py` → `build_gallery.py`, plus
`compare_hand.py`, which scores the machine against this repo's one hand-made
decomposition.

Two house rules it adds:

- **Rights gates belong in the script, not in a human's memory.** `fetch_commons.py`
  reads Commons' structured licence data and refuses to download anything that does not
  parse as free. Its first version over-blocked 19 of 22 files through a regex bug; the
  bug is documented in the script rather than quietly fixed, because a gate that
  silently over-blocks is one edit from silently under-blocking.
- **Measure the claims you write.** Two sentences in this project's own prose were
  contradicted by measuring them, and both stayed on the page with the contradiction
  (`games/visionary-gallery/method.html`). `imagelab/data/hand_vs_machine.json` is the
  record: the automatic pipeline **ranks** regions much as the hand does (ρ = 0.86) and
  **finds** only 27% of them.

Per `CONTEXTENGINEERINGGAMEPIPELINES.md`: Yūsuf Ascent is **L1** (hand-authored access
layer) and half of **L3** (every element carries what it rests on, shown in-game); the
gallery is **L4** (data-driven generation); and **L2 was built 2026-09-01** —
`portal/scripts/export_gallery_scholarship.py` exports portal entries from
`portal/db/turka.db` into the gallery at build time, entries the portal's and
regenerable, only the links authored. See `docs/DECISIONS.md` § 2026-09-01, including
the flagged deviation (source DB is `turka.db`, not the sibling `islamicate.db` the
earlier entry named).

**Decision records for both.** Project-level entries are appended to
[`docs/DECISIONS.md`](docs/DECISIONS.md) in the house Decision/Rationale/Rejected/Consequence
format. Implementation detail lives in
[`games/yusuf-ascent/DECISIONS.md`](games/yusuf-ascent/DECISIONS.md) and
[`games/visionary-gallery/DECISIONS.md`](games/visionary-gallery/DECISIONS.md).
**Direction changes made mid-build — the places where the first approach turned out to be
wrong — are in [`docs/PIVOTS.md`](docs/PIVOTS.md)**, which is the file to read before
re-deciding anything here.

Companion research: [`docs/VISIONARY_ENVIRONMENTS.md`](docs/VISIONARY_ENVIRONMENTS.md) —
eight other Persianate visionary traditions (the Herat *Miʿrājnāma*, the Freer Jalāyirid
*Dīwān*, *Haft Paykar*, Siyah Qalam, the *Falnāma*, the *muraqqaʿ*, Qazwīnī, the lettrist
grid) assessed as game environments, with a ranked build order.
