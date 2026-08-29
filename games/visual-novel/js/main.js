// main.js — orchestrates the VN: load choices.json, restore/init state,
// render current choice, apply picks, compute ending at choice 40.
// Debug handle: window.__turkaVN (matches EmblemNovel's window.__novel convention
// and EmblemRoguelike's window.__game convention).

import { State } from './state.js';
import { ACT_INTROS, CHOICE_TEXT } from './narrative.js';
import { ACT_BACKDROP } from './assets.js';
import { computeEnding } from './endings.js';
import { renderChoice, renderEnding } from './ui.js';

let CHOICES = [];
let state = new State();

async function loadChoices() {
  const res = await fetch('./choices.json');
  const data = await res.json();
  return data.choices;
}

function currentChoice() {
  return CHOICES[state.globalIndex];
}

function render() {
  if (state.globalIndex >= CHOICES.length) {
    finish();
    return;
  }
  const choice = currentChoice();
  renderChoice({
    choice,
    sceneText: CHOICE_TEXT[choice.id] || '',
    actIntro: ACT_INTROS[choice.act] || `Act ${choice.act}`,
    backdropUrl: ACT_BACKDROP[choice.act],
    state,
    onPick: (option) => {
      state.applyChoice(choice, option);
      state.save();
      render();
    },
  });
}

function finish() {
  state.finished = true;
  const ending = computeEnding(state);
  state.endingId = ending.title;
  state.save();
  renderEnding({ ending, state });
}

function restart() {
  State.reset();
  state = new State();
  render();
}

async function init() {
  CHOICES = await loadChoices();
  const saved = State.load();
  if (saved && !saved.finished) {
    state = saved;
  }
  render();
}

window.__turkaVN = { restart, get state() { return state; }, get choices() { return CHOICES; } };

init();
