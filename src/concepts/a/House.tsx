import { Link } from 'react-router-dom'
import { forthcoming } from '@/shared/data/catalog'
import { house, placeholderLetters } from '@/shared/data/house'
import { images } from '@/shared/data/images'
import { usePage } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Heading, Loading, Problem, to } from './ui'

function Letter({ index, tilt }: { index: number; tilt: string }) {
  const l = placeholderLetters[index]!
  return (
    <article aria-label={`Placeholder letter ${index + 1}`} className="letter-sheet paper px-6 py-9 sm:px-10 sm:py-12" style={{ ['--tilt' as string]: tilt }}>
      <div className="flex items-start justify-between gap-4">
        <span className="placeholder-stamp">{l.salutation}</span>
        <span className="typed text-muted">{l.dateline}</span>
      </div>
      <div className="typed mt-8 space-y-4">
        {l.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <p className="typed mt-8 text-muted">{l.signoff}</p>
    </article>
  )
}

export default function House() {
  useSeo({ title: 'The House', description: house.intro, concept: CONCEPT })
  const founder = usePage('the-house')
  return (
    <article className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <Heading as="h1" sub={house.descriptor}>
          The House
        </Heading>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <p className="serif text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.3] font-light lg:col-span-7">{house.intro}</p>
          <div className="space-y-5 text-[1.08rem] leading-[1.7] lg:col-span-4 lg:col-start-9 lg:pt-2">
            <p>{house.ambition}</p>
            <p className="serif text-[1.25rem] leading-snug italic">“{house.wearQuote}”</p>
          </div>
        </div>

        <section aria-labelledby="ca-founder" className="mt-[clamp(6rem,10vw,9rem)] grid gap-10 lg:grid-cols-12">
          <h2 id="ca-founder" className="display text-[clamp(2rem,4.4vw,3.2rem)] lg:col-span-4">
            The founder’s story
          </h2>
          <div className="paper p-6 sm:p-10 lg:col-span-8">
            {founder.status === 'loading' && <Loading />}
            {founder.status === 'error' && <Problem message={founder.error} retry={founder.retry} />}
            {founder.status === 'ready' && founder.data && <div className="page-body text-[1.1rem] leading-[1.7]" dangerouslySetInnerHTML={{ __html: founder.data.bodyHtml }} />}
          </div>
        </section>

        <section aria-labelledby="ca-frances" className="mt-[clamp(6rem,10vw,9rem)]">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="ca-frances" className="display text-[clamp(2rem,4.4vw,3.2rem)]">
                {house.frances.heading}
              </h2>
              <div className="mt-6 space-y-5 text-[1.1rem] leading-[1.7]">
                {house.frances.paragraphs.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </div>
              <p className="mt-6 text-[0.95rem] text-muted">The letters below hold places for Frances’s own typewritten words. Nothing on them is written in her voice.</p>
            </div>
            <figure className="self-end lg:col-span-5 lg:col-start-8">
              <Picture img={images.letterConversation} sizes="(min-width: 1024px) 34vw, 92vw" className="w-full max-w-[26rem] lg:ml-auto" />
              <figcaption className="mt-2 text-[0.85rem] text-muted lg:text-right">The Letter, or The Spanish Conversation, c. 1778. Art Institute of Chicago. Placeholder image.</figcaption>
            </figure>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <Letter index={0} tilt="-0.8deg" />
            </div>
            <div className="md:col-span-5 md:col-start-8 md:mt-20">
              <Letter index={1} tilt="1deg" />
            </div>
          </div>
        </section>

        <section aria-labelledby="ca-philosophy" className="mt-[clamp(7rem,12vw,11rem)]">
          <h2 id="ca-philosophy" className="display text-[clamp(2rem,4.4vw,3.2rem)]">
            {house.philosophy.heading}
          </h2>
          <ol className="mt-10 border-t border-line">
            {house.philosophy.triad.map((t, i) => (
              <li key={t} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[6rem_1fr] sm:items-baseline">
                <span className="serif text-[1.1rem] text-accent italic">{['First', 'Then', 'And'][i]}</span>
                <span className="display text-[clamp(1.8rem,4.6vw,3.4rem)]">{t}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="text-[1.1rem] leading-[1.7] md:col-span-6">{house.philosophy.paragraphs[0]}</p>
            <p className="serif text-[1.45rem] leading-snug italic md:col-span-5 md:col-start-8">“{house.philosophy.quote}”</p>
          </div>
        </section>

        <section aria-labelledby="ca-values" className="mt-[clamp(7rem,12vw,11rem)] grid gap-10 lg:grid-cols-12">
          <h2 id="ca-values" className="display text-[clamp(2rem,4.4vw,3.2rem)] lg:col-span-4">
            What the house must always feel like
          </h2>
          <dl className="divide-y divide-line border-y border-line lg:col-span-8">
            {house.values.map((v) => (
              <div key={v.title} className="grid gap-1 py-5 sm:grid-cols-[1fr_1.2fr] sm:gap-8">
                <dt className="serif text-[1.45rem] leading-tight">{v.title}</dt>
                <dd className="text-[1.02rem] text-muted">{v.note}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="ca-north" className="paper mt-[clamp(7rem,12vw,11rem)] px-6 py-14 text-center sm:px-16 sm:py-20">
          <h2 id="ca-north" className="text-[0.95rem] tracking-[0.2em] text-muted uppercase">
            The North Star
          </h2>
          <p className="display mx-auto mt-8 max-w-[50rem] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.22]">{house.northStar}</p>
          <p className="serif mt-10 text-[1.2rem] italic">{house.signatureLine}</p>
        </section>

        <section aria-labelledby="ca-workshop" className="mt-[clamp(6rem,10vw,9rem)] grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="ca-workshop" className="display text-[clamp(1.8rem,3.4vw,2.6rem)]">
              Still in the workshop
            </h2>
            <p className="mt-3 text-muted">Shared for the story, not for sale.</p>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 md:col-span-8">
            {forthcoming.map((f) => (
              <li key={f.name} className="border-t border-line pt-5">
                <h3 className="serif text-[1.4rem]">{f.name}</h3>
                <p className="mt-2 text-[1rem] leading-relaxed text-muted">{f.note}</p>
                <p className="mt-3 text-[0.9rem] text-accent">In development</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-20 text-center">
          <Link to={to('heirlooms')} className="btn">
            Meet the heirlooms
          </Link>
        </p>
      </div>
    </article>
  )
}
