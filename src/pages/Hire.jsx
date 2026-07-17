import { useEffect, useRef, useState } from 'react'
import Avatar from '../components/Avatar.jsx'

// Walkthrough of the paid onboarding — conversation, not forms.
// In production this runs post-Stripe with real OAuth + Telegram deep link.

const STEPS = [
  { amber: "You're officially my boss — love that for us. Three quick things and I'm fully yours. First: what should I call you, and roughly where in the world are your mornings?" },
  { amber: 'Noted. Kids, chaos, priorities — give me the one-line version. I fill in the rest as we go; you never have to brief me twice.' },
  {
    amber: "Perfect. Now the two taps I promised. Connect these and I'll prove myself immediately:",
    chips: [
      { id: 'gcal', label: 'Connect Google Calendar', done: 'Calendar connected' },
      { id: 'tg', label: 'Get me on Telegram', done: 'Telegram linked' },
    ],
  },
]

const PROOFS = {
  gcal: "Connected. I can see tomorrow already — three meetings and a 3:30 you'd have been late to. I'll brief you every morning at 7:00. Say 'earlier' or 'later' anytime.",
  tg: "Linked. Check your Telegram — I've already said hi. From here on, that's where you'll find me. This page is just my office.",
}

export default function Hire() {
  const [msgs, setMsgs] = useState([])
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [connected, setConnected] = useState({})
  const logRef = useRef(null)

  useEffect(() => {
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMsgs([{ from: 'amber', text: STEPS[0].amber }])
    }, 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

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

  function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || typing) return
    setInput('')
    advance(text)
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
        <strong>Beta walkthrough.</strong> This is exactly how hiring Amber works — as a conversation.
        Live hiring opens to the first 10 clients when the backend ships. Want a spot?{' '}
        <a href="mailto:hello@theroster.studio?subject=First 10 — hire Amber" style={{ textDecoration: 'underline', fontWeight: 600 }}>Claim one</a>.
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
                      <span className="st">{connected[c.id] ? '✓ live' : 'one tap'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && <div className="typing"><span /><span /><span /></div>}
          {allConnected && (
            <div className="gate">
              <h4>That's it. She's yours.</h4>
              <p>No settings to learn. No app to remember. Tomorrow at 7:00, your brief beats your alarm.</p>
            </div>
          )}
        </div>
        <form className="chat-input" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step >= 2 ? 'Tap the buttons above — or ask her anything' : 'Reply to Amber…'}
          />
          <button className="btn btn-primary" type="submit" disabled={typing}>Send</button>
        </form>
      </div>
    </div>
  )
}
