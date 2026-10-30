import { Link } from 'react-router-dom'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, crop, to } from './ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page could not be found.', concept: CONCEPT })
  return (
    <div className="relative flex min-h-[90svh] items-center justify-center overflow-hidden px-5 text-center">
      <div aria-hidden="true" className="door-still is-on" style={crop('50% 88%', 4)} />
      <div aria-hidden="true" className="absolute inset-0 bg-ground/70" />
      <div className="relative">
        <p className="caps text-accent">Not found</p>
        <h1 className="display mt-5 text-[clamp(2.6rem,8vw,5.6rem)]">A door that isn’t there</h1>
        <p className="mx-auto mt-5 max-w-[30rem] text-muted">The page at this address doesn’t exist. It may have moved.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to={to()} className="btn btn-solid">
            Return home
          </Link>
          <Link to={to('heirlooms')} className="btn">
            The heirlooms
          </Link>
        </div>
      </div>
    </div>
  )
}
