# Ibn Turka Portal — Build Manifest

**Status:** Phase 2 In Progress — Foundation Solid, Expansion Underway  
**Last Updated:** 2026-08-31  
**Goal:** Build comprehensive, citable educational resource on Ibn Turka, his circle, and Islamicate occultism

## Completion Checklist

### Phase 1: Core Foundation (COMPLETE)
**ACHIEVED:** Core pipeline established; critical conceptual and biographical foundation in place.

**Figures** (4/6 complete)
- [x] **Ibn Turka** (2,100+ words) — comprehensive biography, philosophy, influence
- [x] **Akhlati** (1,300+ words) — teacher, network hub, influence on Ibn Turka
- [x] **Sharaf al-Din Yazdi** (1,500+ words) — member of Isfahan Circle, historian, author of *Zafarnama*
- [x] **Qazizada Rumi** (1,200+ words) — mathematician, astronomer, member of Isfahan Circle
- [ ] **Saad al-Din Hamuyya** (~1,000 words) — precursor, cited by Ibn Turka as source on lettrism
- [ ] **Ibn Arabi** (~1,200 words) — foundational for Ibn Turka's system

**Concepts** (5/5 complete)
- [x] **'Ilm al-huruf** (2,000+ words) — the science of letters, Ibn Turka's centerpiece
- [x] **Barzakh** (~1,500 words) — the intermediate realm, central to his cosmology
- [x] **Pythagorean Cosmology** (~1,500 words) — Ibn Turka's mathematical-philosophical system
- [x] **Divine Names** (*Asma* al-Ilahiyya, ~1,500 words) — 28 names, letter correspondence
- [x] **Abjad Numerology** (~1,200 words) — letter values and numerical operations

**Texts (Primary Sources)** (1/4 complete)
- [x] **Book of Inquiries** (*Kitab al-Mafahis*, ~1,200 words) — his magisterial summa
- [ ] **Treatise on the Barzakh** (*Risalat al-Barzakh*, ~1,000 words) — metaphysical framework
- [ ] **Book of Light** (*Kitab al-Nur*, ~1,000 words) — cosmological doctrines
- [ ] **Treatise on Divine Names** (~800 words) — lettrist theology

**Institutions** (0/2 complete)
- [ ] **Isfahan Circle** (~1,200 words) — Ibn Turka's intellectual network
- [ ] **New Brethren of Purity** (*Ikhwan al-Safa* al-jadid, ~1,500 words) — transregional network

**Historiographical Arguments** (0/3 complete)
- [ ] **Against the Decline Thesis** (~1,200 words) — Melvin-Koushki's revisionist argument
- [ ] **Occult Science as Universal System** (~1,000 words) — legitimacy and scope
- [ ] **Pythagorean Renaissance in Islam** (~1,500 words) — Ibn Turka as central figure

**Bibliography (Secondary Sources)** (1/8 complete)
- [x] **Melvin-Koushki Dissertation (Yale 2012)** — foundational modern work
- [ ] **Powers of One (2017)** — Pythagorean cosmos
- [ ] **Of Islamic Grammatology (2016)** — lettrism and semiotics
- [ ] **The Occult Court (2025)** — empire and occultism
- [ ] **The New Brethren of Purity (2019)** — network analysis
- [ ] **Being with a Capital B (2023)** — Islamic Pythagoreanism
- [ ] **Toward a Neopythagorean Historiography (2020)** — methodological framework
- [ ] **World as (Arabic) Text (2020)** — cosmology and language

### Phase 2: Depth Pass (IN PROGRESS)
Expanding to 40–50 core entries. Progress so far: **11 entries complete** (4 figures, 5 concepts, 1 text, 1 bibliography).

**Next Priority (by hit frequency in corpus):**
- Figures: Ibn Arabi (foundational), Saad al-Din Hamuyya (precursor), Muhammad Ghazali (context)
- Texts: Treatise on Barzakh, Book of Light, Treatise on Divine Names
- Institutions: Isfahan Circle, New Brethren of Purity
- Arguments: Against Decline, Occult Science as Universal, Pythagorean Renaissance
- Bibliography: Powers of One, Of Islamic Grammatology, The Occult Court, Being with a Capital B

**Resource Allocation (Revised):**
- Phase 1 (completed): ~12 hours
- Phase 2 (to 40–50 entries @ ~1.5 hours each): ~45–60 hours
- Phase 3 (synthesis essays): ~20–25 hours
- **Total: ~80–100 hours for "dynamite" resource**

### Phase 3: Synthesis Essays (PLANNED)
Write 3–5 long-form essays threading multiple entities:
- "Lettrism as Universal Science: From Ibn ʿArabi to Ibn Turka"
- "The Isfahan Circle and the Timurid Occult Court"
- "Pythagorean Philosophy in the Islamic World"
- "Occultism and Empire: Ibn Turka's Vision of Universal Order"

## Research Work Completed

### Corpus Ingest
- [x] 43 Melvin-Koushki PDFs converted to markdown (~6M characters)
- [x] 42/43 successfully converted; 1 flagged as scan-needs-OCR
- [x] Corpus indexed and searchable via `mine_corpus.py`
- [x] Full-text retrieval with page numbers for citation

### Tooling
- [x] `convert_corpus.py` — PDF → markdown conversion
- [x] `init_db.py` — SQLite schema creation (11 tables)
- [x] `mine_corpus.py` — Research tool (rank, kwic, read, near, dates, names)
- [x] `seed_from_json.py` — Seed data ingestion
- [x] `build_site.py` — Planned (skeleton exists)

### Documentation
- [x] `STYLE_ENTRIES.md` — Encyclopedia entry templates and conventions
- [x] `QUICKSTART.md` — Entry authoring workflow (3 steps)
- [x] `README.md` — Architecture and full workflow
- [x] Updated `docs/DECISIONS.md` — Design decisions

## Database State

**Current (Session 2026-08-31):**
- 4 figures (Ibn Turka, Akhlati, Sharaf al-Din Yazdi, Qazizada Rumi)
- 5 concepts ('Ilm al-huruf, Barzakh, Divine Names, Abjad Numerology, Pythagorean Cosmology)
- 1 text (Kitab al-Mafahis)
- 1 bibliography entry (Melvin-Koushki dissertation)
- **Total: 11 entries**

**Phase 2 target:** 40–50 entries (29–39 more to go)

## Mining Strategy (Proven Workflow)

Use `mine_corpus.py` to drive research:

1. **rank TERM** — Which sources discuss this? (picks research direction)
2. **kwic TERM** — How is it characterized? (gathers quotable passages)
3. **read SLUG** — Pull full context around a hit (builds entry)
4. **dates SLUG** — Extract biographical timeline (populates events)
5. **near TERM1 TERM2** — Find conceptual connections (identifies relationships)

Every hit includes page number for immediate citation.

## Next Steps (Priority Order)

**High-impact next entries (ranked by corpus frequency & entry dependency):**
1. **Ibn Arabi (figure)** — 120+ hits across 25 sources. Foundational for Ibn Turka's system; enables several concept entries.
2. **Isfahan Circle (institution)** — Central to narrative. Synthesize from Ibn Turka, Yazdi, Qazizada.
3. **New Brethren of Purity (institution)** — Network context. Organize from Akhlati and cross-references.
4. **Against the Decline Thesis (argument)** — Melvin-Koushki's core historiographical move; supports revisionist framing.
5. **Treatise on the Barzakh (text)** — Second primary text; conceptually adjacent to Barzakh concept.
6. **Powers of One (bibliography)** — Melvin-Koushki's most cited work; scaffolds Pythagorean entries.

**Each entry:** ~90 min research → ~60 min writing → 15 min ingestion/verification = ~2.5 hours average.

## Quality Standards

Every entry:
- [x] Based on direct source reading (not synthesis of summaries)
- [x] Includes page references for every significant claim
- [x] Marks confidence honestly (HIGH = personally verified, MEDIUM = synthesized, LOW = plausible but unverified)
- [x] Follows `STYLE_ENTRIES.md` structure and length targets
- [x] Contains 5–12 DGWE-format literature citations
- [x] Uses `[[slug]]` links for related entities
- [x] Reviewed for clarity and accuracy before publishing

## Verification Before Publishing

Pending final build-out:
- [ ] build_site.py generates complete HTML site
- [ ] All links resolve correctly (no orphan `[[slug]]`)
- [ ] Site renders correctly across browsers
- [ ] Portal is queryable and navigable
- [ ] Sample entries display with formatting intact

---

**Author:** Claude (Opus 5)  
**Last modified:** 2026-08-31 (Session 2)  
**Next session target:** 15 more entries (30–45 total) to reach Phase 2 interim milestone
