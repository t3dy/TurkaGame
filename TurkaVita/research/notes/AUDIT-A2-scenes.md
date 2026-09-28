# AUDIT-A2 — the 36 scenes, read for what the player will read

Auditor pass (AGENTS.md). Read-only: no scene was edited. Method: every scene dumped with its invariants, prose,
labels, feedback, effects, rulings, composer and sorter beside every claim, evidence and reconstruction it cites
(`find.py --show`); doubtful sentences checked against the evidence text and the researcher notes. State keys were
checked by script (every `requires*`, every `life.*` set, every cost line against its effects). Categories are those
of the brief: 1 INVENTED, 2 HEDGE DROPPED, 3 WRONG LABEL, 4 WRONG ATTRIBUTION, 5 FORBIDDEN/POSITION, 6 STATE, 7 VOICE.

Verdicts: **FIX** = a sentence or label the player will read states something the cited artifacts do not support (or
contradicts another scene); **MINOR** = wording, a citation gap, or an unflagged inference; **CLEAN** = nothing to change.

Things checked and found sound (so the lead does not re-open them): `Zaydī` (EV-0849), `winters in Natanz` (EV-0047),
`closed the taverns` (EV-0019 / EVT-0018), Yazd quiet versus Isfahan proactive (EV-0141), pen name ʿAlī (EV-0441),
`the Iʿtiqādāt is lengthy` (EV-0463), `Shāfiʿī` (CL-0006), `Sufi poet` as a modern label (CL-0808), the fifteen years and
the brother's insistence as Ibn Turka's own account (EV-0090), the sorter key against the dates in the notes, every
`requires_min` gate is reachable, the historical path pays for every gate it needs. `second trial` in SCN-0304 is Melvin-Koushki's
own footnote wording (CL-0535), so it is attributable rather than invented. No scene puts Ibn Turka in contact with a European figure.

## Cross-cutting notes (not per scene)

- **`life.*` flags are set in 23 places and required nowhere.** Harmless to the linter, but the convention is inconsistent:
  when a counterfactual "returns you to the record" some set the record's value (`life.route`, `life.training`, `life.seat`,
  `life.inheritance`) and some set the alternative (`life.master: bulqini` in SCN-0103 B; `life.recall: refused` in SCN-0309 B;
  `life.hierarchy: three_tier` in SCN-0304 C). Pick one; if the final summary ever reads these, the second kind will misreport the life.
- **Feedback length.** The brief says 2-3 sentences; 0103 A, 0106 A, 0205 A, 0206 A, 0309 A, 0401 A, 0405 A run to 5-6 long ones.
- **Pipeline leaks in player text**: "A researcher also noticed" (0106 A), "The game's researchers note" (0307 S1c),
  "Researcher's collation" (0502 invariants).
- **Dee.** SCN-0601 and SCN-0605 name John Dee (CL-0101). `../CLAUDE.md` rule 11 allows this in the historian's layer and each text says
  no contact is asserted; `docs/DESIGNER_BRIEF.md` says "Do not mention Dee/Cusa/Bruno". The two documents disagree; the lead should choose. Not counted as a finding.
- **Duplicate act.** SCN-0309 A and SCN-0401 A are the same act (write to Fīrūzshāh, thank, ask him to press the case and restore the stipend).
- **Weekday.** SCN-0407 says "Monday, 14 Dhū l-Ḥijja 835, in Herat: 12 August 1432". 12 August 1432 was a Tuesday (Julian) or a Sunday
  (proleptic Gregorian). The pair comes from the source (CL-0087); worth a hedge ("Melvin-Koushki gives Monday"), not a fix.

---

## ACT I — hostage

### SCN-0101 — FIX
1. **[3 WRONG LABEL]** Choice A is `documented` and `historical: true`, but prose P3 says
   "No source says what you did with these years." and A's own feedback says "he infers it, and no dated source says so."
   Its basis CL-0020 is `directly_inferred` (Melvin-Koushki's inference), and the brother's public silence in the label
   ("leave deeper questions unspoken in public") is Ibn Turka's own statement to Shāhrukh (CL-0010, `subject_self_report`, high).
   **Should be:** `reconstructed` (`score.biography` +1), not historical, resting on CL-0020, or the scene made `unrecorded`.
   Wording: "Stay under your brother's teaching, as Melvin-Koushki infers you did, and master the Sunni schools of law."
2. **[2/citation]** Invariant 2: "Melvin-Koushki explains the sparing by Temür's policy of collecting eminent scholars and artists…" cited to CL-0018.
   The policy is CL-0019 (`causal_reconstruction`). The hedge is present; add CL-0019 to `based_on`.

### SCN-0102 — MINOR
1. **[3]** Choice A (`documented`, historical): "Go abroad as your brother urges, by way of Mecca toward Cairo, and take Sharaf al-Dīn Yazdī with you as the timeline has it."
   The Yazdī clause rests on CL-0023 (`attested/low`, "give no source for the departure"); the order "Mecca toward Cairo" is in no claim (CL-0024 says only that he was in Mecca on his travels).
   **Should be:** "Go abroad as your brother urges; the sources place you in Mecca and in Cairo." Keep Yazdī as a separate, `reconstructed` option or drop his +1 from a documented choice.
2. **[2]** P1: "About six years after the fall of Isfahan you are made to leave." 1393 is `c.` and conjectured (CL-0022). **Should be:** "Perhaps six years after… (Melvin-Koushki's 'c. 795/1393')."

### SCN-0103 — MINOR
1. **[3/4]** A feedback: "The record has both: Bulqīnī for hadith, Akhlāṭī as master, and a place in the majlises."
   The majlises are CL-0027 (`directly_inferred`, from Ibn Turka's 1431-32 apology, "implies"), and the Bulqīnī discipleship has no source (invariant 1 says so). No duress caveat here.
   **Should be:** "Melvin-Koushki has both teachers, and reads your second apology, written to Bāysunghur, as implying you sat in the majlises."
2. **[2]** B feedback: "the sources put him in the Sayyid's house". The house is CL-0600 (Gāzurgāhī, a later tazkira; MK says its death date is wrong). Add "(a later tazkira)".
3. **[6]** `life.master: bulqini` (B) while the feedback says the game "returns you to the record, where you have both". Set `akhlati` or nothing.
4. **[citation]** A feedback cites MK's "changed you from a competent scholar… into an occult philosopher" (CL-0038, `causal_reconstruction`); hedged correctly ("which is his reading"), but CL-0038 is not in `based_on`.

### SCN-0104 — MINOR
1. **[1]** P1: "You sit in the majlis at Barqūq's court, where Akhlāṭī is the resident wonderworker." Nothing places Akhlāṭī at this undated majlis (CL-0028, CL-0032). With the 1382-90 dating (CL-0740) it would precede the 1393 arrival.
   **Should be:** "…at Barqūq's court, where, on Melvin-Koushki's account, Akhlāṭī served as wonderworker." or cut.
2. **[2]** P3: "on the second dating the majlis would fall before the timeline's arrival in Cairo, about 1393." The arithmetic is the game's, not MK's (compare SCN-0103, where the same kind of sum is labelled "ours"). Add "(our arithmetic)"; cite CL-0740.
3. **[6]** Choice B effects `court.jazari +1` while its cost line and feedback say "al-Jazarī still becomes your enemy" and "the game does not let praise buy peace". Drop the +1 (keep `press.enemies +1`).

### SCN-0105 — FIX
1. **[1 INVENTED]** P2: "Shaykh Bedreddīn, a judge like you, is also said to have been Akhlāṭī's disciple in Cairo…". In 1397 Ibn Turka is not recorded as a judge (CL-0115: the judgeship "passed from the brother to Ibn Turka" on his own claim, undated). CL-0041 / EV-0111: Bedreddīn was a judge whose "profile matched Ibn Turka's".
   **Should be:** "Shaykh Bedreddīn, a judge and intellectual whose profile Melvin-Koushki says matched yours, is also said to have been Akhlāṭī's disciple in Cairo…". Add CL-0041.
2. **[1]** Dramatic question: "what he taught you lives only in you and in the brethren he addressed you among." In no claim (CL-0039 is a letter's address). **Should be:** "Akhlāṭī is dead. How do you present what you inherit from him?"
3. **[2]** Invariant on CL-0035: "These writings are all later than 1397: the R. Ḥurūf is dated 1414, the Mafāḥiṣ 1420." The 1420 is a contested and possibly copy date (CL-0216); "all" is our inference.
   **Should be:** "…the R. Ḥurūf (1414 on Melvin-Koushki's date) and the Mafāḥiṣ (1420; the date may record copying)".

### SCN-0106 — FIX
1. **[2 HEDGE DROPPED]** Dramatic question: "The man who took Isfahan and moved your family east is dead, and you are still abroad." P1: "In 807/1405 Temür dies at Utrar. You are still abroad."
   CL-0051 is `inferential_reconstruction`, `low` ("no source cited", EV-0131) and is not in A's `based_on`; only the feedback hedges it.
   **Should be:** "…and, on Melvin-Koushki's reading, you are still abroad."
2. **[1/7]** P1: "Behind you are two works." The Munāẓarāt-i Khams is dated Muḥarram 808 (June-July 1405, CL-0218), after Temür's death (Shaʿbān 807). **Should be:** "The timeline dates two works to these years."
3. **[7/4]** A feedback: "A researcher also noticed that he says the Naẓm al-Durr commentary refers to works of 1411 and 1420, which sits oddly with 1404; the dissertation does not comment."
   Pipeline voice, and "he says" blurs whose observation it is (CL-0323 is R4's, not MK's). **Should be:** "The commentary is said to refer to works of 1411 and 1420, which sits oddly with 1404; the dissertation does not comment (the game's observation)."

## ACT II — courts

### SCN-0201 — MINOR
1. **[1]** B feedback: "Melvin-Koushki has you summoned and made a member of the court, and the honours and letters that follow presuppose it."
   CL-0411 records that no letter to Pīr-Muḥammad survives. Cut "and letters".

### SCN-0202 — MINOR
1. **[citation]** P2: "his later papers do not agree on whether Iskandar took up lettrism at your instance or commissioned you." Sound (CL-0719, `analytical_construct`) but uncited in the scene; add CL-0719, and CL-0059 (used in A feedback).
   `documented` A rests only on CL-0054, Ibn Turka's own 1431-32 plea; the caveat ("Note whose word it is") is present, so no relabel.

### SCN-0203 — CLEAN
Hedges intact throughout (colophon vs timeline, `for pilgrimage?`, presumed place, CL-0630 as a causal reading). Citation-only: add CL-0062 (Hijaz, `low`) and CL-0310.

### SCN-0204 — FIX
1. **[3 WRONG LABEL]** Choice C is `documented`: "Write to Iskandar himself, with your regard and your regret that you cannot call in person."
   Its basis CL-0410 is `directly_inferred` and the feedback concedes "Its addressee is Melvin-Koushki's presumption". **Should be:** `reconstructed` (or `contested`); bio +1 stays.
2. **[6 STATE / 1]** C feedback: "It also ties you more openly to Iskandar in the last months before Shāhrukh comes west." No `press.exposure` in C's effects, and "the last months" is invented precision (letters undated; CL-0410 says only "before Shāhrukh's western campaign of 817/1414").
   **Should be:** add `press.exposure: 1`; "…in the period before Shāhrukh's campaign of 817/1414".
3. **[1]** B feedback: "No letter of this period asks anything for you." A universal negative over letters whose dates are MK's conjecture (CL-0401). **Should be:** "None of the letters Melvin-Koushki places near ca. 816/1413 asks anything for you; letters 4, 6 and 12 ask for Yaʿqūb (CL-0414, CL-0415)."
4. **[1]** A feedback: "the tie is worth more than it looks." Unsourced editorial. Cut.
5. **[2]** Dramatic question says plainly "making Isfahan hard to live in"; CL-0414 has "(Isfahan?)". Add "perhaps".

### SCN-0205 — FIX
1. **[3 WRONG LABEL]** Choice B is `counterfactual`: "Go yourself to Shāhrukh's camp…", feedback "the sources have you writing, not going."
   Letter 16 promises to attend court (EV-0833); no claim records whether he went in 1414. The sources are silent, not contrary. **Should be:** `unknown`; feedback "Letter 16 promises to attend court; the pages do not say whether you went before c. 1422." Change `score.biography -1` to a calibration effect.
2. **[1]** B feedback: "It is open to you only because Fīrūzshāh will speak for you." An invented fact about Fīrūzshāh in 1414. **Should be:** "The game opens this only if you have earned Fīrūzshāh's favour; no source has him speaking for you."
3. **[1]** P3: "In these same months you finish the R. Ḥurūf in Shiraz (10 Ramaḍān 817/23 November 1414)… and correct your Fuṣūṣ commentary in Fars (19 Dhū l-Ḥijja 817/1 March 1415)." The summons is "mid-817/1414" (CL-0416), Nov 1414 to Mar 1415 is not "these same months", and WRK-HURUF records an unreconciled tension between the Ḥurūf's date and its mention of the Fuṣūṣ commentary. **Should be:** "In the same year…", and carry the tension.

### SCN-0206 — FIX
1. **[2 HEDGE DROPPED]** C feedback: "the opening and closing of the Majlis copy are in your own hand (CL-0201)."
   TURKA_AUDIT A#7: Melvin-Koushki's own texts conflict (the Prologue calls ff. 52a-56a "almost certainly Yazdī's" hand); CL-0201 rests on "marginal notes… as reported by Melvin-Koushki".
   **Should be:** "Melvin-Koushki reports, from marginal notes, that the opening and closing are in your hand; his Prologue gives ff. 52a-56a to Yazdī, and the two are not reconciled."
2. **[1]** B feedback: "a commander in Shāhrukh's army later asks for a volume of your Persian works (CL-0453)". "Later" is not in the claim (the letter is undated, and "presumably to Yazdī"). Cut "later".

## ACT III — trials

### SCN-0301 — FIX
1. **[1 INVENTED]** Dramatic question: "You are old, unwell, and the ruler is four provinces away." "Four provinces" is in no artifact; "old, unwell" is Ibn Turka's own plea (CL-0065 note).
   **Should be:** "…Herat is far from Fars, and by your own later account you are old and frail."
2. **[4]** Invariant 1 "rivals from Isfahan, jealous of his growing fame" and P1 "The men who envy you": the motive is Ibn Turka's own attribution (CL-0064 note: "he describes the accusers as connivers; the motives are his own attribution").
   **Should be:** "In his first apology he says Isfahan rivals, jealous of his growing fame, went to Herat…"
3. **[2]** P1: "…that you lean toward Sufism, which in this reign is a way of saying you lean toward the Ḥurūfīs, who want the world remade." CL-0148 is `inferential_reconstruction` ("probably meant", MK "no doubt meant"); "who want the world remade" is in no claim.
   **Should be:** "…which Melvin-Koushki reads as probably meant to tie you to the Ḥurūfīs." (SCN-0306 and 0309 already word it this way.)
4. **[1 mis-cited, cf. rule 4]** Invariant 2: "Herat was the seat of a ruler who distrusted ambitious, independent-minded intellectuals with mystical leanings." cited to CL-0090, which says nothing of the kind. It is CL-0060 (`causal_reconstruction`, MK following Binbaş), so it cannot be an invariant. P2 "Shāhrukh does not need to be persuaded that ambitious thinkers are dangerous." repeats it as fact.
   **Should be:** invariant = the first half only (CL-0090; the taverns closed, EV-0019); move the rest to prose as "Melvin-Koushki argues that Shāhrukh distrusted…" (CL-0060).
5. **[1]** B label: "…accept the judgeship of Isfahan, where your name and your library are." "Your library" is invented. C label: "rely on your reputation and your friends at court" invents friends at court. Cut both.

### SCN-0302 — MINOR
1. **[2]** P1 "and the book is being revised and expanded." and invariant 2 (CL-0045). Whether it was revised in 828/1425 is `contested` (CL-0576; SCN-0206 and 0503 treat it so). **Should be:** "…the timeline has the Mafāḥiṣ revised and expanded in his company (the manuscripts dispute this, CL-0576)." Cite CL-0576.
2. **[4]** A feedback: "The sources report this with two witnesses of different kinds." The second is a pupil's panegyric reported through Dawlatshāh, `low` (CL-0068: "said to have been… the poems are panegyric"). **Should be:** "…the second is a pupil's panegyric, reported through Dawlatshāh (low confidence)."
3. **[1]** P2: "A qadi who sides with the powerful is safe." Unsourced generalisation. Cut, or "By your own later account, the powerful bend qadis to their backers' will (CL-0120)."

### SCN-0303 — FIX
1. **[2 HEDGE DROPPED]** P3: "Every other minor lettrist treatise you have written is silent about rulers." S2b feedback: "Every other minor treatise of yours leaves rulers out". CL-0462: "appears, on MK's judgement, to be the only one… with pointedly political content."
   **Should be:** "Melvin-Koushki judges it the only one of your minor lettrist treatises with pointedly political content."
2. **[3/4]** Choice A (`documented`, historical) "Deliver the finished treatise to Bāysunghur, who asked for it." The claims record the request and the addressee (CL-0326, CL-0460), not a delivery. Feedback: "What is certain is the prince: he is the one who received you with particular favour." That is CL-0425 / CL-0420: Ibn Turka's own letter to Bāysunghur, dated by MK's conjecture (ca. 826/1423?).
   **Should be:** label "Write the treatise Bāysunghur asked for, and address it to him."; feedback "…the prince your own letter 19 says received you with particular favour."
3. **[5/2]** B cost line: "A lettrist prediction goes to the ruler who distrusts mystically minded intellectuals." stated as fact; it is CL-0060. Same in SCN-0305 C. **Should be:** "…to a ruler whom Melvin-Koushki reads as distrusting…".
4. **[2]** P2: "the summa you have been revising with Sharaf al-Dīn" — CL-0576 again.

### SCN-0304 — MINOR
1. **[5]** A feedback: "the year of your second trial and your first, hyper-Sunni apology". The wording is MK's footnote (CL-0535). TURKA_AUDIT A.3 forbids the game speaking as if the trials were enumerated. **Should be:** "Melvin-Koushki's footnote calls it the year of your second trial and of your first apology."
2. **[2]** Invariant 3 gives 28 January 1426 only; CL-0729 keeps 27 February beside the translation; TURKA_AUDIT C says both are kept. Add it.

### SCN-0305 — FIX
1. **[2 HEDGE DROPPED]** Invariant 3: "Qāżīzāda Rūmī studied with Ibn Turka in Samarkand under his brother Ṣadr al-Dīn". P2: "Qāżīzāda Rūmī studied with you there under your brother Ṣadr al-Dīn".
   CL-0048 states it plainly, but CL-0608 and SCN-0101's own feedback say "no source read says Samarkand for Rūmī"; Kirmānī (CL-0607) gives the study under Ṣadr al-Dīn only. The two scenes contradict each other.
   **Should be:** "Kirmānī says Qāżīzāda Rūmī studied with you under your brother Ṣadr al-Dīn; Melvin-Koushki sets that in Samarkand, which no source read says."
2. **[1]** P2: "he directs the observatory of Ulugh Beg." CL-0737: Grammatology calls him the first director, the dissertation the second; nothing puts him in the post in 1426 (CL-0451/CL-0409 use "director" as MK's description). **Should be:** "…who is described as director of Ulugh Beg's observatory (first or second director, in Melvin-Koushki's different papers)."
3. **[3]** Choice A (`documented`, historical): "…and put a dedication to Ulugh Beg in the margin of the manuscript." CL-0305 note: "who wrote it is not stated"; the feedback admits "Only part of this is documented." Keep A as the copy to Qāżīzāda; make the dedication a separate, contested option (B already is).

### SCN-0306 — FIX
1. **[2 HEDGE DROPPED]** Dramatic question: "A verse praising ʿAlī and condemning ʿUmar and ʿUthmān is in the file". P1: "Your enemies then went through your early writings and found what they wanted."
   CL-0071 is `attested/low`, "claiming to find", witness a 19th-century chronicler; EV-0153: "the pages read do not say whether he owned or disowned it." (The invariant hedges correctly; the question and P1 do not.)
   **Should be:** "…they claim to have found a verse praising ʿAlī and condemning ʿUmar and ʿUthmān." "In the file" is modern idiom too.
2. **[5]** D feedback: "the sources put the second trial before Shāhrukh". **Should be:** "…put the hearing before Shāhrukh at Herat".

### SCN-0307 — FIX
1. **[3 WRONG LABEL]** Composer S1c is `counterfactual`: "Admit that in your youth you explored the suspect sciences, and justify it with the hadith 'Learn even sorcery.'" Its feedback says "The admission is in the record but not in this text: the R. Iʿtiqādiyya makes it" (CL-0163).
   A counterfactual the sources record. **Should be:** `contested`/`unknown` (date undetermined) with the `-1` removed, or the option reworded as "Put the admission into this text".
2. **[7/4]** S1c feedback: "The game's researchers note the pair sits uneasily" — pipeline voice; CL-0164 is the researcher's observation. **Should be:** "The game notes…".
3. **[1]** S5c feedback: "Marking some Sufi masters as impostors makes enemies among Sufis." A consequence in no source. Tag "In the game,…".
4. **[4]** S2b feedback: "your friend Qāżīzāda Rūmī". EV-0231 says "associate"; the friendship is CL-0608's reconstruction.
5. **[7]** S2a label "mafiosos" is MK's rendering (EV-0209); add "(Melvin-Koushki's rendering)".

### SCN-0308 — FIX
1. **[1 INVENTED]** Dramatic question: "You have just made, or read, the most detailed statement of belief in your life." Invented superlative, and it contradicts the scene's own thesis (the apology is not a statement of belief) and the Mafāḥiṣ. **Should be:** "You have just made, or read, the first of the apologies."
2. **[5/6]** R1 ("Nafsat I is safe evidence of what Ibn Turka himself believed", answer refute, `score.calibration` +1), A (`reconstructed`, +2) and B (`contested`, -1, and +1 `score.biography`):
   the game scores the answer that matches MK's position while B's feedback says "The record is silent on which reading is right" and REC-0001 gives Lewisohn's opposing reading. CLAUDE.md rule 6: nothing is scored against a designer's answer.
   The defensible ground is the game's own duress rule, so say so: "The game scores this by its own duress rule, which is Melvin-Koushki's position; Lewisohn reads the apologies at face value." Remove B's `score.biography +1`.

### SCN-0309 — FIX
1. **[3 label contradicts its source]** Choice A (`documented`, historical): "Obey the recall and go back to Herat; and when you are in custody, write to Amīr Fīrūzshāh asking him to press your case and restore your stipend."
   CL-0432 / EV-0846: letter 27 says "friends had freed him from imprisonment"; SCN-0401 P2 has it right ("says friends have since freed you").
   **Should be:** "…and, once friends have freed you from the collectors, write to Amīr Fīrūzshāh…". Also drop the duplication with SCN-0401 A.
2. **[2]** P2: "Your works never name the Ḥurūfīs". EV-1224 is "anywhere in his lettrist works"; Nafsat II ends by dismissing Fażl Allāh's movement (CL-0160). **Should be:** "Your lettrist works never name the Ḥurūfīs".
3. **[minor]** Cost: "Torture is reported, probably through his own second apology." Letter 27 also complains of torture (EV-0846); drop "probably" or cite letter 27.

## ACT IV — exile

### SCN-0401 — MINOR
1. **[1]** B cost: "…weeks after the attempt on the ruler." "Weeks" is invented (letter 27: "ca. 830/1427, Herat?"). **Should be:** "soon after".
2. **[1]** B feedback: "Open to you because Fīrūzshāh has reason to answer you." Invented motive. **Should be:** "The game opens this only once you have earned Fīrūzshāh's favour."
3. **[4]** C feedback: "he won you over in 1422 and again in 1426" reverses the subject (CL-0065, CL-0073: Ibn Turka gained Shāhrukh's favour, on MK's summary). C label "your two earlier trials" enumerates; CL-0659 (MK: summoned three times, defended successfully c. 1422 and 1426) supports the count but it should be attributed.

### SCN-0402 — CLEAN
Silent only on the order of the three appeals, and says so; the three `documented` options are each a surviving letter. Feedback and costs match effects. (`Zaydī`, "imprisoned?" as MK's query, and "none asks outright for money" as MK's description are all attributed.)

### SCN-0403 — FIX
1. **[1 INVENTED]** Dramatic question "a prince's son" and C label "Skip the prince's son"; A gives `court.baysunghur +1` for writing for ʿAlāʾī. The dedicatee is "ʿAlāʾ al-Dīn b. Bāysunghur (a Hanbali)" (WRK-TUHFA-YI-ALAI, CL-0335). No artifact identifies him as the son of Bāysunghur b. Shāhrukh.
   SCN-0402 C also lists "ʿAlāʾ al-Dīn b. Bāysunghur" as one of three unresolved candidates for the amir of letters 33-34, and says its `court.ala-al-din` key "does not say he is the same man as the dedicatee of the Tuḥfa-yi ʿAlāʾī" — yet 0403 A adds `court.ala-al-din +1` for that dedicatee.
   **Should be:** "a Ḥanbalī named ʿAlāʾ al-Dīn b. Bāysunghur"; drop `court.baysunghur` (or flag as game abstraction); reconcile with 0402 C.
2. **[1]** Dramatic question: "a Mazandarani lord" for Shāh Rażī l-Dīn. The sources give "one Shāh Rażī l-Dīn", at whose request (CL-0233). **Should be:** "a man named Shāh Rażī l-Dīn, at whose request".
   (A's "when you winter at Natanz" is sourced, EV-0047; cite it.)

### SCN-0404 — MINOR
1. **[1]** Dramatic question: "is, for the first time in years, within reach". In no artifact. Cut.
2. **[4]** P1: "al-Jazarī, the Damascus-born traditionist your enemies have sheltered behind". That your enemies hide behind him is Ibn Turka's own claim in Nafsat II (CL-0156, `subject_self_report`, high shaping risk). **Should be:** "whom, by your own later account, your enemies hide behind".

### SCN-0405 — FIX
1. **[1/3]** Choice A (`documented`, historical): "Ask that your case be reviewed and your position restored, and take Shāhrukh's promise as given…". P2 of the same scene says "They do not say what you asked for, in what words, or which post the promise covered."
   The request is invented, and stamped historical. **Should be:** "Ask to be heard, and take Shāhrukh's promise of reinstatement as given: follow the camp back toward Herat." (CL-0084, CL-0085.)
2. **[1]** B cost: "a ruler who has just been kind to you" — the record has a promise, not kindness. Minor.

### SCN-0406 — MINOR
1. **[3]** A feedback: "the apology went to Bāysunghur". CL-0086 / CL-0225: "addressed to". Delivery is not recorded (same slip as SCN-0303 A). **Should be:** "is addressed to".
2. **[4]** S2b feedback: "A Timurid chronicler, Dawlatshāh, independently calls you…". CL-0044 note: "reception a century or more later"; CL-0154 "as reported by MK". **Should be:** "Dawlatshāh, writing decades later, as Melvin-Koushki reports".
3. **[7]** S3b label "imposter Sufis" (elsewhere "impostor"). S4b: "The sources do not have you writing to the sultan a second time" is ambiguous (letters 16 and 20 are to Shāhrukh); say "no source has the second apology sent to the sultan".

### SCN-0407 — FIX
1. **[3 WRONG LABEL]** Choice D is `counterfactual`: "Ask Yazdī to finish the Iṣbāḥ al-Anwār, the lettrist work you left incomplete." The scene is `unrecorded`; nothing says he did not ask. Feedback ("No source has anyone finishing it… the work stayed a fragment") does not contradict a request. SCN-0104 B reasons the other way ("not a counterfactual: nothing says you did not praise him"). **Should be:** `unknown`, like A-C; remove `score.biography -1`.
2. **[2]** B label: "Leave your works to the copyist who has stayed beside you". CL-0213 is `inferential_reconstruction` ("seems to have accompanied"). **Should be:** "…to a copyist whom Melvin-Koushki thinks may have been near you".
3. **[1]** A label "your closest friend and pupil" and D feedback "Yazdī trusts you: he is your closest friend". CL-0043 gives closeness from letters; the superlative and "trusts" are unsourced; "pupil" is later reception (CL-0044). **Should be:** "Sharaf al-Dīn Yazdī, whose letters show his closeness to you".
4. **[4]** Invariant 1 and P1: "frustrated, impoverished and in limbo… Melvin-Koushki calls you frustrated, impoverished and in limbo." The phrase is a quotation from the *Sharḥ-i Naẓm al-Durr* editor's introduction (EV-0167: "cited for this passage"), not MK's own words. **Should be:** "The editor of the Sharḥ-i Naẓm al-Durr, whom Melvin-Koushki cites, calls you 'frustrated, impoverished and in a state of limbo'."

## ACT V — the copyist

### SCN-0501 — MINOR
1. **[6/contradiction]** Situation, invariant and P2 say "his first trip to Herat" (MK's wording, CL-0205). Scenes 0301-0307 make 1422 the first Herat hearing; 827-29/1425-27 brackets the 1426 hearing. **Should be:** "the years bracketing his trip to Herat in 1426 (which Melvin-Koushki calls his first trip to Shāhrukh's court; other pages put a hearing c. 1422)".
2. **[2]** A label: "copy the works in date order, so that whoever must judge him can read his orthodoxy off the sequence." CL-0207: "perhaps… copied as part of the evidence in defence of his orthodoxy". "Read his orthodoxy off the sequence" is the game's. **Should be:** "…copy the works as evidence of his orthodoxy, as Melvin-Koushki suggests some of them may have been."

### SCN-0502 — MINOR
1. **[7]** Invariants 2 and 3 open "Researcher's collation from Melvin-Koushki's entries". Honest but pipeline voice; say "Collated from Melvin-Koushki's entries by the game".
2. **[1]** C feedback: "it is not in MS Majlis 10196… Its verses are among the poetry he says is scattered through his works." The entry lists no Majlis folios (absence, not exclusion); "he says" is MK (EV-0441), not Ibn Turka. **Should be:** "Melvin-Koushki lists no Majlis 10196 copy of it… the poetry he says is scattered through the works".

### SCN-0503 — MINOR
1. **[2]** A label and invariant: "…and that it was revised and expanded in his company." CL-0576: the manuscripts dispute the revision (the feedback half-says it). Add "(the manuscripts disagree, CL-0576)".
2. **[1]** P3: "A volume that may be read by judges will be read for its names." Speculative. C feedback: "Open to you because the standing Ibn Turka earned with Akhlāṭī's circle carries into the volume." Invented rationale; replace with a game-mechanic note.

## ACT VI — the historian

### SCN-0601 — MINOR
1. **[1]** P2: "It is the only place he tells his own story, and he was telling it to the man judging him." Nafsat II is to Bāysunghur, not a judge (CL-0086), and other texts carry his account (R. Arbaʿīniyya preface CL-0221; Tuḥfa introduction CL-0336; letters). **Should be:** "Most of what we know of his life comes from the two apologies; the first was written for the ruler judging him, the second for his son while the case was open."
2. **[4]** B feedback: "…Melvin-Koushki does not reconcile them." CL-0164: "MK does not draw this contrast… This is the researcher's observation, not MK's." **Should be:** "Melvin-Koushki does not draw this contrast; it is the game's observation."
3. **[2]** A feedback: "a text written to be found orthodox will be orthodox." Unsourced certainty; attribute to MK's duress reading (CL-0167).

### SCN-0602 — MINOR
1. **[2]** P1 "One early verse, which his enemies cited." and C label "Read the early verse…" — early and his are the accusers' claim (CL-0071, 19th-century chronicler; EV-0153). **Should be:** "The verse his enemies said they found in his youthful works."
2. **[1]** P2: "But none of them was written to convince the man who could imprison him that he was orthodox". Letters 16 and 20 are to Shāhrukh (CL-0416, CL-0418: "blameless before the Prophet"). **Should be:** "most of them".
3. **[2]** A feedback: "…seventh, in the same year as the first apology." The date is a completion note that may record copying (CL-0534). Add the hedge.
4. **[1]** C feedback: "the verse's date and authorship are what the case against him turned on." In no source.

### SCN-0603 — MINOR
1. **[1]** A feedback: "each shows what a later reader wanted." Ibn Ḥajar (d. 1449) and Dawlatshāh are not shown to have wanted anything; only the hagiographers' purposes are noted (EV-1201, EV-1204). **Should be:** "each shows how a later writer saw him, and some of them had a purpose".
2. **[7]** P1: "Jāmī through his hostile biographer" is garbled: Jāmī left him out of the *Nafaḥāt* (CL-0616); Kāzirūnī expanded the failed-Sufi image (CL-0619).

### SCN-0604 — FIX
1. **[4 WRONG ATTRIBUTION]** Choice C label: "Matthew Melvin-Koushki. Call him an occult philosopher and an imamophile, and set the apologies aside as written under duress."
   MK does not set them aside: CL-0100 (primary source of the life), REC-0063 ("MK's Chapter 1 biography rests primarily on them"); SCN-0308 C scores `-1` for the same move and says he calls them the primary source. **Should be:** "…and read the apologies as what he told his judges, not what he held."
2. **[1/4]** Choice D label and feedback: "Read the guilt by association as the men who arrested him did." / "The readings the men who arrested him used, and Khwāfī's label for his circle."
   CL-0079: the pages do not say what tied him to the Ḥurūfiyya; Khwāfī was an "establishment Sufi" (EV-1291), not among the arresters; CL-0826: "date and occasion not given". **Should be:** "the prosecution's reading, which is the game's reconstruction (no source shows what the arresters reasoned), together with Khwāfī's label".

### SCN-0605 — FIX
1. **[5/6]** Ruling R1: "An apology addressed to the ruler who is trying you can show what its author actually believed." Answer `refute`, `score.calibration` +2 / -2.
   (a) "can show" is refuted although SCN-0308 R4 and CL-0172 say an apology's claim "can carry weight" where a free work confirms it; the feedback itself has to say "cannot, alone". (b) It scores a designer's answer on a question the field disputes (REC-0001), against CLAUDE.md rule 6.
   **Should be:** "…can, on its own, show…" and name it: "the game's duress rule, which is Melvin-Koushki's position".
2. **[5]** P1: "The game does not know who he was, and neither does the field." "Neither does the field" states position F (MK's caveat, not a conclusion; TURKA_AUDIT A#12) as fact; MK holds the occult-philosopher reading. **Should be:** "…and the scholars disagree."
3. **[7]** B feedback: "It is what most biographies do." Unsourced generalisation. Cut.

---

## Totals

| verdict | count | scenes |
|---|---|---|
| CLEAN | 2 | 0203, 0402 |
| MINOR | 16 | 0102, 0103, 0104, 0201, 0202, 0302, 0304, 0401, 0404, 0406, 0501, 0502, 0503, 0601, 0602, 0603 |
| FIX | 18 | 0101, 0105, 0106, 0204, 0205, 0206, 0301, 0303, 0305, 0306, 0307, 0308, 0309, 0403, 0405, 0407, 0604, 0605 |

Findings by category, approximate (a finding may sit in two): INVENTED about 15, HEDGE DROPPED about 15, WRONG LABEL 8 (0101 A, 0102 A, 0204 C, 0205 B, 0305 A, 0307 S1c, 0407 D, 0303 A), WRONG ATTRIBUTION about 9, POSITION/GAME-KNOWS about 4 (0605 R1 and P1, 0308 R1/A/B, the cost lines in 0303/0305), STATE about 6, VOICE about 9.
No European-contact finding. No scene states a "first trial" or "third trial".

## The ten most serious findings, ranked

1. **SCN-0309 A**: the historical, `documented` choice says "when you are in custody, write to Amīr Fīrūzshāh", but the letter itself says friends had freed him (CL-0432), and SCN-0401 says so. The label contradicts its own source and a sibling scene.
2. **SCN-0301** (a cluster): CL-0090 is cited for a sentence it does not contain, and the sentence is Melvin-Koushki's causal reading (CL-0060), which cannot be an invariant; the Ḥurūfī equation is stated flat over an `inferential` claim (CL-0148); "four provinces away" and "your library" are invented; the accusers' jealousy is Ibn Turka's own attribution stated as fact.
3. **SCN-0305**: Qāżīzāda Rūmī "studied with you there" in Samarkand, flat, while SCN-0101 says no source read says Samarkand (CL-0608). Two scenes contradict each other about the same fact.
4. **SCN-0604 C**: attributes "set the apologies aside" to Melvin-Koushki, who calls them the primary source of the life (CL-0100, REC-0063); SCN-0308 C penalises exactly that move.
5. **SCN-0605 R1 (with SCN-0308 R1/A/B)**: the game scores a contested methodological answer ±2 while saying it does not know who was right, and "can show" is refuted against its own SCN-0308 R4 (CL-0172).
6. **SCN-0101 A**: `documented` + `historical` on a choice the scene itself says no source records (CL-0020 is only `directly_inferred`).
7. **SCN-0308 Q**: "the most detailed statement of belief in your life" is invented and contradicts the scene's own point.
8. **SCN-0405 A**: the historical, `documented` choice invents what he asked for, in a scene whose prose says the pages do not say.
9. **SCN-0303**: "Every other minor lettrist treatise you have written is silent about rulers" drops MK's "appears… pointedly political" (CL-0462), and the historical choice records a delivery the sources do not (they record a request and an addressee).
10. **SCN-0206 C / SCN-0403**: the autograph stated flat against Melvin-Koushki's own conflicting texts (TURKA_AUDIT A#7); and "a prince's son" for the Tuḥfa's dedicatee, an identification in no artifact that feeds `court.baysunghur` and contradicts SCN-0402's own disclaimer.

Next in line: SCN-0106 ("you are still abroad" over a `low` reconstruction, in the dramatic question); SCN-0105 ("a judge like you" in 1397); SCN-0205 B (`counterfactual` for something the sources are silent on, plus an invented Fīrūzshāh); SCN-0407 D (`counterfactual` in an unrecorded scene); SCN-0204 C (`documented` over a presumed addressee, and a cost the effects do not carry).
