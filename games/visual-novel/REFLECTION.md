# REFLECTION.md — Does It Work? Narrative Designer × Systems Designer, on the Simulation Data

A second recorded session (2026-08-30), after building `tools/sim.mjs` and running
12 targeted playthroughs plus 3,000 seeded random ones against the shipped v4
modules. Full numbers in [logs/ANALYSIS.md](logs/ANALYSIS.md); transcripts in
[logs/](logs/). Three questions: is it **fun and challenging**, is it
**satisfying**, and does it **realize Melvin-Koushki's scholarly values**?

Every number below is measured, not estimated.

---

## 1. Fun and challenge

**SYSTEMS DESIGNER:** The headline is good. All eight endings are reachable by
deliberate play — 8/8 targeted policies hit their target — and all eight also
occur under random play, so nothing is stranded behind knowledge a first-time
player couldn't have. In 3,012 simulated runs there was never a dead end: every
choice always offered at least one available option. The gates narrow without
ever trapping.

And the difficulty curve is real, not decorative. Under random play:

| Ending | Share |
|---|---|
| The Quiet Compromise | 33.2% |
| The Lost Legacy | 21.9% |
| The Vindicated Martyr | 11.0% |
| The Rehabilitated Judge | 10.5% |
| The Solitary Sage | 6.5% |
| The Court Philosopher | 6.5% |
| The New Brethren Endures | 5.7% |
| Source Code of Empire | 4.7% |

**55% of careless play lands in the two diminished outcomes.** You have to
actually mean it to get anything better. That's a genuine challenge gradient.

**NARRATIVE DESIGNER:** I want to complicate "challenge" before we celebrate it,
because the distribution is measuring the wrong thing for my purposes. The
player who gets Quiet Compromise didn't *fail a test*. They bent at the third
inquisition, which is a legitimate, well-written human choice. The game doesn't
tell them they lost — it tells them "It is not the ending the histories record.
It is an ending."

So: is a 33% Quiet Compromise rate *challenge*, or is it just the honest
distribution of a life where most paths end in compromise? I'd argue the latter,
and I'd argue that's a feature. But it means we should stop describing it as
difficulty and start describing it as **moral gravity**. Those are different
promises to a player.

**SD:** Fair. Then let me point at something that *is* a difficulty problem.
Skill-gated options — the whole v4 headline, the thing that makes specialization
matter — are offered rarely:

| Gate | Offered under random play |
|---|---|
| c29 expose (rīmiyā 2) | 58.0% |
| c24 alchemical (kīmiyā 3) | 31.2% |
| c35 veiled (sīmiyā 3) | 21.0% |
| c20 talisman (līmiyā 3) | 18.7% |
| c31 warded (hīmiyā 3) | 18.7% |

A typical run surfaces one, maybe two signature moments out of five. From inside
a single playthrough that reads less like "my specialization opened a door" and
more like "occasionally a greyed-out line appears."

**ND:** Though we *do* show the locked ones, with the requirement spelled out —
"Enter the tribunal warded (requires Hīmiyā 3)." That's not nothing; it's the
game telling you what another life would have contained. I actually think that's
the strongest replay hook we have, and the sim confirms it fires: the lockout
transcript shows a player meeting four skill-locked options and two flag-locked
ones across a single run.

**SD:** Agreed on the hook. But now the finding I think is a genuine design bug,
and it's in the fiction, not the code. Can a *generalist* — someone who didn't
pick that science at c16 — ever reach each gate?

| Gate | Max without picking it as primary | Generalist-reachable? |
|---|---|---|
| c24 kīmiyā ≥ 3 | 3 | **yes** |
| c29 rīmiyā ≥ 2 | 3 | **yes** |
| c35 sīmiyā ≥ 3 | 2 | no |
| c20 līmiyā ≥ 3 | 1 | no |
| c31 hīmiyā ≥ 3 | 1 | no |

**Kīmiyā — the science our own sources call the most elite, most expensive, most
technically demanding of the five — has the most accessible gate in the game.** A
dabbler who never commits to alchemy can still counter-offer alchemical
patronage. Meanwhile hīmiyā and līmiyā, which sit *below* it in the historical
hierarchy, demand total commitment. We inverted the pentad we're supposedly
teaching.

**ND:** That's real and we should fix it. The fix isn't to nerf kīmiyā's gate —
it's that kīmiyā has too many incidental point sources scattered around (c11
astronomy, c14 formal, c18 math_first all feed it). Alchemy should be the science
you can only have by *choosing* it. That's what "most elite" means mechanically.

---

## 2. Player satisfaction

**ND:** The closure machinery works. Every run ends with a named ending, a
personalized epilogue, and a themed journal of all forty choices. The sim shows
the epilogue genuinely varies — the survivability clause, the Qāsim-i Anvār
clause, the science-legacy sentence, the c17/c25 clauses all fire selectively.

But here's my worry, and the data sharpens it. **Divergence between two arbitrary
runs averages 28.7 observable differences** — which sounds excellent until you
decompose it. Only **8 of 40 scenes** ever render more than one variant. So of
those ~28.7 differences, roughly 20 are just *"you clicked a different button"*
and at most 8 are *"the game said something different back."*

That's the honest shape of it: the game **remembers** far more than it
**responds**. Thirty-two of forty scenes read identically no matter who you've
been.

**SD:** And the per-act breakdown shows where:

| Act | Reactive scenes |
|---|---|
| I | 0 |
| II | 0 |
| III | 1 |
| IV | 0 |
| V | 2 |
| VI | 1 |
| VII | 3 |
| VIII | 1 |

Acts I, II, and IV have zero. We wrote a Workstream D budget saying "every act ≥
1 reactive scene" and we're failing it in three acts.

**ND:** Two of those three are defensible and one isn't, and I want to be precise
about which. **Act I literally cannot be reactive** — there's no prior state to
read. That budget line was mis-specified by me, and the fix is to correct the
rule, not the content. **Act II** is the "Teach" segment: you're establishing who
you are, and the game reflecting you back before you've become anyone would be
premature. Also arguably fine.

**Act IV is the real miss.** That's the sciences act — c16 through c20, the
single most identity-defining stretch in the game — and not one of those five
scenes reads differently based on anything you've done. You arrive at "choose
your life's science" and the game addresses you exactly as it would address
anyone. That's the wrong place to be generic.

**SD:** Concretely: c16's scene should read differently if you studied under
Akhlātī openly (c02) versus deniably, and c19 (publishing the sensory theory)
should know whether you flaunted or stayed cautious at c09. Both flags are
already set and sitting unused at that point.

**ND:** One more satisfaction finding, and it's the one that bothers me most.
**Source Code of Empire is the rarest ending at 4.7%** — and it is the ending
that states the game's own thesis. The one where the platform outlives the man
and becomes the political science of empires he'll never see. Fewer than one
player in twenty will encounter our best argument.

**SD:** It requires c34=hold AND c22=wide AND c23=yes — three specific choices
across three acts. That's a deliberate-play ending by construction.

**ND:** I'm not saying make it common. I'm saying the *other* endings should
gesture at it. Right now if you get Quiet Compromise you have no idea the
platform survived at all. The thesis should be ambient, not locked behind the
rarest branch.

---

## 3. Does it realize Melvin-Koushki's scholarly values?

**ND:** Let me take his positions one at a time and mark them honestly.

**✅ Occult science as political technology, not superstition.** This is his
central move and the game now enacts it rather than asserting it. The prologue
states it outright — *"empires run on the occult sciences the way they run on
treasuries."* And v4's skill gates make it *operationally* true: hīmiyā gets you
through a tribunal, sīmiyā gets you out of a city, kīmiyā gets you paid without
losing status. A science that does nothing is decoration; a science that changes
what you can do in a political crisis is technology. That's his thesis, playable.

**✅ Attestation discipline.** Every choice carries an ATTESTED /
PLAUSIBLE-GAP / INVENTED-COMPATIBLE badge with a tooltip. I don't know another
game that shows its epistemic seams this way, and it's a direct expression of his
methodological care. The simulation logs preserve these badges, so a reader can
audit what the game claimed to know.

**⚠️ The mathematical character of lettrism — weak, and this is the big one.**
His argument is that *Investigations* is "the most philosophically systematic
formulation of lettrism ever written" — that this was rigorous, technical,
Pythagorean *mathematics*, which is precisely why it belongs in the history of
science. Our game never makes the player do, see, or reason about any of it. The
Ṭahawī Circle is named, and in one gated branch you seal it as a talisman — but
the player never encounters its *structure*. Lettrism in our game is a career
path with a number attached. **We assert his central claim and never demonstrate
it.**

**SD:** That's the honest verdict, and I'd add the mechanical version: our five
sciences are functionally identical systems with different labels. They differ in
which gate they open, not in how they *work*. A player learns that kīmiyā is
prestigious and rīmiyā is accessible; they learn nothing about what either
actually involves.

**❌ The comparative, anti-Eurocentric frame — absent from the game entirely.**
His most polemical position is that Ibn Turka belongs beside Cusa, Pico, Bruno,
and Dee, and that the Islamicate occult-scientific revolution preceded and fed
the European one. That argument is on the website's timeline tab. It is nowhere
in the forty scenes. A player who only plays the game never learns that a claim
is being made at all.

**ND:** I'd push back slightly — the epilogues gesture at posterity ("it took
five centuries longer than you expected"), and c40 now frames *Investigations*'s
neglect. But you're right that we never name the comparison, and per our own
"comparison ≠ contact" rule we can't dramatize it inside the fiction. The place
for it is an end-of-game card *after* the ending: not "Ibn Turka met Bruno," but
"the scholar whose work you just played was buried for five centuries; here is
who he is now argued to belong beside." That respects the rule and delivers the
argument.

**⚠️ "Form is content."** His reading of the *Mafāḥiṣ* prologue is that its
literary form *is* its argument. Our form is a flat eight-act choice tree.
Ibn Turka's own book is structured as Planet–Pearl–Peach: ascent, descent,
ascent. We had a structural metaphor sitting in the research and used a
conventional one instead. Not a failure exactly — but a missed alignment between
what we say about him and how we're built.

**✅ Recovering the historiographically buried.** Source Code of Empire does
this beautifully — it's the thesis dramatized. The problem is the 4.7%.

---

## Verdict

**SD:** Mechanically sound. Eight endings, all reachable, no dead ends in 3,012
runs, a real challenge gradient, and specialization that now demonstrably changes
what you can do. The v4 work delivered what it promised. Three defects worth
fixing: the inverted kīmiyā accessibility, Act IV's total non-reactivity, and the
thesis being locked behind the rarest ending.

**ND:** Narratively honest and, I think, genuinely moving in places — the
transcripts read well end to end, which is the thing I most wanted to check.
Educationally, we deliver his *political* thesis convincingly and his
*scientific* thesis hardly at all. The game teaches that occult science was
powerful. It does not yet teach that it was **rigorous** — and rigor is the whole
reason he thinks it belongs in the history of science.

That's the gap that matters most, and it's not a content gap. It's that we have
no mechanic that feels like *doing* letter-mathematics. Until we do, we're
making a very good game about a man who did something the game never lets you
touch.

---

*Findings queued as concrete work items in [NEXTSTEPS.md](../../NEXTSTEPS.md).
Regenerate all data with `node tools/run-simulations.mjs`.*
