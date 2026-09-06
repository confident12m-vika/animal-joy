import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CONSENT_KEY = 'animaljoy_cookie_consent_v2' // JSON: { ads: bool, analytics: bool }

function pushConsentUpdate({ ads, analytics }) {
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  gtag('consent', 'update', {
    ad_storage: ads ? 'granted' : 'denied',
    ad_user_data: ads ? 'granted' : 'denied',
    ad_personalization: ads ? 'granted' : 'denied',
    analytics_storage: analytics ? 'granted' : 'denied',
  })
}

// Cookie consent banner with 3 options (Accept All / Reject All /
// Customize), legally required (GDPR) for any site running AdSense ads.
// Shown to every visitor and only dismisses once one of the three
// options is explicitly chosen — there is no close button or way to
// skip it without making a decision.
export default function CookieConsent() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [view, setView] = useState('main') // 'main' | 'customize'
  const [adsChoice, setAdsChoice] = useState(false)
  const [analyticsChoice, setAnalyticsChoice] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) {
      try {
        pushConsentUpdate(JSON.parse(saved))
      } catch {
        setVisible(true)
      }
    } else {
      setVisible(true)
    }
  }, [])

  function save(prefs) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
    pushConsentUpdate(prefs)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent-overlay" role="dialog" aria-live="polite" aria-modal="true">
      <div className="cookie-consent-box">
        {view === 'main' ? (
          <>
            <p className="cookie-consent-text">
              {t('cookieConsent.text')}{' '}
              <a href="/privacy" className="cookie-consent-link">{t('cookieConsent.privacyLink')}</a>
            </p>
            <div className="cookie-consent-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setView('customize')}>
                {t('cookieConsent.customize')}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => save({ ads: false, analytics: false })}>
                {t('cookieConsent.reject')}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => save({ ads: true, analytics: true })}>
                {t('cookieConsent.accept')}
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-consent-customize">
            <div className="cookie-consent-category">
              <div className="cookie-consent-category-head">
                <strong>{t('cookieConsent.necessaryTitle')}</strong>
                <span className="cookie-consent-always-on">✓</span>
              </div>
              <p>{t('cookieConsent.necessaryDesc')}</p>
            </div>

            <div className="cookie-consent-category">
              <div className="cookie-consent-category-head">
                <strong>{t('cookieConsent.adsTitle')}</strong>
                <label className="cookie-consent-switch">
                  <input type="checkbox" checked={adsChoice} onChange={(e) => setAdsChoice(e.target.checked)} />
                  <span className="cookie-consent-switch-slider" />
                </label>
              </div>
              <p>{t('cookieConsent.adsDesc')}</p>
            </div>

            <div className="cookie-consent-category">
              <div className="cookie-consent-category-head">
                <strong>{t('cookieConsent.analyticsTitle')}</strong>
                <label className="cookie-consent-switch">
                  <input type="checkbox" checked={analyticsChoice} onChange={(e) => setAnalyticsChoice(e.target.checked)} />
                  <span className="cookie-consent-switch-slider" />
                </label>
              </div>
              <p>{t('cookieConsent.analyticsDesc')}</p>
            </div>

            <div className="cookie-consent-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setView('main')}>
                {t('cookieConsent.back')}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => save({ ads: adsChoice, analytics: analyticsChoice })}>
                {t('cookieConsent.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
