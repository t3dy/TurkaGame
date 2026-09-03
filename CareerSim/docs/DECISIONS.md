# CareerSim Decisions Log

Terse, authoritative. Overturn deliberately, not by drift. Kickoff decisions recorded
2026-08-30 from the design conversation (docs/DESIGN_CONVERSATION.md) + four explicit
user calls made at project creation.

## Kickoff (2026-08-30)

- **Run shape: life-phase sectors** (user-confirmed). FTL structure mapped to the
  biography — Cairo → Isfahan → Courts (branch) → 1420 Pivot → Trials. A run is a full
  compressed life, ~60–90 min. Not pure procedural runs; not a single persistent
  Crusader-Kings-style career.
- **First-slice spine: the encounter engine** (user-confirmed). Capability×affordance
  situations adapted from DungeonAB v6, with Synthesis/Composition entering as simple
  counters/items until Slice 3. The synthesis cosmogram and composition workbench are
  signature systems but NOT the proof-of-loop.
- **Stack: Next.js + Supabase, deployed on Vercel** (user-directed, superseding the
  parent repo's tentative note). Driver: the user wants **player logins and
  player-editable text in logged run chronicles** — a real backend requirement, not
  optional. Engine code stays framework-agnostic under `src/engine/`; anonymous
  localStorage play works before and alongside auth (Slice 0–1 need no backend).
- **VN relation: mine as encounter atoms** (user-confirmed). The 40 choices +
  BIOGRAPHY.md + timeline.json convert into atoms (see ENCOUNTER_ATOMS.md); the VN
  itself is untouched and stays its own game. No shared runtime content layer —
  parent repo's "no premature sharing across game folders" rule holds.
- **Location: `TurkaGame/CareerSim/` as its own full subproject** (user-directed:
  "its own full set of system files as a separate project in a CareerSim subfolder").
  Supersedes the placeholder at `games/career-sim/` (now a pointer). Deviates
  knowingly from the parent's "games live under `games/`" convention because this
  one has its own deploy target (Vercel) and system-file set; the parent CLAUDE.md
  records the exception.
- **Title: "Ibn Turka: The Occult Court"** — the design conversation's own pitch
  phrase. Working title; cheap to change until Slice 2's deploy.
- **The Chronicle is the persistent artifact.** Run history is written as a
  period-style chronicle, editable post-run by its owner ("emended by the author").
  This is the feature auth exists for, and the game's thematic heart (Yazdi's craft,
  handed to the player).
- **Ending = two independent axes** (personal fate × system fate), legacy over
  survival. Historical trajectory reachable, never optimal (carries the VN's
  ENDINGS_AUDIT lesson forward).
- **Grounding tags mandatory on every encounter** (ATTESTED / PLAUSIBLE-GAP /
  INVENTED-COMPATIBLE), surfaced in the UI as inspectable seals — historiographic
  honesty as a feature, continuing the timeline's COMPARATIVE≠contact discipline.
- **Rejected at kickoff** (from the design conversation, on Koushki-fidelity
  grounds): reagent/crafting economy, spell system, single reputation meter,
  numeric-bonus occult skills, generic-alchemy-simulator drift, solemn-only tone
  (bazm comedy is in scope).

## Open items

- Full seven-tier epistemic hierarchy still unsourced (parent DECISIONS.md item) —
  do not build the "depth of mastery" axis until it is.
- Supabase project not yet created; schema drafted at Slice 2, not before.
- Whether chronicles are shareable/public (read-only links) — deferred to Slice 2+,
  needs a user call; default private.

## Slice 0 build (2026-08-30, same day)

- **Static-first, Next.js deferred to Slice 2** (user-directed: "don't bother with
  supabase or vercel deployment yet... give me a static website to test it").
  Slice 0/1 are no-build vanilla JS ES modules (`index.html` + `src/` + `content/`),
  served by the parent repo's `turkagame-site` launch config. The engine was specced
  framework-agnostic anyway, so the Slice 2 Next.js wrap is packaging, not rewrite.
  ROADMAP Slice 0's "Next.js scaffold" bullet is superseded by this.
- **Parent `.claude/launch.json` fixed to serve the repo root** (was `--directory
  site`, contradicting the parent CLAUDE.md's own description); the game is at
  `http://localhost:7521/CareerSim/`.
- **Time model v1**: node visit = 1 season, budget 7, departure node free; at time 0
  the Road Home fires automatically. Depth-vs-breadth (revisiting a node digs deeper
  into its encounter chain) is the phase's core strategic texture.
- **Boost mechanic v1**: met `boosts` clauses multiply the two best outcome bands'
  weights (×(1+n)) — preparation tilts the ladder, shown as "favored by …".
- **Cache-bust discipline inherited**: `?v=N` on module/CSS URLs, bumped per change
  (parent repo's standing rule; `index.html` is the version source of truth).

## Slice 1 build (2026-08-30, third session)

All five phases built and verified playable. Decisions made during the build:

- **Career systems live in `src/engine/career.js`**, separate from the encounter
  engine: exposure tiers, obligations, contracts, and the ending matrix. Keeps
  `engine.js` about situations-and-options only, which is what makes it portable.
- **Obligations charge per action, not per season.** The judgeship costs a season
  every time the player *does* something, so the office competes with the work
  directly rather than as a flat tax. Neglect (can't pay) applies a penalty and
  writes `neglected_bench` rather than blocking the action.
- **Contracts settle at phase end** (`settleContracts`), not only at their deadline.
  Found by playtest: an open commission could outlive the phase and quietly
  evaporate, so a promise had no consequence. A commission now always comes due.
- **`LEGACY_NOTES` is the marginalia table** and the lint's source of truth — the
  Chekhov's-gun test imports it directly rather than regex-scanning, so a content
  author who adds a memory flag must add its ending line or the build fails. This
  is what makes "every choice echoes at the end" enforceable rather than aspirational.
- **Exposure gates content** via `exposure_min` on encounters (the second and third
  inquisitions require it). Pressure escalates because the player succeeded, which
  is the thesis; it is not a random event table.
- **Phase tagging on every encounter** (`phase: N`), enforced by test — an encounter
  can never leak into the wrong phase's pool.
- **Assets sourced from OCCULTIMGDB via the provenance CLI**, 8 new images (registry
  27 total), chosen per phase for what the encounter is actually about (Hārūt and
  Mārūt for the inquisition, since Qurʾan 2:102 is the proof-text the charge rests
  on). Deliberately **rejected two modern diagrams** (a modern "levels of heaven"
  redrawing and a modern muqaṭṭaʿāt roundel) despite good fit: this project's rule
  is historical material, not modern illustration of it.
- **A test now lints plate→registry**: an encounter cannot reference an image that
  has no provenance record.

## Ending-fate tuning (2026-08-31)

- **Fate ordering is the design, not an implementation detail.** `MAN_FATES` is
  ordered so the third tribunal's outcome is read first, then how he survived it,
  and only a life no tribunal ever touched is judged on career shape (imperial
  standing, the bench, exposure level). Rationale: the tribunals are the dramatic
  spine of this biography, so a run must never "fall through" to a verdict that
  ignores the most consequential thing that happened in it — the Slice 1 playtest
  filed a defiant third-tribunal survivor as a quiet provincial judge.
- **14 personal fates, 9 system fates.** Added fates for the paths the content
  already supported but the matrix ignored: fleeing before the verdict, giving a
  name, surviving by refusing, being condemned along with the book, and the two
  no-tribunal lives (never visible enough to summon vs. visible and never acted on).
- **`Complete, and Unread`** (synthesis ≥7, transmission low) is the tuning's most
  important addition: it names the specific tragedy the meters were already able to
  produce — he understood everything and transmitted none of it — which previously
  collapsed into the generic "Died With Its Author".
- **`Carried in One Hand`** makes the Yazdī relationship legible as a *system*
  outcome rather than only a marginalia line; it is the attested transmission route.

## Full-loop audit + educational layer (2026-08-31, fifth session)

AUDIT.md created (evidence-based; grep/test/play, not recall) and its do-now items
executed the same session:

- **Artifacts made load-bearing**: `artifact:` joined the requirement grammar, a WORKS
  margin block shows composed works with glosses, and the trials read them — the
  Ṭahawī Circle favors the firm stance at the third tribunal, the summa favors the
  textual defense at the second, the horoscope favors the patron gift. Rationale:
  preparation must create verbs; a composed masterwork that changed nothing violated
  the project's core loop promise.
- **No dead Quintet branches, as a lint**: kīmiyā and sīmiyā were granted in Cairo and
  never spent anywhere (grep-proved). New content spends them (ink chemistry at the
  warrāq's; the decoy-chest escape at the eastern gate) and a test now fails the build
  if any science is unspent post-Cairo.
- **The educational layer is the gloss apparatus**: `content/lexicon.js` (23 real terms,
  defined from the research) auto-glossed in situation prose with dotted underlines;
  lint requires every defined term to be reachable in play. Rejected alternative: a
  separate glossary screen — glossing at the moment of encounter teaches; an appendix
  is homework.
- **"The Attested Life"** ending folio: the historical record, row by row, each paired
  with what this run did instead. The counterfactual thesis finally has its witness.
- **Marginalia precedence**: contradictory flag pairs (taught_widely+hoarded) merge
  into a line about the tension itself.
- **+4 encounters** (62 total): isfahan_inks (Smith's artisanal epistemology),
  pivot_globes (the Three Globes of Light, ATTESTED), trial_checkpoint, trial_letters.
- **Cache-bust discipline bit us again**: engine.js imported state.js?v=2 after state
  changed → browser ran stale grammar while node tests passed. Every internal module
  version now bumps with its file; verified by re-testing the artifact boost live.
- **Deferred, recorded in AUDIT.md**: demand profiles (SYSTEMS §6), citation-grade seal
  sources, the Codex trophy page, people cap-tag coverage.

## The witness system (2026-08-31, sixth session)

The Career Sim now publishes finished runs as permanent scholarly witnesses.

- **The game stays on GitHub Pages; only the service is on Vercel.** The alternative
  — deploying a second copy of the game to Vercel so publishing is same-origin — was
  rejected because two copies of the game drift. `witness-client.js` posts
  cross-origin and the service sets CORS. One game build, one service.
- **Vercel Blob, not a database**, per `PLAYTHROUGH_WITNESS_ARCHITECTURE.md`. One JSON
  document per witness plus a small `index/{id}.json` summary row written at publish
  time specifically so a future researcher's desk can list thousands of witnesses
  without fetching full payloads.
- **Two keys per witness, hashes only.** Publishing mints a player key and a scholar
  key; the service stores `sha256` of each and derives the *hand* from which hash a
  supplied key matches. Players get the same editing powers as the scholar — the
  distinction is attribution and priority, not permission — which is what makes a
  scholar-hand correction sortable into a review queue later.
- **Prose is frozen at publish, not regenerated.** The witness snapshots the situation
  text, every option, and the chronicle line, keeping `orig` beside `current`. A later
  content revision must never silently rewrite a document a scholar has annotated.
  This is the one place the DungeonAB house habit (regenerate narration from
  `seed + choices`) is deliberately *not* followed, and the reason is recorded here so
  it is not "fixed" by a future session.
- **The record includes what was *not* chosen.** Locked options travel with their
  requirements, so a reviewer can see the road not taken and correct the design, not
  just the prose.
- **Editorial layers are append-only and mechanically inert.** `revisions`,
  `annotations`, `illustrations`, `preface` are reserved in the payload and start
  empty; when `api/edit.mjs` is built it must reject writes touching `meta` or
  anything mechanical. Enforce server-side.

## The editor (2026-08-31, seventh session)

The scholar's hand can now correct a published witness. What was reserved in the payload
last session is a working endpoint (`witness/api/edit.mjs`) and an editing UI in
`witness/public/w.html`.

- **The allow-list, not a denylist, is the invariant's enforcement.** Only `situation`,
  `outcomeText`, `chronicle`, `optionLabel:<n>` and `optionDetail:<n>` can be revised.
  Bands, grounding tags, sources, meters, verdicts, plates and lock reasons are the
  simulation's testimony and are refused with a 400 that says why. `FORBIDDEN_FIELDS` is
  named explicitly beside the allow-list so the protected surface is legible rather than
  inferred, and both are covered by a test that walks every forbidden field.
- **Editorial ops are separate immutable blobs, folded on read** — `edits/<id>/<ts>-<rand>.json`.
  The witness document written at publish is never rewritten. This replaces the obvious
  design (editorial arrays living on the witness document, rewritten per edit), which was
  built, deployed, and lost every edit it was given. See [PIVOTS.md](../../docs/PIVOTS.md)
  P-CS1 for the evidence.
- **Both hands get the same powers.** A player can revise and annotate exactly as the
  scholar can; only attribution and priority differ, per last session's decision. The
  hand is derived from *which* key hash matched, never from a client claim.
- **Concurrency is stated, not solved.** Two people editing one passage both persist, in
  timestamp order, and the later reading stands. Nothing is destroyed, so "last write
  wins" here costs a reader one extra click, not an edit. The edit form says so.
- **The `index/{id}.json` summary rows no longer carry editorial counts.** They are
  written once at publish and describe immutable facts only. The researcher's desk should
  derive "has a scholar touched this" from a `list({ prefix: 'edits/' })`, which is
  always correct — an incrementally-updated counter on a mutable blob is the same trap
  the fold was built to escape.

## The loop repairs and the pressure ladder (2026-08-31, eighth session)

Measured defects from MECHANICSISSUES.md, fixed and re-measured same day. All 48 tests
pass; figures from `tools/simulate-runs.mjs 2000`.

- **The draw is random-among-eligible, with no priority field.** Every sequence the
  content needs is already a `when` predicate, so a priority lever would have joined
  `opt.time` and `state.expectation` as implemented-and-unused. If an ordering ever needs
  authoring, add the field then. One test asserted the old first-eligible order and was
  rewritten to assert the `when` chain instead — the thing the design actually guarantees.
- **Injections: the world gets first refusal on a season.** A phase may declare
  `injections`; an eligible one pre-empts the node draw (`engine.js:drawInjection`).
  The tribunals (P5) and the patron's commission (P3) are injected, and a new phase-less
  **pressure ladder** (`content/pressure.js`: rumor at exposure 3, copy-request at 5,
  written denunciation at 7) fires in whatever phase the threshold is crossed. This is
  ECONOMY.md §3's "injection, not eligibility" — exposure now *does* something in every
  phase, and the third inquisition resolves in ~60% of runs instead of 31%.
- **Quintet ranks now climb through the run**: bench grants hīmiyā 1 (the judgeship as
  the school of political operation), ink-work grants kīmiyā 2, the muqaṭṭaʿāt study
  grants līmiyā 2, the Ṭahawī Circle grants līmiyā 3. Gates rescaled to reachable tiers
  where the fiction allowed (`isfahan_study_two` asks rank 1 and *grants* rank 2 — the
  insight is the promotion). Zero dead gates, lint-enforced.
- **Reachability lints** (`tools/test-reachability.mjs`): every capability gate must be
  satisfiable by a legal run; every glossary term must appear where a gloss can fire.
  Verified red-green by reintroducing the hīmiyā bug and watching it fail.
- **Glossing extended** to option detail and outcome text (was situations/intros only):
  glossary reach 41%→63%, and muqaṭṭaʿāt/qāḍī/samāʿ/majlis/Ṭahawī-Circle now appear in
  glossable prose. Two lexicon terms remain defined-but-thin; the lint holds the floor.
- **Phase V anchoring pass** (WRITINGAUDIT §4): the recant offer names Qāsim-i Anvār's
  1427 expulsion, the student-copy scene names Yazdī's autograph copy, the testament
  names the five wandering years, the patron's door names the colleagues who engineered
  the charge. INVENTED-COMPATIBLE scenes now nest inside attested framing, per the
  WRITING_GUIDE's own rule.
- **Deliberately not done**: the ECONOMY §2 meter rescale (a full content pass; fate
  distribution is left modal-`source_code` until inputs stop saturating), expectation
  reads, and the §2 gradient pass. Recorded in NEXTSTEPS.

## The economy retune and the gradient pass (2026-09-01, ninth session)

The remaining MECHANICSISSUES queue, executed and measured (`simulate-runs.mjs 2000`,
both modes; 49 tests pass).

- **Synthesis demoted mechanically, converted deliberately.** All +2/+3 synthesis grants
  dropped one step (14 sites, one regex — the key only exists in meters objects); then
  P4's showing-and-moving moments (the Ṭahawī Circle, the observatory arguments) hand-
  converted to Demonstration/Transmission, and the argued tribunal wins now pay
  Demonstration. Median synthesis 10→9 at run's end, unpinned at p25 7.
- **`min_exposure` on outcome bands** (engine): a band can join the ladder only once the
  world is watching. The missing disasters are authored as what Denounced makes possible
  — the same procedural dodge that works quietly at Unremarked becomes the rival's
  favorite story at Watched. Tested red-green.
- **Fate retune, after the inputs stopped saturating** (the order ECONOMY.md §7 insisted
  on): `source_code` now requires transmission≥9, synthesis≥8 **and imperial≥1** — a
  cosmology cannot become imperial without the empire — falling 67%→23% and losing modal
  status to `scholarly` (33%), which is the honest default fate of a scholar's work.
  `broken` raised to exposure≥9 because the pressure ladder pushed the *median* run to 8,
  and the attested wandering-exile fate was being swallowed by it.
- **The Ibn Turka problem now measurably holds.** Under greedy (skilled-proxy) play the
  system triumphs (`source_code` 47%) while 60% of those runs end with the man broken,
  an informer, a recanter, or a fugitive. Maximal success is maximally dangerous — to
  him, not to it. This is DESIGN.md's thesis, observed in simulation for the first time.
- **15 free options gated** (no-gate encounters 24→9), preferring cross-phase memory —
  the atelier reads the warrāq years, the cipher service reads the ink chemistry, the
  qualified students read the scholarly treatise. Cross-phase read sites 9→25, hitting
  the ENCOUNTERSNEXTSTEP target, and every conversion kept ≥1 free option (lint).
- **The analyzers learned about contract memory** — `contract.reward/failure.memory`
  writes were invisible to the memory lints, which surfaced as a false "read but never
  written" on `boon_delivered`. The measurement was wrong, not the content; both fixed.
- **Explicitly stopped tuning overlap.** 52% vs the <40% target after every cheap lever:
  the remaining distance is Slice 4 pool depth, and further tuning would be motion
  without progress. Recorded in NEXTSTEPS so nobody re-tunes it.

## The acquitted road and the cautious probe (2026-09-01, tenth session)

Both items came out of writing ENDINGS.md — the doc audit found them, the same session
closed them.

- **`trial_third` gained "Put the household between you and the panel"** — survival by
  patronage (`third_stance: 'patron'`), the road the `acquitted` fate's own text
  promised and no content had written. Requires imperial ≥ 2, boosted by kept promises
  (`expectation`, `boon_delivered`); its disaster band (`min_exposure: 9`) is the
  household declining at full notoriety. Fires in 5.8% of random runs.
- **`cautious` simulation mode** (lowest-expected-exposure play) settled ENDINGS §8's
  open question and found the better fact: cautious play holds exposure at median 0 and
  its modal fate is `recanted` at 74% — the careful player wins the first tribunal, is
  offered the quiet arrangement, and signs. Recorded in ENDINGS.md as a property to
  preserve: caution costs recantation, not obscurity.
- **Two more commissions** (the Qurʾan layout for Bāysunghur, the inscription
  commissioned mid-trials — both attested patterns) with full contract shape.
  Contracts/run 0.62→0.66; the ≥2 gate honestly needs contracts on unconditional
  paths, recorded in the gates list.

## The career-pressure pass (2026-09-01, eleventh session)

The loop's identity item — "serve the office, the patron, the book, the students, or
the network?" — finally has teeth in every phase. Measured before/after with
`simulate-runs.mjs 2000`.

- **Standing obligations III–V**: the patron's retainer (granted with the patron,
  dropped at the court's end — a retainer cannot outlive its court), the summa itself
  (granted when the book begins, dropped when the first summons ends the Pivot — the
  book is finished in 1420), and the summonses (granted at the first tribunal). Each
  with a neglect consequence and a marginale.
- **`opt.time` finally used** at three long-work sites (Yazdī line-by-line, the
  muqaṭṭaʿāt foundation, writing the summa twice), each +2 seasons, with a vermillion
  cost marker on the option button — a hidden cost would break UI guarantee #1.
- **The spine nearly broke, and the fix is recorded**: with the summonses billing every
  action, `trial_first` — an ordinary node draw — often never fired in the shortened
  phase, and third-resolution fell 60%→44%. `trial_first` joined the injections (the
  departure node was already named "The First Summons"; a summons is not an errand you
  elect) and Phase V went to 8 seasons. Third-resolution now **74%**, the best measured.
- **Fate spread after pressure**: no man-fate above 25% (harried 22%, down from 56% at
  audit); `exiled` at 5.5%; under greedy play the modal skilled fate is now `acquitted`
  at 29% — survival by patronage, owned. The thesis shifted from all-ruin to
  ruin-or-ownership, recorded in ENDINGS.md §7 as the property to preserve.
- **Contracts 0.66→0.85/run** (merchant's nativity in P2 — a recorded deviation from
  "III+ only", the fiction demanded it; the observatory tables in P4). The ≥2 gate
  likely needs offer-injection, not more sites; noted in the gates list.

## The stakes-legibility pass (2026-09-02, twelfth session)

Prompted by the standing question: does the player understand what is at stake in every
choice? Audited all 212 options mechanically (dominant consequence vs. what the text
says) before touching anything.

- **The prose was largely acquitted.** The audit's risk-word heuristic flagged 32
  options; on reading, most flags were false — the details do signal ("a house that
  could burn", "Glory, in evidence", "quotable without your hedges"… now). Four details
  genuinely undersold their consequence and were sharpened to name it: the nativity is
  *a practice, which is a paper trail*; answering the denunciation *makes it a
  correspondence*; Persian makes the book readable *to accusers too*; the astrological
  answer is *quotable without your hedges*.
- **The real gap was mechanical commitments, and the fix is systematic, not prose.**
  Obligations and contracts rode options with no disclosure — the patron options never
  said a retainer came with them. Now every binding commitment is stated on the button
  (⚖ takes on / ⚖ sets down / 📜 a promise with its deadline *and* requirement, via
  `checkReq`'s human text) and confirmed on the resolution screen. Symmetry — warned
  before, confirmed after — is what makes the ledger honest, and it means a player can
  see they are about to promise `demonstration 3` while holding 1.
- **Situations checked and left alone**: the eight shortest all set stakes cleanly
  ("men will march on your arithmetic"; "Silence is also an answer"). No rewrites for
  rewriting's sake.

## Citation-grade seals (2026-09-02, same session)

AUDIT.md §4.3, deferred twice since the first audit, closed. `content/citations.js`
resolves each seal's repo-internal source pointer to a real citation (the papers from
`research/notes/` frontmatter: "Prologue to Pythagorean Renaissance" — Intellectual
History of the Islamicate World, 2025; "The Occult Court" — Al-Masāq, 2025). The
pointer stays for the reviewing scholar; the citation joins it in the seal tooltip;
and `logEntry` now writes `sourceCite` into the witness payload, so a chronicle read
years from now, off this site, still says whose scholarship each seal stood on.
Also: the hīmiyā-under-interrogation grant (ECONOMY §6's last open note) — walking
unbroken out of the third tribunal awards the rank, in the one room that can.

## The researcher's desk and simulated witnesses (2026-09-02, thirteenth session)

NEXTSTEPS items 4 and 5, built as the pair they were designed to be.

- **`witness/api/desk.mjs` + `desk.html`** — admin-only (DESK_KEY env var; the key
  lives only in the gitignored `witness/.admin-key` and was piped into `vercel env`
  without touching a chat or a commit). Editorial state is derived from the immutable
  `edits/` blobs on every request, never from counters — the P6 lesson applied where
  it was about to be needed. The headline view is the scholar-priority queue: every
  revision and marginale across all witnesses, grouped by the encounter it corrects,
  scholar hand first. One screen answers "what has the scholar objected to, and where?"
- **`tools/publish-simulated.mjs`** — plays complete runs through the real loop
  (mirroring main.js including injections and the node-open-while-summons-pending
  rule), captures the full scholarly log via the same `logEntry` the game uses, and
  publishes with `origin: 'simulated'`. `--dry` writes payloads to files. Three
  random-play witnesses published; the desk lists nine total.
- **One deploy cycle lost to a newline**: PowerShell's pipeline appends `\n` when
  piping into a native command, so DESK_KEY arrived with a trailing newline and the
  right key was refused. Fixed with a documented `.trim()` on both sides of the
  comparison — a newline must never be the difference between authorized and not.
- **The desk exposed its own first chore**: the three `TEST —` editor-verification
  records now sit in plain view. Delete/archive controls are the recorded next nicety.
