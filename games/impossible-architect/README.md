---
title: The Impossible Architect
description: A tile-laying route-builder using the 41 cut elements of Bihzād's Yūsuf fleeing Zulaykha as pieces, where each piece's rule is the logic the painting already gives it.
---

# The Impossible Architect

A tile-laying route-builder — Carcassonne's placement, Pipe Dream's goal — whose spatial
rules are **the painting's, not Euclid's**. Every piece is one of the 41 cut elements of
Bihzād's *Yūsuf fleeing Zulaykha* (Cairo, Adab Farsi 22, f. 52b), and every piece's rule
is the logic its card in [`palace.json`](../yusuf-ascent/data/palace.json) already gives it.

One of six designs in [`docs/GAME_DESIGNS_BIHZAD.md`](../../docs/GAME_DESIGNS_BIHZAD.md);
the one built first because it uses the most pieces, uses their logic most literally, and
reuses the locks, rungs and cards of the Yūsuf Ascent decomposition unchanged.

## Run it

Serve the repo root and open `/games/impossible-architect/index.html`. No build step, no
engine. `?seed=N` reproduces a palace. Debug handle: `window.__architect`.

**Reads across folders, deliberately:** `../yusuf-ascent/data/palace.json` and the sprites
in `../yusuf-ascent/assets/regions/`. That is *data and assets*, not code — the whole point
of having made `palace.json` a shared layer is that a second game can consume it without
importing the first game's logic.

## The board

Five columns by seven rows, and **the rows are the seven rungs** of the Yūsuf ladder —
street at the bottom, crown at the top. Fixed: the street door at the bottom centre (you
stand in it, so it admits you); the chamber at row five (the goal); the cupola above it,
pre-placed and impassable, because no stair in the painting reaches it.

## The pieces and their rules

| Piece | Logic in the painting | Rule |
|---|---|---|
| The stairs | *Barzakh* — belong to neither storey they join | Connect to **any** column in the row above and below |
| The seven doors | Locked from within; open of themselves | **The chain**: the centre column, rows 1–4, is doors only and doors go nowhere else; passable once their lock's answer stands somewhere in your structure |
| The balcony door | Painted on a plane with nothing behind it | A blind. Never passable |
| The brackets | Carried on nothing | Need **no support**; support what is above them |
| Muqarnas eaves | Geometry for joining shapes that do not meet | Connect to all eight neighbours, diagonals included |
| Tile fields | Pattern with no edge of its own | **Spread** into one empty neighbour on the same row |
| The chamber | The only room; entered by doors, not walls | The goal; **enterable only through an open door** |
| The cupola | Terminus no stair reaches | Pre-placed, impassable |
| The turret | Reachable only by looking | Connected by **line of sight** — same row or column |
| Verse cartouches | Text follows the wall plane | May be placed on **any** rung |
| The flame-halo | The only light in the picture | Draws two extra pieces |
| The sill | The chamber floor ends over open air | Connects **downward** only |

Everything else is a surface: four orthogonal neighbours. Every piece prefers its own
rung and may sit one row off it — a stratum is a stratum.

## The seven locks are the same seven locks

The doors open when their answer-element is *standing in the structure you have built* —
the brick wall for *mulk*, the stair for *barzakh*, the brackets for *malakūt*, the halo
for *nūr*. These are exactly the locks of *The Seven Doors* in Yūsuf Ascent, read straight
from `palace.json`. So you cannot just build upward; you have to have built the right
things, and the tracker in the panel shows which doors have opened.

## A design fix found by a solver, not by eye

The first version let a straight column of surfaces walk into the chamber, bypassing every
door: a twenty-line solver that only makes legal moves won in fifteen placements without
opening a single lock. The second version fixed that and broke the other way — the solver
filled the board, opened six locks, and *lost*, because a surface had taken the one cell
under the chamber that could admit it. The rule that survived both: **the centre column is
the chain — doors only, and doors nowhere else** — with **the chamber enterable only
through an open door**. Re-run on eight seeds, a deliberately naive greedy solver won one (seed 99, 25 placements,
no discards) — so the game is winnable, the bypass is structurally closed, and it is hard
for a strategy that plans nothing. Human difficulty is **unmeasured**; see `docs/DECISIONS.md`.

## Known gaps

- The seven doors are placed in the centre column but not yet required to be in *rung
  order*; the chain can run out of sequence. That is a rule the painting supports and the
  game does not yet enforce.
- Scoring is placements-and-discards only. It does not reward rung progression or using the
  impossible pieces well.
- No touch drag; click-to-select then click-a-cell works everywhere.
- Difficulty is untuned and probably high: a naive greedy solver wins 1 seed in 8. The
  discard button (−30) is the pressure valve. Deck order is seeded, so a hard seed can be
  reported by number.
- The blind door can be placed into the chain and poison it. That is the trap working as
  designed, but the game gives no warning before you do it.
