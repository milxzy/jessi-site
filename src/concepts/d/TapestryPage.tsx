import { useState } from 'react'
import { house } from '@/shared/data/house'
import { tapestryArchive, tapestryConfig, tapestryYears } from '@/shared/data/tapestry'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Head } from './ui'

// where to look in the placeholder's portrait composition for each motif, with how close to come.
// re-place these when the real artwork arrives.
const views: { at: string; zoom: number }[] = [
  { at: '50% 40%', zoom: 100 },
  { at: '88% 28%', zoom: 320 },
  { at: '50% 64%', zoom: 260 },
  { at: '12% 10%', zoom: 340 },
  { at: '50% 82%', zoom: 380 },
  { at: '50% 81%', zoom: 300 },
]

// "look closer": the arched window moves to each motif in turn
export default function TapestryPage() {
  const t = tapestryConfig
  const [i, setI] = useState(0)
  const view = views[i] ?? views[0]!
  useSeo({ title: t.title, description: house.tapestryIntro, concept: CONCEPT, image: t.desktopSrc })
  const choices = [{ name: 'The whole tapestry', note: house.tapestryIntro }, ...t.motifs]
  const current = choices[i]!
  return (
    <article className="mx-auto max-w-[72rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <Head as="h1" sub={`${t.roman}. The first chapter of the house.`}>
        The House Tapestry
      </Head>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <figure>
          <div
            role="img"
            aria-label={i === 0 ? t.alt : `${t.title}, detail: ${current.name}`}
            className="loupe arch mx-auto aspect-[3/5] w-[min(84vw,26rem)] bg-[#2a1d15] bg-no-repeat"
            style={{ backgroundImage: `url(${t.mobileSrc})`, backgroundSize: `${view.zoom}% auto`, backgroundPosition: view.at }}
          />
          <figcaption className="mt-3 text-center text-[0.88rem] text-muted">
            {t.credit}. {t.isPlaceholder && <span className="text-accent">Placeholder artwork, until the preview on November 8, 2026.</span>}
          </figcaption>
        </figure>
        <div>
          <h2 className="display text-center text-[clamp(1.8rem,4.6vw,2.6rem)] md:text-left">Look closer</h2>
          <div role="group" aria-label="Choose what to look at" className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
            {choices.map((c, n) => (
              <button key={c.name} type="button" aria-pressed={i === n} onClick={() => setI(n)} className={`pill min-h-[44px] px-4 text-[0.95rem] transition-colors duration-300 ${i === n ? 'bg-field text-field-ink' : 'bg-surface hover:bg-camel hover:text-camel-ink'}`}>
                {c.name}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="serif mt-6 min-h-[4.5em] text-center text-[1.3rem] leading-snug md:text-left">
            {current.note}
          </p>
          <p className="mt-2 text-center text-[0.9rem] text-muted md:text-left">Symbol notes are placeholders. The founder or the artist may prefer to leave them to be discovered.</p>
        </div>
      </div>

      <section aria-labelledby="cd-arc" className="mt-[clamp(5rem,10vw,8rem)]">
        <Head id="cd-arc" sub={house.tapestryArc}>
          A chapter every year
        </Head>
        <ol className="snap-row mt-10 flex gap-3 overflow-x-auto pb-4">
          {tapestryYears.map((y) => {
            const ch = tapestryArchive.find((c) => c.year === y.year)
            return (
              <li key={y.year} className="w-[7.5rem] shrink-0 text-center">
                {ch ? (
                  <img src={ch.mobileSrc} alt={`${ch.title}${ch.isPlaceholder ? ', placeholder' : ''}`} width={ch.mobileWidth} height={ch.mobileHeight} loading="lazy" className="arch aspect-[3/5] w-full object-cover" />
                ) : (
                  <span className="arch flex aspect-[3/5] w-full items-center justify-center bg-surface px-2 text-[0.85rem] text-muted">Still to come</span>
                )}
                <span className="serif mt-2 block text-[1.05rem]">{y.roman}</span>
                <span className="block text-[0.85rem] text-muted">{y.year}</span>
              </li>
            )
          })}
        </ol>
      </section>
    </article>
  )
}
