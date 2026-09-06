import { useState } from 'react'

// Drop-in replacement for a plain <img> used across the public site.
// Fixes the "image paints top-to-bottom while decoding" effect on slow
// connections: the image stays fully transparent (opacity: 0) while it
// downloads/decodes, then fades in smoothly once fully loaded (onLoad),
// so visitors see a clean blank space instead of a partially-drawn image.
// Renders a single <img> (no wrapper element) so it's a safe drop-in
// replacement — any existing className/style/object-fit/sizing rules
// that targeted the original <img> keep working exactly as before.
export default function LazyImage({ src, alt = '', className = '', style, ...rest }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`lazy-image ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
      style={{ transition: 'opacity 0.35s ease', opacity: loaded ? 1 : 0, ...style }}
      {...rest}
    />
  )
}
