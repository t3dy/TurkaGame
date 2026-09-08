// taksir.test.mjs — the breaking of a word, checked against its source's example.
//
//   node v2/tests/taksir.test.mjs
//
// Taksīr is the one operation in this engine that CREATES letters, so it is the
// one that could most easily become a wish-granting machine. These tests pin it
// to the source (Melvin-Koushki, Prologue, n. 35, whose worked example is ALF →
// zubur A, bayyināt LF) and to its own bound (the bayyināt of all twenty-eight
// names draw on only eight distinct letters).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { taksir, releasable, wordsReleasing, dropRepeats } from '../engine/taksir.js';

const here = dirname(fileURLToPath(import.meta.url));
const DATA = JSON.parse(readFileSync(join(here, '..', 'data', 'letters.json'), 'utf8'));
const L = DATA.letters;

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

test("the source's own example: ALF splits into zubur A and bayyināt LF", () => {
  // Prologue n. 35: "the term zubur refers to the first letters in the full
  // letternames (e.g., the A in ALF) and bayyināt to the remaining letters (LF in ALF)"
  const r = taksir('ا', L);
  assert.equal(r.names[0].name, 'الف', 'alif is spelled ALF');
  assert.deepEqual(r.zubur, ['ا'], 'zubur is the A');
  assert.equal(r.bayyinat.join(''), 'لف', 'bayyināt is LF');
});

test('a letter\'s name begins with itself, so the zubur ARE the manifest word', () => {
  for (const l of L) assert.equal(l.lettername[0], l.glyph, l.glyph);
  const r = taksir('قلم', L);
  assert.deepEqual(r.zubur, [...'قلم']);
});

test('repeats are dropped from the word, so a doubled letter adds nothing', () => {
  const once = taksir('مرم', L), twice = taksir('مرمم', L);
  assert.deepEqual(once.unique, [...'مر']);
  assert.deepEqual(once.bayyinat, twice.bayyinat);
  assert.deepEqual(dropRepeats([...'مرمم']), [...'مر']);
});

test('taksīr releases letters the word did not contain — that is the whole point', () => {
  const r = taksir('مرم', L);
  assert.ok(r.released.includes('ي'), 'mīm is MYM, so it conceals a yāʾ');
  assert.ok(r.released.includes('ا'), 'rāʾ is RA, so it conceals an alif');
  assert.ok(!r.released.includes('م'), 'mīm was already in the word, so it is not released');
});

test('a single alif conceals lām and fāʾ', () => {
  assert.equal(taksir('ا', L).released.join(''), 'لف');
});

test('the release is BOUNDED to eight letters across the whole alphabet', () => {
  const can = releasable(L);
  assert.equal(can.length, 8, `expected 8 releasable letters, got ${can.length}: ${can.join('')}`);
  assert.deepEqual(can.slice().sort(), [...'ادفلمنوي'].sort());
  // and nothing outside that set can ever come out
  for (const l of L) {
    for (const g of taksir(l.glyph, L).released) assert.ok(can.includes(g), `${l.glyph} released ${g}`);
  }
});

test('twenty letters can never be obtained by breaking anything', () => {
  const can = new Set(releasable(L));
  const never = L.filter(l => !can.has(l.glyph)).map(l => l.glyph);
  assert.equal(never.length, 20);
  // the six that sever are mostly unobtainable, which matters for level design
  assert.ok(never.includes('ر') && never.includes('ذ') && never.includes('ز'));
});

test('breaking is idempotent in the sense that matters: no new letters the second time', () => {
  const first = taksir('قلم', L);
  const hand = dropRepeats([...'قلم', ...first.released]);
  const second = taksir(hand, L);
  assert.equal(second.released.length, 0, `second break released ${second.released.join('')}`);
});

test('the working is shown, step by step, because the house rule says so', () => {
  const r = taksir('نون', L);
  const kinds = r.steps.map(s => s.step);
  assert.deepEqual(kinds, ['separate', 'drop repeats', 'write the names in full', 'zubur', 'bayyināt', 'released']);
  for (const s of r.steps) assert.ok(s.detail.length > 10, s.step);
  assert.match(r.steps[1].detail, /dropped/, 'نون repeats its nūn');
});

test('wordsReleasing searches subsets, not permutations, and every hit really releases', () => {
  const hits = wordsReleasing('ا', [...'هرم'], L);
  assert.ok(hits.length > 0);
  for (const h of hits) assert.ok(taksir(h.word, L).released.includes('ا'), h.word);
  // Order does not change WHAT taksīr yields, only the order it is presented in:
  // the names are written in the word's own order. So the sets match and the
  // sequences need not. Worth pinning, because a search over subsets (rather than
  // permutations) is only sound if this holds.
  const a = taksir('مر', L).bayyinatUnique.slice().sort();
  const b = taksir('رم', L).bayyinatUnique.slice().sort();
  assert.deepEqual(a, b, 'the same letters come out either way');
  assert.notDeepEqual(taksir('مر', L).bayyinatUnique, taksir('رم', L).bayyinatUnique,
    'but the order follows the word, and the interface shows that order');
});

test('a letter outside the alphabet is reported, not silently dropped', () => {
  const r = taksir('مXر', L);
  assert.deepEqual(r.unknown, ['X']);
  assert.equal(r.word, 'مر');
});

console.log(`\n${n} taksir tests passed`);
