import DOMPurify from 'dompurify'

// owner-written html from shopify is rendered, so it is always cleaned first.
// class is kept so ".letter" blocks written in the shopify editor pick up the typewriter style.
export function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['loading', 'target'],
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'iframe'],
  })
}

export interface Section {
  heading: string
  html: string
}

// splits a page body at each heading of the given level, so a concept can lay sections out its own way.
// anything before the first heading becomes a section with an empty heading.
export function splitSections(html: string, level: 'h2' | 'h3' = 'h2'): Section[] {
  const parts = html.split(new RegExp(`<${level}[^>]*>`, 'i'))
  const out: Section[] = []
  parts.forEach((part, i) => {
    if (i === 0) {
      if (part.trim()) out.push({ heading: '', html: part.trim() })
      return
    }
    const [heading = '', rest = ''] = part.split(new RegExp(`</${level}>`, 'i'))
    out.push({ heading: heading.replace(/<[^>]+>/g, '').trim(), html: rest.trim() })
  })
  return out
}
