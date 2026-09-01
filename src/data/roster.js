export const AGENTS = [
  {
    id: 'amber',
    hireIntent: 'amber',
    interview: true,
    pronoun: 'her',
    name: 'Amber',
    role: 'Senior Personal EA',
    status: 'available',
    spots: 8,
    avatarClass: '',
    initial: 'A',
    tagline: "A parent's second brain.",
    bio: "Calendar command, reminders, lists, photo-reading and a proactive morning brief — Amber runs the invisible load so it stops living in your head. She messages you first.",
    tags: ['Morning brief', 'Calendar', 'Reminders', 'Photo reading', 'Email', 'Family memory'],
    facts: {
      Seniority: 'Senior',
      Channel: 'Telegram · Email',
      Email: 'amber@theroster.studio',
      'Response time': 'Instant',
      Rate: '$39/mo · 14-day trial · every teammate after her $18/mo',
      Availability: '8 clients this month',
    },
    handles: [
      ['Proactive morning brief', "your day, delivered before you ask — meetings, conflicts, reminders, what needs a decision. Say 'earlier' or 'later' and she moves it."],
      ['Calendar command', '"move my 3pm" — moved. She reads, adds, reschedules and cancels, and spots conflicts before they happen.'],
      ['Brain-dump routing', 'text her the chaos as it hits you. She sorts it into tasks, reminders and lists — filed, never lost, no format required.'],
      ['Reminders that chase', 'one-off or recurring — "swim kit every Tuesday" — timed to the minute and repeated until it\'s handled.'],
      ['Photo reading', 'snap the permission slip, the fridge-door schedule, the bill. She reads it and turns it into dates, reminders and to-dos.'],
      ['Her own email address', 'amber@theroster.studio — she sends real email on your behalf (you approve first), and replying to anything she sends lands straight back in your chat with her.'],
      ['Family memory', 'the permission slip, the dentist, the thing you said three weeks ago. She keeps it — you never brief her twice.'],
      ['Weekly rhythm', 'a Friday sweep of everything she handled, and a Sunday evening look at the week ahead — prepped before it hits you.'],
    ],
  },
  {
    id: 'pepper',
    name: 'Pepper',
    role: 'Operations Manager',
    status: 'soon',
    avatarClass: 'slate',
    initial: 'P',
    tagline: 'Ops brain for teams.',
    bio: 'Currently embedded inside a real design studio, answering ops questions across projects, people and finance. Consumer placement opens after Amber.',
    tags: ['Team ops', 'Reporting', 'Projects'],
  },
  {
    id: 'kevin',
    hireIntent: 'study',
    pronoun: 'him',
    name: 'Kevin',
    role: 'Study Buddy',
    status: 'available',
    badgeText: 'Ready now',
    avatarClass: 'moss',
    initial: 'K',
    tagline: 'Sits with one child. Never gives the answer.',
    bio: "He asks the question that moves them one step, stops at the time you set, and keeps a record of every session. If a child is stuck or says something that worries him, he raises it to you — out loud, in the thread, so the child knows.",
    tags: ['One child', 'Never answers for them', 'Reaches nothing', 'Session record', 'Flags it to you'],
    price: '$18/mo · one per child',
  },
  {
    id: 'next',
    name: 'Your call',
    role: 'The next hire',
    status: 'vote',
    avatarClass: 'dashed',
    initial: '?',
    tagline: 'Who should we train next?',
    bio: "Travel planner? Money admin? Household ops? Tell us the role you'd hire tomorrow and what you'd hand them on day one — we train the ones people actually ask for.",
    tags: ['You decide'],
  },
]

export const SAMPLE_BRIEF = `Morning. Here's Tuesday —

**9:00** dentist (you forgot, didn't you)
**11:30** call w/ Mia — she moved it twice, confirm or I chase
**15:30** school pickup · swim kit day

Nate's permission slip is due Friday — snap it to me and I'll track it. Two things need a decision from you; the rest I've filed. Coffee first though.`
