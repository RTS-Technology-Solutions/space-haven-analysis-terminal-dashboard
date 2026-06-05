import { useState, useEffect } from 'react'
import './ComingSoon.css'

interface ComingSoonProps {
  targetDate: string
  onDismiss?: () => void
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function ComingSoon({ targetDate, onDismiss }: ComingSoonProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference < 0) {
        setIsLive(true)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (isLive && onDismiss) {
    onDismiss()
    return null
  }

  return (
    <div className="coming-soon-overlay">
      <div className="tech-grid"></div>
      <div className="coming-soon-banner">
        <div className="scanline"></div>
        
        <h1 className="coming-soon-title">
          <span className="tech-prefix">//_ LAUNCHING SOON</span>
          <span className="text-glow">S.H.A.T. Dashboard</span>
        </h1>

        <p className="coming-soon-description">
          A professional save file analysis tool crafted with precision,
          powered by community data, and delivered with transparency.
          Get ready to explore your Space Haven universe like never before.
        </p>

        {isLive ? (
          <div className="live-indicator">
            <span className="status-dot status-ok"></span>
            🚀 LIVE NOW
          </div>
        ) : (
          <div className="countdown">
            <div className="countdown-item">
              <span className="countdown-number">{String(timeRemaining.days).padStart(2, '0')}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{String(timeRemaining.hours).padStart(2, '0')}</span>
              <span className="countdown-label">Hrs</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{String(timeRemaining.minutes).padStart(2, '0')}</span>
              <span className="countdown-label">Min</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{String(timeRemaining.seconds).padStart(2, '0')}</span>
              <span className="countdown-label">Sec</span>
            </div>
          </div>
        )}

        <div className="coming-soon-footer">
          Meanwhile, check out the <a href="/data" className="text-glow">Data Dictionary</a> or the <a href="/beta-dash" className="text-glow">Beta Wireframe</a> →
        </div>
      </div>
    </div>
  )
}
