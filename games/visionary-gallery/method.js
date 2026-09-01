// Method page. Every figure quoted here is read from the generated JSON at load
// time — nothing on this page is a number someone typed.

import { loadGallery, esc, titleOf, topbar, METRICS } from './shared/gal.js?v=3';

(async function main() {
  const G = await loadGallery('.');
  const HM = await fetch('./data/hand_vs_machine.json?v=1').then(r => r.json());
  document.getElementById('nav').innerHTML = topbar('method.html', '.');

  /* --- metric table --- */
  document.getElementById('metrics').innerHTML =
    `<tr><th>Measure</th><th>What it is</th><th>Corpus range</th><th>Highest</th></tr>` +
    METRICS.map(([k, label]) => {
      const r = G.range[k];
      const top = G.images.reduce((a, b) => (b.metrics[k] ?? -1) > (a.metrics[k] ?? -1) ? b : a);
      const f = v => k === 'chroma_mean' ? v.toFixed(1) : v.toFixed(3);
      return `<tr><td><b>${label}</b></td><td>${esc(G.metric_notes[k])}</td>
        <td class="mono">${f(r.min)} – ${f(r.max)}<br><span class="dim">mean ${f(r.mean)}</span></td>
        <td><a href="workbench.html?id=${top.id}&tab=analysis">${esc(titleOf(top.id))}</a></td></tr>`;
    }).join('');

  /* --- disagreement 1: attention evenness --- */
  const byEven = [...G.images].sort((a, b) => b.metrics.attention_evenness - a.metrics.attention_evenness);
  const yz = G.byId['bustan-yusuf-zulaykha'];
  const rank = byEven.findIndex(i => i.id === yz.id) + 1;
  document.getElementById('even-fig').innerHTML =
    `Yūsuf fleeing Zulaykha scores <b class="mono">${yz.metrics.attention_evenness.toFixed(3)}</b>,
     which ranks it <b>${rank}th of ${G.images.length}</b> — below the corpus mean of
     <span class="mono">${G.range.attention_evenness.mean.toFixed(3)}</span>. The most evenly
     attended folio in the corpus is
     <a href="workbench.html?id=${byEven[0].id}&tab=analysis">${esc(titleOf(byEven[0].id))}</a>
     at <span class="mono">${byEven[0].metrics.attention_evenness.toFixed(3)}</span>, and the
     least is <a href="workbench.html?id=${byEven.at(-1).id}&tab=analysis">${esc(titleOf(byEven.at(-1).id))}</a>
     at <span class="mono">${byEven.at(-1).metrics.attention_evenness.toFixed(3)}</span>.`;

  /* --- disagreement 2: machine vs hand --- */
  const c2 = HM.coverage['iou>=0.2'], c3 = HM.coverage['iou>=0.3'];
  document.getElementById('hm-figs').innerHTML = `
    <div><span class="big">${(c2.share * 100).toFixed(0)}%</span>
      <span>of hand regions found at IoU ≥ 0.2 (${c2.matched_hand_regions} of ${c2.of_hand_total})</span></div>
    <div><span class="big">${(c3.share * 100).toFixed(0)}%</span>
      <span>found at IoU ≥ 0.3 — ${c3.matched_hand_regions} of ${c3.of_hand_total}</span></div>
    <div><span class="big">ρ ${HM.ordering.spearman_rho.toFixed(2)}</span>
      <span>rank correlation between machine score and hand rung, n = ${HM.ordering.n_pairs},
            p = ${HM.ordering.p_value}</span></div>`;

  document.getElementById('hm-text').innerHTML =
    `The real figure is not two thirds either way. On <b>ordering</b> the heuristic does well:
     Spearman ρ = <b>${HM.ordering.spearman_rho.toFixed(3)}</b> (p = ${HM.ordering.p_value})
     between its layer score and the hand-argued rung, on the ${HM.ordering.n_pairs} regions
     where the two decompositions overlap. ${esc(HM.ordering.expected_sign[0].toUpperCase() + HM.ordering.expected_sign.slice(1))}.
     On <b>finding</b> it does badly: it proposed ${HM.machine_regions} regions against
     ${HM.hand_regions} hand-drawn ones and matched only
     ${c2.matched_hand_regions} of them at a loose threshold, ${c3.matched_hand_regions} at a
     strict one.`;

  document.getElementById('hm-missed').textContent =
    `${HM.missed_by_machine.length} hand regions were missed entirely, among them: ` +
    HM.missed_by_machine.slice(0, 10).join(', ') + '.';

  /* --- confusion matrix --- */
  const conf = HM.confusion_layer_by_rung;
  const max = Math.max(...conf.flat());
  document.getElementById('conf').innerHTML =
    `<tr><th></th>${HM.rung_names.map(n => `<th>${esc(n)}</th>`).join('')}</tr>` +
    conf.map((row, li) => `<tr><th style="text-align:right">layer ${conf.length - 1 - li}</th>` +
      row.map(v => `<td class="${v === 0 ? 'z' : (v >= max ? 'hot' : '')}">${v || '·'}</td>`).join('') +
      '</tr>').reverse().join('');

  window.__method = { G, HM };
})();
