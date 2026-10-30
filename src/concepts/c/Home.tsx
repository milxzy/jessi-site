import { Link } from 'react-router-dom'
import { formatDate } from '@/shared/content'
import { doorways, house, placeholderLetters } from '@/shared/data/house'
import { images } from '@/shared/data/images'
import { tapestryConfig } from '@/shared/data/tapestry'
import { useJournal, useProducts } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { useSeo } from '@/shared/lib/seo'
import { IndexList } from './IndexList'
import { CONCEPT, Loading, Plate, Price, Problem, roman, SectionHead, Stock, to } from './ui'

function Opening() {
  const t = tapestryConfig
  return (
    <section aria-labelledby="cc-h1" className="mx-auto max-w-[110rem] px-4 pt-4 sm:px-6">
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 md:col-span-4">
          <div>
            <h1 id="cc-h1" className="display text-[clamp(4rem,9.6vw,9.4rem)] leading-[0.8]">
              Jessi
              <br />
              Frances
            </h1>
            <p className="mt-6 text-[1.15rem] leading-snug">
              {house.signature[0]}
              <br />
              {house.signature[1]}
            </p>
          </div>
          <dl className="caption hidden border-t border-ink pt-2 md:block">
            <div className="grid grid-cols-[5.5rem_1fr]">
              <dt className="text-muted">Plate</dt>
              <dd>{t.roman}</dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr]">
              <dt className="text-muted">Title</dt>
              <dd>{t.title}</dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr]">
              <dt className="text-muted">Artist</dt>
              <dd>{t.credit}</dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr]">
              <dt className="text-muted">Preview</dt>
              <dd>8 November 2026</dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr]">
              <dt className="text-muted">Note</dt>
              <dd className="text-accent">Placeholder artwork</dd>
            </div>
          </dl>
        </div>
        <figure className="md:col-span-8">
          <Plate priority position="50% 40%" className="aspect-[4/5] w-full sm:aspect-[4/3] md:h-[min(84svh,62vw)] md:aspect-auto" />
          <figcaption className="caption mt-2 flex justify-between gap-4 md:hidden">
            <span>
              Plate {t.roman}. {t.title}.
            </span>
            <span className="text-accent">Placeholder artwork</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

const doorImages = [images.sisters, images.huggie, images.womanWriting, undefined]

function Doorways() {
  return (
    <section aria-labelledby="cc-doors" className="mx-auto mt-[clamp(6rem,12vw,11rem)] max-w-[110rem] px-4 sm:px-6">
      <SectionHead n="Index" id="cc-doors" aside="Choose a room, or read on in order.">
        Where to begin
      </SectionHead>
      <div className="mt-6">
        <IndexList
          label="The four rooms of the house"
          items={doorways.map((d, i) => ({
            key: d.key,
            n: roman[i]!,
            title: d.title,
            note: d.note,
            href: to(d.path),
            img: doorImages[i],
            imgStyle: { backgroundImage: `url(${tapestryConfig.mobileSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' },
          }))}
        />
      </div>
    </section>
  )
}

function Frances() {
  const l = placeholderLetters[0]!
  return (
    <section aria-labelledby="cc-frances" className="mx-auto mt-[clamp(7rem,13vw,12rem)] max-w-[110rem] px-4 sm:px-6">
      <SectionHead n="Plate I" id="cc-frances" aside="The woman behind the name">
        Discover Frances
      </SectionHead>
      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <figure className="md:col-span-4 md:col-start-3">
          <Picture img={images.letterConversation} sizes="(min-width: 768px) 30vw, 92vw" className="w-full" />
          <figcaption className="caption mt-2 border-t border-line pt-1.5 text-muted">Fig. 1. The Letter, or The Spanish Conversation, c. 1778. Placeholder image.</figcaption>
        </figure>
        <div className="md:col-span-5 md:col-start-8">
          <div className="space-y-5 text-[1.12rem] leading-[1.7]">
            {house.frances.paragraphs.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
          <article aria-label="Placeholder letter" className="plate mt-10 p-6 sm:p-8">
            <div className="caption flex justify-between border-b border-ink pb-2">
              <span className="font-semibold">Document 1. {l.salutation}</span>
              <span className="text-muted">{l.dateline}</span>
            </div>
            <div className="typed mt-5 space-y-3">
              {l.body.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
          </article>
          <Link to={to('house')} className="btn mt-8">
            <span>The House, in full</span>
            <span aria-hidden="true">I</span>
          </Link>
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
    <section aria-labelledby="cc-heir" className="mx-auto mt-[clamp(7rem,13vw,12rem)] max-w-[110rem] px-4 sm:px-6">
      <SectionHead n="Plates II–V" id="cc-heir" aside={house.chapterLine}>
        Meet the heirlooms
      </SectionHead>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-12">
        {huggie && (
          <Link to={to('heirlooms/the-first-huggie')} className="group md:col-span-6 md:row-span-2">
            <Picture img={huggie.images[0]!} sizes="(min-width: 768px) 48vw, 92vw" className="aspect-[4/5] w-full object-cover" />
            <span className="caption mt-2 grid grid-cols-[4.5rem_1fr_auto] gap-2 border-t border-ink pt-1.5">
              <span>Plate II</span>
              <span className="group-hover:underline">{huggie.title}</span>
              <span>
                <Price money={huggie.priceFrom} from />, <Stock state={huggie.availability} />
              </span>
            </span>
          </Link>
        )}
        <div className="md:col-span-5 md:col-start-8">
          <p className="display text-[clamp(2rem,3.6vw,3rem)] leading-[0.95]">{house.huggieLine}</p>
          <p className="mt-5 text-[1.05rem] text-muted">{house.chaptersLine}</p>
          <Link to={to('heirlooms')} className="btn btn-line mt-7">
            <span>The full catalogue</span>
            <span aria-hidden="true">{chapters.length + 1}</span>
          </Link>
        </div>
        <ul className="grid grid-cols-3 gap-3 self-end md:col-span-6 md:col-start-7">
          {chapters.map((c, i) => (
            <li key={c.id}>
              <Link to={to(`heirlooms/chapters#${c.handle}`)} className="group block">
                <Picture img={c.images[0]!} sizes="(min-width: 768px) 16vw, 30vw" className="aspect-[3/4] w-full object-cover" />
                <span className="caption mt-1.5 block border-t border-ink pt-1">
                  Plate {roman[i + 2]}
                  <span className="block group-hover:underline">{c.shortTitle}</span>
                  <span className="block text-muted">
                    <Stock state={c.availability} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Journal() {
  const j = useJournal()
  return (
    <section aria-labelledby="cc-journal" className="mx-auto mt-[clamp(7rem,13vw,12rem)] max-w-[110rem] px-4 sm:px-6">
      <SectionHead n="Entries" id="cc-journal" aside={house.journalLine}>
        The Frances Journal
      </SectionHead>
      {j.status === 'loading' && <Loading />}
      {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
      {j.data && (
        <div className="mt-6">
          <IndexList
            size="lg"
            label="Latest entries"
            items={j.data.slice(0, 4).map((e, i) => ({
              key: e.id,
              n: String(j.data.length - i).padStart(2, '0'),
              title: e.title,
              note: e.excerpt,
              meta: formatDate(e.publishedAt, 'short'),
              href: to(`journal/${e.handle}`),
              img: e.image,
            }))}
          />
          <p className="mt-6">
            <Link to={to('journal')} className="link">
              All entries in the Journal
            </Link>
          </p>
        </div>
      )}
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
    </>
  )
}
