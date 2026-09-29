#!/usr/bin/env python3
# one-off (2026-09-28): DECISIONS 22-24, closing out the QA/illustration/perf pass.
import io, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = os.path.join(ROOT, "docs", "DECISIONS.md")
s = io.open(p, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in s else "\n"
s = s.replace("\r\n", "\n").rstrip("\n")
s += """

## 2026-09-28 (continued): two independent audits of this pass, and a real perf fix

22. **QA playtest (first-time player) found 3 blockers and 9 major issues**, all fixed: a save-wiping "How to play"
    button, unconfirmed erase actions, a self-contradicting saving claim, an off-screen Court board panel, leaked
    developer ids (`CL-0061` etc.) and "MK" in player-facing text, untranslated jargon with no glossary, a dossier
    table with no column headings, a fiddly sorter with no comparison feedback, and squeezed mobile option text.
    All confirmed fixed by six full automated playthroughs post-patch: 0 console errors, 0 developer-text leaks.
23. **The "agency" content pass (rulings/density/option-shape/margin trades) was independently audited**
    (`research/notes/AUDIT-A3-rewrite.md`, a different agent from the one that wrote it): **zero FIX-level findings**
    across all 36 rewritten scenes; every one of AUDIT-A2's 18 flagged scenes was resolved to its suggested wording
    or better. Two MINOR findings from that audit were applied: SCN-0305's cost line now hedges "a ruler whom
    Melvin-Koushki reads as distrusting..." instead of stating it flat; CL-0210/CL-0211's `proposition` and
    `mediation.who` no longer say "the researcher" (pipeline voice visible in the evidence drawer), now "this
    project's own collation ... not stated by him".
24. **Perf: a full-scene re-render on every ruling/pick/sort click was re-fetching the scene's plate image from
    the network each time** (confirmed via `read_network_requests`: repeated 200s, not 304s, for the same URL —
    the known `python -m http.server` no-cache-headers gotcha, see `../CLAUDE.md`). Measured up to ~5.9s per
    scene under automated rapid-fire clicking. Fixed with a session-lifetime blob-URL cache
    (`plateSrc` in `game/ui.js`): a plate is fetched once and referenced from cache on every later render.
    Confirmed after the fix: no scene exceeds 100ms across a 20-scene run (previously several exceeded 4000ms).
    This is chiefly a local-dev-server cost (GitHub Pages sends real cache headers), but the fix removes a
    visible image-reload flash regardless of host and was worth keeping.
"""
io.open(p, "w", encoding="utf-8", newline="").write(s.replace("\n", nl) + nl)
print("ok")
