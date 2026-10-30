import { Link, useLocation } from 'react-router-dom'
import { concepts, type ConceptKey } from './concepts'
import './switcher.css'

// presentation chrome, not brand design: the same tiny bar in every concept.
// switching keeps the current page, so /a/journal opens /b/journal for a side-by-side read.
export function ConceptSwitcher({ current }: { current: ConceptKey }) {
  const { pathname } = useLocation()
  // hidden inside the picker's preview thumbnails
  if (typeof window !== 'undefined' && window.self !== window.top) return null
  const rest = pathname.replace(/^\/[abcd]/, '')
  return (
    <nav className="jf-switcher" aria-label="Design options">
      <Link to="/" className="jf-switcher__back">
        Back to options
      </Link>
      <span className="jf-switcher__sep" aria-hidden="true" />
      {concepts.map((c) => (
        <Link
          key={c.key}
          to={`/${c.key}${rest}`}
          className="jf-switcher__link"
          aria-current={c.key === current ? 'page' : undefined}
          aria-label={`Design ${c.letter}, ${c.name}`}
          title={`Design ${c.letter}: ${c.name}`}
        >
          {c.letter}
        </Link>
      ))}
    </nav>
  )
}
