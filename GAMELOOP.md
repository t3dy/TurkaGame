# GAMELOOP.md — A Narrative Designer's Notes on the Play Loop

Prepared as a companion to [CHOICES.md](games/visual-novel/CHOICES.md), this time
looking not at *what* the 40 choices are but at *how playing them actually feels* —
the loop a player sits inside from the title screen to an ending, and why it's built
the way it is. Written after playing the prototype through several times.

## The loop, beat by beat

```
TITLE  →  ACT INTRO  →  CHOICE  →  CONSEQUENCE  →  (loop: next CHOICE, or next ACT INTRO)  →  ENDING
```

Five screen types, each doing one job:

- **Title** — sets tone before any mechanics load. Tagline, one paragraph of premise,
  a single button. If a save exists, a second button offers to resume instead of
  restart. This is the only screen a returning player sees twice in the same way —
  everything after it is shaped by what they choose.
- **Act intro** — a full-screen pause between acts, atmospheric prose only, no
  choice, no skill panel. Its job is pacing: after five choices in a row, the game
  needs a beat that isn't asking anything of the player, or the 40-choice structure
  starts to feel like a form to fill out rather than a life to live.
- **Choice** — the workhorse screen: backdrop image, act badge, a grounding badge
  (ATTESTED / PLAUSIBLE-GAP / INVENTED-COMPATIBLE), scene text, options, and a
  persistent skill panel + progress counter below the fold. The grounding badge is a
  small thing that does real work — it's the game telling the player, continuously,
  which parts of this life it's confident about and which parts it's honestly
  guessing at.
- **Consequence** — a single line of reaction to what was just chosen, alone on the
  screen, before anything else happens. This is the most important screen in the
  loop and the easiest one to have skipped. Without it, picking an option and
  immediately seeing the *next* choice makes every decision feel weightless — click,
  click, click, no different from a settings menu. With it, every choice gets a
  moment of "and here is what that meant" before the story moves on.
- **Ending** — title, a paragraph of resolution, the final skill panel, and a full
  act-by-act journal of all 40 choices made. The journal matters more than it looks
  like it should: it's the only place in the whole playthrough where a player sees
  their entire run at once, and it's what makes "no two stories are the same" a
  claim the player can actually verify against their own history, not just a
  tagline.

## Why the pacing is shaped this way

A pure choice-choice-choice loop (no act intros, no consequences) would move faster
but would flatten 40 genuinely different decisions into one long list. The act
intros exist to make the eight acts of CHOICES.md feel like eight different *rooms*
of a life rather than five arbitrary buckets of five choices each. The consequence
screen exists so that gates — the mechanism that makes "fully divergent" real rather
than cosmetic — have somewhere to announce themselves before they're felt three acts
later as a missing option.

That deferred payoff is the loop's actual thesis: **most of what a choice costs or
buys doesn't show up at the moment you make it.** Choice #4 (bond with Qāsim-i Anvār)
pays off — or doesn't — at choice #33, five acts and dozens of decisions later.
Choice #10 (loyalty through political risk) pays off at choice #31. The consequence
screen tells you what happened *now*; the gate tells you what an old choice still
means *later*. Between them, the loop is trying to make "consequence" mean something
closer to its real-life sense — delayed, sometimes invisible until the moment it
isn't — rather than the instant-feedback sense most choice-based games settle for.

## What a full playthrough actually feels like right now

Roughly 8–12 minutes end to end at a normal reading pace: eight ~90-second acts,
each five choices plus one consequence beat apiece, framed by two ~30-second act
transitions on either side. Short enough to replay in one sitting, which matters,
because the entire point of "fully divergent, multiple endings" is inviting a second
and third playthrough — a 45-minute VN nobody replays disproves its own premise.

The skill panel is always visible but never demands attention — it's peripheral
information, there for a player who wants to track their build, invisible to one who
just wants to read. That's deliberate: the mechanics decision was "skill tree only,
no separate inventory or relationship-meter UI," and the interface honors that by
keeping the one visible system quiet rather than gamifying the reading experience.

## Where the loop is thinner than the design deserves

- **The consequence beat is one line.** It confirms what happened; it rarely makes
  the player feel it. A stronger version would occasionally escalate — most
  consequences are a sentence, but a handful of the highest-stakes choices (bending
  the knee, entrusting the manuscripts, the final testament) could earn a slightly
  longer, more composed beat without breaking the loop's rhythm.
- **Gates are silent until they're hit.** A player who defected early at choice #10
  gets no signal at the time that this will matter later — the game doesn't
  foreshadow its own state machine. That's arguably correct (foreshadowing every
  gate would turn the story into a walkthrough of itself), but it means the "closed
  door" note at choice #31 is the first and only moment the player learns the
  mechanic exists at all. Worth watching in playtesting whether that's a delightful
  surprise or a confusing one.
- **One backdrop per act, not per choice**, means the visual rhythm resets only
  eight times across forty choices — the image at choice #6 and the image at choice
  #10 are identical even though the scenes are unrelated. This is a known,
  explicitly scoped gap (see NEXTSTEPS.md), not an oversight.
- **The ending screen's journal is data, not drama.** It's honest and complete, but
  it reads like a receipt. A version that grouped choices by *theme* (loyalty spent,
  secrets kept, sciences studied) rather than strictly by act might tell the "story
  of the story" more legibly than a chronological list does.
