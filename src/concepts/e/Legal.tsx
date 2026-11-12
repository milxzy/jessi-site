import { Link } from 'react-router-dom'
import '@fontsource/instrument-serif/400.css'
import '@fontsource-variable/hanken-grotesk'
import { useSeo } from '@/shared/lib/seo'
import { Wordmark } from './Wordmark'
import './landing.css'

// the landing page's legal pages. TEMPLATE TEXT: have a lawyer review it, and fill every [bracket] before launch.
const COMPANY = 'Jessi Frances LLC'
const EMAIL = 'Jessica@jessifrances.com'
const STATE = 'Missouri'
const UPDATED = 'November 11, 2026'

function Privacy() {
  return (
    <>
      <h1 className="ce-legal__title">Privacy Policy</h1>
      <p className="ce-legal__date">Last updated {UPDATED}</p>
      <p>
        This policy explains what {COMPANY} (“Jessi Frances,” “we”) collects when you visit this website or join our mailing list, and what we do with it.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>Your email address,</strong> when you join the list. That is the only thing you give us. We use it to send you letters from Jessica, stories from The
        Frances Journal, and news about the house as it prepares to open.
      </p>
      <p>
        <strong>Basic technical data,</strong> such as your IP address, browser and device type, and the pages requested, which our hosting provider records in server
        logs to keep the site running and secure.
      </p>
      <p>We do not currently use advertising trackers or analytics cookies on this site. If that changes, we will update this policy first.</p>

      <h2>Who handles it</h2>
      <p>
        Your email address is stored and your emails are sent through Mailchimp (Intuit Inc.). Our site is hosted by a third-party hosting provider. These services process
        data only to provide their service to us. We do not sell your personal information, and we do not share it for advertising.
      </p>

      <h2>Unsubscribing and your choices</h2>
      <p>
        Every email has an unsubscribe link, and using it removes you from the list. You can also write to us at {EMAIL}. You may ask what information we hold about you,
        ask us to correct or delete it, or ask us to stop using it. Residents of California, Colorado, Connecticut, Virginia, and other states with privacy laws have
        these rights by law; we will honor them for everyone in the United States. We will reply within 45 days.
      </p>

      <h2>How long we keep it</h2>
      <p>We keep your email address until you unsubscribe or ask us to delete it. Server logs are kept for a short period, then deleted.</p>

      <h2>Children</h2>
      <p>This site is not directed to children under 13, and we do not knowingly collect their information. If you believe a child has joined the list, write to us and we will delete it.</p>

      <h2>Security</h2>
      <p>We use reputable services and encrypted connections, but no method of transmission or storage is completely secure.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we will post the new version here with a new date.</p>

      <h2>Contact</h2>
      <p>
        {COMPANY}
        <br />
        {EMAIL}
      </p>
    </>
  )
}

function Terms() {
  return (
    <>
      <h1 className="ce-legal__title">Terms of Use</h1>
      <p className="ce-legal__date">Last updated {UPDATED}</p>
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>

      <h2>This site</h2>
      <p>
        This is the pre-launch website of {COMPANY}. Nothing on it is an offer to sell. Products, prices, and dates described here may change before the house opens.
      </p>

      <h2>The mailing list</h2>
      <p>
        When you give us your email address, you agree to receive emails from us. You can unsubscribe at any time using the link in any email. Our{' '}
        <Link to="/privacy">Privacy Policy</Link> explains how we handle your information.
      </p>

      <h2>Ownership</h2>
      <p>
        The words, photographs, artwork, wordmark, and design on this site belong to {COMPANY} or are used with permission. Please do not copy, republish, or use them
        commercially without our written permission.
      </p>

      <h2>Your use of the site</h2>
      <p>Please do not misuse the site, attempt to disrupt it, or use it to break the law.</p>

      <h2>No warranty and limits on liability</h2>
      <p>
        The site is provided “as is,” without warranties of any kind. To the fullest extent the law allows, {COMPANY} is not liable for indirect or consequential damages
        arising from your use of the site.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of {STATE}, without regard to its conflict-of-law rules.</p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms by posting a new version here. Questions can be sent to {EMAIL}.
      </p>
    </>
  )
}

export default function Legal({ page }: { page: 'privacy' | 'terms' }) {
  const title = page === 'privacy' ? 'Privacy Policy' : 'Terms of Use'
  useSeo({ title: `${title} | Jessi Frances`, description: `${title} for Jessi Frances.`, concept: 'Landing page', image: '/landing/ribbon.jpg' })
  return (
    <main className="ce ce-legal">
      <header className="ce-legal__head">
        <Link to="/landing-page" aria-label="Jessi Frances, back to the home page">
          <Wordmark className="ce-wordmark" />
        </Link>
      </header>
      <article className="ce-legal__body">{page === 'privacy' ? <Privacy /> : <Terms />}</article>
      <footer className="ce-legal__foot">
        <Link to="/landing-page">Back to Jessi Frances</Link>
        <Link to={page === 'privacy' ? '/terms' : '/privacy'}>{page === 'privacy' ? 'Terms of Use' : 'Privacy Policy'}</Link>
      </footer>
    </main>
  )
}
