import { useEffect, useRef } from 'react'
import { onFrame, scrollPos } from '../../lib/smooth'

// Satu botol berpindah antaradegan, bukan penanda tetap di tepi layar.
const STOPS = [
  { selector: '.hero-bottle-scene', place: (r) => [r.left, r.top] },
  { selector: '#fakta-1 .asal-grid', place: (r) => [r.left + r.width * 0.52, r.bottom + 12] },
  // Botol plastik menuju tong kuning, bukan melayang di atas tong merah.
  { selector: '#kenalan .strip-tap:nth-child(2)', place: (r) => [r.left + r.width / 2 - 130, r.top - 115] },
  { selector: '#fakta-2 .jalan-row', place: (r) => [r.right - 130, r.top - 100] },
  { selector: '#jurus .jurus-grid', place: (r) => [r.right - 110, r.bottom + 24] },
  { selector: '#fakta-3 .foto-konteks', place: (r) => [r.right + 22, r.top + 25] },
  { selector: '#jadi-ini .jadi-grid', place: (r) => [r.right - 140, r.top - 100] },
  { selector: '#main-game .pita-game', place: (r) => [r.right - 160, r.top - 100] },
]

export default function BotolBerjalan() {
  const figure = useRef(null)

  useEffect(() => {
    const el = figure.current
    const main = el?.parentElement
    if (!main) return
    const stops = STOPS.map(({ selector }) => main.querySelector(selector))
    if (stops.some((stop) => !stop)) return

    let points = []
    let enabled = false
    const media = window.matchMedia('(min-width: 1280px) and (prefers-reduced-motion: no-preference)')

    const update = (y) => {
      if (!enabled || points.length < 2) return
      const at = Math.max(0, y)
      let i = 0
      while (i < points.length - 2 && at > points[i + 1].scroll) i++
      const from = points[i]
      const to = points[i + 1]
      const t = Math.max(0, Math.min(1, (at - from.scroll) / Math.max(1, to.scroll - from.scroll)))
      // Setiap persinggahan punya posisi tetap. Antarbagian botol ikut gulir,
      // tanpa memindahkan halaman atau menutupi tombol (pointer-events: none).
      const x = from.x + (to.x - from.x) * t
      const top = from.y + (to.y - from.y) * t
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${top.toFixed(1)}px, 0) rotate(${(Math.sin(t * Math.PI) * (to.x > from.x ? 8 : -8)).toFixed(1)}deg)`
      el.style.opacity = at > points.at(-1).scroll + window.innerHeight * 0.9 ? '0' : '1'
    }

    const measure = () => {
      enabled = media.matches && document.documentElement.dataset.motion === 'smooth'
      main.classList.toggle('has-bottle-route', enabled)
      if (!enabled) return
      const mainRect = main.getBoundingClientRect()
      points = stops.map((stop, i) => {
        const [x, top] = STOPS[i].place(stop.getBoundingClientRect())
        const y = top - mainRect.top
        return { x: x - mainRect.left, y, scroll: i === 0 ? 0 : Math.max(0, y - window.innerHeight * 0.46) }
      })
      update(scrollPos())
    }

    // App memasang startMotion di efek terpisah. Tunggu satu frame agar mode sudah disetel.
    const frame = requestAnimationFrame(measure)
    const off = onFrame(update)
    const observer = new ResizeObserver(measure)
    observer.observe(main)
    stops.forEach((stop) => observer.observe(stop))
    window.addEventListener('resize', measure)
    media.addEventListener('change', measure)
    let mounted = true
    document.fonts?.ready.then(() => { if (mounted) measure() })

    return () => {
      mounted = false
      cancelAnimationFrame(frame)
      off()
      observer.disconnect()
      window.removeEventListener('resize', measure)
      media.removeEventListener('change', measure)
      main.classList.remove('has-bottle-route')
    }
  }, [])

  return (
    <div className="bottle-route" ref={figure} aria-hidden="true">
      <svg viewBox="0 0 124 88" fill="none">
        <path d="M4 19C27 10 48 13 71 22M17 44C37 33 59 36 86 43M6 71C29 59 55 62 69 67" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <img src="/svg/items/plastic-bottle.svg" alt="" width="72" height="72" />
    </div>
  )
}
