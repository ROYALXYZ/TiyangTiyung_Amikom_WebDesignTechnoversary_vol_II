// Ujung garis (tour guide) selalu di 54% viewport. pop.js memakai angka yang
// sama, jadi kartu pop tepat saat kepala garis menyentuhnya.
export const GUIDE_LINE = 0.54

// Gutter kiri tempat pita turun sebelum menyapu baris kartu Tong.
export const RAIL_X = 122

// x gutter dalam piksel host. Dipakai pita global DAN sapuan lokal, supaya
// titik serah-terima di section 3 jatuh di koordinat yang sama persis.
export const railX = (width, at = RAIL_X) => {
  const edge = 96 + 26
  return Math.max(edge, Math.min(width - edge, at * (width / 1440)))
}

// Rel masuk Tong mengambil ruang kosong di kiri konten, bukan gutter umum.
export const tongEntryX = (pin) => Math.max(26, pin.querySelector('.band-in').getBoundingClientRect().left - pin.getBoundingClientRect().left - 36)

// Satu jalur mulus lewat semua titik (Catmull-Rom -> Bezier kubik).
// Kontrol x dijepit ke rentang segmen supaya garis tidak menyembul keluar halaman.
const clamp = (v, a, b) => (a < b ? Math.min(Math.max(v, a), b) : Math.min(Math.max(v, b), a))

// Reject cramped turns rather than draw overlapping fillets. Rejection never throws:
// a bad measurement drops the trail, it must not blank the page.
export function cornerPath(points, radius = 130) {
  if (!points || points.length < 2) return ''
  const reject = (msg) => { console.error(`Jejak: ${msg}`); return '' }
  const p = points
  const lengths = p.slice(1).map(([x, y], i) => Math.hypot(x - p[i][0], y - p[i][1]))
  for (let i = 0; i < lengths.length; i++) {
    if (lengths[i] < 0.01) return reject(`zero-length segment ${i}`)
    if (p[i + 1][1] < p[i][1] - 0.01) return reject(`reverse segment ${i} at ${p[i + 1]}`)
  }
  const corners = p.slice(1, -1).map(([x, y], k) => {
    const i = k + 1
    const before = lengths[i - 1]
    const after = lengths[i]
    const ax = (x - p[i - 1][0]) / before
    const ay = (y - p[i - 1][1]) / before
    const bx = (p[i + 1][0] - x) / after
    const by = (p[i + 1][1] - y) / after
    const cross = ax * by - ay * bx
    const dot = ax * bx + ay * by
    const tangent = Math.tan(Math.acos(clamp(dot, -1, 1)) / 2)
    if (dot < -0.9999) return { reject: `180° reversal at ${i}: ${x},${y}` }
    if (Math.abs(cross) < 0.001 || tangent < 0.001) return null
    return { ax, ay, bx, by, cross, tangent, desired: radius * tangent }
  })
  const bad = corners.find((corner) => corner?.reject)
  if (bad) return reject(bad.reject)
  for (let i = 0; i < lengths.length; i++) {
    const claimed = (corners[i - 1]?.desired || 0) + (corners[i]?.desired || 0)
    if (claimed > lengths[i] + 0.01) return reject(`markers ${i}–${i + 1} need ${claimed.toFixed(2)}px, segment has ${lengths[i].toFixed(2)}px (short ${(claimed - lengths[i]).toFixed(2)}px)`)
  }
  let d = `M ${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`
  for (let i = 1; i < p.length - 1; i++) {
    const [x, y] = p[i]
    const corner = corners[i - 1]
    if (!corner) {
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
      continue
    }
    const t = corner.desired
    const r = radius
    d += ` L ${(x - corner.ax * t).toFixed(2)} ${(y - corner.ay * t).toFixed(2)}`
    d += ` A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 ${corner.cross > 0 ? 1 : 0} ${(x + corner.bx * t).toFixed(2)} ${(y + corner.by * t).toFixed(2)}`
  }
  const end = p.at(-1)
  return `${d} L ${end[0].toFixed(2)} ${end[1].toFixed(2)}`
}

export function smoothPath(points) {
  if (!points || points.length < 2) return ''
  // ponytail: forward-only route; move/reorder DOM anchors to restore a wave, never reverse y.
  points = points.map(([x, y]) => [x, y])
  for (let i = 1; i < points.length; i++) points[i][1] = Math.max(points[i][1], points[i - 1][1])
  const n = points.length
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || points[i + 1]
    const c1x = clamp(p1[0] + (p2[0] - p0[0]) / 6, p1[0], p2[0])
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, p1[1], p2[1])
    const c2x = clamp(p2[0] - (p3[0] - p1[0]) / 6, p1[0], p2[0])
    const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, p1[1], p2[1])
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

// LUT y -> panjang jalur. Sampel sekali per jalur, bukan per frame:
// 18x getPointAtLength per scroll event (2.7ms) jadi 1 lookup biner per frame.
export function buildTrace(path, step = 24) {
  const total = path.getTotalLength()
  const points = []
  for (let at = 0; at < total; at += step) points.push(path.getPointAtLength(at))
  points.push(path.getPointAtLength(total))
  return { total, step, points }
}

export function lengthAtY(trace, y) {
  const { points, total, step } = trace
  if (y <= points[0].y) return 0
  if (y >= points[points.length - 1].y) return total
  let lo = 0
  let hi = points.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (points[mid].y <= y) lo = mid
    else hi = mid
  }
  const a = points[lo]
  const b = points[hi]
  const t = (y - a.y) / (b.y - a.y || 1)
  return Math.min(total, (lo + t) * step)
}

// Posisi tata letak (bukan hasil transform), supaya animasi POP tidak
// menggeser titik garis.
function offsetIn(el, root) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return [x, y]
}

// Titik jangkar dari sebuah elemen bertanda data-jejak.
// gl/gr = gutter kiri/kanan (x tetap, y dari elemen).
// c = tengah-atas, b = tengah-bawah, l/r = tepi kiri/kanan.
export function anchorPoint(el, host) {
  const mode = el.dataset.jejak
  const [hx, hy] = offsetIn(host, null)
  const [x0, y0] = offsetIn(el, null)
  const left = x0 - hx
  const top = y0 - hy
  const w = el.offsetWidth
  const h = el.offsetHeight
  let x = left + w / 2
  let y = top
  if (mode === 'b') y = top + h
  if (mode === 'l') { x = left; y = top + h / 2 }
  if (mode === 'r') { x = left + w; y = top + h / 2 }
  if (mode === 'gl' || mode === 'gr') {
    const narrow = host.clientWidth < 1024
    x = mode === 'gl' ? (narrow ? 30 : 48) : host.clientWidth - (narrow ? 30 : 72)
    y = top + h / 2
  }
  x += Number(el.dataset.jx || 0)
  y += Number(el.dataset.jy || 0)
  return [x, y]
}
