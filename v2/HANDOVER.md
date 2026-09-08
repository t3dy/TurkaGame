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
| **The Descent** (roguelike: the metaphysics varies) | `apps/descent/` | `verify_run.mjs` + `tests/descent.test.mjs` + `__descent.selfTest(seed)` |
| **The Introduction** (guided course, the sage, the golem) | `apps/introduction/` | `tests/introduction.test.mjs` (every lesson's solution finishes its task) + `__intro.selfTest()` |
| **The Tribunal** (three inquisitions; you are Ibn Turka) | `apps/tribunal/` | `verify_trials.mjs` + `__tribunal.selfTest()` / `.refuseEverything()` |
| Taksīr: breaking a word into its hidden letters | `engine/taksir.js` | `node v2/tests/taksir.test.mjs` (pinned to the source's own ALF example) |
| The voice selector (four registers) | `apps/shared/voice.js` | `node v2/tests/voice.test.mjs` (all four present; no voice drops a citation) |
| Hebrew letter table (22 + 5 finals) | `data/build_hebrew.py` → `data/hebrew.json` | `python v2/data/build_hebrew.py --verify` |
| Operations on standing structures | `engine/operations.js` | `node v2/tests/engine.test.mjs` |

**Run every check:**

```bash
python v2/data/build_letters.py --verify
node v2/tests/engine.test.mjs
node v2/apps/pushing-floor/verify_levels.mjs
node v2/apps/standing-word/verify_levels.mjs
node v2/apps/reckoner/verify_levels.mjs
node v2/apps/descent/verify_run.mjs
node v2/tests/descent.test.mjs
node v2/tests/glyphs.test.mjs
node v2/tests/introduction.test.mjs
node v2/tests/taksir.test.mjs
node v2/tests/voice.test.mjs
node v2/apps/tribunal/verify_trials.mjs
python v2/data/build_hebrew.py --verify
python tools/check_repo_rules.py
```

## The rules that are enforced in code, not prose

This project has twice shipped a rule that existed only as prose and did nothing
(43 copyrighted PDFs tracked for weeks; a stale engine served from cache while the
correct file was live). **Treat any rule that lives only in a README as
unenforced.** The ones with teeth:

- `tools/check_repo_rules.py` **R1–R5** — no source PDFs, manuscript provenance,
  local-only trees. Runs in the pre-commit hook.
- **R6 — the module cache-busting token**, now covering `.css?v=` as well as
  `.js?v=` (a stylesheet cached at an old token repaints the page in the wrong
  palette while the canvas draws in the right one). Two halves, because the first
  was not enough. (a) Every `?v=N` under `v2/` must be the same N. (b) The token must have
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
| Descent | **Fair under every metaphysics, and distinct**: every pair of rulesets has a different set of winning placements on the floor (not *in every direction* — the Ottoman floor's solutions are a subset of the intellectual's by construction, the gnostic's of the Sufi's). Floors are *searched for*, not sketched (`design_search.mjs`), and the gate **prints** how many universal placements remain rather than hiding them; every shipped floor has zero. |
| Tribunal | **Answerable** in its own court, **earned** (not answerable without breaking), and **court-bound** (the court's own doctrine changes the verdict). Two of three trials failed court-bound on the first pass. |
| Any voiced text | All four voices present, and no voice drops a citation the austere one carries. |
| Any, optional | If it claims a choice matters, **does a wrong choice exist**? |

## Verifying against the live site

A green push is not a deploy, and — since the cache bug — **a live page is not
proof the deployed code is running.** The full check:

1. `gh api repos/t3dy/TurkaGame/pages/builds/latest` — status `built`, commit == HEAD.
2. Load the live URL.
3. **Ask the running engine what it contains** before believing what it does, e.g.
   `/c\.fixed \|\| c\.axis/.test(String(new World({}).settle))`.
4. Then run the app's `selfTest()`.

## Two hands

Every app's topbar has **Draw in Ink / Draw in Lapis**. Both renderers are kept on
purpose: the choice between the dark table and the engraved page is Ted's to make by
looking, and neither is the "real" one until he does. `apps/scriptorium/src/iso.js`
holds both; `apps/shared/hand.css` turns the page chrome with the canvas. If one is
eventually chosen, delete the other from `STYLES` and the CSS — do not leave a dead
toggle.

**Signs are paths, not characters.** `apps/shared/glyphs.js` draws the 26
correspondence signs (elements, principles, planets, zodiac); `iso.js` draws its
element faces through it, and `apps/glyphs/index.html` is the sheet. Add a sign
there, never as a Unicode character in an app — `tests/glyphs.test.mjs` checks each
one draws, stays inside its circle and scales. The Ink letter face is Amiri fetched
at runtime from Google Fonts (linked in every v2 page's `<head>`); nothing is
vendored, so an offline viewer gets the system serif. Vendoring is a download and
waits for Ted.

## The `?v=` token protects sub-resources, not the page itself

Learned 2026-09-07, after ten minutes of confusion. `bump_version.py` rewrites every
`?v=N` **inside** the HTML, so a bumped token makes the browser fetch fresh JS and
CSS. It cannot make the browser re-fetch **the HTML document that carries the
token**. A page whose own `index.html` is cached keeps loading the old token and so
the old modules, and the symptom is a debug handle that is missing a property you
just added.

- **In the browser pane:** navigate with a throwaway query (`?cachebust=1`), or open
  a fresh tab.
- **Reading the console after a change:** the pane's error buffer is **cumulative
  per tab and survives navigation**. An error naming an old token is history, not a
  live fault. Confirm in a new tab before chasing it.
- **On GitHub Pages** this is not an issue in practice — Pages serves HTML with a
  short cache — but confirm the served file, not the local one, when a live check
  disagrees with a local one.

## Controls, instructions, and the camera (added 2026-09-07)

Ted: "the controls are really opaque and the goals of the game are really
confusing… I want full instructions." Two shared modules answer that and every
app uses both:

- **`apps/shared/howto.js`** — `mountHowTo(button, spec)` mounts the **How to
  play** panel: goal and win/lose conditions, every control, the cursor, the
  preview, the camera, in full sentences. It opens on first visit (remembered per
  app in localStorage), on the topbar button, and on `?`. Each app's `spec` lives
  at the top of its `ui.js` as `HOWTO`. The camera and cursor sections are shared
  text appended automatically. **When you add a control, add its sentence here
  first**; the corner legend is in addition, never instead (CLAUDE.md).
- **The camera in `iso.js`** — `turn` (quarter turns), `zoom`, `pan`, applied in
  `project()` and undone in `unproject()`, so click-to-cell keeps working after a
  turn. `iso.bindCamera(el, redraw)` mounts the ⟲ ⟳ + − ⌂ toolbar and wires
  Q/E, +/−, arrows, R, the wheel and right-drag. `grid()` draws a **compass** on
  the floor: "words run this way", turning with the world.
- **Hover previews** — the Descent and the Standing Word draw a translucent ghost
  of the pending write under the mouse and report, in the `#hover` box, whether it
  is allowed, what it joins or breaks, and how many cells would fall afterwards —
  computed by performing the write on a copy. The Pushing Floor outlines the
  cursor and says whether the scribe can write there.



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

## Who the player is, and the voice they hear it in (decided 2026-09-07)

Two directions from Ted that govern all future writing:

- **The player's identity belongs to the MODE, not the project.** He chose "Ibn
  Turka himself" *and* said: "let's have them be particular game modes, we are
  building a lot of game ideas and I don't want them all to be subsumed into
  Turka's biography or the anon sage sim." So `apps/tribunal/` is his biography and
  says so; the Introduction has an unnamed sage; the block games have no one at
  all. Do not retrofit a protagonist onto a mode that does not want one.
- **Register is the player's choice.** `apps/shared/voice.js` gives four voices —
  austere, baroque (the register the scholarship is actually written in), uncanny,
  warm — and a picker in the topbar. Text in data may be a plain string or a bundle
  with one version per voice. **The rule: a voice changes how something is said and
  never what is claimed**; `voiceLint()` fails any voice that drops a citation or
  honesty label the austere text carries, and `tests/voice.test.mjs` enforces it.
  When you write new player-facing prose, write all four or write a plain string.
- **Failure has two teeth**, also his call: denunciation (social) and a corrupted
  notebook (epistemic). The Tribunal has both in first form — standing, convictions,
  and a record of every break that the third court reads back.

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
