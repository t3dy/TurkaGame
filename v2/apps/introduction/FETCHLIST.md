# FETCHLIST — the period images the Introduction wants, and why none is here yet

The Introduction's lessons show **reconstructed** diagrams (drawn live from the
texts by `src/diagrams.js`) because every image that enters this project needs
a provenance record and a rights check first — `CLAUDE.md`: "No manuscript
image goes into `assets/` without a provenance record" — and fetching images is
a **download**, which waits for Ted's word.

The pipeline exists: `imagelab/scripts/fetch_commons.py` reads Wikimedia Commons'
structured licence data and refuses anything that does not parse as free; then
`research/scripts/register_asset.py add` records institution, shelfmark, folio
and rights before an image is used. What follows is the candidate list. **The
Commons titles are from general knowledge (⚠) and must be confirmed by the
fetcher's `--dry-run` before anything is downloaded**; the lesson each image
serves is named so it can be slotted in without re-reading this file.

| Lesson | What is wanted | Where it would come from | Status |
|---|---|---|---|
| The Sefer Yetsirah divides the twenty-two | A manuscript or early printed wheel of the 3/7/12 division; the diagram Segol translates (ff. 17b–18a) is the ideal | Segol's plates are in a copyrighted book and cannot be shipped. Commons candidates: pages of the **Mantua 1562** printed *Sefer Yetsirah*; **Kircher, *Oedipus Aegyptiacus*** (1652–54) letter-wheels (public domain, many scans on Commons) ⚠ | not fetched |
| Combination: the 231 gates | A drawn wheel of the 231 gates | Kircher's *Oedipus Aegyptiacus* and *Ars Magna Sciendi* combinatory wheels ⚠; later kabbalistic printings | not fetched |
| Twenty-eight: mansions and dots | A folio of the *Shams al-maʿārif* showing the mansions-and-letters table, or a lunar-mansion diagram | **BnF Arabe 2647 / 2658** are on Gallica (public domain reproductions; check Gallica's terms) — the manuscripts Varisco cites; the portal holds Gardiner's plates of Būnī diagrams from *Diagrams and Visionary Experience*, rights UNDETERMINED (photographs from a scholarly article) | not fetched |
| The four natures | Al-Būnī's elemental table (*Manbaʿ uṣūl al-ḥikma*, p. 66; *Shams al-kubrā*, p. 23) | Printed Cairo editions are 19th–20th c.; a manuscript table would need locating | not fetched |
| Whose rules run | Ibn Turka's own hand: the *Mafāḥiṣ* opening in autograph (Tehran, Majlis MS 10196 f. 52b) and the **Tahawi Circle** (f. 63a) | The portal's image catalog has both as extracted plates from Melvin-Koushki's articles (`tahawi-circle-plate-pythagorean-renaissance`, `dee-ottoman-p4-tahawi-circle-and-akbar`), rights UNDETERMINED; the Majlis Library's own digitisation would be the clean source | not fetched |
| The golem | A golem-diagram folio from a *Sefer Yetsirah* commentary (Pseudo-Saadya, Abulafia) | Segol 2012 ch. 6 reproduces them under the holding libraries' permissions; the manuscripts (e.g. Paris BnF héb. 763, Munich Cod. hebr. 40 ⚠) would need direct library terms | not fetched |
| Everywhere | The muqaṭṭaʿāt on a Qur'an page; a *muraqqaʿ* calligraphy page for the naskh forms | Commons has many public-domain Qur'an folios (e.g. Metropolitan Museum, Walters) with structured licence data the fetcher can read | not fetched |

## To run it

1. Add the confirmed Commons titles to a manifest (the fetcher's `MANIFEST` is
   the visionary corpus; add a second manifest or a `--manifest` flag).
2. `python imagelab/scripts/fetch_commons.py --dry-run` — metadata only, no bytes:
   this is where a wrong title or a non-free licence shows up.
3. With Ted's go-ahead, fetch; then `register_asset.py add` for each, and only
   then reference it from `lessons.json` (an `image` field the page will show
   beside the reconstruction, with the provenance line under it).
