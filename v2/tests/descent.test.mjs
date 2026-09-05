// descent.test.mjs — the rules of a floor, checked without a browser.
//
//   node v2/tests/descent.test.mjs
//
// The Descent adds no engine. What it adds is a definition of a legal write, a
// definition of standing, a solver over placements, and the deal. Each of those
// is a place a game can lie, so each gets a test.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { legalCells, startWorld, write, won, solutions, assess, minWord, rng, shuffle, placementKey } from '../apps/descent/src/rules.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', 'rulesets', 'rulesets.json'), 'utf8'));
const RS = id => PACK.rulesets.find(r => r.id === id);
const PORTAL = PACK.rulesets.filter(r => r.kind === 'PORTAL');

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

const pier = { cells: [{ x: 0, y: 0 }, { x: 0, y: 1 }], targets: [[0, 2], [1, 2]], hand: ['م', 'ر'] };

test('a write must touch something built; the bare ground is not enough', () => {
  const w = startWorld(pier);
  assert.equal(legalCells(w, [[0, 2]]), true, 'on top of the pier');
  assert.equal(legalCells(w, [[1, 1]]), true, 'beside the pier');
  assert.equal(legalCells(w, [[3, 0]]), false, 'on bare ground, touching nothing');
  assert.equal(legalCells(w, [[0, 1]]), false, 'inside the pier');
  assert.equal(legalCells(w, [[1, 2]]), false, 'diagonal to the pier is not touching');
  assert.equal(legalCells(w, [[1, 2], [0, 2]]), true, 'a word is legal if ANY of its cells touches');
});

test('the same word stands or falls by the ruleset it is written under', () => {
  // رم from cursor (1,2): م at 1, ر at 0 on the pier. م joins forward, so one body, held.
  // Reversed, مر from (1,2): ر at 1 joins nothing -> falls under the intellectual, holds under the Sufi.
  const a = write(startWorld(pier), ['م', 'ر'], [1, 2], { letters, ruleset: RS('intellectual') });
  assert.ok(!a.refused); assert.equal(won(a.world, pier), true);
  const b = write(startWorld(pier), ['ر', 'م'], [1, 2], { letters, ruleset: RS('intellectual') });
  assert.ok(!b.refused); assert.equal(won(b.world, pier), false, 'rāʾ outboard falls');
  const c = write(startWorld(pier), ['ر', 'م'], [1, 2], { letters, ruleset: RS('sufi') });
  assert.ok(!c.refused); assert.equal(won(c.world, pier), true, 'the chain of being is not cut');
});

test('the Ottoman operative floor refuses a short word, and says why', () => {
  const r = write(startWorld(pier), ['م'], [0, 2], { letters, ruleset: RS('ottoman-operative') });
  assert.equal(r.refused, 'power');
  assert.match(r.why, /at least 3/);
  assert.equal(minWord(RS('ottoman-operative')), 3);
  assert.equal(minWord(RS('sufi')), 1);
});

test('an alif holds a column everywhere except where AXIS is denied', () => {
  // ا beside the pier at y=1, touching earth, not a letter: nothing bonds to it,
  // so only AXIS keeps it up. (Beside a LETTER it would be carried on the gnostic
  // floor anyway, because that floor also refuses to break -- which is the trap.)
  const lv = { cells: [{ x: 0, y: 0 }, { x: 0, y: 1 }], targets: [[1, 1]], hand: ['ا'] };
  for (const id of ['intellectual', 'sufi', 'ottoman-operative', 'gnostic-messianic']) {
    const rs = RS(id);
    if (minWord(rs) > 1) continue;
    const w = write(startWorld(lv), ['ا'], [1, 1], { letters, ruleset: rs }).world;
    const expect = id !== 'gnostic-messianic';
    assert.equal(won(w, lv), expect, `${id}: alif ${expect ? 'holds' : 'falls'}`);
  }
});

test('a doubled letter is one letter with a shadda, and legality is judged on the cell it takes', () => {
  // ر on the pier; then 'اا' from (2,2) would, judged letter-by-letter, touch ر via (1,2).
  // Compiled, it is ONE alif at (2,2), touching nothing: illegal.
  let w = write(startWorld(pier), ['ر'], [0, 2], { letters, ruleset: RS('intellectual') }).world;
  const r = write(w, ['ا', 'ا'], [2, 2], { letters, ruleset: RS('intellectual') });
  assert.equal(r.refused, 'illegal');
  // and from (1,2) it is legal, occupies one cell, and the hand paid two letters for it
  const ok = write(w, ['ا', 'ا'], [1, 2], { letters, ruleset: RS('intellectual') });
  assert.ok(!ok.refused);
  assert.equal(ok.world.list().filter(c => c.glyph).length, 2);
  assert.equal(ok.compiled.instructions[0].repeat, 2);
});

test('solutions() is exhaustive over placements and returns a path that replays', () => {
  const sols = solutions(pier, RS('intellectual'), { letters });
  assert.ok(sols.size >= 1);
  for (const [key, path] of sols) {
    let w = startWorld(pier);
    for (const step of path) { const r = write(w, step.word, step.cursor, { letters, ruleset: RS('intellectual') }); assert.ok(!r.refused); w = r.world; }
    assert.equal(placementKey(w), key);
    assert.equal(won(w, pier), true);
  }
  // the Sufi set is a superset here: everything the intellectual can stand, it can too
  const sufi = solutions(pier, RS('sufi'), { letters });
  for (const k of sols.keys()) assert.ok(sufi.has(k));
  assert.ok(sufi.size > sols.size, 'and it can stand the reversed word as well');
});

test('assess() reports fairness, traps and universals honestly', () => {
  const a = assess(pier, PORTAL, { letters });
  // two letters: the Ottoman floor cannot write at all, so this floor is NOT fair
  assert.equal(a.fair, false);
  assert.equal(a.S['ottoman-operative'].size, 0);
  const three = { ...pier, targets: [[0, 2], [1, 2], [2, 2]], hand: ['م', 'ر', 'ا'] };
  const b = assess(three, PORTAL, { letters });
  assert.equal(b.fair, true);
  assert.ok(b.universals.length >= 1, 'this easy floor has a placement that wins everywhere');
});

test('the deal is seeded and replayable, and every seed deals all four', () => {
  const a = shuffle(PORTAL, rng(7)).map(r => r.id), b = shuffle(PORTAL, rng(7)).map(r => r.id);
  assert.deepEqual(a, b);
  assert.deepEqual(a.slice().sort(), PORTAL.map(r => r.id).sort());
  const orders = new Set();
  for (let s = 1; s <= 40; s++) orders.add(shuffle(PORTAL, rng(s)).map(r => r.id).join('>'));
  assert.ok(orders.size >= 8, 'forty seeds give at least eight distinct deals');
});

test('every shipped floor passes the gate the verifier applies', () => {
  const DATA = JSON.parse(readFileSync(join(here, '..', 'apps', 'descent', 'levels.json'), 'utf8'));
  for (const lv of DATA.floors) {
    const a = assess(lv, PORTAL, { letters });
    assert.equal(a.fair, true, `${lv.id} unfair`);
  }
});

console.log(`\n${n} descent tests passed`);
