import { useState, useEffect } from 'react'
import './CookieConsent.css'

interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <div className="cookie-icon">🍪</div>
        <div className="cookie-text">
          <h3>Cookie Notice</h3>
          <p>
            We use cookies and analytics to improve your experience and understand how the site is used.
            By clicking "Accept", you consent to analytics tracking. You can decline and still use the site.
          </p>
        </div>
      </div>
      <div className="cookie-actions">
        <button className="btn-terminal btn-decline" onClick={handleDecline}>
          Decline
        </button>
        <button className="btn-terminal btn-accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  )
}
