// ui.js — the Scriptorium: an IDE for metaphysics.
//
//     LETTER PALETTE → PROGRAM → PREVIEW → INSCRIBE → WORLD STATE
//
// Everything here is presentation. The rules live in ../../engine/, the evidence
// in ../../data/letters.json, and the doctrine in ../../rulesets/rulesets.json.
// This file is not allowed to know what ب does — it asks.

import { World } from '../../../engine/world.js?v=1';
import { compile, preview, execute, describeLetter } from '../../../engine/vm.js?v=1';
import { Iso, PALETTE } from './iso.js?v=1';

const V = 'v=1';
const $ = id => document.getElementById(id);

let LETTERS = [], PACK = null, TASKS = null;
let ruleset = null, register = 'written';
let program = [];              // [{ glyph, register }]
let world = null, undoStack = [];
let cursor = [2, 0, 0];
let selected = null;           // glyph shown in the letter frame
let iso = null, lastPreview = null, task = null;

/* --------------------------------------------------------------- the world -- */

function freshWorld() {
  const w = new World({ rules: { gravity: false } });
  if (task && task.world) for (const c of task.world) w.set(c.x, c.y, c.z, c);
  return w;
}

function pushUndo() {
  if (!ruleset.reversible) return;
  undoStack.push(world.clone());
  if (undoStack.length > 40) undoStack.shift();
}

/* ------------------------------------------------------------------ compile -- */

function current() {
  return compile(program.map(p => ({ ...p })), { letters: LETTERS, ruleset });
}

function refresh() {
  const c = current();
  lastPreview = preview(world, c, { cursor });
  iso.frame(lastPreview.world, [cursor]);
  iso.draw(world, lastPreview.effects, { cursor, ghostWorld: lastPreview.world });
  paintEffects(c, lastPreview);
  paintProgram();
  paintPower(c);
  paintTaskVerdict();
}

/* ------------------------------------------------------------------- paint -- */

function opBadge(ops) {
  const short = { AXIS: '|', RAISE: '↑', LOWER: '↓', BIND: '○', POUR: '⌐',
                  SEVER: '×', ASSIMILATE: '=', DISTINGUISH: '≠' };
  return ops.map(o => short[o.op] || '?').join('');
}

function paintPalette() {
  $('palette').innerHTML = LETTERS.map(l => {
    const granted = l.primitives.filter(p =>
      ruleset.grants.includes(p.op) && !(ruleset.denies && ruleset.denies[p.op]));
    return `<div class="lt${l.class === 'zulmani' ? ' dark' : ''}${selected === l.glyph ? ' sel' : ''}${granted.length ? '' : ' mute'}"
      data-g="${l.glyph}" title="${l.name} · ${l.abjad}">
      <span class="ops">${opBadge(granted)}</span>
      <span class="g">${l.glyph}</span><span class="v">${l.abjad}</span></div>`;
  }).join('');
  for (const el of $('palette').querySelectorAll('.lt')) {
    el.onclick = () => { program.push({ glyph: el.dataset.g, register }); selectLetter(el.dataset.g); refresh(); };
    el.onmouseenter = () => selectLetter(el.dataset.g);
  }
}

function paintProgram() {
  const c = current();
  if (!program.length) { $('program').innerHTML = '<span class="empty">Empty. Click letters to compose.</span>'; return; }
  const gem = new Set(c.instructions.filter(i => i.geminated).map(i => i.glyph));
  $('program').innerHTML = program.map((p, i) => {
    const l = LETTERS.find(x => x.glyph === p.glyph);
    return `<div class="pg${l.class === 'zulmani' ? ' dark' : ''}${gem.has(p.glyph) ? ' gem' : ''}"
      data-i="${i}" title="${l.name} · ${l.abjad} · ${p.register} — click to remove">
      ${p.glyph}<span class="n">${l.abjad}</span></div>`;
  }).join('');
  for (const el of $('program').querySelectorAll('.pg')) {
    el.onclick = () => { program.splice(+el.dataset.i, 1); refresh(); };
  }
}

function paintPower(c) {
  const p = c.power;
  const pct = Math.round((p.value ?? 0) * 100);
  $('power').textContent = `${p.rule} · strength ${pct}% — ${p.why}`;
  $('power').style.color = pct === 0 ? '#f0b98a' : pct >= 90 ? 'var(--gold-hi)' : 'var(--paper)';
}

function paintEffects(c, pv) {
  const rows = [];
  for (const w of pv.warnings) rows.push(`<li class="bad">${w}</li>`);
  for (const e of pv.effects) {
    const cls = e.kind === 'sever' || e.kind === 'refused' ? 'bad'
              : e.kind === 'join' || e.kind === 'bind' ? 'tie' : '';
    rows.push(`<li class="${cls}"><span class="op">${e.glyph || ''} ${e.op || e.kind}</span> — ${e.detail}` +
      (e.from ? `<br><span style="color:var(--dim);font-style:italic">${e.from}</span>` : '') + `</li>`);
  }
  $('effects').innerHTML = rows.join('') || '<li style="color:var(--dim)">Nothing yet.</li>';

  const refused = c.diagnostics.filter(d => d.level === 'refused' || d.level === 'error');
  $('diagnostics').classList.toggle('hidden', !refused.length);
  if (refused.length) {
    $('diagnostics').innerHTML = `<h4>${ruleset.name} refuses</h4>` + refused.map(d =>
      `<p><b>${d.glyph || ''} ${d.op || ''}</b> ${d.why}${d.from ? `<br><span style="color:var(--dim);font-style:italic">granted by: ${d.from}</span>` : ''}</p>`).join('');
  }
}

/** The Letter Property Frame: evidence above, affordance below, ours marked. */
function selectLetter(glyph) {
  selected = glyph;
  const d = describeLetter(glyph, { letters: LETTERS, ruleset, registers: PACK.registers });
  if (!d) return;
  const f = d.form, g = d.grammar;
  const facts = [
    f.orientation === 'vertical' ? 'a single upright stroke' : `${f.orientation} form`,
    f.dots ? `${f.dots} dot${f.dots > 1 ? 's' : ''} ${f.dot_position}` : 'no dots',
    f.closed ? 'closed' : 'open',
    f.tail ? 'a descending tail' : 'no tail',
  ].join(' · ');

  $('letter-frame').innerHTML = `
    <div id="letterhead">
      <span class="big">${d.glyph}</span>
      <span>
        <b>${d.name}</b> <span class="meta">${d.translit}</span><br>
        <span class="meta">abjad ${d.abjad} · ${d.class === 'nurani' ? 'luminous (nūrānī)' : 'dark (ẓulmānī)'}
        · ${g.sun ? 'sun letter' : 'moon letter'} · ${g.connects_forward ? 'joins forward' : 'joins nothing after it'}</span>
      </span>
    </div>

    <h4 style="margin-top:.6rem">Form <span class="pill PORTAL">observable</span></h4>
    <p>${facts}${g.articulation ? ` · made at the ${g.articulation}` : ''}</p>

    <h4>Under ${d.ruleset.name} <span class="pill ${d.ruleset.kind}">${d.ruleset.kind}</span></h4>
    <ul class="oplist">
      ${d.granted.map(p => `<li><b>${p.op}</b>${p.n > 1 ? ` ×${p.n}` : ''} —
        <span class="from">${p.from}</span></li>`).join('')}
      ${d.refused.map(p => `<li class="no"><b>${p.op}</b> — ${p.why}</li>`).join('')}
      ${!d.granted.length && !d.refused.length ? '<li class="no">nothing</li>' : ''}
    </ul>

    <h4>Registers</h4>
    <p>${d.registers.map(r => r.allowed
        ? `<span class="pill PORTAL">${r.id}</span>`
        : `<span class="pill" style="opacity:.4;text-decoration:line-through">${r.id}</span>`).join(' ')}</p>

    ${d.note ? `<h4>In the tradition</h4><p>${d.note}</p>` : ''}

    <h4>What here is ours <span class="pill INTERPRETATION">INTERPRETATION</span></h4>
    <p>${d.ruleset.interpretation_note}</p>`;
  paintPalette();
}

function paintRulesetFrame() {
  const r = ruleset;
  $('ruleset-frame').innerHTML = `
    <h4>${r.name} <span class="pill ${r.kind}">${r.kind}</span></h4>
    <div class="kv">
      <dt>motive</dt><dd>${r.motive}</dd>
      <dt>period</dt><dd>${r.period || '<span style="color:var(--dim)">no historical claim</span>'}</dd>
      <dt>strength</dt><dd>${r.power.detail}</dd>
      <dt>registers</dt><dd>${r.registers.join(', ')}</dd>
      <dt>reversible</dt><dd>${r.reversible ? 'yes' : '<b style="color:var(--verm)">no — nothing done here can be undone</b>'}</dd>
    </div>
    ${Object.keys(r.denies || {}).length ? `<h4 style="margin-top:.45rem">Refuses</h4>` +
      Object.entries(r.denies).map(([op, why]) => `<p><b>${op}</b> — ${why}</p>`).join('') : ''}
    ${r.sources.length ? `<h4 style="margin-top:.45rem">Rests on</h4>` +
      r.sources.map(s => `<p><b>${s.slug}</b> — ${s.supports}</p>`).join('') : ''}
    <h4 style="margin-top:.45rem">Ours, not theirs</h4><p>${r.interpretation_note}</p>`;
}

function paintPrimitives() {
  $('primitives').innerHTML = Object.entries(PACK.primitives).map(([op, p]) =>
    `<dt>${op}</dt><dd>${p.gloss}</dd>`).join('');
}

/* ------------------------------------------------------------------- tasks -- */

function paintTaskVerdict() {
  if (!task) { $('verdict').className = ''; $('verdict').textContent = ''; return; }
  const r = checkTask(world);
  $('verdict').className = r.win ? 'win' : 'lose';
  $('verdict').textContent = (r.win ? '✓ ' : '') + r.detail;
}

function checkTask(w) {
  if (!task || !task.goal) return { win: false, detail: '' };
  const g = task.goal;
  if (g.type === 'value-at') {
    const c = w.get(...g.at);
    return { win: !!c && c.value === g.value,
             detail: c ? `${g.at.join(',')} holds ${c.value}; wanted ${g.value}` : `${g.at.join(',')} is empty; wanted ${g.value}` };
  }
  if (g.type === 'one-body') {
    const glyphs = w.list().filter(c => c.glyph);
    if (glyphs.length < g.min_letters) return { win: false, detail: `${glyphs.length} letters standing; need ${g.min_letters}` };
    const body = w.body(`${glyphs[0].x},${glyphs[0].y},${glyphs[0].z}`);
    const all = glyphs.every(c => body.has(`${c.x},${c.y},${c.z}`));
    return { win: all, detail: all ? `all ${glyphs.length} letters are one body` : `${body.size} of ${glyphs.length} letters are joined` };
  }
  if (g.type === 'survives-gravity') {
    const test = w.clone();
    test.rules.gravity = true;
    test.settle();
    const still = test.list().filter(c => c.glyph && c.y >= g.above).length;
    return { win: still >= g.count, detail: `${still} letters would remain above y=${g.above} under gravity; need ${g.count}` };
  }
  return { win: false, detail: 'unknown goal' };
}

function loadTask(id) {
  task = TASKS.tasks.find(t => t.id === id) || null;
  $('task').innerHTML = task
    ? `<b>${task.name}</b> — ${task.brief}<br><span style="color:var(--dim)">${task.teaches}</span>`
    : 'Free build. No goal; the world is yours.';
  if (task && task.ruleset) setRuleset(task.ruleset, { keepTask: true });
  world = freshWorld();
  undoStack = [];
  program = [];
  cursor = (task && task.cursor) || [2, 0, 0];
  for (const b of $('tasks').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === (task ? task.id : 'free'));
  refresh();
}

/* -------------------------------------------------------------------- boot -- */

function setRuleset(id, { keepTask = false } = {}) {
  ruleset = PACK.rulesets.find(r => r.id === id) || PACK.rulesets[0];
  if (!ruleset.registers.includes(register)) register = ruleset.registers[ruleset.registers.length - 1];
  for (const b of $('rulesets').querySelectorAll('.btn')) b.classList.toggle('active', b.dataset.id === ruleset.id);
  program = program.map(p => ({ ...p, register }));
  paintRulesetFrame();
  paintRegisters();
  paintPalette();
  if (selected) selectLetter(selected);
  $('undo').disabled = !ruleset.reversible;
  if (!keepTask) refresh();
}

function paintRegisters() {
  $('registers').innerHTML = Object.entries(PACK.registers)
    .filter(([k]) => k !== '_grounding')
    .map(([k, r]) => {
      const ok = ruleset.registers.includes(k);
      return `<button class="btn${k === register ? ' active' : ''}" data-r="${k}" ${ok ? '' : 'disabled'}
        title="${r.persists ? 'persists in the world' : r.touches_world ? 'acts once, then passes' : 'never touches the world'}">
        ${k}</button>`;
    }).join('');
  for (const b of $('registers').querySelectorAll('.btn')) {
    b.onclick = () => { register = b.dataset.r; program = program.map(p => ({ ...p, register })); paintRegisters(); refresh(); };
  }
}

(async function main() {
  const [lj, pj, tj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
    fetch(`./tasks.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; PACK = pj; TASKS = tj;

  $('rulesets').innerHTML = PACK.rulesets.map(r =>
    `<button class="btn wide" data-id="${r.id}" style="margin-bottom:3px">${r.name}
      <span class="pill ${r.kind}" style="float:right">${r.kind}</span></button>`).join('');
  for (const b of $('rulesets').querySelectorAll('.btn')) b.onclick = () => setRuleset(b.dataset.id);

  $('tasks').innerHTML = `<button class="btn" data-id="free">Free build</button>` +
    TASKS.tasks.map(t => `<button class="btn" data-id="${t.id}">${t.name}</button>`).join('');
  for (const b of $('tasks').querySelectorAll('.btn')) b.onclick = () => loadTask(b.dataset.id);

  iso = new Iso($('cv'));
  const resize = () => { iso.resize(); if (world) refresh(); };
  addEventListener('resize', resize);

  $('cv').addEventListener('click', ev => {
    const r = $('cv').getBoundingClientRect();
    cursor = iso.unproject(ev.clientX - r.left, ev.clientY - r.top, cursor[1]);
    refresh();
  });
  addEventListener('keydown', ev => {
    if (ev.key === 'PageUp')   { cursor = [cursor[0], cursor[1] + 1, cursor[2]]; refresh(); }
    if (ev.key === 'PageDown') { cursor = [cursor[0], Math.max(0, cursor[1] - 1), cursor[2]]; refresh(); }
    if (ev.key === 'Enter')    commit();
    if (ev.key === 'Backspace' && program.length) { program.pop(); refresh(); }
  });

  $('run').onclick = refresh;
  $('commit').onclick = commit;
  $('clear-prog').onclick = () => { program = []; refresh(); };
  $('undo').onclick = () => { if (undoStack.length) { world = undoStack.pop(); refresh(); } };
  $('reset').onclick = () => { world = freshWorld(); undoStack = []; refresh(); };

  paintPrimitives();
  setRuleset(PACK.rulesets[0].id, { keepTask: true });
  selectLetter('ب');
  iso.resize();
  loadTask(TASKS.tasks[0].id);

  window.__scriptorium = {
    get world() { return world; }, get program() { return program; }, get ruleset() { return ruleset; },
    LETTERS, PACK, TASKS, iso,
    setRuleset, loadTask, refresh, checkTask,
    write(str, reg = register) { program = [...str].map(g => ({ glyph: g, register: reg })); refresh(); return current(); },
    commit,
    /** Play a task's stated solution through the real UI path. */
    selfTest(id) {
      const t = TASKS.tasks.find(x => x.id === id);
      loadTask(t.id);
      for (const step of t.solution) {
        if (step.ruleset) setRuleset(step.ruleset);
        program = [...step.write].map(g => ({ glyph: g, register: step.register }));
        commit();
      }
      return { task: t.id, ...checkTask(world) };
    },
  };
})();

function commit() {
  const c = current();
  if (c.power.value === 0) { paintEffects(c, { effects: [], warnings: [c.power.why] }); return; }
  pushUndo();
  const r = execute(world, c, { cursor });
  program = [];
  refresh();
  paintEffects(c, r);
}
