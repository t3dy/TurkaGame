// ui.js — DOM rendering for every screen: title, act-intro, choice, consequence, ending.

const SKILL_LABELS = {
  kimiya: 'Kīmiyā (Alchemy)',
  limiya: 'Līmiyā (Talismanry)',
  himiya: 'Hīmiyā (Subjugation)',
  simiya: 'Sīmiyā (Illusionism)',
  rimiya: 'Rīmiyā (Trickery)',
};

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

export function renderTitle({ hasSave, onBegin, onResume }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-title';

  const wrap = el('div', 'title-card');
  wrap.appendChild(el('div', 'title-eyebrow', 'A VISUAL NOVEL — PROTOTYPE'));
  wrap.appendChild(el('h1', 'title-h1', 'Ibn Turka'));
  wrap.appendChild(el('p', 'title-sub', 'Choices. Knowledge. Power. Consequence.'));
  const desc = el('p', 'title-desc',
    'Play through the life of Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī — judge, philosopher, ' +
    'occultist — across 40 choices and eight acts. What you build, who you trust, and what ' +
    'you refuse to give up all shape which of several possible lives you end up living.');
  wrap.appendChild(desc);

  const actions = el('div', 'title-actions');
  const beginBtn = el('button', 'option-btn primary', hasSave ? 'Begin a new life' : 'Begin');
  beginBtn.addEventListener('click', onBegin);
  actions.appendChild(beginBtn);
  if (hasSave) {
    const resumeBtn = el('button', 'option-btn', 'Continue your story');
    resumeBtn.addEventListener('click', onResume);
    actions.appendChild(resumeBtn);
  }
  wrap.appendChild(actions);

  app.appendChild(wrap);
}

export function renderActIntro({ act, onContinue }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-act';

  const wrap = el('div', 'act-card');
  wrap.appendChild(el('div', 'act-eyebrow', 'NEW ACT'));
  wrap.appendChild(el('h1', 'act-h1', act.title));
  wrap.appendChild(el('p', 'act-text', act.text));

  const btn = el('button', 'option-btn primary', 'Continue');
  btn.addEventListener('click', onContinue);
  wrap.appendChild(btn);

  app.appendChild(wrap);
}

export function renderChoice({ choice, sceneText, actTitle, backdropUrl, state, onPick }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-choice';

  const wrap = el('div', 'scene');

  if (backdropUrl) {
    const img = el('img', 'backdrop');
    img.src = backdropUrl;
    img.alt = `${actTitle} backdrop`;
    wrap.appendChild(img);
  }

  const topRow = el('div', 'top-row');
  topRow.appendChild(el('div', 'act-badge', actTitle));
  topRow.appendChild(el('span', 'grounding-badge', choice.grounding.split(' ')[0]));
  wrap.appendChild(topRow);

  wrap.appendChild(el('h2', null, choice.title));
  wrap.appendChild(el('p', 'scene-text', sceneText));

  const optionsEl = el('div', 'options');
  const available = choice.options.filter((o) => state.optionAvailable(o));
  const unavailable = choice.options.filter((o) => !state.optionAvailable(o));

  for (const opt of available) {
    const btn = el('button', 'option-btn', opt.label);
    btn.addEventListener('click', () => onPick(opt));
    optionsEl.appendChild(btn);
  }
  wrap.appendChild(optionsEl);

  if (unavailable.length) {
    wrap.appendChild(el('p', 'gated-note',
      `Not open to you here: ${unavailable.map((o) => o.label).join('; ')} — an earlier choice closed this door.`));
  }

  app.appendChild(wrap);
  app.appendChild(renderSkillPanel(state));
  app.appendChild(renderProgress(state));
}

export function renderConsequence({ text, onContinue }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-consequence';

  const wrap = el('div', 'consequence-card');
  wrap.appendChild(el('p', 'consequence-text', text || '…'));
  const btn = el('button', 'option-btn primary', 'Continue');
  btn.addEventListener('click', onContinue);
  wrap.appendChild(btn);

  app.appendChild(wrap);
}

export function renderSkillPanel(state) {
  const panel = el('div', 'skill-panel');
  panel.appendChild(el('h3', null, 'The Occult Quintet'));
  for (const [key, label] of Object.entries(SKILL_LABELS)) {
    const row = el('div', 'skill-row');
    row.appendChild(el('span', null, label));
    const bar = el('div', 'skill-bar');
    const fill = el('div', 'skill-fill');
    fill.style.width = `${Math.min(100, state.skills[key] * 15)}%`;
    bar.appendChild(fill);
    row.appendChild(bar);
    row.appendChild(el('span', 'skill-val', String(state.skills[key])));
    panel.appendChild(row);
  }
  return panel;
}

export function renderProgress(state) {
  return el('div', 'progress', `Choice ${state.globalIndex + 1} of 40`);
}

function actTitleFor(act) {
  return ACT_TITLES[act] || `Act ${act}`;
}
const ACT_TITLES = {
  1: 'Cairo & Formation', 2: 'First Patron: Iskandar Sultan', 3: 'Second Patron: Bāysunghur',
  4: 'Choosing the Sciences', 5: 'Popularizer or Secret-Keeper', 6: 'The Bench: Judge of Isfahan',
  7: 'Three Inquisitions', 8: 'Exile & Legacy',
};

export function renderEnding({ ending, state, choices }) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = 'screen-ending';

  const wrap = el('div', 'ending');
  wrap.appendChild(el('div', 'ending-eyebrow', 'YOUR LIFE, AS LIVED'));
  wrap.appendChild(el('h1', null, ending.title));
  wrap.appendChild(el('p', 'ending-text', ending.text));
  wrap.appendChild(el('p', 'ending-note',
    'This is one ending among several — the documented historical outcome (exile, death in 1432) is not privileged over the others.'));

  wrap.appendChild(renderSkillPanel(state));

  const journal = el('div', 'journal');
  journal.appendChild(el('h3', null, 'The choices that made this life'));
  let lastAct = 0;
  for (const { choiceId, optionId, act } of state.history) {
    if (act !== lastAct) {
      lastAct = act;
      journal.appendChild(el('div', 'journal-act', actTitleFor(act)));
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
