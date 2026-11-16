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
  tick(time)
  requestAnimationFrame(loop)
}

const PRELOADER_TOTAL = 1250

function bootPreloader() {
  const root = document.documentElement
  if (!smoothAllowed()) {
    root.classList.add('no-preloader', 'is-first-loaded')
    return
  }
  window.setTimeout(() => root.classList.add('is-first-loaded'), PRELOADER_TOTAL)
}

export function startMotion() {
  if (started) return
  started = true
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  // CSS ikut tahu jalur mana yang aktif: pin stage hanya di jalur smooth.
  document.documentElement.dataset.motion = isReduced() ? 'reduced' : isTouch() ? 'touch' : 'smooth'
  bootPreloader()
  // heavier feel: lower lerp = longer glide; wheel multiplier reduces notch travel
  if (smoothAllowed()) lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, autoRaf: false })

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
  })

  requestAnimationFrame(loop)

  if (import.meta.env.DEV) {
    window.__motion = { get lenis() { return lenis }, scrollPos, isTouch, isReduced, onFrame, tick }
  }
}

export function onFrame(fn) {
  frames.add(fn)
  return () => frames.delete(fn)
}

export function scrollPos() {
  return lenis ? lenis.animatedScroll : window.scrollY
}

export function jumpTo(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true })
  else window.scrollTo(0, y)
}
