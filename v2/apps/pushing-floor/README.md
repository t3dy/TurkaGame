---
title: The Pushing Floor
description: A block-pusher where shoving alone cannot finish the job, and the Arabic letters are the tools you reach for when the stone you need is one you can never get behind.
---

# The Pushing Floor · أرض الدفع

The first **game** on the v2 engine, as opposed to the Scriptorium, which is a
workbench. You walk, you shove stones onto marks, and when a stone turns out to be
unpushable you write a letter to change what "one stone" means.

## Run it

Serve the repo root and open [`index.html`](index.html). Arrow keys or WASD to
walk; `z` to undo. Click a letter in hand, then a cell beside the scribe, to write
it there. `?level=the-yoke` loads a floor directly. Handle: `window.__floor`.

```bash
node v2/apps/pushing-floor/verify_levels.mjs --trace
```

## Why the letters are not decoration

Everything a letter does here is decided by the bonds and flags the VM already
sets. Nothing was added to make pushing work — the primitives already meant these
things, and a floor is just a place where meaning them is useful:

| Primitive | On a floor |
|---|---|
| **BIND** | two stones become **one body**, and a body moves as a whole or not at all — so a stone you can never get behind moves when you push the one you can |
| **SEVER** | a body comes apart, so half of it goes through a gap the whole cannot |
| **AXIS** | a letter that holds a frame will not be shoved, and nothing bonded to it will be — a pin |
| **POUR** | drops what is above through: the vertical move a push cannot make |

The moment-to-moment verb is walking, deliberately. If the letters were the only
verb this would be the Scriptorium with crates; because shoving is ordinary, the
writing stays special and scarce — each letter is **spent** when written, and it
**stays on the floor** as a block afterwards, which is the written register doing
exactly what it does everywhere else in v2.

## Every level is checked three ways before a person sees it

`verify_levels.mjs` asks:

1. **Is it solvable** within its move budget?
2. **Is it solvable *without* the letters?** If yes it fails the build — the level
   would be claiming to be about writing while being about walking.
3. **If it claims a choice matters, is there a wrong one?** Only for levels with
   `claims_choice`. It writes the letter into every empty cell on the floor in turn
   and solves from each; if every placement still wins, the level is telling the
   player a decision is at stake when none is.

Current state:

| Level | Solved in | Without letters | Choice |
|---|---|---|---|
| The Yoke | 6 moves | unsolvable | — |
| The Decoy | 5 moves | unsolvable | 8 of 10 placements lose |

Question 2 is the one that earns its keep. The Impossible Architect in v1 was
solvable *and* solvable for the wrong reason — winnable in fifteen moves without
opening a single door — and a check that only asked "can it be won" passed it
happily.

Question 3 was added after the first version of it measured the wrong thing: it
enumerated only the cells the scribe could reach **on turn one** and cheerfully
reported "2 of 2 placements are dead ends" for a level whose winning placement was
two steps away. True, and useless. It now enumerates the whole floor.

## A design finding worth recording

**AXIS does not fit a step-wise pusher, and POUR barely does.** Both are real
primitives that do real work elsewhere, and neither found a level here:

- **AXIS** pins a body against being shoved — but in a game where you push one
  cell at a time you never overshoot, so a stop you cannot pass is rarely a thing
  you need. Its use would come in a floor with momentum or sliding, which this is
  not.
- **POUR** is a vertical move, and this floor is one level of `y`. It wants a
  stacker, which is the next mode rather than this one.

Rather than invent a contrived level for each, both are left unused and said so.
Two of the four floor-relevant primitives carry the mode; the other two are
waiting for the right game, which is a better answer than a bad level.

## Known gaps

- **Two levels.** A demonstration of the mechanic, not a game with a curve.
- **Only BIND is exercised.** SEVER has no level yet, because breaking an existing
  bond is not something a letter does in v2 — SEVER decides whether a *new* letter
  joins forward, which is a parsing rule. A floor that needs SEVER needs the
  player to be writing multi-letter words on it, which is the next design step.
- **No person has played it.** Both levels are solver-verified and replayed
  through the real input path by `__floor.selfTest()`. Nothing is claimed about
  whether it is any fun.
- **The isometric view is small on wide screens** and there is no zoom.
