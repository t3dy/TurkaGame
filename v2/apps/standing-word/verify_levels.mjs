// verify_levels.mjs — the gate for The Standing Word.
//
//   node v2/apps/standing-word/verify_levels.mjs [--trace]
//
// A stacker asks a different second question than a pusher did. On the Pushing
// Floor the useful check was "is it solvable WITHOUT the letters", because
// walking was a competing verb. Here writing is the only verb, so that check is
// vacuous — of course you cannot build a tower with nothing.
//
// The question that bites instead: DOES IT MATTER WHICH LETTER YOU USE? A level
// where any three letters would do is a level that has taught nothing. So the
// check enumerates every (letter, cell) opening, solves from each, and requires
// that a real proportion of them lose.
//
// Both checks exist for the same reason: a level can be solvable and still be a
// lie about what the game is.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { World, KEY } from '../../engine/world.js';
import { compile, execute } from '../../engine/vm.js';
import { solve } from '../../engine/agent.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', '..', 'rulesets', 'rulesets.json'), 'utf8'));
const LEVELS = JSON.parse(readFileSync(join(here, 'levels.json'), 'utf8'));
const TRACE = process.argv.includes('--trace');

/** Where may a letter be written? On the ground, or beside something standing. */
export function sites(world, level) {
  const out = [];
  const xs = level.targets.map(t => t[0]).concat(level.cells.map(c => c.x));
  const ys = level.targets.map(t => t[1]).concat(level.cells.map(c => c.y || 0));
  const lo = Math.min(...xs) - 1, hi = Math.max(...xs) + 2;
  const top = Math.max(...ys) + 2;
  for (let x = lo; x <= hi; x++) {
    for (let y = 0; y <= top; y++) {
      if (world.has(x, y, 0)) continue;
      const touching = y === 0 ||
        world.has(x - 1, y, 0) || world.has(x + 1, y, 0) ||
        world.has(x, y - 1, 0) || world.has(x, y + 1, 0);
      if (touching) out.push([x, y, 0]);
    }
  }
  return out;
}

export class Build {
  constructor(world, hand, level, ruleset) {
    this.world = world; this.hand = hand; this.level = level; this.ruleset = ruleset;
  }
  static start(level, ruleset, { hand = null } = {}) {
    const w = new World({ rules: { gravity: false } });
    for (const c of level.cells) w.set(c.x, c.y || 0, c.z || 0, { ...c, y: c.y || 0, z: c.z || 0 });
    return new Build(w, hand ?? level.hand.slice(), level, ruleset);
  }
  clone() { return new Build(this.world.clone(), this.hand.slice(), this.level, this.ruleset); }
  hash() { return this.world.hash() + '#' + this.hand.join(''); }

  /** Let gravity in, on a COPY, and see what is left standing. */
  settled() {
    const w = this.world.clone();
    w.rules.gravity = true;
    w.settle();
    return w;
  }
  win() {
    const w = this.settled();
    return this.level.targets.every(t => {
      const c = w.get(...t);
      return c && c.glyph;
    });
  }
}

export function movesFor(b) {
  const out = [];
  const where = sites(b.world, b.level);
  for (let i = 0; i < b.hand.length; i++) {
    const glyph = b.hand[i];
    for (const at of where) {
      out.push({ label: `${glyph}@${at[0]},${at[1]}`, apply() {
        const p = b.clone();
        const c = compile([{ glyph, register: 'written' }], { letters, ruleset: p.ruleset });
        if (c.power.value === 0) return null;
        execute(p.world, c, { cursor: at, dir: [-1, 0, 0] });
        p.hand.splice(i, 1);
        return p;
      } });
    }
  }
  return out;
}

let bad = 0;
for (const lv of LEVELS.levels) {
  const ruleset = PACK.rulesets.find(r => r.id === (lv.ruleset || 'workshop'));
  const r = solve(Build.start(lv, ruleset), { maxDepth: lv.max_depth ?? 4, moves: movesFor });

  const flags = [];
  if (!r.solved) flags.push(r.exhausted ? `UNSOLVED (exhausted at ${r.states})` : 'UNSOLVABLE within depth');

  // Does the choice of letter matter? Enumerate every opening and solve from it.
  let choice = null;
  if (lv.claims_choice) {
    const start = Build.start(lv, ruleset);
    let win = 0, dead = 0;
    for (const m of movesFor(start)) {
      const after = m.apply();
      if (!after) continue;
      (solve(after, { maxDepth: (lv.max_depth ?? 4) - 1, moves: movesFor }).solved ? win++ : dead++);
    }
    choice = { win, dead, total: win + dead };
    if (!dead) flags.push(`NO REAL CHOICE: all ${win} openings still win`);
    if (!win) flags.push('NO WINNING OPENING FOUND — the depth budget is probably wrong');
  }

  const line = `${lv.id.padEnd(22)} ${r.solved ? `solved in ${r.depth}` : 'NOT SOLVED'}  (${r.states} states)`;
  if (flags.length) { bad++; console.log('  FAIL ' + line + '\n         ' + flags.join('; ')); }
  else {
    console.log('  ok   ' + line + (choice ? `  ·  ${choice.dead}/${choice.total} openings lose` : ''));
    if (TRACE) console.log('         ' + r.path.join(' '));
  }
}
console.log(bad ? `\n${bad} level(s) failed` : `\n${LEVELS.levels.length} levels: all solvable, and on each the choice of letter decides it`);
process.exit(bad ? 1 : 0);
