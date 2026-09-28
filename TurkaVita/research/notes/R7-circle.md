# R7 — the circle around Ibn Turka and how he was received

Role: RESEARCHER (pass R7). Source: Melvin-Koushki dissertation (`SRC-610EE1D6BA`), read in this session:
pdf pp. 241-252 (printed 224-235), 284-288 (267-271), 434-450 (417-433). Read in addition, to answer the
assignment's purge and Qasim-i Anvar questions, which those ranges do not fully cover: pdf pp. 32, 33, 53, 73,
255-257, 405, 455, 456. Nothing was written about a page not opened.

Artifacts written (all `status: draft`):

- Evidence EV-1200 .. EV-1292 (93 files)
- Claims CL-0600 .. CL-0668 (69 files)
- Reconstructions REC-0150 .. REC-0160 (11 files)

`python scripts/build_artifacts.py --check --grep "EV-1[23]|CL-06|REC-01[5-9]"` prints no errors, and the whole-tree
`--check` also prints none. Eleven quoted spans (5+ words) all verify against their cited pages.

## What pdf pp. 241-252 actually contain

Only pp. 241-245 concern Ibn Turka (Niʿmat Allah Vali, the Niʿmatullahi hagiographies, letter 16, Jami's omission).
pp. 246-252 are MK's summary of Niʿmat Allah's seven lettrist treatises and the start of §4.3.3 (Fazl Allah
Astarabadi); they do not mention Ibn Turka, so nothing was written from them. pp. 255-257 (Hurufi doctrine and the
1427 pretext) were added because the assignment asks why the purge caught him.

## Shape of what was found

**The circle, as the pages report each member.**

| person | how they relate (page) |
|---|---|
| Sharaf al-Din Yazdi | fellow disciple of Akhlati (Gazurgahi, 286); Ibn Turka's own chief disciple (33, 284, 288); credited Ibn Turka with his knowledge in Jami's mouth (288). CL-0600..0602 |
| Qazizada Rumi | studied with Ibn Turka under his brother Sadr al-Din (Kirmani, 242); Gazurgahi lists "Ibn al-Qazi Rumi" among Akhlati's disciples (286); MK: warm relation, Samarkand (287). CL-0607, 0608 |
| Katibi Turshizi | Dawlatshah: disciple in ʿilm-i tasavvuf (285); a verse of his uses the madrasa/khanaqah trope (435). CL-0606 |
| Niʿmat Allah Vali | hagiographies say Ibn Turka and Yazdi sought him at Kuhbanan (242) and travelled with him to Akhlati (243); MK found no overt reference in the works (244); one Munshaʾat letter (no. 16) routes a reply to Shahrukh through him (245). CL-0609..0615 |
| Qasim-i Anvar | Cairo companion in the Savanih (243, 32 fn45); two warm letters, nos. 37-38, the only direct evidence (439); the "prominent master" of Nafsat II is "almost certainly" him (447); swept up in 1427 (32, 73, 456). CL-0633, 0636-0638, 0650, 0662, 0663 |
| Muhammad Parsa | ranked with Ibn Turka and Yazdi by Dawlatshah (285); Ibn Turka leans on his orthodoxy in Nafsat I (446). No personal relationship reported on these pages. CL-0641 |
| Bistami | Anatolian counterpart on a shared project (257); names and denounces Fazl Allah, unlike Ibn Turka (434). No contact reported on these pages. CL-0639, 0640 |
| Ahmad Samarqandi, Hasan ʿAttar, ʿAla al-Din Chishti, Kajuji, Bahaʾ al-Din, Mir Makhdum, Zafir al-Din, Zahir al-Din | recipients of Munshaʾat letters (436-440); Ahmad received the Sharh-i Nazm al-Durr and was persecuted by Khwafi (438). CL-0632, 0635 |
| Akhlati | letter to Ibn Turka, MS Majlis 10196, names him the luminary of the brethren (288). CL-0603 |
| Enemies | al-Jazari and Zayn al-Din Khwafi (436-437); Khwafi coined "naw-mulhidan" (455). CL-0629..0631 |
| Baysunghur, Maʿruf Khattat | patron of lettrism, and a calligrapher expelled with him in 1427 (405, 32). CL-0643, 0664 |

**Reception.** Dawlatshah (1487) puts Ibn Turka and Yazdi first among intellectuals of the age (285); Khwandamir
(1515-29) gives him a short, faint entry (286); Gazurgahi (1503-4) makes him and Yazdi disciples of Akhlati (286);
Jami's Nafahat omits him and Yazdi (441); Bakharzi records Jami calling Yazdi unconvincing and court-dependent (442);
a Safavid tazkira makes them "failed Sufis" through a moral tale (444-445). MK's reading: the hostile account is
Naqshbandi consolidation, not evidence about Ibn Turka (443).

**Hostile reporters flagged.** Bakharzi (Jami's hagiographer) carries `shaping_risk: high` on CL-0617 and on CL-0601
(the Yazdi discipleship claim). Kazirunī's Sullam al-Samavat tale carries `high` (CL-0619). Hurufi partisan sources for the
family's visits to Fazl Allah carry `high` (CL-0657). Niʿmatullahi hagiographers carry `high` (CL-0609, CL-0610). Khwafi's
"naw-mulhidan" label carries `high` on an `event` layer (CL-0631). Every claim that runs through an apology carries
`subject_self_report` at `high` with MK's own duress caveat (pdf p.32 fn 44).

**Jami's disdain.** It consists of: omitting both from the Nafahat; telling Yazdi (in Bakharzi's report) that he gave
himself over to every amir and bureaucrat and defended Sufism weakly; ranking Jami's own Shariʿa-mindedness above
Yazdi's court-attached, heterodoxy-accused work (via Masʿud Shirvani); and, per the later tradition, treating the two
as failed Sufis. Source: Bakharzi, *Maqamat-i Jami* 106-7. MK is translating a hostile reporter and says so; he also
notes Jami saw a first draft (442 fn 32). MK's answer: they never meant to be professional Sufis (443).

**Ibn Turka on the Hurufis.** He never names Fazl Allah or the Hurufis in the lettrist works; his one clear reference
is "the ringleaders of depravity and sedition" in the second apology (434, 447-450). He also attacks unnamed
"certain Sufis" in the R. al-Baʾiyya (434) — which MK reads as a generic allusion ("it would seem"). All of the
strongest hostility is in an apology, so under the duress rule it shows what he told the court, not what he held.
The danger of association is in the record: Hurufi sources say his father and brother visited Fazl Allah (446-447);
the "naw-mulhidan" label (455); "sufigari" as code for Hurufi sympathy (445).

**Why the purge caught him.** MK: enemies tarred him with the Hurufi brush; Shahrukh "appears" happy to let it stand
and used the possibly staged 830/1427 attempt as a pretext, in a wider drive against messianic movements and
extra-establishment intellectuals (32-33, 256). Qasim-i Anvar was swept up in the same action; a footnote (Virani via
MK) says Ismaʿili claims lay behind his case, with the Hurufi link as official excuse (456). REC-0152, REC-0158.

## Duress-rule decisions (evidence_kind)

- `apology`: anything MK reports as said in Nafsat I or II (jazari, khirqa, Isfahan confrontation, grievance).
- `letter`: MK's reports of Munshaʾat letters, and Akhlati's letter to Ibn Turka in MS Majlis 10196.
- `work`: MK's reports of what the lettrist works say or omit (R. al-Baʾiyya, R. Anjam, terminology, the silence on
  Hurufis). The silence on Hurufis (EV-1224) is MK's survey of the works, not something R7
  checked; an AUDITOR may prefer `scholarly_argument`.
- `hagiography`: Niʿmatullahi (Kirmani, Sunʿ Allah) and Hurufi (Nafaji, Sayyid Ishaq) sources.
- `chronicle`: Dawlatshah, Khwandamir, Gazurgahi. `reception`: Bakharzi, Sullam al-Samavat, the Nafahat omission.
- `context`: Hurufi background, Bistami's terms, Kātibī's verse, Tusi's censure.

## Discrepancies and uncertainties (pdf pages)

1. **Qasim-i Anvar's fate is told three ways**: "arrest" (p.73, chapter 1), "expelled from Herat" (p.32), "exiled from
   Herat in 1427" (p.456). MK does not reconcile the verbs. Letter 38 places Ibn Turka with him in Herat "either in
   830/1427 or 834/1431" (p.439); if 834/1431, Qasim was back in Herat after the 1427 expulsion, which MK does not
   discuss. Qasim's death is given as 837/1434 (p.32 fn 45).
2. **Kirmani versus the Savanih.** Kirmani sends Ibn Turka and Yazdi "to Syria" to become Akhlati's disciples (p.242);
   the Savanih has all five men at Akhlati's house on the Nile, i.e. Egypt (p.243); Gazurgahi says Cairo (p.286). MK
   notes the two omit/include different details (p.244) but not the geography.
3. **Chronology of the Nile scene (R7 observation, not MK's).** Ibn Turka was born 1369 (dissertation elsewhere); the
   pages read do not say when the meeting with Akhlati is supposed to have happened, and Gazurgahi's date for Akhlati's
   death (777/1375-76) is called wrong by MK (p.287 fn 352). The hagiographic companionship is undated on these pages.
4. **Seven or eight lettrist treatises by Niʿmat Allah.** p.241 says seven; p.33 fn 47 says the Maktubat contains eight
   treatises on lettrism (768-810). pp. 246-252 number seven treatises.
5. **Jami's role in Bakharzi's book**: "checked and approved by Jami himself" (p.288 fn 357) versus "able to examine
   the first draft" (p.442 fn 32). Recorded at the weaker strength on CL-0617.
6. **Afzal al-Din Turka.** MK calls Afzal al-Din the father and Sadr al-Din the elder brother (p.446), while the Hurufi
   Khwabnama describes Afzal al-Din as "a member of Sadr al-Din's house" (p.447 fn 41). A later Afzal al-Din b. Habib
   Allah Turka (d. 991/1583) appears as Kazirunī's teacher (p.444); MK does not say how he relates. Not reconciled.
7. **Second apology's addressee.** MK's timeline (p.53) has Nafsat II written "for Baysunghur"; MK's reading on p.450
   is that the passage is for "Shahrukh's benefit". The timeline line (p.53) is not an artifact; CL-0655 (the apology's aim) carries only the p.450 reading. Not reconciled.
8. **Nafsat II, "Before I left for [Herat (?)]" (p.449).** The question mark is MK's own translation doubt; kept in
   EV-1273. It affects when the Isfahan confrontation could have taken place.
9. **Letters to Sufis and dating.** MK says the "remainder" of the Sufi letters are exile letters (nos. 35-47, p.439) yet
   cites nos. 37 and 38 (to Qasim) as evidence of earlier warmth; letter 16 (Niʿmat Allah) is undated by MK, and the
   date 816/1413-14 belongs to Niʿmat Allah's Shiraz visit (p.244). CL-0613 is `low` for that reason.
10. **Death year of Ibn Turka.** Khwandamir's "83[5]" is MK's bracket (p.286); Lewisohn's title on p.32 fn 44 has
   "830/1437 [sic]". Timeline p.53 gives 835/1432.
11. **Pasikhani's death**: 831/1428 (p.252) versus ca. 831/1427 (p.256 fn 244). Outside this pass's ids; recorded only.
12. **Nafahat omission and Navaʾi.** p.441 fn 29 says Navaʾi added Sharaf al-Din to his Chaghatay Nasaʾim; p.285 says
   neither of his works mentions Ibn Turka. Consistent, but easy to misread as "Navaʾi omits both".
13. **MK's own polemic.** pp. 443 (rebuttal of Jami, "adolescent"), 450 (blaming Hurufis "above all") are MK's
   judgements; the paraphrase on p.443 ("may well have deserved the accusations of heterodoxy") describes Bakharzi's
   stance and is not MK's view. Both recorded as `inferential_reconstruction`, not `attested`.
14. **Naqshbandi Kashifis.** CL-0622 rests on a pointer (p.440) to §§4.4.2 and 4.4.4, which R7 did not read; `low`.

## Points the pages are silent on (kept as silences, not filled)

- The unnamed khirqa-giver of the second apology (CL-0648); MK does not name him.
- Any meeting or correspondence between Ibn Turka and Bistami (CL-0640), or a personal link with Parsa (CL-0641).
- Whether the Isfahan confrontation with the Hurufi leaders happened as told: only the apology witnesses it (CL-0653).
- Whether the Sullam quest happened (CL-0620).
- Why Jami left out Niʿmat Allah "for different reasons" (p.245): MK gives no reason for Niʿmat Allah.
- MK draws no conclusion from the family's visits to Fazl Allah (p.446 is a parenthesis).

## R7 observations, outside MK, offered for the AUDITOR

- The Sullam tale's Egyptian dervish who stays secluded in the upper apartment of a khanaqah (p.445) resembles
  Gazurgahi's Akhlati in his upper-floor quarters (p.286). MK does not connect them and no artifact does; it may be a
  folk echo or nothing.
- Ibn Turka's own second apology has him admonishing Qasim-i Anvar's disciples while the letters to Qasim are warm; both
  are compatible, and the game should not resolve them.

## Not read

The primary texts (Nafsat I and II, the Munshaʾat letters themselves, R. al-Baʾiyya, R. Anjam); Binbas's articles;
§§4.4.2 and 4.4.4; Part 2 transcriptions; anything beyond the page ranges above except pdf pp. 32, 33, 53, 73, 255-257,
405, 455, 456. All letter numbers and manuscript folios are MK's, at second hand.
