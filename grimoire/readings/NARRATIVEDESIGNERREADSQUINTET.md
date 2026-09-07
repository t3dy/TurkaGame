# NARRATIVEDESIGNERREADSQUINTET.md

**Reading, 2026-09-07.** Read: [themes/LETTRISM.md](../themes/LETTRISM.md) +
[themes/GEMATRIA.md](../themes/GEMATRIA.md) + [themes/ASTROLOGY.md](../themes/ASTROLOGY.md)
+ [themes/GEOMANCY.md](../themes/GEOMANCY.md) + [themes/TALISMANS.md](../themes/TALISMANS.md)
as one curriculum. Against CareerSim [SYSTEMS.md](../../CareerSim/docs/SYSTEMS.md) §2
(the Quintet as capability families) and §1a (Synthesis). Note the mapping up front:
the game's mechanical quintet (kimiya/limiya/himiya/simiya/rimiya) is ʿAlī Ṣafī's
partition; these five theme pages are the *disciplinary* partition. They meet as:
lettrism+abjad → Synthesis and the summa road; astrology → the court-service verbs;
geomancy → `cap:geomancy`; talismans → limiya's ladder. Specialization is choosing
which of these is *your* science — and what each choice forecloses.
Persona: [NARRATIVEDESIGNER.md](../NARRATIVEDESIGNER.md).

## Claims worth building on

1. **Lettrism is the summa road, and the summa is the charge sheet.** The
   universality argument — only the letter encompasses being and non-being, so
   lettrism outranks philosophy — "is the claim the tribunals ultimately try"
   (LETTRISM.md, portal `lettrism-universal`). Specializing here is raising
   Synthesis; the foreclosure is safety itself.
2. **Abjad is the proof procedure, and the corpus hands us worked examples**:
   ṣawāb = 99 keyed to the divine names; ʿaṭā = 80 = aʿdād; ʿAlī = 110 = alif,
   reducing to Two, "the Dot under the B" (*Prologue* nn.46–47). Every equation is
   checkable against the game's own abjad table.
3. **Taksīr is an attested algorithm, not a vibe** (*Prologue* n.35): write the
   letternames in full, eliminate repeats, split zubur from bayyināt — "the occult
   code behind every manifest word." It is playable as-is and nothing in the game
   plays it.
4. **Astrology is court service, and it is Selenocentric.** The applied layer is
   built (muwaqqit chain, `court_dynasty`, `court_razm_date`, `zij_contribution`);
   the unmined identity is the Moon — "Letters are Moons," ʿAlī-as-Moon (*Prologue*)
   — and the standing rule holds: the seven-tier hierarchy lives in a paper we do
   not hold; do not invent it (ASTROLOGY.md).
5. **Geomancy is the exile science.** No instruments, no library, no patron — and
   defended in writing by the period's most rigorous mathematician-historian
   (Yazdī contra Ibn Khaldūn, held excerpt). It is also the game's most under-read
   capability (`cap:geomancy`), which this page can fix.
6. **Talismans scale without changing kind**: ring → book → king's body → city
   (*OC*, *Prologue*) — limiya's rank ladder has an attested rung for every tier,
   and "a talisman is a *made* thing with a commission, a material bill and a
   target conjunction — always three named parameters" (TALISMANS.md).

## Decisions

**D1 — Specialization forecloses, visibly.** Reaching rank 4 (systematized) in any
science writes `systematized:{science}` — and each flag closes a door as it opens
one. The lettrist-summa road (`synthesis>=8` + released summa) makes `trial_third`
harsher: the panel tries the universality claim itself, `recant_all` costs double
Synthesis (you are unsaying the system, not a sentence), while `defend_text` gains a
tier. The astrology road opens the retainer ladder but every elected date is
falsifiable: wrong ones write `date_missed:{court}`, read by rivals forever. The
talisman road climbs patrons' regard but its artifacts are *seizable* — inscribed
objects are exhibits in a way arguments never are. Geomancy forecloses prestige:
demand-mismatched at every court (the mockable science), it alone functions when
everything else is stripped (D3). No best road; four true ones.

**D2 — Taksīr as the demonstration verb, work shown.** Add option family
`taksir_demonstration` to `madrasa_disputation` and `court_rival_astrologer`
(requires `synthesis>=4` or limiya>=2 per venue): take the disputed word, run the
attested algorithm, and — the actual design commitment — **the Gloss shows the
arithmetic**, real letternames, real abjad values from the game's data, zubur and
bayyināt split on-page. Triumph texts use the corpus's own equations (99, 110, 80)
so a player can check the game's math by hand (GEMATRIA.md's anti-pattern rule made
into UI). No puzzle UI needed in the first pass; shown work in the marginalia is
the slice.

**D3 — The sand in exile.** Phase V encounter `sand_in_exile` (`when: memory has
fled or fate-road exile`, requires `cap:geomancy` for its prepared option): on the
road, stripped of bench, library and patron, the sixteen figures are what remains —
raml cast for villagers and caravaners, Transmission+1, and the marginale earns the
theme page's sentence: the poor scholar's observatory. A second option *teach the
figures* (chains with the existing `teach_on_road`) makes geomancy the one science
whose transmission is exile-proof. This single encounter redeems the under-read
`cap:geomancy` grant and gives the Akhlāṭī inheritance (lettrist-alchemist-
*geomancer*) its payoff at the far end of the life.

**D4 — Limiya's ladder gets its attested rungs, reachability-checked.** Bind the
rank gates to the scaling series: rank 1 amulet (a bureaucrat client commissions the
Amulet of Protection — career insurance "from every stripe of fear or danger,"
*OC* — feeding the occult-democracy clientele from the PATRONAGE reading), rank 2
inscription (`trial_letters` as built), rank 3 book-as-talisman (`pivot_tahawi`),
rank 4 building (the atelier's magnificent choice) with the city consult
(GEOPOLITICS reading D2) as its phase-V application. Then run
`node tools/analyze-content.mjs reach` — the parent CLAUDE.md's bricked-gates
lesson says a ladder that looks climbable in a doc is unproven until the harness
climbs it.

**D5 — Moon first.** A content register rule for all astrology prose: lunar
mansions, moonsighting (barāʿat al-istihlāl *is* a moonsighting), conjunction and
apogee — never generic zodiac furniture. One retitle makes it concrete: the
nativity encounters' glosses should read position from the mansion of the Moon, and
any ʿAlī-adjacent lettrist beat may key to the Moon (*Prologue*'s "Letters are
Moons") — with the seal citing the page. The seven tiers stay unbuilt until the
Selenocentrism paper is acquired; a gap named is better than a hierarchy faked.

## Anti-patterns (the research forbids)

- Any science as +N to a roll. Ranks gate verbs; identity comes from what the verb
  forecloses (D1), never from a bonus.
- Number-mysticism with the work hidden. If the Gloss can't print the sum, cut the
  scene (GEMATRIA.md; MK's own notes show the work).
- Geomancy played for laughs. The period's own best mathematician defended it in
  writing; mockery in-world belongs to the Khaldūn-voice, and the game should let
  Yazdī answer him.
- Inventing the seven-tier hierarchy, or any structure whose source is a paper we
  do not hold. Acquire, then build (the standing rule, restated because it binds).
- A talisman without its three parameters (commission, materials, conjunction).
  Loot is forbidden.

## Open questions

- [[BISTAMI.md]] — the jafr/prognostic letter-science literature; also the missing cast member (see the capstone reading)
- [[SELENOCENTRISM.md]] — page to write the day the *Al-ʿUṣūr al-Wusṭā* 33 (2025) paper is acquired
- [[TAKSIRPUZZLE.md]] — the full puzzle-UI version of D2, shared with Letter Machine (v1) and v2's reckoner
- [[KHALDUN.md]] — the principled anti-occultist as recurring antagonist-of-ideas (GEOMANCY.md seeds him)
