// citations.js — resolve a seal's repo-internal source pointer to a real citation.
//
// The grounding seals have always carried a source string, but it was a repo-relative
// pointer ('BIOGRAPHY — Formation (Cairo)') — meaningful to a contributor, meaningless
// to a live-site player, and it traveled into published witnesses that way (AUDIT.md
// §4.3, deferred twice). The pointer stays (a reviewing scholar can find the exact
// section); the citation joins it, so a reader learns whose scholarship the seal is
// standing on without leaving the page.
//
// Bibliographic data from research/notes/*.md frontmatter — the three papers in hand.

const PAPERS =
  'Matthew Melvin-Koushki: “Prologue to Pythagorean Renaissance: Ibn Turka’s Investigations (1420) as ' +
  'Opening Anthem of the Scientific Revolution” (Intellectual History of the Islamicate World, 2025) ' +
  'and “The Occult Court” (Al-Masāq: Journal of the Medieval Mediterranean, 2025)';

// Longest-matching prefix wins. Order here is the match order.
const CITATIONS = [
  ['BIOGRAPHY', 'From the project’s synthesized biography of Ibn Turka, grounded in ' + PAPERS + '. The full dated record is on the site timeline.'],
  ['RESEARCH', 'From the project’s research brief, grounded in the same scholarship — principally “The Occult Court” (Al-Masāq, 2025), which translates ʿAlī Ṣafī’s Boon for the Khan, the period manual behind the feast-and-war material.'],
  ['VN c', 'Converted from the project’s visual-novel scene of the same event, grounded in Matthew Melvin-Koushki’s scholarship on Ibn Turka.'],
  ['The sīmiyā signature moment', 'The escape is imagined; the five-year exile it begins is attested — see Melvin-Koushki, “Prologue to Pythagorean Renaissance” (2025).'],
];

const DEFAULT_CITE =
  'Invented for play — the seal’s grounding tag says exactly how far the sources reach. The world around it follows Matthew Melvin-Koushki’s scholarship on Ibn Turka.';

export function resolveSource(source) {
  const s = String(source || '');
  for (const [prefix, cite] of CITATIONS) {
    if (s.startsWith(prefix)) return { pointer: s, cite };
  }
  return { pointer: s, cite: DEFAULT_CITE };
}
