# -*- coding: utf-8 -*-
"""Build data/palace.json from the region manifest + the annotations below.

Boxes stay single-sourced in ../../imagelab/data/regions.json; everything
interpretive lives in ANN / LOCKS here. Re-run from the repo root after
editing either:

    python games/yusuf-ascent/build_palace.py
"""
import json
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
REG = json.load(io.open(ROOT / 'imagelab/data/regions.json', encoding='utf-8'))
IM = [i for i in REG['images'] if i['id'] == 'yusuf-fleeing-zulaykha'][0]
W, H = 1588, 2370

# The seven rungs. The terms are real; the ASSIGNMENT of painted elements to
# rungs is this project's interpretation, and is labelled as such in the portal.
RUNGS = [
    {"id": "mulk", "n": 0, "name": "Mulk", "colour": "#3a4a7a",
     "gloss": "The kingdom of sense — brick, street, the door onto the road."},
    {"id": "mithal-asfal", "n": 1, "name": "Threshold", "colour": "#3f7a63",
     "gloss": "The iwan and its tilework: the sensible world already arranged into pattern."},
    {"id": "barzakh", "n": 2, "name": "Barzakh", "colour": "#b4622a",
     "gloss": "The isthmus. Stairs belong to neither storey they join — the picture's clearest structural pun."},
    {"id": "khayal", "n": 3, "name": "ʿĀlam al-khayāl", "colour": "#2f5ea8",
     "gloss": "The imaginal: forms held as images. Doors, cartouches, the lapis court."},
    {"id": "malakut", "n": 4, "name": "Malakūt", "colour": "#8e3f6b",
     "gloss": "The angelic realm — the parts of the building carried on nothing."},
    {"id": "jabarut", "n": 5, "name": "Jabarūt", "colour": "#a8452f",
     "gloss": "The chamber where the flight happens; power, not place."},
    {"id": "lahut", "n": 6, "name": "Lāhūt", "colour": "#c99a2e",
     "gloss": "The crown. Finial, cupola, and the flame that is the only light in the picture."},
]

# id: (rung, role, title, card)   role: door|surface|figure|text|ornament|frame|light
ANN = {
"folio-full": (0, "frame", "The folio entire",
 "Cairo, Egyptian National Library, Adab Farsi 22, f. 52b. Herat, 893/1488, for Sultan Ḥusayn Bāyqarā. "
 "The painting takes the whole written surface and drives its verses into the architecture instead of around it."),
"architecture-full": (2, "frame", "The palace, whole",
 "Nothing in this building is structurally possible, and every surface is finished to the same degree of attention. "
 "That combination is the argument: it is a diagram wearing the costume of a house."),

"cupola": (6, "surface", "The crowning kiosk",
 "An octagonal kiosk with a finial, on a roof no stair in the picture reaches. It is the terminus of the ascent "
 "and the one part of the palace no figure can occupy."),
"roof-eaves-band": (6, "ornament", "The inscribed cornice",
 "A tiled eaves band carrying nastaʿlīq. Epigraphy at the roofline follows the wall plane rather than the page — "
 "the text is built into the building, not laid over it."),
"badgir-kiosk": (4, "surface", "The unreachable turret",
 "A blue-and-white turret at the upper right. No door, stair or landing in the composition connects to it. "
 "It is reachable only by looking."),

"the-chamber": (5, "surface", "The upper chamber",
 "The one enclosed room in the picture, and the smallest area of actual narrative. Saʿdī's Būstān describes no "
 "palace at all; the chamber comes from Jāmī's Yūsuf u Zulaykhā, finished in 1483, five years before this page."),
"chamber-arch": (5, "surface", "The white arch",
 "The only large unpatterned surface in the folio. Bihzād reserves blankness for the exact place where the event happens."),
"yusuf": (5, "figure", "Yūsuf",
 "Mid-stride, one arm flung up, moving left and out of the chamber. In Jāmī the doors give way at the touch of his "
 "pointing finger; in Qur'an 12:23 Zulaykha has locked them and they open regardless."),
"yusuf-halo": (6, "light", "The flame-halo",
 "A gold flame nimbus. It is the only light source in a picture with no modelled light anywhere else: illumination "
 "here marks ontological rank, not optics."),
"zulaykha": (5, "figure", "Zulaykha",
 "Leaning after him, a hand on his skirt. Jāmī's reading inverts the moral — she is the Sufi lover whose ruinous "
 "desire is finally redeemed into union, not simply the temptress of the older telling."),
"chamber-tile-panel": (3, "ornament", "Chamber revetment",
 "Dark-ground floral tile on the chamber's left wall. In Jāmī the seven chambers are hung with paintings of Yūsuf "
 "and Zulaykha themselves — images of the story inside the story."),
"chamber-carpet": (3, "ornament", "The floor under the flight",
 "A patterned panel directly beneath Yūsuf's feet, drawn in a projection that disagrees with the walls enclosing it."),
"chamber-threshold": (2, "surface", "The tasselled sill",
 "The chamber's floor ends in a ledge over open air. Whatever Yūsuf is striding toward, the painting gives him no "
 "floor to stride onto."),

"red-balcony": (4, "surface", "The red balcony",
 "A cantilevered pavilion at the right, framed in vermilion. It overlaps the chamber's storey but does not share a level with it."),
"balcony-doorway": (4, "door", "The balcony door",
 "An arched opening in the balcony's back wall, giving onto a plane with no depth behind it."),
"muqarnas-eaves": (4, "ornament", "Muqarnas eaves",
 "Muqarnas is a vault built from subdivided niches — literally a geometry for filling the transition between shapes "
 "that do not meet. The picture uses it where two impossible planes need reconciling."),
"balcony-brackets": (4, "surface", "The brackets over nothing",
 "Struts carrying the balcony's weight down to a point where the wall below has already ended. The most explicit "
 "structural impossibility in the folio."),
"tile-roundel": (3, "ornament", "Roundel panel",
 "Blue-and-gold roundels set into the balcony wall — a self-contained pattern field, complete at any scale."),

"blue-tile-court": (3, "surface", "The lapis court",
 "The upper-left court: a lapis ground scattered with flowering sprays. It reads as a wall, a garden and a page of "
 "illumination at once, and commits to none of them."),
"green-door-arch": (3, "surface", "The blue niche",
 "A pointed arch of turquoise and lapis framing the green door — the most architecturally correct passage in the "
 "picture, and it opens onto nothing the picture states."),
"green-door": (3, "door", "The green door",
 "Green double leaves in a blue niche. Green is Yūsuf's colour in this folio, which makes this the door that matches the man."),
"orange-door-upper": (3, "door", "The upper orange door",
 "A tall door on the top storey, its threshold level with no floor drawn anywhere near it."),
"inscription-tablet": (3, "text", "The small tablet",
 "A little epigraphic tablet beside the upper door. Recent work on this folio reads its inscriptions as praise of the "
 "painter rather than of the patron — unusual, and part of why the Cairo Būstān matters to the history of artistic signature."),
"black-inscription-panel": (3, "text", "The black panel",
 "Gold nastaʿlīq on a black ground, set into the wall like a plaque. Here verse is a building material."),

"staircase-upper": (2, "surface", "The upper flight",
 "The stair is the barzakh made carpentry: it belongs to neither the storey it leaves nor the one it reaches."),
"stair-landing": (2, "surface", "The landing",
 "A turn in the stair. Read the treads above and below it and they imply two incompatible directions of gravity."),
"staircase-lower": (2, "surface", "The lower flight",
 "It descends toward the street and arrives beside a door rather than at it."),
"orange-door-stairhead": (2, "door", "The stairhead door",
 "An orange door at the head of the stair, opening across the line of travel rather than along it."),
"verse-cartouche-mid": (2, "text", "The mid cartouche",
 "A gold verse panel laid diagonally on a green ground, following the wall's plane. The text tilts because the building does."),
"ornate-door-lower": (1, "door", "The muqarnas door",
 "A small door crowned with muqarnas, beneath the stair. The most heavily ornamented opening in the picture, and the least reachable."),
"orange-door-under-stair": (1, "door", "The door under the stair",
 "Orange double leaves tucked under the lower flight, at the point where the stair's own structure would block them."),

"lower-portal": (1, "surface", "The iwan",
 "A vaulted recess open on one side — the standard unit of Persianate monumental architecture, here made the "
 "picture's structural hinge."),
"iwan-door": (1, "door", "The iwan door",
 "The door inside the vault, drawn in a projection that puts its floor above the vault's own springing."),
"iwan-spandrel-tile": (1, "ornament", "Spandrel band",
 "An inscribed lapis band across the iwan's head, with tiled spandrels either side."),
"tile-field-left": (1, "ornament", "Star tile, left",
 "Green-and-gold star-and-cross tiling: a pattern that continues by rule, not by edge. It could be any size, and the "
 "picture cuts it arbitrarily."),
"tile-field-right": (1, "ornament", "Star tile, right",
 "The same system on the opposite side, at a different scale, on a plane that cannot be parallel to its twin."),

"brick-wall": (0, "surface", "The street wall",
 "Plain grey brick — the only ordinary material in the folio, and the only surface not treated as a field of pattern."),
"pink-portal": (0, "surface", "The street portal",
 "A pink frame worked with white arabesque, standing proud of the brick. It is the outermost boundary the story has."),
"street-door": (0, "door", "The street door",
 "Dark leaves with a geometric strapwork panel. In the Qur'anic account the doors are locked from inside; this is the "
 "last of them, and the one at which Yūsuf's shirt is torn."),
"blue-dado": (0, "ornament", "The dado",
 "A deep blue band running the width of the street. It reads as ground, as water and as void, depending on what you "
 "take the wall above it to be."),

"verse-cartouche-top": (6, "text", "The upper verses",
 "Verse cartouches set into the roofline, following the wall planes rather than the page — while the page's own margin is left blank."),
"verse-cartouche-upper-left": (3, "text", "Upper-left verse",
 "A cartouche wedged into the corner of the court, angled to the wall it sits on."),
"verse-cartouche-foot": (0, "text", "The foot verses",
 "Two blocks of nastaʿlīq at the base — the only text in the folio still behaving like text on a page."),
}

# The chain of doors, outermost first. Seven, after Jāmī's seven chambers; the
# eighth opening in the picture is deliberately a blind. See DESIGN.md.
DOOR_CHAIN = ["street-door", "iwan-door", "orange-door-under-stair", "ornate-door-lower",
              "orange-door-stairhead", "green-door", "orange-door-upper"]
BLIND_DOOR = "balcony-doorway"

# Each door is inscribed with a term; to open it the player finds the region in
# the painting that embodies it.
LOCKS = {
"street-door": {"concept": "mulk", "term": "ملك",
    "prompt": "Locked from within. Show me plain matter — the one surface here that is not pattern.",
    "answer": "brick-wall",
    "gloss": "The brick wall is the only ordinary material in the folio. Everything else has been made into a field."},
"iwan-door": {"concept": "naqsh", "term": "نقش",
    "prompt": "Show me a pattern with no edge of its own — one the picture had to cut arbitrarily.",
    "answer": "tile-field-left",
    "gloss": "Star-and-cross tiling continues by rule, not by boundary. The frame decides where it stops; the pattern does not."},
"orange-door-under-stair": {"concept": "barzakh", "term": "برزخ",
    "prompt": "Show me the isthmus — what belongs to neither of the two things it joins.",
    "answer": "staircase-lower",
    "gloss": "Melvin-Koushki renders barzakh as a joining isthmus between the spiritual realm and the body. A stair is that, in wood."},
"ornate-door-lower": {"concept": "muqarnas", "term": "مقرنص",
    "prompt": "Show me the geometry for filling a transition between shapes that do not meet.",
    "answer": "muqarnas-eaves",
    "gloss": "Muqarnas subdivides a corner into niches until the mismatch disappears. It is a technology of transition."},
"orange-door-stairhead": {"concept": "khayāl", "term": "خيال",
    "prompt": "Show me an image held as an image — a surface that is a wall, a garden and a page at once.",
    "answer": "blue-tile-court",
    "gloss": "ʿĀlam al-khayāl is the realm where forms subsist as images. The lapis court refuses to settle into any one reading."},
"green-door": {"concept": "malakūt", "term": "ملكوت",
    "prompt": "Show me what is carried on nothing.",
    "answer": "balcony-brackets",
    "gloss": "The brackets descend to a point where the wall has already ended. The balcony is held up by the picture, not the building."},
"orange-door-upper": {"concept": "nūr", "term": "نور",
    "prompt": "Show me the only light in a picture with no light.",
    "answer": "yusuf-halo",
    "gloss": "There is no modelled light anywhere in the folio. The flame-halo is illumination as rank, not as optics."},
"balcony-doorway": {"concept": "—", "term": "",
    "prompt": "This door is painted on a plane with nothing behind it.",
    "answer": None,
    "gloss": "A blind. Not every opening in this palace is a passage, and the game will not pretend otherwise."},
}


def main():
    nodes = []
    for r in IM['regions']:
        rid = r['id']
        if rid not in ANN:
            raise SystemExit("unannotated region: " + rid)
        rung, role, title, card = ANN[rid]
        x1, y1, x2, y2 = r['box']
        nodes.append({
            "id": rid,
            "title": title,
            "role": role,
            "kind": r['kind'],
            "rung": RUNGS[rung]['id'],
            "rung_n": rung,
            "card": card,
            "label": r['label'],
            "box": r['box'],
            "norm": [round(x1 / W, 5), round(y1 / H, 5), round((x2 - x1) / W, 5), round((y2 - y1) / H, 5)],
            "sprite": "assets/regions/%s.jpg" % rid,
            "lock": LOCKS.get(rid),
            "chain_index": DOOR_CHAIN.index(rid) if rid in DOOR_CHAIN else None,
            "blind": rid == BLIND_DOOR,
        })

    out = {
        "_note": "Canonical decomposition of Bihzad's Yusuf fleeing Zulaykha (Cairo, Adab Farsi 22, f. 52b) into "
                 "interactable elements. Boxes are generated from imagelab/data/regions.json - edit there, then "
                 "re-run games/yusuf-ascent/build_palace.py. Rung assignments are this project's interpretation "
                 "and are labelled as such in the portal.",
        "source": {
            "id": "yusuf-fleeing-zulaykha",
            "title": "Yūsuf fleeing Zulaykha",
            "artist": "Kamāl al-Dīn Bihzād (attributed)",
            "manuscript": "Būstān of Saʿdī, made for Sultan Ḥusayn Bāyqarā",
            "institution": "Egyptian National Library and Archives, Cairo",
            "shelfmark": "Adab Farsi 22",
            "folio": "f. 52b",
            "date": "893/1488",
            "place": "Herat",
            "dimensions": [W, H],
            "rights": "Public domain (PD-Art): faithful photographic reproduction of a two-dimensional "
                      "public-domain work, via Wikimedia Commons.",
            "full_image": "assets/folio-full.jpg",
        },
        "rungs": RUNGS,
        "door_chain": DOOR_CHAIN,
        "blind_door": BLIND_DOOR,
        "nodes": nodes,
    }
    dst = Path(__file__).resolve().parent / 'data'
    dst.mkdir(parents=True, exist_ok=True)
    with io.open(dst / 'palace.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("nodes: %d  doors: %d  rungs: %d" % (
        len(nodes), sum(1 for n in nodes if n['role'] == 'door'), len(RUNGS)))


if __name__ == '__main__':
    main()
