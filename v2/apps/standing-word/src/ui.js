// ui.js — The Standing Word.
//
// A stacker. You build with gravity off and then let it in, and what holds is
// decided by the same two rules that decide everything else in v2: a written word
// is one body, and the six non-connecting letters are where it breaks. Alif holds
// a frame, so it stands on nothing and carries what is bonded to it.
//
// THE FORECAST IS THE POINT
// -------------------------
// Before you commit, the board shows what WOULD fall — arrows from every cell
// that is about to go, computed by cloning the world, switching gravity on and
// settling it. That is not a heuristic about the tower; it is the identical call
// the commit makes, run against a copy. The preview cannot be wrong about the
// collapse because it IS the collapse, thrown away.

import { World } from '../../../engine/world.js?v=4';
import { compile, execute, describeLetter } from '../../../engine/vm.js?v=4';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=4';

const V = 'v=1';
const $ = id => document.getElementById(id);

let LETTERS = [], PACK = null, LEVELS = null;
let level = null, ruleset = null, world = null, hand = [], sel = -1;
let iso = null, undoStack = [], settled = false;

/* ------------------------------------------------------------------ setup -- */

function build() {
  world = new World({ rules: { gravity: false } });
  for (const c of level.cells) world.set(c.x, c.y || 0, c.z || 0, { ...c, y: c.y || 0, z: c.z || 0 });
  hand = level.hand.slice();
  sel = hand.length ? 0 : -1;
  undoStack = [];
  settled = false;
}

function snapshot() {
  undoStack.push({ world: world.clone(), hand: hand.slice(), settled });
  if (undoStack.length > 40) undoStack.shift();
}

/** Where a letter may be written: on the ground, or beside something standing. */
function legal(x, y) {
  if (world.has(x, y, 0)) return false;
  return y === 0 || world.has(x - 1, y, 0) || world.has(x + 1, y, 0)
      || world.has(x, y - 1, 0) || world.has(x, y + 1, 0);
}

/* -------------------------------------------------------------- forecast -- */

/** What would fall. The same call the commit makes, against a clone. */
function forecast() {
  const w = world.clone();
  w.rules.gravity = true;
  const moved = w.settle();
  // One arrow per cell, from where it is now to where it ends up.
  const ends = new Map();
  for (const m of moved) {
    const from = m.from.split(',').map(Number), to = m.to.split(',').map(Number);
    const origin = ends.has(m.from) ? ends.get(m.from) : from;
    ends.delete(m.from);
    ends.set(m.to, origin);
  }
  const effects = [];
  for (const [toKey, from] of ends) {
    const to = toKey.split(',').map(Number);
    if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2]) continue;
    effects.push({ kind: 'fall', at: from, to, detail: 'would fall' });
  }
  return { effects, world: w, moved: moved.length };
}

/* ------------------------------------------------------------------- draw -- */

function draw() {
  const f = settled ? null : forecast();
  iso.frame(world, level.targets);
  iso.draw(world, f ? f.effects : null, {});
  for (const t of level.targets) {
    const held = world.get(...t);
    const ok = held && held.glyph;
    iso.markCell(t[0], t[1], t[2], ok ? PALETTE.gold : PALETTE.turq, ok ? 'held' : 'mark');
  }
  paintHand();
  paintVerdict(f);
}

function paintHand() {
  $('hand').innerHTML = hand.length ? hand.map((g, i) => {
    const l = LETTERS.find(x => x.glyph === g);
    return `<div class="lt${l.class === 'zulmani' ? ' dark' : ''}${i === sel ? ' sel' : ''}"
      data-i="${i}" title="${l.name} · ${l.abjad}"><span class="g">${g}</span><span class="v">${l.abjad}</span></div>`;
  }).join('') : '<span style="color:var(--dim);font-family:var(--sans);font-size:.72rem">all written</span>';
  for (const el of $('hand').querySelectorAll('.lt')) {
    el.onclick = () => { sel = +el.dataset.i; paintHand(); paintLetter(); };
  }
  paintLetter();
  $('gravity').disabled = settled;
}

function paintLetter() {
  if (sel < 0 || !hand[sel]) { $('letter').innerHTML = '<span style="color:var(--dim)">Nothing left in hand.</span>'; return; }
  const g = hand[sel];
  const d = describeLetter(g, { letters: LETTERS, ruleset, registers: PACK.registers });
  const l = LETTERS.find(x => x.glyph === g);
  $('letter').innerHTML = `<h4>${d.glyph} ${d.name} · ${d.abjad}</h4>` +
    `<div style="color:${l.grammar.connects_forward ? 'var(--gold-hi)' : 'var(--verm)'}">` +
    (l.grammar.connects_forward
      ? 'joins what follows — anything written west of it hangs on'
      : 'joins NOTHING after it — a word breaks here') + '</div>' +
    d.granted.filter(p => p.op === 'AXIS').map(() =>
      `<div style="color:var(--gold-hi);margin-top:.2rem"><b>AXIS</b> — stands on nothing, and carries what is bonded to it</div>`).join('');
}

function paintVerdict(f) {
  const held = level.targets.filter(t => { const c = world.get(...t); return c && c.glyph; });
  if (settled) {
    const win = held.length === level.targets.length;
    $('verdict').className = win ? 'win' : 'fell';
    $('verdict').textContent = win
      ? `It stands — ${held.length} of ${level.targets.length} marks held.`
      : `It came down. ${held.length} of ${level.targets.length} marks held.`;
    $('forecast').innerHTML = '<h4>Gravity is in</h4>Nothing more will move. Start over to try another order.';
    return;
  }
  $('verdict').className = 'lose';
  $('verdict').textContent = `${held.length} of ${level.targets.length} marks covered — gravity is still out`;
  const n = f ? f.effects.length : 0;
  $('forecast').innerHTML = `<h4>If gravity came in now</h4>` +
    (n ? `<b style="color:var(--verm)">${n} ${n === 1 ? 'cell' : 'cells'} would fall</b> — the dashed arrows.`
       : `<b style="color:var(--gold-hi)">Nothing would move.</b> Everything standing is carried.`);
}

function say(msg, kind = '') { $('say').textContent = msg; $('say').className = kind; }

/* ------------------------------------------------------------------ input -- */

function writeAt(cell) {
  if (settled) return say('Gravity is already in. Start over.', 'bad');
  if (sel < 0 || !hand[sel]) return say('Nothing left in hand.', 'bad');
  const [x, y] = cell;
  if (world.has(x, y, 0)) return say('Something is already there.', 'bad');
  if (!legal(x, y)) return say('Write on the ground, or beside something standing.', 'bad');

  const glyph = hand[sel];
  const c = compile([{ glyph, register: 'written' }], { letters: LETTERS, ruleset });
  if (c.power.value === 0) return say(c.power.why, 'bad');
  snapshot();
  const r = execute(world, c, { cursor: [x, y, 0], dir: [-1, 0, 0] });
  hand.splice(sel, 1);
  sel = hand.length ? 0 : -1;
  const joins = r.effects.filter(e => e.kind === 'join').length;
  const breaks = r.effects.filter(e => e.kind === 'sever').length;
  say(`${glyph} written` + (joins ? ` · joined ${joins}` : '') + (breaks ? ` · the word breaks here` : ''),
      breaks ? 'bad' : joins ? 'good' : '');
  draw();
}

function letGravityIn() {
  if (settled) return;
  snapshot();
  world.rules.gravity = true;
  const moved = world.settle();
  settled = true;
  say(moved.length ? `${moved.length} cell-moves as it came down` : 'nothing moved', moved.length ? 'bad' : 'good');
  draw();
}

function undo() {
  const s = undoStack.pop();
  if (!s) return say('Nothing to undo.');
  world = s.world; hand = s.hand; settled = s.settled;
  sel = hand.length ? Math.min(Math.max(sel, 0), hand.length - 1) : -1;
  say(''); draw();
}

function loadLevel(id) {
  level = LEVELS.levels.find(l => l.id === id) || LEVELS.levels[0];
  ruleset = PACK.rulesets.find(r => r.id === (level.ruleset || 'workshop'));
  build();
  history.replaceState(null, '', `?level=${level.id}`);
  for (const b of $('levels').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === level.id);
  $('brief').innerHTML = `<h4>${level.name} <span style="color:var(--gold-hi)">${level.arabic}</span></h4>${level.brief}`;
  $('teach').innerHTML = `<h4>What this one is about</h4>${level.teaches}`;
  say(''); draw();
}

/* ------------------------------------------------------------------- boot -- */

(async function main() {
  const [lj, pj, vj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
    fetch(`./levels.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; PACK = pj; LEVELS = vj;

  $('levels').innerHTML = LEVELS.levels.map(l =>
    `<button class="btn" data-id="${l.id}">${l.name}</button>`).join('');
  for (const b of $('levels').querySelectorAll('.btn')) b.onclick = () => loadLevel(b.dataset.id);

  iso = new Iso($('cv'));
  addEventListener('resize', () => { iso.resize(); if (world) draw(); });
  $('cv').addEventListener('click', ev => {
    const r = $('cv').getBoundingClientRect();
    // The board is a single z-plane, so unproject onto the row the marks are on.
    const y = level.targets[0][1];
    let best = null, bestD = 1e9;
    for (let yy = 0; yy <= y + 2; yy++) {
      const c = iso.unproject(ev.clientX - r.left, ev.clientY - r.top, yy);
      const p = iso.project(c[0], yy, 0);
      const d = Math.hypot(p.x - (ev.clientX - r.left), p.y - (ev.clientY - r.top));
      if (d < bestD) { bestD = d; best = [c[0], yy]; }
    }
    if (best) writeAt(best);
  });
  $('gravity').onclick = letGravityIn;
  $('undo').onclick = undo;
  $('reset').onclick = () => { build(); say(''); draw(); };
  addEventListener('keydown', ev => { if (ev.key === 'z') undo(); if (ev.key === 'Enter') letGravityIn(); });

  iso.resize();
  loadLevel(new URLSearchParams(location.search).get('level') || LEVELS.levels[0].id);

  window.__standing = {
    get world() { return world; }, get hand() { return hand; }, get settled() { return settled; },
    LETTERS, PACK, LEVELS, loadLevel, writeAt, letGravityIn, forecast,
    won: () => level.targets.every(t => { const c = world.get(...t); return c && c.glyph; }),
    /** Replay a level's verified solution through the real input path. */
    selfTest(id) {
      loadLevel(id);
      const script = { 'the-outboard-letter': [['ر', 0, 2], ['م', 1, 2]],
                       'the-upright-stroke': [['ر', 0, 2], ['م', 1, 2], ['ا', 2, 2]] }[level.id];
      for (const [g, x, y] of script) { sel = hand.indexOf(g); writeAt([x, y]); }
      const before = forecast().effects.length;
      letGravityIn();
      return { level: level.id, win: window.__standing.won(), predictedFalls: before };
    },
  };
})();
