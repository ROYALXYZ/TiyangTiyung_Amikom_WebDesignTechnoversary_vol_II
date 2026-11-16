import { useEffect, useRef, useState } from 'react'
import { GUIDE_LINE, RAIL_X, anchorPoint, buildTrace, cornerPath, lengthAtY, railX, tongEntryX } from '../../lib/jejak'
import { PIN_QUERY } from '../../lib/sweep'
import { isReduced, isTouch, onFrame, scrollPos } from '../../lib/smooth'

// Satu jalur melalui jangkar tata letak; tiga goresan berbagi geometri.
export default function Jejak({ hostRef }) {
  const svg = useRef(null)
  const lineRef = useRef(null)
  const lineBRef = useRef(null)
  const headRef = useRef(null)
  const [shape, setShape] = useState(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => {
      if (document.fonts?.status === 'loading') return
      const width = host.clientWidth
      const height = host.offsetHeight
      if (!width || !height) return
      const wide = width >= 1024
      const marks = [...host.querySelectorAll('[data-jejak]')].filter((el) => el.dataset.jejak !== 'start')
      let points = marks.map((el) => anchorPoint(el, host)).filter(Boolean)
      let pointsB = []
      // Dua titik serah-terima pita <-> sapuan lokal di section 3 (koordinat host).
      let entryY = 0
      let exitY = 0
      if (wide) {
        const x = (value) => railX(width, value)
        const top = (selector) => host.querySelector(selector).getBoundingClientRect().top - host.getBoundingClientRect().top
        const nodes = [...host.querySelectorAll('#fakta-3 .alur-step .alur-node')]
        // ponytail: six section channels, one traverse each; anchors follow section layout on resize.
        const marker = (id) => { const r = host.querySelector(`[data-trail-marker="${id}"]`).getBoundingClientRect(); const h = host.getBoundingClientRect(); return [x(r.left - h.left + r.width / 2), r.top - h.top + r.height / 2] }
        // Section 3 di-pin: pita berhenti di tepi kiri (titik masuk), sapuan lokal
        // mengambil alih kelima kartu, lalu pita menyambung lagi di tepi kanan.
        // Masuk di GUIDE_LINE; keluar setinggi pusat baris kartu supaya garis
        // tidak perlu berbalik arah setelah Tong Abu-abu.
        const stage = host.querySelector('#kenalan')
        const stageRect = stage.getBoundingClientRect()
        const stageTop = stageRect.top - host.getBoundingClientRect().top
        const travel = Math.max(0, stageRect.height - (stage.querySelector('[data-pin]')?.offsetHeight || 0))
        const guideY = window.innerHeight * GUIDE_LINE
        entryY = stageTop + guideY
        const pin = stage.querySelector('[data-pin]')
        const firstTap = stage.querySelector('.strip-tap').getBoundingClientRect()
        const pinRect = pin.getBoundingClientRect()
        const entryX = pinRect.left - host.getBoundingClientRect().left + tongEntryX(pin)
        exitY = stageTop + travel + firstTap.top - pinRect.top + firstTap.height / 2
        const exitX = x(1318)
        points = [
          [x(RAIL_X), points[0][1]],
          [x(430), top('#fakta-1 .asal-grid') + 105],
          [x(850), top('#fakta-1 .asal-grid') + 370],
          [Math.min(x(RAIL_X), entryX + 160), stageTop - 60],
          [entryX, stageTop + 100],
          [entryX, entryY],
        ]
        pointsB = [
          [exitX, exitY],
          [exitX, exitY + 220],
          marker('i3'),
          marker('i4'),
          [x(RAIL_X), top('#fakta-3') + 70],
          [x(RAIL_X), top('#fakta-3 .lede') + host.querySelector('#fakta-3 .lede').offsetHeight + 112],
          ...nodes.map((node) => { const [nx, ny] = anchorPoint(node, host); return [x(nx), ny] }),
          [x(1318), top('#jadi-ini') - 48],
          [x(1318), top('#jadi-ini .jadi-grid') + host.querySelector('#jadi-ini .jadi-grid').offsetHeight + 85],
          marker('i6'),
        ]
      }
      if (!wide) {
        const first = points[0]?.[1] ?? 0
        const last = points.at(-1)?.[1] ?? height
        const x = 26
        points = [
          [x, first],
          ...['i3', 'i4', 'i6'].map((id) => { const r = host.querySelector(`[data-trail-marker="${id}"]`).getBoundingClientRect(); return [x, r.top - host.getBoundingClientRect().top + r.height / 2] }),
          [x, last],
        ]
        pointsB = []
        entryY = 0
        exitY = 0
      }
      // ponytail: mobile keeps a straight 60px-capable spine; desktop corners require 130px.
      const radius = wide ? 130 : 60
      const dA = cornerPath(points, radius)
      const dB = pointsB.length ? cornerPath(pointsB, radius) : ''
      if (!dA) return
      if (import.meta.env.DEV && wide) {
        for (const d of [dA, dB]) {
          if (!d) continue
          const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          probe.setAttribute('d', d)
          const length = probe.getTotalLength()
          const samples = []
          for (let at = 0; at <= length; at += 2) samples.push(probe.getPointAtLength(at))
          for (let i = 0; i < samples.length; i++) {
            if (i && samples[i].y < samples[i - 1].y - 0.1) throw new Error(`Jejak: retrograde at ${samples[i].x.toFixed(2)},${samples[i].y.toFixed(2)}`)
          }
        }
      }
      const fork = host.querySelector('.alur-fork')
      const factory = host.querySelector('.alur-step:nth-child(4) .alur-node')
      const compost = fork?.querySelector('[data-fork="compost"]')
      const landfill = fork?.querySelector('[data-fork="landfill"]')
      const center = (el) => { const r = el.getBoundingClientRect(); const h = host.getBoundingClientRect(); return [r.left - h.left + r.width / 2, r.top - h.top + r.height / 2] }
      const from = factory && center(factory)
      const up = compost && center(compost)
      const down = landfill && center(landfill)
      const branch = (end, node, lower) => {
        if (!from || !end || !node) return ''
        const start = [from[0] + (lower ? -1 : 1) * (factory.offsetWidth / 2 - 12), from[1] + (lower ? 32 : -32)]
        const edge = end[0] + (lower ? 1 : -1) * node.offsetWidth / 2
        const direction = lower ? -1 : 1
        return `M ${start[0]} ${start[1]} C ${start[0] + direction * 44} ${start[1]} ${edge - direction * 48} ${end[1]} ${edge} ${end[1]}`
      }
      setShape({
        dA, dB, width, height, wide, entryY, exitY,
        top: points[0][1],
        bottom: (pointsB.length ? pointsB : points).at(-1)[1],
        compost: wide ? branch(up, compost, false) : '',
        landfill: wide ? branch(down, landfill, true) : '',
      })
    }
    let frame = 0
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure() }) }
    const ro = new ResizeObserver(schedule)
    const observe = () => {
      ro.disconnect()
      const tracked = [host, ...host.querySelectorAll('.band-in, .panggung, .strip, .jalan-row, .jurus-grid, .alur-row, .jadi-grid, .trail-marker-row, [data-trail-marker]')]
      tracked.forEach((el) => ro.observe(el))
      schedule()
    }
    const mo = new MutationObserver(observe)
    mo.observe(host, { childList: true, subtree: true })
    observe()
    document.fonts?.ready.then(schedule)
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      mo.disconnect()
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
    }
  }, [hostRef])

  useEffect(() => {
    if (!shape || !lineRef.current || !svg.current) return
    const lineA = lineRef.current
    const lineB = lineBRef.current
    const traceA = buildTrace(lineA)
    // jalur B bisa kosong (cornerPath menolak) -> getPointAtLength melempar
    const traceB = lineB?.getAttribute('d') ? buildTrace(lineB) : null
    const totalA = traceA.total
    const totalB = traceB?.total || 0
    const layers = (part) => [...svg.current.querySelectorAll(`[data-stroke="${part}"]`)]
    const paint = (nodes, total) => nodes.forEach((node) => {
      node.style.strokeDasharray = `${total}`
      node.style.strokeDashoffset = `${total}`
    })
    paint(layers('a'), totalA)
    paint(layers('b'), totalB)
    if (isReduced()) {
      ;[...layers('a'), ...layers('b')].forEach((node) => { node.style.strokeDashoffset = '0' })
      return
    }
    const host = hostRef.current
    const head = headRef.current
    const stage = document.querySelector('.tong-stage')
    let hostTop = 0
    let stageTop = 0
    let stageTravel = 1
    let drawn = -1
    let headLength = -1
    let headVisible = null
    let thin = false
    const measureHost = () => {
      hostTop = host.getBoundingClientRect().top + window.scrollY
      if (!stage) return
      const r = stage.getBoundingClientRect()
      stageTop = r.top + window.scrollY
      // tinggi pin, bukan innerHeight: sticky berhenti di dasar section
      stageTravel = Math.max(1, r.height - (stage.querySelector('[data-pin]')?.offsetHeight || 0))
    }
    const draw = (y) => {
      // rute berganti saat frame masih jalan: ref sudah null, jangan crash
      if (!svg.current) return
      const pinned = Boolean(stage) && window.matchMedia(PIN_QUERY).matches && !isTouch()
      const p = pinned ? (y - stageTop) / stageTravel : -1
      const afterPin = pinned && y >= stageTop + stageTravel - 0.5
      const inPin = pinned && y >= stageTop - 0.5 && !afterPin
      svg.current.classList.toggle('is-in-pin', pinned && y >= stageTop - 0.5)
      // pita menipis sebelum masuk stage supaya tebalnya sama dengan sapuan lokal
      const nextThin = pinned && p > -0.6 && p < 1.6
      if (nextThin !== thin) {
        thin = nextThin
        svg.current.classList.toggle('is-thin', thin)
      }
      // target = y dokumen untuk ujung garis (54% viewport), dalam ruang host
      const target = Math.min(shape.bottom, Math.max(shape.top, window.innerHeight * GUIDE_LINE - hostTop + y))
      let lenA = 0
      let lenB = 0
      if (!shape.dB) lenA = lengthAtY(traceA, target)
      else if (target < shape.entryY) lenA = lengthAtY(traceA, target)
      else if (afterPin || target >= shape.exitY) { lenA = totalA; lenB = lengthAtY(traceB, afterPin ? Math.max(shape.exitY, target) : target) }
      else lenA = totalA
      const length = lenA + lenB
      // Kepala hanya milik pita di luar stage ter-pin; di dalamnya sapuan lokal
      // yang memegang penunjuk, di titik yang sama persis.
      const visible = !inPin && (afterPin && shape.dB ? lenB < totalB - 2 : lenA > 2 && lenA < totalA - 0.5)
      if (head && visible !== headVisible) {
        headVisible = visible
        head.style.opacity = visible ? '1' : '0'
      }
      if (Math.abs(length - drawn) >= 0.5) {
        drawn = length
        layers('a').forEach((node) => { node.style.strokeDashoffset = `${totalA - lenA}` })
        layers('b').forEach((node) => { node.style.strokeDashoffset = `${totalB - lenB}` })
      }
      if (!head || (length === headLength && !afterPin)) return
      headLength = length
      const tip = afterPin && shape.dB ? lineB.getPointAtLength(lenB) : lineA.getPointAtLength(lenA)
      head.style.transform = `translate(${tip.x.toFixed(1)}px, ${tip.y.toFixed(1)}px)`
    }
    measureHost()
    draw(scrollPos())
    // satu rAF loop milik smooth.js: tidak ada lerp tambahan, garis = posisi scroll
    const off = onFrame(draw)
    const remeasure = () => { measureHost(); draw(scrollPos()) }
    window.addEventListener('resize', remeasure)
    document.fonts?.ready.then(remeasure)
    return () => {
      off()
      window.removeEventListener('resize', remeasure)
    }
  }, [shape, hostRef])

  return (
    <>
      <svg
        ref={svg}
        className="jejak"
        viewBox={shape ? `0 0 ${shape.width} ${shape.height}` : undefined}
        aria-hidden="true"
        focusable="false"
      >
        {shape && (
          <>
            {/* Selama pin, potong pita A di atas viewport: tidak ada tepi clip pada rel yang terlihat. */}
            {shape.dB && <defs><clipPath id="tong-entry-clip" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width={shape.width} height={shape.entryY - window.innerHeight * GUIDE_LINE - 60} /></clipPath></defs>}
            <path data-stroke="a" className="jejak-path jejak-band" d={shape.dA} fill="none" stroke="#DCFCE7" strokeWidth="72" strokeLinecap="round" strokeLinejoin="round" />
            <path ref={lineRef} data-stroke="a" className="jejak-path jejak-core" d={shape.dA} fill="none" stroke="#22C55E" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
            {shape.dB && <path data-stroke="b" className="jejak-path jejak-band" d={shape.dB} fill="none" stroke="#DCFCE7" strokeWidth="72" strokeLinecap="round" strokeLinejoin="round" />}
            {shape.dB && <path ref={lineBRef} data-stroke="b" className="jejak-path jejak-core" d={shape.dB} fill="none" stroke="#22C55E" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />}
            {shape.compost && <path d={shape.compost} fill="none" stroke="#22C55E" strokeWidth="18" strokeDasharray="12 12" strokeLinecap="round" />}
            {shape.landfill && <path d={shape.landfill} fill="none" stroke="#CBD5E1" strokeWidth="24" strokeLinecap="round" />}
          </>
        )}
      </svg>
      {/* kepala garis di lapisan sendiri: pita tetap di bawah kartu, penunjuk di atasnya */}
      <svg
        className="jejak jejak-headlayer"
        viewBox={shape ? `0 0 ${shape.width} ${shape.height}` : undefined}
        aria-hidden="true"
        focusable="false"
      >
        {shape && (
          <g ref={headRef} className="jejak-head">
            <g className="jejak-head-pulse">
              <circle r="46" fill="none" stroke="#22C55E" strokeWidth="5" opacity="0.35" />
            </g>
            <circle r="30" fill="#F0FDF4" stroke="#22C55E" strokeWidth="8" />
            <circle r="11" fill="#16A34A" />
          </g>
        )}
      </svg>
    </>
  )
}
