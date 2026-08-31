# DEPLOY_STATE

> Read this before touching deploy config. Per the workspace rule in `C:\Dev\CLAUDE.md`:
> this project has more than one hosting path, so the canonical state lives here rather
> than being re-derived each session.

Last verified: **2026-08-31**, commit `4268216`.

## Canonical production URL

**https://t3dy.github.io/TurkaGame/**

| | |
|---|---|
| Host | GitHub Pages |
| Repo | `github.com/t3dy/TurkaGame` |
| Source | branch `main`, path `/` (the repo root **is** the web root) |
| Build type | `legacy` (Jekyll) — see the gotcha below |
| Custom domain | none (`cname: null`) |
| HTTPS | enforced |

Deploying is just `git push origin main`. There is no build step and no workflow file;
Pages builds the repo root directly.

Check what Pages actually built — not what you pushed:

```bash
gh api repos/t3dy/TurkaGame/pages/builds/latest --jq '.status + " " + .commit'
```

That commit must match `git rev-parse HEAD`. A green push is not a deploy.

## What is served where

Everything is one Pages site off the repo root. There is no separate host for any of it.

| Surface | Path |
|---|---|
| Landing page | `/site/index.html` |
| Career sim | `/CareerSim/index.html` |
| Visual novel | `/games/visual-novel/index.html` |
| Yūsuf Ascent (hub) | `/games/yusuf-ascent/index.html` |
| Yūsuf Ascent prototypes | `/games/yusuf-ascent/proto-{a-doors,b-stack,c-ladder}/index.html` |
| Yūsuf research portal | `/games/yusuf-ascent/portal/index.html` |
| Knowledge portal | `/site/portal/index.html` |
| Illustration catalogue | `/site/plates/index.html` |
| Timeline | `/site/timeline.html` |

`/` (repo root `index.html`) is a 300-byte redirect stub into `/site/`.

## Gotchas

**1. Jekyll excludes `vendor/` and `_`-prefixed files. `.nojekyll` is what stops it.**
This is the big one. Pages builds this repo with the *legacy* Jekyll pipeline, which by
default drops any `vendor/` directory and anything whose name starts with `_`. That would
silently 404:

- `games/yusuf-ascent/vendor/three.core.js` and `three.module.js` — Prototype B's only
  dependency. It would work perfectly on localhost and be broken in production.
- `imagelab/output/_mattes.png`, `_portraits.png`, `_verify.png`, `imagelab/data/_palettes.json`

`.nojekyll` at the repo root (added 2026-08-31) disables Jekyll entirely and makes Pages
serve the tree verbatim. **Do not delete it**, and if you ever see a production-only 404 on
a file that exists locally, check that it still exists before debugging anything else.

**2. CareerSim is currently served from *this* Pages site, not Vercel.**
`CLAUDE.md` says the career sim "will deploy separately (Vercel + Supabase), not via this
repo's GitHub Pages". That is the *plan*, not the current state: `CareerSim/index.html` is
in this repo and live at `/CareerSim/index.html` (verified 200). When the Vercel deploy
actually happens, update this file and the landing-page link in `site/index.html` in the
same change, or the two will disagree silently.

**3. Browser cache will lie to you during verification.**
Verifying a change locally on `localhost:7521` served a stale `site/index.html` until a
cache-busting query string was added. Append `?cb=<something>` when checking a change you
just made, on localhost and on production alike.

**4. Another session may be holding port 7521.**
`.claude/launch.json` pins `turkagame-site` to 7521 with no `autoPort`. If a concurrent
session already has it, don't fight for the port — that server serves the same repo root
from disk, so just navigate to it.

## Verification checklist

Before claiming a deploy is done:

1. `git rev-parse --short HEAD` and confirm the push landed.
2. Poll `gh api repos/t3dy/TurkaGame/pages/builds/latest` until `built`, and confirm the
   commit matches HEAD.
3. `curl -o /dev/null -w '%{http_code} %{size_download}'` every path the change touched —
   **including any `vendor/` or `_`-prefixed asset**, which are the ones that fail silently.
4. Load the changed page in a browser at the production URL, check the console for errors,
   and exercise the thing that changed. For Prototype B, run
   `__yusufB.checkStationInvariant()` in the console — it should return `pass: true` with a
   worst-case drift around `1.2e-16`.
