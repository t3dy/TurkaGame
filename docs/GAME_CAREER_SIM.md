# Design Doc: Esoteric Scholar Career Sim

Status: **SUPERSEDED (2026-08-30)** by the full CareerSim subproject —
[../CareerSim/DESIGN.md](../CareerSim/DESIGN.md) ("Ibn Turka: The Occult Court").
This file is kept as the kickoff-era sketch; do not extend it. The Quintet-as-skill-tree
framing below was specifically rejected in the new design (sciences are capability/verb
families, not levels). The seven-tier-hierarchy blocker noted below was **closed 2026-09-27** (all seven tiers are now sourced;
see the Corrections section at the end).

## Premise

Play a scholar navigating the real institutional world Ibn Turka moved through: a
judgeship as day job, an occult-scientific research program as life project, royal
ateliers and observatories as workplaces, patrons who commission specific work, rival
colleagues who can trigger inquisitions, and a live tension between hoarding elite
knowledge and popularizing it for reach and income. All of this is directly attested in
the research, not invented — see
[docs/RESEARCH_BRIEF.md](RESEARCH_BRIEF.md#courts-and-political-economy-career-sim-material).

## Skill tree: the Occult Quintet

The five canonical occult sciences (*khamsa-yi muḥtajiba*) are a ready-made skill-tree
spine, already ordered by prestige/cost/difficulty in the source material:

1. **kīmiyā** (alchemy) — most elite/expensive/technically demanding
2. **līmiyā** (talismanry)
3. **hīmiyā** (subjugation)
4. **sīmiyā** (illusionism)
5. **rīmiyā** (trickery) — cheapest, most accessible, most crowd-pleasing

Design implication worth testing: cheaper/lower-tier sciences (illusionism, trickery)
might train faster and earn income/reputation with a broader public faster, while
kīmiyā/līmiyā are slower, costlier, but unlock higher-status patron relationships and
larger commissions — mirroring the real popularization-vs-prestige tension documented in
the *Boon for the Khan* / *Qasimian Secrets* material.

## Depth-of-understanding axis: the seven-tier hierarchy (was BLOCKED; closed 2026-09-27)

Ibn Turka's own *On the Splitting of the Moon and the Last Hour* proposes a second,
orthogonal hierarchy: seven tiers of ways-of-knowing, traditionist literalism at the
bottom, lettrism at the top as apex of human perfection, with theologians, philosophers,
and Sufis somewhere in the ascending middle. **[Superseded 2026-09-27: it is now
fully documented; the seven tiers are listed in the Corrections section below.]** When this sketch was written
only the endpoints and three of seven tiers were named. The
natural game mapping (an orthogonal "depth of mastery" meter layered against the five
Quintet branches, so a character can be technically skilled but shallow, or slow but
deep) should not be finalized until the complete hierarchy is sourced. See
[docs/DECISIONS.md](DECISIONS.md) open items.

## Court and institution systems

- **Patron relationships**: in the later period works are commissioned as explicit "boons" (that language is
  about ʿAlī Ṣafī's 1522 *Boon for the Khan*, not Ibn Turka's own court life) — a patron system
  where reputation, favor, and specific requested output (popularize vs. keep esoteric)
  are tracked per patron, modeled on the real *Boon for the Khan* commission.
- **Institutions to represent**: the judiciary (a scholar's plausible day job, as it was
  Ibn Turka's), royal ateliers/*kitābkhānas* (combined book-production/art workshops),
  observatories (Samarkand as the flagship example), Sufi orders (Naqshbandī,
  Niʿmatallāhī both attested), and the military-patron class (Qizilbash).
- **The Islamicate economy**: courts identified in the research span Timurid, Aqquyunlu,
  Safavid, Uzbek, Ottoman, and Mughal — a real multi-polity economic map, not a single
  kingdom. A run could plausibly move between courts as political fortunes (or
  inquisitions) force relocation.
- **Inquisition as a risk mechanic**: rival colleagues can trigger state inquisitions;
  reputation and patron favor are spendable resources against this risk. Ibn Turka's own
  arc — survive two (c. 1422, 1426), lose the third (1427), on our reading of "three trials" — suggests inquisition risk should compound or
  escalate rather than reset, if the sim wants to earn its ending rather than randomize
  it.

## Open questions (design-blocking, not just nice-to-have)

- ~~Full seven-tier hierarchy — need the source~~ **closed 2026-09-27**: see Corrections.
- Win/loss condition: does the sim have to end in something like Ibn Turka's real fate
  (exile, death in legal limbo) to be honest to the source material, or is player
  agency meant to diverge from the history? This is a values question for the design,
  not just a mechanics one — worth deciding deliberately rather than defaulting.
- Tech stack likely Next.js given the amount of persisted state (skill tree, patron
  relationships, decision timeline) — see [docs/DECISIONS.md](DECISIONS.md), not locked.

## Corrections (2026-09-27)

Per Ted's standing rule (source: `TurkaVita/docs/CORRECTIONS_BRIEF.md`, rows 5, 6, 10, 7):

- **The seven tiers are sourced** (dissertation pdf 332–334, 471–479; *R. Shaqq-i Qamar*, on Q 54:1, 829/1426), in
  ascending order: (1) jurists and traditionists, (2) dialectical theologians, (3) peripatetic philosophers,
  (4) illuminationists, (5) verifying mystics of the Ibn ʿArabī school, (6) lettrists, (7) ʿAlī and the Imams. Level
  seven is "not entirely what it seems" (peculiar to the present time, marked by a conjunction; Melvin-Koushki's
  reading is that it is not simply the Imams). The old blocker on the mastery axis is gone. (Superseded in any case
  by `CareerSim/`.)
- "Boons" belong to *Boon for the Khan*, not Ibn Turka's court life.
- "Survive two, lose the third" is kept, with the years marked as our reading.
