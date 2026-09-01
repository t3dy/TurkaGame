// GET /api/witness?id=w_xxx[&k=secret] — read a published witness.
// Key hashes are stripped before the document leaves the server; a valid key is
// answered with which hand it belongs to, which is what the editor uses to enable
// editing and to stamp later corrections.

import { head } from '@vercel/blob';
import { createHash } from 'node:crypto';

const hash = (s) => createHash('sha256').update(s).digest('hex');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const id = String(req.query.id || '');
  if (!/^w_[A-Za-z0-9_-]{6,}$/.test(id)) return res.status(400).json({ error: 'bad id' });

  try {
    const meta = await head(`witnesses/${id}.json`).catch(() => null);
    if (!meta) return res.status(404).json({ error: 'no such witness' });

    const doc = await fetch(meta.url, { cache: 'no-store' }).then((r) => r.json());

    let hand = null;
    const k = req.query.k ? String(req.query.k) : '';
    if (k && doc.keys) {
      const h = hash(k);
      if (h === doc.keys.scholar) hand = 'scholar';
      else if (h === doc.keys.player) hand = 'player';
    }

    delete doc.keys; // never leaves the server
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ witness: doc, hand });
  } catch (err) {
    return res.status(500).json({ error: 'read failed', detail: String(err && err.message || err) });
  }
}
