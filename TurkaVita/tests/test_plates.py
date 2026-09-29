#!/usr/bin/env python3
"""The illustrations (game/plates.js, game/img/): every one has a provenance record, an allowed
licence, an honest caption, and points at a scene or act that exists.

Rules from ../CLAUDE.md: no manuscript image without a provenance record in the registry;
period paintings, manuscripts and printed pages only (Ted, 2026-09-28).
"""
import hashlib, json, os, re, unittest, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
TV = os.path.dirname(HERE)
ROOT = os.path.dirname(TV)
GAME = os.path.join(TV, "game")
REG = os.path.join(ROOT, "assets", "manuscripts", "registry.json")
ACTS = ["hostage", "courts", "trials", "exile", "copyist", "historian"]
KINDS = {"painting", "manuscript", "printed"}
LICENCES = {"PD", "CC0", "CC-BY", "CC-BY-SA"}
NEGATION = re.compile(r"\b(not|no|nothing|neither|never)\b", re.I)


def load_plates():
    with open(os.path.join(GAME, "plates.js"), encoding="utf-8") as f:
        txt = f.read()
    body = txt[txt.index("window.PLATES") + len("window.PLATES"):].strip()
    body = body.lstrip("=").strip().rstrip(";")
    return json.loads(body)


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


class Plates(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.P = load_plates()
        cls.plates = cls.P["plates"]
        with open(REG, encoding="utf-8") as f:
            cls.reg = {r["id"]: r for r in json.load(f)}
        cls.scene_ids = {f[:-5] for f in os.listdir(os.path.join(TV, "narrative", "scenes"))
                         if f.startswith("SCN-") and f.endswith(".json")}

    def test_the_set_is_the_size_asked_for(self):
        self.assertTrue(36 <= len(self.plates) <= 42, len(self.plates))

    def test_every_plate_file_exists_and_is_small(self):
        total = 0
        for pid, p in self.plates.items():
            path = os.path.join(GAME, p["file"])
            self.assertTrue(os.path.isfile(path), "%s: missing %s" % (pid, path))
            size = os.path.getsize(path)
            total += size
            self.assertLess(size, 600 * 1024, "%s is %d KB" % (pid, size // 1024))
        self.assertLess(total, 14 * 1024 * 1024, "img set is %.1f MB" % (total / 1048576))

    def test_no_orphan_images_and_no_duplicates(self):
        on_disk = set(os.listdir(os.path.join(GAME, "img")))
        listed = {os.path.basename(p["file"]) for p in self.plates.values()}
        self.assertEqual(on_disk, listed)
        hashes = [sha(os.path.join(GAME, p["file"])) for p in self.plates.values()]
        self.assertEqual(len(hashes), len(set(hashes)), "two plates are the same image")

    def test_image_dimensions_within_budget(self):
        try:
            from PIL import Image
        except ImportError:
            self.skipTest("Pillow not installed")
        for pid, p in self.plates.items():
            with Image.open(os.path.join(GAME, p["file"])) as im:
                self.assertLessEqual(max(im.size), 1600, pid)

    def test_every_plate_has_a_registry_provenance_record(self):
        for pid, p in self.plates.items():
            r = self.reg.get(p["registry_id"])
            self.assertIsNotNone(r, "%s has no registry record %s" % (pid, p["registry_id"]))
            self.assertEqual(r["sha256"], p["sha256"], pid)
            src = os.path.join(ROOT, "assets", "manuscripts", r["local_file"])
            self.assertTrue(os.path.isfile(src), "%s: registry file missing" % pid)
            self.assertEqual(sha(src), r["sha256"], "%s: registry file changed" % pid)
            self.assertEqual(r["usage_status"], "approved", pid)
            self.assertTrue((r["rights_note"] or "").strip(), pid)
            self.assertTrue((r["digitization_source_url"] or "").startswith("https://"), pid)
            norm = lambda u: urllib.parse.unquote(u)          # Commons pages are quoted two ways
            self.assertEqual(norm(r["digitization_source_url"]), norm(p["source_url"]), pid)

    def test_kind_and_licence_are_allowed(self):
        for pid, p in self.plates.items():
            self.assertIn(p["kind"], KINDS, pid)
            self.assertIn(p["license"], LICENCES, pid)
            if p["license"] in ("CC-BY", "CC-BY-SA"):
                self.assertTrue(p["credit"].strip(), "%s needs a displayed credit" % pid)

    def test_alt_and_relevance_are_written_and_the_relevance_says_what_it_is_not(self):
        for pid, p in self.plates.items():
            for k in ("alt", "relevance", "title", "creator", "date", "institution", "source_url"):
                self.assertTrue(str(p.get(k, "")).strip(), "%s: empty %s" % (pid, k))
            self.assertGreater(len(p["alt"]), 40, pid)
            self.assertRegex(p["relevance"], NEGATION, "%s: relevance never says what the picture is not" % pid)
            self.assertTrue(p["relevance"].rstrip().endswith("."), pid)

    def test_no_modern_or_object_photography_slipped_in(self):
        banned = re.compile(r"astrolabe|globe|photograph of a (place|person)|render|AI-generated", re.I)
        for pid, p in self.plates.items():
            self.assertIsNone(banned.search(p["title"]), "%s: %s" % (pid, p["title"]))

    def test_every_scene_reference_exists_and_names_a_real_plate(self):
        for sc, pid in self.P["byScene"].items():
            self.assertIn(sc, self.scene_ids, sc)
            self.assertIn(pid, self.plates, "%s -> %s" % (sc, pid))
        self.assertGreaterEqual(len(self.P["byScene"]), 18, "too few scenes illustrated")

    def test_each_act_has_a_title_card_first(self):
        self.assertEqual(sorted(self.P["byAct"]), sorted(ACTS))
        cards = []
        for act in ACTS:
            ids = self.P["byAct"][act]
            self.assertTrue(ids, act)
            for i in ids:
                self.assertIn(i, self.plates, "%s -> %s" % (act, i))
            cards.append(ids[0])
        self.assertEqual(len(cards), len(set(cards)), "two acts share a title card")

    def test_a_scene_plate_belongs_to_its_act_or_is_listed_under_it(self):
        # not required, but a scene's plate must never be another act's title card
        cards = {self.P["byAct"][a][0]: a for a in ACTS}
        act_prefix = {"1": "hostage", "2": "courts", "3": "trials", "4": "exile", "5": "copyist", "6": "historian"}
        for sc, pid in self.P["byScene"].items():
            if pid in cards:
                self.assertEqual(cards[pid], act_prefix[sc[5]], "%s uses the %s title card" % (sc, cards[pid]))


if __name__ == "__main__":
    unittest.main()
