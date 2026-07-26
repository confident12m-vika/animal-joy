import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT_ID, isAdsenseConfigured } from '../lib/adsense.js'

// Drop this anywhere you want an ad to appear. It renders nothing at all
// until AdSense is configured (see README), so it's completely safe to
// leave in place while waiting for approval.
export default function AdSlot({ slot, format = 'auto', label = true }) {
  const insRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!isAdsenseConfigured || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense script not ready yet or blocked by an ad blocker \u2014 fine to ignore.
    }
  }, [])

  if (!isAdsenseConfigured) return null

  return (
    <div className="ad-slot">
      {label && <p className="ad-slot-label">Advertisement</p>}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <style>{`
        .ad-slot { margin: 32px 0; text-align: center; }
        .ad-slot-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--ink-soft); margin-bottom: 6px; opacity: 0.7;
        }
      `}</style>
    </div>
  )
}
