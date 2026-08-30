import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import { AGENTS } from '../data/roster.js'
import { appLink, APP_URL, SIGN_IN } from '../lib/app.js'

function TalentCard({ a }) {
  return (
    <div className={`talent-card ${a.status === 'available' ? 'available' : 'dim'}`}>
      {a.status === 'available' && (
        <span className={`badge ${a.spots ? 'spots' : 'trained'}`}>
          {a.spots ? `${a.spots} spots` : a.badgeText}
        </span>
      )}
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
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Hire goes to the app carrying the role, so the button does what it
              says instead of dropping you at a generic front door. */}
          <a href={appLink(a.hireIntent)} className="btn btn-primary btn-sm">Hire {a.name}</a>
          {/* Only Amber has a live interview on this site — roster-interview is
              her edge function. Offering one for Kevin would be a promise the
              server can't keep, so his card hires straight into the app. */}
          {a.interview
            ? <Link to="/interview" className="btn btn-ghost btn-sm">Interview {a.pronoun} — free</Link>
            : <span className="tc-price">{a.price}</span>}
        </div>
      )}
      {a.status === 'vote' && (
        /* Deliberately NOT a link into the app. The app can only offer roles
           that already exist; this card is by definition about one that
           doesn't, so it goes to the survey that captures it. */
        <Link to="/suggest-a-role" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
          Suggest a role
        </Link>
      )}
    </div>
  )
}

/* The seats shown inside the door — the app's actual first screen, not a
 * chat window. One filled, four open. Prices deliberately absent here: the
 * money is stated once, in words, under the buttons. */
const SEATS = [
  { av: 'A', who: 'Amber', job: 'Senior Personal EA', st: 'Hired' },
  { open: true }, { open: true }, { open: true }, { open: true },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">The Roster · A talent agency for AI employees</div>
          <h1 className="display">Meet your first<br /><em>AI employee.</em></h1>
          {/* The old lede sold one assistant in one channel: "a person-shaped
              hire who lives in your Telegram." The product is a roster now —
              several people, trained and named, whose jobs you write and whose
              reach you decide. Telegram is a window they work through, not the
              thing being sold. This is the same claim the app's own first
              screen makes, deliberately: one conversation, three surfaces. */}
          <p className="lede">
            We don’t give you tools to build an AI team — we build yours. Each one arrives
            trained and named, with the job already written. You change what you want,
            grant what you choose, and nothing is connected until you say so.
          </p>
          <div className="hero-ctas">
            <Link to="/interview" className="btn btn-primary">Interview Amber — free</Link>
            {/* The interview still leads: a live conversation converts harder
                than a signup form. The app door sits beside it, not instead. */}
            <a href={APP_URL} className="btn btn-ghost">Build your Roster →</a>
          </div>
          <div className="hero-note">No signup to start. No card for 14 days. Nothing connected until you say so.</div>
        </div>
      </section>

      {/* Concierge sits above the roster — 2026-08-03, deliberate. It is the tier
          the money is actually in for the next year, and it anchors the price of
          everything below it. The self-serve door still comes after the talent,
          where someone who has met the people needs a way in. */}
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
            <Link to="/apply" className="btn btn-gold">Apply</Link>
          </div>
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

      <section className="section" style={{ paddingTop: 0 }} id="your-roster">
        <div className="wrap">
          <div className="door">
            <div className="door-grid">
              <div>
                <div className="eyebrow">Your Roster</div>
                <h2>The floor where<br />they <em>actually work.</em></h2>
                <p className="door-sub">
                  theroster.studio is the agency — where you meet them.
                  {' '}<b>my.theroster.studio</b> is your Roster — where you build the team, name them,
                  write what each one is responsible for, and see exactly what they can reach.
                </p>
                <div className="door-ctas">
                  <a href={APP_URL} className="btn btn-primary">Open your Roster →</a>
                  <a href={SIGN_IN} className="btn btn-ghost">I already have one — sign in</a>
                </div>
                <div className="door-fine">
                  Free while you build. Your first hire starts a <b>14-day trial</b>, then <b>$39/mo
                  for the household</b> — up to five employees, however many you hire. Cancelled
                  from inside the app, not by emailing us.<br />
                  Nothing is connected by default. Every permission is granted one at a time, and
                  revoked the same way. <Link to="/permissions">How permissions work →</Link>
                </div>
              </div>
              <div>
                <div className="seatlist">
                  {SEATS.map((s, i) => (
                    <div className="seat" key={i}>
                      <div className={`seat-av${s.open ? ' open' : ''}`}>{s.open ? '+' : s.av}</div>
                      <div>
                        <div className={`seat-who${s.open ? ' open' : ''}`}>{s.open ? 'Open seat' : s.who}</div>
                        <div className="seat-job">{s.open ? 'Name the job' : s.job}</div>
                      </div>
                      <div className={`seat-st${s.open ? ' open' : ''}`}>{s.open ? 'Hire' : s.st}</div>
                    </div>
                  ))}
                </div>
                <div className="seat-caption">This is the first screen inside — your roster, not a chat window.</div>
              </div>
            </div>
          </div>

          <div className="strip">
            <div className="strip-t">
              <b>Already hired someone?</b> Your Roster lives at my.theroster.studio — sign in with the
              email you claimed it with.
            </div>
            <a href={SIGN_IN} className="btn btn-ghost btn-sm">Sign in</a>
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

    </>
  )
}
