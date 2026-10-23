// Dev-only: boot the built app (dist/) in headless Chromium under SwiftShader
// and check the table (ENGINEERING.md §§10–13): the table boots on the
// fixtures and is drawn; the tour opens on the first chapter's card, and Next
// and Back walk it; the clock's slider and chapter ticks move the date and
// open a chapter; the wheel runs from the whole theatre down to an island
// group; the front shows each of its keyframes (held land, the hatch, the
// perimeters, the islands' holders) and cross-fades between them; a pin opens
// its card and a box event's card raises ui.onEnter; pins in one spot gather
// into a cluster that opens a list; the names thin under a hundred; the
// credits panel holds NOTICE.md's notices; the briefing and the after-card
// render from plain objects, people kept to The record; every scene
// ShaderMaterial's compiled source carries the log-depth chunks
// (vFragDepth); the URL's #date and #cam act. Then the box, as src/link.js
// wires it: Enter the battle on the box event's card flies down and cuts into
// the box in watch mode with the briefing open and the table's interface
// hidden, every box material with vFragDepth; a stop walks the battle; a
// moment taken with player.scripted runs twenty seconds of sim time and stays
// finite, and the after-card has its four parts; the browser's Back leaves
// the box; #battle, #t and #moment go straight in with the moment offered.
// No console error on the way. Then the frame time and the heap at the far
// and near zooms (over the Solomons on the real data).
//
// Round two (ROUND-2.md §6), on the built app: the setting is read at boot,
// handed to the Battle and kept as pt.assist; the hash carries #unit and
// #station while a box is the scene and drops them on the table; on the
// real data, the prologue front moves between 1931 and 1941 (the state at
// Mukden differs from the state at 1941-12-06; skipped, and said, while the
// data has no keyframe before 6 December 1941). Then the UI's checks against
// the mock Battle on the dev page ui.html (served by Vite's dev server, as
// it is not in the build) over the real Pearl Harbor and Midway files: the
// unit list opens from the bar and L, by side, ships then air groups, greyed
// rows with their reasons, the kind filter and the keyboard; a row selects;
// the unit card offers the stations (a greyed unit its reason and no
// button); Take the controls takes, the bar holds the stations, Tab cycles
// them, the URL carries the unit and the station; Release opens the
// after-card over the span; an aircraft runs at ×0.5 in Assisted with the
// speed list per kind; the setting persists across a reload; the bookmarks
// mark the strip (hover gives the title, a click takes the bookmark); Start
// here and the setting's line lead the briefing; #unit and #station offer
// the unit after the box is entered and take nothing; a click on the box
// selects within 24 px; the list at phone width; every string the round adds
// keeps the voice rules.
//
//   npm run build -w @vibe-dump/pacific-theatre
//   node tools/fake-data.mjs
//   node tools/smoke.mjs                 (test-data/ unless DATA=real)
//   DATA=real node tools/smoke.mjs
//   CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome (the default)
//   MOCK=0 skips the dev page's checks; MOCK=only runs them alone (no build needed)
//
// Under SwiftShader a frame takes the better part of a second, so the checks
// settle the camera (app.settle()) rather than wait out flights. Adapted from
// holo-i-ke-au's tools/smoke.mjs (b480c27): its harness (the server, the
// browser, check/ui/run/expect/frames) and its perf block (the CDP heap,
// wall-time frames) are kept. The engine's calibrations and every v1
// moment on the real boxes are tools/smoke-battle.mjs's.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'
import { readPNG } from './lib/png.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.PORT || 5298)
const realReady = existsSync(join(root, 'public/data/manifest.json'))
const useTest = process.env.DATA ? process.env.DATA !== 'real' : true
// the dev page's checks (ROUND-2 §6 against the mock Battle): MOCK=0 skips them, MOCK=only runs them alone
const MOCK = process.env.MOCK ?? '1'
const MOCK_ONLY = MOCK === 'only'
if (!useTest && !realReady) throw new Error('DATA=real but public/data/manifest.json does not exist yet')
if (!MOCK_ONLY && useTest && !existsSync(join(root, 'test-data/manifest.json'))) throw new Error('no test-data/: run node tools/fake-data.mjs first')
if (!MOCK_ONLY && !existsSync(join(root, 'dist/index.html'))) throw new Error('no dist/: run npm run build -w @vibe-dump/pacific-theatre first')
const shots = join(root, 'tools/shots')
mkdirSync(shots, { recursive: true })

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
const warnings = []
const infos = []
/** A page's errors and warnings into the run's lists (the fixtures have no kits/weapons.json: the app warns and flies on the kits' own numbers, so that one 404 is not an error). */
const listen = (p, tag = '') => {
  p.on('pageerror', (e) => errors.push(`${tag}pageerror: ${e.message}`))
  p.on('console', (m) => {
    const t = m.text()
    if (m.type() === 'error' && useTest && /404/.test(t) && /kits\/weapons\.json$/.test(m.location()?.url || '')) return warnings.push(`${tag}${t} (kits/weapons.json: the fixtures have none)`)
    if (m.type() === 'error') errors.push(`${tag}console: ${t}`)
    else if (m.type() === 'warning') warnings.push(`${tag}${t}`)
    else infos.push(t)
  })
}
listen(page)

let failed = 0
const check = async (name, fn) => {
  try {
    const note = await fn()
    console.log('  ✓', name + (note ? ` — ${note}` : ''))
  } catch (err) {
    failed++
    console.log('  ✗', name, '—', err.message.split('\n')[0])
  }
}
let perf = null
// (the built app's checks, the first round's and round two's; MOCK=only goes straight to the dev page's)
main: {
if (MOCK_ONLY) break main
const t0 = Date.now()
await page.goto(`http://127.0.0.1:${port}/dist/index.html${useTest ? '?data=../test-data/' : ''}`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
await page.waitForFunction(() => window.__app?.ready, null, { timeout: 120000 })
console.log(`booted in ${Date.now() - t0} ms on ${useTest ? 'test' : 'real'} data`)

const ui = (expr) => page.evaluate(new Function(`const app = window.__app; return ${expr}`))
const run = (body) => page.evaluate(new Function(`const app = window.__app; return (async () => { ${body} })()`))
const expect = async (expr, want) => {
  const got = await ui(expr)
  if (got !== want) throw new Error(`${expr} = ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`)
}
const frames = async (n) => {
  const f0 = await ui('app.frames')
  await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 180000 })
}
/** Screenshot → { mean luminance, its spread, the share of blue-dominant pixels, distinct colours }. */
const look = async (file, clip) => {
  const buf = await page.screenshot({ path: join(shots, file), clip })
  const img = readPNG(buf)
  const { width, height, channels, data } = img
  let s = 0
  let s2 = 0
  let blue = 0
  let red = 0
  const seen = new Set()
  const n = width * height
  for (let i = 0; i < n; i++) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
    s += l
    s2 += l * l
    if (b > r + 12 && b > g - 10) blue++
    if (r > g + 30 && r > b + 30) red++
    if (i % 7 === 0) seen.add((r >> 3) * 1024 + (g >> 3) * 32 + (b >> 3))
  }
  const mean = s / n
  return { mean: +mean.toFixed(1), spread: +Math.sqrt(Math.max(0, s2 / n - mean * mean)).toFixed(1), blue: +(blue / n).toFixed(3), red: +(red / n).toFixed(4), colours: seen.size }
}
/** Every ShaderMaterial in the active scene, compiled: how many, and which lack vFragDepth in either compiled stage. */
const shaderAudit = () =>
  run(`
    const r = app.renderer
    const s = app.active
    r.compile(s.scene, s.camera)
    const gl = r.getContext()
    const out = { materials: 0, missing: [], uncompiled: [] }
    const seen = new Set()
    s.scene.traverse((o) => {
      for (const m of [].concat(o.material || [])) {
        if (!m || !m.isShaderMaterial || seen.has(m)) continue
        seen.add(m)
        out.materials++
        const prog = r.properties.get(m).currentProgram
        if (!prog) { out.uncompiled.push((o.name || o.type) + ':' + m.uuid.slice(0, 6)); continue }
        const vs = gl.getShaderSource(prog.vertexShader) || ''
        const fs = gl.getShaderSource(prog.fragmentShader) || ''
        if (!vs.includes('vFragDepth') || !fs.includes('vFragDepth')) out.missing.push((o.name || o.type) + ':' + (m.name || m.uuid.slice(0, 6)))
      }
    })
    return out
  `)
// the whole theatre, the camera straight to it
const HOME = `const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: h.distance, yaw: h.yaw, pitch: h.pitch }); app.settle()`
// a fixture's keyframes and the box event (the real data's first two keyframes and first box event otherwise)
const KF = await ui('[...app.data.fronts.keyframes.keys()]')
const BOX_EV = await ui('app.data.events.find((e) => e.box && app.data.boxById.has(e.box))?.id ?? null')

await check('the table boots on the fixtures and is the active scene', async () => {
  await expect('app.mode', 'table')
  await expect('app.active === app.table', true)
  await expect('app.renderer.capabilities.logarithmicDepthBuffer', true)
  const n = await ui('app.table.ground.terrain.stats().nodes')
  if (!(n > 0)) throw new Error(`the relief draws ${n} nodes`)
  const s = await ui('app.stats()')
  return `${n} relief nodes, exaggeration ${s.exag}, ${s.calls} draw calls, ${s.gpu}`
})

await check("the tour opens on the first chapter's card, the clock at its keyframe", async () => {
  const st = await ui('app.tour.state')
  if (!st.active || st.chapter !== 0 || st.step !== -1) throw new Error(`tour ${JSON.stringify(st)}`)
  await expect('app.ui.card.mode', 'chapter')
  const want = await ui('app.tour.chapterDate(app.tour.chapters[0])')
  const got = await ui('app.clock.date')
  if (Math.abs(got - want) > 60000) throw new Error(`the clock is at ${new Date(got).toISOString()}, the chapter's date ${new Date(want).toISOString()}`)
  const pill = await ui("document.querySelector('.tl-tour').textContent")
  await look('smoke-chapter.png')
  return `“${pill.trim()}”; ${await ui("document.querySelector('.card h1').textContent")}`
})

await check('the table is drawn: relief, sea and land in the frame', async () => {
  await run(`${HOME}; app.ui.card.close()`)
  await frames(3)
  const l = await look('smoke-table.png')
  if (l.spread < 8 || l.colours < 60) throw new Error(`a flat frame: ${JSON.stringify(l)}`)
  if (l.blue < 0.15) throw new Error(`hardly any sea: ${JSON.stringify(l)}`)
  return JSON.stringify(l)
})

await check('the names thin by rank and collision, under a hundred on screen, kanji through lang="ja"', async () => {
  const far = await ui('app.table.labels.visible()')
  await run(`app.table.rig.jump({ x: -213, z: -1168, distance: 1500, yaw: 0, pitch: 1.0 }); app.settle()`)
  await frames(3)
  const near = await ui('app.table.labels.visible()')
  if (!far.length || far.length >= 100 || near.length >= 100) throw new Error(`far ${far.length}, near ${near.length}`)
  const ja = await ui(`document.querySelectorAll('.label.show .lb-ja[lang="ja"]').length`)
  return `far: ${far.join(', ')}; near: ${near.join(', ')}; ${ja} with a Japanese name`
})

await check("the tour's Next and Back walk chapters, events and their table stops", async () => {
  await run(`app.tour.goTo(0, -1, { jump: true }); app.settle()`)
  const seq = []
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowRight')
    seq.push(await ui('app.tour.state'))
  }
  const back = []
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press('ArrowLeft')
    back.push(await ui('app.tour.state'))
  }
  await run('app.settle()')
  await frames(2)
  const fmt = (s) => `${s.chapter}.${s.step}${s.stop >= 0 ? `/${s.stop}` : ''}`
  // each Next moves forward, each Back moves back, and the card follows
  const order = (s) => s.chapter * 1e6 + (s.step + 1) * 1e3 + (s.stop + 1)
  for (let i = 1; i < seq.length; i++) if (!(order(seq[i]) > order(seq[i - 1]))) throw new Error(`Next did not move on: ${seq.map(fmt).join(' → ')}`)
  if (!(order(back[0]) < order(seq.at(-1)) && order(back[1]) < order(back[0]))) throw new Error(`Back did not move back: ${back.map(fmt).join(' → ')}`)
  await look('smoke-tour.png')
  return `next ${seq.map(fmt).join(' → ')}; back ${back.map(fmt).join(' → ')}; card ${await ui('app.ui.card.mode')}`
})

await check("the clock: a tick per chapter, a tick opens its chapter's card, the slider moves the date and leaves the tour", async () => {
  const n = await ui("document.querySelectorAll('.tl-tick').length")
  const nc = await ui('app.clock.chapters.length')
  if (n !== nc) throw new Error(`${n} ticks for ${nc} chapters`)
  const i = Math.min(2, nc - 1)
  await page.click(`.tl-tick[data-i="${i}"]`)
  await run('app.settle()')
  const st = await ui('app.tour.state')
  if (st.chapter !== i || st.step !== -1) throw new Error(`the tick opened ${JSON.stringify(st)}`)
  await expect('app.ui.card.mode', 'chapter')
  await frames(2)
  await look('smoke-tick.png')
  const before = await ui('app.clock.date')
  await run(`const el = document.querySelector('.tl-input'); el.value = '0.62'; el.dispatchEvent(new Event('input', { bubbles: true }))`)
  const after = await ui('app.clock.date')
  await expect('app.tour.active', false)
  await expect('Math.abs(app.clock.s - 0.62) < 1e-6', true)
  const label = await ui("document.querySelector('.tl-year').textContent")
  if (after === before) throw new Error('the slider did not move the date')
  return `tick ${i} → chapter ${st.chapter}; slider at 0.62 → ${label}`
})

await check('the wheel runs from the whole theatre down to an island group', async () => {
  await run(HOME)
  await frames(2)
  const d0 = await ui('app.table.rig.goal.distance')
  await page.mouse.move(640, 400)
  for (let i = 0; i < 16; i++) await page.mouse.wheel(0, -150)
  await run('app.settle()')
  await frames(3)
  const s = await ui('app.stats()')
  const min = await ui('app.table.rig.minDistance')
  if (!(s.distance < d0 / 20 && s.distance >= min)) throw new Error(`from ${d0.toFixed(0)} km to ${s.distance} km`)
  const l = await look('smoke-wheel.png')
  if (l.spread < 4) throw new Error(`a flat frame close in: ${JSON.stringify(l)}`)
  return `${d0.toFixed(0)} km → ${s.distance} km, exaggeration ${s.exag}, ${s.nodes} nodes; ${JSON.stringify(l)}`
})

await check("the front at its keyframes: held land, the hatch, the perimeters, the islands' holders, cross-faded between", async () => {
  if (KF.length < 2) throw new Error(`${KF.length} keyframes in the data`)
  await run(`app.ui.card.close(); app.ui.onScrub()`)
  await page.mouse.move(5, 795)
  const at = async (date, name) => {
    await run(`app.clock.setDate(Date.parse('${date}T12:00:00Z')); app.table.rig.jump({ x: 800, z: 200, distance: 7000, yaw: 0, pitch: 1.05 }); app.settle()`)
    await frames(3)
    const r = await ui(`(() => { const f = app.table.front; const lg = f.legend(); return { pair: f.pair, k: app.table.frontUniforms.uFrontK.value, t: app.table.frontUniforms.uFrontT.value, states: lg?.states.map((s) => s.id), isles: f.isleShown, perimeters: [...f.perimeters.entries()].map(([id, p]) => [id, +p.k.toFixed(2)]) } })()`)
    r.look = await look(name)
    return r
  }
  const a = await at(KF[0], 'smoke-front-a.png')
  const b = await at(KF[1], 'smoke-front-b.png')
  if (a.pair.a !== KF[0] || b.pair.a !== KF[1] || a.k < 0.99 || b.k < 0.99) throw new Error(`pairs ${JSON.stringify(a.pair)} / ${JSON.stringify(b.pair)}, strength ${a.k} / ${b.k}`)
  if (JSON.stringify(a.states) === JSON.stringify(b.states) && a.look.red === b.look.red) throw new Error('the two keyframes look the same')
  const mid = new Date((Date.parse(KF[0]) + Date.parse(KF[1])) / 2).toISOString().slice(0, 10)
  const m = await at(mid, 'smoke-front-mid.png')
  if (!(m.t > 0.2 && m.t < 0.8)) throw new Error(`between the keyframes the cross-fade is at ${m.t}`)
  // the hatch, close on a contested polygon over land, if a keyframe has one
  const c = await ui(`(() => { for (const [id, kf] of app.table.front.keyframes) for (const f of kf.geojson?.features || []) if (f.properties?.state === 'contested' && f.geometry?.type === 'Polygon') { const r = f.geometry.coordinates[0]; let x = 0, z = 0; for (const p of r) { const w = app.data.proj.toWorld(p); x += w[0]; z += w[1] } x /= r.length; z /= r.length; if (app.table.ground.metresAt(x, z) > 0) return { id, x, z } } return null })()`)
  let hatch = ''
  if (c) {
    await run(`app.clock.setDate(Date.parse('${c.id}T12:00:00Z')); app.table.rig.jump({ x: ${c.x}, z: ${c.z}, distance: 1500, yaw: 0, pitch: 1.0 }); app.settle()`)
    await frames(3)
    const h = await look('smoke-front-hatch.png')
    hatch = `; the hatch close in ${JSON.stringify(h)}`
  }
  return `${KF[0]}: ${a.states.join(', ')} (isles ${a.isles}); ${KF[1]}: ${b.states.join(', ')} (isles ${b.isles}); ${mid}: t ${m.t.toFixed(2)}, perimeters ${JSON.stringify(m.perimeters)}${hatch}`
})

await check("a pin opens its card, and a box event's card raises ui.onEnter", async () => {
  if (!BOX_EV) throw new Error('no box event in the data')
  await run(`app.ui.card.close(); app.ui.onScrub(); const ev = app.data.events.find((e) => e.id === '${BOX_EV}'); app.clock.setDate(app.ui.tour.stepDate(ev, app.ui.tour.chapters[app.ui.tour.locate(ev)[0]])); app.table.rig.jump(app.ui.tour.eventView(ev)); app.settle()`)
  await frames(3)
  await page.click(`.pin.show[data-ev="${BOX_EV}"]`, { timeout: 30000 })
  await run('app.settle()')
  await frames(2)
  await expect('app.ui.card.mode', 'event')
  await expect('app.ui.card.ev.id', BOX_EV)
  const routes = await ui('app.table.routes.visibleRoutes().map((r) => r.id)')
  await run(`window.__entered = null; window.__onEnter = app.ui.onEnter; app.ui.onEnter = (ev) => { window.__entered = ev.id }`)
  await page.click('.card .nav.enter')
  await expect('window.__entered', BOX_EV)
  await run('app.ui.onEnter = window.__onEnter')
  await look('smoke-card.png')
  return `${BOX_EV}: “${await ui("document.querySelector('.card h1').textContent")}”, ${await ui("document.querySelector('.card .when').textContent")}; routes on ${routes.join(', ') || 'none'}; Enter the battle raised onEnter`
})

await check('pins in one spot gather into a cluster, whose list opens on the card', async () => {
  // the date of the box event, seen from the whole theatre, where its neighbours in the window gather with it;
  // on the real data (7 December 1941 has none at the far zoom), the first chapter keyframe that has one
  await run(`app.ui.card.close(); app.ui.pins.activeEvent = null; app.table.setFocus(null); app.ui.onScrub(); app.table.rig.jump({ x: app.table.rig.homeView().target.x, z: app.table.rig.homeView().target.z, distance: app.table.rig.maxDistance, yaw: 0, pitch: 1.12 }); app.settle()`)
  await frames(3)
  let groups = await ui('app.ui.pins.groups()')
  const dates = useTest ? [] : await ui('app.data.events.filter((e) => e.when?.from).map((e) => Date.parse(e.when.from)).filter(Number.isFinite).sort((a, b) => a - b).filter((d, i, a) => i % 6 === 0)')
  for (const d of dates) {
    if (groups.length) break
    await run(`app.clock.setDate(${d}); app.settle()`)
    await frames(2)
    groups = await ui('app.ui.pins.groups()')
  }
  if (!groups.length) throw new Error(`no cluster on ${await ui('new Date(app.clock.date).toISOString()')}; pins showing: ${(await ui('app.ui.pins.visibleEvents().map((e) => e.id)')).join(', ')}`)
  await page.click('.cluster.show')
  await expect('app.ui.card.mode', 'cluster')
  const rows = await ui("document.querySelectorAll('.card .ev-row').length")
  if (rows !== groups[0].count) throw new Error(`${rows} rows for a cluster of ${groups[0].count}`)
  await look('smoke-cluster.png')
  return `${groups.map((g) => `[${g.ids.join(' ')}]`).join(' ')}; the list has ${rows}`
})

await check("the Sources and credits panel holds NOTICE.md's notices and the boxes' credits", async () => {
  await page.click('[data-tool="sources"]')
  await expect('app.ui.card.mode', 'credits')
  const text = await ui("document.querySelector('.card').textContent")
  for (const s of ['produced using Copernicus WorldDEM-30', 'do not incur any liability', 'GMRT', 'ETOPO 2022', 'Natural Earth', 'SIL Open Font License']) if (!text.includes(s)) throw new Error(`no “${s}”`)
  await look('smoke-credits.png')
  await page.click('.card .card-close')
  return `${text.length} characters`
})

await check('the briefing and the after-card render from plain objects; people stay in The record', async () => {
  await run(`app.ui.openBriefing({ title: 'Test briefing', ja: { kanji: '試験海戦', romaji: 'Shiken kaisen' }, when: '4 June 1942, 10:20', clock: 'test clock', situation: 'Test situation.', forces: [{ name: 'Test side A', units: ['A1', 'A2'] }, { name: 'Test side B', units: ['B1'] }], moments: [{ id: 'test-dive', title: 'A test dive', role: 'a test aircraft', t: '10:21:30', objective: 'Test objective.', focus: true }], sources: ['test-source-a'], credit: 'Test credit line.' })`)
  await expect('app.ui.card.mode', 'briefing')
  await run(`window.__took = null; window.__onTake = app.ui.onTake; app.ui.onTake = (id) => { window.__took = id }`)
  await page.click('.card .nav.take')
  await expect('window.__took', 'test-dive')
  await run('app.ui.onTake = window.__onTake')
  await run(`app.ui.openAfter({ momentId: 'test-dive', title: 'A test dive', sortie: [{ label: 'Hits', value: 'one, aft' }, { label: 'Crew', value: '120 men lost' }], battle: { rows: [{ what: 'Test carrier', record: 'sank 19:25', yours: 'sinks 19:25 as in the record' }] }, record: { text: 'Test: between 1,000 and 1,200 men lost their lives.', sources: ['test-source-a'] }, next: { text: 'Test next.' }, retry: { start: true, checkpoint: true } })`)
  await expect('app.ui.card.mode', 'after')
  const parts = await ui("[...document.querySelectorAll('.after-part h2')].map((h) => h.textContent.trim())")
  const sortie = await ui("document.querySelector('.after-part[data-part=sortie]').textContent")
  const record = await ui("document.querySelector('.after-part[data-part=record]').textContent")
  if (parts.length !== 4 || !parts.every((p) => /[ぁ-んァ-ン一-龯]/.test(p))) throw new Error(`parts ${JSON.stringify(parts)}`)
  if (/men/.test(sortie) || !/1,200 men/.test(record)) throw new Error('a count of people outside The record, or none in it')
  await look('smoke-after.png')
  await run('app.ui.card.close()')
  return parts.join(' | ')
})

await check('every scene ShaderMaterial on the table carries vFragDepth', async () => {
  const a = await shaderAudit()
  if (!a.materials) throw new Error('no ShaderMaterials found')
  if (a.missing.length || a.uncompiled.length) throw new Error(`missing in ${a.missing.join(', ')}; uncompiled ${a.uncompiled.join(', ')}`)
  return `${a.materials} materials`
})

await check('the hash carries the date and the camera', async () => {
  await page.waitForFunction(() => /date=\d{4}-\d{2}-\d{2}/.test(location.hash) && /cam=/.test(location.hash), null, { timeout: 60000 })
  return await ui('location.hash')
})

await check('#date and #cam act; other keys are kept', async () => {
  const [bx, bz] = await ui('(() => { const h = app.table.rig.homeView(); return [+(h.target.x + 200).toFixed(1), +(h.target.z - 150).toFixed(1)] })()')
  await run(`location.hash = '#date=1942-06-04&cam=${bx},${bz},2400,0.3,0.9&keep=me'`)
  await page.waitForFunction(() => Math.abs(window.__app.clock.date - Date.UTC(1942, 5, 4)) < 1000, null, { timeout: 30000 })
  await frames(2)
  const g = await ui('[app.table.rig.goal.target.x, app.table.rig.goal.target.z, app.table.rig.goal.distance]')
  if (Math.abs(g[0] - bx) > 0.5 || Math.abs(g[1] - bz) > 0.5 || Math.abs(g[2] - 2400) > 1) throw new Error(`the rig is at ${g}`)
  await page.waitForFunction(() => /keep=me/.test(location.hash), null, { timeout: 30000 })
  return await ui('location.hash')
})

// The box (ENGINEERING §§8–9, 11, wired by src/link.js): entered from its card, the hand-over's cut, watched
// with the briefing open, walked by its stops, a moment taken with player.scripted and scripted input, the
// after-card, Back to leave, and the URL straight into a box.
const BOX = await ui(`app.data.events.find((e) => e.id === '${BOX_EV}')?.box ?? null`)
await check("Enter the battle flies down, cuts into the box in watch mode and opens the briefing, the table's interface hidden", async () => {
  if (!BOX) throw new Error('no box event')
  await run(`app.ui.card.close(); const ev = app.data.events.find((e) => e.id === '${BOX_EV}'); app.ui.tour.open(ev); app.settle()`)
  await frames(2)
  await page.click('.card .nav.enter')
  await page.waitForFunction(() => window.__app.mode === 'watch' && window.__app.active === window.__app.battle.scene, null, { timeout: 600000 })
  await frames(3)
  const r = await ui(`({ box: app.battle.state.boxId, card: app.ui.card.mode, moments: document.querySelectorAll('.card .nav.take').length, bar: !document.querySelector('.boxbar').hidden, timeline: document.querySelector('.timeline').hidden, pins: document.querySelectorAll('.pin.show, .cluster.show, .label.show').length, hash: location.hash, running: app.battle.running, slots: app.battle.sim.capacity })`)
  if (r.box !== BOX || r.card !== 'briefing' || !r.bar || !r.timeline || r.pins || !r.running || !/battle=/.test(r.hash)) throw new Error(JSON.stringify(r))
  const a = await shaderAudit()
  if (a.missing.length || a.uncompiled.length) throw new Error(`vFragDepth missing in ${a.missing.join(', ')}; uncompiled ${a.uncompiled.join(', ')}`)
  const s = await ui('app.stats()')
  if (!(s.nodes > 0)) throw new Error(`the box terrain draws ${s.nodes} nodes`)
  const l = await look('smoke-box.png')
  if (l.spread < 4) throw new Error(`a flat frame: ${JSON.stringify(l)}`)
  return `${r.box}: ${r.slots} slots, ${r.moments} moments offered, ${a.materials} materials with vFragDepth, ${s.calls} draw calls; ${r.hash}`
})

await check("a box's stops walk its battle, each with its card", async () => {
  await page.keyboard.press('ArrowRight')
  await frames(2)
  const r = await ui(`({ mode: app.ui.card.mode, stop: app.link.stop, t: app.battle.sim.t, want: app.battle.sim.record.stops[app.link.stop]?.t, text: document.querySelector('.card .card-body')?.textContent.slice(0, 60) })`)
  if (r.mode !== 'stop' || r.stop < 0 || Math.abs(r.t - r.want) > 2) throw new Error(JSON.stringify(r))
  await look('smoke-stop.png')
  return `stop ${r.stop + 1}: “${r.text}…”`
})

await check('round two: the hash carries #unit and #station while a box is the scene, and lets them go (App.hashNow)', async () => {
  // (link.js writes app.url.unit and .station while a unit is held and clears them each frame otherwise; today's Battle has
  // no take(), so the keys are set here and the hash composed at once, before link.js's frame lets them go)
  const r = await run(`app.url.unit = 'smoke-unit#2'; app.url.station = 'gunner'; const inBox = app.hashNow(); const saved = app.active; app.active = app.table; const onTable = app.hashNow(); app.active = saved; app.url.unit = null; app.url.station = null; return { inBox, onTable, after: app.hashNow() }`)
  if (!/&unit=smoke-unit%232&station=gunner/.test(r.inBox) || /unit=|station=/.test(r.onTable) || /unit=|station=/.test(r.after)) throw new Error(JSON.stringify(r))
  return r.inBox
})

await check('a moment taken with player.scripted runs twenty seconds of sim time, stays finite, and the after-card has its four parts', async () => {
  const id = await ui('[...app.battle.sim.record.moments.keys()][0]')
  await run(`app.ui.card.close(); app.take('${id}'); const pl = app.battle.sim.player; pl.scripted = true; app.battle.pause()`)
  await expect('app.mode', 'moment')
  await run(`const sim = app.battle.sim; const pl = sim.player; const t1 = sim.t + 20; while (sim.t < t1 && !sim.momentState.done) { const st = pl.state; if (pl.kind === 'aircraft') { pl.input.aimDir = [Math.sin(st.heading * Math.PI / 180), (Math.max(300, st.y) - st.y) / 2000, -Math.cos(st.heading * Math.PI / 180)]; pl.input.throttle = 0.8 } else { pl.input.telegraph = 1; pl.input.helm = 0.2 } sim.advance(8 / 60) }`)
  await frames(2)
  const bad = await ui(`(() => { const s = app.battle.sim.state; for (const k of ['pos', 'quat', 'vel', 'speed', 'heading', 'damage', 'fire', 'list']) for (const v of s[k]) if (!Number.isFinite(v)) return k; return null })()`)
  if (bad) throw new Error(`state.${bad} is not finite`)
  const a = await shaderAudit()
  if (a.missing.length || a.uncompiled.length) throw new Error(`vFragDepth missing in ${a.missing.join(', ')}`)
  await look('smoke-moment.png')
  await run(`app.battle.finish('card')`)
  await page.waitForSelector('.card.show[data-mode=after]', { timeout: 60000 })
  const parts = await ui("[...document.querySelectorAll('.after-part h2')].map((h) => h.textContent.trim())")
  if (parts.length !== 4) throw new Error(`parts ${JSON.stringify(parts)}`)
  await expect('app.mode', 'watch')
  await look('smoke-after-real.png')
  return `${id}: ${parts.join(' | ')}`
})

await check("Back leaves the box: the table at the battle's date, the outline gone, the overlays back", async () => {
  await page.goBack()
  await page.waitForFunction(() => window.__app.mode === 'table' && window.__app.active === window.__app.table && !window.__app.battle.scene, null, { timeout: 300000 })
  await run('app.settle()')
  await frames(3)
  await expect(`!!app.table.outlines.get('${BOX}')?.on`, false)
  await expect("document.querySelector('.timeline').hidden", false)
  await expect("document.querySelector('.boxbar').hidden", true)
  await expect('app.table.fade', 1)
  return await ui('location.hash')
})

await check('#battle, #t and #moment go straight into the box, the moment offered and not taken', async () => {
  const m = await run(`const r = await fetch(app.data.abs(app.data.boxById.get('${BOX}').battle)); const B = await r.json(); return { id: B.moments[0].id, t: B.stops[1]?.t ?? B.stops[0].t }`)
  await run(`location.hash = '#battle=${BOX}&t=${m.t}&moment=${m.id}'`)
  await page.waitForFunction(() => window.__app.mode === 'watch' && window.__app.active === window.__app.battle.scene, null, { timeout: 600000 })
  await frames(2)
  const r = await ui(`({ t: app.battle.sim.clock.label(app.battle.sim.t), card: app.ui.card.mode, focus: document.activeElement?.dataset?.take ?? document.querySelector('.card .take.focus')?.dataset.take, mode: app.mode })`)
  if (r.card !== 'briefing' || r.focus !== m.id || r.mode !== 'watch') throw new Error(JSON.stringify(r))
  await page.click('.boxbar .bb-leave')
  await page.waitForFunction(() => window.__app.mode === 'table' && !window.__app.battle.scene, null, { timeout: 300000 })
  return `${BOX} at ${r.t} (asked ${m.t}), ${m.id} focused`
})

await check('round two: the setting is read at boot, handed to the Battle and kept as pt.assist', async () => {
  const boot = await ui(`({ app: app.assist, battle: app.battle.assist, kept: localStorage.getItem('pt.assist') })`)
  if (!['assisted', 'pilot'].includes(boot.app) || boot.battle !== boot.app) throw new Error(JSON.stringify(boot))
  await run(`app.setAssist('pilot')`)
  const p = await ui(`({ app: app.assist, battle: app.battle.assist, kept: localStorage.getItem('pt.assist') })`)
  await run(`app.setAssist('assisted')`)
  const a = await ui(`localStorage.getItem('pt.assist')`)
  if (p.app !== 'pilot' || p.battle !== 'pilot' || p.kept !== 'pilot' || a !== 'assisted') throw new Error(`${JSON.stringify(p)}, then ${a}`)
  return `boot ${JSON.stringify(boot)}; Pilot kept, Assisted kept`
})

await check('round two: the prologue front moves between 1931 and 1941 (Mukden against 6 December 1941)', async () => {
  if (useTest) return 'the fixtures have no prologue (the real data is the check)'
  const kfs = await ui(`(app.data.fronts.manifest.keyframes || []).map((k) => k.date)`)
  const pro = kfs.filter((d) => d < '1941-12-06')
  if (!pro.length) {
    // (content-2 delivers the six prologue keyframes; until they are merged this says so, and the integrator sees it pass)
    console.log(`      – skipped: no keyframe before 1941-12-06 in the data yet (${kfs.length} keyframes); content-2's six land with the merge`)
    return 'skipped'
  }
  await run(`app.ui.card.close(); app.ui.onScrub()`)
  const at = async (date, name) => {
    // (Manchuria, Korea and north China in the frame: centred between Mukden and Peking)
    await run(`app.clock.setDate(Date.parse('${date}T12:00:00Z')); const [x, z] = app.data.proj.toWorld([121, 39]); app.table.rig.jump({ x, z, distance: 5000, yaw: 0, pitch: 1.05 }); app.settle()`)
    await frames(3)
    const r = await ui(`(() => { const f = app.table.front; const lg = f.legend(); return { pair: f.pair, states: lg?.states.map((s) => s.id + ':' + s.label), keyframe: lg?.keyframe } })()`)
    r.look = await look(name)
    return r
  }
  const a = await at('1931-09-18', 'smoke-front-1931.png')
  const b = await at('1941-12-06', 'smoke-front-1941.png')
  if (a.pair.a === b.pair.a && JSON.stringify(a.states) === JSON.stringify(b.states)) throw new Error(`the front is the same at both dates: ${JSON.stringify(a)}`)
  if (Math.abs(a.look.red - b.look.red) < 0.002 && a.look.mean === b.look.mean) throw new Error(`the two dates look the same: ${JSON.stringify(a.look)} / ${JSON.stringify(b.look)}`)
  return `${pro.length} prologue keyframes; 1931-09-18 on ${a.pair.a} (red ${a.look.red}), 1941-12-06 on ${b.pair.a} (red ${b.look.red})`
})

// What the page costs: the JS heap after a collection, and the frame time on
// the table held still at the whole theatre (far) and over an island group
// (near). Under the software renderer the frame times are the CPU's, shared
// with whatever else the machine runs: compare them only with each other.
await check('perf', async () => {
  const cdp = await page.context().newCDPSession(page)
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
  const scene = () => ui('(() => { const s = app.stats(); return { distance: s.distance, calls: s.calls, triangles: s.triangles, nodes: s.nodes, exag: s.exag, labels: s.labels } })()')
  const out = { heapMB: await heapMB() }
  await run(`app.ui.card.close(); ${HOME}`)
  await frames(3)
  out['table.far.ms'] = await frameMs(8)
  out['table.far'] = await scene()
  // (the fixture's island group, or the Solomons on the real data)
  await run(`const p = app.data.places.find((x) => x.id === 'guadalcanal') || null; const [x, z] = p && p.geometry?.type === 'Point' ? app.data.proj.toWorld(p.geometry.coordinates) : [-213, -1168]; app.table.rig.jump({ x, z, distance: 300, yaw: 0, pitch: 0.9 }); app.settle()`)
  await frames(3)
  out['table.near.ms'] = await frameMs(8)
  out['table.near'] = await scene()
  out.heapAfterMB = await heapMB()
  out.textures = await ui('app.renderer.info.memory.textures')
  out.programs = await ui('app.renderer.info.programs.length')
  perf = out
  console.log('      perf', JSON.stringify(out))
})
} // main

const stats = MOCK_ONLY ? null : await page.evaluate(() => window.__app.stats())
if (stats) console.log('stats', JSON.stringify(stats))
// (the built app's page lets go of its WebGL before the dev page's checks, so their frames are not starved)
await page.close()

// ---------------------------------------------------------------------------------------------
// Round two's interface against the mock Battle (ROUND-2 §6; src/ui/mock-battle.js): the dev page
// ui.html, served by Vite's dev server (it is not in the build), over the real battle files.
if (MOCK !== '0') {
  const { createServer: viteServer } = await import('vite')
  const vite = await viteServer({ root, configFile: join(root, 'vite.config.js'), logLevel: 'error', clearScreen: false, server: { port: Number(process.env.MOCK_PORT || 5296), host: '127.0.0.1', strictPort: false, hmr: false } })
  await vite.listen()
  const mport = vite.httpServer.address().port
  const base = `http://127.0.0.1:${mport}/ui.html`
  console.log(`the dev page on ${base}`)
  const mp = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  listen(mp, 'ui.html: ')
  const mui = (expr) => mp.evaluate(new Function(`const app = window.__app; return ${expr}`))
  const mrun = (body) => mp.evaluate(new Function(`const app = window.__app; return (async () => { ${body} })()`))
  const open = async (q, p = mp) => {
    await p.goto(`${base}${q}`)
    await p.waitForFunction(() => window.__app?.ready && window.__app.battle?.sim, null, { timeout: 120000 })
    await p.waitForTimeout(300)
  }
  const tick = (ms = 400) => mp.waitForTimeout(ms)
  const mshot = (name, p = mp) => p.screenshot({ path: join(shots, name) })
  const idOf = (id) => mui(`app.link.units().find((u) => u.id === ${JSON.stringify(id)})?.index ?? null`)
  const calls = (kind) => mui(`app.battle.calls.filter((c) => c[0] === ${JSON.stringify(kind)})`)
  // what the round adds, held to the voice rules (DESIGN §7.3–7.4, R8 §5; tools/check/common.mjs's matchers)
  const { SLURS, GLORY, ANNOUNCES, PEOPLE_NUMBER } = await import('./check/common.mjs')
  const GAME = /\b(kills?|score[sd]?|wins?|won|victor(?:y|ies)|defeat|enem(?:y|ies)|mission accomplished|destroyed)\b/i
  const texts = []
  const collect = async (what) => texts.push({ what, text: await mui(`[...document.querySelectorAll('.unitlist:not([hidden]), .card.show, .boxbar:not([hidden])')].map((el) => { const c = el.cloneNode(true); c.querySelectorAll('.sources, .tellings').forEach((x) => x.remove()); return c.innerText }).join('\\n')`) })

  await open('?box=pearl-harbor&t=08:40&paused')

  await check('ui.html: the unit list opens from the bar and L, by side, ships then air groups, greyed rows with their reasons', async () => {
    await mrun(`app.ui.card.close()`)
    await mp.click('.boxbar .bb-units')
    await tick()
    const r = await mui(`(() => { const sides = [...document.querySelectorAll('.ul-side')].map((s) => ({ side: s.dataset.side, secs: [...s.querySelectorAll('.ul-sec h4')].map((h) => h.textContent) })); const row = (n) => [...document.querySelectorAll('.ul-row')].find((r) => r.querySelector('.ul-name b')?.textContent === n); const why = (n) => row(n)?.querySelector('.ul-why')?.textContent ?? null; return { open: !document.querySelector('.unitlist').hidden, rows: document.querySelectorAll('.ul-row').length, sides, arizona: why('Arizona'), solace: why('Solace'), nevada: why('Nevada'), midget: [...document.querySelectorAll('.ul-row.grey .ul-why')].map((e) => e.textContent).find((t) => /tokk/.test(t)) ?? null, ground: [...document.querySelectorAll('.ul-row.grey .ul-why')].some((e) => e.textContent === 'on the ground'), firstShip: document.querySelector('.ul-side[data-side=us] .ul-sec .ul-row .ul-name b')?.textContent } })()`)
    if (!r.open || r.rows < 20) throw new Error(JSON.stringify(r))
    if (r.sides.map((s) => s.side).join() !== 'jp,us' || r.sides.some((s) => s.secs[0] !== 'Ships')) throw new Error(`sides ${JSON.stringify(r.sides)}`)
    if (r.arizona !== 'fate is fixed' || r.solace !== 'hospital ship' || r.nevada !== null || !r.midget || !r.ground) throw new Error(JSON.stringify(r))
    await collect('the list')
    await mshot('smoke-ui-list.png')
    // L closes it and opens it again (the canvas has the focus, as in a box)
    await mp.focus('#plan').catch(() => {})
    await mrun(`document.activeElement?.blur()`)
    await mp.keyboard.press('KeyL')
    const closed = await mui(`document.querySelector('.unitlist').hidden`)
    await mp.keyboard.press('KeyL')
    const reopened = await mui(`!document.querySelector('.unitlist').hidden`)
    if (!closed || !reopened) throw new Error(`L: closed ${closed}, reopened ${reopened}`)
    return `${r.rows} rows; ${r.sides.map((s) => `${s.side}: ${s.secs.join(', ')}`).join('; ')}; Arizona “${r.arizona}”, Solace “${r.solace}”, “${r.midget}”, parked aircraft “on the ground”`
  })

  await check('ui.html: the kind filter and the keyboard walk the list; Enter on a row selects it', async () => {
    await mp.click('.ul-filter [data-kind=ship]')
    const ships = await mui(`[...document.querySelectorAll('.ul-row:not([hidden])')].every((r) => r.dataset.kind === 'ship')`)
    await mp.click('.ul-filter [data-kind=all]')
    await mrun(`document.querySelector('.ul-row').focus()`)
    await mp.keyboard.press('ArrowDown')
    await mp.keyboard.press('ArrowDown')
    const focused = await mui(`document.activeElement?.dataset?.key ?? null`)
    const n0 = (await calls('select')).length
    await mp.keyboard.press('Enter')
    await tick()
    const sel = await calls('select')
    const card = await mui(`({ mode: app.ui.card.mode, title: document.querySelector('.card h1')?.textContent })`)
    if (!ships || !focused || sel.length !== n0 + 1 || card.mode !== 'unit') throw new Error(JSON.stringify({ ships, focused, sel: sel.length, card }))
    return `Ships shows ships alone; ↓↓ to ${focused}, Enter → select(${sel.at(-1)[1]}), the card “${card.title}”`
  })

  await check('ui.html: a row selects (the camera’s unit) and the unit card offers the stations', async () => {
    const i = await idOf('nevada')
    await mp.click(`.ul-row[data-key="u:nevada"]`)
    await tick()
    // (a second pass of the list's clock, so a marked row stays marked and no other row is)
    await tick(700)
    const r = await mui(`({ selected: app.battle.state.selected, mode: app.ui.card.mode, h1: document.querySelector('.card h1')?.textContent, gloss: document.querySelector('.card .gloss')?.textContent, side: document.querySelector('.card .card-meta .when')?.textContent, now: document.querySelector('.card .uc-now')?.textContent, stations: [...document.querySelectorAll('.card [data-station]')].map((b) => b.dataset.station), heading: document.querySelector('.card .card-sec h2')?.textContent, marked: [...document.querySelectorAll('.ul-row.sel')].map((r) => r.dataset.key) })`)
    if (r.selected !== i || r.mode !== 'unit' || r.h1 !== 'Nevada' || !r.now || r.stations.join() !== 'helm,main,aa' || !/Take the controls/.test(r.heading) || r.marked.join() !== 'u:nevada') throw new Error(JSON.stringify(r))
    await collect('the unit card, a ship')
    await mshot('smoke-ui-card.png')
    return `Nevada (${r.gloss}, ${r.side}): now “${r.now}”; ${r.stations.join(', ')}`
  })

  await check('ui.html: a greyed unit’s card shows its reason and no button', async () => {
    await mp.click(`.ul-row[data-key="u:arizona"]`)
    await tick()
    const r = await mui(`({ h1: document.querySelector('.card h1')?.textContent, why: document.querySelector('.card .uc-why')?.textContent, buttons: document.querySelectorAll('.card [data-station]').length })`)
    if (r.h1 !== 'Arizona' || r.why !== 'fate is fixed' || r.buttons) throw new Error(JSON.stringify(r))
    await collect('the unit card, greyed')
    await mshot('smoke-ui-card-grey.png')
    return `Arizona: “${r.why}”, ${r.buttons} buttons`
  })

  await check('ui.html: Take the controls takes at the station; the bar holds the stations, Tab cycles them; the URL carries unit and station', async () => {
    await mrun(`app.ui.unitList.close(); app.ui.onSelect(app.link.units().find((u) => u.id === 'nevada').index)`)
    await tick()
    await mp.click('.card [data-station=main]')
    await mp.waitForFunction(() => document.querySelector('.boxbar')?.dataset.mode === 'held' && document.querySelectorAll('.bb-st').length, null, { timeout: 30000 })
    const take = (await calls('take')).at(-1)?.[1]
    const r = await mui(`({ mode: app.mode, bar: document.querySelector('.boxbar').dataset.mode, stations: [...document.querySelectorAll('.bb-st')].map((b) => b.dataset.station + (b.classList.contains('on') ? '*' : '')), release: getComputedStyle(document.querySelector('.bb-release')).display !== 'none', card: app.ui.card.isOpen })`)
    if (JSON.stringify(take) !== JSON.stringify({ unit: 'nevada', station: 'main' }) || r.mode !== 'moment' || r.bar !== 'held' || r.stations.join() !== 'helm,main*,aa' || !r.release) throw new Error(JSON.stringify({ take, ...r }))
    await mp.keyboard.press('Tab')
    await mp.waitForFunction(() => window.__app.battle.state?.station === 'aa', null, { timeout: 10000 }).catch(() => {})
    const st = await mui(`({ station: app.battle.state.station, set: app.battle.calls.filter((c) => c[0] === 'setStation').map((c) => c[1]), url: [app.url.unit, app.url.station] })`)
    await mp.waitForFunction(() => /unit=nevada&station=aa/.test(location.hash), null, { timeout: 10000 })
    if (st.station !== 'aa' || st.set.at(-1) !== 'aa' || st.url.join() !== 'nevada,aa') throw new Error(JSON.stringify(st))
    await mp.click('.bb-st[data-station=helm]')
    const helm = await mui(`app.battle.state.station`)
    if (helm !== 'helm') throw new Error(`the bar's Helm gave ${helm}`)
    await collect('the bar, a ship held')
    await mshot('smoke-ui-station-bar.png')
    return `take ${JSON.stringify(take)}; bar ${r.stations.join(' ')}; Tab → aa (${await mui('location.hash')}); the bar's Helm → helm`
  })

  await check('ui.html: Release opens the after-card over the span, its four parts, and the URL lets the unit go', async () => {
    // (half a minute of the box at ×8: the mock's scripted salvo and hit fall inside it)
    await mrun(`app.battle.play(8); await new Promise((r) => setTimeout(r, 4500))`)
    await mp.click('.boxbar .bb-release')
    await mp.waitForFunction(() => window.__app.ui.card.mode === 'after', null, { timeout: 30000 })
    const r = await mui(`({ mode: app.ui.card.mode, h1: document.querySelector('.card h1')?.textContent, parts: [...document.querySelectorAll('.after-part h2')].map((h) => h.textContent.trim()), sortie: document.querySelector('.after-part[data-part=sortie]')?.innerText, battle: document.querySelector('.after-part[data-part=battle]')?.innerText, url: [app.url.unit, app.url.station], appMode: app.mode })`)
    if (r.mode !== 'after' || !/^(At the helm of Nevada|Aboard Nevada|At Nevada’s)/.test(r.h1) || !/\d\d:\d\d(:\d\d)?–\d\d:\d\d/.test(r.h1) || r.parts.length !== 4 || r.url.some(Boolean) || r.appMode !== 'watch') throw new Error(JSON.stringify(r))
    await mp.waitForFunction(() => !/unit=/.test(location.hash), null, { timeout: 10000 })
    await collect('the after-card, a ship')
    await mshot('smoke-ui-after.png')
    return `“${r.h1}”; ${r.parts.join(' | ')}; ${r.sortie.replace(/\s+/g, ' ').slice(0, 160)}`
  })

  await check('ui.html: an aircraft runs at ×0.5 in Assisted with the speed list ×0.5 ×1 ×2; Pilot leaves ×1; the setting persists across a reload', async () => {
    await mrun(`app.ui.card.close(); app.ui.onSelect(app.link.units().find((u) => u.id === 'kaga-level#3').index)`)
    await tick()
    const st = await mui(`[...document.querySelectorAll('.card [data-station]')].map((b) => b.dataset.station)`)
    await mp.click('.card [data-station=pilot]')
    await tick()
    const a = await mui(`({ scale: app.battle.timeScale, speeds: [...document.querySelectorAll('.bb-sp')].map((b) => b.dataset.scale + (b.classList.contains('on') ? '*' : '')) })`)
    await mp.click('.bb-assist [data-assist=pilot]')
    await tick()
    const p = await mui(`({ assist: app.battle.assist, kept: localStorage.getItem('pt.assist'), speeds: [...document.querySelectorAll('.bb-sp')].map((b) => b.dataset.scale), cycle: !document.querySelector('.bb-speed').hidden, scale: app.battle.timeScale })`)
    if (st.join() !== 'pilot,gunner,bombardier' || a.scale !== 0.5 || a.speeds.join() !== '0.5*,1,2' || p.assist !== 'pilot' || p.kept !== 'pilot' || p.scale !== 1) throw new Error(JSON.stringify({ st, a, p }))
    await mrun(`app.ui.onRelease()`)
    await open('?box=pearl-harbor&t=08:40&paused')
    const after = await mui(`({ app: app.assist, battle: app.battle.assist, on: document.querySelector('.bb-assist .as-opt.on')?.dataset.assist })`)
    await mp.click('.bb-assist [data-assist=assisted]')
    const back = await mui(`localStorage.getItem('pt.assist')`)
    if (after.app !== 'pilot' || after.battle !== 'pilot' || after.on !== 'pilot' || back !== 'assisted') throw new Error(JSON.stringify({ after, back }))
    return `a B5N2 of Kaga’s level bombers: ${st.join(', ')}; ×${a.scale}, list ${a.speeds.join(' ')}; Pilot → ×${p.scale}${p.cycle ? '' : ''} (${p.speeds.join(' ') || 'one speed'}); after a reload ${JSON.stringify(after)}; back to ${back}`
  })

  await check('ui.html: the bookmarks mark the strip; hover gives the title; a click takes the bookmark and its card keeps the written text', async () => {
    const r = await mui(`({ marks: [...document.querySelectorAll('.bb-mark')].map((m) => m.dataset.take), moments: app.battle.bookmarks.map((b) => b.id), ticks: document.querySelectorAll('.bb-tick').length, stops: app.battle.sim.record.stops.length })`)
    if ([...r.marks].sort().join() !== [...r.moments].sort().join() || r.ticks !== r.stops) throw new Error(JSON.stringify(r))
    const id = r.marks[0]
    await mp.hover(`.bb-mark[data-take="${id}"]`)
    await tick(200)
    const tip = await mui(`({ shown: !document.querySelector('.bb-tip').hidden, text: document.querySelector('.bb-tip').textContent, title: app.battle.sim.record.moments.get(${JSON.stringify(id)}).title })`)
    if (!tip.shown || !tip.text.includes(tip.title)) throw new Error(JSON.stringify(tip))
    await mshot('smoke-ui-strip.png')
    await mp.click(`.bb-mark[data-take="${id}"]`)
    await tick()
    const took = (await calls('takeMoment')).at(-1)?.[1]
    await mrun(`app.battle.play(2); await new Promise((r) => setTimeout(r, 1500)); app.ui.onRelease()`)
    await tick()
    const a = await mui(`({ h1: document.querySelector('.card h1')?.textContent, gloss: document.querySelector('.card .gloss')?.textContent, record: document.querySelector('.after-part[data-part=record]')?.innerText, retry: document.querySelectorAll('.card .retry').length, moment: app.url.moment })`)
    const m = await mui(`(() => { const m = app.battle.sim.record.moments.get(${JSON.stringify(id)}); return { title: m.title, after: m.after?.text ?? '' } })()`)
    if (took !== id || a.h1 !== m.title || !/–/.test(a.gloss || '') || (m.after && !a.record.includes(m.after.slice(0, 40))) || a.retry !== 2) throw new Error(JSON.stringify({ took, a, m: m.title }))
    await collect('the after-card, a bookmark')
    return `${r.marks.length} marks over ${r.ticks} stop ticks; hover “${tip.text}”; took ${took}; the card “${a.h1}” / “${a.gloss}”, its after text kept`
  })

  await check('ui.html: Start here leads the briefing, before the turning points, with the setting and its line', async () => {
    await mrun(`app.link.openBriefing()`)
    await tick()
    const r = await mui(`(() => { const c = document.querySelector('.card'); const secs = [...c.querySelectorAll('.card-sec h2')].map((h) => h.textContent); return { secs, door: c.querySelector('.door-card')?.innerText, line: c.querySelector('.as-line')?.textContent, setting: [...c.querySelectorAll('.setting .as-opt')].map((b) => b.textContent) } })()`)
    const iDoor = r.secs.indexOf('Start here')
    const iTurn = r.secs.findIndex((s) => /turning points/.test(s))
    if (iDoor < 0 || iTurn < 0 || iDoor > iTurn || r.line !== 'Assisted flight holds the aircraft for you; Pilot is the real thing.' || r.setting.join() !== 'Assisted,Pilot') throw new Error(JSON.stringify(r))
    await mrun(`document.querySelector('.card .door').scrollIntoView()`)
    await collect('the briefing')
    await mshot('smoke-ui-briefing.png')
    const n0 = (await calls('take')).length
    await mp.click('.card .door-take')
    await tick()
    const take = await calls('take')
    const role = take.at(-1)?.[1]
    const door = await mui(`app.battle.firstDoor`)
    if (take.length !== n0 + 1 || role.unit !== door.role.unit || role.station !== door.role.station) throw new Error(JSON.stringify({ role, door }))
    await mrun(`app.ui.onRelease(); app.ui.card.close()`)
    return `${r.secs.join(' · ')}; door “${r.door.split('\n').slice(0, 2).join(' / ')}”; took ${JSON.stringify(role)}`
  })

  await check('ui.html: #unit and #station offer the unit once the box is entered: selected, its station focused, nothing taken', async () => {
    await open('#battle=pearl-harbor&t=08:40&unit=nevada&station=aa')
    const r = await mui(`({ mode: app.mode, card: app.ui.card.mode, h1: document.querySelector('.card h1')?.textContent, focus: document.activeElement?.dataset?.station ?? null, takes: app.battle.calls.filter((c) => c[0] === 'take').length, selected: app.battle.state.selected })`)
    const i = await idOf('nevada')
    if (r.mode !== 'watch' || r.card !== 'unit' || r.h1 !== 'Nevada' || r.focus !== 'aa' || r.takes || r.selected !== i) throw new Error(JSON.stringify(r))
    return JSON.stringify(r)
  })

  await check('ui.html: a click on the box selects the nearest unit within 24 px, and the card follows', async () => {
    await mrun(`app.ui.card.close()`)
    const target = await mui(`(() => { const want = app.link.units().find((u) => u.id === 'helm').index; return app.plan.pts.find((p) => p.index === want) || null })()`)
    if (!target) throw new Error('Helm is not on the plan')
    await mp.mouse.click(target.sx + 6, target.sy - 4)
    await tick(700)
    const r = await mui(`({ selected: app.battle.state.selected, card: app.ui.card.mode, h1: document.querySelector('.card h1')?.textContent })`)
    if (r.selected === null || r.card !== 'unit') throw new Error(JSON.stringify(r))
    return `a click by Helm selected ${r.h1} (${r.selected}); the card is open`
  })

  await check('ui.html: an aircraft’s card and a held aircraft’s bar on Midway (the voice of the cards held to the rules)', async () => {
    await open('?box=midway&t=10:22&paused')
    await mrun(`app.ui.card.close(); app.ui.onSelect(app.link.units().find((u) => u.id === 'vb-6#4').index)`)
    await tick()
    const card = await mui(`document.querySelector('.card').innerText`)
    await collect('the unit card, an aircraft')
    await mshot('smoke-ui-card-air.png')
    await mp.click('.card [data-station=gunner]')
    await tick()
    await collect('the bar, an aircraft held')
    await mshot('smoke-ui-station-bar-air.png')
    await mrun(`app.battle.play(2); await new Promise((r) => setTimeout(r, 5000)); app.ui.onRelease()`)
    await tick()
    await collect('the after-card, an aircraft')
    await mshot('smoke-ui-after-air.png')
    const h1 = await mui(`document.querySelector('.card h1')?.textContent`)
    if (!/^At the rear gun of a Dauntless of Bombing Six, /.test(h1)) throw new Error(`the after-card: “${h1}”`)
    await mrun(`app.ui.unitList.toggle()`)
    await collect('the list, Midway')
    return `${card.split('\n').filter(Boolean).slice(0, 3).join(' / ')}; “${h1}”`
  })

  await check('ui.html: every string the round adds keeps the voice rules (no slur, glory or game word, nothing announced, no count of people)', async () => {
    const bad = []
    for (const { what, text } of texts) {
      for (const re of [...SLURS, ...GLORY, ANNOUNCES, GAME]) {
        const m = text.match(re)
        if (m) bad.push(`${what}: “${m[0]}”`)
      }
      // (people are counted only in The record, which the card's own guard keeps; the rest of the text never)
      const rest = text.replace(/THE RECORD[\s\S]*?WHAT CAME NEXT/i, '')
      if (PEOPLE_NUMBER.test(rest)) bad.push(`${what}: a count of people (“${rest.match(PEOPLE_NUMBER)[0]}”)`)
    }
    if (bad.length) throw new Error(bad.join('; '))
    return `${texts.length} views, ${texts.reduce((s, t) => s + t.text.length, 0)} characters`
  })

  await check('ui.html: the unit list at phone width (390×844): a sheet above the bar, no sideways scroll', async () => {
    const pp = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true })
    listen(pp, 'ui.html (phone): ')
    await open('?box=pearl-harbor&t=08:40&paused', pp)
    await pp.evaluate(() => {
      window.__app.ui.card.close()
      window.__app.ui.onUnits()
    })
    await pp.waitForTimeout(400)
    const r = await pp.evaluate(() => {
      const l = document.querySelector('.unitlist').getBoundingClientRect()
      const b = document.querySelector('.boxbar').getBoundingClientRect()
      return { list: [l.left, l.top, l.right, l.bottom].map(Math.round), bar: [b.left, b.top, b.right, b.bottom].map(Math.round), scroll: document.documentElement.scrollWidth }
    })
    await mshot('smoke-ui-list-phone.png', pp)
    // a row on the phone closes the sheet and opens the card
    await pp.click('.ul-row[data-key="u:nevada"]')
    await pp.waitForTimeout(400)
    const after = await pp.evaluate(() => ({ list: !document.querySelector('.unitlist').hidden, card: window.__app.ui.card.mode }))
    await mshot('smoke-ui-card-phone.png', pp)
    await pp.close()
    if (r.list[0] < 0 || r.list[2] > 390 || r.list[3] > r.bar[1] || r.bar[2] > 390 || r.scroll > 390 || after.list || after.card !== 'unit') throw new Error(JSON.stringify({ ...r, after }))
    return `list ${r.list.join(',')}, bar ${r.bar.join(',')}; a row → the card`
  })

  await mp.close()
  await vite.close()
}

if (warnings.length) console.log(`  (${warnings.length} console warnings: ${warnings.slice(0, 3).join(' | ')})`)
if (errors.length) {
  failed++
  console.log('  ✗ console errors:\n   ', errors.slice(0, 10).join('\n    '))
} else console.log('  ✓ no console errors')
writeFileSync(join(shots, 'smoke.json'), JSON.stringify({ when: new Date().toISOString(), data: useTest ? 'test' : 'real', failed, perf, stats, warnings, errors }, null, 1))
await browser.close()
server.close()
console.log(failed ? `${failed} failed` : 'all passed')
process.exitCode = failed ? 1 : 0
