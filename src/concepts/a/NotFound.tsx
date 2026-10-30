import { Link } from 'react-router-dom'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, to } from './ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page could not be found.', concept: CONCEPT })
  return (
    <div className="px-4 py-[clamp(6rem,14vw,12rem)] sm:px-8">
      <div className="paper mx-auto max-w-[40rem] px-6 py-14 text-center sm:px-12" style={{ transform: 'rotate(-0.6deg)' }}>
        <h1 className="display text-[clamp(2.4rem,6vw,4rem)]">Returned to sender</h1>
        <p className="mt-4 text-[1.05rem] text-muted">There is no page at this address. It may have moved, or the link may be mistyped.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={to()} className="btn">
            Go to the home page
          </Link>
          <Link to={to('heirlooms')} className="btn btn-quiet">
            See the heirlooms
          </Link>
        </div>
      </div>
    </div>
  )
}
