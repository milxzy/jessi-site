import { Link } from 'react-router-dom'
import { forthcoming } from '@/shared/data/catalog'
import { house, placeholderLetters } from '@/shared/data/house'
import { images } from '@/shared/data/images'
import { usePage } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Loading, Problem, roman, Title, to } from './ui'

const sections = [
  { id: 'founder', title: 'The founder' },
  { id: 'frances', title: 'Frances' },
  { id: 'becoming', title: 'Becoming' },
  { id: 'values', title: 'Values' },
  { id: 'north-star', title: 'The North Star' },
  { id: 'forthcoming', title: 'In development' },
]

export default function House() {
  useSeo({ title: 'The House', description: house.intro, concept: CONCEPT })
  const founder = usePage('the-house')
  return (
    <article className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Section I" sub={house.descriptor}>
        The House
      </Title>
      <p className="display mt-14 max-w-[64rem] text-[clamp(2rem,4.2vw,3.6rem)] leading-[1] md:ml-[16.66%]">{house.intro}</p>

      <div className="mt-[clamp(5rem,9vw,8rem)] grid gap-10 md:grid-cols-12">
        <nav aria-label="On this page" className="md:col-span-2">
          <ol className="caption md:sticky md:top-20 md:space-y-1">
            {sections.map((s, i) => (
              <li key={s.id} className="inline md:block">
                <a href={`#${s.id}`} className="link mr-3 inline-flex min-h-[32px] items-center md:mr-0">
                  {roman[i]}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-[clamp(5rem,9vw,8rem)] md:col-span-10">
          <section id="founder" aria-labelledby="cc-h-founder" className="rule scroll-mt-20 grid gap-6 pt-3 lg:grid-cols-10">
            <h2 id="cc-h-founder" className="display text-[clamp(2.4rem,4.6vw,4rem)] lg:col-span-4">
              The founder
            </h2>
            <div className="text-[1.1rem] leading-[1.7] lg:col-span-6">
              <p className="caption mb-3">{house.ambition}</p>
              {founder.status === 'loading' && <Loading />}
              {founder.status === 'error' && <Problem message={founder.error} retry={founder.retry} />}
              {founder.data && <div className="page-body" dangerouslySetInnerHTML={{ __html: founder.data.bodyHtml }} />}
            </div>
          </section>

          <section id="frances" aria-labelledby="cc-h-frances" className="rule scroll-mt-20 pt-3">
            <div className="grid gap-6 lg:grid-cols-10">
              <h2 id="cc-h-frances" className="display text-[clamp(2.4rem,4.6vw,4rem)] lg:col-span-4">
                {house.frances.heading}
              </h2>
              <div className="space-y-5 text-[1.1rem] leading-[1.7] lg:col-span-6">
                {house.frances.paragraphs.map((p) => (
                  <p key={p.slice(0, 16)}>{p}</p>
                ))}
                <p className="display text-[1.9rem] leading-[1.05] italic">“{house.wearQuote}”</p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-10">
              <figure className="lg:col-span-3">
                <Picture img={images.readingLetter} sizes="(min-width: 1024px) 24vw, 92vw" className="w-full" />
                <figcaption className="caption mt-2 border-t border-line pt-1.5 text-muted">Fig. 2. Reading a Letter, Furuyama Moroshige, c. 1688. Placeholder image.</figcaption>
              </figure>
              {placeholderLetters.map((l, i) => (
                <article key={l.id} aria-label={`Placeholder letter ${i + 1}`} className="plate p-6 lg:col-span-3 lg:even:mt-16 lg:odd:col-start-5 lg:even:col-start-8">
                  <div className="caption flex justify-between border-b border-ink pb-2">
                    <span className="font-semibold">Document {i + 1}</span>
                    <span className="text-muted">{l.dateline}</span>
                  </div>
                  <p className="caption mt-3 text-accent">{l.salutation}</p>
                  <div className="typed mt-3 space-y-3">
                    {l.body.map((p) => (
                      <p key={p.slice(0, 16)}>{p}</p>
                    ))}
                  </div>
                  <p className="typed mt-4 text-muted">{l.signoff}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="becoming" aria-labelledby="cc-h-becoming" className="rule scroll-mt-20 pt-3">
            <h2 id="cc-h-becoming" className="display text-[clamp(2.4rem,4.6vw,4rem)]">
              {house.philosophy.heading}
            </h2>
            <ol className="mt-8">
              {house.philosophy.triad.map((t, i) => (
                <li key={t} className="rule-soft grid grid-cols-[3rem_1fr] items-baseline py-3">
                  <span className="caption">{i + 1}.</span>
                  <span className="display text-[clamp(2.2rem,6vw,5.4rem)]">{t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 grid gap-6 lg:grid-cols-10">
              <p className="text-[1.08rem] leading-[1.7] lg:col-span-5 lg:col-start-5">{house.philosophy.paragraphs[0]}</p>
            </div>
          </section>

          <section id="values" aria-labelledby="cc-h-values" className="rule scroll-mt-20 pt-3">
            <h2 id="cc-h-values" className="display text-[clamp(2.4rem,4.6vw,4rem)]">
              What the house must always feel like
            </h2>
            <table className="mt-8 w-full border-collapse text-left">
              <caption className="sr-only">The five values of the house</caption>
              <tbody>
                {house.values.map((v, i) => (
                  <tr key={v.title} className="border-t border-line align-baseline">
                    <th scope="row" className="caption w-10 py-4 pr-3 font-normal">
                      {roman[i]}
                    </th>
                    <td className="display py-4 pr-6 text-[clamp(1.5rem,2.6vw,2.2rem)]">{v.title}</td>
                    <td className="hidden py-4 text-muted sm:table-cell">{v.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section id="north-star" aria-labelledby="cc-h-north" className="scroll-mt-20 bg-field px-6 py-12 text-field-ink sm:px-12 sm:py-16">
            <h2 id="cc-h-north" className="caption font-semibold">
              The North Star
            </h2>
            <p className="display mt-6 max-w-[60rem] text-[clamp(2rem,4.4vw,3.8rem)] leading-[1]">{house.northStar}</p>
          </section>

          <section id="forthcoming" aria-labelledby="cc-h-forth" className="rule scroll-mt-20 grid gap-6 pt-3 lg:grid-cols-10">
            <h2 id="cc-h-forth" className="display text-[clamp(2rem,3.6vw,3rem)] lg:col-span-4">
              In development
            </h2>
            <dl className="lg:col-span-6">
              {forthcoming.map((f) => (
                <div key={f.name} className="rule-soft grid gap-1 py-3 sm:grid-cols-[14rem_1fr]">
                  <dt>{f.name}</dt>
                  <dd className="caption text-muted">{f.note} Not for sale.</dd>
                </div>
              ))}
            </dl>
          </section>

          <Link to={to('heirlooms')} className="btn">
            <span>Continue to the catalogue</span>
            <span aria-hidden="true">II</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
