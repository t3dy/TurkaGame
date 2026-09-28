# Ibn Turka: The Occult Court (Career Sim)

A career roguelike about trying to make a universal science real — playing
Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī (1369–1432), Chief Judge of Isfahan and the
foremost occult philosopher of Timurid Iran, through one compressed life: the years abroad (Samarkand from 1387, Cairo from c. 1393),
the judgeship, the Timurid courts, the composition of the *Investigations*, and the
three trials (Melvin-Koushki's phrase).

FTL's pressure grammar meets a capability×affordance encounter engine (adapted from
DungeonAB): your accumulated career — people, texts, sciences, institutional access —
determines what you can plausibly do in each situation. Success compounds Exposure;
the ending judges Ibn Turka and his system on separate axes. Every run writes a
period-style **Chronicle** you can keep and emend as its historian.

Built on the research of Matthew Melvin-Koushki (quoted with permission), via the
TurkaGame research layer (`../docs/BIOGRAPHY.md`) and the IslamicateOccultPortal
corpus. Every encounter carries an inspectable grounding tag: ATTESTED,
PLAUSIBLE-GAP, or INVENTED-COMPATIBLE.

**Status: Slice 1 playable** — the whole life, from the years abroad (Samarkand 1387, Cairo from c. 1393) to exile and death in 1432, as a static no-build site: serve the repo root and open `/CareerSim/`. 71 grounded encounters across five phases (14+14+16+13+14, per `node tools/analyze-content.mjs`; earlier versions of this file said 58). Design at [DESIGN.md](DESIGN.md);
build order in [docs/ROADMAP.md](docs/ROADMAP.md).

Stack (decided): Next.js + Supabase on Vercel; framework-agnostic engine; anonymous
local play always available.

## Corrections (2026-09-27)

Standing rule (Ted): correct older documents to the most current information. The current
picture of Ibn Turka's life is `../TurkaVita/docs/TURKA_AUDIT.md` and
`../TurkaVita/docs/CORRECTIONS_BRIEF.md`, from Melvin-Koushki's 2012 Yale dissertation
(pdf page = printed page + 17). Changed here, with encounter ids, effects and gates untouched:

- **"Cairo 1385 to exile 1432" and "Cairo formation c. 1385-1397" (title screen, this README,
  Phase I).** Born Isfahan 1369 (almost certainly); Temür took Isfahan in 1387 and carried the
  Turka family to Samarkand; c. 1393 he left for Mecca and Cairo and was abroad about fifteen
  years, c. 1393-1408 (dates conjectured); Akhlāṭī died 1397 *during* those years; return to
  Isfahan c. 1408. Phase I is now "Cairo and the road, c. 1393-1408"; the title screen reads
  "Samarkand 1387, Cairo from c. 1393 - exile 1427-1432". (Dissertation pdf 51-52.)
- **Phase II dateline** "c. 1397-1409" -> "c. 1408-1412" (return c. 1408; Iskandar's court).
- **"Second patron Bāysunghur from c. 1416" / "Iskandar Sultan c. 1409-1415".** Iskandar Mīrzā rules
  Fars 1409, court at Isfahan 1412-14 ("attached to"; MK marks the qadi post "(?)"), falls 1414
  (one CE conversion prints 1415). 1414-c. 1422 is an attempted retirement. No source dates a
  Bāysunghur patronage: he is governor of Mazandaran and western Khurasan from 1415 and the
  addressee/commissioner of the *Suʾl al-Mulūk* (before 1426) and *Nafsat II*. He stays a court
  on the board as a game choice, labelled so. "Iskandar Sultan" is kept as an alias. (pdf 51-52, 69-70, 74.)
- **"The 1420 pivot year."** The *Mafāḥiṣ* is dated 823/1420 (a colophon date that may record
  copying), revised 1425 with Yazdī; the *Shaqq-i Qamar* is 829/1426, not 1420; Ulugh Beg's observatory
  is context, not an event of his life. Phase IV is now "The Summa, c. 1420"; ids keep `pivot_`. (pdf 52, 99, 126-128, 332.)
- **The trials.** "Exact years not established" is closed: MK's timeline gives c. 825/1422, 829/1426 and
  830/1427; "three trials" is his phrase (fn. 99) and the mapping is the project's reading. The
  specific charges staged (Q 2:102, a quoted passage) are the game's, so `trial_first` and
  `trial_second` are now PLAUSIBLE-GAP rather than ATTESTED. (pdf 52-53, 70-75.)
- **The seven tiers are no longer a "gap".** All seven are on the page: (1) jurists and traditionists, who know only the outward form; (2) dialectical theologians; (3) peripatetic philosophers; (4) illuminationists; (5) verifying mystics of the Ibn ʿArabī school; (6) lettrists; (7) ʿAlī and the Imams — with level seven "not entirely what it seems" (peculiar to the present time, marked by a conjunction; Melvin-Koushki's reading is that it is not simply the Imams). `pivot_wafq` now states them. (pdf 332-334, 471-479.)
- **Yazdī.** He accompanied Ibn Turka from Samarkand (timeline), so "another Persian at the dials" is no
  longer a first meeting. The Mafāḥiṣ autograph: ff. 52a and 118b are autograph; Yazdī *checked the copy and
  attended teaching*; MK's Prologue calls the hand of ff. 52a-56a "almost certainly" Yazdī's, his own texts
  differ, unresolved. `pivot_yazdi_copy` is PLAUSIBLE-GAP. (pdf 95, 97, 116.)
- **"Royal boons".** *The Occult Court* uses commission/"royal boon" language for ʿAlī Ṣafī's *Boon for the Khan*
  (1522), not Ibn Turka; `court_commission` is PLAUSIBLE-GAP and its source string says so.
- **"Three papers in hand".** The project holds 43 Melvin-Koushki texts (`../TurkaVita/db/corpus.db`), including
  the dissertation; `content/citations.js` now names it.
- **The Attested Life rows** (`src/engine/career.js`) were rewritten to the same picture (Samarkand/Cairo, the
  Mafāḥiṣ date, the three dated trials, Qāsim-i Anvār "a Sufi friend and correspondent", Yazdī "checked a copy").
- **Left as is:** Qāsim-i Anvār's 1427 expulsion (CL-0078, CL-0110: same purge, checked); the Prologue's title
  "(1420)" (it is the paper's actual title); Qāsim-i Anvār as a Cairo companion in Phase I (a game scene; only a
  low-confidence hagiographical source, CL-0049, puts him near Akhlāṭī); old published witnesses (`witness/`),
  which carry the text of the day they were published; `tools/out/*.json` (generated).
