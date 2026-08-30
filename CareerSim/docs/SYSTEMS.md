# SYSTEMS.md — Mechanics Specification

Companion to [../DESIGN.md](../DESIGN.md). This is the buildable spec: state model,
encounter schema, resolution rules, phase structure. Where a system is deliberately
deferred past the first slice, it says so — see [ROADMAP.md](ROADMAP.md) for sequencing.

## 1. Player state

The design conversation proposed both "six resources" and "eight stats"; this spec
reconciles them on one principle: **numbers where numbers are honest, entities where
the fiction demands entities.**

### 1a. Core meters (0–10 scales)

| Meter | Meaning | Moves when… |
|---|---|---|
| **Synthesis** | How much of the universal system Ibn Turka understands | connections discovered, texts studied, teachers absorbed |
| **Demonstration** | Ability to make the system persuasive/operative in front of people | successful demonstrations, artifact deployments |
| **Transmission** | How much of the system exists *outside his head* | students taught, manuscripts copied, popularizations, collaborations |
| **Exposure** | Compounding political visibility. **Rises easily, almost never falls.** | public success, patron proximity, controversy, dangerous associations |

**Exposure is the FTL rebel fleet.** It gates escalating encounter injections
(rumors → rival challenges → formal accusations → inquisition). Spending patron
favor or reputation can *delay* its consequences but not reduce the meter.
Ibn Turka's arc — survive two inquisitions, lose the third — is modeled by
compounding, not resetting, risk.

### 1b. The four reputations (replacing any single "authority" meter)

Orthodox / Occult / Imperial / Scholarly, each −5..+5. **They must conflict**: an
occult demonstration before a prince gives Imperial+ Occult+ Orthodox−; the same
phenomenon reframed as mathematical natural philosophy gives Scholarly+ Orthodox+ but
less Imperial heat. Encounters read individual reputations, never a sum.

### 1c. Entities, not meters

- **Network** — people, as capability packages (§3). Yazdi doesn't give +10
  friendship; Yazdi changes what you can do.
- **Patronage** — zero or more active patron relationships, each with favor,
  expectation, and demand profile (§6).
- **Artifacts** — composed works (books, diagrams, tables, talismans, curricula), each
  with properties (§5).
- **Contracts** — active obligations (§6).
- **CourtMemory** — the world's append-only memory (§7).
- **Time** — per-phase budget (§4). The most contested resource.

**Legacy is not tracked live** — it is computed at run end from Transmission,
Network survival, artifact circulation, and CourtMemory (§9).

## 2. The Occult Quintet as capability families

Each science has rank 0–4, but rank is only a **tier gate on verbs**, never a bonus:

| Science | Verb family (encounter options it can unlock) |
|---|---|
| **kimiya** | transformation, substances, laboratory work, material demonstration |
| **limiya** | talismanic construction, inscribed objects, diagrams, the Tahawi Circle |
| **himiya** | influence, protection, political operation, defense under interrogation |
| **simiya** | illusion, misdirection, sensory spectacle, escape |
| **rimiya** | wonder, trickery, astonishment, entertainment-with-second-order-uses |

Rank meanings: 0 unaware · 1 studied · 2 practiced (unlocks the verb) · 3 masterful
(unlocks the verb in hostile/high-stakes contexts) · 4 systematized (the verb can be
*taught/encoded*, feeding Transmission).

## 3. Capabilities and the encounter engine (the slice spine)

Directly adapted from DungeonAB v6's `EncounterEngine.js`
(`../../DungeonAB/src/encounters/`): declarative situations, options gated on the
**capability × affordance intersection**, `unlockedBy` provenance on every option.

**Capability sources union together** (as DungeonAB's Party unions members+equipment):

- Quintet ranks (`kimiya>=2` …)
- **People** — e.g. `yazdi` grants {mathematics, historiography, observatory-access,
  manuscript-transmission}; `qasim` grants {poetry, sufi-network, popular-reach,
  risky-association}; `akhlati` grants {esoteric-authority, heterodox-knowledge,
  reputational-hazard}. Artisans matter as much as scholars: a calligrapher grants
  {inscription, manuscript-production}; an instrument maker {astronomical-apparatus}.
- **Texts/artifacts** — a composed diagram grants {visual-demonstration}; the
  unfinished *Investigations* grants {systematic-argument}.
- **Institutional access** — {judiciary, observatory, atelier, madrasa, sufi-lodge}.
- **Reputation thresholds** — `scholarly>=2` can gate "turn the challenge into a
  public lesson."

### Encounter schema (v1)

```json
{
  "id": "rival_astrologer_challenge",
  "phase": [3, 4],
  "location_tags": ["court", "observatory"],
  "grounding": "PLAUSIBLE-GAP",
  "source": "docs/BIOGRAPHY.md#samarkand",
  "affordances": ["public_audience", "astronomical_data", "manuscript_table"],
  "when": { "memory": ["!humiliated_rival_astrologer"] },
  "situation": "…2-4 sentences, WRITING_GUIDE discipline…",
  "options": [
    {
      "id": "mathematical_demonstration",
      "label": "Answer through numerical demonstration",
      "requires": ["limiya>=2", "aff:astronomical_data"],
      "time": 1,
      "outcomes": "gradient:demonstration"
    },
    {
      "id": "invoke_observatory",
      "label": "Invoke the authority of the observatory",
      "requires": ["yazdi", "access:observatory"],
      "outcomes": "gradient:social"
    },
    { "id": "refuse", "label": "Decline the challenge", "requires": [], "outcomes": "fixed:refuse" }
  ],
  "memory_writes": ["met_rival_astrologer"],
  "assets": ["registry:tahawi-circle-candidate"]
}
```

Rules: every encounter has at least one always-available option (refusal is always a
choice, and refusal has consequences); locked options are **shown greyed with their
requirement named** — teaching through denial is the progression UX (see
UI_STYLE_GUIDE.md §"Teach through the locked door").

## 4. Phases, nodes, and time

A phase = a node map of 6–10 nodes + a **time budget** (e.g. 7 units). Nodes are
institutions/opportunities (court, madrasa, atelier, observatory, judiciary, salon,
manuscript workshop, sufi lodge, road). Entering a node costs time and draws from its
encounter pool (filtered by phase, location_tags, demand, memory, Exposure tier).

**Obligations compete for the same budget**: judgeship duties in Phase II consume 2–3
time/turn unless delegated (which has its own consequences). The recurring strategic
question — *serve the office, the patron, the book, the students, or the network?* —
is the Career part of the Career Sim.

Phase III branches FTL-style: the player commits to Iskandar (experimental, unstable,
high upside — and historically doomed), Baysunghur (manuscript arts, prestige), or
Samarkand (mathematics, observatory, Yazdi synergy). The un-chosen courts continue to
exist in CourtMemory and can reappear (Iskandar's fall reaches you wherever you are).

## 5. Composition (thin in slice 1, signature system later)

Composing an artifact assigns property scores derived from choices of **language
(Arabic/Persian), density, diagrams, audience, concealment**:

`scholarly_authority · accessibility · court_usefulness · transmission ·
political_risk · esoteric_density`

Deploying the *same* artifact to different audiences yields different outcomes
(scholar → credibility; patron → favor + expectation; jurist → suspicion; student →
Transmission; rival → appropriation risk). Slice 1 implements artifacts as pre-defined
items acquired through encounters; the full workbench UI (assemble text + diagram +
audience) is a later slice — see ROADMAP.md.

## 6. Patrons, demand, contracts

- **Demand profiles** per court (from Laboratory of Art): Samarkand hungers for
  astronomy/mathematics; Herat for manuscripts/poetry; Isfahan for law. Matching
  deployment to demand multiplies rewards; mismatch wastes the artifact.
- **Contracts** (from Nummedal): `{patron, promise, deadline(time), reward,
  expectation_delta, failure_consequence, secrecy}`. Accept / negotiate / hedge /
  refuse / overpromise are all real options at offer time.
- **Expectation inflates**: every triumph raises the patron's expectation stat; future
  contracts demand more. Success is compounding danger on the patronage axis just as
  Exposure is on the political axis.

## 7. CourtMemory

Adapted from DungeonAB's TownState: append-only log of *why*, plus flags readable by
encounter `when` predicates. Institutions, patrons, rivals, students, and manuscript
traditions all remember. Chekhov's-gun discipline from the VN audit is foundational
here: **any memory written must be read by at least one later encounter** (lint rule
for content authoring — a write nothing reads is a bug).

## 8. Resolution: gradient outcomes

Six-step ladder, per DungeonAB: **Triumph · Success · Qualified success · Ambiguous ·
Backfire · Disaster.** Weighting from relevant capability tier + reputation fit +
demand fit + memory modifiers; small randomness, never coin-flip swingy. Every
resolution: (1) applies effects, (2) writes CourtMemory, (3) **inks one line into the
Chronicle** — the player watches their history being written.

## 9. Endings

At run end (death, exile, disgrace, retirement, or consolidation), score two axes
independently — personal fate × system fate — and name the cell. The ending screen is
a two-page spread: left page the man, right page the system (see UI_STYLE_GUIDE.md).
High-everything runs should discover the "Ibn Turka problem": maximal success is
maximally dangerous. The historical run must be reachable and must not be optimal.

## 10. Explicitly deferred

Synthesis graph UI (the cosmogram — capability counters stand in for it in slice 1),
composition workbench, New-Brethren-as-institution management, multi-run meta-legacy,
research-pipeline auto-generation of atoms at scale. Architecture leaves room; slices
earn them one at a time.
