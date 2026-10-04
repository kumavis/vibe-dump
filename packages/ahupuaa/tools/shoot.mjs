// Dev-only: boot the app in headless Chromium and take screenshots from a list
// of views, without reloading between them.
//
//   node tools/shoot.mjs <outdir> '<json array of shots>'
//   shot = { name, cam: [x, z, dist, yaw, pitch], hour, doy, wait, eval }
//   VIEWPORT=390x844 node tools/shoot.mjs ...   (e.g. to check the phone layout)
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = process.argv[2]
const shots = JSON.parse(process.argv[3] || '[{"name":"default"}]')
const query = process.argv[4] || ''
const server = await createServer({ root, server: { port: 5199 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const [vw, vh] = (process.env.VIEWPORT || '1280x800').split('x').map(Number)
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1, hasTouch: vw < 760 })
page.on('console', (m) => console.log('[page]', m.type(), m.text()))
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
const t0 = Date.now()
await page.goto(`http://localhost:5199/${query}`)
await page.waitForFunction(() => window.__app && window.__app.frames > 2, null, { timeout: 120000 })
console.log('ready after', Date.now() - t0, 'ms')
for (const s of shots) {
  await page.evaluate((s) => {
    const app = window.__app
    if (s.cam) {
      const [x, z, d, yaw, pitch] = s.cam
      const r = app.rig
      for (const st of [r.goal, r.state]) {
        st.target.set(x, app.terrain.heightAt(x, z), z)
        st.distance = d
        st.yaw = yaw
        st.pitch = pitch
      }
      r.flight = null
    }
    if (s.hour !== undefined) app.clock.hour = s.hour
    if (s.doy !== undefined) app.clock.doy = s.doy
    if (s.eval) new Function('app', s.eval)(app)
  }, s)
  const f0 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction((f0) => window.__app.frames > f0 + 2, f0, { timeout: 300000 })
  if (s.wait) await page.waitForTimeout(s.wait)
  const t = Date.now()
  await page.screenshot({ path: join(outDir, (s.name || 'shot') + '.png'), timeout: 180000 })
  console.log('shot', s.name, 'in', Date.now() - t, 'ms')
}
await browser.close()
await server.close()
