# ECONOMY.md — The Numbers

**Written 2026-08-31.** The design of the quantities: meters, reputations, exposure, time,
and the Quintet ranks. [SYSTEMS.md](SYSTEMS.md) §1 defines *what* they mean;
this file is *how big they should be*, measured against how big they currently are.

Regenerate every figure:

```bash
node tools/analyze-content.mjs economy
node tools/simulate-runs.mjs 2000 random
node tools/simulate-runs.mjs 2000 greedy
```

---

## 1. What the meters do now

Median value at the end of each phase, 2000 random runs:

| | after P1 | after P2 | after P3 | after P4 | after P5 | cap |
|---|---|---|---|---|---|---|
| **Synthesis** | 2 | 5 | 8 | **10** | 10 | 10 |
| **Demonstration** | 0 | 0 | 1 | 1 | **1** | 10 |
| **Transmission** | 0 | 1 | 4 | 6 | 9 | 10 |
| **Exposure** | 2 | 3 | 5 | 6 | 7 | 10 |

Two of the four core meters are broken in opposite directions.

**Synthesis saturates.** It reaches its cap in **83% of runs** — 47% during Phase IV, 26%
during Phase III. Once pinned, every subsequent synthesis reward is worth nothing, and the
whole of Phase V (the trials, where understanding ought to matter most) is played with the
meter dead. The corpus offers **+75 synthesis** across the run against a cap of 10; a
median run collects far more than it can hold.

**Demonstration never starts.** Median 1 at run's end. The corpus offers it 23 reward sites
in total, **3 of them after Phase III**, while gates and the game's only patron contract
ask for `demonstration>=3`.

**Transmission is the one meter that works** — a genuine curve from 0 to 9 across five
phases, most of it earned in IV–V, which is exactly right for "how much of the system
exists outside his head".

**Exposure rises but never bites** — see §3.

## 2. The design problem: meters as scores instead of as pressure

All four meters are currently **monotone accumulators on a 0–10 scale**. Nothing spends
them, almost nothing reduces them (see §3), and the scale is small enough that a
five-phase run overruns it. That makes them scores, and a score that hits its ceiling
two-thirds of the way through the run has stopped being a game mechanic.

Three ways out, in order of preference:

**(a) Re-scale to the run, keep the ceiling meaningful.** Cap 10 is fine; the *inputs* are
four to seven times too generous. Target: a focused player reaches 8–9 in their chosen
meter at the very end; a scattered player reaches 5–6 in two. Concretely, roughly **halve
synthesis rewards and shift a third of them to Demonstration and Transmission**, so the
totals per phase look like:

| Phase | Synthesis | Demonstration | Transmission | Exposure |
|---|---|---|---|---|
| I Cairo | +6 (now +14) | +4 (now +6) | +3 (now +8) | +6 (now +14) |
| II Isfahan | +6 (now +16) | +5 (now +5) | +6 (now +12) | +8 (now +16) |
| III Courts | +6 (now +14) | +8 (now +11) | +8 (now +17) | +12 (now +26) |
| IV Pivot | +8 (now +26) | +5 (now +2) | +12 (now +45) | +10 (now +20) |
| V Trials | +3 (now +5) | +6 (now +1) | +10 (now +37) | +12 (now +26) |

These are targets for a content pass, not a formula. The shape matters more than the
digits: **synthesis front-loaded and flattening, demonstration present in every phase,
transmission back-loaded, exposure climbing throughout.**

**(b) Make meters spendable.** Composing costs synthesis; a demonstration at court spends
Demonstration and converts it to Imperial reputation. This is the more interesting design
and it is what the Slice 3 composition workbench naturally wants. It is also much more
work, and it should not be attempted before (a) — a spend system on top of a saturated
meter changes nothing.

**(c) Raise the cap.** Rejected. A 0–20 scale would hide the problem rather than fix it,
and the margin UI is built for single digits.

**Recommendation: (a) now, (b) with Slice 3.**

## 3. Exposure: the rebel fleet that never arrives

SYSTEMS.md §1a is explicit — *"Exposure is the FTL rebel fleet. It gates escalating
encounter injections (rumors → rival challenges → formal accusations → inquisition)."*

Measured, none of that happens:

- **Tiers** are Unremarked 0 / Talked About 3 / Watched 5 / Denounced 7 / Summoned 9. A
  median run ends at **7** and never sees "Summoned"; 67% of runs never reach the cap.
- **The tier changes almost nothing.** Only **three encounters in the entire game** carry
  an `exposure_min`: `court_rival_astrologer` (3), `trial_second` (4), `trial_third` (5).
  There are no rumours, no rival challenges, no formal accusations — the escalation ladder
  described in the spec is three encounters, all of which are also gated behind the
  player choosing to visit their node.
- **It never falls, as designed** — 83 raising sites against 6 lowering ones, all six in
  Phases III and V. That part is faithful.

So exposure is a number that goes up and, in most runs, is read by the ending and nothing
else. It has the *shape* of the rebel fleet and none of the *function*: the fleet's whole
job is to arrive.

**Fix, in order:**

1. **Injection, not eligibility.** Exposure tiers should *push* encounters into the player's
   turn, not merely permit them. The cheapest version: on entering any node, if
   `exposureTier` has risen since the last injection, draw from a small tier-keyed pressure
   pool instead of the node's own queue. Six to ten encounters (a rumour reaching you, a
   colleague's warning, an anonymous denunciation read aloud, a summons) would give the
   meter teeth in every phase, and would fix [MECHANICSISSUES.md](MECHANICSISSUES.md) §7 —
   the third tribunal should arrive because you are visible, not because you clicked the
   tribunal three times.
2. **Tier-conditional outcome bands.** The same option should be able to backfire at
   "Denounced" and merely qualify at "Unremarked". This is the cheapest source of the
   missing bottom of the gradient ladder (§MECHANICSISSUES 2) and it makes exposure felt
   at every single resolution rather than at three encounters.
3. **Retune thresholds after 1 and 2**, not before. With injection working, a median run
   should sit at Watched through Phase III–IV and reach Denounced in Phase V; Summoned
   should be a place ambitious runs go, not an unreachable label.

## 4. Reputations: the only system that already conflicts properly

End-of-run medians: **orthodox 4, occult 3, imperial 2, scholarly 5** (random play), with
real spread (`imperial` ranges −5 to +5). Phase III alone offers imperial +43/−17 — genuine
tension. Phase V inverts it: imperial +5/−15, orthodox +17/−12.

This works. The four reputations conflict, encounters read them individually as specified,
and the spread survives 2000 runs. **No change proposed.** The one nit: `scholarly` sits at
5 (the cap) in the median run and could use the same modest deflation as synthesis.

## 5. Time: the resource that should hurt and does not

Budgets are 7 / 8 / 9 / 6 / 7 seasons. Every action costs exactly 1 (`opt.time` is
implemented and used **zero** times), and the only recurring drain in the game is the
Phase II judgeship at cost 1.

So the real question a turn asks is *"which pleasant thing next?"* rather than *"what do I
give up?"* Proposed pressure, matching [MECHANICSISSUES.md](MECHANICSISSUES.md) §5:

| Phase | Budget | Standing obligation | Effective free actions |
|---|---|---|---|
| I Cairo | 7 | none (correct — this is the free phase) | 7 |
| II Isfahan | 8 | judgeship, **cost 2** as specified | ~4 |
| III Courts | 9 | patron's retainer, cost 1–2 | ~5 |
| IV Pivot | 6 → **8** | the book itself, cost 2 | ~4 |
| V Trials | 7 | summonses, cost 1, rising with exposure | ~5 |

Two notes. **Phase IV's budget should rise to 8** even as an obligation is added — it
currently sees only 35% of its pool, the worst in the game. And **the obligation in Phase
IV should be the book**, which is thematically exact: composing the *Investigations* is a
standing claim on every season, and delegating it is not available.

Also, **use `opt.time`.** A handful of options should cost 2 seasons — a long demonstration,
a journey, a full manuscript copy. It is implemented, it is free, and it is the simplest
way to make a single choice feel expensive.

## 6. Quintet ranks

Currently 0–4 in the spec and 0–2 in reality, with hīmiyā at 0 always. See
[MECHANICSISSUES.md](MECHANICSISSUES.md) §1 for the full evidence. The economy proposal:

| | grants available | reachable by a focused player | by a generalist |
|---|---|---|---|
| now | 2 encounters, both Phase I | 2 (rīmiyā only) | 1–1 |
| proposed | 1–2 sites per phase per science | 3 by Phase IV, 4 by Phase V | 2 in two sciences |

with **rank 2 as the working unlock** (as SYSTEMS.md §2 already says), rank 3 for hostile
contexts (the tribunals), and rank 4 as the teachable tier that feeds Transmission — which
also gives Transmission a source that is not just "more students".

## 7. What to measure after any change

Re-run both harnesses and check:

- No meter has a median at its cap before the end of Phase V.
- Demonstration's end-of-run median is ≥4.
- Exposure's median enters Denounced (7) during Phase V, and Summoned (9) is reached by
  the top quartile.
- No single system fate exceeds ~30% of runs; the attested ending is reachable in the low
  tens of percent under a coherent strategy.
- Run-to-run overlap is under 40%.
- No Quintet gate is unreachable.

These are the acceptance gates for the retune. They are all one command away, so there is
no excuse for tuning by feel.
