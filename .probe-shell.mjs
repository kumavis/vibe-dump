import { chromium } from 'playwright'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { startStaticServer } from './scripts/static-server.mjs'

const base = '/opt/pw-browsers'
const dir = readdirSync(base).find((d) => d.startsWith('chromium-') && existsSync(join(base, d, 'chrome-linux', 'chrome')))
const { url, close } = await startStaticServer(process.env.DIST)
const browser = await chromium.launch({ executablePath: join(base, dir, 'chrome-linux', 'chrome'), args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(`throw: ${e.message}`))
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await page.screenshot({ path: `${process.env.OUT}/shell-dark.png` })

const info = await page.evaluate(() => ({
  windows: window.lotus.shell.wm.list().map((w) => ({ t: w.title, r: w.rect })),
  scale: window.lotus.getScale(),
  theme: window.lotus.shell.prefs.get('theme'),
}))
console.log(JSON.stringify(info, null, 1))

// exercise the programs
await page.evaluate(() => {
  const s = window.lotus.shell
  s.wm.closeAll()
  s.launch('terminal')
  s.launch('about')
  s.launch('explorer', { path: '/Notes' })
  setTimeout(() => s.wm.tileAll(), 50)
})
await page.waitForTimeout(800)
await page.screenshot({ path: `${process.env.OUT}/shell-programs.png` })

// type into the terminal
await page.evaluate(() => document.querySelector('.term__input')?.focus())
await page.keyboard.type('ls /Wat')
await page.keyboard.press('Enter')
await page.keyboard.type('help')
await page.keyboard.press('Enter')
await page.waitForTimeout(400)
await page.screenshot({ path: `${process.env.OUT}/shell-terminal.png` })

await page.evaluate(() => window.lotus.shell.prefs.set('theme', 'light'))
await page.waitForTimeout(400)
await page.screenshot({ path: `${process.env.OUT}/shell-light.png` })

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no page errors')
await browser.close()
await close()
