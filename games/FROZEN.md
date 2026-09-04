---
title: v1 — frozen
description: The five games in this folder are version 1 and are closed to change. New work happens in v2/.
---

# v1 — frozen 2026-09-04

Everything under `games/` is **version 1**. It is closed: no new features, no redesigns,
no refactors. It stays exactly where it is, at the URLs it already has, because it is a
finished thing and people have links to it.

| Game | What it is |
|---|---|
| [`yusuf-ascent/`](yusuf-ascent/README.md) | One Bihzād folio cut into 43 elements, rebuilt three ways |
| [`visionary-gallery/`](visionary-gallery/README.md) | 22 Commons folios fetched, measured, decomposed, made playable |
| [`abjad-tower/`](abjad-tower/README.md) | Physics stacking: blocks are the 28 letters, mass is abjad value. Five modes |
| [`impossible-architect/`](impossible-architect/README.md) | Route-builder where each folio element's rule is its own painted logic |
| [`letter-machine/`](letter-machine/README.md) | Grid puzzle: the letters are the instructions, the matter is the data |

## Why freeze rather than evolve

v2 changes the foundation, not the surface. It reads the alphabet through four independent
divisions instead of two, derives eight primitives instead of five, and makes the
historical tradition a **swappable ruleset** rather than a single table — so the same
letter does different things depending on whose metaphysics is in force. Retrofitting that
into these five would have quietly changed what each of them claims, and several of them
are arguments, not just toys. The Impossible Architect's whole point is that every rule
traces to a card in `palace.json`; rewriting its rule engine would have made that sentence
false without anyone noticing.

So v1 keeps its claims and its evidence intact, and v2 makes its own.

## What this means in practice

- **Do not edit these folders.** Bug reports against v1 are recorded, not fixed. If
  something here is badly wrong, the fix belongs in v2.
- **v2 does not import v1 code.** It has its own `data/`, `engine/` and vendor tree. The
  one thing it inherits is a *format* — the provenance pills (`PORTAL` / `CORPUS` /
  `REPORTED` / `INTERPRETATION`, plus a new `GAME_FICTION`), so a reader moving between
  versions is not learning a second colour code.
- **v1's notebook stays with v1.** The shared `turka.notebook.v1` localStorage key belongs
  to Abjad Tower and the Letter Machine. v2 will have its own key; progress does not
  carry across, and that is the price of the freeze rather than an oversight.

## Known faults, recorded and not fixed

These were true at the freeze and stay true:

- Extraction mode's difficulty tiers are computed but never playtested by a person.
- The Weight of Brackets is verified by scripted builds only.
- The Letter Machine does not animate its run, so you cannot watch the machine work.
- `three.js` is vendored three times across v1 folders.
- No game in v1 has ever been played by a human being under observation.

New work: [`../v2/README.md`](../v2/README.md).
