// --check, --preview and --sheets for the patches (DATA.md, "Patches, on any
// pack").
//
// The check reads public/data/patches/ back: the manifest's shape and
// provenance; each mask's format and size against its pack (or its stated
// size); raise weights only over today's sea and only where they raise
// (today deeper than `depth`), lower weights only over today's land and only
// where they lower; no raise texel touching a passage in passages.geojson;
// the weights of one kind on one pack never adding up to more than one; and
// the size of the directory. It also reports, per pack, how much of the reef
// round each harbour mouth the 1795 view has back.
//
// The preview draws, per harbour and pack, today, 1795 and two later years
// side by side (raises before lowers, as the app applies them), with the
// passages outlined. The sheets draw the traced shapes over the 1881 and
// 1938 maps they were traced on, with today's coast from the CUDEM. The check
// and the preview read only public/data/; the sheets read the downloads too.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gridFromBounds } from './geo.mjs'
import { readPack } from './layers-raster.mjs'
import { readPNG, writePNG } from './png.mjs'
import { resampleGrid } from './raster.mjs'
import { patchPacks } from './patch-bake.mjs'
import { cudemMosaic, polygonCover } from './patch-raster.mjs'
import { SHEETS, cudemTiles, patchPaths } from './patch-sources.mjs'
import { allShapes } from './patch-works.mjs'

const MAX_BYTES = 1024 * 1024
const KINDS = ['raise', 'lower']

function* walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) yield* walk(f)
    else yield f
  }
}

/** A mask read back onto its pack's grid (nearest texel if it was made at another size), as weights 0..1. */
function maskOnPack(data, entry, P) {
  const img = readPNG(join(data, entry.file))
  const [mw, mh] = entry.size || [P.W, P.H]
  const w = new Float32Array(P.W * P.H)
  if (img.channels !== 1 || img.width !== mw || img.height !== mh) return { img, w: null }
  for (let j = 0; j < P.H; j++) {
    const mj = Math.min(mh - 1, Math.floor(((j + 0.5) * mh) / P.H))
    for (let i = 0; i < P.W; i++) w[j * P.W + i] = img.data[mj * mw + Math.min(mw - 1, Math.floor(((i + 0.5) * mw) / P.W))] / 255
  }
  return { img, w }
}

/** Heights of a pack in a year: every patch whose until is after it, raises before lowers. */
export function patchedHeights(P, patches, masks, year) {
  const h = Float32Array.from(P.metres)
  for (const kind of KINDS) {
    for (const e of patches) {
      if (e.kind !== kind || !(year < e.until)) continue
      const w = masks.get(e.id)
      for (let o = 0; o < h.length; o++) if (w[o]) h[o] += (e.depth - h[o]) * w[o]
    }
  }
  return h
}

export function checkPatches({ data, log }) {
  let failures = 0
  const fail = (m) => {
    failures++
    log(`  FAIL ${m}`)
  }
  const ok = (cond, m) => {
    if (!cond) fail(m)
    return cond
  }
  const dir = join(data, 'patches')
  const mPath = join(dir, 'manifest.json')
  if (!existsSync(mPath)) {
    log(`no ${mPath}`)
    return false
  }
  const manifest = JSON.parse(readFileSync(mPath, 'utf8'))
  const passages = JSON.parse(readFileSync(join(data, manifest.passages.file), 'utf8'))
  ok(passages.features?.length > 0, 'passages.geojson has no passages')
  for (const f of passages.features) ok(f.geometry?.type === 'Polygon' && f.properties.id && f.properties.source && f.properties.note, `passage ${f.properties?.id}: lacks geometry, id, source or note`)
  const packs = new Map(patchPacks(data).map((p) => [p.id, p]))
  ok(Array.isArray(manifest.patches) && manifest.patches.length > 0, 'manifest has no patches')
  const ids = new Set()
  for (const e of manifest.patches) {
    ok(!ids.has(e.id), `${e.id}: id used twice`)
    ids.add(e.id)
    ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id), `${e.id}: id is not kebab-case ASCII`)
    ok(packs.has(e.pack), `${e.id}: no pack ${e.pack}`)
    ok(KINDS.includes(e.kind), `${e.id}: kind ${e.kind}`)
    ok(Number.isFinite(e.depth), `${e.id}: depth ${e.depth}`)
    ok(Number.isInteger(e.until) && e.until > 1778 && e.until <= 2026, `${e.id}: until ${e.until}`)
    ok(typeof e.file === 'string' && existsSync(join(data, e.file)), `${e.id}: no file ${e.file}`)
    ok(typeof e.note === 'string' && e.note.length > 40, `${e.id}: no note`)
    ok(Array.isArray(e.sources) && e.sources.length > 0, `${e.id}: no sources`)
    for (const s of e.sources || []) ok(s.id && s.title && s.url && s.fetched && s.licence, `${e.id}: source ${s.id || '?'} lacks id, title, url, fetched or licence`)
    ok(e.sources?.some((s) => !/^(noaa-ncei-cudem|hawaii-gis-geologic)/.test(s.id)), `${e.id}: no source for the date or the old shore`)
  }

  const passageGeoms = passages.features.map((f) => f.geometry)
  for (const [packId, pk] of packs) {
    const mine = manifest.patches.filter((e) => e.pack === packId)
    if (!mine.length) continue
    const P = readPack(pk.dataDir, pk.entry)
    log(`${packId}: ${P.W}x${P.H}, ${mine.length} patches`)
    const passage = polygonCover(passageGeoms, P.grid, 4)
    const sums = { raise: new Float32Array(P.W * P.H), lower: new Float32Array(P.W * P.H) }
    const masks = new Map()
    for (const e of mine) {
      if (!ok(!e.size || (Array.isArray(e.size) && e.size.length === 2), `${e.id}: size ${e.size}`)) continue
      const { img, w } = maskOnPack(data, e, P)
      const [mw, mh] = e.size || [P.W, P.H]
      if (!ok(w, `${e.file}: ${img.width}x${img.height}x${img.channels}, expected a ${mw}x${mh} greyscale mask`)) continue
      ok(Math.abs(mw / P.W - mh / P.H) < 0.01, `${e.id}: size ${mw}x${mh} is not the pack's ${P.W}x${P.H} scaled`)
      masks.set(e.id, w)
      let on = 0
      let wrongSide = 0
      let wrongWay = 0
      let inPassage = 0
      let km2 = 0
      for (let o = 0; o < w.length; o++) {
        if (!w[o]) continue
        on++
        km2 += w[o]
        sums[e.kind][o] += w[o]
        const h = P.metres[o]
        if (e.kind === 'raise') {
          if (h > 0) wrongSide++
          if (!(h < e.depth)) wrongWay++
          if (passage[o] > 0) inPassage++
        } else {
          if (h <= 0) wrongSide++
          if (!(h > e.depth)) wrongWay++
        }
      }
      km2 *= P.texelKm2
      ok(on > 0, `${e.file}: empty`)
      ok(!wrongSide, `${e.id}: ${wrongSide} texels over today's ${e.kind === 'raise' ? 'land' : 'sea'}`)
      ok(!wrongWay, `${e.id}: ${wrongWay} texels it would ${e.kind === 'raise' ? 'deepen' : 'raise'} (today already ${e.kind === 'raise' ? 'at or above' : 'at or below'} ${e.depth} m)`)
      ok(!inPassage, `${e.id}: ${inPassage} texels over a passage`)
      log(`  ${e.kind.padEnd(5)} ${e.id.padEnd(34)} until ${e.until}  to ${String(e.depth).padStart(6)} m  ${String(on).padStart(6)} texels  ${km2.toFixed(3).padStart(6)} km² (weighted)`)
    }
    for (const k of KINDS) {
      let over = 0
      for (const v of sums[k]) if (v > 1 + 1 / 255) over++
      ok(!over, `${packId}: ${over} texels where the ${k} weights add up to more than one`)
    }
    // what 1795 makes of each raise patch's ground: the median depth today
    // and then over its texels, and how much of it is still deeper than 6 m
    const y1795 = patchedHeights(P, mine, masks, 1795)
    const med = (a) => (a.length ? Float32Array.from(a).sort()[a.length >> 1] : NaN)
    for (const e of mine.filter((x) => x.kind === 'raise' && x.until > 1795)) {
      const w = masks.get(e.id)
      const a = []
      const b = []
      for (let o = 0; o < w.length; o++) if (w[o] >= 0.5) a.push(P.metres[o]), b.push(y1795[o])
      if (!a.length) continue
      const deep = b.filter((v) => v < -6).length
      log(`  1795 over ${e.id}: median ${med(a).toFixed(1)} m today, ${med(b).toFixed(1)} m then; deeper than 6 m: ${a.filter((v) => v < -6).length} texels today, ${deep} then`)
    }
  }

  let bytes = 0
  for (const f of walk(dir)) {
    const b = statSync(f).size
    bytes += b
  }
  ok(bytes <= MAX_BYTES, `patches/ is ${(bytes / 1048576).toFixed(2)} MB, over ${MAX_BYTES / 1048576} MB`)
  log(`patches/: ${(bytes / 1024).toFixed(0)} KB in ${[...walk(dir)].length} files`)
  log(failures ? `${failures} failure(s)` : 'all patch checks passed')
  return failures === 0
}

// ---------------------------------------------------------------------------
// Preview

const VIEWS = [
  { id: 'pearl-entrance', bbox: [-157.985, 21.292, -157.935, 21.345] },
  { id: 'pearl-lochs', bbox: [-157.99, 21.34, -157.925, 21.385] },
  { id: 'honolulu-keehi', bbox: [-157.93, 21.283, -157.855, 21.335] },
  { id: 'honolulu-harbour', bbox: [-157.895, 21.285, -157.855, 21.325], packs: ['nuuanu'] },
  { id: 'kewalo-waikiki', bbox: [-157.87, 21.262, -157.81, 21.302] },
  { id: 'south-shore', bbox: [-158.0, 21.27, -157.8, 21.38], packs: ['oahu'], px: 900 },
]
const YEARS = [null, 1795, 1930, 1950]
const lerp = (a, b, t) => a + (b - a) * t
function ramp(stops, t) {
  t = Math.max(0, Math.min(1, t))
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1]
      const [t1, c1] = stops[i]
      const u = (t - t0) / (t1 - t0 || 1)
      return [lerp(c0[0], c1[0], u), lerp(c0[1], c1[1], u), lerp(c0[2], c1[2], u)]
    }
  }
  return stops[stops.length - 1][1]
}
// sea by depth, pale over the reef flat, dark past the channels' depth
const SEA = [
  [0, [205, 240, 232]],
  [0.04, [170, 228, 222]],
  [0.1, [110, 196, 208]],
  [0.25, [55, 140, 195]],
  [0.45, [30, 80, 160]],
  [1, [10, 25, 70]],
]
const LAND = [
  [0, [170, 160, 110]],
  [0.03, [140, 150, 95]],
  [0.3, [120, 130, 85]],
  [1, [200, 190, 175]],
]

function renderPanel(h, P, [x0, y0, cw, ch], k, label) {
  // k > 0: upscale by k (nearest); k < 0: average down by -k
  const step = k < 0 ? -k : 1
  const up = k > 0 ? k : 1
  const W = Math.floor(cw / step) * up
  const H = Math.floor(ch / step) * up
  const rgb = new Uint8Array(W * H * 3)
  const mx = P.texelMetres * step
  const at = (x, y) => {
    let s = 0
    let n = 0
    for (let b = 0; b < step; b++) for (let a = 0; a < step; a++) {
      const o = (y0 + y * step + b) * P.W + x0 + x * step + a
      s += h[o]
      n++
    }
    return s / n
  }
  const cw2 = Math.floor(cw / step)
  const ch2 = Math.floor(ch / step)
  const v = new Float32Array(cw2 * ch2)
  for (let y = 0; y < ch2; y++) for (let x = 0; x < cw2; x++) v[y * cw2 + x] = at(x, y)
  for (let y = 0; y < ch2; y++) {
    for (let x = 0; x < cw2; x++) {
      const o = y * cw2 + x
      const l = v[y * cw2 + Math.max(0, x - 1)]
      const r = v[y * cw2 + Math.min(cw2 - 1, x + 1)]
      const u = v[Math.max(0, y - 1) * cw2 + x]
      const d = v[Math.min(ch2 - 1, y + 1) * cw2 + x]
      const nx = (-(r - l) / (2 * mx)) * 3
      const ny = (-(d - u) / (2 * mx)) * 3
      const shade = Math.max(0, (nx * -0.5 + ny * -0.6 + 0.62) / Math.hypot(nx, ny, 1) / 0.9605)
      const c = v[o] > 0 ? ramp(LAND, v[o] / 400).map((q) => q * (0.45 + 0.7 * shade)) : ramp(SEA, -v[o] / 40).map((q) => q * (0.92 + 0.12 * shade))
      for (let b = 0; b < up; b++) for (let a = 0; a < up; a++) rgb.set(c.map((q) => Math.max(0, Math.min(255, Math.round(q)))), ((y * up + b) * W + x * up + a) * 3)
    }
  }
  drawLabel(rgb, W, label)
  return { rgb, W, H }
}

// a tiny 3x5 font for the panel labels (digits, a few letters)
const FONT = {
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111',
  6: '111100111101111', 7: '111001001001001', 8: '111101111101111', 9: '111101111001111', ' ': '000000000000000',
  t: '010111010010011', o: '000111101101111', d: '001001111101111', a: '000111011101111', y: '101101111001111',
}
function drawLabel(rgb, W, text) {
  const s = 3
  for (let y = 0; y < 7 * s; y++) for (let x = 0; x < (text.length * 4 + 1) * s; x++) rgb.set([255, 255, 255], (y * W + x) * 3)
  ;[...text].forEach((ch, k) => {
    const g = FONT[ch] || FONT[' ']
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
      if (g[r * 3 + c] !== '1') continue
      for (let b = 0; b < s; b++) for (let a = 0; a < s; a++) rgb.set([0, 0, 0], ((s + r * s + b) * W + (s + (k * 4 + c) * s + a)) * 3)
    }
  })
}

function outline(rgb, W, H, cover, colour) {
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const o = y * W + x
    const a = cover[o] >= 0.5
    if (a !== cover[o + 1] >= 0.5 || a !== cover[o + W] >= 0.5) rgb.set(colour, o * 3)
  }
}

export function previewPatches({ data, out, log }) {
  mkdirSync(out, { recursive: true })
  const manifest = JSON.parse(readFileSync(join(data, 'patches', 'manifest.json'), 'utf8'))
  const passages = JSON.parse(readFileSync(join(data, manifest.passages.file), 'utf8'))
  for (const pk of patchPacks(data)) {
    const mine = manifest.patches.filter((e) => e.pack === pk.id)
    if (!mine.length) continue
    // a district's own patches too, as the app applies them (kind lower and
    // depth -1 unless they say otherwise)
    if (pk.kind === 'district') {
      for (const q of pk.entry.patches || []) {
        mine.push({ id: `${pk.id}-own-${q.keyframe || q.id}`, kind: q.kind || 'lower', depth: q.depth ?? -1, until: q.until, file: `districts/${q.file}` })
      }
    }
    const P = readPack(pk.dataDir, pk.entry)
    const masks = new Map(mine.map((e) => [e.id, maskOnPack(data, e, P).w]))
    const years = YEARS.map((y) => (y === null ? P.metres : patchedHeights(P, mine, masks, y)))
    for (const v of VIEWS) {
      if (v.packs && !v.packs.includes(pk.id)) continue
      const g = P.grid
      const x0 = Math.max(0, Math.floor((v.bbox[0] - g.bounds[0]) / g.dLon))
      const x1 = Math.min(P.W, Math.ceil((v.bbox[2] - g.bounds[0]) / g.dLon))
      const y0 = Math.max(0, Math.floor((g.bounds[3] - v.bbox[3]) / g.dLat))
      const y1 = Math.min(P.H, Math.ceil((g.bounds[3] - v.bbox[1]) / g.dLat))
      const cw = x1 - x0
      const ch = y1 - y0
      if (cw < 20 || ch < 20) continue
      // about 600 px a panel
      const want = v.px || 600
      const k = cw * 2 < want ? Math.max(1, Math.round(want / cw)) : -Math.max(1, Math.round(cw / want))
      const sub = gridFromBounds([g.bounds[0] + x0 * g.dLon, g.bounds[3] - y1 * g.dLat, g.bounds[0] + x1 * g.dLon, g.bounds[3] - y0 * g.dLat], cw, ch)
      const panels = years.map((h, n) => renderPanel(h, P, [x0, y0, cw, ch], k, YEARS[n] === null ? 'today' : String(YEARS[n])))
      const { W, H } = panels[0]
      // passages on every panel
      const pg = gridFromBounds(sub.bounds, W, H)
      const pc = polygonCover(passages.features.map((f) => f.geometry), pg, 2)
      for (const p of panels) outline(p.rgb, W, H, pc, [250, 200, 0])
      const gap = 8
      const TW = W * panels.length + gap * (panels.length - 1)
      const rgb = new Uint8Array(TW * H * 3).fill(255)
      panels.forEach((p, n) => {
        for (let y = 0; y < H; y++) rgb.set(p.rgb.subarray(y * W * 3, (y + 1) * W * 3), (y * TW + n * (W + gap)) * 3)
      })
      const file = join(out, `${pk.id}-${v.id}.png`)
      writePNG(file, TW, H, rgb)
      log(`${file}: today, ${YEARS.slice(1).join(', ')} (passages in yellow${pk.kind === 'district' ? '; with the district’s own patches' : ''})`)
    }
  }
}

// ---------------------------------------------------------------------------
// Sheets

const SHAPE_COLOURS = { passage: [255, 200, 0], bar: [255, 120, 0], 'raise-zone': [220, 0, 220], 'lower-region': [0, 160, 0], 'old-shore': [200, 0, 0] }

export async function sheetsPatches({ data, dir, out, log }) {
  mkdirSync(out, { recursive: true })
  const p = patchPaths(dir)
  const shapes = allShapes()
  for (const sh of SHEETS) {
    const tiles = cudemTiles(p.cudemList, sh.bbox).map((t) => p.cudemTile(t.name)).filter((f) => existsSync(f))
    for (const year of sh.years) {
      const info = JSON.parse(readFileSync(p.sheetInfo(sh.id, year), 'utf8'))
      const img = readPNG(p.sheet(sh.id, year))
      if (img.channels !== 3) throw new Error(`${p.sheet(sh.id, year)}: not RGB`)
      const { W, H, extent } = info
      const rgb = img.data
      const grid = gridFromBounds(extent, W, H)
      // today's coast (red) and the 6 m depth (blue), from the CUDEM
      const m = tiles.length ? await cudemMosaic(tiles, extent) : null
      if (m) {
        const v = resampleGrid(m, grid)
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          const o = y * W + x
          for (const [L, c] of [[0, [255, 60, 60]], [-6, [60, 120, 255]]]) {
            const a = v[o] > L
            if (a !== v[o + 1] > L || a !== v[o + W] > L) rgb.set(c, o * 3)
          }
        }
      }
      for (const f of shapes) {
        const c = polygonCover([f.geometry], grid, 1)
        const col = SHAPE_COLOURS[f.properties.kind]
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          const o = y * W + x
          const a = c[o] >= 0.5
          if (a !== c[o + 1] >= 0.5 || a !== c[o + W] >= 0.5) for (const q of [o, o + 1, o + W]) rgb.set(col, q * 3)
        }
      }
      // a 0.001° grid
      for (let k = Math.ceil(extent[0] * 1000); k <= Math.floor(extent[2] * 1000); k++) {
        const x = Math.round((k / 1000 - extent[0]) / ((extent[2] - extent[0]) / W))
        if (x >= 0 && x < W) for (let y = 0; y < H; y += 3) rgb.set([60, 60, 60], (y * W + x) * 3)
      }
      for (let k = Math.ceil(extent[1] * 1000); k <= Math.floor(extent[3] * 1000); k++) {
        const y = Math.round((extent[3] - k / 1000) / ((extent[3] - extent[1]) / H))
        if (y >= 0 && y < H) for (let x = 0; x < W; x += 3) rgb.set([60, 60, 60], (y * W + x) * 3)
      }
      const file = join(out, `${sh.id}-${year}.png`)
      writePNG(file, W, H, rgb)
      log(`${file}: ${year} map, today's coast (red) and 6 m line (blue) from the CUDEM; passages yellow, bars orange, raise zones magenta, lower regions green, old shores dark red`)
    }
  }
}
