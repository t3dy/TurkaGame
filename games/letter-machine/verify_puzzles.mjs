// verify_puzzles.mjs — the house rule from The Impossible Architect, applied
// before a person ever sees these: CHECK A PUZZLE WITH A SOLVER FIRST.
//
//   node games/letter-machine/verify_puzzles.mjs [--programs]
//
// For every puzzle: is it solvable at all, in how few moves, and is it trivial
// (winnable with no moves, or with one)? A trivial puzzle is a failure here, not
// a warning — it exits non-zero, the same as an unsolvable one.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Machine, solve, formOps, OP_NAMES } from './src/engine.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', 'abjad-tower', 'data', 'letters.json'), 'utf8')).letters;
const schemes = JSON.parse(readFileSync(join(here, '..', 'abjad-tower', 'data', 'correspondences.json'), 'utf8')).schemes;
const puzzles = JSON.parse(readFileSync(join(here, 'data', 'puzzles.json'), 'utf8')).puzzles;

if (process.argv.includes('--programs')) {
  // What each letter DOES, derived from its written form. Printed so the table can
  // be eyeballed against the glyphs rather than trusted.
  const tally = {};
  for (const l of letters) {
    const ops = formOps(l).map(o => o.op + (o.n > 1 ? o.n : ''));
    for (const o of formOps(l)) tally[o.op] = (tally[o.op] || 0) + 1;
    console.log(`  ${l.glyph}  ${String(l.abjad).padStart(4)}  ${l.name.padEnd(7)} ${l.form.orientation.padEnd(10)}` +
      `${String(l.form.dots)}${l.form.dot_position === 'none' ? ' ' : l.form.dot_position[0]}` +
      `${l.form.closed ? ' closed' : '       '}${l.form.tail ? ' tail' : '     '}  →  ${ops.join(' + ') || 'INERT'}`);
  }
  console.log('\n  ' + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(' · ') +
              ` · INERT ${letters.filter(l => formOps(l).length === 0).length}`);
  process.exit(0);
}

let bad = 0;
for (const p of puzzles) {
  const m = new Machine({ letters, schemes, puzzle: p });
  // Trivial check: does it already win with no moves at all?
  const zero = m.clone(); zero.run();
  const r = solve(m, { maxDepth: p.max_depth ?? 5 });
  const flags = [];
  if (zero.check().win) flags.push('TRIVIAL: wins with no moves');
  if (!r.solved) flags.push(r.exhausted ? `UNSOLVED (search exhausted at ${r.states} states)` : 'UNSOLVABLE within depth');
  else if (r.depth <= 1) flags.push(`TRIVIAL: solved in ${r.depth}`);
  const line = `${p.id.padEnd(18)} ${r.solved ? `solved in ${r.depth}` : 'NOT SOLVED'}  ` +
               `(${r.states} states, goal ${p.goal.type})`;
  if (flags.length) { bad++; console.log('  FAIL ' + line + ' — ' + flags.join('; ')); }
  else console.log('  ok   ' + line + '  ' + describe(r.moves));
}
console.log(bad ? `\n${bad} puzzle(s) failed` : `\n${puzzles.length} puzzles: all solvable, none trivial`);
process.exit(bad ? 1 : 0);

function describe(moves) {
  return (moves || []).map(mv => mv.move === 'place' ? `place@${mv.r},${mv.c}`
    : mv.move === 'movedot' ? `dot→${mv.pos}@${mv.r},${mv.c}` : `transpose@${mv.r},${mv.c}`).join(' ');
}
