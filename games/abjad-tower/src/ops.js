// ops.js — the six operations.
//
// Each is a pure function of (world, params) that mutates the physics world and
// returns a short account of what it did, which the Tome records. The account
// matters as much as the effect: this game's scoring rewards *understanding what
// happened*, following the "observe to learn" pattern from AlchemyBlockInvaders.
//
// Grounding for each lives in data/operations.json and is shown at the point of
// use, not in an About page.

import * as CANNON from '../vendor/cannon-es.js';
import { BLOCK } from './world.js?v=6';

const V = (x, y, z) => new CANNON.Vec3(x, y, z);

/* -------------------------------------------------------------- ḍarb ------ */

export function strike(world, { dir, power = 26 }) {
  const cam = world.camera.position;
  const body = new CANNON.Body({
    mass: 6,
    shape: new CANNON.Sphere(0.32),
    material: world.mat,
    position: V(cam.x, cam.y, cam.z),
  });
  body.velocity.set(dir.x * power, dir.y * power, dir.z * power);
  world.world.addBody(body);
  world.addProjectile(body, 0.32);
  return {
    kind: 'strike',
    text: 'A stone, thrown. No name, no intention, no correspondence — only mass and speed.',
  };
}

/* ------------------------------------------------------------- ṭilasm ----- */

export function talisman(world, { block, delay = 1.2, impulse = 34 }) {
  if (!block || !block.alive) return null;
  block.mesh.material.forEach?.(m => (m.emissive?.setHex?.(0x8a6a1a)));
  if (Array.isArray(block.mesh.material)) {
    block.mesh.material.forEach(m => m.emissive && m.emissive.setHex(0x8a6a1a));
  }
  const at = world.time + delay;
  world.pending.push({
    at,
    run: () => {
      if (!block.alive) return;
      // Force arrives from INSIDE the structure, not from the player's side —
      // the entry says the talisman exerts force through the intermediate realm.
      const p = block.body.position;
      for (const b of world.liveBlocks()) {
        const d = b.body.position.vsub(p);
        const r = d.length();
        if (r > 3.4) continue;
        const f = impulse * (1 - r / 3.4) / Math.max(0.35, r);
        b.body.applyImpulse(V(d.x * f, d.y * f + impulse * 0.14, d.z * f), b.body.position);
        b.body.wakeUp();
      }
      world._burst(block.mesh.position, block.letter);
    },
  });
  return {
    kind: 'talisman',
    text: `Inscribed on ${block.letter.glyph}. The force will arrive in ${delay.toFixed(1)}s — ` +
          `from inside the structure, not from where you stand.`,
  };
}

/* ---------------------------------------------------------------- ism ----- */

export function invokeName(world, { glyph, factor = 0.05, seconds = 6 }) {
  const hit = world.liveBlocks().filter(b => b.letter.glyph === glyph);
  if (!hit.length) {
    return { kind: 'ism', text: `No ${glyph} stands in this tower. The name finds nothing to lift.`,
             empty: true };
  }
  for (const b of hit) {
    b.body.mass = Math.max(0.05, b.baseMass * factor);
    b.body.updateMassProperties();
    b.body.wakeUp();
    b.massUntil = world.time + seconds;
  }
  // Wake everything: the tower's load path just changed.
  for (const b of world.liveBlocks()) b.body.wakeUp();
  return {
    kind: 'ism',
    text: `${hit.length} × ${glyph} lifted toward weightlessness for ${seconds}s. ` +
          `Whatever they were carrying, they are not carrying now.`,
    count: hit.length,
  };
}

/* -------------------------------------------------------------- ḥisāb ---- */

/** Vertical runs of touching blocks whose abjad values sum exactly to `target`. */
export function findRuns(world, target) {
  const live = world.liveBlocks();
  // Group into columns by (x,z) proximity, then sort each by height.
  const cols = [];
  for (const b of live) {
    const p = b.body.position;
    let col = cols.find(c => Math.abs(c.x - p.x) < BLOCK.w * 0.75 &&
                             Math.abs(c.z - p.z) < BLOCK.d * 0.9);
    if (!col) { col = { x: p.x, z: p.z, items: [] }; cols.push(col); }
    col.items.push(b);
  }
  const runs = [];
  for (const c of cols) {
    c.items.sort((a, b) => a.body.position.y - b.body.position.y);
    for (let i = 0; i < c.items.length; i++) {
      let sum = 0;
      for (let j = i; j < c.items.length; j++) {
        // Runs must be contiguous in space, not merely in the list.
        if (j > i) {
          const gap = c.items[j].body.position.y - c.items[j - 1].body.position.y;
          if (gap > BLOCK.h * 1.9) break;
        }
        sum += c.items[j].letter.abjad;
        // A run must be at least two letters. The source speaks of composing
        // WORDS whose abjad sum equals a number — and a one-block "run" would
        // make the operation trivial, since every letter's own value is printed
        // on its face.
        if (sum === target && j > i) runs.push(c.items.slice(i, j + 1));
        if (sum > target) break;
      }
    }
  }
  return runs;
}

export function reckoning(world, { target }) {
  const runs = findRuns(world, target);
  if (!runs.length) {
    return { kind: 'hisab', empty: true,
             text: `Nothing in the tower sums to ${target}. The reckoning finds no purchase.` };
  }
  const seen = new Set();
  let n = 0;
  for (const run of runs) {
    for (const b of run) {
      if (seen.has(b) || !b.alive) continue;
      seen.add(b);
      world.removeBlock(b);
      n++;
    }
  }
  for (const b of world.liveBlocks()) b.body.wakeUp();
  const words = runs.map(r => r.map(b => b.letter.glyph).join('')).slice(0, 3);
  return {
    kind: 'hisab', count: n,
    text: `${runs.length} run(s) summing to ${target} came apart — ${words.join(', ')}` +
          `${runs.length > 3 ? ' …' : ''}. ${n} block(s) gone.`,
  };
}

/* --------------------------------------------------------------- khalʿ ---- */

export function doff(world, { block, seconds = 3 }) {
  if (!block || !block.alive) return null;
  block.body.collisionResponse = false;
  block.ghostUntil = world.time + seconds;
  const mats = Array.isArray(block.mesh.material) ? block.mesh.material : [block.mesh.material];
  mats.forEach(m => { m.transparent = true; m.opacity = 0.28; });
  for (const b of world.liveBlocks()) b.body.wakeUp();
  return {
    kind: 'khal',
    text: `${block.letter.glyph} doffs its body for ${seconds}s. Watch what it was holding — ` +
          `and watch where it is when the body returns.`,
  };
}

/* ----------------------------------------------------------- inversion ---- */

export function inversion(world, { seconds = 8 }) {
  const live = world.liveBlocks();
  const light = live.filter(b => b.letter.class === 'nurani');
  const dark = live.filter(b => b.letter.class === 'zulmani');
  if (!light.length || !dark.length) {
    return { kind: 'inversion', empty: true,
             text: 'Inversion needs both orders of letter present. This tower has only one.' };
  }
  const meanL = light.reduce((s, b) => s + b.baseMass, 0) / light.length;
  const meanD = dark.reduce((s, b) => s + b.baseMass, 0) / dark.length;
  for (const b of light) {
    b.body.mass = meanD; b.body.updateMassProperties();
    b.massUntil = world.time + seconds; b.body.wakeUp();
  }
  for (const b of dark) {
    b.body.mass = meanL; b.body.updateMassProperties();
    b.massUntil = world.time + seconds; b.body.wakeUp();
  }
  return {
    kind: 'inversion',
    text: `Light and dark trade weight for ${seconds}s — ${light.length} against ${dark.length}. ` +
          `Every load-bearing assumption in the tower just reversed.`,
  };
}

export const OPS = { strike, talisman, invokeName, reckoning, doff, inversion };
