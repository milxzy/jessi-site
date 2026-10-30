import { house } from '@/shared/data/house'
import { tapestryArchive, tapestryConfig, tapestryYears } from '@/shared/data/tapestry'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Heading, Tapestry } from './ui'

export default function TapestryPage() {
  const t = tapestryConfig
  useSeo({ title: t.title, description: house.tapestryIntro, concept: CONCEPT, image: t.desktopSrc })
  const published = new Set(tapestryArchive.map((c) => c.year))
  return (
    <article className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <Heading as="h1" sub={`${t.roman}. The first chapter of the house.`}>
          The House Tapestry
        </Heading>
      </div>

      <figure className="paper mx-auto mt-12 max-w-[90rem] p-3 sm:p-6">
        <Tapestry priority crop="50% 50%" className="aspect-[9/14] w-full sm:aspect-[16/10]" />
        <figcaption className="flex flex-wrap justify-between gap-3 pt-5 text-[0.95rem] text-muted">
          <span>
            {t.title}, {t.roman}. {t.credit}.
          </span>
          {t.isPlaceholder && <span className="text-accent">Placeholder artwork, standing in until the preview on November 8, 2026.</span>}
        </figcaption>
      </figure>

      <div className="mx-auto mt-[clamp(5rem,9vw,8rem)] grid max-w-[80rem] gap-10 lg:grid-cols-12">
        <p className="serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.35] font-light lg:col-span-7">{house.tapestryIntro}</p>
        <p className="text-[1.05rem] leading-[1.7] lg:col-span-4 lg:col-start-9">{house.tapestryArc}</p>
      </div>

      <section aria-labelledby="ca-key" className="mx-auto mt-[clamp(5rem,9vw,8rem)] max-w-[80rem]">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="ca-key" className="display text-[clamp(2rem,4vw,3rem)]">
              What to look for
            </h2>
            <p className="mt-3 text-[0.95rem] text-muted">Placeholder notes. The founder or the artist may prefer to leave the symbols undiscovered.</p>
          </div>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 md:col-span-8">
            {t.motifs.map((m) => (
              <div key={m.name} className="border-t border-line pt-4">
                <dt className="serif text-[1.35rem]">{m.name}</dt>
                <dd className="mt-1 text-[1rem] leading-relaxed text-muted">{m.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="ca-archive" className="mx-auto mt-[clamp(6rem,10vw,9rem)] max-w-[80rem]">
        <h2 id="ca-archive" className="display text-[clamp(2rem,4vw,3rem)]">
          The archive
        </h2>
        <p className="mt-3 max-w-[36rem] text-[1.05rem] text-muted">Each year’s tapestry is kept here, in order, so the ten-year work can one day be read from its first chapter.</p>
        <ol className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tapestryYears.map((y) => {
            const chapter = tapestryArchive.find((c) => c.year === y.year)
            return (
              <li key={y.year} className={published.has(y.year) ? 'paper p-2.5' : 'border border-dashed border-line p-2.5'}>
                {chapter ? (
                  <img src={chapter.desktopSrc} alt={`${chapter.title}${chapter.isPlaceholder ? ', placeholder' : ''}`} width={chapter.width} height={chapter.height} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <span className="flex aspect-[4/3] items-center justify-center text-[0.9rem] text-muted">To come</span>
                )}
                <p className="serif mt-2 text-[1.05rem]">{y.roman}</p>
                <p className="text-[0.85rem] text-muted">{y.year}</p>
              </li>
            )
          })}
        </ol>
      </section>
    </article>
  )
}
