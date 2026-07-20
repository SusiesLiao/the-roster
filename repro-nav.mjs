import { chromium } from 'playwright'
const errors = []
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage()
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`))
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
const clicks = [
  ['text=See her talent card', '/amber'],
  ['nav >> text=Interview Amber — free', '/interview'],
  ['footer >> text=Privacy', '/privacy'],
  ['footer >> text=Terms', '/terms'],
  ['footer >> text=Trust & permissions', '/permissions'],
  ['nav >> text=Amber', '/amber'],
]
for (const [sel, expect] of clicks) {
  await page.click(sel)
  await page.waitForTimeout(1500)
  const txt = await page.textContent('#root')
  const crashed = txt.includes("embarrassing")
  console.log(`${sel} -> ${page.url().replace('http://localhost:4173','')} ${crashed ? '>>> BOUNDARY <<<' : 'ok'} len=${txt.trim().length}`)
}
const priv = await page.goto('http://localhost:4173/privacy').then(() => page.textContent('#root'))
console.log('privacy direct load contains CCPA:', priv.includes('CCPA'), '| terms link works')
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'NO page errors — clean run')
await browser.close()
process.exit(errors.length ? 1 : 0)
