#!/usr/bin/env python3
# one-off generator for research/artifacts/institutions/INS-*.json (the court board's positions).
# Every summary paraphrases the evidence it cites; supported_by is that evidence.
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "research", "artifacts", "institutions")
os.makedirs(OUT, exist_ok=True)

I = [
    ("TEMUR", "Temür (Tamerlane)", "Temür", "Samarkand", "1370–1405", "context",
     "Takes Isfahan in 1387 and massacres most of its people, but spares the Turka family and takes it to his court at Samarkand, where the elder brother is made qadi. Dies at Utrar in 1405.",
     ["EV-0003", "EV-0004", "EV-0005", "EV-0012"]),
    ("BARQUQ", "The Mamluk court of Sultan Barqūq", "al-Ẓāhir Barqūq (r. 1382–99)", "Cairo", "1382–1399", "patron",
     "Sultan whose court kept the alchemist and wonderworker Akhlāṭī; Ibn Turka implies he attended its scholarly majlises, and the sultan once pressed him for his opinion of another scholar.",
     ["EV-0096", "EV-0097", "EV-0101"]),
    ("PIR-MUHAMMAD", "Pīr-Muḥammad b. ʿUmar-Shaykh", "Pīr-Muḥammad, Temür's grandson", "Shiraz", "c. 1408–1409", "patron",
     "Governor of Fars who summons Ibn Turka from a quiet teaching life in Isfahan and makes him a member of his court; murdered in 1409.",
     ["EV-0015", "EV-0016", "EV-0132"]),
    ("ISKANDAR", "The court of Iskandar Mīrzā", "Iskandar b. ʿUmar-Shaykh", "Shiraz, then Isfahan", "1409–1414", "patron",
     "Takes his brother's place in Fars and builds a brilliant court at Isfahan; Ibn Turka is a member, presumably with a teaching post and judgeship, and may have written the R. Ḥurūf for him. Captured, blinded and later executed by Shāhrukh in 1414.",
     ["EV-0017", "EV-0022", "EV-0023", "EV-0024", "EV-0026"]),
    ("SHAHRUKH", "Shāhrukh b. Temür, the court at Herat", "Shāhrukh", "Herat", "1397–1447 (governor of Khurasan from 1397)", "judge",
     "The ruler who enforces the Sharīʿa and closes the taverns, before whom Ibn Turka is accused, twice wins favour, and is finally stripped, tortured and exiled. Ibn Turka spends his last months in weekly attendance at this court awaiting review.",
     ["EV-0010", "EV-0019", "EV-0031", "EV-0036", "EV-0039", "EV-0048"]),
    ("BAYSUNGHUR", "Bāysunghur b. Shāhrukh", "Bāysunghur", "Herat", "governor from 1415; d. 1433", "addressee",
     "Shāhrukh's son, for whom Ibn Turka writes the R. Suʾl al-Mulūk and to whom he addresses the second apology, seeking his intercession with the sultan.",
     ["EV-0028", "EV-0035", "EV-0051", "EV-0166"]),
    ("ULUGH-BEG", "Ulugh Beg and the Samarkand observatory", "Ulugh Beg", "Samarkand", "1420s–1430s", "recipient",
     "Recipient, per the timeline, of a copy of the Sharḥ al-Basmala; the manuscript carries a marginal dedication to him. Qāżīzāda Rūmī, Ibn Turka's associate, is the second director of his observatory.",
     ["EV-0035", "EV-0074", "EV-0615"]),
    ("FIRUZSHAH", "Amīr Jalāl al-Dīn Fīrūzshāh", "Amīr Fīrūzshāh", "Isfahan and Fars", "letters c. 1413–1427", "ally",
     "An amir to whom Ibn Turka writes six letters, from the years of Iskandar to the year of his fall, including a petition for redress after the arrest; his family is given the governorship of Isfahan in 1423–24.",
     ["EV-0033", "EV-0040", "EV-0819", "EV-0826", "EV-0840"]),
    ("MARASHI", "Sayyid Murtażā Marʿashī, ruler of Sari", "Sayyid Murtażā Marʿashī", "Sari, Mazandaran", "1417–1433", "patron",
     "One of the exile courts at which he sought patronage; letter 28 is a pained account of his tribulations addressed to this ruler.",
     ["EV-0041", "EV-0161", "EV-0848"]),
    ("KARKIYA", "The Kārkiyā sayyids of Gilan", "Sayyids Aḥmad and Nāṣir Kārkiyā", "Ranikuh and Lahijan, Gilan", "letters c. 1428–29", "patron",
     "The other exile court he tried: letters 29–32 congratulate the amirs on conquests and praise their patronage of scholars and Sufis.",
     ["EV-0041", "EV-0161", "EV-0849", "EV-0851"]),
    ("SHAH-RAZI-AL-DIN", "Shāh Rażī l-Dīn of Mazandaran", "Shāh Rażī l-Dīn", "Mazandaran", "1428", "patron",
     "The person for whom Ibn Turka wrote the R. Mabdaʾ u Maʿād in exile.",
     ["EV-0044"]),
    ("ALA-AL-DIN", "ʿAlāʾ al-Dīn b. Bāysunghur", "ʿAlāʾ al-Dīn b. Bāysunghur", "Herat court", "1428", "patron",
     "The dedicatee of the R. Tuḥfa-yi ʿAlāʾī, written in exile.",
     ["EV-0042"]),
    ("AKHLATI", "Sayyid Ḥusayn Akhlāṭī", "Sayyid Ḥusayn Akhlāṭī", "Cairo", "d. 1397", "teacher",
     "The Kurdish occultist and rumoured mahdi, resident alchemist and wonderworker at Barqūq's court, master of jafr, raml, ḥurūf and taksīr, whose discipleship transformed Ibn Turka; he never names him, only 'our Sayyid'.",
     ["EV-0009", "EV-0100", "EV-0101", "EV-0103"]),
    ("YAZDI", "Sharaf al-Dīn ʿAlī Yazdī", "Sharaf al-Dīn ʿAlī Yazdī", "Herat, Shiraz, Samarkand", "d. 1454", "ally",
     "His closest friend and pupil, said to have accompanied him abroad; he checked early copies of the Mafāḥiṣ and attended teaching on it, and named Ibn Turka his teacher in occultism.",
     ["EV-0006", "EV-0092", "EV-0118", "EV-0149"]),
    ("NIMAT-ALLAH", "Shāh Niʿmat Allāh Valī", "Niʿmat Allāh Valī (d. 1431)", "Kirman", "d. 834/1431", "ally",
     "Sufi master and lettrist; warm relations with Ibn Turka are confirmed by the letters, including one to Shāhrukh answering a summons that Niʿmat Allāh was to convey; Niʿmatullahi hagiographers credit him with sending Ibn Turka and Yazdī to Akhlāṭī.",
     ["EV-0127", "EV-0128", "EV-0129", "EV-0130"]),
    ("JAZARI", "Shams al-Dīn Muḥammad al-Jazarī", "al-Jazarī", "Damascus, Cairo, Fars, Herat", "d. 1429", "enemy",
     "Scholar whom Barqūq asked Ibn Turka about, and whose enmity later caused him much grief, as Ibn Turka tells it; dies at Herat in 1429.",
     ["EV-0045", "EV-0097", "EV-0227", "EV-0229"]),
    ("QAZIZADA", "Qāżīzāda Rūmī", "Qāżīzāda Rūmī", "Samarkand", "d. 1432", "ally",
     "Astronomer and mathematician, second director of Ulugh Beg's observatory, a member of Ibn Turka's circle to whom he sent a copy of the Sharḥ al-Basmala.",
     ["EV-0074", "EV-0124", "EV-0125"]),
]

for slug, name, ruler, seat, tenure, role, summary, ev in I:
    ev = [e for e in ev]
    a = {"id": "INS-" + slug, "type": "institution", "status": "draft", "name": name, "ruler": ruler, "seat": seat,
         "tenure": tenure, "role": role, "summary": summary, "supported_by": ev}
    json.dump(a, io.open(os.path.join(OUT, a["id"] + ".json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(len(I), "institutions written")
