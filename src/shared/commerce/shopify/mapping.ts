import type { Availability, Cart, Collection, Img, Money, Product, ProductDetails, Variant } from '../types'

// the one place shopify shapes become app shapes

type SImage = { url: string; altText: string | null; width: number | null; height: number | null } | null

export interface SProduct {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  tags: string[]
  availableForSale: boolean
  images: { nodes: NonNullable<SImage>[] }
  options: { name: string; optionValues: { name: string }[] }[]
  priceRange: { minVariantPrice: Money }
  variants: {
    nodes: {
      id: string
      title: string
      availableForSale: boolean
      currentlyNotInStock: boolean
      price: Money
      selectedOptions: { name: string; value: string }[]
    }[]
  }
  metafields: ({ key: string; value: string } | null)[]
}

export interface SCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: Money }
  lines: {
    nodes: {
      id: string
      quantity: number
      cost: { totalAmount: Money }
      merchandise: {
        id: string
        title: string
        availableForSale: boolean
        currentlyNotInStock: boolean
        price: Money
        image: SImage
        product: {
          handle: string
          title: string
          featuredImage: SImage
          fulfillment: { value: string } | null
          preorder: { value: string } | null
        }
      }
    }[]
  }
}

export interface SCollection {
  id: string
  handle: string
  title: string
  description: string
  image: SImage
}

// shopify's cdn resizes on the fly with a width parameter
const sized = (url: string, w: number) => `${url}${url.includes('?') ? '&' : '?'}width=${w}`

export function mapImage(i: SImage, fallbackAlt: string): Img | undefined {
  if (!i) return undefined
  return {
    url: sized(i.url, 1600),
    smallUrl: sized(i.url, 800),
    altText: i.altText || fallbackAlt,
    width: i.width ?? 1200,
    height: i.height ?? 1500,
  }
}

// sold out when shopify won't sell it; preorder when it sells while out of stock, or when the
// product's custom.preorder metafield says so
function variantAvailability(v: { availableForSale: boolean; currentlyNotInStock: boolean }, forcedPreorder: boolean): Availability {
  if (!v.availableForSale) return 'sold-out'
  if (v.currentlyNotInStock || forcedPreorder) return 'preorder'
  return 'available'
}

export function rollUp(list: Availability[]): Availability {
  if (list.includes('available')) return 'available'
  if (list.includes('preorder')) return 'preorder'
  return 'sold-out'
}

export function mapProduct(p: SProduct): Product {
  const meta = Object.fromEntries(p.metafields.filter((m): m is { key: string; value: string } => !!m).map((m) => [m.key, m.value]))
  const forcedPreorder = meta.preorder === 'true'
  const variants: Variant[] = p.variants.nodes.map((v) => ({
    id: v.id,
    title: v.title === 'Default Title' ? 'Default' : v.title,
    availableForSale: v.availableForSale,
    availability: variantAvailability(v, forcedPreorder),
    price: v.price,
    selectedOptions: v.selectedOptions,
  }))
  const details: ProductDetails = {
    materials: meta.materials,
    dimensions: meta.dimensions,
    care: meta.care,
    compatibility: meta.chapters_compatibility,
    sizeGuide: meta.size_guide,
    meaning: meta.chapter_meaning,
    fulfillmentNote: meta.fulfillment_note,
  }
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    shortTitle: meta.short_title || p.title.replace(/^Chapters™?:\s*/, ''),
    description: p.description,
    productType: p.productType,
    tags: p.tags,
    images: p.images.nodes.map((i) => mapImage(i, p.title)).filter((i): i is Img => !!i),
    // a single "Title" option is shopify's way of saying no options
    options: p.options.filter((o) => o.name !== 'Title').map((o) => ({ name: o.name, values: o.optionValues.map((v) => v.name) })),
    variants,
    priceFrom: p.priceRange.minVariantPrice,
    availability: rollUp(variants.map((v) => v.availability)),
    details,
  }
}

export function mapCollection(c: SCollection): Collection {
  return { id: c.id, handle: c.handle, title: c.title, description: c.description, image: mapImage(c.image, c.title) }
}

export function mapCart(c: SCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotal: c.cost.subtotalAmount,
    lines: c.lines.nodes.map((l) => {
      const m = l.merchandise
      return {
        id: l.id,
        quantity: l.quantity,
        variantId: m.id,
        variantTitle: m.title === 'Default Title' ? '' : m.title,
        productHandle: m.product.handle,
        productTitle: m.product.title,
        image: mapImage(m.image ?? m.product.featuredImage, m.product.title),
        price: m.price,
        lineTotal: l.cost.totalAmount,
        availability: variantAvailability(m, m.product.preorder?.value === 'true'),
        fulfillmentNote: m.product.fulfillment?.value,
      }
    }),
  }
}
