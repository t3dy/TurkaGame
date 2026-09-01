---
title: Yūsuf Ascent — decisions
description: Implementation-level choices for the minigame, with rejected alternatives. Project-level entries are in docs/DECISIONS.md; direction changes are in docs/PIVOTS.md.
---

# Yūsuf Ascent — decisions

Detail too fine for [`docs/DECISIONS.md`](../../docs/DECISIONS.md), kept so a later session
does not re-litigate it by drift. Direction changes live in
[`docs/PIVOTS.md`](../../docs/PIVOTS.md).

## Decomposition

### 43 elements, drawn by eye, at three levels of granularity

**Decision.** The folio is cut into 43 regions: 2 whole-folio frames, 8 doors, and 33
surfaces, figures, ornaments and text panels — deliberately at mixed scale, so that
`the-chamber` and `yusuf-halo` both exist even though one contains the other.

**Rationale.** The picture argues at more than one scale. A decomposition that only cut at
one level would lose either the flame-halo (too small) or the chamber (too large), and both
carry locks.

**Consequence.** Regions overlap. Prototype A sorts hotspots by area with doors last, so
the small important things sit above the large containers they are inside. Prototype B uses
a fixed per-index polygon offset in painter order rather than depth jitter, because at
explode 0 all 41 quads are coplanar.

### The rung terms are real; the assignment is ours

**Decision.** Seven rungs — mulk, threshold, barzakh, ʿālam al-khayāl, malakūt, jabarūt,
lāhūt. Five carry a corpus citation with a page reference; two (jabarūt, lāhūt) are tagged
FIELD because they are standard in the series but **not attested in this project's corpus**.
The "threshold" rung is tagged INTERPRETATION outright: it is a staging rung the game
invented to separate the street from the stair.

**Rationale.** Mixing a grounded term with an invented one and presenting them identically
is the failure this project exists to avoid. The tiers are visible in
`data/palace.json → grounding_kinds` and on every card.

**Rejected alternative.** Four rungs (nāsūt/malakūt/jabarūt/lāhūt), which is the more
standard series. Seven was chosen to match Jāmī's seven chambers and the seven-door chain —
which is itself a design convenience, and is labelled as one.

## The door puzzle

### Locks are answered by visual observation, not by recall

**Decision.** Each of the seven doors is inscribed with a term and opens when the player
clicks the element of the painting that embodies it. Every answer is something you can
*see*, not something you could look up:

| Door | Term | Answer | Why it is the answer |
|---|---|---|---|
| street | *mulk* | the brick wall | the only ordinary material in the folio |
| iwan | *naqsh* | star tile field | a pattern with no edge of its own |
| under-stair | *barzakh* | the lower flight | belongs to neither storey it joins |
| muqarnas | *muqarnas* | the eaves | geometry for shapes that do not meet |
| stairhead | *khayāl* | the lapis court | wall, garden and page at once |
| green | *malakūt* | the brackets | carried on nothing |
| upper | *nūr* | the flame-halo | the only light in a lightless picture |

**Rationale.** A quiz over a picture is not a puzzle about the picture. If the answers were
facts, the painting would be wallpaper behind a vocabulary test. Because they are
observations, the cards supply the vocabulary and the *picture* supplies the answers, which
makes looking the actual verb.

**Rejected alternative.** Multiple-choice questions attached to each door (fast to build,
turns the folio into decoration); a matching game on ornament motifs (would need visual
matches the picture may not actually contain — inventing evidence).

### The eighth door is a blind and stays shut

**Decision.** Eight openings in the folio read as doors. Seven form the chain; the balcony
door cannot be opened, ever, and says so when clicked.

**Rationale.** A game about a picture of impossible architecture should not quietly make it
possible. The balcony door is painted on a plane with nothing behind it — making it a
passage would be the game correcting the painting.

## Prototype B specifics

### Camera contract, declared at the top of the file

**Decision.** Perspective, fov 34, near 0.1, far 400, owned by the scene; three position
modes (station-locked / orbit-offset / an authored climb path); world +Y up, never
recomputed; one lerp/slerp stage per handoff with **no follow smoother stacked on top**.

**Rationale.** Straight from `threejs-camera-direction`'s non-negotiables. The stacked-smoother
rule in particular prevents the mid-transition half-halt that is otherwise very hard to
diagnose.

### Drift deliberately breaks the invariant

**Decision.** The "drift" slider spreads panels laterally within a rung, which **does not**
preserve the station-point projection. It defaults to 0.

**Rationale.** It is the "and now look what you gave up" control. The invariant test zeroes
it before measuring, and says so in a comment, because a self-test that quietly disables
the thing it is testing is worse than no test.

### The page stays, behind everything

**Decision.** The whole folio sits as a plate behind the deepest rung at every explode
value, receding as the strata lift.

**Rationale.** At rest it fills the gaps the 41 crops do not tile, so the recomposition is
complete rather than gap-toothed. In motion it reads as the substrate the strata came off.

**Bug this fixed.** The first version placed it at a shallow fixed depth, so at explode 1
most panels were *behind* it — which looked plausible in a screenshot and was wrong. Caught
by querying z-positions, not by looking. See [`docs/PIVOTS.md` P5](../../docs/PIVOTS.md).

## Prototype C specifics

### Marking opens an argument, not a score screen

**Decision.** "Mark" reports agreement with the schema and immediately opens a card saying
the schema is an argument and asking whether the painting supports the player better than
it supports us.

**Rationale.** This is the only one of the three prototypes where the interpretive claim is
the *subject* rather than the frame, and a bare score would flatten that back into a quiz.
A player's disagreements are also the cheapest available data on whether the rung
assignments are any good.

**Rejected alternative.** A timer, a leaderboard, or any framing where 41/41 is "winning".

## Cross-cutting

### `?v=N` on every local import, bumped on every content change

**Decision.** Every module and stylesheet import carries a version query, currently `v=2`,
bumped whenever the data or the shared code changes.

**Rationale.** `python -m http.server` sends no cache-control headers, and this project has
been bitten twice by browsers serving stale JS across navigations. It is a standing
discipline here, not a one-time fix. Verifying against a stale bundle wastes more time than
the convention costs.

### `await img.decode()` was removed, not worked around

**Decision.** Prototype A no longer awaits `img.decode()` before building hotspots.

**Rationale.** It never settles in a hidden or throttled tab, which silently hung the whole
boot when the page was opened in a background tab — nothing thrown, nothing logged, just no
hotspots. Hotspots are positioned in percentages and never needed the decoded dimensions.

**Rejected alternative.** Racing it against a timeout, which keeps a dependency that was
never real.

## What was considered and not built

- **A descent pass.** The corpus is explicit that Ibn Turka's own correction to Suhrawardī
  demands descent (*tanzīl*) as well as ascent. Prototype B lets the camera go anywhere;
  A and C run one way only. This is a **known gap, not a considered omission** —
  `DESIGN.md § Descent` names the obvious next slice.
- **Reading the verse cartouches.** They are treated as texture. Nobody here has read them,
  and recent scholarship finds them the most interesting part of the folio. The single
  biggest hole in the research.
- **Wiring the dream-encounter hook into the career sim.** The framing is written up in
  `DESIGN.md § As a dream encounter` — triggered by study, not sleep; costs something on
  the way out; what is carried back is a *term*, not an item — but nothing is built. Written
  down so it is not re-derived from scratch later.
