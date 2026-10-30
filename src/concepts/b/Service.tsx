import { Link, useParams } from 'react-router-dom'
import { isShopifyConfigured } from '@/shared/commerce'
import { legalHandles, splitSections } from '@/shared/content'
import { contactEmail } from '@/shared/data/house'
import { usePage } from '@/shared/lib/data'
import { useContactForm } from '@/shared/lib/forms'
import { useSeo } from '@/shared/lib/seo'
import { BagContents } from './Layout'
import NotFound from './NotFound'
import { ChapterHead, CONCEPT, Loading, Problem, to } from './ui'

function Contact() {
  const f = useContactForm()
  if (f.status === 'done')
    return (
      <p role="status" className="text-center text-[1.05rem]">
        Thank you. This form is a placeholder and isn’t connected yet, so nothing was sent. Please write to {contactEmail}.
      </p>
    )
  const input = (k: 'name' | 'email' | 'order', label: string, type = 'text', auto?: string) => (
    <div>
      <label htmlFor={`cb-c-${k}`} className="caps text-muted">
        {label}
      </label>
      <input id={`cb-c-${k}`} type={type} autoComplete={auto} value={f.fields[k]} onChange={(e) => f.set(k)(e.target.value)} aria-invalid={!!f.errors[k] || undefined} aria-describedby={f.errors[k] ? `cb-c-${k}-e` : undefined} className="field" />
      {f.errors[k] && (
        <p id={`cb-c-${k}-e`} className="mt-1 text-[0.9rem] text-accent">
          {f.errors[k]}
        </p>
      )}
    </div>
  )
  return (
    <form onSubmit={f.submit} noValidate className="grid gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        {input('name', 'Name', 'text', 'name')}
        {input('email', 'Email', 'email', 'email')}
      </div>
      {input('order', 'Order number (optional)')}
      <div>
        <label htmlFor="cb-c-message" className="caps text-muted">
          Message
        </label>
        <textarea id="cb-c-message" rows={5} value={f.fields.message} onChange={(e) => f.set('message')(e.target.value)} aria-invalid={!!f.errors.message || undefined} aria-describedby={f.errors.message ? 'cb-c-message-e' : undefined} className="field resize-y" />
        {f.errors.message && (
          <p id="cb-c-message-e" className="mt-1 text-[0.9rem] text-accent">
            {f.errors.message}
          </p>
        )}
      </div>
      <button type="submit" className="btn justify-self-center">
        Send
      </button>
    </form>
  )
}

export function Care() {
  useSeo({ title: 'Care & Service', description: 'Jewelry care, shipping, returns, questions, and contact.', concept: CONCEPT })
  const r = usePage('care')
  const sections = r.data ? splitSections(r.data.bodyHtml) : []
  return (
    <div className="px-5 pt-36 pb-[clamp(6rem,12vw,10rem)] sm:px-10">
      <ChapterHead as="h1" sub="For the life of every piece.">
        Care & Service
      </ChapterHead>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      <div className="mx-auto mt-20 max-w-[44rem]">
        {sections.map((s) => {
          const id = s.heading.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
          const faqs = s.heading === 'Questions' ? splitSections(s.html, 'h3') : null
          return (
            <section key={s.heading} id={id} aria-labelledby={`cb-${id}`} className="scroll-mt-24 border-t border-line py-12">
              <h2 id={`cb-${id}`} className="display text-center text-[clamp(1.9rem,4vw,2.8rem)]">
                {s.heading}
              </h2>
              {faqs ? (
                <div className="mt-8">
                  {faqs.map((q) => (
                    <details key={q.heading} className="border-b border-line">
                      <summary className="flex min-h-[56px] items-center justify-between gap-6">
                        <span className="text-[1.08rem]">{q.heading}</span>
                        <span className="marker text-accent" aria-hidden="true">
                          ›
                        </span>
                      </summary>
                      <div className="page-body pb-6 text-muted" dangerouslySetInnerHTML={{ __html: q.html }} />
                    </details>
                  ))}
                </div>
              ) : (
                <div className="page-body mt-8 text-[1.05rem] leading-[1.8] text-muted" dangerouslySetInnerHTML={{ __html: s.html }} />
              )}
            </section>
          )
        })}
        <section id="contact" aria-labelledby="cb-contact" className="scroll-mt-24 border-t border-line py-12">
          <h2 id="cb-contact" className="display text-center text-[clamp(1.9rem,4vw,2.8rem)]">
            Contact
          </h2>
          <p className="mt-3 mb-10 text-center text-muted">Write to {contactEmail}, or use the form.</p>
          <Contact />
        </section>
      </div>
    </div>
  )
}

export function BagPage() {
  useSeo({ title: 'Your bag', description: 'The pieces you have chosen.', concept: CONCEPT })
  return (
    <div className="px-5 pt-36 pb-[clamp(6rem,12vw,10rem)] sm:px-10">
      <ChapterHead as="h1">Your bag</ChapterHead>
      <div className="mx-auto mt-12 max-w-[34rem]">
        <BagContents />
      </div>
    </div>
  )
}

export function Checkout() {
  useSeo({ title: 'Checkout', description: 'Checkout is handled securely by Shopify.', concept: CONCEPT })
  return (
    <div className="px-5 pt-40 pb-32 text-center sm:px-10">
      <ChapterHead as="h1">Checkout</ChapterHead>
      <p className="mx-auto mt-8 max-w-[34rem] text-[1.05rem] text-muted">
        {isShopifyConfigured
          ? 'Your checkout should have opened on Shopify. If it didn’t, return to your bag and try again.'
          : 'In the finished site, checkout opens on Shopify, branded to match the house. This presentation runs on placeholder data, so there is nothing to pay for here.'}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to={to('bag')} className="btn">
          Back to your bag
        </Link>
        <Link to={to('heirlooms')} className="btn">
          Keep looking
        </Link>
      </div>
    </div>
  )
}

export function Legal() {
  const { handle = '' } = useParams()
  const known = (legalHandles as readonly string[]).includes(handle)
  const r = usePage(known ? handle : '__none__')
  useSeo({ title: r.data?.title ?? 'Legal', description: r.data?.summary ?? 'Policies of Jessi Frances LLC.', concept: CONCEPT })
  if (!known) return <NotFound />
  return (
    <div className="px-5 pt-36 pb-[clamp(6rem,12vw,10rem)] sm:px-10">
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.data && (
        <>
          <ChapterHead as="h1" sub={r.data.summary}>
            {r.data.title}
          </ChapterHead>
          <div className="page-body mx-auto mt-14 max-w-[40rem] text-[1.05rem] leading-[1.8] text-muted [&_h2]:display [&_h2]:mt-10 [&_h2]:text-[1.8rem] [&_h2]:text-ink" dangerouslySetInnerHTML={{ __html: r.data.bodyHtml }} />
        </>
      )}
    </div>
  )
}
