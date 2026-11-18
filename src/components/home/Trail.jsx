import { useEffect, useRef } from 'react'
import { isReduced, onFrame } from '../../lib/smooth'

/* ===========================================================
   Jejak Petualangan — satu lintasan yang tergambar saat digulir.
   Bentuknya dihitung dari tinggi seksi sungguhan, jadi tetap benar
   setelah font atau viewport berubah. Dekoratif: aria-hidden, tanpa
   tab-stop, dan tanpa JS garisnya tampil utuh.
   =========================================================== */

// Simpul ditaruh di tengah-tengah gutter, bergantian kiri dan kanan supaya
// lintasan terasa menyeberang. Lintasan mengalir hanya di zona 20..80 agar
// tidak pernah melintasi teks. Semua target harus berada di dalam
// `.beranda-flow`; di luar itu posisinya relatif ke 0 dan simpulnya nyasar.
const TARGETS = ['#fakta-1', '#kenalan', '#fakta-2', '#jurus', '#jadi-ini']
const knotAt = (i) => (i % 2 === 0 ? 20 : 80)

function buildPath(marks) {
  if (marks.length < 2) return ''
  let d = `M ${knotAt(0)} ${marks[0].y}`
  for (let i = 0; i < marks.length - 1; i += 1) {
    const a = marks[i]
    const b = marks[i + 1]
    const ax = knotAt(i)
    const bx = knotAt(i + 1)
    const midY = (a.y + b.y) / 2
    // Kurva lewat tengah celah antara dua seksi, jadi geraknya terbaca
    // tanpa melintasi blok teks di atas atau di bawahnya.
    d += ` C ${ax} ${midY - 40} ${bx} ${midY + 40} ${bx} ${b.y}`
  }
  return d
}

export default function Trail() {
  const host = useRef(null)
  const svg = useRef(null)
  const line = useRef(null)

  useEffect(() => {
    const node = host.current
    const ellipse = svg.current
    const path = line.current
    if (!node || !ellipse || !path) return
    const flow = node.parentElement
    if (!flow) return

    let height = 0
    let total = 0
    let ready = false

    const measure = () => {
      const top = flow.getBoundingClientRect().top + window.scrollY
      const marks = TARGETS.map((sel) => {
        const el = flow.querySelector(sel)
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { y: Math.round(r.top + window.scrollY - top) }
      }).filter(Boolean)
      if (marks.length < 2) return

      height = Math.max(marks[marks.length - 1].y + 320, 800)
      ellipse.setAttribute('viewBox', `0 0 100 ${height}`)
      ellipse.setAttribute('height', String(height))
      // Simpul memakai persen x dan piksel y: sama dengan koordinat di SVG.
      path.setAttribute('d', buildPath(marks))
      total = path.getTotalLength()
      path.style.strokeDasharray = `${total}`
      path.style.strokeDashoffset = isReduced() ? '0' : `${total}`
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        if (!marks[i]) return
        knot.style.setProperty('--knot-x', `${knotAt(i)}%`)
        knot.style.setProperty('--knot-y', `${marks[i].y}px`)
      })
      ready = true
    }

    measure()
    if (isReduced()) {
      node.style.setProperty('--trail-draw', '1')
      return () => {}
    }
    let saveData = false
    try { saveData = navigator.connection?.saveData === true } catch { saveData = false }
    if (saveData) {
      path.style.strokeDashoffset = '0'
      node.style.setProperty('--trail-draw', '1')
      return () => {}
    }

    const off = onFrame((y) => {
      if (!ready) return
      const top = flow.getBoundingClientRect().top + y
      const from = top - window.innerHeight * 0.75
      const travel = Math.max(height - window.innerHeight * 0.25, 1)
      const p = Math.min(1, Math.max(0, (y - from) / travel))
      path.style.strokeDashoffset = `${(1 - p) * total}`
      node.style.setProperty('--trail-draw', p.toFixed(4))
    })

    const onResize = () => { measure(); off() }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(measure)
    return () => {
      off()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="trail" ref={host} aria-hidden="true">
      <svg className="trail-svg" ref={svg} viewBox="0 0 100 800" preserveAspectRatio="none">
        <path className="trail-line" ref={line} d="" />
      </svg>
      {TARGETS.map((sel, i) => (
        <span className="trail-knot" data-trail-knot key={sel}>
          <span className="trail-knot-ring" />
          <span className="trail-knot-dot" />
        </span>
      ))}
    </div>
  )
}
