# tools/batch

Resumable headless batch runner. Full rationale — which model for which job, how much
corpus to put in a context, why the VN is deliberately *not* batched — is in
[CONTEXTENGINEERINGGAMEPIPELINES.md](../../CONTEXTENGINEERINGGAMEPIPELINES.md) §6.

```bash
python tools/batch/make_tasks.py --list          # what generators exist
python tools/batch/make_tasks.py images --limit 50
python tools/batch/run_batch.py --tasks tools/batch/tasks/images.jsonl --limit 5
```

**Always `--limit 5` and read the output before the full sweep.** That's the step that
catches a bad rubric while it has cost five items instead of five hundred.

Re-running the identical command resumes — an output file that already exists is skipped,
so a rate limit costs one item, not the run. `--status` shows progress and failure reasons.

`tasks/*.jsonl` and `tasks/*.status.json` are generated; regenerate them rather than
hand-editing.

**Known limitation:** `claude -p` hangs when invoked from inside a running Claude Code
session. Run sweeps from your own terminal.
