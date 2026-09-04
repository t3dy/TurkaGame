// operations.js — acting on a structure that is already standing.
//
// v2 grew up building. These three are the other half, recovered from v1's Abjad
// Tower, which had six operations against a finished tower and lost them all when
// v1 was frozen. Each is reimplemented on v2's terms, and two of them come out
// better grounded than they were:
//
//   INVOKE THE NAME   act on every instance of one letter at once, anywhere.
//   RECKONING         name a number; every run of letters summing to it comes apart.
//   EXTRACTION        take every instance of one letter out, and see what still stands.
//
// WHAT CHANGED, AND WHY IT IS AN IMPROVEMENT
// ------------------------------------------
// In v1 these annihilated blocks: the letters simply vanished, which is a thing
// nothing in the sources does. Here they work by ISOLATION — the letter is
// rewritten in its isolated form, which joins nothing on either side, and gravity
// decides the rest. That is plain Arabic orthography doing the work instead of a
// disappearance, and it makes the puzzles harder in an interesting way: what you
// detach does not leave, it falls, and what it was holding falls with it.
//
// All three are pure unless `apply` is set, like everything else in this engine.

import { KEY, UNKEY } from './world.js?v=7';
import { readWorld } from './reader.js?v=7';
import { isolate } from './unmaking.js?v=7';

/* ------------------------------------------------------- invoke the name --- */

/**
 * Name a letter. Every instance of it, anywhere in the world, answers at once.
 *
 * PORTAL, `ilm-al-huruf`: the 28 letters correspond to the 28 divine names. If
 * the letter IS the name, then acting on the name acts on every instance of the
 * letter simultaneously — that is what a correspondence means. The interesting
 * play is choosing a letter that is load-bearing rather than merely common.
 *
 * `what` is applied to each matching cell; the default marks them, which is what
 * a caller wants for highlighting.
 */
export function invokeName(world, glyph, { apply = false, what = null } = {}) {
  const w = apply ? world : world.clone();
  const hits = w.list().filter(c => c.glyph === glyph);
  const effects = hits.map(c => ({
    kind: 'inscribe', op: 'INVOKE', glyph, at: [c.x, c.y, c.z],
    from: 'the letter and the name are the same thing, so every instance answers together',
    detail: `${glyph} at ${c.x},${c.y}`,
  }));
  if (what) for (const c of hits) what(c, w);
  return { ok: hits.length > 0, count: hits.length, cells: hits.map(c => [c.x, c.y, c.z]),
           effects, world: w,
           why: hits.length ? `${hits.length} × ${glyph} answered` : `no ${glyph} anywhere` };
}

/* -------------------------------------------------------------- reckoning --- */

/**
 * Name a number. Every run of adjoining letters whose values sum exactly to it
 * comes apart.
 *
 * PORTAL, `abjad-numerology`: "By selecting or composing words whose abjad sum
 * equals a specific number … one creates a linguistic-mathematical object that
 * resonates with that principle." Naming the number and having the matching runs
 * respond is that claim read literally. That they COME APART is ours.
 *
 * A run must be at least two letters — the source speaks of *composing words*, and
 * a single letter would be trivial since every block prints its own value.
 */
export function findRuns(world, target, { dir = [-1, 0, 0], minLength = 2 } = {}) {
  const { words } = readWorld(world, { dir });
  const runs = [];
  for (const word of words) {
    const cells = word.cells;
    const values = cells.map(c => world.get(...c)?.value || 0);
    for (let i = 0; i < cells.length; i++) {
      let sum = 0;
      for (let j = i; j < cells.length; j++) {
        sum += values[j];
        if (j - i + 1 < minLength) continue;
        if (sum === target) runs.push({ cells: cells.slice(i, j + 1), sum });
        if (sum > target) break;          // values are positive; no longer run helps
      }
    }
  }
  return runs;
}

export function reckon(world, target, opts = {}) {
  const { apply = false, dir = [-1, 0, 0] } = opts;
  const w = apply ? world : world.clone();
  const runs = findRuns(w, target, { dir });
  const effects = [];
  for (const run of runs) {
    for (const cell of run.cells) {
      const k = KEY(...cell);
      const c = w.cells.get(k);
      if (!c) continue;
      const had = [...c.bonds];
      w.unbondAll(k);
      c.connects = false;
      c.isolated = true;
      for (const nk of had) {
        effects.push({ kind: 'sever', op: 'RECKON', glyph: c.glyph, at: cell, to: UNKEY(nk),
          from: 'a run whose abjad values sum to the named number',
          detail: `${run.cells.map(x => w.get(...x)?.glyph || '').join('')} = ${run.sum}` });
      }
    }
  }
  const moved = w.settle();
  for (const m of moved) effects.push({ kind: 'fall', at: UNKEY(m.from), to: UNKEY(m.to), detail: 'fell' });
  return { ok: runs.length > 0, runs, effects, moved, world: w,
           why: runs.length
             ? `${runs.length} run${runs.length === 1 ? '' : 's'} summed to ${target} and came apart`
             : `nothing sums to ${target}` };
}

/* ------------------------------------------------------------- extraction --- */

/**
 * Take every instance of one letter out of the structure, and see what still
 * stands. In v1 the blocks vanished; here each is isolated, so it detaches and
 * then falls — and whatever it was carrying falls with it.
 *
 * ORDER MATTERS, which is the whole puzzle: isolating a load-bearing instance
 * early brings down letters you needed to reach later.
 */
export function extract(world, glyph, { apply = false, order = null } = {}) {
  const w = apply ? world : world.clone();
  let cells = w.list().filter(c => c.glyph === glyph).map(c => [c.x, c.y, c.z]);
  if (order) {
    // Caller-supplied order, filtered to those actually present.
    const want = order.map(String);
    cells = want.map(k => k.split(',').map(Number)).filter(c => {
      const cell = w.get(...c);
      return cell && cell.glyph === glyph;
    });
  }
  const effects = [], moved = [];
  let done = 0, stepBase = 0;
  for (const cell of cells) {
    const here = w.get(...cell);
    if (!here || here.glyph !== glyph) continue;     // it may have fallen already
    const r = isolate(w, cell, { apply: true });
    effects.push(...r.effects);
    // Each isolation's fall is its own little settle; offset the step tags so a
    // replay plays them in sequence rather than on top of each other.
    const steps = r.moved.length ? Math.max(...r.moved.map(m => m.step ?? 0)) + 1 : 0;
    for (const m of r.moved) moved.push({ ...m, step: (m.step ?? 0) + stepBase });
    stepBase += steps;
    done++;
  }
  const left = w.list().filter(c => c.glyph === glyph);
  return { ok: true, isolated: done, remaining: left.length, effects, moved, world: w,
           why: `${done} × ${glyph} isolated; ${left.length} still standing somewhere` };
}

/** Is every instance of `glyph` gone from at or above `line`? */
export function extracted(world, glyph, line) {
  return world.list().filter(c => c.glyph === glyph && c.y >= line).length === 0;
}

/* -------------------------------------------------- the reading direction --- */

/**
 * From which directions does the world read as `text`?
 *
 * This is Station Point rebuilt out of language. v1's version scattered painted
 * fragments through a volume and asked you to find the one viewpoint from which
 * they compose; that needs a camera moving through continuous space, which v2 does
 * not have. But a body of letters is ordered by projection onto the reading
 * direction, so the SAME structure genuinely spells different things read
 * different ways — and finding the direction that makes it a word is the same
 * puzzle made of writing instead of optics.
 */
export const DIRECTIONS = {
  west:  { dir: [-1, 0, 0], name: 'right to left', arabic: 'من اليمين' },
  east:  { dir: [1, 0, 0],  name: 'left to right', arabic: 'من اليسار' },
  down:  { dir: [0, -1, 0], name: 'top to bottom', arabic: 'من الأعلى' },
  up:    { dir: [0, 1, 0],  name: 'bottom to top', arabic: 'من الأسفل' },
};

export function readsFrom(world, text) {
  const out = [];
  for (const [id, d] of Object.entries(DIRECTIONS)) {
    const { words } = readWorld(world, { dir: d.dir });
    const hit = words.find(w => w.text === text);
    out.push({ id, ...d, reads: words.map(w => w.text), found: !!hit, word: hit || null });
  }
  return out;
}
