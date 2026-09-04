// data.test.mjs — deterministic checks on the generated data and the notebook.
//
//   node games/abjad-tower/tests/data.test.mjs
//
// No framework: plain assertions, exit 1 on the first failure, so the output can
// be pasted into a commit message. Runs from any cwd.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { Notebook, deriveState, memoryStore } from '../src/notebook.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = f => JSON.parse(readFileSync(join(here, '..', 'data', f), 'utf8'));

const L = read('letters.json');
const C = read('correspondences.json');
let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

/* ------------------------------------------------------------ letters.json */

test('28 letters, 14 light / 14 dark, abjad ascending', () => {
  assert.equal(L.letters.length, 28);
  assert.equal(L.letters.filter(l => l.class === 'nurani').length, 14);
  const v = L.letters.map(l => l.abjad);
  assert.deepEqual(v, [...v].sort((a, b) => a - b));
  assert.equal(v[0], 1); assert.equal(v[27], 1000);
});

test('mass follows the stated rule and preserves order', () => {
  for (const l of L.letters) {
    assert.ok(Math.abs(l.mass - (1 + 2.2 * Math.log10(l.abjad))) < 0.002, l.glyph);
  }
  const m = L.letters.map(l => l.mass);
  assert.deepEqual(m, [...m].sort((a, b) => a - b));
});

test('every letter has form facts and three registers', () => {
  for (const l of L.letters) {
    const f = l.form;
    assert.ok(['vertical', 'horizontal', 'mixed'].includes(f.orientation), l.glyph);
    assert.ok(f.dots >= 0 && f.dots <= 3, l.glyph);
    assert.equal(f.dots === 0, f.dot_position === 'none', l.glyph);
    assert.equal(typeof f.closed, 'boolean'); assert.equal(typeof f.tail, 'boolean');
    assert.equal(l.registers.written, l.glyph);
    assert.equal(l.registers.spoken, l.translit);
    assert.equal(l.registers.mental, l.name);
  }
});

test('alif is the one vertical, dotless, open, tailless form — the axis', () => {
  const a = L.letters.find(l => l.glyph === 'ا');
  assert.deepEqual(a.form, { orientation: 'vertical', dots: 0, dot_position: 'none', closed: false, tail: false });
  const others = L.letters.filter(l => l.glyph !== 'ا' && l.form.orientation === 'vertical' && l.form.dots === 0 && !l.form.closed && !l.form.tail);
  assert.equal(others.length, 0);
});

test('bāʾ has one dot below — the dot the tradition argues over', () => {
  const b = L.letters.find(l => l.glyph === 'ب');
  assert.equal(b.form.dots, 1); assert.equal(b.form.dot_position, 'below');
  assert.equal(b.class, 'zulmani');
});

/* --------------------------------------------------- correspondences.json */

test('every scheme carries a grounding kind that the file defines', () => {
  for (const s of C.schemes) {
    assert.ok(C.grounding_kinds[s.kind], s.id + ' kind ' + s.kind);
    assert.ok(s.source && s.source.length > 20, s.id + ' has a source line');
  }
});

test('temperament schemes cover the alphabet and genuinely disagree', () => {
  const temps = C.schemes.filter(s => s.domain === 'temperament');
  assert.ok(temps.length >= 2);
  for (const s of temps) {
    assert.equal(Object.keys(s.map).length, 28, s.id);
    for (const l of L.letters) assert.ok(s.values.includes(s.map[l.glyph]), s.id + ' ' + l.glyph);
  }
  for (let i = 0; i < temps.length; i++) for (let j = i + 1; j < temps.length; j++) {
    const agree = L.letters.filter(l => temps[i].map[l.glyph] === temps[j].map[l.glyph]).length;
    assert.ok(agree <= 20, `${temps[i].id} vs ${temps[j].id} agree on ${agree}/28`);
  }
});

test('there exists a pair of letters on which every temperament scheme disagrees about complementarity', () => {
  // If no such pair existed the player could never tell the schemes apart.
  const temps = C.schemes.filter(s => s.domain === 'temperament');
  const comp = (a, b) => (a === b) || ({ fire: 'air', air: 'fire', water: 'earth', earth: 'water' })[a] === b;
  let found = null;
  for (const x of L.letters) for (const y of L.letters) {
    if (x === y) continue;
    const verdicts = temps.map(s => comp(s.map[x.glyph], s.map[y.glyph]));
    if (verdicts.some(v => v) && verdicts.some(v => !v)) { found = [x.glyph, y.glyph, verdicts]; break; }
    if (found) break;
  }
  assert.ok(found, 'a discriminating pair exists');
  console.log('        discriminating pair e.g.', found[0], found[1], found[2].join('/'));
});

test('the reported-but-absent list is honest: every REPORTED claim names PUZZLERIDEAS.txt', () => {
  for (const r of C.reported_but_absent) {
    assert.equal(r.kind, 'REPORTED');
    assert.ok(r.source.includes('PUZZLERIDEAS.txt'), r.claim.slice(0, 40));
  }
});

/* ---------------------------------------------------------------- notebook */

test('deriveState: the five states from observations and rivals', () => {
  assert.equal(deriveState({ observations: [] }), 'HYPOTHESIS');
  assert.equal(deriveState({ observations: [{ result: 'agrees' }] }), 'EXPERIMENT');
  const three = { observations: [{ result: 'agrees' }, { result: 'agrees' }, { result: 'agrees' }] };
  assert.equal(deriveState(three, 0), 'OBSERVED');
  assert.equal(deriveState(three, 1), 'CONFIRMED');
  assert.equal(deriveState({ observations: [{ result: 'agrees' }, { result: 'contradicts' }] }), 'DISPROVEN');
});

test('Notebook: a claim is CONFIRMED only when a rival falls; repeats pay nothing', () => {
  const nb = new Notebook(memoryStore());
  nb.propose('mizaj-cyclic', { question: 'temperament', text: 'the cycle' });
  nb.propose('mizaj-form', { question: 'temperament', text: 'by form' });
  const w = { game: 'abjad-tower', seed: 1 };
  let r = nb.observe('mizaj-cyclic', { result: 'agrees', where: w });
  assert.equal(r.after, 'EXPERIMENT'); assert.equal(r.xp, 5);
  r = nb.observe('mizaj-cyclic', { result: 'agrees', where: w });
  assert.equal(r.after, 'EXPERIMENT'); assert.equal(r.xp, 0, 'no XP without a state change');
  r = nb.observe('mizaj-cyclic', { result: 'agrees', where: w });
  assert.equal(r.after, 'OBSERVED'); assert.equal(r.xp, 15);
  // Still not confirmed: the rival has not been tested.
  assert.equal(nb.state('mizaj-cyclic'), 'OBSERVED');
  r = nb.observe('mizaj-form', { result: 'contradicts', where: w });
  assert.equal(r.after, 'DISPROVEN'); assert.equal(r.xp, 25);
  assert.equal(nb.state('mizaj-cyclic'), 'CONFIRMED');
  assert.equal(nb.xp, 45);
  const s = nb.summary();
  assert.deepEqual(s.temperament.map(c => c.state).sort(), ['CONFIRMED', 'DISPROVEN']);
});

test('Notebook survives a store that throws', () => {
  const bad = { getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); } };
  const nb = new Notebook(bad);
  nb.propose('x', { question: 'q', text: 't' });
  assert.equal(nb.observe('x', { result: 'agrees', where: {} }).after, 'EXPERIMENT');
});

console.log(`${n} tests passed`);
