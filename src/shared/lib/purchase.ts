import { useMemo, useState } from 'react'
import { useCart, type Product, type Variant } from '../commerce'

// variant selection and add-to-bag for one product. no markup: each concept draws its own controls.
export function usePurchase(product: Product | null | undefined) {
  const cart = useCart()
  const [chosen, setChosen] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)

  const variant: Variant | undefined = useMemo(() => {
    if (!product) return undefined
    if (!product.options.length) return product.variants[0]
    // until the visitor picks, default to the first variant that can be bought
    const picked = product.options.every((o) => chosen[o.name])
    if (!picked) return product.variants.find((v) => v.availableForSale) ?? product.variants[0]
    return product.variants.find((v) => v.selectedOptions.every((so) => chosen[so.name] === so.value))
  }, [product, chosen])

  const selectedValue = (name: string) => chosen[name] ?? variant?.selectedOptions.find((o) => o.name === name)?.value

  // availability of a value given the other choices, for disabling sold-out sizes
  const valueAvailability = (name: string, value: string) => {
    const v = product?.variants.find((x) => x.selectedOptions.some((o) => o.name === name && o.value === value))
    return v?.availability ?? 'sold-out'
  }

  return {
    variant,
    selectedValue,
    valueAvailability,
    choose: (name: string, value: string) => {
      setAdded(false)
      setChosen((c) => ({ ...c, [name]: value }))
    },
    canBuy: !!variant?.availableForSale,
    pending: cart.pending,
    error: cart.error,
    added,
    add: async () => {
      if (!variant?.availableForSale) return
      const ok = await cart.add(variant.id, 1)
      setAdded(ok)
    },
  }
}
