# CareerSim Decisions Log

Terse, authoritative. Overturn deliberately, not by drift. Kickoff decisions recorded
2026-08-30 from the design conversation (docs/DESIGN_CONVERSATION.md) + four explicit
user calls made at project creation.

## Kickoff (2026-08-30)

- **Run shape: life-phase sectors** (user-confirmed). FTL structure mapped to the
  biography — Cairo → Isfahan → Courts (branch) → 1420 Pivot → Trials. A run is a full
  compressed life, ~60–90 min. Not pure procedural runs; not a single persistent
  Crusader-Kings-style career.
- **First-slice spine: the encounter engine** (user-confirmed). Capability×affordance
  situations adapted from DungeonAB v6, with Synthesis/Composition entering as simple
  counters/items until Slice 3. The synthesis cosmogram and composition workbench are
  signature systems but NOT the proof-of-loop.
- **Stack: Next.js + Supabase, deployed on Vercel** (user-directed, superseding the
  parent repo's tentative note). Driver: the user wants **player logins and
  player-editable text in logged run chronicles** — a real backend requirement, not
  optional. Engine code stays framework-agnostic under `src/engine/`; anonymous
  localStorage play works before and alongside auth (Slice 0–1 need no backend).
- **VN relation: mine as encounter atoms** (user-confirmed). The 40 choices +
  BIOGRAPHY.md + timeline.json convert into atoms (see ENCOUNTER_ATOMS.md); the VN
  itself is untouched and stays its own game. No shared runtime content layer —
  parent repo's "no premature sharing across game folders" rule holds.
- **Location: `TurkaGame/CareerSim/` as its own full subproject** (user-directed:
  "its own full set of system files as a separate project in a CareerSim subfolder").
  Supersedes the placeholder at `games/career-sim/` (now a pointer). Deviates
  knowingly from the parent's "games live under `games/`" convention because this
  one has its own deploy target (Vercel) and system-file set; the parent CLAUDE.md
  records the exception.
- **Title: "Ibn Turka: The Occult Court"** — the design conversation's own pitch
  phrase. Working title; cheap to change until Slice 2's deploy.
- **The Chronicle is the persistent artifact.** Run history is written as a
  period-style chronicle, editable post-run by its owner ("emended by the author").
  This is the feature auth exists for, and the game's thematic heart (Yazdi's craft,
  handed to the player).
- **Ending = two independent axes** (personal fate × system fate), legacy over
  survival. Historical trajectory reachable, never optimal (carries the VN's
  ENDINGS_AUDIT lesson forward).
- **Grounding tags mandatory on every encounter** (ATTESTED / PLAUSIBLE-GAP /
  INVENTED-COMPATIBLE), surfaced in the UI as inspectable seals — historiographic
  honesty as a feature, continuing the timeline's COMPARATIVE≠contact discipline.
- **Rejected at kickoff** (from the design conversation, on Koushki-fidelity
  grounds): reagent/crafting economy, spell system, single reputation meter,
  numeric-bonus occult skills, generic-alchemy-simulator drift, solemn-only tone
  (bazm comedy is in scope).

## Open items

- Full seven-tier epistemic hierarchy still unsourced (parent DECISIONS.md item) —
  do not build the "depth of mastery" axis until it is.
- Supabase project not yet created; schema drafted at Slice 2, not before.
- Whether chronicles are shareable/public (read-only links) — deferred to Slice 2+,
  needs a user call; default private.

## Slice 0 build (2026-08-30, same day)

- **Static-first, Next.js deferred to Slice 2** (user-directed: "don't bother with
  supabase or vercel deployment yet... give me a static website to test it").
  Slice 0/1 are no-build vanilla JS ES modules (`index.html` + `src/` + `content/`),
  served by the parent repo's `turkagame-site` launch config. The engine was specced
  framework-agnostic anyway, so the Slice 2 Next.js wrap is packaging, not rewrite.
  ROADMAP Slice 0's "Next.js scaffold" bullet is superseded by this.
- **Parent `.claude/launch.json` fixed to serve the repo root** (was `--directory
  site`, contradicting the parent CLAUDE.md's own description); the game is at
  `http://localhost:7521/CareerSim/`.
- **Time model v1**: node visit = 1 season, budget 7, departure node free; at time 0
  the Road Home fires automatically. Depth-vs-breadth (revisiting a node digs deeper
  into its encounter chain) is the phase's core strategic texture.
- **Boost mechanic v1**: met `boosts` clauses multiply the two best outcome bands'
  weights (×(1+n)) — preparation tilts the ladder, shown as "favored by …".
- **Cache-bust discipline inherited**: `?v=N` on module/CSS URLs, bumped per change
  (parent repo's standing rule; `index.html` is the version source of truth).

## Slice 1 build (2026-08-30, third session)

All five phases built and verified playable. Decisions made during the build:

- **Career systems live in `src/engine/career.js`**, separate from the encounter
  engine: exposure tiers, obligations, contracts, and the ending matrix. Keeps
  `engine.js` about situations-and-options only, which is what makes it portable.
- **Obligations charge per action, not per season.** The judgeship costs a season
  every time the player *does* something, so the office competes with the work
  directly rather than as a flat tax. Neglect (can't pay) applies a penalty and
  writes `neglected_bench` rather than blocking the action.
- **Contracts settle at phase end** (`settleContracts`), not only at their deadline.
  Found by playtest: an open commission could outlive the phase and quietly
  evaporate, so a promise had no consequence. A commission now always comes due.
- **`LEGACY_NOTES` is the marginalia table** and the lint's source of truth — the
  Chekhov's-gun test imports it directly rather than regex-scanning, so a content
  author who adds a memory flag must add its ending line or the build fails. This
  is what makes "every choice echoes at the end" enforceable rather than aspirational.
- **Exposure gates content** via `exposure_min` on encounters (the second and third
  inquisitions require it). Pressure escalates because the player succeeded, which
  is the thesis; it is not a random event table.
- **Phase tagging on every encounter** (`phase: N`), enforced by test — an encounter
  can never leak into the wrong phase's pool.
- **Assets sourced from OCCULTIMGDB via the provenance CLI**, 8 new images (registry
  27 total), chosen per phase for what the encounter is actually about (Hārūt and
  Mārūt for the inquisition, since Qurʾan 2:102 is the proof-text the charge rests
  on). Deliberately **rejected two modern diagrams** (a modern "levels of heaven"
  redrawing and a modern muqaṭṭaʿāt roundel) despite good fit: this project's rule
  is historical material, not modern illustration of it.
- **A test now lints plate→registry**: an encounter cannot reference an image that
  has no provenance record.
