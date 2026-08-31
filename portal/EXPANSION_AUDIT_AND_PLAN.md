# TurkaGame Portal — Expansion Audit & Plan (rev. 2)

**Revised after** commit `94d0339` (portal deployed, six intersection essays, `build_site.py`).
Supersedes rev. 1, which was written before the portal's scope and publishing
pipeline were settled and got several things wrong.

---

## What changed, and what it invalidates

The other window settled three things that reshape this plan:

1. **The portal is Turka-DEDICATED.** General Islamicate context lives in the
   sibling `IslamicateOccultPortal`. This portal's centrepiece is the six
   **intersection** essays: *where does Ibn Turka meet each general context, and
   what changes when he does?* An entry earns its place here if it sharpens a
   Turka-specific question — not because it is a topic in Islamicate occultism.

2. **Every entry is now a published page.** `build_site.py` renders 52 pages from
   `db/turka.db` + `essays/`. Thin entries are no longer invisible rows in a
   database; they are pages a reader can land on.

3. **The builder renders figures, concepts, institutions, texts, bibliography,
   essays — and nothing else.** No timeline, no arguments.

**Invalidated from rev. 1:**

- **"Arguments" category (5–8 entries) — drop it.** The intersection essays *are*
  the historiographical arguments, in a better form. Six of the eight I proposed
  are already written and live.
- **"Timeline" category (15–25 entries) — blocked, not planned.** The
  `timeline_events` table exists but nothing renders it. This needs a
  `build_site.py` decision first (own page? inline on the Ibn Turka page?).
- **Broad-context entries — reconsider.** Rev. 1 proposed Nizamiyya, Malik Shah,
  Ibn Taymiyyah, Mamluk Sultanate, etc. Most of these are *IslamicateOccultPortal*
  material. Here they are justified only where Ibn Turka's own story turns on them.

---

## Defects to fix first (mine, from the entry-count push)

I generated a large share of the current entries under pressure to hit a number.
That produced measurable damage, now visible on a deployed site:

### 1. My two essays render with filename titles

`01_lettrism_universal_science.md` and `02_isfahan_circle_timurid_court.md` have
**no frontmatter**. `read_essays()` falls back to the filename, so the live index
reads:

- "01 Lettrism Universal Science"
- "02 Isfahan Circle Timurid Court"

They also default to `kind: essay`, `order: 99` — sorted last, unlabelled.

### 2. Those same two essays substantially duplicate the new intersections

| Mine | Overlaps | Whose is better |
|---|---|---|
| 01 — Lettrism as Universal Science (Ibn ʿArabī → Ibn Turka) | 07 *Akbarian Inheritance*; 06 *Pythagorean Revival* | Theirs. 07's "two fathers for one science" (ʿArabī **and** Ḥamūya) is a sharper claim than my single-line genealogy. |
| 02 — Isfahan Circle & the Timurid Occult Court | 05 *Ibn Turka and the Occult Court* | Theirs. 05 has "the trap inside the opportunity" and "a corrective to the romance"; mine is a survey without a thesis. |

The intersections follow a disciplined template — **general context → the
intersection → the complication → cross-references** — with real frontmatter.
Mine are generic survey prose with `##` headers and no argumentative spine.

**Decision needed** (see questions below): retire 01/02, or rewrite them into the
intersection template on subjects the six don't cover.

### 3. Thirteen of 37 entries are stubs

Body length, characters (`STYLE_ENTRIES.md` targets figures at 1,200–2,200 *words*,
roughly 7,000–13,000 chars):

| Entry | Body | |
|---|---|---|
| cosmic-hierarchy | 140 | concept |
| mamluk-cairo-context | 182 | concept |
| mystical-experience | 189 | concept |
| letter-correspondences | 201 | concept |
| treatise-divine-names | 217 | text |
| occult-philosophy | 243 | concept |
| timurid-patronage | 243 | concept |
| mirza-jan-mirza | 258 | figure (confidence LOW) |
| universal-principles | 271 | concept |
| neoplatonism | 298 | concept |
| mulla-sadra | 441 | figure |
| ismail-safavi | 622 | figure |
| book-of-light | 748 | text |

Only six entries are anywhere near target: `ibn-turka` (10.4k), `ilm-al-huruf`
(7.9k), `sayyid-husayn-akhlati` (5.2k), `isfahan-circle` (4.1k), `ibn-arabi`
(4.0k), `imaginal-realm` (3.4k).

Several stubs are also **redundant rather than merely thin** —
`universal-principles`, `occult-philosophy` and `occult-science-universal` are
three pages restating one idea; `letter-correspondences` and `cosmic-hierarchy`
duplicate material already inside `ilm-al-huruf` and `barzakh`.

### 4. Two duplicate figures in `seed.json`

`sharaf-al-din-yazdi` and `qazizada-rumi` each appear twice (15 objects, 13 unique).
The DB hides it — `INSERT OR REPLACE` dedupes on slug — so the seed file has been
silently wrong. Worth fixing before the file grows.

---

## Revised priority order

**Depth and correctness before more entries.** More pages on the current base
makes the portal worse, not better.

### Phase A — repair (no new entries)

1. Add frontmatter to essays 01/02, or retire them (pending your call).
2. De-duplicate `seed.json`; add a uniqueness assertion to `seed_from_json.py` so
   this cannot recur silently.
3. Merge the redundant concept stubs: fold `universal-principles` +
   `occult-philosophy` into `occult-science-universal`; fold
   `letter-correspondences` into `ilm-al-huruf`; fold `cosmic-hierarchy` into
   `barzakh`. **Net −4 entries, and the survivors get better.**
4. Deepen the remaining stubs that genuinely deserve a page — `neoplatonism`,
   `mulla-sadra`, `book-of-light`, `treatise-divine-names` — by mining the corpus
   properly instead of writing from general knowledge.
5. Re-run `build_site.py`, verify against the live pages.

### Phase B — deepen what exists

Bring the mid-range entries (`qazizada-rumi` 960, `sharaf-al-din-yazdi` 978,
`jandi` 1.2k, `al-ghazali` 1.3k, `qunavi` 1.4k, `suhrawardi` 1.5k,
`saad-al-din-hamuyya` 1.6k) up toward the style-guide target, each grounded in
`mine_corpus.py` passages with page numbers — the discipline `QUICKSTART.md`
specifies and that I skipped on most of these.

Sharaf al-Dīn Yazdī is the strongest candidate for real expansion: **369 corpus
hits across 26 sources**, currently a 978-character page, and he anchors the live
intersection essay 08 on the defense of divination.

### Phase C — new entries, intersection-justified

Only then add. Candidates that pass the Turka-dedicated test, ranked by corpus
frequency (to be confirmed by `mine_corpus.py rank` before writing):

**Figures** — Ibn Sīnā (the peripatetic frame Ibn Turka argues against);
Shāhrukh and Iskandar Sulṭān (the actual patrons); Bisṭāmī (the Ottoman arm of
the New Brethren, named in the dissertation's opening); Ibn Khaldūn (the
antagonist of essay 08); Ḥājjī Bektāsh / Ḥurūfī figures if Matt treats the
Fażlallāh Astarābādī connection.

**Texts** — the rest of the ~45 known Persian and Arabic works, at minimum a
grouped register page; the *Tamhīd al-Qawāʿid* specifically, since the
dissertation argues it is the work whose fame *distorted* his reputation.

**Concepts** — `tahqiq` vs `taqlid` (there is a whole source on it);
`coincidentia oppositorum` (the dissertation's own phrase for the letter);
`jafr`; `wahdat al-wujud`; the five occult sciences and their hierarchy.

**Institutions** — Samarkand observatory; the Isfahan judiciary (his actual day job).

### Phase D — timeline, if wanted

Requires a `build_site.py` decision first. The dissertation's `dates` output plus
`mine_corpus.py dates` makes the extraction cheap; the rendering is the open
question.

---

## Revised targets

| | Now | After A | After B | After C |
|---|---|---|---|---|
| Entries | 37 (+11 biblio) | 33 | 33 | 55–65 |
| Stubs | 13 | 0 | 0 | 0 |
| Essays | 8 (2 defective) | 6–8 | 6–8 | 6–10 |

Entry count goes **down** before it goes up. That is the point.

---

## Open questions

1. **Essays 01/02 — retire or rewrite?** If rewrite, what subjects? The six
   intersections cover Brethren, al-Būnī, occult court, Pythagorean revival,
   Akbarian inheritance, divination. Uncovered candidates: *Ibn Turka and the
   Ḥurūfīs* (the heresy he had to be distinguished from), *Ibn Turka and the
   philosophers* (the `tahqiq`/`taqlid` fight), *Ibn Turka's afterlife* (why the
   Tamhīd eclipsed the Mafāḥiṣ).
2. **Merging the redundant concepts** — agreed, or keep them separate?
3. **Depth target.** Style guide says 1,200–2,200 words for figures. Should the
   secondary figures hit that, or is 600–900 words right for anyone who isn't
   Ibn Turka, Akhlātī, or Yazdī?
4. **Timeline** — worth the builder work, or out of scope for this portal?
5. **Cribbing from IslamicateOccultPortal** — you mentioned it as a source. Should
   Phase C pull entries across from that DB where they overlap, or should
   everything here be written fresh against Matt's articles?
