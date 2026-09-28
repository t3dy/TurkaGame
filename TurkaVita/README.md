# Turka Vita

A game about **Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī** (1369–1432), Chief Judge of Isfahan and the foremost lettrist philosopher of
Timurid Iran, built from Matthew Melvin-Koushki's scholarship. You play the years the sources record: a hostage-scholar at Temür's
court, a student in Cairo, a judge under two princes, an author writing for the men who would try him, an exile. Then you are the
unnamed copyist who put his writings in order, and then the historian who has to say who he was.

The events outside his control are fixed. What you decide is whom to attach yourself to, what to write, and how to defend it. Every
choice carries a label (documented, reconstructed, contested, unknown, counterfactual) saying how far the sources support it, and
**Why?** opens the chain of evidence down to a page of the book.

## Play it

```bash
cd TurkaVita/game && python -m http.server 7560
```

Open <http://localhost:7560/>. Read **How to play** first; it is written out in full. A run is a single sitting (no save file).

## What is in here

| | |
|---|---|
| 36 scenes in six acts | Act I Samarkand and Cairo (1387–1408) · II the princes (1408–1422) · III the trials (1422–1427) · IV exile (1427–1432) · V the collection · VI the historian's desk |
| 3 writing scenes | *Suʾl al-Mulūk* for Bāysunghur, the first apology to Shāhrukh, the second apology from exile: each built from the moves the source reports |
| a puzzle | order fifteen works as they stand in MS Majlis 10196 |
| a dispute | six positions on who he was, 146 readings of 118 pieces of evidence, a lens for each scholar, and the **duress rule** |
| ~1,000 page-cited evidence artifacts | `research/artifacts/`; the build checks each citation's printed page and every quotation against the book |

## Read next

`HANDOVER.md` (state, what needs a decision) · `CLAUDE.md` (rules and commands) · `docs/DESIGN.md` · `docs/TURKA_AUDIT.md` (where older
project documents disagree with the sources) · `docs/BIOGRAPHY.md` and `docs/OEUVRE.md` (generated).

Sources are Melvin-Koushki's; the PDFs and the corpus database are not in this repository.
