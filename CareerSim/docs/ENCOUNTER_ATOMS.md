# ENCOUNTER_ATOMS.md — Content Pipeline

How research becomes encounters. The architectural insight from the design
conversation: **the research corpus is a content generator for historically grounded
encounters** — the pipeline's question is never "what assets can we make?" but *"what
component of Ibn Turka's intellectual and political world does this source reveal?"*

## The Encounter Atom

The unit of extracted content — smaller than an encounter, composable into one:

```json
{
  "atom_id": "akhlati_public_discipleship",
  "trigger": "Akhlati asks you to publicly identify as his student",
  "people": ["akhlati"],
  "location": "cairo",
  "institution": "informal_circle",
  "grounding": "PLAUSIBLE-GAP",
  "source": "docs/BIOGRAPHY.md#cairo-formation",
  "affordances": ["private_audience", "reputational_stakes"],
  "capabilities_relevant": ["himiya", "risky-association"],
  "memory_reads": [],
  "memory_writes": ["akhlati_alignment"],
  "asset_candidates": [],
  "consequences": ["reputation:occult+", "reputation:orthodox-", "network:akhlati"],
  "counterfactual_license": "timing and publicness of the alignment are undocumented",
  "phase_fit": [1]
}
```

Atoms are stored in `content/atoms/*.json`, one file per source batch. Encounters in
`content/encounters/*.json` reference the atoms they were composed from
(`"atoms": [...]`) so every option traces back to research.

## Extraction ontology (what to pull from each source)

Per source, extract: **People · Texts · Concepts · Methods · Audiences · Institutions
· Political function · Transmission · Conflict · Visual form** — plus the
Nummedal-inspired economic set: **Patrons · Contracts/promises · Markets/demand ·
Risks · Authorities (who judges legitimacy) · Artifacts produced.**

Mapping rules of thumb (from the design conversation):
- contracts → encounter mechanics; trial records → crisis encounters; inventories →
  artifact/asset lists; satires → reputation/social encounters; treatises →
  capability systems; laboratory/workshop descriptions → locations + affordances.

## Batch 1: mining the VN's 40 choices

`../../games/visual-novel/choices.json` + `CHOICES.md` are the first atom source —
already grounded, already tagged, already act-structured. Conversion is a mapping,
not a rewrite:

| VN field | Atom/encounter field |
|---|---|
| `act` (1–8) | `phase_fit` (acts 1–2→Phase I, 3→II, 4–5→III, 6→IV, 7–8→V) |
| `grounding` | `grounding` (identical vocabulary — keep it) |
| `options[].flags` | `memory_writes` |
| skill effects (kimiya…rimiya) | Quintet rank changes in `consequences` |
| gates (`requires` in choices.json) | option `requires` |
| `theme` | encounter pool tags |

What the conversion must ADD (the VN doesn't have these): affordances, time costs,
gradient outcome tables, exposure/reputation deltas, and at least one
capability-unlocked option per encounter beyond the VN's original binary/ternary
choice. A straight port that keeps VN choices as flat either/or picks defeats the
point — the conversion is done when each mined encounter has at least one option
gated on preparation.

The VN itself is untouched — it remains its own game (see docs/DECISIONS.md: "mine
as atoms," not "shared content layer").

## Batch 2+: the portal corpus

`../../../IslamicateOccultPortal/corpus/` (21 sources, full text) and its image
catalog are the scale source. Before mining a portal concept/figure, query the
portal's `game_connections` table — some research is already tapped by the VN's
design docs. Every image candidate flows through the existing provenance gate:
portal catalog → rights check → `../../research/scripts/register_asset.py add` →
only then referenced from an encounter's `assets`.

## Authoring lint rules (enforced by a script in `tools/`, eventually)

1. Every encounter has `grounding`; ATTESTED requires a `source` pointer.
2. Every `memory_write` is read by ≥1 other encounter (`when`/`memory_reads`) — an
   unread write is a Chekhov's-gun bug (the VN audit found exactly this class of
   defect; here it's a lint, not an audit).
3. Every encounter has ≥1 requirement-free option.
4. Every encounter has ≥1 capability-gated option.
5. Situation text obeys WRITING_GUIDE limits and names something real where grounding
   is ATTESTED.
6. Asset references must exist in `assets/manuscripts/registry.json`.
