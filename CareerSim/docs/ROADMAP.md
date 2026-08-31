# ROADMAP.md — Slices and Gates

Vertical slices with hard acceptance gates, per this workspace's discipline. A slice
is done when its gate is verified in a browser (and, once deployed, live), not when
its code exists. Don't start slice N+1 before slice N's gate passes.

## Slice 0 — Engine core + Cairo (the proof) — ✅ DONE (2026-08-30)

**Goal**: prove the encounter-engine loop with real content in one phase.

- Next.js scaffold (App Router, TypeScript); game engine as framework-agnostic
  modules in `src/engine/` (no React imports — testable with the Node test runner).
- State model from SYSTEMS.md §1 (meters, reputations, time, memory) as plain
  serializable state.
- Encounter engine: schema v1, capability×affordance option evaluation with
  `unlockedBy`, gradient resolution, CourtMemory writes/reads.
- Phase I (Cairo) node map, ~10 encounters mined from VN acts 1–2 atoms
  (ENCOUNTER_ATOMS.md batch 1), each with ≥1 capability-gated option.
- Chronicle composed line-by-line, rendered read-only at run end.
- UI: Itinerary, Folio, Seal-and-Line, margin column — per UI_STYLE_GUIDE templates,
  tokens, and both palettes. Onboarding marginalia for the first-run concepts.
- Local play only (anonymous, localStorage saves). No auth yet.

**Gate**: a full Cairo phase playable in-browser; a prepared player (took Akhlati
path) verifiably sees options an unprepared player doesn't, with provenance shown;
one memory written in an early encounter changes a later one; chronicle renders;
both palettes pass contrast; playable at 375px width.

## Slice 1 — The whole life, thin — ✅ DONE (2026-08-30)

- Phases II–V with smaller pools (~6 encounters each; Phase III with all three court
  branches but shallow), obligations/time competition in Phase II, one contract chain
  in Phase III, exposure-tier encounter injection, inquisition encounters in Phase V.
- Two-axis ending matrix + Two-Page Spread screen; ≥8 named endings including the
  historical trajectory (reachable, not optimal — verify by playing both).
- ~~Chronicle editable locally.~~ **Deferred to Slice 2** — editing is only meaningful
  once a chronicle persists to an account; a locally-editable, unsaved chronicle is a
  toy. Not built in Slice 1; do not report it as done.

**Gate**: two cold playthroughs (one historical-ish, one divergent) reach different
named endings with legibly different chronicles; exposure demonstrably escalates
encounter pressure; a broken contract has visible consequences.

**Gate status (2026-08-30): met on the mechanical criteria, pending a human.** Two
contrasting agent playthroughs reached different system verdicts (Source Code of
Empire vs. Died With Its Author) with 29-line phase-grouped chronicles; exposure
gating on the 2nd/3rd inquisitions verified; a failed commission verified applying
its penalty and appearing in the turn banner. Still outstanding: an actual cold
human playtest, and the personal-fate axis is under-differentiated (both runs landed
"The Judge of Isfahan") — see HANDOVER.md "What's NOT done" #2, which should be
fixed before Slice 3.

## Slice 2 — Accounts and kept chronicles

- Supabase auth (email magic-link first), `chronicles` + `runs` tables with RLS;
  chronicle editing persisted; "Your Chronicles" list on the title screen.
- Vercel deploy. Anonymous play still fully functional; local chronicles offer
  one-click claim into an account on sign-in.
- Secrets: Supabase keys via Vercel env vars / `.env.local` only — never in chat,
  never committed (workspace Working Discipline).

**Gate**: verified live on the production URL — sign-in, play, edit a chronicle line,
sign out/in on another browser, the edit persisted. RLS verified (user A cannot read
user B's chronicle by ID).

## Slice 3 — Signature systems

- **Composition workbench**: assemble artifact (contents + language + density +
  diagrams + audience) → property scores → deployable. The 1420 Pivot phase becomes
  composition-centered.
- **Synthesis cosmogram**: the intellectual network as a growing radial diagram
  (letters↔numbers↔cosmology↔kingship…); connections discovered in play light up;
  late-game the cosmogram IS the pause screen's centerpiece.

**Gate**: composing *Investigations* differently (elite Arabic vs. accessible
Persian) produces materially different Phase V and endings; cosmogram reflects run
state accurately.

## Slice 4 — Content at scale

- Portal-corpus atom mining (batch 2+), pool depth to ~120+ encounters, atom lint
  script in `tools/`, more registry images through the provenance gate, bazm/razm
  encounter families fleshed out (including the comedic register).

**Gate**: lint passes on the full pool; two successive runs share <40% of encounters
seen; every ATTESTED encounter's source seal resolves.

## Explicitly not now

Multiplayer/shared-world anything; run-to-run meta-progression; audio; localization;
mobile app wrappers; letting the research pipeline auto-write prose (atoms are
machine-shaped, prose stays human/agent-authored under WRITING_GUIDE review).
