#!/usr/bin/env node
// Read the baked data back and check it against DATA.md §1-3 and against
// the real islands. Exits 1 on any failure. Needs nothing but public/data/.
//
//   node packages/holo-i-ke-au/tools/bake-check.mjs
//
// Checks: manifest shape and provenance; every height image decodes as an
// 8-bit RGB non-interlaced PNG of the stated size with B = 0, sea <= -1 m and
// land > 0; known summits are found at their real coordinates and heights
// (which also proves north is up and east is right); each pack's land mask
// matches the State ahupuaʻa polygons; rain is greyscale, 0 over sea, wet and
// dry where it should be; every boundary feature has the required properties
// and valid geometry. Prints a table of packs and the size of every file.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { KX, KZ, ISLANDS, fold } from './lib/geo.mjs'
import { readPNG } from './lib/png.mjs'
import { ringIntersections, ringSignedArea } from './lib/simplify.mjs'

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')
const MAX_BYTES = 40 * 1024 * 1024

let failures = 0
const fail = (m) => {
  failures++
  console.log(`  FAIL ${m}`)
}
const ok = (cond, m) => {
  if (!cond) fail(m)
  return cond
}

// Summits: [name, lat, lon, metres]. Coordinates and heights from USGS/GNIS-style references.
const PEAKS = [
  ['Mauna Kea', 19.8207, -155.4681, 4207],
  ['Mauna Loa', 19.4756, -155.6054, 4169],
  ['Haleakalā (Puʻu ʻUlaʻula)', 20.7097, -156.2533, 3055],
  ['Puʻu Kukui', 20.8906, -156.5869, 1764],
  ['Kaʻala', 21.5069, -158.1428, 1220],
  ['Waiʻaleʻale', 22.0742, -159.4981, 1569],
  ['Kamakou', 21.1069, -156.8686, 1512],
  ['Lānaʻihale', 20.8125, -156.8683, 1026],
  ['Puʻu Moaulanui', 20.5622, -156.5714, 452],
  ['Paniʻau', 21.9361, -160.0833, 390],
]
// Rain spot checks: [name, lat, lon, radius m, 'max' | 'min', lo mm, hi mm]
const RAIN_SPOTS = [
  ['Waiʻaleʻale summit (wettest)', 22.0742, -159.4981, 2000, 'max', 7000, 13000],
  ['Big Bog, East Maui (wet)', 20.7340, -156.0950, 3000, 'max', 6000, 13000],
  ['Kawaihae coast (driest)', 20.0390, -155.8270, 3000, 'min', 0, 400],
  ['Hilo (wet town)', 19.7200, -155.0850, 1500, 'max', 2500, 5000],
  ['Waikīkī (dry coast)', 21.2790, -157.8300, 1500, 'min', 0, 900],
]
const mmOf = (b) => (b === 0 ? 0 : 300 * Math.pow(40, b / 255))

function* walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) yield* walk(f)
    else yield f
  }
}
const kb = (n) => (n >= 1 << 20 ? `${(n / (1 << 20)).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`)

/** even-odd raster of polygons at texel centres */
function rasterize(features, pack) {
  const [W, H] = pack.size
  const [w, , , n] = pack.bounds
  const dLon = (pack.bounds[2] - w) / W
  const dLat = (n - pack.bounds[1]) / H
  const inside = new Uint8Array(W * H)
  const edges = []
  for (const f of features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const poly of polys) for (const ring of poly) {
      for (let i = 0; i < ring.length - 1; i++) {
        const x0 = (ring[i][0] - w) / dLon - 0.5
        const y0 = (n - ring[i][1]) / dLat - 0.5
        const x1 = (ring[i + 1][0] - w) / dLon - 0.5
        const y1 = (n - ring[i + 1][1]) / dLat - 0.5
        if (y0 !== y1) edges.push([x0, y0, x1, y1])
      }
    }
  }
  const rows = Array.from({ length: H }, () => [])
  for (const [x0, y0, x1, y1] of edges) {
    const ya = Math.max(0, Math.ceil(Math.min(y0, y1)))
    const yb = Math.min(H - 1, Math.ceil(Math.max(y0, y1)) - 1)
    for (let y = ya; y <= yb; y++) {
      const t = (y - y0) / (y1 - y0)
      if (t >= 0 && t < 1) rows[y].push(x0 + t * (x1 - x0))
      else if (t === 1) continue
    }
  }
  for (let y = 0; y < H; y++) {
    const xs = rows[y].sort((a, b) => a - b)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k]))
      const b = Math.min(W - 1, Math.floor(xs[k + 1]))
      for (let x = a; x <= b; x++) inside[y * W + x] ^= 1
    }
  }
  return inside
}

function texelsNear(pack, lat, lon, radius) {
  const [W, H] = pack.size
  const [w, s, e, n] = pack.bounds
  if (lon < w || lon > e || lat < s || lat > n) return null
  const dLon = (e - w) / W
  const dLat = (n - s) / H
  const out = []
  const rx = Math.ceil(radius / (dLon * KX)) + 1
  const ry = Math.ceil(radius / (dLat * KZ)) + 1
  const cx = Math.floor((lon - w) / dLon)
  const cy = Math.floor((n - lat) / dLat)
  for (let y = Math.max(0, cy - ry); y <= Math.min(H - 1, cy + ry); y++) {
    for (let x = Math.max(0, cx - rx); x <= Math.min(W - 1, cx + rx); x++) {
      const tl = w + (x + 0.5) * dLon
      const tt = n - (y + 0.5) * dLat
      if (Math.hypot((tl - lon) * KX, (tt - lat) * KZ) <= radius) out.push(y * W + x)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
console.log(`checking ${DATA}`)
const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
const moku = JSON.parse(readFileSync(join(DATA, 'boundaries', 'moku.geojson'), 'utf8'))
const ahupuaa = JSON.parse(readFileSync(join(DATA, 'boundaries', 'ahupuaa.geojson'), 'utf8'))

console.log('manifest:')
ok(manifest.projection?.lat0 === 20.5 && manifest.projection?.lon0 === -157.5, 'projection must be lat0 20.5, lon0 -157.5')
const wantIds = ['archipelago', ...ISLANDS.map((i) => i.id)]
const ids = manifest.packs.map((p) => p.id)
ok(wantIds.every((i) => ids.includes(i)) && ids.length === wantIds.length, `packs must be ${wantIds.join(', ')}; got ${ids.join(', ')}`)

const checkSources = (where, sources) => {
  if (!ok(Array.isArray(sources) && sources.length > 0, `${where}: no sources`)) return
  for (const s of sources) {
    for (const k of ['id', 'title', 'url', 'fetched', 'licence']) ok(typeof s[k] === 'string' && s[k].length > 0, `${where}: source ${s.id} lacks ${k}`)
    ok(/^\d{4}-\d{2}-\d{2}$/.test(s.fetched || ''), `${where}: source ${s.id} fetched is not a date`)
    ok(/^https:\/\//.test(s.url || ''), `${where}: source ${s.id} url is not https`)
  }
}

const table = []
for (const p of manifest.packs) {
  const where = `pack ${p.id}`
  const [W, H] = p.size
  const [w, s, e, n] = p.bounds
  ok(p.kind === (p.id === 'archipelago' ? 'archipelago' : 'island'), `${where}: kind ${p.kind}`)
  ok(typeof p.name === 'string' && p.name.length > 0, `${where}: name`)
  ok(w < e && s < n && w > -161 && e < -154 && s > 18 && n < 23, `${where}: bounds ${p.bounds}`)
  ok(Number.isInteger(W) && Number.isInteger(H), `${where}: size not integers`)
  if (p.kind === 'archipelago') ok(W === 2048, `${where}: width ${W}, want 2048`)
  else ok(Math.max(W, H) <= 1024, `${where}: long side ${Math.max(W, H)} > 1024`)
  const mx = ((e - w) / W) * KX
  const mz = ((n - s) / H) * KZ
  ok(Math.abs(mx - p.metresPerTexel[0]) < 0.01 && Math.abs(mz - p.metresPerTexel[1]) < 0.01, `${where}: metresPerTexel ${p.metresPerTexel} vs bounds ${mx}, ${mz}`)
  ok(Math.abs(mx / mz - 1) < 1e-3, `${where}: texels not square (${mx} x ${mz})`)
  checkSources(where, p.sources)

  // height
  const img = readPNG(join(DATA, p.height.file))
  ok(img.colourType === 2 && img.bitDepth === 8 && img.interlace === 0, `${where}: height must be 8-bit RGB non-interlaced`)
  ok(img.width === W && img.height === H, `${where}: height image ${img.width}x${img.height} != ${W}x${H}`)
  const { scale, offset } = p.height
  ok(scale > 0 && Number.isFinite(offset), `${where}: scale/offset`)
  const N = W * H
  const m = new Float32Array(N)
  let nLand = 0
  let bNonZero = 0
  let shallowSea = 0
  let min = Infinity
  let max = -Infinity
  for (let o = 0; o < N; o++) {
    const R = img.data[o * 3]
    const G = img.data[o * 3 + 1]
    if (img.data[o * 3 + 2] !== 0) bNonZero++
    const v = (R * 256 + G) * scale + offset
    m[o] = v
    if (v > 0) nLand++
    else if (v > -1) shallowSea++
    if (v < min) min = v
    if (v > max) max = v
  }
  ok(bNonZero === 0, `${where}: ${bNonZero} texels with B != 0`)
  ok(shallowSea === 0, `${where}: ${shallowSea} sea texels shallower than -1 m`)
  ok(min >= -6000 && max < 4300, `${where}: heights ${min} .. ${max} out of range`)
  const landFrac = nLand / N
  const range = p.kind === 'archipelago' ? [0.05, 0.12] : [0.15, 0.75]
  ok(landFrac >= range[0] && landFrac <= range[1], `${where}: land fraction ${landFrac.toFixed(3)} outside ${range}`)
  ok(Math.abs((p.stats?.landFraction ?? landFrac) - landFrac) < 1e-3, `${where}: stats.landFraction disagrees with the image`)
  // edges are sea: the 2 km padding must hold, except where another island's coast is in the box
  let edgeLand = 0
  let edgeN = 0
  for (let x = 0; x < W; x++) for (const y of [0, H - 1]) { edgeN++; if (m[y * W + x] > 0) edgeLand++ }
  for (let y = 0; y < H; y++) for (const x of [0, W - 1]) { edgeN++; if (m[y * W + x] > 0) edgeLand++ }
  ok(edgeLand / edgeN < 0.05, `${where}: ${edgeLand} of ${edgeN} edge texels are land`)

  // summits
  const peaks = []
  for (const [name, lat, lon, want] of PEAKS) {
    const near = texelsNear(p, lat, lon, Math.max(500, 1.5 * mx))
    if (!near) continue
    let got = -Infinity
    for (const o of near) got = Math.max(got, m[o])
    const tolLow = p.kind === 'archipelago' ? 0.15 * want : Math.max(30, 0.04 * want)
    const good = got >= want - tolLow && got <= want + 30
    ok(good, `${where}: ${name} reads ${got} m, want about ${want} m`)
    peaks.push(`${name} ${Math.round(got)}`)
  }

  // land mask against the State ahupuaʻa polygons (the coastline test)
  const poly = rasterize(ahupuaa.features, p)
  let both = 0
  let onlyDem = 0
  let onlyPoly = 0
  for (let o = 0; o < N; o++) {
    const a = m[o] > 0
    const b = poly[o] === 1
    if (a && b) both++
    else if (a) onlyDem++
    else if (b) onlyPoly++
  }
  const iou = both / (both + onlyDem + onlyPoly)
  ok(iou > (p.kind === 'archipelago' ? 0.9 : 0.94), `${where}: land vs ahupuaʻa polygons IoU ${iou.toFixed(3)}`)

  // rain
  let rainInfo = 'none'
  let rainBytes = 0
  const rainSpots = []
  if (p.rain) {
    const r = readPNG(join(DATA, p.rain.file))
    rainBytes = statSync(join(DATA, p.rain.file)).size
    ok(r.colourType === 0 && r.bitDepth === 8 && r.interlace === 0, `${where}: rain must be 8-bit grey non-interlaced`)
    ok(r.width === W && r.height === H, `${where}: rain image size`)
    let wetSea = 0
    let landRain = 0
    for (let o = 0; o < N; o++) {
      if (m[o] <= 0 && r.data[o] !== 0) wetSea++
      if (m[o] > 0 && r.data[o] > 0) landRain++
    }
    ok(wetSea === 0, `${where}: ${wetSea} sea texels with rain`)
    for (const [name, lat, lon, rad, kind, lo, hi] of RAIN_SPOTS) {
      const near = texelsNear(p, lat, lon, Math.max(rad, 1.5 * mx))
      if (!near) continue
      const vals = near.filter((o) => m[o] > 0).map((o) => mmOf(r.data[o]))
      if (!vals.length) continue
      const got = kind === 'max' ? Math.max(...vals) : Math.min(...vals)
      ok(got >= lo && got <= hi, `${where}: rain ${name} ${Math.round(got)} mm, want ${lo}..${hi}`)
      rainSpots.push(`${name.split(' (')[0]} ${Math.round(got)}`)
    }
    rainInfo = `${((landRain / nLand) * 100).toFixed(1)}% of land > 300 mm`
  }
  const hBytes = statSync(join(DATA, p.height.file)).size
  table.push({ id: p.id, size: `${W}x${H}`, mpt: mx.toFixed(1), land: `${(landFrac * 100).toFixed(1)}%`, iou: iou.toFixed(3), range: `${min} .. ${max}`, height: kb(hBytes), rain: p.rain ? kb(rainBytes) : '-', peaks: peaks.join(', '), rainInfo, rainSpots: rainSpots.join(', ') })
}

// ---------------------------------------------------------------------------
console.log('boundaries:')
const islandIds = new Set(ISLANDS.map((i) => i.id))
const mokuKeys = new Set()
const inRegion = (c) => Number.isFinite(c[0]) && Number.isFinite(c[1]) && c[0] > -161 && c[0] < -154 && c[1] > 18.5 && c[1] < 22.6
for (const [key, fc] of [['moku', moku], ['ahupuaa', ahupuaa]]) {
  ok(fc.type === 'FeatureCollection' && Array.isArray(fc.features), `${key}: not a FeatureCollection`)
  checkSources(`${key}.geojson`, fc.sources)
  let vertices = 0
  for (const f of fc.features) {
    const p = f.properties || {}
    const where = `${key} gisId ${p.gisId}`
    ok(f.type === 'Feature', `${where}: not a Feature`)
    ok(typeof p.island === 'string' && p.island.length > 0, `${where}: island`)
    ok(islandIds.has(p.islandId), `${where}: islandId ${p.islandId}`)
    ok(Number.isInteger(p.gisId) && p.gisId === p.objectid, `${where}: gisId must be the layer objectid`)
    ok(typeof p.mokuKey === 'string' && p.mokuKey.includes(':'), `${where}: mokuKey`)
    if (key === 'moku') {
      ok(typeof p.name === 'string' && p.name.length > 0, `${where}: name`)
      ok(fold(p.name) === fold(p.moku), `${where}: name "${p.name}" does not match the layer's moku "${p.moku}"`)
      ok(p.mokuKey === `${p.islandId}:${p.name}`, `${where}: mokuKey`)
      ok(!mokuKeys.has(p.mokuKey), `${where}: duplicate mokuKey ${p.mokuKey}`)
      mokuKeys.add(p.mokuKey)
    } else {
      ok(p.name === null ? p.ahupuaa === 'N/A' : p.name === p.ahupuaa, `${where}: name must be the layer's ahupuaa verbatim`)
      ok(typeof p.moku === 'string' && p.moku.length > 0, `${where}: moku`)
      ok(mokuKeys.has(p.mokuKey), `${where}: mokuKey ${p.mokuKey} is not a moku`)
    }
    const g = f.geometry
    if (!ok(g && (g.type === 'Polygon' || g.type === 'MultiPolygon'), `${where}: geometry type`)) continue
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
    const rings = []
    polys.forEach((poly) =>
      poly.forEach((ring, ri) => {
        vertices += ring.length - 1
        ok(ring.length >= 4, `${where}: ring with ${ring.length} positions`)
        ok(ring.every(inRegion), `${where}: coordinate out of range`)
        const a = ring[0]
        const z = ring[ring.length - 1]
        ok(a[0] === z[0] && a[1] === z[1], `${where}: ring not closed`)
        const area = ringSignedArea(ring)
        ok(area !== 0, `${where}: zero-area ring`)
        ok(ri === 0 ? area > 0 : area < 0, `${where}: ring ${ri} winding is not RFC 7946`)
        rings.push(ring)
      }),
    )
    const x = ringIntersections(rings)
    ok(x.length === 0, `${where}: ${x.length} crossing ring pairs`)
  }
  console.log(`  ${key}: ${fc.features.length} features, ${vertices} vertices`)
}
// coincidence of the two files' lines
const ahuV = new Set()
for (const f of ahupuaa.features) for (const poly of f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates) for (const r of poly) for (const c of r) ahuV.add(`${c[0]},${c[1]}`)
let shared = 0
let total = 0
for (const f of moku.features) for (const poly of f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates) for (const r of poly) for (const c of r) { total++; if (ahuV.has(`${c[0]},${c[1]}`)) shared++ }
console.log(`  moku vertices that are also ahupuaʻa vertices: ${((shared / total) * 100).toFixed(2)}%`)
ok(shared / total > 0.98, 'moku and ahupuaʻa lines should coincide')
console.log(`  moku keys (island:moku, the polities.json join): ${[...mokuKeys].join(', ')}`)

// ---------------------------------------------------------------------------
console.log('packs:')
console.log('  id          size       m/texel  land    IoU    metres              height.png  rain.png  summits')
for (const t of table) {
  console.log(`  ${t.id.padEnd(11)} ${t.size.padEnd(10)} ${t.mpt.padStart(7)}  ${t.land.padStart(6)}  ${t.iou}  ${t.range.padEnd(18)}  ${t.height.padStart(10)}  ${t.rain.padStart(8)}  ${t.peaks}`)
}
console.log('rain (mm/yr, decoded; IoU above is the land mask against the ahupuaʻa polygons):')
for (const t of table) console.log(`  ${t.id.padEnd(11)} ${t.rainInfo}${t.rainSpots ? `; ${t.rainSpots}` : ''}`)
console.log('files under public/data:')
let totalBytes = 0
for (const f of [...walk(DATA)].sort()) {
  const b = statSync(f).size
  totalBytes += b
  console.log(`  ${kb(b).padStart(10)}  ${relative(DATA, f)}`)
}
console.log(`  ${kb(totalBytes).padStart(10)}  total`)
ok(totalBytes < MAX_BYTES, `public/data is ${kb(totalBytes)}, over the ${kb(MAX_BYTES)} budget`)

if (failures) {
  console.log(`${failures} check(s) failed`)
  process.exit(1)
}
console.log('all checks passed')
