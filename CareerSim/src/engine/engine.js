// engine.js — encounter evaluation and gradient resolution.
// The DungeonAB v6 pattern ported to a career: capability × affordance → options
// with unlockedBy provenance → weighted gradient outcome → memory + chronicle.
// Framework-agnostic; see docs/SYSTEMS.md §3, §8.

import { checkReq, applyEffects } from './state.js?v=3';
import { meetsExposure } from './career.js?v=4';

export const BANDS = ['triumph', 'success', 'qualified', 'ambiguous', 'backfire', 'disaster'];

// Is this encounter currently eligible to fire? (memory predicates + once-only)
export function encounterEligible(state, enc) {
  if (state.seen.includes(enc.id)) return false;
  if (enc.phase != null && enc.phase !== state.phase) return false;
  if (!meetsExposure(state, enc)) return false;
  for (const req of enc.when || []) {
    if (!checkReq(state, req).ok) return false;
  }
  return true;
}

// Draw the first eligible encounter from a node's pool.
export function drawEncounter(state, node, encounters) {
  for (const id of node.encounters) {
    const enc = encounters[id];
    if (enc && encounterEligible(state, enc)) return enc;
  }
  return null;
}

// Evaluate every option of an encounter against current state.
// Each returned option carries:
//   available   — can be chosen now
//   unlockedBy  — human clauses for its met requirements (provenance; [] if free)
//   lockedBy    — human clauses for unmet requirements (teach through the locked door)
//   favoredBy   — met boost clauses (they shift the outcome roll upward)
export function evaluateOptions(state, enc, people, artifacts) {
  const affs = new Set(enc.affordances || []);
  return enc.options.map((opt) => {
    const unlockedBy = [];
    const lockedBy = [];
    for (const req of opt.requires || []) {
      if (req.startsWith('aff:')) {
        const a = req.slice(4);
        if (affs.has(a)) unlockedBy.push(`the ${a.replace(/_/g, ' ')} at hand`);
        else lockedBy.push(`needs ${a.replace(/_/g, ' ')}`);
        continue;
      }
      const r = checkReq(state, req, people, artifacts);
      if (r.ok) unlockedBy.push(r.text);
      else lockedBy.push(`needs ${r.text}`);
    }
    const favoredBy = [];
    for (const req of opt.boosts || []) {
      const r = checkReq(state, req, people, artifacts);
      if (r.ok) favoredBy.push(r.text);
    }
    return { opt, available: lockedBy.length === 0, unlockedBy, lockedBy, favoredBy };
  });
}

// Weighted pick over the option's outcome bands. Met boosts double the weight of
// the two best bands present — preparation tilts the ladder, it never coin-flips.
export function resolveOption(state, enc, evaluated, rng) {
  const { opt, favoredBy } = evaluated;
  const roll = rng || Math.random;
  const outcomes = opt.outcomes.slice();
  const order = (o) => BANDS.indexOf(o.band);
  outcomes.sort((a, b) => order(a) - order(b));

  const weights = outcomes.map((o) => o.weight);
  if (favoredBy.length > 0) {
    for (let i = 0; i < Math.min(2, weights.length); i++) weights[i] *= 1 + favoredBy.length;
  }
  const total = weights.reduce((a, b) => a + b, 0);
  let r = roll() * total;
  let picked = outcomes[outcomes.length - 1];
  for (let i = 0; i < outcomes.length; i++) {
    r -= weights[i];
    if (r <= 0) { picked = outcomes[i]; break; }
  }

  // Apply: option base effects, then band effects, then encounter-level memory.
  const applied = { deltas: [], memWrites: [] };
  const merge = (res) => { applied.deltas.push(...res.deltas); applied.memWrites.push(...res.memWrites); };
  merge(applyEffects(state, opt.effects, enc.id));
  merge(applyEffects(state, picked.effects, enc.id));
  if (enc.memory_writes) {
    merge(applyEffects(state, { memory: Object.fromEntries(enc.memory_writes.map((f) => [f, true])) }, enc.id));
  }
  if (opt.time) merge(applyEffects(state, { time: -opt.time }, enc.id));

  const line = picked.chronicle || opt.chronicle || null;
  if (line) state.chronicle.push({ text: line, band: picked.band, encounterId: enc.id, phase: state.phase });
  state.seen.push(enc.id);

  return { band: picked.band, text: picked.text, deltas: applied.deltas, memWrites: applied.memWrites, chronicleLine: line };
}

// ---- run-end verdict (Slice-0 scale: Cairo only) ----------------------------
// Two axes, scored independently (docs/SYSTEMS.md §9). At single-phase scale the
// axes read formation, not fate: who did he become / what has begun to exist
// outside his head.
export function cairoVerdict(state) {
  const m = state.meters;
  const man =
    m.exposure >= 4 ? { key: 'marked', title: 'A Marked Man', text: 'He leaves Cairo already talked about — brilliance and suspicion in the same breath.' }
    : state.rep.scholarly >= 2 && state.rep.orthodox >= 1 ? { key: 'credentialed', title: 'The Credentialed Jurist', text: 'He leaves with clean credentials and quiet notebooks — the safest possible beginning.' }
    : state.rep.occult >= 3 ? { key: 'initiate', title: 'The Initiate', text: 'He leaves as Akhlātī’s man, whatever that will come to cost.' }
    : { key: 'seeker', title: 'The Seeker', text: 'He leaves Cairo unfinished — much seen, little settled.' };

  const net = state.people.length;
  const system =
    m.synthesis >= 4 && net >= 2 ? { key: 'platform', title: 'A Platform Begun', text: 'Letters, numbers, and friends who understand both: the future system already has its first architects.' }
    : m.synthesis >= 3 ? { key: 'notebooks', title: 'Private Notebooks', text: 'The connections exist — but only in his own hand, and paper burns.' }
    : net >= 2 ? { key: 'circle', title: 'A Circle Without a Doctrine', text: 'The friendships are real; the system they might carry is not yet written.' }
    : { key: 'scattered', title: 'Scattered Sparks', text: 'Fragments of five sciences and no thread yet drawn through them.' };

  // Marginalia: the ending reads the run's memory back to the player — every
  // notable flag surfaces here if nowhere earlier (lint: no unread writes).
  const notes = [];
  const mem = state.memory;
  if (mem.akhlati_public) notes.push('He wore Akhlātī’s name openly. Isfahan will have heard it before he arrives.');
  if (mem.akhlati_quiet) notes.push('His years with Akhlātī stay off the record — a debt carried privately.');
  if (mem.new_brethren) notes.push('He was present the night the circle took the Brethren’s name.');
  if (mem.new_brethren_wary) notes.push('He warned the circle what a name can cost. The warning is on record.');
  if (mem.qasim_bond === 'deep') notes.push('Qāsim-i Anvār counts him a brother. That ledger stays open for life.');
  if (mem.yazdi_bond === 'equal') notes.push('With Yazdī the trade runs both ways — number for letter, letter for number.');
  if (mem.yazdi_bond === 'mentor') notes.push('He taught Yazdī from the senior seat. The roles will not hold.');
  if (mem.lineages_declared === 'both') notes.push('He has already paired Ibn ʿArabī and Ḥamūya as co-founders — the signature move of his future system.');
  if (mem.feast_performed) notes.push('Cairo retells his feast-night wonder. Stories like that travel east on their own.');
  if (mem.dervish_believed) notes.push('He let a doubtful miracle stand. Somewhere his name is listed among its witnesses.');
  if (mem.dervish_exposed) notes.push('He unpicked a false miracle in public. The credulous resent it; the careful noted it.');
  if (mem.dervish_open) notes.push('Asked to judge a wonder, he gave the salon metaphysics. Nobody is sure what he believes — which may be the point.');

  return { man, system, notes };
}
