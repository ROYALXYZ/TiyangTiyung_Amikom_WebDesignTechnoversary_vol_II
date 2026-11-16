import { useEffect } from 'react'
import { GUIDE_LINE } from './jejak'
import { isReduced, onFrame, scrollPos } from './smooth'

// Reveal sekali per elemen saat ujung garis (tour guide) menyentuhnya.
// Attribute data-reveal dipasang dari JS, jadi CSS tidak pernah menyembunyikan
// apa pun kalau JS gagal. Stagger lewat --pop-i.
const SELECTOR = '[data-pop], .eyebrow, .h2, .lede, .strong-line, .doodle, .trail-marker'
const LEAD = 8

export function usePop(deps = []) {
  useEffect(() => {
    const nodes = [...document.querySelectorAll(SELECTOR)].filter(
      // hero punya intro sendiri; anak dari elemen reveal lain ikut induknya
      (el) => !el.closest('.hero-pin') && !el.parentElement?.closest(SELECTOR),
    )
    nodes.forEach((el) => {
      el.dataset.reveal = ''
    })
    if (isReduced()) {
      nodes.forEach((el) => el.classList.add('pop-in'))
      return
    }
    // Posisi dokumen di-cache sekali; tiap frame hanya bandingkan ujung garis.
    let targets = []
    let next = 0
    let seq = 0
    const measure = () => {
      const y = scrollPos()
      targets = nodes
        .map((el) => ({ el, top: el.getBoundingClientRect().top + y }))
        .sort((a, b) => a.top - b.top)
      next = 0
      while (next < targets.length && targets[next].el.classList.contains('pop-in')) next++
    }
    const run = (y) => {
      const tip = y + window.innerHeight * GUIDE_LINE
      while (next < targets.length && targets[next].top <= tip + LEAD) {
        const el = targets[next].el
        el.style.setProperty('--pop-i', String(Math.min(seq++, 5)))
        el.classList.add('pop-in')
        next++
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
