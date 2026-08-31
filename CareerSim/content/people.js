// people.js — the full cast and artifact registry, shared across all phases.
// People are capability packages (DESIGN.md): they change what you can do, never
// what your numbers are. Grants are the capability tags encounters gate on.

export const PEOPLE = {
  // ---- Cairo formation ----
  akhlati: {
    name: 'Sayyid Ḥusayn Akhlāṭī',
    grants: ['esoteric_authority', 'heterodox_knowledge'],
    gloss: 'The master of the Cairo circle. His authority opens hidden doors; his infamy is contagious.',
  },
  qasim: {
    name: 'Qāsim-i Anvār',
    grants: ['poetry', 'sufi_network', 'popular_reach'],
    gloss: 'Sufi poet, beloved and reckless. His verses travel farther than any treatise — so does association with him.',
  },
  yazdi: {
    name: 'Sharaf al-Dīn ʿAlī Yazdī',
    grants: ['mathematics', 'historiography', 'manuscript_transmission'],
    gloss: 'A mathematician who thinks in histories. The one mind that can carry your system somewhere you cannot.',
  },

  // ---- Isfahan ----
  deputy: {
    name: 'Your Deputy at the Tribunal',
    grants: ['legal_delegation'],
    gloss: 'A competent junior who can hold the court while you work. Competence like that has its own ambitions.',
  },
  copyist: {
    name: 'The Isfahan Copyist',
    grants: ['manuscript_production', 'circulation'],
    gloss: 'A warrāq who copies fast and asks no questions. Circulation begins with one person willing to duplicate you.',
  },

  // ---- The courts ----
  iskandar: {
    name: 'Iskandar Sultan',
    grants: ['royal_patronage', 'atelier_access', 'experimental_court'],
    gloss: 'Timurid prince of Fars: star science, poetry and painting in one workshop. Brilliant, ambitious, and on a collision course with his uncle.',
  },
  baysunghur: {
    name: 'Bāysunghur',
    grants: ['royal_patronage', 'atelier_access', 'calligraphic_authority'],
    gloss: 'Shāh Rukh’s son, a fine calligrapher in his own right. The stable patron — and the one who cares how a thing looks on the page.',
  },
  calligrapher: {
    name: 'The Court Calligrapher',
    grants: ['inscription', 'manuscript_production'],
    gloss: 'She reads letters as shapes before she reads them as words — which is closer to your science than most philosophers get.',
  },
  astronomer: {
    name: 'The Samarkand Astronomer',
    grants: ['astronomical_apparatus', 'observation'],
    gloss: 'One of Ulugh Beg’s computers. Tables, not talismans — but he will hear you out if the mathematics holds.',
  },
  rival: {
    name: 'Your Rival at Court',
    grants: [],
    gloss: 'Every court has one. He is not stupid, he is not wrong about everything, and he is patient.',
  },
  student: {
    name: 'The Persistent Student',
    grants: ['teaching', 'circulation'],
    gloss: 'Turned up, stayed, copied everything. Transmission has a face and this is it.',
  },
};

export const ARTIFACTS = {
  letter_grid_ms: {
    name: 'The Letter-Grid Manuscript',
    gloss: 'An unattributed treatise of number-letter tables, bought in the bazaar. Whoever wrote it thought in your direction first.',
  },
  investigations: {
    name: 'Investigations (Kitāb al-Mafāḥiṣ)',
    gloss: 'The summa. The first systematic formulation of lettrism — if you finish it, and if anyone can read it.',
  },
  tahawi_circle: {
    name: 'The Ṭahawī Circle',
    gloss: 'The Tetractys remade as a lettrist cosmogram. The diagram your system will be remembered by, or forgotten with.',
  },
  splitting_moon: {
    name: 'On the Splitting of the Moon and the Last Hour',
    gloss: 'A Persian treatise ranking the ways of knowing, lettrism at the apex. Shorter than the summa, and far more quotable by your enemies.',
  },
  persian_primer: {
    name: 'The Persian Primer',
    gloss: 'The system, simplified, in the language warlords actually read. Reach bought with precision.',
  },
  horoscope: {
    name: 'The Dynastic Horoscope',
    gloss: 'A ruler’s nativity read through both stars and the letters of his name. Political dynamite in a folded sheet.',
  },
};
