import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, type CartLine } from '@/shared/commerce'
import { inert, useDialog } from '@/shared/lib/dialog'
import { Picture } from '@/shared/lib/Picture'
import { Price, Stock, to } from './ui'

function Line({ line }: { line: CartLine }) {
  const cart = useCart()
  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-4 py-5">
      {line.image ? <Picture img={line.image} sizes="72px" className="aspect-[4/5] w-full object-cover" alt="" /> : <span className="aspect-[4/5] bg-ground" />}
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <p className="serif text-[1.15rem] leading-tight">{line.productTitle}</p>
          <Price money={line.lineTotal} />
        </div>
        <p className="mt-1 text-[0.92rem] text-muted">
          {line.variantTitle && <>{line.variantTitle}, </>}
          <Stock state={line.availability} />
        </p>
        {line.availability === 'preorder' && line.fulfillmentNote && <p className="mt-2 text-[0.88rem] leading-snug text-muted">{line.fulfillmentNote}</p>}
        <div className="mt-3 flex items-center gap-4 text-[0.92rem]">
          <div className="flex items-center border border-line" role="group" aria-label={`Quantity of ${line.productTitle}`}>
            <button type="button" className="h-9 w-9" aria-label="One fewer" disabled={cart.pending} onClick={() => cart.update(line.id, line.quantity - 1)}>
              −
            </button>
            <span className="w-7 text-center tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button type="button" className="h-9 w-9" aria-label="One more" disabled={cart.pending} onClick={() => cart.update(line.id, line.quantity + 1)}>
              +
            </button>
          </div>
          <button type="button" className="link text-muted" disabled={cart.pending} onClick={() => cart.remove(line.id)}>
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

// shared by the drawer and the bag page
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

  if (cart.status === 'loading') return <p className="py-10 text-muted">Opening your bag…</p>
  if (!lines.length)
    return (
      <div className="py-10">
        <p className="serif text-[1.5rem] leading-tight">Your bag is empty.</p>
        <p className="mt-2 text-muted">The First Huggie and Chapters are waiting in the heirlooms.</p>
        <Link to={to('heirlooms')} onClick={onNavigate} className="btn btn-quiet mt-6">
          See the heirlooms
        </Link>
      </div>
    )

  return (
    <div>
      <ul className="divide-y divide-line border-b border-line">{lines.map((l) => <Line key={l.id} line={l} />)}</ul>
      {cart.error && (
        <p role="alert" className="mt-4 text-[0.95rem]">
          {cart.error}
        </p>
      )}
      <div className="mt-6 flex items-baseline justify-between">
        <span>Subtotal</span>
        <span className="serif text-[1.35rem]">{cart.cart && <Price money={cart.cart.subtotal} />}</span>
      </div>
      <p className="mt-1 text-[0.9rem] text-muted">Shipping and taxes are calculated at checkout.</p>
      <button type="button" className="btn mt-6 w-full" onClick={checkout} disabled={cart.pending || !cart.checkoutHref}>
        {cart.pending ? 'Updating…' : 'Continue to checkout'}
      </button>
    </div>
  )
}

export function BagDrawer() {
  const cart = useCart()
  const panel = useRef<HTMLDivElement>(null)
  useDialog(panel, cart.isOpen, cart.close)
  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cart.isOpen}>
      <div className={`drawer-scrim absolute inset-0 ${cart.isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={cart.close} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ca-bag-title"
        className={`drawer-panel paper absolute overscroll-contain inset-y-0 right-0 flex w-full max-w-[27rem] flex-col overflow-y-auto px-6 pt-6 pb-24 sm:px-8 ${cart.isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        {...inert(!cart.isOpen)}
      >
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 id="ca-bag-title" className="display text-[2rem]">
            Your bag
          </h2>
          <button type="button" className="link text-[0.95rem]" onClick={cart.close} data-autofocus>
            Close
          </button>
        </div>
        <BagContents onNavigate={cart.close} />
      </div>
    </div>
  )
}
