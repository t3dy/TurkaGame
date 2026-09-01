---
title: Visionary Gallery
description: 22 Persianate folios downloaded with their licences, measured, deconstructed, turned into papercraft and 3D, and made playable. The L4 counterpart to Yūsuf Ascent's hand-authored L1.
---

# Visionary Gallery

Twenty-two folios from eight Persianate traditions — ascension cycles, planetary
pavilions, demons on bare paper, a book of omens, Jalāyirid marginal drawings from
Ibn Turka's own lifetime, and **six folios from the same manuscript as Bihzād's
impossible palace**.

Downloaded with their licences read from structured data, measured, cut into parts,
turned into printable paper tunnel books and into 3D, and made playable.

## Run it

Serve the repo root (`.claude/launch.json` config `turkagame-site`, port 7521) and
open `/games/visionary-gallery/index.html`.

| Page | What it is |
|---|---|
| `index.html` | Gallery — 22 folios by tradition, with a corpus scatter |
| `workbench.html?id=…` | Per-folio: Folio · Analysis · Depth (3D) · Papercraft · Play |
| `assay.html` | Corpus game — two folios, one measure, which scores higher |
| `method.html` | The pipeline, what the numbers mean, and the two places measuring contradicted the prose |

Debug handles: `window.__gal`, `__wb`, `__wb3d`, `__assay`, `__method`.

**Why it is built this way:** [`DECISIONS.md`](DECISIONS.md) (implementation choices and
rejected alternatives) and [`../../docs/PIVOTS.md`](../../docs/PIVOTS.md) (the five places
this work changed direction, and what each cost).

## The pipeline

Nothing in `assets/` or `data/gallery.json` is hand-written. Regenerate the lot:

```bash
python imagelab/scripts/fetch_commons.py
python imagelab/scripts/analyze.py
python imagelab/scripts/papercraft.py
python imagelab/scripts/compare_hand.py
python imagelab/scripts/build_gallery.py --svg-px 340 --folio-px 820 --plate-px 480
python portal/scripts/export_gallery_scholarship.py
```

`research inbox/` and `imagelab/output/` are gitignored — they hold ~120 MB of
sources and intermediates. `build_gallery.py` emits the ~26 MB web-ready subset that
is actually committed.

## What is measured, and what is guessed

**Measured** (`imagelab/scripts/analyze.py`, fixed seed, deterministic):
attention evenness, orientation spread, rectilinearity, bare-ground fraction, mean
CIE Lab chroma, and a k-means palette. These are measurements.

**Heuristic**: the region proposals and the layer assignment. Every surface that
shows them says so. `compare_hand.py` puts a number on how good they are, against
the one folio that also exists hand-made:

- **27%** of hand-drawn regions found at IoU ≥ 0.2; **7%** at IoU ≥ 0.3.
- Spearman **ρ = 0.86** (p = 0.0006) between the machine's layer score and the
  hand-argued rung, on the 11 regions where the two overlap.
- It misses the chamber, Yūsuf, the flame-halo and the brackets — every element the
  argument is actually made of.

So: it **ranks** well and **finds** badly. An automatic pipeline gets you a corpus;
it does not get you a reading. That is the honest summary and it is on the
[Method](method.html) page in those words.

## Two things the measuring contradicted

1. **"Every surface is finished to the same degree of attention."** The Yūsuf
   Ascent portal's load-bearing evidence. Operationalised as attention evenness, it
   ranks the Yūsuf folio **14th of 22**, below the corpus mean. The metric punishes
   Bihzād's large deliberate blank — so it locates a confound rather than refuting
   the claim, and the honest conclusion is that uniformity of *treatment* and
   uniformity of *detail density* are different measures.
2. **"The machine agrees with the hand about two thirds of the time."** An earlier
   draft of this site said that. Nobody had measured it. The real figures are above.

Both could have been removed by deleting a sentence. They are the most useful
things here.

## Where this sits on the coupling ladder

Per [`CONTEXTENGINEERINGGAMEPIPELINES.md`](../../CONTEXTENGINEERINGGAMEPIPELINES.md):

- **[Yūsuf Ascent](../yusuf-ascent/README.md) is L1** — a hand-authored research-access
  layer. 43 elements, seven rungs, eight locks, all argued. Expensive per image, and
  the only one of the two that produces a reading. It is now also **half of L3**:
  every element carries what it rests on, tagged ATTESTED / CORPUS / FIELD /
  INFERENCE / INTERPRETATION, and the game shows it on the card.
- **This gallery is L4** — data-driven generation. Regions, layers, papercraft nets
  and the 3D stack are all generated against measured properties. 22 folios entered
  and none needed a writer. L4's stated failure mode is content that is individually
  well-formed and collectively misleading, which is precisely what the
  machine-versus-hand comparison exists to catch.
- **L2 is built (2026-09-01).** `portal/scripts/export_gallery_scholarship.py` exports
  portal entries into `data/scholarship.json` at build time — the entry text and the
  portal's own confidence/review flags come from `portal/db/turka.db`; only the
  tradition-to-entry links are authored, each with its rationale shown on the page.

## Rights

All 22 images are from Wikimedia Commons under free licences, read from Commons'
structured licence data by the fetch script rather than asserted by hand — anything
that did not parse as free was not downloaded. Each folio's workbench page links its
Commons record.

The gate had a bug on first run: a regex anchored on `pd-` rejected every plain `pd`
file, blocking 19 of 22. It is fixed, and the fix is commented in the script rather
than quietly applied, because a rights gate that silently over-blocks is one bad edit
away from silently under-blocking.

## Annotation

The measured pipeline produces structure, not description. `tools/batch/make_tasks.py
visionary` generates 22 bounded per-image annotation tasks (one image, ~2K tokens of
its own measurements, Haiku, `Read Write` only) whose output is a *proposal for human
review*, never a fact — the prompt forbids inventing a shelfmark, folio, patron or
date.

```bash
python tools/batch/make_tasks.py visionary
python tools/batch/run_batch.py --tasks tools/batch/tasks/visionary.jsonl --limit 5
```

**Run it from your own terminal.** Per `tools/batch/README.md`, `claude -p` hangs when
invoked from inside a running Claude Code session, so this sweep has *not* been run —
the manifest is generated and validated, the outputs do not exist yet.

## Known gaps

- The tradition blurbs on the front page are still site prose; the sourced entries now
  sit beside them as chips rather than replacing them. The portal has no divination
  entry, so the Falnāma tradition's one link carries an explicit mismatch note — adding
  a geomancy/divination concept to the portal is the highest-value fix this surfaced.
- The region proposer misses figures that share a ground with their surroundings,
  which is most figures. It finds fields of flat colour, because that is what
  colour-quantised connected components find.
- `haft-black-pavilion` yields one region and no papercraft layers — it is a small,
  dark reproduction and the proposer has nothing to work with. It is left in rather
  than dropped, since a corpus that only contains its successes is not a corpus.
- The papercraft sheets have never been printed and folded. The geometry is plausible
  and untested on paper.
- Each sheet is A4-wide but several A4 pages tall (the Yūsuf one is 210 x 1426 mm), so
  it needs tiled printing or a roll. The sheet states its own size and page count. A
  proper A4 pagination pass — cards laid out across pages with registration marks that
  survive the cut — is not done.
- Prototype Play ("Anatomy") has no touch handling and no keyboard path.
