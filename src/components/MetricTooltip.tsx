import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './MetricTooltip.css'

interface MetricTooltipProps {
  title: string
  why: string
  how: string | React.ReactNode
  what: string
}

export default function MetricTooltip({ title, why, how, what }: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const iconRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => setIsVisible(true)
  const hideTooltip = () => setIsVisible(false)

  useEffect(() => {
    if (isVisible && iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      // Calculate position relative to icon
      let top = iconRect.bottom + 8 // 8px below icon
      let left = iconRect.left - (tooltipRect.width / 2) + (iconRect.width / 2) // Center under icon
      
      // Keep tooltip on screen horizontally
      const rightEdge = left + tooltipRect.width
      const leftEdge = left
      
      if (rightEdge > window.innerWidth - 16) {
        // Too far right, align to right edge
        left = window.innerWidth - tooltipRect.width - 16
      } else if (leftEdge < 16) {
        // Too far left, align to left edge
        left = 16
      }
      
      // Keep tooltip on screen vertically
      const bottomEdge = top + tooltipRect.height
      if (bottomEdge > window.innerHeight - 16) {
        // If tooltip would go below screen, show it above the icon instead
        top = iconRect.top - tooltipRect.height - 8
      }
      
      setPosition({ top, left })
    }
  }, [isVisible])

  return (
    <>
      <div 
        ref={iconRef}
        className="metric-info-icon"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={() => setIsVisible(!isVisible)}
      >
        ℹ️
      </div>
      
      {isVisible && createPortal(
        <div 
          ref={tooltipRef}
          className="metric-tooltip"
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="metric-tooltip-header">{title}</div>
          
          <div className="metric-tooltip-section">
            <div className="metric-tooltip-section-title">💡 WHY (So that...)</div>
            <div className="metric-tooltip-text">{why}</div>
          </div>
          
          <div className="metric-tooltip-section">
            <div className="metric-tooltip-section-title">🔢 HOW (Data Source)</div>
            <div className="metric-tooltip-text">{how}</div>
          </div>
          
          <div className="metric-tooltip-section">
            <div className="metric-tooltip-section-title">🎯 ACTIONS</div>
            <div className="metric-tooltip-text">{what}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
