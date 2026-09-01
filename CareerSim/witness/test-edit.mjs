// node --test witness/test-edit.mjs  (run from CareerSim/)
// Covers the one invariant the witness design rests on: editorial layers may correct
// the TEXT and may never alter the record the simulation produced.

import test from 'node:test';
import assert from 'node:assert/strict';
import { applyEdit, resolveCurrent, revisionChain, parseField, foldEdits } from './lib/edit-core.mjs';

const doc = () => ({
  id: 'w_test',
  meta: { verdict: { manTitle: 'The Judge' }, meters: { standing: 4 } },
  log: [{
    i: 0, encounterId: 'p1-cairo-lesson', phase: 1, rubric: 'CAIRO, 1400',
    grounding: 'ATTESTED', source: 'BIOGRAPHY — Formation (Cairo)',
    situation: 'The lesson circle waits.',
    options: [
      { label: 'Speak', detail: 'name the letter', chosen: true, locked: false },
      { label: 'Keep silence', detail: '', chosen: false, locked: true, lockedBy: ['standing'] },
    ],
    band: 'success', outcomeText: 'They listen.',
    chronicle: { orig: 'He spoke in Cairo.', current: 'He spoke in Cairo.' },
  }],
  revisions: [], annotations: [], preface: { orig: '', current: '', hand: null },
});

test('a scholar may revise the situation, and the original stays recoverable', () => {
  const d = doc();
  const r = applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'The lesson circle had already dispersed.' }, 'scholar');
  assert.equal(r.ok, true);
  assert.equal(d.revisions.length, 1);
  assert.equal(d.log[0].situation, 'The lesson circle waits.', 'log must not be mutated in place');
  assert.equal(d.revisions[0].old, 'The lesson circle waits.');
  assert.equal(d.revisions[0].hand, 'scholar');
  assert.equal(d.revisions[0].encounterId, 'p1-cairo-lesson');
  assert.equal(resolveCurrent(d, 0, 'situation'), 'The lesson circle had already dispersed.');
});

test('revisions chain: the latest stands, the whole chain survives', () => {
  const d = doc();
  applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'chronicle' }, new: 'He spoke in Cairo, in 1400.' }, 'scholar');
  applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'chronicle' }, new: 'He spoke at Cairo in 803/1400.' }, 'player');
  assert.equal(resolveCurrent(d, 0, 'chronicle'), 'He spoke at Cairo in 803/1400.');
  assert.equal(revisionChain(d, 0, 'chronicle').length, 2);
  assert.equal(d.log[0].chronicle.orig, 'He spoke in Cairo.');
});

test('option label and detail are revisable by index', () => {
  const d = doc();
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'optionLabel:1' }, new: 'Hold your tongue' }, 'scholar').ok, true);
  assert.equal(resolveCurrent(d, 0, 'optionLabel:1'), 'Hold your tongue');
  assert.equal(d.log[0].options[1].label, 'Keep silence');
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'optionLabel:9' }, new: 'x' }, 'scholar').status, 400);
});

test('THE INVARIANT — no editorial write may touch the mechanical record', () => {
  for (const field of ['meta', 'band', 'grounding', 'source', 'phase', 'encounterId', 'options', 'log', 'keys', 'plate', 'i']) {
    const d = doc();
    const r = applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field }, new: 'triumph' }, 'scholar');
    assert.equal(r.ok, undefined, `${field} must be refused`);
    assert.equal(r.status, 400, `${field} must be refused with 4xx`);
    assert.equal(d.revisions.length, 0);
    assert.equal(parseField(field), null);
  }
  const d = doc();
  applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'Changed.' }, 'scholar');
  assert.equal(d.log[0].band, 'success');
  assert.deepEqual(d.meta.meters, { standing: 4 });
});

test('no key, no hand, no write', () => {
  const d = doc();
  const r = applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'x' }, null);
  assert.equal(r.status, 403);
  assert.equal(d.revisions.length, 0);
});

test('annotations attach to an entry, with or without a field', () => {
  const d = doc();
  assert.equal(applyEdit(d, { op: 'annotate', anchor: { entryIndex: 0, field: null }, text: 'Ibn Turka was not in Cairo this year.' }, 'scholar', '2026-08-31T00:00:00Z').ok, true);
  assert.equal(applyEdit(d, { op: 'annotate', anchor: { entryIndex: 0, field: 'chronicle' }, text: 'cf. the Isfahan colophon' }, 'player').ok, true);
  assert.equal(d.annotations.length, 2);
  assert.equal(d.annotations[0].author, 'the scholar');
  assert.equal(d.annotations[0].encounterId, 'p1-cairo-lesson');
  assert.equal(applyEdit(d, { op: 'annotate', anchor: { entryIndex: 0 }, text: '   ' }, 'scholar').status, 400);
  assert.equal(applyEdit(d, { op: 'annotate', anchor: { entryIndex: 0, field: 'band' }, text: 'no' }, 'scholar').status, 400);
});

test('bad anchors and bad ops are refused, not thrown', () => {
  const d = doc();
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: 7, field: 'situation' }, new: 'x' }, 'scholar').status, 400);
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: -1, field: 'situation' }, new: 'x' }, 'scholar').status, 400);
  assert.equal(applyEdit(d, { op: 'demolish', anchor: { entryIndex: 0 } }, 'scholar').status, 400);
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: '  ' }, 'scholar').status, 400);
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'The lesson circle waits.' }, 'scholar').status, 400);
  assert.equal(applyEdit(d, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'x'.repeat(9000) }, 'scholar').status, 413);
  assert.equal(d.revisions.length, 0);
});

test('the preface keeps its original and records the hand', () => {
  const d = doc();
  applyEdit(d, { op: 'preface', text: 'First reading.', author: 'M. Melvin-Koushki' }, 'scholar');
  applyEdit(d, { op: 'preface', text: 'Second reading.' }, 'scholar');
  assert.equal(d.preface.current, 'Second reading.');
  assert.equal(d.preface.orig, 'First reading.');
  assert.equal(d.preface.hand, 'scholar');
});

// ─────────────────────────────────────────────────────────────────────────────
// Regression: three ops in a row must all survive.
//
// The first deployed editor stored the editorial layers on the witness document and
// rewrote it per edit. Because a blob's public URL is CDN-cached and the cache key
// ignores the query string, each request read a pre-edit copy: three live edits, three
// 200 OKs, and a final document containing only the last one. Ops are now separate
// immutable blobs folded on read. This test drives that path the way the endpoint does.
// ─────────────────────────────────────────────────────────────────────────────
const asStore = () => {
  const store = [];
  return {
    store,
    // exactly what api/edit.mjs does: fold what exists, validate, persist only the record
    submit(base, body, hand, ts) {
      const d = foldEdits(JSON.parse(JSON.stringify(base)), store);
      const r = applyEdit(d, body, hand, ts);
      if (r.ok) store.push({ op: r.op, record: r.record, path: 'edits/w_test/' + ts });
      return r;
    },
  };
};

test('three edits in sequence all survive the fold (the bug that shipped)', () => {
  const base = doc();
  const s = asStore();
  assert.equal(s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'Corrected situation.' }, 'scholar', '2026-08-31T10:00:00.000Z').ok, true);
  assert.equal(s.submit(base, { op: 'annotate', anchor: { entryIndex: 0, field: null }, text: 'Not attested.' }, 'scholar', '2026-08-31T10:00:01.000Z').ok, true);
  assert.equal(s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'chronicle' }, new: 'He spoke at Cairo.' }, 'player', '2026-08-31T10:00:02.000Z').ok, true);
  assert.equal(s.submit(base, { op: 'preface', text: 'Read as a game.' }, 'scholar', '2026-08-31T10:00:03.000Z').ok, true);

  const read = foldEdits(JSON.parse(JSON.stringify(base)), s.store);
  assert.equal(read.revisions.length, 2, 'both revisions must survive');
  assert.equal(read.annotations.length, 1, 'the note must survive');
  assert.equal(read.preface.current, 'Read as a game.');
  assert.equal(resolveCurrent(read, 0, 'situation'), 'Corrected situation.');
  assert.equal(resolveCurrent(read, 0, 'chronicle'), 'He spoke at Cairo.');
  assert.equal(read.log[0].situation, 'The lesson circle waits.', 'the game record is still untouched');
});

test('a second edit to one passage sees the first as its `old`, and both are kept', () => {
  const base = doc();
  const s = asStore();
  s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'First correction.' }, 'scholar', '2026-08-31T10:00:00.000Z');
  const second = s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'Second correction.' }, 'player', '2026-08-31T10:00:05.000Z');
  assert.equal(second.record.old, 'First correction.');
  const read = foldEdits(JSON.parse(JSON.stringify(base)), s.store);
  assert.equal(revisionChain(read, 0, 'situation').length, 2);
  assert.equal(resolveCurrent(read, 0, 'situation'), 'Second correction.');
});

test('the fold is deterministic regardless of the order blobs are listed in', () => {
  const base = doc();
  const s = asStore();
  s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'A.' }, 'scholar', '2026-08-31T10:00:00.000Z');
  s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'B.' }, 'scholar', '2026-08-31T10:00:01.000Z');
  s.submit(base, { op: 'revise', anchor: { entryIndex: 0, field: 'situation' }, new: 'C.' }, 'scholar', '2026-08-31T10:00:02.000Z');
  const shuffled = [s.store[2], s.store[0], s.store[1]];
  assert.equal(resolveCurrent(foldEdits(JSON.parse(JSON.stringify(base)), shuffled), 0, 'situation'), 'C.');
});
