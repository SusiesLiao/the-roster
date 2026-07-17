import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import { AGENTS } from '../data/roster.js'

function TalentCard({ a }) {
  const card = (
    <div className={`talent-card ${a.status === 'available' ? 'available' : 'dim'}`}>
      {a.status === 'available' && <span className="badge spots">{a.spots} spots</span>}
      {a.status === 'soon' && <span className="badge soon">Joining soon</span>}
      <div className="tc-head">
        <Avatar initial={a.initial} variant={a.avatarClass} />
        <div>
          <div className="tc-name">{a.name}</div>
          <div className="tc-role">{a.role}</div>
        </div>
      </div>
      <p className="tc-bio"><strong style={{ color: 'var(--emphasis)' }}>{a.tagline}</strong> {a.bio}</p>
      <div className="tc-tags">{a.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      {a.status === 'available' && (
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/interview" className="btn btn-primary btn-sm">Interview her</Link>
          <Link to="/amber" className="btn btn-ghost btn-sm">Profile</Link>
        </div>
      )}
      {a.status === 'vote' && (
        <a href="mailto:hello@theroster.studio?subject=Train this role next" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
          Suggest a role
        </a>
      )}
    </div>
  )
  return card
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">The Roster · A talent agency for AI employees</div>
          <h1 className="display">Meet your first<br /><em>AI employee.</em></h1>
          <p className="lede">
            Not another app. A person-shaped hire who lives in your Telegram, learns your life,
            and messages you first. Interviewed, hired, and working for you in ten minutes.
          </p>
          <div className="hero-ctas">
            <Link to="/interview" className="btn btn-primary">Interview Amber — free</Link>
            <Link to="/amber" className="btn btn-ghost">See her talent card</Link>
          </div>
          <div className="hero-note">No signup to start. No credit card. She talks first.</div>
        </div>
      </section>

      <section className="section" id="roster">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow gold">The talent</div>
              <h2 className="section-title">On the roster</h2>
            </div>
          </div>
          <div className="roster-grid">
            {AGENTS.map((a) => <TalentCard key={a.id} a={a} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow">How hiring works</div>
          <h2 className="section-title" style={{ marginBottom: 30 }}>Three steps, <em>zero forms</em></h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">i.</div>
              <h3>Interview</h3>
              <p>Open a chat. She introduces herself, asks about your week, and shows you exactly what she'd take off your plate. Free, instant, no account needed to start.</p>
            </div>
            <div className="step-card">
              <div className="step-num">ii.</div>
              <h3>Hire</h3>
              <p>Onboarding is a conversation, not a form. She asks the questions; you tap two buttons to connect your calendar and Telegram. Each connection, she proves on the spot.</p>
            </div>
            <div className="step-card">
              <div className="step-num">iii.</div>
              <h3>She shows up</h3>
              <p>Within a minute she messages you first on Telegram — with tomorrow already handled. Every morning after that, your brief beats your alarm.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="band">
            <div>
              <div className="eyebrow gold" style={{ marginBottom: 8 }}>Concierge</div>
              <h2>The <em>white-glove</em> tier</h2>
              <p>
                School portals, family ops, done-for-you onboarding — the work no global AI tool will touch.
                Five families at a time, by application only.
              </p>
            </div>
            <a href="mailto:hello@theroster.studio?subject=Concierge application" className="btn btn-gold">Apply</a>
          </div>
        </div>
      </section>
    </>
  )
}
