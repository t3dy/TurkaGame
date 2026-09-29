# -*- coding: utf-8 -*-
"""register_plates.py -- give every plate in game/plate_selection.json a provenance record.

Does not touch assets/manuscripts/registry.json itself: for each plate whose `registry_file`
is not yet a `local_file` in the registry it calls ../research/scripts/register_asset.py `add`
(the only supported way to add a record), passing the staged, already-resized JPEG and the
facts read from the selection file and from research/plates_commons.json.

    python scripts/register_plates.py --dry-run
    python scripts/register_plates.py

Refuses any plate whose Commons record is not CLEARED with licence class PD / CC0 / CC-BY /
CC-BY-SA. Plates that already have a registry record (e.g. sufi-ursa-major) are left alone.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

TV = Path(__file__).resolve().parent.parent
ROOT = TV.parent
REG = ROOT / "assets" / "manuscripts" / "registry.json"
STAGE = ROOT / "research inbox" / "turkavita_plates"
ALLOWED = {"PD", "CC0", "CC-BY", "CC-BY-SA"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    sel = json.load(open(TV / "game" / "plate_selection.json", encoding="utf-8"))
    com = {r["cid"]: r for r in json.load(open(TV / "research" / "plates_commons.json", encoding="utf-8"))}
    have = {r["local_file"] for r in json.load(open(REG, encoding="utf-8"))}
    act_of = {}
    for act, v in sel["acts"].items():
        for pid in [v["card"]] + v["extras"]:
            act_of[pid] = act
    for sc, pid in sel["scenes"].items():
        act_of.setdefault(pid, {"1": "hostage", "2": "courts", "3": "trials", "4": "exile", "5": "copyist", "6": "historian"}[sc[5]])

    n = 0
    for pid, p in sel["plates"].items():
        if p["registry_file"] in have:
            print("  have      %s -> %s" % (pid, p["registry_file"]))
            continue
        c = com[p["cid"]]
        if c["status"] != "CLEARED" or c.get("licence_class") not in ALLOWED:
            sys.exit("REFUSED %s: %s / %s" % (pid, c["status"], c.get("licence_class")))
        staged = ROOT / c["staged"]["file"]
        named = STAGE / p["registry_file"]
        shutil.copyfile(staged, named)
        cc = c["licence_class"]
        rights = ("%s (Commons licence key '%s', class %s), read from Commons' structured licence data "
                  "by the imagelab/scripts/fetch_commons.py gate plus a stricter NC/ND check "
                  "(TurkaVita/scripts/fetch_plates.py) on 2026-09-28. A pre-1900 %s reproduced faithfully in 2-D. "
                  "Source page: %s."
                  % (c["licence_short"], c["licence_key"], cc, p["kind"], c["commons_page"]))
        if p.get("credit"):
            rights += " Attribution required and displayed: %s." % p["credit"]
        cmd = [sys.executable, str(ROOT / "research" / "scripts" / "register_asset.py"), "add",
               "--file", str(named), "--title", p["title"], "--institution", p["institution"],
               "--shelfmark", p["shelfmark"], "--date", p["date"], "--creator", p["creator"],
               "--source-url", c["commons_page"], "--rights-note", rights,
               "--cited-in", "turkavita-plates",
               "--tags", "turkavita,plate,%s,%s" % (p["kind"], act_of.get(pid, "")),
               "--notes", ("TurkaVita illustrator pass 2026-09-28. Origin: %s. Plate id %s. %s" %
                           (p["origin"], pid, p["relevance"])),
               "--added-by", "claude (TurkaVita illustrator pass)"]
        if a.dry_run:
            print("  (dry)     %s -> %s (%s)" % (pid, p["registry_file"], cc))
            named.unlink()
            continue
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8",
                           env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"})
        print("  ", r.stdout.strip() or r.stderr.strip())
        if r.returncode:
            sys.exit("register_asset failed for %s" % pid)
        n += 1
    print("registered %d new record(s)" % n)


if __name__ == "__main__":
    main()
