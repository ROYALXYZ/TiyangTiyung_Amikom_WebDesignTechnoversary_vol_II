import { useLayoutEffect, useRef } from 'react'

/**
 * Inline animated SVG from src/assets/svg/*.svg (?raw).
 *
 * Two things make the generated files usable in a layout:
 *  1. Inline, not <img> — @keyframes inside an externally referenced SVG are
 *     inert, so an <img> would ship the artwork completely static.
 *  2. viewBox crop — the generator always emits an 800x540 canvas with the
 *     figure drawn small at the centre. Left as-is it renders as a dot in a
 *     huge empty box. Fit the viewBox to the figure's real bounds at mount.
 *
 * ponytail: dangerousSetInnerHTML over local repo files only, never user input.
 */
const PAD = 8

export default function RawArt({ svg, className = '', label, style }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current?.firstElementChild
    if (!root) return
    // Scale-invariant: getBBox() is in viewBox units regardless of CSS size.
    const box = root.getBBox()
    if (!box.width || !box.height) return
    root.setAttribute(
      'viewBox',
      `${box.x - PAD} ${box.y - PAD} ${box.width + PAD * 2} ${box.height + PAD * 2}`,
    )
    // The generator writes width/height 100% inline; let CSS own the sizing.
    root.removeAttribute('width')
    root.removeAttribute('height')
    root.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  }, [])

  return (
    <span
      ref={ref}
      className={`raw-art ${className}`}
      style={style}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' })}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
