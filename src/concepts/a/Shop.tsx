import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Product } from '@/shared/commerce'
import { forthcoming } from '@/shared/data/catalog'
import { house } from '@/shared/data/house'
import { actionLabel } from '@/shared/lib/availability'
import { useCollectionProducts, useProduct, useProducts } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { usePurchase } from '@/shared/lib/purchase'
import { productLd, useSeo } from '@/shared/lib/seo'
import { CONCEPT, Heading, Loading, Price, Problem, Stock, to } from './ui'

function Purchase({ product, compact = false }: { product: Product; compact?: boolean }) {
  const p = usePurchase(product)
  const state = p.variant?.availability ?? 'sold-out'
  return (
    <div>
      {product.options.map((o) => (
        <fieldset key={o.name} className="mt-6">
          <legend className="text-[0.95rem] text-muted">{o.name}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {o.values.map((v) => {
              const a = p.valueAvailability(o.name, v)
              const checked = p.selectedValue(o.name) === v
              return (
                <label key={v} className={`relative flex min-h-[48px] min-w-[5.5rem] cursor-pointer items-center justify-center border px-4 text-[1rem] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-offset-2 ${checked ? 'border-ink bg-ink text-surface' : 'border-line hover:border-ink'} ${a === 'sold-out' ? 'cursor-not-allowed text-muted line-through' : ''}`}>
                  <input type="radio" name={`${product.id}-${o.name}`} value={v} checked={checked} disabled={a === 'sold-out'} onChange={() => p.choose(o.name, v)} className="sr-only" />
                  {v}
                  {a === 'sold-out' && <span className="sr-only">, sold out</span>}
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
      <div className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${compact ? 'mt-4' : 'mt-7'}`}>
        <span className="serif text-[1.6rem]">{p.variant && <Price money={p.variant.price} />}</span>
        <Stock state={state} />
      </div>
      {state === 'preorder' && product.details.fulfillmentNote && <p className="mt-2 max-w-[30rem] text-[0.95rem] leading-snug text-muted">{product.details.fulfillmentNote}</p>}
      <button type="button" className="btn mt-5 w-full sm:w-auto sm:min-w-[16rem]" disabled={!p.canBuy || p.pending} onClick={p.add}>
        {p.pending ? 'Adding…' : actionLabel[state]}
      </button>
      <p aria-live="polite" className="mt-3 min-h-[1.5em] text-[0.95rem] text-muted">
        {p.error ? p.error : p.added ? 'Added to your bag.' : ''}
      </p>
    </div>
  )
}

function Details({ product }: { product: Product }) {
  const d = product.details
  const rows = [
    ['Materials', d.materials],
    ['Dimensions', d.dimensions],
    ['Care', d.care],
  ].filter((r): r is [string, string] => !!r[1])
  if (!rows.length) return null
  return (
    <dl className="mt-8 divide-y divide-line border-y border-line">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]">
          <dt className="serif text-[1.1rem]">{k}</dt>
          <dd className="text-[0.98rem] leading-relaxed text-muted">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Heirlooms() {
  useSeo({ title: 'The Heirlooms', description: 'The First Huggie and Chapters, the first heirlooms of Jessi Frances.', concept: CONCEPT })
  const products = useProducts()
  return (
    <div className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <Heading as="h1" sub="Begin with one fitted huggie. Add a chapter when one feels right.">
          The Heirlooms
        </Heading>
        {products.status === 'loading' && <Loading />}
        {products.status === 'error' && <Problem message={products.error} retry={products.retry} />}
        {products.status === 'ready' && !products.data.length && <p className="serif mt-12 text-[1.4rem]">The heirlooms will appear here soon.</p>}
        {products.status === 'ready' && products.data.length > 0 && (
          <>
            <section aria-labelledby="ca-col-huggie" className="mt-16">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-3">
                <h2 id="ca-col-huggie" className="display text-[clamp(1.9rem,3.6vw,2.7rem)]">
                  The First Huggie™
                </h2>
                <Link className="link" to={to('heirlooms/the-first-huggie')}>
                  Design, fit and sizes
                </Link>
              </div>
              <ProductList items={products.data.filter((p) => p.productType === 'Huggie')} />
            </section>
            <section aria-labelledby="ca-col-chapters" className="mt-20">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-3">
                <h2 id="ca-col-chapters" className="display text-[clamp(1.9rem,3.6vw,2.7rem)]">
                  Chapters™
                </h2>
                <Link className="link" to={to('heirlooms/chapters')}>
                  The meaning of each chapter
                </Link>
              </div>
              <ProductList items={products.data.filter((p) => p.productType === 'Chapter')} />
            </section>
          </>
        )}
        <section aria-labelledby="ca-forth" className="mt-24 grid gap-6 border-t border-line pt-8 md:grid-cols-12">
          <h2 id="ca-forth" className="serif text-[1.4rem] md:col-span-4">
            In development
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 md:col-span-8">
            {forthcoming.map((f) => (
              <li key={f.name}>
                <p className="serif text-[1.15rem]">{f.name}</p>
                <p className="mt-1 text-[0.95rem] text-muted">{f.note}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function ProductList({ items }: { items: Product[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((p) => {
        const href = p.productType === 'Chapter' ? to(`heirlooms/chapters?chapter=${p.handle}`) : to('heirlooms/the-first-huggie')
        return (
          <li key={p.id}>
            <Link to={href} className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 py-5 sm:grid-cols-[8rem_1fr_auto] sm:gap-8">
              <span className="paper block p-1.5">
                <Picture img={p.images[0]!} sizes="8rem" className="aspect-[4/5] w-full object-cover" />
              </span>
              <span>
                <span className="serif block text-[clamp(1.35rem,2.4vw,1.8rem)] leading-tight group-hover:italic">{p.title}</span>
                <span className="mt-1 block max-w-[36rem] text-[0.98rem] text-muted">{p.description}</span>
              </span>
              <span className="col-start-2 text-[0.98rem] sm:col-start-auto sm:text-right">
                <Price money={p.priceFrom} from={p.variants.length > 1} />
                <br />
                <Stock state={p.availability} />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
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
  if (r.status === 'loading') return <Loading label="Bringing out The First Huggie" />
  if (r.status === 'error') return <Problem message={r.error} retry={r.retry} />
  if (!product) return <Problem message="This piece isn’t in the store yet." />
  return (
    <article className="px-4 pt-10 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-16">
      <div className="mx-auto grid max-w-[80rem] gap-12 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {product.images.map((img, i) => (
            <div key={img.url} className="paper p-2.5 sm:p-4">
              <Picture img={img} priority={i === 0} sizes="(min-width: 1024px) 55vw, 94vw" className="aspect-[4/5] w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-8">
            <p className="text-[0.95rem] text-muted">
              <Link to={to('heirlooms')} className="link">
                The Heirlooms
              </Link>
            </p>
            <h1 className="display mt-4 text-[clamp(2.4rem,5vw,3.8rem)]">{product.title}</h1>
            <p className="mt-5 text-[1.1rem] leading-[1.7]">{product.description}</p>
            <Purchase product={product} />
            {product.details.sizeGuide && (
              <details className="border-t border-line py-4">
                <summary className="flex min-h-[44px] items-center justify-between">
                  <span className="serif text-[1.2rem]">Fit and size guide</span>
                  <span className="marker text-[1.4rem] leading-none" aria-hidden="true">+</span>
                </summary>
                <p className="mt-2 leading-relaxed text-muted">{product.details.sizeGuide}</p>
              </details>
            )}
            <Details product={product} />
          </div>
        </div>
      </div>

      <section aria-labelledby="ca-design" className="mx-auto mt-[clamp(6rem,10vw,9rem)] grid max-w-[80rem] gap-10 lg:grid-cols-12">
        <h2 id="ca-design" className="display text-[clamp(2rem,4vw,3rem)] lg:col-span-4">
          The design
        </h2>
        <div className="space-y-5 text-[1.1rem] leading-[1.7] lg:col-span-7 lg:col-start-6">
          <p>{house.huggieLine} It is the foundation of the house: the piece every chapter returns to.</p>
          <p className="text-muted">Placeholder: the founder’s notes on the shape, the fit against the ear, and the hand finishing will be added here.</p>
        </div>
      </section>

      <section aria-labelledby="ca-compat" className="paper mx-auto mt-16 grid max-w-[80rem] gap-6 p-6 sm:p-10 md:grid-cols-12">
        <h2 id="ca-compat" className="serif text-[1.6rem] leading-tight md:col-span-4">
          Made for Chapters™
        </h2>
        <div className="md:col-span-7 md:col-start-6">
          <p className="text-[1.05rem] leading-relaxed">{product.details.compatibility ?? 'Every Chapters drop attaches to The First Huggie.'}</p>
          <Link to={to('heirlooms/chapters')} className="btn btn-quiet mt-6">
            Choose a chapter
          </Link>
        </div>
      </section>
    </article>
  )
}

export function Chapters() {
  const r = useCollectionProducts('chapters')
  const [params] = useSearchParams()
  const focus = params.get('chapter')
  const [highlight, setHighlight] = useState<string | null>(focus)
  useSeo({ title: 'Chapters', description: house.chaptersLine, concept: CONCEPT })
  useEffect(() => {
    if (!focus || r.status !== 'ready') return
    setHighlight(focus)
    document.getElementById(focus)?.scrollIntoView({ block: 'start' })
  }, [focus, r.status])

  return (
    <article className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <Heading as="h1" sub={house.chapterLine}>
          Chapters™
        </Heading>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="serif text-[clamp(1.35rem,2.2vw,1.8rem)] leading-[1.35] font-light md:col-span-7">{house.chaptersLine}</p>
          <p className="text-[1.02rem] leading-relaxed text-muted md:col-span-4 md:col-start-9">
            Every chapter hangs from <Link to={to('heirlooms/the-first-huggie')} className="link text-ink">The First Huggie™</Link>, in any size. Take one off, put another on, as the years change.
          </p>
        </div>
        {r.status === 'loading' && <Loading />}
        {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
        {r.status === 'ready' && !r.data.length && <p className="serif mt-12 text-[1.4rem]">The first chapters will be shown here soon.</p>}
        {r.status === 'ready' && (
          <ol className="mt-[clamp(4rem,8vw,7rem)] space-y-[clamp(5rem,9vw,8rem)]">
            {r.data.map((c, i) => (
              <li key={c.id} id={c.handle} className={`grid scroll-mt-8 items-center gap-10 md:grid-cols-12`}>
                <div className={`paper p-3 sm:p-4 md:col-span-5 ${i % 2 ? 'md:order-2 md:col-start-8' : ''}`} style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                  <Picture img={c.images[0]!} sizes="(min-width: 768px) 38vw, 92vw" className="aspect-[4/5] w-full object-cover" />
                </div>
                <div className={`md:col-span-6 ${i % 2 ? 'md:col-start-1 md:row-start-1' : 'md:col-start-7'}`}>
                  <p className="serif text-[1.1rem] text-accent italic">Chapter {['one', 'two', 'three', 'four', 'five'][i] ?? i + 1}</p>
                  <h2 className={`display mt-2 text-[clamp(2.2rem,4.6vw,3.6rem)] ${highlight === c.handle ? 'italic' : ''}`}>{c.shortTitle}</h2>
                  <p className="mt-4 max-w-[32rem] text-[1.1rem] leading-[1.7]">{c.details.meaning ?? c.description}</p>
                  <Purchase product={c} compact />
                  <Details product={c} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  )
}
