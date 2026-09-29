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

  const clean = (s) => String(s).replace(/\s*\((?:CL|EV|REC|EVT|WRK)-\d+\)/g, "").replace(/\((?:CL|EV|REC|EVT|WRK)-\d+,\s*/g, "(").replace(/\b(?:CL|EV|REC|EVT|WRK)-\d{2,4}\b/g, "").replace(/\bMK\b/g, "Melvin-Koushki");
  const esc = (s) => clean(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
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
    exposure: ["Exposure", "how closely your name is tied to the charges of Sufi bias, Shiʿism and Ḥurūfī sympathy. It only goes up."],
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
    <p><b>Every control.</b> With the mouse, click any button once. With the keyboard, press the number shown on a choice (1, 2, 3…) to choose it, press Tab and Shift+Tab to move between buttons and Enter or Space to press the one that is highlighted, and press Enter on "Continue" to go on. In the collection puzzle, the ▲ and ▼ buttons beside a row move that row one place up or down, and ⤒ and ⤓ send it to the top or the bottom; if a row's button has keyboard focus you can also press the Up and Down arrow keys to move that row (the focus stays on it, so you can keep pressing). "Let it stand" and "Refute it" answer a ruling. "Start over" in the top bar, after you confirm, erases your saved run and returns to the title. Your run saves itself in this browser after every step, so you can close the tab and press "Continue" on the title screen later. Esc closes the court board and this panel.</p>
    <p><b>What the highlighted thing is, and where your next action will land.</b> This is a reading game, not a map: there is no cursor to steer and no camera to rotate, and the page simply scrolls. The thing you are acting on is always the one panel that has buttons in it. Nothing you press changes anything until you press the button that is labelled as final: "Send it" in a writing scene, "Use this order" in the collection puzzle, "Continue" after a choice.</p>
    <p><b>How to preview a move before committing it.</b> Each option carries a coloured label (documented, reconstructed, contested, unknown, counterfactual) that says how the sources stand on it. Under an option you will see what it <i>costs</i>: who gains or loses favour, and whether your exposure rises. Options that are closed to you are shown greyed out with the reason. "Why?" opens the chain of evidence behind an option down to the page of the book. In a writing scene, your choices so far are listed under the options and the costs of all your picks add up beside the Send button; nothing is sent until you press "Send it", and after sending, the game tells you what the source records for each move. In the collection puzzle, as you move rows the note above the list keeps showing which work your current order opens and closes with; nothing is scored until you press "Use this order", and afterwards the game shows your order beside the manuscript's.</p>
    <p><b>The court board.</b> Open "Court board" in the top bar at any time. It shows how much favour you have with each ruler and household you have dealt with, and the pressures on you (exposure, livelihood and so on). These are game abstractions to help you think, not historical quantities, and a court that is not listed is one you have not yet dealt with.</p>
    <p><b>Labels you will meet.</b> <i>Documented</i>: a source says it. <i>Reconstructed</i>: a scholar goes beyond the evidence, with reasons. <i>Contested</i>: scholars disagree. <i>Unknown</i>: the sources are silent and you are saying so. <i>Counterfactual</i>: the game's own what-if; no scholar proposes it and the record does not contain it. Wherever a scene asks you to write in Ibn Turka's voice to a ruler, remember that his own apologies were written to the men judging him, and that Melvin-Koushki calls them "produced under great duress".</p>`;


  // ------------------------------------------------------------------ a small glossary: the first use of a term on a screen is underlined
  const GLOSS = [
    ["ʿilm al-ḥurūf", "the science of letters: the belief that the letters of the Arabic alphabet, and their numbers, carry the structure of the world"],
    ["lettrism", "the science of letters: the belief that the letters of the Arabic alphabet, and their numbers, carry the structure of the world"],
    ["lettrist", "a practitioner or theorist of the science of letters (lettrism)"],
    ["taksīr", "‘breaking’: writing a letter's name out in full to release the letters hidden inside it"],
    ["jafr", "divination by letters and their numerical values"],
    ["raml", "geomancy: divination from patterns of dots"],
    ["majlis", "a court gathering where scholars debate before the ruler"],
    ["majlises", "court gatherings where scholars debate before the ruler"],
    ["qadi", "a judge in Islamic law"],
    ["qadis", "judges in Islamic law"],
    ["hadith", "a report of what the Prophet said or did"],
    ["mahdi", "the rightly guided redeemer expected at the end of time"],
    ["colophon", "a scribe's note at the end of a manuscript giving the date, place and copyist"],
    ["colophons", "scribes' notes at the end of manuscripts giving date, place and copyist"],
    ["imamophile", "one devoted to ʿAlī and the Imams in a way shared across the Sunni–Shiʿi divide"],
    ["imamophilism", "devotion to ʿAlī and the Imams shared across the Sunni–Shiʿi divide"],
    ["Ḥurūfī", "of the Ḥurūfiyya, a movement that found the world's secrets in the letters and expected a new age"],
    ["Ḥurūfīs", "followers of the Ḥurūfiyya, a movement that found the world's secrets in the letters and expected a new age"],
    ["ṣūfīgarī", "‘Sufi bias’: a charge of sympathy with Sufi mysticism, which in that reign hinted at dangerous movements"],
    ["Sharīʿa", "Islamic law"],
    ["abjad", "the system that gives each Arabic letter a number"],
    ["tafsir", "commentary on the Quran"],
    ["fiqh", "Islamic jurisprudence"],
    ["amir", "a military commander or governor"],
    ["sayyid", "a descendant of the Prophet"],
    ["ijāza", "a teacher's certificate authorising a student to pass a text on"],
    ["Muʿtazilī", "of a rationalist school of theology"],
    ["Ashʿarī", "of the dominant Sunni school of theology"],
    ["Yasa", "the Mongol legal code"],
  ];
  const GLOSS_RE = GLOSS.map(([t, g]) => [new RegExp("(?<![\\p{L}\\p{M}])" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\p{L}\\p{M}])", "iu"), g]);
  let glossSeen = new Set();
  // takes PLAIN text, returns safe HTML with the first use of each term wrapped; never run on HTML
  function G(text) {
    let h = esc(text);
    for (const [re, g] of GLOSS_RE) {
      const m = re.exec(h);
      if (!m) continue;
      const key = g;
      if (glossSeen.has(key)) continue;
      glossSeen.add(key);
      h = h.slice(0, m.index) + `<abbr class="g" tabindex="0" data-g="${esc(g)}">${m[0]}</abbr>` + h.slice(m.index + m[0].length);
    }
    return h;
  }

  function state() { return game.state; }
  let showHow = false, showBoard = false;
  let draft = {};      // composer draft, before "Send it"
  let actsShown = new Set();
  const SAVE_KEY = "turkavita.save.v1";
  const TOTAL = Object.keys(window.CONTENT.scenes).length;
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
  // the total court and pressure effects of several effect sets, in words
  function sumCost(list) {
    const tot = {};
    for (const e of list) for (const k of Object.keys(e || {})) if (k.startsWith("court.") || k.startsWith("press.")) tot[k] = (tot[k] || 0) + e[k];
    const c = costLine(tot).replace(/^<span class="cost">Costs and effects: /, "").replace(/\.<\/span>$/, "");
    return c ? esc(c) + "." : "no change to favour or pressure.";
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
  let confirmMsg = null, confirmYes = null, confirmGame = null;
  function panelOpen() { return showHow || showBoard || confirmMsg !== null; }
  function chrome() {
    $("howwrap").innerHTML = showHow ? `<section id="how" class="panel overlay" role="dialog" aria-label="How to play">${HOW}<button class="go" id="how-close">Close</button></section>` : "";
    $("btn-how").setAttribute("aria-expanded", showHow);
    $("boardwrap").innerHTML = showBoard ? boardHtml() : "";
    $("btn-board").setAttribute("aria-expanded", showBoard);
    let cw = $("confirmwrap");
    if (!cw) { cw = document.createElement("div"); cw.id = "confirmwrap"; document.body.insertBefore(cw, $("app")); }
    cw.innerHTML = confirmMsg !== null ? `<section id="confirm" class="panel overlay" role="alertdialog" aria-label="Erase this run?"><h2>Erase this run?</h2><p>${esc(confirmMsg)}</p>
      <div class="center"><button class="go alt" id="confirm-keep">Keep playing</button> <button class="go alt" id="confirm-dl">Download your record first</button> <button class="go" id="confirm-yes">Erase it</button></div></section>` : "";
    const c = $("how-close"); if (c) c.onclick = () => { showHow = false; chrome(); };
    const c2 = $("board-close"); if (c2) c2.onclick = () => { showBoard = false; chrome(); };
    if ($("confirm-keep")) { $("confirm-keep").onclick = () => { confirmMsg = null; confirmYes = null; chrome(); }; $("confirm-dl").onclick = () => downloadRecord(confirmGame); $("confirm-yes").onclick = () => { const f = confirmYes; confirmMsg = null; confirmYes = null; chrome(); if (f) f(); }; $("confirm-keep").focus(); }
    else if (showBoard && $("board-close") && !chrome.boardFocused) { chrome.boardFocused = true; $("board-close").focus(); }
    else if (showHow && $("how-close") && !chrome.howFocused) { chrome.howFocused = true; $("how-close").focus(); }
    if (!showBoard) chrome.boardFocused = false;
    if (!showHow) chrome.howFocused = false;
  }
  // erase-with-confirmation: nothing to lose means no dialog
  function confirmErase(then) {
    // on the title screen the live game is empty, but a saved run may exist: that is what would be erased
    const live = game.trail.length > 0 || !!game.pending;
    const sv = live ? null : loadSave();
    if (!live && !sv) { then(); return; }
    let g = game;
    if (sv) { g = E.createGame(window.CONTENT); g.restore(sv.snap); }
    const sc = g.scene;
    confirmMsg = `This erases your run${sc ? ` at ${ACTNAME[sc.act] || "the game"}, scene ${Math.min(TOTAL, g.trail.length + 1)} of ${TOTAL}` : ", which is finished"}. It cannot be undone. You can download your record first.`;
    confirmYes = then; confirmGame = g;
    chrome();
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
    return `<section id="board" class="panel overlay" role="dialog" aria-label="Court board"><h2>Court board</h2>
      <p class="note">Favour is what a ruler or household would do for you; pressures are what bear on you. Both are game abstractions, not historical quantities, and only what has moved is listed. Favour with a court opens options that are otherwise closed.</p>
      ${boardTables()}
      <button class="go" id="board-close">Close</button></section>`;
  }

  // ------------------------------------------------------------------ title

  // ------------------------------------------------------------------ save and resume (localStorage, all guarded)
  function contentHash() {
    const t = JSON.stringify(Object.keys(window.CONTENT.scenes).map((k) => [k, window.CONTENT.scenes[k].choices.length]));
    let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
    return h + ":" + Object.keys(window.CONTENT.artifacts).length;
  }
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ hash: contentHash(), snap: game.snapshot(), actsShown: Array.from(actsShown), t: Date.now() })); } catch (e) { /* private window: play on without a save */ }
  }
  function loadSave() {
    try { const r = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); if (r && r.hash === contentHash() && r.snap && r.snap.trail && r.snap.trail.length) return r; } catch (e) { /* ignore */ }
    return null;
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }

  // ------------------------------------------------------------------ plates: period paintings, manuscript pages and printed sources only
  const PL = () => window.PLATES || { plates: {}, byAct: {}, byScene: {} };
  // cache each plate as a blob URL after its first load, so a ruling/pick/sort re-render never re-fetches
  // it: the dev server sends no cache headers, and the image would otherwise reload on every click.
  const plateSrc = new Map();
  function warmPlateCache(root) {
    (root || document).querySelectorAll("figure.plate img[data-src]").forEach((im) => {
      const file = im.dataset.src;
      if (plateSrc.has(file)) { im.src = plateSrc.get(file); return; }
      fetch(file).then((r) => r.blob()).then((b) => {
        const url = URL.createObjectURL(b);
        plateSrc.set(file, url);
        if (im.isConnected && im.dataset.src === file) im.src = url;
      }).catch(() => { /* keep the plain src; a slower load beats a broken one */ });
    });
  }

  function figureHtml(p, generic) {
    if (!p) return "";
    const credit = /^CC-BY/.test(p.license || "") && p.credit ? " " + esc(p.credit) : "";
    const src = plateSrc.get(p.file) || p.file;
    return `<figure class="plate"><img src="${esc(src)}" data-src="${esc(p.file)}" alt="${esc(p.alt || p.title)}" loading="eager" decoding="async">
      <figcaption><b>${generic ? "Illustrative plate." : "Illustrative plate, not a depiction of this event."}</b> ${esc(p.title)}. ${esc(p.relevance || "")}${credit}
      <details class="prov"><summary>Provenance</summary>${p.creator ? esc(p.creator) + ", " : ""}${esc(p.date || "")}; ${esc(p.institution || "")}${p.shelfmark ? " (" + esc(p.shelfmark) + ")" : ""}. ${esc(p.rights || "")}
      <a href="${esc(p.source_url || "#")}" target="_blank" rel="noopener">source</a> · <span class="lic">${esc(p.license || "")}</span></details></figcaption></figure>`;
  }
  const plateForScene = (id) => { const pid = PL().byScene[id]; return pid ? PL().plates[pid] : null; };
  const plateForAct = (act) => { const ids = PL().byAct[act] || []; return ids[0] ? PL().plates[ids[0]] : null; };
  const sceneFigure = (s) => figureHtml(plateForScene(s.id));

  // ------------------------------------------------------------------ act title cards
  // Each intro says only what every scene of the act already establishes or what the game itself is doing; no new facts.
  const ACT_INTRO = {
    hostage: "Isfahan has fallen and most of its people have been killed, but your family has been spared and taken east to the conqueror's court. The sources say little about what a teenager did with those years, and where they are silent the game says so. Later you will spend about fifteen years abroad, two of the men you meet will shape everything, and one of them will die while you are still there.",
    courts: "You are home and want a quiet life, but two princes will summon you to their courts and both will be destroyed. What you write for them, and whom you attach yourself to, will be used against you a decade later.",
    trials: "You are a judge, an author and a defendant. Rivals will carry charges to the ruler at Herat, and you will answer in writing. Those texts are the main source we have for your life, and they were written to the man judging you: keep that in mind, as the How to play panel says.",
    exile: "The post, the property and the standing are gone. What is left is letters, a family to feed, the hope of a hearing, and the works you can still write for whoever will read them.",
    copyist: "You are no longer Ibn Turka. You are the person who copied his works into one volume over about eleven years, and the sources do not give your name. The volume you make is an argument about what his work was for.",
    historian: "The life is over. What is left is evidence, and every piece of it is somebody's account. You will read it in three piles, borrow a scholar's eyes, and say who he was, or say what the record cannot tell you.",
  };
  const DEAD = { courts: ["temur", "barquq", "akhlati"], trials: ["temur", "barquq", "akhlati", "pir-muhammad", "iskandar"], exile: ["temur", "barquq", "akhlati", "pir-muhammad", "iskandar"] };
  function boardBrief(act) {
    if (act === "copyist" || act === "historian" || act === "hostage") return "";
    const b = game.board(), gone = new Set(DEAD[act] || []);
    const top = b.court.filter((r) => r.value > 0 && !gone.has(r.key)).sort((x, y) => y.value - x.value).slice(0, 4);
    const ex = b.press.find((r) => r.key === "exposure");
    if (!top.length && !ex) return "";
    return `<p class="note"><b>Where you stand.</b> ${top.length ? "Most favour with " + top.map((r) => esc(name(r.key).replace(/^The /, "the "))).join(", ") + "." : ""}${ex ? " Exposure: " + ex.value + "." : ""} (Open the court board any time from the top bar.)</p>`;
  }
  function actCard(s) {
    const a = ACTS.find((x) => x[0] === s.act);
    const n = game.trail.length + 1;
    app.innerHTML = `${strip(s.act)}<div class="leaf actcard"><div class="act ${s.act}">Act ${a[1]}</div><h2>${esc(a[2])}</h2>
      <p class="meta">${esc(a[3])} · act ${a[1]} of VI</p>${figureHtml(plateForAct(s.act))}
      <p>${esc(ACT_INTRO[s.act] || "")}</p>${boardBrief(s.act)}
      <div class="center"><button class="go" id="beginact">Begin this act</button></div></div>`;
    const b = $("beginact");
    b.onclick = () => { actsShown.add(s.act); save(); render(); window.scrollTo(0, 0); };
    b.focus();
    warmPlateCache(app);
  }
  function hint() {
    if (game.trail.length || game.pending) return "";
    return `<div class="hintbox"><b>How a scene works.</b> The box below lists what the sources establish and you cannot change. Then you decide: click an option, or press its number. After you choose you see what the sources say happened and why, and press Continue. “How to play” in the top bar explains everything in full.</div>`;
  }

  // ------------------------------------------------------------------ export of the run
  function recordText(g) {
    g = g || game;
    const st = g.state, lines = [];
    lines.push("Ibn Turka — your life beside the record (Turka Vita)", "");
    lines.push("Scores: " + g.scores().map(([a, v]) => a + " " + (v > 0 ? "+" : "") + v).join(", "), "");
    g.trail.forEach((t, i) => {
      const sc = window.CONTENT.scenes[t.scene], c = sc.choices.find((x) => x.id === t.choice);
      const hist = sc.choices.find((x) => x.historical);
      let rec = "";
      if (sc.act !== "historian") rec = hist ? (c.historical ? "the record: this is what the sources say he did" : "the record: he chose otherwise: " + hist.label) : "the record is silent here";
      lines.push(`${i + 1}. ${sc.title}`, `   You: ${c.label}`, `   [${c.epistemic_label}]${rec ? " · " + rec : ""}`);
    });
    if (st["who.commit"]) lines.push("", "Who was he? You committed to " + (g.artifact(st["who.commit"]) || {}).name + " (" + String(st["who.verdict"] || "").replace(/_/g, " ") + ").");
    lines.push("", "Everything here rests on Matthew Melvin-Koushki's scholarship. https://t3dy.github.io/TurkaGame/TurkaVita/game/");
    return lines.join("\n");
  }
  function copyRecord() {
    const t = recordText();
    const done = () => { const b = $("copyrec"); if (b) b.textContent = "Copied"; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => window.prompt("Copy your record:", t));
    else window.prompt("Copy your record:", t);
  }
  function downloadRecord(g) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([recordText(g && g.trail ? g : undefined)], { type: "text/plain;charset=utf-8" }));
    a.download = "turka-vita-record.txt"; document.body.appendChild(a); a.click(); a.remove();
  }

  function title() {
    $("bar").hidden = true;
    const sv = loadSave();
    const cont = sv ? (() => { const sc = window.CONTENT.scenes[sv.snap.sceneId]; return sc ? `Continue: ${esc(ACTNAME[sc.act] || "")}, scene ${sv.snap.trail.length + 1} of ${TOTAL} (${esc(sc.title)})` : `See your ending (${TOTAL} scenes played)`; })() : "";
    app.innerHTML = `
      <h1>Ibn Turka</h1>
      <p class="sub">Judge of Isfahan, lettrist, defendant · 1369–1432</p>
      <div class="leaf">
        ${figureHtml(PL().plates["herat-baysunghur-royal-court"], true)}
        <p>You will play Ṣāʾin al-Dīn ʿAlī ibn Turka through the years the sources record: a hostage-scholar at Temür's court, a student in Cairo, a judge under two princes, an author writing for the men who would try him. The external events are fixed. What you decide is whom to attach yourself to, what to write, and how to defend it.</p>
        <p>Then you will be the unnamed copyist who put his writings in order, and then the historian who must say who he was. Every choice carries a label saying how much the sources support it. Open <span class="caps" style="font-size:.8rem">Why?</span> on any choice to see the evidence, down to the page.</p>
        <p class="note">Scored on four bars: <b>biography</b>, <b>works</b>, <b>doctrine</b> and <b>calibration</b>. A run takes one long sitting, and it saves itself in this browser after every step. Read "How to play" first if you have not played before; it is written out in full.</p>
        <div class="center">${sv ? `<button class="go" id="resume">${cont}</button> <button class="go alt" id="begin">Begin anew</button>` : `<button class="go" id="begin">Begin</button>`} <button class="go alt" id="how-title">How to play</button></div>
      </div>`;
    warmPlateCache(app);
    if (sv) $("resume").onclick = () => { game.restore(sv.snap); actsShown = new Set(sv.actsShown || []); $("bar").hidden = false; render(); window.scrollTo(0, 0); const t = app.querySelector(".rule, .commit, .opt, .choice:not([disabled]), #send, #useorder, #continue"); if (t) t.scrollIntoView({ block: "center" }); };
    $("begin").onclick = () => confirmErase(() => { clearSave(); game.reset(); actsShown = new Set(); draft = {}; orderDraft = null; $("bar").hidden = false; render(); });
    $("how-title").onclick = () => { showHow = true; chrome(); };
  }

  // ------------------------------------------------------------------ the act strip
  function strip(act) {
    const n = Math.min(TOTAL, game.trail.length + (game.pending ? 0 : 1));
    return `<ol class="acts" aria-label="Acts">${ACTS.map((a) => `<li class="${a[0] === act ? "on" : ""}" title="${esc(a[2])} · ${esc(a[3])}"><span class="caps">${a[1]}</span></li>`).join("")}</ol>
      <p class="prog" aria-label="Progress">Scene ${n} of ${TOTAL}</p>`;
  }

  // ------------------------------------------------------------------ the provenance ledger
  function ledger(s) {
    if (!s.show_dossier) return "";
    const st = game.standings().slice().sort((a, b) => (a.letter < b.letter ? -1 : 1)), v = game.verdict(), sx = state();
    const n = Object.keys(sx).filter((k) => k.startsWith("dossier.") && sx[k]).length;
    const lens = sx.lens || "all";
    if (!n) return `<div class="dossier"><div class="t caps">Dossier</div><p class="note">Empty. As you read witnesses you collect <i>readings</i>: each is one short verdict that argues for, or against, one of six candidate answers to “who was he?” (A to F). The table below will count the readings for and against each answer, and their net.</p></div>`;
    const wide = Math.max(1, ...st.map((r) => Math.abs(r.net)));
    return `<div class="dossier">
      <div class="t caps">Dossier · ${n} reading${n === 1 ? "" : "s"} · lens: ${esc(lens === "all" ? "every scholar" : lens)}</div>
      <table class="ledger"><tr class="hd"><td></td><td class="note">candidate answer</td><td class="ct note">readings for / against</td><td></td><td class="nv note">net</td></tr>${st.map((r) => `<tr class="${r.id === v.leader && !v.underdetermined ? "lead" : ""}">
        <td class="let">${esc(r.letter)}</td><td class="nm">${esc(r.name)}</td>
        <td class="ct">+${r.supports} / −${r.strains}</td>
        <td class="nt"><i style="width:${(Math.abs(r.net) / wide) * 100}%;${r.net < 0 ? "background:var(--strain)" : ""}"></i></td>
        <td class="nv">${r.net > 0 ? "+" : ""}${r.net}</td></tr>`).join("")}</table>
      <p class="note">The gap between the top two answers is ${v.margin}${v.margin < 2 ? ", and a gap under 2 does not count as a lead (that is the game's rule)" : ""}. ${lens === "all" ? "" : "Under a lens, only that scholar's readings count: the lens changes whose readings are counted, not the evidence. "}A lean is a count of readings you happen to have collected, not a finding. Only what he wrote freely (letters, colophons, autograph, early writings, his works) can count toward what he <i>held</i>; his apologies were written to his judges.</p>
    </div>`;
  }

  function commitment(s) {
    if (!s.commitment) return "";
    const c = game.committed;
    if (!c) {
      return `<div class="rulings"><div class="t caps">${esc(s.commitment.question)}</div>
        <ul class="choices">${s.commitment.options.map((o) => `
          <li><button class="commit" data-h="${esc(o.hypothesis)}"><span>${esc(o.label)}</span></button>
            <details class="why"><summary>Who holds this, and what it commits you to</summary>${node(o.hypothesis, 0)}</details></li>`).join("")}</ul></div>`;
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
    return `<div class="rulings"><div class="t caps">Before you decide: ${s.rulings.length} true-or-false check${s.rulings.length === 1 ? "" : "s"} (answered ${done} of ${s.rulings.length})</div>
      <p class="note">Each puts one statement about what he wrote to you. Say whether the sources bear it out. A wrong answer only costs a little on the Doctrine bar, and the answer teaches you the text.</p>
      ${s.rulings.map((r) => {
        const a = ans[r.id];
        if (!a) return `<div class="ruling"><p>${esc(r.proposition)}</p>
          <button class="rule" data-r="${esc(r.id)}" data-a="stand">Let it stand</button>
          <button class="rule" data-r="${esc(r.id)}" data-a="refute">Refute it</button></div>`;
        const right = a === r.answer;
        return `<div class="ruling done ${right ? "right" : "wrong"}"><p>${esc(r.proposition)}</p>
          <p class="verdict">You said: ${a === "stand" ? "let it stand" : "refute it"}. ${esc(AUTHORITY[s.act] || "The sources")} ${esc(SOURCES_VERB[r.answer])}. ${right ? "✓" : "✗"}</p>
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
    const live = (slot) => E.slotRequired(slot, draft);
    const full = c.slots.every((slot) => draft[slot.id] || !live(slot));
    return `<div class="rulings composer"><div class="t caps">Write it: ${esc(w.title || "the work")}${w.addressee ? " · for " + esc(w.addressee) : ""}</div>
      <p class="note">${esc(c.prompt || "Choose one move for each part. Nothing is sent until you press “Send it”; the text of your work builds up below as you pick.")}</p>
      ${c.slots.map((slot) => live(slot) ? `<fieldset class="slot"><legend>${esc(slot.question)}</legend>
        ${slot.options.map((o) => `<button class="opt ${draft[slot.id] === o.id ? "sel" : ""}" data-slot="${esc(slot.id)}" data-o="${esc(o.id)}" aria-pressed="${draft[slot.id] === o.id}">
          <span>${esc(o.label)}</span><span class="chip ${esc(o.epistemic_label)}">${esc(o.epistemic_label)}</span>${costLine(o.effects)}</button>`).join("")}
        </fieldset>` : `<fieldset class="slot skip"><legend>${esc(slot.question)}</legend>
        <p class="note">Not needed — an earlier choice already rules this out.</p></fieldset>`).join("")}
      <div class="preview"><div class="t caps">Your choices so far</div>${c.slots.filter(live).map((slot) => { const o = slot.options.find((x) => x.id === draft[slot.id]); return `<p class="${o ? "" : "empty"}">${o ? esc(o.label) : "… (" + esc(slot.question) + ")"}</p>`; }).join("")}</div>
      ${full ? `<p class="note total">If you send this: ${sumCost(c.slots.filter(live).map((sl) => (sl.options.find((x) => x.id === draft[sl.id]) || {}).effects || {}))}</p>` : ""}
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
        <table class="ledger cmp"><tr class="hd"><td class="note">#</td><td class="note">your order</td><td class="note">the manuscript's order</td></tr>${order.map((id, i) => { const it = items.find((x) => x.id === id), tr = items.find((x) => x.id === r.truth[i]); return `<tr class="${id === r.truth[i] ? "" : "off"}"><td class="ct">${i + 1}</td><td>${esc(it.label)}${id === r.truth[i] ? " ✓" : ""}</td><td>${esc(tr.label)}${tr.note ? `<small>${esc(tr.note)}</small>` : ""}</td></tr>`; }).join("")}</table>
        <p class="note">${d === 0 ? "This is the order the manuscript has." : `${d} of ${pairs} pairs of works stand in a different order in the manuscript.`}
        The real order is the answer key; it is also an argument about what the volume was for.</p>${why(r.based_on)}</div>`;
    }
    if (!orderDraft) orderDraft = items.map((i) => i.id);
    const it = (id) => items.find((x) => x.id === id);
    const first = it(orderDraft[0]), last = it(orderDraft[orderDraft.length - 1]);
    return `<div class="rulings"><div class="t caps">Put the works in order</div>
      <p class="note">${esc(r.prompt || "Arrange the works as the volume should have them.")} Each row has buttons to move it one place (▲ ▼) or to the top or bottom (⤒ ⤓); with the keyboard, focus a row's button and press the Up or Down arrow and keep pressing. Nothing is scored until you press “Use this order”.</p>
      <p class="note">As you have it now, the volume opens with <strong>${esc(first.label)}</strong> and closes with <strong>${esc(last.label)}</strong>.</p>
      ${r.detail ? `<details class="more"><summary>More on the sources</summary>${G(r.detail)}</details>` : ""}
      <ol class="sortlist">${orderDraft.map((id, i) => `<li data-id="${esc(id)}"><span class="pos">${i + 1}</span><span class="lbl">${esc(it(id).label)}${it(id).note ? `<small>${esc(it(id).note)}</small>` : ""}</span>
        <button class="mv" data-id="${esc(id)}" data-d="top" aria-label="Move to the top" ${i === 0 ? "disabled" : ""}>⤒</button>
        <button class="mv" data-id="${esc(id)}" data-d="-1" aria-label="Move up" ${i === 0 ? "disabled" : ""}>▲</button>
        <button class="mv" data-id="${esc(id)}" data-d="1" aria-label="Move down" ${i === orderDraft.length - 1 ? "disabled" : ""}>▼</button>
        <button class="mv" data-id="${esc(id)}" data-d="bottom" aria-label="Move to the bottom" ${i === orderDraft.length - 1 ? "disabled" : ""}>⤓</button></li>`).join("")}</ol>
      <button class="go alt" id="resetorder">Reset order</button> <button class="go" id="useorder">Use this order</button></div>`;
  }

  // ------------------------------------------------------------------ the scene
  function render() {
    const s = game.scene;
    if (!s) return ending();
    chrome();
    save();
    if (!actsShown.has(s.act) && !game.pending) return actCard(s);
    glossSeen = new Set();
    const p = game.pending;
    const ready = game.ready();
    const all = s.choices;
    app.innerHTML = `
      ${strip(s.act)}
      <div class="leaf">
        <div class="act ${s.act}">${ACTNAME[s.act] || s.act}</div>
        <h2>${esc(s.title)}</h2>
        <p class="meta">${esc(s.situation.when)} · ${esc(s.situation.where)}</p>
        ${sceneFigure(s)}
        ${hint()}
        <div class="attested"><b>What the sources establish (fixed; you cannot change these)</b><ul>${s.invariants.map((i) => `<li>${G(i.text)}${i.detail ? `<details class="more"><summary>More on the sources</summary>${G(i.detail)}</details>` : ""}</li>`).join("")}</ul></div>
        ${s.prose.map((x) => `<p>${G(x)}</p>`).join("")}
        ${ledger(s)}
        ${rulings(s)}
        <p class="question">${G(s.dramatic_question)}</p>
        ${game.rulingsDone() ? commitment(s) : ""}
        ${game.rulingsDone() && game.commitmentDone() ? composer(s) : ""}
        ${game.rulingsDone() && game.commitmentDone() && game.composerDone() ? sorter(s) : ""}
        ${!ready ? "" : p ? chosen(s, p) : `<ul class="choices">${all.map((c, i) => {
          const ok = E.available(c, state());
          return `<li><button class="choice ${ok ? "" : "locked"}" data-id="${esc(c.id)}" ${ok ? "" : "disabled"}><span class="key">${i + 1}</span>
            <span class="body"><span>${G(c.label)}</span>${ok ? costLine(c.effects) + (c.costs || []).map((t) => `<span class="cost">${esc(t)}</span>`).join("") : `<span class="cost lock">Closed to you: needs ${lockedWhy(c)}.</span>`}</span>
            <span class="chip ${esc(c.epistemic_label)}">${esc(c.epistemic_label)}</span></button></li>`; }).join("")}</ul>`}
      </div>`;
    bind();
    warmPlateCache(app);
  }

  function chosen(s, c) {
    const hist = s.choices.find((x) => x.historical);
    let record = "";
    if (s.act === "historian") record = "";
    else if (hist) {
      if (c.historical) record = `<p class="record">The record: this is what the sources say he did.</p>`;
      else if (c.epistemic_label === "counterfactual") record = `<p class="record">The record: he did otherwise. The sources have him: <i>${G(hist.label)}</i> The game returns you to the record.</p>`;
      else record = `<p class="record">Not the course the sources record for this decision. They have him: <i>${G(hist.label)}</i></p>`;
    } else if (s.unrecorded) {
      record = c.epistemic_label === "documented"
        ? `<p class="record">The sources record this among the things he did; they do not settle the order or the choice made here.</p>`
        : `<p class="record">The record is silent on this decision. Your choice fills a gap, and the game marks it as ours.</p>`;
    }
    return `<div class="feedback">
      <p><span class="chip ${esc(c.epistemic_label)}" style="margin:0 .4rem 0 0">${esc(c.epistemic_label)}</span><i>${G(c.label)}</i></p>
      <p>${G(c.feedback || "")}</p>${record}
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
      b.onclick = () => move(b.dataset.id, b.dataset.d, true);
      b.onkeydown = (e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); move(b.dataset.id, e.key === "ArrowUp" ? "-1" : "1", true); } };
    });
    const ro = $("resetorder"); if (ro) ro.onclick = () => { orderDraft = null; render(); };
    const uo = $("useorder"); if (uo) uo.onclick = () => { game.sort(orderDraft); orderDraft = null; render(); };
    const go = $("continue");
    if (go) { go.onclick = () => { game.advance(); draft = {}; orderDraft = null; render(); window.scrollTo(0, 0); }; go.focus(); }
  }
  function move(id, d, refocus) {
    const i = orderDraft.indexOf(id);
    const j = d === "top" ? 0 : d === "bottom" ? orderDraft.length - 1 : i + Number(d);
    if (j < 0 || j >= orderDraft.length || j === i) return;
    orderDraft.splice(j, 0, orderDraft.splice(i, 1)[0]);
    render();
    if (refocus) { const btn = app.querySelector(`.mv[data-id="${id}"][data-d="${d}"]:not([disabled])`) || app.querySelector(`.mv[data-id="${id}"]:not([disabled])`); if (btn) btn.focus(); }
  }

  document.addEventListener("keydown", (e) => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") { if (confirmMsg !== null) { confirmMsg = null; confirmYes = null; } else { showBoard = false; showHow = false; } chrome(); return; }
    if (panelOpen()) return;
    if (/^[1-9]$/.test(e.key)) {
      const b = app.querySelectorAll(".choice:not([disabled])");
      const all = Array.from(app.querySelectorAll(".choice"));
      const t = all[Number(e.key) - 1];
      if (t && !t.disabled) t.click();
    }
  });

  // ------------------------------------------------------------------ the ending
  // The margin: the game abstractions at the end of the player's life, beside where the record's own course leaves them.
  // Exposure and enemies are better lower; the rest better higher. These are game abstractions, not historical quantities.
  function marginHtml() {
    const bm = window.CONTENT.benchmark || {};
    const st = game.state;
    const rows = [["exposure", "Exposure", -1], ["enemies", "Enemies", -1], ["livelihood", "Livelihood", 1], ["students", "Students", 1], ["works", "Works in circulation", 1]];
    let better = 0, worse = 0;
    const body = rows.map(([k, label, dir]) => {
      const you = st["press." + k] || 0, rec = bm["press." + k] || 0, d = (you - rec) * dir;
      const v = d > 0 ? "better than the record" : d < 0 ? "worse than the record" : "the same as the record";
      if (d > 0) better++; else if (d < 0) worse++;
      return `<tr><td>${esc(label)}</td><td class="ct">${you}</td><td class="ct">${rec}</td><td class="note">${v}</td></tr>`;
    }).join("");
    const bio = st["score.biography"] || 0, bmBio = bm["score.biography"];
    return `<h2 style="font-size:1.1rem;margin-top:1.4rem">The margin: your life beside the record's</h2>
      <p>Two things pull against each other here. The bars above measure how close you stayed to what the sources say he did. This table measures how your life went, on the game's own abstractions, against where following the record would have left him. A choice that departs from the record can leave you better off on some of these, and it costs you on the biography bar.</p>
      <table class="ledger"><tr><td class="caps" style="font-size:.7rem">Measure</td><td class="caps ct" style="font-size:.7rem">You</td><td class="caps ct" style="font-size:.7rem">The record's course</td><td></td></tr>${body}</table>
      <p class="note">You came out better than the record's course on ${better} of the five measures and worse on ${worse}.${bmBio !== undefined ? ` Your biography bar is ${bio > 0 ? "+" : ""}${bio}; a player who follows the record at every step, and gives the worst answers everywhere else, reaches +${bmBio}.` : ""} These numbers are game abstractions, not historical quantities.</p>`;
  }

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
        ${marginHtml()}
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
        <div class="center"><button class="go alt" id="copyrec">Copy your record</button> <button class="go alt" id="dlrec">Download it</button> <button class="go" id="again">Play again</button></div>
      </div>`;
  }
  function ending() {
    chrome(); save();
    app.innerHTML = strip("historian") + endingHtml();
    $("copyrec").onclick = copyRecord; $("dlrec").onclick = downloadRecord;
    warmPlateCache(app);
    $("again").onclick = () => { clearSave(); game.reset(); actsShown = new Set(); draft = {}; orderDraft = null; render(); window.scrollTo(0, 0); };
  }

  window.__game.render = render; // test handle: re-render after driving the engine directly
  $("btn-how").onclick = () => { showHow = !showHow; chrome(); };
  $("btn-board").onclick = () => { showBoard = !showBoard; chrome(); };
  $("btn-restart").onclick = () => confirmErase(() => { clearSave(); game.reset(); actsShown = new Set(); draft = {}; orderDraft = null; showHow = false; showBoard = false; confirmMsg = null; chrome(); title(); });
  title();
})();
