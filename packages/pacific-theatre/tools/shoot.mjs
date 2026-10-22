// Dev-only: load the built app (dist/) in headless Chromium and take
// screenshots from a list of shots, without reloading between them. Run
// `npm run build -w @vibe-dump/pacific-theatre` first (and
// `node tools/fake-data.mjs` for the test data).
//
//   node tools/shoot.mjs [outdir] ['<json array of shots>' | preset] [extra query]
//   shot = { name, date, cam: [x, z, distance, yaw, pitch], battle, t, moment, preview, camera,
//            chapter, event, card, frames, wait, eval, until, keys, click, hover, mouse, settle, element, report }
//     date: the WarClock's date (YYYY-MM-DD), as #date does
//     cam: the active rig's pose in its scene's units (km on the table, m in a box), as #cam does
//     battle, t, moment: enter that box (app.battle.enter, with no fly-down), at that
//       battle-clock time, offering that moment; with the Stage 0 stub this lands the
//       table on the box's outline. preview: true then cuts into the stub's bare box
//       scene. A shot without `battle` leaves any box first.
//     camera: a box camera mode ('orbit', 'chase', ...) for the box scene's setCamera, when it has one
//     chapter: open the tour on that chapter's card (its index); event: open that event's card
//       through the tour (an id; true for the first event with a box); card: 'close' or 'credits'
//     eval: a function body run in the page with `app` (async allowed)
//     until: an expression waited on before the settle (app.ready, say)
//     report: an expression logged after the shot (app.stats(), say)
//     element: a selector to shoot alone instead of the page
//     keys: keys to press, in order; click / hover: a selector to click or rest on
//     mouse: [x, y] to rest the pointer at on the scene (after the settle)
//     settle: snap the camera's flight and the cut to where they're going (default true)
//   presets: "table" (the theatre, the test box's outline, the box's preview);
//            "gate" (the table workflow's gate: the whole table, an island group close, the
//            front at two keyframes with its hatch and perimeters, a card, the chapter page,
//            a cluster, the credits, the briefing and the after-card)
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
// the whole theatre, the camera straight to it, the card closed
const HOME = 'app.ui?.card.close(); app.ui?.onScrub(); const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: h.distance, yaw: h.yaw, pitch: h.pitch })'
// a contested polygon over land in a keyframe, framed close (the hatch)
const HATCH = "app.ui?.card.close(); app.ui?.onScrub(); for (const [id, kf] of app.table.front.keyframes) for (const f of kf.geojson?.features || []) if (f.properties?.state === 'contested' && f.geometry?.type === 'Polygon') { const r = f.geometry.coordinates[0]; let x = 0, z = 0; for (const p of r) { const w = app.data.proj.toWorld(p); x += w[0]; z += w[1] } x /= r.length; z /= r.length; if (app.table.ground.metresAt(x, z) > 0) { app.clock.setDate(Date.parse(id + 'T12:00:00Z')); app.table.rig.jump({ x, z, distance: 1500, yaw: 0, pitch: 1.0 }); return } }"
// a keyframe's date, the middle of the fixtures' table
const KF = (i) => `app.ui?.card.close(); app.ui?.onScrub(); const k = [...app.table.front.keyframes.values()][${i}]; if (k) app.clock.setDate(Date.parse(k.date + 'T12:00:00Z')); app.table.rig.jump({ x: 800, z: 200, distance: 7000, yaw: 0, pitch: 1.05 })`
// the box event's date from the whole theatre, where its neighbours gather with it
const CLUSTER = "app.ui.card.close(); app.ui.pins.activeEvent = null; app.table.setFocus(null); app.ui.onScrub(); app.clock.setDate(Date.UTC(1942, 5, 4, 18)); const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: app.table.rig.maxDistance, yaw: 0, pitch: 1.12 })"
const BRIEFING = "app.ui.openBriefing({ title: 'The Test Box Battle, 4 June 1942', ja: { kanji: '試験海戦', romaji: 'Shiken kaisen' }, when: '4 June 1942, 10:20', clock: 'zone plus 12, Midway time (UTC−12)', clockNote: 'Test: Tokyo time is 21 hours ahead.', situation: 'Test: two made-up forces close near Dateline Island. Nothing here is history.', forces: [{ name: 'Test Japanese force', ja: '試験部隊', units: ['Test Carrier A', 'Test Battleship', 'Test Destroyer'] }, { name: 'Test US force', units: ['Test Carrier B', 'Test Cruiser', 'Test Destroyer'] }], moments: [{ id: 'test-dive', title: 'A test dive', role: 'a test dive bomber of the test group', t: '10:21:30', objective: 'Test: put a bomb on the test carrier.', focus: true }, { id: 'test-duel', title: 'A test gunnery duel', role: 'the test battleship', t: '11:40', objective: 'Test: hit the test cruiser.' }], sources: [{ id: 'test-source-a', where: 'p. 2' }], credit: 'Test terrain: made-up relief from tools/fake-data.mjs.' })"
const AFTER = "app.ui.openAfter({ momentId: 'test-dive', title: 'A test dive', sortie: [{ label: 'Hits', value: 'one test bomb, aft' }, { label: 'Release', value: '740 m (the record: about 760 m)' }, { label: 'Came back', value: 'landed' }], battle: { rows: [{ what: 'Test Carrier A', record: 'burning from 10:25, sank 19:25', yours: 'burning from 10:24; sinks 19:25 as in the record' }], guesses: ['Test: the sim’s guess; the record has no such event'] }, record: { text: 'Test: the record counts between 1,000 and 1,200 men lost their lives aboard the test carrier.', tellings: [{ source: 'test-source-b', says: 'Test: three hits.' }], sources: ['test-source-a'] }, next: { text: 'Test: what came next.' }, retry: { start: true, checkpoint: true } })"
const PRESETS = {
  gate: [
    { name: 'gate-table', eval: HOME, frames: 3 },
    // an island group: the Solomons on the real data (Guadalcanal's place), the fixture's islands otherwise
    { name: 'gate-island', eval: "app.ui?.card.close(); const p = app.data.places.find((x) => x.id === 'guadalcanal'); const [x, z] = p && p.geometry?.type === 'Point' ? app.data.proj.toWorld(p.geometry.coordinates) : [-213, -1168]; app.table.rig.jump({ x, z, distance: 900, yaw: 0, pitch: 0.95 })", frames: 3 },
    { name: 'gate-front-a', eval: KF(0), frames: 3, report: 'app.table.front.legend()' },
    { name: 'gate-front-b', eval: KF(1), frames: 3, report: 'app.table.front.legend()' },
    { name: 'gate-hatch', eval: HATCH, frames: 3 },
    { name: 'gate-card', event: true, frames: 3 },
    { name: 'gate-chapter', click: ".tl-tick[data-i='2']", frames: 3 },
    { name: 'gate-cluster', eval: CLUSTER, frames: 3, report: 'app.ui.pins.groups()' },
    { name: 'gate-credits', card: 'credits', frames: 2 },
    { name: 'gate-briefing', eval: BRIEFING, frames: 2 },
    { name: 'gate-after', eval: AFTER, frames: 2 },
  ],
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
    if (s.camera && app.active.setCamera) app.active.setCamera(s.camera)
    if (s.chapter !== undefined) app.tour.goTo(s.chapter, -1)
    if (s.event) {
      const ev = s.event === true ? app.data.events.find((e) => e.box && app.data.boxById.has(e.box)) : app.data.events.find((e) => e.id === s.event)
      if (ev) app.tour.open(ev)
    }
    if (s.card === 'close') app.ui.card.close()
    if (s.card === 'credits') app.ui.openCredits()
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
console.log(errors.length ? `${errors.length} console errors/warnings: ${errors.slice(0, 3).join(' | ')}` : 'no console errors')
await browser.close()
server.close()
