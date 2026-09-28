#!/usr/bin/env python3
# simulate.py — state simulation: cheap, no prose, no model. Enumerates paths through the scene
# graph (exhaustive while small; N random walks when not) and reports what the design does.
#
#   python scripts/simulate.py
#   python scripts/simulate.py --random 20000
import argparse, collections, random, sys
from narrative_lib import (AXES, available, apply, commit_effects, commit_outcomes, composer_effects,
                           composer_outcomes, first_scene, load_hypotheses, load_scenes, ruling_effects,
                           ruling_outcomes, sort_effects, sort_outcomes)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def paths(scenes, hyps, sid, state, trail, out, limit):
    if len(out) >= limit:
        return
    if sid == "END":
        out.append((trail, state))
        return
    s = scenes[sid]
    for answers in ruling_outcomes(s):
        st0 = apply(ruling_effects(s, answers), state)
        for hyp in commit_outcomes(hyps, s, st0):
            st1 = apply(commit_effects(hyps, st0, s, hyp), st0) if hyp else st0
            for picks in composer_outcomes(s):
                st2 = apply(composer_effects(s, picks), st1)
                for order in sort_outcomes(s):
                    st = apply(sort_effects(s, order), st2) if order else st2
                    opts = [c for c in s["choices"] if available(c, st)]
                    if not opts:
                        out.append((trail + [(sid, "STUCK")], st))
                        continue
                    for c in opts:
                        paths(scenes, hyps, c.get("next") or s["next"], apply(c["effects"], st),
                              trail + [(sid, c["id"])], out, limit)


def walk(scenes, hyps, start, rng):
    sid, state, trail = start, {}, []
    while sid != "END":
        s = scenes[sid]
        if s.get("rulings"):
            state = apply(ruling_effects(s, {r["id"]: rng.choice(["stand", "refute"]) for r in s["rulings"]}), state)
        if s.get("commitment"):
            hyp = rng.choice([o["hypothesis"] for o in s["commitment"]["options"]])
            state = apply(commit_effects(hyps, state, s, hyp), state)
        if s.get("composer"):
            state = apply(composer_effects(s, {x["id"]: rng.choice(x["options"])["id"] for x in s["composer"]["slots"]}), state)
        if s.get("sorter"):
            order = [i["id"] for i in s["sorter"]["items"]]
            rng.shuffle(order)
            state = apply(sort_effects(s, order), state)
        opts = [c for c in s["choices"] if available(c, state)]
        if not opts:
            return trail + [(sid, "STUCK")], state
        c = rng.choice(opts)
        trail.append((sid, c["id"]))
        state = apply(c["effects"], state)
        sid = c.get("next") or s["next"]
    return trail, state


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--random", type=int, default=0)
    ap.add_argument("--seed", type=int, default=1)
    a = ap.parse_args()
    scenes, hyps = load_scenes(), load_hypotheses()
    start = first_scene(scenes)

    if a.random:
        rng = random.Random(a.seed)
        runs = [walk(scenes, hyps, start, rng) for _ in range(a.random)]
        mode = f"{a.random} random walks"
    else:
        runs = []
        limit = 1_000_000
        paths(scenes, hyps, start, {}, [], runs, limit)
        mode = "exhaustive" if len(runs) < limit else f"TRUNCATED at {limit} paths (not exhaustive — use --random)"

    stuck = [r for r in runs if r[0][-1][1] == "STUCK"]
    scores = collections.Counter(tuple(r[1].get(f"score.{x}", 0) for x in AXES) for r in runs)
    picked = collections.Counter(step for r in runs for step in r[0])
    offered = collections.Counter()
    for sid, s in scenes.items():
        for c in s["choices"]:
            offered[(sid, c["id"])] = 0
    for k in picked:
        offered[k] = picked[k]

    print(f"{mode}: {len(runs)} playthroughs from {start}; {len(stuck)} stuck")
    print(f"distinct score vectors ({'/'.join(AXES)}): {len(scores)}")
    for vec, n in scores.most_common(6):
        print(f"   {vec}  x{n}")
    exp = collections.Counter(min(3, int(r[1].get("press.exposure", 0))) for r in runs)
    print("exposure at the end (0..3+):", dict(sorted(exp.items())))
    never = [k for k, v in offered.items() if v == 0]
    print("choices never reachable:", never or "none")
    if stuck:
        print("stuck at:", collections.Counter(r[0][-1][0] for r in stuck).most_common(5))

    best = {}
    for trail, state in runs:
        vec = tuple(state.get(f"score.{x}", 0) for x in AXES)
        for step in trail:
            best.setdefault(step, []).append(vec)
    for sid, s in scenes.items():
        ids = [c["id"] for c in s["choices"] if (sid, c["id"]) in best]
        for x in ids:
            for y in ids:
                if x == y:
                    continue
                mx = [max(v[i] for v in best[(sid, x)]) for i in range(len(AXES))]
                my = [min(v[i] for v in best[(sid, y)]) for i in range(len(AXES))]
                if all(p <= q for p, q in zip(mx, my)) and mx != my:
                    print(f"dominated: {sid} {x} is never better than {y} on any axis")
    return 1 if stuck else 0


if __name__ == "__main__":
    sys.exit(main())
