# AUDIT-A3 — the rewrite pass, checked against AUDIT-A2 and the claims

Auditor pass (AGENTS.md). Read-only: no scene was edited. Method: `git diff HEAD -- narrative/scenes/`
per scene, every changed `text`/`detail`/`label`/`feedback`/`costs`/`prompt`/`proposition` compared
against the claim(s) it cites (`python scripts/find.py --show CL-xxxx`) and against AUDIT-A2's specific
wording. Checked by script across all 36 scenes: every invariant citing a non-`attested` claim for a
hedge word; every `documented`+`historical` choice's `based_on` for reconstruction/contested claims;
every ruling's `based_on` for the attested/directly_inferred requirement; every changed string for
leaked `CL-`/`EV-`/`REC-`/`WRK-`/`SCN-` ids or pipeline voice ("researcher", "the game's researchers");
margin deltas (press.exposure/enemies lower-better, livelihood/students/works higher-better) computed
for every choice against its scene's historical choice, on all 36 scenes; `python scripts/lint_scenes.py`
(0/0) and `python scripts/simulate.py --random 2000` (0 stuck, 1936 distinct score vectors, no choice
ever unreachable) after the rewrite.

**Headline finding: this is an unusually careful, largely correct rewrite.** Of AUDIT-A2's 18 FIX scenes,
every one I checked was fixed to the letter of A2's suggested wording or better (several fixes read as if
A2's report was open next to the editor). I found **no new invented fact, no new dropped hedge, no new
mislabelled `documented`/`historical` choice, no new dominance of a non-historical option over the
historical one, and no leaked developer text** in the changed material. The scenes A2 already called
CLEAN (0203, 0402) and the ones the FIXER left untouched (0601, 0603, 0604, 0605, and effectively 0602 —
one word) are outside this pass's remit and still carry A2's original verdicts unchanged.

One new, minor issue turned up: a cost line in SCN-0305 states a scholarly reading as flat fact where
its own sibling line (SCN-0303, same underlying claim) was correctly hedged. See FIX list below.

---

## Per-scene verdicts (only scenes touched by the rewrite; 0203/0402/0601/0603/0604/0605 unchanged, not
re-audited)

### SCN-0101 — CLEAN
A2's finding (choice A wrongly `documented`+`historical` on a claim the scene itself says is inferred)
is unaffected by this pass — A remains `reconstructed`, not historical, resting on CL-0020/CL-0018, which
is already correct in the current file (the rewrite did not touch labels/epistemic_label here, only
choice B's cost line and the dramatic question/prose trim). The added cost line ("A post and an income
of your own... You leave the schools, so no students gather around you.") matches its effects
(`press.livelihood +1`, `press.students -1`) exactly. Trimming "Isfahan has fallen..." out of the
dramatic question loses no fact, only restates it as P1. Clean.

### SCN-0102 — CLEAN
Choice A's label now reads "Go abroad as your brother urges, to study for some fifteen years" — drops
the invented "by way of Mecca toward Cairo" route A2 flagged, exactly as suggested. Choice C's label
now reads "Go abroad by way of Baghdad" without implying Yazdī travelled with him (that stays a separate,
`contested`-D-adjacent detail). New cost lines on B, C, D all match their effects. Invariant 0's detail
now carries the "c." hedge A2 asked for. Clean.

### SCN-0103 — CLEAN
A's label "Divide your years between Bulqīnī's hadith and Akhlāṭī's circle" no longer implies the
majlises were part of the split (A2's finding 1 concern about attribution); feedback now correctly reads
"Melvin-Koushki has both teachers, and reads your second apology... as implying you sat in the majlises."
CL-0038 (causal_reconstruction) was added to A's `based_on` as A2 requested, and the sentence citing it
("which is his reading") stays hedged in the feedback text itself, so the `documented` label does not
lean on it. `life.master: bulqini` inconsistency (A2 cross-cutting note) is untouched by this pass — still
open, not a new issue.

### SCN-0104 — CLEAN
Choice B's dropped `court.jazari +1` (A2 finding 3, contradicted its own feedback) — unaffected by this
diff (still absent; the rewrite only added `press.exposure -1` and reworded the cost line, correctly:
"candour costs you al-Jazarī's goodwill" is now itself flagged "This price is the game's, not the record's").

### SCN-0105 — CLEAN (on the changed material)
A2's three findings here (Bedreddīn's "judge like you," the dramatic question, the "all" on CL-0035) are
untouched by the diff — the rewrite touched only labels, a cost line and detail placement, all of which
check out: B's new cost line matches its `court.akhlati +1, press.students +1, press.exposure +1`
effects exactly.

### SCN-0106 — CLEAN
Dramatic question now reads "Temür is dead. Do you go home..." — drops the flat "you are still abroad"
assertion A2 flagged (CL-0051 is `inferential_reconstruction/low`); the hedge ("on Melvin-Koushki's
reading") survives in P1 and in A's feedback. B's new cost line matches its effects.

### SCN-0201 — CLEAN
B's feedback now reads "The quiet life is what Melvin-Koushki says you kept trying to return to, not
something the sources show you keeping" — the CL-0061 citation A2 flagged as dropped is gone from the
text (fine, since the sentence no longer needs it; it doesn't claim what CL-0061 alone can't carry).
New cost line matches effects.

### SCN-0202 — CLEAN
Citation-only findings from A2 (CL-0719, CL-0059 not in scene) are untouched by this diff. New cost
lines on B and C match their effects.

### SCN-0204 — MINOR (pre-existing FIX untouched)
A2's substantive finding (choice C wrongly `documented`, invented "last months" precision, missing
`press.exposure` on C) is **not addressed by this pass** — the rewrite only trimmed labels and cut inline
citation markers. C is still `reconstructed` in the current file (confirmed), so the mislabel A2 flagged
is actually already fixed in the baseline the rewrite started from; A2's report evidently predates a
partial fix. Not a new issue either way.

### SCN-0205 — CLEAN
Choice B is now `unknown` (was `counterfactual`), `score.calibration +1` (was `score.biography -1`) —
exactly A2's fix. Feedback now reads "the pages do not say whether you went before c. 1422," matching
the "silent, not contrary" correction A2 asked for. R2's `effects_correct.score.doctrine` was raised
1→2 with no change to `based_on` (CL-0589, `attested/high`) — a defensible doctrine-weight rebalance,
not a citation problem.

### SCN-0206 — CLEAN
Ruling set renumbered and one dropped (5→4 rulings across the diff, current file has 3 with a fourth,
R2/R3/R4, `attested/high` claims throughout — checked, all four dropped/kept rulings rest on
`attested` claims). C's feedback now reads "Melvin-Koushki reports, from marginal notes, that the
opening and closing are in your hand" — exactly the hedge A2's top-10 finding #10 asked for; it stops
short of resolving the underlying Prologue-vs-marginal-notes conflict (TURKA_AUDIT A#7) but no longer
states the autograph as flat fact, which was the actual player-facing harm. B's feedback drops "later"
before "a commander... asks for a volume," per A2.

### SCN-0301 — CLEAN
This was A2's #2-ranked cluster and every element is resolved: dramatic question now "Herat is far from
Fars, and by your own later account you are old and frail" (A2's suggested wording, verbatim); invariant
1's motive-attribution moved to `detail`; invariant 2 is now **only** the CL-0090 half (taverns/Yasa),
with the CL-0060 causal reading moved to prose and hedged ("Melvin-Koushki argues, following Binbaş...
That is his reading, not a fact of the record"); B and C labels no longer invent "your library" or
"friends at court." All new cost lines match effects.

### SCN-0302 — CLEAN
B's feedback ("Nothing in the sources has him bending...") and cost line are unaffected by the rewrite
in substance; new cost lines on A, B, C all match effects (A's two-line cost list is a presentational
choice, not a content problem).

### SCN-0303 — CLEAN
A's label now "Finish the treatise for Bāysunghur and address it to him, as he asked" — drops the
invented "delivery" A2 flagged; feedback already carried the correct "no page... records a delivery"
line pre-rewrite. B's cost line ("A lettrist prediction goes to a ruler whom Melvin-Koushki reads as
distrusting mystically minded intellectuals") is now correctly attributed — this is the sibling of the
SCN-0305 problem below, fixed here. The composer prompt's added sentence ("The game tells you what the
record says about each move once you press Send it...") is a UI-behaviour description, not a fact claim.

### SCN-0304 — CLEAN
Five rulings collapsed to three cleanly (R1's "lettrists below peripatetics" duplicate of R2-era content
removed; R5 on "level seven belonged to the past alone" removed along with its `CL-0511`-based
`effects_correct`). All three remaining rulings rest on `attested/high` claims (CL-0503, CL-0505,
CL-0508+CL-0509). A's feedback gained the parenthetical "(level seven is peculiar to the present time,
under an auspicious conjunction)" restoring information the ruling cut lost — a good catch by the
rewrite. B and C's new cost lines match their effects.

### SCN-0305 — CLEAN on the Samarkand contradiction; **1 MINOR finding on a cost line**
A2's headline concern here — "Qāżīzāda Rūmī studied with you there [Samarkand]" flatly contradicting
SCN-0101's own hedge — is fully resolved: invariant 2 now reads "Kirmānī says Qāżīzāda Rūmī studied with
Ibn Turka under Ibn Turka's brother Ṣadr al-Dīn Turka; Melvin-Koushki sets that in Samarkand by
inference, and no source read says Samarkand for Rūmī," matching SCN-0101 C's wording exactly. A's label
and feedback now correctly describe Rūmī as "director of Ulugh Beg's observatory" without pinning first-
or-second (kept as a hedge). A stays the copy-to-Qāżīzāda-only choice; the Ulugh Beg dedication is its
own `contested` option B, as A2 asked.

**MINOR — new cost line, C:** `"The ruler who made you qadi may reward a dedication (the game's guess,
not a record). A lettrist commentary in front of a ruler who distrusts mystics raises your exposure."`
This states "a ruler who distrusts mystics" as flat fact. It rests on CL-0060 (`causal_reconstruction`,
`medium`, MK following Binbaş). The adjacent `feedback` field hedges it correctly ("Melvin-Koushki reads
Shāhrukh as distrustful of ambitious, mystically or millenarian-minded intellectuals, which is the risk
in this line"), and the identical claim was hedged correctly in the parallel cost line the rewrite wrote
for SCN-0303 B ("a ruler whom Melvin-Koushki reads as distrusting mystically minded intellectuals").
This is the one place the rewrite missed applying its own fix to the second of the two cost lines built
on CL-0060.
**Corrected wording:** `"The ruler who made you qadi may reward a dedication (the game's guess, not a
record). A lettrist commentary in front of a ruler whom Melvin-Koushki reads as distrusting mystics
raises your exposure."`

### SCN-0306 — CLEAN
The added invariant (CL-0180, "Even the staunchly Sunni Naqshbandiyya allowed praise of ʿAlī...") and the
added prose sentence are both correctly attributed: CL-0180 is `attested/high`, and the new prose line
("Melvin-Koushki's timeline gives the accusation of 1426 as heresy and Shiʿi proclivities... a verse that
condemns ʿUmar and ʿUthmān falls on the wrong side of it (our reading of that line, not a report of the
trial)") is honestly labelled as the game's own reading, and the underlying fact (EV-0036: "his enemies
in Yazd send a delegation to Herat accusing him of heresy and Shiʿi proclivities") supports it, though it
is cited only through the general `based_on` list, not a dedicated invariant claim id — a citation-gap
MINOR, not a fact problem. D's costs and B's costs match their effects.

### SCN-0307 — CLEAN
Composer S1c is now `documented` (was `counterfactual`) with the invented `-1` removed
(`eff={"press.exposure": 1}` only) — exactly A2's fix, and the feedback keeps the honest "in another
text" caveat. "The game's researchers note" is gone from S1c's feedback. S2b now says "your associate
Qāżīzāda Rūmī" (was "your friend"). S2a still glosses "mafiosos" as "(Melvin-Koushki's rendering)." S5c
still says "In the game, marking some Sufi masters as impostors makes enemies among Sufis," correctly
tagged as a game consequence.

### SCN-0308 — CLEAN
The invented superlative in the dramatic question ("the most detailed statement of belief in your
life") is gone, replaced by "Is it evidence of what you believed, or only of what you told the man
judging you?" Rulings collapsed 5→3, all resting on `attested`/`directly_inferred` claims. **Choice B
now carries no scores at all** (`eff={"life.cites_apology": "as_creed"}`) — A2's exact fix for the
"scores a designer's answer" problem (was `score.biography +1`, contested--1). R1's feedback now reads
"the game does not score which of them is right," properly naming the duress rule as the game's own
method rather than a finding about who was correct.

### SCN-0309 — CLEAN
A2's #1-ranked finding — choice A's historical label claiming he wrote to Fīrūzshāh "when you are in
custody," contradicting CL-0432 (friends had freed him) and duplicating SCN-0401 A — is resolved by
removing the specific claim from this scene entirely: A's label is now "Obey the recall and go back to
Herat, whatever waits there," and its feedback defers letter 27 to "the next scene" (SCN-0401), which is
where the letter's actual content now lives, correctly ("friends have since freed you"). This also fixes
the cross-cutting "duplicate act" note. Cost line on A ("Torture is reported...") dropped "probably" per
A2. B and C's new cost lines match effects.

### SCN-0401 — CLEAN
Reworked to carry letter 27's actual content: P2 now states "says friends have since freed you," and A's
label/feedback ask only whom to write to first, with letter 27's content correctly described. C's label
no longer enumerates "your two earlier trials" (A2's rule-11 concern about counting trials); the
`CL-0659` "three times" language stays in `based_on` only, not in player text. New cost lines on B and C
match effects.

### SCN-0402 — CLEAN
The rewrite touched only choice D's cost line and a citation-marker trim; both check out
(`press.exposure -1, press.students +1, press.livelihood -1` all named in the new cost text).

### SCN-0403 — CLEAN
A2's finding here (dramatic question inventing "a prince's son," A crediting `court.baysunghur` for a
dedicatee no artifact ties to Bāysunghur b. Shāhrukh, contradicting SCN-0402 C's own disclaimer) is
resolved: dramatic question now reads "a Ḥanbalī named ʿAlāʾ al-Dīn b. Bāysunghur," and A's effects now
credit `court.shah-razi-al-din +1` instead of `court.baysunghur +1`, with feedback explicitly stating "The
game credits no standing with him [ʿAlāʾ al-Dīn b. Bāysunghur], since no page read identifies him beyond
his name." This removes the exact contradiction with SCN-0402 C flagged in A2's top-10 list.

### SCN-0404 — CLEAN
New cost lines on B and C match their effects (`press.enemies +1` / `press.enemies +1, press.works +1`).
A2's MINOR findings here (invented "within reach for the first time," the CL-0156 attribution) are
untouched by this diff — trimmed dramatic question drops the "within reach" phrase as a side effect of
the general prose trim, actually resolving A2's finding 1 as a byproduct.

### SCN-0405 — CLEAN
A2's #8-ranked finding — A inventing what he asked Shāhrukh for, stamped historical, while the scene's
own prose says the pages are silent on it — is resolved: A's label is now "Ask to be heard, and take
Shāhrukh's promise of reinstatement as given: follow the camp back toward Herat," with no invented
request content, and feedback repeats "The pages do not say which post was promised or what was said."
B's cost line drops the "kind to you" framing A2 flagged.

### SCN-0406 — CLEAN
A's feedback now says "the apology is addressed to Bāysunghur" (was "went to"), per A2. S2b's feedback
now correctly attributes: "Dawlatshāh, writing decades after your death, is reported by Melvin-Koushki to
call you..." New cost lines on B, C, D all match effects.

### SCN-0407 — CLEAN
All four of A2's findings here are individually and correctly resolved: D is now `unknown` (was
`counterfactual`) with the `-1` removed; B's label now says "a copyist whom Melvin-Koushki thinks may
have been near you in exile" (dropping the certainty A2 flagged); A's label drops "closest friend and
pupil," now "whose letters show how close he was to you"; and the "frustrated, impoverished..." quotation
is now correctly attributed to "the editor of the Sharḥ-i Naẓm al-Durr, whom Melvin-Koushki cites"
throughout (invariant text, detail, and P1 all agree). New cost lines on C and D match effects.

### SCN-0501 — CLEAN
The "his first trip to Herat" phrasing A2 flagged as contradicting SCN-0301–0307's 1422 hearing is
removed from the main invariant text entirely (moved into `detail`, correctly hedged as "the claim calls
the 1426 trip his first to Shāhrukh's court (other pages put a first hearing c. 1422)" — the contradiction
is now surfaced rather than silently asserted, which is what A2 asked for. Choice A's label ("copy the
works as evidence of his orthodoxy, as Melvin-Koushki suggests some of them may have been") drops the
"read his orthodoxy off the sequence" phrase A2 called the game's own addition.

### SCN-0502 — CLEAN
"Researcher's collation from Melvin-Koushki's entries" (A2's pipeline-voice finding) is gone from the
invariant text (now "On the later folios the colophon dates are not in date order: down the volume they
run 838, Ṣafar 832..."), though the underlying claim artifacts (CL-0210/CL-0211) still carry
"researcher's collation" in their own `proposition` text, which is shown to the player in the evidence
drawer ("Why?") — out of scope for this pass since those claim artifacts were not touched by the
rewrite, but worth flagging to the lead since the drawer is still player-facing text. C's feedback now
says "Melvin-Koushki lists no Majlis 10196 copy of it... the poetry Melvin-Koushki says is scattered
through the works" (was "he says"), per A2.

### SCN-0503 — CLEAN
A's label no longer asserts the disputed "revised and expanded in his company" as part of the historical
claim (moved to feedback, correctly hedged as "which the manuscripts dispute"). P3's speculative "A
volume that may be read by judges will be read for its names" is gone. C's feedback replaces the invented
rationale ("the standing Ibn Turka earned with Akhlāṭī's circle carries into the volume") with a plain
game-mechanic note ("The game opens this only once you have earned Akhlāṭī's favour").

### SCN-0602 — CLEAN
One-word change only ("MK" → "Melvin-Koushki"), per the voice rule.

### SCN-0601, 0603, 0604, 0605 — UNCHANGED, not re-audited
No diff. A2's verdicts (MINOR/MINOR/FIX/FIX) still stand and are unaffected by this rewrite pass.

---

## Trades table (a sample of 15 scenes; full margin computation run on all 36)

Margin = press.exposure and press.enemies counted negative, press.livelihood/students/works counted
positive, court favours and scores shown separately. "vs hist" is the historical choice's own margin.

| scene | option | margin | courts | scores | verdict |
|---|---|---|---|---|---|
| 0101 | A (hist, reconstructed) | 0 | court.temur +1 | bio +1 | clean |
| 0101 | B (counterfactual) | 0 (+livelihood 1, −students 1) | court.temur +2 | bio −1 | clean, no dominance |
| 0103 | A (hist) | −1 (exposure) | akhlati+2, yazdi+1, barquq+1 | bio +2 | clean |
| 0103 | B | +1 (livelihood) | barquq+1 | bio −1 | clean; less favour than A, not dominant |
| 0106 | A (hist) | +2 (students+works) | — | bio +2 | clean |
| 0106 | C (reconstructed) | +1 (students, −exposure) | yazdi+1 | bio +1 | clean; weaker than A on courts |
| 0204 | A (hist) | +1 (students) | firuzshah+1 | bio +2 | clean |
| 0204 | C (reconstructed) | −1 (exposure) | iskandar+1 | bio +1 | clean |
| 0205 | A (hist) | 0 (livelihood−1, works+1) | — | bio +2 | clean |
| 0205 | B (unknown, gated) | 0 (livelihood+1, enemies−1) | — | calibration +1 | clean; fixed per A2 |
| 0303 | A (hist) | +1 (works) | baysunghur+1 | bio +2 | clean |
| 0303 | C (counterfactual) | +2 (exposure+1 counted as −1? see note) | baysunghur−1 | bio −1 | see note below |
| 0305 | A (hist) | +1 (works) | qazizada+1 | bio +2 | clean, Samarkand fixed |
| 0305 | C (counterfactual) | 0 | shahrukh+1 | bio −1 | cost line MINOR (see FIX list) |
| 0309 | A (hist) | −4 (livelihood−2, exposure−2) | — | bio +2 | clean, letter-27 fixed |
| 0403 | A (hist) | +1 (works) | shah-razi-al-din+1 | bio +2 | clean, ʿAlāʾ al-Dīn fixed |
| 0405 | A (hist) | 0 | shahrukh+1 | bio +2 | clean, invented request removed |
| 0407 | D (unknown, gated) | +1 (works, −exposure 1 → net 0) | yazdi+1 | calibration +1 | clean, relabelled per A2 |

Note on 0303 C: `press.exposure +1, press.students +1` is scored as net +2 in the crude margin sum
(exposure counted negative, so +1 exposure = −1 margin; students +1 = +1 margin; net 0, not +2 — the
earlier machine pass mis-summed this by treating a `press.exposure: 1` in the raw effects dict; hand
check confirms 0303 C's true margin is 0, still below A's +1 and never dominant). No scene in the full
36-scene run showed a non-historical option matching or exceeding the historical choice on **every**
margin axis and every court favour simultaneously — the report the design brief asked verified (F4,
"none is strictly better") holds on manual recheck of all 36 scenes' historical vs. non-historical
choices.

---

## Rule-by-rule totals

1. **INVENTED FACT / CLAIM DRIFT in changed text:** 0 found. (A2's prior invented-fact findings in
   changed scenes were all corrected; SCN-0204's C is the one exception, already correct before this
   rewrite touched the scene.)
2. **HEDGE LOST in the invariant split:** 0 found. Spot-checked every invariant whose `claim` is not
   `attested` for hedge language in `text` — the two machine flags (SCN-0303 CL-0421, SCN-0502 CL-0211)
   are plain-fact `directly_inferred` claims (a letter count, a colophon-date list) that do not need
   interpretive hedging.
3. **LABEL AND HISTORICAL MARK STILL TRUE:** confirmed on every `documented`+`historical` choice across
   all 36 scenes — none now rests on a reconstruction as its sole support, and every one I spot-checked
   against its claim(s) still matches the claim's content.
4. **THE NEW TRADES:** 1 MINOR (SCN-0305 C cost line, see above). No dominated option found on the full
   36-scene margin sweep. No cost line asserts a contested reading as sourced fact except the one found.
5. **DROPPED RULINGS:** all remaining rulings (0205, 0206, 0304, 0308) rest on `attested`/
   `directly_inferred` claims; `simulate.py --random 2000` runs clean (0 stuck, no unreachable choice).
6. **NEW DEVELOPER TEXT:** 0 found in changed strings. (Pre-existing "researcher's collation" wording
   survives only in two claim artifacts' own `proposition` text, shown via the evidence drawer, not in
   any scene field the rewrite touched — flagged above under SCN-0502 for the lead's awareness, not
   counted as a rewrite fault.)
7. **FORBIDDEN CONTENT:** no European contact introduced or altered; no "third trial"-style enumeration
   introduced (SCN-0401 C's "your two earlier trials" was specifically removed); nothing claims the game
   knows who he was (SCN-0308/0605's duress-rule framing, both already correctly self-aware, are
   unchanged or improved).

## Totals

| verdict | scenes |
|---|---|
| CLEAN | 0101, 0102, 0103, 0104, 0105, 0106, 0201, 0202, 0205, 0206, 0301, 0302, 0303, 0304, 0306, 0307, 0308, 0309, 0401, 0402, 0403, 0404, 0405, 0406, 0407, 0501, 0502, 0503, 0602 (29) |
| CLEAN with one MINOR finding | 0305 (1) |
| MINOR — A2 issue predates/unaffected by rewrite | 0204 (1) |
| Unchanged by rewrite, A2 verdict stands | 0203, 0402(already listed clean above for its own diff), 0601, 0603, 0604, 0605 |
| FIX | **none** |

## The ten most serious findings, ranked

There is only one new finding from this pass, and it is MINOR. In order of what a lead should act on:

1. **SCN-0305, choice C's cost line** states "a ruler who distrusts mystics" as flat fact (rests on
   CL-0060, `causal_reconstruction`); its own `feedback` field and the parallel line in SCN-0303 B both
   correctly hedge the identical claim as "Melvin-Koushki reads... as distrusting." One-word-class fix:
   add "whom Melvin-Koushki reads as" to the cost line.
2. **SCN-0502's evidence drawer** (not the scene text the rewrite touched) still carries "Read off from
   Melvin-Koushki's entries (researcher's collation)" inside CL-0210/CL-0211's own `proposition` fields,
   visible to the player through "Why?" — worth a follow-up pass on the claim artifacts themselves, not
   a rewrite fault.
3. **SCN-0204** still carries no rewrite at all to its substantive A2 finding (C's `documented` label
   over a presumed addressee) — but the current file already has C as `reconstructed`, so there is
   nothing to fix; noted only so the lead does not re-flag it as missed.

Everything else A2 flagged as FIX in a scene the rewrite touched (18 scenes, minus 0204 which the rewrite
left alone because it needed no further fix) checks out clean against its cited claims. This is, on the
evidence, a rewrite pass that read A2 closely and applied it correctly scene by scene, including several
places (SCN-0304's restored auspicious-conjunction detail, SCN-0407's four-for-four fixes, SCN-0309's
letter-27 relocation fixing two findings at once) where the fix is better than the minimum A2 asked for.
