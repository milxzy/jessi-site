import { shopifyConfig, isShopifyConfigured } from '../commerce/config'
import { storefront } from '../commerce/shopify/client'
import { mapImage } from '../commerce/shopify/mapping'
import { mockJournal, type JournalEntry } from '../data/journal'
import { sanitize } from './sanitize'

// the frances journal. in shopify it is a blog (handle "journal" by default) whose articles the founder
// writes in the admin. without credentials, or if the blog is missing, the placeholder entries are used.

export type { JournalEntry }

const ARTICLE = `id handle title excerpt publishedAt tags contentHtml authorV2 { name } image { url altText width height }`

interface SArticle {
  id: string
  handle: string
  title: string
  excerpt: string | null
  publishedAt: string
  tags: string[]
  contentHtml: string
  authorV2: { name: string } | null
  image: { url: string; altText: string | null; width: number | null; height: number | null } | null
}

const toEntry = (a: SArticle): JournalEntry => ({
  id: a.id,
  handle: a.handle,
  title: a.title,
  excerpt: a.excerpt ?? '',
  publishedAt: a.publishedAt,
  tags: a.tags,
  author: a.authorV2?.name ?? 'Jessi Frances',
  image: mapImage(a.image, a.title),
  contentHtml: a.contentHtml,
})

const clean = (e: JournalEntry): JournalEntry => ({ ...e, contentHtml: sanitize(e.contentHtml) })

export async function listEntries(): Promise<JournalEntry[]> {
  if (isShopifyConfigured) {
    const d = await storefront<{ blog: { articles: { nodes: SArticle[] } } | null }>(
      `query Journal($blog: String!) { blog(handle: $blog) { articles(first: 30, sortKey: PUBLISHED_AT, reverse: true) { nodes { ${ARTICLE} } } } }`,
      { blog: shopifyConfig.journalBlog },
    )
    if (d.blog) return d.blog.articles.nodes.map(toEntry).map(clean)
  }
  return [...mockJournal].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map(clean)
}

export async function getEntry(handle: string): Promise<{ entry: JournalEntry; next: JournalEntry | null } | null> {
  const all = await listEntries()
  const i = all.findIndex((e) => e.handle === handle)
  if (i < 0) return null
  // the "next entry" is the one published before this, and wraps to the newest
  return { entry: all[i]!, next: all.length > 1 ? all[(i + 1) % all.length]! : null }
}

export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  return new Date(iso).toLocaleDateString('en-US', style === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' } : { year: 'numeric', month: 'short', day: 'numeric' })
}
