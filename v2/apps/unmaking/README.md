---
title: The Unmaking
description: Three candidate answers to "how do you bring a structure down?", implemented side by side on the same structures so the design question can be settled by playing instead of argued about.
---

# The Unmaking · النقض

v2 could build and could not unbuild. Rather than invent a primitive to close that
gap — the one thing this project does not do — here are **three candidates on the
same structures**, deliberately unequal in how well grounded they are, each saying
so at the point of use.

**This app wants a judgement, not just attention.** Pick one, or say none of them.

## Run it

Serve the repo root and open [`index.html`](index.html). Click a letter to aim,
choose a route, press **Do it** — or press **Try all three** to run every route
against a fresh copy of the same structure. Handle: `window.__unmaking`
(`.matrix()` runs everything against everything).

## The three routes

| | Route | Grounding | The fact | What is ours |
|---|---|---|---|---|
| **A** | The Isolated Form · الشكل المنفصل | `INTERPRETATION` | Every Arabic letter has isolated, initial, medial and final forms, and the **isolated form joins nothing on either side**. Plain orthography, checkable in any grammar. | That rewriting a *standing* letter into its isolated form cuts both its bonds. Tight, as interpretations go — it is close to what isolation already means. |
| **B** | The Utterance · اللفظ | `GAME_FICTION` | The three registers — mental, spoken, written — are the *Mafāḥiṣ*'s own structure. | Everything else. That a letter **spoken** over a structure suspends one of the world's laws (`bondsHold`) for the length of the utterance is entirely invented, and is labelled wherever it appears. |
| **C** | The Thrown Stone · الحجر | `PLAIN` | None. No correspondence, no intention — mass and speed. | Nothing to own. This is the **control**, and it exists for the reason Abjad Tower's Strike did in v1: an operation with a claim behind it has to earn its place against one without. |

## What happened when they were measured

Three structures, every route, `__unmaking.matrix()` and the in-app comparison.
Each route is scored at its **best possible aim**, because comparing a targeted
route aimed at its worst cell against two that cannot be aimed at all flattered
the hammer and libelled the scalpel:

| Structure | A · isolated form | B · utterance | C · thrown stone |
|---|---|---|---|
| **The Span** — four letters reaching from one pier | 3 of 4 | 3 of 4 | **4 of 4** |
| **The Pinned Span** — the same, with an alif in it | **3 of 4** | 3 of 4 | **0 of 4** |
| **The Tower** — a column with a shelf off its top | 3 of 4 | 3 of 4 | **4 of 4** |

**The honest result: on an unpinned structure the route with no claim behind it
wins.** Simply shoving the thing is the most effective demolition available, and
neither the sourced route nor the invented one beats it. That is exactly what a
control case is for, and it would have been easy not to notice — the first version
of the comparison aimed route A at its *worst* target and did not report best-aim
at all.

**The one thing that stops the stone is an alif.** On the pinned span it drops
nothing: an axis holds a frame, and mass and speed do not move an axis. So the
system already has a shape — **brute force is the strongest attack, and the
builder's counter to it is the letter that holds.** That was not designed; it fell
out of primitives defined several slices earlier.

**A and B differ in kind, not degree.** Both reach 3, but A only reaches it *when
aimed well* — cutting further inboard brings more down (3, 2, 1, 1 across the
span), while B is 3 everywhere and cannot be aimed. A scalpel and a hammer that
happen to score alike on these three structures. If the deciding question is
"which makes a better puzzle", that difference matters more than the totals.

## Where each one leads, if chosen

- **A** gives demolition levels immediately, and they would be *aiming* puzzles:
  the interesting question becomes which letter of a word is load-bearing. It needs
  no new grounding, because isolated forms are already a fact about the alphabet.
- **B** opens the brief's Level 5 — letters that manipulate *rules* rather than
  blocks — which is a much larger door than demolition alone. The cost is that it
  is admitted fiction inside a project whose whole discipline is not inventing
  history. It would need to stay clearly marked forever.
- **C** costs nothing and is honest, but it is not lettrism. Keeping it as the
  control is worthwhile regardless of which of A or B is adopted, precisely because
  it currently *wins*.

## Known gaps

- **No demolition level exists yet**, because no route is chosen. This app is the
  comparison, not a game.
- **Three structures is a small sample**, all of them cantilevers or near it. A
  structure whose failure mode is different (a real tower, an arch) might rank the
  routes differently.
- **"Dropped" is a crude score.** It counts cells that ended below a line. It says
  nothing about whether a route is interesting to use, which is the actual question.
- **No person has played it.** Every number above is from `matrix()` or the in-app
  comparison, both of which run each route on fresh clones.
