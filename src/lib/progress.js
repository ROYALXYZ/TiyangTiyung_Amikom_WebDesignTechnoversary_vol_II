import { useEffect } from 'react'
import { onFrame, isReduced } from './smooth'

// --progress dari geometri ter-cache: tidak ada layout read per frame.
// Progress = seberapa jauh elemen ter-pin sudah bergerak:
// 0 saat top elemen menyentuh atas viewport, 1 saat pin lepas (height - vh).
// ponytail: hanya model pin; elemen non-pin pakai tinggi sendiri (jarang = 1).
// Kalau nanti butuh progress bebas-viewport, tambah data-progress-from/to.
export function useProgressVars(deps = []) {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-progress]')]
    if (!els.length) return

    let items = []
    const measure = () => {
      items = els.map((el) => {
        const r = el.getBoundingClientRect()
        // tinggi elemen ter-pin, bukan innerHeight: svh/100dvh bisa beda
        // dengan innerHeight (chrome URL bar, emulasi) sehingga travel meleset.
        const pin = el.querySelector('[data-pin]')
        const travel = r.height - (pin?.offsetHeight || window.innerHeight)
        return {
          el,
          top: r.top + window.scrollY,
          // tanpa ruang pin (hero di mobile): progress ikut tinggi elemen
          denom: travel > 1 ? travel : r.height || 1,
          last: -1,
        }
      })
    }

    const off = onFrame((y) => {
      const still = isReduced()
      for (const it of items) {
        const p = still ? 0 : Math.min(1, Math.max(0, (y - it.top) / it.denom))
        const value = p.toFixed(4)
        if (value === it.last) continue
        it.last = value
        it.el.style.setProperty('--progress', value)
      }
    })

    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      off()
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
