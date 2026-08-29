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
  skeleton, forked from EmblemNovel's engine pattern. Verified end to end in-browser —
  full playthrough, skill accumulation, gate-blocking (an early choice genuinely
  closes off a later option), ending computation, restart. Scene text is
  **deliberately thin/placeholder**, not final prose — see `games/visual-novel/README.md`.
- Showcase site with a real feature-pitch tab: `site/index.html`, `site/features.html`
  (links to the playable prototype), both verified rendering.
- IslamicateOccultPortal: 21 corpus sources converted (full text, footnotes intact),
  552-image research catalog (5 human-verified, 547 auto-extracted review queue),
  SQLite-backed site seeded with the material already covered by TurkaGame's own
  research, verified rendering end to end.
- OCCULTIMGDB (`C:\Dev\OCCULTIMGDB`, a separate pre-existing project) confirmed as a
  strong, ready-to-use asset source: 136 rights-cleared Islamicate images across 14
  works, including images of al-Buni's own *Shams al-Ma'arif*.

## What's NOT done — the important gaps, not hidden

1. **The VN's narrative prose is thin/placeholder, not final.** One line of scene text
   per choice (`games/visual-novel/js/narrative.js`) — enough to make the prototype
   readable and provable, nowhere near the depth CHOICES.md's tagging (ATTESTED /
   PLAUSIBLE-GAP / INVENTED-COMPATIBLE) deserves in the final text. Real prose
   authoring is still a separate, larger task. Only 8 of 40 choices have a backdrop
   image (one per act, not one per choice).
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

Write real narrative prose for the 40 choices in `games/visual-novel/js/narrative.js`,
replacing the placeholder one-liners — the engine, state model, and asset pipeline are
all proven and don't need to change for this. Secondary: source per-choice (not just
per-act) images from OCCULTIMGDB as prose is fleshed out.

## Progressive context — how to go deeper without reloading everything

- **`docs/DECISIONS.md`** — terse, authoritative log of every decision made and why.
  Read this before re-asking the user something already settled.
- **`CONVO1.md`** — the full kickoff-conversation record, organized into 4 `## Part`
  sections (TurkaGame kickoff / IslamicateOccultPortal / 40 Choices+mechanics / this
  handover). **Do not read it end to end.** Grep it for a keyword, or open the one
  `## Part` relevant to what you're doing, with offset/limit. It exists for
  narrative/rationale depth behind a specific decision — the "why," not routine
  continuation, which this file and `DECISIONS.md` already cover.
- If a new major phase of work starts (e.g. VN prose authoring begins in earnest),
  create `CONVO2.md` for it and update this file's pointers — don't append
  indefinitely to `CONVO1.md`.
