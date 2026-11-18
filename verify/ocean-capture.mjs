import { chromium } from 'playwright'
import { stat } from 'node:fs/promises'

const browser = await chromium.launch({ headless: true })
try {
  for (const [name, width, height, route, reduce] of [
    ['ocean-desktop', 1440, 900, '/', false],
    ['ocean-mobile', 390, 844, '/', false],
    ['mascots', 1440, 900, '/#/tentang', false],
    ['ocean-reduced', 1440, 900, '/', true],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduce ? 'reduce' : 'no-preference' })
    await page.goto(`http://localhost:4321${route}`)
    await page.waitForTimeout(1500)
    const file = `verify/${name}.png`
    await page.screenshot({ path: file })
    const size = (await stat(file)).size
    if (size < 10000) throw new Error(`${file}: suspiciously small (${size} bytes)`)
    console.log(`${file}: ${size} bytes; ocean visible: ${await page.locator('.waste-ocean').isVisible()}`)
    await page.close()
  }
} finally {
  await browser.close()
}
