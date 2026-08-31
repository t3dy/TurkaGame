#!/usr/bin/env python3
"""Add key concepts: Barzakh, Abjad numerology, Divine Names."""

import json

data = json.load(open('portal/data/seed.json', encoding='utf-8'))

# Barzakh
data["concepts"].append({
    "slug": "barzakh",
    "name": "Barzakh",
    "name_arabic": "برزخ",
    "name_script": "برزخ",
    "literal_meaning": "Isthmus; barrier; intermediate realm",
    "category": "COSMOLOGY",
    "card": "**Al-Barzakh** (the Isthmus). In Ibn Turka's system, the intermediate realm between pure matter and pure spirit, between multiplicity and unity. The domain where letters become forms, where [[divine-names]] manifest as causal powers, where mathematics governs physical existence. Central to understanding how lettrism operates—letters do not merely represent reality but constitute the barzakh through which divine principles become concrete.",
    "body": "## Al-Barzakh: The Intermediate Realm\n\n**Al-Barzakh** (literally, \"isthmus\" or \"barrier\") is Ibn Turka's term for the ontological middle ground between pure spirit and pure matter. Qur'anically, the barzakh refers to the barrier between the two seas that prevents them from mixing. Medieval Islamic philosophers, especially Ibn ʿArabī, adopted this to denote the intermediate realm between intellect and sense, between the divine and the created. Ibn Turka transformed this concept into the centerpiece of his metaphysical system.\n\nIn Ibn Turka's framework, the Barzakh is not merely a philosophical abstraction but the **actual location where causation operates**. The barzakh is where [[ilm-al-huruf|letters and their numerical values]] exert power. It is the realm in which:\n\n- Divine names (*asmaʾ*) become manifest in forms (*ashkāl*)\n- Letters (*hurūf*) function as operative principles\n- Mathematics (abjad numerology) governs the unfolding of creation\n- Intention (*niyyah*) plus ritual acts produce concrete effects\n\nUnderstanding the barzakh is essential for understanding how Ibn Turka reconciles rational philosophy with operative magic. Operations that recombine letters work not through mystical intuition but through precise knowledge of how the barzakh functions as the intermediate domain where formal patterns (mathematical, linguistic, geometric) generate effects in material reality.\n\nThe barzakh is also the human soul—Ibn Turka argues that human consciousness and will operate in the barzakh, which is why knowledge of letters and divine names grants operative power. Mastery of lettrist science is mastery of the mechanisms by which barzakh-realm knowledge becomes action.",
    "hierarchy_note": "The barzakh is Ibn Turka's foundational cosmological concept; all occult operations depend on understanding it.",
    "related_concepts": ["ilm-al-huruf", "divine-names", "pythagorean-cosmology"],
    "literature": [
        "Melvin-Koushki, Matthew. *Powers of One: Pythagorean Cosmos in Islamic Context*, pp. 150-180."
    ],
    "tags": ["cosmology", "metaphysics", "intermediate-realm", "ontology"],
    "source_method": "CORPUS_SYNTHESIS",
    "review_status": "DRAFT",
    "confidence": "MEDIUM"
})

# Abjad Numerology
data["concepts"].append({
    "slug": "abjad-numerology",
    "name": "Abjad numerology",
    "name_arabic": "حساب الجمل",
    "name_script": "حساب الجمل",
    "literal_meaning": "Gematria; letter-value calculation",
    "category": "TECHNIQUE",
    "card": "**Abjad numerology** (Hisab al-Jumul). The system assigning numerical values to Arabic letters (alif=1, bāʾ=2, etc.), allowing letters and words to be manipulated mathematically. Central to [[ilm-al-huruf|lettrism]]: Ibn Turka used abjad values to establish correspondences between divine names, cosmic principles, and human faculties. Enables the calculation of ''operative words'' whose numerical sum aligns with specific celestial or talismanic purposes.",
    "body": "## Abjad Numerology (Hisab al-Jumul)\n\nThe **abjad system** is an ancient method of letter-to-number correspondence in Arabic and Hebrew. Each of the 28 Arabic letters carries a numerical value:\n- alif (a) = 1, bāʾ (b) = 2, jīm (j) = 3... up to ghīn (gh) = 1000\n\nThis allowed Arabic letters, words, and verses to be treated as mathematical entities. The sum of a word's letters yields a number; that number can be matched against cosmic cycles, divine names, or talismanic intent.\n\nIn Ibn Turka's system, abjad numerology becomes **the bridge between language and mathematics, between expression and causation**. By selecting or composing words whose abjad sum equals a specific number—say, the number corresponding to the planet Venus or to a particular divine name—one creates a linguistic-mathematical object that resonates with that principle. Written or chanted correctly, such a word becomes operative.\n\nExample: the divine name al-ʿAlīm (\"the All-Knowing\") has a specific abjad value. A talisman inscribed with a word or phrase whose abjad value matches that of al-ʿAlīm would, in theory, embody the properties of divine knowledge and could be used to attract or enhance that quality.\n\nIbn Turka's genius was systematizing abjad manipulation into a rigorous science rather than leaving it as scattered numerological tricks. He showed how abjad calculations, combined with proper understanding of the barzakh and divine names, provide a methodology for intentional causation grounded in cosmic principles.",
    "hierarchy_note": "Abjad is one of the core technical tools of [[ilm-al-huruf]]; mastery of it is necessary for operative lettrism.",
    "related_concepts": ["ilm-al-huruf", "divine-names", "barzakh"],
    "literature": [
        "Melvin-Koushki, Matthew. *Powers of One*, pp. 95-130. Ibn Turka, *Kitab al-Mafahis*, Chapters on Numerology."
    ],
    "tags": ["technique", "numerology", "mathematics", "letters", "operative"],
    "source_method": "CORPUS_SYNTHESIS",
    "review_status": "DRAFT",
    "confidence": "MEDIUM"
})

# Divine Names
data["concepts"].append({
    "slug": "divine-names",
    "name": "The Divine Names",
    "name_arabic": "الاسماء الالهية",
    "name_script": "الاسماء الالهية",
    "literal_meaning": "God's Names and Attributes",
    "category": "THEOLOGICAL",
    "card": "**Al-Asmaʾ al-Ilāhīyya** (The Divine Names and Attributes). Islamic doctrine positing 28 (or 99) divine names—each expressing an aspect of God's nature (The Merciful, The Just, The Mighty, etc.). In [[ilm-al-huruf|lettrism]], each of the 28 Arabic letters corresponds to one divine name, making letters themselves expressions of divine attributes. Ibn Turka's system treats mastery of the divine names through their corresponding letters as the path to aligning human will with cosmic principles.",
    "body": "## The Divine Names (Al-Asmaʾ al-Ilāhīyya)\n\nIslamic theology recognizes that God is known through His attributes and names. The Qur'an references divine names, and Islamic scholars compiled lists—commonly 99, though sometimes 28. Each name expresses a dimension of divinity: al-Raḥmān (The Merciful), al-ʿAdl (The Just), al-ʿAlīm (The All-Knowing), al-Qawī (The Mighty), etc.\n\nIn [[ilm-al-huruf|Ibn Turka's lettrist system]], the 28 divine names are mapped directly onto the 28 Arabic letters. This creates a correspondence where:\n- Each letter IS a divine name\n- Each letter carries the properties and powers of that name\n- Manipulation of letters becomes invocation of divine principles\n\nFor example:\n- The letter ʿAyn corresponds to al-ʿAlīm (The All-Knowing)\n- The letter Tāʾ corresponds to al-Tāʾib (The Returning/Repenting)\n- The letter Qāf corresponds to al-Qawī (The Mighty)\n\nThrough understanding these correspondences and using [[abjad-numerology|abjad numerology]], a practitioner can compose words, phrases, or talismans that embody specific divine qualities. The goal is not manipulation (in the magical sense) but **attunement**: aligning human intention and action with divine attributes, thereby participating in the structure of reality itself.\n\nIbn Turka's treatment of the divine names through letters represents a synthesis of Islamic theology, [[ilm-al-huruf|lettrist gnosis]], and [[pythagorean-cosmology|Pythagorean mathematics]]. It is the theological foundation that legitimizes lettrism as a valid science within Islamic orthodoxy—because engaging with letters is, from this perspective, engaging with divine attributes themselves.",
    "hierarchy_note": "The divine names are the theological anchor for [[ilm-al-huruf]]; they ground lettrist practice within Islamic doctrine.",
    "related_concepts": ["ilm-al-huruf", "abjad-numerology", "barzakh"],
    "literature": [
        "Ibn ʿArabī. *Futūḥāt al-Makkīyya*, Treatise on the Divine Names.",
        "Melvin-Koushki, Matthew. *Of Islamic Grammatology*, Ch. 3."
    ],
    "tags": ["theology", "divine-attributes", "names", "islamic-doctrine"],
    "source_method": "CORPUS_SYNTHESIS",
    "review_status": "DRAFT",
    "confidence": "MEDIUM"
})

# Pythagorean Cosmology
data["concepts"].append({
    "slug": "pythagorean-cosmology",
    "name": "Pythagorean Cosmology",
    "name_arabic": None,
    "name_script": None,
    "literal_meaning": None,
    "category": "COSMOLOGY",
    "card": "**Pythagorean Cosmology**. The ancient Greek doctrine that numbers and their ratios are the fundamental principles governing reality. Ibn Turka's distinctive contribution was grounding Islamic [[ilm-al-huruf|lettrism]] explicitly in Pythagorean mathematics, arguing that letters and their [[abjad-numerology|numerical values]] encode cosmic principles just as Pythagoras taught that mathematics is the language of creation. This synthesis gave Islamic lettrism mathematical legitimacy and positioned it as a **truly universal science** encompassing reason, mysticism, and operative power.",
    "body": "## Pythagorean Cosmology in Islamic Context\n\nPythagorean philosophy (c. 580–500 BCE) teaches that numbers are the fundamental constituents of reality. Numbers, through their ratios and relationships, generate harmony, order, and all manifestation. This worldview emphasizes that the cosmos is knowable through mathematics, and that mathematical knowledge grants insight into (and potentially influence over) the structure of creation.\n\nThe late-antique Neoplatonic tradition preserved and developed Pythagorean thought, eventually reaching the Islamic world through Hellenistic texts, Byzantine commentaries, and the writings of Islamic philosophers like al-Kindī and al-Fārābī. Yet lettrism in the Islamic world developed largely independently, growing from Qur'anic exegesis and gnosis without explicit Pythagorean framing.\n\n### Ibn Turka's Innovation\n\nIbn Turka's genius was **explicitly connecting Islamic lettrism with Pythagorean principles**. He argued that:\n\n1. **Letters are numbers**: Each of the 28 Arabic letters has a numerical value ([[abjad-numerology|abjad]])\n2. **Numbers are cosmic**: Pythagorean mathematics describes the structure of creation\n3. **Therefore, letters ARE cosmic principles**: Mastery of letters is mastery of the mathematics of creation\n\nThis move was philosophically powerful: it gave lettrism a pedigree reaching back to ancient Greece; it grounded it in mathematical reason rather than mystical intuition alone; and it positioned it as **the supreme science**, encompassing both rational (Pythagorean math) and mystical (gnostic lettrism) approaches.\n\nBy adopting the Pythagorean framework, Ibn Turka essentially reinvented lettrism as a **Neopythagorean system**—and in doing so, positioned Islamic occult philosophy as a genuine alternative universal science, rivaling and arguably exceeding the philosophical systems of contemporary Renaissance Europe.",
    "hierarchy_note": "Pythagorean cosmology is Ibn Turka's foundational theoretical framework; it structures his entire philosophical system.",
    "related_concepts": ["ilm-al-huruf", "abjad-numerology", "divine-names", "barzakh"],
    "literature": [
        "Melvin-Koushki, Matthew. *Powers of One: Pythagorean Cosmos in Islamic Context*.",
        "Melvin-Koushki, Matthew. *Toward a Neopythagorean Historiography*."
    ],
    "tags": ["philosophy", "pythagoreanism", "cosmology", "mathematics", "neoplatonism"],
    "source_method": "CORPUS_SYNTHESIS",
    "review_status": "DRAFT",
    "confidence": "MEDIUM"
})

with open('portal/data/seed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added 4 concepts. Total: {len(data['figures'])} figures, {len(data['concepts'])} concepts, {len(data['bibliography'])} bibliography entries")
