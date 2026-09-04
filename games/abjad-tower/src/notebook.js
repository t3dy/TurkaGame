// notebook.js — the tajriba notebook: the shared record of what the player has
// tested, across every game in this repo.
//
// The frame is the portal's `tahqiq-taqlid` entry: taḥqīq is working a question
// through to its ground for oneself; taqlīd is holding it on authority. A
// correspondence the player has only read is taqlīd. One they have put to the
// test is taḥqīq, and it is the only kind this notebook pays for.
//
// A claim moves through states, derived from its observations rather than set:
//
//   HYPOTHESIS   proposed, never tested
//   EXPERIMENT   tested once or twice; results agree with it
//   OBSERVED     tested three or more times, all agreeing — but never against a rival
//   CONFIRMED    observed, AND at least one rival claim on the same question is DISPROVEN
//   DISPROVEN    at least one observation contradicts it
//
// CONFIRMED needs a rival to fall because that is what tells the schemes apart:
// three towers that stand under "the cycle" prove nothing if they also stand
// under "by form". The player has to find the tower on which the schemes
// disagree. That is the play.
//
// Storage is one localStorage namespace for the whole project so that a claim
// tested in Abjad Tower is already known in the Letter Machine. Every read and
// write is wrapped: a private window degrades to an in-memory notebook.

export const KEY = 'turka.notebook.v1';
export const STATES = ['HYPOTHESIS', 'EXPERIMENT', 'OBSERVED', 'CONFIRMED', 'DISPROVEN'];

/** Pure: derive a claim's state from its observations and its rivals' states. */
export function deriveState(entry, rivalsDisproven = 0) {
  const obs = entry.observations || [];
  if (obs.some(o => o.result === 'contradicts')) return 'DISPROVEN';
  const agree = obs.filter(o => o.result === 'agrees').length;
  if (agree === 0) return 'HYPOTHESIS';
  if (agree < 3) return 'EXPERIMENT';
  return rivalsDisproven > 0 ? 'CONFIRMED' : 'OBSERVED';
}

export class Notebook {
  constructor(store = defaultStore()) {
    this.store = store;
    this.data = this._load();
  }

  _load() {
    const empty = { claims: {}, xp: 0 };
    try {
      const raw = this.store.getItem(KEY);
      return raw ? { ...empty, ...JSON.parse(raw) } : empty;
    } catch { return empty; }
  }
  _save() {
    try { this.store.setItem(KEY, JSON.stringify(this.data)); } catch { /* fine */ }
  }

  /**
   * Propose a claim. `question` groups rivals: every claim with the same question
   * is a rival of every other (e.g. question 'temperament', claims 'mizaj-cyclic',
   * 'mizaj-form', 'mizaj-light'). Proposing is free and idempotent.
   */
  propose(id, { question, text, kind = 'INTERPRETATION', source = null }) {
    if (!this.data.claims[id]) {
      this.data.claims[id] = { id, question, text, kind, source, observations: [] };
      this._save();
    }
    return this.data.claims[id];
  }

  /**
   * Record one test of a claim. `result` is 'agrees' or 'contradicts'. `where`
   * names the game and seed so a result can be reproduced. Returns the state
   * transition, and the XP paid for it — paid only when the state CHANGES, so
   * repeating a witnessed experiment is worth nothing, as in the Tome.
   */
  observe(id, { result, where, detail = '' }) {
    const c = this.data.claims[id];
    if (!c) throw new Error(`notebook: unknown claim ${id}`);
    if (result !== 'agrees' && result !== 'contradicts') throw new Error('result must be agrees|contradicts');
    const before = this.state(id);
    c.observations.push({ result, where, detail, at: Date.now() });
    const after = this.state(id);
    // A contradiction can promote a rival from OBSERVED to CONFIRMED; recompute all.
    const changed = before !== after;
    const xp = changed ? XP[after] || 0 : 0;
    this.data.xp += xp;
    this._save();
    return { before, after, changed, xp };
  }

  rivals(id) {
    const c = this.data.claims[id];
    if (!c) return [];
    return Object.values(this.data.claims).filter(o => o.id !== id && o.question === c.question);
  }

  state(id) {
    const c = this.data.claims[id];
    if (!c) return null;
    const fallen = this.rivals(id).filter(r => deriveState(r, 0) === 'DISPROVEN').length;
    return deriveState(c, fallen);
  }

  /** Every claim with its derived state, grouped by question. */
  summary() {
    const out = {};
    for (const c of Object.values(this.data.claims)) {
      (out[c.question] ||= []).push({ ...c, state: this.state(c.id) });
    }
    return out;
  }

  get xp() { return this.data.xp; }

  erase() { this.data = { claims: {}, xp: 0 }; this._save(); }
}

// XP on reaching a state. DISPROVEN pays: a disproof is a result, and the tradition's
// own experientialism (tajriba as proof) does not distinguish the direction.
const XP = { EXPERIMENT: 5, OBSERVED: 15, CONFIRMED: 40, DISPROVEN: 25 };

function defaultStore() {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch { /* fall through */ }
  return memoryStore();
}

/** An in-memory store, for tests and for browsers that refuse site data. */
export function memoryStore() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}
