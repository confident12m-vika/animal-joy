// AdSense only activates once you have a real Publisher ID from Google
// AdSense, set as VITE_ADSENSE_CLIENT_ID in your .env / Vercel environment
// variables. Until then, every ad slot on the site silently renders nothing
// — no broken boxes, no console errors, no impact on the site at all.

export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || ''
export const isAdsenseConfigured = Boolean(ADSENSE_CLIENT_ID)

let scriptLoaded = false

export function loadAdSenseScript() {
  if (!isAdsenseConfigured || scriptLoaded) return
  scriptLoaded = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}
