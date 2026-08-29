# TurkaGame — Visual Novel

**Playable prototype.** Full 40-choice, 8-act skeleton — real state tracking (Occult
Quintet skill tree + one flag per choice), real gates (an early choice can close off
a later option), real computed endings. Prose is intentionally thin/placeholder per
the "full skeleton, all 8 acts, thin prose" scope decision
([docs/DECISIONS.md](../../docs/DECISIONS.md)) — this proves the mechanical system,
it is not the final VN text.

## Run it

```bash
python -m http.server 7523    # from C:\Dev\TurkaGame
```
Then open `http://localhost:7523/games/visual-novel/index.html`. Or use
`preview_start` with launch.json config name `turkagame-vn`.

Debug handle: `window.__turkaVN` (state, choices, `.restart()`).

## Files

- `index.html` — page shell.
- `js/state.js` — skills + flags + gate-checking + localStorage save (`turkagame_vn_save_v1`).
- `js/narrative.js` — thin per-choice scene text (**placeholder — not final prose**).
- `js/endings.js` — computes one of ~7 named endings from final state.
- `js/assets.js` — act-backdrop image paths (8 real manuscript images, no invented
  character portraits — see [docs/DECISIONS.md](../../docs/DECISIONS.md) "Image role").
- `js/ui.js` / `js/main.js` — rendering and orchestration.
- `choices.json` — the 40-choice data graph (source of truth; engine reads this at
  runtime via `fetch`, nothing is duplicated into the JS).

Architecture forked from [EmblemNovel](../../../EmblemNovel/)'s scene-graph pattern
(`state.js`/`scenes.js`/`main.js` shape), not its content.

## Assets

The 8 act-backdrop images are real, rights-cleared Islamicate manuscript images
sourced from **OCCULTIMGDB** (`C:\Dev\OCCULTIMGDB`) and registered into this
project's own [assets/manuscripts/registry.json](../../assets/manuscripts/registry.json)
via `register_asset.py` — full provenance (institution, rights, source URL) on each.
Manuscripts, diagrams, and objects only; no invented portraits of Ibn Turka or anyone
else (real manuscripts don't depict his face, and Islamicate figural-depiction
conventions vary by genre/period — see `docs/GAME_VISUAL_NOVEL.md`).

## What's NOT here yet

- Real narrative prose (the current text is one line per choice, placeholder-quality).
- Any illustration more specific than one backdrop per act (40 choices, 8 images).
- Sound, transitions, a proper title/menu screen.
