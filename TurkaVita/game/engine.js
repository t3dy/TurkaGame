// engine.js — scene-spec state machine. Mirrors scripts/narrative_lib.py exactly:
//   "score.X" / "profile.X" / "court.X" / "press.X" add a number; anything else is set.
//   requires {k: v} means state[k] === v; {k: [a, b]} means state[k] is one of them.
//   requires_min {k: n} means (state[k] || 0) >= n; requires_max {k: n} means (state[k] || 0) <= n.
// Order inside a scene: rulings -> commitment -> composer -> sorter -> the choice.
(function () {
  const AXES = ["doctrine", "biography", "textual", "calibration"];
  const ADDITIVE = ["score.", "profile.", "court.", "press."];
  const isAdd = (k) => ADDITIVE.some((p) => k.startsWith(p));
  const isNum = (v) => typeof v === "number";

  // --- the provenance dossier. Mirrors scripts/narrative_lib.py exactly.
  // Standing is a count of readings, never a truth value. Nothing here decides who Ibn Turka was;
  // it measures the player's commitment against their own dossier, and applies the duress rule:
  // only what he wrote freely can show what he HELD.
  const HELD_KINDS = ["letter", "colophon", "autograph", "early_work", "work"];
  const UNDETERMINED_MARGIN = 2;

  function merge(list) {
    const out = {};
    for (const e of list) for (const k of Object.keys(e)) out[k] = isAdd(k) && isNum(e[k]) ? (out[k] || 0) + e[k] : e[k];
    return out;
  }

  function dossier(state) {
    return Object.keys(state).filter((k) => k.startsWith("dossier.") && state[k]).map((k) => k.slice(8));
  }
  function lensOf(state) { return state.lens || "all"; }
  function visible(bearing, lens) { return lens === "all" || bearing.attributed_to === lens; }

  function standings(hypotheses, state) {
    const have = new Set(dossier(state)), lens = lensOf(state);
    const rows = Object.values(hypotheses || {})
      .slice()
      .sort((a, b) => (a.letter < b.letter ? -1 : 1))
      .map((h) => {
        const seen = h.bearings.filter((b) => have.has(b.evidence) && visible(b, lens));
        const sup = seen.filter((b) => b.direction === "supports");
        const strain = seen.filter((b) => b.direction === "strains");
        return { id: h.id, letter: h.letter, name: h.name, supports: sup.length, strains: strain.length,
                 net: sup.length - strain.length, kinds: Array.from(new Set(sup.map((b) => b.kind))).sort() };
      });
    rows.sort((a, b) => b.net - a.net || (a.letter < b.letter ? -1 : 1));
    return rows;
  }

  function verdict(hypotheses, state) {
    const st = standings(hypotheses, state);
    if (!dossier(state).length || !st.length)
      return { leader: null, net: 0, margin: 0, underdetermined: true, empty: true, standings: st };
    const margin = st.length > 1 ? st[0].net - st[1].net : st[0].net;
    return { leader: st[0].id, net: st[0].net, margin, underdetermined: margin < UNDETERMINED_MARGIN,
             empty: false, standings: st };
  }

  function commitTags(hypotheses, state, scene, hypId) {
    const block = scene.commitment || {};
    const unknownOption = block.underdetermined_option;
    const v = verdict(hypotheses, state);
    const h = hypotheses[hypId];
    if (v.empty) return ["empty_dossier"];
    const tags = [];
    if (v.underdetermined) {
      if (hypId === unknownOption) tags.push("calibrated_unknown");
      else if (h.commitments.conviction) tags.push("false_certainty");
      else tags.push("non_conviction");
    } else {
      if (hypId === v.leader) tags.push("coherent");
      else if (hypId === unknownOption) tags.push("over_caution");
      else tags.push("incoherent");
    }
    if (h.commitments.conviction) {
      const row = v.standings.find((r) => r.id === hypId);
      if (!row || !row.kinds.some((k) => HELD_KINDS.indexOf(k) >= 0)) tags.push("coerced_testimony");
    }
    return tags;
  }

  function commitEffects(hypotheses, state, scene, hypId) {
    const scoring = (scene.commitment || {}).scoring || {};
    const tags = commitTags(hypotheses, state, scene, hypId);
    const eff = merge(tags.map((t) => scoring[t] || {}));
    eff["who.commit"] = hypId;
    eff["who.verdict"] = tags.join(",");
    return eff;
  }

  function available(choice, state) {
    const req = choice.requires || {};
    const ok = Object.keys(req).every((k) => {
      const v = req[k];
      return Array.isArray(v) ? v.includes(state[k]) : state[k] === v;
    });
    if (!ok) return false;
    const mins = choice.requires_min || {}, maxs = choice.requires_max || {};
    return Object.keys(mins).every((k) => (state[k] || 0) >= mins[k]) &&
           Object.keys(maxs).every((k) => (state[k] || 0) <= maxs[k]);
  }

  function apply(effects, state) {
    const s = Object.assign({}, state);
    for (const k of Object.keys(effects)) {
      if (isAdd(k)) s[k] = (s[k] || 0) + effects[k];
      else s[k] = effects[k];
    }
    return s;
  }

  // mirrors narrative_lib.ruling_effects
  function rulingEffects(scene, answers) {
    return merge((scene.rulings || []).map((r) =>
      answers[r.id] === r.answer ? r.effects_correct : (r.effects_wrong || {})));
  }

  // mirrors narrative_lib.composer_effects
  function composerEffects(scene, picks) {
    const comp = scene.composer;
    if (!comp) return {};
    const eff = [];
    for (const slot of comp.slots) {
      const opt = slot.options.find((o) => o.id === picks[slot.id]);
      if (opt) eff.push(opt.effects);
    }
    return merge(eff);
  }

  // mirrors narrative_lib.kendall / sort_effects
  function kendall(order, truth) {
    const pos = {};
    truth.forEach((x, i) => { pos[x] = i; });
    const seq = order.map((x) => pos[x]);
    let d = 0;
    for (let i = 0; i < seq.length; i++) for (let j = i + 1; j < seq.length; j++) if (seq[i] > seq[j]) d++;
    return d;
  }
  function sortEffects(scene, order) {
    const srt = scene.sorter;
    if (!srt) return {};
    const truth = srt.truth;
    const pairs = (truth.length * (truth.length - 1)) / 2;
    const d = kendall(order, truth);
    const sc = srt.scoring || {};
    const eff = {};
    eff["sort." + scene.id + ".distance"] = d;
    eff["sort." + scene.id + ".pairs"] = pairs;
    eff[sc.axis || "score.textual"] = pairs ? Math.trunc(((sc.max === undefined ? 6 : sc.max) * (pairs - 2 * d)) / pairs) : 0;
    if (d === 0) for (const k of Object.keys(sc.exact_effects || {})) eff[k] = sc.exact_effects[k];
    return eff;
  }

  function createGame(content) {
    let sceneId = content.start;
    let state = {};
    let trail = [];
    let pending = null;   // chosen but not yet continued
    let answers = {};     // rulings answered in the current scene
    let rulingsApplied = false;
    let committed = null; // the position committed to in the current scene, if it asks for one
    let picks = {};       // composer picks in the current scene
    let composerApplied = false;
    let sorted = null;    // the order the player gave the sorter in the current scene

    return {
      AXES,
      get hypotheses() { return content.hypotheses || {}; },
      get scene() { return sceneId === "END" ? null : content.scenes[sceneId]; },
      get state() { return Object.assign({}, state); },
      get trail() { return trail.slice(); },
      get pending() { return pending; },
      get answers() { return Object.assign({}, answers); },
      get picks() { return Object.assign({}, picks); },
      get sortedOrder() { return sorted ? sorted.slice() : null; },
      rulingsDone() {
        const s = this.scene;
        return !s || (s.rulings || []).every((r) => answers[r.id]);
      },
      rule(rulingId, answer) {
        const s = this.scene;
        if (!s || rulingsApplied || answers[rulingId] || !(s.rulings || []).some((r) => r.id === rulingId)) return false;
        if (answer !== "stand" && answer !== "refute") return false;
        answers[rulingId] = answer;
        if (this.rulingsDone()) {
          state = apply(rulingEffects(s, answers), state);
          rulingsApplied = true;
        }
        return true;
      },
      // --- the dossier
      get committed() { return committed; },
      commitmentDone() {
        const s = this.scene;
        return !s || !s.commitment || !!committed;
      },
      standings() { return standings(this.hypotheses, state); },
      verdict() { return verdict(this.hypotheses, state); },
      commitTags(hypId) { return commitTags(this.hypotheses, state, this.scene, hypId); },
      commit(hypId) {
        const s = this.scene;
        if (!s || !s.commitment || committed || !this.rulingsDone()) return false;
        if (!s.commitment.options.some((o) => o.hypothesis === hypId)) return false;
        const tags = commitTags(this.hypotheses, state, s, hypId);
        state = apply(commitEffects(this.hypotheses, state, s, hypId), state);
        committed = { hypothesis: hypId, tags };
        return committed;
      },
      // --- the composer: a work assembled from the moves the source reports
      composerDone() {
        const s = this.scene;
        return !s || !s.composer || composerApplied;
      },
      pick(slotId, optionId) {
        const s = this.scene;
        if (!s || !s.composer || composerApplied || !this.rulingsDone() || !this.commitmentDone()) return false;
        const slot = s.composer.slots.find((x) => x.id === slotId);
        if (!slot || !slot.options.some((o) => o.id === optionId)) return false;
        picks[slotId] = optionId;
        if (s.composer.slots.every((x) => picks[x.id])) {
          state = apply(composerEffects(s, picks), state);
          composerApplied = true;
        }
        return true;
      },
      // --- the sorter: the collection puzzle
      sorterDone() {
        const s = this.scene;
        return !s || !s.sorter || !!sorted;
      },
      sort(order) {
        const s = this.scene;
        if (!s || !s.sorter || sorted || !this.rulingsDone() || !this.commitmentDone() || !this.composerDone()) return false;
        const ids = s.sorter.items.map((i) => i.id).sort();
        if (order.length !== ids.length || order.slice().sort().join("|") !== ids.join("|")) return false;
        state = apply(sortEffects(s, order), state);
        sorted = order.slice();
        return true;
      },
      ready() { return this.rulingsDone() && this.commitmentDone() && this.composerDone() && this.sorterDone(); },
      options() {
        const s = this.scene;
        return s && this.ready() ? s.choices.filter((c) => available(c, state)) : [];
      },
      choose(choiceId) {
        if (pending || !this.scene || !this.ready()) return false;
        const c = this.options().find((o) => o.id === choiceId);
        if (!c) return false;
        state = apply(c.effects, state);
        trail.push({ scene: sceneId, choice: c.id });
        pending = c;
        return c;
      },
      advance() {
        if (!pending) return false;
        sceneId = pending.next || content.scenes[sceneId].next;
        pending = null;
        answers = {};
        rulingsApplied = false;
        committed = null;
        picks = {};
        composerApplied = false;
        sorted = null;
        return true;
      },
      reset() {
        sceneId = content.start; state = {}; trail = []; pending = null;
        answers = {}; rulingsApplied = false; committed = null; picks = {}; composerApplied = false; sorted = null;
      },
      // the court board: favour per court, pressure per kind, only what has moved
      board() {
        const rows = { court: [], press: [] };
        for (const k of Object.keys(state)) {
          if (k.startsWith("court.")) rows.court.push({ key: k.slice(6), value: state[k] });
          else if (k.startsWith("press.")) rows.press.push({ key: k.slice(6), value: state[k] });
        }
        return rows;
      },
      // whose Ibn Turka did you play? share of your reconstruction choices each scholar's model uses
      affinities() {
        const picked = new Set();
        for (const t of trail) {
          const c = content.scenes[t.scene].choices.find((x) => x.id === t.choice);
          (c.based_on || []).filter((id) => id.startsWith("REC-")).forEach((id) => picked.add(id));
        }
        return Object.values(content.models || {})
          .map((m) => ({ model: m, hits: m.uses.filter((id) => picked.has(id)).length }))
          .filter((x) => x.hits > 0)
          .sort((a, b) => b.hits - a.hits);
      },
      artifact(id) { return content.artifacts[id]; },
      scores() { return AXES.map((a) => [a, state["score." + a] || 0]); },
    };
  }

  window.TurkaEngine = { createGame, available, apply, rulingEffects, composerEffects, sortEffects, kendall, AXES,
    dossier, lensOf, standings, verdict, commitTags, commitEffects, HELD_KINDS, UNDETERMINED_MARGIN };
})();
