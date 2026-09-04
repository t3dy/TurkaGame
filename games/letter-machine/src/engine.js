// engine.js — The Letter Machine. Pure logic, no DOM, no fetch: it takes the data
// it needs as arguments so the same module runs in the browser and under Node's
// test runner and the solver.
//
// THE CLAIM THIS MAKES PLAYABLE
//
// The brief's slogan (PUZZLERIDEAS.txt): "Don't make letters another ingredient in
// the alchemy game. Make Lettrism the programming language of the alchemy game."
// So here a letter is a VERB, and — the part that keeps it out of RPG-tooltip
// territory — WHICH verb is written in the letter's own body, not in a lookup:
//
//     closed form      → BIND    it encloses, so it joins what it stands between
//     descending tail  → POUR    it falls below the line, so what is above passes down
//     dots above (n)   → RAISE   n steps UP the abjad ladder
//     dots below (n)   → LOWER   n steps DOWN
//     vertical stroke  → AXIS    it is a line, not an ingredient: it holds a column
//
// A letter's program is the sum of the facts true of it, so ṣād (horizontal,
// closed, tail) BINDs and POURs, alif (vertical, nothing else) only holds an axis,
// and dāl and kāf — no dots, open, no tail — do nothing at all. That letters are
// INERT is a result, not an oversight: it is what makes the rule discoverable
// rather than memorable. Nine letters bind, seventeen pour, twelve raise, three
// lower, two hold an axis, two are inert.
//
// GROUNDING. The form facts are observable properties of the written glyph
// (games/abjad-tower/data/letters.json, generated with a --verify pass). The abjad
// values and the ladder are PORTAL-grounded (`abjad-numerology`). That a letter's
// *shakl* synthesises its occult properties is REPORTED in PUZZLERIDEAS.txt from
// al-Būnī, via a source not in this repo — so the five rules above are ours, and
// say so in the game. The ladder itself is not ours: 1..10 then tens then hundreds
// is the series as the tradition numbers it, and "one step" means one place in it.

/** The abjad series itself. RAISE and LOWER move a value along THIS, not by ±n:
 *  the series is the object the tradition asserts, so a step is a step in it. */
export const LADDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80,
                       90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

/** Move `value` n places along the ladder. A value that is not itself on the
 *  ladder (a sum, say 15) moves to the next rung in that direction. Clamped. */
export function ladderStep(value, n) {
  if (n === 0) return value;
  let i = LADDER.findIndex(v => v >= value);
  if (i < 0) i = LADDER.length - 1;
  const exact = LADDER[i] === value;
  // Off the ladder (a sum, say 15): the next rung in the direction of travel is
  // itself the first step — 15 raised once is 20, 15 lowered once is 10.
  i = exact ? i + n : (n > 0 ? i + n - 1 : i + n);
  return LADDER[Math.max(0, Math.min(LADDER.length - 1, i))];
}

/** A letter's program, derived from its form. Order matters and is fixed. */
export function formOps(letter) {
  const f = letter.form, ops = [];
  if (f.orientation === 'vertical') ops.push({ op: 'AXIS', n: 1 });
  if (f.dots > 0 && f.dot_position === 'above') ops.push({ op: 'RAISE', n: f.dots });
  if (f.dots > 0 && f.dot_position === 'below') ops.push({ op: 'LOWER', n: f.dots });
  if (f.closed) ops.push({ op: 'BIND', n: 1 });
  if (f.tail) ops.push({ op: 'POUR', n: 1 });
  return ops;
}

export const OP_NAMES = {
  AXIS:  { ar: 'محور', name: 'Axis',  from: 'a vertical stroke',   does: 'holds its whole column: nothing in it may be bound away this run.' },
  RAISE: { ar: 'رفع',  name: 'Raise', from: 'dots above',          does: 'the block above rises n places up the abjad ladder.' },
  LOWER: { ar: 'خفض',  name: 'Lower', from: 'dots below',          does: 'the block below falls n places down the abjad ladder.' },
  BIND:  { ar: 'جمع',  name: 'Bind',  from: 'a closed form',       does: 'the blocks either side merge; the sum gathers leftward, the way the line is read.' },
  POUR:  { ar: 'صبّ',  name: 'Pour',  from: 'a descending tail',   does: 'the block above passes through, into the empty cell below.' },
};

/* ------------------------------------------------------------------ board -- */

export const EMPTY = null;
export const sub = (element, value) => ({ kind: 'substance', element, value });
export const let_ = (letter, dots = null) => ({
  kind: 'letter', glyph: letter.glyph, letter,
  // A letter's dots can be moved (see `movedot`). `dots` overrides the written
  // form: { dots, dot_position }. null means "as written".
  dots,
});

/** The form a letter is being READ with — its own, unless its dots were moved. */
export function effectiveForm(cell) {
  if (!cell || cell.kind !== 'letter') return null;
  return cell.dots ? { ...cell.letter.form, ...cell.dots } : cell.letter.form;
}
function effectiveOps(cell) {
  return formOps({ form: effectiveForm(cell) });
}

/* ---------------------------------------------------------------- machine -- */

export class Machine {
  /**
   * @param {object} opts
   *   letters      the 28, from abjad-tower/data/letters.json
   *   schemes      correspondences.json .schemes
   *   puzzle       one entry of data/puzzles.json
   *   schemeId     which temperament scheme is OPERATIVE. Hidden from the player;
   *                the puzzle names it, or the seed picks it.
   */
  constructor({ letters, schemes, puzzle, schemeId }) {
    this.letters = letters;
    this.byGlyph = Object.fromEntries(letters.map(l => [l.glyph, l]));
    this.schemes = schemes;
    this.puzzle = puzzle;
    this.schemeId = schemeId || puzzle.scheme;
    this.scheme = schemes.find(s => s.id === this.schemeId);
    this.reset();
  }

  reset() {
    const p = this.puzzle;
    this.rows = p.rows; this.cols = p.cols;
    this.board = Array.from({ length: p.rows }, () => Array(p.cols).fill(EMPTY));
    for (const b of p.blocks) {
      this.board[b.r][b.c] = b.glyph
        ? let_(this.byGlyph[b.glyph])
        : sub(b.element, b.value);
    }
    this.hand = p.hand.map(g => this.byGlyph[g]);
    this.dotMoves = p.dot_moves ?? 0;
    this.transposes = p.transposes ?? 0;
    this.history = [];        // moves made, for replay and for the solver
    this.observations = [];   // scheme evidence produced this attempt
    this.ran = false;
    return this;
  }

  clone() {
    const m = Object.create(Machine.prototype);
    Object.assign(m, this);
    m.board = this.board.map(r => r.map(c => (c ? { ...c } : EMPTY)));
    m.hand = this.hand.slice();
    m.history = this.history.slice();
    m.observations = this.observations.slice();
    return m;
  }

  at(r, c) {
    return (r >= 0 && r < this.rows && c >= 0 && c < this.cols) ? this.board[r][c] : undefined;
  }

  /** A stable string for dedup in the solver and for tests. */
  hash() {
    const cell = x => !x ? '.' :
      x.kind === 'letter' ? x.glyph + (x.dots ? `(${x.dots.dots}${x.dots.dot_position[0]})` : '')
                          : `${x.element[0]}${x.value}`;
    return this.board.map(r => r.map(cell).join('|')).join('/') + '#' + this.hand.map(l => l.glyph).join('');
  }

  /* ---------------------------------------------------------------- moves -- */

  legalMoves() {
    const out = [];
    for (let i = 0; i < this.hand.length; i++) {
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c] === EMPTY) out.push({ move: 'place', hand: i, r, c });
      }
    }
    if (this.dotMoves > 0) {
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
        const cell = this.board[r][c];
        if (cell && cell.kind === 'letter' && cell.letter.form.dots > 0) {
          for (const pos of ['above', 'below', 'none']) {
            if (effectiveForm(cell).dot_position !== pos) out.push({ move: 'movedot', r, c, pos });
          }
        }
      }
    }
    if (this.transposes > 0) {
      for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c]) out.push({ move: 'transpose', r, c });
      }
    }
    return out;
  }

  apply(mv) {
    if (mv.move === 'place') {
      const l = this.hand[mv.hand];
      if (!l || this.board[mv.r][mv.c] !== EMPTY) return { ok: false, why: 'cell taken' };
      // Alif is singular: it takes no alif beside it. Two alifs do not make two —
      // they make a line. (correspondences.json, `alif-singular`.)
      if (l.glyph === 'ا') {
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const n = this.at(mv.r + dr, mv.c + dc);
          if (n && n.kind === 'letter' && n.glyph === 'ا') return { ok: false, why: 'an alif takes no alif' };
        }
      }
      this.board[mv.r][mv.c] = let_(l);
      this.hand.splice(mv.hand, 1);
      this.history.push(mv);
      return { ok: true };
    }

    if (mv.move === 'movedot') {
      const cell = this.board[mv.r][mv.c];
      if (!cell || cell.kind !== 'letter' || cell.letter.form.dots === 0) return { ok: false, why: 'no dot to move' };
      if (this.dotMoves <= 0) return { ok: false, why: 'no dot moves left' };
      this.board[mv.r][mv.c] = { ...cell, dots: { dots: mv.pos === 'none' ? 0 : cell.letter.form.dots, dot_position: mv.pos } };
      this.dotMoves--;
      this.history.push(mv);
      return { ok: true, why: `the dot of ${cell.glyph} moved ${mv.pos}` };
    }

    if (mv.move === 'transpose') return this.transpose(mv.r, mv.c);
    return { ok: false, why: 'unknown move' };
  }

  /**
   * TRANSPOSE — the brief's §14. Nothing is created: the same relation changes
   * representation. Which is the whole point, and it is also the one move whose
   * answer comes from the HIDDEN scheme, so every use is an experiment.
   *
   *   letter → substance   always succeeds. The element you get is the scheme's
   *                        answer about that letter, and the value is its abjad.
   *   substance → letter   succeeds only if some letter has BOTH that abjad value
   *                        and, under the operative scheme, that element. A failure
   *                        is a real result: it contradicts every scheme that would
   *                        have allowed it.
   */
  transpose(r, c) {
    if (this.transposes <= 0) return { ok: false, why: 'no transpositions left' };
    const cell = this.board[r][c];
    if (!cell) return { ok: false, why: 'nothing there' };
    const live = this.scheme.map;

    if (cell.kind === 'letter') {
      const el = live[cell.glyph];
      this.board[r][c] = sub(el, cell.letter.abjad);
      this.transposes--;
      this.history.push({ move: 'transpose', r, c });
      this._observe({ glyph: cell.glyph, element: el, kind: 'letter-to-substance' });
      return { ok: true, why: `${cell.glyph} read as ${el}, value ${cell.letter.abjad}`, element: el };
    }

    const want = this.letters.filter(l => l.abjad === cell.value);
    const hit = want.find(l => live[l.glyph] === cell.element);
    this.transposes--;
    this.history.push({ move: 'transpose', r, c });
    if (!hit) {
      this._observe({ value: cell.value, element: cell.element, kind: 'substance-to-letter', failed: true });
      return { ok: false, spent: true, why: `no letter of value ${cell.value} answers to ${cell.element}` };
    }
    this.board[r][c] = let_(hit);
    this._observe({ value: cell.value, element: cell.element, glyph: hit.glyph, kind: 'substance-to-letter' });
    return { ok: true, why: `${cell.element} ${cell.value} written as ${hit.glyph}` };
  }

  /** What every scheme would have predicted about a transposition, recorded so the
   *  notebook can score them. Pure data — the caller decides what to do with it. */
  _observe(ev) {
    const verdicts = [];
    for (const s of this.schemes.filter(x => x.domain === 'temperament')) {
      let predicted;
      if (ev.kind === 'letter-to-substance') predicted = s.map[ev.glyph];
      else predicted = this.letters.some(l => l.abjad === ev.value && s.map[l.glyph] === ev.element) ? ev.element : null;
      const actual = ev.kind === 'letter-to-substance' ? ev.element : (ev.failed ? null : ev.element);
      verdicts.push({ id: s.id, name: s.name, predicted, agrees: predicted === actual });
    }
    this.observations.push({ ...ev, verdicts });
  }

  /* ------------------------------------------------------------------ run -- */

  /**
   * Execute the board. Letters fire once each, RIGHT TO LEFT and top to bottom —
   * the order the script is read, which is the order a line of it runs.
   */
  run() {
    const log = [];
    // AXIS is a pre-pass: a column is held for the whole run or not at all.
    const held = new Set();
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const cell = this.board[r][c];
      if (cell && cell.kind === 'letter' && effectiveOps(cell).some(o => o.op === 'AXIS')) held.add(c);
    }
    if (held.size) log.push({ op: 'AXIS', cols: [...held], text: `column${held.size > 1 ? 's' : ''} ${[...held].join(', ')} held` });

    for (let r = 0; r < this.rows; r++) {
      for (let c = this.cols - 1; c >= 0; c--) {          // right to left
        const cell = this.board[r][c];
        if (!cell || cell.kind !== 'letter') continue;
        for (const { op, n } of effectiveOps(cell)) {
          const ev = this._fire(op, n, r, c, held);
          if (ev) log.push({ glyph: cell.glyph, op, ...ev });
        }
      }
    }
    this.ran = true;
    this.log = log;
    return log;
  }

  _fire(op, n, r, c, held) {
    const above = this.at(r - 1, c), below = this.at(r + 1, c);
    if (op === 'AXIS') return null;                        // handled in the pre-pass

    if (op === 'RAISE') {
      if (!above || above.kind !== 'substance') return null;
      const was = above.value;
      above.value = ladderStep(was, n);
      return { text: `${was} raised ${n} to ${above.value}` };
    }
    if (op === 'LOWER') {
      if (!below || below.kind !== 'substance') return null;
      const was = below.value;
      below.value = ladderStep(was, -n);
      return { text: `${was} lowered ${n} to ${below.value}` };
    }
    if (op === 'BIND') {
      const L = this.at(r, c - 1), R = this.at(r, c + 1);
      if (!L || !R || L.kind !== 'substance' || R.kind !== 'substance') return null;
      if (held.has(c - 1) || held.has(c + 1)) return { text: 'bind refused: the column is held' };
      // The sum gathers leftward, the way the line is read.
      this.board[r][c - 1] = sub(L.element, L.value + R.value);
      this.board[r][c + 1] = EMPTY;
      return { text: `${L.value} + ${R.value} bound to ${L.value + R.value}` };
    }
    if (op === 'POUR') {
      if (!above || above.kind !== 'substance') return null;
      // It falls to the first empty cell below, past whatever letters stand in
      // the way — which is what makes a COLUMN of letters a pipeline: each one
      // fires after the ones above it, on whatever has arrived beneath it.
      let t = r + 1;
      while (t < this.rows && this.board[t][c] !== EMPTY) t++;
      if (t >= this.rows) return null;                      // nowhere to fall
      this.board[t][c] = above;
      this.board[r - 1][c] = EMPTY;
      return { text: `${above.value} poured through to row ${t}` };
    }
    return null;
  }

  /* ----------------------------------------------------------------- goal -- */

  substances() {
    const out = [];
    for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) {
      const x = this.board[r][c];
      if (x && x.kind === 'substance') out.push({ ...x, r, c });
    }
    return out;
  }

  /** Has the goal been met? Pure; call after run(). */
  check() {
    const g = this.puzzle.goal, S = this.substances();
    if (g.type === 'total') {
      const t = S.reduce((a, x) => a + x.value, 0);
      return { win: t === g.value, detail: `total ${t}, wanted ${g.value}` };
    }
    if (g.type === 'produce') {
      const hit = S.find(x => x.value === g.value && (!g.element || x.element === g.element));
      const what = `${g.element ? g.element + ' ' : ''}${g.value}`;
      return { win: !!hit, detail: hit ? `${what} produced` : `no ${what} on the board` };
    }
    if (g.type === 'rows-alike') {
      const sums = [];
      for (let r = 0; r < this.rows; r++) {
        const row = this.board[r].filter(x => x && x.kind === 'substance');
        if (row.length) sums.push(row.reduce((a, x) => a + x.value, 0));
      }
      const ok = sums.length >= (g.min_rows ?? 2) && sums.every(v => v === sums[0]);
      return { win: ok, detail: `row sums ${sums.join(', ') || '—'}` };
    }
    return { win: false, detail: 'unknown goal' };
  }
}

/* ----------------------------------------------------------------- solver -- */

/**
 * Breadth-first over move sequences, running the machine after each prefix.
 * Returns the shortest winning sequence, or null. Deterministic: no randomness,
 * and legalMoves() is generated in a fixed order.
 *
 * This exists because of the house rule earned on The Impossible Architect:
 * CHECK A PUZZLE WITH A SOLVER BEFORE A PERSON. Its first version was won in
 * fifteen moves without opening a door.
 */
export function solve(machine, { maxDepth = 4, maxStates = 200000 } = {}) {
  const start = machine.clone();
  let frontier = [start];
  const seen = new Set([start.hash()]);
  let states = 0;

  for (let depth = 0; depth <= maxDepth; depth++) {
    const next = [];
    for (const m of frontier) {
      const t = m.clone();
      t.run();
      if (t.check().win) return { solved: true, depth, moves: m.history, states };
      if (depth === maxDepth) continue;
      for (const mv of m.legalMoves()) {
        if (++states > maxStates) return { solved: false, exhausted: true, states };
        const c = m.clone();
        if (!c.apply(mv).ok && mv.move !== 'transpose') continue;
        const h = c.hash();
        if (seen.has(h)) continue;
        seen.add(h);
        next.push(c);
      }
    }
    if (!next.length) break;
    frontier = next;
  }
  return { solved: false, states };
}
