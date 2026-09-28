# R1 — the life (dissertation SRC-610EE1D6BA, pdf pp.51–75)

Read in full, page by page: addendum A.1 Timeline (pdf 51–53), A.2 network diagram (54), §1.1 The Turka family (55–62), §1.2 Biography and intellectual network (62–74), and the opening of §1.3 (75; pdf 75 is where the assigned range stops, mid-way through the description of Nafsat I). PDF page = printed + 17 throughout.

## What was written

| block | range | count |
|---|---|---|
| evidence | EV-0001 … EV-0172 | 172 |
| claims | CL-0001 … CL-0098 | 98 |
| events | EVT-0001 … EVT-0055 | 55 |

`python scripts/build_artifacts.py --check --grep "EV-0[01]|CL-00|EVT-00"` reports no errors on these files (and the full check is clean at the time of writing). The generator is a one-off script in the session scratchpad; the JSON files are the truth.

Evidence kinds: scholarly_argument 63, context 24, apology 24, colophon 18, reception 12, chronicle 10, letter 9, hagiography 7, work 4, early_work 1. Claims: attested 73, inferential_reconstruction 11, directly_inferred 7, causal_reconstruction 4, contested 2, psychological_reconstruction 1; confidence high 17 / medium 64 / low 17. Events: date_kind context 21, conjectured 15, colophon 13, attested 4, inferred 2. Fixed points (external, cannot be prevented): EVT-0003 Temür takes Isfahan 1387; EVT-0007 Fażl Allāh executed 1394; EVT-0008 Akhlāṭī dies 1397; EVT-0009 Shāhrukh made governor of Khurasan 1397; EVT-0011 Temür dies 1405; EVT-0015 Pīr-Muḥammad murdered 1409; EVT-0023 Iskandar's revolt crushed, blinded 1414; EVT-0040 Aḥmad-i Lur's attempt 1427; EVT-0046 al-Jazarī dies 1429. Other external events (Samarkand 1369, Shāhrukh's madrasa/Yasa/control, provincial appointments, Ẓafarnāma, Azarbayjan campaign, Hurufi uprisings 1432) are `context` with `fixed_point:false` — a judgement call: they are background, or (uprisings) fall after any decision Ibn Turka could make.

## Choices a later pass should know about

* **Work-date events.** Timeline footnote 1 (pdf p.51) says only that "most" dates rest on the colophons of MS Majlis 10196 and the two Munshaʾāt, and does not say which. I gave plain-year "Completes/Writes" entries `date_kind: colophon` and the evidence kind `colophon`, with a `manuscript_colophon` layer (shaping_risk medium) that carries the transcription-not-composition caveat. Entries carrying the dissertation's own caveats are `conjectured`: "c.", "(?)", "presumably", "(or has copied)" (EVT-0005, -0006, -0013, -0014, -0016, -0019, -0024, -0025, -0030, -0033, -0034, -0042, -0048, -0050, -0052). The 1425/1426 Yazd group is CL-0096 (inferential_reconstruction, medium) because it may date copying.
* **What comes through the apologies.** Every claim resting on Nafsat I/II carries a `subject_self_report` layer, shaping_risk high, and names the ruler it was written for (Shāhrukh for I; Bāysunghur for II). Where MK cites no note for a sentence but says (pdf p.74) that the second apology is the main source for the exile period, I labelled the layer "presumably Nafsat al-Maṣdūr II" and said so (CL-0080 recall/torture, CL-0084 Ṣāʾin Qalʿa hearing and promise). Do not treat the torture or the promise of reinstatement as independently attested.
* **Family and Cairo material.** Family history (seven centuries, Khujand ancestry, brother's teaching, ten children, students) is Ibn Turka's own telling via the apologies. The Cairo discipleship comes through MK's judgement plus one letter from Akhlāṭī (correspondence layer, medium). Ibn Ḥajar's report on Akhlāṭī's house, the Niʿmatullahi report that Niʿmat Allāh Valī and Qāsim-i Anvār accompanied and instructed them, the Gāzurgāhī story of Ibn Turka and Yazdī sharing rooms on the Nile, and the Kāzirūnī Baghdad story are all `later_chronicler` layers with shaping_risk high; the Baghdad one is `contested`.
* **"Our Sayyid".** Recorded as attested/high (CL: `our_sayyid`, from his own works, cited at pdf p.65 notes 56–58) and MK's reading of it as regard kept apart as a psychological_reconstruction.
* **Age at death.** See discrepancy 2.

## Discrepancies and uncertainties (with pdf pages)

1. **Fażl Allāh Astarābādī's death.** Diagram A.2 (p.54) says 1393; Timeline A.1 (p.51) says 796/1394; §1.2 p.58 says "d. ca. 796/1394". Recorded as a counterevidence link on the claim (EV `diag_fazl`).
2. **Age at death.** MK derives birth 770/1369 from Ibn Turka's own age of 59 in Nafsat I (dated 8 Rajab 829/16 May 1426; p.55 note 2) and then gives his age at death (14 Dhū l-Ḥijja 835/12 Aug 1432) as 63 (p.74). By his own figure he would have been about 65. Not resolved; flagged in the `death` claim's mediation and the death event's basis. (This is R1's arithmetic, not a statement in the dissertation.) The related "late twenties" for the 795/1393 departure (p.63) also sits oddly with an age of 25 by the same birth year.
3. **Hijri/CE pairs in the timeline.** Hijri 808 is paired with CE 1405 (Munāẓarāt) and 1406 (Ibn Khaldūn); 813 with 1410 and 1411; 817 with 1414 and 1415; 833 with 1429 and 1430; 834 with 1430 and 1431 (pp.51–53). I kept the dissertation's own pairing on each event and did not harmonise.
4. **Simnan.** Timeline says c. 833/1429 (p.53); §1.2 says 833/1430 (p.73). Event EVT-0048 spans 1429–1430.
5. **Iskandar's Isfahan court.** Timeline p.51 has Ibn Turka a member of Iskandar's court "in Isfahan" 812–15/1409–12 (with "(?)") but p.52 has Iskandar taking Isfahan and establishing his court there only in 815–17/1412–14; §1.2 p.69 says Iskandar took Pīr-Muḥammad's place in Shiraz and "soon afterward" set up in Isfahan. The two ranges do not line up; I kept both and marked the first `conjectured`.
6. **Move back to Shiraz.** Timeline p.52 (815–17/1412–14) has Ibn Turka leave Isfahan for Shiraz under harassment and propose Sharaf al-Dīn Yaʿqūb as qadi; §1.2 pp.69–70 does not mention this and says instead that he "again attempted to retire". Recorded as a timeline-only claim, confidence low.
7. **Yazd judgeship.** Timeline p.52 says he was "given judgeship in Yazd"; §1.2 p.70 says Shāhrukh offered Isfahan and he "opted for Yazd"; neither page states that the Yazd judgeship was confirmed as an office. Kept both.
8. **Accusations in 1422 and 1426.** Timeline p.52 says the 1422 accusation was Sufi bias, the 1426 one "heresy and Shiʿi proclivities". §1.2 (pp.70–73) says the first apology answers the charge of ṣūfīgarī, that the verse praising ʿAlī and condemning ʿUmar and ʿUthmān was the Yazd pretext, and that the verse is *not* mentioned in the apology (p.72 note 89). The 1422 episode is known only through Nafsat I (1426, p.70 note 78), i.e. through the later apology; §1.2 p.73 calls the Nafsat I trip "this second trip" while p.75 says the apology answers accusations "by his enemies in Herat" — the apology is therefore reporting both.
9. **Three trials.** p.75 note 99 says the inquisitorial body "conducted Ṣāʾin al-Dīn's three trials"; none of the pages read enumerates them. Presumably 1422, 1426, and the post-Lur arrest of 1427, but that is R1's guess and is not recorded as a claim.
10. **Kātibī's nisba.** MK writes Kātibī Turshīzī (p.70); the Khwāndamīr passage MK quotes in note 81 (p.70–71) says "Katibi Nishapuri". MK does not comment on this on the pages read.
11. **Bedreddīn's death.** Diagram A.2 gives 1416 (p.54); §1.2 p.65 says "btw. 819-23/1416-20".
12. **Sharaf al-Dīn "accompanies him".** Timeline p.51 states the 795/1393 companionship flatly; the pages read support it only with hagiographical reports (p.63 note 45, p.67 note 64), and the Munshaʾāt-i Turka letter inviting him to the Hijaz is undated on the pages read (pp.63, 67). I marked the claim low.
13. **Hijaz journey.** Timeline p.52 puts a Hijaz journey in 813/1411 with a query on its purpose. The letter about departing Isfahan for the Hijaz is undated on the pages read, and §1.2 p.63 mentions Mecca only in the context of the 15 years abroad. The 1411 placement is MK's; claim low.
14. **Cairo years and Akhlāṭī.** Timeline p.51 has study in Cairo c. 795–810/1393–1408, but Akhlāṭī died in 799/1397 (p.51), so at most about four of those years overlap the master by the dissertation's own dates. Not stated by MK; R1 arithmetic, not written as a claim.
15. **Rashīd al-Dīn link.** p.56 note 6: MK says the letters showing Ṣadr al-Dīn Turka's closeness to Rashīd al-Dīn are probably inauthentic (Timurid); claim marked `contested`, low.
16. **Nephew.** Timeline p.51 says nothing of the nephew Afżal al-Dīn travelling to Samarkand; p.62 says he did. §1.2 p.62 cites no source for the Samarkand passage.
17. **Ṣāʾin al-Dīn's family in later centuries.** The great-great-grandson line and Afżal al-Dīn (d. 991/1583) (pp.60–62) are not evidence about Ibn Turka; I recorded only the nephew (contemporary, executed 1446) and the son Jamāl al-Dīn (conjectural link to 1467 events, p.59).
18. **Project docs.** I did not open `docs/BIOGRAPHY.md`, `docs/TURKA_AUDIT.md`, or other Melvin-Koushki texts, so no discrepancy against them is recorded here.

## Not read / not extractable

* pdf p.76 onward (rest of §1.3, the apologies' contents; §1.4) is outside this assignment. Claims that refer forward (e.g. al-Jazarī's enmity, "§1.3 below"; Niʿmatullahi sources, "§4.3.2") are marked as deferred, not confirmed.
* Diagram A.2 (p.54) is a figure; only the node labels and dates survive in the text layer. Arrow directions and line thicknesses are not recoverable and are not claimed.
* Letters cited by number (e.g. Munshaʾāt-i Turka letters 1, 16, 26, 28–34; Munshaʾāt-i Yazdī nos. 3, 4, 7) are read only through MK's references; their dates and texts are in his §2.1.3 and Part 2, which R1 did not open.
* The dissertation says the first Nafsat's two sections (vaṣl) follow, but that description continues past pdf p.75.

## Things the design might want (read from these pages, not designed)

* Fixed points at 1387, 1397, 1405, 1409, 1414, 1427, 1429; player margin lies in whom he attaches to (Iskandar, Yazdī, Akhlāṭī) — MK explicitly reads the Iskandar tie as a later liability (p.69, claim `liability`, a causal_reconstruction).
* The Yazd choice (p.70) is a real fork with a stated reason (stability) and an offered alternative (Isfahan).
* The verse praising ʿAlī (early_work evidence): whether Ibn Turka owned it is not stated on the pages read.
