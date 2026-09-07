// ui.js — Introduction to Lettrism Reality Building with Blocks.
//
// A history lesson with reconstructed diagrams, and a sage who builds with the
// letters. Every lesson has full-sentence text with its sources named where
// the player is reading, a task the world must satisfy before Next unlocks,
// and a scripted solution that tests/introduction.test.mjs proves finishes it.
// The task checks and the sage's reach live in lesson_rules.js, shared with
// that test, so the page and the proof cannot disagree.
//
// The sage is engine/agent.js's Scribe; writing is one letter at a time beside
// them (a Minecraft-ish reach); gravity, erasure and reading are the engine's
// own settle(), extract() and readWorld(). Nothing here is a new mechanic.

import { Ledger } from '../../../engine/ledger.js?v=8';
import { describeLetter } from '../../../engine/vm.js?v=8';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=8';
import { mountHowTo } from '../../shared/howto.js?v=8';
import { drawFigure } from './diagrams.js?v=8';
import { start, canWrite, writeLetter, letGravityIn, erase, taskDone, readWorld, DIRS, runSolution } from './lesson_rules.js?v=8';

const V = 'v=8';
const $ = id => document.getElementById(id);

const HOWTO = {
  id: 'introduction',
  title: 'How to play the Introduction',
  goal: [
    'This is a guided course in sixteen lessons. Each lesson has, on the right, a title, sometimes a diagram, several paragraphs of explanation with the sources named, and a TASK box that says exactly what to do on the board. When the task is done the box turns gold and the Next button unlocks. Back is always available, and the row of small numbered squares at the top lets you jump to any lesson you have already reached.',
    'On the board you control a SAGE: the small red outline. The sage walks and writes letters. There is no losing in the Introduction; if a lesson goes wrong, press "Start this lesson over" and the floor is reset.',
  ],
  sections: [
    { h: 'Walking', items: [
      'Press the arrow keys or [[W]] [[A]] [[S]] [[D]] to walk one cell north, west, south or east. The sage cannot walk into a block that is fixed, and walking into a loose stone pushes it one cell (that is the Pushing Floor\'s rule, and it holds here too).',
    ]},
    { h: 'Writing a letter', items: [
      'Click a letter in the palette on the right. It gets a gold outline and the line under the palette describes it: its number, its class, and — for the Arabic letters — the powers derived from its shape.',
      'Move the mouse over the board. The cell under the mouse is outlined and labelled "cursor", and the box in the top-right corner of the board tells you whether the sage can write there: the cell must be empty, in one of the eight columns around the sage, at most two blocks high, and either on the ground or touching something already built. If it cannot, the box says why (too far, too high, occupied, nothing to write against).',
      'Click the cell to write the letter. The letter becomes a block with its value on it. The message line under the task box reports what the letter did: what it joined, where a word broke, what it raised, poured or bound. Those reports are the engine\'s own effect list, not a summary.',
      'The box at the bottom-right of the board always shows what the world READS right now: every body of letters, as a word, in the reading direction the compass shows. That is the game\'s reader (engine/reader.js), and it is how the golem lesson knows what is written on the brow.',
    ]},
    { h: 'Gravity, erasing, and starting over', items: [
      'Some lessons begin with gravity switched off so you can build in the air. "Let gravity in" turns it on: everything that is not held falls, and the fall is played out step by step. Before you press it, hover over cells and read the corner box; the dashed arrows on the board show what would fall.',
      '"Erase the alef" appears only in the golem lesson. It takes every alef out of what stands (the Reckoner\'s Extract) and the reader shows what the body says afterwards.',
      '"Start this lesson over" resets the floor, the palette and the task.',
    ]},
    { h: 'The diagrams', items: [
      'The figures on the right are our reconstructions of the period diagrams, drawn live from the texts — the wheel of 231 gates, the three-seven-twelve wheel, al-Būnī\'s four natures, the ring of lunar mansions, the abjad ladder — and each caption says what it is drawn after. The manuscript folios themselves need a rights check before they can be shown; FETCHLIST.md beside this page lists them.',
    ]},
  ],
};

let ARABIC = [], HEBREW = [], PACK = null, LESSONS = [], ledger = null, iso = null;
let at = 0, lesson = null, world = null, sage = null, letters = null, ruleset = null;
let sel = null, hover = null, state = null, done = false, reached = 0;

/* ------------------------------------------------------------------ setup -- */

function load(i) {
  at = Math.max(0, Math.min(LESSONS.length - 1, i));
  lesson = LESSONS[at];
  letters = lesson.alphabet === 'hebrew' ? HEBREW : ARABIC;
  ruleset = PACK.rulesets.find(r => r.id === lesson.ruleset);
  const s = start(lesson);
  world = s.world; sage = s.sage;
  state = { gravity: !!lesson.world.gravity, erased: [], moved: [] };
  sel = null; hover = null; done = false;
  reached = Math.max(reached, at);
  try { localStorage.setItem('turka.v2.intro.reached', String(reached)); } catch { /* fine */ }
  history.replaceState(null, '', `?lesson=${lesson.id}`);
  iso.resetCamera();
  paintLesson();
  paintPalette();
  say('');
  draw();
  check();
}

function paletteGlyphs() {
  if (lesson.palette === 'arabic-all') return ARABIC.map(l => l.glyph);
  if (lesson.palette === 'hebrew-all') return HEBREW.filter(l => !l.facts.final).map(l => l.glyph);
  return lesson.palette || [];
}

/* ------------------------------------------------------------------- draw -- */

function forecastOf(w) {
  const c = w.clone(); c.rules.gravity = true; const moved = c.settle();
  const ends = new Map();
  for (const m of moved) { const from = m.from.split(',').map(Number); const origin = ends.has(m.from) ? ends.get(m.from) : from; ends.delete(m.from); ends.set(m.to, origin); }
  const effects = [];
  for (const [toKey, from] of ends) { const to = toKey.split(',').map(Number); if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2]) continue; effects.push({ kind: 'fall', at: from, to, detail: 'would fall' }); }
  return { effects, world: c };
}

function draw(fx = null) {
  const extra = [sage.pos];
  if (lesson.task.kind === 'walk-to') extra.push([lesson.task.at[0], 0, lesson.task.at[1]]);
  if (lesson.task.kind === 'stands') for (const t of lesson.task.targets) extra.push([t[0], t[1], t[2] || 0]);
  iso.frame(world, extra);
  const showFall = !world.rules.gravity && !fx;
  const fc = showFall ? forecastOf(hover && hover.ghost ? hover.ghost : world).effects : null;
  iso.draw(world, fx || fc, { cursor: hover ? hover.cell : null, ghostWorld: hover ? hover.ghost : null });
  if (lesson.task.kind === 'walk-to') iso.markCell(lesson.task.at[0], 0, lesson.task.at[1], PALETTE.turq, 'mark');
  if (lesson.task.kind === 'stands') for (const t of lesson.task.targets) { const c = world.get(t[0], t[1], t[2] || 0); iso.markCell(t[0], t[1], t[2] || 0, c && c.glyph ? PALETTE.gold : PALETTE.turq, c && c.glyph ? 'held' : 'mark'); }
  iso.markCell(sage.pos[0], sage.pos[1], sage.pos[2], PALETTE.verm, 'sage');
  paintReads();
}

function paintReads() {
  const { words } = readWorld(world);
  $('reads').innerHTML = words.length
    ? `The world reads: ${words.map(w => `<b>${w.text}</b>`).join(' &middot; ')}`
    : '<span style="color:var(--dim)">The world reads nothing yet.</span>';
}

function paintLesson() {
  $('progress').innerHTML = LESSONS.map((l, i) => `<div class="dot${i < at || (i === at && done) ? ' done' : ''}${i === at ? ' here' : ''}" data-i="${i}" title="${l.title}">${i + 1}</div>`).join('');
  for (const d of $('progress').querySelectorAll('.dot')) d.onclick = () => { if (+d.dataset.i <= reached) load(+d.dataset.i); };
  $('lessonno').textContent = `Lesson ${at + 1} of ${LESSONS.length} · ${lesson.alphabet === 'hebrew' ? 'Hebrew letters' : 'Arabic letters'} · ruleset: ${ruleset.name}`;
  $('title').textContent = lesson.title;
  const fig = $('figure');
  if (lesson.figure) { fig.classList.remove('hidden'); drawFigure(fig, lesson.figure, { arabic: ARABIC, hebrew: HEBREW.filter(l => !l.facts.final) }, iso.styleId); }
  else fig.classList.add('hidden');
  $('text').innerHTML = lesson.text.map(p => `<p>${p}</p>`).join('');
  $('sources').innerHTML = `<b>Sources for this lesson:</b> ${lesson.sources.join(' · ')}`;
  $('tasksay').textContent = lesson.task.say;
  $('gravity').style.display = lesson.task.kind === 'stands' || !lesson.world.gravity ? '' : 'none';
  $('erase').style.display = lesson.task.kind === 'golem' ? '' : 'none';
  $('back').disabled = at === 0;
}

function paintPalette() {
  const glyphs = paletteGlyphs();
  $('palette').innerHTML = glyphs.length ? glyphs.map(g => {
    const l = letters.find(x => x.glyph === g);
    const he = lesson.alphabet === 'hebrew';
    const dark = he ? false : l.class === 'zulmani';
    const tag = he ? l.kind : (l.class === 'nurani' ? 'light' : 'dark');
    return `<div class="lt${dark ? ' dark' : ''}${he ? ' he' : ''}${sel === g ? ' sel' : ''}" data-g="${g}" title="${l.name} · ${l.abjad}"><span class="g">${g}</span><span class="v">${l.abjad}</span><span class="k">${tag}</span></div>`;
  }).join('') : '<span style="color:var(--dim);font-family:var(--sans);font-size:.72rem">No letters on this lesson: read, then press Next.</span>';
  for (const el of $('palette').querySelectorAll('.lt')) el.onclick = () => { sel = el.dataset.g; paintPalette(); paintLetter(); };
  paintLetter();
}

function paintLetter() {
  if (!sel) { $('letter').innerHTML = '<span style="color:var(--dim)">Click a letter to select it. The description appears here.</span>'; return; }
  const l = letters.find(x => x.glyph === sel);
  if (lesson.alphabet === 'hebrew') {
    const sy = l.sy || {};
    const bits = [];
    if (l.kind === 'mother') bits.push(`a <b>mother</b> letter — the element ${sy.element}`);
    if (l.kind === 'double') bits.push(`a <b>double</b> letter — the aspects ${(sy.aspects || []).join(' and ')}`);
    if (l.kind === 'simple') bits.push(`a <b>simple</b> letter — the faculty of ${sy.faculty}`);
    if (l.facts.final) bits.push('<b>a final form</b>: a body of letters ends where it stands (SEVER; ours to say, and said in the table)');
    else if (l.facts.has_final) bits.push(`has a final form (${l.facts.final_form}) for the end of a word`);
    $('letter').innerHTML = `<b>${l.glyph} ${l.name}</b>, gematria ${l.abjad}: ${bits.join('; ')}. As a block it is a brick with a number; what it does is not yet derived.`;
    return;
  }
  const d = describeLetter(sel, { letters, ruleset, registers: PACK.registers });
  const ops = d.granted.map(p => `<b>${p.op}</b> (${p.from})`).join(', ');
  const refused = (d.refused || []).map(p => `${p.op} refused: ${p.why}`).join('; ');
  $('letter').innerHTML = `<b>${d.glyph} ${d.name}</b>, abjad ${d.abjad}, ${l.class === 'nurani' ? 'luminous' : 'dark'}, ${l.grammar.connects_forward ? 'joins what follows' : '<b>joins nothing after it</b>'}. Powers here: ${ops || 'none'}.${refused ? ' ' + refused : ''}`;
}

function say(msg, kind = '') { $('say').textContent = msg; $('say').className = kind; }

function check() {
  const v = taskDone(lesson.task, world, sage, state);
  done = v.done;
  $('task').className = done ? 'done' : '';
  $('taskprog').textContent = v.progress || '';
  $('next').disabled = !done && lesson.task.kind !== 'none';
  $('erase').disabled = !(v.stage === 2 || (lesson.task.kind === 'golem' && !state.erased.length && v.stage === 2));
  if (lesson.task.kind === 'golem') $('erase').disabled = v.stage !== 2;
  paintLesson();
}

/* ------------------------------------------------------------------ input -- */

function walk(dirName) {
  const r = sage.step(DIRS[dirName]);
  if (!r.ok) say(r.why, 'bad');
  else say(r.pushed ? `walked ${dirName}, pushing a body of ${r.pushed.size}` : `walked ${dirName}`);
  hover = null; $('hover').innerHTML = '';
  draw(); check();
}

function writeAt(cell) {
  if (!sel) return say('Choose a letter from the palette first.', 'bad');
  const r = writeLetter(world, sage, sel, cell, { letters, ruleset });
  if (r.refused) return say(r.why, 'bad');
  ledger.witnessEffects(r.effects, ruleset.id);
  const parts = [];
  for (const e of r.effects) {
    if (e.kind === 'join') parts.push(`${e.glyph} joins ${world.get(...e.to)?.glyph || 'the next'}: one body`);
    if (e.kind === 'sever') parts.push(`${e.glyph} joins nothing after it: the word breaks`);
    if (e.kind === 'anchor') parts.push(`${e.glyph} holds its column`);
    if (e.kind === 'bind') parts.push(`bound: ${e.detail}`);
    if (e.kind === 'pour') parts.push(`poured: ${e.detail}`);
    if (e.kind === 'raise' || e.kind === 'lower') parts.push(`${e.kind}: ${e.detail}`);
  }
  for (const d of r.compiled.diagnostics) if (d.level === 'refused') parts.push(`${d.op} refused here — ${d.why}`);
  say(`${sel} written` + (parts.length ? ' · ' + parts.join(' · ') : ''), parts.some(p => p.includes('refused')) ? 'bad' : 'good');
  hover = null; $('hover').innerHTML = '';
  draw(); check();
}

async function gravity() {
  if (world.rules.gravity) return say('Gravity is already in.');
  const before = world.clone();
  const moved = letGravityIn(world);
  state.gravity = true;
  $('gravity').disabled = true;
  await iso.animateSettle(before, moved, { stepMs: 150, draw: (w, fx) => { iso.frame(w, [sage.pos]); iso.draw(w, fx, {}); iso.markCell(sage.pos[0], sage.pos[1], sage.pos[2], PALETTE.verm, 'sage'); } });
  say(moved.length ? `gravity is in: ${moved.length} cell-moves` : 'gravity is in: nothing moved', moved.length ? 'bad' : 'good');
  draw(); check();
}

function eraseAlef() {
  const g = lesson.task.erase;
  const r = erase(world, g);
  state.erased.push(g);
  const { words } = readWorld(world);
  for (const w of words) ledger.read(w.text);
  say(`every ${g} taken out — the body now reads ${words.map(w => w.text).join(', ') || 'nothing'}`, 'good');
  draw(); check();
}

/* ------------------------------------------------------------------- boot -- */

(async function main() {
  const [aj, hj, pj, lj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../data/hebrew.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
    fetch(`./lessons.json?${V}`).then(r => r.json()),
  ]);
  ARABIC = aj.letters; HEBREW = hj.letters; PACK = pj; LESSONS = lj.lessons;
  ledger = new Ledger();
  try { reached = parseInt(localStorage.getItem('turka.v2.intro.reached') || '0', 10) || 0; } catch { /* fine */ }

  iso = new Iso($('cv'));
  iso.onStyle = () => { if (world) { draw(); paintLesson(); } };
  iso.bindStyleToggle($('style'));
  iso.bindCamera($('camera'), () => { if (world) draw(); });
  mountHowTo($('howto-btn'), HOWTO);
  addEventListener('resize', () => { iso.resize(); if (world) draw(); });

  const cellUnder = ev => {
    const r = $('cv').getBoundingClientRect();
    let best = null, bestD = 1e9;
    for (let yy = 0; yy <= 2; yy++) {
      const c = iso.unproject(ev.clientX - r.left, ev.clientY - r.top, yy);
      const p = iso.project(c[0], yy, c[2]);
      const d = Math.hypot(p.x - (ev.clientX - r.left), p.y - (ev.clientY - r.top));
      if (d < bestD) { bestD = d; best = [c[0], yy, c[2]]; }
    }
    return best;
  };
  $('cv').addEventListener('mousemove', ev => {
    const cell = cellUnder(ev);
    if (!cell) return;
    let text = `Cursor at column ${cell[0]}, height ${cell[1]}, row ${cell[2]}.`;
    let ghost = null;
    if (!sel) text += ' <span class="bad">No letter selected</span> — click one in the palette.';
    else {
      const ok = canWrite(world, sage, cell);
      if (!ok.ok) text += ` <span class="bad">Cannot write ${sel} here:</span> ${ok.why}`;
      else {
        const w = world.clone();
        const r = writeLetter(w, sage, sel, cell, { letters, ruleset });
        if (r.refused) text += ` <span class="bad">${r.why}</span>`;
        else {
          ghost = w;
          const joins = r.effects.filter(e => e.kind === 'join').length, breaks = r.effects.filter(e => e.kind === 'sever').length;
          const other = r.effects.filter(e => ['bind', 'pour', 'raise', 'lower', 'anchor'].includes(e.kind)).map(e => e.kind);
          text += ` Click to write <b>${sel}</b> here: ${joins ? 'it joins the letter beside it' : 'it joins nothing'}${breaks ? ', the word breaks' : ''}${other.length ? ', and it would ' + other.join(' and ') : ''}.`;
          if (!world.rules.gravity) { const fc = forecastOf(w); text += ` If gravity came in after that, <b>${fc.effects.length}</b> cell${fc.effects.length === 1 ? '' : 's'} would fall.`; }
        }
      }
    }
    hover = { cell, ghost, text };
    $('hover').innerHTML = text;
    draw();
  });
  $('cv').addEventListener('mouseleave', () => { hover = null; $('hover').innerHTML = ''; draw(); });
  $('cv').addEventListener('click', ev => { const cell = cellUnder(ev); if (cell) writeAt(cell); });
  addEventListener('keydown', ev => {
    if (ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
    const k = ev.key.toLowerCase();
    const map = { arrowup: 'north', w: 'north', arrowdown: 'south', s: 'south', arrowleft: 'west', a: 'west', arrowright: 'east', d: 'east' };
    // The camera also uses the arrows for panning; walking wins here, and the
    // How-to says so. Pan with right-drag or the wheel instead.
    if (map[k]) { ev.preventDefault(); ev.stopImmediatePropagation(); walk(map[k]); }
  }, true);
  $('gravity').onclick = gravity;
  $('erase').onclick = eraseAlef;
  $('reset').onclick = () => load(at);
  $('back').onclick = () => load(at - 1);
  $('next').onclick = () => { if (at === LESSONS.length - 1) location.href = '../../index.html'; else load(at + 1); };

  iso.resize();
  const want = new URLSearchParams(location.search).get('lesson');
  const idx = LESSONS.findIndex(l => l.id === want);
  load(idx >= 0 ? idx : 0);

  window.__intro = {
    get lesson() { return lesson; }, get world() { return world; }, get sage() { return sage; }, get done() { return done; }, get at() { return at; },
    LESSONS, load, walk, writeAt, gravity, eraseAlef, select: g => { sel = g; paintPalette(); },
    /** Play every lesson's solution through the real input path, in order. */
    async selfTest() {
      const out = [];
      for (let i = 0; i < LESSONS.length; i++) {
        load(i);
        for (const step of lesson.solution) {
          if (step.walk) walk(step.walk);
          else if (step.write) { sel = step.write[0]; writeAt(step.write[1]); }
          else if (step.gravity) { const before = world.clone(); const moved = letGravityIn(world); state.gravity = true; draw(); check(); void before; void moved; }
          else if (step.erase) eraseAlef();
        }
        out.push({ lesson: lesson.id, done });
      }
      return { all: out.every(o => o.done), lessons: out };
    },
  };
})();
