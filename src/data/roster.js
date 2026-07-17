export const AGENTS = [
  {
    id: 'amber',
    name: 'Amber',
    role: 'Senior Personal EA',
    status: 'available',
    spots: 10,
    avatarClass: '',
    initial: 'A',
    tagline: "A parent's second brain.",
    bio: "Calendar, email triage, reminders, and a proactive morning brief — Amber runs the invisible load so it stops living in your head. She messages you first.",
    tags: ['Morning brief', 'Calendar', 'Email triage', 'Family memory'],
    facts: {
      Seniority: 'Senior',
      Channel: 'Telegram + web',
      'Response time': 'Instant',
      Availability: '10 clients this month',
    },
    handles: [
      ['Proactive morning brief', 'your day, delivered before you ask — meetings, conflicts, reminders, what needs a decision.'],
      ['Calendar command', '"move my 3pm" — done. She spots conflicts before they happen.'],
      ['Email triage', 'what matters, what can wait, what she can draft for you.'],
      ['Family memory', 'the permission slip, the dentist, the thing you said three weeks ago. She keeps it.'],
      ['Weekly recap', 'a Friday card of everything she handled. You will want to show it off.'],
    ],
  },
  {
    id: 'pepper',
    name: 'Pepper',
    role: 'Chief of Staff',
    status: 'soon',
    avatarClass: 'slate',
    initial: 'P',
    tagline: 'Ops brain for teams.',
    bio: 'Currently embedded inside a real design studio, answering ops questions across projects, people and finance. Consumer placement opens after Amber.',
    tags: ['Team ops', 'Reporting', 'Projects'],
  },
  {
    id: 'next',
    name: 'Your call',
    role: 'The next hire',
    status: 'vote',
    avatarClass: 'dashed',
    initial: '?',
    tagline: 'Who should we train next?',
    bio: 'Travel planner? Money admin? Household ops? Tell us the role you would hire tomorrow and we will train them.',
    tags: ['You decide'],
  },
]

export const SAMPLE_BRIEF = `Morning. Here's Tuesday —

**9:00** dentist (you forgot, didn't you)
**11:30** call w/ Mia — she moved it twice, confirm or I chase
**15:30** school pickup · swim kit day

Nate's permission slip is due Friday — form's in your inbox, I flagged it. Two emails need you; the rest I filed. Coffee first though.`
