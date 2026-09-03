// publish-simulated.mjs — play complete runs through the real engine, capture the full
// scholarly log exactly as main.js would, and publish them to the witness service as
// origin:'simulated'. NEXTSTEPS item 5: this is what turns the researcher's desk into a
// balance instrument — which endings are unreachable, which encounters never fire,
// which options nobody can afford, all inspectable as real published chronicles.
//
//   node tools/publish-simulated.mjs [n=3] [random|greedy|cautious] [--dry]
//
// --dry writes the payloads to tools/out/ instead of publishing. Without it, each run
// is POSTed to the live service (default https://turka-witness.vercel.app; override
// with WITNESS_URL). Publish sparingly: the service is unlisted but real, and every
// witness is permanent. Keys returned by the service are printed to stdout — for
// simulated runs they are disposable, but they are still the only copy.
//
// The loop mirrors src/main.js exactly (injections, node-open-while-injection-pending,
// time, obligations, contracts, departure, logEntry AFTER resolveOption). If main.js
// changes, change this and simulate-runs.mjs together.

import { newRun } from '../src/engine/state.js?v=3';
import { drawEncounter, drawInjection, evaluateOptions, resolveOption, encounterEligible } from '../src/engine/engine.js?v=7';
import { addObligation, dropObligation, chargeObligations, offerContract, tickContracts, settleContracts, finalVerdict } from '../src/engine/career.js?v=8';
import { logEntry, buildChroniclePayload } from '../src/engine/export.js?v=7';
import { PEOPLE, ARTIFACTS, ENCOUNTERS, PHASES, phaseById, LAST_PHASE } from '../content/index.js?v=11';
import { writeFileSync, mkdirSync } from 'node:fs';

const N = parseInt(process.argv[2] || '3', 10);
const MODE = ['random', 'greedy', 'cautious'].includes(process.argv[3]) ? process.argv[3] : 'random';
const DRY = process.argv.includes('--dry');
const SERVICE = process.env.WITNESS_URL || 'https://turka-witness.vercel.app';
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function choose(avail) {
  if (MODE === 'greedy') {
    const prepared = avail.filter((ev) => ev.unlockedBy.length);
    if (prepared.length) return pick(prepared);
  }
  if (MODE === 'cautious') {
    const expCost = (ev) => {
      const base = ((ev.opt.effects || {}).meters || {}).exposure || 0;
      const bands = ev.opt.outcomes || [];
      const tw = bands.reduce((a, b) => a + b.weight, 0) || 1;
      return base + bands.reduce((a, b) => a + b.weight * ((((b.effects || {}).meters || {}).exposure) || 0), 0) / tw;
    };
    const scored = avail.map((ev) => ({ ev, c: expCost(ev) }));
    const min = Math.min(...scored.map((x) => x.c));
    return pick(scored.filter((x) => x.c === min).map((x) => x.ev));
  }
  return pick(avail);
}

function playRun() {
  const state = newRun();
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
        const injectedPending = !!drawInjection(state, P, ENCOUNTERS);
        const open = P.nodes.filter((n) => !n.departure &&
          (injectedPending || n.encounters.some((id) => ENCOUNTERS[id] && encounterEligible(state, ENCOUNTERS[id]))));
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
      const avail = evaluated.map((ev, i) => ({ ev, i })).filter((x) => x.ev.available);
      if (!avail.length) break;
      const c = choose(avail.map((x) => x.ev));
      const idx = evaluated.indexOf(c);
      const result = resolveOption(state, enc, c);
      state.runLog.push(logEntry(state, enc, evaluated, idx, result));
      if (c.opt.grantsObligation) addObligation(state, c.opt.grantsObligation);
      if (c.opt.dropsObligation) dropObligation(state, c.opt.dropsObligation);
      if (c.opt.contract) offerContract(state, c.opt.contract);
      if (node.departure) break;
    }
    settleContracts(state);
  }
  const verdict = finalVerdict(state);
  const payload = buildChroniclePayload(state, verdict, PHASES);
  payload.origin = 'simulated';
  return { payload, verdict };
}

const out = [];
for (let i = 0; i < N; i++) {
  const { payload, verdict } = playRun();
  if (DRY) {
    mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
    const f = new URL(`./out/simulated-${MODE}-${i + 1}.json`, import.meta.url);
    writeFileSync(f, JSON.stringify(payload, null, 1));
    console.log(`[dry] run ${i + 1}: ${payload.log.length} entries · ${verdict.man.title} / ${verdict.system.title} → ${f.pathname}`);
  } else {
    const r = await fetch(SERVICE + '/api/publish', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
    });
    const j = await r.json();
    if (!r.ok) { console.error(`run ${i + 1}: publish failed`, j); continue; }
    console.log(`run ${i + 1}: ${payload.log.length} entries · ${verdict.man.title} / ${verdict.system.title}`);
    console.log(`   public:  ${j.publicUrl}`);
    console.log(`   scholar: ${j.scholarEditUrl}`);
    out.push(j.id);
  }
}
if (!DRY) console.log(`\npublished ${out.length} simulated witness${out.length === 1 ? '' : 'es'} (${MODE} play): ${out.join(', ')}`);
