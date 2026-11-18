import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/* ---------------------------------------------------------------------------
   Satu rAF loop untuk seluruh halaman: Lenis + semua efek yang ikut scroll.
   Tidak ada scroll listener kedua, tidak ada lerp tambahan per efek —
   efek membaca posisi scroll yang sudah dihaluskan Lenis (mindmarket: lerp .1).
   --------------------------------------------------------------------------- */

const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
// jangan pakai navigator.maxTouchPoints: Chromium desktop melaporkan > 0
const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)')
// ?touch=1 hanya untuk QA lokal (memaksa jalur mobile tanpa emulasi perangkat)
const forcedTouch = import.meta.env.DEV && new URLSearchParams(location.search).has('touch')

export const isTouch = () => touchQuery.matches || forcedTouch
export const isReduced = () => reduceQuery.matches
export const smoothAllowed = () => !isTouch() && !isReduced()

let lenis = null
const frames = new Set()
let started = false

function tick(time) {
  if (lenis) lenis.raf(time)
  const y = lenis ? lenis.animatedScroll : window.scrollY
  for (const fn of frames) fn(y, time)
}

function loop(time) {
  // Ponytail: the frame chain parks itself when nothing is listening — no
  // scroll effects registered and Lenis not gliding. A parked chain is revived
  // by wake() (scroll, resize, wheel, onFrame registration, jumpTo).
  // `frame` is cleared BEFORE tick so a wake() called from inside a tick
  // callback schedules its own frame and survives; the park/continue decision
  // then decides whether THIS frame continues the chain.
  frame = 0
  tick(time)
  if (frames.size || (lenis && lenis.isScrolling)) {
    if (!frame) frame = requestAnimationFrame(loop)
  } else {
    idleSince = performance.now()
  }
}

// Coarse keep-alive: while the chain is parked, a timer re-checks every 250ms
// so effects that depend on scroll position cannot lag. A timer (not a rAF)
// means an idle page really does cost zero frames — the whole point of parking.
const IDLE_POLL = 250
let frame = 0
let idleSince = 0

export function wake() {
  if (frame) return
  frame = requestAnimationFrame(loop)
}

function poll() {
  if (!frame && performance.now() - idleSince > IDLE_POLL) wake()
  window.setTimeout(poll, IDLE_POLL)
}

const PRELOADER_TOTAL = 1250

// Preloader releases as soon as the real readiness signals land (fonts +
// first hero paint), not on a fixed timer. The timer is only the ceiling.
function bootPreloader() {
  const root = document.documentElement
  if (!smoothAllowed()) {
    root.classList.add('no-preloader', 'is-first-loaded')
    return
  }
  let released = false
  const release = () => {
    if (released) return
    released = true
    root.classList.add('is-first-loaded')
  }
  const timeout = window.setTimeout(release, PRELOADER_TOTAL)
  const fonts = document.fonts?.ready ?? Promise.resolve()
  fonts.then(() => requestAnimationFrame(() => requestAnimationFrame(release)))
  window.addEventListener('load', () => {
    clearTimeout(timeout)
    release()
  }, { once: true })
}

export function startMotion() {
  if (started) return
  started = true
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  // Hash routes are pages, not anchors. A restored scroll position can bury the mobile hero behind the sticky navbar.
  window.scrollTo(0, 0)
  // CSS ikut tahu jalur mana yang aktif: pin stage hanya di jalur smooth.
  document.documentElement.dataset.motion = isReduced() ? 'reduced' : isTouch() ? 'touch' : 'smooth'
  bootPreloader()
  // heavier feel: lower lerp = longer glide; wheel multiplier reduces notch travel
  if (smoothAllowed()) lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, autoRaf: false })

  // Coarse poll: only alive while the frame chain is parked.
  poll()

  // Wake the chain on real user input instead of per-frame listeners.
  for (const type of ['scroll', 'wheel', 'resize', 'keydown']) {
    window.addEventListener(type, wake, { passive: true })
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake() })

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]')
    if (!link) return
    const href = link.getAttribute('href')
    if (!href || href.startsWith('#/')) return // rute hash, bukan jangkar
    const target = document.querySelector(href)
    if (!target) return
    event.preventDefault()
    // hitung sendiri: lenis.scrollTo(element) menambal offset internal yang
    // menggeser target ~76px (tinggi header) di luar kendali kita.
    const y = target.getBoundingClientRect().top + scrollPos() - 84
    if (lenis) lenis.scrollTo(y)
    else window.scrollTo(0, y)
    // WCAG 2.4.1: melewati blok navigasi harus memindahkan fokus, bukan cuma
    // menggulir. Tanpa ini fokus keyboard tetap tertinggal di tautan skip.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  })

  wake()

  if (import.meta.env.DEV) {
    window.__motion = { get lenis() { return lenis }, scrollPos, isTouch, isReduced, onFrame, tick }
  }
}

export function onFrame(fn) {
  frames.add(fn)
  wake()
  return () => frames.delete(fn)
}

export function scrollPos() {
  return lenis ? lenis.animatedScroll : window.scrollY
}

export function jumpTo(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true })
  else window.scrollTo(0, y)
}
