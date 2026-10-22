// Dev-only: boot the built app (dist/) in headless Chromium and drive it with
// real pointer and key input (the wheel from the whole chain down to a
// valley, drags, the year slider and its ticks, the layer toggles, the far
// view's switch between the chiefdoms and the land, the chapter tour's Next
// and Back and the view it picks, an event's stops, the pins and the clusters
// they gather into, and their cards) to catch anything that stops input
// reaching what's on screen, and any console error on the way; the chapter
// card set as a chapter's first page, the hover card kept to the far views,
// the patches raising and lowering the ground by year (the data's own, and
// the test masks tools/fake-data.mjs writes), the battle's forces by the stop
// they name, and the camera gliding over a valley's walls; then what the page
// costs in heap and frame time. Run `npm run build -w @vibe-dump/holo-i-ke-au`
// first (and `node tools/fake-data.mjs` for the test masks).
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
  await check('a chapter card opens like a book’s chapter, apart from an event’s', async () => {
    const card = () =>
      ui(`(() => {
        const c = document.querySelector('.card.show')
        const q = (s) => c?.querySelector(s)?.textContent.replace(/\\s+/g, ' ').trim() ?? null
        return { chapter: !!c?.classList.contains('chapter'), num: q('.ch-num'), word: q('.ch-word'), title: c?.querySelector('h1')?.textContent ?? null, lead: q('.ch-lead'), year: q('.ch-year'), initial: q('.ch-note .initial'), count: q('footer .count'), icon: !!c?.querySelector('.card-icon'), pill: document.querySelector('.tl-tour').textContent.replace(/\\s+/g, ' ').trim(),
          num_px: c?.querySelector('.ch-num') ? parseFloat(getComputedStyle(c.querySelector('.ch-num')).fontSize) : 0, h1_px: c?.querySelector('h1') ? parseFloat(getComputedStyle(c.querySelector('h1')).fontSize) : 0, h1_font: c?.querySelector('h1') ? getComputedStyle(c.querySelector('h1')).fontFamily : '' }
      })()`)
    const n = await ui('app.tour.chapters.length')
    // a chapter further in, whose title carries an ʻokina or a kahakō
    const at = await ui(`app.tour.chapters.findIndex((ch, i) => i > 0 && /[ʻāēīōūĀĒĪŌŪ]/.test(ch.era.label))`)
    const c = Math.max(1, at)
    await run(`app.tour.goTo(${c}, -1); app.settle()`)
    await page.evaluate(() => document.fonts.ready)
    const a = await card()
    const label = await ui(`app.tour.chapters[${c}].era.label`)
    if (!a.chapter || a.icon) throw new Error(`the chapter card's class: ${JSON.stringify(a)}`)
    if (a.num !== String(c + 1) || a.word !== 'Chapter') throw new Error(`its numeral reads “${a.word} ${a.num}”, wanted Chapter ${c + 1}`)
    if (a.title !== label) throw new Error(`its title reads “${a.title}”, the era is “${label}”`)
    if (!/^c\. \d{3,4}$/.test(a.year || '')) throw new Error(`its year reads “${a.year}”`)
    if (!(a.num_px >= 2 * a.h1_px && a.h1_px >= 26)) throw new Error(`the numeral ${a.num_px}px and the title ${a.h1_px}px are not a chapter's scale`)
    if (!/Fraunces/.test(a.h1_font)) throw new Error(`the title is set in ${a.h1_font}`)
    const fonts = await page.evaluate((t) => [document.fonts.check('600 31px Fraunces', t), document.fonts.check('italic 400 17px Fraunces', t), document.fonts.check('400 15px Inter', t)], label)
    if (!fonts.every(Boolean)) throw new Error(`the bundled faces for “${label}” (Fraunces, Fraunces italic, Inter): ${fonts.join(', ')}`)
    const want = `Chapter ${c + 1} of ${n}`
    if (a.count !== want) throw new Error(`the footer reads “${a.count}”, wanted “${want}”`)
    if (!a.pill.startsWith(want)) throw new Error(`the pill reads “${a.pill}”, wanted “${want} …”`)
    await expect("document.querySelector('.tl-tour').classList.contains('opening')", true)
    // and an event card is not set so
    const evs = await ui(`app.tour.chapters[${c}].events.length`)
    if (evs) {
      await run(`app.tour.goTo(${c}, 0); app.settle()`)
      const b = await card()
      if (b.chapter || !b.icon || b.num !== null) throw new Error(`an event card: ${JSON.stringify(b)}`)
      if (!b.count?.endsWith(`in chapter ${c + 1}`) || !b.pill.startsWith(`Chapter ${c + 1} of ${n}`)) throw new Error(`an event's footer “${b.count}” and pill “${b.pill}”`)
      await expect("document.querySelector('.tl-tour').classList.contains('opening')", false)
    }
    console.log(`      “${a.word} ${a.num}” over “${a.title}”, ${a.year}, initial “${a.initial}” · footer “${a.count}” · pill “${a.pill}”`)
    await run('app.tour.goTo(0, -1); app.settle()')
  })
  await check('the chapter card on a phone: the numeral beside the title, the note in view', async () => {
    await page.setViewportSize({ width: 390, height: 844 })
    await frames(2)
    const r = await ui(`(() => {
      const c = document.querySelector('.card.show.chapter')
      const box = (s) => c.querySelector(s).getBoundingClientRect()
      const card = c.getBoundingClientRect(), num = box('.ch-num'), h1 = box('h1'), note = box('.ch-note')
      return { left: card.left, right: card.right, top: card.top, numRight: num.right, h1Left: h1.left, h1Top: h1.top, numTop: num.top, noteTop: note.top, bottom: card.bottom, sw: document.documentElement.scrollWidth }
    })()`)
    await page.setViewportSize({ width: 1280, height: 800 })
    await frames(2)
    if (r.sw > 390 || r.left < 0 || r.right > 390) throw new Error(`it spills off the screen: ${JSON.stringify(r)}`)
    if (!(r.numRight <= r.h1Left + 1 && Math.abs(r.h1Top - r.numTop) < 40)) throw new Error(`the numeral is not beside the title: ${JSON.stringify(r)}`)
    if (!(r.noteTop < r.bottom - 40)) throw new Error(`the note starts below the card's fold: ${JSON.stringify(r)}`)
    console.log(`      390 × 844: the card ${Math.round(r.top)}–${Math.round(r.bottom)} px, the note from ${Math.round(r.noteTop)} px`)
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
      // (the district's own fill patches, here the contact and kingdom ones, all whole in 1795 and all gone by 2020)
      return ui(`[app.world.metresAt(${pt[0]}, ${pt[1]}), app.districts.patchWeights().filter((p) => p.kind === 'lower' && p.until > 1795).map((p) => p.k)]`)
    }
    const [m1795, k1795] = await at(1795)
    const [m2020, k2020] = await at(2020)
    if (!(m1795 < -0.5 && k1795.length && k1795.every((k) => k === 1))) throw new Error(`1795: ${m1795.toFixed(2)} m (patches ${k1795})`)
    if (!(m2020 > 1 && k2020.every((k) => k === 0))) throw new Error(`2020: ${m2020.toFixed(2)} m (patches ${k2020})`)
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
    if (!pt && (await ui("app.districts.patchWeights().some((p) => p.kind === 'raise')"))) {
      // (the channels are raise patches' to lay now, which the patch checks below cover)
      console.log('      no channel filled by the rule: raise patches lay them')
      return
    }
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
  // fronts stand at their stops' places, and the steps follow in order; or,
  // where the features name their stop, as they name it
  const inferred = {
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
  /** The table for an event: by the features' own `stop` where they name one, by inference for the rest. */
  const expectedFor = (id) =>
    ui(`(() => {
      const F = app.districts.cur?.features?.forces
      const e = F?.events.get('${id}')
      const ev = app.data.events.find((x) => x.id === '${id}')
      const table = ${JSON.stringify(inferred)}['${id}'] || {}
      if (!e || !ev) return { table, named: 0 }
      const named = e.recs.filter((r) => r.stop !== null && r.stop !== undefined)
      if (!named.length) return { table, named: 0 }
      const names = new Set(named.map((r) => r.p.name))
      const out = {}
      for (const [k, v] of Object.entries(table)) { const left = v.filter((n) => !names.has(n)); if (left.length) out[k] = left }
      for (const r of named) for (const v of [r.stop].flat()) {
        const ks = Number.isInteger(v) ? [v] : ev.stops.map((s, k) => (s.place === v ? k : -1)).filter((k) => k >= 0)
        for (const k of ks) (out[k] ||= []).push(r.p.name)
      }
      return { table: out, named: named.length, of: e.recs.length }
    })()`)
  for (const [id, at] of [['nuuanu-1795', ev95], ['kaheiki-1783', ev83]]) {
    if (!at) continue
    await check(`${id}: each stop’s camera lands where it asks, the district down, and the forces of its stop`, async () => {
      await run(`app.tour.goTo(${at[0]}, ${at[1]}); app.settle()`)
      // (opening the event starts its district streaming)
      await districtReady()
      const exp = await expectedFor(id)
      const expected = { [id]: exp.table }
      if (exp.named) console.log(`      ${exp.named} of ${exp.of} forces and fronts name their stop`)
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
          // landed: the rig at the asked distance and pitch, its target on the ground under it, and the eye where they put it
          const [sd, sp, gap, eyeD, eyeP] = await ui(`(() => {
            const s = app.rig.state, t = s.target, c = app.camera.position
            const d = c.distanceTo(t)
            return [s.distance, s.pitch, t.y - app.world.heightAt(t.x, t.z), d, Math.asin((c.y - t.y) / d)]
          })()`)
          const askP = (stop.camera.pitch * Math.PI) / 2
          if (Math.abs(sd - stop.camera.distance) > 0.01 || Math.abs(sp - askP) > 0.01 || Math.abs(gap) > 0.01)
            throw new Error(`stop ${i + 1}: landed at distance ${sd.toFixed(2)} pitch ${sp.toFixed(3)}, the target ${gap.toFixed(3)} off the ground`)
          if (Math.abs(eyeD - stop.camera.distance) / stop.camera.distance > 0.03 || Math.abs(eyeP - askP) > 0.03)
            throw new Error(`stop ${i + 1}: the eye stands ${eyeD.toFixed(2)} off at ${eyeP.toFixed(3)}, asked ${stop.camera.distance} at ${askP.toFixed(3)}`)
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
        rows.push(`${i + 1} ${stop.place}${stop.camera ? ' (camera)' : ''}: ${shown.length ? `step ${f.steps.join(', ')}, ${shown.length} forces and fronts (${f.by})` : 'none'}`)
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
  await check('a force or a front that names its stop shows there, whatever its step', async () => {
    if (!ev95) return
    await run(`app.tour.goTo(${ev95[0]}, ${ev95[1]}); app.settle()`)
    await districtReady()
    const r = await ui(`(() => {
      const F = app.districts.cur.features.forces
      const ev = app.data.events.find((e) => e.id === 'nuuanu-1795')
      const rec = F.forces.find((x) => !x.stand && !x.file)
      const was = rec.stop
      const names = (i) => [...F.shownAt(ev, i)].map((x) => x.p.name)
      const out = {}
      rec.stop = 7
      out.index = [names(7).includes(rec.p.name), names(4).includes(rec.p.name)]
      rec.stop = [4, 6]
      out.list = [names(4).includes(rec.p.name), names(6).includes(rec.p.name), names(7).includes(rec.p.name)]
      rec.stop = 'puiwa'
      out.place = [names(5).includes(rec.p.name), names(4).includes(rec.p.name)]
      rec.stop = was
      out.name = rec.p.name
      return out
    })()`)
    const ok = r.index[0] && !r.index[1] && r.list[0] && r.list[1] && !r.list[2] && r.place[0] && !r.place[1]
    if (!ok) throw new Error(JSON.stringify(r))
    console.log(`      “${r.name}” named at stop 7, at 4 and 6, at Puʻiwa: each shows there and only there`)
  })
  await check('the polity colours, the land view and the hover card are gone over the district', async () => {
    await offTour(1795)
    await view(nearView)
    await settleTwice()
    await expect('app.shared.uniforms.uPolityK.value', 0)
    await expect('app.shared.uniforms.uLandK.value', 0)
    // and the pointer over the land there names nothing and lights nothing
    await page.mouse.move(640, 430)
    await page.waitForTimeout(200)
    await page.mouse.move(645, 432)
    await page.waitForTimeout(300)
    await frames(1)
    await expect('app.shared.uniforms.uHoverMoku.value', 0)
    await expect("!!document.querySelector('.inspector.show')", false)
    await page.mouse.move(5, 400)
  })
  await check('the hover card belongs to the far views: gone at the Puʻiwa stop and in a valley, back at the chain', async () => {
    const landAt = () =>
      page.evaluate(() => {
        const app = window.__app
        for (let y = 140; y < innerHeight - 160; y += 21) {
          for (let x = 60; x < innerWidth * 0.62; x += 21) {
            if (document.elementFromPoint(x, y)?.id !== 'scene' || document.elementFromPoint(x - 6, y)?.id !== 'scene') continue
            const p = app.rig.pickGround(x, y)
            if (p && app.world.metresAt(p.x, p.z) > 20 && app.polity.mokuAt(p.x, p.z)) return [x, y]
          }
        }
        return null
      })
    const hoverAt = async (pt) => {
      await page.mouse.move(pt[0] - 6, pt[1])
      await page.waitForTimeout(150)
      await page.mouse.move(pt[0], pt[1])
      await page.waitForTimeout(150)
      await frames(2)
      return ui("document.querySelector('.inspector.show')?.textContent.replace(/\\s+/g, ' ').trim() ?? null")
    }
    // at the chain, it names the moku
    await offTour(1795)
    await view('app.tour.chainView()')
    await frames(2)
    const far = await landAt()
    if (!far) throw new Error('no moku on screen over the chain')
    const a = await hoverAt(far)
    if (!a) throw new Error('over the chain the hover card does not show')
    // the tour's Puʻiwa stop, flown to under the resting pointer: it goes
    if (ev95) {
      const stop = await ui(`app.data.events.find((e) => e.id === 'nuuanu-1795').stops.findIndex((s) => s.place === 'puiwa')`)
      await run(`app.tour.goTo(${ev95[0]}, ${ev95[1]}); app.tour.goStop(${stop})`)
      await page.evaluate(() => window.__app.rig.finishFlight())
      await districtReady()
      await settleTwice()
      await frames(2)
      await expect("!!document.querySelector('.inspector.show')", false)
      const near = await landAt()
      if (near && (await hoverAt(near))) throw new Error('at the Puʻiwa stop the hover card shows over the land')
    }
    // a valley with no district: the near zoom over Maui's ʻĪao, or any island's middle
    await run("app.ui.card.close(); app.ui.onScrub(); const p = app.tour.places.get('iao-valley') || app.tour.places.get('waipio-valley'); const t = app.world.islands.find((t) => t.pack.id === 'maui') || app.world.islands[0]; const r = t.pack.rect; const v = p ? app.tour.pointView(p, 60) : app.rig.fit({ rect: { x0: (r.x0 + r.x1) / 2, x1: (r.x0 + r.x1) / 2, z0: (r.z0 + r.z1) / 2, z1: (r.z0 + r.z1) / 2 }, distance: 60 }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()")
    await frames(3)
    const valley = await landAt()
    if (valley && (await hoverAt(valley))) throw new Error('in a valley the hover card shows')
    // and back out over the chain, it names the moku again
    await view('app.tour.chainView()')
    await frames(3)
    const back = await landAt()
    const b = back && (await hoverAt(back))
    if (!b) throw new Error('back over the chain the hover card does not return')
    await page.mouse.move(5, 400)
    console.log(`      chain: “${a}”; Puʻiwa and a valley: nothing; the chain again: “${b}”`)
  })
  await check('a pan across the valley’s walls glides: the camera never jumps a frame', async () => {
    await offTour(1795)
    await view(nearView)
    await districtReady()
    await settleTwice()
    await frames(2)
    // (a steady pan across the valley, screen right being across it from this stop's bearing; the
    // frames are the app's own, whose step is held to a tenth of a second however slow they come)
    const r = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const app = window.__app
          const rows = []
          let n = 0
          const tick = () => {
            const t = app.rig.goal.target
            rows.push([app.camera.position.y, app.world.metresAt(t.x, t.z)])
            if (n < 44) app.rig.panBy(-14, 0)
            if (n++ < 52) requestAnimationFrame(tick)
            else resolve({ rows, vert: app.world.uniforms.uVert.value })
          }
          requestAnimationFrame(tick)
        }),
    )
    let jump = 0
    let step = 0
    let lo = Infinity
    let hi = -Infinity
    for (let i = 0; i < r.rows.length; i++) {
      lo = Math.min(lo, r.rows[i][1])
      hi = Math.max(hi, r.rows[i][1])
      if (!i) continue
      jump = Math.max(jump, Math.abs(r.rows[i][0] - r.rows[i - 1][0]))
      step = Math.max(step, Math.abs(r.rows[i][1] - r.rows[i - 1][1]))
    }
    const jumpM = jump / r.vert
    if (hi - lo < 30) throw new Error(`the pan crossed only ${(hi - lo).toFixed(0)} m of relief`)
    if (jump > 0.15 || jumpM > step * 0.5) throw new Error(`the camera jumped ${jump.toFixed(3)} (${jumpM.toFixed(1)} m of ground) in a frame, while the ground under the target stepped ${step.toFixed(1)} m`)
    console.log(`      ${r.rows.length} frames over ${(hi - lo).toFixed(0)} m of relief (steps of up to ${step.toFixed(0)} m a frame): the camera's largest step ${jump.toFixed(3)} (${jumpM.toFixed(1)} m)`)
  })
  // ==== the battles' people (features/soldiers.js, sprites.js) ===================== [soldiers]
  // Pixel-art figures in place of the masses: at each stop the people of its
  // forces, of their own sides; each a whole number of device pixels to the
  // sprite pixel at every distance, crisp on the screen (every k by k block of
  // a figure one colour, its outline where the sheet puts it); the two sides
  // fighting in turn at the fronts, muskets firing, the guns served, nobody
  // lost; nothing within 300 m of the edge of the pali however long they walk;
  // nobody under the ground or in the water; off the tour, fewer and nobody
  // fighting; and what they cost at Puʻiwa.
  {
    const SF = 'app.districts.cur.features.forces'
    const SS = `${SF}.soldiers`
    const gotoStop = async (at, i) => {
      await run(`app.tour.goTo(${at[0]}, ${at[1]}); app.settle()`)
      await districtReady()
      await run(`app.tour.goStop(${i})`)
      await page.evaluate(() => window.__app.rig.finishFlight())
      await yearSettles()
      await districtReady()
      await settleTwice()
      await frames(2)
    }
    /** The figures drawn now, each with its force's side and its own, where it stands, and its ground. */
    const drawn = () =>
      ui(`(() => {
        const S = ${SS}, f = S.f, out = []
        S.recs.forEach((r, ri) => { for (let i = r.o; i < r.o + r.n; i++) if (f.vis[i] > 0) out.push({ i, name: r.p.name, recSide: r.side, side: ['hawaii', 'oahu', 'maui'][f.side[i]], x: f.x[i], z: f.z[i], gm: f.gm[i], now: app.world.metresAt(f.x[i], f.z[i]), k: f.k[i], fr: f.fr[i], mode: f.mode[i] }) })
        return out
      })()`)
    const edgeAt = await ui(`(() => { const p = app.data.places.find((p) => p.id === 'nuuanu-pali'); return p ? app.data.proj.toWorld(p.geometry.coordinates) : null })()`)
    const stopsSeen = {}
    for (const [id, at] of [['nuuanu-1795', ev95], ['kaheiki-1783', ev83]]) {
      if (!at) continue
      await check(`${id}: at each stop the people of its forces, of their own sides, on dry ground`, async () => {
        const n = await ui(`app.data.events.find((e) => e.id === '${id}').stops.length`)
        const rows = []
        for (let i = 0; i < n; i++) {
          await gotoStop(at, i)
          const stop = await ui(`app.tour.event.stops[${i}]`)
          if (!stop.camera) {
            // (a far stop: the district is not down, and nobody is drawn)
            const n = await ui(`app.districts.cur?.features?.forces?.soldiers.drawn ?? 0`)
            if (n) throw new Error(`stop ${i + 1} (${stop.place}, far): ${n} figures drawn`)
            rows.push(`${i + 1} ${stop.place}: far, nobody drawn`)
            continue
          }
          const st = await ui(`${SF}.stats()`)
          const figs = await drawn()
          const names = [...st.forces, ...st.lines]
          // (a force whose people would all stand over the edge of the pali as this camera sees it is kept from it)
          const kept = await ui(`(() => { const S = ${SS}, f = S.f, out = {}; for (const r of S.recs) { let n = 0; for (let i = r.o; i < r.o + r.n; i++) n += f.hid[i]; if (n) out[r.p.name] = n } return out })()`)
          for (const name of names) if (!figs.some((g) => g.name === name) && !kept[name]) throw new Error(`stop ${i + 1}: nobody of “${name}” drawn`)
          const keptHere = names.filter((n) => kept[n] && !figs.some((g) => g.name === n))
          const stray = figs.find((g) => !names.includes(g.name))
          if (stray) throw new Error(`stop ${i + 1}: a figure of “${stray.name}”, not of this stop`)
          const turned = figs.find((g) => g.side !== g.recSide)
          if (turned) throw new Error(`stop ${i + 1}: a ${turned.side} figure in “${turned.name}” (${turned.recSide})`)
          // feet on the ground of the year (as last looked up, a few metres back at most), never in the water
          const off = figs.reduce((m, g) => Math.max(m, Math.abs(g.gm - g.now)), 0)
          const wet = figs.filter((g) => g.now < 0.15)
          if (off > 1.5) throw new Error(`stop ${i + 1}: a figure's feet ${off.toFixed(2)} m off the ground`)
          if (wet.length) throw new Error(`stop ${i + 1}: ${wet.length} figures in the water (${wet[0].name})`)
          if (edgeAt) {
            const near = figs.filter((g) => Math.hypot(g.x - edgeAt[0], g.z - edgeAt[1]) < 3)
            if (near.length) throw new Error(`stop ${i + 1}: ${near.length} figures within 300 m of the pali edge`)
          }
          const sides = {}
          for (const g of figs) sides[g.side] = (sides[g.side] || 0) + 1
          const ks = [...new Set(figs.map((g) => g.k))].sort()
          stopsSeen[`${id}:${i}`] = figs.length
          rows.push(`${i + 1} ${stop.place}: ${figs.length} figures (${Object.entries(sides).map(([s, c]) => `${s} ${c}`).join(', ')}), k ${ks.join('/')}, feet within ${off.toFixed(2)} m${keptHere.length ? `; kept from the edge as seen from here: ${keptHere.map((n) => `“${n}”`).join(', ')}` : ''}`)
        }
        for (const r of rows) console.log(`      ${r}`)
      })
    }
    if (ev95) {
      await check('each figure is a whole number of device pixels to the sprite pixel at every distance, and crisp on the screen', async () => {
        const puiwa = await ui(`app.data.events.find((e) => e.id === 'nuuanu-1795').stops.findIndex((s) => s.place === 'puiwa')`)
        await gotoStop(ev95, puiwa)
        const t = await ui('[app.rig.state.target.x, app.rig.state.target.z, app.rig.state.yaw, app.rig.state.pitch]')
        const rows = []
        for (const d of [8, 10, 13, 16, 24, 40, 60]) {
          await run(`app.rig.jump({ x: ${t[0]}, z: ${t[1]}, distance: ${d}, yaw: ${t[2]}, pitch: ${t[3]} }); app.settle(); app.settle()`)
          await frames(1)
          const r = await ui(`(() => {
            const S = ${SS}, f = S.f, cam = app.camera, e = cam.matrixWorld.elements, vert = app.world.uniforms.uVert.value
            const out = { n: 0, bad: [], ks: {}, dpr: S.dpr }
            for (let i = 0; i < S.count; i++) {
              if (f.vis[i] <= 0) continue
              out.n++
              const k = f.k[i]
              const y = Math.max(f.gm[i], 0) * vert
              const depth = -((f.x[i] - cam.position.x) * e[8] + (y - cam.position.y) * e[9] + (f.z[i] - cam.position.z) * e[10])
              if (!Number.isInteger(k) || k < 2 || k > Math.round(4 * S.dpr) || k !== S.scaleAt(depth)) out.bad.push([i, k, +depth.toFixed(2)])
              out.ks[k] = (out.ks[k] || 0) + 1
            }
            return out
          })()`)
          if (r.bad.length) throw new Error(`at ${d}: ${r.bad.length} figures at a scale off the rule, e.g. ${JSON.stringify(r.bad.slice(0, 3))}`)
          if (!r.n) throw new Error(`at ${d}: nobody drawn`)
          rows.push(`${d}: ${r.n} figures, ${Object.entries(r.ks).map(([k, c]) => `${c} at ${k} px (${(16 * k) / r.dpr} px tall)`).join(', ')}`)
        }
        for (const r of rows) console.log(`      ${r}`)
        // on the screen: everyone held still, a screenshot, and each figure found where the shader puts
        // it: every opaque sprite pixel that no other figure or shadow overlaps a k by k block of one
        // colour, and its outline dark
        for (const d of [16, 10]) {
          await run(`app.rig.jump({ x: ${t[0]}, z: ${t[1]}, distance: ${d}, yaw: ${t[2]}, pitch: ${t[3]} }); app.settle(); app.settle(); ${SS}.hold = true`)
          await frames(3)
          const png = await page.screenshot({ timeout: 180000 })
          const res = await page.evaluate(
            async ({ b64, path }) => {
              const app = window.__app
              const S = path.split('.').reduce((o, k) => o[k], app)
              const img = new Image()
              img.src = `data:image/png;base64,${b64}`
              await img.decode()
              const cv = document.createElement('canvas')
              cv.width = img.width
              cv.height = img.height
              const cx = cv.getContext('2d', { willReadFrequently: true })
              cx.drawImage(img, 0, 0)
              const W = cv.width
              const H = cv.height
              const px = cx.getImageData(0, 0, W, H).data
              const sheet = S.sheet
              const rects = []
              for (let i = 0; i < S.count; i++) {
                const r = S.screenRect(i)
                if (r && r.vis >= 1) rects.push([i, r])
              }
              let figs = 0
              let blocks = 0
              let even = 0
              let lines = 0
              let dark = 0
              for (const [i, r] of rects) {
                if (r.x < 2 || r.y < 2 || r.x + r.w > W - 2 || r.y + r.h + 3 * r.k > H - 2) continue
                // (clear of the page over the scene)
                const pts = [[r.x + 1, r.y + 1], [r.x + r.w - 2, r.y + 1], [r.x + 1, r.y + r.h - 2], [r.x + r.w - 2, r.y + r.h - 2], [r.x + r.w / 2, r.y + r.h / 2]]
                if (pts.some(([x, y]) => document.elementFromPoint(x, y)?.id !== 'scene')) continue
                // the others that reach into its box, each with its shadow under it and a pixel round
                const near = rects.filter(([j, q]) => j !== i && q.x - 2 < r.x + r.w + 2 && q.x + q.w + 2 > r.x - 2 && q.y - 2 < r.y + r.h + 3 * r.k && q.y + q.h + 3 * q.k > r.y - 2).map(([, q]) => q)
                const covered = (X, Y, k) => near.some((q) => X < q.x + q.w + 2 && X + k > q.x - 2 && Y < q.y + q.h + 3 * q.k && Y + k > q.y - 2)
                let best = null
                // (where we put it, and a pixel either way, should the GPU round a hair differently)
                for (const [ox, oy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
                  let b = 0
                  let e = 0
                  let l = 0
                  let dk = 0
                  for (let sy = 0; sy < r.h / r.k; sy++) {
                    for (let sx = 0; sx < r.cell[2]; sx++) {
                      const tx = r.facing < 0 ? r.cell[2] - 1 - sx : sx
                      const s = ((r.cell[1] + sy) * sheet.width + r.cell[0] + tx) * 4
                      if (sheet.data[s + 3] < 64) continue
                      const X = r.x + ox + sx * r.k
                      const Y = r.y + oy + sy * r.k
                      if (covered(X, Y, r.k)) continue
                      b++
                      const o = (Y * W + X) * 4
                      let same = true
                      for (let v = 0; v < r.k && same; v++) {
                        for (let u = 0; u < r.k; u++) {
                          const q = ((Y + v) * W + X + u) * 4
                          if (Math.abs(px[q] - px[o]) + Math.abs(px[q + 1] - px[o + 1]) + Math.abs(px[q + 2] - px[o + 2]) > 9) {
                            same = false
                            break
                          }
                        }
                      }
                      if (same) e++
                      // (the outline's colour in the sheet: on the screen, dark)
                      if (sheet.data[s] === 0x2a && sheet.data[s + 1] === 0x20 && sheet.data[s + 2] === 0x1b) {
                        l++
                        if (px[o] + px[o + 1] + px[o + 2] < 210) dk++
                      }
                    }
                  }
                  if (!best || e + dk > best.e + best.dk) best = { b, e, l, dk }
                }
                if (!best.b) continue
                figs++
                blocks += best.b
                even += best.e
                lines += best.l
                dark += best.dk
              }
              return { drawn: rects.length, figs, blocks, even, lines, dark, W, H }
            },
            { b64: png.toString('base64'), path: 'districts.cur.features.forces.soldiers' },
          )
          await run(`${SS}.hold = false`)
          const evenK = res.even / Math.max(1, res.blocks)
          const darkK = res.dark / Math.max(1, res.lines)
          console.log(`      at ${d}: ${res.figs} of ${res.drawn} figures in the open in part; of their sprite pixels that nothing overlaps, ${res.even} of ${res.blocks} (${(evenK * 100).toFixed(1)}%) one colour on the screen, ${res.dark} of ${res.lines} outline pixels dark (${(darkK * 100).toFixed(1)}%)`)
          if (res.figs < 6 || res.blocks < 200) throw new Error(`at ${d}: only ${res.blocks} sprite pixels of ${res.figs} figures in the open to look at`)
          if (evenK < 0.9 || darkK < 0.85) throw new Error(`at ${d}: not crisp on the screen (${(evenK * 100).toFixed(1)}% of blocks one colour, ${(darkK * 100).toFixed(1)}% of outlines dark)`)
        }
      })
      await check('at the fronts the two sides strike in turn, muskets fire, the guns are served, and nobody is lost', async () => {
        const rows = []
        for (const place of ['puiwa', 'laimi']) {
          const i = await ui(`app.data.events.find((e) => e.id === 'nuuanu-1795').stops.findIndex((s) => s.place === '${place}')`)
          await gotoStop(ev95, i)
          const r = await ui(`(() => {
            const F = ${SF}, S = F.soldiers, f = S.f, M = S.constructor.MODE, KD = S.constructor.KIND
            const out = { strikes: 0, together: 0, guards: 0, musketFlash: 0, gunFlash: 0, rammed: 0, touched: 0, min: Infinity, max: 0, frames: 0 }
            const fronts = S.recs.filter((r) => r.line && r.w > 0)
            for (let step = 0; step < 150; step++) {
              F.update(0.1, app.districts.k, app.rig.state.distance)
              const striking = new Map()
              let atFront = 0
              for (const r of fronts) for (let i = r.o; i < r.o + r.n; i++) {
                if (f.vis[i] <= 0) continue
                atFront++
                const fr = f.fr[i]
                if (f.mode[i] === M.duel) {
                  // (striking: the draw and the blow; frame 12 is the guard, held while the other strikes)
                  if (fr === 10 || fr === 11) {
                    out.strikes++
                    striking.set(f.grp[i], (striking.get(f.grp[i]) || 0) + 1)
                  } else if (fr === 12) out.guards++
                } else if (f.kind[i] === KD.musket && fr === 11) out.musketFlash++
                else if (f.mode[i] === M.piece && fr === 10) out.gunFlash++
                else if (f.kind[i] === KD.rammer && fr >= 10) out.rammed++
                else if (f.kind[i] === KD.linstock && fr === 11) out.touched++
              }
              for (const c of striking.values()) if (c > 1) out.together++
              out.min = Math.min(out.min, atFront)
              out.max = Math.max(out.max, atFront)
            }
            return out
          })()`)
          rows.push(`${place}: over 15 s, ${r.strikes} blows struck (${r.together} by both of a pair at once), ${r.musketFlash} musket flashes, ${r.gunFlash} gun flashes, ${r.rammed} ramming, ${r.touched} matches put; ${r.min}–${r.max} people at the fronts`)
          if (!(r.strikes > 0 && r.guards > 0)) throw new Error(`${place}: no bout fought: ${JSON.stringify(r)}`)
          if (r.together) throw new Error(`${place}: both of a pair struck at once ${r.together} times`)
          if (!(r.musketFlash > 0)) throw new Error(`${place}: no musket fired in 15 s`)
          if (!(r.gunFlash > 0 && r.rammed > 0 && r.touched > 0)) throw new Error(`${place}: the guns not served: ${JSON.stringify(r)}`)
          if (r.min !== r.max) throw new Error(`${place}: the people at the fronts went from ${r.max} to ${r.min}`)
        }
        for (const r of rows) console.log(`      ${r}`)
      })
      await check('however long they walk, nobody comes within 300 m of the edge of the pali', async () => {
        if (!edgeAt) throw new Error('no nuuanu-pali in the gazetteer')
        const rows = []
        for (const place of ['laimi', 'nuuanu-pali']) {
          const i = await ui(`app.data.events.find((e) => e.id === 'nuuanu-1795').stops.findIndex((s) => s.place === '${place}')`)
          await gotoStop(ev95, i)
          const r = await ui(`(() => {
            const F = ${SF}, S = F.soldiers, f = S.f, [ex, ez] = [${edgeAt[0]}, ${edgeAt[1]}]
            let nearest = Infinity, inside = 0, seen = 0, wet = 0, sunk = 0, worst = 0, worstOf = ''
            for (let step = 0; step < 900; step++) {
              F.update(0.1, app.districts.k, app.rig.state.distance)
              for (let i = 0; i < S.count; i++) {
                if (f.vis[i] <= 0) continue
                seen++
                const d = Math.hypot(f.x[i] - ex, f.z[i] - ez)
                nearest = Math.min(nearest, d)
                if (d < 3) inside++
                if (S.marks[i * 4 + 2] > 0.05 && Math.hypot(S.marks[i * 4] - ex, S.marks[i * 4 + 1] - ez) < 3) inside++
                if (step % 30 === 0) {
                  const g = app.world.metresAt(f.x[i], f.z[i])
                  if (g < 0.15) wet++
                  if (Math.abs(g - f.gm[i]) > 1.5) sunk++
                  if (Math.abs(g - f.gm[i]) > worst) {
                    worst = Math.abs(g - f.gm[i])
                    worstOf = S.recs[f.rec[i]].p.name
                  }
                }
              }
            }
            return { nearest, inside, seen, wet, sunk, worst, worstOf }
          })()`)
          rows.push(`${place}: over 90 s, the nearest anyone came was ${(r.nearest * 100).toFixed(0)} m; none in the water, feet within ${r.worst.toFixed(2)} m of the ground`)
          if (r.inside) throw new Error(`${place}: ${r.inside} times a figure within 300 m of the edge`)
          if (r.wet || r.sunk) throw new Error(`${place}: ${r.wet} figure-frames in the water, ${r.sunk} more than 1.5 m off the ground (at worst ${r.worst.toFixed(2)} m, “${r.worstOf}”)`)
        }
        for (const r of rows) console.log(`      ${r}`)
      })
      await check('off the tour, in the battle’s year: fewer of them, walking and standing, nobody fighting', async () => {
        await offTour(1795)
        await view(nearView)
        await settleTwice()
        await frames(2)
        const r = await ui(`(() => {
          const F = ${SF}, S = F.soldiers, f = S.f, M = S.constructor.MODE
          const out = { quiet: F.stats().quiet, engage: 0, walking: 0, standing: 0, shown: 0, perRec: 0 }
          for (let step = 0; step < 60; step++) {
            F.update(0.1, app.districts.k, app.rig.state.distance)
            let shown = 0
            for (const r of S.recs) {
              let n = 0
              for (let i = r.o; i < r.o + r.n; i++) {
                if (f.vis[i] <= 0) continue
                n++
                if (f.fr[i] >= 10) out.engage++
                else if (f.fr[i] >= 8) out.standing++
                else out.walking++
              }
              shown += n
              if (r.n >= 20) out.perRec = Math.max(out.perRec, n / r.n)
            }
            out.shown = Math.max(out.shown, shown)
          }
          return out
        })()`)
        if (!r.quiet) throw new Error(`not quiet: ${JSON.stringify(r)}`)
        if (r.engage) throw new Error(`${r.engage} figure-frames fighting off the tour`)
        if (!(r.walking > 0 && r.standing > 0)) throw new Error(`walking ${r.walking}, standing ${r.standing}`)
        if (r.perRec > 0.35) throw new Error(`a force shows ${(r.perRec * 100).toFixed(0)}% of its people off the tour`)
        const atStop = stopsSeen['nuuanu-1795:5']
        console.log(`      up to ${r.shown} drawn, at most ${(r.perRec * 100).toFixed(0)}% of any force's people (the Puʻiwa stop drew ${atStop ?? '?'}), walking and standing only`)
      })
      await check('what the people cost at the Puʻiwa stop', async () => {
        const puiwa = await ui(`app.data.events.find((e) => e.id === 'nuuanu-1795').stops.findIndex((s) => s.place === 'puiwa')`)
        await gotoStop(ev95, puiwa)
        await page.waitForTimeout(1500)
        const frameMs = () =>
          page.evaluate(
            () =>
              new Promise((resolve) => {
                const app = window.__app
                const f0 = app.frames + 1
                let t0 = 0
                const tick = () => {
                  if (!t0 && app.frames >= f0) t0 = performance.now()
                  if (t0 && app.frames >= f0 + 6) return resolve((performance.now() - t0) / 6)
                  requestAnimationFrame(tick)
                }
                requestAnimationFrame(tick)
              }),
          )
        const runs = [await frameMs(), await frameMs(), await frameMs()].sort((a, b) => a - b)
        const r = await ui(`(() => {
          const F = ${SF}, S = F.soldiers
          const t0 = performance.now()
          for (let k = 0; k < 200; k++) F.update(1 / 60, app.districts.k, app.rig.state.distance)
          const ms = (performance.now() - t0) / 200
          const s = app.stats()
          return { updateMs: +ms.toFixed(3), drawn: S.drawn, planned: S.count, cap: S.cap, calls: s.calls, triangles: s.triangles }
        })()`)
        console.log(`      frame ${runs[1].toFixed(0)} ms (median of ${runs.map((v) => v.toFixed(0)).join(', ')}) under the software renderer; the people's update ${r.updateMs} ms on the CPU for ${r.drawn} drawn of ${r.planned} placed (at most ${r.cap}), two draws; ${r.calls} calls, ${r.triangles} triangles in all`)
      })
    }
  }
  // ==== [soldiers] end =========================================================================

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

// ==== settlements by era (features/settlements.js) ==========================
// At the harbour: kauhale in 1795, a few hundred hale with Kou's own over the
// plain the Kou stop frames (2.5 km round it: the layer has the village a
// thin one, about a hundred people per km², and a kauhale is a household or
// two); and within 1.5 km of Kou, a mixed town of thatch, frame and adobe by
// 1853 with its church, stores and masonry by 1896, towers by the timeline's
// last year (the 2020 keyframe). Every kind within its era's; none on a loʻi, a pond, the
// village while it stands, or the water of its year; within the budget; and
// what each year costs in heap and frame time, with the town and without it.
if (await ui('app.districts?.list.length ?? 0')) {
  const townReady = () => page.waitForFunction(() => window.__app.districts.cur?.state === 'ready' && window.__app.districts.cur.features?.settlements.ready, null, { timeout: 300000 })
  const atHarbour = async (year) => {
    await run(`app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(${year}); app.ui.timeline.finish(); const v = app.tour.cameraView(app.tour.places.get('kou'), { bearing: 45, pitch: 0.6, distance: 40 }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()`)
    await townReady()
    await run('app.settle(); app.settle()')
    await frames(2)
  }
  const kou = await ui("app.data.proj.toWorld(app.tour.places.get('kou').geometry.coordinates)")
  const census = (year, r = 15) => ui(`app.districts.cur.features.settlements.census(${year}, ${r === Infinity ? 'null, null' : `${kou[0]}, ${kou[1]}`}, ${r === Infinity ? 'Infinity' : r})`)
  const brief = (c) => Object.entries(c.by).map(([k, v]) => `${v} ${k}`).join(', ')
  const ERA_KINDS = {
    1795: ['kauhale'],
    1853: ['hale', 'frame', 'adobe', 'church'],
    1896: ['hale', 'frame', 'cottage', 'store', 'block', 'church', 'spire'],
    1930: ['bungalow', 'store', 'block', 'midrise', 'church', 'spire', 'clock'],
    2000: ['house', 'bungalow', 'walkup', 'tower', 'church', 'spire', 'clock'],
  }
  const lastYear = await ui('app.timeline.yearAt(app.timeline.max)')
  await check('settlements: the harbour in 1795 is kauhale, a few hundred hale with Kou’s own', async () => {
    await atHarbour(1795)
    const c = await census(1795, 25)
    const own = await ui('app.districts.cur.features.counts.hale')
    const odd = Object.keys(c.by).filter((k) => k !== 'kauhale')
    if (odd.length) throw new Error(`not kauhale in 1795: ${brief(c)}`)
    if (!(c.hale + own >= 150 && c.hale + own <= 1500)) throw new Error(`${c.hale} hale in ${c.by.kauhale} kauhale and ${own} at Kou`)
    const near = await census(1795)
    console.log(`      within 2.5 km: ${c.by.kauhale} kauhale of ${c.hale} hale, and Kou’s ${own}; within 1.5 km ${near.by.kauhale} of ${near.hale}`)
  })
  await check('settlements: a mixed town by 1853, with the church of 1842', async () => {
    await atHarbour(1853)
    const c = await census(1853)
    const all = await census(1853, Infinity)
    const st = await ui('app.districts.cur.features.settlements.stats()')
    if (!(c.total >= 150 && c.by.hale > 20 && (c.by.frame || 0) + (c.by.adobe || 0) > 20)) throw new Error(`within 1.5 km: ${brief(c)}`)
    if (!all.by.church || !st.landmarks.some((l) => /1842/.test(l))) throw new Error(`no church of 1842: ${st.landmarks}`)
    console.log(`      within 1.5 km: ${brief(c)}; landmarks ${st.landmarks.join(', ')}`)
  })
  await check('settlements: stores and masonry blocks by 1896, the town on a grid of streets', async () => {
    await atHarbour(1896)
    const c = await census(1896)
    const st = await ui('app.districts.cur.features.settlements.stats()')
    if (!((c.by.store || 0) + (c.by.block || 0) >= 30 && (c.by.cottage || 0) >= 50)) throw new Error(`within 1.5 km: ${brief(c)}`)
    const streets = st.streets.find((s) => s.startsWith('1900:'))
    if (!streets || +streets.split(':')[1].split('/')[0] < 100) throw new Error(`streets ${st.streets}`)
    console.log(`      within 1.5 km: ${brief(c)}; streets ${st.streets.join(' ')}`)
  })
  await check(`settlements: towers by ${lastYear}, their height following the density`, async () => {
    await atHarbour(lastYear)
    const all = await census(lastYear, Infinity)
    const c = await census(lastYear)
    const h = await ui(`(() => { const t = app.districts.cur.features.settlements.alive(${lastYear}).filter((a) => a.kind === 'tower').map((a) => a.height); return t.length ? [Math.min(...t), Math.max(...t)] : null })()`)
    if (!((all.by.tower || 0) >= 20 && h && h[1] > h[0] * 1.5)) throw new Error(`the district: ${brief(all)}; heights ${h}`)
    console.log(`      the district: ${brief(all)}; within 1.5 km: ${brief(c)}; towers ${h.map((v) => (v * 100).toFixed(0)).join(' to ')} m drawn`)
  })
  await check('settlements: every kind within its era’s, none before its turn', async () => {
    const wrong = []
    for (const [y, kinds] of Object.entries(ERA_KINDS)) {
      const year = Math.min(+y, lastYear)
      const all = await census(year, Infinity)
      for (const k of Object.keys(all.by)) if (!kinds.includes(k)) wrong.push(`${all.by[k]} ${k} in ${year}`)
    }
    // and no tower before 1960, no kauhale after 1850, at every decade
    for (let y = 1780; y <= lastYear; y += 10) {
      const all = await census(y, Infinity)
      if (y < 1960 && all.by.tower) wrong.push(`${all.by.tower} towers in ${y}`)
      if (y > 1850 && all.by.kauhale) wrong.push(`${all.by.kauhale} kauhale in ${y}`)
    }
    if (wrong.length) throw new Error(wrong.slice(0, 6).join('; '))
    const seq = []
    for (const y of [1795, 1830, 1853, 1870, 1896, 1930, 1960, lastYear]) seq.push(`${y}: ${Object.keys((await census(y, Infinity)).by).join('/')}`)
    console.log(`      ${seq.join(' · ')}`)
  })
  await check('settlements: none on a loʻi, a pond, the standing village or the water of its year', async () => {
    const out = []
    for (const y of [1795, 1853, 1896, 1930, lastYear]) {
      await atHarbour(y)
      const r = await ui(`(() => {
        const D = app.districts, rec = D.cur, d = rec.d, R = d.rect, S = rec.features.settlements
        const bad = []
        let n = 0
        for (const a of S.alive(${y})) {
          n++
          const ux = [Math.cos(a.a), -Math.sin(a.a)], uz = [Math.sin(a.a), Math.cos(a.a)]
          for (const [fu, fv] of [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]]) {
            const x = a.x + (ux[0] * fu * a.ax + uz[0] * fv * a.az) * 0.9
            const z = a.z + (ux[1] * fu * a.ax + uz[1] * fv * a.az) * 0.9
            const i = Math.min(d.W - 1, Math.max(0, Math.floor(((x - R.x0) / (R.x1 - R.x0)) * d.W)))
            const j = Math.min(d.H - 1, Math.max(0, Math.floor(((z - R.z0) / (R.z1 - R.z0)) * d.H)))
            const c = j * d.W + i
            const f = rec.aux[c * 4 + 3]
            const what = D.metresAt(x, z) < 0.2 ? 'water' : f > 0 && rec.aux[c * 4 + 1] > 0 && D.featK[f] > 0.5 ? D.cur.d.byIndex.get(f).properties.kind : null
            if (what) { bad.push(what + ' ' + a.kind + ' at ' + x.toFixed(2) + ',' + z.toFixed(2)); break }
          }
        }
        return { n, bad }
      })()`)
      if (r.bad.length) throw new Error(`${y}: ${r.bad.length} of ${r.n}: ${r.bad.slice(0, 4).join('; ')}`)
      out.push(`${y}: ${r.n}`)
    }
    console.log(`      buildings checked, footprint by footprint: ${out.join(', ')}`)
  })
  await check('settlements: within the budget, drawn and placed', async () => {
    const rows = []
    for (const y of [1795, 1896, lastYear]) {
      await atHarbour(y)
      const st = await ui('app.districts.cur.features.settlements.stats()')
      if (st.drawn > 8000 || st.placed > 8100) throw new Error(`${y}: ${st.placed} placed, ${st.drawn} drawn`)
      rows.push(`${y}: ${st.placed} placed, ${st.drawn} drawn, ${st.triangles} triangles`)
    }
    const st = await ui('app.districts.cur.features.settlements.stats()')
    console.log(`      ${rows.join(' · ')}; ${st.instances} instances over ${st.lots} lots, built in ${st.buildMs} ms (${JSON.stringify(st.times)}), ${st.cpuMB} MB`)
  })
  await check('settlements: what the town costs at the harbour, by year', async () => {
    const cdp = await page.context().newCDPSession(page)
    const heapMB = async () => {
      await cdp.send('HeapProfiler.collectGarbage')
      const { usedSize, backingStorageSize } = await cdp.send('Runtime.getHeapUsage')
      return { js: +(usedSize / 1048576).toFixed(1), buffers: backingStorageSize === undefined ? null : +(backingStorageSize / 1048576).toFixed(1) }
    }
    // (wall time over n of the app's frames, as the perf check below takes it)
    const wall = (n) =>
      page.evaluate(
        (n) =>
          new Promise((resolve) => {
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
    const out = {}
    for (const y of [1795, 1896, lastYear]) {
      await atHarbour(y)
      await frames(2)
      const ms = await wall(6)
      const heap = await heapMB()
      const calls = await ui('app.renderer.info.render.calls')
      await run('app.districts.cur.features.settlements.hidden = true')
      await frames(2)
      const without = await wall(6)
      await run('app.districts.cur.features.settlements.hidden = false')
      await frames(2)
      const st = await ui('app.districts.cur.features.settlements.stats()')
      out[y] = { ms, msWithout: without, calls, drawn: st.drawn, triangles: st.triangles, heapMB: heap }
    }
    console.log('      settlements perf', JSON.stringify(out))
  })
}
// ==== end settlements =========================================================

// Patches (DATA.md "Patches, on any pack"): each raises today's sea or sinks
// today's land to its reef flat in the years before its until, and not after,
// easing as the year crosses it; on the island packs and in a district, for
// the data's own patches and for the test masks tools/fake-data.mjs writes.
/** For each island patch, a point well inside its mask whose ground today it changes; and the same for the district's. */
const patchPoints = () =>
  ui(`(() => {
    const out = []
    for (const r of app.patches.recs) {
      const t = app.world.terrains.get(r.pack)
      const c = r.crop
      const others = app.patches.byPack.get(r.pack).filter((o) => o !== r)
      let best = null
      for (let j = 1; j < c.h - 1; j++) for (let i = 1; i < c.w - 1; i++) {
        if ([0, 1, -1, c.w, -c.w].some((o) => c.data[j * c.w + i + o] < 255)) continue
        const x = r.box[0] + ((i + 0.5) / c.w) * (r.box[2] - r.box[0])
        const z = r.box[1] + ((j + 0.5) / c.h) * (r.box[3] - r.box[1])
        // (where no other patch reaches, so the year's ground there is this one's alone)
        if (others.some((o) => app.patches.maskAt(o.crop, (x - o.box[0]) / (o.box[2] - o.box[0]), (z - o.box[1]) / (o.box[3] - o.box[1])) > 0)) continue
        const h = t.metresAt(x, z)
        const gap = r.kind === 'raise' ? r.depthM - h : h - r.depthM
        if (gap > 1.5 && (!best || gap > best.gap)) best = { x, z, h, gap }
      }
      if (best) out.push({ where: 'island', id: r.id, pack: r.pack, kind: r.kind, depth: r.depthM, until: r.until, others: [], ...best })
    }
    return out
  })()`)
const districtPatchPoints = () =>
  ui(`(() => {
    const D = app.districts, rec = D.cur, out = []
    if (!rec?.pmap) return out
    const d = rec.d, r = d.rect, pm = rec.pmap
    rec.raise.forEach((p, ri) => {
      let best = null
      for (let k = 0; k < pm.w * pm.h; k++) {
        if (pm.data[k * 4 + 1] !== 255 || pm.data[k * 4 + 3] !== 0 || (pm.data[k * 4 + 2] & 15) !== ri) continue
        const i = pm.x0 + (k % pm.w), j = pm.y0 + Math.floor(k / pm.w), c = j * d.W + i
        if (rec.aux[c * 4] || rec.aux[c * 4 + 3]) continue
        const h = rec.metres[c], gap = p.depth - h
        if (gap > 1 && (!best || gap > best.gap)) best = { i, j, h, gap }
      }
      if (best) out.push({ where: 'district', id: p.id, kind: 'raise', depth: p.depth, until: p.until, others: [], ...best })
    })
    rec.lower.forEach((p, li) => {
      let best = null
      for (let k = 0; k < pm.w * pm.h; k++) {
        const bits = pm.groups[pm.data[k * 4]] || 0
        if (!(bits & (1 << li))) continue
        // (where this patch is the last of its group to go, so after its until the ground is today's)
        if (rec.lower.some((o, oi) => bits & (1 << oi) && o.until > p.until)) continue
        const i = pm.x0 + (k % pm.w), j = pm.y0 + Math.floor(k / pm.w), c = j * d.W + i
        if (rec.aux[c * 4] !== 127 || rec.aux[c * 4 + 3] || pm.data[k * 4 + 1]) continue
        const h = rec.metres[c], gap = h - p.depth
        if (gap > 1.5 && (!best || gap > best.gap)) best = { i, j, h, gap, others: rec.lower.filter((o, oi) => bits & (1 << oi)).map((o) => o.depth) }
      }
      if (best) out.push({ where: 'district', id: p.id, kind: 'lower', depth: p.depth, until: p.until, ...best })
    })
    for (const q of out) {
      q.x = r.x0 + ((q.i + 0.5) * (r.x1 - r.x0)) / d.W
      q.z = r.z0 + ((q.j + 0.5) * (r.z1 - r.z0)) / d.H
    }
    return out
  })()`)
/** Each point before its patch's until and after it, the ground at it, and the weight easing across. */
const patchByYear = async (pts) => {
  const rows = []
  const [y0, y1] = await ui('[app.timeline.eras[0].year, app.timeline.eras.at(-1).year]')
  for (const p of pts) {
    if (p.until - 1 < y0 || p.until + 1 > y1) {
      rows.push(`${p.where} ${p.id}: its until, ${p.until}, is off the timeline (${y0}–${y1}); not tried`)
      continue
    }
    const at = async (y) => {
      await run(`app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(${y}); app.ui.timeline.finish(); app.rig.jump({ x: ${p.x}, z: ${p.z}, distance: 25, yaw: 0, pitch: 0.9 }); app.settle(); app.settle()`)
      if (p.where === 'district') {
        await page.waitForFunction(() => window.__app.districts.cur?.state === 'ready', null, { timeout: 300000 })
        await run('app.settle(); app.settle()')
        // (the district's own ground as the year lays it: near its edge the world's is eased into the island's)
        return ui(`app.districts.metresAt(${p.x}, ${p.z})`)
      }
      // (an island's own ground as its slot draws it, whether or not a district is down over it)
      return ui(`(() => { const t = app.world.terrains.get('${p.pack}'); return t.slot >= 0 ? app.world.ownMetres(t, ${p.x}, ${p.z}) : NaN })()`)
    }
    const before = await at(p.until - 1)
    const after = await at(p.until + 1)
    const depths = p.others?.length ? p.others : [p.depth]
    const okBefore = depths.some((d) => Math.abs(before - d) < 0.05)
    const okAfter = Math.abs(after - p.h) < 0.05
    rows.push(`${p.where} ${p.id} (${p.kind} to ${p.depth} m before ${p.until}): today ${p.h.toFixed(1)} m; ${before.toFixed(2)} m in ${p.until - 1}, ${after.toFixed(2)} m in ${p.until + 1}`)
    if (!okBefore || !okAfter) throw new Error(rows.at(-1))
  }
  return rows
}
const easesAcross = async (p) => {
  // the year crosses the until: a frame or two later the weight is on its way, not there
  await run(`app.timeline.setYear(${p.until - 1}); app.ui.timeline.finish(); app.settle()`)
  await run(`app.timeline.setYear(${p.until + 1}); app.ui.timeline.finish()`)
  await frames(2)
  const k = await ui(`(app.patches.recs.find((r) => r.id === '${p.id}') || app.districts.patchWeights().find((r) => r.id === '${p.id}'))?.k`)
  if (!(k > 0 && k < 1)) throw new Error(`${p.id}: two frames after the year crossed ${p.until}, its weight is ${k}`)
  return k
}
const patchCheck = async (label) => {
  const pts = await patchPoints()
  let dpts = []
  if (await ui('app.districts?.list.length ?? 0')) {
    const anyD = await ui('app.districts.list.some((d) => d.patches.length)')
    if (anyD) {
      // (down at the district, so its patches are laid on its grid)
      await run("app.ui.card.close(); app.ui.onScrub(); const d = app.districts.list.find((d) => d.patches.length); const r = d.rect; app.rig.jump({ x: (r.x0 + r.x1) / 2, z: r.z0 + (r.z1 - r.z0) * 0.62, distance: 30, yaw: 0, pitch: 0.9 }); app.settle()")
      await page.waitForFunction(() => window.__app.districts.cur?.state === 'ready', null, { timeout: 300000 })
      dpts = await districtPatchPoints()
    }
  }
  const listed = await ui('app.patches.all.length + (app.districts?.list || []).reduce((s, d) => s + d.patches.length, 0)')
  if (!pts.length && !dpts.length) throw new Error(`${label}: ${listed} patches listed, none with a point to try`)
  console.log(`      ${listed} patches listed; ${pts.length} on the islands and ${dpts.length} in the district have a point no other patch reaches, where they change the ground`)
  const rows = await patchByYear([...pts, ...dpts])
  const [y0, y1] = await ui('[app.timeline.eras[0].year, app.timeline.eras.at(-1).year]')
  const k = await easesAcross([...pts, ...dpts].find((p) => p.until - 1 >= y0 && p.until + 1 <= y1))
  for (const r of rows) console.log(`      ${r}`)
  console.log(`      two frames after the year crossed, the weight stood at ${k.toFixed(2)}`)
  const runs = await ui('app.patches.stats()')
  console.log(`      island masks in an atlas of ${runs.atlas ? runs.atlas.join('×') : 'none'} (${runs.kB} kB); patches in the slots ${runs.inSlots.join(' ')}`)
}
const ownPatches = await ui('app.patches.all.length + (app.districts?.list || []).reduce((s, d) => s + d.patches.length, 0)')
if (ownPatches) await check(`the data’s own patches raise and lower the ground by year (${ownPatches})`, () => patchCheck('the data’s own'))
else console.log('  - no patches in the data: its own patch check skipped')
const testBase = useTest ? null : '../test-data/real/'
if (testBase && existsSync(join(root, 'test-data/real/patches/manifest.json'))) {
  await check('the test masks raise and lower the ground by year, on Oʻahu and in Nuʻuanu', async () => {
    await page.evaluate((b) => window.__app.patches.load(b), testBase)
    try {
      await patchCheck('the test masks')
    } finally {
      // (back to the data's own)
      await page.evaluate(() => window.__app.patches.load())
    }
  })
} else if (testBase) console.log('  - no test masks (node tools/fake-data.mjs writes them): that check skipped')

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
