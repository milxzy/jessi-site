import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCart, type CartLine } from '@/shared/commerce'
import { house, social } from '@/shared/data/house'
import { inert, useDialog } from '@/shared/lib/dialog'
import { useThemeColor } from '@/shared/lib/seo'
import { Picture } from '@/shared/lib/Picture'
import { crop, Price, roman, Signup, Stock, to } from './ui'

const nav = [
  { path: 'house', label: 'The House', still: '50% 70%' },
  { path: 'heirlooms', label: 'The Heirlooms', still: '66% 22%' },
  { path: 'journal', label: 'The Frances Journal', still: '20% 14%' },
  { path: 'tapestry', label: 'The House Tapestry', still: '50% 90%' },
  { path: 'care', label: 'Care & Service', still: '86% 50%' },
]

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, open, onClose)
  const [hover, setHover] = useState(0)
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" className={`overlay fixed inset-0 z-50 bg-ground ${open ? 'visible opacity-100' : 'invisible opacity-0'}`} {...inert(!open)}>
      {nav.map((n, i) => (
        <div key={n.path} aria-hidden="true" className={`door-still ${hover === i ? 'is-on' : ''}`} style={crop(n.still, 3.2)} />
      ))}
      <div className="relative flex h-full flex-col px-5 py-5 sm:px-10">
        <div className="flex items-center justify-between">
          <span className="caps">Jessi Frances</span>
          <button type="button" onClick={onClose} className="caps link min-h-[44px]" data-autofocus>
            Close
          </button>
        </div>
        <nav aria-label="Main" className="my-auto">
          <ul className="space-y-2 text-center sm:space-y-4">
            {nav.map((n, i) => (
              <li key={n.path}>
                <NavLink to={to(n.path)} onClick={onClose} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} className="door-link display inline-flex items-baseline gap-4 text-[clamp(2.2rem,7vw,5rem)] aria-[current=page]:text-accent">
                  <span className="caps w-8 text-right text-muted">{roman[i]}</span>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-center text-[0.95rem] text-muted">{house.signatureLine}</p>
      </div>
    </div>
  )
}

function Header({ onMenu }: { onMenu: () => void }) {
  const cart = useCart()
  const count = cart.cart?.totalQuantity ?? 0
  const { pathname } = useLocation()
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [pathname])
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-700 ${solid ? 'bg-ground/95' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-5 py-3 sm:px-10">
        <button type="button" onClick={onMenu} className="caps link min-h-[44px]" aria-haspopup="dialog">
          Menu
        </button>
        <Link to={to()} className="caps absolute left-1/2 hidden -translate-x-1/2 tracking-[0.32em] whitespace-nowrap sm:block" aria-label="Jessi Frances, home" translate="no">
          Jessi Frances
        </Link>
        <div className="flex items-center gap-3.5 sm:gap-8">
          <Link to={to('heirlooms')} className="caps link min-h-[44px] content-center">
            Shop
          </Link>
          <button type="button" onClick={cart.open} className="caps link min-h-[44px]" aria-haspopup="dialog">
            Bag <span className="tabular-nums">{count}</span>
            <span className="sr-only">{count === 1 ? ' item' : ' items'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function Line({ line }: { line: CartLine }) {
  const cart = useCart()
  return (
    <li className="flex gap-4 py-5">
      {line.image && <Picture img={line.image} sizes="80px" alt="" className="aspect-[4/5] w-20 shrink-0 object-cover" />}
      <div className="flex-1">
        <p className="display text-[1.3rem] leading-tight">{line.productTitle}</p>
        <p className="mt-1 text-[0.92rem] text-muted">
          {line.variantTitle && <span className="mr-3">{line.variantTitle}</span>}
          <Stock state={line.availability} />
        </p>
        {line.availability === 'preorder' && line.fulfillmentNote && <p className="mt-2 text-[0.85rem] leading-snug text-muted">{line.fulfillmentNote}</p>}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1" role="group" aria-label={`Quantity of ${line.productTitle}`}>
            <button type="button" className="h-10 w-10 text-[1.1rem]" aria-label="One fewer" disabled={cart.pending} onClick={() => cart.update(line.id, line.quantity - 1)}>
              −
            </button>
            <span className="w-6 text-center tabular-nums">{line.quantity}</span>
            <button type="button" className="h-10 w-10 text-[1.1rem]" aria-label="One more" disabled={cart.pending} onClick={() => cart.update(line.id, line.quantity + 1)}>
              +
            </button>
          </div>
          <Price money={line.lineTotal} />
        </div>
        <button type="button" className="caps link mt-2 text-muted" disabled={cart.pending} onClick={() => cart.remove(line.id)}>
          Remove
        </button>
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
  if (cart.status === 'loading') return <p className="caps pulse py-10 text-muted">Opening your bag…</p>
  if (!lines.length)
    return (
      <div className="py-12 text-center">
        <p className="display text-[1.9rem]">Your bag is empty.</p>
        <p className="mt-3 text-muted">Begin with The First Huggie, or choose a chapter.</p>
        <Link to={to('heirlooms')} onClick={onNavigate} className="btn mt-8">
          See the heirlooms
        </Link>
      </div>
    )
  return (
    <div>
      <ul className="divide-y divide-line">{lines.map((l) => <Line key={l.id} line={l} />)}</ul>
      {cart.error && (
        <p role="alert" className="mt-3 text-[0.95rem] text-accent">
          {cart.error}
        </p>
      )}
      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-5">
        <span className="caps">Subtotal</span>
        <span className="display text-[1.6rem]">{cart.cart && <Price money={cart.cart.subtotal} />}</span>
      </div>
      <p className="mt-1 text-[0.88rem] text-muted">Shipping and taxes are calculated at checkout.</p>
      <button type="button" className="btn btn-solid mt-6 w-full" onClick={checkout} disabled={cart.pending || !cart.checkoutHref}>
        {cart.pending ? 'Updating…' : 'Checkout'}
      </button>
    </div>
  )
}

function BagDrawer() {
  const cart = useCart()
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, cart.isOpen, cart.close)
  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? '' : 'pointer-events-none'}`} {...inert(!cart.isOpen)}>
      <div className={`overlay absolute inset-0 bg-[rgba(10,7,5,.6)] ${cart.isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={cart.close} />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="cb-bag" className={`drawer-panel absolute overscroll-contain inset-y-0 right-0 w-full max-w-[28rem] overflow-y-auto bg-surface px-6 pt-5 pb-24 sm:px-9 ${cart.isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <h2 id="cb-bag" className="caps">
            Your bag
          </h2>
          <button type="button" className="caps link min-h-[44px]" onClick={cart.close} data-autofocus>
            Close
          </button>
        </div>
        <BagContents onNavigate={cart.close} />
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line px-5 pt-24 pb-28 sm:px-10">
      <div className="mx-auto max-w-[72rem] text-center">
        <p className="display text-[clamp(2.6rem,9vw,6rem)]">Jessi Frances</p>
        <p className="mt-4 text-muted">{house.signatureLine}</p>
        <div className="mt-14">
          <p className="caps mb-5">Letters from the house</p>
          <Signup id="cb-foot" />
        </div>
        <nav aria-label="Footer" className="mt-16">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[0.95rem]">
            <li><Link className="link" to={to('care')}>Care & Service</Link></li>
            <li><Link className="link" to={to('legal/shipping-returns')}>Shipping & returns</Link></li>
            <li><Link className="link" to={to('care#contact')}>Contact</Link></li>
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
        <p className="mt-14 text-[0.85rem] text-muted">© {new Date().getFullYear()} Jessi Frances LLC. The tapestry shown throughout is placeholder artwork, standing in for the 2027 House Tapestry.</p>
      </div>
    </footer>
  )
}

export function Layout() {
  const [menu, setMenu] = useState(false)
  const close = useCallback(() => setMenu(false), [])
  const { pathname } = useLocation()
  useEffect(() => setMenu(false), [pathname])
  useThemeColor('#1c1410')
  return (
    <div className="cb">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header onMenu={() => setMenu(true)} />
      <Menu open={menu} onClose={close} />
      <BagDrawer />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
