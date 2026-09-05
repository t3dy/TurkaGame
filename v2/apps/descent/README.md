---
title: The Descent
description: The roguelike shell — a run of floors where what varies is the metaphysics. Each floor below the surface runs one of the four historical lettrisms, dealt in a seeded order and never named; work out where you are before you let gravity in, or learn from the fall.
---

# The Descent · النزول

The roguelike [`APPLICATIONS.md`](../../APPLICATIONS.md) said the project was
missing a spine for. Every roguelike has to answer *what varies between runs*, and
random stats would be the wrong answer here. The answer this one gives: **the
metaphysics.** Below the surface, each floor runs one of the four historical
lettrisms from [`rulesets.json`](../../rulesets/rulesets.json) — intellectual,
Sufi, gnostic-messianic, Ottoman operative — dealt in a seeded order and **not
named**. Your letters behave slightly differently than they did upstairs. You must
work out whose rules run here before you commit a structure to gravity, or commit
on a guess and read the collapse.

## Run it

Serve the repo root and open [`index.html`](index.html), optionally with
`?seed=N` to replay a deal. Handle: `window.__descent`;
`__descent.selfTest(seed)` plays a whole run through the real input path,
solving each floor under its hidden ruleset with the same solver the gate uses.

```bash
node v2/apps/descent/verify_run.mjs --trace
node v2/tests/descent.test.mjs
```

## The run

- **Five floors.** The surface is the Workshop, named openly — the one floor that
  tells you where you are, so you can meet the letters before they start lying.
  Floors 1–4 are the four historical rulesets, shuffled by the seed.
- **A floor is a building task.** Piers, marks, a hand of letters. You compose a
  word from the hand and click where its first letter goes; the word runs
  westward from there. A word is legal when it touches something already built —
  the bare ground is never enough, so nothing rests on the floor of the abyss. Then
  you let gravity in, once. If every mark is held by a letter, you descend.
- **A collapse costs a life and teaches for free.** The floor clears; the evidence
  list stays; the ruleset does not change.
- **Candles.** Three per run. A probe (the Reckoner's five, reused as data) costs
  one. Naming the metaphysics correctly *earns* one; naming it wrongly burns one.
  So a name is a wager on what you have seen.

## Evidence is shown, the rule is earned

Nothing tells you the ruleset. What tells you is the floor's behaviour, and every
telling behaviour is written into the evidence list the moment it happens:

| You see | Because |
|---|---|
| *ر JOINED what follows* | a letter that never joins forward was joined anyway — SEVER is denied here (Sufi, or gnostic-messianic) |
| *ا holds nothing here* / *the alif fell* | AXIS is denied — gnostic-messianic |
| *a word of 1 did nothing* | a minimum procedure length — Ottoman operative |
| *strength 62% — 1 of 2 adjacent pairs stand in small-integer ratio* | proportion — intellectual |
| *strength 70% — 2 of 3 letters are luminous* | luminosity — Sufi |

Every line is the engine's own diagnostic or effect, surfaced; the game invents
none of them.

## How the floors were found, and what the gate demands

Hand-designing a floor whose answer depends on the metaphysics failed: every
level I sketched had a placement that won everywhere, because Sufi lettrism joins
everything and so wins wherever the intellectual does. So the floors were
**searched for**, by [`design_search.mjs`](design_search.mjs), over small piers,
three-letter hands and every target set, computing for each candidate the *full
set of winning placements* under each of the four rulesets. A floor is kept when
it is

- **fair** — every ruleset has at least one winning placement, and
- **distinct** — every pair of rulesets has a different set of winning placements
  on it, so a solution carried down from another floor can fail here. (Not *in
  every direction*: the Ottoman floor's solutions are a subset of the
  intellectual's by construction, and the gnostic's of the Sufi's — see below.)

and ranked by how few **universal** placements it has — placements that win under
all four, which a player could learn instead of the assay.
[`verify_run.mjs`](verify_run.mjs) re-applies exactly this to
[`levels.json`](levels.json) and also deals twenty-five seeds through the game's
own shuffle to confirm every floor of every run is solvable under the ruleset it
was dealt.

### Results

The three-letter search tried 5,151 candidates in nine minutes: 198 were fair,
59 fair with every pair distinct, and **44 of those had no universal placement
at all** — a property I had given up on after the hand-designed floors. Every one
of the 44 shares a geometry: a two-high pier, a mark on top, and a mark on the
bare ground two cells out that nothing can be written on. The low mark is reached
by a *wanted fall* (a breaking letter dropped from the outboard end, which the
intellectual and Ottoman floors allow and the Sufi and gnostic floors refuse) or by
a chain along the ground from the pier's foot (which the Sufi and gnostic floors
need and can afford only if the alif is not relied on). Four of the 44 are the
floor pool, differing by hand:

| Floor | Hand | Winning placements (int · sufi · gnostic · ottoman) | Least-distinct pair | Universal |
|---|---|---|---|---|
| The Wanted Fall | ر ا ل | 10 · 6 · 12 · 2 | 0.40 | 0 |
| The Same World | م ر ا | 12 · 8 · 12 · 3 | 0.33 | 0 |
| The Two Breakers | ر ر ا | 7 · 4 · 6 · 1 | 0.33 | 0 |
| The Dāl | ر ا د | 14 · 8 · 12 · 4 | 0.33 | 0 |

`verify_run.mjs` confirms all of that from `levels.json`, and deals twenty-five
seeds through the game's shuffle: every floor of every run is solvable under the
ruleset it was dealt. The search explored only the first pier template in its
budget; the other geometries are being searched for a wider pool.

**Two faults the checks caught on the way.** The gate as first written demanded a
trap *in every direction* and found nothing in 9,579 candidates — impossible by
construction, since the Ottoman floor only forbids short words and the gnostic
floor only removes AXIS, so each one's solutions are a subset of another's. And
the solver offered a two-letter "solution" from a three-letter hand: the engine's
gemination rule had collapsed اا into one shadda'd alif while legality was judged
letter by letter, so an alif reached a cell it never touched. Legality is now
judged on the compiled cells, with a test.

## Known gaps

- **One geometry.** All four floors share the pier and the two marks; only the
  hand differs. That is thematically right — *the world is the same; only the
  metaphysics is hidden* — but a player will notice. The search is written to be
  run over the other templates (`--skip pier2`) and with `--hand-size 4`.
- **Universal placements** are zero on every shipped floor, and the gate prints
  the count rather than assuming it, so a future floor with one cannot slip in
  unlabelled.
- **The Occult Quintet is not used.** `docs/GAME_ROGUELIKE.md` framed the descent
  as kīmiyā → rīmiyā; those are sciences, not metaphysics, and this build varies
  the metaphysics. The two framings are compatible (a science per floor *and* a
  metaphysics per floor) and the quintet is left for the roguelike proper.
- **No person has played it.** Every run in this README was played by
  `selfTest`, through the real input path.
