---
title: Runbook — purging the copyrighted PDFs from git history
description: The remaining half of the 2026-09-01 exposure. Destructive, needs the repo owner's decision and every other session paused. Written so the decision is the only hard part.
status: NOT DONE — awaiting a decision
---

# Runbook: purge `research inbox/*.pdf` from git history

## What is and is not already fixed

| | State |
|---|---|
| PDFs on the default branch | **Removed** (`65b382f`, 2026-09-01) |
| `github.com/.../blob/main/...` | 404 |
| `raw.githubusercontent.com/.../main/...` | 404 (after its 5-minute CDN cache expired) |
| GitHub API directory listing | 404 |
| Recurrence prevented | `.gitignore` line 23 **plus** the `tools/hooks/pre-commit` gate |
| **PDFs in git history** | **Still present — this runbook** |

So the ongoing publication is stopped. What remains is that a **SHA-pinned URL still
resolves**: anyone who knows or guesses an old commit can still fetch the files, and any
existing clone or fork already has them.

## Why this is not already done

It is destructive and it is not a one-person decision:

- It rewrites every commit SHA from the first offending commit onward.
- It **breaks every existing clone**. Collaborators must re-clone or hard-reset; a `git
  pull` on a rewritten history produces a mess.
- It requires a **force-push to `main`**, which this repo has never needed.
- At the time of discovery a **concurrent session was actively committing** to this repo.
  Rewriting under it would have destroyed work in flight.

Doing that unilaterally, mid-session, on someone else's public repo is not a call to make
without asking. Hence this file.

## Decide first

**Is it worth it?** Honest assessment of the residual risk:

- The repo is public, has **0 forks and 0 stars**, and the exposure window was weeks on a
  low-traffic repo. The realistic audience for a SHA-pinned URL to a paywalled PDF is
  approximately nobody.
- Against that: it is a real copyright exposure, the papers are a living scholar's work,
  and the project's own rule is unambiguous.
- GitHub will not guarantee removal of every cached object even after a rewrite; you have
  to ask Support to purge, and forks are outside your control (there are none here, which
  is the single biggest thing in favour of doing it *now* rather than later).

**If the answer is "not worth the disruption"**, that is defensible given 0 forks — but
record the decision in `docs/DECISIONS.md` rather than letting it lapse silently, and
revisit if the repo ever gains forks or attention.

**If the answer is yes**, the rest of this file is the procedure.

## Before you start

- [ ] Every other session/agent working in this repo is **stopped**. Confirm, do not assume.
- [ ] `git status` is clean, or the work in progress is committed/stashed deliberately.
- [ ] A full backup exists: `git clone --mirror https://github.com/t3dy/TurkaGame.git turkagame-backup.git`
- [ ] You have `git-filter-repo` (`pip install git-filter-repo`). **Do not use
      `git filter-branch`** — it is slow, error-prone, and GitHub's own docs steer away
      from it. BFG is an acceptable alternative.

## Procedure

```bash
# 1. Work on a fresh mirror, never on your working clone.
git clone --mirror https://github.com/t3dy/TurkaGame.git turkagame-purge.git
cd turkagame-purge.git

# 2. Confirm what you are about to remove (expect 43 paths).
git log --all --diff-filter=A --name-only --pretty=format: \
  | grep -i '^research inbox/.*\.pdf$' | sort -u | tee /tmp/purge-list.txt
wc -l /tmp/purge-list.txt

# 3. Rewrite. --invert-paths means "remove these", everything else is kept.
git filter-repo --path 'research inbox/' --invert-paths --force

# 4. Verify the rewrite: both must print 0.
git log --all --diff-filter=A --name-only --pretty=format: \
  | grep -ci '^research inbox/' || echo 0
git rev-list --objects --all | grep -ci 'research inbox/' || echo 0

# 5. Sanity-check that the project survived: the gallery and games must still be there.
git ls-tree -r --name-only HEAD | grep -c '^games/visionary-gallery/'   # expect ~200+
git ls-tree -r --name-only HEAD | grep -c '^games/yusuf-ascent/'        # expect ~60+

# 6. Push the rewrite. This is the irreversible step.
git remote add origin https://github.com/t3dy/TurkaGame.git   # filter-repo drops remotes
git push --force --all origin
git push --force --tags origin
```

## After

- [ ] **Re-clone your working copy.** Do not try to reconcile the old one:
      `mv TurkaGame TurkaGame.old && git clone https://github.com/t3dy/TurkaGame.git`
- [ ] Re-run `python tools/install_hooks.py` in the fresh clone (hooks config is local).
- [ ] Re-run `python tools/check_repo_rules.py --sha256` — expect clean.
- [ ] Confirm Pages rebuilt and the site is live:
      `gh api repos/t3dy/TurkaGame/pages/builds/latest --jq '.status + " " + .commit'`
      then check `https://t3dy.github.io/TurkaGame/games/visionary-gallery/index.html`.
- [ ] **Ask GitHub Support to purge cached views**, citing the old SHAs. Rewriting does not
      by itself unreachable-ise every cached object:
      <https://docs.github.com/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository>
- [ ] Record the outcome in `docs/DECISIONS.md`, including the date and the commit range.
- [ ] Note that `DEPLOY_STATE.md` cites specific SHAs (`ee596fa`, `65b382f`, `a2646a8`)
      that **will no longer exist**. Update it, or add a line saying the pre-rewrite SHAs
      are historical.

## What this does not fix

- Existing clones and forks. There are **0 forks today**, which is why doing this sooner is
  cheaper than doing it later.
- Anything already downloaded by a third party.
- Search-engine or archive caches of the file listing.

## Related

- `docs/DECISIONS.md` § 2026-09-01 — how the PDFs came to be tracked, and what was verified.
- `DEPLOY_STATE.md` gotcha 2a — the retroactive-gitignore trap.
- `tools/check_repo_rules.py`, `tools/hooks/pre-commit` — the enforcement that now prevents
  recurrence, verified against the historical bad state.
