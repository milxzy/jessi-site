import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// new page starts at the top. a #hash waits briefly for its section, since most content loads async.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const id = decodeURIComponent(hash.slice(1))
    const timer = window.setInterval(() => {
      const el = document.getElementById(id)
      if (el || ++tries > 20) {
        window.clearInterval(timer)
        el?.scrollIntoView({ block: 'start' })
      }
    }, 100)
    return () => window.clearInterval(timer)
  }, [pathname, hash])
  return null
}
