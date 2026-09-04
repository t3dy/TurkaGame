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

## 2026-08-31: Ibn Turka Portal Architecture

### Scope & Purpose
Built a standalone, TurkaGame-internal knowledge portal from Melvin-Koushki's complete corpus (43 sources, ~6M characters). Purely scholarly, no game material in the schema — design work citing the portal lives in `../docs/` and the game folders.

### Decisions

**Portal home:** TurkaGame/portal/ (not merged into sibling IslamicateOccultPortal)
- Reason: Ibn Turka-centered, tightly coupled to game world-building. Corpus and entities are game-specific first-pass (focused on Ibn Turka himself), not the general Islamicate tradition. The two projects stay separate, cross-link via slug references.

**Entry depth strategy:** Full encyclopedia-quality on Ibn Turka and core lettrism first. Secondary figures, peripheral topics, and synthesis essays in later passes.
- Reason: Constrains scope to achievable first-session work; establishes the house style and research discipline on the highest-value material; other entries build on that foundation.

**Entry format:** Markdown card + body in seed.json, rendered to HTML at build time.
- Reason: Match your existing card/page system (ALCHEMYTIMELINEMAP, Pico). Easier for me to write and you to edit while still producing your canonical HTML entry pages.

**No game material in the portal schema itself** — no `game_note` fields, no `game_connections` table. 
- Reason: Clean fact/fiction separation (inherited from WitcherPortal convention). The portal is a research reference; game design docs reference portal entries by slug, keeping the two layers intellectually distinct and independently reusable.

**Research tool:** Corpus isn't read end-to-end. mine_corpus.py enforces the pattern: rank → kwic → read → cite. Every hit includes source + page number, enabling immediate provenance-grounded writing.

### Artifact Structure
```
portal/
├── corpus/sources/*.md    — 42 converted PDFs + INDEX.md (gitignored, copyrighted)
├── db/turka.db            — SQLite (generated, gitignored)
├── data/
│   ├── seed.json          — Hand-authored entries (figures, concepts, etc.)
│   └── corpus_manifest.json
├── scripts/
│   ├── convert_corpus.py  — PDF → markdown
│   ├── init_db.py         — Create schema
│   ├── mine_corpus.py     — Search tool (not for writing, for research)
│   ├── seed_from_json.py  — JSON → DB
│   └── build_site.py      — DB → HTML
├── site/                  — Generated HTML (git-tracked)
├── docs/
│   └── STYLE_ENTRIES.md   — Encyclopedia entry guide
└── README.md
```

### Why This Matters
The corpus alone is an 6M-character haystack. A research tool that returns results with page numbers is the difference between "I could probably find it" and "here's the exact source." This enforces provenance rigor from the start and saves massive rework later when entries need to be cited.

The purely-scholarly schema (no game fields) lets the portal stand alone, useful for any future project touching Islamicate occultism or Ibn Turka, while keeping game design work in its proper place (the game folders and design docs).

---

## 2026-08-31 — Deploy Yūsuf Ascent on the existing Pages site; add `.nojekyll`

**Decision.** Yūsuf Ascent ships as part of the existing GitHub Pages site
(`https://t3dy.github.io/TurkaGame/`, branch `main`, path `/`) rather than getting its
own host, and a `.nojekyll` file is added at the repo root.

**Rationale.** The prototype is four static surfaces with one vendored dependency; a
second host would add a deploy path to keep straight for no benefit. The `.nojekyll`
file is not cosmetic: Pages builds this repo with the legacy Jekyll pipeline, which
excludes `vendor/` and `_`-prefixed files by default, so `vendor/three.core.js` and
`three.module.js` would have 404'd in production while working perfectly on localhost.

**Rejected alternatives.** A separate Vercel project for the minigame (an extra deploy
path to reconcile, and `DEPLOY_STATE.md` already has one plan-vs-reality mismatch to
track in CareerSim). Inlining three.js into the app bundle to dodge `vendor/` (hides
the dependency and its licence, and doesn't fix `_`-prefixed files).

**Consequence.** `DEPLOY_STATE.md` is now the canonical record of hosting state, per the
workspace rule for projects with more than one deploy path.

## 2026-08-31 — Sonnet 5 is the default model; Opus is the considered choice

**Decision.** Model selection is now explicit, recorded in
`CONTEXTENGINEERINGGAMEPIPELINES.md`: Sonnet 5 for verifiable work (plumbing, SSG,
schema queries, deploys), Opus 5 where the failure mode is silent (scene prose against
the WRITING_GUIDE rule, architecture), Haiku 4.5 for bounded per-item rubrics via
`tools/batch/`. Fable 5 is not adopted.

**Rationale.** Context window binds more often than task difficulty — the largest corpus
source is ~600K tokens and must never be fed whole. Prose output volume is small enough
that the Opus/Sonnet price gap is pennies per scene, so the expensive model goes where
ungrounded-but-fluent output would slip past review, not where cost is highest.

**Rejected alternative.** Fable 5 for long sweeps: this project's expensive failures are
silent quality failures caught later by inspection, which a stronger model doesn't fix —
verification structure does.

**Consequence.** Coupling the portal to the games is laddered L0–L4; we are between L1
and L2, and **L2 (build-time export from `islamicate.db`) is the agreed next rung**.

---

# 2026-08-31 — Yūsuf Ascent and the Visionary Gallery

The eighth and ninth sessions built two things that look similar and are not: a
hand-authored minigame on one painting, and an automatic pipeline over twenty-two. The
decisions below are recorded together because the pair only makes sense as a pair.

Detailed per-project records: [`games/yusuf-ascent/DECISIONS.md`](../games/yusuf-ascent/DECISIONS.md),
[`games/visionary-gallery/DECISIONS.md`](../games/visionary-gallery/DECISIONS.md).
Direction changes made mid-flight: [`docs/PIVOTS.md`](PIVOTS.md).

## Three prototypes with three verbs, not one polished game

**Decision.** Yūsuf Ascent ships as three separate prototypes over one decomposition —
*look* (2D hotspot chain), *move* (3D station-point stack), *argue* (drag-sort ladder) —
plus a research portal, rather than one finished game.

**Rationale.** The question the build was actually answering is "can this painting be
made interactable at all, and which verb does it reward?" Three cheap answers to that are
worth more than one expensive answer to a question nobody had asked yet. They also share
a single data file, so the marginal cost of the second and third was small.

**Rejected alternative.** Building the 2D one properly and shipping it alone: it would
have hidden the fact that the *move* reading is the strongest of the three, which was not
obvious before it existed.

**Consequence.** None of the three is finished. `INTERFACE.md` says so explicitly, with a
severity table — no onboarding, no journal, no touch support in Prototype C.

## Region boxes live in `imagelab/`, never in a game folder

**Decision.** Every decomposition's boxes are single-sourced in
`imagelab/data/regions.json`. Each game has a build script that merges those boxes with
its own interpretation into a `*.json` the runtime reads.

**Rationale.** The boxes and the reading change at different rates and for different
reasons. Keeping them together means re-cutting sprites whenever the argument moves. They
were re-cut twice mid-build and this is why that was cheap.

**Rejected alternative.** Boxes in the game folder next to the annotations, which is how
it started. Abandoned within the hour.

**Consequence.** `games/*/build_palace.py` is now a pattern, not a one-off. The gallery's
`build_gallery.py` follows it.

## Station-point perspective, not orthographic projection

**Decision.** Prototype B places each element at a depth given by its cosmological rung and
compensates position and scale about a **station point** by `k = (D − z)/D`, using a
perspective camera. An orthographic camera was considered and rejected.

**Rationale.** Orthographic makes the recomposition trivially exact from *every* frontal
position. Perspective-with-compensation makes it exact from exactly **one place to stand** —
which is the argument the painting makes about ascent, restated as a projection property
instead of illustrated by one. The harder implementation is the correct one because the
difficulty is the content.

**Rejected alternative.** Orthographic (loses the privileged viewpoint); baked depth per
element (not derivable from the reading, and not testable).

**Consequence.** The invariant is checkable, not asserted:
`__yusufB.checkStationInvariant()` measures worst screen-space drift across all panels and
returns ~1e-16 against a 1.5e-3 tolerance. The gallery's 3D tab carries the same test.

## No lighting anywhere, and the post-processing stack is refused

**Decision.** Every material in both 3D scenes is `MeshBasicMaterial` with
`toneMapped: false`. No PBR, no bloom, no GTAO, no tone mapping, no LUT grading, no
volumetric fog. The single exception is Yūsuf's flame-halo, which is additively blended.

**Rationale.** The source folio has no modelled light anywhere — no cast shadow, no
falloff, no specular. Adding optics the painting refuses is not enhancement, it is a
category error about the object. The one light in the picture is *ontological rank
rendered as gold*, so it is the one additive material in the scene.

**Rejected alternative.** The obvious "make it beautiful" pass. `GRAPHICS.md` carries the
full refusal table with a reason per item, and five proposals that work *with* the source's
own logic instead (gold as a view-dependent leaf term; a per-rung paper veil instead of
camera depth-of-field).

**Consequence.** The no-post baseline *is* the final image, which satisfies the Three.js
skill pack's acceptance gate trivially and honestly.

## Interpretation is labelled where the judgement happens

**Decision.** Wherever the project asserts something the painting does not say — the
seven-rung ladder, the door chain, the machine's layer assignment — it is labelled as an
interpretation **at the point of use**, not in an About page or a footnote.

**Rationale.** A disclaimer the reader meets after forming a belief is decoration. The
distinction between a research tool and a research-*themed* one is whether the caveat
arrives while the judgement is being made.

**Consequence.** Prototype A's sidebar, Prototype C's marking dialogue, the portal's
grounding tags, and the gallery's every mention of "heuristic" all carry it. The negative
result — that **no source in the 43-source corpus mentions Bihzād or Zulaykha at all** —
is on the portal page in its own right, not buried.

## L3 grounding: every element carries what it rests on

**Decision.** All 43 Yūsuf Ascent elements carry a `grounds` array (104 claim rows: 5
ATTESTED, 33 CORPUS, 10 FIELD, 6 INFERENCE, 50 INTERPRETATION), rendered in-game on each
card under "Rests on".

**Rationale.** `CONTEXTENGINEERINGGAMEPIPELINES.md` L3 asks that a scene asserting a fact
carry the id of the claim backing it, so "which lines rest on a weak claim?" becomes a
query. Applied to a picture rather than a scene, that means each element names its source
and its tier — and the weakest tier is surfaced in the collapsed summary, so the player
sees *how well grounded* before choosing to read *why*.

**Rejected alternative.** A single confidence score per element. It collapses "a source
says this" and "we decided this" into one number, which is exactly the distinction worth
keeping.

**Consequence.** Half of L3 is done — images already carried provenance to runtime; text
now does too. The remaining half is machine-checkable queries over it.

## The gallery is L4, deliberately built as a counterpart to L1 — not a replacement

**Decision.** `games/visionary-gallery/` generates regions, layers, papercraft nets and
3D stacks from measured properties, with no per-image authoring. It sits at L4 on the
coupling ladder; Yūsuf Ascent stays L1. Both ship.

**Rationale.** The open question after Yūsuf Ascent was whether the hand work was
necessary or merely first. Building the automatic version and **measuring it against the
hand-made one** is the only way to answer that, and it is now answered:
`compare_hand.py` finds the machine **ranks** regions much as the argument does
(Spearman ρ = 0.86, p = 0.0006) and **finds** only 27% of them at IoU ≥ 0.2, missing the
chamber, Yūsuf, the halo and the brackets — every element the reading is made of.

**Rejected alternative.** Generating the gallery and quietly presenting it as equivalent
to the hand-made decomposition. L4's stated failure mode is content that is individually
well-formed and collectively misleading, and that is exactly the shape it would have taken.

**Consequence.** *An automatic pipeline gets you a corpus; it does not get you a reading.*
That sentence is on the Method page. **L2 remains the agreed next rung** and is now the
loudest gap: `gallery.json` carries measurements and provenance but no scholarship, and
`islamicate.db` already holds the scholarship.

## The rights gate lives in the script, not in a human's memory

**Decision.** `imagelab/scripts/fetch_commons.py` reads Wikimedia Commons' *structured*
licence data and refuses to download anything that does not parse as free. Provenance
records are built by the script, not asserted by whoever skimmed the page.

**Rationale.** The existing house rule is that no manuscript image enters `assets/`
without a provenance record. Commons is the only source in reach that exposes licence,
author, institution and date as queryable fields, which makes the rule enforceable rather
than aspirational.

**Rejected alternative.** Fetching from the holding institutions directly (better images,
no machine-readable rights) or trusting a curator's note (the failure mode this project
has already corrected once — see the Adab Farsi 908 → 22 fix below).

**Consequence.** 22 of 22 cleared, 0 blocked. The gate's first version *over-blocked* 19
of 22 through a regex anchored on `pd-` that rejected every plain `pd` file. The fix is
commented in the script rather than quietly applied, because a gate that silently
over-blocks is one bad edit from silently under-blocking.

## A provenance correction, and where it is recorded

**Decision.** The Bihzād folio is **Cairo, Egyptian National Library, Adab Farsi 22,
f. 52b** — not "Adab Farsi 908 (attributed)" as `imagelab/data/images.json` recorded, where
it was flagged as an inference from the picture. Rights moved NEEDS_VERIFICATION →
CLEARABLE (PD-Art via Commons).

**Rationale.** Confirmed against the Commons file record and corroborated by published
descriptions of the Cairo Būstān. Both numbers circulate for a 1488 Sulṭān ʿAlī Mashhadī
Būstān in that library; Adab Farsi 22 is the one the art-historical literature uses.

**Consequence.** Corrected in `images.json` **with the old value and the reasoning kept**,
and in `games/yusuf-ascent/data/research.json`. Still to do before a shipped release:
confirm the Dār al-Kutub's own reproduction terms, which can differ from Commons' PD-Art
position.

## Committed-asset budget: ship the web subset, gitignore the sources

**Decision.** `research inbox/` (57 MB of sources) and `imagelab/output/` (130 MB of
intermediates) stay gitignored. `build_gallery.py` emits a ~33 MB web-ready subset into
`games/visionary-gallery/assets/`, which is what is committed and served.

**Rationale.** The intermediates are fully regenerable from four scripts, so committing
them buys nothing and costs a repo that is unpleasant to clone. The web subset is not
regenerable by a visitor, so it ships.

**Rejected alternative.** Committing the full-resolution sources "in case" — the existing
gitignore already establishes that derived cutouts and un-cleared material stay local.

**Consequence.** A fresh clone cannot re-run the analysis without first re-running
`fetch_commons.py`. That is stated at the top of the gallery README.

## 2026-09-01 — L2 built: the portal DB now feeds the gallery at build time

**Decision.** `portal/scripts/export_gallery_scholarship.py` exports scholarship from
`portal/db/turka.db` into `games/visionary-gallery/data/scholarship.json`. The gallery's
workbench pages render the linked entries — the portal's own text, literature, and
confidence/review flags — under "From the knowledge portal"; the front page shows entry
chips per tradition. 10 entries, 15 links across all 8 traditions.

**Rationale.** The division of labour is the point of L2, and the export enforces it:
the **entries** are read from the DB at build time and never copied by hand, so a card
fixed in the portal propagates to the gallery on re-run — one place, not two. Only the
**mapping** (tradition → entry, each with a one-line "why") is authored in the script,
and it is rendered as this project's interpretation at the point of use, per the house
rule. The portal's `DRAFT`/`MEDIUM` flags are shown, not laundered into confidence the
entries have not earned.

**Deviation from the recorded plan, flagged.** The 2026-08-31 model-selection entry named
`islamicate.db` (the sibling IslamicateOccultPortal) as the L2 source. This export reads
**`portal/db/turka.db`** — this repo's own portal — instead. Three reasons: it is in-repo,
so the export reproduces on a fresh clone without the sibling project present; it holds
the Ibn Turka-specific encyclopedia entries the gallery's readings actually invoke
(including his *Treatise on the Barzakh*, the single strongest link in the mapping); and
the gallery deploys from this repo, so its build inputs should too. An `islamicate.db`
export remains open for the broader material (al-Būnī, Brethren of Purity) when a surface
needs it — this entry narrows the source, it does not close that door.

**What the export refused to do.** Two gaps are recorded *inside the JSON* rather than
papered over: the portal has no divination entry, so the Falnāma tradition links to
`talismanic-science` with an explicit mismatch note shown to the reader; and no
painting-world figures (Bihzād, Jāmī, Saʿdī, Bāyqarā) exist in the DB because the
portal's scope is Ibn Turka's world — those live in Yūsuf Ascent's hand-authored
`research.json` instead. The highest-value portal addition this export surfaced is a
geomancy/divination concept entry.

**Rejected alternatives.** Hand-copying card text into `gallery.json` (re-creates the
two-sources-of-truth failure L2 exists to end); auto-linking by keyword match against
card text (produces confident nonsense — the mapping is small enough that fifteen
authored links with reasons beat any recall a matcher would buy); exporting every entry
wholesale (the gallery would become a worse mirror of the portal instead of a consumer
of its relevant slice).

**Consequence.** The ladder now reads: L1 (Yūsuf Ascent, hand-authored) ✓ · **L2 ✓** ·
L3 half-built (elements carry grounding; queries over it do not exist yet) · L4 (the
gallery) ✓. The next unbuilt things are, in order of stated value: the divination portal
entry, machine-checkable queries over the L3 grounding, and the batch annotation sweep
(still blocked on a real terminal).

## 2026-09-01 — Two sessions closed the divination gap at once; the duplicate was removed, not merged

**What happened.** The L2 export recorded "no divination entry" as its highest-value gap.
Acting on that, this session mined the corpus and drafted `concepts/ilm-al-raml`, seeded
it, and re-ran the export — which then **failed loudly**, because a concurrent session had
meanwhile rewritten `portal/data/seed.json`: it added its own `concepts/geomancy` and
`concepts/jafr`, and merged away `texts/treatise-on-barzakh` and
`concepts/timurid-patronage`, both of which this session's L2 mapping referenced.

**Decision.** The concurrent session's `geomancy` survives; this session's `ilm-al-raml`
was **deleted from the seed and pruned from the DB**. The gallery's Falnāma tradition now
links to `geomancy` + `jafr`. The distinctive grounded material from the removed draft is
parked in
`portal/docs/NOTE_geomancy_merge_candidate.md` (since **merged into `concepts/geomancy` and deleted**, per the note's own instructions — see commit `33ffb7a`)
for a deliberate merge by whoever owns that entry.

**Rationale.** Theirs is already wiki-linked into the rest of the portal and written in the
portal's voice; two entries for one science is strictly worse than either alone; and
editing another session's live entry while it may still be being written is how you get a
silent overwrite. Parking the extra material costs one file and loses nothing —
the sand procedure, the popularity ranking (third behind astrology and oneiromancy), the
Afro-Eurasian spread into *ifa*/*gara*/*sikidy*, and Yazdī's five-move argument including
the *Nūr* correspondence are all preserved with citations.

**Rejected alternatives.** Shipping both entries (a duplicate, and the export would have
had to choose one anyway). Editing `geomancy` in place to fold my material in (a
concurrent-write hazard, and it presumes ownership this session does not have). Reverting
my seed change and dropping the research (loses grounded work for no gain).

**Consequence, and the thing worth keeping.** `seed_from_json.py` **prunes** DB rows absent
from the seed file, so an upstream merge silently removes entries a downstream consumer
depends on. The export's `sys.exit` on a missing slug is what surfaced this within seconds
instead of shipping a gallery with two dead links — **that fail-loud behaviour stays**.
Standing rule: **re-run `export_gallery_scholarship.py` after any portal re-seed**, and
treat `portal/data/seed.json` as a file other sessions write.

**Also surfaced.** Melvin-Koushki twice ranks **oneiromancy — dream divination — *above*
geomancy** in popularity. The portal has no oneiromancy entry, `mine_corpus.py rank dream`
returns 25 hits in the Yale dissertation alone, and `docs/VISIONARY_ENVIRONMENTS.md` is
explicitly about Ibn Turka's dreaming life. That is the next entry to write, and it serves
the games more directly than geomancy does.

## 2026-09-01 — 43 copyrighted PDFs were tracked on a public repo; untracked, history still to purge

**What was found.** While diagnosing a Pages build failure, `git ls-tree` showed **43 of
Melvin-Koushki's papers (55.3 MB) tracked on `main`** in `research inbox/`. The repo is
**public**. A real request to `raw.githubusercontent.com` returned **200 and 456 KB** —
they were downloadable by anyone.

This violates the project's own rule, stated in `CLAUDE.md` in those words: *"No
copyrighted source PDFs in the repo … Never commit a PDF."*

**How it happened.** They entered in `08a2864` ("CareerSim Slice 1"), **before**
`research inbox/` was added to `.gitignore`. Gitignore does not untrack files that are
already tracked, so adding the rule later looked like a fix and was not one. Nothing
afterwards would have caught it: the rule lived in prose, and no check enforced it.

**Decision.** `git rm --cached` on all 43 (commit `65b382f`). Local copies untouched;
`.gitignore` line 23 already prevents recurrence. Verified afterwards: 0 PDFs in
`origin/main`, the GitHub API returns 404 for the directory, the user-facing blob view
returns 404, and `raw.githubusercontent` returned 404 once its 5-minute CDN cache expired.

The corpus workflow is unaffected — `mine_corpus.py` reads the converted text in
`portal/corpus/sources/`, which is separately gitignored and lives on disk.

**Rejected alternative.** Rewriting history immediately with `git filter-repo` and a
force-push. It is the complete fix and it is destructive: it breaks every existing clone,
and a concurrent session was actively committing to this repo at the time. Doing that
unilaterally, without the repo owner's decision, is not a call to make mid-session.

**STILL OPEN — needs a human decision.** The PDFs remain in **git history**, so a
SHA-pinned URL still resolves. Closing that requires:

1. `git filter-repo --path "research inbox/" --invert-paths` (or BFG),
2. a coordinated force-push with every other session paused,
3. asking GitHub Support to purge cached views, since old blobs can stay reachable,
4. accepting that any existing clone or fork keeps its copy.

Until that happens the exposure is reduced, not eliminated.

**Consequence worth generalising.** A house rule that only exists in prose is not enforced.
The rights gate in `imagelab/scripts/fetch_commons.py` is the counter-example — it refuses
non-free licences in code, which is why the image corpus has no equivalent problem. **A
pre-commit hook rejecting `*.pdf` would have prevented this**, and is the obvious next fix.

## 2026-09-01 — Pages had been failing for four commits; removing the PDFs recovered it

**What happened.** `gh api .../pages/builds/latest` showed `errored` with duration 0 and no
message for `33ffb7a`, `93787e5`, `c39a9ac` and `06928b1b`. `ee596fa` had built. A forced
rebuild errored identically, so it was not transient.

Ruled out by inspection: `.nojekyll` present in both trees (an early check of mine
wrongly reported it missing — the `git cat-file` invocation was faulty, and
`git ls-tree` corrected it); repo size 150 MB against a 1 GB limit; no symlinks, no
non-regular modes, no hostile filenames, no Liquid syntax in tracked files.

The next commit — untracking the 43 PDFs, `65b382f` — **built successfully**, and the site
verified live end to end.

**Honest limit on that claim.** The recovery is *correlated* with dropping 55.3 MB of PDFs
from the build input; GitHub's API gave no error detail, so this is not proven causation.
If builds error again, that correlation is the first thing to re-test.

**Consequence.** The live site is current. `DEPLOY_STATE.md` records `ee596fa` as the
commit whose behaviour was exercised in detail and `65b382f` as the current built HEAD.

## 2026-09-02 — House rules move from prose into a pre-commit gate

**Decision.** `tools/check_repo_rules.py` enforces five house rules as code, wired to a
tracked `tools/hooks/pre-commit` via `core.hooksPath` (installed by
`python tools/install_hooks.py`).

| Rule | What it enforces |
|---|---|
| R1 | No tracked PDF/EPUB/DJVU/MOBI/AZW — *"Never commit a PDF."* |
| R2 | Every image in `assets/manuscripts/` has a `registry.json` record |
| R3 | Every registry record points at a file that exists (`--sha256` also verifies checksums) |
| R4 | Every registry record carries a `rights_note` — the field that gates shipping |
| R5 | Local-only trees (`research inbox/`, `research/library/`, `portal/corpus/sources/`, `imagelab/output/`) are not tracked |

**Rationale.** The PDF incident was not a rule failure; the rule was correct and had been
written down the whole time. It was an *enforcement* failure. The one place this repo got
it right is `fetch_commons.py`, which refuses non-free licences in code — which is why the
image corpus has no equivalent problem. This generalises that.

**Verified, not assumed.** Two checks, because a linter that only ever prints OK is worse
than none:

- Against the current tree: **clean, 621 files, all 30 registry checksums verify** — so the
  asset-provenance discipline has actually held since kickoff.
- Against the file list at `ee596fa`, the last commit that *had* the PDFs: **44 violations
  (43 × R1, 1 × R5)**. The checker would have blocked the commit that introduced them.
- End to end: staging a real `.pdf` and running `git commit` was **blocked by the hook**,
  then cleaned up.

**Rejected alternatives.** A CI-only check (catches it after it is already pushed to a
public repo, which is the whole problem). `.git/hooks` directly (untracked, so it does not
survive a clone and every collaborator silently has no gate). A blanket "no binaries" rule
(would fight the 30 legitimate manuscript JPEGs and the 33 MB gallery, and a rule people
have to bypass routinely stops being a rule).

**Consequence.** `core.hooksPath` is per-clone local config, so **each clone must run
`python tools/install_hooks.py` once**. That is now stated in CLAUDE.md next to the rule.
`git commit --no-verify` is the deliberate bypass.

## 2026-09-02 — The history purge is prepared, not performed

**Decision.** `docs/RUNBOOK_purge_pdfs_from_history.md` documents the `git filter-repo`
rewrite that would remove the PDFs from history, and it is **not executed**.

**Rationale.** The ongoing publication is already stopped — blob view, raw URL and API all
404. What remains is that SHA-pinned URLs still resolve. Closing that rewrites every commit
SHA, breaks every existing clone, needs a force-push to `main`, and had a concurrent
session actively committing at the time. That is the repo owner's decision, not a
mid-session cleanup.

**The runbook states the case both ways**, including the argument for *not* doing it: 0
forks, 0 stars, a low-traffic repo, and GitHub cannot guarantee purging every cached object
anyway. It also notes the one thing that argues for acting sooner — **0 forks today**, and
forks are the part no rewrite can reach.

**Consequence.** If the answer is "not worth the disruption", that is defensible and should
be *recorded* in this file rather than left to lapse silently. The runbook also flags that
`DEPLOY_STATE.md` cites SHAs that a rewrite would destroy.

## 2026-09-02 — Abjad Tower: the correspondence table as physics

**Decision.** A *Boom Blox*-style stacking/demolition game (`games/abjad-tower/`) in which
blocks are the **28 Arabic letters**, a block's **mass is its abjad value**, and the six
operations are techniques the sources describe rather than invented spells.

**Rationale.** The sibling alchemy-blocks projects in this workspace
(`AlchemyBlockInvaders`, `AlchemyBalanceTetris`) all share one pattern: blocks carry an
**ontological identity**, reactivity is the mechanic, and a Tome teaches correspondences
through play. Applied here, the natural block identity is not the four elements but the
letters — because the portal's own `ilm-al-huruf` entry supplies a 28-row correspondence
table, and `abjad-numerology` attaches a **number** to every row. A correspondence table
with a number per row is already a game. Making that number the mass turns the table from
a lookup into physics.

**Why these six operations.** Five are grounded (portal entries `talismanic-science`,
`ilm-al-huruf`, `abjad-numerology`; corpus passages on *khalʿ* and the light/dark letters).
The sixth, **Strike**, is deliberately a plain thrown stone with no occult claim — it is
the **control case**, so every other operation has to earn its place against simply hitting
the tower, and the scoring says whether it did.

The sharpest is **Reckoning**: name a number, and any vertical run of touching letters
summing exactly to it comes apart. Runs must be at least two letters, because the source
speaks of *composing words* and because a one-letter run would be trivial when every block
prints its own value. It forces the player to read the tower as an arithmetic object, which
is precisely the claim lettrism makes about the world.

**The one place the source is bent, and it is stated three times.** Mass is
`log10(abjad)`, not abjad. The raw series spans 1..1000 and no rigid-body solver stacks
three orders of magnitude without exploding. The compression preserves the **order** the
tradition asserts and makes the **ratio** ours. Said in `build_letters.py`, in
`data/letters.json`, and in the in-game Tome — not buried in a constant.

**Rejected alternatives.** Four-element blocks (would have duplicated the existing alchemy
games and ignored the material this project actually holds). Invented spell names
(the whole point of the house rules is not doing that). Raw abjad mass (physically
unstackable — tested, not assumed). A hand-rolled physics solver (stacking quality is a
multi-day problem; **cannon-es 0.20.0 MIT** is vendored with its licence instead).

**Naming.** The directory was briefly `kaaba-blocks`. Renamed before anything was built:
the Kaaba is a sacred site and a game about knocking it over would be straightforwardly
offensive. `abjad-tower` is descriptive and grounded in the letter-number system the game
actually runs on.

**Verified in browser, not assumed.** A tower of 21 letter-blocks builds and settles at
3.25 m; all six operations were exercised and produce their stated effects; Reckoning finds
55 valid composite targets in a fresh tower (e.g. ا+ط = 10, ف+ج = 83); a full Demolition
round was played to a win verdict of 275 points; the Tome records discoveries and ranks up;
all three modes set up correctly.

**Two real bugs found by playing it, both geometry rather than physics.** Blocks were
1.0 × 0.6, so three side by side made a narrow cross rather than a square and every tower
tipped itself over while settling — fixed to Jenga proportions (width = 3 × depth). And
block placement solved the aim ray against `y = 8`, the plane blocks drop *from*, instead
of the ground the player is pointing at — so blocks landed far from the cursor.

**Consequence.** This is the third surface in the repo carrying its own copy of three.js.
`games/yusuf-ascent/DECISIONS.md` says the move to a repo-level `vendor/` is due when a
third arrives. It has arrived; this build is the trigger, not the doer, and the README
says so.

## 2026-09-02 — The Impossible Architect: the folio's parts as rules, and six designs

**Decision.** A second game on the Bihzād folio, `games/impossible-architect/`: a
tile-laying route-builder in which each of the 41 cut elements is a piece and **each
piece's rule is the logic its `palace.json` card already gives it** — the stair connects
to any storey because it belongs to none, the brackets stand on nothing, the cupola cannot
be reached, the doors open only when their lock's answer is standing in the structure.
Five more designs specified to buildability in
[`docs/GAME_DESIGNS_BIHZAD.md`](GAME_DESIGNS_BIHZAD.md).

**Rationale.** The request was for a game using the folio's imagery *with the logic of the
parts as mechanics*. The cards written for Yūsuf Ascent already state that logic in one
sentence per part. Turning each sentence into a rule is the most literal possible reading
of the brief, and it tests whether `palace.json` is a real game-data layer: this game
reads it and the region sprites across folders — data and assets, not code — and needed
no new art and no new research.

**Rejected alternatives.** Inventing piece abilities for gameplay's sake (the cards would
then be decoration); an engine (a grid with connectivity rules needs none); building the
strongest *teaching* design first (Station Point) — it was ranked, but the route-builder
uses more of the pieces and more of the reuse.

**Found by a solver, not by eye — twice.** The first version was trivially winnable: a
straight column of surfaces walked into the chamber with no door opened, and a twenty-line
legal-moves-only solver won in fifteen placements. The fix ("doors in the centre column;
the chamber only through a door") broke it the other way: the solver filled the board,
opened six of seven locks, and lost, because a *surface* had taken the one cell under the
chamber that could admit it. The rule that survived both rounds is the painting's own —
**the centre column is the chain: doors only, and doors nowhere else.** Re-run on eight seeds, a
naive greedy solver — which also drops the blind door into the chain — won one (seed 99,
25 placements, no discards). So: winnable, bypass closed by construction, hard for a plan-free
strategy. **Human difficulty is not measured.** That number is here so the next tuning pass
starts from a figure rather than a feeling. **A route puzzle should be checked by a solver
before it is checked by a person, and checked again after every rule change.**

**A destructive slip, recorded.** A patch script opened `index.html` for writing before
reading it, truncating two game shells to zero bytes. One was in git and came back with
`git checkout`; the other had never been committed and had to be rewritten from the
session. The check that caught it was a page that loaded with no title and no scripts.
Rule taken from it: **read, then open for write — never `open(p,'w').write(open(p).read())`**.

**Abjad Tower, same session.** Raising was untuned and too hard (the README said so):
18 blocks to a 3.6 m ring instead of 14 to 4.4. Towers now honour `?mode=&seed=` and
offer "Same tower", so a playtest complaint can name the exact tower it happened on.

**Consequence.** Three surfaces now consume `palace.json` (Yūsuf Ascent, the Visionary
Gallery's comparison, this). The file has earned its keep as a data layer. The Weight of
Brackets — the folio's parts as an Abjad Tower block set — is the cheapest next design,
because the engine, settle detection and scoring already exist.

## 2026-09-02 — The Weight of Brackets, and two ways a physics test lies

**Decision.** Design #5 built as Abjad Tower's fourth mode: the folio's cut elements as a
block set, a pad instead of a floor, a fixed turret over the void, and **the balcony
brackets as the only bodies that may be fixed in empty air** — the painting's "carried on
nothing" as a rule. Weight is a piece's share of the page: derivable, deterministic,
sayable. Verified deterministically to a 450-point win.

**Rationale.** It was ranked cheapest-next because the solver, settle detection and scoring
already existed; it cost the predicted half day and one new engine feature (static bodies).

**Two lessons about verifying physics, both learned by being wrong.**

1. **Wall-clock waits are not simulated time.** The first void test "passed" the wrong way
   — a piece dropped over the void survived — because this browser pane throttles
   `requestAnimationFrame` hard while a tool call is in flight: 3.2 real seconds advanced
   the world by 0.18 s, so the piece was still mid-air when checked. Every earlier physics
   verification in this project that used `await sleep()` was quietly under-simulated.
   **Rule: step the world yourself (`world.step(1/60)` in a loop) and assert on the state
   after N steps.** All Abjad Tower checks now do.
2. **A piece that "slides off a ledge" was spawned inside the turret.** A trace showed it
   already moving at 4.7 m/s on its first frame — the solver hurling it out of an
   interpenetration, not friction failing. Spawn geometry, not physics. **Rule: refuse a
   spawn that overlaps a fixed body** (`spawnBlocked`), and treat any first-frame velocity
   as a geometry error until proven otherwise.

Also: the win test went from "within 1.35 of the turret's centre" — which a 1.5-wide brick
beside a 1.6-wide turret can never satisfy — to **the AABB gap between brick and turret
under 0.12**, i.e. resting against it.

**Consequence.** Four of the six Bihzād designs remain: Station Point, Doors That Give,
Muqarnas, Cartouche. Station Point is next by teaching value.

## 2026-09-03 — The lettrist programme: rival schemes, a notebook, and a mechanic that had to be measured twice

**Decision.** `PUZZLERIDEAS.txt` (the brief for making Ibn Turka's lettrism into mechanics)
is distilled in `docs/PUZZLE_GAME_IDEAS.md`, which also catalogues every puzzle idea so far
with a grounding tag. Two slices built in Abjad Tower: (1) a **data layer** —
`letters.json` gains observable *form* facts and the three *registers*; a new
`correspondences.json` ships **rival schemes, not a table**, each labelled PORTAL / CORPUS /
REPORTED / INTERPRETATION; a shared **Notebook** (`src/notebook.js`, one localStorage key
for the project) with states HYPOTHESIS → EXPERIMENT → OBSERVED → CONFIRMED / DISPROVEN;
(2) a fifth mode, **Temperament (mizāj)**, in which a seed secretly picks which scheme is
the physics and the player records what stands against all of them.

**Rationale.** The brief's central caution is that there is no single medieval meaning of
the alphabet, and its central idea is that the ambiguity should be the puzzle. Rival
schemes with a hidden operative one is that idea made literal. The notebook's frame is the
portal's own `tahqiq-taqlid` entry: a correspondence you have read is held on authority; one
you have tested is verified. So CONFIRMED requires a rival DISPROVEN — three towers standing
under "the cycle" prove nothing if they also stand under "by form"; the player must find the
tower on which the schemes disagree, and `tests/data.test.mjs` proves such letter pairs exist.

**Honesty about grounding.** The hot/cold/dry/moist and four-ṭabāʾiʿ traditions the brief
draws on are cited there from sources *not in this repo's corpus*. Rather than print an
invented "Ibn ʿArabī" table, `correspondences.json` carries a `reported_but_absent` list and
ships schemes that say they are ours. Tagged everywhere: `.pill.REPORTED`.

**Rejected — friction as temperament, after measuring it.** The first translation was
contact friction (complementary 0.5, opposed 0.10). Stepped-physics probes showed six-block
columns of complementary and opposed letters toppling alike under the same shove and the
same lean; friction did not discriminate. Replaced by an active rule: a block carried by an
**opposed** support is pushed sideways at a quarter of g — above what μ 0.10 holds, below
what 0.5 holds — so the friction table still decides, but something now tests it. Self-test:
complementary column stands at 2.74, same-natured 2.75, opposed shears to 0.78. The
measured non-result stays in the code comment, per the house rule.

**Rejected — contacts from the solver.** cannon-es skips the narrowphase for sleeping pairs,
so `world.contacts` is empty for a settled tower — the one moment an experiment is recorded.
A six-block column, settled at 2.74, reported zero. Contacts are now an AABB-overlap test.
Third entry in this file about physics verification; the pattern is that every physics
claim here has needed a number before it was true.

**Consequence.** Slice 3 is the Letter Machine (`games/letter-machine/`): letters as
operators over the sibling alchemy projects' glyph set, Transpose, wafq targets, taksīr —
the first *second* consumer of the notebook, which is what makes it shared data rather than
one game's save file.

## 2026-09-03 (later) — The Letter Machine, and three faults found by re-reading

**Decision.** Slice 3 of the lettrist programme is built:
[`games/letter-machine/`](../games/letter-machine/README.md), a grid puzzle in which the
letters are **instructions** and the alchemical matter is **data**. The design rule that
carries it: **a letter's operation is derived from its written form** — closed binds,
tail pours, dots above raise, dots below lower, an upright stroke holds an axis — so the
game teaches one rule with five clauses rather than twenty-eight facts.

**Rationale.** The brief's explicit warning is against "a giant RPG-style fixed tooltip"
per letter, on the grounds that the traditions are too heterogeneous to support one. A
derived rule answers that: it is generative, it is checkable against the glyph in front of
you, and it produces results the designer did not choose — including that **dāl and kāf
are inert**, because nothing is true of them. Two dead letters out of twenty-eight is what
makes the rule feel like a discovery rather than a list.

**The architectural point.** Transposition is decided by the *same three hidden schemes*
that decide which letters hold each other up in Abjad Tower's Temperament mode, and both
games write one notebook. Disproving a scheme by stacking a tower means the machine
already knows it. This is the brief's "these aren't separate systems, they are different
views of one system" made true in the save file rather than asserted in prose. Confirmed
live: a browser session that disproved `mizaj-light` in the tower opened the machine with
`mizaj-cyclic` already CONFIRMED.

**Rejected — assigning each letter an operation.** The obvious build, and the one the
brief argues against. Also rejected: **inventing a fourth "historical" temperament table**
to fill the gap where Ibn ʿArabī's and Kâtib Çelebi's actual tables would go. They are not
in this repo; `correspondences.json` names them as absent instead.

**Three faults found by re-reading the built games** (full account in
`docs/PUZZLE_GAME_IDEAS.md` Part III):

1. **The Weight of Brackets could be won in two moves.** Its win condition asked that a
   piece *touch* the turret, and a bracket may be fixed anywhere in empty air. The README
   said so as a known gap — which is how it was found, and is also the lesson: **a gap
   recorded in a README is not a gap mitigated.** The new rule is the painting's own: a
   bracket is carried on nothing, but the balcony it carries projects from a building that
   stands on the earth, so the win is an unbroken chain of contact from the pad, with
   brackets as links and never as the origin.
2. **Extraction picked its target letter at random**, so difficulty swung wildly with
   nothing to tell the player which round they were in. Now ranked by the mass standing
   above each candidate, with the seed picking a tier and the round naming it.
3. **The Letter Machine's elements were emoji** and rendered as boxes without the font.
   Now the alchemical triangles, solid against hollow for the barred pair, stated as a
   bend in the data file.

**Consequence.** Next by value: the Impossible Architect's seven doors as **seven
different operations** (brief §23) rather than seven of the same check — the best-built
board here, made replayable, with no new art or data. Then an animated run for the
machine, which is the biggest thing wrong with it as a toy.

## 2026-09-04 -- v2: lettrism as a programming language, and v1 frozen

**Decision.** `games/` becomes **v1 and is frozen** at its current URLs; all new work goes
in `v2/`, which imports no v1 code. v2 rebuilds the foundation: eight primitives derived
from observable facts about the letters, five historical rulesets that genuinely disagree,
the Mafahis's three registers as the execution model, and preview-is-execution as an
engine guarantee. Four questions were put to Ted before starting and all four
recommendations were taken (freeze in place; Golden Dawn ships from its own project so the
engine must prove vendorable; artwork from PD scans plus procedural glyphs; gravity as a
rule letters can change).

**Rationale for freezing rather than evolving.** v2 changes what the games *claim*, not
just how they play. The Impossible Architect's argument is that every rule traces to a card
in `palace.json`; retrofitting a swappable rule engine would have made that sentence false
without anyone noticing. v1 keeps its claims and its evidence; v2 makes its own.

**The three ideas that carry it.**

1. **The instruction set is a consequence of the alphabet.** Every primitive is granted by
   something checkable against a grammar -- and the best of them is the plainest: the six
   letters that never join what follows are why an Arabic word looks like several pieces, so
   here **a written word is one rigid body and those six letters are where it breaks**.
2. **Traditions differ by MOTIVE, not date** -- the portal's own `three-lettrisms` finding.
   That is why Sufi lettrism refuses SEVER, and why the word marked m-r-m is one body there
   and two under intellectual lettrism. Historical disagreement became load-bearing rather
   than decorative.
3. **The execution model is the source's.** Ibn Turka's three Globes of Light (mental /
   written / spoken) map onto plan / run-once / persist, so "compilation" arises from the
   material instead of being imposed on it. Gemination -- a doubled letter -- gives the loop
   without importing one.

**Rejected -- one universal table of letter meanings.** The thing v1 did, and the thing the
brief warns hardest against. Also rejected: inventing an Ibn Arabi or Katib Celebi
temperament table to populate a ruleset. Those sources are not in this repo, so no ruleset
here claims to be theirs.

**Two faults found by failing tests, both recorded in code.**

1. **BIND and SEVER were aimed along the writing line, where the other letters stand.** A
   test that could not pass revealed that BIND could only ever bind a letter to a letter.
   BIND now works *across* the line; SEVER stopped being a world operation and became a
   *parsing* one -- which is more faithful, since non-connecting letters break words, not
   bonds between stones. The better mechanic came out of the failure.
2. **`?v=` cache-busting must match across modules.** `vm.js` importing `./world.js` while
   the app imported `./world.js?v=1` loaded the module twice under two URLs. Harmless here;
   fatal the moment anything uses `instanceof`.

**Consequence.** Next by value: the seven doors as seven *operations* as a v2 app reading
the same `palace.json`; the diagram-as-executable-surface prototype (CrowleyDB's
`treeLayouts.ts` already separates graph from geometry -- and Arabic lettrism suggests its
own surfaces, the 28-by-lunar-mansion grid and the wafq); a v2 notebook recording
predictions before execution; and the graphics pipeline, which has no artwork behind it yet
at all.

## 2026-09-04 (later) -- the overarching principle, and the half of it v2 was failing

**The principle**, supplied by Ted after the first v2 push closed the brief's truncated
last sentence:

> The player should gradually discover that the Arabic alphabet is not merely the subject of
> the game. It is the language in which the game world is written.

**Decision.** Treat it as a test rather than a mission statement, apply it to what had just
been built, and report the result honestly. v2 passed the first half and failed the second.

**The failure.** The Scriptorium listed all eight primitives in a panel, badged every letter
in the palette with its operations, and spelled out each derivation in the letter frame. That
is an IDE with the manual open -- there was no discovery in it at all. v1's Temperament mode
was actually better on this axis, because it hid which scheme was operative.

**The fix, and why it is not just obscurity.** The split comes from the portal's own
`tahqiq-taqlid` entry: what you have READ is held on authority, what you have SEEN is
verified. So EVIDENCE is always shown -- the dots and where they sit, the tail, whether the
form closes, whether it joins forward -- because it is on the page in front of you and
hiding it would make the rule unguessable rather than derivable. The RULE is earned: a
primitive appears only after the player has watched a letter perform it. `ledger.js` is fed
the engine's effect list, so an operation cannot be learned from a panel, only from the
world. A fresh player knows 0 of 8; playing the four tasks teaches 4.

**The other half, which needed building too.** The engine could write the world but not read
it. `reader.js` groups letter-cells by their bonds, orders each body along the writing
direction, and reports what it finds -- never guessing. Two consequences fell out that were
not designed for:

1. **The reading changes with the metaphysics.** The reader groups by bonds and Sufi
   lettrism refuses to sever, so the same three letters read as two words under one
   metaphysics and one word under another. Who is reading determines what the world says.
2. **The world keeps its own history.** A round-tripped word returns the glyphs as written
   but the VALUES record what happened to them -- a sun letter will have assimilated its
   neighbour. Found by a test whose naive expectation (40+30+5) was wrong and whose engine
   was right (30+30+5).

**The task that carries it: The Pen.** Two letters are standing when the player arrives;
they write the third into the gap and read the structure back as قلم -- the Pen, for which
Sura 68 is named, and which opens on the letter nun (already noted in `letters.json`, PORTAL).
The discovery is not that they built a word; it is that the world was already half of one.

**A fault the principle exposed.** Writing beside a letter already standing did not join the
word -- the first version bonded only letters within a single program, so you could never
complete a word the world already had part of. Bonding now runs over every adjacent pair of
letters in the world, which is simply what writing does on a page. Found by trying to build
the task that carries the whole principle, which is the useful kind of discovery: the design
target broke the implementation rather than the other way round.

**Also.** The self-test for a reading task now calls the reader, because it was passing
while never exercising the path the task exists to protect.

**Consequence.** 34 tests, four tasks, all verified live. Still unbuilt and now clearer:
prediction recorded BEFORE execution, which preview-is-execution makes interesting only
across rulesets ("this holds under Sufi and falls under intellectual" is a real bet; "I
predict what the preview just showed me" is not).

## 2026-09-04 (later still) -- games on the engine, and proving the engine portable

**Decision.** Two things, on Ted's steer that the project needed puzzle MODES rather than
another workbench.

**1. The first game: The Pushing Floor** (`v2/apps/pushing-floor/`). A block-pusher where
the moment-to-moment verb is walking and shoving, and the letters are the tools you reach
for when a stone cannot be pushed at all. `v2/engine/agent.js` adds a scribe who walks and
shoves; a bonded body moves as a whole or not at all, and a body containing an AXIS letter
will not be shoved.

**Rationale.** The Scriptorium has exactly one verb, which makes a fine workbench and a
poor puzzle. Giving the game an ordinary, free, constant verb (walking) is what makes the
letters scarce and special: each is spent when written and stays on the floor as a block,
which is the written register behaving as it does everywhere else. Nothing was added to the
engine to make pushing work -- BIND, SEVER, AXIS and POUR already meant these things.

**Levels are checked THREE ways, and the second is the point.** Solvable at all; **not**
solvable without the letters; and, where a level claims a choice matters, that a wrong
choice actually exists. v1's Impossible Architect was solvable *and* solvable for the wrong
reason -- winnable without opening a door -- and a check asking only "can it be won" passed
it. The third check measured the wrong thing at first: it enumerated only the cells the
scribe could reach on turn one and reported "2 of 2 placements are dead ends" for a level
whose winning placement was two steps away. True, and useless. It now enumerates the floor.

**A finding recorded rather than papered over.** AXIS does not fit a step-wise pusher --
you never overshoot, so an unpassable stop is rarely needed -- and POUR wants a stacker,
since this floor is one level of y. Both are left unused and said so, rather than given a
contrived level each.

**2. The engine is alphabet-agnostic, and that is now tested rather than asserted.**
`C:/Dev/GoldenDawnBlocks/` vendors the four engine modules byte-identical and drives them
with the 22 Hebrew letters. The vendoring found **three real couplings to Arabic** -- the
field name `abjad`, a hardcoded abjad ladder for RAISE/LOWER, and a power rule asking
whether a letter's class was `nurani` -- all fixed upstream here rather than worked around
there, because "vendorable" should be true rather than nearly true.

**The Hebrew ground is better than a correspondence table.** The Sefer Yetsirah divides the
alphabet 3 mothers / 7 doubles / 12 simples, which is the text's own structure and is
checkable arithmetic (3+7+12=22). Four primitives fall out, and the best of them is one we
would not have invented: the SY diagram tradition says a simple letter can do "neither cure
nor harm on its own" but acts when letters gather together -- so **twelve of the
twenty-two letters are inert in isolation**, the opposite of the Arabic build where every
letter always did at least its sun/moon operation. Paraphrased from Segol's translation
(Palgrave, 2012, ff. 17b-18a); the book is not redistributed, only the synthesis with its
citation.

Which planet belongs to which double and which sign to which simple is deliberately ABSENT
from the letter table -- that is exactly what the traditions disagree about, so it belongs
in rulesets. The disagreement is already in Ted's own data: `crowleydb`'s thelemic_tree.json
carries an `is_swapped` flag on exactly two paths for Crowley's "Tzaddi is not the Star".

**Consequence.** GoldenDawnBlocks is parked with no app and no glyph artwork -- the
elemental/planetary/zodiacal graphics remain the largest unstarted piece. Next for the
modes: a stacker, which is where POUR and gravity-as-a-rule finally have a game.

## 2026-09-04 (evening) -- The Standing Word, and the demolition that could not be built

**Decision.** The stacker Ted asked for: `v2/apps/standing-word/`. You build with gravity
OFF and then let it in, and what holds is decided by the two rules the alphabet already
had -- a written word is one body, and the six non-connecting letters are where it breaks.

**AXIS finally has a job.** `world.settle()` now treats a cell with `axis` as unfallable,
so an alif -- the one single upright stroke in the alphabet, and therefore the one letter
granting AXIS -- stands on nothing and carries whatever is bonded to it. That is v1's
balcony-bracket rule ("carried on nothing"), arrived at from the letter's own body rather
than from a painting, which is the whole method working as intended: the primitive was
defined months of work earlier and the game that needed it turned up later.

**The best thing in it is that a letter is not good or bad -- its position is.** Rāʾ at the
outboard end of a run is joined to nothing and falls; the same rāʾ inboard, resting on the
pier, carries everything hanging west of it. One rule, read from the page, with opposite
consequences depending on where you put it.

**The forecast is preview-is-execution cashed hardest.** Dashed arrows show every cell that
WOULD fall, computed by cloning the world, switching gravity on and settling it -- the
identical call the commit makes. Measured in the browser: the verified solution forecasts 0
falls; the wrong order forecasts 1, and then loses.

**The level check had to ask a different question, and it caught a real fault.** On the
Pushing Floor the useful second question was "is it solvable WITHOUT the letters", because
walking was a competing verb. Here writing is the only verb, so that is vacuous. The
question that bites is *does it matter which letter you use* -- and **both levels failed it
on the first pass**, because their hands had spare letters and no opening could doom you.
They were solvable and taught nothing. Tightening each hand to exactly the number of cells
needed made every placement matter: 13 of 14 and 23 of 24 openings now lose.

**Rejected -- a demolition mode, and the reason is a real gap.** "Knock it down" needs a
way to break an existing bond and v2 has none. SEVER is a PARSING rule about whether a
newly written letter joins forward, not a cut; POUR displaces a cell but `move()` carries
its bonds along. A demolition level would need a genuine cut derived from some observable
fact this project does not have, or a letter that changes a world rule (the brief's Level
5, which no primitive does), or momentum so a shove can dislodge rather than translate.
Inventing a primitive to fill the gap is exactly what this project does not do, so the gap
is written down in three places instead.

**Consequence.** Three v2 surfaces now: the Scriptorium (workbench), the Pushing Floor
(pusher), the Standing Word (stacker). POUR still has no level. The
elemental/planetary/zodiacal glyph artwork remains the largest unstarted piece, and it
blocks GoldenDawnBlocks from being anything but data.

## 2026-09-04 (night) -- the stale-cache bug, and R6

**What happened.** The Standing Word's second level passed every local check and **failed
on the live site**: the alif that is supposed to stand on nothing fell through the floor.
The deployed `world.js` was correct -- I fetched it and read the axis check in it -- but
the running code was not. `String(world.settle)` in the live page contained no axis check
at all.

**Cause.** v2's modules are imported with a `?v=N` cache-busting token, and I changed
`world.js` without bumping it. Every browser that had visited an earlier v2 build kept
serving the old engine from cache. The fix was live and invisible.

**Why it is the worst shape a bug can take here.** Every one of this project's habits --
step the physics manually, verify against the live URL, replay the solution through the
real input path -- assumes the code being tested is the code that shipped. A stale module
breaks that assumption underneath all of them at once. My earlier "verified live" claims
for the Scriptorium and the Pushing Floor were made in a browser session that may also have
been running a mix of old and new modules; neither depends on the axis behaviour so their
results still stand, but the verification was weaker than I described it as.

**Fix.** All `?v=` tokens under `v2/` set to the same number and bumped together, plus a
new rule in `tools/check_repo_rules.py`:

> **R6** -- every `?v=N` under `v2/` must be the same N. Mismatched tokens mean a browser
> can run a mix of old and new modules.

R6 runs in the pre-commit hook with the other rules, and **was tested by deliberately
introducing a mismatch and confirming it fails**. A check that never fires is worse than no
check, which is a lesson this project has already paid for once.

**The general rule, which is the point.** There is no build step to hash filenames, so the
invariant has to be enforced somewhere. Prose in a README is not enforcement: 43
copyrighted PDFs sat tracked on this public repo for weeks *while the rule against them was
written in CLAUDE.md*. Treat any rule that lives only in prose as unenforced until it has a
check.
