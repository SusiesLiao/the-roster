import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
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
