# Handover — Ulugh Beg, the Image Study, and the Portal Re-grounding

**Session of 2026-08-31.** Continues from commit `94d0339` (portal deployed, six
intersection essays, `build_site.py`). Everything below is committed; working tree clean.

Read this with [FOUNDER.md](FOUNDER.md), which holds the design proposals in full and is
the document a new session should open second.

---

## 1. What happened, in one paragraph

Matt asked for Ulugh Beg as Ibn Turka's would-be third Timurid patron. That turned out to
reorganise the whole patron structure, so it drove portal entries, a design document, and a
change to the sim. In parallel, four illustrations arrived and became a second workstream:
a cutting pipeline, a research database, and a study site. Along the way, reading the corpus
properly to ground the new entries exposed that a batch of earlier portal entries were thin
and, in one case, wrong — so part of this session was repair.

---

## 2. Commits

| | |
|---|---|
| `9b0d96b` | Re-ground portal entries in Matt's text; add `walaya`; fix the Ghazālī error; dedupe seed.json |
| `5c062ee` | Ulugh Beg as would-be third patron; FOUNDER.md; image-cutting pipeline |
| `aa90cc7` | Ulugh Beg into the sim; image research database and study gallery |

---

## 3. Portal state

**56 pages built.** 15 figures, 19 concepts, 3 institutions, 4 texts, 11 bibliography,
6 intersection essays, 2 synthesis essays.

### New this session
- **`ulugh-beg`** — the would-be third patron. The framing is the design: Iskandar Sulṭān
  commissioned the *Mafāḥiṣ* and was killed in 1415; Shāhrukh's court exiled him from Herat
  in 1427; Ulugh Beg, *al-sulṭān al-faylasūf*, was the one ruler whose programme **was** his
  programme, and it never arrived. Observatory and *Mafāḥiṣ* both begun in 1420.
- **`iskandar-sultan`** — without him, "third patron" means nothing.
- **`samarkand-observatory`** — argues the observatory sits *inside* this story. *Powers of
  One* p.1 makes the mathematicalization of the occult sciences the immediate context for
  the mathematization of astronomy at Samarkand.
- **`walaya`** — the largest gap in the portal. ~200 corpus hits across every major source,
  previously zero entries. It is the second limb of Melvin-Koushki's thesis: the occult
  sciences were reclassified as *sciences of walāya* at the same time as they moved into the
  mathematical sciences, and he argues this *alone* explains the surge in court patronage
  before the Islamic millennium.

### Corrections — read these before trusting older entries
- **`al-ghazali` was wrong.** It had him enabling later occultists by vindicating mystical
  knowledge. *Powers of One* p.1 lists him in the **anti-occultist camp** with Ibn Sīnā, Ibn
  Taymiyya and Ibn Khaldūn. He is part of the four centuries of polemic Ibn Turka had to
  answer, not a resource he drew on.
- **`sharaf-al-din-yazdi`** said "peer"; the dissertation (135–36) says *disciple and closest
  associate* — he attended his teacher's *majālis*, travelled with him to Herat, and cared
  for his children after his death.
- **`kitab-al-mafahis`** now has real dates (823/1420, revised 828/1425), the patron
  (Iskandar Sulṭān), the fourfold schema of the letter (*iḥṣāʾī* / *kitābī* / *kalāmī*, plus
  *fī anfusi-hā*), and its dependence on the uncreatedness of the Qur'an.
- **`neoplatonism`** rewritten from a 298-character stub.
- **`seed.json` had two duplicate figures** that `INSERT OR REPLACE` had been hiding, so the
  DB looked right while the file was wrong. Fixed, and `assert_unique()` in
  `seed_from_json.py` now fails loudly on recurrence.

### The honest state of the rest
Eleven stubs remain from an earlier push to hit an entry count, most under 300 characters:
`cosmic-hierarchy` (140), `mamluk-cairo-context`, `mystical-experience`,
`letter-correspondences`, `treatise-divine-names`, `occult-philosophy`, `timurid-patronage`,
`mirza-jan-mirza`, `universal-principles`, `mulla-sadra`, `ismail-safavi`, `book-of-light`.
Several are **redundant rather than merely thin** — `universal-principles`,
`occult-philosophy` and `occult-science-universal` are three pages restating one idea.
[portal/EXPANSION_AUDIT_AND_PLAN.md](portal/EXPANSION_AUDIT_AND_PLAN.md) proposes merging
four away, so entry count should go **down** (37 → 33) before it goes up.

---

## 4. Game state (CareerSim)

**25 engine tests pass** (`node CareerSim/tools/test-engine.mjs`).

- `ulughbeg` added to `content/people.js` with `observatory_access`,
  `mathematical_legitimacy`, `royal_protection`. The middle grant is the one no other patron
  can issue and should gate any endgame encounter where the defence is *"this is a
  mathematical science."*
- `src/engine/career.js` — the third patron slot was named for a city while the other two
  were named for men; now names him. Added `patron=ulughbeg` and `samarkand_nearmiss` lines.
- `content/phase5.js` — **Samarkand added to `trial_destination`**, where it had been
  conspicuously absent. Gated on `mem:observatory_work=true`, weighted **3:1 toward a
  near-miss**. Full patronage is a rare earned outcome; the default is an audience that goes
  well and a letter that never comes.

### Why the near-miss weighting matters
Every other failure in the sim is a tribunal, an exile, or a patron falling. This one is
just time running out, which is what actually happened, and the ending text should not read
as punishment for bad play. See FOUNDER.md §3.3.

### Not yet done in the game
- FOUNDER.md §3.4: the **1420 convergence beat** — the player finishes the *Mafāḥiṣ* the
  same year Ulugh Beg breaks ground. `phase4.js` already opens on the observatory; it should
  say both foundations were laid in one year, one in stone and one on paper.
- FOUNDER.md §3.5: the **two-hundred-year coda** — if the player's arithmetic got into the
  tables, close on the *Zīj-i Shāhjahānī* and its lettrist preface. Lose in 1432, win in 1650.
- The per-phase palette ramp (§5 below).

---

## 5. The illustrations

Four, in `research inbox/images/` (gitignored):

| id | what | provenance |
|---|---|---|
| `turka-triple-portrait` | **Ibn Turka, Qāḍīzāda Rūmī and Yazdī** in one arched niche, the elder explaining an open bifolium | **none — filename has no institution or shelfmark** |
| `akhlati-receiving-gifts` | Akhlāṭī receiving gifts from Barqūq | BL Or. 11837 f.117, Shiraz c.1560 |
| `samarkand-observatory-mural` | Ulugh Beg with astrolabe, apprentice with celestial globe | modern museum mural, photographed in situ |
| `yusuf-fleeing-zulaykha` | Bihzād's impossible palace | attributed by me, unconfirmed |

### Rights — this gates everything
Nothing derived is committed; `imagelab/output/` and `imagelab/site/` are both ignored.

- **`turka-triple-portrait` — UNKNOWN.** No shelfmark at all. **Identifying this is the
  single highest-value task in the project**: it is the only known group portrait of the
  three men, and it is the image the game most wants.
- **`samarkand-observatory-mural` — BLOCKED.** Modern mural, photographed. Two live
  copyrights, plausibly the muralist's and the photographer's. Style reference only; must be
  licensed or replaced.
- **`akhlati-receiving-gifts` — NEEDS VERIFICATION.** Best documented. BL has released much
  digitised Persian material as public domain but this item's terms are unchecked.
- **`yusuf-fleeing-zulaykha` — NEEDS VERIFICATION.** My Bihzād/Cairo *Būstān* attribution is
  from the picture, not a source; confirm against a specialist reference before treating the
  record as fact.

Deriving palette and composition carries no rights burden and has proceeded. Shipping files
cannot until each has a real licence string in `assets/manuscripts/registry.json`, added via
`register_asset.py` — never by hand-editing the registry.

**Two housekeeping notes:** a stray image was sitting in the repo root and my `git add -A`
swept it up; it is now filed under the ignored folder. And two source images had previously
been *tracked* in git; commit `5c062ee` untracks them.

---

## 6. imagelab/

```
imagelab/
├── data/regions.json     48 regions across 4 images; boxes + optional GrabCut seeds
├── data/images.json      the research database — provenance, rights, description,
│                         iconography, sourced claims, measured palette, game use
├── scripts/cut_regions.py     rect crops + GrabCut mattes
├── scripts/frame_portraits.py 7 arch-framed character tokens
├── scripts/build_gallery.py   the study site
├── output/               (ignored) 48 regions, 12 mattes, 7 portraits
└── site/                 (ignored) the gallery
```

### What worked, and what didn't — read before redoing it
**GrabCut mattes the mural cleanly and fails on the miniatures.** That is structural, not a
tuning problem: colour-model segmentation needs the subject to differ from the ground, and
in a Persian miniature the tilework is the same saturated flat colour with the same hard
edges as the robes, while the three principals physically overlap. **Seeding it with
foreground/background points was tried and moved the numbers by ~0.03** — `qazizada` got
*worse*, 0.421 → 0.385. The seeds are still in `regions.json` and the dead end is documented
in the script. Do not spend another session on it.

**The fix was to stop fighting the art and use its own device** — the pointed-arch niche.
`frame_portraits.py` masks a rect crop into a two-centred arch with a gold rule, giving
seven character tokens with one consistent period-correct shape. (The first arch drew a
notched battlement; it is now sampled properly.)

If a true silhouette is ever needed, the right approach is **polygon tracing**, not colour
segmentation — flat illustration has hard edges and no soft boundaries, so a hand-supplied
polygon rasterises perfectly. `regions.json` would take a `polygon` key alongside `box`.

### The measured palette result
Palettes are k-means over the painting area, not the margins. They confirm by measurement
the design claim FOUNDER.md had made by eye:

| | peak saturation |
|---|---|
| Akhlāṭī's court | **0.85** (vermilion `#b34a0e`) |
| Turka triple portrait | 0.81 (lapis `#0e4784`) |
| Yūsuf | 0.72 |
| Samarkand mural | **0.47** — nothing saturated at all |

The west-to-east cooling is real. FOUNDER.md §4.2 proposes driving a per-phase CSS palette
ramp off it: the occult court crowded, hot and dangerous; the observatory cool, open and
exact. That is the portal's whole argument expressed as colour, and it is cheap to build.

### Running it
```bash
python imagelab/scripts/cut_regions.py
python imagelab/scripts/frame_portraits.py
python imagelab/scripts/build_gallery.py
```
Verify over **http, not file://** — the preview inlines file:// pages as a `data:` URL and
relative CSS and images do not resolve. Use the `turkagame-site` launch config (port 7521)
and browse `/imagelab/site/index.html`.

**One tool caveat:** screenshots of the tall detail pages come back black below the fold,
while the index and the top of the same page capture fine. The pages are correct — verified
through computed styles and `get_page_text`, not pixels. Don't chase it as a CSS bug.

---

## 7. Where to pick up

**Highest value first.**

1. **Identify `turka-triple-portrait`.** It unblocks the best asset in the project.
2. **Portal repair, not expansion** — merge the four redundant concept stubs, deepen the
   rest against real corpus passages with page numbers. Yazdī is the strongest candidate:
   **369 hits across 26 sources**, a 978-character page, and he anchors intersection essay 08.
3. **Essays 01 and 02 have no frontmatter** and render on the live site as
   "01 Lettrism Universal Science" and "02 Isfahan Circle Timurid Court", sorted last at
   `order: 99`. They also substantially duplicate intersections 05/06/07, and yours are
   better. Ted's instruction was to **dissolve broad essay material into Turka-focused
   dictionary entries** that explain how he fits into or contributed to each tradition —
   `neoplatonism` is the worked example of that pattern. Do the same to 01/02 and retire them.
4. **Missing portal entries the new material needs:** `baysunghur`, `shahrukh` (the patron
   triad has no middle), `qasim-i-anvar` (co-exile of 1427, Cairo associate, Ṣafaviyya
   propagandist), `hurufism` (the heresy he had to be distinguished from — the dissertation
   distinguishes lettrists by *motive*, p.456), `zij-i-sultani`, and
   `munshaat-i-sain-i-turka`, his letter collection and a major biographical source.
5. **Game:** the 1420 convergence beat and the two-hundred-year coda.
6. **Manuscript scans**, when they arrive, are a distinct asset class — a different visual
   register from portraits, for study and writing encounters specifically. FOUNDER.md §4.4
   has the mapping and should gain a row for them.

---

## 8. Standing constraints

- Portal is **Turka-dedicated**. General Islamicate context belongs to the sibling
  `IslamicateOccultPortal`. An entry earns its place here by sharpening a Turka-specific
  question.
- **No manuscript image into `assets/` without a provenance record**, added via
  `register_asset.py`.
- **No copyrighted source PDFs in the repo**; `research/library/` and
  `portal/corpus/sources/` stay gitignored. Only original synthesis is published.
- `portal/db/turka.db` is generated and gitignored — **`portal/data/seed.json` is the
  tracked source of truth.**
- Mining discipline: `rank` → `kwic` → `read`, and every claim carries its page number.
  `python portal/scripts/mine_corpus.py --help`.
