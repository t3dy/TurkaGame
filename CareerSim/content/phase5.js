// phase5.js — Phase V: The Trials (c. 1422–1432).
// Exposure comes due. Three inquisitions; historically he wins two and loses the
// third, then five years of wandering exile. Here that arc is reachable, not fixed.

export const PHASE = {
  id: 5,
  name: 'THE TRIALS',
  dateline: 'c. 1422–1432',
  time: 7,
  intro:
    'Everything that made you useful has made you visible, and visibility is the whole indictment. Three tribunals ' +
    'stand between you and an old age. Rivals engineered them; patrons may or may not spend themselves on you; and ' +
    'the only question the record will finally ask is what survived — you, or the system, or neither, or both.',
};

const IMG = (file, caption) => ({ src: '../assets/manuscripts/' + file, caption });

export const NODES = [
  {
    id: 'tribunal5', name: 'The Tribunal', icon: '⚖',
    hook: 'Where the doctrine is put on trial and you answer for it in person.',
    encounters: ['trial_first', 'trial_second', 'trial_third', 'trial_checkpoint'],
  },
  {
    id: 'protection', name: 'The Patron’s Door', icon: '👑',
    hook: 'Protection exists, costs something, and is not infinite.',
    encounters: ['trial_patron_shield', 'trial_recant_offer'],
  },
  {
    id: 'circle5', name: 'The Circle', icon: '✳',
    hook: 'Your people — some of whom are now liabilities, and some of whom are the only thing that outlives you.',
    encounters: ['trial_qasim_exile', 'trial_letters', 'trial_student_copy', 'trial_rival_book'],
  },
  {
    id: 'road5', name: 'The Road', icon: '🐪', departure: true,
    hook: 'End it. Exile, retirement, or whatever the tribunals have left you.',
    encounters: ['trial_end'],
  },
];

export const ENCOUNTERS = {
  trial_first: {
    id: 'trial_first', phase: 5,
    rubric: 'THE TRIBUNAL · THE FIRST INQUISITION',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — three state inquisitions engineered by rival colleagues; he wins the first two',
    affordances: ['legal_authority', 'public_audience', 'religious_authority'],
    plate: IMG('cs-p5-harut-marut.jpg', 'The fallen angels Hārūt and Mārūt, suspended at Babel — Iran, 16th–17th c. (Wikimedia Commons)'),
    situation:
      'The charge is framed around Qurʾan 2:102 and the angels at Babel who taught men magic: whatever you call your ' +
      'ʿilm al-ḥurūf, the prosecution says, this is what it descends from. Your accusers are colleagues. They have read you ' +
      'closely, which is the problem.',
    options: [
      {
        id: 'distinguish', label: 'Distinguish theoretical lettrism from sorcery',
        detail: 'The core legal argument: a mathematics of letters is not an operation on spirits.',
        requires: [],
        boosts: ['access:judiciary', 'rep:orthodox>=1', 'mem:public_defense_won'],
        effects: { memory: { first_inquisition: 'fought' } },
        outcomes: [
          { band: 'triumph', weight: 2, text: 'You hold the distinction for three hours and the panel accepts it. Acquitted — and every word of your defense is now a public document your enemies can study.',
            effects: { rep: { orthodox: 1, scholarly: 2 }, meters: { exposure: 1 }, memory: { first_inquisition: 'won' } },
            chronicle: 'At the first tribunal he separated the science of letters from sorcery, and was acquitted.' },
          { band: 'qualified', weight: 2, text: 'Acquitted, narrowly, on a distinction the panel accepts without enthusiasm. You are told, unofficially, to be less interesting.',
            effects: { meters: { exposure: 1 }, memory: { first_inquisition: 'won' } },
            chronicle: 'He survived the first inquisition on a distinction the panel accepted without warmth.' },
          { band: 'backfire', weight: 1, text: 'The distinction holds legally and fails politically. No verdict against you; no end to the matter either.',
            effects: { meters: { exposure: 2 }, rep: { orthodox: -1 }, memory: { first_inquisition: 'won' } },
            chronicle: 'The first tribunal could not convict him and did not clear him.' },
        ],
      },
      {
        id: 'creed', label: 'Answer with a creedal statement',
        detail: 'Give them orthodoxy in your own words — the apology as a genre.',
        requires: [],
        effects: { rep: { orthodox: 2 }, memory: { first_inquisition: 'creed', wrote_creed: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You write out a creed no jurist can fault, affirming everything required and abandoning nothing essential. The panel is satisfied and slightly disappointed.',
            effects: { memory: { first_inquisition: 'won' } },
            chronicle: 'He answered the first inquisition with a creed that satisfied the panel and conceded nothing that mattered.' },
          { band: 'qualified', weight: 1, text: 'It works. It also becomes the document against which everything you write afterward will be measured.',
            effects: { memory: { first_inquisition: 'won' } },
            chronicle: 'His creed cleared him, and became the measure his later work was held against.' },
        ],
      },
      {
        id: 'counterattack', label: 'Attack the accusers’ standing',
        detail: 'Name the jealousy. Aggressive, satisfying, and it escalates.',
        requires: ['access:judiciary'],
        effects: { meters: { exposure: 2 }, memory: { first_inquisition: 'won', counterattacked: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You demonstrate that your accusers are rivals with motives, and the panel dismisses. You have won, and you have taught them to build a better case next time.',
            effects: { rep: { scholarly: 1, orthodox: -1 } },
            chronicle: 'He broke the first indictment by exposing his accusers’ motives, and taught them to prepare better.' },
        ],
      },
    ],
  },

  trial_second: {
    id: 'trial_second', phase: 5,
    rubric: 'THE TRIBUNAL · THE SECOND INQUISITION',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — he wins the first two inquisitions; exact years not established in sources in hand',
    when: ['mem:first_inquisition=won'],
    exposure_min: 4,
    affordances: ['legal_authority', 'public_audience', 'religious_authority'],
    situation:
      'They have learned. This time the charge quotes your own circulated work back at you, in context, with the ' +
      'difficult passage on the board. There is no procedural escape from a quotation you actually wrote.',
    options: [
      {
        id: 'defend_text', label: 'Defend the passage as written',
        detail: 'Stand on the text. Explain what it means and refuse to disown it.',
        requires: [],
        boosts: ['meter:synthesis>=6', 'rep:scholarly>=3', 'artifact:investigations'],
        effects: { meters: { exposure: 1 }, memory: { second_inquisition: 'fought' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You take the panel through the passage until the difficulty dissolves into the argument it belongs to. Acquitted, and two of the panel ask for copies afterward.',
            effects: { rep: { scholarly: 2, occult: 1 }, meters: { transmission: 1 }, memory: { second_inquisition: 'won' } },
            chronicle: 'At the second tribunal he defended the disputed passage until his judges asked for copies of it.' },
          { band: 'qualified', weight: 2, text: 'Acquitted. The passage stands, your standing does not improve, and a third file is opened before you leave the building.',
            effects: { meters: { exposure: 1 }, memory: { second_inquisition: 'won' } },
            chronicle: 'He survived the second inquisition intact, and a third file was opened the same week.' },
          { band: 'backfire', weight: 1, text: 'You defend it too well. The panel cannot convict and will not clear; the matter is referred upward, which is how a third tribunal is built.',
            effects: { meters: { exposure: 2 }, memory: { second_inquisition: 'won', referred_upward: true } },
            chronicle: 'His defense was too able to be answered and too dangerous to be accepted; the matter went upward.' },
        ],
      },
      {
        id: 'patron_intervene', label: 'Let your patron end it',
        detail: 'Political protection instead of argument. Fast, humiliating, and it spends real capital.',
        requires: ['rep:imperial>=2'],
        effects: { rep: { imperial: -2 }, memory: { second_inquisition: 'won', patron_spent: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'A word from the household and the proceedings evaporate. Everyone understands exactly what happened, including you.',
            chronicle: 'The second inquisition ended not by argument but by a word from his patron’s household.' },
          { band: 'ambiguous', weight: 1, text: 'It ends. Your patron notes the cost aloud, once, in a tone you will remember for years.',
            effects: { rep: { imperial: -1 } },
            chronicle: 'His patron ended the second inquisition, and mentioned the cost of it exactly once.' },
        ],
      },
      {
        id: 'partial_recant', label: 'Disown the passage',
        detail: 'Sacrifice one formulation to save the whole. Survivable. Corrosive.',
        requires: [],
        effects: { rep: { orthodox: 2, occult: -1, scholarly: -1 }, memory: { second_inquisition: 'won', partial_recant: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'You withdraw the passage in writing and the case collapses. Your students hear about it before you get home.',
            chronicle: 'He disowned the disputed passage in writing, and his students heard of it before he reached his door.' },
        ],
      },
    ],
  },

  trial_third: {
    id: 'trial_third', phase: 5,
    rubric: 'THE TRIBUNAL · THE THIRD INQUISITION',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — he loses the third, datable to c. 1427; five years of wandering exile follow, death 1432',
    when: ['mem:second_inquisition=won'],
    exposure_min: 5,
    affordances: ['legal_authority', 'public_audience', 'religious_authority'],
    plate: IMG('cs-p5-hilya-creed.jpg', 'Hilye-i Şerif — calligraphic description of the Prophet, Ottoman (Wikimedia Commons)'),
    situation:
      'The third is different. The panel is chosen, not assembled; the charge is broad enough to cover a life; and the ' +
      'question underneath every question is simply whether a man may build a science the state has not authorized. ' +
      'This is the one the record says he loses. The record was not written by you.',
    options: [
      {
        id: 'hold_firm', label: 'Hold firm and refuse to bend',
        detail: 'The historically attested answer. It costs everything and concedes nothing.',
        requires: [],
        boosts: ['rep:scholarly>=4', 'mem:public_defense_won', 'person:yazdi', 'artifact:tahawi_circle'],
        effects: { meters: { exposure: 1 }, memory: { third_stance: 'firm' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Against every expectation the panel splits, and a split panel cannot condemn. You walk out — ruined at court, unbroken in doctrine, and alive.',
            effects: { rep: { scholarly: 2, occult: 2, imperial: -2 }, memory: { third_inquisition: 'survived' } },
            chronicle: 'He refused to bend at the third tribunal, and against all expectation the panel divided and could not condemn him.' },
          { band: 'backfire', weight: 3, text: 'They condemn. The sentence is not death — it is worse arranged than that: removal, disgrace, and the road.',
            effects: { rep: { imperial: -3, orthodox: -2 }, memory: { third_inquisition: 'lost' } },
            chronicle: 'He refused to bend, and the third tribunal condemned him.' },
          { band: 'disaster', weight: 1, text: 'They condemn comprehensively, and add the book to the judgment. Your work is named in the sentence.',
            effects: { rep: { imperial: -3, orthodox: -3 }, meters: { transmission: -2, exposure: 1 }, memory: { third_inquisition: 'lost', book_condemned: true } },
            chronicle: 'The third tribunal condemned both the man and the book by name.' },
        ],
      },
      {
        id: 'recant_all', label: 'Recant',
        detail: 'Say the words. Keep the life, the post, and nothing else.',
        requires: [],
        effects: {
          rep: { orthodox: 3, occult: -3, scholarly: -2 }, meters: { transmission: -2 },
          memory: { third_stance: 'recant', recanted: true, third_inquisition: 'recanted' },
        },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You read the recantation aloud in a clear voice. They restore your standing that afternoon. Your students stop writing within the year.',
            chronicle: 'He recanted at the third tribunal, kept his standing, and lost his students inside a year.' },
        ],
      },
      {
        id: 'trade_qasim', label: 'Give them a name',
        detail: 'They will settle for a bigger heretic than you. Qāsim is already suspect.',
        requires: ['person:qasim'],
        effects: {
          rep: { orthodox: 2, occult: -2, scholarly: -2 },
          memory: { third_stance: 'betray', qasim_abandoned: true, betrayed_friend: true, third_inquisition: 'survived' },
        },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'The panel takes the name and lets you go. Qāsim-i Anvār is exiled within the year. Nobody in your circle ever mentions it, and everybody knows.',
            chronicle: 'He gave the tribunal a friend’s name and walked out of it, and Qāsim-i Anvār was exiled inside the year.' },
        ],
      },
      {
        id: 'flee', label: 'Do not appear',
        detail: 'Take the road before the verdict. Condemned in absentia; free, and finished here.',
        requires: [],
        effects: {
          rep: { imperial: -2, orthodox: -2 }, meters: { exposure: -1 },
          memory: { third_stance: 'flee', third_inquisition: 'lost', fled: true },
        },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'You are three days east when they convene without you. The sentence is read to an empty chair, which is the only kind of hearing you were going to get.',
            chronicle: 'He did not appear at the third tribunal, and the sentence was read to an empty chair.' },
        ],
      },
    ],
  },

  trial_patron_shield: {
    id: 'trial_patron_shield', phase: 5,
    rubric: 'THE PATRON’S DOOR · ASKING FOR PROTECTION',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — patronage as political protection; this specific appeal is constructed',
    when: ['rep:imperial>=1'],
    affordances: ['royal_patronage', 'private_audience'],
    situation:
      'The household that has paid you for a decade can make a tribunal go away, and knows it. The steward makes you ' +
      'wait, which is the message. Protection is available. It is not free, and it is not unlimited.',
    options: [
      {
        id: 'ask_protection', label: 'Ask outright',
        detail: 'Spend the relationship on your safety. It works; it also ends something.',
        requires: [],
        effects: { rep: { imperial: -1 }, memory: { asked_protection: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'You are granted a hearing and a promise. The promise is real and the price is that you are now, unambiguously, a client.',
            effects: { meters: { exposure: -1 }, memory: { has_protection: true } },
            chronicle: 'He asked his patron for protection and received it, at the price of becoming plainly a client.' },
          { band: 'qualified', weight: 1, text: 'A qualified promise: they will intervene once. Choose when.',
            effects: { memory: { has_protection: true } },
            chronicle: 'His patron promised to intervene once, and left him to choose the occasion.' },
        ],
      },
      {
        id: 'offer_service', label: 'Offer something first',
        detail: 'Arrive with a gift, not a request. A horoscope, a dedication, a useful method.',
        requires: ['meter:demonstration>=3'],
        boosts: ['artifact:horoscope'],
        effects: { rep: { imperial: 1 }, memory: { asked_protection: true, has_protection: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You come with work in hand and leave with protection that does not feel like charity. Both of you prefer it this way.',
            effects: { meters: { exposure: -1 } },
            chronicle: 'He brought his patron work rather than a plea, and got protection that cost him no dignity.' },
        ],
      },
      {
        id: 'no_patron', label: 'Do not ask',
        detail: 'Face the tribunals on your own standing. Clean, and much harder.',
        requires: [],
        effects: { rep: { scholarly: 1 }, memory: { refused_protection: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'You go home without asking. Whatever happens at the tribunal will be yours, which is either dignity or vanity and you are not sure which.',
            chronicle: 'He never asked his patron to shield him, and met the tribunals on his own standing.' },
        ],
      },
    ],
  },

  trial_recant_offer: {
    id: 'trial_recant_offer', phase: 5,
    rubric: 'THE PATRON’S DOOR · A QUIET ARRANGEMENT IS PROPOSED',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'Constructed; consistent with the documented pattern of pressure short of formal trial',
    when: ['mem:first_inquisition=won'],
    affordances: ['private_audience'],
    situation:
      'An intermediary suggests, over excellent tea, that all of this could end permanently. A short written statement ' +
      'withdrawing the more adventurous claims. No trial, no record, no exile. He is being kind. He is also entirely serious.',
    options: [
      {
        id: 'take_deal', label: 'Sign the statement',
        detail: 'Peace, purchased with the part of the work that made it matter.',
        requires: [],
        effects: {
          rep: { orthodox: 2, occult: -2 }, meters: { exposure: -2, transmission: -1 },
          memory: { signed_statement: true, recanted: true },
        },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'It is a short document and it takes a moment to sign. The quiet afterward lasts for years and is not restful.',
            chronicle: 'He signed the quiet statement withdrawing his boldest claims, and the peace it bought was not restful.' },
        ],
      },
      {
        id: 'refuse_deal', label: 'Refuse, politely',
        detail: 'Thank him and decline. He will report the refusal accurately.',
        requires: [],
        effects: { meters: { exposure: 1 }, rep: { scholarly: 1 }, memory: { refused_deal: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'He is not offended; he is a professional. The refusal is on the record by evening and everyone proceeds accordingly.',
            chronicle: 'He declined the quiet arrangement, and the refusal was on record by evening.' },
        ],
      },
      {
        id: 'counter_offer', label: 'Offer a narrower statement of your own drafting',
        detail: 'Concede vocabulary, keep the doctrine. The apologist’s craft.',
        requires: ['rep:scholarly>=3'],
        effects: { rep: { orthodox: 1 }, meters: { exposure: -1 }, memory: { drafted_own_statement: true, wrote_creed: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You draft something that reads as submission to a jurist and as nothing of the kind to anyone who knows the system. It is accepted.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'He wrote his own statement, submissive to a jurist’s eye and unchanged to anyone who knew the system.' },
          { band: 'ambiguous', weight: 1, text: 'Accepted, with a marginal note that it is being kept on file for comparison with your future work.',
            chronicle: 'His own carefully drafted statement was accepted and filed for comparison.' },
        ],
      },
    ],
  },

  trial_qasim_exile: {
    id: 'trial_qasim_exile', phase: 5,
    rubric: 'THE CIRCLE · QĀSIM-I ANVĀR IS EXILED',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — Qāsim-i Anvār exiled in 1427 over lettrist associations, the same year as the third inquisition',
    when: ['person:qasim', '!mem:qasim_abandoned'],
    affordances: ['private_audience'],
    situation:
      'The order comes down: Qāsim-i Anvār is expelled, over exactly the associations you share. Everyone who has ever ' +
      'given you advice gives you the same advice now. He is leaving in four days and has not asked you for anything.',
    options: [
      {
        id: 'stand_by', label: 'See him off publicly',
        detail: 'Be seen at the gate. Costs you exactly what everyone says it will cost.',
        requires: [],
        effects: {
          meters: { exposure: 2 }, rep: { orthodox: -2, occult: 1 },
          memory: { qasim_defended: true },
        },
        outcomes: [
          { band: 'success', weight: 2, text: 'You stand at the gate in daylight where anyone can see you. He is not sentimental about it and neither are you, and it is the best thing you do this decade.',
            effects: { rep: { scholarly: 1 } },
            chronicle: 'When Qāsim-i Anvār was exiled he stood at the gate in daylight, where everyone could see him do it.' },
          { band: 'backfire', weight: 1, text: 'You are seen. It is entered in a file that is already thick, on the page immediately before your own summons.',
            effects: { meters: { exposure: 2 } },
            chronicle: 'His public farewell to the exiled poet went straight into the file that was being built against him.' },
        ],
      },
      {
        id: 'help_quietly', label: 'Help him quietly',
        detail: 'Money, letters of introduction, a name in Herat. Nothing anyone can photograph.',
        requires: [],
        effects: { meters: { exposure: 1 }, memory: { qasim_defended: true, helped_quietly: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Silver, two letters, and a night visit. He arrives east with somewhere to go, and nobody can prove you had anything to do with it.',
            chronicle: 'He helped Qāsim-i Anvār into exile by night, with silver and letters and no witnesses.' },
          { band: 'qualified', weight: 1, text: 'The help arrives. So does a servant’s rumor about a night visit, which is how these things always come out.',
            effects: { meters: { exposure: 1 } },
            chronicle: 'His secret help to the exiled poet was undone by a servant’s gossip.' },
        ],
      },
      {
        id: 'distance', label: 'Let him go',
        detail: 'Say nothing, send nothing, be elsewhere. It is the survivable choice.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { qasim_abandoned: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'He leaves. You are demonstrably elsewhere. Nothing whatever happens to you, which is the point, and you think about it for the rest of your life.',
            chronicle: 'He was demonstrably elsewhere when Qāsim-i Anvār went into exile.' },
        ],
      },
    ],
  },

  trial_student_copy: {
    id: 'trial_student_copy', phase: 5,
    rubric: 'THE CIRCLE · WHAT TO DO WITH THE MANUSCRIPTS',
    grounding: 'PLAUSIBLE-GAP',
    source: 'BIOGRAPHY — Investigations remains understudied for centuries, effectively "on the Index"; this dispersal scene is constructed',
    when: ['mem:investigations_begun'],
    affordances: ['manuscripts', 'private_audience'],
    situation:
      'If the third tribunal goes badly, everything in this room becomes evidence. Your student is willing to carry ' +
      'copies out tonight; your instinct is to keep the autograph where you can defend it. Paper survives men, but ' +
      'only if it is somewhere else.',
    options: [
      {
        id: 'disperse', label: 'Disperse copies to four cities',
        detail: 'No single seizure can end the work. Control lost, survival bought.',
        requires: ['meter:transmission>=3'],
        effects: {
          meters: { transmission: 3 }, memory: { manuscripts_dispersed: true, taught_widely: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Four copies, four cities, four households that do not know about each other. Whatever the tribunal decides, it cannot decide this.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'Before the last tribunal he scattered copies of the summa to four cities that did not know of one another.' },
          { band: 'success', weight: 1, text: 'Three of the four arrive. The fourth courier is never heard from, and you will never know which city lost its copy.',
            chronicle: 'He scattered the summa to four cities, and three of the copies arrived.' },
        ],
      },
      {
        id: 'yazdi_keeps', label: 'Send everything to Yazdī',
        detail: 'One trusted hand, at the observatory, protected by an institution.',
        requires: ['person:yazdi'],
        effects: { meters: { transmission: 2 }, memory: { yazdi_copied: true, yazdi_keeps: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'He takes it all to Samarkand without comment. He will outlive you by twenty-two years and he does not lose things.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He sent the whole archive to Yazdī, who outlived him by twenty-two years and lost nothing.' },
        ],
      },
      {
        id: 'keep_all', label: 'Keep everything with you',
        detail: 'Defend it in person, or lose it in person.',
        requires: [],
        effects: { memory: { hoarded: true, kept_archive: true } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'It stays in the room. So do you, for now.',
            chronicle: 'He kept the whole archive under his own roof and defended it in person.' },
        ],
      },
    ],
  },

  trial_rival_book: {
    id: 'trial_rival_book', phase: 5,
    rubric: 'THE CIRCLE · SOMEONE HAS SIMPLIFIED YOU',
    grounding: 'ATTESTED',
    source: 'RESEARCH — the Kāshifī/ʿAlī Ṣafī "Everyman’s Library" simplifications of the same material for wider circulation',
    when: ['meter:transmission>=4'],
    affordances: ['manuscripts'],
    situation:
      'A book is circulating that is unmistakably your system, in easy Persian, with the difficulties removed and ' +
      'someone else’s name on it. It is selling. It is also, in three places, wrong — and in two places, better than ' +
      'what you wrote.',
    options: [
      {
        id: 'denounce', label: 'Denounce it',
        detail: 'Defend the doctrine’s integrity. Public, principled, and it advertises the book.',
        requires: [],
        effects: { rep: { scholarly: 1 }, meters: { exposure: 1 }, memory: { denounced_popularizer: true } },
        outcomes: [
          { band: 'ambiguous', weight: 2, text: 'Your denunciation is quoted in the third printing’s preface. Sales improve.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He denounced the popularizer, and was quoted in the popularizer’s next preface.' },
        ],
      },
      {
        id: 'correct_and_bless', label: 'Correct the errors and endorse the rest',
        detail: 'Accept that reach costs precision. Fix what matters; let the rest go.',
        requires: [],
        effects: {
          meters: { transmission: 3 }, rep: { occult: 1 },
          memory: { blessed_popularizer: true, taught_widely: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You send three corrections and a sentence of approval. The next edition carries both, and your system is suddenly in more hands than you will ever meet.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He corrected the popularizer’s errors and blessed the rest, and his system went where he could not follow.' },
          { band: 'success', weight: 1, text: 'Corrections accepted, approval printed. Purists in your own circle are appalled, which you can live with.',
            effects: { rep: { scholarly: -1 }, meters: { transmission: 1 } },
            chronicle: 'He endorsed a simplified version of his own work, to his students’ dismay.' },
        ],
      },
      {
        id: 'ignore_book', label: 'Ignore it',
        detail: 'You have a tribunal to prepare for. Let the century sort it out.',
        requires: [],
        effects: { meters: { transmission: 1 } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'It spreads without you, imperfectly, unstoppably. That may be what transmission always was.',
            chronicle: 'He let the simplified version spread unopposed, being occupied with a tribunal.' },
        ],
      },
    ],
  },

  trial_checkpoint: {
    id: 'trial_checkpoint', phase: 5,
    rubric: 'THE EASTERN GATE \u00b7 A CHECKPOINT WITH YOUR NAME AT IT',
    grounding: 'INVENTED-COMPATIBLE',
    source: 'The s\u012bmiy\u0101 signature moment (VN PROPOSAL: escape by misdirection); the five-year exile itself is ATTESTED',
    when: ['mem:third_inquisition=lost'],
    affordances: ['gate_guards', 'crowd'],
    situation:
      'The sentence entitles you to leave; a clerk\u2019s addendum entitles the governor to everything you carry. At the ' +
      'eastern gate the soldiers have a list, and your baggage \u2014 books, tables, the years of paper \u2014 is exactly what ' +
      'the list is for. The exile may pass. The archive may not.',
    options: [
      {
        id: 'misdirect', label: 'Let them seize the wrong chest',
        detail: 'S\u012bmiy\u0101 at last: a decoy chest, a staged reluctance, and every eye drawn where you want it.',
        requires: ['simiya>=1'],
        effects: { memory: { checkpoint_escape: true } },
        outcomes: [
          { band: 'triumph', weight: 2, text: 'You cling to the decoy chest so convincingly that they pry it from you in triumph \u2014 sermon drafts and old dockets. The real papers ride out under a mule-load of onions. It is the finest performance of your life, and no audience will ever know.',
            effects: { meters: { demonstration: 1, transmission: 1 } },
            chronicle: 'At the eastern gate he surrendered a decoy chest with convincing grief, and the real archive left the city under onions.' },
          { band: 'qualified', weight: 1, text: 'The switch works, mostly. One bundle of letters goes with the decoy \u2014 a decade of correspondence you will spend exile trying to reconstruct.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'His gate-trick saved the archive and cost him a decade of letters.' },
        ],
      },
      {
        id: 'bribe', label: 'Pay what the soldiers ask',
        detail: 'Coin instead of craft. It empties the purse that was meant to last five years.',
        requires: [],
        effects: { memory: { checkpoint_bribed: true } },
        outcomes: [
          { band: 'success', weight: 2, text: 'Expensive, effective, unremarkable. The books pass as \u201cpersonal effects.\u201d Poverty arrives a year early.',
            chronicle: 'He bought his archive through the eastern gate, and began his exile poorer than the sentence required.' },
          { band: 'backfire', weight: 1, text: 'The first soldier takes the bribe; the second, who saw it, requires his own. By the gate\u2019s far side the five-year purse is a two-year purse.',
            chronicle: 'The gate cost him two bribes and most of the money the exile was to live on.' },
        ],
      },
      {
        id: 'surrender_books', label: 'Let them take the chests',
        detail: 'The work is in other hands or it is nowhere. Walk out with a staff and a cloak.',
        requires: [],
        effects: { meters: { transmission: -1 }, memory: { checkpoint_lost_books: true } },
        outcomes: [
          { band: 'ambiguous', weight: 1, text: 'You watch the chests carried into the guardhouse and walk east with nothing. Whatever survives of your system now survives because you gave it away earlier \u2014 or it does not survive.',
            chronicle: 'He let the state take his chests at the gate, and walked into exile carrying only what others already held.' },
        ],
      },
    ],
  },

  trial_letters: {
    id: 'trial_letters', phase: 5,
    rubric: 'THE CIRCLE \u00b7 A COURT STILL WRITES',
    grounding: 'ATTESTED',
    source: 'RESEARCH \u2014 "applied lettrism remains an important technology of empire and personal advancement alike"; courts commissioned occult work from suspect scholars throughout',
    when: ['mem:first_inquisition=won'],
    affordances: ['manuscripts', 'private_audience'],
    situation:
      'A letter arrives under a careful seal: a provincial court \u2014 one that knows precisely what tribunals you have ' +
      'stood before \u2014 would like a protective inscription for a newborn prince. Discreetly. The same science being ' +
      'tried in one city is being commissioned from another, and nobody on either side finds this strange.',
    options: [
      {
        id: 'accept_inscription', label: 'Compose the inscription',
        detail: 'L\u012bmiy\u0101, paid in silver and silence. Useful money; documentary evidence.',
        requires: ['limiya>=2'],
        effects: { meters: { exposure: 1 }, memory: { exile_commission: 'accepted' } },
        outcomes: [
          { band: 'success', weight: 2, text: 'The wafq is exact, the fee is generous, and somewhere a prince will grow up under your letters. The receipt, of course, exists.',
            effects: { rep: { occult: 1 }, meters: { transmission: 1 } },
            chronicle: 'Under indictment in one city, he was commissioned in another \u2014 a protective inscription for a prince\u2019s cradle.' },
          { band: 'backfire', weight: 1, text: 'The work is flawless and the court is grateful \u2014 and careless. Within a year your accusers can prove you practiced while under review.',
            effects: { meters: { exposure: 2 } },
            chronicle: 'The cradle-inscription was excellent and indiscreet, and his accusers acquired the receipt.' },
        ],
      },
      {
        id: 'teach_instead', label: 'Send them the method, not the work',
        detail: 'Decline the commission; teach their own scholar to do it. Transmission over fee.',
        requires: [],
        boosts: ['meter:transmission>=4'],
        effects: { meters: { transmission: 1 }, memory: { exile_commission: 'taught' } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You write back a small treatise on the principles and decline the silver. Their court scholar learns it, uses it, teaches it \u2014 and owes you. This is how a system colonizes a court its author never visits.',
            effects: { meters: { transmission: 1 }, rep: { scholarly: 1 } },
            chronicle: 'He refused the fee and sent the method instead, and a distant court began practicing his science without him.' },
          { band: 'qualified', weight: 1, text: 'The method travels; the fee does not. Principle is a currency you cannot eat.',
            chronicle: 'He sent the distant court his method and kept his poverty intact.' },
        ],
      },
      {
        id: 'refuse_commission5', label: 'Burn the letter',
        detail: 'While tribunals sit, practice is evidence. Decline everything.',
        requires: [],
        effects: { rep: { orthodox: 1 }, memory: { exile_commission: 'refused' } },
        outcomes: [
          { band: 'qualified', weight: 1, text: 'The letter burns well. So does the bridge \u2014 that court will not write twice.',
            chronicle: 'He burned a court\u2019s discreet commission unanswered, while the tribunals sat.' },
        ],
      },
    ],
  },

  trial_end: {
    id: 'trial_end', phase: 5,
    rubric: 'THE ROAD · WHAT IS LEFT',
    grounding: 'ATTESTED',
    source: 'BIOGRAPHY — five years of wandering exile after the third inquisition; death 1432, impoverished, in legal limbo',
    affordances: [],
    plate: IMG('act8-printed-teardrop-cosmogram-p256.jpg', 'Teardrop cosmological diagram — Shams al-Maʿārif, p. 256 (Wikimedia Commons)'),
    situation:
      'However the tribunals fell out, the years after them are the ones that decide what this life was. There is a ' +
      'road, a diminishing amount of money, and a body of work that is either travelling without you or sitting in a ' +
      'box. What you do with the last of it is the last decision you get.',
    options: [
      {
        id: 'teach_on_road', label: 'Teach wherever they let you stop',
        detail: 'Turn exile into transmission. No security, maximum spread.',
        requires: [],
        effects: {
          meters: { transmission: 3 }, rep: { occult: 1 },
          memory: { taught_widely: true, taught_in_exile: true },
        },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'Five years of wandering, and in every town a handful of men who now know something they did not. You die poor, in legal limbo, and the teaching does not stop when you do.',
            effects: { meters: { transmission: 2 } },
            chronicle: 'He taught in every town that let him stop, and when he died the teaching did not.' },
          { band: 'success', weight: 1, text: 'You teach where you can. It is thinner than a school and more durable than a book.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He spent his last years teaching on the road, thinly and durably.' },
        ],
      },
      {
        id: 'finish_work', label: 'Finish the work',
        detail: 'Complete the system, alone, whether or not anyone is left to read it.',
        requires: [],
        effects: { meters: { synthesis: 3 }, memory: { finished_work: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'The last revisions are the best of them. Nobody sees the manuscript for four hundred years, and when they do it is complete.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He finished the system in exile, and it waited four centuries to be read entire.' },
          { band: 'qualified', weight: 1, text: 'You finish. The manuscript is complete and unread, in a box, in a house you are renting.',
            chronicle: 'He completed his life’s work in a rented room, and no one came to read it.' },
        ],
      },
      {
        id: 'rebuild_position', label: 'Petition, negotiate, rebuild',
        detail: 'Spend the last years trying to get the standing back. It sometimes works.',
        requires: ['rep:orthodox>=1'],
        effects: { rep: { orthodox: 1, imperial: 1 }, memory: { rebuilt_position: true, kept_judgeship: true } },
        outcomes: [
          { band: 'success', weight: 1, text: 'Petitions, intermediaries, and eventually a modest restoration. You die respectable, in a city, with the work in a cupboard.',
            effects: { meters: { transmission: -1 } },
            chronicle: 'He spent his last years petitioning his way back to respectability, with the work shut in a cupboard.' },
          { band: 'ambiguous', weight: 1, text: 'Years of petitions and one partial restoration, arriving late enough to be a formality.',
            chronicle: 'His restoration came late enough to be a formality.' },
        ],
      },
      {
        id: 'entrust', label: 'Entrust everything to the circle and stop',
        detail: 'Hand it over. Let the movement be the movement; be an old man.',
        requires: ['meter:transmission>=5'],
        effects: { meters: { transmission: 2 }, memory: { entrusted_all: true } },
        outcomes: [
          { band: 'triumph', weight: 1, text: 'You give it to the people who will carry it and you stop pushing. It keeps moving anyway — which is the only proof that ever mattered.',
            effects: { meters: { transmission: 1 } },
            chronicle: 'He handed the whole project to his circle and stopped pushing, and it kept moving without him.' },
        ],
      },
    ],
  },
};
