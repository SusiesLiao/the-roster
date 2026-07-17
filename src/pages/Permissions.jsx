import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'

// The trust page. Plain-language answers to "what can she actually see?"
// Linked from the footer, Amber's profile, and Amber herself (she cites /permissions in chat).

const SECTIONS = [
  {
    title: 'What Amber can access — only after you grant it',
    rows: [
      ['Telegram chat', 'The conversation you have with her. That\'s how she works. She never sees your other Telegram chats — bots can\'t.', 'Delete the chat, or tell her to stop.'],
      ['Google Calendar', 'Your events — to brief you, spot conflicts, and (with your yes, every time) add or move things. Granted by you on Google\'s own consent screen.', 'Revoke anytime at myaccount.google.com/permissions — takes ten seconds.'],
      ['What you tell her', 'Facts she saves so you never repeat yourself — sizes, allergies, the babysitter\'s rate, who hates mushrooms. Stored per client, encrypted at rest.', 'Ask her "what do you know about me?" — or tell her to forget something. She will.'],
    ],
  },
  {
    title: 'What Amber can never see',
    rows: [
      ['Your email', 'No access. Not on this tier, and never without a separate, explicit grant from you.', ''],
      ['Passwords & payments', 'Never. She will never ask for a password, card number, or ID — if something claiming to be her ever does, it isn\'t her.', ''],
      ['Your contacts, photos, location', 'No access. She knows what you tell her, nothing more.', ''],
      ['Other clients', 'Every client\'s memory, calendar and conversation are fully isolated. Amber can\'t confuse you with anyone — architecturally, not just politely.', ''],
    ],
  },
]

export default function Permissions() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Avatar initial="A" size={80} />
          </div>
          <div className="eyebrow gold">Trust &amp; permissions</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
            What she sees.<br />What she <em>never</em> sees.
          </h1>
          <p className="lede" style={{ margin: '18px auto 0' }}>
            You're handing an assistant your family's logistics. You deserve the terms in plain
            language, not a 40-page policy. Here they are.
          </p>
        </div>

        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: 40 }}>
            <div className="eyebrow">{s.title}</div>
            {s.rows.map(([what, detail, revoke]) => (
              <div key={what} style={{ borderTop: '1px solid var(--hairline)', padding: '16px 0' }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{what}</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6 }}>{detail}</div>
                {revoke && <div style={{ fontSize: 12.5, color: 'var(--powder-deep)', marginTop: 6, fontWeight: 600 }}>To revoke: {revoke}</div>}
              </div>
            ))}
          </div>
        ))}

        <div className="notice">
          <strong>Ask her yourself.</strong> Any time, in chat: "what can you access?" — she answers
          honestly, with current status, because the answer comes from the actual connection records,
          not a script.
        </div>

        <div className="notice">
          <strong>Firing her.</strong> Say the word and she goes quietly: her access ends, and you can
          request full deletion of everything she knows at{' '}
          <a href="mailto:hello@theroster.studio?subject=Delete my data" style={{ textDecoration: 'underline', fontWeight: 600 }}>hello@theroster.studio</a>{' '}
          — handled by a human, confirmed to you when done.
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link to="/interview" className="btn btn-primary">Interview Amber — free</Link>
        </div>
      </div>
    </section>
  )
}
