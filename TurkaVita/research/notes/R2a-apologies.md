# R2a — the apologies and the trials (dissertation pdf pp.75-94, printed 58-77)

Source: Melvin-Koushki, *The Quest for a Universal Science* (Yale 2012), SRC-610EE1D6BA, §1.3 "Ibn Turka's
apologies" (printed 58-69) and §1.4 "Late medieval Shiʿi-Sunnism or imamophilism" (69-77). I also opened
**pdf p.25 (printed 8)** and **pdf p.32 (printed 15)** because that is where MK states the duress warning, names the
three trials and lists the four apology texts; nothing else outside the range was read.

Ids written: **EV-0200..EV-0365** (166), **CL-0100..CL-0195** (96), **REC-0001..REC-0015** (15). Build check: clean.
Generator (not committed, scratch only): the JSON files are the truth.

## What the apologies are (all page-cited; everything is MK reporting Ibn Turka)

- **Nafsat al-Masdur I** (829/1426, for Shahrukh; pdf 75): introduction + two *vasl*. MK gives a long paraphrase
  (pdf 80-85) which is the source of nearly every "apology" evidence artifact: autobiography and credentials (80),
  the enemies and the three defences (81), the astronomy/astrology and *Kashshaf* hypocrisy arguments (81), the
  three madhhabs and the Sufi's two faults (82-83), the nine hadith (83), the Companion sayings (83), the Sufi
  authorities and Parsa (84-85). Each argument is its own EV so a game can build the apology out of its real moves.
- **Nafsat II** (for Baysunghur; pdf 77-79): angrier, more autobiographical, about scholarly fame not mysticism; the
  ten children, exile, Jazari, imposter Sufis, Qasim-i Anvar (identification is MK's "almost certainly"),
  dismissal of Hurufism.
- **R. I'tiqadiyya** (pdf 77, 79): Ash'ari self-presentation; admission of youthful "suspect sciences" (hadith
  "learn even sorcery"); comparison with Ghazali and Razi.
- **R. I'tiqadat** is named only in a footnote at pdf p.32 (with the I'tiqadiyya, as one of "the creedal tracts").
  Nothing on the pages read says what it argues.

## What MK says the apologies do NOT show (pages)

- pdf p.25 (printed 8): the image in the apologies, "produced under great duress, is hardly reflective of his
  primary concerns" (EV-0247; verbatim quote checked by the build; the p.32 caution is EV-0248, the Akhlati omission EV-0249; the claim is CL-0167, the reconstruction REC-0002).
- pdf p.32 (printed 15): "treated with caution as sources for his own views", given the duress and his need to
  distance himself from Sufism and Hurufism; Ash'ari self-presentation, Ghazali/Razi comparison and appeal to
  Parsa's orthodoxy are "to be taken with several grains of salt".
- pdf p.80 (fn.113): omission of Akhlati; the apologies "are not meant to reflect his own intellectual project but
  the predilections and anxieties of Shahrukh".
- pdf p.85 (printed 68): tone "shrill" and "facile"; "a mirror of Shahrukh's strident Sunnizing program";
  Ibn Turka "pointedly declined to identify as Sufi".
- pdf p.93-94: the Ash'ari/anti-Shi'i self-portrait is "a self-misrepresentation so exaggerated as to be cartoonish".
- **One tension MK does not resolve on the pages read:** on p.75 the apologies are "the primary source of
  information about his life" and "a uniquely candid look" at the politics; on p.25/32/85 they are not reflective of
  his concerns. These are compatible (candid about the machinations, shaped about the beliefs) but MK never says
  it in one sentence. CL `apologies_primary` and `apologies_show` record it.

## Points where the corpus and the brief do not line up (no winner picked)

1. **Nafsat II date.** Main text (pdf 77): "some five years after the disastrous events of 830/1427". Footnote 105
   (pdf 77): Ibn Turka says five years since exile and nine months since the promised review, so "sometime between
   ca. 832-35/1429-32". Five years after 830/1427 is about 835/1432; the footnote's range starts at 832. Kept as an
   estimate (CL date claim is `inferential_reconstruction`).
2. **R. I'tiqadiyya date.** pdf 77 calls it a "companion tract" to Nafsat I (1426); pdf 79 calls it "among the last
   of his writings". Recorded as an `undeterminable` claim. The brief's "companion creed I'tiqadat" is not what p.77
   says: p.77 names the I'tiqadiyya as the companion; the I'tiqadat appears only in fn.44 on p.32.
3. **Which text is the "creed statement" at court?** Nafsat I (pdf 80) says he submitted a *creed of adherence to
   the Sunna and Jama'a* on his second visit. MK does not identify it with the I'tiqadat or the I'tiqadiyya on
   these pages. Not identified in the artifacts either.
4. **Two journeys vs three trials.** Nafsat I says he twice made the journey Iraq to Khurasan (pdf 80). MK says he was
   thrice summoned to Herat, winning ca. 825/1422 and 829/1426 (pdf 32). MK does not align the two journeys with
   the two early trials on these pages. Also the first trial date carries "ca.". Note also that Nafsat I is *itself*
   the defence for the 829/1426 summons, so the "second visit" with the creed statement presumably preceded it,
   but MK does not say.
5. **Nafsat I vs I'tiqadiyya on his training** (researcher's observation, not MK's): Nafsat I says fifteen years of
   only tafsir/hadith/usul/fiqh; the I'tiqadiyya admits early exploration of suspect sciences. CL `itiq_vs_n1`,
   marked `directly_inferred` and flagged as the researcher's (CL-0164; the dating tension is CL-0165, REC-0015).
6. **Where the Ash'ari self-presentation comes from.** pdf 77 attributes it to the I'tiqadiyya ("standard-issue
   Ash'ari"); pdf 93 says he presents himself so "even in his stridently Sunni apologies" and pdf 93 fn.155
   gives Nafsat I pp.174-5 for the equivalency. Both may be true; the artifacts keep the source of each statement.
7. **Lewisohn.** MK calls his "insistence on taking the apologies at face value" "well-taken" (p.32 fn.44) and also says he
   "unfortunately misrepresent[s]" Ibn Turka as an orthodox Sunni Sufi (p.25). I have recorded both without
   smoothing them; Lewisohn's own article was not read.
8. **Death date flagged by MK.** MK marks "[sic]" after Lewisohn's title ("d. 830/1437") and Corbin's ("ob. 830/1427")
   (pdf 85 fn.121, pdf 86 fn.125). Both dates are MK's implicit correction of others' death-date; I have not
   used or checked either. Nafsat I's "59 lunar years" in 829/1426 (pdf 80) is consistent with a birth about 770/1368-9
   but I did not derive a birth date.
9. **Abu Hanifa and the *Hidaya*.** MK's rendering (pdf 80) has Ibn Turka citing Abu Hanifa "in his Hidaya". The
   *Hidaya* is generally Marghinani's; this is general knowledge, unchecked, and I reported it as MK renders it.
10. **Zarrinkub.** MK cites Zarrinkub only for Amuli's remark that Sufism is Shi'ism (pdf 88 fn.134), not as a reading of
    Ibn Turka, so no REC was written for him. Corbin and Aubin are reported in range (pdf 86); a Corbin REC exists.
11. **Dee epigraph** (pdf 75). It is MK's own comparison, kept to the historian's layer. The page asserts no contact.
12. I did not compare the apologies material against `docs/TURKA_AUDIT.md`, `docs/BIOGRAPHY.md` or the older
    project docs; only the corpus pages above.

## Artifacts to know about

- **Duress rule.** `evidence_kind` is `apology` (84), `creed_tract` (5); MK's own commentary on them is
  `scholarly_argument` (45); external context is `context` (20); what a work of his argues is `work` (9: Mafahis
  passages, Sharh al-Nahj, Sharh-i Nazm al-Durr, R. Anjam, and Afzal al-Din's Tanqih, the last labelled MK's
  "cf." note); early reader's marginal note and Qunduzi are `reception` (2); Dawlatshah `chronicle` (1).
- Every claim that runs through Nafsat I/II or the I'tiqadiyya carries `subject_self_report`, `shaping_risk: high`.
  Claims on his own works carry `subject_self_report` at `medium` (they are not addressed to a judge, but they are
  MK's summaries of manuscripts I did not open).
- **Section 1.4 evidence** mostly has kind `context`/`scholarly_argument`; the works passages (Sharh al-Nahj, Sharh-i
  Nazm al-Durr, Anjam, Mafahis) are `work` and are the parts of this range that *can* show what he held.
- REC list: Lewisohn (as reported), MK duress reading, Corbin/Aubin, Tihrani taqiyya, Judi-Ni'mati, MK Shi'i-Sunni,
  Quiring-Zoche/consensus, staged attempt (Binbas via MK, low), the equivalency (three readings), the Parsa strategy,
  the Akhlati omission, purpose of the imposter episodes, Qasim-i Anvar identification, the inquisitorial body,
  and the researcher's I'tiqadiyya-date observation (flagged as not MK's).
- Never contact with a European figure asserted: the Dee epigraph is recorded as MK's comparison only.

## Not read

Nothing in pdf 75-94 was unreadable. Not opened: the Persian/Arabic originals of the apologies (MK's paraphrase is
the only witness), Lewisohn's and Morio's articles, and §2.1.3.1 (the children), §7.2 (Zamakhshari in the Mafahis)
and §8.3 (the translation of the final section of Nafsat II), all of which MK points to.
