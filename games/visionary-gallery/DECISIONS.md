---
title: Visionary Gallery — decisions
description: Implementation-level choices for the fetch/analyse/papercraft/build pipeline, with rejected alternatives and the two bugs the honesty instruments caught.
---

# Visionary Gallery — decisions

Detail too fine for [`docs/DECISIONS.md`](../../docs/DECISIONS.md). Direction changes live
in [`docs/PIVOTS.md`](../../docs/PIVOTS.md).

## Corpus selection

### 22 images, chosen for mechanics rather than for coverage

**Decision.** Eight traditions, unevenly sampled: 6 Cairo Būstān folios, 3 ascension, 3
Haft Paykar pavilions, 2 Siyah Qalam, 2 Qazwīnī, 2 Falnāma, 3 Jalāyirid, 1 Manṭiq al-Ṭayr.

**Rationale.** Each entry earns its place by carrying a *mechanism* the pipeline or a game
could use, not by representing its tradition fairly. `docs/VISIONARY_ENVIRONMENTS.md`
states the criterion: **does the image carry a mechanic, or only a mood?**

**The six Cairo Būstān folios are the point of the whole set.** They are the same
manuscript, painter and year as Yūsuf Ascent's folio, and they answer an open question the
portal had already recorded: *is f. 52b's spatial strategy exceptional within its own book,
or the norm?* The set deliberately spans impossible architecture (Yūsuf), real architecture
(the mosque), landscape (Darius), an interior (the judge's court) and two folios of pure
illumination with no figures at all.

**Rejected alternative.** A balanced sample across traditions. It would have made the
corpus scatter prettier and told us less.

### Wikimedia Commons rather than the holding institutions

**Decision.** Every image comes from Commons, via the API, with licence and provenance read
from `extmetadata`.

**Rationale.** Commons is the only source in reach that exposes licence, author, institution
and date as *queryable structured fields*. That is what lets the rights check be a function
instead of a promise. Fetching from the BnF, the Freer or Topkapı directly would give
better images and no machine-readable rights, which inverts the tradeoff this project cares
about.

**Consequence.** The images are lower resolution than the institutions would provide, and
two (`qazwini-tortoise`, `falnama-seven-sleepers`) are black-and-white reference photographs
rather than colour. Kept anyway: they demonstrate the analysis handles monochrome, and
`chroma_mean = 0.0` on both is a correct result, not a failure.

### `haft-black-pavilion` yields one region and is kept

**Decision.** It is a small, dark reproduction; the region proposer finds one region and
papercraft emits a single card. It stays in the corpus.

**Rationale.** A corpus that contains only its successes is not a corpus. The workbench
shows the failure plainly.

## Measurement

### Five metrics, each answering a question the project had already asked in prose

**Decision.** `attention_evenness`, `orientation_spread`, `rectilinearity`,
`ground_fraction`, `chroma_mean` — plus a k-means palette. Fixed seed (20260831), no
sampling, deterministic.

**Rationale.** Each one exists because a sentence somewhere in this project asserted it.
`ground_fraction` is the Siyah Qalam claim ("figures with no world") made checkable.
`attention_evenness` is the Bihzād claim. `orientation_spread` is "architecture that does
not agree with itself." Metrics invented to look thorough would not be worth the compute.

**Consequence.** `ground_fraction` and `chroma_mean` separate the traditions cleanly —
Jalāyirid drawings at 0.39–0.46 bare paper and chroma 4–10, Timurid illuminations at
0.00–0.04 and 28–34. That separation is the cheapest available evidence the measures
measure something, and it is the gallery's front-page chart.

### The disagreement stayed on the page

**Decision.** `attention_evenness` ranks the Yūsuf folio **14th of 22**, contradicting the
portal's own load-bearing sentence. Published, with the explanation.

**Rationale.** The metric punishes Bihzād's large *deliberate* blank arch, which the portal
elsewhere praises. So it locates a confound rather than refuting the claim — uniformity of
*treatment* and uniformity of *detail density* are different measures, and only the second
is implemented. That is a sharper statement than the original sentence.

**Consequence.** The Method page's headline is that this project's own prose failed a test.
Every figure on that page is read from generated JSON at load time; nothing there is a
number someone typed.

## Deconstruction

### Boxes from colour quantisation, and the honest account of what that misses

**Decision.** Regions are proposed by mean-shift filtering → k-means to 10 clusters →
connected components per cluster → size, aspect and fill filters → containment suppression.

**Rationale.** Persianate painting is largely fields of flat colour, so a method that finds
fields of flat colour finds a lot of it cheaply and with no per-image work.

**What it misses, measured not guessed.** `compare_hand.py` against the one folio that also
exists hand-made: **27%** of hand regions at IoU ≥ 0.2, **7%** at 0.3. It misses the
chamber, Yūsuf, the flame-halo and the brackets over nothing — every element the reading is
actually made of, because each of them shares a ground with its surroundings.

**Rejected alternative.** A segmentation model. It would find figures, and it would also
make the pipeline undeterministic and unexplainable, at which point the machine-versus-hand
comparison stops being interpretable. The point of this build is to know exactly what the
cheap method is worth.

### The layer heuristic, and its polarity

**Decision.** `0.45 × (1 − normalised vertical centre) + 0.35 × normalised detail density +
0.20 × normalised chroma`, ranked **ascending**, cut into *n* equal bands. Layer 0 is
deepest, layer *n*−1 frontmost.

**Rationale.** In Persianate painting higher on the page tends to read as further into the
picture, and the elements carrying the most detail and the most saturated pigment tend to be
the ones the painter wanted foremost. Ascending so the index runs the same direction as a
cosmological rung.

**The bug this fixed.** It originally ranked descending and called layer 0 "deepest";
`papercraft.py` then used layer 0 *as the ground plate*, silently dropping the
highest-salience regions of every folio into the flat backdrop. Caught by
`compare_hand.py` returning a Spearman correlation with the sign opposite to what the code
comments predicted — the comments had confused `layer_score` with `layer`. See
[`docs/PIVOTS.md` P4](../../docs/PIVOTS.md).

**Consequence.** The ground is now its own card (index 0) and every layer gets a card.

## Papercraft

### A tunnel book, specifically — not a pop-up, not a diorama

**Decision.** Each folio becomes a paper tunnel book: a stack of cards held apart by two
notched concertina side walls, each card cut away except for what belongs on its plane.

**Rationale.** Not an aesthetic choice. A tunnel book has **exactly the property the 3D
prototype was built to demonstrate** — the picture only coheres from the front, and steps
apart into separate planes when you move — and it predates it by about three centuries. The
script and `proto-b-stack` are two renderings of one idea, and the paper one is older.

**Rejected alternative.** A pop-up (folds along a spine, so the depth is a hinge rather
than a stack — wrong mechanism); a flat exploded diagram (loses the "only from the front"
property entirely).

### Boxes, not traced silhouettes

**Decision.** Cut shapes are the region boxes with rounded corners, not traced outlines.

**Rationale.** A box is what you can cut with a craft knife and a steel rule on a kitchen
table. A traced silhouette would look better on screen and be unbuildable, which would make
the whole exercise a rendering rather than a papercraft.

### Sheets are A4-wide and several A4 pages tall

**Decision.** The sheet grows downward as needed — the Yūsuf one is 210 × 1426 mm, five A4
pages — and **states its own size and page count in its header text**, telling the reader to
tile-print or use a roll.

**Rationale.** Honest is better than a lie about fit. Proper A4 pagination with registration
marks that survive the cut is a real piece of work and it is not done.

**Known limitation.** None of the sheets has been printed and folded. The geometry is
plausible and untested on paper.

## The site

### Derived visuals are drawn client-side from the numbers

**Decision.** The attention heat map and the region overlay are **not** shipped as images.
They are drawn to canvas and DOM from `attention_grid` and `regions` in `gallery.json`.

**Rationale.** Cheaper in bytes, interactive for free, and — the real reason — it removes a
second source of truth. A baked overlay can drift from the JSON it was rendered from; a
canvas cannot.

**Consequence.** Only the detail map ships as a JPEG, because it is a per-pixel field rather
than a small grid.

### three.js is imported across folders rather than vendored twice

**Decision.** `workbench.js` imports
`../yusuf-ascent/vendor/three.module.js` rather than keeping its own copy.

**Rationale.** This repo's rule is not to reach across game folders for shared code until
two prototypes are past a first slice. That rule is about *game logic* — sharing it early
couples designs that should be free to diverge. A vendored third-party library is not game
logic, and duplicating 2 MB to satisfy the letter of the rule against its purpose would be
worse. The reasoning is in a comment at the import site.

**Watch for.** If a third surface needs three.js, move it to a repo-level `vendor/`.

### Assets: ship 33 MB, gitignore 187 MB

**Decision.** `build_gallery.py` emits the web-ready subset into `assets/`;
`research inbox/` and `imagelab/output/` stay gitignored.

**Consequence.** A fresh clone must re-run `fetch_commons.py` before it can re-run the
analysis. Stated at the top of the README.

## Annotation

### The batch tier exists, is validated, and has not been run

**Decision.** `tools/batch/make_tasks.py visionary` generates 22 bounded per-image
annotation tasks — one image, ~2 KB of its own measured facts, Haiku, `Read Write` only.
The prompt forbids inventing a shelfmark, folio, patron or date, forbids asserting narrative
content the image does not plainly show, and forbids cosmological interpretation (a separate
hand pass does that, and needs the description neutral).

**Rationale.** `docs/VISIONARY_ENVIRONMENTS.md` identified annotation as the expensive part
of the pipeline; `compare_hand.py` then measured *how* expensive. This is the tier that
fills the gap, and it is the tier `CONTEXTENGINEERINGGAMEPIPELINES.md` routes to Haiku:
bounded per-item work against a fixed rubric.

**Not run.** Per `tools/batch/README.md`, `claude -p` hangs when invoked from inside a
running Claude Code session. The manifest is generated and validated; the outputs do not
exist. This needs a real terminal:

```bash
python tools/batch/run_batch.py --tasks tools/batch/tasks/visionary.jsonl --limit 5
```

**Output status.** Everything it writes is a **proposal for human review**, never a fact.

## The named gap — closed 2026-09-01

**L2 is built.** `portal/scripts/export_gallery_scholarship.py` exports 10 entries and 15
tradition links from `portal/db/turka.db` into `data/scholarship.json`; the workbench
renders them with the portal's own confidence/review flags, and the front page shows entry
chips per tradition. The entries are the portal's and regenerate from the DB; only the
mapping is authored here, and each link shows its one-line rationale on the page.

Two things stayed deliberately honest: the source DB is this repo's `turka.db` rather than
the sibling `islamicate.db` named in the original plan (reasons in
[`docs/DECISIONS.md`](../../docs/DECISIONS.md) § 2026-09-01 — in-repo reproducibility, and
it holds the Ibn Turka entries the readings actually use); and the export records its own
gaps **inside the JSON**, where the next person to run it will see them.

Recording those gaps is what closed the biggest one. The export said "no divination entry
exists"; a concurrent session then wrote `geomancy` and `jafr`, and the Falnāma now links
to both with the link's limits stated (bibliomancy on pictures, a century later — a link of
kind, not lineage). A duplicate entry drafted here was **removed rather than shipped
alongside theirs**; its extra grounded material is parked in
[`portal/docs/NOTE_geomancy_merge_candidate.md`](../../portal/docs/NOTE_geomancy_merge_candidate.md).

**The export fails loudly on a missing slug, and that is deliberate.** `seed_from_json.py`
prunes DB rows absent from the seed file, so an upstream merge can remove an entry this
mapping depends on. Two were removed mid-build (`treatise-on-barzakh`,
`timurid-patronage`); the export's `sys.exit` caught it in seconds instead of shipping dead
links. **Re-run the export after any portal re-seed.**

The tradition blurbs on the front page remain site prose, now sitting *above* sourced
chips rather than substituting for them.
