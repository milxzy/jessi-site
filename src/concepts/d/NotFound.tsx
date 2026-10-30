import { Link } from 'react-router-dom'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Head, to } from './ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page could not be found.', concept: CONCEPT })
  return (
    <div className="mx-auto max-w-[34rem] px-5 py-[clamp(4rem,12vw,8rem)] text-center sm:px-8">
      <svg aria-hidden="true" viewBox="0 0 20 30" className="mx-auto h-12 w-8 text-accent">
        <path d="M10 1a7 7 0 0 1 4 12.7L17 29H3l3-15.3A7 7 0 0 1 10 1Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <div className="mt-6">
        <Head as="h1" sub="This door doesn’t open to anything. The page may have moved.">
          Not this room
        </Head>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to={to()} className="btn">
          Return home
        </Link>
        <Link to={to('heirlooms')} className="btn btn-soft">
          The heirlooms
        </Link>
      </div>
    </div>
  )
}
