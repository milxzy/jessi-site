import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { commerce } from './adapter'
import type { Cart } from './types'

// cart state and the bag drawer's open state. no markup here: each concept draws its own bag.

interface CartState {
  cart: Cart | null
  status: 'loading' | 'ready' | 'error'
  error: string | null
  pending: boolean
  isOpen: boolean
  open: () => void
  close: () => void
  add: (variantId: string, quantity?: number) => Promise<boolean>
  update: (lineId: string, quantity: number) => Promise<void>
  remove: (lineId: string) => Promise<void>
  clearError: () => void
  // shopify checkout url, or the concept-relative stub path in mock mode
  checkoutHref: string | null
}

const Ctx = createContext<CartState | null>(null)

const message = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong with the bag. Try again.')

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [status, setStatus] = useState<CartState['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    let live = true
    commerce
      .getCart()
      .then((c) => live && (setCart(c), setStatus('ready')))
      .catch((e) => live && (setError(message(e)), setStatus('error')))
    return () => {
      live = false
    }
  }, [])

  const run = useCallback(async (fn: () => Promise<Cart>) => {
    setPending(true)
    setError(null)
    try {
      setCart(await fn())
      setStatus('ready')
      return true
    } catch (e) {
      setError(message(e))
      return false
    } finally {
      setPending(false)
    }
  }, [])

  const value = useMemo<CartState>(
    () => ({
      cart,
      status,
      error,
      pending,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: async (variantId, quantity) => {
        const ok = await run(() => commerce.addToCart(variantId, quantity))
        if (ok) setOpen(true)
        return ok
      },
      update: async (lineId, quantity) => void (await run(() => commerce.updateCartLine(lineId, quantity))),
      remove: async (lineId) => void (await run(() => commerce.removeFromCart(lineId))),
      clearError: () => setError(null),
      checkoutHref: cart && cart.lines.length ? cart.checkoutUrl : null,
    }),
    [cart, status, error, pending, isOpen, run],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCart must be used inside CartProvider')
  return v
}
