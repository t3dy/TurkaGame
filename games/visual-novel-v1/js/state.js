// state.js — player state: Occult Quintet skills + one flag per choice.
// Pattern forked from ../../../EmblemNovel/js/state.js (flags/localStorage shape),
// extended with the 5-score skill tree per ../STATE_MODEL.md.

const SAVE_KEY = 'turkagame_vn_save_v1';

export class State {
  constructor() {
    this.globalIndex = 0; // 0-39, index into choices.json's flat choices array
    this.skills = { kimiya: 0, limiya: 0, himiya: 0, simiya: 0, rimiya: 0 };
    this.flags = {}; // choice id ("c01"..."c40") -> chosen option id
    this.history = []; // [{choiceId, optionId, act}]
    this.finished = false;
    this.endingId = null;
  }

  // Is `option` available given flags set so far? Reads option.gate, e.g. {c10:"loyal"}.
  optionAvailable(option) {
    if (!option.gate) return true;
    return Object.entries(option.gate).every(([choiceId, requiredOptionId]) => this.flags[choiceId] === requiredOptionId);
  }

  applyChoice(choice, option) {
    this.flags[choice.id] = option.id;
    if (option.skills) {
      for (const [skill, delta] of Object.entries(option.skills)) {
        if (skill === 'primary_bonus') {
          const primary = this.flags.primary_science || this.flags.c16;
          if (primary && this.skills[primary] !== undefined) this.skills[primary] += delta;
          continue;
        }
        if (this.skills[skill] !== undefined) this.skills[skill] += delta;
      }
    }
    if (option.flags && option.flags.primary_science) {
      this.flags.primary_science = option.flags.primary_science;
    }
    this.history.push({ choiceId: choice.id, optionId: option.id, act: choice.act });
    this.globalIndex += 1;
  }

  dominantScience() {
    const entries = Object.entries(this.skills);
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  breadth() {
    return Object.values(this.skills).filter((v) => v > 0).length;
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.toJSON()));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const s = new State();
      Object.assign(s, data);
      return s;
    } catch (e) {
      console.warn('Failed to load save:', e);
      return null;
    }
  }

  static reset() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) { /* ignore */ }
  }

  toJSON() {
    return {
      globalIndex: this.globalIndex,
      skills: this.skills,
      flags: this.flags,
      history: this.history,
      finished: this.finished,
      endingId: this.endingId,
    };
  }
}
