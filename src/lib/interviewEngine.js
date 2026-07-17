// Mock interview engine — scripted Amber, used until the `interview` edge
// function is deployed. Swap by setting VITE_API_URL; see api.js.
// Voice source: AI Employees/Amber/Soul/AMBER_VOICE.md — cheeky, elegant, sincere. Never corporate.

const OPENER =
  "Hi — I'm Amber. This is an interview, but honestly it's mostly me interviewing you. What does the chaos look like this week — work, kids, both?"

const SCRIPT = [
  (input) =>
    `Okay, noted${input.length > 60 ? ' — and that was one breath, which tells me plenty' : ''}. Here's what I'd do with that: I take the calendar, the reminders, and the "don't let me forget" pile off your head entirely. You'd wake up to a brief from me instead of a knot in your stomach. What's the one thing that slips through most — appointments, emails, or school stuff?`,
  () => ({
    text: "That one's my specialty. Here's roughly what tomorrow would look like if you hired me today:",
    brief: true,
    followup: "That arrives every morning before your coffee's ready. I also watch the inbox and nudge you when something actually needs you. Want to know what I don't do? Wait to be asked.",
  }),
  () =>
    "Fair warning — this is where the free interview gets interesting. If you hire me, we go straight to a proper onboarding: I ask you a few real questions, you tap two buttons to connect your calendar and Telegram, and I message you first within the minute. No forms. Ever.",
  () =>
    "I could keep charming you, but I'd rather prove it. Hire me and the first thing you get is tomorrow, handled. Or keep asking — I'm patient. Mostly.",
]

export function amberOpener() {
  return OPENER
}

export function amberReply(turn, input) {
  const step = SCRIPT[Math.min(turn, SCRIPT.length - 1)]
  const out = step(input || '')
  return typeof out === 'string' ? { text: out } : out
}

export const FREE_GATE_AT = 3 // anonymous messages before soft signup gate
