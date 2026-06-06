import React from 'react'
import './DebugInfo.css'

interface DebugInfoProps {
  /** Unique identifier for this field (used in bug reports) */
  fieldId: string
  /** Human-readable label for this field */
  fieldLabel: string
  /** Description of the data source (XML path or calculation) */
  dataSource: string
  /** The current value being displayed */
  currentValue?: string | number | null
  /** Additional debug notes (optional) */
  notes?: string
  /** Whether debug mode is active */
  debugMode: boolean
  /** The actual content to render */
  children: React.ReactNode
}

/**
 * DebugInfo Wrapper Component
 * 
 * Wraps any UI element to provide debugging metadata when debug mode is enabled.
 * Shows field identifier, data source, calculations, and current value.
 * 
 * When debug mode is OFF: Renders children normally
 * When debug mode is ON: Adds debug overlay with metadata
 */
export const DebugInfo: React.FC<DebugInfoProps> = ({
  fieldId,
  fieldLabel,
  dataSource,
  currentValue,
  notes,
  debugMode,
  children
}) => {
  if (!debugMode) {
    // Debug mode off - render normally
    return <>{children}</>
  }

  // Debug mode on - add debug overlay
  return (
    <div className="debug-wrapper">
      <div className="debug-overlay">
        <div className="debug-header">
          <span className="debug-icon">🐛</span>
          <span className="debug-field-id">{fieldId}</span>
        </div>
        <div className="debug-details">
          <div className="debug-row">
            <strong>Label:</strong> {fieldLabel}
          </div>
          <div className="debug-row">
            <strong>Source:</strong> {dataSource}
          </div>
          {currentValue !== undefined && currentValue !== null && (
            <div className="debug-row">
              <strong>Value:</strong> {String(currentValue)}
            </div>
          )}
          {notes && (
            <div className="debug-row debug-notes">
              <strong>Notes:</strong> {notes}
            </div>
          )}
        </div>
      </div>
      <div className="debug-content">
        {children}
      </div>
    </div>
  )
}

export default DebugInfo
