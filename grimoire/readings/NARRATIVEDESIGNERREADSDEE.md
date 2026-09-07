# NARRATIVEDESIGNERREADSDEE.md

**Reading, 2026-09-07.** Read: [themes/DEE.md](../themes/DEE.md) +
[themes/OCCULTOPHOBIA.md](../themes/OCCULTOPHOBIA.md) together — the charter analogy
and the historiographical wound are one subject. Against CareerSim
[ENDINGS.md](../../CareerSim/docs/ENDINGS.md) §7 (the thesis, measured),
[SYSTEMS.md](../../CareerSim/docs/SYSTEMS.md) §9, the fate matrix (`indexed`,
`exiled`, `one_hand`, `vindicated`). Persona: [NARRATIVEDESIGNER.md](../NARRATIVEDESIGNER.md).

## Claims worth building on

1. **The asymmetry is the point, not the parallel.** Same program — mathematical,
   lettrist, anagogic unification in service of one-world empire — but Ibn Turka's
   "paid off" (three patrons, an observatory, an imperial cosmology) where Dee's bids
   "all failed, and he died poor with his library destroyed" (notes/01, via DEE.md).
   Patronage ecology, not genius, decides outcomes — the Cusanus control ("no
   observatories," *Prologue*) proves it with a third case.
2. **The Bruno inversion is the emotional spine and it runs *backward* here**:
   "Dr. Littleturk has instead been historiographically burnt at the stake"
   (*Prologue*). Persecuted-then-vindicated is Bruno; funded-then-erased is Turka.
3. **The erasure is institutional, not attitudinal**: Zwemer → Glidden → Library of
   Congress call numbers; the Mafāḥiṣ "remains on the academic Index to this day";
   modern accounts "reflexively paint him as a generic Shiʿi Sufi mystic — exactly
   the charges he vehemently defended himself against" (*Meanings*, *Prologue* n.7).
4. **The period itself was not phobic**: Bayezid II's palace library filed the occult
   sciences among its treasures (Gardiner, *Treasures of Knowledge* ch. 23 — not MK;
   the misattribution catch is on the theme page). The second tribunal is modern.
5. **The sigil-summary parallel is concrete**: Ṭahawī Circle (Majlis MS 10196,
   f. 63a) as "the Islamic answer to the Hieroglyphic Monad" — a life's system
   compressed into one drawable figure (notes/01).

## Decisions

**D1 — The inversion thesis becomes an automated invariant, not a habit.** ENDINGS §7
asks future tuners to "add it to your checks" by hand. Promote it: an `invariants`
mode assertion in `tools/simulate-runs.mjs` greedy runs — (a) system-triumph fates
(`source_code`+`scholarly`) ≥ 60%, (b) among those runs, costly man-fates (ruin +
`acquitted`-and-owned) ≥ 60%, (c) clean `vindicated` ≤ 3%. Any content or threshold
change that breaks the Dee-inversion now fails a test instead of waiting for a doc
audit. This is value 5 (maximal success maximally dangerous) with teeth.

**D2 — The Later Record: the second erasure gets its own ending layer.** After the
marginalia, add 3–5 lines keyed to the *system* fate, written in a different hand
(UI: the Gloss voice, dated centuries later): for `indexed`, name the modern half
explicitly — condemned by a tribunal in his century, filed as devotional literature
in ours; for `scholarly`/`source_code`, the platform's adoption *and then* the
pith-helmeted reclassification (*Meanings*); for `one_hand`, Yazdī's copy surviving
into an archive that shelves it as mysticism. One line of hope licensed by the
record: a dissertation, five centuries on, is "the first study to point out the
utterly obvious" (*Prologue* n.7). The double erasure is currently half-built —
Attested Life covers the tribunals; this covers the libraries.

**D3 — The proto-occultophobe, playable.** Encounter `cataloguer_misfiles` (phase
2–4, PLAUSIBLE-GAP — the pattern is attested in the reception, staged early): a
bibliographer compiling a princely library files your treatise under Sufi devotion.
Options: *correct him* (scholarly+1, exposure+1 — the accurate label is the
dangerous one, which is the whole page in one choice); *let it stand* (writes
`misfiled_as_sufi` — read by `trial_*` as a **mitigator**, since the charge sheet
quotes a devotional work, and by the Later Record as the erasure's seed — the same
misreading that shields the man buries the system); *commission a corrected copy*
(requires `copyist`, time 1, Transmission+1). No option is clean. This is the
double-erasure as a dilemma instead of a lecture.

**D4 — The comparative visitor, staged not essayed.** Encounter `frankish_visitor`
(phase 3–4, court/observatory tags, INVENTED-COMPATIBLE and labeled as such on the
seal): a Genoese or Byzantine scholar asks how a mathematician came to command an
observatory — the question Dee will ask of a poorer heaven 150 years later. Options
gate on what the player has actually built (`access:observatory`, released works,
patron count), so the answer the player gives *is* their run's patronage-ecology
thesis. Writes `told_the_visitor`; the marginale for it names no names — "a
question that would be asked again, in a colder country" — keeping the parallel
felt, not asserted (the charter's own rule).

**D5 — The Circle as monad: compression has a use at the end.** `pivot_tahawi`
already draws the figure; give the artifact its Dee-parallel function: holding the
drawn Circle unlocks a `trial_third` option — *answer the panel with one figure*
(requires `artifact:tahawi_circle`, `synthesis>=7`): the life's system presented as
a single mathematical object, gradient weighted by Demonstration. Triumph lands
`third_stance:'firm'` with less exposure than oration; disaster hands the panel the
diagram — `book_in_evidence` by another road. A sigil-summary should be exactly this
double-edged: the most compressed proof is also the most portable exhibit.

## Anti-patterns (the research forbids)

- Naming Dee, Bruno, or Europe in run-time prose. The parallel is structural; the
  moment it becomes text, the game is an essay (keep it to the Later Record's
  unnamed "colder country" register, and to the site's framing pages).
- Any in-run action that repairs the historiographical erasure. The player can
  affect the *first* verdict, never the second — that asymmetry is the wound.
- Cheapening `vindicated`. Clean vindication under 2% is a feature (ENDINGS §7);
  D1 pins it.
- Europe as the advanced case. The funded ecosystem is Samarkand; the starved one
  is London. Every comparative beat keeps that direction.

## Open questions

- [[NARRATIVEDESIGNERREADSGUNTHERPIELOW.md]] — the institutional pushback, read before quoting the debate
- [[CROSSOVERDESIGN.md]] — AngelPOV already plays the Ottoman counterfactual; link the mirror panels
- [[LATERRECORD.md]] — the full text set for D2: one entry per system fate, each citation-checked
