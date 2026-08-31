---
title: Yūsuf Ascent — design
description: Why the folio was cut the way it was, and why each of the three prototypes takes a different verb.
---

# Design

## The premise, stated once

The painting is famous for being impossible. Stairs turn at angles no stair turns at;
balconies rest on brackets that reach a wall which has already ended; doors open at
heights with no floor near them. The usual move is to call this "dreamlike" and stop.

The load-bearing observation is the second half: **every surface is finished to the same
degree of attention.** Brick, tile, verse, and the one large blank white arch all get the
same care. Incoherent space plus uniform attention is not a painter failing at
perspective. It is a painter declining to use it, because the subject is not a room.

Everything below follows from taking that literally.

## The decomposition

43 elements. Boxes live in `imagelab/data/regions.json`; annotations, rungs and locks in
`build_palace.py`; the merged product is `data/palace.json`, which all three prototypes
and the portal read. There is no per-prototype element list, so **"every element is
interactable" is a property of the data, not a promise each build has to keep.**

Two of the 43 are whole-folio frames (`folio-full`, `architecture-full`). They are
browsable but never puzzle targets, which leaves 41 pieces in play.

### The seven rungs

| Rung | Name | What lands there |
|---|---|---|
| 0 | Mulk | brick wall, street door, portal, dado, foot verses |
| 1 | Threshold | the iwan, its door, spandrel band, both star-tile fields |
| 2 | Barzakh | both stair flights, the landing, the stairhead door, the chamber sill |
| 3 | ʿĀlam al-khayāl | the lapis court, green door, upper doors, cartouches, revetments |
| 4 | Malakūt | the red balcony, its door, the muqarnas eaves, the brackets, the turret |
| 5 | Jabarūt | the chamber, the white arch, Yūsuf, Zulaykha |
| 6 | Lāhūt | the cupola, the inscribed cornice, the upper verses, the flame-halo |

The terms come from the corpus with page references (see `data/research.json` →
`corpus_evidence`). The **assignment** is ours. That distinction is stated in the portal,
in Prototype A's sidebar, and in Prototype C's marking dialogue, because it is the
difference between a research toy and a research-flavoured one.

### The eight doors

Seven form the chain, outermost first: street → iwan → under-stair → muqarnas →
stairhead → green → upper. The eighth, the balcony door, is a **blind and stays shut.**
A game about a picture of impossible architecture should not quietly make it possible.

## Prototype A — The Seven Doors

**Verb: look.**

The folio itself is the playfield. Click anything and get a research card. Seven doors
are locked; each is inscribed with a term, and opens when you click the element of the
painting that embodies that term.

The design problem was that a quiz over a picture is not a puzzle about the picture. The
fix is that **every lock's answer is a visual observation, not a fact you could look up**:

- *mulk* → the brick wall, because it is the only ordinary material in the folio.
- *barzakh* → the stair, because a stair belongs to neither storey it joins.
- *malakūt* → the brackets, because they are carried on nothing.
- *nūr* → the flame-halo, because it is the only light in a picture with no light.

You solve it by noticing things about the painting. The cards contain the vocabulary; the
painting contains the answers. That is the loop.

Grounded in: Q 12:23 (the doors are locked from inside and open anyway), and Jāmī, where
Yūsuf's pointing finger works as the key.

## Prototype B — The Impossible Stack

**Verb: move.**

The mechanism, stated as one rule:

> Every element is a flat quad whose depth is its cosmological rung, not its perspective.
> To keep the picture intact, each quad's position and size are scaled about the **station
> point** by `k = (D − z) / D`. Under that compensation, a perspective camera sitting
> exactly at the station point projects the exploded stack onto the *identical image* as
> the flat painting — at any explode value.

So the picture is not a picture. It is a solid that coheres from exactly one place to
stand. Step off that point by a degree and the palace falls apart into seven strata. The
argument the painting makes about ascent is restated as a **projection property** rather
than illustrated.

This is verifiable, not just asserted: `__yusufB.checkStationInvariant()` measures the
worst screen-space displacement between explode = 0 and explode = 1 across all 41 panels.
It currently reads `1.2e-16` against a tolerance of `1.5e-3` — exact to floating point.

Other decisions:

- **No lights.** Every material is `MeshBasicMaterial`, because the folio has no modelled
  light anywhere. The single exception is the flame-halo, which is additively blended: the
  only light source in the picture is the only light source in the scene.
- **The page stays.** The whole folio sits behind everything as a plate, receding *past*
  the deepest rung as you explode. At rest it fills the gaps the 41 crops do not tile; in
  motion it reads as the substrate the strata lifted off. Clicking it returns the card for
  the folio itself.
- **Painter's order, not depth jitter.** At explode = 0 all 41 quads are coplanar; a fixed
  per-index polygon offset resolves them in area order rather than z-fighting.
- **Drift** spreads panels laterally within a rung. It deliberately breaks the
  station-point invariant — it is the "and now look what you gave up" control.
- **Camera contract** is declared at the top of `app.js`: perspective, fov 34, owned by
  the scene; three position modes; one lerp/slerp stage per handoff, with no follow
  smoother stacked on top of a transition.

## Prototype C — The Ladder

**Verb: argue.**

The picture handed back as 41 loose tiles; place each on the rung it belongs to; mark
yourself against our schema. Marking deliberately opens a card saying the schema is an
argument and asking whether the painting supports you better than it supports us.

This is the fastest of the three to grasp and the only one where the interpretive claim
is the *subject* rather than the frame. It is also the cheapest place to test whether the
rung assignments are any good, because a player's disagreements are legible data.

## Descent

The corpus contains a specific correction to the ascent-only reading: Ibn Turka's retort
to Suhrawardī demands sensorial **descent** (*tanzīl*) too, for a total system, not just
ascent (Melvin-Koushki, *Ibn Turka's Pythagorean Sensorium*, 2).

Prototype B honours this by letting the camera go anywhere, including below and behind.
Prototypes A and C currently do not — A's door chain runs one way only, and C's ladder is
scored, not traversed. **This is a known gap, not a considered omission.** The obvious
next slice is a descent pass in A: having reached the chamber, carry something back down
through the same seven doors, where each door now asks a different question.

## As a dream encounter

If this is dropped into the career sim, the framing that makes it fit rather than merely
run inside it is *khalʿ* — doffing the body. The corpus is explicit: one who can doff the
body and reject the senses ascends, and on that account is not a philosopher until able to
do so (*Mir Damad's On Doffing*, 15). Suhrawardī adds that the path is necessarily
traumatic, and names talismans as engines of ascent (ibid., 14).

So the encounter is not "Ibn Turka has a strange dream." It is a technique he is
attempting, with a cost. Which suggests, if it is ever wired in:

- The encounter is **triggered by a study or retreat action**, not by sleeping.
- It **costs** something on the way out — the sources say the ascent is traumatic, so a
  clean reward would misrepresent them.
- What is carried back is a **term**, not an item: the seven door-concepts are exactly the
  vocabulary the career sim's lettrist track already trades in.

None of that is built. It is written down here so the framing is not re-derived from
scratch later, per this workspace's rule about mid-session decisions.

## Known gaps

- No descent pass (above).
- The verse cartouches are treated as texture, not as text. Nobody here has read them.
  This is the single biggest hole: the inscriptions are the part of the picture recent
  scholarship finds most interesting, and we have them only as JPEGs.
- The seven-doors-to-seven-chambers correspondence with Jāmī has not been checked against
  a source that counts them. It is suggestive, not established.
- Prototype B's rung-colour debug mode leaves the backdrop textured, which is correct but
  visually confusing at first glance.
- No audio, no mobile-touch drag in Prototype C (HTML5 drag-and-drop is pointer-only).
