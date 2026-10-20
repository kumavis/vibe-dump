// Dev-only: boot the built app (dist/) in headless Chromium and drive it with
// real pointer input (the wheel from the whole chain down to a valley, drags,
// the year slider and its ticks, the layer toggles, a pin, its card and its
// stops) to catch anything that stops input reaching what's on screen, and
// any console error on the way. Run `npm run build -w @vibe-dump/holo-i-ke-au`
// first.
//
//   node tools/smoke.mjs                 (real data if public/data has events, else test-data/)
//   DATA=test node tools/smoke.mjs       (test-data/, from tools/fake-data.mjs)
//   DATA=real node tools/smoke.mjs
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT || 5298)
const realReady = existsSync(join(root, 'public/data/manifest.json')) && existsSync(join(root, 'public/data/events.json'))
const useTest = process.env.DATA ? process.env.DATA === 'test' : !realReady

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.woff2': 'font/woff2' }
const server = createServer(async (req, res) => {
  let f = normalize(join(root, decodeURIComponent(req.url.split('?')[0])))
  if (!f.startsWith(root)) return res.writeHead(403).end()
  if ((await stat(f).catch(() => null))?.isDirectory()) f = join(f, 'index.html')
  const body = await readFile(f).catch(() => null)
  if (!body) return res.writeHead(404).end('not found')
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }).end(body)
})
await new Promise((r) => server.listen(port, '127.0.0.1', r))

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  // (a missing gazetteer file is a warning the app carries on from, not a failure)
  if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`)
})
const t0 = Date.now()
await page.goto(`http://127.0.0.1:${port}/dist/index.html${useTest ? '?data=../test-data/' : ''}`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
console.log(`booted in ${Date.now() - t0} ms on ${useTest ? 'test' : 'real'} data`)
await page.waitForFunction(() => window.__app?.islandsLoaded, null, { timeout: 300000 })

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
const frames = async (n) => {
  const f0 = await ui('app.frames')
  await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 120000 })
}
const opts = { timeout: 20000 }

await check('the wheel zooms from the whole chain to a valley', async () => {
  const d0 = await ui('app.rig.goal.distance')
  // aim at the middle of the largest island pack on screen
  const [x, y] = await page.evaluate(() => {
    const app = window.__app
    const t = app.world.islands.sort((a, b) => (b.pack.rect.x1 - b.pack.rect.x0) - (a.pack.rect.x1 - a.pack.rect.x0))[0]
    const r = t.pack.rect
    const v = new app.camera.position.constructor((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2)
    v.y = app.world.heightAt(v.x, v.z)
    v.project(app.camera)
    return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight]
  })
  await page.mouse.move(x, y)
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, -120)
    if (i % 8 === 7) await frames(1)
  }
  await frames(2)
  const d1 = await ui('app.rig.goal.distance')
  const exag = await ui('app.world.exag')
  if (!(d1 < 40 && d0 > 3000)) throw new Error(`distance ${d0.toFixed(0)} → ${d1.toFixed(1)}`)
  console.log(`      distance ${d0.toFixed(0)} → ${d1.toFixed(1)}, exaggeration now ${exag.toFixed(2)}`)
})
await check('island packs take over near the ground', async () => {
  await frames(30)
  const s = await ui('app.world.slots.filter(Boolean).map((t) => t.pack.id + ":" + t.k.toFixed(2)).join(" ")')
  if (!s || !/:(0\.[3-9]|1\.00)/.test(s)) throw new Error(`slots: ${s || 'none'}`)
  console.log(`      slots ${s}`)
})
await check('the camera stays above the ground', async () => {
  const gap = await ui('app.camera.position.y - app.world.heightAt(app.camera.position.x, app.camera.position.z)')
  if (!(gap > 0)) throw new Error(`camera ${gap.toFixed(3)} above the ground`)
})
await check('drag pans', async () => {
  const before = await ui('app.rig.goal.target.x + "," + app.rig.goal.target.z')
  await page.mouse.move(640, 420)
  await page.mouse.down()
  await page.mouse.move(760, 470, { steps: 6 })
  await page.mouse.up()
  const after = await ui('app.rig.goal.target.x + "," + app.rig.goal.target.z')
  if (before === after) throw new Error('target did not move')
})
await check('right-drag turns', async () => {
  const yaw = await ui('app.rig.goal.yaw')
  await page.mouse.move(500, 400)
  await page.mouse.down({ button: 'right' })
  await page.mouse.move(640, 410, { steps: 6 })
  await page.mouse.up({ button: 'right' })
  const now = await ui('app.rig.goal.yaw')
  if (Math.abs(now - yaw) < 0.1) throw new Error(`yaw ${yaw} → ${now}`)
})
await check('the wheel zooms back out to the whole chain', async () => {
  await page.mouse.move(640, 400)
  for (let i = 0; i < 45; i++) await page.mouse.wheel(0, 120)
  await frames(3)
  const d = await ui('app.rig.goal.distance')
  if (!(d > 4000)) throw new Error(`distance ${d}`)
})
await check('home flies to the whole chain', async () => {
  await page.click('.tools [data-tool="home"]', opts)
  await page.evaluate(() => window.__app.rig.finishFlight())
  const d = await ui('Math.round(app.rig.goal.distance) === Math.round(app.rig.home.distance)')
  if (!d) throw new Error('not home')
})
const eras = await ui('app.timeline.n')
if (eras > 1) {
  await check('a tick on the timeline moves the year', async () => {
    await page.click('.tl-tick[data-i="0"] span', opts)
    await page.waitForFunction(() => window.__app.timeline.s < 0.01, null, { timeout: 15000 })
    await expect("document.querySelector('.tl-era').textContent === window.__app.timeline.eras[0].label", true)
  })
  await check('dragging the slider moves the year', async () => {
    const box = await page.locator('.tl-input').boundingBox()
    await page.mouse.move(box.x + 12, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width - 12, box.y + box.height / 2, { steps: 8 })
    await page.mouse.up()
    const s = await ui('app.timeline.s')
    if (!(s > eras - 1.3)) throw new Error(`s = ${s}`)
  })
  await check('play sweeps through the eras', async () => {
    await page.click('.tl-tick[data-i="0"] span', opts)
    await page.waitForFunction(() => window.__app.timeline.s < 0.01, null, { timeout: 15000 })
    await page.click('.tl-play', opts)
    await frames(6)
    const s = await ui('app.timeline.s')
    await page.click('.tl-play', opts)
    if (!(s > 0)) throw new Error('did not move')
  })
} else console.log('  - no eras: timeline checks skipped')

for (const t of ['polity', 'lines', 'pins']) {
  await check(`toggle ${t}`, async () => {
    const was = await ui(`app.overlay.${t}`)
    await page.click(`.tools [data-tool="${t}"]`, opts)
    await expect(`app.overlay.${t}`, !was)
    await page.click(`.tools [data-tool="${t}"]`, opts)
    await expect(`app.overlay.${t}`, was)
  })
}
await check('help opens and closes', async () => {
  await page.click('.tools [data-tool="help"]', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", false)
  await page.click('.help .help-close', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", true)
})
await check('hovering land names its moku', async () => {
  const pt = await page.evaluate(() => {
    const app = window.__app
    for (let y = 120; y < innerHeight - 120; y += 23) {
      for (let x = 60; x < innerWidth - 60; x += 23) {
        if (document.elementFromPoint(x, y)?.id !== 'scene' || document.elementFromPoint(x - 4, y)?.id !== 'scene') continue
        const p = app.rig.pickGround(x, y)
        if (p && app.world.metresAt(p.x, p.z) > 50 && app.polity.mokuAt(p.x, p.z)) return [x, y]
      }
    }
    return null
  })
  if (!pt) throw new Error('no moku on screen')
  await page.mouse.move(pt[0] - 4, pt[1])
  await page.waitForTimeout(250)
  await page.mouse.move(pt[0], pt[1])
  await page.waitForFunction(() => document.querySelector('.inspector.show b')?.textContent, null, { timeout: 10000 })
})
const evs = await ui('app.data.events.length')
if (evs) {
  await check('a pin opens its card', async () => {
    // the year of an event with stops, so the walk below has something to do
    await page.evaluate(() => {
      const app = window.__app
      const ev = app.data.events.find((e) => e.stops?.length) || app.data.events[0]
      const [a] = app.ui.pins.items.find((it) => it.ev === ev)?.span || [1800]
      app.timeline.setYear(a + 0.01)
    })
    await frames(3)
    await page.waitForFunction(() => [...document.querySelectorAll('.pin.show')].length > 0, null, { timeout: 30000 })
    const [title, x, y] = await page.evaluate(() => {
      const app = window.__app
      const withStops = [...document.querySelectorAll('.pin.show')].find((el) => app.ui.pins.items.find((it) => it.el === el)?.ev.stops?.length)
      const m = withStops || document.querySelector('.pin.show')
      const r = m.getBoundingClientRect()
      return [m.title, r.x + 14, r.y + r.height / 2]
    })
    await page.mouse.click(x, y)
    await page.waitForFunction((t) => document.querySelector('.card.show h1')?.textContent === t, title, { timeout: 15000 })
  })
  await check('Next walks the stops: flies and sets the year', async () => {
    const has = await page.$('.card.show .nav.next')
    if (!has) throw new Error('this event has no stops')
    const y0 = await ui('app.timeline.year')
    const t0 = await ui('app.rig.goal.target.x')
    await page.click('.card.show .nav.next', opts)
    await page.click('.card.show .nav.next', opts)
    await page.waitForSelector('.card.show .stop', opts)
    await frames(4)
    const flying = await ui('!!app.rig.flight || Math.abs(app.rig.goal.target.x - ' + t0 + ') > 1')
    if (!flying) throw new Error('the camera did not move')
    await page.evaluate(() => window.__app.rig.finishFlight())
    const stop = await ui('app.ui.card.ev.stops[app.ui.card.stop]')
    if (Number.isFinite(stop.year)) {
      await page.waitForFunction((y) => Math.abs(window.__app.timeline.year - y) < 1.5, stop.year, { timeout: 30000 })
    }
    void y0
  })
  await check('the card closes', async () => {
    await page.click('.card.show .card-close', opts)
    await expect("document.querySelector('.card').classList.contains('show')", false)
  })
} else console.log('  - no events: pin checks skipped')

const stats = await ui('app.stats()')
console.log('stats', JSON.stringify(stats))
if (errors.length) {
  failed++
  console.log('  ✗ console errors:\n   ', errors.slice(0, 10).join('\n    '))
} else console.log('  ✓ no console errors')
await browser.close()
server.close()
console.log(failed ? `${failed} failed` : 'all passed')
process.exitCode = failed ? 1 : 0
