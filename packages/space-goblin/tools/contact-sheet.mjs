#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Contact sheet
//
// The retrospective's finding was that the two worst bugs in this character —
// a world scrolling the wrong way, and a cleaver 104.7° out of the fist — both
// survived review because the character was only ever judged from one
// whole-body render at one angle at one moment of one clip. A single render is
// a sample of size one from a six-dimensional space (view × clip × phase ×
// overlay), and both bugs happened to be invisible at the sample that was
// taken.
//
// So take the whole grid instead, and put the labels *in* the pixels: every
// tile carries the axis compass and a burnt-in caption saying which view, which
// clip and what time it is. A tile that cannot be misattributed is a tile you
// can argue about.
//
//   node tools/contact-sheet.mjs
//   node tools/contact-sheet.mjs --mode all --clip run
//   node tools/contact-sheet.mjs --out tools/out/after --diff tools/out/before
//
// Everything runs against a `vite build` + `vite preview` snapshot, never the
// dev server: HMR reloading the page mid-capture has already corrupted one
// debugging session, and half a sheet from each of two builds is worse than no
// sheet at all.
// ---------------------------------------------------------------------------

import fs from 'node:fs/promises'
import path from 'node:path'
import { build, preview } from 'vite'
import { chromium } from 'playwright'
import {
  PKG_DIR,
  CHROMIUM,
  ALL_VIEWS,
  ALL_CLIPS,
  openTurntable,
  settle,
  setClip,
  setPhase,
  setPlaying,
  setOverlays,
  captureTile,
  readState,
  probeScrub,
  installPhaseShim,
} from './lib/turntable.mjs'
import { openCanvasPage, beginSheet, drawTile, drawOverlay, endSheet, comparePng } from './lib/imaging.mjs'

// ---------------------------------------------------------------------------
// Modes
//
// `plain` is the sheet you read to judge the figure. `sockets` and `trails`
// exist because they are the two overlays that answer the two questions the
// retrospective says nobody could answer from a render: "is the sword actually
// in his hand" and "is he running forwards".
//
// Their default view lists are narrower than `plain`'s on purpose. A socket
// triad on a knuckle is unreadable from the BACK preset at 2.55 m, and a
// world-space foot trail read down its own axis from FRONT is a dot. Pass
// `--views` to override any of them.
// ---------------------------------------------------------------------------
const MODES = {
  plain: {
    views: ALL_VIEWS,
    overlays: {},
    blurb: 'the figure, unannotated',
  },
  sockets: {
    // Close and three-quarter views: the seat/plug triads are centimetres wide.
    views: ['hands', 'q34', 'front'],
    overlays: { sockets: true },
    blurb: 'seat ⇄ plug frames — is the kit actually in his hand',
  },
  trails: {
    // Trails are world-space paths; you need a view with the travel axis across
    // the screen, not down it.
    views: ['left', 'q34', 'back'],
    overlays: { trails: true },
    blurb: 'world-space paths — which way do the feet actually go',
  },
}

// ---- CLI ------------------------------------------------------------------

function parseArgs(argv) {
  const o = {
    out: path.join(PKG_DIR, 'tools/out/latest'),
    clips: ALL_CLIPS,
    views: null, // null = each mode's own default
    modes: ['plain'],
    phases: 3,
    width: 800,
    height: 560,
    scale: 0.6,
    settle: 1,
    trailFrames: 28,
    port: 4620,
    diff: null,
    diffOnly: false,
    fromTiles: false,
    threshold: 8,
    top: 14,
    build: true,
  }
  const num = (v, name) => {
    const n = Number(v)
    if (!Number.isFinite(n)) throw new UsageError(`--${name} needs a number, got ${v}`)
    return n
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      if (i + 1 >= argv.length) throw new UsageError(`${a} needs a value`)
      return argv[++i]
    }
    switch (a) {
      case '--help': case '-h': o.help = true; break
      case '--out': o.out = path.resolve(next()); break
      case '--clip': case '--clips': o.clips = split(next()); break
      case '--views': case '--view': o.views = split(next()); break
      case '--mode': case '--modes': o.modes = split(next()); break
      case '--phases': o.phases = num(next(), 'phases'); break
      case '--size': {
        const [w, h] = next().split('x').map(Number)
        o.width = w; o.height = h
        break
      }
      case '--scale': o.scale = num(next(), 'scale'); break
      case '--settle': o.settle = num(next(), 'settle'); break
      case '--trail-frames': o.trailFrames = num(next(), 'trail-frames'); break
      case '--port': o.port = num(next(), 'port'); break
      case '--diff': o.diff = path.resolve(next()); break
      case '--diff-only': o.diffOnly = true; break
      case '--from-tiles': o.fromTiles = true; break
      case '--threshold': o.threshold = num(next(), 'threshold'); break
      case '--top': o.top = num(next(), 'top'); break
      case '--no-build': o.build = false; break
      default: throw new UsageError(`unknown option ${a} (try --help)`)
    }
  }
  if (o.modes.includes('all')) o.modes = Object.keys(MODES)
  for (const m of o.modes) if (!MODES[m]) throw new UsageError(`unknown mode ${m}; have ${Object.keys(MODES).join(', ')}, all`)
  for (const c of o.clips) if (!ALL_CLIPS.includes(c)) throw new UsageError(`unknown clip ${c}; have ${ALL_CLIPS.join(', ')}`)
  for (const v of o.views ?? []) if (!ALL_VIEWS.includes(v)) throw new UsageError(`unknown view ${v}; have ${ALL_VIEWS.join(', ')}`)
  // Calibration costs one extra grab per distinct view. It is only worth
  // paying for when a diff will actually consume it — but it is written into
  // the manifest, so a run captured with --diff can serve as the baseline for a
  // later one that supplies its own.
  o.calibrate = Boolean(o.diff)
  if (o.diffOnly && !o.diff) throw new UsageError('--diff-only needs --diff <baselineDir>')
  return o
}

const split = (s) => s.split(',').map((x) => x.trim()).filter(Boolean)

/** A mistake in the command line, not in the code — printed without a stack. */
class UsageError extends Error {}

const HELP = `
contact-sheet — every view preset x a few phases of every clip, in one PNG.

  --out <dir>            where sheets, tiles and the manifest go
                         (default tools/out/latest)
  --clip <a,b>           ${ALL_CLIPS.join(',')}            (default all)
  --views <a,b,c>        ${ALL_VIEWS.join(',')}
                         (default: each mode's own list, see --mode)
  --mode <a,b>|all       ${Object.keys(MODES).map((m) => `${m} [${MODES[m].views.join(',')}]`).join('\n                         ')}
                         (default plain)
  --phases <n>           samples per clip, evenly spaced (default 3)
  --size <WxH>           capture size per tile (default 800x560)
  --scale <f>            tile scale inside the sheet (default 0.6)
  --settle <f>           multiplier on every settle wait (default 1)
  --trail-frames <n>     frames of playback before a trails tile (default 28)
  --diff <baselineDir>   compare every tile against a previous run's tiles and
                         print the biggest movers
  --diff-only            compare only; do not capture or re-lay-out
  --from-tiles           re-lay-out the sheets from tiles already in --out,
                         without recapturing (for iterating on the layout)
  --threshold <n>        per-channel delta that counts as a changed pixel (8)
  --top <n>              rows in the movers table (default 14)
  --no-build             reuse the existing dist/ instead of rebuilding
  --port <n>             preview server port (default 4620)

Timings on this container, which has no GPU and rasterises in software at
roughly 300 ms a frame: the default (3 clips x 6 views x 3 phases) is about
two minutes. --mode all --clip run is about 80 s. Halve either with
--phases 2, or with --size 640x450 at some cost in legibility.
`

// ---- capture --------------------------------------------------------------

const slug = (s) => String(s).replace(/[^a-z0-9]+/gi, '-').toLowerCase()

/** Frames of real playback after a clip change, before anything is captured. */
const SWEEP_FRAMES = 12

async function capture(page, opts) {
  const tiles = []
  const floorSweep = {}
  // One extra grab of an already-captured state, once per distinct view. See
  // measureNoiseFloor: without it the diff table has no idea which numbers are
  // large.
  const repeats = new Map()
  const t0 = Date.now()

  for (const clip of opts.clips) {
    await setClip(page, clip)
    // Play a stretch of the clip before capturing anything. This doubles as the
    // settle after a clip change, but the reason it *plays* is the floor
    // readout: `floorMin` is a running minimum over rendered frames, so a sheet
    // built entirely from a handful of paused poses would report the deepest
    // foot of four frames and call it the deepest foot of the clip. Play first,
    // read the minimum, then pause and capture.
    await setPlaying(page, true)
    await settle(page, Math.round(SWEEP_FRAMES * opts.settle))
    await setPlaying(page, false)
    floorSweep[clip] = (await readState(page)).floor

    for (const mode of opts.modes) {
      const spec = MODES[mode]
      const views = opts.views ?? spec.views
      await setOverlays(page, spec.overlays)

      if (mode === 'trails') {
        // Trails are the one thing that cannot be scrubbed into existence: the
        // scrub handler clears them, by design, because a trail assembled from
        // scrubbed frames would be a lie about how the foot moved. So play,
        // then freeze, then walk the views over the frozen path.
        await setPhase(page, 0)
        await setPlaying(page, true)
        await settle(page, Math.round(opts.trailFrames * opts.settle))
        await setPlaying(page, false)
        for (const view of views) {
          const tile = await grabTile(page, view, { clip, mode, view, phaseIndex: 0 })
          tiles.push(tile)
          if (opts.calibrate && !repeats.has(view)) {
            repeats.set(view, { a: tile.base64, b: (await captureTile(page, null)).base64 })
          }
        }
        continue
      }

      for (let p = 0; p < opts.phases; p++) {
        await setPhase(page, p / opts.phases)
        await settle(page, Math.round(4 * opts.settle))
        for (const view of views) {
          const tile = await grabTile(page, view, { clip, mode, view, phaseIndex: p })
          tiles.push(tile)
          if (opts.calibrate && !repeats.has(view)) {
            repeats.set(view, { a: tile.base64, b: (await captureTile(page, null)).base64 })
          }
        }
      }
    }
    await setOverlays(page, {})
  }

  return { tiles, floorSweep, repeats, captureMs: Date.now() - t0 }
}

async function grabTile(page, view, meta) {
  const { base64, state } = await captureTile(page, view)
  return {
    ...meta,
    name: `${slug(meta.clip)}__${slug(meta.mode)}__${slug(meta.view)}__p${meta.phaseIndex}.png`,
    base64,
    state,
  }
}

// ---- sheet layout ---------------------------------------------------------

const INK = '#e7f0ea'
const MUTED = '#7f9089'
const GLOW = '#48e8ff'
const BAD = '#ff6b6b'
const OK = '#7dff9b'
const BG = '#0b0e13'
const FONT = '"DejaVu Sans", "Segoe UI", system-ui, sans-serif'

const PAD = 14
const GAP = 8
const HEADER = 80
const CAPTION = 34

/**
 * Grid shape. Phases across, views down — reading a row tells you how one angle
 * changes through the clip, reading a column tells you what one moment looks
 * like from everywhere. When there is only one phase (trails), views go across
 * instead, because a one-column sheet six rows tall is a strip, not a sheet.
 */
function layout(tiles, { views, phases, tileW, tileH }) {
  const single = phases <= 1
  const cols = single ? Math.min(3, views.length) : phases
  const cells = tiles.map((t, i) => {
    const col = single ? i % cols : t.phaseIndex
    const row = single ? Math.floor(i / cols) : views.indexOf(t.view)
    return { tile: t, col, row }
  })
  const rows = Math.max(...cells.map((c) => c.row)) + 1
  return {
    cols,
    rows,
    cells,
    width: PAD * 2 + cols * tileW + (cols - 1) * GAP,
    height: PAD * 2 + HEADER + rows * (CAPTION + tileH) + (rows - 1) * GAP,
  }
}

/** The worst of a tile's socket errors, as a caption fragment. */
function socketSummary(state) {
  if (!state.sockets?.length) return null
  const worst = state.sockets.reduce((a, b) =>
    Math.max(b.axisDeg, b.rollDeg, b.offsetMm) > Math.max(a.axisDeg, a.rollDeg, a.offsetMm) ? b : a,
  )
  const bad = state.sockets.some((s) => s.axisDeg > 1 || s.rollDeg > 1 || s.offsetMm > 1)
  const text = state.sockets
    .map((s) => `${s.name.toUpperCase()} ${s.axisDeg.toFixed(1)}° / ${s.offsetMm.toFixed(1)} mm`)
    .join('  ·  ')
  return { text, bad, worst }
}

async function buildSheet(canvasPage, { clip, mode, tiles, views, phases, opts, meta }) {
  const tileW = Math.round(opts.width * opts.scale)
  const tileH = Math.round(opts.height * opts.scale)
  const L = layout(tiles, { views, phases, tileW, tileH })

  await beginSheet(canvasPage, { width: L.width, height: L.height, background: BG })
  for (const { tile, col, row } of L.cells) {
    await drawTile(canvasPage, {
      base64: tile.base64,
      x: PAD + col * (tileW + GAP),
      y: PAD + HEADER + row * (CAPTION + tileH + GAP) + CAPTION,
      width: tileW,
      height: tileH,
    })
  }

  const ops = []
  const spec = MODES[mode]

  // Header. The floor numbers ride here rather than in a tile caption because
  // they are a running minimum over the whole clip, not a property of a frame.
  ops.push({ kind: 'rect', x: 0, y: 0, width: L.width, height: PAD + HEADER - 8, fill: '#11151c' })
  ops.push({
    kind: 'text', x: PAD, y: PAD + 12, text: `SPACE GOBLIN · ${clip.toUpperCase()} · ${mode.toUpperCase()}`,
    font: `700 20px ${FONT}`, fill: GLOW, letterSpacing: '2px',
  })
  ops.push({
    kind: 'text', x: PAD, y: PAD + 34, text: spec.blurb,
    font: `400 13px ${FONT}`, fill: MUTED, maxWidth: L.width * 0.55,
  })
  const floor = meta.floor
  const floorText =
    floor.L == null
      ? 'floor —'
      : `deepest foot over ${meta.sweepFrames} frames of playback   L ${(floor.L * 1000).toFixed(1)} mm   R ${(floor.R * 1000).toFixed(1)} mm`
  ops.push({
    kind: 'text', x: PAD, y: PAD + 51, text: floorText,
    font: `600 13px ${FONT}`, fill: floor.L != null && Math.min(floor.L, floor.R) < -0.002 ? BAD : OK,
    maxWidth: L.width * 0.55,
  })
  ops.push({
    kind: 'text', x: L.width - PAD, y: PAD + 12, align: 'right',
    text: `${L.cols}×${L.rows} tiles · ${opts.width}×${opts.height} @ ${opts.scale}`,
    font: `600 13px ${FONT}`, fill: INK,
  })
  ops.push({
    kind: 'text', x: L.width - PAD, y: PAD + 32, align: 'right', text: meta.stamp,
    font: `400 12px ${FONT}`, fill: MUTED,
  })
  // Never let a shimmed sheet pass for an unshimmed one. Its own line: it used
  // to share one with the floor readout and the two overprinted each other.
  if (meta.shimmed) {
    ops.push({
      kind: 'text', x: PAD, y: PAD + 70,
      text: 'PHASE SHIM ACTIVE — the shipped scrub slider does not move the pose; see CONTACT-SHEET.md',
      font: `700 13px ${FONT}`, fill: BAD, maxWidth: L.width - PAD * 2,
    })
  }
  if (meta.legend) {
    ops.push({
      kind: 'text', x: L.width - PAD, y: PAD + 51, align: 'right', text: meta.legend,
      font: `600 12px ${FONT}`, fill: INK, maxWidth: L.width * 0.42,
    })
  }

  for (const { tile, col, row } of L.cells) {
    const x = PAD + col * (tileW + GAP)
    const y = PAD + HEADER + row * (CAPTION + tileH + GAP)
    ops.push({ kind: 'rect', x, y, width: tileW, height: CAPTION, fill: '#181d26' })
    const s = tile.state
    ops.push({
      kind: 'text', x: x + 10, y: y + CAPTION / 2,
      text: `${s.viewLabel}`, font: `700 17px ${FONT}`, fill: GLOW, letterSpacing: '1.5px',
    })
    ops.push({
      kind: 'text', x: x + tileW - 10, y: y + CAPTION / 2, align: 'right',
      text: `${s.clip.toUpperCase()}  t ${s.time.toFixed(2)} s  (${Math.round(s.fraction * 100)}%)`,
      font: `600 15px ${FONT}`, fill: INK,
    })
    // A hairline round the tile so a dark render does not bleed into the sheet
    // background and read as a crop.
    ops.push({ kind: 'rect', x, y: y + CAPTION, width: tileW, height: 1, fill: '#2c3440' })

    if (mode === 'sockets') {
      const sum = socketSummary(s)
      if (sum) {
        ops.push({
          kind: 'rect', x, y: y + CAPTION + tileH - 24, width: tileW, height: 24,
          fill: 'rgba(8, 11, 16, 0.78)',
        })
        ops.push({
          kind: 'text', x: x + tileW / 2, y: y + CAPTION + tileH - 12, align: 'center',
          text: sum.text, font: `700 13px ${FONT}`, fill: sum.bad ? BAD : OK,
          maxWidth: tileW - 16,
        })
      }
    }
  }

  await drawOverlay(canvasPage, ops)
  return endSheet(canvasPage)
}

// ---- diff -----------------------------------------------------------------

/**
 * Compare a fresh capture against a baseline capture, tile by tile.
 *
 * A word on what "~0" means here. The cape and strap solver is driven by real
 * wall-clock delta and a time-varying wind, and it does not reach a fixed point
 * even with the clip paused — measured, two captures of the *same* state twelve
 * frames apart differ by mean 0.47/255 over about 1.8% of pixels. That is the
 * floor. The table prints the median so you can see the floor for the run you
 * are looking at, and flags anything above 4x it, because a real regression —
 * a limb in a different place, an overlay gone, a texture changed — moves the
 * mean by whole units, not by tenths.
 */
/**
 * How different two captures of the *same* state are, per view.
 *
 * This has to be measured rather than assumed, because it is not zero and it is
 * not uniform. The cape and strap solver runs on wall-clock delta with a
 * time-varying wind, so it never reaches a fixed point even with the clip
 * paused — and the size of the resulting wobble in pixels depends entirely on
 * how much of the frame the wobbling thing fills. Measured here: the whole-body
 * presets sit around 0.2/255, the HEAD close-up around 3.5, because at 0.62 m
 * a hair strand moving half a millimetre moves a sixth of the frame.
 *
 * Without this, a diff table flags HEAD every single time and people stop
 * reading it. With it, "did this change" is asked against the right yardstick.
 */
async function measureNoiseFloor(canvasPage, repeats, { threshold }) {
  const out = {}
  for (const [view, pair] of repeats) {
    const r = await comparePng(canvasPage, pair.a, pair.b, { threshold })
    out[view] = r.mean
  }
  return out
}

async function diffTiles(canvasPage, tiles, baselineDir, { threshold, top, outDir, noiseFloor }) {
  const rows = []
  const missing = []
  for (const tile of tiles) {
    const file = path.join(baselineDir, 'tiles', tile.name)
    let base
    try {
      base = await fs.readFile(file)
    } catch {
      missing.push(tile.name)
      continue
    }
    const r = await comparePng(canvasPage, base.toString('base64'), tile.base64, { threshold })
    rows.push({ name: tile.name, view: tile.view, ...r })
  }

  let baselineOnly = []
  try {
    const have = new Set(tiles.map((t) => t.name))
    baselineOnly = (await fs.readdir(path.join(baselineDir, 'tiles'))).filter(
      (f) => f.endsWith('.png') && !have.has(f),
    )
  } catch { /* no baseline tiles dir; already reported per-tile */ }

  // Each tile is judged against its own view's measured noise, not against a
  // single number for the sheet. 4x the floor, with an absolute lower bound so
  // a view that happened to calibrate quiet cannot make every later tile a
  // "mover". Views with no measurement fall back to the median.
  const means = rows.filter((r) => !r.sizeMismatch).map((r) => r.mean).sort((a, b) => a - b)
  const median = means.length ? means[Math.floor(means.length / 2)] : 0
  const floorFor = (view) => noiseFloor?.[view] ?? median
  const cutFor = (view) => Math.max(4 * floorFor(view), 0.8)
  for (const r of rows) {
    r.floor = floorFor(r.view)
    r.cut = cutFor(r.view)
    r.ratio = r.sizeMismatch ? Infinity : r.mean / Math.max(r.floor, 1e-6)
    r.moved = r.sizeMismatch || r.mean > r.cut
  }
  // Ranked by how far above its *own* floor a tile is, so the head close-up
  // does not permanently own the top of the table.
  rows.sort((a, b) => b.ratio - a.ratio)

  console.log(`\n  DIFF vs ${path.relative(process.cwd(), baselineDir) || baselineDir}`)
  console.log(`  ${rows.length} tiles compared, ${missing.length} with no baseline, ${baselineOnly.length} in baseline only`)
  console.log(
    noiseFloor && Object.keys(noiseFloor).length
      ? `  measured noise floor per view (two captures of one state): ` +
          Object.entries(noiseFloor).map(([v, m]) => `${v} ${m.toFixed(2)}`).join('  ')
      : `  no calibration in this run; using the median tile delta ${median.toFixed(3)} as the floor`,
  )
  console.log(`  a tile is flagged when it moves more than 4x its view's floor\n`)
  console.log(
    `  ${'TILE'.padEnd(34)}${'MEAN Δ'.padStart(9)}${'FLOOR'.padStart(8)}${'xFLOOR'.padStart(8)}${'MAX Δ'.padStart(7)}${('%PX>' + threshold).padStart(8)}`,
  )
  console.log(`  ${'-'.repeat(74)}`)
  let flagged = 0
  for (const r of rows.slice(0, top)) {
    if (r.sizeMismatch) {
      console.log(`  ${r.name.padEnd(34)}   SIZE MISMATCH ${r.a.join('x')} vs ${r.b.join('x')}`)
      flagged++
      continue
    }
    if (r.moved) flagged++
    console.log(
      `  ${r.name.padEnd(34)}${r.mean.toFixed(3).padStart(9)}${r.floor.toFixed(3).padStart(8)}` +
        `${r.ratio.toFixed(1).padStart(8)}${String(r.max).padStart(7)}${r.pctChanged.toFixed(2).padStart(8)}` +
        (r.moved ? '  <<' : ''),
    )
  }
  if (rows.length > top) console.log(`  … ${rows.length - top} more, all closer to their floor`)
  for (const m of missing) console.log(`  ${m.padEnd(34)}   NO BASELINE`)
  for (const m of baselineOnly) console.log(`  ${m.padEnd(34)}   DROPPED (baseline only)`)

  // Heatmaps for whatever actually moved, so "which pixels" is one file away.
  const movers = rows.filter((r) => !r.sizeMismatch && r.moved).slice(0, 8)
  if (movers.length) {
    const dir = path.join(outDir, 'diff')
    await fs.mkdir(dir, { recursive: true })
    for (const r of movers) {
      const tile = tiles.find((t) => t.name === r.name)
      const base = await fs.readFile(path.join(baselineDir, 'tiles', r.name))
      const hm = await comparePng(canvasPage, base.toString('base64'), tile.base64, { threshold, heatmap: true })
      await fs.writeFile(path.join(dir, r.name), Buffer.from(hm.heatmap, 'base64'))
    }
    console.log(`\n  ${movers.length} heatmap(s) written to ${path.join(outDir, 'diff')}`)
  }
  console.log(
    flagged === 0
      ? `\n  nothing moved further than the solver's own jitter.\n`
      : `\n  ${flagged} tile(s) above their view's noise floor — look at them.\n`,
  )
  return { rows, missing, baselineOnly, median, noiseFloor, flagged }
}

/** Rehydrate a previous run's tiles so --diff-only needs no browser tab of its own. */
async function loadTiles(dir) {
  const manifest = JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'))
  const tiles = []
  for (const t of manifest.tiles) {
    tiles.push({ ...t, base64: (await fs.readFile(path.join(dir, 'tiles', t.name))).toString('base64') })
  }
  return { manifest, tiles }
}

// ---- main -----------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv)
  if (opts.help) {
    console.log(HELP)
    return
  }

  const started = Date.now()
  await fs.mkdir(path.join(opts.out, 'tiles'), { recursive: true })

  let browser
  let server
  let canvasPage
  try {
    browser = await chromium.launch({ executablePath: CHROMIUM })
    canvasPage = await openCanvasPage(browser)

    let tiles
    let captureMs = 0
    let consoleErrors = []
    let shimmed = false
    let scrub = null
    let floorSweep = {}
    let noiseFloor = null

    if (opts.diffOnly || opts.fromTiles) {
      console.log(`  reusing tiles in ${opts.out}`)
      const prior = await loadTiles(opts.out)
      tiles = prior.tiles
      shimmed = prior.manifest.phaseShim
      floorSweep = prior.manifest.floorSweep ?? {}
      scrub = prior.manifest.scrubProbe ?? null
      noiseFloor = prior.manifest.noiseFloor ?? null
      trailLegendCache = prior.manifest.trailLegend ?? undefined
      // Carried forward rather than reset: these describe the capture the tiles
      // came from, and re-laying-out a sheet does not make that capture cleaner.
      captureMs = prior.manifest.captureMs ?? 0
      consoleErrors = prior.manifest.consoleErrors ?? []
    } else {
      if (opts.build) {
        process.stdout.write('  vite build … ')
        await build({ root: PKG_DIR, configFile: path.join(PKG_DIR, 'vite.config.js'), logLevel: 'error' })
        console.log('done')
      }
      server = await preview({
        root: PKG_DIR,
        configFile: path.join(PKG_DIR, 'vite.config.js'),
        preview: { port: opts.port, strictPort: false },
        logLevel: 'error',
      })
      const url = new URL('turntable/index.html', server.resolvedUrls.local[0]).href
      console.log(`  preview ${url}`)

      const page = await openTurntable(browser, url, { width: opts.width, height: opts.height })

      // Before capturing anything, check that the thing the sheet is built on
      // — scrubbing to a phase — actually works. It did not, and a sheet of
      // four identical columns confidently captioned 0% / 25% / 50% / 75% is
      // precisely the failure this tool exists to prevent.
      await setClip(page, 'run')
      await settle(page, 8)
      scrub = await probeScrub(page)
      if (!scrub.works) {
        shimmed = true
        await installPhaseShim(page)
        const after = await probeScrub(page)
        console.log(
          `  ! scrub is dead on this build: action time stayed at ` +
            `[${scrub.times.map((t) => t.toFixed(3))}] across three slider positions.\n` +
            `    mixer.setTime() is multiplied by mixer.timeScale, which frameLoop pins to 0 while paused.\n` +
            `    phase shim installed — after it, [${after.times.map((t) => t.toFixed(3))}]. Sheets are stamped.`,
        )
        if (!after.works) throw new Error('phase shim did not take; every tile would be frame 0')
      }

      const plan = opts.clips.length * opts.modes.length
      console.log(`  capturing ${plan} sheet(s): clips [${opts.clips}] × modes [${opts.modes}]`)
      const r = await capture(page, opts)
      tiles = r.tiles
      floorSweep = r.floorSweep
      captureMs = r.captureMs
      if (r.repeats.size) noiseFloor = await measureNoiseFloor(canvasPage, r.repeats, opts)
      consoleErrors = page.__consoleErrors
      console.log(`  ${tiles.length} tiles in ${(captureMs / 1000).toFixed(1)} s (${Math.round(captureMs / tiles.length)} ms each)`)
    }

    // Tiles first — they are the artefact a diff runs against, and they should
    // survive a failure in the compositing step.
    for (const t of tiles) {
      await fs.writeFile(path.join(opts.out, 'tiles', t.name), Buffer.from(t.base64, 'base64'))
    }

    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + 'Z'
    const sheets = []
    if (!opts.diffOnly) {
      for (const clip of opts.clips) {
        for (const mode of opts.modes) {
          const group = tiles.filter((t) => t.clip === clip && t.mode === mode)
          if (!group.length) continue
          const views = opts.views ?? MODES[mode].views
          const phases = mode === 'trails' ? 1 : opts.phases
          const last = group[group.length - 1].state
          const legend =
            mode === 'trails' ? await readTrailLegend(browser) : null
          const png = await buildSheet(canvasPage, {
            clip, mode, tiles: group, views, phases, opts,
            meta: { stamp, floor: floorSweep[clip] ?? last.floor, legend, shimmed, sweepFrames: SWEEP_FRAMES },
          })
          const file = path.join(opts.out, `${clip}-${mode}.png`)
          await fs.writeFile(file, png)
          sheets.push({ file, clip, mode, tiles: group.length })
          console.log(`  sheet ${path.relative(process.cwd(), file)} (${group.length} tiles)`)
        }
      }
    }

    await fs.writeFile(
      path.join(opts.out, 'manifest.json'),
      JSON.stringify(
        {
          stamp,
          opts: { ...opts, out: undefined },
          captureMs,
          phaseShim: shimmed,
          floorSweep,
          noiseFloor,
          trailLegend: trailLegendCache ?? null,
          scrubProbe: scrub,
          consoleErrors,
          sheets: sheets.map((s) => path.basename(s.file)),
          tiles: tiles.map(({ base64, ...rest }) => rest),
        },
        null,
        2,
      ),
    )

    if (consoleErrors.length) {
      console.log(`\n  ${consoleErrors.length} console error(s) during capture:`)
      for (const e of consoleErrors.slice(0, 5)) console.log(`    ${e}`)
    }

    if (opts.diff) {
      await diffTiles(canvasPage, tiles, opts.diff, {
        threshold: opts.threshold,
        top: opts.top,
        outDir: opts.out,
        noiseFloor,
      })
    }

    console.log(`  ${(Date.now() - started) / 1000}s total → ${opts.out}`)
  } finally {
    await browser?.close()
    await server?.httpServer?.close()
  }
}

/**
 * The trail legend, read out of the page's own readout rather than restated
 * here. A second copy of "orange is the left toe" in this file is a copy that
 * will eventually be wrong.
 */
let trailLegendCache
async function readTrailLegend(browser) {
  if (trailLegendCache !== undefined) return trailLegendCache
  const pages = browser.contexts().flatMap((c) => c.pages())
  const page = pages.find((p) => p.url().includes('turntable'))
  if (!page) return (trailLegendCache = null)
  trailLegendCache = await page.evaluate(() =>
    [...document.querySelectorAll('#dbg-trails .line span')].map((s) => s.textContent).join(' · ') || null,
  )
  return trailLegendCache
}

main().catch((e) => {
  if (e instanceof UsageError) console.error(`\n  ${e.message}\n  run with --help for the full list.\n`)
  else console.error(e)
  process.exit(1)
})
