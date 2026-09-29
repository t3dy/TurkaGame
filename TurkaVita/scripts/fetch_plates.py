# -*- coding: utf-8 -*-
"""fetch_plates.py -- stage candidate plates for TurkaVita through the project's rights gate.

This does NOT replace imagelab/scripts/fetch_commons.py; it imports it and uses its
fetch_meta / rights_verdict / download, so the rights read comes from Commons' structured
licence data exactly as everywhere else in the project. It adds two things fetch_commons does
not do, because TurkaVita ships these images inside a game:

  1. A STRICTER licence classification. fetch_commons.FREE_KEY accepts any key of the form
     cc-by(-sa)?(-\\S*)? -- which also matches cc-by-nc-4.0 and cc-by-nd-4.0. That is a hole in
     the gate (found 2026-09-28 while reading it; not fixed in place because that file is
     shared, and is reported in docs/PLATES.md). Here NC / ND / unknown are REJECTED.
  2. Resizing to the game's budget (<= 1600 px long side, <= ~380 KB JPEG).

Usage (from C:\\Dev\\TurkaGame\\TurkaVita):
    python scripts/fetch_plates.py                 # every candidate in research/plate_candidates.json
    python scripts/fetch_plates.py --only zaf-samarkand-1394
    python scripts/fetch_plates.py --dry-run       # metadata + licence verdict only, no bytes

Reads   research/plate_candidates.json  (cid, Commons title, origin, optional local file)
Writes  ../research inbox/turkavita_plates/<cid>.jpg   (gitignored staging)
        research/plates_commons.json                   (metadata + verdict per candidate)

A candidate whose licence does not parse as PD / CC0 / CC-BY / CC-BY-SA is recorded as
REJECTED with the reason and its bytes are not kept.
"""
from __future__ import annotations

import argparse
import io
import json
import re
import sys
import time
import urllib.parse
from pathlib import Path

HERE = Path(__file__).resolve().parent
TV = HERE.parent                      # TurkaVita/
ROOT = TV.parent                      # TurkaGame/
sys.path.insert(0, str(ROOT / "imagelab" / "scripts"))
import fetch_commons as fc            # noqa: E402  (the rights gate; imported, not bypassed)

from PIL import Image                 # noqa: E402

fc.MAX_W = 1600
STAGE = ROOT / "research inbox" / "turkavita_plates"
CAND = TV / "research" / "plate_candidates.json"
OUT = TV / "research" / "plates_commons.json"
LONG_SIDE = 1600
MAX_BYTES = 380 * 1024


def classify(meta):
    """Return (licence_class, reason). licence_class in PD, CC0, CC-BY, CC-BY-SA, or None."""
    key = (meta.get("licence_key") or "").strip().lower()
    name = (meta.get("licence_short") or "").strip().lower()
    blob = key + " " + name
    if meta.get("restrictions"):
        return None, "Commons records a restriction: %s" % meta["restrictions"]
    if re.search(r"(^|[\s\-_])n[cd]([\s\-_.]|$)", blob):
        return None, "NC/ND licence: key=%r name=%r" % (key, name)
    if key.startswith("pd") or "public domain" in name or key in ("pdm", "pd"):
        return "PD", None
    if key in ("cc0", "cc-zero") or name.startswith("cc0"):
        return "CC0", None
    if key.startswith("cc-by-sa") or name.startswith("cc by-sa") or name.startswith("cc-by-sa"):
        return "CC-BY-SA", None
    if key.startswith("cc-by") or name.startswith("cc by"):
        return "CC-BY", None
    return None, "licence did not classify: key=%r name=%r" % (key, name)


def wikitext(title):
    d = fc.api(action="query", titles=title, prop="revisions", rvprop="content",
               rvslots="main")
    try:
        return d["query"]["pages"][0]["revisions"][0]["slots"]["main"]["content"]
    except Exception:
        return None


def normalise(raw_bytes, dest):
    im = Image.open(io.BytesIO(raw_bytes))
    im.load()
    if im.mode not in ("RGB",):
        im = im.convert("RGB")
    w, h = im.size
    s = LONG_SIDE / max(w, h)
    if s < 1:
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    q = 88
    while True:
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        if buf.tell() <= MAX_BYTES or q <= 50:
            break
        q -= 4
    if buf.tell() > MAX_BYTES:            # very detailed page: shrink until it fits
        while buf.tell() > MAX_BYTES and max(im.size) > 900:
            im = im.resize((round(im.size[0] * .9), round(im.size[1] * .9)), Image.LANCZOS)
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=60, optimize=True, progressive=True)
    dest.write_bytes(buf.getvalue())
    return im.size, buf.tell()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()

    STAGE.mkdir(parents=True, exist_ok=True)
    cands = json.load(open(CAND, encoding="utf-8"))
    prev = {}
    if OUT.exists():
        prev = {r["cid"]: r for r in json.load(open(OUT, encoding="utf-8"))}
    recs = dict(prev)

    for c in cands:
        cid = c["cid"]
        if a.only and a.only != cid:
            continue
        title = c["title"] if c["title"].startswith("File:") else "File:" + c["title"]
        try:
            meta = fc.fetch_meta(title)
        except Exception as e:                       # network / API failure: say so
            print("  ERROR    %-30s %s" % (cid, e))
            recs[cid] = {"cid": cid, "status": "ERROR", "reason": str(e), "origin": c["origin"],
                         "requested_title": title}
            continue
        time.sleep(fc.PAUSE)
        if meta is None:
            print("  MISSING  %-30s %s" % (cid, title[:90]))
            recs[cid] = {"cid": cid, "status": "MISSING", "reason": "not found on Commons under this title",
                         "origin": c["origin"], "requested_title": title}
            continue
        gate, gate_basis = fc.rights_verdict(meta)     # the project's own gate
        lic, why = classify(meta)                      # the stricter check on top of it
        rec = {"cid": cid, "origin": c["origin"], "requested_title": title,
               "commons_title": meta["commons_title"], "commons_page": meta["commons_page"],
               "licence_key": meta["licence_key"], "licence_short": meta["licence_short"],
               "licence_class": lic, "gate_verdict": gate, "artist": meta["artist"],
               "credit": meta["credit"], "date": meta["date"], "description": meta["description"],
               "usage_terms": meta["usage_terms"], "original_size": meta["original_size"]}
        if gate != "CLEARABLE" or lic is None:
            rec["status"] = "REJECTED"
            rec["reason"] = why or gate_basis
            print("  REJECTED %-30s %s" % (cid, rec["reason"][:80]))
            recs[cid] = rec
            continue
        rec["status"] = "CLEARED"
        dest = STAGE / (cid + ".jpg")
        if a.dry_run:
            print("  (dry)    %-30s %s" % (cid, lic))
        elif dest.exists() and not a.force and prev.get(cid, {}).get("staged"):
            print("  have     %-30s %d KB" % (cid, dest.stat().st_size // 1024))
            rec["staged"] = prev[cid]["staged"]
        else:
            try:
                if c.get("local") and Path(c["local"]).exists():
                    raw = Path(c["local"]).read_bytes()
                    src = "local:" + c["local"]
                else:
                    import urllib.request
                    req = urllib.request.Request(meta["download_url"], headers={"User-Agent": fc.UA})
                    with urllib.request.urlopen(req, timeout=120) as r:
                        raw = r.read()
                    src = "download:" + meta["download_url"]
                    time.sleep(fc.PAUSE)
                size, nbytes = normalise(raw, dest)
                rec["staged"] = {"file": str(dest.relative_to(ROOT)).replace("\\", "/"), "size": size,
                                 "bytes": nbytes, "from": src}
                print("  GOT      %-30s %dx%d %d KB  %s" % (cid, size[0], size[1], nbytes // 1024, lic))
            except Exception as e:
                rec["status"] = "ERROR"
                rec["reason"] = "download/resize failed: %s" % e
                print("  ERROR    %-30s %s" % (cid, e))
        wt = wikitext(meta["commons_title"])
        rec["wikitext_head"] = (wt or "")[:2500]
        recs[cid] = rec

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(list(recs.values()), f, ensure_ascii=False, indent=1)
    n = {}
    for r in recs.values():
        n[r["status"]] = n.get(r["status"], 0) + 1
    print("\n", n, "->", OUT)


if __name__ == "__main__":
    main()
