import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge' })
const routes = ['/', '/main', '/cerita', '/tentang', '/surat']
let failures = 0

try {
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))

    for (const route of routes) {
      await page.goto(`http://127.0.0.1:4173/#${route}`, { waitUntil: 'networkidle' })
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        heading: !!document.querySelector('h1'),
      }))
      if (layout.overflow || !layout.heading || errors.length) {
        failures++
        console.error(`${width}px ${route}: ${JSON.stringify({ ...layout, errors })}`)
      }
    }

    await page.goto('http://127.0.0.1:4173/#/', { waitUntil: 'networkidle' })
    await page.locator('#kenalan').scrollIntoViewIfNeeded()
    const tabs = page.locator('#kenalan [role="tab"]')
    const heights = []
    for (let index = 0; index < 5; index++) {
      await tabs.nth(index).click()
      heights.push(await page.locator('#kenalan .panggung').evaluate((node) => Math.round(node.getBoundingClientRect().height)))
    }
    await tabs.nth(2).click()
    const warning = await page.locator('#kenalan .panggung-warning').isVisible()
    if (!warning || Math.max(...heights) - Math.min(...heights) > 2) {
      failures++
      console.error(`${width}px tong: ${JSON.stringify({ warning, heights })}`)
    }
    console.log(`${width}px: routes checked, tong heights ${heights.join('/')}, red warning ${warning}`)
    await page.close()
  }
} finally {
  await browser.close()
}

if (failures) process.exitCode = 1
