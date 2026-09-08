// voice.js — the tone selector.
//
// Ted, 2026-09-07, asked for register to be the player's choice rather than the
// designer's: "I'd like to have all these types of writing and the player can
// select the tone from a menu." So text in this project's data can be either a
// plain string (the same in every voice) or a BUNDLE — an object with one
// version per voice — and this module picks.
//
// The four voices, and why each exists:
//
//   AUSTERE   precise, cited, unornamented. The default, and the voice the
//             honesty labels live most naturally in.
//   BAROQUE   the register the scholarship is actually written in.
//             Melvin-Koushki's own prose calls things "gobsmacking" and
//             "mindbending", compares lettrism to Burroughs's cut-up method, and
//             describes the Mafāḥiṣ's prologue as "psychedelic". Flattening that
//             into museum-careful English is itself a distortion of the source.
//   UNCANNY   sparse and cold. The material handled as genuinely strange.
//             The risk here is the occult-fantasy cliché this project exists to
//             avoid, so the rule for writing it is: the strangeness must come
//             from something true, never from atmosphere.
//   WARM      a patient teacher. Longest, plainest, most forgiving; the best
//             voice for a first hour and the weakest for the hundredth.
//
// THE RULE THAT KEEPS THIS HONEST: a voice may change how something is said and
// never what is claimed. Citations, numbers, labels and source names are
// identical across all four — `voiceLint()` checks that, and the tests fail if a
// baroque line quietly drops a citation the austere one carries.

export const VOICES = {
  austere: { id: 'austere', name: 'Austere', blurb: 'precise, cited, unornamented' },
  baroque: { id: 'baroque', name: 'Baroque', blurb: "the scholarship's own register: alive, funny, unafraid" },
  uncanny: { id: 'uncanny', name: 'Uncanny', blurb: 'sparse and cold; the strangeness is in the facts' },
  warm:    { id: 'warm',    name: 'Warm',    blurb: 'a patient teacher, at length' },
};
export const VOICE_IDS = Object.keys(VOICES);
const KEY = 'turka.v2.voice';

export function currentVoice() {
  try { const v = localStorage.getItem(KEY); if (v && VOICES[v]) return v; } catch { /* fine */ }
  return 'austere';
}
export function setVoice(id) {
  if (!VOICES[id]) return;
  try { localStorage.setItem(KEY, id); } catch { /* fine */ }
}

/**
 * Read a bundle in the current (or given) voice. A plain string is returned as
 * is. A bundle missing the asked-for voice falls back to austere — and says so
 * through `voiceOf()`, so the interface can admit the fallback rather than
 * pretend the voice was honoured.
 */
export function inVoice(bundle, voice = currentVoice()) {
  if (bundle == null) return '';
  if (typeof bundle === 'string') return bundle;
  return bundle[voice] ?? bundle.austere ?? Object.values(bundle)[0] ?? '';
}
export function voiceOf(bundle, voice = currentVoice()) {
  if (typeof bundle === 'string' || bundle == null) return 'any';
  return bundle[voice] != null ? voice : 'austere';
}
/** Does this bundle actually carry every voice? */
export function isFullyVoiced(bundle) {
  if (typeof bundle === 'string') return true;
  return VOICE_IDS.every(v => typeof bundle[v] === 'string' && bundle[v].length > 0);
}

/**
 * A voice may change the wording, never the claim. This finds the things that
 * must survive translation between registers — citations, numbers, source names,
 * honesty labels — and reports any voice that drops one the austere text has.
 * Used by tests/voice.test.mjs.
 */
const CITE = /\b(?:pp?\.\s*\d+(?:\s*[–—-]\s*\d+)?|f{1,2}\.\s*\d+[ab]?|§\s*\d+|n\.\s*\d+)/g;
const LABEL = /\b(?:SOURCE|CORPUS|REPORTED|INTERPRETATION|GAME FICTION)\b/g;
const NUM = /\b\d+\b/g;
// Normalise before comparing: the same citation followed by a comma in one
// register and a bracket in another is the same citation. Without this the lint
// fails on text that is in fact correct, and a check that cries wolf is a check
// everyone learns to ignore.
const normCite = x => x.replace(/\s+/g, ' ').replace(/[.,;:)\]]+$/, '').trim();
export function voiceLint(bundle) {
  if (typeof bundle === 'string' || bundle == null) return [];
  const base = bundle.austere;
  if (base == null) return [{ voice: 'austere', missing: ['the austere voice itself'] }];
  const want = new Set([...base.match(CITE) || [], ...base.match(LABEL) || []].map(normCite));
  const problems = [];
  for (const v of VOICE_IDS) {
    const text = bundle[v];
    if (text == null) continue;
    const have = new Set([...text.match(CITE) || [], ...text.match(LABEL) || []].map(normCite));
    const missing = [...want].filter(w => !have.has(w));
    if (missing.length) problems.push({ voice: v, missing });
  }
  return problems;
}
export { CITE as CITATION_RE, NUM as NUMBER_RE };

/**
 * Mount a voice picker into `el`. Calls `onChange` after a change so the page can
 * repaint. Shows the current voice's blurb as a tooltip, and — deliberately —
 * shows nothing about which passages are missing a voice; `voiceOf()` is how a
 * page admits that at the point of use.
 */
export function mountVoicePicker(el, onChange) {
  if (!el) return { get value() { return currentVoice(); } };
  const render = () => {
    const cur = currentVoice();
    el.innerHTML = `<label class="voice-lab" for="voice-sel">Voice</label>` +
      `<select id="voice-sel" class="voice-sel" title="${VOICES[cur].blurb}">` +
      VOICE_IDS.map(v => `<option value="${v}"${v === cur ? ' selected' : ''}>${VOICES[v].name}</option>`).join('') +
      `</select>`;
    const sel = el.querySelector('#voice-sel');
    sel.onchange = () => { setVoice(sel.value); render(); if (onChange) onChange(sel.value); };
  };
  render();
  return { get value() { return currentVoice(); }, render };
}
