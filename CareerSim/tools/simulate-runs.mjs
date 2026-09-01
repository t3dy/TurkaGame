// simulate-runs.mjs — plays N complete runs through the real engine and reports what
// the loop actually produces: meter curves, ending distribution, which encounters ever
// fire, and how much two runs overlap.
//
//   node tools/simulate-runs.mjs [n=2000] [random|greedy|cautious]
//
// `random` picks uniformly among available options — the floor, what a player who
// understands nothing would get. `greedy` prefers options whose requirements are met
// (i.e. rewards preparation) — a rough proxy for skilled play. If a balance claim only
// holds under one of them, it is not a balance claim.
//
// `cautious` always takes the option with the lowest expected exposure gain — the
// deliberate low-profile strategy. It exists to answer ENDINGS.md §8's question: are the
// quiet fates (`unremarked`, `judge`, `eminent`) reachable by INTENT, or only by luck?
// If cautious play cannot reach them, "safety costs the whole game" is not a design,
// it is a fiction.
//
// The flow below mirrors src/main.js exactly (time spend, obligations, contract ticks,
// departure node, phase advance). If main.js's loop changes, change it here too, or the
// numbers quietly stop describing the game.

import { newRun } from '../src/engine/state.js?v=3';
import { drawEncounter, drawInjection, evaluateOptions, resolveOption, encounterEligible } from '../src/engine/engine.js?v=6';
import {
  addObligation, dropObligation, chargeObligations, offerContract, tickContracts, settleContracts, finalVerdict,
} from '../src/engine/career.js?v=7';
import { PEOPLE, ARTIFACTS, ENCOUNTERS, PHASES, phaseById, LAST_PHASE } from '../content/index.js?v=8';

const N = parseInt(process.argv[2] || '2000', 10);
const MODE = process.argv[3] || 'random';
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function playRun() {
  const state = newRun();
  const seen = [];
  const metersByPhase = [];
  let offered = 0, locked = 0;
  const lockReasons = [];
  for (let ph = 1; ph <= LAST_PHASE; ph++) {
    state.phase = ph;
    state.time = phaseById(ph).time;
    const P = phaseById(ph);
    for (let guard = 0; guard < 200; guard++) {
      const dep = P.nodes.find((n) => n.departure);
      let node;
      if (state.time <= 0) {
        if (dep && !state.seen.includes(dep.encounters[0])) node = dep; else break;
      } else {
        const open = P.nodes.filter((n) => !n.departure &&
          n.encounters.some((id) => ENCOUNTERS[id] && encounterEligible(state, ENCOUNTERS[id])));
        if (!open.length) { if (dep && !state.seen.includes(dep.encounters[0])) node = dep; else break; }
        else node = pick(open);
      }
      const injected = node.departure ? null : drawInjection(state, P, ENCOUNTERS);
      const enc = injected || drawEncounter(state, node, ENCOUNTERS);
      if (!enc) break;
      if (!node.departure) {
        state.time = Math.max(0, state.time - 1);
        chargeObligations(state);
        tickContracts(state);
      }
      const evaluated = evaluateOptions(state, enc, PEOPLE, ARTIFACTS);
      offered += evaluated.length;
      for (const ev of evaluated) if (!ev.available) { locked++; lockReasons.push(...ev.lockedBy); }
      const avail = evaluated.filter((ev) => ev.available);
      if (!avail.length) break;
      const prepared = avail.filter((ev) => ev.unlockedBy.length);
      let chosen;
      if (MODE === 'greedy' && prepared.length) chosen = pick(prepared);
      else if (MODE === 'cautious') {
        // expected exposure delta: option base effects plus the weight-averaged bands
        const expCost = (ev) => {
          const base = ((ev.opt.effects || {}).meters || {}).exposure || 0;
          const bands = ev.opt.outcomes || [];
          const tw = bands.reduce((a, b) => a + b.weight, 0) || 1;
          const avg = bands.reduce((a, b) => a + b.weight * ((((b.effects || {}).meters || {}).exposure) || 0), 0) / tw;
          return base + avg;
        };
        const scored = avail.map((ev) => ({ ev, c: expCost(ev) }));
        const min = Math.min(...scored.map((x) => x.c));
        chosen = pick(scored.filter((x) => x.c === min).map((x) => x.ev));
      } else chosen = pick(avail);
      resolveOption(state, enc, chosen);
      seen.push(enc.id);
      const o = chosen.opt;
      if (o.grantsObligation) addObligation(state, o.grantsObligation);
      if (o.dropsObligation) dropObligation(state, o.dropsObligation);
      if (o.contract) offerContract(state, o.contract);
      if (node.departure) break;
    }
    settleContracts(state);
    metersByPhase.push({ ...state.meters });
  }
  state.verdict = finalVerdict(state);
  return { state, seen, metersByPhase, offered, locked, lockReasons };
}

const fire = {}, manFates = {}, sysFates = {}, bands = {}, lockTally = {};
const curve = PHASES.map(() => []);
const end = { synthesis: [], demonstration: [], transmission: [], exposure: [] };
const reps = { orthodox: [], occult: [], imperial: [], scholarly: [] };
const overlaps = [], seenCounts = [], expectations = [];
const third = {};
let prev = null, lockedShare = 0, contracts = 0;

for (let i = 0; i < N; i++) {
  const r = playRun();
  for (const id of r.seen) fire[id] = (fire[id] || 0) + 1;
  manFates[r.state.verdict.man.key] = (manFates[r.state.verdict.man.key] || 0) + 1;
  sysFates[r.state.verdict.system.key] = (sysFates[r.state.verdict.system.key] || 0) + 1;
  for (const c of r.state.chronicle) bands[c.band] = (bands[c.band] || 0) + 1;
  for (const k of Object.keys(end)) end[k].push(r.state.meters[k]);
  for (const k of Object.keys(reps)) reps[k].push(r.state.rep[k]);
  r.metersByPhase.forEach((m, i2) => curve[i2] && curve[i2].push(m));
  seenCounts.push(r.seen.length);
  expectations.push(r.state.expectation || 0);
  contracts += r.state.contracts.length;
  third[String(r.state.memory.third_inquisition)] = (third[String(r.state.memory.third_inquisition)] || 0) + 1;
  lockedShare += r.locked / Math.max(1, r.offered);
  for (const x of r.lockReasons) lockTally[x] = (lockTally[x] || 0) + 1;
  const set = new Set(r.seen);
  if (prev) {
    const inter = [...set].filter((x) => prev.has(x)).length;
    overlaps.push(inter / new Set([...set, ...prev]).size);
  }
  prev = set;
}

const q = (a) => { const s = [...a].sort((x, y) => x - y); return { min: s[0], p25: s[(s.length * .25) | 0], med: s[(s.length / 2) | 0], p75: s[(s.length * .75) | 0], max: s[s.length - 1], mean: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) }; };
const pctOf = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${(100 * v / n).toFixed(1)}%`);

console.log(`\n=== ${N} runs · choice mode: ${MODE} ===`);

console.log('\nMEDIAN METERS AT THE END OF EACH PHASE');
console.log('            synthesis  demonstration  transmission  exposure');
curve.forEach((c, i) => {
  if (!c.length) return;
  const m = (k) => { const s = c.map((x) => x[k]).sort((a, b) => a - b); return s[(s.length / 2) | 0]; };
  console.log(`  after P${i + 1}  ${String(m('synthesis')).padStart(9)}  ${String(m('demonstration')).padStart(13)}  ${String(m('transmission')).padStart(12)}  ${String(m('exposure')).padStart(8)}`);
});

console.log('\nEND-OF-RUN DISTRIBUTIONS');
for (const [k, v] of Object.entries(end)) console.log(`  ${k.padEnd(14)}`, JSON.stringify(q(v)));
for (const [k, v] of Object.entries(reps)) console.log(`  rep:${k.padEnd(10)}`, JSON.stringify(q(v)));

console.log('\nCOVERAGE AND VARIETY');
console.log(`  encounters seen per run: ${JSON.stringify(q(seenCounts))} of ${Object.keys(ENCOUNTERS).length} authored`);
console.log(`  run-to-run overlap (Jaccard): mean ${(100 * overlaps.reduce((a, b) => a + b, 0) / overlaps.length).toFixed(1)}%   (Slice 4 target: <40%)`);
console.log(`  locked share of options shown: ${(100 * lockedShare / N).toFixed(1)}%`);

console.log('\nCAREER SYSTEMS');
console.log(`  contracts opened per run: ${(contracts / N).toFixed(2)}`);
console.log(`  patron expectation at end: ${JSON.stringify(q(expectations))}  (read by 3 boosts since 2026-09-01)`);

console.log('\nOUTCOME BANDS AS PLAYED:', pctOf(bands, Object.values(bands).reduce((a, b) => a + b, 0)).join(' · '));
console.log('THIRD INQUISITION:', pctOf(third, N).join(' · '));

console.log('\nMAN FATES:   ', pctOf(manFates, N).join(' · '));
console.log('SYSTEM FATES:', pctOf(sysFates, N).join(' · '));

const rows = Object.values(ENCOUNTERS).map((e) => ({ id: e.id, phase: e.phase, pct: (100 * (fire[e.id] || 0)) / N })).sort((a, b) => a.pct - b.pct);
console.log('\nENCOUNTERS FIRING IN UNDER 10% OF RUNS (authored but effectively unseen):');
for (const r of rows.filter((r) => r.pct < 10)) console.log(`  P${r.phase} ${r.pct.toFixed(1).padStart(5)}%  ${r.id}`);

console.log('\nMOST-SHOWN LOCKED DOORS (per run):');
Object.entries(lockTally).sort((a, b) => b[1] - a[1]).slice(0, 12)
  .forEach(([r, n]) => console.log(`  ${(n / N).toFixed(2)}  ${r}`));
