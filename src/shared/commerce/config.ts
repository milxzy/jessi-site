// the storefront api version, checked against shopify.dev/docs/api/usage/versioning on 2026-10-28.
// bump it here only; nothing else references a version.
export const STOREFRONT_API_VERSION = '2026-10'

export const shopifyConfig = {
  domain: (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined)?.trim() || '',
  // public storefront token only. the admin api token must never reach the browser.
  token: (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined)?.trim() || '',
  journalBlog: (import.meta.env.VITE_SHOPIFY_JOURNAL_BLOG as string | undefined)?.trim() || 'journal',
}

export const isShopifyConfigured = Boolean(shopifyConfig.domain && shopifyConfig.token)

export const CART_STORAGE_KEY = 'jf-cart'
