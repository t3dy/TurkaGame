# Ibn Turka Portal — Build Manifest

**Status:** Phase 1 Core Foundation — In Progress  
**Last Updated:** 2026-08-31  
**Goal:** Build a comprehensive, citable educational resource on Ibn Turka, his circle, and Islamicate occultism

## Completion Checklist

### Phase 1: Core Foundation (Current)
Pipeline and core entries established. Target: 15–20 high-quality entries covering Ibn Turka, his immediate circle, key concepts, and major texts.

**Figures** (2/6 complete)
- [x] **Ibn Turka** (2,100+ words) — comprehensive biography, philosophy, influence
- [x] **Akhlati** (1,300+ words) — teacher, network hub, influence on Ibn Turka
- [ ] **Sharaf al-Din Yazdi** (~1,500 words) — member of Isfahan Circle, author of *Zafarnama*
- [ ] **Qazizada Rumi** (~1,200 words) — mathematician, astronomer, member of Isfahan Circle
- [ ] **Saad al-Din Hamuyya** (~1,000 words) — precursor, cited by Ibn Turka as source on lettrism
- [ ] **Ibn Arabi** (~1,200 words) — foundational for Ibn Turka's system

**Concepts** (1/5 complete)
- [x] **'Ilm al-huruf** (2,000+ words) — the science of letters, Ibn Turka's centerpiece
- [ ] **Barzakh** (~1,500 words) — the intermediate realm, central to his cosmology
- [ ] **Pythagorean Cosmology** (~1,200 words) — Ibn Turka's mathematical-philosophical system
- [ ] **Divine Names** (*Asma* al-Ilahiyya, ~1,000 words) — 28 names, letter correspondence
- [ ] **Abjad Numerology** (~1,000 words) — letter values and numerical operations

**Texts (Primary Sources)** (0/4 complete)
- [ ] **Book of Inquiries** (*Kitab al-Mafahis*, ~1,200 words) — his magisterial summa
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

### Phase 2: Depth Pass (Planned)
Expand to 40–50 entries. Add:
- Minor figures (later disciples, critics, contemporaries)
- Derivative concepts (secondary doctrines, technical terms)
- Secondary texts (later interpretations, commentaries)
- Timeline events (biographical milestones, political context)
- Scholarly debates (historiographical contests and their resolution)

### Phase 3: Synthesis Essays (Planned)
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

**Current:**
- 2 figures (Ibn Turka, Akhlati)
- 1 concept ('Ilm al-huruf)
- 1 bibliography entry (Melvin-Koushki dissertation)
- 0 texts, institutions, arguments, timeline events

**Target (Phase 1):** 6 figures, 5 concepts, 4 texts, 2 institutions, 3 arguments, 8 bibliography entries

## Resource Allocation (Estimated)

Each entry type, typical effort:
- **Figure (1,200–2,200 words):** 90–120 min mining + writing
- **Concept (800–1,800 words):** 60–90 min
- **Text (1,000–1,800 words):** 90–120 min
- **Institution (1,000–1,500 words):** 60–90 min
- **Argument (1,000–1,200 words):** 90–120 min
- **Bibliography (1,000–1,500 words):** 60–90 min

**Phase 1 total (25 entries @ ~1.5 hours average):** ~37–40 hours

## Mining Strategy

Use `mine_corpus.py` to drive research:

1. **rank TERM** — Which sources discuss this? (picks research direction)
2. **kwic TERM** — How is it characterized? (gathers quotable passages)
3. **read SLUG** — Pull full context around a hit (builds entry)
4. **dates SLUG** — Extract biographical timeline (populates events)
5. **near TERM1 TERM2** — Find conceptual connections (identifies relationships)

Every hit includes page number for immediate citation.

## Next Steps

1. **Sharaf al-Din Yazdi:** Mine dissertation (56 hits), read biography, write figure entry
2. **Barzakh:** Mine for metaphysical references, integrate with Ibn Turka's system, write concept entry
3. **Isfahan Circle:** Synthesize from multiple sources, write institution entry
4. **Key texts:** Extract descriptions and significance from sources, write text entries
5. **Historiographical arguments:** Identify Melvin-Koushki's core revisionist claims, structure as argument entries

## Quality Standards

Every entry:
- [ ] Based on direct source reading (not synthesis of summaries)
- [ ] Includes page references for every significant claim
- [ ] Marks confidence honestly (HIGH = personally verified, MEDIUM = synthesized, LOW = plausible but unverified)
- [ ] Follows `STYLE_ENTRIES.md` structure and length targets
- [ ] Contains 5–12 DGWE-format literature citations
- [ ] Uses `[[slug]]` links for related entities
- [ ] Reviewed for clarity and accuracy before publishing

## Verification Before Publishing

- [ ] All entries in database via `seed_from_json.py`
- [ ] Page builds without error via `build_site.py`
- [ ] Links resolve correctly (no orphan `[[slug]]`)
- [ ] Sample entries display correctly in HTML
- [ ] Portal is queryable and navigable

---

**Author:** Claude (Haiku 4.5 & Opus 5)  
**Last modified:** 2026-08-31  
**Session:** [[portal-scaffold]]
