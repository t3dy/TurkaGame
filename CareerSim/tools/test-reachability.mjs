// test-reachability.mjs — the lints that certify a door is a door.
//
//   node --test tools/test-reachability.mjs
//
// The existing suite checks that things are *referenced*: every science is gated
// somewhere, every memory flag is read somewhere. Those all passed for months while nine
// Quintet gates were bricked shut — `limiya>=2` was required five times and no run could
// exceed rank 1, and hīmiyā was required three times and granted nowhere at all. A test
// that certifies a bricked-up door as a door is worse than no test.
//
// So these assert *reachability* and *delivery*, not mention:
//   1. every capability gate can be satisfied by some legal run
//   2. every glossary term can actually reach a player as a gloss
//   3. no encounter is stranded behind a condition nothing produces
//
// See docs/MECHANICSISSUES.md §1 and docs/WRITINGAUDIT.md §3.

import test from 'node:test';
import assert from 'node:assert/strict';
import { ENCOUNTERS, PHASES } from '../content/index.js?v=7';
import { LEXICON } from '../content/lexicon.js?v=2';

const SCI = ['kimiya', 'limiya', 'himiya', 'simiya', 'rimiya'];
const encs = Object.values(ENCOUNTERS);
const allOpts = encs.flatMap((e) => e.options);

// Maximum tier each science can reach, respecting that one encounter yields one option
// and one option yields one band.
function maxTiers() {
  const max = Object.fromEntries(SCI.map((s) => [s, 0]));
  for (const e of encs) {
    for (const s of SCI) {
      let best = 0;
      for (const o of e.options) {
        const base = ((o.effects || {}).quintet || {})[s] || 0;
        const band = Math.max(0, ...(o.outcomes || []).map((b) => ((b.effects || {}).quintet || {})[s] || 0));
        best = Math.max(best, base + band);
      }
      max[s] += best;
    }
  }
  return max;
}

test('every Quintet gate is reachable by some legal run', () => {
  const max = maxTiers();
  const dead = [];
  for (const e of encs) {
    for (const o of e.options) {
      for (const kind of ['requires', 'boosts']) {
        for (const r of o[kind] || []) {
          const m = r.replace(/^!/, '').match(/^(kimiya|limiya|himiya|simiya|rimiya)>=(\d)$/);
          if (m && +m[2] > max[m[1]]) {
            dead.push(`P${e.phase} ${e.id} [${kind}] "${o.label}" needs ${m[1]}>=${m[2]} but max reachable is ${max[m[1]]}`);
          }
        }
      }
    }
  }
  assert.deepEqual(dead, [], 'gates no run can open:\n  ' + dead.join('\n  '));
});

test('every science a gate asks for is granted somewhere', () => {
  const max = maxTiers();
  const asked = new Set();
  for (const o of allOpts) {
    for (const r of [...(o.requires || []), ...(o.boosts || [])]) {
      const m = r.replace(/^!/, '').match(/^(kimiya|limiya|himiya|simiya|rimiya)>=/);
      if (m) asked.add(m[1]);
    }
  }
  for (const s of asked) {
    assert.ok(max[s] > 0, `${s} is required by content but granted by no encounter`);
  }
});

test('every meter and reputation gate is within the scale content can produce', () => {
  const reach = { meters: {}, rep: {} };
  for (const o of allOpts) {
    for (const f of [o.effects, ...(o.outcomes || []).map((b) => b.effects)].filter(Boolean)) {
      for (const [k, d] of Object.entries(f.meters || {})) if (d > 0) reach.meters[k] = (reach.meters[k] || 0) + d;
      for (const [k, d] of Object.entries(f.rep || {})) if (d > 0) reach.rep[k] = (reach.rep[k] || 0) + d;
    }
  }
  const bad = [];
  for (const o of allOpts) {
    for (const r of [...(o.requires || []), ...(o.boosts || [])]) {
      const m = r.replace(/^!/, '').match(/^(meter|rep):([a-z]+)>=(-?\d+)$/);
      if (!m) continue;
      const pool = m[1] === 'meter' ? reach.meters : reach.rep;
      const cap = m[1] === 'meter' ? 10 : 5;
      const avail = Math.min(cap, pool[m[2]] || 0);
      if (+m[3] > avail) bad.push(`"${o.label}" needs ${r} but content can only reach ${avail}`);
    }
  }
  assert.deepEqual(bad, [], bad.join('\n  '));
});

test('no encounter is stranded behind a memory flag nothing writes', () => {
  const written = new Set();
  for (const e of encs) {
    for (const f of e.memory_writes || []) written.add(f);
    for (const o of e.options) {
      for (const f of Object.keys((o.effects || {}).memory || {})) written.add(f);
      for (const b of o.outcomes || []) for (const f of Object.keys((b.effects || {}).memory || {})) written.add(f);
      // Contract settlement writes memory too (career.js applies reward/failure effects).
      if (o.contract) for (const fx of [o.contract.reward, o.contract.failure])
        for (const f of Object.keys((fx || {}).memory || {})) written.add(f);
    }
  }
  const stranded = [];
  for (const e of encs) {
    for (const r of e.when || []) {
      const b = r.replace(/^!/, '');
      if (!b.startsWith('mem:')) continue;
      const flag = b.slice(4).split('=')[0];
      if (!written.has(flag)) stranded.push(`${e.id} waits on mem:${flag}, which nothing writes`);
    }
  }
  assert.deepEqual(stranded, [], stranded.join('\n  '));
});

// --- delivery, not just presence -------------------------------------------------
// glossify() in src/ui.js runs on situations, phase intros, option details and outcome
// text. A term that appears only in a rubric, an option label or a chronicle line is a
// word the player meets with no way in.
const GLOSSABLE = [
  ...encs.map((e) => e.situation),
  ...PHASES.map((p) => p.intro),
  ...allOpts.map((o) => o.detail || ''),
  ...encs.flatMap((e) => e.options.flatMap((o) => (o.outcomes || []).map((b) => b.text || ''))),
];
const UNGLOSSABLE = [
  ...encs.map((e) => e.rubric),
  ...allOpts.map((o) => o.label),
  ...encs.flatMap((e) => e.options.flatMap((o) => (o.outcomes || []).map((b) => b.chronicle || ''))),
];
const appears = (arr, t) => arr.some((s) => String(s).includes(t));

test('every glossary term appears somewhere a gloss can fire', () => {
  const unreachable = Object.keys(LEXICON).filter((t) => !appears(GLOSSABLE, t));
  assert.deepEqual(unreachable, [],
    'defined but never glossable — either use the word in a situation/detail/outcome, or drop the entry:\n  '
    + unreachable.join(', '));
});

test('no glossary term is used only where it cannot be glossed', () => {
  const orphaned = Object.keys(LEXICON).filter((t) => appears(UNGLOSSABLE, t) && !appears(GLOSSABLE, t));
  assert.deepEqual(orphaned, [], 'player meets the word with no way in:\n  ' + orphaned.join(', '));
});
