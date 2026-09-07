---
title: The Pipeline — orchestrating research agents, artifact agents, and coding agents
description: How a claim gets from a PDF nobody may commit, through a chain of durable artifacts, into a shipped mechanic that still knows where it came from — the roles, the handoff contracts each artifact must satisfy, the context budget per role, and the failure modes that have actually happened here.
---

# The Pipeline

**What this document is.** [`CONTEXTENGINEERINGGAMEPIPELINES.md`](CONTEXTENGINEERINGGAMEPIPELINES.md)
answers *which model, how much corpus, which coupling level*. This one answers the
question after that: **when several agents work in sequence, what does each one
hand the next, and what makes a handoff good enough that the receiving agent does
not have to go back to the source?**

The short version:

> **Research does not travel between agents. Artifacts do.**
> An agent that has read a book cannot pass what it knows to the next agent. It can
> only pass a file. So the file — not the reasoning — is the unit of work, and every
> role in this pipeline is defined by the artifact it is responsible for.

---

## 1. Why this shape

Three constraints force it, and they are not going away.

**Constraint 1: the sources cannot enter the repo.** Copyrighted PDFs are
gitignored and `tools/check_repo_rules.py` blocks the commit. So a coding agent
cannot read the scholarship even if it wanted to. Something must stand between
them, permanently.

**Constraint 2: context is the binding resource, not intelligence.** One corpus
file is 2.4 MB (~600K tokens). The claims a game needs out of it would fit on a
postcard. Any pipeline that re-reads sources at build time is paying six orders of
magnitude too much for the same postcard.

**Constraint 3: sessions end.** A summarised conversation loses what was in the
model's head. Everything that matters must be on disk before the context runs out
— which is why this project's own rules say *write findings down where they will
be found*, and why the grimoire exists.

The consequence: **each agent's real output is a file, and its quality is judged
by whether the next agent can work from that file alone.**

---

## 2. The five roles

Not five people and not necessarily five sessions — one session often plays
several. But the *artifacts* are always distinct, and confusing two roles in one
file is the most common way this pipeline rots.

```
  SOURCES                the PDFs. Gitignored. Never in a game's context.
     │
     │  READER            reads one chunk; extracts claims with citations
     ▼
  CLAIMS                 grimoire/themes/*.md · portal DB rows · research/notes/
     │
     │  DISTILLER        cross-reads claims; resolves disagreement; keeps labels
     ▼
  REFERENCE              LETTRISMRESEARCH.md · POWERSOFTHELETTERS.md · BIOGRAPHY.md
     │
     │  DESIGNER         turns an attested claim into a deterministic rule
     ▼
  SPEC                   DESIGN.md · rulesets.json · lessons.json · levels.json
     │
     │  BUILDER          implements the spec; never reads the sources
     ▼
  CODE                   engine/*.js · apps/*/src/*.js
     │
     │  VERIFIER         proves the code does what the spec claims
     ▼
  PROOF                  tests/*.test.mjs · verify_*.mjs · __app.selfTest()
```

### 2.1 READER — one chunk, one output, citations or nothing

**Input:** exactly one ~40K-character chunk (`tools/batch/make_tasks.py corpus`
makes 268 of them, with 2K overlap so a claim never straddles a boundary
invisibly). Never a whole file.

**Output:** claims, each with a page or folio, each with an honesty label
(SOURCE / CORPUS / REPORTED / INTERPRETATION / GAME FICTION / ⚠).

**The rule that matters most:** *record garbled OCR as it appears, at LOW
confidence; never repair it.* These are OCR'd scans where al-Būnī renders as
`al-Bu¯n¯ı` and *Laṭāʾif* as `La.ta¯ if`. A plausible repair of a transliterated
Arabic name is a fabrication that reads exactly like scholarship, and it will
survive every downstream check because nothing downstream can see the source.

**Model:** Haiku 4.5 for a fixed rubric across many chunks; Sonnet 5 when the
chunk needs judgement about what is even a claim. Opus 5 only for a source whose
argument, not whose facts, is the point.

### 2.2 DISTILLER — the role that gets skipped, and shouldn't

**Input:** many claims, usually about one topic, usually contradictory.

**Output:** a reference document a designer can act on. `LETTRISMRESEARCH.md` and
`v2/POWERSOFTHELETTERS.md` are the two big ones; `grimoire/themes/*.md` are the
small ones.

**What distilling actually is, and it is not summarising:**

1. **Line up the disagreements and keep them.** The *Sharāsīm* gives three schemes
   of the letters' four natures and ranks them itself; al-Būnī's own table differs
   again. A summary would pick one. A distillation ships all three, labelled — and
   that is what later becomes three rulesets rather than one wrong fact.
2. **Check claims against data we already hold.** Al-Būnī says fifteen dotted and
   thirteen undotted letters. `v2/data/letters.json` was checked: fifteen and
   thirteen, matching letter for letter. That one sentence is worth more than a
   page of assertion, and it cost one command.
3. **State the negative results.** "No held source tabulates which divine name
   goes with which letter" is a finding. Without it, a later agent will invent the
   table, because the absence looks like an oversight.
4. **Name what is ours.** Every ruleset in `rulesets.json` carries an
   `interpretation_note`, and a test fails without one.

**Model:** Opus 5. This is the role where a cheaper model produces something that
reads correct and is subtly averaged.

### 2.3 DESIGNER — attested claim to deterministic rule

**Input:** the reference document. **Not** the sources.

**Output:** a spec — usually JSON plus a paragraph of rationale. `rulesets.json`,
`lessons.json`, `levels.json`, a section of `DESIGN.md`.

**The test a design must pass here** (this project's own rule, learned the hard
way): *is the rule derived from something on the page, or assigned?* The eight v2
primitives come from visible facts about the letters — an upright stroke holds a
frame, a closed loop binds, a tail pours, dots raise or lower, the six
non-connecting letters sever. That is one rule with five clauses. The alternative
— a table of twenty-eight assigned powers — is unfalsifiable, unlearnable, and
indistinguishable from fantasy.

**The second test:** *what would prove this wrong in play?* A mechanic nobody can
be wrong about teaches nothing. The Descent's floors are the sharp case: each
floor's answer must depend on which metaphysics is running, or the assay is
decoration.

**Model:** Opus 5.

### 2.4 BUILDER — implements the spec, reads no scholarship

**Input:** the spec, the engine, the tests. Zero corpus.

This is the role that consumes the most tokens and needs the least research, and
keeping those two facts apart is most of what this pipeline is for. A builder
session that starts by reading a PDF has already failed: it is spending
book-length context to re-derive a postcard the distiller already wrote.

**Model:** Sonnet 5 for plumbing, UI, build scripts, data wrangling. Opus 5 for
engine changes and anything where being wrong is discovered days later.

### 2.5 VERIFIER — proves the claim, not the absence of crashes

**Input:** the code and the spec. **Output:** a check that fails when the spec is
violated.

The house rule is that a level ships only after a solver has seen it, and that the
solver asks a **second question** suited to the mode:

| Mode | The second question |
|---|---|
| Pushing Floor | is it solvable **without** the letters? if yes, they are decoration |
| Standing Word | does it matter **which letter** you use? |
| Reckoner (assay) | do the probes **distinguish** the hidden ruleset from all others? |
| Descent | is it fair under **every** metaphysics, and does every pair of them differ on it? |
| Introduction | does each lesson's **own scripted solution** finish its task? |

Two of those checks were **impossible as first written**, and finding that out was
the point. The Descent's gate first demanded a trap in *every direction* between
rulesets; a 9,579-candidate search found nothing, because the Ottoman ruleset's
solutions are a subset of the intellectual's by construction and the gnostic's of
the Sufi's. The gate was wrong, not the levels. **A verifier that never fails is
not a verifier; a verifier that fails on everything is a bug in the verifier.**

---

## 3. The handoff contracts

What each artifact must contain for the next role to work from it alone. These
are the actual acceptance criteria; a file that fails one of them will send the
next agent back to the sources, which is the cost this whole pipeline exists to
avoid.

### Contract 1 — CLAIMS → REFERENCE

| Must have | Why |
|---|---|
| a page, folio, or section number | otherwise the next agent cannot check it and neither can a reader |
| an honesty label | the difference between "the source says" and "we think" is the whole product |
| the source's own words for the key term | *taksīr*, *barzakh*, *rūḥāniyya*, *nāmūs* — the term is the handle for finding more |
| what the source does **not** say | prevents the next agent inventing to fill the gap |
| OCR damage preserved | a repaired name is a fabrication that cannot be detected downstream |

### Contract 2 — REFERENCE → SPEC

| Must have | Why |
|---|---|
| the claim in one sentence, plus its citation | the spec's rationale field quotes this |
| whether it is **derived** (from something observable) or **assigned** | decides whether it may become a primitive or must be a ruleset |
| the disagreements, not the average | disagreement is where rulesets come from |
| a "ready / built / refused" status | so a designer can find unbuilt work without re-reading — this is §6 of `LETTRISMRESEARCH.md` |
| an explicit refusal list | "no held source tabulates the divine names per letter" |

### Contract 3 — SPEC → CODE

| Must have | Why |
|---|---|
| every rule as **data**, not prose | `rulesets.json` is swappable; a paragraph is not |
| an `interpretation_note` on anything interpretive | enforced by a test |
| the check the code must pass, stated | the builder writes the test from the spec, not from the code |
| worked examples with expected outputs | `اا` compiles to one shadda'd alif occupying one cell — that example caught a real bug |

### Contract 4 — CODE → PROOF

| Must have | Why |
|---|---|
| a check that runs in Node with no browser | CI-able, fast, and survives a browser pane that will not screenshot |
| a browser `selfTest()` handle through the **real input path** | proves the UI wiring, not just the engine |
| the second question, not just "does it work" | see the table above |
| the numbers printed, not hidden | the Descent's gate prints how many universal placements remain rather than asserting zero |

---

## 4. Context budget per role

The numbers that decide model choice more often than difficulty does.

| Role | In context | ≈ tokens | Never in context |
|---|---|---|---|
| READER | one corpus chunk + the rubric | ~12K | any other source, the game code |
| DISTILLER | 5–20 claim sets on one topic + the existing reference file | ~30K | raw corpus files |
| DESIGNER | the reference file's relevant section + the engine's README + one existing spec | ~25K | the corpus, the app UI code |
| BUILDER | the spec + the module being changed + its test | ~40K | the corpus, the reference documents |
| VERIFIER | the spec's claim + the code under test | ~20K | everything else |

**The rule of thumb:** if an agent's context contains both a scholarly source and
a `.js` file, two roles have been merged and the session is about to be expensive.
The one legitimate exception is a **provenance repair** — when a shipped mechanic's
citation turns out to be wrong and someone must hold both to fix it.

---

## 5. Worked example — how the letters' powers actually got built

This is the real chain for one shipped feature, with the files, because an
abstract pipeline is unfalsifiable.

**The ask** (Ted, 2026-09-07): a document explaining "how the traditional
attributions or creative powers of each of the arabic and hebrew letters… will
play out in giving the players abilities to influence the world," citing sources.

| Step | Role | What happened | Artifact |
|---|---|---|---|
| 1 | READER | grepped `gardiner-stars-and-saints-al-buni.md` for the letter-cosmology passage; read pp. 56–57 around it | claims with folio cites (*Laṭāʾif* ff. 18a–18b) |
| 2 | READER | grepped `islamicate-occultism-new-perspectives.md` for "twenty-eight letters"; found Varisco's translation of Süleymaniye B89 f. 4r | the mansions passage and the dot-omen scale |
| 3 | READER | grepped `saif-...-2021-islamicate-occult-sciences.md`; found Coulon's *Sharāsīm* quotation with the natures listed letter by letter | the only per-letter nature list we hold |
| 4 | READER | read Segol pp. 22–23, 41, 51, 72, 91, 105–106 from the PDF on `E:\` | the SY's division, planets, 231 gates, space cube, golem |
| 5 | DISTILLER | **checked al-Būnī's 15/13 dot count against `v2/data/letters.json`** — it matched, letter for letter | a verified sentence, not an assertion |
| 6 | DISTILLER | wrote the per-letter tables with every attribution labelled, and an explicit refusal list | `v2/POWERSOFTHELETTERS.md` |
| 7 | DESIGNER | separated *derived* (form → primitive, already built) from *assigned* (nature, mansion, name → ruleset material, not built) | §4 of that file, the extraction table |
| 8 | DESIGNER | specified sixteen lessons, each with text, sources, a task, and a **scripted solution** | `v2/apps/introduction/lessons.json` |
| 9 | BUILDER | implemented reach, tasks, diagrams, UI — reading the spec, not the sources | `src/lesson_rules.js`, `src/diagrams.js`, `src/ui.js` |
| 10 | VERIFIER | ran every lesson's own solution through the same rules module the page uses | `v2/tests/introduction.test.mjs` |
| 11 | VERIFIER | played all sixteen through the real input path in the deployed browser | `__intro.selfTest()` |

**What the chain caught that a single-pass session would not have:**

- The RAISE lesson used nūn, which has a dot above **and a tail** — so it raised
  the block and then poured it to y = −1, below the floor. The lesson now uses tāʾ,
  and the engine question ("should the ground stop POUR?") is logged as open
  rather than patched under a deadline. *Caught by the verifier, in step 10.*
- `extract()` **detaches rather than deletes**, so the erased alef floated beside
  the golem's brow and still read as a letter. `erase()` now removes it and the
  lesson says so. *Caught by the browser self-test, step 11.*
- The camera's `scale → k` rename made the getter read itself: infinite recursion,
  a blank page. *Caught by reading the console after the change, which is why that
  is a step and not a courtesy.*

---

## 6. Failure modes, all of which have happened here

| Failure | What it looks like | The fix, and where it is enforced |
|---|---|---|
| **Rule in prose only** | 43 copyrighted PDFs sat tracked on a public repo *while the rule against it was written in the project file* | a rule is unenforced until it has a check: `tools/check_repo_rules.py` |
| **Silent staleness** | `world.js` changed without bumping the cache token; the live alif fell, locally it stood | R6/R6b: the token must move when the engine hash moves, anchored in `engine/VERSION.json` |
| **Verifier that cannot pass** | the Descent's first gate found 0 of 9,579 candidates | ask whether the *check* is possible before concluding the design is bad |
| **A level solvable for the wrong reason** | v1's Impossible Architect: won in fifteen moves without opening a door | the second question, per mode (§2.5) |
| **Plausible repair of OCR** | `al-Bu¯n¯ı` "corrected" into a confident wrong name | readers record damage at LOW confidence; the batch prompts say so explicitly |
| **Research that dies with the session** | a finding stated in chat and lost at summarisation | grimoire page + INDEX line + LOG entry, same session |
| **Merged roles** | a session with a 600K-token corpus file and a UI bug open at once | one role per context; see §4 |
| **Claiming done without looking** | "deployed" when the build had not run | fetch the live artifact and check for the *specific* thing asked for |
| **Trusting a stale console** | chasing a fixed recursion error that was a leftover entry in the pane's cumulative buffer | the buffer survives navigation; confirm in a fresh tab, and remember the `?v=` token cannot re-fetch the HTML that carries it |

---

## 7. Running it

```bash
# READER — chunk the corpus, run a rubric across chunks, resumably
python tools/batch/make_tasks.py --list
python tools/batch/make_tasks.py corpus                 # 268 chunks, ~10K tokens each
python tools/batch/run_batch.py --tasks tools/batch/tasks/corpus.jsonl --limit 5   # ALWAYS 5 first
python tools/batch/run_batch.py --tasks tools/batch/tasks/corpus.jsonl --workers 4

# DISTILLER — check a claim against data before writing it down
python -c "import json; d=json.load(open('v2/data/letters.json',encoding='utf-8'))['letters']; \
  print(sum(1 for l in d if l['facts']['dots_above']+l['facts']['dots_below']))"

# DESIGNER — search a design space rather than sketching in it
node v2/apps/descent/design_search.mjs --budget-ms 540000

# VERIFIER — everything, in the order it gets cheaper to fail
python v2/data/build_letters.py --verify
python v2/data/build_hebrew.py --verify
node v2/tests/engine.test.mjs
node v2/tests/descent.test.mjs
node v2/tests/introduction.test.mjs
node v2/tests/glyphs.test.mjs
node v2/apps/pushing-floor/verify_levels.mjs
node v2/apps/standing-word/verify_levels.mjs
node v2/apps/reckoner/verify_levels.mjs
node v2/apps/descent/verify_run.mjs
python tools/check_repo_rules.py
```

**Known limitation, unchanged:** `claude -p` hangs when invoked from inside a
running Claude Code session on this machine. Run batch sweeps from a separate
terminal. The runner's control flow is verified with a stub binary; the live
transport is not.

---

## 8. The one-paragraph version, for a session that reads nothing else

Sources never enter the game's context; artifacts do. A reader takes one chunk and
emits cited, labelled claims, preserving OCR damage. A distiller cross-reads them
into a reference that keeps the disagreements, checks what it can against data we
already hold, and states the refusals. A designer turns *derived* facts into
primitives and *assigned* ones into swappable rulesets, and writes the check the
build must pass. A builder implements from the spec with no scholarship in
context. A verifier asks not "does it run" but the second question for that mode,
and prints its numbers. Every finding lands in a file the same session it is
found, because the session will end and the file is all that survives.
