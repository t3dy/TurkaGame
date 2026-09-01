# -*- coding: utf-8 -*-
"""fetch_commons.py — download the visionary-environments image corpus from
Wikimedia Commons, with real provenance.

Why Commons rather than the holding institutions directly: Commons exposes
licence, author, source and institution as *queryable structured data*, so a
rights record can be built by the script instead of asserted by a human who
skimmed a web page. Anything whose licence does not parse as free is downloaded
to nothing and reported as BLOCKED — this project does not ship images it cannot
account for (TurkaGame/CLAUDE.md, "No manuscript image goes into assets/ without
a provenance record").

    python imagelab/scripts/fetch_commons.py            # fetch everything missing
    python imagelab/scripts/fetch_commons.py --only mirajnama-first-heaven
    python imagelab/scripts/fetch_commons.py --dry-run  # metadata only, no bytes

Writes:
    research inbox/visionary/<id>.jpg     the image, capped at MAX_W px wide
    imagelab/data/visionary.json          the manifest: provenance + rights + tradition
"""

from __future__ import annotations

import argparse
import json
import io
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
ROOT = BASE.parent
DST = ROOT / "research inbox" / "visionary"
MANIFEST = BASE / "data" / "visionary.json"

API = "https://commons.wikimedia.org/w/api.php"
UA = "TurkaGame-research/1.0 (https://github.com/t3dy/TurkaGame; ted.hand@gmail.com)"
MAX_W = 2000          # plenty for decomposition; keeps the repo sane
PAUSE = 0.6           # be polite to the API

# Licence templates we accept. Anything else is reported BLOCKED, not downloaded.
# Commons' `License` key is a slug ("pd", "pd-art", "cc0", "cc-by-sa-4.0"); the
# short name is prose ("Public domain", "CC0"). Match either, as whole tokens —
# an earlier version anchored on "pd-" and rejected every plain "pd" file in the
# corpus, which is exactly the kind of failure a rights gate must not have.
FREE_KEY = re.compile(r"^(pd|pd-\S*|cc0|cc-zero|cc-by(-sa)?(-\S*)?|attribution)$", re.I)
FREE_NAME = re.compile(r"(public domain|cc0|creative commons)", re.I)


# --- the curated corpus -----------------------------------------------------
#
# id, Commons file title, tradition, why it is here.
# "tradition" keys the gallery's grouping and matches docs/VISIONARY_ENVIRONMENTS.md.

CORPUS = [
    # --- The Cairo Bustan: the same manuscript, the same painter, the same year.
    # This set exists to answer an open question the Yusuf Ascent portal raised:
    # is f. 52b's spatial strategy exceptional within its own book, or the norm?
    ("bustan-yusuf-zulaykha", "File:Yusuf and Zulaykha, from the Cairo Bustan. Herat, December 1488–November 1489. Bihzad. Dar al-kutub, Adab farisi 22, folio 52b.jpg",
     "cairo-bustan", "The folio Yusuf Ascent is built on. Included so the comparison set has its anchor."),
    ("bustan-beggar-mosque", "File:The Beggar at the Mosque, from the Cairo Bustan. Herat, December 1488–November 1489. Bihzad. Dar al-kutub, Adab farisi 22, folio 26a.jpg",
     "cairo-bustan", "Architecture again, but a real mosque courtyard. The control case."),
    ("bustan-darius-herdsman", "File:Darius and the Herdsman, from the Cairo Bustan. Herat, December 1488–November 1489. Bihzad. Dar al-kutub, Adab farisi 22, folio 10a.jpg",
     "cairo-bustan", "Landscape, not architecture — how the same painter handles open ground."),
    ("bustan-poet-judge", "File:The Poet at the Judge’s Court, from the Cairo Bustan. Herat, December 1488–November 1489. Bihzad. Dar al-kutub, Adab farisi 22, folio 30b.jpg",
     "cairo-bustan", "An interior with a court in it — and the folio carrying Bihzad's signature."),
    ("bustan-folio-2b", "File:Cairo Bustan. Herat, December 1488–November 1489. Bihzad. Dar al-kutub, Adab farisi 22, folio 2b.jpg",
     "cairo-bustan", "Frontispiece half. Where the book states its own terms."),
    ("bustan-folio-4a", "File:Cairo Bustan. Herat, December 1488–November 1489. Bihzad. Dar al-kutub, Adab farisi 22, folio 4a.jpg",
     "cairo-bustan", "The other opening folio."),

    # --- Ascension: the ladder, stated rather than inferred.
    ("miraj-first-heaven", "File:The Prophet Muhammad arrives at the gate of the first heaven.jpg",
     "miraj", "A gate between levels, with a gatekeeper. The Seven Heavens environment in one image."),
    ("miraj-lote-tree", "File:Bilal before the Lote Tree of the Limit.jpg",
     "miraj", "The Lote Tree of the Limit — the boundary beyond which the ascent cannot continue."),
    ("miraj-ilkhanid", "File:The Ilkhanid or Jalayerid miniature from a manuscript of the Miraj-nama.jpg",
     "miraj", "Ilkhanid/Jalayirid ascension painting — the tradition before the Timurid book."),

    # --- Haft Paykar: seven planetary domes, correspondences supplied by the poet.
    ("haft-black-pavilion", "File:Bahram Gur and the Indian Princess in the Black Pavilion.jpg",
     "haft-paykar", "Saturn's dome, the first of the seven. Colour as cosmology."),
    ("haft-white-pavilion", "File:Bahram Gur and the Iranian princess in the white pavilion. Illustration to Haft Paykar by Nizami.jpg",
     "haft-paykar", "Venus's dome, the last. The arc's end point."),
    ("haft-yellow-pavilion", "File:Bahram Gur in the yellow pavilion.jpg",
     "haft-paykar", "The Sun's dome. Three of seven is enough to show the system."),

    # --- Siyah Qalam: figures with no ground under them.
    ("siyah-demons", "File:Siyah Qalam Demons1.jpg",
     "siyah-qalam", "Beings on blank paper. The 'ground that isn't' environment."),
    ("siyah-angels-demons", "File:Angels banishing Demons.jpg",
     "siyah-qalam", "Two orders of being in one frame, and no floor for either."),

    # --- Qazwini: a complete world model with an index.
    ("qazwini-israfil", "File:Israfel, from a manuscript, Aja-ib al-Makhluqat (Wonders of Creation) by al-Qazvini.jpg",
     "ajaib", "Israfil, the angel of the trumpet. The top of the cosmography's hierarchy."),
    ("qazwini-tortoise", "File:\"The Tortoise\", Folio from an `Aja'ib al-Makhluqat (Wonders of Creation) of Qazwini MET 136888.jpg",
     "ajaib", "One entry from the index, complete with its text block. The unit of the bestiary crawl."),

    # --- Falnama: the image as oracle.
    ("falnama-joseph", "File:Safavid Dynasty, Joseph Enthroned from a Falnama (Book of Omens), circa 1550 AD.jpg",
     "falnama", "Yusuf again, a century later, as an omen rather than a story."),
    ("falnama-seven-sleepers", "File:\"The Seven Sleepers of Ephesus Discovered by Alexander the Great\", Folio from a Falnama (Book of Omens) MET 121050.jpg",
     "falnama", "Monumental scale, saturated colour, a scene a fortune-teller improvises from."),

    # --- Jalayirid Divan: Ibn Turka's actual contemporary visual world.
    ("jalayir-angels-clouds", "File:Folio from a Divan (collected poems) by Sultan Ahmad Jalayir; Angels Amidst Clouds - Google Art Project.jpg",
     "jalayirid", "Marginal drawing, c. 1400 — within Ibn Turka's own lifetime."),
    ("jalayir-pastoral", "File:Folio from a Divan (collected poems) by Sultan Ahmad Jalayir; Pastoral scene - Google Art Project.jpg",
     "jalayirid", "Drawing growing out from under the calligraphy. 'The Margin' environment."),
    ("jalayir-yurts", "File:Drawing of pastoral scene with yurts. Possibly made by Sultan Ahmad, 1400-1403, Baghdad.jpg",
     "jalayirid", "Baghdad, 1400–03. Tinted line drawing, no frame, no ground."),

    # --- Mantiq al-Tayr: the birds' ascent, a different figure for the same journey.
    ("mantiq-concourse", "File:\"The Concourse of the Birds\", Folio 11r from a Mantiq al-tair (Language of the Birds) MET DT227734.jpg",
     "mantiq", "Attar's birds assembling to seek the Simurgh — the ascent as a crowd, not an individual."),
]


# --- API --------------------------------------------------------------------

def api(**params):
    params.setdefault("format", "json")
    params.setdefault("formatversion", "2")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                time.sleep(4 * (attempt + 1))
                continue
            raise
    raise RuntimeError("unreachable")


def strip_html(s):
    if not s:
        return None
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"&[a-z]+;", " ", s)
    return re.sub(r"\s+", " ", s).strip() or None


def fetch_meta(title):
    d = api(action="query", titles=title, prop="imageinfo",
            iiprop="url|size|extmetadata|mime", iiurlwidth=MAX_W)
    pages = d.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        return None
    ii = pages[0].get("imageinfo")
    if not ii:
        return None
    ii = ii[0]
    em = ii.get("extmetadata", {})

    def g(k):
        v = em.get(k, {}).get("value")
        return strip_html(v) if v else None

    return {
        "commons_title": pages[0]["title"],
        "commons_page": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(pages[0]["title"].replace(" ", "_")),
        "download_url": ii.get("thumburl") or ii.get("url"),
        "original_url": ii.get("url"),
        "original_size": [ii.get("width"), ii.get("height")],
        "licence_short": g("LicenseShortName"),
        "licence_key": em.get("License", {}).get("value"),
        "artist": g("Artist"),
        "credit": g("Credit"),
        "institution": g("Institution") or g("Permission"),
        "date": g("DateTimeOriginal"),
        "description": g("ImageDescription"),
        "usage_terms": g("UsageTerms"),
        "restrictions": g("Restrictions"),
    }


def rights_verdict(meta):
    """Only free licences pass. Everything else is BLOCKED and not downloaded."""
    key = (meta.get("licence_key") or "").strip()
    name = (meta.get("licence_short") or "").strip()
    if meta.get("restrictions"):
        return "BLOCKED", "Commons records a restriction: " + meta["restrictions"]
    if FREE_KEY.match(key) or FREE_NAME.search(name):
        return "CLEARABLE", (
            "Commons licence: %s. Free for reuse; a pre-1700 painting is out of copyright, "
            "and Commons treats a faithful 2-D reproduction as carrying no new copyright. "
            "Confirm the holding institution's own terms before a shipped release."
            % (name or key))
    return "BLOCKED", "Licence did not parse as free: key=%r name=%r" % (key or None, name or None)


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    path.write_bytes(data)
    return len(data)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    DST.mkdir(parents=True, exist_ok=True)
    records, blocked = [], []

    for cid, title, tradition, why in CORPUS:
        if args.only and args.only != cid:
            continue
        out = DST / (cid + ".jpg")
        meta = fetch_meta(title)
        time.sleep(PAUSE)
        if meta is None:
            print("  MISSING  %-26s %s" % (cid, title))
            blocked.append({"id": cid, "commons_title": title, "reason": "not found on Commons"})
            continue

        status, basis = rights_verdict(meta)
        rec = {
            "id": cid,
            "tradition": tradition,
            "why_here": why,
            "file": "research inbox/visionary/%s.jpg" % cid,
            "rights": {"status": status, "basis": basis,
                       "licence": meta.get("licence_short"),
                       "commons_page": meta["commons_page"]},
            "provenance": {
                "artist": meta.get("artist"),
                "institution": meta.get("institution"),
                "date": meta.get("date"),
                "credit": meta.get("credit"),
                "description": meta.get("description"),
                "commons_title": meta["commons_title"],
                "original_size": meta["original_size"],
            },
        }

        if status != "CLEARABLE":
            print("  BLOCKED  %-26s %s" % (cid, basis[:70]))
            blocked.append(rec)
            continue

        if args.dry_run:
            print("  (dry)    %-26s %s" % (cid, meta.get("licence_short")))
        elif out.exists() and not args.force:
            print("  have     %-26s %d KB" % (cid, out.stat().st_size // 1024))
        else:
            n = download(meta["download_url"], out)
            print("  GOT      %-26s %d KB  %s" % (cid, n // 1024, meta.get("licence_short")))
            time.sleep(PAUSE)

        if out.exists():
            rec["bytes"] = out.stat().st_size
        records.append(rec)

    manifest = {
        "_note": ("Visionary-environments image corpus, fetched from Wikimedia Commons by "
                  "imagelab/scripts/fetch_commons.py. Rights are read from Commons' structured "
                  "licence data, not asserted by hand. Anything that did not parse as a free "
                  "licence is in `blocked` and was not downloaded. Companion prose: "
                  "docs/VISIONARY_ENVIRONMENTS.md."),
        "fetched": time.strftime("%Y-%m-%d"),
        "source": "Wikimedia Commons",
        "max_width": MAX_W,
        "images": records,
        "blocked": blocked,
    }
    if not args.only:
        MANIFEST.parent.mkdir(parents=True, exist_ok=True)
        with io.open(MANIFEST, "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        print("\n%d cleared, %d blocked -> %s" % (len(records), len(blocked), MANIFEST))
    return 0


if __name__ == "__main__":
    sys.exit(main())
