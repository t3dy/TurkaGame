// engine.test.mjs — deterministic checks on the Letter Machine's rules.
//
//   node games/letter-machine/tests/engine.test.mjs
//
// No framework, exit 1 on first failure, output paste-able into a commit message.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { Machine, solve, formOps, ladderStep, LADDER } from '../src/engine.js';

const here = dirname(fileURLToPath(import.meta.url));
const AT = join(here, '..', '..', 'abjad-tower', 'data');
const letters = JSON.parse(readFileSync(join(AT, 'letters.json'), 'utf8')).letters;
const schemes = JSON.parse(readFileSync(join(AT, 'correspondences.json'), 'utf8')).schemes;
const puzzles = JSON.parse(readFileSync(join(here, '..', 'data', 'puzzles.json'), 'utf8')).puzzles;
const by = g => letters.find(l => l.glyph === g);
const puzzle = id => puzzles.find(p => p.id === id);

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

/* ----------------------------------------------------------------- ladder */

test('the ladder is the abjad series, 1..1000, 28 rungs', () => {
  assert.equal(LADDER.length, 28);
  assert.deepEqual(LADDER.slice(0, 10), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(letters.map(l => l.abjad), LADDER, 'the letters ARE the ladder');
});

test('a step is a rung, not an increment; off-ladder values take the next rung', () => {
  assert.equal(ladderStep(5, 1), 6);
  assert.equal(ladderStep(9, 1), 10);
  assert.equal(ladderStep(10, 1), 20);
  assert.equal(ladderStep(40, -3), 10);
  assert.equal(ladderStep(15, 1), 20, '15 raised once is the rung above it');
  assert.equal(ladderStep(15, -1), 10, '15 lowered once is the rung below it');
  assert.equal(ladderStep(1, -5), 1, 'clamped at the bottom');
  assert.equal(ladderStep(1000, 5), 1000, 'clamped at the top');
  assert.equal(ladderStep(7, 0), 7);
});

/* --------------------------------------------------------------- opcodes */

test("a letter's program is derived from its written form, not looked up", () => {
  const ops = g => formOps(by(g)).map(o => o.op + (o.n > 1 ? o.n : '')).join('+');
  assert.equal(ops('ا'), 'AXIS', 'alif is a line, not an ingredient');
  assert.equal(ops('ب'), 'LOWER', 'the dot of bāʾ sits below');
  assert.equal(ops('د'), '', 'dāl is inert — no dots, open, no tail');
  assert.equal(ops('ك'), '', 'kāf too');
  assert.equal(ops('م'), 'BIND+POUR');
  assert.equal(ops('ق'), 'RAISE2+BIND+POUR', 'qāf is the busiest letter on the board');
  assert.equal(ops('ش'), 'RAISE3+POUR');
});

test('the opcode census matches the alphabet', () => {
  const tally = {};
  for (const l of letters) for (const o of formOps(l)) tally[o.op] = (tally[o.op] || 0) + 1;
  assert.deepEqual(tally, { AXIS: 2, LOWER: 3, POUR: 17, BIND: 9, RAISE: 12 });
  assert.equal(letters.filter(l => formOps(l).length === 0).length, 2, 'two inert letters');
});

/* ------------------------------------------------------------- execution */

function machine(id, extra = {}) {
  return new Machine({ letters, schemes, puzzle: { ...puzzle(id), ...extra } });
}

test('RAISE then POUR: a column of letters is a pipeline', () => {
  const m = machine('the-pipeline');
  assert.ok(m.apply({ move: 'place', hand: 0, r: 1, c: 1 }).ok);   // ز
  assert.ok(m.apply({ move: 'place', hand: 0, r: 3, c: 1 }).ok);   // خ
  m.run();
  const S = m.substances();
  assert.equal(S.length, 1);
  assert.equal(S[0].value, 7, '5 raised, poured, raised again');
  assert.equal(S[0].r, 4, 'and it ended at the bottom');
  assert.equal(m.check().win, true);
});

test('BIND gathers leftward, and the run reads right to left', () => {
  const m = machine('reckoning');
  m.apply({ move: 'place', hand: 0, r: 1, c: 1 });   // ه at the left gap
  m.apply({ move: 'place', hand: 0, r: 1, c: 3 });   // ط at the right gap
  m.run();
  const S = m.substances();
  assert.equal(S.length, 1, 'all three gathered into one');
  assert.equal(S[0].value, 12);
  assert.equal(S[0].c, 0, 'the sum gathered leftward');
  // If the run read LEFT to right the right-hand bind would find an empty cell and
  // only 7 would survive. This is the whole lesson of the puzzle.
});

test('a moved dot changes the operation; a dot taken away removes it', () => {
  const m = machine('the-dot');
  m.apply({ move: 'place', hand: 0, r: 1, c: 1 });                 // ش, dots above
  let probe = m.clone(); probe.run();
  assert.equal(probe.substances()[0].value, 40, 'dots above do nothing to what is below');
  assert.ok(m.apply({ move: 'movedot', r: 1, c: 1, pos: 'below' }).ok);
  m.run();
  assert.equal(m.substances()[0].value, 10, '40 lowered three rungs');
  assert.equal(m.check().win, true);

  const m2 = machine('the-dot');
  m2.apply({ move: 'place', hand: 1, r: 1, c: 1 });                // ب, dots below
  m2.apply({ move: 'movedot', r: 1, c: 1, pos: 'none' });
  m2.run();
  assert.equal(m2.substances()[0].value, 40, 'a dotless bāʾ is inert');
});

test('AXIS holds a column: alif refuses to let a bind take from it', () => {
  const p = { id: 't', rows: 3, cols: 5, hand: ['ه', 'ا'], dot_moves: 0, transposes: 0,
    scheme: 'mizaj-cyclic', goal: { type: 'produce', value: 7 },
    blocks: [{ r: 1, c: 0, element: 'fire', value: 3 }, { r: 1, c: 2, element: 'fire', value: 4 }] };
  const free = new Machine({ letters, schemes, puzzle: p });
  free.apply({ move: 'place', hand: 0, r: 1, c: 1 });
  free.run();
  assert.equal(free.check().win, true, 'without the axis, the bind makes 7');

  const held = new Machine({ letters, schemes, puzzle: p });
  held.apply({ move: 'place', hand: 0, r: 1, c: 1 });   // ه
  held.apply({ move: 'place', hand: 0, r: 0, c: 2 });   // ا above the right input
  held.run();
  assert.equal(held.check().win, false, 'the held column will not be bound away');
});

test('alif takes no alif: two do not make two', () => {
  const p = { id: 't', rows: 3, cols: 3, hand: ['ا', 'ا'], dot_moves: 0, transposes: 0,
    scheme: 'mizaj-cyclic', goal: { type: 'produce', value: 1 }, blocks: [] };
  const m = new Machine({ letters, schemes, puzzle: p });
  assert.ok(m.apply({ move: 'place', hand: 0, r: 1, c: 1 }).ok);
  const bad = m.apply({ move: 'place', hand: 0, r: 1, c: 2 });
  assert.equal(bad.ok, false);
  assert.match(bad.why, /alif/);
  assert.ok(m.apply({ move: 'place', hand: 0, r: 0, c: 0 }).ok, 'but not adjacent is fine');
});

/* ------------------------------------------------------------- transpose */

test('letter → substance always works, and the element is the scheme answer', () => {
  const m = machine('transposition');
  const r = m.transpose(0, 1);                     // ح, abjad 8
  assert.equal(r.ok, true);
  const s = m.substances()[0];
  assert.equal(s.value, 8, 'the value is its abjad; nothing was created');
  assert.equal(s.element, schemes.find(x => x.id === 'mizaj-cyclic').map['ح']);
  assert.equal(m.observations.length, 1);
});

test('a transposition is an experiment: the schemes are scored on it', () => {
  const m = machine('transposition');
  m.transpose(0, 1);
  const v = m.observations[0].verdicts;
  assert.equal(v.length, 3, 'all three temperament schemes are judged');
  const cyc = v.find(x => x.id === 'mizaj-cyclic');
  assert.equal(cyc.agrees, true, 'the operative scheme necessarily agrees with itself');
  // ح is earth under cyclic and under form, air under light — so the light scheme
  // is contradicted by this one act. That is what makes it worth doing.
  assert.equal(v.find(x => x.id === 'mizaj-light').agrees, false);
});

test('substance → letter can fail, and a failure is a real result', () => {
  const p = { ...puzzle('transposition'), blocks: [{ r: 0, c: 1, element: 'air', value: 8 }], transposes: 2 };
  const m = new Machine({ letters, schemes, puzzle: p });
  const r = m.transpose(0, 1);
  assert.equal(r.ok, false, 'no letter of value 8 answers to air under this scheme');
  assert.equal(r.spent, true, 'and the attempt is spent — an experiment costs something');
  assert.equal(m.observations[0].failed, true);
  assert.equal(m.observations[0].verdicts.find(x => x.id === 'mizaj-light').agrees, false,
    'the scheme that would have allowed it is contradicted');
});

/* ------------------------------------------------------------------ goal */

test('rows-alike wants every non-empty row at one sum', () => {
  const m = machine('wafq');
  assert.equal(m.clone().check().win, false);
  for (const mv of [{ r: 1, c: 0 }, { r: 1, c: 2 }, { r: 3, c: 1 }]) {
    assert.ok(m.apply({ move: 'place', hand: 0, ...mv }).ok);
  }
  m.run();
  assert.equal(m.check().win, true);
  assert.match(m.check().detail, /8, 8, 8/);
});

/* ---------------------------------------------------------------- solver */

test('every shipped puzzle is solvable and none is trivial', () => {
  for (const p of puzzles) {
    const m = new Machine({ letters, schemes, puzzle: p });
    const zero = m.clone(); zero.run();
    assert.equal(zero.check().win, false, `${p.id} wins with no moves`);
    const r = solve(m, { maxDepth: p.max_depth ?? 5 });
    assert.equal(r.solved, true, `${p.id} is unsolvable`);
    assert.ok(r.depth >= 2, `${p.id} is trivial (depth ${r.depth})`);
  }
});

test('the solver is deterministic: same puzzle, same answer', () => {
  const p = puzzle('wafq');
  const a = solve(new Machine({ letters, schemes, puzzle: p }), { maxDepth: 4 });
  const b = solve(new Machine({ letters, schemes, puzzle: p }), { maxDepth: 4 });
  assert.deepEqual(a.moves, b.moves);
  assert.equal(a.states, b.states);
});

console.log(`${n} tests passed`);
