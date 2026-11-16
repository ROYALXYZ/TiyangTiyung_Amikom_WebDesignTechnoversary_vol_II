import { useEffect } from 'react'
import { GUIDE_LINE, cornerPath, railX, tongEntryX } from './jejak'
import { isReduced, isTouch, onFrame, scrollPos } from './smooth'

// Pin gate: harus sama dengan media query di beranda.css (.tong-stage).
export const PIN_QUERY = '(min-width: 1024px) and (min-height: 720px)'

// Sapuan garis melintang 5 kartu Tong saat section 3 di-pin.
// Jalur lokal mulai di GUIDE_LINE gutter kiri dan berakhir di gutter kanan
// setinggi pusat kartu: keduanya tepat bertemu pita global tanpa putus.
// ponytail: satu section, satu sumbu; tambah parameter kalau ada stage kedua.
export function useTongSweep(stageRef, count, setActive) {
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const pin = stage.querySelector('[data-pin]')
    const strip = stage.querySelector('.strip')
    const svg = stage.querySelector('.strip-guide')
    const band = svg?.querySelector('.strip-guide-band')
    const core = svg?.querySelector('.strip-guide-core')
    const stubBand = svg?.querySelector('.strip-guide-stub-band')
    const stubCore = svg?.querySelector('.strip-guide-stub-core')
    const head = svg?.querySelector('.strip-guide-head')
    if (!pin || !strip || !svg || !band || !core || !stubBand || !stubCore || !head) return

    let top = 0
    let travel = 1
    let total = 1
    let cards = []
    let last = -2

    const measure = () => {
      const sr = stage.getBoundingClientRect()
      top = sr.top + scrollPos()
      travel = Math.max(1, sr.height - pin.offsetHeight)
      const pr = pin.getBoundingClientRect()
      const width = stage.offsetWidth
      svg.setAttribute('viewBox', `0 0 ${pin.offsetWidth} ${pin.offsetHeight}`)
      const taps = [...strip.querySelectorAll('.strip-tap')]
      if (!taps.length) return
      const first = taps[0].getBoundingClientRect()
      const lastTap = taps.at(-1).getBoundingClientRect()
      const cy = first.top - pr.top + first.height / 2
      const c0 = first.left - pr.left + first.width / 2
      const cN = lastTap.left - pr.left + lastTap.width / 2
      const guideY = window.innerHeight * GUIDE_LINE
      // x gutter sama dengan pita global: serah-terima tidak meleset.
      const xIn = tongEntryX(pin)
      const xOut = railX(width, 1318) - pr.left
      const cut = Math.min(72, Math.max(8, (c0 - xIn) / 2))
      // Titik keluar mengikuti tinggi kartu; kembali naik ke GUIDE_LINE akan
      // membalik garis dan memutus perjalanan di sisi Tong Abu-abu.
      const live = window.matchMedia(PIN_QUERY).matches && !isReduced() && !isTouch()
      if (!live) {
        band.setAttribute('d', '')
        core.setAttribute('d', '')
        stubBand.setAttribute('d', '')
        stubCore.setAttribute('d', '')
        total = 1
        cards = []
        last = -2
        return
      }
      const before = Math.max(xIn + 4, Math.min(c0 - cut, cN - 16))
      const after = Math.max(before + 8, Math.min(cN + cut, xOut - 4))
      const d = cornerPath([[xIn, guideY], [before, cy], [after, cy], [xOut, cy]], 56)
      if (!d) return
      band.setAttribute('d', d)
      core.setAttribute('d', d)
      // Tulang kiri mulai dari atas viewport; pita A turun di atasnya saat
      // mulai pin, tanpa ujung mengambang setelah kepala berbelok.
      const stub = `M ${xIn.toFixed(2)} -30 L ${xIn.toFixed(2)} ${guideY.toFixed(2)}`
      stubBand.setAttribute('d', stub)
      stubCore.setAttribute('d', stub)
      total = Math.max(1, core.getTotalLength())
      band.style.strokeDasharray = String(total)
      core.style.strokeDasharray = String(total)
      // Pusat semua kartu, bukan interpolasi ujung: transisi tidak mendahului kepala.
      cards = taps.map((tap) => {
        const rect = tap.getBoundingClientRect()
        const center = rect.left - pr.left + rect.width / 2
        for (let at = 0; at <= total; at += 2) {
          if (core.getPointAtLength(at).x >= center) return at
        }
        return total
      })
      last = -2
    }

    const run = (y) => {
      const live = window.matchMedia(PIN_QUERY).matches && !isReduced() && !isTouch()
      const p = live ? (y - top) / travel : -1
      if (Math.abs(p - last) < 0.0005) return
      last = p
      if (!live) {
        head.style.opacity = '0'
        return
      }
      // Lenis membulatkan posisi scroll; toleransi subpiksel menjaga kepala
      // tetap tepat di titik masuk/keluar saat batas pin tersentuh.
      const inStage = live && y >= top - 0.5
      const atEnd = live && y >= top + travel - 0.5
      const drawn = !inStage ? 0 : atEnd ? total : total * Math.max(0, Math.min(1, p))
      stubBand.style.opacity = inStage ? '1' : '0'
      stubCore.style.opacity = inStage ? '1' : '0'
      band.style.strokeDashoffset = String(total - drawn)
      core.style.strokeDashoffset = String(total - drawn)
      const tip = core.getPointAtLength(Math.min(total, drawn))
      head.style.transform = `translate(${tip.x.toFixed(1)}px, ${tip.y.toFixed(1)}px)`
      head.style.opacity = !inStage || atEnd ? '0' : '1'
      const next = Math.max(0, Math.min(count - 1, cards.reduce((index, at, i) => drawn >= at ? i : index, 0)))
      setActive(current => current === next ? current : next)
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
