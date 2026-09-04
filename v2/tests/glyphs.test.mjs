// glyphs.test.mjs — the drawn correspondence signs, checked without a browser.
//
//   node v2/tests/glyphs.test.mjs
//
// Canvas is not available in Node, so a recording context stands in for it: every
// path call is logged, and the test asks the questions a viewer would — does every
// sign exist, does each one actually put marks down, and do those marks stay inside
// the circle the caller gave it.

import assert from 'node:assert/strict';
import { GLYPHS, FAMILIES, byId, drawGlyph } from '../apps/shared/glyphs.js';

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ok  ' + name); };

/** A 2D context that records instead of drawing. */
function recorder() {
  const log = [];
  const pts = [];
  const g = {
    strokeStyle: '', fillStyle: '', lineWidth: 0, lineCap: '', lineJoin: '',
    save() { log.push('save'); }, restore() { log.push('restore'); },
    beginPath() { log.push('beginPath'); }, closePath() { log.push('closePath'); },
    moveTo(x, y) { log.push('moveTo'); pts.push([x, y]); },
    lineTo(x, y) { log.push('lineTo'); pts.push([x, y]); },
    bezierCurveTo(a, b, c, d, x, y) { log.push('bezier'); pts.push([x, y]); }, // endpoint only: control points overshoot by nature
    arc(x, y, r, a0, a1) {
      log.push('arc');
      // the arc's own extreme points, not its centre — the centre may sit outside
      for (const t of [a0, a1, (a0 + a1) / 2]) pts.push([x + r * Math.cos(t), y + r * Math.sin(t)]);
    },
    stroke() { log.push('stroke'); }, fill() { log.push('fill'); },
    setTransform() {}, clearRect() {},
  };
  return { g, log, pts };
}

const STYLE = { ink: '#000', fill: 'rgba(0,0,0,.1)', weight: 1.5 };

test('there are twenty-six signs in four families, every id unique', () => {
  assert.equal(GLYPHS.length, 26);
  assert.equal(new Set(GLYPHS.map(g => g.id)).size, 26);
  for (const g of GLYPHS) assert.ok(FAMILIES[g.family], `${g.id}: unknown family ${g.family}`);
  assert.deepEqual(
    Object.fromEntries(Object.keys(FAMILIES).map(f => [f, GLYPHS.filter(g => g.family === f).length])),
    { element: 4, principle: 3, planet: 7, zodiac: 12 },
  );
});

test('every sign carries a name and its Arabic', () => {
  for (const g of GLYPHS) {
    assert.ok(g.name && g.name.length > 1, g.id);
    assert.ok(/[؀-ۿ]/.test(g.arabic), `${g.id}: no Arabic`);
  }
});

test('every sign puts marks down, and strokes them', () => {
  for (const g of GLYPHS) {
    const { g: ctx, log } = recorder();
    assert.equal(drawGlyph(ctx, g.id, 50, 50, 20, STYLE), true);
    assert.ok(log.includes('stroke'), `${g.id}: nothing stroked`);
    assert.ok(log.filter(l => l === 'moveTo' || l === 'arc').length >= 1, `${g.id}: no path`);
    assert.equal(log[0], 'save'); assert.equal(log.at(-1), 'restore');
  }
});

test('every sign stays inside the circle it was given (with an engraver\'s margin)', () => {
  const cx = 100, cy = 100, r = 40, margin = 1.35;
  for (const g of GLYPHS) {
    const { g: ctx, pts } = recorder();
    drawGlyph(ctx, g.id, cx, cy, r, STYLE);
    for (const [x, y] of pts) {
      const d = Math.hypot(x - cx, y - cy) / r;
      assert.ok(d <= margin, `${g.id}: a point lies ${d.toFixed(2)}r from centre`);
    }
  }
});

test('the drawing scales: doubling r doubles every distance from centre', () => {
  for (const g of GLYPHS) {
    const a = recorder(), b = recorder();
    drawGlyph(a.g, g.id, 0, 0, 10, STYLE);
    drawGlyph(b.g, g.id, 0, 0, 20, STYLE);
    assert.equal(a.pts.length, b.pts.length, g.id);
    for (let i = 0; i < a.pts.length; i++) {
      assert.ok(Math.abs(Math.hypot(...a.pts[i]) * 2 - Math.hypot(...b.pts[i])) < 1e-6, `${g.id}: point ${i} does not scale`);
    }
  }
});

test('the line weight scales with the radius', () => {
  const a = recorder(), b = recorder();
  drawGlyph(a.g, 'saturn', 0, 0, 12, STYLE); drawGlyph(b.g, 'saturn', 0, 0, 24, STYLE);
  assert.ok(b.g.lineWidth > a.g.lineWidth);
});

test('an unknown sign draws nothing and says so', () => {
  const { g, log } = recorder();
  assert.equal(drawGlyph(g, 'pluto', 0, 0, 10, STYLE), false);
  assert.equal(log.length, 0);
  assert.equal(byId.pluto, undefined);
});

test('the four elements are the ones the engine\'s materials are named by', () => {
  for (const m of ['fire', 'air', 'water', 'earth']) assert.ok(byId[m], m);
});

console.log(`\n${n} glyph tests passed`);
