import { useEffect, useState, type ReactNode } from 'react'
import { formatMoney, type Availability, type Money } from '@/shared/commerce'
import { availabilityLabel } from '@/shared/lib/availability'
import { useSignup } from '@/shared/lib/forms'
import { useReducedMotion } from '@/shared/lib/motion'
import { tapestryConfig } from '@/shared/data/tapestry'

export const base = '/a'
export const to = (path = '') => (path ? `${base}/${path}` : base)
export const CONCEPT = 'Design A'

export function Price({ money, from = false }: { money: Money; from?: boolean }) {
  return (
    <span className="tabular-nums">
      {from ? 'From ' : ''}
      {formatMoney(money)}
    </span>
  )
}

// written as a note in the margin, never a coloured badge
export function Stock({ state }: { state: Availability }) {
  return (
    <span className={state === 'sold-out' ? 'text-muted line-through decoration-1' : state === 'preorder' ? 'text-accent' : 'text-muted'}>
      {availabilityLabel[state]}
    </span>
  )
}

export function Loading({ label = 'Opening the drawer' }: { label?: string }) {
  return (
    <div role="status" className="py-16">
      <div className="loading-line mx-auto w-40" />
      <p className="serif mt-4 text-center text-muted italic">{label}…</p>
    </div>
  )
}

export function Problem({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="py-12 text-center">
      <p className="serif text-xl">This page couldn’t be fetched.</p>
      <p className="mt-2 text-muted">{message}</p>
      {retry && (
        <button type="button" onClick={retry} className="btn btn-quiet mt-6">
          Try again
        </button>
      )}
    </div>
  )
}

// a small square wrapper for "eyebrow-free" section heads: heading only, optional line beneath
export function Heading({ as: Tag = 'h2', children, sub, className = '' }: { as?: 'h1' | 'h2'; children: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Tag className={`display ${Tag === 'h1' ? 'text-[clamp(2.6rem,7vw,5.6rem)]' : 'text-[clamp(2rem,4.6vw,3.6rem)]'}`}>{children}</Tag>
      {sub && <p className="serif mt-4 max-w-[34rem] text-[1.2rem] leading-snug text-muted italic">{sub}</p>}
    </div>
  )
}

export function Signup({ dark = false, id }: { dark?: boolean; id: string }) {
  const s = useSignup()
  return (
    <form onSubmit={s.submit} noValidate className="w-full">
      <label htmlFor={id} className={`block text-[0.95rem] ${dark ? 'text-field-ink' : 'text-muted'}`}>
        Your email address
      </label>
      <div className="mt-1 flex flex-wrap items-end gap-x-5 gap-y-3">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={s.email}
          onChange={(e) => s.setEmail(e.target.value)}
          placeholder="name@example.com"
          aria-describedby={`${id}-msg`}
          aria-invalid={s.status === 'error' || undefined}
          className={`field min-w-0 flex-1 basis-56 ${dark ? 'field-dark' : ''}`}
        />
        <button type="submit" disabled={s.status === 'sending'} className={dark ? 'btn border-field-ink bg-field-ink text-field hover:bg-transparent hover:text-field-ink' : 'btn'}>
          {s.status === 'sending' ? 'Joining…' : 'Join the house'}
        </button>
      </div>
      <p id={`${id}-msg`} aria-live="polite" className={`mt-3 min-h-[1.5em] text-[0.95rem] ${dark ? 'text-field-ink' : s.status === 'error' ? 'text-ink' : 'text-muted'}`}>
        {s.message}
      </p>
    </form>
  )
}

// the tapestry as a print tipped into a letter: layered, revealed once, then still
export function Tapestry({ crop = 'center', priority = false, className = '', mobile = 'auto' }: { crop?: string; priority?: boolean; className?: string; mobile?: 'auto' | 'never' }) {
  const reduced = useReducedMotion()
  const [revealing, setRevealing] = useState(false)
  useEffect(() => {
    if (priority && !reduced) setRevealing(true)
  }, [priority, reduced])
  const t = tapestryConfig
  const layers = t.layers ?? [{ id: 'ground', desktopSrc: t.desktopSrc, mobileSrc: t.mobileSrc, depth: 0 }]
  return (
    <div className={`tap ${revealing ? 'is-revealing' : ''} ${className}`} role="img" aria-label={t.alt}>
      {layers.map((l) => (
        <picture key={l.id}>
          {mobile === 'auto' && <source media="(max-width: 640px)" srcSet={l.mobileSrc} />}
          <img src={l.desktopSrc} alt="" style={{ objectPosition: crop }} loading={priority ? 'eager' : 'lazy'} decoding="async" draggable={false} />
        </picture>
      ))}
    </div>
  )
}
