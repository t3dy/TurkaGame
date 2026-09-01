// edit-core.mjs — the pure half of the editor: what may be changed, what may not,
// and how an append-only revision chain resolves to the text a reader sees.
//
// Kept separate from api/edit.mjs (which does HTTP, key hashing and blob I/O) for one
// reason: THE INVARIANT IS TESTABLE HERE. Editorial layers must never alter the
// simulation's record — not the bands, not the meters, not which options were locked.
// That is the property the whole witness design rests on, so it is enforced by an
// allow-list in code and covered by tests, rather than by everyone remembering it.
//
// STORAGE SHAPE. Each editorial op is persisted as its OWN immutable blob and the
// witness document is never rewritten. This is not tidiness: the first deployed version
// did read-modify-write on one blob, and because a blob's public URL is served from a
// CDN that ignores query strings, each edit read a pre-edit copy and erased the one
// before it. Three live edits, three 200s, nothing saved. An object that is written once
// and never changed cannot go stale, so folding immutable records is the fix as well as
// the honest expression of "append, never mutate".

export const MAX_TEXT = 8000;        // one corrected sentence, generously
export const MAX_PREFACE = 20000;
export const MAX_AUTHOR = 80;
export const MAX_EDITORIAL = 2000;   // revisions + annotations, per witness

// The only fields a scholar's hand may rewrite. Everything else — band, grounding,
// source, meters, verdict, which options were locked and why — is the machine's
// testimony and stays as the game gave it.
export const SIMPLE_FIELDS = ['situation', 'outcomeText', 'chronicle'];

// Named explicitly so a reader of this file can see what is being protected, rather
// than inferring it from the absence of an entry in the allow-list above.
export const FORBIDDEN_FIELDS = [
  'meta', 'band', 'grounding', 'source', 'phase', 'encounterId', 'i',
  'options', 'log', 'keys', 'verdict', 'plate', 'attested', 'origin', 'createdAt',
];

export function parseField(field) {
  if (typeof field !== 'string') return null;
  if (FORBIDDEN_FIELDS.includes(field.split(':')[0])) return null;
  if (SIMPLE_FIELDS.includes(field)) return { kind: 'simple', field, prop: field };
  const m = /^(optionLabel|optionDetail):(\d{1,3})$/.exec(field);
  if (m) return { kind: 'option', field, prop: m[1] === 'optionLabel' ? 'label' : 'detail', index: Number(m[2]) };
  return null;
}

// The text as the GAME gave it — the bottom of the revision chain, never overwritten.
export function originalText(doc, entryIndex, parsed) {
  const e = (doc.log || [])[entryIndex];
  if (!e) return null;
  if (parsed.kind === 'option') {
    const o = (e.options || [])[parsed.index];
    return o ? String(o[parsed.prop] ?? '') : null;
  }
  if (parsed.field === 'chronicle') {
    return e.chronicle ? String(e.chronicle.orig ?? e.chronicle.current ?? '') : null;
  }
  return String(e[parsed.field] ?? '');
}

// Revisions are appended, never merged, so the array is already chronological and the
// last matching entry is the standing text. Two editors on one field last-write-wins;
// the losing version is still in the chain, which is why this is append-only.
export function revisionChain(doc, entryIndex, field) {
  return (doc.revisions || []).filter(
    (r) => r && r.anchor && r.anchor.entryIndex === entryIndex && r.anchor.field === field
  );
}

export function resolveCurrent(doc, entryIndex, field) {
  const parsed = parseField(field);
  if (!parsed) return null;
  const orig = originalText(doc, entryIndex, parsed);
  if (orig === null) return null;
  const chain = revisionChain(doc, entryIndex, field);
  return chain.length ? String(chain[chain.length - 1].new ?? '') : orig;
}

// Rebuild the editorial layers from the stored op records. Order is by timestamp, and
// the blob pathname breaks ties, so two edits in the same millisecond still fold
// deterministically for every reader.
export function foldEdits(doc, edits) {
  doc.revisions = [];
  doc.annotations = [];
  doc.preface = doc.preface || { orig: '', current: '', hand: null };
  // `orig` is the preface as the GAME gave it and is never taken from an edit record.
  const sorted = [...(edits || [])].sort((a, b) => {
    const t = String(a?.record?.ts || '').localeCompare(String(b?.record?.ts || ''));
    return t !== 0 ? t : String(a?.path || '').localeCompare(String(b?.path || ''));
  });
  for (const e of sorted) {
    if (!e || !e.record) continue;
    if (e.op === 'revise') doc.revisions.push(e.record);
    else if (e.op === 'annotate') doc.annotations.push(e.record);
    else if (e.op === 'preface') {
      doc.preface.current = String(e.record.current ?? '');
      doc.preface.hand = e.record.hand || null;
      doc.preface.author = e.record.author || null;
      doc.preface.ts = e.record.ts || null;
    }
  }
  return doc;
}

const fail = (status, error) => ({ status, error });
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * Apply one editorial operation to a witness document, in place.
 * Returns `{ ok: true, record }` or `{ status, error }`. Never throws on bad input —
 * every rejection is a status the caller can return verbatim.
 */
export function applyEdit(doc, body, hand, now = new Date().toISOString()) {
  if (!hand) return fail(403, 'that key does not open this chronicle');
  if (!doc || typeof doc !== 'object') return fail(500, 'unreadable witness');

  doc.revisions ||= [];
  doc.annotations ||= [];
  if (doc.revisions.length + doc.annotations.length >= MAX_EDITORIAL) {
    return fail(409, 'this witness has reached its editorial limit');
  }

  const author = str(body.author).trim().slice(0, MAX_AUTHOR) || (hand === 'scholar' ? 'the scholar' : 'the player');
  const op = str(body.op);

  if (op === 'preface') {
    const text = str(body.text).trim();
    if (text.length > MAX_PREFACE) return fail(413, 'preface too long');
    doc.preface ||= { orig: '', current: '', hand: null };
    if (!doc.preface.orig) doc.preface.orig = str(doc.preface.current);
    doc.preface.current = text;
    doc.preface.hand = hand;
    doc.preface.author = author;
    doc.preface.ts = now;
    return { ok: true, op: 'preface', record: { ...doc.preface } };
  }

  // Both remaining ops anchor to one entry of the record.
  const entryIndex = Number(body?.anchor?.entryIndex ?? body?.entryIndex);
  if (!Number.isInteger(entryIndex) || entryIndex < 0 || entryIndex >= (doc.log || []).length) {
    return fail(400, 'no such entry in this chronicle');
  }

  if (op === 'annotate') {
    const text = str(body.text).trim();
    if (!text) return fail(400, 'an empty note is not a note');
    if (text.length > MAX_TEXT) return fail(413, 'note too long');
    // A note may point at a field, or at the entry as a whole (field null).
    const rawField = body?.anchor?.field ?? body?.field ?? null;
    let field = null;
    if (rawField !== null && rawField !== undefined && rawField !== '') {
      if (!parseField(rawField)) return fail(400, `a note cannot be anchored to "${str(rawField)}"`);
      field = rawField;
    }
    const record = {
      ts: now,
      anchor: { entryIndex, field },
      encounterId: (doc.log[entryIndex] || {}).encounterId || null,
      text, hand, author,
    };
    doc.annotations.push(record);
    return { ok: true, op: 'annotate', record };
  }

  if (op === 'revise') {
    const field = str(body?.anchor?.field ?? body?.field);
    const parsed = parseField(field);
    if (!parsed) return fail(400, `"${field}" is part of the record the game made, not of the text; it cannot be revised`);
    const old = originalText(doc, entryIndex, parsed) === null ? null : resolveCurrent(doc, entryIndex, field);
    if (old === null) return fail(400, 'no such passage in this entry');
    const next = str(body.new ?? body.text);
    if (!next.trim()) return fail(400, 'a revision cannot be empty; leave a note instead');
    if (next.length > MAX_TEXT) return fail(413, 'revision too long');
    if (next === old) return fail(400, 'that is what it already says');
    const record = {
      ts: now,
      anchor: { entryIndex, field },
      field,
      encounterId: (doc.log[entryIndex] || {}).encounterId || null,
      old, new: next, hand, author,
    };
    doc.revisions.push(record);   // never mutates doc.log — the original stays recoverable
    return { ok: true, op: 'revise', record };
  }

  return fail(400, `unknown operation "${op}"`);
}
