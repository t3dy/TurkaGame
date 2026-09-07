// introduction.test.mjs — every lesson of the Introduction can be finished.
//
//   node v2/tests/introduction.test.mjs
//
// Each lesson carries a SOLUTION script; this runs it through the same
// lesson_rules.js the page uses and asserts the lesson's TASK is then done. A
// lesson whose solution does not finish it is a lesson that would strand the
// player, and this is where that is caught.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { runSolution, start, canWrite, taskDone } from '../apps/introduction/src/lesson_rules.js';

const here = dirname(fileURLToPath(import.meta.url));
const ARABIC = JSON.parse(readFileSync(join(here, '..', 'data', 'letters.json'), 'utf8')).letters;
const HEBREW = JSON.parse(readFileSync(join(here, '..', 'data', 'hebrew.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', 'rulesets', 'rulesets.json'), 'utf8'));
const LESSONS = JSON.parse(readFileSync(join(here, '..', 'apps', 'introduction', 'lessons.json'), 'utf8')).lessons;

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

test('every lesson has text, a task with a sentence, a palette, a world and a solution', () => {
  for (const l of LESSONS) {
    assert.ok(l.text.join('').length >= 400, `${l.id}: text is too short to count as instructions`);
    assert.ok(l.task && l.task.kind && typeof l.task.say === 'string' && l.task.say.length > 20, `${l.id}: task needs a full sentence`);
    assert.ok(Array.isArray(l.solution), l.id);
    assert.ok(['arabic', 'hebrew'].includes(l.alphabet), l.id);
    assert.ok(PACK.rulesets.some(r => r.id === l.ruleset), `${l.id}: unknown ruleset ${l.ruleset}`);
    assert.ok(Array.isArray(l.sources) && l.sources.length >= 1, `${l.id}: cite something`);
  }
});

test('every lesson is completable by its own solution, through the shared rules', () => {
  for (const l of LESSONS) {
    const letters = l.alphabet === 'hebrew' ? HEBREW : ARABIC;
    const ruleset = PACK.rulesets.find(r => r.id === l.ruleset);
    const r = runSolution(l, { letters, ruleset });
    assert.ok(r.done, `${l.id}: solution does not finish the task\n  ${r.progress || r.why}\n  ${r.trace.join('\n  ')}`);
  }
});

test('the palette letters exist in the lesson\'s alphabet', () => {
  for (const l of LESSONS) {
    const letters = l.alphabet === 'hebrew' ? HEBREW : ARABIC;
    const pal = Array.isArray(l.palette) ? l.palette : [];
    for (const g of pal) assert.ok(letters.some(x => x.glyph === g), `${l.id}: ${g} not in ${l.alphabet}`);
    for (const s of l.solution) if (s.write) assert.ok(pal.includes(s.write[0]) || l.palette === 'arabic-all' || l.palette === 'hebrew-all', `${l.id}: solution writes ${s.write[0]} which is not on the palette`);
  }
});

test('reach: within one column, at most two high, touching something; the bare air is refused', () => {
  const l = LESSONS.find(x => x.id === 'axis');
  const { world, sage } = start(l);
  assert.equal(canWrite(world, sage, [2, 1, 0]).ok, true, 'beside the pillar top');
  assert.equal(canWrite(world, sage, [2, 2, 0]).ok, false, 'nothing to write against at height 2 beside nothing');
  assert.equal(canWrite(world, sage, [5, 0, 0]).ok, false, 'too far');
  assert.equal(canWrite(world, sage, [1, 0, 0]).ok, false, 'occupied');
  assert.match(canWrite(world, sage, [5, 0, 0]).why, /Walk closer/);
});

test('the golem task has three stages and the ledger-able readings', () => {
  const l = LESSONS.find(x => x.id === 'the-golem');
  const { world, sage } = start(l);
  const ruleset = PACK.rulesets.find(r => r.id === 'workshop');
  let v = taskDone(l.task, world, sage, { erased: [] });
  assert.equal(v.stage, 1);
  const { writeLetter, erase } = await_import();
  for (const s of l.solution) {
    if (s.write) writeLetter(world, sage, s.write[0], s.write[1], { letters: HEBREW, ruleset });
    if (s.erase) { erase(world, s.erase); }
  }
  v = taskDone(l.task, world, sage, { erased: ['א'] });
  assert.equal(v.done, true);
  assert.equal(v.stage, 3);
});

function await_import() {
  // synchronous helper: the functions are already imported below
  return { writeLetter, erase };
}
import { writeLetter, erase } from '../apps/introduction/src/lesson_rules.js';

test('the wrong letter on the AXIS floor falls, as the lesson says it will', () => {
  const l = LESSONS.find(x => x.id === 'axis');
  const ruleset = PACK.rulesets.find(r => r.id === 'workshop');
  const wrong = { ...l, solution: [{ write: ['د', [2, 1, 0]] }, { walk: 'east' }, { write: ['م', [3, 1, 0]] }, { gravity: true }] };
  const r = runSolution(wrong, { letters: ARABIC, ruleset });
  assert.equal(r.done, false, 'a dāl holds no frame');
});

test('the same two letters break under the workshop and join under the Sufi', () => {
  const sever = LESSONS.find(x => x.id === 'sever'), sufi = LESSONS.find(x => x.id === 'whose-rules');
  const W = PACK.rulesets.find(r => r.id === 'workshop'), S = PACK.rulesets.find(r => r.id === 'sufi');
  assert.equal(runSolution(sever, { letters: ARABIC, ruleset: W }).done, true);
  assert.equal(runSolution({ ...sever, ruleset: 'sufi' }, { letters: ARABIC, ruleset: S }).done, false, 'under the Sufi they do not break');
  assert.equal(runSolution(sufi, { letters: ARABIC, ruleset: S }).done, true);
  assert.equal(runSolution({ ...sufi }, { letters: ARABIC, ruleset: W }).done, false, 'under the workshop they do not join');
});

console.log(`\n${n} introduction tests passed`);
