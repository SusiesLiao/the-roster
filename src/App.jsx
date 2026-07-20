import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Home from './pages/Home.jsx'
const AmberProfile = lazy(() => import('./pages/AmberProfile.jsx'))
const Interview = lazy(() => import('./pages/Interview.jsx'))
const Hire = lazy(() => import('./pages/Hire.jsx'))
const Permissions = lazy(() => import('./pages/Permissions.jsx'))
const Connect = lazy(() => import('./pages/Connect.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))

function PageLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}>
      <div className="typing"><span /><span /><span /></div>
    </div>
  )
}

function ScrollTop() {
  const { pathname } = useLocation()
  // Braces matter: scrollTo returns a Promise in modern Chrome/Safari; returning it
  // from useEffect makes React call it as a "cleanup" on the next navigation → crash.
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <nav className="nav">
        <div className="wrap nav-inner">
          <Link to="/" className="logo">The <em>Roster</em></Link>
          <div className="nav-links">
            <Link to="/#roster">The talent</Link>
            <Link to="/amber">Amber</Link>
            <Link to="/interview" className="btn btn-primary btn-sm">Interview Amber — free</Link>
          </div>
        </div>
      </nav>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/amber" element={<AmberProfile />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
      <footer>
        <div className="wrap foot">
          <div>© 2026 The Roster · theroster.studio</div>
          <div>AI employees, trained and placed. · <Link to="/permissions" style={{ textDecoration: 'underline' }}>Trust &amp; permissions</Link> · <Link to="/privacy" style={{ textDecoration: 'underline' }}>Privacy</Link> · <Link to="/terms" style={{ textDecoration: 'underline' }}>Terms</Link> · <a href="mailto:hello@theroster.studio" style={{ textDecoration: 'underline' }}>hello@theroster.studio</a></div>
        </div>
      </footer>
    </>
  )
}
