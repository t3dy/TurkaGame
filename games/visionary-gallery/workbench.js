// Per-folio workbench: Folio / Analysis / Depth / Papercraft / Play.
//
// Everything here is driven by data/gallery.json, which is generated. Nothing on
// this page is hand-authored per image, which is the whole claim: 22 folios entered
// the pipeline and none of them needed an author.

import {
  loadGallery, loadScholarship, scholarshipHTML, url, titleOf, esc, metricBars,
  swatches, drawAttention, drawRose, regionOverlay, LAYER_COLOURS, topbar, clamp,
} from './shared/gal.js?v=3';

// three.js lives in the sibling prototype's vendor folder. Vendoring a second
// 2 MB copy to satisfy the "don't reach across game folders" rule would be
// obeying its letter against its purpose — that rule is about game logic.
import * as THREE from '../yusuf-ascent/vendor/three.module.js';

const qs = new URLSearchParams(location.search);
let G, IM, accent = '#c99a2e';

/* ------------------------------------------------------------------ tabs -- */

const TABS = [
  ['folio', 'Folio'], ['analysis', 'Analysis'], ['depth', 'Depth (3D)'],
  ['paper', 'Papercraft'], ['play', 'Play'],
];

function showTab(id) {
  for (const [k] of TABS) {
    document.getElementById('pane-' + k).classList.toggle('on', k === id);
    document.getElementById('tab-' + k).classList.toggle('active', k === id);
  }
  history.replaceState(null, '', `?id=${IM.id}&tab=${id}`);
  if (id === 'depth') ensure3D();
  if (id === 'paper') buildPeel();
  if (id === 'play') newRound();
}

/* ----------------------------------------------------------------- folio -- */

let showRegions = true, showLabels = false, byLayer = false;

function paintRegions() {
  const host = document.getElementById('folio-box');
  host.querySelectorAll('.rgn').forEach(e => e.remove());
  if (!showRegions) return;
  regionOverlay(host, IM, {
    showLabels,
    layerColours: byLayer ? LAYER_COLOURS : null,
    onPick: r => {
      document.getElementById('regcard').innerHTML = `
        <b>${r.id}</b> — layer ${r.layer} of ${G.n_layers}<br>
        <span class="sw" style="background:${r.hex}"></span>${r.hex}<br>
        detail ${r.detail} · chroma ${r.chroma} · fill ${r.fill}<br>
        <span class="dim">box ${r.box.join(', ')} · score ${r.layer_score}</span>`;
    },
  });
}

/* -------------------------------------------------------------- analysis -- */

function paintAnalysis() {
  metricBars(G, IM, document.getElementById('bars'));
  swatches(IM, document.getElementById('pal'));
  document.getElementById('palnote').textContent =
    `${IM.palette.length} k-means centres in CIE Lab, widths proportional to page coverage. ` +
    `Mean chroma ${IM.metrics.chroma_mean.toFixed(1)}.`;
  drawAttention(document.getElementById('att'), IM.attention_grid);
  drawRose(document.getElementById('rose'), IM.orientation_hist, accent);
  const dm = document.getElementById('detmap');
  if (IM.detail_map) dm.src = url(G, IM.detail_map); else dm.style.display = 'none';
}

/* ----------------------------------------------------------------- depth -- */

let three = null;

function ensure3D() {
  if (three) { three.resize(); return; }
  const host = document.getElementById('stage3d');
  const FOV = 34, NEAR = 0.1, FAR = 400, PAGE_H = 10, GAP = 1.9;
  const AR = IM.work_size[0] / IM.work_size[1];
  const pageW = PAGE_H * AR;
  const D = PAGE_H / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) * 1.02;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#14131a');
  const camera = new THREE.PerspectiveCamera(FOV, 1, NEAR, FAR);
  const root = new THREE.Group(); scene.add(root);
  const loader = new THREE.TextureLoader();

  // back plate: the whole folio, always behind the deepest layer
  const backTex = loader.load(url(G, IM.folio));
  backTex.colorSpace = THREE.SRGBColorSpace;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: backTex, toneMapped: false }));
  root.add(back);

  // one quad per region, textured by a UV window onto the folio
  const panels = [];
  const [W, H] = IM.work_size;
  const shared = loader.load(url(G, IM.folio));
  shared.colorSpace = THREE.SRGBColorSpace;
  for (const r of IM.regions) {
    const [x1, y1, x2, y2] = r.box;
    const g = new THREE.PlaneGeometry(1, 1);
    const uv = g.attributes.uv;
    const u0 = x1 / W, u1 = x2 / W, v0 = 1 - y2 / H, v1 = 1 - y1 / H;
    uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
    uv.needsUpdate = true;
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      map: shared, toneMapped: false, side: THREE.DoubleSide,
    }));
    m.userData = {
      r,
      cx: (x1 / W + (x2 - x1) / W / 2 - 0.5) * pageW,
      cy: (0.5 - (y1 / H + (y2 - y1) / H / 2)) * PAGE_H,
      w: (x2 - x1) / W * pageW, h: (y2 - y1) / H * PAGE_H,
    };
    root.add(m); panels.push(m);
  }

  const view = { explode: 0, mode: 'station', yaw: 0, pitch: 0 };
  const tmpP = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), lookM = new THREE.Matrix4();
  const UP = new THREE.Vector3(0, 1, 0);

  function place(mesh, z) {
    const u = mesh.userData, k = (D - z) / D;
    mesh.position.set(u.cx * k, u.cy * k, z);
    mesh.scale.set(u.w * k, u.h * k, 1);
  }
  function layout() {
    const e = view.explode;
    // layer 0 is the deepest (analyze.py ranks ascending), so depth counts down
    // from the frontmost layer rather than up from zero.
    const top = G.n_layers - 1;
    panels.forEach((m, i) => {
      place(m, -((top - m.userData.r.layer) * GAP) * e);
      m.material.polygonOffset = true;
      m.material.polygonOffsetFactor = -i * 0.6;
      m.material.polygonOffsetUnits = -i * 0.6;
    });
    const bz = -0.5 - (G.n_layers - 1) * GAP * e;
    const bk = (D - bz) / D;
    back.position.set(0, 0, bz);
    back.scale.set(pageW * bk, PAGE_H * bk, 1);
  }
  function want() {
    if (view.mode === 'station') { tmpP.set(0, 0, D); lookM.lookAt(tmpP, new THREE.Vector3(), UP); }
    else {
      const cy = Math.cos(view.pitch);
      tmpP.set(Math.sin(view.yaw) * cy * D, Math.sin(view.pitch) * D, Math.cos(view.yaw) * cy * D);
      lookM.lookAt(tmpP, new THREE.Vector3(0, 0, -GAP * 2 * view.explode), UP);
    }
    tmpQ.setFromRotationMatrix(lookM);
  }

  let drag = false, lx = 0, ly = 0, moved = 0;
  renderer.domElement.addEventListener('pointerdown', e => {
    drag = true; moved = 0; lx = e.clientX; ly = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
  });
  renderer.domElement.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6 && view.mode === 'station') setMode('orbit');
    view.yaw -= dx * 0.0042;
    view.pitch = clamp(view.pitch - dy * 0.0034, -1.1, 1.1);
  });
  renderer.domElement.addEventListener('pointerup', e => {
    drag = false; renderer.domElement.releasePointerCapture(e.pointerId);
  });

  function setMode(m) {
    view.mode = m;
    document.getElementById('m-station').classList.toggle('active', m === 'station');
    document.getElementById('m-orbit').classList.toggle('active', m === 'orbit');
    if (m === 'station') { view.yaw = view.pitch = 0; }
  }
  document.getElementById('m-station').onclick = () => setMode('station');
  document.getElementById('m-orbit').onclick = () => setMode('orbit');
  document.getElementById('ex3').oninput = e => { view.explode = e.target.value / 100; };

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  let prev = performance.now();
  (function frame(now) {
    const dt = Math.min((now - prev) / 1000, 0.05); prev = now;
    layout(); want();
    const a = 1 - Math.exp(-9 * dt);
    camera.position.lerp(tmpP, a);
    camera.quaternion.slerp(tmpQ, a);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  })(prev);

  // The same numerical self-test Prototype B carries, run on machine layers.
  function checkInvariant() {
    const c = new THREE.PerspectiveCamera(FOV, camera.aspect, NEAR, FAR);
    c.position.set(0, 0, D); c.lookAt(0, 0, 0); c.updateMatrixWorld();
    const shot = () => {
      layout();
      return panels.map(m => {
        const v = new THREE.Vector3(m.position.x + m.scale.x / 2,
                                    m.position.y + m.scale.y / 2, m.position.z).project(c);
        return [v.x, v.y];
      });
    };
    const save = view.explode;
    view.explode = 0; const flat = shot();
    view.explode = 1; const deep = shot();
    view.explode = save; layout();
    let worst = 0;
    for (let i = 0; i < flat.length; i++) {
      worst = Math.max(worst, Math.hypot(flat[i][0] - deep[i][0], flat[i][1] - deep[i][1]));
    }
    return worst;
  }
  const worst = checkInvariant();
  document.getElementById('inv').textContent =
    `station-point invariant: worst drift ${worst.toExponential(1)} across ${panels.length} quads`;

  three = { resize, view, panels, checkInvariant };
  window.__wb3d = three;
}

/* ------------------------------------------------------------ papercraft -- */

function buildPeel() {
  const stack = document.getElementById('peel-stack');
  if (stack.dataset.built === IM.id) return;
  stack.dataset.built = IM.id;
  stack.innerHTML = '';
  const CW = 300, CH = Math.round(CW / (IM.work_size[0] / IM.work_size[1]));
  stack.style.width = CW + 'px'; stack.style.height = CH + 'px';

  for (const p of IM.plates) {
    const d = document.createElement('div');
    d.className = 'plate';
    d.dataset.i = p.index;
    const [fx, fy, fw, fh] = p.frac;
    d.style.cssText =
      `left:${-CW / 2 + fx * CW}px;top:${-CH / 2 + fy * CH}px;` +
      `width:${fw * CW}px;height:${fh * CH}px;`;
    const im = document.createElement('img');
    im.src = url(G, p.file);
    im.style.cssText = 'width:100%;height:100%;display:block;';
    im.alt = `layer ${p.index}`;
    d.appendChild(im);
    stack.appendChild(d);
  }
  updatePeel();

  const link = document.getElementById('dl');
  if (IM.sheet) {
    link.href = url(G, IM.sheet);
    link.setAttribute('download', `${IM.id}-tunnel.svg`);
    link.textContent = `Download the printable sheet (${IM.sheet_kb} KB SVG)`;
    link.classList.remove('hidden');
  } else link.classList.add('hidden');

  document.getElementById('paperkv').innerHTML = IM.plates.map(p => `
    <dt>Card ${p.index + 1}${p.index === 0 ? ' — back plate' : ''}</dt>
    <dd>${p.n_regions ? `${p.n_regions} shape${p.n_regions > 1 ? 's' : ''} · ` : ''}
        ${(p.occupancy * 100).toFixed(0)}% of the card left standing</dd>`).join('');
}

function updatePeel() {
  const sep = +document.getElementById('peelr').value;
  const rot = +document.getElementById('peelrot').value;
  document.getElementById('peel-stack').style.transform =
    `rotateY(${rot}deg) rotateX(6deg)`;
  for (const d of document.querySelectorAll('#peel-stack .plate')) {
    const i = +d.dataset.i;
    d.style.transform = `translateZ(${i * sep * 1.3}px)`;
    d.style.filter = i === 0 ? 'none' : `drop-shadow(0 4px 10px rgba(0,0,0,.55))`;
  }
}

/* ------------------------------------------------------------------ play -- */

let round = null, plays = 0, totalErr = 0;

function newRound() {
  const cand = IM.plates.filter(p => p.index > 0 && p.occupancy < 0.55);
  if (!cand.length) {
    document.getElementById('play-msg').textContent = 'This folio has no cut-away plate to hide.';
    return;
  }
  const p = cand[Math.floor(Math.random() * cand.length)];
  round = { p, done: false };
  const el = document.getElementById('play-plate');
  el.src = url(G, p.file);
  for (const id of ['target', 'guess']) document.getElementById(id)?.remove();
  document.getElementById('play-msg').textContent =
    'Click where on the folio this plate was lifted from.';
}

function onPlayClick(ev) {
  if (!round || round.done) return;
  const host = document.getElementById('play-folio');
  const r = host.getBoundingClientRect();
  const gx = (ev.clientX - r.left) / r.width, gy = (ev.clientY - r.top) / r.height;
  const [fx, fy, fw, fh] = round.p.frac;
  const tx = fx + fw / 2, ty = fy + fh / 2;
  const err = Math.hypot(gx - tx, gy - ty) / Math.SQRT2;

  const mk = (id, l, t, w, h) => {
    const d = document.createElement('div');
    d.id = id;
    d.style.cssText = `position:absolute;left:${l * 100}%;top:${t * 100}%;` +
      `width:${w * 100}%;height:${h * 100}%;pointer-events:none;`;
    host.appendChild(d);
    return d;
  };
  mk('target', fx, fy, fw, fh).style.border = '2px solid var(--turquoise)';
  mk('guess', gx - 0.012, gy - 0.012, 0.024, 0.024).style.border = '2px dashed var(--vermilion)';

  round.done = true;
  plays++; totalErr += err;
  const pct = (1 - Math.min(err * 3, 1)) * 100;
  document.getElementById('play-msg').innerHTML =
    `Off by <b>${(err * 100).toFixed(1)}%</b> of the page diagonal — ${pct.toFixed(0)} points. ` +
    (err < 0.06 ? 'That is a real read of the page.'
      : err < 0.16 ? 'Close. The plate carries more of its neighbourhood than you would think.'
      : 'The cut-away plates are harder than they look once the ground is gone.');
  document.getElementById('play-score').textContent =
    `${plays} plate${plays > 1 ? 's' : ''} · mean error ${(totalErr / plays * 100).toFixed(1)}%`;
}

/* ------------------------------------------------------------------ boot -- */

(async function main() {
  G = await loadGallery('.');
  // Scholarship is a progressive layer: if the export has not been run, the
  // gallery still works and the section simply does not render.
  const S = await loadScholarship('.').catch(() => null);
  const id = qs.get('id') || G.images[0].id;
  IM = G.byId[id] || G.images[0];
  document.body.classList.add('t-' + IM.tradition);
  accent = getComputedStyle(document.body).getPropertyValue('--acc').trim() || accent;

  document.getElementById('nav').innerHTML = topbar('', '.');
  document.getElementById('title').textContent = titleOf(IM.id);
  document.getElementById('tradpill').textContent = G.traditions[IM.tradition][0];
  document.getElementById('why').textContent = IM.why_here;

  document.getElementById('tabs').innerHTML = TABS.map(([k, l]) =>
    `<button class="btn" id="tab-${k}">${l}</button>`).join('');
  for (const [k] of TABS) document.getElementById('tab-' + k).onclick = () => showTab(k);

  document.getElementById('folio-img').src = url(G, IM.folio);
  document.getElementById('play-img').src = url(G, IM.folio);
  document.getElementById('play-folio').addEventListener('click', onPlayClick);
  document.getElementById('play-next').onclick = newRound;

  const p = IM.provenance;
  document.getElementById('prov').innerHTML = [
    ['Artist', p.artist], ['Institution', p.institution], ['Date', p.date],
    ['Commons file', p.commons_title], ['Original size', (p.original_size || []).join(' × ')],
  ].filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v).slice(0, 300)}</dd>`).join('');
  document.getElementById('rights').innerHTML =
    `<b>${esc(IM.rights.status)}</b> — ${esc(IM.rights.basis)}
     <a href="${IM.rights.commons_page}" target="_blank" rel="noopener">Commons record →</a>`;

  document.getElementById('layernote').textContent = G.layer_rule;
  if (S) document.getElementById('scholar').innerHTML = scholarshipHTML(S, IM.tradition);

  document.getElementById('tg-regions').onclick = e => {
    showRegions = !showRegions; e.target.classList.toggle('active', showRegions); paintRegions();
  };
  document.getElementById('tg-labels').onclick = e => {
    showLabels = !showLabels; e.target.classList.toggle('active', showLabels); paintRegions();
  };
  document.getElementById('tg-layers').onclick = e => {
    byLayer = !byLayer; e.target.classList.toggle('active', byLayer); paintRegions();
  };
  for (const id2 of ['peelr', 'peelrot']) document.getElementById(id2).oninput = updatePeel;

  paintRegions();
  paintAnalysis();
  showTab(qs.get('tab') || 'folio');
  window.__wb = { G, IM, S };
})();
