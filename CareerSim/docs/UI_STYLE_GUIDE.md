# UI_STYLE_GUIDE.md — The Illuminated Apparatus

The interface thesis, from the design conversation: **the game's art is not "fantasy
Islamic magic" — it is a playable scholarly archive.** Every screen should feel like
working *inside* a manuscript culture: folios, rubrics, marginalia, seals, colophons,
catchwords. The UI itself is the world's material culture. No generic RPG chrome
(no "QUESTS" tab, no XP bars, no fantasy fonts).

This doc is normative for every screen and every line of interface writing. Read it
before touching CSS or UX copy, the way WRITING_GUIDE.md governs narrative prose.

---

## 1. Design tokens

### Palette — "the reading room" (light) / "the night lesson" (dark)

Drawn from period manuscript materials, not from a fantasy palette. Define on `:root`,
re-map under dark scheme; never hardcode a hex in a component.

| Token | Light | Dark | Material referent / use |
|---|---|---|---|
| `--parchment` | `#f4ecd9` | `#171310` | page ground / night ground |
| `--parchment-deep` | `#e9dcc0` | `#211b16` | card & panel fill |
| `--ink` | `#2b2118` | `#e8dcc4` | body text (sepia ink) |
| `--ink-faint` | `#7a6a56` | `#8f8270` | secondary text, gloss |
| `--lapis` | `#1f4d8f` | `#5b8bd0` | interactive, links, selected — lapis lazuli |
| `--vermillion` | `#9b2c1f` | `#d0584a` | rubrics, warnings, Exposure — red lead |
| `--gold` | `#a8842c` | `#c9a648` | honors, triumph, patron favor — gold leaf |
| `--verdigris` | `#3e6b5a` | `#6fa08c` | Transmission, growth — copper green |
| `--line` | `#c9b992` | `#3a3128` | hairline rules, frames |

Meaning is stable across the app: **vermillion = danger/emphasis (rubrication),
gold = reward/honor, lapis = "you can act on this," verdigris = the system spreading.**
Never rely on color alone — every colored state also carries an icon or label.

### Type

- **Display / titles**: Cormorant Garamond (Google Fonts; fallback Georgia, serif) —
  chapter headings, encounter titles, ending names.
- **Body / UI**: EB Garamond (fallback Georgia, serif) at generous size (18px+ body)
  and line-height 1.6 — this is a reading game; respect the reader.
- **Arabic/Persian display accents**: Amiri (fallback serif) — used for attested terms
  (kīmiyā, bazm, razm), artifact titles, and ornament. Always paired with
  transliteration on first use per screen; never as unexplained decoration.
- **Mechanical readouts** (time costs, meter deltas): the same serif in small caps,
  letterspaced — no monospace "computer" font anywhere.

### Surface & ornament

- Cards are **folios**: soft parchment fill, 1px `--line` frame, a second inset
  hairline (the ruled text-block border every manuscript has), corner rounding 2–3px
  max — pages, not app bubbles.
- Section headers are **rubrics**: small-caps vermillion, centered, with flanking
  hairlines.
- One ornament family only: simple geometric rosettes/eight-point stars as dividers
  (SVG, drawn once, reused). No mixing of ornament styles.
- Real manuscript images (registry-cleared only, per ground rules) appear inside
  **illumination frames** — a gold hairline + generous parchment matting. Every image
  gets a caption with institution + shelfmark: provenance IS flavor text here.

### Motion

Subtle, material, fast (150–350ms), and always meaningful:

- Chronicle lines **ink in** letter-by-letter (~20ms/char, skippable by click).
- Outcome verdicts **stamp** (scale 1.15→1 + slight rotate settle, like a seal).
- New options **unfurl** (height + fade, stagger 40ms).
- Exposure ticks pulse the margin flame once — never continuous animation.
- `prefers-reduced-motion`: all of the above become instant.

---

## 2. Screen templates — one per beat of the loop

The loop is PREPARE → MAP → ENCOUNTER → RESOLUTION → (phase colophon) → ENDING →
CHRONICLE. Each beat has one template; nothing else gets invented ad hoc.

### 2.1 Title — "The Frontispiece"

Full-bleed registry manuscript image, deeply matted. Game title in display type over
parchment cartouche; beneath it the thesis line: *"A career roguelike about making a
universal science real."* Menu = a table of contents, ruled dots and all: **Begin a
Life · Continue · Your Chronicles · How to Read This Game**. (Not "New Game / Load /
Options" — the ToC framing starts the manuscript fiction before play does.)

### 2.2 The Career Map — "The Itinerary"

Phase sector rendered as an **illuminated itinerary**, not a fantasy map: node
medallions connected by ruled travel lines, phase name as a rubric header
("PHASE III — THE COURTS · Herat, 1414"). Node medallions show institution icon +
name + 1-line hook + **time cost as small-cap numerals**. Visited nodes get a small
seal; the current node a gold ring.

Persistent **margin column** (right, 280px, collapsible on mobile to a bottom sheet):

```
┌────────────────────────────────┬──────────────┐
│  PHASE III — THE COURTS        │ TIME    ●●●●○○○ │
│                                │ EXPOSURE  🔥 ▂▂▃ │
│   (Atelier)──(Salon)           │ ────────────── │
│      │          │              │ REPUTATIONS    │
│  (Court)────(Observatory)      │ orthodox  ▪▪▫  │
│      │          │              │ occult    ▪▪▪  │
│  (Workshop)──(Road…)           │ imperial  ▪▪▫  │
│                                │ scholarly ▪▪▪▪ │
│                                │ ────────────── │
│                                │ OBLIGATIONS    │
│                                │ ⚖ Court duty 2d │
│                                │ ✍ Commission 5d │
└────────────────────────────────┴──────────────┘
```

Obligations with ≤2 time remaining turn vermillion. Hovering any meter opens its
**gloss** (see §3). The margin column appears identically on map and encounter
screens — the player always knows the state of the life.

### 2.3 Encounter — "The Folio"

The heart of the game; one fixed anatomy, top to bottom:

1. **Rubric line**: location + occasion, small-caps vermillion
   ("AT BĀYSUNGHUR'S KITĀBKHĀNA · A BAZM EVENING").
2. **Plate** (optional): one registry image in an illumination frame, caption w/
   shelfmark.
3. **Situation text**: 2–4 sentences, WRITING_GUIDE discipline. A small grounding
   seal sits at the end of the text block — ⬤ ATTESTED / ◐ PLAUSIBLE / ○ IMAGINED —
   click for the source gloss. (Historiographic honesty is a *feature*, in the UI.)
4. **Options list** — each option is a ruled entry:
   - Label (lapis, serif).
   - `Unlocked by:` line in `--ink-faint` naming the capability/person/access that
     opened it ("— because Yazdī is your collaborator and you hold observatory
     access"). This is DungeonAB's `unlockedBy` made visible: **preparation is
     credited on screen.**
   - Cost/stake chips: time ⏳, exposure 🔥, reputation deltas as tiny seals.
   - **Locked options render greyed with their requirement named**
     ("requires līmiyā ● ● — practiced"). Teach through the locked door: the
     progression fantasy is watching doors you couldn't open, open.
5. **The always-available option last** (refuse/withdraw/defer), visually quieter but
   never hidden.

### 2.4 Resolution — "The Seal and the Line"

Verdict stamps in as a seal: **TRIUMPH** (gold) · SUCCESS · QUALIFIED · AMBIGUOUS ·
BACKFIRE · **DISASTER** (vermillion). Below it, three registers in order:

1. **What happened** — 1–3 sentences of consequence prose.
2. **What changed** — mechanical deltas as chips (▲ occult, ▼ orthodox, 🔥 +1,
   ⏳ −2, "Yazdī will remember this" for memory writes — memory writes are always
   announced in this exact phrasing).
3. **The Chronicle line inks in** at the bottom, in italic: *"In that year the judge
   of Isfahan astonished the assembly at Herat, and word of it traveled."* The player
   watches their history being written, beat by beat.

### 2.5 Phase transition — "The Colophon"

End of each phase: a colophon card (as real scribes wrote them) — phase summary in
chronicle voice, the phase's 2–3 pivotal memories listed as marginalia, then the next
phase's rubric. This is the breathing room / save point.

### 2.6 Ending — "The Two-Page Spread"

The dual verdict rendered as an opened codex, two facing folios:

- **Left folio — The Man**: personal fate, named and illustrated (registry image),
  with the life's key seals re-shown.
- **Right folio — The System**: what survived him — who carries it, which artifacts
  circulate, which courts adopted it, tagged with the Transmission evidence from the
  run.

Ending name spans both pages as a rubric ("PERSONALLY DESTROYED · INTELLECTUALLY
TRIUMPHANT"). Below: **Read your full Chronicle** → 2.7.

### 2.7 The Chronicle — "The Player's Codex"

The full run as a continuous chronicle document: phase rubrics, inked lines, seals in
the margins where verdicts landed. For logged-in players this text is **editable in
place** (click a line → edit; edits marked with a discreet ✎ gloss "emended by the
author" — the player-as-historian fiction is explicit). Chronicles are saved to the
player's account, listable from the title screen, and exportable. This screen is the
game's trophy case and its social object.

### 2.8 Menus & overlays

- **Pause/system**: a slim bookmark ribbon, top-right, opens a bookmark panel (resume /
  how to read / abandon this life / sign in). Never a modal gear icon.
- **How to Read This Game**: the manual as a 5-folio illustrated primer (one folio per
  loop beat), written in the rubric voice (§3). Reachable any time from the ribbon.
- **Sign-in** is framed as *"Keep your chronicles"* — auth is pitched in-fiction as
  preserving your manuscripts, and anonymous play is never blocked (local chronicle,
  with a gentle "unbound pages are easily lost" note).

---

## 3. UX writing — the two-voice rule

Every piece of interface text is in exactly one of two voices, and the visual
treatment tells them apart at a glance:

**The Chronicle voice** (world text — situations, consequences, chronicle lines,
colophons): period-flavored, concrete, WRITING_GUIDE rules apply — names a real
person/text/institution wherever the research supports one; 10–20 words for option
details; never generic occult atmosphere.

**The Gloss voice** (mechanics text — tooltips, costs, requirement lines, onboarding):
styled as **marginalia** — smaller, `--ink-faint`, italic, hanging in the margin or
under a dotted underline. Plain modern English, zero faux-archaism, always ≤2
sentences, always answering exactly one question: *what does this do / cost / need?*

> Gloss examples (templates — reuse these shapes):
> - Meter gloss: "**Exposure** — how visible your success has made you. It rises; it
>   almost never falls. High exposure invites challenges, then accusations, then a
>   tribunal."
> - Requirement gloss: "Needs **līmiyā ●●** (practiced). Study with a talisman-maker
>   or examine inscribed objects to practice it."
> - Memory gloss: "**Yazdī will remember this.** Some later situation will read this
>   memory — nothing in the court forgets."
> - Contract offer: "Promise it and the reward is great — but a patron's expectations,
>   once raised, never come back down."

**Onboarding is marginalia, not a tutorial mode.** First run: the first ~6 screens
each carry one (dismissable, never-repeated) margin note introducing one concept in
Gloss voice — time on the first map, unlockedBy on the first encounter, the seal on
the first resolution, the chronicle line right after. No overlay tour, no "click here"
arrows. The manual (2.8) exists for players who want the whole apparatus at once.

**Never write**: "XP", "level up", "quest", "buff", "stats screen", "inventory", "GG".
**Always write**: study, practice, office, commission, favor, memory, chronicle.

---

## 4. Control & comprehension guarantees

The mechanics are unusual, so the UI carries the burden of legibility. Six hard
guarantees, testable in review:

1. **Every option shows why it exists** (unlockedBy) and **every locked option shows
   what would unlock it.** No hidden menus of possibility.
2. **Every cost is visible before commitment** — time, exposure, reputation stakes on
   the option row, not discovered after.
3. **Every memory write is announced** ("X will remember this") — the player always
   knows when the world has taken note.
4. **Every delta is shown at resolution** — no silent stat changes, ever.
5. **The margin column never lies and never disappears** — full life-state visible on
   every play screen (bottom sheet on mobile).
6. **Grounding is one click away everywhere** — the seal on every situation opens its
   source. The scholarship is inspectable from inside the game.

Accessibility floor: WCAG AA contrast in both palettes (lapis/vermillion on parchment
both pass at text sizes used); all seals/meters carry text labels; full keyboard
navigation (options are a list, 1–9 hotkeys); reduced-motion honored; the ink-in
animation always click-skippable.

---

## 5. Responsive rules

Desktop-first two-column (play area + margin column); ≤768px the margin column
becomes a pinned bottom sheet (collapsed: time ⏳ + exposure 🔥 + one obligation
chip; drag up for full state). Encounter folios go single-column, plates shrink
before text does. Wide content (the map, the two-page ending) scrolls inside its own
container — the page never scrolls horizontally. Type never drops below 16px.
