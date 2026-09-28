# DESIGNER brief — how to write scenes for TURKAVITA

You are a DESIGNER + WRITER pass (C:\Dev\AGENTS.md). The RESEARCHER passes have written ~1,000 evidence
artifacts, ~550 claims, events, works and reconstructions from Melvin-Koushki's scholarship. **You turn
them into scenes.** You add no facts. Work from `C:\Dev\TurkaGame\TurkaVita`. Read first:
`CLAUDE.md` (rules), `docs/RESEARCHER_BRIEF.md` (what the artifacts mean), the exemplar
`narrative/scenes/SCN-0301.json`, and `../games/visual-novel/WRITING_GUIDE.md` (every scene reveals a
named text, person, institution or practice; short; never generic occult atmosphere).

## Finding your material

```
python scripts/find.py Iskandar --type claim -n 40     # id, epistemic type, first 170 chars
python scripts/find.py "Nafsat" --type evidence
python scripts/find.py --show CL-0065 EV-0139          # whole artifacts (see supported_by, mediation)
python scripts/find.py --type event -n 70 ""           # the 55 dated events (fixed points are marked FIXED)
python scripts/find.py --type work -n 60 ""            # the 49 works (dates, addressees, Majlis folios)
```
Also read `research/notes/R*.md` (each researcher's page-cited notes and **discrepancies**). Anything a
scene states must trace to a claim you have read; open the claim and its evidence.

## The design in one paragraph

External events are **fixed points** the player cannot prevent (they go in `invariants`, resting on
`attested`/`directly_inferred` claims). The player's margin is **whom to attach to, what to write, and how
to defend it**. Each scene poses one decision where the sources record what he actually did (mark that
choice `"historical": true`) or say nothing (mark the **scene** `"unrecorded": true`; then no choice is
historical and the feedback says the record is silent). Alternatives are labelled honestly:
`documented` (a source says he did it), `reconstructed` (a scholar proposes it), `contested`, `unknown`
(the player says the sources are silent), `counterfactual` (the game's own what-if; **the game then
rejoins the record**, say so in the feedback: the sources put him elsewhere, and nothing later can be
built on a life the sources do not contain).

## Scene format

Copy `SCN-0301.json`. Required: `id, type:"scene", status:"draft", act, title, dramatic_question,
situation{when,where,based_on[claim ids]}, invariants[{text,claim}], prose[2-4 short paragraphs], choices[2-4],
next, epistemic_contract{historical_status,invented_dialogue:false,invented_facts:false}`.
- `act`: `hostage | courts | trials | exile | copyist`.
- Each choice: `id` (A, B, C…), `label` (one full sentence, in the second person), `strategy` (slug),
  `epistemic_label`, `based_on` (**claim or reconstruction ids that exist**; a `documented` choice may not rest
  on a reconstruction), `effects`, `feedback` (2–3 sentences: what the sources say, who is speaking, what it
  costs), optional `next`, optional `costs` (extra plain-language cost lines), optional `requires`,
  `requires_min`, `requires_max`, and `"historical": true` on the one that matches the record.
- **At least one choice per scene has no requirement.** Gates must be reachable: `requires_min` on a key that
  no effect ever raises is a lint error.
- The player-facing prose is second person, plain, specific, short. **No invented dialogue, no invented facts**
  (no weather, colours, faces, feelings the sources do not report). Where MK reads a motive, say "Melvin-Koushki
  reads…". Anything that reaches us through his own apologies gets the caveat in the feedback ("his own words
  to the ruler judging him").

## State keys (use only these)

- **Courts** `court.<slug>` (add a small integer, usually ±1): `temur, barquq, pir-muhammad, iskandar,
  shahrukh, baysunghur, ulugh-beg, firuzshah, marashi, karkiya, shah-razi-al-din, ala-al-din, akhlati, yazdi,
  nimat-allah, jazari, qazizada`. (The lead writes the `INS-` artifact for each. Use other slugs only if you
  tell the lead.) Favour means what that ruler or household would do for you.
- **Pressures** `press.<kind>`: `exposure` (how closely your name is tied to the charges of Sufi bias, Shiʿism
  and Ḥurūfī sympathy; only ever rises, except by a very costly choice), `livelihood` (household fed; ±),
  `students`, `works`, `enemies`. Game abstractions, never historical quantities.
- **Life flags** `life.<name>` (set values): e.g. `life.seat: "yazd"`. Free, but a `requires` on a value no
  choice ever sets is a lint error.
- **Scores** `score.biography | score.textual | score.doctrine | score.calibration` (add). Conventions:
  - the choice that matches the record: `score.biography +2`; a counterfactual: `-1`; a `reconstructed`
    proposal by a scholar: `0` or `+1`; an `unknown` that honestly says the sources are silent: `score.calibration +1`
    or `+2`; presenting a reconstruction as if it were documented: `score.calibration -1` or `-2`.
  - `score.textual` ("works") is earned in writing scenes and the collection puzzle, not in life choices.
  - `score.doctrine` only from `rulings`.
- Never touch `dossier.*`, `lens`, `who.*`, `sort.*`: reserved for the lead.

## Gate contract (so the acts fit together)

- **The historical path must always be open.** Whatever a later scene's historical choice requires, the
  historical choices of earlier scenes must have paid for it. The test `tests/test_historical_path.py` walks
  every scene's `historical` choice (first choice where a scene is `unrecorded`) and fails if any is closed,
  if a scene has no choice, or if the path never reaches END.
- Real gates are wanted, so that earlier decisions matter: some non-historical options that need favour
  earned earlier (`requires_min`). Locked options are shown greyed out with the requirement named.
- Act II is the only act that can earn `court.firuzshah`, `court.pir-muhammad`, `court.iskandar`;
  Act I earns `court.akhlati`, `court.yazdi`, `court.barquq`; Act III earns `court.shahrukh`,
  `court.baysunghur`, `court.ulugh-beg`; Act IV may earn `court.marashi`, `court.karkiya`,
  `court.shah-razi-al-din`, `court.ala-al-din`. Act IV gates may use anything earned earlier **provided the
  historical path earns it**.

## Rulings (doctrine)

`"rulings": [{"id":"R1","proposition":"…a definite proposition about what his work argues…","answer":"stand"|"refute",
"based_on":[attested/directly_inferred claim ids],"effects_correct":{"score.doctrine":1},
"effects_wrong":{…optional…},"feedback":"…"}]`. The linter **requires** each `based_on` claim to be `attested` or
`directly_inferred` (not a reconstruction). Rulings come before the choices in a scene.

## Composer (a writing scene: he writes a work, the player picks each move)

```json
"composer": {"work": "WRK-SUAL-AL-MULUK", "prompt": "…what he is writing, for whom, and what to decide…",
  "slots": [{"id": "S1", "question": "…", "options": [
      {"id": "a", "label": "…the move, as the text would say it…", "epistemic_label": "documented",
       "based_on": ["CL-…"], "effects": {"score.textual": 1, "court.baysunghur": 1}, "feedback": "…"},
      {"id": "b", "label": "…", "epistemic_label": "counterfactual", "based_on": ["CL-…"],
       "effects": {"score.textual": -1}, "feedback": "…"} ]}]}
```
**The options must be the moves the source actually reports** (each is its own evidence artifact, e.g. every
argument of *Nafsat al-Maṣdūr I*), plus alternatives he did **not** take, labelled honestly. 3–5 slots, 2–4
options each, options in a slot must have different effects. The `work` must be an existing `WRK-…`. The
UI shows the picks building up as a text and sends only on "Send it". Effects: `score.textual +1` for a move
the source reports; `-1` for one it does not; plus court/press costs. Composer scenes still need `choices`
afterwards (what he does with the finished work: send it, to whom).

## Sorter (the collection puzzle; Act V only)

`"sorter": {"prompt":"…","items":[{"id":"…","label":"…","note":"colophon date …"}],"truth":[ids in the real
manuscript order],"based_on":[claim ids that ground the key],"scoring":{"axis":"score.textual","max":6}}` — `items`
in scrambled order, `truth` a permutation of the items.

## Voice, and what to leave out

Short paragraphs; specific names and texts; no "mysterious", "arcane", "secret wisdom". Say "Melvin-Koushki"
when it is his reading. Persian/Arabic names in the dissertation's spelling. **No contact with any European
figure.** Do not mention Dee/Cusa/Bruno in Acts I–V. (Only the historian's layer, Act VI, may cite Melvin-Koushki's own Dee epigraph, CL-0101, as his comparison, per the project rule 11.) Dates: give Hijri and CE where the source does; carry "c." and "(?)".
Where the researchers flagged a **discrepancy**, do not silently choose: say what is uncertain in the
invariant or feedback (e.g. "the sources give the year as 1429 or 1430").

## Validate

```
python scripts/lint_scenes.py --grep "SCN-01|SCN-02"     # errors/warnings for your scenes; ignore 'next … does not exist' at your block's last scene
python scripts/build_artifacts.py --check --grep "SCN-"  # schema errors on scenes
```
Fix every ERROR. Read every WARNING and fix it unless the linter is plainly wrong (say so). You write only your
own scene ids. Hand back: the scene list with the decision each poses; which choice is historical and why (the
claim id); which scenes are `unrecorded`; every place you had to choose between conflicting researcher notes;
any fact you wanted to state but could not source; the `requires_min` gates you built and what earns them.
