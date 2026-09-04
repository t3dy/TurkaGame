#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""check_repo_rules.py — enforce this project's house rules in code, not in prose.

Written 2026-09-01, after 43 copyrighted PDFs (55.3 MB) were found tracked on the
default branch of a public repo for weeks. The rule forbidding them had existed in
CLAUDE.md the whole time, in those words: "Never commit a PDF." Prose does not
enforce anything.

The counter-example in this repo is imagelab/scripts/fetch_commons.py, which
refuses non-free licences *in code* — which is why the image corpus has no
equivalent problem. This script generalises that.

Checks, each mapped to the CLAUDE.md rule it enforces:

  R1  No copyrighted source documents tracked (PDF/EPUB/DJVU/MOBI/AZW).
      "No copyrighted source PDFs in the repo ... Never commit a PDF."
  R2  Every image under assets/manuscripts/ has a registry.json record.
      "No manuscript image goes into assets/ without a provenance record."
  R3  Every registry record points at a file that exists.
  R4  Registry records carry a rights note (the field that gates shipping).
  R5  Gitignored-by-intent research trees are not tracked anyway — the exact
      trap that caused the PDF incident, since .gitignore does not untrack
      files already tracked.

Usage:
    python tools/check_repo_rules.py            # check the tracked tree (HEAD/index)
    python tools/check_repo_rules.py --staged   # check only what is staged (hook mode)
    python tools/check_repo_rules.py --sha256   # also verify registry checksums (slow)

Exit code 0 = clean, 1 = violations. Install the pre-commit hook with:
    python tools/install_hooks.py
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGISTRY = ROOT / "assets" / "manuscripts" / "registry.json"
ASSET_DIR = "assets/manuscripts/"

# R1 — source-document formats that should never be tracked. Deliberately narrow:
# these are the shapes scholarly PDFs arrive in, not "all binaries".
FORBIDDEN_SUFFIXES = {".pdf", ".epub", ".djvu", ".mobi", ".azw", ".azw3"}

# R5 — trees whose whole purpose is local-only research material.
LOCAL_ONLY_PREFIXES = (
    "research inbox/",
    "research/library/",
    "portal/corpus/sources/",
    "imagelab/output/",
)

IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".gif"}


def git(*args: str) -> list[str]:
    out = subprocess.run(["git", *args], cwd=ROOT, capture_output=True)
    if out.returncode != 0:
        return []
    return [l for l in out.stdout.decode("utf-8", "replace").splitlines() if l.strip()]


def tracked_files(staged_only: bool) -> list[str]:
    if staged_only:
        # Added/copied/modified/renamed in the index — what this commit would add.
        return git("diff", "--cached", "--name-only", "--diff-filter=ACMR")
    return git("ls-files")


class Report:
    def __init__(self):
        self.violations: list[tuple[str, str]] = []
        self.notes: list[str] = []

    def fail(self, rule: str, msg: str):
        self.violations.append((rule, msg))

    def note(self, msg: str):
        self.notes.append(msg)

    @property
    def ok(self) -> bool:
        return not self.violations


def check(files: list[str], do_sha: bool) -> Report:
    r = Report()

    # --- R1: no tracked source documents ---------------------------------
    bad = [f for f in files if Path(f).suffix.lower() in FORBIDDEN_SUFFIXES]
    for f in sorted(bad):
        r.fail("R1", "copyrighted source document tracked: %s" % f)
    if bad:
        r.note("R1 fix: `git rm --cached -- <file>` keeps your local copy and stops "
               "publishing it. Note that adding a .gitignore rule does NOT untrack a "
               "file that is already tracked — that is exactly how 43 PDFs stayed on "
               "this public repo for weeks.")

    # --- R6: v2 module cache-busting tokens must all agree ---------------
    # Earned the hard way. v2's engine files are imported as `world.js?v=1`, and
    # world.js was changed WITHOUT bumping that token — so every browser that had
    # visited an earlier build kept running the old engine. The deployed file was
    # correct and the running code was not, which is the worst shape a bug can
    # take: the fix was already live and invisible. A stale alif fell through a
    # floor it was supposed to hold.
    #
    # There is no build step to hash filenames, so the invariant is simply that
    # every `?v=N` in v2 is the SAME N, and changing the engine means bumping them
    # all together. That turns a silent cache bug into a failed check.
    tokens = {}
    for f in files:
        if not f.startswith("v2/") or Path(f).suffix not in (".js", ".html"):
            continue
        fp = ROOT / f
        if not fp.exists():
            continue
        for m in re.finditer(r"\.js\?v=(\d+)", fp.read_text(encoding="utf-8")):
            tokens.setdefault(m.group(1), []).append(f)
    if len(tokens) > 1:
        summary = ", ".join("v=%s in %d file(s)" % (k, len(set(v))) for k, v in sorted(tokens.items()))
        r.fail("R6", "v2 module cache-busting tokens disagree: %s" % summary)
        r.note("R6 fix: make every `?v=N` under v2/ the same number, and bump them "
               "all whenever an engine file changes. Mismatched tokens mean a "
               "browser can run a mix of old and new modules.")

    # --- R5: local-only trees must not be tracked ------------------------
    for pref in LOCAL_ONLY_PREFIXES:
        leaked = [f for f in files if f.startswith(pref)]
        if leaked:
            r.fail("R5", "%d file(s) tracked under local-only tree %r, e.g. %s"
                   % (len(leaked), pref, leaked[0]))

    # --- R2/R3/R4: manuscript assets need provenance ---------------------
    if not REGISTRY.exists():
        r.note("R2 skipped: no registry.json at %s" % REGISTRY.relative_to(ROOT))
        return r

    try:
        records = json.load(io.open(REGISTRY, encoding="utf-8"))
    except Exception as e:                                   # noqa: BLE001
        r.fail("R2", "registry.json does not parse: %s" % e)
        return r
    if isinstance(records, dict):
        records = records.get("assets", [])

    by_file = {}
    for rec in records:
        lf = rec.get("local_file")
        if lf:
            by_file.setdefault(lf, rec)

    # R2 — every tracked image in the asset dir has a record.
    assets = [f for f in files
              if f.startswith(ASSET_DIR) and Path(f).suffix.lower() in IMAGE_SUFFIXES]
    for f in sorted(assets):
        name = Path(f).name
        if name not in by_file:
            r.fail("R2", "asset has no registry record: %s" % f)

    # R3/R4 — records point at real files, and carry a rights note.
    # Only meaningful on a full-tree run; a staged run sees a partial picture.
    if not assets or len(files) > len(assets):
        for name, rec in sorted(by_file.items()):
            p = ROOT / ASSET_DIR / name
            if not p.exists():
                r.fail("R3", "registry record %r points at a missing file: %s"
                       % (rec.get("id", name), name))
                continue
            if not (rec.get("rights_note") or "").strip():
                r.fail("R4", "registry record %r has no rights_note: %s"
                       % (rec.get("id", name), name))
            if do_sha and rec.get("sha256"):
                h = hashlib.sha256(p.read_bytes()).hexdigest()
                if h != rec["sha256"]:
                    r.fail("R3", "sha256 mismatch for %s (registry %s..., file %s...)"
                           % (name, rec["sha256"][:12], h[:12]))

    return r


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--staged", action="store_true",
                    help="check only staged additions (pre-commit hook mode)")
    ap.add_argument("--sha256", action="store_true",
                    help="also verify registry checksums against the files")
    args = ap.parse_args()

    files = tracked_files(args.staged)
    scope = "staged" if args.staged else "tracked"
    if not files:
        print("check_repo_rules: nothing %s to check" % scope)
        return 0

    rep = check(files, args.sha256)

    if rep.ok:
        print("check_repo_rules: OK — %d %s file(s), no violations" % (len(files), scope))
        for n in rep.notes:
            print("  note: %s" % n)
        return 0

    print("check_repo_rules: %d VIOLATION(S) across %d %s file(s)\n"
          % (len(rep.violations), len(files), scope), file=sys.stderr)
    for rule, msg in rep.violations:
        print("  [%s] %s" % (rule, msg), file=sys.stderr)
    if rep.notes:
        print("", file=sys.stderr)
        for n in rep.notes:
            print("  %s" % n, file=sys.stderr)
    print("\nRules are in CLAUDE.md. To bypass deliberately: git commit --no-verify",
          file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
