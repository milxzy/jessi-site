import type { Money } from './types'

const cache = new Map<string, Intl.NumberFormat>()

export function formatMoney(m: Money): string {
  let f = cache.get(m.currencyCode)
  if (!f) {
    f = new Intl.NumberFormat('en-US', { style: 'currency', currency: m.currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 2 })
    cache.set(m.currencyCode, f)
  }
  return f.format(Number(m.amount))
}
