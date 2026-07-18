import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, INTERVIEW_FN } from './config.js'

// Real Amber via the roster-interview edge function.
// Throws on any failure — callers fall back to the scripted engine.
export async function interviewReply(sessionId, messages) {
  const res = await fetch(INTERVIEW_FN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ session_id: sessionId, messages }),
  })
  if (!res.ok) throw new Error(`interview_fn_${res.status}`)
  const data = await res.json()
  if (!data.reply) throw new Error('interview_fn_empty')
  return data // { reply, remaining, capped? }
}

// Streaming Amber: onDelta(textSoFar) fires as tokens arrive — first word <1s.
// Returns { reply, remaining }. Throws on failure so callers can fall back.
export async function interviewReplyStream(sessionId, messages, onDelta) {
  const res = await fetch(INTERVIEW_FN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ session_id: sessionId, messages, stream: true }),
  })
  if (!res.ok) throw new Error(`interview_fn_${res.status}`)
  const remaining = Number(res.headers.get('x-remaining') ?? '99')
  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    // capped or non-stream response
    const data = await res.json()
    if (!data.reply) throw new Error('interview_fn_empty')
    onDelta(data.reply)
    return { reply: data.reply, remaining: data.remaining ?? remaining, capped: data.capped }
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    full += decoder.decode(value, { stream: true })
    onDelta(full)
  }
  if (!full.trim()) throw new Error('interview_fn_empty_stream')
  return { reply: full.trim(), remaining }
}

// Waitlist: write-only insert guarded by RLS.
export async function joinWaitlist(email, source = 'interview') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/roster_waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ email, source }),
  })
  if (!res.ok) throw new Error(`waitlist_${res.status}`)
}
