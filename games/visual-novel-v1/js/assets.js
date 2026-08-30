// assets.js — backdrop images and science colors. Manuscripts/diagrams only, no
// invented character portraits (docs/DECISIONS.md, "Image role" decision).
// All images sourced from OCCULTIMGDB with real public-domain provenance and
// registered in assets/manuscripts/registry.json (19 entries as of this pass).

const A = '../../assets/manuscripts';

export const ACT_BACKDROP = {
  1: `${A}/act1-ms-17c-opening.jpg`,
  2: `${A}/act2-persian-astrolabe.jpg`,
  3: `${A}/act3-printed-chapter-heading-p150.jpg`,
  4: `${A}/act4-printed-magic-squares-p201.jpg`,
  5: `${A}/act5-persian-ms-talismans.jpg`,
  6: `${A}/act6-wellcome-geomantic-wheel.jpg`,
  7: `${A}/act7-red-x-talisman-fourteenth-operation-c036.jpg`,
  8: `${A}/act8-printed-teardrop-cosmogram-p256.jpg`,
};

// Per-choice overrides for the highest-stakes scenes; anything not listed here
// falls back to its act's backdrop. Each was picked for a thematic match — see
// the registry notes (e.g. c36 exile = the Seven Sleepers refuge folio).
export const CHOICE_BACKDROP = {
  c11: `${A}/c11-celestial-globe.jpg`,
  c14: `${A}/c14-sufi-fixed-stars.jpg`,
  c16: `${A}/c16-printed-khatim-diamond-p56.jpg`,
  c19: `${A}/c19-qazwini-angel.jpg`,
  c20: `${A}/c20-letter-word-wafq-table-c030.jpg`,
  c23: `${A}/c23-arab-figures-classification.jpg`,
  c28: `${A}/c28-bm-instrument-full-1241.jpg`,
  c31: `${A}/c31-5x5-jafar-wafq-sultan-testimony-c055.jpg`,
  c36: `${A}/c36-falnama-omen.jpg`,
  c38: `${A}/c38-khalili-mss-0300-buni.jpg`,
  c40: `${A}/c40-acm-scroll-03625.jpg`,
};

export function backdropFor(choice) {
  return CHOICE_BACKDROP[choice.id] || ACT_BACKDROP[choice.act];
}

// Science identity colors — matches the pitch art's skill-key palette
// (red alchemy, green talismanry, purple subjugation, blue illusionism, gold trickery).
export const SCIENCE_COLORS = {
  kimiya: '#a33b2e',
  limiya: '#2e6b4f',
  himiya: '#5b3e8c',
  simiya: '#2e5d8c',
  rimiya: '#a3742e',
};

export const SCIENCE_LABELS = {
  kimiya: 'Kīmiyā (Alchemy)',
  limiya: 'Līmiyā (Talismanry)',
  himiya: 'Hīmiyā (Subjugation)',
  simiya: 'Sīmiyā (Illusionism)',
  rimiya: 'Rīmiyā (Trickery)',
};
