import { useEffect } from 'react'

/**
 * Sets document.title and the meta[name=description] tag for as long as
 * the calling page is mounted, restoring the previous values on unmount.
 * Pairs with scripts/prerender.mjs, which sets the same tags statically
 * in the prebuilt HTML so search engines / ad-review crawlers see
 * accurate per-page metadata even before JavaScript runs.
 */
export function useMeta({ title, description }) {
  useEffect(() => {
    const prevTitle = document.title
    const metaEl = document.querySelector('meta[name="description"]')
    const prevDescription = metaEl ? metaEl.getAttribute('content') : null

    if (title) document.title = title
    if (description && metaEl) metaEl.setAttribute('content', description)

    return () => {
      document.title = prevTitle
      if (metaEl && prevDescription !== null) metaEl.setAttribute('content', prevDescription)
    }
  }, [title, description])
}
