# ENDINGS.md — The Two-Axis Verdict, Explained

**Written 2026-09-01.** How a finished run becomes an ending: the fate matrix in
[`src/engine/career.js`](../src/engine/career.js), the marginalia that read the run's
memory back, and "The Attested Life" that sets the historical record beside what the
player did. [SYSTEMS.md](SYSTEMS.md) §9 is the two-paragraph spec; this is the full
account of the system as built, tuned, and measured.

Every frequency in this file regenerates from:

```bash
node tools/simulate-runs.mjs 2000 random   # the floor — a player who understands nothing
node tools/simulate-runs.mjs 2000 greedy   # skilled-play proxy — prefers prepared options
```

---

## 1. The design in one sentence

**A run is judged twice, independently: what happened to the man, and what happened to
the system he built — and the whole point of the game is that the two answers are
allowed to disagree.**

Ibn Turka's historical arc is the extreme case: the man lost (three tribunals, the third
fatal, five years of wandering exile, death in legal limbo in 1432) while the system won
(Yazdī's copy survived him, and the astrological-lettrist platform became imperial
cosmology across six court cultures). A single "score" cannot say that. Two axes can,
and the ending screen renders them as a two-page spread — left page the man, right page
the system, per [UI_STYLE_GUIDE.md](UI_STYLE_GUIDE.md).

The ending is assembled from four layers, in this order on screen:

1. **The two verdicts** — one cell from each axis (§2, §3).
2. **The Attested Life** — seven rows of *what the record says* vs. *what you did* (§5).
3. **Marginalia** — the run's memory read back as chronicle lines (§4).
4. **The full record** — every decision, published to a witness if the player chooses
   (the ending screen is also where `buildChroniclePayload` is handed off; see
   `witness/`).

## 2. How a fate is chosen: ordered tests, first match wins

Both axes are arrays of `{ key, title, test, text }` entries. `finalVerdict` walks each
array top to bottom and takes the **first** entry whose `test(state)` passes. There is
no scoring, no weighting — the order *is* the design, and the file says so in its own
comment:

> the tribunals are the dramatic spine of the life, so what happened there is read
> FIRST, and only a life the tribunals never touched falls through to be judged on its
> career shape.

Three consequences of first-match-wins, worth knowing before editing:

- **Specific before general.** `condemned_with_book` (lost + the work named in the
  judgment) must sit above `exiled` (lost, plain), or it can never fire. Moving an entry
  is a balance change even if no test changes.
- **The catch-alls are load-bearing.** Both arrays end in `test: () => true` (`obscure`,
  `died`). Every run gets a cell; there is no "no ending" state.
- **A new fate is cheap to add and easy to bury.** If its test is a subset of an earlier
  entry's, it is dead code — the reachability habit applies here as much as to Quintet
  gates. When adding one, simulate and confirm it actually fires.

## 3. The matrix as built — 14 man-fates × 9 system-fates

126 nominal cells; in practice the axes correlate through exposure and transmission, so
the populated region is smaller. Frequencies are 2000-run random play, 2026-09-01 build.

### 3a. The man (personal fate)

Read in four blocks, top to bottom:

| # | Key | Title | Plain-English test | Freq |
|---|---|---|---|---|
| — | | **Block 1: the third tribunal went against him** | | |
| 1 | `condemned_with_book` | Condemned With His Book | lost the third AND the work was named in the judgment | 2.1% |
| 2 | `broken` | Broken by the State | lost the third at exposure ≥ 9 | 19.1% |
| 3 | `fugitive` | The Fugitive | fled rather than appear | 8.8% |
| 4 | `exiled` | **The Wandering Exile** | lost the third (the remainder) — **the attested fate** | 3.5% |
| — | | **Block 2: he survived, and how is the question** | | |
| 5 | `informer` | The Man Who Gave a Name | traded a friend's name at the tribunal | 6.0% |
| 6 | `recanted` | The Man Who Bent | signed the recantation | 19.4% |
| 7 | `vindicated` | Vindicated in Open Court | survived the third, stance held firm | 3.1% |
| 8 | `acquitted` | Thrice Tried, Thrice Standing | survived the third by any other road | **0% — dead code, see §8** |
| 9 | `harried` | Harried to the End | won an earlier tribunal; the third never resolved | 31.7% |
| — | | **Block 3: the tribunals never came — judged on career shape** | | |
| 10 | `eminent` | Eminence Without Incident | imperial ≥ 3 and exposure ≤ 6 | 1.8% |
| 11 | `judge` | The Judge of Isfahan | orthodox ≥ 3, kept the bench, exposure ≤ 4 | 0.3% |
| 12 | `unremarked` | Never Worth Summoning | exposure ≤ 2 | 0.1% |
| 13 | `watched` | Watched, and Left Alone | exposure ≥ 5, nothing ever acted on | 3.8% |
| — | | **Block 4: the floor** | | |
| 14 | `obscure` | A Quiet Obscurity | always true | 0.3% |

### 3b. The system (what happens to the science)

| # | Key | Title | Plain-English test | Freq |
|---|---|---|---|---|
| 1 | `source_code` | **Source Code of Empire** | transmission ≥ 9 AND synthesis ≥ 8 AND imperial ≥ 1 — the historical maximum | 23.4% |
| 2 | `scholarly` | Carried by the Learned | transmission ≥ 8 AND scholarly ≥ 3 | 32.7% |
| 3 | `escaped` | A Movement Beyond Him | transmission ≥ 6 — spread faster than it was understood | 17.9% |
| 4 | `one_hand` | Carried in One Hand | Yazdī holds a copy, transmission ≥ 3 — survival through one friendship | 0.3% |
| 5 | `indexed` | On the Index | the book was condemned by name, transmission ≥ 2 | 0.5% |
| 6 | `appropriated` | Taken and Hollowed | imperial ≥ 4 with synthesis < 6 — the court kept the useful parts | 0.7% |
| 7 | `underground` | Suppressed, Not Extinguished | transmission ≥ 3 | 13.1% |
| 8 | `unread` | Complete, and Unread | synthesis ≥ 7 — whole, rigorous, and in a box | 8.8% |
| 9 | `died` | Died With Its Author | always true | 2.8% |

Note the deliberate asymmetry: **the man's axis is read off the tribunals and memory;
the system's axis is read off the meters.** A man is what happened to him; a body of
work is how far it traveled and how complete it was. The one system-fate keyed to memory
rather than meters — `one_hand` — is the historical transmission route itself (Yazdī's
autograph copy), kept as its own cell precisely because it is the true story.

## 4. Marginalia: the run's memory, read back

After the verdicts, `legacyNotes` walks **191 entries** in `LEGACY_NOTES` — one
chronicle-voice line per memory flag (or `flag=value` pair) the run set. This is the
other half of the Chekhov's-gun lint: every flag content writes must be read by a later
encounter *or* resolve to a line here, so no choice can silently vanish from the record.

Two mechanics worth knowing:

- **Contradiction precedence.** Flag pairs that can both be true across a life
  (`taught_widely` + `hoarded`) merge into a single line about the tension itself,
  rather than printing as flat contradiction (fixed in the sixth-session audit).
- **The notes are data, not prose in the UI.** They travel into the witness payload as
  `legacyNotes`, so a published chronicle carries them verbatim — and a scholar can
  annotate them.

## 5. The Attested Life

`attestedRows(state)` returns **seven fixed rows**, each pairing an attested fact with a
run-conditional response — the counterfactual made explicit:

| The record says | Your run answers with |
|---|---|
| He studied in Cairo under Akhlāṭī | whether you entered the circle |
| He was Chief Judge of Isfahan, defender of the weak | whether you took the bench, and how you ruled |
| He completed *Investigations* in 1420 | whether your summa exists at all |
| The Ṭahawī Circle survives in his own hand (Majlis MS 10196, f. 63a) | whether you drew it |
| Three inquisitions: won two, lost the third, c. 1427 | your tribunal record against his |
| Qāsim-i Anvār exiled 1427 over the same associations | whether you stood by him |
| Died 1432, impoverished, in legal limbo; Yazdī's copy carried the work | whether your Yazdī holds a copy |

This is the single most educational surface in the game (AUDIT.md §3.3 called its
absence "the highest-value educational feature the game lacked"). It also travels into
the witness payload, so the published chronicle sets the player's life against the
historical one permanently.

## 6. The tuning history — why the thresholds are what they are

The matrix text has been stable since it was written; the **thresholds** have moved
twice, both times in response to measurement, and the movements are the part a future
tuner most needs to understand.

**As found (2026-08-31 audit):** `source_code` — the maximal ending — fired in **67%**
of random runs and 82% of greedy ones, `harried` in 56%, and the attested `exiled` in
1.4%. The matrix wasn't wrong; it was being fed saturated meters (synthesis pinned at 10
by Phase IV in 83% of runs) and a third inquisition that two-thirds of runs never
reached. DESIGN.md's requirement is the opposite: *"maximal success is maximally
dangerous… the historical run must be reachable and must not be optimal."*

**The order of repair mattered** (ECONOMY.md §7 insisted on it): fix the inputs first —
the meter rescale, the injected tribunals, the pressure ladder — and only then touch
thresholds. Retuning fates against saturated inputs would have tuned against garbage.

**Retune 1 — `source_code` needs the empire.** Raised to transmission ≥ 9, synthesis ≥ 8,
**and imperial ≥ 1**. The imperial clause is not just tuning: a cosmology cannot become
"the default imperial cosmology" without standing contact with the courts. 67% → 23%,
and the modal system-fate is now `scholarly` (33%) — the honest default fate of a
scholar's work: carried, copied, argued over.

**Retune 2 — `broken` reserved for exposure ≥ 9.** The pressure ladder pushed the
*median* run's final exposure to 8, so `broken` (then ≥ 8) was swallowing nearly every
lost third tribunal — including the attested shape. Losing at ordinary exposure now
falls through to `exiled`, the wandering-exile fate the record actually describes.

## 7. Does the thesis hold? Measured.

The design's acceptance test was never "nice spread" — it was the **Ibn Turka problem**:
maximal success must be maximally dangerous *to the man, not to the work*. Under greedy
play (the skilled proxy, which prefers prepared options):

- the system triumphs: `source_code` 46.5%, `scholarly` 34.5% — skilled play reliably
  makes the science immortal;
- while **~60% of those same runs end the man badly**: `informer` 26.7%, `broken`
  13.6%, `recanted` 13.4%, `fugitive` 5.8%;
- and the *safe* personal fates (`eminent`, `judge`, `unremarked`) stay under 3%
  combined, in both modes.

Playing well makes the work survive and makes the man's survival expensive. That is the
first time the game's central claim has been observed in simulation rather than
asserted, and it is the property any future retune must preserve. **Add it to your
checks:** after touching anything in this file's domain, run greedy mode and confirm
that high system-fates still co-occur with bad man-fates.

## 8. Known softness — what a future session should watch

- **`harried` is the modal man-fate (31.7%)** — the catch-basin for "won an early
  tribunal, third never resolved." Defensible (a life of waiting is a real shape, and
  the text is good), but it absorbs a wide range of runs. If injections push
  third-resolution above ~75%, revisit whether it should split into two fates.
- **`acquitted` is dead code — verified, not suspected.** Checked 2026-09-01:
  `third_inquisition = 'survived'` is written at exactly two sites in `trial_third`,
  and both co-write a flag that an *earlier* matrix entry claims first (`third_stance:
  'firm'` → `vindicated`; `betrayed_friend` → `informer`). No run can reach entry #8,
  and its title — "Thrice Tried, Thrice Standing… by argument, by patronage, by
  whatever came to hand" — describes a survival route the content never wrote: winning
  the third tribunal through patronage or maneuver rather than defiance or betrayal.
  The fix is content, not matrix: give `trial_patron_shield` (or a spent-patron option
  on the trial itself) a band that writes `third_inquisition: 'survived'` with a
  non-firm stance. Until then this is §2's warning made flesh — a fate buried by the
  entries above it, sitting in the file looking reachable.
- **`judge`, `unremarked`, `obscure` fire in under 0.5%** — near-unreachable under the
  pressure ladder, since staying at exposure ≤ 2 now requires refusing most of the
  game. Arguably correct (safety *should* cost the whole game), but the text of
  `unremarked` — "it is a kind of victory, and it tastes like one" — deserves to be
  seen occasionally. A deliberate low-profile strategy sim would settle whether it is
  reachable by intent rather than luck.
- **The exiled/broken boundary is exposure 9** — retuned once already; if the exposure
  economy moves again, this boundary moves with it. The invariant to preserve: *losing
  the third tribunal at typical exposure lands on the attested fate.*
- **Frequencies in this file go stale** the moment content changes. They are a
  snapshot, dated in the header; regenerate before citing them anywhere else.
