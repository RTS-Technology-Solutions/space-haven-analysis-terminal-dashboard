import { Link, useLocation } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
  currentView: 'dashboard' | 'datasheets'
  onViewChange: (view: 'dashboard' | 'datasheets') => void
}

export default function Header({}: HeaderProps) {
  const location = useLocation()
  
  return (
    <header className="terminal-header">
      <div className="header-left">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="header-title font-display">
            <span className="text-glow">S.H.A.T.</span> COMMAND CENTER
          </h1>
        </Link>
        <p className="header-subtitle">Space Haven Analysis Terminal Dashboard</p>
      </div>
      <div className="header-right">
        <nav className="header-nav">
          <Link
            to="/dash"
            className={`nav-btn ${location.pathname === '/dash' ? 'active' : ''}`}
          >
            DASHBOARD
          </Link>
          <Link
            to="/data"
            className={`nav-btn ${location.pathname === '/data' ? 'active' : ''}`}
          >
            DATA SHEETS
          </Link>
        </nav>
        <a 
          href="https://rtsts.tech" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-terminal btn-terminal-sm"
        >
          RTS
        </a>
      </div>
    </header>
  )
}
