// glyphs.js — the correspondence glyphs, drawn as paths.
//
// THE FIRST ARTWORK
// -----------------
// Ted's brief asks for graphics for "all my alchemy block glyphs and their
// elemental effects, planetary magical effects, zodiacal and astrological
// correspondences", in an aesthetic grounded in medieval and Renaissance depiction.
// Until now no glyph artwork existed anywhere in the workspace: every symbol was a
// Unicode character, which renders as a box wherever the font lacks it — and the
// alchemical block did. This module is the start of the answer: every glyph is a
// PATH, drawn with canvas 2D, so it needs no font, never renders as a box, scales
// to any size, and can be tinted per hand.
//
// WHAT THESE ARE, AND WHAT THEY ARE NOT
// -------------------------------------
// They are the standard forms — the four barred triangles, the seven planetary
// signs as they appear in early modern printed books, the three principles, the
// twelve zodiacal signs — drawn in a single-weight line the way an engraver would
// cut them. They are MY drawings of those forms, not reproductions of any
// particular manuscript or plate, and the gallery says so. The forms themselves are
// centuries old and belong to nobody.
//
// Every glyph takes (ctx, cx, cy, r, style) and draws inside a circle of radius r.
// `style` carries `ink` (stroke colour), `fill` (interior wash), and `weight`
// (line width at r = 12, scaled with r). Nothing here reads a font.

export const FAMILIES = {
  element:   { name: 'The four elements',    note: 'Fire and air point up, water and earth down; the second of each pair is barred.' },
  principle: { name: 'The three principles', note: 'Paracelsian tria prima: sulphur, mercury, salt.' },
  planet:    { name: 'The seven planets',    note: 'And their metals: gold, silver, quicksilver, copper, iron, tin, lead.' },
  zodiac:    { name: 'The twelve signs',     note: 'The standard sigils, as cut for early modern printed almanacs.' },
};

/* ------------------------------------------------------------- primitives -- */

function pen(g, style, r) {
  g.strokeStyle = style.ink;
  g.fillStyle = style.fill || 'rgba(0,0,0,0)';
  g.lineWidth = Math.max(0.8, (style.weight || 1.4) * (r / 12));
  g.lineCap = 'round';
  g.lineJoin = 'round';
}
const P = (g, pts, close = false) => {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (close) g.closePath();
};
const circle = (g, x, y, rr) => { g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); };
const arc = (g, x, y, rr, a0, a1, ccw = false) => { g.beginPath(); g.arc(x, y, rr, a0, a1, ccw); };
const line = (g, x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
const cross = (g, x, y, s) => { line(g, x - s, y, x + s, y); line(g, x, y - s, x, y + s); };

/* --------------------------------------------------------------- elements -- */

function triangle(g, cx, cy, r, up, barred, style) {
  pen(g, style, r);
  const yTop = up ? cy - r : cy + r, yBase = up ? cy + r * 0.72 : cy - r * 0.72;
  P(g, [[cx, yTop], [cx + r * 0.92, yBase], [cx - r * 0.92, yBase]], true);
  g.fill(); g.stroke();
  if (barred) {
    // The bar sits a third of the way up from the base, and stops at the sides.
    const t = 0.36;
    const by = yBase + (yTop - yBase) * t;
    const half = r * 0.92 * (1 - t);
    line(g, cx - half, by, cx + half, by);
  }
}

/* ------------------------------------------------------------- principles -- */

function sulphur(g, cx, cy, r, style) {
  // A triangle over a cross: 🜍
  pen(g, style, r);
  const h = r * 0.55;
  P(g, [[cx, cy - r], [cx + h, cy - r * 0.05], [cx - h, cy - r * 0.05]], true);
  g.stroke();
  line(g, cx, cy - r * 0.05, cx, cy + r);
  line(g, cx - r * 0.42, cy + r * 0.5, cx + r * 0.42, cy + r * 0.5);
}
function mercury(g, cx, cy, r, style) {
  // ☿ — crescent over a circle over a cross.
  pen(g, style, r);
  const rr = r * 0.34;
  circle(g, cx, cy - r * 0.05, rr); g.stroke();
  arc(g, cx, cy - r * 0.05 - rr * 1.55, rr * 0.95, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
  line(g, cx, cy - r * 0.05 + rr, cx, cy + r);
  line(g, cx - r * 0.36, cy + r * 0.62, cx + r * 0.36, cy + r * 0.62);
}
function salt(g, cx, cy, r, style) {
  // 🜔 — a circle with a bar across it.
  pen(g, style, r);
  circle(g, cx, cy, r * 0.8); g.stroke();
  line(g, cx - r * 0.8, cy, cx + r * 0.8, cy);
}

/* ---------------------------------------------------------------- planets -- */

function sun(g, cx, cy, r, style) {
  pen(g, style, r);
  circle(g, cx, cy, r * 0.82); g.stroke();
  circle(g, cx, cy, Math.max(1.2, r * 0.14)); g.fillStyle = style.ink; g.fill();
}
function moon(g, cx, cy, r, style) {
  // A crescent: the outer disc minus an offset disc, drawn as two arcs.
  pen(g, style, r);
  g.beginPath();
  g.arc(cx, cy, r * 0.8, Math.PI * 0.5, Math.PI * 1.5, false);
  g.arc(cx + r * 0.42, cy, r * 0.66, Math.PI * 1.5, Math.PI * 0.5, true);
  g.closePath();
  g.fill(); g.stroke();
}
function venus(g, cx, cy, r, style) {
  pen(g, style, r);
  const rr = r * 0.42;
  circle(g, cx, cy - r * 0.32, rr); g.stroke();
  line(g, cx, cy - r * 0.32 + rr, cx, cy + r);
  line(g, cx - r * 0.38, cy + r * 0.6, cx + r * 0.38, cy + r * 0.6);
}
function mars(g, cx, cy, r, style) {
  pen(g, style, r);
  const rr = r * 0.44;
  circle(g, cx - r * 0.18, cy + r * 0.18, rr); g.stroke();
  const ax = cx - r * 0.18 + rr * 0.72, ay = cy + r * 0.18 - rr * 0.72;
  line(g, ax, ay, cx + r * 0.78, cy - r * 0.78);
  line(g, cx + r * 0.78, cy - r * 0.78, cx + r * 0.78, cy - r * 0.22);
  line(g, cx + r * 0.78, cy - r * 0.78, cx + r * 0.22, cy - r * 0.78);
}
function jupiter(g, cx, cy, r, style) {
  // ♃ — a 2-like curl with a cross at the foot.
  pen(g, style, r);
  arc(g, cx - r * 0.3, cy - r * 0.42, r * 0.36, Math.PI * 1.05, Math.PI * 0.05, false); g.stroke();
  line(g, cx + r * 0.06, cy - r * 0.38, cx - r * 0.66, cy + r * 0.34);
  line(g, cx - r * 0.66, cy + r * 0.34, cx + r * 0.66, cy + r * 0.34);
  line(g, cx + r * 0.3, cy - r * 0.02, cx + r * 0.3, cy + r * 0.9);
}
function saturn(g, cx, cy, r, style) {
  // ♄ — a cross above, a hooked descender below.
  pen(g, style, r);
  line(g, cx - r * 0.5, cy - r * 0.5, cx + r * 0.2, cy - r * 0.5);
  line(g, cx - r * 0.15, cy - r * 0.9, cx - r * 0.15, cy + r * 0.2);
  g.beginPath();
  g.moveTo(cx - r * 0.15, cy + r * 0.2);
  g.bezierCurveTo(cx + r * 0.75, cy - r * 0.05, cx + r * 0.75, cy + r * 0.95, cx - r * 0.05, cy + r * 0.72);
  g.stroke();
}
function mercuryPlanet(g, cx, cy, r, style) { mercury(g, cx, cy, r, style); }

/* ----------------------------------------------------------------- zodiac -- */

function aries(g, cx, cy, r, style) {
  pen(g, style, r);
  g.beginPath();
  g.moveTo(cx - r * 0.8, cy - r * 0.15);
  g.bezierCurveTo(cx - r * 0.8, cy - r * 0.95, cx, cy - r * 0.85, cx, cy + r * 0.05);
  g.bezierCurveTo(cx, cy - r * 0.85, cx + r * 0.8, cy - r * 0.95, cx + r * 0.8, cy - r * 0.15);
  g.stroke();
  line(g, cx, cy + r * 0.05, cx, cy + r);
}
function taurus(g, cx, cy, r, style) {
  pen(g, style, r);
  circle(g, cx, cy + r * 0.22, r * 0.58); g.stroke();
  arc(g, cx, cy - r * 0.62, r * 0.6, Math.PI * 0.1, Math.PI * 0.9, false); g.stroke();
}
function gemini(g, cx, cy, r, style) {
  pen(g, style, r);
  line(g, cx - r * 0.4, cy - r * 0.7, cx - r * 0.4, cy + r * 0.7);
  line(g, cx + r * 0.4, cy - r * 0.7, cx + r * 0.4, cy + r * 0.7);
  arc(g, cx, cy - r * 1.2, r * 0.9, Math.PI * 0.33, Math.PI * 0.67, false); g.stroke();
  arc(g, cx, cy + r * 1.2, r * 0.9, Math.PI * 1.33, Math.PI * 1.67, false); g.stroke();
}
function cancer(g, cx, cy, r, style) {
  // ♋ — two 6/9 forms turned on their sides: a small circle at each end, and a
  // long arc leaving it over the top (and, mirrored, under the bottom).
  pen(g, style, r);
  arc(g, cx + r * 0.1, cy - r * 0.05, r * 0.75, Math.PI * 1.15, Math.PI * 1.85, false); g.stroke();
  arc(g, cx - r * 0.1, cy + r * 0.05, r * 0.75, Math.PI * 0.15, Math.PI * 0.85, false); g.stroke();
  circle(g, cx - r * 0.5, cy - r * 0.2, r * 0.22); g.fill(); g.stroke();
  circle(g, cx + r * 0.5, cy + r * 0.2, r * 0.22); g.fill(); g.stroke();
}
function leo(g, cx, cy, r, style) {
  pen(g, style, r);
  circle(g, cx - r * 0.5, cy + r * 0.35, r * 0.3); g.stroke();
  g.beginPath();
  g.moveTo(cx - r * 0.22, cy + r * 0.2);
  g.bezierCurveTo(cx - r * 0.1, cy - r * 1.1, cx + r * 0.9, cy - r * 0.9, cx + r * 0.55, cy + r * 0.1);
  g.bezierCurveTo(cx + r * 0.35, cy + r * 0.75, cx + r * 0.8, cy + r * 0.85, cx + r * 0.9, cy + r * 0.5);
  g.stroke();
}
function virgo(g, cx, cy, r, style) {
  pen(g, style, r);
  for (const x of [-0.7, -0.25, 0.2]) {
    line(g, cx + r * x, cy - r * 0.55, cx + r * x, cy + r * 0.5);
    arc(g, cx + r * (x + 0.225), cy - r * 0.55, r * 0.225, Math.PI, Math.PI * 2, false); g.stroke();
  }
  g.beginPath();
  g.moveTo(cx + r * 0.65, cy - r * 0.55);
  g.lineTo(cx + r * 0.65, cy + r * 0.3);
  g.bezierCurveTo(cx + r * 0.65, cy + r * 0.9, cx + r * 0.05, cy + r * 0.95, cx + r * 0.1, cy + r * 0.55);
  g.stroke();
}
function libra(g, cx, cy, r, style) {
  pen(g, style, r);
  line(g, cx - r * 0.85, cy + r * 0.62, cx + r * 0.85, cy + r * 0.62);
  line(g, cx - r * 0.85, cy + r * 0.18, cx - r * 0.32, cy + r * 0.18);
  line(g, cx + r * 0.32, cy + r * 0.18, cx + r * 0.85, cy + r * 0.18);
  arc(g, cx, cy + r * 0.18, r * 0.32, Math.PI, Math.PI * 2, false); g.stroke();
}
function scorpio(g, cx, cy, r, style) {
  pen(g, style, r);
  for (const x of [-0.7, -0.25, 0.2]) {
    line(g, cx + r * x, cy - r * 0.55, cx + r * x, cy + r * 0.5);
    arc(g, cx + r * (x + 0.225), cy - r * 0.55, r * 0.225, Math.PI, Math.PI * 2, false); g.stroke();
  }
  g.beginPath();
  g.moveTo(cx + r * 0.2, cy + r * 0.5);
  g.lineTo(cx + r * 0.62, cy + r * 0.5);
  g.lineTo(cx + r * 0.85, cy + r * 0.27);
  g.stroke();
  line(g, cx + r * 0.85, cy + r * 0.27, cx + r * 0.6, cy + r * 0.12);
  line(g, cx + r * 0.85, cy + r * 0.27, cx + r * 0.8, cy + r * 0.55);
}
function sagittarius(g, cx, cy, r, style) {
  pen(g, style, r);
  line(g, cx - r * 0.75, cy + r * 0.75, cx + r * 0.75, cy - r * 0.75);
  line(g, cx + r * 0.75, cy - r * 0.75, cx + r * 0.75, cy - r * 0.1);
  line(g, cx + r * 0.75, cy - r * 0.75, cx + r * 0.1, cy - r * 0.75);
  line(g, cx - r * 0.55, cy - r * 0.05, cx - r * 0.05, cy + r * 0.45);
}
function capricorn(g, cx, cy, r, style) {
  pen(g, style, r);
  g.beginPath();
  g.moveTo(cx - r * 0.85, cy - r * 0.5);
  g.lineTo(cx - r * 0.45, cy + r * 0.35);
  g.lineTo(cx - r * 0.05, cy - r * 0.5);
  g.lineTo(cx + r * 0.2, cy + r * 0.3);
  g.stroke();
  circle(g, cx + r * 0.5, cy + r * 0.45, r * 0.34); g.stroke();
  arc(g, cx + r * 0.5, cy + r * 0.45, r * 0.34, Math.PI * 0.9, Math.PI * 1.35, false); g.stroke();
}
function aquarius(g, cx, cy, r, style) {
  pen(g, style, r);
  for (const dy of [-0.25, 0.3]) {
    g.beginPath();
    g.moveTo(cx - r * 0.85, cy + r * dy + r * 0.12);
    for (let i = 0; i < 4; i++) {
      const x0 = cx - r * 0.85 + i * r * 0.425;
      g.lineTo(x0 + r * 0.2125, cy + r * dy - r * 0.12);
      g.lineTo(x0 + r * 0.425, cy + r * dy + r * 0.12);
    }
    g.stroke();
  }
}
function pisces(g, cx, cy, r, style) {
  pen(g, style, r);
  arc(g, cx - r * 0.95, cy, r * 0.85, -Math.PI * 0.42, Math.PI * 0.42, false); g.stroke();
  arc(g, cx + r * 0.95, cy, r * 0.85, Math.PI * 0.58, Math.PI * 1.42, false); g.stroke();
  line(g, cx - r * 0.55, cy, cx + r * 0.55, cy);
}

/* ------------------------------------------------------------- the table -- */

export const GLYPHS = [
  { id: 'fire',  family: 'element', name: 'Fire',  arabic: 'نار',  draw: (g, x, y, r, s) => triangle(g, x, y, r, true,  false, s) },
  { id: 'air',   family: 'element', name: 'Air',   arabic: 'هواء', draw: (g, x, y, r, s) => triangle(g, x, y, r, true,  true,  s) },
  { id: 'water', family: 'element', name: 'Water', arabic: 'ماء',  draw: (g, x, y, r, s) => triangle(g, x, y, r, false, false, s) },
  { id: 'earth', family: 'element', name: 'Earth', arabic: 'تراب', draw: (g, x, y, r, s) => triangle(g, x, y, r, false, true,  s) },

  { id: 'sulphur', family: 'principle', name: 'Sulphur', arabic: 'كبريت', draw: sulphur },
  { id: 'mercury', family: 'principle', name: 'Mercury', arabic: 'زئبق',  draw: mercury },
  { id: 'salt',    family: 'principle', name: 'Salt',    arabic: 'ملح',   draw: salt },

  { id: 'sun',     family: 'planet', name: 'Sun · gold',           arabic: 'الشمس',  draw: sun },
  { id: 'moon',    family: 'planet', name: 'Moon · silver',        arabic: 'القمر',  draw: moon },
  { id: 'mercury-planet', family: 'planet', name: 'Mercury · quicksilver', arabic: 'عطارد', draw: mercuryPlanet },
  { id: 'venus',   family: 'planet', name: 'Venus · copper',       arabic: 'الزهرة', draw: venus },
  { id: 'mars',    family: 'planet', name: 'Mars · iron',          arabic: 'المريخ', draw: mars },
  { id: 'jupiter', family: 'planet', name: 'Jupiter · tin',        arabic: 'المشتري', draw: jupiter },
  { id: 'saturn',  family: 'planet', name: 'Saturn · lead',        arabic: 'زحل',    draw: saturn },

  { id: 'aries',       family: 'zodiac', name: 'Aries',       arabic: 'الحمل',   draw: aries },
  { id: 'taurus',      family: 'zodiac', name: 'Taurus',      arabic: 'الثور',   draw: taurus },
  { id: 'gemini',      family: 'zodiac', name: 'Gemini',      arabic: 'الجوزاء', draw: gemini },
  { id: 'cancer',      family: 'zodiac', name: 'Cancer',      arabic: 'السرطان', draw: cancer },
  { id: 'leo',         family: 'zodiac', name: 'Leo',         arabic: 'الأسد',   draw: leo },
  { id: 'virgo',       family: 'zodiac', name: 'Virgo',       arabic: 'السنبلة', draw: virgo },
  { id: 'libra',       family: 'zodiac', name: 'Libra',       arabic: 'الميزان', draw: libra },
  { id: 'scorpio',     family: 'zodiac', name: 'Scorpio',     arabic: 'العقرب',  draw: scorpio },
  { id: 'sagittarius', family: 'zodiac', name: 'Sagittarius', arabic: 'القوس',   draw: sagittarius },
  { id: 'capricorn',   family: 'zodiac', name: 'Capricorn',   arabic: 'الجدي',   draw: capricorn },
  { id: 'aquarius',    family: 'zodiac', name: 'Aquarius',    arabic: 'الدلو',   draw: aquarius },
  { id: 'pisces',      family: 'zodiac', name: 'Pisces',      arabic: 'الحوت',   draw: pisces },
];

export const byId = Object.fromEntries(GLYPHS.map(g => [g.id, g]));

/** Draw one glyph by id. Returns false if there is no such glyph. */
export function drawGlyph(g, id, cx, cy, r, style) {
  const entry = byId[id];
  if (!entry) return false;
  g.save();
  entry.draw(g, cx, cy, r, style);
  g.restore();
  return true;
}
