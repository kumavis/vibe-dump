// Dev-only: load the built app (dist/) in headless Chromium and take
// screenshots from a list of views, without reloading between them. Run
// `npm run build -w @vibe-dump/holo-i-ke-au` first.
//
//   node tools/shoot.mjs <outdir> '<json array of shots>' [extra query]
//   shot = { name, cam: [x, z, distance, yaw, pitch], year, frames, wait, eval, until, keys, click, hover, mouse, settle, element, report }
//     eval: a function body run in the page with `app` (app.tour.goTo(6, 0), say)
//     until: an expression waited on before the settle (app.land.ready, say)
//     report: an expression logged after the shot (app.districts.stats(), say)
//     element: a selector to shoot alone instead of the page (.legend, say)
//     keys: keys to press, in order (["ArrowRight", "ArrowRight"])
//     click / hover: a selector to click, or to rest the pointer on (after the settle)
//     mouse: [x, y] to rest the pointer at on the scene (after the settle), as a hand would
//     settle: snap the camera's flight, the year and the island packs to where they're going (default true)
//   DATA=test   load test-data/ (tools/fake-data.mjs); the default when
//               public/data/manifest.json doesn't exist yet
//   VIEWPORT=390x844, PORT=5299, DPR=2
//
// The package directory is served as the root, so the app's ?data= can reach
// test-data/ beside dist/.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// (tools/shots/ is gitignored at the root)
const outDir = process.argv[2] || join(root, 'tools/shots')
const shots = JSON.parse(process.argv[3] || '[{"name":"default"}]')
const extra = process.argv[4] || ''
const port = Number(process.env.PORT || 5299)
const useTest = process.env.DATA ? process.env.DATA === 'test' : !existsSync(join(root, 'public/data/manifest.json'))
mkdirSync(outDir, { recursive: true })

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }
export function serve(dir, p) {
  const server = createServer(async (req, res) => {
    let f = normalize(join(dir, decodeURIComponent(req.url.split('?')[0])))
    if (!f.startsWith(dir)) return res.writeHead(403).end()
    const s = await stat(f).catch(() => null)
    if (s?.isDirectory()) f = join(f, 'index.html')
    const body = await readFile(f).catch(() => null)
    if (!body) return res.writeHead(404).end('not found')
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }).end(body)
  })
  return new Promise((r) => server.listen(p, '127.0.0.1', () => r(server)))
}

const server = await serve(root, port)
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const [vw, vh] = (process.env.VIEWPORT || '1280x800').split('x').map(Number)
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: Number(process.env.DPR || 1), hasTouch: vw < 760 })
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`)
  console.log('[page]', m.type(), m.text())
})
page.on('pageerror', (e) => {
  errors.push(`pageerror: ${e.message}`)
  console.log('[pageerror]', e.message)
})
const t0 = Date.now()
const q = [useTest ? 'data=../test-data/' : '', extra].filter(Boolean).join('&')
await page.goto(`http://127.0.0.1:${port}/dist/index.html${q ? `?${q}` : ''}`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
console.log('booted after', Date.now() - t0, 'ms', useTest ? '(test data)' : '(real data)')
await page.waitForFunction(() => window.__app?.islandsLoaded, null, { timeout: 300000 })
console.log('islands loaded after', Date.now() - t0, 'ms')

for (const s of shots) {
  await page.evaluate((s) => {
    const app = window.__app
    if (s.year !== undefined) app.timeline.setYear(s.year)
    if (s.cam) {
      const [x, z, distance, yaw, pitch] = s.cam
      app.rig.jump({ x, z, distance, yaw, pitch })
    }
    if (s.eval) new Function('app', s.eval)(app)
  }, s)
  for (const k of s.keys || []) await page.keyboard.press(k)
  if (s.click) await page.click(s.click, { timeout: 30000 })
  // a frame to move the camera, then let the packs and the camera's target settle
  const f0 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction((f0) => window.__app.frames > f0 + 1, f0, { timeout: 300000 })
  if (s.until) await page.waitForFunction(new Function(`const app = window.__app; return ${s.until}`), null, { timeout: 300000 })
  if (s.settle !== false) await page.evaluate(() => window.__app.settle())
  const f1 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction(([f1, n]) => window.__app.frames > f1 + n, [f1, s.frames ?? 3], { timeout: 300000 })
  if (s.hover) {
    await page.hover(s.hover, { timeout: 30000 })
    const f2 = await page.evaluate(() => window.__app.frames)
    await page.waitForFunction((f2) => window.__app.frames > f2 + 2, f2, { timeout: 300000 })
  }
  if (s.mouse) {
    // (two moves, the hover card's own throttle apart)
    await page.mouse.move(s.mouse[0] - 6, s.mouse[1])
    await page.waitForTimeout(150)
    await page.mouse.move(s.mouse[0], s.mouse[1])
    const f2 = await page.evaluate(() => window.__app.frames)
    await page.waitForFunction((f2) => window.__app.frames > f2 + 2, f2, { timeout: 300000 })
  }
  if (s.wait) await page.waitForTimeout(s.wait)
  const t = Date.now()
  if (s.element) await page.locator(s.element).screenshot({ path: join(outDir, (s.name || 'shot') + '.png'), timeout: 180000 })
  else await page.screenshot({ path: join(outDir, (s.name || 'shot') + '.png'), timeout: 180000 })
  const info = await page.evaluate(() => {
    const a = window.__app
    const tour = a.tour?.state
    return { d: Math.round(a.rig.state.distance), view: a.view, land: a.land?.stats?.(), fill: a.islandFill ? +a.islandFill().toFixed(2) : undefined, routes: a.routes?.visibleRoutes().map((r) => r.id), exag: a.world.exag.toFixed(2), slots: a.world.slots.map((t) => (t ? `${t.pack.id}:${t.k.toFixed(2)}` : '-')).join(' '), year: Math.round(a.timeline.year), tour, clusters: a.ui?.pins.groups().map((g) => g.ids.join('+')), inspector: document.querySelector('.inspector.show') ? document.querySelector('.inspector').textContent.replace(/\s+/g, ' ').trim() : null, patches: a.patches?.stats().islands.map((r) => `${r.id}:${r.k}`), district: a.districts?.patchWeights?.().map((p) => `${p.id}:${p.k}`) }
  })
  if (s.report) console.log('report', s.name, JSON.stringify(await page.evaluate(new Function(`const app = window.__app; return ${s.report}`))))
  console.log('shot', s.name, 'in', Date.now() - t, 'ms', JSON.stringify(info))
}
const perf = await page.evaluate(() => window.__app.stats?.())
if (perf) console.log('stats', JSON.stringify(perf))
console.log(errors.length ? `${errors.length} console errors/warnings` : 'no console errors')
await browser.close()
server.close()
