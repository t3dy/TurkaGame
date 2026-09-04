// world.js — the v2 world: a sparse grid of cells, plus the world's own rules.
//
// Two commitments make this different from v1's physics world.
//
// 1. THE WORLD'S LAWS ARE DATA, NOT CODE. `world.rules` is a plain object, and
//    gravity is one entry in it. A letter program can change a rule, which is the
//    brief's Level 5 ("letters manipulate rules"): turning gravity on is a
//    deliberate act inside the fiction rather than a setting outside it.
//
// 2. NOTHING HERE INTERPRETS A LETTER. This module knows about cells, materials,
//    bonds and rules. What ب does is the ruleset's business (../rulesets/) and the
//    VM's (./vm.js). Keeping that line means a second project can vendor this
//    world with an entirely different alphabet — which is the plan for the Golden
//    Dawn build.

export const KEY = (x, y, z) => `${x},${y},${z}`;
export const UNKEY = k => k.split(',').map(Number);

/** The materials the world knows. A ruleset may use any subset. */
export const MATERIALS = {
  stone:  { name: 'stone',  solid: true,  falls: true  },
  water:  { name: 'water',  solid: false, falls: true  },
  fire:   { name: 'fire',   solid: false, falls: false },
  air:    { name: 'air',    solid: false, falls: false },
  earth:  { name: 'earth',  solid: true,  falls: true  },
  letter: { name: 'letter', solid: true,  falls: true  },
};

export const DEFAULT_RULES = {
  // Off by default: this is a Lego table, not a physics sandbox. A letter turns
  // it on, and then everything that was resting on nothing discovers it.
  gravity: false,
  // Whether a bound group moves as one body.
  bondsHold: true,
  // Whether the world can be stepped back. Some rulesets forbid it.
  reversible: true,
};

export class World {
  constructor({ rules = {}, cells = [] } = {}) {
    this.rules = { ...DEFAULT_RULES, ...rules };
    this.cells = new Map();
    this.history = [];
    for (const c of cells) this.set(c.x, c.y, c.z, c);
  }

  clone() {
    const w = new World({ rules: { ...this.rules } });
    for (const [k, v] of this.cells) w.cells.set(k, { ...v, bonds: new Set(v.bonds) });
    return w;
  }

  get(x, y, z) { return this.cells.get(KEY(x, y, z)) || null; }
  has(x, y, z) { return this.cells.has(KEY(x, y, z)); }

  set(x, y, z, { material = 'stone', value = 1, glyph = null, fixed = false, bonds = null } = {}) {
    const cell = { x, y, z, material, value, glyph, fixed, bonds: new Set(bonds || []) };
    this.cells.set(KEY(x, y, z), cell);
    return cell;
  }

  remove(x, y, z) {
    const k = KEY(x, y, z), c = this.cells.get(k);
    if (!c) return null;
    for (const b of c.bonds) { const o = this.cells.get(b); if (o) o.bonds.delete(k); }
    this.cells.delete(k);
    return c;
  }

  move(from, to) {
    const c = this.cells.get(from);
    if (!c || this.cells.has(to)) return false;
    this.cells.delete(from);
    const [x, y, z] = UNKEY(to);
    Object.assign(c, { x, y, z });
    this.cells.set(to, c);
    for (const b of c.bonds) { const o = this.cells.get(b); if (o) { o.bonds.delete(from); o.bonds.add(to); } }
    return true;
  }

  bond(a, b) {
    const A = this.cells.get(a), B = this.cells.get(b);
    if (!A || !B) return false;
    A.bonds.add(b); B.bonds.add(a);
    return true;
  }

  unbondAll(k) {
    const c = this.cells.get(k);
    if (!c) return 0;
    let n = 0;
    for (const b of [...c.bonds]) { const o = this.cells.get(b); if (o) o.bonds.delete(k); c.bonds.delete(b); n++; }
    return n;
  }

  /** Every cell connected to `k` through bonds — the body it belongs to. */
  body(k) {
    const seen = new Set([k]), queue = [k];
    while (queue.length) {
      const cur = queue.shift(), c = this.cells.get(cur);
      if (!c) continue;
      for (const b of c.bonds) if (!seen.has(b)) { seen.add(b); queue.push(b); }
    }
    return seen;
  }

  /**
   * Apply gravity if the rule is on. A cell is supported when the ground is under
   * it, or something is, or anything in its bonded body is supported. Returns the
   * cells that moved, so a preview can show the fall a rule change would cause.
   */
  settle({ groundY = 0, maxSteps = 64 } = {}) {
    if (!this.rules.gravity) return [];
    const moved = [];
    for (let step = 0; step < maxSteps; step++) {
      const bodies = new Map();
      for (const k of this.cells.keys()) {
        if (bodies.has(k)) continue;
        const body = this.rules.bondsHold ? this.body(k) : new Set([k]);
        for (const m of body) bodies.set(m, body);
      }
      const done = new Set();
      let fell = false;
      for (const [k, body] of bodies) {
        if (done.has(body)) continue;
        done.add(body);
        const cells = [...body].map(m => this.cells.get(m)).filter(Boolean);
        // A letter that HOLDS A FRAME holds it against gravity too, and carries
        // whatever is bonded to it. That is what AXIS has meant since the first
        // build; a stacker is simply where it finally matters. It is also v1's
        // balcony-bracket rule — "carried on nothing" — arrived at from the
        // letter's own form rather than from a painting.
        if (!cells.length || cells.some(c => c.fixed || c.axis)) continue;
        if (!cells.every(c => MATERIALS[c.material]?.falls)) continue;
        const supported = cells.some(c => {
          if (c.y <= groundY) return true;
          const below = this.get(c.x, c.y - 1, c.z);
          return below && !body.has(KEY(c.x, c.y - 1, c.z));
        });
        if (supported) continue;
        // Move the whole body down one, lowest cell first so we never collide with
        // ourselves on the way.
        for (const c of cells.sort((a, b) => a.y - b.y)) {
          const from = KEY(c.x, c.y, c.z), to = KEY(c.x, c.y - 1, c.z);
          // Tagged with the settle step so a renderer can play the fall out in time
          // by re-applying these to a clone — watching the same collapse the engine
          // computed, rather than an animation that merely resembles it.
          if (this.move(from, to)) moved.push({ from, to, step });
        }
        fell = true;
      }
      if (!fell) break;
    }
    return moved;
  }

  /** A stable digest, for tests and for telling two world states apart. */
  hash() {
    return [...this.cells.keys()].sort().map(k => {
      const c = this.cells.get(k);
      return `${k}:${c.material}${c.value}${c.glyph || ''}${c.bonds.size ? '+' + c.bonds.size : ''}`;
    }).join('|') + '#' + Object.entries(this.rules).sort().map(([a, b]) => `${a}=${b}`).join(',');
  }

  list() { return [...this.cells.values()]; }
}
