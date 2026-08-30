// ui.js — DOM rendering for every screen: title, act-intro, choice, consequence, ending.
// Visual language: parchment cards over deep navy, real manuscript backdrops,
// per-science identity colors (matching the pitch art's skill key), and a geometric
// eight-pointed khatam seal drawn as inline SVG — pure geometry as UI ornament,
// never presented as historical manuscript art.

import { SCIENCE_COLORS, SCIENCE_LABELS } from './assets.js?v=6';

const GROUNDING_TIPS = {
  'ATTESTED': 'This juncture is directly documented in the historical record.',
  'PLAUSIBLE-GAP': 'A real, documented life-transition; the sources are silent on the decision itself.',
  'INVENTED-COMPATIBLE': 'Not attested — invented for pacing, consistent with the attested world.',
};

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

// Eight-pointed star (two overlapping rotated squares) — the khatam/rub-el-hizb
// geometry ubiquitous in Islamicate ornament. Drawn from math, tinted per context.
function seal(color, size) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '-50 -50 100 100');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('seal');
  const sq = (rot, opacity) => {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', -30); r.setAttribute('y', -30);
    r.setAttribute('width', 60); r.setAttribute('height', 60);
    r.setAttribute('transform', `rotate(${rot})`);
    r.setAttribute('fill', 'none');
    r.setAttribute('stroke', color);
    r.setAttribute('stroke-width', 2.4);
    r.setAttribute('opacity', opacity);
    return r;
  };
  svg.appendChild(sq(0, 0.9));
  svg.appendChild(sq(45, 0.9));
  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('r', 4.5);
  dot.setAttribute('fill', color);
  svg.appendChild(dot);
  return svg;
}

function ornamentRule(color) {
  const wrap = el('div', 'ornament-rule');
  wrap.appendChild(el('span', 'ornament-line'));
  wrap.appendChild(seal(color || '#9c7a2e', 22));
  wrap.appendChild(el('span', 'ornament-line'));
  return wrap;
}

export function renderTitle({ hasSave, onBegin, onResume }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-title';

  const wrap = el('div', 'title-card veiled');
  wrap.style.setProperty('--veil-img', "url('../../assets/manuscripts/act8-printed-teardrop-cosmogram-p256.jpg')");

  const inner = el('div', 'veiled-inner');
  inner.appendChild(seal('#e8cf8a', 44));
  inner.appendChild(el('div', 'title-eyebrow', 'A VISUAL NOVEL — PROTOTYPE'));
  inner.appendChild(el('h1', 'title-h1', 'Ibn Turka'));
  inner.appendChild(el('p', 'title-sub', 'Choices. Knowledge. Power. Consequence.'));
  inner.appendChild(el('p', 'title-desc',
    'Play through the life of Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī — judge, philosopher, ' +
    'occultist — across 40 choices and eight acts. What you build, who you trust, and what ' +
    'you refuse to give up all shape which of several possible lives you end up living.'));

  const actions = el('div', 'title-actions');
  const beginBtn = el('button', 'option-btn primary', hasSave ? 'Begin a new life' : 'Begin');
  beginBtn.addEventListener('click', onBegin);
  actions.appendChild(beginBtn);
  if (hasSave) {
    const resumeBtn = el('button', 'option-btn ghost', 'Continue your story');
    resumeBtn.addEventListener('click', onResume);
    actions.appendChild(resumeBtn);
  }
  inner.appendChild(actions);
  inner.appendChild(el('p', 'title-hint', 'Tip: press 1–5 to choose, Enter to continue.'));

  wrap.appendChild(inner);
  app.appendChild(wrap);
}

export function renderActIntro({ act, actNumber, backdropUrl, onContinue }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-act';

  const wrap = el('div', 'act-card veiled');
  if (backdropUrl) wrap.style.setProperty('--veil-img', `url('${backdropUrl}')`);

  const inner = el('div', 'veiled-inner');
  inner.appendChild(el('div', 'act-eyebrow', `ACT ${['I','II','III','IV','V','VI','VII','VIII'][actNumber - 1] || actNumber}`));
  inner.appendChild(el('h1', 'act-h1', act.title.replace(/^Act [IVX]+ — /, '')));
  inner.appendChild(ornamentRule('#e8cf8a'));
  inner.appendChild(el('p', 'act-text', act.text));

  const btn = el('button', 'option-btn primary', 'Continue');
  btn.addEventListener('click', onContinue);
  inner.appendChild(btn);

  wrap.appendChild(inner);
  app.appendChild(wrap);
}

function actProgress(state, choice) {
  const bar = el('div', 'act-progress');
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', `Choice ${state.globalIndex + 1} of 40`);
  bar.setAttribute('aria-valuenow', state.globalIndex + 1);
  bar.setAttribute('aria-valuemax', 40);
  for (let act = 1; act <= 8; act++) {
    const seg = el('div', 'act-seg');
    const done = state.history.filter((h) => h.act === act).length;
    const fill = el('div', 'act-seg-fill');
    fill.style.width = `${(done / 5) * 100}%`;
    seg.appendChild(fill);
    if (act === choice.act) seg.classList.add('current');
    bar.appendChild(seg);
  }
  return bar;
}

export function renderChoice({ choice, sceneText, actTitle, backdropUrl, state, onPick }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-choice';

  const wrap = el('div', 'scene');

  if (backdropUrl) {
    const frame = el('div', 'backdrop-frame');
    const img = el('img', 'backdrop');
    img.src = backdropUrl;
    img.alt = `${actTitle} — manuscript backdrop`;
    img.loading = 'eager';
    frame.appendChild(img);
    wrap.appendChild(frame);
  }

  const topRow = el('div', 'top-row');
  topRow.appendChild(el('div', 'act-badge', actTitle));
  const grounding = choice.grounding.split(' ')[0];
  const badge = el('span', 'grounding-badge', grounding);
  badge.title = GROUNDING_TIPS[grounding] || choice.grounding;
  badge.setAttribute('tabindex', '0');
  topRow.appendChild(badge);
  wrap.appendChild(topRow);

  wrap.appendChild(el('h2', null, choice.title));
  wrap.appendChild(el('p', 'scene-text dropcap', sceneText));

  const optionsEl = el('div', 'options');
  const available = choice.options.filter((o) => state.optionAvailable(o));
  const unavailable = choice.options.filter((o) => !state.optionAvailable(o));

  available.forEach((opt, i) => {
    const btn = el('button', 'option-btn option-btn-detailed');
    const key = el('span', 'option-key', String(i + 1));
    const body = el('span', 'option-body');
    body.appendChild(el('span', 'option-label', opt.label));
    if (opt.detail) body.appendChild(el('span', 'option-detail', opt.detail));
    btn.appendChild(key);
    btn.appendChild(body);
    btn.addEventListener('click', () => onPick(opt));
    optionsEl.appendChild(btn);
  });
  wrap.appendChild(optionsEl);

  if (unavailable.length) {
    const note = el('p', 'gated-note');
    note.appendChild(el('span', 'gated-mark', '⊘ '));
    note.appendChild(document.createTextNode(
      `Not open to you here: ${unavailable.map((o) => o.label).join('; ')} — an earlier choice closed this door.`));
    wrap.appendChild(note);
  }

  app.appendChild(wrap);
  app.appendChild(renderSkillPanel(state));
  app.appendChild(actProgress(state, choice));
}

export function renderConsequence({ text, skillGains, onContinue }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-consequence';

  const wrap = el('div', 'consequence-card');
  wrap.appendChild(ornamentRule('#9c7a2e'));
  wrap.appendChild(el('p', 'consequence-text', text || '…'));

  if (skillGains && skillGains.length) {
    const chips = el('div', 'gain-chips');
    for (const { skill, delta } of skillGains) {
      const chip = el('span', 'gain-chip', `+${delta} ${SCIENCE_LABELS[skill] || skill}`);
      chip.style.setProperty('--chip-color', SCIENCE_COLORS[skill] || '#9c7a2e');
      chips.appendChild(chip);
    }
    wrap.appendChild(chips);
  }

  const btn = el('button', 'option-btn primary', 'Continue');
  btn.addEventListener('click', onContinue);
  wrap.appendChild(btn);

  app.appendChild(wrap);
}

export function renderSkillPanel(state) {
  const panel = el('div', 'skill-panel');
  panel.appendChild(el('h3', null, 'The Occult Quintet'));
  for (const [key, label] of Object.entries(SCIENCE_LABELS)) {
    const row = el('div', 'skill-row');
    row.appendChild(el('span', null, label));
    const bar = el('div', 'skill-bar');
    bar.setAttribute('role', 'meter');
    bar.setAttribute('aria-label', label);
    bar.setAttribute('aria-valuenow', state.skills[key]);
    const fill = el('div', 'skill-fill');
    fill.style.width = `${Math.min(100, state.skills[key] * 15)}%`;
    fill.style.background = SCIENCE_COLORS[key];
    bar.appendChild(fill);
    row.appendChild(bar);
    row.appendChild(el('span', 'skill-val', String(state.skills[key])));
    panel.appendChild(row);
  }
  return panel;
}

const ACT_TITLES = {
  1: 'Cairo & Formation', 2: 'First Patron: Iskandar Sultan', 3: 'Second Patron: Bāysunghur',
  4: 'Choosing the Sciences', 5: 'Popularizer or Secret-Keeper', 6: 'The Bench: Judge of Isfahan',
  7: 'Three Inquisitions', 8: 'Exile & Legacy',
};

export function renderEnding({ ending, epilogue, state, choices }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-ending';

  const dominant = state.dominantScience();
  const sealColor = SCIENCE_COLORS[dominant] || '#9c7a2e';

  const wrap = el('div', 'ending');
  const head = el('div', 'ending-head');
  head.appendChild(seal(sealColor, 56));
  head.appendChild(el('div', 'ending-eyebrow', 'YOUR LIFE, AS LIVED'));
  head.appendChild(el('h1', null, ending.title));
  wrap.appendChild(head);

  wrap.appendChild(el('p', 'ending-text', ending.text));
  if (epilogue) wrap.appendChild(el('p', 'ending-epilogue', epilogue));
  wrap.appendChild(el('p', 'ending-note',
    'This is one ending among several — the documented historical outcome (exile, death in 1432) is not privileged over the others.'));

  wrap.appendChild(renderSkillPanel(state));

  const journal = el('div', 'journal');
  journal.appendChild(el('h3', null, 'The choices that made this life'));
  let lastAct = 0;
  for (const { choiceId, optionId, act } of state.history) {
    if (act !== lastAct) {
      lastAct = act;
      journal.appendChild(el('div', 'journal-act', ACT_TITLES[act] || `Act ${act}`));
    }
    const choiceDef = choices.find((c) => c.id === choiceId);
    const optDef = choiceDef?.options.find((o) => o.id === optionId);
    const row = el('div', 'journal-row');
    row.appendChild(el('span', 'journal-choice', choiceDef?.title || choiceId));
    row.appendChild(el('span', 'journal-pick', optDef?.label || optionId));
    journal.appendChild(row);
  }
  wrap.appendChild(journal);

  const restartBtn = el('button', 'option-btn primary', 'Play again');
  restartBtn.addEventListener('click', () => window.__turkaVN.restart());
  wrap.appendChild(restartBtn);

  app.appendChild(wrap);
}
