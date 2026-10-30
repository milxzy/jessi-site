import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Product } from '@/shared/commerce'
import { forthcoming } from '@/shared/data/catalog'
import { house } from '@/shared/data/house'
import { actionLabel } from '@/shared/lib/availability'
import { useCollectionProducts, useProduct, useProducts } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { usePurchase } from '@/shared/lib/purchase'
import { productLd, useSeo } from '@/shared/lib/seo'
import { ChapterHead, CONCEPT, Loading, Price, Problem, roman, Stock, to } from './ui'

function Purchase({ product }: { product: Product }) {
  const p = usePurchase(product)
  const state = p.variant?.availability ?? 'sold-out'
  return (
    <div>
      {product.options.map((o) => (
        <fieldset key={o.name} className="mt-8">
          <legend className="caps text-muted">{o.name}</legend>
          <div className="mt-3 flex flex-wrap gap-6">
            {o.values.map((v) => {
              const a = p.valueAvailability(o.name, v)
              const checked = p.selectedValue(o.name) === v
              return (
                <label key={v} className={`relative flex min-h-[44px] cursor-pointer items-center text-[1.05rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent ${checked ? 'text-ink' : 'text-muted hover:text-ink'} ${a === 'sold-out' ? 'cursor-not-allowed line-through opacity-60' : ''}`}>
                  <input type="radio" className="sr-only" name={`${product.id}-${o.name}`} checked={checked} disabled={a === 'sold-out'} onChange={() => p.choose(o.name, v)} />
                  <span className={`border-b pb-1 transition-colors duration-500 ${checked ? 'border-accent' : 'border-transparent'}`}>{v}</span>
                  {a === 'sold-out' && <span className="sr-only">, sold out</span>}
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
      <div className="mt-8 flex items-baseline gap-5">
        <span className="display text-[2rem]">{p.variant && <Price money={p.variant.price} />}</span>
        <Stock state={state} />
      </div>
      {state === 'preorder' && product.details.fulfillmentNote && <p className="mt-3 max-w-[30rem] text-[0.95rem] text-muted">{product.details.fulfillmentNote}</p>}
      <button type="button" className="btn btn-solid mt-7 w-full sm:w-auto sm:min-w-[18rem]" disabled={!p.canBuy || p.pending} onClick={p.add}>
        {p.pending ? 'Adding…' : actionLabel[state]}
      </button>
      <p aria-live="polite" className="mt-3 min-h-[1.6em] text-[0.95rem] text-muted">
        {p.error ?? (p.added ? 'Added to your bag.' : '')}
      </p>
    </div>
  )
}

function Specs({ product }: { product: Product }) {
  const d = product.details
  const rows = [
    ['Materials', d.materials],
    ['Dimensions', d.dimensions],
    ['Care', d.care],
    ['Fit', d.sizeGuide],
  ].filter((r): r is [string, string] => !!r[1])
  return (
    <div className="mt-6 border-t border-line">
      {rows.map(([k, v]) => (
        <details key={k} className="border-b border-line">
          <summary className="flex min-h-[54px] items-center justify-between">
            <span className="caps">{k === 'Fit' ? 'Fit and size guide' : k}</span>
            <span className="marker text-accent" aria-hidden="true">
              ›
            </span>
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
  const huggies = r.data?.filter((p) => p.productType === 'Huggie') ?? []
  const chapters = r.data?.filter((p) => p.productType === 'Chapter') ?? []
  return (
    <div className="px-5 pt-36 pb-[clamp(6rem,12vw,10rem)] sm:px-10">
      <ChapterHead as="h1" sub="One fitted huggie, and the chapters that hang from it.">
        The Heirlooms
      </ChapterHead>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.status === 'ready' && !r.data.length && <p className="mt-16 text-center text-muted">The heirlooms will be shown here soon.</p>}
      {huggies.map((h) => (
        <section key={h.id} aria-labelledby={`cb-${h.handle}`} className="mx-auto mt-20 grid max-w-[80rem] items-center gap-10 md:grid-cols-2">
          <Link to={to('heirlooms/the-first-huggie')} aria-label={h.title}>
            <Picture img={h.images[0]!} sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[4/5] w-full object-cover" />
          </Link>
          <div className="text-center md:text-left">
            <h2 id={`cb-${h.handle}`} className="display text-[clamp(2.2rem,4.6vw,3.6rem)]">
              {h.title}
            </h2>
            <p className="mt-5 text-[1.08rem] text-muted">{h.description}</p>
            <p className="mt-6 flex items-baseline justify-center gap-4 md:justify-start">
              <Price money={h.priceFrom} from />
              <Stock state={h.availability} />
            </p>
            <Link to={to('heirlooms/the-first-huggie')} className="btn mt-8">
              Choose a size
            </Link>
          </div>
        </section>
      ))}
      {chapters.length > 0 && (
        <section aria-labelledby="cb-chapters" className="mx-auto mt-[clamp(6rem,10vw,9rem)] max-w-[80rem]">
          <h2 id="cb-chapters" className="display text-center text-[clamp(2.2rem,4.6vw,3.6rem)]">
            Chapters™
          </h2>
          <p className="mt-4 text-center text-muted">{house.chapterLine}</p>
          <ul className="mt-12 grid gap-y-12 sm:grid-cols-3">
            {chapters.map((c, i) => (
              <li key={c.id} className="text-center">
                <Link to={to(`heirlooms/chapters?chapter=${c.handle}`)} className="group block">
                  <Picture img={c.images[0]!} sizes="(min-width: 640px) 33vw, 92vw" className="aspect-[3/4] w-full object-cover" />
                  <span className="caps mt-5 block text-accent">{roman[i]}</span>
                  <span className="display mt-2 block text-[1.8rem] transition-colors duration-500 group-hover:text-accent">{c.shortTitle}</span>
                  <span className="mt-2 flex items-baseline justify-center gap-4">
                    <Price money={c.priceFrom} />
                    <Stock state={c.availability} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="cb-dev" className="mx-auto mt-24 max-w-[56rem] border-t border-line pt-12 text-center">
        <h2 id="cb-dev" className="caps text-muted">
          In development
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2">
          {forthcoming.map((f) => (
            <li key={f.name}>
              <p className="display text-[1.5rem]">{f.name}</p>
              <p className="mt-2 text-[0.95rem] text-muted">{f.note}</p>
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
  const [shown, setShown] = useState(0)
  useSeo({
    title: 'The First Huggie',
    description: house.huggieLine,
    concept: CONCEPT,
    type: 'product',
    image: product?.images[0]?.url,
    jsonLd: product ? productLd({ title: product.title, description: product.description, image: product.images[0]?.url, price: product.priceFrom.amount, currency: product.priceFrom.currencyCode, availability: product.availability, url: window.location.href }) : undefined,
  })
  if (r.status === 'loading') return <div className="pt-32"><Loading /></div>
  if (r.status === 'error') return <div className="pt-32"><Problem message={r.error} retry={r.retry} /></div>
  if (!product) return <div className="pt-32"><Problem message="This piece isn’t in the store yet." /></div>
  const img = product.images[shown] ?? product.images[0]!
  return (
    <article className="pt-20">
      <div className="grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <Picture img={img} priority sizes="(min-width: 1024px) 58vw, 100vw" className="h-full max-h-[90svh] w-full object-cover lg:max-h-none" />
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2" role="group" aria-label="Images">
              {product.images.map((im, i) => (
                <button key={im.url} type="button" onClick={() => setShown(i)} aria-label={`Show image ${i + 1}`} aria-pressed={shown === i} className="flex h-11 w-11 items-center justify-center">
                  <span className={`block h-px w-7 transition-colors duration-500 ${shown === i ? 'bg-field-ink' : 'bg-field-ink/30'}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center px-5 py-14 sm:px-10 lg:col-span-5 lg:px-14">
          <Link to={to('heirlooms')} className="caps link self-start text-muted">
            The Heirlooms
          </Link>
          <h1 className="display mt-6 text-[clamp(2.6rem,5vw,4.2rem)]">{product.title}</h1>
          <p className="mt-6 text-[1.08rem] leading-relaxed">{product.description}</p>
          <Purchase product={product} />
          <Specs product={product} />
        </div>
      </div>
      <section aria-labelledby="cb-compat" className="px-5 py-[clamp(6rem,12vw,10rem)] text-center sm:px-10">
        <ChapterHead id="cb-compat" sub={product.details.compatibility}>
          Made for Chapters™
        </ChapterHead>
        <Link to={to('heirlooms/chapters')} className="btn mt-10">
          Choose a chapter
        </Link>
      </section>
    </article>
  )
}

// one chapter at a time, chosen from a row of numerals: an arrow-key tablist
export function Chapters() {
  const r = useCollectionProducts('chapters')
  const [params, setParams] = useSearchParams()
  const list = r.data ?? []
  const wanted = params.get('chapter')
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  useSeo({ title: 'Chapters', description: house.chaptersLine, concept: CONCEPT })

  useEffect(() => {
    const i = list.findIndex((c) => c.handle === wanted)
    if (i >= 0) setActive(i)
  }, [wanted, list])

  const select = (i: number, focus = false) => {
    setActive(i)
    const c = list[i]
    if (c) setParams({ chapter: c.handle }, { replace: true })
    if (focus) tabs.current[i]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') select((active + 1) % list.length, true)
    else if (e.key === 'ArrowLeft') select((active - 1 + list.length) % list.length, true)
    else return
    e.preventDefault()
  }
  const c = list[active]

  return (
    <article className="px-5 pt-36 pb-[clamp(6rem,12vw,10rem)] sm:px-10">
      <ChapterHead as="h1" sub={house.chaptersLine}>
        Chapters™
      </ChapterHead>
      <p className="display mt-8 text-center text-[1.6rem] text-accent">{house.chapterLine}</p>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.status === 'ready' && !list.length && <p className="mt-16 text-center text-muted">The first chapters will be shown here soon.</p>}
      {c && (
        <>
          <div role="tablist" aria-label="Chapters" onKeyDown={onKey} className="mx-auto mt-16 flex max-w-[48rem] justify-center gap-2 border-b border-line">
            {list.map((ch, i) => (
              <button
                key={ch.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                role="tab"
                id={`cb-tab-${ch.handle}`}
                aria-selected={i === active}
                aria-controls="cb-chapter-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                className={`-mb-px flex-1 border-b px-2 pt-2 pb-4 transition-colors duration-500 ${i === active ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'}`}
              >
                <span className="caps block">{roman[i]}</span>
                <span className="display mt-2 block text-[clamp(1.1rem,2.6vw,1.7rem)]">{ch.shortTitle}</span>
              </button>
            ))}
          </div>
          <div id="cb-chapter-panel" role="tabpanel" aria-labelledby={`cb-tab-${c.handle}`} key={c.id} className="fade-in mx-auto mt-14 grid max-w-[72rem] items-center gap-12 md:grid-cols-2">
            <Picture img={c.images[0]!} sizes="(min-width: 768px) 44vw, 92vw" className="aspect-[4/5] w-full object-cover" />
            <div>
              <h2 className="display text-[clamp(2.4rem,5vw,4rem)]">{c.shortTitle}</h2>
              <p className="mt-5 text-[1.1rem] leading-[1.8]">{c.details.meaning ?? c.description}</p>
              <Purchase product={c} />
              <Specs product={c} />
              <p className="mt-8 text-[0.95rem] text-muted">
                Hangs from <Link to={to('heirlooms/the-first-huggie')} className="link link-on text-ink">The First Huggie™</Link>, in every size.
              </p>
            </div>
          </div>
        </>
      )}
    </article>
  )
}
