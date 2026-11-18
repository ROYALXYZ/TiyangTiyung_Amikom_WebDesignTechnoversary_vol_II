import React, { useEffect, useId, useRef } from 'react'
import { onFrame, isReduced } from '../../lib/smooth'
import fish from '../../assets/ocean/fish-bone.svg?raw'
import bottle from '../../assets/ocean/plastic-bottle.svg?raw'
import bag from '../../assets/ocean/plastic-bag.svg?raw'
import glass from '../../assets/ocean/glass-bottle.svg?raw'
import cup from '../../assets/ocean/plastic-cup.svg?raw'
import cigarette from '../../assets/ocean/cigarette-butt.svg?raw'
import foam from '../../assets/ocean/styrofoam-box.svg?raw'
import wrapper from '../../assets/ocean/candy-wrapper.svg?raw'

const ink = 'var(--art-ink, var(--color-ink, #1e293b))'
const colors = {
  cream: 'var(--art-cream, var(--color-cream, #FFFDF7))',
  mint: 'var(--art-mint, var(--color-mint, #F0FDF4))',
  green: 'var(--art-green, var(--color-organic, #22C55E))',
  yellow: 'var(--art-yellow, var(--color-anorganic, #F59E0B))',
  red: 'var(--art-red, var(--color-b3, #EF4444))',
  blue: 'var(--art-blue, var(--color-paper, #3B82F6))',
  grey: 'var(--art-grey, var(--color-residu, #64748B))',
}

// Original illustrations live in public/svg/items; local copies let Vite inline
// their real paths at build time, keeping the sea visible without JavaScript.
const oceanItems = [fish, bottle, bag, foam, glass, cup, wrapper, cigarette]
const debrisPositions = [[48, 62, 72], [12, 40, 48], [29, 15, 47], [79, 15, 48], [67, 52, 47], [88, 88, 38], [5, 78, 42], [38, 30, 34]]

export function WasteOcean() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || isReduced()) return
    const hero = node.closest('.hero')
    if (!hero) return
    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      node.classList.toggle('ocean-active', visible)
    })
    observer.observe(hero)
    const remove = onFrame(y => {
      if (!visible) return
      const start = hero.getBoundingClientRect().top + y
      const range = Math.max(hero.offsetHeight - window.innerHeight, window.innerHeight * .65)
      const progress = Math.min(1, Math.max(0, (y - start) / range))
      node.style.setProperty('--ocean-recede', `${progress}`)
    })
    return () => { observer.disconnect(); remove() }
  }, [])

  return <div ref={ref} className="waste-ocean" aria-hidden="true">
    <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="waste-ocean-waves">
      <path className="ocean-wave ocean-wave-back" d="M-100 100Q50 65 200 99T500 99T800 99T1100 99T1400 99V400H-100Z" />
      <path className="ocean-wave ocean-wave-mid" d="M-100 158Q50 116 200 156T500 156T800 156T1100 156T1400 156V400H-100Z" />
      <path className="ocean-wave ocean-wave-front" d="M-100 232Q50 196 200 230T500 230T800 230T1100 230T1400 230V400H-100Z" />
    </svg>
    <div className="ocean-debris">
      {oceanItems.map((item, index) => {
        const [x, y, size] = debrisPositions[index]
        return <span key={index} className={`ocean-item ocean-item-${index}`} style={{ '--ocean-x': `${x}%`, '--ocean-y': `${y}%`, '--ocean-size': `${size}px` }} dangerouslySetInnerHTML={{ __html: item }} />
      })}
    </div>
  </div>
}

const marks = [
  <><path d="M3 20Q0 4 22 2Q23 19 3 20Z" fill="currentColor"/><path d="M3 20 17 8" fill="none"/></>,
  <><path d="M3 3Q5 18 21 15Q14 24 6 20Q0 15 3 3Z" fill="currentColor"/><path d="M7 13q5 8 12 4" fill="none"/></>,
  <><path d="M12 2Q8 11 4 16a8 8 0 0 0 16 0Q16 10 12 2Z" fill="currentColor"/></>,
  <><circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M4 10q8 5 16 0M4 15q8 5 16 0" fill="none"/></>,
  <><path d="M2 17q8-16 19-8l-5-1m5 1-3 6" fill="none"/></>,
  <><path d="M2 16q5-15 11-5t9-5m0 0-5 1m5-1-1 5" fill="none"/></>,
  <><path d="M1 10 23 3l-7 19-5-8-10-4 22-7" fill="currentColor"/><path d="m11 14 5 8" fill="none"/></>,
  <><path d="M3 20h19M5 19c-5-13 15-17 15-5 0 5-8 6-9 1-1-4 5-5 5-1M4 15v4m2-7-3-2" fill="none"/><circle cx="4" cy="11" r="1" fill={ink} stroke="none"/></>,
]

function random(seed) {
  let state = Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : 1
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296)
}

/** Parent: position:relative, content above z-index:1. --art-safe reserves an inset reading lane (mobile default: 12% each side). */
export function ScatterLayer({ density = 1, seed = 1, className = '', style, ...rest }) {
  const next = random(seed)
  const count = ({ 1: 12, 2: 16, 3: 24 })[density] || 12
  return <div {...rest} data-density={density} className={`art-scatter ${className}`} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'clip', pointerEvents: 'none', zIndex: 0, ...style }}>
    <style>{`@media(max-width:639px){.art-scatter .art-mark{width:min(8vw,32px)!important;left:calc((var(--art-safe, 12%) - min(8vw, 32px)) * var(--art-x))!important;right:auto!important}.art-scatter .art-mark[data-side="right"]{left:auto!important;right:calc((var(--art-safe, 12%) - min(8vw, 32px)) * var(--art-x))!important}.art-scatter[data-density="1"] .art-mark:nth-of-type(n+9),.art-scatter[data-density="2"] .art-mark:nth-of-type(n+13),.art-scatter[data-density="3"] .art-mark:nth-of-type(n+17){display:none}}`}</style>
    {Array.from({ length: count }, (_, i) => {
      const x = next(), y = next(), rotation = next() * 100 - 50
      const width = 28 + next() * 44
      return <svg key={i} className="art-mark art-bob" data-side={x < 0.5 ? 'left' : 'right'} viewBox="0 0 24 24" width="28" height="28" style={{ position: 'absolute', [x < 0.5 ? 'left' : 'right']: `${(x % 0.5) * 22}%`, '--art-x': (x % 0.5) * 2, top: `${y * 89}%`, width, height: 'auto', transform: `rotate(${rotation}deg)`, color: [colors.green, colors.yellow, colors.blue, colors.red, colors.grey][i % 5] }} fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">{marks[i % marks.length]}</svg>
    })}
  </div>
}

const edges = {
  clouds: 'M0 52 Q15 52 25 49 C25 29 43 20 58 26 C70 3 119 3 127 34 C141 28 158 35 161 49 Q178 54 188 48 C189 28 207 23 218 30 C231 15 261 20 267 42 Q276 51 289 52 L308 52 C310 30 331 17 350 24 C360 2 402 5 415 35 C436 30 449 38 451 51 L500 52 L500 100 H0Z',
  foliage: 'M0 54 L28 54 L43 35 L56 47 L65 15 L83 45 L100 30 L112 53 L145 53 Q150 63 155 70 Q159 60 161 53 L196 53 L215 28 L225 44 L246 9 L261 39 L278 27 L296 54 L333 54 L346 41 L361 47 L379 18 L394 43 L413 32 L432 54 L500 54 L500 100 H0Z',
  bubbles: 'M0 55 L18 55 C18 30 50 26 60 50 C72 45 80 48 84 55 L128 55 C127 6 200 -2 215 44 C238 32 262 40 267 55 L304 55 C310 40 331 41 337 55 L365 55 C364 20 412 13 421 48 C437 39 458 46 461 55 L500 55 L500 100 H0Z',
}

/** Torn-edge band behind a section; the edge repeats every 500px without seams.
    `flat` sinks the fill and the torn edge to z-index -1 so a layer at 0 in the
    same stacking context (the Jejak trail) draws in front of the colour but
    behind everything else. Every `edges` path ends with a literal " L500 100…"
    closing run; the outline strips it so the silhouette keeps its own stroke. */
export function ColorBandBackdrop({ variant = 1, edge = 'clouds', side = 'bottom', flat = false, className = '', style, ...rest }) {
  const id = useId().replaceAll(':', '')
  const bg = ['mint', 'cream', 'green', 'yellow', 'blue'][(Number(variant) - 1 + 5) % 5]
  const fill = colors[bg]
  const silhouette = bg === 'cream' || bg === 'mint' ? colors.green : colors.cream
  const z = flat ? -1 : 0
  return <div {...rest} className={`art-band${flat ? ' art-band--flat' : ''} ${className}`} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'clip', pointerEvents: 'none', background: fill, zIndex: z, ...style }}>
    <svg aria-hidden="true" style={{ position: 'absolute', width: '100%', height: 100, left: 0, [side === 'top' ? 'top' : 'bottom']: -1, zIndex: z, transform: side === 'top' ? 'scaleY(-1)' : undefined }}>
      <defs><pattern id={`art-band-${id}`} width="500" height="100" patternUnits="userSpaceOnUse"><path d={edges[edge] || edges.clouds} fill={silhouette}/><path d={(edges[edge] || edges.clouds).split(' L500 100')[0]} fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round"/>{edge === 'clouds' && <path d="M283 24Q292 10 304 18Q309 6 321 13Q329 21 322 27Z" fill={silhouette} stroke={ink} strokeWidth="3"/>}</pattern></defs>
      <rect width="100%" height="100" fill={`url(#art-band-${id})`} />
    </svg>
  </div>
}

export function BlobField({ variant = 1, className = '', style, ...rest }) {
  const layouts = [
    ['M-40 38Q43-33 135 30T352 31Q455 69 386 177T170 206Q20 264-40 155Z', 'M245 80Q314 12 399 91T404 250Q310 299 247 222T245 80Z'],
    ['M-35 103Q-12-9 104 8T248 42Q302 106 208 159T-35 103Z', 'M188 116Q242 24 352 45T432 177Q375 241 274 218T188 116Z'],
    ['M-35 54Q60-13 152 42T325 55Q400 137 297 190T40 212Q-42 170-35 54Z', 'M310 10Q406-18 436 67T365 209Q270 237 268 133T310 10Z'],
  ]
  const [first, second] = layouts[(Number(variant) - 1 + 3) % 3]
  return <svg {...rest} className={`art-blobs ${className}`} aria-hidden="true" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', ...style }}>
    <path className="art-sway" d={first} fill={colors.mint} stroke={ink} strokeWidth="2.5"/><path className="art-bob" d={second} fill={colors.green} stroke={ink} strokeWidth="2.5"/>
    <path d="M35 78q25-34 53-16M304 102q20-28 40-9" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round"/>
  </svg>
}

export function NumberBadge({ value = '', unit = '', variant = 1, className = '', style, ...rest }) {
  return <div {...rest} className={`art-number ${className}`} role="img" aria-label={`${value}${unit ? ` ${unit}` : ''}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', width: 'max-content', maxWidth: '100%', position: 'relative', color: ink, pointerEvents: 'none', fontFamily: 'var(--font-display, Fredoka, system-ui, sans-serif)', lineHeight: 1.05, ...style }}>
    <span aria-hidden="true" style={{ fontSize: 'clamp(76px, 13vw, 190px)', fontWeight: 700, letterSpacing: '-0.075em', position: 'relative', zIndex: 1 }}>{value}</span>
    <svg viewBox="0 0 300 28" preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height: 20, marginTop: 12 }}><path d={Number(variant) % 2 ? 'M7 10Q70 4 145 13T293 10' : 'M7 16Q74 21 145 11T293 15'} fill="none" stroke="var(--art-accent, var(--color-organic, #22C55E))" strokeWidth="7" strokeLinecap="round"/></svg>
    <span aria-hidden="true" style={{ marginTop: 8, fontSize: 'clamp(24px, 3vw, 42px)', fontWeight: 700 }}>{unit}</span>
  </div>
}

export function PaperGrain({ off = false, className = '', style, ...rest }) {
  const id = useId().replaceAll(':', '')
  if (off) return null
  return <svg {...rest} className={`art-grain ${className}`} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.12, zIndex: 0, ...style }} preserveAspectRatio="none">
    <defs><filter id={`art-paper-noise-${id}`} x="0" y="0" width="128" height="128" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" stitchTiles="stitch"/></filter><pattern id={`art-paper-tile-${id}`} width="128" height="128" patternUnits="userSpaceOnUse"><rect width="128" height="128" filter={`url(#art-paper-noise-${id})`}/></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#art-paper-tile-${id})`} />
  </svg>
}

export function EdgePlant({ side = 'left', variant = 1, className = '', style, ...rest }) {
  const stems = [
    ['M15 240Q62 143 78 10', 'M42 173Q-7 155 15 115Q49 116 42 173ZM55 135Q103 106 108 64Q62 62 55 135ZM67 80Q26 52 45 23Q73 31 67 80Z'],
    ['M10 240Q80 155 102 9', 'M40 194Q-14 187 3 130Q39 136 40 194ZM69 125Q117 113 130 63Q76 62 69 125ZM88 68Q48 46 69 10Q101 19 88 68Z'],
    ['M10 240Q43 104 93 8', 'M31 182Q-13 152 10 106Q47 131 31 182ZM57 114Q109 113 122 51Q78 55 57 114ZM78 55Q39 19 66 2Q99 25 78 55Z'],
  ]
  const [stem, leaves] = stems[(Number(variant) - 1 + 3) % 3]
  return <svg {...rest} className={`art-edge-plant art-sway ${className}`} aria-hidden="true" viewBox="0 0 140 240" style={{ position: 'absolute', width: 'clamp(90px, 13vw, 190px)', height: 'auto', bottom: -12, [side === 'right' ? 'right' : 'left']: '-4%', transform: side === 'right' ? 'scaleX(-1)' : undefined, pointerEvents: 'none', ...style }} fill="none" stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
    <path d={stem} strokeWidth="6"/><path d={leaves} fill={colors.green}/><path d="M15 115q17 23 27 58M108 64q-23 28-53 71M45 23q13 26 22 57" strokeWidth="2" opacity=".7"/>
    <path d="M0 239Q15 209 33 230Q56 207 76 239Z" fill={colors.mint}/>
  </svg>
}
