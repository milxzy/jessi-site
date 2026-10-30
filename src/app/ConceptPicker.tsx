import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource-variable/fraunces'
import { isShopifyConfigured } from '@/shared/commerce'
import { useSeo } from '@/shared/lib/seo'
import { concepts } from './concepts'
import './picker.css'

const THUMB_W = 1280
const THUMB_H = 800

// a live, non-interactive render of each concept's home, scaled to the row
function Thumb({ path, label }: { path: string; label: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.25)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => e && setScale(e.contentRect.width / THUMB_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={box} className="picker-thumb" aria-hidden="true">
      <iframe
        src={path}
        title={label}
        tabIndex={-1}
        loading="lazy"
        width={THUMB_W}
        height={THUMB_H}
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}

export function ConceptPicker() {
  useSeo({ title: 'Four website concepts', description: 'Four design concepts for the digital home of Jessi Frances, The House of Becoming.' })
  return (
    <div className="picker">
      <header className="picker-head">
        <p className="picker-house">Jessi Frances</p>
        <h1>Four concepts for the House of Becoming</h1>
        <p className="picker-intro">
          Each design tells the same story in the same order, starting with the tapestry, then Frances, the heirlooms, the
          Journal, and an invitation to join. Open one, then use the bar at the bottom of the screen to compare the same page
          across all four.
        </p>
      </header>
      <main>
        <ol className="picker-list">
          {concepts.map((c) => (
            <li key={c.key}>
              <Link to={`/${c.key}`} className="picker-row">
                <span className="picker-letter" aria-hidden="true">
                  {c.letter}
                </span>
                <span className="picker-text">
                  <span className="picker-name">
                    Design {c.letter}: {c.name}
                  </span>
                  <span className="picker-idea">{c.idea}</span>
                </span>
                <Thumb path={`/${c.key}`} label={`Preview of design ${c.letter}`} />
              </Link>
            </li>
          ))}
        </ol>
      </main>
      <footer className="picker-foot">
        <p>
          The tapestry in every design is placeholder artwork, drawn to stand in for Madi’s 2027 House Tapestry until it
          previews on November 8, 2026. Letters, prices, and Journal entries are placeholders too.
        </p>
        <p>Store: {isShopifyConfigured ? 'connected to Shopify' : 'running on placeholder data (no Shopify credentials set)'}.</p>
      </footer>
    </div>
  )
}
