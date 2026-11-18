import { chromium } from 'playwright'
const b = await chromium.launch()

// reduced motion: river full, knots all lit, no running animation inside trail
const rp = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
await rp.goto('http://localhost:4321/#/', { waitUntil: 'networkidle' })
await rp.waitForTimeout(800)
console.log('REDUCED ' + JSON.stringify(await rp.evaluate(() => {
  const lines = [...document.querySelectorAll('.trail-line')]
  return {
    offsets: lines.map(l => l.style.strokeDashoffset),
    visible: lines.every(l => getComputedStyle(l).display !== 'none' && l.getBBox().height > 100),
    knots: [...document.querySelectorAll('[data-trail-knot]')].map(k => getComputedStyle(k).opacity),
    animatedInTrail: [...document.querySelectorAll('.trail *')].filter(n => getComputedStyle(n).animationName !== 'none').length,
  }
})))
await rp.close()

// normal: knots sequence monotonic, river reaches last knot before end of flow
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4321/#/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1000)
const rows = []
for (let i = 0; i <= 20; i++) {
  await p.evaluate((f) => {
    const fl = document.querySelector('.beranda-flow')
    window.scrollTo(0, fl.getBoundingClientRect().top + scrollY + fl.offsetHeight * f - innerHeight * 0.5)
  }, i / 20)
  await p.waitForTimeout(220)
  rows.push(await p.evaluate(() => {
    const l = document.querySelectorAll('.trail-line')[0]
    const total = parseFloat(l.style.strokeDasharray)
    return { p: +((1 - parseFloat(l.style.strokeDashoffset) / total)).toFixed(3), knots: [...document.querySelectorAll('[data-trail-knot]')].map(k => k.style.getPropertyValue('--knot-on')).join('') }
  }))
}
const back = rows.filter((r, i) => i && r.p < rows[i - 1].p).length
console.log('SCROLL ' + JSON.stringify({ back, first: rows[0], last: rows.at(-1), mid: rows[10] }))
await b.close()
