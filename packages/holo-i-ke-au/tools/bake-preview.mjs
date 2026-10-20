#!/usr/bin/env node
// Render a quick look at every baked pack, for checking the bake by eye:
// hillshaded terrain with a height tint, sea shaded by depth, moku lines in
// black and ahupuaʻa lines in grey over it; and the rain image as a colour
// ramp. Reads only public/data/, writes only into the directory given.
//
//   node packages/holo-i-ke-au/tools/bake-preview.mjs OUTDIR [pack ids...]
//
// Writes OUTDIR/<id>-terrain.png and OUTDIR/<id>-rain.png. Keep OUTDIR
// outside the repo (these are not committed).
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG, writePNG } from './lib/png.mjs'

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')
const [outArg, ...ids] = process.argv.slice(2)
if (!outArg) {
  console.error('usage: bake-preview.mjs OUTDIR [pack ids...]')
  process.exit(2)
}
const OUT = resolve(outArg)
mkdirSync(OUT, { recursive: true })

const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
const moku = JSON.parse(readFileSync(join(DATA, 'boundaries', 'moku.geojson'), 'utf8'))
const ahupuaa = JSON.parse(readFileSync(join(DATA, 'boundaries', 'ahupuaa.geojson'), 'utf8'))

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
const LAND = [
  [0, [70, 120, 60]],
  [0.08, [120, 150, 80]],
  [0.25, [170, 160, 110]],
  [0.5, [150, 120, 95]],
  [0.75, [175, 165, 160]],
  [1, [255, 255, 255]],
]
const SEA = [
  [0, [120, 190, 225]],
  [0.15, [50, 120, 190]],
  [1, [10, 25, 70]],
]
const RAIN = [
  [0, [235, 215, 160]],
  [0.35, [150, 200, 110]],
  [0.65, [40, 140, 90]],
  [1, [20, 50, 160]],
]

function drawLines(rgb, W, H, pack, fc, colour, alpha) {
  const [w, , , n] = pack.bounds
  const dLon = (pack.bounds[2] - w) / W
  const dLat = (n - pack.bounds[1]) / H
  const plot = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return
    const o = (y * W + x) * 3
    for (let c = 0; c < 3; c++) rgb[o + c] = Math.round(rgb[o + c] * (1 - alpha) + colour[c] * alpha)
  }
  for (const f of fc.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const poly of polys) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length - 1; i++) {
          const x0 = (ring[i][0] - w) / dLon
          const y0 = (n - ring[i][1]) / dLat
          const x1 = (ring[i + 1][0] - w) / dLon
          const y1 = (n - ring[i + 1][1]) / dLat
          if ((x0 < -1 && x1 < -1) || (y0 < -1 && y1 < -1) || (x0 > W && x1 > W) || (y0 > H && y1 > H)) continue
          const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))))
          for (let s = 0; s <= steps; s++) plot(Math.floor(lerp(x0, x1, s / steps)), Math.floor(lerp(y0, y1, s / steps)))
        }
      }
    }
  }
}

for (const p of manifest.packs) {
  if (ids.length && !ids.includes(p.id)) continue
  const img = readPNG(join(DATA, p.height.file))
  const [W, H] = p.size
  const m = new Float32Array(W * H)
  for (let o = 0; o < W * H; o++) m[o] = (img.data[o * 3] * 256 + img.data[o * 3 + 1]) * p.height.scale + p.height.offset
  let top = 0
  for (const v of m) if (v > top) top = v
  const [mx, mz] = p.metresPerTexel
  // exaggerate relief more on the coarse packs so it reads at all
  const ex = p.kind === 'archipelago' ? 6 : 2
  const rgb = new Uint8Array(W * H * 3)
  const L = [-0.5, -0.6, 0.62] // light from the north-west, high
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = y * W + x
      const v = m[o]
      const l = m[y * W + Math.max(0, x - 1)]
      const r = m[y * W + Math.min(W - 1, x + 1)]
      const u = m[Math.max(0, y - 1) * W + x]
      const d = m[Math.min(H - 1, y + 1) * W + x]
      // x grows east, y grows south: normal of z = h(x, y)
      const nx = (-(r - l) / (2 * mx)) * ex
      const ny = (-(d - u) / (2 * mz)) * ex
      const len = Math.hypot(nx, ny, 1)
      const shade = Math.max(0, (nx * L[0] + ny * L[1] + L[2]) / len / Math.hypot(...L))
      let c
      if (v > 0) {
        c = ramp(LAND, Math.sqrt(v / Math.max(1, top)))
        const s = 0.35 + 0.85 * shade
        c = c.map((k) => k * s)
      } else {
        c = ramp(SEA, Math.sqrt(-v / 5500))
        const s = 0.85 + 0.25 * shade
        c = c.map((k) => k * s)
      }
      rgb.set(c.map((k) => Math.max(0, Math.min(255, Math.round(k)))), o * 3)
    }
  }
  if (p.kind !== 'archipelago') drawLines(rgb, W, H, p, ahupuaa, [235, 235, 235], 0.55)
  drawLines(rgb, W, H, p, moku, [0, 0, 0], 0.95)
  writePNG(join(OUT, `${p.id}-terrain.png`), W, H, rgb)

  if (p.rain) {
    const rain = readPNG(join(DATA, p.rain.file))
    const out = new Uint8Array(W * H * 3)
    for (let o = 0; o < W * H; o++) {
      const c = m[o] > 0 ? ramp(RAIN, rain.data[o] / 255) : [40, 40, 50]
      out.set(c.map(Math.round), o * 3)
    }
    drawLines(out, W, H, p, moku, [0, 0, 0], 0.8)
    writePNG(join(OUT, `${p.id}-rain.png`), W, H, out)
  }
  console.log(`${p.id}: ${join(OUT, `${p.id}-terrain.png`)}${p.rain ? ` and ${p.id}-rain.png` : ''}`)
}
