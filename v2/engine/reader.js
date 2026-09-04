// reader.js — reading the world back as text.
//
// THE OVERARCHING PRINCIPLE, MADE MECHANICAL
// ------------------------------------------
//   "The player should gradually discover that the Arabic alphabet is not merely
//    the subject of the game. It is the language in which the game world is
//    written."
//
// vm.js writes: a program becomes a structure. This module is the other
// direction, and it is the direction that carries the principle. If a written
// word is a body of letter-cells standing in the world — which is what the
// written register makes true — then ANY body of letter-cells can be read. So
// the world is not merely built out of letters; it can be *read back*, including
// the parts of it the player did not write.
//
// That is the whole discovery. A player who has been writing all along finds
// that a structure already standing in the world resolves into a word, and the
// claim stops being decoration and becomes a fact about the place they are in.
//
// The reader is deliberately dumb: it groups letter-cells into bonded bodies,
// orders each along a writing direction, and reports what it finds — including
// when what it finds is not a word. It never guesses. A structure that reads as
// nothing reads as nothing.

import { KEY } from './world.js?v=5';

/**
 * Read every body of letter-cells in the world as a word.
 *
 * @param world  a World
 * @param dir    the writing direction the reading assumes. Default is the one
 *               vm.js writes in: right to left along -x. A structure read in the
 *               wrong direction gives the letters in the wrong order, which is a
 *               true fact about it rather than an error.
 * @returns { words: [{ glyphs, text, cells, abjad, contiguous }] }
 *          `abjad` is the sum of the cells' numbers, whatever the alphabet
 *          calls its numbering — gematria in the Hebrew build.
 */
export function readWorld(world, { dir = [-1, 0, 0] } = {}) {
  const letterCells = world.list().filter(c => c.glyph);
  const assigned = new Set();
  const words = [];

  for (const c of letterCells) {
    const k = KEY(c.x, c.y, c.z);
    if (assigned.has(k)) continue;
    // A body is what the bonds say it is — the same grouping gravity uses, so a
    // word that reads as one word is a word that falls as one word.
    const body = [...world.body(k)]
      .map(m => world.cells.get(m))
      .filter(Boolean)
      .filter(x => x.glyph);
    if (!body.length) { assigned.add(k); continue; }
    for (const x of body) assigned.add(KEY(x.x, x.y, x.z));

    // Order along the writing direction. Projecting onto dir itself puts the
    // FIRST letter written lowest, because each later letter sits one step
    // further along dir — so ascending projection is reading order.
    const proj = x => x.x * dir[0] + x.y * dir[1] + x.z * dir[2];
    const ordered = body.slice().sort((a, b) => proj(a) - proj(b));

    // Is it a single unbroken line along dir, one step apart? A structure that
    // is not is still reported; it is just reported as not being one.
    let contiguous = true;
    for (let i = 1; i < ordered.length; i++) {
      const a = ordered[i - 1], b = ordered[i];
      if (b.x - a.x !== dir[0] || b.y - a.y !== dir[1] || b.z - a.z !== dir[2]) contiguous = false;
    }

    const glyphs = ordered.map(x => x.glyph);
    words.push({
      glyphs,
      text: glyphs.join(''),
      cells: ordered.map(x => [x.x, x.y, x.z]),
      abjad: ordered.reduce((s, x) => s + (x.value || 0), 0),
      contiguous,
    });
  }

  // Reading order among the words themselves: the same direction, by the first
  // cell of each.
  const proj0 = w => w.cells[0][0] * dir[0] + w.cells[0][1] * dir[1] + w.cells[0][2] * dir[2];
  words.sort((a, b) => proj0(a) - proj0(b));
  return { words, text: words.map(w => w.text).join(' ') };
}

/**
 * Does the world contain a body that reads as `text`?
 * Used by tasks, and by nothing else — the reader itself makes no judgements
 * about whether a word is meaningful.
 */
export function worldReads(world, text, opts = {}) {
  const { words } = readWorld(world, opts);
  const hit = words.find(w => w.text === text);
  return { found: !!hit, word: hit || null, all: words.map(w => w.text) };
}
