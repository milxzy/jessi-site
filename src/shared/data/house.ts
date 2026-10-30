// words of the house. everything not marked placeholder is quoted from the client's brand overview,
// website brief, or creative direction notes, and should stay as written.

export const house = {
  name: 'Jessi Frances',
  descriptor: 'The House of Becoming',
  signature: ['For the woman you are.', 'And the woman you’re becoming.'],
  signatureLine: 'For the woman you are. And the woman you’re becoming.',
  journalLine: 'A journal of women becoming.',
  chapterLine: 'Wear the chapter you’re in.',

  intro:
    'Jessi Frances is an emerging American luxury jewelry house rooted in family, memory, femininity, craftsmanship, and the belief that every woman’s story deserves to be honored.',
  ambition:
    'The ambition is to build a lasting maison: intimate in its storytelling, exacting in its quality, and expansive enough to one day include fine jewelry, leather goods, handbags, and meaningful heirloom objects.',
  wearQuote: 'She doesn’t wear jewelry to be noticed. She wears it to remember who she’s becoming.',

  frances: {
    heading: 'The woman behind the name',
    paragraphs: [
      'The house is named for Frances, the founder’s grandmother. Her life, love, perseverance, and typewritten words form the emotional origin of Jessi Frances.',
      'After Frances passed, her granddaughter discovered letters that revealed new dimensions of her strength and hope. The discovery transformed family memory into a larger idea: women carry stories worth preserving, and beauty can be a way of remembering.',
    ],
  },

  philosophy: {
    heading: 'The philosophy of becoming',
    lead: 'Celebrate how far she’s come. Love the woman she is. And remind her that she’s still becoming.',
    paragraphs: [
      'Becoming is not about being unfinished or insufficient. The woman she is today is already worthy of celebration. Her past matters; her present matters; and her future remains full of possibility.',
    ],
    quote: 'You are already someone worth celebrating. And you are still becoming.',
    triad: ['Celebrate how far she’s come.', 'Love the woman she is.', 'Remind her she’s still becoming.'],
  },

  values: [
    { title: 'Personal, not performative.', note: 'The story is true, and the emotional connection must be earned.' },
    { title: 'Artistic, not ornamental.', note: 'Every motif, detail, and design choice should have meaning.' },
    { title: 'Refined, not cold.', note: 'Luxury and warmth can coexist.' },
    { title: 'Timeless, not trend-driven.', note: 'We are building objects and traditions that can outlast a season.' },
    { title: 'Celebratory, not corrective.', note: 'A woman need not become someone else to be worthy today.' },
  ],

  northStar:
    'She is the woman she once dreamed of becoming. She deserves to celebrate how far she’s come, to love who she is today, and to look forward to all that is still unfolding. Not because she isn’t enough. But because her story isn’t finished.',

  // from the creative direction notes
  destination:
    'A destination women want to return to, not only because they want to purchase something, but because the House makes them feel seen, celebrated, and inspired.',

  tapestryIntro:
    'The House Tapestry is an annual illustrated chapter of the maison, not simply a repeating background pattern. Its symbols preserve family history, the life of the house, and the idea of becoming.',
  tapestryArc: 'Each subsequent year adds a new chapter. The connected ten-year masterwork is envisioned for MMXXVII–MMXXXVI.',

  journalIntro:
    'The editorial heart of the house: letters, reflections, women’s stories, and meaningful moments inspired by Frances’s own writing.',

  huggieLine: 'A foundational, carefully fitted huggie designed to be beautiful on its own.',
  chaptersLine: 'Interchangeable heirloom drops that honor a woman’s past, celebrate her present, and welcome what comes next.',
}

// the four doorways after the opening scene. names are the client's own.
export const doorways = [
  { key: 'house', title: 'The House', note: 'Frances, the philosophy of becoming, and the heritage of the house.', path: 'house' },
  { key: 'heirlooms', title: 'The Heirlooms', note: 'The First Huggie™ and Chapters™.', path: 'heirlooms' },
  { key: 'journal', title: 'The Frances Journal', note: 'A journal of women becoming.', path: 'journal' },
  { key: 'tapestry', title: 'The House Tapestry', note: 'The 2027 artwork, its symbols, and the archive to come.', path: 'tapestry' },
] as const

// placeholder letters. never presented as frances's words: each one says what will be there.
export const placeholderLetters = [
  {
    id: 'letter-one',
    dateline: 'Date to come', // placeholder
    salutation: 'Placeholder letter',
    body: [
      'This sheet holds the place of one of Frances’s typewritten letters.',
      'When the family chooses a letter to share, its transcription will be set here exactly as she typed it, with her spacing, her corrections, and her sign-off.',
      'Nothing on this page has been written in her voice.',
    ],
    signoff: 'Transcription to follow',
  },
  {
    id: 'letter-two',
    dateline: 'Date to come', // placeholder
    salutation: 'Placeholder letter',
    body: [
      'A second letter will sit here, perhaps with a scan of the original page beside it.',
      'Dates, names, and places will be added only as the family confirms them.',
    ],
    signoff: 'Transcription to follow',
  },
]

export const social = [
  { label: 'Instagram', href: '#instagram' }, // placeholder handle
  { label: 'Pinterest', href: '#pinterest' }, // placeholder handle
]

export const contactEmail = 'care@jessifrances.example' // placeholder
