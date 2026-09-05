// verify_run.mjs — the gate for The Descent.
//
//   node v2/apps/descent/verify_run.mjs [--trace]
//
// A floor of the Descent is a building task whose answer depends on which
// metaphysics you are standing in. So the check is not "is it solvable" but
// "is it solvable under EVERY ruleset it might be dealt with, and does it
// matter which":
//
//   FAIR      every historical ruleset has at least one winning placement
//   DISTINCT  every pair of rulesets has a different set of winning placements
//             here — a solution carried down from another floor can fail. (Not
//             'in every direction': the Ottoman floor's solutions are a subset
//             of the intellectual's by construction, and the gnostic's of the
//             Sufi's. Demanding both directions found nothing in 9,579
//             candidates, which is how that was learned.)
//
// and it REPORTS, without failing on it, whether a UNIVERSAL placement exists —
// one that wins under all four, which a player could learn instead of the assay.
// That number is the honest measure of how much the floor actually needs you to
// know where you are, and it is printed rather than hidden.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { assess, solutions } from './src/rules.js';

const here = dirname(fileURLToPath(import.meta.url));
const letters = JSON.parse(readFileSync(join(here, '..', '..', 'data', 'letters.json'), 'utf8')).letters;
const PACK = JSON.parse(readFileSync(join(here, '..', '..', 'rulesets', 'rulesets.json'), 'utf8'));
const DATA = JSON.parse(readFileSync(join(here, 'levels.json'), 'utf8'));
const PORTAL = PACK.rulesets.filter(r => r.kind === 'PORTAL');
const WORKSHOP = PACK.rulesets.find(r => r.id === 'workshop');
const TRACE = process.argv.includes('--trace');

let bad = 0;
for (const lv of DATA.floors) {
  const a = assess(lv, PORTAL, { letters });
  const flags = [];
  for (const r of PORTAL) if (!a.S[r.id].size) flags.push(`UNSOLVABLE under ${r.id}`);
  if (a.fair && a.minDistinct <= 0) {
    const same = Object.entries(a.distinct).filter(([, d]) => d <= 0).map(([k]) => k);
    flags.push(`NOT DISTINCT — same solutions under: ${same.join(', ')}`);
  }
  // the surface floor is played under the workshop, told: it only has to be solvable there
  const surface = solutions(lv, WORKSHOP, { letters });
  if (!surface.size) flags.push('UNSOLVABLE under the workshop (it is the surface floor for some seeds)');

  const sizes = PORTAL.map(r => `${r.id.slice(0, 5)} ${a.S[r.id].size}`).join(' · ');
  const line = `${lv.id.padEnd(22)} solutions: ${sizes}  ·  least-distinct pair ${a.minDistinct.toFixed(2)}  ·  universal ${a.universals.length}`;
  if (flags.length) { bad++; console.log('  FAIL ' + line + '\n         ' + flags.join('; ')); }
  else {
    console.log('  ok   ' + line);
    if (TRACE) for (const r of PORTAL) {
      const [key, path] = a.S[r.id].entries().next().value;
      console.log(`         ${r.id.padEnd(18)} ${key}   via ${path.map(p => p.word.join('') + '@' + p.cursor.join(',')).join(' ')}`);
    }
  }
}

// The run itself: every seed deals four floors; confirm each dealt (floor, ruleset)
// pairing is solvable, for a spread of seeds, through the same deal the game uses.
import { rng, shuffle } from './src/rules.js';
let dealsBad = 0;
for (let seed = 1; seed <= 25; seed++) {
  const dealt = shuffle(PORTAL, rng(seed));
  dealt.forEach((rs, i) => {
    const lv = DATA.floors[(i + 1) % DATA.floors.length];
    if (!solutions(lv, rs, { letters }).size) { dealsBad++; console.log(`  FAIL seed ${seed}: floor ${i + 1} (${lv.id}) unsolvable under ${rs.id}`); }
  });
}
if (!dealsBad) console.log(`  ok   25 seeds dealt; every floor of every run is solvable under the ruleset it was dealt`);

const uni = DATA.floors.filter(lv => assess(lv, PORTAL, { letters }).universals.length);
console.log(bad || dealsBad
  ? `\n${bad + dealsBad} check(s) failed`
  : `\n${DATA.floors.length} floors: fair under all four metaphysics, and every pair of them is distinct on every floor` +
    (uni.length ? `\n${uni.length} floor(s) still have a universal placement — said in the README, not hidden` : `\nno floor has a universal placement: you have to know where you are`));
process.exit(bad || dealsBad ? 1 : 0);
