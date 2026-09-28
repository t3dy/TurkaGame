# AUDIT-A1 — do the evidence artifacts say what their cited page says?

Auditor pass A1, 2026-09-27. Read-only: no artifact was edited. Every verdict below rests on opening the cited
pdf page with `python scripts/search.py --page <source_id> <witness_page>` (and, where a sentence ran across a
page break or a claim leaned on a neighbouring page, the neighbouring page too; a few targeted regex looks over
`db/corpus.db` opened read-only, e.g. to prove that no letter in pdf 155-164 is addressed to Pīr Muḥammad).
"MK" is Melvin-Koushki. "Dis." is the 2012 dissertation `SRC-610EE1D6BA`. Pages are pdf pages (printed = pdf - 17).

## 1. Sampling rule (reproducible)

Existing files only, sorted by id, within each stratum. With `n` = files in the stratum and `q` = quota:
`k = floor(n / q)`, `offset = k // 2`, take indices `offset, offset+k, offset+2k, ...` (first `q`).

* **Evidence**, q = 8 in each of nine id blocks (72 files, not 70: 8 x 9): EV-0001..0199 (n=172, k=21, so EV-0011, 0032, 0053 ...),
  0200..0399 (166), 0400..0599 (121), 0600..0799 (91), 0800..0999 (104), 1000..1199 (140), 1200..1399 (93),
  1400..1599 (106), 1600..1799 (94). The blocks are the researchers': R1 life, R2a apologies, R3 oeuvre A, R4 oeuvre B,
  R5 letters, R6 doctrine, R7 circle/reception, R8 cross-check, R2b dispute.
* **Claims**, 25 in nine strata of 100 ids that coincide with the researcher blocks (CL-0001-99 R1, 0100-99 R2a, 0200-99 R3,
  0300-99 R4, 0400-99 R5, 0500-99 R6, 0600-99 R7, 0700-99 R8, 0800-99 R2b); q = 3,3,3,3,3,3,2,2,3; same k/offset rule.
  Ids: 0017 0049 0081 / 0116 0148 0180 / 0206 0219 0232 / 0306 0319 0332 / 0411 0433 0455 / 0516 0549 0582 / 0617 0651 / 0711 0733 / 0807 0822 0837.
* **Works**, 12 of 49: every 4th file in sorted order starting at index 1 (ARBAINIYYA, DIVAN, ISBAH-AL-ANWAR, KHASAIS, MAFAHIS,
  MUNAZARA-I-BAZM-U-RAZM, NAFSAT-AL-MASDUR-I, SHAQQ-I-QAMAR, SHARH-HADITH-NABAWI, SHARH-I-DAH-BAYT, SHARH-KHUTBAT-AL-KASHSHAF, TAQDIM-AL-AQL).

Verdict scale. **FAIL** = the artifact asserts something the page does not support, or breaks a hard rule of the brief
(a hedge kept as `attested`; a HELD kind on something that is not the witness; an apology-derived claim with no
`subject_self_report`/high layer; `composition` on a date the dissertation says may be copying). **MINOR** = the fact is
right but the citation, kind, wording or hedge is off in a way a downstream reader could trip on. **PASS** = faithful,
right kind, right speaker.

## 2. Totals

| | items | PASS | MINOR | FAIL |
|---|---|---|---|---|
| Evidence | 72 | 50 | 21 | 1 |
| Claims | 25 | 14 | 8 | 3 |
| Works | 12 | 9 | 2 | 1 |
| **All** | **109** | **73** | **31** | **5** |

By researcher block (evidence, 8 each): R1 5P/3M, R2a 6P/2M, R3 8P, R4 4P/4M, R5 5P/2M/1F, R6 4P/4M, R7 4P/4M, R8 6P/2M, R2b 8P.

FAIL ids: **EV-0806, CL-0148, CL-0232, CL-0822, WRK-MAFAHIS**.

No number, date, name or ordinal was altered in a way that changes a fact (one ordinal, EV-0270, is renumbered). No fact was
invented. Nothing was attributed to the wrong person outright; two attributions blur MK's gloss into the primary voice (EV-0330, EV-1042).

## 3. Evidence table (72)

Kind is the artifact's `evidence_kind`. "spill" = the asserted words run across a pdf page break and part of them is on the page not cited.

| id | block | pdf | kind | verdict | note (details in section 6) |
|---|---|---|---|---|---|
| EV-0011 | R1 | 51 | colophon | MINOR | timeline entry typed colophon; the artifact itself says the timeline does not say which date rests on a colophon |
| EV-0032 | R1 | 52 | colophon | MINOR | same |
| EV-0053 | R1 | 53 | scholarly_argument | PASS | |
| EV-0074 | R1 | 58 | context | PASS | |
| EV-0095 | R1 | 63 | context | PASS | |
| EV-0116 | R1 | 66 | scholarly_argument | PASS | "this period" = the Cairo years by context |
| EV-0137 | R1 | 69 | scholarly_argument | PASS | |
| EV-0158 | R1 | 73 | apology | MINOR | content admits the page cites no source; kind apology is not established here |
| EV-0210 | R2a | 77 | apology | PASS | |
| EV-0230 | R2a | 78 | context | PASS | |
| EV-0250 | R2a | 85 | scholarly_argument | PASS | |
| EV-0270 | R2a | 81 | apology | MINOR | "the third defence": the page numbers it "Second" (twice) |
| EV-0290 | R2a | 83 | apology | PASS | |
| EV-0310 | R2a | 84 | apology | PASS | |
| EV-0330 | R2a | 94 | reception | MINOR | list of targets is on pdf 85; "known for ... Shiʿi and mystical views" is MK's rendering, not the annotator's words |
| EV-0350 | R2a | 90 | context | PASS | |
| EV-0407 | R3 | 96 | scholarly_argument | PASS | |
| EV-0422 | R3 | 99 | colophon | PASS | |
| EV-0437 | R3 | 104 | colophon | PASS | |
| EV-0452 | R3 | 107 | scholarly_argument | PASS | |
| EV-0467 | R3 | 110 | creed_tract | PASS | |
| EV-0482 | R3 | 114 | colophon | PASS | |
| EV-0497 | R3 | 118 | scholarly_argument | PASS | asterisk correctly reported |
| EV-0512 | R3 | 122 | reception | PASS | |
| EV-0605 | R4 | 126 | work | PASS | |
| EV-0616 | R4 | 129 | colophon | MINOR | spill: fact is on pdf 128; a marginal cross-reference is not a colophon |
| EV-0627 | R4 | 52 | scholarly_argument | PASS | (see incidental note on 813 vs 814) |
| EV-0638 | R4 | 132 | reception | MINOR | an edition listing is not reception |
| EV-0649 | R4 | 135 | scholarly_argument | PASS | "presumably" kept |
| EV-0660 | R4 | 136 | colophon | PASS | |
| EV-0671 | R4 | 138 | work | MINOR | spill: "refers the reader to the Mafāḥiṣ" and the asterisked date are on pdf 139 |
| EV-0682 | R4 | 147 | colophon | MINOR | mixes pdf 147 with pdf 97 and adds the researcher's own inference |
| EV-0806 | R5 | 152 | letter | **FAIL** | manuscript description plus MK's inference typed `letter` |
| EV-0819 | R5 | 156 | letter | PASS | all "?" and "almost certainly" kept |
| EV-0832 | R5 | 158 | letter | MINOR | spill: the hedge ("presumably (assuming a rough chronological order)") and the date are on pdf 157 |
| EV-0845 | R5 | 159 | letter | PASS | |
| EV-0858 | R5 | 162 | letter | PASS | |
| EV-0871 | R5 | 164 | letter | MINOR | drops MK's "incorrectly identified" |
| EV-0884 | R5 | 169 | letter | PASS | |
| EV-0897 | R5 | 328 | reception | PASS | spill disclosed in the content (footnote on pdf 329) |
| EV-1008 | R6 | 334 | scholarly_argument | PASS | (duplicate of EV-1445) |
| EV-1025 | R6 | 471 | work | MINOR | unattributed researcher gloss in parentheses |
| EV-1042 | R6 | 478 | work | MINOR | Q 86:9 gloss is the treatise's voice, not "they"; "may become" dropped |
| EV-1059 | R6 | 180 | work | MINOR | MK's bracketed "[complementary]" adopted as Ibn Turka's; second sentence is MK's analysis under a `work` kind |
| EV-1076 | R6 | 468 | scholarly_argument | PASS | |
| EV-1093 | R6 | 351 | colophon | PASS | |
| EV-1110 | R6 | 357 | work | MINOR | "insofar as" dropped; "the above" for the Ḥāmīmī Circle misread as "the spoken form's manifestation" |
| EV-1127 | R6 | 345 | scholarly_argument | PASS | |
| EV-1205 | R7 | 243 | hagiography | MINOR | drops MK's provenance/late-source cautions and "concerned to link" |
| EV-1216 | R7 | 286 | scholarly_argument | MINOR | the quoted "faint praise" is on pdf 285 |
| EV-1227 | R7 | 434 | context | MINOR | spill: the last clause is on pdf 435 |
| EV-1238 | R7 | 437 | scholarly_argument | PASS | |
| EV-1249 | R7 | 442 | reception | PASS | quotation verbatim; report vs event kept apart |
| EV-1260 | R7 | 446 | apology | PASS | |
| EV-1271 | R7 | 448 | apology | PASS | |
| EV-1282 | R7 | 73 | scholarly_argument | MINOR | `refers_to_primary` over-attributes to Binbaş; same facts as EV-0158/EV-1419 typed differently |
| EV-1406 | R8 | 69 | apology | MINOR | only the "presumably ... judgeship" inference carries the Nafsat II footnote |
| EV-1419 | R8 | 73 | apology | PASS | matches the brief's own example for this fact |
| EV-1432 | R8 | 173 | scholarly_argument | PASS | |
| EV-1445 | R8 | 334 | scholarly_argument | PASS | (duplicate of EV-1008) |
| EV-1458 | R8 | 10 | scholarly_argument | PASS | |
| EV-1471 | R8 | 36 | scholarly_argument | MINOR | spill: object of "commissioner of two of" is on pdf 37, and drops "most important imperial" |
| EV-1484 | R8 | 13 | scholarly_argument | PASS | |
| EV-1497 | R8 | 17 | scholarly_argument | PASS | |
| EV-1605 | R2b | 25 | scholarly_argument | PASS | |
| EV-1616 | R2b | 24 | reception | PASS | |
| EV-1627 | R2b | 25 | reception | PASS | |
| EV-1638 | R2b | 39 | scholarly_argument | PASS | |
| EV-1649 | R2b | 26 | work | PASS | |
| EV-1660 | R2b | 22 | scholarly_argument | PASS | |
| EV-1671 | R2b | 455 | scholarly_argument | PASS | 6-word quote verbatim |
| EV-1682 | R2b | 454 | reception | PASS | |

## 4. Claims table (25)

| id | block | type / conf | verdict | note |
|---|---|---|---|---|
| CL-0017 | R1 | attested/high | PASS | |
| CL-0049 | R1 | attested/low | PASS | hagiography, later_chronicler/high layer, all correct |
| CL-0081 | R1 | attested/medium | MINOR | "about five years" vs "much of the next five years"; Nafsat II date given as 1431-32 |
| CL-0116 | R2a | attested/high | MINOR | "flattering claims" is not MK's or the evidence's |
| CL-0148 | R2a | inferential_reconstruction/medium | **FAIL** | apology-derived charge; no `subject_self_report`/high layer |
| CL-0180 | R2a | attested/high | MINOR | MK's own generalisation as attested/high; drops "nearly universal ... emergent" |
| CL-0206 | R3 | inferential_reconstruction/medium | PASS | |
| CL-0219 | R3 | undeterminable/low | MINOR | misses that the dissertation itself dates the Sharḥ Fuṣūṣ 814/1411 (first version) |
| CL-0232 | R3 | attested/medium | **FAIL** | hedge kept as attested; "known only from that reference" invented |
| CL-0306 | R4 | contested/low | MINOR | a detail-level discrepancy inside one author is not `contested` |
| CL-0319 | R4 | attested/high | PASS | attested silence, verified |
| CL-0332 | R4 | attested/medium | PASS | |
| CL-0411 | R5 | attested/medium | MINOR | the absence claim has no supporting evidence artifact (I verified it is true) |
| CL-0433 | R5 | attested/medium | PASS | |
| CL-0455 | R5 | attested/medium | PASS | son / not-son hedge is in mediation and evidence; MK himself calls him Ibn Turka's son (pdf 168 fn 166 hedges lightly) |
| CL-0516 | R6 | attested/high | PASS | |
| CL-0549 | R6 | directly_inferred/medium | PASS | |
| CL-0582 | R6 | inferential_reconstruction/medium | PASS | corrected order (Planet-Pearl-Peach) used, not the misprinted one |
| CL-0617 | R7 | attested/medium | PASS | exemplary mediation (event, later_chronicler, MK) |
| CL-0651 | R7 | attested/medium | PASS | apology-derived, subject_self_report/high present |
| CL-0711 | R8 | attested/medium | MINOR | "both agree ... on the Cairo dates" overclaims for Of Islamic Grammatology |
| CL-0733 | R8 | analytical_construct/low | PASS | |
| CL-0807 | R2b | attested/medium | PASS | (EV-1628 is typed `apology` for what is MK's characterisation; see section 7) |
| CL-0822 | R2b | inferential_reconstruction/low | **FAIL** | rests on a `work` that is MK's uncited introduction-level paraphrase |
| CL-0837 | R2b | inferential_reconstruction/medium | MINOR | MK's stated positions typed as reconstruction; "nonetheless" is the researcher's |

## 5. Works table (12)

| id | date_kind | addressee | verdict | note |
|---|---|---|---|---|
| WRK-ARBAINIYYA | transcription | Akhlāṭī, for his son Nūr al-Dīn | PASS | (`for the latter's son`, pdf 101, verified) |
| WRK-DIVAN | transcription | none | PASS | the two MK counts of f. 121b are both reported |
| WRK-ISBAH-AL-ANWAR | transcription | none | PASS | "presumably", "perhaps", "(?)" all kept |
| WRK-KHASAIS | unknown | none | MINOR | basis says the Manāhij "places it before or alongside" — MK does not say that; "known only from" |
| WRK-MAFAHIS | composition | none | **FAIL** | own basis says the colophon date refers to copying only (rule 7) |
| WRK-MUNAZARA-I-BAZM-U-RAZM | transcription | Bāysunghur | PASS | asterisk, five-day gap and source all right |
| WRK-NAFSAT-AL-MASDUR-I | transcription | Shāhrukh | MINOR | stricter than any page says; inconsistent with MAFAHIS |
| WRK-SHAQQ-I-QAMAR | transcription | not stated | PASS | 27 Feb vs 28 Jan CE misprint caught |
| WRK-SHARH-HADITH-NABAWI | unknown | not stated | PASS | |
| WRK-SHARH-I-DAH-BAYT | transcription | not stated | PASS | posthumous copy date treated correctly |
| WRK-SHARH-KHUTBAT-AL-KASHSHAF | unknown | not stated | PASS | |
| WRK-TAQDIM-AL-AQL | unknown | not stated (MS "presented to" noted) | PASS | |

## 6. Every non-PASS item: page, what is wrong, corrected wording

### Evidence

**EV-0806 — FAIL (pdf 152, printed 135).** `evidence_kind: letter` is wrong. The artifact is a description of the manuscript MS Dānishgāh 2576 plus MK's inference ("suggests the existence of a standard collection ... that may survive in other, at present unidentified MS copies"). Nothing in it shows what a letter says or what Ibn Turka held; `letter` is a HELD kind, so a claim citing this would count as free testimony. Corrected: `evidence_kind: scholarly_argument`; content as is, keeping "MK infers ('suggests')". Numbers (32 of 46 letters, pp. 168-217, Sinā 316 pp. 10-34, letter 15 mid-page) all check.

**EV-0011 (pdf 51) and EV-0032 (pdf 52) — MINOR.** Timeline entries typed `colophon`. The page's footnote says only "most are based on the colophons of MS Majlis 10196, the Munshaʾāt-i Turka and the Munshaʾāt-i Yazdī" and does not say which; EV-0011's own content says so. Corrected: `scholarly_argument` (as EV-0053 and EV-0627 already do). See pattern P1: 14 timeline files carry `colophon`.

**EV-0158 (pdf 73) — MINOR.** Kind `apology` while the content itself says "the page gives no source for this sentence". pdf 74 names the second apology as "our main source for this period of exile", i.e. the wandering years after the arrest, not the arrest/torture sentence. Corrected: `scholarly_argument` (MK's narrative), with "on pdf 74 MK names the second apology as the main source for the exile period"; the safe `subject_self_report` layer on any claim can stay. The same sentence is EV-1282 (scholarly_argument) and lies inside EV-1419 (apology) — one kind, please.

**EV-0270 (pdf 81) — MINOR.** "the third defence": the page has "First", "Second" and then a second "Second" (this passage). Corrected: "the second point that MK's translation labels 'Second' (the labels repeat; it is the third in order)".

**EV-0330 (pdf 94) — MINOR.** (a) Pdf 94 says only "this stock dismissal"; "the Shiʿa, Muʿtazila and philosophers" are named on pdf 85. (b) "how such a scholar, known for his enlightened Shiʿi and mystical views" is MK's English for the transliterated Persian `ʿajab ast īn qawl az misl-i īn ṣāḥib-i kamāl`, which on its face says only "strange, this saying from such a man of perfection". Corrected: "several [notes] expressing amazement at 'this stock dismissal' (of the Shiʿa, Muʿtazila and philosophers, pdf 85); one exclaims, in MK's rendering, how such a scholar 'known for his enlightened Shiʿi and mystical views' could perpetrate such a reductio ad absurdum."

**EV-0616 (pdf 129, printed 112) — MINOR.** The cited page opens mid-sentence at "the K. al-Mafāḥiṣ (MS Majlis 10196 f. 84a)". "Sharḥ al-Basmala", "refers the reader" and "marginal note" are on pdf 128 (printed 111). `read_by` says only pdf 129 was opened. Also `colophon` is wrong for a marginal cross-reference (no date, no audition). Corrected: `witness_page: 128, printed_page: "111"`; kind `work` (as EV-0489 does for the same manuscript's other marginal cross-references).

**EV-0638 (pdf 132) — MINOR.** `reception` for a publication note ("published in Chahārdah Risāla-yi Fārsī ... pp. 289-91"). Not a later reader's response. Corrected: `context` (or `scholarly_argument`). The same pattern is WRK-SHAQQ-I-QAMAR's EV-0610 and WRK-SHARH-I-DAH-BAYT's EV-0621. Not a HELD kind, so no duress effect.

**EV-0671 (pdf 138) — MINOR.** The sentence "It refers | the reader to the Mafāḥiṣ. It was completed before 2 Dhū l-Qaʿda 830/25 August 1427.*" breaks at the page turn; "refers the reader to the Mafāḥiṣ" is on pdf 139 (printed 122). Corrected: cite 138-139 (or drop the clause), and record MK's asterisk ("possibly transcription").

**EV-0682 (pdf 147) — MINOR.** Content joins pdf 147 (the listing) to pdf 97 (printed 80, "interjected fragment ... ff. 374b-75b") and adds "which would overlap the resumption at f. 375b" — that is the researcher's inference, not MK's, and "(p.97)" is ambiguous (pdf 97 = printed 80). Corrected: "MS Majlis 10196/47 ff. 371b-73b, 375b-82a carries Tuḥfa-yi ʿAlāʾī, undated (Ḥāʾirī, Majlis, 32/243); the only copy listed." The overlap goes to the notes file as a discrepancy, citing "pdf 97".

**EV-0832 (pdf 158, printed 141) — MINOR.** The page opens mid-sentence. MK's hedge — "presumably (assuming a rough chronological order) the R. Ḥurūf", the addressee "Sayyid Niẓām al-Dīn Aḥmad (ca. 817/1414, Shiraz)" — is on pdf 157 (printed 140), which `read_by` does not list. Corrected: cite 157-158: "Letter 15, to Sayyid Niẓām al-Dīn Aḥmad (ca. 817/1414, Shiraz), accompanies an introductory lettrist treatise, 'presumably (assuming a rough chronological order)' the R. Ḥurūf, 'completed in 817/1414 in Shiraz', 'or possibly the R. Anjām, completed in 828/1425' (an odd companion for an 817 letter; MK does not reconcile)."

**EV-0871 (pdf 164) — MINOR.** Lists "(2) a letter from Amīr Riżā Kiyā" and "(3) Ibn Turka's reply" as fact; MK says "Context suggests that the sender and recipient of letters 2 and 3 is incorrectly identified as Amīr Sayyid Riżā Kārkiyā" because he died in 829/1426, before the Gilan exile. Corrected: "(2) a letter attributed to Amīr Riżā Kiyā, which MK thinks misidentified (Sayyid Riżā Kārkiyā died in 829/1426, before Ibn Turka's exile in Gilan; the Kārkiyā ruler then was Sayyid Nāṣir), and (3) the reply." Also kind `letter` for a catalogue listing plus MK's supposition: better `scholarly_argument`.

**EV-1025 (pdf 471) — MINOR.** "(A literary frame, not necessarily a report of an event.)" is not on the page and is unattributed. Corrected: delete, or prefix "Researcher's note, not MK:".

**EV-1042 (pdf 478) — MINOR.** (a) "They read Q 86:9 ... as referring to this level": the page says "The saying upon the day when the secrets are tried (Q 86:9) thus refers to this level" — the treatise's own exegetical voice (MK translating Ibn Turka), not the illuminationists' reading. (b) "a light attached to the darkness of the body" drops "may become attached to the darkness of the world of the body". Corrected: "...a light that may become attached to the darkness of the world of the body ...; the treatise glosses Q 86:9 (the day when the secrets are tried) as referring to this level."

**EV-1059 (pdf 180) — MINOR.** "complementary" is in MK's square brackets in the translation, not in the Persian as quoted; and the second sentence ("MK concludes that both are inferior to lettrism yet ... necessary and noble") is MK's analysis sitting in a `work` artifact. Also the page does not itself say the block quote is from the R. Anjām (pdf 179 fn 10, f. 159a). Corrected: split into a `work` artifact ("Sufism ... formulated in terms of Muḥammad's Sunna ...; mainstream philosophy [MK: 'complementary'] ...", citing 179-180) and a `scholarly_argument` artifact for MK's "both must be considered inferior to lettrism, however, they are necessary and noble".

**EV-1110 (pdf 357) — MINOR.** (a) "Insofar as the spoken form of the letter represents speech, then, it conveys the holy lights" — the conditional is dropped. (b) "The Ḥāmīmī Circle comprises a numerological explanation of the above": "the above" is the descent through the Name the Living to the first-engendered "voluntary voice" (al-ṣawt al-ikhtiyārī), not "the spoken form's manifestation". Two facts in one artifact. Corrected: "Insofar as the spoken form represents speech it conveys the holy lights that negate the darkness of the material realms; ... [separate artifact:] the Ḥāmīmī Circle is a numerological explanation of the descent ending in the 'voluntary voice'".

**EV-1205 (pdf 243) — MINOR.** Drops MK's cautions on the Savāniḥ al-Ayyām: known only through Mufīd Mustawfī's excerpts, which he "amplified" from Shūshtarī, and "may suggest an early Safavid provenance"; and "However accurate this account might be, it is certainly concerned to link Niʿmat Allāh with Sayyid Ḥusayn to a degree greater than the Tazkira of ʿAbd al-Razzāq". The artifact says the account "links ... more strongly". Corrected: "MK notes that, however accurate it may be, the account is 'concerned to link' Niʿmat Allāh to Akhlāṭī 'to a degree greater than' ʿAbd al-Razzāq's Tazkira; the Savāniḥ survives only in excerpts in Mufīd Mustawfī, who amplified it from Shūshtarī."

**EV-1216 (pdf 286) — MINOR.** "faint praise" is on pdf 285 (printed 268: "Compare the [faint] [praise] of Ṣāʾin al-Dīn by Khwāndamīr"). Corrected: cite 285-286, or drop the quotation marks.

**EV-1227 (pdf 434) — MINOR.** "MK follows Bisṭāmī in calling Fażl Allāh's followers Hurufis and Ṣāʾin al-Dīn's circle lettrists" is on pdf 435 (printed 418), as is the closing of Bisṭāmī's incarnationist "ḥurūfiyya". Corrected: cite 434-435.

**EV-1282 (pdf 73) — MINOR.** `refers_to_primary` says "(citing Binbaş, 'The Anatomy of an Attempted Regicide')": footnote 90 cites Binbaş only for Qāsim-i Anvār's earlier Ṣafavī link, not for the attempt, arrests or Ibn Turka's torture. Corrected: drop the Binbaş attribution; fix kind consistently with EV-0158/EV-1419.

**EV-1406 (pdf 69) — MINOR.** Kind `apology` for the whole sentence. Only "these presumably including a teaching post and judgeship" carries footnote 75 ("Nafsat al-Maṣdūr II, 212"); Pīr-Muḥammad's murder and Iskandar's court are MK's history. The hedge ("presumably") is kept, which is good. Corrected: `scholarly_argument`, or split off the judgeship inference as the only `apology` piece.

**EV-1471 (pdf 36) — MINOR.** The page ends "commissioner of two of"; "his most important imperial lettrist treatises" is on pdf 37 (printed 247). The artifact writes "two of his lettrist treatises", dropping "most important imperial". Corrected: cite 36-37: "Bāysunghur, his second Timurid patron, commissioner of two of his most important imperial lettrist treatises (no date given)".

### Claims

**CL-0148 — FAIL (pdf 76, printed 59).** "Ṣāʾin al-Dīn was charged by his detractors with exhibiting Sufi bias (ṣūfīgarī)" — the charge is known only through what Ibn Turka says in Nafsat I; MK's "no doubt meant" is his inference about the accusers' intent on top of that. The mediation has only `modern_interpretation`. Brief: anything that comes through his apologies carries `subject_self_report`, `shaping_risk: high`. Corrected mediation: event (the accusation) -> `subject_self_report` (Ibn Turka, Nafsat I, high) -> `modern_interpretation` (MK, medium). Type and confidence are right.

**CL-0232 — FAIL (pdf 110).** (d) `attested` with a proposition that says "seems never to have been finished": MK's words are "does not seem to have ever been finished" — a hedge, so not `attested`. (e) "it is known only from that reference" is not MK's statement: the entry cites the Manāhij at lxxx, xci and 4, and notes the R. Ḥurūf's separate "Khaṣāyiṣ-i Kamālī" ("presumably a different work"). Corrected: two claims: (1) attested/high "the al-Khaṣāʾiṣ is referred to in the K. al-Manāhij as a fuller work on logic; it is unpublished and no MS copies are known to survive"; (2) directly_inferred/medium "MK: it does not seem ever to have been finished". Delete "known only from that reference".

**CL-0822 — FAIL (pdf 21, printed 4).** The claim rests on EV-1659 typed `work`, and its mediation says "the duress rule counts a work as evidence of what he held". But pdf 21 is MK's introduction-level summary ("As Ṣāʾin al-Dīn saw it, this new phase ... was heralded by a portentious celestial conjunction (likely that of Saturn-Jupiter in Scorpio in 767/1365)"), citing no work and no folio; footnote 8 says "I am not entirely sure which conjunction Ṣāʾin al-Dīn has in mind". Nothing on the page is what a work of his says, so no HELD credit. Corrected: EV-1659 `scholarly_argument`; remove the duress note from the mediation; keep `inferential_reconstruction`/low.

**CL-0081 — MINOR (pdf 73).** "For about five years, until his death" — the page (and EV-0159 itself) say "For much of the next five years, up until his death". Corrected: "For much of the next five years, up to his death ...". Mediation gives Nafsat II as "(1431-32)"; the dissertation dates it ca. 832-35/1429-32 (pdf 60 fn 105), the timeline 834-35/1431-32 (pdf 53): give the range.

**CL-0116 — MINOR (pdf 80).** "these are flattering claims addressed to the man judging him" is an evaluation found neither in EV-0260/261/262 nor on the page (nearest is fn 113: the apologies "reflect ... the predilections and anxieties of Shāhrukh"). Corrected: stop at "... not to fear the powerful (Nafsat I as reported by MK)"; the flattering reading belongs in a reconstruction or the mediation note.

**CL-0180 — MINOR (pdf 88).** (a) "Sufi orders traced their line to ʿAlī" drops MK's "nearly universal filiation of the emergent Sufi orders" and sits in one sentence with "even the Naqshbandiyya" (who traced to Abū Bakr). (b) The generalisation (Sufism as an interface between Shiʿi content and Sunnism) is MK's own synthesis, not a source's statement; `attested`/high overstates. Corrected: type `directly_inferred` or attested/medium with "MK's generalisation"; wording "the nearly universal filiation of the emergent Sufi orders to ʿAlī".

**CL-0219 — MINOR (pdf 106, 129, 173).** The "tension" (R. Ḥurūf 10 Ramaḍān 817/Nov 1414 mentions the Sharḥ Fuṣūṣ "completed Dhū l-Ḥijja 817/March 1415") is real on pdf 106, but MK's own entry 30 (pdf 129) records the colophon: "finished on 20 Ṣafar 814/13 June 1411 and corrected on 19 Dhū l-Ḥijja 817/1 March 1415", and the thematic list (pdf 173) dates it 814/1411. So the Ḥurūf can be citing the 1411 version; the 817/1415 date on pdf 106 is the corrected version. The claim offers two resolutions ("work in progress", "error in one date") and omits the third that the dissertation itself supplies. Corrected: add "the Sharḥ Fuṣūṣ colophon (pdf 129) gives 814/1411 for the first version; MK does not connect this to the Ḥurūf note".

**CL-0306 — MINOR.** `contested` means sources disagree. Here one author's timeline (copies sent to both Ulugh Beg and Qāżīzāda) and his entry (a copy sent to Qāżīzāda; a marginal dedication to Ulugh Beg) differ in detail and are not incompatible. Corrected: `analytical_construct` (R8's convention for discrepancies) or `undeterminable`.

**CL-0411 — MINOR.** Proposition: no letter in pdf 155-163 is addressed to Pīr Muḥammad b. ʿUmar Shaykh. True (verified by full-text search of pdf 154-165; letter 8 is "presumably Iskandar"). But `supported_by` is EV-0807 (pdf 152: MK names him as patron) and the mediation says `where: pdf p.152`; neither evidences the silence. Corrected: add an evidence artifact (or cite pdf 155-163) for the absence.

**CL-0711 — MINOR (pdf 5, 13, 17).** "Both agree with the dissertation on the Cairo dates": EV-1484 (Of Islamic Grammatology) gives no dates for Cairo ("longtime resident of Cairo"); and the Sensorium paper equates the fifteen years with a Cairo "tenure", whereas the dissertation (pdf 63) has a 15-year period of travel abroad including Mecca and Baghdad, with Cairo the deepest imprint. Corrected: "The Sensorium paper dates a fifteen-year Cairo tenure ca. 795-810/1393-1408; Of Islamic Grammatology gives no dates; neither contradicts the dissertation, which dates the fifteen years abroad and puts Cairo at their centre."

**CL-0837 — MINOR (pdf 25, 38, 39).** All three statements are MK's stated positions, verbatim on the pages ("produced under great duress", "rather unsatisfactory", "depended primarily on her account, together with the apologies"): `attested`, not `inferential_reconstruction`. "he nonetheless builds" is the researcher's framing of a tension MK does not acknowledge. `where` omits pdf 38 (Fujii Morio, EV-1640). Corrected: attested/high for the three reports; move "nonetheless" to a separate reconstruction or the notes.

### Works

**WRK-MAFAHIS — FAIL (pdf 351 fn 19, pdf 99, pdf 114-116).** `date_kind: composition`, but the artifact's own `basis` records that "a marginal correction to the Majlis autograph colophon says its date refers to copying (taswīd) only"; the two earliest MSS give different dates, Landberg's queried "(?)"; and a Sharḥ al-Tāʾiyya of presumably before 806/1404 (?) cites it. Rule 7: a date that may be transcription is never stated as composition. Corrected: `date_kind: conjectured` (MK: "completed" 823/1420, unasterisked), basis unchanged.

**WRK-KHASAIS — MINOR (pdf 110).** Basis: the reference in the Manāhij "places it before or alongside that book". MK says only that the Manāhij refers to it and that it does not seem ever to have been finished; a reference to a projected work places nothing. Also "known only from a reference" (see CL-0232). Corrected: "no date given; referred to in the K. al-Manāhij (completed 833/1430 per the timeline); MK: does not seem ever to have been finished; the R. Ḥurūf's Khaṣāyiṣ-i Kamālī is presumably a different work."

**WRK-NAFSAT-AL-MASDUR-I — MINOR (pdf 122, 55, 96).** `transcription`: MK writes "It was completed on 8 Rajab 829/16 May 1426 in Herat" with no asterisk, and computes the birth year from the age the apology gives "at the time of writing" (pdf 55). The basis asserts the date "is treated as a copying date", which no page says; the only reason is the general first-half caveat (pdf 96). It is also inconsistent with WRK-MAFAHIS (unasterisked "completed" -> `composition`). Stricter than the source, so harmless in direction, but not what the source says. Corrected: `composition` with "first-half dates may record transcription (pdf 96)" in the basis, or `conjectured`; apply one standard to both.

## 7. Incidental findings outside the sample (not tallied)

* **EV-1628** (pdf 25) typed `apology` for "MK refers to the image Ibn Turka presents of himself in the apologies; this is the material on which Lewisohn's reading rests". That is MK's characterisation, not what Ibn Turka told his judges; `scholarly_argument`. It duplicates EV-1629's clause.
* **EV-0445** cites pdf 106 but its "(Majlis 10196, Yazd, 828/1425)" clause is on pdf 107.
* **Sharḥ Fuṣūṣ al-Ḥikam date.** Timeline (pdf 52) 813/1411; colophon and entry (pdf 129) 20 Ṣafar 814/13 June 1411; entry on the R. Ḥurūf (pdf 106) "completed Dhū l-Ḥijja 817/March 1415" (which is the corrected version). EV-0627 reports the timeline correctly but nothing records the one-year gap between timeline and colophon; it belongs in R4's discrepancy notes.
* **Duplicates.** EV-1008 and EV-1445 are the same passage (pdf 334) in near-identical words.
* **EV-0645** (WRK-SHARH-KHUTBAT-AL-KASHSHAF) folds MK's own analysis ("lettrism presupposes an uncreated Quran") into a `work` artifact.

## 8. Systematic patterns

**P1 (R1, 14 files): timeline dates typed `colophon`.** 14 of the 70 "Timeline A.1" evidence files (EV-0011, 0013, 0020, 0026, 0027, 0030, 0032, 0034, 0035, 0037, 0038, 0042, 0044, 0047) are typed `colophon`; the other 56 are `scholarly_argument` (33) or `context` (22) or `apology` (1). The timeline footnote (pdf 51) says only that "most" dates rest on colophons and does not say which. Within R1 the treatment is inconsistent (EV-0053 is `scholarly_argument`) and R4 does it the other way (EV-0627). HELD-kind inflation is small here (the facts are dates, not doctrines) but it is the largest single group of mistyped evidence.

**P2 (R4, R5, R7, R8): citations that spill over a page break.** Seven sampled artifacts (EV-0616, 0671, 0832, 1216, 1227, 1471, and disclosed EV-0897) assert words that sit on the following (or preceding) page while citing only one; EV-0445 outside the sample does the same. The build's span-verbatim check passes because it looks for quoted spans, and paraphrase never trips it. Two of them (EV-0832, EV-0616) also list only the cited page in `read_by`, so the researcher never opened the page holding the hedge or the subject of the sentence. A cheap build check would be: every capitalised transliterated name in `content` must occur on the cited page.

**P3 (mostly R3-R7): the mixed artifact.** A `work` or `letter` artifact that also carries MK's own analysis or a researcher's inference: EV-0806 (letter + inference), EV-0871, EV-1059, EV-0682, EV-1025, EV-0645, and CL-0822's EV-1659. This is the one place the brief's warning ("is anything typed `work`/`letter` really MK's own analysis?") bites. Two of five FAILs come from it.

**P4: `reception` for publication notes** (R4: EV-0638, EV-0610, EV-0621). Benign, but consistent.

**P5: hedges are largely kept; dropping is scattered, not habitual.** Across 109 items I found hedges preserved in most places where they matter (EV-0649 "presumably in Cairo", EV-0819 "almost certainly"/"?", EV-1406 "presumably", EV-0858 "most probably", EV-0407 asterisk, EV-0497 and the asterisked works, WRK-ISBAH-AL-ANWAR's "(?)", "perhaps", "presumably"). The lapses: CL-0232 (hedge kept in the text but type `attested`), CL-0081 ("much of" -> "about"), EV-1042 ("may become"), EV-1110 ("insofar as"), EV-0871 (MK's "incorrectly identified"), EV-1205 (MK's provenance cautions), CL-0180 ("nearly universal"). No researcher block habitually drops hedges. The blocks that did best on this: R3, R2b (8/8 PASS each), R2a, R8.

**P6: same page, different kinds.** pdf 73 (EV-0158 apology, EV-1282 scholarly_argument, EV-1419 apology); pdf 334 (EV-1008 and EV-1445). One fact should carry one kind.

**P7: `date_kind` strictness is uneven in R3.** WRK-MAFAHIS (`composition`, against its own basis), WRK-NAFSAT-AL-MASDUR-I and WRK-ARBAINIYYA (`transcription`, the latter with good reason). Most of the other works I opened (DIVAN, ISBAH-AL-ANWAR, MUNAZARA, SHAQQ-I-QAMAR, SHARH-I-DAH-BAYT) handle asterisks and copy dates carefully, and the researchers caught real printing slips in MK (Shaqq-i Qamar 27 Feb vs 28 Jan; the two counts of f. 121b).

**P8: strengths.** "Whose account" is well kept: the `per Melvin-Koushki` formula, apology-derived claims with `subject_self_report`/high (CL-0651, CL-0733, CL-0807, CL-0837), and the hostile-hagiographer mediation of CL-0617 (event, later_chronicler, MK) are exactly what the brief asks. Attested silences (CL-0319, CL-0332, CL-0433) are correct and I confirmed CL-0319 and CL-0411 by full-text search.

## 9. Judgement

**The evidence layer is reliable as a record of what MK's pages say.** In 109 items I found no invented fact, no altered date or number that changes a fact, and no misattributed speaker beyond two blurred glosses. 73 pass clean and 31 more are right in substance with a citation, kind or wording defect that the lead can fix mechanically. The five FAILs are narrow.

The errors cluster in two places rather than spreading: **where the fact lives** (page spill, P2) and **what kind it is** (P1, P3). Both bear directly on the game's duress rule, which is driven by `evidence_kind`:

* Mislabelled in the *held* direction (would credit a statement as free testimony it is not): EV-0806 (`letter`), EV-1659 via CL-0822 (`work`), the 14 timeline `colophon` files, WRK-MAFAHIS (`composition`). These are the ones that could let a "what he held" commitment through undeservedly. Fix these first.
* Mislabelled in the *coercing* direction (treats non-apology narrative as apology): EV-0158, EV-1406, EV-1628. Harmless to the rule (conservative), but inaccurate.

Confidence in each researcher block, from the sample: R3 and R2b clean; R2a and R8 good; R1 and R5 need the kind fixes above; R4, R6 and R7 carry the most MINOR items (mixed artifacts and page spill) but no invented content. Nothing here suggests re-reading any block from scratch; a targeted pass over (a) the 14 timeline files, (b) every `work`/`letter` artifact whose content contains "MK", "infers", "suggests", "supposes" and (c) every artifact whose content begins or ends mid-sentence would catch most of what a wider sample would.

Not audited: the other 1,015 evidence files, 572 claims, 37 works, events, institutions, reconstructions, and whether the *scenes* use these artifacts faithfully. Percentages above are for the sample only; with a 109-item sample the 5 FAILs put the true FAIL rate at roughly 1-9% at ordinary confidence.
