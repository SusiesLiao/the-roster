import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const base = 'http://127.0.0.1:4206'
const browser = await chromium.launch({ headless: true, channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.setDefaultTimeout(8000)
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
const results = []
const record = results.push.bind(results)
results.push = line => { console.log(`PASS ${line}`); return record(line) }
try {
  await mkdir('verification', { recursive: true })
  await page.goto(base)
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.evaluate(() => document.fonts.ready)
  assert.match(await page.title(), /better-run studio/)
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily.includes('Cormorant')), true)
  assert.equal(await page.evaluate(() => document.fonts.check('500 24px "Cormorant Garamond"')), true)
  await page.screenshot({ path: 'verification/entrance-desktop.png', fullPage: true })
  results.push('Entrance renders with local Cormorant and updated metadata')
  assert.equal(await page.locator('.studio-services li').first().evaluate(el => getComputedStyle(el, '::before').borderRadius), '50%')
  assert.equal(await page.locator('.studio-services li').first().evaluate(el => getComputedStyle(el, '::before').width), '5px')
  assert.equal(await page.locator('.studio-site').innerText().then(text => /[↗←↓]/.test(text)), false)
  for (const [index, text] of [[1, 'Turn a message'], [2, 'Know what changed'], [0, 'See the pressure']]) {
    await page.locator('.studio-workflow-buttons button').nth(index).click()
    assert.match(await page.locator('.studio-workflow h3').innerText(), new RegExp(text))
  }
  results.push('All three workflow examples switch correctly')
  await page.locator('summary').filter({ hasText: 'What does it cost?' }).click()
  assert.equal(await page.locator('details[open]').count(), 1)
  assert.match(await page.locator('a[href^="mailto:"]').first().getAttribute('href'), /subject=.*body=/)
  assert.equal(await page.locator('.studio-signin').getAttribute('href'), 'https://my.theroster.studio/in')
  results.push('FAQ, email-draft CTA and existing sign-in destination verified (no email sent)')
  for (const lang of ['en', 'zh-Hans', 'zh-Hant']) {
    await page.locator('.studio-language select').selectOption(lang)
    await page.reload()
    await page.getByRole('heading', { level: 1 }).waitFor()
    assert.equal(await page.locator('html').getAttribute('lang'), lang)
    assert.equal(await page.locator('.studio-language select').inputValue(), lang)
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
      assert.equal(overflow, false, `${lang} at ${width}px overflows`)
    }
  }
  results.push('All three languages persist; no horizontal overflow at 320, 390, 768 or 1440px')
  await page.locator('.studio-language select').selectOption('en')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => scrollTo(0, 0))
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  await page.getByRole('link', { name: 'The service', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false')
  await page.evaluate(() => scrollTo(0, 0))
  await page.screenshot({ path: 'verification/entrance-mobile.png', fullPage: true })
  results.push('Mobile menu opens, navigates and closes')
  await page.goto(`${base}/rooms`)
  assert.equal(await page.locator('.studio-room-grid article').count(), 4)
  assert.equal(await page.locator('.studio-link-petal').count(), 0)
  assert.equal((await page.locator('.studio-room-grid').innerText()).includes('✿'), false)
  assert.equal(await page.locator('.studio-room-grid a').first().evaluate(el => getComputedStyle(el).textDecorationLine), 'none')
  assert.equal(await page.locator('.studio-room-grid article').first().evaluate(el => getComputedStyle(el).borderTopLeftRadius), '36px')
  assert.equal(await page.getByRole('link', { name: 'Client Suite', exact: false }).first().getAttribute('href'), 'https://my.theroster.studio/client')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: 'verification/rooms-desktop.png', fullPage: true })
  results.push('Four rooms route to existing services; client workspace destination preserved')
  for (const route of ['/personal', '/amber', '/pepper', '/privacy', '/terms', '/permissions']) {
    await page.goto(base + route)
    await page.locator('h1, h2').first().waitFor()
    assert.ok((await page.locator('body').innerText()).length > 300)
  }
  results.push('Personal homepage and five existing public routes still render')
  assert.deepEqual(errors, [])
  results.push('No browser console errors or uncaught page errors')
  console.log(`${results.length} verification groups passed. No production writes performed.`)
} finally { await browser.close() }
