import { Link, useSearchParams } from 'react-router-dom'
import type { Product } from '@/shared/commerce'
import { forthcoming } from '@/shared/data/catalog'
import { house } from '@/shared/data/house'
import { actionLabel, availabilityLabel } from '@/shared/lib/availability'
import { useCollectionProducts, useProduct, useProducts } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { usePurchase } from '@/shared/lib/purchase'
import { productLd, useSeo } from '@/shared/lib/seo'
import { CONCEPT, Loading, Price, Problem, roman, SectionHead, Stock, Title, to } from './ui'

// sizes are chosen from a small table: one row per variant, availability in its own column
function Purchase({ product }: { product: Product }) {
  const p = usePurchase(product)
  const state = p.variant?.availability ?? 'sold-out'
  const option = product.options[0]
  return (
    <div className="mt-6">
      {option && (
        <fieldset>
          <legend className="caption mb-2 font-semibold">{option.name}</legend>
          <div className="border-t border-ink">
            {option.values.map((v) => {
              const a = p.valueAvailability(option.name, v)
              const checked = p.selectedValue(option.name) === v
              const variant = product.variants.find((x) => x.selectedOptions.some((o) => o.value === v))
              return (
                <label key={v} className={`grid min-h-[48px] cursor-pointer grid-cols-[1.5rem_1fr_auto_auto] items-center gap-4 border-b border-line px-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 ${checked ? 'bg-surface' : ''} ${a === 'sold-out' ? 'cursor-not-allowed text-muted' : 'hover:bg-surface'}`}>
                  <input type="radio" name={`${product.id}-${option.name}`} checked={checked} disabled={a === 'sold-out'} onChange={() => p.choose(option.name, v)} className="accent-[var(--ink)]" />
                  <span>{v}</span>
                  <span className="caption">{availabilityLabel[a]}</span>
                  <span className="caption tabular-nums">{variant && <Price money={variant.price} />}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      )}
      <div className="mt-5 flex items-baseline justify-between">
        <span className="display text-[2.6rem]">{p.variant && <Price money={p.variant.price} />}</span>
        <span className="caption">
          <Stock state={state} />
        </span>
      </div>
      {state === 'preorder' && product.details.fulfillmentNote && <p className="caption mt-1 text-muted">{product.details.fulfillmentNote}</p>}
      <button type="button" className="btn mt-4 w-full" disabled={!p.canBuy || p.pending} onClick={p.add}>
        <span>{p.pending ? 'Adding…' : actionLabel[state]}</span>
        <span aria-hidden="true">{p.variant?.title !== 'Default' ? p.variant?.title : ''}</span>
      </button>
      <p aria-live="polite" className="caption mt-2 min-h-[1.5em]">
        {p.error ?? (p.added ? 'Added to the bag.' : '')}
      </p>
    </div>
  )
}

function Spec({ product }: { product: Product }) {
  const d = product.details
  const rows = [
    ['Object', product.title],
    ['Materials', d.materials],
    ['Dimensions', d.dimensions],
    ['Fit', d.sizeGuide],
    ['Care', d.care],
    ['Compatibility', d.compatibility],
  ].filter((r): r is [string, string] => !!r[1])
  return (
    <table className="mt-8 w-full border-collapse text-left">
      <caption className="caption mb-2 text-left font-semibold">Catalogue entry</caption>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-t border-line align-top">
            <th scope="row" className="caption w-[7.5rem] py-2.5 pr-3 font-normal text-muted">
              {k}
            </th>
            <td className="caption py-2.5 !text-[0.9rem]">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const filters = [
  { key: 'all', label: 'All' },
  { key: 'Huggie', label: 'The First Huggie™' },
  { key: 'Chapter', label: 'Chapters™' },
]

export function Heirlooms() {
  useSeo({ title: 'The Heirlooms', description: 'The catalogue of Jessi Frances: The First Huggie and Chapters.', concept: CONCEPT })
  const r = useProducts()
  // the filter lives in the url, so a filtered catalogue can be shared or reloaded
  const [params, setParams] = useSearchParams()
  const filter = filters.some((f) => f.key === params.get('type')) ? params.get('type')! : 'all'
  const setFilter = (key: string) => setParams(key === 'all' ? {} : { type: key }, { replace: true })
  const list = (r.data ?? []).filter((p) => filter === 'all' || p.productType === filter)
  return (
    <div className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Section II" sub="The catalogue: one fitted huggie and the chapters that hang from it.">
        The Heirlooms
      </Title>
      <div role="group" aria-label="Filter the catalogue" className="caption mt-12 flex flex-wrap gap-2 border-t border-ink pt-3 !text-[0.9rem]">
        {filters.map((f) => (
          <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className={`min-h-[40px] px-3 ${filter === f.key ? 'bg-ink text-ground' : 'shadow-[inset_0_0_0_1px_var(--line)] hover:shadow-[inset_0_0_0_1px_var(--ink)]'}`}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center text-muted" aria-live="polite">
          {r.status === 'ready' ? `${list.length} ${list.length === 1 ? 'object' : 'objects'}` : ''}
        </span>
      </div>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.status === 'ready' && !list.length && <p className="display mt-10 text-[2.4rem]">No objects in this part of the catalogue yet.</p>}
      <ol className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => {
          const n = (r.data ?? []).indexOf(p)
          const href = p.productType === 'Chapter' ? to(`heirlooms/chapters#${p.handle}`) : to('heirlooms/the-first-huggie')
          return (
            <li key={p.id} className={n === 0 && filter === 'all' ? 'sm:col-span-2 lg:row-span-2' : ''}>
              <Link to={href} className="group block">
                <Picture img={p.images[0]!} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw" className="aspect-[4/5] w-full object-cover" />
                <span className="caption mt-2 grid grid-cols-[4.5rem_1fr] gap-x-2 border-t border-ink pt-1.5">
                  <span>Plate {roman[n + 1]}</span>
                  <span className="group-hover:underline">{p.title}</span>
                  <span />
                  <span className="text-muted">
                    <Price money={p.priceFrom} from={p.variants.length > 1} />, <Stock state={p.availability} />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
      <section aria-labelledby="cc-forth" className="mt-24">
        <SectionHead n="Forthcoming" id="cc-forth">
          In development
        </SectionHead>
        <dl className="mt-4 md:ml-[16.66%]">
          {forthcoming.map((f) => (
            <div key={f.name} className="rule-soft grid gap-1 py-3 sm:grid-cols-[16rem_1fr]">
              <dt>{f.name}</dt>
              <dd className="caption text-muted">{f.note} Not for sale.</dd>
            </div>
          ))}
        </dl>
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
  if (r.status === 'loading') return <div className="px-6"><Loading /></div>
  if (r.status === 'error') return <div className="px-6"><Problem message={r.error} retry={r.retry} /></div>
  if (!product) return <div className="px-6"><Problem message="This piece isn’t in the store yet." /></div>
  return (
    <article className="mx-auto max-w-[110rem] px-4 pt-8 sm:px-6 sm:pt-12">
      <p className="caption">
        <Link to={to('heirlooms')} className="link">
          The Heirlooms
        </Link>{' '}
        / Plate II
      </p>
      <div className="mt-4 grid gap-8 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {product.images.map((img, i) => (
            <figure key={img.url} className={i === 0 ? 'sm:col-span-2' : ''}>
              <Picture img={img} priority={i === 0} sizes="(min-width: 1024px) 56vw, 92vw" className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]" />
              <figcaption className="caption mt-1.5 text-muted">
                Plate II{String.fromCharCode(97 + i)}. Placeholder drawing.
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-20">
            <h1 className="display text-[clamp(3rem,6vw,5.4rem)]">{product.title}</h1>
            <p className="mt-4 text-[1.08rem] leading-relaxed">{product.description}</p>
            <Purchase product={product} />
            <Spec product={product} />
          </div>
        </div>
      </div>
      <section aria-labelledby="cc-compat" className="mt-[clamp(5rem,10vw,9rem)]">
        <SectionHead n="See also" id="cc-compat" aside={product.details.compatibility}>
          Chapters™
        </SectionHead>
        <Link to={to('heirlooms/chapters')} className="btn mt-6 md:ml-[16.66%]">
          <span>See the three chapters</span>
          <span aria-hidden="true">III–V</span>
        </Link>
      </section>
    </article>
  )
}

// the three chapters side by side, like facing pages in a catalogue
export function Chapters() {
  const r = useCollectionProducts('chapters')
  useSeo({ title: 'Chapters', description: house.chaptersLine, concept: CONCEPT })
  return (
    <article className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Plates III–V" sub={house.chaptersLine}>
        Chapters™
      </Title>
      <div className="mt-10 grid gap-6 md:grid-cols-12">
        <p className="display text-[clamp(2rem,4vw,3.2rem)] md:col-span-6 md:col-start-3">{house.chapterLine}</p>
        <p className="text-muted md:col-span-3 md:col-start-10">
          Every chapter hangs from{' '}
          <Link to={to('heirlooms/the-first-huggie')} className="link text-ink">
            The First Huggie™
          </Link>
          , in every size.
        </p>
      </div>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.status === 'ready' && !r.data.length && <p className="display mt-10 text-[2.4rem]">The first chapters will be catalogued here soon.</p>}
      <ol className="mt-14 grid gap-x-6 gap-y-16 md:grid-cols-3">
        {r.data?.map((c, i) => (
          <li key={c.id} id={c.handle} className="scroll-mt-20 border-t border-ink pt-3">
            <p className="caption">Plate {roman[i + 2]}</p>
            <h2 className="display mt-2 text-[clamp(2.6rem,4.4vw,3.8rem)]">{c.shortTitle}</h2>
            <Picture img={c.images[0]!} sizes="(min-width: 768px) 31vw, 92vw" className="mt-4 aspect-[4/5] w-full object-cover" />
            <p className="mt-4 text-[1.05rem] leading-relaxed">{c.details.meaning ?? c.description}</p>
            <Purchase product={c} />
            <Spec product={c} />
          </li>
        ))}
      </ol>
    </article>
  )
}
