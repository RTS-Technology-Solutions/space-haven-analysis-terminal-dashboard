import React, { useState } from 'react'
import './DataSharingConsent.css'

interface DataSharingConsentProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

/**
 * Data Sharing Consent Dialog
 * 
 * Presents users with a clear data sharing agreement before capturing
 * snapshot data for debugging or research purposes.
 * 
 * Links to RTS Technology Solutions privacy policy and terms for full details.
 */
export const DataSharingConsent: React.FC<DataSharingConsentProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  const [hasReadPolicy, setHasReadPolicy] = useState(false)

  if (!isOpen) return null

  return (
    <div className="consent-overlay" onClick={onDecline}>
      <div className="consent-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="consent-header">
          <h2>📊 Data Sharing Agreement</h2>
          <button 
            className="consent-close" 
            onClick={onDecline}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="consent-body">
          <div className="consent-section">
            <h3>🔍 What We're Capturing</h3>
            <p>
              When you submit a snapshot for debugging or research, we capture:
            </p>
            <ul>
              <li><strong>Original XML save file</strong> - Your Space Haven game save</li>
              <li><strong>Parsed JSON data</strong> - The extracted game data structure</li>
              <li><strong>Page HTML snapshot</strong> - What you see on screen (metrics, values, layout)</li>
            </ul>
          </div>

          <div className="consent-section">
            <h3>🛡️ Your Privacy Matters</h3>
            <p>
              <strong>We take data rights seriously.</strong> Here's our commitment:
            </p>
            <ul>
              <li>✅ <strong>No Personal Information (PII)</strong> - We don't collect names, emails, or personal data</li>
              <li>✅ <strong>Never Sold</strong> - Your data will NEVER be sold to third parties</li>
              <li>✅ <strong>Never Used for Ads</strong> - No targeted advertising or marketing</li>
              <li>✅ <strong>Product Improvement Only</strong> - Used exclusively to improve this tool for your benefit</li>
              <li>✅ <strong>Research & Debugging</strong> - Helps us fix bugs and understand game mechanics</li>
            </ul>
          </div>

          <div className="consent-section consent-highlight">
            <h3>📜 Full Privacy Details</h3>
            <p>
              For complete information about how RTS Technology Solutions handles data:
            </p>
            <div className="consent-links">
              <a 
                href="https://rtsts.tech/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="consent-link"
              >
                📄 Privacy Policy
              </a>
              <a 
                href="https://rtsts.tech/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="consent-link"
              >
                📋 Terms of Service
              </a>
            </div>
          </div>

          <div className="consent-section consent-stored">
            <h3>💾 Where It's Stored</h3>
            <p>
              <strong>Currently:</strong> Snapshots are downloaded to your local machine for manual sharing.
            </p>
            <p>
              <strong>Future:</strong> Optional cloud upload for easier bug reporting (with your explicit permission each time).
            </p>
          </div>

          <div className="consent-checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={hasReadPolicy}
                onChange={(e) => setHasReadPolicy(e.target.checked)}
              />
              <span>
                I have read and understand the data sharing agreement. 
                I consent to sharing my Space Haven save data for debugging and product improvement purposes.
              </span>
            </label>
          </div>
        </div>

        <div className="consent-footer">
          <button 
            className="btn-decline" 
            onClick={onDecline}
          >
            ❌ Decline
          </button>
          <button 
            className="btn-accept" 
            onClick={onAccept}
            disabled={!hasReadPolicy}
            title={!hasReadPolicy ? "Please read and check the consent box" : "Accept and create snapshot"}
          >
            ✅ Accept & Create Snapshot
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataSharingConsent
