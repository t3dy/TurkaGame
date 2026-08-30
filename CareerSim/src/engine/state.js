// state.js — player state: creation, capability queries, effect application, save/load.
// Framework-agnostic: no DOM, no imports from ui. See docs/SYSTEMS.md §1.

export const METERS = ['synthesis', 'demonstration', 'transmission', 'exposure'];
export const REPS = ['orthodox', 'occult', 'imperial', 'scholarly'];
export const QUINTET = ['kimiya', 'limiya', 'himiya', 'simiya', 'rimiya'];

const SAVE_KEY = 'turka-careersim-run-v1';

export function newRun() {
  return {
    v: 1,
    phase: 1,
    time: 7,
    meters: { synthesis: 0, demonstration: 0, transmission: 0, exposure: 0 },
    rep: { orthodox: 0, occult: 0, imperial: 0, scholarly: 0 },
    quintet: { kimiya: 0, limiya: 0, himiya: 0, simiya: 0, rimiya: 0 },
    people: [],      // ids into content PEOPLE registry
    access: [],      // institutional access tags
    caps: [],        // extra capability tags granted by people/artifacts (denormalized)
    artifacts: [],
    memory: {},      // flag -> value (CourtMemory flags)
    memLog: [],      // { flag, value, source } — append-only "why" log
    chronicle: [],   // { text, band, encounterId }
    visits: {},      // nodeId -> count
    seen: [],        // encounter ids resolved
    over: false,
    verdict: null,
  };
}

// ---- capability & requirement evaluation ------------------------------------

// Requirement grammar (docs/SYSTEMS.md §3):
//   "kimiya>=2"          quintet tier
//   "person:yazdi"       person in network
//   "access:observatory" institutional access
//   "cap:poetry"         capability tag from people/artifacts
//   "rep:scholarly>=2"   reputation threshold (also <= for negatives)
//   "meter:synthesis>=3" meter threshold
//   "mem:c02=public"     memory flag equals value
//   "mem:akhlati_student" memory flag truthy
//   "!mem:..."           negation of either memory form
// Returns { ok, text } — text is the human-readable clause used for
// unlockedBy / locked-reason display (UI guarantee #1, UI_STYLE_GUIDE §4).
export function checkReq(state, req, people) {
  const neg = req.startsWith('!');
  const body = neg ? req.slice(1) : req;
  let ok = false;
  let text = body;

  const cmp = body.match(/^([a-z]+):?([a-z_]+)?(>=|<=)(-?\d+)$/);
  if (cmp) {
    const [, head, sub, op, numS] = cmp;
    const num = parseInt(numS, 10);
    let val;
    if (QUINTET.includes(head)) { val = state.quintet[head]; text = `${sciName(head)} ${dots(num)}`; }
    else if (head === 'rep') { val = state.rep[sub]; text = `${sub} standing ${num >= 0 ? '+' : ''}${num}`; }
    else if (head === 'meter') { val = state.meters[sub]; text = `${sub} ${num}`; }
    else if (head === 'time') { val = state.time; text = `${num} days remaining`; }
    else return { ok: false, text: `unknown requirement ${req}` };
    ok = op === '>=' ? val >= num : val <= num;
  } else if (body.startsWith('person:')) {
    const id = body.slice(7);
    ok = state.people.includes(id);
    text = people && people[id] ? people[id].name : id;
  } else if (body.startsWith('access:')) {
    const id = body.slice(7);
    ok = state.access.includes(id);
    text = `access to ${id.replace(/_/g, ' ')}`;
  } else if (body.startsWith('cap:')) {
    const id = body.slice(4);
    ok = capSet(state, people).has(id);
    text = id.replace(/_/g, ' ');
  } else if (body.startsWith('mem:')) {
    const clause = body.slice(4);
    const eq = clause.indexOf('=');
    if (eq >= 0) {
      const flag = clause.slice(0, eq), val = clause.slice(eq + 1);
      ok = String(state.memory[flag]) === val;
    } else {
      ok = !!state.memory[clause];
    }
    text = memText(clause);
  } else {
    return { ok: false, text: `unknown requirement ${req}` };
  }

  if (neg) { ok = !ok; text = `not: ${text}`; }
  return { ok, text };
}

// Union of capability tags from people + artifacts + explicit grants.
export function capSet(state, people) {
  const s = new Set(state.caps);
  for (const id of state.people) {
    const p = people && people[id];
    if (p && p.grants) p.grants.forEach((g) => s.add(g));
  }
  return s;
}

function sciName(id) {
  return ({ kimiya: 'kīmiyā', limiya: 'līmiyā', himiya: 'hīmiyā', simiya: 'sīmiyā', rimiya: 'rīmiyā' })[id] || id;
}
function dots(n) { return '●'.repeat(n) + ` (${['unaware', 'studied', 'practiced', 'masterful', 'systematized'][n] || n})`; }
function memText(clause) {
  return `remembered: ${clause.replace(/=/g, ' — ').replace(/_/g, ' ')}`;
}

// ---- effects ----------------------------------------------------------------

// Applies an effects object; returns a list of human-readable delta chips and the
// list of memory flags written (for the "X will remember this" announcement).
export function applyEffects(state, fx, source) {
  const deltas = [];
  const memWrites = [];
  if (!fx) return { deltas, memWrites };

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  for (const [k, d] of Object.entries(fx.meters || {})) {
    state.meters[k] = clamp(state.meters[k] + d, 0, 10);
    deltas.push({ kind: 'meter', key: k, d });
  }
  for (const [k, d] of Object.entries(fx.rep || {})) {
    state.rep[k] = clamp(state.rep[k] + d, -5, 5);
    deltas.push({ kind: 'rep', key: k, d });
  }
  for (const [k, d] of Object.entries(fx.quintet || {})) {
    state.quintet[k] = clamp(state.quintet[k] + d, 0, 4);
    deltas.push({ kind: 'quintet', key: k, d });
  }
  for (const id of fx.people || []) {
    if (!state.people.includes(id)) { state.people.push(id); deltas.push({ kind: 'person', key: id, d: 1 }); }
  }
  for (const id of fx.access || []) {
    if (!state.access.includes(id)) { state.access.push(id); deltas.push({ kind: 'access', key: id, d: 1 }); }
  }
  for (const id of fx.caps || []) {
    if (!state.caps.includes(id)) state.caps.push(id);
  }
  for (const id of fx.artifacts || []) {
    if (!state.artifacts.includes(id)) { state.artifacts.push(id); deltas.push({ kind: 'artifact', key: id, d: 1 }); }
  }
  for (const [flag, value] of Object.entries(fx.memory || {})) {
    state.memory[flag] = value;
    state.memLog.push({ flag, value, source });
    memWrites.push(flag);
  }
  if (fx.time) { state.time = Math.max(0, state.time + fx.time); deltas.push({ kind: 'time', key: 'time', d: fx.time }); }
  return { deltas, memWrites };
}

// ---- persistence ------------------------------------------------------------

export function save(state, storage) {
  try { (storage || globalThis.localStorage).setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
}
export function load(storage) {
  try {
    const raw = (storage || globalThis.localStorage).getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.v === 1 ? s : null;
  } catch (e) { return null; }
}
export function clearSave(storage) {
  try { (storage || globalThis.localStorage).removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
}
