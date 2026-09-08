// voice.test.mjs — the tone selector's one rule.
//
//   node v2/tests/voice.test.mjs
//
// Ted asked for the register to be the player's choice. The rule that keeps that
// honest is: a voice may change HOW something is said and never WHAT is claimed.
// So citations, source names and honesty labels must survive translation between
// registers, and every voiced passage must actually carry all four voices rather
// than silently falling back.

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { VOICES, VOICE_IDS, inVoice, voiceOf, isFullyVoiced, voiceLint } from '../apps/shared/voice.js';

const here = dirname(fileURLToPath(import.meta.url));
const TRIALS = JSON.parse(readFileSync(join(here, '..', 'apps', 'tribunal', 'trials.json'), 'utf8'));

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

test('there are four voices and austere is the default', () => {
  assert.deepEqual(VOICE_IDS, ['austere', 'baroque', 'uncanny', 'warm']);
  for (const v of VOICE_IDS) assert.ok(VOICES[v].name && VOICES[v].blurb);
});

test('a plain string is the same in every voice', () => {
  for (const v of VOICE_IDS) assert.equal(inVoice('a fact', v), 'a fact');
  assert.equal(voiceOf('a fact'), 'any');
  assert.equal(isFullyVoiced('a fact'), true);
});

test('a missing voice falls back to austere AND admits it', () => {
  const partial = { austere: 'plain', baroque: 'florid' };
  assert.equal(inVoice(partial, 'uncanny'), 'plain');
  assert.equal(voiceOf(partial, 'uncanny'), 'austere', 'the page can show that the voice was not honoured');
  assert.equal(voiceOf(partial, 'baroque'), 'baroque');
  assert.equal(isFullyVoiced(partial), false);
});

test('voiceLint catches a voice that drops a citation the austere text carries', () => {
  const bad = { austere: 'As Segol shows (pp. 105–106), the golem is an instrument.',
                baroque: 'The golem, gloriously, is an instrument!' };
  const problems = voiceLint(bad);
  assert.equal(problems.length, 1);
  assert.equal(problems[0].voice, 'baroque');
  assert.ok(problems[0].missing.some(m => m.includes('105')));
});

test('voiceLint passes when the citation survives the change of register', () => {
  const good = { austere: 'Segol (pp. 105–106) calls it an instrument.',
                 baroque: 'It is an instrument — Segol says so at pp. 105–106, and she is right.' };
  assert.deepEqual(voiceLint(good), []);
});

test('voiceLint tracks honesty labels too', () => {
  const bad = { austere: 'GAME FICTION: the charge is ours.', warm: 'We made the charge up.' };
  assert.ok(voiceLint(bad).some(p => p.voice === 'warm' && p.missing.includes('GAME FICTION')));
});

test('every voiced passage the Tribunal ships carries all four voices', () => {
  const bundles = [['refusal', TRIALS.refusal], ['endings.cleared', TRIALS.endings.cleared],
                   ['endings.exiled', TRIALS.endings.exiled]];
  for (const t of TRIALS.trials) {
    bundles.push([`${t.id}.charge`, t.charge], [`${t.id}.teaches`, t.teaches],
                 [`${t.id}.verdict.won`, t.verdict.won], [`${t.id}.verdict.lost`, t.verdict.lost]);
  }
  for (const [name, b] of bundles) {
    assert.ok(isFullyVoiced(b), `${name} is missing ${VOICE_IDS.filter(v => !b[v]).join(', ')}`);
    assert.deepEqual(voiceLint(b), [], `${name}: a voice drops something`);
  }
});

test('the voices are actually different from one another, not four copies', () => {
  for (const t of TRIALS.trials) {
    const said = new Set(VOICE_IDS.map(v => t.charge[v]));
    assert.equal(said.size, 4, `${t.id}: the four voices are not four distinct texts`);
    // and the warm voice should be the longest, since that is what it is for
    const lens = Object.fromEntries(VOICE_IDS.map(v => [v, t.charge[v].length]));
    assert.ok(lens.warm > lens.uncanny, `${t.id}: warm (${lens.warm}) should say more than uncanny (${lens.uncanny})`);
  }
});

console.log(`\n${n} voice tests passed`);
