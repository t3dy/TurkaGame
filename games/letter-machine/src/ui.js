// ui.js — the shell around engine.js. All rules live in the engine; this file
// draws them and takes clicks.
//
// Two cross-folder reads, both deliberate and both DATA, per the pattern
// palace.json already established:
//   ../abjad-tower/data/letters.json          the 28, with form facts
//   ../abjad-tower/data/correspondences.json  the rival schemes
// And one cross-folder read that is CODE, which the house rule normally forbids
// until two prototypes are past their first slice:
//   ../abjad-tower/src/notebook.js
// The exception is deliberate and narrow. The notebook is not a library, it is the
// SCHEMA of a single shared save (`turka.notebook.v1`) that both games write. Two
// copies of a state machine over one store is how you get two games disagreeing
// about whether a claim is confirmed. It travels with the data it describes.

import { Machine, formOps, OP_NAMES, effectiveForm } from './engine.js?v=1';
import { Notebook } from '../../abjad-tower/src/notebook.js?v=8';

const V = 'v=1';
const $ = id => document.getElementById(id);
const AT = '../abjad-tower';

let LETTERS = [], SCHEMES = [], PUZZLES = null, ELEMENTS = {};
let machine = null, notebook = null, sel = -1, tool = null;

/* ------------------------------------------------------------------ paint -- */

function formMarks(letter, cell) {
  const f = cell ? effectiveForm(cell) : letter.form;
  const bits = [];
  if (f.dots > 0 && f.dot_position === 'above') bits.push(`<span class="fmark above">${'•'.repeat(f.dots)}</span>`);
  if (f.dots > 0 && f.dot_position === 'below') bits.push(`<span class="fmark below">${'•'.repeat(f.dots)}</span>`);
  if (f.closed) bits.push('<span class="fmark closed" title="a closed form">○</span>');
  if (f.tail) bits.push('<span class="fmark tail" title="a descending tail">⌐</span>');
  return bits.join('');
}

function blockHtml(x, cell) {
  if (!x) return '';
  if (x.kind === 'letter') {
    const dark = x.letter.class === 'zulmani' ? ' dark' : '';
    return `<div class="blk letter${dark}">${formMarks(x.letter, x)}
      <span class="g">${x.glyph}</span><span class="v">${x.letter.abjad}</span></div>`;
  }
  return `<div class="blk sub e-${x.element}">
    <span class="g">${ELEMENTS[x.element] || ''}</span><span class="v">${x.value}</span></div>`;
}

function paintBoard() {
  const b = $('board');
  b.style.gridTemplateColumns = `repeat(${machine.cols}, auto)`;
  const held = new Set();
  for (let r = 0; r < machine.rows; r++) for (let c = 0; c < machine.cols; c++) {
    const x = machine.board[r][c];
    if (x && x.kind === 'letter' && formOps({ form: effectiveForm(x) }).some(o => o.op === 'AXIS')) held.add(c);
  }
  let html = '';
  for (let r = 0; r < machine.rows; r++) for (let c = 0; c < machine.cols; c++) {
    html += `<div class="cell${held.has(c) ? ' held' : ''}" data-r="${r}" data-c="${c}">${blockHtml(machine.board[r][c])}</div>`;
  }
  b.innerHTML = html;
  for (const el of b.querySelectorAll('.cell')) el.onclick = () => cellClick(+el.dataset.r, +el.dataset.c);
}

function paintHand() {
  $('hand').innerHTML = machine.hand.map((l, i) =>
    `<div class="tile${l.class === 'zulmani' ? ' dark' : ''}${i === sel ? ' sel' : ''}" data-i="${i}"
       title="${l.name} · ${l.abjad}">${formMarks(l)}<span class="g">${l.glyph}</span><span class="v">${l.abjad}</span></div>`).join('')
    || '<span class="lab">empty</span>';
  for (const el of $('hand').querySelectorAll('.tile')) {
    el.onclick = () => { sel = +el.dataset.i; tool = null; paintAll(); };
  }
  $('dot-left').textContent = machine.dotMoves;
  $('tr-left').textContent = machine.transposes;
  $('tool-dot').disabled = machine.dotMoves <= 0;
  $('tool-transpose').disabled = machine.transposes <= 0;
  $('tool-dot').classList.toggle('active', tool === 'dot');
  $('tool-transpose').classList.toggle('active', tool === 'transpose');
}

function paintGoal() {
  const g = machine.puzzle.goal;
  $('goal').textContent =
    g.type === 'total' ? `Goal — the board must total ${g.value}.`
    : g.type === 'produce' ? `Goal — put a ${g.element ? g.element + ' ' : ''}block of ${g.value} on the board.`
    : `Goal — every row that holds matter must come to the same sum.`;
  $('teaches').textContent = machine.puzzle.teaches;
}

function paintLog(log) {
  $('runlog').innerHTML = (log || []).map(e =>
    `<li>${e.glyph ? `<b>${e.glyph}</b> ` : ''}<i>${e.op}</i> — ${e.text}</li>`).join('')
    || '<li>Not run yet.</li>';
}

function paintRules() {
  $('rules').innerHTML = Object.entries(OP_NAMES).map(([k, v]) =>
    `<tr><td>${v.from}</td><td><b>${v.name}</b> <span style="opacity:.6">${v.ar}</span><br>${v.does}</td></tr>`).join('');
}

function paintNotebook() {
  const sum = notebook.summary(), qs = Object.keys(sum);
  const TITLES = { temperament: 'Which letter has which nature?', efficacy: 'Why do letters hold?', rule: 'Rules' };
  $('tome-notebook').innerHTML = qs.length ? qs.map(q => `
    <div class="nb-q"><div class="lab">${TITLES[q] || q}</div>
    ${sum[q].map(c => `<div class="nb-claim"><span class="pill ${c.state}">${c.state}</span>
      <b>${c.text}</b> <span class="pill ${c.kind}">${c.kind}</span>
      <span style="color:var(--dim)">${c.observations.length} observation${c.observations.length === 1 ? '' : 's'}</span>
      <div class="why">${c.source || ''}</div></div>`).join('')}</div>`).join('')
    : '<p style="color:var(--dim)">Empty. Transpose something, or play Abjad Tower&rsquo;s Temperament mode.</p>';
  $('nb-xp').textContent = `${notebook.xp} XP in the notebook`;
}

function paintAll() { paintBoard(); paintHand(); paintGoal(); }

/* ----------------------------------------------------------------- input -- */

function say(msg, kind = '') {
  $('result').innerHTML = msg ? `<div class="verdict ${kind}">${msg}</div>` : '';
}

function cellClick(r, c) {
  const cell = machine.board[r][c];
  if (tool === 'dot') {
    if (!cell || cell.kind !== 'letter') return say('Dots belong to letters.', 'lose');
    const now = effectiveForm(cell).dot_position;
    const next = now === 'above' ? 'below' : now === 'below' ? 'none' : 'above';
    const r2 = machine.apply({ move: 'movedot', r, c, pos: next });
    say(r2.ok ? r2.why : r2.why, r2.ok ? 'win' : 'lose');
    if (machine.dotMoves <= 0) tool = null;
    return paintAll();
  }
  if (tool === 'transpose') {
    if (!cell) return say('Nothing there to read another way.', 'lose');
    const r2 = machine.transpose(r, c);
    recordObservations();
    say(r2.why, r2.ok ? 'win' : 'lose');
    if (machine.transposes <= 0) tool = null;
    return paintAll();
  }
  if (sel < 0) return say('Choose a letter from your hand first.');
  const r2 = machine.apply({ move: 'place', hand: sel, r, c });
  if (!r2.ok) return say(r2.why, 'lose');
  sel = machine.hand.length ? Math.min(sel, machine.hand.length - 1) : -1;
  say('');
  paintAll();
}

/** Everything the machine has newly observed goes into the shared notebook. */
function recordObservations() {
  let gained = 0, lines = [];
  while (machine.observations.length) {
    const ob = machine.observations.shift();
    for (const v of ob.verdicts) {
      const res = notebook.observe(v.id, {
        result: v.agrees ? 'agrees' : 'contradicts',
        where: { game: 'letter-machine', puzzle: machine.puzzle.id },
        detail: ob.kind === 'letter-to-substance'
          ? `${ob.glyph} read as ${ob.element}; ${v.name} said ${v.predicted}`
          : `${ob.element} ${ob.value} → ${ob.failed ? 'refused' : ob.glyph}; ${v.name} said ${v.predicted || 'no letter'}`,
      });
      gained += res.xp;
      if (res.changed) lines.push(`${v.name} → ${res.after}`);
    }
  }
  if (lines.length) say(`Notebook: ${lines.join(' · ')} (+${gained})`, 'win');
  paintNotebook();
}

function run() {
  const log = machine.run();
  paintLog(log);
  paintAll();
  const v = machine.check();
  say(v.win ? `Complete — ${v.detail}` : `Not yet — ${v.detail}`, v.win ? 'win' : 'lose');
}

function load(id) {
  const p = PUZZLES.puzzles.find(x => x.id === id) || PUZZLES.puzzles[0];
  machine = new Machine({ letters: LETTERS, schemes: SCHEMES, puzzle: p });
  for (const s of SCHEMES) notebook.propose(s.id, { question: s.domain, text: s.name, kind: s.kind, source: s.source });
  sel = machine.hand.length ? 0 : -1;
  tool = null;
  history.replaceState(null, '', `?p=${p.id}`);
  for (const b of $('puzzles').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === p.id);
  paintAll(); paintLog(null); say(''); paintNotebook();
}

/* ------------------------------------------------------------------ boot -- */

(async function main() {
  const [lj, cj, pj] = await Promise.all([
    fetch(`${AT}/data/letters.json?${V}`).then(r => r.json()),
    fetch(`${AT}/data/correspondences.json?${V}`).then(r => r.json()),
    fetch(`./data/puzzles.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; SCHEMES = cj.schemes; PUZZLES = pj; ELEMENTS = pj.elements || {};
  notebook = new Notebook();

  $('puzzles').innerHTML = PUZZLES.puzzles.map(p =>
    `<button class="btn" data-id="${p.id}">${p.name} <span style="color:var(--gold-hi)">${p.arabic}</span></button>`).join('');
  for (const b of $('puzzles').querySelectorAll('.btn')) b.onclick = () => load(b.dataset.id);

  $('run').onclick = run;
  $('reset').onclick = () => { machine.reset(); sel = machine.hand.length ? 0 : -1; tool = null; paintAll(); paintLog(null); say(''); };
  $('tool-dot').onclick = () => { tool = tool === 'dot' ? null : 'dot'; sel = -1; paintHand(); say(tool ? 'Click a dotted letter on the board to move its dot: above → below → gone.' : ''); };
  $('tool-transpose').onclick = () => { tool = tool === 'transpose' ? null : 'transpose'; sel = -1; paintHand(); say(tool ? 'Click any block to read it in the other representation.' : ''); };
  $('tome-toggle').onclick = () => { paintNotebook(); $('tome').classList.toggle('open'); };
  $('tome-close').onclick = () => $('tome').classList.remove('open');
  $('reset-notebook').onclick = () => {
    if (!confirm('Erase the notebook — every claim and observation, in every game?')) return;
    notebook.erase();
    for (const s of SCHEMES) notebook.propose(s.id, { question: s.domain, text: s.name, kind: s.kind, source: s.source });
    paintNotebook();
  };

  paintRules();
  load(new URLSearchParams(location.search).get('p') || PUZZLES.puzzles[0].id);

  window.__machine = {
    get m() { return machine; }, get notebook() { return notebook; },
    load, run, LETTERS, SCHEMES, PUZZLES,
    // Play a puzzle's solver answer straight through — the browser-side check that
    // the shipped solution really wins in the shipped UI, not just in Node.
    selfTest(id) {
      load(id || machine.puzzle.id);
      const moves = { 'the-pipeline': [['place', 0, 1, 1], ['place', 0, 3, 1]],
                      'reckoning': [['place', 0, 1, 1], ['place', 0, 1, 3]],
                      'the-dot': [['place', 0, 1, 1], ['dot', 1, 1]],
                      'transposition': [['place', 0, 1, 1], ['tr', 0, 1]],
                      'wafq': [['place', 0, 1, 0], ['place', 0, 1, 2], ['place', 0, 3, 1]] }[machine.puzzle.id];
      for (const mv of moves) {
        if (mv[0] === 'place') machine.apply({ move: 'place', hand: mv[1], r: mv[2], c: mv[3] });
        else if (mv[0] === 'dot') { tool = 'dot'; cellClick(mv[1], mv[2]); tool = null; }
        else { tool = 'transpose'; cellClick(mv[1], mv[2]); tool = null; }
      }
      run();
      return { puzzle: machine.puzzle.id, ...machine.check() };
    },
  };
})();
