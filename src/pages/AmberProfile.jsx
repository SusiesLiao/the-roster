import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import { AGENTS, SAMPLE_BRIEF } from '../data/roster.js'

const amber = AGENTS[0]

function Brief() {
  const html = SAMPLE_BRIEF.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return <div className="brief" dangerouslySetInnerHTML={{ __html: html }} />
}

export default function AmberProfile() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="eyebrow gold">Talent card · EA-02</div>
        <h2 className="section-title" style={{ marginBottom: 36 }}>Amber, <em>Senior Personal EA</em></h2>
        <div className="profile-grid">
          <div className="profile-side">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <Avatar initial="A" size={104} />
            </div>
            <div className="tc-name">Amber</div>
            <div className="tc-role" style={{ marginBottom: 6 }}>{amber.tagline}</div>
            <div className="fact-list">
              {Object.entries(amber.facts).map(([k, v]) => (
                <div className="fact" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/interview" className="btn btn-primary" style={{ justifyContent: 'center' }}>Interview Amber — free</Link>
              <Link to="/hire" className="btn btn-ghost" style={{ justifyContent: 'center' }}>How hiring works</Link>
            </div>
          </div>

          <div>
            <p className="lede" style={{ marginBottom: 28 }}>
              Amber is built for the person who runs everything — the calendar, the inbox, the school
              logistics, the mental load nobody else sees. She doesn't wait to be asked. She reads
              tomorrow before you do and tells you what actually needs you.
            </p>

            <div className="eyebrow">What she handles</div>
            <ul className="handles" style={{ marginBottom: 40 }}>
              {amber.handles.map(([t, d]) => (
                <li key={t}><span><strong>{t}</strong> — {d}</span></li>
              ))}
            </ul>

            <div className="eyebrow">Her 7am brief, in the wild</div>
            <div className="phone" style={{ marginTop: 14 }}>
              <div className="phone-head">
                <Avatar initial="A" size={30} />
                <div>
                  <div className="t">Amber</div>
                  <div className="s">online</div>
                </div>
              </div>
              <Brief />
            </div>

            <div className="notice" style={{ marginTop: 36 }}>
              <strong>Scope, honestly:</strong> Amber lives on Telegram and connects to your calendar —
              Outlook / Microsoft 365 (personal or work) or Google — granted on the provider's own consent
              screen, revocable by you anytime. She does <em>not</em> read your email: that's a future,
              separate grant, never a default. School-portal work (Seesaw and friends) is Concierge-tier
              only — it's handled by humans + Amber, and capped.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
