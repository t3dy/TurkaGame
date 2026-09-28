# R6 — doctrine (RESEARCHER pass)

Blocks used: EV-1000..EV-1139 (140), CL-0500..CL-0599 (100, block full), REC-0100..REC-0110 (11).
Validation: `python scripts/build_artifacts.py --check --grep "EV-1[01]|CL-05|REC-01"` prints no errors (whole-corpus `--check` also clean).

## Pages opened (all in this session)

Dissertation SRC-610EE1D6BA: pdf 176-187, 234-235, 332-346, 347-358 (the assigned ranges), plus, beyond the assignment,
pdf 126-127 and 173, 175 (the R. Shaqq-i Qamar's catalogue entry and the work lists), and **pdf 468-479**
(conclusion, and MK's translation of the R. Shaqq-i Qamar, Part 2, printed pp.451-462).
Prologue SRC-2DC96A9F73: pdf 8-11.

Why the extras. Chapter 6 reports only the *names* of the seven groups, not each group's reading of Q 54:1; the
readings themselves are in the translated treatise (pdf 471-479). Every per-tier artifact therefore cites the
primary text as MK translates it, and the ch.6 pages only for the list. The three Globes (Planet/Pearl/Peach) and the
"ascent-descent-ascent" phrase are **not in the dissertation pages assigned**; they are in the Prologue (pdf 8-9), so
those claims cite SRC-2DC96A9F73.

## What was built

- Each of the seven tiers has its own claim with its own evidence: tier 1 CL-0503, tier 2 CL-0504, tier 3 CL-0505,
  tier 4 CL-0506, tier 5 CL-0507, tier 6 CL-0508, tier 7 CL-0510 (evidence EV-1028..EV-1037 for the moon readings,
  EV-1038..EV-1045 for the readings of "the Hour", with the hour claims at CL-0514..CL-0521). Each names the group and
  its reading of Q 54:1 as the translated treatise gives it.
- The twist: CL-0511 (level seven is peculiar to the present time, ruled by an auspicious conjunction, **attested**),
  CL-0512 (communicated to him by Akhlati, attested at medium), CL-0513 (tied to jafr, attested),
  CL-0522 / CL-0523 / CL-0524 / CL-0525 (MK's reading that level seven is not simply the Imams: `inferential_reconstruction`),
  with REC-0100 (the plain deference reading, rival) and REC-0101 (MK's reading) linked as alternatives.
- The literal ranking a game can put to a player: CL-0501, "lettrists above the peripatetic philosophers and below the
  seventh level of the men of might and vision" — **attested**. The interpretive question of what level seven contains is
  kept separate (CL-0522..0525, REC-0100/0101). A game should not fuse them.
- Date of the hierarchy: CL-0534 (colophon 18 Rabi I 829, may be copying), CL-0535 (same year as Nafsat I, per MK's footnote),
  CL-0536 (`undeterminable`: composition or copying is not settled).
- Lettrism vs philosophy: CL-0538..0561 (universal science; only the letter encompasses being and non-being, CL-0543;
  coincidentia oppositorum, CL-0544; the four levels of light with the intellect fallible, CL-0546; the two kinds of
  lettrist, CL-0547; theory over letter magic, CL-0549; contested classifications of Ibn Khaldun / Ibn al-Akfani / Amuli, CL-0552).
- The three registers and the Mafahis: CL-0562..0586 (three forms, four sections, counts, written over spoken, why,
  dates, sources, diagrams, the Prologue's Globes).
- Prisca sapientia and progress: CL-0587..0599; REC-0103 (progress or restoration), REC-0104 (perennialist rival).

## Duress rule and evidence kinds

Everything from the R. Shaqq-i Qamar, R. Anjam, R. HurUf, R. Suʾl al-Muluk, R. al-Inzaliyya, Madarij and the Mafahis
is `work` (HELD kinds); the R. Shaqq-i Qamar was written the **same year as the first apology** (MK p.315 fn 1) but
is a doctrinal treatise, not an apology, and carries no `subject_self_report` layer. One doctrinal statement rests on
an apology and is typed accordingly: EV-1089 / CL-0572 (Ibn Arabi and Hamuvayi reached the highest walaya because they
alone answered Tirmidhi's 157 questions — cited by MK to Nafsat al-Masdur I, 186; `apology`, `subject_self_report` high).
Treat CL-0572 as "what he told Shahrukh", not "what he held".

## Discrepancies and uncertainties (with pdf pages; none resolved)

1. **Date of the R. Shaqq-i Qamar.** p.332 (printed 315): written "at the beginning of 829/1426". pdf 173 and 175: "before 829/1426".
   pdf 479 (translation colophon): "18 Rabi I 829 [28 January 1426]", footnote: may instead date the *copying*.
   pdf 126 (manuscript list): MS Majlis 10196 copied "18 Rabi I 829/27 February 1426". **The same day-and-month is converted to two
   different Gregorian dates a month apart (28 Jan vs 27 Feb).** Also, 1 Muharram 829 fell in late 1425, so "beginning of 829"
   is not "1426" strictly; the dissertation uses 829/1426 loosely throughout. CL-0536.
2. **Level two of the hierarchy.** pdf 332 (ch.6 list): "dialectical theologians (mutakallimun)". pdf 473 (translated
   treatise): "the philosophers and dialectical theologians of Islam". pdf 335 fn7 says the Madarij version collapses theologians and
   philosophers into one group. Recorded as is (CL-0504).
3. **Bracketed insertion in the translation of level seven.** pdf 476: "[This dignity belongs to the Imams alone]" is MK's
   bracketed addition, not marked as Persian. The argument that level seven is "only the Imams" leans on that sentence;
   CL-0510 carries the caveat.
4. **Who told him of the conjunction.** pdf 333-334 (ch.6): MK says the fact that the level's manifestation belongs to the
   present, marked by a celestial conjunction, "has been communicated to him by his teacher Akhlati". pdf 479 (translation):
   "As our Sayyid ... has made clear" attaches to a *different* statement (what the verifiers could not deduce). And the
   Prologue (pdf 8) dates Akhlati's death to 1397, so a communication about the "present time" of 1426 must be an old
   prognostication or the conjunction an earlier one. **Neither the conjunction nor the timing is identified on any page read.** CL-0512.
5. **Mafahis date.** pdf 177: "produced ... between 817-25/1414-22 [in] Shiraz and Yazd", together with the Fusus commentary;
   pdf 173 list: Fusus commentary 814/1411, Mafahis 823/1420; pdf 351: completed 823/1420, "perhaps in Isfahan or Yazd", two
   colophon dates four months apart (11 Aug or 25 Dec 1420); revised 828/1425 — but fn 19 (MS Majlis 10196 marginal correction) says 828 is
   the *copying* only, while pdf 352 reports an audition note in MS Landberg 146 that the author proofread and annotated it that year. CL-0560 / CL-0575 / CL-0576.
6. **Order of the three forms of the letter** differs by witness: R. Hurūf (pdf 178) written, spoken, mental; Mafahis sections
   (pdf 352) mental, written, spoken; Davani (pdf 353) mental, oral, written; *On Letters*, as quoted in the Prologue (pdf 11 fn34) sight (written),
   heart (mental), hearing (spoken). And which faculty carries which form: R. Hurūf ties the numerical/mental form to the heart (178);
   Davani ties number to the spirit, oral to the heart, written to the body (353). CL-0579, CL-0580.
7. **MK's own ordering of the three Globes (Prologue).** p.8: "Pearl-Peach-Planet" with "Written-Spoken-Mental"; p.9: "Or rather,
   Planet-Pearl-Peach"; p.10 (Luṭf Allah mosque): "Pearl-Peach-Planet"; p.11 fn34: "Pearl-Planet-Peach". Only p.9 matches the dissertation's section order. CL-0584.
8. **Ascent/descent vs the dissertation's own description.** Prologue p.9 reads the Mafahis as up (Mental), down (Written),
   up again (Spoken, "Paradise"); the dissertation (pdf 356-357) describes the spoken form as the "final level of descent" through the
   chain of being and Davani calls written the "low letters"; the Prologue (p.10) reconciles this as ontologically low, epistemologically
   high. These read differently. Typed `inferential_reconstruction` (CL-0582, CL-0583, CL-0585; REC-0106).
9. **Prologue says he "declines to give a book plan"** (p.8) while the dissertation (pdf 352) says the Mafahis opens with three ways of
   pursuing the science (not a book plan). Compatible, but the Globes-as-plan reading is MK's and is flagged (REC-0106/0107).
10. **The doctrine of the letter and non-being** appears as a dissertation paraphrase in three places (pdf 180 fn12, 348, 355). All
   are MK's paraphrase of the Persian/Arabic; I did not read the Mafahis text itself (its translated introduction is at
   §7.3.1 of the dissertation, beyond this pass).
11. **Comparative apparatus.** ch.6.3-6.4 mixes MK's own essayistic material (entropy/complexity, Newton, Bacon, Singularity, Nietzsche,
   Leary) with attributions to Ibn Turka. Only the sentences that attribute something to Ibn Turka were written up, with `inferential_reconstruction`
   where no passage of his is cited (CL-0596 teleology, REC-0110 low).
12. **Letter-sums in the translation.** pdf 477: "AL S A = 92" and "LF A M A F YM A = 283" are garbled in the text extraction; not verified. Recorded as "printed as".
13. **The R. Shaqq-i Qamar's frame** ("upon a day ... traveled the length and breadth of the engendered realm") is a literary device; not evidence of an event (CL-0537).
14. **Total of inquiries.** pdf 354 gives 7 + 36 + 21 + 18 + 74 = 156; the same page says the work runs about 150 folios. Not written up as a claim.

## Questions for the design layer (not artifacts)

- Which claims are safe to put to the player as "let it stand or refute it": every `attested` claim above, especially CL-0500,
  CL-0501, CL-0503..0510, CL-0538, CL-0543, CL-0544, CL-0546, CL-0562, CL-0567, CL-0587 (the last is `directly_inferred`).
- Every `inferential_reconstruction` (the twist, the Globes, teleology, "unprecedented millenarian progress", raqam/qamar-to-cut-letters) should be
  presented as MK's reading, not as a fact; the deference reading (REC-0100) is the rival MK himself names.
- The game must not score "the seventh tier includes the lettrists" as correct; per project rule 6, it is one lens.

## Not read

- The Persian-language treatises' texts in Part 2 (pdf 480 onward, R. Hurūf, R. Anjam, R. Suʾl al-Muluk translations), and the translation of the Mafahis introduction (§7.3.1). Everything about them is MK's chapter-level paraphrase.
- Ch.4.3.3 (Hurufis) and §5.4 (the prognostication), both cross-referenced.
- pdf 359 onward in ch.7 (§7.3 translations).
