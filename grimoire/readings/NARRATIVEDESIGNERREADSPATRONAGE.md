# NARRATIVEDESIGNERREADSPATRONAGE.md

**Reading, 2026-09-05.** Read: [themes/PATRONAGE.md](../themes/PATRONAGE.md), against
CareerSim [DESIGN.md](../../CareerSim/DESIGN.md), [SYSTEMS.md](../../CareerSim/docs/SYSTEMS.md)
§6 (patrons, demand, contracts), [ENDINGS.md](../../CareerSim/docs/ENDINGS.md) (`acquitted`,
the purchased survival). Persona: [NARRATIVEDESIGNER.md](../NARRATIVEDESIGNER.md).

## Claims worth building on

1. **Patronage and occult science are one system, not two.** "Political magic: few terms
   are more redundant" (*OC*, via the theme page). The game already honors this in
   DESIGN.md's "no separate magic and politics encounters." Validated; keep invariant.
2. **A patron is a demand profile with an apparatus attached** — Iskandar's atelier of
   star science + poetry + painting; Bāysunghur the calligrapher-commissioner; Ulugh Beg
   "the one patron whose programme was his own programme" (BIOGRAPHY, *Prologue* n.34).
3. **The commission specifies epistemology and cipher-level, not just topic.** Durmish
   Khān ordered *Boon for the Khan* with reproducibility ("reliably locally sourced")
   and audience ("useful to everyone") in the terms (*OC*). No contract field captures
   this yet — PATRONAGE.md says so itself, and it is right.
4. **Protection delays; it does not dissolve.** Tribunals "contrived by jealous and
   vengeful colleagues" outlived any patron's shield (*Prologue*); Qāsim-i Anvār's 1427
   exile is the network-liability face of the same coin (*OC* n.24).
5. **The client arms himself against the patron** — "psychic control of tyrants and
   persuasiveness with rulers" sold to bureaucrats as standard product; MK's "occult
   democracy" (*OC* on ʿAlī Ṣafī). An entire encounter family, currently unmined.

## Decisions

**D1 — Cipher-level and epistemology become contract terms.** Extend the §6 contract
tuple to `{patron, promise, deadline, reward, expectation_delta, failure_consequence,
secrecy, cipher_level, proof_standard}`. `cipher_level ∈ {encoded, allusive, plain}`
constrains the deliverable's concealment axis (§5); delivering a ciphered book on a
`plain` contract is breach, and delivering plain on an `encoded` one writes
`book_in_evidence` — readable by `trial_*` as an aggravator. `proof_standard ∈
{spectacle, reproducible, mathematical}` is the Durmish Khān clause: it decides which
gradient table the deliverable's demonstration rolls on. Grounding: ATTESTED (the *Boon*
commission), and it makes the composition system answer to the patron system, which is
claim 1 in mechanical form.

**D2 — Three retainers, one mechanic, three glosses.** The standing retainer obligation
splits by demand profile: **Iskandar** pays favor for novelty and tolerates INVENTED-edge
work, but every triumph there is Exposure+2 (the doomed court burns hot); **Bāysunghur**
pays for artifact quality — diagrams and calligrapher capabilities multiply, simiyā
spectacle earns nothing; **Ulugh Beg** is proof-or-nothing — `mathematical_demonstration`
options get a tier bump, spectacle options roll one gradient step worse. Same obligation
schema, per-court effect tables. This is Laboratory-of-Art demand profiles finally doing
what the sources describe rather than reskinning rewards.

**D3 — Exit is a verb.** The patron loop is offer → negotiation → deliverable →
expectation → **exit**, and the game currently has no exit. Add encounter
`patron_leave` (phase 3–4): options *complete-and-part* (requires all contracts closed;
CourtMemory `left_well:{court}`), *plead the bench* (requires `access:judiciary`;
orthodox+, imperial−), *defect to a rival court* (always available; Exposure+,
`defected_from:{court}` read by both courts' later pools, and by `trial_third` — the
panel knows who you abandoned). Refusal-to-exit — staying past the fall — is Iskandar's
trap and should be its own attested encounter when his rebellion breaks.

**D4 — The occult-democracy family.** Seed encounter `vizier_countermagic`: a
bureaucrat privately commissions the operation that manages *his prince*. Requires
`himiya>=3`; accept writes `armed_the_client`, which a later patron encounter reads
("he learned what you sell, and to whom") and `trial_*` can read as evidence. Decline
writes nothing but costs the bureaucrat's capability package. This is the patron system
played from below, and it keeps value 7 honest: democratization as strategy, not virtue.

**D5 — Protection stays a delay, and the ledger shows.** `acquitted` at 29% of greedy
runs — "alive by patronage, and owned" (ENDINGS §7) — is the mechanical truth of claim 4.
Do not add any option that *reduces* Exposure via favor. Instead surface the ledger: each
favor-spend writes `owed:{patron}`, and the marginalia should read the accumulated debts
back at run end.

## Anti-patterns (the research forbids)

- A single favor meter or generic "reputation with patrons." Each patron is an entity.
- Patron as vending machine: commission in, reward out, no expectation inflation.
- Protection that dissolves Exposure. The tribunals are colleague-driven machinery.
- Writing Iskandar, Bāysunghur and Ulugh Beg with interchangeable court furniture —
  the apparatus (atelier / kitābkhāna / observatory) must be on-page in every scene.

## Open questions

- [[OCCULTDEMOCRACY.md]] — how far down does the client base go? (Qizilbash reading publics)
- [[QASIM.md]] — the network-liability arc deserves its own page before Phase V content.
- [[PATRONEXIT.md]] — attested exits from Timurid service: what did leaving actually look like?
