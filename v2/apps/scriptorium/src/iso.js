// iso.js — the consequence renderer, in two hands.
//
// Draws a World on an isometric canvas, and draws an EFFECT LIST over it. It is
// deliberately separate from the app: the effect list is the engine's own output
// (vm.run returns exactly what it applied), so any v2 app can render a preview by
// handing this the same array, and no app can invent a consequence the engine did
// not produce.
//
// TWO STYLES, SWITCHABLE, BOTH SHIPPED
// ------------------------------------
// The first build of this renderer drew flat-shaded boxes on a dark ground with a
// system font, and the four elements were Unicode triangles with a note apologising
// for them. That is legible and it is not what this project is for. Ted's brief asks
// for graphics grounded in medieval and Renaissance depiction — woodcut, manuscript,
// the engraved page — and the letters ARE the game, so they should be the most
// considered thing on screen. Rather than pick, both hands are here and a toggle in
// every app switches them, so the choice can be made by looking:
//
//   LAPIS   the original: dark ground, lapis and gold, flat shade. Reads like a
//           night table. Kept unchanged so nothing is lost.
//   INK     paper ground, ink outline, HATCHED shading on the walls of each block
//           the way an engraver turns a form, a naskh-weight letter in ink, and the
//           four elements drawn as the alchemical triangles they actually are —
//           bar and all — rather than substituted with solid-against-hollow.
//
// The preference persists in localStorage under `turka.v2.style`. Every mark in the
// preview language (outline · arrow · tie · break) is defined in both palettes, so
// switching never changes what a mark MEANS, only how it is drawn.
//
// THE VISUAL LANGUAGE FOR PREDICTED CONSEQUENCE
// ---------------------------------------------
// Four marks, and nothing else:
//
//   OUTLINE   a cell the program will occupy or change
//   ARROW     something moves: from → to (pour, fall)
//   TIE       two cells become one body (join, bind)
//   BREAK     a bond refused or cut, drawn as a gap with a slash
//
// A fifth mark would mean the model grew a concept, and that is the moment to
// reconsider the model rather than the legend.

import { drawGlyph } from '../../shared/glyphs.js';

export const STYLES = {
  lapis: {
    id: 'lapis', name: 'Lapis', blurb: 'the night table — dark ground, lapis and gold',
    bg: '#171620', grid: 'rgba(241,218,193,.10)', ink: 'rgba(0,0,0,.35)',
    outline: '#e8c86a', move: '#e8c86a', tie: '#4d7fd6', brk: '#c06523', cursor: '#2e8f8f',
    label: '#e8c86a',
    material: {
      stone: '#8d8577', earth: '#6d5b43', water: '#3f6fa8',
      fire: '#c0522a', air: '#b8a24a', letter: '#d8c49a',
    },
    letterInk: '#241c10', letterFont: '"Segoe UI","Noto Naskh Arabic",serif',
    hatch: false, vignette: false,
  },
  ink: {
    id: 'ink', name: 'Ink', blurb: 'the engraved page — paper, ink line, hatched shade',
    bg: '#efe4cf', grid: 'rgba(43,33,22,.10)', ink: '#2b2116',
    outline: '#8c2f1b', move: '#8c2f1b', tie: '#1f3d6b', brk: '#8c2f1b', cursor: '#2e6b5f',
    label: '#2b2116',
    material: {
      stone: '#d9cdb4', earth: '#b8a17c', water: '#b9c8d2',
      fire: '#e0b08f', air: '#e6dcbf', letter: '#f4ecd8',
    },
    // Amiri (SIL OFL) is fetched at runtime from Google Fonts by the viewer's own
    // browser -- nothing is vendored -- then the naskh faces Windows already ships,
    // then whatever serif the machine has. Correct everywhere, calligraphic where
    // it can be. Vendoring the font is the offline-proof upgrade and is a download.
    letterInk: '#1a130c', letterFont: '"Amiri","Scheherazade New","Noto Naskh Arabic","Arabic Typesetting","Traditional Arabic","Times New Roman",serif',
    hatch: true, vignette: true,
  },
};

const STYLE_KEY = 'turka.v2.style';
export function currentStyle() {
  try { const s = localStorage.getItem(STYLE_KEY); if (s && STYLES[s]) return s; } catch { /* fine */ }
  return 'lapis';
}
export function setStyle(id) {
  try { localStorage.setItem(STYLE_KEY, id); } catch { /* fine */ }
}

/** Kept for callers that import it; it is the LAPIS palette, unchanged. */
export const PALETTE = {
  gold: '#e8c86a', lapis: '#4d7fd6', verm: '#c06523', turq: '#2e8f8f',
  paper: '#f1dac1', dim: '#8b8378', bg: '#171620',
  material: STYLES.lapis.material,
};

const TW = 34, TH = 18, TZ = 26;   // tile width, tile depth, cube height

export class Iso {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.origin = { x: 0, y: 0 };
    this.scale = 1;
    this.styleId = currentStyle();
    this.onStyle = null;
    // THE CAMERA. Ted's words: "I want a lot more controls for rotating the camera
    // and understanding where the cursor is." So: a quarter-turn rotation (four
    // views of the same world), a zoom on top of the automatic framing, and a pan.
    // All three are applied in project() and undone in unproject(), so every app's
    // click-to-cell mapping keeps working without knowing the camera moved.
    this.turn = 0;               // 0..3 quarter turns, counter-clockwise seen from above
    this.zoom = 1;               // multiplies the framed scale
    this.pan = { x: 0, y: 0 };   // screen pixels
    this.onCamera = null;        // called after any camera change, so the app redraws
  }

  /** World (x, z) → rotated (x', z') for the current quarter turn. */
  _rot(x, z) {
    switch (this.turn & 3) {
      case 1: return [-z, x];
      case 2: return [-x, -z];
      case 3: return [z, -x];
      default: return [x, z];
    }
  }
  /** Rotated (x', z') → world (x, z). */
  _unrot(rx, rz) {
    switch (this.turn & 3) {
      case 1: return [rz, -rx];
      case 2: return [-rx, -rz];
      case 3: return [-rz, rx];
      default: return [rx, rz];
    }
  }
  get k() { return this.scale * this.zoom; }

  rotate(quarterTurns) { this.turn = (this.turn + quarterTurns + 4) & 3; this._camera(); }
  zoomBy(f) { this.zoom = Math.max(0.35, Math.min(4, this.zoom * f)); this._camera(); }
  panBy(dx, dy) { this.pan.x += dx; this.pan.y += dy; this._camera(); }
  resetCamera() { this.turn = 0; this.zoom = 1; this.pan = { x: 0, y: 0 }; this._camera(); }
  _camera() { if (this.onCamera) this.onCamera(); }

  /**
   * Wire a camera toolbar into `el` and the keyboard/wheel/drag onto the canvas.
   * Every control is also written out in words in the How-to-play panel that
   * each app carries (CLAUDE.md house rule): this is the mechanism, not the
   * explanation.
   *
   *   buttons   ⟲ ⟳ turn a quarter   + − zoom   ⌂ reset
   *   keys      Q / E turn   + / − (or = / -) zoom   arrows pan   R reset camera
   *   mouse     wheel zooms   right-drag (or shift-drag) pans
   */
  bindCamera(el, onCamera) {
    if (onCamera) this.onCamera = onCamera;
    if (el) {
      el.innerHTML = [
        ['turn-l', '⟲', 'Turn the world a quarter to the left (Q)'],
        ['turn-r', '⟳', 'Turn the world a quarter to the right (E)'],
        ['zoom-in', '+', 'Zoom in (+ or =)'],
        ['zoom-out', '−', 'Zoom out (−)'],
        ['reset', '⌂', 'Reset the camera (R)'],
      ].map(([id, t, title]) => `<button class="btn cam" data-cam="${id}" title="${title}">${t}</button>`).join('')
        + `<span class="cam-view" id="cam-view"></span>`;
      for (const b of el.querySelectorAll('[data-cam]')) b.onclick = () => this._cam(b.dataset.cam);
      const prev = this.onCamera;
      this.onCamera = () => { this._paintView(el); if (prev) prev(); };
      this._paintView(el);
    }
    const cv = this.cv;
    cv.addEventListener('wheel', ev => { ev.preventDefault(); this.zoomBy(ev.deltaY < 0 ? 1.12 : 1 / 1.12); }, { passive: false });
    let drag = null;
    cv.addEventListener('mousedown', ev => { if (ev.button === 2 || ev.shiftKey) { drag = { x: ev.clientX, y: ev.clientY }; ev.preventDefault(); } });
    addEventListener('mousemove', ev => { if (!drag) return; this.panBy(ev.clientX - drag.x, ev.clientY - drag.y); drag = { x: ev.clientX, y: ev.clientY }; });
    addEventListener('mouseup', () => { drag = null; });
    cv.addEventListener('contextmenu', ev => ev.preventDefault());
    addEventListener('keydown', ev => {
      if (ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
      const k = ev.key;
      if (k === 'q' || k === 'Q') this.rotate(1);
      else if (k === 'e' || k === 'E') this.rotate(-1);
      else if (k === '+' || k === '=') this.zoomBy(1.15);
      else if (k === '-' || k === '_') this.zoomBy(1 / 1.15);
      else if (k === 'r' || k === 'R') this.resetCamera();
      else if (k === 'ArrowLeft') this.panBy(40, 0);
      else if (k === 'ArrowRight') this.panBy(-40, 0);
      else if (k === 'ArrowUp') this.panBy(0, 40);
      else if (k === 'ArrowDown') this.panBy(0, -40);
      else return;
      ev.preventDefault();
    });
  }
  _cam(id) {
    if (id === 'turn-l') this.rotate(1);
    else if (id === 'turn-r') this.rotate(-1);
    else if (id === 'zoom-in') this.zoomBy(1.15);
    else if (id === 'zoom-out') this.zoomBy(1 / 1.15);
    else if (id === 'reset') this.resetCamera();
  }
  _paintView(el) {
    const v = el.querySelector('#cam-view');
    if (!v) return;
    const names = ['from the south-east', 'from the south-west', 'from the north-west', 'from the north-east'];
    v.textContent = `${names[this.turn & 3]} · ${Math.round(this.zoom * 100)}%`;
  }

  get S() { return STYLES[this.styleId]; }

  /** Switch hands. Persists, and calls `onStyle` so the app can redraw and relabel. */
  setStyle(id) {
    if (!STYLES[id]) return;
    this.styleId = id;
    setStyle(id);
    if (this.onStyle) this.onStyle(id);
  }
  toggleStyle() { this.setStyle(this.styleId === 'ink' ? 'lapis' : 'ink'); }

  /** Wire a button: it shows the OTHER hand's name, and switches on click. */
  bindStyleToggle(button) {
    if (!button) return;
    const paint = () => {
      const other = STYLES[this.styleId === 'ink' ? 'lapis' : 'ink'];
      button.textContent = `Draw in ${other.name}`;
      button.title = other.blurb;
      document.documentElement.dataset.hand = this.styleId;
    };
    button.onclick = () => { this.toggleStyle(); paint(); };
    const prev = this.onStyle;
    this.onStyle = id => { paint(); if (prev) prev(id); };
    paint();
  }

  resize() {
    const r = this.cv.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.cv.width = Math.max(1, r.width * dpr);
    this.cv.height = Math.max(1, r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = r.width; this.h = r.height;
  }

  /** World coordinates → screen, through the camera (turn, zoom, pan). */
  project(x, y, z) {
    const [rx, rz] = this._rot(x, z);
    const k = this.k;
    return {
      x: this.origin.x + this.pan.x + (rx - rz) * (TW / 2) * k,
      y: this.origin.y + this.pan.y + (rx + rz) * (TH / 2) * k - y * TZ * k,
    };
  }

  /** Screen → the world cell at height y under the pointer, through the camera. */
  unproject(sx, sy, y = 0) {
    const k = this.k;
    const px = (sx - this.origin.x - this.pan.x) / k;
    const py = (sy - this.origin.y - this.pan.y + y * TZ * k) / k;
    const a = px / (TW / 2), b = py / (TH / 2);
    const rx = Math.round((a + b) / 2), rz = Math.round((b - a) / 2);
    const [x, z] = this._unrot(rx, rz);
    return [x, y, z];
  }

  /** The screen-space direction in which words run (westward, −x), for the compass. */
  writingDirection() {
    const o = this.project(0, 0, 0), w = this.project(-1, 0, 0);
    const dx = w.x - o.x, dy = w.y - o.y, n = Math.hypot(dx, dy) || 1;
    return { dx: dx / n, dy: dy / n };
  }

  /** Frame the world so its occupied cells sit in the middle of the canvas. */
  frame(world, extra = []) {
    const pts = [...world.list().map(c => [c.x, c.y, c.z]), ...extra];
    if (!pts.length) pts.push([0, 0, 0]);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    // Fit at zoom 1 with no pan; the camera's zoom and pan are applied on top of
    // this fit in project(), so turning the world re-fits it and zooming does not.
    const zoom = this.zoom, pan = this.pan;
    this.origin = { x: 0, y: 0 }; this.scale = 1; this.zoom = 1; this.pan = { x: 0, y: 0 };
    for (const [x, y, z] of pts) {
      const p = this.project(x, y, z);
      minX = Math.min(minX, p.x - TW); maxX = Math.max(maxX, p.x + TW);
      minY = Math.min(minY, p.y - TZ); maxY = Math.max(maxY, p.y + TH + TZ);
    }
    const sx = (this.w - 40) / Math.max(1, maxX - minX);
    const sy = (this.h - 40) / Math.max(1, maxY - minY);
    // The floor was 0.45 and the ceiling 1.35; small boards sat as a thumbnail in
    // the middle of a wide stage. A higher ceiling lets a six-cell puzzle fill the
    // frame, which is the only way its letters can be read as letters.
    this.scale = Math.max(0.45, Math.min(2.4, Math.min(sx, sy)));
    this.origin = {
      x: this.w / 2 - ((minX + maxX) / 2) * this.scale,
      y: this.h / 2 - ((minY + maxY) / 2) * this.scale,
    };
    this.zoom = zoom; this.pan = pan;
  }

  clear() {
    const g = this.ctx, S = this.S;
    g.fillStyle = S.bg;
    g.fillRect(0, 0, this.w, this.h);
    if (S.vignette) {
      // Paper is never one flat tone; a faint darkening toward the edges reads as
      // a page rather than a colour.
      const v = g.createRadialGradient(this.w / 2, this.h / 2, Math.min(this.w, this.h) * 0.25,
                                       this.w / 2, this.h / 2, Math.max(this.w, this.h) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, 'rgba(60,40,20,.16)');
      g.fillStyle = v;
      g.fillRect(0, 0, this.w, this.h);
    }
  }

  /** A faint ground lattice, so an empty world is still a place. */
  grid(radius = 5) {
    const g = this.ctx;
    g.strokeStyle = this.S.grid;
    g.lineWidth = 1;
    for (let i = -radius; i <= radius; i++) {
      const a = this.project(i, 0, -radius), b = this.project(i, 0, radius);
      const c = this.project(-radius, 0, i), d = this.project(radius, 0, i);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(d.x, d.y); g.stroke();
    }
    this.compass(radius);
  }

  /**
   * THE COMPASS. Words run westward (-x): a program written at a cursor lays its
   * letters out in that direction, and bonds form along it. When the camera turns
   * the arrow turns with the world, so the player always knows which way a word
   * will go. Drawn on the floor at the near corner of the grid.
   */
  compass(radius = 5) {
    const g = this.ctx, S = this.S, k = this.k;
    const at = this.project(radius + 0.5, 0, radius + 0.5);
    const { dx, dy } = this.writingDirection();
    const L = 34 * Math.max(0.6, Math.min(1.6, k));
    const x0 = at.x, y0 = at.y, x1 = x0 + dx * L, y1 = y0 + dy * L;
    g.save();
    g.strokeStyle = S.cursor; g.fillStyle = S.cursor; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    // arrowhead
    const ang = Math.atan2(dy, dx);
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x1 - 9 * Math.cos(ang - 0.45), y1 - 9 * Math.sin(ang - 0.45));
    g.lineTo(x1 - 9 * Math.cos(ang + 0.45), y1 - 9 * Math.sin(ang + 0.45));
    g.closePath(); g.fill();
    g.font = '10px "Inter","Segoe UI",system-ui,sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'top';
    g.fillText('words run this way', (x0 + x1) / 2, Math.max(y0, y1) + 6);
    g.restore();
  }

  /* --------------------------------------------------------------- cubes -- */

  _face(pts, fill, hatchAngle = null, density = 1) {
    const g = this.ctx, S = this.S;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
    g.fillStyle = fill;
    g.fill();
    if (S.hatch && hatchAngle !== null) {
      // Engraver's shading: parallel strokes clipped to the face. Denser on the
      // wall that faces away from the light, sparser on the one that faces it.
      g.save();
      g.clip();
      g.strokeStyle = 'rgba(43,33,22,.55)';
      g.lineWidth = 0.8;
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
      const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 1.6;
      const step = Math.max(2.2, 3.4 / density) * this.k;
      const ca = Math.cos(hatchAngle), sa = Math.sin(hatchAngle);
      for (let d = -span; d <= span; d += step) {
        // a line at distance d from centre, perpendicular to (ca, sa)
        const ox = cx + (-sa) * d, oy = cy + ca * d;
        g.beginPath();
        g.moveTo(ox - ca * span, oy - sa * span);
        g.lineTo(ox + ca * span, oy + sa * span);
        g.stroke();
      }
      g.restore();
    }
    g.strokeStyle = S.ink;
    g.lineWidth = S.hatch ? 1.1 : 1;
    g.stroke();
  }

  cube(x, y, z, { fill, glyph = null, value = null, element = null, alpha = 1, outline = null, dashed = false }) {
    const g = this.ctx, S = this.S;
    const s = this.k, hw = (TW / 2) * s, hh = (TH / 2) * s, zh = TZ * s;
    const p = this.project(x, y, z);
    const top = [[p.x, p.y - hh], [p.x + hw, p.y], [p.x, p.y + hh], [p.x - hw, p.y]];
    g.globalAlpha = alpha;

    // left wall (away from the light: dense hatch), right wall (toward: sparse), top
    this._face([[p.x - hw, p.y], [p.x, p.y + hh], [p.x, p.y + hh + zh], [p.x - hw, p.y + zh]],
               S.hatch ? fill : shade(fill, -0.28), S.hatch ? Math.PI / 3.2 : null, 1.4);
    this._face([[p.x + hw, p.y], [p.x, p.y + hh], [p.x, p.y + hh + zh], [p.x + hw, p.y + zh]],
               S.hatch ? fill : shade(fill, -0.14), S.hatch ? -Math.PI / 3.2 : null, 0.7);
    this._face(top, S.hatch ? lighten(fill, 0.08) : fill, null);

    if (glyph) {
      // The letter is the game; it gets the whole top face and a real serif.
      g.fillStyle = S.letterInk;
      g.font = `${Math.round((S.hatch ? 22 : 20) * s)}px ${S.letterFont}`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(glyph, p.x, p.y + 1);
    } else if (element) {
      this._elementGlyph(element, p.x, p.y, 9 * s);
      if (value !== null) {
        g.fillStyle = S.hatch ? S.ink : 'rgba(0,0,0,.6)';
        g.font = `${Math.round(8.5 * s)}px Consolas,monospace`;
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(String(value), p.x, p.y + hh * 0.58);
      }
    } else if (value !== null) {
      g.fillStyle = S.hatch ? S.ink : 'rgba(0,0,0,.6)';
      g.font = `${Math.round(10 * s)}px Consolas,monospace`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(value), p.x, p.y + 1);
    }

    if (outline) {
      g.strokeStyle = outline;
      g.lineWidth = 2;
      if (dashed) g.setLineDash([5, 4]);
      g.beginPath();
      g.moveTo(top[0][0], top[0][1]);
      for (let i = 1; i < top.length; i++) g.lineTo(top[i][0], top[i][1]);
      g.closePath();
      g.stroke();
      g.setLineDash([]);
    }
    g.globalAlpha = 1;
  }

  /**
   * The four elements drawn as what they are: the alchemical triangles, from the
   * shared glyph module (../../shared/glyphs.js), where the planets and the signs
   * also live. One drawing of each sign, in one place, drawn as paths so it needs
   * no font and never renders as a box.
   */
  _elementGlyph(element, cx, cy, r) {
    const S = this.S;
    drawGlyph(this.ctx, element, cx, cy, r, {
      ink: S.hatch ? S.ink : 'rgba(0,0,0,.72)',
      fill: S.hatch ? 'rgba(43,33,22,.06)' : 'rgba(255,255,255,.18)',
      weight: 1.5,
    });
  }

  /* --------------------------------------------------------------- marks -- */

  /** OUTLINE: a cell the program will occupy or change, drawn as a hovering frame. */
  markCell(x, y, z, colour, label = null) {
    const g = this.ctx, s = this.k, hw = (TW / 2) * s, hh = (TH / 2) * s;
    const p = this.project(x, y, z);
    g.strokeStyle = colour; g.lineWidth = 2; g.setLineDash([5, 4]);
    g.beginPath();
    g.moveTo(p.x, p.y - hh); g.lineTo(p.x + hw, p.y);
    g.lineTo(p.x, p.y + hh); g.lineTo(p.x - hw, p.y);
    g.closePath(); g.stroke(); g.setLineDash([]);
    if (label) {
      g.fillStyle = colour;
      g.font = `${Math.round(9 * s)}px Consolas,monospace`;
      g.textAlign = 'center'; g.textBaseline = 'bottom';
      g.fillText(label, p.x, p.y - hh - 3);
    }
  }

  /** ARROW: something moves. */
  markMove(from, to, colour) {
    const g = this.ctx;
    const a = this.project(...from), b = this.project(...to);
    g.strokeStyle = colour; g.lineWidth = 2; g.setLineDash([4, 3]);
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.setLineDash([]);
    const ang = Math.atan2(b.y - a.y, b.x - a.x), h = 7 * this.k;
    g.fillStyle = colour;
    g.beginPath();
    g.moveTo(b.x, b.y);
    g.lineTo(b.x - h * Math.cos(ang - 0.4), b.y - h * Math.sin(ang - 0.4));
    g.lineTo(b.x - h * Math.cos(ang + 0.4), b.y - h * Math.sin(ang + 0.4));
    g.closePath(); g.fill();
  }

  /** TIE: two cells become one body. */
  markTie(from, to, colour) {
    const g = this.ctx;
    const a = this.project(...from), b = this.project(...to);
    g.strokeStyle = colour; g.lineWidth = 3;
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    g.fillStyle = colour;
    for (const p of [a, b]) { g.beginPath(); g.arc(p.x, p.y, 3.2, 0, 7); g.fill(); }
  }

  /** BREAK: a bond cut or refused — a gap with a slash through it. */
  markBreak(from, to, colour) {
    const g = this.ctx;
    const a = this.project(...from), b = this.project(...to);
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    g.strokeStyle = colour; g.lineWidth = 2; g.setLineDash([3, 4]);
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.setLineDash([]);
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(mx - 6, my - 7); g.lineTo(mx + 6, my + 7); g.stroke();
  }

  /**
   * Draw a world, and optionally the effects a program would have on it.
   * `effects` is vm.run(...).effects — the engine's own list.
   */
  draw(world, effects = null, { cursor = null, ghostWorld = null } = {}) {
    const S = this.S;
    this.clear();
    this.grid();

    // Cells, back to front. A ghost world (the preview's result) is drawn where it
    // differs from the real one, at low alpha, so "what will be there" and "what is
    // there" are the same picture rather than two.
    const real = new Map(world.list().map(c => [`${c.x},${c.y},${c.z}`, c]));
    const shown = new Map(real);
    if (ghostWorld) {
      for (const c of ghostWorld.list()) {
        const k = `${c.x},${c.y},${c.z}`;
        if (!real.has(k)) shown.set(k, { ...c, ghost: true });
      }
    }
    const depth = c => { const [rx, rz] = this._rot(c.x, c.z); return rx + rz + c.y; };
    const cells = [...shown.values()].sort((a, b) => depth(a) - depth(b));
    for (const c of cells) {
      const isElement = !c.glyph && ['fire', 'air', 'water', 'earth'].includes(c.material);
      this.cube(c.x, c.y, c.z, {
        fill: S.material[c.material] || S.material.stone,
        glyph: c.glyph, value: c.glyph ? null : c.value,
        element: isElement ? c.material : null,
        alpha: c.ghost ? 0.42 : 1,
        outline: c.ghost ? S.outline : (c.protected ? S.cursor : null),
        dashed: !!c.ghost,
      });
    }

    if (cursor) this.markCell(cursor[0], cursor[1], cursor[2], S.cursor, 'cursor');

    for (const e of effects || []) {
      switch (e.kind) {
        case 'inscribe':   this.markCell(...e.at, S.outline); break;
        case 'raise':      this.markCell(...e.at, S.outline, `↑${e.to_value}`); break;
        case 'lower':      this.markCell(...e.at, S.outline, `↓${e.to_value}`); break;
        case 'assimilate': this.markCell(...e.at, S.tie, `→${e.to_value}`); break;
        case 'distinguish':this.markCell(...e.at, S.cursor, 'kept'); break;
        case 'pour':
        case 'fall':       this.markMove(e.at, e.to, S.move); break;
        case 'join':
        case 'bind':       this.markTie(e.at, e.to, S.tie); break;
        case 'sever':
        case 'refused':    if (e.to) this.markBreak(e.at, e.to, S.brk);
                           else this.markCell(...e.at, S.brk, '×');
                           break;
        default: break;
      }
    }
  }

  /**
   * Play a settle out in time. `moves` is world.settle()'s list, each tagged with
   * the step it happened on; `before` is a clone of the world from before it. The
   * frames are drawn by re-applying the moves step by step to that clone, so what
   * you watch is the same fall the engine computed, not an animation of it.
   * Resolves when done. `draw` is called per frame with the intermediate world.
   */
  async animateSettle(before, moves, { stepMs = 140, draw } = {}) {
    if (!moves.length) { if (draw) draw(before); return; }
    const w = before.clone();
    const steps = Math.max(...moves.map(m => m.step ?? 0)) + 1;
    for (let s = 0; s < steps; s++) {
      const now = moves.filter(m => (m.step ?? 0) === s);
      for (const m of now) w.move(m.from, m.to);
      if (draw) draw(w, now.map(m => ({ kind: 'fall', at: m.from.split(',').map(Number), to: m.to.split(',').map(Number) })));
      await new Promise(r => setTimeout(r, stepMs));
    }
  }
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(c + 255 * amt)));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}
function lighten(hex, amt) { return shade(hex, amt); }
