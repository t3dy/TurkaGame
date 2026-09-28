#!/usr/bin/env python3
"""Python and JavaScript must agree about the rules, move for move.

The rules live twice on purpose (CLAUDE.md rule 8): scripts/narrative_lib.py drives the linter and
the simulator, game/engine.js drives the game. Both are driven by the same 32-bit generator down
the same path (rulings, commitments, composer picks, the sorter's shuffle, then the choice) and
the final state of every run must match key for key.
"""
import json, os, subprocess, sys, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
sys.path.insert(0, HERE)

from lcg import LCG                                                             # noqa: E402
import narrative_lib as nl                                                      # noqa: E402

RUNS, SEED = 200, 1


def shuffle(items, rng):
    a = list(items)
    for i in range(len(a) - 1, 0, -1):
        j = rng.pick(i + 1)
        a[i], a[j] = a[j], a[i]
    return a


def run_python(content, seed):
    scenes, hyps = content["scenes"], content.get("hypotheses", {})
    sid, state, trail = content["start"], {}, []
    rng, guard = LCG(seed), 0
    while sid != "END" and guard < 500:
        guard += 1
        s = scenes[sid]
        if s.get("rulings"):
            answers = {r["id"]: ("stand" if rng.pick(2) else "refute") for r in s["rulings"]}
            state = nl.apply(nl.ruling_effects(s, answers), state)
        if s.get("commitment"):
            opts = [o["hypothesis"] for o in s["commitment"]["options"]]
            state = nl.apply(nl.commit_effects(hyps, state, s, opts[rng.pick(len(opts))]), state)
        if s.get("composer"):
            picks = {}
            for slot in s["composer"]["slots"]:
                picks[slot["id"]] = slot["options"][rng.pick(len(slot["options"]))]["id"]
            state = nl.apply(nl.composer_effects(s, picks), state)
        if s.get("sorter"):
            order = shuffle([i["id"] for i in s["sorter"]["items"]], rng)
            state = nl.apply(nl.sort_effects(s, order), state)
        opts = [c for c in s["choices"] if nl.available(c, state)]
        if not opts:
            trail.append([sid, "STUCK"])
            break
        c = opts[rng.pick(len(opts))]
        trail.append([sid, c["id"]])
        state = nl.apply(c["effects"], state)
        sid = c.get("next") or s["next"]
    return {"trail": trail, "state": state}


def load_content():
    """game/content.js is `window.CONTENT = {...};` — read the object out of it."""
    with open(os.path.join(ROOT, "game", "content.js"), encoding="utf-8") as f:
        raw = f.read()
    body = raw[raw.index("window.CONTENT =") + len("window.CONTENT ="):].rstrip()
    return json.loads(body.rstrip(";").strip())


class EngineParity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.content = load_content()
        proc = subprocess.run(["node", os.path.join(HERE, "parity.mjs"), str(RUNS), str(SEED)],
                              capture_output=True, text=True, encoding="utf-8", cwd=ROOT)
        if proc.returncode:
            raise unittest.SkipTest("node could not run parity.mjs: " + proc.stderr[:400])
        cls.js = json.loads(proc.stdout)

    def test_same_number_of_runs(self):
        self.assertEqual(len(self.js), RUNS)

    def test_trails_match(self):
        for i, js in enumerate(self.js):
            py = run_python(self.content, SEED + i)
            self.assertEqual([list(x) for x in py["trail"]], [list(x) for x in js["trail"]],
                             f"run {i}: the two engines took different paths")

    def test_states_match(self):
        for i, js in enumerate(self.js):
            py = run_python(self.content, SEED + i)
            self.assertEqual(py["state"], js["state"], f"run {i}: final state differs")

    def test_runs_are_not_all_identical(self):
        """A parity test that passes because nothing happens is worthless."""
        trails = {json.dumps(r["trail"]) for r in self.js}
        self.assertGreater(len(trails), RUNS // 4, "the seeded walks barely diverge")

    def test_every_run_reaches_the_end(self):
        for i, r in enumerate(self.js):
            self.assertNotEqual(r["trail"][-1][1], "STUCK", f"run {i} got stuck at {r['trail'][-1][0]}")

    def test_court_and_pressure_state_is_exercised(self):
        keys = set()
        for r in self.js:
            keys |= {k for k in r["state"] if k.startswith(("court.", "press."))}
        self.assertTrue(any(k.startswith("court.") for k in keys), "no run ever moved a court")
        self.assertTrue(any(k.startswith("press.") for k in keys), "no run ever moved a pressure")

    def test_commitment_is_exercised(self):
        if not any(s.get("commitment") for s in self.content["scenes"].values()):
            self.skipTest("no commitment scene built yet")
        committed = {r["state"].get("who.commit") for r in self.js}
        committed.discard(None)
        self.assertGreaterEqual(len(committed), 4, f"only {committed} were ever committed to")

    def test_sorter_is_exercised(self):
        if not any(s.get("sorter") for s in self.content["scenes"].values()):
            self.skipTest("no sorter scene built yet")
        dists = set()
        for r in self.js:
            dists |= {v for k, v in r["state"].items() if k.startswith("sort.") and k.endswith(".distance")}
        self.assertGreater(len(dists), 3, "the shuffled orders never varied")


if __name__ == "__main__":
    unittest.main(verbosity=2)
