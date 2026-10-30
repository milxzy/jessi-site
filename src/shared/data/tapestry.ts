// the house tapestry. swapping in madi's artwork means changing only this file:
// point desktopSrc / mobileSrc (and layers, if she supplies them) at the new exports,
// update credit and alt, and set isPlaceholder to false.

export interface TapestryLayer {
  id: 'ground' | 'vines' | 'bloom' | 'symbols' | (string & {})
  desktopSrc: string
  mobileSrc: string
  // how far the layer drifts on scroll, 0 = fixed to the ground. used only where motion is allowed.
  depth: number
}

export interface TapestryChapter {
  year: number
  roman: string
  title: string
  desktopSrc: string
  mobileSrc: string
  width: number
  height: number
  mobileWidth: number
  mobileHeight: number
  layers?: TapestryLayer[]
  credit: string
  alt: string
  previewDate?: string
  isPlaceholder: boolean
  // what a visitor might look for. written as invitations, never as the artist's stated intent.
  motifs: { name: string; note: string }[]
}

const base = '/placeholders/tapestry/2027'

export const tapestryConfig: TapestryChapter = {
  year: 2027,
  roman: 'MMXXVII',
  title: 'The 2027 House Tapestry',
  desktopSrc: `${base}-desktop.svg`,
  mobileSrc: `${base}-mobile.svg`,
  width: 1600,
  height: 1000,
  mobileWidth: 900,
  mobileHeight: 1500,
  layers: (['ground', 'vines', 'bloom', 'symbols'] as const).map((id, i) => ({
    id,
    desktopSrc: `${base}-desktop-${id}.svg`,
    mobileSrc: `${base}-mobile-${id}.svg`,
    depth: [0, 0.04, 0.09, 0.06][i] ?? 0,
  })),
  credit: 'Illustrated by Madi for Jessi Frances', // placeholder: confirm exact credit wording with madi
  alt: 'Placeholder for the 2027 House Tapestry: a tree with deep roots inside an open gold circle, a magnolia blooming through its opening, a crescent moon and a sun above, climbing vines at either side, and a keyhole in laurel over the year MMXXVII.',
  previewDate: '2026-11-08',
  isPlaceholder: true,
  // placeholder: symbol notes to be replaced with the founder's or madi's own words
  motifs: [
    { name: 'The open C', note: 'A circle left unclosed, so there is always room to grow.' },
    { name: 'Magnolia, bud and bloom', note: 'Both stages at once: what has opened, and what is still to come.' },
    { name: 'Roots', note: 'Family and memory, holding the tree in place.' },
    { name: 'Moon and sun', note: 'The quiet hours and the bright ones, both part of the story.' },
    { name: 'The keyhole', note: 'A small door for those who look closely.' },
    { name: 'Laurel', note: 'A wreath for how far she has come.' },
  ],
}

// the connected ten-year masterwork is envisioned for mmxxvii to mmxxxvi (brand overview, section 05)
export const tapestryYears: { year: number; roman: string }[] = [
  [2027, 'MMXXVII'],
  [2028, 'MMXXVIII'],
  [2029, 'MMXXIX'],
  [2030, 'MMXXX'],
  [2031, 'MMXXXI'],
  [2032, 'MMXXXII'],
  [2033, 'MMXXXIII'],
  [2034, 'MMXXXIV'],
  [2035, 'MMXXXV'],
  [2036, 'MMXXXVI'],
].map(([year, roman]) => ({ year: year as number, roman: roman as string }))

// the archive: every published year. add each new chapter here (or, later, as a shopify metaobject).
export const tapestryArchive: TapestryChapter[] = [tapestryConfig]
