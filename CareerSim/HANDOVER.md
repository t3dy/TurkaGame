# Handover — CareerSim

## State (2026-08-30, kickoff session)

**Docs-complete, zero code.** The full system-file set was created this session from
`TurkaCareerSim.txt` (a 3,778-line design conversation, imported verbatim to
`docs/DESIGN_CONVERSATION.md`) plus four explicit user decisions. Nothing is
implemented; nothing is deployed.

What exists and is authoritative:

- [DESIGN.md](DESIGN.md) — thesis, six Koushki claims → systems, run shape (5
  life-phase sectors), two-axis ending, the Chronicle.
- [docs/SYSTEMS.md](docs/SYSTEMS.md) — buildable mechanics spec: meters/reputations/
  entities, Quintet-as-verbs, encounter schema v1, phases/time, contracts/demand,
  CourtMemory, gradient outcomes.
- [docs/UI_STYLE_GUIDE.md](docs/UI_STYLE_GUIDE.md) — "the illuminated apparatus":
  design tokens, one template per loop beat (Frontispiece, Itinerary, Folio,
  Seal-and-Line, Colophon, Two-Page Spread, Player's Codex), two-voice UX writing,
  six legibility guarantees. Normative.
- [docs/ENCOUNTER_ATOMS.md](docs/ENCOUNTER_ATOMS.md) — atom format, extraction
  ontology, the VN→atom conversion mapping (batch 1), lint rules.
- [docs/ROADMAP.md](docs/ROADMAP.md) — 5 slices with acceptance gates. **Next work =
  Slice 0** (Next.js scaffold, engine core, Cairo phase with ~10 mined encounters,
  local play, no auth).
- [docs/DECISIONS.md](docs/DECISIONS.md) — the four user calls (life-phase sectors;
  encounter-engine spine; Next.js+Supabase+Vercel because of logins + editable
  chronicles; mine-the-VN-as-atoms) and what was rejected.

## What's NOT done

1. No code, no scaffold, no `package.json`, no launch.json entry.
2. No Supabase project (deliberately deferred to Slice 2 — don't create it earlier).
3. No atoms actually converted yet — batch 1 (VN choices.json → atoms) is the first
   content task inside Slice 0.
4. Parent repo docs updated to point here (parent CLAUDE.md, parent
   docs/DECISIONS.md, games/career-sim/README.md) — verify those pointers still hold
   if files moved.
5. The seven-tier hierarchy blocker from the parent repo still stands; the "depth of
   mastery" axis stays out of scope until sourced.

## Likely next step

Start ROADMAP Slice 0. First concrete moves: `create-next-app` scaffold (TypeScript,
App Router), `src/engine/` state + encounter engine with tests, then the VN→atom
converter in `tools/` and ~10 Cairo encounters. Read DungeonAB's
`src/encounters/EncounterEngine.js` before writing the engine — port the pattern
(declarative situations, capability×affordance, unlockedBy), not the dungeon.
