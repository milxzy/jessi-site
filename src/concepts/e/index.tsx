import { useEffect, useRef, useState, type FormEvent } from 'react'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource/special-elite/400.css'
import { useWaitlist } from '@/shared/lib/mailchimp'
import { useSeo } from '@/shared/lib/seo'
import { Wordmark } from './Wordmark'
import './landing.css'

// design e, the landing page: a pre-launch waitlist and nothing else.
// the idea: the letter Jessica found is the page. her note is typed on a sheet, and the photograph beside it
// changes as each paragraph is read (the letter, the seal, the ring). the one thing to do is ask for the letters.

const BUTTON = 'Receive the letters from Jessi Frances'
const INCLUDES = 'Letters from Jessica, stories from The Frances Journal, and news from the house as we get ready to open.'

// placeholder destinations: they open each platform's home until the house's own handles are confirmed
const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
]

type Waitlist = ReturnType<typeof useWaitlist>

function Join({ id, w, from, onSend, note }: { id: string; w: Waitlist; from: string; onSend: (id: string) => void; note?: boolean }) {
  const thanks = useRef<HTMLDivElement>(null)
  const mine = from === id
  const done = w.status === 'done'
  const sending = w.status === 'sending'
  const failed = w.status === 'error' && mine

  // the form is replaced by the thank-you, so take the person there
  useEffect(() => {
    if (done && mine) thanks.current?.focus()
  }, [done, mine])

  if (done)
    return (
      <div ref={thanks} tabIndex={-1} className="ce-thanks" role={mine ? 'status' : undefined}>
        <p>{w.message}</p>
      </div>
    )

  const submit = (e: FormEvent) => {
    onSend(id)
    void w.submit(e)
  }
  const described = [failed ? `${id}-error` : '', note ? `${id}-note` : ''].filter(Boolean).join(' ') || undefined
  return (
    <form className="ce-form" onSubmit={submit} noValidate aria-busy={sending}>
      <label className="ce-sr" htmlFor={id}>
        Email address
      </label>
      <input
        id={id}
        name="EMAIL"
        type="email"
        inputMode="email"
        autoComplete="email"
        spellCheck={false}
        placeholder="Your email address"
        value={w.email}
        onChange={(e) => w.setEmail(e.target.value)}
        aria-invalid={failed || undefined}
        aria-describedby={described}
        className="ce-field"
      />
      <button type="submit" className="ce-button" disabled={sending}>
        {sending ? 'Sending…' : BUTTON}
      </button>
      {failed && (
        <p id={`${id}-error`} role="alert" className="ce-error">
          {w.message}
        </p>
      )}
      {note && (
        <p id={`${id}-note`} className="ce-includes">
          {INCLUDES}
        </p>
      )}
    </form>
  )
}

const photos = [
  { key: 'ribbon', src: '/landing/ribbon.jpg', w: 1248, h: 1728 },
  { key: 'seal', src: '/landing/seal.jpg', w: 1488, h: 1728 },
  { key: 'ring', src: '/landing/ring.jpg', w: 1536, h: 1728 },
] as const
type PhotoKey = (typeof photos)[number]['key']

export default function Landing() {
  useSeo({
    title: 'Receive the letters from Jessi Frances',
    description: 'Join the waitlist for Jessi Frances, a house of modern heirlooms. Letters from Jessica, stories from The Frances Journal, and news as the house gets ready to open.',
    concept: 'Landing page',
    image: '/landing/ribbon.jpg',
  })
  const w = useWaitlist()
  const [from, setFrom] = useState('')
  const [photo, setPhoto] = useState<PhotoKey>('ribbon')
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    el.dataset.js = ''

    // entrances: each part rises once as it arrives. nothing stays hidden if this never runs (see css).
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            reveal.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -3% 0px' },
    )
    el.querySelectorAll('.ce-reveal').forEach((n) => reveal.observe(n))

    // the photograph follows the letter: the last beat to pass the middle of the screen picks the picture.
    // measured on scroll (not with an observer) so a jump to any part of the page still lands on the right one.
    const beats = Array.from(el.querySelectorAll<HTMLElement>('[data-photo]'))
    let frame = 0
    const pick = () => {
      frame = 0
      const line = window.innerHeight * 0.55
      let current = beats[0]?.dataset.photo as PhotoKey
      for (const b of beats) if (b.getBoundingClientRect().top <= line) current = b.dataset.photo as PhotoKey
      setPhoto(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      reveal.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main ref={root} className="ce">
      <div className="ce-stage">
        <header className="ce-head">
          <Wordmark className="ce-wordmark" />
          <p className="ce-house">A House of Modern Heirlooms</p>
        </header>

        <section className="ce-hero" data-photo="ribbon" aria-labelledby="ce-title">
          <h1 id="ce-title" className="ce-title">
            <span>Tell Your</span> <span>Story.</span>
          </h1>
          <p className="ce-sub">
            <span>For the woman you are.</span> <span>And the woman you’re becoming.</span>
          </p>
          <div className="ce-join">
            <Join id="ce-email" w={w} from={from} onSend={setFrom} note />
          </div>
        </section>

        <section className="ce-letter" aria-labelledby="ce-letter-title">
          <h2 id="ce-letter-title" className="ce-letter__title ce-reveal">
            A note from Jessica
          </h2>
          <div className="ce-sheet">
            <p className="ce-reveal" data-photo="seal">
              I was 29 when I found a letter my grandmother Frances had written before I was born.
            </p>
            <p className="ce-reveal" data-photo="seal">
              Reading her words made me think about what we leave for the women who come after us. Jessi Frances grew from that thought.
            </p>
            <p className="ce-reveal" data-photo="ring">
              I wanted to make pieces you could wear through your own life and one day pass along with a story only you could tell.
            </p>
            <p className="ce-sign ce-reveal" data-photo="ring">
              With love,
              <span className="ce-sign__name">Jessica</span>
            </p>
          </div>
        </section>

        <div className="ce-photo" aria-hidden="true">
          {photos.map((p) => (
            <img key={p.key} src={p.src} width={p.w} height={p.h} alt="" className={p.key === photo ? 'is-on' : undefined} decoding="async" />
          ))}
        </div>
      </div>

      <footer className="ce-foot">
        <Wordmark className="ce-foot__mark ce-reveal" />
        <div className="ce-foot__row ce-reveal">
          <p className="ce-foot__house">A House of Modern Heirlooms</p>
          <ul className="ce-foot__social">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Jessi Frances on ${s.label} (opens in a new tab)`}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="ce-foot__legal">© 2026 Jessi Frances</p>
        </div>
      </footer>
    </main>
  )
}
