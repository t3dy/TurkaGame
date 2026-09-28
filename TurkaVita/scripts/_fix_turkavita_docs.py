#!/usr/bin/env python3
# one-off (2026-09-28): TurkaVita's own docs said the older documents were "not corrected until Ted has seen the audit".
# Ted's standing rule (2026-09-27): always correct older documents to the most current information. Update the tense.
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def sub(rel, pairs):
    p = os.path.join(ROOT, rel)
    s = io.open(p, encoding="utf-8", newline="").read()
    for a, b in pairs:
        assert a in s, (rel, a[:60])
        s = s.replace(a, b, 1)
    io.open(p, "w", encoding="utf-8", newline="").write(s)


sub("docs/TURKA_AUDIT.md", [
    ("description: A reconciliation, not a correction. Nothing outside TurkaVita has been changed; Ted decides what is corrected and where.",
     "description: The reconciliation of the dissertation and the later papers against our older documents. The older documents were corrected to it on 2026-09-28 (see the end of this file)."),
    ("**Status: for Ted's review (DECISIONS 5). No older document has been edited.**",
     "**Status: applied.** When this audit was written (2026-09-27) it held the corrections for Ted's review (DECISIONS 5). Ted then set a standing rule, *always correct older documents to match the most current information* (DECISIONS 14), and the corrections were made on 2026-09-28: see \"F. What was corrected\" at the end. Sections A and B below describe the state **before** those corrections."),
])
p = os.path.join(ROOT, "docs", "TURKA_AUDIT.md")
s = io.open(p, encoding="utf-8", newline="").read()
s = s.rstrip("\n") + """

## F. What was corrected (2026-09-28), and what was not

Corrections follow `CORRECTIONS_BRIEF.md`; each corrected document carries a "Corrections (2026-09-27)" section (or a dated entry, for append-only ledgers) with the source of each change.

| where | what |
|---|---|
| `TurkaGame/docs/BIOGRAPHY.md` | rewritten in the wrong sections (Samarkand 1387, abroad c. 1393-1408, Pīr-Muḥammad then Iskandar, the retirement, Bāysunghur as addressee from 1426, the *Mafāḥiṣ* and *Shaqq-i Qamar* separated, all seven tiers, the three trials as our reading of MK, sources and gaps) |
| `TurkaGame/docs/`, `README.md`, `CLAUDE.md`, `HANDOVER*.md`, `NEXTSTEPS.md`, `FOUNDER.md`, `LETTRISMRESEARCH.md`, `DESIGN.md`, `v2/` READMEs, `grimoire/`, `research/notes/02-03` | wrong life-facts and the "three papers / not held" source situation corrected; `docs/DECISIONS.md` appended (old entries untouched) |
| `TurkaGame/site/data/timeline.json` (59 events, with page citations), `site/timeline.html`, `site/index.html`, `site/features.html`, `site/archive.html`, `site/portal/`, `site/plates/` (regenerated) | data and pages brought to the dissertation |
| `TurkaGame/portal/` (seed, essays, README) and `IslamicateOccultPortal/` (seed, CLAUDE.md, corpus/INDEX.md) | corrected and rebuilt; `portal/scripts/seed_from_json.py` fixed to write plates and bibliography sections (it silently dropped them) |
| `TurkaGame/CareerSim/` (content, engine strings, UI, README, docs) | phase datelines, patron/Bāysunghur text, the "pivot" phase, trial source strings, the seven tiers, the Attested Life rows corrected; ids, effects and gates unchanged; 32 engine tests, reachability and thesis tests pass. Encounter count corrected to 71 |
| `TurkaGame/v2/apps/tribunal/` (`trials.json`, `ui.js` comment) and `v2/index.html` | "won the first two, lost the third" given its dates; "refusing is what he actually did" replaced by the disagreement (the *Prologue*'s uncited remark against the dissertation's two apologies) |
| `TurkaGame/games/visual-novel/*.md` | documents corrected; **`ERRATA.md` added** |
| workspace: `C:\\Dev\\CLAUDE.md`, `wiki/` (TurkaGame page rewritten; TurkaVita and PLOTINUSGAME pages added; registry, index, live sites, log), `research-artifacts/INDEX.md`, `ecosystem/`, `PLOTINUSGAME/CLAUDE.md` | brought to the current state |

**Not changed, on purpose:** the **frozen games** under `games/` (game code and data: `games/FROZEN.md`; the visual novel's premises are listed in `games/visual-novel/ERRATA.md`); the archived visual-novel snapshots `-v1/-v2/-v3`; the raw conversation transcripts (`CONVO*.md`, `CareerSim/docs/DESIGN_CONVERSATION.md`); already-published CareerSim witnesses (they keep the text of the day they were published); generated `tools/out/` files; `assets/manuscripts/registry.json` (image provenance notes that name the frozen game's acts).

**Still open for Ted:** (1) whether the frozen visual novel's scenes (`games/visual-novel/ERRATA.md`, 18 rows) may be corrected despite `games/FROZEN.md`; (2) whether CareerSim should stage the Samarkand years and rebuild `trial_first`/`trial_second` around the sourced charges (recorded in `CareerSim/NEXTSTEPS.md`); (3) whether already-published CareerSim witnesses should be regenerated.
"""
io.open(p, "w", encoding="utf-8", newline="").write(s)

sub("docs/DECISIONS.md", [])
p = os.path.join(ROOT, "docs", "DECISIONS.md")
s = io.open(p, encoding="utf-8", newline="").read().rstrip("\n")
s += """

## 2026-09-28: Ted's standing rule on corrections

14. **Always correct older documents to match the most current information.** Ted (2026-09-27, after the game was live): "continue. always correct older documents to match the most current information."
    **Supersedes decision 5** (older documents were held until Ted saw the audit). The corrections were made on 2026-09-28 across `TurkaGame/`, `IslamicateOccultPortal/`, the wiki and the workspace files, to the table in `docs/CORRECTIONS_BRIEF.md`; each document carries a "Corrections (2026-09-27)" section or a dated entry. Saved to memory as `feedback-correct-older-docs`.
    **Why:** an audit that lists errors and leaves them in the documents means the next session reads the wrong picture.
    **What it does not override:** `games/FROZEN.md` (game code and data stay as they are; their documents are corrected and `games/visual-novel/ERRATA.md` lists the premises), archived version snapshots, raw conversation transcripts, and already-published witnesses.
15. **Where a live app's content states something the sources do not, correct the text, keep the mechanics.** The Tribunal's refusal outcome stays (the *Prologue* says he refused), but it is no longer presented as "what he actually did": the dissertation shows two apologies. CareerSim's phase labels and source strings are corrected; its encounter ids, effects and gates are unchanged.
"""
io.open(p, "w", encoding="utf-8", newline="").write(s + "\n")

sub("HANDOVER.md", [
    ("1. **Read `docs/TURKA_AUDIT.md`.** It lists twelve places where the older BIOGRAPHY.md / timeline.json / LETTRISMRESEARCH.md / the plan differ\n   from the dissertation, and nine where Melvin-Koushki's own papers disagree. **Nothing outside `TurkaVita/` has been corrected** (DECISIONS 5), except",
     "1. **Corrections are done** (2026-09-28, Ted's standing rule, DECISIONS 14). `docs/TURKA_AUDIT.md` lists twelve places where the older BIOGRAPHY.md / timeline.json / LETTRISMRESEARCH.md / the plan differed\n   from the dissertation, and nine where Melvin-Koushki's own papers disagree; section F of the audit lists what was corrected and what was left (the frozen games). Earlier this said nothing outside `TurkaVita/` had been corrected (DECISIONS 5), except"),
    ("corrections held for the audit. \"Go\" was taken as approval to commit and deploy, **not** as approval to edit the older docs: those are still uncorrected.",
     "corrections (now made: see 1). \"Go\" was taken as approval to commit and deploy; the standing rule to correct older documents came next."),
])
sub("CLAUDE.md", [
    ("(nothing is corrected until Ted has seen it)", "(the older documents were corrected to it on 2026-09-28; section F says what and what was left)"),
])
print("TurkaVita docs updated")
