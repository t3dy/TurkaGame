---
title: The Letter Machine
description: A puzzle game in which the Arabic letters are the instructions and the alchemical matter is the data — and which instruction a letter is, is written in its own body rather than in a correspondence table.
---

# The Letter Machine · آلة الحروف

> *Don't make letters another ingredient in the alchemy game. Make Lettrism the
> programming language of the alchemy game.*
> — the design brief this is built from (`PUZZLERIDEAS.txt`)

A small grid puzzle. The blocks are **matter** — the four elements, each with a
number — and the **letters** you place among them are **verbs**. You arrange, you
run, and the board executes.

## Run it

Serve the repo root (`.claude/launch.json` config `turkagame-site`, port 7521) and open
`/games/letter-machine/index.html`. No build step. `?p=<puzzle-id>` loads a puzzle
directly. Debug handle: `window.__machine` (`.m`, `.notebook`, `.selfTest(id)`).

Checks, both runnable from the repo root:

```bash
node games/letter-machine/tests/engine.test.mjs && node games/letter-machine/verify_puzzles.mjs
```

## The one idea

A letter's operation is **derived from its written form**, not looked up:

| What is true of the glyph | What it does | How many letters |
|---|---|---|
| a single upright stroke | **Axis** — holds its column; nothing in it may be bound away | 2 |
| dots **above** (n of them) | **Raise** — the block above rises n rungs of the abjad ladder | 12 |
| dots **below** | **Lower** — the block below falls n rungs | 3 |
| a **closed** form | **Bind** — the blocks either side merge, gathering leftward | 9 |
| a **descending tail** | **Pour** — the block above falls through to the first empty cell below | 17 |

A letter's program is the sum of what is true of it, so **ṣād** binds *and* pours,
**qāf** raises twice, binds and pours, **alif** only holds an axis — and **dāl** and
**kāf** do nothing at all, because nothing is true of them. That two letters are inert
is a result of the rule, not an oversight; it is what makes the rule discoverable
rather than memorable. `verify_puzzles.mjs --programs` prints the whole table next to
the glyphs so it can be checked by eye.

This is the alternative to what the brief warns against — *"a giant RPG-style fixed
tooltip: ب = Water, feminine, Moon, virtue X"*. There is no such table here. There is
one rule with five clauses, and it covers the alphabet.

## Two more things the letters do

**The dot is a piece.** Move it: above → below → gone. A letter that raised now
lowers; a dotless **bāʾ** is inert. Form, position, function — and bāʾ is the letter
the tradition argues over hardest, being "the first of the dark letters and the
fountainhead of all duality".

**Transposition.** Nothing is created: a letter read as matter is the same relation in
another representation, with its abjad value intact. *Which element* it turns out to
be is decided by a **scheme hidden from you** — the same three rival schemes that
decide which letters hold each other up in
[Abjad Tower's Temperament mode](../abjad-tower/index.html?mode=mizaj). So a
transposition here and a tower there are two experiments on **one question**, and they
share one notebook. A transposition that *fails* — no letter of that value answers to
that element — is as informative as one that succeeds, and costs the same.

## Reading order is a rule, not a decoration

The run reads **right to left**, top to bottom, because that is how the line is read;
and a bind gathers its sum **leftward** for the same reason. The *Reckoning* puzzle is
built on this: the same two letters in the same two cells give 12 or 7 depending only
on which bind happens first, and which happens first is decided by the script's
direction rather than by you.

## Where it rests, and where it does not

| | |
|---|---|
| **PORTAL** | The abjad values, and the **ladder** they form — units, then tens, then hundreds. *Raise* and *lower* move a value one rung **of that series**, not by one unit, because the series is what the tradition actually asserts (`abjad-numerology`). |
| **PORTAL** | **Alif is singular** — a line rather than an ingredient, taking no alif beside it. Alif = 1, avatar of divine Oneness (`ilm-al-huruf`). |
| **PORTAL** | The light/dark colouring of the tiles: the fourteen *muqaṭṭaʿāt* against the fourteen dark, exactly half the alphabet. |
| **INTERPRETATION** | **What each form does.** The form facts themselves are observable and generated with a `--verify` pass, but "closed binds, tail pours" is ours. |
| **REPORTED** | That a letter's *shakl* synthesises its occult properties (al-Būnī) is reported in `PUZZLERIDEAS.txt` from a source **not held in this repo**. No rule here claims to be his, and `data/correspondences.json` keeps the list of what is reported but absent. |

The four elements are drawn as triangles, which is the alchemical notation — but the
tradition separates the pairs with a bar across the triangle and we use solid against
hollow, because a barred triangle is not a character every font has and a block that
renders as an empty box teaches nothing.

## The puzzles were checked by a solver before a person

`verify_puzzles.mjs` breadth-first searches every shipped puzzle and **fails the build**
if one is unsolvable *or* winnable in one move or none. Current state:

| Puzzle | Shortest solution | States searched |
|---|---|---|
| The Pipeline | 2 | 2,166 |
| Reckoning | 2 | 1,978 |
| The Dot | 2 | 1,134 |
| Transposition | 2 | 303 |
| The Square (wafq) | 3 | 3,622 |

That gate exists because The Impossible Architect's first board was winnable in fifteen
moves without opening a single door, and nobody noticed by looking.

## Known gaps

- **No person has played this.** Every number above is from a solver or a scripted
  run. Nothing here is claimed to be fun or well-paced.
- **Five puzzles is a demonstration, not a game.** There is no progression, no
  generator, and the difficulty curve is an assertion.
- **The board does not animate.** A run resolves instantly and the log explains it,
  which makes the machine hard to *read* while it works — the single biggest thing
  wrong with it as a toy.
- **Only three of the brief's operations are in.** Bind, raise/lower and pour. The
  brief also asks for separate, transfer, invert, rotate and propagate.
- **`rows-alike` ignores columns and diagonals**, so it is a wafq in name only.
- **The notebook module is imported across folders** from `../abjad-tower/src/`, which
  the project's own rule discourages. It is deliberate: the notebook is not a library
  but the *schema* of one shared save, and two copies of that state machine over one
  store is how two games come to disagree about whether a claim is confirmed.
