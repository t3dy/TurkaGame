// unmaking.js — three candidate answers to "how do you bring a structure down?"
//
// v2 could build and could not unbuild. SEVER is a PARSING rule — it decides
// whether a newly written letter joins forward — not a cut; and POUR carries a
// cell's bonds with it when it moves. So there was no demolition mode, and rather
// than invent a primitive to fill the hole, the hole was written down.
//
// This module is the three routes out of it, implemented side by side so they can
// be compared by playing rather than argued about. They are deliberately unequal
// in how well grounded they are, and each says so:
//
//   A  THE ISOLATED FORM   SOURCED. Every Arabic letter has isolated, initial,
//                          medial and final forms, and a letter written in its
//                          ISOLATED form joins nothing on either side. That is
//                          plain orthography. Rewriting a standing letter into
//                          its isolated form therefore cuts both its bonds.
//
//   B  THE UTTERANCE       GAME FICTION, and labelled as such wherever it appears.
//                          The three registers are the Mafāḥiṣ's; that a letter
//                          SPOKEN over a structure can suspend one of the world's
//                          laws for the length of the utterance is ours entirely.
//                          Here it suspends `bondsHold`, so a body stops being one
//                          thing and every cell answers for itself.
//
//   C  THE THROWN STONE    NO CLAIM AT ALL. Momentum: shove a body and it moves,
//                          and whatever was resting on it discovers that. This is
//                          the control case, and it exists for the same reason
//                          Abjad Tower's Strike did in v1 — the occult routes have
//                          to earn their place against simply hitting the thing.
//
// All three return the engine's ordinary effect vocabulary, so the same renderer
// draws them, and all three are pure unless `apply` is set — the preview of a
// demolition is the demolition, run against a copy.

import { KEY, UNKEY } from './world.js?v=5';

/** Highest cell in the world, or -Infinity when it is empty. */
export function highest(world, { glyphOnly = false } = {}) {
  const cells = world.list().filter(c => !c.fixed && (!glyphOnly || c.glyph));
  return cells.length ? Math.max(...cells.map(c => c.y)) : -Infinity;
}

/** How much is still standing at or above `line`. The score every route reports. */
export function standing(world, line) {
  return world.list().filter(c => !c.fixed && c.y >= line).length;
}

function fallEffects(moved) {
  // Collapse a chain of one-cell drops into one arrow per cell.
  const ends = new Map();
  for (const m of moved) {
    const origin = ends.has(m.from) ? ends.get(m.from) : UNKEY(m.from);
    ends.delete(m.from);
    ends.set(m.to, origin);
  }
  const out = [];
  for (const [toKey, from] of ends) {
    const to = UNKEY(toKey);
    if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2]) continue;
    out.push({ kind: 'fall', at: from, to, detail: `fell ${from[1] - to[1]}` });
  }
  return out;
}

/* ------------------------------------------------------ A: the isolated form -- */

/**
 * Rewrite the letter at `cell` into its isolated form: it now joins nothing on
 * either side, so both its bonds are cut and the word comes apart there.
 *
 * The fact is orthographic and checkable — this is what an isolated form IS. The
 * reading, that isolating a standing letter severs it structurally, is ours, but
 * it is about as tight as an interpretation gets.
 */
export function isolate(world, cell, { apply = false } = {}) {
  const w = apply ? world : world.clone();
  const k = KEY(...cell);
  const c = w.cells.get(k);
  if (!c) return { ok: false, why: 'nothing there', effects: [], world: w };
  if (!c.glyph) return { ok: false, why: 'only a letter can be isolated', effects: [], world: w };

  const neighbours = [...c.bonds];
  const cut = w.unbondAll(k);
  c.connects = false;
  c.isolated = true;

  const effects = neighbours.map(nk => ({
    kind: 'sever', op: 'ISOLATE', glyph: c.glyph, at: cell, to: UNKEY(nk),
    from: 'a letter written in its isolated form joins nothing on either side',
    detail: `${c.glyph} stands alone — the word breaks here`,
  }));
  effects.push(...fallEffects(w.settle()));
  return { ok: true, cut, effects, world: w,
           why: cut ? `${c.glyph} isolated; ${cut} bond${cut === 1 ? '' : 's'} cut` : `${c.glyph} was already joined to nothing` };
}

/* ---------------------------------------------------------- B: the utterance -- */

/**
 * Speak a letter over the structure. For the length of the utterance the world
 * stops holding bodies together — `bondsHold` goes false — so every cell answers
 * for itself, and anything that was only standing because it belonged to
 * something else comes down. Then the rule returns.
 *
 * GAME FICTION. The registers are the source's; suspending a world law is not.
 */
export function utter(world, { apply = false } = {}) {
  const w = apply ? world : world.clone();
  const was = w.rules.bondsHold;
  w.rules.bondsHold = false;
  const moved = w.settle();
  w.rules.bondsHold = was;
  const after = w.settle();
  return {
    ok: true, effects: fallEffects([...moved, ...after]), world: w,
    why: moved.length
      ? 'for the length of the utterance nothing was one thing; what was carried, fell'
      : 'nothing was standing only by its bonds',
  };
}

/* ------------------------------------------------------- C: the thrown stone -- */

/**
 * Shove the body at `cell` along `dir` by up to `force` cells, then let gravity
 * take what was resting on it. No correspondence, no intention: mass and speed.
 *
 * The control case. If an occult route cannot beat this, it has not earned its
 * place — which is the job Strike did among Abjad Tower's six operations.
 */
export function throwStone(world, cell, { dir = [1, 0, 0], force = 2, apply = false } = {}) {
  const w = apply ? world : world.clone();
  const k = KEY(...cell);
  if (!w.cells.get(k)) return { ok: false, why: 'nothing there', effects: [], world: w };

  const effects = [];
  let shifted = 0;
  for (let step = 0; step < force; step++) {
    const bodyKeys = [...w.body(KEY(...moveOf(cell, dir, shifted)))];
    const body = bodyKeys.map(m => w.cells.get(m)).filter(Boolean);
    if (!body.length || body.some(c => c.fixed || c.axis)) break;
    const inBody = new Set(bodyKeys);
    const blocked = body.some(c => {
      const dest = KEY(c.x + dir[0], c.y + dir[1], c.z + dir[2]);
      return !inBody.has(dest) && w.cells.has(dest);
    });
    if (blocked) break;
    for (const c of body.slice().sort((a, b) =>
      (b.x * dir[0] + b.y * dir[1] + b.z * dir[2]) - (a.x * dir[0] + a.y * dir[1] + a.z * dir[2]))) {
      const from = KEY(c.x, c.y, c.z), to = KEY(c.x + dir[0], c.y + dir[1], c.z + dir[2]);
      if (w.move(from, to)) effects.push({ kind: 'pour', op: 'STRIKE', at: UNKEY(from), to: UNKEY(to), detail: 'shoved' });
    }
    shifted++;
  }
  effects.push(...fallEffects(w.settle()));
  return { ok: true, shifted, effects, world: w,
           why: shifted ? `shoved ${shifted} cell${shifted === 1 ? '' : 's'}` : 'it would not move' };
}

const moveOf = (cell, dir, n) => [cell[0] + dir[0] * n, cell[1] + dir[1] * n, cell[2] + dir[2] * n];

/* ------------------------------------------------------------------ compare -- */

export const ROUTES = {
  isolate: {
    id: 'isolate', name: 'The Isolated Form', arabic: 'الشكل المنفصل',
    kind: 'INTERPRETATION',
    fact: 'Every Arabic letter has isolated, initial, medial and final forms, and the isolated form joins nothing on either side. Plain orthography.',
    reading: 'Rewriting a standing letter into its isolated form cuts both its bonds. Ours, but about as tight as an interpretation gets.',
    targeted: true,
  },
  utter: {
    id: 'utter', name: 'The Utterance', arabic: 'اللفظ',
    kind: 'GAME_FICTION',
    fact: 'The three registers — mental, spoken, written — are the Mafāḥiṣ\'s own structure.',
    reading: 'That a letter SPOKEN over a structure suspends one of the world\'s laws for the length of the utterance is entirely invented. Labelled wherever it appears.',
    targeted: false,
  },
  stone: {
    id: 'stone', name: 'The Thrown Stone', arabic: 'الحجر',
    kind: 'PLAIN',
    fact: 'None. No correspondence, no intention — mass and speed.',
    reading: 'The control case. Every occult route has to earn its place against simply hitting the thing, which is the job Strike did in Abjad Tower.',
    targeted: true,
  },
};
