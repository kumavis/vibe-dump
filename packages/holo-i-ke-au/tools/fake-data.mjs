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
      { lon: -157.82, lat: 21.44, H: 900, R: 13, ax: 2.5, rot: -40 },
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

function bakePack(id, kind, name, bounds, W, H) {
  const [w, s, e, n] = bounds
  const dir = join(out, id)
  mkdirSync(dir, { recursive: true })
  const rgb = new Uint8Array(W * H * 3)
  const grey = new Uint8Array(W * H)
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
      rgb[c * 3] = v >> 8
      rgb[c * 3 + 1] = v & 255
      const mm = rainAt(x, z, m)
      grey[c] = mm > 0 ? Math.round(255 * Math.max(0, Math.min(1, Math.log(mm / 300) / ln40))) : 0
    }
  }
  writePNG(join(dir, 'height.png'), W, H, rgb, 3)
  writePNG(join(dir, 'rain.png'), W, H, grey, 1)
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
function coastAt(isl, th) {
  let r = 0.5
  for (; r < 140; r += 0.15) if (heightAt(isl.cx + Math.cos(th) * r, isl.cz + Math.sin(th) * r) <= 0) break
  return r + 0.3 // a little past the shore, as the real layer runs to the waterline
}
function islandName(id) {
  return { oahu: 'Oʻahu', maui: 'Maui', hawaii: 'Hawaiʻi' }[id]
}
function boundaries() {
  const moku = []
  const ahupuaa = []
  let gid = 1
  for (const isl of ISLANDS) {
    const N = isl.moku.length
    const coast = []
    const STEP = 360 * 2
    for (let k = 0; k <= STEP; k++) {
      const th = (k / STEP) * Math.PI * 2
      coast.push(coastAt(isl, th))
    }
    const ring = (a, b) => {
      // centre, then the coast from angle a to angle b (fractions of a turn)
      const pts = [[r7(lonOf(isl.cx)), r7(latOf(isl.cz))]]
      const k0 = Math.round(a * STEP)
      const k1 = Math.round(b * STEP)
      for (let k = k0; k <= k1; k++) {
        const th = (k / STEP) * Math.PI * 2
        const r = coast[k % STEP]
        pts.push([r7(lonOf(isl.cx + Math.cos(th) * r)), r7(latOf(isl.cz + Math.sin(th) * r))])
      }
      pts.push(pts[0])
      return pts
    }
    const off = 0.07
    for (let m = 0; m < N; m++) {
      const a = off + m / N
      const b = off + (m + 1) / N
      const name = isl.moku[m]
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
function gazetteer() {
  const eras = [
    { id: 'first-canoes', label: 'the first canoes', year: 1100, yearPrecision: 100, note: 'test era', sources: ['test-source-a'] },
    { id: 'umi', label: 'in the time of ʻUmi', year: 1600, yearPrecision: 50, note: 'test era', sources: ['test-source-a'] },
    { id: 'kalaniopuu', label: 'in the time of Kalaniʻōpuʻu', year: 1778, yearPrecision: 5, note: 'test era', sources: ['test-source-b'] },
    { id: 'kamehameha', label: 'Kamehameha I', year: 1810, yearPrecision: 1, note: 'test era', sources: ['test-source-b'] },
    { id: 'kingdom', label: 'the kingdom', year: 1850, yearPrecision: 1, note: 'test era', sources: ['test-source-c'] },
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
const g = gazetteer()
for (const k of ['eras', 'places', 'sources', 'events', 'polities']) writeFileSync(join(out, `${k}.json`), JSON.stringify(g[k], null, 2))
testPatches()
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
