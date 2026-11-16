import { useState } from 'react'

// Slot drop-in: taruh SVG di public/svg/art/<nama>.svg, file hilang = slot diam.
export default function ArtSlot({ name, className = '', alt = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      className={`art-slot ${className}`.trim()}
      src={`/svg/art/${name}.svg`}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
