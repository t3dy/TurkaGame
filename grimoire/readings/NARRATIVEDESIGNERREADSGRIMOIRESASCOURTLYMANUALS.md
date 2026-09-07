# NARRATIVEDESIGNERREADSGRIMOIRESASCOURTLYMANUALS.md

**Reading, 2026-09-07.** Read: [themes/GRIMOIRESASCOURTLYMANUALS.md](../themes/GRIMOIRESASCOURTLYMANUALS.md),
against CareerSim [DESIGN.md](../../CareerSim/DESIGN.md) claim 3 (books are active
technologies), [SYSTEMS.md](../../CareerSim/docs/SYSTEMS.md) §5 (composition),
[ENDINGS.md](../../CareerSim/docs/ENDINGS.md) (`appropriated`, `indexed`, `escaped`).
Focus: **what Turka writes** — the Slice 3 workbench as the game's signature system.
Persona: [NARRATIVEDESIGNER.md](../NARRATIVEDESIGNER.md).

## Claims worth building on

1. **A grimoire is career technology, and its table of contents is an ambition
   checklist.** ʿAlī Ṣafī's preface promises "promotion to higher office and rank,
   psychic control of tyrants and persuasiveness with rulers" (*OC*, translated in
   full). The manual's *index* is organized by what it gets you at court, not by
   science. No composition property captures how a work is indexed. It should.
2. **Encode/decode is a political act with a named key.** The qalam-i Kāshifī cipher
   and its later removal are both deliberate moves in a "leaking campaign" (*OC*);
   the ciphered *Qasimian Secrets* runs 80+ MSS, the decoded *Boon* only 12 — cipher
   and reach trade off measurably, in the sources' own manuscript counts.
3. **Manuals breed manuals; each re-edition is a repositioning for a new court**
   (*OC*, the ʿIrāqī → Kāshifī → *Boon* → Safavid lineage). A released text has a
   *career of its own* after the author lets go — which is DESIGN.md claim 5
   (the movement can escape the player) at the scale of a single book.
4. **Pedigree makes prestige**: operations claim pseudo-Platonic descent (the
   *Nawāmīs*), and the genre's self-image is Plato tutoring Alexander (*OC*).
   Attribution is a composition choice, and a falsifiable one.
5. **Bazm u razm is the technology tree** (*OC*): dual-use is the norm — disappearing
   ink is party invitation and courier cipher at once. One artifact, two faces,
   and the court remembers which face it was shown.

## Decisions

**D1 — The workbench gets a `cipher` axis and an `index` axis.** Extend §5's property
derivation: composing assigns `cipher ∈ {encoded, keyed, plain}` and `index ∈
{by_science, by_ambition}`. `encoded` caps transmission but subtracts from
`political_risk` and blunts `book_in_evidence` at `trial_*` (a ciphered page proves
nothing to a panel); `plain` multiplies transmission and court_usefulness and is what
the `escaped` system-fate feeds on. `by_ambition` (the Ṣafī index) raises
court_usefulness and Imperial reach, `by_science` raises scholarly_authority. This
gives the existing `pivot_grimoire` fork (practical manual vs. elite treatise) its
missing second and third dimensions — and it pairs with the PATRONAGE reading's D1:
a contract's `cipher_level` term now has a real artifact property to check against.

**D2 — `keyed` means a key, and the key is an entity.** A `keyed` work creates a
holdable thing: `key:{work}` joins the capability pool and can be *given* (student,
patron, Yazdī) or withheld. Giving the key to a patron is favor; giving it to a
student writes `key_transmitted`, which Legacy reads (a ciphered book plus a
transmitted key can still reach `scholarly`; without the key it lands `unread` —
"complete, and in a box" is exactly what an unkeyed cipher is). No vibes-obscurity:
concealment is a named object with a location.

**D3 — Re-edition: the book has encounters after you release it.** New encounter
family `manual_reissue` (phase 4–5, `when: memory has released_manual`): an agent of
a *different* court asks for a decoded, localized edition. Accept-and-decode:
Transmission+2, Exposure+1, writes `decoded_own_cipher` — read by `trial_third` as an
aggravator (you removed your own protection) and by Legacy as a push toward
`escaped`/`source_code`. Refuse: the Kāshifī-figure does it anyway a phase later
(`memory: reissued_without_you`), the marginalia noting the 12-MSS bestseller that
carries someone else's name. This is claim 3 in play: refusal doesn't stop the
book's career, it only removes you from it. Grounding: ATTESTED as pattern
(the *Boon* lineage), PLAUSIBLE-GAP as event.

**D4 — Pedigree as a composition option that can be called.** Workbench toggle
`attribute_to_the_ancients` (the *Nawāmīs* move): court_usefulness+, scholarly_authority−
risk — and writes `pedigree_claimed`, which the rival's `trial_rival_book` line can
read: an option for the rival to expose the attribution before the panel, turning
prestige into fraud evidence. Locked doors with true reasons: the exposure only
fires if a scholar-tier reader examined the work (`circulate_scholars` in memory).

**D5 — Dual-use tags, one artifact.** Every operation-bearing artifact carries
`bazm_use` and `razm_use` fields; `court_razm_device` and `court_bazm_wonder` draw on
the *same* artifact list, and deploying the bazm face at a razm node (or vice versa)
takes a gradient step penalty unless simiya>=2 reframes it. CourtMemory writes
`shown_face:{artifact}:{bazm|razm}` — a court that saw the toy and later learns it
was also the weapon reads that flag in the trust encounters. Cheap to build, and it
makes claim 5 mechanical instead of flavor.

## Anti-patterns (the research forbids)

- The grimoire as transgressive forbidden book. In this world it is closer to a
  résumé-builder; the *danger* comes from tribunals reading plain text, not from the
  genre itself.
- A single "publish" verb. Release is language + cipher + index + audience, and
  every combination reaches a different public (PERSIANATE.md's register rule).
- Concealment as mood. Either there is a key, held by someone, or the text is plain.
- Writing that costs nothing. Every workbench session spends the Time budget §4
  meters — the office/book tension is the Career in Career Sim.

## Open questions

- [[OCCULTDEMOCRACY.md]] — how far down the ladder do manuals sell? (Qizilbash reading publics)
- [[REEDITIONS.md]] — attested afterlives of specific manuals: who reissued what, for whom
- [[MANUALINDEX.md]] — reconstruct a real ambition-index from *OC*'s translation for the workbench UI verbatim
