import { useEffect, useRef } from 'react'
import { BINS } from '../../data/waste'
import { onFrame, smoothAllowed } from '../../lib/smooth'

// Rail dekoratif: nama tong + tagline milik proyek sendiri.
const ITEMS = Object.values(BINS).map((b) => `${b.bin} · ${b.tagline}`)

// Dua salinan identik; satu salinan digeser per frame (drift + velocity scroll).
// Lebar salinan di-cache, jadi tidak ada layout read per frame.
export default function Marquee() {
  const track = useRef(null)

  useEffect(() => {
    const el = track.current
    if (!el || !smoothAllowed()) return
    let x = 0
    let last = 0
    let step = 0
    let live = true
    const measure = () => {
      const group = el.firstElementChild
      if (group) step = group.offsetWidth
    }
    const io = new IntersectionObserver(([entry]) => { live = entry.isIntersecting }, { rootMargin: '120px' })
    io.observe(el)
    const off = onFrame((y) => {
      const dy = Math.abs(y - last)
      last = y
      if (!live || !step) return
      x = (x + 0.35 + dy * 0.4) % step
      el.style.transform = `translate3d(${-x}px, 0, 0)`
    })
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      off()
      io.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const group = (key) => (
    <div className="marquee-group" key={key}>
      {ITEMS.map((text, i) => (
        <span className="marquee-item" key={`${key}${i}`}>{text}</span>
      ))}
    </div>
  )

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={track}>
        {group('a')}
        {group('b')}
      </div>
    </div>
  )
}
