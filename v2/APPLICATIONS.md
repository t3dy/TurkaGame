---
title: Where these mechanics go next
description: Five mechanics built or recovered in v2 — assay, extract, reckon, station, invoke — taken across every design in the project, including the ones that are still only documents. The strongest result is that the roguelike and the career sim both turn out to have been waiting for the same mechanic.
---

# Where these mechanics go next

Four things were built from the portability audit, plus one that came with them.
This is what happens when each is taken seriously across the whole project rather
than left in the app it was written for.

**The short version:** the Assay is the most portable idea the project has
produced, and it is the thing both `GAME_ROGUELIKE.md` and `CareerSim/` have been
missing. It is also, unusually, a mechanic whose historical grounding is not
decoration but the actual finding — the portal's `ottoman-asymmetry` entry says
*"same teacher, same science, opposite outcomes… the variable is the polity, not
the doctrine."* A game where you must work out **whose rules you are under**, and
where guessing wrong is what ruins you, is that sentence.

## The five

| | Mechanic | What it is | Grounding |
|---|---|---|---|
| **ASSAY** | name the metaphysics | You are in one of five rulesets and are not told which. Probe, read the refusals, name it. | The rulesets are PORTAL-grounded and genuinely disagree; the probes are ours |
| **EXTRACT** | take a letter out | Isolate every instance of one letter and see what still stands. A letter resting on the ground **cannot be extracted at all** — to be removable it must be carried by the word. | Isolated forms join nothing on either side. Plain orthography |
| **RECKON** | name a number | Every run of adjoining letters whose values sum to it comes apart. Runs of two or more only. | PORTAL `abjad-numerology`: composing words whose sum equals a chosen number |
| **STATION** | find the reading | The same bonded body spells different things read from different directions. | The ordering is projection onto the reading direction; the puzzle is ours |
| **INVOKE** | name a letter | Every instance of it, anywhere, answers at once. | PORTAL `ilm-al-huruf`: the letter and the divine name are the same thing |

## The matrix

`●` a natural fit, needing nothing new · `○` fits with a small adaptation ·
`—` not applicable

| Design | Assay | Extract | Reckon | Station | Invoke |
|---|---|---|---|---|---|
| The Scriptorium (v2) | ● | ○ | ● | ● | ● |
| The Pushing Floor (v2) | ● | ○ | — | — | ○ |
| The Standing Word (v2) | ● | ● | ● | ● | ○ |
| The Unmaking (v2) | ● | ● | ● | — | ○ |
| Impossible Architect | ● | ● | ○ | ○ | ● |
| Cartouche (unbuilt) | ○ | — | — | ● | — |
| Muqarnas (unbuilt) | ○ | ○ | — | — | ○ |
| Doors That Give (unbuilt) | ● | — | — | ○ | ○ |
| **The roguelike** | ● | ● | ● | ● | ● |
| **CareerSim** | ● | ● | ○ | ○ | ○ |
| GoldenDawnBlocks | ● | ○ | ● | ○ | ○ |
| Visionary Gallery | — | — | — | — | — |

---

## The three that matter

### 1. The roguelike finally has a spine

`docs/GAME_ROGUELIKE.md` has sat as a design note since the project began: a
descent through the Occult Quintet — kīmiyā, līmiyā, hīmiyā, sīmiyā, rīmiyā —
with no answer to the question every roguelike has to answer, which is **what
varies between runs**. Random stats are the usual answer and would be the wrong
one here.

The Assay is the right one. **Each floor is a different metaphysics, unnamed.**
You arrive, your letters behave slightly differently than they did upstairs, and
you must work out what world you are in before you commit to a structure. The
variation is *historical disagreement*, procedurally dealt.

What that gives, concretely:

- **Run variance without randomness.** Five rulesets, dealt in different orders,
  is a different run every time and every difference is a real doctrinal one.
- **A reason to explore.** Probes cost something; you can descend on a guess.
- **Death that teaches.** A structure built under the wrong assumption falls in a
  way that tells you which assumption was wrong — the ledger already records that.
- **Extract as an inquisition floor.** A letter is forbidden; take it out of what
  you have built and keep standing. Ibn Turka was tried three times.
- **Reckon as the divinatory floor**, which is where jafr belongs.

None of this needs new engine work. The floors are modes that exist.

### 2. CareerSim gets the mechanic its subject already was

`CareerSim/` is a career sim about a scholar moving between courts. The Assay is
not a mechanic bolted onto that — it *is* that:

> **Same teacher, same science, opposite outcomes.** Bisṭāmī's jafr manual became
> Ottoman state equipment; Ibn Turka was tried three times and died waiting on a
> case review. The variable is the polity, not the doctrine.
> — portal entry `ottoman-asymmetry`

So: each court runs a different operative metaphysics, and it is **not written
down anywhere**. You infer it from what your patrons approve, what gets refused,
what a rival gets away with. Misreading which world you are in is precisely how a
career ends — and the game does not have to invent a penalty for it, because
being wrong about the ruleset already makes your work fail.

**Extract is the inquisition.** A doctrine is banned; remove it from your
published corpus without the argument collapsing. That is the same puzzle as
taking a letter out of a word and keeping the word standing, and it is
recognisably what happened to the *Mafāḥiṣ*.

### 3. GoldenDawnBlocks can assay too, and its evidence is already sitting there

The Hebrew build's rulesets differ by **attribution** rather than motive, and the
disagreement is already recorded in Ted's own data: `crowleydb`'s
`thelemic_tree.json` carries an `is_swapped` flag, set on exactly two paths —
15 (Heh) and 28 (Tzaddi) — for Crowley's *"Tzaddi is not the Star."*

That is a two-bit assay with a real answer. Probe those two paths and you know
whether you are in the Golden Dawn's attributions or Thelema's. The probes write
themselves, and the check that they *distinguish* the rulesets is the same one
`apps/reckoner/verify_levels.mjs` already runs.

---

## What each one does for the smaller designs

**Cartouche** (`GAME_DESIGNS_BIHZAD.md` #6) is now buildable and needs no new
code: a wall stands if the letters in it read as a word along the wall's
direction. That is STATION with a structural consequence attached — text
load-bearing *literally*, which is what the design always claimed and could not
previously do.

**The Impossible Architect's seven doors** (the brief's §23) wanted each door to
demand a different *operation* rather than seven instances of the same check.
Three of the seven now exist: Count is **Reckon**, Divide is **Extract**, Witness
is the ledger. Correspond, Permute, Combine and Transform remain.

**Muqarnas** can host an Assay variant cheaply: the joining rule is BIND, and
whether BIND is granted is exactly the kind of thing a ruleset varies.

**Doors That Give** gains something unexpected. Its whole point is asymmetry —
Zulaykha bound by the apparent geometry, Yūsuf by the real one. Under the Assay
that becomes: *the two of them are in different metaphysics*, and the chase is
legible only once you work out which. That is a better version of the design than
the original.

---

## What this does not fix

- **The Visionary Gallery is untouched**, and should be. It is an imagery and
  rights pipeline; none of these mechanics apply and forcing one would spoil it.
- **Perspective, physical chaos, the folio as a place, and cadence** remain
  unportable, for the reasons in
  [`AUDIT_V1_PORTABILITY.md`](AUDIT_V1_PORTABILITY.md).
- **The scheduler is still not built**, so Talisman and Doffing still have no
  home. Adopt it once, for both, or not at all.
- **Glyph artwork is still the largest unstarted piece** and still blocks the
  Golden Dawn build from being more than data.

## Honest limits on all of the above

- **Nothing here is playtested**, including the four mechanics themselves. They are
  solver-checked and replayed through the real input path; that is all.
- **The roguelike and CareerSim proposals are designs, not builds.** They are
  cheap *because the modes exist*, not because the games do.
- **"Fits" in the matrix means the engine can express it**, not that it would be
  worth playing.
- The Assay's probes distinguish all five rulesets **as currently written**. Add a
  sixth ruleset and that has to be re-checked — which is why the check exists and
  runs on every level.
