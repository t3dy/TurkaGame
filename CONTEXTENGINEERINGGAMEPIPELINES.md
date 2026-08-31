# Context Engineering & Game Pipelines

> How to pick a model, how much of a research corpus to put in front of it, and how
> research data gets from `IslamicateOccultPortal` into a playable TurkaGame build.
>
> Written 2026-08-31. Covers both repos, since the pipeline crosses them.
> Companion to [docs/DECISIONS.md](docs/DECISIONS.md) — decisions there, method here.

---

## 1. The short answer

| Work | Model | Why |
|---|---|---|
| VN scene text, portal entries, essays | **Opus 5** | The house rule in [games/visual-novel/WRITING_GUIDE.md](games/visual-novel/WRITING_GUIDE.md) — every scene surfaces something specific and real — is exactly what cheaper models flatten into generic occult atmosphere. See §5. |
| Architecture, schema design, debugging a broken game loop | **Opus 5** | Errors here are the expensive kind: you find them days later by eyeballing output. |
| SSG plumbing, SQLite queries, build scripts, HTML/CSS, deploys | **Sonnet 5** | Verifiable against a test, a build, or a page render. Cheap to catch when wrong. **This is where most of your current Opus spend probably belongs.** |
| Per-item batch labor with a fixed rubric | **Haiku 4.5** | One image, one chunk, one link-check. Run via `tools/batch/` (§6). |
| Long autonomous sweeps where a failed run costs hours | **Fable 5**, rarely | See §7 — I don't think it's worth it for your current workloads. |

Prices, for the arithmetic in §5 and §7:

| Model | Context | In $/1M | Out $/1M | vs Opus |
|---|---|---|---|---|
| Fable 5 | 1M | $10 | $50 | 2× |
| Opus 5 | 1M | $5 | $25 | 1× |
| Sonnet 5 | 1M | $2 | $10 | 0.4× |
| Haiku 4.5 | **200K** | $1 | $5 | 0.2× |

**Haiku's 200K context is the constraint that actually decides things for you**, more often
than task difficulty does. §3 explains why.

---

## 2. The five levels of pipeline coupling

"Plugging the research pipeline into the game engine" is not one thing. It's a ladder, and
each rung costs more to build and buys a different kind of correctness. TurkaGame currently
sits between L1 and L2.

### L0 — Transcription
Read a paper, write a scene by hand. No pipeline. Every fact is re-derived from scratch each
time and correctness lives only in the author's head.

*Where you use it:* first-draft exploration of a new source.
*Context cost:* the source, in a session. *Model:* Opus 5.

### L1 — A canonical research-access layer  ← **you are here**
The game does not read the scholarship. It reads a small, curated, hand-verified layer:
[docs/BIOGRAPHY.md](docs/BIOGRAPHY.md) (13.8 KB) and
[site/data/timeline.json](site/data/timeline.json) (27.4 KB). Together ~10K tokens — they fit
in *any* model's context, including Haiku's, with room to spare.

This is the single highest-leverage thing in the whole setup and it is already built. It means
a scene-writing task needs the biography and the timeline in context, **not** the 10 MB corpus.
Your CLAUDE.md already names these "the canonical research-access layer, not
`docs/RESEARCH_BRIEF.md`'s looser prose" — that sentence is doing real context-engineering work.

*Failure mode:* the layer drifts from the scholarship, and nothing catches it. L2 fixes this.

### L2 — Structured research DB → build-time export
The portal's `db/islamicate.db` becomes the upstream source of truth, and a build step exports
the slice the game needs into `site/data/*.json`. The portal's `game_connections` table (3 rows
today) is the seed of exactly this: it already records which portal concepts have been used in
which TurkaGame design doc.

*What it buys:* a fact fixed in the portal propagates to the game on next build, instead of
being fixed in two places or one.
*What it costs:* an export script and a schema contract between the repos.
*Context cost at runtime:* zero — it's a build step.
*Model:* Sonnet 5 writes the exporter; it's verifiable by running it.

### L3 — Fact-level provenance through to runtime
Every scene line, every image, carries the id of the claim it rests on. You already have half
of this: no image enters `assets/manuscripts/` without a `registry.json` record. The other half
is text — a scene asserting Ibn Turka's 1432 death should carry the `timeline_events` id that
backs it.

*What it buys:* the audit you currently do by eyeballing becomes a script. "Which scene lines
rest on a LOW-confidence claim?" becomes a query.
*Context cost:* nothing at runtime; a fact id is a few tokens in the authoring prompt.
*Model:* Sonnet 5 for the plumbing, Opus 5 for deciding what counts as adequate grounding.

### L4 — Data-driven generation
The career sim draws its event deck from `timeline_events`; the roguelike's encounter tables
are constrained by real institutional and patronage networks rather than invented ones. Content
is *generated* against the research, not merely *checked* against it.

*What it buys:* the research scales the content instead of gating it.
*What it costs:* a real schema commitment, and the failure mode gets subtle — generated content
can be individually well-sourced and collectively give a false picture of the period.
*Model:* Opus 5 to design the generator and its constraints; the generator itself may not call
a model at all.

**Recommendation: go to L2 next, not L3 or L4.** The portal DB is already populated
(24 bibliography entries, 50 timeline events, 552 images, 13 figures) and the export is a small
script. L3 is only worth it once more than one game consumes the data. L4 is a design project,
not a plumbing project.

---

## 3. Context engineering: the numbers that actually bind

The corpus is not uniform, and this is the fact that should drive most of your model choices:

| Source | Size | ≈ tokens | Fits Haiku (200K)? |
|---|---|---|---|
| `saif-leoni-melvin-koushki-yahya-2021-islamicate-occult-sciences.md` | 2.4 MB | ~600K | **No** — nor comfortably in a 1M window |
| `shaker-2021-reintroducing-philosophy.md` | 1.7 MB | ~425K | **No** |
| `islamicate-occultism-new-perspectives.md` | 1.4 MB | ~350K | **No** |
| `goodman-mcgregor-2009-animals-versus-man.md` | 1.1 MB | ~280K | **No** |
| `gardiner-stars-and-saints-al-buni.md` | 87 KB | ~22K | Yes |
| `docs/BIOGRAPHY.md` + `site/data/timeline.json` | 41 KB | ~10K | Yes, trivially |

Four rules follow:

**1. Never feed a whole book-length corpus file to any model.** Not even a 1M-context one. Even
where it fits, you pay for 600K input tokens to get a few hundred useful claims, and recall
degrades across that span. Chunk it. `tools/batch/make_tasks.py corpus` splits the 18 substantial
sources into **268 chunks** of ~40K characters (~10K tokens) with 2K overlap, so a claim
straddling a boundary is still fully readable in one chunk.

**2. Retrieval beats stuffing.** For a scene-writing task, the right context is the biography,
the timeline, and a grep hit or two — not the source PDF's text. Your L1 layer already makes
this cheap; use it rather than re-reading corpus files in authoring sessions.

**3. Context window is a capability gate, not just a size limit.** Haiku is a fine model for a
bounded rubric task. It is the wrong model the moment the task needs three long files at once,
regardless of how simple the reasoning is. When you catch yourself wanting Haiku for something
that reads a lot, that's a signal to chunk the task, not to upgrade the model.

**4. These are OCR'd PDFs.** `gardiner-stars-and-saints-al-buni.md` renders al-Būnī as
`al-Bu¯n¯ı` and *Laṭāʾif* as `La.ta¯ if`. Any extraction prompt must instruct the model to record
garbled names as they appear at LOW confidence rather than silently repairing them — a plausible
"repair" of a transliterated Arabic name is a fabrication that reads as scholarship. The
generated prompts in `make_tasks.py` say this explicitly; keep it if you write your own.

### What belongs in context, by task

| Task | Put in context | Keep out |
|---|---|---|
| Write/revise a VN scene | `WRITING_GUIDE.md`, `BIOGRAPHY.md`, `timeline.json`, the scene's current text | Corpus sources, RESEARCH_BRIEF.md |
| Extract claims from a source | **one 40K-char chunk** | The rest of the file, other sources |
| Verify an image caption | the image, ±300 lines of source around its page, its DB row | The whole corpus file |
| Write portal entry prose | the extracted claims for that entity, with confidence flags | Raw corpus |
| Build/debug the SSG | the scripts, the schema, one sample output | Any corpus content at all |

---

## 4. Where the four work areas land

**Corpus reading → entries.** Split it in two, because it's two different jobs wearing one name.
*Extraction* is mechanical: find claims, tag entities, cite locators, flag confidence — Haiku,
batched, 268 chunks. *Synthesis* is not: turning a pile of flagged claims into an entry that
says something is Opus 5 work in a session. Right now you have 21 converted sources, 10 concepts,
and **0 essays** — the gap is synthesis, and the extraction pass is what makes synthesis cheap
by putting the claims in front of you pre-sorted instead of making you re-read.

**Site/pipeline plumbing.** Sonnet 5, nearly all of it. `build_site.py`, `convert_corpus.py`,
schema migrations, the L2 exporter, gallery HTML. The tell that something needs Opus instead:
you're deciding *what the schema should be*, not *how to write the query*.

**Game code + narrative.** Split by the same seam. Engine work (state machine, save/load,
renderer, the `window.__turkaVN` debug surface) is Sonnet 5. Scene text and choice design is
Opus 5 — see §5. Note the VN's narrative files are 157–207 lines; the whole game fits in one
context comfortably, so **do not batch VN work.** Batching is for things too big for one
session, and the VN is not one of them.

**Image cataloging.** 547 of 552 portal images are `DRAFT`, auto-extracted by `pymupdf`; only 5
are `REVIEWED`. This is the clearest batch job you have: each image is one bounded task —
look at it, check the auto-caption against the source page, classify it, flag confidence. Haiku.
A large fraction will be publisher logos, blank scans, and header fragments; the prompt says so
explicitly, because a model that doesn't expect junk will confabulate a plate description for a
page-number crop. Run it with `tools/batch/make_tasks.py images`.

---

## 5. On scholarly prose specifically

You said you want the prose as good as possible but suspect the higher models are a waste for
"straight writing." Half right, and the half that's wrong is the expensive half.

**Where the intuition is correct:** for prose with no grounding constraint — a README, a caption,
a docstring, an explanatory paragraph about code — Sonnet 5 is indistinguishable and costs 40%.
Use it.

**Where it fails:** your scene text is not straight writing. The WRITING_GUIDE rule is that every
scene must surface something specific and real — a named text, institution, practice, or
historiographical fact. That is a *retrieval-and-judgment* task wearing prose clothing. It
requires holding the biography and timeline in view, knowing that Ibn Turka's chief-judgeship in
Isfahan is loadbearing while a vague "the mystics of the age" is not, and resisting the pull
toward generic occult atmosphere. Weaker models don't fail this loudly — they produce fluent,
plausible, well-formed paragraphs that quietly contain nothing checkable. That is the single
worst failure mode for this project, because it is invisible until you read closely, and it is
precisely the thing your house rule exists to prevent.

**The arithmetic argues for Opus anyway.** A VN scene is maybe 800 output tokens. At Opus rates
that's $0.02. At Sonnet rates, $0.008. You are choosing between pennies while the real cost is
your attention during the revision pass. Prose output volume is small; it is *input context* and
*long agentic tool loops* that generate real spend, and those live in the plumbing and batch work
where Sonnet and Haiku already belong.

**A cheaper structure if you want one:** Sonnet 5 assembles the grounded scaffold — which facts
this scene will surface, pulled from the timeline with ids — and Opus 5 writes the prose over it.
That puts the cheap model on the retrieval and the expensive model on the judgment, and it tends
to produce better scenes than either alone because the fact selection becomes explicit and
reviewable before a word of prose is written.

---

## 6. The batch harness

Built and verified 2026-08-31. Lives in [tools/batch/](tools/batch/).

```
tools/batch/
├── run_batch.py      generic resumable runner — knows how to run tasks, not what they are
├── make_tasks.py     generators that survey real state and emit manifests
└── tasks/            generated .jsonl manifests + .status.json checkpoints
```

**The contract:** each task is one line of JSON with an `id`, a `prompt`, and an `output_file`.
The output file *is* the done-marker — so a rate limit, a crash, or Ctrl-C costs you one item,
and re-running the identical command resumes. Delete an output to force a redo.

```bash
python tools/batch/make_tasks.py --list
python tools/batch/make_tasks.py images --limit 50
python tools/batch/run_batch.py --tasks tools/batch/tasks/images.jsonl --limit 5
```

Always `--limit 5` first and **read the output** before committing to a sweep. That is the step
that catches a bad rubric while it has cost you five items instead of five hundred.

```bash
python tools/batch/run_batch.py --tasks tools/batch/tasks/images.jsonl --workers 4
python tools/batch/run_batch.py --tasks tools/batch/tasks/images.jsonl --status
python tools/batch/run_batch.py --tasks ... --max-budget-usd 0.10
```

Currently generated: **268** corpus-extraction chunks, **547** image reviews available.

Three design choices worth knowing:

- **The output file, not the status file, is the source of truth for "done."** A half-written
  file from a kill won't read as complete, and the status file can be deleted without losing
  your place.
- **Exit 0 with no output file is recorded as a failure**, not silently marked done. That's a
  prompt bug, and it should be loud.
- **A launch error fails one task, not the sweep.** A bad `--claude-bin` or missing cwd is
  recorded and the run continues.

### Known limitation

**`claude -p` hangs when invoked from inside a running Claude Code session** on this machine —
verified 2026-08-31 with a minimal prompt, both sandboxed and not. The runner's control flow is
fully verified (invocation, cwd resolution, checkpointing, resume-skips-done, parallel workers,
error paths) using a stub binary, but **the live `claude -p` transport has not been verified
end-to-end.** Run sweeps from your own terminal, outside a Claude Code session:

```bash
python tools/batch/run_batch.py --tasks tools/batch/tasks/images.jsonl --limit 5
```

If it hangs there too, the problem is the CLI invocation, not the runner — check
`--permission-mode` and auth first.

---

## 7. On Fable 5

You asked to be told only if it's clearly worth it. For these two projects: **it isn't, yet.**

Fable is 2× Opus and earns that on long-horizon autonomous runs where a mid-run failure is
expensive. Your expensive-failure pattern is different — it's *silent quality failure* found
later by inspection (a hallucinated label, a scene with nothing real in it, a caption confabulated
for a publisher logo), and a more capable model doesn't fix that. Verification structure does:
the confidence flags, the `--limit 5` habit, the output-file-as-done-marker.

The one case that would change my answer: an unattended multi-hour L4 generation run where you
want the whole thing to hold together without a human checkpoint. You don't have that workload
today.

---

## 8. Model-selection checklist

Before starting a task, in order:

1. **Does it need more than ~150K tokens of context at once?** → not Haiku, regardless of
   difficulty. Or better: chunk it so it does fit.
2. **Is it verifiable by running something** — a test, a build, a page render, a schema check?
   → Sonnet 5.
3. **Is the failure mode silent** — plausible output that's quietly ungrounded, or a decision
   whose cost lands days later? → Opus 5.
4. **Is it the same bounded rubric applied N times?** → Haiku via `tools/batch/`, `--limit 5`
   first.
5. **Otherwise** → Sonnet 5. It is the correct default for this codebase; Opus is the
   *considered* choice, not the safe one.

---

## See also

- [CLAUDE.md](CLAUDE.md) — project ground rules, including the scenes-reveal-the-real-world house rule
- [docs/DECISIONS.md](docs/DECISIONS.md) — the decision log
- [games/visual-novel/WRITING_GUIDE.md](games/visual-novel/WRITING_GUIDE.md) — the prose constraint §5 is about
- `../IslamicateOccultPortal/CLAUDE.md` — the upstream research repo and its image catalog
