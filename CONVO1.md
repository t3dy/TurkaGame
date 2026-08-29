---
title: CONVO1 — TurkaGame + IslamicateOccultPortal kickoff conversation
description: Full record of the session that created both projects. Read HANDOVER.md first — this file is a source packet, opened by section, not read end to end.
---

# CONVO1 — Kickoff Conversation Record

**Do not read this file top to bottom by default.** [HANDOVER.md](HANDOVER.md) is
the stable entry point every new session should load first — it's the "card" layer.
Come here only for the rationale/detail behind a specific decision, and jump straight
to the relevant `## Part` via grep or offset/limit. See "How to use this file" at the
bottom for the exact retrieval pattern.

## Table of contents

- **Part 1 — TurkaGame kickoff.** Research materials found, sequencing/asset/stack
  decisions, files built, first GitHub push.
- **Part 2 — IslamicateOccultPortal.** The broader research portal: corpus
  conversion, image extraction, schema/seed, site build, wiki/memory wiring.
- **Part 3 — 40 Choices + CYOA/RPG mechanics.** Narrative-designer choices report,
  state-model/mechanics decisions, structured choice data.
- **Part 4 — This handover.** Why CONVO1.md + HANDOVER.md exist and how to use them.

---

## Part 1 — TurkaGame kickoff

**User's opening request:** create a `TurkaGame` folder, build an agentic coding
environment + research pipeline for game assets from four PDFs about Ibn Turka
(dropped in Downloads) and his Islamicate occult world. Wanted prototypes for a
visual novel, a roguelike (in the vein of the user's other game projects), and an
esoteric-scholar career sim tracking Ibn Turka's real occult-science/court/economy
choices. Wanted a showcase site, pushed to `github.com/t3dy/TurkaGame`, connected via
Claude Code. Explicitly asked to be asked questions before starting.

**Research done before asking anything:**
- Found only **3** PDFs in Downloads (not 4 as described), all by Matthew
  Melvin-Koushki, dated the same day: *Dr Dee's Ottoman Adventure* (Hellebore, Fall
  2021), *Prologue to Pythagorean Renaissance*, *The Occult Court* (2025). This
  discrepancy was surfaced to the user rather than silently assumed away — never
  resolved; still open (see HANDOVER.md open items).
- Found `style example.png` in Downloads — a screenshot from what looked like a live
  video call with Matt Melvin-Koushki himself, showing a parchment-panel UI pattern
  from the user's Morigny project. Treated as a possible aesthetic reference, not
  copied into the repo (contains a third party's face — privacy caution), just noted
  in DESIGN.md as a UI pattern worth revisiting.
- Checked GitHub: `t3dy/TurkaGame` already existed, empty, with placeholder
  description "Islamicate Chill Pills: The Video Game" — left untouched, still is.
- Read all 3 PDFs directly (Read tool's PDF support; `pypdf` for the two poppler
  couldn't render as images). This is where the real research content came from —
  see `docs/RESEARCH_BRIEF.md` for the synthesis. Key finds that shaped everything
  downstream: the **Occult Quintet** (kīmiyā/līmiyā/hīmiyā/sīmiyā/rīmiyā, a
  pre-authored five-branch hierarchy with real period vocabulary), Ibn Turka's
  three-inquisition biography (survived two, lost the third, died 1432 in exile),
  and the manuscript lead Tehran Majlis Library MS 10196 (his own autograph +
  the Ṭahawī Circle diagram).
- Surveyed sibling projects for scaffold conventions: `EmblemRoguelike/CLAUDE.md`
  (no-build vanilla JS, `preview_start`-driven), `DungeonAB`, `AlchemyBoardGame`
  (Next.js precedent), and `docs/CLAUDE_PROJECT_CONTEXT.md` (flagged scope-explosion
  as this user's known failure pattern — directly informed question framing below).

**AskUserQuestion round 1 — answers:**
1. Sequencing: **research pipeline first**, then VN as first vertical slice; roguelike
   and career-sim stay design-doc-only until the VN slice proves the pattern.
2. First slice if doing one: **Visual novel** (this answer became moot once
   "research pipeline first" was picked as the sequencing, but recorded the intent).
3. Asset sourcing: **manual curation with provenance** (institution/shelfmark/rights
   note per image), not scraping or AI-generated pastiche.
4. Tech stack: **mixed per prototype** — no-build vanilla JS for VN/roguelike
   (matches EmblemRoguelike/DungeonAB), Next.js likely for career-sim (matches
   AlchemyBoardGame) once its design locks.

**What got built (all pushed to `github.com/t3dy/TurkaGame`, branch `main`):**
- `CLAUDE.md`, `README.md`, `DESIGN.md` — entry points.
- `docs/DECISIONS.md` — kickoff decisions log (now also holds the Part 2/3 decisions
  below — this is the authoritative running decisions record for the whole project).
- `docs/RESEARCH_BRIEF.md` — real synthesis of the 3 papers (biography, Occult
  Quintet, cosmology, court/patronage economy) with a Sources + Open Gaps section.
- `docs/GAME_VISUAL_NOVEL.md`, `GAME_ROGUELIKE.md`, `GAME_CAREER_SIM.md` — design
  docs, most detail on the VN since it's next.
- `research/notes/01-03-*.md` — per-source synthesis notes for the 3 papers.
- `research/library/` — the actual 3 PDFs, copied from Downloads, **gitignored**
  (copyright — never commit source PDFs).
- `research/scripts/register_asset.py` — a dependency-free Python CLI
  (add/list/approve/check) enforcing institution/shelfmark/rights-note on every
  manuscript image before use. Smoke-tested with a dummy file, then reset to empty.
- `assets/manuscripts/registry.json` (empty, ready) + `assets/schema/asset-provenance.schema.json`.
- `games/{visual-novel,roguelike,career-sim}/README.md` — stub pointers (this
  changed for visual-novel in Part 3 — it now has real content).
- `site/index.html` — placeholder showcase page, verified rendering in-browser
  (`preview_start` name `turkagame-site`, config in `C:\Dev\.claude\launch.json`).
- Git init, first commit, remote added, pushed.

---

## Part 2 — IslamicateOccultPortal

**User's request:** an epub ("The Art of the Occult," S. Elizabeth) sitting in
Downloads plus a folder of ~25 more PDFs at `E:\pdf\Islamicate Chill Pills\`
(Brethren of Purity, lettrism, al-Buni, and other Islamicate-occult context) should
all be converted to `.md` with summaries. Wanted an "Islamicate Occult World
knowledge portal" **in the style of the user's other knowledge portals** (pointed at
`C:\Dev\wiki`), with questions asked about the research/design pipeline first. A
mid-turn follow-up message added: catalog every image from manuscripts/portraits/
extant works used across the research materials, especially images actually used in
the scholarly sources — build a database of image descriptions drawn from the
scholarship.

**Research done before/alongside asking:**
- Surveyed `E:\pdf\Islamicate Chill Pills\` — ~55 files including a
  `plain_text_drafts/` subfolder already produced by the user's **AudiobookCleaner**
  project (TTS-oriented: strips footnotes/citations for read-aloud prose). This
  mattered a lot: footnotes were exactly where the manuscript-shelfmark leads lived
  in Part 1's research, so reusing those drafts was explicitly rejected in favor of a
  fresh footnote-preserving conversion.
- Read `wiki/project_witcherportal.md`, `wiki/project_illuminatus.md`, `wiki/style.md`,
  and — most load-bearing — `witcherportal/CLAUDE.md` +
  `witcherportal/scripts/convert_corpus.py` + `init_db.py` + `seed_from_json.py`.
  **This became the architecture template for the whole portal**: SQLite source of
  truth, Python static-site generator, a `corpus/sources/*.md` full-text research
  layer that is explicitly NOT site content and NOT git-tracked (confirmed
  witcherportal itself isn't even a git repo yet, so there was no real precedent to
  contradict by gitignoring the corpus here — a deliberate, more conservative choice
  than blindly copying the pattern).
- Confirmed tooling: `pdftotext` (poppler, via mingw64) for full-text extraction,
  `PyMuPDF` (`fitz`) for embedded-image extraction, `bs4` for epub, Calibre's
  `ebook-convert` also present but unused (bs4-based zipfile parsing was simpler and
  matched witcherportal's own epub method).

**AskUserQuestion round 2 — answers:**
1. Portal location: **new sibling project** (`C:\Dev\IslamicateOccultPortal`), not
   folded into TurkaGame — matches the WitcherPortal/IlluminatusPortal pattern of
   each portal being its own top-level project.
2. Corpus scope: **convert on-topic now, flag the rest** — 21 of ~25 files converted;
   4 flagged as off-topic-on-title and left unconverted (Roman Egypt Isis
   terracottas, a Renaissance-Scotland festschrift, Averroes' Physics, a
   Deleuze/postcolonial-theory monograph) — never confirmed with the user whether
   these guesses were correct.
3. Conversion method: **fresh extraction, footnotes intact** (not the
   AudiobookCleaner drafts) — via `pdftotext -layout`.
4. Image extraction: **extract real embedded images + captions**, not a
   description-only catalog — via PyMuPDF.

**What happened during the build (the parts worth remembering, not just the file list):**
- Conversion ran clean: 21/21 sources converted. But **3 came back essentially empty**
  (~1KB each: `al-buni-shams-al-maarif`, `abouzeid-al-farabi-brethren-of-purity-
  political-theory`, `gardiner-buni-untitled`) — confirmed via PyMuPDF that these are
  full-page scans with **zero OCR text layer**. `tesseract` (the OCR engine binary)
  is NOT installed in this environment, though the Python wrapper `pytesseract` is —
  so OCR was not attempted, and this was reported as a real gap, not silently
  papered over. `al-buni-shams-al-maarif` (604pp) is flagged as the highest-priority
  one to eventually OCR — it's al-Buni's own primary grimoire, likely the single
  richest source of sigil/diagram imagery in the whole corpus.
- First image-extraction pass returned 532 "images," but a spot-check showed most
  were actually **full-page scan images** (one big raster per page, e.g. 2552×3296px)
  masquerading as discrete figures in three PDFs (`francis-islamic-symbols-...`,
  `ikhwan-al-safa-1855-...`, `al-buni-berhatiah-...`). Added a `FULL_PAGE_THRESHOLD`
  (1800px) to `extract_images.py` to route these to a separate `page_scans/`
  subfolder instead of cluttering the figure catalog — re-ran, got **88 genuine
  discrete figure candidates** instead, 52 of them from the Brill *Islamicate Occult
  Sciences in Theory and Practice* volume alone, many with regex-detected real
  captions ("figure 3.1 Cast iron 6×6 magic square, Anxi (Xi'an)...").
- Also ran extraction against TurkaGame's own 3 Part-1 PDFs (not just the new
  corpus), since the image-catalog ask was about "all our research materials," not
  just the new folder. Got 19 more images (5 from Dee-Ottoman, 1 from Pythagorean
  Renaissance, 13 from Occult Court). Total catalog: **552 images**.
- Hand-curated only **5** of the 552 with real, human-verified captions (the ones
  from PDFs actually read/viewed directly in this or the prior session): the
  Pythagorean Renaissance paper's Plate 1 (Tehran Majlis MS 10196, f. 52b) and 4 of
  the Dee-Ottoman-Adventure page-composites (title spread, Dee portrait+Monad,
  Casaubon frontispiece+Ottoman group, Tahawi Circle+Akbar portrait). The other 547
  are an explicit **DRAFT review queue**, not claimed as verified.
- Built the SQLite schema: `figures`, `concepts`, `texts`, `institutions`,
  `timeline_events`, **`images`** (the new catalog table — `rights_status` defaults
  `UNDETERMINED` and must stay that way until a human actually checks; a photo of a
  PD manuscript can still carry its own reproduction copyright), `bibliography`,
  `scholarly_refs`, `game_connections`/`game_connection_links` (polymorphic link to
  TurkaGame design docs, explicitly kept separate from factual entries — mirrors
  WitcherPortal's fiction/fact split rule), `essays`.
- Seeded ONLY the material already grounded from Part 1's research (13 figures, 10
  concepts, 5 texts, 7 institutions, 4 timeline events, 24 bibliography rows) — the
  other ~18 newly-converted corpus sources are converted and grep-able but
  deliberately NOT mined into entities yet. This was a scope decision made in the
  moment, not asked about explicitly, on the reasoning that reading hundreds of
  thousands of words of new corpus in one pass wasn't a reasonable single-turn scope
  — flagged honestly in `corpus/INDEX.md` and `CLAUDE.md` rather than either skipped
  silently or overclaimed as done.
- Built `scripts/build_site.py`, ran the full pipeline, verified in-browser
  (`preview_start` name `islamicate-portal-site`, port 7522) — home page, an entity
  page (`figures/ibn-turka.html`, cross-refs to sources and `game_connections`
  resolved correctly), and the image catalog page all confirmed rendering correctly.
- Git init **locally only** — not pushed to GitHub (never asked for this project,
  unlike TurkaGame where it was explicit).
- Wired the two projects together: TurkaGame's `CLAUDE.md` and `docs/DECISIONS.md`
  got a new section pointing at the portal (pushed, commit `8b2b975`); root
  `C:\Dev\CLAUDE.md`'s Active Projects list updated with both; two new wiki pages
  (`wiki/project_turkagame.md`, `wiki/project_islamicateoccultportal.md`) plus
  `wiki/index.md`, `wiki/log.md`, `wiki/registry.md` (new "Islamicate occult / Ibn
  Turka" theme) all updated, `registry.tsv` regenerated (91 projects); two auto-memory
  files (`project_turkagame.md`, `project_islamicateoccultportal.md`) written/updated.

---

## Part 3 — 40 Choices + CYOA/RPG mechanics

**User's request:** have "a narrative designer" produce a report on 40 interesting
choices Ibn Turka might have made differently in his life, as `CHOICES.md`. Then
asked to be asked how these get implemented in a CYOA-style VN with RPG elements
(skill tree, inventory, other ways choices leave lasting impressions).

**What got written:** `games/visual-novel/CHOICES.md` — 40 choices across 8 life-acts
(Formation in Cairo, First Patron/Iskandar Sultan, Second Patron/Baysunghur, Choosing
the Sciences, Popularizer-or-Secret-Keeper, The Bench/judiciary, Three Inquisitions,
Exile & Legacy), 5 choices per act, each tagged **ATTESTED** / **PLAUSIBLE-GAP** /
**INVENTED-COMPATIBLE** for how grounded it actually is — explicitly modeled on
Melvin-Koushki's own counterfactual technique in "Dr Dee's Ottoman Adventure" (the
"what if Dee had gone to the Ottoman court" move). Written directly, not delegated to
a spawned agent, since a fresh agent would have had to re-derive all the Part 1/2
research context already sitting in this conversation.

**AskUserQuestion round 3 — answers (all four picked the ambitious end):**
1. State system: **Occult Quintet skill tree only** — no separate inventory or
   relationship-meter UI. (multiSelect was offered; only this one was picked.)
2. Branch topology: **fully divergent multi-ending tree** — not branch-and-reconverge,
   not stat-gated-lite. The most content-expensive option, chosen knowingly (the
   option text itself warned "could multiply into hundreds of scene variants").
3. Slice scope: **all 8 acts, all 40 choices** — not staged by act, despite the
   option text explicitly flagging this against the user's own known scope-explosion
   pattern (from `docs/CLAUDE_PROJECT_CONTEXT.md`, surfaced in Part 1's research).
4. Ending fidelity: **multiple endings, historical outcome is one among several**, not
   privileged — directly matches the "choices he might have made differently" framing.

**How "fully divergent + all 40" was made tractable without literal path explosion:**
built `games/visual-novel/STATE_MODEL.md` — a 5-integer Occult-Quintet skill-score
model plus one flag per choice (`c01`...`c40`), with a gates table showing where
later choices are concretely narrowed by earlier ones (e.g. "call in patron favor" in
choice #31 requires `c10 == "loyal"`), and a sketch of ~7 named endings computed from
final state rather than authored as 40 literal endings. Then encoded **all 40**
choices as structured data in `games/visual-novel/choices.json` (options, skill
deltas, flags, gates) — validated (40 entries, 5 per act, valid JSON).

**Explicitly flagged as NOT done, to avoid the "structure exists = game is written"
conflation:** the actual narrative prose for every scene. The choice *graph* for the
whole life is real and built; the *visual novel* — text a player would read — is not
written yet. This is the single most important thing for a new session to understand
about current state; see HANDOVER.md's "What's actually done vs. not" section.

---

## Part 4 — This handover

User asked for: (1) a handover document, (2) this conversation saved as `CONVO1.md`
so it can be referred back to without being reread every time an LLM is called —
explicitly invoking the **progressive revelation of context** pattern already
documented in `wiki/architecture_context_engineering.md` ("card first, page second,
source packet last"), (3) done so a fresh session can start clean in the project
directory.

**Design applied:** `HANDOVER.md` is the card layer — short, stable, loaded by
default at the start of any new session. This file (`CONVO1.md`) is the source-packet
layer — organized into the 4 `## Part` sections above specifically so a new session
can grep for a topic or read one `## Part` with offset/limit, never the whole file.
`docs/DECISIONS.md` remains the authoritative, terse decisions log (unchanged in
role) — CONVO1.md adds narrative/rationale depth behind those same decisions, it
doesn't replace the log.

## How to use this file

1. Read `HANDOVER.md` first. Almost always, that's enough.
2. Need the reasoning behind a specific decision? Grep this file for a keyword, or
   read the one `## Part` section that covers it (offset/limit, not the whole file).
3. Never load this whole file into context "just in case" — that defeats the point.
4. If a new major phase of work starts, create `CONVO2.md` for it rather than
   appending indefinitely to this one, and update `HANDOVER.md`'s pointer.
