// ui.js — rendering per docs/UI_STYLE_GUIDE.md. Templates: Frontispiece,
// Itinerary, Folio, Seal-and-Line, Two-Page Spread, Player's Codex.
// Two-voice rule: world text arrives from content (Chronicle voice); everything
// authored here is Gloss voice — plain, ≤2 sentences, one question answered.

import { QUINTET } from './engine/state.js?v=3';
import { LEXICON } from '../content/lexicon.js?v=2';

const $ = (sel) => document.querySelector(sel);
export const app = () => $('#app');

const SCI = { kimiya: 'kīmiyā', limiya: 'līmiyā', himiya: 'hīmiyā', simiya: 'sīmiyā', rimiya: 'rīmiyā' };
const BAND_LABEL = {
  triumph: 'TRIUMPH', success: 'SUCCESS', qualified: 'QUALIFIED SUCCESS',
  ambiguous: 'AMBIGUOUS', backfire: 'BACKFIRE', disaster: 'DISASTER',
};
const GROUND = {
  'ATTESTED': { seal: '⬤', gloss: 'Attested: the sources record this directly.' },
  'PLAUSIBLE-GAP': { seal: '◐', gloss: 'Plausible: fits the record; the record itself is silent here.' },
  'INVENTED-COMPATIBLE': { seal: '○', gloss: 'Imagined: invented for play, built to be compatible with the world the sources describe.' },
};

const ROMAN = { 1: 'PHASE I', 2: 'PHASE II', 3: 'PHASE III', 4: 'PHASE IV', 5: 'PHASE V' };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The educational layer: wrap the first occurrence of each lexicon term in a
// glossed span (dotted underline, definition on hover/tap). Input must already be
// escaped. Longest terms first so "Ṭahawī Circle" wins over "Tetractys" nesting.
const LEX_TERMS = Object.keys(LEXICON).sort((a, b) => b.length - a.length);
function glossify(escaped) {
  let out = escaped;
  for (const term of LEX_TERMS) {
    const i = out.indexOf(term);
    if (i === -1) continue;
    // don't gloss inside an already-inserted span
    const before = out.slice(0, i);
    if ((before.match(/<span/g) || []).length !== (before.match(/<\/span>/g) || []).length) continue;
    out = before + `<span class="lex" data-gloss="${esc(LEXICON[term])}">${term}</span>` + out.slice(i + term.length);
  }
  return out;
}

// ---- margin column ----------------------------------------------------------

export function marginColumn(state, people, artifacts, tier) {
  const dots = (n, max, cls) =>
    Array.from({ length: max }, (_, i) => `<i class="dot ${i < n ? 'on ' + (cls || '') : ''}"></i>`).join('');
  const rep = (k) => {
    const v = state.rep[k];
    const cls = v > 0 ? 'pos' : v < 0 ? 'neg' : '';
    return `<div class="mrow" data-gloss="${esc(REP_GLOSS[k])}"><span>${k}</span><b class="${cls}">${v > 0 ? '+' + v : v}</b></div>`;
  };
  const sci = QUINTET.filter((k) => state.quintet[k] > 0)
    .map((k) => `<div class="mrow"><span>${SCI[k]}</span><b>${'●'.repeat(state.quintet[k])}</b></div>`).join('');
  const net = state.people.map((id) => `<div class="mrow person" data-gloss="${esc(people[id].gloss)}"><span>${esc(people[id].name)}</span></div>`).join('');
  const works = state.artifacts.map((id) => {
    const a = (artifacts || {})[id];
    return `<div class="mrow work" data-gloss="${esc(a ? a.gloss : '')}"><span>${esc(a ? a.name : id)}</span></div>`;
  }).join('');
  return `
  <aside class="margin-col">
    <div class="mblock" data-gloss="Seasons left in this phase. Every visit spends one. When they run out, only the departure remains.">
      <div class="mhead">TIME</div>
      <div class="mdots">${dots(state.time, Math.max(state.time, 9), 'time')}<span class="mnum">${state.time}</span></div>
    </div>
    <div class="mblock" data-gloss="${esc(tier ? tier.gloss : 'How visible your success has made you. It rises; it almost never falls.')}">
      <div class="mhead">EXPOSURE${tier ? ' · <span class="tier">' + esc(tier.label) + '</span>' : ''}</div>
      <div class="mdots">${dots(state.meters.exposure, 10, 'fire')}<span class="mnum">${state.meters.exposure}</span></div>
    </div>
    ${obligationsBlock(state)}
    ${contractsBlock(state)}
    <div class="mblock">
      <div class="mhead">THE WORK</div>
      <div class="mrow" data-gloss="How much of the universal system you understand — the connections drawn so far."><span>synthesis</span><b>${state.meters.synthesis}</b></div>
      <div class="mrow" data-gloss="How convincingly you can make the system work in front of people."><span>demonstration</span><b>${state.meters.demonstration}</b></div>
      <div class="mrow" data-gloss="How much of the system exists outside your own head — in students, verses, letters, copies."><span>transmission</span><b>${state.meters.transmission}</b></div>
    </div>
    <div class="mblock"><div class="mhead">STANDING</div>${['orthodox', 'occult', 'imperial', 'scholarly'].map(rep).join('')}</div>
    ${sci ? `<div class="mblock"><div class="mhead">SCIENCES</div>${sci}</div>` : ''}
    ${net ? `<div class="mblock"><div class="mhead">COMPANIONS</div>${net}</div>` : ''}
    ${works ? `<div class="mblock"><div class="mhead">WORKS</div>${works}</div>` : ''}
  </aside>`;
}

function obligationsBlock(state) {
  if (!state.obligations || !state.obligations.length) return '';
  const rows = state.obligations.map((o) =>
    `<div class="mrow ob" data-gloss="${esc(o.gloss || '')}"><span>${esc(o.name)}</span><b>⏳${o.cost}</b></div>`).join('');
  return `<div class="mblock"><div class="mhead">OBLIGATIONS</div>${rows}</div>`;
}

function contractsBlock(state) {
  const open = (state.contracts || []).filter((c) => c.status === 'open');
  if (!open.length) return '';
  const rows = open.map((c) => {
    const urgent = c.turnsLeft <= 2 ? ' urgent' : '';
    return `<div class="mrow contract${urgent}" data-gloss="${esc(c.promise + ' — a patron’s expectations, once raised, never come back down.')}"><span>${esc(c.name)}</span><b>${c.turnsLeft}⏳</b></div>`;
  }).join('');
  return `<div class="mblock"><div class="mhead">PROMISES</div>${rows}</div>`;
}

const REP_GLOSS = {
  orthodox: 'How safe you look to jurists and preachers. It will be spent defending you one day.',
  occult: 'How seriously the practitioners of the hidden sciences take you.',
  imperial: 'How useful you look to rulers and their servants. Cairo offers little of it — the courts come later.',
  scholarly: 'Your credit among the learned — the reputation that survives arguments.',
};

// ---- screens ----------------------------------------------------------------

export function renderTitle(hasSave) {
  app().innerHTML = `
  <div class="screen frontispiece">
    <div class="plate-frame title-plate">
      <img src="../assets/manuscripts/act1-ms-17c-opening.jpg" alt="Manuscript opening, Shams al-Maʿārif, early 17th century">
    </div>
    <h1 class="game-title">Ibn Turka<span class="title-sep">·</span>The Occult Court</h1>
    <p class="title-thesis">A career roguelike about making a universal science real</p>
    <p class="title-sub">A life in five phases · Cairo 1385 — exile 1432</p>
    <nav class="toc">
      <button class="toc-line" data-act="new"><span>Begin a Life</span><i class="toc-dots"></i><span class="toc-n">I</span></button>
      ${hasSave ? '<button class="toc-line" data-act="resume"><span>Continue</span><i class="toc-dots"></i><span class="toc-n">II</span></button>' : ''}
      <button class="toc-line" data-act="manual"><span>How to Read This Game</span><i class="toc-dots"></i><span class="toc-n">${hasSave ? 'III' : 'II'}</span></button>
    </nav>
    <p class="colophon-note">Built on the research of Matthew Melvin-Koushki · every situation carries its grounding seal</p>
  </div>`;
}

export function renderManual() {
  app().innerHTML = `
  <div class="screen manual">
    <div class="rubric">HOW TO READ THIS GAME</div>
    <div class="folio">
      <p class="manual-p"><b>The history.</b> Ṣāʾin al-Dīn ʿAlī ibn Turka of Isfahan (1369–1432) was real: Chief Judge of Isfahan, and the most systematic occult philosopher of Timurid Iran — a man who tried to turn the science of letters into a universal, mathematical science of everything, and paid for its success with three state inquisitions and exile. This game is built on the scholarship of Matthew Melvin-Koushki, quoted with permission. You are invited to lead this life differently — the game will tell you, at the end, how the record differs.</p>
      <p class="manual-p"><b>The seals and the words.</b> Every situation carries a seal — ⬤ attested, ◐ plausible, ○ imagined — click it for the source. Historical terms in the text (<span class="lex">muwaqqit</span>, <span class="lex">bazm</span>, <span class="lex">wafq</span>…) carry a dotted underline: hover or tap for what they really meant.</p>
    </div>
    <div class="folio">
      <p class="manual-p"><b>The life.</b> Five phases — Cairo, Isfahan, the courts, the pivot year, the trials. Each is a map of places to invest attention, and each visit costs one season. You will never see everything in a phase; that is the design, not a fault.</p>
      <p class="manual-p"><b>Obligations and promises.</b> An office (the judgeship) takes its season whether or not you are writing. A patron's commission has a deadline and a reward — and every commission you deliver raises what the next patron will demand.</p>
      <p class="manual-p"><b>The folio.</b> Each situation offers choices. Beneath every open choice you'll see <i>why you have it</i> — the teacher, science, or friendship that unlocked it. Locked choices stay visible with what they would need. Your preparation is always credited.</p>
      <p class="manual-p"><b>The seal.</b> Outcomes land on a ladder — triumph to disaster — tilted by what you bring, never a coin-flip. Every change is shown; nothing moves silently.</p>
      <p class="manual-p"><b>Memory.</b> When you're told <i>"this will be remembered,"</i> believe it. Some later situation reads that memory. Nothing in this world forgets.</p>
      <p class="manual-p"><b>Exposure.</b> Success makes you visible, and visibility is the whole indictment. Exposure rises and almost never falls; at each tier the world sends harder things at you. The three inquisitions are where it comes due.</p>
      <p class="manual-p"><b>The chronicle.</b> Your run writes itself as a chronicle, line by line, and hands it to you at the end. The small seals on each situation — ⬤ attested, ◐ plausible, ○ imagined — tell you honestly where history ends and the game begins.</p>
    </div>
    <button class="quiet-btn" data-act="back">↩ return to the frontispiece</button>
  </div>`;
}

export function renderMap(state, phase, nodes, nodeStatus, people, artifacts, firstVisit, tier) {
  const cells = nodes.map((n) => {
    const st = nodeStatus[n.id]; // 'open' | 'spent' | 'locked'
    const visits = state.visits[n.id] || 0;
    return `
    <button class="node ${st}${n.departure ? ' departure' : ''}" data-node="${n.id}" ${st === 'spent' ? 'disabled' : ''}>
      <span class="node-icon">${n.icon}</span>
      <span class="node-name">${esc(n.name)}</span>
      <span class="node-hook">${esc(st === 'spent' ? 'Nothing more calls you here.' : n.hook)}</span>
      <span class="node-cost">${n.departure ? 'ends the Cairo years' : '⏳ one season'}${visits ? ` · visited ${visits}×` : ''}</span>
    </button>`;
  }).join('');
  app().innerHTML = `
  <div class="screen with-margin">
    <main class="play-area">
      <div class="rubric">${ROMAN[phase.id]} · ${esc(phase.name)} · ${esc(phase.dateline)}</div>
      ${firstVisit ? `<p class="marginalia" data-note="map">Each place costs one season of your seven. Depth or breadth — returning somewhere twice goes deeper than seeing everywhere once. <button class="dismiss" data-dismiss="map">understood</button></p>` : ''}
      <div class="itinerary">${cells}</div>
    </main>
    ${marginColumn(state, people, artifacts, tier)}
  </div>`;
}

export function renderEncounter(state, enc, evaluated, people, artifacts, firstEnc, turnReport, tier) {
  const g = GROUND[enc.grounding];
  const opts = evaluated.map((ev, i) => {
    const o = ev.opt;
    if (ev.available) {
      const unlocked = ev.unlockedBy.length
        ? `<span class="unlockedby">— open to you because of ${esc(ev.unlockedBy.join(', '))}</span>` : '';
      const favored = ev.favoredBy.length
        ? `<span class="favoredby">favored by ${esc(ev.favoredBy.join(', '))}</span>` : '';
      return `
      <button class="option" data-opt="${i}">
        <span class="opt-label"><b class="opt-key">${i + 1}</b> ${esc(o.label)}</span>
        <span class="opt-detail">${esc(o.detail)}</span>
        ${unlocked}${favored}
      </button>`;
    }
    return `
    <div class="option locked">
      <span class="opt-label">${esc(o.label)}</span>
      <span class="opt-detail">${esc(o.detail)}</span>
      <span class="lockedby">🔒 ${esc(ev.lockedBy.join(' · '))}</span>
    </div>`;
  }).join('');
  app().innerHTML = `
  <div class="screen with-margin">
    <main class="play-area">
      ${turnReportBanner(turnReport)}
      <div class="folio">
        <div class="rubric">${esc(enc.rubric)}</div>
        ${enc.plate ? `<figure class="plate-frame"><img src="${esc(enc.plate.src)}" alt=""><figcaption>${esc(enc.plate.caption)}</figcaption></figure>` : ''}
        <p class="situation">${glossify(esc(enc.situation))}
          <button class="ground-seal" data-gloss="${esc(g.gloss)} Source: ${esc(enc.source)}">${g.seal} ${enc.grounding.split('-')[0].toLowerCase()}</button>
        </p>
        ${firstEnc ? `<p class="marginalia" data-note="enc">Open choices show <i>why</i> you have them; locked ones show what they'd need. What you study and whom you befriend decides which doors exist. <button class="dismiss" data-dismiss="enc">understood</button></p>` : ''}
        <div class="options">${opts}</div>
      </div>
    </main>
    ${marginColumn(state, people, artifacts, tier)}
  </div>`;
}

export function renderResolution(state, enc, result, people, artifacts, firstRes, tier) {
  const chips = result.deltas.filter((d) => d.kind !== 'time').map((d) => {
    if (d.kind === 'meter') return chip(d.d > 0 ? 'up' : 'down', `${d.key} ${d.d > 0 ? '+' + d.d : d.d}`, d.key === 'exposure' ? 'fire' : '');
    if (d.kind === 'rep') return chip(d.d > 0 ? 'up' : 'down', `${d.key} standing ${d.d > 0 ? '+' + d.d : d.d}`);
    if (d.kind === 'quintet') return chip('up', `${SCI[d.key]} ${'●'.repeat(state.quintet[d.key])}`);
    if (d.kind === 'person') return chip('gain', `${people[d.key].name} joins your circle`);
    if (d.kind === 'access') return chip('gain', `access: ${d.key.replace(/_/g, ' ')}`);
    if (d.kind === 'artifact') return chip('gain', ((artifacts || {})[d.key] || { name: 'a work' }).name + ' — now among your works');
    return '';
  }).join('');
  const mem = result.memWrites.length
    ? `<p class="mem-note">✎ This will be remembered${result.memWrites.length > 1 ? ` (${result.memWrites.length} things noted)` : ''}.</p>` : '';
  app().innerHTML = `
  <div class="screen with-margin">
    <main class="play-area">
      <div class="folio resolution">
        <div class="seal band-${result.band}">${BAND_LABEL[result.band]}</div>
        <p class="outcome-text">${esc(result.text)}</p>
        <div class="delta-chips">${chips}</div>
        ${mem}
        ${firstRes ? `<p class="marginalia" data-note="res">The seal is the outcome's rank on a six-step ladder — your preparation tilted the odds. The italic line below joins your chronicle. <button class="dismiss" data-dismiss="res">understood</button></p>` : ''}
        ${result.chronicleLine ? `<p class="chron-line" id="chron-ink"></p>` : ''}
        <button class="continue-btn">continue ⤳</button>
      </div>
    </main>
    ${marginColumn(state, people, artifacts, tier)}
  </div>`;
  if (result.chronicleLine) inkIn($('#chron-ink'), '“' + result.chronicleLine + '”');
}

function chip(dir, text, extra) {
  const glyph = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '✚';
  return `<span class="chip ${dir} ${extra || ''}">${glyph} ${esc(text)}</span>`;
}

export function renderEnding(state, verdict, people, phases) {
  const byPhase = (phases || []).map((p) => {
    const lines = state.chronicle.filter((l) => l.phase === p.id);
    if (!lines.length) return '';
    return `<div class="codex-phase"><div class="rubric">${ROMAN[p.id]} · ${esc(p.name)}</div>` +
      lines.map((l) => `<p class="codex-line band-t-${l.band}">${esc(l.text)}</p>`).join('') + '</div>';
  }).join('');
  const notes = (verdict.notes || []).map((n) => `<p class="verdict-note">· ${esc(n)}</p>`).join('');
  app().innerHTML = `
  <div class="screen ending">
    <div class="rubric">1432 · THE ACCOUNT IS CLOSED</div>
    <div class="spread">
      <div class="folio page">
        <div class="page-head">THE MAN</div>
        <h2 class="verdict-title">${esc(verdict.man.title)}</h2>
        <p class="verdict-text">${esc(verdict.man.text)}</p>
        <div class="page-stats">
          ${['orthodox', 'occult', 'imperial', 'scholarly'].map((k) => `<span class="chip">${k} ${state.rep[k] > 0 ? '+' + state.rep[k] : state.rep[k]}</span>`).join('')}
          <span class="chip fire">exposure ${state.meters.exposure}</span>
        </div>
      </div>
      <div class="folio page">
        <div class="page-head">THE SYSTEM</div>
        <h2 class="verdict-title">${esc(verdict.system.title)}</h2>
        <p class="verdict-text">${esc(verdict.system.text)}</p>
        <div class="page-stats">
          <span class="chip">synthesis ${state.meters.synthesis}</span>
          <span class="chip">transmission ${state.meters.transmission}</span>
          <span class="chip">${state.people.length} companion${state.people.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
    ${notes ? `<div class="folio verdict-margin"><div class="page-head">MARGINALIA</div>${notes}</div>` : ''}
    <div class="folio verdict-margin attested-life">
      <div class="page-head">THE ATTESTED LIFE</div>
      <p class="verdict-note attested-intro">What the record says of the historical Ṣāʾin al-Dīn ʿAlī ibn Turka (1369–1432) — beside the life you led:</p>
      ${attestedComparison(state)}
    </div>
    <div class="folio codex">
      <div class="rubric">THE CHRONICLE OF ʿALĪ IBN TURKA</div>
      ${byPhase || '<p class="codex-line">— the pages are blank —</p>'}
      <p class="codex-note">In a later build this chronicle becomes yours to keep and emend, as its historian.</p>
    </div>
    <button class="toc-line center" data-act="restart"><span>Begin another life</span></button>
  </div>`;
}


export function renderPhaseIntro(phase, state) {
  app().innerHTML = `
  <div class="screen phase-intro">
    <div class="rubric">${ROMAN[phase.id]} · ${esc(phase.dateline)}</div>
    <h1 class="phase-title">${esc(phase.name)}</h1>
    <div class="folio">
      <p class="phase-blurb">${glossify(esc(phase.intro))}</p>
      <p class="phase-budget">⏳ ${phase.time} seasons${state.obligations && state.obligations.length ? ' · standing obligations: ' + state.obligations.map((o) => esc(o.name)).join(', ') : ''}</p>
    </div>
    <button class="toc-line center begin-phase-btn"><span>Begin ⤳</span></button>
  </div>`;
}

export function renderColophon(state, phase, settled) {
  const lines = state.chronicle.filter((l) => l.phase === phase.id);
  const pivotal = lines.slice(-3).map((l) => `<p class="verdict-note">· ${esc(l.text)}</p>`).join('');
  app().innerHTML = `
  <div class="screen colophon">
    <div class="rubric">HERE ENDS ${ROMAN[phase.id]}</div>
    <div class="folio">
      <div class="page-head">${esc(phase.name)} · ${esc(phase.dateline)}</div>
      ${pivotal || '<p class="verdict-note">· little was written of these years ·</p>'}
      ${settled && settled.length ? '<div class="turn-report" style="margin-top:1rem">' + settled.map((c) => c.outcome === 'delivered'
        ? `<span class="chip gain">✔ ${esc(c.contract.name)} delivered — expectations rise</span>`
        : `<span class="chip down">✘ ${esc(c.contract.name)} came due unfulfilled</span>`).join('') + '</div>' : ''}
      <div class="delta-chips" style="margin-top:1rem">
        <span class="chip">synthesis ${state.meters.synthesis}</span>
        <span class="chip">transmission ${state.meters.transmission}</span>
        <span class="chip fire">exposure ${state.meters.exposure}</span>
        <span class="chip">${state.people.length} companion${state.people.length === 1 ? '' : 's'}</span>
      </div>
    </div>
    <button class="toc-line center next-phase-btn"><span>The years turn ⤳</span></button>
  </div>`;
}

function turnReportBanner(r) {
  if (!r) return '';
  const bits = [];
  for (const o of r.obligations || []) {
    bits.push(o.paid
      ? `<span class="chip">⚖ ${esc(o.ob.name)} took its season</span>`
      : `<span class="chip down">⚖ ${esc(o.ob.name)} went unserved</span>`);
  }
  for (const c of r.contracts || []) {
    bits.push(c.outcome === 'delivered'
      ? `<span class="chip gain">✔ ${esc(c.contract.name)} delivered — expectations rise</span>`
      : `<span class="chip down">✘ ${esc(c.contract.name)} failed at its deadline</span>`);
  }
  return bits.length ? `<div class="turn-report">${bits.join('')}</div>` : '';
}

// The educational payoff: the historical record, line by line, each paired with
// what happened in THIS run. Chronicle voice for history, plain contrast after the em-dash.
function attestedComparison(state) {
  const m = state.memory;
  const rows = [];
  const row = (hist, yours) => rows.push(`<p class="verdict-note"><b class="att-hist">${hist}</b> — ${yours}</p>`);

  row('He studied in Cairo under Sayyid Ḥusayn Akhlāṭī, lettrist, alchemist and geomancer.',
    m.circle_member ? 'so did you.' : 'you never entered the circle — a formation the historical man could not have skipped.');
  row('He served as Chief Judge of Isfahan, famous for defending the weak against the powerful.',
    m.took_judgeship ? (m.defended_weak ? 'you took the bench and ruled as he did.' : 'you took the bench; whether you used it as he did, your chronicle knows.') : 'you refused the bench he was defined by.');
  row('In 1420 he completed Investigations — the first systematic summa of Islamic lettrism — as Ulugh Beg broke ground on the Samarkand observatory.',
    m.investigations_begun ? 'your summa exists.' : 'your summa was never written — the counterfactual is total.');
  row('His central diagram, the Ṭahawī Circle, survives in his own handwriting (Tehran, Majlis Library MS 10196, f. 63a).',
    m.tahawi_circle ? 'you drew it.' : 'you never drew the Circle; your system has no surviving image.');
  row('He faced three state inquisitions engineered by rival colleagues: he won the first two and lost the third, c. 1427.',
    m.third_inquisition === 'lost' ? 'the same road, ending the same way.'
      : m.third_inquisition === 'survived' ? 'you survived all three — a thing the record does not grant the historical man.'
      : m.recanted ? 'you bent, which the record says he refused to do.'
      : 'the third tribunal never reached you.');
  row('Qāsim-i Anvār, his Cairo companion, was exiled in 1427 over the same lettrist associations.',
    m.qasim_defended ? 'you stood by him.' : m.qasim_abandoned ? 'you let him go alone.' : 'in your life the friendship never came to its test.');
  row('He died in 1432, impoverished and in legal limbo, after five years of wandering exile; Yazdī — who copied his autograph — outlived him by twenty-two years, and the platform they built became imperial cosmology across six court cultures.',
    (m.yazdi_copied || m.yazdi_keeps) ? 'your Yazdī carries the copy too.' : 'your Yazdī never copied the work — history’s own transmission route, closed.');
  return rows.join('');
}

// ---- flourishes -------------------------------------------------------------

export function inkIn(el, text) {
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { el.textContent = text; return; }
  el.textContent = '';
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) el._t = setTimeout(tick, 18);
  };
  tick();
  el.addEventListener('click', () => { clearTimeout(el._t); el.textContent = text; }, { once: true });
}

// Gloss tooltips: one shared element, follows data-gloss hovers/taps.
export function bindGlosses() {
  let tip = $('#gloss-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'gloss-tip';
    document.body.appendChild(tip);
  }
  document.body.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-gloss]');
    if (!t) { tip.classList.remove('show'); return; }
    tip.textContent = t.getAttribute('data-gloss');
    const r = t.getBoundingClientRect();
    tip.style.top = Math.max(8, r.bottom + 6) + 'px';
    tip.style.left = Math.min(window.innerWidth - 290, Math.max(8, r.left)) + 'px';
    tip.classList.add('show');
  });
  document.body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-gloss]');
    if (t) {
      tip.textContent = t.getAttribute('data-gloss');
      const r = t.getBoundingClientRect();
      tip.style.top = Math.max(8, r.bottom + 6) + 'px';
      tip.style.left = Math.min(window.innerWidth - 290, Math.max(8, r.left)) + 'px';
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 4000);
    }
  });
}
