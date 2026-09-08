// ui.js — The Tribunal.
//
// Three inquisitions, and you are Ibn Turka. This is the one mode that is his
// biography: Ted's call, 2026-09-07 — the player's identity is a property of the
// MODE, not of the project, so that the other games are free to be about the
// letters rather than about a man.
//
// The verbs are BREAK (taksīr), ANSWER and REFUSE, and the third is the point.
// Refusing is not a worse kind of losing: it leaves the charge unproven and the
// record clean, and it costs standing. Melvin-Koushki records that Ibn Turka
// "would refuse to bend the knee during his three inquisitions, despite the
// danger and punishing consequences" — so a game about him where refusal is
// merely defeat would be lying about the one thing we know he chose.
//
// Every court is NAMED here, unlike the Descent, where the metaphysics is hidden.
// This mode asks a different question: not "whose rules am I under" but "what
// will I say under them."

import { Ledger } from '../../../engine/ledger.js?v=10';
import { Iso, PALETTE } from '../../scriptorium/src/iso.js?v=10';
import { mountHowTo } from '../../shared/howto.js?v=10';
import { mountVoicePicker, inVoice, voiceOf, currentVoice } from '../../shared/voice.js?v=10';
import { startWorld, breakLetter, inscribe, judge, recordEntry, solve } from './trial_rules.js?v=10';

const V = 'v=10';
const $ = id => document.getElementById(id);

const HOWTO = {
  id: 'tribunal',
  title: 'How to play The Tribunal',
  goal: [
    'You are Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī, chief judge of Isfahan, and you are on trial. Three courts will hear you, one after another. Each states a charge and then demands a DEMONSTRATION: that a particular word stand written before it, in a particular condition. You are never given the letters you need.',
    'You have three points of STANDING (your patrons and reputation) and you can afford three convictions before exile. Answering correctly clears a charge. Answering wrongly convicts you. Refusing to answer leaves the charge unproven — neither cleared nor convicted — and costs one standing. Refusal is a real option and it is what the historical man did, three times.',
  ],
  sections: [
    { h: 'Breaking a letter — taksīr', items: [
      'Click a letter in your hand to select it, then press "Break the selected letter". The game writes out that letter\'s name in full and gives you every letter after the first. The name of alif is الف, so breaking an alif gives you a lām and a fāʾ.',
      'Breaking never costs you the letter: you keep it and gain what was inside it. The working is printed step by step under "The working", because this project shows its arithmetic.',
      'Only eight letters in the whole alphabet can ever be released this way — ا د ف ل م ن و ي. That bound is what makes breaking a puzzle instead of a wish. Twenty letters can never be obtained by breaking anything.',
      'Every break is written into THE RECORD as a claim: "this letter conceals that one". The third court reads your record back to you.',
    ]},
    { h: 'Answering the court', items: [
      'Click letters in your hand to build your answer; the answer reads right to left, as Arabic does, so the first letter you click is the rightmost. Click a letter in the answer box to take it back.',
      'Press "Answer the court" to inscribe it on the stand. The court then judges what it can actually read.',
      'What the court reads depends on its metaphysics, and the courts are named openly. A word carrying a letter that never joins what follows comes apart in most courts — but not in a court that refuses to sever anything. One trial demands a word that stays whole; another demands letters that visibly come apart. The same inscription can pass in one room and fail in the next.',
      'One court refuses any answer shorter than three letters outright. Not "weaker" — it does not run at all, which is that tradition\'s actual doctrine about incomplete procedures.',
    ]},
    { h: 'Refusing', items: [
      'Press "Refuse to answer" to decline. The charge stands unproven, you are not convicted, your record stays clean, and you spend one standing. If standing runs out, the run ends in exile.',
      'It is worth playing a run where you refuse everything, and one where you answer everything, and comparing the endings.',
    ]},
    { h: 'The voice selector', items: [
      'The Voice menu in the topbar changes the register everything is written in: Austere (precise and cited), Baroque (the register the scholarship is actually written in), Uncanny (sparse and cold), Warm (a patient teacher, at length). It changes how things are said and never what is claimed — citations and numbers are identical in all four, and a test enforces that.',
    ]},
  ],
};

let LETTERS = [], PACK = null, DATA = null, ledger = null, iso = null;
let run = null, trial = null, court = null, world = null, hand = [], answer = [], sel = null;
let working = null, fresh = [], over = false;

/* ------------------------------------------------------------------- run -- */

function newRun() {
  run = {
    standing: DATA.run.standing,
    outcomes: DATA.trials.map(() => null),   // 'won' | 'lost' | 'refused'
    record: [],
    at: 0,
  };
  over = false;
  $('over').classList.remove('show');
  enterTrial();
}

function enterTrial() {
  trial = DATA.trials[run.at];
  court = PACK.rulesets.find(r => r.id === trial.court);
  world = startWorld(trial);
  hand = trial.hand.slice();
  answer = []; sel = null; working = null; fresh = [];
  iso.resetCamera();
  say('');
  paintAll();
}

/* ------------------------------------------------------------------ paint -- */

function paintAll() { draw(); paintHeader(); paintText(); paintHand(); paintAnswer(); paintWorking(); paintRecord(); }

function draw() {
  iso.frame(world, trial.stand.map(c => [c.x, c.y, 0]));
  iso.draw(world, null, {});
  for (const c of trial.stand) {
    const cell = world.get(c.x, c.y + 1, 0);
    iso.markCell(c.x, c.y + 1, 0, cell && cell.glyph ? PALETTE.gold : PALETTE.turq, cell && cell.glyph ? '' : 'place');
  }
  paintReads();
}

function paintReads() {
  const { readWorld } = window.__reader || {};
  const words = (world.list().filter(c => c.glyph).length && readWorldSafe()) || [];
  $('reads').innerHTML = words.length
    ? `The court reads: ${words.map(w => `<b>${w}</b>`).join(' &middot; ')}`
    : '<span style="color:var(--dim)">The court reads nothing yet.</span>';
  void readWorld;
}
function readWorldSafe() {
  const v = judge(trial, world);
  return v.reads;
}

function paintHeader() {
  $('trials').innerHTML = DATA.trials.map((t, i) => {
    const o = run.outcomes[i];
    return `<div class="tr${o ? ' ' + o : ''}${i === run.at ? ' here' : ''}" title="${t.name}${o ? ' — ' + o : ''}">${i + 1}</div>`;
  }).join('');
  const conv = run.outcomes.filter(o => o === 'lost').length;
  $('standing-n').innerHTML = `standing <b style="color:var(--gold-hi)">${'●'.repeat(Math.max(0, run.standing))}${'○'.repeat(Math.max(0, DATA.run.standing - run.standing))}</b> · convictions <b style="color:${conv ? 'var(--verm)' : 'var(--dim)'}">${conv}</b>`;
  $('trialno').textContent = `Trial ${run.at + 1} of ${DATA.trials.length} · the court of ${court.name.replace(/^The /, '')}`;
  $('title').innerHTML = `${trial.name}<span class="ar">${trial.arabic}</span>`;
}

function v(bundle) { return inVoice(bundle); }
function fallbackMark(bundle) {
  return voiceOf(bundle) === currentVoice() ? '' :
    ` <span style="color:var(--dim);font-size:.9em">(this passage has no ${currentVoice()} voice; shown austere)</span>`;
}

function paintText() {
  $('court').innerHTML = trial.court_note;
  $('charge').innerHTML = v(trial.charge) + fallbackMark(trial.charge);
  $('teaches').innerHTML = v(trial.teaches) + fallbackMark(trial.teaches);
  const d = trial.demand;
  $('demand').innerHTML = d.kind === 'reads-separate'
    ? `The court must read <span class="ar">${d.parts.join('</span> and <span class="ar">')}</span> <b>standing apart</b> — the word <span class="ar">${d.text}</span> (${d.gloss}), shown coming to pieces.`
    : `The word <span class="ar">${d.text}</span> (${d.gloss}) must stand before the court, <b>whole, as one body</b>.`
      + (d.min_length_note ? `<br><span style="color:#f0b98a">${d.min_length_note}.</span>` : '');
  $('sources').innerHTML = `<b>Sources and labels:</b> ${trial.sources.join(' · ')}`;
}

function paintHand() {
  $('hand').innerHTML = hand.length ? hand.map(g => {
    const l = LETTERS.find(x => x.glyph === g);
    return `<div class="lt${l.class === 'zulmani' ? ' dark' : ''}${sel === g ? ' sel' : ''}${fresh.includes(g) ? ' new' : ''}"
      data-g="${g}" title="${l.name} · abjad ${l.abjad} · name ${l.lettername}">
      <span class="g">${g}</span><span class="v">${l.abjad}</span></div>`;
  }).join('') : '<span style="color:var(--dim);font-family:var(--sans);font-size:.72rem">nothing in hand</span>';
  for (const el of $('hand').querySelectorAll('.lt')) {
    el.onclick = () => { sel = el.dataset.g; answer.push(el.dataset.g); paintHand(); paintAnswer(); };
  }
  $('break').disabled = !sel || over;
  $('submit').disabled = !answer.length || over;
  $('refuse').disabled = over;
}

function paintAnswer() {
  $('answer').innerHTML = answer.length
    ? answer.map((g, i) => `<div class="lt" data-i="${i}" title="take it back"><span class="g">${g}</span></div>`).join('')
    : '<span class="empty">empty — click letters in your hand; the answer reads right to left</span>';
  for (const el of $('answer').querySelectorAll('.lt')) {
    el.onclick = () => { answer.splice(+el.dataset.i, 1); paintAnswer(); paintHand(); };
  }
  $('submit').disabled = !answer.length || over;
}

function paintWorking() {
  if (!working) { $('working').textContent = 'Nothing broken yet. Select a letter and press Break.'; return; }
  $('working').innerHTML = `<ol>${working.steps.map(s =>
    `<li><b>${s.step}</b> — ${s.detail.replace(/([؀-ۿ]+)/g, '<span class="ar">$1</span>')}</li>`).join('')}</ol>`;
}

function paintRecord() {
  $('record').innerHTML = run.record.length
    ? run.record.map(r => `<li><span class="ar">${r.glyph}</span> conceals <span class="ar">${r.claim.split('conceals ')[1]}</span> <span style="color:var(--dim)">(its name is <span class="ar">${r.name}</span>)</span></li>`).join('')
    : '<li style="color:var(--dim)">Nothing recorded. Every letter you break is entered here.</li>';
}

function say(msg, kind = '') { $('say').innerHTML = msg; $('say').className = kind; }

/* ------------------------------------------------------------------ verbs -- */

function doBreak() {
  if (over || !sel) return;
  const r = breakLetter(hand, sel, LETTERS);
  working = r.working;
  if (r.refused) { paintWorking(); return say(r.why, 'bad'); }
  fresh = r.released;
  hand = r.hand;
  run.record.push(recordEntry(sel, r.working));
  ledger.witness({ op: 'TAKSIR', glyph: sel, ruleset: court.id });
  say(`${sel} broken — its name is ${r.working.names[0].name}, and it concealed ${r.released.join(' ')}`, 'good');
  paintHand(); paintWorking(); paintRecord();
}

function doAnswer() {
  if (over || !answer.length) return;
  const word = answer.join('');
  const r = inscribe(trial, hand, word, { letters: LETTERS, ruleset: court });
  if (r.refused) {
    // A refusal by the court's own rules is not a conviction; it is the court
    // declining to hear you. Say exactly why, in the court's own words.
    say(`The court does not hear it: ${r.why}`, 'bad');
    return;
  }
  world = r.world;
  const verdict = judge(trial, world);
  draw();
  finish(verdict.held ? 'won' : 'lost', verdict.why);
}

function doRefuse() {
  if (over) return;
  run.standing -= 1;
  finish('refused', inVoice(DATA.refusal));
}

function finish(outcome, why) {
  run.outcomes[run.at] = outcome;
  if (outcome === 'lost') run.standing -= 1;
  over = true;
  paintHeader();
  const text = outcome === 'refused' ? why : inVoice(trial.verdict[outcome]);
  const colour = outcome === 'won' ? 'var(--gold-hi)' : outcome === 'lost' ? 'var(--verm)' : 'var(--turq)';
  const last = run.at >= DATA.trials.length - 1;
  const convictions = run.outcomes.filter(o => o === 'lost').length;
  const done = last || run.standing <= 0 || convictions >= DATA.run.convictions_to_exile;
  $('overcard').innerHTML =
    `<h3 style="color:${colour}">${outcome === 'won' ? 'The charge fails' : outcome === 'lost' ? 'A conviction' : 'You refuse'}</h3>` +
    `<p>${why && outcome !== 'refused' ? `<i style="color:var(--dim)">${why}</i><br><br>` : ''}${text}</p>` +
    (done ? endingCard() : `<div class="row" style="margin-top:.8rem">
        <button class="btn big" id="next">Next trial &rarr;</button>
        <button class="btn" id="again">Take this trial again</button></div>`);
  $('over').classList.add('show');
  if (done) {
    $('newrun2').onclick = () => newRun();
  } else {
    $('next').onclick = () => { run.at += 1; over = false; $('over').classList.remove('show'); enterTrial(); };
    $('again').onclick = () => { run.outcomes[run.at] = null; over = false; $('over').classList.remove('show'); enterTrial(); };
  }
}

function endingCard() {
  const convictions = run.outcomes.filter(o => o === 'lost').length;
  const exiled = run.standing <= 0 || convictions >= DATA.run.convictions_to_exile;
  const bundle = exiled ? DATA.endings.exiled : DATA.endings.cleared;
  const rows = DATA.trials.map((t, i) =>
    `<tr><td style="padding-right:.7rem;color:var(--dim)">${t.name}</td><td style="color:var(--dim)">${t.court}</td><td><b>${run.outcomes[i] || '—'}</b></td></tr>`).join('');
  return `<hr style="border:none;border-top:1px solid var(--rule);margin:.9rem 0">
    <h3 style="font-size:1.05rem">${exiled ? 'Exile' : 'You are cleared'}</h3>
    <p>${inVoice(bundle)}</p>
    <table style="font-size:.74rem;margin:.6rem 0">${rows}</table>
    <p style="font-size:.72rem;color:var(--dim)">Breaks recorded: ${run.record.length}. Standing left: ${Math.max(0, run.standing)}.</p>
    <div class="row" style="margin-top:.6rem"><button class="btn big" id="newrun2">Another run</button></div>`;
}

/* ------------------------------------------------------------------- boot -- */

(async function main() {
  const [lj, pj, dj] = await Promise.all([
    fetch(`../../data/letters.json?${V}`).then(r => r.json()),
    fetch(`../../rulesets/rulesets.json?${V}`).then(r => r.json()),
    fetch(`./trials.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters; PACK = pj; DATA = dj;
  ledger = new Ledger();

  iso = new Iso($('cv'));
  iso.onStyle = () => { if (world) draw(); };
  iso.bindStyleToggle($('style'));
  iso.bindCamera($('camera'), () => { if (world) draw(); });
  mountHowTo($('howto-btn'), HOWTO);
  mountVoicePicker($('voice'), () => { paintText(); if (over) paintAll(); });
  addEventListener('resize', () => { iso.resize(); if (world) draw(); });

  $('break').onclick = doBreak;
  $('submit').onclick = doAnswer;
  $('refuse').onclick = doRefuse;
  $('newrun').onclick = () => newRun();

  iso.resize();
  newRun();

  window.__tribunal = {
    get run() { return run; }, get trial() { return trial; }, get hand() { return hand; },
    get world() { return world; }, get iso() { return iso; }, get over() { return over; },
    LETTERS, PACK, DATA, newRun,
    select: g => { sel = g; paintHand(); },
    breakSelected: doBreak, refuse: doRefuse,
    answerWith: word => { answer = [...word]; paintAnswer(); doAnswer(); },
    /**
     * Play the whole tribunal through the real input path, using the gate's own
     * solver to find each answer. Proves the UI wiring, not just the rules.
     */
    selfTest() {
      newRun();
      const out = [];
      for (let i = 0; i < DATA.trials.length; i++) {
        const s = solve(trial, { letters: LETTERS, ruleset: court });
        for (const g of s.breaks) { sel = g; doBreak(); }
        answerWithReal(trial.demand.text);
        out.push({ trial: trial.id, outcome: run.outcomes[run.at], breaks: s.breaks.length });
        if (run.at >= DATA.trials.length - 1) break;
        run.at += 1; over = false; $('over').classList.remove('show'); enterTrial();
      }
      return { all: out.every(o => o.outcome === 'won'), trials: out, standing: run.standing };
    },
    /** A run in which every charge is refused — the historical gesture. */
    refuseEverything() {
      newRun();
      const out = [];
      for (let i = 0; i < DATA.trials.length; i++) {
        doRefuse();
        out.push({ trial: trial.id, outcome: run.outcomes[run.at] });
        if (run.at >= DATA.trials.length - 1) break;
        run.at += 1; over = false; $('over').classList.remove('show'); enterTrial();
      }
      return { outcomes: out, standing: run.standing, convictions: run.outcomes.filter(o => o === 'lost').length };
    },
  };
  function answerWithReal(word) { answer = [...word]; paintAnswer(); doAnswer(); }
})();
