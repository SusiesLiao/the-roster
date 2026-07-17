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
