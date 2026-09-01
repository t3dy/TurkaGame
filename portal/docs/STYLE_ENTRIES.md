# Portal entry style guide

**The rule that governs everything else: err on the side of too much.** If the corpus
supports a claim, it goes in. A reader who wants the short version has the card; the page
is for the reader who wants everything we know.

---

## 1. Length targets

The card and the page do different jobs and are sized differently.

| | Card | Page (body) |
|---|---|---|
| **Figure** | 60–150 words | **2,500–5,000 words** (5–10 pages) |
| **Concept** | 80–150 words | **2,500–5,000 words** |
| **Text (primary source)** | 60–150 words | **2,500–5,000 words** |
| **Institution** | 80–150 words | **2,000–4,000 words** |
| **Timeline event** | 40–120 words | **600–2,000 words** where the research supports it |
| **Scholarship (Matt's works)** | 100–200 words | **1,500–3,000 words** + section-by-section |

A page shorter than 2,500 words is not finished; it is a stub with good manners. The only
acceptable reason to fall short is that **the corpus genuinely does not contain more** —
and when that is the reason, the page must say so in a closing "What we do not know"
section rather than simply stopping.

### Calibration
- 2,500 words ≈ 15,000 characters ≈ 5 printed pages.
- The old guide said 1,200–2,200 words and even that was rarely met. As of the audit that
  produced this revision, **all 48 entries were under target** and the whole portal held
  15,555 body words. Treat the old numbers as void.

---

## 2. The expansion method

Length comes from **mining, not padding**. Never inflate with restatement, throat-clearing
or synonym runs. Every added paragraph must carry a fact, a citation, a distinction, or a
named disagreement.

The workflow for taking an entry from stub to full page:

```bash
python portal/scripts/mine_corpus.py rank "TERM"                    # which sources
python portal/scripts/mine_corpus.py kwic "TERM" --per-source 3     # how it's discussed
python portal/scripts/mine_corpus.py read SLUG --around "TERM" --chars 2500 --nth N
python portal/scripts/mine_corpus.py dates SLUG --from-year Y --to-year Y
```

Read **every** substantial hit before writing. A figure with 84 corpus hits has a 4,000-word
page in it; a figure with 6 hits does not, and should say so.

---

## 3. Required sections by type

These are minimums. Add more where the material warrants.

### Figure / scholar biography
1. **Opening placement** — who, when, where, and why this portal has an entry on them.
2. **Life** — origins, family, education, offices, movements, patrons, death. Dated wherever
   the corpus dates it.
3. **What they actually wrote or did** — works by name, with dates, contents, and where the
   manuscripts are.
4. **The intellectual position** — their doctrines, stated as arguments rather than labels.
5. **Relation to Ibn Turka** — the section that earns the entry its place here. Teacher,
   opponent, patron, schoolfellow, successor; what passed between them and in which direction.
6. **Transmission and afterlife** — who received them, what changed in transit.
7. **Historiography** — how modern scholarship has read them, including readings
   Melvin-Koushki rejects and why.
8. **What we do not know** — the honest gaps, named.

### Concept / dictionary entry
1. **The term** — etymology, literal sense, the Arabic/Persian, and what it does *not* mean.
2. **Before Ibn Turka** — where the idea comes from and who carried it.
3. **What Ibn Turka did with it** — the payload. Every broad-topic entry must explain how he
   fits into or contributed to the tradition; this is a house rule, not a suggestion.
4. **The technical content** — the actual mechanics, in detail. Numbers, correspondences,
   procedures, distinctions.
5. **Where it sits** — relation to the neighbouring concepts, with `[[links]]`.
6. **Contested points** — what scholars disagree about.
7. **Afterlife** — Safavid, Ottoman, Mughal, European reception where attested.
8. **What we do not know.**

### Text / primary source
1. **Identification** — title in script, transliteration, translation, language, length.
2. **Composition** — when, where, for whom, at whose instance, and how we know (colophons).
3. **Structure** — the actual table of contents where recoverable, section by section.
4. **Contents** — what it argues, in detail, with its key technical moves.
5. **Sources it draws on** and **texts it answers**.
6. **Manuscripts** — shelfmarks, folios, hands, dates, and which is the best witness.
7. **Editions and translations** — modern, with editors.
8. **Reception** — who read it, cited it, abridged it, attacked it.
9. **Historiographical significance** — what it changes about how we read him.
10. **What we do not know.**

### Timeline event
Every event gets a card. Events of consequence also get a **body** of 600–2,000 words:
1. **What happened**, in as much detail as the sources give.
2. **How we know** — which source, which page, what kind of evidence, how firm.
3. **Context** — what else was happening that makes it legible.
4. **Consequences** — what it changed, immediately and later.
5. **Disputes** — where dating or interpretation is contested.

---

## 4. Provenance discipline (unchanged, and non-negotiable)

- Every substantive claim carries a citation with a page number.
- Distinguish **grounded** (in the corpus, cited) from **inference** (mine, labelled) from
  **negative result** (checked and absent — say so; it is real information).
- `confidence`: `HIGH` only where I have read the passage. `MEDIUM` for synthesis across
  sources. `LOW` for plausible but unverified — and say what would verify it.
- Preserve scholars' own hedges. If Melvin-Koushki writes "I am not entirely sure which
  conjunction Ṣāʾin al-Dīn has in mind", the entry keeps that uncertainty rather than
  laundering it into fact.
- Name disagreements between scholars, with both positions.

---

## 5. Voice

- Write for a reader who is intelligent and does not know the material.
- Gloss every technical term on first use, in line.
- Prefer the concrete: dates, shelfmarks, folio numbers, sums of money, names of opponents.
- State arguments as arguments — "X holds that…", "against Y, who reads…" — not as a
  neutral fog of "it has been suggested".
- Bold sparingly, for the load-bearing claim in a paragraph.
- `[[slug]]` or `[[slug|display text]]` for every entity that has an entry. Link liberally.
- No invented detail, ever. Where the record is silent the entry says the record is silent.

---

## 6. The "What we do not know" section

Every full entry ends with one. It is not an apology; it is the most useful part of the page
for anyone doing further work. State:
- what the sources do not cover,
- which manuscripts are unedited or unexamined,
- which claims rest on a single witness,
- what would settle an open question.

Over half of Ibn Turka's ~45 works remain in manuscript. Almost every entry in this portal
has something real to put in this section.
