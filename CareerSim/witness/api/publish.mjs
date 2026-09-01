// POST /api/publish — a finished Career Sim run becomes a permanent witness.
// Mints an unguessable id and TWO secret keys (player hand, scholar hand), stores
// only their hashes, writes one JSON doc plus a small summary row for the future
// researcher's desk. No database.
//
// CORS is open for POST because the game itself is served from GitHub Pages while
// this service lives on Vercel — one game build, one service, no second copy of the
// game to drift.

import { put } from '@vercel/blob';
import { randomBytes, createHash } from 'node:crypto';

const WITNESS_V = 1;
const MAX_BYTES = 2 * 1024 * 1024; // a full scholarly log with plates is bigger than a day

const token = (n = 18) => randomBytes(n).toString('base64url');
const hash = (s) => createHash('sha256').update(s).digest('hex');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'expected a JSON body' });
    if (JSON.stringify(body).length > MAX_BYTES) return res.status(413).json({ error: 'witness too large' });

    const id = 'w_' + token(9);
    const playerKey = token();
    const scholarKey = token();

    const witness = {
      v: WITNESS_V,
      id,
      game: String(body.game || 'ibn-turka-occult-court'),
      origin: body.origin === 'simulated' ? 'simulated' : 'played',
      parent: body.parent || null,          // reserved: witness descent / forking
      createdAt: new Date().toISOString(),
      title: String(body.title || 'A Chronicle'),

      // ---- immutable core: frozen at publish, never modified afterwards ----
      meta: body.meta || {},
      legacyNotes: Array.isArray(body.legacyNotes) ? body.legacyNotes : [],
      attested: Array.isArray(body.attested) ? body.attested : [],
      log: Array.isArray(body.log) ? body.log : [],

      // ---- editorial layers ----
      // Seeded empty and never written here again: /api/edit appends each correction as
      // its own immutable blob and readers fold them back on. Only `preface.orig` is
      // meaningful in this document — the preface as the game gave it.
      keys: { player: hash(playerKey), scholar: hash(scholarKey) },
      revisions: [],
      annotations: [],
      illustrations: [],
      preface: { orig: '', current: '', hand: null },
    };

    // This document is written once and never rewritten — corrections live in their own
    // blobs under edits/<id>/ and are folded on read (see lib/edits-store.mjs). Because
    // it is immutable, caching it hard is correct rather than dangerous.
    await put(`witnesses/${id}.json`, JSON.stringify(witness), {
      access: 'public', contentType: 'application/json', addRandomSuffix: false,
    });

    await put(`index/${id}.json`, JSON.stringify({
      id, game: witness.game, origin: witness.origin, title: witness.title,
      createdAt: witness.createdAt,
      verdict: witness.meta.verdict || null,
      entries: witness.log.length,
      revisions: 0, annotations: 0,
    }), { access: 'public', contentType: 'application/json', addRandomSuffix: false });

    const base = `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
    return res.status(200).json({
      id,
      publicUrl: `${base}/w.html?id=${id}`,
      playerEditUrl: `${base}/w.html?id=${id}&k=${playerKey}`,
      scholarEditUrl: `${base}/w.html?id=${id}&k=${scholarKey}`,
    });
  } catch (err) {
    return res.status(500).json({ error: 'publish failed', detail: String(err && err.message || err) });
  }
}
