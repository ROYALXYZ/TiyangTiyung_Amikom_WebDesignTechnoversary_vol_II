import { useEffect } from 'react'
import { isReduced, isTouch, onFrame, scrollPos } from './smooth'

// Pin gate: harus sama dengan media query di beranda.css (.tong-stage).
export const PIN_QUERY = '(min-width: 1024px) and (min-height: 720px)'

// Stage I2 di-pin: scroll vertikal memilih tong aktif satu per satu.
// Tanpa pin (mobile / reduced motion) kelima tong tetap bisa di-tap manual.
export function useTongSweep(stageRef, count, setActive) {
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
      const live = window.matchMedia(PIN_QUERY).matches && !isReduced() && !isTouch()
      const p = live ? (y - top) / travel : -1
      if (Math.abs(p - last) < 0.0005) return
      last = p
      if (p < 0) return
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
    window.addEventListener('resize', remeasure)
    document.fonts?.ready.then(remeasure)
    return () => {
      off()
      window.removeEventListener('resize', remeasure)
    }
  }, [stageRef, count, setActive])
}
