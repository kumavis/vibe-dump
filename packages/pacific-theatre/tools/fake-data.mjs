// Dev-only: the Stage 0 fixtures (ENGINEERING.md §13), a small synthetic
// dataset in exactly the shape DATA.md describes, for building the table and
// the engine before (or without) the real bakes and the real record. Four
// made-up islands, a made-up trench, made-up fleets with made-up names, all
// plainly labelled as tests. Nothing here is history.
//
//   node tools/fake-data.mjs [outdir]          (default: test-data/, gitignored at the root)
//
// Then load the app with ?data=../test-data/ (built) or ?data=./test-data/ (dev).
//
// What it writes, and what each is for:
//   manifest.json, table/height.png  a 512 × 458 table pack in the real projection
//                                    (aeqd at 141.5° E 7° N, the real extent, coarser
//                                    texels): four islands (one straddling 180°, one
//                                    3,000 m high), a trench to −10,000 m, shelves, a rise
//   table/coast.json, labels.json    the islands' polygons (longitudes past 180 where
//                                    they fall), strokes, every label kind and rank, one ja
//   chapters.json, fronts/           a prologue and three chapters; two front keyframes
//                                    and the declared lines
//   places.json, events.json,        twelve of each (every precision, zones +09:00,
//   sources.json, clocks.json,       −12:00, +11:00, −10:30, one box event with box
//   routes.json                      stops, one card-only atrocity, one across the
//                                    date line); a fleet route across 180°, an air
//                                    route, a schematic campaign
//   boxes/manifest.json,             test-box: tangent at 179.5° E 28° N (across 180°),
//   boxes/test-box/height.png        256 × 256 at 625 m with an atoll and a 900 m island,
//                                    its placement from src/geo.js
//   boxes/test-box/battle.json       zone −12:00, 04:00–18:00, a squall, three ships a
//                                    side, a dive group, a CAP, a torpedo group, scripted
//                                    hits with their causes, three stops, three moments
//   kits/ships.json, aircraft.json   test kits using every block kind and shape, every
//                                    wing, tail and canopy, every insignia
//
// Adapted from holo-i-ke-au's tools/fake-data.mjs (b480c27): its noise and its
// shield-dome islands, and nothing of its content. The ids it writes are frozen
// in tools/check/ids.json (`fixtures`) so the parallel workflows can build
// against them.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { encodePNG } from './lib/png.mjs'
import { TableProjection, TangentProjection, placement, wrapLon } from '../src/geo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const out = args.find((a) => !a.startsWith('--')) || join(root, 'test-data')
const ids = JSON.parse(readFileSync(join(root, 'tools/check/ids.json'), 'utf8'))
const FIX = ids.fixtures

rmSync(out, { recursive: true, force: true })
const write = (rel, v) => {
  const f = join(out, rel)
  mkdirSync(dirname(f), { recursive: true })
  writeFileSync(f, typeof v === 'string' || Buffer.isBuffer(v) ? v : JSON.stringify(v, null, 1) + '\n')
}

const DEG = Math.PI / 180
const r5 = (v) => Math.round(v * 1e5) / 1e5
const r7 = (v) => Math.round(v * 1e7) / 1e7

// --- noise ----------------------------------------------------------------------
const hash = (i, j, s) => {
  let h = (i * 374761393 + j * 668265263 + s * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
function vnoise(x, y, s = 0) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const a = hash(i, j, s)
  const b = hash(i + 1, j, s)
  const c = hash(i, j + 1, s)
  const d = hash(i + 1, j + 1, s)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x, y, s, oct = 5) => {
  let t = 0
  let a = 0.5
  for (let o = 0; o < oct; o++) {
    t += a * vnoise(x, y, s + o)
    x = x * 2.03 + 17.1
    y = y * 2.03 + 5.3
    a *= 0.5
  }
  return t
}
const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// --- the made-up world, as functions of lon/lat ---------------------------------
// Each island is an ellipse in its own local kilometres (east, north), turned
// by `rot` and roughened by a periodic wobble of its edge, so its coastline can
// be written exactly as a polygon and every pack samples the same shape.
const ISLANDS = [
  { id: 'dateline-island', name: 'Dateline Island (test)', lon: 180.05, lat: 28.15, rx: 22, rz: 14, rot: 20, H: 900, phase: [0.3, 1.9, 4.1] },
  { id: 'test-atoll', name: 'Test Atoll', lon: 179.1, lat: 27.7, atoll: true, R: 7, rx: 7.6, rz: 7.6, rot: 0, H: 3, phase: [2.2, 0.7, 3.3] },
  { id: 'test-high-island', name: 'Test High Island', lon: 139.5, lat: 17.5, rx: 420, rz: 140, rot: -35, H: 3000, phase: [1.1, 2.7, 0.2] },
  { id: 'test-southern-island', name: 'Test Southern Island', lon: 157.5, lat: -8.5, rx: 300, rz: 90, rot: -40, H: 1500, phase: [3.9, 0.4, 2.5] },
]
for (const isl of ISLANDS) {
  isl.c = Math.cos(isl.rot * DEG)
  isl.s = Math.sin(isl.rot * DEG)
  isl.kx = Math.cos(isl.lat * DEG) * 111.32
}
const wobble = (isl, th) => 1 + 0.07 * Math.sin(3 * th + isl.phase[0]) + 0.05 * Math.sin(5 * th + isl.phase[1]) + 0.03 * Math.sin(9 * th + isl.phase[2])
/** An island's local frame at (lon, lat): along its long axis a, across it b (km), and the normalised radius s (1 on the coast). */
function local(isl, lon, lat) {
  const e = (wrapLon(lon, isl.lon) - isl.lon) * isl.kx
  const n = (lat - isl.lat) * 110.574
  const a = e * isl.c + n * isl.s
  const b = -e * isl.s + n * isl.c
  const th = Math.atan2(b, a)
  const s = Math.hypot(a / isl.rx, b / isl.rz) / wobble(isl, th)
  return { a, b, th, s, km: Math.hypot(a, b) }
}
/** The coast's ring in lon/lat, counter-clockwise (outer rings are, DATA.md §12), radius k × the coast. */
function ring(isl, k = 1, n = 96, clockwise = false) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const th = ((clockwise ? n - i : i) / n) * 2 * Math.PI
    const rho = (k * wobble(isl, th)) / Math.hypot(Math.cos(th) / isl.rx, Math.sin(th) / isl.rz)
    const a = rho * Math.cos(th)
    const b = rho * Math.sin(th)
    const e = a * isl.c - b * isl.s
    const nn = a * isl.s + b * isl.c
    pts.push([r5(isl.lon + e / isl.kx), r5(isl.lat + nn / 110.574)])
  }
  pts[pts.length - 1] = pts[0]
  return pts
}
// the atoll's islets: arcs of its ring that stand above the tide
const ISLETS = [
  [0.3, 1.1],
  [2.4, 2.9],
  [4.1, 4.6],
]
const onIslet = (th) => ISLETS.some(([a, b]) => {
  const t = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  return t >= a && t <= b
})
// a trench like the Marianas', on an arc east of the high island
const TRENCH = [
  [146.5, 10.5],
  [148.6, 14.5],
  [148.2, 19.5],
  [146.0, 23.5],
  [143.2, 26.5],
]
function kmToPolyline(lon, lat, line) {
  let best = Infinity
  const kx = Math.cos(lat * DEG) * 111.32
  for (let i = 0; i + 1 < line.length; i++) {
    const ax = (wrapLon(line[i][0], lon) - lon) * kx
    const az = (line[i][1] - lat) * 110.574
    const bx = (wrapLon(line[i + 1][0], lon) - lon) * kx
    const bz = (line[i + 1][1] - lat) * 110.574
    const dx = bx - ax
    const dz = bz - az
    const t = Math.max(0, Math.min(1, -(ax * dx + az * dz) / (dx * dx + dz * dz)))
    best = Math.min(best, Math.hypot(ax + dx * t, az + dz * t))
  }
  return best
}
const gc = (lon1, lat1, lon2, lat2) => {
  const a = Math.sin(((lat2 - lat1) * DEG) / 2) ** 2 + Math.cos(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.sin(((wrapLon(lon2, lon1) - lon1) * DEG) / 2) ** 2
  return 2 * 6371.0088 * Math.asin(Math.min(1, Math.sqrt(a)))
}

/** Metres at (lon, lat): positive on land, never between -1 and 0.25 (the bake's rules, DATA.md §2). */
function metresAt(lon, lat) {
  // the abyssal plain, with a rise round the test box so its floor meets the box's -4,000 m beyond
  let h = -5200 + (fbm(lon * 0.35, lat * 0.35, 5, 4) - 0.5) * 700
  h += 1250 * Math.exp(-((gc(lon, lat, 179.5, 28) / 650) ** 2))
  // a broad shallow shelf in the west, like the Sunda shelf, with no land on it
  const shelf = smooth(900, 300, gc(lon, lat, 112, 5))
  h = h + (-90 + (fbm(lon * 2, lat * 2, 9, 3) - 0.5) * 60 - h) * shelf
  // seamounts
  for (const [lo, la, top, r] of [[165, 15, -1400, 60], [155, 22, -900, 45], [130, -5, -2000, 80]]) h = Math.max(h, top - (top + 5200) * (1 - Math.exp(-((gc(lon, lat, lo, la) / r) ** 2))))
  // the trench: to -10,000 m on its axis
  const dt = kmToPolyline(lon, lat, TRENCH)
  if (dt < 300) h = Math.min(h, -5200 - 4800 * Math.exp(-((dt / 38) ** 2)) + (fbm(lon * 3, lat * 3, 13, 3) - 0.5) * 300 * Math.exp(-((dt / 38) ** 2)))
  // the islands: shelves round them, land inside
  for (const isl of ISLANDS) {
    const L = local(isl, lon, lat)
    if (L.s > 6) continue
    if (isl.atoll) {
      const d = Math.abs(L.km - isl.R) // km from the reef's line
      const inside = L.km < isl.R
      const flank = inside ? -22 + (fbm(L.a * 0.8, L.b * 0.8, 31, 3) - 0.5) * 8 : -1.2 - 2400 * smooth(0.6, 4.5, d)
      let a = d < 0.6 ? -1.2 : flank
      if (d < 0.45 && onIslet(L.th)) a = 2.5 + 1.5 * (1 - d / 0.45)
      h = inside || d < 6 ? Math.max(h, a) : h
      continue
    }
    if (L.s < 1) {
      const t = Math.pow(1 - L.s, 1.2)
      const land = isl.H * Math.pow(1 - Math.pow(L.s, 1.6), 1.3) + (fbm(L.a * 0.12, L.b * 0.12, 17, 4) - 0.5) * isl.H * 0.18 * t
      return Math.max(0.25, land)
    }
    // a shelf to 25 km out, then the slope down to whatever floor lies there (the trench included)
    const dKm = (L.s - 1) * Math.min(isl.rx, isl.rz)
    const shelfM = -(1 + 140 * smooth(0, 1, dKm / 25))
    const sea = shelfM + (h - shelfM) * smooth(25, 110, dKm)
    h = Math.max(h, sea)
  }
  return Math.min(-1, h)
}
/** Is (lon, lat) land (the half-land rule at a texel's centre)? */
const isLand = (lon, lat) => metresAt(lon, lat) > 0

/** A pack's PNG (DATA.md §2): 8-bit RGB, value = R·256 + G, metres = value·scale + offset. */
function heightPNG(W, H, lonLatAt, scale, offset) {
  const px = new Uint8Array(W * H * 3)
  let land = 0
  let lo = Infinity
  let hi = -Infinity
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const [lon, lat] = lonLatAt(i, j)
      const m = metresAt(lon, lat)
      if (m > 0) land++
      lo = Math.min(lo, m)
      hi = Math.max(hi, m)
      const v = Math.max(0, Math.min(65535, Math.round((m - offset) / scale)))
      const k = (j * W + i) * 3
      px[k] = v >> 8
      px[k + 1] = v & 255
    }
  }
  return { png: encodePNG(W, H, px, 3), stats: { landFraction: +(land / (W * H)).toFixed(4), minMetres: +lo.toFixed(2), maxMetres: +hi.toFixed(2) } }
}

// --- sources --------------------------------------------------------------------
const SOURCES = [
  { id: 'test-source-a', title: 'A Test Source (open, read in full)', author: 'Test Author', year: 1946, url: 'https://example.org/test-source-a', access: 'open', opened: true, read: 'full', language: 'en', licence: 'pd-us-gov', ref: 'TEST-001', tertiary: false, note: 'Test fixture.' },
  { id: 'test-source-b', title: 'テスト資料 (A Japanese test source)', author: 'Test Author B', year: 1967, url: 'https://example.org/test-source-b', access: 'open', opened: true, read: 'part', language: 'ja', licence: 'nids-permission', ref: 'C00000000000', tertiary: false, note: 'Test fixture.' },
  { id: 'test-source-c', title: 'A Test History (cited only)', author: 'Test Author C', year: 1950, url: '—', access: 'lending', opened: true, read: 'part', language: 'en', licence: 'copyright-cite-only', ref: null, tertiary: false, note: 'Test fixture.' },
  { id: 'test-source-pd', title: 'A Test Map (public domain)', author: 'Test Survey', year: 1945, url: 'https://example.org/test-map', access: 'open', opened: true, read: 'full', language: 'en', licence: 'pdm', ref: 'TEST-MAP-1', tertiary: false, note: 'Test fixture: stands behind the test front.' },
  { id: 'test-source-title', title: 'A Test Source Known Only by Its Title', author: 'Test Author D', year: 1948, url: 'https://example.org/test-source-title', access: 'print', opened: false, read: 'title', language: 'en', licence: 'unknown', ref: null, tertiary: true, note: 'Test fixture.' },
]
const cite = (id = 'test-source-a', where = 'p. 1') => ({ id, where })

// --- the table ------------------------------------------------------------------
const PROJ = { kind: 'aeqd', lon0: 141.5, lat0: 7.0, unit: 1000 }
const table = new TableProjection(PROJ)
const TW = 512
const TH = 458
// the real extent (the theatre box 78° E – 155° W, 42° S – 56° N projected), at coarser texels
let ex = [Infinity, Infinity, -Infinity, -Infinity]
const grow = (lon, lat) => {
  const [x, z] = table.toWorld([lon, lat])
  ex = [Math.min(ex[0], x), Math.min(ex[1], z), Math.max(ex[2], x), Math.max(ex[3], z)]
}
for (let l = 78; l <= 205; l += 0.25) grow(l, -42), grow(l, 56)
for (let a = -42; a <= 56; a += 0.25) grow(78, a), grow(205, a)
const texel = Math.max((ex[2] - ex[0]) / TW, (ex[3] - ex[1]) / TH)
const cx = (ex[0] + ex[2]) / 2
const cz = (ex[1] + ex[3]) / 2
const extent = [cx - (TW * texel) / 2, cz - (TH * texel) / 2, cx + (TW * texel) / 2, cz + (TH * texel) / 2].map((v) => +v.toFixed(4))
// the lon/lat the rectangle's edges reach
let env = [Infinity, Infinity, -Infinity, -Infinity]
for (let k = 0; k <= 200; k++) {
  const t = k / 200
  for (const [x, z] of [[extent[0] + (extent[2] - extent[0]) * t, extent[1]], [extent[0] + (extent[2] - extent[0]) * t, extent[3]], [extent[0], extent[1] + (extent[3] - extent[1]) * t], [extent[2], extent[1] + (extent[3] - extent[1]) * t]]) {
    const [lon, lat] = table.toLonLat(x, z)
    env = [Math.min(env[0], lon), Math.min(env[1], lat), Math.max(env[2], lon), Math.max(env[3], lat)]
  }
}
env = env.map((v) => +v.toFixed(3))
const tablePack = heightPNG(TW, TH, (i, j) => table.toLonLat(extent[0] + (i + 0.5) * texel, extent[1] + (j + 0.5) * texel), 0.5, -11000)
write('table/height.png', tablePack.png)
write('manifest.json', {
  test: true,
  note: 'Test fixtures from tools/fake-data.mjs: made-up islands in the real projection. Nothing here is history.',
  projection: PROJ,
  table: {
    id: 'table',
    name: 'The Pacific theatre (test)',
    bounds: [78, -42, 205, 56],
    envelope: env,
    size: [TW, TH],
    extent,
    metresPerTexel: [+(texel * 1000).toFixed(1), +(texel * 1000).toFixed(1)],
    height: { file: 'table/height.png', scale: 0.5, offset: -11000 },
    coast: 'table/coast.json',
    labels: 'table/labels.json',
    stats: tablePack.stats,
    sources: [{ id: 'test-relief', title: 'Made-up relief (tools/fake-data.mjs)', url: '—', fetched: new Date().toISOString().slice(0, 10), licence: 'test fixture' }],
  },
})

// --- the coast and the labels ---------------------------------------------------
const area = (pts, isl) => {
  let A = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, az] = [(pts[i][0] - isl.lon) * isl.kx, (pts[i][1] - isl.lat) * 110.574]
    const [bx, bz] = [(pts[i + 1][0] - isl.lon) * isl.kx, (pts[i + 1][1] - isl.lat) * 110.574]
    A += ax * bz - bx * az
  }
  return Math.abs(A / 2)
}
const coastFeatures = []
const strokeFeatures = []
let neId = 1
for (const isl of ISLANDS) {
  if (isl.atoll) {
    // the reef as a ring with its lagoon a hole, and each islet its own small island
    const outer = ring({ ...isl, rx: isl.R + 0.6, rz: isl.R + 0.6 }, 1, 72)
    const inner = ring({ ...isl, rx: isl.R - 0.6, rz: isl.R - 0.6 }, 1, 72, true)
    coastFeatures.push({ type: 'Feature', properties: { kind: 'reef', ne: `test-${neId++}`, area: +(area(outer, isl) - area(inner, isl)).toFixed(2) }, geometry: { type: 'Polygon', coordinates: [outer, inner] } })
    for (const [a, b] of ISLETS) {
      const arc = []
      for (let k = 0; k <= 8; k++) {
        const th = a + ((b - a) * k) / 8
        arc.push([isl.R + 0.4, th])
      }
      for (let k = 8; k >= 0; k--) {
        const th = a + ((b - a) * k) / 8
        arc.push([isl.R - 0.4, th])
      }
      const pts = arc.map(([r, th]) => [r5(isl.lon + (r * Math.cos(th)) / isl.kx), r5(isl.lat + (r * Math.sin(th)) / 110.574)])
      pts.push(pts[0])
      coastFeatures.push({ type: 'Feature', properties: { kind: 'island', ne: `test-${neId++}`, area: +area(pts, isl).toFixed(3) }, geometry: { type: 'Polygon', coordinates: [pts] } })
      strokeFeatures.push({ type: 'Feature', properties: { ne: `test-${neId - 1}` }, geometry: { type: 'LineString', coordinates: pts } })
    }
    continue
  }
  const pts = ring(isl)
  coastFeatures.push({ type: 'Feature', properties: { kind: isl.rx > 100 ? 'land' : 'island', ne: `test-${neId++}`, area: +area(pts, isl).toFixed(1), name: isl.name }, geometry: { type: 'Polygon', coordinates: [pts] } })
  strokeFeatures.push({ type: 'Feature', properties: { ne: `test-${neId - 1}` }, geometry: { type: 'LineString', coordinates: pts } })
}
write('table/coast.json', { type: 'FeatureCollection', note: 'Test fixture: the made-up islands. Longitudes past 180 where they fall (Dateline Island straddles it).', features: coastFeatures, strokes: { type: 'FeatureCollection', features: strokeFeatures } })

const LABELS = [
  { text: 'Test Sea', kind: 'sea', rank: 1, lonlat: [150, 24] },
  { text: 'International Date Line', kind: 'line', rank: 1, lonlat: [180, 12] },
  { text: 'Equator', kind: 'line', rank: 2, lonlat: [128, 0] },
  { text: 'Test Islands', kind: 'group', rank: 2, lonlat: [141, 14] },
  { text: 'Test High Island', today: 'Test High Island Today', ja: '試験島', kind: 'island', rank: 2, lonlat: [139.5, 17.5] },
  { text: 'Dateline Island', kind: 'island', rank: 3, lonlat: [-179.95, 28.15] },
  { text: 'Test Strait', kind: 'strait', rank: 3, lonlat: [125, 5] },
  { text: 'Test Anchorage', kind: 'base', rank: 3, lonlat: [157.6, -8.1] },
  { text: 'Test City', kind: 'city', rank: 4, lonlat: [-179.94, 28.18] },
  { text: 'Test Region', kind: 'region', rank: 4, lonlat: [114, 5] },
].sort((a, b) => a.rank - b.rank || a.text.localeCompare(b.text))
write('table/labels.json', LABELS)

// --- chapters, clocks, fronts ---------------------------------------------------
const CHAPTERS = [
  { id: 'prologue', label: 'the prologue (test)', short: 'Prologue', from: '1931-09-18', to: '1941-12-07', keyframe: '1941-12-06', note: 'Test chapter: the years before the war, in a tenth of the slider.', sources: ['test-source-a'] },
  { id: 'test-opening', label: 'the test opening', short: 'Opening', from: '1941-12-07', to: '1942-06-01', keyframe: '1941-12-06', note: 'Test chapter: the first months.', sources: ['test-source-a'] },
  { id: 'test-middle', label: 'the test middle', short: 'Middle', from: '1942-06-01', to: '1944-06-01', keyframe: '1943-06-01', note: 'Test chapter: the long middle, with the test box in it.', sources: ['test-source-a'] },
  { id: 'test-end', label: 'the test end', short: 'End', from: '1944-06-01', to: '1945-09-03', keyframe: '1943-06-01', note: 'Test chapter: the end.', sources: ['test-source-a'] },
]
write('chapters.json', CHAPTERS)
const CLOCK_NAMES = {
  jst: ['Tokyo time (JST)', 'jp', 'the Japanese forces and the home islands'],
  'usn-zp12': ['zone plus 12, Midway time', 'us', 'test: the shore forces at a mid-ocean atoll'],
  'usn-zp10': ['zone plus 10, the carriers', 'us', 'test: a carrier force'],
  'usn-zm11': ['zone minus 11, Guadalcanal', 'us', 'test: the Solomons'],
  'usn-zm12': ['zone minus 12', 'us', 'test'],
  'usn-item': ['Item (zone minus 9)', 'us', 'test: the Philippines in 1944'],
  'hst-1941': ['Hawaiian time, 1941', 'us', 'test: Oʻahu before February 1942'],
  hwt: ['Hawaiian war time', 'us', 'test: Oʻahu from February 1942'],
  'malaya-1941': ['Malaya time, 1941', 'uk', 'test: Malaya'],
  'ijn-zm8': ['one hour behind Item', 'jp', 'test: the early entries of some Japanese tabular records at Leyte'],
  gct: ['Greenwich civil time', 'us', 'test: a radio log kept in GCT'],
}
write('clocks.json', Object.entries(ids.clocks).map(([id, offset]) => ({ id, offset, name: CLOCK_NAMES[id][0], side: CLOCK_NAMES[id][1], used: CLOCK_NAMES[id][2], note: 'test fixture' })))

const sq = (lon, lat, dl, da) => [[lon, lat], [lon + dl, lat], [lon + dl, lat + da], [lon, lat + da], [lon, lat]]
write('fronts/manifest.json', {
  keyframes: FIX.keyframes.map((d) => ({ id: d, date: d, file: `fronts/${d}.geojson`, sources: [cite('test-source-pd', 'test map')], note: 'Test keyframe.' })),
  lines: 'fronts/lines.geojson',
})
write('fronts/1941-12-06.geojson', {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { state: 'held', name: 'test held land', precision: 'schematic', sources: [cite('test-source-pd')] }, geometry: { type: 'Polygon', coordinates: [ring(ISLANDS[2], 1.05, 48)] } },
    { type: 'Feature', properties: { state: 'contested', name: 'test contested region', precision: 'schematic', pointsAndLines: true, sources: [cite('test-source-pd')] }, geometry: { type: 'Polygon', coordinates: [sq(108, 20, 10, 8)] } },
    { type: 'Feature', properties: { state: 'allied', name: 'test allied land', precision: 'mapped', sources: [cite('test-source-pd')] }, geometry: { type: 'Polygon', coordinates: [ring(ISLANDS[3], 1.05, 48)] } },
    { type: 'Feature', properties: { kind: 'perimeter', name: 'test perimeter', sources: [cite('test-source-pd')] }, geometry: { type: 'LineString', coordinates: [[130, 30], [150, 30], [175, 25], [-178, 15], [-178, 0]] } },
  ],
})
write('fronts/1943-06-01.geojson', {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { state: 'held', name: 'test held land', precision: 'schematic', sources: [cite('test-source-pd')] }, geometry: { type: 'Polygon', coordinates: [ring(ISLANDS[2], 1.05, 48)] } },
    { type: 'Feature', properties: { state: 'contested', name: 'test contested island', precision: 'schematic', sources: [cite('test-source-pd')] }, geometry: { type: 'Polygon', coordinates: [ring(ISLANDS[3], 1.05, 48)] } },
    { type: 'Feature', properties: { kind: 'perimeter', name: 'test perimeter', sources: [cite('test-source-pd')] }, geometry: { type: 'LineString', coordinates: [[130, 25], [150, 25], [170, 15], [175, 0]] } },
  ],
})
write('fronts/lines.geojson', {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Test Perimeter, 1941', ja: '試験線', from: '1941-11-01', to: '1943-09-30', sources: [cite('test-source-pd')] }, geometry: { type: 'LineString', coordinates: [[95, 10], [120, 30], [160, 30], [-170, 20], [-175, -10]] } },
    { type: 'Feature', properties: { name: 'Test Line at 16° N', ja: '北緯十六度線（試験）', from: '1945-08-15', to: '1945-09-02', sources: [cite('test-source-pd')] }, geometry: { type: 'LineString', coordinates: [[100, 16], [110, 16]] } },
  ],
})

// --- places ---------------------------------------------------------------------
const pt = (lon, lat) => ({ type: 'Point', coordinates: [lon, lat] })
const PLACES = [
  { id: 'dateline-island', name: 'Dateline Island (test)', ja: { kanji: '日付変更線島', romaji: 'Hizuke-henkōsen-tō' }, alt: [], kind: 'island', today: null, geometry: pt(-179.95, 28.15), placePrecision: 'isl', held: [{ by: 'us', from: '1941-12-07', to: '1942-06-06', cutOff: null }, { by: 'jp', from: '1942-06-06', to: '1943-07-29', cutOff: '1943-02-01' }], sources: ['test-source-a'] },
  { id: 'test-atoll', name: 'Test Atoll', ja: null, alt: ['Test Reef'], kind: 'atoll', today: null, geometry: pt(179.1, 27.7), placePrecision: 'isl', held: [{ by: 'us', from: '1941-12-07', to: '1945-09-02', cutOff: null }], sources: ['test-source-a'] },
  { id: 'test-high-island', name: 'Test High Island', ja: { kanji: '試験島', romaji: 'Shiken-tō' }, alt: [], kind: 'island', today: 'Test High Island Today', geometry: { type: 'Polygon', coordinates: [ring(ISLANDS[2], 1, 24)] }, placePrecision: 'isl', held: [{ by: 'jp', from: '1931-09-18', to: '1944-08-10', cutOff: null }, { by: 'us', from: '1944-08-10', to: '1945-09-02', cutOff: null }], sources: ['test-source-a'] },
  { id: 'test-southern-island', name: 'Test Southern Island', ja: null, alt: [], kind: 'island', today: null, geometry: pt(157.5, -8.5), placePrecision: 'isl', held: [{ by: 'jp', from: '1942-05-03', to: '1943-02-09', cutOff: null }], sources: ['test-source-a'] },
  { id: 'test-anchorage', name: 'Test Anchorage', ja: null, alt: [], kind: 'harbour', today: null, geometry: pt(157.6, -8.2), placePrecision: 'ex', sources: ['test-source-a'] },
  { id: 'test-airfield', name: 'Test Airfield', ja: null, alt: [], kind: 'airfield', today: null, geometry: pt(139.62, 17.38), placePrecision: 'ex', sources: ['test-source-a'] },
  // (across 180°, written with raw longitudes either side: load.js makes it continuous)
  { id: 'test-sea-area', name: 'Test Sea Area', ja: null, alt: [], kind: 'sea-area', today: null, geometry: { type: 'Polygon', coordinates: [[[176, 20], [-176, 20], [-176, 32], [176, 32], [176, 20]]] }, placePrecision: 'sea', sources: ['test-source-a'] },
  { id: 'test-strait', name: 'Test Strait', ja: null, alt: [], kind: 'strait', today: null, geometry: pt(125, 5), placePrecision: 'loc', sources: ['test-source-a'] },
  { id: 'test-region', name: 'Test Region', ja: null, alt: [], kind: 'region', today: null, geometry: { type: 'Polygon', coordinates: [sq(110, 0, 10, 10)] }, placePrecision: 'reg', sources: ['test-source-a'] },
  { id: 'test-gulf', name: 'Test Gulf', ja: null, alt: [], kind: 'gulf', today: null, geometry: pt(118, 15), placePrecision: 'loc', sources: ['test-source-a'] },
  { id: 'test-city', name: 'Test City', ja: null, alt: [], kind: 'city', today: null, geometry: pt(-179.94, 28.18), placePrecision: 'ex', sources: ['test-source-a'] },
  { id: 'test-far-port', name: 'Test Far Port', ja: null, alt: [], kind: 'base', today: null, geometry: pt(100, 52), placePrecision: 'off', sources: ['test-source-a'] },
]
write('places.json', PLACES)

// --- events ---------------------------------------------------------------------
const ev = (id, o) => ({
  id,
  title: o.title,
  gloss: o.gloss ?? null,
  ja: o.ja ?? null,
  when: o.when,
  chapter: o.chapter,
  where: o.where,
  kind: o.kind,
  flag: o.flag ?? 'cards',
  tier: o.tier ?? 2,
  sides: o.sides ?? ['jp', 'us'],
  zoom: o.zoom ?? ['table'],
  box: o.box ?? null,
  summary: o.summary,
  stops: o.stops ?? [{ text: `Test stop for ${o.title}.`, place: o.where[0].place, zoom: 'table' }],
  sources: o.sources ?? [cite()],
  confidence: o.confidence ?? { date: 'firm', place: 'soft', numbers: 'soft' },
  tellings: o.tellings ?? [],
  routes: o.routes ?? [],
})
const EVENTS = [
  ev('test-prologue-event', { title: 'A test prologue event', kind: 'political', chapter: 'prologue', when: { from: '1937-07', precision: 'month', clock: 'jst' }, where: [{ place: 'test-region', role: 'in' }], summary: 'Test: an event in the prologue, dated to its month.' }),
  ev('test-dateline-raid', {
    title: 'A test raid across the date line',
    gloss: 'two dates for one morning',
    kind: 'raid',
    tier: 1,
    chapter: 'test-opening',
    when: { from: '1941-12-07T07:55-10:30', precision: 'minute', clock: 'hst-1941', alt: [{ clock: 'jst', from: '1941-12-08' }], zoneNote: 'Test: Hawaiian time is UTC−10:30; on Tokyo time the same morning is the next day.' },
    where: [{ place: 'test-atoll', role: 'target' }],
    summary: 'Test: an event whose two local dates differ, so its card shows one and its note the other.',
  }),
  ev('test-occupation', { title: 'A test occupation', kind: 'occupation', chapter: 'test-opening', when: { from: '1942-01-23', precision: 'day', clock: 'jst' }, where: [{ place: 'test-southern-island', role: 'in' }], summary: 'Test: an occupation dated to its day in Tokyo time.' }),
  ev('test-raid-jst', { title: 'A test raid on Tokyo time', kind: 'raid', chapter: 'test-opening', when: { from: '1942-04-18T12:30+09:00', precision: 'minute', clock: 'jst' }, where: [{ place: 'test-high-island', role: 'target' }], summary: 'Test: a raid timed to the minute in zone +09:00.' }),
  ev('test-box-battle', {
    title: 'The Test Box Battle',
    gloss: 'the fixture box',
    ja: { kanji: '試験海戦', romaji: 'Shiken kaisen' },
    kind: 'battle',
    flag: 'box',
    tier: 1,
    zoom: ['table', 'box'],
    box: 'test-box',
    chapter: 'test-middle',
    when: { from: '1942-06-04T04:30-12:00', to: '1942-06-04T18:00-12:00', precision: 'minute', clock: 'usn-zp12', zoneNote: 'Test: zone plus 12 is UTC−12 (ISO −12:00); Tokyo time is 21 hours ahead.' },
    where: [{ place: 'dateline-island', role: 'near' }, { place: 'test-sea-area', role: 'fleet' }],
    summary: 'Test: two made-up forces meet near Dateline Island. Nothing here is history.',
    stops: [
      { text: 'Test: the two forces converge on the table.', place: 'dateline-island', zoom: 'table' },
      { text: 'Test: the dive group over the test carrier.', zoom: 'box', t: '10:20', camera: { target: 'test-cv-a', bearing: 200, pitch: 0.45, distance: 4000 } },
      { text: 'Test: the battleships trade fire.', zoom: 'box', t: '11:40', camera: { target: [-179.9, 28.05], bearing: 90, pitch: 0.3, distance: 9000 } },
    ],
    tellings: [{ source: 'test-source-a', says: 'Test telling: between two and three hits on the test carrier.' }, { source: 'test-source-b', says: 'Test telling: three hits.' }],
    routes: ['test-fleet-route'],
  }),
  ev('test-sinking', { title: 'A test sinking', kind: 'sinking', chapter: 'test-middle', when: { from: '1942-06-05T02:55-12:00', precision: 'minute', clock: 'usn-zp12' }, where: [{ place: 'test-sea-area', role: 'at' }], summary: 'Test: a sinking timed to the minute in zone −12:00.' }),
  ev('test-landing', { title: 'A test landing', kind: 'landing', tier: 1, chapter: 'test-middle', when: { from: '1942-08-07', to: '1942-08-09', precision: 'day', clock: 'usn-zm11' }, where: [{ place: 'test-anchorage', role: 'landing' }], summary: 'Test: a landing over three days in zone +11:00.' }),
  ev('test-campaign', { title: 'A test campaign', kind: 'campaign', chapter: 'test-middle', when: { from: '1943-01', to: '1943-03', precision: 'month', clock: 'usn-zm11' }, where: [{ place: 'test-southern-island', role: 'in' }], summary: 'Test: a campaign dated to its months.', routes: ['test-air-route'] }),
  ev('test-atrocity', { title: 'A test card-only event', kind: 'atrocity', chapter: 'test-middle', when: { from: '1943-05-10', precision: 'day', clock: 'jst' }, where: [{ place: 'test-city', role: 'in' }], summary: 'Test: an event that is only ever a card, with no box and no stop below the table.' }),
  ev('test-bombing', { title: 'A test bombing', kind: 'bombing', chapter: 'test-end', when: { from: '1945-03-10', precision: 'day', clock: 'jst' }, where: [{ place: 'test-high-island', role: 'target' }], summary: 'Test: a card-only bombing dated to its day.', routes: ['test-campaign-route'] }),
  ev('test-political', { title: 'A test broadcast', kind: 'political', chapter: 'test-end', when: { from: '1945-08-15', precision: 'day', clock: 'jst' }, where: [{ place: 'test-far-port', role: 'in' }], summary: 'Test: a political event at a place off the table.' }),
  ev('test-surrender', { title: 'A test surrender', kind: 'surrender', tier: 1, chapter: 'test-end', when: { from: '1945-09-02T09:02+09:00', precision: 'minute', clock: 'jst' }, where: [{ place: 'test-gulf', role: 'at' }], summary: 'Test: a ceremony timed to the minute.' }),
]
write('events.json', EVENTS)
write('sources.json', SOURCES)

// --- routes ---------------------------------------------------------------------
write('routes.json', [
  {
    id: 'test-fleet-route',
    title: 'Test fleet track across the date line',
    gloss: 'the test force, from its noon positions',
    kind: 'fleet',
    side: 'jp',
    medium: 'sea',
    when: { from: '1942-05-27T06:00+09:00', to: '1942-06-04T10:00-12:00', precision: 'minute' },
    chapter: 'test-middle',
    event: 'test-box-battle',
    from: null,
    to: 'dateline-island',
    points: [[168, 35.5], [173.5, 33.6], [177.6, 31.2], [-179.6, 29.3], [-179.3, 28.4]],
    pointPrecision: 'report',
    direction: 'oneway',
    schematicSegments: [0],
    waypoints: [{ at: 0, t: '1942-05-27T06:00+09:00', note: 'Test noon position.' }, { at: 2, t: '1942-06-01T12:00+09:00', note: 'Test noon position.' }, { at: 4, t: '1942-06-04T10:00-12:00', note: 'Test: the box begins here.' }],
    summary: 'Test: a fleet route that crosses 180° with dated waypoints; its first leg is schematic.',
    sources: [cite('test-source-pd', 'test track chart')],
    confidence: { date: 'firm', place: 'soft', course: 'soft' },
    tellings: [],
  },
  {
    id: 'test-air-route',
    title: 'Test air route',
    gloss: 'flown again and again',
    kind: 'air',
    side: 'us',
    medium: 'air',
    when: { from: '1943-01', to: '1943-03', precision: 'month' },
    chapter: 'test-middle',
    event: 'test-campaign',
    from: 'test-airfield',
    to: 'test-anchorage',
    points: [[139.62, 17.38], [148, 8], [157.6, -8.2]],
    pointPrecision: 'narrative',
    direction: 'return',
    waypoints: [],
    summary: 'Test: an air route over land and sea, there and back.',
    sources: [cite()],
    confidence: { date: 'soft', place: 'soft', course: 'soft' },
    tellings: [],
  },
  {
    id: 'test-campaign-route',
    title: 'Test drive',
    gloss: 'a schematic arrow',
    kind: 'campaign',
    side: 'us',
    medium: 'sea',
    when: { from: '1943-11', to: '1944-08', precision: 'month' },
    chapter: 'test-middle',
    event: 'test-bombing',
    from: null,
    to: null,
    points: [[178, -6], [168, 4], [152, 13], [141, 19]],
    pointPrecision: 'schematic',
    direction: 'oneway',
    waypoints: [],
    summary: 'Test: a schematic campaign arrow, drawn dashed.',
    sources: [cite()],
    confidence: { date: 'soft', place: 'soft', course: 'soft' },
    tellings: [],
  },
])

// --- the test box ---------------------------------------------------------------
const B = FIX.boxes['test-box']
const boxProj = { kind: 'tangent', lon0: B.lon0, lat0: B.lat0, unit: 1 }
const bp = new TangentProjection(boxProj)
const [BW, BH] = B.size
const [bw, bs, be, bn] = B.bounds
const boxPack = heightPNG(BW, BH, (i, j) => [bw + ((i + 0.5) * (be - bw)) / BW, bn - ((j + 0.5) * (bn - bs)) / BH], 0.25, -11000)
write('boxes/test-box/height.png', boxPack.png)
const pl = placement({ id: 'test-box', projection: boxProj }, table)
const r = bp.rect(B.bounds)
const GLO = {
  id: 'glo-30',
  title: 'Copernicus DEM GLO-30',
  url: 'https://copernicus-dem-30m.s3.amazonaws.com/',
  fetched: 'test',
  licence: 'attribution',
  notice: 'produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved',
  liability: 'The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30',
}
const GMRT = { id: 'gmrt', title: 'Global Multi-Resolution Topography synthesis (Ryan et al. 2009)', url: 'https://www.gmrt.org/', licence: 'cc-by-4.0', credit: 'GMRT, CC BY 4.0, resampled and clamped' }
write('boxes/manifest.json', {
  test: true,
  boxes: [
    {
      id: 'test-box',
      name: 'Test box',
      event: 'test-box-battle',
      bounds: B.bounds,
      size: B.size,
      metresPerTexel: [+((r.x1 - r.x0) / BW).toFixed(2), +((r.z1 - r.z0) / BH).toFixed(2)],
      projection: boxProj,
      placement: { centre: pl.centre.map((v) => +v.toFixed(4)), jacobian: pl.J.map((row) => row.map((v) => +v.toPrecision(9))), convergenceDeg: +pl.convergenceDeg.toFixed(3) },
      height: { file: 'boxes/test-box/height.png', scale: 0.25, offset: -11000 },
      exaggeration: B.exaggeration,
      sea: 'gmrt',
      battle: 'boxes/test-box/battle.json',
      stats: boxPack.stats,
      sources: [GLO, GMRT],
      credit: 'Test fixture: made-up terrain (tools/fake-data.mjs). The real boxes carry: Terrain produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved. Sea floor: GMRT (Ryan et al. 2009), CC BY 4.0, resampled.',
    },
  ],
})

const fix = (t, lonlat, courseDeg, speedKn, precision, more = {}) => ({ t, lonlat, courseDeg, speedKn, precision, source: 'test-source-a', ...more })
write('boxes/test-box/battle.json', {
  id: 'test-box',
  event: 'test-box-battle',
  title: 'The Test Box Battle, 4 June 1942 (test)',
  ja: { kanji: '試験海戦', romaji: 'Shiken kaisen' },
  clock: {
    id: B.clock.id,
    zone: B.clock.zone,
    name: B.clock.name,
    from: '1942-06-04T04:00-12:00',
    to: '1942-06-04T18:00-12:00',
    others: [
      { id: 'jst', name: 'Tokyo time', zone: '+09:00', rule: 'add 21 hours: the Tokyo date is a day on' },
      { id: 'usn-zp10', name: 'the test carriers’ clocks (zone +10)', zone: '-10:00', rule: 'take 2 hours off' },
    ],
    note: 'Test clock: zone plus 12 (UTC−12).',
  },
  weather: {
    wind: { fromDeg: 135, kn: 7 },
    sea: 2,
    swellM: 1,
    cloud: { baseM: 600, topsM: 1500, cover: 0.3 },
    visibilityM: 40000,
    squalls: [{ from: '07:00', to: '09:30', polygon: [[179.2, 27.85], [179.45, 27.85], [179.45, 28.05], [179.2, 28.05], [179.2, 27.85]] }],
  },
  sides: { japan: { name: 'Test Japanese force', ja: '試験部隊' }, usa: { name: 'Test American force' } },
  units: [
    {
      id: 'test-cv-a',
      kit: 'test-cv-jp',
      side: 'jp',
      name: 'Test Carrier A',
      ja: '試験空母甲',
      group: 'test-cardiv',
      track: [
        fix('04:00', [179.25, 28.25], 135, 24, 'report', { sourceClock: '0100', sourceZone: '+09:00', sourceDate: '1942-06-05', sourceNote: 'test: the Tokyo-time reading' }),
        fix('10:00', [179.5, 28.02], 120, 26, 'chart', { sourceNote: 'test: read off a test chart, ±5′' }),
        fix('18:00', [179.62, 27.96], 90, 2, 'narrative'),
      ],
      events: [
        { t: '10:24', kind: 'hit', by: 'test-vb', count: [2, 3], where: 'amidships', damage: 0.6, sources: [cite()], tellings: [{ source: 'test-source-b', says: 'Test telling: three hits.' }] },
        { t: '10:25', kind: 'fire', sources: [cite()] },
        { t: '16:30', kind: 'sinks', text: 'Test Carrier A sinks.', sources: [cite()] },
      ],
      fate: { kind: 'sunk', t: '16:30' },
    },
    { id: 'test-bb-a', kit: 'test-bb-jp', side: 'jp', name: 'Test Battleship A', ja: '試験戦艦甲', group: 'test-cardiv', station: { guide: 'test-cv-a', bearingDeg: 45, rangeM: 3000 }, events: [{ t: '11:40', kind: 'hit', by: 'test-bb-b', count: [1, 2], where: 'forward turret', damage: 0.2, sources: [cite()] }] },
    { id: 'test-dd-a', kit: 'test-dd-jp', side: 'jp', name: 'Test Destroyer A', ja: '試験駆逐艦甲', group: 'test-cardiv', station: { guide: 'test-cv-a', bearingDeg: 200, rangeM: 2500 } },
    {
      id: 'test-cv-b',
      kit: 'test-cv-us',
      side: 'us',
      name: 'Test Carrier B',
      group: 'test-tf',
      track: [fix('04:00', [-179.75, 28.35], 220, 20, 'report'), fix('12:00', [179.98, 28.12], 250, 25, 'report'), fix('18:00', [-179.98, 28.02], 90, 15, 'schematic')],
      events: [
        { t: '07:06', kind: 'launches', by: 'test-vb', sources: [cite()] },
        { t: '07:30', kind: 'launches', by: 'test-vt', sources: [cite()] },
      ],
    },
    { id: 'test-bb-b', kit: 'test-bb-us', side: 'us', name: 'Test Battleship B', group: 'test-tf', station: { guide: 'test-cv-b', bearingDeg: 270, rangeM: 3500 }, events: [{ t: '11:30', kind: 'opens-fire', by: 'test-bb-b', sources: [cite()] }] },
    { id: 'test-dd-b', kit: 'test-dd-us', side: 'us', name: 'Test Destroyer B', group: 'test-tf', station: { guide: 'test-cv-b', bearingDeg: 0, rangeM: 2000 } },
  ],
  groups: [
    {
      id: 'test-vb',
      kit: 'test-dive-us',
      side: 'us',
      name: 'Test Dive Group',
      count: 6,
      from: 'test-cv-b',
      launch: '07:06',
      altM: 5000,
      route: [{ t: '08:30', lonlat: [179.95, 27.7], altM: 5000 }, { t: '10:00', lonlat: [179.4, 27.85], altM: 5000 }],
      attack: { t: '10:22', target: 'test-cv-a', profile: 'dive', fromDeg: 200, pushOverM: 4500, releaseM: 600 },
      losses: [[1, 2]],
      recover: { t: '11:50', to: 'test-cv-b' },
      sources: [cite()],
    },
    { id: 'test-cap', kit: 'test-fighter-jp', side: 'jp', name: 'Test CAP', count: 4, from: 'test-cv-a', launch: '09:50', attack: { t: '10:05', profile: 'cap', altM: 300, target: 'test-vt' }, sources: [cite()] },
    { id: 'test-vt', kit: 'test-torpedo-us', side: 'us', name: 'Test Torpedo Group', count: 4, from: 'test-cv-b', launch: '07:30', altM: 1500, attack: { t: '10:05', target: 'test-cv-a', profile: 'torpedo', fromDeg: 120 }, losses: [[2, 4]], sources: [cite()] },
  ],
  stops: [
    { t: '09:00', text: 'Test stop: the two forces before the strike.', camera: { target: 'test-cv-a', bearingDeg: 160, pitch: 0.5, distanceM: 12000 } },
    { t: '10:20', text: 'Test stop: the dive group over the test carrier.', camera: { target: 'test-cv-a', bearingDeg: 200, pitch: 0.5, distanceM: 6000 } },
    { t: '11:40', text: 'Test stop: the battleships trade fire.', camera: { target: [-179.9, 28.05], bearingDeg: 90, pitch: 0.3, distanceM: 9000 } },
  ],
  moments: [
    {
      id: 'test-dive',
      title: 'Test: the dive group pushes over',
      ja: null,
      role: { kind: 'aircraft', kit: 'test-dive-us', side: 'us', group: 'test-vb', name: 'a dive bomber of the test group' },
      t: '10:21:30',
      durationS: 180,
      timeScale: 1,
      start: { from: 'test-cv-a', bearingDeg: 200, rangeM: 3000, altM: 4500, speedMs: 70, headingDeg: 20 },
      objective: { kind: 'dive', target: 'test-cv-a', text: 'Test: put a bomb on the test carrier’s deck.' },
      beats: [{ t: '10:22:00', text: 'Test beat: the first section pushes over.' }, { t: '10:24:00', text: 'Test beat: the test carrier is burning.' }],
      record: { hits: [{ unit: 'test-cv-a', count: [2, 3], window: ['10:22', '10:26'] }] },
      after: { text: 'Test after-card: the record gives the test group two or three hits.', sources: [cite()], tellings: [] },
    },
    {
      id: 'test-gunnery',
      title: 'Test: a gunnery duel',
      ja: null,
      role: { kind: 'ship', unit: 'test-bb-b', side: 'us' },
      t: '11:30',
      durationS: 600,
      timeScale: 2,
      objective: { kind: 'gunnery', target: 'test-bb-a', text: 'Test: engage the test battleship.' },
      beats: [{ t: '11:31:00', text: 'Test beat: the first salvo.' }],
      record: { hits: [{ unit: 'test-bb-a', count: [1, 2], window: ['11:30', '11:50'] }] },
      after: { text: 'Test after-card: the record gives one or two hits.', sources: [cite()], tellings: [] },
    },
    {
      id: 'test-torpedo-run',
      title: 'Test: a torpedo run',
      ja: null,
      role: { kind: 'ship', unit: 'test-dd-b', side: 'us' },
      t: '12:00',
      durationS: 300,
      timeScale: 3,
      objective: { kind: 'torpedo', target: 'test-bb-a', text: 'Test: run in and fire a spread at the test battleship.' },
      beats: [{ t: '12:02:00', text: 'Test beat: the run begins.' }],
      record: { hits: [] },
      after: { text: 'Test after-card: the record gives no torpedo hits.', sources: [cite()], tellings: [] },
    },
  ],
  sources: [cite()],
})

// --- kits -----------------------------------------------------------------------
const ship = (id, o) => ({
  id,
  class: o.class,
  type: FIX.kits.ships[id].type,
  side: FIX.kits.ships[id].side,
  ships: o.ships,
  loa: o.loa,
  beam: o.beam,
  draught: o.draught,
  displacement: o.displacement,
  speedKn: o.speedKn,
  turn: o.turn,
  hull: o.hull,
  blocks: o.blocks,
  guns: o.guns,
  aa: o.aa,
  torpedoes: o.torpedoes ?? null,
  armour: o.armour,
  fatal: o.fatal,
  ...(o.aircraft ? { aircraft: o.aircraft } : {}),
  colour: o.colour,
  silhouette: { source: 'test-source-a', where: 'test plate' },
  sources: [cite()],
  notes: 'Test kit: made-up numbers that use the block vocabulary.',
})
const gun = (role, calibreMm, turrets, barrels, at, extra = {}) => ({ role, calibreMm, turrets, mounts: turrets, barrels, at, side: 'centre', rangeM: calibreMm * 120, rofRpm: calibreMm > 300 ? 1.5 : calibreMm > 150 ? 4 : 12, shellKg: Math.round((calibreMm / 10) ** 3 / 40), mvMs: 800, traverseDegS: calibreMm > 300 ? 3 : 8, elevationDeg: [-5, calibreMm > 150 ? 40 : 75], ...extra })
write('kits/ships.json', [
  ship('test-cv-jp', {
    class: 'Test carrier (Japanese)',
    ships: ['Test Carrier A 試験空母甲'],
    loa: 250, beam: 32, draught: 9.5, displacement: { standard: 38000, full: 42000 }, speedKn: 28, turn: { tacticalDiameterM: 900, rudderS: 12 },
    hull: { bow: 'straight', sheer: 0.5, freeboard: [14, 11], stern: 'cruiser' },
    blocks: [
      { kind: 'hull-extension', at: [0.0, 0.05], w: 20, h: 2 },
      { kind: 'flight-deck', at: [0.02, 1.0], w: 30.5, h: 1.2 },
      { kind: 'hangar', at: [0.1, 0.9], w: 24, h: 6 },
      { kind: 'island', at: 0.42, side: 'port', w: 6, l: 16, h: 9 },
      { kind: 'funnel', shape: 'downturned', at: 0.5, side: 'starboard', h: 8 },
      { kind: 'crane', at: 0.55, side: 'starboard', h: 6 },
      { kind: 'boat-deck', at: [0.6, 0.7], side: 'starboard', w: 4, h: 2 },
    ],
    guns: [gun('main', 200, 0, 1, [0.6, 0.65, 0.7], { side: 'both', mounts: 6 })],
    aa: [{ kind: '127mm', mounts: 6, barrels: 2 }, { kind: '25mm', mounts: 10, barrels: 2 }],
    armour: { beltMm: 152, deckMm: 38 }, fatal: 0.8, aircraft: 70,
    colour: { hull: 'ijn-kure-grey', deck: 'wood', measure: null, deckMarking: 'hinomaru-forward' },
  }),
  ship('test-bb-jp', {
    class: 'Test battleship (Japanese)',
    ships: ['Test Battleship A 試験戦艦甲'],
    loa: 222, beam: 31, draught: 9.7, displacement: { standard: 36000, full: 39000 }, speedKn: 30, turn: { tacticalDiameterM: 1100, rudderS: 15 },
    hull: { bow: 'clipper', sheer: 0.7, freeboard: [9, 6], stern: 'round' },
    blocks: [
      { kind: 'turret', shape: 'twin', at: 0.2, w: 11, h: 4 },
      { kind: 'turret', shape: 'twin', at: 0.27, w: 11, h: 5 },
      { kind: 'pagoda', shape: 'tall', at: 0.36, w: 10, h: 32 },
      { kind: 'director', at: 0.37, w: 4, h: 3 },
      { kind: 'funnel', shape: 'trunked', at: 0.48, h: 12 },
      { kind: 'tripod-mast', at: 0.58, h: 22 },
      { kind: 'casemate', at: [0.3, 0.55], side: 'both', w: 2, h: 3 },
      { kind: 'catapult', at: 0.72, side: 'starboard', l: 19, h: 1 },
      { kind: 'crane', at: 0.74, h: 8 },
      { kind: 'turret', shape: 'twin', at: 0.78, w: 11, h: 4 },
    ],
    guns: [gun('main', 356, 3, 2, [0.2, 0.27, 0.78]), gun('secondary', 152, 0, 1, [0.3, 0.4, 0.5], { side: 'both', mounts: 8 })],
    aa: [{ kind: '127mm', mounts: 4, barrels: 2 }, { kind: '25mm', mounts: 10, barrels: 2 }],
    armour: { beltMm: 203, deckMm: 70 }, fatal: 0.9,
    colour: { hull: 'ijn-kure-grey', deck: 'wood', measure: null, deckMarking: null },
  }),
  ship('test-dd-jp', {
    class: 'Test destroyer (Japanese)',
    ships: ['Test Destroyer A 試験駆逐艦甲'],
    loa: 118, beam: 10.8, draught: 3.8, displacement: { standard: 2000, full: 2500 }, speedKn: 35, turn: { tacticalDiameterM: 600, rudderS: 8 },
    hull: { bow: 'raked', sheer: 0.9, freeboard: [7, 4], stern: 'cruiser' },
    blocks: [
      { kind: 'turret', shape: 'twin', at: 0.12, w: 5, h: 3 },
      { kind: 'bridge', at: 0.22, w: 7, l: 8, h: 7 },
      { kind: 'funnel', shape: 'round', at: 0.38, h: 6 },
      { kind: 'pole-mast', at: 0.3, h: 14 },
      { kind: 'deckhouse', at: [0.5, 0.6], w: 6, h: 3 },
      { kind: 'funnel', shape: 'round', at: 0.55, h: 5 },
      { kind: 'turret', shape: 'twin', at: 0.8, w: 5, h: 3 },
    ],
    guns: [gun('main', 127, 2, 2, [0.12, 0.8])],
    aa: [{ kind: '25mm', mounts: 4, barrels: 2 }],
    torpedoes: { tubes: 2, barrels: 4, type: 'type-93' },
    armour: { beltMm: 0, deckMm: 0 }, fatal: 0.55,
    colour: { hull: 'ijn-kure-grey', deck: 'linoleum', measure: null, deckMarking: null },
  }),
  ship('test-cv-us', {
    class: 'Test carrier (American)',
    ships: ['Test Carrier B'],
    loa: 246, beam: 25, draught: 7.9, displacement: { standard: 20000, full: 25500 }, speedKn: 32, turn: { tacticalDiameterM: 800, rudderS: 11 },
    hull: { bow: 'straight', sheer: 0.4, freeboard: [12, 10], stern: 'transom' },
    blocks: [
      { kind: 'flight-deck', at: [0.03, 0.98], w: 26, h: 1.2 },
      { kind: 'hangar', at: [0.1, 0.9], w: 22, h: 6 },
      { kind: 'island', at: 0.45, side: 'starboard', w: 5, l: 30, h: 10 },
      { kind: 'tower', at: 0.45, side: 'starboard', w: 4, h: 8 },
      { kind: 'funnel', shape: 'trunked', at: 0.5, side: 'starboard', h: 7 },
      { kind: 'director', at: 0.44, side: 'starboard', w: 3, h: 2 },
    ],
    guns: [gun('main', 127, 0, 1, [0.1, 0.9], { side: 'both', mounts: 8 })],
    aa: [{ kind: '28mm', mounts: 4, barrels: 4 }, { kind: '20mm', mounts: 24, barrels: 1 }],
    armour: { beltMm: 102, deckMm: 38 }, fatal: 0.8, aircraft: 80,
    colour: { hull: 'ms-21-navy-blue', deck: 'blue-stain', measure: 'ms-21', deckMarking: null },
  }),
  ship('test-bb-us', {
    class: 'Test battleship (American)',
    ships: ['Test Battleship B'],
    loa: 222, beam: 33, draught: 10.8, displacement: { standard: 36600, full: 44800 }, speedKn: 28, turn: { tacticalDiameterM: 1000, rudderS: 16 },
    hull: { bow: 'clipper', sheer: 0.3, freeboard: [10, 6], stern: 'transom' },
    blocks: [
      { kind: 'turret', shape: 'triple', at: 0.2, w: 13, h: 5 },
      { kind: 'turret', shape: 'triple', at: 0.28, w: 13, h: 6 },
      { kind: 'tower', at: 0.37, w: 9, h: 24 },
      { kind: 'pagoda', shape: 'short', at: 0.38, w: 6, h: 10 },
      { kind: 'cage-mast', at: 0.6, h: 26 },
      { kind: 'funnel', shape: 'raked', at: 0.47, h: 13 },
      { kind: 'director', at: 0.36, w: 4, h: 3 },
      { kind: 'catapult', at: 0.92, side: 'starboard', l: 20, h: 1 },
      { kind: 'turret', shape: 'triple', at: 0.78, w: 13, h: 5 },
    ],
    guns: [gun('main', 406, 3, 3, [0.2, 0.28, 0.78]), gun('secondary', 127, 10, 2, [0.35, 0.4, 0.45, 0.5, 0.55], { side: 'both' })],
    aa: [{ kind: '28mm', mounts: 4, barrels: 4 }, { kind: '20mm', mounts: 20, barrels: 1 }],
    armour: { beltMm: 305, deckMm: 140 }, fatal: 0.92,
    colour: { hull: 'blue-grey', deck: 'blue-stain', measure: 'ms-22', deckMarking: null },
  }),
  ship('test-dd-us', {
    class: 'Test destroyer (American)',
    ships: ['Test Destroyer B'],
    loa: 114.8, beam: 12, draught: 4.2, displacement: { standard: 2050, full: 2900 }, speedKn: 36, turn: { tacticalDiameterM: 650, rudderS: 8 },
    hull: { bow: 'raked', sheer: 0.2, freeboard: [6.5, 4], stern: 'round' },
    blocks: [
      { kind: 'turret', shape: 'single', at: 0.1, w: 4, h: 3 },
      { kind: 'turret', shape: 'single', at: 0.16, w: 4, h: 3.5 },
      { kind: 'bridge', at: 0.25, w: 7, l: 9, h: 8 },
      { kind: 'director', at: 0.26, w: 3, h: 2 },
      { kind: 'pole-mast', at: 0.3, h: 16 },
      { kind: 'funnel', shape: 'round', at: 0.4, h: 6 },
      { kind: 'funnel', shape: 'raked', at: 0.52, h: 6 },
      { kind: 'deckhouse', at: [0.6, 0.7], w: 6, h: 3 },
      { kind: 'turret', shape: 'single', at: 0.82, w: 4, h: 3 },
    ],
    guns: [gun('main', 127, 5, 1, [0.1, 0.16, 0.7, 0.76, 0.82])],
    aa: [{ kind: '40mm', mounts: 5, barrels: 2 }, { kind: '20mm', mounts: 7, barrels: 1 }],
    torpedoes: { tubes: 2, barrels: 5, type: 'mark-15' },
    armour: { beltMm: 0, deckMm: 0 }, fatal: 0.55,
    colour: { hull: 'ms-21-navy-blue', deck: 'blue-stain', measure: 'ms-21', deckMarking: null },
  }),
])

const aircraft = (id, o) => ({
  id,
  name: o.name,
  ja: o.ja ?? null,
  type: FIX.kits.aircraft[id].type,
  side: FIX.kits.aircraft[id].side,
  crew: o.crew,
  span: o.span,
  length: o.length,
  height: o.height,
  weightKg: o.weightKg,
  engine: o.engine,
  speedKmh: o.speedKmh,
  climbMs: o.climbMs,
  ceilingM: o.ceilingM,
  rangeKm: o.rangeKm,
  enduranceS: o.enduranceS,
  fatal: 1.0,
  handling: o.handling,
  guns: o.guns,
  payload: o.payload,
  torpedo: o.torpedo ?? null,
  shape: o.shape,
  colours: o.colours,
  sources: [cite()],
})
write('kits/aircraft.json', [
  aircraft('test-fighter-jp', {
    name: 'Test fighter (Japanese)', ja: '試験戦闘機', crew: 1, span: 12, length: 9.1, height: 3.1, weightKg: { empty: 1700, loaded: 2400 },
    engine: { kind: 'radial', hp: 950 }, speedKmh: { max: 530, atAltM: 4500, seaLevel: 450, cruise: 330, stall: 110, diveLimit: 630 },
    climbMs: 15, ceilingM: 10000, rangeKm: 3000, enduranceS: 2400, handling: { rollDegS: 70, turnS: 14, note: 'test: light and agile, stiff ailerons at speed' },
    guns: [{ calibreMm: 7.7, count: 2, position: 'nose', rounds: 500 }, { calibreMm: 20, count: 2, position: 'wing', rounds: 60 }], payload: [],
    shape: { wing: 'low', tail: 'single', canopy: 'long-frame', gear: 'retract', cowl: 'radial', dihedral: 6 },
    colours: [{ from: '1941-12', to: '1943-06', upper: 'ijn-ameiro', lower: 'ijn-ameiro', insignia: 'hinomaru' }, { from: '1943-06', to: '1945-09', upper: 'ijn-green', lower: 'ijn-grey', insignia: 'hinomaru-white-surround' }],
  }),
  aircraft('test-dive-us', {
    name: 'Test dive bomber (American)', crew: 2, span: 12.7, length: 10.1, height: 4.1, weightKg: { empty: 2900, loaded: 4250 },
    engine: { kind: 'radial', hp: 1000 }, speedKmh: { max: 400, atAltM: 4900, seaLevel: 365, cruise: 300, stall: 125, diveLimit: 560 },
    climbMs: 6.5, ceilingM: 7800, rangeKm: 1800, enduranceS: 1800, handling: { rollDegS: 60, turnS: 24, note: 'test: dive flaps hold a steep dive' },
    guns: [{ calibreMm: 12.7, count: 2, position: 'nose', rounds: 360 }, { calibreMm: 7.62, count: 2, position: 'rear', rounds: 2000 }], payload: [{ kind: 'bomb', massKg: 454, count: 1 }],
    shape: { wing: 'low', tail: 'single', canopy: 'long-frame', gear: 'retract', cowl: 'radial', dihedral: 8 },
    colours: [{ from: '1941-12', to: '1942-05', upper: 'blue-grey', lower: 'light-grey', insignia: 'star-red-centre' }, { from: '1942-05', to: '1943-06', upper: 'blue-grey', lower: 'light-grey', insignia: 'star-no-red' }],
  }),
  aircraft('test-torpedo-us', {
    name: 'Test torpedo bomber (American)', crew: 3, span: 16.5, length: 12.2, height: 4.7, weightKg: { empty: 4800, loaded: 7200 },
    engine: { kind: 'radial', hp: 1700 }, speedKmh: { max: 440, atAltM: 3700, seaLevel: 380, cruise: 245, stall: 125, diveLimit: 500 },
    climbMs: 6, ceilingM: 6800, rangeKm: 1600, enduranceS: 1800, handling: { rollDegS: 40, turnS: 30, note: 'test: heavy, steady' },
    guns: [{ calibreMm: 12.7, count: 1, position: 'turret', rounds: 400 }], payload: [{ kind: 'torpedo', massKg: 900, count: 1 }],
    torpedo: { type: 'mark-13', dropSpeedKn: 110, dropAltM: 30, armRunM: 300 },
    shape: { wing: 'mid', tail: 'single', canopy: 'bubble', gear: 'retract', cowl: 'radial', dihedral: 5 },
    colours: [{ from: '1943-06', to: '1943-09', upper: 'blue-grey', lower: 'light-grey', insignia: 'star-bar-red-outline' }, { from: '1943-09', to: '1945-09', upper: 'sea-blue', lower: 'white', insignia: 'star-bar-blue' }],
  }),
  aircraft('test-patrol-us', {
    name: 'Test flying boat (American)', crew: 8, span: 31.7, length: 19.5, height: 6.2, weightKg: { empty: 9500, loaded: 16000 },
    engine: { kind: 'radial', hp: 1200 }, speedKmh: { max: 315, atAltM: 2000, seaLevel: 280, cruise: 200, stall: 105, diveLimit: 380 },
    climbMs: 5, ceilingM: 4800, rangeKm: 4000, enduranceS: 3600, handling: { rollDegS: 15, turnS: 60, note: 'test: slow to answer' },
    guns: [{ calibreMm: 7.62, count: 3, position: 'nose', rounds: 1000 }], payload: [{ kind: 'bomb', massKg: 227, count: 4 }],
    shape: { wing: 'parasol', tail: 'twin', canopy: 'cockpit', gear: 'fixed', cowl: 'radial', dihedral: 0 },
    colours: [{ from: '1941-12', to: '1945-09', upper: 'blue-grey', lower: 'light-grey', insignia: 'star-no-red' }],
  }),
  aircraft('test-bomber-us', {
    name: 'Test heavy bomber', crew: 10, span: 31.6, length: 22.7, height: 5.8, weightKg: { empty: 15000, loaded: 24000 },
    engine: { kind: 'inline', hp: 1200 }, speedKmh: { max: 460, atAltM: 7600, seaLevel: 380, cruise: 290, stall: 140, diveLimit: 500 },
    climbMs: 4, ceilingM: 11000, rangeKm: 3200, enduranceS: 3600, handling: { rollDegS: 12, turnS: 70, note: 'test: a heavy bomber' },
    guns: [{ calibreMm: 12.7, count: 10, position: 'turret', rounds: 500 }], payload: [{ kind: 'bomb', massKg: 227, count: 8 }],
    shape: { wing: 'high', tail: 'single', canopy: 'short-frame', gear: 'retract', cowl: 'inline', dihedral: 4 },
    colours: [{ from: '1941-12', to: '1942-06', upper: 'olive-drab', lower: 'neutral-grey', insignia: 'roundel-raaf' }, { from: '1942-06', to: '1945-09', upper: 'olive-drab', lower: 'neutral-grey', insignia: 'roundel-rnzaf' }],
  }),
])

console.log(`test-data written to ${out}`)
console.log(`  table ${TW}×${TH} at ${texel.toFixed(3)} km, extent ${extent.join(', ')}, land ${(tablePack.stats.landFraction * 100).toFixed(1)} %, ${tablePack.stats.minMetres} to ${tablePack.stats.maxMetres} m`)
console.log(`  test-box ${BW}×${BH}, land ${(boxPack.stats.landFraction * 100).toFixed(1)} %, ${boxPack.stats.minMetres} to ${boxPack.stats.maxMetres} m; placement centre ${pl.centre.map((v) => v.toFixed(1)).join(', ')} km, convergence ${pl.convergenceDeg.toFixed(2)}°`)
console.log(`  ${PLACES.length} places, ${EVENTS.length} events, ${SOURCES.length} sources, ${LABELS.length} labels, ${coastFeatures.length} coast polygons`)
