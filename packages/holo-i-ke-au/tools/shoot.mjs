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
// ==== settlements: a named list of shots ======================================
//   node tools/shoot.mjs <outdir> settlements
// The town by era (features/settlements.js), each shot once the district and
// its buildings are in: the harbour and Kou in 1795, Honolulu in 1853, 1896
// and 1930, downtown and Waikīkī now (the timeline's last year, drawn from
// the 2020 keyframe), and the valley in 1896.
const nearShot = (name, place, year, [bearing, pitch, distance], first = false) => ({
  name,
  year,
  eval: `${first ? 'app.ui.card.close(); app.ui.onScrub(); ' : ''}const v = app.tour.cameraView(app.tour.places.get('${place}'), { bearing: ${bearing}, pitch: ${pitch}, distance: ${distance} }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })`,
  until: "app.districts.cur?.state === 'ready' && !!app.districts.cur.features?.settlements.ready",
  report: 'app.districts.cur.features.settlements.stats()',
})
// ==== chain: the whole chain and the routes that follow the story ==============
//   node tools/shoot.mjs <outdir> chain          (and VIEWPORT=390x844 for a phone)
// The opening (chapter 1's card over the chain, its events' routes faint), the
// chain alone from the home button, the chain at contact in each far view
// with no card (no routes), the same with the routes toggle on (all of them),
// the Pāʻao step (its own route), the far steps of Moʻikeha and Kaʻieʻiewaho
// (the chain's turn kept), and Cook at Kealakekua.
const tourTo = (id) => `const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1])`
const homeChain = "const v = app.tour.chainView(); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })"
const chainReport = '[Math.round(app.rig.goal.distance), +app.rig.goal.yaw.toFixed(3), +app.rig.goal.pitch.toFixed(3), app.ui.freeBox()]'
// ==== end chain ===============================================================
const PRESETS = {
  chain: [
    { name: 'open', report: chainReport },
    { name: 'home', eval: `app.ui.card.close(); ${homeChain}`, report: chainReport },
    { name: 'chiefdoms-1778', year: 1778, eval: `app.ui.card.close(); app.ui.onScrub(); app.setView('chiefdoms'); ${homeChain}`, report: chainReport },
    { name: 'land-1778', year: 1778, eval: `app.setView('land'); ${homeChain}`, until: 'app.land.ready', frames: 4 },
    { name: 'routes-all-1778', year: 1778, eval: `app.setView('chiefdoms'); document.querySelector('.tools [data-tool="routes"]').click(); ${homeChain}` },
    { name: 'paao', eval: `document.querySelector('.tools [data-tool="routes"]').click(); ${tourTo('paao')}` },
    { name: 'moikeha-far', eval: tourTo('moikeha'), report: chainReport },
    { name: 'kaieiewaho-far', eval: tourTo('kaieiewaho-1796'), report: chainReport },
    { name: 'cook-kealakekua', eval: tourTo('cook-kealakekua-1779') },
  ],
  settlements: [
    nearShot('harbour-1795', 'kou', 1795, [45, 0.6, 40], true),
    nearShot('kou-1795', 'kou', 1795, [30, 0.45, 16]),
    nearShot('honolulu-1853', 'honolulu', 1853, [40, 0.5, 22]),
    nearShot('honolulu-1896', 'honolulu', 1896, [40, 0.5, 22]),
    nearShot('honolulu-1930', 'honolulu', 1930, [40, 0.5, 22]),
    nearShot('downtown-now', 'kou', 2020, [50, 0.45, 24]),
    nearShot('waikiki-now', 'waikiki', 2020, [20, 0.45, 26]),
    nearShot('valley-1896', 'nuuanu', 1896, [42, 0.35, 60]),
  ],
}
// ==== end settlements =========================================================
const shots = PRESETS[process.argv[3]] || JSON.parse(process.argv[3] || '[{"name":"default"}]')
const extra = process.argv[4] || ''
const port = Number(process.env.PORT || 5299)
const useTest = process.env.DATA ? process.env.DATA === 'test' : !existsSync(join(root, 'public/data/manifest.json'))
mkdirSync(outDir, { recursive: true })

// ==== the battles' people (features/soldiers.js) ===================================== [soldiers]
// '[{"preset":"soldiers"}]' walks the battles: the Puʻiwa and Lāʻimi stops at the stop camera and
// close in (cam, over the fronts, where one figure is a few dozen pixels), the march past Kou, the
// retreat to the pali, the landing at Waikīkī, Kaheiki in 1783 and its columns, and last the sprite
// sheet itself. A shot with `sheet: n` lays the sheet (as the district's soldiers built it) over the
// page at n× on a ground-coloured backing and shoots it alone.
{
  const tour = (ev, stop) => `const at = app.tour.locate(app.data.events.find((e) => e.id === '${ev}')); app.tour.goTo(at[0], at[1]); app.tour.goStop(${stop})`
  const ready = "app.districts.cur?.state === 'ready'"
  const people = 'app.districts.cur.features.forces.stats()'
  // (over the fronts between the two lines, looking up the valley as the stops do: yaw -42°, pitch 0.38 of a right angle)
  const SOLDIERS = [
    { name: 'puiwa', eval: tour('nuuanu-1795', 5), until: ready, frames: 4, report: people },
    { name: 'puiwa-close', cam: [-350.86, -923.85, 10, -0.733, 0.597], frames: 3, report: people },
    { name: 'laimi', eval: 'app.tour.goStop(6)', until: ready, frames: 4, report: people },
    { name: 'laimi-close', cam: [-348.26, -927.5, 10, -0.733, 0.597], frames: 3, report: people },
    { name: 'kou', eval: 'app.tour.goStop(4)', until: ready, frames: 4, report: people },
    { name: 'pali', eval: 'app.tour.goStop(7)', until: ready, frames: 4, report: people },
    { name: 'waikiki', eval: 'app.tour.goStop(3)', until: ready, frames: 4, report: people },
    { name: 'kaheiki', eval: tour('kaheiki-1783', 2), until: ready, frames: 4, report: people },
    { name: 'kaheiki-columns', eval: 'app.tour.goStop(1)', until: ready, frames: 4, report: people },
    { name: 'sheet', sheet: 2, settle: false, frames: 1 },
  ]
  const showSheet = (app, n) => {
    const S = app.districts.cur?.features?.forces?.soldiers
    if (!S) throw new Error('no district down: no sprite sheet to show')
    const { width: w, height: h, data } = S.sheet
    const cv = document.getElementById('sheet-shot') || document.body.appendChild(document.createElement('canvas'))
    cv.id = 'sheet-shot'
    cv.width = w * n + 16
    cv.height = h * n + 16
    Object.assign(cv.style, { position: 'fixed', left: '0', top: '0', zIndex: 1000, imageRendering: 'pixelated' })
    const cx = cv.getContext('2d')
    cx.fillStyle = '#76825a'
    cx.fillRect(0, 0, cv.width, cv.height)
    const img = cx.createImageData(w * n, h * n)
    for (let y = 0; y < h * n; y++) {
      for (let x = 0; x < w * n; x++) {
        const s = (Math.floor(y / n) * w + Math.floor(x / n)) * 4
        const o = (y * w * n + x) * 4
        const a = data[s + 3] ? 1 : 0
        img.data[o] = a ? data[s] : 0x76
        img.data[o + 1] = a ? data[s + 1] : 0x82
        img.data[o + 2] = a ? data[s + 2] : 0x5a
        img.data[o + 3] = 255
      }
    }
    cx.putImageData(img, 8, 8)
  }
  for (let i = shots.length - 1; i >= 0; i--) if (shots[i].preset === 'soldiers') shots.splice(i, 1, ...SOLDIERS)
  for (const s of shots) if (s.sheet) Object.assign(s, { eval: `${s.eval || ''};(${showSheet})(app, ${s.sheet})`, element: '#sheet-shot' })
}
// ==== [soldiers] end ===============================================================================

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
