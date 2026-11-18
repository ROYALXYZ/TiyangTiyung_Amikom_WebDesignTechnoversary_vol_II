import { useEffect, useRef } from 'react'
import { isReduced, onFrame } from '../../lib/smooth'

/* ===========================================================
   Jejak Petualangan — sungai pelangi yang mengalir dari hulu ke hilir.
   Bentuknya dihitung dari tinggi seksi sungguhan, jadi tetap benar
   setelah font atau viewport berubah. Dekoratif: aria-hidden, tanpa
   tab-stop, dan tanpa JS sungainya tampil utuh.
   =========================================================== */

// Sungai mulai di hero (hulu, tengah kanvas, tepat di atas ombak sampah)
// lalu meliuk pelan ke bawah menyeberangi keenam seksi. Simpul duduk di
// gutter 8% / 92% supaya tidak pernah menimpa teks dalam kolom isi.
const TARGETS = ['#fakta-1', '#kenalan', '#fakta-2', '#jurus', '#fakta-3', '#jadi-ini']
const KNOTS = ['var(--color-organic)', 'var(--color-anorganic)', 'var(--color-b3)', 'var(--color-paper)', 'var(--color-residu)', 'var(--color-organic)']

// Hulu sungai: y=0 di tepi atas `.beranda-flow` (sudah di dalam hero karena
// kartu seksi berikutnya naik menutupinya), jadi garis memang muncul dari
// atas halaman, bukan coretan statis di tengah seksi.
const SOURCE_OFFSET = () => -Math.round(window.innerHeight * 0.5)

// Aliran tipis: 0.34 unit viewBox ≈ 4.9px di 1440px — cukup tebal untuk
// dibaca sebagai sungai, cukup tipis untuk tidak jadi pita. Ditaruh sebagai
// atribut, bukan CSS: CSS mengubah `stroke-width: .34` jadi 0.34px dan
// garisnya hilang.
const STROKE_WIDTH = 0.34
// Jarak antar pita: 0.55 unit ≈ 8px di 1440px, jadi lima warna terbaca
// sebagai satu aliran pelangi, bukan lima garis yang berserak.
const SPREAD = 0.55
const RAINBOW = ['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6']

/**
 * Aliran hulu→hilir: air membentang, bukan siku.
 *
 * Simpul duduk bergantian di gutter kiri/kanan tiap seksi. Tiap ruas digambar
 * sebagai SATU cubic diagonal yang menyapu dari tepi ke tepi seberang sambil
 * turun, jadi aliran membentang di belakang konten seperti sungai di peta —
 * bukan turun di tepi lalu menggeser datar di pita padding (versi itu terbaca
 * sebagai garis tipis di atas kartu).
 *
 * Semua pegangan y berada di dalam [a.y, b.y]: y monoton naik, tidak pernah
 * berbalik, jadi tetap terbaca sebagai aliran.
 */

// Variasi lengkung datang dari `i % 3` di `buildRiver`, jadi tidak ada dua
// ruas yang melengkung identik.

function buildRiver(marks) {
  if (marks.length < 2) return ''
  let d = `M ${marks[0].x} ${marks[0].y}`
  for (let i = 0; i < marks.length - 1; i += 1) {
    const a = marks[i]
    const b = marks[i + 1]
    const span = b.y - a.y
    if (span <= 0) continue

    // Satu cubic DIAGONAL per ruas: aliran menyapu dari satu tepi ke tepi
    // lain sambil turun, jadi terbaca membentang di belakang konten — bukan
    // turun dulu di gutter lalu menggeser datar di pita padding (versi itu
    // terbaca sebagai garis atas kartu).
    const dx = b.x - a.x
    // Pegangan vertikal: sedikit lebih separuh ruas, jadi kurva menggemuk di
    // tengah dan jatuh tegak di kedua ujung. `FALL` memberi variasi supaya
    // dua ruas sepanjang itu tidak melengkung identik.
    const fall = [0.58, 0.5, 0.66][i % 3]
    // Pegangan horizontal: sumbang 30–46% lebar sapuan. Di bawah 25% sapuan
    // terbaca garis lurus; di atas 50% ada loop balik yang memotong judul.
    const pull = [0.42, 0.3, 0.46][i % 3]
    d += ` C ${a.x + dx * pull} ${a.y + span * fall} ${b.x - dx * (pull * 0.7)} ${b.y - span * (1 - fall) * 0.9} ${b.x} ${b.y}`
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

    // Tiap frame cuma menyentuh SATU properti di lima node path. `--trail-draw`
    // tidak dipakai CSS mana pun lagi — menyetelnya memaksa recalc style pada
    // seluruh subtree `.trail` setiap frame, untuk nol manfaat visual.
    const paint = (p) => {
      const offset = (1 - p) * total
      for (const stroke of strokes) stroke.style.strokeDashoffset = `${offset}`
    }

    // Tiap simpul menyala hanya setelah sungai benar-benar sampai ke y-nya,
    // jadi ia penanda yang ditemukan, bukan bintang yang sudah menyala sejak
    // awal. Ambangnya p, bukan panjang busur: simpul y-nya diukur dari tepi
    // atas viewBox (yang bisa negatif), jadi busur dan p berselisih.
    const lightKnots = (marks, p) => {
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        const m = marks[i]
        if (!m) return
        // `p > 0` supaya simpul pertama tidak menyala sebelum sungai bergerak;
        // `>=` supaya p=1 tetap menyalakan simpul terakhir (pAt-nya 1).
        const on = p > 0 && p >= m.pAt ? '1' : '0'
        if (knot.style.getPropertyValue('--knot-on') !== on) knot.style.setProperty('--knot-on', on)
      })
    }

    const measure = () => {
      // Semua pembacaan memakai satu acuan (flowTop) sehingga hasilnya sama
      // di posisi gulir mana pun.
      const flowTop = flow.getBoundingClientRect().top + window.scrollY
      // Gutter 4%: isi seksi memakai kolom 1248px (96..1344 di layar 1440),
      // jadi satu-satunya jalur vertikal yang bebas kotak opaque adalah
      // 0..96. Simpul di dalam kolom itu tertutup `.panggung` dan sungai
      // tampak putus. Di bawah ~4% garis mulai terbaca sebagai border layar,
      // itu sebabnya simpul ditaruh di pita padding, bukan di tengah isi.
      const gutter = Math.max(16, Math.round(window.innerWidth * 0.04))
      const w = ellipse.clientWidth || window.innerWidth
      // Simpul tidak duduk di satu garis vertikal yang sama: tiap sisi punya
      // tiga kedalaman berbeda. Kalau semuanya x-nya identik, aliran terbaca
      // sebagai dua batang lurus di tepi layar. Variasi ini yang membuat
      // sungai benar-benar berkelok dari hulu ke hilir.
      const DEPTH = [10, 34, -4]
      const marks = TARGETS.map((sel, i) => {
        const el = flow.querySelector(sel)
        if (!el) return null
        const r = el.getBoundingClientRect()
        const left = i % 2 === 0
        const depth = DEPTH[Math.floor(i / 2) % DEPTH.length]
        // Simpul duduk di PITA PADDING atas seksi (tepi + 44px): seksi
        // berimpit dan isi pertamanya mulai ~146px, jadi pita itu kosong dan
        // ruas penyeberangan tidak pernah melintasi judul atau bagan.
        const xPx = r.left + (left ? gutter + depth : r.width - gutter - depth)
        return {
          y: Math.round(r.top + window.scrollY - flowTop) + 44,
          x: xPx,
          side: left ? 'left' : 'right',
        }
      }).filter(Boolean)
      if (marks.length < 2) return

      // Hulu sungai duduk di gutter simpul pertama, jadi ruas pertama hanya
      // turun lurus lalu menyapu penuh ke sisi seberang — seperti sungai yang
      // masuk dari atas layar.
      const head = { y: SOURCE_OFFSET(), x: (marks[0].x / w) * 100, side: 'left' }
      // Di sinilah `lastMarks` diisi; `ready` menandai pengisian pertama
      // supaya lightKnots() di akhir fungsi ini tidak membandingkan ke array
      // kosong (semua simpul jadi tetap redup).
      const all = [head, ...marks.map((m) => ({ ...m, x: (m.x / w) * 100 }))]
      lastMarks = all
      ready = true

      height = Math.max(all[all.length - 1].y + 240, 800)
      // viewBox SELALU mulai 0 dan TINGGINYA harus persis sama dengan kotak
      // elemen (`.trail{inset:0}`). Dengan preserveAspectRatio="none", viewBox
      // dipetakan penuh ke elemen: kalau angkanya beda (5931 vs 6567) semua y
      // melar 1.107x dan bergeser 978px — sungai mendarat jauh di bawah
      // simpulnya sendiri. Origin negatif pun sama salahnya.
      const vh = height
      ellipse.setAttribute('viewBox', `0 0 100 ${vh}`)
      ellipse.removeAttribute('height')
      ellipse.setAttribute('preserveAspectRatio', 'none')
      ellipse.style.height = `${vh}px`
      // Hulu di y=0: tepi atas `.beranda-flow`. Itu sudah di dalam hero
      // (kartu seksi 2 naik menutupi hero), jadi garis memang muncul dari
      // atas halaman. y negatif hanya akan terpotong viewBox.
      const d = buildRiver([{ ...head, y: 0 }, ...all.slice(1)])
      for (const stroke of strokes) {
        stroke.setAttribute('d', d)
        const len = stroke.getTotalLength()
        // strokeDasharray-nya ikut dihitung ulang: panjang path berubah
        // saat hulu tumbuh/menyusut mengikuti tinggi layar.
        stroke.style.strokeDasharray = `${len}`
        total = len
      }
      // Ambang nyala tiap simpul, dihitung dari y (peta yang sama dengan
      // paint di bawah), bukan dari panjang busur. Ditulis ke objek di `all`
      // — `marks` sudah disalin di atas, jadi menulis ke sana hilang.
      const startY = 0
      const endY = all[all.length - 1].y
      for (const m of all) m.pAt = (m.y - startY) / Math.max(endY - startY, 1)
      ready = true
      paint(isReduced() ? 1 : 0)
      node.querySelectorAll('[data-trail-knot]').forEach((knot, i) => {
        const m = all[i + 1]
        if (!m) return
        knot.style.setProperty('--knot-x', `${m.x}%`)
        // Simpul memakai koordinat yang sama dengan `d`: y relatif tepi atas
        // host (tanpa shift), karena viewBox-nya sudah mulai dari 0.
        knot.style.setProperty('--knot-y', `${m.y}px`)
      })
      lightKnots(all.slice(1), isReduced() || !ready ? 1 : 0)
    }

    // Ujung sungai DIHITUNG SEKALI di measure, bukan tiap frame: baris di atas
    // memanggil getBoundingClientRect() pada elemen berisi ~6.500px konten,
    // dan itulah yang membuat guliran tersendat. Sekarang per frame hanya
    // aritmetika pada nilai yang sudah di-cache.
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
      // Hulu di dokumen = posisi gulir saat hulu menyentuh tepi atas layar.
      // Dibaca dari cache: hanya `y` yang berubah antar frame.
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
        {/* Lima garis sejajar yang tergambar bersama, dipisah offset kecil di
            sumbu x. Satu path tidak bisa berganti warna tanpa henti tajam. */}
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
