#!/usr/bin/env python3
# one-off generator for Act VI, the historian's desk (SCN-0601 .. SCN-0605). The dossier entries each
# choice collects are evidence artifacts that the HYP bearings actually read, grouped by the KIND of
# witness, so the player's pile decides which positions can be supported (and by what kind of witness).
import io, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import narrative_lib as nl

ROOT = nl.ROOT
arts, hyps = nl.load_artifacts(), nl.load_hypotheses()
sup = {}
for a in arts.values():
    if a["type"] == "claim":
        for e in a["supported_by"]:
            sup.setdefault(e, []).append(a["id"])


def claims_for(evs, n=3, prefer_attested=True):
    seen = []
    for e in evs:
        for c in sup.get(e, []):
            if c not in seen and arts[c]["epistemic_type"] in ("attested", "directly_inferred"):
                seen.append(c)
                break
    return seen[:n]


def label_for(claims):
    return "documented" if claims and all(arts[c]["epistemic_type"] in ("attested", "directly_inferred") for c in claims) else "reconstructed"


def pile(evs):
    return {f"dossier.{e}": True for e in evs}


def choice(cid, label, strategy, evs, feedback, extra=None):
    cl = claims_for(evs)
    eff = pile(evs)
    eff.update(extra or {})
    return {"id": cid, "label": label, "strategy": strategy, "epistemic_label": label_for(cl), "based_on": cl,
            "effects": eff, "feedback": feedback}


def dump(s):
    with io.open(os.path.join(ROOT, "narrative", "scenes", s["id"] + ".json"), "w", encoding="utf-8") as f:
        json.dump(s, f, indent=1, ensure_ascii=False)


CONTRACT = {"historical_status": "reconstruction", "invented_dialogue": False, "invented_facts": False}

# ------------------------------------------------------------------------------- 0601 the witnesses to his judges
s601 = {
    "id": "SCN-0601", "type": "scene", "status": "draft", "act": "historian", "unrecorded": True, "show_dossier": True,
    "title": "The desk: what he told his judges",
    "dramatic_question": "You have lived the life; now you have to say who he was. Which witnesses do you open first?",
    "situation": {"when": "the modern dispute", "where": "the desk", "based_on": ["CL-0167", "CL-0101"]},
    "invariants": [
        {"text": "Melvin-Koushki holds that the apologies were produced under great duress: the first answers a summons to trial, the second follows torture, imprisonment and exile.", "claim": "CL-0167"},
        {"text": "Melvin-Koushki opens his chapter on the apologies with an epigraph from John Dee's 1604 petition to the king about slander. That is his comparison; nothing on the page asserts any contact.", "claim": "CL-0101"},
    ],
    "prose": [
        "Nothing here is a moment in his life any more. What you have is what survives: his own words to the rulers who tried him, the letters he wrote to other people, the dates in the manuscript that carries his works, and what others said of him afterwards. Every reading in the dossier will be somebody's.",
        "Most of what we know of his life comes from the two apologies, and that is the pile Melvin-Koushki warns you about: the first was written for the ruler judging him, the second for that ruler's son while the case was open.",
        "Start with what he said to his judges. You may read one group now; you will have two more piles to open."],
    "choices": [
        choice("A", "Read the first apology argument by argument: the nine hadith, the Sufi masters, the accusers' hypocrisy.", "read_apology_I",
               ["EV-0210", "EV-0211", "EV-0258", "EV-0261", "EV-0264", "EV-0279", "EV-0280"],
               "You now hold seven of the moves Melvin-Koushki reports from Nafsat al-Maṣdūr I. Notice what they are for: each is an argument to Shāhrukh. On Melvin-Koushki's duress reading, what these readings show is what he told the ruler."),
        choice("B", "Read the creed tracts and the second apology, written in exile to Bāysunghur.", "read_creeds_and_II",
               ["EV-0212", "EV-0237", "EV-0463", "EV-1257", "EV-1260", "EV-1273", "EV-1275"],
               "This is the angrier witness, and the creeds. The Iʿtiqādiyya admits youthful learning at odds with orthodoxy that Nafsat I claims he never had; Melvin-Koushki does not draw this contrast; it is the game's observation. Both are addressed to power."),
        choice("C", "Read only the passages where Melvin-Koushki himself says what the apologies cannot show.", "read_the_warning",
               ["EV-0158", "EV-0236", "EV-0210"],
               "A short pile, and an honest one. He does not say the apologies are false; he says they were written under duress and are 'hardly reflective of his primary concerns'. Whether that is enough to set them aside is what the desk will ask."),
    ],
    "next": "SCN-0602", "epistemic_contract": CONTRACT}
dump(s601)

# ------------------------------------------------------------------------------- 0602 what he wrote freely
s602 = {
    "id": "SCN-0602", "type": "scene", "status": "draft", "act": "historian", "unrecorded": True, "show_dossier": True,
    "title": "The desk: what he wrote freely",
    "dramatic_question": "What did he write that was not addressed to a judge, and what can it carry?",
    "situation": {"when": "the modern dispute", "where": "the desk", "based_on": ["CL-0167"]},
    "invariants": [
        {"text": "Melvin-Koushki holds that the apologies were produced under great duress; the works, letters and manuscripts are the other kinds of witness.", "claim": "CL-0167"}],
    "prose": [
        "There is a second kind of witness: what he wrote for other purposes. His treatises, argued at length. His letters to friends, patrons and petitioned governors. The colophons and audition notes in the manuscript that carries his works. And the verse his enemies said they found in his youthful works.",
        "These are not free of shaping. A letter begs; a colophon date may record a copyist's day and not the author's; a treatise is written for a prince. But most of them were not written to convince the man who could imprison him that he was orthodox, and that is the difference the duress rule is about.",
        "Open one group."],
    "choices": [
        choice("A", "Read what the treatises argue: the seven tiers, the lettrists above the philosophers, the Tamhīd's silence on lettrism.", "read_works",
               ["EV-1036", "EV-1037", "EV-1651", "EV-1003", "EV-1006", "EV-1625", "EV-1654", "EV-0671", "EV-0625", "EV-0689", "EV-0507", "EV-0494", "EV-1669"],
               "Thirteen readings from his works. Here he ranks the groups who read a single verse and puts the lettrists sixth and ʿAlī and the Imams seventh, in a treatise dated 1426 (a date that may record copying), the year of the first apology. Melvin-Koushki reads the seventh tier as not simply the Imams; the plain reading is the rival."),
        choice("B", "Read his letters and the colophons of the manuscript: what he asked for, whom he thanked, when copies were made.", "read_letters_colophons",
               ["EV-0126", "EV-0814", "EV-0815", "EV-0839", "EV-0857", "EV-0868", "EV-0415", "EV-0466", "EV-0482", "EV-0513", "EV-1243", "EV-1234", "EV-0865"],
               "Thirteen readings, and a warning: the letters are a supplicant's, and MK cautions that the colophon dates may record copying and that much of the manuscript was copied in 1425–27, perhaps as evidence in his defence."),
        choice("C", "Read the verse his enemies cited, the autograph pages and his teacher's letter: what predates or stands beside the accusations.", "read_early_and_autograph",
               ["EV-0153", "EV-0419", "EV-0420", "EV-0063", "EV-0360", "EV-0362", "EV-0363", "EV-0364", "EV-0681"],
               "Nine readings from before or beside the accusations, including the verse his enemies cited and the pages in his own hand. It is also the thinnest pile, and the verse comes to us only through a nineteenth-century chronicler's report of what his enemies claimed to find."),
    ],
    "next": "SCN-0603", "epistemic_contract": CONTRACT}
dump(s602)

# ------------------------------------------------------------------------------- 0603 what others said
s603 = {
    "id": "SCN-0603", "type": "scene", "status": "draft", "act": "historian", "unrecorded": True, "show_dossier": True,
    "title": "The desk: what others said of him",
    "dramatic_question": "Other people described him afterwards. How much of that is him?",
    "situation": {"when": "the modern dispute", "where": "the desk", "based_on": ["CL-0167"]},
    "invariants": [
        {"text": "Melvin-Koushki holds that the apologies were produced under great duress; later chroniclers, hagiographers and scholars report on him at a distance.", "claim": "CL-0167"}],
    "prose": [
        "The third pile is what other people made of him: Ibn Ḥajar on his teacher's house, the Niʿmatullahi and Ḥurūfī hagiographers, Dawlatshāh, Jāmī, who left him out of his *Nafaḥāt*, and the modern scholars who read him as a Shiʿi, a Sufi or a philosopher.",
        "None of these can show what he held. They can show how he was seen, and the seeing was often done by people with a purpose: a Sufi order that wanted him, a biographer who did not. Melvin-Koushki is translating most of them, and some are marked as hostile.",
        "Open one group."],
    "choices": [
        choice("A", "Read the chroniclers and hagiographers: Ibn Ḥajar, Dawlatshāh, the Niʿmatullahi and Ḥurūfī reports.", "read_chroniclers",
               ["EV-0104", "EV-0106", "EV-0152", "EV-0168", "EV-1214", "EV-1657", "EV-1674", "EV-1201", "EV-1204", "EV-1264", "EV-1265", "EV-0093"],
               "Twelve readings, from people who were not there and often had a reason. A chronicler's account of a teacher's house, a hagiographer's claim that a master sent him east: each shows how a later writer saw him, and some of them had a purpose."),
        choice("B", "Read the modern scholars' readings of him: the Shiʿi philosopher, the mystic, the Sufi poet.", "read_scholars",
               ["EV-1600", "EV-1602", "EV-1607", "EV-1609", "EV-1610", "EV-1613", "EV-1615", "EV-1616", "EV-1617", "EV-0672", "EV-0673", "EV-1683"],
               "Twelve readings, and every one is a scholar's. Most lean on the Tamhīd, which Melvin-Koushki says was strictly secondary in Ibn Turka's own estimation, and he is a partisan in reporting them."),
        choice("C", "Read how the Ḥurūfī purge and Jāmī's circle saw him: the label used against him, and the disdain of a hostile biographer.", "read_hostile",
               ["EV-1247", "EV-1254", "EV-1291", "EV-1655", "EV-1670", "EV-0330"],
               "Six readings from those who were hostile or threatened. They show what the prosecution's reading looked like and where it came from; they are the least able of all the piles to show what he himself held."),
    ],
    "next": "SCN-0604", "epistemic_contract": CONTRACT}
dump(s603)

# ------------------------------------------------------------------------------- 0604 the lens
lens_rows = [("Henry Corbin", "HYP-A", "lens_corbin", "Henry Corbin. Read him as a Shiʿi esotericist, and take the seventh tier at its word."),
             ("Leonard Lewisohn", "HYP-B", "lens_lewisohn", "Leonard Lewisohn. Take the apologies at face value, as the record of an orthodox Sunni Sufi."),
             ("Matthew Melvin-Koushki", "HYP-D", "lens_mk", "Matthew Melvin-Koushki. Call him an occult philosopher and an imamophile, and read the apologies as what he told his judges, not what he held."),
             ("the prosecution at Herat", "HYP-E", "lens_prosecution", "The prosecution at Herat. The prosecution's reading, which is the game's reconstruction (no source shows what the arresters reasoned), with Khwāfī's label for his circle."),
             ("Matthew Melvin-Koushki (methodological caveat)", "HYP-F", "lens_caveat", "Melvin-Koushki as methodologist. Ask what the evidence can carry before asking what it says.")]
rec_for = {}
for hid, h in hyps.items():
    for p in h.get("proponents", []):
        rec_for.setdefault(hid, []).extend(p.get("cites", []))
lens_choices = []
for i, (who, hid, slug, text) in enumerate(lens_rows):
    ev = next(b["evidence"] for b in hyps[hid]["bearings"] if b["attributed_to"] == who)
    based = [r for r in rec_for.get(hid, []) if r in arts][:2] or claims_for([ev], 1)
    lens_choices.append({
        "id": "ABCDE"[i], "label": text, "strategy": slug, "epistemic_label": "reconstructed", "based_on": based,
        "effects": {"lens": who, f"dossier.{ev}": True},
        "feedback": {
            "Henry Corbin": "Under this lens only the readings Corbin makes show. He is on the board for the assumption Melvin-Koushki attributes to him, a standard-issue Shiʿi esotericist, and for his study of the Shaqq-i Qamar, so the ledger is thin: the lens subtracts most of the pile.",
            "Leonard Lewisohn": "Under this lens the apologies count. It is the only lens that does, and Melvin-Koushki grants the face-value insistence is well-taken while calling the result a misrepresentation. Remember what kind of witness the apologies are.",
            "Matthew Melvin-Koushki": "The widest of the scholars' lenses, and the project's own source. It is a partisan lens; he is reporting the rivals as well as arguing his case. The game does not treat it as the answer.",
            "the prosecution at Herat": "The prosecution's reading is the game's reconstruction: the sources do not say what tied him to the Ḥurūfiyya, and Khwāfī, whose label for the circle is used, was an establishment Sufi, not one of the arresters. No modern scholar holds this reading, and Melvin-Koushki argues Ibn Turka himself dismissed the Ḥurūfīs.",
            "Matthew Melvin-Koushki (methodological caveat)": "His lens mostly subtracts. The study is provisional; half the oeuvre is unedited; the apologies were written under duress. He does not conclude the question cannot be decided, but his caveats are on the record."}[who]})
lens_choices.append({
    "id": "F", "label": "No lens. Count every reading on the table, including the ones that cancel.", "strategy": "lens_none",
    "epistemic_label": "unknown", "based_on": ["CL-0167"], "effects": {"lens": "all", "profile.uncertainty_tolerance": 1},
    "feedback": "The widest view, and usually the flattest ledger. Reading everybody does not produce certainty here; it produces a smaller margin."})
s604 = {
    "id": "SCN-0604", "type": "scene", "status": "draft", "act": "historian", "unrecorded": True, "show_dossier": True,
    "title": "The desk: whose eyes?",
    "dramatic_question": "The same dossier reads differently depending on whose eyes you borrow. Whose?",
    "situation": {"when": "the modern dispute", "where": "the desk", "based_on": ["CL-0167"]},
    "invariants": [{"text": "Melvin-Koushki holds that the apologies were produced under great duress and are hardly reflective of his primary concerns.", "claim": "CL-0167"}],
    "prose": [
        "Every reading in your dossier is somebody's. Take a lens and the ledger recounts itself using only the readings that scholar actually makes; the evidence does not move, the standings do.",
        "That is not a trick of the interface. It is what the dispute is: one pile of data, and six ways of taking it. Look at the ledger before you choose, and again after."],
    "choices": lens_choices, "next": "SCN-0605", "epistemic_contract": CONTRACT}
dump(s604)

# ------------------------------------------------------------------------------- 0605 the commitment
letters = {"A": "HYP-A", "B": "HYP-B", "C": "HYP-C", "D": "HYP-D", "E": "HYP-E", "F": "HYP-F"}
opts = [{"hypothesis": hid, "label": f"{h['letter']}. {h['name']}"} for hid, h in sorted(hyps.items())]
fb = {
    "coherent": "You named the position your own readings lean to. That is consistency, not truth: the same commitment is incoherent under another lens.",
    "incoherent": "You named a position your dossier does not lean to. You may have good reasons; they are not in the dossier you built.",
    "calibrated_unknown": "Your dossier does not separate the leaders, and you said so. On this literature that is often the accurate report.",
    "over_caution": "Your dossier does lean somewhere, and you declined to say. Not knowing is a position, but it is priced when the evidence does not require it.",
    "false_certainty": "Nothing in your dossier separates the leaders, and you committed to a position that says what he actually held. That is more than the evidence you gathered can carry.",
    "non_conviction": "You committed to a position that does not say what he held, on a dossier that does not separate the leaders. Consistent, but not the report the dossier supports.",
    "coerced_testimony": "This position claims to know what he held, and everything that leans toward it in your dossier is something he said to his judges, or something said of him. An apology can show what he told whom. Melvin-Koushki makes the point himself.",
    "empty_dossier": "You committed to a position without reading anything. That is a guess, and the game charges it as one."}
s605 = {
    "id": "SCN-0605", "type": "scene", "status": "draft", "act": "historian", "unrecorded": True, "show_dossier": True,
    "title": "The desk: who was he?",
    "dramatic_question": "You have read what you read. Commit, in print, to who Ibn Turka was, or to what the record can say.",
    "situation": {"when": "the modern dispute", "where": "the desk", "based_on": ["CL-0167", "CL-0101"]},
    "invariants": [
        {"text": "Melvin-Koushki holds that the apologies were produced under great duress: the first answers a summons to trial, the second follows torture, imprisonment and exile.", "claim": "CL-0167"},
        {"text": "Melvin-Koushki opens his chapter on the apologies with an epigraph from John Dee's 1604 petition to the king about slander. That is his comparison; nothing on the page asserts any contact.", "claim": "CL-0101"}],
    "prose": [
        "The game does not know who he was, and the scholars disagree. Melvin-Koushki calls him an occult philosopher and an imamophile; others read him as a Shiʿi esotericist, an orthodox Sunni Sufi, a mystical philosopher; and a reading the game builds from the purge of 1427 takes him for a Ḥurūfī sympathiser. Each is somebody's reading, and each leans on a different kind of witness.",
        "You are not scored on being right. You are scored on whether what you say fits the dossier you actually built, and on whether you claimed to know what he held from evidence that could not carry it."],
    "rulings": [{
        "id": "R1", "proposition": "Melvin-Koushki treats the apologies as the primary source for the biography of Ibn Turka, but not as a guide to his primary concerns.",
        "answer": "stand", "based_on": ["CL-0167", "CL-0100"],
        "effects_correct": {"score.calibration": 1}, "effects_wrong": {"score.calibration": -1},
        "feedback": "That is his position: he builds his account of the life on them and holds that they were produced under great duress and are hardly reflective of his primary concerns. The game's duress rule is his position, adopted as a rule of the game; it is not a finding about who Ibn Turka was."}],
    "commitment": {"question": "Who was Ibn Turka?", "options": opts, "underdetermined_option": "HYP-F",
                   "scoring": {"coherent": {"score.calibration": 1}, "incoherent": {"score.calibration": -1},
                               "calibrated_unknown": {"score.calibration": 3}, "over_caution": {"score.calibration": -1},
                               "false_certainty": {"score.calibration": -3}, "non_conviction": {"score.calibration": 1},
                               "coerced_testimony": {"score.calibration": -2}, "empty_dossier": {"score.calibration": -1}},
                   "feedback": fb},
    "choices": [
        {"id": "A", "label": "Close the book by saying what you can show, and what the record cannot.", "strategy": "close_calibrated",
         "epistemic_label": "unknown", "based_on": ["CL-0167"], "effects": {"score.calibration": 1, "profile.uncertainty_tolerance": 1},
         "feedback": "A book about a man whose main witness is himself, writing to his judges, has to say so. This is the honest ending and not the only one."},
        {"id": "B", "label": "Close the book with one sentence saying who he was, the way your dossier leans.", "strategy": "close_confident",
         "epistemic_label": "reconstructed", "based_on": ["CL-0167"], "effects": {"score.calibration": -1, "profile.speculative_leap": 1},
         "feedback": "A lean is a count of readings you happened to collect, not a finding."},
        {"id": "C", "label": "Close the book with Melvin-Koushki's own epigraph, and say it is his comparison and no one's history.", "strategy": "close_epigraph",
         "epistemic_label": "documented", "based_on": ["CL-0101"], "effects": {"score.calibration": 1},
         "feedback": "He sets a Renaissance magus's petition against a Timurid judge's apology as a comparison. Nothing on the page says the two men knew of each other, and the game will not say so either."}],
    "next": "END", "epistemic_contract": CONTRACT}
dump(s605)
print("Act VI written: 5 scenes")
