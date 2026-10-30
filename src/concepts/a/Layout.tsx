import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '@/shared/commerce'
import { house, social } from '@/shared/data/house'
import { inert, useDialog } from '@/shared/lib/dialog'
import { useThemeColor } from '@/shared/lib/seo'
import { BagDrawer } from './Bag'
import { Signup, to } from './ui'

const nav = [
  { path: 'house', label: 'The House' },
  { path: 'heirlooms', label: 'The Heirlooms' },
  { path: 'journal', label: 'The Frances Journal' },
  { path: 'tapestry', label: 'The House Tapestry' },
  { path: 'care', label: 'Care & Service' },
]

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, open, onClose)
  return (
    <div className={`fixed inset-0 z-40 transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} {...inert(!open)}>
      <div className="drawer-scrim absolute inset-0" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" className="paper absolute inset-x-3 top-3 mx-auto max-w-[44rem] px-6 pt-5 pb-10 sm:px-12">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <p className="serif text-[1.1rem] tracking-[0.02em]">Jessi Frances</p>
          <button type="button" className="link" onClick={onClose} data-autofocus>
            Close
          </button>
        </div>
        <nav aria-label="Main">
          <ul className="mt-6">
            {nav.map((n) => (
              <li key={n.path}>
                <NavLink to={to(n.path)} onClick={onClose} className="display group flex items-baseline justify-between gap-6 border-b border-line py-3 text-[clamp(1.9rem,6vw,2.8rem)] aria-[current=page]:italic">
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="serif mt-8 text-muted italic">{house.signatureLine}</p>
      </div>
    </div>
  )
}

function Header({ onMenu }: { onMenu: () => void }) {
  const cart = useCart()
  const count = cart.cart?.totalQuantity ?? 0
  return (
    <header className="desk sticky top-0 z-30 bg-ground px-4 pt-4 sm:px-8">
      <div className="mx-auto grid max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line pb-3">
        <button type="button" onClick={onMenu} className="link justify-self-start text-[0.98rem]" aria-haspopup="dialog">
          Menu
        </button>
        <Link to={to()} className="serif text-center text-[clamp(1.05rem,2.4vw,1.35rem)] tracking-[0.18em] uppercase" aria-label="Jessi Frances, home" translate="no">
          Jessi Frances
        </Link>
        <div className="flex items-center justify-self-end gap-5 text-[0.98rem]">
          <Link to={to('heirlooms')} className="link hidden sm:inline">
            Shop
          </Link>
          <button type="button" onClick={cart.open} className="link" aria-haspopup="dialog">
            Bag<span className="tabular-nums">{count ? ` (${count})` : ''}</span>
            <span className="sr-only">{count === 1 ? ', 1 item' : `, ${count} items`}</span>
          </button>
        </div>
      </div>
      <nav aria-label="Shop" className="pt-2 pb-1 text-center text-[0.92rem] sm:hidden">
        <Link to={to('heirlooms')} className="link">
          Shop the heirlooms
        </Link>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-field text-field-ink">
      <div className="mx-auto max-w-[90rem] px-4 pt-20 pb-28 sm:px-8">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="display text-[clamp(2rem,4.4vw,3.2rem)]">Letters from the house</h2>
            <p className="mt-4 max-w-[30rem] text-[1.05rem] text-field-ink/85">News of the tapestry, the first collection, and new entries in the Journal. A few times a year, never more.</p>
            <div className="mt-8 max-w-[32rem]">
              <Signup dark id="ca-foot-email" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[0.98rem] sm:grid-cols-3">
            <nav aria-label="Care & Service">
              <h3 className="serif mb-3 text-[1.1rem]">Care & Service</h3>
              <ul className="space-y-2">
                <li><Link className="link" to={to('care')}>Care & Service</Link></li>
                <li><Link className="link" to={to('legal/shipping-returns')}>Shipping & returns</Link></li>
                <li><Link className="link" to={to('care#questions')}>Questions</Link></li>
                <li><Link className="link" to={to('care#contact')}>Contact</Link></li>
              </ul>
            </nav>
            <nav aria-label="Legal">
              <h3 className="serif mb-3 text-[1.1rem]">Legal</h3>
              <ul className="space-y-2">
                <li><Link className="link" to={to('legal/privacy')}>Privacy</Link></li>
                <li><Link className="link" to={to('legal/terms')}>Terms</Link></li>
              </ul>
            </nav>
            <nav aria-label="Social">
              <h3 className="serif mb-3 text-[1.1rem]">Elsewhere</h3>
              <ul className="space-y-2">
                {social.map((s) => (
                  <li key={s.label}>
                    <a className="link" href={s.href}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <p className="display mt-24 text-[clamp(3rem,12.5vw,11rem)] leading-[0.9] tracking-[-0.03em]">Jessi Frances</p>
        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-field-ink/25 pt-5 text-[0.88rem] text-field-ink/75">
          <p>© {new Date().getFullYear()} Jessi Frances LLC. {house.signatureLine}</p>
          <p>The tapestry shown is placeholder artwork, not the 2027 House Tapestry.</p>
        </div>
      </div>
    </footer>
  )
}

export function Layout() {
  const [menu, setMenu] = useState(false)
  const close = useCallback(() => setMenu(false), [])
  const { pathname } = useLocation()
  useEffect(() => setMenu(false), [pathname])
  useThemeColor('#e8dfcd')
  return (
    <div className="ca desk">
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
