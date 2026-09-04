// vm.js — the letter virtual machine: how a sequence of letters becomes world
// operations, under a chosen metaphysics.
//
//     LETTER PROGRAM → COMPILE → EFFECTS → (preview | execute) → WORLD
//
// THE ONE ARCHITECTURAL PROMISE
// -----------------------------
// `preview` and `execute` are the same function. Preview runs it against a clone
// and throws the clone away; execute runs it against the world. There is no
// second code path that estimates what will happen, so the preview cannot promise
// something the execution does not do. That rule was earned in v1, where a ghost
// block and a placement each solved for the aim point separately and disagreed.
//
// THE EXECUTION MODEL IS THE MAFĀḤIṢ'S OWN
// ----------------------------------------
// Ibn Turka builds his major work out of three "Globes of Light" corresponding to
// the MENTAL, SPOKEN and WRITTEN registers of the letter, arranged as an ascent, a
// descent, and an ascent again (research/notes/02). The engine takes that as its
// execution model rather than importing one from computing:
//
//     mental   compose and compute consequences; the world is untouched  (compile)
//     spoken   run once, transiently; the world returns to itself        (run)
//     written  run, and the letters remain as the thing built            (commit)
//
// So "the program compiles into world operations" is not a modern metaphor laid
// over the material — it is the material's own three-level structure, used for
// what it says it is for. The mapping onto plan/run/persist is ours, and says so.
//
// THE PROGRAM IS THE BUILDING
// ---------------------------
// A program is inscribed along a writing direction from a cursor, right to left by
// default. Letter i occupies cursor + dir*i. In the written register those letters
// STAY — so the structure you build and the program you wrote are the same object.
// That is the fusion the brief asks for between a level editor and a language.

import { World, KEY, UNKEY, MATERIALS } from './world.js?v=7';

// ALPHABET-AGNOSTIC BY CONSTRUCTION
// ---------------------------------
// Three things used to tie this engine to Arabic: the field name `abjad`, a
// hardcoded abjad series, and a power rule that asked whether a letter's class
// was 'nurani'. All three are now supplied by the data, because the claim that
// this engine can be vendored for another alphabet should be true rather than
// nearly true. It is vendored into GoldenDawnBlocks with Hebrew letters and
// gematria, which is the actual test of it.

/** A letter's number, whatever the alphabet calls it. */
export const num = l => (l && (l.value !== undefined ? l.value : l.abjad)) || 0;

/** The Arabic abjad series — the DEFAULT ladder, not the only one. In both
 *  alphabets the letters ARE the ladder, so compile() derives it from the letters
 *  it was given and this is only the fallback. */
export const LADDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80,
                       90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

/** Move `value` n places along a ladder of numbers. */
export function ladderStep(value, n, ladder = LADDER) {
  if (n === 0) return value;
  let i = ladder.findIndex(v => v >= value);
  if (i < 0) i = ladder.length - 1;
  const exact = ladder[i] === value;
  i = exact ? i + n : (n > 0 ? i + n - 1 : i + n);
  return ladder[Math.max(0, Math.min(ladder.length - 1, i))];
}

/** The ladder an alphabet makes: its own numbers, ascending, deduplicated. */
export function ladderOf(letters) {
  const seen = new Set();
  return letters.map(num).filter(v => v > 0 && !seen.has(v) && seen.add(v))
                .sort((a, b) => a - b);
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* ------------------------------------------------------------------ compile -- */

/**
 * Turn a letter sequence into instructions under a ruleset.
 *
 * Returns { instructions, diagnostics, power }. Diagnostics are the interesting
 * part: they are where a ruleset visibly REFUSES something, which is how the same
 * program builds under one metaphysics and collapses under another.
 */
export function compile(program, { letters, ruleset }) {
  const byGlyph = Object.fromEntries(letters.map(l => [l.glyph, l]));
  const diagnostics = [];
  const seq = [];

  // Gemination (shadda): a letter written twice running is one letter doubled.
  // Real orthography, and it is where the loop primitive comes from — we did not
  // have to import "repeat" from programming.
  for (const step of program) {
    const prev = seq[seq.length - 1];
    if (prev && prev.glyph === step.glyph && prev.register === step.register) {
      prev.repeat += 1;
      prev.geminated = true;
      continue;
    }
    seq.push({ ...step, repeat: 1, geminated: false });
  }

  const ladder = ladderOf(letters);
  const power = computePower(seq, { letters, ruleset, byGlyph });

  const instructions = [];
  seq.forEach((step, i) => {
    const letter = byGlyph[step.glyph];
    if (!letter) { diagnostics.push({ level: 'error', glyph: step.glyph, why: 'not one of the twenty-eight' }); return; }
    if (!ruleset.registers.includes(step.register)) {
      diagnostics.push({ level: 'error', glyph: step.glyph, register: step.register,
        why: `${ruleset.name} does not admit the ${step.register} register.` });
      return;
    }
    const ops = [];
    for (const p of letter.primitives) {
      if (ruleset.denies && ruleset.denies[p.op]) {
        diagnostics.push({ level: 'refused', glyph: step.glyph, op: p.op,
          why: ruleset.denies[p.op], from: p.from });
        continue;
      }
      if (!ruleset.grants.includes(p.op)) {
        diagnostics.push({ level: 'refused', glyph: step.glyph, op: p.op,
          why: `${ruleset.name} does not recognise ${p.op}.`, from: p.from });
        continue;
      }
      ops.push(p);
    }
    instructions.push({ index: i, glyph: step.glyph, letter, register: step.register,
                        repeat: step.repeat, geminated: step.geminated, ops });
  });

  if (power.value === 0) {
    diagnostics.push({ level: 'error', why: power.why });
  }
  return { instructions, diagnostics, power, ladder };
}

/** Does this letter break the word here? Granted by orthography, refusable by a
 *  ruleset (Sufi lettrism denies SEVER outright). Exported because the app needs
 *  the same answer when it places pre-existing letters into a world. */
export function severs(letter, ruleset) {
  if (!letter) return false;
  if (!letter.primitives.some(p => p.op === 'SEVER')) return false;
  if (ruleset.denies && ruleset.denies.SEVER) return false;
  return ruleset.grants.includes('SEVER');
}

/** The signature mechanic of each ruleset: what makes an operation strong. */
export function computePower(seq, { ruleset, byGlyph }) {
  const p = ruleset.power;
  if (p.rule === 'absolute') return { value: p.value ?? 1, why: p.detail, rule: p.rule };

  if (p.rule === 'procedure') {
    const n = seq.length;
    if (n < (p.min_length ?? 1)) {
      return { value: 0, rule: p.rule,
        why: `The procedure needs at least ${p.min_length} letters and has ${n}. A manual followed partly does nothing at all.` };
    }
    return { value: p.value ?? 1, rule: p.rule, why: `The procedure is complete: ${n} letters.` };
  }

  if (p.rule === 'proportion') {
    // Adjacent abjad values in small-integer ratio are consonant. This is the
    // Pythagorean claim used literally: strength IS proportionality.
    const vals = seq.map(s => num(byGlyph[s.glyph])).filter(Boolean);
    if (vals.length < 2) return { value: p.floor ?? 0.25, rule: p.rule, why: 'A single letter stands in no ratio to anything.' };
    let consonant = 0;
    const pairs = [];
    for (let i = 0; i + 1 < vals.length; i++) {
      const a = vals[i], b = vals[i + 1], g = gcd(a, b);
      const ok = a / g <= (p.max_term ?? 4) && b / g <= (p.max_term ?? 4);
      if (ok) consonant++;
      pairs.push({ a, b, ratio: `${a / g}:${b / g}`, consonant: ok });
    }
    const frac = consonant / (vals.length - 1);
    const value = (p.floor ?? 0.25) + (1 - (p.floor ?? 0.25)) * frac;
    return { value, rule: p.rule, pairs,
      why: `${consonant} of ${vals.length - 1} adjacent pairs stand in small-integer ratio.` };
  }

  if (p.rule === 'luminosity') {
    // Which class counts as luminous is the ruleset's to say, not the engine's.
    const cls = p.counts_class || 'nurani';
    const ls = seq.map(s => byGlyph[s.glyph]).filter(Boolean);
    const light = ls.filter(l => l.class === cls).length;
    const frac = ls.length ? light / ls.length : 0;
    const value = (p.floor ?? 0.4) + (1 - (p.floor ?? 0.4)) * frac;
    const reach = Math.max(...seq.map(s => p.register_reach?.[s.register] ?? 0), 0);
    return { value, reach, rule: p.rule,
      why: `${light} of ${ls.length} letters are luminous; reach ${reach}.` };
  }

  return { value: 1, rule: p.rule || 'none', why: 'No power rule; full strength.' };
}

/* ------------------------------------------------------------------- effects -- */

/**
 * Run a compiled program. This is BOTH the preview and the execution:
 *
 *   run(world, compiled, { apply: false })  → preview  (works on a clone)
 *   run(world, compiled, { apply: true })   → execute  (works on the world)
 *
 * Returns { effects, world, warnings }. `effects` is the display list the preview
 * layer draws and is exactly what was applied, never a parallel estimate.
 */
export function run(world, compiled, { cursor = [0, 0, 0], dir = [-1, 0, 0], apply = false } = {}) {
  const w = apply ? world : world.clone();
  const effects = [], warnings = [];
  const { instructions, power } = compiled;
  const ladder = compiled.ladder || LADDER;
  if (power.value === 0) {
    warnings.push(power.why);
    return { effects, world: w, warnings, power };
  }

  const cellOf = i => [cursor[0] + dir[0] * i, cursor[1] + dir[1] * i, cursor[2] + dir[2] * i];
  // Perpendicular to the writing line, in the horizontal plane. BIND works across
  // the line rather than along it, because along it is where the other letters of
  // the program are standing.
  const perp = [-dir[2], 0, dir[0]];
  const anchored = new Set();
  const inscribed = new Set();

  // The letters take their places first. In every register they occupy the world
  // while the program runs; only `written` leaves them there afterwards.
  for (const ins of instructions) {
    const [x, y, z] = cellOf(ins.index);
    if (w.has(x, y, z)) {
      warnings.push(`${ins.glyph} has nowhere to stand at ${x},${y},${z} — something is already there.`);
      ins.blocked = true;
      continue;
    }
    const c = w.set(x, y, z, { material: 'letter', value: num(ins.letter), glyph: ins.glyph });
    // Whether this letter joins what follows travels WITH the cell, so a letter
    // standing in the world answers the question the same way later.
    c.connects = !ins.ops.some(o => o.op === 'SEVER');
    // A letter that holds a frame holds it against being SHOVED too, which is
    // what makes AXIS a pin on a pushing floor. The flag travels with the cell so
    // the agent never has to ask the ruleset again.
    c.axis = ins.ops.some(o => o.op === 'AXIS');
    inscribed.add(KEY(x, y, z));
    effects.push({ kind: 'inscribe', op: null, glyph: ins.glyph, at: [x, y, z],
                   detail: `${ins.glyph} ${ins.letter.name}, ${num(ins.letter)}` });
  }

  // A WRITTEN WORD IS ONE BODY, AND THE SIX NON-CONNECTING LETTERS ARE WHERE IT
  // BREAKS. This is the plainest fact in Arabic orthography doing structural work:
  // ا د ذ ر ز و never join what follows, which is why an Arabic word can look like
  // several pieces. Here that is literal — adjacent letters bond into one rigid
  // body, and a letter that does not connect ends it. So a long structure needs
  // letters that join, and a rāʾ in the middle guarantees a fracture.
  //
  // A ruleset that DENIES SEVER (Sufi lettrism: "the chain of being is not cut")
  // bonds straight through the break, and the same word is one body there and two
  // bodies elsewhere.
  //
  // The pass runs over EVERY adjacent pair of letters in the world, not only the
  // ones in this program, because writing beside a letter that is already standing
  // joins the word — which is what writing does on a page. Only pairs this run
  // touched are reported, or the log would repeat itself every time.
  for (const c of w.list()) {
    if (!c.glyph) continue;
    const nk = [c.x + dir[0], c.y + dir[1], c.z + dir[2]];
    const nb = w.get(...nk);
    if (!nb || !nb.glyph) continue;
    const here = KEY(c.x, c.y, c.z), there = KEY(...nk);
    const touched = inscribed.has(here) || inscribed.has(there);
    if (c.connects === false) {
      if (touched) effects.push({ kind: 'sever', op: 'SEVER', glyph: c.glyph,
        at: [c.x, c.y, c.z], to: nk,
        from: 'a letter that never joins what follows',
        detail: `${c.glyph} joins nothing after it — the word breaks here` });
      continue;
    }
    w.bond(here, there);
    if (touched) effects.push({ kind: 'join', glyph: c.glyph, at: [c.x, c.y, c.z], to: nk,
      detail: `${c.glyph} joins ${nb.glyph}: one body` });
  }

  // AXIS is a pre-pass: a column is held for the whole run or not at all.
  for (const ins of instructions) {
    if (ins.blocked) continue;
    if (ins.ops.some(o => o.op === 'AXIS')) {
      const [x, , z] = cellOf(ins.index);
      anchored.add(`${x},${z}`);
      effects.push({ kind: 'anchor', op: 'AXIS', glyph: ins.glyph, at: cellOf(ins.index),
                     detail: `column ${x},${z} is held` });
    }
  }

  for (const ins of instructions) {
    if (ins.blocked) continue;
    const [x, y, z] = cellOf(ins.index);
    for (let rep = 0; rep < ins.repeat; rep++) {
      for (const op of ins.ops) {
        const e = fire(w, op, ins, [x, y, z], dir, perp, power, anchored, instructions, cellOf, ladder);
        if (e) effects.push({ ...e, glyph: ins.glyph, op: op.op, from: op.from,
                              repeated: ins.repeat > 1 ? rep + 1 : undefined });
      }
    }
  }

  // Spoken letters do not remain. The utterance passes; what it did stands.
  for (const ins of instructions) {
    if (ins.blocked || ins.register === 'written') continue;
    const [x, y, z] = cellOf(ins.index);
    const c = w.get(x, y, z);
    if (c && c.glyph === ins.glyph) {
      w.remove(x, y, z);
      effects.push({ kind: 'fade', glyph: ins.glyph, at: [x, y, z],
                     detail: ins.register === 'mental' ? 'never touched the world' : 'the utterance passes' });
    }
  }

  const fell = w.settle();
  for (const m of fell) effects.push({ kind: 'fall', at: UNKEY(m.from), to: UNKEY(m.to), detail: 'gravity' });

  return { effects, world: w, warnings, power };
}

function fire(w, op, ins, [x, y, z], dir, perp, power, anchored, instructions, cellOf, ladder = LADDER) {
  const n = Math.max(1, Math.round((op.n || 1) * power.value));
  // BIND works ACROSS the writing line; the line itself holds the other letters.
  const side = [x + perp[0], y + perp[1], z + perp[2]];
  const other = [x - perp[0], y - perp[1], z - perp[2]];
  // Assimilation is about the letter and the one written BEFORE it, which in a
  // program is the previous instruction, not an arbitrary cell.
  const prev = instructions.find(o => o.index === ins.index - 1 && !o.blocked);
  const prevCell = prev ? cellOf(prev.index) : null;

  if (op.op === 'AXIS' || op.op === 'SEVER') return null;   // handled before the run

  if (op.op === 'RAISE' || op.op === 'LOWER') {
    const [tx, ty, tz] = op.op === 'RAISE' ? [x, y + 1, z] : [x, y - 1, z];
    const c = w.get(tx, ty, tz);
    if (!c || c.glyph) return null;
    const was = c.value;
    c.value = ladderStep(was, op.op === 'RAISE' ? n : -n, ladder);
    return { kind: op.op.toLowerCase(), at: [tx, ty, tz], from_value: was, to_value: c.value,
             detail: `${was} → ${c.value}` };
  }

  if (op.op === 'BIND') {
    const A = w.get(...side), B = w.get(...other);
    if (!A || !B) return null;
    if (anchored.has(`${side[0]},${side[2]}`) || anchored.has(`${other[0]},${other[2]}`)) {
      return { kind: 'refused', at: side, detail: 'the column is held; it will not be bound away' };
    }
    w.bond(KEY(...side), KEY(...other));
    return { kind: 'bind', at: side, to: other, detail: `${A.material} and ${B.material} are one body` };
  }

  if (op.op === 'POUR') {
    const above = w.get(x, y + 1, z);
    if (!above || above.glyph) return null;
    let ty = y - 1;
    while (w.has(x, ty, z) && ty > -32) ty--;
    if (ty <= -32) return null;
    w.move(KEY(x, y + 1, z), KEY(x, ty, z));
    return { kind: 'pour', at: [x, y + 1, z], to: [x, ty, z], detail: `falls to y ${ty}` };
  }

  if (op.op === 'ASSIMILATE') {
    // al-shams → ash-shams: the article's lām, which PRECEDES, becomes the sun
    // letter. So the letter written before this one takes on its value — the
    // grammar, exactly, with the letters standing in for the article.
    if (!prevCell) return null;
    const c = w.get(...prevCell);
    if (!c || c.protected) return null;
    const was = c.value;
    if (was === num(ins.letter)) return null;
    c.value = num(ins.letter);
    c.assimilated = ins.glyph;
    return { kind: 'assimilate', at: prevCell, from_value: was, to_value: c.value,
             detail: `${prev.glyph} takes the value of ${ins.glyph}: ${was} → ${c.value}` };
  }

  if (op.op === 'DISTINGUISH') {
    // al-qamar stays al-qamar: the boundary is kept, and what precedes a moon
    // letter is thereafter protected from being assimilated.
    if (!prevCell) return null;
    const c = w.get(...prevCell);
    if (!c || c.protected) return null;
    // `protected`, not `fixed`: this is immunity to assimilation, not immunity to
    // gravity. Conflating the two was a bug for about four minutes.
    c.protected = true;
    return { kind: 'distinguish', at: prevCell,
             detail: `${prev.glyph} keeps its own value before ${ins.glyph}` };
  }

  return null;
}

/* ------------------------------------------------------------------ helpers -- */

/** Preview: the effects a program WOULD have. Never touches the world. */
export function preview(world, compiled, opts = {}) {
  return run(world, compiled, { ...opts, apply: false });
}

/** Execute: the same run, applied. */
export function execute(world, compiled, opts = {}) {
  return run(world, compiled, { ...opts, apply: true });
}

/**
 * "What does ب do under the current metaphysical ruleset?" — the structured
 * answer the brief asks for, carrying both the evidence and the affordance.
 */
export function describeLetter(glyph, { letters, ruleset, registers }) {
  const l = letters.find(x => x.glyph === glyph);
  if (!l) return null;
  const granted = [], refused = [];
  for (const p of l.primitives) {
    if (ruleset.denies && ruleset.denies[p.op]) refused.push({ ...p, why: ruleset.denies[p.op] });
    else if (!ruleset.grants.includes(p.op)) refused.push({ ...p, why: `${ruleset.name} does not recognise ${p.op}.` });
    else granted.push(p);
  }
  return {
    glyph, name: l.name, translit: l.translit, abjad: num(l), value: num(l),
    form: l.form, grammar: l.grammar, class: l.class,
    registers: (registers ? Object.keys(registers) : []).map(r => ({ id: r, allowed: ruleset.registers.includes(r) })),
    granted, refused,
    ruleset: { id: ruleset.id, name: ruleset.name, motive: ruleset.motive, kind: ruleset.kind,
               period: ruleset.period, sources: ruleset.sources,
               interpretation_note: ruleset.interpretation_note },
    note: l.note,
  };
}
