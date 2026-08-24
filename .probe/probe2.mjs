import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { startStaticServer } from '/home/user/vibe-dump/scripts/static-server.mjs'
const dist = '/home/user/vibe-dump/packages/lotus-os/dist'
async function findChromium() {
  for (const e of await readdir('/opt/pw-browsers')) {
    const c = join('/opt/pw-browsers', e, 'chrome-linux', 'chrome')
    if (e.startsWith('chromium-') && existsSync(c)) return c
  }
}
const { url, close } = await startStaticServer(dist)
const browser = await chromium.launch({ executablePath: await findChromium(), args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('[throw]', e.message))
page.on('console', (m) => { if (m.type()==='error') console.log('[err]', m.text()) })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1600)

const windows = await page.evaluate(() => window.lotus.shell.wm.list().length)
console.log('open windows at rest:', windows)

// open the File menu by clicking the appbar button labelled File
const menuState = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.appbar__menu')].find((b) => b.textContent === 'File')
  btn.click()
  const items = [...document.querySelectorAll('.menu__item')].map((b) => ({
    label: b.querySelector('.menu__label').textContent,
    disabled: b.disabled,
  }))
  return items
})
console.log('File menu:', JSON.stringify(menuState))

const viewState = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.appbar__menu')].find((b) => b.textContent === 'View')
  btn.click()
  return [...document.querySelectorAll('.menu__item')].map((b) => ({
    label: b.querySelector('.menu__label').textContent,
    disabled: b.disabled,
    check: b.querySelector('.menu__check')?.innerHTML ? 'yes' : 'no',
  }))
})
console.log('View menu:', JSON.stringify(viewState))

// toggle ornament off via settings, then re-open View to see if the check updates
await page.evaluate(() => { window.lotus.shell.prefs.set('ornament', false) })
await page.waitForTimeout(200)
const viewState2 = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.appbar__menu')].find((b) => b.textContent === 'View')
  btn.click()
  return [...document.querySelectorAll('.menu__item')].map((b) => ({
    label: b.querySelector('.menu__label').textContent,
    check: b.querySelector('.menu__check')?.innerHTML ? 'yes' : 'no',
  }))
})
console.log('View menu after ornament=false:', JSON.stringify(viewState2))
console.log('prefs.ornament =', await page.evaluate(() => window.lotus.shell.prefs.get('ornament')))

await browser.close()
await close()
