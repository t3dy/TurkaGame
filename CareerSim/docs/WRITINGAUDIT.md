# WRITINGAUDIT.md — The Prose, Measured

**Written 2026-08-31.** An audit of all 70 encounters' player-facing text against
[../../games/visual-novel/WRITING_GUIDE.md](../../games/visual-novel/WRITING_GUIDE.md)
("reveal the world, don't decorate it") and
[UI_STYLE_GUIDE.md](UI_STYLE_GUIDE.md) §3 (the two-voice rule).

Regenerate: `node tools/analyze-content.mjs prose` and `node tools/analyze-content.mjs lexicon`.

**Verdict up front: the prose is the strongest part of this project, and its weakest link
is not the writing but the delivery.** The glossary — the whole educational layer added
last session — reaches the player on **41%** of its occurrences, and the game's central
diagram is named in prose that can never be glossed. That is the finding worth acting on.

Two of the metrics below turned out to be **false alarms on inspection, and are kept on the
page with their refutations** so nobody re-raises them. That is the house habit
(`games/visionary-gallery/method.html`), and it applies to our own prose as much as to a
painting.

---

## 1. The corpus in numbers

| Surface | n | median | range | mean sentences |
|---|---|---|---|---|
| Situation | 70 | 232 ch | 180–438 | 3.06 |
| Option label | 201 | 30 ch | 6–61 | 1 |
| Option detail | 201 | 70 ch | 42–122 | 1.78 |
| Outcome text | 303 | 112 ch | 41–336 | 1.96 |
| Chronicle line | 303 | 85 ch | 51–145 | 1 |

**Consistency is excellent.** Chronicle lines are one sentence, every time, 51–145
characters — a genuinely uniform voice across 303 of them. Option details cluster in a
30-character band. Only 2 of 70 situations exceed four sentences.

**Repetition is very low.** The corpus is **1,148 player-facing texts, 18,234 words**. Over
the 373 of them that carry narrative prose (situations and outcome text), exactly **one**
five-word phrase recurs three or more times — and it is a proper name ("Qāsim-i Anvār").
For machine-assisted writing at this volume that is unusual, and worth recording as a
measured strength rather than an assumed one.

The mildest real tic: sentence openings. `it is the` (8×), `he does not` / `he is not` /
`it is a` (4× each). At 373 texts this is under the noise floor — noted, not actionable.

## 2. Voice discipline — clean, including where the metric said otherwise

**Chronicle voice (third person, past, world-facing): 0 violations in 303 lines.** Not one
chronicle line uses "you". Given they are written adjacent to second-person outcome text,
that is real discipline.

**Situations: 55 of 70 second person, 9 pure scene-setting, all consistent.**

**A metric that failed.** An automated check flagged **22 of 70 situations as "mixed
voice"** — containing both "you/your" and "he/his". Hand-checked, every instance is a
**third party**: the shaykh in `circle_entry`, the deputy in `isfahan_deputy`, the preacher
in `isfahan_preacher`, the merchant in `isfahan_nativity`, the prince in
`court_prince_question`. There is no voice violation. The check is a false positive and
`analyze-content.mjs` now prints that fact beside the number so it is not re-flagged.

## 3. The lexicon reaches 41% of its own vocabulary — the real defect

`glossify()` is applied at exactly two places in `src/ui.js`: **`enc.situation` and
`phase.intro`**. Option labels, option details, outcome text, chronicle lines and rubrics
all render **unglossed**.

Measured across the 23-term glossary:

- **31 occurrences** on glossable surfaces; **45** on unglossable ones.
- **Share of the glossary that can ever reach a player as a gloss: 41%.**

Three terms appear in player-facing prose *only* on surfaces that can never gloss them —
the player meets the word with no way in:

| Term | Where it appears | Problem |
|---|---|---|
| **Ṭahawī Circle** | a chronicle line | **The game's central diagram.** Its definition names the surviving autograph (Tehran, Majlis Library MS 10196, f. 63a) and no player will ever see it |
| **qāḍī** | outcome text, ×2 | The protagonist's actual job title |
| **wafq** | outcome text | Magic square — an operative device, not a curiosity |

Three more are defined and appear **nowhere at all**: `samāʿ`, `majlis`, `muqaṭṭaʿāt`.

The last is the sharpest. `isfahan_study_two` is *about* the mysterious letters — it opens
"The disconnected letters that open certain sūras — alif lām mīm, ṭā hā — have defeated
commentary for eight centuries" — and never uses the word **muqaṭṭaʿāt**, so the glossary
entry written for exactly this encounter never fires.

**A correction to AUDIT.md.** That document reports "*muwaqqit* (12×), *bazm/razm* (22×),
*wafq* (7×)" as evidence that terms were pervasive. Those are repo-wide grep counts —
they include encounter ids (`court_bazm_wonder`), node ids (`razm`), and the lexicon file
itself. In player-visible prose the true counts are `muwaqqit` 3, `bazm` 3, `razm` 1,
`wafq` 1. The terms are pervasive in the *codebase* and thin in the *game*.

**Fixes, cheapest first:**

1. **Apply `glossify()` to outcome text and option detail.** One-line change per call site
   in `ui.js`; roughly doubles the glossary's reach immediately.
2. **Use the words in situations.** Add `muqaṭṭaʿāt` to `isfahan_study_two`, `qāḍī` to the
   Isfahan bench encounters, `Ṭahawī Circle` to `pivot_tahawi`'s situation, `majlis` and
   `samāʿ` to the Cairo salon and lodge scenes. Seven or eight word-level edits.
3. **Add a lint**: every lexicon term must appear at least once on a glossable surface, and
   every term appearing in prose must be glossable. Both are one query in
   `analyze-content.mjs` away from being a test.

## 4. Specificity — a proxy metric, and what it does and does not show

The WRITING_GUIDE's central rule is that every scene should surface something specific and
real. As a proxy, each situation was scored for named real entities: people, places, works,
and glossary terms.

| | mean entities/situation | situations with none |
|---|---|---|
| P1 Cairo | 1.36 | 4 of 14 |
| P2 Isfahan | 1.00 | 6 of 14 |
| P3 Courts | 1.19 | 10 of 16 |
| P4 Pivot | 1.00 | 4 of 13 |
| **P5 Trials** | **0.31** | **10 of 13** |
| ATTESTED | 1.25 | 19 of 40 |
| INVENTED-COMPATIBLE | 0.46 | 9 of 13 |

**Where the metric is wrong.** It flags `trial_third`, which reads:

> The third is different. The panel is chosen, not assembled; the charge is broad enough to
> cover a life; and the question underneath every question is simply whether a man may
> build a science the state has not authorized. This is the one the record says he loses.
> The record was not written by you.

That names nothing and is among the best writing in the project. It is *specific about
institutional process*, which is exactly what the guide asks for; the metric only detects
proper nouns. **Named entities are a proxy for specificity, not a definition of it**, and
Phase V's low score partly reflects a phase whose subject is a procedure rather than a
cast.

**Where the metric is right.** The gap between Phase I (1.36) and Phase V (0.31) is too
large to be entirely explained that way, and two patterns hold up on reading:

- **INVENTED-COMPATIBLE scenes are the least anchored** (0.46, 9 of 13 with no named
  entity). That inverts the guide's rule 2 — invented choices are supposed to "nest inside
  real historiographical framing", so they need *more* anchoring than attested ones, not
  less.
- **Phase V's real people vanish.** Qāsim-i Anvār's 1427 exile over the same lettrist
  associations is the emotional core of the trials, and Yazdī's copy is the one thread by
  which the work survives. Neither is named in most of the phase's situations, even though
  both are attested and both are already in the corpus's people registry.

**Action.** Not a rewrite. A targeted pass over the 13 INVENTED-COMPATIBLE situations and
the Phase V set, asking the guide's own question 1 — *what specific attested entity can
this scene surface?* — with `docs/BIOGRAPHY.md` and `site/data/timeline.json` open. Most
will need one clause, not a new paragraph.

## 5. Where the prose is doing something the mechanics are not

Three places where the writing is carrying a system the code has stopped supporting. These
belong in [MECHANICSISSUES.md](MECHANICSISSUES.md) too, but they read as writing problems
first:

- **`court_dynasty`** offers "Read it from the ruler's name" — the single most characteristic
  lettrist act in the game. It requires `limiya>=2`, which is **unreachable**. The player is
  shown the right answer, told they are not qualified, and can never qualify.
- **`isfahan_study_two`**'s notation branch — the muqaṭṭaʿāt insight the whole cosmology
  rests on — is behind the same dead gate.
- **`pivot_tahawi`**'s "Draw the Circle, and draw it simply" — the surviving autograph —
  likewise.

The three best-written options in the game cannot be chosen. Fixing that is
[MECHANICSISSUES.md](MECHANICSISSUES.md) §1, and it will do more for the felt quality of
the writing than any editing pass.

## 6. Copy nits

- `court_dynasty`: "There is a stars answer, a letters answer, a historian's answer" — the
  first two read as typos even though the parallelism is deliberate. "A stars answer" wants
  to be "an answer from the stars" or the whole series wants restructuring.
- Plate coverage is a writing problem as much as an art one: Phase IV has **2 plated
  encounters of 13** and Phase V **3 of 13**. The book and the trials are the phases where
  a manuscript image would carry the most weight, and they have the fewest.

## 7. Standing rules confirmed by this audit

- Chronicle voice never uses second person. **303 for 303. Keep it.**
- One sentence per chronicle line. Keep it.
- Option detail stays inside ~70 characters and names someone real. Keep it.
- **Do not** re-flag mixed voice in situations — checked 2026-08-31, every "he" is a third
  party (§2).
