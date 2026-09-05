// design_search.mjs — how the floors of The Descent were found.
//
//   node v2/apps/descent/design_search.mjs [--budget-ms 240000] [--hand-size 3] [--skip pier2]
//
// A floor of the Descent is a building task whose answer DEPENDS ON WHICH
// METAPHYSICS YOU ARE IN. That is a strong property and hand-design failed to
// produce it: every level I sketched had a placement that won everywhere,
// because Sufi lettrism joins everything and so wins wherever the intellectual
// does. So the floors are searched for, not sketched — small piers, small hands,
// every target set — and for each candidate the FULL set of winning placements
// under each of the four historical rulesets is computed. A floor is kept when
//
//   FAIR       every ruleset has at least one winning placement, and
//   DISTINCT   every pair of rulesets has a different set of winning placements
//              here — some structure stands in one world and not the other.
//
// (The first version demanded a trap in EVERY DIRECTION and found nothing in
// 9,579 candidates. The Ottoman floor's solutions are a subset of the
// intellectual's by construction — it only forbids short words — and the
// gnostic's are a subset of the Sufi's — it only removes AXIS. A gate can be
// impossible without looking wrong; the count is how that was learned.)
//
// Ranked first by how few UNIVERSAL placements it has (ones that win under all
// four — the thing a player could learn instead of the assay), then by how far
// apart the least-distinct pair of rulesets is.
//
// This file is the record; levels.json is the result; verify_run.mjs re-checks
// the result every time so the two cannot drift apart.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { assess } from './src/rules.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', '..', 'rulesets', 'rulesets.json'), 'utf8'));
const RULESETS = PACK.rulesets.filter(r => r.kind === 'PORTAL');

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > 0 ? +process.argv[i + 1] : dflt; };
const budget = arg('--budget-ms', 240000);
const handSize = arg('--hand-size', 3);
// --skip pier2,pier3   leave out templates already searched
const skipArg = process.argv.indexOf('--skip');
const skip = skipArg > 0 ? process.argv[skipArg + 1].split(',') : [];

const templates = {
  pier2:      [[0, 0], [0, 1]],
  pier2step:  [[0, 0], [0, 1], [3, 0]],
  twoPiers:   [[0, 0], [0, 1], [3, 0], [3, 1]],
  pier3:      [[0, 0], [0, 1], [0, 2]],
  lintel:     [[0, 0], [0, 1], [2, 2]],
};
const targetPool = [[0, 2], [1, 2], [2, 2], [3, 2], [1, 1], [2, 1], [3, 1], [1, 0], [2, 0], [0, 3], [1, 3]];
const pool = ['م', 'ر', 'ا', 'ل', 'د', 'ه'];

function multisets(k) {
  const out = [];
  const rec = (start, cur) => {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = start; i < pool.length; i++) { cur.push(pool[i]); rec(i, cur); cur.pop(); }
  };
  rec(0, []);
  return out;
}
// only hands that carry some asymmetry at all: a breaker or an alif
const hands = multisets(handSize).filter(h => h.some(g => ['ر', 'ا', 'د'].includes(g)));
const subsets = [];
for (let i = 0; i < targetPool.length; i++) for (let j = i + 1; j < targetPool.length; j++) {
  subsets.push([targetPool[i], targetPool[j]]);
  for (let k = j + 1; k < targetPool.length; k++) subsets.push([targetPool[i], targetPool[j], targetPool[k]]);
}

const t0 = Date.now();
const found = [];
let tried = 0, fairCount = 0;
outer:
for (const [tname, cells] of Object.entries(templates)) {
  if (skip.includes(tname)) continue;
  for (const targets of subsets) {
    if (targets.some(t => cells.some(c => c[0] === t[0] && c[1] === t[1]))) continue;
    if (!targets.some(t => t[1] >= 2)) continue;
    for (const hand of hands) {
      if (Date.now() - t0 > budget) break outer;
      tried++;
      const level = { cells: cells.map(([x, y]) => ({ x, y })), targets, hand };
      const a = assess(level, RULESETS, { letters });
      if (a.fair) fairCount++;
      // HARD: fair, and every PAIR of rulesets has a different solution set here.
      // SOFT: no universal placement at all; failing that, as few as possible.
      if (!a.fair || a.minDistinct <= 0) continue;
      found.push({ template: tname, targets, hand, ...a });
    }
  }
}
const sizeSum = f => Object.values(f.S).reduce((n, s) => n + s.size, 0);
found.sort((p, q) => (p.universals.length - q.universals.length) || (q.minDistinct - p.minDistinct) || (sizeSum(p) - sizeSum(q)));
const none = found.filter(f => !f.universals.length).length;
console.log(`tried ${tried} candidates in ${((Date.now() - t0) / 1000).toFixed(0)}s; ${fairCount} fair; ${found.length} fair with every pair distinct; ${none} of those with NO universal placement\n`);
for (const f of found.slice(0, 40)) {
  console.log(`${f.template.padEnd(10)} hand ${f.hand.join('')}  targets ${f.targets.map(t => t.join(',')).join(' ')}  minDistinct ${f.minDistinct.toFixed(2)}  universals ${f.universals.length}  sizes ${RULESETS.map(r => f.S[r.id].size).join('/')}`);
  for (const r of RULESETS) console.log(`     ${r.id.padEnd(18)} ${[...f.S[r.id].keys()].join(' | ')}`);
}
