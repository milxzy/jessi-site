import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { formatMoney, type Availability, type Money } from '@/shared/commerce'
import { tapestryConfig } from '@/shared/data/tapestry'
import { availabilityLabel } from '@/shared/lib/availability'
import { useSignup } from '@/shared/lib/forms'
import { useReducedMotion, useScrollProgress } from '@/shared/lib/motion'

export const base = '/b'
export const to = (path = '') => (path ? `${base}/${path}` : base)
export const CONCEPT = 'Design B'

export const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

// a detail of the tapestry, zoomed in on one point. used for doorways, bands and motif spotlights.
export function crop(position: string, zoom = 3): CSSProperties {
  return { backgroundImage: `url(${tapestryConfig.desktopSrc})`, backgroundSize: `${zoom * 100}% auto`, backgroundPosition: position }
}

export function Price({ money, from = false }: { money: Money; from?: boolean }) {
  return (
    <span className="tabular-nums">
      {from ? 'From ' : ''}
      {formatMoney(money)}
    </span>
  )
}

export function Stock({ state, className = '' }: { state: Availability; className?: string }) {
  return <span className={`caps ${state === 'preorder' ? 'text-accent' : 'text-muted'} ${className}`}>{availabilityLabel[state]}</span>
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <p role="status" className="caps pulse py-20 text-center text-muted">
      {label}
    </p>
  )
}

export function Problem({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="py-16 text-center">
      <p className="display text-[1.8rem]">Something didn’t load.</p>
      <p className="mt-3 text-muted">{message}</p>
      {retry && (
        <button type="button" onClick={retry} className="btn mt-7">
          Try again
        </button>
      )}
    </div>
  )
}

// centered chapter head: a numeral in small caps, then the title
export function ChapterHead({ n, children, as: Tag = 'h2', id, sub }: { n?: string; children: ReactNode; as?: 'h1' | 'h2'; id?: string; sub?: ReactNode }) {
  return (
    <div className="text-center">
      {n && (
        <p className="caps text-accent" aria-hidden="true">
          {n}
        </p>
      )}
      <Tag id={id} className={`display mx-auto mt-4 max-w-[18ch] ${Tag === 'h1' ? 'text-[clamp(3rem,9vw,7.5rem)]' : 'text-[clamp(2.4rem,6vw,4.8rem)]'}`}>
        {children}
      </Tag>
      {sub && <p className="mx-auto mt-6 max-w-[34rem] text-[1.08rem] text-muted">{sub}</p>}
    </div>
  )
}

export function Signup({ id, lit = false }: { id: string; lit?: boolean }) {
  const s = useSignup()
  return (
    <form onSubmit={s.submit} noValidate className="mx-auto w-full max-w-[34rem]">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          spellCheck={false}
          value={s.email}
          onChange={(e) => s.setEmail(e.target.value)}
          placeholder="Your email address"
          aria-describedby={`${id}-msg`}
          aria-invalid={s.status === 'error' || undefined}
          className="field flex-1 text-center sm:text-left"
        />
        <button type="submit" disabled={s.status === 'sending'} className={lit ? 'btn border-field-ink text-field-ink hover:!bg-field-ink hover:!text-field' : 'btn'}>
          {s.status === 'sending' ? 'Joining…' : 'Join'}
        </button>
      </div>
      <p id={`${id}-msg`} aria-live="polite" className={`mt-3 min-h-[1.6em] text-center text-[0.95rem] sm:text-left ${lit ? 'text-field-ink' : 'text-muted'}`}>
        {s.message}
      </p>
    </form>
  )
}

// the full-bleed tapestry with its layers revealed once on load and drifting apart on scroll
export function Stage({ children, className = '', zoom = 1.1, origin = '50% 40%', drift = true, priority = false }: { children?: ReactNode; className?: string; zoom?: number; origin?: string; drift?: boolean; priority?: boolean }) {
  const reduced = useReducedMotion()
  const [ref, p] = useScrollProgress<HTMLDivElement>(drift && !reduced)
  const [revealing, setRevealing] = useState(false)
  useEffect(() => {
    if (priority && !reduced) setRevealing(true)
  }, [priority, reduced])
  const t = tapestryConfig
  const layers = t.layers ?? [{ id: 'ground', desktopSrc: t.desktopSrc, mobileSrc: t.mobileSrc, depth: 0 }]
  return (
    <div ref={ref} className={`stage ${revealing ? 'is-revealing' : ''} ${className}`}>
      <div role="img" aria-label={t.alt} className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: origin }}>
        {layers.map((l) => (
          <div key={l.id} className="stage-layer" style={{ transform: `translate3d(0, ${(-l.depth * p * 900).toFixed(1)}px, 0)` }}>
            <picture>
              <source media="(max-width: 700px)" srcSet={l.mobileSrc} />
              <img src={l.desktopSrc} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" draggable={false} />
            </picture>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
