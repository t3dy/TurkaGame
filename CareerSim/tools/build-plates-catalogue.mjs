// build-plates-catalogue.mjs — the illustration catalogue.
//
// Every choice page in the career sim, paired either with the plate it already has or
// with an art brief and candidate archive sources for the plate it needs. Imports the
// game content directly rather than parsing it, so the catalogue cannot drift from the
// game.
//
//   node CareerSim/tools/build-plates-catalogue.mjs
//
// Writes site/plates/.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const OUT = resolve(ROOT, 'site/plates');

const { ENCOUNTERS, PHASES } = await import('../content/index.js');
const { PLATE_BRIEFS, REPOSITORIES } = await import('../content/plates.js');

// registry of images already cleared and in use
let REGISTRY = [];
try {
  const raw = JSON.parse(readFileSync(resolve(ROOT, 'assets/manuscripts/registry.json'), 'utf8'));
  REGISTRY = Array.isArray(raw) ? raw : (raw.assets ?? []);
} catch { /* registry optional */ }
const byFile = Object.fromEntries(REGISTRY.map((r) => [r.local_file, r]));

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CSS = `
:root{--parchment:#f4ecd9;--deep:#e9dcc0;--ink:#2b2118;--faint:#7a6a56;
  --lapis:#1f4d8f;--vermillion:#9b2c1f;--gold:#a8842c;--verdigris:#3e6b5a;--line:#c9b992;}
@media (prefers-color-scheme:dark){:root{--parchment:#171310;--deep:#211b16;--ink:#e8dcc4;
  --faint:#8f8270;--lapis:#5b8bd0;--vermillion:#d0584a;--gold:#c9a648;--verdigris:#6fa08c;--line:#3a3128;}}
*{box-sizing:border-box}
body{margin:0;background:var(--parchment);color:var(--ink);
  font:16px/1.62 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}
a{color:inherit}
.wrap{max-width:1120px;margin:0 auto;padding:0 26px 90px}
header.top{border-bottom:1px solid var(--line);padding:44px 0 26px;margin-bottom:14px}
.kicker{font:600 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.2em;
  text-transform:uppercase;color:var(--gold);margin-bottom:13px}
h1{font-size:34px;line-height:1.18;margin:0 0 12px;font-weight:600;letter-spacing:-.01em}
.lede{color:var(--faint);max-width:70ch;margin:0 0 6px}
.stats{display:flex;gap:26px;flex-wrap:wrap;margin:22px 0 0;padding:0;list-style:none}
.stats li{font:13px/1.4 ui-sans-serif,system-ui,sans-serif;color:var(--faint)}
.stats b{display:block;font:600 26px/1.1 "Iowan Old Style",Georgia,serif;color:var(--ink)}
.nav{position:sticky;top:0;background:var(--parchment);border-bottom:1px solid var(--line);
  padding:12px 0;margin-bottom:30px;z-index:5;display:flex;gap:8px;flex-wrap:wrap}
.nav a{font:600 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.12em;
  text-transform:uppercase;text-decoration:none;color:var(--faint);
  border:1px solid var(--line);padding:7px 11px}
.nav a:hover{color:var(--lapis);border-color:var(--lapis)}
h2.phase{font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  color:var(--gold);margin:46px 0 4px;padding-top:14px}
h2.phase span{color:var(--faint);letter-spacing:.04em;text-transform:none;font-weight:400}
.card{border:1px solid var(--line);background:var(--deep);margin-bottom:20px;overflow:hidden}
.card .head{padding:16px 20px;border-bottom:1px solid var(--line);
  display:flex;gap:14px;align-items:baseline;flex-wrap:wrap}
.card .head h3{margin:0;font-size:17px;font-weight:600;flex:1;min-width:250px}
.tag{font:600 9.5px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.13em;
  text-transform:uppercase;padding:4px 8px;border:1px solid var(--line);color:var(--faint)}
.tag.have{color:var(--verdigris);border-color:var(--verdigris)}
.tag.want{color:var(--gold);border-color:var(--gold)}
.tag.att{color:var(--lapis);border-color:var(--lapis)}
.card .body{padding:18px 20px 22px;display:grid;grid-template-columns:1fr 1fr;gap:26px}
@media(max-width:860px){.card .body{grid-template-columns:1fr}}
.card h4{font:600 10.5px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;
  text-transform:uppercase;color:var(--faint);margin:0 0 9px}
.card p{margin:0 0 14px;font-size:14.5px}
.plateimg{border:1px solid var(--line);background:var(--parchment);padding:8px;margin-bottom:8px}
.plateimg img{width:100%;max-height:280px;object-fit:contain;display:block}
.cand{border-left:2px solid var(--line);padding:3px 0 3px 14px;margin-bottom:14px;font-size:13.5px}
.cand.v{border-left-color:var(--verdigris)}
.cand .repo{font:600 10px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.11em;
  text-transform:uppercase;color:var(--lapis)}
.cand .sm{font-family:ui-monospace,monospace;font-size:12px;color:var(--faint)}
.cand .nt{display:block;margin-top:5px;color:var(--faint);font-size:12.5px;font-style:italic}
.terms{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}
.terms li{font:12px/1 ui-monospace,monospace;color:var(--faint);
  border:1px solid var(--line);padding:5px 8px}
.opts{margin:6px 0 0;padding-left:18px;font-size:13.5px;color:var(--faint)}
.opts li{margin-bottom:4px}
.repos{display:grid;grid-template-columns:repeat(auto-fill,minmax(258px,1fr));gap:16px;margin-bottom:10px}
.repo-card{border:1px solid var(--line);background:var(--deep);padding:15px 17px}
.repo-card b{display:block;font-size:15px;margin-bottom:5px}
.repo-card span{font-size:13px;color:var(--faint)}
.repo-card a{font-size:12.5px;color:var(--lapis);word-break:break-all}
footer{margin-top:56px;padding-top:20px;border-top:1px solid var(--line);
  font-size:13px;color:var(--faint);max-width:78ch}
`;

const page = (title, body) => `<!doctype html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<link rel=stylesheet href="style.css"></head><body><div class=wrap>${body}</div></body></html>`;

function candidateHTML(c) {
  const r = REPOSITORIES[c.repo] || { name: c.repo };
  const bits = [];
  if (c.work) bits.push(esc(c.work));
  if (c.shelfmark) bits.push(`<span class=sm>${esc(c.shelfmark)}</span>`);
  if (c.accession) bits.push(`<span class=sm>${esc(c.accession)}</span>`);
  const url = c.url || r.url;
  return `<div class="cand${c.verified ? ' v' : ''}">
    <span class=repo>${esc(r.name)}</span>${c.verified ? ' ✓' : ''}<br>
    ${bits.join(' · ')}
    ${url ? `<br><a href="${esc(url)}">${esc(url)}</a>` : ''}
    ${c.note ? `<span class=nt>${esc(c.note)}</span>` : ''}
    <span class=nt>Licence: ${esc(r.licence || 'check per item')}</span>
  </div>`;
}

function cardHTML(id, enc) {
  const brief = PLATE_BRIEFS[id];
  const have = !!enc.plate;
  const rubric = enc.rubric || id;

  let left;
  if (have) {
    const file = (enc.plate.src || '').split('/').pop();
    const reg = byFile[file];
    left = `<div>
      <h4>Plate in use</h4>
      <div class=plateimg><img loading=lazy src="../../assets/manuscripts/${esc(file)}" alt=""></div>
      <p style="font-size:13px;color:var(--faint)">${esc(enc.plate.caption || '')}</p>
      ${reg ? `<div class="cand v"><span class=repo>${esc(reg.institution || '')}</span> ✓<br>
        ${esc(reg.title || '')}${reg.shelfmark ? ` · <span class=sm>${esc(reg.shelfmark)}</span>` : ''}
        ${reg.digitization_source_url ? `<br><a href="${esc(reg.digitization_source_url)}">${esc(reg.digitization_source_url)}</a>` : ''}
        <span class=nt>${esc(reg.rights_note || '')}</span></div>`
        : `<p style="font-size:13px;color:var(--faint)"><em>Not found in the provenance registry — worth reconciling.</em></p>`}
    </div>`;
  } else if (brief) {
    left = `<div>
      <h4>What the picture should show</h4><p>${esc(brief.brief)}</p>
      <h4>Composition</h4><p>${esc(brief.composition)}</p>
      <h4>Search terms</h4><ul class=terms>${brief.search.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    </div>`;
  } else {
    left = `<div><p><em>No plate and no brief yet.</em></p></div>`;
  }

  const opts = (enc.options || []).map((o) => `<li>${esc(o.label)}</li>`).join('');
  const right = `<div>
    <h4>The choice</h4>
    <p style="font-size:13.5px;color:var(--faint)">${esc((enc.situation || '').slice(0, 240))}${(enc.situation || '').length > 240 ? '…' : ''}</p>
    <ul class=opts>${opts}</ul>
    ${brief ? `<h4 style="margin-top:18px">Candidate sources</h4>${brief.candidates.map(candidateHTML).join('')}
      ${brief.note ? `<p class=nt style="font-size:12.5px;color:var(--faint)"><em>${esc(brief.note)}</em></p>` : ''}` : ''}
  </div>`;

  return `<div class=card id="${esc(id)}">
    <div class=head>
      <h3>${esc(rubric)}</h3>
      <span class="tag ${have ? 'have' : 'want'}">${have ? 'Plate in use' : 'Plate wanted'}</span>
      ${enc.grounding ? `<span class="tag att">${esc(enc.grounding)}</span>` : ''}
    </div>
    <div class=body>${left}${right}</div>
  </div>`;
}

// ── build ────────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, 'style.css'), CSS, 'utf8');

const all = Object.entries(ENCOUNTERS);
const have = all.filter(([, e]) => e.plate).length;
const want = all.length - have;
const candTotal = Object.values(PLATE_BRIEFS).reduce((n, b) => n + b.candidates.length, 0);

const nav = PHASES.map((p) => `<a href="#phase${p.id}">${esc(p.name)}</a>`).join('') +
  `<a href="#repositories">Archives</a>`;

let sections = '';
for (const p of PHASES) {
  const rows = all.filter(([, e]) => e.phase === p.id);
  const w = rows.filter(([, e]) => !e.plate).length;
  sections += `<h2 class=phase id="phase${p.id}">Phase ${p.id} · ${esc(p.name)} ` +
    `<span>— ${esc(p.dateline || '')} · ${rows.length} choice pages, ${w} still wanting a plate</span></h2>`;
  sections += rows.map(([id, e]) => cardHTML(id, e)).join('');
}

const repoCards = Object.entries(REPOSITORIES).map(([, r]) => `<div class=repo-card>
  <b>${esc(r.name)}</b><span>${esc(r.licence)}</span><br><a href="${esc(r.url)}">${esc(r.url)}</a></div>`).join('');

const body = `<header class=top>
  <div class=kicker>TurkaGame · Illustration Catalogue</div>
  <h1>A Plate for Every Choice</h1>
  <p class=lede>Every page in the career sim where the player decides something, paired with the
  period illustration it uses — or, where it has none, a brief describing what the picture should
  show and where to go looking for it.</p>
  <p class=lede style="font-size:14px">This is a design-phase working document. Rights are
  <em>not</em> cleared for the candidates below; they are recorded with repository, shelfmark and
  licence so that clearance can be sought later against a real citation rather than a memory.</p>
  <ul class=stats>
    <li><b>${all.length}</b>choice pages</li>
    <li><b>${have}</b>with a plate</li>
    <li><b>${want}</b>briefed, awaiting a plate</li>
    <li><b>${candTotal}</b>candidate sources</li>
    <li><b>${Object.keys(REPOSITORIES).length}</b>archives researched</li>
  </ul></header>
<nav class=nav>${nav}</nav>
${sections}
<h2 class=phase id=repositories>Archives researched <span>— licence as found, August 2026</span></h2>
<div class=repos>${repoCards}</div>
<footer>Built by <code>CareerSim/tools/build-plates-catalogue.mjs</code>, which imports the game
content directly, so this catalogue cannot drift from the encounters it describes. A ✓ marks a
candidate whose specific item I confirmed exists; everything else is a search strategy rather than
a citation, deliberately described in general terms rather than risking an invented shelfmark.
Licences were checked in August 2026 and should be re-checked before any public use.</footer>`;

writeFileSync(resolve(OUT, 'index.html'), page('Illustration Catalogue — TurkaGame', body), 'utf8');
console.log(`plates catalogue: ${all.length} choice pages (${have} with plates, ${want} briefed), ` +
  `${candTotal} candidates, ${Object.keys(REPOSITORIES).length} archives -> site/plates/`);
