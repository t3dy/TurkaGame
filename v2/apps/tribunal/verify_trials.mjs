// verify_trials.mjs — the gate for The Tribunal.
//
//   node v2/apps/tribunal/verify_trials.mjs [--trace]
//
// The house rule is that a level ships only after a solver has seen it, and that
// the solver asks a SECOND question suited to the mode. Here there are three,
// because there are three ways this particular mode could be a lie:
//
//   ANSWERABLE   the demanded word can be produced, in THIS court, from THIS
//                hand, by breaking. A charge nobody can answer is not a trial.
//   EARNED       it cannot be answered without breaking. If the opening hand
//                already spells the word, the trial teaches nothing and the
//                taksīr is decoration.
//   COURT-BOUND  the court's own rules are doing work: either the answer is
//                refused outright in some other court, or it stands in some and
//                not others. A court whose metaphysics changes nothing is set
//                dressing, and this mode's whole claim is that it is not.
//
// And one about the writing, because this mode's writing is the content: every
// voiced passage must carry all four voices, and no voice may drop a citation
// the austere one has (apps/shared/voice.js voiceLint).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { solve, needsBreaking, inscribe, judge } from './src/trial_rules.js';
import { isFullyVoiced, voiceLint, VOICE_IDS } from '../shared/voice.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', '..', 'rulesets', 'rulesets.json'), 'utf8'));
const DATA = JSON.parse(readFileSync(join(here, 'trials.json'), 'utf8'));
const RS = id => PACK.rulesets.find(r => r.id === id);
const PORTAL = PACK.rulesets.filter(r => r.kind === 'PORTAL');
const TRACE = process.argv.includes('--trace');

let bad = 0;

for (const t of DATA.trials) {
  const court = RS(t.court);
  const flags = [];
  if (!court) { console.log(`  FAIL ${t.id}: unknown court ${t.court}`); bad++; continue; }

  // 1. ANSWERABLE
  const s = solve(t, { letters, ruleset: court });
  if (!s.solved) flags.push('UNANSWERABLE in its own court');

  // 2. EARNED
  if (!needsBreaking(t)) flags.push('NOT EARNED: the opening hand already spells the word');

  // 3. COURT-BOUND — does the court's metaphysics change the outcome anywhere?
  const elsewhere = {};
  for (const r of PORTAL) {
    const o = solve(t, { letters, ruleset: r });
    elsewhere[r.id] = o.solved;
  }
  const differs = new Set(Object.values(elsewhere)).size > 1;
  // the operative court's refusal of short programs must actually bite somewhere
  const short = inscribe(t, t.hand.concat([...t.demand.text]), t.demand.text.slice(0, 2), { letters, ruleset: court });
  if (!differs && !(court.id === 'ottoman-operative' && short.refused === 'power')) {
    flags.push('NOT COURT-BOUND: every court gives the same verdict and no rule of this one bites');
  }

  // 4. the writing
  for (const [field, bundle] of [['charge', t.charge], ['teaches', t.teaches],
                                 ['verdict.won', t.verdict.won], ['verdict.lost', t.verdict.lost]]) {
    if (!isFullyVoiced(bundle)) {
      const missing = VOICE_IDS.filter(v => !bundle[v]);
      flags.push(`${field} is missing the ${missing.join(', ')} voice`);
    }
    for (const p of voiceLint(bundle)) flags.push(`${field}: the ${p.voice} voice drops ${p.missing.join(', ')}`);
  }
  if (!Array.isArray(t.sources) || !t.sources.length) flags.push('no sources listed');
  if (!t.sources.some(x => /GAME FICTION/.test(x))) flags.push('the invented part is not labelled GAME FICTION');

  const line = `${t.id.padEnd(24)} court ${t.court.padEnd(18)} ${s.solved ? `answerable in ${s.breaks.length} break(s): ${s.breaks.join(' → ') || 'none'}` : 'NOT ANSWERABLE'}  ·  elsewhere ${Object.entries(elsewhere).map(([k, v]) => `${k.slice(0, 5)}${v ? '+' : '-'}`).join(' ')}`;
  if (flags.length) { bad++; console.log('  FAIL ' + line + '\n         ' + flags.join('; ')); }
  else {
    console.log('  ok   ' + line);
    if (TRACE) console.log(`         hand ${t.hand.join('')} → ${s.hand.join('')} → inscribe ${t.demand.text}`);
  }
}

// The refusal text and the endings are the mode's spine; they get the same check.
for (const [name, bundle] of [['refusal', DATA.refusal], ['endings.cleared', DATA.endings.cleared],
                              ['endings.exiled', DATA.endings.exiled]]) {
  const flags = [];
  if (!isFullyVoiced(bundle)) flags.push(`missing ${VOICE_IDS.filter(v => !bundle[v]).join(', ')}`);
  for (const p of voiceLint(bundle)) flags.push(`the ${p.voice} voice drops ${p.missing.join(', ')}`);
  if (flags.length) { bad++; console.log(`  FAIL ${name}: ${flags.join('; ')}`); }
  else console.log(`  ok   ${name.padEnd(24)} all four voices, citations intact`);
}

console.log(bad
  ? `\n${bad} check(s) failed`
  : `\n${DATA.trials.length} trials: each answerable in its own court, none answerable without breaking, ` +
    `each court's rules load-bearing; every voiced passage carries all four voices with its citations intact`);
process.exit(bad ? 1 : 0);
