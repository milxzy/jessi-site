import { useState } from 'react'
import { house } from '@/shared/data/house'
import { tapestryArchive, tapestryConfig, tapestryYears } from '@/shared/data/tapestry'
import { useSeo } from '@/shared/lib/seo'
import { ChapterHead, CONCEPT, crop, Stage } from './ui'

// where each motif sits in the placeholder art, for its spotlight. update with the real artwork.
const spots = ['78% 30%', '66% 24%', '50% 80%', '20% 14%', '50% 88%', '46% 88%']

export default function TapestryPage() {
  const t = tapestryConfig
  const [spot, setSpot] = useState(0)
  useSeo({ title: t.title, description: house.tapestryIntro, concept: CONCEPT, image: t.desktopSrc })
  return (
    <article>
      <h1 className="sr-only">The House Tapestry, {t.roman}</h1>
      <Stage priority zoom={1} drift className="h-[100svh] min-h-[34rem]" />
      <div className="flex flex-wrap justify-between gap-3 border-b border-line px-5 py-4 text-[0.9rem] text-muted sm:px-10">
        <span>
          {t.title}, {t.roman}. {t.credit}.
        </span>
        {t.isPlaceholder && <span className="text-accent">Placeholder artwork until the preview on November 8, 2026.</span>}
      </div>

      <section aria-labelledby="cb-t-about" className="px-5 py-[clamp(6rem,12vw,10rem)] sm:px-10">
        <ChapterHead n={t.roman} id="cb-t-about">
          The House Tapestry
        </ChapterHead>
        <p className="display mx-auto mt-12 max-w-[50rem] text-center text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.3]">{house.tapestryIntro}</p>
        <p className="mx-auto mt-8 max-w-[36rem] text-center text-muted">{house.tapestryArc}</p>
      </section>

      <section aria-labelledby="cb-t-look" className="border-t border-line">
        <div className="grid md:grid-cols-2">
          <div aria-hidden="true" className="band sticky top-0 h-[50vh] md:h-[100svh]">
            {spots.map((s, i) => (
              <div key={s + i} className={`door-still ${spot === i ? 'is-on !opacity-100' : ''}`} style={crop(s, 4)} />
            ))}
          </div>
          <div className="px-5 py-20 sm:px-10 md:py-32">
            <h2 id="cb-t-look" className="display text-[clamp(2.2rem,4.4vw,3.4rem)]">
              What to look for
            </h2>
            <p className="mt-4 text-[0.95rem] text-muted">Placeholder notes. The founder or the artist may prefer to leave the symbols undiscovered.</p>
            <ul className="mt-12 space-y-2">
              {t.motifs.map((m, i) => (
                <li key={m.name}>
                  <button type="button" onClick={() => setSpot(i)} onMouseEnter={() => setSpot(i)} onFocus={() => setSpot(i)} aria-pressed={spot === i} className="block w-full border-t border-line py-6 text-left">
                    <span className={`display block text-[clamp(1.6rem,3vw,2.2rem)] transition-colors duration-500 ${spot === i ? 'text-accent' : ''}`}>{m.name}</span>
                    <span className="mt-2 block text-muted">{m.note}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="cb-t-archive" className="border-t border-line px-5 py-[clamp(6rem,12vw,10rem)] sm:px-10">
        <ChapterHead id="cb-t-archive" sub="Every year adds a chapter. Each one is kept, so the ten-year work can be read in order.">
          The archive
        </ChapterHead>
        <ol className="mx-auto mt-16 flex max-w-[80rem] snap-x gap-4 overflow-x-auto pb-6">
          {tapestryYears.map((y) => {
            const ch = tapestryArchive.find((c) => c.year === y.year)
            return (
              <li key={y.year} className="w-[11rem] shrink-0 snap-start text-center sm:w-[13rem]">
                {ch ? (
                  <img src={ch.mobileSrc} alt={`${ch.title}${ch.isPlaceholder ? ', placeholder' : ''}`} width={ch.mobileWidth} height={ch.mobileHeight} loading="lazy" className="aspect-[3/5] w-full object-cover" />
                ) : (
                  <span className="flex aspect-[3/5] w-full items-center justify-center border border-line text-[0.9rem] text-muted">Yet to be drawn</span>
                )}
                <p className="caps mt-4 text-accent">{y.roman}</p>
                <p className="mt-1 text-[0.9rem] text-muted">{y.year}</p>
              </li>
            )
          })}
        </ol>
      </section>
    </article>
  )
}
