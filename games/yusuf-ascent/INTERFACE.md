---
title: Interface proposals
description: Honest assessment of the current UI across the three prototypes and the portal, and ranked proposals for what to change.
---

# INTERFACE.md — proposals

The graphics question and the interface question are different, and the Three.js skill
pack only answers the first. This is the second: what a person actually does with these
four surfaces, and where the current build gets in their way.

## The current state, honestly

What works:

- **One theme, measured not chosen.** `shared/theme.css` uses the folio's own palette
  (cream, lapis, vermilion, gold), taken from k-means over the painting region, not
  eyeballed. The gold-inside-lapis rule around images is the folio's own frame convention.
- **One card component.** Every element in every prototype opens the same card —
  role, title, rung chip, thumbnail, research text, region label. The player learns it once.
- **Interpretation is visible.** Prototype A's sidebar, Prototype C's marking dialogue and
  the portal all say the rung schema is an argument. That is a UI decision, not a
  disclaimer: it is placed where the player is making the relevant judgement.

What does not:

| Problem | Where | Severity |
|---|---|---|
| No onboarding. The first thing you see in A is a locked door and a term in Arabic script with no indication that the answer is *in the picture*. | Proto A | **High** |
| No way to review what you have found. 41 cards, no journal, no re-open. | A, B, C | **High** |
| Prototype B's controls are discoverable only by reading a 10px hint line. | Proto B | **High** |
| Drag-and-drop is pointer-only — HTML5 DnD has no touch fallback, so C is unplayable on a phone. | Proto C | **High** |
| The three prototypes do not know about each other. Solving A teaches you nothing that B or C can use. | all | Medium |
| No keyboard access. Hotspots are `div`s with click handlers; nothing is focusable or reachable by Tab. | A, C | Medium |
| Card text is fixed-length prose with no "more" affordance, so the deep research is only in the portal. | all | Medium |
| No zoom in A. The folio is fitted to the viewport; several elements (the inscription tablet, the tile roundel) are ~20px tall and effectively unclickable. | Proto A | Medium |
| Explode/drift sliders have no tick at the meaningful values (0 = the painting; 1 = the ladder). | Proto B | Low |
| No loading state anywhere. On a cold cache B shows an empty black stage for a second. | B | Low |

## Proposals, ranked

### I1 — A first-minute that teaches the verb · *highest value*

**Prototype A currently opens on a puzzle whose rules are unstated.** Fix it with the
painting, not with a tutorial overlay:

1. On load, the first door's card is already open, and one non-door element is pre-examined
   with its card shown — demonstrating that clicking returns knowledge.
2. The prompt gains a single line under the term: *"the answer is somewhere in this
   picture."*
3. After two wrong answers on the same door, offer a **narrowing hint** that highlights the
   quadrant rather than the element. The player still has to look.

Cost: an afternoon. It converts the game from "I don't know what it wants" to playable.

### I2 — The commonplace book · *highest value, shared across all three*

Every element examined goes into a **persistent journal** — a scrollable strip of thumbnails
in `localStorage`, shared across A, B and C by element id.

This does four things at once: it gives the player somewhere to review; it makes the
41-element count meaningful rather than a score; it *connects the three prototypes* without
importing code between them (they only share the id namespace, which they already do via
`palace.json`); and it is the right period metaphor — a *jung* or commonplace book is
exactly what a fifteenth-century scholar kept.

Wrap every read/write in try/catch and render correctly with no stored value.

### I3 — Touch parity for Prototype C · *unblocks a whole device class*

Replace HTML5 drag-and-drop with pointer events (`pointerdown`/`move`/`up` + a ghost
element), or fall back to **tap-to-select then tap-a-rung**, which is arguably better on
desktop too and is keyboard-accessible for free. HTML5 DnD gives no touch support and never
will.

### I4 — Prototype B's controls, made visible · *medium*

- Replace the hint line with a **three-state mode strip** that says what each mode does
  (`Station point — the painting is intact` / `Orbit — the palace comes apart` /
  `Climb — travel the ladder`), because the modes are the argument, not just navigation.
- Put a snap detent on the explode slider at 0 and 100 with those labels.
- Add a persistent one-line readout of the invariant: *"from here, the stack is the
  painting"* at station point, greyed elsewhere. It turns a hidden numerical property into
  something the player can feel.

### I5 — Deep zoom in Prototype A · *medium*

The folio is 1588 × 2370 and we display it at ~1000px tall. Add pinch/scroll zoom with the
hotspots scaling along (they are already percentage-positioned, so this is nearly free) and
swap in the higher-resolution sprite for the zoomed region. Fixes the unclickable small
elements and rewards the "look closely" verb the whole design rests on.

Pairs with GRAPHICS.md P3 (sprite quality tier) — same asset work serves both.

### I6 — Keyboard and screen-reader access · *medium, and overdue*

- Hotspots become `<button>` elements with `aria-label` = element title, ordered by rung
  then by area, so Tab walks the palace bottom-to-top.
- Prototype C's tap-to-select (I3) gives keyboard placement for free.
- The portal's grounding tags need text, not just colour: they already carry their name as
  text, which is right — keep it that way and do not "clean it up" into icons.

### I7 — Card depth · *low, do after I2*

Give the card a "more" state pulling the matching entries from `research.json`
(`corpus_evidence` rows whose `used_for` names this element, the lock gloss, the rung
gloss). Right now that material exists and is only reachable in the portal.

### I8 — A single shared shell · *low, defer*

The four surfaces each rebuild their own topbar. A shared header component with the
journal, a link to the portal, and a prototype switcher would be tidier — but the repo's
rule is not to share code across prototypes before two are past a first slice, and these
three are one slice old. **Defer deliberately**; revisit if a fourth surface appears.

## Suggested order

1. **I1** — nobody can play A without it.
2. **I3** — nobody can play C on a phone without it.
3. **I2** — the piece that makes the three feel like one thing.
4. **I4**, **I5** — polish that carries argument.
5. **I6** — should not be last, but is honestly where it sits today.
6. **I7**, **I8** — only if this outgrows prototype status.

## What not to do

- **Do not add a score or a timer.** Prototype C's "41/41 agree with the schema" is
  already the closest this should get, and it is framed as agreement with an argument
  rather than correctness.
- **Do not animate the doors opening.** The Qurʾanic point is that they give way; a swing
  animation would make them mechanical.
- **Do not add a "skip to the answer" button.** `__yusufA.solve()` exists for development
  and should stay in the console, not on the page.
- **Do not put the interpretive disclaimer behind an info icon.** It currently sits next to
  the thing it qualifies. That placement is the honesty.
