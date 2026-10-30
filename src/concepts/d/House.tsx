import { Link } from 'react-router-dom'
import { forthcoming } from '@/shared/data/catalog'
import { house, placeholderLetters } from '@/shared/data/house'
import { images } from '@/shared/data/images'
import { usePage } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Head, Loading, Problem, to } from './ui'

// a small keyhole between chapters of the story: the motif used once more, quietly
function Keyhole() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 30" className="mx-auto my-[clamp(3.5rem,8vw,6rem)] h-7 w-5 text-accent">
      <path d="M10 1a7 7 0 0 1 4 12.7L17 29H3l3-15.3A7 7 0 0 1 10 1Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export default function House() {
  useSeo({ title: 'The House', description: house.intro, concept: CONCEPT })
  const founder = usePage('the-house')
  return (
    <article className="px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <div className="mx-auto max-w-[40rem]">
        <Head as="h1" sub={house.descriptor}>
          The House
        </Head>
        <figure className="mx-auto mt-10 w-[min(80vw,24rem)]">
          <Picture img={images.sisters} priority sizes="24rem" className="arch w-full" />
          <figcaption className="mt-3 text-center text-[0.85rem] text-muted">Two Sisters (On the Terrace), Renoir, 1881. Placeholder image.</figcaption>
        </figure>
        <p className="serif mt-10 text-center text-[clamp(1.35rem,4vw,1.7rem)] leading-[1.4]">{house.intro}</p>
        <p className="mt-6 text-center text-muted">{house.ambition}</p>

        <Keyhole />

        <section aria-labelledby="cd-founder">
          <h2 id="cd-founder" className="display text-center text-[clamp(2rem,5.4vw,3rem)]">
            The founder’s story
          </h2>
          <div className="mt-6 rounded-[1.5rem] bg-surface p-6 text-[1.05rem] leading-relaxed sm:p-8">
            {founder.status === 'loading' && <Loading />}
            {founder.status === 'error' && <Problem message={founder.error} retry={founder.retry} />}
            {founder.data && <div className="page-body" dangerouslySetInnerHTML={{ __html: founder.data.bodyHtml }} />}
          </div>
        </section>

        <Keyhole />

        <section aria-labelledby="cd-frances">
          <h2 id="cd-frances" className="display text-center text-[clamp(2rem,5.4vw,3rem)]">
            {house.frances.heading}
          </h2>
          <div className="mt-6 space-y-4 text-[1.08rem] leading-relaxed">
            {house.frances.paragraphs.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
          <blockquote className="serif mt-8 rounded-[1.5rem] bg-surface px-6 py-8 text-center text-[1.45rem] leading-snug italic">“{house.wearQuote}”</blockquote>
          <div className="mt-10 space-y-5">
            {placeholderLetters.map((l, i) => (
              <article key={l.id} aria-label={`Placeholder letter ${i + 1}`} className="rounded-[1rem] bg-[#fffdf9] p-6 shadow-[0_1px_2px_rgba(59,42,32,.08),0_14px_30px_-20px_rgba(59,42,32,.4)] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="pill bg-opal px-3 py-1 text-[0.82rem]">{l.salutation}</p>
                  <p className="typed text-muted">{l.dateline}</p>
                </div>
                <div className="typed mt-5 space-y-3">
                  {l.body.map((p) => (
                    <p key={p.slice(0, 16)}>{p}</p>
                  ))}
                </div>
                <p className="typed mt-5 text-muted">{l.signoff}</p>
              </article>
            ))}
          </div>
        </section>

        <Keyhole />

        <section aria-labelledby="cd-becoming" className="text-center">
          <h2 id="cd-becoming" className="display text-[clamp(2rem,5.4vw,3rem)]">
            {house.philosophy.heading}
          </h2>
          <ul className="mt-8 space-y-3">
            {house.philosophy.triad.map((t, i) => (
              <li key={t} className={`rounded-[999px] px-6 py-5 ${['bg-surface', 'bg-camel text-camel-ink', 'bg-field text-field-ink'][i]}`}>
                <span className="display text-[clamp(1.5rem,4.4vw,2.1rem)]">{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[1.05rem] leading-relaxed text-muted">{house.philosophy.paragraphs[0]}</p>
        </section>

        <Keyhole />

        <section aria-labelledby="cd-values">
          <h2 id="cd-values" className="display text-center text-[clamp(2rem,5.4vw,3rem)]">
            How the house should feel
          </h2>
          <div className="mt-8 space-y-2">
            {house.values.map((v) => (
              <details key={v.title} className="rounded-[1.25rem] bg-surface px-5">
                <summary className="flex min-h-[56px] items-center justify-between gap-4">
                  <span className="serif text-[1.25rem]">{v.title}</span>
                  <svg aria-hidden="true" viewBox="0 0 12 8" className="chev h-2 w-3 shrink-0">
                    <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </summary>
                <p className="pb-5 text-muted">{v.note}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="cd-north" className="mt-[clamp(4rem,9vw,7rem)] rounded-[2.5rem] bg-field px-6 py-12 text-center text-field-ink sm:px-10">
          <h2 id="cd-north" className="serif text-[1.15rem] italic">
            The North Star
          </h2>
          <p className="display mt-5 text-[clamp(1.6rem,4.6vw,2.3rem)] leading-[1.25]">{house.northStar}</p>
        </section>

        <section aria-labelledby="cd-forth" className="mt-14 text-center">
          <h2 id="cd-forth" className="display text-[1.8rem]">
            Quietly in the workshop
          </h2>
          <ul className="mt-6 space-y-5">
            {forthcoming.map((f) => (
              <li key={f.name}>
                <p className="serif text-[1.3rem]">{f.name}</p>
                <p className="mt-1 text-[0.98rem] text-muted">{f.note}</p>
              </li>
            ))}
          </ul>
          <Link to={to('heirlooms')} className="btn mt-10">
            Meet the heirlooms
          </Link>
        </section>
      </div>
    </article>
  )
}
