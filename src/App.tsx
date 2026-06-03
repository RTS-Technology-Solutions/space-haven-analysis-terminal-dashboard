import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import DashboardPage from './pages/DashboardPage'
import DataPage from './pages/DataPage'
import analytics from './utils/analytics'
import './utils/easterEgg' // 💩 The true origin story lives here
import './App.css'

function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search)
    analytics.trackUTM()
  }, [location])

  return null
}

function App() {
  // Initialize analytics if user previously accepted cookies
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'accepted') {
      analytics.initialize()
      analytics.enable()
    }
  }, [])

  const handleCookieAccept = () => {
    analytics.initialize() // Uses hardcoded GA ID from analytics.ts
    analytics.enable()
    analytics.trackPageView(window.location.pathname)
  }

  const handleCookieDecline = () => {
    analytics.disable()
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <AnalyticsTracker />
        <CookieConsent onAccept={handleCookieAccept} onDecline={handleCookieDecline} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dash" element={
            <>
              <Header />
              <main className="main-content">
                <DashboardPage />
              </main>
            </>
          } />
          <Route path="/data" element={
            <>
              <Header />
              <main className="main-content">
                <DataPage />
              </main>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
