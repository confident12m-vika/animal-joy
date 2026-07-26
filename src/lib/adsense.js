// AdSense only activates once you have a real Publisher ID from Google
// AdSense, set as VITE_ADSENSE_CLIENT_ID in your .env / Vercel environment
// variables. Until then, every ad slot on the site silently renders nothing
// — no broken boxes, no console errors, no impact on the site at all.
//
// The AdSense script tag itself is loaded statically from index.html (not
// injected by JavaScript), so Google's review crawler can detect it
// immediately without needing to run the app first.

export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || ''
export const isAdsenseConfigured = Boolean(ADSENSE_CLIENT_ID)
