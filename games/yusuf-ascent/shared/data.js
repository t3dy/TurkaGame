// Shared data access for all three prototypes. One fetch, one shape.
// Every prototype builds on `nodes` — there is no per-prototype element list,
// so "all elements interactable" is a property of the data, not of each build.

const V = 'v=1';

export async function loadPalace(base = '..') {
  const res = await fetch(`${base}/data/palace.json?${V}`);
  if (!res.ok) throw new Error(`palace.json: ${res.status}`);
  const palace = await res.json();

  palace.byId = Object.fromEntries(palace.nodes.map(n => [n.id, n]));
  palace.rungById = Object.fromEntries(palace.rungs.map(r => [r.id, r]));
  palace.doors = palace.nodes.filter(n => n.role === 'door');
  palace.base = base;
  // Frames are the whole-folio crops; they are browsable but never puzzle targets.
  palace.pieces = palace.nodes.filter(n => n.role !== 'frame');
  return palace;
}

export async function loadResearch(base = '..') {
  const res = await fetch(`${base}/data/research.json?${V}`);
  if (!res.ok) throw new Error(`research.json: ${res.status}`);
  return res.json();
}

export function spriteURL(palace, node) {
  return `${palace.base}/${node.sprite}`;
}

export function folioURL(palace) {
  return `${palace.base}/${palace.source.full_image}`;
}

/** Render one element's research card into a container. */
export function renderCard(palace, node, el, { withThumb = true } = {}) {
  const rung = palace.rungById[node.rung];
  el.innerHTML = `
    <div class="eyebrow">${node.role}</div>
    <h3>${node.title}</h3>
    <span class="rung-chip" style="background:${rung.colour}">${rung.name}</span>
    ${withThumb ? `<img class="thumb" src="${spriteURL(palace, node)}" alt="${node.label}">` : ''}
    <p>${node.card}</p>
    <div class="note">${node.label}</div>`;
}

/** Frame-rate-independent smoothing factor. */
export function response(lambda, dt) {
  return 1 - Math.exp(-lambda * dt);
}

export function easeOut(t, p = 1.8) {
  return 1 - Math.pow(1 - t, p);
}

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
