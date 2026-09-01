// The gallery front page: a corpus scatter that shows the traditions separating,
// then the folios grouped by tradition.

import { loadGallery, loadScholarship, url, titleOf, esc, topbar } from './shared/gal.js?v=3';

let G, hidden = new Set();

/* --- the corpus scatter -------------------------------------------------- */
// chroma_mean (x) against ground_fraction (y): illumination-vs-drawing on one
// axis, world-vs-no-world on the other. Chosen because it is the pair that
// actually separates the traditions, not because it looked good.

const AXES = { x: 'chroma_mean', y: 'ground_fraction' };

function accentOf(t) {
  const probe = document.createElement('div');
  probe.className = 't-' + t;
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).getPropertyValue('--acc').trim() || '#c99a2e';
  probe.remove();
  return c;
}

function drawScatter() {
  const cv = document.getElementById('scatter');
  const dpr = Math.min(devicePixelRatio, 2);
  const W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const P = { l: 44, r: 12, t: 14, b: 34 };
  const xs = G.images.map(i => i.metrics[AXES.x]);
  const ys = G.images.map(i => i.metrics[AXES.y]);
  const x0 = 0, x1 = Math.max(...xs) * 1.08;
  const y0 = 0, y1 = Math.max(...ys) * 1.08;
  const X = v => P.l + (v - x0) / (x1 - x0) * (W - P.l - P.r);
  const Y = v => H - P.b - (v - y0) / (y1 - y0) * (H - P.t - P.b);

  ctx.strokeStyle = 'rgba(241,218,193,.12)';
  ctx.fillStyle = '#b9b0a6';
  ctx.font = '10px system-ui';
  for (let i = 0; i <= 4; i++) {
    const gx = x0 + (x1 - x0) * i / 4, gy = y0 + (y1 - y0) * i / 4;
    ctx.beginPath(); ctx.moveTo(X(gx), P.t); ctx.lineTo(X(gx), H - P.b); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(P.l, Y(gy)); ctx.lineTo(W - P.r, Y(gy)); ctx.stroke();
    ctx.fillText(gx.toFixed(0), X(gx) - 6, H - P.b + 13);
    ctx.fillText(gy.toFixed(2), 4, Y(gy) + 3);
  }
  ctx.fillStyle = '#f1dac1';
  ctx.fillText('chroma  →  illumination', P.l, H - 6);
  ctx.save();
  ctx.translate(11, H - P.b); ctx.rotate(-Math.PI / 2);
  ctx.fillText('bare paper  →  no world', 0, 0);
  ctx.restore();

  for (const im of G.images) {
    if (hidden.has(im.tradition)) continue;
    const cx = X(im.metrics[AXES.x]), cy = Y(im.metrics[AXES.y]);
    ctx.beginPath(); ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = accentOf(im.tradition); ctx.fill();
    ctx.strokeStyle = 'rgba(20,19,26,.75)'; ctx.lineWidth = 1.2; ctx.stroke();
    if (im.id === 'bustan-yusuf-zulaykha') {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillText('Yūsuf', cx + 12, cy + 3);
    }
  }
}

/* --- page ---------------------------------------------------------------- */

function cardFor(im) {
  const m = im.metrics;
  return `<a class="card t-${im.tradition}" href="workbench.html?id=${im.id}">
    <img src="${url(G, im.thumb)}" alt="${esc(titleOf(im.id))}" loading="lazy">
    <div class="body">
      <div class="name">${esc(titleOf(im.id))}</div>
      <div class="sub">${im.regions.length} regions · chroma ${m.chroma_mean.toFixed(0)} ·
        bare ${(m.ground_fraction * 100).toFixed(0)}%</div>
    </div></a>`;
}

(async function main() {
  G = await loadGallery('.');
  const S = await loadScholarship('.').catch(() => null);
  document.getElementById('nav').innerHTML = topbar('index.html', '.');

  const nRegions = G.images.reduce((a, i) => a + i.regions.length, 0);
  const nPlates = G.images.reduce((a, i) => a + i.plates.length, 0);
  document.getElementById('stat').innerHTML = `
    <div><b>${G.images.length}</b>folios, all rights-cleared</div>
    <div><b>${nRegions}</b>auto-proposed regions</div>
    <div><b>${nPlates}</b>papercraft plates cut</div>
    <div><b>${Object.keys(G.traditions).length}</b>traditions</div>`;

  document.getElementById('scatter-note').innerHTML =
    `Each dot is a folio. <b>${esc(G.metric_notes.chroma_mean)}</b> across the bottom;
     <b>${esc(G.metric_notes.ground_fraction)}</b> up the side. The Jalāyirid drawings and the
     Timurid illuminations land in opposite corners without being told to — which is the
     cheapest possible evidence that the measures are measuring something.`;

  const legend = document.getElementById('legend');
  legend.innerHTML = Object.entries(G.traditions).map(([k, [name]]) =>
    `<span class="t-${k}" data-t="${k}" style="border-color:${'var(--acc)'};color:var(--acc)">${esc(name)}</span>`
  ).join('');
  legend.addEventListener('click', e => {
    const t = e.target.dataset.t;
    if (!t) return;
    hidden.has(t) ? hidden.delete(t) : hidden.add(t);
    e.target.classList.toggle('off', hidden.has(t));
    drawScatter();
  });

  const groups = document.getElementById('groups');
  groups.innerHTML = Object.entries(G.traditions).map(([k, [name, blurb]]) => {
    const ims = G.images.filter(i => i.tradition === k);
    if (!ims.length) return '';
    return `<section class="trad t-${k}">
      <h2 style="color:var(--acc)">${esc(name)} <em>${ims.length} folio${ims.length > 1 ? 's' : ''}</em></h2>
      <div class="blurb">${esc(blurb)}</div>
      ${S && S.tradition_links[k] ? `<div class="schol-chips">${S.tradition_links[k].map(l => {
        const e = S.entries[l.slug];
        return e ? `<span title="${esc(l.why)} (entry: portal/db/turka.db, ${esc(e.confidence)}/${esc(e.review_status)})">${esc(e.name)}</span>` : '';
      }).join('')}</div>` : ''}
      <div class="grid">${ims.map(cardFor).join('')}</div>
    </section>`;
  }).join('');

  drawScatter();
  addEventListener('resize', drawScatter);
  window.__gal = { G };
})();
