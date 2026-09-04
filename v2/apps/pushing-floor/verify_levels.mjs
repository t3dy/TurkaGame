// verify_levels.mjs — the gate every level must pass before a person sees it.
//
//   node v2/apps/pushing-floor/verify_levels.mjs [--trace]
//
// Two questions, and the second is the one that matters:
//
//   1. Is it solvable at all, within its move budget?
//   2. Is it solvable WITHOUT the letters?
//
// If the answer to the second is yes, the letters are decoration and the level is
// a lie about what this game is. A level that fails either check fails the build.
//
// This is The Impossible Architect's rule with a second edge on it. That board was
// winnable in fifteen moves without ever opening a door — solvable, and solvable
// for the wrong reason. Checking only "can it be won" would have passed it.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { World } from '../../engine/world.js';
import { compile, execute } from '../../engine/vm.js';
import { Scribe, DIRS, targetsCovered, solve } from '../../engine/agent.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', '..', 'rulesets', 'rulesets.json'), 'utf8'));
const LEVELS = JSON.parse(readFileSync(join(here, 'levels.json'), 'utf8'));
const TRACE = process.argv.includes('--trace');

/** One position: the world, where the scribe stands, and what is left in hand. */
export class Position {
  constructor(world, scribe, hand, level, ruleset) {
    this.world = world; this.scribe = scribe; this.hand = hand;
    this.level = level; this.ruleset = ruleset;
  }
  static start(level, ruleset, { hand = null } = {}) {
    const w = new World({ rules: { gravity: !!level.gravity } });
    for (const c of level.cells) {
      const cell = w.set(c.x, c.y || 0, c.z, { ...c, y: c.y || 0 });
      if (cell.glyph) {
        const l = letters.find(x => x.glyph === cell.glyph);
        cell.connects = !l.primitives.some(p => p.op === 'SEVER');
        cell.axis = l.primitives.some(p => p.op === 'AXIS');
      }
    }
    for (const [a, b] of level.bonds || []) w.bond(`${a.join(',')}`, `${b.join(',')}`);
    return new Position(w, new Scribe(w, level.scribe), hand ?? level.hand.slice(), level, ruleset);
  }
  clone() {
    const w = this.world.clone();
    return new Position(w, new Scribe(w, this.scribe.pos), this.hand.slice(), this.level, this.ruleset);
  }
  hash() { return this.scribe.hash() + '#' + this.hand.join(''); }
  win() { return targetsCovered(this.world, this.level.targets).win; }
}

/** Walk four ways; inscribe any letter in hand into a reachable empty cell. */
export function movesFor(pos) {
  const out = [];
  for (const [name, d] of Object.entries(DIRS)) {
    out.push({ label: name[0], apply() {
      const p = pos.clone();
      return p.scribe.step(d).ok ? p : null;
    } });
  }
  for (let i = 0; i < pos.hand.length; i++) {
    const glyph = pos.hand[i];
    for (const d of Object.values(DIRS)) {
      const at = [pos.scribe.pos[0] + d[0], pos.scribe.pos[1] + d[1], pos.scribe.pos[2] + d[2]];
      if (pos.world.has(...at)) continue;
      out.push({ label: `${glyph}@${at[0]},${at[2]}`, apply() {
        const p = pos.clone();
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
  const withHand = solve(Position.start(lv, ruleset), { maxDepth: lv.max_depth ?? 14, moves: movesFor });
  const without = solve(Position.start(lv, ruleset, { hand: [] }), { maxDepth: lv.max_depth ?? 14, moves: movesFor });

  const flags = [];
  if (!withHand.solved) flags.push(withHand.exhausted ? `UNSOLVED (exhausted at ${withHand.states})` : 'UNSOLVABLE within depth');
  if (without.solved) flags.push(`DECORATION: solvable in ${without.depth} with NO letters`);

  // THIRD QUESTION, for a level that claims the choice matters: is there actually
  // a wrong one? Enumerate every place the letter could first be written, solve
  // from each, and count the dead ends. If every placement still wins, the level
  // is telling the player a decision is at stake when none is — which the first
  // two checks would happily pass.
  let choice = null;
  if (lv.claims_choice) {
    // Every empty cell, not merely the ones the scribe can reach on turn one —
    // the choice the player actually faces is over the whole floor, and an
    // earlier version of this check enumerated only the immediate neighbours and
    // cheerfully reported "2/2 dead ends" for a level whose winning placement was
    // two steps away.
    const start = Position.start(lv, ruleset);
    const xs = lv.cells.map(c => c.x), zs = lv.cells.map(c => c.z);
    const sites = [];
    for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
      for (let z = Math.min(...zs); z <= Math.max(...zs); z++) {
        if (!start.world.has(x, 0, z)) sites.push([x, 0, z]);
      }
    }
    let win = 0, dead = 0;
    for (const at of sites) {
      const p = start.clone();
      const c = compile([{ glyph: lv.hand[0], register: 'written' }], { letters, ruleset });
      execute(p.world, c, { cursor: at, dir: [-1, 0, 0] });
      p.hand.shift();
      (solve(p, { maxDepth: lv.max_depth ?? 14, moves: movesFor }).solved ? (win++) : (dead++));
    }
    choice = { plays: win + dead, win, dead };
    if (!dead) flags.push(`NO REAL CHOICE: all ${win} placements still win`);
  }

  const line = `${lv.id.padEnd(16)} ${withHand.solved ? `solved in ${withHand.depth}` : 'NOT SOLVED'}` +
               `  ·  without letters: ${without.solved ? `solved in ${without.depth}` : 'unsolvable'}` +
               `  (${withHand.states}/${without.states} states)`;
  if (flags.length) { bad++; console.log('  FAIL ' + line + '\n         ' + flags.join('; ')); }
  else {
    console.log('  ok   ' + line + (choice ? `  ·  choice: ${choice.dead}/${choice.plays} placements of the letter lose` : ''));
    if (TRACE) console.log('         ' + withHand.path.join(' '));
  }
}
console.log(bad ? `\n${bad} level(s) failed` : `\n${LEVELS.levels.length} levels: all solvable, and none solvable without its letters`);
process.exit(bad ? 1 : 0);
