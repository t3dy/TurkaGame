---
title: Graphics proposals
description: How to raise the visual quality of Yūsuf Ascent, routed through the Three.js Awesome Graphics Agent Skills pack. What we already comply with, what to build next, and what to refuse.
---

# GRAPHICS.md — proposals

Consulted: [`scottstts/Threejs-Awesome-Graphics-Agent-Skills`](https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills)
(24 skills; the pack is installed locally in `~/.claude/skills/`). Routed via
`threejs-skill-router` with the actual visual target: *~43 flat textured panels that
recompose exactly into a Persian miniature from one station point and stratify into seven
levels when you move; painterly, flat, gold-leaf, no realistic lighting.*

The router returned three skills and, importantly, **declined the rest**:
`threejs-camera-direction` (projection ownership and mode handoff),
`threejs-procedural-animation` (authored transition phases),
`threejs-visual-validation` (deterministic evidence). It routes *away* from
`procedural-materials`, `shadow-systems`, `atmosphere`, `SSAO`, `bloom` and
`exposure-color-grading` for this subject, and that refusal is the single most useful
thing it said.

## Why the pack's default answers mostly do not apply here

The pack's core rule is *"do not route 'make it beautiful' to post-processing; find the
missing authored system."* For this project there is a stronger version:

> **The reference has no light in it.** There is no modelled illumination anywhere in the
> folio — no cast shadow, no falloff, no specular. Adding PBR, bloom, GTAO or tone mapping
> would not be enhancement; it would be a category error about the source. The one light
> in the picture is Yūsuf's flame-halo, and it is *ontological rank rendered as gold*, not
> optics.

So the correct target is not "more realistic." It is **"more like an illuminated
manuscript, by mechanism rather than by filter."** Everything below is chosen against that.

## What we already comply with

The pack's acceptance gate requires five things of any routed system. Prototype B's
current state against it:

| Gate | Status |
|---|---|
| Deterministic / reproducible inputs | ✅ No `Math.random` anywhere. Per-panel drift is `hash32(node.id)` (FNV-1a). |
| Visual debug modes for controlling fields | ✅ Rung colours, panel edges. **Gap:** no depth or overdraw view. |
| Parameters grouped by perceptual role | ⚠️ Partial. `explode` and `drift` are exposed; `RUNG_GAP`, `FOV`, `LIFT`, `STATION_D` are module constants. |
| Mechanism-backed quality tier | ❌ **Missing.** No resolution or texture tier at all. |
| A no-post baseline that still reads | ✅ Trivially — there is no post. The baseline *is* the final image. |

Plus the camera skill's non-negotiables: projection is owned and updated on every aspect
change; transitions use one lerp/slerp stage with no follow smoother layered over them;
smoothing is frame-rate independent (`1 − exp(−λ·dt)`). All satisfied.

And one thing the pack asks for that we did better than asked: the visual contract is
**numerically testable**. `__yusufB.checkStationInvariant()` measures worst-case
screen-space drift across all 41 panels between explode = 0 and explode = 1; it returns
`1.2e-16` against a `1.5e-3` tolerance. That is `threejs-visual-validation`'s "fixed-view
visual contract" idea applied to a projection property rather than to a screenshot.

---

## Proposals, ranked

### P1 — Gold as a material behaviour, not a colour · *high value, low risk*

**Problem.** Gold in the folio is leaf: it is flat under diffuse light and flares when the
page turns. Right now it is just orange pixels in a JPEG, so the illuminated quality is
lost the moment the panels move.

**Proposal.** Author a **gold mask** per element (offline, from the sprite: high-value +
low-saturation-variance + within the measured gold hue band) and store it in the alpha
channel of a companion texture. In the shader, add a view-dependent term driven only by
the angle between the panel normal and the view vector — no light, no PBR:

```
gold = mask * pow(1 - abs(dot(N, V)), k)
colour = base + gold * goldTint
```

Because every quad is flat and faces the same way at rest, this does **nothing** at the
station point — the picture is unchanged — and blooms exactly as the strata rotate away.
The mechanism is the source's own: leaf catches light when the plane turns.

Routes to: `threejs-procedural-materials` (authored PBR identities, derivative normals),
but only the "custom direct-light modulation" part of it. Do not import the soil/moss/glass
apparatus.

### P2 — A depth-of-field that is a *page* effect, not a lens effect · *medium value*

**Problem.** In the exploded view, seven strata at 2.0 world units apart read as flat
cutouts because nothing separates them but occlusion.

**Proposal.** Not a camera DOF. A **per-rung veil**: each stratum behind the focused one
gets a slight desaturation and a lift toward the paper cream, exactly as pigment reads
through a sheet of laid paper. Drive it by `rung_n` distance from the focused rung, not by
z-distance from the camera, so it stays a statement about the *ladder* rather than about
the lens. One uniform per panel; no post-process pass; still no lights.

This is the pack's "one strong inspectable visual rule over several independent noise
layers" applied literally.

### P3 — Sprite quality tier · *required by the acceptance gate*

**Problem.** No quality tier exists. Every element is a single 820px JPEG, 2.8 MB total.
On a phone that is wasteful; at close orbit it is soft.

**Proposal.** Cut each region at three widths (410 / 820 / 1640) in
`imagelab/scripts/cut_regions.py`, pick by
`min(devicePixelRatio, 2) × projected screen size at the station point`, and load the tier
lazily as the camera dollies in. The mechanism is the pack's "pixel-footprint LOD": a
panel that occupies 40 screen pixels never fetches 1640.

Ship the 1640 tier only for the ~8 elements a player actually gets close to (the chamber,
Yūsuf, the halo, the doors).

### P4 — The muqarnas as real geometry · *high value, high effort, do last*

**Problem.** `muqarnas-eaves` is the answer to a lock about *transition* — the geometry
for joining shapes that do not meet. It is currently a flat photograph of a transition.

**Proposal.** Build the eaves as actual muqarnas: a tiered subdivision generated from a
2D cell plan, with the folio's own painted cells as the texture atlas. It is the one
element in the picture whose *meaning is its construction*, so it is the one element worth
modelling rather than cutting out.

Routes to: `threejs-procedural-architecture` (profiles, ornaments, material-slot mesh
compilation).

Gate this behind P1–P3. It is a week of work and the payoff is one element.

### P5 — Deterministic evidence set · *cheap, do alongside P1*

**Proposal.** Follow `threejs-visual-validation`: three fixed camera poses (station,
orbit-35°, climb-mid) × three explode values (0, 0.5, 1) × two debug modes, rendered
offscreen to a 3×3 mosaic and diffed against a committed baseline. Catches exactly the
class of bug that shipped in this session's first pass — the backdrop plate sitting *in
front of* the exploded strata, which looked plausible in a single screenshot and was wrong.

Add the station-point invariant to the same harness so it runs on every change, not only
when someone remembers to call it in the console.

---

## Explicitly refused

| Suggestion | Why not |
|---|---|
| PBR materials, roughness/metalness maps | The source has no modelled light. This would invent optics the painting refuses. |
| Bloom on the flame-halo | The halo is already additive. Bloom would make it a lamp; it is a rank marker. |
| GTAO / contact shadows between strata | Would imply the strata are physically stacked objects. They are levels of being. |
| Tone mapping + LUT grading | The palette is *measured from the folio* (`imagelab/data/images.json`). Grading it means grading Bihzād. `toneMapped: false` is set on every material and should stay. |
| Volumetric fog between rungs | The obvious "mystical" move, and it would turn a diagram into an atmosphere. P2 does the same job with the source's own logic. |
| Orthographic camera | Tempting — it makes the recomposition trivially exact. But then there is no *privileged place to stand*, and the privileged station point is the whole argument. Perspective plus compensation is harder and correct. |

## Suggested order

1. **P5** (evidence harness) — cheap, and everything after benefits.
2. **P1** (gold behaviour) — biggest visual return per line of code.
3. **P3** (quality tier) — closes the acceptance gate.
4. **P2** (rung veil) — after P1, so the two view-dependent effects are tuned together.
5. **P4** (muqarnas) — only if this becomes more than a prototype.
