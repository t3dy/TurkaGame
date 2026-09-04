// The Impossible Architect.
//
// A tile-laying route-builder whose spatial rules are the painting's, not Euclid's.
// Every piece is one of the 41 cut elements of Bihzad's Yusuf fleeing Zulaykha, and
// every piece's rule is the logic its card in palace.json already gives it. This
// game reads that file and the sprites cut for Yusuf Ascent directly — data and
// assets, not code — which is the whole point of having made palace.json a shared
// layer rather than a one-game convenience.
//
// Board: 5 columns x 7 rows. Row r IS rung r (street at the bottom, crown at the
// top). Win: a connected route from the street door to the chamber.

const YA = '../yusuf-ascent';
const V = 'v=1';
const COLS = 5, ROWS = 7;
const $ = id => document.getElementById(id);

let P, PIECES, state;

/* ---------------------------------------------------------- piece rules --- */
// Each rule is stated in the words of the card that justifies it, and shown on
// the card in play. "connects" answers: from this cell, which cells are reachable?

const RULES = {
  stair: {
    ids: ['staircase-upper', 'staircase-lower', 'stair-landing'],
    label: 'Barzakh',
    text: 'The stair belongs to neither storey it joins — so it connects to ANY column in the row above and the row below.',
    support: true,
  },
  door: {
    label: 'Locked from within',
    text: 'Passable only once its lock\'s answer is standing somewhere in your structure. Connects up and down.',
    support: true,
  },
  blind: {
    ids: ['balcony-doorway'],
    label: 'A blind',
    text: 'Painted on a plane with nothing behind it. Never passable. A trap card.',
    support: true,
  },
  bracket: {
    ids: ['balcony-brackets'],
    label: 'Carried on nothing',
    text: 'Needs NO support below, and supports whatever is placed above it.',
    support: false,
  },
  muqarnas: {
    ids: ['muqarnas-eaves'],
    label: 'The joiner',
    text: 'The geometry for joining shapes that do not meet — connects to all eight neighbours, diagonals included.',
    support: true,
  },
  tile: {
    ids: ['tile-field-left', 'tile-field-right', 'blue-dado', 'chamber-carpet', 'chamber-tile-panel', 'tile-roundel', 'iwan-spandrel-tile'],
    label: 'No edge of its own',
    text: 'A pattern that continues by rule: when placed, it also fills one empty neighbouring cell on the same row.',
    support: true,
  },
  sight: {
    ids: ['badgir-kiosk'],
    label: 'Reachable only by looking',
    text: 'No stair or door reaches it. It counts as connected to any connected piece in the same column or row — line of sight.',
    support: true,
  },
  text: {
    label: 'Follows the wall plane',
    text: 'Verse built into the building. May be placed on ANY rung; connects like a surface.',
    support: true,
  },
  light: {
    ids: ['yusuf-halo'],
    label: 'The only light',
    text: 'Illumination: placing it draws two extra pieces into your hand.',
    support: true,
  },
  sill: {
    ids: ['chamber-threshold'],
    label: 'A sill over open air',
    text: 'The chamber floor ends here. Connects DOWNWARD only.',
    support: true,
  },
  goal: {
    ids: ['the-chamber'],
    label: 'The goal',
    text: 'The one enclosed room. It is entered only THROUGH an open door beneath it — the route Yusuf takes is doors, not walls.',
    support: true,
  },
  block: {
    ids: ['cupola'],
    label: 'Unreachable',
    text: 'The terminus no stair reaches and no figure occupies. Pre-placed above the chamber; impassable.',
    support: true,
  },
  surface: {
    label: 'A surface',
    text: 'Connects to its four orthogonal neighbours.',
    support: true,
  },
};

function ruleFor(node) {
  for (const [k, r] of Object.entries(RULES)) {
    if (r.ids && r.ids.includes(node.id)) return k;
  }
  if (node.role === 'door') return 'door';
  if (node.role === 'text') return 'text';
  return 'surface';
}

/* --------------------------------------------------------------- state --- */

function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function newGame(seed) {
  const rnd = mulberry(seed);
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  const fixed = { 'street-door': [0, 2], 'the-chamber': [5, 2], 'cupola': [6, 2] };
  const deck = PIECES.filter(p => !(p.id in fixed));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  for (const [id, [r, c]] of Object.entries(fixed)) grid[r][c] = { piece: byId(id), fixed: true };

  state = { seed, grid, deck, hand: [], sel: null, placed: 0, done: false, discards: 0 };
  draw(5);
  paintAll();
  toast('Build a route from the street door to the chamber. Each piece obeys its own logic.');
}

const byId = id => PIECES.find(p => p.id === id);
function draw(n) { while (n-- > 0 && state.deck.length) state.hand.push(state.deck.shift()); }

/* -------------------------------------------------------------- placing --- */

function canPlace(piece, r, c) {
  if (state.grid[r][c]) return [false, 'Occupied.'];
  const rule = piece.rule;
  // Rung restriction: own rung or one off — a stratum is a stratum. Text is exempt.
  if (rule !== 'text' && Math.abs(piece.rung_n - r) > 1) {
    return [false, `${piece.title} belongs to the ${P.rungById[piece.rung].name} rung (row ${piece.rung_n}); it may go one row off, not ${Math.abs(piece.rung_n - r)}.`];
  }
  // The chain. Column 2 between the street door and the chamber is the route the
  // painting's doors make, and ONLY doors go there — a wall stacked up the middle
  // would take the one cell that can admit you to the chamber and make the palace
  // unwinnable. (Found by a solver: it filled the board, opened six locks, and
  // lost, because a surface sat under the chamber.) Doors, conversely, go
  // nowhere else: they are the chain or they are nothing.
  const inChain = c === 2 && r >= 1 && r <= 4;
  if (rule === 'door' && !inChain) {
    return [false, 'The doors form the chain up the centre column, rows 1–4. Nowhere else.'];
  }
  if (rule !== 'door' && inChain) {
    return [false, 'The centre column is the chain of doors. Only a door goes here.'];
  }
  // Support: something below, or the ground, or a bracket's exemption.
  if (RULES[rule].support && r > 0) {
    const below = state.grid[r - 1][c];
    if (!below) return [false, 'Nothing beneath it. Only the brackets stand on nothing.'];
  }
  return [true, ''];
}

function place(piece, r, c) {
  const [ok, why] = canPlace(piece, r, c);
  if (!ok) { toast(why, 'bad'); return; }
  state.grid[r][c] = { piece };
  state.hand = state.hand.filter(p => p !== piece);
  state.sel = null;
  state.placed++;

  // Tile fields continue by rule: fill one empty neighbour on the same row.
  if (piece.rule === 'tile') {
    for (const dc of [1, -1]) {
      const cc = c + dc;
      if (cc >= 0 && cc < COLS && !state.grid[r][cc]) {
        state.grid[r][cc] = { piece, spread: true };
        toast(`${piece.title} continues by rule into the next cell.`, 'good');
        break;
      }
    }
  }
  if (piece.rule === 'light') { draw(2); toast('The halo illuminates: two more pieces drawn.', 'good'); }

  draw(1);
  paintAll();
  judge();
}

/* --------------------------------------------------------- connectivity --- */

function lockOpen(doorPiece) {
  // A door opens when its lock's answer-element stands anywhere on the board.
  const lock = doorPiece.lock;
  if (!lock || !lock.answer) return false;
  return state.grid.some(row => row.some(cell => cell && cell.piece.id === lock.answer));
}

function neighboursOf(r, c) {
  const cell = state.grid[r][c];
  const piece = cell.piece;
  const rule = piece.rule;
  const out = [];
  const push = (rr, cc) => { if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && state.grid[rr][cc]) out.push([rr, cc]); };

  if (rule === 'blind' || rule === 'block') return out;
  if (rule === 'stair') {
    for (let cc = 0; cc < COLS; cc++) { push(r + 1, cc); push(r - 1, cc); }
    push(r, c - 1); push(r, c + 1);
    return out;
  }
  if (rule === 'muqarnas') {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) push(r + dr, c + dc);
    return out;
  }
  if (rule === 'sight') {
    for (let cc = 0; cc < COLS; cc++) if (cc !== c) push(r, cc);
    for (let rr = 0; rr < ROWS; rr++) if (rr !== r) push(rr, c);
    return out;
  }
  if (rule === 'sill') { push(r - 1, c); return out; }
  if (rule === 'door') {
    // The street door is the entrance — you are standing in it, so it admits
    // you outward regardless of its lock. Every OTHER door is locked from
    // within until its answer stands in the structure (Q 12:23).
    const isStart = r === 0 && c === 2;
    if (!isStart && !lockOpen(piece)) return out;
    push(r + 1, c); push(r - 1, c);
    return out;
  }
  // surface / text / tile / bracket / light / goal
  push(r + 1, c); push(r - 1, c); push(r, c - 1); push(r, c + 1);
  return out;
}

function connected() {
  const seen = new Set(['0,2']);
  const q = [[0, 2]];
  while (q.length) {
    const [r, c] = q.shift();
    for (const [rr, cc] of neighboursOf(r, c)) {
      const k = `${rr},${cc}`;
      if (seen.has(k)) continue;
      // Entering a cell also requires THAT cell to admit you (a locked door, a blind).
      const t = state.grid[rr][cc].piece.rule;
      if (t === 'blind' || t === 'block') continue;
      if (t === 'door' && !lockOpen(state.grid[rr][cc].piece)) continue;
      // The chamber admits you only THROUGH a door — Yusuf's route is doors, not
      // walls. So the cell you come FROM must be an open door.
      if (t === 'goal') {
        const from = state.grid[r][c].piece;
        if (!(from.rule === 'door' && lockOpen(from))) continue;
      }
      seen.add(k); q.push([rr, cc]);
    }
  }
  return seen;
}

function judge() {
  const reach = connected();
  const won = reach.has('5,2');
  if (won && !state.done) {
    state.done = true;
    const score = Math.max(0, 400 - state.placed * 12 - state.discards * 30);
    $('verdict').className = 'show win';
    $('verdict').innerHTML = `<div><h2>The route holds</h2>
      <p>${state.placed} pieces placed, ${state.discards} discard(s). The street door reaches the chamber —
      and the chamber's floor still ends in a sill over open air, which is where Bihzād leaves Yūsuf too.</p>
      <p style="font-family:var(--mono);color:var(--paper);font-size:1.1rem">${score} points</p>
      <button class="btn" id="again">Another palace</button></div>`;
    $('again').onclick = () => newGame((Math.random() * 1e9) | 0);
  } else if (!won && !state.deck.length && !state.hand.length && !state.done) {
    state.done = true;
    $('verdict').className = 'show lose';
    $('verdict').innerHTML = `<div><h2>Nothing left to build with</h2>
      <p>The deck is spent and the chamber is not reached. The seven doors demand the right things
      be standing before they give.</p>
      <button class="btn" id="again">Another palace</button></div>`;
    $('again').onclick = () => newGame((Math.random() * 1e9) | 0);
  }
  return reach;
}

/* --------------------------------------------------------------- paint --- */

function sprite(p) { return `${YA}/${p.sprite}`; }

function paintAll() {
  const reach = connected();
  const board = $('board');
  board.innerHTML = '';
  for (let r = ROWS - 1; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      const cell = state.grid[r][c];
      const d = document.createElement('div');
      d.className = 'cell';
      d.dataset.r = r; d.dataset.c = c;
      const rn = document.createElement('span');
      rn.className = 'rung'; rn.textContent = P.rungs[r].name; d.appendChild(rn);
      if (cell) {
        const im = document.createElement('img');
        im.src = sprite(cell.piece); im.alt = cell.piece.title; d.appendChild(im);
        d.classList.add('placed');
        if (cell.fixed) d.classList.add('fixed');
        if (cell.piece.id === 'the-chamber') d.classList.add('goal');
        if (reach.has(`${r},${c}`)) d.classList.add('connected');
        if (cell.piece.rule === 'door' && !cell.fixed) d.classList.add(lockOpen(cell.piece) ? 'open' : 'locked');
        // The fixed street door is the entrance; never draw it as locked.
        d.onmouseenter = () => showCard(cell.piece);
      } else {
        d.onmouseenter = () => {
          if (!state.sel) return;
          const [ok] = canPlace(state.sel, r, c);
          d.classList.add(ok ? 'ok' : 'bad');
        };
        d.onmouseleave = () => d.classList.remove('ok', 'bad');
      }
      d.onclick = () => {
        if (state.done) return;
        if (cell) { showCard(cell.piece); return; }
        if (!state.sel) { toast('Pick a piece from your hand first.'); return; }
        place(state.sel, r, c);
      };
      board.appendChild(d);
    }
  }

  const hand = $('hand');
  hand.innerHTML = '';
  for (const p of state.hand) {
    const h = document.createElement('div');
    h.className = 'hp' + (state.sel === p ? ' sel' : '');
    h.innerHTML = `<img src="${sprite(p)}" alt="${p.title}"><div class="r">${RULES[p.rule].label}</div>`;
    h.onclick = () => { state.sel = state.sel === p ? null : p; showCard(p); paintAll(); };
    h.onmouseenter = () => showCard(p);
    hand.appendChild(h);
  }

  $('deck').textContent = String(state.deck.length);
  $('placed').textContent = String(state.placed);
  $('reach').textContent = `${reach.size} cell(s)`;
  $('seed').textContent = String(state.seed);
  $('instruction').textContent = state.sel
    ? `Placing ${state.sel.title} — ${RULES[state.sel.rule].label.toLowerCase()}. Green cells are legal.`
    : 'Click a piece in your hand, then a cell. The street door is fixed at the bottom; the chamber is the goal.';

  $('doors').innerHTML = P.door_chain.map(id => {
    const d = byId(id);
    const open = lockOpen(d);
    return `<span class="${open ? 'open' : ''}" title="${d.lock.prompt}">${d.lock.term} ${d.title}${open ? ' ✓' : ''}</span>`;
  }).join('');
}

function showCard(p) {
  const rule = RULES[p.rule];
  const rung = P.rungById[p.rung];
  $('card').innerHTML = `
    <div class="eyebrow">${p.role} · ${rung.name} · rung ${p.rung_n}</div>
    <h3>${p.title}</h3>
    <p>${p.card}</p>
    <div class="rule"><b>${rule.label}.</b> ${rule.text}</div>
    ${p.lock && p.lock.answer ? `<div class="lock">Lock: ${p.lock.term} <i>${p.lock.concept}</i> — opens when
      <b>${byId(p.lock.answer).title}</b> is standing in your structure.</div>` : ''}`;
}

function toast(msg, kind = '') {
  const t = $('toast'); t.textContent = msg; t.className = 'show ' + kind;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.className = ''), 3200);
}

/* ---------------------------------------------------------------- boot --- */

(async function main() {
  P = await fetch(`${YA}/data/palace.json?${V}`).then(r => r.json());
  P.rungById = Object.fromEntries(P.rungs.map(r => [r.id, r]));
  PIECES = P.nodes.filter(n => n.role !== 'frame' && n.role !== 'figure')
    .map(n => ({ ...n, rule: ruleFor(n) }));

  $('discard').onclick = () => {
    if (state.done || !state.hand.length) return;
    state.deck.push(...state.hand); state.hand = []; state.sel = null; state.discards++;
    draw(5); paintAll(); judge();
  };
  $('restart').onclick = () => newGame((Math.random() * 1e9) | 0);
  $('same').onclick = () => newGame(state.seed);

  const seedParam = new URLSearchParams(location.search).get('seed');
  newGame(seedParam ? parseInt(seedParam, 10) : (Math.random() * 1e9) | 0);
  window.__architect = { get state() { return state; }, PIECES, RULES, connected, newGame, place, canPlace, byId };
})();
