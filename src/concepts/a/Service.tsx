import { Link, useParams } from 'react-router-dom'
import { isShopifyConfigured } from '@/shared/commerce'
import { legalHandles, splitSections } from '@/shared/content'
import { contactEmail } from '@/shared/data/house'
import { usePage } from '@/shared/lib/data'
import { useContactForm } from '@/shared/lib/forms'
import { useSeo } from '@/shared/lib/seo'
import { BagContents } from './Bag'
import NotFound from './NotFound'
import { CONCEPT, Heading, Loading, Problem, to } from './ui'

function Contact() {
  const f = useContactForm()
  if (f.status === 'done')
    return (
      <div role="status" className="paper p-8">
        <p className="serif text-[1.5rem]">Thank you, {f.fields.name.split(' ')[0]}.</p>
        <p className="mt-2 text-muted">This form is a placeholder and isn’t connected yet, so your note was not sent. For now, write to {contactEmail}.</p>
      </div>
    )
  const field = (k: 'name' | 'email' | 'order', label: string, type = 'text', auto?: string) => (
    <div>
      <label htmlFor={`ca-c-${k}`} className="block text-[0.95rem] text-muted">
        {label}
      </label>
      <input id={`ca-c-${k}`} name={k} type={type} autoComplete={auto} value={f.fields[k]} onChange={(e) => f.set(k)(e.target.value)} aria-invalid={!!f.errors[k] || undefined} aria-describedby={f.errors[k] ? `ca-c-${k}-e` : undefined} className="field" />
      {f.errors[k] && (
        <p id={`ca-c-${k}-e`} className="mt-1 text-[0.9rem]">
          {f.errors[k]}
        </p>
      )}
    </div>
  )
  return (
    <form onSubmit={f.submit} noValidate className="paper grid gap-6 p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        {field('name', 'Your name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
      </div>
      {field('order', 'Order number, if you have one')}
      <div>
        <label htmlFor="ca-c-message" className="block text-[0.95rem] text-muted">
          How can we help?
        </label>
        <textarea id="ca-c-message" name="message" rows={5} value={f.fields.message} onChange={(e) => f.set('message')(e.target.value)} aria-invalid={!!f.errors.message || undefined} aria-describedby={f.errors.message ? 'ca-c-message-e' : undefined} className="field resize-y" />
        {f.errors.message && (
          <p id="ca-c-message-e" className="mt-1 text-[0.9rem]">
            {f.errors.message}
          </p>
        )}
      </div>
      <div>
        <button type="submit" className="btn">
          Send your note
        </button>
      </div>
    </form>
  )
}

export function Care() {
  useSeo({ title: 'Care & Service', description: 'Caring for your jewelry, shipping, returns, questions, and how to reach the house.', concept: CONCEPT })
  const r = usePage('care')
  const sections = r.data ? splitSections(r.data.bodyHtml) : []
  return (
    <div className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <Heading as="h1" sub="Written to be kept, like the pieces themselves.">
          Care & Service
        </Heading>
        {r.status === 'loading' && <Loading />}
        {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
        <div className="mt-14 space-y-16">
          {sections.map((s) => {
            const id = s.heading.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
            const faqs = s.heading === 'Questions' ? splitSections(s.html, 'h3') : null
            return (
              <section key={s.heading} id={id} aria-labelledby={`ca-${id}`} className="grid scroll-mt-8 gap-6 border-t border-line pt-8 lg:grid-cols-12">
                <h2 id={`ca-${id}`} className="display text-[clamp(1.8rem,3.4vw,2.6rem)] lg:col-span-4">
                  {s.heading}
                </h2>
                <div className="lg:col-span-7 lg:col-start-6">
                  {faqs ? (
                    <div className="divide-y divide-line border-b border-line">
                      {faqs.map((q) => (
                        <details key={q.heading} className="py-2">
                          <summary className="flex min-h-[48px] items-center justify-between gap-4">
                            <span className="serif text-[1.2rem]">{q.heading}</span>
                            <span className="marker text-[1.4rem] leading-none" aria-hidden="true">+</span>
                          </summary>
                          <div className="page-body pb-4 text-muted" dangerouslySetInnerHTML={{ __html: q.html }} />
                        </details>
                      ))}
                    </div>
                  ) : (
                    <div className="page-body text-[1.06rem] leading-[1.7]" dangerouslySetInnerHTML={{ __html: s.html }} />
                  )}
                </div>
              </section>
            )
          })}
          <section id="contact" aria-labelledby="ca-contact" className="grid scroll-mt-8 gap-6 border-t border-line pt-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="ca-contact" className="display text-[clamp(1.8rem,3.4vw,2.6rem)]">
                Write to the house
              </h2>
              <p className="mt-3 text-muted">Or email {contactEmail}. We answer every note by hand.</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Contact />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export function BagPage() {
  useSeo({ title: 'Your bag', description: 'The pieces you have chosen.', concept: CONCEPT })
  return (
    <div className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[44rem]">
        <Heading as="h1">Your bag</Heading>
        <div className="paper mt-10 px-6 pb-8 sm:px-10">
          <BagContents />
        </div>
      </div>
    </div>
  )
}

export function Checkout() {
  useSeo({ title: 'Checkout', description: 'Checkout is handled securely by Shopify.', concept: CONCEPT })
  return (
    <div className="px-4 py-[clamp(5rem,12vw,10rem)] sm:px-8">
      <div className="paper mx-auto max-w-[40rem] px-6 py-12 sm:px-12">
        <h1 className="display text-[clamp(2.2rem,5vw,3.4rem)]">Checkout</h1>
        <p className="mt-5 text-[1.06rem] leading-relaxed">
          {isShopifyConfigured
            ? 'Your checkout should have opened on Shopify. If it didn’t, return to your bag and try again.'
            : 'In the finished site, this button opens Shopify’s secure checkout, branded to match the house. This presentation runs on placeholder data, so there is nothing to pay for here.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={to('bag')} className="btn">
            Back to your bag
          </Link>
          <Link to={to('heirlooms')} className="btn btn-quiet">
            Keep looking
          </Link>
        </div>
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
    <div className="px-4 pt-16 pb-[clamp(6rem,12vw,10rem)] sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[46rem]">
        {r.status === 'loading' && <Loading />}
        {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
        {r.status === 'ready' && r.data && (
          <>
            <Heading as="h1" sub={r.data.summary}>
              {r.data.title}
            </Heading>
            <div className="paper page-body mt-10 px-6 py-10 text-[1.06rem] leading-[1.7] sm:px-12 [&_h2]:serif [&_h2]:mt-8 [&_h2]:text-[1.5rem]" dangerouslySetInnerHTML={{ __html: r.data.bodyHtml }} />
          </>
        )}
      </div>
    </div>
  )
}
