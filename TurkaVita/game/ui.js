// ui.js — renders the engine. All history comes from content.js; nothing here asserts any.
(function () {
  const E = window.TurkaEngine;
  const game = E.createGame(window.CONTENT);
  const app = document.getElementById("app");
  const $ = (id) => document.getElementById(id);
  window.__game = {
    get scene() { return game.scene && game.scene.id; },
    get state() { return game.state; },
    get trail() { return game.trail; },
    engine: game,
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const EPI = { attested: "attested", directly_inferred: "inferred from the evidence", inferential_reconstruction: "inferential reconstruction",
    causal_reconstruction: "causal reconstruction", psychological_reconstruction: "psychological reconstruction", counterfactual: "counterfactual",
    contested: "contested", undeterminable: "undeterminable", analytical_construct: "analytical construct" };
  const ACTS = [
    ["hostage", "I", "Hostage and student", "1387–1408"],
    ["courts", "II", "The princes", "1408–1422"],
    ["trials", "III", "The trials", "1422–1427"],
    ["exile", "IV", "Exile", "1427–1432"],
    ["copyist", "V", "The collection", "c. 1425–1435"],
    ["historian", "VI", "The historian's desk", "now"],
  ];
  const ACTNAME = Object.fromEntries(ACTS.map((a) => [a[0], `Act ${a[1]} · ${a[2]}`]));
  const AUTHORITY = { hostage: "The sources", courts: "The sources", trials: "The sources", exile: "The sources", copyist: "The manuscript", historian: "The sources" };
  const SOURCES_VERB = { stand: "bear it out", refute: "do not bear it out" };
  // pressure keys are game abstractions, never historical quantities; the board says so
  const PRESS = {
    exposure: ["Exposure", "how closely your name is tied to the charges of Sufi bias, Shiʿism and Ḥurūfī sympathy. It compounds and never resets."],
    livelihood: ["Livelihood", "whether you can keep a household fed (he had ten children in exile)."],
    students: ["Students", "how many pupils carry your teaching out of your reach."],
    works: ["Works in circulation", "how widely your writings are copied and sought."],
    enemies: ["Enemies", "people with a motive and a road to the ruler's ear."],
  };
  const LABELS = { documented: "documented", reconstructed: "reconstructed", contested: "contested", unknown: "unknown", counterfactual: "counterfactual" };

  // ---- how to play: full sentences, on purpose (TurkaGame ground rule)
  const HOW = `
    <h2>How to play</h2>
    <p><b>What this is.</b> You play Ṣāʾin al-Dīn ʿAlī ibn Turka Iṣfahānī (1369–1432), Chief Judge and the foremost lettrist philosopher of Timurid Iran, through the years of his life that the sources record. Then you play the unnamed copyist who assembled his collected works, and finally the modern historian who has to say who he was. Every fact on the screen comes from Matthew Melvin-Koushki's scholarship, and every choice tells you how much of it the sources actually support.</p>
    <p><b>The goal, and how you win or lose.</b> Nothing in this game can save Ibn Turka. Temür takes Isfahan, Iskandar rebels and is blinded, and a Ḥurūfī tries to kill Shāhrukh whatever you do; these are <i>fixed points</i>, listed at the top of each scene under "What the sources establish". What is yours is the margin: whom you attach yourself to, what you write, and how you defend it. You do not win or lose by surviving. You are scored on four bars, shown at the end. <b>Biography</b> is how close your decisions come to what the sources say he did. <b>Works</b> (the "textual" bar) is how close your writings, and later your arrangement of his collected works, come to the real manuscript. <b>Doctrine</b> is how close your rulings come to what his works argue. <b>Calibration</b> is whether you claimed only what the evidence supports; it can pull against biography on purpose, because being faithful to what he said to his judges and being faithful to what we can know are different things.</p>
    <p><b>Every control.</b> With the mouse, click any button once. With the keyboard, press the number shown on a choice (1, 2, 3…) to choose it, press Tab and Shift+Tab to move between buttons and Enter or Space to press the one that is highlighted, and press Enter on "Continue" to go on. In the collection puzzle, the ▲ and ▼ buttons beside a row move that row one place up or down; if a row's button has keyboard focus you can also press the Up and Down arrow keys to move that row. "Let it stand" and "Refute it" answer a ruling. "Start over" in the top bar clears everything and returns to the title; there is no saving, so a run is a single sitting.</p>
    <p><b>What the highlighted thing is, and where your next action will land.</b> This is a reading game, not a map: there is no cursor to steer and no camera to rotate, and the page simply scrolls. The thing you are acting on is always the one panel that has buttons in it. Nothing you press changes anything until you press the button that is labelled as final: "Send it" in a writing scene, "Use this order" in the collection puzzle, "Continue" after a choice.</p>
    <p><b>How to preview a move before committing it.</b> Each option carries a coloured label (documented, reconstructed, contested, unknown, counterfactual) that says how the sources stand on it. Under an option you will see what it <i>costs</i>: who gains or loses favour, and whether your exposure rises. Options that are closed to you are shown greyed out with the reason. "Why?" opens the chain of evidence behind an option down to the page of the book. In a writing scene, the text of your letter builds up on the page as you pick, and nothing is sent until you press "Send it". In the collection puzzle, the sentence under the list tells you what your order says about him before you commit.</p>
    <p><b>The court board.</b> Open "Court board" in the top bar at any time. It shows how much favour you have with each ruler and household you have dealt with, and the pressures on you (exposure, livelihood and so on). These are game abstractions to help you think, not historical quantities, and a court that is not listed is one you have not yet dealt with.</p>
    <p><b>Labels you will meet.</b> <i>Documented</i>: a source says it. <i>Reconstructed</i>: a scholar goes beyond the evidence, with reasons. <i>Contested</i>: scholars disagree. <i>Unknown</i>: the sources are silent and you are saying so. <i>Counterfactual</i>: the game's own what-if; no scholar proposes it and the record does not contain it. Wherever a scene asks you to write in Ibn Turka's voice to a ruler, remember that his own apologies were written to the men judging him, and that Melvin-Koushki calls them "produced under great duress".</p>`;

  function state() { return game.state; }
  let showHow = false, showBoard = false;
  let draft = {};      // composer draft, before "Send it"
  let orderDraft = null; // sorter draft

  // ------------------------------------------------------------------ evidence drawer
  function node(id, depth) {
    const a = game.artifact(id);
    if (!a || depth > 2) return "";
    let h = "";
    if (a.type === "claim") {
      const risk = (a.mediation || []).filter((m) => m.shaping_risk === "high");
      h = `<div class="t">claim · ${esc(EPI[a.epistemic_type] || a.epistemic_type)} · confidence ${esc(a.confidence)}</div>${esc(a.proposition)}
        ${risk.map((m) => `<div class="risk">⚠ ${esc(m.who)}${m.where ? " (" + esc(m.where) + ")" : ""} may have shaped this${m.note ? ": " + esc(m.note) : ""}</div>`).join("")}
        ${(a.supported_by || []).map((e) => node(e, depth + 1)).join("")}`;
    } else if (a.type === "reconstruction") {
      h = `<div class="t">reconstruction · ${esc(a.kind)} · ${esc(a.scholar)} · confidence ${esc(a.confidence)}</div>${esc(a.proposition)}
        <div class="cite">Reasoning: ${(a.reasoning || []).map(esc).join("; ")}</div>
        ${(a.observed_facts || []).map((e) => node(e, depth + 1)).join("")}
        ${(a.counterevidence || []).length ? `<div class="risk">Against it:</div>${a.counterevidence.map((e) => node(e, depth + 1)).join("")}` : ""}`;
    } else if (a.type === "evidence") {
      const c = a.citation;
      h = `<div class="t">evidence · ${esc((a.evidence_kind || "").replace(/_/g, " "))}${a.refers_to_primary ? " · on " + esc(a.refers_to_primary) : ""}</div>${esc(a.content)}
        <div class="cite">${esc(c.short_title)}${c.printed_page ? ", p. " + esc(c.printed_page) : ""}</div>`;
    } else if (a.type === "event") {
      h = `<div class="t">event · ${esc(a.date.start)}${a.date.end && a.date.end !== a.date.start ? "–" + esc(a.date.end) : ""}${a.date.hijri ? " (AH " + esc(a.date.hijri) + ")" : ""} · ${esc(a.date.date_kind || "")}</div>${esc(a.description)}`;
    } else if (a.type === "work") {
      h = `<div class="t">work · ${esc(a.language)} · ${esc(a.date_kind)}${a.date && a.date.ce ? " · " + esc(a.date.ce) : ""}</div><b>${esc(a.title)}</b>${a.addressee ? " — for " + esc(a.addressee) : ""}
        ${a.summary ? "<div class='cite'>" + esc(a.summary) + "</div>" : ""}${(a.supported_by || []).map((e) => node(e, depth + 1)).join("")}`;
    } else if (a.type === "hypothesis") {
      const who = (a.proponents || []).map((p) => esc(p.scholar) + (p.note ? ` (${esc(p.note)})` : "")).join("; ");
      h = `<div class="t">position ${esc(a.letter)} · ${esc(a.name)}</div>${esc(a.proposition)}
        <div class="cite">Held by: ${who || "<i>no modern scholar in this dossier</i>"}</div>
        ${a.no_proponent_note ? `<div class="risk">${esc(a.no_proponent_note)}</div>` : ""}
        ${(a.entails || []).length ? `<div class="cite">The price of holding it: ${a.entails.map(esc).join(" ")}</div>` : ""}`;
    }
    return `<div class="node">${h}</div>`;
  }
  const why = (ids, label) => (ids || []).length ? `<details class="why"><summary>${label || "Why? Show the evidence"}</summary>${ids.map((id) => node(id, 0)).join("")}</details>` : "";

  // ------------------------------------------------------------------ cost lines and requirements
  function name(key) {
    const ins = (window.CONTENT.institutions || {})["INS-" + key.toUpperCase().replace(/[^A-Z0-9]+/g, "-")];
    return ins ? ins.name : key.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }
  function costLine(effects) {
    const bits = [];
    for (const k of Object.keys(effects || {})) {
      const v = effects[k];
      if (k.startsWith("court.")) bits.push(`${v > 0 ? "gains" : "loses"} favour with ${esc(name(k.slice(6)))} (${v > 0 ? "+" : ""}${v})`);
      else if (k.startsWith("press.")) {
        const p = PRESS[k.slice(6)] || [k.slice(6)];
        bits.push(`${esc(p[0].toLowerCase())} ${v > 0 ? "rises" : "falls"} (${v > 0 ? "+" : ""}${v})`);
      }
    }
    return bits.length ? `<span class="cost">Costs and effects: ${bits.join("; ")}.</span>` : "";
  }
  function lockedWhy(c) {
    const out = [];
    for (const k of Object.keys(c.requires_min || {})) {
      const v = state()[k] || 0;
      if (v < c.requires_min[k]) out.push(k.startsWith("court.") ? `favour with ${esc(name(k.slice(6)))} of at least ${c.requires_min[k]} (you have ${v})` : `${esc((PRESS[k.slice(6)] || [k])[0].toLowerCase())} of at least ${c.requires_min[k]} (you have ${v})`);
    }
    for (const k of Object.keys(c.requires_max || {})) {
      const v = state()[k] || 0;
      if (v > c.requires_max[k]) out.push(`${esc((PRESS[k.slice(6)] || [k])[0].toLowerCase())} of at most ${c.requires_max[k]} (yours is ${v})`);
    }
    for (const k of Object.keys(c.requires || {})) {
      const want = c.requires[k], have = state()[k];
      const ok = Array.isArray(want) ? want.includes(have) : want === have;
      if (!ok) out.push(`an earlier decision (${esc(k.replace(/[._]/g, " "))}) you did not make`);
    }
    return out.join("; ");
  }

  // ------------------------------------------------------------------ chrome: how to play, board
  function chrome() {
    $("howwrap").innerHTML = showHow ? `<section id="how" class="panel">${HOW}<button class="go" id="how-close">Close</button></section>` : "";
    $("btn-how").setAttribute("aria-expanded", showHow);
    $("boardwrap").innerHTML = showBoard ? boardHtml() : "";
    $("btn-board").setAttribute("aria-expanded", showBoard);
    const c = $("how-close"); if (c) c.onclick = () => { showHow = false; chrome(); };
    const c2 = $("board-close"); if (c2) c2.onclick = () => { showBoard = false; chrome(); };
  }
  function boardTables() {
    const b = game.board();
    const rows = b.court.length ? b.court.map((r) => `<tr><td>${esc(name(r.key))}</td><td class="ct">${r.value > 0 ? "+" : ""}${r.value}</td><td class="nt"><i style="width:${Math.min(100, Math.abs(r.value) * 25)}%;${r.value < 0 ? "background:var(--strain)" : ""}"></i></td></tr>`).join("")
      : `<tr><td colspan="3" class="note">You have not yet dealt with any court.</td></tr>`;
    const press = b.press.length ? b.press.map((r) => { const p = PRESS[r.key] || [r.key, ""]; return `<tr><td title="${esc(p[1])}">${esc(p[0])}</td><td class="ct">${r.value > 0 ? "+" : ""}${r.value}</td><td class="note">${esc(p[1])}</td></tr>`; }).join("")
      : `<tr><td colspan="3" class="note">Nothing has moved yet.</td></tr>`;
    return `<table class="ledger"><tr><td class="caps" colspan="3" style="font-size:.7rem">Favour</td></tr>${rows}</table>
      <table class="ledger" style="margin-top:.6rem"><tr><td class="caps" colspan="3" style="font-size:.7rem">Pressures</td></tr>${press}</table>`;
  }
  function boardHtml() {
    return `<section id="board" class="panel"><h2>Court board</h2>
      <p class="note">Favour is what a ruler or household would do for you; pressures are what bear on you. Both are game abstractions, not historical quantities, and only what has moved is listed. Favour with a court opens options that are otherwise closed.</p>
      ${boardTables()}
      <button class="go" id="board-close">Close</button></section>`;
  }

  // ------------------------------------------------------------------ title
  function title() {
    $("bar").hidden = true;
    app.innerHTML = `
      <h1>Ibn Turka</h1>
      <p class="sub">Judge of Isfahan, lettrist, defendant · 1369–1432</p>
      <div class="leaf">
        <p>You will play Ṣāʾin al-Dīn ʿAlī ibn Turka through the years the sources record: a hostage-scholar at Temür's court, a student in Cairo, a judge under two princes, an author writing for the men who would try him. The external events are fixed. What you decide is whom to attach yourself to, what to write, and how to defend it.</p>
        <p>Then you will be the unnamed copyist who put his writings in order, and then the historian who must say who he was. Every choice carries a label saying how much the sources support it. Open <span class="caps" style="font-size:.8rem">Why?</span> on any choice to see the evidence, down to the page.</p>
        <p class="note">Scored on four bars: <b>biography</b>, <b>works</b>, <b>doctrine</b> and <b>calibration</b>. Read "How to play" first if you have not played before; it is written out in full.</p>
        <div class="center"><button class="go" id="begin">Begin</button> <button class="go alt" id="how-title">How to play</button></div>
      </div>`;
    $("begin").onclick = () => { $("bar").hidden = false; render(); };
    $("how-title").onclick = () => { $("bar").hidden = false; showHow = true; chrome(); render(); };
  }

  // ------------------------------------------------------------------ the act strip
  function strip(act) {
    return `<ol class="acts" aria-label="Acts">${ACTS.map((a) => `<li class="${a[0] === act ? "on" : ""}" title="${esc(a[2])} · ${esc(a[3])}"><span class="caps">${a[1]}</span></li>`).join("")}</ol>`;
  }

  // ------------------------------------------------------------------ the provenance ledger
  function ledger(s) {
    if (!s.show_dossier) return "";
    const st = game.standings(), v = game.verdict(), sx = state();
    const n = Object.keys(sx).filter((k) => k.startsWith("dossier.") && sx[k]).length;
    const lens = sx.lens || "all";
    if (!n) return `<div class="dossier"><div class="t caps">Dossier</div><p class="note">Empty. Nothing read yet.</p></div>`;
    const wide = Math.max(1, ...st.map((r) => Math.abs(r.net)));
    return `<div class="dossier">
      <div class="t caps">Dossier · ${n} reading${n === 1 ? "" : "s"} · lens: ${esc(lens === "all" ? "every scholar" : lens)}</div>
      <table class="ledger">${st.map((r) => `<tr class="${r.id === v.leader && !v.underdetermined ? "lead" : ""}">
        <td class="let">${esc(r.letter)}</td><td class="nm">${esc(r.name)}</td>
        <td class="ct">+${r.supports} / −${r.strains}</td>
        <td class="nt"><i style="width:${(Math.abs(r.net) / wide) * 100}%;${r.net < 0 ? "background:var(--strain)" : ""}"></i></td>
        <td class="nv">${r.net > 0 ? "+" : ""}${r.net}</td></tr>`).join("")}</table>
      <p class="note">${v.underdetermined
        ? "Nothing here separates the leaders (margin " + v.margin + "). On this dossier the accurate report is that the evidence does not fix it."
        : "Your dossier leans to " + esc((st[0] || {}).name || "") + " by " + v.margin + "."}
        A lean is a count of readings you happen to have collected, not a finding. Only what he wrote freely (letters, colophons, autograph, early writings, his works) can count toward what he <i>held</i>; his apologies were written to his judges.</p>
    </div>`;
  }

  function commitment(s) {
    if (!s.commitment) return "";
    const c = game.committed;
    if (!c) {
      return `<div class="rulings"><div class="t caps">${esc(s.commitment.question)}</div>
        <ul class="choices">${s.commitment.options.map((o) => `
          <li><button class="commit" data-h="${esc(o.hypothesis)}"><span>${esc(o.label)}</span></button></li>`).join("")}</ul></div>`;
    }
    const h = game.artifact(c.hypothesis) || {};
    const fb = s.commitment.feedback || {};
    return `<div class="rulings"><div class="t caps">${esc(s.commitment.question)}</div>
      <div class="ruling done ${c.tags.indexOf("coherent") >= 0 || c.tags.indexOf("calibrated_unknown") >= 0 ? "right" : "wrong"}">
        <p><b>${esc(h.letter || "")}. ${esc(h.name || c.hypothesis)}</b></p>
        ${c.tags.map((t) => `<p class="verdict">${esc(t.replace(/_/g, " "))}</p><p class="note">${esc(fb[t] || "")}</p>`).join("")}
        <details class="why"><summary>Why? Show the position and how it reads your dossier</summary>
          ${node(c.hypothesis, 0)}
          ${(h.bearings || []).filter((b) => state()["dossier." + b.evidence]).map((b) => `
            <div class="node"><div class="t">${esc(b.direction)} · ${esc(b.kind.replace(/_/g, " "))} · ${esc(b.attributed_to)}</div>
            ${esc(b.reading)}${node(b.evidence, 2)}</div>`).join("")}
        </details></div></div>`;
  }

  function rulings(s) {
    if (!(s.rulings || []).length) return "";
    const ans = game.answers;
    const done = (s.rulings || []).filter((r) => ans[r.id]).length;
    return `<div class="rulings"><div class="t caps">Let it stand, or refute it? (${done}/${s.rulings.length})</div>
      <p class="note">A ruling puts a proposition about his writings to you. Say whether the sources bear it out. You are answering for the sources, not for what you would like to be true.</p>
      ${s.rulings.map((r) => {
        const a = ans[r.id];
        if (!a) return `<div class="ruling"><p>${esc(r.proposition)}</p>
          <button class="rule" data-r="${esc(r.id)}" data-a="stand">Let it stand</button>
          <button class="rule" data-r="${esc(r.id)}" data-a="refute">Refute it</button></div>`;
        const right = a === r.answer;
        return `<div class="ruling done ${right ? "right" : "wrong"}"><p>${esc(r.proposition)}</p>
          <p class="verdict">You: ${a === "stand" ? "let it stand" : "refute it"}. ${esc(AUTHORITY[s.act] || "The sources")}: ${esc(SOURCES_VERB[r.answer])}. ${right ? "✓" : "✗"}</p>
          <p class="note">${esc(r.feedback)}</p>${why(r.based_on)}</div>`;
      }).join("")}</div>`;
  }

  // ------------------------------------------------------------------ the composer
  function composer(s) {
    const c = s.composer;
    if (!c) return "";
    const w = game.artifact(c.work) || {};
    if (game.composerDone()) {
      const picks = game.picks;
      return `<div class="rulings composer done"><div class="t caps">${esc(w.title || "The work")} — sent</div>
        ${c.slots.map((slot) => { const o = slot.options.find((x) => x.id === picks[slot.id]); return o ? `<div class="ruling done"><p class="note">${esc(slot.question)}</p><p><span class="chip ${esc(o.epistemic_label)}" style="margin:0 .4rem 0 0">${esc(o.epistemic_label)}</span>${esc(o.label)}</p><p class="note">${esc(o.feedback || "")}</p>${why(o.based_on)}</div>` : ""; }).join("")}</div>`;
    }
    const full = c.slots.every((slot) => draft[slot.id]);
    return `<div class="rulings composer"><div class="t caps">Write it: ${esc(w.title || "the work")}${w.addressee ? " · for " + esc(w.addressee) : ""}</div>
      <p class="note">${esc(c.prompt || "Choose one move for each part. Nothing is sent until you press “Send it”; the text of your work builds up below as you pick.")}</p>
      ${c.slots.map((slot) => `<fieldset class="slot"><legend>${esc(slot.question)}</legend>
        ${slot.options.map((o) => `<button class="opt ${draft[slot.id] === o.id ? "sel" : ""}" data-slot="${esc(slot.id)}" data-o="${esc(o.id)}" aria-pressed="${draft[slot.id] === o.id}">
          <span>${esc(o.label)}</span><span class="chip ${esc(o.epistemic_label)}">${esc(o.epistemic_label)}</span>${costLine(o.effects)}</button>`).join("")}
        </fieldset>`).join("")}
      <div class="preview"><div class="t caps">The text so far</div>${c.slots.map((slot) => { const o = slot.options.find((x) => x.id === draft[slot.id]); return `<p class="${o ? "" : "empty"}">${o ? esc(o.label) : "… (" + esc(slot.question) + ")"}</p>`; }).join("")}</div>
      <button class="go" id="send" ${full ? "" : "disabled"}>Send it</button>${full ? "" : `<span class="note"> Choose a move in every part first.</span>`}</div>`;
  }

  // ------------------------------------------------------------------ the sorter (the collection)
  function sorter(s) {
    const r = s.sorter;
    if (!r) return "";
    const items = r.items;
    if (game.sorterDone()) {
      const order = game.sortedOrder, d = game.state["sort." + s.id + ".distance"], pairs = game.state["sort." + s.id + ".pairs"];
      return `<div class="rulings"><div class="t caps">The collection, as you ordered it</div>
        <ol class="sorted">${order.map((id) => { const it = items.find((x) => x.id === id); return `<li>${esc(it.label)}</li>`; }).join("")}</ol>
        <p class="note">${d === 0 ? "This is the order the manuscript has." : `${d} of ${pairs} pairs of works stand in a different order in the manuscript.`}
        The real order is the answer key; it is also an argument about what the volume was for.</p>${why(r.based_on)}</div>`;
    }
    if (!orderDraft) orderDraft = items.map((i) => i.id);
    const it = (id) => items.find((x) => x.id === id);
    const first = it(orderDraft[0]), last = it(orderDraft[orderDraft.length - 1]);
    return `<div class="rulings"><div class="t caps">Put the works in order</div>
      <p class="note">${esc(r.prompt || "Arrange the works as the volume should have them.")} Each row has ▲ and ▼ buttons that move that row one place; with the keyboard, focus a row's button and press the Up or Down arrow. Nothing is scored until you press “Use this order”.</p>
      <ol class="sortlist">${orderDraft.map((id, i) => `<li data-id="${esc(id)}"><span class="pos">${i + 1}</span><span class="lbl">${esc(it(id).label)}${it(id).note ? `<small>${esc(it(id).note)}</small>` : ""}</span>
        <button class="mv" data-id="${esc(id)}" data-d="-1" aria-label="Move up" ${i === 0 ? "disabled" : ""}>▲</button>
        <button class="mv" data-id="${esc(id)}" data-d="1" aria-label="Move down" ${i === orderDraft.length - 1 ? "disabled" : ""}>▼</button></li>`).join("")}</ol>
      <p class="preview note">As you have it, the volume opens with <b>${esc(first.label)}</b> and closes with <b>${esc(last.label)}</b>.</p>
      <button class="go alt" id="resetorder">Reset order</button> <button class="go" id="useorder">Use this order</button></div>`;
  }

  // ------------------------------------------------------------------ the scene
  function render() {
    const s = game.scene;
    if (!s) return ending();
    chrome();
    const p = game.pending;
    const ready = game.ready();
    const all = s.choices;
    app.innerHTML = `
      ${strip(s.act)}
      <div class="leaf">
        <div class="act ${s.act}">${ACTNAME[s.act] || s.act}</div>
        <h2>${esc(s.title)}</h2>
        <p class="meta">${esc(s.situation.when)} · ${esc(s.situation.where)}</p>
        <div class="attested"><b>What the sources establish (fixed; you cannot change these)</b><ul>${s.invariants.map((i) => `<li>${esc(i.text)}</li>`).join("")}</ul></div>
        ${s.prose.map((x) => `<p>${esc(x)}</p>`).join("")}
        ${ledger(s)}
        <p class="question">${esc(s.dramatic_question)}</p>
        ${rulings(s)}
        ${game.rulingsDone() ? commitment(s) : ""}
        ${game.rulingsDone() && game.commitmentDone() ? composer(s) : ""}
        ${game.rulingsDone() && game.commitmentDone() && game.composerDone() ? sorter(s) : ""}
        ${!ready ? "" : p ? chosen(s, p) : `<ul class="choices">${all.map((c, i) => {
          const ok = E.available(c, state());
          return `<li><button class="choice ${ok ? "" : "locked"}" data-id="${esc(c.id)}" ${ok ? "" : "disabled"}><span class="key">${i + 1}</span>
            <span class="body"><span>${esc(c.label)}</span>${ok ? costLine(c.effects) + (c.costs || []).map((t) => `<span class="cost">${esc(t)}</span>`).join("") : `<span class="cost lock">Closed to you: needs ${lockedWhy(c)}.</span>`}</span>
            <span class="chip ${esc(c.epistemic_label)}">${esc(c.epistemic_label)}</span></button></li>`; }).join("")}</ul>`}
      </div>`;
    bind();
  }

  function chosen(s, c) {
    const hist = s.choices.find((x) => x.historical);
    let record = "";
    if (hist) {
      record = c.historical
        ? `<p class="record">The record: this is what the sources say he did.</p>`
        : `<p class="record">The record: this is not what he did. The sources say he chose: <i>${esc(hist.label)}</i></p>`;
    } else if (s.unrecorded && s.act !== "historian") {
      record = `<p class="record">The record is silent on what he chose here. Whatever you did, you have gone beyond the evidence.</p>`;
    }
    return `<div class="feedback">
      <p><span class="chip ${esc(c.epistemic_label)}" style="margin:0 .4rem 0 0">${esc(c.epistemic_label)}</span><i>${esc(c.label)}</i></p>
      <p>${esc(c.feedback || "")}</p>${record}
      ${why(c.based_on)}
      <button class="go" id="continue">Continue</button></div>`;
  }

  function bind() {
    app.querySelectorAll(".choice:not([disabled])").forEach((b) => (b.onclick = () => { game.choose(b.dataset.id); render(); }));
    app.querySelectorAll(".rule").forEach((b) => (b.onclick = () => { game.rule(b.dataset.r, b.dataset.a); render(); }));
    app.querySelectorAll(".commit").forEach((b) => (b.onclick = () => { game.commit(b.dataset.h); render(); }));
    app.querySelectorAll(".opt").forEach((b) => (b.onclick = () => { draft[b.dataset.slot] = b.dataset.o; render(); }));
    const send = $("send");
    if (send) send.onclick = () => { for (const slot of game.scene.composer.slots) game.pick(slot.id, draft[slot.id]); draft = {}; render(); };
    app.querySelectorAll(".mv").forEach((b) => {
      b.onclick = () => move(b.dataset.id, Number(b.dataset.d), true);
      b.onkeydown = (e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); move(b.dataset.id, e.key === "ArrowUp" ? -1 : 1, true); } };
    });
    const ro = $("resetorder"); if (ro) ro.onclick = () => { orderDraft = null; render(); };
    const uo = $("useorder"); if (uo) uo.onclick = () => { game.sort(orderDraft); orderDraft = null; render(); };
    const go = $("continue");
    if (go) { go.onclick = () => { game.advance(); draft = {}; orderDraft = null; render(); window.scrollTo(0, 0); }; go.focus(); }
  }
  function move(id, d, refocus) {
    const i = orderDraft.indexOf(id), j = i + d;
    if (j < 0 || j >= orderDraft.length) return;
    orderDraft.splice(j, 0, orderDraft.splice(i, 1)[0]);
    render();
    if (refocus) { const btn = app.querySelector(`.mv[data-id="${id}"][data-d="${d}"]`) || app.querySelector(`.mv[data-id="${id}"]:not([disabled])`); if (btn) btn.focus(); }
  }

  document.addEventListener("keydown", (e) => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[1-9]$/.test(e.key)) {
      const b = app.querySelectorAll(".choice:not([disabled])");
      const all = Array.from(app.querySelectorAll(".choice"));
      const t = all[Number(e.key) - 1];
      if (t && !t.disabled) t.click();
    }
  });

  // ------------------------------------------------------------------ the ending
  function endingHtml() {
    const st = game.state;
    const bar = (v, max) => { const w = max ? Math.min(50, Math.abs(v) / max * 50) : Math.min(50, Math.abs(v) * 6); return `<div class="bar"><span class="zero"></span><i style="${v >= 0 ? "left:50%" : "right:50%"};width:${w}%"></i></div>`; };
    const NAMES = { doctrine: "Doctrine", biography: "Biography", textual: "Works", calibration: "Calibration" };
    const aff = game.affinities();
    const trail = game.trail.map((t) => { const sc = window.CONTENT.scenes[t.scene]; const c = sc.choices.find((x) => x.id === t.choice); return { sc, c }; });
    const hist = trail.filter((t) => t.sc.choices.some((x) => x.historical));
    const matched = hist.filter((t) => t.c.historical).length;
    const h = st["who.commit"] ? game.artifact(st["who.commit"]) : null;
    const tags = String(st["who.verdict"] || "").split(",").filter(Boolean);
    const rows = game.standings().filter((r) => r.supports || r.strains);
    const sortKeys = Object.keys(st).filter((k) => k.startsWith("sort.") && k.endsWith(".distance"));
    return `
      <div class="leaf">
        <div class="act historian">The end</div>
        <h2>The life you lived beside the record</h2>
        <div class="axes">${game.scores().map(([a, v]) => `<div class="axis"><span class="caps" style="font-size:.8rem">${NAMES[a]}</span>${bar(v, 0)}<span>${v > 0 ? "+" : ""}${v}</span></div>`).join("")}</div>
        <p>${hist.length ? `Of the ${hist.length} decisions where the sources record what he actually did, you matched <b>${matched}</b>.` : ""} Where the record is silent, no bar can measure you; calibration only asks whether you said so.</p>
        <p class="note">Nothing you did could change the fixed points: the fall of Isfahan, the death of Iskandar's ambitions, the attempt on Shāhrukh's life, the death in Herat. You changed only what you attached yourself to, what you wrote and how you defended it.</p>
        <details class="why" open><summary>The board at the end</summary>${boardTables()}</details>
        ${sortKeys.map((k) => `<p>Your arrangement of his collected works stood ${st[k]} of ${st[k.replace("distance", "pairs")]} pairs away from the manuscript's.</p>`).join("")}
        ${h ? `<h2 style="font-size:1.1rem;margin-top:1.4rem">Who was he?</h2>
          <p>At the desk you committed in print to <b>${esc(h.letter)}. ${esc(h.name)}</b>, reading with ${esc(st.lens && st.lens !== "all" ? st.lens + "'s" : "no single scholar's")} eyes, on a dossier of ${Object.keys(st).filter((k) => k.startsWith("dossier.") && st[k]).length} readings.</p>
          <p class="note">Verdict on your own consistency, not on the history: ${esc(tags.join(", ").replace(/_/g, " ") || "none")}. The game does not know who he was. Melvin-Koushki calls him an occult philosopher and an imamophile; others read him as a Shiʿi esotericist, an orthodox Sunni Sufi, or a mystical philosopher; the men who tried him thought him a Ḥurūfī sympathiser. Each of those is somebody's reading, and each leans on a different kind of witness.</p>
          ${rows.length ? `<div class="node"><div class="t">your ledger at the end</div>${rows.map((r) => `${esc(r.letter)} ${esc(r.name)}: +${r.supports} / −${r.strains}`).join("<br>")}</div>` : ""}` : ""}
        <h2 style="font-size:1.1rem;margin-top:1.4rem">Whose Ibn Turka did you play?</h2>
        ${aff.length ? aff.map((x, i) => `<div class="node"><div class="t">${i === 0 ? "closest" : "also"} · ${x.hits} of your choices</div><b>${esc(x.model.title)}</b> (${esc(x.model.scholar)}): ${esc(x.model.summary)}</div>`).join("") : `<p>None of the scholars' whole-life models. You stayed with the attested record throughout.</p>`}
        <p class="note">Everything here rests on Matthew Melvin-Koushki's scholarship (chiefly his 2012 Yale dissertation). No Timurid chronicle, no manuscript of his works, and no Persian edition of his apologies was read: the chroniclers, Jāmī and Ibn Ḥajar reach you only as he translates or reports them. Where he writes "presumably" or "(?)", so does this game.</p>
        <details class="why"><summary>Your path</summary><p class="note">${game.trail.map((t) => `${t.scene}·${t.choice}`).join(" → ")}</p></details>
        <div class="center"><button class="go" id="again">Play again</button></div>
      </div>`;
  }
  function ending() { chrome(); app.innerHTML = strip("historian") + endingHtml(); $("again").onclick = () => { game.reset(); draft = {}; orderDraft = null; render(); window.scrollTo(0, 0); }; }

  window.__game.render = render; // test handle: re-render after driving the engine directly
  $("btn-how").onclick = () => { showHow = !showHow; chrome(); };
  $("btn-board").onclick = () => { showBoard = !showBoard; chrome(); };
  $("btn-restart").onclick = () => { game.reset(); draft = {}; orderDraft = null; showHow = false; showBoard = false; chrome(); title(); };
  title();
})();
