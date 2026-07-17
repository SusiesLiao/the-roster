import { useSearchParams, Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import { SUPABASE_URL } from '../lib/config.js'

// The calendar picker. Amber sends clients here: /connect?chat_id=<their telegram chat id>
// One branded page instead of raw function URLs in chat. Providers link straight into OAuth.

export default function Connect() {
  const [params] = useSearchParams()
  const chatId = /^\d{4,20}$/.test(params.get('chat_id') ?? '') ? params.get('chat_id') : null

  if (!chatId) {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Avatar initial="A" size={80} />
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(30px, 5vw, 44px)' }}>This link needs to come <em>from Amber.</em></h1>
          <p className="lede" style={{ margin: '18px auto 0' }}>
            Ask her in Telegram to connect your calendar — she'll send you a personal link that lands here with everything wired up.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link to="/interview" className="btn btn-primary">Meet Amber first</Link>
          </div>
        </div>
      </section>
    )
  }

  const providers = [
    {
      key: 'google',
      name: 'Google Calendar',
      desc: 'Gmail and Google Workspace accounts. One tap, Google’s own consent screen.',
      href: `${SUPABASE_URL}/functions/v1/roster-google-oauth?chat_id=${chatId}`,
      live: true,
      initial: 'G',
      variant: '',
    },
    {
      key: 'microsoft',
      name: 'Outlook / Microsoft 365',
      desc: 'Outlook.com, Hotmail, Live, and work or school Microsoft accounts.',
      href: `${SUPABASE_URL}/functions/v1/roster-ms-oauth?chat_id=${chatId}`,
      live: true,
      initial: 'O',
      variant: 'slate',
    },
    {
      key: 'apple',
      name: 'Apple Calendar',
      desc: 'Coming soon. Tell Amber you’re an Apple family — the more who ask, the faster it ships.',
      live: false,
      initial: 'A',
      variant: 'gold',
    },
    {
      key: 'other',
      name: 'Something else',
      desc: 'Tell Amber what you use — she’ll note it, work around it, and you’ll hear when it’s supported.',
      live: false,
      initial: '?',
      variant: 'dashed',
    },
  ]

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 620 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Avatar initial="A" size={80} />
          </div>
          <div className="eyebrow gold">Two taps, then she proves it</div>
          <h1 className="display" style={{ fontSize: 'clamp(30px, 5vw, 46px)' }}>
            Where does your<br /><em>calendar live?</em>
          </h1>
          <p className="lede" style={{ margin: '16px auto 0' }}>
            Read and write, granted on your provider's own consent screen, revocable by you anytime.
            The moment you connect, Amber messages you your real schedule.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {providers.map((p) =>
            p.live ? (
              <a key={p.key} href={p.href} className="talent-card available" style={{ flexDirection: 'row', alignItems: 'center', gap: 18, padding: '20px 24px' }}>
                <Avatar initial={p.initial} variant={p.variant} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--emphasis)', fontSize: 16 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--slate)' }}>{p.desc}</div>
                </div>
                <span className="btn btn-primary btn-sm">Connect</span>
              </a>
            ) : (
              <div key={p.key} className="talent-card dim" style={{ flexDirection: 'row', alignItems: 'center', gap: 18, padding: '20px 24px' }}>
                <Avatar initial={p.initial} variant={p.variant} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--emphasis)', fontSize: 16 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--slate)' }}>{p.desc}</div>
                </div>
                <span className="badge soon" style={{ position: 'static' }}>Soon</span>
              </div>
            )
          )}
        </div>

        <div className="notice" style={{ marginTop: 28, textAlign: 'center' }}>
          What she can and can't see, in plain language: <Link to="/permissions" style={{ textDecoration: 'underline', fontWeight: 600 }}>trust &amp; permissions</Link>.
          Expect Google/Microsoft to show an "unverified app" caution during our invite-only beta — Advanced → Continue is the way through.
        </div>
      </div>
    </section>
  )
}
