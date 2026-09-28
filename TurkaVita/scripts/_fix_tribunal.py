#!/usr/bin/env python3
# one-off (2026-09-27): bring v2/apps/tribunal/trials.json up to the current information
# (TurkaVita/docs/TURKA_AUDIT.md rows A.3 and B "The inquisitions"): dates for the trials as MK's timeline
# gives them, "three trials" as his phrase, and the refusal claim ("what he actually did") replaced by the
# disagreement between the Prologue's uncited remark and the dissertation's two apologies.
import io, json, os, sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = os.path.join(ROOT, "v2", "apps", "tribunal", "trials.json")
d = json.loads(io.open(p, encoding="utf-8").read())

d["_note"] = (
    "The Tribunal: three trials, and you are Ibn Turka. WHAT IS ATTESTED (docs/BIOGRAPHY.md, corrected 2026-09-27 to Melvin-Koushki's 2012 dissertation): "
    "he was a judge known for defending the weak against the powerful; Melvin-Koushki writes of his 'three trials' (dissertation, fn. 99) and never lists them together, "
    "but his timeline and text date an accusation of Sufi bias at Shahrukh's court c. 1422, a second summons to Herat in 1426 (when he wrote his first apology), and the arrest, "
    "torture, imprisonment and exile that followed Ahmad-i Lur's attempt on Shahrukh in 1427 -- reading those as 'the three' is this project's, not his; he won the first two and lost the third; "
    "for much of the next five years he wandered, and he died in Herat in 1432, impoverished and in limbo; his companion Qasim-i Anvar was arrested in the same 1427 purge. "
    "WHERE THE SOURCES DISAGREE: whether he refused to answer. The Prologue says he 'would refuse to bend the knee during his three inquisitions' (uncited there); "
    "the dissertation's evidence is that he answered: two apologies, written to Shahrukh (1426) and to Baysunghur (c. 1429-32), both 'produced under great duress'. "
    "Refusal is a real outcome in this game because the Prologue says so, not because the record shows it. "
    "WHAT IS NOT ATTESTED, and is therefore ours: the CONTENT of the charges, the courts' identities, the demands, and every word anyone says. The sources record that the trials happened and how they came out, "
    "not what was argued. Each trial says so on its own face.")

d["how_it_works"]["refusal"] = (
    "You may always refuse to answer. The charge is then unproven -- you are neither convicted nor cleared -- and it costs standing. "
    "Whether he did this is disputed in the sources: the Prologue says he would refuse to bend the knee; the dissertation shows him answering in two apologies. "
    "Here it is a real outcome, not a claim about what he did.")

d["refusal"] = {
    "austere": "You decline to answer. The charge is not disproved and you are not cleared; it stands unproven, and standing is spent to hold that line. The sources differ on whether he did this: per Melvin-Koushki's Prologue, Ibn Turka \"would refuse to bend the knee during his three inquisitions, despite the danger and punishing consequences\" (uncited there); the dissertation's evidence is two apologies he wrote to the rulers judging him.",
    "baroque": "You decline. Not cleared, not convicted: the charge simply stands there unproven while you spend your standing to keep it from becoming anything else. Whether the man himself ever did this is a real quarrel in the scholarship. The <i>Prologue</i> says he <i>would refuse to bend the knee during his three inquisitions, despite the danger and punishing consequences</i>, without saying where it comes from; the dissertation, by contrast, has him writing two apologies to the men who judged him. Both are Melvin-Koushki. Neither is settled.",
    "uncanny": "You do not answer. The charge does not go away. It waits, unproven, and something is spent to keep it waiting. Whether he did this is not settled: one text says he would never bend; another shows him writing two apologies.",
    "warm": "You have chosen not to answer, and it is worth being clear about what that means here. The charge is not disproved (you are not cleared), but neither are you convicted. It stays unproven, and you spend standing to keep it that way. This is a real outcome in the game, but not a claim that Ibn Turka did it: Melvin-Koushki's Prologue says he \"would refuse to bend the knee during his three inquisitions, despite the danger and punishing consequences\" without a source, while his dissertation shows him answering in two apologies. The sources differ, and the game leaves that difference open.",
}

d["endings"]["cleared"] = {
    "austere": "Three charges answered. What Melvin-Koushki's timeline and text record is that he won the first two hearings (c. 1422 and 1426) and lost the third: after Aḥmad-i Lur's attempt on Shāhrukh in 1427 he was stripped, tortured, imprisoned and exiled; for much of the next five years he wandered, and he died in Herat in 1432, impoverished and in limbo. Qāsim-i Anvār was arrested in the same 1427 purge. Reading these as \"the three\" is this project's, not his. You have done better than the record. The record is the record.",
    "baroque": "Three for three, and now the part the game cannot let you keep. He won the first two hearings, c. 1422 and 1426. The third came after Aḥmad-i Lur's attempt on Shāhrukh in 1427, and it took everything: stripped, tortured, imprisoned, exiled; five years of wandering; death in Herat in 1432, impoverished, in limbo, his masterpiece effectively on the Index for centuries. Qāsim-i Anvār was swept up in the same purge, which tells you it was never really about the argument. (That these are \"the three\" is our reading of Melvin-Koushki, who never lists them.) You beat the record. The record still stands.",
    "uncanny": "All three answered. He answered two, and won them: c. 1422, 1426. The third went the other way, in 1427, and then five years of wandering, and then 1432 in Herat. His companion was arrested in the same purge. You did better. It changed nothing.",
    "warm": "You answered all three, which is better than what happened. Here is the record as Melvin-Koushki gives it, so you know what you were playing against: Ibn Turka won the first two hearings (c. 1422 and 1426) and lost the third, in the purge that followed Aḥmad-i Lur's attempt on Shāhrukh in 1427: he was stripped of his post and property, tortured, imprisoned and exiled. For much of the next five years he wandered, and he died in Herat in 1432, impoverished and in limbo; his major work went largely unread for centuries. Qāsim-i Anvār was arrested in the same purge, which suggests the trials were about the network, not the arguments. (Calling these three \"the three\" is this project's reading; Melvin-Koushki writes of three trials and never lists them.)",
}
d["endings"]["exiled"] = {
    "austere": "The charges hold. Exile follows: for much of five years he wandered, and he died in Herat in 1432, impoverished and in limbo. That is what followed the 1427 purge, and it is what happens here.",
    "baroque": "They hold. And so the thing unfolds as it actually unfolded: exile, five years of wandering, and in 1432 a death in Herat in poverty and limbo, with the <i>Mafāḥiṣ</i>, the most philosophically systematic formulation of lettrism ever penned, going quietly onto the shelf for the next several centuries. Rivals: one. Isfahan: nil.",
    "uncanny": "The charges hold. Then exile, five years of it, and 1432. The book was not read again for a very long time.",
    "warm": "The charges have held and this run ends in exile, which is also how the history ends: after the purge of 1427 Ibn Turka was stripped of his post, wandered for much of five years, and died in Herat in 1432, impoverished and in limbo. You can start again, and it is worth trying the refusal at least once, because whether he refused is the real quarrel: one of Melvin-Koushki's texts says he did, and another shows him answering.",
}

for t in d["trials"]:
    t["sources"] = [
        s.replace("three inquisitions, engineered by rival colleagues; he won the first two",
                  "three trials (MK), engineered by rival colleagues; he won the first two (c. 1422 and 1426, this project's reading)")
         .replace("the third inquisition is the one he loses, c. 1427",
                  "the third trial (1427, the purge after Aḥmad-i Lur's attempt) is the one he loses")
        for s in t["sources"]]

io.open(p, "w", encoding="utf-8", newline="\n").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
print("trials.json corrected")
