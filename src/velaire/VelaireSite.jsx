import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SIGN_IN } from '../lib/app.js';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './velaire.css';
import { LanguageProvider, useLanguage, useT } from './i18n.jsx';
function Link({
  to,
  ...props
}) {
  const {
    search
  } = useLocation();
  const palette = import.meta.env.DEV ? new URLSearchParams(search).get('palette') : null;
  if (palette && typeof to === 'string' && to.startsWith('/')) {
    const url = new URL(to, window.location.origin);
    url.searchParams.set('palette', palette);
    to = url.pathname + url.search + url.hash;
  }
  return <RouterLink to={to} {...props} />;
}
const pages = {
  '/404': ["Page not found · Velaire", 'Find your way back to Velaire, Parti and Roster.'],
  '/': ["Velaire · Clearer operating systems", 'Velaire helps project-based businesses connect people, projects, time, cost and decisions through advisory, software and AI.'],
  '/advisory': ["Velaire Advisory · Operating Diagnostic", "A 4 to 6 week operating diagnostic for founder-led creative and project-based businesses. An Operating Blueprint and an implementation roadmap."],
  '/parti': ["Parti · The system of record · Velaire", 'Connect projects, people, time and economics. Understand what is happening inside your business, and why.'],
  '/roster': ["Roster · The system of action · Velaire", 'An AI workforce grounded in business context. Discover Roster and Roster Suite.'],
  '/about': ["Susan Liao · Founder · Velaire", 'Taste, systems thinking and the work of building a better-run business. Meet Velaire founder Susan Liao.'],
  '/contact': ["Start a conversation · Velaire", 'Tell us where your business feels harder to run than it should. Enquire about the Velaire Operating Diagnostic.']
};
const nav = [['Advisory', '/advisory'], ['Parti', '/parti'], ['Roster', '/roster'], ['About', '/about']];
const Label = ({
  children
}) => {
  const t = useT();
  return <p className="v-label">{t(children)}</p>;
};
const Action = ({
  to = '/contact?interest=diagnostic',
  children = 'Book an Operating Diagnostic',
  quiet = false
}) => {
  const t = useT();
  return <Link className={quiet ? 'v-link' : 'v-button'} to={to}>{t(children)}</Link>;
};
const SectionTitle = ({
  label,
  children,
  body
}) => {
  const t = useT();
  return <div className="v-section-title"><Label>{t(label)}</Label><h2>{t(children)}</h2>{t(body && <p>{t(body)}</p>)}</div>;
};
function PhotoSpace({
  detail = false
}) {
  const t = useT();
  return <figure className={`v-photo ${detail ? 'v-photo-detail' : ''}`}><img src={detail ? '/images/roxelle-stair-detail.jpeg' : '/images/roxelle-living-room.jpg'} alt={t(detail ? 'Overhead view through a curving Roxelle staircase with suspended glass lights.' : 'Light-filled Roxelle living room with sheer curtains, sculptural seating and layered textiles.')} width={detail ? 768 : 1350} height={detail ? 1024 : 1800} loading={detail ? 'lazy' : 'eager'} fetchpriority={detail ? 'auto' : 'high'} /><figcaption><span>{t("ROXELLE / SELECTED WORK")}</span><span>{t(detail ? 'The detail and the whole.' : 'Design, made real.')}</span></figcaption></figure>;
}
function Family() {
  const t = useT();
  return <section className="v-section v-container" id="system"><SectionTitle label={t("One house. Three connected layers.")} body={t("Understand the business. Give it structure. Help it act.")}>{t("Better work begins")}<br />{t("with a clearer system.")}</SectionTitle><div className="v-family">
    <article><Label>{t("01 / The advisory")}</Label><h3>{t("Velaire Advisory")}</h3><p>{t("Find the friction between how the business looks on paper and how it actually runs.")}</p><span>{t("Diagnosis · design · implementation")}</span><Action to="/advisory" quiet>{t("Explore the advisory")}</Action></article>
    <article className="v-parti-tone"><Label>{t("02 / The system of record")}</Label><h3>{t("Parti")}</h3><p>{t("Connect projects, people, time and cost. See the relationships behind the numbers.")}</p><span>{t("Context · visibility · accountability")}</span><Action to="/parti" quiet>{t("Discover Parti")}</Action></article>
    <article className="v-roster-tone"><Label>{t("03 / The system of action")}</Label><h3>{t("Roster")}</h3><p>{t("An AI workforce that uses business context to flag what matters and help your team respond.")}</p><span>{t("Attention · coordination · action")}</span><Action to="/roster" quiet>{t("Meet Roster")}</Action></article>
  </div></section>;
}
const scenarios = [{
  name: 'Project drift',
  signal: 'Six months becomes nine.',
  metric: '3 months',
  caption: 'beyond the original programme',
  context: 'Same fee. More time. More handoffs. The revenue line has not moved, but the work has.',
  parti: 'Connect the phase timeline, actual hours, repeat submissions and unchanged fee.',
  roster: 'Flag the drift, trace delayed approvals and prepare a follow-up for the project lead.',
  bars: [48, 74, 90]
}, {
  name: 'Overtime',
  signal: 'Everyone is working late. Still late.',
  metric: '24 hours',
  caption: 'of illustrative overtime in one week',
  context: 'A busy team can still be blocked. More hours do not tell you whether the work is moving forward.',
  parti: 'Compare planned capacity, recorded time and the work waiting on a decision.',
  roster: 'Surface a workload imbalance and suggest a capacity review with the responsible lead.',
  bars: [42, 85, 66]
}, {
  name: 'Rework',
  signal: 'One rejected drawing is never just one.',
  metric: '3 rounds',
  caption: 'of illustrative repeat submissions',
  context: 'A revision moves through people, phases and deadlines. Its true cost rarely stays in one place.',
  parti: 'Link rejected submissions to revision hours, dependencies and the project budget.',
  roster: 'Identify the repeated issue, draft a review request and ask the team lead to act.',
  bars: [35, 62, 87]
}];
function ConnectedExample({
  compact = false
}) {
  const t = useT();
  const [selected, setSelected] = useState(0);
  const s = scenarios[selected];
  return <div className={`v-example ${compact ? 'v-example-compact' : ''}`}><div className="v-example-head"><span>{t("PARTI × ROSTER")}</span><span>{t("Illustrative workflow")}</span></div><div className="v-tabs" role="group" aria-label={t("Choose an operating challenge")}>{t(scenarios.map((item, i) => <button key={item.name} aria-pressed={selected === i} onClick={() => setSelected(i)}>{t(item.name)}</button>))}</div><div className="v-example-body" aria-live="polite"><div className="v-example-signal"><Label>{t("The question beneath the numbers")}</Label><h3>{t(s.signal)}</h3><p>{t(s.context)}</p><div className="v-bars" aria-hidden="true">{t(s.bars.map((n, i) => <div key={i} style={{
            height: `${n}%`
          }}><span>{t("0")}{t(i + 1)}</span></div>))}</div><div className="v-example-metric"><strong>{t(s.metric)}</strong><span>{t(s.caption)}</span></div></div><div className="v-example-layers"><article><Label>{t("Parti / makes it visible")}</Label><p>{t(s.parti)}</p></article><article><Label>{t("Roster / helps you respond")}</Label><p>{t(s.roster)}</p></article><p className="v-note">{t("Concept example with sample data. Proposed agent workflows, subject to permissions and human review.")}</p></div></div></div>;
}
function Diagnostic({
  full = false
}) {
  const t = useT();
  return <section className={`v-diagnostic ${full ? 'v-diagnostic-full' : ''}`}><div className="v-container v-split"><div><Label>{t("A good place to begin")}</Label><h2>{t("The Velaire")}<br /><em>{t("Operating Diagnostic.")}</em></h2><p className="v-lede">{t("Before you add another tool, understand the system you already have.")}</p><Action /></div><div><div className="v-diagnostic-meta"><span>{t("4 to 6 weeks")}</span><span>{t("Founder-led businesses")}</span></div><p>{t("We map how projects, people, time and decisions move through your business, and where value gets lost along the way.")}</p><ul className="v-simple-list"><li>{t("Projects, workload and team structure")}</li><li>{t("Overtime, rework and stalled approvals")}</li><li>{t("Scope, economics and accountability")}</li></ul><div className="v-deliverable"><Label>{t("What you leave with")}</Label><h3>{t("An Operating Blueprint.")}</h3><p>{t("A clear view of the friction, the changes that matter, and an implementation roadmap.")}</p></div></div></div></section>;
}
function FinalCTA({ ecosystem = false }) {
  const t = useT();
  if (ecosystem) return <section className="v-final v-container"><Label>{t("A positive operating loop")}</Label><h2>{t("Connect the relationships.")}<br /><em>{t("Let the business thrive.")}</em></h2><p className="v-closing-copy">{t("Clearer projects. Supported teams. Healthier delivery and profit. Each part strengthens the next.")}</p><Action /></section>;
  return <section className="v-final v-container"><Label>{t("Let’s start with the real question")}</Label><h2>{t("You probably don’t need")}<br />{t("more software.")}<br /><em>{t("You need to see what is actually happening.")}</em></h2><Action /></section>;
}
function BrandGuide() {
  const t = useT();
  return <div className="v-brand-guide" aria-label={t('The Velaire family')}>
    {[['Velaire', 'Advisory & implementation', '/advisory'], ['Parti', 'Business operating system', '/parti'], ['Roster', 'AI workforce', '/roster']].map(([name, description, url]) => <Link to={url} key={name}><strong>{name}</strong><span>{t(description)}</span></Link>)}
  </div>;
}
function Home() {
  const t = useT();
  return <>
  <section className="v-hero v-container"><div className="v-hero-copy"><Label>{t("Advisory · Software · AI")}</Label><h1>{t("Complex businesses")}<br />{t("need clearer")}<br /><em>{t("operating systems.")}</em></h1><p>{t("We help project-based businesses run better with expert advisory, connected business software and an AI workforce.")}</p><BrandGuide /><div className="v-actions"><Action /><Action to="/#system" quiet>{t("Explore the system")}</Action></div></div><PhotoSpace /></section>
  <div className="v-audience v-container"><span>{t("FOR THE BUSINESSES BEHIND THE WORK")}</span><p>{t("Creative studios. Design practices. Project-based teams.")}</p></div>
  <Family /><section className="v-section v-container v-problem"><Label>{t("The work behind the work")}</Label><h2>{t("Revenue can look healthy.")}<br />{t("A project underneath it")}<br />{t("can be ")}<em>{t("quietly bleeding.")}</em></h2><div><p>{t("Six months becomes nine. Scope moves. Overtime climbs. Drawings are reworked. Approvals stall.")}</p><p>{t("The numbers tell you that something happened. We want to show you why.")}</p></div></section>
  <section className="v-method v-container"><Label>{t("From seeing to doing")}</Label><div>{t([['Susan', 'Sees the problem.'], ['Velaire', 'Redesigns the business.'], ['Parti', 'Structures it.'], ['Roster', 'Helps it act.']].map(([name, body]) => <div key={name}><h3>{t(name)}</h3><p>{t(body)}</p></div>))}</div></section>
  <section className="v-section v-container"><SectionTitle label={t("The connection is the point")} body={t("Parti tells you what is happening. Roster helps you do something about it.")}>{t("A signal becomes")}<br /><em>{t("a next step.")}</em></SectionTitle><ConnectedExample /></section>
  <section className="v-product-pair v-container"><article className="v-parti-tone"><Label>{t("Parti / Business operating system")}</Label><h2>{t("Your business is")}<br />{t("already a system.")}</h2><p>{t("Parti makes the relationships visible. Projects, phases, people and economics belong in the same conversation.")}</p><Action to="/parti" quiet>{t("Explore Parti")}</Action></article><article className="v-roster-tone"><Label>{t("Roster / AI workforce")}</Label><h2>{t("Visibility is useful.")}<br /><em>{t("Action is better.")}</em></h2><p>{t("Roster Suite brings agent work, context and human decisions together, so the team can respond with intention.")}</p><Action to="/roster" quiet>{t("Explore Roster Suite")}</Action></article></section>
  <Diagnostic />
  <FinalCTA ecosystem />
  </>;
}
function Parti() {
  const t = useT();
  return <>
  <section className="v-page-hero v-container"><Label>{t("Parti / Business operating system")}</Label><h1>{t("Your business is")}<br />{t("already ")}<em>{t("a system.")}</em></h1><div className="v-page-intro"><p>{t("Parti makes the relationships visible.")}</p><p>{t("Know whether each project is consuming the time, people and margin you planned for before it becomes a problem.")}</p></div><div className="v-actions"><Action to="/contact?interest=parti">{t("Explore Parti for your business")}</Action><span className="v-note">{t("Developing with paid design partners")}</span></div></section>
  <section className="v-container v-parti-map"><div><Label>{t("The relationships behind the work")}</Label><h2>{t("One project.")}<br /><em>{t("The whole picture.")}</em></h2><p>{t("Ask why a project is drifting, and follow the connections.")}</p></div><div className="v-relationship"><div className="v-project-core"><span>{t("PROJECT / 01")}</span><h3>{t("The studio commission")}</h3><span>{t("Illustrative relationship model")}</span></div><div className="v-nodes">{t(['Phases & deadlines', 'People & capacity', 'Time & overtime', 'Cost & margin', 'Quality & rework', 'Approvals & owners'].map(n => <span key={n}>{t(n)}</span>))}</div></div></section>
  <section className="v-section v-container"><SectionTitle label={t("The commercial starting point")}>{t("Where did the time go?")}<br />{t("What did it do to the margin?")}</SectionTitle><div className="v-feature-grid">{t([['Projects & phases', 'See work in its delivery context, from the first brief to the final handoff.'], ['People & capacity', 'Connect staffing plans with real workloads, team structure and availability.'], ['Time & overtime', 'Compare planned and actual effort. Ask what additional hours are telling you.'], ['Project economics', 'Put fees, budgets, time and cost in one view of project performance.'], ['Quality & rework', 'Follow submissions, rejects and revisions through their delivery consequences.'], ['Approvals & accountability', 'Make the next decision, its owner and its dependencies visible.']].map(([title, body], i) => <article key={title}><Label>{t("0")}{t(i + 1)}</Label><h3>{t(title)}</h3><p>{t(body)}</p></article>))}</div><p className="v-note">{t("Initial product scope. Availability and configuration are agreed with each design partner.")}</p></section>
  <section className="v-statement v-container"><h2>{t("Relationships matter")}<br /><em>{t("more than feature count.")}</em></h2><p>{t("A timesheet can tell you someone worked late. A connected system can help explain why, what it cost, and which decision changes the outcome.")}</p></section><section className="v-section v-container"><ConnectedExample /></section><Diagnostic /><FinalCTA />
  </>;
}
function Roster() {
  const t = useT();
  return <>
  <section className="v-page-hero v-container"><Label>{t("Roster / AI workforce")}</Label><h1>{t("Visibility is useful.")}<br /><em>{t("Action is better.")}</em></h1><div className="v-page-intro"><p>{t("An AI workforce with the context to be useful.")}</p><p>{t("Roster helps teams notice, reason, draft, coordinate and escalate · using structured business context and clear boundaries.")}</p></div><div className="v-actions"><Action to="/contact?interest=roster">{t("Explore Roster with us")}</Action><a className="v-link" href={SIGN_IN}>{t("Sign in to Roster Suite")}</a></div></section>
  <section className="v-section v-container v-split"><div><Label>{t("The Roster / Studio operating services")}</Label><h2>{t("Good work needs")}<br /><em>{t("a better way to work.")}</em></h2></div><div><p>{t("Explore The Roster’s studio operating services, from finding the friction to implementing a clearer system and keeping it running.")}</p><p>{t("Part of Velaire, alongside Parti. Existing client spaces and Roster Suite remain available.")}</p><a className="v-button" href="https://theroster.studio/">{t("Explore The Roster")}</a></div></section>
  <section className="v-suite v-container"><div><Label>{t("The environment")}</Label><h2>{t("Roster Suite")}</h2><p>{t("A place for the work your agents do and the decisions your team needs to make.")}</p><p>{t("Context, assignments, permissions, approvals and work history belong together. People stay responsible for the decisions that matter.")}</p><a className="v-link" href={SIGN_IN}>{t("Open your Roster Suite")}</a></div><div className="v-suite-panel"><div className="v-suite-panel-head"><strong>{t("Roster Suite")}</strong><span>{t("Concept preview")}</span></div><Label>{t("Project health / Review requested")}</Label><h3>{t("The deadline moved.")}<br />{t("The fee didn’t.")}</h3><p>{t("Review the link between overtime, repeat submissions and a delayed approval.")}</p><div className="v-suite-task"><span>{t("01")}</span><div><strong>{t("Context gathered")}</strong><p>{t("Phase timeline · hours · submission history")}</p></div></div><div className="v-suite-task"><span>{t("02")}</span><div><strong>{t("Follow-up drafted")}</strong><p>{t("Prepared for the responsible project lead")}</p></div></div><div className="v-review-tag">{t("Human review before action")}</div><p className="v-note">{t("Illustrative proposed workflow, not live account data.")}</p></div></section>
  <section className="v-section v-container"><SectionTitle label={t("The business agent roadmap")} body={t("Introduced as trustworthy structured context becomes available in Parti.")}>{t("Specific work.")}<br /><em>{t("Specific value.")}</em></SectionTitle><div className="v-feature-grid v-two">{t([['Project Health Agent', 'Spot delivery drift and connect it to the decisions holding work up.'], ['Resource Agent', 'Flag capacity pressure and help leads review how the work is distributed.'], ['Profitability Agent', 'Trace changes in project economics back to time, scope and rework.'], ['HR / Team Health Agent', 'Surface workload patterns for an accountable human conversation.']].map(([title, body]) => <article key={title}><Label>{t("Planned capability")}</Label><h3>{t(title)}</h3><p>{t(body)}</p></article>))}</div></section>
  <section className="v-statement v-container"><h2>{t("Parti organizes the business.")}<br /><em>{t("Roster augments the team.")}</em></h2><p>{t("We begin with reliable context and a specific job to be done. Each agent’s scope, permissions and review points are agreed before it acts.")}</p></section><section className="v-section v-container"><ConnectedExample /></section><FinalCTA />
  </>;
}
function Advisory() {
  const t = useT();
  return <>
  <section className="v-page-hero v-container"><Label>{t("Velaire Advisory")}</Label><h1>{t("Good work deserves")}<br /><em>{t("a better-run business.")}</em></h1><div className="v-page-intro"><p>{t("Start with what is actually happening.")}</p><p>{t("We help founder-led creative and project-based businesses understand how their work, people and decisions fit together and redesign what gets in the way.")}</p></div><div className="v-actions"><Action /><span className="v-note">{t("Initially focused on teams of around 15 to 75 people")}</span></div></section><Diagnostic full />
  <section className="v-section v-container"><SectionTitle label={t("The engagement")}>{t("From operating friction")}<br /><em>{t("to a practical blueprint.")}</em></SectionTitle><div className="v-feature-grid">{t([['01 / Discover', 'Map the business as it is', 'Understand projects, team structure, workload and the way decisions actually get made.'], ['02 / Connect', 'Follow the consequences', 'Trace how scope, overtime, rework and delayed approvals affect delivery and project economics.'], ['03 / Design', 'Decide what changes first', 'Set priorities, clarify ownership and build an implementation roadmap around the work.']].map(([label, title, body]) => <article key={label}><Label>{t(label)}</Label><h3>{t(title)}</h3><p>{t(body)}</p></article>))}</div></section>
  <section className="v-container v-split v-fit"><div><Label>{t("A useful fit")}</Label><h2>{t("The work is strong.")}<br />{t("Running the business")}<br /><em>{t("feels harder than it should.")}</em></h2></div><div><ul className="v-simple-list"><li>{t("Projects stretch while fees stay the same.")}</li><li>{t("Everyone is busy, but ownership is unclear.")}</li><li>{t("You can see the numbers, but not what caused them.")}</li><li>{t("Too much operating knowledge lives in the founder’s head.")}</li></ul><p>{t("Scope and fees are agreed after an initial conversation. Implementation is a separate, deliberate next step.")}</p></div></section>
  <section className="v-section v-container v-faq"><SectionTitle label={t("Before we begin")}>{t("A few practical questions.")}</SectionTitle><div>{t([['Do we need to adopt Parti or Roster?', 'The diagnostic begins with your business and existing tools. The roadmap may include process changes, clearer accountability, configuration or implementation. Product choices follow the findings.'], ['What will you need from us?', 'Access to the people who understand the work and an agreed sample of project, time, workload and financial information. We agree access and confidentiality before starting.'], ["What happens after the 4 to 6 weeks?", 'You receive an Operating Blueprint and implementation roadmap. We can then agree a separate implementation scope, or you can use the roadmap with your own team.']].map(([q, a]) => <details key={q}><summary>{t(q)}<span aria-hidden="true">{t("+")}</span></summary><p>{t(a)}</p></details>))}</div></section><FinalCTA />
  </>;
}
function About() {
  const t = useT();
  const loop = ['Clear project goals', 'Thoughtful resource planning', 'Time used with intention', 'Healthier costs', 'Clear accountability', 'Better delivery', 'Less rework and overtime', 'More stable profit', 'Reinvest in people and projects'];
  return <>
    <section className="v-page-hero v-container"><h1 className="v-about-title v-principles">{t("Aesthetic judgment × Operating insight × Making complexity clear").split(" × ").map((phrase,i)=><span key={phrase}>{i>0 && <small aria-hidden="true">×</small>}<span>{phrase}</span></span>)}</h1><div className="v-page-intro"><p>{t("Projects, people, time, cost and accountability are already one system.")}</p><p>{t("Good management connects these relationships so each part supports the next, creating a positive operating loop.")}</p></div></section>
    <section className="v-container v-about v-founder-story"><PhotoSpace detail /><div><Label>{t("Why Velaire exists")}</Label><h2>{t("From making one project work to making good work sustainable.")}</h2><p>{t("Velaire began with a question Susan kept returning to between design and running a business.")}</p><h3 className="v-story-question">{t("How can the business behind good work be just as healthy?")}</h3><p>{t("Aesthetic judgment reveals possibilities. But carrying a standard through teams, projects and countless handoffs takes more than taste.")}</p><p>{t("A decision changes the scope of a project. Scope changes affect people and time. More time changes costs and affects the team. The outcome of delivery shapes what can be invested next.")}</p><p>{t("Projects, people, time, cost and accountability are already one system.")}</p><p>{t("Susan began following these relationships, asking how each part could support the next.")}</p><p>{t("Velaire grew from that question.")}</p><p>{t("Advisory redesigns operating relationships. Parti structures them. Roster helps the team keep acting on them.")}</p><p>{t("Clearer projects, supported teams, healthier delivery and profit. The results go back into people and the next project.")}</p><p className="v-story-close">{t("Make good work happen again.")}</p><p className="v-story-signature"><span>Susan Liao</span><span>{t("Founder")}</span></p></div></section>
    <section className="v-section v-container"><SectionTitle label={t("The positive operating loop")} body={t("Healthier profit protects the team and gives the next project a stronger beginning.")}>{t("Each part supports")}<br /><em>{t("what comes next.")}</em></SectionTitle><ol className="v-about-loop">{loop.map((step,i)=><li key={step}><span className="v-label">{String(i+1).padStart(2,'0')}</span><h3>{t(step)}</h3><span aria-hidden="true">↗</span></li>)}</ol></section>
    <section className="v-section v-container"><div className="v-feature-grid">{[['Susan','Makes complexity clear.'],['Velaire','Redesigns operating relationships.'],['Parti','Structures the relationships.'],['Roster','Keeps the system moving.']].map(([name,body])=><article key={name}><Label>{name}</Label><h3>{t(body)}</h3></article>)}</div></section>
    <section className="v-statement v-container"><h2>{t("Parti makes the system visible.")}<br /><em>{t("Roster helps it keep working.")}</em></h2><p>{t("A healthy business is a living system in which every part supports the next.")}</p></section><FinalCTA />
  </>;
}
function Contact() {
  const t = useT();
  const {
    search
  } = useLocation();
  const interest = new URLSearchParams(search).get('interest');
  const [inquiry, setInquiry] = useState(null);
  const draft = inquiry ? [t('Hello Velaire,'), '', t('I would like to discuss') + ' ' + t(inquiry.interest), '', t('Your name') + ': ' + inquiry.name, t('Work email') + ': ' + inquiry.email, t('Business / studio') + ': ' + inquiry.company, t('Team size') + ': ' + t(inquiry.size), '', t('What would you like to understand or change?'), inquiry.challenge, '', t('Best,'), inquiry.name].join('\n') : null;
  const [copied, setCopied] = useState(false);
  function prepare(e) {
    e.preventDefault();
    setInquiry(Object.fromEntries(new FormData(e.currentTarget)));
    setCopied(false);
    requestAnimationFrame(() => document.getElementById('inquiry-draft')?.focus());
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      setCopied(false);
      document.getElementById('draft-copy')?.select();
    }
  }
  return <section className="v-container v-contact"><div><Label>{t("Start a conversation")}</Label><h1>{t("What feels harder")}<br />{t("than ")}<em>{t("it should?")}</em></h1><p className="v-lede">{t("Tell us a little about your business and the question that brought you here.")}</p><p>{t("We’ll start by understanding whether the Velaire Operating Diagnostic is the right next step.")}</p><a className="v-contact-email" href="mailto:hello@theroster.studio">{t("hello@theroster.studio")}</a><p className="v-note">{t("Velaire, Parti and Roster share this contact address.")}</p></div><div>{t(!draft ? <form onSubmit={prepare} className="v-form"><div className="v-form-row"><label>{t("Your name")}<input name="name" autoComplete="name" required maxLength={100} /></label><label>{t("Work email")}<input name="email" type="email" autoComplete="email" required maxLength={200} /></label></div><label>{t("Business / studio")}<input name="company" autoComplete="organization" required maxLength={160} /></label><div className="v-form-row"><label>{t("Team size")}<select name="size" defaultValue="" required><option value="" disabled>{t("Select")}</option><option value="1 to 14 people">{t("1 to 14 people")}</option><option value="15 to 30 people">{t("15 to 30 people")}</option><option value="31 to 75 people">{t("31 to 75 people")}</option><option value="76+ people">{t("76+ people")}</option></select></label><label>{t("I’m interested in")}<select name="interest" defaultValue={{
              diagnostic: 'Operating Diagnostic',
              parti: 'Parti',
              roster: 'Roster / Roster Suite'
            }[interest] || 'Operating Diagnostic'}><option value="Operating Diagnostic">{t("Operating Diagnostic")}</option><option value="Parti">{t("Parti")}</option><option value="Roster / Roster Suite">{t("Roster / Roster Suite")}</option><option value="Something else">{t("Something else")}</option></select></label></div><label>{t("What would you like to understand or change?")}<textarea name="challenge" rows={5} required maxLength={2500} placeholder={t("A project pattern, a team challenge, a question about the numbers…")} /></label><p className="v-note">{t("This prepares an email for you to review and send. Nothing is submitted or stored by this form.")}</p><button className="v-button" type="submit">{t("Prepare my inquiry")}</button></form> : <div className="v-draft" id="inquiry-draft" tabIndex={-1}><Label>{t("Your inquiry / ready to review")}</Label><h2>{t("A conversation starts here.")}</h2><p>{t("No message has been sent. Open the draft in your email app, or copy it into an email to hello@theroster.studio.")}</p><textarea id="draft-copy" aria-label={t("Your inquiry draft")} value={draft} readOnly rows={12} /><div className="v-actions"><a className="v-button" href={`mailto:hello@theroster.studio?subject=${encodeURIComponent(t("Velaire · business inquiry"))}&body=${encodeURIComponent(draft)}`}>{t("Open email draft")}</a><button className="v-link" onClick={copy}>{t(copied ? 'Copied' : 'Copy inquiry')}</button></div><p className="v-note" role="status">{t(copied ? 'Inquiry copied. Paste it into your email app.' : 'Please review the message before sending.')}</p><button className="v-link" onClick={() => setInquiry(null)}>{t("Start another inquiry")}</button></div>)}</div></section>;
}
function NotFound() {
  const t = useT();
  return <section className="v-page-hero v-container"><Label>404</Label><h1>{t('A different way back.')}</h1><p className="v-lede">{t('This page is not here. Explore the Velaire family or start a conversation with us.')}</p><div className="v-actions"><Action to="/">{t('Back to Velaire')}</Action><Action to="/contact" quiet>{t('Start a conversation')}</Action></div></section>;
}
function VelaireContent() {
  const t = useT();
  const {
    language,
    setLanguage
  } = useLanguage();
  const {
    pathname,
    hash,
    search
  } = useLocation();
  const palette = import.meta.env.DEV && new URLSearchParams(search).get('palette') === 'burgundy' ? 'burgundy' : 'powder';
  const path = pathname.replace(/\/$/, '') || '/';
  const [menu, setMenu] = useState(false);
  const [robotsPolicy] = useState(() => document.querySelector('meta[name="robots"]')?.content || "noindex, nofollow");
  useEffect(() => {
    setMenu(false);
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: 'instant',
        block: 'start'
      }));
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, [path, hash]);
  useEffect(() => {
    document.documentElement.lang = language;
    const [title, description] = pages[path] || pages['/404'];
    document.title = t(title);
    const canonicalUrl = `https://velaireco.com${path === '/' ? '/' : path}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', pages[path] ? robotsPolicy : 'noindex, nofollow');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(description));
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t(title));
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t(description));
  }, [path, language, t, robotsPolicy]);
  const Page = {
    '/': Home,
    '/parti': Parti,
    '/roster': Roster,
    '/advisory': Advisory,
    '/about': About,
    '/contact': Contact
  }[path] || NotFound;
  return <div lang={language} data-palette={palette} className={`velaire-site v-page-${path.slice(1) || 'home'}`}><a className="v-skip" href="#v-main">{t("Skip to content")}</a><header className="v-header v-container"><span className="v-header-kicker">{t("Advisory · Software · AI")}</span><Link className="v-wordmark" aria-label={t("Velaire home")} to="/">{t("VELAIRE")}<span>{t("THE WORK BEHIND THE WORK")}</span></Link><button className="v-menu" aria-expanded={menu} aria-controls="v-navigation" onClick={() => setMenu(!menu)}>{t(menu ? 'Close' : 'Menu')}</button><nav id="v-navigation" aria-label={t("Main navigation")} className={menu ? 'is-open' : ''}>{t(nav.map(([label, url]) => <Link key={url} to={url} aria-current={path === url ? 'page' : undefined}>{t(label)}</Link>))}<Link className="v-nav-contact" to="/contact">{t("Let’s talk")}</Link><a className="v-signin" href={SIGN_IN}>{t("Roster Suite sign in")}</a></nav><div className="v-languages" role="group" aria-label={t("Choose language")}>{t([['en', 'EN'], ['zh-Hans', '简体'], ['zh-Hant', '繁體']].map(([code, label]) => <button key={code} type="button" lang={code} aria-pressed={language === code} onClick={() => setLanguage(code)}>{t(label)}</button>))}</div></header><main id="v-main"><Page /></main><footer className="v-footer v-container"><div><Link className="v-wordmark" to="/">{t("VELAIRE")}</Link><p>{t("Clearer systems.")}<br />{t("Better decisions. Better work.")}</p></div><div><Label>{t("The family")}</Label><Link to="/advisory">{t("Velaire Advisory")}</Link><Link to="/parti">{t("Parti")}</Link><Link to="/roster">{t("Roster")}</Link></div><div><Label>{t("Stay connected")}</Label><Link to="/about">{t("Susan Liao")}</Link><Link to="/contact">{t("Start a conversation")}</Link><a href={SIGN_IN}>{t("Roster Suite sign in")}</a><Link to="/rooms">{t("Existing client spaces")}</Link><a href="https://home.velaireco.com/">{t("Business Home")}</a></div><div className="v-footer-bottom"><span>{t("© ")}{t(new Date().getFullYear())}{t(" Velaire · velaireco.com")}</span><span><Link to="/privacy">{t("Privacy")}</Link><Link to="/terms">{t("Terms")}</Link></span></div></footer></div>;
}
export default function VelaireSite() {
  return <LanguageProvider><VelaireContent /></LanguageProvider>;
}
