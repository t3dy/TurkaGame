// Engine + content sanity tests. Run: node --test CareerSim/tools/test-engine.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import { newRun, applyEffects, checkReq } from '../src/engine/state.js?v=1';
import { drawEncounter, evaluateOptions, resolveOption, encounterEligible, cairoVerdict, BANDS } from '../src/engine/engine.js?v=1';
import { PEOPLE, NODES, ENCOUNTERS, ARTIFACTS } from '../content/phase1.js?v=1';

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

test('lint: every memory flag written is read somewhere (when/requires/boosts/verdict)', () => {
  const written = new Set();
  const readers = new Set();
  const collect = (reqs) => (reqs || []).forEach((r) => {
    const m = r.match(/^!?mem:([a-z_]+)/);
    if (m) readers.add(m[1]);
  });
  for (const enc of Object.values(ENCOUNTERS)) {
    collect(enc.when);
    (enc.memory_writes || []).forEach((f) => written.add(f));
    for (const o of enc.options) {
      collect(o.requires);
      collect(o.boosts);
      Object.keys((o.effects || {}).memory || {}).forEach((f) => written.add(f));
      for (const out of o.outcomes) Object.keys((out.effects || {}).memory || {}).forEach((f) => written.add(f));
    }
  }
  // the ending's marginalia read these (engine.cairoVerdict)
  ['akhlati_public', 'akhlati_quiet', 'new_brethren', 'new_brethren_wary', 'qasim_bond', 'yazdi_bond',
    'lineages_declared', 'feast_performed', 'dervish_believed', 'dervish_exposed', 'dervish_open',
  ].forEach((f) => readers.add(f));
  for (const f of written) {
    assert.ok(readers.has(f), `memory flag "${f}" is written but never read (Chekhov's-gun lint)`);
  }
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
