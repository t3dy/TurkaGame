---
title: The Powers of the Letters
description: What the lettrist and kabbalistic traditions attribute to each Arabic and Hebrew letter — number, nature, element, planet, lunar mansion, faculty, name — with the sources those attributions come from, and how each one becomes, or could become, a way for the player to act on the world.
---

# The Powers of the Letters · قوى الحروف · כוחות האותיות

**What this is.** A single reference for the two questions the games keep
asking: *what did the traditions say each letter does*, and *what does that let
the player do*. It is written for Ted first and for a future session second, so
it explains too much rather than too little. It cites what we have actually
read, and marks what we have not.

**How to read the labels.** Every attribution in this document carries one of
the project's five honesty labels:

| Label | Meaning |
|---|---|
| **SOURCE** | a primary text we hold or have read in translation, cited to the passage |
| **CORPUS** | secondary scholarship in `research/library/` or the portal's corpus, cited to the page |
| **REPORTED** | a secondary source *reporting* a primary one we do not hold |
| **INTERPRETATION** | our reading of held material, stated as ours |
| **GAME FICTION** | a mechanic with no historical claim behind it at all |
| ⚠ | general knowledge, not checked against a held text — treat as unverified |

The engine's own rule is stricter than any tradition's: a letter's *primitive*
(what it can do to a block) is **derived from the visible form of the letter**
— an upright stroke holds a frame, a closed loop binds, a tail pours, dots above
raise and below lower, and the six letters that never join what follows sever
([`README.md`](README.md) § 1). That is the engine's contribution and it is
ours. What the traditions attribute — number, nature, planet, mansion, name — is
a *second* layer, and this document is where the two layers are laid side by
side so the games can draw on both without confusing them.

---

## 1. The two alphabets as building materials

The whole project rests on a claim the sources make outright: **creation is
linguistic, and the alphabet is its material.** The *Sefer Yetsirah* says God
"carved out" the twenty-two letters and combined them to make everything; the
Islamicate science of letters (*ʿilm al-ḥurūf*) says the Arabic letters are
the elements of which all created things are composed. Both traditions then
tell the reader how to do the same. So the letters are not the *theme* of a
building game; they are its bricks. Both halves of that are attested:

- **SOURCE** *Sefer Yetsirah*, chapters 1–2: thirty-two paths carve out ten
  *sefirot* and twenty-two letters; the letters are "carved out by the voice,
  hewn out of the air, and fixed in the mouth," and each is used to create three
  realms — the universe, the year, and the soul. Most versions end with Abraham
  who "looked, saw, understood, probed, engraved and carved" and "was successful
  in creation" (**CORPUS** Segol 2012, pp. 22–23, summarising and quoting the
  text).
- **CORPUS** al-Būnī, as read by Gardiner: the twenty-eight "corporeal letters"
  are "the building blocks of manifest reality"; "all created things are composed
  of these corporeal, elemental letters" (Gardiner, *Stars and Saints*, p. 57,
  reporting *Laṭāʾif al-ishārāt* fol. 18b).
- **CORPUS** Ibn Turka, as read by Melvin-Koushki: the Arabic alphabet is the
  cosmos's source code, and lettrism is therefore simultaneously mathematics,
  physics and worship; the *Mafāḥiṣ* is "the most philosophically systematic
  formulation of lettrism… ever penned" (*Prologue*; see
  [`../grimoire/themes/LETTRISM.md`](../grimoire/themes/LETTRISM.md)).
- **CORPUS** the portal's argument entry `lettrism-universal`: only the letter
  encompasses being and non-being, so lettrism is the only universal science.

That is why, in the games, you *write* to build. A block is a letter; a wall is
a word; and reading a wall back as a word (`engine/reader.js`) is not a metaphor
but the thing the sources say the world is.

---

## 2. The Arabic letters, one by one

### 2.1 The four divisions, and where each comes from

Four independent ways of dividing the twenty-eight letters are in play, and
`data/build_letters.py --verify` proves they are independent rather than one
fact told four times:

| Division | What it is | Label and source |
|---|---|---|
| **Abjad value** | 1…1000 in the traditional order (ا ب ج د ه و ز ح ط ي ك ل م ن س ع ف ص ق ر ش ت ث خ ذ ض ظ غ) | **CORPUS** the number side of lettrism is the *proof procedure*, with worked equations in *Prologue* — see [`../grimoire/themes/GEMATRIA.md`](../grimoire/themes/GEMATRIA.md) |
| **Luminous / dark** (nūrānī / ẓulmānī) | fourteen letters of light and fourteen of darkness | **CORPUS** portal entry `ilm-al-huruf` (28 letters ↔ 28 divine names; the light/dark split). ⚠ That the fourteen luminous letters are exactly the letters that open Qur'anic sūras (the *muqaṭṭaʿāt*: ا ح ر س ص ط ع ق ك ل م ن ه ي) is the standard identification and matches our table, but no held text states it in those words. *Prologue* does call the *muqaṭṭaʿāt* "the wellspring of lettrism." |
| **Sun / moon** | whether the article's lām assimilates before the letter | **SOURCE** Arabic grammar; observable on any page |
| **Connecting / non-connecting** | ا د ذ ر ز و never join the letter that follows | **SOURCE** Arabic orthography; observable on any page |

Two more divisions come from the sources. As of 2026-09-07 they are **in the
letter table's `attested` layer** — carried as evidence with their citations
attached to every letter, and checked by `build_letters.py --verify` — but **no
engine code acts on them**. That separation is deliberate: what is on the page
lives in `data/letters.json`, what someone claimed lives in a ruleset, and a
ruleset that uses these will have to cite them.

| Division | What it is | Label and source |
|---|---|---|
| **The four natures** (hot / cold / wet / dry), seven letters each | al-Būnī "divides the main twenty-eight letters into four groups corresponding to the elemental qualities: heat, moisture, dryness, and cold, such that there are seven 'degrees' for each quality marked by individual letters" | **CORPUS** Gardiner, *Stars and Saints*, p. 57, reporting *Laṭāʾif al-ishārāt*; a chart of the assignments opens the lunar-mansions section of the *Shams al-maʿārif al-kubrā* (p. 23) and there is a table in *Manbaʿ uṣūl al-ḥikma* (p. 66) (**REPORTED** via Martin, *Theurgy*, pp. 61–62). The scheme is "reminiscent of Jabirian alchemical theory" (Gardiner n. 58). |
| **The twenty-eight lunar mansions** | one letter per mansion, in abjad order; alif ↔ al-naṭḥ | **SOURCE in translation** *Shams al-maʿārif*, Süleymaniye B89 fol. 4r, translated by Varisco (*Arabica* 64, 2017, pp. 501–502): "As for the twenty-eight letters according to the number of the twenty-eight mansions…" **CORPUS** the Ikhwān al-Ṣafāʾ already tie the 28 mansions, the 28 parts of the human body and the 28 letters together, because 28 is a perfect number (de Callataÿ 2005, pp. 24–25). |

And one that is *in* the sources and cuts across our engine's own derivation:

> **Dots are inauspicious.** "Fifteen letters have diacritical points and thirteen
> are without… those without diacritical points being auspicious mansions and
> those with diacritical points being inauspicious mansions… those with one
> diacritical point are closer to being auspicious and those with two diacritical
> points are moderate in their inauspiciousness, while those with three
> diacritical points are the most inauspicious, such as the shīn and the thāʾ."
> — **SOURCE in translation** *Shams al-maʿārif*, fol. 4r (Varisco p. 502).

The engine derives RAISE and LOWER from dots above and below. Al-Būnī reads the
same dots as a scale of ill omen. The two readings do not contradict each other;
they are different questions asked of the same mark, and §4 says what to do with
that.

**And the two counts are now checked against each other.** `build_letters.py
--verify` compares our dotted and undotted letters against al-Būnī's own two
lists on that folio, and fails if they differ. They do not differ: fifteen and
thirteen, letter for letter. A thirteenth-century grimoire and this repo's data
file are counting the same alphabet, which is the strongest evidence we have that
the attested layer is attached to the right letters.

### 2.2 The table

`abjad` and `class` are from `data/letters.json`; the engine primitives are the
ones `build_letters.py` derives from form. **Nature** is the *Kitāb Sharāsīm
al-Hindiyya*'s list, which cycles hot–cold–wet–dry down the abjad order
(**CORPUS** Coulon's chapter in Saif et al. 2021, pp. 346–347, quoting fols.
322b–323a — the chapter notes this matches the Jābirian *Kitāb al-Mawāzīn
al-ṣaghīr* "with the exception that the dry and wet letters must be
interchanged"). It is one of three schemes the *Sharāsīm* reports; the second is
al-Būnī's mansions, the third simply makes the first heptad hot, the second cold
and so on. **Dots** is the count that al-Būnī's omen scale reads.

| # | Letter | Name | Abjad | Class | Sun/Moon | Joins forward | Dots | Nature (Sharāsīm) | Engine primitives (from form) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ا | alif | 1 | light | moon | no | 0 | hot | AXIS · SEVER · DISTINGUISH |
| 2 | ب | bāʾ | 2 | dark | moon | yes | 1 below | cold | LOWER · DISTINGUISH |
| 3 | ج | jīm | 3 | dark | moon | yes | 1 below | wet | LOWER · POUR · DISTINGUISH |
| 4 | د | dāl | 4 | dark | sun | no | 0 | dry | SEVER · ASSIMILATE |
| 5 | ه | hāʾ | 5 | light | moon | yes | 0 | hot | BIND · DISTINGUISH |
| 6 | و | wāw | 6 | dark | moon | no | 0 | cold | BIND · POUR · SEVER · DISTINGUISH |
| 7 | ز | zāy | 7 | dark | sun | no | 1 above | wet | RAISE · POUR · SEVER · ASSIMILATE |
| 8 | ح | ḥāʾ | 8 | light | moon | yes | 0 | dry | POUR · DISTINGUISH |
| 9 | ط | ṭāʾ | 9 | light | sun | yes | 0 | hot | BIND · ASSIMILATE |
| 10 | ي | yāʾ | 10 | light | moon | yes | 2 below | cold | LOWER · POUR · DISTINGUISH |
| 11 | ك | kāf | 20 | light | moon | yes | 0 | wet | DISTINGUISH |
| 12 | ل | lām | 30 | light | sun | yes | 0 | dry | AXIS · POUR · ASSIMILATE |
| 13 | م | mīm | 40 | light | moon | yes | 0 | hot | BIND · POUR · DISTINGUISH |
| 14 | ن | nūn | 50 | light | sun | yes | 1 above | cold | RAISE · POUR · ASSIMILATE |
| 15 | س | sīn | 60 | light | sun | yes | 0 | wet | POUR · ASSIMILATE |
| 16 | ع | ʿayn | 70 | light | moon | yes | 0 | dry | POUR · DISTINGUISH |
| 17 | ف | fāʾ | 80 | dark | moon | yes | 1 above | hot | RAISE · BIND · DISTINGUISH |
| 18 | ص | ṣād | 90 | light | sun | yes | 0 | cold | BIND · POUR · ASSIMILATE |
| 19 | ق | qāf | 100 | light | moon | yes | 2 above | wet | RAISE · BIND · POUR · DISTINGUISH |
| 20 | ر | rāʾ | 200 | light | sun | no | 0 | dry | POUR · SEVER · ASSIMILATE |
| 21 | ش | shīn | 300 | dark | sun | yes | 3 above | hot | RAISE · POUR · ASSIMILATE |
| 22 | ت | tāʾ | 400 | dark | sun | yes | 2 above | cold | RAISE · ASSIMILATE |
| 23 | ث | thāʾ | 500 | dark | sun | yes | 3 above | wet | RAISE · ASSIMILATE |
| 24 | خ | khāʾ | 600 | dark | moon | yes | 1 above | dry | RAISE · POUR · DISTINGUISH |
| 25 | ذ | dhāl | 700 | dark | sun | no | 1 above | hot | RAISE · SEVER · ASSIMILATE |
| 26 | ض | ḍād | 800 | dark | sun | yes | 1 above | cold | RAISE · BIND · POUR · ASSIMILATE |
| 27 | ظ | ẓāʾ | 900 | dark | sun | yes | 1 above | wet | RAISE · BIND · ASSIMILATE |
| 28 | غ | ghayn | 1000 | dark | moon | yes | 1 above | dry | RAISE · POUR · DISTINGUISH |

Two things to notice, because both are game design waiting to happen:

- **Al-Būnī's count is our count.** He says fifteen letters carry dots and
  thirteen do not; `data/letters.json` has exactly fifteen dotted (ب ج ز ي ن ف ق ش ت ث خ ذ ض ظ غ)
  and thirteen undotted (ا د ه و ح ط ك ل م س ع ص ر). Two independent
  divisions nearly coincide: of the undotted letters only د and و are dark, and
  of the dotted only ي ن ق are luminous. Those five letters are where the omen
  scale and the light/dark split disagree, and a puzzle can live in exactly
  that disagreement (checked against the data, 2026-09-07).
- **The natures cycle, so adjacent letters in abjad order always differ.** A
  hot letter is followed by a cold one. That is a rule about *sequence*, which is
  exactly what a program of letters is.

### 2.3 What the sources say a letter *does*

Each attribution answers a different question. Here is what each one is, in the
sources' own terms, and what it becomes in play.

**Number (abjad).** Letters *are* numbers, and calculation on words is
calculation on the world. *Prologue* demonstrates it: ṣawāb = 99 keyed to the
99 names; ʿaṭā (gift) = 80 = aʿdād (numbers); ʿAlī = 110 = alif (**CORPUS**, see
GEMATRIA.md). Ibn Turka's own lettrism is "intellectual" because it *proves* by
proportion (portal `pythagorean-cosmology`; ruleset `intellectual`).
*In play:* mass in Abjad Tower; the Reckoning (name a number and every run
summing to it comes apart); the intellectual floor's strength, which is the
proportion between adjacent abjad values. All shipped.

**Nature (hot / cold / wet / dry).** A letter has a *ṭabʿ* and a *khāṣṣiyya*,
a nature and a property, and so do drugs and fumigations (*Sharāsīm*, above).
Al-Būnī uses the natures "as qualities, the same way that we might describe
spicy food as 'hot'… a letter as 'watery'" (Martin p. 61), and the natures fix
"the most opportune times and most appropriate methods" for a rite (p. 62).
*In play:* **not yet built.** The engine's four *materials* (earth, water, fire,
air) exist and letters already act on the cell above or below them (RAISE,
LOWER, POUR). The natural extension — **PROPOSED, INTERPRETATION** — is that a
letter's nature is what it *transmutes toward*: a hot letter written under
water dries it toward earth; a wet letter under earth softens it toward water.
That would give every one of the twenty-eight a second, attested job without
adding a primitive: the target is a material, and the material ladder is
already there.

**Luminous and dark.** The fourteen luminous letters are the ones through
which, in the Sufi reading, the divine names reach the world: "the powers of
the seven luciform letters do not act directly on the corporeal letters, but
rather only through the mediation of the twelve spiritual letters that are the
human faculties — much as the powers of the planets are mediated by the signs
and houses" (Gardiner p. 57, quoting *Laṭāʾif* fol. 18b: "every human cosmos in
accordance with his worthiness to witness the lights of those letters"). Note
al-Būnī's three tiers — **seven luciform, twelve spiritual, twenty-eight
corporeal** — which is the planets / signs / sublunar world as an alphabet.
*In play:* the Sufi ruleset's strength rule (share of luminous letters in the
program) and its *reach* by register. Shipped. **Not yet built:** al-Būnī's
tiering, where seven letters act only *through* twelve others — a dependency
rule a puzzle could stand on (PROPOSED).

**Lunar mansion.** One letter per mansion, so every letter has *a time*:
"a major emphasis is the timing for making various kinds of magical charms"
(Varisco p. 499), and the *Shams* is "basically a set of recipes" telling you
what to do or not do while the moon is in each mansion. Alif ↔ al-naṭḥ is "hot
and dry… red, including Mars… the element of fire" (Varisco p. 502).
*In play:* **not yet built**, and it is the missing turn structure. A run of
twenty-eight turns is a lunar month; on each turn one letter is *in its
mansion* and acts at full strength while the others do not (PROPOSED). The
Ottoman-operative ruleset, which is already "procedural," is where this belongs
first. The dotted/undotted omen scale is the obvious cost: on an inauspicious
mansion's turn, the thing you build is the thing that will be tested.

**Divine name.** Each of the twenty-eight letters corresponds to one divine name,
"making letters themselves expressions of divine attributes" (portal
`divine-names`, `ilm-al-huruf`). Which name goes with which letter is a matter
the held sources do not tabulate, so this document does not either. *In play:*
the Reckoner's *Invoke the Name* operation, which acts on every instance of a
letter at once. Shipped, but the name itself is not shown, correctly.

**Body part.** The Ikhwān pair the twenty-eight letters with the twenty-eight
parts of the human body (de Callataÿ pp. 24–25). *In play:* this is the
Arabic-side warrant for the **golem** lesson in the Introduction mode: a body
built of letters is not a Hebrew borrowing but a correspondence the Brethren
themselves state.

**Register.** Ibn Turka's *Mafāḥiṣ* gives written, spoken and mental letters
(*Prologue*; LETTRISM.md), which the engine runs as persist / run-once / plan.
Shipped, and the Sufi ruleset ties *reach* to register. **Not yet built:**
*taksīr* — writing a letter's name in full, splitting it into *zubur* and
*bayyināt*, eliminating repeats (*Prologue* n. 35) — a real algorithm that
would let a single letter unfold into a word. PROPOSED, and the Letter Machine
is where it fits.

---

## 3. The Hebrew letters, one by one

### 3.1 The division the *Sefer Yetsirah* makes

The *Sefer Yetsirah* divides the twenty-two letters into **three mothers**
(א מ ש), **seven doubles** (ב ג ד כ פ ר ת — "letters whose sound can be hardened
with the addition of a dagesh") and **twelve simples** (**CORPUS** Segol p. 23;
**SOURCE** SY ch. 1). Chapter 3 gives the mothers the three elements — air,
water, fire; "there is no earth element" (Segol p. 23). Chapter 4 gives each
double two contrary aspects and a planet: "He made Bet rule, and bound it to a
crown, and combined one with another and formed with it Saturn in the universe,
the Sabbath in the year, and mouth in mankind" (SY, quoted at Segol p. 41).
Chapter 5 gives each simple one of twelve human actions — "sight, hearing,
smell, speech, taste, coition, action, motion, anger, laughter, thought, and
sleep" — and "one of the 12 constellations, and one of the months of the year"
(Segol p. 41). Chapter 2 describes the letters "fixed on a wheel with 231
gates. The wheel rotates forward and backward" (SY18, quoted at Segol p. 51).

Everything in `../GoldenDawnBlocks/data/letters.json` is the evidence layer of
this: class, element, the doubles' two aspects, the simples' faculties in order,
gematria, and the five final forms. The planet-per-double and sign-per-simple
are deliberately *not* in that file, "because the traditions disagree" about the
order — which is true, and is a ruleset question, not a letter question.

### 3.2 The table

Gematria and class are the file's. Aspects and faculties are the file's, which
took them from a *Sefer Yetsirah* diagram manuscript translated by Segol
(**CORPUS** Segol 2012, ff. 17b–18a as cited there). Planets are listed in the
SY's own order Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon
(**SOURCE** the 2002 French edition of *Sepher Yetsirah*, §7, p. 14 of the PDF)
and paired with the doubles in alphabetical order, with Bet ↔ Saturn attested
outright (Segol p. 41); ⚠ the pairing of the *other six* depends on the
recension, and later kabbalists and the Golden Dawn reorder them. Signs are the
twelve in zodiacal order paired with the simples in alphabetical order, which is
the ordinary reading; ⚠ the same caveat.

| # | Letter | Name | Value | Class | Element / aspects / faculty | Planet or sign | Final form |
|---|---|---|---|---|---|---|---|
| 1 | א | Aleph | 1 | mother | **air** | — | — |
| 2 | ב | Beth | 2 | double | wisdom / folly | Saturn (attested) | — |
| 3 | ג | Gimel | 3 | double | wealth / poverty | Jupiter ⚠ | — |
| 4 | ד | Daleth | 4 | double | fertility / desolation | Mars ⚠ | — |
| 5 | ה | Heh | 5 | simple | seeing | Aries ⚠ | — |
| 6 | ו | Vav | 6 | simple | hearing | Taurus ⚠ | — |
| 7 | ז | Zayin | 7 | simple | smelling | Gemini ⚠ | — |
| 8 | ח | Cheth | 8 | simple | talking | Cancer ⚠ | — |
| 9 | ט | Teth | 9 | simple | eating | Leo ⚠ | — |
| 10 | י | Yod | 10 | simple | coition | Virgo ⚠ | — |
| 11 | כ | Kaph | 20 | double | life / death | Sun ⚠ | ך |
| 12 | ל | Lamed | 30 | simple | action | Libra ⚠ | — |
| 13 | מ | Mem | 40 | mother | **water** | — | ם |
| 14 | נ | Nun | 50 | simple | walking | Scorpio ⚠ | ן |
| 15 | ס | Samekh | 60 | simple | anger | Sagittarius ⚠ | — |
| 16 | ע | Ayin | 70 | simple | laughter | Capricorn ⚠ | — |
| 17 | פ | Peh | 80 | double | dominion / slavery | Venus ⚠ | ף |
| 18 | צ | Tzaddi | 90 | simple | thought | Aquarius ⚠ | ץ |
| 19 | ק | Qoph | 100 | simple | sleep | Pisces ⚠ | — |
| 20 | ר | Resh | 200 | double | peace / war | Mercury ⚠ | — |
| 21 | ש | Shin | 300 | mother | **fire** | — | — |
| 22 | ת | Tav | 400 | double | grace / ugliness | Moon ⚠ | — |

### 3.3 What the *Sefer Yetsirah* tradition says a letter *does*

**Number.** Gematria, the Hebrew twin of abjad; *Prologue* calls kabbalah and
lettrism "pan-Mediterranean twin sisters" of common late-ancient descent
(LETTRISM.md). *In play:* mass and reckoning, exactly as for Arabic.

**Element (the mothers).** Air, water, fire — and no earth. *In play:* the
engine already has all four materials; a Hebrew world that honours the SY has
no earth to stand on, which is a real design constraint and a good one
(INTERPRETATION): everything rests on water or hangs in air, and the mothers
are the letters that make those.

**Two aspects (the doubles).** Each double has a hard and a soft sound, and the
SY gives it a contrary pair — life/death, peace/war. The manuscript Segol
translates adds that a simple letter "can do neither cure nor harm on its own"
but acts when letters gather (GoldenDawnBlocks' `sources`). *In play:* the
GoldenDawn design names this INVERT — a double *toggles* a cell between two
states — and COMBINE for the simples, which do nothing alone. Neither is in the
engine yet; both are derived from what the text says the letters are, which is
the standard the Arabic primitives met.

**Planet and sign.** The doubles rule the seven planets and the seven days; the
simples the twelve constellations and months (Segol p. 41). *In play:* the
GoldenDawnBlocks project's whole reason to exist — its blocks carry the
planetary and zodiacal signs now drawn in `apps/shared/glyphs.js`. Which
letter carries which sign is exactly the thing its rulesets will have to
declare with an `interpretation_note`, per the house rule.

**Combination (the 231 gates).** "Twenty-two letters of foundation, fixed on a
wheel with 231 gates" — 231 is the number of two-letter pairs, and the wheel
"rotates forward and backward" (SY18 at Segol p. 51). Segol's book is about the
*diagrams* medieval commentators drew of this: wheels, combinatory charts, the
cube of directions (Segol ch. 3–5). *In play:* this is the **Scriptorium**'s
program-composition, and the Introduction mode draws the wheel itself.

**Final forms.** Five letters change shape at the end of a word. **INTERPRETATION,
ours:** that is Hebrew's visible word-boundary, and it is the natural analogue
of the Arabic non-connecting letters — a body of Hebrew letters ends where a
final form stands. GoldenDawnBlocks calls the primitive SEAL. It is derived from
the page, like SEVER, and it is what makes a Hebrew wall break where it does.

**Making a body (the golem).** The recipes are medieval commentaries on the SY —
Eleazar of Worms's *Sefer Tagi*, Pseudo-Saadya, Abulafia's *Ḥayyei Olam ha-Ba*,
the Pseudo-Rabad — and, as Idel showed, they share two steps: "the material
employed to create the golem is dust, eventually kneaded with water, and the
pronunciation of combinations of letters over the shaped body, in order to
animate it" (**CORPUS** Segol pp. 105–106, quoting Idel). The recitation is of
combinations of the tetragrammaton or of all twenty-two letters, performed while
circumambulating the body a fixed number of times; the divine names are "the
souls of the other letters" (Segol p. 106). Segol's point is that the medieval
golem is not a servant but an instrument "used to effect metaphysical changes,
including the resurrection of the dead and the reconstruction of the cosmos"
(p. 105), and that many of the SY diagrams "provide instructions for the ritual
of letter combination to animate a golem" (p. 8). ⚠ The detail everyone knows —
אמת (*emet*, truth) on the forehead, erase the א and it reads מת (*met*, dead) —
belongs to the later legend and is not in the passages we read; the
Introduction uses it *as* legend, labelled.
*In play:* the golem is the Introduction's last lesson, and it is built from
mechanics that already exist. Shape the body from earth (dust) and water; write
the word on it; the body **reads** as a word (`reader.js`); **extract** the alef
(`operations.js`) and what stands there now reads as death. Nothing in that
sequence is invented for the lesson.

---

## 4. The engine's primitives against the traditions' attributions

Where the two layers meet, agree, or pull apart. The first column is ours and
derived from form; the second is what the traditions say; the third is what
that suggests, labelled.

| Primitive (from form) | What the traditions attach to the same letters | Where that leads |
|---|---|---|
| **AXIS** — ا ل, upright strokes hold a frame | Alif is "avatar of divine Oneness and of the beginning of creation," abjad 1 (letters.json note); ʿAlī = 110 = alif (*Prologue*) | The one letter that stands on nothing is the letter of the One. Shipped as the Standing Word's rule; the gnostic-messianic floor denies it because "there is no neutral frame." |
| **RAISE / LOWER** — dots above and below | Dots are *inauspicious* on al-Būnī's mansion scale, in degrees (1 < 2 < 3) | RAISE and LOWER are the risky operations. **PROPOSED:** their cost — on a turn structure that has mansions, a dotted letter's operation carries its omen. |
| **BIND** — closed loops | The Ikhwān's 28 body parts; the SY's "combined one with another" | Binding is how a body is made. The golem lesson. |
| **POUR** — tails | The natures: wet letters (ج ز ك س ق ث ظ) | **PROPOSED:** a wet letter pours *toward water* — transmutation, not only displacement. |
| **SEVER** — the six that never join forward | The Sufi ruleset denies it: "the chain of being is not cut" (`barzakh`) | Shipped as the Descent's central trap. |
| **ASSIMILATE / DISTINGUISH** — sun and moon letters | The grammar of the article | Shipped; the value-transfer and protection mechanics. |
| *(none yet)* — the natures | seven hot, seven cold, seven wet, seven dry | **PROPOSED**, above. |
| *(none yet)* — the mansions | one letter per mansion, timings, omens | **PROPOSED** turn scheduler, above. |
| *(none yet)* — the SY's INVERT / COMBINE / SEAL | doubles, simples, finals | GoldenDawnBlocks' design; SEAL is ready to derive now. |

**The rule for extending this.** A primitive enters the engine only if it is
derived from something *on the page* (form, count, position). An attribution
enters a *ruleset* only with a source and an `interpretation_note` saying what
in it is ours. The natures and the mansions are both attested and both
observable-once-you-know-the-table, which is why they are the two proposals
worth building first, and both belong to rulesets, not to `letters.json`.

---

## 5. Sources

**Held and read for this document** (in `research/library/textcache/`, the
portal's `corpus/sources/`, or `E:\pdf`; none of these files are in the repo):

- Matthew Melvin-Koushki, *Prologue to Pythagorean Renaissance* (held; the
  register model, taksīr, the worked abjad equations, the *muqaṭṭaʿāt*).
- Matthew Melvin-Koushki, *The Occult Court* (2025) and *Dr Dee's Ottoman
  Adventure* (2021) (held; context and the Tahawi Circle plate).
- Noah Gardiner, "Stars and Saints: The Esotericist Astrology of the Sufi
  Occultist Aḥmad al-Būnī," *Magic, Ritual, and Witchcraft* 12 (2017), pp. 57–58
  — the corporeal / spiritual / luciform letters, the four qualities in seven
  degrees, reporting *Laṭāʾif al-ishārāt* fol. 18b.
- Daniel Martin Varisco, "Illuminating the Lunar Mansions (manāzil al-qamar) in
  Šams al-maʿārif," *Arabica* 64 (2017), pp. 487–530, in *Islamicate Occultism:
  New Perspectives* — the translation of Süleymaniye B89 fol. 4r.
- Jean-Charles Coulon, on the *Kitāb Sharāsīm al-Hindiyya*, in Liana Saif,
  Francesca Leoni, Matthew Melvin-Koushki and Farouk Yahya (eds.), *Islamicate
  Occult Sciences in Theory and Practice* (Brill, 2021), pp. 346–347 — the
  natures of the twenty-eight letters, fols. 322b–323a.
- Godefroid de Callataÿ, *Ikhwan al-Safaʾ: A Brotherhood of Idealists on the
  Fringe of Orthodox Islam* (2005), pp. 24–25 — mansions, body parts, letters.
- John D. Martin III, *Theurgy in the Medieval Islamic World: Conceptions of
  Cosmology in al-Būnī's Doctrine of the Divine Names*, pp. 61–62.
- Marla Segol, *Word and Image in Medieval Kabbalah: The Texts, Commentaries,
  and Diagrams of the Sefer Yetsirah* (Palgrave Macmillan, 2012), pp. 8, 22–24,
  41, 51 (Shabbetai Donnolo), 105–106 (the golem chapter's opening).
- *Sepher Yetsirah*, French edition (2002), §7 — the seven planets in order.
- The portal's concept entries `ilm-al-huruf`, `divine-names`, `barzakh`,
  `hurufism`, `jafr`, `talismanic-science` and arguments `lettrism-universal`,
  `three-lettrisms` (`portal/db/turka.db`), each with its own literature field.

**Held, not read for this document** (the obvious next reads): Elliot Wolfson,
*Abraham Abulafia — Kabbalist and Prophet* (E:\pdf; letter-combination as
technique); Gardiner, *Diagrams and Visionary Experience in al-Būnī* (the
diagrams themselves — eight plates in the portal's image catalog, rights
undetermined); the Bisṭāmī article in the corpus (jafr as procedure); the
*Shams al-maʿārif* scan itself (no text layer; needs OCR).

**Not held, cited in the sources above** (⚠ for any claim resting on them):
Ibn ʿArabī, *al-Futūḥāt al-Makkiyya*, ch. 2 (the letters, the 28 mansions);
al-Būnī, *Shams al-maʿārif al-kubrā* and *Manbaʿ uṣūl al-ḥikma* (the tables);
Coulon, *La magie islamique* I, pp. 1254–1258 (the mansions passage
transliterated); Moshe Idel, *Golem* (1990); Scholem, "The Idea of the Golem";
Haq, *Names, Natures, and Things* (the Jābirian balance).
