// storefront api documents. metafield keys here are the ones documented in the readme.

export const METAFIELD_KEYS = [
  'materials',
  'dimensions',
  'care',
  'chapters_compatibility',
  'size_guide',
  'chapter_meaning',
  'fulfillment_note',
  'preorder',
  'short_title',
] as const

const IMAGE = 'url altText width height'
const MONEY = 'amount currencyCode'

export const PRODUCT_FIELDS = `
fragment ProductFields on Product {
  id handle title description productType tags availableForSale
  images(first: 8) { nodes { ${IMAGE} } }
  options { name optionValues { name } }
  priceRange { minVariantPrice { ${MONEY} } }
  variants(first: 30) {
    nodes { id title availableForSale currentlyNotInStock price { ${MONEY} } selectedOptions { name value } }
  }
  metafields(identifiers: [${METAFIELD_KEYS.map((k) => `{ namespace: "custom", key: "${k}" }`).join(', ')}]) { key value }
}`

export const CART_FIELDS = `
fragment CartFields on Cart {
  id checkoutUrl totalQuantity
  cost { subtotalAmount { ${MONEY} } }
  lines(first: 50) {
    nodes {
      id quantity
      cost { totalAmount { ${MONEY} } }
      merchandise {
        ... on ProductVariant {
          id title availableForSale currentlyNotInStock
          price { ${MONEY} }
          image { ${IMAGE} }
          product {
            handle title
            featuredImage { ${IMAGE} }
            fulfillment: metafield(namespace: "custom", key: "fulfillment_note") { value }
            preorder: metafield(namespace: "custom", key: "preorder") { value }
          }
        }
      }
    }
  }
}`

export const Q_PRODUCTS = `${PRODUCT_FIELDS}
query Products { products(first: 50, sortKey: TITLE) { nodes { ...ProductFields } } }`

export const Q_PRODUCT = `${PRODUCT_FIELDS}
query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }`

export const Q_COLLECTIONS = `
query Collections { collections(first: 20) { nodes { id handle title description image { ${IMAGE} } } } }`

export const Q_COLLECTION_PRODUCTS = `${PRODUCT_FIELDS}
query CollectionProducts($handle: String!) {
  collection(handle: $handle) { products(first: 50) { nodes { ...ProductFields } } }
}`

export const Q_CART = `${CART_FIELDS}
query Cart($id: ID!) { cart(id: $id) { ...CartFields } }`

export const M_CART_CREATE = `${CART_FIELDS}
mutation CartCreate($lines: [CartLineInput!]) {
  cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { message } }
}`

export const M_LINES_ADD = `${CART_FIELDS}
mutation LinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
}`

export const M_LINES_UPDATE = `${CART_FIELDS}
mutation LinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
}`

export const M_LINES_REMOVE = `${CART_FIELDS}
mutation LinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { message } }
}`
