#!/usr/bin/env python3
# one-off: derive schemas/artifacts.schema.json from PLOTINUSGAME's. Kept so the fork is auditable.
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = json.load(io.open(r"C:\Dev\PLOTINUSGAME\schemas\artifacts.schema.json", encoding="utf-8"))
s["$id"] = "turkavita/artifacts.schema.json"
s["title"] = "TURKAVITA artifact types"
s["description"] = ("The artifact schema for the Ibn Turka game, forked from PLOTINUSGAME's. One file per artifact; "
                    "the id prefix names the type. Adds work (WRK) and institution (INS), the duress rule "
                    "(evidence_kind, hypothesis commitments.conviction) and court/pressure state on choices.")
d = s["$defs"]
d["id"]["pattern"] = "^(EV|CL|REC|EVT|MOD|SIT|SCN|DEC|HYP|WRK|INS)-[0-9A-Z-]+$"
d["mediation"]["description"] = ("Historiographical provenance, not just source provenance. The chain for Ibn Turka runs from the "
                                 "event through what he himself told the rulers judging him, to his letters, the colophons of the "
                                 "manuscript that carries his works, later chroniclers, Melvin-Koushki, and the game.")
d["mediation"]["items"]["properties"]["layer"]["enum"] = [
    "event", "subject_self_report", "correspondence", "manuscript_colophon", "later_chronicler",
    "modern_interpretation", "game_reconstruction"]
d["citation"]["properties"]["witness_page"]["description"] = "1-based PDF page in corpus.db"
d["citation"]["properties"]["printed_page"]["description"] = "what the book calls the page; the build checks it against the running head"
d["ekind"] = {"enum": ["apology", "creed_tract", "letter", "colophon", "autograph", "early_work", "work", "hagiography",
                       "chronicle", "reception", "scholarly_argument", "context"],
              "description": ("what sort of witness this is. The duress rule reads it: only letter/colophon/autograph/"
                              "early_work/work can show what he HELD; apology and creed_tract were written to his judges.")}
d["date_kind"] = {"enum": ["attested", "colophon", "conjectured", "inferred", "context"],
                  "description": "how the date is known. 'colophon' may be transcription, not composition."}
oneof = s["oneOf"]


def find(t):
    for o in oneof:
        if o["properties"]["type"].get("const") == t:
            return o


ev = find("evidence")
ev["properties"]["evidence_kind"] = {"$ref": "#/$defs/ekind"}
ev["required"].append("evidence_kind")
cl = find("claim")
cl["properties"]["domain"]["enum"] = ["biographical", "doctrinal", "textual", "institutional", "social", "political", "chronological"]
evt = find("event")
evt["properties"]["date"]["properties"]["date_kind"] = {"$ref": "#/$defs/date_kind"}
evt["properties"]["date"]["properties"]["hijri"] = {"type": "string"}
evt["properties"]["fixed_point"] = {"type": "boolean", "description": "an external event the player cannot prevent"}
evt["properties"]["courts"] = {"$ref": "#/$defs/ids"}
sc = find("scene")
sc["properties"]["act"]["enum"] = ["hostage", "courts", "trials", "exile", "copyist", "historian"]
ch = sc["properties"]["choices"]["items"]["properties"]
ch["requires_min"] = {"type": "object", "description": "{key: n} means state[key] >= n (favour, exposure)",
                      "additionalProperties": {"type": "number"}}
ch["requires_max"] = {"type": "object", "description": "{key: n} means state[key] <= n",
                      "additionalProperties": {"type": "number"}}
ch["costs"] = {"type": "array", "items": {"type": "string"}, "description": "plain-language costs shown on the button: who pays what"}
label = {"enum": ["documented", "reconstructed", "contested", "unknown", "counterfactual"]}
sc["properties"]["composer"] = {
    "type": "object",
    "description": "a writing scene: the player assembles a work from the moves the source reports, one slot at a time",
    "required": ["work", "slots"],
    "properties": {
        "work": {"$ref": "#/$defs/id"}, "prompt": {"type": "string"},
        "slots": {"type": "array", "minItems": 1, "items": {
            "type": "object", "required": ["id", "question", "options"],
            "properties": {"id": {"type": "string"}, "question": {"type": "string"},
                           "requires_pick": {"type": "object", "required": ["slot", "options"],
                               "description": "this slot only matters once an earlier slot's pick makes it apply -- e.g. a slot about the shape of a prediction stops mattering once another slot says the work makes no prediction at all. The UI greys the slot out and the engine's effects skip it whenever the named slot's current pick is not one of these options.",
                               "properties": {"slot": {"type": "string", "description": "an earlier slot's id"},
                                              "options": {"type": "array", "items": {"type": "string"}, "description": "the option ids of that slot which keep this one live"}}},
                           "options": {"type": "array", "minItems": 2, "items": {
                               "type": "object", "required": ["id", "label", "epistemic_label", "based_on", "effects"],
                               "properties": {"id": {"type": "string"}, "label": {"type": "string"},
                                              "epistemic_label": label, "based_on": {"$ref": "#/$defs/ids"},
                                              "effects": {"type": "object"}, "feedback": {"type": "string"}}}}}}}}}
sc["properties"]["sorter"] = {
    "type": "object",
    "description": "the collection puzzle: order items; scored by Kendall distance to the order of the real manuscript",
    "required": ["items", "truth", "based_on"],
    "properties": {
        "items": {"type": "array", "items": {"type": "object", "required": ["id", "label"],
                                              "properties": {"id": {"type": "string"}, "label": {"type": "string"}, "note": {"type": "string"}}}},
        "truth": {"type": "array", "items": {"type": "string"}}, "based_on": {"$ref": "#/$defs/ids"},
        "prompt": {"type": "string"}, "scoring": {"type": "object"}}}
sc["properties"]["commitment"]["description"] = (
    "A dispute the player commits to after the rulings and before the choices. The game does not know which position is "
    "right and never scores that. It scores the fit between the commitment and the dossier the player assembled, and it "
    "prices a claim about what he HELD that rests only on testimony given to his judges (the duress rule).")
sc["properties"]["commitment"]["properties"]["scoring"]["description"] = (
    "effects per outcome tag: coherent, incoherent, calibrated_unknown, over_caution, false_certainty, non_conviction, "
    "coerced_testimony, empty_dossier.")
# 2026-09-28: fields the UI renders behind a "More on the sources" toggle (the playtest found the fixed-fact boxes unreadable)
sc["properties"]["invariants"]["items"]["properties"]["detail"] = {
    "type": "string", "description": "the calendar, folio and who-says-what caveats of an invariant: shown behind a toggle so the box stays short"}
sc["properties"]["sorter"]["properties"]["detail"] = {"type": "string", "description": "the caveats behind the sorter's answer key, shown behind a toggle"}

hy = find("hypothesis")
hy["properties"]["commitments"]["required"] = ["conviction"]
hy["properties"]["commitments"]["properties"] = {"conviction": {
    "type": "boolean", "description": "does the position say what he actually held or was? Only the underdetermined position does not."}}
bk = hy["properties"]["bearings"]["items"]["properties"]["kind"]
bk["enum"] = ["apology", "creed_tract", "letter", "colophon", "autograph", "early_work", "work", "hagiography", "chronicle", "reception"]
bk["description"] = "the kind of witness read. Only letter/colophon/autograph/early_work/work can carry a claim about what he held."


def base(t, req, props, title):
    p = {"id": {"$ref": "#/$defs/id"}, "type": {"const": t}, "status": {"$ref": "#/$defs/status"}}
    p.update(props)
    return {"title": title, "type": "object", "required": ["id", "type", "status"] + req, "properties": p}


oneof.append(base("work", ["title", "language", "date_kind", "supported_by"], {
    "title": {"type": "string"}, "transliterated_title": {"type": "string"},
    "language": {"enum": ["Persian", "Arabic", "Persian/Arabic", "unknown"]}, "genre": {"type": "string"},
    "theme": {"enum": ["lettrism", "mystical_philosophy", "philosophy", "logic", "theology", "hadith", "law", "literary",
                       "correspondence", "apology", "other"]},
    "date": {"type": "object", "properties": {"ce": {"type": "string"}, "hijri": {"type": "string"}, "basis": {"type": "string"}}},
    "date_kind": {"enum": ["composition", "transcription", "conjectured", "unknown"],
                  "description": "where the manuscript's date may be the copying and not the writing, it is flagged"},
    "place": {"type": "string"}, "addressee": {"type": "string", "description": "patron, dedicatee, or the ruler it was written to"},
    "institution": {"$ref": "#/$defs/ids"}, "occasion": {"type": "string"},
    "manuscript": {"type": "string", "description": "e.g. 'MS Majlis 10196 ff. 179b-83b'"},
    "majlis_folios": {"type": "string"}, "edited": {"type": "boolean"}, "summary": {"type": "string"},
    "supported_by": {"$ref": "#/$defs/ids"}, "claims": {"$ref": "#/$defs/ids"}},
    "work — one of his writings, dated only as far as the sources allow"))
oneof.append(base("institution", ["name", "role", "supported_by"], {
    "name": {"type": "string"}, "ruler": {"type": "string"}, "seat": {"type": "string"}, "tenure": {"type": "string"},
    "role": {"enum": ["patron", "judge", "addressee", "enemy", "ally", "teacher", "context", "recipient"]},
    "summary": {"type": "string"}, "supported_by": {"$ref": "#/$defs/ids"}},
    "institution — a court, or a person who is one, as a position on the board"))
json.dump(s, io.open(os.path.join(ROOT, "schemas", "artifacts.schema.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("schema written;", len(oneof), "types")
