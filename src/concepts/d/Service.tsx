import { Link, useParams } from 'react-router-dom'
import { isShopifyConfigured } from '@/shared/commerce'
import { legalHandles, splitSections } from '@/shared/content'
import { contactEmail } from '@/shared/data/house'
import { usePage } from '@/shared/lib/data'
import { useContactForm } from '@/shared/lib/forms'
import { useSeo } from '@/shared/lib/seo'
import { BagContents } from './Layout'
import NotFound from './NotFound'
import { CONCEPT, Head, Loading, Problem, to } from './ui'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

const Chev = () => (
  <svg aria-hidden="true" viewBox="0 0 12 8" className="chev h-2 w-3 shrink-0">
    <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

function Contact() {
  const f = useContactForm()
  if (f.status === 'done')
    return (
      <p role="status" className="rounded-[1.5rem] bg-opal p-6 text-center">
        Thank you, {f.fields.name.split(' ')[0]}. This form is a placeholder and isn’t connected yet, so your note wasn’t sent. Please write to {contactEmail}.
      </p>
    )
  const input = (k: 'name' | 'email' | 'order', label: string, type = 'text', auto?: string) => (
    <div>
      <label htmlFor={`cd-c-${k}`} className="mb-1.5 block pl-4 text-[0.95rem] text-muted">
        {label}
      </label>
      <input id={`cd-c-${k}`} type={type} autoComplete={auto} value={f.fields[k]} onChange={(e) => f.set(k)(e.target.value)} aria-invalid={!!f.errors[k] || undefined} aria-describedby={f.errors[k] ? `cd-c-${k}-e` : undefined} className="field" />
      {f.errors[k] && (
        <p id={`cd-c-${k}-e`} className="mt-1 pl-4 text-[0.9rem] text-accent">
          {f.errors[k]}
        </p>
      )}
    </div>
  )
  return (
    <form onSubmit={f.submit} noValidate className="grid gap-5">
      {input('name', 'Your name', 'text', 'name')}
      {input('email', 'Email', 'email', 'email')}
      {input('order', 'Order number, if you have one')}
      <div>
        <label htmlFor="cd-c-message" className="mb-1.5 block pl-4 text-[0.95rem] text-muted">
          How can we help?
        </label>
        <textarea id="cd-c-message" rows={5} value={f.fields.message} onChange={(e) => f.set('message')(e.target.value)} aria-invalid={!!f.errors.message || undefined} aria-describedby={f.errors.message ? 'cd-c-message-e' : undefined} className="field resize-y" />
        {f.errors.message && (
          <p id="cd-c-message-e" className="mt-1 pl-4 text-[0.9rem] text-accent">
            {f.errors.message}
          </p>
        )}
      </div>
      <button type="submit" className="btn">
        Send your note
      </button>
    </form>
  )
}

export function Care() {
  useSeo({ title: 'Care & Service', description: 'Jewelry care, shipping, returns, questions, and contact.', concept: CONCEPT })
  const r = usePage('care')
  const sections = r.data ? splitSections(r.data.bodyHtml) : []
  return (
    <div className="mx-auto max-w-[44rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <Head as="h1" sub="Here for every piece, for as long as you wear it.">
        Care & Service
      </Head>
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      <div className="mt-12 space-y-12">
        {sections.map((s) => {
          const id = slug(s.heading)
          const faqs = s.heading === 'Questions' ? splitSections(s.html, 'h3') : null
          return (
            <section key={s.heading} id={id} aria-labelledby={`cd-${id}`} className="scroll-mt-20">
              <h2 id={`cd-${id}`} className="display text-center text-[clamp(1.9rem,5vw,2.6rem)]">
                {s.heading}
              </h2>
              {faqs ? (
                <div className="mt-5 space-y-2">
                  {faqs.map((q) => (
                    <details key={q.heading} className="rounded-[1.25rem] bg-surface px-5">
                      <summary className="flex min-h-[56px] items-center justify-between gap-4">
                        <span>{q.heading}</span>
                        <Chev />
                      </summary>
                      <div className="page-body pb-5 text-muted" dangerouslySetInnerHTML={{ __html: q.html }} />
                    </details>
                  ))}
                </div>
              ) : (
                <div className="page-body mt-5 rounded-[1.5rem] bg-surface p-6 text-[1.02rem] leading-relaxed sm:p-8" dangerouslySetInnerHTML={{ __html: s.html }} />
              )}
            </section>
          )
        })}
        <section id="contact" aria-labelledby="cd-contact" className="scroll-mt-20">
          <h2 id="cd-contact" className="display text-center text-[clamp(1.9rem,5vw,2.6rem)]">
            Write to us
          </h2>
          <p className="mt-2 mb-6 text-center text-muted">Or email {contactEmail}.</p>
          <Contact />
        </section>
      </div>
    </div>
  )
}

export function BagPage() {
  useSeo({ title: 'Your bag', description: 'The pieces you have chosen.', concept: CONCEPT })
  return (
    <div className="mx-auto max-w-[34rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      <Head as="h1">Your bag</Head>
      <div className="mt-8">
        <BagContents />
      </div>
    </div>
  )
}

export function Checkout() {
  useSeo({ title: 'Checkout', description: 'Checkout is handled securely by Shopify.', concept: CONCEPT })
  return (
    <div className="mx-auto max-w-[34rem] px-5 pt-14 pb-24 text-center sm:px-8">
      <Head as="h1">Checkout</Head>
      <p className="mt-6 rounded-[1.5rem] bg-surface p-6 text-[1.02rem] leading-relaxed">
        {isShopifyConfigured
          ? 'Your checkout should have opened on Shopify. If it didn’t, return to your bag and try again.'
          : 'In the finished site, checkout opens on Shopify, branded to match the house. This presentation runs on placeholder data, so there is nothing to pay for here.'}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to={to('bag')} className="btn">
          Back to your bag
        </Link>
        <Link to={to('heirlooms')} className="btn btn-soft">
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
    <div className="mx-auto max-w-[40rem] px-5 pt-8 pb-[clamp(5rem,12vw,9rem)] sm:px-8 sm:pt-14">
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.data && (
        <>
          <Head as="h1" sub={r.data.summary}>
            {r.data.title}
          </Head>
          <div className="page-body mt-10 rounded-[1.5rem] bg-surface p-6 text-[1.02rem] leading-relaxed sm:p-8 [&_h2]:serif [&_h2]:mt-6 [&_h2]:text-[1.5rem]" dangerouslySetInnerHTML={{ __html: r.data.bodyHtml }} />
        </>
      )}
    </div>
  )
}
