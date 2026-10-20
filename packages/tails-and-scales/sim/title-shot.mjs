// The title at 1200 ms (DESIGN §4 R7: "title still up at 1200 ms
// (thumbnail unchanged)"): the gallery's card is a screenshot of the title
// screen taken 1200 ms after the page settles (the repo's
// scripts/thumbnails.mjs: 1280×800 at DPR 2, written at CSS size). A view
// refactor must leave that frame as it was. The committed thumbnail.jpg
// can't be matched pixel for pixel by any run (the mat is painted from
// Math.random and the frame lands where the wall clock puts it), so this
// shoots the title the way the thumbnail script does from two builds, the
// code under test and a reference (HEAD by default), with every source of
// difference pinned on both: Math.random seeded alike before the page loads
// (the same board, mat, wood, tufts), the page's frames run by hand at 60 a
// second of a clock of its own for 1200 ms (requestAnimationFrame and
// performance.now replaced before the page loads: the same frames, the same
// deltas), and canvas 2D on the CPU (sim/terrain-shots.mjs's flags: the GPU
// raster isn't stable between loads).
//
// What must be the same:
//   - the frame with the figures hidden (found by the mark every figure's
//     root carries, userData.fig), pixel for pixel, and a real picture: the
//     mat, the wood, the board's terrain, the tufts and flowers, the
//     objectives, the title card, the camera's orbit at 1200 ms;
//   - every figure: as many, each where it stood and turned as it was, and
//     its miniature the same mesh, vertex for vertex (but for a builder that
//     draws Math.random itself, whose figure the cache marks userData.drawn:
//     a trebuchet's acorns, heaped at random, so from another point of the
//     stream too, below; its meshes as many vertices each).
// What may differ, since R7's template cache (view/models/cache.js): each
// figure's base flock (a few tufts of grass) and its idle animation's phase,
// which are drawn from Math.random per figure, as they always were, but from
// another point of the stream: three.js draws Math.random for every object
// it makes, and a unit's first figure makes more objects than one built
// afresh (the template, then its clone) and each later one fewer (a clone).
// (Unseeded, as the thumbnail is shot, they fall differently on every load
// anyway.) A reference before R7 marks no figure drawn, so the mark is the
// working tree's, read from the figure in the same place. The whole frame's
// differing pixels are reported, not failed. JPEGs of the code under
// test's frames, encoded as the thumbnail is, are kept beside the PNGs for a
// look against the committed thumbnail.jpg.
//
//   node sim/title-shot.mjs [--ref <git ref>] [--seeds 1,2,3] [--out <dir>] [--control] [--timeout <s>]
//
// --control shoots the reference on both sides (two loads of one build):
// the harness's own determinism, which must hold for a difference to mean
// anything.
// --seeds are Math.random seeds (each draws its own board, as a thumbnail
// shot with no ?seed does). --timeout is how long the page may take over a
// step, a DPR-2 screenshot the slowest (120 s by default; SwiftShader on a
// machine busy with other Chromiums has needed more). Exit 0 when every
// frame is identical, 1 when one differs (or isn't a picture), 2 on bad
// arguments, 3 when a step timed out before a frame that differs was found
// (inconclusive: the frames left were not compared, which says nothing of
// them; run it again, or with a longer --timeout). Set CHROMIUM_PATH to the
// pre-installed Chromium if Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp } from './lib.mjs'
import { IDLE_MS } from './chromium.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

const SETTLE_MS = 1200
const VIEW = { width: 1280, height: 800 }
// a real frame has thousands of colours; a blank canvas one
const MIN_COLOURS = 1000

function usage(why) {
  console.error(`title-shot: ${why}\nusage: node sim/title-shot.mjs [--ref <git ref>] [--seeds 1,2,3] [--out <dir>] [--control] [--timeout <s>]`)
  process.exit(2)
}
let a
try {
  ({ values: a } = parseArgs({ options: { ref: { type: 'string' }, seeds: { type: 'string' }, out: { type: 'string' }, control: { type: 'boolean' }, timeout: { type: 'string' } } }))
} catch (e) {
  usage(e.message)
}
const ref = a.ref ?? 'HEAD'
const seedList = (a.seeds ?? '1,2,3').split(',')
if (!seedList.every((v) => /^\d+$/.test(v))) usage(`--seeds ${a.seeds}: give whole numbers, comma-separated`)
const seeds = seedList.map(Number)
if (a.timeout !== undefined && !(/^\d+$/.test(a.timeout) && Number(a.timeout) > 0)) usage(`--timeout ${a.timeout}: give a whole number of seconds`)
const TIMEOUT_MS = a.timeout ? Number(a.timeout) * 1000 : IDLE_MS
const out = a.out ?? mkdtempSync(join(tmpdir(), 'tails-and-scales-title-'))
mkdirSync(out, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-title-build-'))

// in the page, before main.js: its frames run only when __frames(n) says,
// each 1/60 s of a clock of its own
const handFrames = () => {
  let now = 0, queue = []
  performance.now = () => now
  window.requestAnimationFrame = (cb) => queue.push(cb)
  window.__frames = (n) => {
    for (let i = 0; i < n; i++) {
      now += 1000 / 60
      const q = queue
      queue = []
      for (const cb of q) cb(now)
    }
  }
}
// in the page, before main.js: Math.random from a fixed seed
const seedRandom = (s) => {
  let x = s >>> 0
  Math.random = () => {
    x = (x + 0x6d2b79f5) | 0
    let t = Math.imul(x ^ (x >>> 15), 1 | x)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let failed = 0, timedOut = null
const sides = []
let browser = null, servers = []
try {
  sides.push({ name: ref.slice(0, 9), dir: await buildApp(codeDir(ref), join(work, 'ref')) })
  sides.push({ name: 'now', dir: a.control ? sides[0].dir : await buildApp(PKG, join(work, 'now')) })
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-accelerated-2d-canvas', '--disable-gpu-rasterization'],
  })
  servers = await Promise.all(sides.map((s) => startStaticServer(s.dir)))

  // the title of one build, 1200 ms of the page's clock after it settled
  const shoot = async (seed, i) => {
    const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 2 })
    try {
      const page = await ctx.newPage()
      page.setDefaultTimeout(TIMEOUT_MS)
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.addInitScript(`(${seedRandom})(${seed * 7919 + 1});(${handFrames})()`)
      // (?debug, for the scene; it adds nothing to it)
      await page.goto(servers[i].url + '/?debug', { timeout: TIMEOUT_MS })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      // the figures: each root's place and turn, its miniature's meshes
      // (every vertex, hashed), and hidden for the first frame
      const figures = await page.evaluate((hide) => {
        const out = []
        const hash = (a) => {
          let h = 0x811c9dc5
          const u = new Uint32Array(a.buffer, a.byteOffset, a.length)
          for (const x of u) h = Math.imul(h ^ x, 0x01000193) >>> 0
          return h.toString(16)
        }
        window.__ts.scenery.scene.traverse((o) => {
          if (!o.userData.fig) return
          const meshes = [], shapes = []
          o.userData.fig.traverse((m) => {
            if (!m.isMesh) return
            const p = m.geometry.attributes.position
            meshes.push(`${hash(p.array)}/${m.material.vertexColors}`)
            shapes.push(`${p.count}/${m.material.vertexColors}`)
          })
          out.push({ at: [o.position.x, o.position.y, o.position.z, o.rotation.y].join(','), meshes: meshes.join(' '), shapes: shapes.join(' '), drawn: !!o.userData.drawn })
          if (hide) o.visible = false
        })
        return out.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
      }, true)
      await page.evaluate((n) => window.__frames(n), Math.round((SETTLE_MS * 60) / 1000))
      const bare = await page.screenshot({ type: 'png', scale: 'css' })
      // then the whole frame, figures shown, a frame later
      await page.evaluate(() => {
        window.__ts.scenery.scene.traverse((o) => o.userData.fig && (o.visible = true))
        window.__frames(1)
      })
      const png = await page.screenshot({ type: 'png', scale: 'css' })
      const jpg = await page.screenshot({ type: 'jpeg', quality: 82, scale: 'css' })
      const title = await page.evaluate(() => !document.querySelector('#title').classList.contains('hidden'))
      if (errors.length) throw new Error(errors.join('; '))
      return { bare, png, jpg, title, figures }
    } finally {
      await ctx.close()
    }
  }
  // pixels that differ, and distinct colours, decoded in a page
  const page = await (await browser.newContext()).newPage()
  const compare = (x, y) => page.evaluate(async ([x, y]) => {
    const px = async (b64) => {
      const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
      const c = new OffscreenCanvas(bmp.width, bmp.height)
      const g = c.getContext('2d')
      g.drawImage(bmp, 0, 0)
      return g.getImageData(0, 0, bmp.width, bmp.height).data
    }
    const [p, q] = [await px(x), await px(y)]
    let diff = 0
    const colours = new Set()
    for (let i = 0; i < p.length; i += 4) {
      if (p[i] !== q[i] || p[i + 1] !== q[i + 1] || p[i + 2] !== q[i + 2]) diff++
      colours.add((p[i] << 16) | (p[i + 1] << 8) | p[i + 2])
    }
    return { diff, colours: colours.size, size: p.length / 4 }
  }, [x.toString('base64'), y.toString('base64')])

  console.log(`title-shot: the title at ${SETTLE_MS} ms (${VIEW.width}×${VIEW.height}, DPR 2, as the thumbnail is shot), ${ref} against ${a.control ? 'itself (--control)' : 'the working tree'}`)
  for (const seed of seeds) {
    let shots
    try {
      shots = [await shoot(seed, 0), await shoot(seed, 1)]
    } catch (e) {
      // the machine, not the frames: a step outran its timeout (Playwright's
      // TimeoutError), so this seed and those after it go uncompared
      if (e?.name !== 'TimeoutError') throw e
      timedOut = `seed ${seed}: ${e.message.split('\n')[0]}`
      console.log(`  seed ${String(seed).padEnd(6)} INCONCLUSIVE: timed out (${e.message.split('\n')[0]})`)
      break
    }
    const [A, B] = shots
    const c = await compare(A.bare, B.bare), all = await compare(A.png, B.png)
    for (const [s, shot] of [[sides[0], A], [sides[1], B]]) {
      writeFileSync(join(out, `title-seed${seed}-${s.name}-bare.png`), shot.bare)
      writeFileSync(join(out, `title-seed${seed}-${s.name}.png`), shot.png)
    }
    writeFileSync(join(out, `title-seed${seed}-now.jpg`), B.jpg)
    // a figure as the two compare it: where it stands, and its miniature's
    // meshes (their shapes only, if the working tree's is drawn at random)
    const key = (f, drawn) => `${f.at} ${drawn ? f.shapes : f.meshes}`
    const figs = A.figures.length !== B.figures.length ? `${A.figures.length} figures, now ${B.figures.length}`
      : A.figures.findIndex((f, k) => key(f, B.figures[k].drawn) !== key(B.figures[k], B.figures[k].drawn))
    // (where a figure differs: its place, then its first mesh that does)
    const where = (x, y) => {
      const [p, q] = [x.split(' '), y.split(' ')]
      const k = p.findIndex((w, i) => w !== q[i])
      return k <= 0 ? `at ${p[0]}, now ${q[0]}` : `at ${p[0]}: mesh ${k} of ${p.length - 1}, ${p[k]} now ${q[k] ?? 'missing'}`
    }
    const drawn = B.figures.filter((f) => f.drawn).length
    const figWhy = typeof figs === 'string' ? figs : figs >= 0 ? `a figure differs ${where(key(A.figures[figs], B.figures[figs].drawn), key(B.figures[figs], B.figures[figs].drawn))}` : ''
    const why = !A.title || !B.title ? 'the title is not up' : c.colours < MIN_COLOURS ? `not a picture (${c.colours} colours)` : c.diff ? `${c.diff} of ${c.size} pixels differ with the figures hidden` : !A.figures.length ? 'no figures on the title' : figWhy
    if (why) failed++
    console.log(`  seed ${String(seed).padEnd(6)} ${why ? `DIFFERS: ${why}` : `identical with the figures hidden (${c.size} pixels, ${c.colours} colours); ${A.figures.length} figures each where it was, its miniature vertex for vertex (${drawn} drawn at random: mesh for mesh); the whole frame differs in ${all.diff} pixels (the figures' flocks and idle phases)`}`)
  }
} finally {
  servers.forEach((s) => s.close())
  await browser?.close()
  rmSync(work, { recursive: true, force: true })
}
if (failed) console.log(`\ntitle-shot FAILED: ${failed} of ${seeds.length} (PNGs in ${out})`)
else if (timedOut) console.log(`\ntitle-shot INCONCLUSIVE: a step timed out (${timedOut}) after ${TIMEOUT_MS / 1000} s, so not every frame was compared (none compared differs); run it again, or with a longer --timeout`)
else console.log(`\ntitle-shot passed: the title at ${SETTLE_MS} ms is the reference's, pixel for pixel with the figures hidden, and every figure where it stood, its miniature the same (PNGs and the JPEG in ${out})`)
process.exit(failed ? 1 : timedOut ? 3 : 0)
