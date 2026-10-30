import { useEffect, useRef, useState, type RefObject } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

// true once the element has come into view. content is visible by default in css; this only adds a class.
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -12% 0px' }): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (!('IntersectionObserver' in window)) return setSeen(true)
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])
  return [ref, seen]
}

// 0 when the element's top meets the viewport top, 1 when it has scrolled one viewport past. rAF-throttled.
export function useScrollProgress<T extends HTMLElement>(enabled: boolean): [RefObject<T>, number] {
  const ref = useRef<T>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!enabled) return setP(0)
    let frame = 0
    const read = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(Math.min(1, Math.max(0, -r.top / window.innerHeight)))
    }
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [enabled])
  return [ref, p]
}
