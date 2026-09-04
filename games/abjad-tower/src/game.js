// game.js — modes, scoring, the Tome, and all the wiring.
//
// Scoring follows the pattern from AlchemyBlockInvaders: XP is for *witnessing
// something you have not witnessed before*, not for repetition. Firing the same
// operation twice is worth almost nothing; discovering that Inversion topples a
// tower Strike could not is worth a lot. The Tome is the record of what you have
// learned, and it is the actual progression.

import { World, BLOCK, TEMPER } from './world.js?v=6';
import * as OPS from './ops.js?v=6';
import { Notebook } from './notebook.js?v=6';

const V = 'v=2';
const $ = id => document.getElementById(id);

let LETTERS = [], OPDATA = null, world = null;
let CORR = null;                   // data/correspondences.json — the rival schemes
let notebook = null;               // the shared tajriba notebook (src/notebook.js)
let PALACE = null;                 // the Bihzad folio's cut pieces (cross-folder data)
const YA = '../yusuf-ascent';
let state = null, tome = null, raf = 0, last = 0;

/* --------------------------------------------------------------- the Tome -- */
// Persisted per browser. Wrapped in try/catch throughout: private windows and
// blocked site data must not break the game.

const TOME_KEY = 'abjad-tower.tome.v1';

function loadTome() {
  const empty = { seenOps: {}, seenLetters: {}, discoveries: [], xp: 0, best: {} };
  try {
    const raw = localStorage.getItem(TOME_KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch { return empty; }
}
function saveTome() {
  try { localStorage.setItem(TOME_KEY, JSON.stringify(tome)); } catch { /* fine */ }
}

/** XP only for the first sighting. Repetition is nearly worthless, by design. */
function record(key, label, points) {
  const first = !tome.discoveries.includes(key);
  tome.xp += first ? points : 1;
  if (first) {
    tome.discoveries.push(key);
    toast(`Discovered: ${label}  +${points}`, 'good');
  }
  saveTome();
  paintTome();
  return first;
}

const RANKS = [
  [0, 'Onlooker'], [40, 'Reader of Letters'], [110, 'Reckoner'],
  [220, 'Inscriber of Talismans'], [380, 'Master of the Two Orders'],
];
const rankFor = xp => RANKS.reduce((a, r) => (xp >= r[0] ? r[1] : a), RANKS[0][1]);

/* ---------------------------------------------------------------- towers -- */

function letterByGlyph(g) { return LETTERS.find(l => l.glyph === g); }

/** Deterministic PRNG so a seed reproduces a tower exactly. */
function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A tower whose lower courses are heavy and upper courses light — so it stands,
 *  and so Inversion has something real to undo. */
function buildTower(seed, courses = 7) {
  const rnd = mulberry(seed);
  const heavy = LETTERS.filter(l => l.abjad >= 60);
  const lightL = LETTERS.filter(l => l.abjad < 60);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];

  for (let c = 0; c < courses; c++) {
    // A hair of clearance per course: spawning bodies in exact contact makes the
    // solver resolve a penetration on frame one, which looks like an explosion.
    const y = BLOCK.h / 2 + c * (BLOCK.h + 0.02);
    const alt = c % 2 === 0;
    const n = 3;
    const pool = c < courses * 0.45 ? heavy : (c > courses * 0.75 ? lightL : LETTERS);
    for (let i = 0; i < n; i++) {
      // Spaced by DEPTH, so three of them span exactly the width and the course
      // is a square. The next course, laid crosswise, covers the same footprint.
      const off = (i - (n - 1) / 2) * (BLOCK.d + 0.008);
      const x = alt ? 0 : off, z = alt ? off : 0;
      world.addBlock(pick(pool), x, y, z, alt ? 0 : Math.PI / 2);
    }
  }
}

/* ----------------------------------------------------------------- modes -- */

const MODES = {
  hadm: {
    setup(s) {
      world.camOrbit.target.set(0, 1.9, 0);
      world.camOrbit.dist = 12; world.camOrbit.pitch = 0.22;
      buildTower(s.seed, 7);
      world.setTargetLine(1.9);
      s.budget = 8;
      s.instruction = 'Bring every block below the gold ring. Unspent operations score.';
    },
    check(s) {
      if (!world.isSettled()) return null;
      if (world.highestY() < 1.9) {
        return { win: true, score: 100 + s.budget * 25, why: 'The tower is below the line.' };
      }
      if (s.budget <= 0) return { win: false, why: 'Operations spent, and it still stands.' };
      return null;
    },
  },

  bina: {
    setup(s) {
      world.setTargetLine(3.6);
      s.budget = null;
      s.toPlace = 18;
      s.holdFrom = null;
      s.instruction = 'Click above the ground to drop a block. Reach the ring and hold it 5 s.';
      s.placing = true;
      // Frame the empty build volume, not the floor: the ring at 4.4 is the subject.
      world.camOrbit.target.set(0, 2.6, 0);
      world.camOrbit.dist = 15;
      world.camOrbit.pitch = 0.18;
    },
    check(s) {
      const high = world.highestY();
      if (high >= 3.6 && world.isSettled()) {
        if (s.holdFrom === null) s.holdFrom = world.time;
        const held = world.time - s.holdFrom;
        s.hold = held;
        if (held >= 5) {
          return { win: true, score: 150 + s.toPlace * 10,
                   why: 'It reached the ring and held.' };
        }
      } else if (high < 3.6) {
        s.holdFrom = null; s.hold = 0;
      }
      if (s.toPlace <= 0 && world.isSettled() && high < 3.6) {
        return { win: false, why: 'Out of blocks, and short of the ring.' };
      }
      return null;
    },
  },

  istikhraj: {
    setup(s) {
      world.camOrbit.target.set(0, 1.9, 0);
      world.camOrbit.dist = 11; world.camOrbit.pitch = 0.18;
      buildTower(s.seed, 7);
      world.setTargetLine(2.6);
      s.budget = 6;
      // Name a letter that actually appears more than once.
      const counts = {};
      for (const b of world.liveBlocks()) counts[b.letter.glyph] = (counts[b.letter.glyph] || 0) + 1;
      const cands = Object.keys(counts).filter(g => counts[g] >= 2);
      s.targetGlyph = cands.length ? cands[Math.floor(Math.random() * cands.length)]
                                   : world.liveBlocks()[0].letter.glyph;
      s.instruction = `Remove every ${s.targetGlyph} and keep the rest above the ring.`;
    },
    check(s) {
      if (!world.isSettled()) return null;
      const left = world.liveBlocks().filter(b => b.letter.glyph === s.targetGlyph).length;
      const high = world.highestY();
      if (left === 0 && high >= 2.6) {
        return { win: true, score: 200 + s.budget * 30, why: `Every ${s.targetGlyph} gone, tower standing.` };
      }
      if (high < 2.6) return { win: false, why: 'The tower fell below the ring.' };
      if (s.budget <= 0 && left > 0) return { win: false, why: `${left} × ${s.targetGlyph} still standing.` };
      return null;
    },
  },
};

/* -------------------------------------------------------------- mizāj ---- */
// Temperament. Every letter has a nature — fire, air, water, earth — but WHICH
// letter has which is exactly what the tradition does not agree on, so the game
// ships three rival schemes (data/correspondences.json) and picks one per seed
// without saying which. The physics is that scheme: complementary natures hold,
// opposed natures slide. The player builds, watches what stands, and records the
// result against every scheme in the notebook. A scheme is CONFIRMED only when a
// rival is DISPROVEN — which means finding the tower on which they disagree.

const MZ = { ring: 2.6, hand: 14, hold: 4 };

function temperSchemes() { return CORR.schemes.filter(s => s.domain === 'temperament'); }

function proposeClaims() {
  for (const s of CORR.schemes) {
    notebook.propose(s.id, { question: s.domain, text: s.name, kind: s.kind, source: s.source });
  }
}

/** What each scheme PREDICTS about the tower now, from its contacts, and what the
 *  tower actually did. Returns per-scheme verdicts; records nothing itself. */
function judgeTower(actual) {
  const pairs = world.contactPairs();
  const verdicts = [];
  if (pairs.length === 0) return { pairs: 0, verdicts };
  for (const s of temperSchemes()) {
    const comp = pairs.filter(([a, b]) => TEMPER.relation(s.map[a.letter.glyph], s.map[b.letter.glyph]) !== 'opposed').length;
    const predicted = comp / pairs.length >= 0.5 ? 'stands' : 'falls';
    verdicts.push({ id: s.id, name: s.name, predicted, agrees: predicted === actual, detail: `${comp}/${pairs.length} contacts not opposed` });
  }
  // The two efficacy rules are rivals on a different question: WHY letters hold.
  const mix = CORR.schemes.find(s => s.id === 'efficacy-mixture');
  const prop = CORR.schemes.find(s => s.id === 'efficacy-proportion');
  if (mix && prop) {
    const live = temperSchemes().find(s => s.id === state.schemeId);
    const compLive = pairs.filter(([a, b]) => TEMPER.relation(live.map[a.letter.glyph], live.map[b.letter.glyph]) !== 'opposed').length;
    const pm = compLive / pairs.length >= 0.5 ? 'stands' : 'falls';
    verdicts.push({ id: mix.id, name: mix.name, predicted: pm, agrees: pm === actual, detail: `${compLive}/${pairs.length} contacts complementary under the operative scheme` });
    const small = pairs.filter(([a, b]) => smallRatio(a.letter.abjad, b.letter.abjad, prop.max_term)).length;
    const pp = small / pairs.length >= 0.5 ? 'stands' : 'falls';
    verdicts.push({ id: prop.id, name: prop.name, predicted: pp, agrees: pp === actual, detail: `${small}/${pairs.length} contacts in small-integer ratio` });
  }
  return { pairs: pairs.length, verdicts };
}

function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function smallRatio(a, b, maxTerm) { const g = gcd(a, b); return a / g <= maxTerm && b / g <= maxTerm; }

/** The act of tajriba: look at the settled tower, record it against every claim. */
function recordExperiment(actual, why) {
  const s = state;
  if (!world.isSettled()) { toast('Wait for the tower to settle — an experiment needs a result.', 'bad'); return null; }
  const j = judgeTower(actual);
  if (j.pairs === 0) { toast('Nothing is touching anything. Build first.', 'bad'); return null; }
  const lines = [];
  let gained = 0;
  for (const v of j.verdicts) {
    const r = notebook.observe(v.id, { result: v.agrees ? 'agrees' : 'contradicts',
                                       where: { game: 'abjad-tower', mode: 'mizaj', seed: s.seed }, detail: v.detail });
    gained += r.xp;
    lines.push(`${v.name}: predicted <b>${v.predicted}</b>, it <b>${actual}</b> — ${v.agrees ? 'agrees' : 'contradicts'}${r.changed ? ` → ${r.after}` : ''}`);
  }
  s.log.unshift(`<b>${why}</b> (${j.pairs} contacts) · ` + lines.join(' · '));
  s.log = s.log.slice(0, 6);
  s.experiments = (s.experiments || 0) + 1;
  s.nbGained = (s.nbGained || 0) + gained;
  if (gained) toast(`Notebook: +${gained}`, 'good');
  paintLog(); paintNotebook(); paintHud();
  return j;
}

MODES.mizaj = {
  setup(s) {
    world.setTargetLine(MZ.ring);
    s.budget = null;
    s.placing = true;
    s.peak = 0; s.holdFrom = null; s.experiments = 0; s.nbGained = 0;
    const rnd = mulberry(s.seed);
    // The operative scheme, hidden. Same seed, same scheme, same hand.
    const ts = temperSchemes();
    s.schemeId = ts[Math.floor(rnd() * ts.length)].id;
    s.temperMap = ts.find(t => t.id === s.schemeId).map;
    // A hand of letters, dealt by seed, always with at least one alif.
    const pool = LETTERS.slice();
    s.hand = [LETTERS[0]];
    while (s.hand.length < MZ.hand) s.hand.push(pool[Math.floor(rnd() * pool.length)]);
    s.toPlace = s.hand.length;
    s.instruction = `The letters have natures, and the natures are hidden. Build to the ring from the hand you were dealt, then record what stands. Alif alone may stand on end, and takes no alif on it.`;
    world.camOrbit.target.set(0, 2.0, 0);
    world.camOrbit.dist = 13;
    world.camOrbit.pitch = 0.18;
    proposeClaims();
    $('place-glyph').innerHTML = s.hand.map((l, i) =>
      `<option value="${i}">${l.glyph} · ${l.name} · ${l.abjad}</option>`).join('');
  },
  check(s) {
    const high = world.highestY();
    s.peak = Math.max(s.peak, high);
    // A collapse: the tower had risen, and is now settled well below its peak.
    if (world.isSettled() && s.peak >= 1.6 && high < s.peak - 1.2 && !s.collapsed) {
      s.collapsed = true;
      recordExperiment('falls', 'It fell');
      return { win: false, why: 'The tower fell. The notebook has the result.' };
    }
    if (high >= MZ.ring && world.isSettled()) {
      if (s.holdFrom === null) s.holdFrom = world.time;
      s.hold = world.time - s.holdFrom;
      if (s.hold >= MZ.hold) {
        recordExperiment('stands', 'It stood');
        return { win: true, score: 100 + s.toPlace * 10 + (s.nbGained || 0),
                 why: `It reached the ring and held. ${s.experiments} experiment${s.experiments === 1 ? '' : 's'} recorded.` };
      }
    } else if (high < MZ.ring) { s.holdFrom = null; s.hold = 0; }
    if (s.toPlace <= 0 && world.isSettled() && high < MZ.ring && !s.collapsed) {
      recordExperiment('stands', 'Out of letters; it stands short');
      return { win: false, why: 'Out of letters, and short of the ring. What stood is recorded.' };
    }
    return null;
  },
};

/* ------------------------------------------------- the weight of brackets -- */
// The folio's parts as a block set. The balcony brackets are the only bodies that
// may be fixed in empty air, because in the painting they are carried on nothing.
// Everything else obeys gravity honestly. Reach the turret — which the painting
// makes reachable only by looking — by building out over the void.

const KW = { pad: 2.4, turret: { x: 5.6, y: 3.2 }, brackets: 4, pieces: 16 };

function folioPieces() {
  if (!PALACE) return [];
  const skip = new Set(['folio-full', 'architecture-full', 'balcony-brackets', 'badgir-kiosk', 'cupola']);
  const ps = PALACE.nodes.filter(n => !skip.has(n.id) && n.role !== 'figure');
  const maxA = Math.max(...ps.map(p => p.norm[2] * p.norm[3]));
  // A piece's weight is its share of the page: derivable, deterministic, sayable.
  return ps.map(p => ({ ...p, mass: +(1 + 5 * (p.norm[2] * p.norm[3]) / maxA).toFixed(2) }));
}

MODES.kawabil = {
  setup(s) {
    if (!PALACE) { s.instruction = 'The folio data did not load; this mode needs ../yusuf-ascent/.'; return; }
    world.camOrbit.target.set(2.4, 1.8, 0);
    world.camOrbit.dist = 13; world.camOrbit.pitch = 0.12; world.camOrbit.yaw = 0.02;
    world.setPad(KW.pad);
    world.setTargetLine(KW.turret.y);
    // the turret: fixed, off over the void, the painting's "reachable only by looking"
    s.turret = world.addStatic(`${YA}/assets/regions/badgir-kiosk.jpg`, KW.turret.x, KW.turret.y, 0,
      { w: 1.6, h: 1.4, d: 0.9, tint: 0x2e5f8f });
    const rnd = mulberry(s.seed);
    const deck = folioPieces();
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    s.deck = deck.slice(0, KW.pieces);
    s.bracketsLeft = KW.brackets;
    s.budget = null;
    s.placing = true;
    s.tool = 'piece';
    s.holdFrom = null;
    s.instruction = `Reach the turret over the void. ${KW.brackets} brackets may be fixed in empty air; ` +
                    `every other piece must be carried. Click to drop a piece; switch to Bracket to fix one.`;
  },
  check(s) {
    if (!s.turret) return null;
    // "Rests against the turret": the gap between the block's box and the turret's
    // box is nearly zero. (An earlier test used distance-to-centre < 1.35, which a
    // 1.5-wide block beside a 1.6-wide turret can never satisfy.)
    const near = world.liveBlocks().filter(b => boxGap(b.body, s.turret.body) < 0.12);
    if (near.length && world.isSettled()) {
      if (s.holdFrom === null) s.holdFrom = world.time;
      s.hold = world.time - s.holdFrom;
      if (s.hold >= 2.5) {
        return { win: true, score: 150 + s.bracketsLeft * 60 + s.deck.length * 8,
                 why: `A piece rests against the turret and holds. ${KW.brackets - s.bracketsLeft} bracket(s) used.` };
      }
    } else { s.holdFrom = null; s.hold = 0; }
    if (!s.deck.length && world.isSettled() && !near.length) {
      return { win: false, why: 'Every piece spent, and the turret is still only reachable by looking.' };
    }
    return null;
  },
};

/** Gap between two axis-aligned boxes (0 when touching or overlapping). */
function boxGap(a, b) {
  const ha = a.shapes[0].halfExtents, hb = b.shapes[0].halfExtents;
  const dx = Math.max(0, Math.abs(a.position.x - b.position.x) - (ha.x + hb.x));
  const dy = Math.max(0, Math.abs(a.position.y - b.position.y) - (ha.y + hb.y));
  const dz = Math.max(0, Math.abs(a.position.z - b.position.z) - (ha.z + hb.z));
  return Math.hypot(dx, dy, dz);
}

/** Would a brick spawned at (x, y) overlap any fixed body? Spawning inside one
 *  makes the solver hurl the brick out at several m/s, which reads as a bug and is
 *  really a level-geometry error. Found by tracing a "sliding" piece. */
function spawnBlocked(x, y, hw = BLOCK.w / 2, hh = BLOCK.h / 2) {
  return world.statics.some(st => {
    const h = st.body.shapes[0].halfExtents, q = st.body.position;
    return Math.abs(x - q.x) < hw + h.x + 0.02 && Math.abs(y - q.y) < hh + h.y + 0.02;
  });
}

function placeFolio(ev) {
  const s = state;
  const dir = world.aimRay(ev.clientX, ev.clientY);
  const cam = world.camera.position;
  // Build in the x-y plane at z = 0: intersect the aim ray with that plane.
  if (Math.abs(dir.z) < 1e-4) return;
  const t = (0 - cam.z) / dir.z;
  const px = cam.x + dir.x * t, py = cam.y + dir.y * t;
  if (t < 0 || px < -3 || px > 8 || py < 0 || py > 8) { toast('Aim into the build space.', 'bad'); return; }

  if (s.tool === 'bracket') {
    if (s.bracketsLeft <= 0) { toast('No brackets left. Everything else must be carried.', 'bad'); return; }
    if (spawnBlocked(px, Math.max(0.3, py), 0.75, 0.11)) { toast('A bracket cannot be fixed inside something already fixed.', 'bad'); return; }
    world.addStatic(`${YA}/assets/regions/balcony-brackets.jpg`, px, Math.max(0.3, py), 0);
    s.bracketsLeft--;
    record('folio:bracket', 'a bracket fixed in empty air', 20);
    toast(`Bracket fixed at (${px.toFixed(1)}, ${py.toFixed(1)}) — carried on nothing.`, 'good');
  } else {
    if (!s.deck.length) { toast('No pieces left.', 'bad'); return; }
    const dropY = Math.max(py, 1.2) + 0.9;
    if (spawnBlocked(px, dropY)) { toast('That would spawn inside something fixed. Drop it beside, not into.', 'bad'); return; }
    const p = s.deck.shift();
    world.addImageBlock(p, `${YA}/${p.sprite}`, px, dropY, 0, { mass: p.mass });
    record('folio:' + p.id, p.title, 5);
    toast(`${p.title} — weight ${p.mass} (its share of the page).`);
  }
  paintHud();
}

/* ---------------------------------------------------------------- actions -- */

let armed = 'darb';        // the operation the next click performs

function opCost(id) { return (OPDATA.operations.find(o => o.id === id) || {}).cost || 1; }

function spend(id) {
  if (state.budget === null) return true;
  const c = opCost(id);
  if (state.budget < c) { toast('Not enough operations left.', 'bad'); return false; }
  state.budget -= c;
  return true;
}

function afterOp(id, result) {
  if (!result) return;
  const before = state.snapshotHigh;
  state.log.unshift(result.text);
  state.log = state.log.slice(0, 6);
  paintLog();

  const meta = OPDATA.operations.find(o => o.id === id);
  record('op:' + id, `the ${meta.name}`, 15);

  // Judge the *consequence*, once the world settles — that is the thing worth
  // learning, and it is not knowable at the moment of the click.
  setTimeout(() => {
    const after = world.highestY();
    const drop = before - after;
    if (drop > 1.2) record(`fell:${id}`, `${meta.name} can bring a tower down`, 25);
    if (result.empty) record(`empty:${id}`, `${meta.name} can find nothing to act on`, 10);
    if (id === 'hisab' && result.count > 0) record('hisab:hit', 'a reckoning that lands', 30);
  }, 2600);
}

function doOp(ev) {
  if (state.done) return;
  const id = armed;

  if (state.placing && id === 'place') return;

  if (id === 'darb') {
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.strike(world, { dir: world.aimRay(ev.clientX, ev.clientY) }));
    return;
  }

  if (id === 'inversion') {
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.inversion(world, {}));
    return;
  }

  if (id === 'hisab') {
    const t = parseInt($('hisab-target').value, 10);
    if (!Number.isFinite(t) || t <= 0) { toast('Name a number first.', 'bad'); return; }
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.reckoning(world, { target: t }));
    return;
  }

  if (id === 'ism') {
    const g = $('ism-glyph').value;
    if (!g) { toast('Choose a letter first.', 'bad'); return; }
    if (!spend(id)) return;
    state.snapshotHigh = world.highestY();
    afterOp(id, OPS.invokeName(world, { glyph: g }));
    return;
  }

  // tilasm / khal need a target block
  const hit = world.pick(ev.clientX, ev.clientY);
  if (!hit) { toast('Click a block to target it.', 'bad'); return; }
  record('letter:' + hit.block.letter.glyph, `the letter ${hit.block.letter.glyph}`, 5);
  if (!spend(id)) return;
  state.snapshotHigh = world.highestY();
  afterOp(id, id === 'tilasm'
    ? OPS.talisman(world, { block: hit.block })
    : OPS.doff(world, { block: hit.block }));
}

/* --------------------------------------------------------------- placing -- */

function placeBlock(ev) {
  if (state.toPlace <= 0) { toast('No blocks left.', 'bad'); return; }
  const dir = world.aimRay(ev.clientX, ev.clientY);
  const cam = world.camera.position;

  // Where does the aim ray meet the *ground*? That is the point the player is
  // pointing at. An earlier version solved for y = 8 instead, which is the plane
  // the block is dropped FROM, not the one being aimed at — so blocks landed
  // far out and it read as broken aiming.
  if (dir.y >= -1e-4) { toast('Aim at the ground, not the sky.', 'bad'); return; }
  const t = (0 - cam.y) / dir.y;
  const gx = cam.x + dir.x * t, gz = cam.z + dir.z * t;
  if (Math.hypot(gx, gz) > 5.5) { toast('Too far out — build near the centre.', 'bad'); return; }

  // Drop from just above whatever is already there, so a stack builds rather
  // than a block falling five metres onto its neighbours and scattering them.
  const dropY = Math.max(1.4, world.highestY() + 1.1);
  const mizaj = state.mode === 'mizaj';
  let letter, handIdx = -1;
  if (mizaj) {
    handIdx = parseInt($('place-glyph').value, 10);
    letter = state.hand[handIdx];
    if (!letter) { toast('That letter is already placed.', 'bad'); return; }
  } else {
    letter = letterByGlyph($('place-glyph').value) || LETTERS[0];
  }
  // Alif is singular: the one letter that stands on end, and it takes no alif on
  // it — two alifs make a line, not two. (data/correspondences.json, alif-singular)
  const isAlif = letter.glyph === 'ا';
  if (mizaj && isAlif) {
    const under = world.blockUnder(gx, gz);
    if (under && under.letter.glyph === 'ا') {
      toast('An alif takes no alif. Two alifs do not make two.', 'bad'); return;
    }
  }
  // Alternate orientation each placement, as a real course would.
  const rot = (state.toPlace % 2) ? Math.PI / 2 : 0;
  world.addBlock(letter, gx, dropY, gz, rot,
    mizaj ? { temper: state.temperMap[letter.glyph], upright: isAlif } : {});
  if (mizaj) {
    state.hand[handIdx] = null;
    $('place-glyph').innerHTML = state.hand.map((l, i) => l ?
      `<option value="${i}">${l.glyph} · ${l.name} · ${l.abjad}</option>` : '').join('');
    if (isAlif) record('mizaj:alif-upright', 'an alif standing on end', 10);
  }
  state.toPlace--;
  record('letter:' + letter.glyph, `the letter ${letter.glyph}`, 5);
  paintHud();
}

/* ------------------------------------------------------------------- UI --- */

function toast(msg, kind = '') {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'show ' + kind;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.className = ''), 2600);
}

function paintHud() {
  $('mode-name').textContent = state.modeName;
  $('instruction').textContent = state.instruction;
  $('budget').textContent = state.mode === 'kawabil'
    ? `${state.deck ? state.deck.length : 0} pieces · ${state.bracketsLeft ?? 0} brackets`
    : state.budget === null
      ? (state.toPlace !== undefined ? `${state.toPlace} ${state.mode === 'mizaj' ? 'letters' : 'blocks'}` : '—')
      : `${state.budget} ops`;
  $('height').textContent = world.highestY().toFixed(2) + ' m';
  $('rank').textContent = `${rankFor(tome.xp)} · ${tome.xp} XP`;
  const hold = state.hold ? ` · holding ${state.hold.toFixed(1)}s` : '';
  $('status').textContent = (world.isSettled() ? 'settled' : 'moving') + hold;
}

function paintLog() {
  $('log').innerHTML = state.log.map((l, i) =>
    `<li style="opacity:${1 - i * 0.13}">${l}</li>`).join('');
}

function paintTome() {
  const ops = OPDATA.operations.map(o => {
    const known = tome.discoveries.includes('op:' + o.id);
    return `<div class="tome-op ${known ? '' : 'unknown'}">
      <div class="th"><b>${o.name}</b> <span class="ar">${o.arabic}</span>
        <span class="pill ${o.kind}">${o.kind}</span></div>
      ${known ? `<p>${o.blurb}</p>
        <p class="why">${o.why}</p>
        ${o.quote ? `<blockquote>“${o.quote}”<cite>${o.source}</cite></blockquote>` : ''}`
        : `<p class="dim">Not yet used. Perform it once to record it here.</p>`}
    </div>`;
  }).join('');
  $('tome-ops').innerHTML = ops;
  paintNotebook();
  $('tome-xp').textContent = `${rankFor(tome.xp)} — ${tome.xp} XP, ${tome.discoveries.length} discoveries`;
}

function paintNotebook() {
  if (!notebook || !$('tome-notebook')) return;
  const sum = notebook.summary();
  const qs = Object.keys(sum);
  if (!qs.length) {
    $('tome-notebook').innerHTML = '<p class="dim">Empty. Play Temperament and record an experiment.</p>';
    return;
  }
  const TITLES = { temperament: 'Which letter has which nature?', efficacy: 'Why do letters hold?', rule: 'Rules' };
  $('tome-notebook').innerHTML = qs.map(q => `
    <div class="nb-q"><div class="lab">${TITLES[q] || q}</div>
    ${sum[q].map(c => `<div class="nb-claim"><span class="pill ${c.state}">${c.state}</span>
       <b>${c.text}</b> <span class="pill ${c.kind}">${c.kind}</span>
       <span class="dim">${c.observations.length} observation${c.observations.length === 1 ? '' : 's'}</span>
       <div class="why">${c.source || ''}</div></div>`).join('')}</div>`).join('');
  $('nb-xp').textContent = `${notebook.xp} XP in the notebook`;
}

/* ----------------------------------------------------------------- loop --- */

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  world.step(dt);
  if (state && !state.done) {
    const r = MODES[state.mode].check(state);
    paintHud();
    if (r) {
      state.done = true;
      const s = r.score || 0;
      if (r.win) {
        tome.xp += 20;
        tome.best[state.mode] = Math.max(tome.best[state.mode] || 0, s);
        saveTome();
      }
      $('verdict').className = 'show ' + (r.win ? 'win' : 'lose');
      $('verdict').innerHTML = `<h2>${r.win ? 'Complete' : 'Failed'}</h2>
        <p>${r.why}</p>${r.win ? `<p class="score">${s} points</p>` : ''}
        <button class="btn" id="again">Again</button>
        <button class="btn" id="same">Same tower</button>
        <p class="dim" style="font-family:var(--mono);font-size:.7rem">seed ${state.seed}</p>`;
      $('again').onclick = () => startMode(state.mode);
    $('same').onclick = () => startMode(state.mode, state.seed);
    }
  }
  raf = requestAnimationFrame(frame);
}

/* ----------------------------------------------------------------- boot --- */

function startMode(mode, seed) {
  world.clear();
  const md = OPDATA.modes.find(m => m.id === mode);
  if (seed === undefined) seed = (Math.random() * 1e9) | 0;
  state = {
    mode, modeName: md.name, log: [], done: false, hold: 0, placing: false,
    seed, snapshotHigh: 0,
  };
  history.replaceState(null, '', `?mode=${mode}&seed=${seed}`);
  MODES[mode].setup(state);
  $('verdict').className = '';
  $('place-row').classList.toggle('hidden', !state.placing || mode === 'kawabil');
  $('tool-row').classList.toggle('hidden', mode !== 'kawabil');
  $('mizaj-row').classList.toggle('hidden', mode !== 'mizaj');
  $('ops-block').classList.toggle('hidden', mode === 'kawabil' || mode === 'mizaj');
  if (mode !== 'mizaj') {
    $('place-glyph').innerHTML = LETTERS.map(l =>
      `<option value="${l.glyph}">${l.glyph} · ${l.name} · ${l.abjad}</option>`).join('');
  }
  for (const b of document.querySelectorAll('#modes .btn'))
    b.classList.toggle('active', b.dataset.mode === mode);
  paintHud(); paintLog();
  toast(md.blurb, '');
}

(async function main() {
  const [lj, oj, pj, cj] = await Promise.all([
    fetch(`./data/letters.json?${V}`).then(r => r.json()),
    fetch(`./data/operations.json?${V}`).then(r => r.json()),
    fetch(`${YA}/data/palace.json?${V}`).then(r => r.json()).catch(() => null),
    fetch(`./data/correspondences.json?${V}`).then(r => r.json()),
  ]);
  LETTERS = lj.letters;
  OPDATA = oj;
  PALACE = pj;
  CORR = cj;
  tome = loadTome();
  notebook = new Notebook();

  world = new World($('stage'));
  addEventListener('resize', () => world.resize());

  // Operation buttons
  $('ops').innerHTML = OPDATA.operations.map(o =>
    `<button class="btn op" data-op="${o.id}" title="${o.blurb}">
       ${o.name} <small>${o.cost}</small></button>`).join('');
  for (const b of document.querySelectorAll('#ops .op')) {
    b.onclick = () => {
      armed = b.dataset.op;
      for (const x of document.querySelectorAll('#ops .op')) x.classList.toggle('active', x === b);
      $('ism-row').classList.toggle('hidden', armed !== 'ism');
      $('hisab-row').classList.toggle('hidden', armed !== 'hisab');
      const meta = OPDATA.operations.find(o => o.id === armed);
      toast(`${meta.name} — ${meta.blurb}`);
    };
  }
  document.querySelector('#ops .op').click();

  // Letter selectors
  const opts = LETTERS.map(l =>
    `<option value="${l.glyph}">${l.glyph} · ${l.name} · ${l.abjad}</option>`).join('');
  $('ism-glyph').innerHTML = opts;
  $('place-glyph').innerHTML = opts;

  // Modes
  $('modes').innerHTML = OPDATA.modes.map(m =>
    `<button class="btn" data-mode="${m.id}">${m.name} <span class="ar">${m.arabic}</span></button>`).join('');
  for (const b of document.querySelectorAll('#modes .btn')) b.onclick = () => startMode(b.dataset.mode);

  // Canvas interaction: drag orbits, click acts.
  const cv = world.renderer.domElement;
  let drag = false, moved = 0, lx = 0, ly = 0;
  cv.addEventListener('pointerdown', e => { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    world.camOrbit.yaw -= dx * 0.005;
    world.camOrbit.pitch = Math.max(-0.15, Math.min(1.2, world.camOrbit.pitch - dy * 0.004));
  });
  cv.addEventListener('pointerup', e => {
    drag = false;
    if (moved > 6) return;
    if (state.mode === 'kawabil') placeFolio(e);
    else if (state.placing) placeBlock(e); else doOp(e);
  });
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    world.camOrbit.dist = Math.max(7, Math.min(34, world.camOrbit.dist + e.deltaY * 0.012));
  }, { passive: false });

  for (const b of document.querySelectorAll('#tool-row .btn')) {
    b.onclick = () => {
      state.tool = b.dataset.tool;
      for (const x of document.querySelectorAll('#tool-row .btn')) x.classList.toggle('active', x === b);
      toast(state.tool === 'bracket'
        ? 'Bracket: fixed in empty air. The only thing here that is carried on nothing.'
        : 'Piece: dropped where you click, and it falls unless something carries it.');
    };
  }
  // By hand: whatever is settled now, stands. (A fall is recorded by the mode itself.)
  $('test-tower').onclick = () => recordExperiment('stands', 'Recorded by hand');
  $('reset-notebook').onclick = () => {
    if (!confirm('Erase the notebook — every claim and observation, in every game?')) return;
    notebook.erase(); proposeClaims(); paintNotebook();
  };
  $('tome-toggle').onclick = () => $('tome').classList.toggle('open');
  $('tome-close').onclick = () => $('tome').classList.remove('open');
  $('reset-tome').onclick = () => {
    if (!confirm('Erase the Tome — every discovery and all XP?')) return;
    tome = { seenOps: {}, seenLetters: {}, discoveries: [], xp: 0, best: {} };
    saveTome(); paintTome(); paintHud();
  };

  paintTome();
  const q = new URLSearchParams(location.search);
  const m0 = OPDATA.modes.some(m => m.id === q.get('mode')) ? q.get('mode') : 'hadm';
  startMode(m0, q.get('seed') ? parseInt(q.get('seed'), 10) : undefined);
  last = performance.now();
  raf = requestAnimationFrame(frame);

  window.__abjad = { world, OPS, get state() { return state; }, get tome() { return tome; },
                     get notebook() { return notebook; }, CORR, TEMPER, judgeTower, recordExperiment,
                     LETTERS, startMode, findRuns: t => OPS.findRuns(world, t), selfTestMizaj };
})();

/* ------------------------------------------------------------- self-test -- */
// The temperament mechanic, checked numerically — the Yūsuf Ascent pattern of a
// self-test on the debug handle. Steps the world itself (rAF is throttled while
// a tool call is in flight, so wall-clock waits under-simulate; DECISIONS.md
// 2026-09-02). Builds three six-block columns under the operative scheme —
// complementary, opposed, same-natured — and reports what stood. Expected: the
// complementary and same columns stand at ~2.74; the opposed column shears
// itself apart. Restarts the current round afterwards. Measured 2026-09-03:
//   comp high 2.74 spread 0.01 · same 2.75 / 0.00 · opposed 0.78 / 6.59.
function selfTestMizaj() {
  const scheme = temperSchemes().find(s => s.id === (state && state.schemeId)) || temperSchemes()[0];
  const live = scheme.map;
  const L = LETTERS.filter(l => l.glyph !== 'ا');
  const pair = rel => { for (const a of L) for (const b of L) if (a !== b && TEMPER.relation(live[a.glyph], live[b.glyph]) === rel) return [a, b]; };
  const build = p => { world.clear(); for (let i = 0; i < 6; i++) { const l = p[i % 2]; world.addBlock(l, 0, 0.26 + i * 0.52, 0, (i % 2) ? Math.PI / 2 : 0, { temper: live[l.glyph] }); } };
  const measure = () => { const xs = world.liveBlocks().map(b => b.body.position.x); return { high: +world.highestY().toFixed(2), spread: +(Math.max(...xs) - Math.min(...xs)).toFixed(2), contacts: world.contactPairs().length, settled: world.isSettled() }; };
  const out = { scheme: scheme.id };
  for (const [k, p] of [['complementary', pair('complementary')], ['opposed', pair('opposed')], ['same', [L[3], L[3]]]]) {
    out[k] = { pair: p.map(l => `${l.glyph}:${live[l.glyph]}`).join(' ') };
    build(p); for (let i = 0; i < 600; i++) world.step(1 / 60);
    Object.assign(out[k], measure());
  }
  out.pass = out.complementary.high > 2.5 && out.same.high > 2.5 && out.opposed.high < 1.5
          && out.complementary.contacts >= 5;
  if (state) startMode(state.mode, state.seed);
  return out;
}
(function noop() {
})();
