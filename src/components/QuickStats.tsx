import './QuickStats.css'

export default function QuickStats() {
  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-icon">🚀</div>
        <div className="stat-value">3</div>
        <div className="stat-label">SHIPS</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-value">12</div>
        <div className="stat-label">CREW</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-value">85%</div>
        <div className="stat-label">POWER</div>
        <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
          <div className="progress-bar-fill" style={{ width: '85%' }}></div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💨</div>
        <div className="stat-value">92%</div>
        <div className="stat-label">OXYGEN</div>
        <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
          <div className="progress-bar-fill" style={{ width: '92%', background: 'var(--accent-green)' }}></div>
        </div>
      </div>
    </div>
  )
}
