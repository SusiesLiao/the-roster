import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
// Self-hosted faces — the same rule as the app (roster-cockpit/src/main.tsx):
// Google Fonts is blocked in mainland China, and Susan, both boys and every
// Chinese client are in Shanghai. The CDN link this replaces meant the site
// rendered its display serif as raw system sans for exactly the people it was
// built for — Susan saw the fallback for weeks and reasonably hated "the font",
// which was never the font. Fraunces is the face she picked for the product;
// now the agency's titles and the app's pitch speak in the same voice.
import '@fontsource/fraunces/latin-500.css'
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/fraunces/latin-500-italic.css'
import '@fontsource/fraunces/latin-600-italic.css'
import '@fontsource/schibsted-grotesk/latin-400.css'
import '@fontsource/schibsted-grotesk/latin-500.css'
import '@fontsource/schibsted-grotesk/latin-600.css'
import '@fontsource/schibsted-grotesk/latin-700.css'
import './styles.css'

// A crash anywhere in the tree must never blank the page — worst case, visitors
// see a graceful card with a reload, and the error lands in the console for us.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('[roster] render crash:', error, info?.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 420, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 26, marginBottom: 10 }}>
              Well, that's embarrassing.
            </h1>
            <p style={{ color: '#4A463F', lineHeight: 1.6, marginBottom: 20 }}>
              Something on our side just tripped. One tap usually fixes it — and a human will see this either way.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#191817', color: '#fff', border: 0, borderRadius: 10, padding: '12px 24px', fontSize: 15, cursor: 'pointer' }}
            >
              Reload the page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
