# DEPLOY_STATE

> Read this before touching deploy config. Per the workspace rule in `C:\Dev\CLAUDE.md`:
> this project has more than one hosting path, so the canonical state lives here rather
> than being re-derived each session.

Last verified: **2026-09-01**, commit `ee596fa` — the Visionary Gallery deploy, exercised end to end (see below). Commits after it are verified for Pages build status only.
pressure ladder, witness editor). Verified by fetching the live artifact: `/CareerSim/`
serves `main.js?v=11`, loads 73 encounters including `content/pressure.js`, zero console
errors; witness service `turka-witness.vercel.app` verified separately the same day.

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
| Visionary Gallery (hub) | `/games/visionary-gallery/index.html` |
| Visionary workbench | `/games/visionary-gallery/workbench.html?id=<folio-id>` |
| Visionary Assay / Method | `/games/visionary-gallery/{assay,method}.html` |
| Printable papercraft sheets | `/games/visionary-gallery/assets/<folio-id>/tunnel.svg` |
| Knowledge portal | `/site/portal/index.html` |
| Illustration catalogue | `/site/plates/index.html` |
| Timeline | `/site/timeline.html` |

`/` (repo root `index.html`) is a 300-byte redirect stub into `/site/`.

## Verified live 2026-09-01 (commit `ee596fa`)

Pages build status `built`, commit matching HEAD **at the time of the check**.
A concurrent session pushed `33ffb7a` moments later, so this table is the state of
`ee596fa` specifically — that is the commit whose behaviour was actually exercised,
and naming a commit nobody tested would defeat the point of this file. Checked with
real requests, not assumed:

| Surface | Result |
|---|---|
| `/site/index.html`, `/site/features.html` | 200; Visionary Gallery in nav, design record renders 10 docs |
| `/games/visionary-gallery/{index,workbench,assay,method}.html` | 200; 22 cards, 8 traditions, 15 scholarship chips, scatter painted |
| Workbench Depth tab, live | three.js loaded, 27 quads, station-point invariant **4.6e-16** |
| `/games/yusuf-ascent/proto-a-doors/` | 41 hotspots, L3 "Rests on" block renders |
| `/games/yusuf-ascent/vendor/three.core.js` | 200 — the `.nojekyll` gotcha still held |
| `/games/visionary-gallery/assets/*/tunnel.svg` | 200 (printable sheet, self-contained) |
| `/site/portal/concepts/oneiromancy.html` | 200 |
| 10 design-doc links on features.html | all 200 on github.com/blob/main |

## Repo weight (added 2026-08-31)

The Visionary Gallery adds **~33 MB** of committed web assets under
`games/visionary-gallery/assets/` — 22 folios, their papercraft plates, and 22 printable
SVG sheets with their images embedded as data URIs.

What is deliberately **not** committed, and why it matters if you clone fresh:

| Path | Size | Status |
|---|---|---|
| `research inbox/` | ~57 MB | gitignored — full-size Commons sources |
| `imagelab/output/` | ~130 MB | gitignored — cut sprites, debug maps, full-size papercraft |
| `games/visionary-gallery/assets/` | ~33 MB | **committed** — the web-ready subset |

A fresh clone can serve the site but **cannot re-run the analysis** until
`python imagelab/scripts/fetch_commons.py` re-downloads the sources. That is by design:
the intermediates are fully regenerable from four scripts, so committing them buys nothing.

If the committed weight ever needs to come down, `build_gallery.py` takes
`--svg-px`, `--folio-px` and `--plate-px`; the current build uses `340 / 820 / 480`. The
SVG sheets are about 13 MB of the 33 and are the first place to cut.

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

**3a. The Visionary Gallery imports three.js from Yūsuf Ascent's `vendor/`.**
`games/visionary-gallery/workbench.js` imports
`../yusuf-ascent/vendor/three.module.js` rather than keeping a second 2 MB copy — so the
gallery's 3D tab depends on `.nojekyll` too (gotcha 1). If `vendor/` ever moves, both
surfaces break, and only one of them will be the obvious suspect.

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
