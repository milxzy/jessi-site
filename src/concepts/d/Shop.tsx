import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Product } from '@/shared/commerce'
import { forthcoming } from '@/shared/data/catalog'
import { house } from '@/shared/data/house'
import { actionLabel } from '@/shared/lib/availability'
import { useCollectionProducts, useProduct, useProducts } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { usePurchase } from '@/shared/lib/purchase'
import { productLd, useSeo } from '@/shared/lib/seo'
import { CONCEPT, Head, Loading, Price, Problem, Stock, to } from './ui'

const mm = (v: string) => Number.parseFloat(v)

// the sizes drawn to scale against each other, so the difference can be seen, not just read
function SizeScale({ values, selected }: { values: string[]; selected?: string }) {
  const sizes = values.map(mm).filter((n) => !Number.isNaN(n))
  if (!sizes.length) return null
  const max = Math.max(...sizes)
  return (
    <div aria-hidden="true" className="mt-4 flex items-end justify-center gap-6 rounded-[1.25rem] bg-surface px-4 py-6">
      {values.map((v) => {
        const d = (mm(v) / max) * 64
        return (
          <div key={v} className="text-center">
            <svg width={d + 8} height={d + 8} viewBox={`0 0 ${d + 8} ${d + 8}`} className="mx-auto">
              <circle cx={(d + 8) / 2} cy={(d + 8) / 2} r={d / 2} fill="none" stroke={v === selected ? 'var(--accent)' : 'var(--muted)'} strokeWidth={v === selected ? 4 : 2} />
            </svg>
            <span className={`mt-1 block text-[0.82rem] ${v === selected ? 'text-ink' : 'text-muted'}`}>{v}</span>
          </div>
        )
      })}
    </div>
  )
}

function Purchase({ product, showScale = false }: { product: Product; showScale?: boolean }) {
  const p = usePurchase(product)
  const state = p.variant?.availability ?? 'sold-out'
  return (
    <div>
      {product.options.map((o) => (
        <fieldset key={o.name} className="mt-6">
          <legend className="text-[0.95rem] text-muted">Choose a {o.name.toLowerCase()}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {o.values.map((v) => {
              const a = p.valueAvailability(o.name, v)
              const checked = p.selectedValue(o.name) === v
              return (
                <label key={v} className={`pill relative flex min-h-[48px] cursor-pointer items-center px-5 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${checked ? 'bg-field text-field-ink' : 'bg-surface hover:bg-camel hover:text-camel-ink'} ${a === 'sold-out' ? 'cursor-not-allowed !bg-ground text-muted line-through shadow-[inset_0_0_0_1px_var(--line)]' : ''}`}>
                  <input type="radio" className="sr-only" name={`${product.id}-${o.name}`} checked={checked} disabled={a === 'sold-out'} onChange={() => p.choose(o.name, v)} />
                  {v}
                  {a === 'sold-out' && <span className="sr-only">, sold out</span>}
                </label>
              )
            })}
          </div>
          {showScale && <SizeScale values={o.values} selected={p.selectedValue(o.name)} />}
        </fieldset>
      ))}
      <div className="mt-6 flex items-center gap-3">
        <span className="display text-[1.9rem]">{p.variant && <Price money={p.variant.price} />}</span>
        <Stock state={state} />
      </div>
      {state === 'preorder' && product.details.fulfillmentNote && <p className="mt-2 rounded-[1rem] bg-opal px-4 py-3 text-[0.95rem] leading-snug">{product.details.fulfillmentNote}</p>}
      <button type="button" className="btn mt-5 w-full" disabled={!p.canBuy || p.pending} onClick={p.add}>
        {p.pending ? 'Adding…' : actionLabel[state]}
      </button>
      <p aria-live="polite" className="mt-2 min-h-[1.6em] text-center text-[0.95rem] text-muted">
        {p.error ?? (p.added ? 'Added to your bag.' : '')}
      </p>
    </div>
  )
}

function About({ product }: { product: Product }) {
  const d = product.details
  const rows = [
    ['Fit and sizing', d.sizeGuide],
    ['Materials', d.materials],
    ['Dimensions', d.dimensions],
    ['Care', d.care],
    ['With Chapters', product.productType === 'Huggie' ? d.compatibility : undefined],
  ].filter((r): r is [string, string] => !!r[1])
  return (
    <div className="mt-4 space-y-2">
      {rows.map(([k, v], i) => (
        <details key={k} className="rounded-[1.25rem] bg-surface px-5" open={i === 0 && k === 'Fit and sizing'}>
          <summary className="flex min-h-[56px] items-center justify-between">
            <span>{k}</span>
            <svg aria-hidden="true" viewBox="0 0 12 8" className="chev h-2 w-3">
              <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </summary>
          <p className="pb-5 text-[0.98rem] leading-relaxed text-muted">{v}</p>
        </details>
      ))}
    </div>
  )
}

export function Heirlooms() {
  useSeo({ title: 'The Heirlooms', description: 'The First Huggie and Chapters.', concept: CONCEPT })
  const r = useProducts()
  return (
    <div className="mx-auto max-w-[72rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <Head as="h1" sub="Begin with one fitted huggie. Add a chapter when one feels right.">
        The Heirlooms
      </Head>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.status === 'ready' && !r.data.length && <p className="mt-12 text-center text-muted">The heirlooms will be shown here soon.</p>}
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {r.data?.map((p) => (
          <li key={p.id}>
            <Link to={p.productType === 'Huggie' ? to('heirlooms/the-first-huggie') : to(`heirlooms/chapters#${p.handle}`)} className="group block text-center">
              <span className="arch block">
                <Picture img={p.images[0]!} sizes="(min-width: 768px) 25vw, 46vw" className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
              </span>
              <span className="display mt-3 block text-[1.3rem]">{p.title}</span>
              <span className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[0.95rem]">
                <Price money={p.priceFrom} from={p.variants.length > 1} />
                <Stock state={p.availability} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <section aria-labelledby="cd-forth" className="mx-auto mt-20 max-w-[40rem] rounded-[2rem] bg-surface px-6 py-10 text-center">
        <h2 id="cd-forth" className="display text-[1.8rem]">
          Still in the workshop
        </h2>
        <ul className="mt-6 space-y-5">
          {forthcoming.map((f) => (
            <li key={f.name}>
              <p className="serif text-[1.25rem]">{f.name}</p>
              <p className="mt-1 text-[0.95rem] text-muted">{f.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function Huggie() {
  const r = useProduct('the-first-huggie')
  const product = r.data
  useSeo({
    title: 'The First Huggie',
    description: house.huggieLine,
    concept: CONCEPT,
    type: 'product',
    image: product?.images[0]?.url,
    jsonLd: product ? productLd({ title: product.title, description: product.description, image: product.images[0]?.url, price: product.priceFrom.amount, currency: product.priceFrom.currencyCode, availability: product.availability, url: window.location.href }) : undefined,
  })
  if (r.status === 'loading') return <Loading />
  if (r.status === 'error') return <div className="px-5 py-10"><Problem message={r.error} retry={r.retry} /></div>
  if (!product) return <div className="px-5 py-10"><Problem message="This piece isn’t in the store yet." /></div>
  return (
    <article className="mx-auto max-w-[72rem] pt-4 pb-[clamp(5rem,12vw,9rem)] sm:pt-10 md:grid md:grid-cols-2 md:gap-12 md:px-8">
      <div>
        {/* a swipeable row of arches on the phone, a column on wider screens */}
        <ul className="snap-row flex gap-3 overflow-x-auto px-5 md:flex-col md:overflow-visible md:px-0" aria-label="Images of The First Huggie">
          {product.images.map((img, i) => (
            <li key={img.url} className="w-[82vw] max-w-[26rem] shrink-0 md:w-full md:max-w-none">
              <Picture img={img} priority={i === 0} sizes="(min-width: 768px) 46vw, 82vw" className="arch aspect-[4/5] w-full object-cover" />
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5 pt-8 md:px-0 md:pt-6">
        <div className="md:sticky md:top-20">
          <Link to={to('heirlooms')} className="link text-[0.95rem] text-muted">
            The Heirlooms
          </Link>
          <h1 className="display mt-3 text-[clamp(2.5rem,7vw,3.8rem)]">{product.title}</h1>
          <p className="mt-4 text-[1.08rem] leading-relaxed">{product.description}</p>
          <Purchase product={product} showScale />
          <About product={product} />
          <Link to={to('heirlooms/chapters')} className="mt-6 flex items-center justify-between gap-4 rounded-[1.5rem] bg-field p-5 text-field-ink">
            <span>
              <span className="display block text-[1.5rem]">Add a chapter</span>
              <span className="mt-1 block text-[0.95rem] text-field-ink/85">Every Chapters drop hangs from this huggie.</span>
            </span>
            <span aria-hidden="true" className="serif text-[1.8rem] italic">
              C
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}

// each chapter is a room you open: an accordion, with the linked chapter opened on arrival
export function Chapters() {
  const r = useCollectionProducts('chapters')
  const { hash } = useLocation()
  const [open, setOpen] = useState<string | null>(null)
  useSeo({ title: 'Chapters', description: house.chaptersLine, concept: CONCEPT })
  useEffect(() => {
    if (r.status !== 'ready') return
    setOpen(hash ? hash.slice(1) : (r.data[0]?.handle ?? null))
  }, [hash, r.status, r.data])
  return (
    <article className="mx-auto max-w-[44rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <Head as="h1" sub={house.chapterLine}>
        Chapters™
      </Head>
      <p className="mt-6 text-center text-[1.08rem] leading-relaxed">{house.chaptersLine}</p>
      <p className="mt-3 text-center text-[0.98rem] text-muted">
        Each one hangs from{' '}
        <Link to={to('heirlooms/the-first-huggie')} className="link text-ink">
          The First Huggie™
        </Link>
        , in every size.
      </p>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.status === 'ready' && !r.data.length && <p className="mt-12 text-center text-muted">The first chapters will be shown here soon.</p>}
      <ul className="mt-10 space-y-3">
        {r.data?.map((c) => {
          const isOpen = open === c.handle
          return (
            <li key={c.id} id={c.handle} className="scroll-mt-20 rounded-[2rem] bg-surface">
              <h2>
                <button type="button" aria-expanded={isOpen} aria-controls={`cd-ch-${c.handle}`} onClick={() => setOpen(isOpen ? null : c.handle)} className="flex w-full items-center gap-4 p-3 pr-6 text-left">
                  <Picture img={c.images[0]!} sizes="5rem" alt="" className="arch aspect-[4/5] w-16 shrink-0 object-cover sm:w-20" />
                  <span className="flex-1">
                    <span className="display block text-[clamp(1.6rem,5vw,2.2rem)]">{c.shortTitle}</span>
                    <span className="mt-1 flex items-center gap-2 text-[0.95rem]">
                      <Price money={c.priceFrom} />
                      <Stock state={c.availability} />
                    </span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 12 8" className={`h-2 w-3 shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
              </h2>
              <div id={`cd-ch-${c.handle}`} hidden={!isOpen} className="px-5 pb-6 sm:px-8">
                <Picture img={c.images[0]!} sizes="(min-width: 640px) 36rem, 88vw" className="arch mx-auto aspect-[4/5] w-[min(100%,22rem)] object-cover" />
                <p className="serif mt-6 text-[1.3rem] leading-snug">{c.details.meaning ?? c.description}</p>
                <Purchase product={c} />
                <About product={c} />
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
