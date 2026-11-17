import { BINS } from '../../data/waste'

// Two identical groups form a CSS-only loop; reduced motion exposes one scrollable group.
const ITEMS = Object.values(BINS).map((b) => `${b.bin}: ${b.tagline}`)

export default function Marquee() {
  return (
    <div className="marquee" aria-label="Geng Pilah">
      <div className="marquee-track">
        {ITEMS.map((text, i) => <span className="marquee-item" key={i}>{text}</span>)}
        {ITEMS.map((text, i) => <span className="marquee-item" key={`copy-${i}`} aria-hidden="true">{text}</span>)}
      </div>
    </div>
  )
}
