import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import AmberProfile from './pages/AmberProfile.jsx'
import Interview from './pages/Interview.jsx'
import Hire from './pages/Hire.jsx'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/amber" element={<AmberProfile />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/hire" element={<Hire />} />
      </Routes>
      <footer>
        <div className="wrap foot">
          <div>© 2026 The Roster · theroster.studio</div>
          <div>AI employees, trained and placed. · <a href="mailto:hello@theroster.studio" style={{ textDecoration: 'underline' }}>hello@theroster.studio</a></div>
        </div>
      </footer>
    </>
  )
}
