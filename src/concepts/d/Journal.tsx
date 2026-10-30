import { Link, useParams } from 'react-router-dom'
import { formatDate } from '@/shared/content'
import { house } from '@/shared/data/house'
import { useEntry, useJournal } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { articleLd, useSeo } from '@/shared/lib/seo'
import NotFound from './NotFound'
import { CONCEPT, Head, Loading, Problem, to } from './ui'

export function JournalIndex() {
  useSeo({ title: 'The Frances Journal', description: house.journalIntro, concept: CONCEPT })
  const j = useJournal()
  const [first, ...rest] = j.data ?? []
  return (
    <div className="mx-auto max-w-[56rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <Head as="h1" sub={house.journalLine}>
        The Frances Journal
      </Head>
      <p className="mx-auto mt-5 max-w-[32rem] text-center text-muted">{house.journalIntro}</p>
      {j.status === 'loading' && <Loading />}
      {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
      {j.status === 'ready' && !first && <p className="mt-12 text-center text-muted">The first entry is being written.</p>}
      {first && (
        <Link to={to(`journal/${first.handle}`)} className="group mt-12 block text-center">
          {first.image && <Picture img={first.image} priority sizes="(min-width: 640px) 28rem, 88vw" className="arch mx-auto aspect-[4/5] w-[min(88vw,28rem)] object-cover" />}
          <span className="mt-5 block text-[0.92rem] text-muted">{formatDate(first.publishedAt)}</span>
          <span className="display mt-2 block text-[clamp(2.2rem,7vw,3.4rem)]">{first.title}</span>
          <span className="mx-auto mt-2 block max-w-[30rem] text-muted">{first.excerpt}</span>
        </Link>
      )}
      <ul className="mt-14 space-y-3">
        {rest.map((e) => (
          <li key={e.id}>
            <Link to={to(`journal/${e.handle}`)} className="flex items-center gap-5 rounded-[1.5rem] p-3 transition-colors duration-500 hover:bg-surface">
              {e.image && <Picture img={e.image} sizes="6rem" alt="" className="arch aspect-[4/5] w-20 shrink-0 object-cover sm:w-24" />}
              <span>
                <span className="block text-[0.9rem] text-muted">
                  {formatDate(e.publishedAt)}
                  {e.tags[0] && `, ${e.tags[0]}`}
                </span>
                <span className="display mt-1 block text-[clamp(1.4rem,4vw,1.9rem)]">{e.title}</span>
                <span className="mt-1 block text-[0.98rem] text-muted">{e.excerpt}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
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
  if (r.status === 'loading') return <Loading />
  if (r.status === 'error') return <div className="px-5 py-10"><Problem message={r.error} retry={r.retry} /></div>
  if (!r.data || !entry) return <NotFound />
  const next = r.data.next
  return (
    <article className="px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <header className="mx-auto max-w-[38rem] text-center">
        <p className="text-[0.92rem] text-muted">
          <Link to={to('journal')} className="link">
            The Frances Journal
          </Link>
          , <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
        </p>
        <h1 className="display mt-4 text-[clamp(2.6rem,9vw,4.6rem)]">{entry.title}</h1>
        <p className="serif mt-4 text-[1.3rem] leading-snug text-muted italic">{entry.excerpt}</p>
        {entry.image && <Picture img={entry.image} priority sizes="(min-width: 640px) 30rem, 88vw" className="arch mx-auto mt-10 aspect-[4/5] w-[min(88vw,30rem)] object-cover" />}
      </header>
      <div className="prose mx-auto mt-12 max-w-[36rem]" dangerouslySetInnerHTML={{ __html: entry.contentHtml }} />
      <p className="serif mx-auto mt-10 max-w-[36rem] text-[1.15rem] italic">{entry.author}</p>
      {next && (
        <nav aria-label="Next entry" className="mx-auto mt-16 max-w-[36rem]">
          <Link to={to(`journal/${next.handle}`)} className="block rounded-[2rem] bg-surface p-6 text-center transition-colors duration-500 hover:bg-camel hover:text-camel-ink">
            <span className="block text-[0.92rem]">Next entry</span>
            <span className="display mt-1 block text-[clamp(1.7rem,5vw,2.4rem)]">{next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  )
}
