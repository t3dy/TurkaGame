# Kickoff Decisions (2026-08-29)

Recorded at project init so later sessions don't re-litigate them. Overturn any of these
deliberately, not by drift.

## Sequencing
**Research pipeline first.** Build a real, working asset-provenance pipeline and research
brief before writing game code. Games are downstream consumers of a working asset library,
not the other way around.

Once the pipeline is solid: **visual novel is the first vertical slice.** Roguelike and
career-sim stay at design-doc stage until the VN slice is playable end to end. Reasoning
at the time: VN is the closest fit to existing patterns in this workspace (EmblemNovel's
scene engine already does dialogue/choice-over-art), so it's the fastest path to a real,
testable slice — which validates the asset pipeline against a real consumer before
committing to the heavier systems work the roguelike and career-sim both need.

## Asset sourcing
**Manual curation with provenance**, not scraping or AI-generated pastiche. Every asset
gets an institution, shelfmark, and rights note before it's usable — see
[assets/schema/asset-provenance.schema.json](../assets/schema/asset-provenance.schema.json).
Slower, but citation-safe, and matches the provenance-record pattern already established in
the 3dprintlab project.

## Tech stack
**Mixed per prototype**, not one framework forced across all three:
- Visual novel: leaning no-build vanilla JS/DOM (cheapest to iterate, closest to
  EmblemNovel's existing engine) — confirm when the slice actually starts.
- Roguelike: no-build vanilla JS/canvas, following EmblemRoguelike/DungeonAB conventions —
  those two projects have already solved the "no-build browser roguelike" problem in this
  workspace; reuse the pattern, not necessarily the code.
- Career-sim: likely needs real persisted state (skill trees, patron relationships, a
  timeline of decisions) — Next.js is the more probable fit here, following
  AlchemyBoardGame's precedent, but this is not locked in since the career-sim hasn't
  reached design lock yet.
- Site: plain static HTML for GitHub Pages. No framework needed for a showcase page.

## Repo
`t3dy/TurkaGame` already existed (created 2026-08-29) with placeholder description
"Islamicate Chill Pills: The Video Game." Left as-is — not changed without asking.

## IslamicateOccultPortal (2026-08-30)

A broader DH research portal, `C:\Dev\IslamicateOccultPortal`, was created as a
**new sibling project** rather than folded into TurkaGame's own `research/` — matching
the pattern of this workspace's other knowledge portals (WitcherPortal,
IlluminatusPortal): SQLite source of truth, Python static-site generator, vanilla
HTML/CSS/JS. TurkaGame's own research/ was NOT migrated into it; the two stay
separate, cross-linked via a `game_connections` table in the portal's DB and pointers
in this file's CLAUDE.md. Reasoning: TurkaGame is a game-prototypes workspace, the
portal is the general Islamicate-occult-world research project — Ibn Turka's own
story is one figure within a much larger corpus (Brethren of Purity, al-Buni,
lettrism generally) that has its own DH-portal-shaped audience independent of any
game.

The portal also became the home for **the image catalog** — a research index of
every manuscript/portrait/diagram image referenced or extracted from the scholarly
sources (including TurkaGame's own 3 papers), separate from this project's
`assets/manuscripts/registry.json` (which only tracks images already cleared and
copied for actual game use). See `../IslamicateOccultPortal/CLAUDE.md`.

## VN mechanics: CYOA + RPG hybrid (2026-08-30)

Following up [games/visual-novel/CHOICES.md](../games/visual-novel/CHOICES.md) (40
branching life-choices), four mechanics decisions:

- **State system: Occult Quintet skill tree only.** No separate inventory or
  relationship-meter UI for now — bonds and objects (the autograph manuscript, the
  Yazdi/Qasim-i Anvar relationships) are tracked as flags, not visible meters/items.
  Can be upgraded later (a meter is just a flag with more states) without
  restructuring, if playtesting shows the invisible version under-communicates
  consequence.
- **Branch topology: fully divergent, not branch-and-reconverge.** Made tractable by
  a flag/skill state model rather than literal per-combination scene authoring — see
  [games/visual-novel/STATE_MODEL.md](../games/visual-novel/STATE_MODEL.md).
- **Slice scope: all 8 acts, all 40 choices** — not staged by act. This is a real
  scope commitment; the mechanical structure for all 40 is built
  ([games/visual-novel/choices.json](../games/visual-novel/choices.json)), but full
  narrative prose for each choice/scene is a separate, larger authoring task still
  to come. Don't let "the choice graph is done" get reported as "the VN is done."
- **Endings: multiple, historical outcome is one among several**, not privileged —
  matches the "choices he might have made differently" framing directly. ~7 named
  endings sketched in STATE_MODEL.md, exact selection logic not yet implemented in
  code.

## Prototype build (2026-08-30)

Following the CYOA/RPG mechanics decisions, four more decisions to actually start
building:

- **Prototype scope: full skeleton, all 8 acts, thin prose.** Wire the whole engine
  to all 40 choices with lightweight placeholder scene text, proving the entire
  state/skill/gate/ending system in one pass, rather than a smaller, more-polished
  slice on one or two acts. Built and verified — see `games/visual-novel/README.md`.
- **Engine: forked EmblemNovel's pattern**, not built from scratch. Reused the
  state.js/scenes.js/main.js shape (small, no-build, localStorage saves), extended
  with the 5-score skill tree and gate-checking `choices.json` needs.
- **Asset source: OCCULTIMGDB primary.** A separate, pre-existing project
  (`C:\Dev\OCCULTIMGDB`) turned out to already have 136 rights-cleared Islamicate
  images across 14 works — used instead of (not merely alongside) TurkaGame's own
  research pipeline or IslamicateOccultPortal's mostly-unverified image catalog for
  actual game assets. 8 images pulled and registered into this project's own
  `assets/manuscripts/registry.json` with real provenance from OCCULTIMGDB's own
  citation records. IslamicateOccultPortal's catalog remains the place to look for
  period-specific leads OCCULTIMGDB doesn't have (e.g. the Ṭahawī Circle at Tehran MS
  10196).
- **Image role: backdrops and diagrams only, no invented character portraits.**
  Manuscripts don't depict Ibn Turka's face and Islamicate figural-depiction
  conventions vary by genre/period — the VN uses one real manuscript/diagram/object
  image as a backdrop per act (8 total), never an invented portrait.

## GitHub Pages CDN cache note (2026-08-30, sixth session)

While verifying the themed-journal deploy live, a browser tab that had visited
the site earlier in the session kept showing the *previous* deploy's HTML
(`js/main.js?v=9` instead of the just-pushed `v=10`) even after a forced
reload. `curl -I` against the live URL directly showed the origin was already
correct (`Age: 0`, `X-Cache: MISS`) — GitHub Pages serves with
`Cache-Control: max-age=600`, so a browser that fetched the page within the
prior 10 minutes can legitimately keep serving its own cached copy regardless
of what's now live, until that window expires or the URL is cache-busted (a
`?nocache=1`-style query param works). **Not a bug** — a real first-time
visitor gets the fresh deploy immediately (confirmed via `curl`). But it means
"verify live" checks done within ~10 minutes of a push, in a browser session
that already touched the page, need a cache-busted URL or they'll falsely
report the deploy as broken. Worth knowing before mis-diagnosing a future
"live verification failed" as an actual regression.

## v3 writing audit (2026-08-30, fifth session)

- **User audit found v2's option text drifting long and generic** — averaging ~41
  words, naming real entities inconsistently. Rewrote all 87 to ~14 words average
  (a third of v2, per the user's own "half or a third" target) and audited each
  for a real name to attach wherever `docs/BIOGRAPHY.md` supports one.
  `WRITING_GUIDE.md` gained a numeric anchor (~10-20 words) specifically because
  "a bit shorter" without a number tends to regress back up over successive
  edits — this is now checkable, not just a vibe.
- **v2 frozen as `games/visual-novel-v2/`**, following the v1 precedent exactly —
  versioned deploy, not overwrite, is now the established pattern for any future
  writing-style change substantial enough to be worth comparing.

## Versioned deploy + writing discipline (2026-08-30, fourth session)

- **Versioned deploy, not overwrite.** When choice options grew from short labels
  to full reasoning text, the previous state was frozen as `games/visual-novel-v1/`
  (a snapshot of commit `7bf20cd`) rather than lost to history-only. Both versions
  stay live and cross-linked. Precedent for future major content shifts: freeze a
  v-N snapshot before a change substantial enough that someone might want to
  compare, don't just trust the git log to make that comparison accessible.
- **Scenes must reveal real scholarship, codified as a house rule**, not left
  implicit. `games/visual-novel/WRITING_GUIDE.md` is the new required read before
  touching `narrative.js`, linked from `CLAUDE.md`'s ground rules. `docs/BIOGRAPHY.md`
  and `site/data/timeline.json` are named explicitly as the canonical
  research-access layer for this purpose — supersedes `docs/RESEARCH_BRIEF.md`'s
  looser prose for this specific purpose (RESEARCH_BRIEF.md is unchanged and still
  fine for general texture).
- **Cache-busting is now load-bearing, not optional.** Hit a real bug this session
  (twice) where `python -m http.server`'s lack of cache-control headers let
  browsers serve stale `choices.json`/JS modules across navigations. Fixed with
  `cache: 'no-store'` on the choices.json fetch and a shared `?v=N` query param
  across every local module import, bumped on every content change — not just a
  one-time fix, an ongoing discipline every future narrative.js edit needs to
  remember.

## Biography and Timeline (2026-08-30, third session)

- **Portal-first for new biographical facts, per this project's own CLAUDE.md
  rule.** All 50 timeline events were authored into
  `IslamicateOccultPortal/data/seed.json`'s `timeline_events` table (replacing its
  4-event placeholder) and run through the portal's real pipeline
  (`init_db.py` → `seed_from_json.py` → `build_site.py`) *before* being exported
  into `TurkaGame/site/data/timeline.json` for the site tab — not authored
  TurkaGame-side first and back-filled.
- **Comparison ≠ contact.** Ibn Turka never met any European Renaissance figure.
  What's real is that Melvin-Koushki himself explicitly compares him to Cusa,
  Pico, Bruno, and Dee — tagged `COMPARATIVE` in the timeline, distinct from
  `ATTESTED` (direct source claim) and `CONTEXT` (general history included only
  for orientation). This distinction is load-bearing: don't let a future pass
  collapse `COMPARATIVE` entries into implying documented contact.
- **Honest low-confidence flagging over omission.** 5 of 50 events (general
  historiography-of-science dates: Melvin-Koushki's dissertation year, Yates 1964,
  Kristeller 1943, Sabra 1987, Saliba 2007) are drawn from general field knowledge
  rather than a source document this project has in hand. Included anyway,
  explicitly flagged `LOW` confidence and named in `NEXTSTEPS.md` for
  verification, rather than either omitted (losing real orienting value) or
  presented with false certainty.
- **`docs/BIOGRAPHY.md` is the new canonical biography**, superseding
  `docs/RESEARCH_BRIEF.md`'s "Biography" section as the source for future
  choices/events/encounters (RESEARCH_BRIEF.md itself is unchanged and still the
  right place for cosmology/mechanics-focused material).

## Writing, hosting, and roadmap docs (2026-08-30, later session — CONVO2.md)

- **Hosting: GitHub Pages, source = repo root, not `/site`.** Required because
  `site/features.html` links to `../games/visual-novel/` and the game's own asset
  paths go `../../assets/manuscripts/...` — both need site/ and games/ served from
  the same root. Added a root `index.html` redirecting to `site/index.html` since
  the actual homepage isn't at repo root. Live: https://t3dy.github.io/TurkaGame/,
  verified including the game itself and its images, not just the redirect.
- **Narrative content: real prose for all 40 choices**, not final writing — see
  `NEXTSTEPS.md` for what's still thin (uniform consequence-beat length, only 4
  reactive scenes, one image per act not per choice). Deliberately did not attempt a
  second, deeper prose pass in the same session — `NEXTSTEPS.md`'s "Explicitly not
  next" section argues structural loop changes (Tier 1) should land before rewriting
  prose again.
- **Engine: added an explicit screen state machine** (title/act_intro/choice/
  consequence/ending) to `main.js`, where the previous version only had
  title-less choice-to-choice flow. The consequence screen specifically was judged
  the highest-leverage single addition — see `GAMELOOP.md` for the reasoning.
- **Docs: `GAMELOOP.md` and `NEXTSTEPS.md` added at repo root**, in the same
  narrative-designer voice as `games/visual-novel/CHOICES.md`. `README.md` rewritten
  with the live link as its first line, per explicit request.
- **`CONVO2.md` started** rather than appending to `CONVO1.md`, per CONVO1.md's own
  stated policy for a new major phase of work. `HANDOVER.md` now points to both.

## Open items flagged at kickoff, not yet resolved
- Only 3 of an expected 4 research PDFs were found in Downloads (see
  [docs/RESEARCH_BRIEF.md](RESEARCH_BRIEF.md) Sources section). Confirm whether a 4th is
  still coming.
- No manuscript images have been sourced yet — the first concrete lead is Tehran, Majlis
  Library MS 10196 (holds Ibn Turka's own *Mafāḥiṣ* autograph), cited directly in the
  Pythagorean Renaissance paper. Not yet verified as digitized/accessible.
- Full 7-tier epistemic hierarchy (traditionist literalism → lettrism) referenced in the
  Pythagorean Renaissance paper is sourced to a different Melvin-Koushki article
  ("Selenocentrism and Heliocentrism") not currently in hand — needed before the
  career-sim's skill-tree design can be finalized.

## CareerSim kickoff (2026-08-30, seventh session)

The career sim moved from parked design doc to **its own full subproject at
`CareerSim/`** (repo root, not `games/career-sim/` — user-directed: "its own full set
of system files as a separate project in a CareerSim subfolder"). The `games/` rule
gets a recorded exception because CareerSim has its own deploy target and system-file
set; `games/career-sim/` is now a pointer. Design source: `TurkaCareerSim.txt`
(a 3,778-line design conversation dropped in Downloads, imported verbatim to
`CareerSim/docs/DESIGN_CONVERSATION.md`).

Four user calls made via explicit Q&A at kickoff (full detail in
`CareerSim/docs/DECISIONS.md` — that file is authoritative for CareerSim decisions):

- **Run shape: life-phase sectors** (Cairo → Isfahan → Courts branch → 1420 Pivot →
  Trials), one run = one compressed life.
- **Slice spine: DungeonAB-style encounter engine** (capability × affordance,
  unlockedBy provenance, gradient outcomes); synthesis graph and composition
  workbench are later slices.
- **Stack: Next.js + Supabase on Vercel** — supersedes this file's earlier tentative
  "likely Next.js" note with a firm decision, driven by a new requirement: player
  logins and player-editable text in saved run chronicles.
- **Content: mine the VN's 40 choices as encounter atoms** — conversion mapping in
  `CareerSim/docs/ENCOUNTER_ATOMS.md`; the VN itself untouched, no shared runtime
  content layer.

`docs/GAME_CAREER_SIM.md` is superseded by `CareerSim/DESIGN.md` (banner added). The
seven-tier-hierarchy blocker recorded above still stands and is carried in the
CareerSim decisions log as an open item.
