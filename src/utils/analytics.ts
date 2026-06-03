import ReactGA from 'react-ga4'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-44BDQHFEQ0'

interface AnalyticsConfig {
  enabled: boolean
}

class Analytics {
  private initialized = false
  private config: AnalyticsConfig = { enabled: false }

  initialize(measurementId?: string) {
    const id = measurementId || GA_MEASUREMENT_ID
    
    if (!id || this.initialized) {
      console.warn('Analytics: No measurement ID provided or already initialized')
      return
    }

    try {
      ReactGA.initialize(id, {
        gaOptions: {
          anonymizeIp: true,
        },
      })
      this.initialized = true
      this.config.enabled = true
      console.log('Analytics initialized:', id)
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  trackPageView(path: string, title?: string) {
    if (!this.config.enabled) return

    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title,
    })
  }

  trackEvent(category: string, action: string, label?: string, value?: number) {
    if (!this.config.enabled) return

    ReactGA.event({
      category,
      action,
      label,
      value,
    })
  }

  trackUTM() {
    if (!this.config.enabled) return

    const urlParams = new URLSearchParams(window.location.search)
    const utm = {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      term: urlParams.get('utm_term'),
      content: urlParams.get('utm_content'),
    }

    if (Object.values(utm).some(v => v !== null)) {
      this.trackEvent('UTM', 'campaign_visit', JSON.stringify(utm))
    }
  }

  enable() {
    this.config.enabled = true
  }

  disable() {
    this.config.enabled = false
  }

  isEnabled(): boolean {
    return this.config.enabled
  }
}

export const analytics = new Analytics()
export default analytics
