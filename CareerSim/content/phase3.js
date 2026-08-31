// phase3.js — Phase III: The Courts (c. 1409–1419).
// The patronage phase: choose a court, take commissions with deadlines, and learn
// that every success raises what will be demanded next. Bazm and razm both appear.

export const PHASE = {
  id: 3,
  name: 'THE COURTS',
  dateline: 'c. 1409–1419',
  time: 9,
  intro:
    'Timurid court culture runs on two poles — bazm and razm, the feast and the war — and occult science is welcome ' +
    'at both. A prince’s patronage is money, protection, an atelier, and an audience. It is also a set of expectations ' +
    'that only grow. Nine seasons at court, and the shape of your career is decided here.',
};

const IMG = (file, caption) => ({ src: '../assets/manuscripts/' + file, caption });

export const NODES = [
  {
    id: 'audience', name: 'The Audience Hall', icon: '👑',
    hook: 'Where patrons are won, commissions are given, and questions have consequences.',
    encounters: ['court_patron_choice', 'court_commission', 'court_prince_question', 'court_dynasty'],
  },
  {
    id: 'atelier', name: 'The Kitābkhāna', icon: '🖌',
    hook: 'The book-workshop: calligraphers, painters, illuminators, and your diagrams.',
    encounters: ['court_calligrapher', 'court_atelier_commission'],
  },
  {
    id: 'observatory', name: 'The Star-Table Room', icon: '🔭',
    hook: 'Astronomers, instruments, and mathematics with imperial funding.',
    encounters: ['court_astronomer', 'court_rival_astrologer'],
  },
  {
    id: 'bazm', name: 'The Feast (Bazm)', icon: '🍷',
    hook: 'Wine, poetry, wonders, and politics conducted entirely in jokes.',
    encounters: ['court_bazm_wonder', 'court_bazm_confession'],
  },
  {
    id: 'razm', name: 'The Campaign (Razm)', icon: '⚔',
    hook: 'The other half of Timurid life: armies, auspicious dates, and useful sciences.',
    encounters: ['court_razm_date', 'court_razm_device'],
  },
  {
    id: 'depart3', name: 'Toward 1420', icon: '📖', departure: true,
    hook: 'The court years end. Leave for the desk where the summa gets written.',
    encounters: ['court_departure'],
  },
];

export const ENCOUNTERS = {
  court_patron_choice: {
    id: 'court_patron_choice', phase: 3,
    rubric: 'THE AUDIENCE HALL · WHOSE MAN WILL YOU BE',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Iskandar Sultan (c.1409–1415), then Bāysunghur (from c.1416)',
    affordances: ['royal_patronage', 'private_audience'],
    situation:
      'Two houses want you, and a third possibility exists. Iskandar Sultan’s court at Shiraz fuses star science, ' +
      'poetry and painting — brilliant and politically exposed. Bāysunghur, Shāh Rukh’s son, offers the finest ' +
      'book-workshop in the world and a father who is currently winning. Samarkand offers mathematics and Ulugh Beg.',
    options: [
      {
        id: 'iskandar', label: 'Take service with Iskandar Sultan',
        detail: 'The experimental court: everything permitted, nothing guaranteed.',
        requires: [],
        effects: {
          people: ['iskandar'], access: ['atelier', 'astronomy'], rep: { imperial: 2, occult: 1 },
          memory: { patron: 'iskandar' },
        },
        outcomes: [
          { band: 'success', weight: 1, text: 'Iskandar receives you like a discovery. His workshop already contains an astrologer, two poets and a painter arguing about the same diagram.',
            chronicle: 'He entered the service of Iskandar Sultan, in whose workshop star science and painting shared a table.' },
        ],
      },
      {
        id: 'baysunghur', label: 'Take service with Bāysunghur',
        detail: 'The manuscript machine, and the safer branch of the dynasty.',
        requires: [],
        effects: {
          people: ['baysunghur'], access: ['atelier'], rep: { imperial: 2, orthodox: 1 },
          memory: { patron: 'baysunghur' },
        },
        outcomes: [
          { band: 'success', weight: 1, text: 'Bāysunghur, who is himself a calligrapher of the first rank, asks what your diagrams would look like properly made. Nobody has ever asked you that.',
            chronicle: 'He took service with Bāysunghur, a prince who cared how a page was made.' },
        ],
      },
      {
        id: 'samarkand', label: 'Go to Samarkand with Yazdī',
        detail: 'Mathematics, instruments, and the observatory rising. Requires your brother in God.',
        requires: ['person:yazdi'],
        effects: {
          access: ['observatory', 'astronomy'], rep: { scholarly: 2, imperial: 1 },
          meters: { synthesis: 1 }, memory: { patron: 'samarkand', observatory_work: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Yazdī gets you into rooms where men compute the positions of stars for a living. The letter science and the star science are, it turns out, hungry for each other.',
            chronicle: 'With Yazdī he went to Samarkand, where the star science and the letter science met over the same tables.' },
        ],
      },
    ],
  },

  court_commission: {
    id: 'court_commission', phase: 3,
    rubric: 'THE AUDIENCE HALL · THE PATRON WANTS SOMETHING USEFUL',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — works commissioned as royal "boons"; patronage was transactional and explicit',
    when: ['mem:patron'],
    affordances: ['royal_patronage', 'private_audience'],
    situation:
      'The commission is put plainly, which is how commissions are put: something demonstrable, by a named season, ' +
      'in exchange for money and standing. The prince does not want a philosophy. He wants a result he can show people.',
    options: [
      {
        id: 'accept_bold', label: 'Promise a public demonstration',
        detail: 'The big claim. Big reward if you land it — and a promise a court can measure.',
        requires: [],
        contract: {
          id: 'demonstration_boon', name: 'The Demonstration Boon', deadline: 4,
          promise: 'A public demonstration of the science before the court',
          requires: ['meter:demonstration>=3'],
          reward: { rep: { imperial: 2, occult: 1 }, meters: { exposure: 1 }, memory: { boon_delivered: true } },
          failure: { rep: { imperial: -2, scholarly: -1 }, meters: { exposure: 1 }, memory: { boon_failed: true } },
          expectation_delta: 2,
        },
        effects: { memory: { took_commission: 'bold' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'Agreed, witnessed, and written into the household accounts. You have four seasons and a promise with your name on it.',
            chronicle: 'He promised the prince a public demonstration of his science, with a season named for it.' },
        ],
      },
      {
        id: 'accept_modest', label: 'Promise a written exposition instead',
        detail: 'Smaller claim, likelier delivery. Patrons remember who does not miss.',
        requires: [],
        contract: {
          id: 'exposition_boon', name: 'The Written Boon', deadline: 4,
          promise: 'A written exposition of the science for the prince',
          requires: ['meter:synthesis>=4'],
          reward: { rep: { imperial: 1, scholarly: 1 }, meters: { transmission: 1 }, memory: { boon_delivered: true } },
          failure: { rep: { imperial: -1 }, memory: { boon_failed: true } },
          expectation_delta: 1,
        },
        effects: { memory: { took_commission: 'modest' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'A book, then, by the fourth season. He seems mildly disappointed and entirely satisfied.',
            chronicle: 'He undertook to write the prince an exposition rather than promise him a spectacle.' },
        ],
      },
      {
        id: 'negotiate', label: 'Negotiate the terms down',
        detail: 'Longer deadline, smaller reward. The professional’s answer.',
        requires: ['rep:scholarly>=2'],
        contract: {
          id: 'negotiated_boon', name: 'The Negotiated Boon', deadline: 6,
          promise: 'An exposition of the science, on generous terms',
          requires: ['meter:synthesis>=3'],
          reward: { rep: { imperial: 1 }, meters: { transmission: 1 }, memory: { boon_delivered: true } },
          failure: { rep: { imperial: -1 }, memory: { boon_failed: true } },
          expectation_delta: 0,
        },
        effects: { memory: { took_commission: 'negotiated' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You talk him from four seasons to six and from a spectacle to a treatise. He respects it, slightly against his will.',
            chronicle: 'He negotiated the prince’s commission into terms he could actually keep.' },
        ],
      },
      {
        id: 'refuse_commission', label: 'Decline the commission',
        detail: 'Take no money and make no promise. Costs standing; costs nothing else.',
        requires: [],
        effects: { rep: { imperial: -1, scholarly: 1 }, memory: { refused_commission: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You explain that the work is not at a stage that can be promised. It is the true answer and an expensive one.',
            chronicle: 'He refused a princely commission rather than promise what he could not yet deliver.' },
        ],
      },
    ],
  },

  court_prince_question: {
    id: 'court_prince_question', phase: 3,
    rubric: 'THE AUDIENCE HALL · THE PRINCE’S QUESTION',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY / RESEARCH — lettrism as imperial political theory ("the political was and is magical as a rule")',
    when: ['mem:patron'],
    affordances: ['royal_patronage', 'public_audience'],
    situation:
      'He has been thinking, which is dangerous in princes. "If the letters are the architecture of creation," he says, ' +
      '"what does that tell us about the architecture of kingship?" The hall goes quiet. This is the question your ' +
      'whole science exists to answer, asked by a man who can act on the answer.',
    options: [
      {
        id: 'philosopher_king', label: 'Answer: it makes kingship a discipline he must study',
        detail: 'Turn the flattery into an obligation. Philosopher-kingship, argued to his face.',
        requires: ['meter:synthesis>=4'],
        effects: { meters: { exposure: 1 }, memory: { philosopher_king_argued: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'He listens for an hour and asks for a reading list. A Timurid prince has just agreed, in public, to be taught.',
            effects: { rep: { imperial: 2, scholarly: 1 }, meters: { transmission: 1, synthesis: 1 } },
            chronicle: 'Asked what letters teach about kingship, he answered that a king must become a student, and the prince agreed in open hall.' },
          { band: 'ambiguous', weight: 2, text: 'He enjoys it enormously and takes from it exactly the flattering half.',
            effects: { rep: { imperial: 1 } },
            chronicle: 'His answer on kingship pleased the prince, who kept the flattering half of it.' },
        ],
      },
      {
        id: 'legitimating', label: 'Answer: it shows his house was written into the cosmos',
        detail: 'Give him the legitimation he is fishing for. Enormously useful; hard to take back.',
        requires: [],
        effects: { rep: { imperial: 3, occult: 1, scholarly: -1 }, meters: { exposure: 2 }, memory: { legitimated_dynasty: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'The hall is delighted. So is the prince. So, later, is every enemy who wants to call you a court flatterer with a cosmology.',
            chronicle: 'He told the prince the cosmos had written his house into it, and the hall loved him for it.' },
          { band: 'backfire', weight: 1, text: 'It lands beautifully and travels badly. By spring, rivals are quoting it as proof your science is politics in a robe.',
            effects: { rep: { scholarly: -1 }, meters: { exposure: 1 } },
            chronicle: 'His legitimating answer was repeated everywhere, most often by men using it against him.' },
        ],
      },
      {
        id: 'refuse_question', label: 'Refuse to reduce the science to statecraft',
        detail: 'Tell a prince, politely, that the answer is not for him. Nobody does this.',
        requires: [],
        effects: { rep: { imperial: -2, scholarly: 2 }, memory: { refused_prince: true } },
        outcomes: [
          { band: 'qualified', weight: 2, text: 'The hall is scandalized; two scholars present will remember it as the most honest thing they saw at court.',
            chronicle: 'He declined to turn his science into statecraft for a prince, in front of the prince.' },
          { band: 'backfire', weight: 1, text: 'He is not used to being refused and does not enjoy learning how it feels.',
            effects: { rep: { imperial: -1 } },
            chronicle: 'His refusal to answer the prince’s question was long remembered at that court, and not fondly.' },
        ],
      },
    ],
  },

  court_dynasty: {
    id: 'court_dynasty', phase: 3,
    rubric: 'THE AUDIENCE HALL · HOW LONG WILL MY HOUSE LAST?',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY / RESEARCH — Ibn Turka prognosticated from Shāh Rukh’s name that the Timurid state would endure the ninth Islamic century',
    when: ['mem:patron', 'meter:demonstration>=1'],
    affordances: ['royal_patronage', 'private_audience', 'astronomical_data'],
    plate: IMG('cs-p3-zodiac-lunar-mansions.jpg', 'Celestial map: zodiac and lunar mansions, Seyyid Lokman workshop, late 16th c. (Wikimedia Commons)'),
    situation:
      'The question every dynasty eventually asks its scholars, asked privately, at night: how long? There is a stars ' +
      'answer, a letters answer, a historian’s answer, and a prudent silence. Whichever you give will be repeated.',
    options: [
      {
        id: 'name_reading', label: 'Read it from the ruler’s name',
        detail: 'Lettrist prognostication — your own method, on the highest possible stakes.',
        requires: ['limiya>=2'],
        effects: { artifacts: ['horoscope'], meters: { exposure: 2, demonstration: 1 }, memory: { dynastic_prognosis: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You take the letters of the ruler’s name apart and give a term: the house endures the century out. It is precise, defensible, and exactly what a dynasty wants to hear.',
            effects: { rep: { imperial: 3, occult: 2 } },
            chronicle: 'From the letters of the ruler’s own name he reckoned that the house would endure the ninth century entire.' },
          { band: 'ambiguous', weight: 1, text: 'The reading is sound but the number is uncomfortable. You deliver it anyway, and watch the room decide how to feel.',
            effects: { rep: { imperial: 1, occult: 2 }, meters: { exposure: 1 } },
            chronicle: 'His reckoning from the ruler’s name gave a term nobody in the room had wanted.' },
        ],
      },
      {
        id: 'stars_answer', label: 'Give the astrological answer',
        detail: 'Conjunctions and cycles — the conventional, respectable prediction.',
        requires: ['access:astronomy'],
        effects: { artifacts: ['horoscope'], meters: { exposure: 1 }, memory: { dynastic_prognosis: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'A competent conjunctional reading, delivered with the appropriate hedges. The court astrologers nod; nobody is startled.',
            effects: { rep: { imperial: 1 } },
            chronicle: 'He answered the dynastic question from the conjunctions, in the manner the court expected.' },
        ],
      },
      {
        id: 'refuse_predict', label: 'Refuse to name a term',
        detail: 'Tell him no honest method gives a date. True, unwelcome, and safe from being disproved.',
        requires: [],
        effects: { rep: { scholarly: 1, imperial: -1 }, memory: { refused_prognosis: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You explain why the question is badly formed. He listens, unsatisfied, and asks a lesser man in the morning.',
            chronicle: 'He refused to set a term on a dynasty, and a lesser astrologer obliged the next morning.' },
        ],
      },
    ],
  },

  court_calligrapher: {
    id: 'court_calligrapher', phase: 3,
    rubric: 'THE KITĀBKHĀNA · THE CALLIGRAPHER HAS FOUND A PATTERN',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — Bāysunghur’s atelier and calligraphic culture; this calligrapher is constructed',
    affordances: ['manuscripts', 'inscription'],
    plate: IMG('cs-p3-square-kufic-bismillah.jpg', 'Square Kufic Bismillah page by Ahmed Karahisari, 16th c. (Wikimedia Commons)'),
    situation:
      'The court calligrapher has been laying out a square Kufic panel and has noticed that the letters, forced into a ' +
      'grid, generate the same proportions in three different verses. She wants to know whether she has found something ' +
      'or merely made something. It is, exactly, your question.',
    options: [
      {
        id: 'collaborate', label: 'Work it out with her',
        detail: 'Take an artisan seriously as a colleague. Gains a capability, not a compliment.',
        requires: [],
        effects: { people: ['calligrapher'], meters: { synthesis: 1 }, memory: { calligrapher_ally: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Three evenings of grids and arithmetic. She has found something, and she now knows how to look for more of it — and how to draw it so others can see.',
            effects: { meters: { synthesis: 1, demonstration: 1 } },
            chronicle: 'He worked the letter-grid out beside the court calligrapher, and gained a collaborator who could make his science visible.' },
          { band: 'success', weight: 1, text: 'Half discovery, half artifact of the grid — but the collaboration is real and she will bring you the next one too.',
            chronicle: 'He took the calligrapher’s pattern seriously, and she brought him every pattern she found thereafter.' },
        ],
      },
      {
        id: 'appropriate', label: 'Take the observation and thank her',
        detail: 'It is a real finding. It can be yours. She is an artisan; nobody will ask.',
        requires: [],
        effects: { meters: { synthesis: 2 }, rep: { scholarly: 1 }, memory: { took_credit: true } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'The finding is genuinely useful. The workshop is a small world, and workshops talk to each other.',
            effects: { rep: { imperial: -1 } },
            chronicle: 'He published the calligrapher’s observation as his own, and the workshop noticed.' },
        ],
      },
      {
        id: 'dismiss', label: 'Tell her it is an artifact of the grid',
        detail: 'Probably true. Definitely discouraging. Costs you nothing and closes a door.',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'qualified', weight: 1, text: 'She accepts it, thanks you, and does not bring you the next one.',
            chronicle: 'He dismissed the calligrapher’s pattern as an accident of the grid, and was not shown another.' },
        ],
      },
    ],
  },

  court_atelier_commission: {
    id: 'court_atelier_commission', phase: 3,
    rubric: 'THE KITĀBKHĀNA · YOUR DIAGRAM, PROPERLY MADE',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — Bāysunghur as accomplished calligrapher and patron of the book arts',
    when: ['access:atelier'],
    affordances: ['manuscripts', 'inscription', 'royal_patronage'],
    plate: IMG('cs-p3-safavid-illuminated-ms.jpg', 'Safavid illuminated manuscript page, Shahnameh tradition (Wikimedia Commons)'),
    situation:
      'The kitābkhāna offers to make one of your cosmological diagrams the way it makes things for princes: gold, lapis, ' +
      'a full folio. A diagram that beautiful is an argument that travels — and a diagram that beautiful is also evidence.',
    options: [
      {
        id: 'full_glory', label: 'Let them make it magnificent',
        detail: 'Gold and lapis. The system becomes an object princes want to own.',
        requires: [],
        effects: {
          meters: { transmission: 2, exposure: 1 }, rep: { imperial: 1, occult: 1 },
          memory: { baysunghur_commission: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The finished folio stops conversation. Two other courts request copies within the year — your cosmology is now a luxury good, and luxury goods travel.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'The atelier made his cosmogram in gold and lapis, and other courts began asking for copies.' },
          { band: 'backfire', weight: 1, text: 'It is magnificent. It is also, now, a beautiful object with your cosmology on it, in circulation, unrecallable.',
            effects: { meters: { exposure: 2 } },
            chronicle: 'His diagram was made magnificent, and passed beyond his power to recall it.' },
        ],
      },
      {
        id: 'plain_teaching', label: 'Insist on a plain, teachable version',
        detail: 'Simple, explained, reproducible by any copyist. Designed for uptake, not for princes.',
        requires: [],
        effects: { meters: { transmission: 1 }, rep: { scholarly: 1 }, memory: { plain_diagram: true, taught_widely: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'The illuminators are baffled and slightly offended. The result can be copied by anyone with a reed pen, which is the entire point.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He insisted his diagram be made plain enough for any copyist, against the atelier’s better taste.' },
        ],
      },
      {
        id: 'decline_atelier', label: 'Keep the diagram out of the workshop',
        detail: 'No copies, no folio, no evidence. The cleanest way to stay small.',
        requires: [],
        effects: { memory: { hoarded: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'It stays in your notebook, exact and unseen.',
            chronicle: 'He kept his central diagram out of the atelier, and out of the world.' },
        ],
      },
    ],
  },

  court_astronomer: {
    id: 'court_astronomer', phase: 3,
    rubric: 'THE STAR-TABLE ROOM · A COMPUTER WANTS TO ARGUE',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — Samarkand astronomy, Ulugh Beg’s circle; this astronomer is constructed',
    when: ['access:astronomy'],
    affordances: ['astronomical_data', 'instruments'],
    situation:
      'One of the men who computes tables for a living has read your letter-work and wants to know, without hostility, ' +
      'why he should believe any of it. He is not a preacher. He is the harder audience: someone who checks.',
    options: [
      {
        id: 'show_the_math', label: 'Show him the mathematics and let him check it',
        detail: 'Hand your method to a man whose job is finding errors.',
        requires: ['meter:synthesis>=4'],
        effects: { people: ['astronomer'], memory: { astronomer_engaged: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'He checks it for a week and comes back with two corrections and a proposal for joint work. This is worth more than a prince’s applause.',
            effects: { meters: { synthesis: 2 }, rep: { scholarly: 2 }, memory: { observatory_work: true } },
            chronicle: 'He gave his method to a Samarkand computer to check, and got back corrections and a collaborator.' },
          { band: 'qualified', weight: 2, text: 'He finds one real error. It is a small error and it is yours, and you will fix it, and he will remain politely unconvinced.',
            effects: { meters: { synthesis: 1 }, rep: { scholarly: 1 } },
            chronicle: 'An astronomer found the flaw in his tables, and he thanked him and mended it.' },
        ],
      },
      {
        id: 'appeal_authority', label: 'Answer from authority instead',
        detail: 'Cite the tradition, the masters, the lineage. Works on most people.',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'backfire', weight: 2, text: 'He listens to the entire genealogy of your doctrine and says, mildly, that he asked how you know. The room notices.',
            effects: { rep: { scholarly: -1 } },
            chronicle: 'Pressed by an astronomer for his method, he offered a lineage instead, and was not forgiven for it.' },
          { band: 'qualified', weight: 1, text: 'The authorities are impressive enough to end the conversation without settling it.',
            chronicle: 'He met an astronomer’s challenge with authorities rather than proofs.' },
        ],
      },
    ],
  },

  court_rival_astrologer: {
    id: 'court_rival_astrologer', phase: 3,
    rubric: 'THE STAR-TABLE ROOM · A RIVAL CHALLENGES YOUR CALCULATION',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Design conversation, "rival astrologer challenge"; court rivalry attested generally',
    when: ['meter:exposure>=3'],
    exposure_min: 3,
    affordances: ['public_audience', 'astronomical_data', 'manuscript_table'],
    situation:
      'The court’s senior astrologer has found — or manufactured — an error in your last reading, and has chosen the ' +
      'audience hall to mention it. He is competent, he is threatened, and he has been at this court longer than you.',
    options: [
      {
        id: 'demonstrate', label: 'Answer with the numbers, publicly',
        detail: 'Work it through in front of everyone. Wins or loses on the mathematics.',
        requires: ['meter:synthesis>=4'],
        boosts: ['person:astronomer', 'person:yazdi'],
        effects: { meters: { exposure: 1 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You reconstruct the whole calculation aloud and locate his error inside his objection. He is finished at this court for a year.',
            effects: { rep: { scholarly: 2, imperial: 1 }, meters: { demonstration: 1 }, memory: { humiliated_rival: true } },
            chronicle: 'He answered a rival’s public challenge by reconstructing the calculation aloud, and left the man nothing to stand on.' },
          { band: 'qualified', weight: 2, text: 'You are right on the substance and he is faster in the room. The hall calls it a draw, which favors him.',
            effects: { rep: { scholarly: 1 }, memory: { rival_survives: true } },
            chronicle: 'His answer to the rival astrologer was correct and insufficiently loud.' },
        ],
      },
      {
        id: 'recruit_rival', label: 'Offer him joint work instead',
        detail: 'Convert an enemy into a collaborator. Costs pride; buys peace.',
        requires: ['himiya>=1'],
        effects: { memory: { rival_recruited: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'He is astonished to be offered a share instead of a fight, and takes it. You have bought a colleague at the price of a triumph.',
            effects: { rep: { imperial: 1 }, meters: { synthesis: 1 }, people: ['rival'] },
            chronicle: 'Challenged before the court, he offered his rival collaboration, and gained a colleague where an enemy had been.' },
          { band: 'ambiguous', weight: 1, text: 'He accepts publicly and continues privately. You have bought quiet, not loyalty.',
            effects: { people: ['rival'] },
            chronicle: 'He bought his rival’s public civility, and got nothing more.' },
        ],
      },
      {
        id: 'legal_answer', label: 'Answer as a jurist: question his standing to accuse',
        detail: 'Use the bench, not the tables. Effective, and it looks like evasion.',
        requires: ['access:judiciary'],
        effects: { rep: { orthodox: 1, scholarly: -1 }, memory: { rival_survives: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The procedural point lands and the challenge collapses. Everyone present understands you did not answer the question.',
            chronicle: 'He met a mathematical challenge with a jurist’s procedural objection, and the room drew its own conclusions.' },
        ],
      },
      {
        id: 'concede', label: 'Concede the point and correct the record',
        detail: 'He is right. Say so. Cheap in pride, expensive in nothing else.',
        requires: [],
        effects: { rep: { scholarly: 1, imperial: -1 }, memory: { conceded_publicly: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You thank him for the correction in front of the court. It disarms him completely and confuses everyone else.',
            chronicle: 'He conceded his rival’s correction publicly, which nobody at that court had seen done before.' },
        ],
      },
    ],
  },

  court_bazm_wonder: {
    id: 'court_bazm_wonder', phase: 3,
    rubric: 'THE FEAST · SOMETHING TO ASTONISH THE TABLE',
    grounding: 'ATTESTED',
    source: 'RESEARCH — bazm/razm as the poles of Timurid court culture; wonder-working at feasts attested in the later manuals',
    when: ['mem:patron'],
    affordances: ['public_audience', 'wine', 'lamps_and_mirrors'],
    plate: IMG('c19-qazwini-angel.jpg', 'Winged angels, al-Qazwīnī’s Wonders of Creation (Wikimedia Commons)'),
    situation:
      'Deep into the bazm, the prince wants a wonder and everyone is drunk enough to want it badly. This is not a ' +
      'lesser occasion than the audience hall. Half the political business of this court is done exactly here, in jokes.',
    options: [
      {
        id: 'vanishing_ink', label: 'The vanishing ink',
        detail: 'Write, let them read, let it disappear. Delightful — and quietly useful to certain people.',
        requires: ['rimiya>=2'],
        boosts: ['kimiya>=1', 'mem:inks_solved'],
        effects: { meters: { demonstration: 1, exposure: 1 }, rep: { occult: 1 }, memory: { showed_vanishing_ink: true } },
        outcomes: [
          { band: 'triumph', weight: 2, text: 'The table is delighted. The prince laughs. The man who keeps the prince’s correspondence does not laugh — he leans forward and asks a very specific question.',
            effects: { rep: { imperial: 2 }, memory: { intelligence_interest: true } },
            chronicle: 'His vanishing ink amused the feast and interested the man who handled the prince’s letters.' },
          { band: 'success', weight: 1, text: 'A perfect small marvel. You are asked to repeat it twice and refuse the third time, correctly.',
            chronicle: 'He made ink vanish for the prince’s table, and knew when to stop.' },
        ],
      },
      {
        id: 'riddle', label: 'Give them a number-riddle instead',
        detail: 'Teach a little mathematics disguised as a game. Safer, and it sticks.',
        requires: [],
        effects: { meters: { transmission: 1 }, rep: { scholarly: 1 } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Three courtiers are still arguing about it at breakfast. One of them will ask you to explain it properly, which is how a student is acquired.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'At the feast he set a number-riddle, and won a student by it in the morning.' },
        ],
      },
      {
        id: 'absurd', label: 'Perform something frankly ridiculous',
        detail: 'The court likes to laugh. Laughter is medicine, says the tradition, and it disarms watchers.',
        requires: ['rimiya>=1'],
        effects: { rep: { imperial: 1, scholarly: -1 }, memory: { court_jester_moment: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'It is stupid and the hall howls. You are, for one evening, entirely unthreatening — which is a use of an evening.',
            effects: { meters: { exposure: -1 } },
            chronicle: 'He made the prince’s table laugh at something ridiculous, and nobody watched him for a season.' },
          { band: 'backfire', weight: 1, text: 'They laugh. A scholar at the far end of the table decides you are a conjuror with a philosophy attached.',
            effects: { rep: { scholarly: -1 } },
            chronicle: 'His feast-night foolery cost him a scholar’s respect at the far end of the table.' },
        ],
      },
    ],
  },

  court_bazm_confession: {
    id: 'court_bazm_confession', phase: 3,
    rubric: 'THE FEAST · WHO EVERYONE ACTUALLY IS',
    grounding: 'ATTESTED',
    source: 'RESEARCH — confessional and factional ambiguity in occultist circles; legal, Sufi and confessional identities did not align neatly',
    when: ['mem:patron'],
    affordances: ['wine', 'private_audience'],
    situation:
      'Late, and the table has thinned to the people who stay late. A jurist here is quietly devoted to the Prophet’s ' +
      'family; a Sufi turns out to be rigorous in law; the prince’s secretary is reading something he should not have. ' +
      'None of these identities line up the way the labels promise. Someone will ask where you stand.',
    options: [
      {
        id: 'read_the_room', label: 'Answer differently to each of them',
        detail: 'The translation mechanic in miniature: same doctrine, four registers.',
        requires: ['himiya>=1'],
        effects: { meters: { transmission: 1 }, memory: { reads_the_room: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'By dawn each of them believes you are fundamentally their kind of man. None of them is wrong, exactly.',
            effects: { rep: { occult: 1, imperial: 1 }, meters: { synthesis: 1 } },
            chronicle: 'At the late table he gave four men four versions of one doctrine, and each recognized his own.' },
          { band: 'ambiguous', weight: 1, text: 'It works on three of them. The fourth compares notes with someone, later.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'His four answers at the late table were compared, eventually, by two of the men who heard them.' },
        ],
      },
      {
        id: 'one_answer', label: 'Give all of them the same answer',
        detail: 'One doctrine, undiluted, whoever is listening. Consistent, and it makes enemies honestly.',
        requires: [],
        effects: { rep: { scholarly: 2, occult: 1 }, meters: { exposure: 1 }, memory: { consistent_doctrine: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Two of them are impressed, one is offended, and all four now know precisely what you think. That is a kind of safety and a kind of exposure at once.',
            chronicle: 'Asked where he stood, he gave every man at the table the same answer.' },
        ],
      },
      {
        id: 'deflect_bazm', label: 'Turn the question into a joke and go to bed',
        detail: 'Nothing said, nothing owed, nothing gained.',
        requires: [],
        effects: {},
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The joke is good enough that nobody presses. You leave with your positions intact and unknown.',
            chronicle: 'Asked where he stood at the late table, he made a joke and went to bed.' },
        ],
      },
    ],
  },

  court_razm_date: {
    id: 'court_razm_date', phase: 3,
    rubric: 'THE CAMPAIGN · AN AUSPICIOUS DATE FOR THE ARMY',
    grounding: 'ATTESTED',
    source: 'RESEARCH — election astrology as imperial technology; the astrological-lettrist platform as political science',
    when: ['mem:patron', 'meter:demonstration>=2'],
    affordances: ['royal_patronage', 'astronomical_data', 'military'],
    situation:
      'The army moves in the spring and the prince wants a date. This is not a parlor question: men will march on your ' +
      'arithmetic, and if the campaign goes badly, the record will show who chose the day.',
    options: [
      {
        id: 'elect_date', label: 'Compute the election honestly',
        detail: 'Do the real work and name the day the method gives you.',
        requires: ['access:astronomy'],
        effects: { meters: { exposure: 2 }, rep: { imperial: 1 }, memory: { chose_campaign_date: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The campaign succeeds. Whether your date did anything is unknowable and entirely beside the point: the army believes it did.',
            effects: { rep: { imperial: 3, occult: 2 }, meters: { demonstration: 1 } },
            chronicle: 'He named the day the army marched, and the campaign succeeded, and the reason was thereafter beyond argument.' },
          { band: 'ambiguous', weight: 2, text: 'The campaign is a partial success. Everyone finds in it the confirmation they came with.',
            effects: { rep: { imperial: 1 } },
            chronicle: 'The campaign he dated went neither well nor badly, and proved nothing to anyone.' },
          { band: 'disaster', weight: 1, text: 'The campaign fails badly. The date is in the record, with your name beside it, and a rival is already reading it aloud.',
            effects: { rep: { imperial: -2 }, meters: { exposure: 2 }, memory: { campaign_failed: true } },
            chronicle: 'The army marched on the day he chose and was broken, and the record kept his name beside the date.' },
        ],
      },
      {
        id: 'hedge_date', label: 'Give a window, not a day',
        detail: 'Technically better practice, politically weaker, and much harder to hang you with.',
        requires: [],
        effects: { rep: { imperial: 0, scholarly: 1 }, memory: { hedged_date: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You give a fortnight and the reasoning behind it. The commanders are irritated; the commanders are also unable to blame you precisely.',
            chronicle: 'Asked for a day, he gave the army a fortnight and his reasons.' },
        ],
      },
      {
        id: 'refuse_razm', label: 'Refuse to date a war',
        detail: 'Decline to put your science behind men getting killed on a schedule.',
        requires: [],
        effects: { rep: { imperial: -2, scholarly: 1 }, memory: { refused_war_work: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You decline. Someone else provides a date within the hour, and the prince notes which of you was useful.',
            chronicle: 'He refused to set a date for a campaign, and another man did it before evening.' },
        ],
      },
    ],
  },

  court_razm_device: {
    id: 'court_razm_device', phase: 3,
    rubric: 'THE CAMPAIGN · A SOLDIER WANTS THE TRICK',
    grounding: 'ATTESTED',
    source: 'RESEARCH — later manuals catalogue illusionist/trickster operations with explicit military and intelligence applications',
    when: ['mem:showed_vanishing_ink'],
    affordances: ['military', 'private_audience'],
    situation:
      'An officer who saw the feast-night ink has thought about it for a month. He does not want a wonder. He wants ' +
      'dispatches that cannot be read if intercepted, and he is prepared to pay for a method, not a marvel.',
    options: [
      {
        id: 'give_method', label: 'Give him the working method',
        detail: 'Your party trick becomes state apparatus. That is what usefulness means.',
        requires: [],
        boosts: ['kimiya>=1'],
        effects: {
          rep: { imperial: 2 }, meters: { exposure: 1, transmission: 1 },
          memory: { military_application: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Within a season the prince’s couriers are carrying letters nobody else can read. You are now, quietly, part of how this state functions.',
            effects: { rep: { imperial: 1 }, meters: { demonstration: 1 } },
            chronicle: 'A feast-night trick became the prince’s courier cipher, and his science became part of the machinery of the state.' },
          { band: 'ambiguous', weight: 1, text: 'They take the method and the credit. You have made yourself useful and untraceable in the same act.',
            chronicle: 'He handed the army his method and watched it become someone else’s achievement.' },
        ],
      },
      {
        id: 'sell_service', label: 'Offer the service, not the method',
        detail: 'Keep the secret; do the work yourself. Indispensable, and permanently on call.',
        requires: [],
        effects: { rep: { imperial: 1 }, meters: { exposure: 1 }, memory: { hoarded: true, military_application: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You become the man who prepares the important letters. It is influence, and it is a leash.',
            chronicle: 'He kept the method and sold the service, and became the man the prince’s letters went through.' },
        ],
      },
      {
        id: 'refuse_device', label: 'Refuse him',
        detail: 'Some applications are not worth the patron. Say no to a soldier and mean it.',
        requires: [],
        effects: { rep: { imperial: -1, scholarly: 1 }, memory: { refused_war_work: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'He accepts the refusal with a shrug that says he will find it elsewhere, and he is right.',
            chronicle: 'He refused to put his art into the army’s dispatch bags.' },
        ],
      },
    ],
  },

  court_departure: {
    id: 'court_departure', phase: 3,
    rubric: 'TOWARD 1420 · THE COURT YEARS END',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Iskandar Sultan defeated, blinded and executed 1415; patronage shifts to Bāysunghur c.1416',
    affordances: [],
    plate: IMG('cs-p3-shahnama-caesar-talisman.jpg', '"Caesar Makes a Talisman", folio from a Shahnama, Iran c. 1330–40 — MET (CC0)'),
    situation:
      'Courts end. Iskandar Sultan overreached his uncle Shāh Rukh and paid for it in the way Timurid princes do; the ' +
      'workshops disperse, the patronage reshuffles, and men who were somebody last spring are looking for a house. ' +
      'What you take out of these years is the material the summa will be built from.',
    options: [
      {
        id: 'take_the_work', label: 'Leave with the work, and nothing else',
        detail: 'Books, tables, diagrams. Let the politics go on without you.',
        requires: [],
        effects: { meters: { synthesis: 2 }, memory: { court_exit: 'work' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You go with chests of paper and no faction. It is the least dangerous way to leave a court that has just eaten a prince.',
            chronicle: 'When the court broke up he left with his papers and no allegiances.' },
        ],
      },
      {
        id: 'keep_patron', label: 'Attach yourself to the surviving house',
        detail: 'Bāysunghur’s establishment endures. Continuity of protection, at the price of visible loyalty.',
        requires: [],
        effects: { rep: { imperial: 2 }, meters: { exposure: 1 }, memory: { court_exit: 'patron', kept_patron: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You are absorbed into the winning household. Protection now; a documented association forever.',
            chronicle: 'He attached himself to the surviving princely house, and was thereafter counted its man.' },
          { band: 'qualified', weight: 1, text: 'They take you on, at a lower station than you had, with the wariness reserved for a dead prince’s people.',
            effects: { rep: { imperial: -1 } },
            chronicle: 'The surviving house took him in warily, as a dead prince’s man.' },
        ],
      },
      {
        id: 'take_the_circle', label: 'Leave with your people',
        detail: 'Calligrapher, astronomer, student, friend — whoever will come. The circle over the career.',
        requires: ['meter:transmission>=3'],
        effects: { meters: { transmission: 2, synthesis: 1 }, memory: { court_exit: 'circle' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Four people follow you out of a collapsing court because the work is more interesting than the wreckage. That is what an intellectual movement looks like at the beginning.',
            chronicle: 'When the court fell apart he left with his collaborators, and what followed him was no longer only a man.' },
        ],
      },
    ],
  },
};
