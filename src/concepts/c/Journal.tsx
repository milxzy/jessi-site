import { Link, useParams } from 'react-router-dom'
import { formatDate } from '@/shared/content'
import { house } from '@/shared/data/house'
import { useEntry, useJournal } from '@/shared/lib/data'
import { Picture } from '@/shared/lib/Picture'
import { articleLd, useSeo } from '@/shared/lib/seo'
import { IndexList } from './IndexList'
import NotFound from './NotFound'
import { CONCEPT, Loading, Problem, Title, to } from './ui'

export function JournalIndex() {
  useSeo({ title: 'The Frances Journal', description: house.journalIntro, concept: CONCEPT })
  const j = useJournal()
  return (
    <div className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Section III" sub={house.journalIntro}>
        The Frances Journal
      </Title>
      {j.status === 'loading' && <Loading />}
      {j.status === 'error' && <Problem message={j.error} retry={j.retry} />}
      {j.status === 'ready' && !j.data.length && <p className="display mt-10 text-[2.4rem]">The first entry is being written.</p>}
      {j.data && j.data.length > 0 && (
        <div className="mt-14">
          <p className="caption mb-2 text-muted">
            {j.data.length} entries, newest first. {house.journalLine}
          </p>
          <IndexList
            size="lg"
            label="All entries"
            items={j.data.map((e, i) => ({
              key: e.id,
              n: String(j.data.length - i).padStart(2, '0'),
              title: e.title,
              note: e.excerpt,
              meta: `${formatDate(e.publishedAt, 'short')}${e.tags[0] ? `, ${e.tags[0]}` : ''}`,
              href: to(`journal/${e.handle}`),
              img: e.image,
            }))}
          />
        </div>
      )}
    </div>
  )
}

export function JournalEntry() {
  const { handle = '' } = useParams()
  const r = useEntry(handle)
  const all = useJournal()
  const entry = r.data?.entry
  useSeo({
    title: entry?.title ?? 'The Frances Journal',
    description: entry?.excerpt ?? house.journalIntro,
    concept: CONCEPT,
    type: 'article',
    image: entry?.image?.url,
    jsonLd: entry ? articleLd({ title: entry.title, description: entry.excerpt, image: entry.image?.url, publishedAt: entry.publishedAt, author: entry.author }) : undefined,
  })
  if (r.status === 'loading') return <div className="px-6"><Loading /></div>
  if (r.status === 'error') return <div className="px-6"><Problem message={r.error} retry={r.retry} /></div>
  if (!r.data || !entry) return <NotFound />
  const next = r.data.next
  const number = all.data ? all.data.length - all.data.findIndex((e) => e.id === entry.id) : null
  return (
    <article className="mx-auto max-w-[110rem] px-4 pt-8 sm:px-6 sm:pt-12">
      <div className="grid gap-8 md:grid-cols-12">
        <aside className="md:col-span-3 lg:col-span-2">
          <dl className="caption md:sticky md:top-20">
            <div className="grid grid-cols-[4.5rem_1fr] border-t border-ink py-1.5 md:block">
              <dt className="text-muted">Entry</dt>
              <dd>{number ? String(number).padStart(2, '0') : ''}</dd>
            </div>
            <div className="grid grid-cols-[4.5rem_1fr] border-t border-line py-1.5 md:block">
              <dt className="text-muted">Date</dt>
              <dd>
                <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time>
              </dd>
            </div>
            {entry.tags.length > 0 && (
              <div className="grid grid-cols-[4.5rem_1fr] border-t border-line py-1.5 md:block">
                <dt className="text-muted">Filed under</dt>
                <dd>{entry.tags.join(', ')}</dd>
              </div>
            )}
            <div className="grid grid-cols-[4.5rem_1fr] border-t border-line py-1.5 md:block">
              <dt className="text-muted">By</dt>
              <dd>{entry.author}</dd>
            </div>
            <div className="border-t border-line py-1.5">
              <Link to={to('journal')} className="link">
                All entries
              </Link>
            </div>
          </dl>
        </aside>
        <div className="md:col-span-9 lg:col-span-8">
          <h1 className="display text-[clamp(3.2rem,9vw,8rem)]">{entry.title}</h1>
          <p className="mt-5 max-w-[38rem] text-[1.2rem] text-muted">{entry.excerpt}</p>
          {entry.image && (
            <figure className="mt-10">
              <Picture img={entry.image} priority sizes="(min-width: 1024px) 66vw, 92vw" className="max-h-[80vh] w-full object-cover" />
              <figcaption className="caption mt-1.5 text-muted">Fig. 1. {entry.image.altText}. Placeholder image.</figcaption>
            </figure>
          )}
          <div className="prose mt-12 max-w-[40rem] lg:ml-[16%]" dangerouslySetInnerHTML={{ __html: entry.contentHtml }} />
          {next && (
            <nav aria-label="Next entry" className="rule mt-20 pt-3 lg:ml-[16%]">
              <Link to={to(`journal/${next.handle}`)} className="group block">
                <span className="caption text-muted">Next entry</span>
                <span className="display mt-1 block text-[clamp(2.4rem,5vw,4rem)] group-hover:italic">{next.title}</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </article>
  )
}
