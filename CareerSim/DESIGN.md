# Ibn Turka: The Occult Court

> **A career roguelike about trying to make a universal science real.**
>
> You begin with scattered teachers, texts, concepts, and ambitions. You construct a
> system. You form a circle. You write, diagram, demonstrate. You seek patrons and
> enter courts. You make your science politically useful — and discover that political
> usefulness creates political danger. The final question is never "did you survive?"
> It is: **can a human being build a system of knowledge powerful enough to outlive
> its author?**

This is the master design document, distilled from
[docs/DESIGN_CONVERSATION.md](docs/DESIGN_CONVERSATION.md) (the full kickoff
conversation — open by section only). Mechanics detail lives in
[docs/SYSTEMS.md](docs/SYSTEMS.md); visual/UX in
[docs/UI_STYLE_GUIDE.md](docs/UI_STYLE_GUIDE.md); content pipeline in
[docs/ENCOUNTER_ATOMS.md](docs/ENCOUNTER_ATOMS.md); build order in
[docs/ROADMAP.md](docs/ROADMAP.md); decisions in [docs/DECISIONS.md](docs/DECISIONS.md).

## The thesis (what Melvin-Koushki argues, made playable)

Six research claims are the game's load-bearing walls. Each maps to a system:

1. **Ibn Turka attempted a universal science** — the systematization and
   mathematization of lettrism into something usable across disciplines. Koushki calls
   *Investigations* "the first summa of Islamic Pythagoreanism," "source code" for later
   Persianate empires. → **Progression is synthesis, not XP**: fragmentary knowledge →
   synthesis → system → application → dissemination.

2. **The occult is inseparable from political theory.** The astrological-lettrist
   platform became "the default imperial cosmology and political science" of the
   Persianate world. "The political was and is magical as a rule." → **No separate
   "magic encounters" and "politics encounters."** They are the same encounter.

3. **Books are active technologies.** *Investigations* is a "talismanic machine," its
   diagrams and terminology designed for uptake. → **Composition is gameplay**: the
   player builds books with design parameters (language, density, audience, diagrams)
   that determine who can use them.

4. **De-esotericization vs. elite secrecy is a strategic axis, not a morality axis.**
   → The recurring dilemma: *who gets the knowledge?* Each answer has different
   consequences, none automatically "good."

5. **The New Brethren are an intellectual network, not a faction.** Ibn Turka + Yazdi
   + Qasim-i Anvar + Akhlati's students, spanning Cairo to Samarkand. → **The player
   builds a movement**, and the movement can outlive — or escape — the player.

6. **Success itself is the danger.** Three inquisitions; two survived, the third lost;
   exile; death in legal limbo. → **The pressure curve is compounding Exposure**: every
   success changes the political conditions of the next encounter.

Design epigraphs (quoted with Melvin-Koushki's permission, kept short):

- "The most philosophically systematic formulation of lettrism ever penned." → build a *system*.
- "The political was and is magical as a rule." → one encounter type, not two.
- "The science of magic and talismans joins commoners to kings and kings to angels." →
  the network across social levels IS a mechanic.
- "Applied lettrism remains an important technology of empire and personal advancement
  alike." → advancing the system vs. advancing Ibn Turka is the core tension.

## What kind of game

**FTL's pressure grammar + DungeonAB's capability grammar + the VN's historical
grammar, subordinated to Koushki's world model.**

- **From FTL**: sectors, node maps, consequential encounters, deadlines, a compounding
  threat that follows you (Exposure plays the role of the rebel fleet).
- **From DungeonAB v6** (`../../DungeonAB/DESIGN.md` — the encounter engine is directly
  adaptable): CHARACTER → CAPABILITIES → AFFORDANCES → OPTIONS → CONSEQUENCES.
  People, texts, and institutional access are **capability packages**, never stat
  sticks. Options carry `unlockedBy` provenance. Gradient outcomes, not pass/fail.
  The court **remembers** (TownState pattern → CourtMemory).
- **From Laboratory of Art / AlchemyBoardGame**: per-court **demand profiles** (what is
  this court hungry for?) and the operation → artifact → audience deployment loop.
- **From Smith/Nummedal (comparative models, not transplants)**: **contracts** —
  patron commissions with deadlines, rewards, and expectation inflation; failure comes
  from overpromising.
- **From the VN**: 40 grounded life-choices become the first encounter-atom batch;
  the three-tier grounding discipline (ATTESTED / PLAUSIBLE-GAP / INVENTED-COMPATIBLE)
  carries over unchanged and is mandatory on every encounter.

**Explicitly rejected**: a reagent economy, elaborate crafting trees, conventional
combat, a single reputation meter, RPG death as the only fail state, "occult skill
levels" as numeric bonuses, and any drift back toward a generic alchemy simulator.

## Run shape: five life-phase sectors

A run is one compressed life, ~60–90 minutes, replayable as counterfactual
intellectual history. **The historical trajectory is playable but never optimal.**

| Phase | Sector | Flavor | Dominant pressure |
|---|---|---|---|
| I | **Cairo — The Experimental Cosmopolis** | Akhlati's circle, Qasim-i Anvar, first synthesis | Whose student are you? |
| II | **Isfahan — The Judge's City** | Judgeship day job, legal encounters, family seat | Time: office vs. project |
| III | **The Courts** (branch: Iskandar's Dangerous Atelier / Baysunghur's Manuscript Machine / Samarkand — The Observatory) | Patronage, commissions, demonstration | Demand & contracts |
| IV | **The 1420 Pivot** | Composing *Investigations* while the Observatory rises | Composition choices |
| V | **The Trials** | Inquisitions, exile risk, consolidation or collapse | Exposure comes due |

Each phase is a node map (6–10 nodes); nodes are institutions and opportunities, not
pixels on a literal map — the player chooses **where to put themselves next**.

## The ending is a two-axis verdict

Every run ends with two separate questions, scored independently:

- **What happened to Ibn Turka?** (honored / secure / obscure / disgraced / exiled / dead)
- **What happened to his system?** (imperial adoption / scholarly transmission /
  popular movement escaped his control / appropriated & distorted / suppressed but
  underground / died with him)

The matrix produces named endings ("Personally destroyed, intellectually triumphant";
"Court philosopher, project abandoned"; "Source Code of Empire" carries over from the
VN's 8th ending). **Legacy, not survival, is the score.**

## The Chronicle (and why there's a backend)

Every run writes a **Chronicle** — the run's story, composed line by line as choices
resolve, in the style of a period historical chronicle. Post-run, a logged-in player
can **edit their Chronicle's text** and keep it: the player becomes the historian of
their own counterfactual Ibn Turka. This is the game's persistent, shareable artifact
and the reason for auth (Supabase) — see [docs/DECISIONS.md](docs/DECISIONS.md). It is
also thematically exact: Yazdi's entire career was turning events into legitimizing
narrative.

## Ground rules (inherited + local)

- Inherits ALL of `../CLAUDE.md`'s ground rules: real-world specificity per scene
  (WRITING_GUIDE discipline), no copyrighted PDFs in the repo, no manuscript image
  without a provenance record, `../docs/BIOGRAPHY.md` + `../site/data/timeline.json`
  as the canonical research layer.
- **Every encounter carries a grounding tag** (ATTESTED / PLAUSIBLE-GAP /
  INVENTED-COMPATIBLE) and, where ATTESTED, a source pointer.
- **The occult can be funny.** Bazm encounters may open as jokes (disappearing ink —
  and yes, the fart lamp is attested in the later manuals) and acquire second-order
  political consequences. Do not make every encounter solemn.
- **No spell system.** Options are intellectual strategies; the Quintet supplies verbs
  (kimiya = material demonstration, limiya = talismanic construction, himiya =
  influence/protection, simiya = misdirection/spectacle, rimiya = wonder/trickery),
  never +N to anything.
