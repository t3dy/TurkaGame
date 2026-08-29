// endings.js — computes one of several named endings from final state.
// Implements the sketch in ../STATE_MODEL.md. Priority-ordered: first match wins.
// This is a first-pass implementation of that sketch, not final narrative text.

const ENDINGS = {
  vindicated_martyr: {
    title: 'The Vindicated Martyr',
    text: 'You held firm through the third inquisition, as the histories say you did. Your work outlived the men who tried you for it — carried forward complete, by hands you trusted with it.',
  },
  lost_legacy: {
    title: 'The Lost Legacy',
    text: 'You held firm. But what you built did not survive intact — no one received the whole of it, and much of a life\'s work goes into the ground with you.',
  },
  new_brethren_endures: {
    title: 'The New Brethren Endures',
    text: 'You held firm, and you had never kept your circle small. The ideas survive you not through one clean heir, but scattered across a dozen students who each carry a piece forward.',
  },
  rehabilitated_judge: {
    title: 'The Rehabilitated Judge',
    text: 'You bent the knee, and it cost you your grandest ambitions. But the reputation you built defending the weak from the bench outlasted the scandal — you survive, specifically, as a judge.',
  },
  quiet_compromise: {
    title: 'The Quiet Compromise',
    text: 'You bent the knee. You survive, diminished, your system publicly qualified if not renounced. It is not the ending the histories record. It is an ending.',
  },
  solitary_sage: {
    title: 'The Solitary Sage',
    text: 'Exile became retreat, and retreat became a whole second life, small and private. Whatever influence this work has, it will not be felt in your lifetime.',
  },
  court_philosopher: {
    title: 'The Court Philosopher',
    text: 'You never gave your rivals the opening they needed. Caution, deferral, and a quiet register kept you below real notice — a different, less dramatic life than the one the histories record.',
  },
};

export function computeEnding(state) {
  const f = state.flags;
  const breadth = state.breadth();

  if (f.c34 === 'hold') {
    const transmissionComplete = f.c38 === 'entrust' && f.c03 === 'equal';
    const transmissionLost = f.c38 === 'keep';

    if (transmissionComplete && f.c39 === 'defiant') return ENDINGS.vindicated_martyr;
    if (transmissionLost) return ENDINGS.lost_legacy;
    if (f.c22 === 'wide') return ENDINGS.new_brethren_endures;
    return ENDINGS.vindicated_martyr; // hold-firm default
  }

  // c34 === 'bend'
  if (f.c27 === 'weak' && breadth >= 2) return ENDINGS.rehabilitated_judge;

  // Bend/hold-independent overrides, checked last so the inquisition outcome
  // still dominates in the common case.
  if (f.c36 === 'retreat' && breadth <= 1) return ENDINGS.solitary_sage;
  if (f.c09 === 'cautious' && f.c15 === 'delayed' && f.c21 === 'elite') return ENDINGS.court_philosopher;

  return ENDINGS.quiet_compromise; // bend default
}
