// Prototype B — "The Impossible Stack".
//
// THE MECHANISM (one rule, inspectable, deterministic):
//
//   Every element of the folio is a flat quad. Its depth is its cosmological
//   rung, not its perspective. To keep the picture intact, each quad is scaled
//   and offset about the STATION POINT by k = (D + depth) / D, where D is the
//   station point's distance. Under that compensation a perspective camera
//   sitting exactly at the station point projects the exploded stack onto the
//   identical image as the flat painting — pixel for pixel, at any explode value.
//
//   So the picture is not a picture: it is a solid that only coheres from one
//   place to stand. Step off that point by a degree and the palace comes apart
//   into seven strata. That is the argument the painting makes about ascent,
//   restated as a projection property rather than as an illustration of one.
//
// LIGHTING: none. Every material is MeshBasicMaterial, because the folio has no
// modelled light anywhere. The single exception is Yusuf's flame-halo, which is
// additively blended — the only light source in the picture is the only light
// source in the scene.
//
// Camera contract:
//   projection   perspective, fov 34, near 0.1, far 400   (owned by this scene)
//   positionMode station-locked | orbit-offset | climb (authored ladder path)
//   upMode       world (+Y) — the folio has a page-up, and it never changes
//   inputMode    orbit-offset, clamped
//   handoff      one lerp/slerp stage, no follow smoother layered on top
//
// Determinism: no Math.random anywhere. Per-panel drift comes from hash32(id).

import * as THREE from '../vendor/three.module.js';
import { loadPalace, renderCard, spriteURL, easeOut, clamp } from '../shared/data.js?v=2';

/* ------------------------------------------------------------ constants ---- */

const FOV = 34, NEAR = 0.1, FAR = 400;
const PAGE_H = 10;                       // folio height in world units
const STATION_D = PAGE_H / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2))) * 1.02;
const RUNG_GAP = 2.0;                    // world units between rungs at explode = 1
const LIFT = 0.55;                       // how far a selected panel comes forward

const stage = document.getElementById('stage');
const readout = document.getElementById('readout');

/* ----------------------------------------------------------------- setup --- */

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#16151a');

const camera = new THREE.PerspectiveCamera(FOV, 1, NEAR, FAR);
camera.position.set(0, 0, STATION_D);

const root = new THREE.Group();
scene.add(root);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

/* ------------------------------------------------------------- state ------ */

const view = {
  mode: 'station',            // station | orbit | climb
  yaw: 0, pitch: 0, dolly: 0, // orbit offsets
  climbT: 0,
  explode: 0, drift: 0,
  dbgRung: false, dbgWire: false,
};

const transition = { active: false, t: 0, dur: 1.1,
                     fromPos: new THREE.Vector3(), fromQuat: new THREE.Quaternion() };

let palace, panels = [], selected = null, shelves = [], backdrop = null;

/* -------------------------------------------------- deterministic hash ----- */

function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
/** Two stable pseudo-randoms in [-1,1] for one id. */
function driftVec(id) {
  const h = hash32(id);
  return [((h & 0xffff) / 0xffff) * 2 - 1, (((h >>> 16) & 0xffff) / 0xffff) * 2 - 1];
}

/* ------------------------------------------------------------- geometry ---- */

function buildPanels() {
  const loader = new THREE.TextureLoader();
  const aspect = palace.source.dimensions[0] / palace.source.dimensions[1];
  const pageW = PAGE_H * aspect;

  const nodes = palace.nodes.filter(n => n.role !== 'frame');
  // Painter's order: big surfaces behind, doors and figures in front, so that
  // at explode = 0 the coplanar quads resolve the way the folio does.
  const ordered = [...nodes].sort((a, b) => (b.norm[2] * b.norm[3]) - (a.norm[2] * a.norm[3]));

  ordered.forEach((node, i) => {
    const [nx, ny, nw, nh] = node.norm;
    const w = nw * pageW, h = nh * PAGE_H;
    const cx = (nx + nw / 2 - 0.5) * pageW;
    const cy = (0.5 - (ny + nh / 2)) * PAGE_H;

    const tex = loader.load(spriteURL(palace, node));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const isHalo = node.id === 'yusuf-halo';
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      toneMapped: false,
      transparent: isHalo,
      blending: isHalo ? THREE.AdditiveBlending : THREE.NormalBlending,
      opacity: isHalo ? 0.85 : 1,
      depthWrite: !isHalo,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);

    // Coplanar quads at explode = 0 would z-fight; a fixed per-index polygon
    // offset resolves them in painter order without any depth jitter.
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -i * 0.6;
    mat.polygonOffsetUnits = -i * 0.6;

    // Gold selection edge: a slightly larger unlit quad behind the panel.
    const edge = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 0xc99a2e, toneMapped: false })
    );
    edge.visible = false;
    edge.position.z = -0.004;
    mesh.add(edge);

    mesh.userData = { node, cx, cy, w, h, edge, baseMap: tex, index: i };
    root.add(mesh);
    panels.push(mesh);
  });

  // The page itself: the whole folio as a plate behind everything. At explode = 0
  // it fills the gaps our 41 crops do not tile, so the recomposition is complete;
  // as the strata lift off it recedes and stays legible as the substrate they came
  // from. It is the ground of the picture, so it sits below the lowest rung.
  {
    const tex = loader.load(`${palace.base}/${palace.source.full_image}`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    );
    // The folio crop is slightly inset from the page; nudge to cover the bleed.
    backdrop.userData = { node: palace.byId['folio-full'], cx: 0, cy: 0,
                          w: pageW * 1.004, h: PAGE_H * 1.004, index: -1,
                          edge: { visible: false, scale: { set() {} } } };
    root.add(backdrop);
  }

  // Rung shelves — faint coloured planes marking each stratum in exploded view.
  palace.rungs.forEach(r => {
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(pageW * 1.9, PAGE_H * 1.7),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(r.colour), transparent: true,
                                    opacity: 0.06, depthWrite: false, side: THREE.DoubleSide,
                                    toneMapped: false })
    );
    g.userData.rung = r;
    g.visible = false;
    root.add(g);
    shelves.push(g);
  });

  return pageW;
}

function layout() {
  const e = view.explode;
  for (const m of panels) {
    const n = m.userData.node;
    const [dx, dy] = driftVec(n.id);
    const depth = -(n.rung_n * RUNG_GAP) * e;
    // Drift is a lateral spread *within* a rung, applied in the compensated
    // frame so it also vanishes at explode = 0.
    const spread = view.drift * e * 0.55;
    const u = m.userData;
    const z = depth + (m === selected ? LIFT : 0);
    const k = (STATION_D - z) / STATION_D;
    m.position.set((u.cx + dx * spread) * k, (u.cy + dy * spread) * k, z);
    m.scale.set(u.w * k, u.h * k, 1);
    m.userData.edge.visible = (m === selected) || view.dbgWire;
    m.userData.edge.scale.set(1 + 0.06 / u.w, 1 + 0.06 / u.h, 1);
  }
  if (backdrop) {
    const u = backdrop.userData;
    // Behind the deepest rung at every explode value, so the strata always
    // float in front of the page rather than behind it.
    const z = -0.55 - (palace.rungs.length - 1) * RUNG_GAP * e;
    const k = (STATION_D - z) / STATION_D;
    backdrop.position.set(0, 0, z);
    backdrop.scale.set(u.w * k, u.h * k, 1);
    backdrop.material.opacity = 1;
  }
  shelves.forEach((g, i) => {
    g.visible = e > 0.08;
    const z = -(i * RUNG_GAP) * e - 0.35;
    const k = (STATION_D - z) / STATION_D;
    g.position.set(0, 0, z);
    g.scale.setScalar(k);
    g.material.opacity = 0.055 * Math.min(1, e * 2.2);
  });
}

/* ------------------------------------------------------------ debug view --- */

function applyDebug() {
  for (const m of panels) {
    const n = m.userData.node;
    if (view.dbgRung) {
      m.material.map = null;
      m.material.color = new THREE.Color(palace.rungById[n.rung].colour);
    } else {
      m.material.map = m.userData.baseMap;
      m.material.color = new THREE.Color(0xffffff);
    }
    m.material.needsUpdate = true;
  }
}

/* --------------------------------------------------------------- camera --- */

const targetPos = new THREE.Vector3();
const targetQuat = new THREE.Quaternion();
const lookMat = new THREE.Matrix4();
const up = new THREE.Vector3(0, 1, 0);

function desiredCamera(out, outQ) {
  if (view.mode === 'station') {
    out.set(0, 0, STATION_D + view.dolly);
    lookMat.lookAt(out, new THREE.Vector3(0, 0, 0), up);
  } else if (view.mode === 'orbit') {
    const r = STATION_D + view.dolly;
    const cy = Math.cos(view.pitch), sy = Math.sin(view.pitch);
    out.set(Math.sin(view.yaw) * cy * r, sy * r, Math.cos(view.yaw) * cy * r);
    lookMat.lookAt(out, new THREE.Vector3(0, 0, -RUNG_GAP * 3 * view.explode), up);
  } else { // climb — an authored path up the ladder, viewed from the side
    const rung = view.climbT * (palace.rungs.length - 1);
    const z = -rung * RUNG_GAP * Math.max(view.explode, 0.25);
    const y = (view.climbT - 0.5) * PAGE_H * 0.55;
    const r = STATION_D * 0.62;
    out.set(Math.sin(view.yaw + 0.9) * r, y + 1.2, Math.cos(view.yaw + 0.9) * r + z);
    lookMat.lookAt(out, new THREE.Vector3(0, y, z), up);
  }
  outQ.setFromRotationMatrix(lookMat);
}

function setMode(mode) {
  if (mode === view.mode) return;
  transition.fromPos.copy(camera.position);
  transition.fromQuat.copy(camera.quaternion);
  transition.active = true;
  transition.t = 0;
  view.mode = mode;
  for (const id of ['station', 'orbit', 'climb']) {
    document.getElementById('mode-' + id).classList.toggle('active', id === mode);
  }
}

/* --------------------------------------------------------------- input ---- */

let dragging = false, lastX = 0, lastY = 0, moved = 0;

renderer.domElement.addEventListener('pointerdown', e => {
  dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  lastX = e.clientX; lastY = e.clientY;
  moved += Math.abs(dx) + Math.abs(dy);
  if (view.mode === 'station' && moved > 6) setMode('orbit');
  view.yaw -= dx * 0.0042;
  view.pitch = clamp(view.pitch - dy * 0.0034, -1.15, 1.15);
});
renderer.domElement.addEventListener('pointerup', e => {
  dragging = false;
  renderer.domElement.releasePointerCapture(e.pointerId);
  if (moved < 6) pick(e);
});
renderer.domElement.addEventListener('wheel', e => {
  e.preventDefault();
  view.dolly = clamp(view.dolly + e.deltaY * 0.012, -STATION_D * 0.55, STATION_D * 1.6);
}, { passive: false });

function pick(e) {
  const r = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  let hits = raycaster.intersectObjects(panels, false);
  if (!hits.length && backdrop) {
    // Nothing cut out was hit — fall through to the page itself.
    const bg = raycaster.intersectObject(backdrop, false);
    if (bg.length) { selected = null; renderCard(palace, backdrop.userData.node, readout); return; }
  }
  if (!hits.length) { selected = null; readout.innerHTML = ''; return; }
  // Front-most in painter order wins where quads are coplanar.
  hits.sort((a, b) => (a.distance - b.distance) || (b.object.userData.index - a.object.userData.index));
  selected = hits[0].object;
  renderCard(palace, selected.userData.node, readout);
}

/* ------------------------------------------------------------------ HUD --- */

function wireHUD() {
  const ex = document.getElementById('explode'), exv = document.getElementById('explode-v');
  const dr = document.getElementById('drift'), drv = document.getElementById('drift-v');
  ex.addEventListener('input', () => {
    view.explode = ex.value / 100; exv.textContent = ex.value;
    if (view.explode > 0.02 && view.mode === 'station') { /* stay: the point of the demo */ }
  });
  dr.addEventListener('input', () => { view.drift = dr.value / 100; drv.textContent = dr.value; });

  document.getElementById('mode-station').onclick = () => { setMode('station'); view.yaw = view.pitch = 0; };
  document.getElementById('mode-orbit').onclick = () => setMode('orbit');
  document.getElementById('mode-climb').onclick = () => setMode('climb');
  document.getElementById('reset').onclick = () => {
    view.yaw = view.pitch = view.dolly = 0; view.climbT = 0; setMode('station');
    selected = null; readout.innerHTML = '';
  };
  document.getElementById('dbg-rung').onclick = ev => {
    view.dbgRung = !view.dbgRung; ev.target.classList.toggle('active', view.dbgRung); applyDebug();
  };
  document.getElementById('dbg-wire').onclick = ev => {
    view.dbgWire = !view.dbgWire; ev.target.classList.toggle('active', view.dbgWire);
  };

  const lad = document.getElementById('ladder');
  lad.innerHTML = '';
  palace.rungs.forEach(r => {
    const d = document.createElement('div');
    d.style.borderLeftColor = r.colour;
    d.innerHTML = `${r.name} <small>${r.gloss.split('—')[0].trim().slice(0, 44)}</small>`;
    lad.appendChild(d);
  });
}

/* ------------------------------------------------------------------ loop --- */

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();      // required on every aspect change
}
addEventListener('resize', resize);

let prev = performance.now();
function frame(now) {
  const dt = Math.min((now - prev) / 1000, 0.05);
  prev = now;

  if (view.mode === 'climb') view.climbT = (view.climbT + dt * 0.075) % 1;

  layout();
  desiredCamera(targetPos, targetQuat);

  if (transition.active) {
    // One interpolation stage only — no follow smoother stacked on top.
    transition.t = Math.min(1, transition.t + dt / transition.dur);
    const t = easeOut(transition.t);
    camera.position.lerpVectors(transition.fromPos, targetPos, t);
    camera.quaternion.slerpQuaternions(transition.fromQuat, targetQuat, t);
    if (transition.t >= 1) transition.active = false;
  } else {
    const a = 1 - Math.exp(-9 * dt);
    camera.position.lerp(targetPos, a);
    camera.quaternion.slerp(targetQuat, a);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ boot --- */

(async function main() {
  palace = await loadPalace('..');
  buildPanels();
  wireHUD();
  resize();
  layout();
  desiredCamera(targetPos, targetQuat);
  camera.position.copy(targetPos);
  camera.quaternion.copy(targetQuat);
  requestAnimationFrame(frame);

  window.__yusufB = {
    view, palace, panels, camera, scene,
    STATION_D, RUNG_GAP,
    /** Assert the station-point invariant: at explode=e, from the station point,
     *  every panel's screen-space box must match its explode=0 box. */
    checkStationInvariant(e = 1, tol = 0.0015) {
      const save = { explode: view.explode, drift: view.drift, mode: view.mode, sel: selected };
      const shots = {};
      const measure = () => {
        layout();
        const c = new THREE.PerspectiveCamera(FOV, camera.aspect, NEAR, FAR);
        c.position.set(0, 0, STATION_D); c.lookAt(0, 0, 0); c.updateMatrixWorld();
        const out = {};
        for (const m of panels) {
          const v = new THREE.Vector3(m.position.x + m.scale.x / 2,
                                      m.position.y + m.scale.y / 2, m.position.z);
          v.project(c);
          out[m.userData.node.id] = [v.x, v.y];
        }
        return out;
      };
      // Drift deliberately breaks the invariant; zero it for the check.
      selected = null; view.drift = 0;
      view.explode = 0; shots.flat = measure();
      view.explode = e;  shots.deep = measure();
      let worst = 0, worstId = null;
      for (const id in shots.flat) {
        const d = Math.hypot(shots.flat[id][0] - shots.deep[id][0],
                             shots.flat[id][1] - shots.deep[id][1]);
        if (d > worst) { worst = d; worstId = id; }
      }
      Object.assign(view, { explode: save.explode, drift: save.drift });
      selected = save.sel; layout();
      return { pass: worst <= tol, worst, worstId, tol, panels: panels.length };
    }
  };
})();
