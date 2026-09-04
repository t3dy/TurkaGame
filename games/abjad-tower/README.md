---
title: Abjad Tower
description: A physics stacking/demolition game where blocks are the 28 Arabic letters, mass is abjad value, and the ways of acting on the tower are techniques the sources describe.
---

# Abjad Tower · برج الأبجد

A *Boom Blox*-shaped physics game — stack a tower, bring one down — where the blocks are
the **28 Arabic letters**, a block's **mass is its abjad value**, and the six ways of acting
on the tower are operations drawn from this project's own research rather than invented
spell names.

Built after the pattern of the sibling alchemy-blocks projects in this workspace
(`AlchemyBlockInvaders`, `AlchemyBalanceTetris`): **blocks carry an ontological identity,
reactivity is the mechanic, and XP is for witnessing something new rather than for
repetition.**

## Run it

Serve the repo root (`.claude/launch.json` config `turkagame-site`, port 7521) and open
`/games/abjad-tower/index.html`. No build step.

Drag to orbit · scroll to zoom · click to act. Debug handle: `window.__abjad`
(`.world`, `.state`, `.tome`, `.findRuns(n)`).

## Why letters

The portal's `ilm-al-huruf` entry states the correspondence Ibn Turka systematised:

> the 28 letters · the 28 divine names · the 28 lunar mansions · 28 levels of celestial and
> sublunary reality · 28 human faculties

A correspondence table with a **number** attached to every row is already a game, and
`abjad-numerology` supplies the number: alif = 1 through ghayn = 1000. So the table stops
being a lookup and becomes physics.

Two more facts do real mechanical work:

- The letters split into **light (nūrānī)** and **dark (ẓulmānī)** — the light ones being
  the fourteen *muqaṭṭaʿāt* that open twenty-nine Sūras, **exactly half the alphabet**. A
  14/14 split is a switch, and it is the Inversion operation.
- **B is "the first of the dark letters and the fountainhead of all duality"** — which is
  why the Qur'an opening on it rather than on alif is a genuine puzzle in the tradition.

`build_letters.py --verify` checks the letter set, the 14/14 split and the ascending abjad
order against `portal/db/turka.db`, so the roster cannot silently drift from the portal.

## The six operations

| | Operation | Cost | Rests on |
|---|---|---|---|
| ضرب | **Strike** | 1 | nothing — the control case |
| طلسم | **Talisman** | 2 | portal `talismanic-science` |
| اسم | **Invoke the Name** | 3 | portal `ilm-al-huruf` |
| حساب | **Reckoning** | 2 | portal `abjad-numerology` |
| خلع | **Doffing** | 2 | Melvin-Koushki, *Mir Damad's On Doffing*, 15 |
| نور و ظلمة | **Inversion** | 3 | *Being with a Capital B*, 2 |

Each carries its passage into the Tome, shown the first time you perform it.

**Strike exists to be the control.** It is a thrown stone with no correspondence behind it,
and every occult operation has to earn its place against simply hitting the tower. The
scoring is what says whether it did.

The two most interesting in play:

- **Reckoning** names a number and annihilates any vertical run of touching letters whose
  abjad values sum exactly to it. Runs must be **at least two letters** — the source speaks
  of *composing words*, and a single-letter "run" would be trivial since every block prints
  its own value. This forces you to read the tower as an arithmetic object, which is
  precisely the claim lettrism makes about the world.
- **Doffing** makes a block stop colliding for three seconds. Whatever rested on it does
  not. Then the body returns — into whatever is now occupying that space.

## Three modes

- **Demolition** (هدم) — bring every block below the ring on a budget of operations.
  Unspent operations score.
- **Raising** (بناء) — drop blocks to reach the ring and hold it five seconds. Heavy
  letters make a foundation; light ones let you reach.
- **Extraction** (استخراج) — remove every instance of one named letter and leave the rest
  standing.

## Where the game bends its source

**One place, stated everywhere it matters** — in the generator, in the data file, and in
the Tome:

A letter's mass is its abjad value **compressed by log₁₀**. The raw series runs 1 to 1000,
three orders of magnitude, and no rigid-body solver stacks that without exploding. The
compression keeps the **order** exactly as the tradition has it (alif lightest, ghayn
heaviest) and makes the **ratio** ours. Nothing else about the correspondence is altered.

## Technical notes

**Physics is cannon-es 0.20.0 (MIT), vendored** — `vendor/cannon-es.js` with its licence.
Three.js renders, cannon simulates, and nothing crosses between them but a position and a
quaternion per frame.

Stacking is the hard case for a solver, so the settings are chosen for stack stability and
documented at the top of `src/world.js` rather than tuned by feel and forgotten:
14 solver iterations, friction 0.5, restitution 0.05, sleep enabled with a generous speed
limit so towers settle rather than shiver.

**Block proportions are Jenga's — width = 3 × depth — and that is structural, not
cosmetic.** Three blocks side by side must form a square so the next course, laid
crosswise, covers the same footprint. An earlier version used 1.0 × 0.6, the footprint came
out a narrow cross, and every tower tipped itself over while settling. It read as a physics
bug and was a geometry one.

Glyphs are drawn to a canvas at runtime rather than shipped as images: 28 letters at any
resolution, no asset pipeline, crisp at any zoom.

## Known gaps

- **The Tome persists in `localStorage` only.** Wrapped in try/catch so a private window
  degrades rather than breaks, but progress does not follow you between browsers.
- **Raising is hard**, possibly too hard: 14 blocks to reach 4.4 m means near-perfect
  stacking. Untuned — it wants playtesting rather than another guess.
- **No touch support.** Orbit and click are pointer-events, which covers touch, but nothing
  has been tested on a phone and the panel layout is cramped below 820 px.
- **`three.js` is imported from a copy in this folder.** That is now the third surface in
  the repo carrying its own three.js; per `games/yusuf-ascent/DECISIONS.md` the move to a
  repo-level `vendor/` is due, and this build is the trigger for it rather than the doer.
- **No audio.** A demolition game probably wants some.
- The Extraction mode picks its target letter at random among those appearing twice or
  more, so some rounds are far easier than others. No difficulty curve yet.
