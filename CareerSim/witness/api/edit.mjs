// POST /api/edit — the scholar's (or player's) hand corrects a published witness.
//
// The hand is derived from WHICH key hash matches, never from anything the client
// claims. Writes are append-only in the strong sense: the witness document written at
// publish time is NEVER rewritten, and each correction or note becomes its own immutable
// blob under edits/<id>/. Readers fold them back on. So the text the game actually
// produced stays recoverable forever, and — see the STORAGE SHAPE note in
// lib/edit-core.mjs — no edit can be lost to a stale cached copy of a shared document.
//
// What may be changed at all is decided by allow-list in lib/edit-core.mjs and enforced
// here server-side, not by the UI merely declining to offer a control.
//
// Concurrency: two people editing the same passage both land, in timestamp order, and
// the later one stands as the current reading. Neither is destroyed. The UI says so.

import { head } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { applyEdit, foldEdits } from '../lib/edit-core.mjs';
import { loadEdits, appendEdit } from '../lib/edits-store.mjs';

const hash = (s) => createHash('sha256').update(s).digest('hex');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'expected a JSON body' });

    const id = String(body.id || '');
    if (!/^w_[A-Za-z0-9_-]{6,}$/.test(id)) return res.status(400).json({ error: 'bad id' });

    const meta = await head(`witnesses/${id}.json`).catch(() => null);
    if (!meta) return res.status(404).json({ error: 'no such witness' });

    // The witness blob is immutable, so reading it through the CDN is safe by construction.
    const doc = await fetch(meta.url).then((r) => r.json());

    const k = String(body.key || '');
    let hand = null;
    if (k && doc.keys) {
      const h = hash(k);
      if (h === doc.keys.scholar) hand = 'scholar';
      else if (h === doc.keys.player) hand = 'player';
    }

    // Fold what is already there before validating: `old` must be the text as it now
    // stands, and the editorial limit must count every existing op.
    foldEdits(doc, await loadEdits(id));

    const result = applyEdit(doc, body, hand);
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    await appendEdit(id, result.op, result.record);

    return res.status(200).json({
      ok: true, hand, op: result.op, record: result.record,
      revisions: (doc.revisions || []).length,
      annotations: (doc.annotations || []).length,
    });
  } catch (err) {
    return res.status(500).json({ error: 'edit failed', detail: String((err && err.message) || err) });
  }
}
