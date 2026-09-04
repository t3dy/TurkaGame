---
title: Game designs from the Bihzād folio
description: Six game designs that use the 43 cut elements of Yūsuf fleeing Zulaykha as graphical assets, where the documented logic of each part of the painting is the mechanic. One is built; the rest are specified to the point of being buildable.
---

# Game designs from the Bihzād folio

The constraint that makes these interesting: **the mechanic of each piece is the logic the
painting already gives it.** Not "a door piece", but *this* door, which in the Qur'anic
account is locked from within and opens of itself. Not "a stair piece", but *this* stair,
which belongs to neither storey it joins. Every rule below traces to a card in
[`games/yusuf-ascent/data/palace.json`](../games/yusuf-ascent/data/palace.json), which is
why that file exists.

The parts, and the logic each carries:

| Part | Logic in the painting | As a mechanic |
|---|---|---|
| The stairs | *Barzakh* — belong to neither storey they join | Connect to **any** column above or below |
| The eight doors | Locked from within; open of themselves | Passable only when their key-element is present |
| The balcony door | Painted on a plane with nothing behind it | A blind. Never passable |
| Balcony brackets | Carried on nothing | Need **no support**; support what is above them |
| Muqarnas eaves | Geometry for joining shapes that do not meet | The universal joiner — connects diagonally |
| Tile fields | Pattern with no edge of its own; the frame cuts it | **Stretch** to fill adjacent space |
| The chamber | The only room; its floor ends in a sill over open air | The goal; exits downward only |
| The cupola | Terminus no stair reaches; no figure occupies it | Pre-placed, **impassable** |
| The turret (bādgīr) | Reachable only by looking | Connected by **line of sight**, not adjacency |
| Verse cartouches | Text built into the wall, following its plane | Go on **any** rung |
| The flame-halo | The only light in a lightless picture | **Reveals** — draws extra pieces |

---

## 1. The Impossible Architect — *built* · [`games/impossible-architect/`](../games/impossible-architect/)

**Genre.** Tile-laying route-builder (Carcassonne's placement, Pipe Dream's goal), with the
painting's spatial logic replacing Euclid's.

**Board.** Five columns by seven rows. The rows *are* the seven rungs of the Yūsuf ladder,
street at the bottom, crown at the top. The street door is fixed at the bottom centre; the
chamber at the fifth row; the cupola sits above it, pre-placed and impassable, because no
stair in the painting reaches it.

**Pieces.** The other 38 elements of the folio, shuffled into a deck. You hold five. Each
piece prefers its own rung and may be placed one row off it — a stratum is a stratum. The
cartouches are the exception: text follows the wall plane, so they go anywhere.

**Placement.** Everything needs support from below, exactly as a real course does —
except the balcony brackets, which are carried on nothing and carry whatever is put above
them.

**The goal.** A connected route from the street door to the chamber. Connection follows
each piece's own logic (the table above). The seven real doors each open only when their
lock's answer — the same locks as *The Seven Doors* — is already standing somewhere in
your structure: the brick wall for *mulk*, the stair for *barzakh*, the brackets for
*malakūt*. So you cannot just build upward; you have to have built the *right things*.

**Why it is the one to build first.** It uses the most pieces, it uses their logic most
literally, and it reuses the locks, rungs and cards of the existing decomposition
unchanged — so it is an argument that `palace.json` is a real game-data layer and not a
one-game convenience.

## 2. Doors That Give — a chase across the actual folio

**Genre.** Top-down pursuit on the painting itself. Think *Pac-Man* on a map that is a
Bihzād.

**Space.** The folio at full size is the level; the region boxes are the walkable rooms,
and the doors are the connections between them. Yūsuf is a sprite; Zulaykha is another.

**The asymmetry is the mechanic.** Zulaykha is bound by the painting's *apparent*
geometry — she walks doors and floors as a person would. Yūsuf is bound by its *real*
geometry: the stairs take him to any level (barzakh), the doors give way as he reaches
them (Q 12:23 — locked, and open anyway), and the sill over open air is not a drop for
him. He cannot be caught if he reads the building correctly. He can if he reads it as a
house.

**Loss condition.** The shirt torn at the last door. It is the one thing in the story that
actually happens, and it happens at the *street* door, which is the reverse of where a
chase game would put its climax. Keep that.

## 3. Station Point — a perspective puzzle in three dimensions

**Genre.** *Superliminal* / *Perspective*-family. Extends Yūsuf Ascent Prototype B into a
game rather than a demo.

**Mechanism.** The 41 elements are scattered through a 3-D volume at their seven depths.
From exactly one place to stand they recompose into the painting; from everywhere else
they are an incoherent field of fragments. You move a camera. The puzzle is finding the
station point — and then the level *changes* the depths, and you find it again.

**The teaching.** This is the strongest claim the whole project makes about the folio —
that it is a solid that coheres from one viewpoint — turned into something a player
*discovers by failing to see it*. Prototype B already carries the invariant test
(`checkStationInvariant`); the game is that test with the answer hidden.

**Escalation.** Later levels hide one element, and the recomposed picture has a hole
where it should be. You are asked what is missing. The answer is a card.

## 4. Muqarnas — a joining puzzle

**Genre.** Falling-piece puzzle. *Tetris*'s cadence, but the pieces are the folio's
architectural fragments and they do not fit each other.

**Mechanism.** Fragments descend — an arch, a bracket, a tile field, a door. Their edges
are mismatched by design, because in the painting they *are*. You hold a limited number
of muqarnas cells, and a muqarnas cell is the only thing that lets two mismatched edges
meet. Spend them well and the wall rises; spend them badly and it shears.

**Grounding.** Muqarnas is literally a vault built from subdivided niches so that shapes
which do not meet can. The game is the definition, with a clock on it.

## 5. The Weight of Brackets — a physics build

**Genre.** Structural engineering puzzle using Abjad Tower's physics engine.

**Mechanism.** Every folio element is a rigid body with the sprite as its face. The
balcony brackets are the only pieces that can be cantilevered — they hold weight over
nothing, as the painting's do. Everything else obeys gravity honestly. The puzzle: extend a
structure out over a void to reach the turret, using as few brackets as the level allows.

**The crossover.** Abjad Tower already has the solver, the settle detection and the
scoring pattern. This is a second block set for it — the folio's parts instead of the
letters — with one new rule (the bracket exemption). Half a day.

## 6. Cartouche — text as load-bearing wall

**Genre.** Wall-completion puzzle.

**Mechanism.** Each verse cartouche in the folio tilts to follow the plane of the wall it
sits in — the text is a building material. In the game you are handed walls with gaps and
a set of cartouches, and a wall only stands when its cartouche lies along its plane. Rotate
the text to the wall, not the wall to the text.

**Grounding.** Portal entry `ilm-al-huruf`: letters are the atoms of the imaginal realm,
and the corpus says lettrist theory informs the ornate literary practice of the period —
the doctrine applied to the page. Here it is applied to the wall.

---

## What all six share

- **Assets are the 41 region sprites**, cut once by `imagelab/scripts/cut_regions.py` and
  never redrawn. No invented art.
- **Rules come from `palace.json` cards**, so every mechanic can be traced to the sentence
  that justifies it, and the card is shown in play.
- **The interpretation is labelled where the player meets it**, per the house rule — the
  ladder is ours, the door-chain is ours, and the pieces say so.

## Build order

1. **The Impossible Architect** — built, see below. Most pieces, most logic, most reuse.
2. **The Weight of Brackets** — cheapest next step; a block set for an engine that exists.
3. **Station Point** — the strongest teaching; a demo already carries its core.
4. **Doors That Give** — needs pathfinding on irregular regions; a real slice of work.
5. **Muqarnas**, **Cartouche** — good ideas needing more design before code.
