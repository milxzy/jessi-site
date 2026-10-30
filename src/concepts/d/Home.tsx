import { Link } from 'react-router-dom'
import type { Img } from '@/shared/commerce'
import { formatDate } from '@/shared/content'
import { doorways, house, placeholderLetters } from '@/shared/data/house'
import { images } from '@/shared/data/images'
import { tapestryConfig } from '@/shared/data/tapestry'
import { useJournal, useProducts } from '@/shared/lib/data'
import { useReducedMotion } from '@/shared/lib/motion'
import { Picture } from '@/shared/lib/Picture'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Head, Loading, Price, Problem, Signup, Stock, to } from './ui'

function Opening() {
  const t = tapestryConfig
  const reduced = useReducedMotion()
  return (
    <section aria-labelledby="cd-h1" className="mx-auto max-w-[80rem] px-5 pt-4 pb-8 sm:px-8 md:grid md:min-h-[calc(100svh-4rem)] md:grid-cols-[1fr_1fr] md:items-center md:gap-12">
      <div className="keyhole mx-auto aspect-[3/5] w-[min(78vw,24rem)] overflow-hidden bg-[#2a1d15] md:h-[min(80svh,44rem)] md:w-auto">
        {/* the portrait composition suits the keyhole at every width */}
        <img src={t.mobileSrc} alt={t.alt} width={t.mobileWidth} height={t.mobileHeight} {...{ fetchpriority: 'high' }} className={`h-full w-full object-cover ${reduced ? '' : 'opening-art'}`} style={{ objectPosition: '50% 38%' }} />
      </div>
      <div className="mt-8 text-center md:mt-0 md:text-left">
        <h1 id="cd-h1" className="display rise text-[clamp(3rem,12vw,6.4rem)] [animation-delay:300ms]">
          Jessi Frances
        </h1>
        <p className="serif rise mt-3 text-[clamp(1.3rem,4.4vw,1.8rem)] leading-snug italic [animation-delay:450ms]">
          {house.signature[0]}
          <br />
          {house.signature[1]}
        </p>
        <p className="rise mt-6 text-[0.95rem] text-muted [animation-delay:600ms]">
          {t.title}, {t.roman}, seen through the keyhole. <span className="whitespace-nowrap">Placeholder artwork.</span>
        </p>
      </div>
    </section>
  )
}

const doorImages: (Img | null)[] = [images.sisters, images.huggie, images.womanWriting, null]

function Doorways() {
  return (
    <section aria-labelledby="cd-doors" className="mx-auto max-w-[80rem] px-5 pt-[clamp(4rem,10vw,8rem)] sm:px-8">
      <Head id="cd-doors" sub="Step into any room. Or stay a while and scroll.">
        Where shall we begin?
      </Head>
      <ul className="doors mt-10">
        {doorways.map((d, i) => {
          const img = doorImages[i]
          return (
            <li key={d.key} className="door">
              <Link to={to(d.path)} className="arch group relative flex h-[22rem] flex-col justify-end bg-field text-field-ink md:h-full">
                {img ? (
                  <Picture img={img} sizes="(min-width: 900px) 40vw, 92vw" alt="" className="door-img absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="door-img absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${tapestryConfig.mobileSrc})` }} />
                )}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(59,42,32,.9),rgba(59,42,32,.15)_60%,transparent)]" />
                <span className="relative block p-6 md:p-7">
                  <span className="display block text-[clamp(1.8rem,3vw,2.4rem)]">{d.title}</span>
                  <span className="door-note mt-1 block max-w-[22rem] text-[0.98rem] text-field-ink/90">{d.note}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Frances() {
  const l = placeholderLetters[0]!
  return (
    <section aria-labelledby="cd-frances" className="mt-[clamp(5rem,12vw,9rem)] bg-field px-5 py-[clamp(4.5rem,10vw,8rem)] text-field-ink sm:px-8">
      <div className="mx-auto grid max-w-[72rem] items-center gap-12 md:grid-cols-2">
        <figure className="mx-auto w-[min(72vw,22rem)]">
          <Picture img={images.womanWriting} sizes="22rem" className="arch w-full" />
          <figcaption className="mt-3 text-center text-[0.85rem] text-field-ink/80">The Letter, Mary Cassatt, 1890–91. Placeholder image.</figcaption>
        </figure>
        <div>
          <h2 id="cd-frances" className="display text-center text-[clamp(2.2rem,6vw,3.6rem)] md:text-left">
            Discover Frances
          </h2>
          <div className="mt-6 space-y-4 text-[1.08rem] leading-relaxed">
            {house.frances.paragraphs.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
          <article aria-label="Placeholder letter" className="mt-8 rounded-[1rem] bg-ground p-6 text-ink">
            <p className="pill inline-block bg-opal px-3 py-1 text-[0.82rem]">{l.salutation}</p>
            <div className="typed mt-4 space-y-3">
              {l.body.slice(0, 2).map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
          </article>
          <div className="mt-8 text-center md:text-left">
            <Link to={to('house')} className="btn bg-camel text-camel-ink hover:!bg-field-ink">
              The story of the house
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Heirlooms() {
  const r = useProducts()
  const huggie = r.data?.find((p) => p.handle === 'the-first-huggie')
  const chapters = r.data?.filter((p) => p.productType === 'Chapter') ?? []
  return (
    <section aria-labelledby="cd-heir" className="pt-[clamp(5rem,12vw,9rem)]">
      <div className="px-5 sm:px-8">
        <Head id="cd-heir" sub={house.chapterLine}>
          Meet the heirlooms
        </Head>
      </div>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {huggie && (
        <div className="mx-auto mt-10 grid max-w-[72rem] items-center gap-8 px-5 sm:px-8 md:grid-cols-2">
          <Link to={to('heirlooms/the-first-huggie')} aria-label={huggie.title} className="arch mx-auto block w-[min(84vw,26rem)]">
            <Picture img={huggie.images[0]!} sizes="26rem" className="aspect-[4/5] w-full object-cover" />
          </Link>
          <div className="text-center md:text-left">
            <h3 className="display text-[clamp(2rem,5vw,3rem)]">{huggie.title}</h3>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">{house.huggieLine}</p>
            <p className="mt-4 flex items-center justify-center gap-3 md:justify-start">
              <Price money={huggie.priceFrom} from />
              <Stock state={huggie.availability} />
            </p>
            <Link to={to('heirlooms/the-first-huggie')} className="btn mt-6">
              Find your size
            </Link>
          </div>
        </div>
      )}
      {chapters.length > 0 && (
        <div className="mt-16">
          <h3 className="display px-5 text-center text-[clamp(1.8rem,4.6vw,2.6rem)]">Chapters™</h3>
          <p className="mx-auto mt-2 max-w-[28rem] px-5 text-center text-muted">{house.chaptersLine}</p>
          <ul className="snap-row mt-8 flex gap-4 overflow-x-auto px-5 pb-4 sm:px-8 md:mx-auto md:max-w-[72rem] md:justify-center md:overflow-visible">
            {chapters.map((c) => (
              <li key={c.id} className="w-[68vw] max-w-[17rem] shrink-0 md:w-auto md:flex-1">
                <Link to={to(`heirlooms/chapters#${c.handle}`)} className="group block text-center">
                  <span className="arch block">
                    <Picture img={c.images[0]!} sizes="17rem" className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
                  </span>
                  <span className="display mt-3 block text-[1.45rem]">{c.shortTitle}</span>
                  <span className="mt-1 inline-block">
                    <Stock state={c.availability} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Journal() {
  const j = useJournal()
  return (
    <section aria-labelledby="cd-journal" className="mx-auto max-w-[56rem] px-5 pt-[clamp(5rem,12vw,9rem)] sm:px-8">
      <Head id="cd-journal" sub={house.journalLine}>
        The Frances Journal
      </Head>
      {j.status === 'loading' && <Loading />}
      {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
      <ul className="mt-10 space-y-3">
        {j.data?.slice(0, 3).map((e) => (
          <li key={e.id}>
            <Link to={to(`journal/${e.handle}`)} className="group flex items-center gap-5 rounded-[1.5rem] p-3 transition-colors duration-500 hover:bg-surface">
              {e.image && <Picture img={e.image} sizes="6rem" alt="" className="arch aspect-[4/5] w-20 shrink-0 object-cover sm:w-24" />}
              <span>
                <span className="block text-[0.9rem] text-muted">{formatDate(e.publishedAt)}</span>
                <span className="display mt-1 block text-[clamp(1.4rem,4vw,1.9rem)]">{e.title}</span>
                <span className="mt-1 block text-[0.98rem] text-muted">{e.excerpt}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center">
        <Link to={to('journal')} className="btn btn-soft">
          Every entry
        </Link>
      </p>
    </section>
  )
}

function Join() {
  return (
    <section aria-labelledby="cd-join" className="px-5 py-[clamp(5rem,12vw,9rem)] sm:px-8">
      <div className="mx-auto max-w-[44rem] rounded-[2.5rem] bg-opal px-6 py-14 text-center sm:px-12">
        <h2 id="cd-join" className="display text-[clamp(2.2rem,6vw,3.4rem)]">
          Join the house
        </h2>
        <p className="serif mx-auto mt-3 max-w-[28rem] text-[1.25rem] leading-snug italic">{house.philosophy.quote}</p>
        <p className="mx-auto mt-5 max-w-[28rem] text-muted">See the 2027 House Tapestry first on November 8, and hear when the first collection opens.</p>
        <div className="mt-8">
          <Signup id="cd-join-email" />
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
