// Dev-only: boot the built app (dist/) in headless Chromium and drive it with
// real pointer and key input (the wheel from the whole chain down to a
// valley, drags, the year slider and its ticks, the layer toggles, the far
// view's switch between the chiefdoms and the land, the chapter tour's Next
// and Back and the view it picks, an event's stops, the pins and the clusters
// they gather into, and their cards) to catch anything that stops input
// reaching what's on screen, and any console error on the way; the whole
// chain framed corner to corner on a wide screen and on a phone, the routes
// following the story (a chapter's card, an event's step, off the tour) and
// the toggle that shows them all; the chapter
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

/**
 * Where the whole chain lands in the free part of the screen (the box the
 * tour frames into: below the title, above the timeline, beside or above
 * the card): Niʻihau's and Hawaiʻi Island's middles (the mean of their land)
 * as fractions of the box, how far the chain's long axis lies off the box's
 * diagonal, how much of the diagonal the land spans, and any island whose
 * middle is off the screen or under the card, the legend, the timeline, the
 * tools or the title.
 */
const chainFrame = () =>
  ui(`(() => {
    const box = app.ui.freeBox(), cam = app.camera, W = innerWidth, H = innerHeight
    const V = cam.position.constructor
    const at = ([x, z]) => { const v = new V(x, 0, z).project(cam); return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H] }
    const middle = (p) => {
      const r = p.rect
      let sx = 0, sz = 0, n = 0
      for (let j = 0; j <= 40; j++) for (let i = 0; i <= 40; i++) {
        const x = r.x0 + ((r.x1 - r.x0) * i) / 40, z = r.z0 + ((r.z1 - r.z0) * j) / 40
        if (app.world.arch.metresAt(x, z) > 0) { sx += x; sz += z; n++ }
      }
      return [sx / n, sz / n]
    }
    const packs = app.world.islandPacks
    const cx = (p) => (p.rect.x0 + p.rect.x1) / 2
    const ni = packs.find((p) => p.id === 'niihau') || packs.reduce((a, b) => (cx(b) < cx(a) ? b : a))
    const ha = packs.find((p) => p.id === 'hawaii') || packs.reduce((a, b) => (cx(b) > cx(a) ? b : a))
    const bw = box.x1 - box.x0, bh = box.y1 - box.y0, L = Math.hypot(bw, bh)
    const rel = ([x, y]) => [+((x - box.x0) / bw).toFixed(2), +((y - box.y0) / bh).toFixed(2)]
    const c = app.world.chainShape()
    const a = at(c.from), b = at(c.to)
    const off = ((Math.atan2(b[1] - a[1], b[0] - a[0]) - Math.atan2(bh, bw)) * 180) / Math.PI
    const along = c.hull.map((p) => { const [x, y] = at(p); return (x * bw + y * bh) / L })
    const panels = [...document.querySelectorAll('.card.show, .legend.show, .timeline, .tools, .brand')].map((el) => el.getBoundingClientRect())
    const hidden = packs.filter((p) => {
      const [x, y] = at(middle(p))
      return x < 0 || y < 0 || x > W || y > H || panels.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
    }).map((p) => p.id)
    return { ni: rel(at(middle(ni))), niPx: at(middle(ni)).map(Math.round), ha: rel(at(middle(ha))), haPx: at(middle(ha)).map(Math.round), off: +off.toFixed(2), fill: +((Math.max(...along) - Math.min(...along)) / L).toFixed(3), hidden, yaw: +app.rig.goal.yaw.toFixed(3), d: Math.round(app.rig.goal.distance), pitch: +app.rig.goal.pitch.toFixed(2), box: [box.x0, box.y0, box.x1, box.y1].map(Math.round) }
  })()`)
if (eras > 0) {
  for (const [w, h] of [
    [1280, 800],
    [390, 844],
  ]) {
    await check(`the whole chain runs corner to corner at ${w} × ${h}: Niʻihau at the top left, Hawaiʻi at the bottom right`, async () => {
      await page.setViewportSize({ width: w, height: h })
      await frames(2)
      const rows = []
      for (const card of [true, false]) {
        // the opening view, beside (or above) the chapter's card; then home with no card
        if (card) await run('app.tour.goTo(0, -1); app.settle()')
        else {
          await run('app.ui.card.close()')
          await page.click('.tools [data-tool="home"]', opts)
          await run('app.rig.finishFlight(); app.settle()')
        }
        await frames(2)
        const f = await chainFrame()
        const where = card ? 'with the card' : 'with no card'
        if (Math.abs(f.off) > 3) throw new Error(`${where}: the chain’s axis is ${f.off}° off the diagonal`)
        if (!(f.ni[0] < 0.3 && f.ni[1] < 0.3)) throw new Error(`${where}: Niʻihau at ${f.ni} of the box ${f.box}`)
        if (!(f.ha[0] > 0.65 && f.ha[1] > 0.6)) throw new Error(`${where}: Hawaiʻi at ${f.ha} of the box ${f.box}`)
        if (!(f.fill >= 0.7)) throw new Error(`${where}: the land spans ${f.fill} of the diagonal`)
        if (f.hidden.length) throw new Error(`${where}: ${f.hidden.join(', ')} under the interface or off the screen`)
        rows.push(`${where}: yaw ${f.yaw}, distance ${f.d}, pitch ${f.pitch}; box ${f.box}; Niʻihau at ${f.niPx} (${f.ni}), Hawaiʻi at ${f.haPx} (${f.ha}); ${(f.fill * 100).toFixed(0)}% of the diagonal, ${f.off}° off it`)
      }
      for (const r of rows) console.log(`      ${r}`)
    })
    // a far step leans the chain toward its place: the same turn, only nearer
    const farStep = await ui(`(() => {
      for (const ch of app.tour.chapters) for (const ev of ch.events) {
        const p = app.tour.placeOf(ev)
        if (p && p.island && JSON.stringify(ev.zoom) === '["far"]') return ev.id
      }
      return null
    })()`)
    if (farStep) {
      await check(`a far step keeps the whole chain’s turn at ${w} × ${h}, only nearer, its place in view (${farStep})`, async () => {
        await run(`const at = app.tour.locate(app.data.events.find((e) => e.id === '${farStep}')); app.tour.goTo(at[0], at[1]); app.settle()`)
        await frames(2)
        const r = await ui(`(() => {
          const box = app.ui.freeBox(), chain = app.tour.chainView(box), g = app.rig.goal
          const it = app.ui.pins.items.find((it) => it.ev.id === '${farStep}')
          const v = new app.camera.position.constructor(it.x, app.world.heightAt(it.x, it.z), it.z).project(app.camera)
          const x = ((v.x + 1) / 2) * innerWidth, y = ((1 - v.y) / 2) * innerHeight
          return { yaw: +g.yaw.toFixed(3), chainYaw: +chain.yaw.toFixed(3), d: Math.round(g.distance), chainD: Math.round(chain.distance), at: [Math.round(x), Math.round(y)], inBox: x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1 }
        })()`)
        if (Math.abs(r.yaw - r.chainYaw) > 0.01) throw new Error(`yaw ${r.yaw}, the whole chain's ${r.chainYaw}`)
        if (!(r.d < r.chainD)) throw new Error(`at ${r.d}, no nearer than the whole chain's ${r.chainD}`)
        if (!r.inBox) throw new Error(`its place at ${r.at}, outside the free box`)
        console.log(`      yaw ${r.yaw} (the chain's ${r.chainYaw}), distance ${r.d} (the chain's ${r.chainD}), its place at ${r.at}`)
      })
    }
  }
  await page.setViewportSize({ width: 1280, height: 800 })
  await frames(2)
  await run('app.tour.goTo(0, -1); app.settle()')
}
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
    try {
      await page.click(`.tools [data-tool="${t}"]`, opts)
      await expect(`app.overlay.${t}`, !was)
      await page.click(`.tools [data-tool="${t}"]`, opts)
      await expect(`app.overlay.${t}`, was)
    } finally {
      // (a click that timed out under load leaves the layer as it was, so
      // the checks after this one aren't run with it switched off)
      if ((await ui(`app.overlay.${t}`)) !== was) await page.evaluate((t) => document.querySelector(`.tools [data-tool="${t}"]`).click(), t)
    }
  })
}

const routeCount = await ui('app.routes.lines.length')
/** Fly the camera to a view (an expression for one) and land everything. */
const view = (expr) => run(`const v = ${expr}; app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()`)
const shownRoutes = () => ui('app.routes.visibleRoutes().map((r) => r.id).sort()')
/** The routes the data gives these events: each one's own list, and the routes that name it. */
const routesOf = (ids) =>
  ui(`(() => {
    const ids = new Set(${JSON.stringify(ids)})
    const own = new Set(app.data.events.filter((e) => ids.has(e.id)).flatMap((e) => e.routes || []))
    return app.routes.lines.map((l) => l.route).filter((r) => own.has(r.id) || ids.has(r.event)).map((r) => r.id).sort()
  })()`)
/** Every route whose dates meet the timeline's window: what the toggle, turned on, shows. */
const routesOfYear = () => ui('(() => { const [a, b] = app.timeline.window; return app.routes.lines.filter((l) => l.span[1] >= a && l.span[0] <= b).map((l) => l.route.id).sort() })()')
const listed = (a) => a.join(', ') || 'none'
const sameList = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const goEvent = (id) => run(`const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1]); app.settle()`)
/** Take the slider to timeline position s as a hand would, which leaves the tour. */
const dragSlider = async (s) => {
  const box = await page.locator('.tl-input').boundingBox()
  const [now, max] = await ui('[app.timeline.s, app.timeline.max]')
  const x = (v) => box.x + 8 + ((box.width - 16) * v) / max
  await page.mouse.move(x(now), box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(x(s), box.y + box.height / 2, { steps: 6 })
  await page.mouse.up()
  await run('app.settle()')
  await frames(2)
}
/** The routes toggle, pressed as the viewer would until it reads `on`. */
const routesToggle = async (on) => {
  if ((await ui('app.overlay.routes')) !== on) await page.click('.tools [data-tool="routes"]', opts)
  await expect('app.overlay.routes', on)
  await expect(`document.querySelector('.tools [data-tool="routes"]').getAttribute('aria-pressed')`, String(on))
  await run('app.settle()')
  await frames(2)
}
/** The first event in the tour with routes of its own that also passes `test` (a body over `ev`). */
const firstWithRoutes = (test) =>
  ui(`(() => {
    for (const ch of app.tour.chapters) for (const ev of ch.events) {
      if ((ev.routes?.length || app.routes.lines.some((l) => l.route.event === ev.id)) && (${test})) return ev.id
    }
    return null
  })()`)
if (routeCount && chapters) {
  await check('the routes toggle starts off: the routes follow the story', async () => {
    await expect('app.overlay.routes', false)
    await expect(`document.querySelector('.tools [data-tool="routes"]').getAttribute('aria-pressed')`, 'false')
  })
  await check('a chapter’s card draws no routes: a path belongs to its step', async () => {
    await routesToggle(false)
    await run('app.tour.goTo(0, -1); app.settle()')
    await frames(2)
    const got = await shownRoutes()
    if (got.length) throw new Error(`chapter 1’s card shows ${listed(got)}`)
    const could = await routesOf(await ui('app.tour.chapters[0].events.map((e) => e.id)'))
    console.log(`      chapter 1: none shown (its events carry ${could.length})`)
  })
  const stepEv = (await ui("app.data.events.some((e) => e.id === 'paao') ? 'paao' : null")) || (await firstWithRoutes("ev.zoom?.includes('island') && !ev.stops?.length"))
  if (stepEv) {
    await check(`an event’s step draws its own routes and no others (${stepEv}), held as its island fills the screen`, async () => {
      await goEvent(stepEv)
      await frames(2)
      const want = await routesOf([stepEv])
      const got = await shownRoutes()
      const [d, fill] = await ui('[app.rig.state.distance, app.islandFill()]')
      if (!sameList(got, want)) throw new Error(`the step shows ${listed(got)}, wanted ${listed(want)} (at ${d.toFixed(0)}, fill ${fill.toFixed(2)})`)
      console.log(`      ${stepEv}: ${listed(got)} at ${d.toFixed(0)} (fill ${fill.toFixed(2)})`)
    })
  }
  if (await ui("app.data.events.some((e) => e.id === 'mokuohai-1782')")) {
    await check('the Mokuʻōhai step: no route of its own, and its island fills the screen: none', async () => {
      await goEvent('mokuohai-1782')
      await frames(2)
      const own = await routesOf(['mokuohai-1782'])
      const got = await shownRoutes()
      const [d, fill] = await ui('[app.rig.state.distance, app.islandFill()]')
      if (got.length) throw new Error(`showing ${listed(got)} (at ${d.toFixed(0)}, fill ${fill.toFixed(2)})`)
      console.log(`      at ${d.toFixed(0)} (fill ${fill.toFixed(2)}); its own: ${listed(own)}; showing none`)
    })
  }
  const farEv = (await ui("app.data.events.some((e) => e.id === 'kaieiewaho-1796') ? 'kaieiewaho-1796' : null")) || (await firstWithRoutes("JSON.stringify(ev.zoom) === '[\"far\"]'"))
  if (farEv) {
    await check(`off the tour, the open card’s event keeps its routes (${farEv}); closed, none`, async () => {
      await goEvent(farEv)
      await frames(2)
      const want = await routesOf([farEv])
      await dragSlider((await ui('app.timeline.s')) + 0.3)
      await expect('app.tour.active', false)
      await expect('app.ui.card.mode', 'event')
      const got = await shownRoutes()
      if (!sameList(got, want)) throw new Error(`with its card open: ${listed(got)}, wanted ${listed(want)}`)
      await page.click('.card.show .card-close', opts)
      await run('app.settle()')
      await frames(2)
      const closed = await shownRoutes()
      if (closed.length) throw new Error(`with the card closed: ${listed(closed)}`)
      console.log(`      its card open: ${listed(got)}; closed: none`)
    })
  }
  await check('the slider taken with no card open: no routes, though the year has some', async () => {
    await run('app.ui.card.close()')
    await view('app.tour.chainView()')
    // (to contact: Cook's ships and the fleets of the 1770s)
    await dragSlider(await ui('app.timeline.sAtYear(1779.1)'))
    await expect('app.tour.active', false)
    await expect('app.ui.card.isOpen', false)
    const got = await shownRoutes()
    const year = await routesOfYear()
    if (got.length) throw new Error(`showing ${listed(got)}`)
    if (!year.length) throw new Error('no route in the year’s window to leave out')
    console.log(`      at ${(await ui('app.timeline.year')).toFixed(1)}: none of the ${year.length} of these years`)
  })
  await check('the routes toggle is the override: every route of the year, gone where one island fills the screen, then the story again', async () => {
    await routesToggle(true)
    const want = await routesOfYear()
    const got = await shownRoutes()
    if (!sameList(got, want)) throw new Error(`with the toggle on: ${listed(got)}, wanted ${listed(want)}`)
    const isl = await ui("app.tour.islands.has('hawaii') ? 'hawaii' : [...app.tour.islands.keys()][0]")
    await view(`app.tour.islandView('${isl}', 0)`)
    await frames(2)
    const [d, fill] = await ui('[app.rig.state.distance, app.islandFill()]')
    const over = await shownRoutes()
    if (over.length) throw new Error(`over ${isl} at ${d.toFixed(0)} (fill ${fill.toFixed(2)}): ${listed(over)}`)
    await routesToggle(false)
    await view('app.tour.chainView()')
    const off = await shownRoutes()
    if (off.length) throw new Error(`with the toggle off again: ${listed(off)}`)
    console.log(`      on, over the chain at ${(await ui('app.timeline.year')).toFixed(1)}: ${listed(got)}`)
    console.log(`      on, over ${isl} (fill ${fill.toFixed(2)}): none; off again: none`)
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
      7: ['The run up the valley', 'The pursuit up the valley', 'Over the ridge into Kalihi', 'Up the eastern side of the valley', 'Down the old path to Koʻolau'],
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
            const st = app.tour.event.stops[${i}]
            const g = app.tour.places.get(st.place).geometry
            if (g.type !== 'Point') return [0, 0]
            // (or what its camera centres instead, the place then low in the frame: DATA.md "District packs") [ui6]
            const [x, z] = app.data.proj.toWorld(st.camera?.target || g.coordinates)
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
        // at the edge of the pali, within 300 m of the gap, only the forces the data puts there: the stand, the surround and the leap
        await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)))
        await frames(2)
        const [atEdge, theirs] = await ui(`(() => {
          const F = app.districts.cur.features.forces
          const [gx, gz] = app.data.proj.toWorld([-157.7933, 21.3668])
          const n = [0, 0]
          for (const r of F.forces) {
            if (r.file) continue
            const own = /^(stand|surround|leap)$/.test(r.behaviour) ? 1 : 0
            for (let i = 0; i < r.n; i++) { const k = (r.o + i) * 4; if (F.marks[k + 2] > 0.05 && Math.hypot(F.marks[k] - gx, F.marks[k + 1] - gz) < 3) n[own]++ }
          }
          return n
        })()`)
        if (atEdge || !theirs) throw new Error(`within 300 m of the gap: ${atEdge} marks of other forces, ${theirs} of the stand, the surround and the leap`)
        console.log(`      at the edge of the pali: ${theirs} of the stand, the surround and the leap, nobody else`)
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
  // forces, of their own sides; all of them at one scale from the camera's
  // distance, a whole number of device pixels to the sprite pixel, crisp on the
  // screen (every k by k block of a figure one colour, its outline where the
  // sheet puts it), and across a change of scale dissolving from one size to
  // the next, never popping; each facing the way it moves or aims as the
  // camera sees it; carrying what the data's `arms` say; doing what each
  // `behaviour` says: the two sides fighting in turn at the fronts, muskets and
  // slings, the guns served; the run up the valley with the pursuit behind;
  // the arc round the last stand and the leap from the pali; nobody under the
  // ground or in the water; off the tour, fewer, and nobody fighting or going
  // over; and what they cost at Puʻiwa.
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
    const stopOf = (place) => ui(`app.data.events.find((e) => e.id === 'nuuanu-1795').stops.findIndex((s) => s.place === '${place}')`)
    /** The figures drawn now, each with its force's side and its own, where it stands, and its ground. */
    const drawn = () =>
      ui(`(() => {
        const S = ${SS}, f = S.f, out = []
        S.recs.forEach((r, ri) => { for (let i = r.o; i < r.o + r.n; i++) if (f.vis[i] > 0) out.push({ i, name: r.p.name, recSide: r.side, side: ['hawaii', 'oahu', 'maui'][f.side[i]], x: f.x[i], z: f.z[i], gm: f.gm[i], now: app.world.metresAt(f.x[i], f.z[i]), air: f.air[i], k: f.k[i], fr: f.fr[i], mode: f.mode[i] }) })
        return out
      })()`)
    // (the facing rule, as the page applies it: across the screen, and away from the eye; held within HOLD)
    const facingRule = `const V = S.view, HOLD = 1.25
      const want = (hx, hz) => { const a = hx * V.rx + hz * V.rz, b = hx * V.ax + hz * V.az; if (Math.abs(b) > HOLD * Math.abs(a)) return b > 0 ? 3 : 2; if (Math.abs(a) > HOLD * Math.abs(b)) return a > 0 ? 0 : 1; return -1 }`
    for (const [id, at] of [['nuuanu-1795', ev95], ['kaheiki-1783', ev83]]) {
      if (!at) continue
      await check(`${id}: at each stop the people of its forces, of their own sides, doing what the data says, on dry ground`, async () => {
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
          // (a leap is one figure after another: a few seconds on for the next if nobody is on the way now)
          await ui(`(() => { const F = ${SF}, S = F.soldiers, f = S.f; const r = S.recs.find((r) => r.behaviour === 'leap' && r.w > 0.5); if (!r) return; for (let k = 0; k < 60; k++) { for (let i = r.o; i < r.o + r.n; i++) if (f.vis[i] > 0) return; F.update(0.1, app.districts.k, app.rig.state.distance) } })()`)
          const figs = await drawn()
          const names = [...st.forces, ...st.lines]
          for (const name of names) if (!figs.some((g) => g.name === name)) throw new Error(`stop ${i + 1}: nobody of “${name}” drawn`)
          const stray = figs.find((g) => !names.includes(g.name))
          if (stray) throw new Error(`stop ${i + 1}: a figure of “${stray.name}”, not of this stop`)
          const turned = figs.find((g) => g.side !== g.recSide)
          if (turned) throw new Error(`stop ${i + 1}: a ${turned.side} figure in “${turned.name}” (${turned.recSide})`)
          // feet on the ground of the year (as last looked up, a few metres back at most), never in the water
          const ground = figs.filter((g) => !g.air)
          const off = ground.reduce((m, g) => Math.max(m, Math.abs(g.gm - g.now)), 0)
          const wet = ground.filter((g) => g.now < 0.15)
          if (off > 1.5) throw new Error(`stop ${i + 1}: a figure's feet ${off.toFixed(2)} m off the ground`)
          if (wet.length) throw new Error(`stop ${i + 1}: ${wet.length} figures in the water (${wet[0].name})`)
          // what each force does: its behaviour and what its people are drawn doing
          const doing = await ui(`(() => {
            const S = ${SS}, f = S.f, M = S.constructor.MODE, out = {}
            for (const r of S.recs) {
              if (!(r.w > 0.5)) continue
              const modes = new Set()
              for (let i = r.o; i < r.o + r.n; i++) if (f.vis[i] > 0) modes.add(Object.keys(M).find((k) => M[k] === f.mode[i]))
              out[r.p.name] = { behaviour: r.behaviour, data: r.p.behaviour ?? null, line: !!r.line, modes: [...modes].sort() }
            }
            return out
          })()`)
          const want = { march: ['file'], run: ['file'], stand: ['knot'], engage: ['rank'], surround: ['ring', 'file'], leap: [] }
          for (const [name, d] of Object.entries(doing)) {
            if (d.data && d.data !== d.behaviour) throw new Error(`stop ${i + 1}: “${name}” is drawn as ${d.behaviour}, the data says ${d.data}`)
            // (a front, whatever it does, stands in ranks; a force as its behaviour)
            const need = d.line ? ['rank'] : want[d.behaviour] || []
            const missing = need.filter((m) => !d.modes.includes(m))
            if (missing.length) throw new Error(`stop ${i + 1}: “${name}” (${d.behaviour}) has nobody ${missing.join(', ')}: ${d.modes.join(', ')}`)
          }
          const sides = {}
          for (const g of figs) sides[g.side] = (sides[g.side] || 0) + 1
          const ks = [...new Set(figs.map((g) => g.k))].sort()
          rows.push(`${i + 1} ${stop.place}: ${figs.length} figures (${Object.entries(sides).map(([s, c]) => `${s} ${c}`).join(', ')}), k ${ks.join('/')}, feet within ${off.toFixed(2)} m; ${Object.values(doing).map((d) => d.behaviour).join(', ')}`)
        }
        for (const r of rows) console.log(`      ${r}`)
      })
    }
    if (ev95) {
      await check('one scale for every figure from the camera’s distance: whole device pixels, crisp on the screen', async () => {
        await gotoStop(ev95, await stopOf('puiwa'))
        const t = await ui('[app.rig.state.target.x, app.rig.state.target.z, app.rig.state.yaw, app.rig.state.pitch]')
        const rows = []
        for (const d of [8, 10, 13, 16, 24, 40, 60]) {
          await run(`app.rig.jump({ x: ${t[0]}, z: ${t[1]}, distance: ${d}, yaw: ${t[2]}, pitch: ${t[3]} }); app.settle(); app.settle()`)
          await frames(1)
          const r = await ui(`(() => {
            const S = ${SS}, f = S.f
            const out = { n: 0, ks: {}, dpr: S.dpr, k: S.scaleAt(), t: S.scale.t, want: S.scale.s }
            for (let i = 0; i < S.count; i++) {
              if (f.vis[i] <= 0) continue
              out.n++
              out.ks[f.k[i]] = (out.ks[f.k[i]] || 0) + 1
            }
            return out
          })()`)
          const ks = Object.keys(r.ks).map(Number)
          if (ks.length !== 1 || ks[0] !== r.k) throw new Error(`at ${d}: figures at ${JSON.stringify(r.ks)}, the scale ${r.k}`)
          if (!Number.isInteger(r.k) || r.k < 2 || r.k > Math.round(4 * r.dpr) || Math.abs(r.k - r.want) >= 1) throw new Error(`at ${d}: k ${r.k} for a wanted ${r.want.toFixed(2)}`)
          if (r.t !== 0 && r.t !== 1) throw new Error(`at ${d}: settled half way through a crossfade (${r.t})`)
          if (!r.n) throw new Error(`at ${d}: nobody drawn`)
          rows.push(`${d}: ${r.n} figures at ${r.k} px (${(16 * r.k) / r.dpr} px tall; ${r.want.toFixed(2)} wanted)`)
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
                if (r && r.vis >= 1 && r.solid) rects.push([i, r])
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
      await check('a zoom across every change of scale: the figures dissolve from one size to the next, never popping, never both solid', async () => {
        await gotoStop(ev95, await stopOf('puiwa'))
        const t = await ui('[app.rig.state.target.x, app.rig.state.target.z, app.rig.state.yaw, app.rig.state.pitch]')
        // in and out between 18 and 7 (world units), a third of a per cent a frame, at 60 frames a second
        const r = await ui(`(() => {
          const F = ${SF}, S = F.soldiers, f = S.f
          const dists = []
          for (let d = 18; d > 7; d *= 0.9967) dists.push(d)
          for (let d = 7; d < 18; d /= 0.9967) dists.push(d)
          let last = null, worst = 0, worstAt = 0, pops = 0, crossings = 0, both = 0, bothBad = 0, mixed = 0, lastK = null, maxStep = 0
          const seen = []
          for (const d of dists) {
            app.rig.jump({ x: ${t[0]}, z: ${t[1]}, distance: d, yaw: ${t[2]}, pitch: ${t[3]} })
            F.update(1 / 60, app.districts.k, d)
            const k = S.scale.k, tt = S.scale.t
            // (the height a figure shows: its sprite pixels shared between the two sizes by the dither)
            const h = 16 * (k + tt)
            // every figure drawn at the one scale; while a crossfade runs, two copies whose parts of the dither
            // are [t, 1) at k and [0, t) at k + 1, so between them every sprite pixel is drawn once
            const mix = S.aMix.array, draw = S.aDraw.array
            let solidK = 0
            for (let j = 0; j < S.instances; j++) {
              const lo = mix[j * 4], hi = mix[j * 4 + 1], kk = draw[j * 4]
              if (lo === 0 && hi === 1) solidK++
              if (!((kk === k && hi === 1 && Math.abs(lo - tt) < 1e-6) || (kk === k + 1 && lo === 0 && Math.abs(hi - tt) < 1e-6) || (lo === 0 && hi === 1 && (kk === k || kk === k + 1)))) bothBad++
            }
            if (tt > 0 && tt < 1) {
              mixed++
              if (S.instances < 2 * S.drawn * 0.99 && tt > 1 / 32 && tt < 31 / 32) both++
              if (solidK) bothBad++
            }
            const ks = new Set()
            for (let i = 0; i < S.count; i++) if (f.vis[i] > 0) ks.add(f.k[i])
            if (ks.size > 1) pops++
            if (last !== null) {
              const step = Math.abs(h - last)
              maxStep = Math.max(maxStep, step)
              if (step > worst) { worst = step; worstAt = d }
            }
            if (lastK !== null && S.scaleAt() !== lastK) crossings++
            seen.push([+d.toFixed(2), k, +tt.toFixed(3)])
            last = h
            lastK = S.scaleAt()
          }
          return { frames: dists.length, worst, worstAt, pops, crossings, mixed, both, bothBad, maxStep }
        })()`)
        console.log(`      ${r.frames} frames in and out between 18 and 7: the drawn height moved at most ${r.worst.toFixed(2)} px a frame (a dither step is 1 px), across ${r.crossings} changes of size, ${r.mixed} frames crossfading`)
        for (const dpr of [1, 2]) {
          const bands = await ui(`${SS}.scaleBands(${dpr})`)
          console.log(`      at ${dpr}x: ${bands.map((b) => `${b.k}→${b.k + 1} coming in over ${b.in[0]}–${b.in[1]}, back over ${b.out[0]}–${b.out[1]}`).join('; ')} (world units of camera distance)`)
        }
        if (r.worst > 1.0001) throw new Error(`a figure's height jumped ${r.worst.toFixed(2)} px in a frame at ${r.worstAt.toFixed(2)}`)
        if (r.pops) throw new Error(`${r.pops} frames with figures at two scales outside a crossfade`)
        if (r.crossings < 2 || r.mixed < 10) throw new Error(`the zoom crossed ${r.crossings} changes of scale, ${r.mixed} frames crossfading`)
        if (r.bothBad) throw new Error(`${r.bothBad} instances whose dither parts are not the two halves of the crossfade`)
        if (r.both) throw new Error(`${r.both} crossfading frames without both copies`)
        // and settled: at rest, a crossfade left half done finishes toward the nearer size
        const rest = await ui(`(() => {
          const F = ${SF}, S = F.soldiers
          const want = S.scale
          // (a distance in the middle of a band, approached from far, then left alone for a second)
          let d = 18
          for (; d > 7; d *= 0.997) { app.rig.jump({ x: ${t[0]}, z: ${t[1]}, distance: d, yaw: ${t[2]}, pitch: ${t[3]} }); F.update(1 / 60, app.districts.k, d); if (want.t > 0.3 && want.t < 0.7) break }
          const mid = want.t
          for (let k = 0; k < 60; k++) F.update(1 / 60, app.districts.k, d)
          return { d, mid, after: want.t }
        })()`)
        if (!(rest.after === 0 || rest.after === 1)) throw new Error(`left at ${rest.d.toFixed(2)} half through a crossfade (${rest.mid.toFixed(2)}), a second later still ${rest.after}`)
        console.log(`      left at ${rest.d.toFixed(2)} ${(rest.mid * 100).toFixed(0)}% through a crossfade, a second later whole at the ${rest.after ? 'larger' : 'smaller'} size`)
      })
      await check('facings: as the camera sees each figure’s way; at Puʻiwa the guns fire up the valley, Kamehameha’s line from behind, the Oʻahu line facing the eye', async () => {
        await gotoStop(ev95, await stopOf('puiwa'))
        const r = await ui(`(() => {
          const S = ${SS}, f = S.f, M = S.constructor.MODE
          ${facingRule}
          const out = { pieces: [], hawaii: [0, 0], oahu: [0, 0], wrong: 0, checked: 0, faces: {} }
          for (let i = 0; i < S.count; i++) {
            if (f.vis[i] <= 0) continue
            const m = f.mode[i]
            if (m === M.piece) out.pieces.push(f.face[i])
            if (m === M.crew) continue
            const w = want(f.hx[i], f.hz[i])
            if (w >= 0) {
              out.checked++
              if (w !== f.face[i]) out.wrong++
            }
            out.faces[f.face[i]] = (out.faces[f.face[i]] || 0) + 1
            if (m === M.rank || m === M.duel) {
              const side = f.side[i] === 0 ? 'hawaii' : 'oahu'
              out[side][0]++
              if (f.face[i] === (side === 'hawaii' ? 3 : 2)) out[side][1]++
            }
          }
          return out
        })()`)
        if (r.pieces.length !== 2 || r.pieces.some((v) => v !== 3)) throw new Error(`the guns at Puʻiwa face ${JSON.stringify(r.pieces)} (3 is away from the eye)`)
        if (r.wrong) throw new Error(`${r.wrong} of ${r.checked} figures facing other than the way they move or aim`)
        // 0.85, not more: a figure keeps its facing until the other wins by a clear margin, so a few stay side-on
        if (r.hawaii[1] < r.hawaii[0] * 0.85 || r.oahu[1] < r.oahu[0] * 0.85) throw new Error(`Kamehameha's line from behind ${r.hawaii[1]} of ${r.hawaii[0]}, the Oʻahu line facing the eye ${r.oahu[1]} of ${r.oahu[0]}`)
        console.log(`      the two guns from behind, firing up the valley; Kamehameha's line from behind ${r.hawaii[1]} of ${r.hawaii[0]}, the Oʻahu line facing the eye ${r.oahu[1]} of ${r.oahu[0]}; all ${r.checked} with a clear way facing it (right ${r.faces[0] || 0}, left ${r.faces[1] || 0}, front ${r.faces[2] || 0}, back ${r.faces[3] || 0})`)
        // and from the other side of the front: the camera turned round, the sides change places
        const t = await ui('[app.rig.state.target.x, app.rig.state.target.z, app.rig.state.distance, app.rig.state.yaw, app.rig.state.pitch]')
        await run(`app.rig.jump({ x: ${t[0]}, z: ${t[1]}, distance: ${t[2]}, yaw: ${t[3] + Math.PI}, pitch: ${t[4]} }); app.settle(); app.settle()`)
        await frames(1)
        const back = await ui(`(() => { const S = ${SS}, f = S.f, M = S.constructor.MODE; const p = []; for (let i = 0; i < S.count; i++) if (f.vis[i] > 0 && f.mode[i] === M.piece) p.push(f.face[i]); return p })()`)
        if (back.some((v) => v !== 2)) throw new Error(`seen from up the valley the guns face ${JSON.stringify(back)} (2 is toward the eye)`)
        console.log('      seen from up the valley, the guns face the eye, muzzle and flash')
      })
      await check('arms by the data: each force’s shares within one, and exactly its cannon', async () => {
        await gotoStop(ev95, await stopOf('puiwa'))
        const r = await ui(`(() => {
          const S = ${SS}, f = S.f, M = S.constructor.MODE, KD = S.constructor.KIND
          const out = []
          for (const r of S.recs) {
            const a = r.p.arms
            if (!a) continue
            const counts = { spear: 0, club: 0, sling: 0, dagger: 0, musket: 0 }
            let people = 0, pieces = 0, chiefs = 0
            for (let i = r.o; i < r.o + r.n; i++) {
              if (f.mode[i] === M.piece) { pieces++; continue }
              if (f.mode[i] === M.crew) continue
              people++
              const k = Object.keys(KD).find((k) => KD[k] === f.kind[i])
              counts[k]++
              if (f.dress[i] === 2) chiefs++
            }
            const sum = ['spear', 'club', 'sling', 'dagger', 'musket'].reduce((s, k) => s + (a[k] || 0), 0)
            const off = ['spear', 'club', 'sling', 'dagger', 'musket'].map((k) => [k, counts[k], ((a[k] || 0) / sum) * people]).filter(([, c, w]) => Math.abs(c - w) >= 1)
            out.push({ name: r.p.name, event: r.p.event, people, counts, cannon: a.cannon || 0, pieces, chiefs, off })
          }
          return out
        })()`)
        for (const x of r) {
          if (x.off.length) throw new Error(`“${x.name}”: ${x.off.map(([k, c, w]) => `${k} ${c} for ${w.toFixed(1)}`).join(', ')}`)
          if (x.pieces !== x.cannon) throw new Error(`“${x.name}”: ${x.pieces} pieces for ${x.cannon} cannon`)
          if (x.event === 'kaheiki-1783' && x.counts.musket) throw new Error(`“${x.name}”: muskets in 1783`)
        }
        for (const x of r) console.log(`      ${x.name}: ${x.people} people, spear ${x.counts.spear} club ${x.counts.club} sling ${x.counts.sling} dagger ${x.counts.dagger} musket ${x.counts.musket}, ${x.pieces} cannon, ${x.chiefs} chiefs`)
      })
      await check('at the fronts the two sides strike in turn, muskets fire, slings whirl and let go, the guns are served, and nobody is lost', async () => {
        const rows = []
        for (const place of ['puiwa', 'laimi']) {
          await gotoStop(ev95, await stopOf(place))
          const r = await ui(`(() => {
            const F = ${SF}, S = F.soldiers, f = S.f, M = S.constructor.MODE, KD = S.constructor.KIND
            const out = { strikes: 0, together: 0, guards: 0, musketFlash: 0, whirl: 0, thrown: 0, gunFlash: 0, rammed: 0, touched: 0, min: Infinity, max: 0 }
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
                else if (f.kind[i] === KD.sling && (fr === 10 || fr === 11)) out.whirl++
                else if (f.kind[i] === KD.sling && fr >= 12 && fr <= 13) out.thrown++
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
          rows.push(`${place}: over 15 s, ${r.strikes} blows struck (${r.together} by both of a pair at once), ${r.musketFlash} musket flashes, ${r.whirl} slings whirling and ${r.thrown} let go, ${r.gunFlash} gun flashes, ${r.rammed} ramming, ${r.touched} matches put; ${r.min}–${r.max} people at the fronts`)
          if (!(r.strikes > 0 && r.guards > 0)) throw new Error(`${place}: no bout fought: ${JSON.stringify(r)}`)
          if (r.together) throw new Error(`${place}: both of a pair struck at once ${r.together} times`)
          if (!(r.musketFlash > 0)) throw new Error(`${place}: no musket fired in 15 s`)
          if (!(r.whirl > 0 && r.thrown > 0)) throw new Error(`${place}: no sling whirled and let go in 15 s`)
          if (!(r.gunFlash > 0 && r.rammed > 0 && r.touched > 0)) throw new Error(`${place}: the guns not served: ${JSON.stringify(r)}`)
          if (r.min !== r.max) throw new Error(`${place}: the people at the fronts went from ${r.max} to ${r.min}`)
        }
        for (const r of rows) console.log(`      ${r}`)
      })
      await check('at Lāʻimi the Oʻahu forces run up the valley, seen from behind, with the pursuit behind them', async () => {
        await gotoStop(ev95, await stopOf('laimi'))
        const r = await ui(`(() => {
          const F = ${SF}, S = F.soldiers, f = S.f
          ${facingRule}
          const proj = app.data.proj
          const [lx, lz] = proj.toWorld(app.tour.places.get('laimi').geometry.coordinates)
          const [gx, gz] = proj.toWorld(app.tour.places.get('nuuanu-pali').geometry.coordinates)
          const al = Math.hypot(gx - lx, gz - lz)
          const ax = (gx - lx) / al, az = (gz - lz) / al
          const chase = S.recs.find((r) => r.chase && r.w > 0.5)
          const fled = chase?.chase
          if (!chase) return { none: true }
          const out = { up: 0, down: 0, back: 0, away: 0, oahu: [], hawaii: [], gaps: [], name: fled.p.name, by: chase.p.name }
          for (let step = 0; step < 40; step++) {
            const x0 = new Float32Array(S.count), z0 = new Float32Array(S.count)
            for (let i = 0; i < S.count; i++) { x0[i] = f.x[i]; z0[i] = f.z[i] }
            F.update(0.1, app.districts.k, app.rig.state.distance)
            for (const [r, list] of [[fled, out.oahu], [chase, out.hawaii]]) {
              let sum = 0, n = 0
              for (let i = r.o; i < r.o + r.n; i++) {
                if (f.vis[i] <= 0 || x0[i] === 0) continue
                const vx = f.x[i] - x0[i], vz = f.z[i] - z0[i]
                const v = Math.hypot(vx, vz)
                if (v > 0.5) continue
                if (r === fled) (vx * ax + vz * az > 0 ? out.up++ : out.down++)
                // (going away from the eye: seen from behind)
                if (want(f.hx[i], f.hz[i]) === 3) { out.away++; if (f.face[i] === 3) out.back++ }
                sum += (f.x[i] - lx) * ax + (f.z[i] - lz) * az
                n++
              }
              if (n) list.push(sum / n)
            }
            // knot for knot, each of the pursuit's behind the one it follows (at the same share of their ways)
            if (step === 39) {
              const at = (r, s) => { let j = 1; while (j < r.cum.length - 1 && r.cum[j] < s) j++; const t = (s - r.cum[j - 1]) / (r.cum[j] - r.cum[j - 1] || 1); return [r.pts[j - 1][0] + (r.pts[j][0] - r.pts[j - 1][0]) * t, r.pts[j - 1][1] + (r.pts[j][1] - r.pts[j - 1][1]) * t] }
              for (let q = 0; q < fled.knots.length; q++) {
                const pa = at(fled, fled.knots[q].u * fled.total)
                const pb = at(chase, chase.knots[q].u * chase.total)
                out.gaps.push(((pa[0] - pb[0]) * ax + (pa[1] - pb[1]) * az) * 100)
              }
            }
          }
          const mean = (l) => l.reduce((s, v) => s + v, 0) / Math.max(1, l.length)
          out.oahuAt = mean(out.oahu) * 100
          out.hawaiiAt = mean(out.hawaii) * 100
          delete out.oahu
          delete out.hawaii
          return out
        })()`)
        if (r.none) throw new Error('no pursuit following a retreat at the Lāʻimi stop')
        if (!(r.up > 0 && r.down <= r.up * 0.02)) throw new Error(`“${r.name}”: ${r.up} steps up the valley, ${r.down} down it`)
        if (r.back < r.away) throw new Error(`of ${r.away} going away from the eye, ${r.back} seen from behind`)
        if (!(r.hawaiiAt < r.oahuAt)) throw new Error(`the pursuit stands ${r.hawaiiAt.toFixed(0)} m up the valley from Lāʻimi on average, the retreat ${r.oahuAt.toFixed(0)} m`)
        if (r.gaps.some((g) => g <= 0)) throw new Error(`a knot of the pursuit ahead of the one it follows: ${r.gaps.map((g) => g.toFixed(0)).join(', ')} m`)
        console.log(`      “${r.name}”: ${r.up} figure-steps up the valley toward the gap, ${r.down} down; ${r.back} of ${r.away} going away seen from behind; “${r.by}” behind it, on average ${r.oahuAt.toFixed(0)} m and ${r.hawaiiAt.toFixed(0)} m up from Lāʻimi, each knot ${Math.min(...r.gaps).toFixed(0)}–${Math.max(...r.gaps).toFixed(0)} m behind the one it follows`)
      })
      await check('at the pali Kamehameha’s forces close round the stand in an arc, and Oʻahu figures go over the edge and out of sight', async () => {
        await gotoStop(ev95, await stopOf('nuuanu-pali'))
        const r = await ui(`(() => {
          const F = ${SF}, S = F.soldiers, f = S.f, M = S.constructor.MODE
          const ringRec = S.recs.find((r) => r.ring && r.w > 0.5)
          const leap = S.recs.find((r) => r.behaviour === 'leap' && r.w > 0.5)
          const stand = S.recs.find((r) => r.behaviour === 'stand' && r.w > 0.5 && r.side !== ringRec?.side)
          if (!ringRec || !leap || !stand) return { missing: [!ringRec && 'surround', !leap && 'leap', !stand && 'stand'].filter(Boolean) }
          const R = ringRec.ring
          // the arc: where its people stand round the stand's middle, along the stand and out toward the valley
          const angles = []
          let inward = 0, valley = 0, ring = 0, near = 0
          for (let i = ringRec.o; i < ringRec.o + ringRec.n; i++) {
            if (f.vis[i] <= 0 || f.mode[i] !== M.ring) continue
            ring++
            const dx = f.x[i] - R.cx, dz = f.z[i] - R.cz
            const u = dx * R.ux + dz * R.uz, v = dx * R.nx + dz * R.nz
            angles.push(Math.atan2(u, v))
            if (v > -0.02) valley++
            if (f.hx[i] * -dx + f.hz[i] * -dz > 0) inward++
            if (Math.hypot(u, v) > Math.min(1.2, R.half)) near++
          }
          angles.sort((a, b) => a - b)
          const spread = angles.length ? ((angles.at(-1) - angles[0]) * 180) / Math.PI : 0
          // the leap: over 20 s, each leap crossing the brink and gone below it, and nobody left anywhere
          const end = leap.pts.at(-1), a = leap.pts[0]
          const dir = [(end[0] - a[0]) / leap.total, (end[1] - a[1]) / leap.total]
          const brink = app.world.metresAt(end[0], end[1])
          let leaps = 0, over = 0, below = 0, left = 0, sunk = 0, last = new Float32Array(S.count)
          const frames = new Set()
          for (let step = 0; step < 200; step++) {
            F.update(0.1, app.districts.k, app.rig.state.distance)
            for (let i = leap.o; i < leap.o + leap.n; i++) {
              const past = (f.x[i] - end[0]) * dir[0] + (f.z[i] - end[1]) * dir[1]
              if (f.vis[i] > 0) {
                frames.add(f.fr[i])
                if (f.air[i] && past > 0) over++
                // (a figure seen with all of it below the ground would be a body left in it)
                if (f.air[i] && f.lift[i] + (16 * S.unit) / app.world.uniforms.uVert.value < app.world.metresAt(f.x[i], f.z[i]) - 0.5) sunk++
              }
              if (last[i] > 0 && f.vis[i] <= 0) {
                leaps++
                if (f.air[i] && past > 0 && f.lift[i] < brink) below++
              }
              last[i] = f.vis[i]
            }
            // nobody drawn lying still: a fall frame only in the air
            for (let i = 0; i < S.count; i++) if (f.vis[i] > 0 && f.fr[i] >= 14 && !f.air[i]) left++
          }
          return { ring, valley, inward, near, spread, leaps, over, below, left, sunk, frames: [...frames].sort((a, b) => a - b), stand: stand.p.name }
        })()`)
        if (r.missing) throw new Error(`at the pali: no ${r.missing.join(', ')}`)
        if (r.ring < 12 || r.valley < r.ring || r.inward < r.ring) throw new Error(`the arc: ${r.ring} people, ${r.valley} on the valley side, ${r.inward} facing in`)
        if (r.spread < 100 || r.near < r.ring) throw new Error(`the arc spans ${r.spread.toFixed(0)}° round the stand, ${r.near} of ${r.ring} outside it`)
        if (r.leaps < 8 || r.below < r.leaps) throw new Error(`${r.leaps} leaps in 20 s, ${r.below} of them gone over the brink and below it`)
        if (!r.over || r.sunk || r.left) throw new Error(`in the air past the brink ${r.over} times; ${r.sunk} seen below the ground; ${r.left} drawn falling on the ground`)
        if (![4, 14, 15, 16].every((v) => r.frames.includes(v))) throw new Error(`the leap's frames: ${r.frames.join(', ')}`)
        console.log(`      ${r.ring} of Kamehameha's people in an arc ${r.spread.toFixed(0)}° round “${r.stand}”, all on the valley side and facing in; ${r.leaps} leaps in 20 s, each over the brink and gone below it, frames ${r.frames.join(', ')}; nobody left on the ground or seen under it`)
      })
      await check('off the tour, in the battle’s year: fewer of them, walking and standing, nobody fighting or going over', async () => {
        await offTour(1795)
        await view(nearView)
        await settleTwice()
        await frames(2)
        const r = await ui(`(() => {
          const F = ${SF}, S = F.soldiers, f = S.f, M = S.constructor.MODE
          const out = { quiet: F.stats().quiet, engage: 0, walking: 0, standing: 0, shown: 0, perRec: 0, over: 0 }
          for (let step = 0; step < 60; step++) {
            F.update(0.1, app.districts.k, app.rig.state.distance)
            let shown = 0
            for (const r of S.recs) {
              let n = 0
              for (let i = r.o; i < r.o + r.n; i++) {
                if (f.vis[i] <= 0) continue
                n++
                if (f.mode[i] === M.leap || f.air[i]) out.over++
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
        if (r.engage || r.over) throw new Error(`${r.engage} figure-frames fighting or falling, ${r.over} going over, off the tour`)
        if (!(r.walking > 0 && r.standing > 0)) throw new Error(`walking ${r.walking}, standing ${r.standing}`)
        if (r.perRec > 0.35) throw new Error(`a force shows ${(r.perRec * 100).toFixed(0)}% of its people off the tour`)
        console.log(`      up to ${r.shown} drawn, at most ${(r.perRec * 100).toFixed(0)}% of any force's people, walking and standing only`)
      })
      await check('what the people cost at the Puʻiwa stop', async () => {
        await gotoStop(ev95, await stopOf('puiwa'))
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

// ==== settlements by era (features/settlements.js, features/towns.js) ======= [settlements]
// At the harbour: kauhale in 1795, a few hundred hale with Kou's own over the
// plain the Kou stop frames (2.5 km round it: the layer has the village a
// thin one, about a hundred people per km², and a kauhale is a household or
// two); and within 1.5 km of Kou, a mixed town of thatch, frame and adobe by
// 1853 with its church, stores and masonry by 1896, towers by the timeline's
// last year (the 2020 keyframe). Every kind within its era's; none on a loʻi, a pond, the
// village while it stands, or the water of its year; within the budget; and
// what each year costs in heap and frame time, with the town and without it.
// Then every island's: buildings low over Lahaina, Kailua-Kona and Hilo in
// 1778, 1896 and the last year, none on the water of the year or a stream;
// the kit mix shifting with value; the zoning of now where the layers have it
// (Waikīkī's towers, Sand Island's sheds, Mililani's houses, Kāʻanapali's
// strip, towers nowhere else); the district placing its own and Kou winning;
// no two buildings on one footprint; nothing flickering between two frames a
// hair apart; and what the island's towns cost.
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
    // (now the zoning has its say: shops and offices, sheds, the old false fronts on a main street)
    2000: ['house', 'bungalow', 'walkup', 'tower', 'block', 'midrise', 'store', 'shed', 'church', 'spire', 'clock'],
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
  await check('settlements: what the town costs at the harbour, by year', async () => {
    const cdp = await page.context().newCDPSession(page)
    const heapMB = async () => {
      await cdp.send('HeapProfiler.collectGarbage')
      const { usedSize, backingStorageSize } = await cdp.send('Runtime.getHeapUsage')
      return { js: +(usedSize / 1048576).toFixed(1), buffers: backingStorageSize === undefined ? null : +(backingStorageSize / 1048576).toFixed(1) }
    }
    const out = {}
    for (const y of [1795, 1896, lastYear]) {
      await atHarbour(y)
      await frames(2)
      const ms = await wall(6)
      const heap = await heapMB()
      const calls = await ui('app.renderer.info.render.calls')
      await run('app.districts.cur.features.settlements.hidden = true; app.towns.hidden = true')
      await frames(2)
      const without = await wall(6)
      await run('app.districts.cur.features.settlements.hidden = false; app.towns.hidden = false')
      await frames(2)
      const st = await ui('app.districts.cur.features.settlements.stats()')
      const tw = await ui('app.towns.stats()')
      out[y] = { ms, msWithout: without, calls, drawn: st.drawn, islandDrawn: tw.drawn, triangles: st.triangles, heapMB: heap }
    }
    console.log('      settlements perf', JSON.stringify(out))
  })

  // --- every island's towns (features/towns.js) ---------------------------------------
  /** Low over a gazetteer place (or a lon/lat), in a year, the towns in reach built. */
  const lowOver = async (place, year, [bearing, pitch, distance] = [60, 0.3, 24]) => {
    const at = typeof place === 'string' ? `app.tour.places.get('${place}')` : `{ geometry: { type: 'Point', coordinates: ${JSON.stringify(place)} } }`
    await run(`app.ui.card.close(); app.ui.onScrub(); app.timeline.setYear(${year}); app.ui.timeline.finish(); const v = app.tour.cameraView(${at}, { bearing: ${bearing}, pitch: ${pitch}, distance: ${distance} }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()`)
    for (let k = 0; k < 600; k++) {
      const ok = await ui(`(() => { app.settle(); const t = app.rig.state.target, D = app.districts, d = D.districtAt(t.x, t.z); return app.towns.idle && (!d || (D.cur?.d === d && D.cur.state === 'ready' && !!D.cur.features?.settlements.ready)) })()`)
      if (ok) break
      await frames(1)
    }
    await run('app.settle()')
    await frames(2)
    return ui('[app.rig.state.target.x, app.rig.state.target.z]')
  }
  const islandCensus = (year, xz, r) => ui(`app.towns.census(${year}, ${xz[0]}, ${xz[1]}, ${r})`)
  // (the island's buildings a district that is down hides, inside its inner box, are not drawn: left out where they are counted with the district's)
  const shown = "((q) => { const u = app.towns.yieldU, r = u.uYieldRect.value; return !(u.uYield.value >= 0.999 && q.x > r.x && q.z > r.y && q.x < r.z && q.z < r.w) })"
  const townRows = {}
  await check('towns: buildings low over Lahaina, Kailua-Kona and Hilo in 1778, 1896 and now, more now than then', async () => {
    const bad = []
    for (const place of ['lahaina', 'kailua-kona', 'hilo']) {
      const row = {}
      for (const y of [1778, 1896, lastYear]) {
        const xz = await lowOver(place, y)
        const c = await islandCensus(y, xz, 15)
        row[y] = c
        if (!c.total) bad.push(`${place} ${y}: none`)
      }
      if (!(row[lastYear].total > row[1896].total && row[lastYear].total > row[1778].total)) bad.push(`${place}: ${row[1778].total}, ${row[1896].total}, ${row[lastYear].total}`)
      townRows[place] = row
      console.log(`      ${place} within 1.5 km: ${[1778, 1896, lastYear].map((y) => `${y} ${row[y].total} (${brief(row[y])})`).join(' · ')}`)
    }
    if (bad.length) throw new Error(bad.join('; '))
  })
  await check('towns: none on the water of its year or a stream, and the island’s grids registered with its pack', async () => {
    const out = []
    for (const [place, y] of [['lahaina', 1850], ['hilo', lastYear], ['kailua-kona', 1820], [[-157.95, 21.37], 1900]]) {
      const xz = await lowOver(place, y)
      const r = await ui(`(() => {
        const bad = []
        let n = 0
        for (const isl of app.towns.islands.values()) {
          if (!isl.ready) continue
          for (const a of isl.alive(${y}, ${xz[0]}, ${xz[1]}, 20)) {
            n++
            const ux = [Math.cos(a.a), -Math.sin(a.a)], uz = [Math.sin(a.a), Math.cos(a.a)]
            // (the points the scatter asked of the ground: the centre, the corners and the sides' middles)
            for (const [fu, fv] of [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]]) {
              const x = a.x + ux[0] * fu * a.ax + uz[0] * fv * a.az
              const z = a.z + ux[1] * fu * a.ax + uz[1] * fv * a.az
              const g = isl.t.metresAt(x, z)
              const list = app.patches?.byPack?.get(isl.id) || []
              let w = g
              for (const p of list) { if (!(${y} < p.until)) continue; const b = p.box; const tx = (x - b[0]) / (b[2] - b[0]), tz = (z - b[1]) / (b[3] - b[1]); if (tx < 0 || tz < 0 || tx > 1 || tz > 1) continue; const m = app.patches.maskAt(p.crop, tx, tz); if (m > 0) w += ((p.kind === 'raise' ? Math.max(w, p.depthM) : Math.min(w, p.depthM)) - w) * m }
              const what = w < 0.3 ? 'water ' + w.toFixed(2) : isl.grid(isl.streamOn, x, z) ? 'stream' : null
              if (what) { bad.push(isl.id + ' ' + what + ' ' + a.kind + ' at ' + x.toFixed(2) + ',' + z.toFixed(2)); break }
            }
          }
        }
        return { n, bad }
      })()`)
      if (r.bad.length) throw new Error(`${place} ${y}: ${r.bad.length} of ${r.n}: ${r.bad.slice(0, 4).join('; ')}`)
      out.push(`${typeof place === 'string' ? place : 'ʻEwa'} ${y}: ${r.n}`)
    }
    console.log(`      buildings checked, footprint by footprint: ${out.join(', ')}`)
  })
  await check('towns: the kit mix shifts with value within each era', async () => {
    const r = await ui(`(() => {
      const isl = [...app.towns.islands.values()].find((i) => i.ready)
      const lots = Array.from({ length: 4000 }, (_, k) => { const h = (n) => ((Math.sin((k + 1) * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1; return { lag: 0, r2: h(1), r3: h(2), r4: h(3), r5: h(4), r6: h(5), r7: h(6), r8: h(7), zone: 0, zoned: false, lud: 0 } })
      const share = (y, d, v, kinds) => lots.filter((l) => kinds.includes(isl.kindAt(y, d, v, l, false))).length / lots.length
      const K = { hale: 1, frame: 2, adobe: 3, cottage: 4, store: 5, block: 6, bungalow: 7, midrise: 8, house: 9, walkup: 10, tower: 11 }
      const fine = (y, d, kinds) => [share(y, d, 0.15, kinds.map((k) => K[k])), share(y, d, 0.9, kinds.map((k) => K[k]))]
      return { thatch1850: fine(1850, 400, ['hale']), coral1850: fine(1850, 400, ['adobe']), masonry1896: fine(1896, 600, ['store', 'block']), offices1930: fine(1930, 2500, ['midrise']), towers2000: fine(2000, 6000, ['tower']) }
    })()`)
    const wrong = []
    if (!(r.thatch1850[0] > r.thatch1850[1] && r.coral1850[1] > r.coral1850[0])) wrong.push(`1850 thatch ${r.thatch1850}, coral ${r.coral1850}`)
    if (!(r.masonry1896[1] > r.masonry1896[0] + 0.1)) wrong.push(`1896 masonry ${r.masonry1896}`)
    if (!(r.offices1930[1] > r.offices1930[0])) wrong.push(`1930 offices ${r.offices1930}`)
    if (!(r.towers2000[1] > r.towers2000[0])) wrong.push(`2000 towers ${r.towers2000}`)
    if (wrong.length) throw new Error(wrong.join('; '))
    const f = (p) => p.map((v) => `${Math.round(v * 100)}%`).join(' → ')
    console.log(`      humble → fine lots: thatch in 1850 ${f(r.thatch1850)}, coral and adobe ${f(r.coral1850)}; stores and masonry in 1896 ${f(r.masonry1896)}; offices in 1930 ${f(r.offices1930)}; towers now ${f(r.towers2000)}`)
  })
  await check('towns: the zoning of now: Waikīkī’s towers, Sand Island’s sheds, Mililani’s houses, Kāʻanapali’s strip, towers nowhere else', async () => {
    const has = await ui("!!(app.districts.cur?.features?.settlements?.zoning?.zoning) || [...app.towns.islands.values()].some((i) => !!i.zoning?.zoning)")
    const rows = []
    const bad = []
    const both = (y, xz, r) => ui(`(() => { const S = app.districts.cur?.features?.settlements; const a = S?.ready ? S.alive(${y}).filter((q) => Math.hypot(q.x - ${xz[0]}, q.z - ${xz[1]}) < ${r}) : []; return { district: a.map((q) => ({ kind: q.kind, x: q.x, z: q.z })), island: app.towns.alive(${y}, ${xz[0]}, ${xz[1]}, ${r}).filter(${shown}).map((q) => ({ kind: q.kind, x: q.x, z: q.z, island: q.island })) } })()`)
    const tally = (list) => list.reduce((o, q) => ((o[q.kind] = (o[q.kind] || 0) + 1), o), {})
    for (const [name, place, want] of [
      ['Waikīkī', 'waikiki', (t) => (t.tower || 0) >= 10],
      ['Sand Island', [-157.882, 21.31], (t) => (t.shed || 0) >= 10 && (t.shed || 0) > (t.house || 0)],
      ['Mililani', [-158.015, 21.452], (t) => (t.house || 0) >= 50 && !t.tower],
      ['Kāʻanapali', [-156.692, 20.925], (t) => (t.tower || 0) + (t.walkup || 0) >= 10],
    ]) {
      const xz = await lowOver(place, lastYear)
      const got = await both(lastYear, xz, 8)
      const t = tally([...got.district, ...got.island])
      rows.push(`${name}: ${Object.entries(t).map(([k, v]) => `${v} ${k}`).join(', ')}`)
      if (has && !want(t)) bad.push(`${name}: ${JSON.stringify(t)}`)
    }
    // towers only where the class allows them (3 high-rise, 5 downtown, 7 resort)
    const stray = await ui(`(() => {
      const out = []
      const S = app.districts.cur?.features?.settlements
      const look = (list, Z) => { for (const q of list) if (q.kind === 'tower' && Z?.zoning) { const c = Z.zoning.px[Math.floor(((q.z - Z.rect.z0) / (Z.rect.z1 - Z.rect.z0)) * Z.zoning.H) * Z.zoning.W + Math.floor(((q.x - Z.rect.x0) / (Z.rect.x1 - Z.rect.x0)) * Z.zoning.W)]; if (![3, 5, 7].includes(c)) out.push(q.kind + ' in class ' + c) } }
      if (S?.ready) look(S.alive(${lastYear}), S.zoning)
      for (const isl of app.towns.islands.values()) if (isl.ready) look(isl.alive(${lastYear}), isl.zoning)
      return out
    })()`)
    if (has && stray.length) bad.push(`${stray.length} towers outside classes 3, 5 and 7: ${stray.slice(0, 3).join('; ')}`)
    console.log(`      ${has ? 'zoned' : 'no zoning in the layers: density and value alone'} · ${rows.join(' · ')}`)
    if (bad.length) throw new Error(bad.join('; '))
  })
  await check('towns: the district places its own, the island’s yield inside it, and Kou wins', async () => {
    await atHarbour(1795)
    const r = await ui(`(() => {
      const D = app.districts, rec = D.cur, S = rec.features.settlements, R = rec.d.rect
      const edge = (x, z) => Math.min(x - R.x0, R.x1 - x, z - R.z0, R.z1 - z)
      const near = S.alive(1795).filter((a) => edge(a.x, a.z) < 3.8).length
      // the island's drawn instances inside the district's inner box, while it is down
      const y = app.towns.yieldU.uYield.value
      let inner = 0
      for (const isl of app.towns.islands.values()) for (const vr of isl.variants || []) {
        if (!vr.mesh?.visible) continue
        const m = vr.mesh.instanceMatrix.array
        for (let c = 0; c < vr.mesh.count; c++) { const x = m[c * 16 + 12], z = m[c * 16 + 14]; if (edge(x, z) > 3.5) inner++ }
      }
      // Kou's outline, against the island's own lots in 1795 (they would be there were the district not down)
      const village = [...rec.d.byIndex.values()].find((f) => f.properties.kind === 'village')
      const ring = village.geometry.coordinates[0].map((c) => app.data.proj.toWorld(c))
      const ins = (x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const a = ring[i], b = ring[j]; if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c } return c }
      // (the island's tiles under the district wait while it is down: work out those under Kou now)
      const isl = app.towns.islands.get(rec.d.parent)
      if (isl?.ready) {
        const xs = ring.map((p) => p[0]), zs = ring.map((p) => p[1]), T = 5, r0 = isl.rect
        for (let i = Math.floor((Math.min(...xs) - r0.x0) / T); i <= Math.floor((Math.max(...xs) - r0.x0) / T); i++)
          for (let j = Math.floor((Math.min(...zs) - r0.z0) / T); j <= Math.floor((Math.max(...zs) - r0.z0) / T); j++) if (!isl.tiles.has(i + ',' + j)) isl.buildTile(i, j)
      }
      const onKou = app.towns.alive(1795).filter((a) => ins(a.x, a.z)).length
      const nearKou = app.towns.alive(1795).filter((a) => Math.hypot(a.x - ring[0][0], a.z - ring[0][1]) < 8).length
      const own = S.alive(1795).filter((a) => ins(a.x, a.z)).length
      return { k: +D.k.toFixed(2), yield: +y.toFixed(2), near, inner, onKou, nearKou, own }
    })()`)
    if (r.near || r.onKou || r.own || (r.yield >= 0.999 && r.inner)) throw new Error(JSON.stringify(r))
    console.log(`      district at ${r.k}, the island yielding ${r.yield}: ${r.inner} of its drawn inside the district’s inner box, ${r.near} of the district’s within 380 m of its edge, ${r.onKou} of the island’s (of ${r.nearKou} within 800 m) and ${r.own} of the district’s on Kou`)
  })
  await check('towns: no two buildings on one footprint, a gap between lots', async () => {
    const out = []
    for (const [place, y] of [['kou', 1896], ['kou', lastYear], ['lahaina', 1850], ['lahaina', lastYear], [[-157.893, 21.33], lastYear]]) {
      const xz = await lowOver(place, y, [45, 0.4, 24])
      const r = await ui(`(() => {
        const S = app.districts.cur?.features?.settlements
        const list = [...(S?.ready ? S.alive(${y}).filter((a) => Math.hypot(a.x - ${xz[0]}, a.z - ${xz[1]}) < 14) : []), ...app.towns.alive(${y}, ${xz[0]}, ${xz[1]}, 14).filter(${shown})]
        // each footprint as a quad (its own box, turned as THREE turns), then every pair near enough to meet
        const quad = (a) => { const c = Math.cos(a.a), s = Math.sin(a.a), [x0, x1, z0, z1] = a.box; return [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([u, v]) => [a.x + u * c + v * s, a.z - u * s + v * c]) }
        const sep = (A, B) => { for (const P of [A, B]) for (let i = 0; i < 4; i++) { const p = P[i], q = P[(i + 1) % 4], n = [q[1] - p[1], p[0] - q[0]]; const pa = A.map((c) => c[0] * n[0] + c[1] * n[1]), pb = B.map((c) => c[0] * n[0] + c[1] * n[1]); if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa)) return true } return false }
        const Q = list.map(quad)
        const bad = []
        for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
          if (Math.hypot(list[i].x - list[j].x, list[i].z - list[j].z) > 1.2) continue
          if (!sep(Q[i], Q[j])) bad.push(list[i].kind + '/' + list[j].kind + ' at ' + list[i].x.toFixed(2) + ',' + list[i].z.toFixed(2))
        }
        return { n: list.length, bad }
      })()`)
      if (r.bad.length) throw new Error(`${place} ${y}: ${r.bad.length} pairs of ${r.n}: ${r.bad.slice(0, 4).join('; ')}`)
      out.push(`${typeof place === 'string' ? place : 'Kalihi'} ${y}: ${r.n}`)
    }
    console.log(`      footprints checked pair by pair: ${out.join(', ')}`)
  })
  await check('settlements: no two faces of a kit in one plane where they overlap', async () => {
    // every pair of triangles in a kit that face the same way in one plane
    // (within 2 cm) and overlap by area: the faces that would fight over the
    // depth buffer whatever the camera did
    const r = await ui(`(() => {
      const S = app.districts.cur?.features?.settlements
      const kits = S?.kits || [...app.towns.islands.values()].find((i) => i.ready)?.kits
      if (!kits) return null
      const area2 = (q) => { let a = 0; for (let i = 0; i < q.length; i++) { const p = q[i], n = q[(i + 1) % q.length]; a += p[0] * n[1] - n[0] * p[1] } return a / 2 }
      const clip = (sub, cl) => { let out = sub; const sg = Math.sign(area2(cl)) || 1
        for (let i = 0; i < cl.length && out.length; i++) { const a = cl[i], b = cl[(i + 1) % cl.length], ins = (p) => sg * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= -1e-9, inp = out; out = []
          for (let k = 0; k < inp.length; k++) { const P = inp[k], Q = inp[(k + 1) % inp.length], pi = ins(P), qi = ins(Q); if (pi) out.push(P)
            if (pi !== qi) { const dx = Q[0] - P[0], dy = Q[1] - P[1], ex = b[0] - a[0], ey = b[1] - a[1], den = dx * ey - dy * ex; if (Math.abs(den) > 1e-12) { const t = ((a[0] - P[0]) * ey - (a[1] - P[1]) * ex) / den; out.push([P[0] + dx * t, P[1] + dy * t]) } } } }
        return out }
      const bad = []
      let tris = 0
      for (const [kind, list] of Object.entries(kits)) list.forEach((kit, v) => {
        const g = kit.geometry, P = g.attributes.position.array, I = g.index.array, T = []
        for (let t = 0; t < I.length / 3; t++) { const p = [0, 1, 2].map((k) => [P[I[t * 3 + k] * 3], P[I[t * 3 + k] * 3 + 1], P[I[t * 3 + k] * 3 + 2]]); const u = p[1].map((c, i) => c - p[0][i]), w = p[2].map((c, i) => c - p[0][i]); const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]], l = Math.hypot(...n); if (l < 1e-9) continue; const N = n.map((c) => c / l); T.push({ p, N, d: N[0] * p[0][0] + N[1] * p[0][1] + N[2] * p[0][2] }) }
        tris += T.length
        for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
          const a = T[i], b = T[j]
          if (a.N[0] * b.N[0] + a.N[1] * b.N[1] + a.N[2] * b.N[2] < 0.9999 || Math.abs(a.d - b.d) > 0.02) continue
          const N = a.N, r = Math.abs(N[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
          let e1 = [N[1] * r[2] - N[2] * r[1], N[2] * r[0] - N[0] * r[2], N[0] * r[1] - N[1] * r[0]]; const l = Math.hypot(...e1); e1 = e1.map((c) => c / l)
          const e2 = [N[1] * e1[2] - N[2] * e1[1], N[2] * e1[0] - N[0] * e1[2], N[0] * e1[1] - N[1] * e1[0]]
          const to2 = (p) => [p[0] * e1[0] + p[1] * e1[1] + p[2] * e1[2], p[0] * e2[0] + p[1] * e2[1] + p[2] * e2[2]]
          const o = clip(a.p.map(to2), b.p.map(to2))
          if (o.length >= 3 && Math.abs(area2(o)) > 1e-3) bad.push(kind + ' ' + v)
        }
      })
      return { bad, tris, kits: Object.values(kits).reduce((s, l) => s + l.length, 0) }
    })()`)
    if (!r) throw new Error('no kits built')
    if (r.bad.length) throw new Error(`${r.bad.length} pairs: ${[...new Set(r.bad)].slice(0, 8).join(', ')}`)
    console.log(`      ${r.kits} kits, ${r.tris} triangles: no overlapping faces in one plane`)
  })
  await check('towns: nothing flickers between two frames a hair apart (z-fighting)', async () => {
    const out = []
    for (const [name, place, y, cam] of [
      ['harbour 1896', 'kou', 1896, [45, 0.1, 22]],
      ['harbour now', 'kou', lastYear, [45, 0.1, 22]],
      ['valley 1853', 'nuuanu', 1853, [42, 0.18, 40]],
      ['Honolulu 1896, low', 'honolulu', 1896, [200, 0.06, 12]],
      ['Lahaina now, low', 'lahaina', lastYear, [60, 0.06, 12]],
    ]) {
      await lowOver(place, y, cam)
      const r = await page.evaluate(async () => {
        const app = window.__app
        // the loop and the clock stopped: these frames are drawn by hand
        const keep = app.frame
        app.frame = () => {}
        await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)))
        const R = app.renderer
        const gl = R.getContext()
        const w = gl.drawingBufferWidth
        const h = gl.drawingBufferHeight
        const draw = () => {
          app.sky.renderMap(R)
          app.pipeline.render(app.scene, app.camera)
          const px = new Uint8Array(w * h * 4)
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px)
          return px
        }
        const groups = [app.districts.cur?.features?.settlements?.group, app.towns.group].filter(Boolean)
        const cam = app.camera
        const p0 = cam.position.clone()
        const n0 = cam.near
        const base = draw()
        const vis = groups.map((g) => g.visible)
        for (const g of groups) g.visible = false
        const bare = draw()
        groups.forEach((g, i) => (g.visible = vis[i]))
        // the buildings' pixels: where the frame differs without them
        const mask = new Uint8Array(w * h)
        let building = 0
        for (let i = 0; i < w * h; i++) if (Math.abs(base[i * 4] - bare[i * 4]) + Math.abs(base[i * 4 + 1] - bare[i * 4 + 1]) + Math.abs(base[i * 4 + 2] - bare[i * 4 + 2]) > 12) (mask[i] = 1), building++
        const count = (moves) => {
          const flipped = new Uint8Array(w * h)
          for (const move of moves) {
            move()
            cam.updateProjectionMatrix()
            cam.updateMatrixWorld()
            const a = draw()
            for (let i = 0; i < w * h; i++) if (mask[i] && Math.max(Math.abs(a[i * 4] - base[i * 4]), Math.abs(a[i * 4 + 1] - base[i * 4 + 1]), Math.abs(a[i * 4 + 2] - base[i * 4 + 2])) > 40) flipped[i] = 1
            cam.position.copy(p0)
            cam.near = n0
          }
          cam.updateProjectionMatrix()
          cam.updateMatrixWorld()
          let n = 0
          for (let i = 0; i < w * h; i++) n += flipped[i]
          return n
        }
        // the camera moved 2 mm four ways; and the near plane moved a few
        // tenths of a per cent, which leaves every pixel where it was and
        // changes only the depths, so what flips there is two faces tied in depth
        const J = 2e-5
        const jitter = count([[J, 0, 0], [0, J, 0], [0, 0, J], [-J, J / 2, -J / 2]].map((j) => () => cam.position.set(p0.x + j[0], p0.y + j[1], p0.z + j[2])))
        const depth = count([1.002, 1.004, 0.998, 0.996].map((k) => () => (cam.near = n0 * k)))
        app.frame = keep
        requestAnimationFrame(app.frame)
        return { building, jitter, depth, near: +n0.toFixed(3), far: Math.round(cam.far) }
      })
      out.push(`${name}: ${r.jitter} and ${r.depth} of ${r.building} (near ${r.near}, far ${r.far})`)
      const most = Math.max(80, r.building * 0.001)
      // the near-plane probe is the harsher of the two: what it still flips at a low camera are silhouette edges, so it gets half again
      const mostDepth = Math.max(80, r.building * 0.0015)
      if (r.jitter > most || r.depth > mostDepth) throw new Error(`${name}: ${r.jitter} pixels flip under the jitter, ${r.depth} under the depth, of ${r.building}`)
    }
    console.log(`      building pixels that change under a 2 mm jitter and under the near plane moved 0.2–0.4%: ${out.join(' · ')}`)
  })
  await check('towns: what the island’s towns cost over Lahaina and Kailua-Kona, in 1896 and now', async () => {
    const out = {}
    for (const place of ['lahaina', 'kailua-kona']) {
      for (const y of [1896, lastYear]) {
        await lowOver(place, y, [60, 0.3, 30])
        await frames(2)
        const ms = await wall(6)
        await run('app.towns.hidden = true')
        await frames(2)
        const without = await wall(6)
        await run('app.towns.hidden = false')
        await frames(2)
        const tw = await ui('app.towns.stats()')
        const isl = tw.islands.find((i) => i.drawn) || tw.islands[0] || {}
        out[`${place} ${y}`] = { ms, msWithout: without, calls: await ui('app.renderer.info.render.calls'), drawn: tw.drawn, triangles: isl.triangles, tiles: isl.worked, msPerTile: isl.msPerTile, buildMs: isl.buildMs, cpuMB: isl.cpuMB }
        if (tw.drawn > 6000) throw new Error(`${place} ${y}: ${tw.drawn} drawn`)
      }
    }
    console.log('      towns perf', JSON.stringify(out))
  })
}
// ==== [settlements] end =======================================================

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

// ==== [ui6] the sources read, the Māhele, the stop camera's target, the shore, the phone's timeline ====
{
  // -- the sources: a card cites only what was read, and no word says what was not
  await check('cards cite only sources read in full or in part; one with none read has no Sources; nothing says “verify”', async () => {
    const r = await ui(`(() => {
      const read = (s) => s.read === 'full' || s.read === 'part' || (s.read === undefined && s.opened !== false)
      const readTitles = new Set(app.data.sources.filter(read).map((s) => s.title))
      const unread = app.data.sources.filter((s) => !read(s))
      const bad = []
      let cards = 0, listed = 0, tellings = 0
      const look = (id) => {
        const el = document.querySelector('.card.show')
        cards++
        for (const t of el.querySelectorAll('.sources .src-title, .tellings .src-title')) {
          listed++
          if (!readTitles.has(t.textContent)) bad.push(id + ': ' + t.textContent)
        }
        tellings += el.querySelectorAll('.tellings li').length
      }
      for (const ev of app.data.events) { app.ui.card.open(ev); look(ev.id) }
      for (const ch of app.tour.chapters) { app.ui.card.openEra(ch); look(ch.era.id) }
      // an event resting only on a source not read: no Sources, no telling of it
      const u = unread[0]
      let empty = null
      if (u) {
        app.ui.card.open({ id: 'ui6-unread', title: 'A test', kind: 'other', when: { from: '1795', precision: 'year' }, where: [], sources: [{ id: u.id, where: 'p. 1' }], tellings: [{ source: u.id, says: 'a telling' }] })
        const el = document.querySelector('.card.show')
        empty = { sources: !!el.querySelector('.sources'), tellings: !!el.querySelector('.tellings'), heads: [...el.querySelectorAll('.card-sec h2')].map((h) => h.textContent) }
      }
      app.ui.card.close()
      // the about panel's credits keep the same rule
      const unreadTitles = new Set(unread.map((s) => s.title))
      const credits = [...document.querySelectorAll('.help .credits li')].map((li) => li.textContent)
      const badCredits = credits.filter((t) => [...unreadTitles].some((u) => t.includes(u)))
      return { cards, listed, tellings, bad, unread: unread.length, empty, credits: credits.length, mahele: document.querySelectorAll('.help .mahele-credits li').length, badCredits, verify: /verify/i.test(document.documentElement.outerHTML) }
    })()`)
    if (r.bad.length) throw new Error(`cited and not read: ${r.bad.slice(0, 4).join('; ')}`)
    if (r.empty && (r.empty.sources || r.empty.tellings || r.empty.heads.length)) throw new Error(`a card with no source read still shows ${JSON.stringify(r.empty)}`)
    if (r.badCredits.length) throw new Error(`the about panel credits what was not read: ${r.badCredits.join('; ')}`)
    if (r.verify) throw new Error('“verify” is in the page')
    if (!r.listed) throw new Error('no card lists any source')
    console.log(`      ${r.cards} cards: ${r.listed} citations, all read; ${r.unread} sources not read are cited nowhere; ${r.credits} credits in the about panel (${r.mahele} for the Māhele); no “verify”`)
  })

  // -- the Māhele, a third far view
  await page.waitForFunction(() => window.__app.mahele.available !== null, null, { timeout: 120000 })
  if (await ui('app.mahele.available')) {
    const mBtn = `document.querySelector('.legend [data-view="mahele"]')`
    await check('the Māhele is a third far view, there from 1848 and greyed before it, its legend the classes and their counts', async () => {
      await run("app.ui.card.close(); app.ui.onScrub(); app.setView('chiefdoms', { user: true }); app.timeline.setYear(1795); app.ui.timeline.finish()")
      await view('app.tour.chainView()')
      await frames(2)
      await expect('!!document.querySelector(".legend.show")', true)
      await expect(`${mBtn}.disabled`, true)
      // chosen before the division, it is the chiefdoms until the year comes to it
      await run("app.setView('mahele', { user: true }); app.settle()")
      await expect('app.farView', 'chiefdoms')
      await expect('app.regionOn', 'chiefdoms')
      await run('app.timeline.setYear(1853); app.ui.timeline.finish(); app.settle()')
      await frames(2)
      await expect('app.farView', 'mahele')
      await expect(`${mBtn}.disabled`, false)
      await expect(`${mBtn}.getAttribute('aria-pressed')`, 'true')
      // by the switch, as the other two
      await page.click('.legend [data-view="chiefdoms"]', opts)
      await expect('app.view', 'chiefdoms')
      await page.click('.legend [data-view="mahele"]', opts)
      await expect('app.view', 'mahele')
      await run('app.settle()')
      await frames(2)
      const s = await ui('({ region: app.regionOn, k: +app.shared.uniforms.uPolityK.value.toFixed(3), map: app.shared.uniforms.uMokuId.value === app.mahele.idTex, pal: app.shared.uniforms.uPalette.value === app.mahele.palTex, hover: app.shared.uniforms.uHoverMoku.value })')
      if (!(s.region === 'mahele' && s.map && s.pal && s.k > 0.9)) throw new Error(`the shader's region path: ${JSON.stringify(s)}`)
      const lg = await ui(`[...document.querySelectorAll('.legend .lg-mahele')].map((r) => [r.querySelector('b').textContent, Number(r.querySelector('em').textContent.replace(/,/g, ''))])`)
      const want = await ui(`(() => { const n = { crown: 0, government: 0, konohiki: 0, mixed: 0, unknown: 0 }; for (const a of app.mahele.file.ahupuaa) n[a.class in n ? a.class : 'unknown']++; return n })()`)
      const names = lg.map((r) => r[0]).join(',')
      if (names !== 'Crown,Government,Konohiki,Mixed,Unknown') throw new Error(`the legend names ${names}`)
      const got = Object.fromEntries(lg.map(([k, v]) => [k.toLowerCase(), v]))
      for (const k of Object.keys(want)) if (got[k] !== want[k]) throw new Error(`the legend counts ${JSON.stringify(got)}, the file ${JSON.stringify(want)}`)
      const note = await ui("document.querySelector('.legend .lg-note')?.textContent ?? ''")
      const all = Object.values(want).reduce((a, b) => a + b, 0)
      if (!note.includes(`${all.toLocaleString('en-US')} ahupuaʻa`)) throw new Error(`the legend's note reads “${note}”`)
      // and back before 1848: the chiefdoms, the button greyed; after it, the Māhele again
      await run('app.timeline.setYear(1820); app.ui.timeline.finish(); app.settle()')
      await expect('[app.farView, app.regionOn].join()', 'chiefdoms,chiefdoms')
      await expect(`${mBtn}.disabled`, true)
      await run('app.timeline.setYear(1853); app.ui.timeline.finish(); app.settle()')
      await expect('[app.farView, app.regionOn].join()', 'mahele,mahele')
      console.log(`      ${lg.map(([k, v]) => `${k} ${v}`).join(', ')} · “${note}” · greyed in 1795 and 1820`)
    })

    /** The scene's pixels at screen points (a 3 × 3 average each), from a screenshot. */
    const pixelsAt = async (pts) => {
      const b64 = (await page.screenshot()).toString('base64')
      return page.evaluate(
        async ([b64, pts]) => {
          const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
          const c = new OffscreenCanvas(img.width, img.height)
          const g = c.getContext('2d')
          g.drawImage(img, 0, 0)
          return pts.map(([x, y]) => {
            const d = g.getImageData(x - 1, y - 1, 3, 3).data
            const s = [0, 0, 0]
            for (let i = 0; i < 9; i++) for (let k = 0; k < 3; k++) s[k] += d[i * 4 + k] / 9
            return s.map(Math.round)
          })
        },
        [b64, pts],
      )
    }
    await check('the Māhele colours each ahupuaʻa by its class in mahele.json, and the hover card names it, its class and its awardee', async () => {
      await view("app.tour.islandView('oahu', 0)")
      await frames(3)
      const pts = await ui(`(() => {
        const out = {}
        const v = new app.camera.position.constructor()
        const units = app.mahele.units.filter((u) => u.islandId === 'oahu')
        const area = (u) => (u.box[2] - u.box[0]) * (u.box[3] - u.box[1])
        for (const cls of ['crown', 'government', 'konohiki']) {
          const cands = units.filter((u) => u.cls === cls && (cls !== 'konohiki' || u.entry?.awardee)).sort((a, b) => area(b) - area(a))
          for (const u of cands) {
            let found = null
            for (let j = 1; j < 12 && !found; j++) for (let i = 1; i < 12 && !found; i++) {
              const x = u.box[0] + ((u.box[2] - u.box[0]) * i) / 12
              const z = u.box[1] + ((u.box[3] - u.box[1]) * j) / 12
              const e = 2.5
              if ([[0, 0], [e, 0], [-e, 0], [0, e], [0, -e]].some(([a, b]) => app.mahele.unitAt(x + a, z + b) !== u || app.world.metresAt(x + a, z + b) < 20)) continue
              v.set(x, app.world.heightAt(x, z), z).project(app.camera)
              const sx = Math.round(((v.x + 1) / 2) * innerWidth)
              const sy = Math.round(((1 - v.y) / 2) * innerHeight)
              if (sx < 30 || sy < 90 || sx > innerWidth - 30 || sy > innerHeight - 30) continue
              const over = document.elementFromPoint(sx, sy)
              if (over?.id !== 'scene') continue
              found = { gisId: u.gisId, name: u.name, x: sx, y: sy, awardee: [].concat(u.entry?.awardee || []).join(', ') }
            }
            if (found) {
              out[cls] = found
              break
            }
          }
        }
        return out
      })()`)
      for (const cls of ['crown', 'government', 'konohiki']) if (!pts[cls]) throw new Error(`no ${cls} ahupuaʻa of Oʻahu found clear on the screen: ${JSON.stringify(pts)}`)
      // (the pointer off the scene, so no hover card lies over what is sampled)
      await page.mouse.move(60, 30)
      await frames(1)
      const at = ['crown', 'government', 'konohiki'].map((c) => [pts[c].x, pts[c].y])
      const withIt = await pixelsAt(at)
      await run('app.setView(null, { user: true }); app.settle()')
      await frames(3)
      const without = await pixelsAt(at)
      await run("app.setView('mahele', { user: true }); app.settle()")
      await frames(3)
      const d = withIt.map((p, i) => p.map((v, k) => v - without[i][k]))
      const [crown, gov, kon] = d
      if (!(gov[2] - gov[0] > 10)) throw new Error(`the government land is not bluer with the Māhele: Δrgb ${gov}`)
      if (!(crown[0] - crown[2] > 10 && kon[0] - kon[2] > 10)) throw new Error(`the crown and konohiki land are not warmer: Δrgb ${crown} and ${kon}`)
      // the hover card over the konohiki land
      const k = pts.konohiki
      await page.mouse.move(k.x - 6, k.y)
      await page.waitForTimeout(150)
      await page.mouse.move(k.x, k.y)
      await frames(2)
      const text = await ui("document.querySelector('.inspector.show')?.textContent.replace(/\\s+/g, ' ').trim() ?? ''")
      await page.mouse.move(60, 30)
      if (!text.includes(k.name) || !text.includes('Konohiki') || !text.includes(k.awardee.split(', ')[0])) throw new Error(`the hover card over ${k.name} reads “${text}”`)
      console.log(`      Δrgb with the Māhele: ${pts.crown.name} (crown) ${crown}, ${pts.government.name} (government) ${gov}, ${k.name} (konohiki) ${kon}`)
      console.log(`      hover: “${text}”`)
    })
    await check('the tour turns to the Māhele at Ka Māhele, the land at the Kuleana Act, and leaves the viewer’s own choice alone', async () => {
      const go = (id) => run(`const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1]); app.settle()`)
      const has = await ui("['mahele-1848', 'kuleana-1850'].map((id) => !!app.data.events.find((e) => e.id === id))")
      if (!has[0]) return console.log('      (no mahele-1848 in the data)')
      await run('app.viewChosen = false')
      await go('mahele-1848')
      await expect('[app.view, app.farView, app.regionOn].join()', 'mahele,mahele,mahele')
      if (has[1]) {
        await go('kuleana-1850')
        await expect('app.view', 'land')
      }
      await go('mahele-1848')
      await expect('app.view', 'mahele')
      await run("app.setView('chiefdoms', { user: true })")
      await go('mahele-1848')
      await expect('app.view', 'chiefdoms')
      await run('app.ui.card.close(); app.ui.onScrub()')
      console.log(`      mahele-1848 → the Māhele${has[1] ? ', kuleana-1850 → the land' : ''}; once chosen, the chiefdoms stay`)
    })
  } else console.log('  - no mahele.json: the Māhele checks skipped')

  // -- a stop camera's target
  const nuuanu = await ui("app.data.events.find((e) => e.id === 'nuuanu-1795' && e.stops?.some((s) => s.camera?.target)) ? 'nuuanu-1795' : null")
  if (nuuanu) {
    const stopAt = (i) => run(`const ev = app.data.events.find((e) => e.id === '${nuuanu}'); const at = app.tour.locate(ev); app.tour.goTo(at[0], at[1]); app.tour.goStop(${i}); app.settle()`)
    const frame = (i) =>
      ui(`(() => {
        const ev = app.data.events.find((e) => e.id === '${nuuanu}')
        const st = ev.stops[${i}]
        const box = app.ui.freeBox()
        const v = new app.camera.position.constructor()
        const P = (ll) => {
          const [x, z] = app.data.proj.toWorld(ll)
          v.set(x, app.world.heightAt(x, z), z).project(app.camera)
          return [((v.x + 1) / 2) * innerWidth, ((1 - v.y) / 2) * innerHeight]
        }
        const place = app.tour.places.get(st.place)
        const pl = place.geometry.coordinates
        const it = app.ui.pins.items.find((p) => p.ev === ev)
        const [px, pz] = app.data.proj.toWorld(pl)
        const fx = (p) => +((p[0] - box.x0) / (box.x1 - box.x0)).toFixed(3)
        const fy = (p) => +((p[1] - box.y0) / (box.y1 - box.y0)).toFixed(3)
        const c = st.camera.target ? P(st.camera.target) : P(pl)
        const p = P(pl)
        return { place: st.place, target: !!st.camera.target, centre: [fx(c), fy(c)], at: [fx(p), fy(p)], pin: it ? +Math.hypot(it.pos.x - px, it.pos.z - pz).toFixed(3) : null,
          d: +app.rig.state.distance.toFixed(2), want: st.camera.distance, pitch: +app.rig.state.pitch.toFixed(3), wantPitch: +((st.camera.pitch * Math.PI) / 2).toFixed(3),
          yaw: +app.rig.state.yaw.toFixed(3), wantYaw: +((-st.camera.bearing * Math.PI) / 180).toFixed(3) }
      })()`)
    await check('the Kou stop centres its camera’s target with Kou low in the frame and the pin at Kou; Puʻiwa, Lāʻimi and the pali as their cameras ask', async () => {
      const stops = await ui(`app.data.events.find((e) => e.id === '${nuuanu}').stops.map((s, i) => (s.camera ? i : -1)).filter((i) => i >= 0)`)
      const rows = []
      const bad = []
      for (const i of stops) {
        await stopAt(i)
        await frames(2)
        const f = await frame(i)
        rows.push(f)
        const off = Math.hypot(f.centre[0] - 0.5, f.centre[1] - 0.5)
        if (off > 0.05) bad.push(`${f.place}: what the camera centres sits at ${f.centre} of the free box, not its middle`)
        if (Math.abs(f.d - f.want) > 0.5 || Math.abs(f.pitch - f.wantPitch) > 0.02 || Math.abs(f.yaw - f.wantYaw) > 0.02) bad.push(`${f.place}: the camera stands at d ${f.d}, pitch ${f.pitch}, yaw ${f.yaw}`)
        if (f.pin === null || f.pin > 0.01) bad.push(`${f.place}: the pin is ${f.pin} units from the place`)
        if (f.target && !(f.at[1] > 2 / 3 && f.at[1] < 0.95 && f.at[0] > 0.1 && f.at[0] < 0.9)) bad.push(`${f.place}: the place sits at ${f.at} of the free box, not in its lower third`)
      }
      await run('app.ui.card.close(); app.ui.onScrub()')
      for (const f of rows) console.log(`      ${f.place}: ${f.target ? `target at ${f.centre}, ${f.place} at ${f.at}` : `${f.place} at ${f.centre}`} of the free box; d ${f.d}, pitch ${f.pitch}, yaw ${f.yaw}; pin ${f.pin} from the place`)
      if (!rows.some((f) => f.target)) bad.push('no stop with a target was walked')
      if (bad.length) throw new Error(bad.join('; '))
    })
  }

  // -- the shore: where the water meets the land, nothing of the sunk seabed shows
  const shores = await ui("['cattle-1793', 'mailikukahi', 'whaling'].filter((id) => app.data.events.some((e) => e.id === id))")
  if (shores.length) {
    // (the ground's own shader marks in magenta every pixel of its mesh that lies more than 30 cm under
    // the sea, deeper than the shore's own edge: any seen is seabed the water doesn't cover)
    const mark = (on) =>
      run(`for (const t of app.world.terrains.values()) for (const g of [t.full, t.half]) {
        const m = g.material
        if (${on} && !m.__ui6) { m.__ui6 = m.fragmentShader; m.fragmentShader = m.fragmentShader.replace('gl_FragColor = vec4(lit, 1.0);', 'gl_FragColor = vec4(vWorld.y < -0.3 * uVert ? vec3(1.0, 0.0, 1.0) : lit, 1.0);'); m.needsUpdate = true }
        if (!${on} && m.__ui6) { m.fragmentShader = m.__ui6; delete m.__ui6; m.needsUpdate = true }
      }`)
    const seabed = async () => {
      const b64 = (await page.screenshot()).toString('base64')
      return page.evaluate(async (b64) => {
        const app = window.__app
        const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
        const c = new OffscreenCanvas(img.width, img.height)
        const g = c.getContext('2d')
        g.drawImage(img, 0, 0)
        const W = img.width
        const H = img.height
        const d = g.getImageData(0, 0, W, H).data
        // (the marker comes out about 211, 47, 212 once lit and fogged; a pixel only partly
        // magenta is a multisampled edge, shaded from beyond a triangle's corner, not ground seen)
        const magenta = (i) => d[i] > 190 && d[i + 2] > 190 && d[i + 1] < 75
        let frame = 0
        for (let i = 0; i < d.length; i += 4) if (magenta(i)) frame++
        // and along the coastline: a grid of picks over the scene, the cells
        // where land meets sea, and a 7 × 7 window of pixels round each
        const S = 12
        const nx = Math.floor(W / S)
        const ny = Math.floor(H / S)
        const land = new Int8Array(nx * ny)
        for (let j = 0; j < ny; j++) {
          for (let i = 0; i < nx; i++) {
            const x = i * S + S / 2
            const y = j * S + S / 2
            const p = document.elementFromPoint(x, y)?.id === 'scene' ? app.rig.pickGround(x, y) : null
            land[j * nx + i] = p ? (app.world.metresAt(p.x, p.z) > 0 ? 1 : -1) : 0
          }
        }
        let coast = 0
        let wet = 0
        for (let j = 1; j < ny - 1; j++) {
          for (let i = 1; i < nx - 1; i++) {
            const a = land[j * nx + i]
            if (a !== 1) continue
            if (![land[j * nx + i + 1], land[j * nx + i - 1], land[(j + 1) * nx + i], land[(j - 1) * nx + i]].includes(-1)) continue
            coast++
            let hit = false
            const cx = i * S + S / 2
            const cy = j * S + S / 2
            for (let y = cy - 9; y <= cy + 9 && !hit; y++) for (let x = cx - 9; x <= cx + 9 && !hit; x++) if (magenta((y * W + x) * 4)) hit = true
            if (hit) wet++
          }
        }
        return { frame, coast, wet }
      }, b64)
    }
    await check('the sea meets the land at Kawaihae and on two other island shores: no seabed shows between them', async () => {
      const lines = await ui('app.overlay.lines')
      await run('app.overlay.lines = false; app.ui.onScrub()')
      await mark(true)
      const rows = []
      try {
        for (const id of shores) {
          await run(`app.ui.card.close(); const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1]); app.settle()`)
          await frames(4)
          const place = await ui(`app.tour.placeOf(app.data.events.find((e) => e.id === '${id}')).id`)
          rows.push({ id, at: 'step', ...(await seabed()) })
          await view(`app.tour.pointView(app.tour.places.get('${place}'), 300)`)
          await frames(4)
          rows.push({ id, at: '300', ...(await seabed()) })
        }
      } finally {
        await mark(false)
        await run(`app.overlay.lines = ${lines}; app.ui.card.close(); app.ui.onScrub()`)
      }
      for (const r of rows) console.log(`      ${r.id} at ${r.at}: ${r.coast} coastline samples, ${r.wet} with seabed showing; ${r.frame} seabed pixels in the frame`)
      const bad = rows.filter((r) => r.wet > 0 || r.frame > 20)
      if (bad.length) throw new Error(`seabed shows: ${bad.map((r) => `${r.id}@${r.at} ${r.wet}/${r.coast} coast, ${r.frame} px`).join('; ')}`)
      if (!rows.every((r) => r.coast > 20)) throw new Error(`too few coastline samples to judge: ${rows.map((r) => r.coast).join(', ')}`)
    })
  }

  // -- the timeline's labels on a phone
  await check('the timeline’s year labels never touch: every other one on a phone, the last always named', async () => {
    const measure = () =>
      ui(`(() => {
        const all = [...document.querySelectorAll('.tl-tick span')]
        const s = all.filter((e) => !e.hidden && e.offsetWidth)
        const r = s.map((e) => e.getBoundingClientRect())
        let touch = []
        for (let i = 1; i < r.length; i++) if (r[i].left < r[i - 1].right + 2) touch.push(s[i - 1].textContent + '/' + s[i].textContent)
        return { n: all.length, shown: s.map((e) => e.textContent), touch, first: s[0] === all[0], last: s.at(-1) === all.at(-1) }
      })()`)
    const out = []
    for (const [w, h] of [[390, 844], [1280, 800]]) {
      await page.setViewportSize({ width: w, height: h })
      await frames(2)
      const m = await measure()
      out.push(`${w} px: ${m.shown.join(' ')}`)
      if (m.touch.length) throw new Error(`at ${w} px the labels ${m.touch.join(', ')} touch`)
      if (!m.first || !m.last || m.shown.length < Math.min(3, m.n)) throw new Error(`at ${w} px it names ${m.shown.join(' ')}`)
    }
    await page.setViewportSize({ width: 1280, height: 800 })
    await frames(2)
    for (const o of out) console.log(`      ${o}`)
  })
}
// ==== [ui6] end ====

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
