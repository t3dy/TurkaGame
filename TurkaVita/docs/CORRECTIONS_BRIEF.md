# CORRECTIONS brief — bring the older documents up to the current information

**Standing rule from Ted (2026-09-27): always correct older documents to match the most current information.**
The current information about Ibn Turka's life and works is `TurkaVita/docs/TURKA_AUDIT.md` (read all of it), backed by
`TurkaVita/docs/BIOGRAPHY.md` and `TurkaVita/docs/OEUVRE.md` (generated, page-cited) and the artifacts in
`TurkaVita/research/artifacts/`. Spine source: Melvin-Koushki's 2012 Yale dissertation (corpus id `SRC-610EE1D6BA`;
pdf page = printed page + 17). You are correcting *other* documents so they no longer say what that source contradicts.

## Tools

```
cd C:\Dev\TurkaGame\TurkaVita
python scripts/find.py "Samarkand" -n 20           # artifacts that say it, with pdf pages of the evidence (--show ID for the whole artifact)
python scripts/search.py "Samarkand AND 1387" -n 5 --src SRC-610EE1D6BA    # the book itself
python scripts/search.py --page SRC-610EE1D6BA 51  # print a page
```
Run from the Bash tool with `PYTHONIOENCODING=utf-8`.

## The corrections (each row: what the older documents say → what is current, source)

| # | older documents say | current | source |
|---|---|---|---|
| 1 | Formation in Cairo "c. 1385–1397"; "A whole life… Cairo 1385 to exile 1432" | Born Isfahan 770/1369 ("almost certainly"). **1387: Temür takes Isfahan and spares the Turka family, taking it to his court at Samarkand** (brother Ṣadr al-Dīn made qadi; Ibn Turka, a teenager, studies under him). **c. 1393** he leaves (his brother's insistence) for Mecca and Cairo: **about fifteen years abroad, c. 1393–1408** (dates conjectured: "c."). In Cairo: Bulqīnī (hadith) and Akhlāṭī (d. 1397, *during* those years). Returns to Isfahan c. 1408 (perhaps 1408–9: "perhaps two or three years" after Temür's death in 1405). So a life "from Cairo 1385" is wrong: say "Samarkand 1387, Cairo from c. 1393" | dissertation pdf 51–52, 62–69; EVT-0003..0013 |
| 2 | "Second patron Bāysunghur (from c. 1416)", "second and longer-lasting patron" | **No source dates a Bāysunghur patronage.** Bāysunghur is appointed governor of Mazandaran and western Khurasan in 1415; **1414–c. 1422 is an attempted retirement** after Iskandar's fall; Bāysunghur appears as the **addressee/commissioner** of the *R. Suʾl al-Mulūk* (before 829/1426, "at his request") and of *Nafsat al-Maṣdūr II* (c. 1429–32), and his son ʿAlāʾ al-Dīn is the dedicatee of the *Tuḥfa-yi ʿAlāʾī* (1428). The later papers call him "second patron" without a start date. Say: "addressee and commissioner from 1426" | pdf 52–53, 69–70, 74; CL-0720; R8 notes |
| 3 | Patrons: "Iskandar Sultan c. 1409–1415" | Pīr-Muḥammad b. ʿUmar-Shaykh (Shiraz, c. 1408–9) first, murdered 1409; then **Iskandar Mīrzā** (rules Fars 1409; court at Isfahan 1412–14 per the timeline; the ranges 812–15 and 815–17 AH disagree; MK "(?)" on the qadi post); Iskandar rebels, is captured, blinded, later executed in **1414** (timeline 817/1414; the same date gets 1415 in one CE conversion) | pdf 51–52, 69; EVT-0014..0023 |
| 4 | "1420 — the pivot year": *Shaqq-i Qamar* written 1420; three things converge | The *Mafāḥiṣ* is dated 823/**1420** (a colophon date that may record copying; the day is disputed; place "Isfahan or Yazd?"; revised and expanded 1425 with Yazdī). **The *Shaqq-i Qamar* is 829/1426** (a terminus "before 28 Jan 1426", possibly a copy date; another listing prints 27 Feb). Ulugh Beg's observatory is context, not an event of his life | pdf 52, 99, 126–128, 332; CL-0534, CL-0216 |
| 5 | "Three inquisitions… He wins the first two; exact years are not established" | Melvin-Koushki writes of "three trials" (fn. 99) and never lists them in one place. His timeline and text give: **c. 825/1422** (Isfahan enemies accuse him of *ṣūfīgarī* at Shāhrukh's court; he travels to Herat, wins favour, is offered Isfahan, chooses Yazd — via *Nafsat I*); **829/1426** (Yazd elite: a delegation, then a case from youthful writings incl. a verse praising ʿAlī; *Nafsat I* + a creed tract); **830/1427** (Aḥmad-i Lur's attempt on Shāhrukh; the Ḥurūfī purge; Ibn Turka recalled, stripped, tortured, imprisoned, exiled). Mapping "the three" onto these is the project's reading | pdf 52–53, 70–75; CL-0064..0084; TURKA_AUDIT A.3 |
| 6 | "The full seven-tier hierarchy is an open research gap (5 of 7 unconfirmed)" | **Closed.** *R. Shaqq-i Qamar*, on Q 54:1: (1) jurists and traditionists, (2) dialectical theologians, (3) peripatetic philosophers, (4) illuminationists, (5) verifying mystics of the Ibn ʿArabī school, (6) lettrists, (7) ʿAlī and the Imams — "not entirely what it seems": level seven is peculiar to the present time, marked by a conjunction (MK's reading: not simply the Imams). Also a three-tier hierarchy in the *Sharḥ-i Naẓm al-Durr* (philosophers, Sufis, lettrists) | pdf 332–334, 471–479; CL-0500..0525 |
| 7 | "*Of Islamic Grammatology*… not held/acquired"; "*Selenocentrism and Heliocentrism* not in hand"; "three source papers in hand" | **Held**: 43 Melvin-Koushki texts (40 PDFs in `TurkaGame/research inbox/`, 3 on `E:\pdf`), ingested page by page in `TurkaVita/db/corpus.db`, including the dissertation, *Of Islamic Grammatology*, *Selenocentrism and Heliocentrism*, *The New Brethren of Purity*, *Ibn Turka's Pythagorean Sensorium*, *The Second Aristotle Turns Astro-Lettrist*, *Timurid-Mughal Philosopher-Kings*. (The portal also has 43 converted `.md` copies.) Not held: Dee is a scan without a text layer; no Timurid chronicles, no Persian editions of his works | corpus ingest |
| 8 | "Birthplace unknown" | "Almost certainly in Isfahan"; born 770/1369, derived from his own stated age (59) in *Nafsat I*; he died in Herat Monday 14 Dhū l-Ḥijja 835/12 Aug 1432 ("age 63" in MK; his own figures imply about 65 — a flagged inconsistency) | pdf 55, 74; R1 notes |
| 9 | Yazdī "likely copies the *Mafāḥiṣ* autograph (ff. 52a–56a) c. 1420–25" | ff. 52a and 118b of MS Majlis 10196 are **autograph** (incipit and explicit); the earliest copies carry a note that Yazdī **checked the copy and attended teaching** on the work (f. 119a; Beinecke Landberg 146 f. 179b). The *Prologue* says the hand of ff. 52a–56a is "almost certainly" Yazdī's: **MK's own texts differ**; unresolved | pdf 95, 97, 116; CL-0045; R3 |
| 10 | "Patronage was 'royal boons'" attributed to Ibn Turka's court life | *The Occult Court* uses commission/"royal boon" language for **ʿAlī Ṣafī's *Boon for the Khan* (1522)**, not for Ibn Turka | R8 notes |
| 11 | "Ibn Turka 'refused to bend the knee' at his inquisitions" (from the *Prologue*, uncited) | The dissertation shows defensive apologies to Shāhrukh (1426, and to Bāysunghur c. 1429–32); the *Prologue*'s line is uncited: record it as MK's remark, not as a finding | pdf 74–79; R8 |
| 12 | The apologies as "the" account of his life | They are the primary source *and* were "produced under great duress" and are "hardly reflective of his primary concerns" (MK, pdf 25). The game's duress rule: only what he wrote freely can support a claim about what he *held* | pdf 25, 75; CL-0100, CL-0167 |
| 13 | "Ibn Khaldūn tried to have Ibn Turka executed" (if present) | Only in *The New Brethren*; not in the dissertation (their Cairo residences overlapped). Mark as one paper's claim | R8 |

## Rules for your edits

1. **Correct the statement, keep the document's purpose and voice.** Don't rewrite a document wholesale unless it is mostly wrong; rewrite the wrong sections, keep the rest.
2. **Say what changed and why, in the document**: add a short `## Corrections (2026-09-27)` section at the end (or a top-of-file note for a data/JSON file, or an entry in its changelog) listing each change with its source (dissertation page or TURKA_AUDIT row). For **append-only ledgers** (`DECISIONS.md`) do not edit old entries: append a dated entry.
3. **Where the sources disagree, correct to the best-sourced statement and state the disagreement** (audit sections B and C). Never resolve a disagreement silently. Carry MK's hedges ("c.", "(?)", "presumably") and `date_kind`: a colophon date may be a copying date.
4. **Do not invent.** If you need a fact not in the artifacts or the book, open the page (search.py) and cite it, or leave the statement out.
5. **Games under `games/` are frozen v1** (`games/FROZEN.md`): correct their *documents* and record an erratum, but do **not** change their game code, data or behaviour. `games/visual-novel-v1/`, `-v2/`, `-v3/` are archived snapshots of earlier versions: do not touch them.
6. **Generated files**: if a file is generated (e.g. `site/plates/index.html`, `portal/site/`), fix its source and regenerate with the project's script; do not hand-edit generated output (see `CLAUDE.md` of that project). If you cannot regenerate, leave it and report.
7. Anything that is a **live game's content** (CareerSim's `content/*.js`) may have its date claims, source strings and labels corrected; keep encounter ids, effects and structure; run that project's tests after.
8. One writer per file. Edit only the files assigned to you.
9. Report: per file, what you changed (one line each), what you found and left (with the reason), and anything that needs Ted.
