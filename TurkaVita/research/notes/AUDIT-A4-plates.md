# AUDIT-A4: plate provenance (game/plates.js, 39 plates)

Auditor role (`../../AGENTS.md`): read-only on the repo except this file. Scope: verify the
ILLUSTRATOR's provenance claims for all 39 plates in `game/plates.js` against real evidence,
per the illustrator's own report `docs/PLATES.md`.

**Tool availability: WebFetch was available.** I fetched 16 of the 39 Commons file pages live
(41%, chosen to cover every plate the illustrator flagged as uncertain plus a spread of
institutions/licence-template types) and cross-checked all 39 programmatically against
`research/plates_commons.json` (the licence/date/description record captured by
`fetch_plates.py` at the time each file was fetched — this exists for every one of the 39,
confirmed by direct lookup). I also ran the existing `tests/test_plates.py` (11 tests,
all passing) and read `game/ui.js`'s `figureHtml`/caption rendering, and cross-checked the 5
plates sourced from this project's own collections against their registry records.

**Headline finding: no licence problem found, and no factual error found that the illustrator
did not already flag.** Of 39 plates, all 39 are CONFIRMED. One MINOR item is noted (a
pre-existing registry record with stale/generic metadata, not a plates.js error). No SERIOUS
findings.

## Method detail

1. `research/plates_commons.json` holds the licence key, licence class, raw Commons `date`
   field, `artist`/`credit` fields and the full `wikitext_head` (including the actual
   `{{...}}` licence template(s) in the page's Licensing section) captured for every one of
   the 39 cids at fetch time. I parsed `game/plates.js` and this file with a script and
   diffed `license`/`licence_class`, `date`, `institution`/`credit`, and `creator`/`artist`
   for all 39 — every licence field matches (`PD` claims all backed by a `PD-*` template in
   the captured wikitext; the one `CC-BY` claim, `isk-horoscope`, backed by `{{cc-by-4.0}}`),
   and every date/institution difference is either an exact match or one of the already-flagged
   uncertainties.
2. I then live-fetched 16 of the Commons pages directly (not just the capture) to check the
   capture itself hadn't gone stale or been mis-read: both plates the illustrator flagged as
   internally disputed (`isk-frontispiece-lisbon`, `zaf-giraffe-embassy`), plus
   `herat-kulliyat-colophon` (1415/1417 dispute), `mam-maqamat-prince-1334` (Vienna ÖNB
   attribution + unproven al-Nasir Muhammad claim), `bustan-poet-judge` (Bihzad signature
   claim), `law-governor-merv-s23` and `herat-baysunghur-royal-court` (both "institution not
   named on Commons" claims), `isk-kaaba` ("Commons title still says British Museum" claim),
   `mam-fatawi-qadikhan-13` (PD-LACMA), `bulhan-leo` (the odd "Uncategorized" licence-template
   set), `law-library-basra-1237` (suspicious modern-sounding filename "A Library in Golden
   Islamic Age" — checked hardest, since a mislabelled modern illustration would be a rule-5
   violation), `sufi-ursa-major`, `ijaza-cairo-adab105`, `herat-gulistan-1427-first-page`,
   `mam-barquq-quran-open`, `astro-sufi-ophiuchus-5036`. **All 16 matched the illustrator's
   claim exactly, including every hedge and uncertainty phrase.**
3. Ran `python -m pytest tests/test_plates.py` — 11/11 pass (sha256 identity between
   `game/img/*`, the registry file, and `plates.js`'s recorded hash; every `registry_id`
   resolves and is `usage_status: approved`; `source_url` matches the registry's
   `digitization_source_url`; licence/kind whitelist; `relevance` always states a negation
   ("not", "no", etc.) and ends with a period; title never matches
   `astrolabe|globe|photograph of a (place|person)|render|AI-generated`).
4. Read `game/ui.js` lines 251-279 (`figureHtml`): the caption renders `p.relevance` verbatim
   and a "Provenance" `<details>` block renders `creator, date; institution (shelfmark). rights`
   verbatim, plus the source link and licence. Since every uncertainty the illustrator found
   is written directly into the `date`, `institution`, or `relevance` string values (not held
   in a separate flag the UI could drop), the rendering path cannot hide it — confirmed by
   reading the code, not assumed.
5. Cross-checked the 5 non-fresh-fetch plates (`bulhan-leo`, `bulhan-sagittarius`,
   `bustan-poet-judge`, `jal-yurts` — all re-registered under new `tv-*.jpg` registry entries
   that carry the plate-specific caption text in `notes`; and `sufi-ursa-major`, which reused
   a **pre-existing**, non-`tv`-prefixed registry entry, `local_file: c14-sufi-fixed-stars.jpg`)
   against `assets/manuscripts/registry.json`.
6. Scanned all 39 `kind` values (23 painting / 14 manuscript / 2 printed — matches
   `docs/PLATES.md`'s own count) and grepped title/creator/relevance/institution text across
   all 39 for photograph/object-photo/European-contact terms: no hits that indicate a rule
   violation (the two incidental hits, "Europe" in `print-timurbec-fr-title`'s relevance and
   "Renaissance" in `zaf-wedding-guests`'s institution name, are respectively about a 1723
   translation reaching Europe and the modern name of the Florence research institute that
   holds the folio — neither is a picture of Ibn Turka in European contact).

## Per-plate results

All 39 plates: **CONFIRMED**. "Checked against" = what I actually checked (L = live Commons
fetch this session; C = the captured `plates_commons.json` record; T = `tests/test_plates.py`
structural checks, which cover every row regardless).

| id | verdict | checked against | note |
|---|---|---|---|
| `zaf-accession-1370` | CONFIRMED | C, T | PD/date/institution match captured record exactly |
| `isk-frontispiece-lisbon` | CONFIRMED | **L**, C, T | Live-fetch confirms the flagged date dispute verbatim: file says "14th century" (via `{{other date}}`/QS date), category/sister files say 1410. Uncertainty carried into `date` field and thus into the caption. |
| `herat-kalila-1429-front` | CONFIRMED | C, T | PD/date/institution match |
| `mam-kalila-1354-burzoy` | CONFIRMED | C, T | PD/date/institution match |
| `herat-kulliyat-colophon` | CONFIRMED | **L**, C, T | Live-fetch confirms the flagged dispute: description says 1415, category says "Kulliyat-i Tarikhi, 1417, Herat" — matches plates.js `date` field exactly |
| `astro-sufi-ophiuchus-5036` | CONFIRMED | **L**, C, T | Live-fetch: BnF, arabe 5036, fol. 81v, c.1430-1440, "made for Ulugh Beg" all confirmed verbatim |
| `zaf-samarkand-1394` | CONFIRMED | C, T | Commons description explicitly says the Freer leaf is "only the right half of a double-page composition" — matches plates.js's institution note exactly |
| `isk-kaaba` | CONFIRMED | **L**, C, T | Live-fetch confirms the file title does say "British Museum" though Add. 27261 belongs to the British Library — matches plates.js's flagged correction exactly |
| `mam-barquq-quran-open` | CONFIRMED | **L**, C, T | Live-fetch: Cairo c.1370-75, BL Or 848 f.1v-2r, both copyist and illuminator explicitly marked "(attribution)", patron "probably...Sultan al-Ashraf Sha'ban...donated...by Sultan Faraj ibn Barquq" — matches plates.js's relevance text exactly |
| `mam-maqamat-prince-1334` | CONFIRMED | **L**, C, T | Live-fetch confirms: Vienna ÖNB AF9 appears only in the category, not the main description (matches "the Commons category names the Vienna manuscript"); al-Nasir Muhammad identification is category/sister-file only, not the file's own description (matches "unproven") |
| `zaf-giraffe-embassy` | CONFIRMED | **L**, C, T | Live-fetch confirms the flagged date dispute verbatim: filename says "October 1405", description text says "1404" — matches plates.js's `date` field exactly, including the note that Temür died Feb 1405 |
| `law-governor-rahba-1237` | CONFIRMED | C, T | PD/date/institution match |
| `isk-gulbenkian-portrait` | CONFIRMED | C, T | PD/date/institution match; Commons credits Barry (2004) for the Bahram Gur identification, as plates.js implies |
| `isk-astrological` | CONFIRMED | C, T | PD/date/institution match |
| `isk-horoscope` | CONFIRMED | C, T | The one CC-BY plate: captured licence template is literally `{{cc-by-4.0}}`, matching plates.js's `license: "CC-BY"` and the displayed credit line "Image: Wellcome Collection, CC BY 4.0" (`ui.js` only shows a credit line when `license` starts with `CC-BY`, and it does here) |
| `bulhan-leo` | CONFIRMED | **L**, C, T | Live-fetch confirms PD (`{{PD-old-70}}`/`{{PD-old-100}}`) and confirms the page really does carry a Commons "This media file is uncategorized" maintenance flag — this is a Commons housekeeping gap, not a rights problem, and plates.js already correctly declines to state a shelfmark from Commons itself ("the Commons page links the Bodleian record"), sourcing the shelfmark from OCCULTIMGDB instead as stated |
| `zaf-shahrukh-portrait` | CONFIRMED | C, T | plates.js correctly flags this file as `{{RetouchedPicture}}` (captured wikitext confirms the retouch notice) |
| `mam-fatawi-qadikhan-13` | CONFIRMED | **L**, C, T | Live-fetch: LACMA, M.73.5.22, second half of 15th century, licensed under the institution-specific `{{PD-LACMA}}` template — all match |
| `herat-baysunghur-hunt` | CONFIRMED | C, T | PD/date/institution match |
| `herat-majma-journey-1425` | CONFIRMED | C, T | Met credit line present, no accession number on the Commons page — matches plates.js's "gives no accession number" note |
| `mam-barquq-quran-anfal` | CONFIRMED | C, T | Same manuscript/licence family as `mam-barquq-quran-open`, dates match |
| `law-governor-merv-s23` | CONFIRMED | **L**, C, T | Live-fetch confirms the holding institution genuinely is not named anywhere on the Commons page (only "Saint-Petersburg Ms. S.23") — matches plates.js exactly |
| `herat-baysunghur-royal-court` | CONFIRMED | **L**, C, T | Live-fetch confirms no folio number, institution, or shelfmark appears on the Commons page itself — matches plates.js's "(assumed from the category)" hedge on the shelfmark |
| `mam-camel-riders-or9718` | CONFIRMED | C, T | PD/date/institution match |
| `bustan-poet-judge` | CONFIRMED | **L**, C, T | Live-fetch confirms the Bihzad-signature claim verbatim ("the signature of Bihzad appears...at the end of the monumental epigraphic inscription running around the vaulted porch"), the date (Dec 1488-Nov 1489), and Dar al-Kutub/Adab Farisi 22 f.30b |
| `zaf-funeral-1403` | CONFIRMED | C, T | Commons description explicitly states the holding is not given for these dispersed leaves — matches plates.js |
| `herat-gulistan-1427-first-page` | CONFIRMED | **L**, C, T | Live-fetch: Chester Beatty, Per 119.10 f.1v, "Calligraphy in nasta'liq script by Ja'far Tabrizi. AD 1427 (830H)" — matches exactly |
| `law-library-basra-1237` | CONFIRMED | **L**, C, T | This is the one I checked hardest given the modern-sounding filename ("A Library in Golden Islamic Age"): live-fetch confirms the underlying work is genuinely the 1237 al-Wasiti Maqamat page from BnF arabe 5847 (category: "Maqamat of al-Hariri - BNF Arabe5847"), not a modern painting — the filename is a later cataloguer's editorial title for the same period manuscript page, which is legitimate under the project's own rule ("A photograph of a manuscript folio is a manuscript source", `docs/PLATES.md` line 5) |
| `ijaza-cairo-adab105` | CONFIRMED | **L**, C, T | Live-fetch confirms the MacKay 1971 citation verbatim and the 12th-century al-Hariri autograph claim; Commons doesn't itself say "rough high-contrast scan" but that's the illustrator's own visual assessment of image quality, not a sourced factual claim, so it is not a discrepancy |
| `print-timurbec-fr-title` | CONFIRMED | C, T | 1723 Delft printed edition, PD, non-library bookseller copy as stated |
| `isk-shirin-garden` | CONFIRMED | C, T | PD/date/institution match |
| `zaf-wedding-guests` | CONFIRMED | C, T | Villa I Tatti / Harvard credit confirmed in captured sister-file note |
| `zaf-hunt-bukhara` | CONFIRMED | C, T | Art and History Trust / Sackler credit confirmed in captured record |
| `print-timurbec-giraffe` | CONFIRMED | C, T | 1723 printed translation, Internet Archive scan, PD |
| `jal-yurts` | CONFIRMED | C, T | "Possibly Sultan Ahmad Jalayir" hedge matches Commons' own "possibly"; no institution named on Commons, matching plates.js |
| `herat-kulliyat-adam-angels` | CONFIRMED | C, T | Ma'ruf Baghdadi attribution and Topkapi B.282 f.16 match captured record |
| `astro-sufi-orion-5036` | CONFIRMED | C, T | Same BnF manuscript/date family as the Ophiuchus plate (live-verified above); fol. 193v confirmed in filename/URL |
| `sufi-ursa-major` | CONFIRMED (plates.js); MINOR on the *registry*, see below | **L**, C, T | Live-fetch confirms Bodleian, MS Marsh 144, "c. 1009 copy" of the "c. 964" text — plates.js is accurate. |
| `bulhan-sagittarius` | CONFIRMED | C, T | Same manuscript/licence family as `bulhan-leo`; OCCULTIMGDB shelfmark/dating correctly flagged as not on the Commons page |

## The one MINOR item (not in plates.js — in the pre-existing registry record)

**`sufi-ursa-major`'s registry entry (`18f0369d-5769-466e-a22c-24bb969a49f4`,
`local_file: c14-sufi-fixed-stars.jpg`) carries stale, generic metadata that plates.js has
since superseded with the real attribution.** The registry record says
`institution: "Wikimedia Commons"` and `rights_note: "Public domain. Via Wikimedia Commons."`
— "Wikimedia Commons" is a hosting platform, not a holding institution, and the record carries
no shelfmark. `game/plates.js` (and thus what the player actually sees) correctly states
`institution: "Bodleian Library, Oxford"`, `shelfmark: "MS Marsh 144"`, which I confirmed live
against the Commons page. This is **not a rights problem** — both records agree the image is
public domain, and nothing rendered to the player is wrong — but the registry record itself
(the one the project treats as the provenance ledger, imported earlier from OCCULTIMGDB rather
than by this illustrator pass) is out of step with what the game now states about the same
asset. Fix: update this one registry record's `institution`/`shelfmark` fields to match
plates.js (Bodleian Library, Oxford / MS Marsh 144), the way the illustrator's fresh `tv-*`
records already do for the other 4 reused-collection plates. This is pre-existing (not
introduced by this illustrator pass) and outside my read-only remit to fix myself.

## Uncertainty-flag carry-through (task item 4)

Checked every plate the illustrator's own report named as uncertain
(`isk-frontispiece-lisbon`, `zaf-giraffe-embassy`, `herat-kulliyat-colophon`,
`mam-maqamat-prince-1334`, `isk-kaaba`, `law-governor-merv-s23`,
`herat-baysunghur-royal-court`, `bulhan-leo`, `bulhan-sagittarius`, `jal-yurts`,
`zaf-funeral-1403`, `mam-barquq-quran-open`) against both the live Commons page and the actual
`date`/`institution`/`relevance` string values in `game/plates.js`, and against `game/ui.js`'s
`figureHtml`, which renders those fields verbatim into the caption and the "Provenance"
`<details>` block with no filtering step that could drop a hedge. **Every flagged uncertainty
is carried into what the player sees, honestly, not resolved by silent pick.**

## Rule compliance (task item 5)

- **Kind distribution**: 23 painting / 14 manuscript / 2 printed, matching `docs/PLATES.md`'s
  own count exactly. `tests/test_plates.py::test_kind_and_licence_are_allowed` enforces the
  kind whitelist `{painting, manuscript, printed}` and passes.
- **No modern photograph / object photograph slipped in**: `tests/test_plates.py::
  test_no_modern_or_object_photography_slipped_in` (bans `astrolabe|globe|photograph of a
  (place|person)|render|AI-generated` in titles) passes; I additionally live-verified the one
  plate whose filename reads like a modern illustration title (`law-library-basra-1237`, "A
  Library in Golden Islamic Age") and confirmed it is the genuine 1237 al-Wasiti Maqamat folio
  under a later editorial filename, not a modern painting.
- **No European contact with Ibn Turka**: grepped title/creator/relevance/institution across
  all 39 for European-figure terms; the only two hits (`print-timurbec-fr-title`'s "Europe"
  and `zaf-wedding-guests`'s "Renaissance") are, respectively, about a 1723 French translation
  reaching European readers and the modern name of the Florence research centre holding a
  folio — neither depicts or asserts contact between Ibn Turka and a European figure. No
  violation.

## Totals

- **39/39 plates: CONFIRMED.**
- **0 SERIOUS** (licence or major-fact errors): none found. Ranked list: *empty.*
- **0 MINOR on plates.js itself.**
- **1 MINOR, out-of-scope-to-fix-here**: `sufi-ursa-major`'s pre-existing registry record
  (`assets/manuscripts/registry.json`, id `18f0369d-5769-466e-a22c-24bb969a49f4`) has stale
  generic institution/no shelfmark, superseded but not corrected in the registry itself; see
  above for the exact fix.
- Structural build gates: `tests/test_plates.py`, 11/11 passing at audit time.
- Live external verification: 16/39 plates (41%) fetched directly from Wikimedia Commons this
  session, chosen to cover every plate the illustrator flagged as uncertain; 39/39 cross-checked
  against the `research/plates_commons.json` capture. Zero discrepancies found beyond the one
  registry-metadata item above, which is not a plates.js/game-facing error.
