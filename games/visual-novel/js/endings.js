// endings.js — computes one of several named endings from final state, plus a
// short epilogue coda personalized by how the player faced the end.
// Implements the sketch in ../STATE_MODEL.md. Priority-ordered: first match wins.
//
// Ordering note (2026-08-30 fix): "The Court Philosopher" is the avoided-the-fate
// branch — earlier caution kept the third inquisition from ever having real teeth —
// so it is checked BEFORE the bend/hold split, not inside the bend branch (where it
// contradicted its own premise). "The Solitary Sage" (a fully withdrawn exile) is
// likewise reachable from either branch.

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
    text: 'Exile became retreat, and retreat became a whole second life — small, silent, and entirely your own. Whatever influence this work has, it will not be felt in your lifetime.',
  },
  court_philosopher: {
    title: 'The Court Philosopher',
    text: 'You never gave your rivals the opening they needed. Caution, deferral, and a quiet register kept you below real notice — when the third tribunal convened, it found nothing it could hold. A different, less dramatic life than the one the histories record.',
  },
};

export function computeEnding(state) {
  const f = state.flags;
  const breadth = state.breadth();

  // The avoided-the-fate branch: a lifetime of deliberate quietness defuses the
  // third inquisition regardless of how the player answered it in the moment.
  if (f.c09 === 'cautious' && f.c15 === 'delayed' && f.c21 === 'elite' && f.c22 === 'small') {
    return ENDINGS.court_philosopher;
  }

  // The full withdrawal: reachable whether you bent or held.
  if (f.c36 === 'retreat' && f.c37 === 'silent' && f.c22 === 'small') {
    return ENDINGS.solitary_sage;
  }

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
  return ENDINGS.quiet_compromise;
}

// A one-or-two-sentence coda, personalized by how the player faced the end —
// makes each run's final screen feel like *their* run, not just their ending bucket.
export function epilogueFor(state) {
  const f = state.flags;
  const parts = [];

  if (f.c39 === 'peace') {
    parts.push('You died reconciled to what it all cost — which is more than most of the men who tried you managed.');
  } else if (f.c39 === 'bitter') {
    parts.push('You died angry, and you were not wrong to. The anger is in the margins of everything you wrote that last year.');
  } else if (f.c39 === 'defiant') {
    parts.push('You died certain that history would come around. It took five centuries longer than you expected.');
  }

  if (f.c40 === 'public') {
    parts.push('Your final statement circulated openly — copied, argued with, condemned, and therefore preserved.');
  } else if (f.c40 === 'quiet') {
    parts.push('Your last transmission went to the New Brethren alone. Smaller. Much harder to burn.');
  }

  return parts.join(' ');
}
