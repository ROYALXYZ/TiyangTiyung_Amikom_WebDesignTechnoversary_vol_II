import { useEffect, useRef } from 'react'
import { isReduced, onFrame } from '../../lib/smooth'

/* ===========================================================
   Jejak Petualangan — satu lintasan yang tergambar saat digulir.
   Bentuknya dihitung dari tinggi seksi sungguhan, jadi tetap benar
   setelah font atau viewport berubah. Dekoratif: aria-hidden, tanpa
   tab-stop, dan tanpa JS garisnya tampil utuh.
   =========================================================== */

// Simpul ditaruh di gutter, bergantian kiri dan kanan supaya lintasan terasa
// menyeberang. Lintasan mengalir hanya di zona 8..92 agar tidak pernah
// melintasi teks — 8% dan 92% masih di luar kolom isi 1248px. Semua target
// harus berada di dalam `.beranda-flow`; di luar itu posisinya relatif ke 0
// dan simpulnya nyasar.
// Keenam seksi jadi pemandu: pelangi mulai di "Sampah Itu Apa, Sih?" dan
// berhenti di ajakan terakhir. Warna simpul mengikuti urutan tong.
const TARGETS = ['#fakta-1', '#kenalan', '#fakta-2', '#jurus', '#fakta-3', '#jadi-ini']
const KNOTS = ['var(--color-organic)', 'var(--color-anorganic)', 'var(--color-b3)', 'var(--color-paper)', 'var(--color-residu)', 'var(--color-organic)']
const knotAt = (i) => (i % 2 === 0 ? 8 : 92)
const RAINBOW = ['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6']
// Lebar garis dalam satuan viewBox (100 unit = lebar layar), jadi 0.22 unit
// ≈ 3.2px di 1440px: pelangi tipis yang tidak mengalahkan isi seksi. Ditaruh
// sebagai atribut, bukan CSS: CSS mengubah `stroke-width: .22` jadi 0.22px
// dan garisnya hilang.
const STROKE_WIDTH = 0.22
const SPREAD = 0.3

function buildPath(marks) {
  if (marks.length < 2) return ''
  let d = `M ${knotAt(0)} ${marks[0].y}`
  for (let i = 0; i < marks.length - 1; i += 1) {
    const a = marks[i]
    const b = marks[i + 1]
    const ax = knotAt(i)
    const bx = knotAt(i + 1)
    const dy = b.y - a.y
    const midY = (a.y + b.y) / 2
    // viewBox dilar vertikal (preserveAspectRatio="none"), jadi lengkung
    // vertikal harus dalam satuan viewBox. Kontrolnya ditaruh tegak lurus
    // portal menyeberang: setengah tinggi celah, bukan piksel. Karena x
    // melar ~14x lipat, kontrol y yang besar justru terbaca sebagai garis
    // lurus diagonal; jadi pegangannya kecil dan tetap proporsional.
    const pull = Math.min(dy * 0.22, 96)
    d += ` C ${ax} ${midY - pull} ${bx} ${midY + pull} ${bx} ${b.y}`
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

    const paint = (p) => {
      for (const stroke of strokes) stroke.style.strokeDashoffset = `${(1 - p) * total}`
      node.style.setProperty('--trail-draw', p.toFixed(4))
    }

    // Tiap simpul menyala hanya setelah garis sampai ke y-nya, jadi ia
    // berfungsi sebagai penanda yang ditemukan, bukan bintang statis.
    const lightKnots = (marks, p) => {
      const drawn = p * height
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        if (!marks[i]) return
        knot.style.setProperty('--knot-on', drawn >= marks[i].y ? '1' : '0')
      })
    }

    const measure = () => {
      // Semua pembacaan dilakukan sekali terhadap flow yang sama, lalu
      // digeser ke atas-by-flowScroll sehingga tidak bergantung pada posisi
      // gulir saat pengukuran terjadi.
      const fr = flow.getBoundingClientRect()
      const flowTop = fr.top + window.scrollY
      const marks = TARGETS.map((sel) => {
        const el = flow.querySelector(sel)
        if (!el) return null
        const r = el.getBoundingClientRect()
        // Simpul duduk di gutter kiri/kanan tepat di tepi atas seksi, jadi
        // tidak pernah menimpa judul atau badge di dalam kolom isi.
        return { y: Math.round(r.top + window.scrollY - flowTop) + 8 }
      }).filter(Boolean)
      if (marks.length < 2) return
      lastMarks = marks

      height = Math.max(marks[marks.length - 1].y + 320, 800)
      ellipse.setAttribute('viewBox', `0 0 100 ${height}`)
      ellipse.setAttribute('height', String(height))
      // Simpul memakai persen x dan piksel y: sama dengan koordinat di SVG.
      const d = buildPath(marks)
      for (const stroke of strokes) {
        stroke.setAttribute('d', d)
        const len = stroke.getTotalLength()
        stroke.style.strokeDasharray = `${len}`
        if (len > total) total = len
      }
      ready = true
      paint(isReduced() ? 1 : 0)
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        if (!marks[i]) return
        knot.style.setProperty('--knot-x', `${knotAt(i)}%`)
        knot.style.setProperty('--knot-y', `${marks[i].y}px`)
      })
      lightKnots(marks, isReduced() ? 1 : 0)
    }

    measure()
    if (isReduced()) return () => {}
    let saveData = false
    try { saveData = navigator.connection?.saveData === true } catch { saveData = false }
    if (saveData) { paint(1); return () => {} }

    const off = onFrame((y) => {
      if (!ready) return
      const top = flow.getBoundingClientRect().top + y
      const from = top - window.innerHeight * 0.75
      const travel = Math.max(height - window.innerHeight * 0.25, 1)
      const p = Math.min(1, Math.max(0, (y - from) / travel))
      paint(p)
      lightKnots(lastMarks, p)
    })

    const onResize = () => measure()
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
        {/* Pelangi tipis: lima garis sejajar yang semuanya tergambar bersama,
            dipisah offset kecil di sumbu x. Satu path saja tidak bisa
            berganti warna tanpa gradient berhenti tajam. */}
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
