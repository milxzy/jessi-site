import { isShopifyConfigured } from '../commerce/config'
import { storefront } from '../commerce/shopify/client'
import { mockPages, type PageContent } from '../data/pages'
import { sanitize } from './sanitize'

// basic pages (the house story, care & service, legal) come from shopify online store pages by handle.
// a missing page falls back to its placeholder so the site never shows a hole.

export type { PageContent }

export async function getPage(handle: string): Promise<PageContent | null> {
  if (isShopifyConfigured) {
    const d = await storefront<{ page: { handle: string; title: string; bodySummary: string; body: string } | null }>(
      `query Page($handle: String!) { page(handle: $handle) { handle title bodySummary body } }`,
      { handle },
    )
    if (d.page) return { handle: d.page.handle, title: d.page.title, summary: d.page.bodySummary, bodyHtml: sanitize(d.page.body) }
  }
  const p = mockPages.find((x) => x.handle === handle)
  return p ? { ...p, bodyHtml: sanitize(p.bodyHtml) } : null
}

export const legalHandles = ['privacy', 'terms', 'shipping-returns'] as const
