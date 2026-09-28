# R3 - the oeuvre, first half (dissertation SRC-610EE1D6BA, pdf pp.95-125)

Pages opened by R3: pdf 95-125 in full (printed 78-108), and pdf 74 (death date, footnote 96). Two
pages outside the range were looked at only to cross-check folio order and are **not** cited by any
R3 artifact: pdf 131 (R4's Sharh-i Hadis-i Ama entry) and pdf 589 (appendix plate list). Nothing
was written from general knowledge. No other Melvin-Koushki text and no project doc was read, so
rule 4 (contradiction with another MK text or a project doc) has nothing to report.

Boundary: entries 1-25 of section 2.1.2 (Anjam ... Nuqta) are R3's. Nuqta's heading is on pdf 124
(its summary spills onto pdf 125, which I read). R4 starts at **26. Qabiliyyat** (heading pdf 125).

## Ids written

| type | range | count |
|---|---|---|
| EV | EV-0400 .. EV-0520 | 121 |
| CL | CL-0200 .. CL-0238 | 39 |
| WRK | WRK-ANJAM ... WRK-NUQTA (25 slugs) | 25 |

`python scripts/build_artifacts.py --check` (whole workspace, and with `--grep "EV-0[45]|CL-02|WRK-"`):
no errors; every quotation is verbatim on its page (only two quoted spans of 5+ words are used).
EV-0400..EV-0421 are the facts about MS Majlis 10196 and the chronology-of-writings problem; EV-0422
onward are per-work (copy line, MK's completion statement, addressee/occasion, MK's summary, each
work's own evidence_kind). CL-0200..CL-0215 are the collection and chronology claims; CL-0216..CL-0238
the work-level claims. The id-to-key map is in the generator, not committed.

## Date policy used for `date_kind` (strict, and worth reviewing)

MK's own convention (pdf 95-96): about half of MS Majlis 10196 (ff. ~120b-189a in my range), which
holds almost two-thirds of the works, was copied in 828-29, is in almost perfect chronological order,
and so its dates "do not necessarily refer to composition"; he asterisks only those he judges to be
transcription. I went further than his asterisks, because his asterisks are sparse:

- **composition** (7): only where MK gives a completion date that is *not* the Majlis colophon
  (Ḥurūf 817, Asrār al-Ṣalāt 820, Mafāḥiṣ 823, Munāẓarāt-i Khams 808), or where the work sits in the
  second half whose dates he says are "more likely" composition (Mabdaʾ 832, Madārij 831, Manāhij 833).
  Even these carry the caveat in `date.basis`. Mafāḥiṣ is composition at year level only (day contested).
- **transcription** (15): every work whose only date is its Majlis copy date inside the chronological
  run - including the four MK asterisks (Muḥammadiyya, Muhr al-Nubuwwa, Bazm u Razm, Nuqṭa), the
  "completed before X" entries, and **two where MK says "completed on X" with X equal to the copy date
  and no asterisk (Anjām, Nafsat al-Maṣdūr I)**. `date.ce` for "completed before" works is written
  "before <date>", a terminus ad quem, never a bare date. Dīvān and Iṣbāḥ are transcription too (page
  copy date only). This is a deliberate downgrade of MK's plain wording for Anjām and Nafsat I; if you
  want his wording followed literally, switch those two to composition.
- **conjectured** (2): Iʿtiqādiyya and Nafsat II (ca. 832-35/1429-32 by "context").
- **unknown** (1): al-Khaṣāʾiṣ.

`theme` is my label (the entries do not classify); weakest: Muhr al-Nubuwwa = `other` (the entry states no
subject), Inzāliyya = `theology`, Iṣṭilāḥāt = `mystical_philosophy`. `edited` = true where the entry
says "Published" or where MK himself prints an edition in Part 2 (Anjām, Bāʾiyya, Ḥurūf; the last two
are otherwise unpublished). `evidence_kind` on each EV follows the brief: the Majlis copy lines are
`colophon`; Iʿtiqādāt/Iʿtiqādiyya text is `creed_tract`; Nafsat I/II text is `apology`; completion dates
whose source MK does not name are `scholarly_argument`, not `colophon`.

## Table (entry order)

| no. | title | date | date_kind | addressee | Majlis 10196 folios |
|---|---|---|---|---|---|
| 1 | Anjām / Taṣavvuf u Ḥurūf | 17 Dhū l-Qaʿda 828 / 30 Sep 1425 | transcription | - | ff. 158a-60a |
| 2 | R. al-Arbaʿīniyya | before 13 Jumādā II 828 / 2 May 1425 | transcription | Sayyid Ḥusayn Akhlāṭī, for his son Nūr al-Dīn | ff. 120b-21a |
| 3 | Asrār al-Ṣalāt | 21 Jumādā II 820 / 5 Aug 1417, Herat | composition | - | ff. 129b-39a |
| 4 | Aṭvār-i Salāsa | before 7 Shawwāl 828 / 22 Aug 1425 | transcription | - | ff. 145b-48a |
| 5 | R. al-Bāʾiyya | before 14 Ramaḍān 828 / 30 Jul 1425 | transcription | an unnamed postulant | ff. 122b-24a (item /13) |
| 6 | Dīvān / Manẓūmāt | early 828 / 1425 (copy of one page) | transcription | - | f. 121b |
| 7 | R. Ḥurūf | 10 Ramaḍān 817 / 23 Nov 1414, Shiraz | composition | a dignitary, perhaps Iskandar Mīrzā | ff. 154b-57b |
| 8 | R. al-Inzāliyya | before 17 Ramaḍān 828 / 2 Aug 1425 | transcription | - | ff. 126b-28b |
| 9 | Iṣbāḥ al-Anwār | copy 841/1438 (?); composition undated | transcription | - | ff. 404b-16b |
| 10 | Iṣṭilāḥāt al-Ṣūfiyya | before 25 Rajab 829 / 2 Jun 1426 | transcription | - | ff. 184a-88b |
| 11 | Iʿtiqādāt | before 19 Jumādā I 829 / 29 Mar 1426 (Herat, presumed) | transcription | Shāhrukh | ff. 165b-72a |
| 12 | R. Iʿtiqādiyya | ca. 832-35 / 1429-32 (presumed) | conjectured | - | f. 171b (undated) |
| 13 | al-Khaṣāʾiṣ | none | unknown | - | - (no MS survives) |
| 14 | Khavāṣṣ-i ʿIlm-i Ṣarf | 'presumably' Ramaḍān 828 (copy) | transcription | - | f. 129a |
| 15 | Mabdaʾ u Maʿād | early Ṣafar 832 / Nov 1428, Chālū | composition | Shāh Rażī l-Dīn | ff. 266b-71a |
| 16 | Madārij Afhām al-Afvāj | 6 Dhū l-Qaʿda 831 / 17 Aug 1428, Mazandaran | composition | a local ruler, 'perhaps' Sayyid Murtażā Marʿashī | ff. 352b-59b |
| 17 | K. al-Mafāḥiṣ | 823 / 1420 (day contested), revised 828/1425 | composition | - (Akhlāṭī = main oral source) | ff. 52a-118b (entry: 52-118) |
| 18 | K. al-Manāhij | 20 Rajab 833 / 14 Apr 1430, Natanz | composition | his son Muḥammad | ff. 382b-404a |
| 19 | R. al-Muḥammadiyya | before 5 Shawwāl 828 / 20 Aug 1425 * | transcription | - | ff. 139b-45a |
| 20 | Muhr al-Nubuwwa | before 4 Jumādā II 831 / 21 Mar 1428 * (Shiraz) | transcription | - | f. 189a |
| 21 | Munāẓara-yi Bazm u Razm | before 25 Rabīʿ II 829 / 6 Mar 1426 * (Herat) | transcription | Bāysunghur | ff. 162b-65a |
| 22 | Munāẓarāt-i Khams / ʿAql u ʿIshq | Muḥarram 808 / Jun-Jul 1405 | composition | - | not in Majlis 10196 |
| 23 | Nafsat al-Maṣdūr I | 8 Rajab 829 / 16 May 1426, Herat | transcription | Shāhrukh | ff. 179b-83b |
| 24 | Nafsat al-Maṣdūr II | ca. 832-35 / 1429-32; copy 838/1435 | conjectured | Bāysunghur | ff. 226b-30a |
| 25 | Nuqṭa | before 16 Ramaḍān 828 / 1 Aug 1425 * | transcription | an unnamed friend | ff. 124b-26a |

`*` = MK's own asterisk (probable transcription, not composition).

## The collection-ordering key: MS Majlis 10196 by folio (my range only)

R4's works also live in this manuscript and interleave (seen: an R4 item at ff. 119b-20b dated 3 Dhū l-Ḥijja
827 sits between the end of the Mafāḥiṣ and the Arbaʿīniyya; R4's Khayru l-ḥadīth commentary is at f. 122a).
The puzzle key must merge both agents' folio lists. My items, sorted by folio:

| folio | work | colophon date | note |
|---|---|---|---|
| 52a-118b | Mafāḥiṣ | 823/1420 (copying, per marginal correction) | autograph incipit f. 52a, explicit f. 118b |
| 120b-21a | Arbaʿīniyya | 13 Jumādā II 828 | |
| 121b | Dīvān | 'early 828' | anomaly: precedes an item dated Jumādā II 828 |
| 122b-24a | Bāʾiyya | 14 Ramaḍān 828 | |
| 124b-26a | Nuqṭa | 16 Ramaḍān 828 | |
| 126b-28b | Inzāliyya | 17 Ramaḍān 828 | |
| 129a | Khavāṣṣ-i Ṣarf | 'presumably' Ramaḍān 828 | date inferred, not read |
| 129b-39a | Asrār al-Ṣalāt | 26 Ramaḍān 828, Yazd | |
| 139b-45a | Muḥammadiyya | 5 Shawwāl 828 | |
| 145b-48a | Aṭvār-i Salāsa | 7 Shawwāl 828 | |
| 154b-57b | Ḥurūf | 14 Dhū l-Qaʿda 828, Yazd | |
| 158a-60a | Anjām | 17 Dhū l-Qaʿda 828 | |
| 162b-65a | Bazm u Razm | 20 Rabīʿ II 829 | date from Āqā Buzurg, not Ḥāʾirī |
| 165b-72a | Iʿtiqādāt | 19 Jumādā I 829, Herat | |
| 171b | Iʿtiqādiyya | undated | inside the Iʿtiqādāt's range |
| 179b-83b | Nafsat I | 8 Rajab 829, Herat | |
| 184a-88b | Iṣṭilāḥāt | 25 Rajab 829 | |
| 189a | Muhr al-Nubuwwa | 4 Jumādā II 831 | date from Āqā Buzurg |
| 226b-30a | Nafsat II | 838/1435 | after his death |
| 266b-71a | Mabdaʾ u Maʿād | early Ṣafar 832, Chālū | out of date order |
| 352b-59b | Madārij | 6 Dhū l-Qaʿda 831 | out of date order |
| 382b-404a | Manāhij | 20 Rajab 833, Natanz | |
| 404b-16b | Iṣbāḥ | 841/1438 (?) | partial, breaks off; last item of the MS |

From ff. 120b to 189a the dated items ascend without a reversal (CL-0210, a collation of mine, labelled
as such); after f. 189a they do not (CL-0211). That contrast is what MK reads as copying for the
defence (CL-0206, CL-0207, both his inference and 'perhaps' conjecture).

## Uncertainties, discrepancies and things I could not settle (pdf pages)

1. **How much of the Mafāḥiṣ is autograph** - "incipit and explicit" at ff. 52a and 118b (pdf 95, 97) but
   "autograph sections at the beginning, middle and end" (pdf 116). Not reconciled (CL-0202). Also the
   appendix plate list (pdf 589, seen only) has a Mafāḥiṣ plate at f. 119a, one folio past the "ff. 52-118"
   of pdf 114; not chased.
2. **Copying span of Majlis 10196 has three statements that disagree** - "last eight years of the author's life
   and three years past his death" (pdf 95; death 14 Dhū l-Ḥijja 835/12 Aug 1432, pdf 74, gives roughly 827-838),
   "828-41/1425-37" (pdf 97), and a Mafāḥiṣ copy dated 823/1420 (pdf 114) (CL-0203). The 841 comes only from
   the Iṣbāḥ's partial copy, which has its own question mark.
3. **"827-29/1425-27"** (pdf 95): the Hijri and Christian ranges do not correspond (827 AH began Dec 1423;
   828-30 AH is 1424-27). The Majlis dates I actually have in the first-half run are 828-29 (1425-26).
   Every individual Hijri-to-CE conversion in my entries I spot-checked with a tabular calendar and they agree
   with MK to the day; only this summary range is loose.
4. **"First trip" vs "second trip" to Herat** - pdf 95-96 call the 827-29 stay Ibn Turka's first trip to Shāhrukh's
   court, yet the Iʿtiqādāt (Herat, before 19 Jumādā I 829) is said to be written on his "second trip to Herat"
   (pdf 109), and the Asrār al-Ṣalāt is placed in Herat in 820/1417 (pdf 102) (CL-0238; nothing resolved). Also:
   the brief's illustrative example says Nafsat I answers accusations "made by his enemies in Herat"; the
   dissertation (pdf 122) says the accusers were his enemies **in Yazd**, made against him at Shāhrukh's court
   in Herat.
5. **Iʿtiqādiyya (f. 171b) lies inside the Iʿtiqādāt's folios (165b-72a)** (pdf 109, 110), not commented on
   (CL-0228). Its dating argument ("mentions the R. ʿAqīda, so presumably contemporary with
   Nafsat II") gives only a terminus post quem after 829; the 832-35 date is MK's presumption.
6. **Dīvān f. 121b is described two ways** - nine Persian + three Arabic ghazals, four rubāʿīs, a qiṭʿa, two
   muʿammās (pdf 104) versus eight ghazals, eight rubāʿīs, two Arabic fragments (pdf 104-105).
7. **Ḥurūf vs Sharḥ Fuṣūṣ**: Ḥurūf completed 10 Ramaḍān 817 yet said to mention the Sharḥ Fuṣūṣ completed
   Dhū l-Ḥijja 817, which is later (pdf 106). Unreconciled (CL-0219). The source of the Ḥurūf, Asrār and
   Munāẓarāt dates is not named in the entries.
8. **Bazm u Razm** has a Majlis copy date of 20 Rabīʿ II 829 (pdf 118) and "completed before 25 Rabīʿ II 829"
   (pdf 119), five days later; both are from Āqā Buzurg. The Muhr al-Nubuwwa copy date and place (Shiraz)
   are likewise Āqā Buzurg's, not Ḥāʾirī's (pdf 118).
9. **Mafāḥiṣ date**: 1 Shaʿbān 823 (Landberg 146) vs 19 Dhū l-Ḥijja 823 (Majlis 10196, "supported by" the
   Riyāḍ al-ʿUlamāʾ, pdf 116 n.30), but a marginal correction to the Majlis autograph colophon says that date is
   the copying only (n.31) (CL-0216); and a Sharḥ al-Tāʾiyya of "presumably" before 806/1404 (?) already cites the
   Mafāḥiṣ (pdf 115 n.28), which MK calls confusing (CL-0217). The MS Landberg 146 audition note (828/1425) says
   he revised it in Sharaf al-Dīn Yazdī's company; the Mafāḥiṣ's cross-references to the Asrār (f. 77a), Muḥammadiyya
   (f. 76a) and Sharḥ Fuṣūṣ (f. 75a) could therefore belong to the 823 text or the 828 revision; MK does not say.
10. **Asterisks are sparse.** Only four entries in my range are starred; six others are "completed before" a
    Majlis copy date with no star, and two (Anjām, Nafsat I) say "completed on" the copy date with no star, though
    all sit in the run MK says may record copying. My `date_kind` follows the run, not the stars (see policy above).
11. **Posthumous copies**: Nafsat II (838/1435) and, partly, Iṣbāḥ (841/1438 (?)) are the two in my range dated
    after 835/1432 (CL-0212). MK says only that "perhaps no more than two" of the second half were posthumous, without
    naming them; a third 838 copy (Ramaḍān 838) appears in an R4 entry I saw only as a search snippet, so the
    count is R4's to check.
12. **Undated-source facts left open**: which dignitary asked for the Ḥurūf ("perhaps Iskandar Mīrzā"); which local
    ruler asked for the Madārij ("perhaps Sayyid Murtażā Marʿashī", cf. letter 28); the Bāysunghur attribution of
    Bazm u Razm rests on a manuscript catalogue (Ritter and Reinert); the Muhr al-Nubuwwa's subject is not given.
13. **Not read**: the §2.1.3 correspondence, §A.1 timeline (MK's reconstructed chronology, cited at pdf 96 n.2) and
    the appendix plates (P.3), which are outside my range; the Mafāḥiṣ's own date for the 830/1427 trial and the
    Hurufi attempt (pdf 97, 123) are reported as MK states them, not checked against §A.1.
