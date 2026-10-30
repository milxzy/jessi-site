import { useEffect } from 'react'

interface Seo {
  title: string
  description: string
  // the concept name keeps titles distinct while the four designs are being compared
  concept?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  jsonLd?: Record<string, unknown>
}

function meta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

export function useSeo({ title, description, concept, image, type = 'website', jsonLd }: Seo) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const full = `${title} | Jessi Frances${concept ? ` (${concept})` : ''}`
    document.title = full
    meta('name', 'description', description)
    meta('property', 'og:title', full)
    meta('property', 'og:description', description)
    meta('property', 'og:type', type)
    meta('property', 'og:site_name', 'Jessi Frances')
    meta('property', 'og:url', window.location.href)
    meta('property', 'og:image', new URL(image ?? '/placeholders/tapestry/2027-desktop.svg', window.location.origin).href)
    meta('name', 'twitter:card', 'summary_large_image')
    let script = document.getElementById('jf-ld') as HTMLScriptElement | null
    if (ld) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'jf-ld'
        document.head.appendChild(script)
      }
      script.textContent = ld
    } else script?.remove()
  }, [title, description, concept, image, type, ld])
}

export function productLd(p: { title: string; description: string; image?: string; price: string; currency: string; availability: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.description,
    image: p.image ? new URL(p.image, window.location.origin).href : undefined,
    brand: { '@type': 'Brand', name: 'Jessi Frances' },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: p.currency,
      url: p.url,
      availability: p.availability === 'sold-out' ? 'https://schema.org/SoldOut' : p.availability === 'preorder' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
    },
  }
}

export function articleLd(a: { title: string; description: string; image?: string; publishedAt: string; author: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    image: a.image ? new URL(a.image, window.location.origin).href : undefined,
    datePublished: a.publishedAt,
    author: { '@type': 'Organization', name: a.author },
    publisher: { '@type': 'Organization', name: 'Jessi Frances' },
  }
}

// the browser chrome on phones takes each concept's ground colour
export function useThemeColor(color: string) {
  useEffect(() => {
    meta('name', 'theme-color', color)
  }, [color])
}
