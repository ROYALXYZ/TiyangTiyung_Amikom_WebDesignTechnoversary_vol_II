import * as k from '../src/vendor/anatomy/iso-kit.mjs'
import * as A from '../src/vendor/anatomy/audit.mjs'
import { turning } from '../src/vendor/anatomy/turn-build.mjs'
import * as TA from '../src/vendor/anatomy/turn-audit.mjs'
import { readFileSync, writeFileSync } from 'node:fs'

const W = 640, H = 450
const BASE = { x: -112, y: -108, w: 190, d: 190, r: 8 }
export const P = k.fitProjection([...k.boxCorners(BASE, -13, 0), [-95, -92, 65]], W, H, { pad: 8, azimuth: 47, elevation: 39 })
export const R = A.recorder(P)
const S = (p, tone = 'mid', lit = false) => k.solidSvg(p, { tone, lit })
function put(name, plan, z, h, layer = 'back', tone = 'mid', extra = '') {
  const svg = `<g data-station-part="${name}">${S(k.slabOf(plan, z, h, P, 5, .6), tone, name === 'carrier.floor') + extra}</g>`
  R.put({ name, layer, at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ground: name.startsWith('stand.') }))] })
}
function round(name, x, y, r, z, h, layer = 'back', tone = 'mid') {
  R.put({ name, layer, at: [x, y, z], svg: `<g data-station-part="${name}">${S(k.cylinder(x, y, r, z, h, P, 32), tone)}</g>`,
    shapes: [R.solid(A.cylinder(x, y, r, z, h, { name, ground: name.startsWith('stand.') }))] })
}

for (const [i, [x, y]] of k.corners(BASE, 18).entries()) {
  round(`stand.foot.${i}`, x, y, 8, -13, 2, 'back', 'lo')
  round(`stand.foot.neck.${i}`, x, y, 5, -11, 5, 'back', 'lo')
}
put('stand.base', BASE, -6, 6, 'back', 'lo',
  k.lineSvg(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'faint' }) +
  k.dotsSvg(k.corners(BASE, 10).map(([x, y]) => k.iso([x, y, 0], P)), { size: .65 }))
put('stand.ruler', { x: -98, y: 70, w: 160, d: 6, r: 1 }, 0, .8, 'back', 'lo',
  k.lineSvg(k.topTicks(-93, 56, 5, 5, 70, .8, [2, 4], P).minor, { tone: 'lo' }) +
  k.lineSvg(k.topTicks(-93, 56, 5, 5, 70, .8, [2, 4], P).major, { tone: 'mid' }))

// Hopper and chute are static; the carrier is prebuilt once and translated, never remeshed.
put('hopper.pedestal', { x: -99, y: -100, w: 26, d: 25, r: 2 }, 0, 25)
put('hopper.floor', { x: -104, y: -105, w: 36, d: 35, r: 3 }, 25, 2, 'front', 'hi')
put('hopper.back', { x: -104, y: -105, w: 36, d: 3, r: .4 }, 27, 20, 'front')
put('hopper.left', { x: -104, y: -102, w: 3, d: 32, r: .4 }, 27, 20, 'front')
put('hopper.right', { x: -71, y: -102, w: 3, d: 32, r: .4 }, 27, 20, 'front')
put('hopper.front', { x: -101, y: -73, w: 30, d: 3, r: .4 }, 27, 12, 'front')
put('chute.deck', { x: -78, y: -69, w: 36, d: 14, r: 2 }, 29, 2, 'front', 'mid')
put('chute.left', { x: -78, y: -69, w: 36, d: 2, r: .5 }, 31, 5, 'front')
put('chute.right', { x: -78, y: -57, w: 36, d: 2, r: .5 }, 31, 5, 'front')
put('chute.bracket', { x: -49, y: -66, w: 5, d: 9, r: .6 }, 0, 29)
// One real carrier, including its four rims. The engraved item is a face-plane glyph, not a screen overlay.
put('carrier.floor', { x: -70, y: -66, w: 18, d: 8, r: .7 }, 31, 1.5, 'carrier', 'hi')
put('carrier.back', { x: -70, y: -66, w: 18, d: 1, r: .3 }, 32.5, 2.5, 'carrier')
put('carrier.left', { x: -70, y: -65, w: 1, d: 6, r: .3 }, 32.5, 2.5, 'carrier')
put('carrier.right', { x: -53, y: -65, w: 1, d: 6, r: .3 }, 32.5, 2.5, 'carrier')
put('carrier.front', { x: -69, y: -59, w: 16, d: 1, r: .3 }, 32.5, 2.5, 'carrier')

export const T = turning(P, { recorder: R })
const carousel = T.group('carousel', { turn: { pivot: [0, 0] } })
const layer = T.layer('carousel')
T.stack(['back', 'carousel', 'front', 'carrier'])
const F = (x, y) => ({ o: [x, y, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] })
round('stand.axle', 0, 0, 8, 0, 7)
T.round({ name: 'carousel.table', group: carousel, layer, F: F(0, 0), s0: 7, s1: 10, r: 52, tone: 'mid' })
T.round({ name: 'carousel.hub', group: carousel, layer, F: F(0, 0), s0: 10, s1: 15, r: 8, tone: 'mid' })
const types = ['organik', 'anorganik', 'b3', 'kertas', 'residu']
const COLORS = ['#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#64748B']
for (const [i, type] of types.entries()) {
  const a = i * Math.PI * 2 / 5
  const x = 36 * Math.cos(a), y = 36 * Math.sin(a)
  const base = { x: x - 11, y: y - 10, w: 22, d: 20, r: 1.4 }
  const floor = T.prism({ name: `bin.${type}.floor`, group: carousel, layer, plan: base, z: 10, h: 2, tone: 'lo' })
  T.plane({ part: floor, o: [x, y, 12], u: [1, 0, 0], v: [0, 1, 0],
    svg: `<rect x="-8" y="-7" width="16" height="2" rx=".5" fill="${COLORS[i]}"/><text x="0" y="1.3" text-anchor="middle" font-size="2.6" fill="#475569">${type.toUpperCase()}</text>` })
  for (const [wall, plan] of [
    ['back', { x: x - 11, y: y - 10, w: 22, d: 2, r: .4 }],
    ['left', { x: x - 11, y: y - 8, w: 2, d: 18, r: .4 }],
    ['right', { x: x + 9, y: y - 8, w: 2, d: 18, r: .4 }],
    ['front', { x: x - 9, y: y + 8, w: 18, d: 2, r: .4 }],
  ]) {
    const part = T.prism({ name: `bin.${type}.${wall}`, group: carousel, layer, plan, z: 12, h: wall === 'front' ? 9 : 13, tone: 'hi' })
    // The front plate faces away for half the turn; the same enamel wraps the other exterior faces.
    if (wall === 'back') T.plane({ part, o: [x, y - 10, 18.5], u: [-1, 0, 0], v: [0, 0, -1], normal: [0, -1, 0],
      svg: `<rect x="-9" y="-3.5" width="18" height="7" rx=".2" fill="${COLORS[i]}"/>` })
    if (wall === 'left' || wall === 'right') T.plane({ part, o: [x + (wall === 'left' ? -11 : 11), y, 18.5],
      u: [0, wall === 'left' ? 1 : -1, 0], v: [0, 0, -1], normal: [wall === 'left' ? -1 : 1, 0, 0],
      svg: `<rect x="-7" y="-3.5" width="14" height="7" rx=".2" fill="${COLORS[i]}"/>` })
  }
  // The colour is enamel across the face of a raised, rigid nameplate; it turns with its bin.
  const plate = T.prism({ name: `bin.${type}.plate`, group: carousel, layer,
    plan: { x: x - 10, y: y + 10, w: 20, d: .8, r: .25 }, z: 12, h: 9, tone: 'hi' })
  T.plane({ part: plate, o: [x, y + 10.8, 16.5], u: [1, 0, 0], v: [0, 0, -1], normal: [0, 1, 0],
    svg: `<rect x="-9.7" y="-4" width="19.4" height="8" rx=".2" fill="${COLORS[i]}"/>` })
}

export const poses = () => Array.from({ length: 61 }, (_, i) => ({ carousel: i * 6 }))
export const out = (() => { try { return T.build({ statics: R.items, poses }) } catch (error) { console.error(error.message.replaceAll('\n', ' | ')); process.exit(1) } })()
A.settle(R, P)
if (process.argv.includes('--audit')) {
  A.auditOrExit(R, P)
  TA.orbitOrExit(T, R, P, { sweep: { at: (deg) => ({ carousel: deg }), from: 0, to: 360, frame: 3 } })
}
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => item.svg).join('')
export const art = { width: W, height: H, back: layerOf('back'), front: layerOf('front'), turn: out.layerSvg('carousel', { width: W, height: H }), data: out.data, css: out.css,
  carrierSvg: layerOf('carrier'), carrier: k.topMatrix([-61, -62], 32.5, P),
  icons: Object.fromEntries(['banana-peel', 'plastic-bottle', 'battery', 'cardboard-box', 'used-tissue'].map((name) =>
    [name, readFileSync(new URL(`../public/svg/items/${name}.svg`, import.meta.url), 'utf8').match(/<g\b[^>]*>[\s\S]*?<\/g>/)?.[0] ?? ''])),
  route: { origin: k.iso([-61, -62, 32.5], P), x: k.axisVector(P, [1, 0, 0]), y: k.axisVector(P, [0, 1, 0]), z: k.axisVector(P, [0, 0, 1]) } }
const html = `<html><head><meta charset="UTF-8"><style>${k.ISO_CSS}${out.css}</style></head><body class="iso" data-theme="light"><div class="iso-stage iso-turn" style="width:640px;height:450px">${k.figureSvg({ width: W, height: H, label: 'Stasiun Pemilah', body: layerOf('back') })}${out.layerSvg('carousel', { width: W, height: H })}${k.figureSvg({ width: W, height: H, label: 'Depan', body: layerOf('front') })}</div></body></html>`
writeFileSync(new URL('./page.html', import.meta.url), html)
// ponytail: geometric SVG paths use one decimal; upgrade precision only if 4× crops show visible joins.
const rounded = JSON.stringify(art).replace(/(-?\d+\.\d{2,})(?=[\s,<]|\\"|$)/g, (number) => String(Math.round(Number(number) * 10) / 10))
writeFileSync(new URL('../src/components/home/stationArt.json', import.meta.url), rounded)
writeFileSync(new URL('../src/components/home/stationTurn.css', import.meta.url), out.css)
console.log(`built ${R.items.length + out.report.parts} solids · ${out.report.parts} turning`)
