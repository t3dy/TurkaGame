# CONVERSATION.md — Narrative Designer × Systems Programmer

A recorded working session (2026-08-30) on three questions, before any further
building: Is the opening an adequate introduction to the Islamicate occult world
and to Ibn Turka? Should the style template differ across beginning, middle, and
end? And do the systems actually deliver meaningful choices — does investing in
one science over another, or any other player effort, produce real differences
downstream?

Everything cited here was verified against the actual v3 code first, not
remembered. The audit script results are reproduced inline. Conclusions are
formalized in [PROPOSAL.md](PROPOSAL.md).

---

**SYSTEMS PROGRAMMER:** Before we discuss anything aesthetic, I ran the trace.
Every flag a choice sets, cross-referenced against every place a flag is ever
read — gates, dynamic scene text, dynamic consequences, `computeEnding()`,
`epilogueFor()`. Here's the result:

```
gate sources:              c07, c10, c19
dynamic-text reads:        c03, c04, c07, c09, c10
endings/epilogue reads:    c03, c04, c09, c15, c17, c21, c22, c23, c25,
                           c27, c33, c34, c36, c37, c38, c39, c40

DEAD FLAGS — never read downstream by anything: 20 of 40
c01 c02 c05 c06 c08 c11 c12 c13 c14 c16 c18 c20
c24 c26 c28 c29 c30 c31 c32 c35
```

Half the game's choices have no consequence beyond their own consequence-screen
line. And look at what's on that dead list: **c16 — primary specialization. The
skill tree's entry point. The choice our own pitch art calls "Build Your Occult
Quintet."**

**NARRATIVE DESIGNER:** Hold on — c16 grants +3 to a science. That's not dead,
that's the skill system.

**SP:** So I traced the skill system too. Seventeen options grant skill points.
Skills are *read* in exactly two places in the entire codebase: `breadth()` — a
count of how many sciences are above zero, used once, to qualify for one ending
("The Rehabilitated Judge" needs breadth ≥ 2) — and a raw total in c34's dynamic
scene text (sum ≥ 7 changes one paragraph). That's it. `dominantScience()` is
read only to tint the seal color on the ending screen.

Which means: a player who picks kīmiyā at c16 and a player who picks rīmiyā play
**identical games**. Same options everywhere, same gates, same endings reachable,
same text except the seal color. The five sciences differ in their *description*
and nowhere else. The pitch image literally promises "stronger skills unlock new
options, help in crises, and influence endings." Currently, *which* skill you
build does none of those three things.

**ND:** ...that's a real promise-vs-delivery gap, and it's worse than a generic
missing feature because the Occult Quintet is the thing we advertise hardest —
it's the second panel of the pitch art and half the features page. Okay. But let
me push back on the 20-dead-flags number before we treat it as 20 bugs. Not every
choice in a life needs to be mechanically read back to be meaningful. c39 — how
you face death — would be *worse* if it unlocked something. Some choices are
expressive: the player says who they are, the game witnesses it. That's a
legitimate mode.

**SP:** Agreed, and c39 isn't on the dead list anyway — the epilogue reads it.
But go down the actual list and tell me which of these are defensibly
expressive. c02: declare discipleship under Akhlati publicly, or keep it
deniable. Our own scene text says his enemies are "keeping a file." Then three
inquisitions happen and **nobody ever opens the file.** c32: you offer a partial
recantation at the *first* inquisition — and at the *third* inquisition, the
tribunal that supposedly wants you destroyed never mentions it. c26: whether you
even took the Chief Judge post — the historical day job, the thing "Rehabilitated
Judge" is named after — is never checked, including by that ending.

**ND:** The c32 one hurts. A tribunal quoting your own earlier recantation back
at you is the single most obvious dramatic payoff in the whole inquisition arc
and we're sitting on the flag already. Same with c02 — "the file" is Chekhov's
gun and we hung it on the wall ourselves, in our own scene text.

**SP:** And one more, because it's a documentation-integrity problem, not just a
content gap: `STATE_MODEL.md` line 53 states that c34 hold-firm's "survivability
in the ending logic depends on accumulated hīmiyā/līmiyā... and patron-favor
flags from c07, c10, c31." I grepped `endings.js` for `himiya`, `c07`, `c10`,
`c31`: **zero occurrences.** The design doc describes a system that was never
built. Either we build it or we correct the doc — what we can't do is leave a
spec that lies about the shipped behavior, because the next session will design
on top of the lie.

**ND:** Agreed, that's a "fix the doc or fix the code, this week" item either
way. Now let me take my turn with findings, because the writing side has a
mirror-image problem: the systems under-deliver *consequence*, and the opening
under-delivers *premise*.

I read the first ten minutes cold, as a player who's never seen the pitch page.
Here's what the game gives you: a title screen — "judge, philosopher, occultist
— across 40 choices and eight acts." An Act I card: "You have come to Cairo the
way water finds a crack." Then c01. At no point does the game state its own
premise: that in this world, **occult science is court technology** — that
empires run on astrology and letter-science the way they run on tax registers,
which is the single load-bearing fact of the entire setting and the actual
thesis of the scholarship we're built on. It's on the website. It's in
BIOGRAPHY.md. It is nowhere in the game.

**SP:** Isn't it implied by the skill panel?

**ND:** The skill panel makes it *worse*. From choice 1, the player stares at
five transliterated Arabic terms — Kīmiyā, Līmiyā, Hīmiyā, Sīmiyā, Rīmiyā —
with one-word glosses, and the game doesn't explain what this pentad *is* until
c16. That's Act IV. Sixteen choices in. And I verified: the word "lettrist"
appears exactly twice in all forty scenes and is **never defined**. We wrote a
WRITING_GUIDE that demands real period vocabulary — *qāḍī*, *ʿilm al-ḥurūf* —
and correctly bans generic fantasy-speak, but we never wrote the rule's other
half: **a term the player hasn't met yet needs one clause of gloss, once.**
Specificity without pedagogy is just a paywall written in Arabic.

**SP:** So the same uniform style template that fixed the middle of the game is
wrong for the beginning.

**ND:** Exactly — and wrong for the end, differently. One template can't serve
three jobs. The beginning has to *teach* the world while introducing a
protagonist. The middle gets to *assume* the world and complicate it — that's
where the current template is actually correct, which makes sense, because we
wrote it while working on middle-game scenes. And the ending has to *pay off* —
by Act VII, every scene should be reading the player's own record back to them,
and right now Act VII does that in exactly three places (c31/c33/c34) while c32
and c35 read the same for every player alive. The acts already have distinct
dramatic functions; the prose rules should match. Three segment templates:
**Teach / Complicate / Pay off.**

**SP:** That maps cleanly onto the wiring work, too — the echo reads I'd add for
dead flags concentrate naturally in Acts VI–VIII, which is exactly the "pay off"
segment. One pass, two problems.

**ND:** Then the last thing I want on the record is scope discipline, because
this conversation could balloon. What we are *not* proposing: relationship
meters, inventory, a 41st choice, or a fourth full prose rewrite. The mechanics
decisions in DECISIONS.md stand. The finding isn't "the design is wrong" — it's
that the shipped game is a *subset* of the design. STATE_MODEL.md promised
gates-plus-state-reads producing "apparent combinatorial richness"; we built the
richness for the loyalty thread (c03/c04/c10 is genuinely good — three reads
each, and playtests will feel it) and never extended the pattern to knowledge,
power, or the sciences.

**SP:** Agreed on scope. My priority order, for the proposal: first make the
Quintet real — science-gated options, one signature moment per science, because
it's the advertised system and the largest single lie the game currently tells.
Second, the echo pass on the defensible-dead flags — c02 and c32 first, they're
pre-loaded drama. Third, the doc correction on STATE_MODEL. The opening and the
segment templates are yours; I'd just ask that the prologue not become a lore
dump — teach the premise in one screen, gloss terms at first use, and let the
Quintet panel stay mysterious-but-tooltipped until Act IV names it.

**ND:** "One screen, no lore dump" accepted — the premise fits in three
sentences and the game is better if the player *feels* letter-science before
they can define it. Write it up.

---

*Formalized with priorities, scope estimates, and explicit non-goals in
[PROPOSAL.md](PROPOSAL.md).*
