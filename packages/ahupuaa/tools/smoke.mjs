// Dev-only: boot the app in headless Chromium and drive the interface with real
// pointer input — buttons, the rail, the dock, markers, dragging the view — to
// catch anything that stops clicks reaching what's on screen.
//
//   node tools/smoke.mjs
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT || 5198)
const server = await createServer({ root, server: { port, strictPort: true }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
await page.goto(`http://localhost:${port}/`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 120000 })

let failed = 0
const check = async (name, fn) => {
  try {
    await fn()
    console.log('  ✓', name)
  } catch (err) {
    failed++
    console.log('  ✗', name, '—', err.message.split('\n')[0])
  }
}
const ui = (expr) => page.evaluate(new Function(`const app = window.__app; return ${expr}`))
const expect = async (expr, want) => {
  const got = await ui(expr)
  if (got !== want) throw new Error(`${expr} = ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`)
}
const opts = { timeout: 15000 }

await check('next', async () => {
  await page.click('.card .nav.next', opts)
  await expect('app.ui.index', 1)
})
await check('previous', async () => {
  await page.click('.card .nav.prev', opts)
  await expect('app.ui.index', 0)
})
await check('rail dot', async () => {
  await page.click('.rail .dot[data-i="5"]', opts)
  await expect('app.ui.index', 5)
})
await check('close the card', async () => {
  await page.click('.card .card-close', opts)
  await expect("document.querySelector('.card').classList.contains('show')", false)
})
await check('drag to orbit', async () => {
  await page.evaluate(() => window.__app.rig.finishFlight())
  const yaw = await ui('app.rig.goal.yaw')
  await page.mouse.move(400, 400)
  await page.mouse.down()
  await page.mouse.move(520, 410, { steps: 6 })
  await page.mouse.up()
  const now = await ui('app.rig.goal.yaw')
  if (Math.abs(now - yaw) < 0.1) throw new Error(`yaw ${yaw} → ${now}`)
})
await check('wheel to zoom', async () => {
  const d = await ui('app.rig.goal.distance')
  await page.mouse.move(400, 400)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(300)
  const now = await ui('app.rig.goal.distance')
  if (!(now > d * 1.05)) throw new Error(`distance ${d} → ${now}`)
})
await check('weather regime', async () => {
  await page.click('.dock [data-regime="kona"]', opts)
  await expect('app.weather.regime', 'kona')
})
await check('help opens and closes', async () => {
  await page.click('.tools [data-tool="help"]', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", false)
  await page.click('.help .help-close', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", true)
})
await check('explore mode', async () => {
  await page.click('.modes [data-mode="explore"]', opts)
  await expect('app.ui.mode', 'explore')
})
await check('a marker opens its card', async () => {
  await page.evaluate(() => window.__app.rig.finishFlight())
  await page.waitForFunction(() => [...document.querySelectorAll('.marker')].some((m) => m.style.pointerEvents === 'auto'), null, { timeout: 30000 })
  // markers ride the slow auto-orbit, so they're never "stable" to Playwright;
  // stop it and press where one is, as a person would
  await page.evaluate(() => (window.__app.rig.autoOrbit = 0))
  await page.waitForTimeout(500)
  const [title, x, y] = await page.evaluate(() => {
    const m = [...document.querySelectorAll('.marker')].find((m) => m.style.pointerEvents === 'auto')
    const r = m.getBoundingClientRect()
    return [m.title, r.x + 12, r.y + r.height / 2]
  })
  await page.mouse.click(x, y)
  await page.waitForFunction((t) => document.querySelector('.card.show h1')?.textContent === t, title, { timeout: 15000 })
})

await browser.close()
await server.close()
console.log(failed ? `${failed} failed` : 'all passed')
process.exitCode = failed ? 1 : 0
