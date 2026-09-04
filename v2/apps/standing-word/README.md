---
title: The Standing Word
description: A stacker where you build with gravity off and then let it in, and what holds is decided by which letters join to which — a written word is one body, and the six non-connecting letters are where it breaks.
---

# The Standing Word · الكلمة القائمة

The second game on the v2 engine, and the one that gives **AXIS** the job it has
always meant. You build with gravity off, then let it in. What stands is decided
by the rules the alphabet already had.

## Run it

Serve the repo root and open [`index.html`](index.html). Click a letter, then an
empty cell on the ground or beside something standing. `Enter` lets gravity in,
`z` undoes. Handle: `window.__standing`.

```bash
node v2/apps/standing-word/verify_levels.mjs --trace
```

## The two rules that decide everything

**A written word is one body.** Adjacent letters bond westward, the way the line
runs — so a body stands if *any* cell of it rests on something. Build a horizontal
run off a pier and the whole run is carried by the one letter sitting on the pier.

**The six letters that never join what follows are where it breaks.** ا د ذ ر ز و.
Put a rāʾ at the outboard end of a run and it is joined to nothing, so when gravity
comes in, it goes. Put the same rāʾ at the *inboard* end, resting on the pier, and
it holds up everything hanging west of it. **The letter is not good or bad; its
position is.** That is the whole of the first level.

**Alif holds a frame, so it stands on nothing.** A single upright stroke is the
one form that grants AXIS, and an AXIS letter resists gravity and carries whatever
is bonded to it. This is v1's balcony-bracket rule — *carried on nothing* — arrived
at from the letter's own body instead of from a painting.

## The forecast is the point

Before you commit, dashed arrows show every cell that **would** fall. That is not
an estimate: it clones the world, switches gravity on, settles it, and reports what
moved — the identical call the commit makes, thrown away. The preview cannot be
wrong about the collapse because it *is* the collapse.

Measured in the browser: the verified solution forecasts **0 cells falling**; the
same two letters in the wrong order forecasts **1**, and then loses.

## Levels are checked, and the check found a real fault

`verify_levels.mjs` asks a different second question than the Pushing Floor's did.
There, the useful check was "is it solvable *without* the letters", because walking
was a competing verb. Here writing is the only verb, so that check is vacuous — of
course you cannot build a tower out of nothing. The question that bites instead:

> **Does it matter which letter you use?**

It enumerates every (letter, cell) opening, solves from each, and requires that a
real proportion lose.

**The first version of both levels failed it**, and the reason is worth keeping:
the hands had spare letters, so no opening could doom you — waste one and you still
had enough good ones left. The levels were solvable, and taught nothing. Tightening
each hand to exactly the number of cells needed made every placement matter:

| Level | Solved in | Openings that lose |
|---|---|---|
| The Outboard Letter | 2 | 13 of 14 |
| The Upright Stroke | 3 | 23 of 24 |

## What is not here, and why

**There is no demolition level in this app.** "Knock it down" needs a way to break an
existing bond, which this stacker's own primitives do not have — SEVER is a *parsing*
rule about whether a new letter joins forward, and POUR carries a cell's bonds with
it. The three candidate answers are built and measured side by side in
[`../unmaking/`](../unmaking/README.md), and the choice between them is Ted's and
still open. Until it is made, this app builds and does not unbuild.

## Known gaps

- **Two levels**, both teaching the same pair of rules from different sides.
- **POUR still has no level.** It wants a mode where matter falls through
  structures, which this is not quite.
- **The click-to-cell mapping picks the nearest of several candidate heights**,
  which is a guess about intent and will occasionally choose wrong. A proper fix is
  a height selector.
- **The fall now plays out in time**, and it is not an animation *of* the collapse:
  the frames re-apply the engine's own step-tagged moves to a copy of the world from
  before, so what you watch is the collapse that was computed. A test asserts the
  replay ends on the same world hash the engine ended on.
- **Two hands, switchable in the topbar**: *Lapis* (the original dark table) and
  *Ink* (paper, ink line, hatched shading, the elements drawn as the barred
  alchemical triangles they are). Both are kept; the choice is yours to make by
  looking. The preference persists across every v2 app.
- **No person has played it.** Both levels are solver-verified and replayed through
  the real input path by `__standing.selfTest()`.
