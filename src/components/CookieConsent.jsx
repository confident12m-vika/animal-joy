import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CONSENT_KEY = 'animaljoy_cookie_consent' // 'granted' | 'denied'

function pushConsentUpdate(status) {
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  const granted = status === 'granted'
  gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

// Cookie consent banner, legally required (GDPR and similar) for any site
// running AdSense. Shown to every visitor on first load and stays visible
// until they make a choice (accept or reject) — the choice is stored
// locally and the question isn't asked again.
export default function CookieConsent() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved === 'granted' || saved === 'denied') {
      pushConsentUpdate(saved)
    } else {
      setVisible(true)
    }
  }, [])

  function choose(status) {
    localStorage.setItem(CONSENT_KEY, status)
    pushConsentUpdate(status)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent-overlay" role="dialog" aria-live="polite">
      <div className="cookie-consent-box">
        <p className="cookie-consent-text">
          {t('cookieConsent.text')}{' '}
          <a href="/privacy" className="cookie-consent-link">{t('cookieConsent.privacyLink')}</a>
        </p>
        <div className="cookie-consent-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => choose('denied')}>
            {t('cookieConsent.reject')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => choose('granted')}>
            {t('cookieConsent.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
