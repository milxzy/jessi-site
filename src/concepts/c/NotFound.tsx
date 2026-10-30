import { Link } from 'react-router-dom'
import { useSeo } from '@/shared/lib/seo'
import { CONCEPT, Title, to } from './ui'

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page could not be found.', concept: CONCEPT })
  return (
    <div className="mx-auto max-w-[110rem] px-4 pt-10 pb-20 sm:px-6 sm:pt-16">
      <Title n="Not found" sub="There is no record at this address. It may have been moved, or never catalogued.">
        Missing from the archive
      </Title>
      <div className="mt-10 flex flex-wrap gap-3 md:ml-[16.66%]">
        <Link to={to()} className="btn">
          <span>Return to the index</span>
        </Link>
        <Link to={to('heirlooms')} className="btn btn-line">
          <span>The catalogue</span>
        </Link>
      </div>
    </div>
  )
}
