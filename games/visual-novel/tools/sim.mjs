// sim.mjs — headless replay engine for the Ibn Turka VN.
//
// Imports the REAL game modules (state.js, narrative.js, endings.js) rather than
// reimplementing their logic, so a simulation result is evidence about the shipped
// game, not about a parallel model of it. Only main.js's thin orchestration (which
// needs a DOM) is mirrored here — deliberately kept to the few lines below so the
// mirror can't drift far without being obvious.
//
// Usage: import { simulate } from './sim.mjs'

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { State } from '../js/state.js';
import { ACT_INTROS, CHOICE_TEXT, CHOICE_TEXT_DYNAMIC, OPTION_CONSEQUENCE, OPTION_CONSEQUENCE_DYNAMIC } from '../js/narrative.js';
import { computeEnding, epilogueFor } from '../js/endings.js';

const HERE = dirname(fileURLToPath(import.meta.url));

export function loadChoices() {
  return JSON.parse(readFileSync(join(HERE, '..', 'choices.json'), 'utf8')).choices;
}

// --- mirrors of main.js orchestration (keep minimal) -----------------------

function sceneTextFor(choice, state) {
  const dyn = CHOICE_TEXT_DYNAMIC[choice.id];
  return dyn ? dyn(state) : (CHOICE_TEXT[choice.id] || '');
}

function skillGainsFor(option, state) {
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

function consequenceFor(choice, option, preState) {
  const dynFn = (OPTION_CONSEQUENCE_DYNAMIC[choice.id] || {})[option.id];
  const dynText = dynFn ? dynFn(preState) : null;
  return dynText || (OPTION_CONSEQUENCE[choice.id] || {})[option.id] || '';
}

function lockReason(option, state) {
  if (option.gate && !Object.entries(option.gate).every(([c, v]) => state.flags[c] === v)) {
    const unmet = Object.entries(option.gate)
      .filter(([c, v]) => state.flags[c] !== v)
      .map(([c, v]) => `${c}=${v}`).join(', ');
    return { kind: 'flag', detail: `needs ${unmet}` };
  }
  if (option.skill_gate) {
    const unmet = Object.entries(option.skill_gate)
      .filter(([s, n]) => (state.skills[s] || 0) < n)
      .map(([s, n]) => `${s} ${state.skills[s] || 0}/${n}`).join(', ');
    if (unmet) return { kind: 'skill', detail: `needs ${unmet}` };
  }
  return { kind: 'unknown', detail: '' };
}

// --- the simulator ---------------------------------------------------------

/**
 * Replay one full playthrough.
 * @param {object} opts
 * @param {object[]} opts.choices           the choice graph (from loadChoices)
 * @param {function} opts.policy            (choice, availableOptions, state) => option
 * @param {string}  [opts.name]             label for the log
 * @returns {object} full structured record of the run
 */
export function simulate({ choices, policy, name = 'run' }) {
  const state = new State();
  const steps = [];

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    const available = choice.options.filter((o) => state.optionAvailable(o));
    const locked = choice.options
      .filter((o) => !state.optionAvailable(o))
      .map((o) => ({ id: o.id, label: o.label, ...lockReason(o, state) }));

    if (!available.length) {
      throw new Error(`DEAD END at ${choice.id}: every option locked`);
    }

    const sceneText = sceneTextFor(choice, state);
    const picked = policy(choice, available, state) || available[0];

    const preFlags = { ...state.flags };
    const preSkills = { ...state.skills };
    const gains = skillGainsFor(picked, state);
    const consequence = consequenceFor(choice, picked, state);

    state.applyChoice(choice, picked);

    steps.push({
      index: i + 1,
      choiceId: choice.id,
      act: choice.act,
      actTitle: ACT_INTROS[choice.act]?.title || `Act ${choice.act}`,
      title: choice.title,
      grounding: choice.grounding,
      theme: choice.theme,
      sceneText,
      picked: { id: picked.id, label: picked.label, detail: picked.detail || '' },
      alternatives: available.filter((o) => o.id !== picked.id).map((o) => ({ id: o.id, label: o.label })),
      locked,
      skillGains: gains,
      consequence,
      skillsAfter: { ...state.skills },
      preFlags,
      preSkills,
    });
  }

  const ending = computeEnding(state);
  const epilogue = epilogueFor(state);

  return {
    name,
    steps,
    flags: { ...state.flags },
    skills: { ...state.skills },
    dominant: state.dominantScience(),
    breadth: state.breadth(),
    totalSkill: Object.values(state.skills).reduce((a, b) => a + b, 0),
    ending: { title: ending.title, text: ending.text },
    epilogue,
    // Every option that was offered-but-locked across the run, for analysis.
    lockedEncounters: steps.flatMap((s) => s.locked.map((l) => ({ choiceId: s.choiceId, ...l }))),
  };
}

// --- policy helpers --------------------------------------------------------

/** Policy from a {choiceId: optionId} map; falls back to `fallback` (default: first). */
export function scriptedPolicy(script, fallback = 'first') {
  return (choice, available) => {
    const want = script[choice.id];
    if (want) {
      const hit = available.find((o) => o.id === want);
      if (hit) return hit;
    }
    if (fallback === 'last') return available[available.length - 1];
    if (typeof fallback === 'function') return fallback(choice, available);
    return available[0];
  };
}

/** Deterministic pseudo-random policy (seeded), for distribution sweeps. */
export function randomPolicy(seed) {
  let s = seed >>> 0;
  const next = () => {
    // xorshift32 — deterministic across runs so sweeps are reproducible
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 0xffffffff;
  };
  return (choice, available) => available[Math.floor(next() * available.length) % available.length];
}

// --- log rendering ---------------------------------------------------------

/** Render a run as a player-readable Markdown transcript. */
export function renderTranscript(run, { note = '' } = {}) {
  const L = [];
  L.push(`# ${run.name}`);
  L.push('');
  if (note) { L.push(`> ${note}`); L.push(''); }
  L.push(`**Ending:** ${run.ending.title}`);
  L.push(`**Dominant science:** ${run.dominant} · **Breadth:** ${run.breadth} science(s) · **Total investment:** ${run.totalSkill}`);
  L.push('');
  L.push('---');
  L.push('');

  let lastAct = 0;
  for (const s of run.steps) {
    if (s.act !== lastAct) {
      lastAct = s.act;
      L.push(`## ${s.actTitle}`);
      L.push('');
      const intro = ACT_INTROS[s.act];
      if (intro) { L.push(`*${intro.text}*`); L.push(''); }
    }
    L.push(`### ${s.index}. ${s.title}  \`${s.choiceId}\` · ${s.grounding} · theme: ${s.theme}`);
    L.push('');
    L.push(s.sceneText);
    L.push('');
    L.push(`**→ Chose: ${s.picked.label}**`);
    if (s.picked.detail) L.push(`> ${s.picked.detail}`);
    if (s.alternatives.length) {
      L.push('');
      L.push(`*Also available:* ${s.alternatives.map((a) => a.label).join(' · ')}`);
    }
    if (s.locked.length) {
      L.push('');
      L.push(`*Locked:* ${s.locked.map((l) => `${l.label} (${l.kind} gate — ${l.detail})`).join(' · ')}`);
    }
    if (s.skillGains.length) {
      L.push('');
      L.push(`*Skill:* ${s.skillGains.map((g) => `+${g.delta} ${g.skill}`).join(', ')}`);
    }
    if (s.consequence) {
      L.push('');
      L.push(`*${s.consequence}*`);
    }
    L.push('');
  }

  L.push('---');
  L.push('');
  L.push(`## Ending — ${run.ending.title}`);
  L.push('');
  L.push(run.ending.text);
  L.push('');
  if (run.epilogue) { L.push(run.epilogue); L.push(''); }
  L.push('### Final state');
  L.push('');
  L.push('| Science | Score |');
  L.push('|---|---|');
  for (const [k, v] of Object.entries(run.skills)) L.push(`| ${k} | ${v} |`);
  L.push('');
  return L.join('\n');
}
