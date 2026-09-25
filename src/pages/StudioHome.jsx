import { useEffect, useState } from 'react'
import { SIGN_IN } from '../lib/app.js'
import { studioCopy } from '../data/studioCopy.js'
import '../studio-site.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-300-italic.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'

const LOCALES = ['en', 'zh-Hans', 'zh-Hant']
function initialLanguage() {
  try { const saved = localStorage.getItem('roster-public-language-v1'); return LOCALES.includes(saved) ? saved : 'en' } catch { return 'en' }
}

export default function StudioHome() {
  const [language, setLanguage] = useState(initialLanguage)
  const [workflow, setWorkflow] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const c = studioCopy[language]
  useEffect(() => {
    document.documentElement.lang = language
    document.title = c.title
    for (const [selector, content] of [ ['meta[name="description"]', c.intro], ['meta[property="og:title"]', c.title], ['meta[property="og:description"]', c.intro] ]) {
      document.querySelector(selector)?.setAttribute('content', content)
    }
    try { localStorage.setItem('roster-public-language-v1', language) } catch { /* Preferences are optional. */ }
  }, [language, c])
  const emailLink = `mailto:hello@theroster.studio?subject=${encodeURIComponent(c.emailSubject)}&body=${encodeURIComponent(c.emailBody)}`
  async function copyEmail() {
    try { await navigator.clipboard.writeText('hello@theroster.studio'); setCopied(true) } catch { setCopied(false) }
  }
  const selected = c.workflows[workflow]
  return <div className="studio-site">
    <a className="studio-skip" href="#main">{c.skip}</a>
    <header className="studio-header">
      <a className="studio-wordmark" href="#" aria-label="The Roster">The <em>Roster</em><span>{c.wordmark}</span></a>
      <button className="studio-menu" aria-expanded={menuOpen} aria-controls="studio-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? c.close : c.menu}</button>
      <nav id="studio-nav" aria-label={c.navigation} className={menuOpen ? 'open' : ''}>
        {c.nav.map((label, i) => <a key={label} href={['#services', '#inside', '#approach'][i]} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <a href="/rooms">{language === 'en' ? 'Your room' : language === 'zh-Hans' ? '专属空间' : '專屬空間'}</a>
        <a href={SIGN_IN} className="studio-signin">{c.signIn}</a>
      </nav>
      <label className="studio-language"><span className="sr-only">{c.language}</span><select aria-label={c.language} value={language} onChange={e => { setLanguage(e.target.value); setCopied(false) }}><option value="en">EN</option><option value="zh-Hans">简体</option><option value="zh-Hant">繁體</option></select></label>
    </header>
    <main id="main">
      <section className="studio-hero studio-container">
        <div className="studio-hero-copy"><p className="studio-eyebrow">{c.eyebrow}</p><h1>{c.headline}<br /><em>{c.headlineEm}</em></h1><p className="studio-intro">{c.intro}</p><div className="studio-actions"><a className="studio-button" href="#contact">{c.cta}</a><a className="studio-text-link" href="#inside">{c.explore}</a></div><p className="studio-small">{c.fit}</p></div>
        <div className="studio-hero-art" aria-label={c.sampleLabel}>
          <div className="studio-art-heading"><span>THE ROSTER</span><span>{c.sample}</span></div>
          <div className="studio-paper">
            <div className="studio-paper-top"><span>{c.weekly}</span><span>01 / 03</span></div><h2>{c.paperHeading}</h2><p>{c.paperSub}</p>
            {c.sampleRows.map((row, i) => <div className="studio-sample-row" key={row[0]}><span className="studio-number">0{i + 1}</span><div><strong>{row[0]}</strong><span>{row[1]}</span></div><span className={`studio-chip ${i ? 'plain' : ''}`}>{[c.review, c.ready, c.draft][i]}</span></div>)}
            <div className="studio-paper-foot"><span>Parti + Pepper</span><span>{c.peopleDecide}</span></div>
          </div>
          <div className="studio-art-note"><span className="studio-note-mark" aria-hidden="true">R.</span><p>{c.artNote}</p></div>
        </div>
      </section>
      <div className="studio-audience studio-container"><span>{c.forLabel}</span><p>{c.audience}</p><span>{c.noOverhaul}</span></div>
      <section id="services" className="studio-section studio-container">
        <div className="studio-section-head"><p className="studio-eyebrow">01 / {c.serviceLabel}</p><h2>{c.serviceHeading}</h2><p>{c.serviceIntro}</p></div>
        <div className="studio-services">{c.services.map((s, i) => <article key={s.title}><span className="studio-step">0{i + 1}</span><h3>{s.title}</h3><p>{s.body}</p><ul>{s.items.map(item => <li key={item}>{item}</li>)}</ul><div className="studio-service-bottom"><span>{s.note}</span><a href="#contact" aria-label={`${c.discuss}: ${s.title}`}>{c.discuss}</a></div></article>)}</div>
        <p className="studio-scope-note">{c.scopeNote}</p>
      </section>
      <section id="inside" className="studio-inside">
        <div className="studio-container"><div className="studio-section-head"><p className="studio-eyebrow">02 / {c.insideLabel}</p><h2>{c.insideHeading}</h2><p>{c.insideIntro}</p></div>
          <div className="studio-workflow-buttons" role="group" aria-label={c.workflowLabel}>{c.workflows.map((w, i) => <button key={w.title} aria-pressed={workflow === i} onClick={() => setWorkflow(i)}>{w.title}</button>)}</div>
          <div className="studio-workflow" aria-live="polite"><div><p className="studio-eyebrow">{c.example}</p><h3>{selected.heading}</h3><p>{selected.body}</p><p className="studio-workflow-boundary">{selected.boundary}</p></div><ol>{selected.steps.map((step, i) => <li key={step[0]}><span>0{i + 1}</span><div><h4>{step[0]}</h4><p>{step[1]}</p></div></li>)}</ol></div>
          <div className="studio-product-strip">{c.products.map(p => <div key={p[0]}><strong>{p[0]}</strong><p>{p[1]}</p></div>)}</div>
        </div>
      </section>
      <section id="approach" className="studio-section studio-container studio-approach">
        <div><p className="studio-eyebrow">03 / {c.approachLabel}</p><h2>{c.approachHeading}</h2><p className="studio-founder-name">Susan Liao <span> / {c.founder}</span></p><p>{c.founderBody}</p><p>{c.founderBody2}</p></div>
        <div className="studio-proof"><p className="studio-eyebrow">{c.proofLabel}</p><h3>{c.proofTitle}</h3><p>{c.proofIntro}</p><ul>{c.proofItems.map(item => <li key={item}>{item}</li>)}</ul><p className="studio-small">{c.proofNote}</p></div>
      </section>
      <section className="studio-section studio-container studio-faq"><div><p className="studio-eyebrow">{c.faqLabel}</p><h2>{c.faqHeading}</h2></div><div>{c.faq.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <section id="contact" className="studio-contact"><div className="studio-container"><p className="studio-eyebrow">{c.contactLabel}</p><h2>{c.contactHeading}<br /><em>{c.contactEm}</em></h2><p>{c.contactBody}</p><a className="studio-button" href={emailLink}>{c.emailCta}</a><p className="studio-small">{c.emailNotice}</p><div className="studio-email"><a href="mailto:hello@theroster.studio">hello@theroster.studio</a><button onClick={copyEmail}>{copied ? c.copied : c.copy}</button><span className="sr-only" role="status">{copied ? c.copied : ''}</span></div></div></section>
    </main>
    <footer className="studio-footer studio-container"><div><a className="studio-wordmark" href="#">The <em>Roster</em></a><p>{c.footerLine}</p><p>© 2026 The Roster</p></div><div><a href="/rooms">{language === 'en' ? 'Find your room' : language === 'zh-Hans' ? '找到你的专属空间' : '找到你的專屬空間'}</a><a href={SIGN_IN}>{c.signIn}</a><a href="/privacy">{c.privacy}</a><a href="/terms">{c.terms}</a><span className="studio-small">{c.legalNote}</span></div></footer>
  </div>
}
