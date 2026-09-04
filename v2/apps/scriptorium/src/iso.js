// iso.js — the consequence renderer.
//
// Draws a World on an isometric canvas, and draws an EFFECT LIST over it. It is
// deliberately separate from the app: the effect list is the engine's own output
// (vm.run returns exactly what it applied), so any v2 app can render a preview by
// handing this the same array, and no app can invent a consequence the engine did
// not produce.
//
// THE VISUAL LANGUAGE FOR PREDICTED CONSEQUENCE
// ---------------------------------------------
// The brief asks for a language rather than a pile of highlights, and warns
// against overwhelming the screen. Four marks, and nothing else:
//
//   OUTLINE   gold      a cell the program will occupy or change
//   ARROW     gold      something moves: from → to (pour, fall)
//   TIE       lapis     two cells become one body (join, bind)
//   BREAK     vermilion a bond refused or cut, drawn as a gap with a slash
//
// Everything a preview needs to say is one of: it appears here, it moves there,
// these become one, this comes apart. A fifth mark would mean the model grew a
// concept, and that is the moment to reconsider the model rather than the legend.

export const PALETTE = {
  gold: '#e8c86a', lapis: '#4d7fd6', verm: '#c06523', turq: '#2e8f8f',
  paper: '#f1dac1', dim: '#8b8378', bg: '#171620',
  material: {
    stone:  '#8d8577', earth: '#6d5b43', water: '#3f6fa8',
    fire:   '#c0522a', air:   '#b8a24a', letter: '#d8c49a',
  },
};

const TW = 34, TH = 18, TZ = 26;   // tile width, tile depth, cube height

export class Iso {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.origin = { x: 0, y: 0 };
    this.scale = 1;
  }

  resize() {
    const r = this.cv.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.cv.width = Math.max(1, r.width * dpr);
    this.cv.height = Math.max(1, r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = r.width; this.h = r.height;
  }

  /** World coordinates → screen. */
  project(x, y, z) {
    return {
      x: this.origin.x + (x - z) * (TW / 2) * this.scale,
      y: this.origin.y + (x + z) * (TH / 2) * this.scale - y * TZ * this.scale,
    };
  }

  /** Screen → the world cell on the ground plane (y = 0) under the pointer. */
  unproject(sx, sy, y = 0) {
    const px = (sx - this.origin.x) / this.scale;
    const py = (sy - this.origin.y + y * TZ * this.scale) / this.scale;
    const a = px / (TW / 2), b = py / (TH / 2);
    return [Math.round((a + b) / 2), y, Math.round((b - a) / 2)];
  }

  /** Frame the world so its occupied cells sit in the middle of the canvas. */
  frame(world, extra = []) {
    const pts = [...world.list().map(c => [c.x, c.y, c.z]), ...extra];
    if (!pts.length) pts.push([0, 0, 0]);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    this.origin = { x: 0, y: 0 }; this.scale = 1;
    for (const [x, y, z] of pts) {
      const p = this.project(x, y, z);
      minX = Math.min(minX, p.x - TW); maxX = Math.max(maxX, p.x + TW);
      minY = Math.min(minY, p.y - TZ); maxY = Math.max(maxY, p.y + TH + TZ);
    }
    const sx = (this.w - 40) / Math.max(1, maxX - minX);
    const sy = (this.h - 40) / Math.max(1, maxY - minY);
    this.scale = Math.max(0.45, Math.min(1.35, Math.min(sx, sy)));
    this.origin = {
      x: this.w / 2 - ((minX + maxX) / 2) * this.scale,
      y: this.h / 2 - ((minY + maxY) / 2) * this.scale,
    };
  }

  clear() {
    const g = this.ctx;
    g.fillStyle = PALETTE.bg;
    g.fillRect(0, 0, this.w, this.h);
  }

  /** A faint ground lattice, so an empty world is still a place. */
  grid(radius = 5) {
    const g = this.ctx;
    g.strokeStyle = 'rgba(241,218,193,.10)';
    g.lineWidth = 1;
    for (let i = -radius; i <= radius; i++) {
      const a = this.project(i, 0, -radius), b = this.project(i, 0, radius);
      const c = this.project(-radius, 0, i), d = this.project(radius, 0, i);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(d.x, d.y); g.stroke();
    }
  }

  cube(x, y, z, { fill, glyph = null, value = null, alpha = 1, outline = null, dashed = false }) {
    const g = this.ctx;
    const s = this.scale, hw = (TW / 2) * s, hh = (TH / 2) * s, zh = TZ * s;
    const p = this.project(x, y, z);
    const top = [[p.x, p.y - hh], [p.x + hw, p.y], [p.x, p.y + hh], [p.x - hw, p.y]];
    g.globalAlpha = alpha;

    const face = (pts, shade) => {
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.closePath();
      g.fillStyle = shade;
      g.fill();
      g.strokeStyle = 'rgba(0,0,0,.35)';
      g.lineWidth = 1;
      g.stroke();
    };
    // left and right walls, then the top — painter's order within one cube
    face([[p.x - hw, p.y], [p.x, p.y + hh], [p.x, p.y + hh + zh], [p.x - hw, p.y + zh]], shade(fill, -0.28));
    face([[p.x + hw, p.y], [p.x, p.y + hh], [p.x, p.y + hh + zh], [p.x + hw, p.y + zh]], shade(fill, -0.14));
    face(top, fill);

    if (glyph) {
      g.fillStyle = '#241c10';
      g.font = `${Math.round(20 * s)}px "Segoe UI","Noto Naskh Arabic",serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(glyph, p.x, p.y + 1);
    } else if (value !== null) {
      g.fillStyle = 'rgba(0,0,0,.6)';
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

  /** OUTLINE: a cell the program will occupy or change, drawn as a hovering frame. */
  markCell(x, y, z, colour, label = null) {
    const g = this.ctx, s = this.scale, hw = (TW / 2) * s, hh = (TH / 2) * s;
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
    const ang = Math.atan2(b.y - a.y, b.x - a.x), h = 7 * this.scale;
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
    const cells = [...shown.values()].sort((a, b) => (a.x + a.z + a.y) - (b.x + b.z + b.y));
    for (const c of cells) {
      this.cube(c.x, c.y, c.z, {
        fill: PALETTE.material[c.material] || PALETTE.material.stone,
        glyph: c.glyph, value: c.glyph ? null : c.value,
        alpha: c.ghost ? 0.42 : 1,
        outline: c.ghost ? PALETTE.gold : (c.protected ? PALETTE.turq : null),
        dashed: !!c.ghost,
      });
    }

    if (cursor) this.markCell(cursor[0], cursor[1], cursor[2], PALETTE.turq, 'cursor');

    for (const e of effects || []) {
      switch (e.kind) {
        case 'inscribe':   this.markCell(...e.at, PALETTE.gold); break;
        case 'raise':      this.markCell(...e.at, PALETTE.gold, `↑${e.to_value}`); break;
        case 'lower':      this.markCell(...e.at, PALETTE.gold, `↓${e.to_value}`); break;
        case 'assimilate': this.markCell(...e.at, PALETTE.lapis, `→${e.to_value}`); break;
        case 'distinguish':this.markCell(...e.at, PALETTE.turq, 'kept'); break;
        case 'pour':
        case 'fall':       this.markMove(e.at, e.to, PALETTE.gold); break;
        case 'join':
        case 'bind':       this.markTie(e.at, e.to, PALETTE.lapis); break;
        case 'sever':
        case 'refused':    if (e.to) this.markBreak(e.at, e.to, PALETTE.verm);
                           else this.markCell(...e.at, PALETTE.verm, '×');
                           break;
        default: break;
      }
    }
  }
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(c + 255 * amt)));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
}
