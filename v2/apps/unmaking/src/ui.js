// ui.js — The Unmaking: three candidate demolition routes, side by side.
//
// This app exists to settle a design question by playing rather than by arguing.
// v2 could build and could not unbuild, and rather than invent a primitive to
// close that gap, three candidates were written and put on the same structure:
//
//   A  The Isolated Form   INTERPRETATION, tightly sourced
//   B  The Utterance       GAME FICTION, and says so
//   C  The Thrown Stone    no claim at all — the control
//
// "Try all three" runs each against a fresh copy of the same structure with the
// same target and tabulates what each did, so they can be compared on one screen
// instead of remembered across sessions.

import { World } from '../../../engine/world.js?v=6';
import { compile, execute } from '../../../engine/vm.js?v=6';
import { isolate, utter, throwStone, standing, highest, ROUTES } from '../../../engine/unmaking.js?v=6';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=6';

const V = 'v=4';
const $ = id => document.getElementById(id);

let LETTERS = [], PACK = null, ruleset = null;
let world = null, iso = null, route = 'isolate', target = null, structure = null, done = false;

/* ------------------------------------------------------------- structures -- */
// Each is a case where something stands only because of how the letters join.

const STRUCTURES = {
  span: {
    name: 'The Span', line: 2,
    blurb: 'Four letters reaching out from a single pier. Every one past the first is standing only because it is bonded to its neighbour.',
    build(w) {
      w.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });
      w.set(0, 1, 0, { material: 'earth', value: 1, fixed: true });
      // مهنب: all join forward, none vertical (ا and ل would hold it by themselves),
      // no two adjacent alike (that would geminate into one letter).
      execute(w, compile([...'مهنب'].map(g => ({ glyph: g, register: 'written' })),
        { letters: LETTERS, ruleset }), { cursor: [3, 2, 0], dir: [-1, 0, 0] });
    },
  },
  pinned: {
    name: 'The Pinned Span', line: 2,
    blurb: 'The same reach, but an alif stands in it. An axis holds a frame, so it carries its body and refuses to be shoved.',
    build(w) {
      w.set(0, 0, 0, { material: 'earth', value: 1, fixed: true });
      w.set(0, 1, 0, { material: 'earth', value: 1, fixed: true });
      execute(w, compile([...'مهنا'].map(g => ({ glyph: g, register: 'written' })),
        { letters: LETTERS, ruleset }), { cursor: [3, 2, 0], dir: [-1, 0, 0] });
    },
  },
  tower: {
    name: 'The Tower', line: 4,
    blurb: 'A column with a shelf running off its top. The shelf stands only because its innermost letter joins the column — height and reach together.',
    build(w) {
      for (let y = 0; y < 2; y++) w.set(0, y, 0, { material: 'earth', value: 1, fixed: true });
      // The column, written upward. A first version stopped one course short, so the
      // shelf bonded to nothing and fell on build — the structure was not a test of
      // anything. The matrix caught it: every route scored 0.
      execute(w, compile([...'مهن'].map(g => ({ glyph: g, register: 'written' })),
        { letters: LETTERS, ruleset }), { cursor: [0, 2, 0], dir: [0, 1, 0] });
      execute(w, compile([...'بتث'].map(g => ({ glyph: g, register: 'written' })),
        { letters: LETTERS, ruleset }), { cursor: [3, 4, 0], dir: [-1, 0, 0] });
    },
  },
};

function build(id = structure) {
  structure = id;
  world = new World({ rules: { gravity: false } });
  STRUCTURES[id].build(world);
  world.rules.gravity = true;
  world.settle();
  target = null; done = false;
  for (const b of $('structures').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === id);
}

const line = () => STRUCTURES[structure].line;

/* ------------------------------------------------------------------- run --- */

/** Apply a route to a world. One place, so preview and commit cannot diverge. */
function runRoute(id, w, { apply = false } = {}) {
  const aim = target || defaultTarget(w);
  if (id === 'isolate') return isolate(w, aim, { apply });
  if (id === 'utter') return utter(w, { apply });
  return throwStone(w, aim, { dir: [1, 0, 0], force: 2, apply });
}

/** If the player has not aimed, use the outermost letter — the obvious target. */
function defaultTarget(w) {
  const ls = w.list().filter(c => c.glyph);
  if (!ls.length) return [0, 0, 0];
  const best = ls.reduce((a, c) => (c.x > a.x || (c.x === a.x && c.y > a.y) ? c : a), ls[0]);
  return [best.x, best.y, best.z];
}

/* ------------------------------------------------------------------ draw --- */

function draw() {
  const preview = done ? null : runRoute(route, world);
  iso.frame(world, [[0, line(), 0]]);
  iso.draw(world, preview ? preview.effects : null, {});
  if (target) iso.markCell(target[0], target[1], target[2], PALETTE.verm, 'aim');
  $('score').textContent =
    `${standing(world, line())} standing at or above y=${line()}` +
    (done ? ' — done' : preview ? ` · this route would drop ${dropped(preview)}` : '');
  paintRoutes();
}

function dropped(r) {
  const before = standing(world, line());
  const after = standing(r.world, line());
  return `${before - after}`;
}

function paintRoutes() {
  $('routes').innerHTML = Object.values(ROUTES).map(r =>
    `<button class="btn wide${r.id === route ? ' active' : ''}" data-id="${r.id}">
      ${r.name} <span style="color:var(--gold-hi)">${r.arabic}</span>
      <span class="pill ${r.kind}" style="float:right">${r.kind}</span></button>`).join('');
  for (const b of $('routes').querySelectorAll('.btn')) b.onclick = () => { route = b.dataset.id; draw(); paintFrame(); };
}

function paintFrame() {
  const r = ROUTES[route];
  $('route-frame').innerHTML = `<h4>${r.name} <span class="pill ${r.kind}">${r.kind}</span></h4>
    <div class="fact"><b>The fact:</b> ${r.fact}</div>
    <div class="reading"><b>The reading:</b> ${r.reading}</div>
    ${r.targeted ? '<div class="reading">Aims at a cell — click a letter.</div>'
                 : '<div class="reading">Takes the whole structure at once; there is nothing to aim.</div>'}`;
}

function say(m, k = '') { $('say').textContent = m; $('say').className = k; }

/* --------------------------------------------------------------- compare --- */

/** For a targeted route, the best it can do over every cell it could aim at.
 *  Without this the table compares a route aimed at its WORST target against two
 *  that cannot be aimed at all — which flattered the hammer and libelled the
 *  scalpel. The difference between them is precisely that one rewards aiming. */
function bestOver(routeId) {
  const before = standing(world, line());
  let best = { dropped: -1 };
  for (const c of world.list().filter(c => c.glyph)) {
    const w = world.clone();
    const saved = target;
    target = [c.x, c.y, c.z];
    const res = runRoute(routeId, w, { apply: true });
    target = saved;
    const d = before - standing(w, line());
    if (d > best.dropped) best = { dropped: d, at: [c.x, c.y, c.z], glyph: c.glyph, why: res.why };
  }
  return best;
}

function compare() {
  const rows = [];
  const before = standing(world, line());
  for (const r of Object.values(ROUTES)) {
    const w = world.clone();
    const res = runRoute(r.id, w, { apply: true });
    const after = standing(w, line());
    const best = r.targeted ? bestOver(r.id) : null;
    rows.push({ id: r.id, name: r.name, kind: r.kind, dropped: before - after, left: after,
                best, why: res.why || '' });
  }
  const score = r => (r.best ? r.best.dropped : r.dropped);
  const most = Math.max(...rows.map(score));
  $('cmp').innerHTML = '<tbody>' +
    `<tr><th>Route</th><th>As aimed</th><th>Best possible</th></tr>` +
    rows.map(r => `<tr class="${score(r) === most && most > 0 ? 'best' : ''}">
      <td><b>${r.name}</b><br><span class="pill ${r.kind}">${r.kind}</span></td>
      <td><b>${r.dropped}</b> of ${before}</td>
      <td>${r.best ? `<b>${r.best.dropped}</b> at ${r.best.glyph}` : '<span style="color:var(--dim)">cannot aim</span>'}</td></tr>
      <tr><td colspan="3" style="color:var(--dim);border-bottom:2px solid var(--rule)">${r.why}</td></tr>`).join('') +
    '</tbody>';

  const stone = rows.find(r => r.id === 'stone');
  const occult = rows.filter(r => r.id !== 'stone');
  const beat = occult.filter(r => score(r) > score(stone)).map(r => r.name);
  $('verdict').innerHTML = `<h4>Against the control</h4>` +
    (beat.length
      ? `${beat.join(' and ')} brought down more than simply hitting it, at best aim. On this structure.`
      : `<b style="color:var(--verm)">Nothing beat the thrown stone here.</b> That is a real result, not a bug — an operation with a claim behind it has to earn its place against one without.`) +
    `<div class="reading" style="margin-top:.3rem">Same structure, same aim, three fresh copies. Nothing above is a measure of whether a route is <i>good</i>, only of what it did.</div>`;
  say('compared on three fresh copies', 'good');
}

/* ------------------------------------------------------------------ boot --- */

(async function main() {
  const [lj, pj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; PACK = pj;
  ruleset = PACK.rulesets.find(r => r.id === 'workshop');

  $('structures').innerHTML = Object.entries(STRUCTURES).map(([id, s]) =>
    `<button class="btn" data-id="${id}">${s.name}</button>`).join('');
  for (const b of $('structures').querySelectorAll('.btn')) {
    b.onclick = () => { build(b.dataset.id); say(STRUCTURES[b.dataset.id].blurb); draw(); };
  }

  iso = new Iso($('cv'));
  iso.onStyle = () => { if (world) draw(); };
  iso.bindStyleToggle($('style'));
  addEventListener('resize', () => { iso.resize(); if (world) draw(); });
  $('cv').addEventListener('click', ev => {
    if (done) return say('Already done — rebuild to try another route.', 'bad');
    const r = $('cv').getBoundingClientRect();
    let best = null, bestD = 1e9;
    for (const c of world.list().filter(c => c.glyph)) {
      const p = iso.project(c.x, c.y, c.z);
      const d = Math.hypot(p.x - (ev.clientX - r.left), p.y - (ev.clientY - r.top));
      if (d < bestD) { bestD = d; best = [c.x, c.y, c.z]; }
    }
    if (best && bestD < 40) { target = best; say(`aiming at ${world.get(...best).glyph}`); draw(); }
  });

  $('do').onclick = async () => {
    if (done) return say('Rebuild first.', 'bad');
    const before = standing(world, line());
    const snap = world.clone();
    const res = runRoute(route, world, { apply: true });
    done = true;
    await iso.animateSettle(snap, res.moved || [], {
      stepMs: 160,
      draw: (w, fx) => { iso.frame(w, [[0, line(), 0]]); iso.draw(w, fx, {}); },
    });
    const after = standing(world, line());
    say(`${ROUTES[route].name}: ${res.why} — ${before - after} came down`, before > after ? 'good' : 'bad');
    draw();
  };
  $('reset').onclick = () => { build(); say(STRUCTURES[structure].blurb); draw(); };
  $('compare').onclick = compare;

  iso.resize();
  build('span');
  paintFrame();
  say(STRUCTURES.span.blurb);
  draw();

  window.__unmaking = {
    get world() { return world; }, STRUCTURES, ROUTES, build, compare,
    set route(r) { route = r; }, get route() { return route; },
    set target(t) { target = t; }, get target() { return target; },
    standing: () => standing(world, line()),
    runRoute, line,
    /** Run every route on every structure, for a check that does not need a human. */
    matrix() {
      const out = {};
      for (const sid of Object.keys(STRUCTURES)) {
        build(sid);
        const before = standing(world, line());
        out[sid] = { before, routes: {} };
        for (const rid of Object.keys(ROUTES)) {
          const w = world.clone();
          const res = runRoute(rid, w, { apply: true });
          out[sid].routes[rid] = { dropped: before - standing(w, line()), why: res.why };
        }
      }
      build('span');
      return out;
    },
  };
})();
