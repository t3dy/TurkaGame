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

