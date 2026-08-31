# TurkaGame

> Games and a knowledge portal built on **Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī**
> (1369–1432), Chief Judge of Isfahan and the foremost occult philosopher of Timurid
> Iran — sourced from extant manuscripts and real scholarship, not invented fantasy.

## 🔗 Everything, in one place

**[t3dy.github.io/TurkaGame](https://t3dy.github.io/TurkaGame/)** — the front page.

### Play
| | |
|---|---|
| **[Ibn Turka: The Occult Court](https://t3dy.github.io/TurkaGame/CareerSim/)** | Career roguelike — a whole life in five phases, 70 grounded encounters, obligations and patron contracts, compounding exposure, a two-axis ending. **Current build.** |
| **[The Visual Novel](https://t3dy.github.io/TurkaGame/games/visual-novel/)** | 40 branching life-choices across 8 acts, the Occult Quintet skill tree, 8 endings. Version 3. |

### Read
| | |
|---|---|
| **[The Ibn Turka Knowledge Portal](https://t3dy.github.io/TurkaGame/site/portal/)** | 52 pages. Six **Intersection** articles on where Ibn Turka meets the wider Islamicate occult world — the Brethren of Purity, al-Būnī, the occult court, the Pythagorean revival, the Akbarian inheritance, the defense of divination — plus entries on figures, concepts, texts, institutions. |
| **[The Timeline](https://t3dy.github.io/TurkaGame/site/timeline.html)** | 50 dated events, 950–2025, each tagged for how firmly it is grounded. |
| **[The Visual Novel: full pitch](https://t3dy.github.io/TurkaGame/site/features.html)** | What the VN is and where its research comes from. |

### Every version
**[The archive](https://t3dy.github.io/TurkaGame/site/archive.html)** — every build kept
playable, including superseded ones:
[VN v3](https://t3dy.github.io/TurkaGame/games/visual-novel/) ·
[VN v2](https://t3dy.github.io/TurkaGame/games/visual-novel-v2/) ·
[VN v1](https://t3dy.github.io/TurkaGame/games/visual-novel-v1/)

---

![Ibn Turka: A Visual Novel — pitch overview](site/images/pitch-overview.png)

## What's playable right now

A **CYOA/RPG-hybrid visual novel prototype**: 40 branching choices across 8 acts of
Ibn Turka's life, a five-branch skill tree (the real, period-named "Occult Quintet"
of occult sciences), gates where an early decision concretely closes off a later
option, and several distinct computed endings — the historical outcome (exile, death
in 1432) is one ending among several, not privileged over the others.

▶ **[Play Version 3.0](https://t3dy.github.io/TurkaGame/games/visual-novel/index.html)**
— every one of the 87 choice options carries a short (~10–20 word), sharp line of
reasoning that names a real person, text, or institution wherever the historical
record allows it (see the
[writing guide](games/visual-novel/WRITING_GUIDE.md)) instead of generic
occult-fantasy dressing.

▶ [Version 2.0](https://t3dy.github.io/TurkaGame/games/visual-novel-v2/index.html)
— archived: the same idea with longer (2–4 sentence) reasoning per option.

▶ [Version 1.0](https://t3dy.github.io/TurkaGame/games/visual-novel-v1/index.html)
— the original prototype, short choice labels only. All three stay live and
playable side by side rather than being overwritten.

## Three prototypes

- **Visual novel** — *in active development, playable prototype above.* Episodes of
  Ibn Turka's life told through the choices in
  [games/visual-novel/CHOICES.md](games/visual-novel/CHOICES.md), each tagged for how
  grounded it is in the historical record (ATTESTED / PLAUSIBLE-GAP /
  INVENTED-COMPATIBLE).
- **Timeline** — 50 dated events (950–2025) spanning Ibn Turka's biography, the
  texts and discoveries around him, the historiography of how this material got
  recovered by modern scholarship, and his comparative relationship to European
  Renaissance magi (Cusa, Pico, Bruno, Dee — explicit comparisons Melvin-Koushki
  draws, not documented contact). See [site/timeline.html](site/timeline.html) /
  [docs/BIOGRAPHY.md](docs/BIOGRAPHY.md).
- **Roguelike** — *design stage.* Built on the same Occult Quintet hierarchy, in the
  vein of this workspace's other Atalanta-Fugiens-based roguelikes. See
  [docs/GAME_ROGUELIKE.md](docs/GAME_ROGUELIKE.md).
- **Esoteric scholar career sim** — *design stage.* Skill-tree progression through the
  occult sciences, patron relationships, court politics, and the Islamicate economy
  Ibn Turka actually operated in. See [docs/GAME_CAREER_SIM.md](docs/GAME_CAREER_SIM.md).

## Research grounding

Nothing here is invented fantasy dressing. [docs/RESEARCH_BRIEF.md](docs/RESEARCH_BRIEF.md)
synthesizes three papers by Matthew Melvin-Koushki (University of South Carolina),
the leading scholar of Ibn Turka and the Islamicate occult sciences. A sibling
project, **IslamicateOccultPortal** (local only, not yet on GitHub), is the broader
digital-humanities research home this game draws from — lettrism, the Brethren of
Purity, Ahmad al-Buni's talismanic corpus — with a 552-image research catalog.

Manuscript and diagram imagery in the game itself is sourced with explicit,
per-image provenance in [assets/manuscripts/registry.json](assets/manuscripts/registry.json)
(institution, rights, source URL) — see
[assets/schema/asset-provenance.schema.json](assets/schema/asset-provenance.schema.json)
for the schema every image is checked against before it's used.

## Project structure

```
TurkaGame/
├── docs/                      design docs, research brief, decisions log
├── research/
│   ├── library/                (gitignored) source PDFs — local only, never committed
│   ├── notes/                   per-source synthesis notes
│   └── scripts/register_asset.py   asset-provenance CLI — add/list/approve/check
├── assets/
│   ├── manuscripts/             curated images + registry.json (provenance records)
│   └── schema/                    asset-provenance.schema.json
├── games/
│   ├── visual-novel/            playable prototype — CHOICES.md, STATE_MODEL.md,
│   │                              choices.json, js/ engine
│   ├── roguelike/                 design doc only
│   └── career-sim/                design doc only
└── site/                      showcase website (this repo's GitHub Pages source)
```

## Running locally

No build step anywhere in this repo.

```bash
python -m http.server 7521
# then open http://localhost:7521/site/index.html
# or the game directly: http://localhost:7521/games/visual-novel/index.html
```

To add a new manuscript image to the game:

```bash
python research/scripts/register_asset.py add \
  --file path/to/image.jpg --title "..." --institution "..." \
  --rights-note "..." --source-url "..."
```

## Status & what's next

- [docs/BIOGRAPHY.md](docs/BIOGRAPHY.md) — the canonical, citation-grounded
  biography this project draws choices/events/encounters from.
- [HANDOVER.md](HANDOVER.md) — current state for a fresh session to read first:
  what's built, what's verified, and the honest gaps.
- [NEXTSTEPS.md](NEXTSTEPS.md) — prioritized roadmap from a narrative-design pass.
- [GAMELOOP.md](GAMELOOP.md) — how the play loop actually works, act by act.
- [docs/DECISIONS.md](docs/DECISIONS.md) — the full decisions log, from kickoff
  through the mechanics and asset-sourcing choices.
- [CONVO1.md](CONVO1.md) — full kickoff-conversation record (read by section, not
  end to end — see its own header for why).

## License / provenance note

This is a personal research and game-design project, not a commercial release.
Manuscript images are used under the rights terms recorded per-image in
`assets/manuscripts/registry.json` (mostly public domain / Creative Commons via
Wikimedia Commons and Princeton University Library). The two pitch-overview images
in `site/images/` are concept art for this project, not manuscript reproductions.
