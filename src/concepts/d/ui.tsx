import type { ReactNode } from 'react'
import { formatMoney, type Availability, type Money } from '@/shared/commerce'
import { availabilityLabel } from '@/shared/lib/availability'
import { useSignup } from '@/shared/lib/forms'

export const base = '/d'
export const to = (path = '') => (path ? `${base}/${path}` : base)
export const CONCEPT = 'Design D'

export function Price({ money, from = false }: { money: Money; from?: boolean }) {
  return (
    <span className="tabular-nums">
      {from ? 'From ' : ''}
      {formatMoney(money)}
    </span>
  )
}

export function Stock({ state }: { state: Availability }) {
  const tone = state === 'preorder' ? 'bg-opal text-ink' : state === 'sold-out' ? 'bg-surface text-muted' : 'bg-surface text-ink'
  return <span className={`pill inline-block px-2.5 py-0.5 text-[0.82rem] ${tone}`}>{availabilityLabel[state]}</span>
}

export function Loading({ label = 'One moment' }: { label?: string }) {
  return (
    <p role="status" className="serif shimmer py-14 text-center text-[1.2rem] text-muted italic">
      {label}…
    </p>
  )
}

export function Problem({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-[28rem] rounded-[1.5rem] bg-surface px-6 py-10 text-center">
      <p className="display text-[1.7rem]">That didn’t open.</p>
      <p className="mt-2 text-muted">{message}</p>
      {retry && (
        <button type="button" onClick={retry} className="btn mt-6">
          Try again
        </button>
      )}
    </div>
  )
}

export function Head({ as: Tag = 'h2', id, children, sub, center = true }: { as?: 'h1' | 'h2'; id?: string; children: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <Tag id={id} className={`display ${Tag === 'h1' ? 'text-[clamp(2.7rem,8vw,5.2rem)]' : 'text-[clamp(2.2rem,6vw,3.8rem)]'}`}>
        {children}
      </Tag>
      {sub && <p className={`serif mt-3 text-[1.25rem] leading-snug text-muted italic ${center ? 'mx-auto' : ''} max-w-[30rem]`}>{sub}</p>}
    </div>
  )
}

export function Signup({ id, tone = 'light' }: { id: string; tone?: 'light' | 'dark' }) {
  const s = useSignup()
  return (
    <form onSubmit={s.submit} noValidate className="mx-auto w-full max-w-[30rem]">
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input id={id} type="email" name="email" autoComplete="email" spellCheck={false} value={s.email} onChange={(e) => s.setEmail(e.target.value)} placeholder="Your email address" aria-describedby={`${id}-msg`} aria-invalid={s.status === 'error' || undefined} className="field flex-1" />
        <button type="submit" className={tone === 'dark' ? 'btn bg-camel text-camel-ink hover:!bg-field-ink' : 'btn'} disabled={s.status === 'sending'}>
          {s.status === 'sending' ? 'Joining…' : 'Join'}
        </button>
      </div>
      <p id={`${id}-msg`} aria-live="polite" className="mt-2.5 min-h-[1.6em] text-center text-[0.95rem]">
        {s.message}
      </p>
    </form>
  )
}

// the keyhole is defined once and referenced by css; its round head and flared body follow the house motif
export function KeyholeDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <clipPath id="cd-keyhole" clipPathUnits="objectBoundingBox">
        <path d="M0.5 0 C0.79 0 0.98 0.17 0.98 0.37 C0.98 0.48 0.92 0.56 0.84 0.61 L1 1 L0 1 L0.16 0.61 C0.08 0.56 0.02 0.48 0.02 0.37 C0.02 0.17 0.21 0 0.5 0 Z" />
      </clipPath>
    </svg>
  )
}
