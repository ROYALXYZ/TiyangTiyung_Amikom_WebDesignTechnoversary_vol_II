import { useEffect, useRef, useState } from 'react'
import { BINS, ITEMS } from '../../data/waste'
import { TURN } from '../../vendor/anatomy/turn.mjs'
import art from './stationArt.json'
import '../../vendor/anatomy/iso.css'
import './stationTurn.css'

const categories = Object.keys(BINS)
const subjects = categories.map((type) => ITEMS.find((item) => item.type === type))
const iconNames = ['banana-peel', 'plastic-bottle', 'battery', 'cardboard-box', 'used-tissue']
const face = (index) => ({ __html: art.icons[iconNames[index]] })

export default function SortingStation() {
  const stage = useRef(null)
  const picked = useRef(3)
  const [selected, setSelected] = useState(3)
  const [still, setStill] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const item = subjects[selected]

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setStill(media.matches)
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])

  useEffect(() => {
    if (!stage.current) return
    let frame = 0, visible = false, paused = false, clock = 0, last = 0, angle = 0, next = 3, active = 3
    const crate = stage.current.querySelector('.station-carrier')
    const glyph = crate.querySelector('.station-item-icon')
    const mount = TURN.mount(stage.current, art.data)
    // ponytail: topmost lane never changes painter order; the item vanishes at the front rim.
    const smooth = (t) => t * t * (3 - 2 * t)
    const cycle = 3400
    const route = ([x, y, z]) => {
      const { route: { x: X, y: Y, z: Z } } = art
      return `translate(${(x * X[0] + y * Y[0] + z * Z[0]).toFixed(1)} ${(x * X[1] + y * Y[1] + z * Z[1]).toFixed(1)})`
    }
    const rim = [72, 96, 4] // receiver at angle 0; upper face stays above the rim during fade
    const itinerary = (t) => {
      if (t < 1250) { // hopper lip, track, mouth
        const p = smooth(t / 1250)
        crate.style.visibility = 'visible'
        crate.style.opacity = '1'
        crate.removeAttribute('transform')
        const displacement = p < .45
          ? [-12 + p / .45 * 8, 0, 0]
          : [-4 + (p - .45) / .55 * 17, 0, 0]
        crate.setAttribute('transform', route(displacement))
      } else if (t < 1900) { // hold at mouth while carousel indexes
        crate.setAttribute('transform', route([13, 0, 0]))
        const p = smooth((t - 1250) / 650)
        mount.set({ carousel: angle + ((1 - next) * 72 - angle) * p })
      } else if (t < 2600) { // approach the front rim; vanish rather than penetrate it
        const p = smooth((t - 1900) / 700)
        const travel = Math.min(p / .62, 1)
        const fade = Math.max(0, (p - .62) / .38)
        const [x, y, z] = rim
        const offset = route([13 + (x - 13) * travel, y * travel, z * travel])
        crate.setAttribute('transform', `${offset} translate(${art.route.origin.join(' ')}) scale(${(1 - fade * .85).toFixed(3)}) translate(${-art.route.origin[0]} ${-art.route.origin[1]})`)
        crate.style.opacity = String(1 - fade)
      } else {
        crate.style.visibility = 'hidden'
      }
    }
    const tick = (now) => {
      if (last && !paused) clock += Math.min(now - last, 60)
      last = now
      if (clock >= cycle) {
        clock -= cycle
        angle = (1 - next) * 72
        mount.set({ carousel: angle })
        active = next
        picked.current = active
        setSelected(active)
        next = (active + 1) % 5
        glyph.innerHTML = art.icons[iconNames[next]]
      }
      itinerary(clock)
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => { if (!frame && visible && !still) frame = requestAnimationFrame(tick) }
    const choose = (index) => {
      next = index
      if (still) {
        active = index; angle = (1 - index) * 72
        picked.current = index; setSelected(index)
        glyph.innerHTML = art.icons[iconNames[index]]
        mount.set({ carousel: angle })
      } else { clock = 0; glyph.innerHTML = art.icons[iconNames[index]]; start() }
    }
    stage.current.__choose = choose
    const observer = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting
      if (!visible) { cancelAnimationFrame(frame); frame = 0; last = 0 }
      else start()
    }, { rootMargin: '120px 0px' })
    observer.observe(stage.current)
    const node = stage.current
    const hold = () => { paused = true }
    const release = () => { paused = false }
    node.addEventListener('pointerenter', hold)
    node.addEventListener('pointerleave', release)
    node.addEventListener('focusin', hold)
    node.addEventListener('focusout', release)
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame)
      node.removeEventListener('pointerenter', hold); node.removeEventListener('pointerleave', release)
      node.removeEventListener('focusin', hold); node.removeEventListener('focusout', release)
      delete node.__choose; mount.destroy()
    }
  }, [still])

  function select(index) { stage.current?.__choose?.(index) }
  return <figure className="station-card iso" data-theme="light">
    <div className="station-heading"><span>STASIUN PEMILAH</span><span>Ke mana sampah pergi?</span></div>
    <div className="station-stage iso-stage iso-turn" ref={stage} onKeyDown={(event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); select((picked.current + (event.key === 'ArrowRight' ? 1 : 4)) % 5)
      }
    }} role="group" aria-label="Stasiun pemilah. Pilih salah satu dari lima tujuan dengan tombol di bawah atau tombol panah saat gambar fokus." tabIndex={0}>
      <svg className="iso-svg iso-layer" viewBox={`0 0 ${art.width} ${art.height}`} role="img" aria-label="Mesin pemilah isometrik dengan hopper, lintasan, dan lima tong berputar" dangerouslySetInnerHTML={{ __html: art.back }} />
      <div dangerouslySetInnerHTML={{ __html: art.turn }} />
      <svg className="iso-svg iso-layer" viewBox={`0 0 ${art.width} ${art.height}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.front }} />
      <svg className="iso-svg iso-layer station-carrier-layer" viewBox={`0 0 ${art.width} ${art.height}`} aria-hidden="true">
        <g className="station-carrier"><g dangerouslySetInnerHTML={{ __html: art.carrierSvg }} /><g transform={art.carrier}><rect x="-9" y="-7" width="18" height="14" rx="1" fill="#fffdf7"/><g className="station-item-icon" transform="translate(-9 -7) scale(.28 .21)" dangerouslySetInnerHTML={face(selected)} /></g></g>
      </svg>
    </div>
    <div className="station-footer"><span>Pilih tujuan</span><output aria-live="polite"><strong>{item.name} → {BINS[item.type].name}</strong><small>{item.fact.replace(/(\d) - (\d)/g, '$1–$2')}</small></output></div>
    <div className="station-choices" aria-label="Lihat tujuan sampah">{categories.map((type, index) => <button type="button" key={type} aria-pressed={selected === index} onClick={() => select(index)} style={{ '--station-color': BINS[type].color }}>{BINS[type].bin}</button>)}</div>
    <figcaption>Satu barang melewati lintasan, lalu karusel memilih tong tujuannya. Pilih tong untuk melihat contohnya; permainan pilah ada di bagian berikutnya.</figcaption>
  </figure>
}
