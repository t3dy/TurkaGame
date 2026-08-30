// main.js — screen state machine: title → map → encounter → resolution → ending.
// Engine stays pure; this file owns flow, time-charging, saves, and onboarding flags.

import { newRun, save, load, clearSave } from './engine/state.js?v=1';
import { drawEncounter, evaluateOptions, resolveOption, encounterEligible, cairoVerdict } from './engine/engine.js?v=1';
import { PHASE, PEOPLE, NODES, ENCOUNTERS } from '../content/phase1.js?v=1';
import * as ui from './ui.js?v=1';

let state = null;
let current = null; // { enc, evaluated }
const onboard = { map: false, enc: false, res: false }; // marginalia shown-once flags (per session)

function nodeStatus() {
  const st = {};
  for (const n of NODES) {
    if (n.departure) { st[n.id] = 'open'; continue; }
    const any = n.encounters.some((id) => ENCOUNTERS[id] && encounterEligible(state, ENCOUNTERS[id]));
    st[n.id] = any ? 'open' : 'spent';
  }
  return st;
}

function toTitle() {
  ui.renderTitle(!!load());
}

function toMap() {
  save(state);
  // Out of time → the road is the only open door.
  if (state.time <= 0 && !state.seen.includes('road_home')) {
    const road = NODES.find((n) => n.departure);
    enterNode(road);
    return;
  }
  const first = !onboard.map; onboard.map = true;
  ui.renderMap(state, PHASE, NODES, nodeStatus(), PEOPLE, first);
}

function enterNode(node) {
  const enc = drawEncounter(state, node, ENCOUNTERS);
  if (!enc) { toMap(); return; }
  if (!node.departure) {
    state.time = Math.max(0, state.time - 1);
    state.visits[node.id] = (state.visits[node.id] || 0) + 1;
  }
  current = { enc, evaluated: evaluateOptions(state, enc, PEOPLE) };
  const first = !onboard.enc; onboard.enc = true;
  ui.renderEncounter(state, enc, current.evaluated, PEOPLE, first);
}

function choose(idx) {
  const ev = current.evaluated[idx];
  if (!ev || !ev.available) return;
  const result = resolveOption(state, current.enc, ev);
  save(state);
  const first = !onboard.res; onboard.res = true;
  ui.renderResolution(state, current.enc, result, PEOPLE, first);
  current._resolvedDeparture = !!NODES.find((n) => n.departure && n.encounters.includes(current.enc.id));
}

function afterResolution() {
  if (current && current._resolvedDeparture) {
    state.over = true;
    state.verdict = cairoVerdict(state);
    clearSave(); // a finished run doesn't resume
    ui.renderEnding(state, state.verdict, PEOPLE);
    return;
  }
  toMap();
}

// ---- event delegation -------------------------------------------------------

document.body.addEventListener('click', (e) => {
  const dismiss = e.target.closest('[data-dismiss]');
  if (dismiss) { dismiss.closest('.marginalia').remove(); return; }

  const act = e.target.closest('[data-act]');
  if (act) {
    const a = act.getAttribute('data-act');
    if (a === 'new') { state = newRun(); save(state); toMap(); }
    else if (a === 'continue') {
      const s = load();
      if (s) { state = s; toMap(); } else { state = newRun(); toMap(); }
    }
    else if (a === 'manual') ui.renderManual();
    else if (a === 'back') toTitle();
    else if (a === 'restart') { state = newRun(); save(state); toMap(); }
    return;
  }

  const nodeBtn = e.target.closest('[data-node]');
  if (nodeBtn && !nodeBtn.disabled) {
    const node = NODES.find((n) => n.id === nodeBtn.getAttribute('data-node'));
    if (node) enterNode(node);
    return;
  }

  const optBtn = e.target.closest('[data-opt]');
  if (optBtn) { choose(parseInt(optBtn.getAttribute('data-opt'), 10)); return; }
});

// "continue ⤳" on resolution screens
document.body.addEventListener('click', (e) => {
  const c = e.target.closest('.continue-btn');
  if (c) afterResolution();
});

// number-key hotkeys for options (UI guarantee: keyboard play)
document.addEventListener('keydown', (e) => {
  if (!current) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 9 && document.querySelector('.options')) {
    const avail = current.evaluated
      .map((ev, i) => ({ ev, i }))
      .filter((x) => x.ev.available);
    if (avail[n - 1]) choose(avail[n - 1].i);
  } else if ((e.key === 'Enter' || e.key === 'Return') && document.querySelector('.continue-btn')) {
    afterResolution();
  }
});

ui.bindGlosses();
toTitle();

// Debug handle, mirroring the VN's window.__turkaVN convention.
window.__turkaCS = {
  get state() { return state; },
  encounters: ENCOUNTERS,
  nodes: NODES,
  restart() { state = newRun(); save(state); toMap(); },
  grant(fxJson) { // e.g. __turkaCS.grant({quintet:{rimiya:2}})
    import('./engine/state.js?v=1').then((m) => { m.applyEffects(state, fxJson, 'debug'); toMap(); });
  },
};
