// Engine + content sanity tests. Run: node --test CareerSim/tools/test-engine.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import { newRun, applyEffects, checkReq } from '../src/engine/state.js?v=2';
import { drawEncounter, evaluateOptions, resolveOption, encounterEligible, cairoVerdict, BANDS } from '../src/engine/engine.js?v=2';
import { NODES } from '../content/phase1.js?v=2';
import { PEOPLE, ARTIFACTS, ENCOUNTERS, PHASES, LAST_PHASE } from '../content/index.js?v=1';
import { addObligation, chargeObligations, offerContract, tickContracts, exposureTier, finalVerdict, LEGACY_NOTES } from '../src/engine/career.js?v=1';

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

  enc = drawEncounter(s, node, ENCOUNTERS);
  assert.equal(enc.id, 'circle_discipleship');
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
  const { settleContracts } = await import('../src/engine/career.js?v=2');
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
