import { useEffect } from 'react'

/**
 * Sets document.title, meta[name=description], and (optionally) the
 * canonical link tag for as long as the calling page is mounted,
 * restoring the previous values on unmount. Pairs with
 * scripts/prerender.mjs, which sets the same tags statically in the
 * prebuilt HTML so search engines / ad-review crawlers see accurate
 * per-page metadata even before JavaScript runs.
 *
 * canonicalPath (optional): a path like '/lost-and-found/abc123'. Used
 * for dynamic, user-generated content pages (e.g. an individual Lost &
 * Found post) that don't have a prerendered static page of their own,
 * so each gets its own self-referencing canonical instead of silently
 * inheriting index.html's homepage canonical (which Search Console
 * flags as "Duplicate without user-selected canonical").
 */
export function useMeta({ title, description, canonicalPath }) {
  useEffect(() => {
    const prevTitle = document.title
    const metaEl = document.querySelector('meta[name="description"]')
    const prevDescription = metaEl ? metaEl.getAttribute('content') : null

    if (title) document.title = title
    if (description && metaEl) metaEl.setAttribute('content', description)

    let canonicalEl = null
    let prevCanonicalHref = null
    if (canonicalPath) {
      canonicalEl = document.querySelector('link[rel="canonical"]')
      if (canonicalEl) {
        prevCanonicalHref = canonicalEl.getAttribute('href')
      } else {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', `https://www.animaljoystories.com${canonicalPath}`)
    }

    return () => {
      document.title = prevTitle
      if (metaEl && prevDescription !== null) metaEl.setAttribute('content', prevDescription)
      if (canonicalEl && prevCanonicalHref !== null) canonicalEl.setAttribute('href', prevCanonicalHref)
    }
  }, [title, description, canonicalPath])
}
