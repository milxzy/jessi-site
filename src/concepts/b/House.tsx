import { Link } from 'react-router-dom'
import { forthcoming } from '@/shared/data/catalog'
import { house, placeholderLetters } from '@/shared/data/house'
import { usePage } from '@/shared/lib/data'
import { useSeo } from '@/shared/lib/seo'
import { ChapterHead, CONCEPT, crop, Loading, Problem, Stage, to } from './ui'

const Band = ({ at }: { at: string }) => <div aria-hidden="true" className="band h-[18vh] min-h-[8rem] opacity-75" style={crop(at, 2.6)} />

export default function House() {
  useSeo({ title: 'The House', description: house.intro, concept: CONCEPT })
  const founder = usePage('the-house')
  return (
    <article>
      <Stage zoom={1.6} origin="50% 75%" drift className="h-[78svh] min-h-[30rem]">
        <div aria-hidden="true" className="scrim-b absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-16 sm:px-10">
          <ChapterHead as="h1">The House</ChapterHead>
        </div>
      </Stage>

      <section aria-label="Introduction" className="px-5 py-[clamp(5rem,10vw,9rem)] sm:px-10">
        <p className="display mx-auto max-w-[56rem] text-center text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.25]">{house.intro}</p>
        <p className="mx-auto mt-10 max-w-[38rem] text-center text-[1.08rem] leading-[1.8] text-muted">{house.ambition}</p>
      </section>

      <Band at="50% 70%" />

      <section aria-labelledby="cb-founder" className="px-5 py-[clamp(5rem,10vw,9rem)] sm:px-10">
        <ChapterHead n="I" id="cb-founder">
          The founder
        </ChapterHead>
        <div className="mx-auto mt-12 max-w-[40rem] text-[1.1rem] leading-[1.8]">
          {founder.status === 'loading' && <Loading />}
          {founder.status === 'error' && <Problem message={founder.error} retry={founder.retry} />}
          {founder.data && <div className="page-body" dangerouslySetInnerHTML={{ __html: founder.data.bodyHtml }} />}
        </div>
      </section>

      <section aria-labelledby="cb-frances" className="px-5 pb-[clamp(5rem,10vw,9rem)] sm:px-10">
        <ChapterHead n="II" id="cb-frances">
          {house.frances.heading}
        </ChapterHead>
        <div className="mx-auto mt-12 max-w-[40rem] space-y-6 text-[1.1rem] leading-[1.8]">
          {house.frances.paragraphs.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
        </div>
        <div className="mx-auto mt-16 grid max-w-[64rem] gap-6 md:grid-cols-2">
          {placeholderLetters.map((l) => (
            <article key={l.id} aria-label={l.salutation} className="lit px-7 py-10 sm:px-10">
              <div className="flex justify-between gap-4">
                <p className="caps text-[#7a5b2a]">{l.salutation}</p>
                <p className="typed text-[0.95rem] text-field-muted">{l.dateline}</p>
              </div>
              <div className="typed mt-6 space-y-4">
                {l.body.map((p) => (
                  <p key={p.slice(0, 16)}>{p}</p>
                ))}
              </div>
              <p className="typed mt-6 text-field-muted">{l.signoff}</p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-[40rem] text-center text-[0.92rem] text-muted">These sheets hold places for Frances’s own typewritten letters. Nothing on them is in her voice.</p>
      </section>

      <Band at="68% 22%" />

      <section aria-labelledby="cb-philo" className="px-5 py-[clamp(5rem,10vw,9rem)] sm:px-10">
        <ChapterHead n="III" id="cb-philo">
          {house.philosophy.heading}
        </ChapterHead>
        <ol className="mx-auto mt-14 max-w-[60rem] space-y-4 text-center">
          {house.philosophy.triad.map((t) => (
            <li key={t} className="display text-[clamp(1.8rem,4.4vw,3.4rem)] leading-[1.1]">
              {t}
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-14 max-w-[38rem] text-center text-[1.08rem] leading-[1.8] text-muted">{house.philosophy.paragraphs[0]}</p>
      </section>

      <section aria-labelledby="cb-values" className="border-y border-line px-5 py-[clamp(5rem,10vw,8rem)] sm:px-10">
        <ChapterHead n="IV" id="cb-values">
          What the house must always feel like
        </ChapterHead>
        <ul className="mx-auto mt-14 grid max-w-[72rem] gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {house.values.map((v) => (
            <li key={v.title} className="text-center">
              <p className="display text-[1.45rem] leading-tight">{v.title}</p>
              <p className="mt-3 text-[0.95rem] text-muted">{v.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cb-north" className="px-5 py-[clamp(6rem,12vw,10rem)] text-center sm:px-10">
        <h2 id="cb-north" className="caps text-accent">
          The North Star
        </h2>
        <p className="display mx-auto mt-8 max-w-[54rem] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.25]">{house.northStar}</p>
      </section>

      <section aria-labelledby="cb-forth" className="bg-surface px-5 py-20 sm:px-10">
        <h2 id="cb-forth" className="caps text-center text-muted">
          In development
        </h2>
        <ul className="mx-auto mt-10 grid max-w-[56rem] gap-10 sm:grid-cols-2">
          {forthcoming.map((f) => (
            <li key={f.name} className="text-center">
              <p className="display text-[1.8rem]">{f.name}</p>
              <p className="mt-3 text-muted">{f.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-14 text-center">
          <Link to={to('heirlooms')} className="btn">
            Meet the heirlooms
          </Link>
        </p>
      </section>
    </article>
  )
}
