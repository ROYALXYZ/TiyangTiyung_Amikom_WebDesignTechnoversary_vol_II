// QA: bukti runtime untuk perbaikan audit. Jalankan: node verify/qa-audit.mjs
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4321'
const routes = ['/', '/main', '/cerita', '/tentang', '/surat']
const errors = []
const results = []

const browser = await chromium.launch()

async function auditRoute(route, viewport, label) {
  const page = await browser.newPage({ viewport })
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()) })
  await page.goto(`${BASE}/#${route}`, { waitUntil: 'load' })
  await page.waitForTimeout(1600)

  const info = await page.evaluate(() => {
    const q = (s) => document.querySelector(s)
    return {
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      mainId: q('[data-page]')?.getAttribute('data-page') || q('main')?.id || null,
      skip: Boolean(q('.skip-link')),
      // The skip link must resolve: an href="#main-content" with no such id is
      // a dead anchor that never triggers. Assert the destination exists.
      skipTarget: (() => {
        const href = q('.skip-link')?.getAttribute('href') || ''
        return href.startsWith('#') ? Boolean(document.getElementById(href.slice(1))) : false
      })(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      footerFocus: (() => {
        const a = q('.site-footer nav a')
        if (!a) return null
        return getComputedStyle(a, ':focus-visible').outlineColor
      })(),
      mutedPress: (() => { const b = q('.nav-controls button'); return b ? { label: b.getAttribute('aria-label'), pressed: b.getAttribute('aria-pressed') } : null })(),
      drawerControls: q('.menu-toggle')?.getAttribute('aria-controls') || null,
      fontLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
    }
  })
  results.push({ route, label, ...info, errors: pageErrors })
  if (pageErrors.length) errors.push({ route, label, pageErrors })

  // WCAG 2.4.1 — activating the skip link must move FOCUS to the main region,
  // not merely scroll. Verified by pressing Enter, not by reading the DOM.
  await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector('.skip-link')?.focus() })
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  const skipFocus = await page.evaluate(() => {
    const active = document.activeElement
    const target = document.getElementById('main-content')
    return {
      focusMoved: Boolean(target && active === target),
      focusedTag: active?.tagName || null,
      focusedId: active?.id || null,
      // A non-route hash must not hijack routing.
      routeStillOnPage: location.hash.startsWith('#/') || location.hash === '' || location.hash === '#',
    }
  })
  results.push({ route, label: 'skip', skipFocus })
  if (!skipFocus.focusMoved) errors.push({ route, label, skipFocus })

  if (route === '/' && label === 'desktop') {
    // contrast of the three fixed accent-on-tint recipes
    const contrast = await page.evaluate(() => {
      const lum = (rgb) => {
        const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const parse = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number)
      const ratio = (a, b) => { const [x, y] = [lum(parse(a)), lum(parse(b))].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2) }
      // resolve real rendered colors by reading computed styles against the nearest opaque bg
      const bg = (el) => {
        let n = el
        while (n) {
          const c = getComputedStyle(n).backgroundColor
          if (c && !c.includes('rgba(0, 0, 0, 0)') && c !== 'transparent') return c
          n = n.parentElement
        }
        return 'rgb(255, 253, 247)'
      }
      const out = {}
      const jr = document.querySelector('.jadi-result')
      if (jr) { const cs = getComputedStyle(jr); out.jadiResult = { fg: cs.color, bg: bg(jr), size: cs.fontSize, weight: cs.fontWeight, ratio: ratio(cs.color, bg(jr)) } }
      const jt = document.querySelector('.jalan-tag strong')
      if (jt) { const cs = getComputedStyle(jt); out.jalanTag = { fg: cs.color, bg: bg(jt), size: cs.fontSize, ratio: ratio(cs.color, bg(jt)) } }
      const tk = document.querySelector('.tong-kind')
      if (tk) { const cs = getComputedStyle(tk); out.tongKind = { fg: cs.color, bg: bg(tk), size: cs.fontSize, ratio: ratio(cs.color, bg(tk)) } }
      return out
    })
    results.push({ route, label: 'contrast', contrast })

    // lazy chunk actually deferred?
    const requests = []
    page.on('request', (r) => requests.push(r.url()))
    await page.goto(`${BASE}/#/`, { waitUntil: 'load' })
    await page.waitForTimeout(800)
    const loaded = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name))
    results.push({ route, label: 'chunks', sizes: loaded.map((u) => u.split('/').pop()).filter((f) => f.endsWith('.js') || f.endsWith('.css')) })
  }

  if (route === '/main' && label === 'desktop') {
    // touch-action on game items + certificate/pledge labels
    const touch = await page.evaluate(() => {
      const item = [...document.querySelectorAll('button')].find((b) => (b.textContent || '').includes('Kulit Pisang'))
      return item ? getComputedStyle(item).touchAction : null
    })
    results.push({ route, label: 'game', touchActionOnItem: touch })
  }

  await page.close()
}

await auditRoute('/', { width: 1440, height: 900 }, 'desktop')
await auditRoute('/', { width: 390, height: 844 }, 'mobile')
for (const r of routes.slice(1)) await auditRoute(r, { width: 1440, height: 900 }, 'desktop')

await browser.close()

const summary = results.filter((r) => r.title || r.contrast || r.chunks || r.game || r.skipFocus)
console.log(JSON.stringify({ summary, errors }, null, 2))
const hard = []
for (const r of summary) {
  if (r.overflow > 1) hard.push(`${r.route}/${r.label}: horizontal overflow ${r.overflow}px`)
  if (r.skip === false) hard.push(`${r.route}/${r.label}: skip link missing`)
  if (r.skipTarget === false) hard.push(`${r.route}/${r.label}: skip link target does not resolve`)
  if (r.skipFocus && !r.skipFocus.focusMoved) hard.push(`${r.route}/${r.label}: skip link does not move focus (WCAG 2.4.1)`)
  if (r.skipFocus && !r.skipFocus.routeStillOnPage) hard.push(`${r.route}/${r.label}: anchor hash hijacked the route`)
  if (r.h1 && r.h1.length !== 1) hard.push(`${r.route}/${r.label}: h1 count ${r.h1.length}`)
}
console.log(hard.length ? `FAIL\n${hard.join('\n')}` : 'PASS: no overflow, skip link resolves AND moves focus, no route hijack, exactly one h1 per route')
