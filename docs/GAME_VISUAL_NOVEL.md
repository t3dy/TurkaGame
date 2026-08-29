# Design Doc: Visual Novel (next vertical slice)

Status: **design only, not started.** This is the first prototype to actually get built,
once the research pipeline has at least one approved manuscript asset to build the slice
around. See [docs/DECISIONS.md](DECISIONS.md) for why VN was picked first.

## Premise

Play through episodes of Ibn Turka's life — Cairo apprenticeship under Sayyid Ḥusayn
Akhlāṭī, rise at the Timurid court under Iskandar Sultan then Bāysunghur, the three
inquisitions — as dialogue and choice scenes rendered over manuscript-sourced
backgrounds and portraiture (real folios where available; period-appropriate curated
scans otherwise, always with a provenance record).

## Why this fits Ibn Turka's story specifically

The biography (see [docs/RESEARCH_BRIEF.md](RESEARCH_BRIEF.md)) already has a three-act
structure: mentorship and formation in Cairo → two successful court defenses under two
different patrons → a third accusation he doesn't survive, five years of exile, death in
legal limbo. A VN doesn't need to invent stakes — it needs to dramatize real, documented
choices (which patron to court, how much to popularize vs. keep esoteric, how to respond
when a rival colleague moves against you).

## Structural options to decide once building starts

- **Planet–Pearl–Peach as act structure.** The *Mafāḥiṣ*'s own three-part cosmic journey
  (ascend to Planet / descend to Pearl / ascend again through Peach) is a ready-made
  three-act shape that's textually authentic rather than imposed.
- **Branching by inquisition outcome.** Given three inquisitions in the real biography,
  a natural branch point structure: two survivable crises with real choices about how to
  defend yourself (call in patron favor? out-argue the accusers? compromise your
  teaching?), building toward the third, non-survivable one — player choices earlier
  should visibly shape how the ending lands, not whether it happens.
- **Dual protagonist option**: the "Dr Dee's Ottoman Adventure" counterfactual framing
  (source #1) suggests a possible frame-story device — a later or parallel Western
  occultist (Dee-coded, not literally Dee) encountering Ibn Turka's legacy — but this
  adds scope and should only be pursued after the core biography slice works.

## Engine

Leaning **no-build vanilla JS/DOM**, closest to EmblemNovel's existing scene engine
(`../EmblemNovel/`) — check whether that engine can be forked/adapted before writing a
new one from scratch. Confirm this choice when the slice actually starts; see
[docs/DECISIONS.md](DECISIONS.md).

## What "slice 1" means here

Not a full episode — one real scene (e.g. the first inquisition, or arrival at Iskandar
Sultan's court), with:
- At least one real, provenance-tracked manuscript image as background or portrait.
- A working dialogue/choice engine (even if content is a placeholder beyond the one
  scene).
- Save/resume via localStorage, matching the pattern used elsewhere in this workspace.

## Open questions to resolve before or during slice 1

- Full engine choice (fork EmblemNovel vs. new) — needs a look at EmblemNovel's actual
  code, not just its README, before deciding.
- Whether portraits are period manuscript miniatures (if any survive depicting relevant
  figures) or abstracted/symbolic representations — Islamicate manuscript painting
  conventions around figural depiction vary by period/region/genre and should be
  researched, not assumed, before committing to a visual approach.
