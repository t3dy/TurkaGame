# PROPOSAL.md — Rethinking the Game Systems Before Building Further

Formalizes the findings of [CONVERSATION.md](CONVERSATION.md) (2026-08-30) into
four workstreams with priorities, concrete specs, scope estimates, and explicit
non-goals. **Nothing here is implemented yet** — this is the plan to agree on
before the next build pass.

## The findings, in numbers

Verified against v3 code by script, not memory:

| Finding | Evidence |
|---|---|
| 20 of 40 choice flags are never read downstream by anything (gates, dynamic text, endings, epilogue) | audit script in CONVERSATION.md |
| *Which* science you pick at c16 changes nothing but the ending seal's color | skills are read only as `breadth()` (once) and a raw total (one text threshold); `dominantScience()` feeds only the seal tint |
| The pitch art promises "stronger skills unlock new options, help in crises, and influence endings" — currently false for *which* skill | 0 skill-gated options exist |
| `STATE_MODEL.md` line 53 claims c34 survivability reads hīmiyā/līmiyā + c07/c10/c31 | `endings.js` contains zero references to any of them |
| "Lettrist" appears twice in-game and is never defined; the setting's premise (occult science as court technology) is stated nowhere in the game | grep + cold read of the first ten minutes |
| The Quintet panel shows five unexplained transliterated terms from choice 1; the pentad is first explained at c16 (Act IV) | cold read |

## Workstream A — Make the Occult Quintet load-bearing *(highest priority)*

The advertised system must do the three things the pitch promises.

**A1. Skill-gated options — one signature moment per science.** Engine change:
`optionAvailable()` in `state.js` gains an optional `skill_gate: {science: min}`
alongside the existing flag `gate`; the gated-note UI renders "requires Sīmiyā 3"
style text for locked ones. Then five new options (add, never restrict existing
ones — every current path stays playable):

| Choice | New option | Gate | Why this science, here |
|---|---|---|---|
| c15 (rival's public challenge) | Answer with a demonstration that turns the room | rīmiyā ≥ 2 | trickery's whole identity is astonishing an audience fast |
| c20 (finalize the diagram) | Seal the Ṭahawī Circle as a working talisman, not just a figure | līmiyā ≥ 3 | talismanry makes the diagram *do* something |
| c24 (grimoire commission) | Counter-offer alchemical patronage — prestige kept, income found | kīmiyā ≥ 3 | alchemy is the income-with-prestige science |
| c31 (first inquisition) | Enter the tribunal warded — protective operations prepared | hīmiyā ≥ 3 | subjugation/protection is literally "help in crises" |
| c35 (flee or stand) | Leave by misdirection — gone before the summons lands | sīmiyā ≥ 3 | illusionism escapes without the `flee` option's indignity |

Four of these five sit on currently-dead choices (c20, c24, c31, c35) — double
duty. New flag values (e.g. `c35: "veiled"`) are safe: all existing downstream
checks are equality tests, so novel values simply don't match them (verified).
Each new option needs a detail line, a consequence line, and — where an ending
or epilogue check should notice the new value — a one-clause extension.

**A2. Dominant-science epilogue sentence.** `epilogueFor()` appends one sentence
keyed to `dominantScience()` — five sentences to author, and suddenly the c16
choice is read back to every player at the end of every run.

**A3. Resolve the STATE_MODEL lie about c34.** Implement the modest version:
holding firm with `himiya + limiya ≥ 4`, or `c31 ∈ {patron, both}`, or
`c10 = loyal`, earns a survivability epilogue clause (the protections and
loyalties that made defiance *survivable-in-spirit* — his work's survival, since
the man's death in 1432 stays fixed where the player holds firm). Then rewrite
STATE_MODEL's row to describe exactly what ships, no more.

*Scope: one engine function, 5 options (~15 lines of content), 6 epilogue
sentences, one doc fix. Roughly one focused session including verification.*

## Workstream B — Echo pass on the dead flags

Triage all 20, in two buckets.

**B1. Wire these eight — the drama is pre-loaded** (dynamic scene/consequence
text unless noted; pattern already proven by c31/c33/c38):

| Earlier choice | Read back at | The payoff |
|---|---|---|
| c02 (open vs. deniable discipleship) | c31 scene | the tribunal opens the file our own scene text said they were keeping: public discipleship under "infamous" Akhlāṭī is Exhibit A — or they struggle to prove the lineage you kept deniable |
| c32 (recanted at first inquisition) | c34 scene | the third tribunal quotes your own recantation back at you — the single most obvious payoff in the arc |
| c26 (took the judgeship at all) | `rehabilitated_judge` ending gate | **bug-level fix**: you cannot survive "specifically as a judge" if you declined the judgeship; ending should require `c26 = accepted` |
| c05 (lineage foregrounded) | c25 scene | the crediting scene names the tradition *you* chose to stand on |
| c13 (active vs. formality on the bench) | c27 scene | the defining case arrives differently for a judge who's present vs. one whose court runs itself |
| c29 (mercy to the rival occultist) | c33 scene | the man you spared — or condemned — is in the room when names are asked |
| c01 (scholastic vs. unconventional formation) | c18 consequence | building math-first feels like the madrasa's discipline returning, or like paying for having skipped it |
| c08 (atelier collaboration) | c12 scene | the calligraphers invite the colleague they already know |

**B2. Declare the rest expressive, in writing.** c06, c11, c14, c16, c18, c30
(skill-feeders, and A-workstream makes the skills real), plus c28/c35 (gate
*targets* — their meaning is upstream). Add an "Expressive choices" section to
STATE_MODEL listing them, so the spec matches reality and the next audit reads
intent instead of rediscovering gaps. Target after both buckets: **dead flags ≤
6, every one deliberately so.**

*Scope: ~8 dynamic-text entries + 1 ending-gate change + doc section. About one
session, mostly writing.*

## Workstream C — The opening actually introduces the world

**C1. A prologue screen** — one veiled card between the title and Act I, ~100
words, no lore dump. It must do exactly three things: state the premise (in this
world, as in the real 15th century, courts run on occult science the way they
run on treasuries), define lettrism in one clause (*ʿilm al-ḥurūf* — the science
of letters, reading creation as written in an alphabet whose mathematics can be
worked), and place the protagonist (Isfahan-born jurist, 1369, about to go
looking for teachers). Draft to be written under the Teach template (D).

**C2. The Quintet panel teaches instead of intimidating.** Pre-c16: panel
subtitle "The five occulted sciences — undeclared," and each science label gets
a `title` tooltip with its one-line gloss (the c16 detail text, reused). After
c16 the subtitle drops. No layout change.

**C3. First-use gloss rule** added to WRITING_GUIDE: the first appearance of any
period term gets an appositive gloss of ≤ 6 words, once, never re-glossed.
Specificity without pedagogy is a paywall (CONVERSATION.md's phrasing — keep it
in the guide, it's the memorable form of the rule).

*Scope: one screen, one UI state, one guide rule, plus an Act I–II gloss audit
of existing text. Half a session.*

## Workstream D — Segment style templates: Teach / Complicate / Pay off

Replace WRITING_GUIDE's single uniform template with three segment addenda (the
core rules — name real things, ~10–20-word option details — stay global):

- **Acts I–II, "Teach."** Scene text may run 50–90 words. Every proper noun
  arrives with a role clause on first meeting. At most one new period term per
  scene, glossed per C3. The player should *feel* stakes before they can define
  terms.
- **Acts III–VI, "Complicate."** 40–70 words, vocabulary assumed, no re-glossing.
  Reactivity budget: **every act ≥ 1 reactive scene.** (Current per-act count:
  III has c12, IV has none — B1's c01→c18 fixes it, V has c22, VI has c27.)
- **Acts VII–VIII, "Pay off."** Every scene reads at least one earlier flag —
  the game reciting the player's own record back. Currently VII manages 3 of 5
  and VIII manages 2 of 5 (c34 skill-read, c38); B1's c02→c31, c32→c34 wirings
  and A1's gated options close most of the remainder. Consequence beats may run
  long here; nowhere else.

*Scope: WRITING_GUIDE edit plus a targeted (not wholesale) prose pass on Act I–II
scenes for glossing. Half a session. This is a template change, not rewrite #4.*

## Sequencing and versioning

1. Freeze current state as `games/visual-novel-v3/` before touching code — the
   established versioned-deploy pattern (DECISIONS.md).
2. **Session 1: A + B** (engine + wiring — the systems work this proposal
   exists for). Ships as **v4.0**.
3. **Session 2: C + D** (prologue, tooltips, guide templates, Act I–II gloss
   pass). Same version — it's the writing half of the same rethink.
4. Re-run the audit script and the acceptance checks below; update STATE_MODEL,
   GAMELOOP, NEXTSTEPS.

## Acceptance checks (scripted where possible)

- [ ] Audit script: dead flags ≤ 6, and every remaining one is listed in
      STATE_MODEL's new "Expressive choices" section.
- [ ] Each of the five sciences gates ≥ 1 option (grep `skill_gate`).
- [ ] Two scripted playthroughs identical except c16 (kīmiyā vs. sīmiyā) differ
      observably in ≥ 3 places (option availability, scene text, epilogue).
- [ ] STATE_MODEL contains no behavioral claim the code doesn't implement
      (manual review of the gates/endings tables).
- [ ] *ʿilm al-ḥurūf* is defined exactly once in-game, before Act I's first
      choice.
- [ ] All existing playthroughs remain completable (no removed options, no
      tightened existing gates except the c26→rehabilitated_judge fix, which
      only re-routes to `quiet_compromise` — verify that fallthrough).

## Non-goals — declared so this doesn't balloon

- **No relationship meters, no inventory** (standing mechanics decision).
- **No 41st choice**; the Shah Rukh petition idea stays parked in
  ENDINGS_AUDIT.md.
- **No prose rewrite #4.** Only B1's echo insertions and the Act I–II gloss
  audit touch existing text.
- **No new endings.** Eight is enough until a human cold-playtest (still the
  top open item in NEXTSTEPS Tier 0) says otherwise.
- **No art/audio scope.** Unchanged from NEXTSTEPS Tier 4.
