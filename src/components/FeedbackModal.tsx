import { useState } from 'react'
import analytics from '../utils/analytics'
import './FeedbackModal.css'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

type FeedbackType = 'bug' | 'feature' | 'data' | 'question'

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Map feedback type to GitHub issue label and template
    const labelMap: Record<FeedbackType, string> = {
      bug: 'bug',
      feature: 'enhancement',
      data: 'data',
      question: 'question'
    }

    const emojiMap: Record<FeedbackType, string> = {
      bug: '🐛',
      feature: '✨',
      data: '📊',
      question: '❓'
    }

    // Build GitHub issue URL with pre-filled data
    const repoUrl = 'https://github.com/RTS-Technology-Solutions/space-haven-analysis-terminal-dashboard'
    const issueTitle = `${emojiMap[feedbackType]} ${title}`
    const issueBody = `**Submitted via SHAT Dashboard Feedback Form**

${description}

---
*User Agent: ${navigator.userAgent}*
*Timestamp: ${new Date().toISOString()}*`

    const params = new URLSearchParams({
      title: issueTitle,
      body: issueBody,
      labels: labelMap[feedbackType]
    })

    const githubUrl = `${repoUrl}/issues/new?${params.toString()}`

    // Track feedback submission
    analytics.trackEvent('Feedback', 'Submit', `${feedbackType} - ${title}`)
    analytics.trackOutboundLink(githubUrl, 'Feedback Form to GitHub')

    // Open GitHub in new tab
    window.open(githubUrl, '_blank', 'noopener,noreferrer')

    // Close modal and reset form
    handleClose()
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setFeedbackType('feature')
    onClose()
  }

  const typeOptions: { value: FeedbackType; label: string; icon: string }[] = [
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
    { value: 'feature', label: 'Feature Request', icon: '✨' },
    { value: 'data', label: 'Data Issue', icon: '📊' },
    { value: 'question', label: 'Question', icon: '❓' }
  ]

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="font-display">
            <span className="text-glow">FEEDBACK</span>
          </h2>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="feedback-intro">
            Share bugs, ideas, or questions with the community. This will open a GitHub issue
            with your feedback pre-filled.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="feedback-type">Type</label>
              <div className="type-buttons">
                {typeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`type-btn ${feedbackType === option.value ? 'active' : ''}`}
                    onClick={() => setFeedbackType(option.value)}
                  >
                    <span className="type-icon">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-title">Title *</label>
              <input
                id="feedback-title"
                type="text"
                className="terminal-input"
                placeholder="Brief description of your feedback..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
              <span className="char-count">{title.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-description">Details *</label>
              <textarea
                id="feedback-description"
                className="terminal-textarea"
                placeholder="Provide as much detail as possible..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                maxLength={1000}
              />
              <span className="char-count">{description.length}/1000</span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-terminal btn-terminal-outline" onClick={handleClose}>
                CANCEL
              </button>
              <button type="submit" className="btn-terminal" disabled={!title.trim() || !description.trim()}>
                OPEN GITHUB ISSUE
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </form>

          <div className="feedback-note">
            <p>
              <span className="status-dot status-ok"></span>
              You'll need a GitHub account to submit the issue.
            </p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Your feedback helps improve SHAT for everyone in the Space Haven community!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
