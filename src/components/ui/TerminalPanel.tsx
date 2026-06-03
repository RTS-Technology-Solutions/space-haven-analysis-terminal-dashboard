import { ReactNode } from 'react'
import './TerminalPanel.css'

interface TerminalPanelProps {
  title?: string
  children: ReactNode
  className?: string
  glow?: boolean
}

export default function TerminalPanel({ title, children, className = '', glow = false }: TerminalPanelProps) {
  return (
    <div className={`terminal-panel ${glow ? 'terminal-panel-glow' : ''} ${className}`}>
      {title && (
        <div className="panel-header">
          <h2 className="panel-title">{title}</h2>
          <div className="panel-indicator">
            <span className="status-dot status-ok"></span>
            <span className="cursor-blink"></span>
          </div>
        </div>
      )}
      <div className="panel-content">
        {children}
      </div>
    </div>
  )
}
