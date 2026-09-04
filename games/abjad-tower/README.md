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

## The Weight of Brackets (fourth mode)

The Bihzād folio's cut elements as a block set, read across folders from
`../yusuf-ascent/data/palace.json` — data and assets, not code. The ground is a pad; beyond
it is the void. The turret (*bādgīr*), which the painting makes "reachable only by
looking", sits fixed over that void. Build out to it.

One rule, from the painting: **the balcony brackets are carried on nothing, so they are
the only bodies that may be fixed in empty air** — four of them. Every other piece is
dropped and must be carried, and a piece's weight is its share of the page. Anything that
comes to rest beyond the pad falls. Win: a piece rests against the turret and holds.

Design #5 of [`docs/GAME_DESIGNS_BIHZAD.md`](../../docs/GAME_DESIGNS_BIHZAD.md); the
cheapest to build because the solver, the settle test and the scoring already existed.

## Temperament (fifth mode) and the Notebook

The first slice of the lettrist programme in
[`docs/PUZZLE_GAME_IDEAS.md`](../../docs/PUZZLE_GAME_IDEAS.md). Every letter has a nature —
fire, air, water, earth — and **which letter has which is hidden**, because the tradition
does not agree. `data/correspondences.json` ships three rival schemes, each labelled with
what it rests on (one `PORTAL`-grounded split read our way, two that are plainly ours), and
a seed picks one of them to *be* the physics. The player is dealt a hand of fourteen
letters, builds to the ring, and **records what stands** — by hand, or automatically on a
win or a collapse — against every scheme at once in the **Notebook**.

The Notebook is the progression, and it is *taḥqīq* (portal entry `tahqiq-taqlid`): a
claim moves HYPOTHESIS → EXPERIMENT → OBSERVED on consistent results, is DISPROVEN by one
contradiction, and is **CONFIRMED only when a rival on the same question is DISPROVEN** —
three towers that stand under "the cycle" prove nothing if they also stand under "by
form". The play is finding the tower the schemes disagree on. `tests/data.test.mjs`
proves such a pair of letters exists for every scheme pair. The Notebook lives in one
`localStorage` key for the whole project (`turka.notebook.v1`, `src/notebook.js`) so that
what is tested here is already known to the next game.

**Alif is singular**: the only letter that stands on end, and it takes no alif on it.

### What was measured, including the non-result

Friction was the first translation — complementary contacts 0.5, opposed 0.10 — and it
**did not discriminate**: six-block columns of complementary and of opposed letters
toppled alike under the same shove. And cannon-es reports **no contacts for a sleeping
tower**, so a contact test read from the solver at the one moment an experiment is
recorded (settled) always saw zero. Both are recorded in `src/world.js` at the code, and
in `docs/DECISIONS.md`. What shipped: contacts by AABB overlap, and an opposed support
that **pushes its burden sideways at a quarter of g** — above what friction 0.10 holds,
below what 0.5 holds. `window.__abjad.selfTestMizaj()` rebuilds the three columns and
reports: complementary stands at 2.74 (spread 0.01), same-natured at 2.75, opposed shears
to 0.78 (spread 6.59). That is a scripted result, not a human one.

**Grounding, honestly.** That letters have elemental natures at all is *reported* in
`PUZZLERIDEAS.txt` from sources (Ibn ʿArabī; Kâtib Çelebi via an Oxford study) that are
**not in this repo**; no scheme here claims to be theirs, and the file says what to do when
the real table arrives. The 14/14 light/dark split the third scheme reads from is portal
fact; the reading is ours.

## Seeing where a piece enters and lands

Dropping used to be blind: you clicked, a body appeared somewhere overhead, and you found
out where it went by watching it arrive. Every placing mode now previews the drop as the
pointer moves, using **the same aim function the click uses**, so the preview cannot
promise something the placement does not do:

- a **ghost** at the entry point, in the piece's own size and orientation — an upright
  alif previews upright;
- a **dashed fall line** from it down to the surface it will meet, found by casting down
  through the bodies that exist;
- a **ring** on that surface, gold where the piece will rest and vermilion where it will
  not: over the void in Brackets, or inside a fixed body;
- a **readout** naming the piece, its weight and the height it will fall to, and a
  **ring at the entry point** when it goes, so the eye can follow it in.

The one thing the preview does not claim is what happens *after* landing. A piece that
arrives cleanly and then topples still topples; the ring says where it will first touch,
not where it will end.

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
- **Raising was retuned once** (18 blocks to a 3.6 m ring, from 14 to 4.4) and has not been
  playtested by a person since. `?mode=bina&seed=N` reproduces a round exactly, so a
  complaint can name its tower.
- **No touch support.** Orbit and click are pointer-events, which covers touch, but nothing
  has been tested on a phone and the panel layout is cramped below 820 px.
- **`three.js` is imported from a copy in this folder.** That is now the third surface in
  the repo carrying its own three.js; per `games/yusuf-ascent/DECISIONS.md` the move to a
  repo-level `vendor/` is due, and this build is the trigger for it rather than the doer.
- **No audio.** A demolition game probably wants some.
- **Brackets mode is verified by a scripted build, not by a human hand.** One bracket beside
  the turret and one piece is enough to win; four brackets is generous. Untuned.
- **Temperament is verified by `selfTestMizaj()` and a scripted notebook run, not by a
  person.** The collapse detector (settled ≥ 1.2 m below the round's peak) has been
  exercised only by the self-test's opposed column. A hand of fourteen may not contain a
  discriminating pair for every scheme; nothing yet tells the player that.
- The Extraction mode picks its target letter at random among those appearing twice or
  more, so some rounds are far easier than others. No difficulty curve yet.
