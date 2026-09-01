---
title: Pivots
description: Direction changes made mid-build, with what we were doing, what changed, why, what it cost, and what to watch. Distinct from DECISIONS.md, which records choices made once and kept.
---

# Pivots

[`docs/DECISIONS.md`](DECISIONS.md) records choices made and kept. This file records the
places where the work **changed direction after it had already started** — which is
different, and more useful, because a pivot carries evidence that the first direction was
wrong.

Each entry: what we were doing → what changed → why → what it cost → what to watch.

---

## P1 — "Psychedelic" was the wrong word, and it would have produced the wrong game

**Was.** The source file for the Bihzād folio carries a curatorial note calling it "a
psychedelic out-of-body philosophy," and the first framing of the whole minigame followed
it. The obvious build from that framing is warped colour, drifting camera, ambient drone.

**Changed to.** The period's own technical vocabulary, taken from this project's corpus
with page references: **ʿālam al-khayāl** (the imaginal — where forms subsist *as* images),
**barzakh** (the isthmus joining spirit to body), **miʿrāj** (ascent as the primary mode of
prophecy), **khalʿ** (doffing the body — the technique by which the ascent is actually
made).

**Why.** *Psychedelic* is a twentieth-century word for a twentieth-century experience.
Building to it produces lava-lamp Orientalism: a game that looks like the 1960s wearing
Persian costume. The period has precise terms for exactly this domain, and they are
*operative* — Kāshifī defines *sīmiyā* as the manipulation of imaginal constructs, which is
a mechanic, not an atmosphere. Suhrawardī says the path is **necessarily traumatic** and
names talismans as engines of ascent, which is a cost model.

**Cost.** Nothing, because it happened before code. It did add a research pass to ground
each term with a page reference.

**Watch for.** The pull back toward atmosphere is constant, and it comes disguised as
polish. `GRAPHICS.md`'s refusal table exists partly for this: "volumetric fog between the
rungs" is the obvious mystical move and it would turn a diagram into a mood. The rule that
survived: **a visionary environment here is a technique with a cost, not a dream sequence
with warped colours.** A clean reward would misrepresent the sources.

---

## P2 — From asserting to measuring, and being wrong twice

**Was.** Two sentences written in this project's own prose, both plausible, neither tested:

1. *"Every surface is finished to the same degree of attention"* — the load-bearing
   evidence in the Yūsuf Ascent portal for reading the palace as a diagram rather than a
   house.
2. *"The machine layers agree with the hand-drawn rungs about two thirds of the time"* — a
   line in an early draft of the gallery.

**Changed to.** Both were operationalised and measured. Both came out differently.

1. **Attention evenness** (one minus the dispersion of detail density over a 16×16 grid)
   ranks the Yūsuf folio **14th of 22**, below the corpus mean of 0.612. It does not single
   the folio out at all.
2. **`compare_hand.py`** on the one folio that exists in both forms: the machine **ranks**
   well (Spearman ρ = 0.86, p = 0.0006 against the hand-argued rung) and **finds** badly
   (27% of hand regions at IoU ≥ 0.2, 7% at 0.3). "Two thirds" was wrong in both
   directions at once.

**Why it matters more than a confirmation would have.** The first disagreement locates a
**confound**, not a refutation: the metric punishes Bihzād's large blank white arch, and
the portal itself praises that blank as deliberate. Gradient density cannot tell a
considered void from an unfinished one. So the honest conclusion is that *uniformity of
treatment* and *uniformity of detail density* are different measures and only the second is
implemented — which is a sharper statement than the original sentence was.

**Cost.** Two scripts (`analyze.py`, `compare_hand.py`) and a Method page. Also the
discomfort of publishing a page whose headline is that the project's own prose failed.

**Watch for.** The temptation to delete the sentence rather than the claim. Both
contradictions could have been removed with one keystroke each. They are on
`games/visionary-gallery/method.html` because they are the most useful things there. The
standing rule: **if a sentence in this project's prose is testable, test it before quoting
it as evidence.**

---

## P3 — Scope grew from one painting to a corpus, and the two halves turned out not to be substitutes

**Was.** A standalone minigame on one folio: 43 hand-drawn regions, seven argued rungs,
eight door locks, ~2,000 words of hand-written cards. The implicit assumption was that this
was *the expensive first one* and later images would be cheaper.

**Changed to.** A second, parallel build — 22 folios through an automatic pipeline with
**zero** per-image authoring — kept alongside the hand-made one rather than replacing it.

**Why.** The assumption needed testing, and the only way to test it was to build the
automatic version and score it against the hand-made one. The result is unambiguous and it
is not the hoped-for one: the machine reproduces the *ordering* of the reading and misses
the *elements* the reading is made of — the chamber, Yūsuf, the flame-halo, the brackets
over nothing. It finds fields of flat colour, because that is what colour-quantised
connected components find, and Persianate painting is largely fields of flat colour with
the argument sitting on top of them.

**Cost.** Roughly doubled the build. Produced 187 MB of gitignored intermediates. And it
means the project now maintains two pipelines rather than one.

**Watch for.** Presenting the generated gallery as equivalent to the hand-made
decomposition. It is not, and the numbers are on the page. The sentence that came out of
this: **an automatic pipeline gets you a corpus; it does not get you a reading.** The
useful reframing is that L4 generation and L1 authoring answer different questions —
*what is in the corpus* versus *what is this picture doing* — and the gap between them is
where the annotation tier (`tools/batch/make_tasks.py visionary`) belongs.

---

## P4 — The layer ordering was inverted, and the papercraft was eating its most important cards

**Was.** `analyze.py` ranked regions by salience **descending** and called layer 0 "deepest
first". `papercraft.py` then used layer 0 as the full-page ground plate.

**Changed to.** Ranking **ascending** — layer 0 is the deepest and least salient, layer
*n*−1 the frontmost — and the ground is now its own card, index 0, with every layer getting
a card of its own.

**Why.** Two bugs stacked. The naming ran opposite to a cosmological rung, which made the
machine-versus-hand confusion matrix unreadable. Worse, because the ground plate consumed
"layer 0", and layer 0 held the *highest*-salience regions, the papercraft was silently
dropping the most important elements of every folio into the flat backdrop. It looked
plausible in a preview and was wrong.

**How it was caught.** Not by looking. By writing `compare_hand.py` and finding a Spearman
correlation with the sign opposite to the one the code comments predicted — which turned
out to be the comments confusing `layer_score` with `layer`, and that confusion pointing
straight at the ordering bug.

**Cost.** A re-run of the whole pipeline downstream of `analyze.py`, and a corrected note
in three scripts.

**Watch for.** Any place a heuristic's *index* and its *score* run in opposite directions.
The same class of error nearly shipped in the 3D view, where depth was computed from the
layer index directly; it now counts down from the frontmost layer.

---

## P5 — Verification moved from "does it render" to "does the invariant hold"

**Was.** Checking a 3D scene by taking a screenshot and looking at it.

**Changed to.** Numerical self-tests carried by the artifact itself:
`__yusufB.checkStationInvariant()` measures worst-case screen-space drift across all 41
panels between explode 0 and explode 1 and returns ~1e-16 against a 1.5e-3 tolerance. The
gallery's 3D tab carries the same test and prints it on the page.

**Why.** The bug that motivated this — the folio backdrop plate rendering *in front of* the
exploded strata — looked entirely plausible in a single screenshot. It was caught by
querying panel z-positions, not by looking. A visual property that can be stated as an
equation should be checked as one.

**Cost.** Small. The test is thirty lines and it lives in the debug handle.

**Watch for.** Screenshot-only verification of anything with a stated mechanism.
`GRAPHICS.md` P5 proposes extending this to a committed diagnostic mosaic — three camera
poses × three explode values × two debug modes, diffed against a baseline — which would
have caught the backdrop bug automatically.

---

## P6 — From "write the missing entry" to "delete my own and keep theirs"

**Was.** The L2 export named its own highest-value gap: the portal had no divination entry,
so the Falnāma tradition had nothing honest to link to. The obvious move was to write one,
and the corpus supports it richly — four Melvin-Koushki geomancy studies, 326 hits in
*Persianate Geomancy* alone. A full `ilm-al-raml` entry was drafted, seeded and wired in.

**Changed to.** Deleting it, and using the entry a **concurrent session** had written in
the same hours.

**Why.** Re-running the export after seeding failed immediately: the other session had
rewritten `portal/data/seed.json`, adding `geomancy` and `jafr` and merging away two
entries the L2 mapping referenced. Their `geomancy` was already wiki-linked into the rest
of the portal and written in its voice. Two entries for one science is worse than either
alone, and editing their live entry to fold mine in is a concurrent-write hazard dressed up
as helpfulness.

**Cost.** An hour of corpus mining that did not ship as an entry — but did not evaporate
either: it is in `portal/docs/NOTE_geomancy_merge_candidate.md` with every citation, for a
deliberate merge by whoever owns `geomancy`.

**Watch for.** Two things. First, **`seed_from_json.py` prunes** — a row removed upstream
disappears downstream, so anything consuming the portal DB must be re-run after a re-seed
and must fail loudly on a missing slug rather than skipping it. The export's `sys.exit` is
what caught this in seconds. Second, and more general: in a repo where other sessions are
writing the same files, **check whether the gap you are about to fill is still a gap**
before you fill it. The export told me it was; twenty minutes later it was not.

## What has not pivoted, and should not without argument

- **Boxes stay in `imagelab/`.** Two builds now depend on this; it is what made re-cutting
  cheap when readings changed.
- **No lighting in either 3D scene.** The source has none. See `GRAPHICS.md`'s refusal table.
- **The seven-rung ladder is an interpretation and is labelled at point of use.** The
  temptation to quietly promote it to a caption grows every time it is reused.
- **The negative result stays on the page.** No source in the 43-source corpus mentions
  Bihzād or Zulaykha. The whole connection to Ibn Turka is thematic, and a reader should
  meet that fact without hunting for it.

---

## P6 — The editorial layers had to stop living on the document they edit

**Was.** The witness document held its own editorial layers: `revisions`, `annotations`,
`preface` as arrays on the published JSON. `api/edit.mjs` read the document from Vercel
Blob, appended a record, and wrote the whole document back. Append-only *within* a
mutable object. The data model had been designed that way a session earlier and looked
obviously right.

**Changed to.** Each editorial op is its own blob — `edits/<witnessId>/<ts>-<rand>.json`,
written once, never rewritten — and readers fold them onto the frozen witness
(`lib/edits-store.mjs`, `foldEdits()` in `lib/edit-core.mjs`). The published document is
now genuinely immutable.

**Why.** It was deployed and it silently ate every edit. Three live corrections in a row
returned `200 OK` with sensible-looking record payloads, and the stored document ended up
containing only the last one — the counters in the responses went `revisions:1` →
`revisions:0, annotations:1` → `revisions:1, annotations:0`, each write having read a
pre-edit copy. A Blob's public URL is served through a CDN whose cache key **ignores the
query string**, so the usual cache-bust (`?_=${Date.now()}`) does nothing, and
`cache: 'no-store'` on the fetch only governs the local cache. Setting
`cacheControlMaxAge: 0` on the write did not fix it either. An object that is written
once and never changed cannot go stale, so the fix is structural rather than another
cache knob — and it is what "append, never mutate" should have meant in the first place.

**Cost.** One wasted deploy, one abandoned round of cache patches, and two witnesses on
the live service (`w_7a1jADna8hvV`, `w_5L-SnZX2lF8b`) whose test edits are gone. Reads
now cost a prefix `list()` plus one fetch per op instead of a single fetch. At the current
scale that is nothing; past a few hundred edits on one witness it would want a periodic
compaction into a snapshot blob.

**Watch for.** Anything that read-modify-writes a Blob object. The `index/{id}.json`
summary row was doing exactly this to keep edit counters current; it now stores only what
publish knows, and the researcher's desk must derive editorial state from the `edits/`
prefix instead. Also watch the shape of the evidence: the endpoint returned `200` with a
correct-looking `record` every time, and the bug was only visible in the *sequence* of
counters across calls. Verifying one write in isolation would have passed.
