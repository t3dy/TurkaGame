# WRITING_GUIDE.md — Reveal the World, Don't Decorate It

A house rule for anyone (human or agent) writing scene text, option detail, or
consequence text for this VN: **every scene should reveal something specific and
real about Ibn Turka's actual world — a named text, institution, practice,
manuscript, or historiographical fact — not generic occult-fantasy atmosphere that
could belong to any invented setting.**

This isn't a purity rule for its own sake. It's the difference between a player
learning *"the wizard studies old magic"* and a player learning that a real
14th–15th-century Timurid judge organized his cosmology around the mathematical
properties of Arabic letters, argued with real named colleagues about it, and was
tried for it by a real institutional process. The second is what makes this
project worth building instead of writing a fantasy VN with the serial numbers
filed off.

## The research-access layer

Before writing or revising any scene, check these two files first — they are the
canonical, already-synthesized index, not `docs/RESEARCH_BRIEF.md`'s looser prose
(still useful for texture, but BIOGRAPHY.md and the timeline supersede it as the
authoritative reference):

1. **[`docs/BIOGRAPHY.md`](../docs/BIOGRAPHY.md)** — the full biography, organized
   chronologically and thematically, every claim tagged ATTESTED / COMPARATIVE /
   CONTEXT. Its "For game design" section names concrete NPCs, entities, and open
   gaps.
2. **[`site/data/timeline.json`](../site/data/timeline.json)** — 50 dated events,
   each with a `category`, `grounding` tag, and `source` citation. Filter by
   `category: "texts"` for concrete named works/manuscripts/diagrams to reference;
   `category: "biography"` for people and relationships; `category: "historiography"`
   for how modern scholarship frames this material (useful for epilogue/legacy
   beats).

Grep both for a name, a science, an institution, an act's rough date range — don't
write from memory of what "feels right" for the period.

## The checklist, per scene

When writing or revising `CHOICE_TEXT`/`OPTION_CONSEQUENCE` entries in
`js/narrative.js`, before finalizing a scene ask:

1. **What specific attested entity can this scene surface?** A named text
   (*Investigations*, *Shams al-Ma'arif*, *Boon for the Khan*), a named
   institution (the New Brethren of Purity, the Samarkand Observatory, the
   Isfahan judiciary), a named practice (a specific operation from the Occult
   Quintet, a specific lettrist technique like *taksīr*). If the answer is
   "nothing specific," that's a signal to look again at BIOGRAPHY.md/timeline.json
   before finalizing the text — not necessarily to invent something, but to check
   whether a real hook was missed.
2. **What does this choice's `grounding` tag license?** `ATTESTED` choices can
   state things directly. `PLAUSIBLE-GAP` choices are real transitions the sources
   are silent on the *decision itself* — the scene can and should state the
   surrounding facts plainly, but the choice's drama should live in the
   invented-but-compatible decision, not in inventing new facts around it.
   `INVENTED-COMPATIBLE` choices (only c40 currently) should still nest inside
   real historiographical framing (e.g. what actually happened to *Investigations*'s
   reception) even though the choice itself has no attestation.
3. **Is the period vocabulary real?** Use the actual terms this project has
   established rather than generic synonyms: *qāḍī* not "judge" in flavor text
   where it matters, *ʿilm al-ḥurūf* (lettrism) not "magic," the five sciences by
   their real names (kīmiyā/līmiyā/hīmiyā/sīmiyā/rīmiyā) not invented ones,
   *kitābkhāna* for the atelier/scriptorium institution, *nāmūs* for a named
   magical "operation" in the Kāshifī/ʿAlī Ṣafī textual tradition.

## Option-level detail text: name someone real, then stop

`choices.json`'s per-option `detail` field (the reasoning shown inside each
option button — not the scene-setting `CHOICE_TEXT`) has its own two rules, added
after an audit found it drifting long and generic:

1. **One sentence, occasionally two. Roughly 10–20 words.** Not a mini-essay on
   values and risk — a single sharp line. If it takes three sentences to say, the
   idea probably needs one clause, not three. `js/narrative.js` used to average
   ~41 words per option; audited down to ~14. That ratio (a third, not a half) is
   the target for any future revision — trimming to "a bit shorter" tends to
   regress back up over successive edits if there's no numeric anchor to check
   against.
2. **Name someone or something real whenever the option allows it — a person, a
   text, an institution — rather than describing the choice in the abstract.**
   `c01`'s "seek unconventional teachers" option used to read as generic
   atmosphere ("real, dangerous knowledge," "the fringe teachers"). It now reads
   *"Skip the madrasa. The unconventional circles are where Sayyid Husayn Akhlati
   actually teaches"* — the same choice, naming the one teacher Ibn Turka is
   actually attested to have studied under. Do this everywhere the record
   supports a name (Akhlati, Yazdi, Qasim-i Anvar, Ibn ʿArabī, Hamūya, Iskandar
   Sultan, Bāysunghur, Ulugh Beg, the New Brethren of Purity, *Investigations*,
   the Ṭahawī Circle) rather than defaulting to "your mentor" / "a colleague" /
   "the work." Where no name is attested for a given option (most of the
   `PLAUSIBLE-GAP` choices, which are genuinely undocumented decisions), keep the
   concrete stakes but don't manufacture a name that isn't in BIOGRAPHY.md.

## Before / after — what this looks like in practice

Not a hypothetical: these are real revisions made to `narrative.js` when this
guide was written, because the "before" text was generic where a real hook was
sitting unused in BIOGRAPHY.md.

**c01 (which teacher to seek out first)**
- *Before (v2):* "Going straight to the fringe teachers means faster access to
  real, dangerous knowledge, and it signals real seriousness to the people who
  matter most in that world. It also means skipping the credentialing that
  protects a scholar later..." (41 words, no name.)
- *After (v3):* "Skip the madrasa. The unconventional circles are where Sayyid
  Husayn Akhlati actually teaches." (14 words, names the one attested teacher.)

**c22 (teach widely or keep the circle small)**
- *Before:* "Students keep arriving, more each season, most of them earnest, a few
  of them clearly here to report back to someone."
- *After:* names the **New Brethren of Purity** explicitly and its self-conscious
  invocation of the medieval **Ikhwān al-Ṣafāʾ** — the actual stakes of "small vs.
  wide" are about growing or protecting a *specific, real, self-named circle*, not
  a generic student body.

**c24 (the practical grimoire commission)**
- *Before:* "a specific, practical, faintly embarrassing request — something
  sellable, something popular."
- *After:* names the concrete genre this request belongs to — a **Boon for the
  Khan**-style manual of named operations (suffumigations, treasure-dowsing,
  sleeper interrogation) — real period spellbook texture from Melvin-Koushki's
  translated excerpt, not an unspecified "something."

**c40 (the final testament)**
- *Before:* "One more thing, if there is to be one more thing, for whoever
  eventually goes looking for what you left behind."
- *After:* frames the choice against the real historiographical fact that
  *Investigations* was left understudied — effectively "on the Index" — for
  centuries, per Melvin-Koushki's own framing. The choice becomes legibly about
  *that specific, real fate*, not a vague gesture at posterity.

## What this guide does not license

- **Do not invent direct contact** between Ibn Turka and any figure not
  documented as part of his actual circle. The European Renaissance-magi
  comparisons (Cusa, Pico, Bruno, Dee) are the modern historian's argument, not a
  historical event — see `docs/DECISIONS.md`'s "Comparison ≠ contact" entry. Never
  write a scene implying Ibn Turka met or corresponded with any of them.
- **Do not resolve open research gaps by inventing the missing content.** The
  7-tier epistemic hierarchy has 5 of 7 tiers unconfirmed; the first two
  inquisitions have no established dates; don't write scene text that states a
  specific missing tier name or a specific inquisition date as fact.
- **Real texture is not the same as historical accuracy about outcomes.** The game
  is still "fully divergent" per `STATE_MODEL.md` — a player can choose paths
  history didn't take. Naming real institutions and texts doesn't mean every
  choice's *outcome* is attested; only the *world* the choice happens inside is.
