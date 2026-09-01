// main.js — screen state machine across all five phases:
// title → phase intro → map → encounter → resolution → colophon → … → ending.
// Engine stays pure; this file owns flow, time, obligations, contracts, saves.

import { newRun, save, load, clearSave } from './engine/state.js?v=3';
import { drawEncounter, evaluateOptions, resolveOption, encounterEligible } from './engine/engine.js?v=3';
import {
  addObligation, dropObligation, chargeObligations, offerContract, tickContracts, exposureTier,
  finalVerdict, settleContracts,
} from './engine/career.js?v=4';
import { PEOPLE, ARTIFACTS, ENCOUNTERS, PHASES, phaseById, LAST_PHASE } from '../content/index.js?v=4';
import { logEntry, buildChroniclePayload } from './engine/export.js?v=3';
import { publishWitness } from './witness-client.js?v=1';
import * as ui from './ui.js?v=4';

let state = null;
let current = null;
const onboard = { map: false, enc: false, res: false };

const phase = () => phaseById(state.phase);

function nodeStatus() {
  const st = {};
  for (const n of phase().nodes) {
    if (n.departure) { st[n.id] = 'open'; continue; }
    const any = n.encounters.some((id) => ENCOUNTERS[id] && encounterEligible(state, ENCOUNTERS[id]));
    st[n.id] = any ? 'open' : 'spent';
  }
  return st;
}

function toTitle() { ui.renderTitle(!!load()); }

function toPhaseIntro() {
  ui.renderPhaseIntro(phase(), state);
}

function toMap() {
  save(state);
  if (state.time <= 0) {
    const dep = phase().nodes.find((n) => n.departure);
    if (dep && !state.seen.includes(dep.encounters[0])) { enterNode(dep); return; }
  }
  const first = !onboard.map; onboard.map = true;
  ui.renderMap(state, phase(), phase().nodes, nodeStatus(), PEOPLE, ARTIFACTS, first, exposureTier(state));
}

function enterNode(node) {
  const enc = drawEncounter(state, node, ENCOUNTERS);
  if (!enc) { toMap(); return; }

  const turnReport = { obligations: [], contracts: [] };
  if (!node.departure) {
    state.time = Math.max(0, state.time - 1);
    state.visits[node.id] = (state.visits[node.id] || 0) + 1;
    turnReport.obligations = chargeObligations(state);
    turnReport.contracts = tickContracts(state);
  }
  current = { enc, evaluated: evaluateOptions(state, enc, PEOPLE, ARTIFACTS), turnReport, node };
  const first = !onboard.enc; onboard.enc = true;
  ui.renderEncounter(state, enc, current.evaluated, PEOPLE, ARTIFACTS, first, turnReport, exposureTier(state));
}

function choose(idx) {
  const ev = current.evaluated[idx];
  if (!ev || !ev.available) return;
  const result = resolveOption(state, current.enc, ev);

  // Option-attached career effects: obligations gained/dropped, contracts opened.
  const opt = ev.opt;
  if (opt.grantsObligation) { addObligation(state, opt.grantsObligation); result.obligationAdded = opt.grantsObligation; }
  if (opt.dropsObligation) { dropObligation(state, opt.dropsObligation); result.obligationDropped = opt.dropsObligation; }
  if (opt.contract) { offerContract(state, opt.contract); result.contractOpened = opt.contract; }

  // The scholarly log: capture the encounter as the game actually presented it —
  // situation, every option offered with its provenance, what was chosen, how it
  // resolved. Frozen here so a published witness stays true even if content changes.
  (state.runLog ||= []).push(logEntry(state, current.enc, current.evaluated, idx, result));

  save(state);
  const first = !onboard.res; onboard.res = true;
  ui.renderResolution(state, current.enc, result, PEOPLE, ARTIFACTS, first, exposureTier(state));
  current.isDeparture = !!(current.node && current.node.departure);
}

function afterResolution() {
  if (current && current.isDeparture) {
    // Promises made at a court are settled when that court's years end — an open
    // commission must never quietly outlive the phase it was made in.
    const settled = settleContracts(state);
    if (state.phase >= LAST_PHASE) {
      state.over = true;
      state.verdict = finalVerdict(state);
      clearSave();
      ui.renderEnding(state, state.verdict, PEOPLE, PHASES,
        buildChroniclePayload(state, state.verdict, PHASES));
    } else {
      ui.renderColophon(state, phase(), settled);
    }
    return;
  }
  toMap();
}

async function doPublish(btn) {
  btn.disabled = true;
  btn.textContent = 'copying the chronicle out…';
  try {
    const payload = buildChroniclePayload(state, state.verdict, PHASES);
    const out = await publishWitness(payload);
    ui.renderWitnessLinks(out);
  } catch (err) {
    ui.renderPublishError(err.message);
  }
}

function advancePhase() {
  state.phase += 1;
  const p = phase();
  state.time = p.time;
  // Contracts that survive a phase boundary keep ticking; obligations persist too.
  save(state);
  toPhaseIntro();
}

// ---- events -----------------------------------------------------------------

document.body.addEventListener('click', (e) => {
  const dismiss = e.target.closest('[data-dismiss]');
  if (dismiss) { dismiss.closest('.marginalia').remove(); return; }

  if (e.target.closest('.publish-btn')) { doPublish(e.target.closest('.publish-btn')); return; }
  if (e.target.closest('.continue-btn')) { afterResolution(); return; }
  if (e.target.closest('.next-phase-btn')) { advancePhase(); return; }
  if (e.target.closest('.begin-phase-btn')) { toMap(); return; }

  const act = e.target.closest('[data-act]');
  if (act) {
    const a = act.getAttribute('data-act');
    if (a === 'new') { state = newRun(); save(state); toPhaseIntro(); }
    else if (a === 'resume') {
      const s = load();
      if (s) { state = s; toMap(); } else { state = newRun(); toPhaseIntro(); }
    }
    else if (a === 'manual') ui.renderManual();
    else if (a === 'back') toTitle();
    else if (a === 'restart') { state = newRun(); save(state); toPhaseIntro(); }
    return;
  }

  const nodeBtn = e.target.closest('[data-node]');
  if (nodeBtn && !nodeBtn.disabled) {
    const node = phase().nodes.find((n) => n.id === nodeBtn.getAttribute('data-node'));
    if (node) enterNode(node);
    return;
  }

  const optBtn = e.target.closest('[data-opt]');
  if (optBtn) { choose(parseInt(optBtn.getAttribute('data-opt'), 10)); return; }
});

document.addEventListener('keydown', (e) => {
  const n = parseInt(e.key, 10);
  if (current && n >= 1 && n <= 9 && document.querySelector('.options')) {
    const avail = current.evaluated.map((ev, i) => ({ ev, i })).filter((x) => x.ev.available);
    if (avail[n - 1]) choose(avail[n - 1].i);
  } else if (e.key === 'Enter' || e.key === 'Return') {
    const btn = document.querySelector('.continue-btn, .next-phase-btn, .begin-phase-btn');
    if (btn) btn.click();
  }
});

ui.bindGlosses();
toTitle();

window.__turkaCS = {
  get state() { return state; },
  encounters: ENCOUNTERS,
  phases: PHASES,
  restart() { state = newRun(); save(state); toPhaseIntro(); },
  skipTo(p) { state.phase = p; state.time = phaseById(p).time; toPhaseIntro(); },
  grant(fx) {
    import('./engine/state.js?v=3').then((m) => { m.applyEffects(state, fx, 'debug'); toMap(); });
  },
};
