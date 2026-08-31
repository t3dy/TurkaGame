// Prototype A — "The Seven Doors".
//
// Loop: the doors are locked, as they are in Q 12:23. Each door is inscribed
// with a term; to open it you must find the element of the painting that
// embodies that term and click it. Every one of the 43 elements is clickable
// and returns a research card, so the answers are found by looking, not guessing.
//
// The eighth opening (the balcony door) is a blind and cannot be opened.

import { loadPalace, renderCard, folioURL, clamp } from '../shared/data.js?v=1';

const folio   = document.getElementById('folio');
const img     = document.getElementById('folio-img');
const chainEl = document.getElementById('chain');
const promptEl= document.getElementById('prompt');
const cardEl  = document.getElementById('card');
const fbEl    = document.getElementById('feedback');
const counter = document.getElementById('counter');

let palace, state, hotspots = new Map(), showAll = false;

function newState() {
  return { step: 0, opened: [], seen: new Set(), attempts: 0, done: false };
}

function currentDoor() {
  if (state.done) return null;
  return palace.byId[palace.door_chain[state.step]];
}

/* ---------------------------------------------------------------- hotspots */

function buildHotspots() {
  folio.querySelectorAll('.hot, .doorlabel').forEach(e => e.remove());
  hotspots.clear();

  // Draw doors last so they sit above the large surfaces they overlap.
  const ordered = [...palace.pieces].sort((a, b) => {
    const area = n => n.norm[2] * n.norm[3];
    if ((a.role === 'door') !== (b.role === 'door')) return a.role === 'door' ? 1 : -1;
    return area(b) - area(a);
  });

  for (const node of ordered) {
    const [x, y, w, h] = node.norm;
    const el = document.createElement('div');
    el.className = 'hot';
    el.style.left = `${x * 100}%`;
    el.style.top = `${y * 100}%`;
    el.style.width = `${w * 100}%`;
    el.style.height = `${h * 100}%`;
    el.title = node.title;
    el.dataset.id = node.id;
    if (node.role === 'door') el.classList.add('door');
    el.addEventListener('click', ev => { ev.stopPropagation(); onClick(node, el); });
    folio.appendChild(el);
    hotspots.set(node.id, el);
  }

  // Numbered tags on the door chain, so the route is legible before you solve it.
  palace.door_chain.forEach((id, i) => {
    const n = palace.byId[id];
    const tag = document.createElement('div');
    tag.className = 'doorlabel';
    tag.textContent = `${i + 1}`;
    tag.style.left = `${(n.norm[0] + n.norm[2] / 2) * 100}%`;
    tag.style.top = `${(n.norm[1] + n.norm[3] / 2) * 100}%`;
    folio.appendChild(tag);
  });
}

function refresh() {
  for (const [id, el] of hotspots) {
    const node = palace.byId[id];
    el.classList.toggle('seen', state.seen.has(id));
    el.classList.remove('locked', 'open', 'current');
    if (node.role === 'door') {
      if (state.opened.includes(id)) el.classList.add('open');
      else el.classList.add('locked');
      if (currentDoor() && currentDoor().id === id) el.classList.add('current');
    }
    el.style.opacity = showAll ? 1 : '';
    el.style.background = showAll && node.role !== 'door'
      ? 'rgba(201,154,46,.10)' : '';
  }

  chainEl.innerHTML = '';
  palace.door_chain.forEach((id, i) => {
    const pip = document.createElement('div');
    pip.className = 'pip';
    if (state.opened.includes(id)) pip.classList.add('open');
    else if (i === state.step) pip.classList.add('current');
    pip.textContent = state.opened.includes(id) ? '✓' : (i + 1);
    pip.title = palace.byId[id].title;
    chainEl.appendChild(pip);
  });

  const door = currentDoor();
  if (door) {
    promptEl.innerHTML = `
      <span class="concept">Door ${state.step + 1} of 7 · ${door.title}</span>
      <span class="term">${door.lock.term}</span>
      <span class="concept">${door.lock.concept}</span>
      <p>${door.lock.prompt}</p>`;
  } else {
    promptEl.innerHTML = `
      <div id="win">
        <h3>The seventh door gives.</h3>
        <p>You are in the chamber, and the chamber has no floor beyond its sill.
        That is where Bihzād leaves Yūsuf too.</p>
      </div>`;
  }

  counter.textContent =
    `${state.seen.size} / ${palace.pieces.length} elements examined · ${state.attempts} attempts`;
}

/* ------------------------------------------------------------------- input */

function flash(el, cls) {
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 700);
}

function onClick(node, el) {
  state.seen.add(node.id);
  renderCard(palace, node, cardEl);

  const door = currentDoor();

  // Clicking the door itself just restates its inscription.
  if (node.role === 'door') {
    if (node.blind) {
      fbEl.className = 'bad';
      fbEl.textContent = node.lock.gloss;
    } else if (state.opened.includes(node.id)) {
      fbEl.className = '';
      fbEl.textContent = 'Already open.';
    } else if (door && node.id === door.id) {
      fbEl.className = '';
      fbEl.textContent = 'Read the inscription, then find it in the picture.';
    } else {
      fbEl.className = '';
      fbEl.textContent = 'Locked, and not the one in front of you. The chain runs outward-in.';
    }
    refresh();
    return;
  }

  if (!door) { fbEl.className = ''; fbEl.textContent = ''; refresh(); return; }

  state.attempts++;
  if (node.id === door.lock.answer) {
    flash(el, 'answer-hit');
    state.opened.push(door.id);
    state.step++;
    state.done = state.step >= palace.door_chain.length;
    fbEl.className = 'good';
    fbEl.textContent = `${door.title} opens. ${door.lock.gloss}`;
  } else {
    flash(el, 'answer-miss');
    fbEl.className = 'bad';
    fbEl.textContent = `Not this. ${node.title} does not answer to ${door.lock.concept}.`;
  }
  refresh();
}

/* -------------------------------------------------------------------- boot */

(async function main() {
  palace = await loadPalace('..');
  state = newState();

  img.src = folioURL(palace);
  await img.decode().catch(() => {});
  buildHotspots();
  refresh();
  fbEl.textContent = 'Click anything. Every element in the folio returns a card.';

  document.getElementById('toggle-hot').addEventListener('click', ev => {
    showAll = !showAll;
    ev.target.classList.toggle('active', showAll);
    ev.target.textContent = showAll ? 'Hide all elements' : 'Show all elements';
    refresh();
  });
  document.getElementById('restart').addEventListener('click', () => {
    state = newState();
    cardEl.innerHTML = '';
    fbEl.className = '';
    fbEl.textContent = '';
    refresh();
  });

  // Debug handle, matching the VN prototype's convention (window.__turkaVN).
  window.__yusufA = { palace, get state() { return state; },
                      solve: () => { state.opened = [...palace.door_chain];
                                     state.step = 7; state.done = true; refresh(); } };
})();
