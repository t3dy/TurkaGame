# ENCOUNTERSNEXTSTEP.md — The Content Plan

**Written 2026-08-31.** What to author next in `content/`, in what order, and why. Sits
downstream of [MECHANICSISSUES.md](MECHANICSISSUES.md) (which says what is broken) and
[ECONOMY.md](ECONOMY.md) (which says how big the numbers should be). Authoring rules
themselves live in [ENCOUNTER_ATOMS.md](ENCOUNTER_ATOMS.md) and
[../../games/visual-novel/WRITING_GUIDE.md](../../games/visual-novel/WRITING_GUIDE.md).

**The headline: do not author new encounters first.** The corpus is 70 encounters and a
run sees 31 of them. The binding constraint is not supply — it is that a fifth of the
existing content cannot be reached, a third of the options cannot be opened, and half the
choices have no gradient. Fixing those is worth more than fifty new scenes, and cheaper.

Reproduce the figures: `node tools/analyze-content.mjs`, `node tools/simulate-runs.mjs 2000`.

---

## 1. The pool as it stands

| | P1 Cairo | P2 Isfahan | P3 Courts | P4 Pivot | P5 Trials | total |
|---|---|---|---|---|---|---|
| Encounters | 14 | 14 | 16 | 13 | 13 | **70** |
| Options | 37 | 37 | 49 | 36 | 42 | 201 |
| Options per encounter | 2.6 | 2.6 | 3.1 | 2.8 | 3.2 | 2.9 |
| Gated options | 11 | 8 | 19 | 11 | 16 | 65 |
| Encounters with **no** gated option | 8 | 7 | 3 | 4 | 2 | **24** |
| Plated (manuscript image) | 8 | 3 | 8 | **2** | 3 | 24 |
| Seen per run | 8.0 | 7.9 | 7.9 | **4.6** | 6.4 | 31 |
| Grounding A/P/I | 7/2/5 | 5/7/2 | 10/3/3 | 11/2/0 | 7/3/3 | 40/17/13 |

Depth is adequate everywhere (the lint floor is 11; the thinnest phase is 13). The problems
are **distribution**, not volume.

## 2. Priority one — repair before you author

These are content edits to existing files, not new scenes. Each is bounded and each unlocks
material already written.

### 2a. Un-brick the nine dead Quintet gates *(blocks the most content)*

Nine options can never be chosen because the required rank is unreachable
([MECHANICSISSUES.md](MECHANICSISSUES.md) §1). The affected options are the game's best
moves — drawing the Ṭahawī Circle, reading a dynasty from the ruler's name, treating the
muqaṭṭaʿāt as notation.

The content-side half of the fix is **grant sites**: roughly one Quintet tier per phase per
pursued science. Candidate homes, all thematically natural and all in encounters that
already exist:

| Phase | Encounter | Grant |
|---|---|---|
| II | `isfahan_study_two` (mysterious letters) | līmiyā +1 on the notation branch |
| II | `isfahan_inks` (ink chemistry) | kīmiyā +1 |
| II | `isfahan_appointment` / bench work | **hīmiyā +1** — the judgeship teaches political operation |
| III | `court_suffumigation` | sīmiyā +1 or kīmiyā +1 by branch |
| III | `court_bazm_wonder` | rīmiyā +1 |
| IV | `pivot_tahawi` / `pivot_wafq` | līmiyā +1 (rank 3: the diagram *is* the mastery) |
| V | `trial_third` | hīmiyā +1 on a successful defence — mastery under interrogation |

Note the shape: **hīmiyā gets a home in II and V**, which is where "defence under
interrogation" belongs, and līmiyā finally climbs on the encounters that are about lettrism.

### 2b. Fix node ordering so authored content fires

Nine encounters fire in under 10% of runs purely because of their position in a node's
array ([MECHANICSISSUES.md](MECHANICSISSUES.md) §3). `pivot_globes` — the ATTESTED Three
Globes of Light, added as the previous audit's headline fix — fires in **4.3%**.

Content-side actions:

- **Split Phase IV's `desk` node** (6 encounters, 6-season phase) into `desk` and a second
  study-adjacent node. Nothing at position 5 or 6 of a node can fire in a six-season phase.
- **Cap every node pool at 4** and, where a node needs more, add a node.
- **Move the buried gems forward**: `pivot_globes`, `court_dynasty`, `isfahan_sorcery_trial`
  and `trial_checkpoint` should sit at position 1–2 of their nodes.
- `court_razm_device` fires **0.0%** — it is third in its node *and* gated on
  `mem:showed_vanishing_ink`. Either move it to position 1 or relax the gate to a boost.

### 2c. Give gated options something to roll

108 of 201 options have exactly one outcome. The rule to apply:
**every option with a `requires` or `boosts` clause needs ≥2 bands**, so preparation is
visible in the result and not only in the button. That is a pass over 65 options, of which
some already comply.

While doing it, author the **missing bottom of the ladder**: 4 disasters exist in the whole
game and they fire in 0.3% of resolutions. The best source is exposure-conditional bands
(§ECONOMY 3) — the same choice going worse when the state is already watching.

### 2d. Close the 24 encounters with no gated option

34% of encounters offer only free choices, against the house rule that every encounter
should have at least one capability-gated option. Phase I (8) and Phase II (7) are the
worst, which is also where a player is learning that preparation matters. One gated option
each — preferring `cap:` over `person:`, per AUDIT.md §2.3's decision, which has been
followed twice in 17 opportunities.

## 3. Priority two — the pressure pool (new content, small)

**6–10 new encounters, tier-keyed to exposure, injected rather than chosen.** This is the
single most valuable new-authoring project because it converts Exposure from a number into
the rebel fleet ([ECONOMY.md](ECONOMY.md) §3) and fixes the fact that **68.7% of runs never
resolve the third inquisition**.

Sketch of the ladder, one to three encounters per tier, drawable in any phase:

| Tier | Encounter shape | Grounding |
|---|---|---|
| Talked About (3) | A version of your argument comes back to you distorted, from a stranger | PLAUSIBLE-GAP |
| Talked About (3) | A colleague mentions, kindly, that your name came up | PLAUSIBLE-GAP |
| Watched (5) | A rival requests a public disputation you cannot refuse without cost | ATTESTED pattern |
| Watched (5) | Someone asks for a copy of a work, and you cannot tell why | PLAUSIBLE-GAP |
| Denounced (7) | A written accusation is read to you before any tribunal convenes | ATTESTED — the documented pattern of pressure short of trial |
| Denounced (7) | A patron asks whether he should still be seen with you | PLAUSIBLE-GAP |
| Summoned (9) | The summons itself — the tribunal arrives because you are visible | ATTESTED |

The last one is the fix for §7: **the third inquisition should arrive, not be clicked.**

## 4. Priority three — career-pressure content

[MECHANICSISSUES.md](MECHANICSISSUES.md) §5: one obligation and one contract encounter in a
five-phase game. To make the loop's central question real, author:

- **Contracts at 2–3 per phase from III onward**, with deadlines that overlap. Each needs
  the full Nummedal shape already implemented in `career.js`: promise, deadline, reward,
  `expectation_delta`, failure consequence. Vary the register — a prince wants a marvel, a
  vizier wants a prognosis in writing, a patron's widow wants the horoscope finished.
- **A standing obligation per phase** (III retainer, IV the book, V summonses), per
  [ECONOMY.md](ECONOMY.md) §5.
- **At least one option per late phase gated on `expectation>=2`** — the patron who now
  expects a marvel because you delivered one. Until something reads expectation, the
  inflation mechanic is a number with no consumer.
- **A handful of `opt.time: 2` options** — long demonstrations, journeys, a full copying
  job. Implemented, currently unused, and the cheapest way to make one choice feel costly.

## 5. Priority four — cross-phase memory

Only **9 read sites reach back across a phase boundary**, involving 8 flags. Target **25**,
so that each phase gates ≥3 options on something from two phases earlier. This is what makes
two runs diverge structurally rather than cosmetically, and it is the cheapest real
contributor to the replay target.

Good candidates already written and currently read only by the ending: `sold_a_verdict`,
`defended_occultist`, `family_told`, `preacher_enemy`, `corrupt_copies`, `qasim_kept_clear`,
`withheld_treatise`. Each is a decision with obvious later consequences that the game
currently only mentions in the epilogue.

## 6. Priority five — new scenes, and where they should go

Only after 2–5. When it is time, the gaps are:

**By phase.** Phase IV sees 35% of its pool and has the least visual support (2 plated of
13); it needs node structure more than encounters. Phase II is the flattest — 7 of 14
encounters have no gated option, 3 plated, and the lowest option-per-encounter count.

**By subject** — attested material inventoried and still unmined (AUDIT.md §3.2, still
accurate):

- The **Bāysunghur Qurʾan** as a full encounter rather than a mention.
- *Boon for the Khan*'s named operations — sleeper interrogation, treasure dowsing, instant
  agriculture — as bazm/razm content, paraphrased per the research note's caution.
- VN choices **c11–c40**: only acts 1–2 were converted.
- The **ascent–descent–ascent** journey structure and "form is content".
- **Still blocked**: the seven-tier epistemic hierarchy, pending
  "Selenocentrism and Heliocentrism". Do not invent the missing tiers — standing rule.

**By register.** The corpus is strongest in the sober-institutional mode and thinnest in
comedy; the *bazm* material added last session is the only comic register in the game, and
`court_bazm_confession`'s best option is behind a dead gate.

## 7. Acceptance gates

Do not call any of this done on the strength of a diff. Run both harnesses:

- [x] `analyze-content.mjs reach` reports **0 unreachable gates** *(2026-08-31, lint-enforced)*
- [ ] No encounter fires in <10% of runs — *~3 remain (was 11)*
- [ ] Run-to-run overlap **<40%** — *52% (was 57%). Honest assessment: this needs pool depth
  (Slice 4), not more tuning — every cheap lever has been pulled*
- [ ] `third_inquisition` is set in **>80%** of runs — *~60–66% by mode (was 31%)*
- [x] Encounters with no gated option: **<10 of 73** — *9, via 15 conversions (2026-09-01)*
- [x] Options with a single outcome band that also carry `requires`/`boosts`: **0** *(2026-09-01;
  26 new bands, several exposure-conditional via the new `min_exposure` band gate)*
- [ ] Contracts opened per run **≥2** — *0.66; four contract sources now (commission,
  grimoire, Qurʾan layout, trial inscription). The gap to 2 needs contracts on
  unconditional paths, not more conditional ones — §4 remains the real work*
- [x] Cross-phase memory read sites **≥25** — *25 sites, 23 flags (2026-09-01)*
- [x] Expectation read by ≥3 gates — *3 boosts (grimoire counter-offer, patron's door, negotiation)*
- [x] No single system fate >~30% under random play — *scholarly 33%, source_code 23% (was 67%)*
- [x] The Ibn Turka problem holds under skilled play — *greedy: source_code 47% while 60% of
  those runs end personally broken/informer/recanted/fugitive — maximal success is maximally
  dangerous to the man, per DESIGN.md*

Each is one command. A claim in this file that is not backed by one of them should be
treated as a guess.
