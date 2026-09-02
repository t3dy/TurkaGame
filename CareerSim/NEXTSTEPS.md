# NEXTSTEPS — CareerSim

Rewritten 2026-08-31, end of the editor session, for whoever opens the next window.
Ordered. Each item says **why it is where it is** and **how you know it is done**,
because "done" has repeatedly meant "code exists" in this project and that is not the
same thing. Last session's item 1 (the editor) is built, deployed and verified — and
was wrong on its first deploy in a way that returned 200 OK, which is the argument for
this file's insistence on evidence.

Read first: [HANDOVER.md](HANDOVER.md) (state), [AUDIT.md](AUDIT.md) (systems map).
Architecture for items 2–4: `../../DungeonAB-morigny/docs/PLAYTHROUGH_WITNESS_ARCHITECTURE.md`
(written for MORIGNY; the Turka service is the same contract, second game) — but its
storage model is superseded here by `docs/PIVOTS.md` P6.

---

## 1. Tell Matt — the actual point of the exercise ★ do this first

**Why first.** The editor is built and verified against the deployed service; what it
has never had is a scholar. Nothing on this list is worth more than one real correction
from Matt, and everything below is easier to prioritise once one exists. This is a
message to send, not code to write.

**Do.** Publish one real playthrough (not a test record), send him the **scholar** link,
and say plainly: the ✎ corrects any passage, the ✒ leaves a margin note, both are signed
and dated, and nothing he does can alter what the simulation actually recorded.

**Done when.** A witness exists carrying at least one scholar-hand revision or marginale
that changed something in the game's content.

**Then feed it back.** A scholar-hand correction anchored to `encounterId` is a signal to
rewrite that encounter's prose, or its mechanics, in `content/phaseN.js`. That loop —
witness → correction → content change → new build — is the reason this system exists.

**Before sending, spend thirty seconds looking at it.** The whole editor was verified by
DOM assertion because the Browser pane was hidden; open the scholar link on a wide screen
and confirm the margin actually reads as a margin.

---

## 2. The loop's measured defects ★ the biggest body of real work

Audited 2026-08-31 with two new harnesses (`tools/analyze-content.mjs`,
`tools/simulate-runs.mjs`); findings ranked in
[docs/MECHANICSISSUES.md](docs/MECHANICSISSUES.md), with the design response split across
[docs/GAMELOOP.md](docs/GAMELOOP.md), [docs/ECONOMY.md](docs/ECONOMY.md),
[docs/ENCOUNTERSNEXTSTEP.md](docs/ENCOUNTERSNEXTSTEP.md) and
[docs/WRITINGAUDIT.md](docs/WRITINGAUDIT.md).

**Update, same day (eighth session):** items 1–3 below are **fixed and re-measured**
(0 dead gates + reachability lints; random draw + Phase IV split; tribunals and a new
three-rung pressure ladder injected — `content/pressure.js`). Item 4 is **partial**
(judgeship cost 2, commission injected, contracts 0.61/run; `expectation` still unread,
`opt.time` still unused). **Second update (2026-09-01, ninth session):** the meter rescale, the gradient pass
(with `min_exposure` bottom rungs), expectation reads, the fate retune (`source_code`
23%, `broken`→exposure≥9 so the attested exile survives), 25 cross-phase reads, and the
no-gate conversions (24→9) are all done and measured. What genuinely remains: **overlap
52%→<40% needs Slice 4 pool depth** (every tuning lever is exhausted — stop re-tuning
and author encounters when that target matters), demonstration median 1→4 (revisit after
a human playtest), contracts ≥2/run (the §4 authoring pass in ENCOUNTERSNEXTSTEP).

The four that mattered, as found:

1. **Nine Quintet gates can never be opened**, and hīmiyā is never granted anywhere. The
   Ṭahawī Circle, the muqaṭṭaʿāt-as-notation branch and reading a dynasty from the ruler's
   name are all permanently locked; `needs līmiyā ●● (practiced)` is the most-shown locked
   door in the game at 2.02 per run. Every lint passes, because the lints check that a
   science is *mentioned*, not that its rank is *reachable*.
2. **The draw is deterministic first-eligible**, so encounters buried at position 4+ of a
   node effectively never fire — including `pivot_globes`, the last audit's headline
   content fix, at 4.3%. Also the reason run-to-run overlap is 57% against a <40% target.
3. **The third inquisition never happens in 68.7% of runs**, because it is queue position 3
   of a node the player must choose three times. The whole ending matrix keys off it.
4. **The career systems are one encounter each** — one obligation, one contract encounter,
   `opt.time` unused, `state.expectation` written and read by nothing.

**Done when.** The acceptance gates in
[docs/ENCOUNTERSNEXTSTEP.md](docs/ENCOUNTERSNEXTSTEP.md) §7 pass — they are all one command,
so do not tune by feel.

**Do the repairs before authoring anything new.** The corpus is 70 encounters and a run
sees 31; supply is not the constraint.

---

## 3. The editor's loose ends

Small, real, and cheapest to do while the code is fresh.

- **A second reader's affordance for the chain.** ✳ reveals the original and every
  revision. It is discoverable only by noticing a small gold glyph — fine for a scholar
  told about it, probably invisible to a general reader.
- **Delete or retract an op.** There is no way to remove a note or withdraw a correction;
  the store is append-only by design, so this means an explicit `retract` op that the
  fold honours, not a deletion.
- **`preface.orig`** is the preface as the game gave it (always empty today, since the
  payload ships an empty preface). If a preface is ever generated at publish time, check
  that the fold still keeps the game's version distinct from the scholar's.

---

## 4. The researcher's desk

**Why here.** It is the tool for *many* witnesses; it is thin while there are five.
Build it once item 1 is producing real material.

**Build.** `witness/api/index.mjs` listing summary rows from `index/*.json`. **Note the
change from last session's plan:** those rows no longer carry editorial counters. They
were being updated per edit, which is a read-modify-write on a mutable blob — the exact
trap that ate the first editor (`docs/PIVOTS.md` P6). Derive editorial state from
`list({ prefix: 'edits/' })` instead; it is one call and always correct.

Then a private `desk.html` behind an admin key: filter by game / origin (`played` vs
`simulated`) / verdict / phase / whether a scholar has touched it. The headline view is the **scholar-priority queue**: every
scholar-hand revision and marginale across all witnesses, grouped by the encounter it
corrects, newest first.

**Done when.** You can answer "what has Matt objected to, and in which encounters?" in
one screen.

---

## 5. Simulated witnesses at scale

`origin: "simulated"` is already in the payload and the summary row. A headless runner
that plays N runs and publishes them turns the desk into a balance instrument: which
endings are unreachable, which encounters never fire, which options nobody can afford.
Pairs naturally with `tools/batch/` in the repo root.

---

## 6. Cold human playtest — still outstanding

The standing gate item since Slice 1. Nothing an agent does substitutes. Pacing,
difficulty and legibility are all unvalidated by a person who has not read the code.

---

## 7. Slice 3 — the signature systems

The composition workbench (assemble *Investigations*: language, density, diagrams,
audience) and the synthesis cosmogram (the intellectual network as a growing radial
diagram). The most distinctive unbuilt game systems. See `docs/ROADMAP.md`.

**Note:** Phase IV currently represents composition as a series of choices rather than
an assembly UI. That is not a stopgap to be embarrassed about — decide deliberately
whether the workbench genuinely beats it before building it.

---

## 8. Smaller, real, and cheap

- **Rate-limit `api/publish`.** No limit today. Do it before promoting the game. And now
  `api/edit` too — a key holder can append up to `MAX_EDITORIAL` (2000) ops per witness.
- **Compaction.** A read costs a prefix `list()` plus one fetch per editorial op. Fine at
  tens, wrong at hundreds; fold periodically into a snapshot blob **written under a new
  immutable path**, never by rewriting an existing one.
- **Check MORIGNY's witness service for the P6 bug.** If `morigny-witness` stores
  editorial layers on the witness document and rewrites it per edit, it will lose edits
  the same way this one did, silently and with 200s.
- **Clean up the three `TEST —` witnesses** on the live service when the desk exists.
- **Illustration UI.** `addIllustration`/`reviewQueue`/`notifyCount` are built and
  tested with nothing calling them — a reader attaching the manuscript a scene
  describes is a strong feature and the data layer is done.
- ~~**Citation-grade seal sources.**~~ **Done 2026-09-02**: `content/citations.js`
  resolves each pointer to the real papers in the seal tooltip, and `sourceCite`
  travels in the witness payload so off-site chronicles keep their scholarship.
- **Consolidate the two witness services** if a third game needs one. Two is fine.
- **Encounter pool depth** is currently 13–16 per phase (floor lint-enforced at 11).
  Slice 4's target is ~120 total with <40% overlap between successive runs — but measure
  first: overlap is 57% today and the cause is the deterministic draw, not pool size, so
  fixing the draw may hit the target without authoring fifty encounters.

---

## Explicitly *not* next

- **A database.** The architecture doc argues Blob is sufficient and nothing has
  changed. Do not introduce Postgres/Supabase without a requirement that Blob
  genuinely cannot meet.
- **A second copy of the game on Vercel.** The game is on Pages, the service is on
  Vercel, and they talk over CORS. Two copies of the game would drift.
- **Rewriting encounter prose wholesale.** It has been audited twice. Change it in
  response to a scholar's correction or a playtest, not on general principle.
- **The seven-tier epistemic hierarchy.** Still blocked on acquiring Melvin-Koushki's
  "Selenocentrism and Heliocentrism". Do not invent the missing tiers.
- **Moving the editorial layers back onto the witness document**, however much tidier one
  JSON file looks. Read `docs/PIVOTS.md` P6 first: it was built that way, deployed, and
  lost every edit it was given while returning 200 OK.
- **Conflict resolution for simultaneous editors.** Both edits persist in timestamp order
  and the later reading stands; nothing is destroyed. The cost of a collision is one
  extra click on the ✳ chain, which is not worth a locking scheme.
