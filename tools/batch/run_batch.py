#!/usr/bin/env python3
"""
Resumable headless batch runner for TurkaGame / IslamicateOccultPortal.

Reads a JSONL manifest of one-item-per-line tasks and runs each through a headless
`claude -p` invocation. Every task's status is checkpointed to disk the moment it
finishes, so a rate limit, a crash, or Ctrl-C costs you one item — not the sweep.
Re-running the same command resumes: finished tasks are skipped.

This is the batch tier of the model ladder in CONTEXTENGINEERINGGAMEPIPELINES.md.
Interactive sessions are for judgment; this is for the grind.

Task line schema (one JSON object per line in the .jsonl):
    {
      "id":          "unique-slug",                  required
      "prompt":      "what to do",                   required
      "output_file": "relative/path/to/result.md",   required — also the done-marker
      "model":       "claude-haiku-4-5",             optional, default --model flag
      "cwd":         "../IslamicateOccultPortal",    optional, relative to repo root
      "allowed_tools": "Read Write Grep Glob",       optional, default per --allowed-tools
    }

Usage:
    python tools/batch/run_batch.py --tasks tools/batch/tasks/entries.jsonl
    python tools/batch/run_batch.py --tasks ... --dry-run
    python tools/batch/run_batch.py --tasks ... --limit 3          # try a few first
    python tools/batch/run_batch.py --tasks ... --workers 3        # parallel
    python tools/batch/run_batch.py --tasks ... --status           # progress only
    python tools/batch/run_batch.py --tasks ... --force --only id1,id2
"""
import argparse
import json
import shlex
import shutil
import subprocess
import sys
import threading
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_MODEL = "claude-haiku-4-5"
DEFAULT_TOOLS = "Read Write Grep Glob"
TIMEOUT_SECONDS = 900

_status_lock = threading.Lock()
_print_lock = threading.Lock()


def status_path(tasks_path: Path) -> Path:
    return tasks_path.with_suffix(".status.json")


def load_status(tasks_path: Path) -> dict:
    p = status_path(tasks_path)
    if not p.exists():
        return {}
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)


def record_status(tasks_path: Path, task_id: str, entry: dict) -> None:
    """Read-modify-write under a lock. Small files; correctness beats cleverness."""
    with _status_lock:
        status = load_status(tasks_path)
        status[task_id] = entry
        p = status_path(tasks_path)
        tmp = p.with_suffix(".json.tmp")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(status, f, indent=2, ensure_ascii=False)
        tmp.replace(p)


def load_tasks(tasks_path: Path) -> list:
    tasks = []
    with open(tasks_path, "r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            line = line.strip()
            if not line or line.startswith("//"):
                continue
            try:
                task = json.loads(line)
            except json.JSONDecodeError as e:
                sys.exit(f"{tasks_path}:{lineno}: bad JSON — {e}")
            for field in ("id", "prompt", "output_file"):
                if field not in task:
                    sys.exit(f"{tasks_path}:{lineno}: task missing required field '{field}'")
            tasks.append(task)
    ids = [t["id"] for t in tasks]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        sys.exit(f"{tasks_path}: duplicate task ids — {', '.join(sorted(dupes))}")
    return tasks


def task_workdir(task: dict) -> Path:
    return (REPO_ROOT / task.get("cwd", ".")).resolve()


def output_path(task: dict) -> Path:
    return task_workdir(task) / task["output_file"]


def is_done(task: dict) -> bool:
    """A task is done when its output file exists and is non-trivially sized.

    The output file is the source of truth, not the status file — delete the output
    to force a redo, and a half-written file from a kill won't read as complete.
    """
    p = output_path(task)
    return p.exists() and p.stat().st_size > 32


def run_task(task: dict, args, tasks_path: Path) -> str:
    task_id = task["id"]
    workdir = task_workdir(task)
    out = output_path(task)
    model = task.get("model", args.model)
    tools = task.get("allowed_tools", args.allowed_tools)

    cmd = [
        *args.claude_cmd, "-p", task["prompt"],
        "--model", model,
        "--permission-mode", args.permission_mode,
        "--allowed-tools", *tools.split(),
    ]
    budget = task.get("max_budget_usd", args.max_budget_usd)
    if budget:
        # A hard per-task ceiling. One runaway task can't eat the sweep's budget.
        cmd += ["--max-budget-usd", str(budget)]
    if args.dry_run:
        with _print_lock:
            print(f"[dry-run] {task_id}  model={model}  cwd={workdir}")
            print(f"          -> {out}")
        return "dry-run"

    out.parent.mkdir(parents=True, exist_ok=True)
    started = datetime.now(timezone.utc).isoformat()
    try:
        proc = subprocess.run(
            cmd, cwd=workdir, capture_output=True, text=True,
            encoding="utf-8", errors="replace", timeout=TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired:
        record_status(tasks_path, task_id, {
            "state": "failed", "reason": f"timeout after {TIMEOUT_SECONDS}s",
            "model": model, "started": started,
        })
        with _print_lock:
            print(f"  TIMEOUT   {task_id}")
        return "failed"
    except OSError as e:
        # Bad --claude-bin, missing cwd, exec-format error. One task's problem —
        # record it and keep going rather than tearing down the whole sweep.
        record_status(tasks_path, task_id, {
            "state": "failed", "reason": f"could not launch: {e}",
            "model": model, "started": started,
        })
        with _print_lock:
            print(f"  LAUNCH-ERR {task_id}  ({e})")
        return "failed"

    if proc.returncode != 0:
        record_status(tasks_path, task_id, {
            "state": "failed", "reason": f"exit {proc.returncode}",
            "stderr": (proc.stderr or "")[-2000:],
            "model": model, "started": started,
        })
        with _print_lock:
            print(f"  FAILED    {task_id}  (exit {proc.returncode})")
            if proc.stderr:
                print(f"            {proc.stderr.strip().splitlines()[-1][:160]}")
        return "failed"

    # The task prompt is responsible for writing output_file. If it didn't, that's a
    # prompt bug, not a transport bug — surface it rather than silently marking done.
    if not is_done(task):
        record_status(tasks_path, task_id, {
            "state": "failed", "reason": "agent exited 0 but wrote no output file",
            "transcript_tail": (proc.stdout or "")[-2000:],
            "model": model, "started": started,
        })
        with _print_lock:
            print(f"  NO-OUTPUT {task_id}  (exit 0, nothing at {task['output_file']})")
        return "failed"

    record_status(tasks_path, task_id, {
        "state": "done", "model": model, "started": started,
        "finished": datetime.now(timezone.utc).isoformat(),
        "output_file": task["output_file"],
    })
    with _print_lock:
        print(f"  done      {task_id}  -> {task['output_file']}")
    return "done"


def cmd_status(tasks, tasks_path) -> None:
    status = load_status(tasks_path)
    done, failed, pending = [], [], []
    for t in tasks:
        if is_done(t):
            done.append(t)
        elif status.get(t["id"], {}).get("state") == "failed":
            failed.append(t)
        else:
            pending.append(t)
    print(f"{tasks_path.name}: {len(done)}/{len(tasks)} done, {len(failed)} failed, {len(pending)} pending")
    for t in failed:
        print(f"  failed  {t['id']}: {status[t['id']].get('reason', '?')}")
    for t in pending[:10]:
        print(f"  pending {t['id']}")
    if len(pending) > 10:
        print(f"  ... and {len(pending) - 10} more pending")


def main() -> None:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--tasks", required=True, help="path to the .jsonl manifest")
    ap.add_argument("--model", default=DEFAULT_MODEL,
                    help=f"default model (default: {DEFAULT_MODEL})")
    ap.add_argument("--allowed-tools", default=DEFAULT_TOOLS,
                    help=f"default tool allowlist (default: {DEFAULT_TOOLS!r})")
    ap.add_argument("--permission-mode", default="acceptEdits",
                    help="headless permission mode (default: acceptEdits, so Write lands "
                         "without a prompt; tools are still limited by --allowed-tools)")
    ap.add_argument("--max-budget-usd", type=float, default=None,
                    help="hard per-task spend ceiling passed to the CLI, e.g. 0.10")
    ap.add_argument("--limit", type=int, help="run at most N pending tasks then stop")
    ap.add_argument("--only", help="comma-separated task ids to run, ignoring the rest")
    ap.add_argument("--workers", type=int, default=1, help="parallel invocations (default: 1)")
    ap.add_argument("--force", action="store_true", help="re-run tasks even if their output exists")
    ap.add_argument("--dry-run", action="store_true", help="print what would run, invoke nothing")
    ap.add_argument("--status", action="store_true", help="print progress and exit")
    ap.add_argument("--claude-bin", default=shutil.which("claude") or "claude",
                    help="the CLI to invoke. May include arguments — e.g. "
                         "\"npx claude\" or a wrapper script — and is shell-split.")
    args = ap.parse_args()

    # Split once here so run_task doesn't re-parse per task. A bare Windows path
    # containing backslashes must not be treated as escapes, hence posix=False.
    args.claude_cmd = shlex.split(args.claude_bin, posix=False) if " " in args.claude_bin \
        else [args.claude_bin]

    tasks_path = Path(args.tasks).resolve()
    if not tasks_path.exists():
        sys.exit(f"no such manifest: {tasks_path}")
    tasks = load_tasks(tasks_path)

    if args.status:
        cmd_status(tasks, tasks_path)
        return

    if args.only:
        wanted = {s.strip() for s in args.only.split(",")}
        unknown = wanted - {t["id"] for t in tasks}
        if unknown:
            sys.exit(f"unknown task ids: {', '.join(sorted(unknown))}")
        tasks = [t for t in tasks if t["id"] in wanted]

    todo = tasks if args.force else [t for t in tasks if not is_done(t)]
    skipped = len(tasks) - len(todo)
    if args.limit:
        todo = todo[:args.limit]

    print(f"{tasks_path.name}: {len(todo)} to run, {skipped} already done")
    if not todo:
        return

    if args.workers > 1 and not args.dry_run:
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            results = list(pool.map(lambda t: run_task(t, args, tasks_path), todo))
    else:
        results = [run_task(t, args, tasks_path) for t in todo]

    done = results.count("done")
    failed = results.count("failed")
    print(f"\n{done} done, {failed} failed. Resume or retry with the same command.")
    if failed:
        print(f"Failure reasons: python tools/batch/run_batch.py --tasks {args.tasks} --status")
        sys.exit(1)


if __name__ == "__main__":
    main()
