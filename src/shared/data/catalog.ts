import type { Collection, Product, Variant } from '../commerce/types'
import { images } from './images'

// the mock catalog. it mirrors what the shopify store will hold, so the design can be judged at full density.
// every price, size, material and note below is placeholder until the house confirms it.
// availability is mixed on purpose so each concept shows available, preorder and sold-out states.

const usd = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: 'USD' })

const PREORDER_NOTE = 'Placeholder: preorders ship with the first collection in January 2027. We will confirm your date by email.' // placeholder

const huggieSizes: [string, Variant['availability']][] = [
  ['8 mm', 'preorder'],
  ['9.5 mm', 'preorder'],
  ['11 mm', 'sold-out'],
]

const huggie: Product = {
  id: 'mock-product-huggie',
  handle: 'the-first-huggie',
  title: 'The First Huggie™',
  shortTitle: 'The First Huggie',
  // from the brand overview, section 07
  description: 'A foundational, carefully fitted huggie designed to be beautiful on its own, with an unobtrusive connection for removable drops.',
  productType: 'Huggie',
  tags: ['huggie', 'foundation'],
  images: [images.huggie, images.huggieDetail],
  options: [{ name: 'Size', values: huggieSizes.map(([s]) => s) }],
  variants: huggieSizes.map(([size, availability], i) => ({
    id: `mock-variant-huggie-${i}`,
    title: size,
    availableForSale: availability !== 'sold-out',
    availability,
    price: usd(420), // placeholder
    selectedOptions: [{ name: 'Size', value: size }],
  })),
  priceFrom: usd(420),
  availability: 'preorder',
  details: {
    materials: 'Placeholder: solid gold, finished by hand. Metal and karat to be confirmed.', // placeholder
    dimensions: 'Placeholder: inner diameter 8, 9.5 or 11 mm. Width and weight to be confirmed.', // placeholder
    sizeGuide: 'Placeholder guidance: 8 mm sits closest to the lobe, 9.5 mm is the everyday fit, and 11 mm leaves a little air. If you are between sizes, choose the larger.', // placeholder
    care: 'Placeholder: remove before swimming or bathing. Polish gently with a soft dry cloth.', // placeholder
    compatibility: 'Every Chapters drop attaches to The First Huggie through its small loop, in every size.', // placeholder
    fulfillmentNote: PREORDER_NOTE,
  },
}

interface ChapterSeed {
  handle: string
  name: string
  meaning: string
  image: typeof images.chapterBeginning
  availability: Variant['availability']
  price: number
}

// chapter meanings are placeholder copy, written to the brand overview's line:
// drops that "honor a woman's past, celebrate her present, and welcome what comes next."
const chapterSeeds: ChapterSeed[] = [
  {
    handle: 'chapter-the-beginning',
    name: 'The Beginning',
    meaning: 'For a first step, a new place, or a fresh start. Placeholder meaning, to be written by the founder.', // placeholder
    image: images.chapterBeginning,
    availability: 'available',
    price: 260,
  },
  {
    handle: 'chapter-the-becoming',
    name: 'The Becoming',
    meaning: 'For the woman in the middle of it, already worth celebrating and still unfolding. Placeholder meaning, to be written by the founder.', // placeholder
    image: images.chapterBecoming,
    availability: 'preorder',
    price: 340,
  },
  {
    handle: 'chapter-the-mother',
    name: 'The Mother',
    meaning: 'For the women who raise, carry and hold others. Placeholder meaning, to be written by the founder.', // placeholder
    image: images.chapterMother,
    availability: 'sold-out',
    price: 380,
  },
]

const chapters: Product[] = chapterSeeds.map((c) => ({
  id: `mock-product-${c.handle}`,
  handle: c.handle,
  title: `Chapters™: ${c.name}`,
  shortTitle: c.name,
  description: c.meaning,
  productType: 'Chapter',
  tags: ['chapters'],
  images: [c.image],
  options: [],
  variants: [
    {
      id: `mock-variant-${c.handle}`,
      title: 'Default',
      availableForSale: c.availability !== 'sold-out',
      availability: c.availability,
      price: usd(c.price), // placeholder
      selectedOptions: [],
    },
  ],
  priceFrom: usd(c.price),
  availability: c.availability,
  details: {
    meaning: c.meaning,
    materials: 'Placeholder: solid gold to match The First Huggie. Stones, where used, to be confirmed.', // placeholder
    dimensions: 'Placeholder: drop length to be confirmed.', // placeholder
    care: 'Placeholder: detach the drop before sleeping. Store each chapter in its own pouch.', // placeholder
    compatibility: 'Made for The First Huggie. Attaches and detaches through the huggie’s small loop.', // placeholder
    fulfillmentNote: c.availability === 'preorder' ? PREORDER_NOTE : undefined,
  },
}))

export const mockProducts: Product[] = [huggie, ...chapters]

export const mockCollections: (Collection & { productHandles: string[] })[] = [
  {
    id: 'mock-collection-first-huggie',
    handle: 'the-first-huggie',
    title: 'The First Huggie™',
    description: 'The foundation of the house: one fitted huggie, made to be worn alone or with a chapter.',
    image: images.huggie,
    productHandles: ['the-first-huggie'],
  },
  {
    id: 'mock-collection-chapters',
    handle: 'chapters',
    title: 'Chapters™',
    description: 'Interchangeable heirloom drops that honor a woman’s past, celebrate her present, and welcome what comes next.',
    image: images.chapterBecoming,
    productHandles: chapters.map((c) => c.handle),
  },
]

// the objects still in the workshop. mentioned quietly, never sold.
export const forthcoming = [
  {
    name: 'The Becoming Bangle',
    note: 'A future signature two-tone object, with considered engineering, closure, and subtle house details. Craftsmanship comes before a launch date.',
  },
  {
    name: 'The First Promise™',
    note: 'An heirloom ring intended to grow with its wearer. A longer-term piece, still in development.',
  },
]
