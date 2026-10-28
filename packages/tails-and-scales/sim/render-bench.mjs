// The drawing's cost at scale (DESIGN §4.2.1's drawing rows, §4.2.9's
// render-bench row; F8b): the page itself in Chromium, a watched battle
// drawn on the classic board and on Grand (the `grand` mission on `open`,
// both seats on the ×3 presets), the camera on the whole board (the view
// button's overview, the Home key) and the battle held still there (game
// time stopped), and §4.2.1's rows read off the renderer and the page:
//
//   main calls     the main pass's draw calls, the whole board (shadows
//                  not redrawn: renderer.info with the shadow map's
//                  autoUpdate off)                           budget ≤ 600
//   shadow calls   the shadow pass's draw calls (the casters drawn, the
//                  shadow camera fitted to the view)          budget ≤ 600
//   triangles      the main pass's, the whole board, (V2) its meshes'
//                  alone (renderer.info counts a splat, an instanced
//                  quad, as two triangles: they are taken off) budget ≤ 400 K
//   splats         (V2) the splats the main pass drew (the 'new' style's
//                  Bushtails, view/models/splat/splats.js: a splat's cost
//                  is its quad's four vertices and its fill, not a mesh
//                  triangle's, so DESIGN §4.2.1 budgets them apart, at the
//                  'high' quality's splats a frame)          budget ≤ 150 K
//   render JS      renderer.render's own time, the median of FRAMES calls
//                  (shadows redrawn each), Grand's over classic's
//                                                              budget ≤ 1.3×
//   label writes   the label and chip style writes in a frame, the camera
//                  and the battle still (the most over FRAMES frames)
//                                                              budget ≤ 20
//   minimap        a redraw's time: (F8b's review) MINIMAP whole redraws
//                  driven back to back (?debug's view.minimapRedraws: the
//                  signature forgotten before each, the map brought up
//                  where it is folded), their 90th percentile judged (the
//                  median and the longest reported)   budget ≤ 1 ms
//                  (the terrain's footprints, painted into its cache only
//                  when the board or the terrain changes, reported apart).
//                  Its rate, ≤ 10 Hz, holds by construction (view/
//                  minimap.js looks at most HZ = 10 times a second and
//                  redraws only when its signature changed), so it is not
//                  a row: the bench's old rate row, redraws over a nudged
//                  camera's 4 s, could not exceed the poll and never failed.
//
// with what the drawing at scale did (view/units.js, view/terrain.js,
// view/stage.js, ui/chips.js: ?debug's view.drawing()): the zoom's tier and
// pixels per inch, the figures drawn by their far stand-ins, the terrain's
// tiles (and its tileCheck: every tiled chunk drawn as its own mesh), the
// shadow camera's fits. A report: Grand's rows fail above OVER (1.25×) their
// budget; classic's are reported (§4.2.1's "today" column) and fail only
// above 1.25× the same budgets. The drawing runs on SwiftShader on the CPU,
// as every browser harness in sim/ does, so times read high on a busy
// machine: a timing row that fails is run again, alone, before it is
// believed (the calls, triangles and writes don't depend on the machine).
//
//   node sim/render-bench.mjs [--seed 7] [--frames 15] [--json]
//
// Build first (npx vite build: it measures dist/). Exit 0 when every row is
// within its budget × 1.25, 1 otherwise. Set CHROMIUM_PATH to the
// pre-installed Chromium if Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { DIST, IDLE_MS } from './chromium.mjs'

const { values: a } = parseArgs({ options: { seed: { type: 'string' }, frames: { type: 'string' }, json: { type: 'boolean' } } })
const SEED = Number(a.seed ?? 7), FRAMES = Number(a.frames ?? 15)
const BUDGET = { main: 600, shadow: 600, tris: 400000, splats: 150000, js: 1.3, writes: 20, minimapMs: 1 }
// the minimap's redraws driven per mission (its row's sample)
const MINIMAP = 40
const OVER = 1.25
if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`render-bench: no build at ${DIST} (run npx vite build first)`)
  process.exit(2)
}

// One mission's whole-board frame, measured in a fresh page.
async function measure(browser, url, mission) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  try {
    await page.goto(`${url}/?debug&seed=${SEED}${mission === 'classic' ? '' : `&mission=${mission}`}`, { timeout: IDLE_MS })
    await page.waitForFunction(() => window.__ts, null, { timeout: IDLE_MS })
    // a watched battle, from the title's button and the panel's Start
    await page.evaluate(() => document.querySelector('[data-mode="watch"]').click())
    await page.waitForFunction(() => !document.querySelector('#setup').classList.contains('hidden'), null, { timeout: IDLE_MS })
    await page.evaluate(() => document.querySelector('#setupStart').click())
    await page.waitForFunction(() => ['deploy', 'battle'].includes(window.__ts.S.stage), null, { timeout: IDLE_MS })
    // the whole board (Home: the view button's overview), then the battle
    // and the clock held still there
    await page.evaluate(() => (window.__ts.S.follow = false))
    await page.waitForTimeout(1500)
    await page.keyboard.press('Home')
    await page.waitForFunction(() => window.__ts.clock.time > 0, null, { timeout: IDLE_MS })
    const t0 = await page.evaluate(() => window.__ts.clock.time)
    await page.waitForFunction((t) => window.__ts.clock.time > t + 1.5, t0, { timeout: IDLE_MS })
    return await page.evaluate(async ({ FRAMES, MINIMAP }) => {
      const ts = window.__ts, r = ts.renderer, info = r.info, sm = r.shadowMap, scene = ts.scenery.scene, cam = ts.camera
      const frame = () => new Promise((res) => requestAnimationFrame(() => res()))
      const frames = async (n) => {
        for (let i = 0; i < n; i++) await frame()
      }
      ts.clock.speed = 0
      // (the shadows fitted once the camera has rested: view/stage.js)
      await frames(12)
      const drawn = ts.view.drawing()
      // the passes, counted
      info.autoReset = false
      info.reset()
      sm.needsUpdate = true
      r.render(scene, cam)
      const all = info.render.calls
      sm.autoUpdate = false
      info.reset()
      r.render(scene, cam)
      // ((V2) the splats it drew, each counted as two triangles)
      const splats = ts.view.splats?.().splats ?? 0
      const main = info.render.calls, tris = info.render.triangles - 2 * splats
      sm.autoUpdate = true
      info.autoReset = true
      // renderer.render's own time, shadows redrawn each call
      const js = []
      for (let i = 0; i < FRAMES; i++) {
        sm.needsUpdate = true
        const t = performance.now()
        r.render(scene, cam)
        js.push(performance.now() - t)
        await frame()
      }
      js.sort((x, y) => x - y)
      // the label and chip writes of a still frame
      let writes = 0
      for (let i = 0; i < FRAMES; i++) {
        await frame()
        writes = Math.max(writes, ts.view.drawing().writes)
      }
      // the minimap: MINIMAP whole redraws back to back (each a redraw, the
      // terrain's cache kept), the 90th percentile judged
      const times = ts.view.minimapRedraws(MINIMAP)
      const sorted = [...times].sort((x, y) => x - y)
      const paintMs = ts.view.drawing().minimap.paintMs
      return {
        main, shadow: all - main, tris, splats, js: js[js.length >> 1], writes, minimapMs: sorted[Math.min(sorted.length - 1, Math.floor(0.9 * sorted.length))], minimapMed: sorted[sorted.length >> 1], minimapMax: sorted[sorted.length - 1], minimapN: times.length, paintMs,
        tier: drawn.tier, ppi: drawn.ppi, lo: drawn.lo, figs: drawn.figs, tiles: drawn.tiles.tiles, tileMeshes: drawn.tiles.meshes, tiled: drawn.tiles.tiled,
        tileBad: drawn.tiles.bad, fits: drawn.shadow.fits, d: cam.position.distanceTo(ts.controls.target), units: ts.G.units.length,
      }
    }, { FRAMES, MINIMAP })
  } finally {
    if (errors.length) console.log(`  (${mission}: the page threw: ${errors.slice(0, 2).join(' | ')})`)
    await page.close()
  }
}

const server = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
let rows
try {
  const classic = await measure(browser, server.url, 'classic')
  const grand = await measure(browser, server.url, 'grand')
  rows = { classic, grand }
} finally {
  await browser.close()
  await server.close()
}

if (a.json) console.log(JSON.stringify(rows, null, 1))
const { classic: C, grand: G } = rows
const problems = []
const judge = (who, key, v, budget, fmt) => {
  const ratio = v / budget
  const bad = ratio > OVER
  if (bad) problems.push(`${who} ${key}: ${fmt(v)} is ${ratio.toFixed(2)}× its budget of ${fmt(budget)} (fails above ${OVER}×)`)
  return `${fmt(v).padStart(9)} ${`(${ratio.toFixed(2)}×)`.padEnd(8)}${bad ? ' FAIL' : ''}`
}
const n = (v) => String(Math.round(v))
const k = (v) => `${(v / 1000).toFixed(0)} K`
const ms = (v) => `${v.toFixed(2)} ms`
console.log(`render-bench: a watched battle's whole-board frame at 1280×800 (board seed ${SEED}), §4.2.1's drawing rows; a row fails above ${OVER}× its budget`)
console.log(`  ${'row'.padEnd(15)} ${'classic'.padEnd(19)} ${'Grand'.padEnd(19)} budget`)
const row = (name, key, budget, fmt) => console.log(`  ${name.padEnd(15)} ${judge('classic', key, C[key], budget, fmt).padEnd(19)} ${judge('Grand', key, G[key], budget, fmt).padEnd(19)} ${fmt(budget)}`)
row('main calls', 'main', BUDGET.main, n)
row('shadow calls', 'shadow', BUDGET.shadow, n)
row('triangles', 'tris', BUDGET.tris, k)
row('splats', 'splats', BUDGET.splats, k)
{
  const ratio = G.js / C.js
  const bad = ratio / BUDGET.js > OVER
  if (bad) problems.push(`Grand render JS: ${ms(G.js)}, ${ratio.toFixed(2)}× classic's ${ms(C.js)}, against a budget of ${BUDGET.js}× (fails above ${(BUDGET.js * OVER).toFixed(2)}×)`)
  console.log(`  ${'render JS'.padEnd(15)} ${ms(C.js).padEnd(19)} ${`${ms(G.js)} (${ratio.toFixed(2)}× classic)`.padEnd(19)} ${BUDGET.js}× classic${bad ? ' FAIL' : ''}`)
}
row('label writes', 'writes', BUDGET.writes, n)
row('minimap p90', 'minimapMs', BUDGET.minimapMs, ms)
for (const [who, r] of [['classic', C], ['Grand', G]]) {
  console.log(`  ${who}: ${r.units} units, the camera ${r.d.toFixed(0)}" out (${r.ppi.toFixed(1)} px per inch, ${r.tier}); ${r.lo} of ${r.figs} figures drawn by their stand-ins; ${r.tiled ? `${r.tiled} chunks in ${r.tiles} tiles (${r.tileMeshes} meshes)` : 'the terrain untiled'}; the shadows fitted to the view ${r.fits} time(s); the minimap's terrain painted in ${r.paintMs.toFixed(2)} ms, its ${r.minimapN} redraws ${r.minimapMed.toFixed(2)} ms the median, ${r.minimapMax.toFixed(2)} ms the longest`)
  for (const b of r.tileBad.slice(0, 3)) problems.push(`${who} tiles: ${b}`)
}
if (problems.length) {
  console.log(`\nrender-bench FAILED: ${problems.length} problem(s)`)
  for (const p of problems) console.log(`  ${p}`)
  process.exit(1)
}
console.log('\nrender-bench passed: every drawing row within its budget')
