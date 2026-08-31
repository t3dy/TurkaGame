# Handover — CareerSim

## State (2026-08-30, third session: SLICE 1 SHIPPED — the whole life is playable)

**All five phases play end to end as a static no-build site**, verified in-browser.
Supabase/Vercel still deliberately deferred (docs/DECISIONS.md "Slice 0 build").

Run it: serve the repo root (`turkagame-site` launch config) → `/CareerSim/`.

### What exists

- **Engine** (`src/engine/`) — framework-agnostic, no DOM:
  - `state.js` — meters/reputations/quintet/people/access/artifacts/memory + memLog,
    obligations, contracts, expectation; requirement grammar (quintet tiers,
    `person:`/`access:`/`cap:`/`rep:`/`meter:`/`expectation:`/`mem:`, `!` negation);
    effects with clamps; localStorage save (v2 schema).
  - `engine.js` — capability×affordance option evaluation with
    `unlockedBy`/`lockedBy`/`favoredBy` provenance; phase + exposure gating;
    6-band gradient resolution with boost tilt; CourtMemory writes; chronicle lines
    tagged by phase.
  - `career.js` — **exposure tiers** (Unremarked→Summoned; rises, never resets),
    **obligations** (recurring time drains + neglect penalties), **contracts**
    (deadline, reward, failure, expectation inflation, and `settleContracts` at
    phase end), the **two-axis ending matrix** (6 personal fates × 6 system fates),
    and `LEGACY_NOTES` — the ~150-entry marginalia table that reads the run's whole
    memory back to the player.
- **Content** (`content/`) — **58 encounters across 5 phases**, 20 registry plates,
  11 people, 6 artifacts. Every encounter grounded (ATTESTED / PLAUSIBLE-GAP /
  INVENTED-COMPATIBLE) + sourced. `people.js` holds the shared cast; `index.js`
  aggregates; each `phaseN.js` is content-only, no logic.
- **UI** (`src/ui.js`, `css/game.css`) — full UI_STYLE_GUIDE set: Frontispiece,
  **Phase Intro**, Itinerary, Folio, Seal-and-Line, **Colophon**, Two-Page Spread,
  phase-grouped Chronicle codex; margin column now shows exposure tier, obligations
  and open promises (urgent in vermillion); **turn-report banner** narrates what the
  office/deadlines cost each turn; glosses, onboarding marginalia, 1–9 hotkeys,
  light+dark, mobile reflow, reduced-motion.
- **Assets** — 8 new images registered through `research/scripts/register_asset.py`
  from OCCULTIMGDB (registry now **27 entries**), chosen per phase: Abū Maʿshar
  nativity figure (II), square Kufic Bismillah / Safavid illuminated folio /
  "Caesar Makes a Talisman" / zodiac-and-lunar-mansions map (III), Persian 6×6 wafq
  (IV), Hārūt and Mārūt at Babel + Hilye (V). All rights-cleared, full provenance.
- **Tests** (`tools/test-engine.mjs`) — **18 passing** via `node --test`, including
  the Chekhov's-gun memory lint (now reads `LEGACY_NOTES` directly), phase/exposure
  gating, obligation charging, contract delivery/failure/settlement, the
  historical-trajectory reachability check, and a lint that **every plate image
  exists in the provenance registry**.

### Verified in-browser this session

Full fresh run through all 5 phases → ending. Confirmed live: phase intro and
colophon screens; the judgeship charging a second season per action with the
"⚖ The Judgeship took its season" banner (and "went unserved" when time ran out);
a bold commission opening in PROMISES with a countdown and failing at its deadline;
Samarkand locked without Yazdī; exposure tier labels; ending two-axis verdict with
34 marginalia lines and a 29-line phase-grouped chronicle. Two contrasting runs give
materially different verdicts — bold: **Source Code of Empire**; cautious:
**synthesis 10 / transmission 1 → Died With Its Author**. Mobile 375px + light
palette clean, no horizontal scroll, zero console errors.

**Bug found by playing and fixed**: an open contract could outlive its phase and
silently evaporate (promise made, no consequence ever). `settleContracts` now
resolves every open commission at phase end and the colophon reports it.

## What's NOT done

1. **No cold human playtest yet.** Agent playthroughs are not a cold reader; pacing,
   difficulty and legibility all still unvalidated by a person.
2. **The personal-fate axis is under-differentiated.** Both test runs landed on
   "The Judge of Isfahan" because `MAN_FATES`' `judge` test (orthodox≥2 +
   kept_judgeship) catches broadly. The system axis diverges well; the man axis
   needs tuning passes — likely tighter tests and 2–3 more fates.
3. **Contradictory marginalia can co-fire** (e.g. "taught widely" and "held the
   hardest parts close" both true across different phases). Realistic, but reads
   oddly; consider precedence rules.
4. **Phase I has 14 encounters, Phases IV–V have 9** — later phases are thinner and
   a run sees most of them. Pool depth is the cheapest next content work.
5. **Composition workbench and synthesis cosmogram** (ROADMAP Slice 3) not built —
   Phase IV represents composition as choices, not as an assembly UI.
6. **Chronicle is read-only**; editing + accounts = Slice 2 (do NOT create Supabase
   before then).
7. Not pushed to GitHub in this state until asked. Pages would serve it at
   `https://t3dy.github.io/TurkaGame/CareerSim/` with no extra config.

## Likely next step

Either (a) cold playtest → tuning pass on the issues above, or (b) ROADMAP Slice 3
(composition workbench, cosmogram). Before more content, fix #2 — the ending is the
payoff and the man axis currently under-delivers on it.

Debug handle: `window.__turkaCS` — `.state`, `.restart()`, `.skipTo(phase)`,
`.grant({quintet:{rimiya:2}})`.
