// Prototype C — "The Ladder".
//
// The picture, cut up, handed back as 41 loose tiles. Place each one on the rung
// of the ascent it belongs to. Marking is against this project's interpretive
// schema — which is an argument, not a fact, and the game says so when you mark:
// the interesting result is not your score but which of your disagreements you
// can defend.
//
// This is the "diagram" reading of the folio taken literally: if the palace is a
// cosmological ladder rather than a house, then sorting is the correct verb.

import { loadPalace, renderCard, spriteURL } from '../shared/data.js?v=1';

const ladderEl = document.getElementById('ladder');
const trayEl = document.getElementById('tray-items');
const cardEl = document.getElementById('card');
const scoreEl = document.getElementById('score');

let palace, placement = new Map(), marked = false;

function build() {
  ladderEl.innerHTML = '';
  for (const r of palace.rungs) {
    const div = document.createElement('div');
    div.className = 'rung';
    div.style.borderLeftColor = r.colour;
    div.dataset.rung = r.id;
    div.innerHTML = `
      <h4>${r.name}<span class="n">rung ${r.n}</span></h4>
      <div class="gloss">${r.gloss}</div>
      <div class="slots"></div>`;
    dropTarget(div, r.id);
    ladderEl.appendChild(div);
  }
  dropTarget(trayEl, null);
}

function dropTarget(el, rungId) {
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); });
  el.addEventListener('dragleave', () => el.classList.remove('over'));
  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('over');
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    if (rungId) placement.set(id, rungId); else placement.delete(id);
    marked = false;
    render();
  });
}

function tile(node) {
  const t = document.createElement('div');
  t.className = 'tile';
  t.draggable = true;
  t.title = node.title;
  t.dataset.id = node.id;
  t.innerHTML = `<img src="${spriteURL(palace, node)}" alt="${node.title}">`;
  t.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    t.classList.add('dragging');
  });
  t.addEventListener('dragend', () => t.classList.remove('dragging'));
  t.addEventListener('click', () => renderCard(palace, node, cardEl));
  if (marked) {
    const put = placement.get(node.id);
    if (put) t.classList.add(put === node.rung ? 'right' : 'wrong');
  }
  return t;
}

function render() {
  for (const r of palace.rungs) {
    const slots = ladderEl.querySelector(`.rung[data-rung="${r.id}"] .slots`);
    slots.innerHTML = '';
    for (const n of palace.pieces) {
      if (placement.get(n.id) === r.id) slots.appendChild(tile(n));
    }
  }
  trayEl.innerHTML = '';
  const left = palace.pieces.filter(n => !placement.has(n.id));
  for (const n of left) trayEl.appendChild(tile(n));

  const placed = palace.pieces.length - left.length;
  if (marked) {
    const right = palace.pieces.filter(n => placement.get(n.id) === n.rung).length;
    scoreEl.textContent = `${right} / ${palace.pieces.length} agree with the schema`;
  } else {
    scoreEl.textContent = `${placed} / ${palace.pieces.length} placed`;
  }
}

(async function main() {
  palace = await loadPalace('..');
  build();
  render();

  document.getElementById('check').onclick = () => {
    marked = true;
    render();
    cardEl.innerHTML = `
      <div class="eyebrow">on marking</div>
      <h3>Disagreement is the point</h3>
      <p>The rung assignments are this project's reading, built from Ibn Turka-adjacent
      cosmology — barzakh as the isthmus, ʿālam al-khayāl as the realm of subsisting
      images. Bihzād labelled none of this. Where you disagree, ask whether the
      painting supports you better than it supports the schema.</p>`;
  };
  document.getElementById('reveal').onclick = () => {
    for (const n of palace.pieces) placement.set(n.id, n.rung);
    marked = true;
    render();
  };
  document.getElementById('reset').onclick = () => {
    placement.clear(); marked = false; cardEl.innerHTML = ''; render();
  };

  window.__yusufC = { palace, placement, get marked() { return marked; } };
})();
