// rules.js — what a floor of the Descent is, in one place.
//
// Imported by the game (browser), by design_search.mjs (how the floors were
// found) and by verify_run.mjs (the gate), so all three agree about what counts
// as a legal write and a standing floor. Nothing here reads a file; the letter
// table and the ruleset are passed in.
//
// THE THREE RULES OF A FLOOR
//
//   WRITE   a word of one or more letters is written westward from a cursor. It
//           is legal when every cell is empty and at least one cell touches
//           something already built — the ground alone is not enough. Nothing
//           in the Descent is written on bare floor; it rests on the piers or it
//           falls.
//   STAND   gravity is let in once. A mark is held when a letter sits on it
//           after everything has settled.
//   HIDE    the ruleset is not shown. What it refuses is shown the moment it is
//           refused — that is the evidence; the name is yours to earn.

import { World } from '../../../engine/world.js?v=7';
import { compile, execute } from '../../../engine/vm.js?v=7';

/** Empty, and touching something built — the ground alone is not enough. */
export function legalCells(world, cells) {
  for (const [x, y] of cells) if (y < 0 || world.has(x, y, 0)) return false;
  return cells.some(([x, y]) =>
    world.has(x - 1, y, 0) || world.has(x + 1, y, 0) || world.has(x, y - 1, 0) || world.has(x, y + 1, 0));
}

export function bounds(level) {
  const xs = level.cells.map(c => c.x).concat(level.targets.map(t => t[0]));
  const ys = level.cells.map(c => c.y).concat(level.targets.map(t => t[1]));
  return { lo: Math.min(...xs) - 1, hi: Math.max(...xs) + 2, top: Math.max(...ys) + 2 };
}

export function startWorld(level) {
  const w = new World({ rules: { gravity: false } });
  for (const c of level.cells) w.set(c.x, c.y, 0, { material: 'earth', value: 1, fixed: true });
  return w;
}

/** Let gravity in on a COPY; report what stands. */
export function settled(world) {
  const w = world.clone();
  w.rules.gravity = true;
  const moved = w.settle();
  return { world: w, moved };
}

export function held(world, level) {
  return level.targets.filter(([x, y]) => { const c = world.get(x, y, 0); return c && c.glyph; });
}
export const won = (world, level) => held(settled(world).world, level).length === level.targets.length;

export const placementKey = w =>
  w.list().filter(c => c.glyph).map(c => `${c.glyph}@${c.x},${c.y}`).sort().join(' ');

/** The shortest word a ruleset will run at all. */
export const minWord = ruleset =>
  ruleset.power?.rule === 'procedure' ? (ruleset.power.min_length ?? 1) : 1;

/**
 * Write a word westward from a cursor. Returns { world, effects, compiled } or
 * { refused: why } — a refusal is not an error, it is evidence about the ruleset.
 */
export function write(world, word, cursor, { letters, ruleset }) {
  const compiled = compile(word.map(glyph => ({ glyph, register: 'written' })), { letters, ruleset });
  // Legality is judged on the cells the COMPILED program occupies, not on one
  // cell per letter of the word: a doubled letter is one letter with a shadda
  // (the engine's gemination rule), so مّ takes one cell and costs two letters.
  // Judging the raw word let an alif reach a cell it never touched -- caught
  // when the search offered a two-letter 'solution' from a three-letter hand.
  const cells = compiled.instructions.map(ins => [cursor[0] - ins.index, cursor[1]]);
  if (!cells.length || !legalCells(world, cells)) return { refused: 'illegal', why: 'A word must touch something already built, and every cell must be empty.' };
  if (compiled.power.value === 0) return { refused: 'power', why: compiled.power.why, compiled };
  const w = world.clone();
  const r = execute(w, compiled, { cursor: [cursor[0], cursor[1], 0], dir: [-1, 0, 0] });
  return { world: w, effects: r.effects, compiled };
}

/**
 * Every winning placement reachable with this hand under this ruleset, with one
 * move sequence that reaches each. Exhaustive over placements, not sequences —
 * two orders that build the same thing are the same solution.
 */
export function solutions(level, ruleset, { letters, maxStates = 20000, first = false } = {}) {
  const { lo, hi, top } = bounds(level);
  const minLen = minWord(ruleset);
  const wins = new Map();
  const seen = new Set();
  const queue = [{ world: startWorld(level), hand: level.hand.slice(), path: [] }];
  let states = 0;
  while (queue.length && states < maxStates) {
    const s = queue.shift(); states++;
    if (won(s.world, level)) { const k = placementKey(s.world); if (!wins.has(k)) wins.set(k, s.path); if (first) break; }
    if (!s.hand.length) continue;
    for (let k = minLen; k <= s.hand.length; k++) {
      const tried = new Set();
      for (const idx of permutations(s.hand.length, k)) {
        const word = idx.map(i => s.hand[i]);
        const rest = s.hand.filter((_, i) => !idx.includes(i));
        const dk = word.join('') + '#' + rest.slice().sort().join('');
        if (tried.has(dk)) continue;
        tried.add(dk);
        for (let x = lo; x <= hi; x++) for (let y = 0; y <= top; y++) {
          const r = write(s.world, word, [x, y], { letters, ruleset });
          if (r.refused) continue;
          const key = placementKey(r.world) + '#' + rest.slice().sort().join('');
          if (seen.has(key)) continue;
          seen.add(key);
          queue.push({ world: r.world, hand: rest, path: s.path.concat([{ word, cursor: [x, y] }]) });
        }
      }
    }
  }
  return wins;
}

function permutations(n, k) {
  const out = [];
  const rec = cur => {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = 0; i < n; i++) if (!cur.includes(i)) { cur.push(i); rec(cur); cur.pop(); }
  };
  rec([]);
  return out;
}

/**
 * Assess a floor across a set of rulesets: is it FAIR (solvable under each), is
 * every pair of rulesets DISTINCT on it (a placement stands in one and not the
 * other), and does a UNIVERSAL placement exist that wins everywhere — the thing
 * a player could learn instead of the assay.
 */
export function assess(level, rulesets, { letters }) {
  const S = {};
  for (const r of rulesets) S[r.id] = solutions(level, r, { letters });
  const ids = rulesets.map(r => r.id);
  const fair = ids.every(id => S[id].size > 0);
  const universals = fair ? [...S[ids[0]].keys()].filter(p => ids.every(id => S[id].has(p))) : [];
  // Directed traps: the share of A's solutions that lose under B. Two of these
  // are ZERO BY CONSTRUCTION — the Ottoman floor only forbids short words, so its
  // solutions are a subset of the intellectual's; the gnostic floor only removes
  // AXIS, so its solutions are a subset of the Sufi's. The search learned this
  // the hard way (9,579 candidates, none 'trapping in every direction'). So the
  // gate asks the UNORDERED question: do the two rulesets have DIFFERENT
  // solution sets at all — is there a placement that stands in one world and not
  // the other, whichever way round.
  const traps = {};
  let minTrap = 1, minDistinct = 1;
  for (const a of ids) for (const b of ids) {
    if (a === b) continue;
    const fail = [...S[a].keys()].filter(p => !S[b].has(p)).length;
    traps[`${a}>${b}`] = S[a].size ? fail / S[a].size : 0;
    minTrap = Math.min(minTrap, traps[`${a}>${b}`]);
  }
  const distinct = {};
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = ids[i], b = ids[j];
    const union = new Set([...S[a].keys(), ...S[b].keys()]);
    const both = [...union].filter(p => S[a].has(p) && S[b].has(p)).length;
    const d = union.size ? (union.size - both) / union.size : 0;   // share of the union NOT shared
    distinct[`${a}|${b}`] = d;
    minDistinct = Math.min(minDistinct, d);
  }
  return { S, fair, universals, minTrap, traps, minDistinct, distinct };
}

/** A small deterministic PRNG so a run can be replayed from its seed. */
export function rng(seed) {
  // xorshift32, with the seed mixed first: small consecutive seeds otherwise give
  // near-identical opening draws, and a run's deal is only three draws long.
  let s = Math.imul((seed >>> 0) ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  s ^= s >>> 13; s = Math.imul(s, 0xc2b2ae35) >>> 0; s ^= s >>> 16;
  if (!s) s = 0x1234567;
  const next = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  for (let i = 0; i < 4; i++) next();
  return next;
}
export function shuffle(list, rand) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
