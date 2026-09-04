// engine.test.mjs — the v2 core, checked deterministically.
//
//   node v2/tests/engine.test.mjs
//
// The load-bearing test is `preview and execute agree`. Everything else in the
// preview system rests on it.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { World, KEY } from '../engine/world.js';
import { compile, run, preview, execute, describeLetter, ladderStep, LADDER } from '../engine/vm.js';

const here = dirname(fileURLToPath(import.meta.url));
const DATA = JSON.parse(readFileSync(join(here, '..', 'data', 'letters.json'), 'utf8'));
const PACK = JSON.parse(readFileSync(join(here, '..', 'rulesets', 'rulesets.json'), 'utf8'));
const letters = DATA.letters;
const RS = id => PACK.rulesets.find(r => r.id === id);
const by = g => letters.find(l => l.glyph === g);

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };
const prog = (s, register = 'written') => [...s].map(glyph => ({ glyph, register }));

/* ------------------------------------------------------------------ letters */

test('the four divisions are independent facts, not one fact told four times', () => {
  assert.equal(letters.length, 28);
  const sun = letters.filter(l => l.grammar.sun).length;
  const light = letters.filter(l => l.class === 'nurani').length;
  const nonconn = letters.filter(l => !l.grammar.connects_forward).length;
  assert.equal(sun, 14); assert.equal(light, 14); assert.equal(nonconn, 6);
  const both = letters.filter(l => l.grammar.sun && l.class === 'nurani').length;
  assert.ok(both > 2 && both < 12, `sun and light overlap on ${both}/14 — must not be the same split`);
  assert.equal(both, 6);
});

test('every primitive is derived from a stated observable fact', () => {
  for (const l of letters) {
    assert.ok(l.primitives.length > 0, `${l.glyph} does nothing at all`);
    for (const p of l.primitives) {
      assert.ok(p.from && p.from.length > 5, `${l.glyph} ${p.op} has no stated derivation`);
      assert.ok(PACK.primitives[p.op], `${p.op} is not a declared primitive`);
    }
  }
  // The census is a consequence of the alphabet, not a design choice.
  const census = {};
  for (const l of letters) for (const p of l.primitives) census[p.op] = (census[p.op] || 0) + 1;
  assert.deepEqual(census, { AXIS: 2, RAISE: 12, LOWER: 3, BIND: 9, POUR: 17,
                             SEVER: 6, ASSIMILATE: 14, DISTINGUISH: 14 });
});

test('alif is the axis and nothing else but its moon-letter boundary', () => {
  const ops = by('ا').primitives.map(p => p.op);
  assert.deepEqual(ops, ['AXIS', 'SEVER', 'DISTINGUISH']);
  assert.equal(by('ا').abjad, 1);
  assert.equal(by('ا').grammar.connects_forward, false, 'alif joins nothing after it');
});

test('the ladder is the abjad series and a step is a rung', () => {
  assert.deepEqual(LADDER, letters.map(l => l.abjad));
  assert.equal(ladderStep(9, 1), 10);
  assert.equal(ladderStep(10, 1), 20);
  assert.equal(ladderStep(40, -3), 10);
  assert.equal(ladderStep(15, 1), 20);
  assert.equal(ladderStep(15, -1), 10);
});

/* ----------------------------------------------------------------- rulesets */

test('every ruleset declares a motive, a grounding kind, and its own interpretation', () => {
  for (const r of PACK.rulesets) {
    assert.ok(r.motive && r.motive.length > 20, `${r.id} has no motive`);
    assert.ok(['PORTAL', 'CORPUS', 'REPORTED', 'INTERPRETATION', 'GAME_FICTION'].includes(r.kind));
    assert.ok(r.interpretation_note, `${r.id} does not say what in it is ours`);
    if (r.kind === 'PORTAL') assert.ok(r.sources.length > 0, `${r.id} claims PORTAL with no sources`);
    if (r.kind === 'GAME_FICTION') assert.equal(r.sources.length, 0, `${r.id} is fiction but cites sources`);
    for (const s of r.sources) assert.ok(s.supports && s.supports.length > 20, `${r.id}/${s.slug} does not say what it supports`);
  }
});

test('the rulesets genuinely disagree: each grants a different set', () => {
  const sets = PACK.rulesets.map(r => r.grants.slice().sort().join(','));
  assert.ok(new Set(sets).size >= 3, 'at least three distinct instruction sets');
  assert.deepEqual(RS('sufi').denies && Object.keys(RS('sufi').denies), ['SEVER']);
  assert.deepEqual(Object.keys(RS('gnostic-messianic').denies).sort(), ['AXIS', 'SEVER']);
  assert.deepEqual(RS('gnostic-messianic').registers, ['written']);
  assert.equal(RS('gnostic-messianic').reversible, false);
});

/* ------------------------------------------------------------------- compile */

test('a ruleset refuses what it denies, and says why in the diagnostics', () => {
  // ر rāʾ is non-connecting, so it carries SEVER.
  assert.ok(by('ر').primitives.some(p => p.op === 'SEVER'));
  const inTellect = compile(prog('ر'), { letters, ruleset: RS('intellectual') });
  assert.ok(inTellect.instructions[0].ops.some(o => o.op === 'SEVER'));
  const sufi = compile(prog('ر'), { letters, ruleset: RS('sufi') });
  assert.equal(sufi.instructions[0].ops.some(o => o.op === 'SEVER'), false);
  const refusal = sufi.diagnostics.find(d => d.op === 'SEVER');
  assert.ok(refusal && /barzakh/.test(refusal.why), 'the refusal states the reason from the ruleset');
});

test('a register a ruleset does not admit is an error, not a silent no-op', () => {
  const c = compile(prog('ب', 'spoken'), { letters, ruleset: RS('gnostic-messianic') });
  assert.equal(c.instructions.length, 0);
  assert.ok(c.diagnostics.some(d => d.level === 'error' && /spoken/.test(d.why)));
});

test('gemination is the loop: a doubled letter repeats, and it comes from orthography', () => {
  const c = compile(prog('تت'), { letters, ruleset: RS('workshop') });
  assert.equal(c.instructions.length, 1);
  assert.equal(c.instructions[0].repeat, 2);
  assert.equal(c.instructions[0].geminated, true);
});

test('power: proportion rewards small-integer ratios, procedure is all-or-nothing', () => {
  // ا=1 ب=2 → 1:2, consonant. ا=1 غ=1000 → 1:1000, not.
  const good = compile(prog('اب'), { letters, ruleset: RS('intellectual') }).power;
  const bad = compile(prog('اغ'), { letters, ruleset: RS('intellectual') }).power;
  assert.ok(good.value > bad.value, `${good.value} should beat ${bad.value}`);
  assert.equal(good.value, 1);
  assert.equal(bad.value, 0.25);

  const short = compile(prog('اب'), { letters, ruleset: RS('ottoman-operative') }).power;
  assert.equal(short.value, 0, 'two letters is not a completed procedure');
  assert.ok(/at least 3/.test(short.why));
  const full = compile(prog('ابج'), { letters, ruleset: RS('ottoman-operative') }).power;
  assert.equal(full.value, 1);
});

test('power: luminosity rises with light letters', () => {
  const dark = compile(prog('بج'), { letters, ruleset: RS('sufi') }).power;   // both ẓulmānī
  const light = compile(prog('الم'), { letters, ruleset: RS('sufi') }).power;  // all nūrānī
  assert.equal(dark.value, 0.4);
  assert.equal(light.value, 1);
});

/* ------------------------------------------------------- the central promise */

test('preview and execute agree, cell for cell — they are one function', () => {
  for (const id of PACK.rulesets.map(r => r.id)) {
    const ruleset = RS(id);
    const register = ruleset.registers.includes('written') ? 'written' : ruleset.registers[0];
    const w = new World();
    w.set(0, 1, 0, { material: 'water', value: 5 });
    w.set(-3, 0, 0, { material: 'stone', value: 3 });
    const c = compile(prog('نمر', register), { letters, ruleset });
    const p = preview(w, c, { cursor: [0, 0, 0] });
    const before = w.hash();
    assert.equal(w.hash(), before, `${id}: preview touched the world`);
    const e = execute(w, c, { cursor: [0, 0, 0] });
    assert.equal(e.world.hash(), p.world.hash(), `${id}: preview and execution disagree`);
    assert.deepEqual(e.effects.map(x => x.kind + JSON.stringify(x.at)),
                     p.effects.map(x => x.kind + JSON.stringify(x.at)), `${id}: effect lists differ`);
  }
});

/* ------------------------------------------------------------------ registers */

test('the three registers are plan, act, persist', () => {
  const ruleset = RS('workshop');
  const mk = reg => {
    const w = new World();
    const c = compile(prog('م', reg), { letters, ruleset });
    return execute(w, c, { cursor: [0, 0, 0] });
  };
  // Written leaves the letter standing; spoken does not; mental changes nothing.
  assert.equal(mk('written').world.list().filter(c => c.glyph).length, 1);
  assert.equal(mk('spoken').world.list().filter(c => c.glyph).length, 0);
  assert.equal(mk('mental').world.list().length, 0);
});

test('a written program IS the building: the letters remain where they were set', () => {
  const w = new World();
  const c = compile(prog('مله'), { letters, ruleset: RS('workshop') });
  execute(w, c, { cursor: [0, 2, 0] });
  // Right to left from the cursor: م at x=0, ل at x=-1, ه at x=-2.
  assert.equal(w.get(0, 2, 0).glyph, 'م');
  assert.equal(w.get(-1, 2, 0).glyph, 'ل');
  assert.equal(w.get(-2, 2, 0).glyph, 'ه');
});

/* ---------------------------------------------------------------- operations */

test('RAISE lifts what is above by rungs of the ladder', () => {
  const w = new World();
  w.set(0, 1, 0, { material: 'water', value: 5 });
  const c = compile(prog('ت'), { letters, ruleset: RS('workshop') });   // tāʾ: 2 dots above
  const r = execute(w, c, { cursor: [0, 0, 0] });
  assert.equal(w.get(0, 1, 0).value, 7, '5 raised two rungs');
  assert.ok(r.effects.some(e => e.kind === 'raise' && e.to_value === 7));
});

test('POUR drops what is above to the first empty cell below', () => {
  const w = new World();
  w.set(0, 1, 0, { material: 'water', value: 5 });
  w.set(0, -1, 0, { material: 'stone', value: 1 });
  const c = compile(prog('ح'), { letters, ruleset: RS('workshop') });   // ḥāʾ: tail only
  execute(w, c, { cursor: [0, 0, 0] });
  assert.equal(w.get(0, 1, 0), null);
  assert.equal(w.get(0, -2, 0).material, 'water', 'it fell past the stone');
});

test('BIND works ACROSS the writing line, because the line holds the letters', () => {
  // The two stones sit either side of the letter in z, not in x: x is where the
  // rest of the program stands. A failing test found this; the first version aimed
  // BIND along the writing line and could only ever bind a letter to a letter.
  const w = new World();
  w.set(0, 0, 1, { material: 'stone', value: 1 });
  w.set(0, 0, -1, { material: 'stone', value: 2 });
  const r = execute(w, compile(prog('ه'), { letters, ruleset: RS('workshop') }), { cursor: [0, 0, 0] });
  assert.ok(r.effects.some(e => e.kind === 'bind'), 'hāʾ is a closed form, so it binds');
  assert.equal(w.body(KEY(0, 0, 1)).size, 2, 'the two stones are one body');
});

test('ASSIMILATE is the grammar: the letter before a sun letter takes its value', () => {
  // al-shams → ash-shams. The article's lām, which precedes, becomes the sun
  // letter. Here the preceding LETTER of the program stands in for the article.
  assert.equal(by('ن').grammar.sun, true, 'nūn is a sun letter');
  assert.equal(by('م').grammar.sun, false, 'mīm is a moon letter');
  const w = new World();
  execute(w, compile(prog('بن'), { letters, ruleset: RS('workshop') }), { cursor: [0, 0, 0] });
  assert.equal(w.get(0, 0, 0).value, 50, 'bāʾ (2) assimilated to nūn (50)');

  // Before a MOON letter nothing assimilates: al-qamar stays al-qamar.
  const w2 = new World();
  execute(w2, compile(prog('بم'), { letters, ruleset: RS('workshop') }), { cursor: [0, 0, 0] });
  assert.equal(w2.get(0, 0, 0).value, 2, 'bāʾ keeps its own value before mīm');
});

/* --------------------------------------------------------------- world rules */

test('gravity is a rule, off by default, and turning it on makes things fall', () => {
  const w = new World();
  w.set(0, 5, 0, { material: 'stone', value: 1 });
  w.settle();
  assert.equal(w.get(0, 5, 0).material, 'stone', 'nothing falls while gravity is off');
  w.rules.gravity = true;
  const moved = w.settle();
  assert.ok(moved.length > 0);
  assert.equal(w.get(0, 0, 0).material, 'stone', 'it fell to the ground');
});

test('a bound body is supported if any of its cells is', () => {
  const w = new World({ rules: { gravity: true } });
  w.set(0, 0, 0, { material: 'stone', value: 1 });       // on the ground
  w.set(1, 3, 0, { material: 'stone', value: 1 });        // in the air
  w.bond(KEY(0, 0, 0), KEY(1, 3, 0));
  w.settle();
  assert.equal(w.get(1, 3, 0).material, 'stone', 'the bond carries it');
});

/* ------------------------------------------------------------- letter frames */

test('describeLetter answers with evidence AND affordance, and names what is ours', () => {
  const d = describeLetter('ر', { letters, ruleset: RS('sufi'), registers: PACK.registers });
  assert.equal(d.abjad, 200);
  assert.ok(d.granted.length > 0);
  const sev = d.refused.find(r => r.op === 'SEVER');
  assert.ok(sev, 'the refusal is reported, not hidden');
  assert.ok(/barzakh/.test(sev.why));
  assert.ok(d.ruleset.sources.length > 0 && d.ruleset.sources[0].supports);
  assert.ok(d.ruleset.interpretation_note.length > 20);
});

test('the same letter is described differently under different metaphysics', () => {
  const a = describeLetter('ر', { letters, ruleset: RS('intellectual'), registers: PACK.registers });
  const b = describeLetter('ر', { letters, ruleset: RS('sufi'), registers: PACK.registers });
  assert.notDeepEqual(a.granted.map(g => g.op), b.granted.map(g => g.op));
});

/* --------------------------------------------- the payoff the brief asks for */

test('a written word is one body, and the six non-connecting letters break it', () => {
  const bodies = ruleset => {
    const w = new World();
    const reg = ruleset.registers.includes('written') ? 'written' : ruleset.registers[0];
    execute(w, compile(prog('مرم', reg), { letters, ruleset }), { cursor: [0, 0, 0] });
    const seen = new Set(); let count = 0;
    for (const k of w.cells.keys()) { if (seen.has(k)) continue; for (const m of w.body(k)) seen.add(m); count++; }
    return count;
  };
  // مرم: mīm joins forward, rāʾ never does. Three letters, two bodies.
  assert.equal(by('ر').grammar.connects_forward, false);
  assert.equal(bodies(RS('workshop')), 2, 'the word breaks at the rāʾ');
  // Sufi lettrism denies SEVER — "the chain of being is not cut" — so the same
  // three letters are ONE body there. Same program, two different worlds.
  assert.equal(bodies(RS('sufi')), 1, 'Sufi lettrism bonds straight through the break');
});

test('and that difference is structural: under gravity the broken word falls apart', () => {
  const standing = ruleset => {
    const w = new World({ rules: { gravity: true } });
    w.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });   // one pier, under the first letter
    const reg = ruleset.registers.includes('written') ? 'written' : ruleset.registers[0];
    execute(w, compile(prog('مرم', reg), { letters, ruleset }), { cursor: [0, 1, 0] });
    return w.list().filter(c => c.glyph && c.y === 1).length;
  };
  // مر are bonded (mīm joins forward) and sit over the pier, so both are carried;
  // the second م is on the far side of the break and has nothing under it.
  assert.equal(standing(RS('workshop')), 2, 'the word broke at the rāʾ and half of it fell');
  assert.equal(standing(RS('sufi')), 3, 'bonded straight through, the whole word is carried');
});

console.log(`${n} tests passed`);
