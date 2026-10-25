// Dev-only: profile a generated island's climate and land, the numbers that
// decide where things grow and stand (FOREST.md's zones were set from them).
//
// For each seed this generates the island in node and reports:
// - rain by elevation band, with the drier and wetter ends of each band (the
//   leeward and windward sides) and its share of dry, mesic and wet ground in
//   Cuddihy & Stone's classes (under 1,250 mm, to 2,500 mm, over);
// - the share of land in each moisture and elevation class FOREST.md uses;
// - the map's zones (maps.js), the kula field mask and how much of the land
//   is streamside;
// - where the villages, houses and loʻi stand, and the rain up the model
//   ahupuaʻa's trunk stream;
// - the spread of landform (topographic position over ~250 m: ridges positive,
//   hollows negative) and the flat summit ground where bogs could form.
// Rain is also given in the land texture's own units (app.js makeLandTexture:
// 0 at 300 mm, 1 at 12,000 mm, logarithmic), which is what the shaders and the
// vegetation rules compare against.
//
//   node tools/island-stats.mjs [--root <package dir>] [seed…]

import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
let root = join(dirname(fileURLToPath(import.meta.url)), '..')
const seeds = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') root = resolve(args[++i])
  else seeds.push(Number(args[i]))
}
if (!seeds.length) seeds.push(20261004)

const { WORLD, HALF, HYDRO_RES } = await import(join(root, 'src/config.js'))
const { generateIsland } = await import(join(root, 'src/gen/island-data.js'))

const N = HYDRO_RES
const CELL_M = (WORLD / N) * 100
const LR0 = Math.log(300)
const LR1 = Math.log(12000)
const rainUnits = (mm) => Math.max(0, Math.min(1, (Math.log(mm) - LR0) / (LR1 - LR0)))
const DRY = 1250 // mm: Cuddihy & Stone's dry/mesic and mesic/wet limits
const WET = 2500
const BANDS = [0, 50, 150, 300, 450, 600, 760, 900, 1050, 1200, 1350, 1500, 1700, 2000]
const ZONES = ['wao akua', 'wao nahele', 'wao kanaka', 'kula', 'kahakai']

const q = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : NaN)
const sorted = (a) => Float64Array.from(a).sort()
const pct = (n, of) => ((100 * n) / Math.max(1, of)).toFixed(1).padStart(5) + '%'
const mm = (v) => (Number.isFinite(v) ? Math.round(v).toString() : '–').padStart(6)

function profile(seed) {
  const t0 = performance.now()
  const island = generateIsland(seed)
  const ms = performance.now() - t0
  const { data, meta } = island
  const h = data.height1024
  const cellAt = (x, z) => {
    const i = Math.max(0, Math.min(N - 1, Math.floor(((x + HALF) / WORLD) * N)))
    const j = Math.max(0, Math.min(N - 1, Math.floor(((z + HALF) / WORLD) * N)))
    return j * N + i
  }
  let summit = -Infinity
  for (let c = 0; c < data.height.length; c++) summit = Math.max(summit, data.height[c])
  let land = 0
  for (let c = 0; c < N * N; c++) if (h[c] > 0) land++
  console.log(`\n=== seed ${seed}: generated in ${(ms / 1000).toFixed(1)} s; summit ${Math.round(summit)} m; land ${land} cells (${((land * CELL_M * CELL_M) / 1e6).toFixed(0)} km²)`)

  console.log('\nRain by elevation band (mm; units in brackets). Drier end p10, median, wetter end p90; share dry / mesic / wet')
  console.log('  band m       cells      p10  median     p90    (units)        dry  mesic    wet')
  for (let b = 0; b < BANDS.length - 1; b++) {
    const r = []
    for (let c = 0; c < N * N; c++) if (h[c] > BANDS[b] && h[c] <= BANDS[b + 1]) r.push(data.rain[c])
    if (!r.length) continue
    const s = sorted(r)
    const dry = r.filter((v) => v < DRY).length
    const wet = r.filter((v) => v > WET).length
    const units = [0.1, 0.5, 0.9].map((p) => rainUnits(q(s, p)).toFixed(2)).join(' ')
    console.log(`  ${(BANDS[b] + '–' + BANDS[b + 1]).padEnd(11)} ${String(r.length).padStart(7)}  ${mm(q(s, 0.1))}  ${mm(q(s, 0.5))}  ${mm(q(s, 0.9))}  (${units})  ${pct(dry, r.length)} ${pct(r.length - dry - wet, r.length)} ${pct(wet, r.length)}`)
  }
  const all = []
  for (let c = 0; c < N * N; c++) if (h[c] > 0) all.push(data.rain[c])
  const sa = sorted(all)
  console.log(`  all land: rain p1 ${Math.round(q(sa, 0.01))}, p50 ${Math.round(q(sa, 0.5))}, p99 ${Math.round(q(sa, 0.99))}, max ${Math.round(sa[sa.length - 1])} mm`)

  // FOREST.md's classes: moisture first, then elevation within it
  const cls = new Map()
  for (let c = 0; c < N * N; c++) {
    const m = h[c]
    if (m <= 3) continue
    const r = data.rain[c]
    const k = r < DRY ? (m < 600 ? 'dry, below 600 m' : 'dry, 600 m and up') : r < WET ? (m < 460 ? 'mesic, below 460 m' : m < 1000 ? 'mesic, 460–1,000 m' : 'mesic, 1,000 m and up') : m < 460 ? 'wet, below 460 m (farmed c. 1700)' : m < 760 ? 'wet, 460–760 m (transition)' : m < 1250 ? 'wet, 760–1,250 m (montane)' : 'wet, 1,250 m and up (cloud forest)'
    cls.set(k, (cls.get(k) || 0) + 1)
  }
  const tot = [...cls.values()].reduce((a, b) => a + b, 0)
  console.log('\nLand by moisture and elevation (FOREST.md classes)')
  for (const [k, v] of [...cls.entries()].sort()) console.log(`  ${k.padEnd(38)} ${pct(v, tot)}`)

  const zc = new Array(ZONES.length).fill(0)
  let field = 0
  const fieldH = []
  let stream = 0
  for (let c = 0; c < N * N; c++) {
    if (h[c] <= 0) continue
    const z = data.region[c * 4 + 2]
    if (z < ZONES.length) zc[z]++
    if (data.region[c * 4 + 3] > 76) {
      field++
      fieldH.push(h[c])
    }
    // streamside as the land texture reckons it (before its blur): drainage area
    const rip = Math.max(0, Math.min(1, Math.log10(Math.max(1e-6, data.area[c]) / 0.04) / 1.6))
    if (rip > 0.5) stream++
  }
  console.log('\nZones (maps.js) ' + ZONES.map((n, i) => `${n} ${pct(zc[i], land).trim()}`).join(', '))
  const fh = sorted(fieldH)
  console.log(`Kula field mask: ${pct(field, land).trim()} of land, at ${Math.round(q(fh, 0.1))}–${Math.round(q(fh, 0.9))} m (p10–p90)`)
  console.log(`Streamside (riparian over 0.5): ${pct(stream, land).trim()} of land`)

  const S = meta.sites
  const where = (pts) => {
    const hs = sorted(pts.map(([x, z]) => h[cellAt(x, z)]))
    const rs = sorted(pts.map(([x, z]) => data.rain[cellAt(x, z)]))
    return `${String(pts.length).padStart(4)}  at ${Math.round(q(hs, 0.5))} m (p90 ${Math.round(q(hs, 0.9))}), rain ${Math.round(q(rs, 0.5))} mm (p10 ${Math.round(q(rs, 0.1))})`
  }
  console.log('\nSites (median elevation and rain)')
  console.log('  villages   ' + where(S.villages.map((v) => [v.x, v.z])))
  console.log('  houses     ' + where(S.houses.map((v) => [v.x, v.z])))
  console.log('  loʻi       ' + where(S.loi.flatMap((l) => l.paddies.map((p) => p.c))))
  const model = meta.sites.ahupuaa?.find((a) => a.id === S.model) || meta.ahupuaa?.find((a) => a.id === S.model)
  const trunk = model?.trunk
  if (trunk?.length) {
    console.log(`\nUp the model ahupuaʻa's trunk stream (ahupuaʻa ${S.model})`)
    for (const target of [20, 60, 150, 260, 400]) {
      let best = trunk[0]
      for (const p of trunk) if (Math.abs(p[2] - target) < Math.abs(best[2] - target)) best = p
      if (Math.abs(best[2] - target) > 60) continue
      const r = data.rain[cellAt(best[0], best[1])]
      console.log(`  ~${String(target).padStart(3)} m: ${mm(r)} mm (${rainUnits(r).toFixed(2)})`)
    }
  }

  // topographic position over ~250 m, and the flat summit ground
  const R = Math.round(250 / CELL_M)
  const tpi = []
  let high = 0
  let flat = 0
  for (let j = R; j < N - R; j += 3) {
    for (let i = R; i < N - R; i += 3) {
      const c = j * N + i
      if (h[c] <= 3) continue
      let s = 0
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2
        s += h[Math.round(j + Math.sin(a) * R) * N + Math.round(i + Math.cos(a) * R)]
      }
      tpi.push(h[c] - s / 8)
      if (h[c] > 1300) {
        high++
        const slope = Math.hypot(h[c + 1] - h[c - 1], h[c + N] - h[c - N]) / (2 * CELL_M)
        if (slope < 0.12) flat++
      }
    }
  }
  const st = sorted(tpi)
  console.log(`\nLandform over ~250 m (m above the ring around): p05 ${Math.round(q(st, 0.05))}, p25 ${Math.round(q(st, 0.25))}, p50 ${Math.round(q(st, 0.5))}, p75 ${Math.round(q(st, 0.75))}, p95 ${Math.round(q(st, 0.95))}`)
  console.log(`Above 1,300 m: ${high ? pct(flat, high).trim() : '–'} gentle enough (slope under 0.12) for bogs`)
}

for (const seed of seeds) profile(seed)
