# GRIMOIRE.md — The TurkaGame Memory System

**Established 2026-09-02.** This directory is three things at once, deliberately:

1. **A karpathy wiki** (the `C:\Dev\wiki` pattern, scoped to this project): raw sources
   live in `research/` and the portal corpus; this is the compiled, interlinked
   synthesis. `INDEX.md` catalogs every page; `LOG.md` is the append-only record.
2. **A grimoire**: pages are *operative*, not archival. Each ends with what it lets the
   game DO — encounters, gates, fates, portal entries. A page nothing casts from is a
   dead page; the reachability discipline applies to knowledge too.
3. **A game design bible**: the shared canon the prototypes (CareerSim, the VN, v2,
   the roguelike) draw on, so design decisions cite pages instead of re-deriving them.

## Structure

```
grimoire/
├── GRIMOIRE.md            this charter
├── INDEX.md               one line per page — the only file loaded routinely
├── LOG.md                 append-only: date | page | what changed
├── NARRATIVEDESIGNER.md   the persona charter for design readings
├── themes/                research pages on Melvin-Koushki's historiography
│                          (PATRONAGE.md, DEE.md, OCCULTOPHOBIA.md, …)
└── readings/              NARRATIVEDESIGNERREADSXXX.md — the designer reads a
                           page, doc, or design brief and emits game decisions
```

## The standing practice — bake this into every session

**This system grows or it rots.** Sessions working on TurkaGame design or research are
expected to keep emitting pages:

- **Research something → write a `themes/` page** (or extend one). Never leave a
  finding only in chat; chat history gets summarized, pages persist.
- **Design against research → write a `readings/NARRATIVEDESIGNERREADSXXX.md`**,
  in the persona of [NARRATIVEDESIGNER.md](NARRATIVEDESIGNER.md), where XXX names
  what was read (a theme page, a design doc, a brief, a corpus source).
- **Every new page**: add its line to `INDEX.md`, append to `LOG.md`, link related
  pages with plain relative links. A link to a page that doesn't exist yet marks work
  worth doing, not an error (the wiki convention).
- **Honesty labels are mandatory.** Every themes/ page opens with a grounding
  statement: which sources were actually read in full text, and which claims come from
  general knowledge unverified against the corpus (marked ⚠). This is the project's
  ATTESTED/PLAUSIBLE-GAP/INVENTED discipline applied to our own scholarship.

## House rules inherited

- **No copyrighted PDFs, no long quotations.** Original paraphrased synthesis with
  citations only; at most a short attributed line. (Parent CLAUDE.md rule; the
  pre-commit hook enforces the PDF half.)
- **General biographical/cosmological research still goes to the portal seed first**
  (`../IslamicateOccultPortal/`, `portal/db/turka.db`); grimoire pages synthesize and
  *point*, they don't replace the portal as the structured record.
- **Cite exactly or label.** Exact citations come from bibliographies in locally-held
  texts; a citation reconstructed from memory is marked ⚠ until checked.

## Why this shape

The project keeps proving the same lesson (DECISIONS.md, PIVOTS.md, MEMORY): work
that lives only in a conversation is work that gets re-derived, and a claim without a
recorded ground drifts. The grimoire is the standing fix — and naming it a grimoire is
not decoration. Per [themes/GRIMOIRESASCOURTLYMANUALS.md](themes/GRIMOIRESASCOURTLYMANUALS.md),
the period's own grimoires were *practical manuals for operating a court*: synthesized,
democratized, indexed for use. That is exactly what this directory is for the game.
