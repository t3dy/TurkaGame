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

## 2026-09-28 (continued): plate attributions independently verified

25. **All 39 plates' attributions were independently checked against live source pages**
    (`research/notes/AUDIT-A4-plates.md`): 39/39 CONFIRMED, zero serious or minor findings in `game/plates.js`
    itself. Every uncertainty the illustrator flagged (the Lisbon frontispiece's disputed date, the giraffe
    embassy's disputed date, several unstated holding institutions) was verified to hold, word for word, against
    the actual Commons page. One unrelated, pre-existing registry record (`18f0369d-...`, `sufi-ursa-major`, not
    part of this pass's `tv-` prefixed additions) still said `institution: "Wikimedia Commons"` with no shelfmark;
    `plates.js` already carried the correct Bodleian Library/MS Marsh 144 attribution, so the registry record was
    corrected to match (a metadata fix, not a rights or fact change).

## 2026-09-28 (continued): second cold playtest, one live composer bug fixed, two minor sub-fixes closed

26. **A live composer bug from the first QA pass was confirmed still present by a second, independent cold
    playtest** (`research/notes/QA-playtest-2.md`): in SCN-0303 (the Suʾl al-Mulūk for Bāysunghur), choosing "No:
    keep politics out" at S2 did not disable S3 ("What does the prediction rest on?") or S4 ("What makes it
    lawful to read a fate from a name?"), which only make sense when S2 says there *is* a political prediction —
    so a player could fill in a prediction's basis and precedent for a letter that, by their own S2 pick, makes
    no prediction at all, and the game would narrate the contradiction as if it were the sent text. Fixed with a
    new, minimal schema field, `requires_pick: {slot, options}`, on a composer slot: the slot only applies while
    the named earlier slot's current pick is one of `options`. Added to `schemas/artifacts.schema.json` (via
    `scripts/_mkschema.py`) and to both engines identically — `scripts/narrative_lib.py`'s `slot_required()` /
    `composer_effects()` and `game/engine.js`'s `slotRequired()` / `composerEffects()` / `pick()`'s completion
    check — plus `game/ui.js`'s composer render, which greys a not-currently-required slot to
    `<fieldset class="slot skip">` with "Not needed — an earlier choice already rules this out." and drops it
    from the running-cost total and the post-Send reveal. Applied to SCN-0303's S3/S4 (`requires_pick: {slot:
    "S2", options: ["a"]}`); SCN-0406, the only other multi-slot composer scene checked for the same shape, has
    five mutually independent slots and needed no change. Verified live: picking S2 = "No" greys S3/S4, "Send it"
    enables without them, and the sent letter's reveal shows only the S1/S2 cards. `python tests/run.py` (47
    tests) and `simulate.py --random 10000` (0 stuck, 0 unreachable choices) both pass unchanged, since an
    unrequired slot simply stops contributing to `composerEffects`/`composer_effects` rather than changing how
    either is computed for a slot that does apply.
27. **Two minor wording/feature findings from the same playtest, both closed.** (a) SCN-0307's S2 "Abuse them"
    option called the accusers "mafiosos (Melvin-Koushki's rendering)" — flagged twice now (once in the first
    audit pass, still present in the second) as an anachronistic aside the "Why? Show the evidence" drawer
    already covers by citation; changed to plain "gangsters", aside dropped. (b) SCN-0203's "What the sources
    establish" fixed box still stated the Fuṣūṣ commentary's colophon dates in full ("20 Ṣafar 814 (13 June
    1411)... corrected in Fars on 19 Dhū l-Ḥijja 817 (1 March 1415)") — the exact kind of manuscript-dating
    clutter the first pass asked to move behind the "More on the sources" toggle, missed for this one invariant.
    Shortened to "A colophon dates your commentary on Ibn ʿArabī's Fuṣūṣ al-Ḥikam to 813-14/1411, later corrected
    in Fars," with the full dates moved into the existing `detail` field.
28. **The sorter's live-preview sentence, dropped rather than fixed in the first pass, was restored.** The first
    pass's "How to play" text used to promise "the volume opens with X and closes with Y" as you reorder rows;
    when the comparison-table feature shipped, the promise was removed from the instructions instead of the
    feature being added, which resolved the false-promise contradiction the first playtest flagged but lost real
    functionality the second playtest still missed. `game/ui.js`'s `sorter()` already computed `first`/`last`
    from the draft order (dead code left over from the original design) — added one line rendering "As you have
    it now, the volume opens with **X** and closes with **Y**," live under the instructions, and restored the
    "How to play" sentence describing it.

