// ui.js — The Pushing Floor.
//
// A block-pusher where pushing alone cannot finish the job. The moment-to-moment
// verb is walking and shoving; the letters are the tools you reach for when the
// stone you need is one you can never get behind.
//
// All the rules live in ../../engine/ — `agent.js` decides what a step does,
// `vm.js` decides what a letter does, and this file only draws and takes input.
// The renderer is the Scriptorium's, imported across apps, which is the claim
// that it is reusable being cashed rather than repeated.

import { World } from '../../../engine/world.js?v=5';
import { compile, execute, describeLetter } from '../../../engine/vm.js?v=5';
import { Scribe, DIRS, targetsCovered } from '../../../engine/agent.js?v=5';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=5';

const V = 'v=1';
const $ = id => document.getElementById(id);

let LETTERS = [], PACK = null, LEVELS = null;
let level = null, ruleset = null, world = null, scribe = null, hand = [];
let iso = null, sel = -1, undoStack = [];

/* ------------------------------------------------------------------ setup -- */

function build() {
  world = new World({ rules: { gravity: !!level.gravity } });
  for (const c of level.cells) {
    const cell = world.set(c.x, c.y || 0, c.z, { ...c, y: c.y || 0 });
    if (cell.glyph) {
      const l = LETTERS.find(x => x.glyph === cell.glyph);
      cell.connects = !l.primitives.some(p => p.op === 'SEVER');
      cell.axis = l.primitives.some(p => p.op === 'AXIS');
    }
  }
  for (const [a, b] of level.bonds || []) world.bond(a.join(','), b.join(','));
  scribe = new Scribe(world, level.scribe);
  hand = level.hand.slice();
  undoStack = [];
  sel = hand.length ? 0 : -1;
}

function snapshot() {
  undoStack.push({ world: world.clone(), pos: scribe.pos.slice(), hand: hand.slice() });
  if (undoStack.length > 60) undoStack.shift();
}

function undo() {
  const s = undoStack.pop();
  if (!s) return say('Nothing to undo.');
  world = s.world; scribe = new Scribe(world, s.pos); hand = s.hand;
  sel = Math.min(sel, hand.length - 1);
  say(''); draw();
}

/* ------------------------------------------------------------------- draw -- */

function draw() {
  iso.frame(world, [scribe.pos, ...level.targets]);
  // The engine's own effect vocabulary is reused for the board furniture: a
  // target is an outline, the scribe is an outline in another colour.
  const marks = [];
  iso.draw(world, null, {});
  for (const t of level.targets) {
    const held = world.get(...t);
    iso.markCell(t[0], t[1], t[2], held && !held.fixed ? PALETTE.gold : PALETTE.turq,
                 held && !held.fixed ? 'set' : 'mark');
  }
  iso.markCell(scribe.pos[0], scribe.pos[1], scribe.pos[2], PALETTE.verm, 'scribe');
  paintHand();
  paintVerdict();
}

function paintHand() {
  $('hand').innerHTML = hand.length ? hand.map((g, i) => {
    const l = LETTERS.find(x => x.glyph === g);
    return `<div class="lt${l.class === 'zulmani' ? ' dark' : ''}${i === sel ? ' sel' : ''}"
      data-i="${i}" title="${l.name} · ${l.abjad}">
      <span class="g">${g}</span><span class="v">${l.abjad}</span></div>`;
  }).join('') : '<span style="color:var(--dim);font-family:var(--sans);font-size:.72rem">spent</span>';
  for (const el of $('hand').querySelectorAll('.lt')) {
    el.onclick = () => { sel = +el.dataset.i; paintHand(); paintLetter(); };
  }
  paintLetter();
}

function paintLetter() {
  if (sel < 0 || !hand[sel]) { $('letter').innerHTML = '<span style="color:var(--dim)">No letter selected.</span>'; return; }
  const d = describeLetter(hand[sel], { letters: LETTERS, ruleset, registers: PACK.registers });
  $('letter').innerHTML = `<h4>${d.glyph} ${d.name} · ${d.abjad}</h4>` +
    d.granted.map(p => `<div><b style="color:var(--gold-hi)">${p.op}</b> —
      <i style="color:var(--dim)">${p.from}</i></div>`).join('') +
    `<div style="margin-top:.35rem;color:var(--dim)">Click a cell beside the scribe to write it there. It stays, and it is spent.</div>`;
}

function paintVerdict() {
  const t = targetsCovered(world, level.targets);
  $('verdict').className = t.win ? 'win' : 'lose';
  $('verdict').textContent = t.win
    ? `Done — both marks are covered.`
    : `${t.covered} of ${t.total} marks covered`;
}

function say(msg, kind = '') { $('say').textContent = msg; $('say').className = kind; }

/* ------------------------------------------------------------------ input -- */

function walk(dir) {
  const probe = scribe.probe(dir);
  if (!probe.ok) { say(probe.why || 'blocked', 'bad'); draw(); return; }
  snapshot();
  const r = scribe.step(dir);
  say(r.pushed ? `pushed a body of ${r.pushed.size}` : '', r.pushed ? 'good' : '');
  draw();
}

function inscribeAt(cell) {
  if (sel < 0 || !hand[sel]) return say('No letter in hand.', 'bad');
  const d = [cell[0] - scribe.pos[0], cell[1] - scribe.pos[1], cell[2] - scribe.pos[2]];
  const adjacent = Math.abs(d[0]) + Math.abs(d[1]) + Math.abs(d[2]) === 1;
  if (!adjacent) return say('You can only write where you can reach.', 'bad');
  if (world.has(...cell)) return say('Something is already there.', 'bad');

  const glyph = hand[sel];
  const c = compile([{ glyph, register: 'written' }], { letters: LETTERS, ruleset });
  if (c.power.value === 0) return say(c.power.why, 'bad');
  snapshot();
  const r = execute(world, c, { cursor: cell, dir: [-1, 0, 0] });
  hand.splice(sel, 1);
  sel = hand.length ? 0 : -1;
  const did = r.effects.filter(e => e.op).map(e => `${e.op}: ${e.detail}`);
  say(did.length ? did.join(' · ') : `${glyph} written, and nothing answered it`, did.length ? 'good' : 'bad');
  draw();
}

function loadLevel(id) {
  level = LEVELS.levels.find(l => l.id === id) || LEVELS.levels[0];
  ruleset = PACK.rulesets.find(r => r.id === (level.ruleset || 'workshop'));
  build();
  history.replaceState(null, '', `?level=${level.id}`);
  for (const b of $('levels').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === level.id);
  $('brief').innerHTML = `<h4>${level.name} <span style="color:var(--gold-hi)">${level.arabic}</span></h4>${level.brief}`;
  $('teach').innerHTML = `<h4>What this floor is about</h4>${level.teaches}`;
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
  const resize = () => { iso.resize(); if (world) draw(); };
  addEventListener('resize', resize);

  const KEYS = {
    ArrowUp: DIRS.north, w: DIRS.north, ArrowDown: DIRS.south, s: DIRS.south,
    ArrowLeft: DIRS.west, a: DIRS.west, ArrowRight: DIRS.east, d: DIRS.east,
  };
  addEventListener('keydown', ev => {
    const dir = KEYS[ev.key];
    if (dir) { ev.preventDefault(); walk(dir); }
    if (ev.key === 'z') undo();
  });

  $('cv').addEventListener('click', ev => {
    const r = $('cv').getBoundingClientRect();
    inscribeAt(iso.unproject(ev.clientX - r.left, ev.clientY - r.top, 0));
  });
  $('undo').onclick = undo;
  $('reset').onclick = () => { build(); say(''); draw(); };

  iso.resize();
  const want = new URLSearchParams(location.search).get('level');
  loadLevel(want || LEVELS.levels[0].id);

  window.__floor = {
    get world() { return world; }, get scribe() { return scribe; }, get hand() { return hand; },
    LETTERS, PACK, LEVELS, loadLevel, walk, inscribeAt, DIRS,
    won: () => targetsCovered(world, level.targets),
    /** Replay a level's verified solution through the real input path. */
    selfTest(id) {
      loadLevel(id);
      const script = { 'the-yoke': ['s', 'e', '#3,2', 'n', 'e', 'e'],
                       'the-decoy': ['e', '#3,2', 'n', 'e', 'e'] }[level.id];
      for (const m of script) {
        if (m.startsWith('#')) { const [x, z] = m.slice(1).split(',').map(Number); sel = 0; inscribeAt([x, 0, z]); }
        else walk({ n: DIRS.north, s: DIRS.south, e: DIRS.east, w: DIRS.west }[m]);
      }
      return { level: level.id, ...targetsCovered(world, level.targets) };
    },
  };
})();
