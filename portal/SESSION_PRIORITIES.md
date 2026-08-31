# Portal — Critical Next Priorities for Phase 2 Completion

**Current State:** 16 entries (7 figures, 6 concepts, 2 institutions, 1 bibliography)  
**Target:** 40–50 entries for "dynamite" resource  
**Remaining:** 24–34 entries needed

## Highest-Impact Next Entries (Priority Ranked)

### INSTITUTION (1 slot)
- [x] Isfahan Circle ✓
- [x] New Brethren of Purity ✓
- No more institutions needed

### FIGURES (need 3–4 more)
1. **Al-Ghazali** (1058–1111) — Philosophical context, cited by Ibn Turka for theological grounding
2. **Suhrawardi** (1154–1191) — Illuminationist philosophy, foundational to Ibn Turka's synthesis
3. **Jandi** (fl. 13th c.) — Qunavi's successor, elaborated divine-names doctrine
4. **Tucci/Later Figure** — Someone from Safavid era who received/transmitted Ibn Turka's legacy

### CONCEPTS (need 2–3 more)
1. **Talismanic Science** (*'Ilm al-Talismāt*) — Operative practice grounded in letter/number correspondences
2. **Sufism/Mysticism** — Context for Ibn Arabi and later transmission (may be too broad; consider splitting)
3. **Peripatetic Philosophy** (*al-Falsafa al-Mashaʾiya*) — Context for Ibn Turka's philosophical grounding

### TEXTS (need 3 more)
1. **Treatise on the Barzakh** (*Risalat al-Barzakh*) — Second primary source; scaffolds Barzakh concept
2. **Book of Light** (*Kitab al-Nur*) — Cosmological doctrines; bridges Pythagorean cosmology
3. **Treatise on Divine Names** — Connects divine-names concept to Ibn Turka's practice

### ARGUMENTS (need 3)
1. **Against the Decline Thesis** — Melvin-Koushki's core historiographical move; frames entire project
2. **Occult Science as Universal System** — Legitimacy argument; ties all concepts together
3. **Pythagorean Renaissance in Islam** — Positions Ibn Turka as central figure in broader movement

### BIBLIOGRAPHY (need 4–5 more)
1. **Powers of One** (2017) — Pythagorean cosmos; scaffolds all Pythagorean entries
2. **Of Islamic Grammatology** (2016) — Lettrism and semiotics; scaffolds 'Ilm al-huruf entries
3. **The Occult Court** (2025) — Empire and occultism; contextualizes Isfahan Circle and Timurid court
4. **Being with a Capital B** (2023) — Islamic Pythagoreanism; scaffolds Pythagorean/Imaginal entries
5. **Toward a Neopythagorean Historiography** (2020) — Methodological framework; foundational to how to read corpus

**Total: ~18–20 entries to push from 16 → 34–36, which meets Phase 2 target.**

## Technical Notes for Next Session

### Extended seed_from_json.py
- **Currently handles:** figures, concepts, institutions, bibliography
- **Still needed:** arguments table ingest function
  - Schema columns: `slug, entity_slug, title, argument_type, card, body, literature, tags, source_method, review_status, confidence`
  - Mapping in seed.json: `"arguments": [...]`

### Mining Workflow Proven
```bash
rank TERM               # Which sources discuss this?
kwic TERM SOURCE        # Sample hits (3-5 examples with page numbers)
read SOURCE --around TERM --chars 2500   # Full passage
```

Every hit includes page number for citation. Use this religiously for every entry.

### Entry Writing Speed
- **Figure (1,200–2,200 words):** ~90 min mining + 60 min writing = 2.5 hrs
- **Concept (800–1,800 words):** ~60 min mining + 45 min writing = 1.75 hrs
- **Text (1,000–1,800 words):** ~90 min mining + 60 min writing = 2.5 hrs
- **Argument (1,000–1,200 words):** ~75 min mining + 45 min writing = 2 hrs
- **Bibliography (1,000–1,500 words):** ~45 min research + 30 min writing = 1.25 hrs

**Realistic pace:** 3–4 entries per 8-hour session, depending on type mix

## Next Session Target

**Goal:** 6–8 new entries, pushing from 16 → 22–24 total.

**Recommended sequence:**
1. **Al-Ghazali (figure)** — ~2.5 hrs (anchors philosophical context)
2. **Talismanic Science (concept)** — ~1.75 hrs (bridges theory to practice)
3. **Powers of One (bibliography)** — ~1.25 hrs (high-value, short)
4. **Against Decline Thesis (argument)** — ~2 hrs (historiographical anchor)
5. Optional: 1–2 more figures or concepts if time permits

**Total:** ~7 hours → 6–8 entries → 22–24 total → 44–48% toward goal

---

**Repository:** Clean; all entries seeded and ingested. Database at turka.db is current.  
**Workflow:** Proven, scalable, tooled.  
**Next push:** Systematically add high-impact entries per priority list above.
