import { Link, useParams } from 'react-router-dom'
import { formatDate } from '@/shared/content'
import { house } from '@/shared/data/house'
import { useEntry, useJournal } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { articleLd, useSeo } from '@/shared/lib/seo'
import NotFound from './NotFound'
import { ChapterHead, CONCEPT, Loading, Problem, to } from './ui'

export function JournalIndex() {
  useSeo({ title: 'The Frances Journal', description: house.journalIntro, concept: CONCEPT })
  const j = useJournal()
  return (
    <div className="pt-36 pb-[clamp(6rem,12vw,10rem)]">
      <div className="px-5 sm:px-10">
        <ChapterHead as="h1" sub={house.journalIntro}>
          The Frances Journal
        </ChapterHead>
      </div>
      {j.status === 'loading' && <Loading />}
      {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
      {j.status === 'ready' && !j.data.length && <p className="mt-16 text-center text-muted">The first entry is being written.</p>}
      <ol className="mt-20">
        {j.data?.map((e, i) => (
          <li key={e.id}>
            <Link to={to(`journal/${e.handle}`)} className="group relative block overflow-hidden border-t border-line px-5 py-12 text-center sm:px-10 sm:py-16">
              {e.image && (
                <Picture img={e.image} sizes="100vw" alt="" priority={i === 0} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-25 group-focus-visible:opacity-25" />
              )}
              <span className="relative block">
                <span className="caps block text-muted">
                  {formatDate(e.publishedAt)}
                  {e.tags[0] && <span className="ml-4 text-accent">{e.tags[0]}</span>}
                </span>
                <span className="display mt-4 block text-[clamp(2.2rem,6vw,4.6rem)]">{e.title}</span>
                <span className="mx-auto mt-3 block max-w-[34rem] text-muted">{e.excerpt}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
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
  if (r.status === 'loading') return <div className="pt-32"><Loading /></div>
  if (r.status === 'error') return <div className="pt-32"><Problem message={r.error} retry={r.retry} /></div>
  if (!r.data || !entry) return <NotFound />
  const next = r.data.next
  return (
    <article>
      <header className="relative flex min-h-[86svh] items-end overflow-hidden">
        {entry.image && <Picture img={entry.image} priority sizes="100vw" className="absolute inset-0 h-full w-full object-cover opacity-70" />}
        <div aria-hidden="true" className="scrim-b absolute inset-0" />
        <div className="relative w-full px-5 pb-16 text-center sm:px-10">
          <p className="caps text-muted">
            <Link to={to('journal')} className="link">
              The Frances Journal
            </Link>
            <span className="ml-4">{formatDate(entry.publishedAt)}</span>
          </p>
          <h1 className="display mx-auto mt-6 max-w-[18ch] text-[clamp(2.8rem,8vw,6.4rem)]">{entry.title}</h1>
          <p className="mx-auto mt-6 max-w-[34rem] text-[1.1rem]">{entry.excerpt}</p>
        </div>
      </header>
      <div className="lit px-5 py-[clamp(4rem,9vw,7rem)] sm:px-10">
        <div className="prose mx-auto max-w-[38rem]" dangerouslySetInnerHTML={{ __html: entry.contentHtml }} />
        <p className="caps mx-auto mt-14 max-w-[38rem] text-field-muted">{entry.author}</p>
      </div>
      {next && (
        <nav aria-label="Next entry" className="px-5 py-20 text-center sm:px-10">
          <Link to={to(`journal/${next.handle}`)} className="group inline-block">
            <span className="caps block text-muted">Next entry</span>
            <span className="display mt-4 block text-[clamp(2rem,5vw,3.6rem)] transition-colors duration-500 group-hover:text-accent">{next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  )
}
