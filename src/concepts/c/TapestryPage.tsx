import { useState } from 'react'
import { house } from '@/shared/data/house'
import { tapestryArchive, tapestryConfig, tapestryYears } from '@/shared/data/tapestry'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Plate, SectionHead, Title } from './ui'

// where each motif sits on the placeholder plate, as a share of width and height.
// these follow the placeholder's geometry; re-place them when the real artwork arrives.
const markers: [number, number][] = [
  [31, 43],
  [67, 30],
  [50, 76],
  [20, 15],
  [53, 89],
  [45.5, 84],
]

export default function TapestryPage() {
  const t = tapestryConfig
  const [active, setActive] = useState<number | null>(null)
  useSeo({ title: t.title, description: house.tapestryIntro, concept: CONCEPT, image: t.desktopSrc })
  return (
    <article className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Section IV" sub={house.tapestryIntro}>
        The House Tapestry
      </Title>

      <section aria-labelledby="cc-archive" className="mt-16">
        <SectionHead n="Archive" id="cc-archive" aside={house.tapestryArc}>
          Plates by year
        </SectionHead>
        <ol className="mt-4">
          {tapestryYears.map((y) => {
            const ch = tapestryArchive.find((c) => c.year === y.year)
            return (
              <li key={y.year} className="rule-soft grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-4 py-2">
                <span className="caption">{y.year}</span>
                <span className={`display text-[clamp(1.8rem,4vw,3.2rem)] ${ch ? '' : 'text-muted'}`}>Plate {y.roman}</span>
                <span className="caption text-muted">{ch ? (ch.isPlaceholder ? 'Shown below, placeholder' : 'Shown below') : 'To come'}</span>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="cc-plate" className="mt-[clamp(5rem,9vw,8rem)]">
        <SectionHead n={`Plate ${t.roman}`} id="cc-plate" aside={`${t.credit}. Preview 8 November 2026.`}>
          {t.title}
        </SectionHead>
        <figure className="mt-6">
          <Plate fit="contain" className="aspect-[16/10] w-full">
            {markers.map(([x, y], i) => (
              <button
                key={i}
                type="button"
                className="marker absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-pressed={active === i}
                aria-label={`Motif ${i + 1}: ${t.motifs[i]?.name}`}
                onClick={() => setActive(active === i ? null : i)}
              >
                {i + 1}
              </button>
            ))}
          </Plate>
          <figcaption className="caption mt-2 flex flex-wrap justify-between gap-2">
            <span>
              Plate {t.roman}. {t.title}. {t.credit}.
            </span>
            {t.isPlaceholder && <span className="text-accent">Placeholder artwork, standing in until the preview.</span>}
          </figcaption>
        </figure>
        <div className="mt-10 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3 md:col-start-3">
            <h3 className="display text-[2.4rem]">Key</h3>
            <p className="caption mt-2 text-muted">Placeholder notes. The founder or the artist may prefer to leave the symbols undiscovered.</p>
          </div>
          <ol className="md:col-span-7">
            {t.motifs.map((m, i) => (
              <li key={m.name} className={`rule-soft grid grid-cols-[2.5rem_1fr] gap-2 py-3 transition-colors duration-300 ${active === i ? 'bg-surface' : ''}`}>
                <span className="caption pt-1">{i + 1}.</span>
                <span>
                  <span className="block text-[1.1rem]">{m.name}</span>
                  <span className="caption block text-muted">{m.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </article>
  )
}
