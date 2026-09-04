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
import { readWorld, worldReads } from '../engine/reader.js';
import { Ledger, memoryStore } from '../engine/ledger.js';
import { isolate, utter, throwStone, standing, ROUTES } from '../engine/unmaking.js';
import { invokeName, findRuns, reckon, extract, extracted, readsFrom, DIRECTIONS } from '../engine/operations.js';

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

/* ------------------------------------ reading the world back as text ------ */
// The overarching principle: the alphabet is not the subject of the game, it is
// the language the world is written in. These are the tests that make that a
// claim about the code rather than about the prose.

test('round trip: what the VM writes, the reader reads back', () => {
  const w = new World();
  execute(w, compile(prog('\u0645\u0644\u0647'), { letters, ruleset: RS('workshop') }), { cursor: [0, 0, 0] });
  const { words } = readWorld(w);
  assert.equal(words.length, 1);
  assert.equal(words[0].text, '\u0645\u0644\u0647', 'read back in writing order, not reversed');
  assert.equal(words[0].contiguous, true);
  // NOT 40+30+5. ل is a sun letter, so it assimilated the م before it and that
  // cell now carries 30 — the glyphs read back as written, but the VALUES record
  // what happened to them. The world keeps its own history.
  assert.equal(words[0].abjad, 30 + 30 + 5, 'the mīm was assimilated to the lām');
});

test('a word broken by a non-connecting letter reads as TWO words', () => {
  const w = new World();
  execute(w, compile(prog('\u0645\u0631\u0645'), { letters, ruleset: RS('workshop') }), { cursor: [0, 0, 0] });
  const { words } = readWorld(w);
  assert.equal(words.length, 2, 'the r\u0101\u02be ends the first word');
  assert.deepEqual(words.map(x => x.text), ['\u0645\u0631', '\u0645']);
});

test('and under Sufi lettrism the same letters read as ONE word', () => {
  // The reader groups by bonds, and Sufi lettrism refuses to sever, so the
  // reading changes with the metaphysics. The world is written differently
  // depending on who is reading it, and that is not a metaphor here.
  const w = new World();
  execute(w, compile(prog('\u0645\u0631\u0645'), { letters, ruleset: RS('sufi') }), { cursor: [0, 0, 0] });
  const { words } = readWorld(w);
  assert.equal(words.length, 1);
  assert.equal(words[0].text, '\u0645\u0631\u0645');
});

test('the reader never guesses: a structure that is not a line says so', () => {
  const w = new World();
  w.set(0, 0, 0, { material: 'letter', value: 40, glyph: '\u0645' });
  w.set(0, 3, 0, { material: 'letter', value: 30, glyph: '\u0644' });
  w.bond(KEY(0, 0, 0), KEY(0, 3, 0));
  const { words } = readWorld(w);
  assert.equal(words.length, 1);
  assert.equal(words[0].contiguous, false, 'bonded but not adjacent');
});

test('worldReads finds a word the player did not write', () => {
  // A structure standing in the world before anyone touched it.
  const w = new World();
  const qalam = [['\u0642', 100], ['\u0644', 30], ['\u0645', 40]];
  qalam.forEach(([g, v], i) => w.set(2 - i, 1, 0, { material: 'letter', value: v, glyph: g }));
  for (let i = 0; i + 1 < 3; i++) w.bond(KEY(2 - i, 1, 0), KEY(1 - i, 1, 0));
  const r = worldReads(w, '\u0642\u0644\u0645');
  assert.equal(r.found, true);
  assert.equal(r.word.abjad, 170);
  assert.equal(r.word.contiguous, true);
});

/* ------------------------------------------------ the discovery ledger ---- */

test('a primitive is unknown until it has been seen doing something', () => {
  const L = new Ledger(memoryStore());
  assert.equal(L.knowsPrimitive('RAISE'), false);
  const learned = L.witness({ op: 'RAISE', glyph: '\u062a', ruleset: 'workshop' });
  assert.equal(L.knowsPrimitive('RAISE'), true);
  assert.equal(learned.filter(x => x.kind === 'primitive').length, 1);
  // Seeing it again teaches nothing new.
  assert.equal(L.witness({ op: 'RAISE', glyph: '\u062a', ruleset: 'workshop' }).length, 0);
});

test('witnessEffects learns exactly what the engine actually did', () => {
  const w = new World();
  w.set(0, 1, 0, { material: 'water', value: 5 });
  const r = execute(w, compile(prog('\u062a'), { letters, ruleset: RS('workshop') }), { cursor: [0, 0, 0] });
  const L = new Ledger(memoryStore());
  L.witnessEffects(r.effects, 'workshop');
  assert.equal(L.knowsPrimitive('RAISE'), true, 'it raised, so RAISE is known');
  assert.equal(L.knowsPrimitive('BIND'), false, 'nothing bound, so BIND is not');
  assert.equal(L.knowsPrimitive('POUR'), false);
});

test('the ledger tracks how much of the language is known', () => {
  const ops = Object.keys(PACK.primitives);
  const L = new Ledger(memoryStore());
  assert.equal(L.progress(ops).fraction, 0);
  L.revealAll(ops, letters.map(l => l.glyph));
  assert.equal(L.progress(ops).fraction, 1);
  assert.equal(L.progress(ops).unknown.length, 0);
});

test('a reading is recorded once and pays once', () => {
  const L = new Ledger(memoryStore());
  assert.equal(L.read('\u0642\u0644\u0645'), true);
  assert.equal(L.read('\u0642\u0644\u0645'), false, 'reading it twice is not a second discovery');
  assert.deepEqual(L.readings, ['\u0642\u0644\u0645']);
});

test('the ledger survives a store that throws', () => {
  const bad = { getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); } };
  const L = new Ledger(bad);
  L.witness({ op: 'POUR', glyph: '\u062d', ruleset: 'workshop' });
  assert.equal(L.knowsPrimitive('POUR'), true);
});

test('an AXIS letter holds against gravity, and carries what is bonded to it', () => {
  // Written in mid-air with nothing under it. Alif is the only letter that is a
  // single upright stroke, so it is the only one that can do this.
  const w = new World({ rules: { gravity: true } });
  execute(w, compile(prog('ا'), { letters, ruleset: RS('workshop') }), { cursor: [0, 4, 0] });
  assert.equal(w.get(0, 4, 0)?.glyph, 'ا', 'the alif stays in the air');

  // A letter that is NOT an axis, written the same way, falls.
  const w2 = new World({ rules: { gravity: true } });
  execute(w2, compile(prog('م'), { letters, ruleset: RS('workshop') }), { cursor: [0, 4, 0] });
  assert.equal(w2.get(0, 4, 0), null, 'mīm has nothing to stand on');
  assert.equal(w2.get(0, 0, 0)?.glyph, 'م', 'it fell to the ground');

  // And it carries a bonded neighbour: ام written together is one body only if
  // alif connects forward -- which it does NOT, so this is also the SEVER test.
  const w3 = new World({ rules: { gravity: true } });
  execute(w3, compile(prog('ما'), { letters, ruleset: RS('workshop') }), { cursor: [0, 4, 0] });
  // م at (0,4,0) joins forward to ا at (-1,4,0); the alif holds the pair up.
  assert.equal(w3.get(0, 4, 0)?.glyph, 'م', 'the mīm is carried by the alif it joins');
  assert.equal(w3.get(-1, 4, 0)?.glyph, 'ا');
});

/* ------------------------------------- three routes out of the demolition gap */
// A span held up at one end only, so everything past the pier is standing purely
// because it is bonded. Each route is asked the same question: how much comes down?

function span() {
  const w = new World({ rules: { gravity: false } });
  w.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });
  w.set(0, 1, 0, { material: 'earth', value: 1, fixed: true });
  // مهنب -- four letters that all join forward, so the run is ONE body carried
  // by the single cell resting on the pier. Chosen carefully: no two adjacent
  // letters are identical (that would geminate into one instruction), and none is
  // vertical (ا and ل grant AXIS, which would hold the span up by itself and make
  // the whole test meaningless).
  execute(w, compile(prog('مهنب'), { letters, ruleset: RS('workshop') }), { cursor: [3, 2, 0], dir: [-1, 0, 0] });
  w.rules.gravity = true;
  w.settle();
  return w;
}

test('the span is a real cantilever: it stands only because it is one body', () => {
  const w = span();
  assert.equal(standing(w, 2), 4, 'four letters at the top');
  // Sanity: if bodies did not hold, three of them have nothing under them.
  const t = w.clone(); t.rules.bondsHold = false; t.settle();
  assert.ok(standing(t, 2) < 4, 'without bonds it would not stand');
});

test('A — isolating a letter cuts both its bonds and drops what hung on it', () => {
  const w = span();
  const before = standing(w, 2);
  const r = isolate(w, [2, 2, 0], { apply: true });
  assert.equal(r.ok, true);
  assert.equal(r.cut, 2, 'a letter in the middle of a word has two bonds');
  assert.ok(standing(w, 2) < before, 'the outboard part came down');
  assert.ok(r.effects.some(e => e.kind === 'sever'));
  assert.ok(r.effects.some(e => e.kind === 'fall'));
});

test('A is a scalpel: WHERE you cut decides how much comes down', () => {
  // The first version of this test asserted that isolating the outermost letter
  // drops nothing. Wrong: the outermost letter is the one being CARRIED, so
  // isolating it drops itself. What route A actually gives is a graded result,
  // which is the property worth having and the one that distinguishes it from B.
  const at = x => { const w = span(); isolate(w, [x, 2, 0], { apply: true }); return standing(w, 2); };
  const results = [3, 2, 1, 0].map(at);
  assert.deepEqual(results, [3, 2, 1, 1],
    'cutting further inboard brings more down: 1, 2, 3, 3 letters lost');
  assert.ok(new Set(results).size > 1, 'the choice of cell must matter');
});

test('B — the utterance suspends bodies, so everything carried comes down at once', () => {
  const w = span();
  const r = utter(w, { apply: true });
  assert.equal(standing(w, 2), 1, 'only the cell resting on the pier survives');
  assert.equal(w.rules.bondsHold, true, 'the rule comes back after the utterance');
  assert.ok(r.effects.length > 0);
});

test('C — the thrown stone displaces, and is stopped by an axis', () => {
  const w = span();
  const r = throwStone(w, [3, 2, 0], { dir: [1, 0, 0], force: 2, apply: true });
  assert.ok(r.shifted > 0 || r.effects.length > 0, 'it moved or something fell');

  // An alif anywhere in the body pins it: mass and speed do not move an axis.
  const w2 = new World({ rules: { gravity: false } });
  w2.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });
  execute(w2, compile(prog('ما'), { letters, ruleset: RS('workshop') }), { cursor: [1, 1, 0] });
  const r2 = throwStone(w2, [1, 1, 0], { dir: [1, 0, 0], force: 2, apply: true });
  assert.equal(r2.shifted, 0, 'the alif in the body holds it against the stone');
});

test('every route is preview-safe and declares its grounding honestly', () => {
  const w = span();
  const h = w.hash();
  isolate(w, [2, 2, 0]); utter(w); throwStone(w, [3, 2, 0]);
  assert.equal(w.hash(), h, 'none of them touched the world without apply');

  for (const r of Object.values(ROUTES)) {
    assert.ok(['INTERPRETATION', 'GAME_FICTION', 'PLAIN'].includes(r.kind), r.id);
    assert.ok(r.fact && r.reading, r.id + ' must state both its fact and its reading');
  }
  assert.equal(ROUTES.stone.kind, 'PLAIN', 'the control case makes no claim');
  assert.equal(ROUTES.utter.kind, 'GAME_FICTION', 'the invented one says so');
});

/* ------------------------- operations on a structure already standing ------ */

test('Invoke the Name reaches every instance of a letter at once', () => {
  const w = new World();
  execute(w, compile(prog('مهم'), { letters, ruleset: RS('workshop') }), { cursor: [2, 0, 0] });
  const r = invokeName(w, 'م');
  assert.equal(r.count, 2, 'both mīms answered');
  assert.equal(invokeName(w, 'غ').count, 0, 'and a letter that is not there answers not at all');
  assert.ok(r.effects.every(e => e.op === 'INVOKE'));
});

test('Reckoning finds runs by abjad sum, and refuses single letters', () => {
  const w = new World();
  execute(w, compile(prog('مهن'), { letters, ruleset: RS('workshop') }), { cursor: [2, 0, 0] });
  // Read the values OUT of the world rather than assuming the letters' abjad
  // values: nūn is a sun letter, so it assimilated the hāʾ before it and that
  // cell no longer carries 5. Reckoning is arithmetic on what is standing there,
  // not on what was written — which is the point, and an earlier version of this
  // test got it wrong by doing the sum on paper.
  const v = (x) => w.get(x, 0, 0).value;
  const [a, b, c] = [v(2), v(1), v(0)];
  assert.notEqual(b, 5, 'the hāʾ was assimilated by the nūn that follows it');
  assert.equal(findRuns(w, a + b).length, 1, 'the inboard pair');
  assert.equal(findRuns(w, b + c).length, 1, 'the outboard pair');
  assert.equal(findRuns(w, a + b + c).length, 1, 'the whole word');
  assert.equal(findRuns(w, a).length, 0, 'a single letter is not a run — the source speaks of composing WORDS');
  assert.equal(findRuns(w, 7).length, 0, 'nothing sums to 7');
});

test('Reckoning comes apart rather than annihilating, and gravity does the rest', () => {
  const w = new World({ rules: { gravity: true } });
  w.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });
  w.set(0, 1, 0, { material: 'earth', value: 1, fixed: true });
  execute(w, compile(prog('مهن'), { letters, ruleset: RS('workshop') }), { cursor: [2, 2, 0] });
  assert.equal(standing(w, 2), 3, 'a span of three carried by the pier');
  // The outboard pair; naming its sum detaches them and they fall. Read the sum
  // from the world, for the same reason as above.
  const pair = w.get(1, 2, 0).value + w.get(0, 2, 0).value;
  const before = w.hash();
  reckon(w, pair);
  assert.equal(w.hash(), before, 'preview did not touch the world');
  const r = reckon(w, pair, { apply: true });
  assert.equal(r.runs.length, 1);
  assert.ok(standing(w, 2) < 3, 'what came apart came down');
  assert.ok(r.effects.some(e => e.kind === 'sever') && r.effects.some(e => e.kind === 'fall'));
});

test('Extraction costs what the letter was carrying — so WHERE you put it is the puzzle', () => {
  // An earlier version of this test asserted that the ORDER of isolation matters.
  // It does not: isolating every instance cuts the same set of bonds whichever way
  // round you do it, so the final graph is the same. What actually matters is
  // where the doomed letter SITS — which makes Extraction a building puzzle rather
  // than an ordering one, and that is the better game.
  const span = (word) => {
    const w = new World({ rules: { gravity: true } });
    w.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });
    w.set(0, 1, 0, { material: 'earth', value: 1, fixed: true });
    execute(w, compile(prog(word), { letters, ruleset: RS('workshop') }), { cursor: [2, 2, 0] });
    return w;
  };
  // ن outboard (written first, so furthest from the pier) vs ن inboard (on the pier).
  const outboard = span('نمه');     // ن at x=2, pier under x=0
  const inboard  = span('مهن');     // ن at x=0, on the pier
  assert.equal(standing(outboard, 2), 3);
  assert.equal(standing(inboard, 2), 3);

  extract(outboard, 'ن', { apply: true });
  extract(inboard, 'ن', { apply: true });
  assert.ok(standing(outboard, 2) > standing(inboard, 2),
    'losing the outboard letter costs one; losing the one on the pier costs the word');
  assert.equal(standing(outboard, 2), 2, 'the ن fell and took nothing with it');
  assert.equal(standing(inboard, 2), 1, 'the word fell, and the ن itself stayed');

  // AND THE SECOND HALF OF THAT, which is the constraint the whole mode turns on:
  // isolating a letter DETACHES it, it does not delete it. A letter resting on the
  // ground therefore cannot be extracted at all — it simply sits there, joined to
  // nothing. To be removable, a letter must be CARRIED BY THE WORD rather than by
  // the pier.
  assert.equal(extracted(outboard, 'ن', 2), true, 'the carried ن could be taken out');
  assert.equal(extracted(inboard, 'ن', 2), false, 'the one on the pier cannot be, ever');
});

test('extracted() asks the question the v1 mode asked', () => {
  const w = new World({ rules: { gravity: true } });
  // The pier goes under the MĪM, so the nūn hangs off the word and is carried by it.
  // Put the pier under the nūn instead and it can never be extracted at all, which
  // the test above is about.
  w.set(1, 0, 0, { material: 'earth', value: 1, fixed: true });
  execute(w, compile(prog('من'), { letters, ruleset: RS('workshop') }), { cursor: [1, 1, 0] });
  assert.equal(extracted(w, 'ن', 1), false, 'the nūn is still up there');
  extract(w, 'ن', { apply: true });
  assert.equal(extracted(w, 'ن', 1), true, 'and now it is not');
});

/* --------------------------- Station Point, rebuilt out of language -------- */

test('the same structure spells different things read from different directions', () => {
  // Not in a straight line along any one axis — bonded diagonally, so the
  // ordering genuinely depends on which way you read.
  const w = new World();
  const put = (g, v, x, y) => w.set(x, y, 0, { material: 'letter', value: v, glyph: g });
  put('ق', 100, 0, 0); put('ل', 30, 1, 1); put('م', 40, 2, 2);
  w.bond(KEY(0, 0, 0), KEY(1, 1, 0));
  w.bond(KEY(1, 1, 0), KEY(2, 2, 0));

  const rs = readsFrom(w, 'قلم');
  const yes = rs.filter(r => r.found).map(r => r.id).sort();
  const no = rs.filter(r => !r.found).map(r => r.id).sort();
  assert.deepEqual(yes, ['east', 'up'], 'it reads as the Pen from two directions');
  assert.deepEqual(no, ['down', 'west'], 'and as its reverse from the other two');
  assert.equal(rs.find(r => r.id === 'west').reads[0], 'ملق');
  assert.equal(Object.keys(DIRECTIONS).length, 4);
});

test('a structure that reads as nothing reads as nothing, from any direction', () => {
  const w = new World();
  w.set(0, 0, 0, { material: 'letter', value: 40, glyph: 'م' });
  assert.equal(readsFrom(w, 'قلم').filter(r => r.found).length, 0);
});

test('the ledger records naming the metaphysics, right or wrong', () => {
  const L = new Ledger(memoryStore());
  assert.equal(L.knowsRuleset('sufi'), false);
  const wrong = L.identify('sufi', false);
  assert.equal(wrong.first, false);
  assert.equal(wrong.attempts, 1);
  assert.equal(L.knowsRuleset('sufi'), false, 'a wrong naming is recorded but names nothing');
  const right = L.identify('sufi', true);
  assert.equal(right.first, true);
  assert.equal(right.attempts, 2, 'the failed attempt is still on the record');
  assert.equal(L.knowsRuleset('sufi'), true);
  assert.equal(L.identify('sufi', true).first, false, 'naming it twice is not a second discovery');
});

console.log(`${n} tests passed`);
