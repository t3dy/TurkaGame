// phase1.js — Phase I: Cairo, The Experimental Cosmopolis (c. 1385–1397).
// Content data only — no logic. Grounding per encounter: ATTESTED / PLAUSIBLE-GAP /
// INVENTED-COMPATIBLE, sources point at docs/BIOGRAPHY.md (canonical research layer).
// Authoring rules: docs/ENCOUNTER_ATOMS.md lint rules; prose per the VN WRITING_GUIDE.

export const PHASE = {
  id: 1,
  name: 'CAIRO — THE EXPERIMENTAL COSMOPOLIS',
  dateline: 'c. 1385–1397',
  time: 7,
  intro:
    'You are ʿAlī ibn Turka of Isfahan, young, far from home, in the largest city of the Islamic world. ' +
    'Somewhere in Mamluk Cairo, Sayyid Ḥusayn Akhlāṭī — lettrist, alchemist, geomancer — teaches a circle ' +
    'that will one day call itself the New Brethren of Purity. You have seven seasons before the road home. ' +
    'Where you spend them decides who arrives in Isfahan.',
};

export { PEOPLE, ARTIFACTS } from './people.js?v=2';

const IMG = (file, caption) => ({ src: '../assets/manuscripts/' + file, caption });

export const NODES = [
  {
    id: 'madrasa', name: 'The Madrasa', icon: '📖',
    hook: 'Formal training in law and disputation — the credential every career needs.',
    encounters: ['madrasa_training', 'madrasa_disputation'],
  },
  {
    id: 'circle', name: 'Akhlāṭī’s Circle', icon: '✳',
    hook: 'The master’s informal circle: letters, furnaces, sand-figures — and a name being whispered.',
    encounters: ['circle_entry', 'circle_discipleship', 'circle_lineages', 'circle_naming'],
  },
  {
    id: 'khanqah', name: 'The Khānqāh', icon: '🕯',
    hook: 'The Sufi lodge where Qāsim-i Anvār recites — poetry, devotion, dangerous friendships.',
    encounters: ['khanqah_qasim', 'khanqah_sama'],
  },
  {
    id: 'bazaar', name: 'The Booksellers’ Bazaar', icon: '📜',
    hook: 'Manuscripts from three continents change hands here. Some should not exist.',
    encounters: ['bazaar_manuscript'],
  },
  {
    id: 'muwaqqit', name: 'The Timekeeper’s Post', icon: '🌙',
    hook: 'The mosque’s muwaqqit computes prayer times from the stars. Mathematics with a licence.',
    encounters: ['muwaqqit_lesson', 'muwaqqit_yazdi'],
  },
  {
    id: 'majlis', name: 'The Merchant’s Majlis', icon: '🍷',
    hook: 'A salon of wit, wonder, and wine. What happens at the feast never stays there.',
    encounters: ['majlis_dervish', 'majlis_feast'],
  },
  {
    id: 'road', name: 'The Road Home', icon: '🐪', departure: true,
    hook: 'End the Cairo years. Choose what — and whom — you carry back to Isfahan.',
    encounters: ['road_home'],
  },
];

export const ENCOUNTERS = {
  // ---- THE MADRASA ----------------------------------------------------------
  madrasa_training: {
    id: 'madrasa_training',
    phase: 1,
    rubric: 'AT THE MADRASA · MORNING LESSONS',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation (Cairo); VN c01',
    affordances: ['teachers', 'law_books'],
    situation:
      'The law professors teach what Cairo certifies: jurisprudence, disputation, the instruments of a judge’s career. ' +
      'It is slow, orthodox, and respected — and it is the credential your family’s judicial line expects of you.',
    options: [
      {
        id: 'commit', label: 'Commit to rigorous scholastic training',
        detail: 'The long path: law, logic, credentials no inquisitor can question.',
        requires: [],
        effects: { rep: { scholarly: 1, orthodox: 1 }, meters: { synthesis: 1 }, memory: { madrasa_trained: true } },
        outcomes: [
          { band: 'success', weight: 3, text: 'The professors mark you as serious. The credential begins to exist.',
            chronicle: 'In Cairo he sat before the jurists and learned the law’s long patience.' },
          { band: 'qualified', weight: 1, text: 'You learn the law — and how much of what interests you the law will not touch.',
            effects: { rep: { occult: 1 } },
            chronicle: 'He learned the jurists’ craft, and kept his other questions quiet.' },
        ],
      },
      {
        id: 'minimum', label: 'Attend only enough to pass unremarked',
        detail: 'Keep the seat warm; spend your real hours elsewhere in the city.',
        requires: [],
        effects: { rep: { scholarly: 0 } },
        outcomes: [
          { band: 'qualified', weight: 2, text: 'You are enrolled, technically. The city’s other classrooms are open.',
            chronicle: 'He wore the madrasa lightly, a student on paper and a seeker in fact.' },
          { band: 'backfire', weight: 1, text: 'A professor notices the empty seat and remembers your name for the wrong reason.',
            effects: { rep: { orthodox: -1 } },
            chronicle: 'The jurists noted his absences, and noted them aloud.' },
        ],
      },
    ],
  },

  madrasa_disputation: {
    id: 'madrasa_disputation',
    phase: 1,
    rubric: 'AT THE MADRASA · A PUBLIC DISPUTATION',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'BIOGRAPHY — Formation; disputation was the standard exam form',
    when: ['mem:madrasa_trained'],
    affordances: ['public_audience', 'law_books'],
    situation:
      'A visiting jurist stakes a position on the limits of permissible sciences, and the hall turns to the students. ' +
      'A strong answer is a reputation. A clever one is a risk. Silence is also an answer.',
    options: [
      {
        id: 'orthodox_answer', label: 'Argue squarely within the law',
        detail: 'Win as a jurist. Say nothing the hall can quote against you later.',
        requires: [],
        boosts: ['rep:scholarly>=1'],
        effects: {},
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Your argument is clean and the visitor concedes the point. The hall remembers you.',
            effects: { rep: { scholarly: 2, orthodox: 1 } },
            chronicle: 'In open disputation he bested a visiting jurist with the jurists’ own tools.' },
          { band: 'success', weight: 2, text: 'A solid showing. The professors nod; nothing is risked.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'He held his own in disputation and gave the hall nothing to whisper about.' },
        ],
      },
      {
        id: 'number_argument', label: 'Defend the mathematical sciences by demonstration',
        detail: 'Show the hall that number underlies the very logic they argue with.',
        requires: ['meter:synthesis>=2'],
        effects: { meters: { exposure: 1 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'For a moment the hall sees it — law, logic, number as one architecture. It is talked about for weeks.',
            effects: { rep: { scholarly: 1, occult: 1 }, meters: { demonstration: 1 } },
            chronicle: 'Before the assembled jurists he argued that number itself sits beneath the law.' },
          { band: 'ambiguous', weight: 2, text: 'Half the hall is fascinated; the other half exchanges looks. Both halves remember.',
            effects: { rep: { occult: 1, orthodox: -1 } },
            chronicle: 'His defence of the mathematical sciences divided the hall in two.' },
        ],
      },
      {
        id: 'silence', label: 'Hold your tongue',
        detail: 'A student’s silence costs nothing today. Perhaps something later.',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The moment passes. Another student takes the laurels — and the scrutiny.',
            chronicle: 'At the great disputation he chose silence, and watched who did not.' },
        ],
      },
    ],
  },

  // ---- AKHLĀṬĪ’S CIRCLE -----------------------------------------------------
  circle_entry: {
    id: 'circle_entry',
    phase: 1,
    rubric: 'A COURTYARD OFF THE COPPERSMITHS’ STREET · AFTER DARK',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation (Cairo): studied under Akhlāṭī',
    affordances: ['private_audience'],
    plate: IMG('c28-bm-instrument-full-1241.jpg', 'Geomantic instrument, Egypt or Syria, 1241/42 CE — British Museum (via Wikimedia Commons)'),
    situation:
      'Sayyid Ḥusayn Akhlāṭī receives students the madrasa would never admit to envying. On his table: letter-tables, ' +
      'a geomancer’s brass instrument, a crucible still warm. He asks one question — what do you want to learn first?',
    options: [
      {
        id: 'letters', label: 'The science of letters',
        detail: 'Līmiyā: talismans, letter-grids, the mathematics hiding inside the alphabet.',
        requires: [],
        effects: { quintet: { limiya: 1 }, rep: { occult: 1 }, meters: { synthesis: 1 }, access: ['informal_circle'], people: ['akhlati'], memory: { circle_member: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'He sets a letter-grid before you and begins with the value of the alif. The door is open.',
            chronicle: 'He came to Akhlāṭī’s courtyard and began with the letters, as the tradition begins.' },
        ],
      },
      {
        id: 'furnace', label: 'The work of the furnace',
        detail: 'Kīmiyā: substances, operations, the elite and expensive art.',
        requires: [],
        effects: { quintet: { kimiya: 1 }, rep: { occult: 1 }, access: ['informal_circle'], people: ['akhlati'], memory: { circle_member: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'He hands you the bellows first, and theory second. The door is open.',
            chronicle: 'He came to Akhlāṭī’s courtyard and learned the furnace before the theory of it.' },
        ],
      },
      {
        id: 'sand', label: 'The figures in the sand',
        detail: 'Geomancy — Akhlāṭī’s own third art, quick to learn, easy to sneer at, oddly reliable.',
        requires: [],
        effects: { caps: ['geomancy'], quintet: { rimiya: 1 }, rep: { occult: 1 }, access: ['informal_circle'], people: ['akhlati'], memory: { circle_member: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'Sixteen figures, four mothers, a lifetime of pattern. He smiles: everyone underestimates the sand.',
            chronicle: 'He came to Akhlāṭī’s courtyard and cast his first figures in the sand.' },
        ],
      },
    ],
  },

  circle_discipleship: {
    id: 'circle_discipleship',
    phase: 1,
    rubric: 'AKHLĀṬĪ’S COURTYARD · THE MASTER’S REQUEST',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — Formation; the publicness of the tie is undocumented (VN c02)',
    when: ['mem:circle_member'],
    affordances: ['private_audience', 'reputational_stakes'],
    situation:
      'Akhlāṭī’s name travels — admired in three languages, denounced in two. Tonight he asks, mildly, whether you ' +
      'will let it be known whose student you are. The question is a door with two hinges: honor, and exposure.',
    options: [
      {
        id: 'public', label: 'Declare the discipleship openly',
        detail: 'Wear his name. His enemies become yours; so do his friends.',
        requires: [],
        effects: { rep: { occult: 2, orthodox: -1 }, meters: { exposure: 1 }, memory: { akhlati_public: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Word moves through the quarter in a week. Doors open that you did not know existed — and one or two close.',
            chronicle: 'He let Cairo know whose student he was, and accepted everything the name carried.' },
          { band: 'backfire', weight: 1, text: 'A preacher names your master from the minbar within the month — and now, obliquely, you.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He claimed Akhlāṭī openly, and heard the claim repeated from a pulpit.' },
        ],
      },
      {
        id: 'quiet', label: 'Study on, but privately',
        detail: 'Keep the learning; skip the label. He will understand. Probably.',
        requires: [],
        effects: { rep: { occult: 1 }, memory: { akhlati_quiet: true } },
        outcomes: [
          { band: 'qualified', weight: 2, text: 'He nods slowly and teaches on. Something in the lessons is now held slightly back.',
            chronicle: 'He kept his master’s name out of his own mouth, and lost a little of the master’s.' },
          { band: 'success', weight: 1, text: 'Discretion, he says at last, is also a science. The lessons continue undiminished.',
            chronicle: 'He studied under Akhlāṭī in prudent silence, and the silence held.' },
        ],
      },
    ],
  },

  circle_lineages: {
    id: 'circle_lineages',
    phase: 1,
    rubric: 'AKHLĀṬĪ’S COURTYARD · AN ARGUMENT OF FATHERS',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation: first to pair Ibn ʿArabī and Ḥamūya as co-founders (VN c05)',
    when: ['mem:circle_member'],
    affordances: ['private_audience', 'manuscripts'],
    plate: IMG('act4-printed-magic-squares-p201.jpg', 'Magic squares (awfāq) and letter-grid tables — Shams al-Maʿārif, printed edition (Wikimedia Commons)'),
    situation:
      'The circle quarrels amiably over descent: is the science of letters Ibn ʿArabī’s, the Andalusian Supreme Master’s — ' +
      'or Saʿd al-Dīn Ḥamūya’s, his Iranian twin? Partisans of each want you. Akhlāṭī watches to see how you think.',
    options: [
      {
        id: 'ibn_arabi', label: 'Stand with Ibn ʿArabī’s line',
        detail: 'The prestigious answer — the West’s Supreme Master, safest to cite.',
        requires: [],
        effects: { meters: { synthesis: 1 }, rep: { scholarly: 1 }, memory: { lineages_declared: 'ibn_arabi' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'A defensible flag. The Ḥamūya men shrug and let it pass.',
            chronicle: 'Pressed on the lineage of letters, he named Ibn ʿArabī and stood with the many.' },
        ],
      },
      {
        id: 'hamuya', label: 'Stand with Ḥamūya’s line',
        detail: 'The Iranian answer — obscurer, stranger, closer to home.',
        requires: [],
        effects: { meters: { synthesis: 1 }, rep: { occult: 1 }, memory: { lineages_declared: 'hamuya' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'Eyebrows rise. The obscure choice marks you as a reader, not a follower.',
            chronicle: 'He named Ḥamūya, the Iranian twin, and the circle marked him as one who reads for himself.' },
        ],
      },
      {
        id: 'both', label: 'Insist the two are co-founders',
        detail: 'The synthesis no one else will make. Pleases neither faction — yet.',
        requires: [],
        boosts: ['meter:synthesis>=2'],
        effects: { meters: { synthesis: 2 }, memory: { lineages_declared: 'both' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You argue the two lines as one river. Akhlāṭī says nothing — and pours your tea himself.',
            effects: { rep: { occult: 1, scholarly: 1 } },
            chronicle: 'He joined Ibn ʿArabī and Ḥamūya as co-founders of one science — a pairing no one had dared put in writing.' },
          { band: 'ambiguous', weight: 1, text: 'Both factions object. Both keep arguing with you, which is its own kind of respect.',
            chronicle: 'He claimed both fathers for the science, and both camps disowned him politely.' },
        ],
      },
    ],
  },

  circle_naming: {
    id: 'circle_naming',
    phase: 1,
    rubric: 'AKHLĀṬĪ’S COURTYARD · THE CIRCLE TAKES A NAME',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation: the circle’s self-naming as Ikhwān al-Ṣafāʾ',
    when: ['mem:circle_member', 'mem:lineages_declared'],
    affordances: ['private_audience'],
    situation:
      'Late, lamps low, someone says it aloud: this circle should call itself Ikhwān al-Ṣafāʾ — the Brethren of Purity, ' +
      'the name of the old encyclopedists of Basra. To take a four-hundred-year-old banner is not a joke. Everyone looks at everyone.',
    options: [
      {
        id: 'embrace', label: 'Take the name, and say why',
        detail: 'Argue the old Brethren’s project unfinished — and this circle its heirs.',
        requires: [],
        boosts: ['person:yazdi', 'mem:lineages_declared=both'],
        effects: { meters: { transmission: 1, exposure: 1 }, memory: { new_brethren: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Your argument gives the name a spine: not nostalgia — a program. The circle adopts it that night.',
            effects: { meters: { synthesis: 1 }, rep: { occult: 1 } },
            chronicle: 'That night the circle took the name of the Brethren of Purity, and he was among those who argued for it.' },
          { band: 'success', weight: 2, text: 'The name is taken half in earnest, half in delight. Names taken in delight have a way of becoming earnest.',
            chronicle: 'The circle called itself the New Brethren of Purity, half a jest that everyone knew was not one.' },
        ],
      },
      {
        id: 'caution', label: 'Warn against a name that can be indicted',
        detail: 'A named circle is a thing a court can point at. Stay a rumor.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { new_brethren_wary: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'They take the name anyway — but your caution is remembered by the careful ones.',
            effects: { memory: { new_brethren: true } },
            chronicle: 'When the circle took its dangerous name, he was the one who counted the cost aloud.' },
        ],
      },
    ],
  },

  // ---- THE KHĀNQĀH ----------------------------------------------------------
  khanqah_qasim: {
    id: 'khanqah_qasim',
    phase: 1,
    rubric: 'AT THE KHĀNQĀH · A POET IN FULL FLIGHT',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation: Qāsim-i Anvār a close Cairo companion (VN c04)',
    affordances: ['sufi_gathering'],
    situation:
      'Qāsim-i Anvār recites and the whole khānqāh forgets to breathe. Afterward he finds you, laughing, quoting your own ' +
      'question back at you improved. Men like this either become your brother or your epitaph. Sometimes both.',
    options: [
      {
        id: 'deep', label: 'Let the friendship go deep',
        detail: 'Brotherhood with the most magnetic — and least careful — man in Cairo.',
        requires: [],
        effects: { people: ['qasim'], rep: { occult: 1 }, memory: { qasim_bond: 'deep' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'By month’s end you share manuscripts, jokes, and enemies. Mostly jokes, so far.',
            chronicle: 'In Cairo he bound himself in friendship to Qāsim-i Anvār, and counted the risk well spent.' },
          { band: 'qualified', weight: 1, text: 'The friendship takes — and with it, the first raised eyebrow from the sober men of the lodge.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He walked openly with Qāsim-i Anvār, and the careful men began to keep a small ledger of it.' },
        ],
      },
      {
        id: 'distant', label: 'Keep a warm distance',
        detail: 'Enjoy the verses; skip the entanglement. Poets attract weather.',
        requires: [],
        effects: { memory: { qasim_bond: 'distant' } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'He notices, of course. Poets always notice. The verses stay brilliant; the door stays ajar.',
            chronicle: 'He admired Qāsim-i Anvār from one careful step away.' },
        ],
      },
    ],
  },

  khanqah_sama: {
    id: 'khanqah_sama',
    phase: 1,
    rubric: 'AT THE KHĀNQĀH · SAMĀʿ, AND WHAT FOLLOWS IT',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'BIOGRAPHY — Formation; samāʿ practice standard in the lodges',
    when: ['person:qasim'],
    affordances: ['sufi_gathering', 'music'],
    plate: IMG('c14-sufi-fixed-stars.jpg', 'Ursa Major, from al-Ṣūfī’s Book of Fixed Stars (Wikimedia Commons)'),
    situation:
      'After the samāʿ Qāsim keeps a smaller company back and turns the talk from ecstasy to letters: could a verse ' +
      'be built on number the way a talisman is? He is asking you, specifically, in front of men who will repeat your answer.',
    options: [
      {
        id: 'teach', label: 'Sketch the letter-number art for them',
        detail: 'Give the poets a real taste of līmiyā. Verses travel; so will this.',
        requires: ['limiya>=1'],
        effects: { meters: { transmission: 1 }, rep: { occult: 1 } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Within weeks a ghazal built on your grid is sung in two lodges. Your science has learned to rhyme.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He showed the poets how number sits inside the letters, and the poets set it singing through the lodges.' },
          { band: 'backfire', weight: 1, text: 'The verse travels — garbled. Somewhere a preacher now owns a mangled copy of your idea.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'A garbled version of his letter-teaching escaped into the city’s mouths.' },
        ],
      },
      {
        id: 'deflect', label: 'Turn the question into a jest',
        detail: 'Charm the room, reveal nothing. Qāsim will see through it, fondly.',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'qualified', weight: 1, text: 'Laughter, and the moment passes. Qāsim murmurs: one day you will have to answer somebody.',
            chronicle: 'Asked to unveil his science before the poets, he answered with a joke and kept the veil.' },
        ],
      },
    ],
  },

  // ---- THE BOOKSELLERS’ BAZAAR ---------------------------------------------
  bazaar_manuscript: {
    id: 'bazaar_manuscript',
    phase: 1,
    rubric: 'THE BOOKSELLERS’ BAZAAR · AN UNATTRIBUTED TREATISE',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Design conversation, “The New Manuscript” pattern; bazaar trade attested',
    affordances: ['manuscripts', 'merchants'],
    plate: IMG('c20-letter-word-wafq-table-c030.jpg', 'Letter-word wafq table, Quranic name operations grid — Princeton University Library'),
    situation:
      'A dealer who knows your haunts unrolls something unsigned: tables pairing letters to numbers to stations of the moon, ' +
      'in a hand nobody recognizes. He wants a week’s wages for it. Three other men in Cairo would want it more.',
    options: [
      {
        id: 'read_numbers', label: 'Test its number-structure before buying',
        detail: 'Check the grids against what Akhlāṭī taught you. Fraud has a signature.',
        requires: ['limiya>=1'],
        effects: {},
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The tables are sound — sounder than they should be. You pay quickly and carry it home under your coat.',
            effects: { artifacts: ['letter_grid_ms'], meters: { synthesis: 1 } },
            chronicle: 'In the booksellers’ bazaar he recognized what an unsigned treatise truly was, and did not haggle.' },
          { band: 'qualified', weight: 1, text: 'Half genuine, half padding — but the genuine half is worth the price alone.',
            effects: { artifacts: ['letter_grid_ms'] },
            chronicle: 'He bought a flawed treatise for its one true chapter.' },
        ],
      },
      {
        id: 'consult_master', label: 'Bring Akhlāṭī to see it quietly',
        detail: 'The master’s eye is surer than yours — and the dealer will notice whose.',
        requires: ['mem:circle_member'],
        effects: { meters: { exposure: 1 } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Akhlāṭī reads three lines and buys it himself — then hands it to you. “Yours to finish understanding.”',
            effects: { artifacts: ['letter_grid_ms'], meters: { synthesis: 1 } },
            chronicle: 'Akhlāṭī judged the bazaar treatise genuine, and gave it into his student’s keeping.' },
          { band: 'backfire', weight: 1, text: 'The dealer, seeing the master’s interest, triples the price and sells the story of it besides.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'The whole bazaar soon knew what book Akhlāṭī’s circle had wanted.' },
        ],
      },
      {
        id: 'pass', label: 'Let it go',
        detail: 'A week’s wages is a week’s wages. Some doors are better unopened.',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'It sells within the day — to whom, the dealer will not say. You will wonder about this for years.',
            chronicle: 'He let the unsigned treatise pass to an unknown buyer, and remembered it long after.' },
        ],
      },
    ],
  },

  // ---- THE TIMEKEEPER’S POST ------------------------------------------------
  muwaqqit_lesson: {
    id: 'muwaqqit_lesson',
    phase: 1,
    rubric: 'THE TIMEKEEPER’S POST · INSTRUMENTS AND HOURS',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — Formation; the muwaqqit’s office was Cairo’s licensed astronomy',
    affordances: ['instruments', 'astronomical_data'],
    plate: IMG('act2-persian-astrolabe.jpg', 'Persian astrolabe, brass (Wikimedia Commons)'),
    situation:
      'The mosque’s muwaqqit — the timekeeper — computes the prayer hours with astrolabe and tables, the one occult-adjacent ' +
      'mathematics no jurist can object to. He needs an assistant with steady hands and will teach what the position teaches.',
    options: [
      {
        id: 'apprentice', label: 'Assist him through a season',
        detail: 'Learn the astrolabe and the tables — licensed mathematics, unimpeachable.',
        requires: [],
        boosts: ['mem:madrasa_trained'],
        effects: { access: ['astronomy'], meters: { synthesis: 1 }, rep: { orthodox: 1 }, memory: { studied_timekeeping: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Your madrasa logic and his instruments fit like gear-teeth. By season’s end he lets you compute the month alone.',
            effects: { meters: { synthesis: 1 }, rep: { scholarly: 1 } },
            chronicle: 'He served a season under the timekeeper and left computing the heavens unassisted.' },
          { band: 'success', weight: 2, text: 'The astrolabe yields its logic slowly, then all at once. Time, it turns out, is also number.',
            chronicle: 'Under the muwaqqit he learned that the hours themselves are a mathematics.' },
        ],
      },
      {
        id: 'observe', label: 'Watch a single night’s working',
        detail: 'One evening’s glimpse of the craft — cheap, shallow, enough to know what’s there.',
        requires: [],
        effects: { memory: { studied_timekeeping: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'One night at the dials. You leave knowing exactly how much you do not know.',
            chronicle: 'He watched the timekeeper work one night, and marked the science for later.' },
        ],
      },
    ],
  },

  muwaqqit_yazdi: {
    id: 'muwaqqit_yazdi',
    phase: 1,
    rubric: 'THE TIMEKEEPER’S POST · ANOTHER PERSIAN AT THE DIALS',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation: the Yazdī friendship (VN c03); meeting-place is PLAUSIBLE-GAP',
    when: ['mem:studied_timekeeping'],
    affordances: ['instruments', 'astronomical_data'],
    situation:
      'Another Persian keeps turning up at the tables: Sharaf al-Dīn ʿAlī of Yazd, who checks the muwaqqit’s arithmetic ' +
      'for pleasure and talks about history the way you talk about letters. He has noticed you noticing him.',
    options: [
      {
        id: 'equal', label: 'Meet him as an equal — trade everything',
        detail: 'Two minds, no hierarchy. Your letters for his mathematics, openly.',
        requires: [],
        effects: { people: ['yazdi'], meters: { synthesis: 1 }, memory: { yazdi_bond: 'equal' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Within a month you are finishing each other’s calculations. “My brother in God,” you will one day write. It starts here.',
            effects: { meters: { synthesis: 1 } },
            chronicle: 'At the timekeeper’s post he met ʿAlī of Yazd, and the two began trading sciences as brothers.' },
          { band: 'success', weight: 1, text: 'The trade begins cautiously — his tables for your grids — and holds.',
            chronicle: 'He and Yazdī began the long exchange of number for letter.' },
        ],
      },
      {
        id: 'mentor', label: 'Take the senior part — teach, don’t trade',
        detail: 'Guide the younger man. Generous — and it sets the friendship’s shape early.',
        requires: [],
        effects: { people: ['yazdi'], meters: { transmission: 1 }, memory: { yazdi_bond: 'mentor' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'He learns fast — faster than a student should. You suspect the roles will not hold, and you are right.',
            chronicle: 'He took Yazdī as a student, though anyone watching could see what the friendship would become.' },
          { band: 'qualified', weight: 1, text: 'He accepts the teaching politely and keeps his own counsel. Something is withheld on both sides.',
            chronicle: 'He taught Yazdī from the senior seat, and the seat sat awkwardly.' },
        ],
      },
    ],
  },

  // ---- THE MERCHANT’S MAJLIS ------------------------------------------------
  majlis_dervish: {
    id: 'majlis_dervish',
    phase: 1,
    rubric: 'THE MERCHANT’S MAJLIS · A WANDERER’S IMPOSSIBLE CLAIM',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Design conversation, Node 11 — credulity vs. demonstration; later manuals attest the type',
    affordances: ['public_audience', 'wine'],
    plate: IMG('c36-falnama-omen.jpg', 'The Seven Sleepers of Ephesus, folio from a Falnāma — Book of Omens (Wikimedia Commons)'),
    situation:
      'A traveling dervish holds the majlis rapt: he claims he can be in Cairo and Damascus in the same night, and has ' +
      'witnesses. The merchant, your host, turns to you — the studious one — and asks, smiling, whether it can be true.',
    options: [
      {
        id: 'investigate', label: 'Examine the claim like an apparatus',
        detail: 'It takes a trickster’s eye to catch one. Ask what, exactly, the witnesses saw.',
        requires: ['rimiya>=1'],
        effects: {},
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Three questions in, the miracle resolves into a twin brother and a fast horse. The salon roars; the dervish bows, beaten fairly.',
            effects: { meters: { demonstration: 1 }, rep: { scholarly: 1 }, memory: { dervish_exposed: true } },
            chronicle: 'When a dervish claimed to cross to Damascus in a night, he unpicked the miracle in three questions.' },
          { band: 'success', weight: 1, text: 'You show how it could be done without wonder. Doubt lands where it belongs; the dervish moves on.',
            effects: { memory: { dervish_exposed: true } },
            chronicle: 'He weighed the dervish’s wonder and found a plainer explanation waiting inside it.' },
        ],
      },
      {
        id: 'philosophize', label: 'Reframe it philosophically',
        detail: 'Neither endorse nor expose: ask what “being in a place” means. Scholars love it.',
        requires: ['meter:synthesis>=1'],
        effects: {},
        outcomes: [
          { band: 'ambiguous', weight: 2, text: 'You give the salon an hour of metaphysics. Everyone leaves impressed; no one leaves sure of anything, including you.',
            effects: { rep: { scholarly: 1 }, memory: { dervish_open: true } },
            chronicle: 'Asked to judge a wonder, he answered with a question about place itself, and the salon went home dizzy.' },
        ],
      },
      {
        id: 'believe', label: 'Let the wonder stand',
        detail: 'Say nothing against it. The room wants marvels; the dervish needs dinner.',
        requires: [],
        effects: { memory: { dervish_believed: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The story swells with your silence inside it. Later you hear your name cited among those who “did not deny it.”',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He let a doubtful wonder pass unchallenged, and was counted among its witnesses.' },
        ],
      },
    ],
  },

  majlis_feast: {
    id: 'majlis_feast',
    phase: 1,
    rubric: 'THE MERCHANT’S MAJLIS · THE HOST WANTS A WONDER',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Bazm culture per The Occult Court; the request type attested in later manuals',
    affordances: ['public_audience', 'wine', 'lamps_and_mirrors'],
    plate: IMG('c19-qazwini-angel.jpg', 'Winged angels, al-Qazwīnī’s Wonders of Creation (Wikimedia Commons)'),
    situation:
      'The wine has gone round twice and the merchant claps for entertainment — and looks at you. “Our scholar! Show us ' +
      'something the preachers wouldn’t like.” The room laughs. Whatever happens in the next ten minutes will be retold.',
    options: [
      {
        id: 'wonder', label: 'Perform a real wonder, properly',
        detail: 'Rīmiyā, done with craft: astonish them, and control exactly what they saw.',
        requires: ['rimiya>=1'],
        boosts: ['mem:dervish_exposed'],
        effects: { meters: { exposure: 1 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The ink vanishes from the page as they watch. Dead silence — then the whole room at once. It works too well.',
            effects: { quintet: { rimiya: 1 }, meters: { demonstration: 2 }, rep: { occult: 1 }, memory: { feast_performed: true } },
            chronicle: 'At a merchant’s feast he made ink vanish from a written page, and Cairo began to tell the story for him.' },
          { band: 'success', weight: 2, text: 'A clean small marvel, warmly received. Two guests ask, quietly, for lessons.',
            effects: { quintet: { rimiya: 1 }, meters: { demonstration: 1 }, memory: { feast_performed: true } },
            chronicle: 'He gave the feast a modest wonder, and gained two would-be students by it.' },
          { band: 'backfire', weight: 1, text: 'The trick works — and one guest, unsmiling, asks exactly where a judge’s son learned it.',
            effects: { meters: { exposure: 1 }, memory: { feast_performed: true } },
            chronicle: 'His feast-night wonder succeeded, and one cold pair of eyes took careful note of it.' },
        ],
      },
      {
        id: 'verses', label: 'Give them Qāsim’s verses instead',
        detail: 'Borrow your friend’s thunder — a performance no preacher can indict.',
        requires: ['cap:poetry'],
        effects: {},
        outcomes: [
          { band: 'success', weight: 2, text: 'You recite, crediting Qāsim by name. The room melts; the poet, told of it later, is delighted.',
            effects: { rep: { occult: 1, orthodox: 1 } },
            chronicle: 'Asked for a wonder, he gave them Qāsim-i Anvār’s verses instead, and lost nothing by the trade.' },
          { band: 'qualified', weight: 1, text: 'Beautiful — though a wag observes that the scholar performed someone else’s marvel.',
            chronicle: 'He met the feast’s demand with borrowed poetry, gracefully.' },
        ],
      },
      {
        id: 'untrained', label: 'Attempt sleight-of-hand untrained',
        detail: 'You have watched it done. How hard can a vanishing coin be?',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'success', weight: 1, text: 'Beginner’s grace: the coin goes and returns. You even learn something about misdirection doing it.',
            effects: { quintet: { simiya: 1 }, meters: { demonstration: 1 }, memory: { feast_performed: true } },
            chronicle: 'Untrained, he chanced a sleight at the feast and carried it off — and privately resolved to learn it properly.' },
          { band: 'backfire', weight: 2, text: 'The coin drops. Twice. The room’s laughter is friendly, which is somehow worse.',
            effects: { rep: { scholarly: -1 } },
            chronicle: 'His feast-night sleight failed twice before a laughing room.' },
          { band: 'disaster', weight: 1, text: 'The coin ends in the wine-jug of the one guest with no sense of humor, who now describes you around town as “the conjuring student.”',
            effects: { rep: { scholarly: -1, orthodox: -1 }, meters: { exposure: 1 } },
            chronicle: 'A botched trick at a feast fixed on him, for a season, the name of conjuror.' },
        ],
      },
      {
        id: 'decline', label: 'Decline, with a jurist’s smile',
        detail: 'Disappoint the room; reassure the careful. Nothing retold, nothing risked.',
        requires: [],
        effects: { rep: { orthodox: 1, occult: -1 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The merchant pouts and finds a lute-player. You are, everyone agrees, no fun — and quite safe.',
            chronicle: 'Pressed for marvels at the feast, he declined with a jurist’s exact courtesy.' },
        ],
      },
    ],
  },

  // ---- THE ROAD HOME --------------------------------------------------------
  road_home: {
    id: 'road_home',
    phase: 1,
    rubric: 'THE ROAD HOME · CAIRO ENDS',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Formation: Akhlāṭī dies 1397; the return to Iran follows',
    affordances: [],
    plate: IMG('act8-printed-teardrop-cosmogram-p256.jpg', 'Teardrop cosmological diagram — Shams al-Maʿārif, p. 256 (Wikimedia Commons)'),
    situation:
      'Word runs through the quarter like cold water: Sayyid Ḥusayn Akhlāṭī is dead. The circle stands in his courtyard ' +
      'not knowing where to put its hands. Cairo is finished for you — the question is only what you carry to Isfahan, and how.',
    options: [
      {
        id: 'heir_public', label: 'Leave as his acknowledged student',
        detail: 'Claim the inheritance aloud. The name will reach Isfahan before you do.',
        requires: ['mem:akhlati_public'],
        effects: { rep: { occult: 1 }, meters: { exposure: 1, transmission: 1 } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You speak at the gathering as one of his own. Men you have never met will now write to you for years.',
            chronicle: 'When Akhlāṭī died, he stood forth as the master’s student, and let the inheritance be seen.' },
        ],
      },
      {
        id: 'letters_east', label: 'Carry the Brethren’s letters east',
        detail: 'Leave as the network’s courier: introductions from Cairo to all Iran.',
        requires: ['mem:new_brethren'],
        boosts: ['person:yazdi'],
        effects: { meters: { transmission: 1 }, rep: { occult: 1 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Sealed letters to scholars in Tabriz, Yazd, Herat. The circle does not end at Cairo’s gates — it is only now beginning to travel.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He left Cairo carrying the New Brethren’s letters east, and the network went with him.' },
          { band: 'success', weight: 1, text: 'A handful of introductions, warmly written. Enough to begin.',
            chronicle: 'He carried the circle’s letters east toward Isfahan.' },
        ],
      },
      {
        id: 'quiet_return', label: 'Return as a jurist, nothing more',
        detail: 'Fold the Cairo years away. Arrive in Isfahan clean, credentialed, unremarked.',
        requires: [],
        boosts: ['rep:orthodox>=1'],
        effects: { rep: { orthodox: 1 } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You travel as a judge’s son returning with a judge’s learning. What else you carry, you carry inside.',
            chronicle: 'He returned to Isfahan as a jurist returns: quietly, with his true baggage invisible.' },
          { band: 'ambiguous', weight: 1, text: 'Clean arrival — but a letter from Cairo, unsigned, reaches Isfahan anyway. Someone talked. They always do.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He came home quietly, though Cairo’s rumors traveled faster than his caravan.' },
        ],
      },
      {
        id: 'equals_road', label: 'Travel in company with Yazdī',
        detail: 'Share the road with your brother in God. The system’s first two carriers, together.',
        requires: ['mem:yazdi_bond=equal'],
        effects: { meters: { synthesis: 1, transmission: 1 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'A month of desert stages spent building the thing between you: letters and numbers braided into one science, argued from Cairo to the Iranian plateau.',
            chronicle: 'He and Yazdī took the eastern road together, and the long collaboration was sealed between way-stations.' },
        ],
      },
    ],
  },
};
