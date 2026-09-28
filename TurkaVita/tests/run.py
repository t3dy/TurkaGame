#!/usr/bin/env python3
# run.py — the whole test suite, plus the pipeline gates the suite does not cover.
#
#   python tests/run.py
import os, subprocess, sys, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
GATES = ["build_artifacts.py", "lint_scenes.py"]


def gates():
    ok = True
    for script in GATES:
        r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", script)],
                           capture_output=True, text=True, encoding="utf-8", cwd=ROOT)
        tail = (r.stdout or "").strip().splitlines()
        print(f"[{'ok ' if not r.returncode else 'FAIL'}] {script}: {tail[-1] if tail else ''}")
        if r.returncode:
            print(r.stdout, r.stderr)
            ok = False
    return ok


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    print("--- pipeline gates ---")
    ok = gates()
    print("\n--- unit tests ---")
    suite = unittest.defaultTestLoader.discover(HERE, pattern="test_*.py", top_level_dir=HERE)
    res = unittest.TextTestRunner(verbosity=1).run(suite)
    return 0 if ok and res.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(main())
