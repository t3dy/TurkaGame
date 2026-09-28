# Design Doc: Visual Novel (next vertical slice)

Status: **design only, not started.** This is the first prototype to actually get built,
once the research pipeline has at least one approved manuscript asset to build the slice
around. See [docs/DECISIONS.md](DECISIONS.md) for why VN was picked first.

## Choices, state, and endings — CYOA/RPG mechanics (2026-08-30)

- [games/visual-novel/CHOICES.md](../games/visual-novel/CHOICES.md) — a narrative
  designer's report on 40 branching choices across Ibn Turka's life, each tagged for
  how grounded it is (ATTESTED / PLAUSIBLE-GAP / INVENTED-COMPATIBLE).
- [games/visual-novel/STATE_MODEL.md](../games/visual-novel/STATE_MODEL.md) — the
  mechanics design: an Occult-Quintet skill tree (5 scores) + one flag per choice
  drives a fully-divergent branch structure without requiring one hand-authored
  scene per combinatorial path. Gates table shows where later choices are actually
  narrowed/widened by earlier ones. Endings are computed from final state, multiple
  named endings, the historical outcome is one among several (not privileged).
- [games/visual-novel/choices.json](../games/visual-novel/choices.json) — all 40
  choices encoded as structured data (options, skill effects, flags, gates). This is
  the mechanical *structure* for all 40, built and validated. **The narrative prose
  for each scene is separate, larger authoring work not yet done** — don't conflate
  "the choice graph exists" with "the VN is written."

## Premise

Play through episodes of Ibn Turka's life — the Samarkand and Cairo years abroad
(c. 1387–1408), discipleship under Sayyid Ḥusayn Akhlāṭī, service at the court of
Iskandar Mīrzā (Iskandar Sultan), the three trials, with Bāysunghur as addressee and
commissioner from 1426 — as dialogue and choice scenes rendered over manuscript-sourced
backgrounds and portraiture (real folios where available; period-appropriate curated
scans otherwise, always with a provenance record).

## Why this fits Ibn Turka's story specifically

The biography (see [docs/RESEARCH_BRIEF.md](RESEARCH_BRIEF.md)) already has a three-act
structure: formation abroad (Samarkand 1387, Cairo from c. 1393) → court service under the
princes of Fars, then two successful defenses (c. 1422, 1426) → a third trial (1427) he doesn't
survive, exile, death in legal limbo in Herat in 1432. (The years of the first two are Melvin-Koushki's
timeline and text, but "three trials" is his phrase and he never lists them together, so the mapping is
this project's reading.) A VN doesn't need to invent stakes — it needs to dramatize real, documented
choices (whom to attach to, how much to popularize vs. keep esoteric, how to respond
when a rival colleague moves against you).

## Structural options to decide once building starts

- **Planet–Pearl–Peach as act structure.** The *Mafāḥiṣ*'s own three-part cosmic journey
  (ascend to Planet / descend to Pearl / ascend again through Peach) is a ready-made
  three-act shape that's textually authentic rather than imposed.
- **Branching by inquisition outcome.** Given three trials in the real biography,
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

Not a full episode — one real scene (e.g. the first trial, or arrival at Iskandar
Mīrzā's court), with:
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

## Corrections (2026-09-27)

Per Ted's standing rule (older documents are corrected to the most current information; source:
`TurkaVita/docs/CORRECTIONS_BRIEF.md` and `TURKA_AUDIT.md`):

- "Cairo apprenticeship" and "formation in Cairo" replaced by Samarkand 1387 then Cairo from c. 1393 (row 1).
- "Iskandar Sultan then Bāysunghur" as two successive patrons replaced: Iskandar Mīrzā, then no dated
  Bāysunghur patronage; addressee and commissioner from 1426 (rows 2, 3).
- "Three inquisitions" kept as Melvin-Koushki's "three trials", with years c. 1422 / 1426 / 1427 marked as
  our reading (row 5); "five years of exile" is consistent with the source ("much of the next five years").
- This doc describes the **frozen v1** (`games/visual-novel/`), whose scene text still carries some of the
  older premises: see `games/visual-novel/ERRATA.md`. The current biography-driven game is `TurkaVita/`.
