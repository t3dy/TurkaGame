---
title: Merge candidate — additional grounded material for the `geomancy` entry
description: Corpus-mined passages drafted for a duplicate entry that was removed rather than shipped. Offered for a deliberate merge by whoever owns concepts/geomancy.
status: UNMERGED — do not treat as portal content
---

# Merge candidate: `geomancy`

**What this is.** On 2026-09-01 the Visionary Gallery's L2 export
(`portal/scripts/export_gallery_scholarship.py`) reported that the portal held **no
divination entry**, so the Falnāma tradition had nothing honest to link to. That gap was
recorded in the export's own output as its highest-value missing entry.

Two sessions then closed it at once. A concurrent session wrote `concepts/geomancy` and
`concepts/jafr` into `portal/data/seed.json`. This session independently drafted a
`concepts/ilm-al-raml`. **The duplicate was removed, not shipped** — `geomancy` is the
surviving entry, it is already wiki-linked into the rest of the portal, and it is written
in the portal's voice.

**Why this file exists.** The removed draft contained grounded material the surviving entry
does not currently carry. Rather than edit someone else's entry mid-flight, it is parked
here with its citations so the merge can be a deliberate act. Everything below was found
with `portal/scripts/mine_corpus.py` and carries a source and page.

**Nothing here is portal content until someone merges it.** If you merge it, fold it into
`concepts/geomancy` in `portal/data/seed.json`, re-run `seed_from_json.py`, then re-run
`export_gallery_scholarship.py`, and delete this file.

---

## 1. The name and the procedure

The Latin *geomantia* imprecisely translates the Arabic *ʿilm al-raml*, "the science of
sand." Like the other Arabic terms for the art — *khaṭṭ al-raml*, *ḍarb*, *ṭarq* — the name
refers to the original procedure: drawing **sixteen random series of lines** in sand or
dust, then reducing them to figures read against a tableau of twelve houses.

> Melvin-Koushki, *Geomancy in the Islamic World*, 1.

The sixteen figures were correlated to further orders of being: one manuscript diagram maps
them onto the **limbs of the human body** (Kitāb fī ʿilm al-raml, BnF Arabe 2631, f. 66b).
That is the same species of correspondence table the lettrist sciences run on.

> Melvin-Koushki, *Divining Past, Present, and Future in the Sand*, 9 (fig. 26).

## 2. Where it ranked, and how far it went

Geomancy "ranked in popularity only behind astrology and oneiromancy, or dream divination,
throughout the early modern Western [Islamicate world]" — **third of three, on a very short
list**.

> Melvin-Koushki, *Divining Past, Present, and Future in the Sand*, 1; Melvin-Koushki and
> Cummins, *Geomancing Is Googling*, 2.

It also has the longest reach of any of them: it propagated across Afro-Eurasia and into
sub-Saharan Africa as **ifa, gara and sikidy**, and thence to the western hemisphere, where
those traditions "remain very much in use."

> Melvin-Koushki, *Geomancy in the Islamic World*, 1.

Melvin-Koushki elsewhere calls it "another Pythagorean science, **Afro-Arabic cognate to the
I Ching**" — noting that unlike the Chinese oracle, it travelled.

> Melvin-Koushki, *A Grammar of Weirding*, 7.

Ṭūsī's *Jāmiʿ al-ʿulūm*, the first comprehensive Persian encyclopedia of the rational and
religious sciences, introduces its eastern readership to geomancy as a **new** occult
science by styling it *gharīb* — strange, or novel.

> Melvin-Koushki, *Another Scientific Revolution*, 5.

## 3. Yazdī's defense, in its five moves

The surviving entry already frames Ibn Khaldūn vs Yazdī as the portal's sharpest
confrontation. This is the argument's actual structure, which is where the metaphysics
shows:

1. **On mechanism.** Geomancy is "wholly based on intention (*niyyat*) and
   mentation/imagination (*pindārī*)." A powerful spiritual connection must first be
   established between intention and action; the practitioner must then mentally establish
   a correspondence (*munāsabatī*) with the all-emanating Source (*mabdaʾ-i fayyāḍ*) of
   Neoplatonic cosmology. "A lack of concentration, impure motivations or basic ineptitude
   cannot but produce invalid readings." **The art has a failure condition, and it is a
   condition of the operator rather than of the procedure.**

2. **The lettrist proof.** Geomancy's stated goal — to "obtain information about unknown
   circumstances and bring clarity to ambiguous or cryptic situations" — is confirmed
   through its **numerological correspondence with the divine name Light (*Nūr*)**. Given
   the central role of light in the lettrist metaphysics of Ibn Turka and his circle, "Yazdī
   is here effectively declaring: Q.E.D."

3. **The traditionalist proof.** Ibn Khaldūn scornfully dismissed the claim that the prophet
   **Daniel** invented geomancy. Yazdī defends it, again on lettrist grounds: geomancy bears
   a numerological correspondence to the name Daniel, "so the historical association
   necessarily holds."

4. **On social status.** Yazdī rejects the charge that geomancy is a low form of soothsaying
   persuasive only to the untutored and abused by charlatans.

5. **On revelation and system.** Its general rules were first prophetically revealed, then
   systematised into a science usable by anyone "whose intuition is sound and who follows
   the correct procedure."

> All: Melvin-Koushki, *In Defense of Geomancy*, 51.

**Biographical anchor.** Yazdī spent part of 795/1393–810/1408 in Cairo with "his teacher
and friend Ibn Turka (d. 835/1432)," and Ibn Khaldūn lived in Cairo from 785/1383 to his
death in 808/1406 — the two men are in the same city at the same time, and the tract "gives
the distinct impression of having been addressed in the first instance to Ibn Khaldūn."

> Melvin-Koushki, *In Defense of Geomancy*, 5 and n. 6.

## 4. What the defense reveals

The circle's characteristic move: a popular divinatory practice is not defended on its own
terms but **absorbed into lettrism and validated by it**. The proof that geomancy works is a
numerological correspondence to a divine name. That is the same operation Ibn Turka performs
on metaphysics at large.

It also sets the terms of the opposition. By Ibn al-Qayyim's and Ibn Khaldūn's standard,
"occult philosophers like Ibn Turka, who systematized lettrism as a superior metaphysics,
must be considered a **double threat** to society and religion."

> Melvin-Koushki, *In Defense of Geomancy*, 23.

## 5. A thread worth following separately

Melvin-Koushki twice names **oneiromancy — dream divination — as *second* in popularity**,
above geomancy. The portal has no oneiromancy entry, and
[`docs/VISIONARY_ENVIRONMENTS.md`](../../docs/VISIONARY_ENVIRONMENTS.md) is explicitly about
building Ibn Turka's visionary and dreaming life. `mine_corpus.py rank dream` returns 25
hits in the Yale dissertation alone.

**That is probably the next entry to write**, and it would serve the games more directly
than geomancy does.
