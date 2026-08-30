# ENDINGS_AUDIT.md — A Narrative Designer's Second Pass on the Research

Re-read `docs/BIOGRAPHY.md`, `docs/RESEARCH_BRIEF.md`, all three `research/notes/`
files, and `site/data/timeline.json` cold, with the built game (not the design
docs) in mind, looking specifically for: attested material the 40 choices don't
use, genuine counterfactual/alternate-history branch points Melvin-Koushki's own
method licenses, and gaps in the endings tree. Three findings rose to the top;
two were small enough to fix in this pass (marked ✅ **Implemented**), one is a
larger proposal for a future session.

## 1. The endings tree under-represents the single biggest real outcome ✅ Implemented

**The gap:** `research/notes/03-the-occult-court.md` makes a claim none of the
7 existing endings reflect: *"Ibn Turka and his colleagues are named directly as
founders of this platform... traced onward through Yazdi... that defined
Persianate courts for centuries after."* This isn't a modest "his students kept
his ideas alive" claim — it's that the Occult Quintet / lettrist-astrological
platform became the *default imperial cosmology* across Timurid, Aqquyunlu,
Safavid, Uzbek, Ottoman, and Mughal courts for **centuries**, regardless of what
happened to Ibn Turka personally. The closest existing ending, "The New Brethren
Endures," is scoped to "a dozen students carry a piece forward" — a real but far
smaller claim than what the research actually supports.

**Why this matters for the game specifically:** every existing ending scores
success or failure in terms of Ibn Turka's own lifetime. The research's most
dramatic claim is that his *personal* outcome was almost beside the point — the
platform won regardless. A game whose whole premise is "history isn't fixed,
here are other lives he could have lived" is missing the one ending that plays
that irony straight: an outcome where the *player's* choices (breadth of
teaching, popularization) visibly influenced how completely the platform spread,
even though it happened either way in the real world.

**✅ Implemented:** added an 8th ending, **"Source Code of Empire"** —
reachable when `c34=hold`, `c22=wide` (taught broadly), *and* `c23=yes`
(produced popularizations) — the combination that most closely models the
real mechanism (teaching broadly + writing in forms that could actually
travel). Distinct from "New Brethren Endures" (`c22=wide` alone, no
popularization) by naming the real scale: not a circle of students, but the
imperial cosmology outcome that outlived every court that adopted it.

## 2. Two choices' dramatic weight doesn't reach the ending logic ✅ Implemented

Cross-checking every flag `computeEnding()`/`epilogueFor()` actually reads
against all 40 choices found two that `CHOICES.md` itself frames as consequential
but that had zero mechanical effect on the ending:

- **`c33` (distance from vs. refuse to abandon Qasim-i Anvar)** — `CHOICES.md`'s
  own annotation says *"this is where Act I's choice #4 pays off or costs the
  most."* It didn't. `c33`/`c04` affected only the consequence-screen flavor
  text at the moment of the choice, never the ending or epilogue.
- **`c36` (exile destination: new patron / retreat / reconcile)** — only the
  `retreat` option was ever read by `computeEnding()` (for "The Solitary Sage").
  Picking `new_patron` or `reconcile` had no distinguishing effect on which
  ending resulted — mechanically inert beyond their own consequence text, despite
  `reconcile` being framed in `CHOICES.md` as "the hardest and highest-risk
  option."

**✅ Implemented:** `epilogueFor()` now adds a clause for `c33`/`c04` (whether a
deep bond was honored or a friend was distanced under pressure) and one for
`c36=reconcile` (attempted return to Isfahan society, framed as unresolved —
the sources don't say whether such an attempt would have succeeded, so the
epilogue holds that ambiguity rather than inventing a verdict).

## 3. A real, under-dramatized counterfactual: Shah Rukh's violence — proposed, not yet implemented

**The gap:** `c10` ("loyalty through political risk") currently frames Iskandar
Sultan's decline abstractly — *"his star... has begun to dim... everyone at
court is doing the math on when to leave."* The actual historical event behind
that framing is much starker and currently invisible to the player: Iskandar
Sultan was **defeated, blinded, and executed in 1415 on the order of his own
uncle, Shah Rukh** (in `site/data/timeline.json` as `1415-iskandar-sultan-fall`,
tagged `CONTEXT` since it's standard Timurid political history rather than
something Melvin-Koushki's papers state directly — but it's the necessary,
real explanation for why Ibn Turka's patronage shifts to Baysunghur, Shah Rukh's
own son). Right now the game never makes a player reckon with having been a
known associate of a prince who was just blinded and executed by the man whose
son is about to become their next patron.

**Why this is a genuine counterfactual, not just missing flavor:** Melvin-Koushki's
own method (used explicitly in "Dr Dee's Ottoman Adventure") is to take a real
figure and ask what a different real-world decision at a real juncture would
have meant. Shah Rukh's paramountcy over both of Ibn Turka's patrons (uncle to
the first, father to the second) is a real structural fact the current 40
choices don't engage with directly — Ibn Turka never gets a scene about whether
to also, or instead, seek the *paramount* ruler's favor, rather than staying
scoped to whichever prince's court he's currently in. A prince's court can fall
in a way the empire itself doesn't.

**Proposed addition** (not implemented this pass — sequencing note below): a new
choice between `c10` and `c11`, something like *"After Iskandar Sultan's fall:
petition Shah Rukh directly, or wait to be received through Baysunghur alone."*
Petitioning directly is the higher-variance, more "counterfactual" branch —
attested political access to Shah Rukh is not directly documented for Ibn Turka
in the sources currently in hand, making this `PLAUSIBLE-GAP` at best, but it's
a structurally real fork (does a scholar tainted by association with an executed
prince try to clear his name at the top, or work his way back in through the
safer, lower-stakes channel of the son's court?) that the historical record's
silence on Ibn Turka's specific choice doesn't mean was unavailable to him.

**Why not implemented this pass:** adding a 41st choice changes `STATE_MODEL.md`'s
"all 40 choices" scope decision (`docs/DECISIONS.md`) and needs either inserting
a choice (renumbering everything downstream — real cost) or folding the beat into
`c10`/`c11`'s existing text instead of adding a new choice. The lower-risk version
of this proposal: **revise `c10`'s scene text to name the actual blinding and
execution explicitly**, without adding a new choice — recommended as the
immediate next step over the full new-choice version. Left for a future pass so
it can get proper attention rather than being squeezed in here.

## Smaller notes, not acted on

- `c17` (narrow vs. diversify) and `c25` (generous vs. overclaim crediting
  sources) still don't individually influence which ending results, only
  `breadth()` in aggregate. `c25` in particular is thematically ending-relevant
  (honesty about originality, in a game about how history judges you) and is a
  good future candidate for its own epilogue clause, same pattern as `c33`/`c36`
  above.
- The Aqquyunlu — the actual contemporary rival Turkic dynasty a wandering exile
  in this exact period and place could plausibly seek patronage from — is named
  in `CHOICES.md`'s own commentary on `c36` ("a rival court (Aqquyunlu? further
  east?)") but never made it into the shipped `new_patron` option text, which
  still just says "a rival court." Cheap, high-value future fix matching
  `WRITING_GUIDE.md`'s naming rule.
