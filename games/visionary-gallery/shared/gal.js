// Shared data access + the small visual widgets every page reuses.
// One fetch of gallery.json; everything else is drawn from it, so the site and
// the analysis cannot drift apart.

const V = 'v=3';

export const METRICS = [
  ['attention_evenness', 'attention evenness', 0, 1],
  ['orientation_spread', 'orientation spread', 0.85, 1],
  ['rectilinearity', 'rectilinearity', 0.2, 0.65],
  ['ground_fraction', 'bare ground', 0, 0.5],
  ['chroma_mean', 'chroma', 0, 42],
];

export async function loadGallery(base = '.') {
  const res = await fetch(`${base}/data/gallery.json?${V}`);
  if (!res.ok) throw new Error(`gallery.json: ${res.status}`);
  const g = await res.json();
  g.base = base;
  g.byId = Object.fromEntries(g.images.map(i => [i.id, i]));
  // corpus-wide min/max per metric, for "where does this one sit" bars
  g.range = {};
  for (const [k] of METRICS) {
    const vals = g.images.map(i => i.metrics[k]).filter(v => v != null);
    g.range[k] = { min: Math.min(...vals), max: Math.max(...vals),
                   mean: vals.reduce((a, b) => a + b, 0) / vals.length };
  }
  return g;
}

export async function loadScholarship(base = '.') {
  const res = await fetch(`${base}/data/scholarship.json?${V}`);
  if (!res.ok) throw new Error(`scholarship.json: ${res.status}`);
  return res.json();
}

const bold = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

/** Render the portal entries linked to one tradition. Entries are the portal's,
 *  with its own confidence/review flags carried through; the LINK and its "why"
 *  are this project's interpretation, shown at the point of use. */
export function scholarshipHTML(S, tradition) {
  const links = S.tradition_links[tradition] || [];
  if (!links.length) return '';
  const items = links.map(({ slug, why }) => {
    const e = S.entries[slug];
    if (!e) return '';
    const meta = [e.type, e.lifespan, e.relation_to_turka ? `to Ibn Turka: ${e.relation_to_turka.replace(/_/g, ' ')}` : null]
      .filter(Boolean).join(' · ');
    const lit = e.literature.length
      ? `<div class="schol-lit">${e.literature.map(esc).join('<br>')}</div>` : '';
    return `<div class="schol">
      <div class="schol-head"><b>${esc(e.name)}</b>
        <span class="pill ghost">${esc(e.confidence)} · ${esc(e.review_status)}</span></div>
      <div class="schol-meta">${esc(meta)}</div>
      <div class="schol-card">${bold(e.card)}</div>
      <div class="schol-why"><b>Why linked:</b> ${esc(why)} <em>(this project's mapping, not the portal's)</em></div>
      ${lit}</div>`;
  }).join('');
  return `<h3>From the knowledge portal</h3>
    <div class="dim" style="font-family:var(--sans);font-size:.68rem;line-height:1.5;margin-bottom:.5rem">
      Entries exported at build time from <span class="mono">portal/db/turka.db</span>
      by <span class="mono">export_gallery_scholarship.py</span> — the portal's text,
      carrying its own confidence and review flags. Only the <em>links</em> are ours.
    </div>${items}`;
}

export const url = (g, p) => `${g.base}/${p}`;
export const titleOf = id => id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Metric bars with a corpus-mean tick, so a number is always shown in context. */
export function metricBars(g, img, el) {
  el.className = 'metrics';
  el.innerHTML = METRICS.map(([k, label, lo, hi]) => {
    const v = img.metrics[k];
    if (v == null) return '';
    const pct = clamp((v - lo) / (hi - lo), 0, 1) * 100;
    const tick = clamp((g.range[k].mean - lo) / (hi - lo), 0, 1) * 100;
    return `<div class="metric" title="${esc(g.metric_notes[k] || '')}">
      <span class="k">${label}</span>
      <span class="bar"><i style="width:${pct.toFixed(1)}%"></i><u style="left:${tick.toFixed(1)}%"></u></span>
      <span class="v">${k === 'chroma_mean' ? v.toFixed(1) : v.toFixed(3)}</span>
    </div>`;
  }).join('') + `<div class="metric"><span class="k dim" style="grid-column:1/-1;font-size:.6rem">
      bar = this folio · tick = corpus mean of ${g.images.length}</span></div>`;
}

export function swatches(img, el) {
  el.className = 'swatches';
  el.innerHTML = img.palette.map(p =>
    `<i style="background:${p.hex};width:${(p.coverage * 100).toFixed(2)}%"
        title="${p.hex} — ${(p.coverage * 100).toFixed(1)}% of the page, chroma ${p.chroma}"></i>`
  ).join('');
}

/** Attention grid, drawn live from the numbers rather than shipped as a JPEG. */
export function drawAttention(canvas, grid, { colour = true } = {}) {
  if (!grid || !grid.length) return;
  const n = grid.length, m = grid[0].length;
  const flat = grid.flat();
  const lo = Math.min(...flat), hi = Math.max(...flat) || 1;
  canvas.width = m; canvas.height = n;
  const ctx = canvas.getContext('2d');
  const im = ctx.createImageData(m, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < m; x++) {
    const t = (grid[y][x] - lo) / ((hi - lo) || 1);
    const i = (y * m + x) * 4;
    if (colour) {                       // lapis -> gold, the house ramp
      im.data[i] = 30 + t * 200;
      im.data[i + 1] = 50 + t * 150;
      im.data[i + 2] = 120 - t * 70;
    } else { im.data[i] = im.data[i + 1] = im.data[i + 2] = t * 255; }
    im.data[i + 3] = 255;
  }
  ctx.putImageData(im, 0, 0);
}

/** Orientation rose: the edge-angle histogram as a polar plot over 180 degrees. */
export function drawRose(canvas, hist, accent = '#c99a2e') {
  const S = canvas.width = canvas.height = 240;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  const cx = S / 2, cy = S / 2, R = S * 0.44;
  const hi = Math.max(...hist) || 1;

  ctx.strokeStyle = 'rgba(241,218,193,.16)';
  for (const f of [0.33, 0.66, 1]) {
    ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke();
  }
  // page axes, the reference the rectilinearity measure uses
  ctx.strokeStyle = 'rgba(241,218,193,.30)';
  ctx.beginPath();
  ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
  ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
  ctx.stroke();

  ctx.fillStyle = accent;
  const n = hist.length, step = Math.PI / n;
  for (let i = 0; i < n; i++) {
    const r = R * (hist[i] / hi);
    // an edge at angle a is a line direction; mirror it so the rose reads as a
    // direction field rather than half a plot
    for (const off of [0, Math.PI]) {
      const a0 = i * step + off - Math.PI / 2, a1 = a0 + step;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/** Region boxes over a folio image, drawn from JSON — no baked overlay ships. */
export function regionOverlay(host, img, { onPick, layerColours, showLabels = false } = {}) {
  host.querySelectorAll('.rgn').forEach(e => e.remove());
  const [W, H] = img.work_size;
  for (const r of img.regions) {
    const [x1, y1, x2, y2] = r.box;
    const el = document.createElement('div');
    el.className = 'rgn';
    el.dataset.id = r.id;
    el.style.cssText = `position:absolute;left:${x1 / W * 100}%;top:${y1 / H * 100}%;` +
      `width:${(x2 - x1) / W * 100}%;height:${(y2 - y1) / H * 100}%;` +
      `border:1px solid ${layerColours ? layerColours[r.layer] : 'rgba(201,154,46,.8)'};` +
      `cursor:pointer;`;
    el.title = `${r.id} · layer ${r.layer} · detail ${r.detail} · chroma ${r.chroma}`;
    if (showLabels) {
      const t = document.createElement('span');
      t.textContent = r.id;
      t.style.cssText = 'position:absolute;left:1px;top:0;font:9px/1.2 system-ui;' +
        'background:rgba(20,19,26,.8);color:#f1dac1;padding:0 2px;pointer-events:none;';
      el.appendChild(t);
    }
    if (onPick) el.addEventListener('click', ev => { ev.stopPropagation(); onPick(r, el); });
    host.appendChild(el);
  }
}

export const LAYER_COLOURS = ['#3a4a7a', '#3f7a63', '#b4622a', '#8e3f6b', '#c99a2e',
                              '#2e8f8f', '#a8452f'];

export function topbar(active, up = '.') {
  const items = [
    ['index.html', 'Gallery'],
    ['assay.html', 'Assay'],
    ['method.html', 'Method'],
  ];
  return `<div class="topbar">
    <span class="title">Visionary Gallery</span>
    <span class="sep">·</span>
    ${items.map(([h, l]) => h === active
      ? `<b style="color:var(--gold-hi)">${l}</b>`
      : `<a href="${up}/${h}">${l}</a>`).join('<span class="sep">·</span>')}
    <span class="spacer"></span>
    <a href="${up}/../yusuf-ascent/index.html">Yūsuf Ascent</a>
    <span class="sep">·</span>
    <a href="${up}/../../site/index.html">TurkaGame</a>
  </div>`;
}
