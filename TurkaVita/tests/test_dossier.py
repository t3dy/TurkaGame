#!/usr/bin/env python3
"""The dispute mechanic: the dossier, the lens, the commitment, and the duress rule.

The game does not know who Ibn Turka was. What is tested is that the mechanic is honest: every
bearing points at real evidence of the kind it says, every reading says whose it is, the game's own
readings are a small minority, no position is unopposed, and the duress rule does what it says.
"""
import os, re, sys, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import narrative_lib as nl                                                      # noqa: E402


class Dispute(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.arts = nl.load_artifacts()
        cls.hyps = nl.load_hypotheses()
        if not cls.hyps:
            raise unittest.SkipTest("no hypotheses yet")

    def all_bearings(self):
        return [(h["id"], b) for h in self.hyps.values() for b in h["bearings"]]

    def test_every_bearing_points_at_evidence_of_the_kind_it_names(self):
        for hid, b in self.all_bearings():
            ev = self.arts.get(b["evidence"])
            self.assertIsNotNone(ev, f"{hid}: {b['evidence']}")
            self.assertEqual(ev["type"], "evidence")
            self.assertEqual(ev["evidence_kind"], b["kind"], f"{hid} {b['evidence']}")

    def test_every_reading_names_whose_it_is_and_the_games_own_are_a_minority(self):
        bearings = self.all_bearings()
        own = [1 for _, b in bearings if b["attributed_to"] == "design inference"]
        self.assertTrue(all(b["attributed_to"] for _, b in bearings))
        self.assertLess(len(own) / len(bearings), 0.25, f"{len(own)} of {len(bearings)} readings are the game's own")

    def test_no_position_is_unopposed_and_none_is_only_opposed(self):
        for h in self.hyps.values():
            dirs = {b["direction"] for b in h["bearings"]}
            self.assertIn("supports", dirs, h["id"])
            self.assertIn("strains", dirs, h["id"])

    def test_the_positions_share_one_dispute_and_one_is_underdetermined(self):
        self.assertEqual(len({h["dispute"] for h in self.hyps.values()}), 1)
        nonconv = [h["id"] for h in self.hyps.values() if not h["commitments"]["conviction"]]
        self.assertEqual(len(nonconv), 1, f"exactly one position should decline to say what he held: {nonconv}")

    def test_a_position_with_no_advocate_says_why_it_is_on_the_board(self):
        for h in self.hyps.values():
            if not h.get("proponents"):
                self.assertTrue(h.get("no_proponent_note"), h["id"])

    def test_the_positions_draw_on_every_kind_of_witness(self):
        kinds = {b["kind"] for _, b in self.all_bearings()}
        self.assertGreaterEqual(len(kinds), 8, f"only {sorted(kinds)}")
        self.assertTrue({"apology", "letter", "work", "colophon"} <= kinds)

    def test_HELD_KINDS_is_the_same_in_python_and_javascript(self):
        js = open(os.path.join(ROOT, "game", "engine.js"), encoding="utf-8").read()
        m = re.search(r"const HELD_KINDS = \[([^\]]*)\]", js)
        held = set(re.findall(r'"([a-z_]+)"', m.group(1)))
        self.assertEqual(held, nl.HELD_KINDS)


class DuressRule(unittest.TestCase):
    """The mechanic on synthetic dossiers, so it is tested whatever the data says."""

    SCENE = {"commitment": {"underdetermined_option": "HYP-F"}}

    def hyps(self):
        def h(letter, conviction, kinds):
            return {"id": f"HYP-{letter}", "letter": letter, "name": letter, "commitments": {"conviction": conviction},
                    "bearings": [{"evidence": f"EV-{letter}{i}", "kind": k, "direction": "supports", "attributed_to": "x", "reading": ""}
                                 for i, k in enumerate(kinds)]}
        return {"HYP-B": h("B", True, ["apology", "apology", "creed_tract"]),
                "HYP-D": h("D", True, ["work", "letter", "colophon"]),
                "HYP-F": h("F", False, ["work"])}

    def state(self, *ids):
        return {f"dossier.{i}": True for i in ids}

    def test_leaning_only_on_apologies_is_coerced_testimony(self):
        hy = self.hyps()
        st = self.state("EV-B0", "EV-B1", "EV-B2")
        tags = nl.commit_tags(hy, st, self.SCENE, "HYP-B")
        self.assertIn("coherent", tags)
        self.assertIn("coerced_testimony", tags)

    def test_leaning_on_free_writings_is_not(self):
        hy = self.hyps()
        st = self.state("EV-D0", "EV-D1", "EV-D2")
        tags = nl.commit_tags(hy, st, self.SCENE, "HYP-D")
        self.assertIn("coherent", tags)
        self.assertNotIn("coerced_testimony", tags)

    def test_a_close_dossier_makes_certainty_false_and_unknown_calibrated(self):
        hy = self.hyps()
        st = self.state("EV-B0", "EV-D0")
        self.assertIn("false_certainty", nl.commit_tags(hy, st, self.SCENE, "HYP-D"))
        self.assertEqual(nl.commit_tags(hy, st, self.SCENE, "HYP-F")[0], "calibrated_unknown")

    def test_an_empty_dossier_is_its_own_outcome(self):
        self.assertEqual(nl.commit_tags(self.hyps(), {}, self.SCENE, "HYP-D"), ["empty_dossier"])

    def test_a_lens_narrows_the_readings_on_show(self):
        hy = self.hyps()
        hy["HYP-D"]["bearings"][0]["attributed_to"] = "MK"
        st = dict(self.state("EV-D0", "EV-D1", "EV-D2"), lens="MK")
        row = next(r for r in nl.standings(hy, st) if r["id"] == "HYP-D")
        self.assertEqual(row["supports"], 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
