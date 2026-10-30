import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCart, type CartLine } from '@/shared/commerce'
import { house, social } from '@/shared/data/house'
import { tapestryConfig } from '@/shared/data/tapestry'
import { inert, useDialog } from '@/shared/lib/dialog'
import { useThemeColor } from '@/shared/lib/seo'
import { Picture } from '@/shared/lib/Picture'
import { Price, roman, Signup, Stock, to } from './ui'

const nav = [
  { path: 'house', label: 'The House' },
  { path: 'heirlooms', label: 'The Heirlooms' },
  { path: 'journal', label: 'The Frances Journal' },
  { path: 'tapestry', label: 'The House Tapestry' },
  { path: 'care', label: 'Care & Service' },
]

function IndexOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, open, onClose)
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Index" className={`fixed inset-0 z-50 overflow-y-auto bg-ground px-4 pt-3 pb-20 transition-opacity duration-500 sm:px-6 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} {...inert(!open)}>
      <div className="flex items-center justify-between">
        <p className="display text-[1.6rem]">Index</p>
        <button type="button" onClick={onClose} className="link min-h-[44px]" data-autofocus>
          Close
        </button>
      </div>
      <nav aria-label="Main" className="mt-8">
        <ol>
          {nav.map((n, i) => (
            <li key={n.path} className="rule">
              <NavLink to={to(n.path)} onClick={onClose} className="grid grid-cols-[3rem_1fr] items-baseline py-3 aria-[current=page]:italic">
                <span className="caption">{roman[i]}</span>
                <span className="display text-[clamp(2.6rem,11vw,5rem)]">{n.label}</span>
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

function Header({ onIndex }: { onIndex: () => void }) {
  const cart = useCart()
  const count = cart.cart?.totalQuantity ?? 0
  return (
    <header className="sticky top-0 z-30 bg-ground">
      <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-6 border-b border-ink px-4 py-2.5 sm:px-6">
        <Link to={to()} className="display text-[1.55rem] leading-none whitespace-nowrap" aria-label="Jessi Frances, home" translate="no">
          Jessi Frances
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="caption flex gap-6 !text-[0.9rem]">
            {nav.slice(0, 4).map((n, i) => (
              <li key={n.path}>
                <NavLink to={to(n.path)} className="aria-[current=page]:underline aria-[current=page]:underline-offset-4 hover:underline hover:underline-offset-4">
                  <span className="text-muted">{roman[i]}.</span> {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4 text-[0.95rem]">
          <button type="button" onClick={onIndex} className="link min-h-[44px] lg:hidden" aria-haspopup="dialog">
            Index
          </button>
          <Link to={to('heirlooms')} className="link">
            Shop
          </Link>
          <button type="button" onClick={cart.open} className="link min-h-[44px] tabular-nums" aria-haspopup="dialog">
            Bag ({count})<span className="sr-only">{count === 1 ? ' item' : ' items'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function Line({ line, n }: { line: CartLine; n: number }) {
  const cart = useCart()
  return (
    <li className="rule-soft grid grid-cols-[2rem_4rem_1fr] gap-3 py-4">
      <span className="caption text-muted">{n}.</span>
      {line.image ? <Picture img={line.image} sizes="64px" alt="" className="aspect-square w-16 object-cover" /> : <span />}
      <div>
        <div className="flex justify-between gap-3">
          <p className="text-[1.02rem] leading-tight">{line.productTitle}</p>
          <Price money={line.lineTotal} />
        </div>
        <p className="caption mt-1 text-muted">
          {line.variantTitle && `${line.variantTitle}. `}
          <Stock state={line.availability} />
        </p>
        {line.availability === 'preorder' && line.fulfillmentNote && <p className="caption mt-1 text-muted">{line.fulfillmentNote}</p>}
        <div className="caption mt-2 flex items-center gap-3">
          <label className="flex items-center gap-2">
            Qty
            <select value={line.quantity} disabled={cart.pending} onChange={(e) => cart.update(line.id, Number(e.target.value))} className="field !min-h-[36px] w-16 !py-1">
              {Array.from({ length: Math.max(6, line.quantity) }, (_, i) => i + 1).map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="link min-h-[36px]" disabled={cart.pending} onClick={() => cart.remove(line.id)}>
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

export function BagContents({ onNavigate }: { onNavigate?: () => void }) {
  const cart = useCart()
  const navigate = useNavigate()
  const lines = cart.cart?.lines ?? []
  const checkout = () => {
    const href = cart.checkoutHref
    if (!href) return
    onNavigate?.()
    if (/^https?:/.test(href)) window.location.assign(href)
    else navigate(to(href))
  }
  if (cart.status === 'loading') return <p className="caption py-8 text-muted">Opening the bag…</p>
  if (!lines.length)
    return (
      <div className="py-8">
        <p className="display text-[2.4rem]">Nothing here yet.</p>
        <p className="mt-2 text-muted">The catalogue holds The First Huggie and three chapters.</p>
        <Link to={to('heirlooms')} onClick={onNavigate} className="btn mt-6">
          Open the catalogue
        </Link>
      </div>
    )
  return (
    <div>
      <ol>
        {lines.map((l, i) => (
          <Line key={l.id} line={l} n={i + 1} />
        ))}
      </ol>
      {cart.error && (
        <p role="alert" className="caption mt-2 text-accent">
          {cart.error}
        </p>
      )}
      <div className="rule mt-2 flex items-baseline justify-between pt-3">
        <span>Subtotal</span>
        <span className="display text-[2rem]">{cart.cart && <Price money={cart.cart.subtotal} />}</span>
      </div>
      <p className="caption text-muted">Shipping and taxes are calculated at checkout.</p>
      <button type="button" className="btn mt-5 w-full" onClick={checkout} disabled={cart.pending || !cart.checkoutHref}>
        <span>{cart.pending ? 'Updating…' : 'Checkout'}</span>
        <span aria-hidden="true">{cart.cart?.totalQuantity}</span>
      </button>
    </div>
  )
}

function Bag() {
  const cart = useCart()
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, cart.isOpen, cart.close)
  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? '' : 'pointer-events-none'}`} {...inert(!cart.isOpen)}>
      <div className={`scrim absolute inset-0 ${cart.isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={cart.close} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="cc-bag" className={`panel absolute overscroll-contain inset-y-0 right-0 w-full max-w-[30rem] overflow-y-auto border-l border-ink bg-ground px-5 pt-3 pb-24 ${cart.isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-ink pb-2">
          <h2 id="cc-bag" className="display text-[1.8rem]">
            Bag
          </h2>
          <button type="button" onClick={cart.close} className="link min-h-[44px]" data-autofocus>
            Close
          </button>
        </div>
        <BagContents onNavigate={cart.close} />
      </div>
    </div>
  )
}

function Colophon() {
  return (
    <footer className="mt-[clamp(5rem,10vw,9rem)] bg-field text-field-ink">
      <div className="mx-auto grid max-w-[110rem] gap-10 px-4 pt-14 pb-28 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display text-[clamp(2.6rem,5vw,4rem)]">Join the house</h2>
          <p className="mt-3 max-w-[26rem]">New plates, new entries, and the first collection, sent a few times a year.</p>
          <div className="mt-6 max-w-[28rem]">
            <Signup id="cc-foot" />
          </div>
        </div>
        <nav aria-label="Care & Service" className="caption !text-[0.9rem] md:col-span-2 md:col-start-7">
          <h3 className="font-semibold">Service</h3>
          <ul className="mt-2 space-y-1.5">
            <li><Link className="link" to={to('care')}>Care & Service</Link></li>
            <li><Link className="link" to={to('legal/shipping-returns')}>Shipping & returns</Link></li>
            <li><Link className="link" to={to('care#questions')}>Questions</Link></li>
            <li><Link className="link" to={to('care#contact')}>Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal" className="caption !text-[0.9rem] md:col-span-2">
          <h3 className="font-semibold">Legal</h3>
          <ul className="mt-2 space-y-1.5">
            <li><Link className="link" to={to('legal/privacy')}>Privacy</Link></li>
            <li><Link className="link" to={to('legal/terms')}>Terms</Link></li>
            {social.map((s) => (
              <li key={s.label}>
                <a className="link" href={s.href}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="caption !text-[0.9rem] md:col-span-2">
          <h3 className="font-semibold">Colophon</h3>
          <p className="mt-2">Set in Instrument Serif and Schibsted Grotesk. Letters in IBM Plex Mono.</p>
          <p className="mt-2">Plate {tapestryConfig.roman} is placeholder artwork, not the 2027 House Tapestry.</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-field-ink pt-3 md:col-span-12">
          <p className="display text-[clamp(2rem,6vw,4.4rem)]">Jessi Frances, {house.descriptor}</p>
          <p className="caption">© {new Date().getFullYear()} Jessi Frances LLC. {house.signatureLine}</p>
        </div>
      </div>
    </footer>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useThemeColor('#e5d9c4')
  return (
    <div className="cc">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header onIndex={() => setOpen(true)} />
      <IndexOverlay open={open} onClose={close} />
      <Bag />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Colophon />
    </div>
  )
}
