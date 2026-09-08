// trial_rules.js — what a trial IS, shared by the page, the gate and the tests.
//
// The Tribunal's verbs are three: BREAK a letter (taksīr, releasing the letters
// hidden in its name), INSCRIBE a word before the court, or REFUSE to answer.
// A court judges an inscription under its own metaphysics — so the same letters
// in the same order can stand in one court and be refused in another, and the
// Ottoman court refuses anything shorter than its procedure outright.
//
// The distinction the whole mode turns on, and the one verify_trials.mjs checks:
// LOSING and REFUSING are not the same outcome. Losing records a conviction and
// leaves the record standing without a demonstration beside it. Refusing costs
// standing, leaves the charge unproven, and keeps the record clean. Ibn Turka
// refused, three times, at ruinous cost — so a game about him in which refusing
// is merely a worse loss would be telling a lie about the one thing we know he did.

import { World } from '../../../engine/world.js';
import { compile, execute } from '../../../engine/vm.js';
import { worldReads, readWorld } from '../../../engine/reader.js';
import { taksir, dropRepeats, wordsReleasing } from '../../../engine/taksir.js';

/** The stand the word must be written on: fixed plinth blocks, nothing else. */
export function startWorld(trial) {
  const w = new World({ rules: { gravity: false } });
  for (const c of trial.stand) w.set(c.x, c.y, 0, { material: 'stone', value: 1, fixed: true });
  return w;
}

/**
 * BREAK. Returns the taksīr working plus the new hand. Breaking never consumes:
 * the letter is still yours, and what was inside it is now yours too. That is a
 * choice, and the reason is that taksīr in the source is an act of READING a word,
 * not of destroying one — "the occult code behind every manifest word", not
 * instead of it.
 */
export function breakLetter(hand, glyph, letters) {
  if (!hand.includes(glyph)) return { refused: 'not in hand', why: `You do not hold ${glyph}.` };
  const r = taksir(glyph, letters);
  if (!r.released.length) return { refused: 'nothing hidden', why: `${glyph} conceals nothing you do not already hold.`, working: r };
  return { working: r, hand: dropRepeats([...hand, ...r.released]), released: r.released };
}

/**
 * INSCRIBE. Writes the word westward from the east end of the stand, under the
 * court's ruleset, and reports what the court then sees. `refused` means the
 * court's own rules would not run the program at all — which for the operative
 * court is the whole point of the trial.
 */
export function inscribe(trial, hand, word, { letters, ruleset }) {
  const glyphs = [...word];
  for (const g of glyphs) if (!hand.includes(g)) return { refused: 'not in hand', why: `You do not hold ${g}.` };
  const east = Math.max(...trial.stand.map(c => c.x));
  if (glyphs.length > trial.stand.length) {
    return { refused: 'too long', why: `The stand has ${trial.stand.length} places and you have offered ${glyphs.length} letters.` };
  }
  const compiled = compile(glyphs.map(glyph => ({ glyph, register: 'written' })), { letters, ruleset });
  if (compiled.power.value === 0) {
    return { refused: 'power', why: compiled.power.why, compiled };
  }
  const w = startWorld(trial);
  const r = execute(w, compiled, { cursor: [east, 1, 0], dir: [-1, 0, 0] });
  return { world: w, effects: r.effects, compiled };
}

/**
 * Does the court see what it demanded? Two kinds of demand, and the difference
 * between them is the whole reason a court's metaphysics matters here:
 *
 *   reads           the demanded word must stand as ONE body. A word carrying a
 *                   non-connecting letter can only do that where SEVER is denied.
 *   reads-separate  the named parts must stand as SEPARATE bodies. That is only
 *                   possible where severing is permitted — so a court that
 *                   refuses to cut cannot see this demonstration at all.
 *
 * One demand is impossible without severing and the other is impossible with it,
 * which is how a court's doctrine comes to decide a verdict rather than decorate
 * one.
 */
export function judge(trial, world) {
  if (!world) return { held: false, why: 'Nothing stands before the court.', reads: [] };
  const { words } = readWorld(world);
  const reads = words.map(x => x.text);
  const d = trial.demand;
  if (d.kind === 'reads-separate') {
    const held = d.parts.every(p => reads.includes(p));
    return {
      held, reads,
      why: held
        ? `The court reads ${d.parts.map(p => `${p}`).join(' and ')}, standing apart.`
        : reads.length
          ? `The court reads ${reads.map(t => `"${t}"`).join(' and ')} — it does not see ${d.parts.join(' and ')} apart.`
          : 'The court reads nothing.',
    };
  }
  const hit = worldReads(world, d.text);
  return {
    held: hit.found,
    reads,
    why: hit.found
      ? `The court reads ${d.text}, whole.`
      : reads.length
        ? `The court reads ${reads.map(t => `"${t}"`).join(' and ')} — not ${d.text} as one body.`
        : 'The court reads nothing.',
  };
}

/**
 * Can this trial be answered at all, in this court? Searches break-then-inscribe:
 * every subset of the hand may be broken (repeatedly, until nothing new comes
 * out), then the demanded word is offered. Returns the shortest working line.
 * This is the gate's first question — a charge nobody can answer is not a trial,
 * it is a sentence.
 */
export function solve(trial, { letters, ruleset, maxBreaks = 4 }) {
  const target = [...trial.demand.text];
  const seen = new Set();
  const queue = [{ hand: trial.hand.slice(), breaks: [] }];
  while (queue.length) {
    const s = queue.shift();
    const key = s.hand.slice().sort().join('');
    if (seen.has(key)) continue;
    seen.add(key);

    if (target.every(g => s.hand.includes(g))) {
      const ins = inscribe(trial, s.hand, trial.demand.text, { letters, ruleset });
      if (!ins.refused) {
        const v = judge(trial, ins.world);
        if (v.held) return { solved: true, breaks: s.breaks, hand: s.hand, why: v.why };
      }
    }
    if (s.breaks.length >= maxBreaks) continue;
    for (const g of s.hand) {
      const b = breakLetter(s.hand, g, letters);
      if (b.refused) continue;
      queue.push({ hand: b.hand, breaks: s.breaks.concat([g]) });
    }
  }
  return { solved: false };
}

/**
 * Is the trial's difficulty real — i.e. is the demanded word NOT already
 * writable from the opening hand? A trial you can answer without breaking
 * anything does not teach taksīr; it just asks you to type.
 */
export function needsBreaking(trial) {
  return ![...trial.demand.text].every(g => trial.hand.includes(g));
}

/** The letters an answer must be made of, whatever the demand's shape. */
export function demandLetters(trial) {
  return [...trial.demand.text];
}

/** The record: every break is a claim about what conceals what. */
export function recordEntry(glyph, working) {
  return {
    glyph,
    claim: `${glyph} conceals ${working.released.join(' and ')}`,
    name: working.names[0].name,
    detail: working.steps.map(s => `${s.step}: ${s.detail}`),
  };
}

export { taksir, wordsReleasing, dropRepeats };
