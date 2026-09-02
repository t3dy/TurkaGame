// analyze-content.mjs — static analysis of the encounter corpus.
//
//   node tools/analyze-content.mjs [section]
//   sections: shape gates reach invariants economy memory prose lexicon  (default: all)
//
// This exists because this project's docs make measurable claims about the content
// ("every science opens a door", "gradient outcomes, never pass/fail", "every term is
// glossed") and those claims have gone stale without anyone noticing. Every figure in
// docs/MECHANICSISSUES.md, docs/WRITINGAUDIT.md and docs/ECONOMY.md comes from here, so
// a future session can re-run it and find out which of them are still true.
//
// Nothing here plays the game — see tools/simulate-runs.mjs for that.

import { ENCOUNTERS, PHASES, PEOPLE, ARTIFACTS } from '../content/index.js?v=10';
import { LEXICON } from '../content/lexicon.js?v=2';
import { LEGACY_NOTES } from '../src/engine/career.js?v=8';
import { readFileSync } from 'node:fs';

const encs = Object.values(ENCOUNTERS);
const allOpts = encs.flatMap((e) => e.options);
const allOutcomes = encs.flatMap((e) => e.options.flatMap((o) => (o.outcomes || []).map((b) => ({ b, enc: e }))));
const allFx = allOpts.flatMap((o) => [o.effects, ...(o.outcomes || []).map((b) => b.effects)]).filter(Boolean);
const gated = (o) => (o.requires || []).length > 0;
const want = process.argv[2];
const run = (name, fn) => { if (!want || want === name) { console.log(`\n${'='.repeat(70)}\n${name.toUpperCase()}\n${'='.repeat(70)}`); fn(); } };
const SCI = ['kimiya', 'limiya', 'himiya', 'simiya', 'rimiya'];

run('shape', () => {
  console.log('phase  time nodes  enc  opts  opts/enc  free gated boost  plated  grounding');
  for (const p of PHASES) {
    const pe = encs.filter((e) => e.phase === p.id);
    const po = pe.flatMap((e) => e.options);
    const g = pe.reduce((a, e) => (a[e.grounding[0]] = (a[e.grounding[0]] || 0) + 1, a), {});
    console.log(`  P${p.id}   ${String(p.time).padStart(3)} ${String(p.nodes.length).padStart(5)} ${String(pe.length).padStart(4)} ${String(po.length).padStart(5)}`
      + `  ${(po.length / pe.length).toFixed(2).padStart(7)}  ${String(po.filter((o) => !gated(o)).length).padStart(4)} ${String(po.filter(gated).length).padStart(5)}`
      + ` ${String(po.filter((o) => (o.boosts || []).length).length).padStart(5)}  ${String(pe.filter((e) => e.plate).length).padStart(6)}  A${g.A || 0}/P${g.P || 0}/I${g.I || 0}`);
    console.log(`         node pools: [${p.nodes.map((n) => n.encounters.length).join(', ')}]  <- pool sizes; the draw is random among the eligible`);
  }
  const hist = {};
  for (const e of encs) hist[e.options.length] = (hist[e.options.length] || 0) + 1;
  console.log('\noptions per encounter:', JSON.stringify(hist));
});

run('gates', () => {
  const kind = (r) => {
    const b = r.replace(/^!/, '');
    if (SCI.some((s) => b.startsWith(s))) return 'quintet';
    const m = b.match(/^([a-z]+):/); if (m) return m[1];
    const n = b.match(/^([a-z]+)(>=|<=)/); return n ? n[1] : 'other';
  };
  const tally = {};
  for (const o of allOpts) {
    for (const r of o.requires || []) { const k = kind(r); tally[k] ||= { requires: 0, boosts: 0 }; tally[k].requires++; }
    for (const r of o.boosts || []) { const k = kind(r); tally[k] ||= { requires: 0, boosts: 0 }; tally[k].boosts++; }
  }
  console.log('requirement grammar usage:');
  for (const [k, v] of Object.entries(tally).sort((a, b) => (b[1].requires + b[1].boosts) - (a[1].requires + a[1].boosts)))
    console.log(`  ${k.padEnd(10)} requires=${String(v.requires).padStart(3)}  boosts=${String(v.boosts).padStart(3)}`);
  console.log('\ngrammar forms implemented in state.js but used by NO content:');
  const used = new Set(allOpts.flatMap((o) => [...(o.requires || []), ...(o.boosts || [])]).map(kind));
  for (const form of ['expectation', 'time', 'cap', 'artifact', 'access', 'meter', 'rep', 'mem', 'person', 'quintet'])
    if (!used.has(form)) console.log(`  ${form}`);
  console.log('\nengine fields implemented but unused by content:');
  console.log(`  opt.time (extra season cost): used by ${allOpts.filter((o) => o.time).length} options`);
  console.log(`  grantsObligation: ${allOpts.filter((o) => o.grantsObligation).length} options`);
  console.log(`  contract:         ${allOpts.filter((o) => o.contract).length} options`);
});

run('reach', () => {
  // Grants inside one encounter are mutually exclusive: one option, one band.
  const perEnc = [];
  for (const e of encs) {
    const best = {};
    for (const o of e.options) {
      for (const s of SCI) {
        const base = ((o.effects || {}).quintet || {})[s] || 0;
        const band = Math.max(0, ...(o.outcomes || []).map((b) => ((b.effects || {}).quintet || {})[s] || 0));
        best[s] = Math.max(best[s] || 0, base + band);
      }
    }
    if (SCI.some((s) => best[s] > 0)) perEnc.push({ e, best });
  }
  console.log('encounters that grant any Quintet tier:');
  for (const { e, best } of perEnc)
    console.log(`  P${e.phase} ${e.id.padEnd(16)} ${JSON.stringify(Object.fromEntries(Object.entries(best).filter(([, v]) => v > 0)))}`
      + (Object.values(best).filter((v) => v > 0).length > 1 ? '   <- pick ONE' : ''));
  const max = Object.fromEntries(SCI.map((s) => [s, perEnc.reduce((a, x) => a + x.best[s], 0)]));
  console.log('\nmax attainable tier per science, all grants taken:', JSON.stringify(max));

  const gates = [];
  for (const e of encs) for (const o of e.options) for (const k of ['requires', 'boosts'])
    for (const r of o[k] || []) {
      const m = r.replace(/^!/, '').match(/^(kimiya|limiya|himiya|simiya|rimiya)>=(\d)$/);
      if (m) gates.push({ e, o, sci: m[1], tier: +m[2], k });
    }
  const dead = gates.filter((g) => g.tier > max[g.sci]);
  console.log(`\n${gates.length} Quintet gates; ${dead.length} CAN NEVER BE SATISFIED:`);
  for (const g of dead) console.log(`  P${g.e.phase} ${g.e.id} [${g.k}] "${g.o.label}" needs ${g.sci}>=${g.tier} (max ${max[g.sci]})`);
});

run('invariants', () => {
  const noFree = encs.filter((e) => !e.options.some((o) => !gated(o)));
  const noGated = encs.filter((e) => !e.options.some(gated));
  console.log(`CLAUDE.md: ">=1 free option and >=1 capability-gated option" per encounter`);
  console.log(`  no free option:  ${noFree.length}  ${noFree.map((e) => e.id).join(', ')}`);
  console.log(`  no gated option: ${noGated.length} of ${encs.length} (${(100 * noGated.length / encs.length).toFixed(0)}%)`);
  console.log(`    ${noGated.map((e) => 'P' + e.phase + ':' + e.id).join(', ')}`);
  console.log(`\nSYSTEMS.md §8: "gradient outcomes (6-step), never pass/fail"`);
  const single = allOpts.filter((o) => (o.outcomes || []).length === 1);
  console.log(`  options with exactly one outcome (no roll at all): ${single.length} of ${allOpts.length} (${(100 * single.length / allOpts.length).toFixed(0)}%)`);
  const hist = {};
  for (const o of allOpts) hist[(o.outcomes || []).length] = (hist[(o.outcomes || []).length] || 0) + 1;
  console.log('  outcomes-per-option histogram:', JSON.stringify(hist));
  const bands = {};
  for (const { b } of allOutcomes) bands[b.band] = (bands[b.band] || 0) + 1;
  const tot = Object.values(bands).reduce((a, b) => a + b, 0);
  console.log('  authored band mix:', Object.entries(bands).map(([k, v]) => `${k} ${(100 * v / tot).toFixed(0)}%`).join(', '));
  console.log(`\nATTESTED encounters missing a source pointer: ${encs.filter((e) => e.grounding === 'ATTESTED' && !e.source).length}`);
});

run('economy', () => {
  for (const p of PHASES) {
    const fx = encs.filter((e) => e.phase === p.id)
      .flatMap((e) => e.options.flatMap((o) => [o.effects, ...(o.outcomes || []).map((b) => b.effects)])).filter(Boolean);
    const acc = {};
    for (const f of fx) for (const [k, d] of Object.entries(f.meters || {})) {
      acc[k] ||= { pos: 0, neg: 0, sites: 0 }; acc[k].sites++;
      if (d > 0) acc[k].pos += d; else acc[k].neg += d;
    }
    console.log(`  P${p.id} (${p.time} seasons):  ` + ['synthesis', 'demonstration', 'transmission', 'exposure']
      .map((k) => `${k.slice(0, 4)} +${(acc[k] || {}).pos || 0}/${(acc[k] || {}).neg || 0} @${(acc[k] || {}).sites || 0}`).join('   '));
  }
  const exp = allFx.map((f) => (f.meters || {}).exposure).filter((d) => d != null);
  console.log(`\nexposure: ${exp.length} sites, ${exp.filter((d) => d > 0).length} raise it, ${exp.filter((d) => d < 0).length} lower it;`
    + ` total available +${exp.filter((d) => d > 0).reduce((a, b) => a + b, 0)} against a cap of 10`);
});

run('memory', () => {
  const writes = new Map();
  for (const e of encs) {
    const rec = (f) => { if (!writes.has(f)) writes.set(f, new Set()); writes.get(f).add(e.phase); };
    for (const f of e.memory_writes || []) rec(f);
    for (const o of e.options) {
      for (const f of Object.keys((o.effects || {}).memory || {})) rec(f);
      for (const b of o.outcomes || []) for (const f of Object.keys((b.effects || {}).memory || {})) rec(f);
      // Contract settlement writes memory too (career.js applies reward/failure effects).
      if (o.contract) for (const fx of [o.contract.reward, o.contract.failure])
        for (const f of Object.keys((fx || {}).memory || {})) rec(f);
    }
  }
  const reads = new Set();
  const scan = (r) => { const b = r.replace(/^!/, ''); if (b.startsWith('mem:')) reads.add(b.slice(4).split('=')[0]); };
  let crossPhase = 0; const crossFlags = new Set();
  for (const e of encs) {
    const rs = [...(e.when || []), ...e.options.flatMap((o) => [...(o.requires || []), ...(o.boosts || [])])];
    rs.forEach(scan);
    for (const r of rs) {
      const b = r.replace(/^!/, ''); if (!b.startsWith('mem:')) continue;
      const f = b.slice(4).split('=')[0];
      // A phase-less writer (the injected pressure ladder) can precede any phase.
      if (writes.has(f) && [...writes.get(f)].some((p) => p == null || p < e.phase)) { crossPhase++; crossFlags.add(f); }
    }
  }
  const notes = new Set(Object.keys(LEGACY_NOTES).map((k) => k.split('=')[0]));
  const endRead = new Set([...readFileSync(new URL('../src/engine/career.js', import.meta.url), 'utf8').matchAll(/(?:memory|m)\.([a-z_0-9]+)/g)].map((m) => m[1]));
  console.log(`  flags written:                 ${writes.size}`);
  console.log(`  read by an encounter gate:     ${reads.size}`);
  console.log(`  read ONLY at the ending:       ${[...writes.keys()].filter((f) => !reads.has(f)).length}`);
  console.log(`  never read anywhere (bug):     ${[...writes.keys()].filter((f) => !reads.has(f) && !notes.has(f) && !endRead.has(f)).join(', ') || 'none'}`);
  console.log(`  read but never written (bug):  ${[...reads].filter((f) => !writes.has(f)).join(', ') || 'none'}`);
  console.log(`  reads that reach BACK a phase: ${crossPhase} sites, ${crossFlags.size} flags — ${[...crossFlags].join(', ')}`);
});

run('prose', () => {
  const sents = (s) => String(s).split(/(?<=[.!?…])\s+/).filter(Boolean);
  const stat = (label, arr) => {
    const a = arr.filter(Boolean).map(String), l = a.map((s) => s.length).sort((x, y) => x - y);
    console.log(`  ${label.padEnd(16)} n=${String(a.length).padStart(3)}  median ${String(l[Math.floor(l.length / 2)]).padStart(3)}ch`
      + `  range ${l[0]}-${l[l.length - 1]}  mean ${(a.reduce((x, s) => x + sents(s).length, 0) / a.length).toFixed(2)} sentences`);
  };
  stat('situation', encs.map((e) => e.situation));
  stat('option label', allOpts.map((o) => o.label));
  stat('option detail', allOpts.map((o) => o.detail));
  stat('outcome text', allOutcomes.map((x) => x.b.text));
  stat('chronicle line', allOutcomes.map((x) => x.b.chronicle));

  const sit = encs.map((e) => e.situation);
  const chron = allOutcomes.map((x) => x.b.chronicle).filter(Boolean);
  console.log('\n  voice discipline (UI_STYLE_GUIDE §3 — Chronicle voice vs Gloss voice):');
  console.log(`    chronicle lines using second person: ${chron.filter((c) => /\byou\b|\byour\b/i.test(c)).length} of ${chron.length}`);
  console.log(`    situations using second person:      ${sit.filter((s) => /\byou\b|\byour\b/i.test(s)).length} of ${sit.length}`);
  console.log(`    situations also containing "he/his":  ${sit.filter((s) => /\byou\b/i.test(s) && /\b(he|his|him)\b/i.test(s)).length}`);
  console.log('      ^ NOT a defect: hand-checked 2026-08-31, every "he" is a third party (the shaykh,');
  console.log('        the deputy, the preacher). Kept in the report so nobody re-flags it as one.');

  const texts = [...sit, ...allOutcomes.map((x) => x.b.text).filter(Boolean)];
  const grams = {};
  for (const t of texts) {
    const w = t.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean);
    for (let i = 0; i + 5 <= w.length; i++) { const g = w.slice(i, i + 5).join(' '); grams[g] = (grams[g] || 0) + 1; }
  }
  const rep = Object.entries(grams).filter(([, n]) => n >= 3);
  console.log(`\n  repeated 5-grams across ${texts.length} texts (>=3 uses): ${rep.length}`);
  for (const [g, n] of rep.slice(0, 10)) console.log(`    ${n}x  ${g}`);
});

run('lexicon', () => {
  // Keep this list in step with the glossify() call sites in src/ui.js, or the number
  // below stops meaning anything.
  const glossed = [
    ...encs.map((e) => e.situation), ...PHASES.map((p) => p.intro),
    ...allOpts.map((o) => o.detail || ''), ...allOutcomes.map((x) => x.b.text || ''),
  ];
  const unglossed = [
    ...encs.map((e) => e.rubric), ...allOpts.map((o) => o.label),
    ...allOutcomes.map((x) => x.b.chronicle || ''),
  ];
  const n = (arr, t) => arr.reduce((a, s) => a + (String(s).split(t).length - 1), 0);
  let G = 0, U = 0;
  console.log('  term                glossed  unglossed');
  for (const t of Object.keys(LEXICON)) {
    const g = n(glossed, t), u = n(unglossed, t); G += g; U += u;
    console.log(`  ${t.padEnd(20)} ${String(g).padStart(6)} ${String(u).padStart(10)}`
      + (g === 0 && u > 0 ? '   <- player meets the word with no way in' : g === 0 ? '   <- defined, never used' : ''));
  }
  console.log(`\n  ${G} occurrences on glossable surfaces, ${U} on unglossable ones`);
  console.log(`  share of the glossary that can ever reach a player: ${(100 * G / (G + U)).toFixed(0)}%`);
});
