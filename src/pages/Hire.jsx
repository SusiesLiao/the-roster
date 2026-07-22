import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'

// Two modes:
// 1. /hire            → the conversational walkthrough demo + waitlist
// 2. /hire?code=XXXX  → INVITE MODE: "Amber is expecting you" → one tap opens
//    Telegram with the code preloaded (t.me deep link). This is the link Susan emails.

const BOT = 'AmberRosterBot'

const STEPS = [
  {
    amber: "You're officially my boss — love that for us. Three quick things and I'm fully yours. First: what should I call you, and roughly where in the world are your mornings?",
    sample: 'Sam. Mornings in Shanghai — design firm, two kids.',
  },
  {
    amber: 'Noted. Kids, chaos, priorities — give me the one-line version. I fill in the rest as we go; you never have to brief me twice.',
    sample: "School runs, a team that pings at all hours, and a calendar I'm scared to open.",
  },
  {
    amber: "Perfect. Now the two taps I promised. In the live version these open real consent screens — here in the preview, they show you what happens next:",
    chips: [
      { id: 'gcal', label: 'Connect your calendar', done: 'Calendar step' },
      { id: 'tg', label: 'Get me on Telegram', done: 'Telegram step' },
    ],
  },
]

const PROOFS = {
  gcal: "In the real flow, that tap opens your calendar's own consent screen — Outlook / Microsoft 365 or Google. The moment you allow it, I message you tomorrow's actual schedule, including the conflict you haven't spotted yet. Your brief lands at 7:00 every morning; say 'earlier' or 'later' anytime.",
  tg: "And at this point the real me is already in your Telegram saying hi — first message within the minute. From then on, that's where you'll find me. This page is just my office.",
}

function InviteMode({ code }) {
  const deepLink = `https://t.me/${BOT}?start=${code}`
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Avatar initial="A" size={96} />
          </div>
          <div className="eyebrow gold">Private invite · {code}</div>
          <h1 className="display" style={{ fontSize: 'clamp(34px, 5vw, 52px)' }}>
            Amber is <em>expecting you.</em>
          </h1>
          <p className="lede" style={{ margin: '18px auto 0' }}>
            You're one of her first ten clients. No forms, no setup screens — she interviews you,
            connects to your calendar with two taps, and messages you first tomorrow morning.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
          <a href={deepLink} className="btn btn-primary" style={{ fontSize: 16, padding: '16px 34px' }}>
            Meet Amber on Telegram →
          </a>
        </div>

        <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
          <div className="step-card">
            <div className="step-num">i.</div>
            <h3 style={{ fontSize: 19 }}>Get Telegram</h3>
            <p>
              Don't have it? Two minutes, free —{' '}
              <a href="https://apps.apple.com/app/telegram-messenger/id686449807" style={{ textDecoration: 'underline' }}>iPhone</a>{' or '}
              <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" style={{ textDecoration: 'underline' }}>Android</a>.
              Then come back and tap the button above.
            </p>
          </div>
          <div className="step-card">
            <div className="step-num">ii.</div>
            <h3 style={{ fontSize: 19 }}>Tap Start</h3>
            <p>Telegram opens straight to Amber with your invite attached. Tap Start — she takes it from there, in plain conversation.</p>
          </div>
          <div className="step-card">
            <div className="step-num">iii.</div>
            <h3 style={{ fontSize: 19 }}>She proves it</h3>
            <p>Connect your calendar when she offers — she'll message you your real schedule within seconds, and your morning brief starts tomorrow.</p>
          </div>
        </div>

        <div className="notice" style={{ marginTop: 30, textAlign: 'center' }}>
          Your invite code is single-use and reserved for you. Stuck anywhere? Reply to your invite email — a human reads it.
        </div>
      </div>
    </section>
  )
}

export default function Hire() {
  const [params] = useSearchParams()
  const rawCode = (params.get('code') ?? '').trim().toUpperCase()
  const code = /^[A-Z0-9-]{4,24}$/.test(rawCode) ? rawCode : null

  const [msgs, setMsgs] = useState([])
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [connected, setConnected] = useState({})
  const logRef = useRef(null)

  useEffect(() => {
    if (code) return
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMsgs([{ from: 'amber', text: STEPS[0].amber }])
    }, 900)
    return () => clearTimeout(t)
  }, [code])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  if (code) return <InviteMode code={code} />

  function advance(userText) {
    setMsgs((m) => [...m, { from: 'user', text: userText }])
    const next = step + 1
    if (next < STEPS.length) {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMsgs((m) => [...m, { from: 'amber', text: STEPS[next].amber, chips: STEPS[next].chips }])
        setStep(next)
      }, 1000)
    }
  }

  // Typed text must NEVER advance the script with a canned acknowledgment —
  // that's a script pretending to listen ("That's not what I said" → "Perfect.").
  // The preview only truly hears taps; typing gets an honest answer instead.
  const HONEST = "Full honesty: on this page I'm a scripted preview — I can't actually read what you type here. The me that listens for real is one tap away: interview me (live AI, link up top) or claim a founding spot and I'm in your Telegram within the minute. To keep this tour rolling, tap the suggested reply below."

  function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || typing) return
    setInput('')
    setMsgs((m) => [...m, { from: 'user', text }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'amber', text: HONEST }])
    }, 900)
  }

  function connect(chip) {
    if (connected[chip.id]) return
    setConnected((c) => ({ ...c, [chip.id]: true }))
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'amber', text: PROOFS[chip.id] }])
    }, 1200)
  }

  const allConnected = connected.gcal && connected.tg

  return (
    <div className="wrap">
      <div className="notice" style={{ marginTop: 20, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
        <strong>This is a scripted preview</strong> of what day one feels like — nothing here is connected
        to anything real. (Want the real AI? <a href="/interview" style={{ textDecoration: 'underline', fontWeight: 600 }}>Interview her</a> — that one's live.)
        Hiring is invite-only — the first 10 clients this month.
        Want a spot?{' '}
        <a href="mailto:hello@theroster.studio?subject=First 10 — hire Amber" style={{ textDecoration: 'underline', fontWeight: 600 }}>Claim one</a>{' '}
        — or interview her first and she'll hold it for you.
      </div>
      <div className="chat-shell" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="chat-top">
          <Avatar initial="A" size={44} />
          <div className="who">
            <div className="n">Amber</div>
            <div className="r">Onboarding · day one</div>
          </div>
        </div>
        <div className="chat-log" ref={logRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.from}`}>
              {m.text}
              {m.chips && (
                <div className="chips">
                  {m.chips.map((c) => (
                    <button key={c.id} className={`chip ${connected[c.id] ? 'done' : ''}`} onClick={() => connect(c)}>
                      <span>{connected[c.id] ? c.done : c.label}</span>
                      <span className="st">{connected[c.id] ? '✓ shown' : 'preview'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && <div className="typing"><span /><span /><span /></div>}
          {!typing && STEPS[step].sample && msgs.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                onClick={() => advance(STEPS[step].sample)}
                className="chip"
                style={{ maxWidth: '82%', textAlign: 'right', cursor: 'pointer' }}
              >
                <span style={{ fontStyle: 'italic' }}>“{STEPS[step].sample}”</span>
                <span className="st">tap to reply</span>
              </button>
            </div>
          )}
          {allConnected && (
            <div className="gate">
              <h4>That's day one.</h4>
              <p>No settings to learn. No app to remember. In the live version, tomorrow at 7:00 your brief
              beats your alarm. Ready for the real thing?{' '}
              <a href="mailto:hello@theroster.studio?subject=First 10 — hire Amber" style={{ textDecoration: 'underline', fontWeight: 600 }}>Claim a founding spot</a>.</p>
            </div>
          )}
        </div>
        <form className="chat-input" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step >= 2 ? 'Tap the buttons above (typing here gets an honest answer)' : 'Tap the suggested reply — or type (she\'ll be honest)'}
          />
          <button className="btn btn-primary" type="submit" disabled={typing}>Send</button>
        </form>
      </div>
    </div>
  )
}
