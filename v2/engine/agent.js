// agent.js — a scribe who walks the world and pushes what is in it.
//
// This is the piece that turns the engine from an IDE into games. The
// Scriptorium had exactly one verb — inscribe a program — which makes a fine
// workbench and a poor puzzle. A pushing game needs a moment-to-moment verb that
// is NOT writing, so that writing stays special: you walk and shove crates like
// any block-pusher, and the letters are the tools you reach for when shoving
// alone cannot do it.
//
// WHY THE LETTERS MATTER HERE RATHER THAN DECORATE
// ------------------------------------------------
// Everything below is decided by the same bonds and flags the VM already sets, so
// the letters' effects on pushing are not a second rulebook:
//
//   BIND   two crates become ONE BODY, and a body moves as a whole. That makes it
//          heavier to route and lets it bridge, both at once.
//   SEVER  a body comes apart, so half of it can go through a gap the whole
//          cannot. In a program it breaks the word; here it breaks the crate.
//   AXIS   a letter that holds a frame will not be shoved, and nothing bonded to
//          it will be either. A pin.
//   POUR   drops what is above through — the vertical move a push cannot make.
//
// None of that needed a new primitive. The four already meant these things; a
// pushing floor is just a place where meaning them is useful.

import { KEY, UNKEY, MATERIALS } from './world.js?v=1';

export const DIRS = {
  north: [0, 0, -1], south: [0, 0, 1], west: [-1, 0, 0], east: [1, 0, 0],
};

export class Scribe {
  constructor(world, pos = [0, 0, 0]) {
    this.world = world;
    this.pos = pos.slice();
  }

  clone(world = this.world) {
    return new Scribe(world, this.pos);
  }

  /**
   * What would happen if the scribe stepped this way? Pure — decides everything
   * and changes nothing, so the same call drives the move, the preview and the
   * solver. (The lesson from v1: a preview that computes its answer separately
   * from the action is a preview that will eventually lie.)
   */
  probe(dir) {
    const w = this.world;
    const [dx, dy, dz] = dir;
    const to = [this.pos[0] + dx, this.pos[1] + dy, this.pos[2] + dz];
    const target = w.get(...to);
    if (!target) return { ok: true, to, pushed: null };
    if (target.fixed) return { ok: false, why: `${target.material} will not move`, to };

    // The whole bonded body goes, or none of it does.
    const bodyKeys = [...w.body(KEY(...to))];
    const body = bodyKeys.map(k => w.cells.get(k)).filter(Boolean);

    const pinned = body.find(c => c.axis);
    if (pinned) return { ok: false, to, why: `${pinned.glyph} holds this in place — an axis is not shoved` };
    const anchored = body.find(c => c.fixed);
    if (anchored) return { ok: false, to, why: 'part of this body is fixed' };

    const inBody = new Set(bodyKeys);
    for (const c of body) {
      const dest = KEY(c.x + dx, c.y + dy, c.z + dz);
      if (inBody.has(dest)) continue;              // it is following itself
      const blocker = w.cells.get(dest);
      if (blocker) {
        return { ok: false, to,
          why: `${target.glyph || target.material} is a body of ${body.length}; ` +
               `${blocker.glyph || blocker.material} is in its way` };
      }
    }
    return { ok: true, to, pushed: { keys: bodyKeys, size: body.length } };
  }

  /** Take the step if it is legal. Returns the same shape probe() does. */
  step(dir) {
    const r = this.probe(dir);
    if (!r.ok) return r;
    if (r.pushed) {
      const w = this.world;
      const [dx, dy, dz] = dir;
      // Move the far edge first, so a body never collides with its own tail.
      const cells = r.pushed.keys.map(k => w.cells.get(k)).filter(Boolean)
        .sort((a, b) => ((b.x * dx + b.y * dy + b.z * dz) - (a.x * dx + a.y * dy + a.z * dz)));
      for (const c of cells) {
        w.move(KEY(c.x, c.y, c.z), KEY(c.x + dx, c.y + dy, c.z + dz));
      }
    }
    this.pos = r.to;
    return r;
  }

  /** A stable digest of the whole position, for the solver and for tests. */
  hash() { return this.pos.join(',') + '|' + this.world.hash(); }
}

/* ------------------------------------------------------------------ goals -- */

/** Every target cell holds something that is not the scribe. */
export function targetsCovered(world, targets) {
  const covered = targets.filter(t => {
    const c = world.get(...t);
    return c && !c.fixed;
  });
  return { win: covered.length === targets.length, covered: covered.length, total: targets.length };
}

/* ----------------------------------------------------------------- solver -- */

/**
 * Breadth-first over walking moves and letter inscriptions.
 *
 * The house rule from The Impossible Architect, which was winnable in fifteen
 * moves without opening a door: CHECK A PUZZLE WITH A SOLVER BEFORE A PERSON.
 * Here it has a second job — proving a level actually NEEDS its letters. Run it
 * once with the hand and once with the hand emptied; if it solves both times, the
 * letters are decoration and the level is a lie.
 *
 * `inscribe(state, letterIndex, cell)` is supplied by the caller so the solver
 * does not need to know about the VM.
 */
export function solve(start, { maxDepth = 24, maxStates = 250000, moves }) {
  const seen = new Set([start.hash()]);
  let frontier = [{ state: start, path: [] }];
  let states = 0;

  for (let depth = 0; depth <= maxDepth; depth++) {
    const next = [];
    for (const node of frontier) {
      if (node.state.win()) return { solved: true, depth, path: node.path, states };
      if (depth === maxDepth) continue;
      for (const mv of moves(node.state)) {
        if (++states > maxStates) return { solved: false, exhausted: true, states };
        const child = mv.apply();
        if (!child) continue;
        const h = child.hash();
        if (seen.has(h)) continue;
        seen.add(h);
        next.push({ state: child, path: [...node.path, mv.label] });
      }
    }
    if (!next.length) break;
    frontier = next;
  }
  return { solved: false, states };
}
