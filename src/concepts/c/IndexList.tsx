import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Img } from '@/shared/commerce'
import { Picture } from '@/shared/lib/Picture'
import { useReducedMotion } from '@/shared/lib/motion'

export interface IndexItem {
  key: string
  n: string
  title: string
  note: ReactNode
  href: string
  img?: Img
  imgStyle?: CSSProperties
  meta?: ReactNode
}

// with a pointer, the row's picture follows the cursor; with focus it waits beside the row;
// on touch, tapping a row opens it to show the picture and a link through.
export function IndexList({ items, size = 'xl', label }: { items: IndexItem[]; size?: 'xl' | 'lg'; label: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [touch, setTouch] = useState(false)
  const reduced = useReducedMotion()
  const follower = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    const on = () => setTouch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const place = (x: number, y: number) => {
    pos.current = { x, y }
    const el = follower.current
    if (el) el.style.transform = `translate3d(${x + 24}px, ${y - el.offsetHeight / 2}px, 0)`
  }

  const type = size === 'xl' ? 'text-[clamp(2.8rem,9.6vw,9rem)]' : 'text-[clamp(2rem,5.4vw,4.4rem)]'
  const active = hover !== null ? items[hover] : null

  if (touch)
    return (
      <ul aria-label={label}>
        {items.map((it, i) => (
          <li key={it.key} className="rule">
            <button type="button" aria-expanded={open === i} aria-controls={`ix-${it.key}`} onClick={() => setOpen(open === i ? null : i)} className="index-row grid w-full grid-cols-[2.4rem_1fr] items-baseline py-3 text-left">
              <span className="caption">{it.n}</span>
              <span className={`display ${type}`}>{it.title}</span>
            </button>
            <div id={`ix-${it.key}`} className={`expand ${open === i ? 'is-open' : ''}`}>
              <div>
                <div className="grid grid-cols-[2.4rem_1fr] pb-6">
                  <span />
                  <div>
                    {it.img ? <Picture img={it.img} sizes="80vw" alt="" className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] w-full" style={it.imgStyle} />}
                    <p className="mt-3 text-[1rem] text-muted">{it.note}</p>
                    {it.meta && <p className="caption mt-1 text-muted">{it.meta}</p>}
                    <Link to={it.href} className="btn mt-4" tabIndex={open === i ? 0 : -1}>
                      <span>Open {it.title}</span>
                      <span aria-hidden="true">{it.n}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )

  return (
    <div className="relative" onMouseLeave={() => setHover(null)}>
      <ul aria-label={label}>
        {items.map((it, i) => (
          <li key={it.key} className="rule">
            <Link
              to={it.href}
              className="index-row group grid grid-cols-[3rem_1fr] items-baseline gap-x-2 py-2 md:grid-cols-[6rem_1fr_16rem]"
              onMouseEnter={(e) => {
                setHover(i)
                place(e.clientX, e.clientY)
              }}
              onMouseMove={(e) => !reduced && place(e.clientX, e.clientY)}
              onFocus={(e) => {
                setHover(i)
                const r = e.currentTarget.getBoundingClientRect()
                place(Math.min(r.right - 360, window.innerWidth - 380), r.top + r.height / 2)
              }}
              onBlur={() => setHover(null)}
            >
              <span className="caption">{it.n}</span>
              <span className={`display ${type} group-hover:italic group-focus-visible:italic`}>{it.title}</span>
              <span className="caption col-start-2 pb-2 text-muted md:col-start-auto md:text-right">
                {it.note}
                {it.meta && <span className="block">{it.meta}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={follower} aria-hidden="true" className={`follower w-[min(22rem,30vw)] ${active ? 'is-on' : ''}`}>
        {items.map((it, i) =>
          it.img ? (
            <Picture key={it.key} img={it.img} sizes="22rem" alt="" className={`aspect-[4/5] w-full object-cover ${hover === i ? 'block' : 'hidden'}`} />
          ) : (
            <div key={it.key} className={`aspect-[4/5] w-full ${hover === i ? 'block' : 'hidden'}`} style={it.imgStyle} />
          ),
        )}
      </div>
    </div>
  )
}
