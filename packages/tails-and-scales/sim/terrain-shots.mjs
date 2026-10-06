// The R3 screenshot diff: the battlefield drawn by the split terrain against
// the R0 code's, pixel for pixel, in Chromium (SwiftShader draws identical
// draw calls identically).
//
// Both builds are made fresh (sim/lib.mjs buildApp) and opened at
// ?debug&seed=<board>. Math.random is replaced before the page loads by a
// seeded generator, the same on both, so main.js paints the same mat and
// wood on both. Painting the same is not drawing the same, though:
// SwiftShader's WebGL is deterministic for identical draw calls, but
// Chromium's accelerated canvas 2D raster is not. With it, a page load now
// and then rasterises the mat a little differently, though the painting
// code is the same in every build since R0: one gate run saw 8,554 frame
// pixels (about 1%) differ by at most 2, all on the mat, and a probe of the
// mat alone saw 1 load in 16 differ. So the browser runs with canvas 2D and
// raster on the CPU (--disable-accelerated-2d-canvas,
// --disable-gpu-rasterization), where the probe saw 16 loads out of 16 the
// same, and the mat, the wood and fx's decals stay in the comparison.
//
// Then, through the ?debug surface both builds already have (__ts: clock, S,
// camera, renderer, units, scenery and its scene), the clock is stopped at
// 0 so every idle animation holds one pose, the camera is put at one fixed
// pose over the whole table, and a frame is drawn and read back.
//
// Lifetime: R0 to R3 code only. It reads view members the ?debug contract
// (the comment at the top of main.js's ?debug block) does not promise:
// clock.speed and clock.time, S.titleSpin, camera, renderer, scenery.scene,
// scenery.blast and units[].models[].mesh. The contract lists what the
// parity driver reads, and only that is kept working. The scenery members
// are the Scenery facade's, which goes at R4, and R7 moves the clock and
// camera into view/. So R4 ports this to whatever the ?debug block then
// exposes, or retires it (DESIGN's R3 notes and R4 row). A pixel diff as a
// gate at R7 is R7's to add, with these members in the contract then.
//
// Hidden, because they differ for reasons outside the terrain: the grass
// tufts and flowers (every InstancedMesh: the tufts, the flowers and fx's
// particle pools), and the figures. Since R1, main.js draws one Math.random
// at load (the placeholder dice seed) after the mat is painted, so every
// later Math.random (tuft placement, each figure's idle phase and fur
// jitter) is shifted by one between R0 and later code. With --full nothing
// is hidden: for comparing against a ref with the same draws at load (the
// commit before this one).
//
// Two shots per board: `table` as generated, and `wrecked` after the same
// blasts on both (some acid; Math.random reseeded alike just before them),
// run on to the end of every fall and topple, so collapsed blocks, rubble
// piles and fallen logs are compared too.
//
// A board whose shots differ is shot again on both sides, in fresh pages, up
// to RESHOOTS times. A difference in the code is deterministic (every
// cosmetic draw is seeded here), so it shows on every pass and the board
// fails. One that goes away is the environment's, not the code's: it is
// printed as noise that did not repeat, with how far each side's own frames
// moved between loads (the control: R0 against R0, now against now), and is
// not counted. Should the browser stop being deterministic again, that is
// where it shows.
//
//   node sim/terrain-shots.mjs [--ref <git ref>] [--seeds 1,4242,90210,411,22392] [--full] [--out <dir>]
//
// --ref defaults to the R0 commit (sim/lib.mjs LEGACY_REF). PNGs of both
// sides and a diff mask (differing pixels red over a dimmed frame) go to
// --out; without it, to a fresh temp dir that is kept only when something
// differed. Both builds go to a fresh temp dir per run, removed at the end,
// so runs side by side don't overwrite each other's. Exit 0 when every shot
// is identical (noise that did not repeat included), 1 when a difference
// repeats or a board couldn't be shot at all (the run goes on to the next),
// 2 on bad arguments. Set CHROMIUM_PATH to the pre-installed Chromium if
// Playwright's own isn't installed.
//
// Identical is not enough on its own: two blank canvases are identical too.
// So every frame must hold a picture (at least MIN_COLOURS distinct
// colours), the blasts must break something, and each side's wrecked frame
// must differ from its own table frame by at least MIN_WRECKED pixels;
// otherwise the board fails as vacuous.
import { parseArgs } from 'node:util'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { deflateSync, crc32 } from 'node:zlib'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, LEGACY_REF } from './lib.mjs'
import { IDLE_MS } from './chromium.mjs'
import { codeDir, PKG } from './oracle/pin.mjs'

// what a real frame shows at least (a blank canvas has 1 colour; the table
// as drawn here has tens of thousands), and how many pixels the blasts must
// change on each side (they change tens of thousands)
const MIN_COLOURS = 1000
const MIN_WRECKED = 2000
// how many more times a board whose shots differ is shot on both sides
const RESHOOTS = 2
const KINDS = ['table', 'wrecked']

function usage(why) {
  console.error(`terrain-shots: ${why}\nusage: node sim/terrain-shots.mjs [--ref <git ref>] [--seeds 1,4242,90210,411,22392] [--full] [--out <dir>]`)
  process.exit(2)
}
let a
try {
  ({ values: a } = parseArgs({ options: { ref: { type: 'string' }, seeds: { type: 'string' }, full: { type: 'boolean' }, out: { type: 'string' } } }))
} catch (e) {
  usage(e.message)
}
const ref = a.ref ?? LEGACY_REF
// 411 has log walls, trees and mushrooms, 22392 hedges and trees: the three
// boards before them have neither
const seedList = (a.seeds ?? '1,4242,90210,411,22392').split(',')
if (!seedList.every((v) => /^\d+$/.test(v))) usage(`--seeds ${a.seeds}: give whole numbers, comma-separated`)
const seeds = seedList.map(Number)
// per run, so two runs side by side never share a build or a PNG
const out = a.out ?? mkdtempSync(join(tmpdir(), 'tails-and-scales-shots-'))
mkdirSync(out, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-shots-build-'))

let sides
try {
  sides = [
    { name: ref === LEGACY_REF ? 'R0' : ref.slice(0, 9), dir: await buildApp(codeDir(ref), join(work, 'ref')) },
    { name: 'now', dir: await buildApp(PKG, join(work, 'now')) },
  ]
} catch (e) {
  rmSync(work, { recursive: true, force: true })
  if (!a.out) rmSync(out, { recursive: true, force: true })
  throw e
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
const frames = (page, n) => page.evaluate((n) => new Promise((r) => {
  const step = () => (n-- > 0 ? requestAnimationFrame(step) : r())
  step()
}), n)

// stop the clock at 0 and let a couple of frames pose everything for it
async function freeze(page) {
  await page.evaluate(() => {
    const { clock, S } = window.__ts
    S.titleSpin = false
    clock.speed = 0
    clock.time = 0
  })
  await frames(page, 3)
}

// draw one frame from the fixed pose and read it back (same task: the
// drawing buffer is still there)
function shoot(full) {
  const ts = window.__ts, scene = ts.scenery.scene, cam = ts.camera, r = ts.renderer
  if (!full) {
    scene.traverse((o) => {
      if (o.isInstancedMesh) o.visible = false
    })
    for (const u of ts.units) for (const m of u.models) m.mesh.visible = false
  }
  cam.clearViewOffset()
  cam.fov = 40
  cam.aspect = innerWidth / innerHeight
  cam.updateProjectionMatrix()
  cam.position.set(0, 30, 31)
  cam.up.set(0, 1, 0)
  cam.lookAt(0, 0, 1.5)
  cam.updateMatrixWorld()
  r.render(scene, cam)
  const gl = r.getContext()
  const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight
  const px = new Uint8Array(w * h * 4)
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px)
  let s = ''
  for (let i = 0; i < px.length; i += 0x8000) s += String.fromCharCode.apply(null, px.subarray(i, i + 0x8000))
  return { w, h, px: btoa(s) }
}

// the same blasts on both builds: every seventh breakable chunk of the
// table as generated, Math.random reseeded first; then on to the end of
// every tween
async function wreck(page) {
  const n = await page.evaluate(() => {
    let x = 99
    Math.random = () => {
      x = (x + 0x6d2b79f5) | 0
      let t = Math.imul(x ^ (x >>> 15), 1 | x)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const sc = window.__ts.scenery
    const targets = sc.chunks.filter((c) => c.destructible).filter((_, i) => i % 7 === 0).map((c) => ({ x: c.shape.x, z: c.shape.z }))
    let broke = 0
    targets.forEach((t, i) => (broke += sc.blast(t.x + 0.3, t.z - 0.2, 2.4, 3, { acid: i % 3 === 0 }).length))
    window.__ts.clock.speed = 40
    return broke
  })
  await frames(page, 12)
  return n
}

function png(w, h, rgba) {
  // rows bottom-up as GL reads them; PNG wants them top-down
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) rgba.copy(raw, y * (w * 4 + 1) + 1, (h - 1 - y) * w * 4, (h - y) * w * 4)
  const chunk = (type, data) => {
    const b = Buffer.alloc(12 + data.length)
    b.writeUInt32BE(data.length, 0)
    b.write(type, 4, 'ascii')
    data.copy(b, 8)
    b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length)
    return b
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

// one board on one side: the table as generated, then wrecked
async function shootBoard(seed, s, url) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  try {
    const page = await ctx.newPage()
    page.setDefaultTimeout(IDLE_MS)
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(`(${seedRandom})(${seed * 7919 + 1})`)
    await page.goto(`${url}/?debug&seed=${seed}`, { timeout: IDLE_MS })
    await page.waitForFunction(() => window.__ts, null, { timeout: IDLE_MS })
    await freeze(page)
    const table = await page.evaluate(shoot, !!a.full)
    const broke = await wreck(page)
    await freeze(page)
    const wrecked = await page.evaluate(shoot, !!a.full)
    if (errors.length) throw new Error(`${s.name}: ${errors.join('; ')}`)
    return { table, wrecked, broke, chunks: await page.evaluate(() => window.__ts.scenery.chunks.length) }
  } catch (e) {
    throw new Error(`${s.name}: ${e.message}`)
  } finally {
    await ctx.close()
  }
}

// distinct colours in a frame, and pixels that differ between two frames
function colours(f) {
  const b = Buffer.from(f.px, 'base64')
  return new Set(new Uint32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.length))).size
}
function differing(f, g) {
  if (f.w !== g.w || f.h !== g.h) return f.w * f.h
  const a = Buffer.from(f.px, 'base64'), b = Buffer.from(g.px, 'base64')
  let n = 0
  for (let p = 0; p < a.length; p += 4) if (a[p] !== b[p] || a[p + 1] !== b[p + 1] || a[p + 2] !== b[p + 2] || a[p + 3] !== b[p + 3]) n++
  return n
}

// one pass over a board: both sides shot, in fresh pages
async function pass(seed) {
  const shots = []
  for (const [i, s] of sides.entries()) shots.push(await shootBoard(seed, s, servers[i].url))
  return shots
}
// what differs between the two sides in a pass: pixels per kind, and the
// chunks the blasts broke
const passDiff = (sh) => ({ table: differing(sh[0].table, sh[1].table), wrecked: differing(sh[0].wrecked, sh[1].wrecked), broke: sh[0].broke !== sh[1].broke })
const differs = (d) => d.broke || KINDS.some((k) => d[k])

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  // canvas 2D and raster on the CPU: the GPU path isn't stable between
  // page loads (the header); WebGL stays on SwiftShader as for every
  // browser harness in sim/
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-accelerated-2d-canvas', '--disable-gpu-rasterization'],
})
const servers = await Promise.all(sides.map((s) => startStaticServer(s.dir)))
let failed = 0, noisy = 0, looked = false
try {
  console.log(`terrain shots: ${sides[0].name} (${ref.slice(0, 9)}) against the working tree, ${a.full ? 'everything drawn' : 'tufts, flowers and figures hidden'}`)
  for (const seed of seeds) {
    const where = `  seed ${String(seed).padEnd(6)}`
    let shots
    try {
      shots = await pass(seed)
    } catch (e) {
      failed++
      console.log(`${where} NOT RUN: ${String(e.message ?? e).split('\n')[0].slice(0, 300)}`)
      continue
    }
    // shot again while the latest pass differs: a difference in the code
    // repeats on every pass, the environment's goes away
    const passes = [shots], diffs = [passDiff(shots)]
    while (differs(diffs.at(-1)) && passes.length <= RESHOOTS) {
      try {
        passes.push(await pass(seed))
      } catch (e) {
        console.log(`${where} re-shoot ${passes.length} NOT RUN: ${String(e.message ?? e).split('\n')[0].slice(0, 300)}`)
        break
      }
      diffs.push(passDiff(passes.at(-1)))
    }
    const repeated = differs(diffs.at(-1))
    if (passes.length > 1) {
      looked = true
      // the control: how far each side's own frames moved between its loads
      const moved = sides.map((s, i) => `${s.name} ${passes.slice(1).map((p) => KINDS.map((k) => differing(shots[i][k], p[i][k])).join('/')).join(', ')}`)
      console.log(`${where} differed, so shot ${passes.length - 1} more time(s): ${diffs.map((d) => `${d.table}/${d.wrecked} px${d.broke ? ', broke differs' : ''}`).join(' -> ')} (table/wrecked); each side against its own first pass: ${moved.join('; ')}`)
      if (!repeated) {
        noisy++
        console.log(`${where} NOISE, not counted: re-shoot ${passes.length - 1} is identical, so the difference came from the environment, not the code (the first pass's PNGs are kept)`)
      }
    }
    const vacuous = []
    for (const [i, sh] of shots.entries()) {
      const name = sides[i].name
      for (const kind of KINDS) {
        const n = colours(sh[kind])
        if (n < MIN_COLOURS) vacuous.push(`${name} ${kind}: ${n} colours`)
      }
      if (!sh.broke) vacuous.push(`${name}: the blasts broke nothing`)
      const changed = differing(sh.table, sh.wrecked)
      if (changed < MIN_WRECKED) vacuous.push(`${name}: wrecked differs from table by ${changed} pixels`)
    }
    for (const kind of KINDS) {
      const [A, B] = shots.map((s) => s[kind])
      const pa = Buffer.from(A.px, 'base64'), pb = Buffer.from(B.px, 'base64')
      let diff = 0, max = 0
      const mask = Buffer.alloc(pa.length)
      for (let p = 0; p < pa.length; p += 4) {
        const d = Math.max(Math.abs(pa[p] - pb[p]), Math.abs(pa[p + 1] - pb[p + 1]), Math.abs(pa[p + 2] - pb[p + 2]), Math.abs(pa[p + 3] - pb[p + 3]))
        if (d) diff++
        if (d > max) max = d
        if (d) mask.set([255, 0, 0, 255], p)
        else mask.set([pa[p] >> 2, pa[p + 1] >> 2, pa[p + 2] >> 2, 255], p)
      }
      const base = join(out, `seed${seed}-${kind}`)
      writeFileSync(`${base}-${sides[0].name}.png`, png(A.w, A.h, pa))
      writeFileSync(`${base}-now.png`, png(B.w, B.h, pb))
      writeFileSync(`${base}-diff.png`, png(A.w, A.h, mask))
      const note = kind === 'wrecked'
        ? ` (${shots[0].broke}/${shots[1].broke} chunks broken, ${shots[0].chunks}/${shots[1].chunks} chunks after, ${differing(shots[0].table, shots[0].wrecked)}/${differing(shots[1].table, shots[1].wrecked)} pixels changed by them)`
        : ` (${colours(A)}/${colours(B)} colours)`
      const last = diffs.at(-1)[kind]
      const verdict = passes.length === 1 || (!diff && !last) ? '' : `; re-shoot ${passes.length - 1}: ${last ? `${last} pixels differ` : 'identical'}`
      console.log(`${where} ${kind.padEnd(8)} ${A.w}x${A.h}: ${diff ? `${diff} pixels differ (max channel delta ${max})` : 'identical'}${verdict}${note}`)
      if (last) failed++
    }
    if (diffs.at(-1).broke) {
      failed++
      console.log(`${where} the blasts broke ${passes.at(-1)[0].broke} chunks on ${sides[0].name}, ${passes.at(-1)[1].broke} now`)
    }
    if (vacuous.length) {
      failed++
      console.log(`${where} VACUOUS: ${vacuous.join('; ')}`)
    }
  }
} finally {
  servers.forEach((s) => s.close())
  await browser.close()
  rmSync(work, { recursive: true, force: true })
}
// a fresh PNG dir nobody asked for is kept only when there is something to see
const kept = a.out || failed || looked
if (!kept) rmSync(out, { recursive: true, force: true })
const pngs = kept ? ` (PNGs in ${out})` : ''
const noise = noisy ? `; ${noisy} board(s) differed on a pass and not on a re-shoot: noise, not counted (above)` : ''
console.log(failed ? `\n${failed} problem(s): shots that differ on every pass, boards not run or vacuous${noise}${pngs}` : `\nevery shot identical, and every one a real frame${noise}${pngs}`)
process.exit(failed ? 1 : 0)
