# Ibn Turka Portal — Entry Style Guide

All entries follow the **card/page system** from your ALCHEMYTIMELINEMAP and Pico portals. Every entity (figure, concept, text, institution, timeline event, argument, bibliography entry) carries a short index card and a long encyclopedia page, both authored as markdown in the seed JSON, rendered to HTML at build time with `[[wiki-style]]` links resolved.

This is the definition of "academic encyclopedia quality" for this portal.

## Global Standards

### Provenance Discipline

Every non-obvious claim must be grounded in a named source with a page reference. The rule:

> **No assertion without attribution.** If you write it, you can point to it.

- Don't write: "Alchemists believed in the transmutation of metals."
- Do write: "According to Matthew Melvin-Koushki (*Powers of One*, p. 103), Ibn Turka argued that..."
- Add the `scholarly_refs` row immediately: entity_slug + bib_source_id + page_ref + quote_or_note.

If a claim is CONTEXT or COMPARATIVE, say so explicitly in the text.

### Historiographical Stance

- **Transliteration:** Choose one spelling per term and stick to it across all entries. Use Melvin-Koushki's transliteration (e.g., *'ilm al-ḥurūf*, not *ilm-i huruf*). Note variants as you encounter them in the corpus.
- **Modern scholars are historical figures too.** If you mention a scholar's argument, they get an entry (role: MODERN_SCHOLAR) and a biographical card.
- **Medieval continuity, not gap.** Never treat any period as "decline" or "abandonment."
- **The actors' names matter.** Use the person's own terms for what they did. If Ibn Turka called it *'ilm al-ḥurūf* and we translate it "lettrism," both terms should appear in the entry.

### Confidence & Review Status

- `confidence: HIGH` — you have read this passage in the source yourself, or it is a direct quote.
- `confidence: MEDIUM` — you have synthesized from multiple sources or a good secondary summary.
- `confidence: LOW` — it's plausible but you haven't verified it. Flag it honestly.

- `review_status: DRAFT` — first pass, you wrote it.
- `review_status: REVIEWED` — you or another human has read it and it's solid.
- `review_status: VERIFIED` — you have checked every claim against its source and the entry is ready for citation.

---

## Figures (People)

### Card (60–150 words)

Format: name + era/dates + role + one sentence of significance + 2–3 claims about their work or influence.

**Standard structure (for major figures):**
- **Name + dates:** Full name with transliterations, birth–death (CE/Hijri), or floruit.
- **Role:** What they actually did (scholar, judge, poet, mystic, patron).
- **Significance:** One sentence. Why they matter to the Ibn Turka story or Islamicate occult tradition.
- **Key contributions:** 2–3 specific doctrines or practices they introduced/refined.
- **Relationship to Ibn Turka (if applicable):** Teacher, contemporary, successor, rival.

**Example card:**

> **Sayyid Ḥusayn Akhlāṭī** (d. 1397/801 AH), Arab lettrist, alchemist, and geomancer active in Cairo. Central figure in the "New Brethren of Purity" network that shaped Ibn Turka's intellectual formation. Known for integrating geometric and alphanumeric systems to map divine names and their properties. Akhlāṭī's unpublished teaching, transmitted orally to Ibn Turka and others, was never compiled by Akhlāṭī himself; Ibn Turka became the primary interpreter and systematizer of Akhlāṭī's method in written form. Influence: determined the whole trajectory of Islamic lettrism after 1400.

---

### Body (1,200–2,200 words)

**Structure:**

1. **Opening (250–350 words):** Full name with all variant transliterations, birth–death dates (Hijri + CE), geographic origins, primary roles, era, one-sentence historical significance. Example: "Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī (1369–1432/770–835 AH), Chief Judge of Isfahan and the foremost occult philosopher of Timurid Iran, was the first to systematize Islamic lettrism (*'ilm al-ḥurūf*) into a coherent philosophical-mathematical cosmology explicitly modeled on Pythagorean principles. Active across Cairo, Baghdad, Anatolia, and finally Safavid Iran, Ibn Turka synthesized decades of oral teaching from his Cairo mentors into a vast written corpus, including the foundational *Treatise on the Barzakh* and the *Book of Radiant Lights*. Though he died in poverty and political exile, his framework became canonical; within a century, every Islamic philosopher engaging with lettrism worked through Ibn Turka's categories."

2. **Life and Career (300–450 words):** Chronological, with dates and place names. Where did they study? Who did they learn from? What offices did they hold? What happened to them? Use ATTESTED vs. COMPARATIVE vs. CONTEXT labels.

3. **Intellectual Work (350–500 words):** What did they argue? What texts did they write? What concepts did they develop or refine? Name the doctrines. Give specific examples of arguments or techniques.

4. **Transmission and Reception (250–400 words):** How did their work survive and spread? Who cited them? How did interpreters shape the legacy? What changed when the text entered print or moved to another region?

5. **Historiographical Debates (200–350 words):** Competing scholarly interpretations. What do historians disagree about? Has recent work revised the traditional narrative?

6. **Literature (5–12 entries):** Standard DGWE format (Author. *Title*. Publisher, Year).

---

### Card/Body Checklist

- [ ] Name with transliterations and dates clearly stated?
- [ ] Birth/death or floruit dates (CE and Hijri)?
- [ ] Role/roles explicitly named?
- [ ] Opening paragraph 250–350 words (body only)?
- [ ] Life/career section with place names and dates?
- [ ] Intellectual work: specific doctrines and examples?
- [ ] Transmission and reception?
- [ ] Historiographical debates if applicable?
- [ ] All claims grounded: cite page + author (body) or brief attribution (card)?
- [ ] Key works and affiliations listed as JSON arrays?
- [ ] Card 60–150 words, body 1,200–2,200 words?
- [ ] Entity links for people, texts, concepts as `[[slug]]`?

---

## Concepts

### Card (60–120 words)

"Dictionary definition" — what is this thing? What does it mean?

**Standard:**
- **Name:** Arabic/Persian term with transliteration and script if known.
- **Literal meaning:** Word-by-word breakdown if relevant.
- **Category:** OCCULT_SCIENCE, COSMOLOGY, TECHNIQUE, DIAGRAM, THEOLOGICAL, EPISTEMOLOGY, INSTITUTION_TERM, POLITICAL, HISTORIOGRAPHIC.
- **Definition:** 2–3 sentences, the core concept in plain language.
- **Why it matters:** One sentence about significance.

**Example:**

> ***'Ilm al-ḥurūf*** (the science of letters). Islamic science investigating the divine and cosmological meanings hidden in the forms and numerical values of Arabic letters. The belief that Creation is fundamentally linguistic — that God speaks the world into being through the Arabic alphabet — and that mastery of letter-properties confers access to hidden causal powers. Foundational to Ibn Turka's entire philosophical system.

---

### Body (800–1,800 words)

**Structure:**

1. **Etymology and terminology (100–200 words):** Word roots, variant names, transliteration choices across the literature. Clarify what you're calling it in this entry.

2. **Definition and scope (150–300 words):** What does this concept cover? What does it exclude? How do practitioners define it?

3. **Historical development (250–400 words):** Where did this idea come from? How did it evolve? Who were key figures? Trace the tradition.

4. **Ibn Turka's contribution (250–400 words if central; 0 words if peripheral):** How did he refine, reframe, or systematize this concept? What was novel in his treatment?

5. **Technical operations or subcategories (150–300 words if applicable):** If this is a technique or science, what are its parts? How does it work?

6. **Historiographical significance (150–250 words):** How do modern historians interpret this concept? Are there debates about its meaning or significance?

7. **Related concepts (100–200 words):** How does this connect to other sciences or doctrines?

8. **Literature (5–8 entries).**

---

### Example: *Barzakh* (Isthmus)

**Card:**

> ***Al-barzakh*** (the Isthmus). Islamic philosophical concept denoting the liminal realm between the material and divine worlds, between multiplicity and unity. In Ibn Turka's system, the Barzakh is the intermediate realm where letters and their meanings intersect, where names (*asma'*) become forms (*ashkal*), where mathematical relations govern physical existence. Central to understanding how lettrism connects cosmology to operative practice.

**Body opening (300 words):**

The term *barzakh* (literally, barrier or isthmus) appears in the Qur'an (23:53) to describe the wall separating the two seas that prevents them from mixing. Medieval Islamic philosophers, particularly those in the Neoplatonic tradition (al-Kindī, al-Ghazālī), adopted the term to denote the intermediate realm between pure matter and pure intellect — a domain where Form meets particularity, where the divine archetype encounters its manifestation. Ibn Turka inherited this framework from his Cairo teachers, especially Akhlāṭī, but radically expanded it to become the *location* where letters acquire causal efficacy.

In Ibn Turka's *Treatise on the Barzakh* (partially translated in Melvin-Koushki's dissertation, pp. 412–450), the Barzakh is not merely a metaphysical realm but an operational space. The twenty-eight Arabic letters do not merely represent divine names; they *are* the Barzakh made manifest. Each letter is simultaneously:
- A mathematical quantity (numerical value in the *abjad* system)
- A phonetic form (articulation point, manner of pronunciation)
- A mystical name of God
- A causal power operative in material reality

Operations that recombine letters (anagrams, numerical rearrangements, geometric configurations) are operations *in* the Barzakh. They work because they access the intermediate realm where form *becomes* cause.

[...]

---

## Texts (Primary Sources)

### Card (80–150 words)

Title (transliterated and translated) + author + date + text type + one sentence significance + 2 key points about content.

**Example:**

> ***Treatise on the Barzakh*** (Risala al-barzakh, sometimes *Illumination of the Barzakh*), attributed to Ibn Turka, likely c. 1400s, before his exile. Primary philosophical treatise establishing the metaphysical framework for his entire system. Argues that the Islamic doctrine of God's names (*asma' al-ila'hiyya*) can be systematized through Arabic letter geometry, creating a Pythagorean-style cosmology where numbers, letters, and divine attributes form a unified whole. Foundational text for all later Islamic lettrism.

### Body (1,000–1,800 words)

1. **Opening (200–300 words):** Full title + author + date + text type + historical significance.
2. **Content and arguments (350–500 words):** What does this text claim? Specific doctrines, chapters, key passages. Be precise.
3. **Textual tradition (200–400 words):** Manuscripts, editions, translations. How did it survive?
4. **Reception and influence (200–350 words):** Who quoted it? How was it interpreted?
5. **Historiographical debates (150–250 words):** Authorship, dating, interpretation disputes.
6. **Literature (5–10 entries).**

---

## Timeline Events

### Card (40–120 words)

Year + title + what happened + why it matters.

**Example:**

> **1397 CE (801 AH): Death of Sayyid Ḥusayn Akhlāṭī.** Ibn Turka's primary teacher and the intellectual center of the Cairo lettrist network dies. Ibn Turka, age 28, has absorbed Akhlāṭī's oral teachings but will spend the next decades synthesizing them into written form. Akhlāṭī's death marks the transition from oral transmission to textual systematization.

### Body (optional; 200–500 words)

Longer narrative if the event warrants detailed treatment.

---

## Arguments (Historiographical Claims)

### Card (80–150 words)

Claim + against what + stakes + game design relevance (optional, not required for pure scholarship).

**Example:**

> **The Decline Thesis is wrong.** Traditional orientalism treated Islamic occultism after al-Ghazālī (d. 1111) as degradation and superstition. Melvin-Koushki argues (sustained across 40+ publications) that the 14th-16th centuries saw explosive innovation in lettrism, cosmology, and empire-scale theurgy, with Ibn Turka as the capstone systematizer. The "decline" is a European periodization error, not a historical reality. Stakes: this revision reframes the entire early modern Islamicate intellectual world.

### Body (800–1,200 words)

1. **The argument (150–250 words):** Precise claim, not vague.
2. **Against what (150–250 words):** What does this challenge? Name the older view.
3. **Evidence (300–500 words):** How is it argued? What sources support it?
4. **Reception (150–250 words):** Accepted? Contested?
5. **Literature (3–5 key sources).**

---

## Bibliography Entries

### Card (80–150 words)

Author + title + year + pub type + one-sentence argument or contribution.

**Example:**

> Matthew Melvin-Koushki, *Powers of One: Pythagorean Cosmos in Islamic Context* (2017). Monograph arguing that Ibn Turka's mathematical philosophy was not Aristotelian scholasticism adapted to Islam, but a conscious revival of Pythagorean number theology and its promise that mathematical relations govern causality, meaning, and magic. Traces this Pythagorean lineage through Byzantine Neoplatonism into Islamic lettrism, establishing Ibn Turka as the only thinker between Porphyry and Kepler to attempt a full Pythagorean cosmological system at imperial scale.

### Body (500–1,000 words)

1. **Bibliographic info (100 words):** Full citation, publication context, access.
2. **Argument and contribution (250–400 words):** What does this work actually argue? What is its evidence? How did it change the field?
3. **Key passages (150–250 words):** Specific pages or chapters that bear on Ibn Turka, lettrism, or Islamicate occultism.
4. **Reception (100–150 words):** How has scholarship responded?

---

## Entity Links and Markup

All entities (figures, concepts, texts, institutions, events, arguments, images) are cross-linked as `[[slug]]`.

**Linking rule:**
- Link specific people, texts, and concepts: `[[ibn-turka]]`, `[[ilm-al-huruf]]`, `[[treatise-on-barzakh]]`.
- Do NOT link generic terms ("a scholar", "a text", "an idea").
- Do NOT link a name the first time it appears if you're defining it *in this entry*.

**Example:**

> Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī [no link here — we're defining him] spent his formative years under [[sayyid-husayn-akhlati]] in Cairo. When [[sayyid-husayn-akhlati]] died in 1397, Ibn Turka inherited responsibility for systematizing the [[ilm-al-huruf]] tradition.

---

## Verification Checklist Before Publishing

- [ ] Every claim beyond CONTEXT has a `scholarly_refs` row with page number?
- [ ] Dates (CE and Hijri) clearly stated?
- [ ] Name variants and transliterations included?
- [ ] Card is 60–150 words (60–120 for concepts)?
- [ ] Body is in the specified word range?
- [ ] All titles italicized (in markdown: `*title*`)?
- [ ] Entity links use `[[slug]]` format?
- [ ] No markdown hashtags, bullets, or HTML?
- [ ] Confidence and review_status honestly set?
- [ ] Literature section in DGWE format?
- [ ] Key sources actually read, not summarized from summaries?

---

## When You're Done Writing

1. Add `scholarly_refs` rows for every external claim with a page ref.
2. Check for orphan links (`[[slug]]` that doesn't exist yet) — either create those entities or change the link to plain text.
3. Read the entry aloud once. Does it flow? Is every sentence earning its place?
4. Set `review_status: REVIEWED`.
5. Add the entry to `portal/data/seed.json` (figures, concepts, texts, etc. arrays).

The build script will pick it up on the next run.
