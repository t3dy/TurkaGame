// parity.mjs — drive game/engine.js through N seeded playthroughs and print the final state of each
// as JSON. tests/test_engine_parity.py drives scripts/narrative_lib.py down the identical path with
// the identical generator and diffs the results.
//
//   node tests/parity.mjs <runs> <seed>
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MOD = 4294967296, A = 1664525, C = 1013904223;

class LCG {
  constructor(seed) { this.s = seed % MOD; }
  next() { this.s = (A * this.s + C) % MOD; return this.s; }
  pick(n) { return Math.floor(this.next() / 65536) % n; }
}

const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const f of ["game/content.js", "game/engine.js"]) {
  vm.runInContext(readFileSync(join(ROOT, f), "utf8"), sandbox, { filename: f });
}
const { CONTENT, TurkaEngine } = sandbox.window;

function shuffle(items, rng) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = rng.pick(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function run(seed) {
  const game = TurkaEngine.createGame(CONTENT);
  const rng = new LCG(seed);
  const trail = [];
  let guard = 0;
  while (game.scene && guard++ < 500) {
    const s = game.scene;
    for (const r of s.rulings || []) game.rule(r.id, rng.pick(2) ? "stand" : "refute");
    if (s.commitment) {
      const opts = s.commitment.options.map((o) => o.hypothesis);
      game.commit(opts[rng.pick(opts.length)]);
    }
    if (s.composer) for (const slot of s.composer.slots) game.pick(slot.id, slot.options[rng.pick(slot.options.length)].id);
    if (s.sorter) game.sort(shuffle(s.sorter.items.map((i) => i.id), rng));
    const opts = game.options();
    if (!opts.length) { trail.push([s.id, "STUCK"]); break; }
    const c = opts[rng.pick(opts.length)];
    trail.push([s.id, c.id]);
    game.choose(c.id);
    game.advance();
  }
  return { trail, state: game.state };
}

const runs = Number(process.argv[2] || 200);
const seed0 = Number(process.argv[3] || 1);
const out = [];
for (let i = 0; i < runs; i++) out.push(run(seed0 + i));
process.stdout.write(JSON.stringify(out));
