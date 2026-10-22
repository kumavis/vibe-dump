// --check and --preview for the district packs (DATA.md, "District packs").
//
// The check reads public/data/districts/ back: the manifest's shape and
// provenance; each image's format and size; sea ≤ −1 m and land > 0 under the
// stated scale and offset; known summits and the harbour at their heights,
// which also proves the registration (north up, east right, no shift); the
// district against its island pack, texel for texel at the island's
// resolution; rain wet and dry where it should be; every patch on its own
// side of today's coast (a lower over land standing above its depth, a raise
// over sea deeper than its depth), a keyframe's inside the one before it and
// a dated work's weights of one kind never over one; the supporting files;
// the streams; and the size of each district's directory.
//
// The preview draws, per district, the shaded relief with the moku and
// ahupuaʻa lines, the routed streams (blue), the breaches (magenta), the
// patches tinted (contact red over kingdom amber) and the traced old shore
// (dark red); the same cut to the waterfront; and the rain. Reads only
// public/data/; writes only into the directory given.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gridFromBounds, KX, KZ } from './geo.mjs'
import { readPNG, writePNG } from './png.mjs'
import { readPack, routeWater } from './layers-raster.mjs'
import { trunkBreaches } from './district-water.mjs'

// each district's directory (its images, masks, features and supporting files)
const MAX_BYTES = 4 * 1024 * 1024
// a district's texel, metres: lidar where it can be, but the long side is 2048
const TEXEL = [4, 13.5]

// Known heights: [name, lon, lat, search radius m, expected m, tolerance m, 'max' | 'at'].
// Positions are the summits as the lidar has them; the heights are the
// mapped ones (Puʻu ʻŌhiʻa 2,013 ft and Puowaina 498 ft on the 1881 survey,
// Kōnāhuanui 3,150 ft, the Pali lookout terrace about 1,190 ft).
const KNOWN = {
  nuuanu: [
    ['Kōnāhuanui', -157.7882, 21.3581, 150, 960, 25, 'max'],
    ['Puʻu ʻŌhiʻa (Tantalus)', -157.8122, 21.3339, 100, 614, 15, 'max'],
    ['Puowaina (Punchbowl), rim', -157.8491, 21.3122, 100, 152, 12, 'max'],
    ['Nuʻuanu Pali lookout', -157.7933, 21.3667, 25, 362, 20, 'at'],
  ],
  // Kōnāhuanui as above; Olomana 1,643 ft (its sharp summit stands lower in a
  // 13 m texel); Mānana 361 ft and Puʻu Hawaiʻiloa 337 ft on the 1938 map
  // (Mānana's from the CUDEM, an islet the lidar left out)
  koolaupoko: [
    ['Kōnāhuanui', -157.7882, 21.3581, 150, 960, 25, 'max'],
    ['Olomana', -157.7508, 21.3612, 150, 501, 25, 'max'],
    ['Mānana (Rabbit Island)', -157.6565, 21.3285, 150, 110, 8, 'max'],
    ['Puʻu Hawaiʻiloa', -157.7569, 21.448, 100, 103, 8, 'max'],
  ],
}
// Points that must be sea, and how deep at least: [name, lon, lat, metres,
// and optionally how shallow at most: a reef flat must read as shallow sea]
const SEA_POINTS = {
  nuuanu: [
    ['Honolulu Harbour, main channel', -157.869, 21.308, -5],
    ['Honolulu Harbour, entrance', -157.8655, 21.303, -5],
    ['Kewalo Basin', -157.8575, 21.2925, -1],
    ['off Waikīkī', -157.835, 21.272, -1],
  ],
  koolaupoko: [
    ['Kāneʻohe Bay, the south basin', -157.778, 21.432, -5],
    ['Kāneʻohe Bay, the lagoon off Kahaluʻu', -157.822, 21.462, -5],
    ['Kailua Bay', -157.705, 21.405, -5],
    ['Waimānalo Bay', -157.68, 21.345, -3],
    ['the barrier reef flat', -157.805, 21.47, -1, -4],
    ['the reef flat west of Mōkapu', -157.785, 21.453, -1, -4],
    ['a patch reef off Heʻeia', -157.8008, 21.4529, -1, -4],
    ['inside Heʻeia’s fishpond', -157.8075, 21.4365, -1, -3],
  ],
}
// Points that must be land: [name, lon, lat, search radius m] (the highest texel within it)
const LAND_POINTS = {
  koolaupoko: [
    ['Heʻeia’s pond wall, east side', -157.805, 21.4345, 15],
    ['Mokumanu', -157.7218, 21.47, 40],
    ['Mokolea', -157.7195, 21.4319, 25],
  ],
}
// Rain: [name, lon, lat, radius m, 'max' | 'min', lo mm, hi mm]
const RAIN_SPOTS = {
  nuuanu: [
    ['upper Nuʻuanu (wet)', -157.795, 21.36, 800, 'max', 2500, 6000],
    ['upper Mānoa (wet)', -157.795, 21.345, 800, 'max', 2500, 6000],
    ['downtown by the harbour (dry)', -157.862, 21.308, 600, 'min', 0, 900],
    ['Waikīkī (dry)', -157.83, 21.28, 600, 'min', 0, 900],
  ],
  koolaupoko: [
    ['the crest above Kāneʻohe (wet)', -157.815, 21.385, 800, 'max', 2500, 6000],
    ['the head of Waiāhole (wet)', -157.875, 21.47, 800, 'max', 2500, 6000],
    ['Mōkapu (dry)', -157.745, 21.452, 600, 'min', 0, 900],
    ['Makapuʻu (dry)', -157.66, 21.315, 400, 'min', 0, 900],
  ],
}

// The stretch of shore the patches lie on: [west, south, east, north]
const WATERFRONT = {
  nuuanu: [-157.897, 21.27, -157.8, 21.335],
  koolaupoko: [-157.83, 21.41, -157.735, 21.48],
}

const mmOf = (b) => (b === 0 ? 0 : 300 * Math.pow(40, b / 255))

function* walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) yield* walk(f)
    else yield f
  }
}

const texelOf = (grid, lon, lat) => [Math.floor((lon - grid.bounds[0]) / grid.dLon), Math.floor((grid.bounds[3] - lat) / grid.dLat)]

export function checkDistricts({ data, log }) {
  let failures = 0
  const fail = (m) => {
    failures++
    log(`  FAIL ${m}`)
  }
  const ok = (cond, m) => {
    if (!cond) fail(m)
    return cond
  }
  const dir = join(data, 'districts')
  const mPath = join(dir, 'manifest.json')
  if (!existsSync(mPath)) {
    log(`no ${mPath}`)
    return false
  }
  const manifest = JSON.parse(readFileSync(mPath, 'utf8'))
  const islands = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  ok(Array.isArray(manifest.districts) && manifest.districts.length > 0, 'manifest has no districts')
  for (const d of manifest.districts) {
    log(`${d.id}:`)
    for (const k of ['id', 'name', 'island', 'bounds', 'size', 'metresPerTexel', 'height', 'rain', 'patches', 'features', 'sources']) ok(d[k] !== undefined, `${d.id}: no ${k}`)
    const [W, H] = d.size
    const grid = gridFromBounds(d.bounds, W, H)
    ok(Math.max(W, H) <= 2048, `${d.id}: ${W}x${H} is over 2048 on the long side`)
    const [mx, mz] = d.metresPerTexel
    ok(Math.abs(mx - grid.dLon * KX) < 1e-3 && Math.abs(mz - grid.dLat * KZ) < 1e-3, `${d.id}: metresPerTexel does not match bounds and size`)
    ok(Math.abs(mx / mz - 1) < 0.005, `${d.id}: texels are not square (${mx} x ${mz} m)`)
    ok(mx >= TEXEL[0] && mx <= TEXEL[1], `${d.id}: ${mx} m per texel, outside ${TEXEL.join('–')}`)
    for (const s of d.sources) ok(s.id && s.title && s.url && s.licence && s.fetched, `${d.id}: source ${s.id || '?'} lacks id, title, url, licence or fetched`)

    // heights
    const img = readPNG(join(dir, d.height.file))
    ok(img.channels === 3 && img.width === W && img.height === H, `${d.height.file}: ${img.width}x${img.height}x${img.channels}, expected ${W}x${H} RGB`)
    const P = readPack(dir, d)
    const { metres, land } = P
    let bNonZero = 0
    let shallow = 0
    let nLand = 0
    let lo = Infinity
    let hi = -Infinity
    for (let o = 0; o < W * H; o++) {
      if (img.data[o * 3 + 2]) bNonZero++
      if (metres[o] <= 0 && metres[o] > -1) shallow++
      if (land[o]) nLand++
      lo = Math.min(lo, metres[o])
      hi = Math.max(hi, metres[o])
    }
    ok(!bNonZero, `${d.height.file}: ${bNonZero} texels with B != 0`)
    ok(!shallow, `${d.height.file}: ${shallow} sea texels shallower than -1 m`)
    const landFraction = nLand / (W * H)
    ok(Math.abs(landFraction - d.stats.landFraction) < 1e-3, `${d.id}: land fraction ${landFraction.toFixed(4)} but stats say ${d.stats.landFraction}`)
    ok(lo === d.stats.minMetres && hi === d.stats.maxMetres, `${d.id}: heights ${lo}..${hi} but stats say ${d.stats.minMetres}..${d.stats.maxMetres}`)
    log(`  ${W}x${H} at ${mx.toFixed(2)} m, land ${(landFraction * 100).toFixed(1)}%, ${lo} .. ${hi} m`)

    for (const [name, lon, lat, r, want, tol, how] of KNOWN[d.id] || []) {
      const [i0, j0] = texelOf(grid, lon, lat)
      const rr = Math.max(0, Math.round(r / mx))
      let best = -Infinity
      let bi = i0
      let bj = j0
      for (let j = j0 - rr; j <= j0 + rr; j++) {
        for (let i = i0 - rr; i <= i0 + rr; i++) {
          if (Math.hypot(i - i0, j - j0) > rr || i < 0 || j < 0 || i >= W || j >= H) continue
          if (metres[j * W + i] > best) [best, bi, bj] = [metres[j * W + i], i, j]
        }
      }
      const got = how === 'at' ? metres[j0 * W + i0] : best
      const off = Math.hypot(bi - i0, bj - j0) * mx
      ok(Math.abs(got - want) <= tol, `${name}: ${got} m, expected ${want} ± ${tol}`)
      log(`  ${name.padEnd(28)} ${got.toFixed(1).padStart(7)} m (mapped ${want})${how === 'max' ? `, highest texel ${off.toFixed(0)} m from the summit` : ''}`)
    }
    for (const [name, lon, lat, deeper, shallower = -Infinity] of SEA_POINTS[d.id] || []) {
      const [i, j] = texelOf(grid, lon, lat)
      const v = metres[j * W + i]
      ok(v <= deeper && v >= shallower, `${name}: ${v} m, expected sea at or below ${deeper} m${shallower > -Infinity ? ` and above ${shallower} m` : ''}`)
      log(`  ${name.padEnd(28)} ${v.toFixed(1).padStart(7)} m`)
    }
    for (const [name, lon, lat, r] of LAND_POINTS[d.id] || []) {
      const [i0, j0] = texelOf(grid, lon, lat)
      const rr = Math.max(0, Math.round(r / mx))
      let best = -Infinity
      for (let j = j0 - rr; j <= j0 + rr; j++) for (let i = i0 - rr; i <= i0 + rr; i++) if (metres[j * W + i] > best) best = metres[j * W + i]
      ok(best > 0, `${name}: ${best} m, expected land`)
      log(`  ${name.padEnd(28)} ${best.toFixed(1).padStart(7)} m`)
    }

    // against the island pack
    const parent = islands.packs.find((p) => p.id === (d.parent || d.island))
    if (ok(parent, `${d.id}: no island pack ${d.parent || d.island}`)) {
      const [pw, ps, pe, pn] = parent.bounds
      const [w, s, e, n] = d.bounds
      ok(w > pw && e < pe && s > ps && n < pn, `${d.id}: bounds not inside the ${parent.id} pack`)
      const I = readPack(data, parent)
      // block-average the district onto the island texels it covers fully
      let agree = 0
      let both = 0
      let either = 0
      const diffs = []
      for (let pj = 0; pj < I.H; pj++) {
        for (let pi = 0; pi < I.W; pi++) {
          const lon0 = I.grid.bounds[0] + pi * I.grid.dLon
          const lat0 = I.grid.bounds[3] - pj * I.grid.dLat
          const i0 = Math.ceil((lon0 - w) / grid.dLon)
          const i1 = Math.floor((lon0 + I.grid.dLon - w) / grid.dLon)
          const j0 = Math.ceil((n - lat0) / grid.dLat)
          const j1 = Math.floor((n - lat0 + I.grid.dLat) / grid.dLat)
          if (i0 < 0 || j0 < 0 || i1 > W || j1 > H || i1 <= i0 || j1 <= j0) continue
          let sum = 0
          let nl = 0
          let cnt = 0
          for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
            cnt++
            if (land[j * W + i]) {
              nl++
              sum += metres[j * W + i]
            }
          }
          const dl = nl >= cnt / 2
          const il = I.land[pj * I.W + pi] === 1
          if (dl === il) agree++
          if (dl && il) {
            both++
            diffs.push(sum / nl - I.metres[pj * I.W + pi])
          }
          if (dl || il) either++
        }
      }
      diffs.sort((a, b) => a - b)
      const iou = both / either
      const med = diffs[Math.floor(diffs.length / 2)]
      const mad = diffs.map((v) => Math.abs(v - med)).sort((a, b) => a - b)[Math.floor(diffs.length / 2)]
      ok(iou > 0.9, `${d.id}: land against the ${parent.id} pack, IoU ${iou.toFixed(3)}`)
      ok(Math.abs(med) < 3 && mad < 6, `${d.id}: heights against the ${parent.id} pack differ by ${med.toFixed(2)} m (median), ${mad.toFixed(2)} m spread`)
      log(`  against the ${parent.id} pack at ${I.texelMetres.toFixed(0)} m: land IoU ${iou.toFixed(3)}, heights ${med >= 0 ? '+' : ''}${med.toFixed(2)} m (median), spread ${mad.toFixed(2)} m`)
    }

    // rain
    const rain = readPNG(join(dir, d.rain.file))
    if (ok(rain.channels === 1 && rain.width === W && rain.height === H, `${d.rain.file}: not a ${W}x${H} greyscale image`)) {
      let wet = 0
      for (let o = 0; o < W * H; o++) {
        if (!land[o] && rain.data[o]) wet++
      }
      ok(!wet, `${d.rain.file}: ${wet} sea texels with rain`)
      for (const [name, lon, lat, r, how, lo2, hi2] of RAIN_SPOTS[d.id] || []) {
        const [i0, j0] = texelOf(grid, lon, lat)
        const rr = Math.round(r / mx)
        let v = how === 'max' ? -1 : Infinity
        for (let j = j0 - rr; j <= j0 + rr; j++) for (let i = i0 - rr; i <= i0 + rr; i++) {
          const o = j * W + i
          if (!land[o]) continue
          const mm = mmOf(rain.data[o])
          v = how === 'max' ? Math.max(v, mm) : Math.min(v, mm)
        }
        ok(v >= lo2 && v <= hi2, `rain at ${name}: ${v.toFixed(0)} mm, expected ${lo2}–${hi2}`)
        log(`  rain, ${name.padEnd(30)} ${v.toFixed(0).padStart(5)} mm`)
      }
    }

    // patches. Each on its own side of today's coast: a lower (the default)
    // only over land standing above its depth, a raise only over sea deeper
    // than its depth. A keyframe patch (as nuuanu's) is 0 or 255, and each
    // later keyframe's inside the one before it (land made then stayed land);
    // a dated work (an id, as patches/manifest.json's) may carry soft weights,
    // and no texel's weights of one kind over the dated works pass one.
    const sums = { raise: new Float32Array(W * H), lower: new Float32Array(W * H) }
    const keyframes = []
    for (const p of d.patches) {
      const kind = p.kind ?? 'lower'
      const depth = p.depth ?? -1
      const label = p.keyframe || p.id
      ok(label && Number.isInteger(p.until) && p.file, `${d.id}: a patch lacks keyframe or id, until or file`)
      ok(['raise', 'lower'].includes(kind) && Number.isFinite(depth), `${label}: kind ${kind}, depth ${depth}`)
      ok(typeof p.note === 'string' && p.note.length > 40 && p.source, `${label}: no source or note`)
      const m = readPNG(join(dir, p.file))
      if (!ok(m.channels === 1 && m.width === W && m.height === H, `${p.file}: not a ${W}x${H} greyscale image`)) continue
      let on = 0
      let wrongSide = 0
      let wrongWay = 0
      let odd = 0
      let km2 = 0
      for (let o = 0; o < W * H; o++) {
        const v = m.data[o]
        if (v !== 0 && v !== 255) odd++
        if (!v) continue
        on++
        km2 += v / 255
        if (!p.keyframe) sums[kind][o] += v / 255
        if (kind === 'lower') {
          if (!land[o]) wrongSide++
          if (!(metres[o] > depth)) wrongWay++
        } else {
          if (land[o]) wrongSide++
          if (!(metres[o] < depth)) wrongWay++
        }
      }
      km2 *= (mx * mz) / 1e6
      if (p.keyframe) {
        ok(!odd, `${p.file}: ${odd} texels neither 0 nor 255`)
        keyframes.push(p)
      }
      ok(!wrongSide, `${p.file}: ${wrongSide} texels over today's ${kind === 'lower' ? 'sea' : 'land'}`)
      ok(!wrongWay, `${p.file}: ${wrongWay} texels it would ${kind === 'lower' ? 'raise' : 'deepen'} (today already ${kind === 'lower' ? 'at or below' : 'at or above'} ${depth} m)`)
      ok(on > 0, `${p.file}: empty`)
      log(`  patch ${label} (${kind} to ${depth} m, until ${p.until}): ${on} texels, ${km2.toFixed(3)} km²`)
    }
    for (const k of ['raise', 'lower']) {
      let over = 0
      for (const v of sums[k]) if (v > 1 + 1 / 255) over++
      ok(!over, `${d.id}: ${over} texels where the dated ${k} weights add up to more than one`)
    }
    keyframes.sort((a, b) => a.until - b.until)
    for (let k = 1; k < keyframes.length; k++) {
      const a = readPNG(join(dir, keyframes[k - 1].file)).data
      const b = readPNG(join(dir, keyframes[k].file)).data
      let out = 0
      for (let o = 0; o < W * H; o++) if (b[o] && !a[o]) out++
      ok(!out, `${keyframes[k].file}: ${out} texels outside ${keyframes[k - 1].file}`)
    }

    // supporting files
    for (const f of d.files || []) {
      const path = join(dir, f.file)
      if (!ok(existsSync(path), `${d.id}: missing ${f.file}`)) continue
      if (f.file.endsWith('.geojson')) {
        const fc = JSON.parse(readFileSync(path, 'utf8'))
        ok(fc.type === 'FeatureCollection' && fc.features.length > 0, `${f.file}: not a FeatureCollection`)
        let outside = 0
        for (const ft of fc.features) {
          const cs = ft.geometry.type === 'LineString' ? ft.geometry.coordinates : ft.geometry.coordinates.flat()
          for (const [lon, lat] of cs) if (lon < d.bounds[0] - 0.01 || lon > d.bounds[2] + 0.01 || lat < d.bounds[1] - 0.01 || lat > d.bounds[3] + 0.01) outside++
        }
        ok(!outside, `${f.file}: ${outside} vertices outside the district`)
        log(`  ${f.file}: ${fc.features.length} feature(s)`)
      }
    }

    // breaches and streams, as baked
    for (const b of d.breaches || []) ok(Array.isArray(b.points) && b.points.length >= 1 && b.name, `${d.id}: a breach lacks name or points`)
    for (const s of d.streams || []) {
      ok(s.ok, `${s.name}: ${(s.withinMappedShare * 100).toFixed(0)}% on the mapped stream, outlet ${s.outletOffStreamMetres} m off it, deepest pit ${s.deepestPitMetres} m`)
      log(
        `  ${s.name.padEnd(16)} ${s.lengthKm.toFixed(2)} km to tidewater, ${(s.withinMappedShare * 100).toFixed(0)}% on the mapped lines (within the district's tolerance), ` +
          `outlet ${s.outletOffStreamMetres} m off it and ${s.outletFromMouthMetres} m from its mouth, ${s.catchmentKm2} km², deepest pit ${s.deepestPitMetres} m`,
      )
    }
  }

  // size of each district's directory, and of the whole
  let bytes = 0
  const per = new Map()
  for (const f of walk(dir)) {
    const b = statSync(f).size
    bytes += b
    const rel = f.slice(dir.length + 1)
    const id = rel.includes('/') ? rel.split('/')[0] : null
    if (id) per.set(id, (per.get(id) || 0) + b)
    log(`  ${rel.padEnd(44)} ${(b / 1024).toFixed(0).padStart(6)} KB`)
  }
  for (const [id, b] of per) {
    ok(b <= MAX_BYTES, `districts/${id}/ is ${(b / 1048576).toFixed(2)} MB, over ${MAX_BYTES / 1048576} MB`)
    log(`districts/${id}/: ${(b / 1048576).toFixed(2)} MB`)
  }
  log(`districts/: ${(bytes / 1048576).toFixed(2)} MB`)
  log(failures ? `${failures} failure(s)` : 'all district checks passed')
  return failures === 0
}

// ---------------------------------------------------------------------------
// Preview

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
  [0, [96, 128, 78]],
  [0.15, [130, 150, 90]],
  [0.4, [165, 160, 115]],
  [0.7, [160, 135, 110]],
  [1, [235, 230, 225]],
]
const SEA = [
  [0, [150, 205, 225]],
  [0.2, [70, 140, 195]],
  [1, [15, 40, 90]],
]
const RAINR = [
  [0, [235, 215, 160]],
  [0.35, [150, 200, 110]],
  [0.65, [40, 140, 90]],
  [1, [20, 50, 160]],
]

function blend(rgb, o, c, a) {
  for (let k = 0; k < 3; k++) rgb[o * 3 + k] = Math.round(rgb[o * 3 + k] * (1 - a) + c[k] * a)
}

function drawLine(rgb, W, H, grid, coords, colour, alpha, width = 1) {
  const [w, , , n] = grid.bounds
  for (let k = 0; k < coords.length - 1; k++) {
    const x0 = (coords[k][0] - w) / grid.dLon
    const y0 = (n - coords[k][1]) / grid.dLat
    const x1 = (coords[k + 1][0] - w) / grid.dLon
    const y1 = (n - coords[k + 1][1]) / grid.dLat
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2))
    for (let s = 0; s <= steps; s++) {
      const x = Math.floor(lerp(x0, x1, s / steps))
      const y = Math.floor(lerp(y0, y1, s / steps))
      for (let dy = 0; dy < width; dy++) for (let dx = 0; dx < width; dx++) {
        const xx = x + dx - (width >> 1)
        const yy = y + dy - (width >> 1)
        if (xx >= 0 && yy >= 0 && xx < W && yy < H) blend(rgb, yy * W + xx, colour, alpha)
      }
    }
  }
}

function drawFeatures(rgb, W, H, grid, fc, colour, alpha, width) {
  for (const f of fc.features) {
    const g = f.geometry
    if (!g) continue
    const lines = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : g.type === 'Polygon' ? g.coordinates : g.type === 'MultiPolygon' ? g.coordinates.flat() : []
    for (const l of lines) drawLine(rgb, W, H, grid, l, colour, alpha, width)
  }
}

function crop(rgb, W, x0, y0, cw, ch, k) {
  const out = new Uint8Array(cw * k * ch * k * 3)
  for (let y = 0; y < ch * k; y++) for (let x = 0; x < cw * k; x++) {
    const s = ((y0 + Math.floor(y / k)) * W + x0 + Math.floor(x / k)) * 3
    out.set(rgb.subarray(s, s + 3), (y * cw * k + x) * 3)
  }
  return out
}

// keyframe patches by keyframe; dated works by kind (raise cyan, lower red)
const PATCH_COLOURS = { contact: [225, 60, 40], kingdom: [250, 190, 40], raise: [0, 230, 230], lower: [235, 40, 40] }

export function previewDistricts({ data, out, log }) {
  mkdirSync(out, { recursive: true })
  const dir = join(data, 'districts')
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
  const moku = JSON.parse(readFileSync(join(data, 'boundaries', 'moku.geojson'), 'utf8'))
  const ahupuaa = JSON.parse(readFileSync(join(data, 'boundaries', 'ahupuaa.geojson'), 'utf8'))
  for (const d of manifest.districts) {
    const P = readPack(dir, d)
    const { W, H, grid, metres, land } = P
    const [mx, mz] = d.metresPerTexel
    const rgb = new Uint8Array(W * H * 3)
    const L = [-0.5, -0.6, 0.62]
    const Ln = Math.hypot(...L)
    let top = 0
    for (const v of metres) if (v > top) top = v
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const o = y * W + x
        const v = metres[o]
        const l = metres[y * W + Math.max(0, x - 1)]
        const r = metres[y * W + Math.min(W - 1, x + 1)]
        const u = metres[Math.max(0, y - 1) * W + x]
        const dn = metres[Math.min(H - 1, y + 1) * W + x]
        const ex = 1.5
        const nx = (-(r - l) / (2 * mx)) * ex
        const ny = (-(dn - u) / (2 * mz)) * ex
        const shade = Math.max(0, (nx * L[0] + ny * L[1] + L[2]) / Math.hypot(nx, ny, 1) / Ln)
        const c = v > 0 ? ramp(LAND, Math.sqrt(v / Math.max(1, top))).map((k) => k * (0.3 + 0.85 * shade)) : ramp(SEA, Math.sqrt(-v / 60)).map((k) => k * (0.9 + 0.15 * shade))
        rgb.set(c.map((k) => Math.max(0, Math.min(255, Math.round(k)))), o * 3)
      }
    }
    // patches, earliest on top
    const patches = [...d.patches].sort((a, b) => b.until - a.until)
    for (const p of patches) {
      const m = readPNG(join(dir, p.file)).data
      const c = PATCH_COLOURS[p.keyframe] || PATCH_COLOURS[p.kind ?? 'lower'] || [200, 0, 200]
      for (let o = 0; o < W * H; o++) if (m[o]) blend(rgb, o, c, 0.55 * (m[o] / 255))
    }
    // streams: routed over the pack, drawn where they drain more than 0.25 km²
    const rain = readPNG(join(dir, d.rain.file)).data
    const mm = new Float32Array(W * H)
    for (let o = 0; o < W * H; o++) mm[o] = land[o] ? mmOf(rain[o]) : 0
    const route = routeWater(metres, land, W, H, mx, mm, Infinity)
    for (let o = 0; o < W * H; o++) {
      if (land[o] && route.area[o] > 0.25) blend(rgb, o, [30, 90, 230], Math.min(0.9, 0.35 + 0.15 * Math.log10(route.area[o] / 0.25 + 1) * 3))
    }
    drawFeatures(rgb, W, H, grid, ahupuaa, [245, 245, 245], 0.6, 1)
    drawFeatures(rgb, W, H, grid, moku, [0, 0, 0], 0.9, 2)
    for (const f of d.files || []) {
      if (!f.file.endsWith('.geojson')) continue
      const fc = JSON.parse(readFileSync(join(dir, f.file), 'utf8'))
      const colour = f.year && f.year < 1890 ? [120, 0, 0] : [140, 80, 0]
      // (the reefs and other shapes of a chart thinner and lighter than its shores)
      drawFeatures(rgb, W, H, grid, { features: fc.features.filter((x) => !['reef', 'enclosed'].includes(x.properties?.kind)) }, colour, 0.95, 2)
      drawFeatures(rgb, W, H, grid, { features: fc.features.filter((x) => ['reef', 'enclosed'].includes(x.properties?.kind)) }, [255, 255, 255], 0.7, 1)
    }
    for (const b of d.breaches || []) {
      drawLine(rgb, W, H, grid, b.points.length > 1 ? b.points : [b.points[0], b.points[0]], [255, 0, 255], 1, 3)
    }
    writePNG(join(out, `${d.id}-relief.png`), W, H, rgb)
    // the waterfront, where the patches are
    const wf = WATERFRONT[d.id] || d.bounds
    const [x0, y0] = texelOf(grid, wf[0], wf[3])
    const [x1, y1] = texelOf(grid, wf[2], wf[1])
    const cx0 = Math.max(0, x0)
    const cy0 = Math.max(0, y0)
    const cw = Math.min(W, x1) - cx0
    const ch = Math.min(H, y1) - cy0
    writePNG(join(out, `${d.id}-waterfront.png`), cw, ch, crop(rgb, W, cx0, cy0, cw, ch, 1))
    // rain
    const rr = new Uint8Array(W * H * 3)
    for (let o = 0; o < W * H; o++) rr.set((land[o] ? ramp(RAINR, rain[o] / 255) : [40, 40, 50]).map(Math.round), o * 3)
    drawFeatures(rr, W, H, grid, moku, [0, 0, 0], 0.8, 2)
    writePNG(join(out, `${d.id}-rain.png`), W, H, rr)
    log(`${d.id}: ${join(out, `${d.id}-relief.png`)}, ${d.id}-waterfront.png, ${d.id}-rain.png`)
  }
}

/** Print the pits left on the district's stream trunks, as entries for its `breaches` list. */
export function findBreaches({ data, d, dir: downloads, log }) {
  const dir = join(data, 'districts')
  const entry = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8')).districts.find((x) => x.id === d.id)
  if (!entry) throw new Error(`${d.id} is not baked yet`)
  const P = readPack(dir, entry)
  const rain = P.rain.map((v) => (v === v ? v : 0))
  const mapped = JSON.parse(readFileSync(join(downloads, d.id, 'vectors', 'streams.geojson'), 'utf8'))
  const found = trunkBreaches(P.metres, P.land, P.grid, rain, d.streams || [], mapped)
  log(`${found.length} pit(s) deeper than 1.5 m on the trunks of ${d.id}:`)
  for (const b of found) {
    const at = b.points[0].map((v) => v.toFixed(4))
    log(`      { name: '${b.stream}, ${b.depth.toFixed(1)} m pit at ${at[1]} N ${(-b.points[0][0]).toFixed(4)} W', points: ${JSON.stringify(b.points)} },`)
  }
}
