# LOG.md — Append-Only Record

## [2026-09-02] founding | The grimoire established
- Charter (GRIMOIRE.md), persona (NARRATIVEDESIGNER.md), INDEX, this LOG.
- 26 theme pages on Melvin-Koushki's historiography, grounded in a fresh text-cache
  of the four locally held MK papers (Prologue to Pythagorean Renaissance; The Occult
  Court; The Meanings of Islamic Magic; Dr Dee's Ottoman Adventure [scan+notes]) plus
  the portal corpus. Two source-hygiene catches recorded in-page: the portal's
  "books-on-occult-sciences" file misattributes Gardiner's Treasures-of-Knowledge
  chapter to MK; notes/01's Murad III date needs conversion-checking.
- Convention set: honesty labels (⚠) mandatory; readings/ format defined; wanted
  pages tracked in INDEX.

## [2026-09-07] readings | The first full batch of design readings
- Five new readings joined PATRONAGE (2026-09-05) to complete the commissioned six:
  GRIMOIRESASCOURTLYMANUALS (cipher/index axes, keys as entities, re-editions),
  DEE (inversion invariant, the Later Record, cataloguer + Frankish visitor),
  GEOPOLITICS (the third answer, state-scale artifacts, succession license),
  QUINTET (specialization foreclosures, taksīr shown-work, the exile science),
  CAREERSIM (capstone: missing cast incl. Bisṭāmī, mentor/student arcs, ranked ten).
- INDEX readings section populated with all six. New wanted pages accumulated:
  REEDITIONS, MANUALINDEX, LATERRECORD, CONFESSIONALTRANSITION, PROGNOSTICON,
  APOCALYPTICRIVALS, SELENOCENTRISM, TAKSIRPUZZLE, KHALDUN, BISTAMI (promoted),
  CREEDS (promoted).

## [2026-09-07] implementation | The ranked ten, first execution pass
- Shipped from the readings: #1 the third answer (`structural_answer` on court_dynasty,
  `structural_window` on court_razm_date, `prognosis: true` markers + a lint that every
  prognosis encounter offers the number, the refusal, and the reframe); #10 the
  Dee-inversion invariant (`tools/test-thesis.mjs`, 800 greedy runs, NaN-guarded after
  the harness itself was twice corrupted by shell backslash-mangling); #3 the Later
  Record (career.js `laterRecord()` keyed to system fates, rendered in the ending and
  carried into witness payloads); DEE D5 the monad option (`one_figure` at trial_third);
  #9 `sand_in_exile` (geomancy's exile payoff, 3 options); #6 the taksīr demonstration
  (`taksir_answer` on court_rival_astrologer, ʿAlī=110=alif with the sums printed);
  #2 contract epistemology (`cipher_level`/`proof_standard` on all 8 contracts, spoken
  on the promise button — the Durmish Khān clause).
- Queued, recorded here so nobody re-derives: PATRONAGE D2 (three retainers) / D3
  (exit verb) / D4 (vizier_countermagic); GEO D2 (state artifacts) / D3 (refusal as
  reputation event) / D4 (student_asks_the_future); DEE D3 (cataloguer_misfiles) /
  D4 (frankish_visitor); QUINTET D1 (systematized foreclosures) / D4 (limiya ladder
  rungs 1 and 4); capstone #5 (Bisṭāmī joins the cast).
- Measured after: 0 unreachable gates (33 quintet gates now), thesis test green,
  fate spread intact (no man-fate >27%, vindicated 4.0%), sand_in_exile fires 3.9%
  (exile-road capstone; acceptable, noted).

## [2026-09-07] add | themes/TWINSISTERS.md — kabbalah and lettrism as one structure, twice

- Written while distilling the letter-powers reference. Reading al-Būnī (via Gardiner
  pp. 56–57) and the Sefer Yetsirah (via Segol pp. 41, 72, 91) side by side surfaced
  three structural parallels neither source states as a parallel, because neither is
  comparative: **twelve letters are twelve human faculties in both** (al-Būnī's
  Avicennan sensorium vs the SY's actions-and-passions); **both mediate through a
  middle tier of twelve** between a seven above and the letters below; and **both
  partition space exhaustively** — the SY as a cube of six directions plus a centre
  (SY15–16, SY38), al-Būnī as a wheel of 28 mansions with 14 above the horizon and 14
  below at any moment.
- Differences kept, not smoothed: the SY has **no earth element**; the Ikhwān assert
  correspondences where Ibn Turka demonstrates them; the medieval golem is a cosmic
  instrument while *Boon for the Khan*'s chimera is a material with tabulated
  properties.
- Checked, not asserted: al-Būnī's "fifteen letters have diacritical points and
  thirteen are without" (Varisco p. 502) matches `v2/data/letters.json` letter for
  letter.
- Operative payoff recorded on the page: the twelve-faculty middle tier as a
  dependency graph (unbuilt, strongest available); seven doubles = six faces + centre
  (directly implementable in a cubic-cell engine); the rotating half-alphabet as the
  turn scheduler the roguelike and CareerSim both lack. Anti-pattern named: do not
  merge the two traditions into one syncretic system — ship them as two rulesets on
  one engine, which is what the GoldenDawnBlocks vendoring already is.
- Companions written the same day: [../LETTRISMRESEARCH.md](../LETTRISMRESEARCH.md)
  (source-by-source digest with the extraction table) and [../PIPELINE.md](../PIPELINE.md)
  (the five roles and their handoff contracts).
