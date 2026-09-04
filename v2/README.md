---
title: TurkaGame v2 — lettrism as the programming language of the world
description: A data-driven engine in which Arabic letters are instructions, historical traditions are swappable rulesets that genuinely disagree, and the preview of a program is the program's own execution run against a copy.
---

# v2 — Lettrism as a programming language

**v1 is frozen.** The five games under [`games/`](../games/) are closed to change and
stay at their current URLs; see [`games/FROZEN.md`](../games/FROZEN.md). Everything here
is new work, and it does not import v1 code.

## The overarching design principle

> **The player should gradually discover that the Arabic alphabet is not merely the subject
> of the game. It is the language in which the game world is written.**

Everything below is answerable to that sentence, and it has two halves that pull in
different directions. *The world is written in letters* is a claim about the engine. *The
player should gradually discover it* is a claim about the interface, and the first build of
v2 failed it outright — it listed all eight operations in a panel and badged every letter,
which is an IDE with the manual open. Both halves are now built; see **Discovery** and
**Reading the world** below.

> *Not that lettrism deserves a place among the sciences, but that it supersedes philosophy
> on philosophy's own ground, because only the letter is the* coincidentia oppositorum.
> — portal entry `lettrism-universal`, on Ibn Turka's own claim

v1 asked what a letter *is*. v2 asks what a letter **does to a world**, and makes the
answer depend on whose metaphysics you are standing in.

## Run it

Serve the repo root (`.claude/launch.json` config `turkagame-site`, port 7521) and open
[`/v2/apps/scriptorium/index.html`](apps/scriptorium/index.html). No build step.

```bash
python v2/data/build_letters.py --verify && node v2/tests/engine.test.mjs
```

Debug handle: `window.__scriptorium` — `.write('مرم')`, `.setRuleset('sufi')`,
`.selfTest('the-chain')`, `.world`, `.checkTask(world)`.

## The four commitments

### 1. The instruction set is a consequence of the alphabet, not a table someone chose

Eight primitives, each granted by a fact anyone can check against a grammar or a page:

| Fact about the letter | Primitive | Letters |
|---|---|---|
| a single upright stroke | **AXIS** — hold a frame; anchor a column | 2 |
| dots above (n) | **RAISE** — lift n rungs of the abjad ladder | 12 |
| dots below (n) | **LOWER** — drop n rungs | 3 |
| a closed form | **BIND** — join what stands across the line into one body | 9 |
| a descending tail | **POUR** — let what is above pass down through | 17 |
| never joins what follows (ا د ذ ر ز و) | **SEVER** — the word breaks here | 6 |
| a sun letter (the article's lām becomes it) | **ASSIMILATE** — what precedes takes its value | 14 |
| a moon letter (the lām stays itself) | **DISTINGUISH** — what precedes keeps its own | 14 |

The census is not a design decision; it falls out of the alphabet, and
`build_letters.py --verify` asserts it. **Four divisions of the alphabet are in play and
they are independent** — abjad value, light/dark (the fourteen *muqaṭṭaʿāt*), sun/moon, and
connecting/non-connecting. Sun and light overlap on exactly 6 of 14, which is the check
that they are two facts rather than one told twice.

The best of these is the plainest. **A written word is one rigid body, and the six
non-connecting letters are where it breaks** — which is simply why an Arabic word looks
like several pieces on the page. Build a long structure and you must choose letters that
join; put a rāʾ in the middle and you have guaranteed a fracture.

### 2. Historical traditions are swappable physics engines, and they differ by *motive*

The portal's own finding (`three-lettrisms`): *"Three lettrisms, not one. Gnostic-messianic,
Sufi and intellectual… the difference is **motive** rather than method."* So the rulesets in
[`rulesets/rulesets.json`](rulesets/rulesets.json) are not five date ranges. Each answers
*why do letters work at all?* differently, and the answer is its signature mechanic:

| Ruleset | Why letters work | Mechanically |
|---|---|---|
| **Intellectual** `PORTAL` | number is the structure of the real, and a proportion can be demonstrated | strength = how many adjacent letters stand in small-integer ratio |
| **Sufi** `PORTAL` | they are the divine names; a name reaches as far as the sanctity behind it | strength rises with luminous letters; reach extends with register. **Refuses SEVER** — the chain of being is not cut |
| **Gnostic-messianic** `PORTAL` | the world is already written; to speak a letter is to proclaim it | full strength always, **written register only, and nothing can be undone** |
| **Ottoman operative** `PORTAL` | the procedure works, completely or not at all | full strength — but a program under three letters does *nothing whatever* |
| **The Workshop** `GAME_FICTION` | nothing. It makes no claim | everything granted, always full strength — the control case |

That last one exists for the same reason Abjad Tower's thrown stone did: the historical
rulesets need something with no claim behind it to be measured against.

**The payoff is checkable.** The word مرم is *two bodies* under intellectual lettrism and
*one body* under Sufi lettrism, because Sufi lettrism refuses to sever. Turn gravity on
over a single pier and two letters stand in the first world and three in the second. Same
program, same letters, different metaphysics, different building. That is a test
(`engine.test.mjs`), a task in the game (*The Chain of Being*), and the whole argument.

### 3. The execution model is the *Mafāḥiṣ*'s own, not one borrowed from computing

Ibn Turka builds his major work out of **three "Globes of Light" corresponding to the
Mental, Written and Spoken registers of the letter**, arranged as an ascent, a descent, and
an ascent again (`research/notes/02-prologue-to-pythagorean-renaissance.md`). The engine
uses that as its execution model:

```
mental    compose, and compute every consequence — the world is untouched   (compile)
spoken    run once; the utterance passes and the world returns to itself    (run)
written   run, and the letters REMAIN as the thing built                    (commit)
```

So *"a letter program compiles into world operations"* is not a modern metaphor laid over
the material. It is the material's own three-level structure used for what it says it is
for. **The mapping onto plan / run-once / persist is ours**, and the game says so.

A consequence worth stating plainly: in the written register **the program and the building
are the same object**. The letters you wrote are the blocks that are standing there.

The loop primitive comes from orthography too — **gemination**, a letter written twice, is
one letter doubled. We did not have to import "repeat".

### 4. The preview is the execution

`preview()` and `execute()` are one function. Preview runs it against a clone and discards
the clone; execute runs it against the world. There is no second code path estimating
consequences, so **the preview cannot promise something the execution will not do** — a
rule earned in v1, where a ghost block and a placement each solved for the aim point
separately and disagreed. `engine.test.mjs` asserts they agree cell-for-cell under all five
rulesets.

The effect list the engine returns *is* the display list. [`iso.js`](apps/scriptorium/src/iso.js)
renders it with four marks and no more:

- **outline** (gold) — a cell that will be occupied or changed
- **arrow** (gold) — something moves, from → to
- **tie** (lapis) — two cells become one body
- **break** (vermilion) — a bond cut or refused

A fifth mark would mean the model has grown a concept, and that is the moment to
reconsider the model rather than the legend.

### 5. Reading the world — the principle made mechanical

`vm.js` writes: a program becomes a structure. [`reader.js`](engine/reader.js) is the other
direction, and it is the direction that carries the principle. If a written word is a body
of letter-cells standing in the world — which is what the written register makes true — then
**any body of letter-cells can be read**, including the parts of the world the player did
not write.

The reader groups letter-cells by their bonds, orders each body along the writing direction
and reports what it finds. It never guesses: a structure that reads as nothing reads as
nothing, and a structure that is bonded but not in a line is reported as not being in a
line.

Two consequences worth stating:

- **The reading changes with the metaphysics.** The reader groups by bonds, and Sufi
  lettrism refuses to sever — so مرم reads as two words there and one word elsewhere. Who
  is reading determines what the world says, and that is not a metaphor here.
- **The world keeps its own history.** Read back a word you wrote and the glyphs are as you
  wrote them, but the *values* record what happened — a sun letter will have assimilated its
  neighbour, and the abjad total says so.

The task **The Pen** is the moment this is meant to land: two letters are already standing
when you arrive, you write the third into the gap, and the structure resolves into قلم — the
Pen, for which Sūra 68 is named, and which opens on the letter nūn.

### 6. Discovery — evidence is shown, the rule is earned

The split is the portal's own `tahqiq-taqlid`: what you have *read* is held on authority;
what you have *seen* is verified.

- **Evidence is always visible.** The dots and where they sit, whether the form closes,
  whether it has a tail, whether it joins forward, sun or moon, its abjad value. All of it is
  on the page in front of you, and hiding it would make the rule unguessable rather than
  derivable.
- **The rule is earned.** That dots-above means RAISE appears only after you have watched a
  dotted letter raise something. Until then the letter's frame says *an operation you have
  not yet witnessed — granted by dots above*, which tells you where to look without telling
  you the answer.

[`ledger.js`](engine/ledger.js) records only what the engine actually did — it is fed the
effect list, so you cannot learn an operation from a panel, only from the world. A fresh
player knows 0 of 8; playing the four tasks through teaches 4.

## Where things live

```
v2/
├── data/build_letters.py     generates letters.json; --verify checks the four divisions
├── data/letters.json         evidence only: form, grammar, number. No doctrine.
├── rulesets/rulesets.json    doctrine only: who claimed what, and on whose authority
├── engine/world.js           cells, bonds, materials, and the world's rules as data
├── engine/vm.js              compile → effects → preview | execute; describeLetter()
├── engine/reader.js          the other direction: read the world back as text
├── engine/ledger.js          what the player has actually witnessed
├── apps/scriptorium/         the IDE: palette → program → preview → inscribe
│   ├── src/iso.js            the consequence renderer (reusable by any v2 app)
│   └── tasks.json            four tasks, each self-tested through the real UI path
└── tests/engine.test.mjs     34 tests
```

## Provenance, and how it is shown

The v1 vocabulary carries over, with one addition. Every ruleset, source line and letter
frame in the interface is tagged:

`PORTAL` an entry in `portal/db/turka.db` · `CORPUS` a paper in `research/library/` with a
page · `REPORTED` something `PUZZLERIDEAS.txt` reports from a source **not held here** ·
`INTERPRETATION` ours · `GAME_FICTION` invented, and saying so.

Two rules are enforced rather than promised. Every ruleset must carry an
`interpretation_note` saying what in it is ours — a test fails otherwise. A ruleset
claiming `PORTAL` must cite sources; a ruleset marked `GAME_FICTION` must cite none.

**No historical correspondence has been invented to fill a field.** Where the sources this
repo holds do not say, the field is absent and the note says why.

## Gravity is a rule, not a setting

`world.rules.gravity` is off by default: this is a Lego table, not a physics sandbox. It is
data, so a letter program can change it, which is the brief's Level 5 — letters
manipulating rules rather than blocks. Turning gravity on is a deliberate act inside the
fiction, and it is how *The Chain of Being* is judged: the task asks what **would** stand
if you turned it on, so the player can see the consequence before accepting it.

## Known gaps — this is a first slice

- **No person has played it.** Every claim above is from `engine.test.mjs`, from
  `--verify`, or from `selfTest()` run in the browser. Nothing is claimed to be fun.
- **Three tasks is a demonstration, not a game.** No progression, no generator.
- **The ledger is not yet a debugger.** It records what was witnessed and what was read,
  which is the discovery half. The brief's full loop — a stated hypothesis and a *prediction
  recorded before execution*, then scored — is not built. Preview-is-execution makes the
  interesting version of it cross-ruleset: "I predict this holds under Sufi and falls under
  intellectual" is a real bet; "I predict what the preview just showed me" is not.
- **No diagrammatic programming surface yet.** The brief's §10 — a cosmological diagram as
  an executable circuit — is designed for but unbuilt. See [`AUDIT_V1.md`](AUDIT_V1.md).
- **The world is isometric 2D**, not the 3D voxel builder the "Minecraft/Lego" fantasy
  wants. The engine is dimension-agnostic; only `iso.js` would be replaced.
- **Only 8 primitives.** The brief lists many more (attract, repel, heat, cool, modify
  time, modify probability). Each new one needs an observable fact to derive it from, and
  that is the constraint, not imagination.
- **The Golden Dawn ruleset is not here** — by decision it ships from its own project, so
  the engine has to prove it is vendorable. It has not yet been vendored anywhere.
- **`?v=` cache-busting must match across modules.** `vm.js` importing `./world.js` while
  the app imported `./world.js?v=1` loaded the module twice. Harmless here, fatal the
  moment anything uses `instanceof`.
