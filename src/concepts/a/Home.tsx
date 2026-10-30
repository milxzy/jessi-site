import { Link } from 'react-router-dom'
import type { Product } from '@/shared/commerce'
import { formatDate } from '@/shared/content'
import { images } from '@/shared/data/images'
import { doorways, house, placeholderLetters } from '@/shared/data/house'
import { tapestryConfig } from '@/shared/data/tapestry'
import { useJournal, useProducts } from '@/shared/lib/data'
import { useSeo } from '@/shared/lib/seo'
import { Picture } from '@/shared/lib/Picture'
import { CONCEPT, Heading, Loading, Price, Problem, Signup, Stock, Tapestry, to } from './ui'

function Opening() {
  return (
    <section aria-labelledby="ca-h1" className="px-3 pt-4 sm:px-8 sm:pt-6">
      <div className="paper mx-auto max-w-[90rem] p-3 sm:p-6 lg:p-8">
        <Tapestry priority className="mx-auto aspect-[9/15] w-full sm:aspect-[16/10] sm:w-[min(94vh,100%)]" />
        <div className="grid items-end gap-5 pt-6 pb-2 text-center sm:pt-9 lg:grid-cols-[1fr_auto_1fr] lg:text-left">
          <p className="order-3 text-[0.92rem] text-muted lg:order-none">
            {tapestryConfig.title}, {tapestryConfig.roman}
            <br />
            <span className="text-accent">Placeholder artwork</span>
          </p>
          <div className="text-center">
            <h1 id="ca-h1" className="display text-[clamp(2.9rem,7vw,5.4rem)] leading-[0.92]">
              Jessi Frances
            </h1>
            <p className="mt-3 text-[0.95rem] tracking-[0.2em] text-muted uppercase">{house.descriptor}</p>
          </div>
          <p className="serif text-[clamp(1.15rem,1.8vw,1.4rem)] leading-snug italic lg:justify-self-end lg:text-right">
            {house.signature[0]}
            <br />
            {house.signature[1]}
          </p>
        </div>
      </div>
    </section>
  )
}

// each envelope's stamp is a different corner of the tapestry, so the doorways carry the artwork forward
const envelopeLayout = [
  { tilt: '-1.6deg', cls: 'md:col-span-6 md:row-start-1', stamp: '22% 20%' },
  { tilt: '1.1deg', cls: 'md:col-span-5 md:col-start-8 md:row-start-1 md:mt-24', stamp: '66% 22%' },
  { tilt: '0.7deg', cls: 'md:col-span-5 md:col-start-2 md:row-start-2 md:-mt-4', stamp: '50% 86%' },
  { tilt: '-0.9deg', cls: 'md:col-span-6 md:col-start-7 md:row-start-2 md:mt-16', stamp: '88% 48%' },
]

function Doorways() {
  return (
    <section aria-labelledby="ca-doors" className="px-4 pt-[clamp(6rem,12vw,10rem)] sm:px-8">
      <div className="mx-auto max-w-[80rem]">
        <Heading sub="Choose an envelope, or keep reading and the house will unfold in order.">
          <span id="ca-doors">Where would you like to begin?</span>
        </Heading>
        <ul className="mt-14 grid gap-7 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
          {doorways.map((d, i) => {
            const l = envelopeLayout[i]!
            return (
              <li key={d.key} className={l.cls}>
                <Link to={to(d.path)} className="envelope paper aspect-[7/4] min-h-[11.5rem] w-full p-5 sm:p-7" style={{ ['--tilt' as string]: l.tilt }}>
                  <svg className="envelope-flap" viewBox="0 0 100 46" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points="0,0 50,40 100,0" fill="none" stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-4 h-[4.2rem] w-[3.4rem] border border-line p-[3px] sm:top-6 sm:right-6"
                  >
                    <span className="block h-full w-full" style={{ backgroundImage: `url(${tapestryConfig.desktopSrc})`, backgroundSize: '900% auto', backgroundPosition: l.stamp }} />
                  </span>
                  <span className="absolute right-5 bottom-5 left-5 sm:right-7 sm:bottom-7 sm:left-7">
                    <span className="display block text-[clamp(1.75rem,3.4vw,2.6rem)]">{d.title}</span>
                    <span className="mt-1 block max-w-[24rem] text-[0.98rem] leading-snug text-muted">{d.note}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Frances() {
  const letter = placeholderLetters[0]!
  return (
    <section aria-labelledby="ca-frances" className="px-4 pt-[clamp(7rem,14vw,12rem)] sm:px-8">
      <div className="mx-auto grid max-w-[80rem] gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:pt-10">
          <h2 id="ca-frances" className="display text-[clamp(2.2rem,5vw,3.8rem)]">
            Discover Frances
          </h2>
          <div className="mt-6 max-w-[34rem] space-y-5 text-[1.1rem] leading-[1.7]">
            {house.frances.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <p className="serif mt-8 text-[1.35rem] leading-snug italic">“{house.wearQuote}”</p>
          <Link to={to('house')} className="btn btn-quiet mt-9">
            Read the story of the house
          </Link>
        </div>
        <div className="relative lg:col-span-7 lg:col-start-6">
          <figure className="w-[62%] max-w-[22rem] -rotate-2 bg-surface p-2.5 shadow-[0_18px_40px_-28px_rgba(46,33,25,.5)] sm:p-3">
            <Picture img={images.womanWriting} sizes="(min-width: 1024px) 22rem, 60vw" className="w-full" />
            <figcaption className="mt-2 text-[0.8rem] leading-snug text-muted">The Letter, Mary Cassatt, 1890–91. Placeholder image.</figcaption>
          </figure>
          <article
            aria-label="Placeholder letter"
            className="letter-sheet paper relative -mt-24 ml-auto w-[88%] max-w-[34rem] px-6 py-8 sm:-mt-56 sm:px-10 sm:py-12"
            style={{ ['--tilt' as string]: '1.2deg' }}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="placeholder-stamp">{letter.salutation}</span>
              <span className="typed text-muted">{letter.dateline}</span>
            </div>
            <div className="typed mt-8 space-y-4">
              {letter.body.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <p className="typed mt-8 text-muted">{letter.signoff}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function Heirlooms() {
  const products = useProducts()
  const huggie = products.data?.find((p) => p.handle === 'the-first-huggie')
  const chapters = products.data?.filter((p) => p.productType === 'Chapter') ?? []
  return (
    <section aria-labelledby="ca-heirlooms" className="px-4 pt-[clamp(7rem,14vw,12rem)] sm:px-8">
      <div className="mx-auto max-w-[80rem]">
        <Heading sub={house.destination}>
          <span id="ca-heirlooms">Meet the heirlooms</span>
        </Heading>
        {products.status === 'loading' && <Loading />}
        {products.status === 'error' && <Problem message={products.error} retry={products.retry} />}
        {products.status === 'ready' && (
          <>
            {huggie && (
              <div className="mt-14 grid items-center gap-10 md:grid-cols-12">
                <Link to={to('heirlooms/the-first-huggie')} className="paper block p-3 md:col-span-6" aria-label="The First Huggie">
                  <Picture img={huggie.images[0]!} sizes="(min-width: 768px) 45vw, 92vw" className="aspect-[5/4] w-full object-cover" />
                </Link>
                <div className="md:col-span-5 md:col-start-8">
                  <h3 className="display text-[clamp(2rem,4vw,3rem)]">{huggie.title}</h3>
                  <p className="mt-4 text-[1.1rem] leading-relaxed">{house.huggieLine} Made in more than one size, with an unobtrusive loop for a chapter.</p>
                  <p className="mt-4 text-muted">
                    <Price money={huggie.priceFrom} from /> · <Stock state={huggie.availability} />
                  </p>
                  <Link to={to('heirlooms/the-first-huggie')} className="btn mt-7">
                    Discover The First Huggie
                  </Link>
                </div>
              </div>
            )}
            <div className="mt-[clamp(5rem,9vw,8rem)] grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="display text-[clamp(2rem,4vw,3rem)]">Chapters™</h3>
                <p className="mt-4 text-[1.1rem] leading-relaxed">{house.chaptersLine}</p>
                <p className="serif mt-5 text-[1.3rem] italic">{house.chapterLine}</p>
                <Link to={to('heirlooms/chapters')} className="btn btn-quiet mt-7">
                  Read the chapters
                </Link>
              </div>
              <ul className="grid grid-cols-3 gap-3 sm:gap-6 md:col-span-8">
                {chapters.map((c: Product, i) => (
                  <li key={c.id} className={i === 1 ? 'mt-10' : i === 2 ? 'mt-20' : ''}>
                    <Link to={to(`heirlooms/chapters?chapter=${c.handle}`)} className="group block">
                      <span className="paper block p-1.5 sm:p-2.5">
                        <Picture img={c.images[0]!} sizes="(min-width: 768px) 20vw, 30vw" className="aspect-[4/5] w-full object-cover" />
                      </span>
                      <span className="serif mt-3 block text-[clamp(1rem,1.8vw,1.3rem)] leading-tight group-hover:italic">{c.shortTitle}</span>
                      <span className="mt-0.5 block text-[0.88rem] text-muted">
                        <Stock state={c.availability} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Journal() {
  const j = useJournal()
  const [first, ...rest] = j.data ?? []
  return (
    <section aria-labelledby="ca-journal" className="px-4 pt-[clamp(7rem,14vw,12rem)] sm:px-8">
      <div className="mx-auto max-w-[80rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading sub={house.journalLine}>
            <span id="ca-journal">The Frances Journal</span>
          </Heading>
          <Link to={to('journal')} className="link">
            Read every entry
          </Link>
        </div>
        {j.status === 'loading' && <Loading />}
        {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
        {first && (
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <Link to={to(`journal/${first.handle}`)} className="group paper grid gap-6 p-4 sm:grid-cols-2 sm:p-6 lg:col-span-8">
              {first.image && <Picture img={first.image} sizes="(min-width: 1024px) 30vw, 90vw" className="aspect-[4/5] w-full object-cover" />}
              <span className="flex flex-col">
                <span className="typed text-muted">{formatDate(first.publishedAt)}</span>
                <span className="display mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)] group-hover:italic">{first.title}</span>
                <span className="mt-4 text-[1.05rem] leading-relaxed">{first.excerpt}</span>
              </span>
            </Link>
            <ol className="divide-y divide-line border-y border-line lg:col-span-4">
              {rest.slice(0, 3).map((e) => (
                <li key={e.id}>
                  <Link to={to(`journal/${e.handle}`)} className="group block py-5">
                    <span className="typed block text-[0.9rem] text-muted">{formatDate(e.publishedAt)}</span>
                    <span className="serif mt-1 block text-[1.5rem] leading-tight group-hover:italic">{e.title}</span>
                    <span className="mt-1 block text-[0.98rem] text-muted">{e.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}

function Join() {
  return (
    <section aria-labelledby="ca-join" className="px-4 pt-[clamp(7rem,14vw,12rem)] pb-[clamp(6rem,12vw,10rem)] sm:px-8">
      <div className="paper mx-auto grid max-w-[64rem] gap-10 p-7 sm:p-12 md:grid-cols-[1fr_1.1fr]" style={{ transform: 'rotate(-0.4deg)' }}>
        <div>
          <h2 id="ca-join" className="display text-[clamp(2.2rem,5vw,3.6rem)]">
            Join the house
          </h2>
          <p className="serif mt-4 text-[1.25rem] leading-snug italic">{house.philosophy.quote}</p>
        </div>
        <div className="md:pt-3">
          <p className="mb-6 text-[1.05rem] leading-relaxed">Be the first to see the 2027 House Tapestry on November 8, and to hear when the first collection opens for preorder.</p>
          <Signup id="ca-join-email" />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useSeo({ title: 'The House of Becoming', description: house.intro, concept: CONCEPT })
  return (
    <>
      <Opening />
      <Doorways />
      <Frances />
      <Heirlooms />
      <Journal />
      <Join />
    </>
  )
}
