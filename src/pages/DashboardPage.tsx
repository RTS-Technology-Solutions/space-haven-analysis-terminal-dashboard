import ComingSoon from '../components/ComingSoon'
import { Link } from 'react-router-dom'
import './DashboardPage.css'

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <ComingSoon 
        targetDate="2026-06-20T00:00:00" 
        onDismiss={() => {
          // Optionally redirect or dismiss when countdown hits zero
        }}
      />
      
      {/* Beta Access Teaser - appears below the coming soon overlay */}
      <div className="beta-access-banner">
        <div className="beta-content">
          <span className="beta-badge">🚧 EARLY ACCESS</span>
          <p className="beta-text">
            Want a sneak peek? The beta dashboard is available for community testing.
          </p>
          <Link to="/beta-dash" className="btn-terminal btn-terminal-sm">
            🔬 VIEW BETA PREVIEW
          </Link>
        </div>
      </div>
    </div>
  )
}
