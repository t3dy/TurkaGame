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
