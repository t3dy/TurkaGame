# DEPLOY_STATE

**Not deployed (2026-09-27).** No git commit, no push. This file exists so nobody has to reconstruct the position.

| item | value |
|---|---|
| canonical URL (planned) | `https://t3dy.github.io/TurkaGame/TurkaVita/game/` |
| host | GitHub Pages, from the `TurkaGame` repo (`git push origin main` is the whole deploy; see `../DEPLOY_STATE.md`) |
| what is served | `TurkaVita/game/` only: `index.html`, `style.css`, `turka.css`, `engine.js`, `ui.js`, `content.js` (generated). No build step, no base-path env var: every asset is relative |
| local | `preview_start turkavita` (port 7560, config in `../.claude/launch.json`), serving `TurkaVita/game` as root |
| server needed | no (static). Hosting policy: Pages, not Vercel |
| secrets | none |
| gotchas | `.nojekyll` at the repo root is load-bearing (see `../DEPLOY_STATE.md`); bump `?v=` in `game/index.html` after every `export_game.py`; Google Fonts are linked from `fonts.googleapis.com` and the game degrades to serif fallbacks offline |
| before pushing | run `python tools/check_repo_rules.py --staged` from `TurkaGame/` (it blocks PDFs and enforces the repo's rules); `TurkaVita/.gitignore` already excludes `db/*.db` and `*.pdf`; `research/artifacts/` holds short verified quotations from a copyrighted dissertation, attributed, under 40 words each (the build enforces both) — Ted should look at that once before it goes on a public repo |
| verification after deploy | fetch the live URL and play the 1422–1427 path there (Herat, Yazd, the two composers); a green push is not a deploy |
