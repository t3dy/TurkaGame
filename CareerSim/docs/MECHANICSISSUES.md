# MECHANICSISSUES.md — Ranked Defects in the Loop

**Written 2026-08-31**, from measurement, not reading. Reproduce any figure with
`node tools/analyze-content.mjs` and `node tools/simulate-runs.mjs 2000`.

Ranked by **how much of the designed experience the defect removes**, not by how hard it
is to fix. Each entry names the evidence, the mechanism, and a proposed fix.

**Status 2026-08-31 (same day, second pass — re-measured, not assumed):**
§1 ✅ fixed (0 dead gates; grants in II and IV; hīmiyā taught by the bench; lint added in
`tools/test-reachability.mjs` and verified to fail when the bug is reintroduced).
§3 ✅ fixed (draw is random-among-eligible; Phase IV desk split, budget 6→8; starved list
went from 11 encounters to 4). §4 ⚠ improved, not met (overlap 57%→51% vs <40% target).
§5 ⚠ partial (judgeship cost 2; commission injected, contracts 0.32→0.61/run; expectation
still read by nothing). §7 ✅ fixed (tribunals injected at their exposure tiers; third
inquisition resolves in ~60% of runs, was 31%). §2, §6, §8, §9 open — §8 deliberately so,
since retuning fates before the §ECONOMY meter pass would tune against saturated inputs.
The exposure ladder (ECONOMY §3 fix 1) now exists as `content/pressure.js`.

A note on why these survived two prior audits: **every one of them passes the existing
lints.** The lints check that a thing is *referenced* (a science is gated somewhere, a
memory flag is read somewhere), never that the reference can be *reached*. A test that
certifies a bricked-up door as a door is worse than no test, and §1 is the clearest case.

---

## 1. Nine Quintet gates can never be opened, and hīmiyā does not exist ★★★★★

**Evidence** — `node tools/analyze-content.mjs reach`.

Quintet tiers are granted at exactly **two encounters, both in Phase I**, and both are
exclusive picks:

- `circle_entry` → **one of** kīmiyā +1 / līmiyā +1 / rīmiyā +1
- `majlis_feast` → **one of** sīmiyā +1 / rīmiyā +1

Maximum tier attainable in any run: `kimiya 1, limiya 1, himiya 0, simiya 1, rimiya 2`.
Across 2000 simulated runs the highest tier ever observed matches exactly.

Against that, content asks for tier ≥2 nine times, and hīmiyā three times:

| Gate | Where | Verdict |
|---|---|---|
| `limiya>=2` ×5 | `isfahan_study_two`, `court_dynasty`, `court_quran`, `pivot_tahawi`, `trial_letters` | unreachable |
| `himiya>=1` ×3 | `isfahan_preacher`, `court_rival_astrologer`, `court_bazm_confession` | unreachable — the science is never granted |
| `kimiya>=2` ×1 | `pivot_grimoire` | unreachable |

**Why this is the worst item on the list.** The dead gates are not marginal options; they
are the game's signature moves. `pivot_tahawi`'s locked option is *"Draw the Circle, and
draw it simply"* — the Ṭahawī Circle, the one diagram of Ibn Turka's that survives in his
own hand. `isfahan_study_two`'s is *"Treat them as notation and build the system on them"*
— the muqaṭṭaʿāt insight the whole cosmology rests on. `court_dynasty`'s is *"Read it from
the ruler's name"* — lettrism doing the thing lettrism is for. A player is shown the
correct historical move, told they lack the rank, and can never obtain the rank.

Worse, they are shown it constantly. Measured over 1,200 runs: a run is offered **100.8
options**, of which **18.5 are locked**, of which **2.8 are permanently unopenable — 15% of
every locked door the game shows.** `needs līmiyā ●● (practiced)` is the single
most-displayed locked door in the game, at 2.02 per run. A sixth of the "teach through the
locked door" surface teaches a lie.

SYSTEMS.md §2 defines rank 2 as "practiced (**unlocks the verb**)", rank 3 as hostile-
context mastery and rank 4 as teachable. Ranks 2–4 are documented, the UI renders their
names (`●●●● (systematized)`), and no run can reach them.

**Fix.** Two decisions, in order:

1. **Decide what rank means at this scale.** Either (a) grant tiers throughout the run —
   roughly one tier per phase per pursued science, so a focused player reaches rank 3 by
   Phase IV and a dilettante holds three sciences at rank 1; or (b) rescale every gate to
   the 0–2 range the content actually produces and delete ranks 3–4 from the spec and UI.
   **Recommendation: (a).** Rank progression is what makes the Quintet a capability system
   rather than a Phase-I character-creation choice, and (b) permanently forecloses the
   "systematized → teachable → feeds Transmission" link that SYSTEMS.md §2 promises.
2. **Grant hīmiyā somewhere, or cut it.** It is the science of "influence, protection,
   political operation, **defense under interrogation**" in a game whose last phase is
   three interrogations. It should be obtainable in Phase II or III — the judgeship is the
   obvious teacher — not deleted.

**And add the lint that would have caught it:** for every `X>=N` gate, assert that some
reachable sequence of grants reaches N. `analyze-content.mjs reach` already computes it;
it needs to become a failing test in `tools/test-engine.mjs`.

---

## 2. Half of all choices are not choices with outcomes ★★★★☆

**Evidence** — `analyze-content.mjs invariants`: **108 of 201 options (54%) have exactly
one outcome band.** Five encounters are fully deterministic in every option.

SYSTEMS.md §8 promises "gradient outcomes (6-step), never pass/fail" on every resolution.
In practice the median option is a branch with a fixed result, and the gradient exists on
93 options.

The authored band mix is also top-heavy — `success 25%, qualified 20%, triumph 17%,
ambiguous 8%, backfire 8%, disaster 1%` — and as *played* it is worse, because boosts
multiply the top two bands: **triumph+success = 52% of resolutions, disaster = 0.3%.**
Four outcomes in the whole game are disasters.

**Why it matters.** The gradient is the mechanism that makes preparation legible. If an
option always produces the same paragraph, the `favoredBy` boost the player earned is
invisible — the UI says "favoured by Yazdī" and then nothing different happens.

**Fix.** Not "add bands to all 108" — many deterministic options are correct (accepting an
office should just work). The rule should be: **an option that consumes a capability must
roll.** Concretely, every option with a `requires` or `boosts` clause needs ≥2 bands, so
preparation has something to tilt. That is a bounded content pass over 65 gated options,
of which some already comply.

Separately, **disaster needs to be reachable.** Either author more of them or, better,
make the bottom two bands *conditional on exposure tier* — the same choice that is merely
qualified at "Unremarked" should be able to backfire at "Denounced". That is the rebel
fleet doing something a meter alone cannot.

---

## 3. Positional starvation: authored content that never fires ★★★★☆

**Evidence** — `simulate-runs.mjs 2000`. Firing rate over 2000 runs:

| Encounter | Position in node | Fires in |
|---|---|---|
| `pivot_sources` | 6th of 6 (`desk`) | **0.0%** |
| `court_razm_device` | 3rd of 3, plus a memory gate | **0.0%** |
| `pivot_sensory` | 5th of 6 | 0.5% |
| `isfahan_deputy` | 2nd of 2, plus competition | 2.7% |
| `circle_naming` | 4th of 4 | 3.5% |
| `pivot_globes` | 4th of 6 | **4.3%** |
| `isfahan_sorcery_trial` | 3rd of 3 | 5.8% |
| `trial_checkpoint` | 4th of 4 | 6.3% |
| `court_dynasty` | 4th of 4 | 7.2% |

**The mechanism.** `drawEncounter` returns the first eligible encounter in the node's
array. To see the 6th encounter in a node you must visit that node six times. Phase IV has
a **6-season budget** and its `desk` node holds **six encounters** — reaching the last one
would consume the entire phase and leave nothing for the other four nodes.

**Why this stings.** `pivot_globes` is the Three Globes of Light — the *Investigations*'
own structure, ATTESTED, added in the previous audit as its headline content fix (AUDIT.md
§3.2). It was added at position 4 of 6 and fires in **4.3%** of runs. The fix shipped and
was never measured. `court_dynasty` — "how long will my house last?", the most quotable
thing a court astrologer ever does — fires in 7.2%.

**Fix, in ascending order of ambition:**

1. **Cheapest, today:** cap node pools at `min(4, phase.time - 2)` and rebalance Phase IV's
   `desk` into two nodes. Moves everything above 4% into double digits.
2. **Better:** make the draw *weighted-random among eligible* rather than first-eligible,
   with an explicit `priority` field for encounters that must sequence (the three
   inquisitions, the departure). This preserves the one place determinism is doing real
   work while ending starvation everywhere else, and it directly attacks §4.
3. **Also:** treat position as a design surface. `analyze-content.mjs` should print each
   encounter's node position beside its firing rate, so authoring a scene at position 5 is
   a visible decision rather than an accident.

---

## 4. Replay variety misses its own stated target ★★★☆☆

**Evidence** — successive-run Jaccard overlap of encounter sets: **mean 56.7%, median
56.5%, p10 46.9%**. NEXTSTEPS' Slice 4 target is **<40%**.

Pool depth is not the problem — a run sees only 49% of the corpus. Determinism is: the
same encounters lead every node, so two runs that visit similar nodes see near-identical
content. Adding the ~50 encounters Slice 4 contemplates would improve this far less than
fixing the draw (§3, fix 2) would.

**Fix.** Weighted-random draw, then re-measure before authoring anything. This is a
one-function change that plausibly meets a target currently budgeted as fifty encounters
of work.

---

## 5. The career systems are one encounter each ★★★★☆

**Evidence** — `analyze-content.mjs gates`:

- **Obligations: 1.** The judgeship, Phase II, `cost: 1`, with one delegation escape.
  SYSTEMS.md §4 specifies "judgeship duties in Phase II consume **2–3 time/turn** unless
  delegated". Implemented at 1. Phases III, IV and V have **no obligations at all**.
- **Contracts: 1 encounter** (`court_commission`, Phase III, three variants). Measured
  **0.56 contracts per run** — nearly half of all runs never encounter the contract system.
- **`opt.time`: 0 uses.** The engine's extra-season-cost field is implemented and unused,
  so every action in the game costs exactly one season.
- **`state.expectation`: written, never read.** `expectation_delta` inflates it;
  `checkReq` implements `expectation>=N`; **no content uses it.** Measured end value:
  median 0, max 2.

**Why this is the loop's central failure.** DESIGN.md's thesis and GAMELOOP.md §5 both name
the competition for a season as the game's identity. A run poses that competition about
twice. Patron expectation — "success is compounding danger on the patronage axis, just as
Exposure is on the political axis" — is a number that goes up and is read by nothing. This
is precisely the inert-artifacts defect the last audit fixed, reborn one system over.

**Fix.**

- Raise the judgeship to `cost: 2` as specified, and give **every phase** a standing claim
  on time: Phase III a patron's retainer, Phase IV the book itself (composing is an
  obligation, which is thematically exact), Phase V the tribunal's summonses.
- Contracts at **2–3 per phase from III onward**, deliberately overlapping so deadlines
  collide.
- Make expectation load-bearing: gate at least one option per late phase on
  `expectation>=2` (the patron who now expects a marvel), and have high expectation shift
  contract requirements upward. Until something reads it, delete `expectation_delta` rather
  than leave a live-looking dead number.

---

## 6. Demonstration is a dead meter that content still gates on ★★★☆☆

**Evidence** — `simulate-runs.mjs`: end-of-run demonstration **median 1, mean 0.94, max 6**,
against a 0–10 scale. Synthesis ends at 10, transmission at 9.

The corpus barely raises it: 5 sites in Phase I, 5 in II, 10 in III, **2 in IV, 1 in V**.
But gates keep asking: `meter:demonstration>=3` is shown as a locked door **0.70 times per
run**, and the Phase III contract `demonstration_boon` *requires* `demonstration>=3` —
so the game's only contract is one most players cannot deliver.

**Fix.** Decide whether Demonstration is a meter or a phase. If it is one of four core
meters it needs reward sites in every phase (Phase IV's book has demonstrations in it;
Phase V's tribunals are the ultimate demonstration). If it is really "the Phase III skill",
say so and stop gating Phase IV–V content on it. **Recommendation: keep it, feed it** — the
trial phase reading Demonstration would be thematically perfect and it currently reads
nothing.

---

## 7. The designed climax is missed by two-thirds of players ★★★★☆

**Evidence** — `simulate-runs.mjs`: `trial_first` fires in 99% of runs, `trial_second` 64%,
**`trial_third` 32.5%**. `state.memory.third_inquisition` is undefined in **68.7%** of runs.

The three inquisitions are the same node's queue positions 1, 2, 3, and reaching the third
requires choosing "The Tribunal" three separate times out of ~6 available turns, while
`trial_second` additionally requires exposure ≥4 and `trial_third` ≥5.

This is why the ending distribution collapses (§8): the *whole* fate matrix keys off
`third_inquisition`, and two-thirds of runs never set it.

**Fix.** The third inquisition should not be opt-in. Make it an **injected encounter**: at
exposure ≥5, entering any Phase V node draws the tribunal. That is what "the state has
decided you are its business" means, and the exposure tier system already exists to say it.
The player's agency belongs in *how they answer*, which is already well authored — four
substantial options — not in whether they are ever charged.

---

## 8. The two-axis ending is effectively a one-axis ending ★★★☆☆

**Evidence** — 2000 runs, random play:

- **System fate: `source_code` 67.1%** — the maximal outcome ("the default imperial
  cosmology... Timurid, Aqquyunlu, Safavid, Uzbek, Ottoman, Mughal") is the *modal* result
  of playing at random. Under `greedy` play it rises to **82.4%**. `died` 0.1%, `indexed`
  0.1%, `appropriated` 0.1%.
- **Man fate: `harried` 56.0%**, `recanted` 22.9%. Of 14 authored man-fates, 3 never fire
  and 5 fire in under 1%.
- **The attested ending — `exiled`, "the attested fate, arrived at by your own road" —
  fires in 1.6% of runs.**

DESIGN.md and SYSTEMS.md §9 state the requirement plainly: *"High-everything runs should
discover the 'Ibn Turka problem': maximal success is maximally dangerous. The historical
run must be reachable and must not be optimal."* Measured, the opposite holds: **maximal
success is the default, playing better makes it more likely, and the historical run is a
1.6% accident.**

The cause is upstream, not in the matrix. `source_code` tests `transmission>=8 &&
synthesis>=7`; both meters saturate (§ECONOMY). `harried` catches every run where a
tribunal happened but the third never resolved (§7). The 14×9 matrix is well written and
is being fed garbage.

**Fix.** In order: fix the meter economy ([ECONOMY.md](ECONOMY.md) §2), fix §7 so the third
tribunal actually resolves, then re-measure. Only then re-tune thresholds. Add a test that
**no single system fate exceeds ~30% of runs** and that the historical cell is reachable in
the low tens of percent under some coherent strategy.

---

## 9. Memory is almost entirely retrospective ★★☆☆☆

**Evidence** — 148 flags written; **24** read by an encounter gate; **124** read only by the
ending's marginalia; **9 read sites reach back across a phase boundary**, involving 8
flags: `inks_solved, yazdi_bond, lineages_declared, public_defense_won, sources_credit,
vizier_ally, investigations_begun, observatory_work`.

Not a bug — the Chekhov lint passes and the marginalia are the best writing in the project.
But "the world remembers" currently means "the epilogue remembers". A player's Cairo
choices change what the *ending says* far more than what Isfahan *offers*.

**Fix.** A modest target — **25 cross-phase read sites, up from 9** — spread so each phase
gates at least three options on something from two phases earlier. This is cheap content
work with high felt effect, and it is the same lever that makes replay variety real,
because divergent memory produces divergent eligibility.

---

## 10. Smaller, verified, cheap

- **34% of encounters (24 of 70) have no capability-gated option**, against the CLAUDE.md
  rule that every encounter should have one. Phase II is the worst (7 of 14).
- **`opt.time` and the `time>=N` requirement form are implemented and unused** — pick one:
  use them, or delete them so the grammar stops advertising a lever nobody pulls.
- **`cap:` gating is used twice**, against AUDIT.md §2.3's decision that "new content
  should prefer `cap:` over `person:`". `person:` is used 15 times. The decision was made
  and then not followed.
- **Plate coverage is lopsided**: P1 8/14, P3 8/16, but **P4 2/13 and P5 3/13** — the two
  phases about the book and the trials are the least illustrated.
- **Boost math may be too strong**: `weights[i] *= 1 + favoredBy.length` on the top two
  bands, uncapped. Three met boosts quadruple triumph's weight. Nobody has looked at
  whether that is the intended slope; it is worth one graph before more boosts are authored.

---

## Suggested order of work

1. **§1 dead gates** — smallest fix, largest restored surface, and it un-bricks the game's
   own signature moves.
2. **§3 + §4 the draw** — one function; fixes starvation and probably meets the replay
   target that is currently budgeted as fifty encounters of authoring.
3. **§7 the third tribunal** — without it the ending cannot be tuned at all.
4. **§5 career pressure** — the loop's identity; the largest content investment here.
5. **§2 gradients on gated options**, **§6 demonstration**, then **§8 re-measure endings**.
6. **§9 cross-phase memory** as ongoing authoring discipline rather than a project.

Nothing here outranks the standing item in [../NEXTSTEPS.md](../NEXTSTEPS.md): **a cold
human playtest.** Every figure above describes a machine playing; none of it tells you
whether the game is any good.
