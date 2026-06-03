import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FeedbackModal from '../components/FeedbackModal'

// Mock analytics
vi.mock('../utils/analytics', () => ({
  default: {
    trackEvent: vi.fn(),
    trackOutboundLink: vi.fn(),
  }
}))

describe('FeedbackModal', () => {
  it('renders when open', () => {
    const onClose = vi.fn()
    render(<FeedbackModal isOpen={true} onClose={onClose} />)
    
    expect(screen.getByRole('heading', { name: /FEEDBACK/i })).toBeDefined()
    expect(screen.getByLabelText(/Title \*/i)).toBeDefined()
    expect(screen.getByLabelText(/Details \*/i)).toBeDefined()
  })

  it('does not render when closed', () => {
    const onClose = vi.fn()
    const { container } = render(<FeedbackModal isOpen={false} onClose={onClose} />)
    
    expect(container.firstChild).toBeNull()
  })

  it('calls onClose when cancel button clicked', () => {
    const onClose = vi.fn()
    render(<FeedbackModal isOpen={true} onClose={onClose} />)
    
    const cancelButton = screen.getByText(/CANCEL/i)
    fireEvent.click(cancelButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('disables submit button when form is incomplete', () => {
    const onClose = vi.fn()
    render(<FeedbackModal isOpen={true} onClose={onClose} />)
    
    const submitButton = screen.getByText(/OPEN GITHUB ISSUE/i)
    expect(submitButton.hasAttribute('disabled')).toBe(true)
  })

  it('enables submit button when form is complete', () => {
    const onClose = vi.fn()
    render(<FeedbackModal isOpen={true} onClose={onClose} />)
    
    const titleInput = screen.getByLabelText(/Title \*/i) as HTMLInputElement
    const descriptionInput = screen.getByLabelText(/Details \*/i) as HTMLTextAreaElement
    
    fireEvent.change(titleInput, { target: { value: 'Test feedback' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } })
    
    const submitButton = screen.getByText(/OPEN GITHUB ISSUE/i)
    expect(submitButton.hasAttribute('disabled')).toBe(false)
  })
})
