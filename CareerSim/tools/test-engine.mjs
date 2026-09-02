// Engine + content sanity tests. Run: node --test CareerSim/tools/test-engine.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import { newRun, applyEffects, checkReq } from '../src/engine/state.js?v=3';
import { drawEncounter, evaluateOptions, resolveOption, encounterEligible, cairoVerdict, BANDS } from '../src/engine/engine.js?v=7';
import { NODES } from '../content/phase1.js?v=4';
import { PEOPLE, ARTIFACTS, ENCOUNTERS, PHASES, LAST_PHASE } from '../content/index.js?v=11';
import { addObligation, chargeObligations, offerContract, tickContracts, exposureTier, finalVerdict, LEGACY_NOTES } from '../src/engine/career.js?v=8';

test('capability gating: feast wonder locked until rimiya practiced', () => {
  const s = newRun();
  const enc = ENCOUNTERS.majlis_feast;
  let evs = evaluateOptions(s, enc, PEOPLE);
  const wonder = evs.find((e) => e.opt.id === 'wonder');
  assert.equal(wonder.available, false);
  assert.match(wonder.lockedBy[0], /rīmiyā/);

  applyEffects(s, { quintet: { rimiya: 1 } }, 'test');
  evs = evaluateOptions(s, enc, PEOPLE);
  assert.equal(evs.find((e) => e.opt.id === 'wonder').available, true);
});

test('unlockedBy provenance names the person', () => {
  const s = newRun();
  applyEffects(s, { people: ['qasim'] }, 'test');
  const evs = evaluateOptions(s, ENCOUNTERS.majlis_feast, PEOPLE);
  const verses = evs.find((e) => e.opt.id === 'verses');
  assert.equal(verses.available, true);
  assert.ok(verses.unlockedBy.some((t) => /poetry/.test(t)));
});

test('memory chain: circle encounters unlock in sequence', () => {
  const s = newRun();
  const node = NODES.find((n) => n.id === 'circle');
  let enc = drawEncounter(s, node, ENCOUNTERS);
  assert.equal(enc.id, 'circle_entry');
  const evs = evaluateOptions(s, enc, PEOPLE);
  resolveOption(s, enc, evs[0], () => 0); // take 'letters'
  assert.equal(s.memory.circle_member, true);
  assert.equal(s.quintet.limiya, 1);
  assert.ok(s.people.includes('akhlati'));

  // The draw is now random among the eligible (engine.js:drawEncounter), so the
  // second visit yields EITHER member-gated encounter — the sequence that matters
  // (entry before everything else, naming only after lineages) is enforced by the
  // `when` predicates, and that is what this asserts.
  enc = drawEncounter(s, node, ENCOUNTERS);
  assert.ok(['circle_discipleship', 'circle_lineages'].includes(enc.id),
    'second circle visit draws a member-gated encounter, got ' + enc.id);
  assert.ok(!encounterEligible(s, ENCOUNTERS.circle_naming),
    'circle_naming stays locked until lineages are declared');
});

test('gradient resolution: rng=0 gives best band, rng→1 gives worst', () => {
  const s1 = newRun();
  applyEffects(s1, { quintet: { rimiya: 1 } }, 'test');
  const enc = ENCOUNTERS.majlis_feast;
  const ev1 = evaluateOptions(s1, enc, PEOPLE).find((e) => e.opt.id === 'untrained');
  const best = resolveOption(s1, enc, ev1, () => 0);
  assert.equal(best.band, 'success');

  const s2 = newRun();
  const ev2 = evaluateOptions(s2, enc, PEOPLE).find((e) => e.opt.id === 'untrained');
  const worst = resolveOption(s2, enc, ev2, () => 0.999999);
  assert.equal(worst.band, 'disaster');
});

test('every encounter: >=1 free option, >=1 gated option somewhere, grounding present', () => {
  let gatedTotal = 0;
  for (const enc of Object.values(ENCOUNTERS)) {
    assert.ok(enc.grounding, enc.id + ' missing grounding');
    assert.ok(enc.source, enc.id + ' missing source');
    const free = enc.options.filter((o) => (o.requires || []).length === 0);
    assert.ok(free.length >= 1, enc.id + ' has no requirement-free option');
    gatedTotal += enc.options.filter((o) => (o.requires || []).length > 0).length;
    for (const o of enc.options) {
      assert.ok(o.outcomes && o.outcomes.length, enc.id + '/' + o.id + ' has no outcomes');
      for (const out of o.outcomes) assert.ok(BANDS.includes(out.band), enc.id + ' bad band ' + out.band);
    }
  }
  assert.ok(gatedTotal >= 8, 'too few capability-gated options: ' + gatedTotal);
});

test('lint: every memory flag written is read somewhere (when/requires/boosts/verdict)', async () => {
  const written = new Map(); // flag -> encounter that wrote it
  const readers = new Set();
  const collect = (reqs) => (reqs || []).forEach((r) => {
    const m = r.match(/^!?mem:([a-z_0-9]+)/);
    if (m) readers.add(m[1]);
  });
  for (const enc of Object.values(ENCOUNTERS)) {
    collect(enc.when);
    (enc.memory_writes || []).forEach((f) => written.set(f, enc.id));
    for (const o of enc.options) {
      collect(o.requires);
      collect(o.boosts);
      Object.keys((o.effects || {}).memory || {}).forEach((f) => written.set(f, enc.id));
      for (const out of o.outcomes) Object.keys((out.effects || {}).memory || {}).forEach((f) => written.set(f, enc.id));
    }
  }
  // The ending's marginalia table is a legitimate reader: every key in it (bare
  // flag or "flag=value") counts as reading that flag.
  for (const key of Object.keys(LEGACY_NOTES)) {
    readers.add(key.includes('=') ? key.slice(0, key.indexOf('=')) : key);
  }
  // Flags read directly by the verdict/engine logic.
  ['third_inquisition', 'recanted', 'kept_judgeship'].forEach((f) => readers.add(f));

  const unread = [...written].filter(([f]) => !readers.has(f));
  assert.deepEqual(unread, [], 'memory flags written but never read (Chekhov gun lint): ' + JSON.stringify(unread));
});

test('verdict reads memory into marginalia', () => {
  const s = newRun();
  applyEffects(s, { memory: { akhlati_public: true, yazdi_bond: 'equal' } }, 'test');
  const v = cairoVerdict(s);
  assert.ok(v.man && v.system && Array.isArray(v.notes));
  assert.ok(v.notes.length >= 2);
});

test('exposure clamps and requirement negation works', () => {
  const s = newRun();
  applyEffects(s, { meters: { exposure: 99 } }, 'test');
  assert.equal(s.meters.exposure, 10);
  assert.equal(checkReq(s, '!mem:nothing_here').ok, true);
  s.memory.x = 'y';
  assert.equal(checkReq(s, 'mem:x=y').ok, true);
  assert.equal(checkReq(s, '!mem:x=y').ok, false);
});

test('artifact references resolve', () => {
  for (const enc of Object.values(ENCOUNTERS)) {
    for (const o of enc.options) {
      for (const out of o.outcomes) {
        for (const a of (out.effects || {}).artifacts || []) {
          assert.ok(ARTIFACTS[a], `unknown artifact ${a} in ${enc.id}`);
        }
      }
    }
  }
});

// ---- Slice 1: career systems ------------------------------------------------

test('obligations charge time each turn and penalize when unpayable', () => {
  const s = newRun();
  s.time = 3;
  addObligation(s, { id: 'judgeship', name: 'The Judgeship', cost: 1, neglect: { rep: { orthodox: -1 } } });
  let r = chargeObligations(s);
  assert.equal(s.time, 2);
  assert.equal(r[0].paid, true);

  s.time = 0;
  r = chargeObligations(s);
  assert.equal(r[0].paid, false);
  assert.equal(s.rep.orthodox, -1, 'neglect penalty applied');
});

test('contracts: deadline delivers on met requirement, fails otherwise, and inflates expectation', () => {
  const s = newRun();
  offerContract(s, {
    id: 'c1', name: 'Boon', deadline: 2, promise: 'a demonstration',
    requires: ['meter:demonstration>=3'],
    reward: { rep: { imperial: 2 } }, failure: { rep: { imperial: -2 } }, expectation_delta: 2,
  });
  applyEffects(s, { meters: { demonstration: 3 } }, 'test');
  tickContracts(s);                        // turn 1
  let ev = tickContracts(s);               // turn 2 — deadline
  assert.equal(ev[0].outcome, 'delivered');
  assert.equal(s.rep.imperial, 2);
  assert.equal(s.expectation, 2, 'success raises what the next patron demands');

  const f = newRun();
  offerContract(f, {
    id: 'c2', name: 'Boon', deadline: 1, promise: 'a demonstration',
    requires: ['meter:demonstration>=3'],
    reward: { rep: { imperial: 2 } }, failure: { rep: { imperial: -2 } },
  });
  const ev2 = tickContracts(f);
  assert.equal(ev2[0].outcome, 'failed');
  assert.equal(f.rep.imperial, -2);
});

test('exposure tiers escalate and gate encounters', () => {
  const s = newRun();
  assert.equal(exposureTier(s).key, 'unremarked');
  applyEffects(s, { meters: { exposure: 5 } }, 'test');
  assert.equal(exposureTier(s).key, 'watched');

  // trial_second declares exposure_min 4 — invisible below it even with memory met.
  const low = newRun();
  low.phase = 5;
  low.memory.first_inquisition = 'won';
  assert.equal(encounterEligible(low, ENCOUNTERS.trial_second), false, 'gated by exposure');
  applyEffects(low, { meters: { exposure: 4 } }, 'test');
  assert.equal(encounterEligible(low, ENCOUNTERS.trial_second), true);
});

test('phase gating: an encounter is invisible outside its own phase', () => {
  const s = newRun(); // phase 1
  assert.equal(encounterEligible(s, ENCOUNTERS.isfahan_appointment), false);
  s.phase = 2;
  assert.equal(encounterEligible(s, ENCOUNTERS.isfahan_appointment), true);
});

test('all five phases exist with nodes, a departure, and reachable encounters', () => {
  assert.equal(PHASES.length, 5);
  assert.equal(LAST_PHASE, 5);
  for (const p of PHASES) {
    assert.ok(p.nodes.length >= 4, `phase ${p.id} too few nodes`);
    const poolSize = p.nodes.reduce((n, node) => n + node.encounters.length, 0);
    assert.ok(poolSize >= 11, `phase ${p.id} pool shrank below 11 encounters (${poolSize}) — AUDIT.md set the depth floor`);
    assert.ok(p.nodes.some((n) => n.departure), `phase ${p.id} has no departure node`);
    assert.ok(p.time >= 5, `phase ${p.id} time budget too small`);
    for (const n of p.nodes) {
      for (const id of n.encounters) {
        assert.ok(ENCOUNTERS[id], `phase ${p.id} node ${n.id} references missing encounter ${id}`);
        assert.equal(ENCOUNTERS[id].phase, p.id, `${id} is tagged phase ${ENCOUNTERS[id].phase} but sits in phase ${p.id}`);
      }
    }
  }
});

test('the historical trajectory is reachable and is not the only ending', () => {
  // Historical: loses the third inquisition, dies in exile, system survives via Yazdi.
  const hist = newRun();
  applyEffects(hist, {
    meters: { transmission: 7, synthesis: 7 }, rep: { scholarly: 4 },
    memory: { third_inquisition: 'lost', yazdi_copied: true, third_stance: 'firm' },
  }, 'test');
  const v1 = finalVerdict(hist);
  assert.equal(v1.man.key, 'exiled', 'the attested personal fate is reachable');
  assert.notEqual(v1.system.key, 'died', 'and the system can outlive him');

  // Divergent: protected court eminence, system hollowed out.
  const alt = newRun();
  applyEffects(alt, { rep: { imperial: 4 }, meters: { synthesis: 3, exposure: 2 } }, 'test');
  const v2 = finalVerdict(alt);
  assert.notEqual(v2.man.key, v1.man.key, 'a different life yields a different verdict');
  assert.equal(v2.system.key, 'appropriated');
});

test('every option that opens a contract or obligation is well-formed', () => {
  for (const enc of Object.values(ENCOUNTERS)) {
    for (const o of enc.options) {
      if (o.contract) {
        for (const k of ['id', 'name', 'deadline', 'promise', 'reward', 'failure']) {
          assert.ok(o.contract[k] != null, `${enc.id}/${o.id} contract missing ${k}`);
        }
        assert.ok(o.contract.deadline > 0, `${enc.id}/${o.id} contract deadline must be positive`);
      }
      if (o.grantsObligation) {
        for (const k of ['id', 'name', 'cost']) {
          assert.ok(o.grantsObligation[k] != null, `${enc.id}/${o.id} obligation missing ${k}`);
        }
      }
    }
  }
});

test('plate images reference files that are in the provenance registry', async () => {
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const here = fileURLToPath(new URL('.', import.meta.url));
  const registry = JSON.parse(readFileSync(here + '../../assets/manuscripts/registry.json', 'utf8'));
  const items = Array.isArray(registry) ? registry : (registry.assets || []);
  const known = new Set(items.map((a) => a.local_file));
  for (const enc of Object.values(ENCOUNTERS)) {
    if (!enc.plate) continue;
    const file = enc.plate.src.split('/').pop();
    assert.ok(known.has(file), `${enc.id} uses unregistered image ${file} (see CLAUDE.md: no asset without provenance)`);
    assert.ok(enc.plate.caption && enc.plate.caption.length > 10, `${enc.id} plate needs a provenance caption`);
  }
});

test('an open contract cannot outlive its phase — settling forces resolution', async () => {
  const { settleContracts } = await import('../src/engine/career.js?v=8');
  const s = newRun();
  offerContract(s, {
    id: 'c3', name: 'Boon', deadline: 9, promise: 'a demonstration',
    requires: ['meter:demonstration>=3'],
    reward: { rep: { imperial: 2 } }, failure: { rep: { imperial: -2 }, memory: { boon_failed: true } },
  });
  const ev = settleContracts(s);           // phase ends well before the deadline
  assert.equal(ev[0].outcome, 'failed', 'unmet promise comes due at phase end');
  assert.equal(s.rep.imperial, -2);
  assert.equal(s.memory.boon_failed, true);
  assert.equal(s.contracts.filter((c) => c.status === 'open').length, 0);
});

test('personal-fate axis is differentiated: distinct lives get distinct verdicts', () => {
  const profile = (fx) => { const s = newRun(); applyEffects(s, fx, 'test'); return finalVerdict(s).man.key; };

  const cases = {
    // the attested arc: refused to bend, condemned, exiled
    historical: profile({ memory: { third_inquisition: 'lost', third_stance: 'firm' }, meters: { exposure: 6 } }),
    // condemned and the work named in the judgment
    withBook: profile({ memory: { third_inquisition: 'lost', book_condemned: true }, meters: { exposure: 6 } }),
    // ran before the verdict
    fled: profile({ memory: { third_inquisition: 'lost', fled: true }, meters: { exposure: 5 } }),
    // survived by refusing — the rare defiant acquittal
    vindicated: profile({ memory: { third_inquisition: 'survived', third_stance: 'firm' }, meters: { exposure: 7 } }),
    // survived by other means
    acquitted: profile({ memory: { third_inquisition: 'survived', third_stance: 'patron' }, meters: { exposure: 7 } }),
    // said the words
    recanted: profile({ memory: { recanted: true }, meters: { exposure: 6 } }),
    // bought freedom with a friend
    informer: profile({ memory: { betrayed_friend: true, third_inquisition: 'survived' }, meters: { exposure: 6 } }),
    // beat the early tribunals, third never came
    harried: profile({ memory: { first_inquisition: 'won', second_inquisition: 'won' }, meters: { exposure: 6 } }),
    // court-protected, never accused
    eminent: profile({ rep: { imperial: 4 }, meters: { exposure: 3 } }),
    // stayed small
    unremarked: profile({ meters: { exposure: 1 } }),
    // visible but never acted on
    watched: profile({ meters: { exposure: 6 } }),
  };

  // Each profile should land on its own intended fate, not fall through to a generic one.
  assert.equal(cases.historical, 'exiled');
  assert.equal(cases.withBook, 'condemned_with_book');
  assert.equal(cases.fled, 'fugitive');
  assert.equal(cases.vindicated, 'vindicated');
  assert.equal(cases.acquitted, 'acquitted');
  assert.equal(cases.recanted, 'recanted');
  assert.equal(cases.informer, 'informer');
  assert.equal(cases.harried, 'harried');
  assert.equal(cases.eminent, 'eminent');
  assert.equal(cases.unremarked, 'unremarked');
  assert.equal(cases.watched, 'watched');

  // and no two of these lives share a verdict
  const keys = Object.values(cases);
  assert.equal(new Set(keys).size, keys.length, 'distinct lives collapsed onto the same fate: ' + JSON.stringify(cases));
});

test('the two Slice-1 playtest runs no longer collapse onto the same personal fate', () => {
  // Reproduces the actual states the two verified playthroughs ended in.
  const bold = newRun();
  applyEffects(bold, {
    rep: { orthodox: 3, occult: 5, scholarly: 5 }, meters: { exposure: 9, synthesis: 10, transmission: 10 },
    memory: { third_inquisition: 'survived', third_stance: 'firm', kept_judgeship: true, first_inquisition: 'won', second_inquisition: 'won' },
  }, 'test');
  const cautious = newRun();
  applyEffects(cautious, {
    rep: { orthodox: 5, scholarly: 4, imperial: 2 }, meters: { exposure: 1, synthesis: 10, transmission: 1 },
    memory: { kept_judgeship: true, wrote_creed: true },
  }, 'test');

  const vb = finalVerdict(bold), vc = finalVerdict(cautious);
  assert.equal(vb.man.key, 'vindicated', 'the defiant survivor is no longer filed as a quiet judge');
  // The cautious life genuinely is the Judge of Isfahan — bench kept, orthodox
  // standing high, never summoned. What matters is that it is no longer the same
  // verdict as the defiant survivor's.
  assert.equal(vc.man.key, 'judge');
  assert.notEqual(vb.man.key, vc.man.key);
  assert.notEqual(vb.system.key, vc.system.key);
  assert.equal(vc.system.key, 'unread', 'understood everything, transmitted nothing');
});

test('system-fate axis: Yazdi and condemnation produce their own outcomes', () => {
  const withYazdi = newRun();
  applyEffects(withYazdi, { meters: { transmission: 4, synthesis: 5 }, memory: { yazdi_copied: true } }, 'test');
  assert.equal(finalVerdict(withYazdi).system.key, 'one_hand');

  const indexed = newRun();
  applyEffects(indexed, { meters: { transmission: 3 }, memory: { book_condemned: true } }, 'test');
  assert.equal(finalVerdict(indexed).system.key, 'indexed');
});

// ---- audit-session lints ----------------------------------------------------

test('lint: no dead Quintet branches — every science is required or boosted after Cairo', () => {
  const used = { kimiya: 0, limiya: 0, himiya: 0, simiya: 0, rimiya: 0 };
  for (const enc of Object.values(ENCOUNTERS)) {
    if (enc.phase === 1) continue; // Cairo grants; later phases must spend
    for (const o of enc.options) {
      for (const r of [...(o.requires || []), ...(o.boosts || [])]) {
        const m = r.match(/^(kimiya|limiya|himiya|simiya|rimiya)>=/);
        if (m) used[m[1]]++;
      }
    }
  }
  for (const [sci, n] of Object.entries(used)) {
    assert.ok(n >= 1, `${sci} is granted in Cairo but never required/boosted in any later phase — a dead capability branch`);
  }
});

test('artifacts are load-bearing: artifact requirement resolves and names the work', () => {
  const s = newRun();
  const r1 = checkReq(s, 'artifact:tahawi_circle', PEOPLE, ARTIFACTS);
  assert.equal(r1.ok, false);
  assert.match(r1.text, /Ṭahawī Circle/);
  applyEffects(s, { artifacts: ['tahawi_circle'] }, 'test');
  assert.equal(checkReq(s, 'artifact:tahawi_circle', PEOPLE, ARTIFACTS).ok, true);

  // and content actually uses it: the third tribunal's firm stance is favored by the Circle
  const enc = ENCOUNTERS.trial_third;
  const firm = enc.options.find((o) => o.id === 'hold_firm');
  assert.ok(firm.boosts.includes('artifact:tahawi_circle'));
});

test('marginalia precedence: taught_widely + hoarded merge into one line', async () => {
  const s = newRun();
  applyEffects(s, { memory: { taught_widely: true, hoarded: true } }, 'test');
  const v = finalVerdict(s);
  const text = v.notes.join(' | ');
  assert.ok(/by turns/.test(text), 'merged tension line present');
  assert.ok(!/He taught widely, and lost control/.test(text), 'individual taught_widely line suppressed');
  assert.ok(!/qualified few were fewer/.test(text), 'individual hoarded line suppressed');
});

test('lexicon: every term defined is actually used somewhere a player can meet it', async () => {
  const { LEXICON } = await import('../content/lexicon.js?v=2');
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const here = fileURLToPath(new URL('.', import.meta.url));
  let corpus = '';
  for (const f of ['phase1.js', 'phase2.js', 'phase3.js', 'phase4.js', 'phase5.js']) {
    corpus += readFileSync(here + '../content/' + f, 'utf8');
  }
  corpus += readFileSync(here + '../src/ui.js', 'utf8'); // manual folio uses some directly
  const unusedTerms = Object.keys(LEXICON).filter((t) => !corpus.includes(t));
  assert.deepEqual(unusedTerms, [], 'lexicon terms never encountered in play: ' + JSON.stringify(unusedTerms));
});

test('log illustrations: a scholar contribution outranks a player one and raises a notification', async () => {
  const X = await import('../src/engine/export.js?v=2');
  const payload = { log: [{ encounterId: 'trial_first', rubric: 'THE TRIBUNAL' }], illustrations: [] };

  X.addIllustration(payload, 0, { src: 'data:,a', caption: 'from a player' },
    { name: 'someone', role: 'player' });
  X.addIllustration(payload, 0, { src: 'data:,b', caption: 'the actual manuscript',
    source: { repository: 'Chester Beatty', shelfmark: 'CBL Per 000' } },
    { name: 'Matthew Melvin-Koushki', role: 'scholar' });

  const q = X.reviewQueue(payload);
  assert.equal(q.length, 2, 'both pending');
  assert.equal(q[0].by.role, 'scholar', 'scholar sorts first in the review queue');
  assert.equal(X.notifyCount(payload), 1, 'only the scholar contribution interrupts');
  assert.equal(q[0].encounterId, 'trial_first', 'contribution is bound to the encounter, not just an index');
  assert.equal(q[0].source.shelfmark, 'CBL Per 000', 'provenance fields survive');
});

test('log illustrations: declining removes from the page but accepting keeps ordering', async () => {
  const X = await import('../src/engine/export.js?v=2');
  const payload = { log: [{ encounterId: 'pivot_begin' }], illustrations: [] };
  const a = X.addIllustration(payload, 0, { src: 'data:,a' }, { role: 'player' });
  const b = X.addIllustration(payload, 0, { src: 'data:,b' }, { role: 'scholar' });

  assert.equal(X.illustrationsFor(payload, 0).length, 2);
  assert.equal(X.illustrationsFor(payload, 0)[0].id, b.id, 'best-sourced first');

  X.setIllustrationStatus(payload, a.id, 'declined');
  assert.equal(X.illustrationsFor(payload, 0).length, 1, 'declined image drops off the page');
  X.setIllustrationStatus(payload, b.id, 'accepted');
  assert.equal(X.reviewQueue(payload).length, 0, 'nothing left pending');
  assert.throws(() => X.setIllustrationStatus(payload, b.id, 'nonsense'), /bad status/);
});

test('log illustrations: an unknown role degrades to player rather than throwing', async () => {
  const X = await import('../src/engine/export.js?v=2');
  const payload = { log: [{}], illustrations: [] };
  const rec = X.addIllustration(payload, 0, { src: 'data:,x' }, { role: 'archbishop' });
  assert.equal(rec.by.role, 'player');
  assert.equal(rec.notify, false, 'an unknown role must never trigger a notification');
});

// ---- the witness system: capture and payload --------------------------------

test('the run log captures an encounter as the game presented it', async () => {
  const X = await import('../src/engine/export.js?v=3');
  const s = newRun();
  applyEffects(s, { quintet: { rimiya: 1 } }, 'test');
  const enc = ENCOUNTERS.majlis_feast;
  const evs = evaluateOptions(s, enc, PEOPLE, ARTIFACTS);
  const chosen = evs.findIndex((e) => e.opt.id === 'wonder');
  const result = resolveOption(s, enc, evs[chosen], () => 0);

  const entry = X.logEntry(s, enc, evs, chosen, result);
  assert.equal(entry.encounterId, 'majlis_feast');
  assert.equal(entry.grounding, enc.grounding);
  assert.ok(entry.source, 'source pointer travels with the entry');
  assert.equal(entry.situation, enc.situation, 'situation frozen verbatim');
  assert.equal(entry.options.length, enc.options.length, 'every option offered is recorded, not just the chosen one');
  assert.equal(entry.options[chosen].chosen, true);
  assert.ok(entry.options.some((o) => o.locked), 'locked options and their reasons are part of the record');
  assert.ok(entry.chronicle.orig, 'the original chronicle line is kept for recovery');
  assert.equal(entry.chronicle.orig, entry.chronicle.current, 'current starts equal to original');
});

test('the published payload carries the whole scholarly log and empty editorial layers', async () => {
  const X = await import('../src/engine/export.js?v=3');
  const s = newRun();
  applyEffects(s, {
    meters: { transmission: 7, synthesis: 7 },
    memory: { third_inquisition: 'lost', yazdi_copied: true, circle_member: true },
  }, 'test');
  s.runLog = [{ i: 0, encounterId: 'circle_entry' }];

  const payload = X.buildChroniclePayload(s, finalVerdict(s), PHASES);
  assert.equal(payload.v, X.PAYLOAD_V);
  assert.equal(payload.log.length, 1, 'the run log travels');
  assert.ok(payload.meta.verdict.manTitle && payload.meta.verdict.systemTitle, 'both axes recorded');
  assert.ok(payload.attested.length >= 5, 'the attested-life comparison travels with the witness');
  assert.ok(payload.legacyNotes.length >= 1);
  assert.deepEqual(payload.revisions, [], 'editorial layers start empty');
  assert.deepEqual(payload.annotations, []);
  assert.deepEqual(payload.illustrations, []);
  assert.equal(payload.preface.orig, '', 'preface is editable but starts blank');
});

test('a new run starts with an empty run log', () => {
  assert.deepEqual(newRun().runLog, []);
});

test('exposure-conditional bands: the bottom rung appears only when watched', () => {
  const s = newRun();
  const enc = { id: 'x', options: [] };
  const opt = {
    id: 'risky', label: 'Risky', requires: [],
    outcomes: [
      { band: 'success', weight: 1, text: 'ok' },
      { band: 'disaster', weight: 100, min_exposure: 7, text: 'ruin' },
    ],
  };
  const ev = { opt, favoredBy: [], available: true, unlockedBy: [], lockedBy: [] };
  // Unremarked: the disaster band is filtered out entirely — rng pinned to its slot.
  let r = resolveOption(s, { ...enc, options: [opt] }, ev, () => 0.99);
  assert.equal(r.band, 'success', 'disaster unreachable while unwatched');
  // Denounced: the same choice now carries its bottom rung.
  const s2 = newRun();
  s2.meters.exposure = 8;
  r = resolveOption(s2, { ...enc, options: [opt] }, ev, () => 0.99);
  assert.equal(r.band, 'disaster', 'at Denounced the bottom rung is in the ladder');
});
