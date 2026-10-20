// Dev-only: boot the built app (dist/) in headless Chromium and drive it with
// real pointer and key input (the wheel from the whole chain down to a
// valley, drags, the year slider and its ticks, the layer toggles, the far
// view's switch between the chiefdoms and the land, the chapter tour's Next
// and Back and the view it picks, an event's stops, the pins and the clusters
// they gather into, and their cards) to catch anything that stops input
// reaching what's on screen, and any console error on the way; then what the
// page costs in heap and frame time. Run
// `npm run build -w @vibe-dump/holo-i-ke-au` first.
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
const run = (body) => page.evaluate(new Function(`const app = window.__app; ${body}`))
const expect = async (expr, want) => {
  const got = await ui(expr)
  if (got !== want) throw new Error(`${expr} = ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`)
}
const frames = async (n) => {
  const f0 = await ui('app.frames')
  await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 120000 })
}
const opts = { timeout: 20000 }
const cardTitle = () => ui("document.querySelector('.card.show h1')?.textContent ?? null")
/**
 * Land the year's easing and say where it landed. (Under the software
 * renderer a frame can take a second, so an easing of two seconds' worth of
 * frames can take most of a minute; as with finishFlight, skip to its end.)
 */
const yearSettles = () => ui('(app.ui.timeline.finish(), app.timeline.year)')
/** Where the camera is headed. */
const goalXZ = () => ui('[app.rig.goal.target.x, app.rig.goal.target.z, app.rig.goal.distance]')
const moved = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) > 1 || Math.abs(Math.log(a[2] / b[2])) > 0.05

const eras = await ui('app.timeline.n')
const chapters = await ui('app.tour.chapters.length')

if (eras > 0) {
  await check('it opens on the first chapter: its era card, its year', async () => {
    await expect('JSON.stringify([app.tour.active, app.tour.chapter, app.tour.step])', JSON.stringify([true, 0, -1]))
    await expect('app.ui.card.mode', 'era')
    await expect("document.querySelector('.card.show h1')?.textContent === app.timeline.eras[0].label", true)
    await expect('app.timeline.s', 0)
    const pill = await ui("document.querySelector('.tl-tour').textContent")
    if (!/Chapter 1 of \d+/.test(pill)) throw new Error(`the indicator reads “${pill}”`)
    console.log(`      ${pill.replace(/\s+/g, ' ')}`)
  })
}

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
  const over = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.id, [x, y])
  if (over !== 'scene') throw new Error(`the island's middle is under #${over}, not the scene: the opening view frames it under the interface`)
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
if (eras > 1) {
  await check('a tick on the timeline moves the year', async () => {
    await page.click('.tl-tick[data-i="0"] span', opts)
    await page.waitForFunction(() => window.__app.timeline.s < 0.01, null, { timeout: 15000 })
    await expect("document.querySelector('.tl-era').textContent === window.__app.timeline.eras[0].label", true)
  })
  await check('dragging the slider moves the year and leaves the tour', async () => {
    const box = await page.locator('.tl-input').boundingBox()
    await page.mouse.move(box.x + 12, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width - 12, box.y + box.height / 2, { steps: 8 })
    await page.mouse.up()
    const s = await ui('app.timeline.s')
    if (!(s > eras - 1.3)) throw new Error(`s = ${s}`)
    await expect('app.tour.active', false)
    const pill = await ui("document.querySelector('.tl-tour').textContent")
    if (!new RegExp(`resumes at chapter ${Math.round(s) + 1} of`).test(pill)) throw new Error(`the indicator reads “${pill}”`)
  })
} else console.log('  - one era or none: timeline checks skipped')

if (chapters > 1) {
  await check('Next picks the tour up at the nearest chapter', async () => {
    const near = await ui('Math.round(app.timeline.s)')
    await page.click('.tl-next', opts)
    await expect('JSON.stringify([app.tour.active, app.tour.chapter, app.tour.step])', JSON.stringify([true, near, -1]))
    await expect(`document.querySelector('.card.show h1')?.textContent === app.timeline.eras[${near}].label`, true)
    await yearSettles()
    await expect(`Math.abs(app.timeline.s - ${near}) < 0.001`, true)
  })
  await check('Back from a chapter card goes to the last step before it', async () => {
    const c = await ui('app.tour.chapter')
    await page.keyboard.press('ArrowLeft')
    const [pc, ps, title] = await ui(`[app.tour.chapter, app.tour.step, app.tour.event?.title ?? app.timeline.eras[${c - 1}].label]`)
    if (pc !== c - 1) throw new Error(`chapter ${pc}, wanted ${c - 1}`)
    const got = await cardTitle()
    if (got !== title) throw new Error(`the card reads “${got}”, wanted “${title}” (step ${ps})`)
  })
  await check(', and . step chapter by chapter', async () => {
    const c = await ui('app.tour.chapter')
    const inside = await ui('app.tour.step >= 0')
    await page.keyboard.press(',') // inside a chapter: its own card first
    await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([inside ? c : c - 1, -1]))
    await page.keyboard.press(',')
    await page.keyboard.press('.')
    await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([inside ? c : c - 1, -1]))
    await expect('app.ui.card.mode', 'era')
  })

  // the busiest chapter with no stops in it (and not the last), to step through
  const pick = await ui(`(() => {
    let best = -1
    app.tour.chapters.forEach((ch, i) => {
      if (i < app.tour.chapters.length - 1 && ch.events.length >= 3 && ch.events.every((e) => !e.stops?.length) && (best < 0 || ch.events.length > app.tour.chapters[best].events.length)) best = i
    })
    return best
  })()`)
  if (pick >= 0) {
    await check(`Next walks chapter ${pick + 1}: the year moves, the camera flies, the card and pin follow`, async () => {
      await run(`app.tour.goTo(${pick}, -1); app.settle()`)
      await page.focus('#scene')
      const n = await ui(`app.tour.chapters[${pick}].events.length`)
      for (let s = 0; s < n; s++) {
        const before = await goalXZ()
        if (s % 2) await page.keyboard.press('Space')
        else await page.keyboard.press('ArrowRight')
        const [step, title, id, flying, want] = await ui(
          `[app.tour.step, app.tour.event.title, app.tour.event.id, !!app.rig.flight, app.tour.stepYear(app.tour.event, app.tour.current)]`,
        )
        if (step !== s) throw new Error(`step ${step}, wanted ${s}`)
        const got = await cardTitle()
        if (got !== title) throw new Error(`step ${s}: the card reads “${got}”, wanted “${title}”`)
        const dur = await ui('app.rig.flight?.duration ?? 0')
        if (dur > 3.5) throw new Error(`step ${s}: a ${dur.toFixed(1)} s flight`)
        await page.evaluate(() => window.__app.rig.finishFlight())
        const after = await goalXZ()
        if (!flying && !moved(before, after)) throw new Error(`step ${s} (${id}): the camera stayed put`)
        const y = await yearSettles()
        if (Math.abs(y - want) > 0.05) throw new Error(`step ${s} (${id}): year ${y.toFixed(2)}, wanted ${want.toFixed(2)}`)
        await frames(2)
        // its pin lit, standing alone with its label, never in a cluster
        const [lit, grouped] = await ui(
          `[app.ui.pins.items.find((it) => it.ev.id === '${id}')?.el.matches('.show.active') ?? false, app.ui.pins.groups().some((g) => g.ids.includes('${id}'))]`,
        )
        if (grouped) throw new Error(`step ${s} (${id}): its pin is in a cluster`)
        if (!lit) {
          // fine only if its point is off the screen (a far step can frame a place by its edge)
          const where = await ui(`(() => {
            const it = app.ui.pins.items.find((it) => it.ev.id === '${id}')
            if (!it) return 'no pin'
            const v = it.pos.clone().project(app.camera)
            const x = ((v.x + 1) / 2) * innerWidth, y = ((1 - v.y) / 2) * innerHeight
            return x > 0 && x < innerWidth && y > 84 && y < innerHeight ? 'on screen at ' + x.toFixed(0) + ',' + y.toFixed(0) : 'off screen'
          })()`)
          if (where.startsWith('on screen')) throw new Error(`step ${s} (${id}): its pin is not lit, though ${where}`)
          console.log(`      (step ${s}: ${id} has ${where === 'no pin' ? 'no pin' : 'its pin off the screen'})`)
        }
        console.log(`      ${s + 1}/${n} ${title} · ${y.toFixed(1)} · d ${after[2].toFixed(0)}`)
      }
      await page.keyboard.press('ArrowRight')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([pick + 1, -1]))
      await expect(`document.querySelector('.card.show h1')?.textContent === app.tour.chapters[${pick + 1}].era.label`, true)
    })
    await check('Back reverses, step by step, into the chapter before', async () => {
      const n = await ui(`app.tour.chapters[${pick}].events.length`)
      await page.keyboard.press('ArrowLeft')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([pick, n - 1]))
      await expect('document.querySelector(".card.show h1")?.textContent === app.tour.event.title', true)
      await page.click('.card.show .nav.prev', opts)
      await expect('JSON.stringify([app.tour.chapter, app.tour.step])', JSON.stringify([pick, n - 2]))
      await expect('document.querySelector(".card.show h1")?.textContent === app.tour.event.title', true)
      const want = await ui('app.tour.stepYear(app.tour.event, app.tour.current)')
      const y = await yearSettles()
      if (Math.abs(y - want) > 0.05) throw new Error(`year ${y.toFixed(2)}, wanted ${want.toFixed(2)}`)
    })
  } else console.log('  - no chapter with three plain events: the step walk is skipped')

  const walk = await ui('(() => { for (const ch of app.tour.chapters) { const s = ch.events.findIndex((e) => e.stops?.length > 1); if (s >= 0) return [ch.index, s] } return null })()')
  if (walk) {
    const [wc, ws] = walk
    await check('inside the tour, Next walks an event’s stops and then moves on', async () => {
      await run(`app.tour.goTo(${wc}, ${ws}); app.settle()`)
      await page.focus('#scene')
      const [id, n, last] = await ui(`[app.tour.event.id, app.tour.event.stops.length, app.tour.chapters[${wc}].events.length - 1]`)
      const label = await ui("document.querySelector('.card.show .nav.next')?.textContent.trim()")
      if (!/stops/.test(label)) throw new Error(`Next on the card reads “${label}”`)
      for (let i = 0; i < n; i++) {
        const before = await goalXZ()
        await page.keyboard.press('ArrowRight')
        const st = await ui('app.tour.state')
        if (st.event !== id || st.stop !== i) throw new Error(`after ${i + 1} Next: ${JSON.stringify(st)}`)
        const box = await ui("document.querySelector('.card.show .stop-n')?.textContent")
        if (!box?.startsWith(`${i + 1} / ${n}`)) throw new Error(`stop box reads “${box}”`)
        const stop = await ui(`app.tour.event.stops[${i}]`)
        await page.evaluate(() => window.__app.rig.finishFlight())
        const after = await goalXZ()
        if (i > 0 && !moved(before, after)) {
          // (two stops whose places share a point and a zoom share a view)
          const same = await ui(`(() => {
            const [a, b] = [app.tour.event.stops[${i}], app.tour.event.stops[${i - 1}]]
            const pa = app.tour.places.get(a.place)?.geometry.coordinates, pb = app.tour.places.get(b.place)?.geometry.coordinates
            return a.zoom === b.zoom && JSON.stringify(pa) === JSON.stringify(pb)
          })()`)
          if (!same) throw new Error(`stop ${i + 1}: the camera stayed put`)
          console.log(`      (stops ${i} and ${i + 1} share a point: one view)`)
        }
        if (Number.isFinite(stop.year)) {
          const y = await yearSettles()
          if (Math.abs(y - stop.year) > 0.05) throw new Error(`stop ${i + 1}: year ${y}, wanted ${stop.year}`)
        }
      }
      console.log(`      ${n} stops of ${id}`)
      await page.keyboard.press('ArrowRight')
      const st = await ui('app.tour.state')
      const want = ws < last ? [wc, ws + 1] : [wc + 1, -1]
      if (st.chapter !== want[0] || st.step !== want[1] || st.stop !== -1) throw new Error(`after the last stop: ${JSON.stringify(st)}`)
    })
    await check('Back walks the stops in reverse, to the event’s own card', async () => {
      const n = await ui(`app.tour.chapters[${wc}].events[${ws}].stops.length`)
      await page.keyboard.press('ArrowLeft')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step, app.tour.stop])', JSON.stringify([wc, ws, n - 1]))
      await expect(`document.querySelector('.card.show .stop-n')?.textContent.startsWith('${n} / ${n}')`, true)
      for (let i = n - 2; i >= -1; i--) await page.keyboard.press('ArrowLeft')
      await expect('JSON.stringify([app.tour.chapter, app.tour.step, app.tour.stop])', JSON.stringify([wc, ws, -1]))
      await expect("!!document.querySelector('.card.show .stop')", false)
    })
  } else console.log('  - no event with stops: the stop walk is skipped')

  // (before anything presses the switch: once the viewer has, the tour leaves the view alone)
  const kinds = await ui(`(() => {
    const evs = app.tour.chapters.flatMap((ch) => ch.events)
    const land = evs.find((e) => ['law', 'epidemic', 'restoration'].includes(e.kind) && !e.view)
    const other = evs.find((e) => e.kind === 'battle' && !e.view)
    return land && other ? [land.id, other.id] : null
  })()`)
  if (kinds) {
    await check('the tour picks the far view by kind, until the viewer picks one', async () => {
      const go = (id) => run(`const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1]); app.settle()`)
      await expect('app.viewChosen', false)
      await go(kinds[0])
      await expect('app.view', 'land')
      await go(kinds[1])
      await expect('app.view', 'chiefdoms')
      await run(`const at = app.tour.locate(app.data.events.find((e) => e.id === '${kinds[0]}')); app.tour.goTo(at[0], -1); app.settle()`)
      await expect('app.view', 'chiefdoms')
      console.log(`      ${kinds[0]} → land, ${kinds[1]} → chiefdoms, an era's card → chiefdoms`)
    })
  }

  // two events on near views of different islands, one after the other
  const hop = await ui(`(() => {
    const T = app.tour
    for (const ch of T.chapters) for (let s = 0; s + 1 < ch.events.length; s++) {
      const a = ch.events[s], b = ch.events[s + 1]
      if (a.stops?.length || b.stops?.length) continue
      const pa = T.placeOf(a), pb = T.placeOf(b)
      if (pa && pb && pa.island && pb.island && pa.island !== pb.island && a.zoom?.includes('near') && b.zoom?.includes('near')) return [ch.index, s]
    }
    return null
  })()`)
  if (hop) {
    await check('a flight between islands rises before it descends, and is short', async () => {
      await run(`app.tour.goTo(${hop[0]}, ${hop[1]}); app.settle()`)
      const d0 = await ui('app.rig.state.distance')
      // watch the flight from inside the page, frame by frame
      const watch = page.evaluate(
        () =>
          new Promise((resolve) => {
            const app = window.__app
            let top = 0
            const t0 = performance.now()
            const tick = () => {
              top = Math.max(top, app.rig.state.distance)
              if (app.rig.flight || performance.now() - t0 < 300) requestAnimationFrame(tick)
              else resolve(top)
            }
            requestAnimationFrame(tick)
          }),
      )
      await page.keyboard.press('ArrowRight')
      const dur = await ui('app.rig.flight?.duration ?? 0')
      const top = await watch
      const d1 = await ui('app.rig.state.distance')
      if (!(top > 4 * Math.max(d0, d1))) throw new Error(`distance ${d0.toFixed(0)} → peak ${top.toFixed(0)} → ${d1.toFixed(0)}`)
      if (!(dur > 0 && dur <= 3.5)) throw new Error(`a ${dur} s flight`)
      console.log(`      distance ${d0.toFixed(0)} → peak ${top.toFixed(0)} → ${d1.toFixed(0)} in ${dur.toFixed(1)} s`)
    })
  }
} else console.log('  - fewer than two chapters: tour checks skipped')

for (const t of ['lines', 'routes', 'pins']) {
  await check(`toggle ${t}`, async () => {
    const was = await ui(`app.overlay.${t}`)
    await page.click(`.tools [data-tool="${t}"]`, opts)
    await expect(`app.overlay.${t}`, !was)
    await page.click(`.tools [data-tool="${t}"]`, opts)
    await expect(`app.overlay.${t}`, was)
  })
}

const routeCount = await ui('app.routes.lines.length')
/** Fly the camera to a view (an expression for one) and land everything. */
const view = (expr) => run(`const v = ${expr}; app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()`)
const shownRoutes = () => ui('app.routes.visibleRoutes().map((r) => r.id)')
if (routeCount) {
  await check('the routes toggle hides and shows the routes', async () => {
    await run('app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(1779.1); app.ui.timeline.finish()')
    await view('app.tour.chainView()')
    await frames(2)
    const on = await shownRoutes()
    if (!on.length) throw new Error('no routes over the chain in 1779')
    await page.click('.tools [data-tool="routes"]', opts)
    await run('app.settle()')
    await frames(2)
    const off = await shownRoutes()
    if (off.length) throw new Error(`still showing with the toggle off: ${off.join(', ')}`)
    await page.click('.tools [data-tool="routes"]', opts)
    await run('app.settle()')
    await frames(2)
    if (!(await shownRoutes()).length) throw new Error('not back with the toggle on')
    console.log(`      1779 over the chain: ${on.join(', ')}`)
  })
  await check('routes are gone once one island fills the screen, all but the tour’s own', async () => {
    await view("app.tour.islandView('hawaii', 0)")
    await frames(2)
    const [d, fill] = await ui('[app.rig.state.distance, app.islandFill()]')
    const left = await shownRoutes()
    if (left.length) throw new Error(`over Hawaiʻi Island at ${d.toFixed(0)} (fill ${fill.toFixed(2)}): ${left.join(', ')}`)
    console.log(`      Hawaiʻi Island fills ${(fill * 100).toFixed(0)}% at ${d.toFixed(0)}: no routes`)
    const step = await ui("(() => { const ev = app.data.events.find((e) => e.id === 'mokuohai-1782'); return ev ? app.tour.locate(ev) : null })()")
    if (step) {
      await run(`app.tour.goTo(${step[0]}, ${step[1]}); app.settle()`)
      await frames(2)
      const [d2, fill2] = await ui('[app.rig.state.distance, app.islandFill()]')
      const at = await shownRoutes()
      if (at.length) throw new Error(`at the Mokuʻōhai step (${d2.toFixed(0)}, fill ${fill2.toFixed(2)}): ${at.join(', ')}`)
      console.log(`      the Mokuʻōhai step at ${d2.toFixed(0)} (fill ${fill2.toFixed(2)}): no routes`)
    }
    // an event's own route stays on its island view
    const own = await ui(`(() => {
      for (const ch of app.tour.chapters) for (let s = 0; s < ch.events.length; s++) {
        const ev = ch.events[s]
        if (ev.routes?.length && !ev.stops?.length && !ev.zoom?.includes('near') && ev.zoom?.includes('island')) return [ch.index, s, ev.id]
      }
      return null
    })()`)
    if (own) {
      await run(`app.tour.goTo(${own[0]}, ${own[1]}); app.settle()`)
      await frames(2)
      const [d3, fill3] = await ui('[app.rig.state.distance, app.islandFill()]')
      const r = await ui(`app.routes.visibleRoutes().filter((r) => r.event === '${own[2]}').map((r) => r.id)`)
      if (!r.length && fill3 > 0.4) throw new Error(`${own[2]}'s own route is gone from its step (${d3.toFixed(0)}, fill ${fill3.toFixed(2)})`)
      console.log(`      ${own[2]} at ${d3.toFixed(0)} (fill ${fill3.toFixed(2)}) keeps ${r.join(', ') || 'none'}`)
    }
  })
} else console.log('  - no routes: route checks skipped')

await page.waitForFunction(() => window.__app.land.available !== null, null, { timeout: 120000 })
if (await ui('app.land.available')) {
  const landReady = () => page.waitForFunction(() => window.__app.land.ready, null, { timeout: 300000 })
  await check('the switch turns the far view to the land, and the legend with it', async () => {
    await run('app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(1778); app.ui.timeline.finish()')
    await view('app.tour.chainView()')
    await frames(2)
    await expect('!!document.querySelector(".legend.show")', true)
    await expect('document.querySelector(\'.legend [data-view="chiefdoms"]\').getAttribute("aria-pressed")', 'true')
    await page.click('.legend [data-view="land"]', opts)
    await expect('app.view', 'land')
    await expect('app.viewChosen', true)
    await expect('document.querySelector(\'.legend [data-view="land"]\').getAttribute("aria-pressed")', 'true')
    const text = await ui("document.querySelector('.legend .lg-body').textContent")
    for (const w of ['Cultivation', 'Settlement', 'Native forest']) if (!text.includes(w)) throw new Error(`the legend reads “${text}”`)
    // pressing the one that is on turns the overlay off; the other way back on
    await page.click('.legend [data-view="land"]', opts)
    await expect('app.view', null)
    await page.click('.legend [data-view="chiefdoms"]', opts)
    await expect('app.view', 'chiefdoms')
    await expect("document.querySelector('.legend .lg-body').textContent.includes('Cultivation')", false)
    await page.click('.legend [data-view="land"]', opts)
    await expect('app.view', 'land')
    console.log(`      ${text.replace(/\s+/g, ' ').trim()}`)
  })
  await check('the tour leaves the viewer’s choice alone', async () => {
    const battle = await ui("app.tour.chapters.flatMap((ch) => ch.events).find((e) => e.kind === 'battle')?.id ?? null")
    if (!battle) return
    await run(`const at = app.tour.locate(app.data.events.find((e) => e.id === '${battle}')); app.tour.goTo(at[0], at[1]); app.settle()`)
    await expect('app.view', 'land')
    await run('app.ui.card.close(); app.ui.onScrub()')
  })
  await check('the land shows at the chain and island zooms, not over a valley', async () => {
    await run('app.timeline.setYear(1778); app.ui.timeline.finish()')
    await landReady()
    const k = {}
    for (const [name, v] of [['chain', 'app.tour.chainView()'], ['oahu', "app.tour.islandView('oahu', 0)"], ['lanai', "app.tour.islandView('lanai', 0)"]]) {
      await view(v)
      await frames(2)
      k[name] = await ui('[Math.round(app.rig.state.distance), +app.shared.uniforms.uLandK.value.toFixed(3)]')
    }
    await run("const p = app.tour.places.get('nuuanu') || app.tour.placeOf(app.data.events[0]); const v = app.tour.pointView(p, 60); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()")
    await frames(2)
    k.valley = await ui('[Math.round(app.rig.state.distance), +app.shared.uniforms.uLandK.value.toFixed(3)]')
    if (!(k.chain[1] > 0.9 && k.oahu[1] > 0.9 && k.lanai[1] > 0.5)) throw new Error(`strength ${JSON.stringify(k)}`)
    if (k.valley[1] !== 0) throw new Error(`strength over a valley ${JSON.stringify(k.valley)}`)
    await expect('app.shared.uniforms.uPolityK.value', 0)
    console.log(`      [distance, strength] ${JSON.stringify(k)}`)
  })
  await check('the layers move with the year, between the keyframes either side', async () => {
    await view("app.tour.islandView('oahu', 0)")
    const at = async (y) => {
      await run(`app.timeline.setYear(${y}); app.ui.timeline.finish()`)
      await frames(1)
      await landReady()
      await run('app.settle()')
      await frames(1)
      return ui('[app.land.bound.a, app.land.bound.b, +app.shared.uniforms.uLandT.value.toFixed(3), document.querySelector(".legend .lg-note")?.textContent, [...document.querySelectorAll(".legend .lg-land em")].map((e) => e.textContent).join(",")]')
    }
    const rows = {}
    // (the eras' own years: kalaniopuu stands at contact, kamehameha at 0.387 of
    // the way to the Māhele, and so on, as the manifest maps them; 1816 falls
    // between two eras, by year)
    for (const y of [1772, 1807, 1816, 1844, 1864, 1895, 2000]) rows[y] = await at(y)
    const near = (a, b) => Math.abs(a - b) < 0.02
    const ok =
      rows[1772][2] === 0 &&
      near(rows[1816][2], (1816 - 1778) / 75) &&
      rows[1807][0] === 'contact' && rows[1807][1] === 'mahele' && near(rows[1807][2], 0.387) &&
      rows[1844][0] === 'contact' && near(rows[1844][2], 0.88) &&
      rows[1864][0] === 'mahele' && rows[1864][1] === 'kingdom' && near(rows[1864][2], 0.256) &&
      rows[1895][1] === 'kingdom' && near(rows[1895][2], 0.977)
    for (const [y, r] of Object.entries(rows)) console.log(`      ${y}: ${r[0]}/${r[1]} t ${r[2]} · ${r[3]} · ${r[4] || 'all mapped'}`)
    if (!ok) throw new Error('the keyframes or the weights are not the manifest’s')
    if (!/modelled/.test(rows[1772][4])) throw new Error('1778 is not marked modelled in the legend')
    if (rows[2000][4]) throw new Error(`the coda, mapped throughout, is marked “${rows[2000][4]}”`)
  })
  await check('hovering land in the land view names what the layers hold', async () => {
    await run('app.timeline.setYear(1778); app.ui.timeline.finish()')
    await view("app.tour.islandView('oahu', 0)")
    await landReady()
    await frames(2)
    const pt = await page.evaluate(() => {
      const app = window.__app
      for (let y = 160; y < innerHeight - 160; y += 19) {
        for (let x = 80; x < innerWidth - 80; x += 19) {
          if (document.elementFromPoint(x, y)?.id !== 'scene') continue
          const p = app.rig.pickGround(x, y)
          const v = p && app.world.metresAt(p.x, p.z) > 5 ? app.land.valuesAt(p.x, p.z) : null
          if (v && v.cultivation > 0.2 && app.polity.mokuAt(p.x, p.z)) return [x, y]
        }
      }
      return null
    })
    if (!pt) throw new Error('no cultivated land on screen')
    await page.mouse.move(pt[0] - 4, pt[1])
    await page.waitForTimeout(250)
    await page.mouse.move(pt[0], pt[1])
    await page.waitForFunction(() => /fields/.test(document.querySelector('.inspector.show')?.textContent || ''), null, { timeout: 10000 })
    console.log(`      ${(await ui("document.querySelector('.inspector').textContent")).replace(/\s+/g, ' ').trim()}`)
    await page.mouse.move(5, 400)
  })
  await run("app.setView('chiefdoms')")
} else console.log('  - no land layers: land checks skipped')
await check('help opens and closes', async () => {
  await page.click('.tools [data-tool="help"]', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", false)
  await page.click('.help .help-close', opts)
  await expect("document.querySelector('.help').classList.contains('hidden')", true)
})
await check('hovering land names its moku', async () => {
  await run('app.ui.card.close()')
  await page.click('.tools [data-tool="home"]', opts)
  await page.evaluate(() => window.__app.settle())
  await frames(2)
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
  await check('a pin opens its card, and the tour moves to it', async () => {
    await run('app.ui.card.close(); app.ui.onScrub()')
    const ev = await ui("(app.data.events.find((e) => e.stops?.length) || app.data.events[0]).id")
    await run(`const it = app.ui.pins.items.find((it) => it.ev.id === '${ev}'); app.timeline.setYear(it.start + 0.01); const p = app.tour.pointView(it.place, 900); app.rig.jump({ x: p.target.x, z: p.target.z, distance: p.distance, yaw: p.yaw, pitch: p.pitch })`)
    await frames(3)
    const sel = `.pin.show[title="${await ui(`app.data.events.find((e) => e.id === '${ev}').title`)}"]`
    await page.waitForSelector(sel, opts)
    const [title, x, y] = await page.evaluate((sel) => {
      const m = document.querySelector(sel)
      const r = m.getBoundingClientRect()
      return [m.title, r.x + 14, r.y + r.height / 2]
    }, sel)
    await page.mouse.click(x, y)
    await page.waitForFunction((t) => document.querySelector('.card.show h1')?.textContent === t, title, { timeout: 15000 })
    await expect(`app.tour.event?.id === '${ev}' && app.tour.active`, true)
  })
  await check('the card closes', async () => {
    await page.click('.card.show .card-close', opts)
    await expect("document.querySelector('.card').classList.contains('show')", false)
  })

  // clusters: the palace if the data has it, else the busiest spot that has two events at once
  const spot = await ui(`(() => {
    const items = app.ui.pins.items
    const key = (it) => it.x.toFixed(2) + ',' + it.z.toFixed(2)
    const pal = items.find((it) => it.ev.id === 'overthrow-1893')
    const seed = pal || items.find((it) => items.some((o) => o !== it && key(o) === key(it) && o.span[1] >= it.start && o.span[0] <= it.start + 0.01))
    if (!seed) return null
    const same = items.filter((o) => key(o) === key(seed)).map((o) => o.ev.id)
    return { id: seed.ev.id, year: seed.start + 0.01, same }
  })()`)
  if (spot) {
    const sel = `.cluster.show[data-events~="${spot.id}"]`
    await check(`pins cluster over the whole chain (${spot.id})`, async () => {
      await run(`app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(${spot.year})`)
      await page.click('.tools [data-tool="home"]', opts)
      await page.evaluate(() => window.__app.settle())
      await frames(3)
      await page.waitForSelector(sel, opts)
      const g = await ui(`app.ui.pins.groups().find((g) => g.ids.includes('${spot.id}'))`)
      const shown = await ui(`app.ui.pins.items.filter((it) => it.el.classList.contains('show') && it.ev.id === '${spot.id}').length`)
      if (!g || g.count < 2) throw new Error(`no cluster: ${JSON.stringify(g)}`)
      if (shown) throw new Error('its own pin shows as well as the cluster')
      const n = await ui(`document.querySelector('${sel}').textContent`)
      if (Number(n) !== g.count) throw new Error(`the marker reads ${n}, the cluster holds ${g.count}`)
      console.log(`      ${g.count}: ${g.ids.join(', ')}`)
    })
    await check('hovering a cluster lists its events and years', async () => {
      await page.hover(sel, opts)
      await page.waitForSelector('.cl-tip.show', opts)
      const [rows, title] = await page.evaluate(
        (id) => [document.querySelectorAll('.cl-tip.show .tip-row').length, window.__app.data.events.find((e) => e.id === id).title],
        spot.id,
      )
      const text = await ui("document.querySelector('.cl-tip').textContent")
      const g = await ui(`app.ui.pins.groups().find((g) => g.ids.includes('${spot.id}'))`)
      if (rows !== g.count || !text.includes(title)) throw new Error(`${rows} rows for ${g.count}: “${text}”`)
    })
    await check('clicking a cluster opens its list, earliest first', async () => {
      await page.click(sel, opts)
      await page.waitForSelector('.card.show[data-mode="cluster"] .ev-row', opts)
      const ids = await ui("[...document.querySelectorAll('.card.show .ev-row')].map((b) => b.dataset.ev)")
      const starts = await ui(`${JSON.stringify(ids)}.map((id) => app.ui.pins.items.find((it) => it.ev.id === id).start)`)
      if (!starts.every((s, i) => !i || s >= starts[i - 1])) throw new Error(`out of order: ${ids.join(', ')}`)
      if (!ids.includes(spot.id)) throw new Error(`${spot.id} missing from ${ids.join(', ')}`)
      await expect("document.querySelector('.cl-tip').classList.contains('show')", false)
    })
    await check('choosing from the list opens that event and lights its pin', async () => {
      await page.click(`.card.show .ev-row[data-ev="${spot.id}"]`, opts)
      const title = await ui(`app.data.events.find((e) => e.id === '${spot.id}').title`)
      await page.waitForFunction((t) => document.querySelector('.card.show h1')?.textContent === t, title, opts)
      await frames(3)
      await expect(`app.ui.pins.items.find((it) => it.ev.id === '${spot.id}').el.matches('.show.active')`, true)
      await expect(`app.ui.pins.groups().some((g) => g.ids.includes('${spot.id}'))`, false)
      await expect(`app.tour.event?.id`, spot.id)
    })
    await check('closer in the cluster comes apart; one spot stays together', async () => {
      // the open event stands alone; the others at its very point stay listed as one
      await run(`const it = app.ui.pins.items.find((it) => it.ev.id === '${spot.id}'); app.rig.jump({ x: it.x, z: it.z, distance: 40, yaw: 0 }); app.settle()`)
      await frames(4)
      const groups = await ui('app.ui.pins.groups()')
      const visibleSame = await ui(`${JSON.stringify(spot.same)}.filter((id) => id !== '${spot.id}' && (() => { const it = app.ui.pins.items.find((x) => x.ev.id === id); const [a, b] = app.timeline.window; return it.span[1] >= a && it.span[0] <= b })())`)
      const here = groups.find((g) => visibleSame.some((id) => g.ids.includes(id)))
      if (visibleSame.length >= 2 && (!here || !visibleSame.every((id) => here.ids.includes(id)))) throw new Error(`same spot split: ${JSON.stringify(groups)}`)
      if (groups.some((g) => g.ids.includes(spot.id))) throw new Error('the open event is in a cluster')
      // nothing that isn't at the very spot rides along at this zoom unless it is near on screen too
      const far = await ui(`app.ui.pins.groups().flatMap((g) => g.ids).filter((id) => { const a = app.ui.pins.items.find((x) => x.ev.id === id); const b = app.ui.pins.items.find((x) => x.ev.id === '${spot.id}'); return Math.hypot(a.x - b.x, a.z - b.z) > 20 })`)
      if (far.length) throw new Error(`still gathered from afar: ${far.join(', ')}`)
      console.log(`      at 4 km: ${groups.map((g) => g.ids.join('+')).join(' | ') || 'no clusters'}; ${spot.id} alone`)
    })
  } else console.log('  - no two events at one spot: cluster checks skipped')
} else console.log('  - no events: pin checks skipped')

// The district close-up (DATA.md "District packs"): Nuʻuanu streams in under
// Oʻahu as the camera comes down, takes over with no seam at its edge, lays
// the year on its ground (the patch, the loʻi, the ponds, the village), walks
// its battles' forces stop by stop, lands each stop's camera where the stop
// asks, and is let go once the camera has left.
const districtCount = await ui('app.districts?.list.length ?? 0')
if (districtCount) {
  const offTour = (year) => run(`app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(${year}); app.ui.timeline.finish()`)
  const districtReady = () => page.waitForFunction(() => window.__app.districts.cur?.state === 'ready', null, { timeout: 300000 })
  const nearView = "app.tour.cameraView(app.tour.places.get('puiwa'), { bearing: 42, pitch: 0.38, distance: 16 })"
  const settleTwice = () => run('app.settle(); app.settle()')
  await check('the district streams in and takes over near Nuʻuanu', async () => {
    await offTour(1795)
    await view(nearView)
    await districtReady()
    await settleTwice()
    await frames(2)
    const st = await ui('app.districts.stats()')
    if (!(st.on && st.k > 0.99)) throw new Error(`district ${JSON.stringify(st)}`)
    await expect('app.world.exag.toFixed(2)', '1.30')
    // where it is whole, the ground is its own
    const [own, ground] = await ui("(() => { const t = app.rig.state.target; return [app.districts.metresAt(t.x, t.z), app.world.metresAt(t.x, t.z)] })()")
    if (Math.abs(own - ground) > 0.01) throw new Error(`the ground at the target is ${ground}, the district's ${own}`)
    console.log(`      decoded in ${st.workerMs} ms in its worker, ready ${st.readyMs} ms after it was asked for; ${st.gpuMB} MB on the GPU, ${st.cpuMB} MB here; ${st.nodes} nodes`)
  })
  await check('its edge is the island’s ground: no seam', async () => {
    // along every side, at its very edge and a texel in, the ground with the district is the island's
    const worst = await ui(`(() => {
      const D = app.districts, r = D.cur.d.rect, W = app.world
      let worst = 0
      for (let k = 0; k <= 40; k++) {
        const f = k / 40
        for (const [x, z] of [[r.x0 + 0.05, r.z0 + f * (r.z1 - r.z0)], [r.x1 - 0.05, r.z0 + f * (r.z1 - r.z0)], [r.x0 + f * (r.x1 - r.x0), r.z0 + 0.05], [r.x0 + f * (r.x1 - r.x0), r.z1 - 0.05]]) {
          const withD = W.metresAt(x, z)
          D.on = false
          const island = W.metresAt(x, z)
          D.on = true
          worst = Math.max(worst, Math.abs(withD - island))
        }
      }
      return worst
    })()`)
    if (worst > 0.05) throw new Error(`the ground at the edge differs from the island's by ${worst.toFixed(2)} m`)
    console.log(`      at the edge the ground is the island's to ${worst.toFixed(3)} m`)
  })
  await check('the patch sinks the harbour front in 1795, and not in 2020', async () => {
    // a texel the fill made (the patch whole there) and land today
    const pt = await ui(`(() => {
      const rec = app.districts.cur, d = rec.d, r = d.rect
      for (let c = 0; c < d.W * d.H; c += 97) if (rec.aux[c * 4] === 127 && rec.metres[c] > 1.5) { const i = c % d.W, j = (c - i) / d.W; return [r.x0 + (i + 0.5) * (r.x1 - r.x0) / d.W, r.z0 + (j + 0.5) * (r.z1 - r.z0) / d.H, rec.metres[c]] }
      return null
    })()`)
    if (!pt) throw new Error('no patched texel')
    const at = async (y) => {
      await offTour(y)
      await run(`app.rig.jump({ x: ${pt[0]}, z: ${pt[1]}, distance: 25, yaw: 0, pitch: 0.9 }); app.settle(); app.settle()`)
      await frames(1)
      return ui(`[app.world.metresAt(${pt[0]}, ${pt[1]}), app.districts.patchK]`)
    }
    const [m1795, k1795] = await at(1795)
    const [m2020, k2020] = await at(2020)
    if (!(m1795 < -0.5 && k1795 === 1)) throw new Error(`1795: ${m1795.toFixed(2)} m (patch ${k1795})`)
    if (!(m2020 > 1 && k2020 === 0)) throw new Error(`2020: ${m2020.toFixed(2)} m (patch ${k2020})`)
    console.log(`      at ${pt.map((v) => v.toFixed(2)).join(', ')} (today ${pt[2].toFixed(1)} m): ${m1795.toFixed(2)} m in 1795, ${m2020.toFixed(2)} m in 2020`)
  })
  await check('a channel dug since (the Ala Wai) is land in 1795, and water in 2020', async () => {
    // the patch byte from 128 up: a texel of today's water filled back in
    const pt = await ui(`(() => {
      const rec = app.districts.cur, d = rec.d, r = d.rect
      let n = 0
      const deep = []
      for (let c = 0; c < d.W * d.H; c++) if (rec.aux[c * 4] === 255) { n++; if (rec.metres[c] < -0.5) deep.push(c) }
      if (!deep.length) return null
      const c = deep[deep.length >> 1], i = c % d.W, j = (c - i) / d.W
      return [r.x0 + (i + 0.5) * (r.x1 - r.x0) / d.W, r.z0 + (j + 0.5) * (r.z1 - r.z0) / d.H, rec.metres[c], n]
    })()`)
    if (!pt) throw new Error('no filled channel')
    const at = async (y) => {
      await offTour(y)
      await run(`app.rig.jump({ x: ${pt[0]}, z: ${pt[1]}, distance: 25, yaw: 0, pitch: 0.9 }); app.settle(); app.settle()`)
      await frames(1)
      return ui(`app.world.metresAt(${pt[0]}, ${pt[1]})`)
    }
    const m1795 = await at(1795)
    const m2020 = await at(2020)
    if (!(m1795 > 0.2)) throw new Error(`1795: ${m1795.toFixed(2)} m`)
    if (!(m2020 < 0)) throw new Error(`2020: ${m2020.toFixed(2)} m`)
    console.log(`      ${pt[3]} texels filled; at ${pt[0].toFixed(2)}, ${pt[1].toFixed(2)} (today ${pt[2].toFixed(1)} m): ${m1795.toFixed(2)} m in 1795, ${m2020.toFixed(2)} m in 2020`)
  })
  await check('the loʻi, the fishponds and the village stand in 1795, and are gone in 2020', async () => {
    const kinds = async (y) => {
      await offTour(y)
      await view(nearView)
      await settleTwice()
      return ui(`(() => {
        const D = app.districts, out = { loi: [], pond: [], village: [] }
        for (const [i, f] of D.cur.d.byIndex) {
          const k = f.properties.kind
          ;(k === 'loi' ? out.loi : k === 'fishpond' ? out.pond : out.village).push(+D.featK[i].toFixed(2))
        }
        // a terrace's ground, cut or filled: a loʻi texel whose level is not its height today
        const rec = D.cur, d = rec.d, r = d.rect
        let carved = 0
        for (let c = 0; c < d.W * d.H; c += 13) if (rec.aux[c * 4 + 3] === 1 && rec.aux[c * 4 + 1] > 200) { const i = c % d.W, j = (c - i) / d.W; if (Math.abs(D.texel(i, j) - rec.metres[c]) > 0.05) carved++ }
        out.carved = carved
        out.features = D.cur.features.stats()
        return out
      })()`)
    }
    const a = await kinds(1795)
    const b = await kinds(2020)
    const all = (v, x) => v.length && v.every((k) => k === x)
    // (the upland loʻi of Nuʻuanu begin in 1796: one loʻi is not yet there in 1795)
    if (!(a.loi.filter((k) => k === 1).length >= a.loi.length - 1 && all(a.pond, 1) && all(a.village, 1))) throw new Error(`1795: ${JSON.stringify(a)}`)
    if (!(a.carved > 100 && a.features.hale > 10 && a.features.waa > 0 && a.features.pondWalls === a.pond.length)) throw new Error(`1795: ${JSON.stringify(a)}`)
    if (!(all(b.loi, 0) && all(b.pond, 0) && all(b.village, 0) && b.carved === 0)) throw new Error(`2020: ${JSON.stringify(b)}`)
    console.log(`      1795: loʻi ${a.loi.join(' ')}, ponds ${a.pond.length}, village ${a.village}; ${a.features.hale} hale, ${a.features.waa} waʻa, ${a.features.pondWalls} pond walls, ${a.carved} sampled texels terraced, ${a.features.trees} trees placed; 2020: nothing`)
  })
  const ev95 = await ui("(() => { const ev = app.data.events.find((e) => e.id === 'nuuanu-1795'); return ev ? app.tour.locate(ev) : null })()")
  const ev83 = await ui("(() => { const ev = app.data.events.find((e) => e.id === 'kaheiki-1783'); return ev ? app.tour.locate(ev) : null })()")
  // what each stop shows, as the data numbers the steps (features.json): the
  // fronts stand at their stops' places, and the steps follow in order
  const expected = {
    'nuuanu-1795': {
      // (the crossing is told at the channel stop, a far view where the district is not down)
      2: ['Kaʻiana’s people cross from Koʻolau'],
      3: ['Kamehameha’s army ashore from Waiʻalae to Waikīkī', 'Kalanikūpule’s posts up the valley'],
      4: ['The march past Kou and up the valley'],
      5: ['The Oʻahu line at Puʻiwa', 'Kamehameha’s front at Puʻiwa'],
      6: ['The Oʻahu line falls back to Lāʻimi', 'The Oʻahu line breaks at Lāʻimi', 'Kamehameha’s front at Lāʻimi'],
      7: ['The retreat to the head of the valley', 'The pursuit up the valley', 'Over the ridge into Kalihi', 'Up the eastern side of the valley', 'Down the old path to Koʻolau'],
    },
    'kaheiki-1783': { 1: ['Kahekili’s column by Pūowaina', 'Kahekili’s column by Pauoa', 'Kahekili’s column by Kapena'], 2: ['Kahahana’s defence at Kaheiki'] },
  }
  for (const [id, at] of [['nuuanu-1795', ev95], ['kaheiki-1783', ev83]]) {
    if (!at) continue
    await check(`${id}: each stop’s camera lands where it asks, the district down, and the forces of its step`, async () => {
      await run(`app.tour.goTo(${at[0]}, ${at[1]}); app.settle()`)
      // (opening the event starts its district streaming)
      await districtReady()
      const n = await ui(`app.tour.event.stops.length`)
      const rows = []
      for (let i = 0; i < n; i++) {
        await run(`app.tour.goStop(${i})`)
        const stop = await ui(`app.tour.event.stops[${i}]`)
        // (the district has been streaming since the event opened, and the flight waits for it)
        const streaming = await ui('!!app.districts.cur')
        await page.evaluate(() => window.__app.rig.finishFlight())
        await yearSettles()
        if (stop.camera) {
          const [yaw, pitch, dist] = await ui('[app.rig.goal.yaw, app.rig.goal.pitch, app.rig.goal.distance]')
          const wantYaw = (-stop.camera.bearing * Math.PI) / 180
          const dy = Math.abs(((yaw - wantYaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
          if (dy > 0.01 || Math.abs(pitch - (stop.camera.pitch * Math.PI) / 2) > 0.01 || Math.abs(dist - stop.camera.distance) > 0.01)
            throw new Error(`stop ${i + 1}: yaw ${yaw.toFixed(3)} pitch ${pitch.toFixed(3)} distance ${dist.toFixed(1)}, asked ${JSON.stringify(stop.camera)}`)
          if (!streaming) throw new Error(`stop ${i + 1}: the district was not streaming when the flight began`)
          await districtReady()
          await settleTwice()
          await frames(2)
          // the place in the middle of the free part of the screen
          const where = await ui(`(() => {
            const g = app.tour.places.get(app.tour.event.stops[${i}].place).geometry
            if (g.type !== 'Point') return [0, 0]
            const [x, z] = app.data.proj.toWorld(g.coordinates)
            const v = new app.camera.position.constructor(x, app.world.heightAt(x, z), z).project(app.camera)
            const b = app.ui.freeBox()
            const sx = ((v.x + 1) / 2) * innerWidth, sy = ((1 - v.y) / 2) * innerHeight
            return [Math.abs(sx - (b.x0 + b.x1) / 2) / (b.x1 - b.x0), Math.abs(sy - (b.y0 + b.y1) / 2) / (b.y1 - b.y0)]
          })()`)
          if (where[0] > 0.12 || where[1] > 0.12) throw new Error(`stop ${i + 1}: its place is off the middle of the view by ${where.map((v) => v.toFixed(2)).join(', ')}`)
        }
        const f = await ui('app.districts.cur?.features?.forces.stats() ?? null')
        const shown = f ? [...f.forces, ...f.lines] : []
        const want = expected[id]?.[i] ?? []
        if (shown.length !== want.length || !want.every((w) => shown.includes(w))) throw new Error(`stop ${i + 1}: shows ${JSON.stringify(shown)}, wanted ${JSON.stringify(want)}`)
        rows.push(`${i + 1} ${stop.place}${stop.camera ? ' (camera)' : ''}: ${shown.length ? `step ${f.steps.join(', ')}, ${shown.length} forces and fronts` : 'none'}`)
      }
      for (const r of rows) console.log(`      ${r}`)
      if (id === 'nuuanu-1795') {
        // nothing at the edge of the pali: within 300 m of the gap the retreat's marks have faded
        await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)))
        await frames(2)
        const atEdge = await ui(`(() => {
          const F = app.districts.cur.features.forces
          const [gx, gz] = app.data.proj.toWorld([-157.7933, 21.3668])
          let n = 0
          for (const r of F.forces) {
            if (r.file) continue
            for (let i = 0; i < r.n; i++) { const k = (r.o + i) * 4; if (F.marks[k + 2] > 0.05 && Math.hypot(F.marks[k] - gx, F.marks[k + 1] - gz) < 3) n++ }
          }
          return n
        })()`)
        if (atEdge) throw new Error(`${atEdge} marks within 300 m of the gap`)
        console.log('      nothing at the edge of the pali')
      }
    })
  }
  await check('outside the tour, in the battle’s year, the forces show quietly', async () => {
    await offTour(1795)
    await view(nearView)
    await settleTwice()
    await frames(1)
    const f = await ui('app.districts.cur.features.forces.stats()')
    if (!(f.quiet && f.event === 'nuuanu-1795' && f.forces.length > 5)) throw new Error(JSON.stringify(f))
    await offTour(1800)
    await settleTwice()
    await frames(1)
    const g = await ui('app.districts.cur.features.forces.stats()')
    if (g.forces.length || g.lines.length) throw new Error(`in 1800: ${JSON.stringify(g)}`)
  })
  await check('the polity colours and the land view are gone over the district', async () => {
    await offTour(1795)
    await view(nearView)
    await settleTwice()
    await expect('app.shared.uniforms.uPolityK.value', 0)
    await expect('app.shared.uniforms.uLandK.value', 0)
    // and hovering names the moku without lighting it
    await page.mouse.move(640, 430)
    await page.waitForTimeout(200)
    await page.mouse.move(645, 432)
    await page.waitForTimeout(300)
    await expect('app.shared.uniforms.uHoverMoku.value', 0)
    await page.mouse.move(5, 400)
  })
  await check('the district fades out and is let go once the camera leaves', async () => {
    await view('app.tour.chainView()')
    await settleTwice()
    await frames(2)
    const st = await ui('app.districts.stats()')
    if (st.on || st.k > 0) throw new Error(`still down over the chain: ${JSON.stringify(st)}`)
    // (it lingers a while in case the camera comes back; skip the wait)
    await run('app.districts.lastSeen = -1e9; app.districts.prefetchAt = -1e9')
    await frames(2)
    await expect('app.districts.cur', null)
    console.log('      off over the chain, and released')
  })
}

// What the page costs, for comparing builds: the JS heap after a collection,
// and the frame time held still over the whole chain and over one island, in
// each view of the far map the build has. (Under the software renderer the
// frame times are the CPU's, so compare them only with each other.)
await check('perf', async () => {
  await run('app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(1778); app.ui.timeline.finish()')
  const cdp = await page.context().newCDPSession(page)
  // (the JS heap, and apart from it the typed arrays' backing stores, where the pack and layer grids live)
  const heapMB = async () => {
    await cdp.send('HeapProfiler.collectGarbage')
    const { usedSize, backingStorageSize } = await cdp.send('Runtime.getHeapUsage')
    const mb = (v) => (v === undefined ? null : +(v / 1048576).toFixed(1))
    return { js: mb(usedSize), buffers: mb(backingStorageSize) }
  }
  const frameMs = (n) =>
    page.evaluate(
      (n) =>
        new Promise((resolve) => {
          // wall time over n of the app's frames (its own frameMs clamps each
          // frame at 100 ms, and a software frame here takes seconds)
          const app = window.__app
          const f0 = app.frames + 1
          let t0 = 0
          const tick = () => {
            if (!t0 && app.frames >= f0) t0 = performance.now()
            if (t0 && app.frames >= f0 + n) return resolve(+((performance.now() - t0) / n).toFixed(1))
            requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
      n,
    )
  // (a build without the land view, or data without its layers, measures the chiefdoms alone)
  const modes = (await ui("typeof app.setView === 'function' && !!app.land?.available")) ? ['chiefdoms', 'land'] : ['chiefdoms']
  if (modes.includes('land')) await page.waitForFunction(() => window.__app.land?.ready, null, { timeout: 300000 }).catch(() => {})
  const out = { heapMB: await heapMB() }
  for (const mode of modes) {
    if (mode !== 'chiefdoms' || modes.length > 1) await run(`app.setView('${mode}')`)
    for (const [name, view] of [['chain', 'app.tour.chainView()'], ['oahu', "app.tour.islandView('oahu', 0)"]]) {
      await run(`const v = ${view}; app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()`)
      await frames(4)
      out[`${mode}.${name}.ms`] = await frameMs(6)
    }
  }
  if (modes.length > 1) await run("app.setView('chiefdoms')")
  // and down in a district, where there is one: the near zoom at Puʻiwa in 1795
  if (await ui('app.districts?.list.length ?? 0')) {
    await run("app.timeline.setYear(1795); app.ui.timeline.finish(); const v = app.tour.cameraView(app.tour.places.get('puiwa'), { bearing: 42, pitch: 0.38, distance: 16 }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()")
    await page.waitForFunction(() => window.__app.districts.cur?.state === 'ready', null, { timeout: 300000 })
    await run('app.settle(); app.settle()')
    await frames(4)
    out['near.ms'] = await frameMs(6)
    out.near = await ui('(() => { const s = app.stats(); return { calls: s.calls, triangles: s.triangles, district: s.district?.nodes, trees: s.district?.features?.treesDrawn } })()')
  }
  out.heapAfterMB = await heapMB()
  out.textures = await ui('app.renderer.info.memory.textures')
  const land = await ui('app.land?.stats?.() ?? null')
  if (land) out.land = land
  console.log('      perf', JSON.stringify(out))
})

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
