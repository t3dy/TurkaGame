// taksir.js — التكسير, the breaking of a word into the letters hidden inside it.
//
// THE SOURCE
// ----------
// Melvin-Koushki, *Prologue to Pythagorean Renaissance*, n. 35, describing Ibn
// Turka's own technical vocabulary (and noting that taksīr is cognate to Hebrew
// *temurah*):
//
//   taksīr "involves the muqaṭṭaʿāt- and Moonsplitting-inspired separation of the
//   letters of a name or word and the writing out of the letternames in full,
//   then the elimination of repeated letters, the term zubur refers to the first
//   letters in the full letternames (e.g., the A in ALF) and bayyināt to the
//   remaining letters (LF in ALF) — so by definition the occult code behind every
//   manifest word, and therefore the world itself."
//
// That is an algorithm, which is why it is here and not in a design document.
//
// THE ALGORITHM, AND WHERE WE CHOSE
// ---------------------------------
//   1. take the word's letters and drop repeats, keeping first occurrence
//      (the source's "elimination of repeated letters": a letter written twice
//      would have its name written twice, which adds nothing)
//   2. write each remaining letter's name out in full  (data/letters.json,
//      field `lettername`; the spellings and the dropped hamza are documented
//      and checked in data/build_letters.py)
//   3. ZUBUR  = the first letter of each name. Since a letter's name begins with
//      itself, the zubur ARE the word's own letters — the manifest word.
//   4. BAYYINĀT = everything else. These are letters the word did not visibly
//      contain: "the occult code behind every manifest word."
//
// The choices that are ours, and are ours in the source's silence rather than
// against it: repeats are dropped from the WORD (step 1) rather than from the
// expanded string; and the bayyināt are returned both in full and deduplicated,
// because a game needs to know both what was released and how much of it.
//
// WHY IT MATTERS TO A GAME
// ------------------------
// Taksīr is the only operation in this engine that CREATES letters. Everything
// else moves, joins, breaks or values what is already written. So it is the
// answer to "I need a letter I do not have", and the answer is bounded: across
// all twenty-eight names the bayyināt draw on only eight distinct letters
// (ا د ف ل م ن و ي), which build_letters.py --verify prints. Eight is a puzzle;
// twenty-eight would be a vending machine.

/** Unique letters of a word, first occurrence kept. */
export function dropRepeats(letters) {
  const seen = new Set(), out = [];
  for (const g of letters) { if (!seen.has(g)) { seen.add(g); out.push(g); } }
  return out;
}

/**
 * Break a word. `word` is a string or array of glyphs; `letters` is the letter
 * table (data/letters.json's `letters`). Returns the full working, because the
 * game shows the work — that is the house rule for anything alphanumeric.
 *
 *   { word, unique, names, zubur, bayyinat, bayyinatUnique, released, steps }
 *
 * `released` is the bayyināt minus everything the word already had: the letters
 * you did not have and now do.
 */
export function taksir(word, letters) {
  const byGlyph = Object.fromEntries(letters.map(l => [l.glyph, l]));
  const glyphs = [...word].filter(g => byGlyph[g]);
  const unknown = [...word].filter(g => !byGlyph[g]);
  const unique = dropRepeats(glyphs);

  const names = unique.map(g => ({
    glyph: g,
    name: byGlyph[g].lettername,
    zubur: byGlyph[g].lettername[0],
    bayyinat: byGlyph[g].lettername.slice(1),
  }));

  const zubur = names.map(n => n.zubur);
  const bayyinat = names.flatMap(n => [...n.bayyinat]);
  const bayyinatUnique = dropRepeats(bayyinat);
  const had = new Set(glyphs);
  const released = bayyinatUnique.filter(g => !had.has(g));

  const steps = [
    { step: 'separate', detail: `the word ${glyphs.join('')} is separated into ${glyphs.length} letter${glyphs.length === 1 ? '' : 's'}` },
    { step: 'drop repeats', detail: glyphs.length === unique.length
        ? 'no letter is repeated, so nothing is dropped'
        : `${glyphs.length - unique.length} repeated letter(s) dropped; ${unique.join('')} remain` },
    { step: 'write the names in full', detail: names.map(n => `${n.glyph} → ${n.name}`).join(' · ') },
    { step: 'zubur', detail: `the first letters: ${zubur.join('')} — the manifest word` },
    { step: 'bayyināt', detail: `the rest: ${bayyinat.join('')} — the occult code behind it` },
    { step: 'released', detail: released.length
        ? `${released.join('')} — letter${released.length === 1 ? '' : 's'} the word did not contain`
        : 'nothing new: every hidden letter was already in the word' },
  ];

  return { word: glyphs.join(''), unique, names, zubur, bayyinat, bayyinatUnique, released, unknown, steps };
}

/**
 * Every letter that taksīr can ever release, across the whole alphabet. The
 * bound that makes it a puzzle rather than a vending machine.
 */
export function releasable(letters) {
  const out = new Set();
  for (const l of letters) for (const g of l.lettername.slice(1)) out.add(g);
  return [...out];
}

/**
 * Which words over `hand` release `target`? Taksīr ignores order (it drops
 * repeats and writes names), so the search is over SUBSETS, not permutations.
 * Used by the Tribunal to prove a charge is answerable, and to hint.
 */
export function wordsReleasing(target, hand, letters, { maxLen = 4 } = {}) {
  const out = [];
  const uniq = dropRepeats(hand);
  const rec = (start, cur) => {
    if (cur.length) {
      const r = taksir(cur, letters);
      if (r.released.includes(target)) out.push({ word: cur.join(''), released: r.released.join('') });
    }
    if (cur.length >= maxLen) return;
    for (let i = start; i < uniq.length; i++) { cur.push(uniq[i]); rec(i + 1, cur); cur.pop(); }
  };
  rec(0, []);
  return out;
}
