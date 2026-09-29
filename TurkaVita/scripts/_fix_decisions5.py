#!/usr/bin/env python3
# one-off (2026-09-28): DECISIONS 25, closing out the plate-attribution audit.
import io, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(ROOT, "docs", "DECISIONS.md")
s = io.open(p, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in s else "\n"
s = s.replace("\r\n", "\n").rstrip("\n")
s += """

## 2026-09-28 (continued): plate attributions independently verified

25. **All 39 plates' attributions were independently checked against live source pages**
    (`research/notes/AUDIT-A4-plates.md`): 39/39 CONFIRMED, zero serious or minor findings in `game/plates.js`
    itself. Every uncertainty the illustrator flagged (the Lisbon frontispiece's disputed date, the giraffe
    embassy's disputed date, several unstated holding institutions) was verified to hold, word for word, against
    the actual Commons page. One unrelated, pre-existing registry record (`18f0369d-...`, `sufi-ursa-major`, not
    part of this pass's `tv-` prefixed additions) still said `institution: "Wikimedia Commons"` with no shelfmark;
    `plates.js` already carried the correct Bodleian Library/MS Marsh 144 attribution, so the registry record was
    corrected to match (a metadata fix, not a rights or fact change).
"""
io.open(p, "w", encoding="utf-8", newline="").write(s.replace("\n", nl) + nl)
print("ok")
