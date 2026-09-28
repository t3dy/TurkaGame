---
title: The Tribunal
description: Three inquisitions, and you are Ibn Turka. Each court demands a demonstration you have not been given the letters for; you break a letter open to release what its name conceals, or you refuse to answer, which is what he actually did.
---

# The Tribunal · المحاكمة

The first mode in which **you are a particular person**. Ted's call, 2026-09-07:
the player's identity belongs to the *mode*, not to the project, so that the
other games stay free to be about the letters rather than about a man. Here you
are Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī, chief judge of Isfahan, and you are on
trial three times.

## Run it

Serve the repo root and open [`index.html`](index.html). Handle:
`window.__tribunal`; `__tribunal.selfTest()` plays a winning run through the real
input path and `__tribunal.refuseEverything()` plays the historical gesture.

```bash
node v2/apps/tribunal/verify_trials.mjs --trace
node v2/tests/taksir.test.mjs
node v2/tests/voice.test.mjs
```

## Controls

Press **How to play** (or `?`) for the full instructions. In short: click a
letter to select it and add it to your answer; **Break** releases what that
letter's name conceals; **Answer** inscribes; **Refuse** declines. The **Voice**
menu in the topbar changes the register everything is written in.

## The new mechanic: taksīr

Taksīr (التكسير) is the one operation in this engine that **creates letters**.
Everything else moves, joins, breaks or values what is already written.
Melvin-Koushki describes it in *Prologue to Pythagorean Renaissance*, n. 35 — and
what he describes is an algorithm, which is why it is code and not a design note:

> taksīr "involves the *muqaṭṭaʿāt*- and Moonsplitting-inspired separation of the
> letters of a name or word and the writing out of the letternames in full, then
> the elimination of repeated letters, the term *zubur* refers to the first
> letters in the full letternames (e.g., the A in ALF) and *bayyināt* to the
> remaining letters (LF in ALF) — so by definition the occult code behind every
> manifest word, and therefore the world itself."

He also notes it is **cognate to Hebrew *temurah***.

So: the name of alif is written **الف**, its first letter is the alif itself
(*zubur*, the manifest word) and everything after it — **ل** and **ف** — is its
*bayyināt*, the letters hidden inside it. Break an alif and a lām falls out.

**The bound is what makes it a puzzle.** Across all twenty-eight names the
bayyināt draw on only **eight** distinct letters — ا د ف ل م ن و ي. Twenty letters
can never be obtained by breaking anything, including four of the six that sever.
`build_letters.py --verify` prints that count; `tests/taksir.test.mjs` pins it.

The letternames themselves live in `data/build_letters.py`, with two choices
stated rather than buried: the final hamza is dropped from the sixteen names that
carry one, because hamza is not one of the twenty-eight and taksīr operates on
the twenty-eight (this matches Melvin-Koushki's own ALF); and spellings vary in
the tradition, so a ruleset wanting another convention must say so and cite it.
`--verify` checks the structural fact that makes a typo detectable at all: **every
lettername begins with its own letter**, and uses only letters of the alphabet.

## The three trials, and why each court decides its own verdict

Every court is **named openly** — this is not the Descent, and the question is
not whose rules apply but what you will say under them.

| Trial | Court | Demand | Why the court decides it |
|---|---|---|---|
| The Rival's Court | intellectual | the letters **الم** must be read **standing apart** | only a court that permits severing can see a word come to pieces |
| The Court of the Manual | ottoman-operative | **قلم** whole, and nothing shorter than three letters is heard | that tradition's doctrine is that a partial procedure does nothing at all |
| The Court of Light | sufi | **نور** must stand **whole** | نور carries a wāw, which joins nothing after it, so the word falls apart everywhere except a court that refuses to sever |

The first and third are exact mirrors: one demand is impossible **with** severing,
the other impossible **without** it. The gate checks that, and it is how a court's
doctrine comes to decide a verdict rather than decorate one.

The middle trial is the only one that needs two breaks: qāf conceals an alif, and
that alif conceals the lām.

## Refusal

You may always decline. The charge stands **unproven** — you are neither convicted
nor cleared — your record stays clean, and it costs one standing.

This is not a worse kind of losing, and the reason is historical, with a caveat.
Melvin-Koushki's *Prologue* remarks that Ibn Turka "would refuse to bend the knee during his three
inquisitions, despite the danger and punishing consequences" — **an uncited remark, to be read as his
remark and not a finding**: the dissertation shows *defensive apologies* to Shāhrukh (1426) and Bāysunghur
(c. 1429–32), written under duress. The design rests on the weaker and safer point that a game in which
refusal is merely defeat would misrepresent a man his own biographer presents as unbending. Refusing all three ends the run in exile with **zero convictions**, which
is a different ending from losing all three, and the game says which is which.

## The record

Every break is written into the record as a claim: *this letter conceals that one*.
The third court reads it back to you. That is the "corrupted notebook" failure Ted
picked alongside denunciation — being wrong, or being consistent, follows you.

## What is attested and what is ours

**Attested** (`docs/BIOGRAPHY.md`, from Melvin-Koushki): he was a judge known for
defending the weak against the powerful; "three trials" (his phrase) engineered by jealous rival
colleagues; he **won the first two and lost the third**, the third being the purge of **1427** after the Ḥurūfī
attempt on Shāhrukh; exile; death in Herat in **1432**, impoverished and in legal limbo; his friend **Qāsim-i
Anvār expelled from Herat in the same purge** over the same suspected Ḥurūfī associations. The *Prologue*'s
"refuse to bend the knee" is an uncited remark, and the apologies are duress documents.

**Ours, and labelled GAME FICTION on every trial's own face**: the *content* of
the charges, the courts' identities, the demands, and every word anyone says. The
sources record that the trials happened and how they came out — not what was
argued. The years of the first two trials are no longer an open gap (Melvin-Koushki's
timeline and text give c. 1422 and 1426; he never lists "the three" together, so the mapping is this project's reading),
but the three courts here are **game fiction with no year**, and no year is given for them.

## How a trial is allowed to ship

`verify_trials.mjs` asks four questions, and the second and third are the ones
that bite:

- **ANSWERABLE** — the demanded word can be produced in *this* court from *this*
  hand by breaking. A charge nobody can answer is not a trial, it is a sentence.
- **EARNED** — it cannot be answered *without* breaking. If the opening hand
  already spells the word, the taksīr is decoration.
- **COURT-BOUND** — the court's own rules change the outcome: either the verdict
  differs between courts, or a rule of this one (the operative court's minimum
  length) actually refuses a short answer. **Two of the three trials failed this on
  the first pass** — both demanded words made only of connecting letters, which
  stand in every court alike — and redesigning around it produced the mirror pair
  above, which is a better mode than the one I first wrote.
- **VOICED** — every passage carries all four voices, and no voice drops a
  citation the austere one has (`apps/shared/voice.js` `voiceLint`).

## Known gaps

- **Three trials, fixed courts.** No deal, no seed. The variation is in what you
  choose, not in what you face; the Descent is where dealt metaphysics lives.
- **The record is shown, not yet used against you mechanically.** The third court
  cites it in prose and the ending counts it, but no charge is *generated* from it.
  That is the next step and it is a real one.
- **No patronage layer.** Standing is a single number. Denunciation as a social
  system — patrons withdrawing, a network reacting — is `CareerSim/`'s territory
  and the two should eventually meet.
- **No person has played it.** Both paths are self-tested through the real input
  path; the winning run takes four breaks and ends with standing intact.

## Corrections (2026-09-27)

Per Ted's standing rule (source: `TurkaVita/docs/CORRECTIONS_BRIEF.md`, rows 5, 8, 11, 12):

- "Exact years of the first two inquisitions are an open research gap": closed as above (c. 1422, 1426; 1427 for the third),
  marked as our reading. The game's courts still carry no year, by design.
- "Five years of wandering exile" and "datable to about 1427" replaced by the dated purge and the source's own wording.
- The refusal quotation is the *Prologue*'s uncited remark (row 11); the design point that refusal is not a worse loss is unchanged.
- "Companion Qāsim-i Anvār exiled the same year": expelled from Herat in the same purge (a friend and correspondent; "Cairo companion" is a hagiographic
  tradition in Melvin-Koushki's note, kept hedged).
- The game itself (`app.js`, trial data) was not touched.
