import type { Availability } from '../commerce'

// shared wording for stock states, so the house says the same thing in every concept
export const availabilityLabel: Record<Availability, string> = {
  available: 'Available',
  preorder: 'Preorder',
  'sold-out': 'Sold out',
}

export const actionLabel: Record<Availability, string> = {
  available: 'Add to bag',
  preorder: 'Preorder',
  'sold-out': 'Sold out',
}
