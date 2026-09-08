// ui.js — The Descent.
//
// The roguelike shell APPLICATIONS.md said the project was missing: a run of
// floors, and WHAT VARIES BETWEEN RUNS IS THE METAPHYSICS. Each floor below the
// surface runs one of the four historical lettrisms, dealt in a seeded order and
// not named. Your letters behave slightly differently than they did upstairs,
// and you have to work out where you are before you commit a structure to
// gravity — or commit on a guess and watch what the collapse tells you.
//
// Nothing here is new engine. A floor is a Standing Word level; the assay is the
// Reckoner's; the fall is animateSettle. What is new is the RUN: lives, candles,
// the deal, and the rule that a collapse costs a life but teaches for free.
//
// EVIDENCE IS SHOWN, THE RULE IS EARNED. Every refusal, every join that should
// have been a break, every alif that did not hold, goes into the floor's evidence
// list the moment it happens. The name of the metaphysics is never shown until
// you name it yourself or the run ends.

import { compile } from '../../../engine/vm.js?v=10';
import { Ledger } from '../../../engine/ledger.js?v=10';
import { mountHowTo } from '../../shared/howto.js?v=10';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=10';
import { startWorld, settled, held, write, legalCells, minWord, deal, solutions } from './rules.js?v=10';


const HOWTO = {
  id: 'descent',
  title: 'How to play The Descent',
  goal: [
    'The Descent is a run of five floors. On every floor there is a small stone pier (the brown blocks), a few MARKS drawn on the floor or in the air as dashed turquoise diamonds, and a HAND of Arabic letters in the panel on the right. Your job on each floor is to write those letters into the world so that, when you let gravity in, a letter is sitting on every mark. If every mark is held, the floor stands and you descend to the next one. If any mark is empty after the fall, the floor came down: you lose one of your three lives, the floor is cleared, and you try again with the same letters.',
    'The catch, and the whole point of the game: below the surface, every floor runs under a different historical METAPHYSICS of the letters, and you are not told which. On some floors a letter that normally joins nothing joins anyway. On some the alif holds nothing up. On one, a word shorter than three letters does nothing at all. The floor shows you evidence of its rules every time you write; the name of the metaphysics is yours to work out. You win the run by reaching the bottom of the fifth floor; you lose it by running out of lives.',
  ],
  sections: [
    { h: 'The panel on the right, top to bottom', items: [
      'The strip of numbered boxes shows the five floors; the highlighted box is where you are, a gold box is a floor you have already stood, and a box with a turquoise underline is one whose metaphysics you named correctly. Beside it are your LIVES (filled dots) and your CANDLES (a number). "New run" deals a fresh run with a new seed; the seed is in the page address, so you can send a run to someone or replay it.',
      'The brief box tells you what this floor is called and what it is about. On floor 0, the surface, it also tells you which ruleset you are in: that is the one floor where you are told, so you can learn the letters before they start behaving differently.',
      'The verdict line counts how many marks are currently covered. The line under it in monospace is the message line: every refused or successful action is explained there in a sentence.',
      'IN HAND shows the letters you can still write. Click a letter to add it to THE WORD; click it again, or click it inside the word, to take it back. The word is written right to left, as Arabic is: the first letter you click is the first letter of the word.',
      '"Let gravity in" ends the floor: everything that is not held falls, and the marks are checked. "Undo" takes back your last write ([[Z]] also does this). "Clear the floor" removes everything you wrote and gives the hand back; it does not cost a life.',
      'IF GRAVITY CAME IN NOW is a live forecast: it says how many cells would fall if you let gravity in this instant, and the dashed arrows on the board show which ones and where they would land. This forecast is not an estimate: it is the same physics the commit uses, run on a copy.',
      'WHAT THIS FLOOR HAS SHOWN YOU is the evidence list. Every time the floor refuses something, or joins letters that should have broken, or lets an alif fall, a line is added here in plain words. Read it before you name the metaphysics.',
      'NAME THE METAPHYSICS: four buttons, one per historical ruleset. A correct name earns a candle and marks the floor; a wrong name burns a candle. Naming is never required — you can descend without ever naming — but it is how you score.',
      'ASK THE FLOOR A QUESTION: five probes, each costing one candle. A probe writes a small test word under the hidden rules and reports what happened (its strength, what was refused). They are the same evidence you would get by writing, bought without spending letters.',
    ]},
    { h: 'Writing a word: the cursor, and where the word goes', items: [
      'First compose a word from the hand (click letters in order). Then move the mouse over the board. The cell under the mouse is outlined in turquoise and labelled "cursor": that is where the FIRST letter of your word will go. The rest of the word runs westward from there, one cell per letter, in the direction the compass arrow on the floor points. As you move the mouse, a translucent GHOST of the whole word is drawn where it would land, so you can see the shape before you commit.',
      'While the ghost is showing, the box in the top-right corner of the board tells you what would happen if you clicked: whether the write is allowed, which letters would join into one body and where the word would break, and how many cells would then fall if gravity came in. Nothing here is a guess: the game actually performs the write on a copy of the world and reports the result.',
      'A write is allowed only if every cell of the word is empty and at least one cell of the word touches something already built (the pier, or a letter). The bare ground is never enough: nothing in the Descent rests on the floor of the abyss. If the ghost is red and the corner box says why, click somewhere else.',
      'Click to write. The letters leave your hand, join or break according to the floor\'s rules, and the message line reports what joined and what broke. Then let gravity in, or keep writing.',
      'Some floors demand a whole word at once: if a floor refuses a one-letter word, the message says so, and that refusal is itself evidence about where you are.',
    ]},
    { h: 'How a floor is won or lost, exactly', items: [
      'Won: after "Let gravity in", every mark has a letter on it. Marks turn gold as they are covered. The floor is marked done and you descend automatically.',
      'Lost: after "Let gravity in", at least one mark is empty. You lose a life; the floor is cleared but the evidence list is kept, because the collapse taught you something. With no lives left, the run ends and the metaphysics of every floor is revealed.',
      'Between floors nothing carries over except your lives, your candles, and what you have learned.',
    ]},
  ],
};

const V = 'v=7';
const $ = id => document.getElementById(id);

let LETTERS = [], PACK = null, DATA = null, PROBES = [], ledger = null, iso = null;
let PORTAL = [], WORKSHOP = null;

/* ------------------------------------------------------------------- run -- */

let run = null;    // { seed, floors:[{level, ruleset, named, done}], at, lives, candles, log }
let world = null, hand = [], word = [], undoStack = [], over = false, evidence = [], fast = false;
let hover = null;   // { cell, ghost, effects, text } for the cell under the mouse

function newRun(seed = (Date.now() % 100000)) {
  // One seed deals both the order of the metaphysics and the floors they are
  // played on. The surface is the workshop, named openly: the one floor where
  // you are told where you are, so the letters can be met before they start lying.
  const floors = deal(seed, { rulesets: PORTAL, workshop: WORKSHOP, pool: DATA.floors });
  run = { seed, floors, at: 0, lives: DATA.run.lives, candles: DATA.run.candles, log: [] };
  over = false;
  history.replaceState(null, '', `?seed=${seed}`);
  enterFloor();
}

function floor() { return run.floors[run.at]; }
function ruleset() { return floor().ruleset; }

function enterFloor() {
  const f = floor();
  world = startWorld(f.level);
  hand = f.level.hand.slice();
  word = []; undoStack = []; evidence = [];
  over = false; hover = null; $('hover').innerHTML = '';
  $('over').classList.remove('show');
  say('');
  paintAll();
}

/* ------------------------------------------------------------------ draw -- */

function forecast() {
  const { world: w, moved } = settled(world);
  const ends = new Map();
  for (const m of moved) {
    const from = m.from.split(',').map(Number);
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

function draw(fx = null) {
  const f = floor();
  const targets3 = f.level.targets.map(t => [t[0], t[1], 0]);
  const fc = over ? null : forecast();
  iso.frame(world, targets3);
  // The hover preview: the ghost of the pending word where the mouse is, and the
  // forecast of what would fall AFTER that write. Same physics, on a copy.
  const fxShown = fx || (hover && hover.effects) || (fc ? fc.effects : null);
  iso.draw(world, fxShown, { cursor: hover ? hover.cell : null, ghostWorld: hover ? hover.ghost : null });
  for (const t of targets3) {
    const c = world.get(...t);
    const ok = c && c.glyph;
    iso.markCell(t[0], t[1], t[2], ok ? PALETTE.gold : PALETTE.turq, ok ? 'held' : 'mark');
  }
  paintForecast(fc);
}

function paintAll() { draw(); paintRun(); paintBrief(); paintHand(); paintWord(); paintVerdict(); paintEvidence(); paintName(); paintProbes(); }

function paintRun() {
  $('floors').innerHTML = run.floors.map((f, i) =>
    `<div class="fl${f.done ? ' done' : ''}${i === run.at ? ' here' : ''}${f.named && !f.told ? ' named' : ''}" title="${f.done || f.told ? f.ruleset.name : 'floor ' + i}">${i}</div>`).join('');
  $('lives').innerHTML = `lives <b>${'●'.repeat(run.lives)}${'○'.repeat(Math.max(0, DATA.run.lives - run.lives))}</b>`;
  $('candles').innerHTML = `candles <b>${run.candles}</b>`;
}

function paintBrief() {
  const f = floor();
  const where = f.told ? `<div style="color:var(--turq);margin-bottom:.3rem">The surface. You are in <b>${f.ruleset.name}</b> — the one floor that tells you.</div>`
                       : `<div style="color:var(--verm);margin-bottom:.3rem">Floor ${run.at}. You are not told whose rules run here.</div>`;
  $('brief').innerHTML = where + `<h4>${f.level.name} <span style="color:var(--gold-hi);text-transform:none;letter-spacing:0">${f.level.arabic}</span></h4>${f.level.brief}`;
}

function paintHand() {
  $('hand').innerHTML = hand.length ? hand.map((g, i) => {
    const l = LETTERS.find(x => x.glyph === g);
    const inWord = word.includes(i);
    return `<div class="lt${l.class === 'zulmani' ? ' dark' : ''}${inWord ? ' inword' : ''}" data-i="${i}" title="${l.name} · ${l.abjad}">
      <span class="g">${g}</span><span class="v">${l.abjad}</span></div>`;
  }).join('') : '<span style="color:var(--dim);font-family:var(--sans);font-size:.72rem">nothing left in hand</span>';
  for (const el of $('hand').querySelectorAll('.lt')) el.onclick = () => toggleInWord(+el.dataset.i);
}

function paintWord() {
  $('word').innerHTML = word.length
    ? word.map((i, k) => `<span class="w" data-k="${k}" title="take back">${hand[i]}</span>`).join('')
    : '<span class="empty">empty — click letters in the hand, first letter first</span>';
  for (const el of $('word').querySelectorAll('.w')) el.onclick = () => { word.splice(+el.dataset.k, 1); paintHand(); paintWord(); };
}

function paintVerdict() {
  const f = floor();
  const h = held(world, f.level).length, n = f.level.targets.length;
  $('verdict').className = 'lose';
  $('verdict').textContent = `${h} of ${n} marks covered — gravity is still out`;
  $('gravity').disabled = over;
}

function paintForecast(fc) {
  if (!fc) { $('forecast').innerHTML = ''; return; }
  const n = fc.effects.length;
  $('forecast').innerHTML = `<h4>If gravity came in now</h4>` +
    (n ? `<b style="color:var(--verm)">${n} ${n === 1 ? 'cell' : 'cells'} would fall</b> — the dashed arrows.`
       : `<b style="color:var(--gold-hi)">Nothing would move.</b> Everything standing is carried.`);
}

function paintEvidence() {
  $('evidence').innerHTML = evidence.length
    ? evidence.map(e => `<li class="${e.kind}"><b>${e.head}</b> — ${e.body}</li>`).join('')
    : '<li style="color:var(--dim)">nothing yet. Write something.</li>';
}

function paintName() {
  const f = floor();
  $('name').innerHTML = PORTAL.map(r => {
    const state = f.told ? (r.id === f.ruleset.id ? 'right' : '') : (f.guesses || []).includes(r.id) ? (r.id === f.ruleset.id ? 'right' : 'wrong') : '';
    return `<button class="btn ${state}" data-id="${r.id}" ${f.named || f.told ? 'disabled' : ''} title="${r.motive}">${r.name.replace(/^The /, '')}</button>`;
  }).join('');
  for (const b of $('name').querySelectorAll('.btn')) b.onclick = () => nameIt(b.dataset.id);
}

function paintProbes() {
  const f = floor();
  $('probes').innerHTML = PROBES.map(p =>
    `<button class="btn" data-id="${p.id}" ${run.candles <= 0 || f.told ? 'disabled' : ''} title="${p.reads}">${p.label}</button>`).join('');
  for (const b of $('probes').querySelectorAll('.btn')) b.onclick = () => probe(b.dataset.id);
}

function say(msg, kind = '') { $('say').textContent = msg; $('say').className = kind; }

/* -------------------------------------------------------------- evidence -- */

/** Turn what the engine did into what the floor has shown you. */
function witness(r, wordGlyphs) {
  const rs = ruleset();
  ledger.witnessEffects(r.effects, rs.id);
  for (const e of r.effects) {
    const l = LETTERS.find(x => x.glyph === e.glyph);
    if (e.kind === 'sever') add('break', `${e.glyph} joined nothing after it`, 'the word broke there, as its form says it must');
    if (e.kind === 'join' && l && !l.grammar.connects_forward)
      add('refused', `${e.glyph} JOINED what follows`, 'a letter that never joins forward was joined anyway — something here will not let a word break');
    if (e.kind === 'anchor') add('axis', `${e.glyph} holds a column`, 'it will stand on nothing, and carry what is bonded to it');
  }
  for (const d of r.compiled.diagnostics) {
    if (d.level === 'refused' && d.op === 'AXIS')
      add('refused', `${d.glyph} holds nothing here`, d.why);
  }
  const pv = r.compiled.power;
  if (pv && pv.rule === 'proportion' && wordGlyphs.length >= 2)
    add('power', `strength ${Math.round(pv.value * 100)}%`, pv.why);
  if (pv && pv.rule === 'luminosity' && wordGlyphs.length >= 2)
    add('power', `strength ${Math.round(pv.value * 100)}%`, pv.why);
}
function add(kind, head, body) {
  if (evidence.some(e => e.head === head)) return;
  evidence.push({ kind, head, body });
  paintEvidence();
}

/* ------------------------------------------------------------------ input -- */

function toggleInWord(i) {
  if (over) return;
  const k = word.indexOf(i);
  if (k >= 0) word.splice(k, 1); else word.push(i);
  paintHand(); paintWord();
}

function writeWordAt(cell) {
  if (over) return;
  if (!word.length) return say('Compose a word first: click letters in the hand.', 'bad');
  const glyphs = word.map(i => hand[i]);
  const r = write(world, glyphs, cell, { letters: LETTERS, ruleset: ruleset() });
  if (r.refused === 'illegal') return say(r.why, 'bad');
  if (r.refused === 'power') {
    // A word that does nothing is not an error. It is the floor telling you something.
    add('refused', `a word of ${glyphs.length} did nothing`, r.why);
    return say(r.why, 'bad');
  }
  undoStack.push({ world: world.clone(), hand: hand.slice(), word: word.slice() });
  world = r.world;
  hand = hand.filter((_, i) => !word.includes(i));
  word = [];
  hover = null; $('hover').innerHTML = '';
  witness(r, glyphs);
  const joins = r.effects.filter(e => e.kind === 'join').length, breaks = r.effects.filter(e => e.kind === 'sever').length;
  say(`${glyphs.join('')} written` + (joins ? ` · joined ${joins}` : '') + (breaks ? ` · the word breaks` : ''), breaks ? 'bad' : joins ? 'good' : '');
  paintHand(); paintWord(); paintVerdict(); draw();
}

async function letGravityIn() {
  if (over) return;
  const f = floor();
  const before = world.clone();
  world.rules.gravity = true;
  const moved = world.settle();
  over = true;
  $('gravity').disabled = true;
  await iso.animateSettle(before, moved, {
    stepMs: fast ? 0 : 160,
    draw: (w, fx) => { iso.frame(w, f.level.targets.map(t => [t[0], t[1], 0])); iso.draw(w, fx, {}); },
  });
  const h = held(world, f.level).length, n = f.level.targets.length;
  const win = h === n;
  // What fell is evidence too — especially an alif.
  for (const m of moved) {
    const c = world.get(...m.to.split(',').map(Number));
    if (c && c.glyph === 'ا') add('refused', 'the alif fell', 'a single upright stroke held nothing here');
  }
  if (win) {
    $('verdict').className = 'win';
    $('verdict').textContent = `It stands — ${h} of ${n}. Descend.`;
    f.done = true;
    run.log.push({ floor: run.at, ruleset: f.ruleset.id, named: f.named, lives: run.lives });
    setTimeout(() => descend(), fast ? 0 : 900);
  } else {
    $('verdict').className = 'fell';
    $('verdict').textContent = `It came down — ${h} of ${n} held. A life, for the lesson.`;
    run.lives--;
    paintRun();
    if (run.lives <= 0) return setTimeout(() => endRun(false), fast ? 0 : 900);
    setTimeout(() => { over = false; world = startWorld(f.level); hand = f.level.hand.slice(); word = []; undoStack = []; say('The floor is cleared; the evidence stays.'); draw(); paintHand(); paintWord(); paintVerdict(); }, fast ? 0 : 1400);
  }
  draw(moved.length ? [] : null);
}

function descend() {
  if (run.at + 1 >= run.floors.length) return endRun(true);
  run.at++;
  enterFloor();
}

function endRun(won) {
  over = true;
  const rows = run.floors.map((f, i) =>
    `<tr><td>${i === 0 ? 'surface' : 'floor ' + i}</td><td><b>${f.ruleset.name}</b></td><td>${f.told ? 'told' : f.named ? 'named' : f.done ? 'never named' : 'unknown'}</td><td>${f.done ? 'stood' : i === run.at ? 'fell' : '—'}</td></tr>`).join('');
  const named = run.floors.filter(f => !f.told && f.named).length;
  $('overcard').innerHTML = `<h3>${won ? 'You reached the bottom.' : 'The run ends here.'}</h3>
    <div>Seed ${run.seed}. ${won ? 'Five floors stood.' : `Floor ${run.at} came down for the last time.`}
    You named <b>${named} of ${run.floors.length - 1}</b> metaphysics before committing, and finished with ${run.candles} candle${run.candles === 1 ? '' : 's'}.</div>
    <table>${rows}</table>
    <div style="margin-top:.6rem" class="row"><button class="btn" id="again">Same seed again</button> <button class="btn" id="fresh">New run</button></div>`;
  $('over').classList.add('show');
  $('again').onclick = () => newRun(run.seed);
  $('fresh').onclick = () => newRun();
}

function nameIt(id) {
  const f = floor();
  if (f.named || f.told || over) return;
  f.guesses = (f.guesses || []).concat([id]);
  const right = id === f.ruleset.id;
  ledger.identify(f.ruleset.id, right);
  if (right) { f.named = true; run.candles++; say(`Named. You are in ${f.ruleset.name}. A candle for knowing.`, 'good'); }
  else { run.candles = Math.max(0, run.candles - 1); say('That is not where you are. A candle burns.', 'bad'); }
  paintRun(); paintName(); paintProbes();
}

function probe(id) {
  const f = floor();
  if (run.candles <= 0 || f.told || over) return;
  const p = PROBES.find(x => x.id === id);
  run.candles--;
  const c = compile([...p.write].map(glyph => ({ glyph, register: p.register })), { letters: LETTERS, ruleset: f.ruleset });
  const errors = c.diagnostics.filter(d => d.level === 'error');
  const refused = c.diagnostics.filter(d => d.level === 'refused');
  if (errors.length) add('refused', `probe ${p.write}: refused outright`, errors[0].why);
  else add('power', `probe ${p.write}: strength ${Math.round(c.power.value * 100)}%`, c.power.why);
  for (const d of refused) add('refused', `probe ${p.write}: ${d.op} refused`, d.why);
  say(`probe: ${p.reads}`, 'good');
  paintRun(); paintProbes();
}

function undo() {
  const s = undoStack.pop();
  if (!s || over) return say('Nothing to undo.');
  world = s.world; hand = s.hand; word = s.word;
  say(''); paintHand(); paintWord(); paintVerdict(); draw();
}

/* ------------------------------------------------------------------- boot -- */

(async function main() {
  const [lj, pj, dj, rj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
    fetch(`./levels.json?${V}`).then(r => r.json()),
    fetch(`../reckoner/levels.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; PACK = pj; DATA = dj; PROBES = rj.probes;
  PORTAL = PACK.rulesets.filter(r => r.kind === 'PORTAL');
  WORKSHOP = PACK.rulesets.find(r => r.id === 'workshop');
  ledger = new Ledger();

  iso = new Iso($('cv'));
  iso.onStyle = () => { if (world) draw(); };
  iso.bindStyleToggle($('style'));
  iso.bindCamera($('camera'), () => { if (world) draw(); });
  mountHowTo($('howto-btn'), HOWTO);
  addEventListener('resize', () => { iso.resize(); if (world) draw(); });
  $('cv').addEventListener('click', ev => {
    const r = $('cv').getBoundingClientRect();
    const top = Math.max(...floor().level.targets.map(t => t[1])) + 2;
    let best = null, bestD = 1e9;
    for (let yy = 0; yy <= top; yy++) {
      const c = iso.unproject(ev.clientX - r.left, ev.clientY - r.top, yy);
      const p = iso.project(c[0], yy, 0);
      const d = Math.hypot(p.x - (ev.clientX - r.left), p.y - (ev.clientY - r.top));
      if (d < bestD) { bestD = d; best = [c[0], yy]; }
    }
    if (best) writeWordAt(best);
  });
  // Hover: where would the word land, and what would happen if it did.
  const cellUnder = ev => {
    const r = $('cv').getBoundingClientRect();
    const top = Math.max(...floor().level.targets.map(t => t[1])) + 2;
    let best = null, bestD = 1e9;
    for (let yy = 0; yy <= top; yy++) {
      const c = iso.unproject(ev.clientX - r.left, ev.clientY - r.top, yy);
      const p = iso.project(c[0], yy, 0);
      const d = Math.hypot(p.x - (ev.clientX - r.left), p.y - (ev.clientY - r.top));
      if (d < bestD) { bestD = d; best = [c[0], yy]; }
    }
    return best;
  };
  $('cv').addEventListener('mousemove', ev => {
    if (over) return;
    const cell = cellUnder(ev);
    if (!cell) return;
    const glyphs = word.map(i => hand[i]);
    let text = `Cursor at column ${cell[0]}, height ${cell[1]}.`;
    let ghost = null, effects = null;
    if (!glyphs.length) {
      text += ' <span class="bad">Compose a word from the hand first</span>; then this is where its first letter would go, and the word would run westward from here.';
    } else {
      const r = write(world, glyphs, cell, { letters: LETTERS, ruleset: ruleset() });
      if (r.refused) text += ` Writing <b>${glyphs.join('')}</b> here is <span class="bad">not allowed</span>: ${r.why}`;
      else {
        ghost = r.world;
        const joins = r.effects.filter(e => e.kind === 'join').length, breaks = r.effects.filter(e => e.kind === 'sever').length;
        const s = settled(r.world);
        const h = held(s.world, floor().level).length, n = floor().level.targets.length;
        const ends = new Map();
        for (const m of s.moved) { const from = m.from.split(',').map(Number); const origin = ends.has(m.from) ? ends.get(m.from) : from; ends.delete(m.from); ends.set(m.to, origin); }
        effects = [];
        for (const [toKey, from] of ends) { const to = toKey.split(',').map(Number); if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2]) continue; effects.push({ kind: 'fall', at: from, to, detail: 'would fall' }); }
        text += ` If you write <b>${glyphs.join('')}</b> here: ${joins ? joins + ' join' + (joins > 1 ? 's' : '') : 'no joins'}${breaks ? ', the word breaks' : ''}. Then if gravity came in, <b>${effects.length}</b> cell${effects.length === 1 ? '' : 's'} would fall and <b>${h} of ${n}</b> marks would be held.`;
      }
    }
    hover = { cell: [cell[0], cell[1], 0], ghost, effects, text };
    $('hover').innerHTML = text;
    draw();
  });
  $('cv').addEventListener('mouseleave', () => { hover = null; $('hover').innerHTML = ''; if (!over) draw(); });
  $('gravity').onclick = letGravityIn;
  $('undo').onclick = undo;
  $('reset').onclick = () => { if (over) return; world = startWorld(floor().level); hand = floor().level.hand.slice(); word = []; undoStack = []; say(''); paintHand(); paintWord(); paintVerdict(); draw(); };
  $('newrun').onclick = () => newRun();
  addEventListener('keydown', ev => { if (ev.key === 'z') undo(); if (ev.key === 'Enter') letGravityIn(); });

  iso.resize();
  const seed = parseInt(new URLSearchParams(location.search).get('seed'), 10);
  newRun(Number.isFinite(seed) ? seed : undefined);

  window.__descent = {
    get run() { return run; }, get world() { return world; }, get hand() { return hand; }, get evidence() { return evidence; },
    get iso() { return iso; }, get hover() { return hover; },
    LETTERS, PACK, DATA, newRun, writeWordAt, letGravityIn, nameIt, probe,
    minWord: () => minWord(ruleset()), legal: cells => legalCells(world, cells),
    /**
     * Play a whole run through the real input path: on each floor, find a
     * solution under the floor's (hidden) ruleset with the shared solver, name
     * the ruleset, write the solution, let gravity in. Returns per-floor results.
     */
    async selfTest(seed = 7) {
      fast = true;
      newRun(seed);
      const out = [];
      for (let guard = 0; guard < 8 && !over; guard++) {
        const f = floor();
        const sols = solutions(f.level, f.ruleset, { letters: LETTERS, first: true });
        const path = sols.values().next().value;
        if (!path) { out.push({ floor: run.at, ruleset: f.ruleset.id, solvable: false }); break; }
        if (!f.told) nameIt(f.ruleset.id);
        for (const step of path) {
          word = step.word.map(g => hand.indexOf(g)).map((i, k, arr) => {
            // identical letters: take distinct indices
            let j = i; while (arr.slice(0, k).includes(j)) j = hand.indexOf(step.word[k], j + 1); return j;
          });
          writeWordAt(step.cursor);
        }
        const before = run.at, lives = run.lives;
        await letGravityIn();
        await new Promise(r => setTimeout(r, 30));
        out.push({ floor: before, ruleset: f.ruleset.id, stood: run.lives === lives && f.done, named: f.named });
        if (run.at === before && !f.done) break;
        if (before === run.floors.length - 1 && f.done) break;
      }
      fast = false;
      return { seed, floors: out, reachedBottom: out.length === run.floors.length && out.every(o => o.stood) };
    },
  };
})();
