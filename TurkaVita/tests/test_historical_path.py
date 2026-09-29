#!/usr/bin/env python3
"""The historical path must always be open.

Walk the game the way the record goes: in each scene take the choice marked "historical" (in a scene
marked "unrecorded", the first unconditional choice). Answer every ruling wrongly, take the first
option in every composer slot, put the sorter's items in reverse, and commit to the UNKNOWN position:
the worst answers the player can give that are not choices. If any historical choice is then closed,
if a scene has no available choice, or if the walk never reaches END, an earlier scene has failed to pay
for a later one, and a player who follows the sources would be stranded by the gates.
"""
import os, sys, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "scripts"))
import narrative_lib as nl                                                      # noqa: E402


historical_walk = nl.historical_walk


class HistoricalPath(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scenes, cls.hyps = nl.load_scenes(), nl.load_hypotheses()

    def test_the_record_can_always_be_followed(self):
        if not self.scenes:
            self.skipTest("no scenes")
        trail, state, problem = historical_walk(self.scenes, self.hyps)
        self.assertIsNone(problem, problem)

    def test_at_most_one_historical_choice_per_scene(self):
        for sid, s in self.scenes.items():
            n = sum(1 for c in s["choices"] if c.get("historical"))
            self.assertLessEqual(n, 1, f"{sid} marks {n} choices historical")
            if s.get("unrecorded"):
                self.assertEqual(n, 0, f"{sid} is unrecorded but marks a historical choice")

    def test_a_historical_choice_is_not_a_counterfactual(self):
        for sid, s in self.scenes.items():
            for c in s["choices"]:
                if c.get("historical"):
                    self.assertNotEqual(c["epistemic_label"], "counterfactual", f"{sid} {c['id']}")

    def test_a_counterfactual_says_the_game_rejoins_the_record(self):
        for sid, s in self.scenes.items():
            for c in s["choices"]:
                if c["epistemic_label"] == "counterfactual" and s["act"] != "historian":
                    fb = c.get("feedback", "").lower()
                    self.assertTrue("record" in fb or "sources" in fb,
                                    f"{sid} {c['id']}: a counterfactual's feedback must say where the sources put him")


if __name__ == "__main__":
    unittest.main(verbosity=2)
