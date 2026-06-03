import { Link } from 'react-router-dom'
import analytics from '../utils/analytics'
import './Home.css'

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="tech-grid-bg"></div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="status-dot status-ok"></span>
            Community-Powered Analysis
          </div>

          <h1 className="hero-title font-display">
            <span className="text-glow">S.H.A.T.</span>
            <span className="hero-subtitle">Space Haven Analysis Terminal</span>
          </h1>

          <p className="hero-description">
            Decode your Space Haven save files with precision analytics, 
            community-sourced data dictionaries, and powerful insights.
            Built by a fan, for the community.
          </p>

          <div className="hero-cta">
            <Link 
              to="/dash" 
              className="btn-terminal btn-terminal-lg"
              onClick={() => analytics.trackEvent('Navigation', 'Click', 'Hero CTA - Launch Dashboard')}
            >
              LAUNCH DASHBOARD
              <span className="btn-arrow">→</span>
            </Link>
            <Link 
              to="/data" 
              className="btn-terminal btn-terminal-outline btn-terminal-lg"
              onClick={() => analytics.trackEvent('Navigation', 'Click', 'Hero CTA - Explore Data')}
            >
              EXPLORE DATA
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Save File Analysis</h3>
            <p className="feature-description">
              Upload your save files and get detailed breakdowns of ships, crew, resources, and station progress.
            </p>
            <span className="feature-status">Coming July 1, 2026</span>
          </div>

          <div className="feature-card feature-available">
            <div className="feature-icon">📖</div>
            <h3 className="feature-title">Data Dictionary</h3>
            <p className="feature-description">
              Browse 270+ game object ID mappings, reverse-engineered by the community.
              Searchable and downloadable.
            </p>
            <Link 
              to="/data" 
              className="feature-link"
              onClick={() => analytics.trackEvent('Navigation', 'Click', 'Feature Card - Data Dictionary')}
            >
              Available Now →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Insights</h3>
            <p className="feature-description">
              Get recommendations on crew optimization, resource management, and station efficiency.
            </p>
            <span className="feature-status">Planned Feature</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Progress Tracking</h3>
            <p className="feature-description">
              Compare save files over time and visualize your station's growth and evolution.
            </p>
            <span className="feature-status">Planned Feature</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <div className="about-content">
          <h2 className="section-title">
            <span className="text-glow">ABOUT THIS PROJECT</span>
          </h2>
          
          <div className="about-grid">
            <div className="about-card">
              <h3>🚀 Community-Driven</h3>
              <p>
                Built using reverse-engineered data from the Space Haven modding community.
                This tool gives back by making that data more accessible and useful.
              </p>
            </div>

            <div className="about-card">
              <h3>🔓 Open & Transparent</h3>
              <p>
                All community data is downloadable. Future features will be documented
                and shared with the community. No paywalls, no ads.
              </p>
            </div>

            <div className="about-card">
              <h3>⚡ Built by a Fan</h3>
              <p>
                Created by a software engineer and data analyst who enjoys building cool stuff.
                Not affiliated with Bugbyte Ltd. or the official Space Haven game.
              </p>
            </div>
          </div>

          <div className="disclaimer">
            <p>
              <strong>Disclaimer:</strong> This is a fan-made tool and is not affiliated with, endorsed by,
              or connected to Bugbyte Ltd. or Space Haven. Space Haven is a trademark of Bugbyte Ltd.
            </p>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="text-glow">S.H.A.T.</span> Command Center
          </div>
          <div className="footer-links">
            <a 
              href="https://rtsts.tech?utm_source=shat-dashboard&utm_medium=referral&utm_campaign=footer-link" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => analytics.trackOutboundLink('https://rtsts.tech', 'Footer RTS Link')}
            >
              Powered by RTS Technology & Solutions
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
