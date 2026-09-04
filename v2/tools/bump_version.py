# -*- coding: utf-8 -*-
"""bump_version.py — raise the v2 module cache-busting token, everywhere, at once.

WHY THIS EXISTS
---------------
v2's modules are imported as `world.js?v=N`. There is no build step to hash
filenames, so that token is the only thing telling a browser its cached copy is
stale. Twice now an engine file has been changed WITHOUT bumping it, and both
times the result was the same and the worst kind: the deployed file was correct,
the running code was not, and every test passed locally.

  * `world.js` gained the axis rule; browsers kept the old settle, and an alif
    that should have stood on nothing fell through the floor on the live site.
  * `ledger.js` gained `identify()`; the page threw "not a function" against a
    file that plainly had it.

Rule **R6** in `tools/check_repo_rules.py` caught neither, because it only checked
that the tokens AGREE with each other — and they did, at the stale value. So R6
now also checks that the token has moved whenever the engine has, using the hash
recorded here. This script is what keeps that record honest.

    python v2/tools/bump_version.py            # bump the token and re-record
    python v2/tools/bump_version.py --record   # re-record without bumping
                                               # (use after a deliberate no-op edit)
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
V2 = ROOT / "v2"
ENGINE = V2 / "engine"
STAMP = ENGINE / "VERSION.json"
# Scripts AND stylesheets: a hand.css cached at an old token repaints the page
# in the wrong palette while the canvas draws in the right one.
TOKEN_RE = re.compile(r"(\.(?:js|css)\?v=)(\d+)")


def engine_hash() -> str:
    """A digest of every engine module — the thing a browser might cache."""
    h = hashlib.sha256()
    for p in sorted(ENGINE.glob("*.js")):
        h.update(p.name.encode("utf-8"))
        h.update(p.read_bytes())
    return h.hexdigest()


def files_with_tokens():
    for p in sorted(V2.rglob("*")):
        if p.suffix not in (".js", ".html", ".css") or not p.is_file():
            continue
        text = p.read_text(encoding="utf-8")
        if TOKEN_RE.search(text):
            yield p, text


def current_tokens():
    seen = {}
    for p, text in files_with_tokens():
        for m in TOKEN_RE.finditer(text):
            seen.setdefault(m.group(2), []).append(p.relative_to(ROOT).as_posix())
    return seen


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--record", action="store_true",
                    help="re-record the engine hash without bumping the token")
    args = ap.parse_args()

    seen = current_tokens()
    if not seen:
        print("no ?v= tokens found under v2/", file=sys.stderr)
        return 1
    if len(seen) > 1:
        print("tokens already disagree: %s — fix that first (R6)"
              % ", ".join("v=%s in %d file(s)" % (k, len(set(v))) for k, v in sorted(seen.items())),
              file=sys.stderr)
        return 1

    old = int(next(iter(seen)))
    new = old if args.record else old + 1

    if new != old:
        n = 0
        for p, text in files_with_tokens():
            p.write_text(TOKEN_RE.sub(lambda m: m.group(1) + str(new), text), encoding="utf-8")
            n += 1
        print("token %d -> %d in %d file(s)" % (old, new, n))

    stamp = {
        "_note": ("The v2 module cache-busting token, and a hash of the engine files it "
                  "covers. check_repo_rules.py R6 fails the commit if the engine hash has "
                  "moved without the token moving with it — because a stale module is a bug "
                  "that passes every local test and breaks only in a browser that has been "
                  "here before."),
        "token": new,
        "engine_sha256": engine_hash(),
        "engine_files": sorted(p.name for p in ENGINE.glob("*.js")),
    }
    with io.open(STAMP, "w", encoding="utf-8") as f:
        json.dump(stamp, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("recorded token=%d engine=%s…" % (new, stamp["engine_sha256"][:12]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
