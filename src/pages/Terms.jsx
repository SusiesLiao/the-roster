import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'

// Plain-language terms of service.
// NOTE FOR SUSAN: have a professional review this before scaling past the founding 10.

const TERMS = [
  ['What The Roster is', 'A service that places an AI assistant ("Amber") in your Telegram to help with calendars, reminders, and personal logistics. Amber is an AI: capable, honest by design — and not a human, a lawyer, a doctor, or a financial advisor. Important decisions deserve your own judgment.'],
  ['Trials and billing', 'New clients get a 14-day free trial — no card required to start. Staying on costs the rate quoted in your invite (founding clients: $29/month, locked for as long as your subscription stays active). Billing is monthly via Stripe; cancel anytime through your billing portal link and you won\'t be charged again. Month already paid? It stays yours through the end of that period.'],
  ['Refunds', 'If a month went wrong on our side, email hello@theroster.studio — a human reads it, and we\'d rather refund a month than argue about one.'],
  ['Your part', 'Use Amber for your own personal or business logistics, not for anything unlawful, and don\'t attempt to abuse, reverse-engineer, or resell the service. You\'re responsible for the accuracy of what you ask her to act on.'],
  ['Calendar and account access', 'You grant access on your provider\'s own consent screens and can revoke it there at any time. Revoking access pauses those abilities; it doesn\'t end your subscription — the portal link does that.'],
  ['Honesty guarantee', 'Amber is built to never claim she\'s done something she hasn\'t. If she ever appears to, report it to hello@theroster.studio — that\'s a bug, and it\'s the kind we fix first.'],
  ['Limits of liability', 'Plainly: Amber helps you run your life, but you run your life. To the maximum extent the law allows, The Roster\'s liability for any claim is limited to the amount you paid us in the three months before the claim. We\'re not liable for missed events, third-party outages (Telegram, calendar providers), or decisions made on her suggestions.'],
  ['Ending things', 'You can cancel anytime (portal link), fire her in chat, and request full data deletion (hello@theroster.studio). We can suspend accounts that abuse the service or other people — with notice, except where the abuse makes that unreasonable.'],
  ['The fine print about this fine print', 'These terms are governed by the laws of California, USA. If we materially change them, Amber tells you in chat before the change applies to you. Operated by Susan Liao, dba The Roster, United States. Effective July 2026.'],
]

export default function Terms() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Avatar initial="A" size={80} />
          </div>
          <div className="eyebrow gold">Terms of service</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            The deal, in<br />plain <em>language.</em>
          </h1>
          <p className="lede" style={{ margin: '18px auto 0' }}>
            Nine short sections. If anything here surprises you, that's a failure on our side —
            tell us.
          </p>
        </div>

        {TERMS.map(([what, detail]) => (
          <div key={what} style={{ borderTop: '1px solid var(--hairline)', padding: '16px 0' }}>
            <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{what}</div>
            <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>{detail}</div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/privacy" className="btn btn-ghost">Privacy policy</Link>
          <Link to="/permissions" className="btn btn-ghost">Trust &amp; permissions</Link>
        </div>
      </div>
    </section>
  )
}
