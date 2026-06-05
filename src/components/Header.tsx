import { Link, useLocation } from 'react-router-dom'
import analytics from '../utils/analytics'
import './Header.css'

interface HeaderProps {
  onFeedbackClick: () => void
}

export default function Header({ onFeedbackClick }: HeaderProps) {
  const location = useLocation()
  
  const handleRTSClick = () => {
    analytics.trackOutboundLink('https://rtsts.tech', 'Header RTS Button')
  }
  
  const handleGitHubClick = () => {
    analytics.trackOutboundLink('https://github.com/RTS-Technology-Solutions/space-haven-analysis-terminal-dashboard', 'Header GitHub Button')
  }
  
  const handleSupportClick = () => {
    analytics.trackOutboundLink('https://buy.stripe.com/4gM28rdLt4540Vlcyzew802', 'Header Support Button')
  }
  
  const handleNavClick = (page: string) => {
    analytics.trackEvent('Navigation', 'Click', `Header Nav - ${page}`)
  }

  const handleFeedback = () => {
    analytics.trackEvent('Feedback', 'Open Modal', 'Header Feedback Button')
    onFeedbackClick()
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
        <button 
          className="btn-terminal btn-terminal-sm feedback-btn"
          onClick={handleFeedback}
          title="Share feedback or report issues"
        >
          💬 FEEDBACK
        </button>
        <a 
          href="https://github.com/RTS-Technology-Solutions/space-haven-analysis-terminal-dashboard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-terminal btn-terminal-sm"
          onClick={handleGitHubClick}
          title="View source code and contribute"
        >
          ⭐ GITHUB
        </a>
        <a 
          href="https://buy.stripe.com/4gM28rdLt4540Vlcyzew802" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-terminal btn-terminal-sm"
          onClick={handleSupportClick}
          title="Support development and server costs"
        >
          ❤️ SUPPORT
        </a>
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
