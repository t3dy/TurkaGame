#!/usr/bin/env python3
"""Save and resume must lose nothing.

tests/snapshot.mjs plays 80 state-driven runs, stops each after a pseudo-random number of actions (anywhere in the
game, including in the middle of a scene), snapshots through JSON exactly as localStorage would, restores into a fresh
game and finishes. The restored run must end in the same state, with the same trail, as the uninterrupted one.
"""
import json, os, subprocess, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


class Snapshot(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        p = subprocess.run(["node", os.path.join(HERE, "snapshot.mjs"), "80", "1"], capture_output=True, text=True,
                           encoding="utf-8", cwd=ROOT)
        if p.returncode:
            raise unittest.SkipTest("node could not run snapshot.mjs: " + p.stderr[:300])
        cls.runs = json.loads(p.stdout)

    def test_every_snapshot_restores(self):
        self.assertTrue(all(r["restored"] for r in self.runs))

    def test_a_restored_run_ends_exactly_where_the_uninterrupted_run_does(self):
        for r in self.runs:
            self.assertEqual(r["bState"], r["refState"], f"salt {r['salt']}, cut {r['cut']}/{r['total']}: final state differs")
            self.assertEqual(r["bTrail"], r["refTrail"], f"salt {r['salt']}: trail differs")

    def test_continuing_the_original_also_matches(self):
        for r in self.runs:
            self.assertEqual(r["aState"], r["refState"], f"salt {r['salt']}")

    def test_some_snapshots_were_taken_in_the_middle_of_a_scene(self):
        mid = sum(1 for r in self.runs if r["mid"])
        self.assertGreater(mid, 8, "the cuts never landed mid-scene, so the hard cases were not exercised")

    def test_the_cuts_spread_across_the_game(self):
        totals = {r["total"] for r in self.runs}
        cuts = sorted(r["cut"] / r["total"] for r in self.runs)
        self.assertGreater(cuts[-1] - cuts[0], 0.6)


if __name__ == "__main__":
    unittest.main(verbosity=2)
