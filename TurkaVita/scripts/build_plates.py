# -*- coding: utf-8 -*-
"""build_plates.py -- game/plate_selection.json  ->  game/img/*.jpg + game/plates.js + docs/PLATES.md

The selection file is hand-written (what each picture is, what it is NOT, which scenes it
accompanies). This script adds nothing that is not in the registry: every plate is looked up in
../assets/manuscripts/registry.json by `registry_file`, its bytes come from assets/manuscripts/,
and licence and source page come from research/plates_commons.json (the Commons record made by
scripts/fetch_plates.py through the imagelab rights gate). It fails on any plate without a record.

    python scripts/build_plates.py            # write game/img, game/plates.js, docs/PLATES.md
    python scripts/build_plates.py --check    # validate only, write nothing

Output shape (game/plates.js):
    window.PLATES = {plates: {<id>: {file, title, creator, date, place, institution, shelfmark,
                     kind, license, rights, credit, source_url, alt, relevance, caption,
                     registry_id, sha256}},
                     byAct: {hostage: [card, ...extras], courts: [...], trials: [...],
                             exile: [...], copyist: [...], historian: [...]},
                     byScene: {'SCN-0101': '<id>', ...}}
byAct[act][0] is the act's title card; the rest are fallbacks for scenes with no plate of their own.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import sys
from pathlib import Path

from PIL import Image

TV = Path(__file__).resolve().parent.parent
ROOT = TV.parent
SEL = TV / "game" / "plate_selection.json"
COM = TV / "research" / "plates_commons.json"
REG = ROOT / "assets" / "manuscripts" / "registry.json"
ASSETS = ROOT / "assets" / "manuscripts"
IMG = TV / "game" / "img"
OUT_JS = TV / "game" / "plates.js"
OUT_DOC = TV / "docs" / "PLATES.md"
SCENES = TV / "narrative" / "scenes"
ACTS = ["hostage", "courts", "trials", "exile", "copyist", "historian"]
ACT_TITLES = {"hostage": "I. The hostage", "courts": "II. The courts", "trials": "III. The trials",
              "exile": "IV. The exile", "copyist": "V. The copyist", "historian": "VI. The historian"}
LONG_SIDE = 1600
MAX_BYTES = 400 * 1024
ALLOWED = {"PD", "CC0", "CC-BY", "CC-BY-SA"}


def sha(b):
    return hashlib.sha256(b).hexdigest()


def fit(raw):
    """Return JPEG bytes within the game's budget (copy unchanged when already inside it)."""
    im = Image.open(io.BytesIO(raw))
    if im.format == "JPEG" and max(im.size) <= LONG_SIDE and len(raw) <= MAX_BYTES:
        return raw
    im = im.convert("RGB")
    s = LONG_SIDE / max(im.size)
    if s < 1:
        im = im.resize((round(im.size[0] * s), round(im.size[1] * s)), Image.LANCZOS)
    q = 88
    while True:
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        if buf.tell() <= MAX_BYTES or q <= 50:
            return buf.getvalue()
        q -= 4


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    sel = json.load(open(SEL, encoding="utf-8"))
    com = {r["cid"]: r for r in json.load(open(COM, encoding="utf-8"))}
    reg = {r["local_file"]: r for r in json.load(open(REG, encoding="utf-8"))}
    scene_ids = {p.stem for p in SCENES.glob("SCN-*.json")}
    problems = []

    plates = {}
    blobs = {}
    for pid, p in sel["plates"].items():
        rec = reg.get(p["registry_file"])
        if rec is None:
            problems.append("%s: no registry record for %s" % (pid, p["registry_file"]))
            continue
        c = com.get(p["cid"])
        if not c or c["status"] != "CLEARED" or c.get("licence_class") not in ALLOWED:
            problems.append("%s: Commons record missing, not CLEARED or licence not allowed" % pid)
            continue
        src = ASSETS / rec["local_file"]
        raw = src.read_bytes()
        if sha(raw) != rec["sha256"]:
            problems.append("%s: registry sha256 does not match %s" % (pid, src.name))
            continue
        data = fit(raw)
        blobs[pid] = data
        credit = p.get("credit", "")
        if c["licence_class"] in ("CC-BY", "CC-BY-SA") and not credit:
            problems.append("%s: %s needs a credit line" % (pid, c["licence_class"]))
        where = p["institution"]
        if p.get("shelfmark") and p["shelfmark"].lower() not in ("not applicable",):
            where += ", " + p["shelfmark"]
        caption = ("Illustrative plate, not a depiction of this event: %s, %s, %s, %s. %s%s"
                   % (p["title"], p["creator"], p["date"], where, p["relevance"],
                      (" " + credit + ".") if credit else ""))
        plates[pid] = {
            "file": "img/%s.jpg" % pid, "title": p["title"], "creator": p["creator"], "date": p["date"],
            "place": p["place"], "institution": p["institution"], "shelfmark": p["shelfmark"],
            "kind": p["kind"], "license": c["licence_class"],
            "rights": "%s (Commons licence data, key '%s')" % (c["licence_short"], c["licence_key"]),
            "credit": credit, "source_url": c["commons_page"], "alt": p["alt"], "relevance": p["relevance"],
            "caption": caption, "registry_id": rec["id"], "sha256": rec["sha256"],
            "origin": p["origin"]}

    by_act = {}
    for act in ACTS:
        v = sel["acts"].get(act)
        if not v:
            problems.append("act %s has no title card" % act)
            continue
        ids = [v["card"]] + list(v["extras"])
        for i in ids:
            if i not in plates:
                problems.append("act %s references unbuilt plate %s" % (act, i))
        by_act[act] = ids
    by_scene = {}
    for sc, pid in sel["scenes"].items():
        if sc not in scene_ids:
            problems.append("byScene names a scene that does not exist: %s" % sc)
        if pid not in plates:
            problems.append("scene %s references unbuilt plate %s" % (sc, pid))
        by_scene[sc] = pid
    for pid in plates:                      # nothing built should be orphaned
        used = pid in by_scene.values() or any(pid in v for v in by_act.values())
        if not used:
            problems.append("plate %s is in no act and no scene" % pid)

    if problems:
        print("\n".join("PROBLEM: " + x for x in problems))
        return 1
    total = sum(len(b) for b in blobs.values())
    print("%d plates, %d scenes with a plate, %d bytes (%.1f MB)" %
          (len(plates), len(by_scene), total, total / 1048576))
    if a.check:
        return 0

    IMG.mkdir(parents=True, exist_ok=True)
    keep = {pid + ".jpg" for pid in plates}
    for f in IMG.glob("*.jpg"):
        if f.name not in keep:
            f.unlink()
    for pid, data in blobs.items():
        (IMG / (pid + ".jpg")).write_bytes(data)

    payload = {"plates": plates, "byAct": by_act, "byScene": by_scene}
    OUT_JS.write_text(
        "// Generated by scripts/build_plates.py from game/plate_selection.json. Do not hand-edit.\n"
        "window.PLATES = " + json.dumps(payload, ensure_ascii=True, indent=1) + ";\n", encoding="utf-8")
    write_doc(sel, plates, by_act, by_scene, blobs, com)
    print("wrote", OUT_JS.relative_to(TV), "and", len(blobs), "images; docs/PLATES.md")
    return 0


def write_doc(sel, plates, by_act, by_scene, blobs, com):
    scenes_of = {}
    for sc, pid in by_scene.items():
        scenes_of.setdefault(pid, []).append(sc)
    n = {"web": 0, "gallery": 0, "occultimgdb": 0, "registry": 0}
    for p in plates.values():
        n[p["origin"]] = n.get(p["origin"], 0) + 1
    total = sum(len(b) for b in blobs.values())
    L = []
    L.append("# PLATES: provenance for every illustration in the game\n")
    L.append("Generated by `scripts/build_plates.py` from `game/plate_selection.json` (hand-written), "
             "`research/plates_commons.json` (the Commons licence record) and "
             "`../assets/manuscripts/registry.json`. Do not hand-edit; edit the selection file and rebuild. "
             "Tested by `tests/test_plates.py`.\n")
    L.append("Ted's rule (2026-09-28): period paintings, manuscript pages and printed sources only. "
             "No photographs of places or people, no museum-object photographs, no renders, no modern paintings. "
             "A photograph of a manuscript folio is a manuscript source. Every plate is captioned in the game as "
             "**illustrative, not a depiction of this event**, with a one-sentence `relevance` that says what the "
             "picture is and what it is not.\n")
    L.append("**%d plates, %.1f MB in `game/img/`; %d scenes have a plate of their own, the other %d share their "
             "act's title card or fallbacks.** From our existing collections: %d (%d from `games/visionary-gallery`, "
             "%d from OCCULTIMGDB, %d already in the registry); new from Wikimedia Commons: %d. "
             "Kinds: %s.\n" % (
                 len(plates), total / 1048576, len(by_scene), 36 - len(by_scene),
                 n["gallery"] + n["occultimgdb"] + n["registry"], n["gallery"], n["occultimgdb"], n["registry"], n["web"],
                 ", ".join("%d %s" % (sum(1 for p in plates.values() if p["kind"] == k), k)
                           for k in ("painting", "manuscript", "printed"))))
    L.append("## Method\n")
    L.append("1. Inventory: the 30 registry items, `games/visionary-gallery` (22 Commons folios), OCCULTIMGDB "
             "(the Islamicate items) and the portal image catalogue (rejected wholesale, see below).\n"
             "2. New material came only through `imagelab/scripts/fetch_commons.py`'s rights gate, imported by "
             "`scripts/fetch_plates.py` (it reads Commons' structured licence data), plus a stricter check on top "
             "(NC, ND and unparsed licences rejected).\n"
             "3. Every plate has a record in the registry, added with `research/scripts/register_asset.py add` "
             "(never hand-edited), whose sha256 the build re-checks.\n"
             "4. Images are resized to at most 1600 px on the long side and about 400 KB.\n")
    L.append("**A hole found in the shared rights gate (not fixed in place, because the file is shared):** "
             "`fetch_commons.FREE_KEY` accepts any key shaped `cc-by(-sa)?(-\\S*)?`, which also matches "
             "`cc-by-nc-4.0` and `cc-by-nd-4.0`. No such file was in any earlier corpus, but the gate as written "
             "would pass one. `scripts/fetch_plates.py` adds the NC/ND rejection. Its opposite failure also "
             "showed: it refuses `CC BY-SA 3.0 IGO` (key absent), which is why the Khalili al-Buni folio is out.\n")

    for act in ACTS:
        L.append("## %s\n" % ACT_TITLES[act])
        L.append("| plate | what it is | holder and shelfmark | date and place | kind | licence | scenes | source |")
        L.append("|---|---|---|---|---|---|---|---|")
        for i, pid in enumerate(by_act[act]):
            p = plates[pid]
            role = "TITLE CARD" if i == 0 else ("fallback" if pid not in by_scene.values() else "")
            sc = ", ".join(sorted(scenes_of.get(pid, []))) or "(act %s)" % role.lower()
            if i == 0:
                sc = "act card" + ((", " + ", ".join(sorted(scenes_of[pid]))) if pid in scenes_of else "")
            row = "| `%s` | %s | %s; %s | %s; %s | %s | %s | %s | [Commons](%s) |" % (
                pid, p["title"], p["institution"], p["shelfmark"], p["date"], p["place"], p["kind"],
                p["license"] + (" (credit displayed)" if p["credit"] else ""), sc, p["source_url"])
            L.append(row.replace("Freer|Sackler", "Freer/Sackler"))
        L.append("")
    # plates that live only in scenes of an act but are not listed under byAct are shown in the act of the scene
    listed = {pid for v in by_act.values() for pid in v}
    extra = [pid for pid in plates if pid not in listed]
    if extra:
        L.append("## Scene plates not in any act list\n")
        L.append("| plate | what | scenes | licence | source |\n|---|---|---|---|---|")
        for pid in extra:
            p = plates[pid]
            L.append("| `%s` | %s | %s | %s | [Commons](%s) |" % (
                pid, p["title"], ", ".join(sorted(scenes_of.get(pid, []))), p["license"], p["source_url"]))
        L.append("")
    L.append("## What each picture is not (`relevance`, one sentence each)\n")
    for pid, p in plates.items():
        L.append("- `%s`: %s" % (pid, p["relevance"]))
    L.append("")
    L.append("## Scenes with no plate of their own\n")
    all_scenes = sorted(x.stem for x in SCENES.glob("SCN-*.json"))
    missing = [s for s in all_scenes if s not in by_scene]
    for s in missing:
        d = json.load(open(SCENES / (s + ".json"), encoding="utf-8"))
        L.append("- `%s` (%s): %s" % (s, d["act"], d["title"]))
    L.append("")
    L.append("These show their act's title card. No honest picture was found: nothing in a cleared source shows "
             "a Cairo funeral, Mazandaran or Gilan households, Simnan, Sa'in Qal'a, a governor's letters, or the "
             "modern historian's desk, and inventing a link would break the rule that a plate is chosen because it "
             "is from that world.\n")
    L.append("## Rejected candidates\n")
    L.append("| candidate | reason |\n|---|---|")
    for r in sel["rejected"]:
        L.append("| %s | %s |" % (r["what"], r["reason"]))
    L.append("")
    L.append("## Attribution and dating uncertainty to watch\n")
    L.append("- Commons metadata is often wrong: the Lisbon frontispiece's file page says '14th century' while its "
             "category and sister files say 1410; the Barquq Qur'an is Cairo c. 1370-75 (probably for Sultan Sha'ban), "
             "endowed by Barquq's son, not made for Barquq; the file called 'Qadi Abbasid' is a Friday preacher, and was "
             "not used as a qadi.\n"
             "- Holders are stated only where a Commons page or its cited source gives one. Where it does not "
             "(the funeral double page, the Jalayirid yurt drawing, the St Petersburg Maqamat, the Met Majma' folio's "
             "accession number), the plate says so.\n"
             "- The Zafarnama giraffe embassy is dated 1404 in one Commons description and October 1405 in the file "
             "name; Temur died in February 1405, so the event date is treated as uncertain.\n"
             "- The Bulhan plates carry the OCCULTIMGDB catalogue's shelfmark (Bodleian MS Arab. d. 138) and its "
             "Jalayirid dating, neither of which is on the Commons page (which says 1350-1450).\n"
             "- The Wellcome horoscope is the only plate needing an attribution line (CC BY 4.0); it is displayed.\n"
             "- Only one plate (`ijaza-cairo-adab105`) is a rough high-contrast scan, kept because an author's own "
             "certificate is the closest honest image for an audition note.\n")
    OUT_DOC.write_text("\n".join(L) + "\n", encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
