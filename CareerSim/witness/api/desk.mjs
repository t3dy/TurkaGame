// GET /api/desk?key=... — the researcher's desk: every witness, every editorial act.
//
// Admin-only (DESK_KEY env var on the Vercel project; the key itself lives in the
// local gitignored file witness/.admin-key and was piped straight into `vercel env`
// without ever passing through a chat or a commit).
//
// Reads exactly two blob prefixes:
//   index/     — one summary row per witness, written once at publish (immutable)
//   edits/     — one immutable blob per editorial op (the P6 storage shape)
// Editorial state is DERIVED from edits/, never from counters — an incrementally
// updated counter on a mutable blob is the exact trap that ate the first editor
// (docs/PIVOTS.md P6), and NEXTSTEPS.md §desk says so.
//
// The headline view is the scholar-priority queue: every revision and annotation
// across all witnesses, grouped by the encounter it corrects, scholar hand first,
// newest first — one screen to answer "what has the scholar objected to, and where?"

import { list } from '@vercel/blob';
import { createHash, timingSafeEqual } from 'node:crypto';

const sha = (s) => createHash('sha256').update(String(s)).digest();

async function listAll(prefix) {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  // Both sides trimmed: env values acquire trailing newlines depending on how they
  // were piped in (PowerShell's pipeline appends one), and a key pasted into a URL
  // can pick up whitespace. A newline must never be the difference between
  // authorized and not.
  const key = String(req.query.key || '').trim();
  const expected = (process.env.DESK_KEY || '').trim();
  if (!expected || !key || !timingSafeEqual(sha(key), sha(expected))) {
    return res.status(403).json({ error: 'the desk is private' });
  }

  try {
    const [indexBlobs, editBlobs] = await Promise.all([listAll('index/'), listAll('edits/')]);

    // Summary rows (immutable facts from publish time).
    const rows = (await Promise.all(indexBlobs.map(async (b) => {
      try { return await fetch(b.url).then((r) => r.json()); } catch { return null; }
    }))).filter(Boolean);

    // Editorial ops, attributed to their witness by pathname: edits/<id>/<file>.
    const ops = (await Promise.all(editBlobs.map(async (b) => {
      try {
        const rec = await fetch(b.url).then((r) => r.json());
        return { witnessId: b.pathname.split('/')[1], op: rec.op, record: rec.record };
      } catch { return null; }
    }))).filter((x) => x && x.record);

    const byWitness = new Map();
    for (const o of ops) {
      if (!byWitness.has(o.witnessId)) byWitness.set(o.witnessId, []);
      byWitness.get(o.witnessId).push(o);
    }

    const titleOf = new Map(rows.map((r) => [r.id, r.title]));
    const witnesses = rows.map((r) => {
      const mine = byWitness.get(r.id) || [];
      const revisions = mine.filter((o) => o.op === 'revise').length;
      const annotations = mine.filter((o) => o.op === 'annotate').length;
      const lastEditedAt = mine.map((o) => o.record.ts).sort().pop() || null;
      return {
        id: r.id, title: r.title, game: r.game, origin: r.origin, createdAt: r.createdAt,
        verdict: r.verdict || null, entries: r.entries,
        revisions, annotations,
        scholarTouched: mine.some((o) => o.record.hand === 'scholar'),
        lastEditedAt,
      };
    }).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    // The priority queue: ops grouped by the encounter they touch.
    const groups = new Map();
    for (const o of ops) {
      if (o.op === 'preface') continue;
      const encId = o.record.encounterId || '(no encounter)';
      const gkey = encId;
      if (!groups.has(gkey)) groups.set(gkey, { encounterId: encId, items: [] });
      groups.get(gkey).items.push({
        witnessId: o.witnessId, witnessTitle: titleOf.get(o.witnessId) || o.witnessId,
        op: o.op, ts: o.record.ts, hand: o.record.hand, author: o.record.author,
        field: (o.record.anchor || {}).field || null,
        text: o.op === 'annotate' ? o.record.text : null,
        old: o.op === 'revise' ? o.record.old : null,
        new: o.op === 'revise' ? o.record.new : null,
      });
    }
    const queue = [...groups.values()];
    for (const g of queue) {
      g.items.sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
      g.scholar = g.items.some((i) => i.hand === 'scholar');
      g.latest = g.items[0].ts;
    }
    // Scholar-touched encounters first, then by recency.
    queue.sort((a, b) => (b.scholar - a.scholar) || String(b.latest).localeCompare(String(a.latest)));

    return res.status(200).json({
      totals: {
        witnesses: witnesses.length,
        played: witnesses.filter((w) => w.origin === 'played').length,
        simulated: witnesses.filter((w) => w.origin === 'simulated').length,
        revisions: ops.filter((o) => o.op === 'revise').length,
        annotations: ops.filter((o) => o.op === 'annotate').length,
        scholarTouched: witnesses.filter((w) => w.scholarTouched).length,
      },
      witnesses, queue,
    });
  } catch (err) {
    return res.status(500).json({ error: 'desk failed', detail: String((err && err.message) || err) });
  }
}
