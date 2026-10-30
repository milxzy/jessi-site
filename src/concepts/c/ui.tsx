import { useEffect, useState, type ReactNode } from 'react'
import { formatMoney, type Availability, type Money } from '@/shared/commerce'
import { tapestryConfig } from '@/shared/data/tapestry'
import { availabilityLabel } from '@/shared/lib/availability'
import { useSignup } from '@/shared/lib/forms'
import { useReducedMotion } from '@/shared/lib/motion'

export const base = '/c'
export const to = (path = '') => (path ? `${base}/${path}` : base)
export const CONCEPT = 'Design C'

export const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export function Price({ money, from = false }: { money: Money; from?: boolean }) {
  return (
    <span className="tabular-nums">
      {from ? 'from ' : ''}
      {formatMoney(money)}
    </span>
  )
}

export function Stock({ state }: { state: Availability }) {
  return <span className={state === 'preorder' ? 'text-accent' : state === 'sold-out' ? 'text-muted' : ''}>{availabilityLabel[state]}</span>
}

export function Loading({ label = 'Retrieving from the archive' }: { label?: string }) {
  return (
    <p role="status" className="caption py-16 text-muted">
      {label}…
    </p>
  )
}

export function Problem({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="rule py-10">
      <p className="display text-[2.4rem]">Not retrieved</p>
      <p className="mt-2 text-muted">{message}</p>
      {retry && (
        <button type="button" onClick={retry} className="btn btn-line mt-6">
          Try again
        </button>
      )}
    </div>
  )
}

// a page title: the numeral in the margin, the title very large
export function Title({ n, children, sub }: { n?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <header className="grid gap-4 md:grid-cols-12">
      <p className="caption md:col-span-2 md:pt-4" aria-hidden={!n}>
        {n}
      </p>
      <div className="md:col-span-10">
        <h1 className="display text-[clamp(3.6rem,12vw,11rem)]">{children}</h1>
        {sub && <p className="mt-5 max-w-[34rem] text-[1.1rem] text-muted">{sub}</p>}
      </div>
    </header>
  )
}

// a section head inside a page: rule above, numeral and heading on one line
export function SectionHead({ n, id, children, aside }: { n: string; id: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="rule grid gap-3 pt-3 md:grid-cols-12">
      <p className="caption md:col-span-2">{n}</p>
      <h2 id={id} className="display text-[clamp(2.4rem,5.6vw,4.6rem)] md:col-span-7">
        {children}
      </h2>
      {aside && <div className="caption text-muted md:col-span-3 md:text-right">{aside}</div>}
    </div>
  )
}

export function Signup({ id }: { id: string }) {
  const s = useSignup()
  return (
    <form onSubmit={s.submit} noValidate>
      <label htmlFor={id} className="caption block">
        Email address
      </label>
      <div className="mt-2 flex gap-2">
        <input id={id} type="email" name="email" autoComplete="email" spellCheck={false} value={s.email} onChange={(e) => s.setEmail(e.target.value)} placeholder="name@example.com" aria-describedby={`${id}-msg`} aria-invalid={s.status === 'error' || undefined} className="field min-w-0 flex-1" />
        <button type="submit" className="btn shrink-0" disabled={s.status === 'sending'}>
          {s.status === 'sending' ? 'Adding…' : 'Subscribe'}
        </button>
      </div>
      <p id={`${id}-msg`} aria-live="polite" className="caption mt-2 min-h-[1.5em]">
        {s.message}
      </p>
    </form>
  )
}

// the tapestry as a catalogue plate. the crop is the archive's own: tighter, centred on the tree.
export function Plate({ className = '', priority = false, children, fit = 'cover', position = '50% 46%' }: { className?: string; priority?: boolean; children?: ReactNode; fit?: 'cover' | 'contain'; position?: string }) {
  const t = tapestryConfig
  const reduced = useReducedMotion()
  const [enter, setEnter] = useState(false)
  useEffect(() => {
    if (priority && !reduced) setEnter(true)
  }, [priority, reduced])
  return (
    <div className={`relative overflow-hidden bg-[#2a1d15] ${enter ? 'plate-in' : ''} ${className}`}>
      <picture>
        <source media="(max-width: 640px)" srcSet={t.mobileSrc} />
        <img src={t.desktopSrc} alt={t.alt} width={t.width} height={t.height} loading={priority ? 'eager' : 'lazy'} decoding="async" className="absolute inset-0 h-full w-full" style={{ objectFit: fit, objectPosition: position }} />
      </picture>
      {children}
    </div>
  )
}
