// Local harness for the witness editor: serves public/ and stands in for the blob
// endpoints in memory, so the editor UI can be exercised end to end before anything is
// deployed. It mirrors production's storage shape — the witness document is frozen and
// each op is a separate record folded on read — so a bug in the fold shows up here.
// Not shipped; dev only. Vercel serves public/ + api/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { applyEdit, foldEdits } from './lib/edit-core.mjs';

const hash = (s) => createHash('sha256').update(s).digest('hex');
const PLAYER = 'playerkey-dev', SCHOLAR = 'scholarkey-dev';

const doc = {
  v: 1, id: 'w_localdev', game: 'ibn-turka-occult-court', origin: 'played',
  createdAt: new Date().toISOString(), title: 'The Chronicle of ʿAlī ibn Turka',
  meta: { verdict: { manTitle: 'The Judge Who Wrote', manText: 'He kept the seat and the pen both.',
                     systemTitle: 'The Court Absorbs', systemText: 'Lettrism became imperial furniture.' },
          meters: { standing: 6 } },
  legacyNotes: ['He never explained the Quintet to anyone who lived.'],
  attested: [{ hist: 'Ibn Turka was imprisoned in 1427', yours: 'you were exiled instead' }],
  log: [
    { i: 0, phase: 1, encounterId: 'p1-cairo-lesson', rubric: 'CAIRO, THE LESSON CIRCLE, 1400',
      grounding: 'ATTESTED', source: 'BIOGRAPHY — Formation (Cairo)',
      situation: 'The circle waits for you to name the letter.', plate: null,
      options: [ { label: 'Speak', detail: 'name it before the shaykh does', chosen: true, locked: false, unlockedBy: ['learning'], lockedBy: [] },
                 { label: 'Keep silence', detail: 'let the older men answer', chosen: false, locked: true, unlockedBy: [], lockedBy: ['standing below 3'] } ],
      band: 'success', outcomeText: 'They listen, and one of them remembers it.',
      chronicle: { orig: 'At Cairo he spoke first, and was remembered.', current: 'At Cairo he spoke first, and was remembered.' } },
    { i: 1, phase: 2, encounterId: 'p2-isfahan-summons', rubric: 'ISFAHAN, THE DIWAN, 1414',
      grounding: 'PLAUSIBLE-GAP', source: 'BIOGRAPHY — The judgeship',
      situation: 'The summons names you chief judge, and names your price.', plate: null,
      options: [ { label: 'Accept the seat', detail: '', chosen: true, locked: false, unlockedBy: [], lockedBy: [] },
                 { label: 'Refuse, citing the law', detail: 'and lose the city', chosen: false, locked: false, unlockedBy: [], lockedBy: [] } ],
      band: 'qualified', outcomeText: 'You are seated. The obligation begins the same hour.',
      chronicle: { orig: 'He took the seat at Isfahan.', current: 'He took the seat at Isfahan.' } },
  ],
  keys: { player: hash(PLAYER), scholar: hash(SCHOLAR) },
  revisions: [], annotations: [], illustrations: [],
  preface: { orig: '', current: '', hand: null },
};

const EDITS = [];   // stands in for the immutable blobs under edits/<id>/

const send = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };

createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/witness') {
    const k = u.searchParams.get('k') || '';
    const h = k ? hash(k) : '';
    const hand = h === doc.keys.scholar ? 'scholar' : h === doc.keys.player ? 'player' : null;
    const { keys, ...rest } = doc;
    const view = foldEdits(JSON.parse(JSON.stringify(rest)), EDITS);
    return send(res, 200, { witness: view, hand });
  }
  if (u.pathname === '/api/edit' && req.method === 'POST') {
    let raw = ''; for await (const c of req) raw += c;
    const body = JSON.parse(raw || '{}');
    const h = body.key ? hash(String(body.key)) : '';
    const hand = h === doc.keys.scholar ? 'scholar' : h === doc.keys.player ? 'player' : null;
    const working = foldEdits(JSON.parse(JSON.stringify(doc)), EDITS);
    const r = applyEdit(working, body, hand);
    if (!r.ok) return send(res, r.status, { error: r.error });
    EDITS.push({ op: r.op, record: r.record, path: 'edits/' + EDITS.length });
    return send(res, 200, { ok: true, hand, op: r.op, record: r.record,
      revisions: working.revisions.length, annotations: working.annotations.length });
  }
  const file = u.pathname === '/' ? '/w.html' : u.pathname;
  try {
    const buf = await readFile('public' + file);
    res.writeHead(200, { 'content-type': file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('not found'); }
}).listen(7533, () => console.log('witness dev harness on http://127.0.0.1:7533/w.html?id=w_localdev&k=' + SCHOLAR));
