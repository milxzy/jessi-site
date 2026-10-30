import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCart, type CartLine } from '@/shared/commerce'
import { house, social } from '@/shared/data/house'
import { inert, useDialog } from '@/shared/lib/dialog'
import { useThemeColor } from '@/shared/lib/seo'
import { Picture } from '@/shared/lib/Picture'
import { KeyholeDefs, Price, Signup, Stock, to } from './ui'

const nav = [
  { path: 'house', label: 'The House' },
  { path: 'heirlooms', label: 'The Heirlooms' },
  { path: 'journal', label: 'The Frances Journal' },
  { path: 'tapestry', label: 'The House Tapestry' },
  { path: 'care', label: 'Care & Service' },
]

// phone first: a sheet that rises from the bottom. on wide screens the same sheet sits at the side.
function Sheet({ open, onClose, label, side = false, children }: { open: boolean; onClose: () => void; label: string; side?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, open, onClose)
  const place = side
    ? `inset-x-0 bottom-0 max-h-[88svh] rounded-t-[2rem] md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[28rem] md:rounded-none md:rounded-l-[2rem] ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}`
    : `inset-x-0 bottom-0 max-h-[88svh] rounded-t-[2rem] md:mx-auto md:max-w-[34rem] md:bottom-6 md:rounded-[2rem] ${open ? 'translate-y-0' : 'translate-y-[110%]'}`
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} {...inert(!open)}>
      <div className={`veil absolute inset-0 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} className={`sheet absolute overflow-y-auto overscroll-contain bg-ground px-6 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] ${place}`}>
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-line md:hidden" />
        {children}
      </div>
    </div>
  )
}

function Line({ line }: { line: CartLine }) {
  const cart = useCart()
  return (
    <li className="flex gap-4 py-4">
      {line.image && <Picture img={line.image} sizes="72px" alt="" className="arch aspect-[4/5] w-[4.5rem] shrink-0 object-cover" />}
      <div className="min-w-0 flex-1">
        <p className="display text-[1.25rem]">{line.productTitle}</p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.92rem] text-muted">
          {line.variantTitle && <span>{line.variantTitle}</span>}
          <Stock state={line.availability} />
        </p>
        {line.availability === 'preorder' && line.fulfillmentNote && <p className="mt-2 text-[0.85rem] leading-snug text-muted">{line.fulfillmentNote}</p>}
        <div className="mt-3 flex items-center justify-between">
          <div className="pill flex items-center bg-surface" role="group" aria-label={`Quantity of ${line.productTitle}`}>
            <button type="button" className="h-10 w-10 rounded-full" aria-label="One fewer" disabled={cart.pending} onClick={() => cart.update(line.id, line.quantity - 1)}>
              −
            </button>
            <span className="w-6 text-center tabular-nums">{line.quantity}</span>
            <button type="button" className="h-10 w-10 rounded-full" aria-label="One more" disabled={cart.pending} onClick={() => cart.update(line.id, line.quantity + 1)}>
              +
            </button>
          </div>
          <Price money={line.lineTotal} />
        </div>
        <button type="button" className="link mt-2 min-h-[36px] text-[0.92rem] text-muted" disabled={cart.pending} onClick={() => cart.remove(line.id)}>
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
  if (cart.status === 'loading') return <p className="serif shimmer py-8 text-center italic">Opening your bag…</p>
  if (!lines.length)
    return (
      <div className="py-8 text-center">
        <p className="display text-[1.8rem]">Your bag is empty</p>
        <p className="mt-2 text-muted">Begin with The First Huggie, then choose a chapter.</p>
        <Link to={to('heirlooms')} onClick={onNavigate} className="btn mt-6">
          See the heirlooms
        </Link>
      </div>
    )
  return (
    <div>
      <ul className="divide-y divide-line">{lines.map((l) => <Line key={l.id} line={l} />)}</ul>
      {cart.error && (
        <p role="alert" className="mt-2 rounded-xl bg-surface p-3 text-[0.95rem]">
          {cart.error}
        </p>
      )}
      <div className="mt-4 rounded-[1.25rem] bg-surface p-5">
        <div className="flex items-baseline justify-between">
          <span>Subtotal</span>
          <span className="display text-[1.5rem]">{cart.cart && <Price money={cart.cart.subtotal} />}</span>
        </div>
        <p className="mt-1 text-[0.88rem] text-muted">Shipping and taxes are calculated at checkout.</p>
        <button type="button" className="btn mt-4 w-full" onClick={checkout} disabled={cart.pending || !cart.checkoutHref}>
          {cart.pending ? 'Updating…' : 'Continue to checkout'}
        </button>
      </div>
    </div>
  )
}

function Header({ onMenu }: { onMenu: () => void }) {
  const cart = useCart()
  const count = cart.cart?.totalQuantity ?? 0
  return (
    <header className="sticky top-0 z-30 bg-ground">
      <div className="mx-auto grid max-w-[80rem] grid-cols-[1fr_auto_1fr] items-center px-4 py-2 sm:px-6">
        <div className="flex items-center gap-1">
          <button type="button" onClick={onMenu} className="pill min-h-[44px] px-3 text-[0.98rem] hover:bg-surface" aria-haspopup="dialog">
            Menu
          </button>
          <Link to={to('heirlooms')} className="pill inline-flex min-h-[44px] items-center px-3 text-[0.98rem] hover:bg-surface">
            Shop
          </Link>
        </div>
        <Link to={to()} className="display text-center text-[1.45rem] whitespace-nowrap" aria-label="Jessi Frances, home" translate="no">
          Jessi Frances
        </Link>
        <button type="button" onClick={cart.open} className="pill min-h-[44px] justify-self-end px-3 text-[0.98rem] hover:bg-surface" aria-haspopup="dialog">
          Bag{count ? <span className="ml-1.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-field px-1.5 text-[0.8rem] text-field-ink tabular-nums">{count}</span> : null}
          <span className="sr-only">{count === 1 ? ', 1 item' : `, ${count} items`}</span>
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-camel text-camel-ink">
      <div className="mx-auto max-w-[80rem] px-5 pt-16 pb-28 sm:px-8">
        <div className="text-center">
          <p className="display text-[clamp(2.4rem,8vw,4.4rem)]">Jessi Frances</p>
          <p className="serif mt-2 text-[1.2rem] italic">{house.signatureLine}</p>
        </div>
        <div className="mt-10">
          <p className="mb-4 text-center">Letters from the house, a few times a year.</p>
          <Signup id="cd-foot" tone="dark" />
        </div>
        <nav aria-label="Footer" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-[0.95rem]">
            {[
              ['Care & Service', to('care')],
              ['Shipping & returns', to('legal/shipping-returns')],
              ['Contact', to('care#contact')],
              ['Privacy', to('legal/privacy')],
              ['Terms', to('legal/terms')],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href!} className="pill inline-flex min-h-[40px] items-center px-3.5 hover:bg-[rgba(46,32,24,.1)]">
                  {label}
                </Link>
              </li>
            ))}
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="pill inline-flex min-h-[40px] items-center px-3.5 hover:bg-[rgba(46,32,24,.1)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-10 text-center text-[0.85rem]">© {new Date().getFullYear()} Jessi Frances LLC. The tapestry is placeholder artwork, not the 2027 House Tapestry.</p>
      </div>
    </footer>
  )
}

export function Layout() {
  const [menu, setMenu] = useState(false)
  const close = useCallback(() => setMenu(false), [])
  const cart = useCart()
  const { pathname } = useLocation()
  useEffect(() => setMenu(false), [pathname])
  useThemeColor('#fbf7f0')
  return (
    <div className="cd">
      <KeyholeDefs />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header onMenu={() => setMenu(true)} />
      <Sheet open={menu} onClose={close} label="Menu">
        <div className="flex items-center justify-between">
          <p className="serif text-[1.1rem] italic">The rooms of the house</p>
          <button type="button" onClick={close} className="pill min-h-[44px] px-3 hover:bg-surface" data-autofocus>
            Close
          </button>
        </div>
        <nav aria-label="Main">
          <ul className="mt-4 space-y-1.5">
            {nav.map((n) => (
              <li key={n.path}>
                <NavLink to={to(n.path)} onClick={close} className="display block rounded-[1.25rem] px-4 py-3 text-[1.9rem] hover:bg-surface aria-[current=page]:bg-surface">
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Sheet>
      <Sheet open={cart.isOpen} onClose={cart.close} label="Your bag" side>
        <div className="flex items-center justify-between">
          <h2 className="display text-[1.7rem]">Your bag</h2>
          <button type="button" onClick={cart.close} className="pill min-h-[44px] px-3 hover:bg-surface" data-autofocus>
            Close
          </button>
        </div>
        <BagContents onNavigate={cart.close} />
      </Sheet>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
