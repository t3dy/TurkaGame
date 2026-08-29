---
title: CONVO2 — Writing, UX polish, hosting, and roadmap docs
description: Session record for the follow-up conversation after CONVO1.md's prototype build. Read HANDOVER.md first — opened by section, not end to end.
---

# CONVO2 — Writing, Polish, Hosting, Roadmap

Continuation of the work recorded in [CONVO1.md](CONVO1.md). Same rule applies:
**do not read this file top to bottom by default.** [HANDOVER.md](HANDOVER.md) is
the stable entry point.

## What this session did

**User's request:** flesh out the VN's writing and gameplay, make the interface
attractive and user-friendly, fix rough edges, host the site on GitHub, write a
detailed README with the live link at the top, and produce a narrative designer's
`GAMELOOP.md` and `NEXTSTEPS.md`. No question-asking this time — a directive,
execute-now message, unlike the earlier kickoff turns.

**Narrative content:** rewrote `games/visual-novel/js/narrative.js` from one-line
placeholders to real scene-setting prose for all 40 choices, plus ~110 lines of
per-option consequence text, plus 4 dynamic/reactive scenes (`c12`, `c31`, `c33`,
`c38`) whose text changes based on an earlier choice (`c07`, `c10`, `c04`, `c03`
respectively). Hit the exact same unescaped-apostrophe JS syntax bug as in the first
build session (`'Beg's patronage'` breaks a single-quoted string) — caught it this
time by actually running the file through `node --input-type=module` before trusting
it in the browser, rather than only discovering it via a blank page. Worth
remembering: **grep for `[^\\]'(s |t |ll |re |ve |d )` or just node-import-check any
JS content file with a lot of hand-typed contractions before shipping it.**

**Gameplay/engine changes:** restructured `main.js` into an explicit small state
machine (`title` → `act_intro` → `choice` → `consequence` → loop → `ending`) instead
of the previous choice-only loop. Added `renderTitle`, `renderActIntro`,
`renderConsequence` to `ui.js`; `renderEnding` gained a full act-by-act journal of
every choice made. `ACT_INTROS` in `narrative.js` upgraded from a plain string per
act to `{title, text}` objects with real atmospheric prose. All verified end to end
in-browser: title → act intro → choice → consequence → ... → ending with journal;
save/resume mid-game (interrupted at global choice index 7, reloaded, "Continue your
story" correctly restored to the exact same choice and act); a specific gate
re-verified (`c10=early_defect` still correctly hides the "patron favor" option at
`c31`); mobile viewport (375×812) confirmed responsive.

**Interface polish:** card fade-in animation, hover/active states on option buttons,
a `.primary` button style (gold, used for the single "Continue"/"Begin" actions),
gradient skill-tree fill bars, a `radial-gradient` page background instead of flat
navy, consistent card language across all five screen types, a responsive breakpoint
at 30rem.

**GitHub Pages hosting:** enabled via `gh api -X POST repos/t3dy/TurkaGame/pages`
with `source[branch]=main`, `source[path]=/` — repo root, not `/site`, because
`site/`'s pages link to `../games/visual-novel/` and `games/visual-novel/`'s asset
paths go `../../assets/manuscripts/...`; both require site/ and games/ to be served
from the same root. Since the actual homepage lives at `site/index.html` rather than
repo root, added a root `index.html` that meta-refreshes to `site/index.html`
(the standard trick for this situation). Verified live — not just "should work":
navigated to `https://t3dy.github.io/TurkaGame/`, confirmed the redirect landed
correctly, then separately loaded
`https://t3dy.github.io/TurkaGame/games/visual-novel/index.html` directly and played
through the title screen, an act transition, and a real choice with its manuscript
backdrop image loading correctly — confirms both the HTML/CSS/JS and the image
assets deploy correctly from the actual Pages build, not just localhost.

**README rewrite:** live site link as the very first line per the user's explicit
ask, the `site/images/pitch-overview.png` pitch image embedded (renders correctly on
GitHub's README view, confirmed), project structure tree, local-run instructions,
research grounding section naming both companion projects (IslamicateOccultPortal,
OCCULTIMGDB), and a provenance/license note. Confirmed rendering correctly on
`github.com/t3dy/TurkaGame` itself, not just assumed from the markdown source.

**GAMELOOP.md and NEXTSTEPS.md:** written in the same "narrative designer's report"
voice established for `games/visual-novel/CHOICES.md`. GAMELOOP.md documents the
five-screen loop, the design rationale for the consequence beat specifically (the
single easiest screen to have skipped, and the one that keeps choices from feeling
weightless), and three concrete places the current implementation is thinner than
the design deserves. NEXTSTEPS.md is a 4-tier prioritized roadmap (Tier 0: verify
what should already be true; Tier 1: highest-leverage work on the existing 40
choices; Tier 2: broaden content; Tier 3: the other two prototypes; Tier 4: polish
that isn't urgent) plus an explicit "Explicitly not next" section arguing against
prematurely rewriting the prose again before Tier 1's structural changes land.

## Corrections/updates to CONVO1.md's record

- CONVO1.md's HANDOVER.md snapshot said the VN's prose was "one placeholder line per
  choice" and no hosting existed — both are now out of date; this file's changes
  supersede that status. CONVO1.md's own content is still accurate as a record of
  *what happened in that session* — nothing there was wrong, it's just no longer
  the current state.

## How to use this file

Same as CONVO1.md: read HANDOVER.md first, come here only when something specific
needs this session's rationale, and grep/section rather than reading end to end.
