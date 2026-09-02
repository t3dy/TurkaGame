// pressure.js — the exposure ladder as scenes: what the world does to a man it has
// begun to notice. These are INJECTED, not chosen — they pre-empt whatever node the
// player enters once their exposure threshold is crossed (engine.js:drawInjection),
// which is what makes Exposure the rebel fleet instead of a number that goes up
// (docs/ECONOMY.md §3). Each fires once per run, in whichever phase the threshold
// is first crossed; they carry no `phase` field on purpose.
//
// The ladder: rumor (Talked About, 3) → the request for a copy (Watched, 5) → the
// written denunciation (Denounced, 7). The tribunals themselves stay in phase5.js.
//
// Writing discipline per games/visual-novel/WRITING_GUIDE.md: each surfaces a real
// practice — unattributed doctrinal circulation, manuscript-request surveillance,
// the written charge that precedes proceedings ("engineered by rival colleagues"
// is the BIOGRAPHY's own language for Ibn Turka's tribunals).

export const ENCOUNTERS = {
  pressure_rumor: {
    id: 'pressure_rumor',
    rubric: 'THE BOOKSELLERS’ ROW · YOUR ARGUMENT COMES BACK',
    grounding: 'PLAUSIBLE-GAP',
    source: 'RESEARCH — unattributed circulation and distortion of occult doctrine; reputation travels ahead of texts',
    exposure_min: 3,
    affordances: ['street', 'strangers'],
    situation:
      'A bookseller, not knowing your face, offers to sell you your own argument. It has grown in the telling: what ' +
      'you framed as the mathematics of the alphabet is now the tale of a qāḍī who can read a man’s death in his name. ' +
      'He wants a good price for it. Your name is not on it, and that is exactly the problem.',
    options: [
      {
        id: 'correct', label: 'Correct it, there in the shop',
        detail: 'Give the real argument to a man whose trade is repeating things.',
        requires: [],
        effects: { rep: { scholarly: 1 }, meters: { exposure: 1 }, memory: { rumor_corrected: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'He listens the way booksellers listen — for what will sell. The true version is drier and travels slower, but it travels under your name now.',
            chronicle: 'He corrected his own legend in a bookshop, knowing the correction would never travel as far as the legend.' },
          { band: 'backfire', weight: 1, text: 'By evening the row knows the story walked in and argued for itself. You have improved the tale enormously.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He tried to correct a story about himself and became the best part of it.' },
        ],
      },
      {
        id: 'let_run', label: 'Let the story travel',
        detail: 'Distortion is a kind of circulation. Anonymity is a kind of armor.',
        requires: [],
        effects: { meters: { transmission: 1 }, memory: { rumor_let_run: true } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'You pay for the pages and leave. The story goes east without you, nameless and improving, and some of it is even true.',
            chronicle: 'He let a distorted version of his doctrine travel nameless, and it made better time than the true one.' },
        ],
      },
      {
        id: 'trace', label: 'Trace it to whoever is telling it',
        detail: 'The bench taught you how stories are moved. Find the mover.',
        requires: ['himiya>=1'],
        effects: { memory: { rumor_traced: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Three shops and a coffee-stall later you have him: a lapsed madrasa student retelling you for supper money. You buy the supper. By spring he is retelling you accurately, which is worth more than silence.',
            effects: { meters: { transmission: 1 }, rep: { occult: 1 } },
            chronicle: 'He traced a rumor to its teller and turned the teller into a student.' },
          { band: 'qualified', weight: 2, text: 'The trail is a chain of borrowings with no first mouth. But you now know the route stories take through this city, and that is its own map.',
            chronicle: 'He traced a rumor as far as rumors can be traced, and learned the roads they use instead.' },
        ],
      },
    ],
    memory_writes: [],
  },

  pressure_copy_request: {
    id: 'pressure_copy_request',
    rubric: 'A LETTER FROM NO ONE · THE REQUEST FOR A COPY',
    grounding: 'PLAUSIBLE-GAP',
    source: 'RESEARCH — manuscript request culture; a request for a copy was also the standard instrument of surveillance',
    exposure_min: 5,
    affordances: ['correspondence'],
    situation:
      'The letter is faultless: correct honorifics, good paper, a respectful request for a copy of your letter-work ' +
      '“for study,” signed by a name you cannot place in a city where you have no correspondent. Scholars ask each ' +
      'other for copies constantly. So do the men who keep files. The letter is written so that you cannot tell which.',
    options: [
      {
        id: 'send_full', label: 'Send the work entire',
        detail: 'A scholar who will not be read is not a scholar. Post it and be one.',
        requires: [],
        effects: { meters: { transmission: 1, exposure: 1 }, memory: { copy_sent: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Months later an objection comes back in the same hand — a real one, page-referenced, worth answering. A reader, then. Probably.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'He sent his work to a name he could not place, because circulation is the whole wager.' },
          { band: 'backfire', weight: 1, text: 'Nothing comes back. Nothing ever comes back. Years from now you will recognize your own sentences, read aloud in a formal voice, and know at last who wrote the letter.',
            effects: { memory: { copy_in_dossier: true } },
            chronicle: 'One of the copies he sent to strangers went into a file, and waited there for him.' },
        ],
      },
      {
        id: 'send_purged', label: 'Send a purged copy',
        detail: 'By now you know exactly which pages can travel and which cannot.',
        requires: ['meter:synthesis>=5'],
        effects: { meters: { transmission: 1 }, memory: { copy_purged: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'The copy that leaves your desk is sound, citable, and missing three arguments. A friend will find it cautious. An enemy will find nothing.',
            chronicle: 'He kept a purged copy for strangers — every page defensible, every page missing something.' },
          { band: 'qualified', weight: 1, text: 'You seal it knowing the purged version may be the one that survives you, and that it is not the book you meant.',
            chronicle: 'He sent the safe version of his science abroad, and wondered which version posterity would get.' },
        ],
      },
      {
        id: 'decline', label: 'Decline, courteously',
        detail: 'A refusal is also an answer, and it will also be filed.',
        requires: [],
        effects: { memory: { copy_declined: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You write three gracious sentences that say no. If the request was honest, you have lost a reader. If it was not, someone has noted that you know what your pages are worth.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He declined a stranger’s request for his work, and the refusal was filed as carefully as a copy would have been.' },
        ],
      },
    ],
    memory_writes: [],
  },

  pressure_denunciation: {
    id: 'pressure_denunciation',
    rubric: 'BEFORE ANY TRIBUNAL · THE ACCUSATION, IN WRITING',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — the tribunals were engineered by rival colleagues; the circulating written charge is the documented instrument of pressure short of trial',
    exposure_min: 7,
    affordances: ['correspondence', 'allies'],
    situation:
      'A friend brings it to you unsigned and already copied: a formal denunciation, naming no tribunal yet, listing ' +
      'your associations in order — Akhlāṭī’s circle, the letters, the nativities — like a man laying out tools. It is ' +
      'competently written. Whoever composed it has read you carefully, and means to be read in turn.',
    options: [
      {
        id: 'answer', label: 'Answer it, point by point, in writing',
        detail: 'Rehearse the whole defense early — at the price of making it a correspondence.',
        requires: [],
        effects: { rep: { scholarly: 1 }, meters: { exposure: 1 }, memory: { denunciation_answered: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Your reply is clean, sourced, and quotable, and it circulates farther than the charge. More usefully: you now possess your entire defense, in order, in your own hand.',
            chronicle: 'He answered an unsigned denunciation in writing, and rehearsed his whole defense years before any tribunal asked for it.' },
          { band: 'backfire', weight: 1, text: 'You have dignified it. Where there was one document there are now two, and copyists sell them as a set.',
            effects: { rep: { orthodox: -1 } },
            chronicle: 'He answered an anonymous charge and made it a correspondence.' },
        ],
      },
      {
        id: 'ignore', label: 'Say nothing',
        detail: 'An unsigned page deserves an unwritten reply.',
        requires: [],
        effects: { memory: { denunciation_ignored: true } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'Silence reads as confidence to your friends and as guilt to your enemies, and you do not get to choose which reading travels.',
            chronicle: 'A written denunciation circulated, and he met it with silence. Both survived.' },
        ],
      },
      {
        id: 'find_author', label: 'Find out who wrote it',
        detail: 'A patron’s household can learn who paid the copyists.',
        requires: ['rep:imperial>=2'],
        boosts: ['mem:rumor_traced'],
        effects: { memory: { denunciation_traced: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'A name comes back. A colleague — of course a colleague; the argument is too well-informed. You cannot use the name in public. You can use it every day in private, and now you will.',
            effects: { rep: { imperial: 1 } },
            chronicle: 'He learned which colleague had drafted the denunciation, and sat with him at three more banquets, knowing.' },
          { band: 'qualified', weight: 2, text: 'The trail ends at a warrāq who was paid in coin, asked no questions, and would copy your reply too if the price was fair.',
            chronicle: 'He traced the denunciation to a copyist who had only ever been loyal to the page in front of him.' },
        ],
      },
    ],
    memory_writes: [],
  },
};
