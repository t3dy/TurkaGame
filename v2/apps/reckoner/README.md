---
title: The Reckoner
description: Four ways of acting on a structure that already stands — two recovered from v1's Abjad Tower with better grounding than they had, one taking back the thing v1 did better than v2, and one rebuilding Yūsuf Ascent's perspective puzzle out of language.
---

# The Reckoner · الحاسب

v2 grew up building. These four are the other half.

## Run it

Serve the repo root and open [`index.html`](index.html). `?level=the-assay` loads
one directly. Handle: `window.__reckoner` — `.selfTest()` plays every level's
known answer through the real input path.

```bash
node v2/apps/reckoner/verify_levels.mjs --trace
```

## The four

### Extraction — *The Doomed Letter*

Take every instance of one letter out and see what survives. Recovered from v1,
where blocks simply **vanished** — a thing nothing in the sources does. Here each
is **isolated**: rewritten in the form that joins nothing on either side, which is
plain orthography, and then gravity decides.

That change produced a constraint nobody designed, and it is the whole puzzle:

> **A letter resting on the ground cannot be extracted at all.** Isolation detaches;
> it does not delete. Detach a letter that is sitting on the pier and it simply
> sits there, joined to nothing. To be removable, a letter must be **carried by the
> word**.

So Extraction is a *building* puzzle: put the doomed letter where the word carries
it and where it carries nothing. Of the six arrangements of the hand, **two win**.

An earlier version of this claimed the *order* of isolation mattered. It does not
— isolating every instance cuts the same bonds whichever way round you go, so the
final graph is identical. Where the letter *sits* is what matters, and that is the
better game anyway.

### Reckoning — *Name the Number*

Name a number; every run of adjoining letters whose values sum to it comes apart,
and gravity takes what was hanging on them. Runs of two or more only — the source
speaks of *composing words*, and a single letter would be trivial since every
block prints its own value.

`PORTAL`, `abjad-numerology`: *"By selecting or composing words whose abjad sum
equals a specific number … one creates a linguistic-mathematical object that
resonates with that principle."* That the matching run **comes apart** is ours.

The trap is a good one: **you must read the values off the standing blocks, not
off the alphabet.** A sun letter has already assimilated the one before it, so the
word in front of you does not sum to what its letters are worth. On this level 3 of
140 numbers win — 2% of the range, which is arithmetic rather than guessing.

### The Assay — *name the metaphysics*

**The thing v1 did better than v2, taken back.** Abjad Tower's Temperament mode
hid which scheme was operative and made you discover it by building; v2 put the
ruleset in a panel with a switcher, which is right for a workbench and wrong for a
puzzle.

Here you are in one of the five and are not told which. Five probes ask the world
questions whose answers differ by ruleset — does the word break at a rāʾ? is the
spoken register admitted at all? does a two-letter program do anything? — and you
read the refusals and name it.

`verify_levels.mjs` checks the thing that actually matters: **that the probes
distinguish all five.** They produce 5 distinct signatures across 5 rulesets, so
the puzzle is solvable by evidence rather than by guessing. If a sixth ruleset were
added and collided with an existing one, the check would fail the level rather than
ship a puzzle whose evidence cannot settle it.

Naming goes in the shared ledger — wrong names too, because being wrong about which
world you are in is worth knowing you were.

### The Station — *from which direction does it read?*

Yūsuf Ascent's Station Point scattered painted fragments through a volume and asked
you to find the one viewpoint from which they compose. That needs a camera moving
through continuous space, which this engine does not have and should not grow.

But a bonded body is **ordered by projection onto the reading direction**, so the
same structure genuinely spells different things read different ways:

```
ق at (0,0) · ل at (1,1) · م at (2,2), bonded

  right to left  →  ملق
  left to right  →  قلم      ← the Pen
  bottom to top  →  قلم
  top to bottom  →  ملق
```

The perspective puzzle rebuilt out of language, needing **no new code** — and it
lands the project's principle harder than the original did: the world is written,
and which way you read it decides what it says.

## Every level type is checked by the question its own type has to answer

| Type | The check |
|---|---|
| `extract` | solvable, **and** not solvable wherever you put the doomed letter |
| `reckon` | a winning number exists, and only a small share of the range wins |
| `assay` | the probes **distinguish** the hidden ruleset from all four others |
| `station` | at least one direction reads the target, and not all of them do |

The `reckon` check was wrong at first: it demanded *exactly one* winning number and
failed the level for having three. A cantilever can be cut in more than one place,
and several right answers is not a guessing game — what would be is if a large
share of the range won. That is what it measures now.

## Known gaps

- **One level per type.** Four mechanics demonstrated, no curve.
- **The Assay's ruleset is picked by a fixed seed**, so it is the same every time
  you load it. A real version deals a different one per run — see
  [`../../APPLICATIONS.md`](../../APPLICATIONS.md), where that is the roguelike's spine.
- **`invokeName` is implemented and tested but has no level.** It wants a mode
  where acting on every instance at once is a real choice against acting on one.
- **Extraction and Reckoning now play their falls out in time**, by replaying the
  engine's step-tagged moves — see The Standing Word's README for why that is a
  guarantee rather than an effect.
- **No person has played it.** Every claim is from `verify_levels.mjs` or
  `__reckoner.selfTest()`.
