# PLAN: a Turka game built like the Plotinus game

**Status: proposal for Ted, 2026-09-27. Built the same day as `TurkaVita/`; see `TurkaVita/docs/DESIGN.md` for what was built and `TurkaVita/docs/TURKA_AUDIT.md` for corrections to this plan** (the Peripatetic-ishraqi-Akbarian formula is Cooper's, not Corbin's; position E is the prosecution's reading with no modern advocate; F is MK's caveat, not his conclusion; "three inquisitions" is MK's phrase and he never lists them). Working title *Turka Vita*
(the Latin is a nod to Porphyry's *Vita Plotini*; the name is the cheapest thing to change).
Written after reading `C:\Dev\PLOTINUSGAME` (CLAUDE, HANDOVER, ARCHITECTURE, DESIGN, ROADMAP,
DECISIONS, the engine, a scene spec, a hypothesis, a biographical model) and, on the Turka side,
`docs/BIOGRAPHY.md`, `LETTRISMRESEARCH.md`, `HANDOVER.md`, `CareerSim/`, and — the find that
reshapes the plan — Melvin-Koushki's 2012 Yale dissertation, which is already on disk.

---

## 0. The three findings that shape everything

1. **The best biographical source is already in the portal corpus and this project has not used it.**
   `portal/corpus/sources/melvin-koushki-dissertation-yale-2012.md` (2.1 MB, page-break markers and
   printed running heads intact) contains: a **dated life timeline** (addenda A.1, ~40 entries with
   Hijri/CE dates, uncertain ones marked), an **intellectual-network diagram** (A.2), **Ch. 1 the life**
   (family, Samarkand, Cairo, each court, the trials, exile, death), **Ch. 2 the oeuvre** (44–45 works,
   each with date, dedicatee, manuscript folios, edition status; plus 58 letters), the **full seven-tier
   hierarchy** (Ch. 6.1, p. 315) and translated excerpts of *Mafāḥiṣ* and *Shaqq-i Qamar*.
   `docs/BIOGRAPHY.md` was built from the three shorter papers and never touched it. Around it sit ~40
   more Melvin-Koushki texts in the same folder, including *Of Islamic Grammatology* (2016),
   *Ibn Turka's Pythagorean Sensorium*, *The Second Aristotle Turns Astro-Lettrist* (Yazdī),
   *Timurid-Mughal Philosopher Kings as Sultan Scientists* (courts), *The New Brethren of Purity*,
   *Selenocentrism and Heliocentrism*.
2. **The existing Turka docs have drifted from that source, in ways that matter to a game about
   decisions.** Verified against the dissertation's timeline (still to be re-checked against the 2025
   papers, which may say otherwise):

   | our doc says | the dissertation says |
   |---|---|
   | BIOGRAPHY: formation "in Cairo c. 1385–1397" | Taken with his family to **Temür's court at Samarkand in 1387** (he is ~18; his brother Ṣadr al-Dīn is made qadi there); leaves c. 1393 for Mecca and **Cairo, 15 years abroad (c. 1393–1408)**; Akhlāṭī dies 1397 while he is still there |
   | "second patron Bāysunghur from c. 1416" | 1414–c. 1422 is an attempted **retirement** after Iskandar's fall; Bāysunghur appears as **addressee** of *Suʾl al-Mulūk* (1426) and *Nafsat al-Maṣdūr II* (c. 1429–32), not as a documented long patron. Needs checking, not asserting |
   | "exact years of the first two inquisitions not established" | Timeline dates them: **c. 1422** (Isfahan enemies accuse him of *ṣūfīgarī* before Shāhrukh at Herat; he wins, takes a judgeship at Yazd), **1426** (Yazd elite send a delegation, then a case built from his youthful writings, incl. a verse praising ʿAlī; he writes *Nafsat al-Maṣdūr I*), **1427** (Aḥmad-i Lur's attempt on Shāhrukh; arrested, tortured, stripped, exiled). "Three trials" is MK's own phrase (Ch. 1 fn. 99); the mapping to these three dates is my reading |
   | "full seven-tier hierarchy is an open research gap" | **Closed**: Ch. 6.1 p. 315 gives all seven — jurists/traditionists; theologians; peripatetics; illuminationists; Akbarian mystics; **lettrists (6)**; **ʿAlī and the Imams (7)**. He wrote it in 1426, the same year as the hyper-Sunni apology |
   | LETTRISMRESEARCH §8: "*Of Islamic Grammatology* … not held" | It is held: `portal/corpus/sources/melvin-koushki-of-islamic-grammatology.md` (73 pp.) |
   | "birthplace unknown" (BIOGRAPHY open gaps) | "almost certainly in Isfahan" (Ch. 1.1) |

   First job of the project is therefore a **reconciliation audit** (§5, slice 1), the analogue of
   Plotinus's `VITA_AUDIT.md`, and the drifted docs get corrected with a pointer, not silently.
3. **The Turka evidence has a different shape from Plotinus's, and the design should follow the shape,
   not copy the outline.** Plotinus's problem is *one biographer who is also a character* (Porphyry)
   and a doctrine-provenance dispute. Turka's problem is **the subject himself is the primary witness,
   and he is writing to the rulers who are judging him.** MK: the apologies "are the primary source of
   information about his life" but were "produced under great duress" and are "hardly reflective of his
   primary concerns." That is a mediation layer with `shaping_risk: high`, and it is *better* material
   for this pipeline than Porphyry was: the same person is protagonist, author and defendant.

---

## 1. What the Plotinus game is (the pattern being copied)

| layer | what it is | where |
|---|---|---|
| corpus | page-indexed full text in SQLite FTS5; **gitignored** (copyright) | `db/corpus.db`, `scripts/ingest_corpus.py` |
| knowledge | typed JSON artifacts, git is the truth: EV evidence (source_id + witness page), CL claim (epistemic type + mediation), REC reconstruction, EVT event, MOD whole-life model per scholar, **HYP** hypothesis in a dispute, DEC decision | `research/artifacts/**`, `schemas/artifacts.schema.json` |
| provenance | every reference becomes a graph edge; `--ancestry SCN-x` answers "why does this scene exist?" | `scripts/build_artifacts.py` |
| scenes | spec (dramatic question, **invariants that must rest on attested/directly-inferred claims**, choices carrying one of five labels: documented · reconstructed · contested · unknown · counterfactual) | `narrative/scenes/SCN-*.json` |
| gates | linter (invariant rests on attested claim; reconstruction never presented as documented; no dead ends), state simulator (20,000 random walks), Python↔JS engine parity, coverage ledger | `scripts/lint_scenes.py`, `simulate.py`, `tests/` |
| scoring | four axes: doctrine, biography, textual, **calibration** (claim only what evidence supports; biography and calibration deliberately pull against each other) | `game/engine.js` |
| the dispute as mechanic | dossier (what you have read) × lens (a scholar) × commitment (scored against **your own** dossier, never a designer's answer); a *direction-of-transmission* rule stops parallels from proving borrowing | HYP-A..F, `scripts/triad.py` |
| the switch of role | Act III turns Plotinus's world into a historiographical simulation: what you invented as him is all you can write as his biographer | Porphyry acts |

Two properties to keep, because they are what makes it more than a branching story: **a scene can be
debugged downward** (scene → claim → evidence → page), and **the game does not know which hypothesis
is right.**

---

## 2. The mapping: Plotinus → Turka

| Plotinus game | Turka game | note |
|---|---|---|
| unrecorded Egypt years (the gap to fill) | **1408–1422** (return, courts, retirement) and **the exile itinerary 1427–1432**; before 1387 is a blank | gaps are smaller and more dated than Plotinus's; the drama is in *choices at known dates*, not filling a void |
| Porphyry's *Life* = sole witness, mediated | **the apologies (*Nafsat al-Maṣdūr* I 1426 to Shāhrukh, II c. 1429–32 to Bāysunghur), creed tracts, the 58 letters (*Munshaʾāt-i Turka*/*Yazdī*), colophons of MS Majlis 10196**; later voices: Ibn Ḥajar on Akhlāṭī, Gāzurgāhī, Dawlatshāh, Khwāndamīr, Bākharzī on Jāmī's disdain, Kāzirūnī via Mufīd Mustawfī | mediation chain: event → his self-report *to his judge* → Yazdī's copying/audition → Timurid biographers → MK 2012 → game. Shaping risk per link |
| treatise chronology (54, Porphyry's numbers) | **work chronology**: ~20 works datable by colophon, **but MK warns a date may be transcription not composition**; two-thirds of the works in Majlis 10196 were copied 1425–27 in near-perfect chronological order, "perhaps … as part of the evidence in defense of his orthodoxy" (Ch. 2 intro) | this is the Turka version of Porphyry's editorial arrangement, and it is a *legal* arrangement |
| the edition (six nines) | **compiling MS Majlis 10196**: what goes in, in what order, what is left out, for whom (a court dossier vs a school's canon) | copyist unidentified (Dānishpazhūh conjectures Khwāja Ẓahīr al-Dīn Muḥammad); Yazdī checked copies and sat in on *Mafāḥiṣ* teaching (colophon f. 119a) |
| the Gnostics in the seminar / triad dispute | **who was Ibn Turka?** — Shiʿi esotericist (Corbin, per MK) · orthodox Sunni Sufi (Lewisohn, per MK) · mystical-philosophical synthesizer (the "de facto consensus", MK) · occult philosopher / intellectual lettrist / imamophile (MK) · **Ḥurūfī sympathizer (the prosecution's reading; no modern advocate)** · underdetermined | see §4; the prosecution's hypothesis plays the role of HYP-C: real ingredients, no scholar to stand behind it |
| direction-of-transmission rule (parallels can't prove borrowing) | **the duress rule**: testimony given to your judge can show *what he told whom*, not *what he held* | MK states the principle himself |
| Porphyry's absence in Sicily | **Ibn Turka's absence**: what a court knew of him vs what he wrote; Yazdī outlives him by 22 years | |
| career state (◻ in Plotinus, unbuilt) | **built here**, borrowing CareerSim's idiom (patron contracts, obligations, compounding exposure); pressure fields, never scores | Plotinus's roadmap says "borrow CareerSim before inventing"; this is where that lands |

---

## 3. The game

### 3.1 The principle for choices: fixed points and a wide margin

Plotinus's scenes are mostly one decision inside a fixed world. Turka's life is **court politics**, so
the design rule is:

> **External events are fixed points; the player's margin is who you attach to, what you write, and how
> you defend it.** Temür takes Isfahan (1387), Temür dies (1405), Pīr-Muḥammad is murdered (1409),
> Iskandar rebels and is blinded (1414), Aḥmad-i Lur strikes (1427), Shāhrukh dies in 1447 (⚠ context,
> not in hand). None can be prevented. What the player controls is exposure to them.

Each fixed point is an `attested` invariant the linter enforces. A branch that avoids an arrest is
labelled **counterfactual** and must say what it changes; it rejoins the record at the next fixed point
or the run ends "off the record" and the end screen says so (the Plotinus counterfactual convention).

### 3.2 Acts (dates from the dissertation timeline; every scene cites its page)

| act | you are | fixed points | the decisions |
|---|---|---|---|
| **I. Hostage and student** 1387–1408 | Ṣāʾin al-Dīn, 18 → 39 | Temür's massacre and the sparing of the Turkas; Ṣadr al-Dīn made qadi; Bulqīnī d. 1403; Akhlāṭī d. 1397 | leave Samarkand at your brother's insistence (the family's law career vs learning abroad); Bulqīnī's hadith vs Akhlāṭī's circle; at Barqūq's majlis, **what you say when the sultan asks your opinion of al-Jazarī** (he becomes the enemy who "later caused much grief"); whether to take Akhlāṭī's whole millenarian programme or only its systematics (MK: you become "the systematizer"; you never name him, only *our Sayyid*); Yazdī as companion |
| **II. Isfahan, Shiraz, and the princes** 1408–1422 | qadi and teacher | Temür d. 1405; Pīr-Muḥammad murdered 1409; Iskandar rules Fars, court at Isfahan 1412–14; **Iskandar rebels 1414, blinded, killed** | quiet contemplation vs Pīr-Muḥammad's summons; Iskandar's honours (an overt imamophile patron with a taste for lettrism: *R. Ḥurūf* "for Iskandar (?)" 1414); harassment and moving to Shiraz, putting forward a protégé as qadi; after 1414, **retire or stay visible**; *Sharḥ Fuṣūṣ* (1411, corrected 1415); the *Mafāḥiṣ* completed 1420 |
| **III. The trials** 1422–1427 | judge at Yazd, author, defendant | the accusations; Aḥmad-i Lur strikes Shāhrukh, 1427 | **Herat 1422**: accept the Isfahan judgeship Shāhrukh offers or ask for Yazd; the Yazd years' works (*Anjām, Nuqṭa, Inzāliyya, Muḥammadiyya, Shaqq-i Qamar, Sharḥ al-Basmala* copied to Ulugh Beg and Qāḍīzāda Rūmī); **Bāysunghur's request: *Suʾl al-Mulūk*** (political divination for a prince); **1426: compose the apology** (§3.4); 1427 arrest, torture, exile |
| **IV. Exile** 1427–1432 | wanderer with ten children | Shāhrukh's Azarbayjan campaigns; al-Jazarī d. 1429 | letters to Marʿashī (Mazandaran) and Kārkiyā (Gilan) courts, to Amīr Fīrūzshāh; *Tuḥfa-yi ʿAlāʾī* for ʿAlāʾ al-Dīn b. Bāysunghur, *Mabdaʾ u Maʿād* for Shāh Rażī l-Dīn, *Manāhij* for your son; the failed hearing at Simnan; the hearing at Ṣāʾin Qalʿa; **nine months' weekly attendance at Herat**; *Nafsat II*; death, 14 Dhū l-Ḥijja 835/12 Aug 1432 |
| **V. The collection** c. 1425–1435 | the (unnamed) copyist of MS Majlis 10196, with Yazdī | half copied as a defence dossier 1425–27; second half 1427–35; the *Mafāḥiṣ* autograph at ff. 52a, 118b | **what goes in the volume and in what order**; whether to leave out the youthful ʿAlī verse's neighbours; audition certificates. Scored against the real manuscript order (Kendall distance, as the Plotinus edition puzzle was designed) and by what the volume *says* about its author to a reader |
| **VI. The historian** | a reader of the record | — | the identity dispute (§4); the end screen "whose Ibn Turka did you play?" (MOD per scholar, an affinity count not a probability); the Dee epigraph MK himself chose for §1.3 as a closing note |

Acts I–IV are the Plotinus game's Acts I–II; V is its edition; VI is its third act.

### 3.3 Interactions with courts and rulers: a board, not a menu

Ruler and court relations are the centre of the brief, so they get a first-class system rather than
flavour text. **Patrons are transactional in the sources** (MK, *The Occult Court*: works commissioned
as "royal boons," the patron's taste shaping how openly the author wrote) and the game says so.

- **Courts on the board** (each an `institution` artifact with dated tenure): Temür (Samarkand),
  Barqūq (Cairo), Pīr-Muḥammad (Shiraz), Iskandar (Shiraz/Isfahan), Shāhrukh (Herat), Bāysunghur,
  Ulugh Beg (as recipient), Amīr Fīrūzshāh (Isfahan/Yazd), Marʿashī and Kārkiyā sayyids, Shāh Rażī
  l-Dīn, ʿAlāʾ al-Dīn b. Bāysunghur, and the Aq Quyunlu/Qara Quyunlu as the context that unsettles Fars.
- **State (pressure fields, never scores):** favour per court; **exposure** to a Ḥurūfī association
  (compounds, does not reset — CareerSim's rule); livelihood (ten children); students in circulation;
  works in circulation (the *Mafāḥiṣ* is sought "from Anatolia to India"); enemies (al-Jazarī, the
  Isfahan "connivers," the Yazd *mutaghallibān*); allies (Yazdī, Niʿmat Allāh Valī, Qāsim-i Anvār).
  Unknown ≠ zero: where the sources are silent the variable is `unknown`, and a scene may say so.
- **Every choice shows what it costs and with whom**, with locked options shown and their requirements
  named (CareerSim/DungeonAB idiom, and TurkaGame's own "instructions err on too much" rule).

### 3.4 The writing of the works: a commission you compose

Plotinus's writing scenes are doctrinal rulings. Turka's are **occasions**: a patron, a moment, a
genre, a risk. Every work in the ledger carries `patron / occasion / language / genre / date_kind
(composition | transcription) / MS folio / tier in his hierarchy`, and each one that is playable has the
same three-move shape:

1. **Register** — Persian ornate prosimetrum (*Sharḥ-i Naẓm al-Durr*, *Munāẓarāt-i Khams*) or technical
   Arabic (*Mafāḥiṣ*, *Tamhīd*, *Manāhij*)? The Kāshifī contrast is in the sources: hoard for prestige,
   or teach for reach.
2. **What to reveal** — the lettrist core, or the same content under Sufi/hadith dress? This is the
   mechanic that carries the doctrine: MK's point is that Ibn Turka shows a verse "at every
   epistemological level simultaneously," and that the apologies show only the levels safe to show.
3. **Whom to dedicate it to** — which changes who reads it and what it can be used to prove.

**The showpiece scene is the 1426 apology** (Act III), because it is both the densest source and the
best test of the whole design. The player *builds* the *Nafsat al-Maṣdūr I* from the moves the text
actually contains — nine hadith against innovation (*bidʿa*); Sufis as the epitome of the Sunna, with
Khwāja Muḥammad Pārsā (Shāhrukh's favourite) as the named example; the accusers' silence on
astronomy/astrology, which flourish at court despite the Quran; the *Kashshāf*'s open Muʿtazilism that
every scholar still admires; the equation of Muʿtazilism, Shiʿism and philosophy against the Sunna —
plus the alternatives he did **not** take (an unmasked lettrist defence; naming ʿAlī). Scored on
biography (is this what he wrote), doctrine (does it match the *Shaqq-i Qamar* written the same year
that puts the Imams at tier seven) and calibration (does the player claim the apology shows what he
believed).

### 3.5 Scoring

Keep the four axes and their definitions; add nothing scored that a source cannot ground.

| axis | measures here |
|---|---|
| biography | fidelity to the attested course of the life (timeline + Ch. 1) |
| textual | fidelity of works and of the *Majlis 10196* arrangement (which works, when, for whom, in what order) |
| doctrine | proximity to his positions: lettrism above philosophy (*coincidentia oppositorum*); the seven-tier hierarchy; *Mafāḥiṣ*'s Planet→Pearl→Peach; the Imams as the seventh tier |
| calibration | claiming only what the evidence supports — **and the duress rule in particular** |

Biography and calibration pull against each other on purpose (as in Plotinus): being faithful to
what he said to Shāhrukh and being faithful to what we can know of what he held are different
achievements, and the end screen shows both.

---

## 4. The dispute as a mechanic: who was Ibn Turka?

Port the Plotinus dossier / lens / commitment system unchanged in shape; change the data.

| pos. | reading | who (per MK's characterisation; verify each in Ch. 1, Intro §I.1) |
|---|---|---|
| A | standard-issue Shiʿi esotericist (Peripatetic + ishrāqī + Akbarian synthesis) | Corbin |
| B | orthodox Sunni Sufi thinker | Lewisohn, on the apologies |
| C | mystical philosopher, Ibn ʿArabī → Mullā Ṣadrā transmitter, centred on the *Tamhīd* | the "de facto scholarly consensus" (MK) |
| D | occult philosopher; intellectual lettrism; **imamophile** ("Shiʿi-Sunnism") | Melvin-Koushki |
| E | Ḥurūfī sympathizer / subversive | the prosecution at Herat, 1427 — historical actors, not scholars |
| F | underdetermined: the surviving record is duress-shaped | methodological position |

**Bearings** point at evidence of these kinds — `apology` (addressed to the judge), `creed_tract`,
`letter` (to third parties), `colophon`, `autograph`, `early_work` (the ʿAlī verse), `hagiography`,
`chronicle`, `reception` (Jāmī's disdain, Dawlatshāh). **The duress rule** replaces the
direction-of-transmission rule: only `letter`, `colophon`, `autograph` and pre-accusation `early_work`
can support a claim about what he *held*; an `apology` can support only a claim about what he *told
whom*. Claim inner conviction from the apologies alone and you are charged `coerced_testimony`, with
MK's objection as the feedback.

The datum that makes it a puzzle is one MK hands over: **in the same year (1426) he wrote a hyper-Sunni
apology to Shāhrukh and a hierarchy that ends in ʿAlī and the Imams.** Each position reads that
differently; the game collects the readings and lets the player try to say something.

*Bias to control:* the project stands on MK, and D is his. Rule 10 applies: **the game must not know
which position is right.** MK's reading is one lens with a visible attribution (the end screen says
"this is Melvin-Koushki's Ibn Turka"), and the tests hold the game's own readings ("design inference")
under a quarter, as Plotinus's do.

---

## 5. Build plan: slices with hard gates

Follows `C:\Dev\AGENTS.md` roles (RESEARCHER → EXTRACTOR → DESIGNER → BUILDER → VERIFIER), handovers
through files, **one writer per file**, per-item extraction jobs via `tools/batch/` with a manifest
checkpoint (`CONTEXTENGINEERINGGAMEPIPELINES.md`). Check `research-artifacts/INDEX.md` before reading
any source.

**Location (default, changeable):** `C:\Dev\TurkaGame\TurkaVita\`, a subproject with its own CLAUDE.md
like CareerSim. Reason: the corpus is already under `../portal/corpus/`, it deploys through the existing
GitHub Pages repo (hosting policy), and the "no shared code across games" rule is respected by
*copying* the Plotinus scripts and parameterising them, not importing them. Plotinus itself was made
a sibling and shares "through documents, not code"; do the same here.

| slice | what | gate (hard) |
|---|---|---|
| **0. Scaffold** | copy `ingest_corpus.py`, `build_artifacts.py`, `lint_scenes.py`, `simulate.py`, `narrative_lib.py`, `tests/`, the schema. Two witnesses exist: the 40 Melvin-Koushki **PDFs in `research inbox/`** (gitignored, all with text layers, so PyMuPDF gives true PDF page numbers) and the portal's 43 page-broken `.md` conversions (`---- page break ----`; `portal/scripts/mine_corpus.py` already ranks/kwic-searches them). Prefer the PDFs for `witness_page` and read the printed folio from the running head (e.g. `chapter one | 58`) into `printed_page`; the `.md` files are the fast reading copy. `ingest_corpus.py` hardcodes `E:\pdf\neoplatonism` and a `## Page N` reader, so it needs parameterising, not just copying | `search.py "Nafsat AND Shāhrukh"` returns page-cited hits; `python tests/run.py` green on an empty artifact set; `db/*.db` is gitignored |
| **1. The life as data + reconciliation** | RESEARCHER passes on dissertation A.1, A.2, Ch. 1 → `research/biography/biography.json` (phases, ~40 events, decisions with counterfactuals, mysteries, each with date_kind: attested / colophon-dated / conjectured — the dissertation marks these with (?) and asterisks). Then diff against `docs/BIOGRAPHY.md`, `site/data/timeline.json`, the VN's 40 choices, CareerSim's 70 encounters → `docs/TURKA_AUDIT.md` (analogue of `VITA_AUDIT.md`) | every event cites (source, witness page); the audit lists every discrepancy in §0's table and any it finds beyond it; **no doc is corrected until Ted has seen the audit** |
| **2. The oeuvre ledger** | new artifact type `work` (fields in §3.4); one batch item per work from Ch. 2.1 (44–45 entries, plus correspondence letters as evidence records); `research/coverage.json`: works researched / built, and letters researched / used | 45/45 rows exist; every date has a `date_kind`; the composition-vs-transcription caveat is machine-readable and the linter refuses to state a composition date as fact when it is transcription-only |
| **3. Vertical slice: 1422–1427** | the densest stretch: two courts, three trials, six-plus works, and the only place both of Ted's emphases (rulers, writing) overlap. Scenes: Herat 1422 → the Yazd years → *Suʾl al-Mulūk* for Bāysunghur → the 1426 apology → 1427 arrest. Includes the court board and the composer | linter 0 errors; simulator 0 stuck; Python↔JS parity; **How to play panel in full sentences** (TurkaGame ground rule: goal, every control, what the cursor does, how to preview, how to reset); driven in the browser with screenshots, not just re-read |
| **4. Backfill** | Acts I, II, IV | same gates; coverage ledger shows *unresearched* vs *unbuilt* separately (the workspace rule) |
| **5. The collection** | Act V: order the volume, Kendall distance to the real MS order; needs the folio table for Majlis 10196 extracted from Ch. 2 (each work lists its MS and folios) | extraction table complete before any code; parity test covers the scoring |
| **6. The dispute** | HYP A–F, bearings, lenses, commitment scenes, end screen | `tests/test_dossier.py` ports the Plotinus checks: every bearing points at a real evidence artifact; every reading names whose it is; design inferences < 25%; no position unopposed; with the whole record read and no lens the field does not separate (or the test says why not) |
| **7. Ship** | GitHub Pages under the TurkaGame repo; `DEPLOY_STATE.md`; the `GITHUB_PAGES` base-path check | fetch the live URL and play the slice-3 path there; a green push is not a deploy |

**Not in scope until slice 3 has passed:** a lettrist-engine mini-game for the *Ṭahawī Circle*. If it
comes, it must pass the workspace legibility gate ("a player can recover the symbolism from behaviour
without being told") and could reuse the *Mafāḥiṣ*'s order — Planet (mental) → Pearl (written) → Peach
(spoken) — as an ordering puzzle beside the volume-ordering one. v2's engine stays untouched.

---

## 6. Where the sources run out (say so in the game, do not invent past it)

- **The apologies exist here only through MK's summary and quotation.** The Persian editions
  (Sharḥ-i Naẓm al-Durr, ed. Jūdī-Niʿmatī, *SND*; the apologies' own editions) are not held. So the
  1426 scene may use only the arguments MK reports (Ch. 1.3) unless Ted OKs fetching an edition. A scene
  may not put words in the apology that MK does not report.
- **Everything rests on Melvin-Koushki.** A disk survey found no Timurid chronicle or secondary
  literature (Yazdī's *Ẓafarnāma*, Khwāndamīr, Dawlatshāh, Manz, Subtelny, Binbaş's study of Yazdī —
  which the dissertation leans on) and no primary text of the *Mafāḥiṣ*, *Tamhīd*, *Sharḥ Fuṣūṣ* or
  *Nafsat al-Maṣdūr*. Even the later voices in §2 (Ibn Ḥajar, Jāmī, Dawlatshāh) are known only as
  he translates or cites them, so `mediation` on those is "MK reporting X." The game should say so on
  the end screen. Also: the Dee article is a scan with no text layer (needs OCR, and is comparison
  material, not biography).
- **The portal DB does not carry page-level citations.** `portal/db/turka.db` has 47 timeline events,
  20 figures, 11 texts, but `scholarly_refs` is empty and most events name a paper, not a page; the
  timeline's "first two inquisitions" is a placeholder. It is a useful seed list, not evidence.
- **Unrecorded:** anything before 1387; the years 1408–09; the retirement years 1414–22 in detail; the
  exile itinerary between dated points; Hamadan/Tabriz stays are "appears to have" (Ch. 1.2).
- **Marked uncertain by MK himself:** Iskandar appointing him qadi "(?)"; *R. Ḥurūf* for Iskandar "(?)";
  place of the *Mafāḥiṣ* (Isfahan or Yazd?); the Baghdad Sufi-master story (Kāzirūnī via Mufīd
  Mustawfī) is reported "with several grains of salt."
- **No contact with any European figure**, ever. Dee/Cusa/Bruno enter only as MK's own comparison, in
  the historian's layer or an epilogue (the existing rule in `docs/BIOGRAPHY.md`). MK's own §1.3
  epigraph pairing Yazdī with Dee's petition to the king is a natural end-screen line.
- **Other Melvin-Koushki texts** (the ~40 in the corpus) are read on demand by the RESEARCHER role for
  the scene that needs them, not swept: *Timurid-Mughal Philosopher Kings* and *Occult Court* for the
  courts, *Selenocentrism and Heliocentrism* for the *Shaqq-i Qamar*, *Second Aristotle* for Yazdī.

---

## 7. Proposed decisions (for `docs/DECISIONS.md` once Ted rules)

1. New subproject `TurkaGame/TurkaVita/`; copy-and-parameterise the Plotinus pipeline; no shared code.
2. The 2012 dissertation is the **spine source** for the life and the oeuvre; the shorter papers and
   `docs/BIOGRAPHY.md` are demoted to secondary until reconciled.
3. Fixed points / wide margin: external events are invariants; player choices are attachments, works
   and defences.
4. The duress rule replaces the direction-of-transmission rule in the dispute mechanic.
5. Act V is the unnamed copyist of MS Majlis 10196, **not Yazdī**, because the attested facts (he checked
   copies and attended teaching) fall short of "Yazdī compiled it." Yazdī is a consulting character.
6. Career state is pressure only, never scored (Plotinus's own rule), using CareerSim's idiom.
7. The game's own readings stay under 25% of all bearings and it does not know which identity is right.

## 8. What I need from Ted

1. **Slice 3 first?** I recommend starting with 1422–1427 rather than chronologically, because it holds
   the trials, both patrons and half the datable works. The alternative is Act I first, as Plotinus
   began with Egypt.
2. **Act V as the unnamed copyist** (recommended) or as Yazdī (more dramatic, less supported)?
3. **Correct the drifted docs now** (BIOGRAPHY.md, LETTRISMRESEARCH §8, the VN's Cairo-first framing) or
   only after the slice-1 audit (recommended, since the 2025 papers might disagree with the dissertation)?
4. **Fetching a Persian edition of the apologies** if one can be found: permission needed per the
   download rule. Without it, the 1426 apology scene is built from MK's summary alone.

## Corrections (2026-09-27)

Per Ted's standing rule (older documents are corrected to the most current information): open question 3 of § 8
("correct the drifted docs now, or only after the slice-1 audit") is **decided: now**. On 2026-09-27
`docs/BIOGRAPHY.md`, `docs/RESEARCH_BRIEF.md`, `LETTRISMRESEARCH.md` § 8 and the other prose documents were
corrected to the dissertation (`docs/DECISIONS.md`, 2026-09-27); "`docs/BIOGRAPHY.md` was built from the three shorter
papers and never touched it" (§ 1 item 1) and the § 2 table are therefore now past tense: the documents it lists as
drifted have been corrected. The frozen v1 visual novel's "Cairo-first" premises are recorded in
`games/visual-novel/ERRATA.md`, not changed.
