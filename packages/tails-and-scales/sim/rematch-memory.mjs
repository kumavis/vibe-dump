// Nothing leaks across rematches (DESIGN §2.11's frame budget, §4 R7:
// "renderer.info and heap after 5 rematches"). A new table drops the last
// one's figures and battlefield, and must free what they held: before R7 the
// figures' baked geometry and every chunk's meshes were only taken off the
// scene, so each Back to the war room left a table's worth of geometry on
// the GPU and in the heap. R7 frees them (view/units.js, view/terrain.js,
// view/models/cache.js: a figure's own geometry, the template's shared one
// kept) and makes the figures from templates.
//
// One page in Chromium plays the same watched battle (one board, one dice
// seed) six times, pressing the end screen's Back to the war room between
// them, as a player would: a battle, then five rematches. Under ?fast
// nothing is drawn, so the page's scene is drawn here every frame, into a
// small drawing buffer, from high above the whole table (three.js counts a
// geometry or texture only once it has been drawn, and until it is
// disposed, and compiles a material's shader program only when it first
// draws it: every frame, and nothing culled out of view, so whatever a
// battle shows, however briefly, is counted in every battle alike). At each battle's end and on each title after it,
// once the table has settled (150 frames: every effect faded), the scene is
// drawn once more from high above the whole table (so nothing is culled
// out of view, and every geometry the scene holds is counted), the heap is
// collected (Chromium's own collector, through the DevTools protocol), and
// renderer.info.memory (geometries, textures, programs), what the table
// holds (the ?debug block's view.counts(): the scene's own objects, the
// battlefield's meshes, the figures, the floating labels; not every
// descendant, since a rubble pile's pieces are strewn at random) and the JS
// heap in use are read. The title after each
// battle is the same table, so it must hold exactly as many of each as
// after the first battle (the first title, before any battle, has not yet
// drawn what only a battle draws: a projectile's shape, a blast's flash),
// and so must each battle's end; and the heap must not grow by more than
// HEAP_SLACK from the first title after a battle to the last.
//
// And the shader programs it links (DESIGN §2.11's frame budget: linking
// one stalls the frame that first draws its material). three.js drops a
// program once the last material using it is disposed, and links it anew
// when one draws again; so a material made and freed per shot whose program
// nothing else holds is a link at every such shot (R7a's first cut gave a
// glowing projectile, the Venom Spitters' and the Venom Engine's, a
// material of its own, freed as it landed: a link per spit or acid
// volley). Every program is noted after every frame drawn, and from one
// title or battle's end to the next none may be linked twice; and each
// rematch's battle, and each title after a battle, must link as many as
// the first rematch's (what a battle draws first, it links in the first).
//
//   node sim/rematch-memory.mjs [--ref <git ref>] [--board 4242] [--dice 99]
//   node sim/rematch-memory.mjs --self-test   R7a's first glowing projectile
//                                             (a material per shot, freed as
//                                             it landed), edited into a copy
//                                             of the working tree, must fail
//                                             it over a battle and a rematch
//
// --ref measures another commit's build instead of the working tree's (the
// code before R7, HEAD as it stands, leaks: its geometries grow with every
// rematch). Exit 0 when nothing grows and no program is linked twice (the
// self-test: when the edit is caught so), 1 otherwise, 2 on bad arguments. Set CHROMIUM_PATH to the pre-installed Chromium if Playwright's
// own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, copyCode } from './lib.mjs'
import { IDLE_MS } from './chromium.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

// how much the heap may grow from the first title after a battle to the
// last (the collector's own noise, and the browser's caches warming)
const HEAP_SLACK = 2 * 1024 * 1024
// --self-test's edit, in view/effects/shots.js: [text, replacement]
const OWN_GLOW = [
  ['const glow = (c) => GLOW.get(c) ?? GLOW.set(c, new THREE.MeshBasicMaterial({ color: c, toneMapped: false })).get(c)', 'const glow = (c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false })'],
  ['  fly(a, b, kind) {\n    return this.effects.projectile(a, b, this.projectileStyle(kind))\n  }', '  async fly(a, b, kind) {\n    const style = this.projectileStyle(kind)\n    await this.effects.projectile(a, b, style)\n    if (style.mesh.material.toneMapped === false) style.mesh.material.dispose()\n  }'],
]

let a
try {
  ({ values: a } = parseArgs({ options: { ref: { type: 'string' }, board: { type: 'string' }, dice: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
  if (a.ref && a['self-test']) throw new Error('--self-test edits the working tree: no --ref')
} catch (e) {
  console.error(`rematch-memory: ${e.message}\nusage: node sim/rematch-memory.mjs [--ref <git ref> | --self-test] [--board 4242] [--dice 99]`)
  process.exit(2)
}
const BATTLES = a['self-test'] ? 2 : 6
const board = Number(a.board ?? 4242), dice = Number(a.dice ?? 99)
if (!Number.isInteger(board) || !Number.isInteger(dice)) {
  console.error('rematch-memory: --board and --dice take whole numbers')
  process.exit(2)
}

// in the page: draw the scene every frame (?fast draws nothing), small,
// from high above the whole table; and note every shader program linked,
// in order (window.__linked: each one's cache key, the material settings
// it was compiled for, and its name, a built-in material's shader: basic,
// standard, lambert, …)
const drawAlways = () => {
  let cam = null
  const seen = new Set(), linked = (window.__linked = [])
  window.__overhead = (ts) => {
    const c = ts.camera.clone()
    c.clearViewOffset()
    c.fov = 70
    c.aspect = innerWidth / innerHeight
    c.position.set(0, 60, 0.001)
    c.lookAt(0, 0, 0)
    c.updateProjectionMatrix()
    c.updateMatrixWorld()
    return c
  }
  window.__noteLinks = (ts) => {
    for (const p of ts.renderer.info.programs ?? []) if (!seen.has(p.id)) (seen.add(p.id), linked.push({ key: p.cacheKey, name: p.name || p.cacheKey.split(',')[0] }))
  }
  const tick = () => {
    const ts = window.__ts
    if (ts) {
      if (!cam) {
        ts.renderer.setSize(160, 100, false)
        cam = window.__overhead(ts)
      }
      ts.renderer.render(ts.scenery.scene, cam)
      window.__noteLinks(ts)
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-memory-'))
let code = a.ref ? codeDir(a.ref) : PKG
if (a['self-test']) {
  code = copyCode(PKG, join(work, 'code'))
  const f = join(code, 'view/effects/shots.js')
  let src = readFileSync(f, 'utf8')
  for (const [from, to] of OWN_GLOW) {
    if (src.split(from).length !== 2) throw new Error(`rematch-memory self-test: no single "${from.slice(0, 60)}" in view/effects/shots.js`)
    src = src.replace(from, to)
  }
  writeFileSync(f, src)
}
const dist = await buildApp(code, join(work, 'dist'))
const { url, close } = await startStaticServer(dist)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
let failed = false
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  page.setDefaultTimeout(IDLE_MS)
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.addInitScript(`(${drawAlways})()`)
  const cdp = await page.context().newCDPSession(page)
  await page.goto(`${url}/?debug&fast&lowfi&seed=${board}&dice=${dice}`)
  await page.waitForFunction(() => window.__ts)
  // what the page holds now: settled, drawn once more from above the
  // whole table, the heap collected
  const measure = async () => {
    await page.evaluate(() => new Promise((r) => {
      let n = 150
      const f = () => (--n ? requestAnimationFrame(f) : r())
      requestAnimationFrame(f)
    }))
    await page.evaluate(() => {
      const ts = window.__ts
      ts.renderer.render(ts.scenery.scene, window.__overhead(ts))
      window.__noteLinks(ts)
    })
    await cdp.send('HeapProfiler.collectGarbage')
    await cdp.send('HeapProfiler.collectGarbage')
    const heap = (await cdp.send('Runtime.getHeapUsage')).usedSize
    const m = await page.evaluate(() => {
      const ts = window.__ts
      // before R7 the ?debug block had no view.counts(): the scene's own
      // objects only, the rest unread
      const counts = ts.view?.counts?.() ?? { scene: ts.scenery.scene.children.length, terrain: null, figures: null, labels: null }
      return { ...ts.renderer.info.memory, programs: ts.renderer.info.programs?.length ?? 0, ...counts, linked: window.__linked.length }
    })
    return { ...m, heap }
  }
  const rows = []
  const row = (what, m) => {
    // (links: the programs linked since the last row)
    m.links = m.linked - (rows.at(-1)?.linked ?? 0)
    rows.push({ what, ...m })
    console.log(`  ${what.padEnd(26)} geometries ${String(m.geometries).padStart(4)}  textures ${String(m.textures).padStart(2)}  programs ${String(m.programs).padStart(2)} (${String(m.links).padStart(2)} linked)  scene ${String(m.scene).padStart(4)}  terrain ${String(m.terrain).padStart(3)}  figures ${String(m.figures).padStart(2)}  labels ${String(m.labels).padStart(3)}  heap ${(m.heap / 1048576).toFixed(2)} MB`)
  }
  console.log(`rematch-memory: board ${board}, dice ${dice}, a watched battle and ${BATTLES - 1} rematch${BATTLES === 2 ? '' : 'es'} in one page, on ${a.ref ? `ref ${a.ref}` : a['self-test'] ? "the working tree with R7a's first glowing projectile edited in (self-test)" : 'the working tree'} (Chromium ${browser.version()})`)
  row('the title', await measure())
  for (let i = 1; i <= BATTLES; i++) {
    await page.click('[data-mode="watch"]')
    await page.waitForFunction(() => window.__ts.S.stage === 'over' && window.__ts.player.idle, null, { timeout: 600000, polling: 500 })
    row(`battle ${i}'s end`, await measure())
    await page.click('#again')
    row(`the title after battle ${i}`, await measure())
  }
  if (errors.length) throw new Error(errors.join('; '))
  const titles = rows.filter((r) => r.what.startsWith('the title after')), ends = rows.filter((r) => r.what.endsWith('end'))
  const grew = []
  // the programs linked since the last row: none twice, and each
  // rematch's as many as the first rematch's
  const linked = await page.evaluate(() => window.__linked)
  rows.forEach((r, i) => {
    const got = linked.slice(i ? rows[i - 1].linked : 0, r.linked), keys = got.map((p) => p.key)
    const again = got.filter((p, j) => keys.indexOf(p.key) !== j)
    if (again.length) grew.push(`${again.length} shader program${again.length === 1 ? '' : 's'} linked again before ${r.what} (freed and linked anew within it: ${[...new Set(again.map((p) => p.name))].join(', ')})`)
  })
  // (what each row after the first linked, by material type)
  const named = rows.slice(1).map((r, i) => `${r.what} ${linked.slice(rows[i].linked, r.linked).map((p) => p.name).join(', ') || 'none'}`)
  console.log(`  programs linked since the row before: ${named.join('; ')}`)
  const rematch = (list) => list.slice(1)
  for (const [what, list] of [["a rematch's battle", rematch(ends)], ['a title after a battle', titles]]) {
    if (list.some((r) => r.links !== list[0].links)) grew.push(`programs linked by ${what}: ${list.map((r) => r.links).join(' → ')}`)
  }
  for (const k of ['geometries', 'textures', 'programs', 'scene', 'terrain', 'figures', 'labels']) {
    if (titles.some((r) => r[k] !== titles[0][k])) grew.push(`${k} on the title: ${titles.map((r) => r[k]).join(' → ')}`)
    if (ends.some((r) => r[k] !== ends[0][k])) grew.push(`${k} at a battle's end: ${ends.map((r) => r[k]).join(' → ')}`)
  }
  const heapGrowth = titles.at(-1).heap - titles[0].heap
  if (heapGrowth > HEAP_SLACK) grew.push(`the heap on the title: ${(heapGrowth / 1048576).toFixed(2)} MB more after battle ${BATTLES} than after battle 1`)
  if (a['self-test']) {
    const caught = grew.filter((g) => /linked again/.test(g))
    failed = !caught.length
    console.log(failed ? `\nrematch-memory self-test FAILED: the edit was not caught (${grew.join('; ') || 'nothing failed'})` : `\nrematch-memory self-test passed: the edit is caught (${caught.join('; ')})`)
  } else failed = grew.length > 0
  if (!a['self-test']) console.log(failed ? `\nrematch-memory FAILED: ${grew.join('; ')}` : `\nrematch-memory passed: after each of ${BATTLES - 1} rematches the title holds the same ${titles[0].geometries} geometries and ${titles[0].textures} textures, each battle's end the same ${ends[0].geometries} and ${ends[0].textures}, and the heap moved ${(heapGrowth / 1048576).toFixed(2)} MB (under ${HEAP_SLACK / 1048576} MB); ${linked.length} shader programs linked in all, none twice between two rows, each rematch's battle ${ends[1].links} and each title after a battle ${titles[0].links}`)
} finally {
  await browser.close()
  close()
  rmSync(work, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
