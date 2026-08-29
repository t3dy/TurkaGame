# Design Doc: Roguelike

Status: **design only, not started.** Stays at this stage until the visual novel slice
proves the asset pipeline works end to end. See [docs/DECISIONS.md](DECISIONS.md).

## Premise (working)

Where EmblemRoguelike (`../EmblemRoguelike/`) runs an overworld + dungeon descent on
Michael Maier's *Atalanta Fugiens* emblems, and DungeonAB (`../DungeonAB/`) runs a
party-based dungeon-crawler with MTG-style drafting, this prototype's natural axis is
Ibn Turka's own **Occult Quintet and its hierarchy** (see
[docs/RESEARCH_BRIEF.md](RESEARCH_BRIEF.md)): kīmiyā (alchemy), līmiyā (talismanry),
hīmiyā (subjugation), sīmiyā (illusionism), rīmiyā (trickery) — five real, period-named
occult disciplines already ordered from most elite/dangerous to most accessible.

## Concept sketch (not locked)

A "descent" structure where each floor/zone is themed to one of the five sciences,
increasing in danger and prestige as you go — mechanically similar to EmblemRoguelike's
alchemical lab-disaster system (furnace ops, chemical dangers) but generalized across
all five sciences rather than alchemy alone. The operation categories documented in
*Boon for the Khan* (putrefactions, suffumigations, endurance rites, sleeper
interrogation, treasure dowsing, predator taming — see
[research/notes/03-the-occult-court.md](../research/notes/03-the-occult-court.md)) are a
strong source for concrete ability/encounter design, reworded rather than quoted.

## Precedent to reuse (pattern, not code)

- EmblemRoguelike's `alchemical_integration.js` / `furnace_system.js` / `disaster_cards.js`
  pattern (materials × heat/ritual-intensity × danger) generalizes well beyond alchemy
  specifically to a "ritual operation" resolution system across all five sciences.
- EmblemRoguelike's `court_economy.js` (multiple courts with independent pricing,
  scarcity, repair cost) is a direct structural precedent for modeling the real Timurid /
  Aqquyunlu / Safavid / Uzbek / Ottoman / Mughal court-culture continuum documented in
  the research brief — could become "which court are you currently serving" as a
  run-level parameter.

## Tech

No-build vanilla JS/canvas, following EmblemRoguelike/DungeonAB conventions. See
[docs/DECISIONS.md](DECISIONS.md).

## Open questions

- Single protagonist (Ibn Turka himself) vs. a generic scholar-adventurer moving through
  a Turka-inspired world — affects how tightly biographical the run structure needs to
  be.
- Whether floors map 1:1 to the five sciences or the five sciences are cross-cutting
  systems (like EmblemRoguelike's furnace ops) layered onto a differently-structured
  descent.
