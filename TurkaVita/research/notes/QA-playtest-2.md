# TURKAVITA playtest, pass 2 (verification of fixes)

Date: 2026-09-28. Build served at http://localhost:7560/ (`turkavita` launch config, port 7560,
serving `TurkaVita/game`). Desktop pane (1024 wide) plus a 375x812 mobile emulation for the
mobile-specific checks. Read `research/notes/QA-playtest.md` (pass 1) first and reproduced its
repro steps exactly where possible.

Interaction method: real per-scene controls only — mouse clicks on buttons/refs, and the
documented keyboard path (number key to pick an option, Enter to advance/confirm), exactly as
"How to play" describes. `window.__game` was read-only (`.scene`, `.state`, `.trail`) to confirm
state after an action (e.g. "did the save change", "did a keypress behind a modal register a
choice") — never used to jump scenes or skip content. One full 36-scene playthrough was
completed this way, start to finish, to the ending screen.

## What I did

- Verified all 3 blockers and both flagged confirm dialogs (Start over AND Begin anew) with the
  save's actual `localStorage['turkavita.save.v1']` contents read before/after each action.
- Full playthrough, scene 1 to scene 36, by number-key + Enter (and some mouse clicks), mixing
  documented and counterfactual/reconstructed picks across every act, same spirit as pass 1's
  second run (deliberately picked off-record options in scenes 1, 2, 3, 4, 5, 13, 14, 21, 23, 25
  to stress-test agency). Both composer scenes played fully to Send (15, 19, 27); the sorter (30)
  played seriously with the keyboard-move-to-top technique, submitted with 3 of 105 pairs wrong
  (same metric pass 1 got, coincidentally); Act VI: read all three piles, took the
  Melvin-Koushki lens, committed to D (its top answer under that lens) and got "coherent" —
  then separately reasoned through what "false certainty" would require, to confirm the
  calibration check still discriminates (pass 1's report shows it does; not re-broken).
- A second browser tab, sharing the same origin, used only for: (a) the title-screen plate +
  Provenance toggle, (b) a fresh run's scene 1 skimmed at 375px mobile width, and (c) reaching
  scene 11's rulings at 375px to measure button height. Viewport reset to desktop and tab closed
  afterward.
- Court board opened after a deep scroll on a text-heavy scene (scene 4, page height ~1960px,
  scrolled to ~1900px) as well as from the top, and with the ruling/decision UI live underneath.
- Pressed a number key ("1") while the Court board was open and read `window.__game.trail`
  immediately after, to check nothing registered behind the panel.
- `read_console_messages` checked repeatedly through the run (after the composer sends, after
  the sorter, after the dossier, at the end): zero log lines, zero errors, the whole session.
- Effort: about 230 tool calls.

## Verified fixed (the 12 original issues)

**B1. "How to play" on the title screen silently destroys the save — FIXED.**
Repro from pass 1: loaded the title screen with an existing save at Act III, scene 21
(`SCN-0309`, read directly from `localStorage`), clicked "How to play". It now opens as a
`role="dialog"` overlay *on top of* the title screen (confirmed via `getBoundingClientRect()`),
not a navigation. Read `localStorage['turkavita.save.v1']` again after closing the panel:
`sceneId` was still `SCN-0309`, unchanged. Repeated once more for certainty. Fixed.

**B2. "Start over" / "Begin anew" wipe a run with no confirmation — FIXED for both buttons.**
Clicking "Start over" now opens "Erase this run?" — "This erases your run at Act III · The
trials, scene 21 of 36. It cannot be undone. You can download your record first." with three
buttons: Keep playing / Download your record first / Erase it. Clicked "Keep playing" and
confirmed the save was untouched. Separately tested "Begin anew" on a *finished* run: same
dialog, worded "This erases your run, which is finished. It cannot be undone. You can download
your record first." Both entry points are covered, not just the one pass 1 tested.

**B3. How to play contradicts the title about saving — FIXED.**
"How to play" now reads: `"Start over" in the top bar, after you confirm, erases your saved run
and returns to the title. Your run saves itself in this browser after every step, so you can
close the tab and press "Continue" on the title screen later.` This matches the title screen's
claim exactly; the old sentence claiming "there is no saving" is gone.

**M1. Court board looks broken when scrolled down — FIXED.**
Reproduced pass 1's setup on a page scrolled to ~1900px (out of ~1960px total): clicked the
(now-fixed-position) "Court board" button, and the dialog rendered inside the viewport
(`top: 54px`, `bottom: 447px` — both well within the 768px-tall pane) every time, including from
a genuinely deep scroll. Esc closed it and returned focus/scroll to a sane state. Fixed.

**M2. Developer ids leak into player-facing copy — FIXED.**
Read every scene's full text, every Why? drawer opened during the run (scenes 1, 2, 3, 9, 11, 12,
16, 20, 21, 36 and both composers), every plate caption, and the sorter's rubric and result
table. Not one `(CL-\d+...)` fragment or bare "MK" turned up anywhere; citations are written out
as "Melvin-Koushki, dissertation (2012), p. NNN" in the Why? panels, and inline text always
spells "Melvin-Koushki" in full. The scene 11 Why? note that pass 1 quoted as jarring
("⚠ Ibn Turka, Nafsat al-Maṣdūr II... as MK cites it") now reads as a normal evidence line with
no shorthand. Fixed.

**M3. Untranslated vocabulary / fixed-facts overload — MOSTLY FIXED, one sub-issue still open.**
(a) Glossary: confirmed working on `lettrist`, `Ḥurūfī`, `qadi`, `hadith`, `Sharīʿa`, `abjad`,
`Yasa` and more — each is a dotted-underline term; hovering "lettrist" showed a tooltip reading
"a practitioner or theorist of the science of letters (lettrism)". Present across acts I-III, not
a one-off. Fixed.
(c) The Sunni/Shiʿi fault line in scene 18 (the "praising ʿAlī" charge) is now explained in-line:
"even the staunchly Sunni Naqshbandiyya allowed praise of ʿAlī and the Imams (tawalliʾ) but not
hateful condemnation of the first three caliphs... which was called Rāfiḍism (tabarruʾ)". Fixed.
(b) **Still present**: manuscript-dating scruples are still inside the "What the sources
establish" fixed box in places, not moved to the Why? drawer as suggested. Example, scene 9,
verbatim in the fixed box: "The colophon on MS Majlis 10196 f. 330a says your commentary on Ibn
ʿArabī's Fuṣūṣ al-Ḥikam was finished on 20 Ṣafar 814 (13 June 1411) and corrected in Fars on
19 Dhū l-Ḥijja 817 (1 March 1415)." This is exactly the kind of clause pass 1 asked to relocate,
and it wasn't. Minor compared to (a)/(c), but the fix is incomplete.

**M4. The same facts are stated three times per scene — FIXED for the cases pass 1 quoted.**
Act I's opening is now split across two screens: the Act card states the Isfahan/qadi facts once,
and the first real scene (Samarkand) opens differently, so the "fallen... fallen... fallen" triple
pass 1 hit no longer lands on one screen. Scenes 21→22 (Aḥmad-i Lur's attack on Shāhrukh) no
longer re-narrate the attack twice: the Act IV card now opens from the consequence ("The post,
the property and the standing are gone...") and scene 22 itself opens "You had left Herat with
your second defence won... You were called back, imprisoned and stripped of post and property,"
which is materially different from scene 21's telling, not a near-duplicate. Fixed for both
examples pass 1 cited; I did not re-check every scene pair in the game.

**M5. Choices are not real trade-offs — FIXED, and this is the biggest single improvement.**
Tested across roughly 20 decision scenes in Acts I-IV. Every documented option now carries a real
cost, not just the counterfactuals (example, scene 3: the documented "divide your years" option
costs `exposure +1`; the "safer" counterfactual gives `livelihood +1` with no exposure cost).
Several scenes (4, 13, 14, 21, 22) have three options of comparable length and specificity rather
than one long "real" option and two short "fake" ones. Most importantly, the old "the game
returns you to the record" reveal — which read as "you refuse, and go anyway" — now explicitly
banks the ledger: scene 21's counterfactual pick resolves with "The game returns you to the
record: the exile comes anyway. **What you gained and paid here stays in your ledger**; the
story then rejoins the record." This is exactly pass 1's suggested fix (a). Genuinely changes how
a counterfactual pick feels — see the dedicated section below.

**M6. Rulings are a quiz placed before the decision, no explanation — FIXED.**
Every ruling group I hit (scenes 11, 12, 16, 20, 36) now opens with an explicit header before the
questions: "Before you decide: N true-or-false checks (answered X of N) / Each puts one statement
about what he wrote to you. Say whether the sources bear it out. A wrong answer only costs a
little on the Doctrine bar, and the answer teaches you the text." — this is close to verbatim the
suggested fix. The italic decision prompt now appears *after* the rulings, not before them (scene
11: "Shāhrukh's summons has reached you. Do you withdraw..." appears only once all three rulings
are answered). Ruling count is capped at 3 in the ordinary scenes; scene 20 (the meta scene) was
cut from five statements to three. Fixed.

**M7. The collection sorter is a chore with thin feedback — MOSTLY FIXED.**
The core complaint (you can't see which pairs you got wrong) is solved: after "Use this order"
the result is now a full two-column table, "your order" vs "the manuscript's order," with a ✓ on
every row you got right and the mismatched rows sitting side by side so the wrong pairs are
immediately visible — not hidden behind Why?. This is exactly the fix pass 1 asked for (d) and it
is a large improvement. The instructions paragraph is also much shorter than pass 1's 150-word
quote. Two sub-points from pass 1 are unaddressed: the list still starts fully shuffled (not
date-ordered, so the puzzle is still "sort 15 rows" rather than the proposed "find the ones that
don't belong"), and the promised live-preview sentence under the list ("As you have it, the
volume opens with X and closes with Y") is gone entirely rather than fixed — How to play's own
text was rewritten to no longer claim it exists ("nothing is scored until you press 'Use this
order,' and afterwards the game shows your order beside the manuscript's"), so the false-promise
contradiction pass 1 flagged is resolved by removing the claim, not by adding the feature.
Arrow-key-repeat-on-a-focused-row still works exactly as pass 1 praised.

**M8. The Act VI dossier is opaque until late; the composer lets you send incoherent picks —
PARTIALLY FIXED: the dossier UI is fixed, one composer bug from pass 1 is still live.**
Dossier: scene 32 now opens with a 3-line explainer almost verbatim to pass 1's suggestion:
"Dossier / Empty. As you read witnesses you collect readings: each is one short verdict that
argues for, or against, one of six candidate answers to 'who was he?' (A to F). The table below
will count the readings for and against each answer, and their net." Column headers ("candidate
answer / readings for / against / net") are now present on every dossier table (scenes 33-36),
row order is fixed A-F throughout (no more reordering that reads as a bug). The lens scene (35)
now states outright "Under a lens, only that scholar's readings count: the lens changes whose
readings are counted, not the evidence" — and taking the Melvin-Koushki lens correctly put D
(occult philosopher) clearly on top (+5 net) with no C/D confusion, unlike pass 1's repro. The
commit screen (36) now labels every option A-F and gives each a "Who holds this, and what it
commits you to" expandable, which on opening shows the position's statement, who holds it, and
"the price of holding it" (what the pro-D readings can't actually carry) — this is exactly pass
1's suggested Why?-plus-cost addition, and it's well written. Committing to D under the
Melvin-Koushki lens correctly scored "coherent."
Composer m8(a) (no visible running total before Send) — FIXED: every composer scene (15, 19, 27)
now shows "If you send this: <net effects>" before the Send button is enabled.
Composer m8(b) (dependent slots not greyed out) — **STILL BROKEN**. Repro at scene 15 (the
R. Suʾl al-Mulūk letter): selected "No: keep politics out, as Melvin-Koushki finds you did..."
for "Does the book say anything about kings and their states?" The two downstream slots, "What
does the prediction rest on?" and "What makes it lawful to read a fate from a name?", stayed
fully enabled and were still required before Send lit up. Sent with all four slots filled; the
reveal for "What does the prediction rest on?" printed "This is the closing computation as
Melvin-Koushki translates it" immediately under a slot that had just said the book contains no
such computation — the exact incoherent-letter bug pass 1 reported, reproduced verbatim.

**M9. Mobile layout: option text squeezed by the badge — FIXED.**
At 375x812: the DOCUMENTED/COUNTERFACTUAL/RECONSTRUCTED badge now sits in its own row above the
option text (confirmed by screenshot, scene 1), not squeezed into a ~110px column beside it. The
header nav ("How to play / Court board / Start over") fits on one line under the title, no longer
wrapping and pushing "Start over" into a second row. Measured the ruling buttons ("Let it stand" /
"Refute it") directly via `getBoundingClientRect()` at scene 11 on mobile: both are exactly
**44px tall**, meeting the touch-target minimum pass 1 asked for. Fixed.

## New issues

No new BLOCKER or MAJOR issues surfaced. Everything below is MINOR, and most are pass-1 items
that are only *partly* addressed rather than freshly introduced — listed here rather than above
because the original issue's headline complaint is fixed but a named sub-part isn't.

**MINOR. Composer dependent-slot bug is still exploitable (restates M8's still-broken half).**
Scene id: SCN-0215 (the R. Suʾl al-Mulūk composer, act III, played-numbering scene 15). Repro
above. Suggested fix unchanged from pass 1: grey out "What does the prediction rest on?" and
"What makes it lawful..." (or hide them) whenever "No: keep politics out" is the current pick for
the kings-and-states slot, the way "Closed to you" options already grey out elsewhere in the game.

**MINOR. "mafiosos (Melvin-Koushki's rendering)" is still in scene 19's copy**, unchanged from
pass 1's m9 note. It's a genuinely jarring anachronism inside an otherwise careful register
("Abuse them: mafiosos (Melvin-Koushki's rendering), backbiters, men of little learning..."). Not
new, but confirmed still present. Suggested fix: swap for "gangsters" or drop the aside, since the
Why? drawer already carries the citation.

**MINOR. M3(b) fixed-box date clutter, still present** — see above; scene 9 is the clean repro.

**MINOR. Sorter's shuffled start / no live-preview sentence** — see M7 above; not a regression,
just an unfinished sub-fix.

No console errors were logged at any point in the run (checked after every major interaction:
composers, sorter, dossier, ending) — pass 1 already found this clean and it's still clean.
No new layout breakage was found on the plates, the "More on the sources" toggle (tested at
scene 2, expands/collapses correctly), the title screen's own plate + Provenance toggle (tested:
default caption is two sentences, "Provenance" expands to the full institution/credit/licence
line and collapses again), the margin table at the ending, or the "See your ending" title-screen
label for a finished run (now reads "See your ending (36 scenes played)", fixing pass 1's m10).

## Does the "agency" pass actually change how choices feel?

Yes, materially. In pass 1 the diagnosis was: the documented option is identifiable by its odd
specific detail, the alternatives are visibly worse, and picking one anyway gets undone by
"the game returns you to the record" — so choices read as informative, not as agency. This pass,
across roughly 20 scenes in Acts I-IV:
- Every option, documented or not, now has a specific cost/benefit line, and several scenes (3,
  4, 13, 14, 18, 21, 22, 23) give the "safer" or "off-record" option a real upside (usually lower
  exposure or higher livelihood/students) rather than a flat penalty.
- The "returns you to the record" scenes now explicitly say your gains/costs "stay in your
  ledger" even though the story rejoins the fixed point — so a counterfactual pick is no longer
  narrative-only, it is a real, persistent trade against the four bars, which is the mechanical
  difference pass 1 asked for.
- Locked options with a stated reason (pass 1's favourite feature) are still present and still
  causally connected to earlier picks — confirmed again in this run's scene 9→11 chain and 13→14
  chain (declining to write to Fīrūzshāh at scene 10 correctly locked the Fīrūzshāh-backed option
  at scene 11 in this run too, mirroring pass 1's finding).
The residual limit, not fixed and not really fixable without changing the premise, is that the
correct-per-Melvin-Koushki option is still usually the fullest, most specific sentence in a
three-option list (pass 1's M5(b)) in scenes where all detail comes from one source; this pass
found that gap narrower than before (options are closer in length now) but not closed.

## Updated scores (1-10, compare to pass 1)

| dimension | pass 1 | pass 2 | why it moved |
|---|---|---|---|
| Clarity | 5 | 8 | Glossary tooltips, rulings explained before being asked, dossier's 3-line explainer + column headers + explicit lens rule, no more save/erase contradictions. The one clarity debt left is M3(b)'s date clutter in a few fixed boxes. |
| Engagement | 6 | 8 | Real trade-offs in Acts I-IV (see above), a dossier that resolves cleanly instead of reading as buggy, the sorter's comparison table turning a chore into a legible result. Acts I-II and the composers remain the strongest writing. |
| Replayability | 5 | 7 | Counterfactual picks now bank real ledger consequences even at fixed points, so a second run genuinely diverges on the four bars, not just on which paragraph you read. Six lenses and six commit answers in Act VI, each with its own "price of holding it" text, give a real reason to replay just Act VI. |
| Polish | 5 | 8 | Save-wiping bug, invisible Court board, leaked developer ids, and the mobile squeeze are all gone, with confirm dialogs, 44px touch targets and zero console errors throughout a full run. Docked from 9 for the one live composer bug (M8b) and the M3(b)/M7(b) sub-fixes left undone. |

## Verdict

This build is meaningfully better than the first pass, not just cosmetically. All three blockers
are gone and verified against the exact repro steps (save read from `localStorage` before and
after, not just "looked fine"); of the nine MAJOR issues, seven are fully fixed and two (M3, M7)
have their headline complaint fixed with one clearly-scoped sub-part still open. The agency
rewrite is the standout change: it is the difference between "the game tells you what happened"
and "the game charges you for what you chose," which was pass 1's central complaint about Acts
I-IV. The one thing I'd fix before calling this done is the composer's dependent-slot bug
(M8b/scene 15 and likely scene 27 by the same mechanism) — it is the only place left where the
interface lets a player send a self-contradicting piece of writing and then narrates the
contradiction back at them as if it were coherent, which is a small blocker-flavoured bug sitting
inside an otherwise-fixed system. Everything else here is the polish pass 1 asked for, done.
