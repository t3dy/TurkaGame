# Handover — CareerSim

## State (2026-08-31, sixth session: **the witness system ships**)

The Career Sim plays end to end as a static site, and a finished run can now be
**published to a permanent URL** with separate private links for the player's hand and
the scholar's hand. That was the queued priority; it is live and verified.

- **Play**: https://t3dy.github.io/TurkaGame/CareerSim/
- **Witness service**: https://turka-witness.vercel.app (Vercel project `turka-witness`)
- **A real published run**: https://turka-witness.vercel.app/w.html?id=w_cQr7hRSoCadW
- **Next steps**: [NEXTSTEPS.md](NEXTSTEPS.md) — read before planning work.
- **Systems map**: [AUDIT.md](AUDIT.md) — the evidence-based map of what interlocks.

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

### Tests
**31 passing** (`node --test tools/test-engine.mjs`), including the standing lints —
Chekhov's-gun memory lint, no-dead-Quintet-branches, plate↔registry provenance,
lexicon reachability, pool-depth floor — plus three new ones covering run-log capture
and payload shape.

---

## Verified this session (in a browser, not by reading diffs)

- A real 29-decision playthrough captured 29 run-log entries.
- **Publish** cross-origin from `127.0.0.1` to Vercel returned all three links; the
  published page renders 29 entries, 29 chosen options, 7 locked options with reasons,
  29 grounding seals, 10 manuscript plates.
- `GET /api/witness` without a key → `hand: null` and **no key hashes in the response**;
  with the scholar key → `hand: "scholar"`.
- Editorial layers come back empty, as they must until the editor exists.

---

## What is NOT done — the honest list

1. **The editor does not exist.** The scholar link resolves the hand and says "the
   editor arrives in the next build". Matt can *read* a witness at his own URL but
   cannot yet correct text or leave marginalia. Biggest gap; NEXTSTEPS item 1.
2. **No `api/edit.mjs`.** The data model reserves `revisions`/`annotations`/`preface`
   and the keys are minted and hashed — only the write endpoint is missing.
3. **The illustration layer has no UI.** `addIllustration`/`reviewQueue`/`notifyCount`
   are implemented and tested; nothing calls them.
4. **No researcher's desk.** `index/{id}.json` summary rows are written at publish time
   precisely so a dashboard can list thousands of witnesses cheaply — dashboard unbuilt.
5. **No cold human playtest.** Still. Agent playthroughs are not a cold reader.
6. **Slice 3 unbuilt** — composition workbench, synthesis cosmogram.
7. **Two Vercel projects** now run this architecture (`morigny-witness`,
   `turka-witness`). Fine at two; if a third game wants witnesses, consolidate.
8. **No rate limiting on the service.** Anyone who finds the endpoint can publish.
   Acceptable while unlisted; not if the game is promoted widely.

---

## Where things live

```
CareerSim/
├── CLAUDE.md · DESIGN.md · AUDIT.md · HANDOVER.md · NEXTSTEPS.md
├── docs/            SYSTEMS · UI_STYLE_GUIDE · ENCOUNTER_ATOMS · ROADMAP · DECISIONS
├── content/         phase1–5.js (70 encounters) · people.js · lexicon.js · index.js
├── src/engine/      state · engine · career · export      (framework-agnostic, tested)
├── src/             main.js · ui.js · witness-client.js
├── witness/         the Vercel service: api/publish · api/witness · public/w.html
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
