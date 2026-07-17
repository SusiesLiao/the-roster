import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import { SAMPLE_BRIEF } from '../data/roster.js'
import { amberOpener, amberReply, FREE_GATE_AT } from '../lib/interviewEngine.js'
import { interviewReply, joinWaitlist } from '../lib/api.js'

function BriefEmbed() {
  const html = SAMPLE_BRIEF.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return <div className="brief-embed" dangerouslySetInnerHTML={{ __html: html }} />
}

function renderText(text) {
  // Light markdown: **bold** only — Amber's briefs use it.
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p
  )
}

export default function Interview() {
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [turn, setTurn] = useState(0)          // mock-engine turn counter
  const [live, setLive] = useState(true)        // real backend until it fails
  const [gated, setGated] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const sessionRef = useRef(
    (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-fallback`
  )
  const logRef = useRef(null)

  useEffect(() => {
    // Amber talks first — the whole point.
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMsgs([{ from: 'amber', text: amberOpener() }])
    }, 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, gated])

  async function send(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || typing || gated) return
    setInput('')
    const nextMsgs = [...msgs, { from: 'user', text }]
    setMsgs(nextMsgs)
    setTyping(true)

    if (live) {
      try {
        const history = nextMsgs.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }))
        const data = await interviewReply(sessionRef.current, history)
        setTyping(false)
        setMsgs((m) => [...m, { from: 'amber', text: data.reply }])
        if (data.capped || data.remaining <= 0) setTimeout(() => setGated(true), 900)
        return
      } catch {
        setLive(false) // backend not up (or hiccuped) — glide onto the scripted rails
      }
    }

    setTimeout(() => {
      const reply = amberReply(turn, text)
      setTyping(false)
      setMsgs((m) => [...m, { from: 'amber', text: reply.text, brief: reply.brief }])
      if (reply.followup) {
        setTimeout(() => setMsgs((m) => [...m, { from: 'amber', text: reply.followup }]), 1400)
      }
      const nextTurn = turn + 1
      setTurn(nextTurn)
      if (nextTurn >= FREE_GATE_AT) setTimeout(() => setGated(true), reply.followup ? 2600 : 1200)
    }, 1100 + Math.random() * 700)
  }

  async function holdSpot() {
    if (!email.includes('@')) return
    try {
      await joinWaitlist(email, gated ? 'interview-gate' : 'interview')
    } catch {
      /* write-only table may not exist yet in beta — the email intent still matters, don't block the UI */
    }
    setEmailSent(true)
  }

  return (
    <div className="wrap">
      <div className="chat-shell">
        <div className="chat-top">
          <Avatar initial="A" size={44} />
          <div className="who">
            <div className="n">Amber</div>
            <div className="r">Senior Personal EA · interviewing</div>
          </div>
          <Link to="/hire" className="btn btn-gold btn-sm">Hire Amber →</Link>
        </div>

        <div className="chat-log" ref={logRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.from}`}>
              {renderText(m.text)}
              {m.brief && <BriefEmbed />}
            </div>
          ))}
          {typing && <div className="typing"><span /><span /><span /></div>}
          {gated && (
            <div className="gate">
              <h4>She'll hold you a spot</h4>
              <p>Hiring opens to the first 10 clients this month. Leave your email and Amber finds you the moment it does.</p>
              {emailSent ? (
                <p style={{ color: 'var(--moss)', fontWeight: 600 }}>Spot held. She doesn't forget.</p>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && holdSpot()}
                  />
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={holdSpot}>
                    Hold my spot
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <form className="chat-input" onSubmit={send}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={gated ? 'Interview wrapped — grab your spot above' : 'Tell her about your week…'}
            disabled={gated}
            autoFocus
          />
          <button className="btn btn-primary" type="submit" disabled={gated || typing}>Send</button>
        </form>
      </div>
    </div>
  )
}
