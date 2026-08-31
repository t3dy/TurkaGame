# AUDIT.md — Whole-Loop Systems Audit

**Date**: 2026-08-31 · **Auditor**: agent session (fable), evidence-based — every claim
below was verified by grep/test/play, not recalled. **Scope**: does the loop the code
actually implements produce the simulator DESIGN.md promises — *a career roguelike about
making a universal science real*, that is also a **great educational game**?

**Overall verdict**: the skeleton is genuinely the designed animal — capability×affordance
encounters with visible provenance, compounding exposure, obligations/contracts, a two-axis
legacy verdict, all tested (21 passing) and live. But three subsystems are **wired in and
not load-bearing** (artifacts, half the Quintet, most people-capabilities), and the
**educational layer is thinner than the fiction deserves** — the game *shows* real history
but rarely *teaches* it on purpose. The inventory below ranks the gaps; items marked ✅
were fixed in this same session, with evidence.

---

## 1. Module-by-module

| Module | State | Verdict |
|---|---|---|
| `src/engine/state.js` | meters/reps/quintet/memory, requirement grammar, effects, saves | **Sound.** Grammar covers every gate content uses. One gap: no `artifact:` requirement → §2.1 |
| `src/engine/engine.js` | eligibility (phase/exposure/memory), options w/ unlockedBy, gradient bands | **Sound.** `opt.time` extra-cost field implemented but used ~1×/phase — fine, underused not broken |
| `src/engine/career.js` | exposure tiers, obligations, contracts+settlement, 14×9 fate matrix, LEGACY_NOTES | **Sound after 8-31 tuning.** Marginalia contradiction remains → §2.4 |
| `content/` 5 phases | 58 encounters, all grounded+sourced, memory-linted | **Good, unevenly deep** (I:14 … IV/V:9 each) → §3.2 |
| `content/people.js` | 11 people, 6 artifacts, capability grants | **Half-inert**: only `poetry`+`geomancy` cap-tags ever read; artifacts grant nothing → §2.1, §2.2 |
| `src/ui.js` + CSS | all style-guide templates, glosses, marginalia onboarding, turn banner | **Strong.** Gaps: artifacts invisible in margin; no historical-term glossing → §2.1, §4.1 |
| Tests (`tools/`) | 21 passing incl. Chekhov lint, plate↔registry lint, fate differentiation | **Strong** — the lints are the project's discipline made executable |
| Assets | 27 registry entries, 20 plates placed, all provenance-captioned | **Sound.** Phase II has only 2 plates (weakest visually) |
| Docs | DESIGN/SYSTEMS/UI guide/ROADMAP/DECISIONS/HANDOVER current | **Sound**; SYSTEMS §6 "demand profiles" documented but unimplemented → §3.4 |

## 2. Integration failures (systems that don't reach each other)

### 2.1 Artifacts are inert — ✅ FIXED this session
`state.artifacts` was written 12× by content and read **zero** times: no margin display, no
`artifact:` requirement, no capability grants. A player who composed the Ṭahawī Circle got a
chip and nothing else — violating the core rule that *preparation creates verbs*.
**Fix applied**: `artifact:` requirement/boost support in the grammar (names resolved from
the registry), a WORKS margin block with glosses, and content now gates/boosts on the
works: the Circle and the summa strengthen the third-tribunal defense, the letter-grid
manuscript feeds the Isfahan study, the *horoscope* is read at the trials.

### 2.2 Two of five sciences were dead ends — ✅ FIXED this session
`kimiya` and `simiya`: granted in Cairo, **never required or boosted anywhere after**
(grep-verified). Choosing Akhlāṭī's furnace was mechanically meaningless — precisely the
VN's old "kīmiyā vs rīmiyā produce the same game" defect, reborn. **Fix applied**: kīmiyā
now unlocks the warrāq's ink-chemistry problem (Phase II) and boosts the courier-cipher
work (III); sīmiyā gets its attested signature moment — escape by misdirection — at the
exile checkpoint (V), plus a feast boost. Every science now opens ≥1 door after Cairo
(lint-enforced, see §5).

### 2.3 People-capability tags mostly unread — **PARTIAL, deliberate**
People grant ~20 cap-tags; only `poetry`/`geomancy` were read. But people are *also* read
via `person:` gates (16 sites) and boosts, so companions do function. The unused tags are
declared surface for future content, not broken plumbing. **Decision**: leave tags in
place; new content should prefer `cap:` over `person:` so equipment-like sources can
substitute later (DungeonAB's lesson). Not blocking.

### 2.4 Contradictory marginalia co-fire — ✅ FIXED this session
`taught_widely` + `hoarded` can both be true (different phases) and printed as flat
contradiction. **Fix applied**: precedence pass in `legacyNotes` merges the pair into one
line about the tension itself — which is truer to the history anyway.

## 3. Content-shape findings

### 3.1 Replay variety is thin in the late game
Phases IV–V (9 encounters each, 5–6 nodes) — a single run sees ~80% of the pool.
**✅ RESOLVED (same day, second pass)**: pools now I:14 · II:14 · III:16 · IV:13 · V:13
(70 total) — every phase at or above the ≥12 bar, with the floor lint-enforced
(`pool shrank below 11` test). Mined from VN c11–c40 (the Bāysunghur Qurʾan, the
sensory-theory quarrel with Avicenna, source-crediting, the grimoire commission, exile
destination, the testament) and *Boon for the Khan*'s operation categories,
paraphrased per the research note's caution (the suffumigation army-of-smoke, sleeper
interrogation as bazm comedy, the wake-rite). The comedic register now exists.

### 3.2 Attested gems still un-mined
In BIOGRAPHY but absent from play before this session: the **Three Globes of Light**
(Planet/Pearl/Peach — *Investigations*' own structure), the ascent–descent–ascent journey,
"form is content". ✅ Now a Phase IV encounter. Still un-mined (inventory): VN choices
c11–c40 (only acts 1–2 were converted), the Bāysunghur Qurʾan as an encounter, *Boon for
the Khan*'s named operations (sleeper interrogation, treasure dowsing, instant
agriculture) as bazm/razm content, the seven-tier hierarchy (**blocked** on the missing
source — do not invent; see parent DECISIONS).

### 3.3 The historical run needs its witness
The game's thesis requires the player to *feel* the counterfactual against the attested
life — but the ending never told them what actually happened. **✅ FIXED**: the ending now
carries "The Attested Life" folio — the historical record beside your run, with per-run
divergence lines (kept/refused the bench, tribunal outcomes vs. the record, Yazdī's copy).
This is the single highest-value educational feature the game lacked.

### 3.4 Demand profiles: documented, not implemented — **DEFERRED, recorded**
SYSTEMS.md §6 promises per-court demand (Samarkand hungers for astronomy…). In practice
Phase III's node/court structure already differentiates courts qualitatively, and contracts
carry the economic pressure. Building a numeric demand layer now would add UI weight
before a human has even playtested the base loop. Defer to Slice 3/4; SYSTEMS.md annotated.

## 4. Educational-experience findings

### 4.1 Real terms appear unexplained — ✅ FIXED this session
*muwaqqit* (12×), *bazm/razm* (22×), *wafq* (7×), *warrāq*, *qāḍī*, *samāʿ*, *Tetractys*,
*majlis*… used in Chronicle-voice prose with no way in for a newcomer. **Fix applied**: a
**LEXICON** (24 terms, definitions in Gloss voice with the real scholarly content) +
automatic glossing — terms in situation text render with a dotted underline and gloss on
hover/tap, first occurrence per screen. The manual documents it.

### 4.2 The manual taught mechanics, not history — ✅ FIXED
"How to Read This Game" now opens with **The history** folio: who Ibn Turka was, what is
attested, what the seals mean epistemically, and Melvin-Koushki named as the scholarship's
source. One screen, no lecture.

### 4.3 Grounding seals under-deliver — **inventory**
The ⬤/◐/○ seals exist and open source strings — good — but sources are repo-relative
strings (`BIOGRAPHY — Formation`), meaningless to a live-site player. Inventory item:
resolve seal sources to human-readable citations (paper title + author), possibly linking
to the showcase site's timeline. Small, worth doing with Slice 2's chrome.

### 4.4 No way to review a life's *learning* — **inventory**
The Chronicle records events; nothing collects the *history encountered* (terms seen,
attested facts surfaced, people met with their real bios). A "Codex" page — everything
attested you met this run — is the natural educational trophy case and a strong Slice 3
companion to the cosmogram. Not started.

## 5. Work executed from this audit (same session)

| # | Item | Evidence |
|---|---|---|
| 1 | `artifact:` grammar + WORKS margin block + artifact gates/boosts in III–V | tests; play |
| 2 | Kīmiyā + sīmiyā made load-bearing (new encounters/boosts); **new lint: every science must be required or boosted in ≥1 post-Cairo encounter** | test `quintet has no dead branches` |
| 3 | Marginalia contradiction precedence | test |
| 4 | **LEXICON** + auto-glossing in situations + manual note | play, screenshot |
| 5 | Ending "The Attested Life" comparison folio | play, screenshot |
| 6 | Manual history folio | play |
| 7 | New encounters: `isfahan_inks` (II — ink chemistry, Smith's artisanal-epistemology layer), `pivot_globes` (IV — the Three Globes, ATTESTED), `trial_checkpoint` (V — sīmiyā escape), `trial_letters` (V — the disgraced scholar still commissioned, attested pattern) | tests incl. memory lint; play |

## 6. Inventory of remaining work (ranked)

1. **Cold human playtest** — the standing gate item; nothing below outranks it.
2. ~~Pool depth to ≥12/phase for III–V~~ **✅ DONE** (see §3.1) — next depth target is
   Slice 4's ~120+ with two-run overlap <40%.
3. Citation-grade seal sources (§4.3) — pair with Slice 2 chrome.
4. Codex / "what you met" educational trophy page (§4.4) — pair with Slice 3 cosmogram.
5. Demand profiles (§3.4) — Slice 3/4, decide then whether numeric or qualitative.
6. ~~Phase II visual depth~~ **✅ Improved**: +3 registered images (registry 30) — the
   c.1280 Qazwīnī budūḥ square now plates the mysterious-letters study; Bulhān demons
   and the Qazwīnī jinn-singer plate the new Phase III encounters.
7. More `cap:`-based gating so future items/texts can substitute for people (§2.3).
8. Seven-tier mastery axis — **still blocked** on acquiring "Selenocentrism and
   Heliocentrism"; do not invent (standing rule).
9. Slice 2 (Supabase accounts, editable chronicles) then Slice 3 (workbench, cosmogram)
   per ROADMAP — unchanged by this audit.
