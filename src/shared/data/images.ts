import type { Img } from '../commerce/types'

// every placeholder picture on the site lives here, so swapping one is a one-line change.
// the photographs are public-domain works from the art institute of chicago (cc0); see
// public/placeholders/photos/credits.json. none of them shows a jessi frances piece.

const photo = (name: string, width: number, height: number, altText: string): Img => ({
  url: `/placeholders/photos/${name}-1600.jpg`,
  smallUrl: `/placeholders/photos/${name}-800.jpg`,
  width,
  height,
  altText,
})

const drawing = (name: string, altText: string): Img => ({
  url: `/placeholders/products/${name}.svg`,
  width: 1200,
  height: 1500,
  altText,
})

export const images = {
  magnolias: photo('magnolias-on-light-blue-velvet-cloth', 1600, 983, 'A painting of white magnolia blossoms laid on a soft blue velvet cloth'),
  womanWriting: photo('the-letter', 1103, 1600, 'A print of a woman at a desk sealing a letter, in soft blues and warm browns'),
  letterConversation: photo('the-letter-or-the-spanish-conversation', 1156, 1600, 'An ink and wash drawing of two figures sharing a letter'),
  readingLetter: photo('reading-a-letter', 1600, 1176, 'A woodblock print of a woman reading a long letter'),
  sisters: photo('two-sisters-on-the-terrace', 1289, 1600, 'A painting of a young woman and a girl on a terrace among flowers and vines'),
  antiqueEarrings: photo('pair-of-earrings', 1600, 1199, 'A pair of antique gold earrings, photographed close on a dark ground'),

  huggie: drawing('huggie', 'Placeholder drawing of The First Huggie, a pair of fitted gold huggie earrings'),
  huggieDetail: drawing('huggie-detail', 'Placeholder drawing of The First Huggie seen close, showing the small loop for a Chapters drop'),
  chapterBeginning: drawing('chapter-the-beginning', 'Placeholder drawing of the Chapters drop The Beginning, a closed magnolia bud, hung from The First Huggie'),
  chapterBecoming: drawing('chapter-the-becoming', 'Placeholder drawing of the Chapters drop The Becoming, an open C set with a small opal, hung from The First Huggie'),
  chapterMother: drawing('chapter-the-mother', 'Placeholder drawing of the Chapters drop The Mother, a magnolia in full bloom, hung from The First Huggie'),
} satisfies Record<string, Img>

export function srcSet(img: Img): string | undefined {
  if (!img.smallUrl) return undefined
  return `${img.smallUrl} 800w, ${img.url} ${img.width}w`
}
