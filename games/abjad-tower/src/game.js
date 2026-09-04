// game.js — modes, scoring, the Tome, and all the wiring.
//
// Scoring follows the pattern from AlchemyBlockInvaders: XP is for *witnessing
// something you have not witnessed before*, not for repetition. Firing the same
// operation twice is worth almost nothing; discovering that Inversion topples a
// tower Strike could not is worth a lot. The Tome is the record of what you have
// learned, and it is the actual progression.

import { World, BLOCK } from './world.js';
import * as OPS from './ops.js';

const V = 'v=1';
const $ = id => document.getElementById(id);

let LETTERS = [], OPDATA = null, world = null;
let state = null, tome = null, raf = 0, last = 0;

/* --------------------------------------------------------------- the Tome -- */
// Persisted per browser. Wrapped in try/catch throughout: private windows and
// blocked site data must not break the game.

const TOME_KEY = 'abjad-tower.tome.v1';

function loadTome() {
  const empty = { seenOps: {}, seenLetters: {}, discoveries: [], xp: 0, best: {} };
  try {
    const raw = localStorage.getItem(TOME_KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch { return empty; }
}
function saveTome() {
  try { localStorage.setItem(TOME_KEY, JSON.stringify(tome)); } catch { /* fine */ }
}

/** XP only for the first sighting. Repetition is nearly worthless, by design. */
function record(key, label, points) {
  const first = !tome.discoveries.includes(key);
  tome.xp += first ? points : 1;
  if (first) {
    tome.discoveries.push(key);
    toast(`Discovered: ${label}  +${points}`, 'good');
  }
  saveTome();
  paintTome();
  return first;
}

const RANKS = [
  [0, 'Onlooker'], [40, 'Reader of Letters'], [110, 'Reckoner'],
  [220, 'Inscriber of Talismans'], [380, 'Master of the Two Orders'],
];
const rankFor = xp => RANKS.reduce((a, r) => (xp >= r[0] ? r[1] : a), RANKS[0][1]);

/* ---------------------------------------------------------------- towers -- */

function letterByGlyph(g) { return LETTERS.find(l => l.glyph === g); }

/** Deterministic PRNG so a seed reproduces a tower exactly. */
function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A tower whose lower courses are heavy and upper courses light — so it stands,
 *  and so Inversion has something real to undo. */
function buildTower(seed, courses = 7) {
  const rnd = mulberry(seed);
  const heavy = LETTERS.filter(l => l.abjad >= 60);
  const lightL = LETTERS.filter(l => l.abjad < 60);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];

  for (let c = 0; c < courses; c++) {
    // A hair of clearance per course: spawning bodies in exact contact makes the
    // solver resolve a penetration on frame one, which looks like an explosion.
    const y = BLOCK.h / 2 + c * (BLOCK.h + 0.02);
    const alt = c % 2 === 0;
    const n = 3;
    const pool = c < courses * 0.45 ? heavy : (c > courses * 0.75 ? lightL : LETTERS);
    for (let i = 0; i < n; i++) {
      // Spaced by DEPTH, so three of them span exactly the width and the course
      // is a square. The next course, laid crosswise, covers the same footprint.
      const off = (i - (n - 1) / 2) * (BLOCK.d + 0.008);
      const x = alt ? 0 : off, z = alt ? off : 0;
      world.addBlock(pick(pool), x, y, z, alt ? 0 : Math.PI / 2);
    }
  }
}

/* ----------------------------------------------------------------- modes -- */

const MODES = {
  hadm: {
    setup(s) {
      world.camOrbit.target.set(0, 1.9, 0);
      world.camOrbit.dist = 12; world.camOrbit.pitch = 0.22;
      buildTower(s.seed, 7);
      world.setTargetLine(1.9);
      s.budget = 8;
      s.instruction = 'Bring every block below the gold ring. Unspent operations score.';
    },
    check(s) {
      if (!world.isSettled()) return null;
      if (world.highestY() < 1.9) {
        return { win: true, score: 100 + s.budget * 25, why: 'The tower is below the line.' };
      }
      if (s.budget <= 0) return { win: false, why: 'Operations spent, and it still stands.' };
      return null;
    },
  },

  bina: {
    setup(s) {
      world.setTargetLine(4.4);
      s.budget = null;
      s.toPlace = 14;
      s.holdFrom = null;
      s.instruction = 'Click above the ground to drop a block. Reach the ring and hold it 5 s.';
      s.placing = true;
      // Frame the empty build volume, not the floor: the ring at 4.4 is the subject.
      world.camOrbit.target.set(0, 2.6, 0);
      world.camOrbit.dist = 15;
      world.camOrbit.pitch = 0.18;
    },
    check(s) {
      const high = world.highestY();
      if (high >= 4.4 && world.isSettled()) {
        if (s.holdFrom === null) s.holdFrom = world.time;
        const held = world.time - s.holdFrom;
        s.hold = held;
        if (held >= 5) {
          return { win: true, score: 150 + Math.max(0, (14 - (14 - s.toPlace))) * 10,
                   why: 'It reached the ring and held.' };
        }
      } else if (high < 4.4) {
        s.holdFrom = null; s.hold = 0;
      }
      if (s.toPlace <= 0 && world.isSettled() && high < 4.4) {
        return { win: false, why: 'Out of blocks, and short of the ring.' };
      }
      return null;
    },
  },

  istikhraj: {
    setup(s) {
      world.camOrbit.target.set(0, 1.9, 0);
      world.camOrbit.dist = 11; world.camOrbit.pitch = 0.18;
      buildTower(s.seed, 7);
      world.setTargetLine(2.6);
      s.budget = 6;
      // Name a letter that actually appears more than once.
      const counts = {};
      for (const b of world.liveBlocks()) counts[b.letter.glyph] = (counts[b.letter.glyph] || 0) + 1;
      const cands = Object.keys(counts).filter(g => counts[g] >= 2);
      s.targetGlyph = cands.length ? cands[Math.floor(Math.random() * cands.length)]
                                   : world.liveBlocks()[0].letter.glyph;
      s.instruction = `Remove every ${s.targetGlyph} and keep the rest above the ring.`;
    },
    check(s) {
      if (!world.isSettled()) return null;
      const left = world.liveBlocks().filter(b => b.letter.glyph === s.targetGlyph).length;
      const high = world.highestY();
      if (left === 0 && high >= 2.6) {
        return { win: true, score: 200 + s.budget * 30, why: `Every ${s.targetGlyph} gone, tower standing.` };
      }
      if (high < 2.6) return { win: false, why: 'The tower fell below the ring.' };
      if (s.budget <= 0 && left > 0) return { win: false, why: `${left} × ${s.targetGlyph} still standing.` };
      return null;
    },
  },
};

/* ---------------------------------------------------------------- actions -- */

let armed = 'darb';        // the operation the next click performs

function opCost(id) { return (OPDATA.operations.find(o => o.id === id) || {}).cost || 1; }

function spend(id) {
  if (state.budget === null) return true;
  const c = opCost(id);
  if (state.budget < c) { toast('Not enough operations left.', 'bad'); return false; }
  state.budget -= c;
  return true;
}

function afterOp(id, result) {
  if (!result) return;
  const before = state.snapshotHigh;
  state.log.unshift(result.text);
  state.log = state.log.slice(0, 6);
  paintLog();

  const meta = OPDATA.operations.find(o => o.id === id);
  record('op:' + id, `the ${meta.name}`, 15);

  // Judge the *consequence*, once the world settles — that is the thing worth
  // learning, and it is not knowable at the moment of the click.
  setTimeout(() => {
    const after = world.highestY();
    const drop = before - after;
    if (drop > 1.2) record(`fell:${id}`, `${meta.name} can bring a tower down`, 25);
    if (result.empty) record(`empty:${id}`, `${meta.name} can find nothing to act on`, 10);
    if (id === 'hisab' && result.count > 0) record('hisab:hit', 'a reckoning that lands', 30);
  }, 2600);
}

function doOp(ev) {
  if (state.done) return;
  const id = armed;

  if (state.placing && id === 'place') return;

  if (id === 'darb') {
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.strike(world, { dir: world.aimRay(ev.clientX, ev.clientY) }));
    return;
  }

  if (id === 'inversion') {
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.inversion(world, {}));
    return;
  }

  if (id === 'hisab') {
    const t = parseInt($('hisab-target').value, 10);
    if (!Number.isFinite(t) || t <= 0) { toast('Name a number first.', 'bad'); return; }
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.reckoning(world, { target: t }));
    return;
  }

  if (id === 'ism') {
    const g = $('ism-glyph').value;
    if (!g) { toast('Choose a letter first.', 'bad'); return; }
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.invokeName(world, { glyph: g }));
    return;
  }

  // tilasm / khal need a target block
  const hit = world.pick(ev.clientX, ev.clientY);
  if (!hit) { toast('Click a block to target it.', 'bad'); return; }
  record('letter:' + hit.block.letter.glyph, `the letter ${hit.block.letter.glyph}`, 5);
  if (!spend(id)) return;
  state.snapshotHigh = world.highestY();
  afterOp(id, id === 'tilasm'
    ? OPS.talisman(world, { block: hit.block })
    : OPS.doff(world, { block: hit.block }));
}

/* --------------------------------------------------------------- placing -- */

function placeBlock(ev) {
  if (state.toPlace <= 0) { toast('No blocks left.', 'bad'); return; }
  const dir = world.aimRay(ev.clientX, ev.clientY);
  const cam = world.camera.position;

  // Where does the aim ray meet the *ground*? That is the point the player is
  // pointing at. An earlier version solved for y = 8 instead, which is the plane
  // the block is dropped FROM, not the one being aimed at — so blocks landed
  // far out and it read as broken aiming.
  if (dir.y >= -1e-4) { toast('Aim at the ground, not the sky.', 'bad'); return; }
  const t = (0 - cam.y) / dir.y;
  const gx = cam.x + dir.x * t, gz = cam.z + dir.z * t;
  if (Math.hypot(gx, gz) > 5.5) { toast('Too far out — build near the centre.', 'bad'); return; }

  // Drop from just above whatever is already there, so a stack builds rather
  // than a block falling five metres onto its neighbours and scattering them.
  const dropY = Math.max(1.4, world.highestY() + 1.1);
  const letter = letterByGlyph($('place-glyph').value) || LETTERS[0];
  // Alternate orientation each placement, as a real course would.
  const rot = (state.toPlace % 2) ? Math.PI / 2 : 0;
  world.addBlock(letter, gx, dropY, gz, rot);
  state.toPlace--;
  record('letter:' + letter.glyph, `the letter ${letter.glyph}`, 5);
  paintHud();
}

/* ------------------------------------------------------------------- UI --- */

function toast(msg, kind = '') {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'show ' + kind;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.className = ''), 2600);
}

function paintHud() {
  $('mode-name').textContent = state.modeName;
  $('instruction').textContent = state.instruction;
  $('budget').textContent = state.budget === null
    ? (state.toPlace !== undefined ? `${state.toPlace} blocks` : '—')
    : `${state.budget} ops`;
  $('height').textContent = world.highestY().toFixed(2) + ' m';
  $('rank').textContent = `${rankFor(tome.xp)} · ${tome.xp} XP`;
  const hold = state.hold ? ` · holding ${state.hold.toFixed(1)}s` : '';
  $('status').textContent = (world.isSettled() ? 'settled' : 'moving') + hold;
}

function paintLog() {
  $('log').innerHTML = state.log.map((l, i) =>
    `<li style="opacity:${1 - i * 0.13}">${l}</li>`).join('');
}

function paintTome() {
  const ops = OPDATA.operations.map(o => {
    const known = tome.discoveries.includes('op:' + o.id);
    return `<div class="tome-op ${known ? '' : 'unknown'}">
      <div class="th"><b>${o.name}</b> <span class="ar">${o.arabic}</span>
        <span class="pill ${o.kind}">${o.kind}</span></div>
      ${known ? `<p>${o.blurb}</p>
        <p class="why">${o.why}</p>
        ${o.quote ? `<blockquote>“${o.quote}”<cite>${o.source}</cite></blockquote>` : ''}`
        : `<p class="dim">Not yet used. Perform it once to record it here.</p>`}
    </div>`;
  }).join('');
  $('tome-ops').innerHTML = ops;
  $('tome-xp').textContent = `${rankFor(tome.xp)} — ${tome.xp} XP, ${tome.discoveries.length} discoveries`;
}

/* ----------------------------------------------------------------- loop --- */

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  world.step(dt);
  if (state && !state.done) {
    const r = MODES[state.mode].check(state);
    paintHud();
    if (r) {
      state.done = true;
      const s = r.score || 0;
      if (r.win) {
        tome.xp += 20;
        tome.best[state.mode] = Math.max(tome.best[state.mode] || 0, s);
        saveTome();
      }
      $('verdict').className = 'show ' + (r.win ? 'win' : 'lose');
      $('verdict').innerHTML = `<h2>${r.win ? 'Complete' : 'Failed'}</h2>
        <p>${r.why}</p>${r.win ? `<p class="score">${s} points</p>` : ''}
        <button class="btn" id="again">Again</button>`;
      $('again').onclick = () => startMode(state.mode);
    }
  }
  raf = requestAnimationFrame(frame);
}

/* ----------------------------------------------------------------- boot --- */

function startMode(mode) {
  world.clear();
  const md = OPDATA.modes.find(m => m.id === mode);
  state = {
    mode, modeName: md.name, log: [], done: false, hold: 0, placing: false,
    seed: (Math.random() * 1e9) | 0, snapshotHigh: 0,
  };
  MODES[mode].setup(state);
  $('verdict').className = '';
  $('place-row').classList.toggle('hidden', !state.placing);
  for (const b of document.querySelectorAll('#modes .btn'))
    b.classList.toggle('active', b.dataset.mode === mode);
  paintHud(); paintLog();
  toast(md.blurb, '');
}

(async function main() {
  const [lj, oj] = await Promise.all([
    fetch(`./data/letters.json?${V}`).then(r => r.json()),
    fetch(`./data/operations.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters;
  OPDATA = oj;
  tome = loadTome();

  world = new World($('stage'));
  addEventListener('resize', () => world.resize());

  // Operation buttons
  $('ops').innerHTML = OPDATA.operations.map(o =>
    `<button class="btn op" data-op="${o.id}" title="${o.blurb}">
       ${o.name} <small>${o.cost}</small></button>`).join('');
  for (const b of document.querySelectorAll('#ops .op')) {
    b.onclick = () => {
      armed = b.dataset.op;
      for (const x of document.querySelectorAll('#ops .op')) x.classList.toggle('active', x === b);
      $('ism-row').classList.toggle('hidden', armed !== 'ism');
      $('hisab-row').classList.toggle('hidden', armed !== 'hisab');
      const meta = OPDATA.operations.find(o => o.id === armed);
      toast(`${meta.name} — ${meta.blurb}`);
    };
  }
  document.querySelector('#ops .op').click();

  // Letter selectors
  const opts = LETTERS.map(l =>
    `<option value="${l.glyph}">${l.glyph} · ${l.name} · ${l.abjad}</option>`).join('');
  $('ism-glyph').innerHTML = opts;
  $('place-glyph').innerHTML = opts;

  // Modes
  $('modes').innerHTML = OPDATA.modes.map(m =>
    `<button class="btn" data-mode="${m.id}">${m.name} <span class="ar">${m.arabic}</span></button>`).join('');
  for (const b of document.querySelectorAll('#modes .btn')) b.onclick = () => startMode(b.dataset.mode);

  // Canvas interaction: drag orbits, click acts.
  const cv = world.renderer.domElement;
  let drag = false, moved = 0, lx = 0, ly = 0;
  cv.addEventListener('pointerdown', e => { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    world.camOrbit.yaw -= dx * 0.005;
    world.camOrbit.pitch = Math.max(-0.15, Math.min(1.2, world.camOrbit.pitch - dy * 0.004));
  });
  cv.addEventListener('pointerup', e => {
    drag = false;
    if (moved > 6) return;
    if (state.placing) placeBlock(e); else doOp(e);
  });
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    world.camOrbit.dist = Math.max(7, Math.min(34, world.camOrbit.dist + e.deltaY * 0.012));
  }, { passive: false });

  $('tome-toggle').onclick = () => $('tome').classList.toggle('open');
  $('tome-close').onclick = () => $('tome').classList.remove('open');
  $('reset-tome').onclick = () => {
    if (!confirm('Erase the Tome — every discovery and all XP?')) return;
    tome = { seenOps: {}, seenLetters: {}, discoveries: [], xp: 0, best: {} };
    saveTome(); paintTome(); paintHud();
  };

  paintTome();
  startMode('hadm');
  last = performance.now();
  raf = requestAnimationFrame(frame);

  window.__abjad = { world, OPS, get state() { return state; }, get tome() { return tome; },
                     LETTERS, startMode, findRuns: t => OPS.findRuns(world, t) };
})();
