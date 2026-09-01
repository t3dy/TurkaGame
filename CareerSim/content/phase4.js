// phase4.js — Phase IV: The 1420 Pivot (c. 1419–1422).
// Composition as gameplay. The book is a technology with design parameters, and
// the choices made here decide who can use the system — and who will indict it.

export const PHASE = {
  id: 4,
  name: 'THE PIVOT — 1420',
  dateline: 'c. 1419–1422',
  // Raised 6 -> 8 (docs/ECONOMY.md §5): at six seasons this phase saw 35% of its pool,
  // the worst in the game, while carrying the most ATTESTED material.
  time: 8,
  intro:
    'Everything converges in one year. Ulugh Beg breaks ground on the Samarkand observatory. Yazdī is becoming the ' +
    'historian who writes empires into the stars. And you have, at last, the whole thing in view — the summa that ' +
    'will be called Investigations, if you can build it. Eight seasons. This is the year the system gets made, or does not.',
  // By now the ladder can reach its top rungs — see content/pressure.js.
  injections: ['pressure_rumor', 'pressure_copy_request', 'pressure_denunciation'],
};

const IMG = (file, caption) => ({ src: '../assets/manuscripts/' + file, caption });

export const NODES = [
  {
    // Was one six-encounter node. Nothing past position ~3 of a node could fire inside
    // the phase's budget: pivot_sources fired in 0.0% of runs and pivot_globes — the
    // Three Globes of Light, ATTESTED — in 4.3% (docs/MECHANICSISSUES.md §3).
    id: 'desk', name: 'The Desk', icon: '✒',
    hook: 'Where the summa is actually written. Nothing else gets it done.',
    encounters: ['pivot_begin', 'pivot_language', 'pivot_structure'],
  },
  {
    id: 'argument', name: 'The Argument', icon: '✒',
    hook: 'What the book claims, whom it contradicts, and whose names go in the margins.',
    encounters: ['pivot_globes', 'pivot_sensory', 'pivot_sources'],
  },
  {
    id: 'diagram', name: 'The Drawing Board', icon: '◎',
    hook: 'The central diagram — the Tetractys, remade as a lettrist cosmogram.',
    encounters: ['pivot_tahawi', 'pivot_wafq'],
  },
  {
    id: 'brethren', name: 'The Circle', icon: '✳',
    hook: 'Yazdī, students, correspondents — the people who decide whether this survives you.',
    encounters: ['pivot_yazdi_copy', 'pivot_teach', 'pivot_grimoire'],
  },
  {
    id: 'samarkand', name: 'The Observatory Rising', icon: '🔭',
    hook: 'Ulugh Beg is building the finest instrument in the world. Star science and letter science, booming together.',
    encounters: ['pivot_observatory'],
  },
  {
    id: 'depart4', name: 'The First Summons', icon: '⚖', departure: true,
    hook: 'A letter with a tribunal’s seal. The years of being left alone are over.',
    encounters: ['pivot_departure'],
  },
];

export const ENCOUNTERS = {
  pivot_begin: {
    id: 'pivot_begin', phase: 4,
    rubric: 'THE DESK · BEGINNING THE SUMMA',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — 1420: completes Investigations (Kitāb al-Mafāḥiṣ), the first systematic summa of Islamic lettrism',
    affordances: ['quiet', 'library'],
    situation:
      'Twenty years of notes, and the shape of the thing is finally visible: not a commentary, not a manual, but a ' +
      'systematic philosophy in which letter, number, and cosmos are one science. It has never been done. The only ' +
      'question is what kind of book it will be.',
    options: [
      {
        id: 'systematic', label: 'Build it as a complete philosophical system',
        detail: 'The whole architecture, argued from first principles. Slow, enormous, and unprecedented.',
        requires: ['meter:synthesis>=5'],
        effects: {
          artifacts: ['investigations'], meters: { synthesis: 2 },
          memory: { investigations_begun: true, investigations_scope: 'systematic' },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You commit to the full architecture: three globes of light, the Letter in its mental, written and spoken registers, an ascent and a descent and an ascent. It will take everything you have.',
            effects: { rep: { scholarly: 2 } },
            chronicle: 'He began the Investigations as a complete system — the first summa of its kind ever attempted.' },
          { band: 'success', weight: 1, text: 'The architecture holds on paper. Whether it holds for a reader is a different question, and one you will not be able to ask yourself.',
            chronicle: 'He set out to build the whole system at once, and did not stop to ask whether it could be read.' },
        ],
      },
      {
        id: 'practical', label: 'Build it as a usable handbook',
        detail: 'Method first, philosophy implicit. Less glory, far more uptake.',
        requires: [],
        effects: {
          artifacts: ['investigations'], meters: { transmission: 2, synthesis: 1 },
          memory: { investigations_begun: true, investigations_scope: 'practical' },
        },
        outcomes: [
          { band: 'success', weight: 2, text: 'A working book: definitions, procedures, worked examples. Scholars will call it thin. Practitioners will actually use it.',
            chronicle: 'He wrote the summa as a working handbook, and the learned called it thin.' },
        ],
      },
      {
        id: 'defer_summa', label: 'Not yet — spend the year deepening instead',
        detail: 'Refuse to publish prematurely. The system gets better; the years do not come back.',
        requires: [],
        effects: { meters: { synthesis: 3 }, memory: { deferred_summa: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'A year of pure work and no book. The system is genuinely stronger. Nobody outside this room knows that.',
            chronicle: 'He spent the pivot year deepening the system instead of writing it down.' },
        ],
      },
    ],
  },

  pivot_language: {
    id: 'pivot_language', phase: 4,
    rubric: 'THE DESK · IN WHICH LANGUAGE, AND FOR WHOM',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY / RESEARCH — dense elite Arabic vs. accessible Persian exposition; de-esotericization as a live strategic axis',
    when: ['mem:investigations_begun'],
    affordances: ['quiet'],
    situation:
      'Arabic is the language of the learned world and of every authority you cite. Persian is the language princes, ' +
      'poets and administrators actually read for pleasure. The same argument in the two languages is not the same ' +
      'argument: one is a monument, the other is an infection.',
    options: [
      {
        id: 'arabic', label: 'Dense Arabic, for the qualified few',
        detail: 'A masterwork that only the equipped can climb. Prestige, precision, control.',
        requires: [],
        effects: {
          rep: { scholarly: 3 }, meters: { synthesis: 1 },
          memory: { investigations_language: 'arabic', hoarded: true },
        },
        outcomes: [
          { band: 'success', weight: 2, text: 'The prose is magnificent and nearly impassable. Precisely the readers you want will get through it. Precisely no one else will.',
            chronicle: 'He wrote the summa in Arabic dense enough to keep out everyone he had not written it for.' },
          { band: 'qualified', weight: 1, text: 'So dense that even sympathetic scholars will need a commentary. You have written a book that requires an interpreter — and none has been appointed.',
            effects: { meters: { transmission: -1 } },
            chronicle: 'His Arabic was so compressed that his own allies asked for a commentary on it.' },
        ],
      },
      {
        id: 'persian', label: 'Persian, for warlords and administrators',
        detail: 'Reach. Turn princes into philosophers by making the philosophy readable.',
        requires: [],
        effects: {
          meters: { transmission: 3, exposure: 1 }, rep: { imperial: 1, occult: 1 },
          memory: { investigations_language: 'persian', taught_widely: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'It reads. A commander could read it. That is either the most democratic thing anyone has done with this science or the most reckless, and it is not clear the two differ.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He wrote the system in Persian, so that a warlord could read it and perhaps become something else.' },
          { band: 'backfire', weight: 1, text: 'It reads — and therefore it can be read by a hostile jurist in an afternoon, and quoted from a pulpit by evening.',
            effects: { meters: { exposure: 2 } },
            chronicle: 'His Persian made the doctrine legible to everyone, including the men who wanted it indicted.' },
        ],
      },
      {
        id: 'both_languages', label: 'Both: the summa in Arabic, a Persian exposition beside it',
        detail: 'Two books, two audiences, twice the work. The historically Turkian answer.',
        requires: ['meter:synthesis>=6'],
        effects: {
          artifacts: ['persian_primer'], meters: { transmission: 2 }, rep: { scholarly: 2 },
          memory: { investigations_language: 'both', taught_widely: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The monument and the door beside it. Scholars get the architecture; princes get the argument; you get the exhausting privilege of maintaining both.',
            effects: { meters: { synthesis: 1, exposure: 1 } },
            chronicle: 'He wrote the summa in Arabic and its door in Persian, and served the learned and the powerful at once.' },
        ],
      },
    ],
  },

  pivot_structure: {
    id: 'pivot_structure', phase: 4,
    rubric: 'THE DESK · WHAT TO CONCEAL AND WHAT TO EXPLAIN',
    grounding: 'ATTESTED',
    source: 'RESEARCH — Investigations’ diagrams deliberately simple and explained, terminology adapted for reception across scholarly communities',
    when: ['mem:investigations_begun'],
    affordances: ['quiet'],
    situation:
      'Every esoteric tradition you inherited hides its operative core behind allusion. You could do that. Or you ' +
      'could explain the diagrams, define the terms, and adapt the vocabulary so that a philosopher, a jurist and a ' +
      'mathematician each find a handhold. The tradition would call the second choice a betrayal.',
    options: [
      {
        id: 'explain', label: 'Explain everything, and adapt the terminology',
        detail: 'Design the book for uptake. Diagrams simple; terms translated per audience.',
        requires: [],
        effects: { meters: { transmission: 2 }, memory: { designed_for_uptake: true, taught_widely: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You write the same doctrine in four vocabularies and label the diagrams like a teacher. It is the least mysterious esoteric book ever written, and it will therefore actually spread.',
            effects: { meters: { transmission: 1 }, rep: { scholarly: 1 } },
            chronicle: 'He explained his diagrams and translated his terms for every audience, against the whole habit of the tradition.' },
          { band: 'ambiguous', weight: 1, text: 'Legible, teachable — and now the difficult parts can be quoted without their difficulty, which is how doctrines get misused.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'By making his doctrine plain he made it quotable, with all that follows from that.' },
        ],
      },
      {
        id: 'conceal_core', label: 'Explain the frame, conceal the operative core',
        detail: 'The classic compromise: teachable philosophy, guarded practice.',
        requires: [],
        effects: { rep: { occult: 2 }, meters: { transmission: 1 }, memory: { concealed_core: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Readers get a system they can admire and an operative layer they must come to you for. It is prudent, and it makes the book depend on your being alive.',
            chronicle: 'He explained the architecture and hid the working parts, and made the book depend on him.' },
        ],
      },
      {
        id: 'full_esoteric', label: 'Write it for those who already know',
        detail: 'Allusion, compression, no concessions. The tradition’s own way.',
        requires: [],
        effects: { rep: { occult: 2, scholarly: 1 }, meters: { transmission: -1 }, memory: { hoarded: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'A perfect object for a readership of perhaps thirty men, most of whom you have met.',
            chronicle: 'He wrote for the thirty men who could already read him, and for nobody else.' },
        ],
      },
    ],
  },

  pivot_globes: {
    id: 'pivot_globes', phase: 4,
    rubric: 'THE DESK · THE THREE GLOBES OF LIGHT',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Investigations’ own structure: three Globes of Light (Planet, Pearl, Peach) for the Mental, Written and Spoken Letter; an ascent–descent–ascent; "form is content"',
    when: ['mem:investigations_begun'],
    affordances: ['quiet'],
    situation:
      'The architecture question, finally: the Letter exists three ways — thought, written, spoken — and you have taken ' +
      'to calling their registers the three Globes of Light: Planet, Pearl, and Peach. A summa could march through them ' +
      'in order like a curriculum. Or it could move as the soul does — up, then down into the world, then up again — ' +
      'so that the book’s own shape performs the doctrine. Form as content. No one has built a book that way.',
    options: [
      {
        id: 'journey', label: 'Structure it as ascent–descent–ascent',
        detail: 'The book’s shape performs the doctrine. Astonishing if it works; bewildering if it half-works.',
        requires: ['meter:synthesis>=5'],
        effects: { meters: { synthesis: 1 }, memory: { globes_structure: 'journey' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'It locks. Planet, Pearl, Peach — mind, page, voice — and the reader who completes the circuit has enacted the cosmology, not merely read it. The book is now a machine that does something to the person who finishes it.',
            effects: { meters: { synthesis: 1, transmission: 1 }, rep: { occult: 1 } },
            chronicle: 'He built the summa as an ascent and descent and ascent, three Globes of Light, so that reading it performed the doctrine it argued.' },
          { band: 'ambiguous', weight: 1, text: 'The structure holds — for readers who see it. Those who do not will call the book disordered, and some of them will be reviewing it for tribunals.',
            effects: { rep: { scholarly: -1 } },
            chronicle: 'His summa’s spiral structure enacted the doctrine for those who saw it, and looked like disorder to those who did not.' },
        ],
      },
      {
        id: 'curriculum', label: 'Structure it as a plain curriculum',
        detail: 'Definitions to applications, in teaching order. Loses the enactment; gains every student.',
        requires: [],
        effects: { meters: { transmission: 1 }, memory: { globes_structure: 'curriculum' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Mental, then written, then spoken, each Globe closed before the next opens. A teacher can walk a class through it chapter by chapter — which is precisely what teachers will do with it for a century.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He ordered the three Globes as a curriculum, and teachers marched their students through it for a hundred years.' },
        ],
      },
    ],
  },

  pivot_tahawi: {
    id: 'pivot_tahawi', phase: 4,
    rubric: 'THE DRAWING BOARD · THE ṬAHAWĪ CIRCLE',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — the Ṭahawī Circle, first "modern" lettrist reworking of the Pythagorean Tetractys; survives in Ibn Turka’s own autograph (Tehran, Majlis MS 10196, f. 63a)',
    when: ['mem:investigations_begun'],
    affordances: ['quiet', 'inscription'],
    plate: IMG('cs-p4-persian-wafq-6x6.jpg', 'Persian wafq — a 6×6 magic square with instructions, 16th c. (Wikimedia Commons)'),
    situation:
      'The system needs one image that holds it all: the Ṭahawī Circle — the Pythagorean Tetractys rebuilt in letters. Get this right and ' +
      'a reader grasps in one glance what the prose takes four hundred pages to argue. Get it wrong and the whole ' +
      'edifice looks like decoration.',
    options: [
      {
        id: 'draw_it', label: 'Draw the Circle, and draw it simply',
        detail: 'The signature diagram, designed to be understood and copied.',
        requires: ['limiya>=2'],
        boosts: ['person:calligrapher', 'mem:designed_for_uptake'],
        effects: {
          // Rank 3: the diagram IS the mastery. Reachable now that Phase II's
          // muqaṭṭaʿāt work grants rank 2.
          quintet: { limiya: 1 },
          artifacts: ['tahawi_circle'], meters: { synthesis: 2, demonstration: 1 },
          memory: { tahawi_circle: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'There it is: the tetractys made of letters, the whole cosmology in one figure a student can reproduce from memory. This is the thing your name will be attached to in five hundred years.',
            effects: { meters: { transmission: 2 }, rep: { occult: 2, scholarly: 1 } },
            chronicle: 'He drew the Ṭahawī Circle — the Tetractys remade in letters — and the system had its image at last.' },
          { band: 'success', weight: 2, text: 'The figure works. It is a little crowded, and every copyist will simplify it slightly differently, which is its own kind of transmission.',
            effects: { meters: { transmission: 1 }, rep: { occult: 1 } },
            chronicle: 'He drew the lettrist Tetractys, and left the copyists to simplify what he had crowded.' },
        ],
      },
      {
        id: 'ornate', label: 'Make it magnificent instead of simple',
        detail: 'A diagram princes will hang. Impressive; harder to teach from.',
        requires: [],
        effects: {
          artifacts: ['tahawi_circle'], meters: { demonstration: 1, exposure: 1 }, rep: { imperial: 1, occult: 1 },
          memory: { tahawi_circle: true, ornate_diagram: true },
        },
        outcomes: [
          { band: 'success', weight: 2, text: 'Gold, lapis, and a complexity that impresses everyone and instructs no one. It will be copied for its beauty, which is still copying.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He made the central diagram magnificent, and it was copied for its beauty rather than its argument.' },
        ],
      },
      {
        id: 'prose_only', label: 'Argue it in prose; draw nothing',
        detail: 'No diagram to be seized, quoted, or misread. Also no image anyone remembers.',
        requires: [],
        effects: { meters: { synthesis: 1 }, memory: { no_diagram: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The argument stands without a picture. Nobody will ever be able to hold your system in their head all at once, including your students.',
            chronicle: 'He left the central figure undrawn, and his system was never afterward seen whole in one glance.' },
        ],
      },
    ],
  },

  pivot_wafq: {
    id: 'pivot_wafq', phase: 4,
    rubric: 'THE DRAWING BOARD · THE SEVEN TIERS',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — On the Splitting of the Moon and the Last Hour proposes a seven-tier epistemic hierarchy; only the endpoints and three middle tiers are documented — the full breakdown is an open research gap and is deliberately not invented here',
    when: ['mem:investigations_begun'],
    affordances: ['quiet'],
    situation:
      'A second, shorter Persian treatise wants to be written: a ranking of the ways of knowing, from the traditionists ' +
      'who read only the surface at the bottom, up through theologians, philosophers and Sufis, to lettrism at the apex ' +
      'of human perfection. It is the most useful thing you could write. It is also a list of everyone you are ranking below yourself.',
    options: [
      {
        id: 'write_hierarchy', label: 'Write it, apex and all',
        detail: 'Put lettrism at the top in plain Persian. Clarifying, and permanently quotable against you.',
        requires: [],
        effects: {
          artifacts: ['splitting_moon'], meters: { transmission: 2, exposure: 2 }, rep: { occult: 2, orthodox: -2 },
          memory: { wrote_hierarchy: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'It is lucid, ordered, and devastating. Students will find their bearings in it for generations — and every man you ranked beneath yourself can now read exactly where you put him.',
            effects: { meters: { transmission: 1 }, rep: { scholarly: 1 } },
            chronicle: 'He set out the ways of knowing in order, with lettrism at their summit, and let every ranked man read his place.' },
          { band: 'backfire', weight: 1, text: 'Within a year the treatise is circulating among precisely the traditionists it places at the bottom, who are reading it aloud to each other.',
            effects: { meters: { exposure: 2 } },
            chronicle: 'His hierarchy of knowing reached the traditionists it ranked lowest, and they read it aloud to one another.' },
        ],
      },
      {
        id: 'soften', label: 'Write it, but without naming the bottom',
        detail: 'Describe the ascent; leave out who is standing on which step.',
        requires: [],
        effects: { artifacts: ['splitting_moon'], meters: { transmission: 1, exposure: 1 }, rep: { occult: 1 }, memory: { wrote_hierarchy_soft: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'The ascent is described and the insults are removed. It is a better book and a slightly cowardly one, and it will not get you summoned.',
            chronicle: 'He described the ascent of knowing and quietly declined to name who stood at the bottom of it.' },
        ],
      },
      {
        id: 'skip_treatise', label: 'Leave it unwritten',
        detail: 'The summa is enough for one year. Say nothing about who ranks where.',
        requires: [],
        effects: { meters: { synthesis: 1 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The hierarchy stays in your head, where it can be neither taught nor used as evidence.',
            chronicle: 'He left the hierarchy of knowing unwritten, and it was neither taught nor used against him.' },
        ],
      },
    ],
  },

  pivot_yazdi_copy: {
    id: 'pivot_yazdi_copy', phase: 4,
    rubric: 'THE CIRCLE · YAZDĪ ASKS FOR THE AUTOGRAPH',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Yazdī likely copies Ibn Turka’s own autograph, ff. 52a–56a of Tehran Majlis MS 10196, c. 1420–25',
    when: ['person:yazdi', 'mem:investigations_begun'],
    affordances: ['manuscripts', 'private_audience'],
    situation:
      'Yazdī wants to copy the autograph in his own hand — not have it copied, copy it himself, which between the two ' +
      'of you means something. He is becoming the historian who writes dynasties into the heavens. What he carries, ' +
      'the century carries.',
    options: [
      {
        id: 'give_autograph', label: 'Give him the autograph',
        detail: 'The single highest-leverage act available to you. A copy in his hand outlives you both.',
        requires: [],
        effects: {
          meters: { transmission: 3 }, rep: { scholarly: 1 },
          memory: { yazdi_copied: true },
        },
        outcomes: [
          { band: 'triumph', weight: 2, text: 'He copies for weeks, arguing with the margins as he goes. When he is done, the system exists in two hands, one of which is trusted at the observatory and at court.',
            effects: { meters: { transmission: 1, synthesis: 1 } },
            chronicle: 'Yazdī copied the autograph of the Investigations in his own hand, and the system existed twice over.' },
          { band: 'success', weight: 1, text: 'The copy is made and taken east. You will not see that manuscript again, which is exactly what you wanted.',
            chronicle: 'He gave Yazdī the autograph to copy, and the copy went east without him.' },
        ],
      },
      {
        id: 'copy_together', label: 'Work through it with him, line by line',
        detail: 'Not just a copy — a transfer. Slow, and it makes him a co-author of the transmission.',
        requires: ['mem:yazdi_bond=equal'],
        effects: {
          meters: { transmission: 3, synthesis: 2 },
          memory: { yazdi_copied: true, yazdi_coauthor: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Six weeks at one desk. He corrects your mathematics twice and you rebuild a whole section around his objection. What leaves the room is better than what entered it, and two men understand it completely.',
            effects: { rep: { scholarly: 2 } },
            chronicle: 'He and Yazdī worked through the whole summa at one desk, and what came out of that room neither of them could have written alone.' },
        ],
      },
      {
        id: 'refuse_copy', label: 'Keep the autograph in your own keeping',
        detail: 'One copy, one hand, total control. And a house that could burn.',
        requires: [],
        effects: { memory: { hoarded: true, refused_yazdi_copy: true } },
        outcomes: [
          { band: 'backfire', weight: 1, text: 'He does not argue. He is disappointed in a way that will not be mentioned again, and the summa remains a single object in a single room.',
            effects: { rep: { scholarly: -1 } },
            chronicle: 'He refused even Yazdī a copy of the autograph, and the summa stayed one object in one room.' },
        ],
      },
    ],
  },

  pivot_teach: {
    id: 'pivot_teach', phase: 4,
    rubric: 'THE CIRCLE · WHO GETS THE KNOWLEDGE',
    grounding: 'ATTESTED',
    source: 'RESEARCH — de-esotericization and democratization as defining features of this occult-scientific culture; hoard-prestige vs. teach-for-reach as a real axis',
    when: ['mem:investigations_begun'],
    affordances: ['teaching', 'private_audience'],
    situation:
      'They keep coming: a persistent student who has copied everything you ever circulated, two correspondents from ' +
      'Shiraz, a young jurist who asks better questions than your colleagues. You can build a school, or you can ' +
      'build a secret. The tradition says the second. The century, increasingly, is doing the first.',
    options: [
      {
        id: 'teach_openly', label: 'Teach anyone who comes',
        detail: 'Maximum transmission. You will lose control of the doctrine and gain a movement.',
        requires: [],
        effects: {
          people: ['student'], meters: { transmission: 3, exposure: 2 }, rep: { occult: 1 },
          memory: { taught_widely: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Within two years there are men teaching your system in cities you have never visited, using your terminology, mostly correctly. This is what a school is.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He taught whoever came, and within two years his terminology was being used in cities he had never seen.' },
          { band: 'ambiguous', weight: 2, text: 'The teaching goes well and the crowd grows, and a growing crowd around a doctrine looks, from a governor’s window, exactly like a faction.',
            effects: { meters: { transmission: 1, exposure: 1 } },
            chronicle: 'His open teaching drew a crowd, and a crowd around a doctrine is a thing governors notice.' },
        ],
      },
      {
        id: 'select_few', label: 'Take a handful of qualified students only',
        detail: 'Depth over reach. A real school, small enough to control.',
        requires: [],
        effects: { people: ['student'], meters: { transmission: 2 }, rep: { scholarly: 1 }, memory: { selective_school: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Five students, properly trained, who understand the operative layer and can be trusted with it. Fewer than a movement; more than a secret.',
            effects: { meters: { synthesis: 1 } },
            chronicle: 'He took five students and taught them everything, which was more than a secret and less than a movement.' },
        ],
      },
      {
        id: 'teach_nobody', label: 'Teach no one',
        detail: 'The book is the teaching. Anyone worthy will find it. Very traditional; very risky.',
        requires: [],
        effects: { rep: { occult: 1 }, memory: { hoarded: true, taught_nobody: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You turn them away kindly. The system now depends entirely on a book and on whether anyone can read it without you.',
            chronicle: 'He turned his students away, and left the system to fend for itself in a book.' },
        ],
      },
    ],
  },

  pivot_sensory: {
    id: 'pivot_sensory', phase: 4,
    rubric: 'THE DESK \u00b7 AGAINST AVICENNA ON THE SENSES',
    grounding: 'ATTESTED',
    source: 'VN c19 \u2014 the sensory-theory innovations against Avicenna\u2019s hierarchy; timing of publication is the open choice',
    when: ['mem:investigations_begun'],
    affordances: ['quiet', 'library'],
    situation:
      'Buried in the summa is a quarrel you did not go looking for: your account of how the Letter reaches mind through ' +
      'ear and eye will not fit Avicenna\u2019s hierarchy of the senses, and you are increasingly sure Avicenna is wrong. ' +
      'Correcting the Master of philosophers is a career event in itself. The only question is when to be seen doing it.',
    options: [
      {
        id: 'publish_early', label: 'Publish the correction now',
        detail: 'Stake the claim while it is yours. Bold, early, and quotable by every enemy of novelty.',
        requires: ['meter:synthesis>=6'],
        effects: { rep: { scholarly: 2, orthodox: -1 }, meters: { exposure: 1 }, memory: { sensory_published: 'early' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The argument is airtight and lands like a slap. Half the philosophers are furious, which is how you know they read it. The correction is attached to your name permanently \u2014 in both senses.',
            effects: { meters: { synthesis: 1 }, rep: { occult: 1 } },
            chronicle: 'He corrected Avicenna on the senses in print, and the philosophers were furious enough to read him.' },
          { band: 'ambiguous', weight: 1, text: 'The learned split: the mathematicians find it obvious, the philosophers find it insolent, and \u201cthe man who quarrels with Avicenna\u201d joins your list of epithets.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'His quarrel with Avicenna over the senses divided the learned and named him among the Moderns.' },
        ],
      },
      {
        id: 'hold_it', label: 'Hold it until your name can absorb the backlash',
        detail: 'Patience. The argument keeps; the priority may not.',
        requires: [],
        effects: { meters: { synthesis: 1 }, memory: { sensory_published: 'held' } },
        outcomes: [
          { band: 'qualified', weight: 2, text: 'Into the drawer it goes, dated and sealed. If another man reaches the same conclusion first, the seal will prove nothing to anyone who matters.',
            chronicle: 'He held his correction of Avicenna in a sealed drawer, against a safer year.' },
        ],
      },
    ],
  },

  pivot_sources: {
    id: 'pivot_sources', phase: 4,
    rubric: 'THE DESK \u00b7 WHOSE NAMES GO IN THE MARGINS',
    grounding: 'ATTESTED',
    source: 'VN c25 \u2014 how fully to credit Ibn \u02bfArab\u012b and \u1e24am\u016bya; his generous pairing of the two co-founders is the attested signature',
    when: ['mem:investigations_begun'],
    affordances: ['quiet'],
    situation:
      'The summa rests on shoulders: Ibn \u02bfArab\u012b, \u1e24am\u016bya, Akhl\u0101\u1e6d\u012b, the Brethren old and new. A book that names ' +
      'them all is honest and smaller-looking. A book that absorbs them silently is grander \u2014 and every absorbed source ' +
      'is a witness your enemies can someday call.',
    options: [
      {
        id: 'generous', label: 'Credit the lineage generously',
        detail: 'Name the co-founders, the master, the circle. Honest \u2014 and less of the credit is yours.',
        requires: [],
        boosts: ['mem:lineages_declared=both'],
        effects: { rep: { scholarly: 2 }, meters: { transmission: 1 }, memory: { sources_credit: 'generous' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The genealogy is laid out in full \u2014 Ibn \u02bfArab\u012b and \u1e24am\u016bya as co-founders, the debt to Cairo named. Reviewers who came to find arrogance find scruple instead, and the book is harder to attack for it.',
            effects: { rep: { orthodox: 1 } },
            chronicle: 'He credited every shoulder the summa stood on, and his scruple disarmed men who had come to find arrogance.' },
          { band: 'success', weight: 1, text: 'Full credit, fully given. Some readers now rank you a synthesizer rather than a founder. They are not entirely wrong, and it stings anyway.',
            chronicle: 'He named his sources in full, and was called a synthesizer by men who had never synthesized anything.' },
        ],
      },
      {
        id: 'overclaim', label: 'Let your own name carry more than it earned',
        detail: 'Absorb the lineage. Grander now; evidence later.',
        requires: [],
        effects: { rep: { occult: 2, scholarly: 1 }, meters: { exposure: 1 }, memory: { sources_credit: 'overclaimed' } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'The book reads like revelation rather than scholarship, which serves it now. Somewhere a careful man is listing every unattributed borrowing, and his list has a future.',
            chronicle: 'He let the summa read as revelation, and a careful man somewhere began listing its unnamed debts.' },
        ],
      },
    ],
  },

  pivot_grimoire: {
    id: 'pivot_grimoire', phase: 4,
    rubric: 'THE CIRCLE \u00b7 THE POPULAR COMMISSION',
    grounding: 'PLAUSIBLE-GAP',
    source: 'VN c24; the Boon-for-the-Khan pattern \u2014 named-operation manuals for broad audiences \u2014 is attested a generation later',
    when: ['mem:investigations_begun'],
    affordances: ['manuscripts', 'merchants'],
    situation:
      'A bookseller\u2019s consortium makes a proposal with real money in it: not the summa \u2014 nobody can sell the summa \u2014 ' +
      'but a manual. Named operations, numbered steps, results promised: the vanishing inks, the wake-rites, the ' +
      'figures in sand. The kind of book that sells in every bazaar and follows its author into every courtroom.',
    options: [
      {
        id: 'accept_grimoire', label: 'Write the practical manual',
        detail: 'Reach and income. A hundred bazaars; also a hundred witnesses.',
        requires: ['rimiya>=1'],
        effects: { meters: { transmission: 3, exposure: 2 }, rep: { occult: 1, scholarly: -1 }, memory: { grimoire: 'wrote' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'It sells the way serious books dream of selling. Practitioners bless you, scholars wince, and the operations travel to towns that will never hear of the Investigations.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He wrote the sellers their manual of operations, and it reached towns his philosophy never would.' },
          { band: 'backfire', weight: 1, text: 'It sells \u2014 and within two years a village fraud is working your named operations badly under your name. The complaints address you as his teacher.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'His popular manual bred imitators, and their failures came home addressed to him.' },
        ],
      },
      {
        id: 'elite_version', label: 'Counter-offer the elite commission',
        detail: 'K\u012bmiy\u0101 standing lets you propose the expensive book instead: fewer buyers, better ones.',
        requires: ['kimiya>=2'],
        effects: { meters: { transmission: 1 }, rep: { occult: 2 }, memory: { grimoire: 'elite' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'A treatise on the noble operations, priced for princes, sold by subscription. Twelve copies, twelve serious owners, and your dignity intact at a profit.',
            effects: { rep: { imperial: 1 } },
            chronicle: 'He turned the bazaar commission into an elite treatise, twelve copies for twelve serious men.' },
        ],
      },
      {
        id: 'decline_grimoire', label: 'Decline the trade entirely',
        detail: 'The summa is the legacy. Keep the operations out of the bazaar.',
        requires: [],
        effects: { rep: { scholarly: 1 }, memory: { grimoire: 'declined' } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You decline. A generation later, someone else will write exactly this book and grow famous on it \u2014 a fact you will be spared knowing.',
            chronicle: 'He refused to write the bazaar its manual, and left that fortune for a later man.' },
        ],
      },
    ],
  },

  pivot_observatory: {
    id: 'pivot_observatory', phase: 4,
    rubric: 'THE OBSERVATORY RISING · ULUGH BEG BREAKS GROUND',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — 1420: Ulugh Beg begins the Samarkand observatory; star science and letter science boom together',
    affordances: ['astronomical_data', 'instruments'],
    plate: IMG('act2-persian-astrolabe.jpg', 'Persian astrolabe, brass (Wikimedia Commons)'),
    situation:
      'In Samarkand they are laying the foundations of the largest astronomical instrument on earth. The tables it ' +
      'produces will still be in use in London four centuries from now. Nobody there is thinking about lettrism — ' +
      'but the man building it wants exact knowledge of the heavens, and so, in your own way, do you.',
    options: [
      {
        id: 'contribute', label: 'Put your mathematics at their disposal',
        detail: 'Work on the tables. Anonymous, rigorous, and it ties your name to real science.',
        requires: ['access:astronomy'],
        boosts: ['person:yazdi', 'person:astronomer'],
        effects: { meters: { synthesis: 1 }, rep: { scholarly: 2 }, memory: { observatory_work: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Your computations go into the great tables unsigned. Centuries from now men in other countries will use numbers you checked, without ever hearing your name — which is a form of survival.',
            effects: { meters: { synthesis: 1, transmission: 1 } },
            chronicle: 'His arithmetic went unsigned into the Samarkand tables, and outlived every argument about him.' },
          { band: 'success', weight: 1, text: 'Solid work, gratefully received. The astronomers now regard you as a colleague who happens to have odd interests.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'He worked on the Samarkand tables and was accepted there as a mathematician first.' },
        ],
      },
      {
        id: 'argue_union', label: 'Argue that star science and letter science are one enterprise',
        detail: 'Make the case to the astronomers themselves. If it lands, it is the whole thesis vindicated.',
        requires: ['meter:synthesis>=6'],
        effects: { meters: { exposure: 1 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Some of them see it. Not all, not officially — but the observatory’s own historian is on your side, and historians decide what a century was about.',
            effects: { meters: { synthesis: 2, transmission: 1 }, rep: { scholarly: 1, occult: 2 }, memory: { observatory_work: true, union_argued: true } },
            chronicle: 'At the rising observatory he argued that the science of stars and the science of letters were one enterprise, and some of the astronomers agreed.' },
          { band: 'ambiguous', weight: 2, text: 'Polite interest, no converts. They go back to their instruments; you go back to your tables; both of you are measuring the same sky.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'The astronomers heard his case for one science and returned, politely, to their instruments.' },
        ],
      },
      {
        id: 'stay_away', label: 'Stay at your desk',
        detail: 'Samarkand is a distraction. The summa will not write itself.',
        requires: [],
        effects: { meters: { synthesis: 2 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You keep working. The greatest observatory in the world goes up without you, and your book gets better.',
            chronicle: 'He stayed at his desk while the observatory rose without him.' },
        ],
      },
    ],
  },

  pivot_departure: {
    id: 'pivot_departure', phase: 4,
    rubric: 'THE FIRST SUMMONS · A TRIBUNAL SENDS FOR YOU',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — three state inquisitions, engineered by jealous rival colleagues, from the 1420s',
    affordances: ['legal_authority'],
    situation:
      'It arrives with a seal and a date: you are required to answer questions concerning your doctrine. It is not, ' +
      'yet, a trial. It has been engineered by colleagues — men who know exactly what to quote, because you wrote it ' +
      'down and let it circulate. The rest of your life begins with this letter.',
    options: [
      {
        id: 'go_prepared', label: 'Go, and prepare a full defense',
        detail: 'Answer the summons on its own terms, with everything you have.',
        requires: [],
        effects: { memory: { trial_stance: 'defend' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You spend the last free season assembling authorities, precedents, and creeds. Whatever else happens, they will have to argue with you.',
            chronicle: 'He answered the first summons with a defense prepared in full.' },
        ],
      },
      {
        id: 'go_patron', label: 'Go, but send to your patron first',
        detail: 'Spend political protection before spending arguments.',
        requires: ['rep:imperial>=2'],
        effects: { memory: { trial_stance: 'patron' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'Word goes to the household that pays you. Protection is a real thing; it is also a debt, and debts are collected.',
            chronicle: 'Summoned, he sent first to his patron and then to his books.' },
        ],
      },
      {
        id: 'go_quiet', label: 'Go quietly, and concede whatever is cheap',
        detail: 'Give them small things early. Survive the first one; think about the rest later.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { trial_stance: 'concede' } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You decide in advance which formulations you can live without. It is prudent, and it establishes that you can be moved.',
            chronicle: 'He went to the first tribunal prepared to concede whatever was cheap.' },
        ],
      },
    ],
  },
};
