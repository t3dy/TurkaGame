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
- **A playable VN prototype** (`games/visual-novel/`): the full 40-choice, 8-act
  loop — title screen, act-transition screens, choice screen, a consequence beat
  after every pick, and an ending screen with a full act-by-act journal. Forked from
  EmblemNovel's engine pattern. Real scene-setting prose for all 40 choices plus
  ~110 lines of per-option consequence text (not final/polished, but real sentences,
  not placeholders — see `NEXTSTEPS.md` Tier 1 for what's still thin). 4 choices
  (`c12`/`c31`/`c33`/`c38`) have dynamic text that changes based on earlier choices.
  Verified end to end, including live on GitHub Pages: full playthrough, skill
  accumulation, gate-blocking (confirmed: choice #10 concretely closes off an option
  at choice #31), save/resume mid-game restores to the exact right act and choice,
  mobile-responsive.
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
6. **Roguelike and career-sim have no code**, design docs only (unchanged from
   kickoff) — the visual-novel is the only prototype with a working engine.

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
