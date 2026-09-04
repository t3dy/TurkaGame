// verify_levels.mjs — a different question for each of the four level types.
//
//   node v2/apps/reckoner/verify_levels.mjs [--trace]
//
// The pattern this project keeps arriving at: "is it solvable" is never enough.
// v1's Impossible Architect was solvable AND solvable for the wrong reason. So
// each type is asked the thing that would expose a level pretending to be about
// something it is not:
//
//   extract   solvable, and NOT solvable wherever you put the doomed letter
//   reckon    a winning number exists, and only a small share of the range wins.
//             (The first version demanded EXACTLY ONE, which was the check being
//             wrong rather than the level: a cantilever can be cut in more than
//             one place, and several right answers is not a guessing game.)
//   assay     the probes must actually DISTINGUISH the hidden ruleset from all
//             four others. Otherwise the player is asked to identify something
//             the evidence cannot identify, which is the cruellest kind of puzzle.
//   station   exactly one direction reads the target

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { World, KEY } from '../../engine/world.js';
import { compile, execute } from '../../engine/vm.js';
import { extract, extracted, findRuns, reckon, readsFrom } from '../../engine/operations.js';
import { standing } from '../../engine/unmaking.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', '..', 'rulesets', 'rulesets.json'), 'utf8'));
const DATA = JSON.parse(readFileSync(join(here, 'levels.json'), 'utf8'));
const TRACE = process.argv.includes('--trace');
const WORKSHOP = PACK.rulesets.find(r => r.id === 'workshop');
const prog = (s, register = 'written') => [...s].map(glyph => ({ glyph, register }));

function baseWorld(lv) {
  const w = new World({ rules: { gravity: true } });
  for (const c of lv.cells || []) w.set(c.x, c.y || 0, c.z || 0, { ...c, y: c.y || 0, z: c.z || 0 });
  for (const [a, b] of lv.bonds || []) w.bond(KEY(...a), KEY(...b));
  if (lv.build) execute(w, compile(prog(lv.build.word), { letters, ruleset: WORKSHOP }),
                        { cursor: lv.build.cursor, dir: [-1, 0, 0] });
  w.settle();
  return w;
}

/* ------------------------------------------------------------------ extract */
// Every ordering of the hand into a row off the pier, then extraction.

function checkExtract(lv) {
  const perms = permutations(lv.hand);
  let wins = 0, losses = 0, winning = null;
  for (const order of perms) {
    const w = baseWorld(lv);
    execute(w, compile(prog(order.join('')), { letters, ruleset: WORKSHOP }),
            { cursor: [lv.hand.length - 1, lv.line, 0], dir: [-1, 0, 0] });
    w.settle();
    extract(w, lv.letter, { apply: true });
    const ok = extracted(w, lv.letter, lv.line) && standing(w, lv.line) >= lv.survivors;
    if (ok) { wins++; winning = winning || order.join(''); } else losses++;
  }
  const flags = [];
  if (!wins) flags.push('UNSOLVABLE: no arrangement works');
  if (!losses) flags.push('NO CHOICE: every arrangement works');
  return { flags, detail: `${wins} of ${perms.length} arrangements win` + (winning ? ` (e.g. ${winning})` : '') };
}

/* ------------------------------------------------------------------- reckon */

function checkReckon(lv) {
  const w0 = baseWorld(lv);
  const before = standing(w0, lv.line);
  const values = w0.list().filter(c => c.glyph).map(c => c.value);
  const max = values.reduce((a, b) => a + b, 0);
  const winners = [];
  for (let n = 1; n <= max; n++) {
    const w = baseWorld(lv);
    const r = reckon(w, n, { apply: true });
    if (!r.runs.length) continue;
    if (standing(w, lv.line) <= lv.leave_at_most) winners.push(n);
  }
  // The first version of this check demanded EXACTLY ONE winning number and failed
  // the level for having three. That was the check being wrong, not the level: this
  // is arithmetic on a structure, and a cantilever can be cut in more than one
  // place. Several right answers is not a guessing game. What WOULD be is if a
  // large share of all numbers worked, so that naming one at random tended to win —
  // and that is what is measured instead.
  const share = winners.length / max;
  const flags = [];
  if (!winners.length) flags.push('UNSOLVABLE: no number brings it down');
  if (share > 0.1) flags.push(`A GUESSING GAME: ${winners.length} of ${max} numbers win (${Math.round(share * 100)}%)`);
  return { flags, detail: `${before} standing; ${winners.length} of ${max} numbers win` +
           ` (${winners.join(', ') || 'none'}) — ${Math.round(share * 100)}% of the range` };
}

/* -------------------------------------------------------------------- assay */
// The real check: do the probes distinguish the hidden ruleset from every other?

function probeSignature(ruleset) {
  return DATA.probes.map(p => {
    const c = compile(prog(p.write, p.register), { letters, ruleset });
    const refused = c.diagnostics.filter(d => d.level === 'refused').map(d => d.op).sort().join('/');
    const errored = c.diagnostics.some(d => d.level === 'error');
    return `${p.id}:${errored ? 'ERR' : ''}${Math.round(c.power.value * 100)}${refused ? '-' + refused : ''}`;
  }).join(' | ');
}

function checkAssay(lv) {
  const sigs = new Map();
  for (const r of PACK.rulesets) {
    const s = probeSignature(r);
    if (!sigs.has(s)) sigs.set(s, []);
    sigs.get(s).push(r.id);
  }
  const flags = [];
  const collisions = [...sigs.values()].filter(v => v.length > 1);
  if (collisions.length) {
    flags.push('INDISTINGUISHABLE: ' + collisions.map(v => v.join(' = ')).join('; ') +
               ' — the probes cannot tell these apart, so the puzzle cannot be solved by evidence');
  }
  return { flags, detail: `${sigs.size} distinct signatures across ${PACK.rulesets.length} rulesets`,
           sigs: [...sigs.entries()] };
}

/* ------------------------------------------------------------------ station */

function checkStation(lv) {
  const w = baseWorld(lv);
  const rs = readsFrom(w, lv.target);
  const yes = rs.filter(r => r.found);
  const flags = [];
  if (!yes.length) flags.push(`UNSOLVABLE: nothing reads as ${lv.target} from any direction`);
  if (yes.length === rs.length) flags.push('TRIVIAL: it reads the same from every direction');
  return { flags, detail: `reads as ${lv.target} from ${yes.map(r => r.id).join(', ') || 'nowhere'}` +
                          ` · elsewhere ${rs.filter(r => !r.found).map(r => r.reads[0]).join(', ')}` };
}

/* --------------------------------------------------------------------- run */

const CHECK = { extract: checkExtract, reckon: checkReckon, assay: checkAssay, station: checkStation };
let bad = 0;
for (const lv of DATA.levels) {
  const r = CHECK[lv.type](lv);
  const line = `${lv.id.padEnd(20)} ${lv.type.padEnd(8)} ${r.detail}`;
  if (r.flags.length) { bad++; console.log('  FAIL ' + line + '\n         ' + r.flags.join('; ')); }
  else {
    console.log('  ok   ' + line);
    if (TRACE && r.sigs) for (const [s, ids] of r.sigs) console.log(`         ${ids.join(',').padEnd(20)} ${s}`);
  }
}
console.log(bad ? `\n${bad} level(s) failed` : `\n${DATA.levels.length} levels: each checked by the question its own type has to answer`);
process.exit(bad ? 1 : 0);

function permutations(a) {
  if (a.length <= 1) return [a];
  const out = [];
  a.forEach((x, i) => permutations([...a.slice(0, i), ...a.slice(i + 1)]).forEach(p => out.push([x, ...p])));
  return out;
}
