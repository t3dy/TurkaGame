// lesson_rules.js — what a lesson of the Introduction IS, in one place.
//
// The sage walks (engine/agent.js Scribe), writes one letter at a time beside
// themself, lets gravity in when a lesson asks, and erases a letter from a
// body when the golem lesson asks. Each lesson has a TASK the world must satisfy
// before "Next" unlocks, and a SOLUTION — a short script of the same actions —
// so that tests/introduction.test.mjs can prove every lesson is completable by
// running the solution through exactly this module. The page runs the same
// module, so the browser and the test cannot disagree about what counts.

import { World, KEY } from '../../../engine/world.js?v=10';
import { compile, execute } from '../../../engine/vm.js?v=10';
import { Scribe, DIRS } from '../../../engine/agent.js?v=10';
import { readWorld, worldReads } from '../../../engine/reader.js?v=10';
import { extract } from '../../../engine/operations.js?v=10';

/** Build the lesson's starting world and sage. */
export function start(lesson) {
  const w = new World({ rules: { gravity: !!lesson.world.gravity } });
  for (const c of lesson.world.cells || []) {
    w.set(c.x, c.y || 0, c.z || 0, { material: c.material || 'earth', value: c.value ?? 1, fixed: c.fixed !== false && c.fixed !== undefined ? !!c.fixed : false });
  }
  const sage = new Scribe(w, lesson.world.sage || [0, 0, 0]);
  return { world: w, sage };
}

/**
 * REACH. The sage can write in a cell that is empty, within one step of them
 * horizontally (the eight surrounding columns), at most two high, and either on
 * the ground or touching something already built. That is a Minecraft-ish reach,
 * and it is the one rule of the Introduction that is pure game convenience.
 */
export function canWrite(world, sage, cell) {
  const [x, y, z] = cell;
  if (y < 0 || y > 2) return { ok: false, why: 'Too high: the sage can write at most two blocks up.' };
  if (world.has(x, y, z)) return { ok: false, why: 'Something is already there.' };
  const [sx, , sz] = sage.pos;
  if (Math.abs(x - sx) > 1 || Math.abs(z - sz) > 1) return { ok: false, why: 'Too far: the sage can only write in the cells around where they stand. Walk closer.' };
  if (x === sx && z === sz && y === 0) return { ok: false, why: 'That is where the sage is standing.' };
  const touching = y === 0 || world.has(x - 1, y, z) || world.has(x + 1, y, z) || world.has(x, y - 1, z) || world.has(x, y + 1, z) || world.has(x, y, z - 1) || world.has(x, y, z + 1);
  if (!touching) return { ok: false, why: 'Nothing to write against: a letter above the ground must touch something already built.' };
  return { ok: true };
}

/** Write one letter at a cell under the lesson's alphabet and ruleset. */
export function writeLetter(world, sage, glyph, cell, { letters, ruleset }) {
  const r = canWrite(world, sage, cell);
  if (!r.ok) return { refused: 'reach', why: r.why };
  const compiled = compile([{ glyph, register: 'written' }], { letters, ruleset });
  if (compiled.power.value === 0) return { refused: 'power', why: compiled.power.why, compiled };
  const res = execute(world, compiled, { cursor: [cell[0], cell[1], cell[2]], dir: [-1, 0, 0] });
  return { effects: res.effects, compiled };
}

export function letGravityIn(world) {
  world.rules.gravity = true;
  return world.settle();
}

/**
 * ERASE. The Reckoner's extract() takes every instance of a letter out of its
 * word and lets what is left settle; it detaches, it does not delete. For the
 * golem the legend is stronger -- the letter is rubbed OUT -- so after the
 * extraction the detached letters are removed from the world. Said in the lesson.
 */
export function erase(world, glyph) {
  const r = extract(world, glyph, { apply: true });
  for (const c of world.list().filter(c => c.glyph === glyph)) world.remove(c.x, c.y, c.z);
  return r;
}

/* ------------------------------------------------------------------ tasks -- */

/**
 * Is the lesson's task satisfied? `state` carries what the page knows beyond
 * the world: whether gravity has been let in, which letters were erased, and
 * what evidence the ledger-style witness list holds.
 */
export function taskDone(task, world, sage, state = {}) {
  if (!task || task.kind === 'none') return { done: true, progress: '' };
  const letters = world.list().filter(c => c.glyph);
  switch (task.kind) {
    case 'walk-to': {
      const [tx, tz] = task.at;
      const here = sage.pos[0] === tx && sage.pos[2] === tz;
      return { done: here, progress: here ? 'You are standing on the mark.' : `The mark is at column ${tx}, row ${tz}; the sage is at column ${sage.pos[0]}, row ${sage.pos[2]}.` };
    }
    case 'write-any': {
      const n = letters.length;
      return { done: n >= task.n, progress: `${n} of ${task.n} letters written.` };
    }
    case 'write-glyphs': {
      const have = task.glyphs.filter(g => letters.some(c => c.glyph === g));
      return { done: have.length === task.glyphs.length, progress: `Written so far: ${have.join(' ') || 'none'} of ${task.glyphs.join(' ')}.` };
    }
    case 'reads': {
      const r = worldReads(world, task.text);
      return { done: r.found, progress: r.found ? `The world reads "${task.text}".` : `The world currently reads: ${r.all.length ? r.all.map(t => `"${t}"`).join(', ') : 'nothing'}. It needs to read "${task.text}".` };
    }
    case 'reads-separate': {
      const a = worldReads(world, task.a), b = worldReads(world, task.b);
      const ok = a.found && b.found;
      return { done: ok, progress: ok ? `Two separate bodies: "${task.a}" and "${task.b}".` : `Bodies now: ${a.all.map(t => `"${t}"`).join(', ') || 'none'}. Needed: "${task.a}" and, separately, "${task.b}".` };
    }
    case 'stands': {
      if (!state.gravity) return { done: false, progress: 'Build first, then press "Let gravity in".' };
      const held = task.targets.filter(([x, y, z]) => { const c = world.get(x, y, z || 0); return c && c.glyph; });
      return { done: held.length === task.targets.length, progress: `${held.length} of ${task.targets.length} marks held after the fall.` };
    }
    case 'value-changed': {
      const c = world.get(...task.at);
      const ok = !!c && c.value !== task.from;
      return { done: ok, progress: ok ? `The block's value changed from ${task.from} to ${c.value}.` : `The block above still has value ${c ? c.value : '?'}.` };
    }
    case 'bonded': {
      const stones = world.list().filter(c => !c.glyph && !c.fixed);
      let best = 0;
      for (const s of stones) best = Math.max(best, [...world.body(KEY(s.x, s.y, s.z))].filter(k => { const c = world.cells.get(k); return c && !c.glyph; }).length);
      return { done: best >= task.n, progress: best >= task.n ? `${best} stones move as one body.` : `The stones are still separate bodies (largest: ${best}).` };
    }
    case 'poured': {
      const c = world.get(...task.at);
      const ok = !!c && !c.glyph;
      return { done: ok, progress: ok ? 'The block was poured down to the ground.' : 'The block is still up there.' };
    }
    case 'golem': {
      if (!state.erased || !state.erased.includes(task.erase)) {
        const r = worldReads(world, task.word);
        return { done: false, stage: r.found ? 2 : 1, progress: r.found ? `The body reads "${task.word}". Now erase the ${task.erase}.` : `Write "${task.word}" on the body, first letter first. It reads now: ${r.all.map(t => `"${t}"`).join(', ') || 'nothing'}.` };
      }
      const r = worldReads(world, task.after);
      return { done: r.found, stage: 3, progress: r.found ? `The body reads "${task.after}".` : `After the erasure it reads: ${r.all.map(t => `"${t}"`).join(', ') || 'nothing'}.` };
    }
    default:
      return { done: false, progress: `unknown task ${task.kind}` };
  }
}

/* --------------------------------------------------------------- solutions -- */

/**
 * Run a lesson's solution script against a fresh world. Returns the final
 * task verdict plus the trace. Used by the test to prove every lesson can be
 * finished, and by the page's selfTest.
 */
export function runSolution(lesson, { letters, ruleset }) {
  const { world, sage } = start(lesson);
  const state = { gravity: !!lesson.world.gravity, erased: [] };
  const trace = [];
  for (const step of lesson.solution || []) {
    if (step.walk) {
      const r = sage.step(DIRS[step.walk]);
      trace.push(`walk ${step.walk}: ${r.ok ? 'ok' : r.why}`);
      if (!r.ok) return { done: false, trace, why: r.why };
    } else if (step.write) {
      const [glyph, cell] = step.write;
      const r = writeLetter(world, sage, glyph, cell, { letters, ruleset });
      trace.push(`write ${glyph} at ${cell.join(',')}: ${r.refused ? r.why : 'ok'}`);
      if (r.refused) return { done: false, trace, why: r.why };
    } else if (step.gravity) {
      const moved = letGravityIn(world);
      state.gravity = true;
      trace.push(`gravity: ${moved.length} cell-moves`);
    } else if (step.erase) {
      erase(world, step.erase);
      state.erased.push(step.erase);
      trace.push(`erase ${step.erase}`);
    }
  }
  const v = taskDone(lesson.task, world, sage, state);
  return { done: v.done, progress: v.progress, trace, world, sage };
}

export { readWorld, worldReads, DIRS };
