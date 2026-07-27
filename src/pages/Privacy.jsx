import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'

// Plain-language privacy policy — same voice as /permissions.
// NOTE FOR SUSAN: email access is a material change — have a professional review this
// (esp. the email + data-minimization language) before scaling past the founding 10.

const SECTIONS = [
  {
    title: 'What we collect, and why',
    rows: [
      ['Your conversations with Amber', 'The Telegram messages you exchange with her — that\'s how she works for you. She never sees your other Telegram chats; bots can\'t.'],
      ['Your calendar, if you connect it', 'Read/write access to the calendar you choose (Outlook/Microsoft 365 or Google), granted by you on the provider\'s own consent screen and revocable there anytime. Used to brief you, spot conflicts, and make the changes you ask for.'],
      ['Your email, if you connect it', 'Read access to the mailbox you connect (Outlook/Microsoft 365 or Google), granted by you on the provider\'s own consent screen and revocable there anytime. Amber uses it to stay ahead of the logistics that land in your inbox — school notices, appointments, payments, deadlines. She reads for those; the rest of your inbox isn\'t her business (see "What we never do"). This is the difference between an assistant who\'s actually in the loop and one you have to forward everything to.'],
      ['What you tell her to remember', 'Facts you share — schedules, preferences, the babysitter\'s rate — stored per client so you never repeat yourself.'],
      ['Email you send us', 'Mail to @theroster.studio addresses (hello@, amber@) so we can reply and route it.'],
      ['Billing basics', 'Your payment is processed by Stripe. We never see or store your card number — Stripe sends us only confirmation that a subscription is active.'],
    ],
  },
  {
    title: 'What we never do',
    rows: [
      ['Sell your data', 'Never, to anyone, in any form.'],
      ['Advertise to you or track you', 'The site sets no advertising trackers and runs no third-party analytics.'],
      ['Mix clients together', 'Every client\'s memory, calendar access and conversation are isolated per account — architecturally, not just politely.'],
      ['Snoop beyond the job', 'When you connect your email, Amber surfaces the logistics — school, appointments, payments, deadlines — and leaves the rest alone. She never stores, sells, or trains AI on mail that isn\'t about running your life. Access to your inbox is not permission to mine it.'],
      ['Read what you didn\'t grant', 'Nothing you haven\'t connected. No contacts, no photos beyond what you send her, no location, no accounts you didn\'t link.'],
    ],
  },
  {
    title: 'Who touches your data to make Amber work',
    rows: [
      ['Anthropic (Claude)', 'The AI that powers Amber\'s thinking processes your messages to generate her replies.'],
      ['Supabase', 'Our database — where her memory of you and your connection records live, encrypted at rest.'],
      ['Telegram', 'The chat channel you talk to her on, under Telegram\'s own terms.'],
      ['Stripe', 'Payments and subscriptions.'],
      ['Resend', 'Sends and receives @theroster.studio email.'],
      ['Vercel', 'Hosts this website.'],
    ],
  },
]

export default function Privacy() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Avatar initial="A" size={80} />
          </div>
          <div className="eyebrow gold">Privacy policy</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            Your data, in<br />plain <em>language.</em>
          </h1>
          <p className="lede" style={{ margin: '18px auto 0' }}>
            The Roster (operated by Susan Liao, United States) is a service where an AI assistant
            works for you. That only works if you can trust exactly what we hold. Here it is —
            no 40 pages, no fog. Effective July 2026.
          </p>
        </div>

        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: 40 }}>
            <div className="eyebrow">{s.title}</div>
            {s.rows.map(([what, detail]) => (
              <div key={what} style={{ borderTop: '1px solid var(--hairline)', padding: '16px 0' }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{what}</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>{detail}</div>
              </div>
            ))}
          </div>
        ))}

        <div className="notice">
          <strong>How long we keep it.</strong> Amber's memory of you is kept while you're a client
          and after you lapse — so returning feels like rehiring someone who missed you, not starting
          over. You can end that anytime: revoke calendar or email access at your provider (that
          cuts her off instantly), and request full deletion of everything at{' '}
          <a href="mailto:hello@theroster.studio?subject=Delete my data" style={{ textDecoration: 'underline', fontWeight: 600 }}>hello@theroster.studio</a>.
          A human handles it and confirms when it's done.
        </div>

        <div className="notice">
          <strong>Your rights.</strong> Ask what we hold about you, correct it, export it, or delete
          it — one email to hello@theroster.studio does any of these. California residents: this is
          your CCPA request path too. We don't sell personal information, so there's nothing to opt
          out of selling.
        </div>

        <div className="notice">
          <strong>Changes.</strong> If this policy materially changes, Amber tells you in chat —
          not a silent edit to this page.
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link to="/permissions" className="btn btn-ghost">What Amber can &amp; can't see →</Link>
        </div>
      </div>
    </section>
  )
}
