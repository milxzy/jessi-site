import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '@/shared/content'
import { doorways, house, placeholderLetters } from '@/shared/data/house'
import { tapestryConfig } from '@/shared/data/tapestry'
import { useJournal, useProducts } from '@/shared/lib/data'
import { useInView } from '@/shared/lib/motion'
import { Picture } from '@/shared/lib/Picture'
import { useSeo } from '@/shared/lib/seo'
import { ChapterHead, CONCEPT, crop, Loading, Price, Problem, roman, Signup, Stage, Stock, to } from './ui'

function Opening() {
  return (
    <section aria-labelledby="cb-h1" className="relative">
      <Stage priority zoom={1.14} origin="50% 30%" className="h-[100svh] min-h-[36rem]">
        <div className="scrim-b absolute inset-x-0 bottom-0 h-[55%]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-[max(4.5rem,9vh)] text-center sm:px-10">
          <h1 id="cb-h1" className="display fade-in text-[clamp(3.2rem,11vw,9.5rem)] leading-[0.9] [animation-delay:700ms]">
            Jessi Frances
          </h1>
          <p className="fade-in mt-5 text-[clamp(1.05rem,1.8vw,1.35rem)] [animation-delay:900ms]">{house.signatureLine}</p>
          <p className="caps fade-in mt-6 text-muted [animation-delay:1000ms]">
            {tapestryConfig.title}, {tapestryConfig.roman}. Placeholder artwork.
          </p>
        </div>
      </Stage>
    </section>
  )
}

// each doorway brings its own detail of the tapestry forward behind the words
const stills = ['50% 72%', '68% 24%', '22% 16%', '50% 92%']

function Doorways() {
  const [on, setOn] = useState(0)
  return (
    <section aria-labelledby="cb-doors" className="relative overflow-hidden py-[clamp(7rem,16vw,13rem)]">
      {stills.map((s, i) => (
        <div key={s} aria-hidden="true" className={`door-still ${on === i ? 'is-on' : ''}`} style={crop(s, 3.4)} />
      ))}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(28,20,16,.55),rgba(28,20,16,.92))]" />
      <div className="relative px-5 text-center sm:px-10">
        <h2 id="cb-doors" className="caps text-muted">
          Enter the house
        </h2>
        <ul className="mt-12 space-y-3 sm:space-y-5">
          {doorways.map((d, i) => (
            <li key={d.key}>
              <Link to={to(d.path)} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} className="door-link group inline-block">
                <span className="caps block text-accent">{roman[i]}</span>
                <span className="display mt-1 block text-[clamp(2.3rem,7.4vw,6rem)] leading-[1.02]">{d.title}</span>
                <span className="mx-auto mt-2 block max-w-[30rem] text-[0.98rem] text-muted opacity-80 transition-opacity duration-500 group-hover:opacity-100">{d.note}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-14 text-[0.95rem] text-muted">Or keep scrolling. The house unfolds in order.</p>
      </div>
    </section>
  )
}

function Frances() {
  const [ref, seen] = useInView<HTMLDivElement>()
  const letter = placeholderLetters[0]!
  return (
    <section aria-labelledby="cb-frances" className="px-5 py-[clamp(6rem,12vw,10rem)] sm:px-10">
      <ChapterHead n="Chapter I" id="cb-frances">
        Discover Frances
      </ChapterHead>
      <blockquote className="display mx-auto mt-14 max-w-[52rem] text-center text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.2]">“{house.wearQuote}”</blockquote>
      <div ref={ref} className="mx-auto mt-20 grid max-w-[72rem] items-start gap-14 lg:grid-cols-2">
        <div className="space-y-6 text-[1.1rem] leading-[1.8] lg:pt-8">
          {house.frances.paragraphs.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
          <Link to={to('house')} className="btn mt-4">
            The story of the house
          </Link>
        </div>
        <article aria-label="Placeholder letter" className={`lit px-7 py-10 transition-[opacity,transform] duration-1000 sm:px-11 ${seen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'}`}>
          <p className="caps text-[#7a5b2a]">{letter.salutation}</p>
          <div className="typed mt-6 space-y-4 text-[1.05rem]">
            {letter.body.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
          <p className="typed mt-8 text-field-muted">{letter.signoff}</p>
        </article>
      </div>
    </section>
  )
}

function Band({ position, zoom = 2.4 }: { position: string; zoom?: number }) {
  return <div aria-hidden="true" className="band h-[22vh] min-h-[9rem] opacity-80" style={crop(position, zoom)} />
}

function Heirlooms() {
  const r = useProducts()
  const huggie = r.data?.find((p) => p.handle === 'the-first-huggie')
  const chapters = r.data?.filter((p) => p.productType === 'Chapter') ?? []
  return (
    <section aria-labelledby="cb-heirlooms" className="px-5 py-[clamp(6rem,12vw,10rem)] sm:px-10">
      <ChapterHead n="Chapter II" id="cb-heirlooms" sub={house.chaptersLine}>
        Meet the heirlooms
      </ChapterHead>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {huggie && (
        <div className="mx-auto mt-20 grid max-w-[80rem] items-center gap-10 lg:grid-cols-12">
          <Link to={to('heirlooms/the-first-huggie')} className="block lg:col-span-7" aria-label={huggie.title}>
            <Picture img={huggie.images[0]!} sizes="(min-width: 1024px) 56vw, 92vw" className="aspect-[5/4] w-full object-cover" />
          </Link>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="caps text-accent">The foundation</p>
            <h3 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">{huggie.title}</h3>
            <p className="mt-5 text-[1.08rem] leading-relaxed">{house.huggieLine}</p>
            <p className="mt-5 flex items-baseline gap-4">
              <Price money={huggie.priceFrom} from />
              <Stock state={huggie.availability} />
            </p>
            <Link to={to('heirlooms/the-first-huggie')} className="btn mt-8">
              Discover
            </Link>
          </div>
        </div>
      )}
      {chapters.length > 0 && (
        <div className="mx-auto mt-[clamp(5rem,10vw,9rem)] max-w-[80rem]">
          <p className="display text-center text-[clamp(1.6rem,3vw,2.3rem)]">{house.chapterLine}</p>
          {/* a triptych: the three chapters edge to edge, one still */}
          <ul className="mt-10 grid grid-cols-3">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <Link to={to(`heirlooms/chapters?chapter=${c.handle}`)} className="group block text-center">
                  <span className="block overflow-hidden">
                    <Picture img={c.images[0]!} sizes="33vw" className="aspect-[3/5] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]" />
                  </span>
                  <span className="caps mt-5 block text-accent">{roman[i]}</span>
                  <span className="display mt-2 block text-[clamp(1.15rem,2.4vw,1.9rem)] leading-tight">{c.shortTitle}</span>
                  <span className="mt-1 block">
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
  const [first, ...rest] = j.data ?? []
  return (
    <section aria-labelledby="cb-journal" className="py-[clamp(6rem,12vw,10rem)]">
      <div className="px-5 sm:px-10">
        <ChapterHead n="Chapter III" id="cb-journal" sub={house.journalLine}>
          The Frances Journal
        </ChapterHead>
      </div>
      {j.status === 'loading' && <Loading />}
      {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
      {first && (
        <Link to={to(`journal/${first.handle}`)} className="group relative mt-16 block h-[78vh] min-h-[28rem] overflow-hidden">
          {first.image && <Picture img={first.image} sizes="100vw" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]" />}
          <span aria-hidden="true" className="scrim-b absolute inset-0" />
          <span className="absolute inset-x-0 bottom-0 px-5 pb-14 text-center sm:px-10">
            <span className="caps block text-muted">{formatDate(first.publishedAt)}</span>
            <span className="display mt-4 block text-[clamp(2.4rem,7vw,5.6rem)]">{first.title}</span>
            <span className="mx-auto mt-4 block max-w-[34rem] text-[1.05rem]">{first.excerpt}</span>
          </span>
        </Link>
      )}
      {rest.length > 0 && (
        <ul className="mx-auto mt-14 grid max-w-[72rem] gap-10 px-5 sm:grid-cols-2 sm:px-10">
          {rest.slice(0, 2).map((e) => (
            <li key={e.id} className="text-center">
              <Link to={to(`journal/${e.handle}`)} className="group block">
                <span className="caps block text-muted">{formatDate(e.publishedAt)}</span>
                <span className="display mt-3 block text-[clamp(1.7rem,3vw,2.4rem)] transition-colors duration-500 group-hover:text-accent">{e.title}</span>
                <span className="mt-2 block text-muted">{e.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-14 text-center">
        <Link to={to('journal')} className="btn">
          The whole Journal
        </Link>
      </p>
    </section>
  )
}

function Join() {
  return (
    <section aria-labelledby="cb-join" className="lit px-5 py-[clamp(6rem,12vw,9rem)] text-center sm:px-10">
      <p className="caps text-[#7a5b2a]" aria-hidden="true">
        Chapter IV
      </p>
      <h2 id="cb-join" className="display mt-4 text-[clamp(2.6rem,7vw,5rem)]">
        Join the house
      </h2>
      <p className="mx-auto mt-6 max-w-[36rem] text-[1.08rem] leading-relaxed">See the 2027 House Tapestry first on November 8, and hear when the first collection opens for preorder.</p>
      <div className="mt-10">
        <Signup id="cb-join-email" lit />
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
      <Band position="50% 88%" />
      <Heirlooms />
      <Band position="18% 40%" zoom={2} />
      <Journal />
      <Join />
    </>
  )
}
