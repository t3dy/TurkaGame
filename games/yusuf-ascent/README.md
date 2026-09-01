---
title: Yūsuf Ascent
description: A standalone puzzle minigame and research portal built on Bihzād's Yūsuf fleeing Zulaykha (Cairo, Adab Farsi 22, f. 52b). Three prototypes over one decomposition.
---

# Yūsuf Ascent

A **standalone** minigame on one painting: Kamāl al-Dīn Bihzād's *Yūsuf fleeing
Zulaykha*, Herat 1488, the last illustrated folio of a *Būstān* of Saʿdī made for
Sultan Ḥusayn Bāyqarā (Cairo, Egyptian National Library, **Adab Farsi 22, f. 52b**).

The folio is cut into **43 elements**, every one of them interactable, and put back
together three different ways. A fourth surface — the research portal — is the deep
dive the games are built on.

Built to stand alone. It can optionally be plugged into the career sim as a dream
encounter; see [§ Plugging in](#plugging-in-optional) — nothing in the game depends
on that happening.

## Run it

No build step, no dependencies beyond a vendored copy of three.js.

```bash
python -m http.server 7521
```

Serve the **repo root** (the `.claude/launch.json` config `turkagame-site` does exactly
this), then open `/games/yusuf-ascent/index.html`.

Debug handles: `window.__yusufA`, `__yusufB`, `__yusufC`, `__yusufPortal`.
`__yusufB.checkStationInvariant()` runs Prototype B's numerical self-test.

## What's here

| | |
|---|---|
| [`index.html`](index.html) | Hub — the four surfaces |
| [`proto-a-doors/`](proto-a-doors/) | **The Seven Doors** — 2D hotspot chain over the folio |
| [`proto-b-stack/`](proto-b-stack/) | **The Impossible Stack** — three.js, station-point projection |
| [`proto-c-ladder/`](proto-c-ladder/) | **The Ladder** — drag-sort the palace into seven strata |
| [`portal/`](portal/) | **The palace that is not a building** — the research deep dive |
| [`data/palace.json`](data/palace.json) | The decomposition: 43 nodes, rungs, locks. Generated. |
| [`data/research.json`](data/research.json) | The research record. Hand-authored, every claim grounding-tagged. |
| [`build_palace.py`](build_palace.py) | Regenerates `palace.json`. Annotations live here. |
| [`DESIGN.md`](DESIGN.md) | Why each prototype is shaped the way it is |
| [`DECISIONS.md`](DECISIONS.md) | Implementation choices, with rejected alternatives |
| [`GRAPHICS.md`](GRAPHICS.md) | Graphics proposals, routed through the Three.js skill pack |
| [`INTERFACE.md`](INTERFACE.md) | Interface proposals |

Region boxes are **not** stored here — they live in
[`imagelab/data/regions.json`](../../imagelab/data/regions.json) with the rest of the
corpus, and the sprites are cut by
[`imagelab/scripts/cut_regions.py`](../../imagelab/scripts/cut_regions.py). To change a
crop, edit there, re-cut, then re-run `build_palace.py`.

## Provenance and rights

**Status: CLEARABLE.** The painting is from 1488; the reproduction used here is the
Wikimedia Commons file, released under the Public Domain Mark as a faithful photographic
reproduction of a two-dimensional public-domain work.

**Still to do before any shipped release:** confirm the Dār al-Kutub's own reproduction
terms directly. National-library policy can differ from Commons' PD-Art position.

This dive also produced a correction: `imagelab/data/images.json` had the shelfmark as
*Adab Farsi 908 (attributed)*, flagged there as a guess from the picture. It is **Adab
Farsi 22, f. 52b**. That has been corrected in `data/research.json` and the portal
records both the old and new values and why.

## Honesty about the reading

Two things this game asserts are **not** in the painting:

1. **The seven-rung ladder** (mulk → threshold → barzakh → khayāl → malakūt → jabarūt →
   lāhūt). The terms are real and grounded in this project's corpus with page references.
   The assignment of painted elements to rungs is ours. Prototype C exists so a player
   can disagree with it element by element.
2. **The door chain.** Eight openings read as doors; we make seven of them a sequence,
   after Jāmī's seven chambers. Bihzād numbered nothing.

And one negative result, recorded deliberately: **no source in this project's 43-source
Melvin-Koushki corpus mentions Bihzād or Zulaykha at all.** The link between this
painting and Ibn Turka is thematic and interpretive. The portal says so on the page, not
in a footnote.

## Plugging in (optional)

The whole game reads from `data/palace.json` and writes nothing. To use it as a dream
encounter inside another game:

- Mount `proto-a-doors/` or `proto-b-stack/` in an iframe or as a route.
- Read completion from the debug handle (`__yusufA.state.done`,
  `__yusufA.state.opened.length`, `__yusufA.state.seen.size`) or add a
  `postMessage` on the win branch in `proto-a-doors/app.js`.
- Nothing else is shared. No *game logic* crosses folders, per this repo's rule against
  reaching between game folders before two prototypes are past a first slice.

  One exception, deliberate and documented: the sibling
  [Visionary Gallery](../visionary-gallery/README.md) imports **three.js** from this
  project's `vendor/` rather than keeping a second 2 MB copy. A vendored third-party
  library is not game logic, and duplicating it to satisfy the letter of that rule would
  work against its purpose. Reasoning is at the import site and in
  [`../visionary-gallery/DECISIONS.md`](../visionary-gallery/DECISIONS.md); the deploy
  consequence is gotcha 3a in [`DEPLOY_STATE.md`](../../DEPLOY_STATE.md).

See [DESIGN.md § As a dream encounter](DESIGN.md#as-a-dream-encounter) for the framing
that would make it fit the career sim rather than just sit inside it.
