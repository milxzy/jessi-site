import { Link, useParams } from 'react-router-dom'
import { formatDate } from '@/shared/content'
import { house } from '@/shared/data/house'
import { useEntry, useJournal } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { articleLd, useSeo } from '@/shared/lib/seo'
import { CONCEPT, Heading, Loading, Problem, to } from './ui'
import NotFound from './NotFound'

// the journal is kept like a correspondence register: date typed in the margin, title in ink
export function JournalIndex() {
  useSeo({ title: 'The Frances Journal', description: house.journalIntro, concept: CONCEPT })
  const j = useJournal()
  const [first, ...rest] = j.data ?? []
  return (
    <div className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <div className="grid gap-8 lg:grid-cols-12">
          <Heading as="h1" sub={house.journalLine} className="lg:col-span-7">
            The Frances Journal
          </Heading>
          <p className="text-[1.08rem] leading-[1.7] lg:col-span-4 lg:col-start-9 lg:pt-6">{house.journalIntro}</p>
        </div>
        {j.status === 'loading' && <Loading label="Opening the journal" />}
        {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
        {j.status === 'ready' && !first && <p className="serif mt-14 text-[1.4rem]">The first entry is being written.</p>}
        {first && (
          <Link to={to(`journal/${first.handle}`)} className="group paper mt-14 grid gap-8 p-4 sm:p-8 md:grid-cols-12">
            {first.image && <Picture img={first.image} priority sizes="(min-width: 768px) 40vw, 92vw" className="aspect-[4/5] w-full object-cover md:col-span-5" />}
            <span className="flex flex-col justify-end md:col-span-6 md:col-start-7">
              <span className="typed text-muted">
                {formatDate(first.publishedAt)}
                {first.tags[0] && <>, {first.tags[0]}</>}
              </span>
              <span className="display mt-3 text-[clamp(2.4rem,5vw,4rem)] group-hover:italic">{first.title}</span>
              <span className="mt-4 max-w-[30rem] text-[1.1rem] leading-relaxed">{first.excerpt}</span>
            </span>
          </Link>
        )}
        {rest.length > 0 && (
          <ol className="mt-16 border-t border-line">
            {rest.map((e) => (
              <li key={e.id} className="border-b border-line">
                <Link to={to(`journal/${e.handle}`)} className="group grid gap-3 py-7 sm:grid-cols-[11rem_1fr_7rem] sm:items-center sm:gap-8">
                  <span className="typed text-[0.92rem] text-muted">{formatDate(e.publishedAt)}</span>
                  <span>
                    <span className="display block text-[clamp(1.7rem,3vw,2.3rem)] group-hover:italic">{e.title}</span>
                    <span className="mt-1 block text-[1rem] text-muted">{e.excerpt}</span>
                  </span>
                  {e.image && <Picture img={e.image} sizes="7rem" className="hidden aspect-square w-full object-cover sm:block" alt="" />}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export function JournalEntry() {
  const { handle = '' } = useParams()
  const r = useEntry(handle)
  const entry = r.data?.entry
  useSeo({
    title: entry?.title ?? 'The Frances Journal',
    description: entry?.excerpt ?? house.journalIntro,
    concept: CONCEPT,
    type: 'article',
    image: entry?.image?.url,
    jsonLd: entry ? articleLd({ title: entry.title, description: entry.excerpt, image: entry.image?.url, publishedAt: entry.publishedAt, author: entry.author }) : undefined,
  })
  if (r.status === 'loading') return <Loading label="Unfolding the entry" />
  if (r.status === 'error') return <Problem message={r.error} retry={r.retry} />
  if (!r.data || !entry) return <NotFound />
  const next = r.data.next
  return (
    <article className="px-4 pt-12 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-20">
      <header className="mx-auto max-w-[46rem] text-center">
        <p className="typed text-muted">
          <Link to={to('journal')} className="link">
            The Frances Journal
          </Link>
          , {formatDate(entry.publishedAt)}
        </p>
        <h1 className="display mt-5 text-[clamp(2.6rem,7vw,5rem)]">{entry.title}</h1>
        <p className="serif mt-5 text-[1.3rem] leading-snug text-muted italic">{entry.excerpt}</p>
      </header>
      {entry.image && (
        <div className="paper mx-auto mt-12 max-w-[60rem] p-3 sm:p-5">
          <Picture img={entry.image} priority sizes="(min-width: 960px) 58rem, 94vw" className="max-h-[78vh] w-full object-cover" />
        </div>
      )}
      <div className="paper mx-auto mt-10 max-w-[46rem] px-6 py-12 sm:px-14 sm:py-16">
        <div className="prose" dangerouslySetInnerHTML={{ __html: entry.contentHtml }} />
        <p className="typed mt-12 text-muted">{entry.author}</p>
      </div>
      {next && (
        <nav aria-label="Next entry" className="mx-auto mt-14 max-w-[46rem] border-t border-line pt-6">
          <Link to={to(`journal/${next.handle}`)} className="group block">
            <span className="text-[0.95rem] text-muted">Next entry</span>
            <span className="display mt-1 block text-[clamp(1.8rem,4vw,2.6rem)] group-hover:italic">{next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  )
}
