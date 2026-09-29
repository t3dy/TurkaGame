#!/usr/bin/env python3
# one-off (2026-09-28): correct one stale pre-existing registry record found by AUDIT-A4-plates.md.
# id 18f0369d-... (sufi-ursa-major) said institution "Wikimedia Commons" with no shelfmark; game/plates.js
# already carries the correct attribution (Bodleian Library, MS Marsh 144), independently verified live
# against the Commons file page during the plate-attribution audit. register_asset.py has no `update`
# command, so this is a targeted correction, not a hand-edit of an unrelated field.
import io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = os.path.join(ROOT, "assets", "manuscripts", "registry.json")
d = json.loads(io.open(p, encoding="utf-8").read())
found = False
for a in d:
    if a["id"] == "18f0369d-5769-466e-a22c-24bb969a49f4":
        assert a["institution"] == "Wikimedia Commons" and a["shelfmark"] is None
        a["institution"] = "Bodleian Library, Oxford"
        a["shelfmark"] = "MS Marsh 144"
        a["notes"] = (a.get("notes") or "") + " | Corrected 2026-09-28 (AUDIT-A4-plates.md): institution/shelfmark were unfilled; game/plates.js already carried the correct Bodleian/Marsh 144 attribution, verified live against the Commons file page."
        found = True
        break
assert found, "record not found"
io.open(p, "w", encoding="utf-8", newline="\n").write(json.dumps(d, indent=1, ensure_ascii=False) + "\n")
print("registry record corrected")
