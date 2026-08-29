// main.js — orchestrates the VN as a small state machine:
// title -> act_intro -> choice -> consequence -> (loop) -> ending
// Debug handle: window.__turkaVN (matches EmblemNovel's window.__novel convention
// and EmblemRoguelike's window.__game convention).

import { State } from './state.js';
import { ACT_INTROS, CHOICE_TEXT, CHOICE_TEXT_DYNAMIC, OPTION_CONSEQUENCE } from './narrative.js';
import { ACT_BACKDROP } from './assets.js';
import { computeEnding } from './endings.js';
import { renderTitle, renderActIntro, renderChoice, renderConsequence, renderEnding } from './ui.js';

let CHOICES = [];
let state = new State();
let screen = 'title'; // 'title' | 'act_intro' | 'choice' | 'consequence' | 'ending'
let lastRenderedAct = 0;
let pendingConsequence = null; // { text, choice }

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
    renderActIntro({ act: ACT_INTROS[choice.act], onContinue: () => { screen = 'choice'; render(); } });
    return;
  }

  if (screen === 'consequence') {
    renderConsequence({
      text: pendingConsequence.text,
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
    backdropUrl: ACT_BACKDROP[choice.act],
    state,
    onPick: (option) => {
      state.applyChoice(choice, option);
      state.save();
      pendingConsequence = { text: (OPTION_CONSEQUENCE[choice.id] || {})[option.id] || '', choice };
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

async function init() {
  CHOICES = await loadChoices();
  render(); // starts on title screen
}

window.__turkaVN = { restart, get state() { return state; }, get choices() { return CHOICES; }, get screen() { return screen; } };

init();
