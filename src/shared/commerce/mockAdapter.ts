import { mockCollections, mockProducts } from '../data/catalog'
import { CART_STORAGE_KEY } from './config'
import type { Cart, CartLine, CommerceAdapter, Money, Product } from './types'

// serves the placeholder catalog with a cart kept in localStorage, so the presentation works offline

const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms))

interface StoredLine {
  id: string
  variantId: string
  quantity: number
}

function readLines(): StoredLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY + '-mock')
    return raw ? (JSON.parse(raw) as StoredLine[]) : []
  } catch {
    return []
  }
}

function writeLines(lines: StoredLine[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY + '-mock', JSON.stringify(lines))
  } catch {
    // private mode: the cart still works for this visit
  }
}

let memoryLines: StoredLine[] | null = null
const lines = () => (memoryLines ??= readLines())
const save = (next: StoredLine[]) => {
  memoryLines = next
  writeLines(next)
}

function findVariant(variantId: string) {
  for (const p of mockProducts) {
    const v = p.variants.find((x) => x.id === variantId)
    if (v) return { product: p, variant: v }
  }
  return null
}

const times = (m: Money, n: number): Money => ({ amount: (Number(m.amount) * n).toFixed(2), currencyCode: m.currencyCode })

function buildCart(): Cart {
  const out: CartLine[] = []
  for (const l of lines()) {
    const hit = findVariant(l.variantId)
    if (!hit) continue
    const { product, variant } = hit
    out.push({
      id: l.id,
      quantity: l.quantity,
      variantId: variant.id,
      variantTitle: variant.title === 'Default' ? '' : variant.title,
      productHandle: product.handle,
      productTitle: product.title,
      image: product.images[0],
      price: variant.price,
      lineTotal: times(variant.price, l.quantity),
      availability: variant.availability,
      fulfillmentNote: product.details.fulfillmentNote,
    })
  }
  const subtotal = out.reduce((sum, l) => sum + Number(l.lineTotal.amount), 0)
  return {
    id: 'mock-cart',
    lines: out,
    totalQuantity: out.reduce((n, l) => n + l.quantity, 0),
    subtotal: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
    // the mock has no shopify checkout; each concept routes this to its own stub page
    checkoutUrl: 'checkout',
  }
}

const byHandle = (h: string): Product | null => mockProducts.find((p) => p.handle === h) ?? null

export const mockAdapter: CommerceAdapter = {
  mode: 'mock',
  async listProducts() {
    await wait()
    return mockProducts
  },
  async getProduct(handle) {
    await wait()
    return byHandle(handle)
  },
  async getCollections() {
    await wait()
    return mockCollections.map(({ productHandles: _ignored, ...c }) => c)
  },
  async getCollectionProducts(handle) {
    await wait()
    const c = mockCollections.find((x) => x.handle === handle)
    return c ? c.productHandles.map(byHandle).filter((p): p is Product => p !== null) : []
  },
  async createCart() {
    save([])
    return buildCart()
  },
  async getCart() {
    return buildCart()
  },
  async addToCart(variantId, quantity = 1) {
    await wait(320)
    const hit = findVariant(variantId)
    if (!hit || !hit.variant.availableForSale) throw new Error('This piece is not available right now.')
    const current = lines()
    const existing = current.find((l) => l.variantId === variantId)
    save(
      existing
        ? current.map((l) => (l === existing ? { ...l, quantity: l.quantity + quantity } : l))
        : [...current, { id: `line-${variantId}-${Date.now()}`, variantId, quantity }],
    )
    return buildCart()
  },
  async updateCartLine(lineId, quantity) {
    await wait(180)
    save(quantity <= 0 ? lines().filter((l) => l.id !== lineId) : lines().map((l) => (l.id === lineId ? { ...l, quantity } : l)))
    return buildCart()
  },
  async removeFromCart(lineId) {
    await wait(180)
    save(lines().filter((l) => l.id !== lineId))
    return buildCart()
  },
  async getCheckoutUrl() {
    return lines().length ? 'checkout' : null
  },
  async subscribeEmail(email) {
    await wait(400)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Enter an email address like name@example.com.' }
    return { ok: true, message: 'Thank you. You’re on the list for news from the house.' }
  },
}
