// ui.js — The Reckoner: four ways of acting on a structure that already stands.
//
// v2 grew up building. These four are the other half:
//
//   EXTRACT   take every instance of a letter out, and see what survives
//   RECKON    name a number; every run summing to it comes apart
//   ASSAY     you are in one of five metaphysics and are not told which. Find out.
//   STATION   from which direction do these letters read as a word?
//
// Two are recovered from v1's Abjad Tower with better grounding than they had.
// One (ASSAY) is the thing v1 did better than v2, taken back. One (STATION) is
// Yūsuf Ascent's perspective puzzle rebuilt out of language, because the original
// needed a camera moving through continuous space and this engine has none.

import { World, KEY } from '../../../engine/world.js?v=7';
import { compile, execute } from '../../../engine/vm.js?v=7';
import { extract, extracted, reckon, findRuns, readsFrom, DIRECTIONS } from '../../../engine/operations.js?v=7';
import { standing } from '../../../engine/unmaking.js?v=7';
import { Ledger } from '../../../engine/ledger.js?v=7';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=7';

const V = 'v=4';
const $ = id => document.getElementById(id);
const prog = (s, register = 'written') => [...s].map(glyph => ({ glyph, register }));

let LETTERS = [], PACK = null, DATA = null, WORKSHOP = null, ledger = null;
let level = null, world = null, iso = null, hand = [], sel = -1, done = false;
let hidden = null, findings = [], guessed = null, chosenDir = null;

/* ------------------------------------------------------------------ build -- */

function baseWorld() {
  const w = new World({ rules: { gravity: true } });
  for (const c of level.cells || []) w.set(c.x, c.y || 0, c.z || 0, { ...c, y: c.y || 0, z: c.z || 0 });
  for (const [a, b] of level.bonds || []) w.bond(KEY(...a), KEY(...b));
  if (level.build) execute(w, compile(prog(level.build.word), { letters: LETTERS, ruleset: WORKSHOP }),
                           { cursor: level.build.cursor, dir: [-1, 0, 0] });
  w.settle();
  return w;
}

function reset() {
  world = baseWorld();
  hand = (level.hand || []).slice();
  sel = hand.length ? 0 : -1;
  done = false; guessed = null; chosenDir = null; findings = [];
  if (level.type === 'assay') {
    // The ruleset is chosen by the level's seed and NOT shown. That is the whole
    // puzzle: v1 hid which scheme was operative, v2 put it in a panel, and this
    // takes it back.
    const rs = PACK.rulesets;
    hidden = rs[(level.seed || 0) % rs.length];
  }
  draw();
}

/* ------------------------------------------------------------------- draw -- */

function draw() {
  const line = level.line ?? 0;
  iso.frame(world, [[0, line, 0]]);
  iso.draw(world, null, {});
  if (level.type !== 'assay') {
    for (const c of world.list().filter(c => c.glyph)) {
      if (level.type === 'extract' && c.glyph === level.letter) {
        iso.markCell(c.x, c.y, c.z, PALETTE.verm, 'doomed');
      }
    }
  }
  paintPanels();
  paintVerdict();
}

function paintPanels() {
  for (const t of ['extract', 'reckon', 'assay', 'station']) {
    $('ui-' + t).classList.toggle('hidden', level.type !== t);
  }
  $('brief').innerHTML = `<h4>${level.name} <span style="color:var(--gold-hi)">${level.arabic}</span></h4>${level.brief}`;
  $('teach').innerHTML = `<h4>What this one is about</h4>${level.teaches}`;
  $('legend').textContent = {
    extract: 'the vermilion marks are the letters that will be taken out',
    reckon: 'read the values off the blocks — a sun letter has already changed the one before it',
    assay: 'the world is the same; only the metaphysics is hidden',
    station: 'the same body, read four ways',
  }[level.type] || '';

  if (level.type === 'extract') { $('doomed').textContent = level.letter; paintHand(); }
  if (level.type === 'reckon') paintValues();
  if (level.type === 'assay') { paintProbes(); paintFindings(); }
  if (level.type === 'station') paintDirs();
}

function paintHand() {
  $('hand').innerHTML = hand.length ? hand.map((g, i) => {
    const l = LETTERS.find(x => x.glyph === g);
    return `<div class="lt${l.class === 'zulmani' ? ' dark' : ''}${i === sel ? ' sel' : ''}" data-i="${i}"
      title="${l.name} · ${l.abjad}"><span class="g">${g}</span><span class="v">${l.abjad}</span></div>`;
  }).join('') : '<span style="color:var(--dim);font-family:var(--sans);font-size:.72rem">all written</span>';
  for (const el of $('hand').querySelectorAll('.lt')) el.onclick = () => { sel = +el.dataset.i; paintHand(); };
  $('do-extract').disabled = hand.length > 0 || done;
}

function paintValues() {
  const cells = world.list().filter(c => c.glyph)
    .sort((a, b) => b.x - a.x);
  $('values').innerHTML = `<h4>What is standing</h4>` +
    cells.map(c => `<span style="font-size:1.2rem">${c.glyph}</span> <b style="color:var(--gold-hi)">${c.value}</b>`).join(' &nbsp; ') +
    `<div style="color:var(--dim);margin-top:.3rem">runs of two or more; a single letter is not a run</div>`;
}

function paintDirs() {
  $('dirs').innerHTML = Object.entries(DIRECTIONS).map(([id, d]) =>
    `<button class="btn wide${chosenDir === id ? ' active' : ''}" data-id="${id}">${d.name}
      <span style="color:var(--gold-hi);float:right">${d.arabic}</span></button>`).join('');
  for (const b of $('dirs').querySelectorAll('.btn')) b.onclick = () => chooseDir(b.dataset.id);
  const rs = readsFrom(world, level.target);
  $('reading').innerHTML = chosenDir
    ? (() => { const r = rs.find(x => x.id === chosenDir);
        return `<h4>Read ${r.name}</h4><span style="font-size:1.6rem;color:var(--gold-hi)">${r.reads.join(' ')}</span>`; })()
    : `<h4>Nothing chosen</h4><span style="color:var(--dim)">Pick a direction and the same body will be read that way.</span>`;
}

function paintProbes() {
  $('probes').innerHTML = DATA.probes.map(p =>
    `<button class="btn" data-id="${p.id}">${p.label}</button>`).join('');
  for (const b of $('probes').querySelectorAll('.btn')) b.onclick = () => runProbe(b.dataset.id);
  $('guesses').innerHTML = PACK.rulesets.map(r =>
    `<button class="btn wide${guessed === r.id ? ' active' : ''}" data-id="${r.id}">${r.name}</button>`).join('');
  for (const b of $('guesses').querySelectorAll('.btn')) b.onclick = () => guess(b.dataset.id);
}

function paintFindings() {
  $('findings').innerHTML = findings.length
    ? findings.map(f => `<li><b>${f.label}</b><br>${f.result}</li>`).join('')
    : '<li style="border-left-color:var(--rule);color:var(--dim)">Nothing yet.</li>';
}

function paintVerdict() {
  const v = $('verdict');
  if (level.type === 'extract') {
    const ok = done && extracted(world, level.letter, level.line) && standing(world, level.line) >= level.survivors;
    v.className = done ? (ok ? 'win' : 'fell') : 'lose';
    v.textContent = done
      ? (ok ? `It held — ${standing(world, level.line)} standing and no ${level.letter} left.`
            : `Not enough survived: ${standing(world, level.line)} standing, ${level.letter} ${extracted(world, level.letter, level.line) ? 'gone' : 'still up there'}.`)
      : `Write all ${hand.length + world.list().filter(c => c.glyph).length} letters, then extract.`;
  } else if (level.type === 'reckon') {
    const left = standing(world, level.line);
    v.className = done ? (left <= level.leave_at_most ? 'win' : 'fell') : 'lose';
    v.textContent = done ? `${left} left standing; you needed at most ${level.leave_at_most}.`
                         : `${left} standing.`;
  } else if (level.type === 'assay') {
    v.className = guessed ? (guessed === hidden.id ? 'win' : 'fell') : 'lose';
    v.textContent = guessed
      ? (guessed === hidden.id ? `Correct — you were in ${hidden.name}.`
                               : `No. That was not it. (${findings.length} probes run.)`)
      : `${findings.length} of ${DATA.probes.length} probes run.`;
  } else if (level.type === 'station') {
    const rs = readsFrom(world, level.target);
    const ok = chosenDir && rs.find(r => r.id === chosenDir)?.found;
    v.className = chosenDir ? (ok ? 'win' : 'fell') : 'lose';
    v.textContent = chosenDir
      ? (ok ? `Yes — read that way it is ${level.target}.` : `Read that way it is not ${level.target}.`)
      : `Choose a direction.`;
  }
}

function say(m, k = '') { $('say').textContent = m; $('say').className = k; }

/* ----------------------------------------------------------------- actions */

function writeAt(cell) {
  if (level.type !== 'extract' || done) return;
  if (sel < 0 || !hand[sel]) return say('Nothing left in hand.', 'bad');
  const [x, y] = cell;
  if (world.has(x, y, 0)) return say('Something is already there.', 'bad');
  const legal = y === 0 || world.has(x - 1, y, 0) || world.has(x + 1, y, 0)
             || world.has(x, y - 1, 0) || world.has(x, y + 1, 0);
  if (!legal) return say('Write on the ground, or beside something standing.', 'bad');
  const glyph = hand[sel];
  execute(world, compile([{ glyph, register: 'written' }], { letters: LETTERS, ruleset: WORKSHOP }),
          { cursor: [x, y, 0], dir: [-1, 0, 0] });
  hand.splice(sel, 1);
  sel = hand.length ? 0 : -1;
  say(`${glyph} written`);
  draw();
}

async function playFall(before, moved) {
  await iso.animateSettle(before, moved, {
    stepMs: 160,
    draw: (w, fx) => { iso.frame(w, [[0, level.line ?? 0, 0]]); iso.draw(w, fx, {}); },
  });
}

async function doExtract() {
  const before = world.clone();
  const r = extract(world, level.letter, { apply: true });
  done = true;
  await playFall(before, r.moved);
  say(r.why, 'good');
  draw();
}

async function doReckon() {
  const n = parseInt($('number').value, 10);
  const runs = findRuns(world, n);
  if (!runs.length) { say(`nothing sums to ${n}`, 'bad'); return; }
  const before = world.clone();
  const r = reckon(world, n, { apply: true });
  done = true;
  await playFall(before, r.moved);
  say(r.why, 'good');
  draw();
}

function runProbe(id) {
  const p = DATA.probes.find(x => x.id === id);
  const c = compile(prog(p.write, p.register), { letters: LETTERS, ruleset: hidden });
  const refused = c.diagnostics.filter(d => d.level === 'refused');
  const errors = c.diagnostics.filter(d => d.level === 'error');
  const parts = [];
  if (errors.length) parts.push(`<span style="color:var(--verm)">refused outright</span> — ${errors[0].why}`);
  else parts.push(`strength <b>${Math.round(c.power.value * 100)}%</b> — ${c.power.why}`);
  for (const d of refused) parts.push(`<span style="color:var(--verm)">${d.op} refused</span> — ${d.why}`);
  findings = findings.filter(f => f.id !== id);
  findings.push({ id, label: p.label, result: parts.join('<br>') });
  say(`probe: ${p.reads}`, 'good');
  paintFindings();
  paintVerdict();
}

function guess(id) {
  guessed = id;
  const right = id === hidden.id;
  // A naming is a discovery like any other, so it goes in the shared ledger — and
  // a wrong one is recorded too, because being wrong about which world you are in
  // is worth knowing you were.
  ledger.identify(hidden.id, right);
  say(right ? 'named correctly' : 'named wrongly', right ? 'good' : 'bad');
  paintProbes(); paintVerdict();
}

function chooseDir(id) { chosenDir = id; paintDirs(); paintVerdict(); }

function load(id) {
  level = DATA.levels.find(l => l.id === id) || DATA.levels[0];
  history.replaceState(null, '', `?level=${level.id}`);
  for (const b of $('levels').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === level.id);
  say('');
  reset();
}

/* -------------------------------------------------------------------- boot */

(async function main() {
  const [lj, pj, dj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
    fetch(`./levels.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; PACK = pj; DATA = dj;
  WORKSHOP = PACK.rulesets.find(r => r.id === 'workshop');
  ledger = new Ledger();

  $('levels').innerHTML = DATA.levels.map(l => `<button class="btn" data-id="${l.id}">${l.name}</button>`).join('');
  for (const b of $('levels').querySelectorAll('.btn')) b.onclick = () => load(b.dataset.id);

  iso = new Iso($('cv'));
  iso.onStyle = () => { if (world) draw(); };
  iso.bindStyleToggle($('style'));
  addEventListener('resize', () => { iso.resize(); if (world) draw(); });
  $('cv').addEventListener('click', ev => {
    if (level.type !== 'extract') return;
    const r = $('cv').getBoundingClientRect();
    let best = null, bestD = 1e9;
    for (let y = 0; y <= (level.line ?? 0) + 2; y++) {
      const c = iso.unproject(ev.clientX - r.left, ev.clientY - r.top, y);
      const p = iso.project(c[0], y, 0);
      const d = Math.hypot(p.x - (ev.clientX - r.left), p.y - (ev.clientY - r.top));
      if (d < bestD) { bestD = d; best = [c[0], y]; }
    }
    if (best) writeAt(best);
  });

  $('do-extract').onclick = doExtract;
  $('reset-extract').onclick = reset;
  $('do-reckon').onclick = doReckon;
  $('reset-reckon').onclick = reset;

  iso.resize();
  load(new URLSearchParams(location.search).get('level') || DATA.levels[0].id);

  window.__reckoner = {
    get world() { return world; }, get level() { return level; }, get hidden() { return hidden; },
    LETTERS, PACK, DATA, load, reset, writeAt, doExtract, doReckon, runProbe, guess, chooseDir,
    get findings() { return findings; },
    /** Play each level's known answer through the real input path. */
    selfTest() {
      const out = {};
      // extract: write نمه — the nūn outboard, carrying nothing
      load('the-doomed-letter');
      // Written from the pier OUTWARD, because a cell is only legal beside
      // something already standing — so the writing order is the reverse of the
      // reading order, and the ن that ends up outboard is placed last.
      for (const [g, x] of [['ه', 0], ['م', 1], ['ن', 2]]) { sel = hand.indexOf(g); writeAt([x, 2]); }
      doExtract();
      out['the-doomed-letter'] = { win: extracted(world, 'ن', 2) && standing(world, 2) >= 2,
                                   standing: standing(world, 2) };
      // reckon: the outboard pair
      load('name-the-number');
      const cells = world.list().filter(c => c.glyph).sort((a, b) => a.x - b.x);
      $('number').value = cells[0].value + cells[1].value;
      doReckon();
      out['name-the-number'] = { win: standing(world, 2) <= level.leave_at_most, standing: standing(world, 2) };
      // assay: run every probe, then name it
      load('the-assay');
      for (const p of DATA.probes) runProbe(p.id);
      guess(hidden.id);
      out['the-assay'] = { win: guessed === hidden.id, was: hidden.id, probes: findings.length };
      // station: the direction that reads
      load('the-station');
      const good = readsFrom(world, level.target).find(r => r.found);
      chooseDir(good.id);
      out['the-station'] = { win: !!good, dir: good && good.id };
      return out;
    },
  };
})();
