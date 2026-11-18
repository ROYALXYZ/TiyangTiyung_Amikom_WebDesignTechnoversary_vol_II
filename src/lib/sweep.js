import { useEffect, useRef } from 'react'
import { isReduced, isTouch, onFrame, scrollPos } from './smooth'

// Pin gate: harus sama dengan media query di beranda.css (.tong-stage).
export const PIN_QUERY = '(min-width: 1024px) and (min-height: 900px)'

// Stage I2 di-pin pada desktop tinggi: scroll vertikal memilih tong aktif satu per satu.
// Tanpa pin (mobile / reduced motion) kelima tong tetap bisa di-tap manual.
export function useTongSweep(stageRef, count, setActive) {
  const manual = useRef(false)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const pin = stage.querySelector('[data-pin]')
    if (!pin) return

    let top = 0
    let travel = 1
    let last = -2

    const measure = () => {
      const sr = stage.getBoundingClientRect()
      top = sr.top + scrollPos()
      travel = Math.max(1, sr.height - pin.offsetHeight)
      last = -2
    }

    const run = (y) => {
      // Frame Lenis yang masih meluncur setelah klik bukan input baru.
      if (manual.current && y >= top && y <= top + stage.offsetHeight) return
      if (manual.current) { manual.current = false; last = -2 }
      const live = window.matchMedia(PIN_QUERY).matches && !isReduced() && !isTouch()
      const p = live ? (y - top) / travel : -1
      if (Math.abs(p - last) < 0.0005) return
      last = p
      if (p < 0 || p > 1) return
      const next = Math.max(0, Math.min(count - 1, Math.floor(p * count)))
      setActive((current) => (current === next ? current : next))
    }

    measure()
    run(scrollPos())
    const off = onFrame(run)
    const remeasure = () => {
      measure()
      run(scrollPos())
    }
    const resume = () => { manual.current = false; last = -2 }
    const resumeKey = (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) resume()
    }
    window.addEventListener('resize', remeasure)
    window.addEventListener('wheel', resume, { passive: true })
    window.addEventListener('keydown', resumeKey)
    let mounted = true
    document.fonts?.ready.then(() => { if (mounted) remeasure() })
    const observer = new ResizeObserver(remeasure)
    observer.observe(stage)
    observer.observe(pin)
    return () => {
      mounted = false
      observer.disconnect()
      off()
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('wheel', resume)
      window.removeEventListener('keydown', resumeKey)
    }
  }, [stageRef, count, setActive])
  return () => { manual.current = true }
}
