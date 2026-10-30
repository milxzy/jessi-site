import { CART_STORAGE_KEY } from '../config'
import type { Cart, CommerceAdapter } from '../types'
import { assertNoUserErrors, storefront } from './client'
import { mapCart, mapCollection, mapProduct, type SCart, type SCollection, type SProduct } from './mapping'
import * as Q from './queries'

// headless shopify through the storefront api and its cart api. shopify owns checkout.

type CartPayload = { cart: SCart | null; userErrors: { message: string }[] }

const storedId = () => {
  try {
    return localStorage.getItem(CART_STORAGE_KEY)
  } catch {
    return null
  }
}
const storeId = (id: string | null) => {
  try {
    if (id) localStorage.setItem(CART_STORAGE_KEY, id)
    else localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // private mode: the cart lives for this visit only
  }
}

function settle(payload: CartPayload): Cart {
  assertNoUserErrors(payload.userErrors)
  if (!payload.cart) throw new Error('The bag could not be updated.')
  storeId(payload.cart.id)
  return mapCart(payload.cart)
}

async function ensureCartId(): Promise<string> {
  const id = storedId()
  if (id) return id
  const cart = await shopifyAdapter.createCart()
  return cart.id
}

export const shopifyAdapter: CommerceAdapter = {
  mode: 'shopify',
  async listProducts() {
    const d = await storefront<{ products: { nodes: SProduct[] } }>(Q.Q_PRODUCTS)
    return d.products.nodes.map(mapProduct)
  },
  async getProduct(handle) {
    const d = await storefront<{ product: SProduct | null }>(Q.Q_PRODUCT, { handle })
    return d.product ? mapProduct(d.product) : null
  },
  async getCollections() {
    const d = await storefront<{ collections: { nodes: SCollection[] } }>(Q.Q_COLLECTIONS)
    return d.collections.nodes.map(mapCollection)
  },
  async getCollectionProducts(handle) {
    const d = await storefront<{ collection: { products: { nodes: SProduct[] } } | null }>(Q.Q_COLLECTION_PRODUCTS, { handle })
    return d.collection ? d.collection.products.nodes.map(mapProduct) : []
  },
  async createCart() {
    const d = await storefront<{ cartCreate: CartPayload }>(Q.M_CART_CREATE, { lines: [] })
    return settle(d.cartCreate)
  },
  async getCart() {
    const id = storedId()
    if (!id) return null
    const d = await storefront<{ cart: SCart | null }>(Q.Q_CART, { id })
    // carts expire after a while; forget the old id and start fresh next time
    if (!d.cart) {
      storeId(null)
      return null
    }
    return mapCart(d.cart)
  },
  async addToCart(variantId, quantity = 1) {
    const cartId = await ensureCartId()
    const d = await storefront<{ cartLinesAdd: CartPayload }>(Q.M_LINES_ADD, { cartId, lines: [{ merchandiseId: variantId, quantity }] })
    return settle(d.cartLinesAdd)
  },
  async updateCartLine(lineId, quantity) {
    const cartId = await ensureCartId()
    const d = await storefront<{ cartLinesUpdate: CartPayload }>(Q.M_LINES_UPDATE, { cartId, lines: [{ id: lineId, quantity }] })
    return settle(d.cartLinesUpdate)
  },
  async removeFromCart(lineId) {
    const cartId = await ensureCartId()
    const d = await storefront<{ cartLinesRemove: CartPayload }>(Q.M_LINES_REMOVE, { cartId, lineIds: [lineId] })
    return settle(d.cartLinesRemove)
  },
  async getCheckoutUrl() {
    const cart = await this.getCart()
    return cart && cart.lines.length ? cart.checkoutUrl : null
  },
  // the signup provider is still an open question (see readme). until it's chosen this validates
  // and reports success without sending the address anywhere.
  async subscribeEmail(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Enter an email address like name@example.com.' }
    return { ok: true, message: 'Thank you. You’re on the list for news from the house.' }
  },
}
