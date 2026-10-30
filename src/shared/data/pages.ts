// mock versions of the owner-editable shopify pages. in shopify these are online store > pages,
// with the same handles. each h2 starts a section; in the care page each h3 inside "questions" is one faq.
// all of this copy is placeholder until the house confirms its policies.

export interface PageContent {
  handle: string
  title: string
  summary: string
  bodyHtml: string
}

export const mockPages: PageContent[] = [
  {
    handle: 'the-house',
    title: 'The House',
    summary: 'The founder’s story, Grandma Frances, and the philosophy of becoming.',
    // placeholder: the founder's own account of the house. keep it in her words when it arrives.
    bodyHtml: `<p>Placeholder for the founder’s story, in her own words: who she is, what Frances meant to her, and why she began the house. This text is edited in Shopify under Online Store, Pages, “The House”.</p>`,
  },
  {
    handle: 'care',
    title: 'Care & Service',
    summary: 'Caring for your jewelry, shipping, returns, and how to reach us.',
    bodyHtml: `<h2>Caring for your jewelry</h2>
<p>Placeholder: put your pieces on last and take them off first. Keep them away from perfume, lotion, chlorine and salt water.</p>
<p>Placeholder: polish with a soft, dry cloth. Store each piece in its pouch so the gold is not scratched by other jewelry.</p>
<p>Placeholder: detach your Chapters drop before sleeping, and check the small loop from time to time.</p>
<h2>Shipping</h2>
<p>Placeholder: orders ship insured and signature-required within the United States. International shipping to be confirmed.</p>
<p>Placeholder: preorders ship with the first collection in January 2027. Your confirmation email shows the expected date for each piece.</p>
<h2>Returns</h2>
<p>Placeholder: unworn pieces may be returned within 30 days of delivery, in their original packaging. Preorder terms to be confirmed.</p>
<h2>Questions</h2>
<h3>How do I find my huggie size?</h3>
<p>Placeholder: each product page has a fit guide. If you are between sizes, choose the larger, or write to us and we will help.</p>
<h3>Can I wear The First Huggie without a drop?</h3>
<p>Yes. It is designed to be beautiful on its own.</p>
<h3>Do Chapters fit other earrings?</h3>
<p>Placeholder: Chapters are made for The First Huggie. We cannot promise a fit with other pieces.</p>
<h3>When will my preorder arrive?</h3>
<p>Placeholder: preorders ship with the first collection in January 2027. We will email you before your piece ships.</p>
<h2>Future services</h2>
<p>The house hopes to offer more ways to care for your pieces over a lifetime. Details will be shared when they are ready, not before.</p>`,
  },
  {
    handle: 'shipping-returns',
    title: 'Shipping & Returns',
    summary: 'How and when your order travels, and how to send it back.',
    bodyHtml: `<p>Placeholder: the full shipping and returns policy will be published here. In Shopify, this can be your store’s refund and shipping policies, or a page with this handle.</p>
<h2>Shipping</h2><p>Placeholder: insured, signature-required shipping within the United States.</p>
<h2>Returns</h2><p>Placeholder: 30 days from delivery for unworn pieces.</p>`,
  },
  {
    handle: 'privacy',
    title: 'Privacy',
    summary: 'How Jessi Frances LLC handles your information.',
    bodyHtml: `<p>Placeholder: Jessi Frances LLC’s privacy policy will be published here before launch. It should cover what we collect at checkout and signup, how Shopify processes payments, cookies and analytics, and how to ask for your data to be deleted.</p>`,
  },
  {
    handle: 'terms',
    title: 'Terms',
    summary: 'The terms of using this site and buying from the house.',
    bodyHtml: `<p>Placeholder: terms of service for Jessi Frances LLC will be published here before launch, including preorder terms, pricing, and governing law.</p>`,
  },
]
