# NEXTSTEPS.md — Prioritized Roadmap

A narrative designer's read on what actually moves the needle next, in priority
order. Grounded in the gaps named in [GAMELOOP.md](GAMELOOP.md) and
[HANDOVER.md](HANDOVER.md), not a wishlist — each item says why it's ranked where it
is.

## Tier 0 — confirm what should already be true

- [ ] **Verify the live GitHub Pages build.** Enabled this session; confirm
  `https://t3dy.github.io/TurkaGame/` actually loads, the root redirect lands on
  `site/index.html`, and the "Play the prototype" links resolve correctly from the
  deployed site (not just local `http.server`) — asset paths and the site/games
  cross-link both depend on Pages serving the *repo root*, not `/site`.
- [ ] **Playtest cold**, without the designer's own knowledge of the gates. Watch
  whether the "closed door" note at a gated choice reads as an intentional
  consequence or a confusing dead end (flagged as an open question in GAMELOOP.md).

## Tier 1 — highest leverage on the loop that already exists

These improve the 40 choices already built, rather than adding new scope.

1. **Escalate the consequence beat for the handful of choices that deserve it.**
   Currently every consequence is one line, uniformly. Choice #34 (bend the knee),
   #38 (entrust the manuscripts), and #39/#40 (death, testament) are the emotional
   high points of the whole life — give those a slightly longer, more composed
   consequence text than the routine ones, so the loop's rhythm has real peaks, not
   just a flat cadence of one-liners.
2. **Add a handful more reactive/dynamic scenes.** Only 4 of 40 choices currently
   read differently based on earlier state (`c12`, `c31`, `c33`, `c38` in
   `narrative.js`). Good next candidates, ranked by dramatic payoff: `c27` (the
   defining case) referencing `c08`/`c09` (how visible a reputation you built
   earlier); `c34` (bend the knee) referencing accumulated skill breadth so the
   scene itself acknowledges what the player has built toward losing; `c22`
   (teach widely vs. small circle) referencing `c03` (how you treated Yazdi) since
   both are about how much you trust people with your work.
3. **Per-choice imagery, not just per-act.** One backdrop image per act (8 total)
   means most choices share an image with four others. OCCULTIMGDB has more than
   enough curated Islamicate material to go deeper — pull 2–3 additional images per
   act (aim for ~20 total) and vary them by choice within the act, prioritizing the
   highest-stakes choices identified above.
4. **A themed, not just chronological, ending journal.** Currently the ending's
   journal lists all 40 choices strictly by act. Grouping by *axis* instead (skill
   investment, loyalty spent, secrets kept vs. taught) would make the "story of the
   story" legible at a glance rather than requiring the player to read 40 rows.

## Tier 2 — broaden the existing VN's content

1. **OCR `al-buni-shams-al-maarif`** (in IslamicateOccultPortal) or lean further on
   OCCULTIMGDB's already-cleared Shams al-Ma'arif images (6+13+2 = 21 available) to
   pull genuinely new diagram material distinct from what's already in
   `assets/manuscripts/`.
2. **Write the missing biographical texture.** The 7-tier epistemic hierarchy
   (traditionist literalism → lettrism) referenced in `docs/RESEARCH_BRIEF.md` is
   still only partially sourced — acquiring Melvin-Koushki's "Selenocentrism and
   Heliocentrism" would let choice #16–20 (the sciences act) reference a real
   secondary axis of depth-of-mastery, not just breadth.
3. **A short epilogue scene per ending**, distinct from the current single ending
   paragraph — even two or three sentences of "five years later..." per named
   ending would give the ~7 endings more individual identity than they currently
   have (right now they're differentiated by title and one paragraph; playtesting
   will likely show players want a bit more).

## Tier 3 — the other two prototypes

Unstarted, by design, per the original "research pipeline first, VN first slice"
sequencing (`docs/DECISIONS.md`). Worth picking back up once Tier 1 is done and the
VN's core loop has had real playtesting:

- **Roguelike** — the Occult Quintet hierarchy and EmblemRoguelike's
  furnace/disaster-resolution pattern are both already identified as the mechanical
  precedent (`docs/GAME_ROGUELIKE.md`). The VN's `choices.json`/gate-checking
  approach may itself be a useful pattern to reuse for the roguelike's own branching
  encounter system.
- **Career sim** — blocked on the same missing 7-tier hierarchy source as Tier 2
  item 2 above; the Occult Quintet skill-tree code in `state.js` is directly
  reusable as a starting point once that design unblocks.

## Tier 4 — polish that isn't urgent yet

- Sound design (none exists; the prototype is silent).
- Transition animations between screens beyond the current fade-in.
- A proper settings/about screen (currently the only way back to the main site is
  the small "← TurkaGame" link).
- Accessibility pass (keyboard navigation through options, screen-reader labels on
  the skill bars) — worth doing before any wider sharing of the prototype, not
  before.

## Explicitly not next

- **Full literary-quality prose for all 40 choices.** What exists now (real
  sentences, real stakes, grounded in CHOICES.md) is a genuine improvement over the
  placeholder one-liners it replaced, but it's still a first pass, not final
  writing. Rewriting it again this soon would be polishing before the loop itself
  has been playtested — Tier 1's structural changes should land first, since they
  may reshape which scenes need the most attention.
- **A second art pass beyond OCCULTIMGDB sourcing.** No commissioned or
  AI-generated art beyond the two pitch-marketing images already on the site. The
  project's own provenance discipline (`docs/DECISIONS.md`, "Image role") rules out
  invented character portraits specifically; broadening beyond manuscripts/diagrams
  into other real image types (architecture, maps, objects) is worth doing before
  commissioning anything new.
