# DECISIONS: append-only

Format: date · decider · decision · why · what it rules out.

## 2026-09-27: kickoff ("build the game", after `../docs/PLAN_TURKA_VITA_GAME.md`)

Ted approved the plan by saying "build the game" and did not answer its four open questions. Each is
taken at the plan's recommended default and **flagged as assumed**, so Ted can overturn any of them.

1. **Subproject `TurkaGame/TurkaVita/`, forked from PLOTINUSGAME's pipeline by copy, no shared code.**
   Why: the corpus lives under `../portal`, it deploys through the existing Pages repo, and the
   workspace rule is "documents, not code". Rules out: importing PLOTINUSGAME scripts.
2. **The 2012 Yale dissertation (`SRC-610EE1D6BA`) is the spine source** for the life and the works;
   the shorter papers and `../docs/BIOGRAPHY.md` are secondary until reconciled (`docs/TURKA_AUDIT.md`).
3. **Slice 3 first (1422–1427)**, then backfill Acts I, II, IV. *(assumed, Ted did not say)* Why: densest
   stretch, both of Ted's emphases overlap, half the datable works. Rules out: chronological build order.
4. **Act V is the unnamed copyist of MS Majlis 10196, not Yazdī.** *(assumed)* Why: the attested facts
   (Yazdī checked copies and attended teaching, colophon f. 119a) fall short of "Yazdī compiled it"; the
   copyist is unidentified in the dissertation.
5. **No older doc is corrected until Ted has seen `docs/TURKA_AUDIT.md`.** *(assumed)* Why: the 2025
   papers may disagree with the dissertation; the audit lists every difference first.
6. **No Persian edition of the apologies is fetched.** *(assumed; a download needs Ted's yes.)* The 1426
   scene uses only the arguments Melvin-Koushki reports.
7. **External events are fixed points; the player's margin is attachments, works and defences.** Each fixed
   point is an `attested` invariant the linter enforces; a branch that avoids one is labelled counterfactual.
8. **The duress rule replaces Plotinus's direction-of-transmission rule.** `HELD_KINDS = {letter, colophon,
   autograph, early_work, work}`. Only what he wrote freely can support a claim about what he *held*;
   apologies, creed tracts and reports cannot. A commitment to a position that claims his conviction and
   leans only on those is charged `coerced_testimony`.
9. **The game does not know who he was.** Melvin-Koushki's reading is one lens with visible attribution.
   Nothing scores a commitment against a designer's answer. The game's own readings ("design inference")
   stay under a quarter of all bearings.
10. **Career state is pressure, never a score** (Plotinus's own rule), using CareerSim's idiom. Keys:
    `court.<slug>` favour, `press.<kind>` pressure. Both additive; gates are `requires_min`/`requires_max`.
    They are game abstractions, said so on the board.
11. **Engine additions over Plotinus's**, mirrored in Python and JS with a parity test: additive `court.`
    and `press.` keys, threshold gates, the *composer* (a work assembled slot by slot, sent only on
    "Send it"), the *sorter* (collection ordering scored by Kendall distance to the real manuscript order).
12. **Port 7560, launch config `turkavita`** (in `C:\Dev\.claude\launch.json`).
13. **Quotations are enforced by the build**: a quoted span of five or more words in an evidence artifact
    must appear on the cited page; none may exceed 40 words. Printed page is checked against the running head.

## 2026-09-28: Ted's standing rule on corrections

14. **Always correct older documents to match the most current information.** Ted (2026-09-27, after the game was live): "continue. always correct older documents to match the most current information."
    **Supersedes decision 5** (older documents were held until Ted saw the audit). The corrections were made on 2026-09-28 across `TurkaGame/`, `IslamicateOccultPortal/`, the wiki and the workspace files, to the table in `docs/CORRECTIONS_BRIEF.md`; each document carries a "Corrections (2026-09-27)" section or a dated entry. Saved to memory as `feedback-correct-older-docs`.
    **Why:** an audit that lists errors and leaves them in the documents means the next session reads the wrong picture.
    **What it does not override:** `games/FROZEN.md` (game code and data stay as they are; their documents are corrected and `games/visual-novel/ERRATA.md` lists the premises), archived version snapshots, raw conversation transcripts, and already-published witnesses.
15. **Where a live app's content states something the sources do not, correct the text, keep the mechanics.** The Tribunal's refusal outcome stays (the *Prologue* says he refused), but it is no longer presented as "what he actually did": the dissertation shows two apologies. CareerSim's phase labels and source strings are corrected; its encounter ids, effects and gates are unchanged.

## 2026-09-28: "use your judgement and do what you have to do to make the best game that actually works"

16. **Illustrations: period paintings, manuscript pages and printed sources only** (Ted, 2026-09-28: "begin with our collection of illustrations and source more from the web. always use period paintings, manuscript or printed sources").
    39 plates in `game/img/` (23 paintings, 14 manuscript pages, 2 printed pages), 5 from our collections and 34 new from Commons through the rights gate; all in `assets/manuscripts/registry.json` with provenance; 38 PD/CC0 and one CC BY 4.0 (its credit line is displayed). No object photographs (astrolabes, globes), no modern photographs, no renders; the portal's image catalogue was rejected wholesale (raster extracts of copyrighted PDFs with UNDETERMINED rights, including the Ṭahawī circle of MS 10196, which would have been ideal). Every plate is captioned "Illustrative plate, not a depiction of this event", with a one-sentence `relevance` saying what it is and is not. Twelve scenes have none rather than a dishonest one. `docs/PLATES.md` is the provenance table and the rejected list; `tests/test_plates.py` enforces the rules.
17. **The rights gate now blocks NC and ND licences** (`imagelab/scripts/fetch_commons.py`): its `FREE_KEY` also matched `cc-by-nc-4.0` and `cc-by-nd-4.0`, and `FREE_NAME` passed any "Creative Commons" name including NonCommercial. Found by the plates pass, fixed at the source and checked on eleven licence strings.
18. **Save and resume** (localStorage, guarded): `engine.snapshot()`/`restore()`, autosave after every step, "Continue" on the title. A run is a long sitting; a game that loses it on a refresh does not work. `tests/test_snapshot.py` cuts 80 runs at random points, including mid-scene, restores through JSON and requires the same final state.
19. **Act title cards, a progress counter and a first-scene hint.** The act cards say only what the act's scenes already establish; the plate on the card sets the period.
20. **The margin: an outcome the record can be measured against.** The four bars measure fidelity to the record; the game abstractions (exposure, enemies, livelihood, students, works) had no stake. The ending now sets the player's life beside where **the record's own course** leaves those abstractions (computed at export by walking the historical path), so following the sources and doing better than the record pull against each other. The game does not say which is right, and labels the numbers as abstractions. Rationale: with a visible "documented" chip and no rival goal, the documented option was always the right answer.
21. **Export of a run** ("Copy your record", "Download it"): each scene, the player's choice, its label, and what the record says.

## 2026-09-28 (continued): two independent audits of this pass, and a real perf fix

22. **QA playtest (first-time player) found 3 blockers and 9 major issues**, all fixed: a save-wiping "How to play"
    button, unconfirmed erase actions, a self-contradicting saving claim, an off-screen Court board panel, leaked
    developer ids (`CL-0061` etc.) and "MK" in player-facing text, untranslated jargon with no glossary, a dossier
    table with no column headings, a fiddly sorter with no comparison feedback, and squeezed mobile option text.
    All confirmed fixed by six full automated playthroughs post-patch: 0 console errors, 0 developer-text leaks.
23. **The "agency" content pass (rulings/density/option-shape/margin trades) was independently audited**
    (`research/notes/AUDIT-A3-rewrite.md`, a different agent from the one that wrote it): **zero FIX-level findings**
    across all 36 rewritten scenes; every one of AUDIT-A2's 18 flagged scenes was resolved to its suggested wording
    or better. Two MINOR findings from that audit were applied: SCN-0305's cost line now hedges "a ruler whom
    Melvin-Koushki reads as distrusting..." instead of stating it flat; CL-0210/CL-0211's `proposition` and
    `mediation.who` no longer say "the researcher" (pipeline voice visible in the evidence drawer), now "this
    project's own collation ... not stated by him".
24. **Perf: a full-scene re-render on every ruling/pick/sort click was re-fetching the scene's plate image from
    the network each time** (confirmed via `read_network_requests`: repeated 200s, not 304s, for the same URL —
    the known `python -m http.server` no-cache-headers gotcha, see `../CLAUDE.md`). Measured up to ~5.9s per
    scene under automated rapid-fire clicking. Fixed with a session-lifetime blob-URL cache
    (`plateSrc` in `game/ui.js`): a plate is fetched once and referenced from cache on every later render.
    Confirmed after the fix: no scene exceeds 100ms across a 20-scene run (previously several exceeded 4000ms).
    This is chiefly a local-dev-server cost (GitHub Pages sends real cache headers), but the fix removes a
    visible image-reload flash regardless of host and was worth keeping.

