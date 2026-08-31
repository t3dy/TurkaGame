// career.js — the systems that make Phases II–V a career rather than a tour:
// obligations (recurring time drains), contracts (patron promises with deadlines
// and expectation inflation), exposure tiers (compounding political pressure).
// Framework-agnostic. See docs/SYSTEMS.md §4, §6, and DESIGN.md thesis #6.

import { applyEffects, checkReq } from './state.js?v=3';

// ---- exposure tiers ---------------------------------------------------------
// Exposure is the rebel fleet: it rises, it does not reset, and each tier changes
// what the world sends at you. Named so the UI can state the threat plainly.
export const EXPOSURE_TIERS = [
  { at: 0, key: 'unremarked', label: 'Unremarked', gloss: 'Nobody with power is thinking about you. Enjoy it.' },
  { at: 3, key: 'talked_about', label: 'Talked About', gloss: 'Your name circulates. Rivals have begun to place you.' },
  { at: 5, key: 'watched', label: 'Watched', gloss: 'Someone is keeping a file. Challenges will find you now.' },
  { at: 7, key: 'denounced', label: 'Denounced', gloss: 'Accusations exist in writing. A tribunal is a matter of timing.' },
  { at: 9, key: 'summoned', label: 'Summoned', gloss: 'The state has decided you are its business.' },
];

export function exposureTier(state) {
  let t = EXPOSURE_TIERS[0];
  for (const tier of EXPOSURE_TIERS) if (state.meters.exposure >= tier.at) t = tier;
  return t;
}

// Encounters may declare `exposure_min` — the pressure the world applies as you rise.
export function meetsExposure(state, enc) {
  if (enc.exposure_min == null) return true;
  return state.meters.exposure >= enc.exposure_min;
}

// ---- obligations ------------------------------------------------------------
// A standing duty that eats time every turn until discharged or abandoned. The
// judgeship is the model: real, honorable, and a constant tax on the life's work.

export function addObligation(state, ob) {
  if (!state.obligations.some((o) => o.id === ob.id)) state.obligations.push({ ...ob });
}

export function dropObligation(state, id) {
  state.obligations = state.obligations.filter((o) => o.id !== id);
}

// Charged when the player takes any action in a phase that has obligations.
// Returns [{ ob, paid, skipped }] so the UI can narrate what the office cost.
export function chargeObligations(state) {
  const report = [];
  for (const ob of state.obligations) {
    if (state.time >= ob.cost) {
      state.time -= ob.cost;
      report.push({ ob, paid: true });
    } else {
      // Can't pay: the duty is neglected and the world notices.
      applyEffects(state, ob.neglect || { rep: { orthodox: -1 } }, 'obligation:' + ob.id);
      ob.neglected = (ob.neglected || 0) + 1;
      report.push({ ob, paid: false });
    }
  }
  return report;
}

// ---- contracts --------------------------------------------------------------
// Nummedal's lesson as a mechanic: a promise, a deadline, a reward, and an
// expectation that never comes back down.

export function offerContract(state, c) {
  state.contracts.push({
    ...c,
    accepted: true,
    turnsLeft: c.deadline,
    status: 'open',
  });
}

// Called once per action-turn. Ticks deadlines; resolves anything that ran out.
// Returns [{ contract, outcome }] for narration.
export function tickContracts(state) {
  const events = [];
  for (const c of state.contracts) {
    if (c.status !== 'open') continue;
    c.turnsLeft -= 1;
    if (c.turnsLeft <= 0) {
      // Deadline reached. Delivered if the player met the promise's requirement.
      const met = (c.requires || []).every((r) => checkReq(state, r).ok);
      if (met) {
        c.status = 'delivered';
        applyEffects(state, c.reward, 'contract:' + c.id);
        // Success raises what the patron will demand next time.
        state.expectation = (state.expectation || 0) + (c.expectation_delta || 1);
        events.push({ contract: c, outcome: 'delivered' });
      } else {
        c.status = 'failed';
        applyEffects(state, c.failure, 'contract:' + c.id);
        events.push({ contract: c, outcome: 'failed' });
      }
    }
  }
  return events;
}

export function openContracts(state) {
  return state.contracts.filter((c) => c.status === 'open');
}

// Settle every still-open contract immediately, regardless of remaining deadline.
// Called when a phase ends: a commission belongs to the court that gave it, so a
// promise can never quietly outlive the years it was made in. Same event shape as
// tickContracts, for narration.
export function settleContracts(state) {
  const events = [];
  for (const c of state.contracts) {
    if (c.status !== 'open') continue;
    const met = (c.requires || []).every((r) => checkReq(state, r).ok);
    if (met) {
      c.status = 'delivered';
      applyEffects(state, c.reward, 'contract:' + c.id);
      state.expectation = (state.expectation || 0) + (c.expectation_delta || 1);
      events.push({ contract: c, outcome: 'delivered' });
    } else {
      c.status = 'failed';
      applyEffects(state, c.failure, 'contract:' + c.id);
      events.push({ contract: c, outcome: 'failed' });
    }
    c.turnsLeft = 0;
  }
  return events;
}

// ---- the two-axis ending matrix (full-run scale) ----------------------------
// Personal fate x system fate, scored independently. Legacy, not survival.
// docs/SYSTEMS.md §9; DESIGN.md "The ending is a two-axis verdict".
//
// Ordering is the design: the tribunals are the dramatic spine of the life, so
// what happened there is read FIRST, and only a life the tribunals never touched
// falls through to be judged on its career shape. Each test is written to be
// mutually exclusive in practice — a run should never merely "fall through" to a
// fate that ignores the most consequential thing that happened to it.

const MAN_FATES = [
  // — the third tribunal went against him —
  { key: 'condemned_with_book', title: 'Condemned With His Book',
    test: (s) => s.memory.third_inquisition === 'lost' && s.memory.book_condemned,
    text: 'The judgment named the work as well as the man. He goes into exile knowing they understood exactly what they were burying.' },
  { key: 'broken', title: 'Broken by the State',
    test: (s) => s.memory.third_inquisition === 'lost' && s.meters.exposure >= 8,
    text: 'He lost the third inquisition with nothing left to spend — no patron, no standing, and a file thick enough to bury anyone.' },
  { key: 'fugitive', title: 'The Fugitive',
    test: (s) => s.memory.fled,
    text: 'He did not stay to hear it. Condemned in absence, he spends what is left of his life one town ahead of the sentence.' },
  { key: 'exiled', title: 'The Wandering Exile',
    test: (s) => s.memory.third_inquisition === 'lost',
    text: 'Five years of wandering follow the verdict. He dies impoverished, in legal limbo — the attested fate, arrived at by your own road.' },

  // — he survived, and how he survived is the whole question —
  { key: 'informer', title: 'The Man Who Gave a Name',
    test: (s) => s.memory.betrayed_friend,
    text: 'He walked out of the third tribunal because someone else did not. Nobody in his circle ever raises it, and nobody forgets it either.' },
  { key: 'recanted', title: 'The Man Who Bent',
    test: (s) => s.memory.recanted === true,
    text: 'He kept his life and his post by conceding the thing he had spent it building. The court is satisfied. He is not.' },
  { key: 'vindicated', title: 'Vindicated in Open Court',
    test: (s) => s.memory.third_inquisition === 'survived' && s.memory.third_stance === 'firm',
    text: 'He refused to bend and the panel could not condemn him. He ends his life what almost no one in his position ever was: tried three times, and unbroken.' },
  { key: 'acquitted', title: 'Thrice Tried, Thrice Standing',
    test: (s) => s.memory.third_inquisition === 'survived',
    text: 'Three tribunals, three survivals — by argument, by patronage, by whatever came to hand. The record is clean and everybody knows what it cost.' },
  { key: 'harried', title: 'Harried to the End',
    test: (s) => s.memory.second_inquisition === 'won' || s.memory.first_inquisition === 'won',
    text: 'He beat the tribunals that came and spent his last years waiting for the one that did not. The waiting was its own sentence.' },

  // — the tribunals never came: judged on the career he built instead —
  { key: 'eminent', title: 'Eminence Without Incident',
    test: (s) => s.rep.imperial >= 3 && s.meters.exposure <= 6,
    text: 'He ends his life a court fixture — protected, consulted, and never once formally accused. Proximity to power turned out to be the best defense available.' },
  { key: 'judge', title: 'The Judge of Isfahan',
    test: (s) => s.rep.orthodox >= 3 && s.memory.kept_judgeship && s.meters.exposure <= 4,
    text: 'He dies as he began: a jurist of standing, in his own city, his other work a private matter between himself and the paper.' },
  { key: 'unremarked', title: 'Never Worth Summoning',
    test: (s) => s.meters.exposure <= 2,
    text: 'He was careful enough, for long enough, that the state never formed an opinion about him. It is a kind of victory, and it tastes like one.' },
  { key: 'watched', title: 'Watched, and Left Alone',
    test: (s) => s.meters.exposure >= 5,
    text: 'A file exists. It was never acted on, and he lived every remaining year knowing it was there.' },
  { key: 'obscure', title: 'A Quiet Obscurity',
    test: () => true,
    text: 'No tribunal ever bothered with him. Neither did history, much.' },
];

const SYSTEM_FATES = [
  { key: 'source_code', title: 'Source Code of Empire',
    test: (s) => s.meters.transmission >= 8 && s.meters.synthesis >= 7,
    text: 'The astrological-lettrist platform becomes the default imperial cosmology — Timurid, Aqquyunlu, Safavid, Uzbek, Ottoman, Mughal. Courts he never saw will run on his mathematics for centuries.' },
  { key: 'scholarly', title: 'Carried by the Learned',
    test: (s) => s.meters.transmission >= 6 && s.rep.scholarly >= 3,
    text: 'The system survives where it was built to survive: in scholars’ hands, copied, argued over, taught. Not an empire’s cosmology — a discipline’s.' },
  { key: 'escaped', title: 'A Movement Beyond Him',
    test: (s) => s.meters.transmission >= 6,
    text: 'It spread faster than it was understood. What bears his name in a generation is popular, powerful, and not quite his.' },
  { key: 'one_hand', title: 'Carried in One Hand',
    test: (s) => (s.memory.yazdi_copied || s.memory.yazdi_keeps) && s.meters.transmission >= 3,
    text: 'Yazdī had a copy in his own hand and outlived him by twenty-two years. The whole survival of the thing runs through one friendship — which turns out to be enough.' },
  { key: 'indexed', title: 'On the Index',
    test: (s) => s.memory.book_condemned && s.meters.transmission >= 2,
    text: 'Named in a judgment and therefore unreadable in public for centuries. It is not destroyed; it is shelved, which is slower and nearly as effective.' },
  { key: 'appropriated', title: 'Taken and Hollowed',
    test: (s) => s.rep.imperial >= 4 && s.meters.synthesis < 6,
    text: 'The court kept the useful parts — the prognostics, the legitimating mathematics — and quietly discarded the philosophy that made them mean anything.' },
  { key: 'underground', title: 'Suppressed, Not Extinguished',
    test: (s) => s.meters.transmission >= 3,
    text: 'Officially the work is out of favour. Unofficially the manuscripts move hand to hand, and the copying never entirely stops.' },
  { key: 'unread', title: 'Complete, and Unread',
    test: (s) => s.meters.synthesis >= 7,
    text: 'He finished it. The system is whole, rigorous, and sits in a box that nobody opens for four hundred years — which is not the same as dying, but it is not much better.' },
  { key: 'died', title: 'Died With Its Author',
    test: () => true,
    text: 'The connections existed in one man’s head and one man’s hand. Both are gone.' },
];

// The Attested Life as data: [{hist, yours}] — consumed by the ending screen and
// by the published-chronicle payload (the scholarly log must carry it verbatim).
export function attestedRows(state) {
  const m = state.memory;
  const rows = [];
  const row = (hist, yours) => rows.push({ hist, yours });
  row('He studied in Cairo under Sayyid Ḥusayn Akhlāṭī, lettrist, alchemist and geomancer.',
    m.circle_member ? 'so did you.' : 'you never entered the circle — a formation the historical man could not have skipped.');
  row('He served as Chief Judge of Isfahan, famous for defending the weak against the powerful.',
    m.took_judgeship ? (m.defended_weak ? 'you took the bench and ruled as he did.' : 'you took the bench; whether you used it as he did, your chronicle knows.') : 'you refused the bench he was defined by.');
  row('In 1420 he completed Investigations — the first systematic summa of Islamic lettrism — as Ulugh Beg broke ground on the Samarkand observatory.',
    m.investigations_begun ? 'your summa exists.' : 'your summa was never written — the counterfactual is total.');
  row('His central diagram, the Ṭahawī Circle, survives in his own handwriting (Tehran, Majlis Library MS 10196, f. 63a).',
    m.tahawi_circle ? 'you drew it.' : 'you never drew the Circle; your system has no surviving image.');
  row('He faced three state inquisitions engineered by rival colleagues: he won the first two and lost the third, c. 1427.',
    m.third_inquisition === 'lost' ? 'the same road, ending the same way.'
      : m.third_inquisition === 'survived' ? 'you survived all three — a thing the record does not grant the historical man.'
      : m.recanted ? 'you bent, which the record says he refused to do.'
      : 'the third tribunal never reached you.');
  row('Qāsim-i Anvār, his Cairo companion, was exiled in 1427 over the same lettrist associations.',
    m.qasim_defended ? 'you stood by him.' : m.qasim_abandoned ? 'you let him go alone.' : 'in your life the friendship never came to its test.');
  row('He died in 1432, impoverished and in legal limbo, after five years of wandering exile; Yazdī — who copied his autograph — outlived him by twenty-two years, and the platform they built became imperial cosmology across six court cultures.',
    (m.yazdi_copied || m.yazdi_keeps) ? 'your Yazdī carries the copy too.' : 'your Yazdī never copied the work — history’s own transmission route, closed.');
  return rows;
}

export function finalVerdict(state) {
  const man = MAN_FATES.find((f) => f.test(state));
  const system = SYSTEM_FATES.find((f) => f.test(state));
  return { man, system, notes: legacyNotes(state) };
}

// Marginalia: read the run's memory back to the player at the end. Every memory
// flag the content writes must resolve to a line here, or be read by an encounter —
// the Chekhov's-gun lint in tools/test-engine.mjs enforces it, so a choice can never
// silently vanish from the record.
//
// Keys are a flag name (fires when truthy) or "flag=value".
export const LEGACY_NOTES = {
  // — Cairo —
  akhlati_public: 'He wore Akhlātī’s name openly, and it preceded him everywhere afterward.',
  akhlati_quiet: 'His years with Akhlātī stayed off the record — a debt carried privately to the end.',
  new_brethren: 'He was there the night the circle took the Brethren’s name.',
  new_brethren_wary: 'He warned the circle what that name would cost them. The warning is on record.',
  'lineages_declared=both': 'He paired Ibn ʿArabī and Ḥamūya as co-founders — the signature move of the whole system.',
  'qasim_bond=deep': 'Qāsim-i Anvār counted him a brother, and that ledger stayed open for life.',
  'yazdi_bond=equal': 'With Yazdī the trade ran both ways — number for letter, letter for number.',
  'yazdi_bond=mentor': 'He took Yazdī as a student. The roles did not hold, and both of them knew it early.',
  feast_performed: 'A feast-night wonder in Cairo followed him east as a story.',
  dervish_exposed: 'He unpicked a false miracle in public. The credulous never forgave the demonstration.',
  dervish_believed: 'He let a doubtful miracle stand, and was counted among its witnesses.',
  dervish_open: 'Asked to judge a wonder he answered with metaphysics, and left everyone guessing what he believed.',
  madrasa_trained: 'The madrasa credential was real, and it was worth exactly what it cost him at the tribunals.',
  harmonic_link: 'He proved to himself that letter and musical interval obey one mathematics — the germ of everything after.',
  muqattaat_system: 'He built on the Qurʾan’s mysterious letters as notation rather than mystery. Nothing was safe after that.',
  circle_member: 'He was of Akhlātī’s circle, whatever he later said about it.',

  // — Isfahan —
  refused_judgeship: 'He never took the bench, and faced every later accusation without an office behind him.',
  defended_weak: 'He was, on the record, a judge who ruled against powerful men — which made his name and his enemies together.',
  mediated_case: 'He preferred settlements to verdicts, and the law was quieter for it than it should have been.',
  sold_a_verdict: 'One verdict went the way of money. He was never able to make it mean nothing.',
  defended_occultist: 'He acquitted an accused sorcerer by explaining the art to the court — and told the court what he knew.',
  acquitted_quietly: 'He freed an accused man on procedure and let the room believe he knew nothing of the science.',
  convicted_occultist: 'He convicted a practitioner to buy his own distance. The practitioners of Isfahan remembered.',
  family_reassured: 'His kin died believing the Cairo years had been an ordinary education.',
  family_told: 'He told his family the truth about his work, and lived with what it cost him at their table.',
  docket_delegated: 'He gave the docket away to buy back his hours — and lost the office’s shelter with it.',
  deputy_checked: 'He kept his deputy in his place, and kept an efficient enemy inside his own house.',
  corrupt_copies: 'Errors entered his tables in the first copies, and were still being chased decades later.',
  'first_treatise=scholarly': 'His first circulated treatise went to the learned, and came back with objections worth having.',
  'first_treatise=wide': 'His first treatise circulated freely, and was quoted — often wrongly — by men he never met.',
  withheld_treatise: 'He burned his first fair copy rather than defend an argument that was not ready.',
  public_defense_won: 'He had once beaten a preacher in open mosque. That precedent was worth a great deal later.',
  public_defense_drawn: 'His public argument with the preacher settled nothing and hardened both sides.',
  preacher_enemy: 'He made a weekly enemy of a man with a pulpit, and pulpits are patient.',
  preacher_neutralized: 'He talked a hostile preacher into a narrower sermon, quietly, over tea.',
  endured_sermon: 'He sat still through a sermon against his own science, and was watched doing it.',
  casts_nativities: 'He read nativities for money in Isfahan — a practice, and a paper trail.',
  name_reading: 'He read men by the letters of their names, publicly, for a fee. It was unmistakable and unforgettable.',
  copyist_engaged: 'A warrāq in Isfahan was the first person besides himself to write his words out.',
  qasim_carries: 'Qāsim-i Anvār carried his doctrine into places no manuscript of his ever reached.',
  qasim_kept_clear: 'He deliberately sent Qāsim nothing a tribunal could read. It may have saved one of them.',
  'court_entry=open': 'He arrived at court as what he was, apparatus and all.',
  'court_entry=careful': 'He arrived at court as a jurist, and let them discover the rest at his own pace.',
  'court_entry=circle': 'He arrived at court at the head of a working circle rather than alone.',

  // — The courts —
  'patron=iskandar': 'He was Iskandar Sultan’s man in the years when that was the most interesting and most dangerous thing to be.',
  'patron=baysunghur': 'He served Bāysunghur, and the finest book-workshop in the world served him back.',
  'patron=samarkand': 'He threw in with Samarkand, where the instruments were and the mathematics was honest.',
  'took_commission=bold': 'He promised a prince a spectacle, in writing, with a season named for it.',
  'took_commission=modest': 'He promised a prince a book rather than a marvel, and was quietly right to.',
  'took_commission=negotiated': 'He negotiated a princely commission into terms he could actually keep.',
  refused_commission: 'He refused a princely commission rather than promise what he could not deliver.',
  boon_delivered: 'He delivered what he promised a patron — and every delivery raised the next demand.',
  boon_failed: 'He missed a patron’s deadline. Courts remember misses far longer than successes.',
  philosopher_king_argued: 'He told a Timurid prince that kingship was a discipline requiring study, and was heard out.',
  legitimated_dynasty: 'He told a prince the cosmos had written his house into it — the most useful and most quotable thing he ever said.',
  refused_prince: 'He refused to turn his science into statecraft, to a prince’s face, in open hall.',
  dynastic_prognosis: 'He set a term on a dynasty’s life. Nothing a scholar does is remembered longer.',
  refused_prognosis: 'He refused to date the end of a dynasty, and a lesser man obliged the next morning.',
  calligrapher_ally: 'A court calligrapher became his collaborator, and made his science visible.',
  took_credit: 'He published an artisan’s discovery under his own name, and the workshops knew.',
  baysunghur_commission: 'An atelier made his cosmogram in gold, and other courts asked for copies.',
  plain_diagram: 'He forced his diagram to be plain enough for any copyist, against the atelier’s taste.',
  astronomer_engaged: 'He handed his method to a professional computer to check — the hardest audience, and the one worth having.',
  observatory_work: 'His arithmetic touched the Samarkand tables: star science and letter science, working together.',
  union_argued: 'He argued at the observatory that star science and letter science were one enterprise, and some astronomers agreed.',
  humiliated_rival: 'He destroyed a rival publicly with arithmetic. It was satisfying and it was expensive.',
  rival_survives: 'A rival he failed to finish went on collecting material against him for years.',
  rival_recruited: 'He bought off a rival with collaboration instead of beating him — the cheaper victory.',
  conceded_publicly: 'He once conceded a correction in open court, which nobody at that court had seen done.',
  showed_vanishing_ink: 'The vanishing ink was a party trick until somebody in the room stopped laughing.',
  intelligence_interest: 'A man who handled a prince’s letters took a professional interest in his tricks.',
  court_jester_moment: 'For one evening he was the court’s harmless amusement, and nobody watched him for a season.',
  reads_the_room: 'He could give four men four versions of one doctrine and satisfy all four.',
  consistent_doctrine: 'He gave every audience the same answer — which made his enemies honestly and his friends certain.',
  chose_campaign_date: 'He named the day an army marched. That is the deepest a scholar’s hand ever reaches into events.',
  campaign_failed: 'A campaign he dated was broken, and his name stayed in the record beside the date.',
  hedged_date: 'Asked for a day for the army, he gave a fortnight and his reasons.',
  refused_war_work: 'He refused to put his science into the army’s hands, more than once.',
  military_application: 'A trick of his became part of how a state moved its secrets.',
  'court_exit=work': 'When the court broke up he left with his papers and no allegiances.',
  'court_exit=patron': 'He attached himself to the surviving house, and was thereafter counted its man.',
  'court_exit=circle': 'He left the collapsing court with his collaborators — by then no longer only a man.',
  kept_patron: 'He kept a patron through the transition, and the protection was real when it was needed.',

  // — The pivot —
  'investigations_scope=systematic': 'He attempted the whole architecture at once — the first summa of its kind ever tried.',
  'investigations_scope=practical': 'He wrote the summa as a working handbook, and the learned called it thin.',
  deferred_summa: 'He spent the pivot year deepening rather than writing, and the year did not come back.',
  designed_for_uptake: 'He explained his diagrams and translated his terms for every audience — against the whole habit of the tradition.',
  concealed_core: 'He explained the frame and hid the working parts, and made the book depend on his being alive.',
  wrote_hierarchy: 'He ranked the ways of knowing in plain Persian, lettrism at the summit, and let every ranked man read his place.',
  wrote_hierarchy_soft: 'He described the ascent of knowing without naming who stood at its foot.',
  yazdi_coauthor: 'He and Yazdī rebuilt the summa together at one desk; neither could have written what came out of that room.',
  refused_yazdi_copy: 'He refused even Yazdī a copy, and the summa stayed one object in one room.',
  selective_school: 'Five students, taught everything: more than a secret, less than a movement.',
  taught_nobody: 'He turned his students away and left the system to fend for itself inside a book.',
  no_diagram: 'He never drew the central figure, and his system was never afterward seen whole in one glance.',
  ornate_diagram: 'His central diagram was made magnificent, and was copied for its beauty rather than its argument.',
  'trial_stance=defend': 'He met the first summons with a defense prepared in full.',
  'trial_stance=patron': 'He met the first summons with a patron’s word behind him.',
  'trial_stance=concede': 'He went to the first tribunal ready to concede whatever was cheap, and established that he could be moved.',

  // — The trials —
  'first_inquisition=won': 'He won the first inquisition.',
  'second_inquisition=won': 'He won the second inquisition too. Two acquittals is not the same thing as safety.',
  wrote_creed: 'He wrote his own creed under pressure, and it was measured against everything he wrote after.',
  counterattacked: 'He broke the first indictment by exposing his accusers’ motives, and taught them to prepare better.',
  referred_upward: 'His defense was too able to answer and too dangerous to accept, so the matter went upward.',
  patron_spent: 'A tribunal was ended by a patron’s word rather than an argument, and everyone understood it.',
  partial_recant: 'He disowned one passage to save the rest. His students heard before he got home.',
  'third_stance=firm': 'At the third tribunal he refused to bend — the one thing about him the record is certain of.',
  'third_stance=recant': 'At the third tribunal he said the words they wanted said.',
  'third_stance=betray': 'At the third tribunal he gave them a friend’s name.',
  'third_stance=flee': 'He did not appear at the third tribunal, and the sentence was read to an empty chair.',
  'third_inquisition=survived': 'He walked out of the third tribunal — a thing the histories do not record of him.',
  book_condemned: 'The judgment named the book as well as the man.',
  betrayed_friend: 'He bought his freedom with a friend’s name, and lived the rest of his life having done it.',
  fled: 'He took the road before the verdict, and was condemned in his absence.',
  asked_protection: 'He asked a patron for shelter, and was thereafter plainly a client.',
  has_protection: 'A patron’s promise of protection existed, and was worth what such promises are worth.',
  refused_protection: 'He never asked a patron to shield him, and met the tribunals on his own standing.',
  signed_statement: 'He signed a quiet statement withdrawing his boldest claims, and the peace it bought was not restful.',
  refused_deal: 'He declined the quiet arrangement, and the refusal was on file by evening.',
  drafted_own_statement: 'He drafted his own submission — obedient to a jurist’s eye, unchanged to anyone who knew the system.',
  helped_quietly: 'He got Qāsim-i Anvār out by night, with silver and letters and no witnesses.',
  manuscripts_dispersed: 'He scattered copies to four cities that did not know of one another. No single seizure could end it.',
  yazdi_keeps: 'The whole archive went to Yazdī, who outlived him by twenty-two years and lost nothing.',
  kept_archive: 'He kept the archive under his own roof and defended it in person.',
  denounced_popularizer: 'He denounced the man who simplified him, and was quoted in the next preface.',
  blessed_popularizer: 'He corrected a popularizer’s errors and blessed the rest, and his system went where he could not follow.',
  taught_in_exile: 'He taught in every town that let him stop, and the teaching did not end when he did.',
  finished_work: 'He finished the system in exile — complete, in a rented room.',
  rebuilt_position: 'He spent his last years petitioning his way back to respectability, with the work shut in a cupboard.',
  entrusted_all: 'He handed the project to his circle and stopped pushing, and it kept moving anyway.',
  neglected_bench: 'The bench went unserved while he wrote, and the city noticed which he had chosen.',
  taught_widely: 'He taught widely, and lost control of the doctrine in exactly the way that let it survive.',
  hoarded: 'He held the hardest parts close, and the qualified few were fewer than he had hoped.',
  investigations_begun: 'The Investigations exists. Whatever else is true, he wrote the book.',
  tahawi_circle: 'The Ṭahawī Circle exists — the Tetractys remade, the diagram his system is remembered by.',
  yazdi_copied: 'Yazdī copied the autograph in his own hand. That copy outlived them both.',
  qasim_defended: 'He stood by Qāsim-i Anvār when the exile order came. It was noticed, and counted against him.',
  qasim_abandoned: 'He let Qāsim-i Anvār go into exile alone. Safer; never forgotten by either of them.',
  'investigations_language=arabic': 'The summa stands in dense Arabic — a masterwork for the few who could climb it.',
  'investigations_language=persian': 'He wrote the summa in Persian, so that warlords could read it. That was the point.',
  'investigations_language=both': 'He wrote the monument in Arabic and the door beside it in Persian, and served both audiences at once.',
  recanted: 'He recanted. The word sat in the record for the rest of his life and beyond it.',
  kept_judgeship: 'He held judicial standing to the end, in name if not always in fact.',
  took_judgeship: 'He was, first and last, a judge of Isfahan.',
  has_deputy: 'A deputy carried his docket, which bought him the hours the work required.',
  family_library: 'The family library was opened to him, and it mattered more than the allowance did.',

  // — audit-session additions —
  inks_solved: 'He compounded a stable ink with his own hands, and his early copies outlived other men’s books.',
  inks_sourced: 'He solved the warrāq’s ink problem with diligence rather than chemistry.',
  inks_ignored: 'He left the ink problem to tradesmen, and some early pages did not survive it.',
  'globes_structure=journey': 'He shaped the summa as an ascent, a descent, and an ascent — three Globes of Light — so that reading it enacted the doctrine.',
  'globes_structure=curriculum': 'He ordered the three Globes of Light as a curriculum, and teachers used it as one for a century.',
  checkpoint_escape: 'At the eastern gate he saved the archive with a decoy chest and the finest misdirection of his life.',
  checkpoint_bribed: 'He bought his books through the eastern gate with the money his exile was to live on.',
  checkpoint_lost_books: 'The state took his chests at the gate, and he walked into exile empty-handed.',
  'exile_commission=accepted': 'Disgraced in one city, he was still commissioned in another — a cradle-inscription for a prince, receipt and all.',
  'exile_commission=taught': 'A distant court asked for his work; he sent the method instead of the object, and his science traveled without him.',
  'exile_commission=refused': 'While the tribunals sat he burned a court’s discreet commission unanswered.',

  // — pool-depth pass (2026-08-31) —
  quran_framework: 'His letter-proportions entered the monumental Qurʾan, unsigned — the deepest anonymous transmission a scholar can achieve.',
  quran_advised: 'He advised the great Qurʾan’s calligraphers by lamplight and left no signature to indict.',
  quran_declined: 'He kept his science away from Scripture, and the jurists counted it to his credit.',
  smoke_attempted: 'He raised — or tried to raise — an army of smoke on a frontier ridge. The story survives in three versions.',
  smoke_debunked: 'Asked for miraculous smoke, he wrote the army an honest memorandum on what reproduces and what does not.',
  sleeper_theater: 'He once made a sleeping vizier confess to loving the cook, and a whole court wept laughing.',
  sleeper_refused: 'He refused to make theater of a sleeping man, a small decency that bought a lifelong ally.',
  vizier_ally: 'A vizier owed him for a joke not made, and remembered it when remembering mattered.',
  wake_rite_shown: 'He kept a prince’s table awake till dawn by art, and let a tired man sleep in peace.',
  'sensory_published=early': 'He corrected Avicenna on the senses in print, early, under his own name — a Modern against the Ancients.',
  'sensory_published=held': 'His correction of Avicenna waited in a sealed drawer for a safer year that never quite came.',
  'sources_credit=generous': 'He credited every shoulder the summa stood on, and the scruple disarmed his reviewers.',
  'sources_credit=overclaimed': 'He let the summa read as revelation, and somewhere a careful man kept a list of its unnamed debts.',
  'grimoire=wrote': 'He wrote the bazaar its manual of named operations, and it reached towns his philosophy never would.',
  'grimoire=elite': 'He turned the bazaar’s commission into an elite treatise — twelve copies, twelve serious owners.',
  'grimoire=declined': 'He refused to write the bazaar its grimoire, and left that fortune for a later man.',
  'exile_destination=west': 'He carried his scandal west to the rival courts, and tested how far a name outruns a verdict.',
  'exile_destination=wandering': 'He chose no destination in exile, and the empty road gave him back his hours.',
  'exile_destination=petitioned': 'He petitioned the city that condemned him. The answer was the verdict, read twice.',
  'testament=public': 'His last document defended the condemned book so well that copying the defense meant copying the book.',
  'testament=quiet': 'His testament went out in small unsigned packets, exactly as durable as his friendships.',
  'testament=none': 'He left no testament, and let the work stand or fall unaccompanied.',
};

function legacyNotes(state) {
  const n = [];
  const mem = state.memory;
  // Precedence: some flag pairs are true together across different phases but read
  // as flat contradiction if printed side by side. Merge them into the tension
  // itself — which is the truer historical statement anyway.
  const skip = new Set();
  if (mem.taught_widely && mem.hoarded) {
    skip.add('taught_widely').add('hoarded');
    n.push('He taught widely and hoarded jealously by turns — reach for the doctrine, reserve for its operative core — and the tension was never resolved, only lived.');
  }
  for (const [key, line] of Object.entries(LEGACY_NOTES)) {
    if (skip.has(key)) continue;
    const eq = key.indexOf('=');
    if (eq >= 0) {
      if (String(mem[key.slice(0, eq)]) === key.slice(eq + 1)) n.push(line);
    } else if (mem[key]) {
      n.push(line);
    }
  }
  if ((state.expectation || 0) >= 3) {
    n.push('Every triumph raised what patrons demanded next; the last promises were ones nobody could have kept.');
  }
  return n;
}
