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

- **Model-selection guide + resumable batch harness (2026-08-31).**
  `CONTEXTENGINEERINGGAMEPIPELINES.md` — which model for which job across this repo
  and the portal, and a five-level ladder for coupling portal research to the game
  engines. We are between **L1** (the `BIOGRAPHY.md` + `timeline.json` canonical
  access layer) and **L2** (build-time export from `islamicate.db`); **L2 is the
  recommended next rung**. `tools/batch/` is the runner: one JSON line per task, the
  output file is the done-marker, so a rate limit costs one item and re-running the
  same command resumes. 268 corpus-extraction chunks and 547 image reviews are
  generated and waiting. Control flow verified with a stub; **the live `claude -p`
  transport is NOT verified** — it hangs when invoked from inside a Claude Code
  session, so run sweeps from a normal terminal.

- **Yūsuf Ascent (2026-08-31), standalone, verified in-browser, and LIVE.**
  Deployed and verified in production 2026-08-31 (commit `4268216`) at
  **https://t3dy.github.io/TurkaGame/games/yusuf-ascent/index.html** — see § Deployment.
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

## Deployment

**Canonical production URL: https://t3dy.github.io/TurkaGame/** — GitHub Pages,
branch `main`, path `/`. `git push origin main` is the whole deploy. Full record,
including the checklist and the traps, is in **`DEPLOY_STATE.md`** — read that before
touching deploy config.

Verified live on 2026-08-31 at commit `4268216` (Pages build commit confirmed to match
HEAD, not merely "pushed"):

- All four Yūsuf Ascent surfaces load with **zero console errors** in production.
- Prototype B's numerical self-test run **on the live origin**:
  `__yusufB.checkStationInvariant()` → `pass: true`, worst-case screen drift
  `1.24e-16` against a `1.5e-3` tolerance across 41 panels.
- Prototype A is interactive in production — clicking an element returns its card
  with sprite and rung tag, and a wrong answer is rejected with the lock's own
  message ("the blue niche does not answer to mulk").
- `vendor/three.core.js` (1.44 MB) and `three.module.js` (650 KB) both serve 200.
- Landing page, career sim, VN, knowledge portal, illustration catalogue, timeline:
  all 200.

**Two fixes were needed to make this a real deploy, both worth remembering:**

1. **`.nojekyll` at the repo root.** Pages builds this repo with the legacy Jekyll
   pipeline, which excludes `vendor/` and `_`-prefixed files by default. Without
   `.nojekyll`, Prototype B's three.js would have 404'd in production while working
   perfectly on localhost — the exact silent-deploy-failure shape. Don't delete it.
2. **`site/index.html` nav entry and Play card.** The prototype was otherwise live
   but unreachable from anywhere on the site.

- **Visionary Gallery (2026-08-31), verified in-browser.** `games/visionary-gallery/`
  — the **automatic** counterpart to Yūsuf Ascent's hand work. 22 Persianate folios
  fetched, measured, deconstructed, papercrafted, 3D'd and made playable.
  - **22 images, 0 blocked.** `imagelab/scripts/fetch_commons.py` reads Commons'
    structured licence data and refuses anything not free. Includes **six folios from
    the Cairo Būstān itself** — the same manuscript and painter as Yūsuf Ascent's —
    which is the controlled comparison the portal's open questions asked for.
  - **Measured, not asserted.** `analyze.py` (fixed seed, deterministic) computes
    attention evenness, orientation spread, rectilinearity, bare-ground fraction, mean
    Lab chroma, a k-means palette, 475 auto-proposed regions and a layer assignment.
    The traditions separate on chroma × bare-ground without being told to: Jalāyirid
    drawings and Timurid illuminations land in opposite corners of the gallery scatter.
  - **Papercraft.** `papercraft.py` emits a printable paper tunnel book per folio —
    cards with fold-back tabs, notched concertina side walls, cut lines red and folds
    dashed blue, as one self-contained SVG. Verified rendering.
  - **Playable site.** Gallery + per-folio workbench (Folio / Analysis / Depth 3D /
    Papercraft / Play) + a corpus game (Assay) + a Method page. All verified live:
    22 cards, 8 traditions, no broken links, both games scored end to end, the 3D
    station-point invariant holds at 0 drift across 27 quads.
  - **Two of this project's own sentences were contradicted by measuring them, and
    both stayed on the page.** (1) "Every surface is finished to the same degree of
    attention" ranks the Yūsuf folio 14th of 22 — the metric punishes Bihzād's
    deliberate blank arch, which locates a confound rather than refuting the claim.
    (2) An earlier draft of the gallery claimed the machine agreed with the hand
    "about two thirds of the time"; nobody had measured it. `compare_hand.py` did:
    the machine **ranks** well (Spearman ρ = 0.86, p = 0.0006) and **finds** badly
    (27% of hand regions at IoU ≥ 0.2, 7% at 0.3), missing the chamber, Yūsuf, the
    halo and the brackets — every element the argument is made of.
  - Two real bugs found this way: the rights regex over-blocked 19 of 22 files, and
    the layer ordering was inverted so the highest-salience regions were being
    absorbed into the papercraft ground plate. Both fixed, both documented in the
    scripts rather than quietly patched.
- **Yūsuf Ascent v2 — L3 grounding.** Every one of the 43 elements now carries what it
  rests on (104 claim rows: 5 ATTESTED, 33 CORPUS, 10 FIELD, 6 INFERENCE, 50
  INTERPRETATION), shown in-game on each card under "Rests on". That is
  `CONTEXTENGINEERINGGAMEPIPELINES.md`'s L3 applied to a picture instead of a scene.
  Also fixed a real hang: `await img.decode()` never settles in a hidden or throttled
  tab and was silently blocking Prototype A's boot.
- **Decision records written for all of the above.** `docs/DECISIONS.md` gained a dated
  block in the house format (10 entries); `docs/PIVOTS.md` is new and records the five
  places the work changed direction mid-build, each with what it cost and what to watch;
  `games/yusuf-ascent/DECISIONS.md` and `games/visionary-gallery/DECISIONS.md` carry the
  implementation detail. `DEPLOY_STATE.md` gained the five new served surfaces, a repo-weight
  table, and a gotcha about the gallery's cross-folder three.js import.
- **`tools/batch/make_tasks.py visionary`** — a new generator producing 22 bounded
  per-image annotation tasks (Haiku, `Read Write` only, ~2K tokens of measured facts
  each, forbidden from inventing shelfmark/folio/patron/date). Manifest generated and
  validated; **the sweep has NOT been run** — `claude -p` hangs inside a Claude Code
  session, so it needs a real terminal.

- **L2 built and verified (2026-09-01).** `portal/scripts/export_gallery_scholarship.py`
  exports 10 encyclopedia entries and 15 tradition links from `portal/db/turka.db` into
  the Visionary Gallery. Verified live: workbench pages render the entries with the
  portal's own DRAFT/MEDIUM flags visible, all 8 front-page tradition sections carry
  entry chips, the Method page's ladder shows L2 as built, clean console. One deviation
  from the recorded plan flagged in `docs/DECISIONS.md`: the source is this repo's
  `turka.db`, not the sibling `islamicate.db` the earlier entry named. Two gaps the
  export surfaced are recorded in the JSON itself (no divination entry; no
  painting-world figures — the latter is correct scope, the former is the portal's
  highest-value missing entry).

- **Divination gap closed, by two sessions at once (2026-09-01).** The L2 export's own
  recorded gap ("no divination entry") drew a `geomancy` + `jafr` pair from a concurrent
  session and a duplicate `ilm-al-raml` from this one. **The duplicate was deleted, theirs
  kept**; the Falnāma tradition now links to both of theirs with the link's limits stated.
  The removed draft's extra grounded material is preserved in
  `portal/docs/NOTE_geomancy_merge_candidate.md` for a deliberate merge.
  **Two hazards worth carrying forward:** `seed_from_json.py` PRUNES rows absent from
  `seed.json`, so re-run `export_gallery_scholarship.py` after any portal re-seed; and the
  export deliberately `sys.exit`s on a missing slug, which is what caught two
  merged-away entries within seconds. Next entry to write, per the corpus: **oneiromancy**
  — Melvin-Koushki ranks dream divination *above* geomancy, the portal has no entry, and it
  serves `docs/VISIONARY_ENVIRONMENTS.md` directly.

- **House rules are now enforced in code (2026-09-02).** `tools/check_repo_rules.py`
  + a tracked `tools/hooks/pre-commit`. **Run `python tools/install_hooks.py` once per
  clone** — `core.hooksPath` is local config and does not travel by itself. Verified three
  ways: clean on the current tree (621 files, 30/30 checksums), **44 violations when run
  against the historical bad state**, and a real `.pdf` commit blocked end to end.
- **The PDF history purge is prepared but NOT done.** See
  `docs/RUNBOOK_purge_pdfs_from_history.md`. It is destructive (rewrites every SHA, breaks
  every clone, needs a force-push) and is the repo owner's call. The runbook argues both
  sides — 0 forks and 0 stars make the residual risk small, but also make *now* the
  cheapest possible moment to act, since forks are what no rewrite can reach.

- **Abjad Tower (2026-09-02), playable and verified in-browser.** `games/abjad-tower/` —
  a physics stacking/knock-down game where blocks are the 28 Arabic letters and mass is
  abjad value. Six operations, five grounded in portal entries or corpus passages plus one
  deliberately plain control (a thrown stone). Three modes: Demolition, Raising,
  Extraction. Physics is vendored cannon-es 0.20.0 (MIT).
  Verified by playing it: 21-block tower settles at 3.25 m, all six operations exercised,
  Reckoning finds 55 composite abjad targets in a fresh tower, a full Demolition round won
  at 275 points, Tome records discoveries and ranks up. Two bugs found and fixed in the
  process, both geometry rather than physics — non-square block proportions that tipped
  every tower over, and placement aiming solved against the wrong plane.
  `build_letters.py --verify` checks the roster against `portal/db/turka.db`.

- **The Impossible Architect (2026-09-02), playable and verified.** `games/impossible-architect/`
  — a route-builder where each of the folio's 41 cut elements is a piece whose rule is
  its card's logic. Reuses Yūsuf Ascent's `palace.json`, sprites and seven locks unchanged.
  Verified by a legal-moves-only solver: the first version was trivially winnable (15
  moves, no door opened); two rules from the painting fixed it and the solver re-confirmed
  winnability. Five more designs specified in `docs/GAME_DESIGNS_BIHZAD.md`, ranked, with
  The Weight of Brackets the cheapest next (an Abjad Tower block set).
- **Abjad Tower tuned:** Raising is 18 blocks to 3.6 m; `?mode=&seed=` URLs and "Same
  tower" replay for reproducible playtesting.
- **A destructive slip recorded in DECISIONS:** a patch script truncated two `index.html`
  files by opening for write before reading. One restored from git; the other rewritten.

- **The Weight of Brackets (2026-09-02)** — Abjad Tower's fourth mode; the folio's parts as
  blocks over a void, brackets the only bodies fixable in air. Verified deterministically
  (450-point win). Two verification lessons recorded in DECISIONS: this pane throttles rAF
  during tool calls, so **physics must be stepped manually to test it**; and a piece that
  "slid off a ledge" had spawned inside the turret — **guard spawns against fixed bodies**.

- **The lettrist programme, slices 1–2 (2026-09-03)** — `docs/PUZZLE_GAME_IDEAS.md` is
  the catalogue and the plan. Abjad Tower now carries the shared data layer
  (`letters.json` form facts + registers, `correspondences.json` rival schemes, the
  project-wide Notebook in `src/notebook.js`) and a fifth mode, Temperament, with a hidden
  operative scheme and taḥqīq-style recording. Verified by `tests/data.test.mjs` (12 pass)
  and `__abjad.selfTestMizaj()`. Two physics lessons in DECISIONS: friction alone did not
  discriminate; sleeping bodies report no contacts.

- **The Letter Machine (2026-09-03)** — `games/letter-machine/`, slice 3. Letters are
  instructions, matter is data, and the instruction is DERIVED FROM THE GLYPH'S FORM
  (closed binds, tail pours, dots raise or lower, upright holds an axis; dāl and kāf are
  inert). Transposition is judged by the same hidden schemes as Abjad Tower's Temperament,
  and both games write one notebook — verified live, a scheme disproved in the tower
  arrives already CONFIRMED in the machine. 15 engine tests, 5 solver-verified puzzles.
- **Three fixes from re-reading (2026-09-03)** — Brackets could be won in two moves by
  touching the turret with a bracket-borne brick; the win is now a chain of contact from
  the ground. Extraction's target letter is now ranked by load, with a named tier.
  The machine's element glyphs are triangles, not emoji.

- **v2 begun, v1 frozen (2026-09-04)** -- `games/` is closed (`games/FROZEN.md`); new work
  is in `v2/`. Engine: 8 primitives derived from observable letter facts, 5 rulesets that
  differ by motive and genuinely disagree, the Mafahis's three registers as the execution
  model, preview-is-execution. App: the Scriptorium (`v2/apps/scriptorium/`), a letter IDE
  with Letter Property Frames, provenance pills and 3 self-testing tasks. Verified: 24 Node
  tests, `build_letters.py --verify`, and all 3 tasks solved through the real UI path in the
  browser. Read `v2/README.md` then `v2/AUDIT_V1.md`.

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
6. **`claude -p` was never verified end to end.** The batch harness in `tools/batch/`
   has its control flow fully verified with a stub binary (cwd resolution,
   checkpointing, resume-skips-done, 4 parallel workers, launch/timeout/no-output
   error paths), but nested `claude -p` hangs when invoked from inside a running
   Claude Code session — reproduced with a minimal prompt, sandboxed and not. So no
   batch task has actually run against a model. **Run the first sweep from a normal
   terminal with `--limit 5` and read the output** before trusting the rubric or the
   transport.
7. **The Yūsuf Ascent verification is not a full playthrough.** In production I
   confirmed rendering, zero console errors, Prototype B's numerical invariant, and
   that Prototype A's hotspots return correct cards and reject a wrong answer with
   the right message. I did **not** re-run the scripted 7-lock playthrough, and did
   not exercise Prototype C's drag-sort or the blind 8th door in production. A prior
   session reports those passing locally; that claim is inherited, not re-verified.
8. **Rights on the Yūsuf folio are CLEARABLE, not cleared.** PD-Art via Wikimedia
   Commons is the basis; the Dār al-Kutub's own terms still need confirming before a
   shipped (as opposed to prototype) release.
9. **Roguelike has no code**, design doc only (unchanged from kickoff). The
   **career sim graduated (2026-08-30) to its own design-complete subproject at
   `CareerSim/`** — full system-file set (CLAUDE.md, DESIGN.md, SYSTEMS,
   UI_STYLE_GUIDE, ENCOUNTER_ATOMS, ROADMAP, DECISIONS, its own HANDOVER.md), but
   still zero code; the visual-novel remains the only prototype with a working
   engine. New CareerSim sessions start at `CareerSim/HANDOVER.md`.

## Likely next step

**Note (2026-08-31):** `NEXTSTEPS.md` predates Yūsuf Ascent and the batch harness and
does not mention either. Its Tier 0 "confirm the live Pages build still works" is now
done and recorded under § Deployment. Three candidates it doesn't cover:

- **L2 export** (portal `islamicate.db` → `site/data/*.json`) — the recommended next
  rung per `CONTEXTENGINEERINGGAMEPIPELINES.md`; makes a fix in the portal propagate
  to the game instead of being made twice.
- **Run the image sweep.** 547 of 552 portal images are still `DRAFT`. The manifest
  exists; run `--limit 5` first and read the output before committing to the sweep.
- **Prototype A's missing pieces** — `INTERFACE.md` is honest that there's no
  onboarding, no journal, and no touch support in Prototype C.

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
