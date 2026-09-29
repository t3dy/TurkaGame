// snapshot.mjs — save/resume must be lossless. The player here is STATE-DRIVEN: each action depends only on what the
// game currently shows (plus a salt), so a run can stop after any action, be snapshotted (through JSON, as localStorage
// would), restored into a brand-new game, and continue exactly as the uninterrupted run does. That includes stopping in
// the middle of a scene: rulings half-answered, a composer half-picked, a choice made but not yet continued.
//
//   node tests/snapshot.mjs <runs> <salt0>
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const f of ["game/content.js", "game/engine.js"]) vm.runInContext(readFileSync(join(ROOT, f), "utf8"), sandbox, { filename: f });
const { CONTENT, TurkaEngine } = sandbox.window;

const h = (str) => { let x = 2166136261; for (const c of str) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0; } return x >>> 0; };

// perform exactly one atomic UI action; return false when the run is over
function act(g, salt) {
  const s = g.scene;
  if (!s) return false;
  const pick = (tag, n) => h(`${salt}|${s.id}|${tag}`) % n;
  if (g.pending) { g.advance(); return true; }
  const openRuling = (s.rulings || []).find((r) => !g.answers[r.id]);
  if (openRuling) { g.rule(openRuling.id, pick(openRuling.id, 2) ? "stand" : "refute"); return true; }
  if (!g.commitmentDone()) { const o = s.commitment.options; g.commit(o[pick("commit", o.length)].hypothesis); return true; }
  if (!g.composerDone()) {
    const slot = s.composer.slots.find((x) => !g.picks[x.id]);
    g.pick(slot.id, slot.options[pick(slot.id, slot.options.length)].id); return true;
  }
  if (!g.sorterDone()) {
    const ids = s.sorter.items.map((i) => i.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = pick("sort" + i, i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    g.sort(ids); return true;
  }
  const o = g.options();
  g.choose(o[pick("choice", o.length)].id); return true;
}

function finish(g, salt) { let n = 0; while (act(g, salt)) n++; return n; }

const runs = Number(process.argv[2] || 80), salt0 = Number(process.argv[3] || 1);
const out = [];
for (let i = 0; i < runs; i++) {
  const salt = String(salt0 + i);
  const ref = TurkaEngine.createGame(CONTENT);
  const total = finish(ref, salt);
  const cut = h("cut|" + salt) % total;           // stop after `cut` actions: anywhere, including mid-scene
  const a = TurkaEngine.createGame(CONTENT);
  for (let k = 0; k < cut; k++) act(a, salt);
  const snap = JSON.parse(JSON.stringify(a.snapshot()));
  const b = TurkaEngine.createGame(CONTENT);
  const restored = b.restore(snap);
  finish(b, salt); finish(a, salt);
  out.push({ salt, cut, total, restored, mid: !!(snap.pendingId || Object.keys(snap.answers).length || Object.keys(snap.picks).length),
    refState: ref.state, bState: b.state, aState: a.state, refTrail: ref.trail, bTrail: b.trail });
}
process.stdout.write(JSON.stringify(out));
