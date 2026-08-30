# Handover — CareerSim

## State (2026-08-30, second session: Slice 0 SHIPPED)

**Slice 0 is built, tested, and verified playable end to end in a browser.** The
Cairo phase runs as a static no-build site — Next.js/Supabase/Vercel deliberately
deferred (see docs/DECISIONS.md "Slice 0 build"). What exists and is verified:

- **Engine** (`src/engine/state.js`, `src/engine/engine.js`) — framework-agnostic,
  no DOM: requirement grammar (quintet tiers, person/access/cap/rep/meter/mem, `!`
  negation), capability×affordance option evaluation with `unlockedBy`/`lockedBy`/
  `favoredBy` provenance, 6-band gradient resolution with boost-tilted weights,
  CourtMemory writes + append-only memLog, chronicle lines, effects application
  with clamps, localStorage save/load, two-axis Cairo verdict with memory-reading
  marginalia.
- **Content** (`content/phase1.js`) — 7 nodes, 13 encounters, 3 people (Akhlāṭī,
  Qāsim-i Anvār, Yazdī), 1 artifact, 6 registry plates with provenance captions.
  Every encounter grounded+sourced; the memory-write lint passes (every flag read).
- **UI** (`src/ui.js`, `css/game.css`, `index.html`) — full UI_STYLE_GUIDE
  implementation: Frontispiece ToC, Itinerary with sticky margin column, Folio with
  grounding seals + locked-door display, Seal-and-Line with ink-in animation and
  "will be remembered" announcements, Two-Page Spread + Chronicle codex, gloss
  tooltips, once-per-session onboarding marginalia, 1–9 hotkeys, light+dark
  palettes, mobile reflow, reduced-motion.
- **Tests** (`tools/test-engine.mjs`) — 9 passing via `node --test`, including the
  Chekhov's-gun lint and gating/provenance/gradient checks.

**Verified in browser (this session)**: full run played start→ending on
`http://localhost:7521/CareerSim/` (parent launch config `turkagame-site`, whose
launch.json was fixed to serve the repo root). Confirmed live: unlockedBy shown,
locked options with named requirements, "favored by remembered: …" cross-encounter
memory, forced departure at time 0, reactive Road Home (2 options existed only
because of earlier memories, 1 locked for lack of Yazdī), ending verdict +
marginalia + 8-line chronicle, zero console errors, mobile+light palette.

## What's NOT done

1. **The Slice 0 gate is not fully closed**: needs a cold human playtest (agent
   playthrough ≠ cold reader), and a second contrasting run (e.g. madrasa/Yazdī
   build) played through UI rather than unit tests.
2. Phases II–V don't exist (Slice 1). No contracts, no demand profiles, no
   obligations competing for time yet — Cairo doesn't need them; Isfahan does.
3. Chronicle is read-only; editing + accounts = Slice 2 (do NOT create Supabase
   before then).
4. Content depth: 13 encounters means a 7-season run sees most of Cairo; a second
   run repeats heavily. More Cairo pool depth is cheap once Slice 1's structure
   lands.
5. `khanqah_sama`'s best option needs `limiya>=1` — reachable only via the letters
   path; fine (build texture), noted so nobody "fixes" it as a bug.
6. Not yet pushed to GitHub in this state until the user says push (repo is
   `t3dy/TurkaGame`; GitHub Pages would serve the game at
   `https://t3dy.github.io/TurkaGame/CareerSim/` with no extra config).

## Likely next step

Either (a) user cold-playtests Slice 0 and feedback drives a polish pass, or
(b) Slice 1: Phases II–V thin (see docs/ROADMAP.md — obligations/time competition
in Isfahan, one contract chain, exposure-tier injection, inquisitions, full ending
matrix). Content authoring pattern is established in `content/phase1.js`; engine
should need only small additions (contracts, exposure-tier encounter injection).
