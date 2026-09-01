# NEXTSTEPS — CareerSim

Written 2026-08-31, end of the witness-system session, for whoever opens the next
window. Ordered. Each item says **why it is where it is** and **how you know it is
done**, because "done" has repeatedly meant "code exists" in this project and that is
not the same thing.

Read first: [HANDOVER.md](HANDOVER.md) (state), [AUDIT.md](AUDIT.md) (systems map).
Architecture for items 1–3: `../../DungeonAB-morigny/docs/PLAYTHROUGH_WITNESS_ARCHITECTURE.md`
(written for MORIGNY; the Turka service is the same contract, second game).

---

## 1. The editor — Matt must be able to correct the text ★ do this first

**Why first.** The entire point of publishing a witness is that a scholar can correct
it. Right now the scholar link resolves the hand and then says "the editor arrives in
the next build". Every other item on this list is less valuable than closing that loop,
and the data model, the keys and the hashes are all already in place waiting for it.

**Build.**
- `witness/api/edit.mjs` — POST `{ id, key, op, ... }`. Verify `sha256(key)` against
  the stored hash, derive the hand from *which* hash matched, and **append**:
  - `op: "revise"` → push `{ ts, anchor, field, old, new, hand, author }` onto
    `revisions`. Never mutate `log[i]` in place: the original must stay recoverable.
    Anchors are `{ entryIndex, field }` where field is `situation` | `outcomeText` |
    `chronicle` | `optionLabel:<n>` | `optionDetail:<n>`.
  - `op: "annotate"` → push `{ ts, anchor, text, hand, author }` onto `annotations`.
  - `op: "preface"` → set `preface.current`, keeping `preface.orig`.
  - Reject any write that touches `meta`, `log[].band`, or anything mechanical.
    **Editorial changes must never alter the simulation's record** — that is the
    invariant the whole design rests on; enforce it server-side, not by convention.
- `witness/public/w.html` — when `hand` is non-null: a quill affordance on each
  editable block; marginalia render **in the margin**, attributed and dated, with the
  hand visually distinct (scholar in vermillion, player in lapis, per the style
  guide's colour semantics). Current text shows by default; a click reveals the
  original and the chain of revisions.
- Keep the public (no-key) view exactly as it is today, plus rendered marginalia.

**Done when.** From a scholar link you can change a sentence and add a margin note;
reloading the public link shows the corrected text and the note, attributed; the
original is still recoverable in the payload; and a `revise` attempt against `meta`
is rejected with a 4xx. Verify by doing it against the deployed service, not locally.

**Watch out.** Two people editing the same witness will last-write-win. Acceptable at
this scale — say so in the UI rather than building conflict resolution.

---

## 2. Tell Matt — the actual point of the exercise

**Why second.** Nothing is validated until a scholar has used it. After item 1, send
one real playthrough's scholar link and ask him to correct anything wrong.

**Done when.** A witness exists carrying at least one scholar-hand revision or
marginale that changed something in the game's content.

**Then feed it back.** A scholar-hand correction anchored to `encounterId` is a
signal to rewrite that encounter's prose, or its mechanics, in `content/phaseN.js`.
That loop — witness → correction → content change → new build — is the reason this
system exists.

---

## 3. The researcher's desk

**Why third.** It is the tool for *many* witnesses; it is thin while there are five.
Build it once items 1–2 are producing real material.

**Build.** `witness/api/index.mjs` listing summary rows from `index/*.json` (already
being written at publish time — this is why). A private `desk.html` behind an admin
key: filter by game / origin (`played` vs `simulated`) / verdict / phase / whether a
scholar has touched it. The headline view is the **scholar-priority queue**: every
scholar-hand revision and marginale across all witnesses, grouped by the encounter it
corrects, newest first.

**Done when.** You can answer "what has Matt objected to, and in which encounters?" in
one screen.

---

## 4. Simulated witnesses at scale

`origin: "simulated"` is already in the payload and the summary row. A headless runner
that plays N runs and publishes them turns the desk into a balance instrument: which
endings are unreachable, which encounters never fire, which options nobody can afford.
Pairs naturally with `tools/batch/` in the repo root.

---

## 5. Cold human playtest — still outstanding

The standing gate item since Slice 1. Nothing an agent does substitutes. Pacing,
difficulty and legibility are all unvalidated by a person who has not read the code.

---

## 6. Slice 3 — the signature systems

The composition workbench (assemble *Investigations*: language, density, diagrams,
audience) and the synthesis cosmogram (the intellectual network as a growing radial
diagram). The most distinctive unbuilt game systems. See `docs/ROADMAP.md`.

**Note:** Phase IV currently represents composition as a series of choices rather than
an assembly UI. That is not a stopgap to be embarrassed about — decide deliberately
whether the workbench genuinely beats it before building it.

---

## 7. Smaller, real, and cheap

- **Rate-limit `api/publish`.** No limit today. Do it before promoting the game.
- **Illustration UI.** `addIllustration`/`reviewQueue`/`notifyCount` are built and
  tested with nothing calling them — a reader attaching the manuscript a scene
  describes is a strong feature and the data layer is done.
- **Citation-grade seal sources.** Seals currently show repo-relative strings
  (`BIOGRAPHY — Formation (Cairo)`), meaningless to a live-site reader. Resolve to
  a real citation, ideally linking the site timeline.
- **Consolidate the two witness services** if a third game needs one. Two is fine.
- **Encounter pool depth** is currently 13–16 per phase (floor lint-enforced at 11).
  Slice 4's target is ~120 total with <40% overlap between successive runs.

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
