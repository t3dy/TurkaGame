# TurkaGame — Design Vision

## The pitch

Three game prototypes exploring the life and world of Ṣāʾin al-Dīn ʿAlī ibn Turka
Iṣfahānī (1369–1432) — a real Timurid judge and occult philosopher whose Pythagorean
lettrist cosmology shaped imperial culture across the Timurid, Aqquyunlu, Safavid,
Uzbek, Ottoman, and Mughal courts — built from extant manuscripts and real scholarship
rather than invented fantasy dressing. Full grounding in
[docs/RESEARCH_BRIEF.md](docs/RESEARCH_BRIEF.md).

## Why this is a good game-design source, not just an interesting biography

Melvin-Koushki's scholarship hands over structure that would otherwise have to be
invented:
- A **documented three-act biography** (Cairo apprenticeship → two survived court
  inquisitions → a third, fatal one) that needs dramatization, not invention.
- A **pre-built five-branch hierarchy** of occult sciences (kīmiyā, līmiyā, hīmiyā,
  sīmiyā, rīmiyā) already ordered by prestige, cost, and difficulty — a skill tree that
  didn't need designing from scratch.
- A **real patronage economy** — commissioned "boons," popularization-vs-secrecy as a
  live tension, institutional risk from rival scholars — that maps directly onto career-
  sim and roguelike-economy systems.
- **Citable manuscript targets**, not generic "medieval manuscript" pastiche — e.g. Ibn
  Turka's own *Mafāḥiṣ* autograph and its central Ṭahawī Circle diagram, both at Tehran's
  Majlis Library (MS 10196).

## Shared world, three lenses

One research base and one asset library (`assets/manuscripts/`) feed three different
game grammars:
- **Visual novel** — the interior, dialogue-driven view: what a specific inquisition, a
  specific patron negotiation, actually felt like to navigate.
- **Roguelike** — the systemic, run-based view: the five sciences as mechanically
  distinct disciplines with real risk/reward trade-offs, structurally descended from
  EmblemRoguelike's furnace/disaster pattern.
- **Career sim** — the long-arc, institutional view: a full career spent trading
  reputation, patron favor, and scholarly output against political risk across multiple
  real courts.

None of the three shares code at this stage (see [CLAUDE.md](CLAUDE.md)) — they share
research and assets only, until at least two prototypes have working slices.

## Aesthetic direction

Grounded in real Timurid/Safavid manuscript painting and illumination conventions —
gold, azure, and ink on parchment, Persianate book-painting composition — rather than a
generic "ancient tome" fantasy skin. A useful, locally-known style reference is the
parchment-panel, register-and-alphabet UI pattern already built for the Morigny project
(`t3dy.github.io/MorignyGame`) — worth revisiting for UI-panel conventions (illuminated
framing, marginal annotation columns) once the visual novel's interface is designed, but
not treated as settled; the manuscript sources themselves are the primary reference.

Whether human figures (Ibn Turka, patrons, other scholars) are depicted directly, in
period-accurate figural style, or represented more abstractly/symbolically is an open
question — Islamicate manuscript painting conventions around figural depiction vary
significantly by period, region, and genre and deserve actual research before a visual
approach is locked in (see [docs/GAME_VISUAL_NOVEL.md](docs/GAME_VISUAL_NOVEL.md)).

## Showcase site

`site/` is a placeholder for now — a public-facing page that will eventually show off
the research pipeline and link out to whichever prototypes are playable. Not a design
priority until at least one prototype has something to show.
