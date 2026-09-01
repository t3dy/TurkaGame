# Handover — CareerSim

## State (2026-09-01, ninth session: **the economy retune and the gradient pass**)

The Career Sim plays end to end as a static site, a finished run can be **published to a
permanent URL**, and — new this session — whoever holds the scholar's or player's key can
**correct the text and leave margin notes on the published witness**. That closes the loop
the whole witness system exists for. It is live and verified against the deployed service.

- **Play**: https://t3dy.github.io/TurkaGame/CareerSim/
- **Witness service**: https://turka-witness.vercel.app (Vercel project `turka-witness`)
- **A real published run**: https://turka-witness.vercel.app/w.html?id=w_cQr7hRSoCadW
- **A witness carrying corrections and a margin note** (test record, seventh session):
  https://turka-witness.vercel.app/w.html?id=w_LqadFu4CAsQO
- **Next steps**: [NEXTSTEPS.md](NEXTSTEPS.md) — read before planning work.
- **Systems map**: [AUDIT.md](AUDIT.md) — the evidence-based map of what interlocks.
- **The loop, measured** (added 2026-08-31): [docs/GAMELOOP.md](docs/GAMELOOP.md) ·
  [docs/MECHANICSISSUES.md](docs/MECHANICSISSUES.md) · [docs/ECONOMY.md](docs/ECONOMY.md) ·
  [docs/ENCOUNTERSNEXTSTEP.md](docs/ENCOUNTERSNEXTSTEP.md) ·
  [docs/WRITINGAUDIT.md](docs/WRITINGAUDIT.md). Regenerate their figures with
  `node tools/analyze-content.mjs` and `node tools/simulate-runs.mjs 2000`.

Run locally: serve the repo root, open `/CareerSim/`. (Another chat may hold port 7521;
any port works — the game is static.)

---

## What exists

### The game
Five life-phases, **70 encounters**, all grounding-tagged (ATTESTED / PLAUSIBLE-GAP /
INVENTED-COMPATIBLE) and sourced. Career systems: obligations (the judgeship taxes
every action), patron contracts (deadline, reward, expectation inflation, settled at
phase end), compounding exposure that gates the inquisitions. The ending is a
**14 × 9 matrix** — personal fate × system fate — with ~150 marginalia lines reading
the run's memory back, plus "The Attested Life" setting the historical record beside
what the player did. Historical terms auto-gloss from a 23-term lexicon. The engine is
framework-agnostic under `src/engine/`; the UI follows `docs/UI_STYLE_GUIDE.md`.

### The witness system (new this session)
The model, unchanged from the architecture doc:
`game state → immutable event record → generated witness → editorial layers → published witness`

- **`src/engine/export.js`** — `logEntry()` freezes one encounter exactly as the game
  presented it: situation, *every* option with its unlockedBy/lockedBy provenance,
  which was chosen, the outcome band, and the chronicle line with `orig` preserved
  beside `current`. `buildChroniclePayload()` assembles the run. Also holds the
  **illustration layer** (contributor roles, scholar-priority review queue) — data
  complete and tested, no UI yet.
- **`src/engine/state.js`** — `runLog: []` is now part of a run.
- **`src/main.js`** — captures each resolved encounter; hands the payload to the
  ending screen; the publish button posts it.
- **`src/witness-client.js`** — posts to the service; same-origin if served from
  Vercel, else the hosted service. **One game build, one service** — deliberately no
  second copy of the game on Vercel to drift out of sync.
- **`witness/`** — the service. `api/publish.mjs` mints an id and two secret keys,
  stores only sha256 hashes, writes the witness document plus a summary row for the
  future researcher's desk. `api/witness.mjs` reads, strips hashes, and reports which
  hand a key belongs to. `public/w.html` renders the public witness: the two verdicts,
  the Attested Life, the marginalia, then the full record — every decision with its
  grounding seal and every option including the locked ones with their reasons. CORS
  is open because the game is on Pages and the service is on Vercel.

### The editor (new this session)
- **`witness/lib/edit-core.mjs`** — the pure half: what may be edited (allow-list:
  `situation`, `outcomeText`, `chronicle`, `optionLabel:<n>`, `optionDetail:<n>`), what
  may never be (`FORBIDDEN_FIELDS` — bands, grounding, sources, meta, plates, lock
  reasons), how a revision chain resolves to the standing text, and `foldEdits()`.
  Separated from the endpoint precisely so the invariant is testable without deploying.
- **`witness/lib/edits-store.mjs`** — each op is its own immutable blob under
  `edits/<id>/`; the witness document published last session is never rewritten. Readers
  fold. **This is not a style choice** — the first deployed version stored editorial
  arrays on the witness document and lost every edit to a CDN-cached read. See
  `docs/PIVOTS.md` P6 before changing it back.
- **`witness/api/edit.mjs`** — POST `{id, key, op, anchor, ...}`; derives the hand from
  which key hash matched; `revise` / `annotate` / `preface`; refuses mechanical fields
  with a 400 that says why, and a missing/bad key with 403.
- **`witness/public/w.html`** — quill (✎) on every editable passage, ✒ margin notes
  rendered in a real margin (scholar vermillion, player lapis, each also naming its hand
  in words), ✳ opening the revision chain with the game's original at the bottom. The
  public no-key view gains the corrections and marginalia and keeps everything else; the
  colophon now states how many times the text has been corrected rather than claiming it
  stands as the game gave it.
- **`witness/devserver.mjs`** — local harness mirroring the production storage shape, so
  the UI can be driven end to end before a deploy. `.claude/launch.json` config
  `witness-editor-dev` (port 7533). Excluded from deploys via `.vercelignore`.

### Tests
**31 passing** (`node --test tools/test-engine.mjs`), including the standing lints —
Chekhov's-gun memory lint, no-dead-Quintet-branches, plate↔registry provenance,
lexicon reachability, pool-depth floor — plus three new ones covering run-log capture
and payload shape.

**Plus 11 passing for the editor**: `node --test witness/test-edit.mjs` — the invariant
walk over every forbidden field, hand derivation, anchor validation, and three
regression tests for the lost-edit bug (three ops in sequence all survive the fold; a
second edit to one passage sees the first as its `old`; the fold is order-independent).

---

## Verified this session (against the deployed service, not by reading diffs)

On `w_LqadFu4CAsQO`, published to production and then edited:

- A scholar-hand revision, a scholar-hand margin note, a player-hand revision and a
  preface, issued in sequence — **all four survive**, and a fifth edit to an
  already-corrected passage reported the *first correction* as its `old`.
- `log[0].situation` still reads as the game wrote it while the page shows the corrected
  reading; the ✳ chain shows the original beneath it.
- Every forbidden field refused with 400 from a **valid** scholar key: `band`, `meta`,
  `grounding`, `source`, `encounterId`, `options`, `plate`. No key → 403.
- The public no-key view: corrections and the margin note render, zero editing controls,
  no key hashes in the payload, colophon states 3 corrections and 1 note.
- One edit driven through the deployed page's own handlers (not curl): signed as
  M. Melvin-Koushki, corrected a chosen option's label, saved, and confirmed persisted by
  re-reading `/api/witness`.
- Layout measured at 1200px and 375px: no horizontal overflow at either, margin column
  240px on wide, collapsing beneath the entry on mobile.

**Not verified visually.** The Browser pane was hidden for this session, so screenshots
did not track scroll and pixel clicks did not land. Everything above was asserted against
the live DOM and the live API instead, which is stronger evidence than a screenshot — but
nobody has *looked* at the editor on a wide screen. Worth thirty seconds next session.

---

## What is NOT done — the honest list

1. **Matt has not been sent a link.** The editor exists and works; no scholar has used
   it. Nothing about this system is validated until one has. Now NEXTSTEPS item 1, and
   it is a message to send, not code to write.
2. **Nobody has looked at the editor on screen.** Verified by DOM assertion and API
   response against the live service, and measured for overflow at two widths — but the
   Browser pane was hidden all session, so no human or screenshot has seen it rendered.
3. **The measured-defect queue is now substantially cleared** (2026-09-01, third pass):
   0 dead gates · gradient rule holds (0 gated single-outcome options, 26 new bands,
   `min_exposure` bottom rungs) · meter rescale done (synthesis unpinned, `source_code`
   67%→23% and no longer modal, `scholarly` the honest modal at 33%) · expectation read
   by 3 boosts · 25 cross-phase memory sites · no-gate encounters 24→9 · the Ibn Turka
   problem measurably holds under greedy play (the system wins while 60% of the men are
   broken, informers, or recanters). **Still open, honestly:** overlap 52% vs <40%
   (Slice 4 pool depth, not tuning), demonstration median 1 vs target 4, contracts
   0.62/run vs ≥2 (the §4 authoring pass), ~3 rare encounters. 73 encounters, 49 tests.
4. **No researcher's desk.** And note the change: `index/{id}.json` no longer carries
   editorial counters (it was a mutable-blob read-modify-write, the same trap that ate
   the first editor). The desk must derive editorial state from a
   `list({ prefix: 'edits/' })`.
5. **The illustration layer has no UI.** `addIllustration`/`reviewQueue`/`notifyCount`
   are implemented and tested; nothing calls them.
6. **No cold human playtest.** Still. Agent playthroughs are not a cold reader.
7. **Slice 3 unbuilt** — composition workbench, synthesis cosmogram.
8. **Two Vercel projects** now run this architecture (`morigny-witness`,
   `turka-witness`). Fine at two; if a third game wants witnesses, consolidate. Note that
   MORIGNY's service, if it stores editorial layers on the witness document, has the P6
   bug — it should be checked before anyone edits a witness there.
9. **No rate limiting on the service.** Anyone who finds the endpoint can publish, and
   now anyone holding a key can append unboundedly (capped only by `MAX_EDITORIAL`,
   2000 ops per witness). Acceptable while unlisted; not if the game is promoted widely.
10. **No compaction.** Reading a witness costs a prefix `list()` plus one fetch per
   editorial op. Fine at tens; past a few hundred ops on one witness it wants a periodic
   fold into a snapshot blob.
11. **Three test witnesses are on the live service** — `w_7a1jADna8hvV` and
   `w_5L-SnZX2lF8b` (edits lost to the P6 bug) and `w_LqadFu4CAsQO` (this session's
   verification). All titled `TEST —` and `origin: "simulated"`. Filter or delete them
   when the desk is built.

---

## Where things live

```
CareerSim/
├── CLAUDE.md · DESIGN.md · AUDIT.md · HANDOVER.md · NEXTSTEPS.md
├── docs/            SYSTEMS · UI_STYLE_GUIDE · ENCOUNTER_ATOMS · ROADMAP · DECISIONS
├── content/         phase1–5.js (70 encounters) · people.js · lexicon.js · index.js
├── src/engine/      state · engine · career · export      (framework-agnostic, tested)
├── src/             main.js · ui.js · witness-client.js
├── witness/         the Vercel service
│   ├── api/         publish · witness · edit
│   ├── lib/         edit-core (rules + fold, tested) · edits-store (blob layout)
│   ├── public/      w.html — the witness, and the editor
│   ├── devserver.mjs   local harness (launch config `witness-editor-dev`, :7533)
│   └── test-edit.mjs   11 tests
└── tools/           test-engine.mjs (31 tests)
```

## Operating the witness service

Nothing routine. It was created with `vercel link --project turka-witness` and
`vercel blob create-store turka-witnesses --access public --yes`, which provisioned
`BLOB_READ_WRITE_TOKEN` into the project automatically — no secret was ever copied by
hand, and none is in the repo. Redeploy after changing `witness/`:

```bash
cd CareerSim/witness && vercel deploy --prod --yes
```

The game itself deploys with the repo via GitHub Pages on push to `main`.
