# Kickoff Decisions (2026-08-29)

Recorded at project init so later sessions don't re-litigate them. Overturn any of these
deliberately, not by drift.

## Sequencing
**Research pipeline first.** Build a real, working asset-provenance pipeline and research
brief before writing game code. Games are downstream consumers of a working asset library,
not the other way around.

Once the pipeline is solid: **visual novel is the first vertical slice.** Roguelike and
career-sim stay at design-doc stage until the VN slice is playable end to end. Reasoning
at the time: VN is the closest fit to existing patterns in this workspace (EmblemNovel's
scene engine already does dialogue/choice-over-art), so it's the fastest path to a real,
testable slice — which validates the asset pipeline against a real consumer before
committing to the heavier systems work the roguelike and career-sim both need.

## Asset sourcing
**Manual curation with provenance**, not scraping or AI-generated pastiche. Every asset
gets an institution, shelfmark, and rights note before it's usable — see
[assets/schema/asset-provenance.schema.json](../assets/schema/asset-provenance.schema.json).
Slower, but citation-safe, and matches the provenance-record pattern already established in
the 3dprintlab project.

## Tech stack
**Mixed per prototype**, not one framework forced across all three:
- Visual novel: leaning no-build vanilla JS/DOM (cheapest to iterate, closest to
  EmblemNovel's existing engine) — confirm when the slice actually starts.
- Roguelike: no-build vanilla JS/canvas, following EmblemRoguelike/DungeonAB conventions —
  those two projects have already solved the "no-build browser roguelike" problem in this
  workspace; reuse the pattern, not necessarily the code.
- Career-sim: likely needs real persisted state (skill trees, patron relationships, a
  timeline of decisions) — Next.js is the more probable fit here, following
  AlchemyBoardGame's precedent, but this is not locked in since the career-sim hasn't
  reached design lock yet.
- Site: plain static HTML for GitHub Pages. No framework needed for a showcase page.

## Repo
`t3dy/TurkaGame` already existed (created 2026-08-29) with placeholder description
"Islamicate Chill Pills: The Video Game." Left as-is — not changed without asking.

## IslamicateOccultPortal (2026-08-30)

A broader DH research portal, `C:\Dev\IslamicateOccultPortal`, was created as a
**new sibling project** rather than folded into TurkaGame's own `research/` — matching
the pattern of this workspace's other knowledge portals (WitcherPortal,
IlluminatusPortal): SQLite source of truth, Python static-site generator, vanilla
HTML/CSS/JS. TurkaGame's own research/ was NOT migrated into it; the two stay
separate, cross-linked via a `game_connections` table in the portal's DB and pointers
in this file's CLAUDE.md. Reasoning: TurkaGame is a game-prototypes workspace, the
portal is the general Islamicate-occult-world research project — Ibn Turka's own
story is one figure within a much larger corpus (Brethren of Purity, al-Buni,
lettrism generally) that has its own DH-portal-shaped audience independent of any
game.

The portal also became the home for **the image catalog** — a research index of
every manuscript/portrait/diagram image referenced or extracted from the scholarly
sources (including TurkaGame's own 3 papers), separate from this project's
`assets/manuscripts/registry.json` (which only tracks images already cleared and
copied for actual game use). See `../IslamicateOccultPortal/CLAUDE.md`.

## VN mechanics: CYOA + RPG hybrid (2026-08-30)

Following up [games/visual-novel/CHOICES.md](../games/visual-novel/CHOICES.md) (40
branching life-choices), four mechanics decisions:

- **State system: Occult Quintet skill tree only.** No separate inventory or
  relationship-meter UI for now — bonds and objects (the autograph manuscript, the
  Yazdi/Qasim-i Anvar relationships) are tracked as flags, not visible meters/items.
  Can be upgraded later (a meter is just a flag with more states) without
  restructuring, if playtesting shows the invisible version under-communicates
  consequence.
- **Branch topology: fully divergent, not branch-and-reconverge.** Made tractable by
  a flag/skill state model rather than literal per-combination scene authoring — see
  [games/visual-novel/STATE_MODEL.md](../games/visual-novel/STATE_MODEL.md).
- **Slice scope: all 8 acts, all 40 choices** — not staged by act. This is a real
  scope commitment; the mechanical structure for all 40 is built
  ([games/visual-novel/choices.json](../games/visual-novel/choices.json)), but full
  narrative prose for each choice/scene is a separate, larger authoring task still
  to come. Don't let "the choice graph is done" get reported as "the VN is done."
- **Endings: multiple, historical outcome is one among several**, not privileged —
  matches the "choices he might have made differently" framing directly. ~7 named
  endings sketched in STATE_MODEL.md, exact selection logic not yet implemented in
  code.

## Prototype build (2026-08-30)

Following the CYOA/RPG mechanics decisions, four more decisions to actually start
building:

- **Prototype scope: full skeleton, all 8 acts, thin prose.** Wire the whole engine
  to all 40 choices with lightweight placeholder scene text, proving the entire
  state/skill/gate/ending system in one pass, rather than a smaller, more-polished
  slice on one or two acts. Built and verified — see `games/visual-novel/README.md`.
- **Engine: forked EmblemNovel's pattern**, not built from scratch. Reused the
  state.js/scenes.js/main.js shape (small, no-build, localStorage saves), extended
  with the 5-score skill tree and gate-checking `choices.json` needs.
- **Asset source: OCCULTIMGDB primary.** A separate, pre-existing project
  (`C:\Dev\OCCULTIMGDB`) turned out to already have 136 rights-cleared Islamicate
  images across 14 works — used instead of (not merely alongside) TurkaGame's own
  research pipeline or IslamicateOccultPortal's mostly-unverified image catalog for
  actual game assets. 8 images pulled and registered into this project's own
  `assets/manuscripts/registry.json` with real provenance from OCCULTIMGDB's own
  citation records. IslamicateOccultPortal's catalog remains the place to look for
  period-specific leads OCCULTIMGDB doesn't have (e.g. the Ṭahawī Circle at Tehran MS
  10196).
- **Image role: backdrops and diagrams only, no invented character portraits.**
  Manuscripts don't depict Ibn Turka's face and Islamicate figural-depiction
  conventions vary by genre/period — the VN uses one real manuscript/diagram/object
  image as a backdrop per act (8 total), never an invented portrait.

## Open items flagged at kickoff, not yet resolved
- Only 3 of an expected 4 research PDFs were found in Downloads (see
  [docs/RESEARCH_BRIEF.md](RESEARCH_BRIEF.md) Sources section). Confirm whether a 4th is
  still coming.
- No manuscript images have been sourced yet — the first concrete lead is Tehran, Majlis
  Library MS 10196 (holds Ibn Turka's own *Mafāḥiṣ* autograph), cited directly in the
  Pythagorean Renaissance paper. Not yet verified as digitized/accessible.
- Full 7-tier epistemic hierarchy (traditionist literalism → lettrism) referenced in the
  Pythagorean Renaissance paper is sourced to a different Melvin-Koushki article
  ("Selenocentrism and Heliocentrism") not currently in hand — needed before the
  career-sim's skill-tree design can be finalized.
