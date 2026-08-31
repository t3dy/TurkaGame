---
title: HANDOVER
description: Start here in a new session. Short by design — deep rationale lives in CONVO1.md, opened by section only when needed.
---

# Handover

Read this file, `CLAUDE.md`, and `docs/DECISIONS.md`. That's the default context for
a new session — do not open `CONVO1.md` unless one of those three points you there
for a specific decision's backstory. See "Progressive context" at the bottom.

## What this is

Two linked projects, both from the same kickoff conversation (2026-08-29/30):

- **TurkaGame** (`C:\Dev\TurkaGame`, this directory) — game prototypes on Ṣāʾin
  al-Dīn ʿAlī ibn Turka Iṣfahānī (1369–1432). Pushed to `github.com/t3dy/TurkaGame`.
- **IslamicateOccultPortal** (`C:\Dev\IslamicateOccultPortal`, sibling directory) —
  the broader DH research portal (lettrism, Brethren of Purity, al-Buni) this game
  draws from. Local git repo only, not pushed.

## What's actually built and verified

- Research brief + 3-paper synthesis: `docs/RESEARCH_BRIEF.md`, `research/notes/`.
- Working asset-provenance CLI: `research/scripts/register_asset.py` (smoke-tested).
  8 real manuscript images now registered in `assets/manuscripts/registry.json`,
  sourced from OCCULTIMGDB with full public-domain provenance.
- Design docs for all 3 prototypes: `docs/GAME_{VISUAL_NOVEL,ROGUELIKE,CAREER_SIM}.md`.
- **40 branching life-choices**, fully structured: `games/visual-novel/CHOICES.md`
  (narrative report, grounding-tagged), `STATE_MODEL.md` (mechanics design),
  `choices.json` (validated structured data — options/skills/flags/gates for all 40).
- **Three live, playable VN versions**, deployed side by side rather than
  overwriting one another:
  - **`games/visual-novel/` — Version 3.0 (current).** The full 40-choice, 8-act
    loop — title screen, act-transition screens, choice screen, a consequence beat
    after every pick, an ending screen with a full act-by-act journal and a
    personalized epilogue. All 87 choice options carry a `detail` field, audited
    down to ~14 words average (from v2's ~41) and rewritten to name a real person,
    text, or institution wherever `docs/BIOGRAPHY.md` supports one — e.g. c01's
    "seek unconventional teachers" now names Sayyid Husayn Akhlati specifically.
    7 of 40 scenes are reactive to earlier choices. Every scene follows
    **`games/visual-novel/WRITING_GUIDE.md`** (linked from `CLAUDE.md`'s ground
    rules), which now has an explicit brevity target (~10-20 words, "a third not a
    half") plus the specificity rule, added after v2 drifted long and generic.
  - **`games/visual-novel-v2/` — Version 2.0 (archived).** Snapshot before the v3
    writing audit — same structure as v3, longer (2-4 sentence) option reasoning.
  - **`games/visual-novel-v1/` — Version 1.0 (archived).** Snapshot of commit
    `7bf20cd`, before option-detail text existed at all — short choice labels only.
  - All three cross-link via a version banner. All use `?v=N` query params on
    every local module import (v3 is currently `v=7`), bumped on every content
    change, because `python -m http.server` sends no cache-control headers and
    browsers were repeatedly observed serving stale JS/JSON across navigations
    without it — hit this bug twice this project, now a standing discipline, not
    a one-time fix.
  - Verified end to end on all three versions, including live on GitHub Pages:
    full playthroughs, gate-blocking, save/resume, mobile-responsive; each
    version confirmed to render its own distinct option-text length/style, not a
    cached copy of another version's.
- **8 endings, not 7** — added "Source Code of Empire" after a fresh research
  audit (`games/visual-novel/ENDINGS_AUDIT.md`) found the existing 7 endings all
  scored Ibn Turka's *personal* outcome, but the single biggest claim in
  `research/notes/03-the-occult-court.md` — that his platform became default
  imperial cosmology across six court cultures for centuries, regardless of his
  own fate — had no ending reflecting it. Also fixed two real gaps the audit
  found: `c33`/`c04` (the Qasim-i Anvar loyalty arc) and `c36=reconcile` both had
  zero effect on the ending/epilogue despite `CHOICES.md` framing them as
  consequential — both now feed `epilogueFor()`. One larger proposal (naming Shah
  Rukh's actual violence against Iskandar Sultan in `c10`'s scene text, or a new
  choice about petitioning him directly) is written up but deliberately not
  implemented this pass — see `NEXTSTEPS.md` items 5-7 and the audit doc for why.
  New ending verified reachable through actual gameplay (not just unit logic) and
  live on GitHub Pages.
- **Live on GitHub Pages**: https://t3dy.github.io/TurkaGame/ (repo root is the
  Pages source; a root `index.html` redirects to `site/index.html` since the actual
  homepage lives under `site/`). Verified live, including the game itself and its
  manuscript images, not just locally.
- Showcase site: `site/index.html`, `site/features.html` (links to the playable
  prototype), both verified rendering live.
- Narrative-design docs: `GAMELOOP.md` (how the play loop actually works, beat by
  beat, and where it's thinner than the design deserves) and `NEXTSTEPS.md`
  (prioritized roadmap in 4 tiers). `README.md` rewritten with the live link at top.
- **`docs/BIOGRAPHY.md`** — the canonical, citation-grounded biography (formation
  in Cairo → two patrons → the 1420 pivot year → three inquisitions → exile/death),
  written to be the single source future choices/events/encounters draw from. Ends
  with an explicit "for game design" section naming open research gaps not to
  invent past.
- **`site/timeline.html`** (+ `site/data/timeline.json`) — a new site tab, 50 dated
  events (950–2025) across four filterable categories: biography, texts &
  discoveries, historiography of science, and Ibn Turka's *comparative* relationship
  to European Renaissance magi (Cusa/Pico/Bruno/Dee — comparisons Melvin-Koushki
  himself draws, explicitly not claims of direct contact). Every event tagged
  ATTESTED/COMPARATIVE/CONTEXT/HISTORIOGRAPHY, with ~5 historiography entries
  honestly flagged low-confidence (drawn from general field knowledge, not a
  source document this project has in hand — e.g. Melvin-Koushki's dissertation
  year). The same 50 events were also loaded into
  **IslamicateOccultPortal's real SQLite pipeline** (`timeline_events` table,
  replacing its previous 4-event placeholder) — `init_db.py` →
  `seed_from_json.py` → `build_site.py` all re-run and verified clean. Verified
  in-browser: filter chips, mobile viewport, all 50 events present with correct
  badges.
- IslamicateOccultPortal: 21 corpus sources converted (full text, footnotes intact),
  552-image research catalog (5 human-verified, 547 auto-extracted review queue),
  SQLite-backed site seeded with the material already covered by TurkaGame's own
  research, verified rendering end to end.
- OCCULTIMGDB (`C:\Dev\OCCULTIMGDB`, a separate pre-existing project) confirmed as a
  strong, ready-to-use asset source: 136 rights-cleared Islamicate images across 14
  works, including images of al-Buni's own *Shams al-Ma'arif*.

- **Yūsuf Ascent (2026-08-31), standalone and verified in-browser.**
  `games/yusuf-ascent/` — a puzzle minigame + research portal on one painting,
  Bihzād's *Yūsuf fleeing Zulaykha*. Built to stand alone; optionally pluggable
  into the career sim as a dream encounter (framing written up, not wired).
  - The folio decomposed into **43 interactable elements**; boxes in
    `imagelab/data/regions.json`, sprites cut by `cut_regions.py`, merged with
    interpretation by `games/yusuf-ascent/build_palace.py` into `data/palace.json`,
    which all four surfaces read.
  - **Prototype A, "The Seven Doors"** — 2D hotspot chain. Verified by a scripted
    full playthrough: all 7 locks open in order, wrong answers rejected with the
    right message, the blind 8th door refuses, cards render, restart works.
  - **Prototype B, "The Impossible Stack"** — three.js. Panels are placed by
    *cosmological rung* and compensated about a station point, so from one
    privileged viewpoint the exploded stack projects to the identical image as the
    flat painting. Verified numerically, not just visually:
    `__yusufB.checkStationInvariant()` returns worst-case screen drift `1.2e-16`
    against a `1.5e-3` tolerance across all 41 panels. Two real bugs found and fixed
    in verification (backdrop plate rendering *in front of* the exploded strata; the
    rung-colour debug mode permanently destroying panel textures through material
    aliasing).
  - **Prototype C, "The Ladder"** — drag-sort into seven strata; reveal/mark verified
    at 41/41.
  - **Research portal** — renders from `data/research.json`; verified live with 41
    gallery entries, all six grounding-tag types, 13 bibliography rows, 5 open
    questions, and the one contested reading flagged.
  - **A real provenance correction**: the folio was recorded in
    `imagelab/data/images.json` as "Adab Farsi 908 (attributed)", flagged there as a
    guess. It is **Adab Farsi 22, f. 52b**, Egyptian National Library — corrected in
    `images.json`, with rights moved from NEEDS_VERIFICATION to CLEARABLE (PD-Art via
    Wikimedia Commons; the Dār al-Kutub's own terms still to be confirmed before a
    shipped release).
  - Forward proposals written, not built: `GRAPHICS.md` (routed through the Three.js
    skill pack — 5 ranked proposals plus an explicit refusal list, since the source
    has no modelled light and PBR/bloom would be a category error) and
    `INTERFACE.md` (8 ranked, honest about no onboarding, no journal, and no touch
    support in Prototype C).
- **`docs/VISIONARY_ENVIRONMENTS.md`** — research into eight other Persianate
  visionary traditions (the 1436 Herat *Miʿrājnāma* made for Shāh Rukh; the Freer
  Jalāyirid *Dīwān*; *Haft Paykar*'s seven planetary pavilions; Siyah Qalam; the
  *Falnāma*; the *muraqqaʿ*; Qazwīnī's cosmography; the lettrist grid), each with a
  concrete environment mechanic, a rights lead, and a ranked build order. Also
  states the discipline for writing Ibn Turka's visionary life honestly: build it as
  *practice* (miʿrāj, khalʿ, and his own signature demand for **descent**), not as an
  invented vision narrative.

## What's NOT done — the important gaps, not hidden

1. **The VN's narrative prose is a real first pass, not final writing.** Every
   choice has genuine scene-setting prose and a consequence line now (not
   placeholders), but only 4 of 40 scenes are reactive to earlier choices, the
   consequence beats are uniformly one line even for the highest-stakes choices, and
   only 8 of 40 choices have a backdrop image (one per act, not one per choice). See
   `NEXTSTEPS.md` Tier 1 for the specific, ranked next improvements — don't just
   rewrite it all again without reading that first.
2. **Only 3 of the portal's 21 corpus sources are mined into entities** — the rest
   (Brethren of Purity philosophy specifically, al-Buni's corpus in depth, ~18 more
   sources) are converted and grep-able but not yet synthesized into
   figures/concepts/texts. Ongoing work, see `IslamicateOccultPortal/corpus/INDEX.md`.
3. **3 corpus PDFs are unreadable scans** (`al-buni-shams-al-maarif` — the highest
   priority, al-Buni's own primary grimoire — plus 2 others) — zero OCR text layer,
   `tesseract` binary not installed in this environment.
4. **Only 3 of an expected 4 Ibn Turka source PDFs were ever found** in Downloads at
   kickoff — never resolved whether a 4th exists.
5. **4 files in `E:\pdf\Islamicate Chill Pills\` were flagged off-topic by title
   alone and never converted** (Roman Egypt Isis figurines, a Renaissance-Scotland
   festschrift, Averroes' Physics, a Deleuze/postcolonial-theory piece) — never
   confirmed with the user whether that guess was right.
6. **Roguelike has no code**, design doc only (unchanged from kickoff). The
   **career sim graduated (2026-08-30) to its own design-complete subproject at
   `CareerSim/`** — full system-file set (CLAUDE.md, DESIGN.md, SYSTEMS,
   UI_STYLE_GUIDE, ENCOUNTER_ATOMS, ROADMAP, DECISIONS, its own HANDOVER.md), but
   still zero code; the visual-novel remains the only prototype with a working
   engine. New CareerSim sessions start at `CareerSim/HANDOVER.md`.

## Likely next step

Read `NEXTSTEPS.md` — it's the current prioritized roadmap and supersedes any older
"likely next step" note. Tier 0 is verification (confirm the live Pages build still
works, playtest the gate/consequence loop cold). Tier 1 is the highest-leverage work
on the VN that already exists (escalate the highest-stakes consequence beats, add a
few more reactive scenes, per-choice imagery). Don't jump to Tier 2/3 (broader
content, the other two prototypes) before Tier 1 — see `NEXTSTEPS.md`'s "Explicitly
not next" section for why a second full prose rewrite isn't the right next move yet.

## Progressive context — how to go deeper without reloading everything

- **`docs/DECISIONS.md`** — terse, authoritative log of every decision made and why.
  Read this before re-asking the user something already settled.
- **`CONVO1.md`** — kickoff through the first playable prototype (TurkaGame init,
  IslamicateOccultPortal, 40 choices + mechanics, first HANDOVER.md).
- **`CONVO2.md`** — the writing/UX polish + GitHub Pages hosting + README/GAMELOOP/
  NEXTSTEPS session.
- **Both are opened by section, never end to end.** Grep for a keyword, or read the
  one `## Part` relevant to what you're doing, with offset/limit. They exist for
  narrative/rationale depth behind a specific decision — the "why," not routine
  continuation, which this file and `DECISIONS.md` already cover.
- If a new major phase of work starts, create `CONVO3.md` and update this file's
  pointers — don't append indefinitely to either existing file.
