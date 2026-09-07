// test-thesis.mjs — the Ibn Turka problem, enforced.
//
//   node --test tools/test-thesis.mjs   (runs 800 greedy simulations)
//
// ENDINGS.md §7 asked future tuners to re-check the Dee-inversion by hand after any
// balance change. The grimoire's DEE reading (D1) promotes it to an invariant: no
// content or threshold change may quietly break the thesis that maximal success is
// maximally dangerous TO THE MAN, NOT THE WORK. Thresholds are deliberately generous
// (unseeded RNG); if this test flakes, raise the sample size, not loosen the thesis.
//
// Regexes use [0-9] character classes rather than backslash escapes on purpose: this
// file has twice been corrupted by shell-heredoc backslash mangling, and a regex that
// silently matches nothing turns the invariant into a rubber stamp.

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('the Dee inversion holds under skilled play', () => {
  const out = execFileSync(process.execPath,
    [fileURLToPath(new URL('./simulate-runs.mjs', import.meta.url)), '800', 'greedy'],
    { encoding: 'utf8', timeout: 300000 });

  const pct = (label) => {
    const m = out.match(new RegExp(label + ' ([0-9]+(?:[.][0-9]+)?)%'));
    return m ? parseFloat(m[1]) : NaN;
  };

  const systemTriumph = pct('source_code') + pct('scholarly');
  const ruin = pct('informer') + pct('broken') + pct('recanted') + pct('fugitive')
    + pct('exiled') + pct('condemned_with_book');
  const owned = pct('acquitted');
  const clean = pct('vindicated');

  // A fate absent from the output parses as NaN and fails loudly — never as zero.
  assert.ok(Number.isFinite(systemTriumph) && Number.isFinite(ruin) && Number.isFinite(owned) && Number.isFinite(clean),
    'simulation output did not contain the expected fate lines — the harness, not the balance, is broken:\n' + out.slice(-600));

  assert.ok(systemTriumph >= 50,
    `skilled play must reliably make the science immortal: source_code+scholarly = ${systemTriumph}% (< 50)`);
  assert.ok(ruin + owned >= 55,
    `the man must pay — in ruin or in ownership: ${ruin}% ruin + ${owned}% owned = ${(ruin + owned).toFixed(1)}% (< 55)`);
  assert.ok(clean <= 8,
    `clean vindication must stay rare: vindicated = ${clean}% (> 8)`);
});
