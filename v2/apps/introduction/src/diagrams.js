// diagrams.js — the period diagrams of lettrism, RECONSTRUCTED as live drawings.
//
// The Introduction wants the player to see the diagrams the traditions drew:
// the Sefer Yetsirah's wheel of 231 gates, its three-seven-twelve division, al-
// Būnī's four natures in seven degrees, the ring of twenty-eight lunar mansions.
// The manuscript folios themselves are not in this repo — every image here needs
// a provenance record and a rights check first (CLAUDE.md), and that fetch is a
// download waiting for Ted's word (see FETCHLIST.md). So these are drawn from the
// TEXT of the sources, as the medieval commentators drew theirs, and labelled as
// our reconstructions where the player is looking at them. Segol 2012 is the
// account of what the real diagrams look like and what they were for.
//
// Every figure takes (ctx, w, h, data, style) and draws into that box.

const TAU = Math.PI * 2;

function pen(g, style) {
  g.strokeStyle = style.ink; g.fillStyle = style.ink; g.lineWidth = 1;
  g.textAlign = 'center'; g.textBaseline = 'middle';
}
function ring(g, cx, cy, r, style) { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.strokeStyle = style.ink; g.stroke(); }
function caption(g, w, h, text, style) {
  g.save(); g.fillStyle = style.dim; g.font = `${Math.max(9, Math.round(h * 0.035))}px "Inter","Segoe UI",system-ui,sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText(text, w / 2, h - 4); g.restore();
}

/**
 * SY18: "Twenty-two letters of foundation, fixed on a wheel with 231 gates. The
 * wheel rotates forward and backward" (Segol 2012, p. 51). 231 = the number of
 * unordered pairs of 22 letters. Every pair is a chord; the wheel is the
 * commentators' picture of letter combination as such.
 */
export function gates231(g, w, h, hebrew, style) {
  pen(g, style);
  const cx = w / 2, cy = h / 2 - 6, R = Math.min(w, h) * 0.38;
  const n = hebrew.length;
  const pt = i => [cx + R * Math.cos(-Math.PI / 2 + i * TAU / n), cy + R * Math.sin(-Math.PI / 2 + i * TAU / n)];
  g.save();
  g.strokeStyle = style.faint; g.lineWidth = 0.6;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const [ax, ay] = pt(i), [bx, by] = pt(j);
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
  }
  g.restore();
  ring(g, cx, cy, R, style);
  ring(g, cx, cy, R + 14, style);
  g.font = `${Math.round(R * 0.13)}px "Frank Ruhl Libre","Times New Roman",serif`;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * TAU / n;
    g.fillStyle = style.ink;
    g.fillText(hebrew[i].glyph, cx + (R + 7) * Math.cos(a), cy + (R + 7) * Math.sin(a) + 1);
  }
  g.font = `${Math.round(R * 0.11)}px "Inter","Segoe UI",system-ui,sans-serif`;
  g.fillStyle = style.dim;
  g.fillText('231', cx, cy - 6);
  g.font = `${Math.round(R * 0.075)}px "Inter","Segoe UI",system-ui,sans-serif`;
  g.fillText('gates', cx, cy + 8);
  caption(g, w, h, 'The wheel of 231 gates — our reconstruction after SY §18 and Segol 2012, ch. 2–3', style);
}

/**
 * The three mothers, seven doubles and twelve simples as three rings — the
 * division of SY ch. 1, with the mothers' elements, the doubles' contrary
 * aspects and the simples' faculties (Segol 2012, pp. 23, 41).
 */
export function wheel3712(g, w, h, hebrew, style) {
  pen(g, style);
  const cx = w / 2, cy = h / 2 - 6, R = Math.min(w, h) * 0.40;
  const groups = [
    { kind: 'mother', r: R * 0.30, label: 'three mothers · air water fire' },
    { kind: 'double', r: R * 0.62, label: 'seven doubles · two aspects each' },
    { kind: 'simple', r: R * 0.95, label: 'twelve simples · a faculty, a sign, a month' },
  ];
  for (const grp of groups) {
    const ls = hebrew.filter(l => l.kind === grp.kind);
    ring(g, cx, cy, grp.r, style);
    g.font = `${Math.round(R * 0.12)}px "Frank Ruhl Libre","Times New Roman",serif`;
    ls.forEach((l, i) => {
      const a = -Math.PI / 2 + i * TAU / ls.length;
      const x = cx + grp.r * Math.cos(a), y = cy + grp.r * Math.sin(a);
      g.fillStyle = style.bg; g.beginPath(); g.arc(x, y, R * 0.085, 0, TAU); g.fill();
      g.strokeStyle = style.ink; g.stroke();
      g.fillStyle = style.ink; g.fillText(l.glyph, x, y + 1);
      const tag = l.kind === 'mother' ? l.sy.element : l.kind === 'double' ? (l.sy.aspects || []).join(' / ') : l.sy.faculty;
      if (tag) {
        g.save(); g.font = `${Math.round(R * 0.06)}px "Inter","Segoe UI",system-ui,sans-serif`; g.fillStyle = style.dim;
        const tx = cx + (grp.r + R * 0.16) * Math.cos(a), ty = cy + (grp.r + R * 0.16) * Math.sin(a);
        g.fillText(tag, tx, ty); g.restore();
      }
    });
  }
  caption(g, w, h, 'Mothers, doubles, simples — after SY ch. 1–5; labels from the diagram Segol translates (ff. 17b–18a)', style);
}

/**
 * The four natures in seven degrees: the Kitāb Sharāsīm al-Hindiyya's list,
 * which cycles hot–cold–wet–dry down the abjad order (Coulon in Saif et al.
 * 2021, pp. 346–347); al-Būnī "divides the main twenty-eight letters into four
 * groups… seven 'degrees' for each quality" (Gardiner 2017, p. 57).
 */
export function natures4x7(g, w, h, arabic, style) {
  pen(g, style);
  const cols = ['hot', 'cold', 'wet', 'dry'];
  const colour = { hot: style.fire, cold: style.water, wet: style.water, dry: style.earth };
  const byNature = { hot: [], cold: [], wet: [], dry: [] };
  arabic.forEach((l, i) => byNature[cols[i % 4]].push(l));
  const left = w * 0.08, top = h * 0.12, cw = (w * 0.84) / 4, rh = (h * 0.7) / 7;
  g.font = `${Math.round(rh * 0.5)}px "Inter","Segoe UI",system-ui,sans-serif`;
  cols.forEach((c, ci) => {
    g.fillStyle = colour[c]; g.fillText(c.toUpperCase(), left + cw * (ci + 0.5), top - rh * 0.45);
    byNature[c].forEach((l, ri) => {
      const x = left + cw * (ci + 0.5), y = top + rh * (ri + 0.5);
      g.strokeStyle = style.faint; g.strokeRect(left + cw * ci + 2, top + rh * ri + 1, cw - 4, rh - 2);
      g.font = `${Math.round(rh * 0.62)}px "Amiri","Scheherazade New","Noto Naskh Arabic",serif`;
      g.fillStyle = style.ink; g.fillText(l.glyph, x - cw * 0.18, y + 1);
      g.font = `${Math.round(rh * 0.36)}px "Inter","Segoe UI",system-ui,sans-serif`;
      g.fillStyle = style.dim; g.fillText(`${l.name} · ${l.abjad}`, x + cw * 0.22, y + 1);
    });
  });
  caption(g, w, h, 'Seven hot, seven cold, seven wet, seven dry — the Sharāsīm list; al-Būnī\'s own table differs (Manbaʿ, p. 66)', style);
}

/**
 * The twenty-eight lunar mansions as a ring, one letter each in abjad order
 * (Shams al-maʿārif fol. 4r, Varisco 2017 pp. 501–502), with the dotted
 * letters — al-Būnī's inauspicious mansions — marked, in degrees of one, two
 * and three dots.
 */
export function mansions28(g, w, h, arabic, style) {
  pen(g, style);
  const cx = w / 2, cy = h / 2 - 6, R = Math.min(w, h) * 0.38;
  ring(g, cx, cy, R, style); ring(g, cx, cy, R * 0.72, style);
  arabic.forEach((l, i) => {
    const a = -Math.PI / 2 + i * TAU / 28;
    const dots = l.facts.dots_above + l.facts.dots_below;
    const x = cx + R * 0.86 * Math.cos(a), y = cy + R * 0.86 * Math.sin(a);
    g.fillStyle = dots ? style.brk : style.ok;
    g.beginPath(); g.arc(x, y, R * 0.06 + dots * 1.2, 0, TAU); g.fill();
    g.font = `${Math.round(R * 0.11)}px "Amiri","Scheherazade New","Noto Naskh Arabic",serif`;
    g.fillStyle = style.ink; g.fillText(l.glyph, cx + (R + 12) * Math.cos(a), cy + (R + 12) * Math.sin(a) + 1);
    g.font = `${Math.round(R * 0.06)}px "Inter","Segoe UI",system-ui,sans-serif`;
    g.fillStyle = style.dim; g.fillText(String(i + 1), cx + R * 0.62 * Math.cos(a), cy + R * 0.62 * Math.sin(a));
  });
  g.font = `${Math.round(R * 0.09)}px "Inter","Segoe UI",system-ui,sans-serif`;
  g.fillStyle = style.dim; g.fillText('28 mansions', cx, cy - 8); g.fillText('= 28 letters', cx, cy + 8);
  caption(g, w, h, 'Alif is al-naṭḥ; red marks = dotted = inauspicious, larger with more dots — after Shams al-maʿārif fol. 4r', style);
}

/** The abjad ladder: the twenty-eight values in order, as a staircase. */
export function abjadLadder(g, w, h, arabic, style) {
  pen(g, style);
  const left = w * 0.06, base = h * 0.82, cw = (w * 0.88) / 28;
  const maxLog = Math.log10(1000);
  arabic.forEach((l, i) => {
    const hh = (Math.log10(l.abjad) / maxLog) * (h * 0.6) + 6;
    const x = left + cw * i;
    g.fillStyle = l.class === 'nurani' ? style.ok : style.brk;
    g.globalAlpha = 0.55; g.fillRect(x + 1, base - hh, cw - 2, hh); g.globalAlpha = 1;
    g.font = `${Math.round(cw * 0.75)}px "Amiri","Scheherazade New","Noto Naskh Arabic",serif`;
    g.fillStyle = style.ink; g.fillText(l.glyph, x + cw / 2, base + 10);
    g.font = `${Math.round(cw * 0.36)}px "Inter","Segoe UI",system-ui,sans-serif`;
    g.fillStyle = style.dim; g.save(); g.translate(x + cw / 2, base - hh - 6); g.rotate(-Math.PI / 2); g.textAlign = 'left'; g.fillText(String(l.abjad), 0, 0); g.restore();
  });
  caption(g, w, h, 'The abjad values 1 → 1000 (log scale); green = luminous, red = dark', style);
}

export const FIGURES = { gates231, wheel3712, natures4x7, mansions28, abjadLadder };

/** Draw a named figure into a canvas, in the current hand's colours. */
export function drawFigure(canvas, name, { arabic, hebrew }, hand = 'lapis') {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || 360, h = canvas.clientHeight || 300;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const g = canvas.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const style = hand === 'ink'
    ? { bg: '#efe4cf', ink: '#2b2116', dim: '#6b5d4a', faint: 'rgba(43,33,22,.14)', ok: '#2e6b5f', brk: '#8c2f1b', fire: '#8c2f1b', water: '#1f3d6b', earth: '#6b4a15' }
    : { bg: '#171620', ink: '#f1dac1', dim: '#b9b0a6', faint: 'rgba(241,218,193,.12)', ok: '#2e8f8f', brk: '#c06523', fire: '#c0522a', water: '#4d7fd6', earth: '#b8a24a' };
  g.fillStyle = style.bg; g.fillRect(0, 0, w, h);
  const fn = FIGURES[name];
  if (!fn) return false;
  fn(g, w, h, name === 'gates231' || name === 'wheel3712' ? hebrew : arabic, style);
  return true;
}
