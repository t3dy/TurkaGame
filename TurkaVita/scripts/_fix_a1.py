#!/usr/bin/env python3
# one-off: apply the AUDIT-A1 fixes (research/notes/AUDIT-A1-evidence.md). The lead is the single writer here.
import io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "research", "artifacts")


def path(i):
    for sub in ("evidence", "claims", "works", "events"):
        p = os.path.join(A, sub, i + ".json")
        if os.path.exists(p):
            return p
    if i.startswith("CL-"):
        return os.path.join(A, "claims", i + ".json")
    raise SystemExit("missing " + i)


def load(i):
    with io.open(path(i), encoding="utf-8") as f:
        return json.load(f)


def save(a):
    with io.open(path(a["id"]), "w", encoding="utf-8") as f:
        json.dump(a, f, indent=1, ensure_ascii=False)


# 1. mislabelled in the HELD direction
for i in ["EV-0806", "EV-1659"]:
    a = load(i)
    a["evidence_kind"] = "scholarly_argument"
    save(a)
for i in ["EV-0011", "EV-0013", "EV-0020", "EV-0026", "EV-0027", "EV-0030", "EV-0032", "EV-0034", "EV-0035", "EV-0037",
          "EV-0038", "EV-0042", "EV-0044", "EV-0047"]:
    a = load(i)
    if a["evidence_kind"] == "colophon":
        a["evidence_kind"] = "scholarly_argument"     # the timeline footnote does not say which dates rest on colophons
        a["content"] = a["content"] if "MK does not say" in a["content"] else a["content"]
        save(a)

a = load("CL-0822")
a["mediation"] = [m for m in a.get("mediation", []) if "duress rule counts" not in json.dumps(m, ensure_ascii=False)]
save(a)

# 2. CL-0148: the charge is known only through Nafsat I
a = load("CL-0148")
a["mediation"] = [{"layer": "event", "who": "the accusation of ṣūfīgarī before Shāhrukh"},
                  {"layer": "subject_self_report", "who": "Ibn Turka, Nafsat al-Maṣdūr I, addressed to Shāhrukh", "where": "Nafsat I",
                   "shaping_risk": "high", "note": "the charge is known only from his own answer to it"},
                  {"layer": "modern_interpretation", "who": "Melvin-Koushki, dissertation (2012)", "where": "pdf p.76",
                   "shaping_risk": "medium", "note": "'no doubt meant' is MK's inference about the accusers' intent"}]
save(a)

# 3. CL-0232 becomes two claims: what is attested, and MK's hedge
a = load("CL-0232")
old = a["proposition"]
a["proposition"] = ("The al-Khaṣāʾiṣ is referred to in the K. al-Manāhij as a fuller work on logic with a wider frame of reference than the "
                    "peripatetic; it is unpublished and no manuscript copies are known to survive.")
a["epistemic_type"] = "attested"
save(a)
b = dict(a)
b["id"] = "CL-0239"
b["proposition"] = "Melvin-Koushki: the al-Khaṣāʾiṣ does not seem ever to have been finished (his hedge)."
b["epistemic_type"] = "directly_inferred"
b["confidence"] = "medium"
save(b)

# 4. works: rule 7 (a date that may be transcription is never stated as composition), one standard
for i, basis in (("WRK-MAFAHIS", None), ("WRK-NAFSAT-AL-MASDUR-I", None), ("WRK-KHASAIS", None)):
    a = load(i)
    if i == "WRK-MAFAHIS":
        a["date_kind"] = "conjectured"
        a["date"]["basis"] = (a["date"].get("basis", "") + " | AUDIT A1: a marginal correction says the Majlis colophon date refers to copying only, so the date is not stated as composition.").strip(" |")
    elif i == "WRK-NAFSAT-AL-MASDUR-I":
        a["date_kind"] = "conjectured"
        a["date"]["basis"] = ("MK: 'completed on 8 Rajab 829/16 May 1426 in Herat' (no asterisk). The Majlis colophon may record copying (MK's first-half caveat, pdf p.96); "
                              "the same standard as WRK-MAFAHIS.")
    else:
        a["date"]["basis"] = ("no date given; referred to in the K. al-Manāhij (completed 833/1430 per the timeline); MK: it does not seem ever to have been finished; "
                              "the R. Ḥurūf's Khaṣāyiṣ-i Kamālī is presumably a different work.")
    save(a)
print("A1 fixes applied")
