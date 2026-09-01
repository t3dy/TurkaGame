// Shared data access for all three prototypes. One fetch, one shape.
// Every prototype builds on `nodes` — there is no per-prototype element list,
// so "all elements interactable" is a property of the data, not of each build.

const V = 'v=2';

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

const KIND_COLOUR = {
  ATTESTED: '#2e8f8f', CORPUS: '#2f5ea8', FIELD: '#7a6f52',
  INFERENCE: '#c06523', INTERPRETATION: '#5a4a5e',
};

/** The L3 line: what this element rests on, carried through to the running game.
 *  Collapsed by default so it informs without shouting. */
function groundsHTML(palace, node) {
  if (!node.grounds || !node.grounds.length) return '';
  const worst = ['INTERPRETATION', 'FIELD', 'INFERENCE', 'CORPUS', 'ATTESTED'];
  const rank = k => worst.indexOf(k);
  const weakest = node.grounds.reduce((a, g) => rank(g.kind) < rank(a) ? g.kind : a, 'ATTESTED');
  const rows = node.grounds.map(g => `
    <li><span class="gk" style="background:${KIND_COLOUR[g.kind] || '#555'}">${g.kind}</span>
      ${g.claim}${g.source ? ` <em>— ${g.source}</em>` : ''}</li>`).join('');
  return `<details class="grounds">
    <summary>Rests on <span class="gk" style="background:${KIND_COLOUR[weakest]}">${weakest}</span>
      <span class="dim">${node.grounds.length} claim${node.grounds.length > 1 ? 's' : ''}</span></summary>
    <ul>${rows}</ul></details>`;
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
    <div class="note">${node.label}</div>
    ${groundsHTML(palace, node)}`;
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
