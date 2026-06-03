import { Link, useLocation } from 'react-router-dom'
import analytics from '../utils/analytics'
import './Header.css'

export default function Header() {
  const location = useLocation()
  
  const handleRTSClick = () => {
    analytics.trackOutboundLink('https://rtsts.tech', 'Header RTS Button')
  }
  
  const handleNavClick = (page: string) => {
    analytics.trackEvent('Navigation', 'Click', `Header Nav - ${page}`)
  }
  
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
            onClick={() => handleNavClick('Dashboard')}
          >
            DASHBOARD
          </Link>
          <Link
            to="/data"
            className={`nav-btn ${location.pathname === '/data' ? 'active' : ''}`}
            onClick={() => handleNavClick('Data Sheets')}
          >
            DATA SHEETS
          </Link>
        </nav>
        <a 
          href="https://rtsts.tech?utm_source=shat-dashboard&utm_medium=referral&utm_campaign=header-button" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-terminal btn-terminal-sm"
          onClick={handleRTSClick}
        >
          RTS
        </a>
      </div>
    </header>
  )
}
