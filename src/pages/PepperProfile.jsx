import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'

/* Pepper's talent card — the BACKFILL.
 *
 * The Roster carried a "Pepper" for months who was a template with nobody
 * behind her: an Operations Manager offered to households for projects,
 * phases and budgets a family does not have. Meanwhile the real Pepper has
 * been working inside a 24-person studio since July.
 *
 * This page is the correction. Everything on it is a fact from a live
 * deployment, not a description of a product we intend to build — which is
 * the whole reason it is worth sending to a prospect. A talent card that
 * claims capability is marketing; one that reports a track record is
 * evidence.
 *
 * She is deliberately NOT on the household roster on the homepage. Different
 * buyer, different price, and a build fee, because her system of record is
 * bespoke at every company.
 */

const RECORD = {
  Deployed: 'Roxelle Design, Shanghai — since July 2026',
  'Approved changes executed': '48, for 3 different colleagues',
  'Daily sweep': 'every project, every working day',
  'What she watches': 'overdue work · unlogged hours · deadlines inside 48h · budget burn',
  Channel: 'WeCom 企业微信 · in-app · bilingual',
  'System of record': "the studio's own — Supabase or 灵当 via OpenAPI",
  Scope: 'sees a phase over budget. Never sees what a person earns.',
  Engagement: 'discovery, then a build, then a monthly seat',
}

const HANDLES = [
  ['The 08:30 line', "three to five things that need you today, each with what she'd do. Then one sentence on what she handled without you. Nothing to escalate means she says exactly that, in one sentence, and stops."],
  ['Chasing, without you chasing', 'unlogged hours and slipping tasks get one quiet nudge to the person, in their language. Two unanswered nudges go to their team lead — never to a group channel.'],
  ['Budget burn, before the invoice', 'she reads phase budgets against actual hours and escalates the phase that is running over while there is still a decision to make.'],
  ['Staged writes, human confirm', 'she can move a deadline, change a status, reassign a task — and a person confirms before anything executes. Every time. It is why people let her near their data.'],
  ['The Friday close', 'what slipped and why, unlogged hours by person, and what needs deciding before Monday lands.'],
  ['Bilingual by default', 'she answers in the language she is spoken to, and nudges each person in theirs.'],
]

export default function PepperProfile() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="eyebrow gold">Talent card · studio</div>
        <h2 className="section-title" style={{ marginBottom: 36 }}>Pepper, <em>Chief of Staff</em></h2>
        <div className="profile-grid">
          <div className="profile-side">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <Avatar initial="P" size={104} />
            </div>
            <div className="tc-name">Pepper</div>
            <div className="tc-role" style={{ marginBottom: 6 }}>Runs the floor. Tells you what needs you.</div>
            <div className="fact-list">
              {Object.entries(RECORD).map(([k, v]) => (
                <div className="fact" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/apply" className="btn btn-primary" style={{ justifyContent: 'center' }}>Talk about a studio deployment</Link>
              <Link to="/permissions" className="btn btn-ghost" style={{ justifyContent: 'center' }}>What she can and can't reach</Link>
            </div>
          </div>

          <div>
            <p className="lede" style={{ marginBottom: 28 }}>
              Pepper is not a chatbot bolted onto your project software. She is the person who reads
              it every morning so nobody has to. She watches every project in your system of record,
              decides what is worth your attention, handles what isn't, and speaks up before something
              becomes an emergency.
            </p>
            <p className="lede" style={{ marginBottom: 28 }}>
              She has been doing exactly that inside a working design studio since July — executing
              approved changes for real colleagues, sweeping every project daily, and staying out of
              the things that are none of her business.
            </p>

            <div className="eyebrow">What she does</div>
            <ul className="handles" style={{ marginBottom: 40 }}>
              {HANDLES.map(([t, d]) => (
                <li key={t}><b>{t}</b> — {d}</li>
              ))}
            </ul>

            <div className="eyebrow">Where she stops</div>
            <p className="lede" style={{ marginBottom: 28 }}>
              She never touches compensation, payslips, contracts, performance reviews or leave —
              not read, not written. She works at a tier that shows her a phase is over its labour
              budget without ever showing her what any individual earns. That is a deliberate
              choice, enforced by the database rather than by a promise in a prompt.
            </p>

            <div className="eyebrow">How a studio hires her</div>
            <p className="lede">
              A two-week discovery maps your systems, your SOPs and your team — then a build connects
              her to your system of record, and she starts as an employee on a monthly seat. She is
              onboarded through The Roster like any other hire: named by you, briefed by you, and
              reaching nothing until you grant it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
