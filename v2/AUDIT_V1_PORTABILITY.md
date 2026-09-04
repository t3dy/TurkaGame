---
title: Can v2's lettrist logic run the v1 designs?
description: Every v1 design — the five built games, their modes and operations, the six Bihzād designs and the standing design docs — audited against what the v2 engine can actually do. Four things genuinely cannot be ported; most of the rest come across improved.
---

# Can v2's lettrist logic run the v1 designs?

A different question from [`AUDIT_V1.md`](AUDIT_V1.md), which asked whether each v1
game *taught* the metaphysics. This asks whether the v2 engine can **run** it, and
where it cannot, whether the idea survives in another form.

The brief for this audit allows letter powers to be adapted to fit a puzzle, so
long as the result still serves the Islamicate and Ottoman occult material. Taken
seriously, that means: **propose new derivations freely, but keep saying which
fact each rests on.** A power invented to make a level work, and labelled as such,
is honest. One invented and dressed as history is the only thing actually
forbidden.

## What v2 can and cannot do

| Has | Lacks |
|---|---|
| sparse 3-D grid of cells; material, value, glyph | continuous physics — mass, momentum, friction, toppling |
| bonds → bodies; a body moves and falls as one | any clock, turn counter or scheduler |
| world rules as **data** (gravity, bondsHold) | sprites or image regions in the renderer |
| 8 primitives **derived from observable facts** | camera / viewpoint (the view is fixed isometric) |
| 5 rulesets that grant, deny and weight them | irregular non-grid geometry, line of sight |
| 3 registers; gemination as repeat | falling-piece cadence |
| preview ≡ execute; reader (world → text, **in any direction**); ledger | orientation on a cell |
| agent that walks and shoves; BFS solver | |

Verified before writing: the engine has **no** scheduler, `iso.js` has **no**
sprite path, and `readWorld` **does** take a direction.

---

## Verdict table

`PORTS` runs on today's engine · `ADAPT` needs a named, small addition ·
`RETHINK` the mechanic dies but the idea survives in better form · `NO` cannot be
done in v2, and should not be forced

### The five built games

| Design | Verdict | Note |
|---|---|---|
| **Yūsuf Ascent** A — The Seven Doors | `ADAPT` | A conditional-passability predicate on the agent. The brief's §23 upgrade — seven doors demanding seven *operations* — makes it a v2 game rather than a port, and the ledger already tracks which you have demonstrated. |
| **Yūsuf Ascent** B — Station Point | `RETHINK` | The perspective mechanic needs a moving camera in continuous 3-D. **See below — the idea survives, and better.** |
| **Yūsuf Ascent** C — The Ladder | `NO` (not worth it) | A drag-sort study aid. The Scriptorium's letter frames already do this job. |
| **Visionary Gallery** | `NO` | An imagery and rights pipeline, not a puzzle logic. Its value — the rights gate, the hand-vs-machine measurement — is orthogonal to the engine and stays in v1. |
| **Abjad Tower** — the game | `ADAPT` | See its five modes and six operations below. |
| **The Impossible Architect** | `ADAPT` | Placement + connectivity + conditional doors, all of which v2 nearly has. The folio *art* does not port; the *logic* does, and it is the best-argued board in v1. |
| **The Letter Machine** | `ABSORBED` | v2 is its successor: the same idea, generalised. Two things v1 had that v2 lost — **the movable dot** and **Transpose** — are worth pulling forward. |

### Abjad Tower's five modes

| Mode | Verdict | Note |
|---|---|---|
| Demolition (هدم) | `ADAPT` | The *goal* ports; the physics chaos does not. This is what [`apps/unmaking/`](apps/unmaking/README.md) is deciding. |
| Raising (بناء) | `PORTS` | **Already done** — it is The Standing Word. |
| Extraction (استخراج) | `PORTS` | The best unbuilt port in the list. See below. |
| Weight of Brackets (كوابيل) | `ABSORBED` | "Carried on nothing" **is** the AXIS rule, which v2 derives from the letter's own body rather than from a painting. The mechanic already lives in The Standing Word; only the folio sprites are missing. |
| Temperament (مزاج) | `ADAPT` | And it is the one place v1 was **better**. See below. |

### Abjad Tower's six operations

| Operation | Verdict | What it needs |
|---|---|---|
| ضرب Strike | `PORTS` | Already exists as `throwStone` in `engine/unmaking.js`. |
| اسم Invoke the Name | `PORTS` | "Every instance of one letter, everywhere, at once" is a one-line iteration over cells. Strong fit and PORTAL-grounded; should be built. |
| حساب Reckoning | `PORTS` | Find bonded runs whose values sum to N. v2 has values, bodies and `body()`. The sharpest of the six and it wants nothing new. |
| نور و ظلمة Inversion | `PORTS` | v2 already carries `class` (nūrānī/ẓulmānī) and rulesets already read it. |
| طلسم Talisman | `ADAPT` | Its whole point is a **delay** — force arriving through the barzakh, not applied directly. v2 has no clock. Needs a turn scheduler. |
| خلع Doffing | `ADAPT` | "There and not there for three seconds" also needs a clock, plus a `passable` flag. Both are the same small addition. |

### The six Bihzād designs

| Design | Verdict | Note |
|---|---|---|
| 1 The Impossible Architect | `ADAPT` | as above |
| 2 Doors That Give | `ADAPT` | Two agents with **asymmetric movement rules** is the point, and v2's agent supports it. The folio-as-map does not port. |
| 3 Station Point | `RETHINK` | below |
| 4 Muqarnas | `PORTS` | "The only thing that lets two mismatched edges meet" **is BIND**. Without a falling-piece clock it becomes a placement puzzle, which loses the cadence and keeps the idea. |
| 5 Weight of Brackets | `ABSORBED` | as above |
| 6 Cartouche | `RETHINK` | below — and it becomes much better |

### The standing design docs

| Doc | Verdict | Note |
|---|---|---|
| `GAME_ROGUELIKE.md` — the Occult Quintet descent | `ADAPT` | Not a mechanic but a **shell**: five floors, five sciences, and a different mode or ruleset per floor. v2 supplies the puzzles; the roguelike supplies the run. Natural fit, no engine work. |
| `VISIONARY_ENVIRONMENTS.md` #1–7 | `NO` | Art and environment sourcing. Orthogonal to letter logic. |
| `VISIONARY_ENVIRONMENTS.md` #8 — the lettrist diagram | `ADAPT` | The brief's §10: a diagram as an **executable surface**. A diagram is a graph; letters go on nodes; the diagram runs. High value, and the least explored idea in the project. |
| `PUZZLE_GAME_IDEAS.md` mechanics A–J | mixed | A, C, E, H, J are in v2 already. B (the dot) and D (temperament) regressed. F, G, I are partly there. |

---

## The four things that genuinely cannot be ported

Not omissions. Each is a different *kind* of puzzle, and forcing it into letters
would produce exactly the generic mechanic with the serial numbers filed off that
this project exists to avoid.

1. **Perspective.** Station Point works because you move a camera through
   continuous space until scattered fragments line up. v2's view is fixed and its
   space is a lattice. This is a *perceptual* puzzle, not a linguistic one.
2. **Physical chaos.** v1's towers toppled, slid, and settled unpredictably;
   cannon-es gave them mass and friction. v2's gravity is a deterministic settle,
   which is what makes it solver-checkable and also what makes it undramatic. You
   cannot have both. Talisman and Doffing were built on the drama.
3. **The folio as a place.** Doors That Give, the Weight of Brackets' sprites and
   the whole Visionary Gallery treat a painting as a map. v2 draws cubes on a grid.
4. **Cadence.** Anything with pieces falling on a clock.

**None of these is worth adding to v2**, because each would cost the property that
makes v2 useful — determinism, and a rule set small enough to derive from facts.

---

## The three ideas that come across *better*

### Station Point → the reading direction

The v1 puzzle: find the one viewpoint from which the fragments compose. The v2
version: **find the direction from which the letters read as a word.** `readWorld`
already takes a `dir`, and a body is ordered by projection onto it — so the same
structure genuinely spells different things read different ways. Tested:

```
letters at (0,0) (1,1) (2,2), bonded

  dir [-1,0,0]  →  ملق
  dir [ 1,0,0]  →  قلم        ← the Pen
  dir [ 0,1,0]  →  قلم
```

That is a station point made of language rather than optics, it needs **no new
code**, and it lands the project's own principle harder than the original did: the
world is written, and *which way you read it* decides what it says. It also gives
mechanic **J**, the coincidence of opposites, a concrete form — one structure, two
true readings.

### Cartouche → the wall that holds because it reads

v1: a wall stands when its verse cartouche is rotated to lie along the wall's
plane. That needs orientation on a cell, which v2 lacks.

v2: **a wall stands if the letters in it read as a word along the wall's
direction.** Text is load-bearing *literally* — not a panel fitted to a plane, but
a course of masonry that holds because it is legible. The Standing Word already
makes a word one body; this adds the condition that the body must *read*. Nothing
new is needed but a goal type.

### Extraction → removal by isolation

v1 annihilated every instance of a named letter and asked whether the rest stood.
The annihilation was ungrounded — blocks simply vanished. v2 can do the same job
with **`isolate`**, which is grounded in the isolated form joining nothing on
either side: take every ن out of the word without bringing the word down. The
puzzle is identical, the mechanic is now derived from orthography, and the letter
you must remove being load-bearing is exactly what makes it hard.

---

## Where v1 was better, and v2 should take it back

**Temperament hid which scheme was operative.** You discovered the metaphysics by
building and watching. v2 *shows* you the ruleset in a panel and lets you switch
it — which is right for a workbench and wrong for a puzzle. The port is a mode
where the ruleset is **hidden and must be identified from behaviour**: build,
watch what holds, and name the metaphysics you are standing in. The ledger already
scores exactly this kind of claim, and the rulesets already disagree enough to be
told apart. This is the strongest single thing on the list.

**The movable dot.** Mechanic B, and the one place the project touched *form →
position → function* directly: move bāʾ's dot above and it raises instead of
lowering; take it away and the letter is inert. v2's letter data already carries
`dots` and `dot_position`; there is no move that changes them. Small addition,
high return, and bāʾ is the letter the tradition argues over hardest.

**Transpose.** Changing a thing's representation without creating anything — the
brief's stated killer mechanic. v1's Letter Machine had it against a hidden
scheme. v2 dropped it.

---

## What the engine would need, ranked by return

| # | Addition | Unlocks | Size |
|---|---|---|---|
| 1 | **Hidden-ruleset mode** — the metaphysics as the thing to identify | Temperament, and a genuine discovery loop across every mode | tiny; no engine change, only UI and a ledger claim |
| 2 | **Goal types: `reads-as`, `direction-of`** | Cartouche, Station Point, and mechanic J | small; the reader already does the work |
| 3 | **`passable(cell, world)` predicate** | The Seven Doors, Doors That Give, Doffing | small |
| 4 | **Named-letter operations** ("every ن") | Invoke the Name, Extraction, Inversion | small |
| 5 | **Run-finding by value sum** | Reckoning — the sharpest v1 operation | small |
| 6 | **Turn clock / scheduler** | Talisman, Doffing, anything with duration | medium; a real new concept, adopt deliberately |
| 7 | **Dot moves** | Mechanic B; bāʾ | small |
| 8 | **Transpose against a hidden scheme** | The brief's §14 | medium |
| 9 | **Sprite cells in the renderer** | any folio port at all | medium, and only worth it if the folio games are wanted in v2 |

Items 1–5 and 7 are all small, and between them recover most of v1.

## What I would build next, and why

1. **The hidden ruleset.** It costs almost nothing, it is the one place v1 beat v2,
   and it turns every existing mode into a discovery puzzle without new levels.
2. **Extraction, by isolation.** A whole v1 mode recovered, with a *better*
   grounding than it had, using code written last week for something else.
3. **Reckoning.** The sharpest operation in v1 and it wants nothing new.
4. **The reading-direction puzzle.** No new code, and it lands the overarching
   principle harder than anything currently shipped.

Deliberately not next: the scheduler (a real new concept — worth adopting once,
for Talisman and Doffing together, not piecemeal), and sprite support (only if the
Bihzād games are wanted in v2 rather than left frozen in v1, which is a question
for Ted rather than for the engine).

## Caveats on this audit

- **Nothing here has been playtested.** Verdicts are about whether the engine can
  express a mechanic, not whether the result would be any good.
- **"Better" means better-grounded or better-suited to v2**, not more fun.
- Two of the three "comes across better" claims (reading direction, cartouche) were
  checked against the running engine; the rest are reasoned from what the code
  does and could be wrong in detail.
