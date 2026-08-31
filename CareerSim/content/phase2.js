// phase2.js — Phase II: Isfahan, The Judge's City (c. 1397–1409).
// The phase where the career acquires a day job. The judgeship is honorable, real,
// and a permanent tax on the life's work — that competition IS this phase.

export const PHASE = {
  id: 2,
  name: 'ISFAHAN — THE JUDGE’S CITY',
  dateline: 'c. 1397–1409',
  time: 8,
  intro:
    'Home. The Turka family has held judicial office in Isfahan for generations, and the office is waiting for you — ' +
    'a career with a salary, a bench, and no hours left over. Everything you learned in Cairo is now a private matter, ' +
    'unless you decide otherwise. Eight seasons before the courts of the princes start sending for men like you.',
};

const IMG = (file, caption) => ({ src: '../assets/manuscripts/' + file, caption });

export const NODES = [
  {
    id: 'tribunal', name: 'The Tribunal', icon: '⚖',
    hook: 'The qāḍī’s court of Isfahan — your family’s bench, and possibly yours.',
    encounters: ['isfahan_appointment', 'isfahan_weak_litigant', 'isfahan_sorcery_trial'],
  },
  {
    id: 'house', name: 'The Family House', icon: '🏠',
    hook: 'Kin, expectations, and a library nobody else in the house reads.',
    encounters: ['isfahan_inheritance', 'isfahan_deputy'],
  },
  {
    id: 'scriptorium', name: 'The Warrāq’s Shop', icon: '🖋',
    hook: 'A copyist who will duplicate anything you hand him. Circulation starts here.',
    encounters: ['isfahan_copyists', 'isfahan_inks', 'isfahan_first_treatise'],
  },
  {
    id: 'mosque', name: 'The Friday Mosque', icon: '🕌',
    hook: 'Where the city’s orthodoxy is spoken aloud, weekly, to everyone.',
    encounters: ['isfahan_preacher', 'isfahan_nativity'],
  },
  {
    id: 'study', name: 'Your Own Study', icon: '🕮',
    hook: 'Lamp, paper, and the connections nobody has drawn yet.',
    encounters: ['isfahan_study_one', 'isfahan_study_two', 'isfahan_qasim_letter'],
  },
  {
    id: 'depart2', name: 'The Summons', icon: '🐎', departure: true,
    hook: 'A prince’s court is asking for you. Leave Isfahan — and decide what the office was worth.',
    encounters: ['isfahan_departure'],
  },
];

export const ENCOUNTERS = {
  isfahan_appointment: {
    id: 'isfahan_appointment', phase: 2,
    rubric: 'THE TRIBUNAL · THE OFFICE OFFERED',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Vitals: Chief Judge (qāḍī) of Isfahan',
    affordances: ['legal_authority', 'public_office'],
    situation:
      'The bench your father sat on is open, and the city expects a Turka on it. The office pays, protects, and ' +
      'confers the one credential no accusation slides off easily: you would be a judge, not merely a man with opinions.',
    options: [
      {
        id: 'accept', label: 'Take the judgeship',
        detail: 'Salary, standing, and a permanent claim on your hours.',
        requires: [],
        effects: {
          rep: { orthodox: 2, scholarly: 1 }, access: ['judiciary'],
          memory: { kept_judgeship: true, took_judgeship: true },
        },
        grantsObligation: {
          id: 'judgeship', name: 'The Judgeship', cost: 1,
          gloss: 'The tribunal sits whether or not you are writing. One season in every action.',
          neglect: { rep: { orthodox: -1 }, memory: { neglected_bench: true } },
        },
        outcomes: [
          { band: 'success', weight: 1, text: 'You are invested as qāḍī of Isfahan. The docket is already full.',
            chronicle: 'He took his father’s bench and became a judge of Isfahan.' },
        ],
      },
      {
        id: 'refuse', label: 'Refuse the bench',
        detail: 'Keep every hour for the work. Lose the shield the office would have been.',
        requires: [],
        effects: { rep: { orthodox: -1, scholarly: 1 }, meters: { synthesis: 1 }, memory: { refused_judgeship: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The city is puzzled; your kin are worse than puzzled. Your hours, though, are your own.',
            chronicle: 'He declined the judgeship of Isfahan, and kept his hours for the work.' },
        ],
      },
      {
        id: 'defer', label: 'Serve, but seek a deputy first',
        detail: 'Take the office and immediately find someone to carry half of it.',
        requires: ['rep:scholarly>=2'],
        effects: {
          rep: { orthodox: 1 }, access: ['judiciary'], people: ['deputy'],
          memory: { kept_judgeship: true, took_judgeship: true, has_deputy: true },
        },
        grantsObligation: {
          id: 'judgeship', name: 'The Judgeship (deputized)', cost: 1,
          gloss: 'Your deputy holds most of the docket. The office still wants one season in every action.',
          neglect: { rep: { orthodox: -1 } },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You take the bench and a capable junior at the same time. The docket moves without you in the room.',
            effects: { meters: { synthesis: 1 } },
            chronicle: 'He accepted the bench and at once found a deputy to hold it, buying back his own hours.' },
          { band: 'qualified', weight: 1, text: 'The deputy is competent. Competent men have ambitions of their own.',
            chronicle: 'He took the bench and a deputy with it, and did not yet ask what the deputy wanted.' },
        ],
      },
    ],
  },

  isfahan_weak_litigant: {
    id: 'isfahan_weak_litigant', phase: 2,
    rubric: 'THE TRIBUNAL · A POWERFUL MAN AND A POOR ONE',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — known specifically as a judge who defended the weak against the powerful',
    when: ['mem:took_judgeship'],
    affordances: ['legal_authority', 'public_audience'],
    situation:
      'A landowner with friends at the governor’s house has taken a smallholder’s water rights. The law is not ambiguous. ' +
      'The landowner’s expectation that this will not matter is also not ambiguous.',
    options: [
      {
        id: 'rule_justly', label: 'Rule for the smallholder',
        detail: 'The law as written. It will cost you a friend you do not have yet.',
        requires: [],
        effects: { rep: { orthodox: 1, scholarly: 1 }, memory: { defended_weak: true } },
        outcomes: [
          { band: 'triumph', weight: 2, text: 'The ruling is clean and public. Within a month, three more poor litigants file — and one powerful house begins keeping a ledger on you.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He gave judgment for the smallholder against the landowner, and the city learned what kind of judge he was.' },
          { band: 'success', weight: 1, text: 'You rule correctly and quietly. Justice done; enemy acquired at a discount.',
            chronicle: 'He ruled against the powerful man, and the powerful man remembered it.' },
        ],
      },
      {
        id: 'mediate', label: 'Force a settlement instead',
        detail: 'Both sides walk away irritated and intact. No enemy, no precedent.',
        requires: [],
        effects: { memory: { mediated_case: true } },
        outcomes: [
          { band: 'qualified', weight: 2, text: 'Water is shared, faces are saved, nobody is satisfied. The smallholder gets less than the law owed him.',
            chronicle: 'He brokered a settlement where the law would have given a clearer verdict.' },
        ],
      },
      {
        id: 'favor', label: 'Rule for the landowner and bank the favor',
        detail: 'A powerful house owes you. That is a real asset, honestly obtained by dishonest means.',
        requires: [],
        effects: { rep: { imperial: 1, orthodox: -1, scholarly: -1 }, memory: { sold_a_verdict: true } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'The landowner is grateful and says so at the governor’s table. Your clerks are very quiet for a week.',
            chronicle: 'He found for the landowner, and a powerful house counted him a friend.' },
        ],
      },
    ],
  },

  isfahan_sorcery_trial: {
    id: 'isfahan_sorcery_trial', phase: 2,
    rubric: 'THE TRIBUNAL · AN ACCUSATION OF SORCERY',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — occult jurisprudence; the specific case is constructed',
    when: ['mem:took_judgeship'],
    affordances: ['legal_authority', 'public_audience', 'evidence_table'],
    plate: IMG('c23-arab-figures-classification.jpg', 'Arabic diagram of geomantic figures classification, 15th c. (Wikimedia Commons)'),
    situation:
      'A man is charged with sorcery. On the evidence table: sand-boards, a chart of figures, a client list. You are ' +
      'the one judge in Isfahan who can tell at a glance that this is geomancy — a technical craft, badly practiced. ' +
      'Saying so out loud tells the room how you know.',
    options: [
      {
        id: 'acquit_technical', label: 'Acquit on the technical ground',
        detail: 'Explain what the evidence actually is. Everyone learns you can read it.',
        requires: ['cap:geomancy'],
        effects: { meters: { exposure: 2 }, rep: { occult: 1 }, memory: { defended_occultist: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You take the court through the figures like a grammar lesson. The man walks free. So does the knowledge of what his judge knows.',
            effects: { rep: { scholarly: 1 }, meters: { demonstration: 1 } },
            chronicle: 'He acquitted a geomancer by explaining geomancy to the court, and taught the court something about himself.' },
          { band: 'backfire', weight: 1, text: 'The acquittal holds. So does a new sentence in the city’s gossip: the judge knows these arts from the inside.',
            effects: { rep: { orthodox: -1 } },
            chronicle: 'His acquittal of an accused sorcerer was correct in law and disastrous in rumor.' },
        ],
      },
      {
        id: 'acquit_procedural', label: 'Acquit on procedure — say nothing about the craft',
        detail: 'The witnesses are inadequate. That is enough, and it reveals nothing.',
        requires: [],
        effects: { memory: { acquitted_quietly: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Insufficient testimony; case dismissed. The man goes home, the room learns nothing, and you sleep well enough.',
            chronicle: 'He freed the accused on the testimony, and let the court believe he knew nothing of the art.' },
          { band: 'qualified', weight: 1, text: 'Dismissed — but the prosecutor files again next season with better witnesses, and you will face this twice.',
            chronicle: 'He dismissed the sorcery charge on procedure, postponing rather than settling it.' },
        ],
      },
      {
        id: 'convict', label: 'Convict him',
        detail: 'Distance yourself decisively. It is a defensible verdict and an ugly one.',
        requires: [],
        effects: { rep: { orthodox: 2, occult: -2 }, memory: { convicted_occultist: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The conviction is upheld and applauded. Every practitioner in Isfahan now knows exactly which judge to fear.',
            chronicle: 'He convicted an accused sorcerer, and bought his own safety with another man’s.' },
        ],
      },
    ],
  },

  isfahan_inheritance: {
    id: 'isfahan_inheritance', phase: 2,
    rubric: 'THE FAMILY HOUSE · WHAT THE HOUSE EXPECTS',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — the Turka family judicial line; the domestic scene is constructed',
    affordances: ['family', 'library'],
    situation:
      'Your kin want to know what Cairo was for. There is a family library of law and hadith, a family reputation, ' +
      'and a family assumption that the strange years abroad are now concluded.',
    options: [
      {
        id: 'reassure', label: 'Tell them what they want to hear',
        detail: 'Cairo was training. Nothing more. The house relaxes.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { family_reassured: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'The house is satisfied and the doors of Isfahan’s respectable society stay open.',
            chronicle: 'He let his family believe the Cairo years had been an ordinary education.' },
        ],
      },
      {
        id: 'recruit', label: 'Tell them the truth and ask for the library',
        detail: 'Make the family an asset instead of an audience. Risky; they vote.',
        requires: [],
        boosts: ['rep:scholarly>=2'],
        effects: { memory: { family_told: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'An uncle turns out to have wondered the same things for thirty years. The library, and a modest allowance, are yours.',
            effects: { meters: { synthesis: 2 }, access: ['family_library'] },
            chronicle: 'He told his kin what he had actually studied, and found an ally where he expected a lecture.' },
          { band: 'backfire', weight: 2, text: 'The word "lettrist" lands badly at a family dinner. Doors do not slam; they simply stop opening.',
            effects: { rep: { orthodox: -1 } },
            chronicle: 'He told his family the truth about the Cairo years, and the house grew cooler by a degree.' },
        ],
      },
    ],
  },

  isfahan_deputy: {
    id: 'isfahan_deputy', phase: 2,
    rubric: 'THE FAMILY HOUSE · YOUR DEPUTY WANTS SOMETHING',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Constructed; delegation of judicial work is standard practice',
    when: ['mem:has_deputy'],
    affordances: ['legal_authority'],
    situation:
      'Your deputy has been running the docket well enough that the city half-thinks he is the judge. He would like ' +
      'that to be formalized — or at least, he would like you to notice that he could make it awkward if it is not.',
    options: [
      {
        id: 'promote', label: 'Give him the docket outright',
        detail: 'Buy your time back permanently. The bench becomes a title you hold, not a job you do.',
        requires: [],
        effects: { memory: { docket_delegated: true }, rep: { orthodox: -1 } },
        dropsObligation: 'judgeship',
        outcomes: [
          { band: 'success', weight: 1, text: 'He takes the work; you keep the name. Your seasons are suddenly your own again — and the office protects you slightly less than it did.',
            chronicle: 'He handed the docket of Isfahan to his deputy and kept only the title.' },
        ],
      },
      {
        id: 'refuse_deputy', label: 'Remind him whose bench it is',
        detail: 'Keep the office whole. Keep the time cost too.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { deputy_checked: true } },
        outcomes: [
          { band: 'qualified', weight: 2, text: 'He apologizes smoothly and continues exactly as before, minus the warmth.',
            chronicle: 'He reminded his deputy who held the bench, and gained an efficient man who no longer liked him.' },
          { band: 'backfire', weight: 1, text: 'He apologizes — and mentions to someone at the governor’s house how much of the qāḍī’s time goes to his books.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'His slighted deputy began mentioning, in useful places, how the judge spent his evenings.' },
        ],
      },
    ],
  },

  isfahan_copyists: {
    id: 'isfahan_copyists', phase: 2,
    rubric: 'THE WARRĀQ’S SHOP · A MAN WHO COPIES ANYTHING',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — manuscript culture; this copyist is constructed',
    affordances: ['manuscripts', 'merchants'],
    situation:
      'The warrāq works fast, charges fairly, and has never once asked what a text is for. Everything you have written ' +
      'so far exists in exactly one copy, in your own hand, in a house that could burn.',
    options: [
      {
        id: 'commission_copies', label: 'Commission copies of your notes',
        detail: 'Transmission begins with a second copy existing at all.',
        requires: [],
        effects: { people: ['copyist'], meters: { transmission: 1 }, memory: { copyist_engaged: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Two clean copies inside a month. One stays with you; one goes into a chest at your uncle’s.',
            chronicle: 'He put his notes into a copyist’s hands, and his work existed in more than one place for the first time.' },
          { band: 'qualified', weight: 1, text: 'Good copies — with three transcription errors in the letter-tables that you will be correcting for a decade.',
            effects: { memory: { corrupt_copies: true } },
            chronicle: 'The first copies of his tables went out with errors he would spend years chasing.' },
        ],
      },
      {
        id: 'copy_yourself', label: 'Copy everything in your own hand',
        detail: 'Slower, safer, and no stranger has read a line of it.',
        requires: [],
        effects: { memory: { hoarded: true }, meters: { synthesis: 1 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'Seasons of copying. The work is exact, secure, and read by precisely one person.',
            chronicle: 'He copied his own work in his own hand, and let no stranger read a line of it.' },
        ],
      },
    ],
  },

  isfahan_inks: {
    id: 'isfahan_inks', phase: 2,
    rubric: 'THE WARRĀQ’S SHOP · THE INK THAT EATS THE PAGE',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Artisanal-epistemology layer (DESIGN.md, after Pamela Smith); iron-gall ink corrosion is real period chemistry',
    when: ['mem:copyist_engaged'],
    affordances: ['manuscripts', 'workshop'],
    situation:
      'The warrāq shows you a ruined quire: last year’s copies, the ink gone brown and the paper crumbling where the ' +
      'strokes ran thickest. Iron-gall ink, badly compounded, is slowly eating your own words. He knows you studied ' +
      'strange arts in Cairo. He is asking, without quite asking, whether any of them were useful ones.',
    options: [
      {
        id: 'compound', label: 'Compound a stable ink yourself',
        detail: 'Kīmiyā at its least glamorous: gall, vitriol, gum, and exact proportion.',
        requires: ['kimiya>=1'],
        effects: { meters: { demonstration: 1 }, memory: { inks_solved: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Three batches, one that holds. The warrāq watches you work the proportions like a recipe and revises his opinion of Cairo entirely. Your copies will outlive their rivals’ — literally.',
            effects: { meters: { transmission: 1 }, rep: { occult: 1 } },
            chronicle: 'He compounded the warrāq’s ink himself, and his copies outlasted other men’s books.' },
          { band: 'success', weight: 2, text: 'The new batch holds. It is the least mystical thing the furnace ever taught you, and among the most useful.',
            chronicle: 'The furnace-craft of Cairo resurfaced as a copyist’s ink, and the pages stopped eating themselves.' },
        ],
      },
      {
        id: 'source_it', label: 'Find him a better supplier',
        detail: 'No chemistry, just diligence. Solves today; teaches nothing.',
        requires: [],
        effects: { memory: { inks_sourced: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'A supplier in the dyers’ quarter mixes honestly. The problem is patched, not understood — which is how most problems in the world are handled.',
            chronicle: 'He found the warrāq honester ink, and left the chemistry of it unexamined.' },
        ],
      },
      {
        id: 'shrug', label: 'Paper is the copyist’s problem',
        detail: 'You are a judge with a book to write. Walk away.',
        requires: [],
        effects: { memory: { inks_ignored: true } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'You leave it. Years from now a reader will turn a page of your early work and hold a lace of holes up to the light.',
            chronicle: 'He left the ink problem to the tradesmen, and some of his earliest pages did not survive it.' },
        ],
      },
    ],
  },

  isfahan_first_treatise: {
    id: 'isfahan_first_treatise', phase: 2,
    rubric: 'THE WARRĀQ’S SHOP · THE FIRST THING WORTH CIRCULATING',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — his pre-1420 output; this specific treatise is constructed',
    when: ['mem:copyist_engaged'],
    affordances: ['manuscripts'],
    situation:
      'You have a short treatise finished: the letter-number correspondences, argued cleanly, with the theology left ' +
      'implicit. It is the first piece of the system that a stranger could actually use. The warrāq is waiting.',
    options: [
      {
        id: 'circulate_scholars', label: 'Circulate it among scholars only',
        detail: 'Send it where it will be argued with properly. Narrow, slow, sturdy.',
        requires: [],
        effects: { meters: { transmission: 1 }, rep: { scholarly: 2 }, memory: { first_treatise: 'scholarly' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Three replies within the year, two of them useful, one furious. That is what a discipline feels like.',
            effects: { meters: { synthesis: 1 } },
            chronicle: 'His first treatise went out to the learned, and came back with objections worth answering.' },
          { band: 'triumph', weight: 1, text: 'A scholar in Shiraz writes asking to be taught. Your first correspondent is your first node.',
            effects: { meters: { transmission: 1 }, rep: { occult: 1 } },
            chronicle: 'His first circulated treatise won him a correspondent in Shiraz and the beginnings of a network.' },
        ],
      },
      {
        id: 'circulate_wide', label: 'Let it circulate freely',
        detail: 'Anyone who wants a copy gets one. Reach now, control never.',
        requires: [],
        effects: { meters: { transmission: 2, exposure: 1 }, rep: { occult: 1 }, memory: { first_treatise: 'wide', taught_widely: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'It travels. Within two years you meet a man in a bazaar quoting it at you, slightly wrong, with total confidence.',
            chronicle: 'His first treatise circulated freely, and began being quoted by men he had never met.' },
          { band: 'backfire', weight: 1, text: 'It travels — into the hands of a preacher who reads three lines aloud in the worst possible tone.',
            effects: { meters: { exposure: 1 }, rep: { orthodox: -1 } },
            chronicle: 'His treatise reached a hostile pulpit before it reached a friendly scholar.' },
        ],
      },
      {
        id: 'withhold', label: 'Burn the fair copy and keep working',
        detail: 'It is not ready. Nothing goes out under your name that you would have to defend.',
        requires: [],
        effects: { meters: { synthesis: 1 }, memory: { hoarded: true, withheld_treatise: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The treatise goes into the fire and the argument goes back into the notebook, improved.',
            chronicle: 'He burned his first fair copy rather than circulate an argument he could not yet defend.' },
        ],
      },
    ],
  },

  isfahan_preacher: {
    id: 'isfahan_preacher', phase: 2,
    rubric: 'THE FRIDAY MOSQUE · A SERMON AGAINST THE LETTER-MEN',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — the orthodoxy/lettrism tension; this sermon is constructed',
    affordances: ['public_audience', 'religious_authority'],
    situation:
      'The Friday preacher spends a quarter of an hour on men who claim the letters of the Qurʾan hide a mathematics. ' +
      'He does not name you. He does not need to; two rows of heads have already half-turned.',
    options: [
      {
        id: 'answer_publicly', label: 'Answer him after the prayer, in front of everyone',
        detail: 'Meet it head-on as a jurist. High risk, high clarity.',
        requires: ['rep:orthodox>=1'],
        effects: { meters: { exposure: 2 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You distinguish theoretical lettrism from street magic so cleanly that the preacher concedes the distinction publicly. It is quoted for years.',
            effects: { rep: { orthodox: 1, scholarly: 2, occult: 1 }, memory: { public_defense_won: true } },
            chronicle: 'He answered the Friday preacher on the mosque floor and won the distinction he needed in public.' },
          { band: 'ambiguous', weight: 2, text: 'You argue well. He argues loudly. The congregation splits along lines it did not know it had.',
            effects: { rep: { scholarly: 1, orthodox: -1 }, memory: { public_defense_drawn: true } },
            chronicle: 'His answer to the preacher divided the congregation and settled nothing.' },
          { band: 'backfire', weight: 1, text: 'You are correct, thorough, and now the man with a grievance is a preacher with an audience.',
            effects: { rep: { orthodox: -2 }, meters: { exposure: 1 }, memory: { preacher_enemy: true } },
            chronicle: 'By answering the preacher he made a weekly enemy with a pulpit.' },
        ],
      },
      {
        id: 'private_word', label: 'Seek him privately afterward',
        detail: 'Persuade one man instead of a hall. Quiet, slow, sometimes it works.',
        requires: [],
        boosts: ['himiya>=1'],
        effects: {},
        outcomes: [
          { band: 'success', weight: 2, text: 'Over tea he turns out to be objecting to charlatans, not to you. Next Friday the sermon is subtly narrower.',
            effects: { rep: { orthodox: 1 }, memory: { preacher_neutralized: true } },
            chronicle: 'He took the hostile preacher aside, and the following Friday’s sermon was quieter.' },
          { band: 'qualified', weight: 2, text: 'He is polite, immovable, and now knows your face and your interest.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'His private approach to the preacher changed nothing except that the preacher now knew him.' },
        ],
      },
      {
        id: 'sit_still', label: 'Sit through it',
        detail: 'Say nothing. Be seen saying nothing. Perfectly safe, and everyone notices.',
        requires: [],
        effects: { memory: { endured_sermon: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You sit. The sermon ends. Two men who were watching your face draw their own conclusions.',
            chronicle: 'He sat unmoving through a sermon against his own science.' },
        ],
      },
    ],
  },

  isfahan_nativity: {
    id: 'isfahan_nativity', phase: 2,
    rubric: 'ISFAHAN · A MERCHANT WANTS HIS SON’S NATIVITY READ',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — astrological practice; this client is constructed',
    affordances: ['private_audience', 'astronomical_data'],
    plate: IMG('cs-p2-mawalid-nativity.jpg', 'Astrological figure from a Book of Nativities, after Abū Maʿshar al-Balkhī (Wikimedia Commons)'),
    situation:
      'A wealthy merchant wants to know whether his son should be sent into trade or into the law. He is offering ' +
      'good money for a nativity. He is also, without meaning to, offering you your first paying client as a practitioner.',
    options: [
      {
        id: 'cast_it', label: 'Cast the nativity properly',
        detail: 'Real computation, honest reading, fair fee.',
        requires: ['access:astronomy'],
        effects: { meters: { demonstration: 1 }, rep: { occult: 1 }, memory: { casts_nativities: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'The chart is sound and the advice is sensible. He tells four friends, all of whom have sons.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'He cast a merchant’s son’s nativity, and quietly acquired a practice.' },
          { band: 'triumph', weight: 1, text: 'Your reading is precise enough that he sends the boy to the law, and the boy flourishes. That story circulates for twenty years.',
            effects: { meters: { demonstration: 1, exposure: 1 }, rep: { occult: 1 } },
            chronicle: 'A nativity he cast in Isfahan was still being cited as proof of his art two decades later.' },
        ],
      },
      {
        id: 'lettrist_reading', label: 'Read the boy’s name, not his stars',
        detail: 'Lettrism instead of astrology — your own method, on a stranger, for money.',
        requires: ['limiya>=1'],
        effects: { meters: { demonstration: 1, exposure: 1 }, rep: { occult: 2 }, memory: { casts_nativities: true, name_reading: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You take the letters of the boy’s name apart in front of his father, who has never seen anything like it and says so, everywhere.',
            chronicle: 'He read a merchant’s son by the letters of his name, and Isfahan began to talk about the method.' },
          { band: 'ambiguous', weight: 1, text: 'The merchant is dazzled but unsure what he bought. He pays, and repeats a garbled version of it at every dinner.',
            chronicle: 'His first paid name-reading was admired and thoroughly misunderstood.' },
        ],
      },
      {
        id: 'refuse_fee', label: 'Advise him as a judge, and take nothing',
        detail: 'Give the boy sound counsel with no stars in it. No fee, no practice, no exposure.',
        requires: [],
        effects: { rep: { orthodox: 1 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You tell him to ask the boy. The merchant leaves obscurely disappointed and entirely safe to know.',
            chronicle: 'Asked for a nativity, he gave a judge’s advice and refused the fee.' },
        ],
      },
    ],
  },

  isfahan_study_one: {
    id: 'isfahan_study_one', phase: 2,
    rubric: 'YOUR OWN STUDY · THE LETTERS AND THE NUMBERS',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — mathematization of the cosmos; lettrism as universal science',
    affordances: ['library', 'quiet'],
    situation:
      'A long night with the tables. The correspondence between letter-values and the ratios in a musical interval ' +
      'is either the deepest thing you have ever noticed or an artifact of your own arithmetic. There is one way to find out.',
    options: [
      {
        id: 'push', label: 'Work it through to the end',
        detail: 'Seasons of arithmetic to prove or kill the connection.',
        requires: [],
        boosts: ['person:yazdi', 'access:family_library', 'artifact:letter_grid_ms'],
        effects: { meters: { synthesis: 2 } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'It holds. Letters, ratios, the harmonic intervals — one architecture, and you can show the working.',
            effects: { meters: { synthesis: 1 }, memory: { harmonic_link: true } },
            chronicle: 'In his Isfahan study he proved to his own satisfaction that letter and interval obey one mathematics.' },
          { band: 'qualified', weight: 2, text: 'Most of it holds. The part that does not will nag at you for fifteen years.',
            chronicle: 'He worked the letter-ratios through, and left one stubborn exception unresolved.' },
        ],
      },
      {
        id: 'set_aside', label: 'Note it and move on',
        detail: 'The docket will not wait. Write it down for a better decade.',
        requires: [],
        effects: { meters: { synthesis: 1 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'Into the notebook it goes, with a marginal note you will find again in 1420.',
            chronicle: 'He noted the harmonic correspondence and set it aside for a freer year.' },
        ],
      },
    ],
  },

  isfahan_study_two: {
    id: 'isfahan_study_two', phase: 2,
    rubric: 'YOUR OWN STUDY · THE MYSTERIOUS LETTERS',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Qurʾanic letter-groups (muqaṭṭaʿāt) in the lettrist tradition; Yazdī’s practice',
    when: ['meter:synthesis>=3'],
    affordances: ['library', 'quiet'],
    situation:
      'The disconnected letters that open certain sūras — alif lām mīm, ṭā hā — have defeated commentary for eight ' +
      'centuries. Every exegete says they are a divine secret. You are increasingly sure they are a divine *notation*.',
    options: [
      {
        id: 'systematize', label: 'Treat them as notation and build the system on them',
        detail: 'The boldest move available: make the unexplained letters your foundation stone.',
        requires: ['limiya>=2'],
        effects: { meters: { synthesis: 2, exposure: 1 }, rep: { occult: 1 }, memory: { muqattaat_system: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The letter-groups resolve into a key. What was a mystery in every commentary becomes, in your notebook, a working part.',
            effects: { meters: { synthesis: 1 } },
            chronicle: 'He took the mysterious opening letters of the Qurʾan not as a secret to be revered but as a notation to be used.' },
          { band: 'ambiguous', weight: 2, text: 'You have a system that works and an argument that will horrify every traditionist who hears it stated plainly.',
            effects: { rep: { orthodox: -1 } },
            chronicle: 'His treatment of the mysterious letters was elegant, functional, and certain to enrage the literalists.' },
        ],
      },
      {
        id: 'reverent', label: 'Handle them reverently and stay inside commentary',
        detail: 'Say what the tradition says. Lose the foundation stone; keep the peace.',
        requires: [],
        effects: { rep: { orthodox: 1 }, meters: { synthesis: 1 } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You write a careful, orthodox, unremarkable page on the letter-groups, and know exactly what you left out of it.',
            chronicle: 'He wrote on the mysterious letters within the bounds of commentary, and left his real thought unwritten.' },
        ],
      },
    ],
  },

  isfahan_qasim_letter: {
    id: 'isfahan_qasim_letter', phase: 2,
    rubric: 'YOUR OWN STUDY · A LETTER FROM QĀSIM',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — the Qāsim-i Anvār friendship; this correspondence is constructed',
    when: ['person:qasim'],
    affordances: ['quiet'],
    situation:
      'Qāsim writes from the road: verses, gossip, and a request. He is gathering listeners faster than he can teach ' +
      'them, and he wants something of yours he can recite — the system in a form that sings.',
    options: [
      {
        id: 'send_verses', label: 'Send him the doctrine in verse',
        detail: 'Let it travel by voice. Enormous reach; no control at all.',
        requires: [],
        effects: { meters: { transmission: 2, exposure: 1 }, rep: { occult: 1 }, memory: { taught_widely: true, qasim_carries: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Within a year your cosmology is being sung in lodges from Tabriz to Herat by people who have never read a word of yours.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He sent Qāsim-i Anvār the doctrine in verse, and it began to travel by voice across Iran.' },
          { band: 'backfire', weight: 1, text: 'It spreads beautifully and inaccurately. Two of the verses say something you would never sign your name to.',
            effects: { meters: { transmission: 1 }, rep: { scholarly: -1 } },
            chronicle: 'The verses he sent Qāsim spread further and less exactly than he intended.' },
        ],
      },
      {
        id: 'send_prose', label: 'Send a careful prose exposition instead',
        detail: 'Precision over reach. He will be disappointed and will use it anyway.',
        requires: [],
        effects: { meters: { transmission: 1 }, rep: { scholarly: 1 }, memory: { qasim_carries: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'He writes back cheerfully that it is unsingable and that he will make do. He does.',
            chronicle: 'He sent Qāsim exact prose where verses were wanted, and Qāsim made do.' },
        ],
      },
      {
        id: 'decline_qasim', label: 'Send only friendship',
        detail: 'Warm letter, no doctrine. Protect him and yourself from the association.',
        requires: [],
        effects: { memory: { qasim_kept_clear: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You write four affectionate pages containing nothing quotable. He notices, and does not mention it.',
            chronicle: 'He wrote to Qāsim as a friend and sent him nothing a tribunal could read.' },
        ],
      },
    ],
  },

  isfahan_departure: {
    id: 'isfahan_departure', phase: 2,
    rubric: 'THE SUMMONS · A PRINCE SENDS FOR YOU',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — attachment to Iskandar Sultan’s court c. 1409',
    affordances: ['royal_summons'],
    situation:
      'A courier in Timurid livery, a sealed letter, and an invitation that is not really one: Iskandar Sultan, ' +
      'prince and governor of Fars, has heard there is a judge in Isfahan who reads more than law. The Isfahan years end here.',
    options: [
      {
        id: 'go_eager', label: 'Go, and bring the whole apparatus',
        detail: 'Books, tables, instruments, ambitions. Arrive as what you actually are.',
        requires: [],
        effects: { meters: { exposure: 1 }, rep: { imperial: 1 }, memory: { court_entry: 'open' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You ride south with three chests of paper and no intention of being anyone’s ornament.',
            chronicle: 'He went to Iskandar Sultan’s court openly, bringing his whole apparatus with him.' },
        ],
      },
      {
        id: 'go_careful', label: 'Go as a jurist, and let them discover the rest',
        detail: 'Arrive credentialed and unremarkable. Reveal the work when the room is right.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { court_entry: 'careful' } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You arrive as a judge of good family. What else you are can wait for a better evening.',
            chronicle: 'He came to the prince’s court as a jurist, and kept his other science in the baggage.' },
        ],
      },
      {
        id: 'go_with_network', label: 'Go, and bring your people',
        detail: 'A copyist, a correspondent, a friend. Arrive as a circle, not a man.',
        requires: ['meter:transmission>=2'],
        effects: { meters: { transmission: 1 }, rep: { imperial: 1 }, memory: { court_entry: 'circle' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You do not arrive at court. A small intellectual operation arrives at court, and you are its head.',
            effects: { meters: { synthesis: 1 } },
            chronicle: 'He came to the prince’s court not as a scholar but as the head of a working circle.' },
        ],
      },
    ],
  },
};
