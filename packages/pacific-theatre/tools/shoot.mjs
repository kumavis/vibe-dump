// Dev-only: load the built app (dist/) in headless Chromium and take
// screenshots from a list of shots, without reloading between them. Run
// `npm run build -w @vibe-dump/pacific-theatre` first (and
// `node tools/fake-data.mjs` for the test data).
//
//   node tools/shoot.mjs [outdir] ['<json array of shots>' | preset] [extra query]
//   shot = { name, date, cam: [x, z, distance, yaw, pitch], battle, t, moment, preview,
//            frames, wait, eval, until, keys, click, hover, mouse, settle, element, report }
//     date: the WarClock's date (YYYY-MM-DD), as #date does
//     cam: the active rig's pose in its scene's units (km on the table, m in a box), as #cam does
//     battle, t, moment: enter that box (app.battle.enter, with no fly-down), at that
//       battle-clock time, offering that moment; with the Stage 0 stub this lands the
//       table on the box's outline. preview: true then cuts into the stub's bare box
//       scene. A shot without `battle` leaves any box first.
//     eval: a function body run in the page with `app` (async allowed)
//     until: an expression waited on before the settle (app.ready, say)
//     report: an expression logged after the shot (app.stats(), say)
//     element: a selector to shoot alone instead of the page
//     keys: keys to press, in order; click / hover: a selector to click or rest on
//     mouse: [x, y] to rest the pointer at on the scene (after the settle)
//     settle: snap the camera's flight and the cut to where they're going (default true)
//   presets: "table" (the theatre, the test box's outline, the box's preview)
//   DATA=real   load public/data/ (the default once public/data/manifest.json exists)
//   VIEWPORT=390x844, PORT=5299, DPR=2, CHROMIUM_PATH=...
//
// The package directory is served as the root, so the app's ?data= can reach
// test-data/ beside dist/. Adapted from holo-i-ke-au's tools/shoot.mjs
// (b480c27): the server, the launch and the shot loop are kept; the Hawaiian
// presets (settlements, soldiers) are gone; it waits on app.ready.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// (tools/shots/ is gitignored at the root)
const outDir = process.argv[2] || join(root, 'tools/shots')
const PRESETS = {
  table: [
    { name: 'table-theatre', eval: 'const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: h.distance, yaw: h.yaw, pitch: h.pitch })', frames: 3 },
    { name: 'table-outline', battle: 'test-box', frames: 3 },
    { name: 'box-preview', battle: 'test-box', preview: true, frames: 3 },
  ],
}
const shots = PRESETS[process.argv[3]] || JSON.parse(process.argv[3] || '[{"name":"default"}]')
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
await page.waitForFunction(() => window.__app?.ready, null, { timeout: 180000 })
console.log('booted after', Date.now() - t0, 'ms', useTest ? '(test data)' : '(real data)')

const frames = async (n) => {
  const f0 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction(([f0, n]) => window.__app.frames > f0 + n, [f0, n], { timeout: 300000 })
}

for (const s of shots) {
  await page.evaluate(async (s) => {
    const app = window.__app
    const b = app.battle
    // a shot without a battle, or with another one, leaves the box it is in
    if (b.state && (!s.battle || s.battle !== b.state.boxId || (b.scene && !s.preview))) await b.leave()
    if (s.date) app.clock.setDate(Date.parse(`${s.date}T00:00:00Z`))
    if (s.battle && b.state?.boxId !== s.battle) await b.enter(s.battle, { t: s.t ?? null, momentId: s.moment ?? null, from: 'url' })
    if (s.preview && !b.scene) await b.preview()
    if (s.cam) {
      const [x, z, distance, yaw, pitch] = s.cam
      app.active.rig.jump({ x, z, distance, yaw, pitch })
    }
    if (s.eval) await new Function('app', `return (async () => { ${s.eval} })()`)(app)
  }, s)
  for (const k of s.keys || []) await page.keyboard.press(k)
  if (s.click) await page.click(s.click, { timeout: 30000 })
  // a frame to move the camera, then let the ground and the camera's target settle
  await frames(1)
  if (s.until) await page.waitForFunction(new Function(`const app = window.__app; return ${s.until}`), null, { timeout: 300000 })
  if (s.settle !== false) await page.evaluate(() => window.__app.settle())
  await frames(s.frames ?? 3)
  if (s.hover) {
    await page.hover(s.hover, { timeout: 30000 })
    await frames(2)
  }
  if (s.mouse) {
    await page.mouse.move(s.mouse[0] - 6, s.mouse[1])
    await page.waitForTimeout(150)
    await page.mouse.move(s.mouse[0], s.mouse[1])
    await frames(2)
  }
  if (s.wait) await page.waitForTimeout(s.wait)
  const t = Date.now()
  const file = join(outDir, (s.name || 'shot') + '.png')
  if (s.element) await page.locator(s.element).screenshot({ path: file, timeout: 180000 })
  else await page.screenshot({ path: file, timeout: 180000 })
  const info = await page.evaluate(() => {
    const a = window.__app
    const st = a.stats()
    return { mode: a.mode, scene: st.scene, d: st.distance, exag: st.exag, nodes: st.nodes, calls: st.calls, date: new Date(a.clock.date).toISOString().slice(0, 10), battle: a.battle.state, hash: location.hash }
  })
  if (s.report) console.log('report', s.name, JSON.stringify(await page.evaluate(new Function(`const app = window.__app; return ${s.report}`))))
  console.log('shot', s.name, 'in', Date.now() - t, 'ms', JSON.stringify(info), '→', file)
}
const perf = await page.evaluate(() => window.__app.stats?.())
if (perf) console.log('stats', JSON.stringify(perf))
console.log(errors.length ? `${errors.length} console errors/warnings` : 'no console errors')
await browser.close()
server.close()
