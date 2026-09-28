# DESIGN: the game as built

The proposal is `../docs/PLAN_TURKA_VITA_GAME.md`; the audit of what the sources allow is `TURKA_AUDIT.md`.
This file says what was built, and where it differs from the plan.

## The shape

Six acts, 34 scenes, one path that follows the record and a margin of choices around it.

| act | you are | scenes | fixed points (invariants) | the margin |
|---|---|---|---|---|
| I. Hostage and student, 1387–1408 | Ibn Turka, 18 → ~39 | 0101–0106 | Temür takes Isfahan and spares the family (1387); Akhlāṭī dies (1397); Temür dies (1405) | how to use Samarkand; go abroad or not; Bulqīnī and Akhlāṭī; what you say at Barqūq's majlis (unrecorded); how to carry Akhlāṭī's teaching; the return |
| II. The princes, 1408–1422 | qadi and teacher | 0201–0206 | Pīr-Muḥammad murdered (1409); Iskandar crushed and blinded (1414) | answer the summons; how much of Iskandar's honours; writing for a prince; whom to cultivate among the amirs; retire or stay visible; how to write the *Mafāḥiṣ* |
| III. The trials, 1422–1427 | judge, author, defendant | 0301–0309 | Aḥmad-i Lur's attempt on Shāhrukh (1427) | Herat or not, Isfahan or Yazd; how strictly to apply the law; **the *Suʾl al-Mulūk* (composer)**; the *Shaqq-i Qamar* (rulings); who gets the *Basmala*; the youthful verse; **the first apology (composer)**; what the apology shows (rulings); obey, run or appeal |
| IV. Exile, 1427–1432 | wanderer, ten children | 0401–0407 | al-Jazarī dies (1429); Ibn Turka dies in Herat, 12 Aug 1432 | who to ask first; which household; which commission first; Simnan; Ṣāʾin Qalʿa; **the second apology (composer)**; what to entrust |
| V. The collection, c. 1425–1435 | the unnamed copyist of MS Majlis 10196 | 0501–0503 | the manuscript's real order | what the volume is for; **the ordering puzzle (15 works, Kendall distance to the real folio order)**; whose name the audition certificate carries |
| VI. The historian's desk | a reader of the record | 0601–… | — | which witnesses to read; whose eyes to borrow; **who was he? (commitment)** |

## What is new over PLOTINUSGAME

- **The court board** (`court.<slug>` favour, `press.<kind>` pressure): additive keys, shown as a board, and used as **gates**
  (`requires_min` / `requires_max`): locked options are greyed out with the requirement named. Every gate is reachable, and
  the **historical path is always open** (`tests/test_historical_path.py` walks it with the worst answers a player can give
  that are not choices).
- **The composer**: a work written slot by slot from the moves its source reports (every argument of the first apology is
  its own evidence artifact), with honest alternatives he did not take. Nothing is sent until "Send it".
- **The sorter**: the collection puzzle.
- **The duress rule** replaces the direction-of-transmission rule. `HELD_KINDS = {letter, colophon, autograph, early_work,
  work}`; an apology, creed tract or report cannot support a claim about what he *held*.
- **`historical` and `unrecorded`**: after every choice the game shows what the sources say he did, or that they are silent.
- **A How-to-play panel in full sentences** and a court board reachable from the top bar at all times.

## Scoring

Four bars: **biography** (the record), **works** (`textual`: composer moves, the collection), **doctrine** (rulings only),
**calibration**. Conventions are in `DESIGNER_BRIEF.md`. Biography and calibration pull against each other on purpose.

## Where it differs from the plan

- The plan named nine researcher passes' worth of material; the game uses all of it through `find.py`, not a hand-written summary.
- Act VI is three witness-collecting scenes, a lens, and the commitment, not a longer essay.
- Position E is the prosecution's reading with no modern advocate; F is MK's methodological caveat, not his conclusion; the
  Peripatetic-ishraqi-Akbarian formula is **Cooper's**, not Corbin's (the plan had this wrong; see `TURKA_AUDIT.md` A.10).
- No game text numbers "the third trial": MK never lists the three in one place.
- Act IV's *which work first* scene was cut to three options because the sources give an order only by date.

## Not built

- A save file (a run is one sitting).
- The *Ṭahawī Circle* mini-game and the lettrist-engine bridge. The plan put them behind the slice-3 gate on purpose.
- A Persian edition of the apologies: the 1426 scene uses only the moves Melvin-Koushki reports.
- Deployment. GitHub Pages under the TurkaGame repo is the plan; it has not been pushed.
