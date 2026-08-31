# FOUNDER.md — Ulugh Beg, the Would-Be Third Patron

> *"add Ulugh Beg as his would-be third Timurid patron, by far the most famous for
> history of science purposes as founder of the Samarkand Observatory"*
> — Matthew Melvin-Koushki

Proposals and designs for foregrounding Ulugh Beg across the knowledge portal and the
next version of the career sim, plus the visual style foundation drawn from the three
illustrations now in `research inbox/images/`.

---

## 1. Why "would-be" is the whole design

Matt's phrasing does the work. Ulugh Beg is not another patron on a list — he is the
patron **who should have happened and didn't**, and that gap is the most dramatically
useful fact in Ibn Turka's career.

The historical sequence, grounded in the corpus:

| Patron | What he gave | How it ended |
|---|---|---|
| **Iskandar Sulṭān** (1384–1415) | Commissioned *Of Letters*; the *Kitāb al-Mafāḥiṣ* was begun "almost certainly at his instance" (*Of Islamic Grammatology*, 66) | Rebelled against Shāhrukh; defeated, blinded, killed 1415. The commission became a liability. |
| **Shāhrukh / Bāysunghur** | A place at court; Ibn Turka was close to Bāysunghur in particular (*The Quest*, 136) | **Exiled from Herat, 1427**, with Qāsim-i Anvār — official excuse, a putative Ḥurūfī connection (*The Quest*, 456 n.16) |
| **Ulugh Beg** (1394–1449) | *al-sulṭān al-faylasūf* — the philosopher-sultan; founder of the Samarkand Observatory, 1420 | **Never consummated.** Ibn Turka dies 1432; Ulugh Beg is killed 1449. |

The point is not that Samarkand was one option among several. It is that Samarkand was
**the right one** — and the record does not show him getting it.

Melvin-Koushki's thesis makes this structural rather than sentimental. His argument is
that the occult sciences were moved *out of the natural sciences and into the
mathematical sciences* to reassert their legitimacy, and that this mathematicalization is
"the immediate intellectual and sociopolitical context for … the celebrated mathematization
of astronomy by the members of the Samarkand Observatory" (*Powers of One*, 1). The
observatory and the *Mafāḥiṣ* were **begun in the same year, 1420**, a few hundred miles
apart, by two men acting on one conviction: that a science earns its standing by becoming
mathematical.

He also names the pairing directly: "the model established by Iskandar Sulṭān and Ulugh
Beg" is what ensured astronomy-astrology and lettrism *in particular* would go on being
patronised by later Timurid, Indo-Timurid, Safavid and Ottoman courts
(*Philosopher-Kings as Sultan-Scientists*, 599). **Ibn Turka's first patron and his
would-be last are the two poles of the model that outlived them both.**

The tragedy has a coda worth using: Shāhjahān's *Zīj-i Shāhjahānī* updated Ulugh Beg's
tables two centuries later behind **the first thoroughly lettrist preface in the
Arabo-Persian astronomical tradition** (ibid.). Ibn Turka's science reached Ulugh Beg's
star tables in the end. It took two hundred years and he was not there to see it.

---

## 2. Portal work — done in this pass

| Entry | Status |
|---|---|
| `ulugh-beg` (figure) | **New.** The would-be patron, the sultan-scientist, the 1420 convergence, the *Zīj-i Shāhjahānī* coda. |
| `iskandar-sultan` (figure) | **New.** The first patron; needed to make "third" mean anything. |
| `samarkand-observatory` (institution) | **New.** Argues the observatory belongs *inside* this story, not beside it. |
| `sharaf-al-din-yazdi` | **Corrected.** Was "peer"; the dissertation says *disciple and closest associate* (*The Quest*, 135–36). |
| `walaya` (concept) | **New.** ~200 corpus hits, previously no entry. The second limb of the thesis. |
| `neoplatonism` | **Rewritten** from a 298-char stub, carrying the Turka payload. |
| `al-ghazali` | **Corrected** — he is an anti-occultist polemicist, not an enabler (*Powers of One*, 1). |
| `kitab-al-mafahis` | **Re-grounded** — real dates (823/1420, rev. 828/1425), Iskandar as patron, the fourfold schema. |

Portal now builds to 56 pages.

### Still to do in the portal

- `zij-i-sultani` and `munshaat-i-sain-i-turka` (his letter collection — a major
  biographical source I have no text entry for).
- `baysunghur` and `shahrukh` as figures; the patron triad is currently missing its middle.
- `qasim-i-anvar` — co-exile of 1427, Cairo associate, Ṣafaviyya propagandist.
- `hurufism` — the heresy he had to be distinguished from. The dissertation's distinction
  is by **motive**: Ḥurūfīs proclaim a new dispensation; messianic Sufis promote themselves
  as saviours; *lettrists present themselves as occult philosophers working within the
  tradition to expand the boundaries of human knowledge* (*The Quest*, 456).

---

## 3. Game design — baking Ulugh Beg in

### 3.1 What's already there

The sim already has a three-patron spine (`career.js` ll. 306–08):

```
'patron=iskandar':   'He was Iskandar Sultan's man in the years when that was the
                      most interesting and most dangerous thing to be.'
'patron=baysunghur': 'He served Bāysunghur, and the finest book-workshop in the
                      world served him back.'
'patron=samarkand':  'He threw in with Samarkand, where the instruments were and
                      the mathematics was honest.'
```

Ulugh Beg appears as **scenery** in `phase3.js` (l. 61), `phase4.js` (ll. 11, 603) — the
observatory breaks ground, the tables get compiled — but he is not in `PEOPLE`, and the
third patron slot is named for a *city* while the other two are named for *men*.

**That asymmetry is the bug Matt is pointing at.** Fix it and the triad reads properly.

### 3.2 Proposal A — promote him to the cast

Add to `content/people.js`:

```js
ulughbeg: {
  name: 'Mīrzā Ulugh Beg',
  grants: ['observatory_access', 'mathematical_legitimacy', 'royal_protection'],
  gloss: 'The sultan who does the mathematics himself. His patronage would make
          your science respectable — which is exactly why it is the hardest to get.',
},
```

`mathematical_legitimacy` is the grant that matters and no other patron can issue.
It should gate the endgame encounters where the argument is *"this is a mathematical
science"* — the same defence the portal's `neoplatonism` entry documents.

### 3.3 Proposal B — the would-be as a mechanic, not a flavour line

The design temptation is to make Samarkand a third patron you simply pick. **Don't.**
Make it the one you can reach for and mostly fail to close.

- Samarkand is **offered late** (Phase 4, after the 1427 exile beat) and is
  **conditional** where the other two are not. It requires accumulated
  `mathematics` / `observatory_work` — i.e. you must have spent the whole game
  becoming the kind of person Ulugh Beg would want.
- The default resolution is **near-miss**: audience granted, interest real, patronage
  not yet formalised — then 1432 arrives. The chronicle line should land as a loss
  even though nothing bad visibly happened.
- Full patronage is a **rare, earned ending**, not a menu choice.
- Failing it should not feel like a punishment for bad play. It is the historically
  normal outcome, and the ending text should say so.

This gives the sim something it currently lacks: an ambition that is *correct* and still
does not arrive. Every other failure state in the game is a tribunal, an exile, a patron
falling. This one is just time running out.

### 3.4 Proposal C — the 1420 convergence beat

`phase4.js` already opens with "Everything converges in one year. Ulugh Beg breaks ground
on the Samarkand observatory." Strengthen it: the player is **finishing the *Mafāḥiṣ*
in the same year** (completed 823/1420). Make the sim state that explicitly — two
foundations laid in one year, one in stone and one on paper. It is true, it is
documented, and it is the thesis of the whole portal rendered as a single game beat.

### 3.5 Proposal D — the two-hundred-year coda

An unlockable end-card: if the player got the mathematics into the tables (the existing
`phase4.js` l. 620 beat, "His arithmetic went unsigned into the Samarkand tables"),
close with the *Zīj-i Shāhjahānī* and its lettrist preface. The player loses in 1432 and
wins in 1650. That is the most honest ending this material offers.

---

## 4. Visual style foundation

Three illustrations, and they are not one style — they are **two**, which is more useful.

### 4.1 The three sources

**A. `Turka white beard with Qazizada Rumi ... and Yazdi.png`** — a Persian/Safavid
miniature. Three seated men in an arched niche: a **white-bearded elder in brown, green
turban-cap** (Ibn Turka) gesturing toward an open bifolium he holds; a **black-bearded
man in lapis blue, gold cap** (Qāḍīzāda Rūmī); a **red-bearded man in green** (Yazdī).
Framed by dense tilework — star-and-cross in light blue and orange above, white interlace
with dark-red rosettes below, a salmon brick course between.

This is, effectively, **a triple portrait of the game's three principals**, and the
document passing between them is the system itself changing hands.

**B. `mural in the little museum ... Samarkand Observatory ruins.jpg`** — a modern
museum mural. **Ulugh Beg** centre in plumed white turban and gold-embroidered robe,
holding an **astrolabe**; a scholar to his left with a book; a **kneeling apprentice**
working a **celestial globe** with a stylus. The observatory façade behind, cypresses,
pink blossom, a night sky with moon and stars, star-tiled floor, a lit candle.

**C. `Husayn Akhlati receiving gifts from Barquq`** — Majālis al-ʿUshshāq,
BL Or. 11837 f. 117, Shiraz c. 1560. A full folio: nastaʿlīq text above and below,
painting between. **Akhlātī** in blue receiving; the gift-giver in vermilion; attendants
in red *tāj* caps; a kneeling servant with a tray; gifts on a gold platter on a pink
floral carpet. And — the detail worth stealing — **two figures conferring outside the
wall**, excluded from the audience, on hexagonal paving.

### 4.2 The design lever: palette shifts west→east

The two period-appropriate registers are genuinely different, and they map onto the
game's geography:

| | **Cairo / Isfahan / the court** (from A and C) | **Samarkand / the observatory** (from B) |
|---|---|---|
| Ground | cream/tan aged paper | pale sky blue |
| Dominants | lapis, vermilion/orange, dark red, purple-lilac | mint, aqua, sage, cream |
| Metal | gold leaf, dense | brass, sparse |
| Pattern | **dense** — tile fields edge to edge | **open** — architecture and garden, air between figures |
| Light | flat, no sky | night sky, moon, one candle |
| Feeling | enclosed, watched, ornamented | spacious, cool, exact |

**Use this.** The game should get *visibly cooler and emptier* as the player moves toward
Samarkand. The occult court is crowded and gorgeous and dangerous; the observatory is
quiet and mathematical. That is the whole argument of the portal expressed as a colour
ramp, and it costs nothing to implement in CSS variables per phase.

### 4.3 Compositional grammar to adopt

1. **The arched niche as portrait frame** (A). Character cards get a pointed-arch mask
   with a patterned ground behind — one shape, reused, instantly legible as "a person."
2. **The full-folio layout** (C): text block, image, text block, gold rules, aged ground.
   This is already close to the manuscript palette the site uses. Encounter screens can
   adopt it wholesale — the illustration sits *inside* the text, as in the source.
3. **Gesture toward a document** (A). Ibn Turka's hand toward the open page is the
   single best icon this project could have for its own subject. Candidate for the
   game's key art and the portal's masthead.
4. **The two figures outside the wall** (C). Reuse as the visual signature for
   surveillance/tribunal states — the people who are not in the room and are talking
   about you.
5. **The apprentice with the globe** (B). The "someone else carries it forward" motif —
   pair with Yazdī, and with the Proposal D coda.

### 4.4 Asset mapping by stage

| Stage | Source | Use |
|---|---|---|
| Title / key art | A (cropped to Ibn Turka's gesture) | masthead, portal header |
| Cairo phase | C | Akhlātī portrait; the audience/gift scene for patronage beats |
| Patronage beats generally | C | the gift-platter as the recurring icon for a contract |
| Tribunal / suspicion | C (the two outside the wall) | surveillance states |
| Isfahan circle | A | the three-figure council |
| Phase 4 Samarkand | B | observatory establishing shot; Ulugh Beg portrait |
| Qāḍīzāda Rūmī | A (centre figure) | cast portrait |
| Yazdī | A (right figure) | cast portrait |
| Coda / tables ending | B (apprentice + globe) | the work outliving the man |

---

## 5. Rights — read before shipping any of this

The project's own rule (`CLAUDE.md`): *no manuscript image goes into `assets/` without a
provenance record … before it's used in any game*, added via `register_asset.py`, never
by hand-editing the registry.

**I have not registered these three, because I cannot yet assert their rights honestly.**
Status:

- **A (Turka/Qāḍīzāda/Yazdī)** — *provenance unknown to me.* The filename carries no
  institution, shelfmark or folio. This needs identifying before it can be registered
  at all. It is also the image I most want to use, so it is the priority.
- **B (Samarkand mural)** — **highest risk, do not ship as-is.** This is a *modern*
  mural photographed by someone. Two live copyrights, plausibly: the muralist's and the
  photographer's. Excellent as **style reference**; not usable as a shipped asset without
  permission or replacement.
- **C (Akhlātī)** — best documented: British Library, Or. 11837, f. 117, Shiraz c. 1560.
  BL has released much of its digitised Persian manuscript material as public domain, but
  **I have not verified this specific item's terms**, and the existing registry entries
  all carry real licence strings (e.g. "CC BY-SA 3.0 … Photograph by Danieliness").

**The distinction that keeps us safe:** deriving a *palette and compositional grammar*
from these images (§4.2–4.3) carries no rights burden and can proceed immediately.
Shipping the image files (§4.4) cannot, until each has a checked rights note in
`assets/manuscripts/registry.json`.

Recommended next step: I identify A's source, verify C's BL terms, and either license or
commission a replacement for B.

---

## 6. Proposed order of work

1. **Portal** — `baysunghur`, `shahrukh`, `qasim-i-anvar`, `hurufism`, `zij-i-sultani`,
   `munshaat`. Completes the patron triad and the 1427 exile context.
2. **Game system files** — `ulughbeg` into `PEOPLE`; rename the `patron=samarkand` flag's
   prose to name him; add the `mathematical_legitimacy` grant.
3. **The would-be mechanic** (Proposal B) — the largest design change, and the one worth
   getting right.
4. **Visual system** — phase palette ramp in CSS (§4.2), arch-mask portrait frame (§4.3).
5. **Assets** — only after rights are settled per §5.

