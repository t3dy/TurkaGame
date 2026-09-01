# -*- coding: utf-8 -*-
"""export_gallery_scholarship.py — the L2 rung, built.

CONTEXTENGINEERINGGAMEPIPELINES.md L2: "the portal DB becomes the upstream source
of truth, and a build step exports the slice the game needs." Until now the
Visionary Gallery carried measurements and provenance and NO scholarship, while
portal/db/turka.db already held sourced encyclopedia entries. This script is the
export that closes that gap.

The division of labour is the whole point:

  * The MAPPING below (tradition -> entry slugs, each with a one-line "why") is
    authored here and is an interpretation. It is tagged as such in the output.
  * The ENTRIES (name, card, literature, confidence, review status) are read from
    the DB at build time and never copied by hand. Fix a card in the portal,
    re-run this script, and the gallery is fixed — one place, not two.

Deliberately conservative: a tradition gets a link only where the connection can
be stated in one defensible sentence. Where the portal has no adequate entry
(divination for the Falnama), the gap is recorded in the output rather than
papered over with the nearest-sounding card.

    python portal/scripts/export_gallery_scholarship.py

Writes games/visionary-gallery/data/scholarship.json.
"""

from __future__ import annotations

import io
import json
import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
DB = ROOT / "portal" / "db" / "turka.db"
OUT = ROOT / "games" / "visionary-gallery" / "data" / "scholarship.json"

# --- the mapping: authored, interpretive, and labelled as such ---------------
#
# (type, slug, why-this-link) — the "why" is shown to the reader next to the
# entry, so the interpretive step is visible at the point of use, per the house
# rule established in Yūsuf Ascent.

MAP = {
    "cairo-bustan": [
        ("concepts", "barzakh",
         "The isthmus between spirit and body: the reading Yūsuf Ascent applies to the "
         "impossible stair in f. 52b."),
        ("concepts", "imaginal-realm",
         "The ontological layer where forms subsist as images — the realm the "
         "'diagram, not building' reading places Bihzād's palace in."),
    ],
    "miraj": [
        ("figures", "suhrawardi",
         "Illuminationist philosophy makes ascent through light the philosopher's "
         "path — the doctrinal frame in which miʿrāj painting was read."),
        ("concepts", "imaginal-realm",
         "The domain where mystical visions occur: where an ascent narrative locates "
         "what its images depict."),
        ("concepts", "oneiromancy",
         "Dream divination ranked second only to astrology across this world — ahead of "
         "geomancy and lettrism. An ascension cycle is the prestige case of the thing it "
         "reads: cognition continuing while the body is unconscious."),
    ],
    "haft-paykar": [
        ("concepts", "pythagorean-cosmology",
         "Number, harmony and the seven planets as cosmic order — the correspondence "
         "table Nizami's seven pavilions are built on."),
        ("concepts", "neoplatonism",
         "Emanation through the planetary spheres: the cosmological ladder Bahrām "
         "Gūr's colour-by-colour progress enacts."),
    ],
    "siyah-qalam": [
        ("concepts", "sufism",
         "The unresolved scholarly debate over these paintings is precisely whether "
         "the figures are Sufis or demons."),
        ("concepts", "imaginal-realm",
         "Beings painted with no ground under them — the closest visual analogue in "
         "the corpus to forms subsisting without material substrate."),
    ],
    "ajaib": [
        ("concepts", "neoplatonism",
         "Qazwīnī's cosmography orders creation as a descending hierarchy from "
         "angels to minerals — the emanationist frame made into an index."),
    ],
    "falnama": [
        ("concepts", "geomancy",
         "The divinatory science standing behind Islamicate omen-books. Ibn Turka's "
         "closest associate Yazdī wrote its defense against Ibn Khaldūn, so divination "
         "sits inside this circle's metaphysics rather than beside it. The Falnāma is "
         "bibliomancy on pictures and a century later: a link of kind, not lineage."),
        ("concepts", "jafr",
         "Letter divination — the political edge of lettrism, and the nearest thing in "
         "the portal to reading a fixed image for what it discloses."),
    ],
    "jalayirid": [
        ("figures", "sayyid-husayn-akhlati",
         "The occultist network Akhlāṭī pivoted — Cairo through Anatolia to Iran — "
         "spans exactly the courts and decades these drawings come from."),
        ("concepts", "sufism",
         "The standard reading of the Dīwān's marginal drawings: the soul's quest, "
         "evoked rather than illustrated."),
    ],
    "mantiq": [
        ("concepts", "sufism",
         "ʿAṭṭār's epic is the Sufi path itself: thirty birds seeking the Simurgh "
         "and finding themselves."),
    ],
}

GAPS = [
    "CLOSED 2026-09-01, and not by this session. The export originally had no divination "
    "entry to link the Falnama to and recorded that here as its highest-value gap. A "
    "concurrent session independently wrote `geomancy` and `jafr` into the portal; the "
    "Falnama now links to both. A duplicate `ilm-al-raml` entry drafted here was removed "
    "rather than shipped alongside theirs - see docs/DECISIONS.md 2026-09-01. Additional "
    "grounded material from that draft (the sand procedure, the popularity ranking, the "
    "Afro-Eurasian spread, Yazdi's five-point argument and the Nur correspondence) is "
    "parked in portal/docs/NOTE_geomancy_merge_candidate.md for a deliberate merge by "
    "whoever owns that entry. Still true beneath all of it: the Falnama is bibliomancy on "
    "pictures and post-dates Ibn Turka by a century, so the link is one of kind, not "
    "lineage, and the mapping says so.",
    "The upstream seed file is edited by other sessions and `seed_from_json.py` PRUNES "
    "database rows absent from it. Two entries this mapping originally referenced "
    "(`treatise-on-barzakh`, `timurid-patronage`) were merged away upstream mid-build and "
    "the export failed loudly rather than silently dropping them - which is the behaviour "
    "to keep. Re-run this export after any portal re-seed.",
    "No figure entry exists for Bihzād, Jāmī, Saʿdī, Sulṭān Ḥusayn Bāyqarā or Sultan "
    "Aḥmad Jalāyir — the portal's scope is Ibn Turka's world, not Persian painting. "
    "Art-historical figures live in games/yusuf-ascent/data/research.json instead.",
]

WIKILINK = re.compile(r"\[\[([^\]|]+)\|([^\]]+)\]\]|\[\[([^\]]+)\]\]")


def plain(card: str) -> str:
    """Resolve [[slug|label]] wiki-links to their labels; keep **bold** markers
    for the client to render. The card is otherwise shipped verbatim."""
    def sub(m):
        return m.group(2) if m.group(2) else m.group(3).replace("-", " ").title()
    return WIKILINK.sub(sub, card or "").strip()


def main():
    if not DB.exists():
        sys.exit("no portal DB at %s — run portal/scripts/init_db.py + seed first" % DB)
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row

    entries, links, missing = {}, {}, []
    for tradition, rows in MAP.items():
        links[tradition] = []
        for table, slug, why in rows:
            r = conn.execute(
                "SELECT * FROM %s WHERE slug = ?" % table, (slug,)).fetchone()
            if r is None:
                missing.append((table, slug))
                continue
            if slug not in entries:
                keys = r.keys()
                e = {
                    "slug": slug,
                    "type": table[:-1],           # figures -> figure
                    # texts use `title`; figures/concepts use `name`
                    "name": r["title"] if "title" in keys else r["name"],
                    "card": plain(r["card"]),
                    "literature": json.loads(r["literature"]) if r["literature"] else [],
                    "confidence": r["confidence"],
                    "review_status": r["review_status"],
                }
                if table == "figures":
                    e["lifespan"] = r["lifespan"]
                    e["relation_to_turka"] = r["relation_to_turka"]
                if table == "texts":
                    e["author"] = r["author_figure_slug"]
                entries[slug] = e
            links[tradition].append({"slug": slug, "why": why})

    if missing:
        sys.exit("mapping references entries the DB does not hold: %r" % missing)

    payload = {
        "_note": ("Scholarship export for the Visionary Gallery — the L2 rung of "
                  "CONTEXTENGINEERINGGAMEPIPELINES.md, generated by "
                  "portal/scripts/export_gallery_scholarship.py. The ENTRIES are read "
                  "from portal/db/turka.db at build time and are the portal's, with its "
                  "own confidence and review-status flags carried through. The MAPPING "
                  "of traditions to entries is this project's interpretation; each "
                  "link's one-line rationale is shown to the reader. Do not hand-edit; "
                  "fix the portal or the mapping and re-run."),
        "source_db": "portal/db/turka.db",
        "entries": entries,
        "tradition_links": links,
        "gaps": GAPS,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with io.open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    n_links = sum(len(v) for v in links.values())
    print("entries: %d  links: %d across %d traditions  gaps recorded: %d\n-> %s"
          % (len(entries), n_links, len(links), len(GAPS), OUT))


if __name__ == "__main__":
    main()
