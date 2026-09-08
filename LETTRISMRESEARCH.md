---
title: Lettrism Research — the corpus, what it says, and what a coding agent can build from it
description: A source-by-source digest of the scholarship this project is built on (Melvin-Koushki, Segol, Gardiner, Varisco, Coulon, de Callataÿ, Martin), written so a future coding agent can find a claim, cite it correctly, know how well it is known, and turn it into a mechanic without re-reading six books.
---

# Lettrism Research

**Who this is for.** A future coding agent — human or model — who needs to build
something in this project and must not invent history to do it. It answers four
questions per source: *what do we hold, where is it on disk, what does it
establish, and what can be built from it.* It also records what each source does
**not** say, because the most expensive mistake here is a plausible claim with no
text behind it.

**How to use it.** Do not read this end to end unless you are doing research. Use
§1 to find the source that covers your topic, read that source's section, then
open the file named there for the passage. If you are building a mechanic, go to
§6 (the extraction table) first and come back for the citation. If you are writing
player-facing prose, §7 (the quotable set) is what you may put on screen.

**Related documents, and the division of labour between them:**

| Document | What it holds |
|---|---|
| **This file** | the scholarship: sources, claims, page citations, honest gaps |
| [`v2/POWERSOFTHELETTERS.md`](v2/POWERSOFTHELETTERS.md) | the per-letter reference: what each Arabic and Hebrew letter was held to do, beside what the engine derives |
| [`PIPELINE.md`](PIPELINE.md) | how research gets from a PDF to a shipped mechanic without losing its provenance |
| [`grimoire/themes/`](grimoire/themes/) | short thematic pages (LETTRISM, GEMATRIA, SUFISM…) written in the project's own voice |
| [`docs/RESEARCH_BRIEF.md`](docs/RESEARCH_BRIEF.md), [`docs/BIOGRAPHY.md`](docs/BIOGRAPHY.md) | Ibn Turka's life and world, the narrative layer |

---

## 0. The labels, and why they are not optional

Every claim in this project carries one of these. A claim without one is a bug.

| Label | Means | Test |
|---|---|---|
| **SOURCE** | a primary text, held or read in translation, cited to folio/§/page | could a scholar check it against the manuscript or edition? |
| **CORPUS** | secondary scholarship we hold and have read, cited to a page | is the PDF in `research/library/` or `../IslamicateOccultPortal/corpus/sources/`? |
| **REPORTED** | a source we hold reporting one we do not | name both: "Martin p. 62, reporting *Manbaʿ uṣūl al-ḥikma* p. 66" |
| **INTERPRETATION** | our reading of held material | say *whose* reading and what it rests on |
| **GAME FICTION** | no historical claim at all | must be labelled where the player sees it |
| ⚠ | general knowledge, unchecked | never ship without either checking it or showing the mark |

The reason is concrete. This project once had 43 copyrighted PDFs tracked on a
public repo *while the rule against it was written in the same file* — so a rule
that lives only in prose is unenforced. `tools/check_repo_rules.py` now blocks
the commit. The labels are the same kind of rule, and the test that enforces them
is that every ruleset carries an `interpretation_note` and
`v2/tests/engine.test.mjs` fails without one.

---

## 1. Where to look, by topic

| If you need… | Go to | Section |
|---|---|---|
| the claim that the world is made of letters | Melvin-Koushki *Prologue*; Gardiner *Stars and Saints* | §2.1, §3.1 |
| what a letter's number does | Melvin-Koushki *Prologue* (worked equations) | §2.1 |
| the three registers (mental/spoken/written) | Melvin-Koushki *Prologue* pp. 8–9 | §2.1 |
| how a letter is split into parts (taksīr) | Melvin-Koushki *Prologue* n. 35 | §2.1 |
| the four natures of the letters | Coulon in Saif et al. pp. 346–347; Gardiner p. 57 | §3.2, §3.1 |
| the 28 lunar mansions and the letters | Varisco *Arabica* 64 pp. 501–502 | §3.3 |
| dots as omens | Varisco p. 502 | §3.3 |
| al-Būnī's three tiers of letters | Gardiner pp. 56–57 | §3.1 |
| the twelve faculties (Arabic side) | Gardiner p. 56, from *Laṭāʾif* f. 18a | §3.1 |
| 28 = mansions = body parts = letters | de Callataÿ pp. 24–25 | §3.4 |
| the Occult Quintet, defined by a practitioner | Melvin-Koushki *Occult Court* pp. 5, 15 | §2.2 |
| what "magic" even means in this field | Melvin-Koushki *Meanings* | §2.3 |
| the Hebrew alphabet's 3/7/12 division | Segol pp. 22–23; SY ch. 1 | §4.1 |
| the seven doubles' planets and aspects | Segol p. 41; SY ch. 4 | §4.1 |
| the twelve simples' faculties and signs | Segol p. 41; SY ch. 5 | §4.1 |
| the 231 gates | Segol p. 51; SY §18 | §4.2 |
| the six directions / space cube | Segol pp. 91, 72; SY §15–16, §38 | §4.3 |
| golem recipes | Segol pp. 105–106, quoting Idel | §4.4 |
| what medieval diagrams were *for* | Segol p. 8 | §4.5 |
| the three lettrisms, by motive | portal `three-lettrisms` | §5.1 |
| jafr as state equipment | portal `jafr`, `ottoman-asymmetry` | §5.2 |

---

## 2. Matthew Melvin-Koushki

**On disk:** `research/library/*.pdf` (gitignored) and plain text in
`research/library/textcache/*.txt` — grep those, they are small (873, 1082, 340,
13 lines). Four items: *Prologue to Pythagorean Renaissance*, *The Occult Court*
(2025), *The Meanings of Islamic Magic*, *Dr Dee's Ottoman Adventure* (2021).

**What he is to this project.** The reason it exists. He is the historian who
put Ibn Turka on the map as a philosopher rather than a curiosity, and his
framing — occult science as *mathematics*, lettrism as the science that
supersedes philosophy — is the project's spine. Where he and the game disagree,
the game says so.

### 2.1 *Prologue to Pythagorean Renaissance* — the densest source we hold

A translation-with-commentary of the prologue to Ibn Turka's *Mafāḥiṣ*
(*Investigations*). Read this one first; the footnotes carry more than the body.

- **CORPUS** Lettrism is *the endless splitting of language to release
  mathematical consciousness, like spirit from body* — "simply the most literal
  possible emulation of the Cut-Up Letters (*muqaṭṭaʿāt*) opening 29 suras, a
  mindbending feature not yet found in the Hebrew Bible or Greek New Testament"
  (n. 25). He compares Burroughs's cut-up method in the same note. **This is the
  charter sentence of v2.**
- **CORPUS, load-bearing** The three registers. The *Mafāḥiṣ*'s structure is a
  "Pearl-Peach-Planet cosmic trinity, whose Three Globes of Light correspond to
  the Written-Spoken-Mental forms of the mathematical Letter" (p. 8). The book's
  order is Planet → Pearl → Peach: up to the Mental, down to the Written ("to
  find the same Light in the sheerest blackness that is physicality as Ink"),
  then into the Spoken (p. 9). Note the direction of the hierarchy: the *Mafāḥiṣ*
  glorifies "the Written over the Spoken, Sight over Hearing" (p. 8), which
  overturns the Aristotelian-Avicennan sensory order.
  **→ `v2/engine/vm.js` runs exactly these three as plan / run-once / persist.**
- **SOURCE via CORPUS, taksīr** (n. 35, quoted here in full because it is an
  algorithm and the game wants algorithms): taksīr "involves the *muqaṭṭaʿāt*-
  and Moonsplitting-inspired separation of the letters of a name or word and the
  writing out of the letternames in full, then the elimination of repeated
  letters, the term *zubur* refers to the first letters in the full letternames
  (e.g., the A in ALF) and *bayyināt* to the remaining letters (LF in ALF)—so by
  definition the occult code behind every manifest word, and therefore the world
  itself." He also notes taksīr is **cognate to Hebrew *temurah***.
  **→ BUILT 2026-09-07 as `engine/taksir.js`, and played in the Tribunal. The
  bound that makes it a game: across all twenty-eight names the bayyināt draw on
  only eight distinct letters (ا د ف ل م ن و ي), so twenty letters can never be
  obtained by breaking anything.**
- **CORPUS, worked alphanumerics** (the examples are checkable with our own
  `data/letters.json`): ṢWAB = 99, keyed to the 99 divine names; ʿaṭā (gift)
  = 80 = aʿdād (numbers), "that this 'gift' is ontologically 'Numbers' is
  signified by their shared value of 80" (n. 46); ʿAlī (ʿLY) = 110 = alif (ALF)
  (n. 47), "yet 110 gematrically reduces to Two, the value of B… per his famous
  declaration: I am the Dot under the B."
- **CORPUS** Arabic is "more perfectly alphanumeric, algorithmic and hence
  cosmic" than the Latin alphabet, whose "alphanumeric-algorithmic virtues are
  strictly partial."
- **CORPUS, biography** Ibn Turka's mentor was **Sayyid Ḥusayn Akhlāṭī**
  (d. 1397), "Cairene pivot of the New Brethren network, radiating to Iran to
  India to Anatolia" (n. 26) — the lettrist-alchemist-geomancer whose inspiration
  let Ibn Turka dismiss all other sources. He "would refuse to bend the knee
  during his three inquisitions, despite the danger and punishing consequences"
  (p. 8).
- **CORPUS, art history** The *Ṭahawī Cycle*, the *Mafāḥiṣ*'s central diagram, is
  "the first Modern lettrist version of the Tetractys" (p. 9). Plate: Tehran,
  Majlis Library MS 10196 — f. 52b is the autograph opening, f. 63a the circle.
- **CORPUS, downstream** The *Mafāḥiṣ* was a major source for **Mīr Dāmād**
  (d. 1631), and their combined force "fueled the astonishing transformation of
  Safavid New Isfahan into the world's first purpose-built Pythagoropolis,
  Solomonic-Hermetic city-as-talisman-and-observatory" (p. 9).
  **→ A city that is itself a talisman is a game, and nobody has built it here.**

**What it does not contain:** a table of letters. No per-letter attributions, no
mansions, no natures. For those you need al-Būnī's readers (§3).

### 2.2 *The Occult Court* (2025) — the Quintet, defined by a practitioner

A study-and-translation of ʿAlī Ṣafī's *Boon for the Khan*, a popularising
Timurid-Safavid grimoire. Its value here is that it **defines the Occult Quintet
in a period voice**, which `docs/GAME_ROGUELIKE.md` had been using loosely.

- **SOURCE in translation** (p. 15, the treatise's own introduction). The
  sciences divide into *manifest* (jaliyya) and *occult* (khafiyya); the occult
  "deal with reality itself (*ʿulūm-i ḥaqqiyya*)". Then the Quintet:

  | Term | Melvin-Koushki's gloss | The treatise's own definition |
  |---|---|---|
  | **kīmiyā** | alchemy | "adepts elevate base metals to their perfection as silver or gold" |
  | **līmiyā** | talismanry | "devices that conjunct active celestial forces with passive terrestrial ones to produce effects weird and wondrous" |
  | **hīmiyā** | subjugation | "the persuasion of planets and inclining of jinn through rigorous ritual, amuletic or invocatory practice" |
  | **sīmiyā** | illusionism | "leveraging such influence on the imaginal faculty of observers that gossamer images that are clearly unreal appear before their eyes" |
  | **rīmiyā** | trickery | "specialists mix various terrestrial substances to produce new, active powers that amaze and astound" |

- **CORPUS, the naming** (p. 5) The Quintet is "so named after the esotericist
  code phrase *kullu-hu sirr* (KLHSR), 'the whole is a secret'" — the five terms'
  consonants spell the phrase. **That is itself a lettrist joke and a puzzle.**
- **CORPUS, the hierarchy** (p. 5) The order "encodes an epistemological,
  technological and sociological hierarchy, beginning with the most technically
  difficult, expensive and elite and ending with the easiest, cheapest and most
  accessible to the masses, suitable for public and party performance."
  **→ A five-floor descent already has its difficulty curve, from the sources.**
- **CORPUS, the caution against reading it as fake** (p. 5): "we 'Enlightened'
  moderns must be more wary of reflexively committing the category error of
  presuming all magic to be fake and hence unreal by definition: for here fake
  magic has very real psychological but also physical results."
- **SOURCE in translation, and startling** — the illusionism section's first
  operation is a **golem recipe on the Islamicate side**: a lettuce leaf soaked
  in camel blood and buried in dung putrefies until "spirit becomes attached" and
  it births a winged snake with a camel's head; its blood, applied to the feet,
  lets you walk through fire and across water; "this blood can also reanimate
  corpses, as well as heal leprous flesh" (pp. 15–16). Melvin-Koushki's own
  summary calls it "creating a chimerical golem with the mere illusion of life"
  that "nevertheless produces a blood potion that can cure serious diseases –
  even death!"
  **→ The Introduction's golem lesson is currently Hebrew-only. This is the
  Arabic-side counterpart and it is procedural, timed, and has failure
  conditions written into it ("any failure to follow these directions precisely
  will result in the failure of the operation") — which is the Ottoman-operative
  ruleset's motive exactly.**
- **CORPUS** Lettrism is "the science of the Imams par excellence" (p. 5).
- **CORPUS, list of twelve illusionist operations** (p. 15): putrefactions and
  suffumigations of the Greater and Lesser Rites, food rite, drink rite, wake-up
  rite, sleeper interrogation, treasure dowsing, predator subjugation, instant
  agriculture, kohl-vision. **Twelve named operations, ready to be twelve
  levels.**

### 2.3 *The Meanings of Islamic Magic* — the field's own argument

Use this for framing and for anything the project says *about* the scholarship.
It is a first-person essay on why the word "magic" is a problem: "that Greco-Latin
anti-Persian slur"; the "colonialist-Orientalist mantra *Islam Is Magic*"; archives
that "class Islamic Magic as Bad Religion and Never Science in high nineteenth-
century pith-helmeted fashion." It also gives the field's positive claim: magic
as "a natural science perfected by Greek, [Arabic, Persian…]" and the occult
sciences as "precisely those sciences that give their practitioners" real
operative power — the analogy he reaches for is physics today.

**→ This is the source for the project's anti-pattern rule: never present this
material as spooky. `grimoire/themes/OCCULTOPHOBIA.md` and `DISENCHANTMENT.md`
carry the theme.**

---

## 3. The al-Būnī literature — where the per-letter attributions live

**On disk:** `../IslamicateOccultPortal/corpus/sources/*.md` (gitignored full
text, converted from PDF with footnotes intact — the footnotes are where the
shelfmarks are). Grep these; they are large.

### 3.1 Noah Gardiner, "Stars and Saints" (*Magic, Ritual, and Witchcraft* 12, 2017)

File: `gardiner-stars-and-saints-al-buni.md`. **The most useful single source for
per-letter cosmology we hold.** It reads al-Būnī's *Laṭāʾif al-ishārāt* directly
and gives folio citations.

**Al-Būnī's three tiers of letters** (pp. 56–57, from *Laṭāʾif* ff. 18a–18b):

| Tier | Count | What they are | Astrological analogue |
|---|---|---|---|
| **luciform** (nūrānī) | 7 | "not letters in the usual" sense; "[t]he occult force (*rūḥāniyya*) of every heavenly sphere is determined by the lights of every one of the luciform letters" | the seven planets |
| **spiritual** (rūḥānī) | 12 | **the human faculties** — see the list below | the twelve signs |
| **corporeal** | 28 (+ lām-alif = 29) | "the building blocks of manifest reality"; "all created things are composed of these corporeal, elemental letters"; "like the earth in relation to the spiritual letters" | the sublunar world |

**The twelve faculties, named** (*Laṭāʾif* f. 18a, Gardiner p. 56): hearing,
vision, smell, taste, touch, the cogitative, the imaginative, the formal, the
administrative, the integrative, the preserving, and the dispositive faculty.
That is the five external senses plus the Avicennan internal senses.

**The mediation rule** (p. 57) — this is a mechanic, not a decoration: "the
powers of the seven luciform letters do not act directly on the corporeal
letters, but rather only through the mediation of the twelve spiritual letters
that are the human faculties—much as the powers of the planets are mediated by
the signs and houses in conventional astrology." And: "every human cosmos in
accordance with his worthiness to witness the lights of those letters."
**→ A dependency graph with a human in the middle. Nothing in v2 has this shape
yet, and it is the strongest unbuilt structure in the Arabic material.**

**The four qualities in seven degrees** (p. 57): al-Būnī "divides the main
twenty-eight letters into four groups corresponding to the elemental qualities:
heat, moisture, dryness, and cold, such that there are seven 'degrees' for each
quality marked by individual letters," a scheme "reminiscent of Jabirian
alchemical theory" (n. 58, pointing to Haq, *Names, Natures, and Things*,
81–108).

**Why the human matters** (p. 57): al-Būnī departs from "conventional models of
astrological causation, in which celestial rays have no need of human mediators,"
because of "the central cosmological importance al-Būnī assigns to Adam and the
'human cosmos'". Gardiner links this to Ibn ʿArabī on how "the passage of a saint
or his posthumous sojourn in a place establishes in it a field of beneficent
power."
**→ A sage whose presence changes what letters can do in a place. That is a
character stat with a source.**

### 3.2 Jean-Charles Coulon on the *Kitāb Sharāsīm al-Hindiyya*

In `saif-leoni-melvin-koushki-yahya-2021-islamicate-occult-sciences.md`,
pp. 346–347, quoting fols. 322b–323a. **The one place we hold that lists the
natures letter by letter.**

> "The sages have said that all Arabic letters have a nature (*ṭabʿ*) and a
> property (*khāṣṣiyya*). Thus, their set is composed of the four natures. They
> are twenty-eight letters: seven hot, seven cold, seven wet, and seven dry. Alif
> is hot, bāʾ is cold, jīm is wet, dāl is dry, hāʾ is hot, wāw is cold, zāy is
> wet, ḥāʾ is dry, ṭāʾ is hot, yāʾ is cold, kāf is wet, lām is dry, mīm is hot,
> nūn is cold, sīn is wet, ʿayn is dry, fāʾ is hot, ṣād is cold, qāf is wet, rāʾ
> is dry, shīn is hot, tāʾ is cold, thāʾ is wet, khāʾ is dry, dhāl is hot, ḍād is
> cold, ẓāʾ is wet, ghayn is dry."

It cycles hot–cold–wet–dry down the abjad order. **Consequences worth noticing:**
adjacent letters in abjad order never share a nature; the seven of each nature are
spaced four apart.

The text itself reports **three competing schemes** and rates them: this one
(judged *al-alyaq*, most appropriate); the lunar-mansion natures ("similar"); and
one making the first seven hot, the second seven cold, and so on ("I do not know
the reality of the third"). Coulon notes the correspondence with the Jābirian
*Kitāb al-Mawāzīn al-ṣaghīr* holds "with the exception that the dry and wet
letters must be interchanged."
**→ The sources themselves disagree and rank their disagreement. That is a
ruleset, not a fact: three packs, one of which the source itself prefers.**

Also from the same passage: aromatic plants (*al-ʿaqāqīr*) and fumigations
(*al-bakhūr*) have natures too, so a working matches letter-nature to
material-nature.

### 3.3 Daniel Martin Varisco on the lunar mansions (*Arabica* 64, 2017)

In `islamicate-occultism-new-perspectives.md`, pp. 487–530; the translation of
Süleymaniye MS B89 f. 4r is at pp. 501–502. **The primary text on letters and
mansions that we can quote.**

- **SOURCE in translation** (f. 4r): "As for the twenty-eight letters according
  to the number of the twenty-eight mansions, fourteen of them are visible above
  the earth and fourteen are below. When a mansion sets, the fifteenth opposite
  it rises in this way all the time."
  **→ A rotating half-alphabet: fourteen letters "up" and fourteen "down" at any
  moment, advancing one per night. A turn scheduler, from the source.**
- **SOURCE in translation, the dot-omen scale** (f. 4r): "Thus, fifteen letters
  have diacritical points and thirteen are without… Those with diacritical points
  are as you can see: b, t, ṯ, ǧ, ḫ, ḏ, z, š, ḍ, ẓ, ġ, f, q, n, y. As for those
  letters without diacritical points, this is their description: a, ḥ, d, r, ṭ, k,
  l, m, ṣ, ʿ, s, h, w… those without diacritical points being auspicious mansions
  and those with diacritical points being inauspicious mansions. Regarding the
  mixed ones, those with one diacritical point are closer to being auspicious and
  those with two diacritical points are moderate in their inauspiciousness, while
  those with three diacritical points are the most inauspicious, such as the šīn
  and the ṯāʾ."
  **Checked against our own data:** `v2/data/letters.json` has exactly fifteen
  dotted (ب ج ز ي ن ف ق ش ت ث خ ذ ض ظ غ) and thirteen undotted (ا د ه و ح ط ك ل م س ع ص ر).
  The lists match al-Būnī's letter for letter.
- **SOURCE in translation, alif's mansion** (f. 4r, Varisco's summary): alif and
  *al-naṭḥ* are "both defined as hot and dry and associated with the color red,
  including Mars (mirrīḫ) as the element of fire," and the passage gives words
  for conjuring "to seek revenge on oppressors and tyrants," written on red
  copper, iron or red potsherds and buried in the target's [ground].
- **CORPUS, what the book is** (p. 499): the *Shams* "is not a book for the
  uninitiated… it is basically a set of recipes, which are at times
  contradictory," and "a major emphasis is the timing for making various kinds of
  magical charms."
- **CORPUS, provenance of the passage** Two Süleymaniye manuscripts and the Cairo
  editions carry two sets of mansion prognostications; the shorter parallels the
  early-15th-c. *Laṭāʾif al-išārāt* (MS Paris BnF Arabe 2658), the longer is in
  neither that nor the late-14th/early-15th-c. *Šams al-maʿārif wa-laṭāʾif
  al-ʿawārif* (BnF Arabe 2647). **These two shelfmarks are the best candidates
  for a rights-checked image** (see `v2/apps/introduction/FETCHLIST.md`).
- **CORPUS, the term** *rūḥāniyya*: "generally glossed as 'spirituality' or
  'spiritual magic'. I translate it here as 'spiritual agency'."

### 3.4 Godefroid de Callataÿ, *Ikhwan al-Safaʾ* (2005)

File: `de-callataÿ-2005-ikhwan-al-safa-brotherhood.md`, pp. 24–25.

- **CORPUS** "as an obvious sign that twenty-eight is a perfect number (that is,
  equal to the sum of its factors, according to the Pythagorean definition), they
  point to the relationship which is bound to exist between the twenty-eight
  mansions of the Moon, the twenty-eight parts of the human body and the
  twenty-eight letters of the Arabic alphabet."
- **CORPUS, and a warning about the mode of argument**: "The Ikhwan do not
  explain how these parallels may be accounted for, nor why such correspondences
  are to be found in so many places. They just find them natural."
  **→ Do not present correspondence as demonstration. Ibn Turka's whole
  contribution is that he tries to *prove* rather than assert (§5.1).**

### 3.5 John D. Martin III, *Theurgy in the Medieval Islamic World*

File: `martin-theurgy-medieval-islamic-world-al-buni.md`, pp. 61–62.

- **CORPUS** on how to read the qualities: they "should be conceived as
  qualities, the same way that we might describe spicy food as 'hot' or someone's
  mood as 'light'… describe a certain element as 'fiery' or a letter as 'watery'.
  The latter case is the one most often seen in the work of al-Būnī."
- **CORPUS** the associations "allow for the discernment of the most opportune
  times and most appropriate methods for the working of theurgic rites."
- **REPORTED** the tables: *Manbaʿ uṣūl al-ḥikma* p. 66 (elemental associations
  with the abjad); *Shams al-maʿārif al-kubrā* p. 23 (the chart opening the lunar
  mansions section); *Shams al-ṣughrā* p. 16 (28 mansions = 28 letters).

---

## 4. Marla Segol, *Word and Image in Medieval Kabbalah* (Palgrave, 2012)

**On disk:** `E:\pdf\kabbalah\Kabbalah - Sefer Yetzirah\` (with several articles
and two *Sefer Yetsirah* editions beside it). Not in the repo; not copyable into
it.

**What it is.** A study of the *diagrams* in medieval *Sefer Yetsirah*
manuscripts and commentaries — what they show, what they were for, and how they
argue with their own texts. For this project it is simultaneously the Hebrew
research source and a book about *interface design*, which is why it repays
reading twice.

### 4.1 The SY's structure and the 3/7/12 division (pp. 22–23, 41)

- **SOURCE via CORPUS** Six chapters. Ch. 1: thirty-two paths of wisdom "carve
  out" the ten *sefirot* and the twenty-two letters; the sefirot are described in
  "purposefully paradoxical terms to assert both their existence and their
  immaterial nature"; then the emanation of **three** elements — air, water, fire.
  **"There is no earth element."**
- **SOURCE via CORPUS** Ch. 2: the letters are "carved out by the voice, hewn out
  of the air, and fixed in the mouth"; each letter creates in three realms —
  **the universe, the year, and the soul** (space, time, and the human being).
- **SOURCE via CORPUS** The division: **three mothers** (Aleph, Mem, Shin);
  **seven doubles** (Bet, Gimel, Dalet, Kaf, Peh, Resh, Tav), "letters whose
  sound can be hardened with the addition of a dagesh"; **twelve simples**.
- **SOURCE via CORPUS, ch. 4–5** The doubles get seven contraries and the planets;
  the formula is quoted at p. 41: "He made Bet rule, and bound it to a crown, and
  combined one with another and formed with it **Saturn in the universe, the
  Sabbath in the year, and mouth in mankind**." The simples get the twelve
  actions — "sight, hearing, smell, speech, taste, coition, action, motion,
  anger, laughter, thought, and sleep" — called the "Arms of the Universe," which
  "provide its geographic boundaries," plus a constellation and a month each.
- **SOURCE via CORPUS, ch. 6** adds the **T'li** (the dragon), "a constellation
  that moves all the others and rules over them," and ends with Abraham, who
  "looked, saw, understood, probed, engraved and carved" and "was successful in
  creation."
- **CORPUS, the combinatorial teaser** (p. 41, quoting SY): "The Seven Doubles,
  how does one permute them? Two stones build two houses, three build six houses,
  four build 24 houses, five build 120 houses, six build 720 houses, and seven
  build 5040 houses. From there on go out and calculate that which the mouth
  cannot speak and the ear cannot hear." Segol's note: "the reader is addressed
  in the imperative, but asked to complete an impossible task."
  **→ Factorials, in the text, as an instruction. 2!=2, 3!=6, 4!=24, 7!=5040.
  "Two stones build two houses" is a building metaphor in the source.**

### 4.2 The 231 gates (p. 51)

- **SOURCE via CORPUS** SY18: "Twenty-two letters of foundation, fixed on a wheel
  with 231 gates. The wheel rotates forward and backward: And this is the sign of
  the matter: if for good there is nothing higher than pleasure, and if for evil,
  there is nothing lower than pain."
- **CORPUS** Shabbetai Donnolo's tenth-century commentary reads it as intention:
  "If you set your mind, by means of this group of letters, to act for good, to
  elevate God greatly, then there is nothing higher than pleasure. But if for
  evil there is nothing lower than pain." Segol: the passage is about
  "intentionality, whether for praise or for other purposes, making the
  distinction, it seems, between integral and alien magic."
  **→ 231 = C(22,2). An intention flag on a combination is a moral mechanic with
  a tenth-century commentary behind it.**

### 4.3 The space cube and the six directions (pp. 91, 72)

- **SOURCE via CORPUS** SY15–16 give **six directions** which the medieval
  diagrams draw as a "space cube" section, "associated with the dimensions of the
  throne of glory," hewn out of the three elements; SY14: "Fire from water; he
  carved them and hewed in it the throne of glory… and from the three of them he
  founded his abode."
- **SOURCE via CORPUS** SY38 (the doubles' ring) "stresses the importance of the
  number seven, defining it as the six sides of a cube with the Holy Temple set
  in the middle, with God 'supporting them all'" (Segol p. 72).
  **→ Seven doubles = six faces + centre. In a cubic-cell engine that is exactly
  a cell and its six neighbours, and it is the most directly implementable
  spatial fact in either tradition. Nothing in v2 or GoldenDawnBlocks uses it.**

### 4.4 The golem (pp. 105–106, and ch. 6 generally)

- **CORPUS** The recipes come from commentaries: Eleazar of Worms's *Sefer Tagi*
  (early 13th c.), R. Aharon Berakhiah of Modena's *Maʿavar Yabboq* (16th c.),
  Abulafia's *Ḥayyei Olam ha-Ba* (13th c.); the diagrams from Pseudo-Saadya
  (12th c.), Abulafia, and Pseudo-Rabad (13th–14th c.).
- **CORPUS quoting Idel** the two shared steps: "the material employed to create
  the golem is dust, eventually kneaded with water, and the pronunciation of
  combinations of letters over the shaped body, in order to animate it."
- **CORPUS** The animation is recitation **plus ritual dance** — a *makhol*,
  circumambulating the creature while reciting permutations, "a fixed number of
  circumambulations, combined with particular recitations." The recited
  combinations are of the tetragrammaton or of all twenty-two letters, "based on
  the kabbalistic concept that the divine names are the 'souls' of the other
  letters," which is also why SY15 "seals the six directions" with the divine
  name.
- **CORPUS, the interpretive point** (p. 105) the medieval golem's "function is
  not relational, and therefore it is not a proper subject. Instead, it is used to
  effect metaphysical changes, including the resurrection of the dead and the
  reconstruction of the cosmos." Not a servant. Not Frankenstein.
- ⚠ **The אמת/מת (emet/met) forehead detail is NOT in these passages.** It
  belongs to the later legend. The Introduction uses it *as* legend and labels it.

### 4.5 What the diagrams were for (p. 8) — read this before designing any UI

Segol's four functions, in her words:

> "The diagrams are also utilitarian in their purpose. They are tools: for
> learning, for thinking, for orienting, and for doing… Many of the diagrams
> analyzed in this book provide instructions for the ritual of letter combination
> to animate a golem."

And the sharper point: the diagrams "are not the same as the texts. They use a
different medium for expression, and in addition to this, sometimes the knowledge
they convey agrees literally with the text, but sometimes it does not, so that
they work to graft different ideas, mystical and magical practices, and systems
of symbols onto their source texts."
**→ A period diagram is an interface that argues with its own documentation.
That is the licence for `v2/apps/introduction/src/diagrams.js` to reconstruct
rather than reproduce — and the reason each reconstruction must say what it is
drawn after.**

---

## 5. The portal's own entries

**On disk:** `portal/db/turka.db` (this repo) and
`../IslamicateOccultPortal/db/islamicate.db` (the sibling). Tables: `concepts`,
`arguments`, `figures`, `texts`, `institutions`, `timeline_events`, `images`,
`bibliography`, `scholarly_refs`. Query them; do not re-derive them.

### 5.1 `three-lettrisms` — the argument the rulesets are built on

Lettrism runs in three strands — **gnostic-messianic, Sufi, and intellectual** —
and Ibn Turka's elevation of it against philosophy constitutes the third as a
distinct thing. The entry's own framing: it is "typically and erroneously assumed
that the Ḥurūfī movement defines later Islamicate lettrism"; what the Ḥurūfīs'
vigour actually demonstrates is lettrism's valency in Iran "at all levels."

**This is the single most load-bearing research finding in the codebase.**
`v2/rulesets/rulesets.json` is that entry made executable: five packs that differ
**by motive**, and the Descent is the game of not being told which one you are in.

### 5.2 `lettrism-universal`, `jafr`, `ilm-al-huruf`, `divine-names`, `barzakh`

- **`lettrism-universal`**: "only the letter encompasses all that is and is not,
  all that can and cannot be; it alone is the *coincidentia oppositorum*; hence
  lettrism is the only truly universal science" — against philosophy's claim to
  treat being *qua* being. "A philosophical concept ranges over the actual and
  the possible. The letter reaches also to non-being and impossibility."
- **`jafr`**: letter divination; inventor held to be **ʿAlī ibn Abī Ṭālib**,
  "the chief mathematician of Islam"; foundational text *K. al-Jafr wa-l-Jāmiʿa*,
  "an omniscient book recording past and future history."
- **`ilm-al-huruf`**: 28 letters ↔ 28 divine names; the light/dark division.
- **`barzakh`**: the isthmus, "where letters become forms, where divine names
  manifest as causal powers" — the Sufi ruleset's reason for refusing to sever.
- **`ottoman-asymmetry`**: Bisṭāmī's jafr manual became Ottoman **state
  equipment** while Ibn Turka was tried three times — same teacher, same science,
  opposite outcomes. "The variable is the polity, not the doctrine."
  **→ This is the finding the Descent's floors dramatise.**

---

## 6. Extraction table — research to mechanic

What has been built, what is ready to build, and what is refused. "Ready" means:
the source is held, the claim is cited, and the rule is deterministic.

| Research fact | Source | Status in code |
|---|---|---|
| Letters are the material of the world | *Prologue*; Gardiner p. 57; SY ch. 1 | **built** — the whole of v2 |
| Three registers: mental/spoken/written | *Prologue* pp. 8–9 | **built** — `engine/vm.js` |
| Abjad value as mass and as sum | *Prologue* nn. 46–47 | **built** — Abjad Tower, Reckoner |
| Three lettrisms differing by motive | portal `three-lettrisms` | **built** — `rulesets/rulesets.json` |
| Sufi refusal to cut (barzakh) | portal `barzakh` | **built** — the Sufi pack denies SEVER |
| Procedure works whole or not at all | portal `jafr`, *Occult Court* p. 15 | **built** — Ottoman pack's `min_length` |
| 28 letters, 14 light / 14 dark | portal `ilm-al-huruf` | **built** — `data/letters.json` |
| SY 3/7/12 division, aspects, faculties | Segol pp. 22–23, 41 | **built as data** — `data/hebrew.json`, shown in the Introduction |
| Final forms end a word | the page itself | **built** — `hebrew.json`, SEVER, labelled ours |
| Golem: dust + water + letters, then unmaking | Segol pp. 105–106 | **built** — Introduction lesson 15 |
| **Four natures, seven each** | Coulon pp. 346–347 | **carried as data** (`letters.json` → `attested.nature`, verified 7/7/7/7); the mechanic is still **ready** — a transmutation rule: a letter's nature moves the material under it along earth↔water↔fire↔air |
| **28 mansions, one per letter, 14 up / 14 down** | Varisco pp. 501–502 | **carried as data** (`attested.mansion`, 1..28 verified); the mechanic is still **ready** — a turn scheduler; one letter is "in its mansion" per turn |
| **Dots as an omen scale (1 < 2 < 3)** | Varisco p. 502 | **carried as data** (`attested.omen`, and `--verify` checks our dotted/undotted letters against al-Būnī's own lists — they match); the mechanic is still **ready** — the cost of RAISE/LOWER |
| **taksīr / zubur / bayyināt** | *Prologue* n. 35 | **built** — `engine/taksir.js`, pinned to the source's own ALF example; the letternames live in `build_letters.py` with the dropped hamza stated; bounded to eight releasable letters. Played in `apps/tribunal/` |
| **Seven doubles = six faces + centre** | Segol p. 72 (SY38) | **ready** — the strongest unbuilt spatial rule; a cell and its six neighbours |
| **231 gates with an intention flag** | Segol p. 51 (SY18, Donnolo) | **ready** — combination plus a for-good/for-ill switch |
| **Seven luciform → twelve faculties → 28 corporeal** | Gardiner pp. 56–57 | **ready** — a three-tier dependency; power reaches matter only through a faculty |
| **The Quintet as a difficulty ladder** | *Occult Court* p. 5 | **ready** — kīmiyā hardest and most elite → rīmiyā cheapest and most public |
| **Twelve illusionist operations** | *Occult Court* p. 15 | **ready** — twelve named levels |
| **The Islamicate golem (putrefaction rite)** | *Occult Court* pp. 15–16 | **ready** — timed, sequenced, with a stated failure condition |
| Which divine name goes with which letter | — | **refused** — no held source tabulates it |
| Which planet goes with which double | — | **partial** — Bet↔Saturn attested (Segol p. 41); the rest is recension-dependent, ⚠ in `POWERSOFTHELETTERS.md` |
| Powers for Hebrew letters as blocks | — | **refused** — nothing derives them from form; GoldenDawnBlocks' ELEMENT/INVERT/COMBINE/SEAL is design, not evidence |

---

## 7. The quotable set

Short, attributed, safe to put on a screen. Keep quotations under about fifteen
words and always name the source in the same breath; longer paraphrase is fine.

- "the building blocks of manifest reality" — Gardiner on al-Būnī's corporeal letters
- "carved out by the voice, hewn out of the air, and fixed in the mouth" — SY ch. 2
- "Twenty-two letters of foundation, fixed on a wheel with 231 gates" — SY §18
- "the chain of being is not cut" — the Sufi ruleset's own formulation of *barzakh*
- "the whole is a secret" (*kullu-hu sirr*) — the Quintet's code phrase
- "sciences that deal with reality itself" — *Boon for the Khan*, on the occult sciences
- "He made Bet rule, and bound it to a crown" — SY ch. 5
- "looked, saw, understood, probed, engraved and carved" — SY ch. 6, on Abraham

---

## 8. What we do not have, ranked by how much it would change things

1. **`Shams al-maʿārif` itself.** In the corpus as a 604-page scan with **zero
   text layer**. Tesseract is not installed. This is al-Būnī's own grimoire and
   the source of nearly everything in §3; we are reading it entirely through its
   readers. Unblocking: install Tesseract, add an OCR fallback to
   `../IslamicateOccultPortal/scripts/convert_corpus.py`.
2. **"Of Islamic Grammatology: Ibn Turka's Lettrist Metaphysics of Light,"**
   *Al-ʿUṣūr al-Wusṭā* 24 (2016): 42–113. The deep dive on the *Mafāḥiṣ*. Cited
   exactly; not held. Everything the project says about Ibn Turka's *technical*
   lettrism is inference from the *Prologue*.
3. **Ibn ʿArabī, *Futūḥāt* ch. 2** — the letters and the mansions in the Sufi
   line. Not held; the Sufi ruleset's motive rests on portal entries.
4. **Idel, *Golem* (1990)** and Scholem on the golem. Read only through Segol.
5. **The period images.** None. Every diagram in the Introduction is a
   reconstruction. `v2/apps/introduction/FETCHLIST.md` is the candidate list with
   the rights position for each.
6. **Two more scanned corpus items with no text layer**: `gardiner-buni-untitled`
   (482 pp.) and `abouzeid-al-farabi-brethren-of-purity` (533 pp.).

---

## 9. Rules for the next agent

1. **Cite to a page or a folio, or label it ⚠.** "Al-Būnī says" without a page is
   not a citation; it is a memory.
2. **Prefer the source's own disagreement to a tidy synthesis.** The *Sharāsīm*
   gives three schemes of natures and ranks them; al-Būnī's own table differs
   again. Ship the disagreement as rulesets, not the average as a fact.
3. **A correspondence is not a demonstration.** The Ikhwān assert; Ibn Turka
   proves. If a mechanic only pattern-matches, it is decoration — the anti-pattern
   `grimoire/themes/LETTRISM.md` names.
4. **Show the arithmetic.** Melvin-Koushki's notes show their work; so must the
   game. Any alphanumeric claim on screen should be checkable against
   `data/letters.json`.
5. **When a claim can be checked against our own data, check it and say so.**
   Al-Būnī's fifteen-dotted/thirteen-undotted count was checked and matched;
   that sentence is worth more than a paragraph of assertion.
6. **Never copy source text into a tracked file** beyond a short attributed
   quotation. `tools/check_repo_rules.py` enforces the PDF rule; the quotation
   rule is on you.
7. **Write findings down where they will be found.** A finding that lives only in
   a session transcript is lost: `grimoire/themes/` for the theme,
   `docs/DECISIONS.md` for the call, this file for the citation.
