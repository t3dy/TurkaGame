# NEXTSTEPS.md — Prioritized Roadmap

A narrative designer's read on what actually moves the needle next, in priority
order. Grounded in the gaps named in [GAMELOOP.md](GAMELOOP.md) and
[HANDOVER.md](HANDOVER.md), not a wishlist — each item says why it's ranked where it
is.

## Tier 0 — confirm what should already be true

- [x] **Verify the live GitHub Pages build.** Repeatedly confirmed across every
  session since: `https://t3dy.github.io/TurkaGame/` loads, all three VN versions
  resolve, and every subsequent content/logic change has been checked live (not
  just locally) via scripted playthroughs before being called done.
- [ ] **Playtest cold**, without the designer's own knowledge of the gates. Watch
  whether the "closed door" note at a gated choice reads as an intentional
  consequence or a confusing dead end (flagged as an open question in GAMELOOP.md).
  Still open — this needs an actual human unfamiliar with the design, not
  something an agent can meaningfully self-check.

## Tier 1 — highest leverage on the loop that already exists

These improve the 40 choices already built, rather than adding new scope.

1. ~~**Escalate the consequence beat for the handful of choices that deserve it.**~~
   **Done (2026-08-30):** c32, c34, c35, c38, c39, c40 got longer, more composed
   consequence text. Also added `OPTION_CONSEQUENCE_DYNAMIC` — c31/c33/c38's
   consequence text (not just their scene text) now differs based on c10/c04/c03,
   so a gate payoff and its emotional beat land in the same breath.
2. ~~**Add a handful more reactive/dynamic scenes.**~~ **Done (2026-08-30):** c22
   (Yazdi's argument for a wide circle, reactive to c03), c27 (reactive to c09's
   reputation), and c34 (reactive to accumulated skill total) added — 7 of 40
   scenes are now reactive. Also fixed a real bug found while doing this: the
   "Court Philosopher" ending (avoided-the-fate) was nested inside the `bend`
   branch of `computeEnding`, where it could never actually fire since its whole
   premise is that the third inquisition never gets serious — moved it to a
   precondition checked before the bend/hold split. Added a personalized epilogue
   paragraph (`epilogueFor` in `endings.js`) reactive to c39/c40, shown under
   every ending.
3. ~~**Per-choice imagery, not just per-act.**~~ **Done (2026-08-30 graphics pass):**
   11 per-choice backdrop overrides added (19 registered images total), each
   thematically matched (e.g. the Falnama Seven Sleepers refuge folio for the exile
   choice c36, a sultan-court wafq testimony page for the first inquisition c31).
   Remaining choices fall back to their act backdrop by design; going denser than
   this should wait for playtesting.
4. ~~**A themed, not just chronological, ending journal.**~~ **Done
   (2026-08-30):** every choice in `choices.json` now carries a `theme` field
   (`loyalty` / `knowledge` / `power` / `integrity`, ~9-14 choices each). The
   ending journal defaults to grouping by theme (`journal-group` sections in
   `ui.js`'s `buildJournalRows`) with a toggle button to switch back to
   chronological-by-act. All 40 rows verified present in both modes.
5. ~~**Name Shah Rukh's violence explicitly in `c10`'s scene text.**~~ **Done
   (2026-08-30):** `c10`'s scene and consequence text now name Shah Rukh's
   blinding and execution of Iskandar Sultan directly, and that Bāysunghur (Ibn
   Turka's next patron) is Shah Rukh's own son. The larger proposal (a new choice
   about petitioning Shah Rukh directly) remains unimplemented — see
   `ENDINGS_AUDIT.md` for why.
6. ~~**Name the Aqquyunlu explicitly in `c36`'s "new_patron" option.**~~ **Done
   (2026-08-30):** option label, detail, scene text, and consequence text all now
   name the Aqquyunlu specifically instead of "a rival court."
7. ~~**Give `c17`/`c25` their own epilogue clauses.**~~ **Done (2026-08-30):**
   `epilogueFor()` now adds a clause for `c17=narrow` (single-science legacy) and
   `c25=overclaim` (credit-taking that historians eventually catch), same
   selective-firing pattern as the `c33`/`c36` clauses.

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
3. ~~**A short epilogue scene per ending.**~~ **Done (2026-08-30):** `epilogueFor`
   in `endings.js` adds a personalized paragraph reactive to c39/c40 under every
   ending.
4. **Verify the 5 LOW-confidence historiography dates** in
   `site/data/timeline.json` (Melvin-Koushki's dissertation year, Yates 1964,
   Kristeller 1943, Sabra 1987, Saliba 2007) against an actual bibliographic
   record rather than general field knowledge — flagged honestly as unverified
   when added (2026-08-30), not a blocker for the timeline shipping, but worth
   closing before citing these dates anywhere more load-bearing than the tab.
5. **Mine `docs/BIOGRAPHY.md`'s "for game design" section for new choices.** It
   names concrete gaps (7-tier hierarchy, undated first two inquisitions,
   pre-Cairo life) the VN currently works around — closing any of them (e.g. via
   Melvin-Koushki's "Selenocentrism and Heliocentrism," same acquisition target as
   item 2 above) could unlock new choice material, not just texture.

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
- ~~Accessibility pass~~ **Largely done (2026-08-30 graphics pass):** keyboard
  navigation (1–5 pick options, Enter continues), `focus-visible` outlines,
  ARIA roles/labels on skill bars and the act progress bar,
  `prefers-reduced-motion` support. Remaining: a screen-reader walkthrough by an
  actual SR user before wider sharing.

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
