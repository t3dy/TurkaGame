---
title: Auditing v1 against the v2 vision
description: Each of the five frozen games measured against the nine questions the v2 brief asks, with what v2 should take from it and what it should not.
---

# Auditing v1 against the v2 vision

The brief asks that the existing games not be treated as sacred, and gives nine questions
to put to each. Here they are put. The verdicts are about **design**, not quality — several
of these are the best things in the project and still fail the specific test of whether
letters function as a language.

The nine, abbreviated in the table: **teaches** the metaphysics · **language** exploits
letter-as-instruction · **why** the player understands why a letter has its effect ·
**feedback** enough of it · **preview** adequate consequence preview · **elegant** could the
mechanic be expressed more simply · **historical** the layer is load-bearing not decorative ·
**discovery** can generate real discoveries · **distinct** contributes something no other
game does.

| | Yūsuf Ascent | Visionary Gallery | Abjad Tower | Impossible Architect | Letter Machine |
|---|---|---|---|---|---|
| teaches | partly | no | yes | yes | **yes** |
| language | no | no | partly | no | **yes** |
| why | yes | n/a | partly | **yes** | **yes** |
| feedback | yes | yes | **yes** (after the ghost) | weak | weak |
| preview | n/a | n/a | **yes** | none | none |
| elegant | yes | yes | partly | **yes** | **yes** |
| historical | **yes** | partly | **yes** | **yes** | **yes** |
| discovery | no | **yes** (it measured its own claims) | **yes** (the notebook) | no | partly |
| distinct | **yes** | **yes** | **yes** | **yes** | **yes** |

## What each one actually gets right, and what v2 took

**Yūsuf Ascent** — the strongest *historiography* in the project and the weakest *system*.
Its lasting contribution is the house rule that interpretation is labelled **where the
player is judging**, not in an About page, together with the negative result that no source
in the corpus mentions Bihzād or Zulaykha at all. v2 took that rule wholesale: every ruleset
carries an `interpretation_note`, and a test fails if one is missing.

**Visionary Gallery** — did the thing almost nothing else in this workspace has done: it
**measured its own claims and published the ones that came out against it** (ρ = 0.86 for
ranking, 27% for finding). v2 took the habit rather than the code — `build_letters.py
--verify` asserts that the four alphabet divisions are genuinely independent, which is the
kind of claim that would otherwise just be asserted in prose.

**Abjad Tower** — the one game whose *mechanic* is the correspondence: mass **is** abjad
value. Everything good in v2's numeric layer descends from it, including the honesty about
the log compression. Its Temperament mode was the first attempt at "historical disagreement
as a mechanic", and v2 is that idea taken seriously: rival *schemes* became rival
**rulesets**, and instead of differing over one hidden table they differ over what an
operation *is*. The placement ghost became the general preview system.

**The Impossible Architect** — the best-argued board here: every rule traces to a card in
`palace.json`, and the fix that made it work was found by a solver rather than by eye. But
it is not a language. Its seven doors are seven instances of the same check ("is the lock's
answer standing?"), which the brief itself flags (§23) as a missed opportunity.

**The Letter Machine** — the closest v1 came, and v2 is its direct successor. It already had
letters as verbs and the operation derived from the glyph's form rather than assigned. Two
things it could not do: the operation set was fixed (one metaphysics, not several), and the
run was instantaneous and unwatchable.

## The four faults v2 was built to fix

1. **One metaphysics.** v1 had a single table of what letters do. Historical disagreement
   was, at best, a hidden variable inside one mode. v2 makes the tradition itself the thing
   you switch, and makes the traditions *disagree about the instruction set*.
2. **The letters could not build.** In v1 letters moved numbers on a grid or fell as
   blocks; they never constructed anything that persisted and could be reasoned about. v2's
   written register makes the program and the building the same object.
3. **The preview was one game's feature.** The ghost block was Abjad Tower's. v2 makes it
   an engine guarantee — preview *is* execution — and a renderer any app can call.
4. **The historical layer was mostly captions.** Real, well-sourced, and rarely
   load-bearing. In v2 refusing SEVER is a doctrine (*the chain of being is not cut*) that
   determines whether your building stands up.

## What v2 has not yet earned

- **The Impossible Architect's seven doors as seven operations** (brief §23: count,
  divide, combine, transform between registers, correspond, permute, witness). v1 is frozen
  so this cannot be retrofitted there — it should become a v2 app that reads the same
  `palace.json`. Cheapest high-value thing on this list.
- **The diagram as an executable surface** (brief §10). CrowleyDB's `TreeOfLife.tsx` already
  separates the graph from its geometry (`treeLayouts.ts`) and drives a study/quiz loop over
  it; the missing step is making placement on the diagram *run* something. And the brief is
  right that this need not be a Tree of Life — Arabic lettrism suggests its own surfaces: the
  4×7 grid of the 28 letters against the lunar mansions, and the *wafq* magic square, where
  position already carries numerical meaning.
- **The notebook as a metaphysical debugger.** v1's tajriba notebook scored claims across
  two games; v2 needs its own, with prediction recorded *before* execution — which the
  preview now makes possible and v1 never did.
- **Watching the machine work.** Every v1 run resolved instantly. An animated, steppable
  execution is the single largest usability gap inherited into v2.
- **Graphics.** No glyph artwork exists anywhere in the workspace yet — the alchemy
  projects' `GLYPH_DESIGNS.md` files are prose. The agreed approach is public-domain scans
  through the existing rights-gated Commons pipeline for grounds and creatures, with the
  glyphs themselves drawn procedurally so they scale and tint. Unbuilt.
