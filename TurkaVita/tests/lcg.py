# lcg.py — a 32-bit linear congruential generator that Python and JavaScript agree about
# exactly. Numbers stay under 2^53 at every step, so JS doubles are lossless and the two
# engines can be driven down the identical path. Used only by the parity test.
MOD = 4294967296
A, C = 1664525, 1013904223


class LCG:
    def __init__(self, seed):
        self.s = seed % MOD

    def next(self):
        self.s = (A * self.s + C) % MOD
        return self.s

    def pick(self, n):
        """Index into a list of n items, from the high bits."""
        return (self.next() // 65536) % n
