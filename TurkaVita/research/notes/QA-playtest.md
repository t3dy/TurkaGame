# TURKAVITA playtest (first-time player, read-only)

Date: 2026-09-28. Build served at http://localhost:7560/. Desktop pane (1024 wide) plus a 375x812 mobile emulation.
No engine handle was used to choose or skip; `window.__game.scene` was only read.

## What I did

- Full playthrough 1 of scenes 1-12 (Acts I-II), varied choices (mixed documented / reconstructed / counterfactual). **That run was destroyed by issue #1 below** (I clicked "How to play" on the title screen while a save existed at Act III; the save was overwritten with scene 1).
- Full playthrough 2, start to finish, all 36 scenes and all six acts, to the ending: Acts I-II with mostly documented picks, then a mix (I deliberately took counterfactual options in scenes 14, 15 part 2, 18, 21, 22, 27 and 31 to see what the game does with them). Both writing scenes (15, 19, 27 are composers; 27 = Nafsat II) were played and sent; the collection sorter (30) was played seriously and finished with 3 of 105 pairs wrong; Act VI: read all three piles, took the Melvin-Koushki lens, committed to "D" (a claim the dossier margin of 1 could not carry) and got "false certainty".
- Ending: Doctrine +12, Biography +29, Works +17, Calibration +5; 16 of 25 record decisions matched; exposure 11 vs the record's 8.
- Why? drawers opened in scenes 1, 6, 11, 12, 13, 14, 15, 30 (and on individual ruling and composer entries in 12 and 15): eight scenes.
- Court board opened at Act II, Act IV, on mobile, and while scrolled deep in a scene.
- Odd input: double-clicked "Begin this act" (did not double-advance; good), pressed 9 / 0 / a / Esc / Space / Enter with a ruling set unanswered (all ignored; good), refreshed on an act card and mid-ruling (resume restored 1/3 rulings), resumed after finishing (restored the ending), pressed a number key with the Court board open (see #9).
- Mobile: title, act card, a decision, a ruling set, the Court board. Console: no errors logged.
- Screenshots were flaky twice (blank at 0.5 scale right after a Send click); text extraction was reliable.
- Effort: about 400 tool calls, roughly a 3-4 hour sitting for a human at my reading depth (Acts I-II ~40 min, Act III ~75 min, the sorter alone ~15 min of clicking).

## Ranked issues

BLOCKER = cannot continue or misleading. MAJOR = confusing or dull enough that players quit. MINOR = polish.

### BLOCKER

**B1. "How to play" on the title screen silently destroys the save.**
Scene/state: title screen with an existing save. The title offers `Continue: Act III...`, `Begin anew`, `How to play`. Clicking `How to play` drops you into scene 1 of a fresh run with the panel open, and localStorage `turkavita.save.v1` is overwritten with `sceneId: SCN-0101`. Reproduced twice (once by accident, once on purpose). A returning player who only wants to re-read the rules loses their run, with no warning.
Fix: on the title screen, `How to play` should open the panel in place (a modal over the title, or the same panel rendered without starting the game), and must never call the "new game" path. Add a regression test: with a save present, click `How to play`, assert the save is unchanged.

**B2. "Start over" (top bar) and "Begin anew" wipe a run with no confirmation, and Start over sits beside Court board.**
I erased a finished 36-scene run with one click on `Start over` (no confirm). It is a text link in the same row as `How to play` and `Court board`; a mis-tap on mobile (the nav wraps to two lines at 375px, see M9) would lose an hour.
Fix: `Start over` and `Begin anew` open a confirm: "This erases your run at Act III, scene 14 of 36. It cannot be undone. Erase it / Keep playing." Keep the record-download link visible in that dialog.

**B3. How to play contradicts the title about saving.**
Title: "it saves itself in this browser after every step." How to play, "Every control": `"Start over" in the top bar clears everything and returns to the title; there is no saving, so a run is a single sitting.`
A player who believes the second sentence will never close the tab (or will plan a 4-hour block).
Fix: replace with: `"Start over" in the top bar erases your saved run and returns to the title. Your run saves itself in this browser after every step, so you can close the tab and press "Continue" on the title screen later.`

### MAJOR

**M1. The Court board button looks broken when you are scrolled down.**
Scene: any scene, scrolled below the header. Click `Court board`: the button turns to its pressed state but the panel is rendered at the top of the page, off-screen. I clicked it at scroll 2895px and saw nothing happen. It works only when you are already at the top. Same pattern likely for How to play.
Fix: open the board as a fixed overlay (or scroll to it: `panel.scrollIntoView({block:'start'})`) and move focus into it; Escape closes and returns focus.

**M2. Developer text leaks into player-facing copy.**
Internal ids and citation shorthand appear in outcomes, options and Why? drawers:
- "(CL-0061)" in scene 7 outcome ("what he says you kept trying to return to (CL-0061)").
- "(CL-0055)", "(CL-0056)" scene 8; "(CL-0630, a causal reading...)" scene 9; "(CL-0410, directly inferred)" scene 10; "(CL-0456)", "(CL-0059)" scene 11; "(CL-0579)", "(CL-0569)" scene 12; "(CL-0542...)" ; "(CL-0576)" inside the text of option 1 of scene 31.
- Scene 6 Why? drawer: "the arrows and thicknesses are not recoverable from the extracted text."
- Scene 11 Why?: "TMN/M f. 148a, TMN/MS pp. 11-12, TMN/D pp. 170-73; edition in MK's P.2.1" and "⚠ Ibn Turka, Nafsat al-Maṣdūr II, as MK cites it in a note (pdf p.69/70 notes)".
- Plate caption scene 12: "our OCCULTIMGDB catalogue places this manuscript in Jalayirid Baghdad".
- Scene 30 rubric: "Collated by the game from Melvin-Koushki's entries".
A non-scholar reads "CL-0630" as a bug.
Fix: strip `\(CL-\d+[^)]*\)` from all rendered strings at export time (keep them in the data for the Why? chain); replace "MK" with "Melvin-Koushki"; rewrite the ⚠ note as "The detail is his own telling, in an apology to a ruler." Replace "OCCULTIMGDB catalogue" with "the project's image catalogue" or drop the parenthesis.

**M3. Untranslated vocabulary and dates: the fixed-facts box is where scenes become unreadable.**
Examples (scene id, quote): SCN-0103 "known for jafr, raml, the science of letters and taksīr" (no gloss for four terms; hadith/mahdi/majlis also bare); SCN-0209 "The colophon on MS Majlis 10196 f. 330a ... finished on 20 Ṣafar 814 (13 June 1411) and corrected in Fars on 19 Dhū l-Ḥijja 817" then "Melvin-Koushki's timeline says 813/1411 instead ... 'for pilgrimage?'"; scene 29 "The Hijri and Christian spans in that sentence do not correspond: 827 AH began in December 1423."; scene 28 "The game gives no weekday, because the source's does not fit that date in the Julian or the Gregorian calendar"; scene 30 rubric ("terminus ad quem", "some ranges overlap (the Sharḥ-i Ḥadīs-i ʿAmāʾ and the Sharḥ Ḥaqīqat al-Waḥda...) and some are misprinted (the Naẓm al-Durr, the Tamhīd)"). Scene 18: the player is never told who ʿAlī, ʿUmar and ʿUthmān are or why "praising ʿAlī and condemning ʿUmar and ʿUthmān" is a capital-level charge (the Sunni/Shiʿi fault line). I wanted to skim from about scene 9 on.
Fix: (a) a hover/tap glossary: wrap terms in `<abbr>`-style dotted underlines with a one-line gloss (jafr = divination by letters and numbers; raml = geomancy; taksīr = "breaking" a letter's name to release others; majlis = court gathering; qadi = judge; colophon = a scribe's closing note). (b) Move all manuscript-date scruples (Hijri/Gregorian mismatches, weekday, misprinted folios) out of the fixed box into the Why? drawer; the box should carry at most 3 lines a player can act on. (c) In scene 18 add one sentence: "Praising ʿAlī and cursing the first three caliphs is what Shiʿis do and Sunni rulers punished; in 1426 it would read as heresy."

**M4. The same facts are stated three times per scene.**
Scene 1: the fixed box says Temür took Isfahan and your brother became qadi; the first paragraph says it again; the italic question says it a third time ("Isfahan has fallen and most of its people have been killed, but your family has been spared and sent east..."). Scene 21 and 22 both narrate Aḥmad-i Lur's attack on Shāhrukh in nearly the same words ("strikes at Shāhrukh at the door of the congregational mosque" / "struck at Shāhrukh outside the congregational mosque and was killed where he stood"). Scene 25's text says the outcome is a bad one and the fixed box already says he failed to get a hearing.
Fix: the italic question should ask, not recap: drop the first clause. Scene 22 should open from the consequence ("You are in the hands of the dīvān"), not the attack.

**M5. Choices in most scenes are not real choices: the documented option is identifiable from its shape, and departing from it is undone by the game.**
Pattern across Acts I-IV: the documented option is the one carrying the odd, specific detail (scene 13: "...and when he offers to restore you as judge of Isfahan, ask for Yazd instead" right after the box hints that "Yazd was known as the most stable"; scene 24: "Take them in the order the dates give"; scene 25 "Go to the camp at Simnan yourself"). The alternatives are labelled COUNTERFACTUAL and are usually visibly worse ("let the law bend a little", "Refuse the summons", "Decline the honours") or penalised only in livelihood. When you pick one anyway, the game says "The game returns you to the record" (scenes 5, 7, 11, 14, 18, 21, 22, 25, 31): you refuse, and you go anyway. I felt informed, not powerful. The exceptions, where I felt agency, are the best scenes: 4 (Barqūq's majlis: three UNKNOWN options with different costs), 23 (three documented households), 19 and 27 (composers where every slot has several DOCUMENTED moves), 28 (the bequest) and the Act VI commit.
Fix: (a) keep the honest "the record has him do X" but make the counterfactual real in the ledger: let the choice stand in the story and still charge its consequence (the exposure/livelihood numbers already exist); reserve "returns you to the record" for fixed points only. (b) Stop writing the documented option as the fullest sentence: make the three options equal in length and specificity. (c) Show the counterfactual's cost before pick only where it is a real trade, not always a penalty.

**M6. Act III's rulings are a quiz placed before the decision, and the decision prompt sits above them.**
Scene 11: the italic prompt "Do you withdraw, stay in view, or go to the new master?" appears, then `Let it stand, or refute it? (0/3)`; no options are visible until the rulings are done, and "First, three rulings on what the treatise argues" is buried at the end of a 250-word paragraph. I did not realise the option list would appear only after the rulings until it did. In scenes 12, 16 and 20 the rulings are answerable by re-reading the fixed box (scene 16: five of five are in the box); in scene 12 and 11 they are a coin-flip for a non-expert. Having got #2 in scene 12 wrong ("ranks the spoken form above the written") with only the tradition to go on felt unfair, though the feedback taught me something real. Scene 20 breaks the fiction ("For one scene the game steps out of 1426") and has five more rulings. Rulings are not reachable by number keys; only the mouse or Tab.
Fix: put a one-line header above each ruling group: "Before you decide: 3 true-or-false checks on what the treatise says. Answer from the box above; a wrong answer only costs Doctrine points and teaches you the text." Move the italic question below the rulings. Cap rulings at 3 per scene and drop scene 20's set (its five statements are the thesis of the game and can be a single paragraph).

**M7. The collection sorter is fair but a chore, and the feedback is thin.**
Scene 30: fifteen rows, only ▲ ▼ buttons (no drag; the brief/HTML suggests rows can be dragged, they cannot). Getting from the shuffled list to a good order took me about 35 tool calls (two clicks a row plus arrow-key repeats); the keyboard path (focus stays on the moved row; Up/Down repeat) is excellent and should be advertised first. The instructions paragraph is 150 words of manuscript-cataloguing ("some ranges overlap... misprinted (the Naẓm al-Durr, the Tamhīd)... The Arbaʿīniyya is left out because its first folio, 120b, is also claimed by the Waḥda"). How to play promises that "the sentence under the list tells you what your order says about him before you commit"; the sentence only reads "As you have it, the volume opens with X and closes with Y." After submitting, the result ("3 of 105 pairs of works stand in a different order") never shows which three pairs; the real order is only inside the Why? drawer. The later folios are given in the fixed box, so the sorter is winnable by reading; that is fair, but then "the dates will mislead you" is not a puzzle, it is a hint.
Fix: (a) add drag on the rows (pointer events) or state plainly "arrows only"; (b) start the list in date order, not shuffled, and make the puzzle "which of these do NOT belong in date order?" (a 4-row job), or keep 15 rows but add "Sort by date" and "Move to top / bottom" buttons; (c) live preview sentence: "Your order puts the two apologies at the front and back: that reads the volume as a defence file." (d) after "Use this order" show a two-column table: yours vs the manuscript's, with the misplaced rows highlighted; (e) cut the rubric to three sentences and move the folio caveats to Why?.

**M8. The Act VI dossier is understandable only by scene 34, and its numbers are unexplained.**
Scene 32 opens "Dossier: Empty. Nothing read yet." with no explanation of what a "reading" is or what A-F are; the table appears in scene 33 as rows like `B  Orthodox Sunni Sufi thinker  +5 / −1  ... +4` with no column headings (the pair is "readings for / against"; the last number is the net). Letters A-F are the labels in the commit list but the order of rows changes every scene. Scene 35: the lens "Matthew Melvin-Koushki: Call him an occult philosopher and an imamophile" leaves C (mystical philosopher) top and D (his own reading) second; I read that as a bug for two scenes. The commit list in scene 36 has no labels, costs or Why? at all, and the dossier sentence "On this dossier the accurate report is that the evidence does not fix it" effectively tells you the answer is F, which makes the final decision a test of obedience. Feedback afterwards ("false certainty") was crisp and fair.
Fix: add a 3-line explainer at the top of scene 32: "You will collect readings: short verdicts from witnesses. Each reading argues for one candidate identity for Ibn Turka (A-F) or against it. The table shows readings for / against and the net." Add column headings ("for / against", "net"). Keep row order fixed (A-F) and animate the change. Explain the lens: "The lens changes whose readings count, not the evidence." Add a Why? to each commit option and show, before you press, what a commit costs ("if you commit to F, calibration cannot fall; you give up the chance of a bold Doctrine score").

**M9. Mobile layout: option text is squeezed by the label badge.**
375px wide: each option is `[number] [text ~110px wide] [DOCUMENTED badge]` in one row, so a 25-word option wraps to 7 lines in a column about 110px wide (scene 1 screenshot). The badge should sit above or under the text on narrow screens. The header wraps to two lines ("Turka Vita" / "How to play, Court board / Start over"), pushing Start over into a second row. Ruling buttons are about 30px tall (below the 44px touch minimum).
Fix: at max-width 520px: `.option { flex-direction: column }`, badge `align-self:flex-start` above the text; header links `font-size` down or a hamburger; buttons `min-height: 44px`.

### MINOR

**m1. "Whatever you did, you have gone beyond the evidence." fires after DOCUMENTED picks.**
Scene 23: I chose a DOCUMENTED option (Gilan letters) and the outcome ended "The record is silent on what he chose here. Whatever you did, you have gone beyond the evidence." Same in scenes 4 (all UNKNOWN), 28, 29. The sentence reads as a scolding when it is only a scoping remark, and it is untrue for a documented pick.
Fix: use two variants: for documented options in an unrecorded-order scene, "The record names all three; it does not say which came first."; for UNKNOWN/RECONSTRUCTED picks, "The record is silent on this. Your choice fills the gap; the game marks it as ours."

**m2. Every counterfactual pick says "The record: this is not what he did."; even for near-misses.**
Scene 2: option 4 (go abroad with Yazdī, RECONSTRUCTED) differs from the documented option only by a companion, yet the reveal says "this is not what he did" and it counts against the biography bar. The distinction "not recorded" vs "contradicted by the record" is lost.
Fix: three outcome lines: "The record does this" / "The record does something close: it has [X]" / "The record contradicts this."

**m3. "Act cards" list favour with the dead and the wrong role.**
Act IV card: "Most favour with Shāhrukh, Sayyid Ḥusayn Akhlāṭī [d. 1397], the court of Iskandar Mīrzā [fallen 1414], Temür [d. 1405]". Act V and VI cards still say "Where you stand. Most favour with..." although you are now the copyist and the historian. Also at Act VI, the header still shows "Exposure: 11".
Fix: hide the "Where you stand" line on Acts V-VI or rename it "Ibn Turka's standing when he died", and filter out courts whose ruler is dead.

**m4. Scene numbering: an act card and its first scene share a number.**
Act II card is "SCENE 7 OF 36" and the first real scene is also "SCENE 7 OF 36". The title's Continue label ("Act III · The trials, scene 13 of 36 (Herat, 1422: the charge of Sufi bias)") also names the card's number with the scene's title.
Fix: do not show "scene N of 36" on act cards ("Act II, part 1 of 6").

**m5. Focus and scroll after Continue / choose.**
After Continue the focus goes to `<body>` (fine for Enter-to-continue, bad for screen readers); Enter toggles an open Why? summary rather than advancing when it holds focus, so "press Enter to continue" fails after you have opened a drawer (I hit this in scene 6). `Begin this act` cannot be advanced with Enter (only Continue can). After resuming mid-ruling, the page scrolls to the top of a very long scene rather than to the unanswered ruling.
Fix: after any answer move focus to the next unanswered control or to the Continue button; make Enter also press `Begin this act`; on resume scroll to the first unanswered control.

**m6. Number keys act behind the Court board.**
With the Court board (or, presumably, How to play) open, pressing 1 registered option 1 in the scene beneath, invisibly (which was doubly confusing because of M1).
Fix: ignore scene shortcuts while a panel is open.

**m7. Plates: the honesty is superb, the captions are long, some scenes have none.**
Every plate carries "Illustrative plate, not a depiction of this event" and a sentence saying what it actually shows, which I trusted immediately. But captions run 60-95 words (scene 6: "the event is dated 1404 in the Commons description but October 1405 in the file name, and Temür died in February 1405, so treat the event date as uncertain") and include cataloguing residue ("Copy offered by a bookseller (the Commons page cites AbeBooks)", scene 34; "(Per 119.10, f. 1v)"). Scenes with no plate at all: 5, 10, 20, 21, 23, 24, 26, 27, 33, 35, 36 and the title. Scene 1's plate (a 1370 audience at Balkh) shows the wrong place and year for the scene it opens, which the caption admits. Images lazy-load, so on mobile the frame is briefly blank.
Fix: two-line caption by default ("Plate: Temür receives an audience (Zafarnama, Shiraz, 1436). Shows 1370, not this scene.") with a "more" toggle for the full provenance. Give the title screen and the Act VI desk scenes a plate. Reserve the image space (aspect-ratio) to stop layout shift.

**m8. Composer: "the game says so when you pick it" is not true, and the text preview reads as stage directions.**
How to play and scene 15/19 intros say a counterfactual move "the game says so when you pick it"; the verdict appears only after `Send it`. "The text so far" pastes option labels ("No: keep politics out, as Melvin-Koushki finds you did in your other minor lettrist treatises.") so it reads as a list of instructions to yourself. The composer also let me choose "No politics" and then still requires you to choose what "the prediction rests on" (scene 15, an incoherent letter that nevertheless sends). You cannot see the total effect of the picks before sending (individual "Costs and effects" only, and none on counterfactual options).
Fix: (a) after the last slot, show a summary line: "This letter: +2 favour Bāysunghur, +1 exposure; 2 of 4 moves are in the record." (b) grey out dependent slots when a parent slot removes them. (c) change the preview to render each pick as a short sentence in Ibn Turka's voice, or relabel it "Your choices so far". (d) correct the copy: "the game tells you what the record says once you send it."

**m9. Small text problems.**
"You: let it stand. The sources: bear it out." reads oddly (a colon splits the subject from the verb): use "You said: let it stand. The sources bear it out." Ruling counts show "(0/3)" with no label. "mafiosos (Melvin-Koushki's rendering)" in scene 19 is jarring. "Exposure: 8" then 10 then 11 with no explanation of why it went down between two of my runs (different runs; but the label "It compounds and never resets" makes a reader look for a decrease). Scene 5 plate is absent so the "our Sayyid" turning point has no image.
Fix: as quoted; and word the exposure blurb "It only goes up".

**m10. Title screen.**
"Continue" after a finished run has no label (just "Continue"); a returning finished player expects "See your ending". The title page is a wall of text with no image.
Fix: label it "See your ending (scene 36)" and add a plate.

## What worked (delighted)

- The honesty of the labels. Every plate and every claim says whether it is documented, reconstructed, contested, unknown or counterfactual; the plate captions ("not a depiction of this event") made me trust the game more than any museum wall text.
- The rulings' feedback. Getting scene 11's #2 right by refuting "his age is in decline" and reading "The treatise says the opposite: it points to the upward progress of the age" was the moment the game clicked: a real, surprising fact taught by a wrong-able guess. The scene 12 lesson that the Mafāḥiṣ "promotes the written form above the spoken" the same.
- Locked options with the reason: "Closed to you: needs favour with Amīr Jalāl al-Dīn Fīrūzshāh of at least 1 (you have 0)" (scene 11), which was the consequence of my scene-10 letter to Iskandar instead of the amir. It is the one place my earlier choice visibly cost me something later. More of this.
- Scene 4 (Barqūq's majlis), 23 (three households), 28 (the bequest) and the composers in 19 and 27: real trade-offs, clear costs. Scene 19's five-slot apology is the best mechanic in the game: I really did weigh flattering Shāhrukh against exposing myself.
- The Court board: short, plain-language, honest about being an abstraction; the "pressures" blurbs are exactly the right length.
- The ending's "margin" table ("You came out better than the record's course on 2 of the five measures and worse on 3... a player who follows the record at every step... reaches +53") made the tension between fidelity and outcome concrete. "Whose Ibn Turka did you play?" (closest: Melvin-Koushki's occult philosopher) is a great last beat, and "false certainty" for a bold commit was fair and stung in the right way.
- Keyboard: number keys + Enter make the decision scenes fast; arrow keys on the sorter keep focus on the moved row; double-clicking Continue does not skip; odd keys are ignored; refresh/resume restores rulings, composers and the finished ending.
- Plates that earn their place: the Iskandar horoscope (scene 11), Bihzād's "Poet at the Judge's Court" (scene 25) and the Bāysunghur Gulistan page (scene 29).

## Answers to the brief

1. **Orientation.** The title says what I am (Ibn Turka, then a copyist, then a historian) and that events are fixed and choices are labelled. How to play then says "Nothing in this game can save Ibn Turka... You do not win or lose by surviving" and lists the four bars: a genuinely good statement of the goal. What was still unclear after it: what "calibration" (+5) means numerically and what a good bar is (the only benchmark is the ending's "+53 for following the record"); how much the favour numbers matter (I never saw one change an outcome except the locked option in scene 11); "documented / reconstructed / counterfactual" were defined in the panel and made sense within two scenes; and I learned only in Act III that the wrong answer to a ruling costs points, not just the reveal.
2. **Pacing and load.** Acts I, II and IV are the right size and the best-written; Act III feels like three scenes of "who do I mail a book to" (15-17) followed by the best material (18-21). The heaviest scenes: 9 (two commentaries, colophon data), 12 (Mafāḥiṣ plan), 29-31 (manuscript cataloguing), 20 (meta). Wanted to skim: every fixed-facts box after scene 9. Wanted more: the trials themselves (there is no scene of the hearing in 1426; you write the apology and then are recalled) and the actual death (28 is undercut by the weekday/calendar caveat).
3. **Agency.** Low in Acts I-IV (M5), high in composers and the desk. The documented label is obviously right in a majority of binary scenes. Court board, favour and locked options changed what I did only twice (scenes 11, 25). The ending's margin table and "beside the record" section made sense on first read and were the best-explained part of the game.
4. **Writing scenes and the sorter.** The composers are usable and the best part; slot-by-slot feedback after sending is excellent; I could tell the cost of each pick but not the total (m8). The sorter is fair (dated part deducible, later part given in the box) but tedious via buttons and thin on feedback (M7).
5. **Bugs and polish.** B1-B3, M1, M2, M9, m1-m10 above. No console errors. No slow interactions.
6. **The plates.** They help; the honesty is the best in class. Captions too long, eleven scenes without a plate (m7).
7. **The historian's desk.** Understandable by the third pile; before that it is opaque (M8). The lens idea is clever and worth keeping; make the numbers legible.
8. **Scores and recommendation.** See below.

## Scores (1-10)

| dimension | score | note |
|---|---|---|
| Clarity | 5 | Goal and labels are clear; individual scenes are jargon-heavy, copy is repeated, and there are contradictions (B3) |
| Engagement | 6 | Composers, rulings and the ending are compelling; Act III scenes 15-17 and Act V drag |
| Replayability | 5 | Fixed points and "returns you to the record" limit divergence; a second run would mainly test other documented picks and the Act VI lenses |
| Polish | 5 | The save-wiping title bug, invisible Court board, leaked ids and mobile squeeze undercut a carefully made surface |

**Would I recommend it?** To a friend who likes history *and* likes reading primary-source scholarship (someone who enjoys a footnote), yes: it is the only game I have seen that is honest, scene by scene, about what is known, and the moment a wrong guess about a treatise turned into a surprising fact was better than most museum exhibits. To a friend who wants a story, a mystery or a game with consequences, no: the choices mostly confirm what the record already did, the vocabulary assumes you are reading a dissertation, and a run is a very long sitting. I would recommend it after B1-B3, M1, M2 and M3(b) are fixed, to a patient history reader on desktop; I would not send it to a phone player yet.
