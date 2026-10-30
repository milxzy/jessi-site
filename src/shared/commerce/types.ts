// the app's own commerce types. adapters map into these so no component ever sees a shopify shape.

export interface Money {
  amount: string
  currencyCode: string
}

export interface Img {
  url: string
  altText: string
  width: number
  height: number
  // optional smaller rendition for srcset
  smallUrl?: string
}

export type Availability = 'available' | 'preorder' | 'sold-out'

export interface Variant {
  id: string
  title: string
  availableForSale: boolean
  availability: Availability
  price: Money
  selectedOptions: { name: string; value: string }[]
}

// read from product metafields (namespace "custom"); every field is optional so pages degrade quietly
export interface ProductDetails {
  materials?: string
  dimensions?: string
  care?: string
  compatibility?: string
  sizeGuide?: string
  meaning?: string
  fulfillmentNote?: string
}

export interface Product {
  id: string
  handle: string
  title: string
  // the shorter name used in lists, e.g. "The Becoming" for a chapter
  shortTitle: string
  description: string
  productType: string
  tags: string[]
  images: Img[]
  options: { name: string; values: string[] }[]
  variants: Variant[]
  priceFrom: Money
  availability: Availability
  details: ProductDetails
}

export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  image?: Img
}

export interface CartLine {
  id: string
  quantity: number
  variantId: string
  variantTitle: string
  productHandle: string
  productTitle: string
  image?: Img
  price: Money
  lineTotal: Money
  availability: Availability
  fulfillmentNote?: string
}

export interface Cart {
  id: string
  lines: CartLine[]
  totalQuantity: number
  subtotal: Money
  checkoutUrl: string
}

export interface SubscribeResult {
  ok: boolean
  message: string
}

export interface CommerceAdapter {
  readonly mode: 'mock' | 'shopify'
  listProducts(): Promise<Product[]>
  getProduct(handle: string): Promise<Product | null>
  getCollections(): Promise<Collection[]>
  getCollectionProducts(handle: string): Promise<Product[]>
  createCart(): Promise<Cart>
  getCart(): Promise<Cart | null>
  addToCart(variantId: string, quantity?: number): Promise<Cart>
  updateCartLine(lineId: string, quantity: number): Promise<Cart>
  removeFromCart(lineId: string): Promise<Cart>
  getCheckoutUrl(): Promise<string | null>
  subscribeEmail(email: string): Promise<SubscribeResult>
}
