---
title: v2 handover — read this first
description: The pickup document for TurkaGame v2. What exists, what is verified and by what, what is deliberately absent, and where to look next — written so a session that has read nothing else can continue the work.
---

# v2 handover

**Read this before anything else in `v2/`.** It is written so that a session with
no memory of how any of this came about can pick the work up without reading a
conversation. If something here disagrees with a chat log, this file wins.

Root project entry: [`../CLAUDE.md`](../CLAUDE.md). v1 is frozen —
[`../games/FROZEN.md`](../games/FROZEN.md).

## The one-paragraph version

v2 makes lettrism the **programming language of the world** rather than its theme.
Eight primitives are *derived from observable facts* about the Arabic letters, so
the instruction set is a consequence of the alphabet rather than a table someone
chose. Five historical rulesets **genuinely disagree** about what a letter may do,
separated by *motive* (the portal's own `three-lettrisms` finding). The execution
model is the *Mafāḥiṣ*'s three registers. Preview and execution are the same
function. And the world can be **read back** as text — including the parts the
player did not write, which is the overarching principle made mechanical.

## The overarching design principle

> **The player should gradually discover that the Arabic alphabet is not merely the
> subject of the game. It is the language in which the game world is written.**

Both halves are load-bearing and both are implemented. *The world is written in
letters* → `engine/reader.js`. *Gradually discover* → `engine/ledger.js`, on the
rule **evidence is always shown, the rule is earned**.

## What exists, and what verifies it

| Thing | Where | Verified by |
|---|---|---|
| Letter table (28, four independent divisions) | `data/build_letters.py` → `data/letters.json` | `python v2/data/build_letters.py --verify` |
| Five rulesets, differing by motive | `rulesets/rulesets.json` | tests assert motive/kind/sources/interpretation_note |
| World: cells, bonds, rules-as-data | `engine/world.js` | `node v2/tests/engine.test.mjs` |
| VM: compile → effects → preview \| execute | `engine/vm.js` | same, incl. preview≡execute under all 5 rulesets |
| Reader: world → text | `engine/reader.js` | same |
| Ledger: what has been witnessed | `engine/ledger.js` | same |
| Agent: walk and shove | `engine/agent.js` | app level-verifiers |
| **The Scriptorium** (workbench) | `apps/scriptorium/` | 4 tasks via `__scriptorium.selfTest()` |
| **The Pushing Floor** (block-pusher) | `apps/pushing-floor/` | `verify_levels.mjs` + `__floor.selfTest()` |
| **The Standing Word** (stacker) | `apps/standing-word/` | `verify_levels.mjs` + `__standing.selfTest()` |
| **The Unmaking** (3 demolition routes) | `apps/unmaking/` | `__unmaking.matrix()` |
| **The Reckoner** (4 recovered mechanics) | `apps/reckoner/` | `verify_levels.mjs` + `__reckoner.selfTest()` |
| Operations on standing structures | `engine/operations.js` | `node v2/tests/engine.test.mjs` |

**Run every check:**

```bash
python v2/data/build_letters.py --verify
node v2/tests/engine.test.mjs
node v2/apps/pushing-floor/verify_levels.mjs
node v2/apps/standing-word/verify_levels.mjs
node v2/apps/reckoner/verify_levels.mjs
python tools/check_repo_rules.py
```

## The rules that are enforced in code, not prose

This project has twice shipped a rule that existed only as prose and did nothing
(43 copyrighted PDFs tracked for weeks; a stale engine served from cache while the
correct file was live). **Treat any rule that lives only in a README as
unenforced.** The ones with teeth:

- `tools/check_repo_rules.py` **R1–R5** — no source PDFs, manuscript provenance,
  local-only trees. Runs in the pre-commit hook.
- **R6 — the module cache-busting token.** Two halves, because the first was not
  enough. (a) Every `?v=N` under `v2/` must be the same N. (b) The token must have
  **moved whenever `v2/engine/` moved** — checked against a hash recorded in
  `v2/engine/VERSION.json`. Run `python v2/tools/bump_version.py` after any engine
  change. Both halves were tested by deliberately breaking them.

  This exists because the same bug shipped **twice**: an engine file changed, the
  token did not, and every browser that had been here before kept running the old
  module. The deployed file was correct and the running code was not, and every
  local test passed. R6(a) did not catch the second one, because the tokens all
  agreed — at the stale value.
- `build_letters.py --verify` — the four alphabet divisions are the sizes claimed
  **and are independent of each other**.
- Each app's `verify_levels.mjs` — a level must be solvable, and must **not** be
  solvable the wrong way (see below).

## How a level is allowed to ship

The house rule, earned when v1's Impossible Architect turned out to be winnable in
fifteen moves without opening a single door: **check a puzzle with a solver before
a person.** But "can it be won" is not enough — that board passed it. Each mode
asks a second question suited to what it is about:

| Mode | Second question |
|---|---|
| Pushing Floor | Is it solvable **without the letters**? If yes, the letters are decoration. |
| Standing Word | Does it matter **which letter** you use? (Both levels failed this on the first pass.) |
| Reckoner `extract` | Solvable, **and** not solvable wherever you put the doomed letter |
| Reckoner `reckon` | A winner exists, and only a small share of the range wins |
| Reckoner `assay` | Do the probes **distinguish** the hidden ruleset from all the others? |
| Reckoner `station` | At least one direction reads the target, and not all of them do |
| Any, optional | If it claims a choice matters, **does a wrong choice exist**? |

## Verifying against the live site

A green push is not a deploy, and — since the cache bug — **a live page is not
proof the deployed code is running.** The full check:

1. `gh api repos/t3dy/TurkaGame/pages/builds/latest` — status `built`, commit == HEAD.
2. Load the live URL.
3. **Ask the running engine what it contains** before believing what it does, e.g.
   `/c\.fixed \|\| c\.axis/.test(String(new World({}).settle))`.
4. Then run the app's `selfTest()`.

## What is deliberately absent

Nothing below is an oversight. Each is a gap with a reason, and inventing a
primitive to fill one is the thing this project does not do.

- **Demolition / knock-em-down.** Needs a way to break an *existing* bond. SEVER is
  a **parsing** rule (does a newly written letter join forward?), not a cut; POUR
  carries a cell's bonds along when it moves it. **All three candidate routes are now
  built and measured** in [`apps/unmaking/`](apps/unmaking/README.md) — the isolated
  form (INTERPRETATION), the utterance (GAME_FICTION) and the thrown stone (no
  claim). **The decision is Ted's and is not made.** Until it is, no demolition level
  exists. The measured result is uncomfortable and should not be smoothed over: on an
  unpinned structure **the route with no claim behind it wins**, and the only thing
  that stops it is an alif.
- **A fourth+ historical ruleset from Ibn ʿArabī or Kâtib Çelebi.** Those sources
  are not in this repo. `rulesets/rulesets.json` names them as absent rather than
  inventing their tables.
- **Which planet/sign belongs to which letter** in the Hebrew build. That is what
  the traditions disagree about; it belongs in rulesets, not the letter table.
- **Glyph artwork** — elemental, planetary, zodiacal. None exists anywhere in the
  workspace. This is the largest unstarted piece and it blocks
  `../../GoldenDawnBlocks/` from being anything but data.

## Standing caveats — say these, do not quietly drop them

- **No person has played any of this.** Every number in every README comes from a
  solver, a `--verify`, or a scripted replay. Nothing is claimed to be fun or
  well-paced.
- **Two levels per mode is a demonstration of a mechanic, not a game with a curve.**
- v1's notebook (`turka.notebook.v1`) stays with v1; v2's ledger is
  `turka.v2.ledger`. Progress does not carry across.

## Where to look, in order

1. This file.
2. [`README.md`](README.md) — the architecture and why each commitment is there.
3. [`AUDIT_V1.md`](AUDIT_V1.md) — the five frozen games measured against v2's aims
   (*does it teach the metaphysics?*).
4. [`AUDIT_V1_PORTABILITY.md`](AUDIT_V1_PORTABILITY.md) — every v1 design measured
   against what the engine can actually **run**, with the four things that cannot be
   ported, the three that come across better, and a ranked list of engine additions.
   Read this before proposing new work: most of what looks unbuilt is already
   cheap.
5. [`APPLICATIONS.md`](APPLICATIONS.md) — the mechanics taken across every design,
   including the ones that are still only documents. Its main finding: **the Assay
   is the spine both the roguelike and CareerSim were missing**, and in CareerSim's
   case it is not a mechanic bolted onto the subject, it *is* the subject.
5. The app READMEs, each of which ends with its own honest known-gaps list.
6. `../docs/DECISIONS.md` — chronological, with the rejected options and the faults
   found by testing. The most useful file in the repo for not repeating a mistake.
