// Dev-only: a small synthetic dataset in exactly the shape DATA.md describes,
// for working on the app before (or without) the real bake. Three made-up
// islands where Oʻahu, Maui and Hawaiʻi sit, an archipelago pack over the lot,
// wedge-shaped moku and ahupuaʻa, and a handful of eras, polities, places and
// events that are plainly labelled as tests. Nothing here is history.
//
//   node tools/fake-data.mjs [outdir]          (default: test-data/)
//   node tools/fake-data.mjs --flat-sea        (sea as a flat -1 m, as a bake
//                                               without bathymetry writes it)
//
// Then load the app with ?data=../test-data/ (built) or ?data=./test-data/ (dev).
//
// It also writes test patches (DATA.md "Patches, on any pack"), a raise and a
// lower with soft edges, one of them at a smaller size than its pack: for the
// made-up Oʻahu in test-data/patches/, and, when the real bake is in
// public/data/, for the real Oʻahu pack and the Nuʻuanu district in
// test-data/real/patches/ (load the app with ?patches=../test-data/real/;
// tools/smoke.mjs loads them itself). They are shapes for trying the patch
// path, placed where a harbour's dredging and a reef's filling would be, and
// not a record of either.
//
// And two test districts over the made-up Oʻahu (test-data/districts/), a
// stand-in for Nuʻuanu and a Koʻolaupoko drawn at c. 1700, 1850 and now,
// overlapping where the pali is; era layers and zoning for the test Oʻahu
// (test-data/layers/); a coda era that reaches the present, and
// coda events whose near stops come down into Koʻolaupoko. Shapes on the
// made-up shore for trying those paths (tools/smoke.mjs with DATA=fake).
//
// And test works (DATA.md "Works, dated"; test-data/works/): a base with
// its land growing in across its construction, a runway, a pier and two
// blocks; a range; a base returned; an airfield with a runway and a hangar's
// footprint; an interstate built over nine years and a state road through a
// tunnel; a railway lifted in 1947; a breakwater. And, when the real bake is
// in public/data/, a few of the same over the real Oʻahu
// (test-data/real/works/: a runway at Mōkapu, roads through Nuʻuanu), for
// the smoke to lay on the lidar. Shapes, not a record of any of them.
import { deflateSync } from 'node:zlib'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flatSea = args.includes('--flat-sea')
const out = args.find((a) => !a.startsWith('--')) || join(root, 'test-data')

// --- PNG, 8-bit, RGB or grey, no filtering ------------------------------------
const CRC = new Int32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  CRC[n] = c
}
const crc32 = (buf) => {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function writePNG(path, w, h, px, channels) {
  const row = w * channels
  const raw = Buffer.alloc((row + 1) * h)
  for (let y = 0; y < h; y++) Buffer.from(px.buffer, px.byteOffset + y * row, row).copy(raw, y * (row + 1) + 1)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = channels === 3 ? 2 : 0
  writeFileSync(path, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]))
}

// --- projection (DATA.md §1), in km -------------------------------------------
const LAT0 = 20.5
const LON0 = -157.5
const DEG = Math.PI / 180
const KX = Math.cos(LAT0 * DEG) * 111.32
const KZ = 110.574
const xkm = (lon) => (lon - LON0) * KX
const zkm = (lat) => -(lat - LAT0) * KZ
const lonOf = (x) => x / KX + LON0
const latOf = (z) => -z / KZ + LAT0

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

// --- the made-up islands: shield domes, softly maxed, cut by radial valleys -----
const ISLANDS = [
  {
    id: 'oahu',
    name: 'Test ʻĀina Komohana',
    domes: [
      { lon: -158.14, lat: 21.47, H: 1150, R: 15, ax: 2.0, rot: -35 },
      // (long enough to carry the test districts' boxes, Nuʻuanu's and
      // Koʻolaupoko's, with a windward shore through the second and a
      // coastal plain below it)
      { lon: -157.798, lat: 21.37, H: 950, R: 23, ax: 2.4, rot: -45, plain: true },
    ],
    moku: ['Waialua', 'Koʻolauloa', 'Koʻolaupoko', 'Kona', 'ʻEwa', 'Waiʻanae'],
  },
  {
    id: 'maui',
    name: 'Test ʻĀina Waena',
    domes: [
      { lon: -156.6, lat: 20.88, H: 1700, R: 11, ax: 1.2, rot: 10 },
      { lon: -156.25, lat: 20.71, H: 3050, R: 24, ax: 1.15, rot: -20 },
    ],
    moku: ['Kāʻanapali', 'Wailuku', 'Hāmākualoa', 'Koʻolau', 'Hāna', 'Kahikinui', 'Honuaʻula', 'Lahaina'],
  },
  {
    id: 'hawaii',
    name: 'Test ʻĀina Hikina',
    domes: [
      { lon: -155.47, lat: 19.82, H: 4200, R: 40, ax: 1.1, rot: 0 },
      { lon: -155.6, lat: 19.47, H: 4150, R: 50, ax: 1.3, rot: 30 },
      { lon: -155.82, lat: 20.1, H: 1650, R: 18, ax: 1.5, rot: -30 },
      { lon: -155.87, lat: 19.69, H: 2500, R: 20, ax: 1.1, rot: 0 },
      { lon: -155.15, lat: 19.38, H: 1200, R: 22, ax: 1.4, rot: -60 },
    ],
    moku: ['Kohala', 'Hāmākua', 'Hilo', 'Puna', 'Kaʻū', 'Kona'],
  },
]
const FLOOR = -4800
for (const isl of ISLANDS) {
  for (const d of isl.domes) {
    d.x = xkm(d.lon)
    d.z = zkm(d.lat)
    d.c = Math.cos(d.rot * DEG)
    d.s = Math.sin(d.rot * DEG)
  }
  let w = 0
  isl.cx = 0
  isl.cz = 0
  for (const d of isl.domes) {
    const k = d.H * d.R * d.R
    isl.cx += d.x * k
    isl.cz += d.z * k
    w += k
  }
  isl.cx /= w
  isl.cz /= w
}
const ALL = ISLANDS.flatMap((i) => i.domes.map((d) => ({ ...d, island: i })))

/** Metres above sea level at (x, z) km. */
function heightAt(x, z) {
  // a soft max of the domes (log-sum-exp, ~300 m wide), so saddles form
  let s = 0
  let near = null
  let best = -Infinity
  const wx = x + (fbm(x * 0.05, z * 0.05, 3, 3) - 0.5) * 9
  const wz = z + (fbm(x * 0.05 + 9, z * 0.05, 7, 3) - 0.5) * 9
  for (const d of ALL) {
    const dx = wx - d.x
    const dz = wz - d.z
    const a = (dx * d.c - dz * d.s) / d.ax
    const b = dx * d.s + dz * d.c
    const u = Math.hypot(a, b) / d.R
    const h = FLOOR + (d.H - FLOOR) * Math.exp(-Math.pow(u, 1.5))
    s += Math.exp((h - 1000) / 300)
    if (h > best) {
      best = h
      near = d
    }
  }
  let h = 1000 + 300 * Math.log(s)
  if (h > -200 && near) {
    // valleys radiating from the summit, deeper and more of them windward
    const dx = x - near.x
    const dz = z - near.z
    const r = Math.hypot(dx, dz)
    const th = Math.atan2(dz, dx)
    const wind = 0.35 + 0.65 * Math.max(0, (dx * 0.6 - dz * 0.8) / Math.max(r, 1e-3))
    const ridged = 1 - Math.abs(2 * fbm(th * 7 + r * 0.05, r * 0.08, 11, 4) - 1)
    const band = smooth(-200, 500, h) * (1 - smooth(2400, 3600, h))
    h -= 420 * wind * band * Math.pow(1 - ridged, 2.2)
    h += (fbm(x * 0.6, z * 0.6, 21, 4) - 0.5) * 120 * smooth(-100, 300, h)
    // a coastal plain: the lowest 400 m laid out flat toward the shore (a cube
    // of the height's share, easing back into the slope above)
    if (near.plain && h > 0 && h < 400) {
      const u = h / 400
      h = 400 * u * u * u + (h - 400 * u * u * u) * smooth(0.6, 1, u)
    }
  }
  return h
}
function smooth(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
/** Rain, mm a year: trades from the northeast, wettest about 900 m up the windward side, dry over the inversion. */
function rainAt(x, z, h) {
  if (h <= 0) return 0
  let near = ALL[0]
  let bd = Infinity
  for (const d of ALL) {
    const q = Math.hypot(x - d.x, z - d.z) / d.R
    if (q < bd) {
      bd = q
      near = d
    }
  }
  const dx = x - near.x
  const dz = z - near.z
  const r = Math.max(1e-3, Math.hypot(dx, dz))
  const windward = Math.max(0, (dx * 0.55 - dz * 0.83) / r)
  const oro = Math.exp(-Math.pow((h - 900) / 750, 2))
  const dry = 1 - smooth(1800, 2600, h) * 0.85
  return (350 + 7500 * windward * oro * dry + 600 * oro * dry) * (0.8 + 0.4 * fbm(x * 0.1, z * 0.1, 31, 3))
}

// --- packs ------------------------------------------------------------------------
const SCALE = 0.25
const OFFSET = -6000
const r7 = (v) => Math.round(v * 1e7) / 1e7

// each pack's metres as baked, for the test layers (by pack id)
const packMetres = new Map()

function bakePack(id, kind, name, bounds, W, H, base = out) {
  const [w, s, e, n] = bounds
  const dir = join(base, id)
  mkdirSync(dir, { recursive: true })
  const rgb = new Uint8Array(W * H * 3)
  const grey = new Uint8Array(W * H)
  const metres = new Float32Array(W * H)
  const ln40 = Math.log(40)
  for (let j = 0; j < H; j++) {
    const lat = n - ((j + 0.5) / H) * (n - s)
    const z = zkm(lat)
    for (let i = 0; i < W; i++) {
      const lon = w + ((i + 0.5) / W) * (e - w)
      const x = xkm(lon)
      let m = heightAt(x, z)
      if (m <= 0 && flatSea) m = -1
      if (m <= 0) m = Math.min(m, -0.25)
      const v = Math.max(0, Math.min(65535, Math.round((m - OFFSET) / SCALE)))
      const c = j * W + i
      metres[c] = m
      rgb[c * 3] = v >> 8
      rgb[c * 3 + 1] = v & 255
      const mm = rainAt(x, z, m)
      grey[c] = mm > 0 ? Math.round(255 * Math.max(0, Math.min(1, Math.log(mm / 300) / ln40))) : 0
    }
  }
  writePNG(join(dir, 'height.png'), W, H, rgb, 3)
  writePNG(join(dir, 'rain.png'), W, H, grey, 1)
  packMetres.set(id, { metres, rain: grey, W, H, bounds })
  const kmx = ((e - w) * KX) / W
  const kmz = ((n - s) * KZ) / H
  return {
    id,
    kind,
    name,
    bounds: bounds.map(r7),
    size: [W, H],
    metresPerTexel: [Math.round(kmx * 1e4) / 10, Math.round(kmz * 1e4) / 10],
    height: { file: `${id}/height.png`, scale: SCALE, offset: OFFSET },
    rain: { file: `${id}/rain.png` },
    sources: [{ id: 'synthetic', title: 'Synthetic test terrain (tools/fake-data.mjs)', url: 'about:blank', fetched: new Date().toISOString().slice(0, 10), licence: 'test data, not for release' }],
  }
}

function islandBounds(isl) {
  // land extent on a coarse sweep around the island, padded by about 2 km
  let x0 = Infinity
  let x1 = -Infinity
  let z0 = Infinity
  let z1 = -Infinity
  for (let z = isl.cz - 120; z <= isl.cz + 120; z += 0.5) {
    for (let x = isl.cx - 120; x <= isl.cx + 120; x += 0.5) {
      if (heightAt(x, z) <= 0) continue
      // (only land nearest this island's own domes)
      let bd = Infinity
      let owner = null
      for (const d of ALL) {
        const q = Math.hypot(x - d.x, z - d.z) / d.R
        if (q < bd) {
          bd = q
          owner = d.island
        }
      }
      if (owner !== isl) continue
      x0 = Math.min(x0, x)
      x1 = Math.max(x1, x)
      z0 = Math.min(z0, z)
      z1 = Math.max(z1, z)
    }
  }
  return [lonOf(x0 - 2.5), latOf(z1 + 2.5), lonOf(x1 + 2.5), latOf(z0 - 2.5)]
}

// --- boundaries: wedges from each island's middle out to its coast ---------------------
function coastAt(cx, cz, th) {
  let r = 0.5
  for (; r < 140; r += 0.15) if (heightAt(cx + Math.cos(th) * r, cz + Math.sin(th) * r) <= 0) break
  return r + 0.3 // a little past the shore, as the real layer runs to the waterline
}
function islandName(id) {
  return { oahu: 'Oʻahu', maui: 'Maui', hawaii: 'Hawaiʻi' }[id]
}
/**
 * Each island's moku as wedges from its middle out to its coast; Oʻahu's
 * from each of its two summits, the eastern one's split along its crest,
 * Kona to the southwest and Koʻolaupoko to the northeast, as the test
 * districts over it want them (render/district.js gives the ground where two
 * districts overlap to the one whose moku it is).
 */
function mokuGroups(isl) {
  if (isl.id !== 'oahu') return [{ cx: isl.cx, cz: isl.cz, moku: isl.moku, off: 0.07 }]
  const [w, e] = isl.domes
  return [
    { cx: w.x, cz: w.z, moku: ['Waialua', 'Koʻolauloa', 'ʻEwa', 'Waiʻanae'], off: 0.07 },
    { cx: e.x, cz: e.z, moku: ['Kona', 'Koʻolaupoko'], off: 0.125 },
  ]
}
function boundaries() {
  const moku = []
  const ahupuaa = []
  let gid = 1
  for (const isl of ISLANDS) for (const grp of mokuGroups(isl)) {
    const N = grp.moku.length
    const coast = []
    const STEP = 360 * 2
    for (let k = 0; k <= STEP; k++) {
      const th = (k / STEP) * Math.PI * 2
      coast.push(coastAt(grp.cx, grp.cz, th))
    }
    const ring = (a, b) => {
      // centre, then the coast from angle a to angle b (fractions of a turn)
      const pts = [[r7(lonOf(grp.cx)), r7(latOf(grp.cz))]]
      const k0 = Math.round(a * STEP)
      const k1 = Math.round(b * STEP)
      for (let k = k0; k <= k1; k++) {
        const th = (k / STEP) * Math.PI * 2
        const r = coast[k % STEP]
        pts.push([r7(lonOf(grp.cx + Math.cos(th) * r)), r7(latOf(grp.cz + Math.sin(th) * r))])
      }
      pts.push(pts[0])
      return pts
    }
    const off = grp.off
    for (let m = 0; m < N; m++) {
      const a = off + m / N
      const b = off + (m + 1) / N
      const name = grp.moku[m]
      moku.push({ type: 'Feature', properties: { name, island: islandName(isl.id), gisId: gid++ }, geometry: { type: 'Polygon', coordinates: [ring(a, b)] } })
      const parts = 3 + (m % 4)
      for (let p = 0; p < parts; p++) {
        const pa = a + ((b - a) * p) / parts
        const pb = a + ((b - a) * (p + 1)) / parts
        ahupuaa.push({
          type: 'Feature',
          properties: { name: `${name} ${p + 1}`, island: islandName(isl.id), moku: name, gisId: gid++ },
          geometry: { type: 'Polygon', coordinates: [ring(pa, pb)] },
        })
      }
    }
  }
  const src = [{ id: 'synthetic', title: 'Synthetic test boundaries', url: 'about:blank', fetched: new Date().toISOString().slice(0, 10), licence: 'test data' }]
  return {
    moku: { type: 'FeatureCollection', sources: src, features: moku },
    ahupuaa: { type: 'FeatureCollection', sources: src, features: ahupuaa },
  }
}

// --- gazetteer: test entries only ------------------------------------------------------------
function gazetteer(spots) {
  const eras = [
    { id: 'first-canoes', label: 'the first canoes', year: 1100, yearPrecision: 100, note: 'test era', sources: ['test-source-a'] },
    { id: 'umi', label: 'in the time of ʻUmi', year: 1600, yearPrecision: 50, note: 'test era', sources: ['test-source-a'] },
    { id: 'kalaniopuu', label: 'in the time of Kalaniʻōpuʻu', year: 1778, yearPrecision: 5, note: 'test era', sources: ['test-source-b'] },
    { id: 'kamehameha', label: 'Kamehameha I', year: 1810, yearPrecision: 1, note: 'test era', sources: ['test-source-b'] },
    { id: 'kingdom', label: 'the kingdom', year: 1850, yearPrecision: 1, note: 'test era', sources: ['test-source-c'] },
    { id: 'test-late-kingdom', label: 'the end of the kingdom', year: 1895, yearPrecision: 4, note: 'test era', sources: ['test-source-c'] },
    // (the coda, as the real one: its span reaches the present, so the timeline runs on to now)
    { id: 'coda', label: 'now', year: 2000, yearPrecision: 30, note: 'test era: 1970 to the present', sources: ['test-source-a'] },
  ]
  const polities = {
    polities: [
      { id: 'test-west', name: 'Test polity Komohana', colour: '#6fb6e8' },
      { id: 'test-middle', name: 'Test polity Waena', colour: '#9ed27a' },
      { id: 'test-east', name: 'Test polity Hikina', colour: '#f0a35e' },
      { id: 'test-east-b', name: 'Test polity Kaʻū', colour: '#e0786a' },
      { id: 'test-kingdom', name: 'Test kingdom', colour: '#f2d06b' },
    ],
    byEra: {},
  }
  for (const e of eras) {
    const m = {}
    for (const isl of ISLANDS) {
      isl.moku.forEach((name, k) => {
        let p = { oahu: 'test-west', maui: 'test-middle', hawaii: 'test-east' }[isl.id]
        if (e.id === 'first-canoes' && k % 2) return // not every moku is held yet
        if (e.id === 'umi' && isl.id === 'hawaii' && k >= 3) p = 'test-east-b'
        if (e.id === 'kalaniopuu' && isl.id === 'maui' && k >= 4) p = 'test-east'
        if (e.id === 'kamehameha' && isl.id !== 'oahu') p = 'test-kingdom'
        if (e.id === 'kamehameha' && isl.id === 'oahu' && k >= 2) p = 'test-kingdom'
        if (e.id === 'kingdom') p = 'test-kingdom'
        m[`${isl.id}:${name}`] = p
      })
    }
    polities.byEra[e.id] = m
  }
  const pt = (lon, lat) => ({ type: 'Point', coordinates: [lon, lat] })
  const places = [
    { id: 'test-bay-west', name: 'Test bay Komohana', alt: [], kind: 'bay', island: 'oahu', moku: 'Kona', ahupuaa: 'Kona 2', geometry: pt(-157.86, 21.29), placePrecision: 'exact', sources: ['test-source-a'] },
    { id: 'test-valley', name: 'Test valley Nāhelehele', alt: [], kind: 'valley', island: 'oahu', moku: 'Kona', ahupuaa: 'Kona 3', geometry: pt(-157.82, 21.36), placePrecision: 'ahupuaa', sources: ['test-source-a'] },
    { id: 'test-pali', name: 'Test pali', alt: [], kind: 'pali', island: 'oahu', moku: 'Koʻolaupoko', geometry: pt(-157.79, 21.37), placePrecision: 'exact', sources: ['test-source-b'] },
    { id: 'test-landing-maui', name: 'Test landing Waena', alt: [], kind: 'beach', island: 'maui', moku: 'Wailuku', geometry: pt(-156.48, 20.9), placePrecision: 'exact', sources: ['test-source-b'] },
    { id: 'test-peak', name: 'Test summit Kuahiwi', alt: [], kind: 'peak', island: 'hawaii', moku: 'Hāmākua', geometry: pt(-155.47, 19.82), placePrecision: 'exact', sources: ['test-source-c'] },
    { id: 'test-bay-east', name: 'Test bay Hikina', alt: [], kind: 'bay', island: 'hawaii', moku: 'Kona', geometry: pt(-155.93, 19.48), placePrecision: 'exact', sources: ['test-source-a'] },
    { id: 'test-moku-kau', name: 'Kaʻū (test)', alt: [], kind: 'moku', island: 'hawaii', moku: 'Kaʻū', geometry: pt(-155.55, 19.18), placePrecision: 'moku', sources: ['test-source-c'] },
    { id: 'test-channel', name: 'Test channel', alt: [], kind: 'channel', island: null, geometry: pt(-157.2, 21.2), placePrecision: 'sea', sources: ['test-source-b'] },
    // the coda's places, in the test Koʻolaupoko (placed on the made-up shore near where the real ones are)
    { id: 'test-heeia-pond', name: 'Test pond Heʻeia', alt: [], kind: 'fishpond', island: 'oahu', moku: 'Koʻolaupoko', geometry: pt(...spots.pondHeeia), placePrecision: 'exact', sources: ['test-source-a'] },
    { id: 'test-heeia-loi', name: 'Test loʻi Heʻeia', alt: [], kind: 'other', island: 'oahu', moku: 'Koʻolaupoko', geometry: pt(...spots.loiRestored), placePrecision: 'exact', sources: ['test-source-a'] },
    { id: 'test-pahonu', name: 'Test pond Pāhonu', alt: [], kind: 'fishpond', island: 'oahu', moku: 'Koʻolaupoko', geometry: pt(...spots.pondPahonu), placePrecision: 'exact', sources: ['test-source-a'] },
    { id: 'test-waiahole', name: 'Test valley Waiāhole', alt: [], kind: 'valley', island: 'oahu', moku: 'Koʻolaupoko', geometry: pt(...spots.loiWaiahole), placePrecision: 'exact', sources: ['test-source-a'] },
  ]
  const sources = [
    { id: 'test-source-a', title: 'A test source that was opened', author: 'Test Author ʻAkahi', year: 1900, url: 'about:blank', access: 'open', opened: true, note: 'synthetic' },
    { id: 'test-source-b', title: 'A test source nobody has opened', author: 'Test Author ʻElua', year: 1950, url: 'about:blank', access: 'print', opened: false, note: 'synthetic' },
    { id: 'test-source-c', title: 'A paywalled test source', author: 'Test Author ʻEkolu', year: 2000, access: 'paywalled', opened: false },
  ]
  const events = [
    {
      id: 'test-arrival',
      title: 'Test: the first landing',
      gloss: 'a synthetic event, for layout only',
      when: { from: '1050', to: '1200', precision: 'century' },
      era: 'first-canoes',
      where: [{ place: 'test-bay-east', role: 'landing' }],
      zoom: ['far', 'island'],
      kind: 'arrival',
      summary: 'Placeholder text to check how a card lays out a paragraph with ʻokina and kahakō: Hawaiʻi, Kaʻū, Hāmākua, ʻEwa.',
      sources: [{ id: 'test-source-a', where: 'p. 1' }, { id: 'test-source-b', where: 'ch. 2' }],
      confidence: { date: 'soft', place: 'soft' },
    },
    {
      id: 'test-campaign',
      title: 'Test: a crossing in three stops',
      gloss: 'walks the camera from one test island to another',
      when: { from: '1795-04', to: '1795-05', precision: 'month' },
      era: 'kamehameha',
      where: [{ place: 'test-landing-maui', role: 'gathering' }, { place: 'test-bay-west', role: 'landing' }, { place: 'test-valley', role: 'battle' }, { place: 'test-pali', role: 'end' }],
      zoom: ['far', 'island', 'near'],
      kind: 'voyage',
      summary: 'A test event with stops. Press Next to fly from the gathering to the landing, then up the valley to the pali.',
      stops: [
        { text: 'The test fleet gathers off Test ʻĀina Waena.', place: 'test-landing-maui', zoom: 'island', year: 1795 },
        { text: 'It lands on the bay of Test ʻĀina Komohana.', place: 'test-bay-west', zoom: 'island', year: 1795 },
        { text: 'Up the valley, Nāhelehele (test).', place: 'test-valley', zoom: 'near', year: 1795 },
        { text: 'And the end of the line at the test pali.', place: 'test-pali', zoom: 'near', year: 1795 },
      ],
      sources: [{ id: 'test-source-b', where: 'ch. 12' }, { id: 'test-source-a', where: 'pp. 3–4' }],
      confidence: { date: 'firm', place: 'firm', numbers: 'soft' },
      tellings: [
        { source: 'test-source-a', says: 'Test telling: about 10 canoes.' },
        { source: 'test-source-b', says: 'Test telling: about 20 canoes.' },
      ],
    },
    {
      id: 'test-summit',
      title: 'Test: a pin on the summit',
      gloss: 'checks pin height on the tallest ground',
      when: { from: '1600', to: '1600', precision: 'generation' },
      era: 'umi',
      where: [{ place: 'test-peak', role: 'site' }],
      zoom: ['island'],
      kind: 'other',
      summary: 'This pin should stand on the highest summit at every exaggeration.',
      sources: [{ id: 'test-source-c' }],
      confidence: { date: 'soft', place: 'firm' },
    },
    {
      id: 'test-district',
      title: 'Test: a moku-wide event',
      gloss: 'placePrecision moku, drawn with a soft halo',
      when: { from: '1778', to: '1779', precision: 'year' },
      era: 'kalaniopuu',
      where: [{ place: 'test-moku-kau', role: 'site' }],
      zoom: ['far'],
      kind: 'epidemic',
      summary: 'Checks that an imprecise place reads as an area, not a point.',
      sources: [{ id: 'test-source-b' }],
      confidence: { date: 'firm', place: 'soft' },
    },
    {
      id: 'test-law',
      title: 'Test: a law of the kingdom',
      gloss: 'an event late on the timeline',
      when: { from: '1848', to: '1850', precision: 'year' },
      era: 'kingdom',
      where: [{ place: 'test-bay-west', role: 'site' }],
      zoom: ['far'],
      kind: 'law',
      summary: 'Checks that pins come and go with the year.',
      sources: [{ id: 'test-source-a' }],
      confidence: { date: 'firm', place: 'firm' },
    },
    {
      id: 'test-channel-crossing',
      title: 'Test: out in the channel',
      gloss: 'a pin at sea',
      when: { from: '1790', to: '1796', precision: 'year' },
      era: 'kamehameha',
      where: [{ place: 'test-channel', role: 'route' }],
      zoom: ['far'],
      kind: 'voyage',
      summary: 'A place with sea precision.',
      sources: [{ id: 'test-source-b' }],
      confidence: { date: 'soft', place: 'soft' },
    },
    // the coda: near stops that come down into the test Koʻolaupoko, at years past the era's own
    {
      id: 'test-waiahole-1977',
      title: 'Test: a stand for the valley',
      gloss: 'a synthetic coda event with a near stop',
      when: { from: '1974', to: '1977', precision: 'year' },
      era: 'coda',
      where: [{ place: 'test-waiahole', role: 'site' }],
      zoom: ['island', 'near'],
      kind: 'protest',
      summary: 'A test event late on the timeline, its stop down in a district.',
      stops: [{ text: 'The test valley’s farms, from above its shore.', place: 'test-waiahole', zoom: 'near', year: 1977, camera: { bearing: 225, pitch: 0.32, distance: 16 } }],
      sources: [{ id: 'test-source-a' }],
      confidence: { date: 'firm', place: 'firm' },
    },
    {
      id: 'test-heeia-restoration',
      title: 'Test: a pond and its loʻi',
      gloss: 'a synthetic restoration with two near stops',
      when: { from: '2001', to: '2017', precision: 'year' },
      era: 'coda',
      where: [{ place: 'test-heeia-pond', role: 'site' }, { place: 'test-heeia-loi', role: 'site' }],
      zoom: ['island', 'near'],
      kind: 'restoration',
      summary: 'A test event after the coda’s own year: the pond, then the loʻi laid again in 2010.',
      stops: [
        { text: 'The test pond’s wall, from the bay.', place: 'test-heeia-pond', zoom: 'near', year: 2005, camera: { bearing: 225, pitch: 0.34, distance: 15 } },
        { text: 'The test loʻi, planted again.', place: 'test-heeia-loi', zoom: 'near', year: 2017, camera: { bearing: 230, pitch: 0.4, distance: 12 } },
      ],
      sources: [{ id: 'test-source-a' }],
      confidence: { date: 'firm', place: 'firm' },
    },
    {
      id: 'test-pahonu-limu',
      title: 'Test: limu at the pond',
      gloss: 'a synthetic restoration, near the present',
      when: { from: '2017', to: '2026', precision: 'year' },
      era: 'coda',
      where: [{ place: 'test-pahonu', role: 'site' }],
      zoom: ['island', 'near'],
      kind: 'restoration',
      summary: 'A test event that runs to the present.',
      stops: [{ text: 'The test pond on the shore.', place: 'test-pahonu', zoom: 'near', year: 2017, camera: { bearing: 240, pitch: 0.34, distance: 14 } }],
      sources: [{ id: 'test-source-a' }],
      confidence: { date: 'firm', place: 'firm' },
    },
  ]
  return { eras, polities, places, sources, events }
}

// --- write it all ------------------------------------------------------------------------------
mkdirSync(join(out, 'boundaries'), { recursive: true })
const t0 = Date.now()
const packs = []
const archBounds = [-160.5, 18.7, -154.6, 22.4]
const aw = (archBounds[2] - archBounds[0]) * KX
const ah = (archBounds[3] - archBounds[1]) * KZ
packs.push(bakePack('archipelago', 'archipelago', 'Ka Pae ʻĀina (test)', archBounds, 2048, Math.round((2048 * ah) / aw)))
console.log('archipelago', packs[0].size.join('×'), `${Date.now() - t0} ms`)
for (const isl of ISLANDS) {
  const b = islandBounds(isl)
  const w = (b[2] - b[0]) * KX
  const h = (b[3] - b[1]) * KZ
  const long = Math.min(1024, Math.round(Math.max(w, h) / 0.075))
  const W = Math.round(w >= h ? long : (long * w) / h)
  const H = Math.round(w >= h ? (long * h) / w : long)
  packs.push(bakePack(isl.id, 'island', isl.name, b, W, H))
  console.log(isl.id, `${W}×${H}`, `${(w / W * 1000).toFixed(0)} m/texel`)
}
writeFileSync(join(out, 'manifest.json'), JSON.stringify({ projection: { lat0: LAT0, lon0: LON0 }, packs }, null, 2))
const b = boundaries()
writeFileSync(join(out, 'boundaries', 'moku.geojson'), JSON.stringify(b.moku))
writeFileSync(join(out, 'boundaries', 'ahupuaa.geojson'), JSON.stringify(b.ahupuaa))
const spots = districtSpots()
const g = gazetteer(spots)
for (const k of ['eras', 'places', 'sources', 'events', 'polities']) writeFileSync(join(out, `${k}.json`), JSON.stringify(g[k], null, 2))
testPatches()
testZoning()
testDistricts(spots)
testLayers(spots, g.eras)
testWorks(spots)
console.log(`wrote ${out} in ${((Date.now() - t0) / 1000).toFixed(1)} s${flatSea ? ' (flat sea)' : ''}`)

// --- test patches --------------------------------------------------------------------------
/**
 * A soft mask over a pack's bounds at w × h: 255 inside an ellipse (centre,
 * semi-axes in km, rotated `rot` degrees), easing to nothing over its outer
 * third, where `keep(lon, lat)` says the ground qualifies.
 */
function ellipseMask(bounds, w, h, { lon, lat, a, b, rot = 0 }, keep) {
  const [W, S, E, N] = bounds
  const out = new Uint8Array(w * h)
  const c = Math.cos(rot * DEG)
  const s = Math.sin(rot * DEG)
  const x0 = xkm(lon)
  const z0 = zkm(lat)
  let n = 0
  for (let j = 0; j < h; j++) {
    const la = N - ((j + 0.5) / h) * (N - S)
    const dz = zkm(la) - z0
    for (let i = 0; i < w; i++) {
      const lo = W + ((i + 0.5) / w) * (E - W)
      const dx = xkm(lo) - x0
      const u = Math.hypot((dx * c - dz * s) / a, (dx * s + dz * c) / b)
      if (u >= 1 || !keep(lo, la)) continue
      const v = Math.round(255 * (1 - smooth(0.66, 1, u)))
      out[j * w + i] = v
      if (v) n++
    }
  }
  return { grey: out, n }
}

/** The heights of a real pack (split bytes, DATA.md §2), and a nearest lookup by lon/lat. */
function realHeights(dir, entry) {
  const png = readPNG(join(dir, entry.height.file))
  const [W, H] = entry.size
  const ch = png.channels
  const [w0, s0, e0, n0] = entry.bounds
  return (lon, lat) => {
    const i = Math.min(W - 1, Math.max(0, Math.floor(((lon - w0) / (e0 - w0)) * W)))
    const j = Math.min(H - 1, Math.max(0, Math.floor(((n0 - lat) / (n0 - s0)) * H)))
    const k = (j * W + i) * ch
    return (png.data[k] * 256 + png.data[k + 1]) * (entry.height.scale ?? 0.25) + (entry.height.offset ?? -6000)
  }
}

function writePatches(dir, list) {
  mkdirSync(join(dir, 'patches'), { recursive: true })
  const patches = []
  for (const p of list) {
    writePNG(join(dir, 'patches', `${p.id}.png`), p.size[0], p.size[1], p.grey, 1)
    const { grey, n, ...entry } = p
    patches.push({ ...entry, file: `patches/${p.id}.png`, note: `test mask (tools/fake-data.mjs), ${n} texels marked; not a record`, sources: [{ id: 'synthetic', title: 'Test mask (tools/fake-data.mjs)', url: 'about:blank', fetched: new Date().toISOString().slice(0, 10), licence: 'test data, not for release' }] })
    console.log(`  patch ${p.id}: ${p.kind} to ${p.depth} m before ${p.until}, ${p.size.join('×')}, ${n} texels`)
  }
  writeFileSync(join(dir, 'patches', 'manifest.json'), JSON.stringify({ patches }, null, 2))
}

function testPatches() {
  // the made-up Oʻahu: a channel off its south shore lifted to a reef flat
  // before 1800, and a stretch of that shore sunk to one before 1830 (its
  // timeline ends at 1850)
  const isl = ISLANDS.find((i) => i.id === 'oahu')
  const pack = packs.find((p) => p.id === 'oahu')
  // (south from the highest summit to the shore)
  const top = isl.domes.reduce((a, b) => (b.H > a.H ? b : a))
  let z = top.z
  while (heightAt(top.x, z) > 0 && z < top.z + 80) z += 0.1
  const coast = { lon: lonOf(top.x), lat: latOf(z - 0.3) }
  const [W, H] = pack.size
  const half = [Math.ceil(W / 2), Math.ceil(H / 2)]
  const sea = (lon, lat) => heightAt(xkm(lon), zkm(lat)) < -1
  const land = (lon, lat) => heightAt(xkm(lon), zkm(lat)) > 0
  console.log('test patches')
  writePatches(out, [
    { id: 'test-west-channel', pack: 'oahu', kind: 'raise', depth: -1.5, until: 1800, size: half, ...ellipseMask(pack.bounds, ...half, { lon: coast.lon, lat: latOf(z + 0.9), a: 2.6, b: 0.8 }, sea) },
    { id: 'test-west-shore', pack: 'oahu', kind: 'lower', depth: -1, until: 1830, size: [W, H], ...ellipseMask(pack.bounds, W, H, { lon: coast.lon, lat: coast.lat, a: 1.8, b: 0.9 }, land) },
  ])

  // the real Oʻahu pack and the Nuʻuanu district, when the bake is here
  const real = join(root, 'public/data')
  if (!existsSync(join(real, 'manifest.json')) || !existsSync(join(real, 'districts/manifest.json'))) return
  const man = JSON.parse(readFileSync(join(real, 'manifest.json'), 'utf8'))
  const oahu = man.packs.find((p) => p.id === 'oahu')
  const nuuanu = JSON.parse(readFileSync(join(real, 'districts/manifest.json'), 'utf8')).districts.find((d) => d.id === 'nuuanu')
  if (!oahu || !nuuanu) return
  const ho = realHeights(real, oahu)
  const hn = realHeights(join(real, 'districts'), nuuanu)
  const [OW, OH] = oahu.size
  const [NW, NH] = nuuanu.size
  console.log('test patches for the real packs')
  writePatches(join(out, 'real'), [
    // the Pearl Harbor entrance channel, its dredged water back to a reef flat before 1910
    { id: 'test-oahu-channel', pack: 'oahu', kind: 'raise', depth: -1.5, until: 1910, size: [Math.ceil(OW / 2), Math.ceil(OH / 2)], ...ellipseMask(oahu.bounds, Math.ceil(OW / 2), Math.ceil(OH / 2), { lon: -157.961, lat: 21.322, a: 0.7, b: 2.8, rot: -8 }, (lo, la) => ho(lo, la) < -4) },
    // the reef runway, its land back to a reef flat before 1977
    { id: 'test-oahu-runway', pack: 'oahu', kind: 'lower', depth: -1, until: 1977, size: [OW, OH], ...ellipseMask(oahu.bounds, OW, OH, { lon: -157.925, lat: 21.3055, a: 2.2, b: 0.45, rot: 4 }, (lo, la) => ho(lo, la) > 0) },
    // Kapālama's basin in Honolulu harbour, back to a reef flat before 1920, its mask at half the district's size
    { id: 'test-nuuanu-basin', pack: 'nuuanu', kind: 'raise', depth: -1.2, until: 1920, size: [Math.ceil(NW / 2), Math.ceil(NH / 2)], ...ellipseMask(nuuanu.bounds, Math.ceil(NW / 2), Math.ceil(NH / 2), { lon: -157.874, lat: 21.3125, a: 1.1, b: 0.5, rot: 35 }, (lo, la) => hn(lo, la) < -3) },
    // Magic Island and the Ala Moana shore, sunk before 1955 (later than the district's own fill patches)
    { id: 'test-nuuanu-point', pack: 'nuuanu', kind: 'lower', depth: -1.3, until: 1955, size: [NW, NH], ...ellipseMask(nuuanu.bounds, NW, NH, { lon: -157.849, lat: 21.2865, a: 0.75, b: 0.4, rot: 20 }, (lo, la) => hn(lo, la) > 0) },
  ])
}

// ==== [settlements] a stand-in zoning raster ========================================
/**
 * A stand-in for DATA.md "Zoning, for the settlements", for the real Maui
 * pack when the real bake is in public/data/: test-data/real/layers/ with a
 * manifest holding only the `zoning` key, a class raster at half the pack's
 * resolution (as the contract allows) and a Land Use District raster at full.
 * Shapes for trying the path (load the app with ?zoning=../test-data/real/),
 * placed roughly where Lahaina's core and the Kāʻanapali strip are, and not
 * a record of either.
 */
function testZoning() {
  const real = join(root, 'public/data')
  if (!existsSync(join(real, 'manifest.json'))) return
  const man = JSON.parse(readFileSync(join(real, 'manifest.json'), 'utf8'))
  const maui = man.packs.find((p) => p.id === 'maui')
  if (!maui) return
  const metres = realHeights(real, maui)
  const [W, H] = maui.size
  const [w0, s0, e0, n0] = maui.bounds
  const grid = (gw, gh, f) => {
    const out = new Uint8Array(gw * gh)
    for (let j = 0; j < gh; j++) {
      const lat = n0 - ((j + 0.5) / gh) * (n0 - s0)
      for (let i = 0; i < gw; i++) {
        const lon = w0 + ((i + 0.5) / gw) * (e0 - w0)
        const m = metres(lon, lat)
        out[j * gw + i] = m > 0 ? f(lon, lat, m) : 0
      }
    }
    return out
  }
  // km from a point, and across and along an ellipse turned `rot` degrees
  const km = (lon, lat, lo, la) => Math.hypot(xkm(lon) - xkm(lo), zkm(lat) - zkm(la))
  const ell = (lon, lat, { lon: lo, lat: la, a, b, rot }) => {
    const dx = xkm(lon) - xkm(lo)
    const dz = zkm(lat) - zkm(la)
    const c = Math.cos(rot * DEG)
    const sn = Math.sin(rot * DEG)
    return Math.hypot((dx * c - dz * sn) / a, (dx * sn + dz * c) / b)
  }
  const cls = (lon, lat, m) => {
    if (km(lon, lat, -156.6766, 20.8743) < 0.45 && m < 30) return 5 // the core
    if (ell(lon, lat, { lon: -156.692, lat: 20.925, a: 0.35, b: 2.2, rot: 15 }) < 1 && m < 40) return 7 // the strip
    if (km(lon, lat, -156.67, 20.86) < 0.4 && m < 30) return 6 // a works
    if (km(lon, lat, -156.67, 20.88) < 3 && m < 80) return 1
    if (m < 400) return 8
    return 9
  }
  const zoning = grid(Math.ceil(W / 2), Math.ceil(H / 2), cls)
  const lud = grid(W, H, (lon, lat, m) => ({ 1: 1, 5: 1, 6: 1, 7: 1, 8: 3, 9: 4 })[cls(lon, lat, m)] ?? 0)
  const dir = join(out, 'real', 'layers')
  mkdirSync(join(dir, 'maui'), { recursive: true })
  writePNG(join(dir, 'maui', 'now-zoning.png'), Math.ceil(W / 2), Math.ceil(H / 2), zoning, 1)
  writePNG(join(dir, 'maui', 'lud.png'), W, H, lud, 1)
  const note = 'test raster (tools/fake-data.mjs); not a record'
  writeFileSync(
    join(dir, 'manifest.json'),
    JSON.stringify({ zoning: { about: note, islands: { maui: { pack: 'maui', zoning: { file: 'maui/now-zoning.png', size: [Math.ceil(W / 2), Math.ceil(H / 2)], note }, lud: { file: 'maui/lud.png', size: [W, H], note } } } } }, null, 2),
  )
  console.log('test zoning for the real Maui pack', `${Math.ceil(W / 2)}×${Math.ceil(H / 2)}`)
}
// ==== [settlements] end =============================================================

// ==== two test districts, one drawn at three years, and the era layers under them ====
// The test districts (DATA.md "District packs") over the made-up Oʻahu, at the
// real districts' bounds: a stand-in for Nuʻuanu, first in the manifest as the
// real one is, and Koʻolaupoko, which overlaps it where the pali is.
// Koʻolaupoko is drawn at three years, as the real one is to be (c. 1700,
// 1850, now): loʻi that end before 1850 and before now, one laid again in
// 2010, a pond filled in 1940 and ponds that stay, a village whose last year
// is 1850, a raise patch for a bay dredged before 1940, and names; the coda's
// test events come down into it (gazetteer above). Under them, era layers
// for the test Oʻahu (DATA.md "Era layers": four keyframes, the Māhele's
// without forest) and its zoning (a military shore where Mōkapu would
// be, houses on the coastal plain), so the district's settlements and the
// land view have something to read. Shapes for trying the paths, placed on
// the made-up shore near where the real places are, and not a record of any.

/** The test districts' bounds: the real Nuʻuanu pack's, and Koʻolaupoko's as the task has it. */
function districtBoxes() {
  return { nuuanu: [-157.8970085, 21.269, -157.7789915, 21.381], koolaupoko: [-157.84, 21.3, -157.66, 21.52] }
}

/** Where the test features and places stand: on the made-up ground, near where the real ones are. */
function districtSpots() {
  const B = districtBoxes()
  const used = []
  const inBox = (x, z, b, km) => x > xkm(b[0]) + km && x < xkm(b[2]) - km && z > zkm(b[3]) + km && z < zkm(b[1]) - km
  const only = (id, other) => (x, z) => inBox(x, z, B[id], 0.5) && !inBox(x, z, B[other], -0.3)
  const seaNear = (x, z, r) => [[r, 0], [-r, 0], [0, r], [0, -r], [0.7 * r, 0.7 * r], [-0.7 * r, 0.7 * r], [0.7 * r, -0.7 * r], [-0.7 * r, -0.7 * r]].some(([a, b]) => heightAt(x + a, z + b) < -0.5)
  const slope = (x, z) => Math.hypot(heightAt(x + 0.05, z) - heightAt(x - 0.05, z), heightAt(x, z + 0.05) - heightAt(x, z - 0.05)) / 100
  const shore = (x, z) => {
    const h = heightAt(x, z)
    return h > 0.05 && h < 3 && seaNear(x, z, 0.25)
  }
  const lowFlat = (x, z) => {
    const h = heightAt(x, z)
    return h > 1.5 && h < 30 && slope(x, z) < 0.08 && !seaNear(x, z, 0.3)
  }
  // the nearest point to (lon, lat) inside `where` that `ok` takes, a gap from every one taken before
  const find = (lon, lat, where, ok, gap = 0.55, km = 8) => {
    const x0 = xkm(lon)
    const z0 = zkm(lat)
    let best = null
    let bd = Infinity
    for (let dz = -km; dz <= km; dz += 0.08) {
      for (let dx = -km; dx <= km; dx += 0.08) {
        const d = Math.hypot(dx, dz)
        if (d >= bd || d > km) continue
        const x = x0 + dx
        const z = z0 + dz
        if (!where(x, z) || used.some(([ux, uz]) => Math.hypot(x - ux, z - uz) < gap) || !ok(x, z)) continue
        bd = d
        best = [x, z]
      }
    }
    if (!best) throw new Error(`no test spot near ${lon}, ${lat}`)
    used.push(best)
    return [r7(lonOf(best[0])), r7(latOf(best[1]))]
  }
  const K = only('koolaupoko', 'nuuanu')
  const N = only('nuuanu', 'koolaupoko')
  const s = {}
  s.pondHeeia = find(-157.807, 21.437, K, shore, 0.8)
  s.loiRestored = find(-157.815, 21.43, K, lowFlat)
  s.loiKai = find(-157.82, 21.42, K, lowFlat)
  s.loiUka = find(-157.83, 21.445, K, lowFlat)
  s.loiKaneohe = find(-157.8, 21.41, K, lowFlat)
  s.pondFilled = find(-157.785, 21.415, K, shore, 0.8)
  s.village = find(-157.795, 21.4, K, lowFlat, 0.8)
  s.military = find(-157.745, 21.44, K, shore, 1.6)
  s.kailua = find(-157.74, 21.395, K, shore, 0.8)
  s.pondPahonu = find(-157.7, 21.336, K, shore, 0.8)
  s.loiWaiahole = find(-157.835, 21.48, K, lowFlat)
  // (twenty more, small, so the loʻi outnumber the aux map's indices and those of one span share one, as the real ones do)
  s.loiMore = Array.from({ length: 20 }, () => find(-157.75, 21.39, K, lowFlat, 0.4, 12))
  s.loiNuuanu = find(-157.85, 21.29, N, lowFlat)
  s.villageNuuanu = find(-157.86, 21.285, N, lowFlat, 0.8)
  return s
}

/** A rectangle w × h km about [lon, lat], turned `rot` degrees anticlockwise: a closed ring, anticlockwise. */
function rectRing([lon, lat], w, h, rot = 0) {
  const c = Math.cos(rot * DEG)
  const s = Math.sin(rot * DEG)
  const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => {
    const e = (u * w * c - v * h * s) / 2
    const n = (u * w * s + v * h * c) / 2
    return [r7(lon + e / KX), r7(lat + n / KZ)]
  })
  return { type: 'Polygon', coordinates: [[...ring, ring[0]]] }
}

/** The direction (degrees anticlockwise from east) the sea lies in from [lon, lat], within about 1.5 km. */
function seaward([lon, lat]) {
  let best = 0
  let low = Infinity
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2
    const h = heightAt(xkm(lon) + Math.cos(a) * 1.5, zkm(lat) - Math.sin(a) * 1.5)
    if (h < low) {
      low = h
      best = (k / 16) * 360
    }
  }
  return best
}

function testDistricts(spots) {
  const B = districtBoxes()
  const MPT = 24 // metres a texel: coarser than the real 6 m, so the test decodes quickly
  const fetched = new Date().toISOString().slice(0, 10)
  const src = [{ id: 'synthetic', title: 'Synthetic test district (tools/fake-data.mjs)', url: 'about:blank', fetched, licence: 'test data, not for release' }]
  const base = join(out, 'districts')
  mkdirSync(base, { recursive: true })
  const entries = []
  for (const [id, name] of [['nuuanu', 'Nuʻuanu (test)'], ['koolaupoko', 'Koʻolaupoko (test)']]) {
    const b = B[id]
    const W = Math.round(((b[2] - b[0]) * KX * 1000) / MPT)
    const H = Math.round(((b[3] - b[1]) * KZ * 1000) / MPT)
    const p = bakePack(id, 'district', name, b, W, H, base)
    // (Koʻolaupoko names its moku; the stand-in Nuʻuanu leaves the app to find its own under its middle)
    entries.push({ id, name, island: 'oahu', parent: 'oahu', ...(id === 'koolaupoko' ? { moku: 'Koʻolaupoko' } : {}), bounds: p.bounds, size: p.size, metresPerTexel: p.metresPerTexel, height: p.height, rain: p.rain, features: `${id}/features.json`, sources: src })
    console.log(`test district ${id} ${W}×${H}`)
  }
  const F = (id, kind, name, geometry, extra = {}) => ({ type: 'Feature', id, properties: { kind, name, from: null, to: null, precision: 'schematic', sources: ['test-source-a'], ...extra }, geometry })
  const point = (c) => ({ type: 'Point', coordinates: c })
  const households = (n) => [{ source: 'test-source-a', says: `Test telling: some ${n} households.` }]
  const features = {
    nuuanu: [
      F('test-loi-nuuanu', 'loi', 'Test loʻi Nuʻuanu', rectRing(spots.loiNuuanu, 0.3, 0.2, 40), { to: 1880 }),
      F('test-village-nuuanu', 'village', 'Test village Nuʻuanu', rectRing(spots.villageNuuanu, 0.45, 0.3, 40), { to: 1820, tellings: households('thirty') }),
      F('test-label-nuuanu', 'label', 'Nuʻuanu (test)', point(spots.loiNuuanu)),
    ],
    koolaupoko: [
      // c. 1700 all four of the old loʻi; by 1850 the uka one gone; now none of them, and the one laid again in 2010
      F('test-loi-uka', 'loi', 'Test loʻi uka', rectRing(spots.loiUka, 0.3, 0.2, 35), { to: 1840 }),
      F('test-loi-kai', 'loi', 'Test loʻi kai', rectRing(spots.loiKai, 0.3, 0.2, 35), { to: 1920 }),
      F('test-loi-kaneohe', 'loi', 'Test loʻi Kāneʻohe', rectRing(spots.loiKaneohe, 0.3, 0.2, 35), { from: 1600, to: 1880 }),
      F('test-loi-waiahole', 'loi', 'Test loʻi Waiāhole', rectRing(spots.loiWaiahole, 0.28, 0.2, 35)),
      F('test-loi-restored', 'loi', 'Test loʻi, laid again', rectRing(spots.loiRestored, 0.28, 0.2, 35), { from: 2010 }),
      ...spots.loiMore.map((c, n) => F(`test-loi-small-${n + 1}`, 'loi', `Test loʻi ${n + 1}`, rectRing(c, 0.16, 0.11, 35), { to: n % 2 ? 1856 : 1896 })),
      // the ponds on the shore: one filled in 1940, two that stay
      F('test-pond-heeia', 'fishpond', 'Test pond Heʻeia', rectRing(spots.pondHeeia, 0.4, 0.28, seaward(spots.pondHeeia))),
      F('test-pond-filled', 'fishpond', 'Test pond, filled', rectRing(spots.pondFilled, 0.32, 0.22, seaward(spots.pondFilled)), { to: 1939 }),
      F('test-pond-pahonu', 'fishpond', 'Test pond Pāhonu', rectRing(spots.pondPahonu, 0.22, 0.16, seaward(spots.pondPahonu))),
      F('test-village', 'village', 'Test village Kāneʻohe', rectRing(spots.village, 0.5, 0.35, 35), { to: 1850, tellings: households('forty') }),
      F('test-label-heeia', 'label', 'Heʻeia (test)', point(spots.pondHeeia)),
      F('test-label-kaneohe', 'label', 'Kāneʻohe (test)', point(spots.village)),
      F('test-label-kailua', 'label', 'Kailua (test)', point(spots.kailua)),
      F('test-label-mokapu', 'label', 'Mōkapu (test)', point(spots.military)),
      F('test-label-waimanalo', 'label', 'Waimānalo (test)', point(spots.pondPahonu)),
    ],
  }
  for (const e of entries) writeFileSync(join(base, e.id, 'features.json'), JSON.stringify({ type: 'FeatureCollection', features: features[e.id] }, null, 1))
  // the bay off the Heʻeia pond, dredged: its water a reef flat before 1940
  const k = entries.find((e) => e.id === 'koolaupoko')
  const [KW, KH] = k.size
  const sea = seaward(spots.pondHeeia)
  const [plon, plat] = spots.pondHeeia
  const at = { lon: plon + (Math.cos(sea * DEG) * 1.6) / KX, lat: plat + (Math.sin(sea * DEG) * 1.6) / KZ }
  const mask = ellipseMask(k.bounds, KW, KH, { ...at, a: 1.7, b: 0.7, rot: sea + 90 }, (lo, la) => heightAt(xkm(lo), zkm(la)) < -3)
  writePNG(join(base, 'koolaupoko', 'patch-bay.png'), KW, KH, mask.grey, 1)
  k.patches = [{ id: 'test-koolaupoko-bay', kind: 'raise', depth: -1.5, until: 1940, file: 'koolaupoko/patch-bay.png', size: [KW, KH], source: 'tools/fake-data.mjs', note: `test mask, ${mask.n} texels: a bay's water a reef flat before it was dredged; not a record` }]
  console.log(`  patch test-koolaupoko-bay: raise to -1.5 m before 1940, ${mask.n} texels`)
  writeFileSync(join(base, 'manifest.json'), JSON.stringify({ districts: entries }, null, 2))
}

/** Era layers and zoning for the test Oʻahu (DATA.md "Era layers", "Zoning, for the settlements"). */
function testLayers(spots, eras) {
  const KF = [
    { id: 'contact', year: 1778, yearPrecision: 30, label: 'test: on the eve of contact', layers: ['cultivation', 'settlement', 'forest'] },
    { id: 'mahele', year: 1853, yearPrecision: 5, label: 'test: at the Māhele', layers: ['cultivation', 'settlement'] },
    { id: 'kingdom', year: 1896, yearPrecision: 4, label: 'test: at the end of the kingdom', layers: ['cultivation', 'settlement', 'forest'] },
    { id: 'now', year: 2020, yearPrecision: 10, label: 'test: now', layers: ['cultivation', 'settlement', 'forest'] },
  ]
  const METHOD = { contact: 'modelled', mahele: 'mixed', kingdom: 'mixed', now: 'mapped' }
  const fetched = new Date().toISOString().slice(0, 10)
  const src = [{ id: 'synthetic', title: 'Test layers (tools/fake-data.mjs)', url: 'about:blank', fetched, licence: 'test data, not for release' }]
  const Lg = Math.log(1 + 50000 / 2)
  const byte = (d) => (d > 0 ? Math.max(1, Math.min(255, Math.round((255 * Math.log(1 + d / 2)) / Lg))) : 0)
  const B = districtBoxes()
  const inBox = (lon, lat, b) => lon >= b[0] && lon <= b[2] && lat >= b[1] && lat <= b[3]
  const km = (lon, lat, q) => Math.hypot(xkm(lon) - xkm(q[0]), zkm(lat) - zkm(q[1]))
  const dir = join(out, 'layers')
  const islands = {}
  let zoningEntry = null
  // (Oʻahu's alone: the districts are over it, and every other island's towns
  // would only weigh on the frames of checks that have nothing to do with them)
  for (const p of packs) {
    if (p.kind !== 'island' || p.id !== 'oahu') continue
    const { metres, rain, W, H } = packMetres.get(p.id)
    const [w0, s0, e0, n0] = p.bounds
    const masks = Object.fromEntries(KF.map((k) => [k.id, Object.fromEntries(k.layers.map((l) => [l, new Uint8Array(W * H)]))]))
    const oahu = p.id === 'oahu'
    const zoning = oahu ? new Uint8Array(W * H) : null
    const lud = oahu ? new Uint8Array(W * H) : null
    for (let j = 0; j < H; j++) {
      const lat = n0 - ((j + 0.5) / H) * (n0 - s0)
      for (let i = 0; i < W; i++) {
        const c = j * W + i
        const h = metres[c]
        if (h <= 0) continue
        const lon = w0 + ((i + 0.5) / W) * (e0 - w0)
        const r = rain[c] / 255
        const low = h < 150
        const coast = h < 40
        const district = oahu && (inBox(lon, lat, B.koolaupoko) || inBox(lon, lat, B.nuuanu))
        const military = oahu && h < 40 && km(lon, lat, spots.military) < 1.3
        const town = oahu && km(lon, lat, spots.village) < 2.5
        // cultivation: the wet lowland farmed, less by the Māhele, cane by 1896, little now
        const cult = low ? (r > 0.45 ? 0.7 : 0.4) : h < 400 ? 0.15 : 0
        masks.contact.cultivation[c] = Math.round(255 * cult)
        masks.mahele.cultivation[c] = Math.round(255 * cult * 0.45)
        masks.kingdom.cultivation[c] = Math.round(255 * (low ? 0.35 : 0.04))
        masks.now.cultivation[c] = Math.round(255 * (low && !district ? 0.1 : 0.02))
        // native forest: the wet uplands, less by 1896, less again now
        const forest = h > 300 ? Math.min(1, 0.3 + r) : h > 150 ? 0.3 : 0.04
        masks.contact.forest[c] = Math.round(255 * forest)
        masks.kingdom.forest[c] = Math.round(255 * forest * 0.75)
        masks.now.forest[c] = Math.round(255 * forest * 0.45)
        // people per km²: the shore's villages, fewer at the Māhele, a town by 1896, suburbs now
        const people = coast ? 80 : low ? 30 : h < 400 ? 4 : 0
        masks.contact.settlement[c] = byte(people)
        masks.mahele.settlement[c] = byte(people * 0.35)
        masks.kingdom.settlement[c] = byte((coast ? 50 : low ? 15 : h < 400 ? 2 : 0) + (town ? 300 : 0))
        masks.now.settlement[c] = byte(military ? 150 : district ? (h < 60 ? 2600 : h < 200 ? 300 : 0) : coast ? 300 : low ? 40 : 0)
        if (zoning) {
          // houses on the plain, a business core in the town, the military shore, farms above, forest reserve higher
          const z = military ? 10 : town && h < 60 && km(lon, lat, spots.village) < 0.4 ? 4 : h < 60 ? 1 : h < 300 ? 8 : 9
          zoning[c] = z
          lud[c] = { 1: 1, 4: 1, 10: 1, 8: 3, 9: 4 }[z]
        }
      }
    }
    mkdirSync(join(dir, p.id), { recursive: true })
    const layers = {}
    for (const k of KF) {
      layers[k.id] = {}
      for (const l of k.layers) {
        const file = `${p.id}/${k.id}-${l}.png`
        writePNG(join(dir, file), W, H, masks[k.id][l], 1)
        layers[k.id][l] = { file, method: METHOD[k.id] }
      }
    }
    islands[p.id] = { pack: p.id, size: [W, H], bounds: p.bounds, layers }
    if (zoning) {
      writePNG(join(dir, p.id, 'now-zoning.png'), W, H, zoning, 1)
      writePNG(join(dir, p.id, 'lud.png'), W, H, lud, 1)
      zoningEntry = { pack: p.id, zoning: { file: `${p.id}/now-zoning.png`, size: [W, H] }, lud: { file: `${p.id}/lud.png`, size: [W, H] } }
    }
  }
  // each era on the keyframes, linear in years; an era whose span reaches the last keyframe stands at it (the coda at now)
  const map = {}
  for (const era of eras) {
    const e = { year: era.year }
    for (const l of ['cultivation', 'settlement', 'forest']) {
      const K = KF.filter((k) => k.layers.includes(l))
      if (era.year <= K[0].year) e[l] = { keyframe: K[0].id }
      else if (era.year + (era.yearPrecision || 0) >= K.at(-1).year) e[l] = { keyframe: K.at(-1).id }
      else {
        const i = K.findIndex((k, q) => q + 1 < K.length && era.year <= K[q + 1].year)
        const t = (era.year - K[i].year) / (K[i + 1].year - K[i].year)
        e[l] = t >= 1 ? { keyframe: K[i + 1].id } : { from: K[i].id, to: K[i + 1].id, t: +t.toFixed(3) }
      }
    }
    map[era.id] = e
  }
  const methods = Object.fromEntries(KF.map((k) => [k.id, Object.fromEntries(k.layers.map((l) => [l, { method: METHOD[k.id], ...(METHOD[k.id] === 'mapped' ? {} : { rule: 'test rule: by height and rain (tools/fake-data.mjs)' }), sources: src }]))]))
  const note = 'test layers (tools/fake-data.mjs); not a record'
  const manifest = {
    about: note,
    encoding: { cultivation: 'share of the texel, value / 255', forest: 'share of the texel, value / 255', settlement: { kind: 'log density', d0: 2, dMax: 50000 } },
    keyframes: KF,
    eras: map,
    methods,
    islands,
    zoning: { about: note, islands: zoningEntry ? { oahu: zoningEntry } : {} },
  }
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`test layers for ${Object.keys(islands).join(', ')}; zoning for ${zoningEntry ? zoningEntry.pack : 'none'}`)
}
// ==== end of the test districts and layers ==========================================

// ==== test works ======================================================================
/** The convex hull of [x, z] km points, anticlockwise (Andrew's monotone chain). */
function hullKm(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), q) <= 0) lower.pop()
    lower.push(q)
  }
  const upper = []
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i]
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), q) <= 0) upper.pop()
    upper.push(q)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

/** Test works and their manifest (DATA.md "Works, dated") under dir/works/. */
function writeWorks(dir, byIsland, note) {
  mkdirSync(join(dir, 'works'), { recursive: true })
  const stats = {}
  for (const [id, feats] of Object.entries(byIsland)) {
    writeFileSync(join(dir, 'works', `${id}.geojson`), JSON.stringify({ type: 'FeatureCollection', features: feats }))
    stats[id] = {}
    for (const f of feats) stats[id][f.properties.kind] = (stats[id][f.properties.kind] || 0) + 1
  }
  const fetched = new Date().toISOString().slice(0, 10)
  const kinds = { military: ['land', 'runway', 'pier', 'block', 'range'], airport: ['field', 'runway', 'block'], highway: ['road', 'tunnel'], rail: ['line'], harbour: ['breakwater', 'pier'] }
  const sources = [{ id: 'synthetic', title: 'Test works (tools/fake-data.mjs)', url: 'about:blank', licence: 'test data, not for release', fetched }]
  writeFileSync(join(dir, 'works', 'manifest.json'), JSON.stringify({ about: note, files: Object.keys(byIsland).map((id) => `${id}.geojson`), kinds, sources, stats }, null, 2))
  console.log(`  test works in ${join(dir, 'works')}: ${Object.entries(stats).map(([id, st]) => `${id} ${JSON.stringify(st)}`).join('; ')}`)
}

/** A work: a GeoJSON feature with the contract's properties (DATA.md "Works, dated"). */
function work(id, kind, part, group, name, geometry, extra = {}) {
  return { type: 'Feature', properties: { id, kind, part, group, name, owner: null, from: null, to: null, datePrecision: 'year', precision: 'inferred', sources: ['test-source-a'], note: 'a test shape (tools/fake-data.mjs), not a record', ...extra }, geometry }
}

/**
 * The made-up Oʻahu's works, placed on its ground: the base on the shore
 * where the test Mōkapu is (its land the hull of what stands on it), a range
 * and a returned base on the west dome, an airfield on the south plain west
 * of the test Nuʻuanu, the roads across the plain and over the test pali,
 * a railway along the plain, a breakwater off the test bay.
 */
function testWorks(spots) {
  const H = (x, z) => heightAt(x, z)
  const ll = ([x, z]) => [r7(lonOf(x)), r7(latOf(z))]
  const km = (lon, lat) => [xkm(lon), zkm(lat)]
  /** The nearest point to (lon, lat) within `R` km where `ok(x, z)`. */
  const near = (lon, lat, ok, R = 6, step = 0.05) => {
    const [x0, z0] = km(lon, lat)
    let best = null
    let bd = Infinity
    for (let dz = -R; dz <= R; dz += step) {
      for (let dx = -R; dx <= R; dx += step) {
        const d = Math.hypot(dx, dz)
        if (d >= bd || d > R) continue
        if (!ok(x0 + dx, z0 + dz)) continue
        bd = d
        best = [x0 + dx, z0 + dz]
      }
    }
    if (!best) throw new Error(`no test works spot near ${lon}, ${lat}`)
    return best
  }
  const lowFlat = (lo, hi, fall = 6) => (x, z) => {
    const h = H(x, z)
    return h > lo && h < hi && Math.abs(H(x + 0.1, z) - H(x - 0.1, z)) < fall && Math.abs(H(x, z + 0.1) - H(x, z - 0.1)) < fall
  }
  /** A straight strip `len` km long about c, every point of it on ground between lo and hi metres: { a, b, u }. */
  const strip = (c, len, lo, hi) => {
    for (let deg = 0; deg < 180; deg += 5) {
      const u = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
      const a = [c[0] - (u[0] * len) / 2, c[1] - (u[1] * len) / 2]
      const b = [c[0] + (u[0] * len) / 2, c[1] + (u[1] * len) / 2]
      let ok = true
      for (let k = 0; k <= 30 && ok; k++) {
        const h = H(a[0] + ((b[0] - a[0]) * k) / 30, a[1] + ((b[1] - a[1]) * k) / 30)
        ok = h > lo && h < hi
      }
      if (ok) return { a, b, u }
    }
    throw new Error(`no strip of ${len} km about ${ll(c)}`)
  }
  const around = (pts, r) => pts.flatMap(([x, z]) => Array.from({ length: 8 }, (_, k) => [x + r * Math.cos((k * Math.PI) / 4), z + r * Math.sin((k * Math.PI) / 4)]))
  const polygon = (pts) => {
    // (hull in km, x east and z south: anticlockwise there is clockwise on the map, so reversed)
    const ring = hullKm(pts).map(ll).reverse()
    return { type: 'Polygon', coordinates: [[...ring, ring[0]]] }
  }
  const rect = (c, w, h, rot = 0) => rectRing(ll(c), w, h, rot)
  const line = (pts) => ({ type: 'LineString', coordinates: pts.map(ll) })
  const point = (p) => ({ type: 'Point', coordinates: ll(p) })
  const F = []

  // the base on the windward shore: its runway on the flat behind the shore, a pier out into the bay, a hangar and barracks
  const [mx, mz] = km(...spots.military)
  const rc = near(lonOf(mx), latOf(mz), lowFlat(1, 25), 2.5)
  const rw = strip(rc, 1.3, 0.6, 30)
  const perp = [-rw.u[1], rw.u[0]]
  const hangar = [rc[0] + perp[0] * 0.16, rc[1] + perp[1] * 0.16]
  const barracks = [rc[0] - perp[0] * 0.22 + rw.u[0] * 0.3, rc[1] - perp[1] * 0.22 + rw.u[1] * 0.3]
  const shore = near(lonOf(mx), latOf(mz), (x, z) => {
    const h = H(x, z)
    return h > 0.2 && h < 3 && Math.hypot(x - rc[0], z - rc[1]) > 0.5
  }, 2)
  let seaDir = null
  for (let k = 0; k < 24 && !seaDir; k++) {
    const a = (k / 24) * Math.PI * 2
    if (H(shore[0] + Math.cos(a) * 0.35, shore[1] + Math.sin(a) * 0.35) < -1.5) seaDir = [Math.cos(a), Math.sin(a)]
  }
  if (!seaDir) throw new Error('no sea beside the test base')
  const pierEnd = [shore[0] + seaDir[0] * 0.3, shore[1] + seaDir[1] * 0.3]
  const base = 'test-mokapu'
  F.push(
    work('test-mokapu-land', 'military', 'land', base, 'Test station Mōkapu', polygon(around([rw.a, rw.b, shore, pierEnd, hangar, barracks], 0.35)), { owner: 'Navy', from: 1939, built: [1939, 1942] }),
    work('test-mokapu-runway', 'military', 'runway', base, null, line([rw.a, rw.b]), { owner: 'Navy', from: 1941, width: 60 }),
    work('test-mokapu-pier', 'military', 'pier', base, null, line([shore, pierEnd]), { owner: 'Navy', from: 1941, width: 18 }),
    work('test-mokapu-hangar', 'military', 'block', base, null, point(hangar), { owner: 'Navy', from: 1941, storeys: 1 }),
    work('test-mokapu-barracks', 'military', 'block', base, null, point(barracks), { owner: 'Navy', from: 1942, storeys: 3 }),
  )

  // a range on the west dome, its land held 1941–1994
  const west = ISLANDS.find((i) => i.id === 'oahu').domes[0]
  const rg = near(lonOf(west.x - 5), latOf(west.z - 2), lowFlat(60, 700), 6, 0.1)
  F.push(
    work('test-makua-land', 'military', 'land', 'test-makua', 'Test range Mākua', rect(rg, 4, 3, 20), { owner: 'Army', from: 1941, to: 1994 }),
    work('test-makua-range', 'military', 'range', 'test-makua', null, rect(rg, 2.6, 1.8, 20), { owner: 'Army', from: 1942, to: 1994 }),
  )

  // a base returned: held 1942–1999 on the south plain, a block of four storeys on it
  const kl = near(-158.07, 21.41, lowFlat(2, 120, 25), 6, 0.05)
  F.push(
    work('test-kalaeloa-land', 'military', 'land', 'test-kalaeloa', 'Test air station Kalaeloa', rect(kl, 3, 2, -10), { owner: 'Navy', from: 1942, to: 1999 }),
    work('test-kalaeloa-block', 'military', 'block', 'test-kalaeloa', null, point(kl), { owner: 'Navy', from: 1943, to: 1999, storeys: 4 }),
  )

  // an airfield on the shore north of the test Nuʻuanu and west of the test Koʻolaupoko: its field, a runway, a hangar's footprint
  const ac = near(-157.895, 21.43, lowFlat(0.8, 40, 15), 4)
  const ar = strip(ac, 1.0, 0.3, 60)
  const ap = [-ar.u[1], ar.u[0]]
  const hc = [ac[0] + ap[0] * 0.2, ac[1] + ap[1] * 0.2]
  // (rectRing turns anticlockwise on the map, where z runs the other way)
  const deg = (Math.atan2(-ar.u[1], ar.u[0]) * 180) / Math.PI
  F.push(
    work('test-keehi-field', 'airport', 'field', 'test-keehi', 'Test airfield Keʻehi', polygon(around([ar.a, ar.b, hc], 0.3)), { owner: 'territory', from: 1927 }),
    work('test-keehi-runway', 'airport', 'runway', 'test-keehi', null, line([ar.a, ar.b]), { owner: 'territory', from: 1927, width: 45 }),
    work('test-keehi-hangar', 'airport', 'block', 'test-keehi', null, rect(hc, 0.09, 0.06, deg), { owner: 'territory', from: 1931, storeys: 1 }),
  )

  // the interstate down the west shore of the east dome, built 1953–1962, and the state road over the test pali through its tunnel
  const onLand = (lo, hi) => (x, z) => {
    const h = H(x, z)
    return h > lo && h < hi
  }
  const way = (pts, lo, hi) => pts.map(([lon, lat]) => near(lon, lat, onLand(lo, hi), 3))
  const h1 = way([[lonOf(ac[0] + 0.6), latOf(ac[1] + 0.6)], [-157.885, 21.4], [-157.875, 21.36], [-157.85, 21.32], [-157.8, 21.29]], 1, 150)
  F.push(work('test-h1', 'highway', 'road', 'test-h1', 'Test interstate H-1', line(h1), { owner: 'State', class: 'interstate', lanes: 6, from: 1953, built: [1953, 1962], width: 24 }))
  const pali = way([[-157.81, 21.295], [-157.825, 21.355], [-157.8, 21.368], [-157.79, 21.372], [-157.785, 21.385], [-157.795, 21.402]], 1, 1500)
  // (the tunnel where the road runs highest, half a kilometre of it)
  const dense = []
  for (let i = 0; i + 1 < pali.length; i++) for (let k = 0; k < 20; k++) dense.push([pali[i][0] + ((pali[i + 1][0] - pali[i][0]) * k) / 20, pali[i][1] + ((pali[i + 1][1] - pali[i][1]) * k) / 20])
  let top = 0
  dense.forEach((p, i) => {
    if (H(...p) > H(...dense[top])) top = i
  })
  let s0 = top
  let s1 = top
  const kmAlong = (a, b) => Math.hypot(dense[b][0] - dense[a][0], dense[b][1] - dense[a][1])
  while (s0 > 0 && kmAlong(s0, top) < 0.25) s0--
  while (s1 < dense.length - 1 && kmAlong(top, s1) < 0.25) s1++
  F.push(
    work('test-pali-road', 'highway', 'road', 'test-pali', 'Test Pali road', line(pali), { owner: 'territory', class: 'state', from: 1957, width: 12 }),
    work('test-pali-tunnel', 'highway', 'tunnel', 'test-pali', 'Test Pali tunnels', line(dense.slice(s0, s1 + 1)), { owner: 'territory', from: 1957, width: 12 }),
  )

  // a railway along the west dome's south shore, laid 1889 and lifted 1947
  const rail = way([[-158.2, 21.47], [-158.12, 21.425], [-158.05, 21.42]], 0.8, 200)
  F.push(work('test-railway', 'rail', 'line', 'test-railway', 'Test Railway', line(rail), { owner: 'private', from: 1889, to: 1947, width: 1, note: 'a test shape (tools/fake-data.mjs), not a record; the Test Railway Company' }))

  // a breakwater off the test bay, built 1908–1912
  // (along the shore nearest the test bay, a few hundred metres out)
  const coast = near(-157.86, 21.29, (x, z) => H(x, z) > 0.2 && H(x, z) < 4, 6)
  let seaward_ = null
  for (let k = 0; k < 36 && !seaward_; k++) {
    const a = (k / 36) * Math.PI * 2
    if (H(coast[0] + Math.cos(a) * 0.3, coast[1] + Math.sin(a) * 0.3) < -1) seaward_ = [Math.cos(a), Math.sin(a)]
  }
  if (!seaward_) throw new Error('no sea off the test bay')
  const bc = [coast[0] + seaward_[0] * 0.3, coast[1] + seaward_[1] * 0.3]
  const bwa = [bc[0] - seaward_[1] * 0.3, bc[1] + seaward_[0] * 0.3]
  const bwb = [bc[0] + seaward_[1] * 0.3, bc[1] - seaward_[0] * 0.3]
  F.push(work('test-breakwater', 'harbour', 'breakwater', 'test-harbour', 'Test breakwater', line([bwa, bwb]), { owner: 'federal', from: 1912, built: [1908, 1912], width: 14 }))

  writeWorks(out, { oahu: F }, 'test works (tools/fake-data.mjs): shapes on the made-up islands, not a record')
  testRealWorks()
}

/**
 * Test works over the real Oʻahu pack, when the real bake is here: a base
 * on Mōkapu with its runway, a pier and two blocks, a field held and given
 * back at Bellows, and two roads through Nuʻuanu (one over the pali through a
 * tunnel), for the smoke to lay on the lidar (tools/smoke.mjs loads them
 * itself with DATA=real). Shapes placed where such things are, not a record
 * of them.
 */
function testRealWorks() {
  const real = join(root, 'public/data')
  if (!existsSync(join(real, 'manifest.json'))) return
  const man = JSON.parse(readFileSync(join(real, 'manifest.json'), 'utf8'))
  const oahu = man.packs.find((p) => p.id === 'oahu')
  if (!oahu) return
  const h = realHeights(real, oahu)
  const pt = (c) => ({ type: 'Point', coordinates: c })
  const ln = (cs) => ({ type: 'LineString', coordinates: cs })
  const box = (w, s, e, n) => ({ type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] })
  const F = [
    work('test-real-mokapu-land', 'military', 'land', 'test-real-mokapu', 'Test station Mōkapu', box(-157.784, 21.427, -157.728, 21.462), { owner: 'Navy', from: 1939, built: [1939, 1942] }),
    work('test-real-mokapu-runway', 'military', 'runway', 'test-real-mokapu', null, ln([[-157.7745, 21.446], [-157.7625, 21.4555]]), { owner: 'Navy', from: 1941, width: 60 }),
    work('test-real-mokapu-pier', 'military', 'pier', 'test-real-mokapu', null, ln([[-157.759, 21.433], [-157.766, 21.433]]), { owner: 'Navy', from: 1941, width: 18 }),
    work('test-real-mokapu-hangar', 'military', 'block', 'test-real-mokapu', null, pt([-157.766, 21.448]), { owner: 'Navy', from: 1941, storeys: 1 }),
    work('test-real-mokapu-barracks', 'military', 'block', 'test-real-mokapu', null, pt([-157.752, 21.4425]), { owner: 'Navy', from: 1942, storeys: 3 }),
    work('test-real-bellows-land', 'military', 'land', 'test-real-bellows', 'Test field Bellows', box(-157.728, 21.352, -157.712, 21.366), { owner: 'Army', from: 1917, to: 1958 }),
    work('test-real-pali-road', 'highway', 'road', 'test-real-pali', 'Test Pali road', ln([[-157.858, 21.312], [-157.862, 21.33], [-157.858, 21.345], [-157.852, 21.36], [-157.843, 21.366], [-157.832, 21.372], [-157.822, 21.376], [-157.808, 21.375], [-157.797, 21.371], [-157.79, 21.375], [-157.78, 21.38], [-157.775, 21.392], [-157.765, 21.396]]), { owner: 'territory', class: 'state', from: 1957, width: 12 }),
    work('test-real-pali-tunnel', 'highway', 'tunnel', 'test-real-pali', 'Test Pali tunnels', ln([[-157.815, 21.3765], [-157.808, 21.375], [-157.802, 21.3735]]), { owner: 'territory', from: 1957, width: 12 }),
    work('test-real-h1', 'highway', 'road', 'test-real-h1', 'Test interstate H-1', ln([[-157.915, 21.335], [-157.885, 21.334], [-157.865, 21.33], [-157.852, 21.318], [-157.84, 21.305], [-157.825, 21.299], [-157.81, 21.296]]), { owner: 'State', class: 'interstate', from: 1953, built: [1953, 1962], width: 24 }),
  ]
  // (the runway and the blocks on land, the pier's end in the water)
  for (const [lon, lat] of [[-157.7745, 21.446], [-157.7625, 21.4555], [-157.766, 21.448], [-157.752, 21.4425], [-157.759, 21.433]]) if (!(h(lon, lat) > 0)) console.log(`  (test works for the real Oʻahu: ${lon}, ${lat} is not on land)`)
  if (!(h(-157.766, 21.433) < 0)) console.log('  (test works for the real Oʻahu: the pier ends on land)')
  writeWorks(join(out, 'real'), { oahu: F }, 'test works (tools/fake-data.mjs) over the real Oʻahu pack: shapes, not a record')
}
// ==== test works end ==================================================================

