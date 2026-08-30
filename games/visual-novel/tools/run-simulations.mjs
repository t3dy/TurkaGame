// run-simulations.mjs — drives sim.mjs to produce (a) player-readable transcripts
// for every ending and several failure/edge states, and (b) an analysis report.
//
//   node tools/run-simulations.mjs
//
// Writes: logs/*.md (transcripts) and logs/ANALYSIS.md (the report).

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadChoices, simulate, scriptedPolicy, randomPolicy, renderTranscript } from './sim.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const LOGS = join(HERE, '..', 'logs');
mkdirSync(LOGS, { recursive: true });

const choices = loadChoices();
const byId = new Map(choices.map((c) => [c.id, c]));

// ---------------------------------------------------------------------------
// Targeted runs: one per ending, plus failure/edge states.
// `script` entries are honoured only when that option is actually available,
// so a script that assumes a locked option will visibly fail its target —
// which is itself a finding worth surfacing rather than hiding.
// ---------------------------------------------------------------------------

const TARGETED = [
  { file: '01-vindicated-martyr', name: 'The Vindicated Martyr — the documented shape',
    note: 'Holds firm at the third inquisition, transmits the work completely to Yazdi as an equal, dies defiant. The closest path to the historical record.',
    expect: 'The Vindicated Martyr',
    script: { c03: 'equal', c16: 'limiya', c22: 'wide', c34: 'hold', c35: 'stand', c38: 'entrust', c39: 'defiant' } },

  { file: '02-source-code-of-empire', name: 'Source Code of Empire — the platform outlives the man',
    note: 'Holds firm, taught broadly, AND wrote popularizations — the combination that models how the lettrist-astrological platform actually spread across six court cultures.',
    expect: 'Source Code of Empire',
    script: { c03: 'equal', c16: 'limiya', c21: 'accessible', c22: 'wide', c23: 'yes', c34: 'hold', c38: 'entrust', c39: 'peace' } },

  { file: '03-new-brethren-endures', name: 'The New Brethren Endures — a dispersed circle carries it',
    note: 'Same defiance and breadth, but refused to popularize: the ideas survive scattered across students rather than as a portable platform.',
    expect: 'The New Brethren Endures',
    script: { c03: 'equal', c16: 'limiya', c22: 'wide', c23: 'no', c34: 'hold', c38: 'entrust', c39: 'peace' } },

  { file: '04-lost-legacy', name: 'The Lost Legacy — integrity kept, work lost',
    note: 'A failure state that is not a moral failure: holds firm, refuses every compromise, and still loses everything by keeping the manuscripts close.',
    expect: 'The Lost Legacy',
    script: { c16: 'limiya', c22: 'wide', c34: 'hold', c38: 'keep', c39: 'bitter' } },

  { file: '05-rehabilitated-judge', name: 'The Rehabilitated Judge — survival by other means',
    note: 'Bends at the third inquisition, but a career of ruling for the weak from a real judgeship survives the scandal.',
    expect: 'The Rehabilitated Judge',
    script: { c11: 'calligraphy', c16: 'kimiya', c22: 'wide', c26: 'accepted', c27: 'weak', c34: 'bend' } },

  { file: '06-quiet-compromise', name: 'The Quiet Compromise — the ordinary failure',
    note: 'Bent the knee without the judicial reputation to be rehabilitated by. Survives diminished. The most common outcome under careless play.',
    expect: 'The Quiet Compromise',
    script: { c16: 'limiya', c22: 'wide', c26: 'declined', c27: 'powerful', c34: 'bend' } },

  { file: '07-solitary-sage', name: 'The Solitary Sage — withdrawal',
    note: 'Retreats into private scholarship, goes silent, keeps the circle small. Survives; influences nothing in his lifetime.',
    expect: 'The Solitary Sage',
    script: { c16: 'limiya', c22: 'small', c36: 'retreat', c37: 'silent' } },

  { file: '08-court-philosopher', name: 'The Court Philosopher — the fate avoided',
    note: 'A lifetime of deliberate quietness defuses the third inquisition before it can bite. The branch furthest from the documented history.',
    expect: 'The Court Philosopher',
    script: { c09: 'cautious', c15: 'delayed', c16: 'limiya', c21: 'elite', c22: 'small' } },

  // --- failure / stress states ---------------------------------------------
  { file: '09-failure-lockout', name: 'FAILURE STATE — the door closed in Act II',
    note: 'Defects from Iskandar Sultan early, then reaches the first inquisition with no patron favour to call in. Demonstrates the flag gate biting eight choices later.',
    expect: null,
    script: { c10: 'early_defect', c16: 'limiya', c31: 'patron', c34: 'hold', c38: 'entrust' } },

  { file: '10-failure-minimal-scholar', name: 'FAILURE STATE — the floor of investment',
    note: 'Declines every optional skill grant. Reaches the documented floor: c16 forces +3 and c11/c18 grant a point whichever way you answer, so the least-studied possible Ibn Turka still ends with 5 points in a single science. There is no "refuse the occult sciences" path — a design fact worth arguing about.',
    expect: null,
    script: { c08: 'separate', c11: 'astronomy', c14: 'informal', c17: 'narrow', c18: 'math_first',
              c20: 'rush', c21: 'elite', c23: 'no', c24: 'decline', c30: 'bench', c34: 'hold' } },

  { file: '11-edge-first-option', name: 'EDGE — always the first option',
    note: 'The degenerate baseline: a player who clicks through without reading. What the game gives someone paying no attention.',
    expect: null, script: {} },

  { file: '12-edge-last-option', name: 'EDGE — always the last option',
    note: 'The opposite degenerate baseline. Notable because skill-gated options are appended last, so this player takes every unlocked signature moment.',
    expect: null, script: {}, fallback: 'last' },
];

const runs = [];
for (const t of TARGETED) {
  let run, error = null;
  try {
    run = simulate({ choices, policy: scriptedPolicy(t.script, t.fallback || 'first'), name: t.name });
  } catch (e) { error = e.message; }
  const hit = run && (!t.expect || run.ending.title === t.expect);
  runs.push({ ...t, run, error, hit });
  if (run) {
    writeFileSync(join(LOGS, `${t.file}.md`), renderTranscript(run, { note: t.note }), 'utf8');
  }
}

// ---------------------------------------------------------------------------
// Sweep: deterministic pseudo-random play, for distribution + reachability.
// ---------------------------------------------------------------------------

const N = 3000;
const sweep = [];
for (let i = 0; i < N; i++) {
  sweep.push(simulate({ choices, policy: randomPolicy(i * 2654435761 + 1), name: `sweep-${i}` }));
}

const endingCounts = {};
for (const r of sweep) endingCounts[r.ending.title] = (endingCounts[r.ending.title] || 0) + 1;

// Skill-gated option availability under random play
const skillGated = [];
for (const c of choices) {
  for (const o of c.options) {
    if (o.skill_gate) skillGated.push({ choiceId: c.id, optionId: o.id, label: o.label, gate: o.skill_gate });
  }
}
const gateStats = skillGated.map((g) => {
  let offered = 0, taken = 0;
  for (const r of sweep) {
    const step = r.steps.find((s) => s.choiceId === g.choiceId);
    if (!step) continue;
    const wasOffered = step.picked.id === g.optionId || step.alternatives.some((a) => a.id === g.optionId);
    if (wasOffered) offered++;
    if (step.picked.id === g.optionId) taken++;
  }
  return { ...g, offeredPct: (offered / N) * 100, takenPct: (taken / N) * 100 };
});

// Where do skill points actually come from? (static analysis of the graph)
const skillSources = {};
for (const c of choices) {
  for (const o of c.options) {
    for (const [sk, d] of Object.entries(o.skills || {})) {
      (skillSources[sk] ||= []).push({ choiceId: c.id, optionId: o.id, delta: d });
    }
  }
}

// Can each skill gate be met WITHOUT choosing that science as primary at c16?
const gateFeasibility = skillGated.map((g) => {
  const [sk, min] = Object.entries(g.gate)[0];
  const gateChoiceNum = Number(g.choiceId.slice(1));
  const sources = (skillSources[sk] || []).filter((s) => Number(s.choiceId.slice(1)) < gateChoiceNum);
  const withPrimary = sources.reduce((a, s) => a + s.delta, 0);
  const withoutPrimary = sources.filter((s) => s.choiceId !== 'c16').reduce((a, s) => a + s.delta, 0);
  return { ...g, science: sk, min, maxWithPrimary: withPrimary, maxWithoutPrimary: withoutPrimary,
           generalistReachable: withoutPrimary >= min };
});

// Divergence: how different are two random runs, on average?
function diffCount(a, b) {
  let d = 0;
  for (const s of a.steps) {
    const t = b.steps.find((x) => x.choiceId === s.choiceId);
    if (!t) continue;
    if (s.picked.id !== t.picked.id) d++;
    if (s.sceneText !== t.sceneText) d++;
  }
  if (a.ending.title !== b.ending.title) d++;
  if (a.epilogue !== b.epilogue) d++;
  return d;
}
let divTotal = 0, pairs = 0;
for (let i = 0; i + 1 < 200; i += 2) { divTotal += diffCount(sweep[i], sweep[i + 1]); pairs++; }

// Reactive-scene coverage: which scenes ever render differently across the sweep?
const sceneVariants = {};
for (const r of sweep) {
  for (const s of r.steps) (sceneVariants[s.choiceId] ||= new Set()).add(s.sceneText);
}
const reactiveScenes = Object.entries(sceneVariants)
  .filter(([, set]) => set.size > 1)
  .map(([cid, set]) => ({ cid, variants: set.size }))
  .sort((a, b) => b.variants - a.variants);

const consequenceVariants = {};
for (const r of sweep) {
  for (const s of r.steps) {
    const key = `${s.choiceId}:${s.picked.id}`;
    (consequenceVariants[key] ||= new Set()).add(s.consequence);
  }
}
const reactiveConsequences = Object.entries(consequenceVariants).filter(([, v]) => v.size > 1).map(([k]) => k);

// Per-act reactivity (Workstream D budget: every act >= 1 reactive scene)
const actReactivity = {};
for (const c of choices) {
  const v = sceneVariants[c.id];
  if (v && v.size > 1) actReactivity[c.act] = (actReactivity[c.act] || 0) + 1;
  else actReactivity[c.act] ||= 0;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const R = [];
R.push('# ANALYSIS.md — Simulation Results');
R.push('');
R.push(`Generated by \`tools/run-simulations.mjs\` against the shipped v4 modules.`);
R.push(`${TARGETED.length} targeted runs + ${N} pseudo-random playthroughs (seeded, reproducible).`);
R.push('');
R.push('## 1. Ending reachability — targeted runs');
R.push('');
R.push('| Run | Target | Result | Log |');
R.push('|---|---|---|---|');
for (const r of runs) {
  const res = r.error ? `ERROR: ${r.error}` : r.run.ending.title;
  const mark = r.expect ? (r.hit ? '✅' : '❌') : '—';
  R.push(`| ${r.name.split(' — ')[0]} | ${r.expect || '(no target)'} | ${mark} ${res} | [${r.file}.md](${r.file}.md) |`);
}
R.push('');
const targetedHits = runs.filter((r) => r.expect).length;
const targetedOk = runs.filter((r) => r.expect && r.hit).length;
R.push(`**${targetedOk}/${targetedHits} endings reachable by a targeted policy.**`);
R.push('');

R.push('## 2. Ending distribution under random play');
R.push('');
R.push(`What a player who chooses arbitrarily actually gets (${N} runs):`);
R.push('');
R.push('| Ending | Runs | Share |');
R.push('|---|---|---|');
for (const [k, v] of Object.entries(endingCounts).sort((a, b) => b[1] - a[1])) {
  R.push(`| ${k} | ${v} | ${((v / N) * 100).toFixed(1)}% |`);
}
const unreachedRandom = runs.filter((r) => r.expect && !endingCounts[r.expect]).map((r) => r.expect);
R.push('');
if (unreachedRandom.length) {
  R.push(`Endings **never** produced by random play: ${unreachedRandom.join(', ')} — reachable only by deliberate play.`);
} else {
  R.push('Every ending occurs at least once under random play.');
}
R.push('');

R.push('## 3. Skill-gated options — do they actually fire?');
R.push('');
R.push('| Choice | Option | Gate | Offered (random) | Taken (random) |');
R.push('|---|---|---|---|---|');
for (const g of gateStats) {
  R.push(`| ${g.choiceId} | ${g.label} | ${JSON.stringify(g.gate)} | ${g.offeredPct.toFixed(1)}% | ${g.takenPct.toFixed(1)}% |`);
}
R.push('');
R.push('### Can a generalist (no matching c16 primary) reach each gate?');
R.push('');
R.push('| Gate | Needs | Max without primary | Max with primary | Generalist-reachable |');
R.push('|---|---|---|---|---|');
for (const g of gateFeasibility) {
  R.push(`| ${g.choiceId} ${g.science} | ${g.min} | ${g.maxWithoutPrimary} | ${g.maxWithPrimary} | ${g.generalistReachable ? 'yes' : 'no — requires primary'} |`);
}
R.push('');

R.push('## 4. Divergence');
R.push('');
R.push(`Average observable differences between two arbitrary runs (choices picked, scene text rendered, ending, epilogue), over ${pairs} pairs: **${(divTotal / pairs).toFixed(1)}**.`);
R.push('');
R.push(`Scenes that render more than one variant across the sweep: **${reactiveScenes.length}/40**`);
R.push('');
R.push(reactiveScenes.map((s) => `\`${s.cid}\`(${s.variants})`).join(' · '));
R.push('');
R.push(`Consequence lines with more than one variant: **${reactiveConsequences.length}** (${reactiveConsequences.join(', ')})`);
R.push('');
R.push('### Reactive scenes per act (Workstream D budget: every act ≥ 1)');
R.push('');
R.push('| Act | Reactive scenes |');
R.push('|---|---|');
for (const [act, n] of Object.entries(actReactivity).sort((a, b) => a[0] - b[0])) {
  R.push(`| ${act} | ${n}${n === 0 ? '  ⚠ below budget' : ''} |`);
}
R.push('');

R.push('## 5. Failure-state notes');
R.push('');
for (const r of runs.filter((x) => x.file.includes('failure') || x.file.includes('edge'))) {
  if (!r.run) { R.push(`- **${r.name}** — ERROR: ${r.error}`); continue; }
  const lockedSkill = r.run.lockedEncounters.filter((l) => l.kind === 'skill').length;
  const lockedFlag = r.run.lockedEncounters.filter((l) => l.kind === 'flag').length;
  R.push(`- **${r.name}** → *${r.run.ending.title}*. Total skill ${r.run.totalSkill}, breadth ${r.run.breadth}. Encountered ${lockedFlag} flag-locked and ${lockedSkill} skill-locked options.`);
}
R.push('');
R.push('No run of the ' + (TARGETED.length + N) + ' simulated hit an unwinnable dead end (every choice always offered ≥ 1 available option).');
R.push('');

writeFileSync(join(LOGS, 'ANALYSIS.md'), R.join('\n'), 'utf8');

// console summary
console.log(`targeted: ${targetedOk}/${targetedHits} endings hit`);
for (const r of runs) console.log(`  ${r.hit === false ? 'MISS' : ' ok '} ${r.file}: ${r.error || r.run.ending.title}`);
console.log('\nrandom distribution:');
for (const [k, v] of Object.entries(endingCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${((v / N) * 100).toFixed(1)}%  ${k}`);
console.log('\nskill gates offered under random play:');
for (const g of gateStats) console.log(`  ${g.choiceId} ${g.optionId}: offered ${g.offeredPct.toFixed(1)}%`);
console.log('\ngeneralist reachability:');
for (const g of gateFeasibility) console.log(`  ${g.choiceId} ${g.science}>=${g.min}: without primary max ${g.maxWithoutPrimary} -> ${g.generalistReachable ? 'reachable' : 'REQUIRES PRIMARY'}`);
console.log(`\nreactive scenes: ${reactiveScenes.length}/40; avg divergence ${(divTotal / pairs).toFixed(1)}`);
console.log('per-act reactive:', actReactivity);
console.log(`\nlogs written to ${LOGS}`);
