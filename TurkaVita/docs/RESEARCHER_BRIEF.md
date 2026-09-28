# RESEARCHER brief — how to write artifacts for TURKAVITA

You are a RESEARCHER pass (C:\Dev\AGENTS.md): you read pages of the corpus and write typed JSON
artifacts. You do **not** design scenes, write prose for players, or resolve contradictions silently.
The contract is in `C:\Dev\TurkaGame\TurkaVita\CLAUDE.md`; the shape is in
`schemas/artifacts.schema.json`. Work from `C:\Dev\TurkaGame\TurkaVita`.

## The corpus

`db/corpus.db` holds 43 Melvin-Koushki texts page by page. Read pages with

```
python scripts/search.py --page SRC-610EE1D6BA 75       # one page: prints "[pdf p.75 printed p.58]" then the text
python scripts/search.py "Nafsat AND Shahrukh" -n 10 --src SRC-610EE1D6BA   # FTS5 search (run from Bash)
python scripts/search.py --list                         # all sources and ids
```

The spine source is **the 2012 Yale dissertation, `SRC-610EE1D6BA`** (Melvin-Koushki, *The Quest for a
Universal Science*). **PDF page = printed page + 17** throughout the main text (pdf p.75 = printed p.58).
Cite the PDF page as `witness_page` and the book's number as `printed_page` (a string). The build checks
the two against each other. Other sources: `SRC-2DC96A9F73` Prologue to Pythagorean Renaissance,
`SRC-8A882ECF7A` The Occult Court, `SRC-4082EBB454` New Brethren of Purity, `SRC-DEF403AE18` Pythagorean
Sensorium, `SRC-BEA1D7D187` Of Islamic Grammatology, `SRC-5A76947E9D` Second Aristotle, `SRC-7356048139`
Timurid-Mughal philosopher-kings, `SRC-81A5B2AA5E` Selenocentrism and Heliocentrism.

**Only write a claim about a page you opened in this session.** `read_by` says which page(s), e.g.
`"R2 opened pdf p.75"`. Do not write from general knowledge; if you cannot cite a page, do not write the
artifact (or write it as `epistemic_type: inferential_reconstruction`, `confidence: low`, and say
"general knowledge, unchecked" in the proposition — sparingly).

## Files and ids

One artifact per file, named by id, in the folder for its type:
`research/artifacts/evidence/EV-0001.json`, `claims/CL-0001.json`, `events/EVT-0001.json`,
`works/WRK-<SLUG>.json`, `institutions/INS-<SLUG>.json`, `reconstructions/REC-0001.json`.
**Use only the id block you were given** (one writer per file; two agents must never write one id).
**Reference only artifacts in your own block**: another agent's ids may not exist yet, and a dangling
reference fails the build.

## Validate as you go

```
python scripts/build_artifacts.py --check --grep "EV-04|CL-01"      # validates everything, prints errors matching your ids
```
(`--check` never rewrites the database, so it is safe while others are writing.) Fix every error on your
files. A quoted span of 5+ words must appear **verbatim on the cited page** (the build checks); no
quotation may exceed 40 words; prefer paraphrase, and quote only short, telling phrases.

## The artifacts

**evidence (EV-)** — one located fact or short passage, one page.
```json
{"id":"EV-0001","type":"evidence","status":"draft",
 "citation":{"source_id":"SRC-610EE1D6BA","witness_page":75,"printed_page":"58","short_title":"Melvin-Koushki, dissertation (2012)"},
 "content":"Ibn Turka's first apology, Nafsat al-Masdur I, was written for Shahrukh in 829/1426 in answer to accusations made by his enemies in Herat.",
 "evidence_kind":"apology",
 "refers_to_primary":"Ibn Turka, Nafsat al-Masdur I",
 "read_by":"R2 opened pdf p.75"}
```
`evidence_kind` is **what sort of witness the fact rests on** — this feeds the *duress rule* (only
`letter`, `colophon`, `autograph`, `early_work`, `work` can show what he **held**; the rest cannot):
`apology` (Nafsat al-Masdur I/II), `creed_tract` (Iʿtiqadat/Iʿtiqadiyya), `letter` (Munshaʾat), `colophon`
(dates/audition notes in MS Majlis 10196 etc.), `autograph`, `early_work` (something written before the
accusations, e.g. the verse praising ʿAli), `work` (what one of his own doctrinal works argues),
`hagiography`, `chronicle` (Ibn Hajar, Dawlatshah, Khwandamir…), `reception` (Jami's disdain, later
readers), `scholarly_argument` (Melvin-Koushki's own analysis or conjecture), `context` (Timurid
political history not about him). When Melvin-Koushki reports what a source says, the kind is the
source's kind, and the mediation on the claim records that MK is the one reporting.

**claim (CL-)** — a proposition, typed. `epistemic_type`: `attested` (a source says it, as reported by MK),
`directly_inferred` (follows with little latitude), `inferential_reconstruction` / `causal_reconstruction` /
`psychological_reconstruction` (going beyond the evidence — **MK's own conjectures and every "(?)" or
"presumably" go here**, `confidence: low` or `medium`), `contested`, `undeterminable`. **Epistemic type
and confidence are separate fields**; confidence is never a probability of truth. `supported_by`: EV ids.
`mediation`: the chain, event outward, each `{layer, who, where, shaping_risk}` with layers `event`,
`subject_self_report`, `correspondence`, `manuscript_colophon`, `later_chronicler`, `modern_interpretation`.
**Anything that comes through his own apologies carries a `subject_self_report` layer with
`shaping_risk: "high"`** (written to the ruler judging him; MK: "produced under great duress"). Letters
to third parties are `correspondence`, risk `medium` (they ask for favours). Colophons: `manuscript_colophon`
(risk `medium`: a date may be transcription). `domain`: biographical | doctrinal | textual | institutional
| social | political | chronological.

**event (EVT-)** — what happened, kept apart from why.
```json
{"id":"EVT-0001","type":"event","status":"draft","actor":"Ibn Turka",
 "date":{"start":"1426","end":"1426","hijri":"829","basis":"Nafsat I is dated 829; MK timeline A.1","date_kind":"colophon"},
 "place":"Herat","event_type":"trial","description":"...","claims":["CL-0001"],"fixed_point":false}
```
`date_kind`: `attested` | `colophon` | `conjectured` | `inferred` | `context`. **Carry the dissertation's own
uncertainty**: entries marked "(?)", "c.", "presumably", or flagged with an asterisk as
transcription-not-composition are `conjectured` (or `colophon` with the caveat in `basis`).
`fixed_point: true` marks an **external** event the player could not prevent (Temür takes Isfahan, Temür
dies, Iskandar's revolt is crushed, the Ahmad-i Lur attempt on Shahrukh…).

**work (WRK-)** — one of his writings: `title`, `transliterated_title`, `language`, `genre`, `theme`,
`date{ce,hijri,basis}`, `date_kind` (`composition` | `transcription` | `conjectured` | `unknown` — **be
strict: the dissertation warns where a colophon date may be the copying, not the writing**), `place`,
`addressee` (the patron or the ruler it was written for), `occasion`, `manuscript` (as listed),
`majlis_folios` (his folios in **MS Majlis 10196** when the entry gives them — this becomes the collection
puzzle's answer key), `edited`, `summary` (one or two sentences, MK's), `supported_by` (EV ids).

**institution (INS-)** — a court or a person who is one: `name`, `ruler`, `seat`, `tenure`, `role`
(`patron` | `judge` | `addressee` | `enemy` | `ally` | `teacher` | `context` | `recipient`), `summary`,
`supported_by`.

**reconstruction (REC-)** — a scholar going beyond the evidence: `question`, `proposition`, `kind`
(`inferential` | `causal` | `psychological` | `counterfactual`), `scholar`, `reasoning`, `observed_facts`
(EV/CL ids), `confidence`. Include the rival reading when the dissertation names one.

## Rules

1. One fact per evidence artifact; a claim usually rests on one to three.
2. **Name whose account it is.** Not just the source: MK reporting Ibn Turka reporting his enemies.
3. Keep uncertainty. "Appears to have", "presumably", "conceivably", "(?)" → not `attested`.
4. Where the dissertation contradicts another Melvin-Koushki text you have read, or a project doc, write
   the discrepancy in your notes file; do not pick a winner.
5. Never invent. No contact with any European figure. Do not fill silence: an attested silence ("sources
   are silent on X") is itself a claim (`epistemic_type: attested`, proposition "the sources do not say…").
6. Copyright: paraphrase; quote only short attributed phrases, verbatim, from the cited page.
7. Transliteration: follow the dissertation's spelling in `content`, with its diacritics (UTF-8).

## What to hand back

A short report: the ids you wrote (ranges and counts), what the build says about them, **every
uncertainty or discrepancy you met** (with pdf pages), and anything you could not read. Write the same
into `research/notes/<your-role>.md` (paraphrased, page-cited). Do not edit any file outside your id block
and your notes file.
