// edits-store.mjs — where editorial ops live, and how a witness is assembled for reading.
//
// One blob per op, written once, never rewritten:  edits/<witnessId>/<ts>-<rand>.json
// The witness document itself stays exactly as publish wrote it. See the STORAGE SHAPE
// note in edit-core.mjs for why: a mutable blob behind a CDN silently loses edits.
//
// Immutable objects are safe to read through any cache, so the fetches below need no
// cache-busting and would not be helped by it.

import { list, put, head } from '@vercel/blob';
import { randomBytes } from 'node:crypto';
import { foldEdits } from './edit-core.mjs';

const prefixFor = (id) => `edits/${id}/`;

export async function loadEdits(id) {
  const { blobs } = await list({ prefix: prefixFor(id), limit: 1000 });
  const records = await Promise.all(blobs.map(async (b) => {
    try {
      const rec = await fetch(b.url).then((r) => r.json());
      return { ...rec, path: b.pathname };
    } catch { return null; }   // one unreadable op must not take the whole witness down
  }));
  return records.filter(Boolean);
}

export async function appendEdit(id, op, record) {
  // The timestamp leads the pathname so a prefix listing is already in rough order and
  // stays readable to a human poking at the store.
  const path = `${prefixFor(id)}${String(record.ts).replace(/[:.]/g, '-')}-${randomBytes(4).toString('hex')}.json`;
  await put(path, JSON.stringify({ op, record }), {
    access: 'public', contentType: 'application/json', addRandomSuffix: false,
  });
  return path;
}

/** The witness as a reader should see it: the frozen record plus the folded editorial layers. */
export async function loadWitness(id) {
  const meta = await head(`witnesses/${id}.json`).catch(() => null);
  if (!meta) return null;
  const doc = await fetch(meta.url).then((r) => r.json());
  return foldEdits(doc, await loadEdits(id));
}
