---
title: Introduction to Lettrism Reality Building with Blocks
description: The front door — a sixteen-lesson course that teaches the history of the two letter-traditions with their diagrams reconstructed from the texts, then hands the player a sage who walks and writes the letters into a world, one power per lesson, ending with a golem built and unmade.
---

# Introduction to Lettrism Reality Building with Blocks · مدخل

Ted asked for "an Introduction to Lettrism Reality Building with Blocks game
mode where the player is walked through a historical lesson about lettrism,
sees examples from period illustrations going back to the diagrams of the
Sefer Yetsirah and medieval and early modern kabbalistic and Islamicate sources
of lettrism traditions, and is given a tutorial on how to use each of the
Hebrew and Arabic letters to build a world… where the player controls a sage
who uses these letters and their powers to create a world or a golem." This is
that, as far as it can honestly go today, with the parts it cannot yet do named.

## Run it

Serve the repo root and open [`index.html`](index.html), optionally with
`?lesson=<id>` to start at a lesson. Handle: `window.__intro`;
`__intro.selfTest()` plays every lesson's solution through the real input path.

```bash
node v2/tests/introduction.test.mjs     # every lesson's solution finishes its task
python v2/data/build_hebrew.py --verify # the Hebrew table matches its source
```

## Controls

Press **How to play** in the topbar (or `?`) for the full instructions. In short:
the sage is the red outline; walk with the arrow keys or WASD; click a letter in
the palette, then a cell beside the sage to write it (the corner box says whether
you can, and what the letter would do); "Let gravity in" on the floors that start
with gravity off; "Erase the alef" in the golem lesson; "Start this lesson over"
at any time. The camera turns with Q/E, zooms with +/− or the wheel, pans with
right-drag, resets with R. The box at the bottom right always shows what the
world **reads**.

## The sixteen lessons

| # | Lesson | What it teaches | Diagram | Task |
|---|---|---|---|---|
| 1 | The alphabet is the material | the claim, from the SY and *ʿilm al-ḥurūf*, with sources | abjad ladder | walk to a mark |
| 2 | Letters are numbers | abjad / gematria; Ibn Turka's worked equations | abjad ladder | write three letters |
| 3 | The Sefer Yetsirah divides the twenty-two | mothers, doubles, simples; elements, aspects, faculties, planets, signs | 3/7/12 wheel | write א מ ש |
| 4 | Combination: the 231 gates | SY §18; a word is one body; reading back | 231-gate wheel | make the world read אב |
| 5 | Twenty-eight | the Ikhwān's 28; al-Būnī's mansions; dots as omens | mansions ring | write ح and ب |
| 6 | Seven hot, seven cold… | the Sharāsīm's natures; Jābirian balance; a proposal | 4×7 table | write ا and ج |
| 7 | AXIS | the alif stands on nothing and carries what is joined | — | build in the air, let gravity in |
| 8 | BIND | a closed loop makes two stones one body | — | bind two stones |
| 9 | POUR | a tail lets matter fall through | — | pour a block to the ground |
| 10 | RAISE and LOWER | dots move a block's value up the ladder | — | raise a block 1 → 3 |
| 11 | SEVER | the six that never join; the word breaks | — | two separate bodies |
| 12 | Whose rules run | the four lettrisms by motive; the Sufi refuses to cut | — | the same two letters join |
| 13 | Sun and moon | ASSIMILATE / DISTINGUISH; four independent divisions | — | read |
| 14 | The final form seals | Hebrew bricks; finals as SEVER (ours, stated) | — | שלם sealed against ט |
| 15 | The golem | Idel's two steps via Segol; אמת → מת as legend, labelled | — | write the word, erase the alef |
| 16 | Where to go from here | the prototypes; what is not here yet | — | — |

Every lesson's text names its sources where the player is reading, using the
project's honesty labels; the full reference is
[`../../POWERSOFTHELETTERS.md`](../../POWERSOFTHELETTERS.md).

## What is proved

- **Every lesson can be finished.** Each carries a scripted solution;
  `tests/introduction.test.mjs` runs it through `src/lesson_rules.js` — the same
  module the page uses for reach, writing, gravity, erasure and task checks — and
  asserts the task is done. The browser `selfTest` walks all sixteen through the
  real input path.
- **The lessons say true things about the engine.** The test also checks the
  contrasts the text promises: a dāl on the AXIS floor falls where an alif stood;
  the same two letters break under the workshop and join under the Sufi.
- **The Hebrew table matches its source** (`build_hebrew.py --verify`): 22
  letters, 3/7/12, values as in GoldenDawnBlocks' table, finals SEVER, the rest
  join.

## What is deliberately not here

- **The period images.** The manuscript wheels and tables Segol studies,
  al-Būnī's diagrams, Ibn Turka's autograph pages: each needs a provenance
  record and a rights check, and fetching is a download that waits for Ted.
  [`FETCHLIST.md`](FETCHLIST.md) lists the candidates and the pipeline. Until
  then the diagrams are **reconstructions drawn live from the texts**
  (`src/diagrams.js`), captioned as such where the player sees them.
- **Powers for the Hebrew letters as blocks.** Nothing in the held sources
  derives them from form the way the Arabic primitives are derived. The table
  carries the SY's division as evidence and adds only that final forms SEVER,
  stated as ours; GoldenDawnBlocks' ELEMENT / INVERT / COMBINE / SEAL are the
  design for the rest, not yet in the engine.
- **Multi-letter writes.** The sage writes one letter at a time, so the
  ASSIMILATE / DISTINGUISH lesson is read-only and points at the Scriptorium.
- **A golem that walks.** It reads, and it stops reading. Animation is the
  Descent's kind of promise, not this course's.

## Faults the checks caught

- The RAISE lesson first used nūn, which also pours; the block was raised and
  then poured to y = −1, below the floor. The lesson now uses tāʾ. The engine's
  POUR is ground-agnostic on purpose (a test models a world below the floor);
  whether the ground should stop it is an open engine decision, logged.
- `extract()` detaches rather than deletes, so the erased alef floated beside
  the brow and still read. `erase()` now removes it, and the lesson says so.
