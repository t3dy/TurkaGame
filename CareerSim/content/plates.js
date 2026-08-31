// plates.js — art briefs for every choice page that has no plate yet.
//
// Purpose: guide the search for period illustration. Each brief says what the picture
// should SHOW and how it should be FRAMED, then gives search terms and candidate
// repositories. The catalogue site (site/plates/) renders these alongside the 24
// encounters that already have plates.
//
// SOURCING DISCIPLINE — this is a design-phase brainstorm, not a shipping product, so
// rights are not a blocker here. But every candidate must carry enough provenance to
// seek rights later: repository, work, shelfmark or accession where known, and a URL.
// `verified` marks whether I confirmed the specific item exists at that shelfmark.
// Where verified is false, treat the entry as a SEARCH STRATEGY, not a citation —
// several are described generically on purpose rather than risk an invented shelfmark.
//
// Repositories researched for this project, with licence as found (Aug 2026):
//   digital-walters  CC0, no attribution required, high-res TIFF. Best first stop.
//   met              CC0 for public-domain works (Open Access, since 2017).
//   smithsonian      CC0. Freer|Sackler holds major Persian material incl. the
//                    Divan of Sultan Ahmad Jalayir, c. 1400 — Ibn Turka's own decade.
//   chester-beatty   Creative Commons, attribution required; exact variant unconfirmed.
//                    Outstanding Persian/Timurid holdings.
//   gallica          Free for non-commercial and academic use with the credit line
//                    "Source gallica.bnf.fr / Bibliothèque nationale de France";
//                    commercial use requires a licence fee.
//   qdl              Qatar Digital Library — British Library Arabic/Persian manuscripts.
//   wikimedia        Already this project's main source (27 of 30 registry entries).
//   princeton        Islamic Manuscripts Collection; 3 registry entries already.

export const REPOSITORIES = {
  'digital-walters': { name: 'The Digital Walters', licence: 'CC0 — no attribution required', url: 'https://www.thedigitalwalters.org/' },
  'met': { name: 'The Metropolitan Museum of Art', licence: 'CC0 for public-domain works', url: 'https://www.metmuseum.org/art/collection' },
  'smithsonian': { name: 'Smithsonian (Freer | Sackler)', licence: 'CC0', url: 'https://asia.si.edu/collections/' },
  'chester-beatty': { name: 'Chester Beatty, Dublin', licence: 'Creative Commons, attribution required (variant unconfirmed)', url: 'https://chesterbeatty.ie/collections/' },
  'gallica': { name: 'Gallica / BnF', licence: 'Free non-commercial + academic with credit; commercial requires fee', url: 'https://gallica.bnf.fr/' },
  'qdl': { name: 'Qatar Digital Library (British Library)', licence: 'Mostly open; check per item', url: 'https://www.qdl.qa/' },
  'wikimedia': { name: 'Wikimedia Commons', licence: 'Per file — CC0 / CC BY-SA / PD', url: 'https://commons.wikimedia.org/' },
  'princeton': { name: 'Princeton Islamic Manuscripts', licence: 'Per item; many open', url: 'https://library.princeton.edu/special-collections' },
};

const B = (phase, rubric, brief, composition, search, candidates, note) =>
  ({ phase, rubric, brief, composition, search, candidates, note: note || null });

export const PLATE_BRIEFS = {
  // ─────────────────────────────── PHASE I · CAIRO ───────────────────────────────
  madrasa_training: B(1, 'AT THE MADRASA · MORNING LESSONS',
    'A teaching circle: a turbaned master seated against a pillar, students cross-legged in a half-ring, one holding an open codex, writing boards on knees. Daylight from a courtyard beyond.',
    'Horizontal, figures at one third height, architecture giving the top two thirds. Should read as ORDINARY — this is the orthodox training the player will later depart from.',
    ['madrasa teaching scene manuscript', 'Maqamat al-Hariri school', 'majlis lesson miniature', 'students writing boards Islamic'],
    [{ repo: 'gallica', work: 'al-Ḥarīrī, Maqāmāt (the Schefer Ḥarīrī)', shelfmark: 'BnF Arabe 5847', url: 'https://gallica.bnf.fr/', verified: false, note: 'The canonical source of medieval Islamic teaching/assembly scenes. Earlier than our period (1237) but the compositional vocabulary is what we want.' },
     { repo: 'digital-walters', work: 'Search Arabic/Persian codices for teaching scenes', verified: false }]),

  madrasa_disputation: B(1, 'AT THE MADRASA · A PUBLIC DISPUTATION',
    'Two scholars facing off before a seated audience, one mid-gesture with an index finger raised — the standard iconography of argument. Onlookers ranked behind.',
    'Confrontational symmetry: two figures balanced left and right, audience as a frieze behind. Tension in the hands, not the faces.',
    ['munazara disputation miniature', 'debate scene Persian manuscript', 'scholars arguing Islamic painting'],
    [{ repo: 'chester-beatty', work: 'Persian manuscript debate scenes', verified: false },
     { repo: 'gallica', work: 'Maqāmāt assembly scenes', shelfmark: 'BnF Arabe 5847', verified: false }]),

  circle_discipleship: B(1, 'AKHLĀṬĪ’S COURTYARD · THE MASTER’S REQUEST',
    'A night interior, small: master and single disciple, close, a lamp between them. Something is being asked that should not be overheard.',
    'Tight and dark. Two figures only. The lamp is the light source and the emotional centre.',
    ['Sufi master disciple night miniature', 'khanqah lamp scene Persian', 'initiation shaykh murid painting'],
    [{ repo: 'smithsonian', work: 'Persian Sufi manuscript painting, Freer|Sackler', verified: false },
     { repo: 'met', work: 'Search: Sufi teaching, Persian, 15th c.', verified: false }]),

  circle_naming: B(1, 'AKHLĀṬĪ’S COURTYARD · THE CIRCLE TAKES A NAME',
    'A group of six to ten men in a closed courtyard at night, seated in a ring — a deliberate assembly, not a class. One speaks; the rest are still.',
    'The ring seen from slightly above so the circle reads AS a circle. This is the Ikhwān al-Ṣafāʾ naming scene: the composition should be the argument.',
    ['Ikhwan al-Safa Brethren of Purity manuscript', 'assembly circle night Persian miniature', 'Rasail Ikhwan al-Safa illustration'],
    [{ repo: 'wikimedia', work: 'Rasāʾil Ikhwān al-Ṣafāʾ illustrated pages', verified: false, note: 'The 10th-c. Brethren whose name this circle takes — a picture from their own tradition would be the ideal pairing.' },
     { repo: 'qdl', work: 'BL Arabic manuscripts, philosophical assemblies', verified: false }]),

  khanqah_qasim: B(1, 'AT THE KHĀNQĀH · A POET IN FULL FLIGHT',
    'A poet reciting to a rapt gathering — arms open, head tilted back, listeners leaning in. Wine or tea vessels on the floor. Warm, crowded, slightly out of control.',
    'Off-centre poet, weight of the crowd pushing toward him. The most saturated plate in Phase I.',
    ['Persian poet reciting majlis miniature', 'sama gathering painting', 'Hafez Divan illustrated assembly'],
    [{ repo: 'smithsonian', work: 'Divan of Sultan Ahmad Jalayir, c. 1400', accession: 'Freer Gallery F1932.29–37', url: 'https://asia.si.edu/', verified: false, note: 'c. 1400 Jalayirid — the closest major illustrated Divan to Ibn Turka\'s own decade. Strong first candidate.' },
     { repo: 'chester-beatty', work: 'Illustrated Persian dīvāns', verified: false }]),

  muwaqqit_yazdi: B(1, 'THE TIMEKEEPER’S POST · ANOTHER PERSIAN AT THE DIALS',
    'Two men at an instrument — astrolabe or sundial — one demonstrating, one checking. The first meeting of Ibn Turka and Yazdī. They should look like equals who have just recognised each other.',
    'Both hands on or near the instrument. The instrument is the third character.',
    ['astrolabe astronomers manuscript miniature', 'muwaqqit timekeeper Islamic', 'two scholars instrument Persian painting'],
    [{ repo: 'met', work: 'Persian/Mamluk astrolabes and astronomical scenes', verified: false },
     { repo: 'wikimedia', work: 'Persian astrolabe (already used at act2-persian-astrolabe.jpg)', verified: true, note: 'The project already holds a cleared astrolabe plate — a second, figural scene would complement it.' }]),

  // ─────────────────────────────── PHASE II · ISFAHAN ───────────────────────────────
  isfahan_appointment: B(2, 'THE TRIBUNAL · THE OFFICE OFFERED',
    'A robing or investiture: a seated official receiving a robe of honour (khilʿa) or a document of appointment from a superior, attendants flanking.',
    'Formal, frontal, hierarchical — the opposite of the Cairo night scenes. Power arriving as ceremony.',
    ['khilat robe of honour investiture miniature', 'Persian appointment ceremony painting', 'qadi judge manuscript illustration'],
    [{ repo: 'chester-beatty', work: 'Timurid/Turkman court investiture scenes', verified: false },
     { repo: 'met', work: 'Search: Persian court audience, 15th c.', verified: false }]),

  isfahan_weak_litigant: B(2, 'THE TRIBUNAL · A POWERFUL MAN AND A POOR ONE',
    'A judgment scene: judge seated on a low dais, two litigants before him at conspicuously different social registers — dress, posture, retinue. A scribe records at the side.',
    'The asymmetry must be legible at a glance: one man has people behind him, the other does not.',
    ['qadi court judgment miniature', 'Islamic legal scene manuscript', 'Maqamat judge litigants'],
    [{ repo: 'gallica', work: 'Maqāmāt al-Ḥarīrī judgment scenes', shelfmark: 'BnF Arabe 5847', verified: false, note: 'The Maqāmāt has several qāḍī scenes and is the standard visual source for Islamic courtroom iconography.' },
     { repo: 'digital-walters', work: 'Arabic legal/administrative manuscripts', verified: false }]),

  isfahan_inheritance: B(2, 'THE FAMILY HOUSE · WHAT THE HOUSE EXPECTS',
    'A domestic interior: an older relative and the protagonist, a household beyond the doorway. Property, obligation, family. Not a court, not a school.',
    'Interior architecture doing the work — a house that is itself an expectation. Figures small within it.',
    ['Persian domestic interior miniature', 'Timurid house courtyard painting', 'family scene Islamic manuscript'],
    [{ repo: 'smithsonian', work: 'Persian domestic architecture in manuscript painting', verified: false },
     { repo: 'digital-walters', work: 'Persian illustrated codices, interior scenes', verified: false }]),

  isfahan_deputy: B(2, 'THE FAMILY HOUSE · YOUR DEPUTY WANTS SOMETHING',
    'A junior official presenting a petition or document to a seated superior — deferential posture, but the document is the point and he is not leaving without an answer.',
    'Standing petitioner, seated principal. The gap between them is the subject.',
    ['petition presentation Persian miniature', 'secretary official document manuscript', 'Timurid administration scene'],
    [{ repo: 'chester-beatty', work: 'Persian chancery/administrative scenes', verified: false }]),

  isfahan_copyists: B(2, 'THE WARRĀQ’S SHOP · A MAN WHO COPIES ANYTHING',
    'A bookseller-copyist at work: low desk, reed pen, inkpot, stacked bindings, a shop open to the street. Commerce in manuscripts.',
    'Cluttered and horizontal. Books as goods, not treasures.',
    ['warraq bookseller manuscript miniature', 'scribe copying Persian painting', 'kitabkhana workshop illustration'],
    [{ repo: 'digital-walters', work: 'Scribal and colophon illustrations', verified: false },
     { repo: 'met', work: 'Search: scribe, Persian manuscript painting', verified: false }]),

  isfahan_inks: B(2, 'THE WARRĀQ’S SHOP · THE INK THAT EATS THE PAGE',
    'Close on materials: inkpots, pigment dishes, a page showing corrosion or burn-through. Almost a still life. The craft turning against itself.',
    'Tight, object-focused, no faces if possible. A rare non-figural plate.',
    ['iron gall ink corrosion manuscript', 'Islamic pigments inkpot', 'damaged folio ink burn'],
    [{ repo: 'digital-walters', work: 'Manuscript condition/conservation imagery', verified: false, note: 'The Digital Walters photographs damage honestly at high resolution — good hunting ground for a corroded page.' },
     { repo: 'wikimedia', work: 'Iron gall ink corrosion examples', verified: false }]),

  isfahan_first_treatise: B(2, 'THE WARRĀQ’S SHOP · THE FIRST THING WORTH CIRCULATING',
    'A finished treatise being handed over, or an opening page (ʿunwān) freshly illuminated. The first work going out into the world.',
    'The page itself as hero — an illuminated incipit shot square, minimal figures.',
    ['illuminated unwan opening page Persian', 'sarlawh illumination Timurid', 'treatise incipit manuscript'],
    [{ repo: 'digital-walters', work: 'Illuminated ʿunwān pages, Persian codices', verified: false, note: 'CC0 and photographed at 1200PPI for illuminated pages — ideal for a full-bleed incipit plate.' },
     { repo: 'princeton', work: 'Islamic Manuscripts, illuminated openings', verified: false }]),

  isfahan_preacher: B(2, 'THE FRIDAY MOSQUE · A SERMON AGAINST THE LETTER-MEN',
    'A preacher on a minbar, congregation below, one listener at the edge visibly the target of what is being said.',
    'Vertical: the minbar high left or right, the crowd low. The player is in that crowd.',
    ['minbar preacher khutba miniature', 'Friday mosque sermon Persian painting', 'preacher congregation Islamic manuscript'],
    [{ repo: 'gallica', work: 'Maqāmāt preaching scenes', shelfmark: 'BnF Arabe 5847', verified: false, note: 'The Maqāmāt minbar scene is the standard image of Islamic preaching.' },
     { repo: 'chester-beatty', work: 'Persian mosque interiors', verified: false }]),

  isfahan_study_one: B(2, 'YOUR OWN STUDY · THE LETTERS AND THE NUMBERS',
    'A solitary scholar at night with a page of letters and numerals — abjad work in progress. Diagrams, not prose.',
    'One figure, one lamp, one page. The quietest plate in the game and the most important: this is the science being made.',
    ['abjad numerology table manuscript', 'lettrism huruf diagram Islamic', 'scholar writing night Persian miniature'],
    [{ repo: 'princeton', work: 'Islamic Manuscripts — lettrist and numerological diagrams', verified: false, note: 'Princeton already supplies 3 registry entries; its Islamic MSS include occult-scientific material.' },
     { repo: 'qdl', work: 'BL Arabic MSS, ʿilm al-ḥurūf', verified: false }]),

  isfahan_qasim_letter: B(2, 'YOUR OWN STUDY · A LETTER FROM QĀSIM',
    'A letter being read alone. Correspondence as intrusion — the outside world arriving on a single sheet.',
    'The sheet catches the light; the reader\'s face is turned into shadow. Intimate.',
    ['reading letter Persian miniature', 'epistle munshaat manuscript', 'messenger delivering letter Islamic painting'],
    [{ repo: 'smithsonian', work: 'Persian narrative painting, letter-reading scenes', verified: false }]),

  isfahan_departure: B(2, 'THE SUMMONS · A PRINCE SENDS FOR YOU',
    'A royal messenger delivering a summons — a mounted rider arriving, or a courier presenting a sealed farmān at a doorway.',
    'Movement entering a static frame. The horse, if there is one, should feel like an interruption.',
    ['royal messenger farman delivery miniature', 'Timurid courier horse painting', 'sealed decree presentation Persian'],
    [{ repo: 'chester-beatty', work: 'Timurid/Turkman narrative painting, arrivals', verified: false },
     { repo: 'met', work: 'Search: Persian horseman, 15th c.', verified: false }]),

  // ─────────────────────────────── PHASE III · THE COURT ───────────────────────────────
  court_patron_choice: B(3, 'THE AUDIENCE HALL · WHOSE MAN WILL YOU BE',
    'An enthroned prince receiving in audience, courtiers ranked, a newcomer being presented. THE patronage image.',
    'Full court hierarchy visible — throne, attendants, supplicant. Grand and cold.',
    ['Timurid enthronement audience miniature', 'Shahrukh Baysunghur court scene', 'prince enthroned courtiers Persian painting'],
    [{ repo: 'chester-beatty', work: 'Timurid court/enthronement scenes', verified: false, note: 'Chester Beatty\'s Persian holdings are the strongest single source for Timurid court imagery.' },
     { repo: 'smithsonian', work: 'Freer|Sackler Persian court painting', verified: false },
     { repo: 'met', work: 'Search: enthronement, Iran, 15th century', verified: false }]),

  court_commission: B(3, 'THE AUDIENCE HALL · THE PATRON WANTS SOMETHING USEFUL',
    'A patron setting a task: a ruler gesturing toward a kneeling scholar, an object or document between them. Instruction, not conversation.',
    'The patron\'s gesture is the composition. Everything points away from him toward the work.',
    ['patron commissioning scholar miniature', 'Timurid royal commission painting', 'ruler instructing courtier Persian'],
    [{ repo: 'chester-beatty', work: 'Timurid patronage scenes', verified: false }]),

  court_prince_question: B(3, 'THE AUDIENCE HALL · THE PRINCE’S QUESTION',
    'A close audience: prince and scholar, few attendants, the prince leaning forward. A real question being asked in a room built for ceremony.',
    'Intimacy inside grandeur — cut in close so the hall is implied, not shown.',
    ['prince scholar consultation miniature', 'Persian royal conversation painting', 'ruler questioning sage manuscript'],
    [{ repo: 'smithsonian', work: 'Persian royal consultation scenes', verified: false }]),

  court_astronomer: B(3, 'THE STAR-TABLE ROOM · A COMPUTER WANTS TO ARGUE',
    'Astronomers at work: tables, instruments, a quadrant or armillary, two men disagreeing over a sheet of figures.',
    'Paper and instruments crowding the frame. Argument conducted through numbers.',
    ['observatory astronomers manuscript miniature', 'zij astronomical tables illustration', 'Maragha Samarkand observatory painting'],
    [{ repo: 'wikimedia', work: 'Ottoman/Persian observatory scenes (e.g. Istanbul observatory of Taqī al-Dīn)', verified: false, note: 'The Taqī al-Dīn observatory miniature is the single most reproduced image of Islamic astronomers at work; later (1570s) but iconographically ideal.' },
     { repo: 'qdl', work: 'BL astronomical manuscripts', verified: false }]),

  court_rival_astrologer: B(3, 'THE STAR-TABLE ROOM · A RIVAL CHALLENGES YOUR CALCULATION',
    'Two astrologers in confrontation over a horoscope diagram — the circular chart between them, both pointing.',
    'The horoscope wheel dead centre, faces at the edges. The diagram wins the frame.',
    ['horoscope chart Persian manuscript', 'astrological diagram nativity Islamic', 'astrologers dispute miniature'],
    [{ repo: 'wikimedia', work: 'Horoscope of Iskandar Sulṭān (Wellcome)', shelfmark: 'Wellcome MS Persian 474', url: 'https://wellcomecollection.org/', verified: false, note: 'The Iskandar Sulṭān horoscope is the single most on-point object in existence for this game: cast for Ibn Turka\'s own first patron, 1411. Wellcome licenses CC BY. HIGH PRIORITY.' }]),

  court_bazm_confession: B(3, 'THE FEAST · WHO EVERYONE ACTUALLY IS',
    'A feast late in the evening — wine, musicians, guests in various states of candour. The formal occasion has decayed into truth-telling.',
    'Horizontal sprawl. Nobody sitting properly any more.',
    ['bazm feast Persian miniature', 'wine gathering musicians Timurid painting', 'courtly banquet manuscript'],
    [{ repo: 'smithsonian', work: 'Divan of Sultan Ahmad Jalayir bazm scenes, c. 1400', accession: 'Freer F1932.29–37', verified: false },
     { repo: 'chester-beatty', work: 'Persian bazm/feast painting', verified: false }]),

  court_razm_date: B(3, 'THE CAMPAIGN · AN AUSPICIOUS DATE FOR THE ARMY',
    'An astrologer consulted on campaign: tent or field setting, a chart unrolled, commanders waiting on an answer.',
    'Military and astrological apparatus in one frame. The army is waiting on a diagram.',
    ['election astrology military campaign miniature', 'army camp tent Persian painting', 'astrologer advising ruler manuscript'],
    [{ repo: 'chester-beatty', work: 'Persian campaign/encampment scenes', verified: false },
     { repo: 'met', work: 'Search: Persian military encampment', verified: false }]),

  court_razm_device: B(3, 'THE CAMPAIGN · A SOLDIER WANTS THE TRICK',
    'A soldier requesting a talisman — a plain military man and a scholar, an amulet or inscribed square changing hands.',
    'Two figures, one small object. The object is what the picture is about.',
    ['talisman amulet Islamic manuscript', 'magic square wafq talismanic shirt', 'protective amulet warrior'],
    [{ repo: 'met', work: 'Talismanic shirt, Islamic', verified: false, note: 'Met holds talismanic shirts under Open Access CC0 — an inscribed garment is a superb visual for military talismanry.' },
     { repo: 'wikimedia', work: 'Talismanic shirts and magic squares', verified: false }]),

  // ─────────────────────────────── PHASE IV · THE SUMMA ───────────────────────────────
  pivot_begin: B(4, 'THE DESK · BEGINNING THE SUMMA',
    'A blank first page and a prepared pen. The moment before a major work starts.',
    'Almost empty. Deliberate negative space — the only plate in the game that should feel unpopulated.',
    ['blank folio ruled manuscript', 'reed pen qalam inkwell', 'scribe beginning manuscript'],
    [{ repo: 'digital-walters', work: 'Blank/ruled folios and writing implements', verified: false }]),

  pivot_language: B(4, 'THE DESK · IN WHICH LANGUAGE, AND FOR WHOM',
    'Arabic and Persian script side by side — two pages, two hands, or a bilingual page. The choice of audience made visible as letterforms.',
    'Split composition. Script as subject, not decoration.',
    ['bilingual Arabic Persian manuscript page', 'naskh nastaliq comparison', 'interlinear Persian translation manuscript'],
    [{ repo: 'digital-walters', work: 'Bilingual or glossed Arabic/Persian codices', verified: false },
     { repo: 'princeton', work: 'Islamic MSS with interlinear Persian', verified: false }]),

  pivot_structure: B(4, 'THE DESK · WHAT TO CONCEAL AND WHAT TO EXPLAIN',
    'A page with deliberate obscurity — cipher, abbreviation, coded marginalia, or a diagram whose key is withheld.',
    'The page should be beautiful and unreadable. Concealment as craft.',
    ['cipher cryptography Arabic manuscript', 'coded marginalia Islamic', 'secret alphabet occult manuscript'],
    [{ repo: 'qdl', work: 'BL Arabic MSS on cryptography (al-Kindī tradition)', verified: false },
     { repo: 'princeton', work: 'Occult-scientific MSS with cipher', verified: false }]),

  pivot_globes: B(4, 'THE DESK · THE THREE GLOBES OF LIGHT',
    'A cosmological diagram of nested or concentric spheres — light emanating through graded levels.',
    'Pure diagram, centred, symmetrical. This is the metaphysics on one page.',
    ['concentric spheres cosmological diagram Islamic', 'celestial spheres manuscript illustration', 'emanation diagram Sufi manuscript'],
    [{ repo: 'wikimedia', work: 'Islamic cosmological diagrams (ʿAjāʾib al-makhlūqāt tradition)', verified: false, note: 'The project already holds a Qazwīnī plate (c19-qazwini-angel.jpg), so the ʿAjāʾib tradition is proven usable here.' },
     { repo: 'princeton', work: 'Cosmological diagrams in Islamic MSS', verified: false }]),

  pivot_wafq: B(4, 'THE DRAWING BOARD · THE SEVEN TIERS',
    'A magic square (wafq) under construction — grid partly filled, working numerals visible.',
    'Flat, geometric, top-down on the page. Mathematics as drawing.',
    ['wafq magic square manuscript', 'buduh magic square Islamic', 'numerical grid talisman manuscript'],
    [{ repo: 'wikimedia', work: 'Islamic magic squares', verified: true, note: 'The project already holds several: c20-letter-word-wafq-table, c31-5x5-jafar-wafq, cs-p4-persian-wafq-6x6, cs-p2-buduh-square. A seven-tier example would extend the set.' }]),

  pivot_yazdi_copy: B(4, 'THE CIRCLE · YAZDĪ ASKS FOR THE AUTOGRAPH',
    'A manuscript being handed from author to disciple. The transmission moment — and echoes the triple portrait already in hand.',
    'Two figures, one codex, hands overlapping on it.',
    ['manuscript transmission ijaza scene', 'teacher giving book to student miniature', 'author autograph copy Islamic'],
    [{ repo: 'wikimedia', work: 'Ibn Turka with Qāḍīzāda Rūmī and Yazdī', verified: false, note: 'The project HOLDS this image (research inbox), and its cut region "the-document" is exactly this beat. Provenance unidentified — see HANDOVER §5. Best single match in the whole catalogue if it can be sourced.' }]),

  pivot_teach: B(4, 'THE CIRCLE · WHO GETS THE KNOWLEDGE',
    'A master with a small selected group versus a larger crowd beyond — the esoteric/exoteric decision as a picture.',
    'Two zones: an inner ring lit, an outer crowd in shadow. Boundary is the subject.',
    ['esoteric teaching circle miniature', 'Sufi initiation gathering painting', 'master selected disciples manuscript'],
    [{ repo: 'chester-beatty', work: 'Sufi assembly scenes', verified: false }]),

  pivot_sensory: B(4, 'THE DESK · AGAINST AVICENNA ON THE SENSES',
    'A diagram of the faculties of the soul, or the ventricles of the brain with the internal senses labelled.',
    'Schematic head or nested-faculty chart. Medieval cognitive science as drawing.',
    ['internal senses brain ventricles diagram medieval', 'faculties of soul diagram Islamic', 'Avicenna De Anima illustration'],
    [{ repo: 'wikimedia', work: 'Medieval brain-ventricle / internal senses diagrams', verified: false },
     { repo: 'qdl', work: 'BL medical/philosophical MSS, Ibn Sīnā tradition', verified: false }]),

  pivot_sources: B(4, 'THE DESK · WHOSE NAMES GO IN THE MARGINS',
    'A page dense with marginalia and glosses in several hands — the apparatus of citation.',
    'Text block small, margins crowded. The margins are the picture.',
    ['marginalia glosses Arabic manuscript', 'hashiya commentary margins Islamic', 'annotated folio multiple hands'],
    [{ repo: 'digital-walters', work: 'Heavily glossed Arabic/Persian folios', verified: false, note: 'CC0 high-res makes marginalia legible, which matters for this one.' },
     { repo: 'princeton', work: 'Annotated Islamic MSS', verified: false }]),

  pivot_grimoire: B(4, 'THE CIRCLE · THE POPULAR COMMISSION',
    'A working grimoire rather than a philosophical treatise: cruder drawing, seals, angel names, practical operations.',
    'Deliberately less refined than the other plates. The contrast is the point.',
    ['Shams al-Maarif al-Buni manuscript', 'grimoire seals angel names Arabic', 'practical magic manuscript Islamic'],
    [{ repo: 'wikimedia', work: 'Shams al-Maʿārif (al-Būnī)', verified: true, note: 'Already in the registry as act1-ms-17c-opening.jpg — the al-Būnī tradition is cleared and available. A second operational page would suit this beat.' },
     { repo: 'princeton', work: 'Islamic occult MSS, operative texts', verified: false }]),

  pivot_departure: B(4, 'THE FIRST SUMMONS · A TRIBUNAL SENDS FOR YOU',
    'An official summons arriving — a sealed document, or armed men at a scholar\'s door. The mood turns here.',
    'Threat entering domestic space. Doorway framing.',
    ['arrest summons manuscript miniature', 'officials at door Persian painting', 'sealed decree Islamic'],
    [{ repo: 'chester-beatty', work: 'Persian narrative painting, arrest/summons', verified: false }]),

  // ─────────────────────────────── PHASE V · THE TRIALS ───────────────────────────────
  trial_second: B(5, 'THE TRIBUNAL · THE SECOND INQUISITION',
    'A formal examination: a panel of jurists, the accused standing alone, documents in evidence.',
    'The panel as a wall of faces. One man facing many. Should feel worse than the first tribunal.',
    ['inquisition tribunal Islamic manuscript', 'ulama panel judgment miniature', 'heresy trial Persian painting'],
    [{ repo: 'chester-beatty', work: 'Persian judicial/tribunal scenes', verified: false },
     { repo: 'gallica', work: 'Maqāmāt judicial assemblies', shelfmark: 'BnF Arabe 5847', verified: false }]),

  trial_patron_shield: B(5, 'THE PATRON’S DOOR · ASKING FOR PROTECTION',
    'A supplicant before a patron — kneeling or bowing, the asymmetry total. The gift-scene inverted: now you are asking.',
    'Deliberately mirror the patronage plates from Phase III, with the postures reversed.',
    ['supplication petition ruler miniature', 'kneeling before prince Persian painting', 'seeking protection court scene'],
    [{ repo: 'wikimedia', work: 'Akhlāṭī receiving gifts from Barqūq', shelfmark: 'BL Or. 11837 f.117', verified: true, note: 'The project holds this. Its inverse — patronage as dependence rather than reward — is exactly this beat; consider reusing the same plate to make the rhyme.' }]),

  trial_recant_offer: B(5, 'THE PATRON’S DOOR · A QUIET ARRANGEMENT IS PROPOSED',
    'A private conversation in a corner — two men, no audience, a document between them. Something is being offered that will not be minuted.',
    'Small, shadowed, off to one side. The two figures outside the wall in the Akhlāṭī plate are the model.',
    ['private conversation conspiracy miniature', 'two figures conferring Persian painting', 'secret negotiation manuscript'],
    [{ repo: 'wikimedia', work: 'Akhlāṭī plate, region "two-outside-wall"', shelfmark: 'BL Or. 11837 f.117', verified: true, note: 'Already cut as an isolated region in imagelab/output. Directly usable.' }]),

  trial_qasim_exile: B(5, 'THE CIRCLE · QĀSIM-I ANVĀR IS EXILED',
    'A departure under compulsion — a figure leaving a city gate with a small bundle, watchers behind.',
    'The gate as frame. The exile small against it.',
    ['exile departure city gate miniature', 'banishment Persian painting', 'traveller leaving city manuscript'],
    [{ repo: 'chester-beatty', work: 'Persian narrative departures', verified: false },
     { repo: 'smithsonian', work: 'Persian painting, journeys and departures', verified: false }]),

  trial_student_copy: B(5, 'THE CIRCLE · WHAT TO DO WITH THE MANUSCRIPTS',
    'Manuscripts being hidden, dispersed or bundled — books treated as contraband.',
    'Hands and bindings. No faces needed. Urgency.',
    ['hiding books manuscripts miniature', 'library dispersal Islamic painting', 'bundled manuscripts codices'],
    [{ repo: 'digital-walters', work: 'Bindings and bundled codices', verified: false }]),

  trial_rival_book: B(5, 'THE CIRCLE · SOMEONE HAS SIMPLIFIED YOU',
    'Two versions of one work side by side — a dense original and a thin popularisation. Intellectual theft as a picture.',
    'Two codices, unequal. The cheap one is on top.',
    ['abridgement mukhtasar manuscript', 'two versions codex comparison', 'popular epitome Islamic manuscript'],
    [{ repo: 'digital-walters', work: 'Mukhtaṣar (abridgement) manuscripts', verified: false }]),

  trial_checkpoint: B(5, 'THE EASTERN GATE · A CHECKPOINT WITH YOUR NAME AT IT',
    'A city gate with guards inspecting travellers — documents checked, a list consulted.',
    'Architecture of control. The gate is the antagonist.',
    ['city gate guards inspection miniature', 'Persian city walls painting', 'travellers checkpoint manuscript'],
    [{ repo: 'chester-beatty', work: 'Persian city gate scenes', verified: false },
     { repo: 'met', work: 'Search: Persian architecture, city gate', verified: false }]),

  trial_letters: B(5, 'THE CIRCLE · A COURT STILL WRITES',
    'Correspondence arriving in exile — a letter with a court seal reaching a man who has nothing else left.',
    'The seal is the point: institutional power reaching a private man. Small, warm, ambiguous.',
    ['sealed letter court seal Persian', 'munshaat correspondence manuscript', 'receiving letter exile painting'],
    [{ repo: 'qdl', work: 'Persian/Arabic correspondence with seals and tughras', verified: false }]),

  trial_destination: B(5, 'THE PATRON’S DOOR · WHERE DOES AN EXILE GO',
    'A traveller at a crossroads, or a map-like view of routes — west to the Aqquyunlu, east to Samarkand, back to Isfahan. The Ulugh Beg choice lives here.',
    'Openness and indecision. If a Samarkand-specific image can be found, this is where it belongs.',
    ['traveller crossroads Persian miniature', 'Samarkand Registan architecture', 'Ulugh Beg observatory Samarkand'],
    [{ repo: 'wikimedia', work: 'Ulugh Beg Observatory, Samarkand — site and sextant', verified: false, note: 'Photographs of the surviving meridian arc are widely available on Commons and would ground the Samarkand branch specifically.' },
     { repo: 'met', work: 'Search: Timurid architecture, Samarkand', verified: false }]),

  trial_testament: B(5, 'THE CIRCLE · THE LAST DOCUMENT',
    'A final written testament — an old man, a page, a witness. The closing beat of the game.',
    'Should rhyme with pivot_begin: that plate was a blank page, this one is a finished one.',
    ['testament will manuscript witness', 'deathbed scholar Persian miniature', 'final colophon manuscript'],
    [{ repo: 'digital-walters', work: 'Colophons and completion statements', verified: false, note: 'A real colophon — the scribe recording the date of completion — would close the game on a genuine historical object.' },
     { repo: 'chester-beatty', work: 'Persian deathbed/testament scenes', verified: false }]),
};

export const BRIEF_COUNT = Object.keys(PLATE_BRIEFS).length;
