// Assay — the corpus-level game.
//
// Two folios, one measure, which scores higher. It is a game about calibrating an
// eye against a number, so the interesting outcome is the per-measure record at the
// bottom: most people read chroma and bare ground straight off the page, and nobody
// reads orientation spread.

import { loadGallery, url, titleOf, esc, topbar, METRICS } from './shared/gal.js?v=3';

const ASKS = {
  attention_evenness: ['spreads its attention more evenly across the page',
    'Even attention means detail is distributed flat rather than concentrated on a subject. ' +
    'Look for a page with no obvious empty quarter and no single hot centre.'],
  orientation_spread: ['commits to more competing straight directions',
    'A page whose edges all run two ways — up and across — scores low. One whose stairs, ' +
    'planes and openings disagree with each other scores high. This is the hardest one to see.'],
  rectilinearity: ['puts more of its edge energy square to the page',
    'Architecture drawn parallel to the page edges scores high; foliage, cloud and figures score low.'],
  ground_fraction: ['leaves more of the page as bare paper',
    'Quiet, pale, near-neutral pixels. A tinted drawing on an unpainted sheet scores high; ' +
    'an illumination that covers every millimetre scores near zero.'],
  chroma_mean: ['is more saturated overall',
    'Mean chroma in CIE Lab. This is the one your eye is best at, so it should be the easy question.'],
};

let G, cur = null;
const record = {};
const streak = [];

function pick() {
  const keys = Object.keys(ASKS);
  for (let attempt = 0; attempt < 200; attempt++) {
    const k = keys[Math.floor(Math.random() * keys.length)];
    const span = G.range[k].max - G.range[k].min;
    const a = G.images[Math.floor(Math.random() * G.images.length)];
    const b = G.images[Math.floor(Math.random() * G.images.length)];
    if (a.id === b.id) continue;
    const va = a.metrics[k], vb = b.metrics[k];
    if (va == null || vb == null) continue;
    // Require a real gap, or the question is a coin toss dressed as a question.
    if (Math.abs(va - vb) < span * 0.25) continue;
    return { k, pair: [a, b], winner: va > vb ? 0 : 1 };
  }
  return null;
}

function fmt(k, v) { return k === 'chroma_mean' ? v.toFixed(1) : v.toFixed(3); }

function render() {
  cur = pick();
  if (!cur) return;
  const [label] = ASKS[cur.k];
  const nice = METRICS.find(m => m[0] === cur.k)[1];
  document.getElementById('q').innerHTML = `Which folio <b>${label}</b>?`;
  document.getElementById('hint').innerHTML =
    `<b>${esc(nice)}</b> — ${esc(ASKS[cur.k][1])}`;
  document.getElementById('verdict').textContent = '';

  cur.pair.forEach((im, i) => {
    const el = document.getElementById('opt' + i);
    el.disabled = false;
    el.className = 'opt';
    el.innerHTML = `<img src="${url(G, im.folio)}" alt="${esc(titleOf(im.id))}" loading="lazy">
      <div class="cap"><b>${esc(titleOf(im.id))}</b>
      <span>${esc(G.traditions[im.tradition][0])}</span></div>`;
    el.onclick = () => answer(i);
  });
  paintRecord();
}

function answer(i) {
  const ok = i === cur.winner;
  const k = cur.k;
  record[k] = record[k] || { n: 0, right: 0 };
  record[k].n++; if (ok) record[k].right++;
  streak.push(ok);

  cur.pair.forEach((im, j) => {
    const el = document.getElementById('opt' + j);
    el.disabled = true;
    el.classList.add(j === cur.winner ? 'right' : 'wrong');
    el.querySelector('.cap').insertAdjacentHTML('beforeend',
      `<div class="val">${fmt(k, im.metrics[k])}</div>`);
  });

  const [a, b] = cur.pair;
  const hi = cur.pair[cur.winner], lo = cur.pair[1 - cur.winner];
  document.getElementById('verdict').innerHTML = ok
    ? `Right. <b>${esc(titleOf(hi.id))}</b> scores ${fmt(k, hi.metrics[k])} against
       ${fmt(k, lo.metrics[k])}. <a href="workbench.html?id=${hi.id}&tab=analysis">See its analysis →</a>`
    : `No — <b>${esc(titleOf(hi.id))}</b> scores higher, ${fmt(k, hi.metrics[k])} against
       ${fmt(k, lo.metrics[k])}. ${k === 'orientation_spread'
        ? 'Orientation spread is genuinely hard to see; almost every folio here sits above 0.89, so the differences are small even when they are real.'
        : k === 'attention_evenness'
        ? 'Attention evenness is the measure that most often disagrees with a first impression — a big deliberate blank drags it down.'
        : ''}
       <a href="workbench.html?id=${hi.id}&tab=analysis">See its analysis →</a>`;

  const total = Object.values(record).reduce((s, r) => s + r.n, 0);
  const right = Object.values(record).reduce((s, r) => s + r.right, 0);
  document.getElementById('scoreline').textContent = `${right} / ${total}`;
  paintStreak();
  paintRecord();
}

function paintStreak() {
  document.getElementById('streak').innerHTML =
    streak.slice(-30).map(v => `<i class="${v ? 'y' : 'n'}"></i>`).join('');
}

function paintRecord() {
  const rows = METRICS.filter(([k]) => ASKS[k]).map(([k, label]) => {
    const r = record[k];
    return `<tr><td>${esc(label)}</td>
      <td class="mono">${r ? `${r.right}/${r.n}` : '—'}</td>
      <td class="dim" style="font-size:.72rem">${esc(ASKS[k][1])}</td></tr>`;
  }).join('');
  document.getElementById('record').innerHTML =
    `<tr><th>Measure</th><th>You</th><th>What it asks you to see</th></tr>${rows}`;
}

(async function main() {
  G = await loadGallery('.');
  document.getElementById('nav').innerHTML = topbar('assay.html', '.');
  document.getElementById('next').onclick = render;
  render();
  window.__assay = { G, record, get cur() { return cur; } };
})();
