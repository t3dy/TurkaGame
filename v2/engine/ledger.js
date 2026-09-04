// ledger.js — what the player has actually witnessed.
//
// The overarching principle says the player should *gradually discover* that the
// alphabet is the language the world is written in. v2's first build failed that:
// it listed all eight primitives in a panel and badged every letter with its
// operations, which is an IDE with the manual open rather than a discovery.
//
// The fix is not obscurity. It is the taḥqīq/taqlīd distinction the portal
// already gives us (`tahqiq-taqlid`): what you have READ is held on authority;
// what you have SEEN is verified. So:
//
//   EVIDENCE IS ALWAYS SHOWN.   The dots, the tail, whether the form closes,
//                               whether the letter joins forward — all of it is
//                               on the page in front of you, and hiding it would
//                               make the rule unguessable rather than derivable.
//
//   THE RULE IS EARNED.         That dots-above means RAISE appears only once
//                               you have watched a dotted letter raise something.
//
// So the game is winnable by observation — look at the glyph, form a hypothesis,
// test it — and never by memorising a table nobody showed you.
//
// One store for the whole of v2, wrapped so a private window degrades to memory.
// v1's notebook stays with v1 (games/FROZEN.md); this is deliberately a new key.

export const KEY = 'turka.v2.ledger';

export class Ledger {
  constructor(store = defaultStore()) {
    this.store = store;
    this.data = this._load();
  }

  _load() {
    const empty = { primitives: {}, letters: {}, rulesets: {}, readings: [], xp: 0 };
    try {
      const raw = this.store.getItem(KEY);
      return raw ? { ...empty, ...JSON.parse(raw) } : empty;
    } catch { return empty; }
  }
  _save() { try { this.store.setItem(KEY, JSON.stringify(this.data)); } catch { /* fine */ } }

  /**
   * Record that a primitive was seen doing something, by a particular letter,
   * under a particular ruleset. Returns what was newly learned, so the interface
   * can say so at the moment it happens.
   */
  witness({ op, glyph, ruleset }) {
    const learned = [];
    if (op && !this.data.primitives[op]) {
      this.data.primitives[op] = { first: { glyph, ruleset }, count: 0 };
      learned.push({ kind: 'primitive', op, glyph });
      this.data.xp += 25;
    }
    if (op) this.data.primitives[op].count++;
    if (glyph && !this.data.letters[glyph]) {
      this.data.letters[glyph] = { ops: [] };
      learned.push({ kind: 'letter', glyph });
      this.data.xp += 5;
    }
    if (glyph && op && !this.data.letters[glyph].ops.includes(op)) {
      this.data.letters[glyph].ops.push(op);
    }
    if (ruleset && !this.data.rulesets[ruleset]) {
      this.data.rulesets[ruleset] = true;
      this.data.xp += 10;
    }
    if (learned.length) this._save(); else this._save();
    return learned;
  }

  /** Take an engine effect list and witness everything real in it. */
  witnessEffects(effects, ruleset) {
    const learned = [];
    for (const e of effects || []) {
      if (!e.op) continue;
      learned.push(...this.witness({ op: e.op, glyph: e.glyph, ruleset }));
    }
    return learned;
  }

  /** Record that a structure in the world was read back as text. */
  read(text, { where = null } = {}) {
    if (!text) return false;
    if (this.data.readings.includes(text)) return false;
    this.data.readings.push(text);
    this.data.xp += 40;
    this._save();
    return true;
  }

  knowsPrimitive(op) { return !!this.data.primitives[op]; }
  knowsLetter(g) { return !!this.data.letters[g]; }
  get xp() { return this.data.xp; }
  get readings() { return this.data.readings.slice(); }

  /** How much of the language is known, for the discovery panel. */
  progress(allOps) {
    const known = allOps.filter(o => this.knowsPrimitive(o));
    return { known, unknown: allOps.filter(o => !this.knowsPrimitive(o)),
             fraction: allOps.length ? known.length / allOps.length : 0 };
  }

  erase() { this.data = { primitives: {}, letters: {}, rulesets: {}, readings: [], xp: 0 }; this._save(); }

  /** Reveal everything — for tests, and for a reader who wants the reference. */
  revealAll(allOps, glyphs) {
    for (const op of allOps) this.witness({ op, glyph: null, ruleset: null });
    for (const g of glyphs || []) this.witness({ op: null, glyph: g, ruleset: null });
  }
}

function defaultStore() {
  try { if (typeof localStorage !== 'undefined') return localStorage; } catch { /* fall through */ }
  return memoryStore();
}

export function memoryStore() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}
