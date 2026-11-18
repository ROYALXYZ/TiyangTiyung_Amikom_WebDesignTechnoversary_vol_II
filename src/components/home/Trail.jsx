import { useEffect, useRef } from 'react'
import { isReduced, onFrame } from '../../lib/smooth'

/* ===========================================================
   Jejak Petualangan — sungai pelangi dari hulu ke hilir.
   Bentuknya dihitung dari tinggi seksi sungguhan, jadi tetap benar
   setelah font atau viewport berubah. Dekoratif: aria-hidden, tanpa
   tab-stop, dan tanpa JS sungainya tampil utuh.
   =========================================================== */

const TARGETS = ['#fakta-1', '#kenalan', '#fakta-2', '#jurus', '.station-card', '.station-footer', '#jadi-ini']
const KNOTS = ['var(--color-organic)', 'var(--color-anorganic)', 'var(--color-b3)', 'var(--color-paper)', 'var(--color-residu)', 'var(--color-organic)']

// Hulu sungai masuk dari atas layar. y=0 di tepi atas `.beranda-flow`
// (di dalam hero, karena kartu seksi berikutnya naik menutupinya).
const SOURCE_OFFSET = () => -Math.round(window.innerHeight * 0.5)

// Aliran tipis: 0.34 unit viewBox ≈ 4.9px di 1440px. Ditaruh sebagai
// atribut, bukan CSS: CSS mengubah `stroke-width: .34` jadi 0.34px dan
// garisnya hilang.
const STROKE_WIDTH = 0.34
// Jarak antar pita: 0.55 unit ≈ 8px di 1440px. Lima warna terbaca sebagai
// satu aliran pelangi, bukan lima garis berserak.
const SPREAD = 0.55
const RAINBOW = ['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6']

// Setengah-lebar loop dalam PIKSEL di layar 1440. Dikonversi ke unit viewBox
// lewat lebar elemen saat diukur.
const LOOP_RX_PX = 34
// Setengah-tinggi loop. Pipa pelangi hanya ~11px per pita, jadi loop 68x52px
// sudah terbaca sebagai lingkaran.
const LOOP_RY = 26

/**
 * Aliran hulu→hilir di LAJUR KIRI.
 *
 * Kenapa bukan zig-zag: satu ruas simpul→simpul yang menyeberang ke kanan
 * melintasi 800–1300px tegak sekaligus, dan di layar chord-nya sudah diagonal
 * — apa pun kurvanya, garis menembus kartu dan judul seksi. Menyeberang hanya
 * aman di pita padding atas seksi, dan tidak semua seksi punya pita itu
 * (`#kenalan` simpulnya di tengah kartu). Jadi air tetap di satu lajur.
 *
 * Variasinya dari KEDALAMAN: tiap simpul duduk di kedalaman berbeda di dalam
 * gutter, dan saat kedalaman berubah air memutar satu loop dulu. Terbaca
 * sebagai sungai yang melebar-menyempit, bukan dua batang lurus.
 */
function buildRiver(marks, w) {
  if (marks.length < 2) return ''
  let d = `M ${marks[0].x} ${marks[0].y}`
  for (let i = 0; i < marks.length - 1; i += 1) {
    const a = marks[i]
    const b = marks[i + 1]
    const span = b.y - a.y
    if (span <= 0) continue

    const dx = b.x - a.x
    const hasLoop = Math.abs(dx) > 0.05 && span >= 240

    if (hasLoop) {
      const rx = (LOOP_RX_PX / w) * 100
      const loopY = a.y + span * 0.45
      d += ` C ${a.x} ${a.y + (loopY - LOOP_RY - a.y) * 0.6} ${a.x} ${loopY - LOOP_RY * 0.9} ${a.x} ${loopY - LOOP_RY}`
      // Satu putaran penuh: dua busur setengah. Busur menutup tepat di titik
      // awal; cubic yang berangkat dan pulang ke titik sama menyatu jadi
      // busur halus dan lingkarannya lenyap.
      d += ` A ${rx} ${LOOP_RY} 0 1 1 ${a.x + rx * 2} ${loopY}`
      d += ` A ${rx} ${LOOP_RY} 0 1 1 ${a.x} ${loopY}`
      const rest = b.y - (loopY + LOOP_RY)
      if (rest > 1) {
        d += ` C ${b.x} ${loopY + LOOP_RY + rest * 0.25} ${b.x} ${b.y - rest * 0.4} ${b.x} ${b.y}`
      }
      continue
    }

    // Pergeseran kedalaman kecil: cubic lembut, seperti air menyusur tepi.
    d += ` C ${a.x} ${a.y + span * 0.55} ${b.x} ${b.y - span * 0.35} ${b.x} ${b.y}`
  }
  return d
}

export default function Trail() {
  const host = useRef(null)
  const svg = useRef(null)

  useEffect(() => {
    const node = host.current
    const ellipse = svg.current
    if (!node || !ellipse) return
    const flow = node.parentElement
    if (!flow) return

    let height = 0
    let total = 0
    let ready = false
    let lastMarks = []
    const strokes = [...node.querySelectorAll('.trail-line')]

    // Tiap frame cuma menyentuh SATU properti di lima node path.
    const paint = (p) => {
      const offset = (1 - p) * total
      for (const stroke of strokes) stroke.style.strokeDashoffset = `${offset}`
    }

    // Tiap simpul menyala hanya setelah sungai benar-benar sampai ke y-nya,
    // jadi ia penanda yang ditemukan, bukan bintang yang sudah menyala.
    const lightKnots = (marks, p) => {
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        const m = marks[i]
        if (!m) return
        const on = p > 0 && p >= m.pAt ? '1' : '0'
        if (knot.style.getPropertyValue('--knot-on') !== on) knot.style.setProperty('--knot-on', on)
      })
    }

    const measure = () => {
      const flowTop = flow.getBoundingClientRect().top + window.scrollY
      // Gutter 4%: isi seksi memakai kolom 1248px (96..1344 di layar 1440),
      // jadi satu-satunya jalur vertikal bebas adalah 0..96.
      const gutter = Math.max(16, Math.round(window.innerWidth * 0.04))
      const w = ellipse.clientWidth || window.innerWidth
      // Tiga kedalaman berbeda per lajur: kalau semua x identik, aliran
      // terbaca sebagai dua batang lurus di tepi layar. Rentangnya harus
      // kecil — gutter bebas hanya 0..96px di layar 1440.
      const DEPTH = [8, 22, 0]

      // Satu simpul per TARGETS. Jumlah simpul di JSX tetap 6, jadi kalau ada
      // target yang tak ketemu, satu simpul tetap tergambar di luar jalur
      // (`lightKnots` melewatinya) alih-alih menggeser tint semua simpul.
      const marks = TARGETS.map((sel, i) => {
        const el = flow.querySelector(sel)
        if (!el) return null
        const r = el.getBoundingClientRect()
        const depth = DEPTH[Math.floor(i / 2) % DEPTH.length]
        const top = Math.round(r.top + window.scrollY - flowTop)
        return {
          y: top + 44,
          top,
          x: r.left + gutter + depth,
        }
      }).filter(Boolean)
      if (marks.length < 2) return
      const head = { y: SOURCE_OFFSET(), x: (marks[0].x / w) * 100, side: 'left' }
      const all = [head, ...marks.map((m) => ({ ...m, x: (m.x / w) * 100 }))]
      lastMarks = all

      height = Math.max(all[all.length - 1].y + 240, 800)
      // viewBox TINGGINYA harus persis sama dengan kotak elemen, karena
      // preserveAspectRatio="none" memetakan viewBox penuh ke elemen.
      const vh = height
      ellipse.setAttribute('viewBox', `0 0 100 ${vh}`)
      ellipse.removeAttribute('height')
      ellipse.setAttribute('preserveAspectRatio', 'none')
      ellipse.style.height = `${vh}px`
      // Hulu di y=0: tepi atas `.beranda-flow`.
      const d = buildRiver([{ ...head, y: 0 }, ...all.slice(1)], w)
      for (const stroke of strokes) {
        stroke.setAttribute('d', d)
        const len = stroke.getTotalLength()
        stroke.style.strokeDasharray = `${len}`
        total = len
      }
      const startY = 0
      const endY = all[all.length - 1].y
      for (const m of all) m.pAt = (m.y - startY) / Math.max(endY - startY, 1)
      ready = true
      paint(isReduced() ? 1 : 0)
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        const m = all[i + 1]
        if (!m) return
        knot.style.setProperty('--knot-x', `${m.x}%`)
        knot.style.setProperty('--knot-y', `${m.y}px`)
      })
      lightKnots(all.slice(1), isReduced() ? 1 : 0)
    }

    // Ujung sungai DIHITUNG SEKALI di measure; per frame hanya aritmetika.
    let span = 1
    let headDocY = 0
    const measured = () => {
      measure()
      const start = SOURCE_OFFSET()
      headDocY = flow.getBoundingClientRect().top + window.scrollY + start
      const last = lastMarks.length ? lastMarks[lastMarks.length - 1].y : height
      span = Math.max(last - start, 1)
    }
    measured()
    if (isReduced()) return () => {}
    let saveData = false
    try { saveData = navigator.connection?.saveData === true } catch { saveData = false }
    if (saveData) { paint(1); return () => {} }

    const off = onFrame((y) => {
      if (!ready) return
      const p = Math.min(1, Math.max(0, (y - headDocY) / span))
      paint(p)
      lightKnots(lastMarks.slice(1), p)
    })

    const onResize = () => measured()
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(measured)
    return () => {
      off()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="trail" ref={host} aria-hidden="true">
      <svg className="trail-svg" ref={svg} viewBox="0 0 100 800" preserveAspectRatio="none">
        {/* Lima garis sejajar yang tergambar bersama. Satu path tidak bisa
            berganti warna tanpa henti tajam. */}
        {RAINBOW.map((color, i) => (
          <path
            key={color}
            className="trail-line"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            style={{ transform: `translateX(${((i - 2) * SPREAD).toFixed(2)}px)` }}
            d=""
          />
        ))}
      </svg>
      {TARGETS.map((sel, i) => (
        <span className="trail-knot" data-trail-knot key={sel} style={{ '--knot-tint': KNOTS[i] }}>
          <span className="trail-knot-ring" />
          <span className="trail-knot-dot" />
        </span>
      ))}
    </div>
  )
}
