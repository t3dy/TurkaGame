#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""install_hooks.py — point git at this repo's tracked hooks.

Git hooks live in .git/hooks, which is NOT tracked, so a hook committed to the
repo does nothing until each clone opts in. This sets core.hooksPath to the
tracked tools/hooks/ directory, which makes the hook travel with the repo and
survive re-cloning.

    python tools/install_hooks.py            # install
    python tools/install_hooks.py --status   # show current setting
    python tools/install_hooks.py --remove   # revert to .git/hooks

Bypass a single commit with `git commit --no-verify` when you mean to.
"""

from __future__ import annotations

import argparse
import os
import stat
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOOKS = ROOT / "tools" / "hooks"


def git(*args: str) -> str:
    out = subprocess.run(["git", *args], cwd=ROOT, capture_output=True)
    return out.stdout.decode("utf-8", "replace").strip()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--remove", action="store_true")
    args = ap.parse_args()

    current = git("config", "--get", "core.hooksPath")

    if args.status:
        print("core.hooksPath = %s" % (current or "(unset — using .git/hooks)"))
        for h in sorted(HOOKS.glob("*")):
            if h.is_file():
                print("  available: %s" % h.name)
        return 0

    if args.remove:
        subprocess.run(["git", "config", "--unset", "core.hooksPath"], cwd=ROOT)
        print("core.hooksPath unset — git is back to .git/hooks")
        return 0

    if not HOOKS.is_dir():
        print("no tools/hooks directory", file=sys.stderr)
        return 1

    # Make hooks executable where the filesystem cares (POSIX; harmless on Windows).
    for h in HOOKS.glob("*"):
        if h.is_file():
            try:
                h.chmod(h.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
            except OSError:
                pass

    rel = os.path.relpath(HOOKS, ROOT).replace("\\", "/")
    subprocess.run(["git", "config", "core.hooksPath", rel], cwd=ROOT, check=True)
    print("core.hooksPath = %s" % rel)
    print("installed:")
    for h in sorted(HOOKS.glob("*")):
        if h.is_file():
            print("  %s" % h.name)
    print("\nTry it:  python tools/check_repo_rules.py --staged")
    print("Bypass:  git commit --no-verify")
    return 0


if __name__ == "__main__":
    sys.exit(main())
