import { Link, useParams } from 'react-router-dom'
import { isShopifyConfigured } from '@/shared/commerce'
import { legalHandles, splitSections } from '@/shared/content'
import { contactEmail } from '@/shared/data/house'
import { usePage } from '@/shared/lib/data'
import { useContactForm } from '@/shared/lib/forms'
import { useSeo } from '@/shared/lib/seo'
import { BagContents } from './Layout'
import NotFound from './NotFound'
import { CONCEPT, Loading, Problem, roman, Title, to } from './ui'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

function Contact() {
  const f = useContactForm()
  if (f.status === 'done')
    return (
      <p role="status" className="plate p-6">
        Received, {f.fields.name.split(' ')[0]}. This form is a placeholder and isn’t connected yet, so nothing was sent. Please write to {contactEmail}.
      </p>
    )
  const input = (k: 'name' | 'email' | 'order', label: string, type = 'text', auto?: string) => (
    <div>
      <label htmlFor={`cc-c-${k}`} className="caption block">
        {label}
      </label>
      <input id={`cc-c-${k}`} type={type} autoComplete={auto} value={f.fields[k]} onChange={(e) => f.set(k)(e.target.value)} aria-invalid={!!f.errors[k] || undefined} aria-describedby={f.errors[k] ? `cc-c-${k}-e` : undefined} className="field mt-1" />
      {f.errors[k] && (
        <p id={`cc-c-${k}-e`} className="caption mt-1 text-accent">
          {f.errors[k]}
        </p>
      )}
    </div>
  )
  return (
    <form onSubmit={f.submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {input('name', 'Name', 'text', 'name')}
        {input('email', 'Email', 'email', 'email')}
      </div>
      {input('order', 'Order number (optional)')}
      <div>
        <label htmlFor="cc-c-message" className="caption block">
          Message
        </label>
        <textarea id="cc-c-message" rows={6} value={f.fields.message} onChange={(e) => f.set('message')(e.target.value)} aria-invalid={!!f.errors.message || undefined} aria-describedby={f.errors.message ? 'cc-c-message-e' : undefined} className="field mt-1 resize-y" />
        {f.errors.message && (
          <p id="cc-c-message-e" className="caption mt-1 text-accent">
            {f.errors.message}
          </p>
        )}
      </div>
      <button type="submit" className="btn justify-self-start">
        <span>Send message</span>
      </button>
    </form>
  )
}

export function Care() {
  useSeo({ title: 'Care & Service', description: 'Jewelry care, shipping, returns, questions, and contact.', concept: CONCEPT })
  const r = usePage('care')
  const sections = r.data ? splitSections(r.data.bodyHtml) : []
  const toc = [...sections.map((s) => s.heading), 'Contact']
  return (
    <div className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Section V" sub="A small manual for the life of each piece.">
        Care & Service
      </Title>
      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <nav aria-label="Contents" className="md:col-span-2">
          <ol className="caption md:sticky md:top-20">
            {toc.map((h, i) => (
              <li key={h} className="inline md:block">
                <a href={`#${slug(h)}`} className="link mr-3 inline-flex min-h-[32px] items-center md:mr-0">
                  {roman[i]}. {h}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="space-y-14 md:col-span-9 md:col-start-4">
          {r.status === 'loading' && <Loading />}
          {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
          {sections.map((s, i) => {
            const id = slug(s.heading)
            const faqs = s.heading === 'Questions' ? splitSections(s.html, 'h3') : null
            return (
              <section key={s.heading} id={id} aria-labelledby={`cc-${id}`} className="rule scroll-mt-20 grid gap-4 pt-3 lg:grid-cols-9">
                <h2 id={`cc-${id}`} className="display text-[clamp(2.2rem,4vw,3.4rem)] lg:col-span-4">
                  <span className="caption mr-3 align-top">{roman[i]}</span>
                  {s.heading}
                </h2>
                <div className="lg:col-span-5">
                  {faqs ? (
                    faqs.map((q) => (
                      <details key={q.heading} className="rule-soft first:border-t-0">
                        <summary className="flex min-h-[48px] items-center justify-between gap-4">
                          <span>{q.heading}</span>
                          <span className="sign caption" aria-hidden="true" />
                        </summary>
                        <div className="page-body caption pb-4 !text-[0.92rem] text-muted" dangerouslySetInnerHTML={{ __html: q.html }} />
                      </details>
                    ))
                  ) : (
                    <div className="page-body text-[1.05rem] leading-[1.7]" dangerouslySetInnerHTML={{ __html: s.html }} />
                  )}
                </div>
              </section>
            )
          })}
          <section id="contact" aria-labelledby="cc-contact" className="rule scroll-mt-20 grid gap-4 pt-3 lg:grid-cols-9">
            <div className="lg:col-span-4">
              <h2 id="cc-contact" className="display text-[clamp(2.2rem,4vw,3.4rem)]">
                <span className="caption mr-3 align-top">{roman[sections.length]}</span>
                Contact
              </h2>
              <p className="caption mt-2 text-muted">Or write to {contactEmail}.</p>
            </div>
            <div className="lg:col-span-5">
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
    <div className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Bag">Your bag</Title>
      <div className="mt-10 max-w-[36rem] md:ml-[16.66%]">
        <BagContents />
      </div>
    </div>
  )
}

export function Checkout() {
  useSeo({ title: 'Checkout', description: 'Checkout is handled securely by Shopify.', concept: CONCEPT })
  return (
    <div className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      <Title n="Checkout" sub={isShopifyConfigured ? 'Your checkout should have opened on Shopify. If it didn’t, return to your bag and try again.' : 'In the finished site, checkout opens on Shopify, branded to match the house. This presentation runs on placeholder data, so there is nothing to pay for here.'}>
        Checkout
      </Title>
      <div className="mt-10 flex flex-wrap gap-3 md:ml-[16.66%]">
        <Link to={to('bag')} className="btn">
          <span>Back to your bag</span>
        </Link>
        <Link to={to('heirlooms')} className="btn btn-line">
          <span>The catalogue</span>
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
    <div className="mx-auto max-w-[110rem] px-4 pt-10 sm:px-6 sm:pt-16">
      {r.status === 'loading' && <Loading />}
      {r.status === 'error' && <Problem message={r.error} retry={r.retry} />}
      {r.data && (
        <>
          <Title n="Legal" sub={r.data.summary}>
            {r.data.title}
          </Title>
          <div className="page-body mt-12 max-w-[40rem] text-[1.05rem] leading-[1.7] md:ml-[16.66%] [&_h2]:display [&_h2]:mt-8 [&_h2]:text-[2.2rem]" dangerouslySetInnerHTML={{ __html: r.data.bodyHtml }} />
        </>
      )}
    </div>
  )
}
