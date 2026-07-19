// Reproduce the route-transition crash: load /, CLICK Link to /amber (SPA nav, not goto)
import { chromium } from 'playwright'

const errors = []
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage()
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}\n${e.stack?.split('\n').slice(0, 12).join('\n')}`))

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
console.log('home loaded')

// click "See her talent card" -> SPA navigation to /amber (lazy chunk)
await page.click('text=See her talent card')
await page.waitForTimeout(2500)
const h = await page.textContent('#root')
console.log(`after Link click: url=${page.url()} rootLen=${h.trim().length}`)
console.log(h.includes("Well, that's embarrassing") ? '>>> ERROR BOUNDARY SHOWN <<<' : 'page rendered normally')

// also try nav to /interview via nav bar
await page.click('nav >> text=Interview Amber — free').catch(e => console.log('nav click failed:', e.message))
await page.waitForTimeout(2500)
const h2 = await page.textContent('#root')
console.log(`after 2nd nav: url=${page.url()} ${h2.includes("embarrassing") ? '>>> ERROR BOUNDARY <<<' : 'ok'}`)

console.log(errors.length ? `\n=== ERRORS ===\n${errors.join('\n---\n')}` : '\nno page errors')
await browser.close()
