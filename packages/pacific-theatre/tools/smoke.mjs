// Dev-only: boot the built app (dist/) in headless Chromium under SwiftShader
// and check the Stage 0 gate (ENGINEERING.md §13): the table boots on the
// fixtures and is drawn; every scene ShaderMaterial's compiled source carries
// the log-depth chunks (vFragDepth); the stub Battle flies the table to the
// fixture box's outline through its placement; the box flavours compile and
// draw in a preview of the box and the cut comes back; the URL's #date and
// #cam act and #battle is kept; no console error on the way. Then what the
// page costs in heap and frame time.
//
//   npm run build -w @vibe-dump/pacific-theatre
//   node tools/fake-data.mjs
//   node tools/smoke.mjs                 (test-data/ unless public/data/ has a manifest and DATA=real)
//   DATA=real node tools/smoke.mjs
//   CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome (the default)
//
// Adapted from holo-i-ke-au's tools/smoke.mjs (b480c27): its harness (the
// server, the browser, check/ui/run/expect/frames) and its perf block (the
// CDP heap, wall-time frames) are kept; the checks are new. The table and
// engine workflows extend it (the tour, the pins, a moment with
// player.scripted).
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
if (!useTest && !realReady) throw new Error('DATA=real but public/data/manifest.json does not exist yet')
if (useTest && !existsSync(join(root, 'test-data/manifest.json'))) throw new Error('no test-data/: run node tools/fake-data.mjs first')
if (!existsSync(join(root, 'dist/index.html'))) throw new Error('no dist/: run npm run build -w @vibe-dump/pacific-theatre first')
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
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  const t = m.text()
  if (m.type() === 'error') errors.push(`console: ${t}`)
  else if (m.type() === 'warning') warnings.push(t)
  else infos.push(t)
})
const t0 = Date.now()
await page.goto(`http://127.0.0.1:${port}/dist/index.html${useTest ? '?data=../test-data/' : ''}`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
await page.waitForFunction(() => window.__app?.ready, null, { timeout: 120000 })
console.log(`booted in ${Date.now() - t0} ms on ${useTest ? 'test' : 'real'} data`)

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
const look = async (file) => {
  const buf = await page.screenshot({ path: join(shots, file) })
  const img = readPNG(buf)
  const { width, height, channels, data } = img
  let s = 0
  let s2 = 0
  let blue = 0
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
    if (i % 7 === 0) seen.add((r >> 3) * 1024 + (g >> 3) * 32 + (b >> 3))
  }
  const mean = s / n
  return { mean: +mean.toFixed(1), spread: +Math.sqrt(Math.max(0, s2 / n - mean * mean)).toFixed(1), blue: +(blue / n).toFixed(3), colours: seen.size }
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

await check('the table boots on the fixtures and is the active scene', async () => {
  await expect('app.mode', 'table')
  await expect('app.active === app.table', true)
  await expect('app.renderer.capabilities.logarithmicDepthBuffer', true)
  const n = await ui('app.table.ground.terrain.stats().nodes')
  if (!(n > 0)) throw new Error(`the relief draws ${n} nodes`)
  const s = await ui('app.stats()')
  return `${n} relief nodes, exaggeration ${s.exag}, ${s.calls} draw calls, ${s.gpu}`
})

await check('the table is drawn: relief, sea and land in the frame', async () => {
  await run('app.settle()')
  await frames(3)
  const l = await look('smoke-table.png')
  if (l.spread < 8 || l.colours < 60) throw new Error(`a flat frame: ${JSON.stringify(l)}`)
  if (l.blue < 0.15) throw new Error(`hardly any sea: ${JSON.stringify(l)}`)
  return JSON.stringify(l)
})

await check('every scene ShaderMaterial on the table carries vFragDepth', async () => {
  const a = await shaderAudit()
  if (!a.materials) throw new Error('no ShaderMaterials found')
  if (a.missing.length || a.uncompiled.length) throw new Error(`missing in ${a.missing.join(', ')}; uncompiled ${a.uncompiled.join(', ')}`)
  return `${a.materials} materials`
})

await check('the hash carries the date and the camera', async () => {
  await page.waitForFunction(() => /date=\d{4}-\d{2}-\d{2}/.test(location.hash) && /cam=/.test(location.hash), null, { timeout: 30000 })
  return await ui('location.hash')
})

await check('#date and #cam act; #battle, #t and #moment are kept', async () => {
  await run(`location.hash = '#date=1942-06-04&cam=3787.4,-2655.8,2400,0.3,0.9&battle=test-box&t=10:22&keep=me'`)
  await page.waitForFunction(() => Math.abs(window.__app.clock.date - Date.UTC(1942, 5, 4)) < 1000, null, { timeout: 20000 })
  await frames(2)
  const g = await ui('[app.table.rig.goal.target.x, app.table.rig.goal.target.z, app.table.rig.goal.distance]')
  if (Math.abs(g[0] - 3787.4) > 0.5 || Math.abs(g[1] + 2655.8) > 0.5 || Math.abs(g[2] - 2400) > 1) throw new Error(`the rig is at ${g}`)
  await expect('app.url.battle', 'test-box')
  await expect('app.url.t', '10:22')
  await page.waitForFunction(() => /keep=me/.test(location.hash) && /battle=test-box/.test(location.hash), null, { timeout: 20000 })
  if (!infos.some((t) => /\[url\] kept until integration/.test(t))) throw new Error('the kept battle was not logged')
  return await ui('location.hash')
})

await check("the stub Battle flies the table to the fixture box's outline through its placement", async () => {
  const st = await run(`return await app.battle.enter('test-box')`)
  if (st?.boxId !== 'test-box') throw new Error(`enter resolved ${JSON.stringify(st)}`)
  const r = await ui(`(() => {
    const b = app.data.boxById.get('test-box')
    const v = app.table.outlineView('test-box')
    const s = app.table.rig.state
    return { dx: s.target.x - b.placement.centre[0], dz: s.target.z - b.placement.centre[1], d: s.distance, want: v.distance, yaw: s.yaw, wantYaw: v.yaw,
      outline: !!app.table.outlines.get('test-box')?.on, mode: app.mode, pack: app.battle.loaded?.pack.W, units: app.battle.loaded?.battle?.units?.length, kits: app.battle.loaded?.kits.ships.length }
  })()`)
  if (Math.hypot(r.dx, r.dz) > 1 || Math.abs(r.d - r.want) > r.want * 0.01 || Math.abs(r.yaw - r.wantYaw) > 1e-3) throw new Error(`the rig landed off the hand-over pose: ${JSON.stringify(r)}`)
  if (!r.outline || r.mode !== 'table' || r.pack !== 256 || r.units !== 6) throw new Error(JSON.stringify(r))
  await frames(2)
  const l = await look('smoke-outline.png')
  return `${(r.d).toFixed(0)} km over the box's centre, yaw ${r.yaw.toFixed(3)}; ${r.units} units, ${r.kits} ship kits; frame ${JSON.stringify(l)}`
})

await check('the box flavours compile and draw (preview), every material with vFragDepth', async () => {
  await run(`await app.battle.preview()`)
  await expect("app.active.name", 'box')
  await expect('app.mode', 'watch')
  await frames(3)
  const a = await shaderAudit()
  if (a.missing.length || a.uncompiled.length) throw new Error(`missing in ${a.missing.join(', ')}; uncompiled ${a.uncompiled.join(', ')}`)
  const s = await ui('app.stats()')
  if (!(s.nodes > 0)) throw new Error(`the box terrain draws ${s.nodes} nodes`)
  const l = await look('smoke-box.png')
  if (l.spread < 4) throw new Error(`a flat frame: ${JSON.stringify(l)}`)
  return `${a.materials} materials, ${s.nodes} terrain nodes, ${s.calls} draw calls, at ${s.distance} m; frame ${JSON.stringify(l)}`
})

await check('leave cuts back to the table and takes the outline away', async () => {
  await run(`await app.battle.leave()`)
  await expect('app.active === app.table', true)
  await expect('app.mode', 'table')
  await expect("!!app.table.outlines.get('test-box')?.on", false)
  await expect('app.battle.scene', null)
})

// What the page costs: the JS heap after a collection, and the frame time on
// the table held still at the whole theatre and over the box. (Under the
// software renderer the frame times are the CPU's: compare them only with
// each other.)
let perf = null
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
  const out = { heapMB: await heapMB() }
  await run(`const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: h.distance, yaw: h.yaw, pitch: h.pitch }); app.settle()`)
  await frames(3)
  out['table.theatre.ms'] = await frameMs(8)
  out['table.theatre'] = await ui('(() => { const s = app.stats(); return { calls: s.calls, triangles: s.triangles, nodes: s.nodes, exag: s.exag } })()')
  await run(`app.table.rig.jump(app.table.outlineView('test-box')); app.settle()`)
  await frames(3)
  out['table.box.ms'] = await frameMs(8)
  out['table.box'] = await ui('(() => { const s = app.stats(); return { calls: s.calls, triangles: s.triangles, nodes: s.nodes, exag: s.exag } })()')
  out.heapAfterMB = await heapMB()
  out.textures = await ui('app.renderer.info.memory.textures')
  out.programs = await ui('app.renderer.info.programs.length')
  perf = out
  console.log('      perf', JSON.stringify(out))
})

const stats = await ui('app.stats()')
console.log('stats', JSON.stringify(stats))
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
