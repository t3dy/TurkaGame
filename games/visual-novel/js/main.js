// main.js — orchestrates the VN as a small state machine:
// title -> act_intro -> choice -> consequence -> (loop) -> ending
// Debug handle: window.__turkaVN (matches EmblemNovel's window.__novel convention).

import { State } from './state.js';
import { ACT_INTROS, CHOICE_TEXT, CHOICE_TEXT_DYNAMIC, OPTION_CONSEQUENCE } from './narrative.js';
import { ACT_BACKDROP, backdropFor } from './assets.js';
import { computeEnding } from './endings.js';
import { renderTitle, renderActIntro, renderChoice, renderConsequence, renderEnding } from './ui.js';

let CHOICES = [];
let state = new State();
let screen = 'title'; // 'title' | 'act_intro' | 'choice' | 'consequence' | 'ending'
let lastRenderedAct = 0;
let pendingConsequence = null; // { text, skillGains }

async function loadChoices() {
  const res = await fetch('./choices.json');
  const data = await res.json();
  return data.choices;
}

function currentChoice() {
  return CHOICES[state.globalIndex];
}

function sceneTextFor(choice) {
  const dyn = CHOICE_TEXT_DYNAMIC[choice.id];
  if (dyn) return dyn(state);
  return CHOICE_TEXT[choice.id] || '';
}

// Resolve an option's skill effects into displayable gains, including the
// primary_bonus indirection (same resolution rule as State.applyChoice).
function skillGainsFor(option) {
  if (!option.skills) return [];
  const gains = [];
  for (const [skill, delta] of Object.entries(option.skills)) {
    if (skill === 'primary_bonus') {
      const primary = state.flags.primary_science || state.flags.c16;
      if (primary) gains.push({ skill: primary, delta });
      continue;
    }
    gains.push({ skill, delta });
  }
  return gains;
}

function render() {
  if (screen === 'title') {
    const saved = State.load();
    renderTitle({ hasSave: !!saved && !saved.finished, onBegin: beginNewGame, onResume: resumeGame });
    return;
  }

  if (state.globalIndex >= CHOICES.length) {
    screen = 'ending';
  }

  if (screen === 'ending') {
    finish();
    return;
  }

  const choice = currentChoice();

  if (screen === 'act_intro') {
    renderActIntro({
      act: ACT_INTROS[choice.act],
      actNumber: choice.act,
      backdropUrl: ACT_BACKDROP[choice.act],
      onContinue: () => { screen = 'choice'; render(); },
    });
    return;
  }

  if (screen === 'consequence') {
    renderConsequence({
      text: pendingConsequence.text,
      skillGains: pendingConsequence.skillGains,
      onContinue: () => {
        pendingConsequence = null;
        const nextChoice = currentChoice();
        if (nextChoice && nextChoice.act !== lastRenderedAct) {
          lastRenderedAct = nextChoice.act;
          screen = 'act_intro';
        } else {
          screen = 'choice';
        }
        render();
      },
    });
    return;
  }

  // screen === 'choice'
  renderChoice({
    choice,
    sceneText: sceneTextFor(choice),
    actTitle: ACT_INTROS[choice.act]?.title || `Act ${choice.act}`,
    backdropUrl: backdropFor(choice),
    state,
    onPick: (option) => {
      const gains = skillGainsFor(option); // resolve BEFORE applyChoice mutates flags
      state.applyChoice(choice, option);
      state.save();
      pendingConsequence = { text: (OPTION_CONSEQUENCE[choice.id] || {})[option.id] || '', skillGains: gains };
      screen = 'consequence';
      render();
    },
  });
}

function finish() {
  state.finished = true;
  const ending = computeEnding(state);
  state.endingId = ending.title;
  state.save();
  renderEnding({ ending, state, choices: CHOICES });
}

function beginNewGame() {
  State.reset();
  state = new State();
  lastRenderedAct = 1;
  screen = 'act_intro';
  render();
}

function resumeGame() {
  const saved = State.load();
  if (saved && !saved.finished) {
    state = saved;
    lastRenderedAct = currentChoice()?.act || 1;
    screen = 'choice';
  } else {
    beginNewGame();
    return;
  }
  render();
}

function restart() {
  beginNewGame();
}

// Keyboard navigation: 1-5 pick a choice option; Enter/Space presses the single
// primary button on continue-style screens (title handled by its own buttons).
document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (e.key >= '1' && e.key <= '9' && screen === 'choice') {
    const btns = document.querySelectorAll('.options .option-btn');
    const idx = Number(e.key) - 1;
    if (btns[idx]) { e.preventDefault(); btns[idx].click(); }
  } else if (e.key === 'Enter' && (screen === 'act_intro' || screen === 'consequence')) {
    const btn = document.querySelector('.option-btn.primary');
    if (btn) { e.preventDefault(); btn.click(); }
  }
});

async function init() {
  CHOICES = await loadChoices();
  render(); // starts on title screen
}

window.__turkaVN = { restart, get state() { return state; }, get choices() { return CHOICES; }, get screen() { return screen; } };

init();
