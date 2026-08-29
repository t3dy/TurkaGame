// ui.js — DOM rendering for the choice screen, skill panel, and ending screen.

const SKILL_LABELS = {
  kimiya: 'Kīmiyā (Alchemy)',
  limiya: 'Līmiyā (Talismanry)',
  himiya: 'Hīmiyā (Subjugation)',
  simiya: 'Sīmiyā (Illusionism)',
  rimiya: 'Rīmiyā (Trickery)',
};

export function renderChoice({ choice, sceneText, actIntro, backdropUrl, state, onPick }) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'scene';

  if (backdropUrl) {
    const img = document.createElement('img');
    img.className = 'backdrop';
    img.src = backdropUrl;
    img.alt = `Act ${choice.act} backdrop`;
    wrap.appendChild(img);
  }

  const actBadge = document.createElement('div');
  actBadge.className = 'act-badge';
  actBadge.textContent = actIntro;
  wrap.appendChild(actBadge);

  const groundingBadge = document.createElement('span');
  groundingBadge.className = 'grounding-badge';
  groundingBadge.textContent = choice.grounding;
  wrap.appendChild(groundingBadge);

  const h2 = document.createElement('h2');
  h2.textContent = choice.title;
  wrap.appendChild(h2);

  const p = document.createElement('p');
  p.className = 'scene-text';
  p.textContent = sceneText;
  wrap.appendChild(p);

  const optionsEl = document.createElement('div');
  optionsEl.className = 'options';
  const available = choice.options.filter((o) => state.optionAvailable(o));
  const unavailable = choice.options.filter((o) => !state.optionAvailable(o));

  for (const opt of available) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => onPick(opt));
    optionsEl.appendChild(btn);
  }
  wrap.appendChild(optionsEl);

  if (unavailable.length) {
    const gatedNote = document.createElement('p');
    gatedNote.className = 'gated-note';
    gatedNote.textContent = `Not open to you here: ${unavailable.map((o) => o.label).join('; ')} — an earlier choice closed this door.`;
    wrap.appendChild(gatedNote);
  }

  app.appendChild(wrap);
  app.appendChild(renderSkillPanel(state));
  app.appendChild(renderProgress(state));
}

export function renderSkillPanel(state) {
  const panel = document.createElement('div');
  panel.className = 'skill-panel';
  const title = document.createElement('h3');
  title.textContent = 'The Occult Quintet';
  panel.appendChild(title);
  for (const [key, label] of Object.entries(SKILL_LABELS)) {
    const row = document.createElement('div');
    row.className = 'skill-row';
    const name = document.createElement('span');
    name.textContent = label;
    const bar = document.createElement('div');
    bar.className = 'skill-bar';
    const fill = document.createElement('div');
    fill.className = 'skill-fill';
    fill.style.width = `${Math.min(100, state.skills[key] * 15)}%`;
    bar.appendChild(fill);
    const val = document.createElement('span');
    val.className = 'skill-val';
    val.textContent = state.skills[key];
    row.appendChild(name);
    row.appendChild(bar);
    row.appendChild(val);
    panel.appendChild(row);
  }
  return panel;
}

export function renderProgress(state) {
  const p = document.createElement('div');
  p.className = 'progress';
  p.textContent = `Choice ${state.globalIndex + 1} of 40`;
  return p;
}

export function renderEnding({ ending, state }) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'ending';

  const h1 = document.createElement('h1');
  h1.textContent = ending.title;
  wrap.appendChild(h1);

  const p = document.createElement('p');
  p.className = 'ending-text';
  p.textContent = ending.text;
  wrap.appendChild(p);

  const note = document.createElement('p');
  note.className = 'ending-note';
  note.textContent = 'This is one ending among several — the documented historical outcome (exile, death in 1432) is not privileged over the others.';
  wrap.appendChild(note);

  wrap.appendChild(renderSkillPanel(state));

  const restartBtn = document.createElement('button');
  restartBtn.className = 'option-btn';
  restartBtn.textContent = 'Play again';
  restartBtn.addEventListener('click', () => {
    window.__turkaVN.restart();
  });
  wrap.appendChild(restartBtn);

  app.appendChild(wrap);
}
