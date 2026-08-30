# VN State Model & Divergence Engine

Answers the mechanics questions from the CHOICES.md follow-up conversation
(2026-08-30): skill tree only (no separate inventory/relationship-meter systems for
now), fully divergent branching, all 40 choices in scope, multiple endings with the
historical outcome as just one among several.

**How "fully divergent" stays tractable to actually author:** not one hand-written
scene per combinatorial path (40 binary-ish choices would explode into an
unauthorable number of unique scenes). Instead, a modest, complete **state model**
(5 skill scores + ~40 flags, one per choice in
[CHOICES.md](CHOICES.md)) that later scenes and the ending both read from. Divergence
comes from scenes checking state and branching their *content* and *option
availability* accordingly — the same authored scene for choice #31 reads
differently, and offers a different option, depending on whether choice #10 kept
loyalty. This is a state machine producing apparent combinatorial richness from
linear authored content, not literal path explosion.

## Skill tree: the Occult Quintet

Five non-negative integers, starting at 0. Primarily set by Act IV (choices 16-20),
secondarily nudged by a handful of earlier/later choices whose content plausibly
touches a science.

```
skills = { kimiya: 0, limiya: 0, himiya: 0, simiya: 0, rimiya: 0 }
```

Choice #16 sets a `primary_science` flag and grants +3 to that score. Choices
#17-20 grant +1 to a related science depending on the option picked (see
`choices.json`). No upper bound; the ending logic reads whichever score is highest
("dominant science") plus total investment (breadth vs. specialization).

## Flags

One flag per choice, id matching the choice number in CHOICES.md (`c01`...`c40`).
Value is the id of the option the player picked (see `choices.json` for each
choice's option ids — e.g. `c34` is `"bend"` or `"hold"`). Full list and every
option's exact id/effects live in [choices.json](choices.json); this file is the
model, not the data.

## Gates — where "fully divergent" gets real teeth

Not every option is always available. A handful of later choices are gated by
earlier ones, so a playthrough's history visibly narrows or widens what's possible
later — this is the actual mechanical expression of "lasting impressions," not just
flavor text:

| Later choice | Gate | Effect if gate fails |
|---|---|---|
| #31 "call in patron favor" | `c10 == "loyal"` | Option hidden — you have no favor to call in if you defected early |
| #33 "refuse to abandon anyone" | none (always available) | but its *cost* scales with `c04 == "deep"` — a deep bond makes refusal more narratively expensive |
| #34 "hold firm" | none (always available — this is the historical choice and must stay reachable) | v4: holding firm with `himiya+limiya >= 4`, or `c31 ∈ {patron, both, warded}`, or `c10 = loyal`, adds a survivability epilogue clause (the work and its carriers outlast the verdict; the 1432 death itself stays fixed). Implemented in `epilogueFor()` — this row previously described logic that did not exist (caught by the 2026-08-30 audit, see `CONVERSATION.md`). |
| #38 "entrust to Yazdi, fully trusted" | `c03 == "equal"` | With `c03 == "mentor"`, entrusting is still possible but the ending logic treats the transmission as less complete (Yazdi received the letter of the work, not its full context) |
| #12 "lettrist framing for the Qur'an" | `c07 == "full"` | You can't offer a doctrine you chose to keep hidden from patrons in choice #7 |

### Skill gates (v4, PROPOSAL.md Workstream A)

`optionAvailable()` also honors `skill_gate: {science: min}` — the mechanism that
makes WHICH science a player built unlock different options. One signature moment
per science (all additive; no pre-v4 path was removed or tightened):

| Choice | Option | Gate |
|---|---|---|
| #20 | Seal the Ṭahawī Circle as a working talisman | `limiya >= 3` |
| #24 | Counter-offer alchemical patronage | `kimiya >= 3` |
| #29 | Expose the craft behind the accusation | `rimiya >= 2` |
| #31 | Enter the tribunal warded | `himiya >= 3` |
| #35 | Leave by misdirection | `simiya >= 3` |

(The PROPOSAL originally placed the rīmiyā moment at #15; implementation caught
that every rīmiyā point source comes after #15, making that gate unreachable —
moved to #29.) `epilogueFor()` additionally appends one dominant-science legacy
sentence to every run, and reads the `talisman`/`alchemical`/`veiled` flag values.

### Expressive choices (declared, v4)

After the v4 echo pass, exactly three flags are read by nothing downstream — 
**deliberately**: `c06` (accept patronage at all), `c12` (work on the Bāysunghur
Qur'an), `c28` (occult reasoning on the bench). These are the player stating who
they are; the game witnesses rather than scores them. (`c12` and `c28` are also
gate *targets* — their meaning lives upstream in `c07`/`c19`.) Five more flags —
`c11`, `c14`, `c16`, `c18`, `c30` — are unread as flags but feed the skill system,
which v4's gates and epilogue read constantly. Any future audit should check new
dead flags against this list before calling them bugs.

More gates can be added as `choices.json` is authored further — this table is the
starting set, not exhaustive.

## Endings

Computed once, at the end, from final state — not authored as 40 separate literal
endings. A small decision tree over `(c34, dominant_science, breadth_vs_depth,
c38, c33+c04, c39, c40)` produces a handful of named, distinct endings. Sketch
(not final prose):

1. **The Vindicated Martyr** — `c34=hold`, work transmitted (`c38` succeeds), high
   single-science depth, `c39=defiant`. Closest to the real historical shape
   (three inquisitions, exile, death 1432) but explicitly *one ending among several*,
   not the privileged "true" path.
2. **The Lost Legacy** — `c34=hold`, but `c38` fails or `c03=mentor` (weak
   transmission) — the philosophy dies with him, unrecorded.
3. **The New Brethren Endures** — `c34=hold`, `c22=wide` (taught broadly) — the
   ideas survive through a dispersed circle even without a single clean heir.
3b. **Source Code of Empire** (added 2026-08-30, see `ENDINGS_AUDIT.md`) —
   `c34=hold`, `c22=wide` AND `c23=yes` (also wrote popularizations) — checked
   before #3 since it's the stricter combination. Not just "students carry
   pieces forward": per `research/notes/03-the-occult-court.md`, the
   lettrist-astrological platform Ibn Turka's circle founded became the default
   imperial cosmology across Timurid, Aqquyunlu, Safavid, Uzbek, Ottoman, and
   Mughal courts for centuries — regardless of his own personal fate. This
   ending plays that irony straight: the platform wins either way in the real
   world, but breadth-of-teaching + writing in forms that could travel is what
   the player's choices actually control.
4. **The Quiet Compromise** — `c34=bend` — survives, diminished, the system
   publicly renounced in whole or part; downstream texture depends on
   `c39`/`c40`.
5. **The Rehabilitated Judge** — `c34=bend`, high `c27=weak`-party-defense
   reputation carried through, **and `c26=accepted`** (v4 fix: you cannot survive
   "specifically as a judge" if you declined the judgeship — previously
   unchecked) — survives specifically *as* a judge, occult ambitions curtailed
   but legal legacy intact.
6. **The Solitary Sage** — `c36=retreat`, low breadth (single-science depth, small
   circle `c22=small`) — survives exile as a private scholar, influence minimal in
   his lifetime, rediscovered later (or not — open).
7. **The Court Philosopher** — `c34` never triggers as written because earlier
   choices (`c9=cautious`, `c15=delayed`, `c21=elite`-but-quiet) kept him below
   rival notice long enough that the third inquisition's stakes look different —
   a genuine "avoided the fate" branch, the most different from the documented
   history.

Full ending-selection logic (exact thresholds) is implementation work for the
engine, not finalized here — this is the design sketch the engine gets built from.

## What's NOT in scope per the mechanics decision

- No separate inventory UI/system — manuscripts/objects mentioned in CHOICES.md
  (e.g. the autograph manuscript in #38) are represented as flags, not diegetic
  items.
- No separate relationship-meter UI — bonds (Yazdi, Qasim-i Anvar, patrons) are
  flags read by gates and endings, not a visible meter the player watches climb.
- Both could be added later without restructuring the flag model underneath them
  (a meter is just a flag with more states) if playtesting shows the invisible
  version doesn't read as consequential enough.
