// Dev-only: audit which trees grow where.
//
// For each seed this generates the island in node, carves the hero falls as
// the app does, and grows every forest tile on the island through the code
// the app streams with (features/vegetation.js buildTile), recording each tree
// it plants. Each tree is then put in a zone measured here from the ground
// itself, by the definitions in the forest spec: elevation, rain, windward or
// leeward for its height, valley floor, gulch or ridge, and the band that was
// farmed c. 1700. The zone is never the branch the code happened to take.
//
// Next to the code's mix it prints two expectations:
//   rules  the spec's placement rules (§5.2), evaluated here on the same
//          candidates with the same hashes, so a difference is a difference
//          of rule, not of luck
//   table  the spec's zone table (§3), the rough nominal mix.
// It flags (!) a species whose share strays from the rules', and marks (~)
// one more than 15 points off the table (or flags it, in the one zone where
// the spec's rules contradict its table). Then it checks each species against
// its range (the spec's "do not" lists, with the rain and elevation jitter the
// rules themselves use as slack; these outrank the rules, so a breach the
// rules share is flagged too), how the lowland trees clump, the planted
// (fixed) trees, and the corrections the research asked for. The flags are
// for reading, not a score: a declared departure from the rules flags too.
//
//   node tools/audit-forest.mjs [--root <package dir>] [--list] [--at x,z,r[,label]]… [seed…]
//
// --list prints a few coordinates for each range breach. --at counts only
// the trees within r world units of (x, z), e.g. round a tour stop's target
// (1 unit = 100 m); give it more than once to audit several places from one
// generated island, each reported on its own.
//
// A valley floor is the spec's own floor test, or ground that is flat
// (ny > 0.95), low against its surroundings (tpi < −20 m) and drained
// (rip > 0.15): on these islands the loʻi floors carry little blurred
// drainage (rip ~0.3), which the spec's test alone reads as gulch. A farmed
// one (no ʻōhiʻa lehua, in any form) lies by the loʻi, or beside a stream on
// moist ground away from the kula field systems.
//
// Where the spec's rules and its zone table disagree on the understorey, the
// rules here follow the table: hāpuʻu p 0.25 in the cloud forest up to
// 1,600 m, none in the bogs. The kula (field-system ground) is judged as zone
// B, as the spec's table has the kula stop, where it is dry enough to be
// kula: a field system the generator lays on wetter ground is judged by its
// rain. The strand (below 15 m, within 150 m of the sea) is planted rather
// than grown (spec §3 A), so its rows count the planted trees with the
// streamed ones, against the strand's own mix.
//
// The falls' and the hōlua's own clearings (made after construction) and the
// platforms' outlines are left out, so a few more trees stand here than in
// the app. A package whose forest predates the species spec is read through
// what its tiles return; its trees then carry no dry-form or ʻōlapa tint.

import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
let root = join(dirname(fileURLToPath(import.meta.url)), '..')
let list = false
const areas = []
const seeds = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') root = resolve(args[++i])
  else if (args[i] === '--list') list = true
  else if (args[i] === '--at') {
    const [x, z, r, ...label] = args[++i].split(',')
    areas.push({ x: Number(x), z: Number(z), r: Number(r), label: label.join(',') || `within ${r} of (${x}, ${z})` })
  } else seeds.push(Number(args[i]))
}
if (!seeds.length) seeds.push(20261004, 7)
if (!areas.length) areas.push(null) // the whole island

const { WORLD, HALF, HEIGHT_RES, HYDRO_RES, Y_PER_M } = await import(join(root, 'src/config.js'))
const { generateIsland } = await import(join(root, 'src/gen/island-data.js'))
const { planFalls } = await import(join(root, 'src/features/waterfalls.js'))
const { layStreams } = await import(join(root, 'src/gen/channels.js'))
const { blur, distanceTransform } = await import(join(root, 'src/gen/grid.js'))
const { hash2, makeSimplex } = await import(join(root, 'src/gen/noise.js'))
const { Terrain } = await import(join(root, 'src/render/terrain.js'))
const { Vegetation } = await import(join(root, 'src/features/vegetation.js'))

// rain in the land texture's units, ln(mm / 300) / ln(40) (spec §2.2)
const R1000 = 0.326
const R1075 = 0.346
const R1250 = 0.387
const R1500 = 0.436
const R1900 = 0.5
const R2500 = 0.575
const R4000 = 0.702
const R5000 = 0.763
const JIT = 0.06 // the rules jitter rain by this much either way per tree
const FOREST_T = 2 // tile size (vegetation.js)
const CELL = WORLD / HYDRO_RES

const sm = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const OK = (b) => (b ? 1 : 0)

// --- species ------------------------------------------------------------------------------------

// the streamed forest's species (the pseudo-kinds by name), then the planted
// trees the strand rows count
const SPECIES = ['ohia', 'ohiaDry', 'ohiaKrumm', 'olapa', 'koa', 'kukui', 'ohiaai', 'hau', 'hala', 'wiliwili', 'lama', 'aalii', 'niu', 'milo', 'kou', 'ulu', 'loulu', 'hapuu']
const NAME = {
  ohia: 'ʻōhiʻa',
  ohiaDry: 'ʻōhiʻa, dry form',
  ohiaKrumm: 'ʻōhiʻa, stunted',
  olapa: 'ʻōlapa',
  koa: 'koa',
  kukui: 'kukui',
  ohiaai: 'ʻōhiʻa ʻai',
  hau: 'hau',
  hala: 'hala',
  wiliwili: 'wiliwili',
  lama: 'lama',
  aalii: 'ʻaʻaliʻi',
  niu: 'niu (planted)',
  milo: 'milo (planted)',
  kou: 'kou (planted)',
  ulu: 'ʻulu (planted)',
  loulu: 'loulu (planted)',
  hapuu: 'hāpuʻu',
}
const TREES = SPECIES.slice(0, -1)
const SI = Object.fromEntries(SPECIES.map((k, i) => [k, i]))
const HAPUU = SI.hapuu
const S_N = SPECIES.length
const OHIA_FORMS = ['ohia', 'ohiaDry', 'ohiaKrumm']
// buildTile's census numbering: its FOREST_KINDS, then 11 dry-form ʻōhiʻa and 12 ʻōlapa
const CENSUS_KINDS = ['ohia', 'ohiaKrumm', 'koa', 'kukui', 'ohiaai', 'hau', 'hala', 'wiliwili', 'lama', 'aalii', 'hapuu', 'ohiaDry', 'olapa']
// planted kinds the strand counts (the maiʻa, kī and naupaka beneath are not trees)
const PLANTED = ['niu', 'hala', 'ulu', 'kukui', 'aalii', 'ohiaai', 'hau', 'milo', 'kou', 'loulu']

// --- zones (spec §3), measured on the ground ----------------------------------------------------

// The farmed band is cut where the rules' own jitter (±60 m on 420–760 m)
// can't reach: below 360 m every candidate is farmed lowland, above 820 m none.
const ZONES = [
  { id: 'P', name: 'pali (ny < 0.35)', table: null },
  { id: 'A', name: 'strand, windward', table: { hala: 40, niu: 25, hau: 15, milo: 15, kou: 5 }, planted: true },
  { id: 'A′', name: 'strand, leeward', table: { niu: 35, kou: 30, milo: 10, aalii: 25 }, planted: true },
  { id: 'G′', name: 'summit bog', table: { ohiaKrumm: 100 } },
  { id: 'G', name: 'cloud forest, above 1,300 m', table: { ohiaKrumm: 65, olapa: 28, ohia: 7 } },
  { id: 'G/F', name: 'cloud-forest edge, 1,150–1,300 m', table: null },
  // (spec §3: the kula stop is zone B, the field system the dry kula, which
  // the rules' windward test misreads: judged by the table alone)
  { id: 'K', name: 'kula (field-system ground < 1,500 mm)', table: { aalii: 35, wiliwili: 25, lama: 25, ohiaDry: 15 }, byTable: true },
  { id: 'B', name: 'leeward dry, below 600 m', table: { aalii: 35, wiliwili: 25, lama: 25, ohiaDry: 15 } },
  { id: 'B+', name: 'leeward dry, above 600 m', table: { ohiaDry: 35, lama: 35, aalii: 20, koa: 10 } },
  { id: 'D1', name: 'farmed lowland: valley floor', table: { ohiaai: 40, hau: 30, kukui: 25, hala: 5 } },
  { id: 'D2', name: 'farmed lowland: gulch, steep wall', table: { kukui: 70, hala: 15, ohiaai: 10, ohia: 5 } },
  { id: 'D3', name: 'farmed lowland: interfluve (fallow)', table: { kukui: 45, hala: 35, ohiaai: 10, hau: 10, ohia: 10, koa: 10 } },
  { id: 'E', name: 'windward transition, 360–820 m', table: { ohia: 55, koa: 15, kukui: 15, ohiaai: 5, hala: 5, ohiaKrumm: 5 } },
  { id: 'E′', name: 'leeward moist transition, 360–820 m', table: null },
  { id: 'C', name: 'mesic forest, 820–1,150 m', table: { ohia: 45, koa: 30, lama: 15, aalii: 5, kukui: 5 } },
  { id: 'F^', name: 'wet forest: ridge, steep face', table: { ohiaKrumm: 50, ohia: 50 } },
  { id: 'F', name: 'wet forest, closed canopy', table: { ohia: 78, koa: 10, olapa: 10, kukui: 2 } },
]
for (const z of ZONES) {
  if (!z.table) continue
  const t = Object.values(z.table).reduce((a, b) => a + b, 0)
  for (const k in z.table) z.table[k] = (100 * z.table[k]) / t
}
const ZI = Object.fromEntries(ZONES.map((z, i) => [z.id, i]))

// --- the ground, measured here ------------------------------------------------------------------

function groundOf(island, lines) {
  const d = island.data
  const N = HYDRO_RES
  const h = d.height
  const HN = HEIGHT_RES
  const metres = (x, z) => {
    let fx = ((x + HALF) / WORLD) * HN - 0.5
    let fz = ((z + HALF) / WORLD) * HN - 0.5
    fx = Math.min(HN - 1.001, Math.max(0, fx))
    fz = Math.min(HN - 1.001, Math.max(0, fz))
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const k = j * HN + i
    const a = h[k] + (h[k + 1] - h[k]) * tx
    const b = h[k + HN] + (h[k + HN + 1] - h[k + HN]) * tx
    return a + (b - a) * tz
  }
  const e = WORLD / HN
  // the normal's y, with the vertical exaggeration (as terrain.normalAt)
  const normalY = (x, z) => {
    const hx = (metres(x + e, z) - metres(x - e, z)) * Y_PER_M
    const hz = (metres(x, z + e) - metres(x, z - e)) * Y_PER_M
    return (2 * e) / Math.hypot(hx, 2 * e, hz)
  }
  // rain index from the generator's millimetres, drainage blurred as the land texture's (app.js)
  const rain = new Float32Array(N * N)
  const ripRaw = new Float32Array(N * N)
  for (let c = 0; c < N * N; c++) {
    rain[c] = Math.max(0, Math.min(1, Math.log(d.rain[c] / 300) / Math.log(40)))
    ripRaw[c] = Math.max(0, Math.min(1, Math.log10(Math.max(1e-6, d.area[c]) / 0.04) / 1.6))
  }
  const ripB = blur(ripRaw, N, 2, 2)
  const field = new Float32Array(N * N)
  for (let c = 0; c < N * N; c++) field[c] = d.region[c * 4 + 3] / 255
  const rip = ripB.map((v) => Math.min(1, v * 1.6))
  // metres to the kula field system: its dry farmland is no irrigated valley
  const kulaM = distanceTransform(N, (c) => d.region[c * 4 + 3] > 5)
  // and to the sea, for the strand
  const seaM = distanceTransform(N, (c) => d.height1024[c] <= 0)
  for (let c = 0; c < N * N; c++) {
    kulaM[c] *= CELL * 100
    seaM[c] *= CELL * 100
  }
  // topographic position on a ~250 m ring (spec §5.1)
  const H1 = d.height1024
  const tpi = new Float32Array(N * N)
  for (let j = 7; j < N - 7; j++) {
    for (let i = 7; i < N - 7; i++) {
      let s = 0
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4
        s += H1[Math.round(j + 7 * Math.sin(a)) * N + Math.round(i + 7 * Math.cos(a))]
      }
      tpi[j * N + i] = H1[j * N + i] - s / 8
    }
  }
  const cellOf = (x, z) => {
    const i = Math.floor((x + HALF) / CELL)
    const j = Math.floor((z + HALF) / CELL)
    return i >= 0 && j >= 0 && i < N && j < N ? j * N + i : -1
  }
  // the drawn streams as segments with the ribbon's half-width (streams.js), binned
  const segs = []
  for (const l of lines) {
    const half = Math.min(0.11, 0.009 * Math.sqrt(l.lineA) + 0.012)
    for (let k = 1; k < l.pts.length; k++) segs.push([l.pts[k - 1][0], l.pts[k - 1][1], l.pts[k][0], l.pts[k][1], half])
  }
  const water = binned(segs.map((s) => [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2, s]), 1)
  /** World units to the nearest drawn stream bank (< 0 in the water), up to 1. */
  const bank = (x, z) => {
    let best = 1
    water.near(x, z, (s) => {
      best = Math.min(best, segDist(x, z, s[0], s[1], s[2], s[3]) - s[4])
    })
    return best
  }
  const paddies = []
  for (const c of island.meta.sites.loi) for (const p of c.paddies) for (const q of [p.c, ...p.poly]) paddies.push([q[0], q[1], null])
  const loi = binned(paddies, 0.5)
  /** Whether a loʻi paddy lies within r (≤ 0.5) of (x, z). */
  const nearLoi = (x, z, r) => {
    let hit = false
    loi.near(x, z, (_, px, pz) => {
      if (!hit && Math.hypot(px - x, pz - z) < r) hit = true
    })
    return hit
  }
  /** Everything the zone table reads at (x, z). */
  const at = (x, z) => {
    const c = cellOf(x, z)
    const m = metres(x, z)
    const ny = normalY(x, z)
    const r = c < 0 ? 0 : rain[c]
    const rp = c < 0 ? 0 : rip[c]
    const t = c < 0 ? 0 : tpi[c]
    const floor = sm(0.55, 0.8, rp) * sm(0.82, 0.92, ny) * (1 - sm(-5, 15, t))
    const gulch = Math.max(sm(0.1, 0.3, rp) * (1 - floor), sm(25, 60, -t))
    const ridge = sm(20, 60, t) * (1 - sm(0.05, 0.2, rp))
    const steep = 1 - sm(0.55, 0.75, ny)
    const windward = r - (0.22 + 0.00043 * m)
    const dry = r < R1250 && windward < 0.03
    const bottom = floor > 0.5 || (ny > 0.95 && t < -20 && rp > 0.15)
    let zone
    if (ny < 0.35) zone = 'P'
    else if (m < 15 && c >= 0 && seaM[c] < 150) zone = r >= 0.28 || windward > 0.03 ? 'A' : 'A′'
    else if (m > 1350 && ny > 0.97 && r > 0.85) zone = 'G′'
    else if (m > 1300) zone = 'G'
    else if (m > 1150) zone = 'G/F'
    else if (c >= 0 && field[c] > 0.05 && m < 760 && r < R1500) zone = 'K'
    else if (dry) zone = m < 600 ? 'B' : 'B+'
    else if (m < 360) zone = bottom ? 'D1' : gulch > 0.4 || steep > 0.4 ? 'D2' : 'D3'
    else if (m < 820) zone = windward >= 0 ? 'E' : 'E′'
    else if (r < R2500) zone = 'C'
    else zone = ridge > 0.5 || steep > 0.5 ? 'F^' : 'F'
    return { m, ny, r, mm: 300 * Math.pow(40, r), rip: rp, tpi: t, floor, bottom, gulch, ridge, steep, windward, dry, kulaM: c < 0 ? 1e9 : kulaM[c], zone: ZI[zone] }
  }
  return { at, metres, normalY, bank, nearLoi, rain, rip, tpi, cellOf }
}

function segDist(x, z, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz || 1e-12
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2))
  return Math.hypot(ax + dx * t - x, az + dz * t - z)
}

/** Points [x, z, payload] in square bins of `size`; near() visits the 3×3 bins round a point. */
function binned(points, size) {
  const bins = new Map()
  for (const p of points) {
    const key = Math.floor((p[0] + HALF) / size) * 4096 + Math.floor((p[1] + HALF) / size)
    if (!bins.has(key)) bins.set(key, [])
    bins.get(key).push(p)
  }
  return {
    near(x, z, fn) {
      const i = Math.floor((x + HALF) / size)
      const j = Math.floor((z + HALF) / size)
      for (let a = i - 1; a <= i + 1; a++) {
        for (let b = j - 1; b <= j + 1; b++) {
          const l = bins.get(a * 4096 + b)
          if (l) for (const p of l) fn(p[2], p[0], p[1])
        }
      }
    },
  }
}

// --- the spec's placement rules (§5.2), on the same candidates ----------------------------------

function specRules(veg, ground, seed) {
  const groveN = makeSimplex(seed + 5151)
  const n = Math.round(FOREST_T / 0.17)
  const step = FOREST_T / n
  /** The spec's tree (and hāpuʻu) at candidate (gi, gj): fills and returns `out`. */
  return function tree(gi, gj, out) {
    const H = (k) => hash2(gi, gj, k)
    const x = (gi + H(11)) * step
    const z = (gj + H(12)) * step
    out.kind = null
    out.hapuu = false
    out.x = x
    out.z = z
    // the gates, as the code has them (including its no-trunk-in-the-water)
    const L = veg.landAt(x, z)
    if (!L || L.sand > 0.2 || L.field > 0.3 || veg.isCleared(x, z)) return out
    const m = ground.metres(x, z)
    if (m < 3) return out
    if (veg.bankAt && veg.bankAt(x, z) < 0.008) return out
    const ny = ground.normalY(x, z)
    const c = ground.cellOf(x, z)
    const tpi = c < 0 ? 0 : ground.tpi[c]
    const r = L.rain + (H(3) - 0.5) * 0.12
    const grove = 0.5 + 0.5 * groveN(x * 2.5, z * 2.5)
    const windward = r - (0.22 + 0.00043 * m)
    const floor = sm(0.55, 0.8, L.rip) * sm(0.82, 0.92, ny) * (1 - sm(-5, 15, tpi))
    const gulch = Math.max(sm(0.1, 0.3, L.rip) * (1 - floor), sm(25, 60, -tpi))
    const ridge = sm(20, 60, tpi) * (1 - sm(0.05, 0.2, L.rip))
    const steep = 1 - sm(0.55, 0.75, ny)
    const cult = 1 - sm(420, 760, m + (H(20) - 0.5) * 120)
    const kuk = OK(m < 670 && r > R1075 && r < R4000 + 0.03) * (1 - sm(450, 670, m))
    const hal = OK(m < 610 && (windward > -0.05 || m < 150))
    const ai = OK(m < 550 && r > R1500)
    const hau = OK(m < 450 && L.rip > 0.5)
    const kca = OK(m > 250)
    let p = 0
    let opts = null
    let zoneG = 0 // 1 cloud forest, 2 bog
    if (m > 1150 + 150 * H(21)) {
      zoneG = 1
      if (m > 1350 && ny > 0.97 && r > 0.85) {
        zoneG = 2
        p = 0.1
        opts = [['ohiaKrumm', 1]]
      } else {
        p = 0.95
        opts = [['ohiaKrumm', 65], ['olapa', 28], ['ohia', 7 * OK(tpi < -20)]]
      }
    } else if (r < R1250 && windward < 0.03) {
      p = (0.07 + 0.35 * gulch + 0.25 * steep) * (1 - L.field)
      opts = m < 600 ? [['aalii', 35], ['wiliwili', 25 * OK(windward < 0)], ['lama', 25], ['ohiaDry', 15]] : [['ohiaDry', 35], ['lama', 35], ['aalii', 20], ['koa', 10 * OK(r > R1000)]]
    } else if (cult > H(22)) {
      if (floor > 0.5) {
        p = 0.55
        opts = [['ohiaai', 40 * ai * (grove > 0.4 ? 1.5 : 0.3)], ['hau', 30 * hau], ['kukui', 25 * kuk], ['hala', 5 * hal]]
      } else if (gulch > 0.4 || steep > 0.4) {
        p = 0.85
        opts = [['kukui', 70 * kuk], ['hala', 15 * hal], ['ohiaai', 10 * ai], ['lama', 15 * OK(r < R1500)], ['ohia', (5 + 45 * (1 - kuk)) * OK(m > 150)], ['ohiaKrumm', 10 * (1 - kuk) * steep]]
      } else {
        p = 0.3
        opts =
          ridge > 0.5
            ? [['ohia', 60 * OK(m > 150)], ['koa', 20 * kca], ['hala', 20 * hal]]
            : [['kukui', 45 * kuk * (grove > 0.4 ? 1 : 0.3)], ['hala', 35 * hal], ['ohiaai', 10 * ai], ['hau', 10 * hau], ['ohia', 10 * OK(m > 150)], ['koa', 10 * kca]]
      }
    } else if (r < R2500) {
      p = m < 760 ? 0.55 : 0.85
      opts = [['ohia', 45], ['koa', 30 * OK(m > 300)], ['lama', 15], ['aalii', 5], ['kukui', 10 * kuk * OK(gulch > 0.5)]]
    } else if (ridge > 0.5 || steep > 0.5) {
      p = 0.6
      opts = [['ohiaKrumm', 50], ['ohia', 50]]
    } else {
      p = 0.95
      opts = [['ohia', 78], ['koa', 10 * OK(r < R5000 && ny > 0.8)], ['olapa', 10], ['kukui', 2 * kuk * OK(gulch > 0.5)]]
    }
    let kind = H(13) < p ? choose(H(7), opts) : null
    if (kind && ny < 0.35 && H(5) < 0.7) kind = null
    if ((kind === 'ohia' || kind === 'ohiaDry') && ny < 0.5) kind = 'ohiaKrumm'
    out.kind = kind
    // the understorey
    const geo = kind === 'ohiaDry' ? 'ohia' : kind === 'olapa' ? 'ohiaKrumm' : kind
    if (r >= R1500 && m > 250 && m < 1700 && cult < 0.5 && (geo === 'ohia' || geo === 'koa' || geo === 'ohiaKrumm')) {
      // (in the cloud forest the table's p 0.25 to 1,600 m, none in the bogs)
      const ph = zoneG === 2 ? 0 : zoneG === 1 ? 0.25 * OK(m < 1600) : Math.min(0.65, 0.15 + 0.5 * sm(R1900, R4000, r)) * (1 - 0.7 * ridge) * (m > 1500 ? 0.4 : 1)
      const hx = x + (H(31) - 0.5) * step
      const hz = z + (H(32) - 0.5) * step
      if (H(30) < ph && !veg.isCleared(hx, hz)) {
        out.hapuu = true
        out.hx = hx
        out.hz = hz
      }
    }
    return out
  }
}

function choose(u, opts) {
  let t = 0
  for (const [, w] of opts) t += Math.max(0, w)
  if (t <= 0) return null
  u *= t
  for (const [k, w] of opts) if (w > 0 && (u -= w) < 0) return k
  return opts.filter(([, w]) => w > 0).pop()[0]
}

// --- what the code plants -----------------------------------------------------------------------

/**
 * Calls fn(species, x, z) for each tree a tile of the package's forest plants.
 * The current code is read through its emit and census hooks (which name the
 * dry-form and ʻōlapa pseudo-kinds); an older one through the tile it returns.
 */
function reader(veg) {
  if (typeof veg.emit === 'function' && veg.buildTile.length >= 3) {
    let last = null
    let fnNow = null
    const emit = veg.emit.bind(veg)
    veg.emit = (kind, x, y, z, ...rest) => {
      last = [x, z]
      emit(kind, x, y, z, ...rest)
    }
    const row = new Proxy([], {
      get: () => 0,
      set: (_, k) => {
        fnNow(CENSUS_KINDS[Number(k)], last[0], last[1])
        return true
      },
    })
    const census = new Proxy([], { get: () => row })
    return (ti, tj, fn) => {
      fnNow = fn
      veg.buildTile(ti, tj, census)
    }
  }
  return (ti, tj, fn) => {
    const t = veg.buildTile(ti, tj)
    for (const [k, d] of Object.entries(t.data || {})) for (let i = 0; i < d.n; i++) fn(k, d.mat[i * 16 + 12], d.mat[i * 16 + 14])
  }
}

// --- the audit ----------------------------------------------------------------------------------

/** Range breaches: the spec's "do not" lists (§4), with the rules' own jitter as slack. */
// the farmed valley floors c. 1700: irrigated taro wherever a valley had a
// permanent stream (Cuddihy & Stone ch. 15) — by the loʻi, or a valley floor
// beside a stream on moist ground, but not a dry leeward wash nor the kula's
// dry hollows (out to ~400 m round it)
const FARMED_FLOOR = (g) => g.m < 360 && (g.loi || (g.bottom && g.bank < 0.3 && !g.dry && g.kulaM > 420))
const RANGE = [
  ['kukui', 'above 680 m', (g) => g.m > 680],
  ['kukui', 'over ~4,000 mm (+jitter)', (g) => g.r > R4000 + 0.03 + JIT],
  ['kukui', 'in leeward dry scrub', (g) => g.r < R1250 - JIT && g.windward < 0.03 - JIT],
  ['ohiaai', 'above 560 m', (g) => g.m > 560],
  ['ohiaai', 'on the dry side (< 1,500 mm − jitter)', (g) => g.r < R1500 - JIT],
  // (the spec's pali row has stunted ʻōhiʻa, ʻaʻaliʻi and loulu: mountain apple
  // fills the valleys and gorges, not their cliffs)
  ['ohiaai', 'on the pali (ny < 0.35)', (g) => g.ny < 0.35],
  ['hau', 'above 460 m', (g) => g.m > 460],
  ['hau', 'away from water (> 30 m from a stream bank)', (g) => g.bank > 0.3],
  ['hala', 'above 620 m', (g) => g.m > 620],
  ['hala', 'on dry leeward ground', (g) => g.r < R1250 - JIT && g.windward < 0.03 - JIT],
  ['wiliwili', 'above 610 m', (g) => g.m > 610],
  ['wiliwili', 'on windward or wet ground', (g) => g.windward > JIT || g.r > R1250 + JIT],
  ['koa', 'in the farmed lowland below 240 m', (g) => g.m < 240],
  ['koa', 'on the dry leeward coast (< 150 m)', (g) => g.m < 150 && g.dry],
  ['koa', 'on a wet windward valley floor', (g) => g.bottom && g.r > R2500 && g.m < 760],
  ['lama', 'in wet forest (> 2,500 mm + jitter)', (g) => g.r > R2500 + JIT],
  ['aalii', 'under closed wet forest', (g) => g.r > R2500 + JIT && g.ny > 0.5],
  ['hapuu', 'below 240 m or above 1,710 m', (g) => g.m < 240 || g.m > 1710],
  ['hapuu', 'on the dry side (< 1,500 mm − jitter)', (g) => g.r < R1500 - JIT],
  // (ʻōhiʻa lehua in any form: the research's point is the tree, not its leaf)
  ['ohia', 'on a farmed valley floor or by the loʻi', FARMED_FLOOR],
  ['ohiaDry', 'on a farmed valley floor or by the loʻi', FARMED_FLOOR],
  ['ohiaKrumm', 'on a farmed valley floor or by the loʻi', FARMED_FLOOR],
  ['ohia', 'on the farmed coastal plain (< 140 m)', (g) => g.m < 140],
  ['ohia', 'tall on an exposed summit ridge', (g) => g.m > 1300 && g.ridge > 0.5],
  ['ohiaDry', 'in mesic or wet forest', (g) => g.r > R1250 + JIT],
  ['ohiaKrumm', 'in the dry lowland (< 300 m, < 1,500 mm)', (g) => g.m < 300 && g.r < R1500 - JIT],
  ['olapa', 'below the wet forest (< 2,500 mm − jitter)', (g) => g.r < R2500 - JIT],
  ['koa', 'above 1,300 m (no subalpine belt)', (g) => g.m > 1300],
  ['lama', 'above 1,300 m (no naio belt)', (g) => g.m > 1300],
  ['aalii', 'above 1,300 m', (g) => g.m > 1300],
  ['wiliwili', 'above 1,300 m', (g) => g.m > 1300],
]

/** Generates the island and builds the forest as the app does: everything an area's tally reads. */
function prepare(seed) {
  const t0 = Date.now()
  const island = generateIsland(seed)
  const wailele = planFalls(island, { carve: true })
  const lines = wailele.lines || layStreams(island.meta, island.data)
  const ground = groundOf(island, lines)
  // the app's land texture (app.js makeLandTexture), which the forest reads
  const N = HYDRO_RES
  const d = island.data
  const land = new Uint8Array(N * N * 4)
  for (let c = 0; c < N * N; c++) {
    land[c * 4] = Math.round(255 * ground.rain[c])
    land[c * 4 + 1] = Math.round(255 * Math.max(0, Math.min(1, d.sand[c])))
    land[c * 4 + 2] = Math.round(255 * ground.rip[c])
    land[c * 4 + 3] = d.region[c * 4 + 3]
  }
  const shared = { uniforms: {} }
  const terrain = new Terrain(d, shared)
  const app = { island, terrain, shared, wailele, landTex: { image: { data: land } } }
  const veg = new Vegetation(app)
  return { seed, island, ground, veg, grow: reader(veg), spec: specRules(veg, ground, seed), secs: (Date.now() - t0) / 1000 }
}

/** Grows every tile that reaches `area` (or the whole island) and tallies trees by zone, code and rules. */
function tally(ctx, area) {
  const t0 = Date.now()
  const { ground, veg, grow, spec } = ctx
  const Z = ZONES.length
  const code = Array.from({ length: Z }, () => new Float64Array(S_N))
  const rules = Array.from({ length: Z }, () => new Float64Array(S_N))
  const breach = RANGE.map(() => ({ code: 0, rules: 0, eg: [] }))
  // the farmed lowland's trees, for how they clump (groves or salt-and-pepper)
  const LOW = new Set([ZI.D1, ZI.D2, ZI.D3, ZI.E])
  const lowland = { code: [], rules: [] }
  const cards = Object.fromEntries(SPECIES.map((k) => [k, { m: [], mm: [], wind: 0, floor: 0, gulch: 0, ridge: 0, farmed: 0, bank: [], n: 0 }]))
  const unknown = {}
  const probe = (x, z) => {
    const g = ground.at(x, z)
    g.loi = g.m < 360 && ground.nearLoi(x, z, 0.4)
    g.bank = ground.bank(x, z)
    return g
  }
  const check = (k, g, x, z, col) => {
    for (let q = 0; q < RANGE.length; q++) {
      if (RANGE[q][0] !== k || !RANGE[q][2](g)) continue
      breach[q][col]++
      if (col === 'code' && breach[q].eg.length < 4) breach[q].eg.push(`(${x.toFixed(2)}, ${z.toFixed(2)}) ${g.m.toFixed(0)} m, ${g.mm.toFixed(0)} mm`)
    }
  }
  const t = Math.round(HALF / FOREST_T)
  const { x: ax, z: az, r: ar } = area || { x: 0, z: 0, r: Infinity }
  const inside = (x, z) => (x - ax) ** 2 + (z - az) ** 2 <= ar * ar
  const n = Math.round(FOREST_T / 0.17)
  const out = {}
  for (let ti = -t; ti < t; ti++) {
    for (let tj = -t; tj < t; tj++) {
      if (area && Math.hypot(Math.max(ti * FOREST_T - ax, 0, ax - (ti + 1) * FOREST_T), Math.max(tj * FOREST_T - az, 0, az - (tj + 1) * FOREST_T)) > ar) continue
      grow(ti, tj, (k, x, z) => {
        if (!inside(x, z)) return
        const s = SI[k]
        if (s === undefined) {
          unknown[k] = (unknown[k] || 0) + 1
          return
        }
        const g = probe(x, z)
        code[g.zone][s]++
        check(k, g, x, z, 'code')
        if (LOW.has(g.zone)) lowland.code.push([x, z, s])
        const c = cards[k]
        c.n++
        if (c.n % 3 === 0) {
          c.m.push(g.m)
          c.mm.push(g.mm)
          c.bank.push(g.bank)
        }
        if (g.windward >= 0) c.wind++
        if (g.m < 460) c.farmed++
        if (g.bottom) c.floor++
        else if (g.gulch > 0.4) c.gulch++
        else if (g.ridge > 0.5) c.ridge++
      })
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          spec(ti * n + a, tj * n + b, out)
          if (out.kind && inside(out.x, out.z)) {
            const g = probe(out.x, out.z)
            rules[g.zone][SI[out.kind]]++
            check(out.kind, g, out.x, out.z, 'rules')
            if (LOW.has(g.zone)) lowland.rules.push([out.x, out.z, SI[out.kind]])
          }
          if (out.hapuu && inside(out.hx, out.hz)) {
            const g = probe(out.hx, out.hz)
            rules[g.zone][HAPUU]++
            check('hapuu', g, out.hx, out.hz, 'rules')
          }
        }
      }
    }
  }
  // the strand is planted (spec §3 A): its planted trees count in both columns
  const fixed = veg.fixed || {}
  for (const k of PLANTED) {
    for (const p of fixed[k] || []) {
      if (!inside(p.x, p.z)) continue
      const g = ground.at(p.x, p.z)
      if (!ZONES[g.zone].planted) continue
      code[g.zone][SI[k]]++
      rules[g.zone][SI[k]]++
    }
  }
  return { area, code, rules, breach, cards, lowland, unknown, secs: (Date.now() - t0) / 1000 }
}

// --- report -------------------------------------------------------------------------------------

const pct = (v, t) => (t ? (100 * v) / t : 0)
const fmt = (v) => (v >= 9.95 ? v.toFixed(0) : v.toFixed(1)).padStart(5)
const thousands = (v) => Math.round(v).toLocaleString('en-US')
const quant = (a, p) => {
  if (!a.length) return NaN
  const s = a.slice().sort((x, y) => x - y)
  return s[Math.min(s.length - 1, Math.floor(p * s.length))]
}

function report(ctx, r) {
  const { veg, island, ground } = ctx
  const { code, rules, breach, cards, area } = r
  let flags = 0
  console.log(`\nseed ${ctx.seed}${area ? `, ${area.label}` : ''}  [${(ctx.secs + r.secs).toFixed(1)} s]`)
  if (Object.keys(r.unknown).length) console.log(`  (kinds this audit doesn't know: ${Object.entries(r.unknown).map(([k, v]) => `${k} ${v}`).join(', ')})`)
  console.log("\n  species per zone: % of the zone's trees, the code / the spec's rules / the spec's table; hāpuʻu per canopy tree")
  for (let z = 0; z < ZONES.length; z++) {
    const Zd = ZONES[z]
    const cT = TREES.reduce((a, k) => a + code[z][SI[k]], 0)
    const rT = TREES.reduce((a, k) => a + rules[z][SI[k]], 0)
    if (cT + rT === 0) continue
    const canopy = (A) => A[SI.ohia] + A[SI.ohiaDry] + A[SI.ohiaKrumm] + A[SI.olapa] + A[SI.koa]
    const hc = code[z][HAPUU] / Math.max(1, canopy(code[z]))
    const hr = rules[z][HAPUU] / Math.max(1, canopy(rules[z]))
    console.log(`\n  ${Zd.id.padEnd(4)}${Zd.name.padEnd(38)} trees ${thousands(cT).padStart(7)} / ${thousands(rT).padStart(7)}   hāpuʻu ${hc.toFixed(2)} / ${hr.toFixed(2)}${Zd.planted ? '   (with the planted trees)' : ''}`)
    const lines = []
    for (const k of TREES) {
      const a = pct(code[z][SI[k]], cT)
      const b = pct(rules[z][SI[k]], rT)
      const tb = Zd.table ? Zd.table[k] || 0 : null
      if (a < 0.5 && b < 0.5 && !tb) continue
      let mark = ' '
      if (Zd.byTable) mark = cT >= 100 && Math.abs(a - tb) > 15 ? '!' : ' '
      else if (rT >= 300 && cT >= 100) {
        const few = b >= 3 && a < 0.4 * b
        const many = a >= 3 && a > 2.5 * b + 1
        if (few || many || Math.abs(a - b) >= 10) mark = '!'
      }
      if (mark === ' ' && tb !== null && Math.abs(a - tb) > 15) mark = '~'
      if (mark === '!') flags++
      lines.push(`     ${mark} ${NAME[k].padEnd(17)} ${fmt(a)} ${fmt(b)} ${tb === null ? '    ·' : fmt(tb)}`)
    }
    console.log(lines.join('\n'))
    if (cT >= 100 && rT >= 100 && Math.abs(code[z][HAPUU] - rules[z][HAPUU]) >= 100 && (hc > 1.6 * hr + 0.02 || hr > 1.6 * hc + 0.02)) {
      flags++
      console.log(`     ! hāpuʻu ${hc.toFixed(2)} per canopy tree against the rules' ${hr.toFixed(2)}`)
    }
  }

  // (the "do not" lists outrank the rules, which only approximate them: a
  // breach the rules share is still a breach, marked so)
  console.log('\n  range breaches (spec §4 "do not"): the code / the rules')
  let any = false
  for (let q = 0; q < RANGE.length; q++) {
    const b = breach[q]
    if (!b.code && !b.rules) continue
    any = true
    const bad = b.code > 25
    if (bad) flags++
    const note = bad && b.rules > b.code / 2 ? '  (the rules too)' : ''
    console.log(`   ${bad ? '!' : ' '} ${NAME[RANGE[q][0]].padEnd(17)} ${RANGE[q][1].padEnd(46)} ${thousands(b.code).padStart(6)} / ${thousands(b.rules).padStart(6)}${note}`)
    if (list) for (const e of b.eg) console.log(`         ${e}`)
  }
  if (!any) console.log('     none')

  console.log('\n  where each species grows (the code): elevation and rain p05/p50/p95, % windward for its height, % in the farmed band (< 460 m), landform')
  for (const k of SPECIES) {
    const c = cards[k]
    if (!c.n) continue
    const m = [0.05, 0.5, 0.95].map((p) => quant(c.m, p).toFixed(0).padStart(4)).join(' ')
    const mm = [0.05, 0.5, 0.95].map((p) => thousands(quant(c.mm, p)).padStart(6)).join(' ')
    const other = c.n - c.floor - c.gulch - c.ridge
    console.log(`     ${NAME[k].padEnd(17)} ${thousands(c.n).padStart(7)}   ${m} m  ${mm} mm  wind ${fmt(pct(c.wind, c.n))}  farmed ${fmt(pct(c.farmed, c.n))}  floor ${fmt(pct(c.floor, c.n))} gulch ${fmt(pct(c.gulch, c.n))} ridge ${fmt(pct(c.ridge, c.n))} other ${fmt(pct(other, c.n))}`)
  }

  // groves: of a tree's neighbours within 35 m, the share that are its own species, against
  // that species' share of the lowland — about 1× is salt-and-pepper, a grove is several times it
  console.log('\n  clumping in the farmed lowland (D1–D3, E): own-species share of neighbours within 35 m ÷ share of all trees; the code / the rules')
  const clump = (trees) => {
    const b = binned(trees.map((t) => [t[0], t[1], t[2]]), 0.35)
    const all = new Float64Array(S_N)
    const same = new Float64Array(S_N)
    const nb = new Float64Array(S_N)
    for (const t of trees) all[t[2]]++
    for (const [x, z, s] of trees) {
      b.near(x, z, (k, px, pz) => {
        const d2 = (px - x) ** 2 + (pz - z) ** 2
        if (d2 > 0.35 * 0.35 || d2 === 0) return
        nb[s]++
        if (k === s) same[s]++
      })
    }
    return (k) => ({ share: all[k] / Math.max(1, trees.length), near: same[k] / Math.max(1, nb[k]), n: all[k] })
  }
  const cc = clump(r.lowland.code)
  const clumpAi = cc(SI.ohiaai)
  const cr = clump(r.lowland.rules)
  for (const k of ['kukui', 'ohiaai', 'hala', 'hau', 'ohia']) {
    const a = cc(SI[k])
    const b = cr(SI[k])
    if (!a.n && !b.n) continue
    const ka = a.near / Math.max(1e-9, a.share)
    const kb = b.near / Math.max(1e-9, b.share)
    console.log(`     ${NAME[k].padEnd(17)} share ${fmt(100 * a.share)}%  own-species neighbours ${fmt(100 * a.near)}%  ×${ka.toFixed(1).padStart(4)}   /  ${fmt(100 * b.share)}%  ${fmt(100 * b.near)}%  ×${kb.toFixed(1).padStart(4)}`)
  }

  // the planted trees (the whole island's, whatever the area)
  const fixed = veg.fixed || {}
  if (!area) {
    console.log('\n  planted (fixed): ' + Object.entries(fixed).map(([k, l]) => `${k} ${l.length}`).join(', '))
    const sites = island.meta.sites
    const villageNear = (x, z, R) => sites.villages.some((v) => Math.hypot(v.x - x, v.z - z) < R)
    const waterNear = (x, z) => {
      if (ground.bank(x, z) < 0.35 || ground.metres(x, z) < 8) return true
      if (sites.ponds.some((p) => Math.hypot(p.cx - x, p.cz - z) < p.r + 0.6)) return true
      for (const c of sites.loi) for (const a of c.auwai || []) for (let i = 1; i < a.length; i++) if (segDist(x, z, a[i - 1][0], a[i - 1][1], a[i][0], a[i][1]) < 0.15) return true
      return false
    }
    const share = (l, f) => (l && l.length ? l.filter((t) => f(t)).length / l.length : 1)
    const fixedChecks = [
      // (the shore trail's band reaches ~31 m: y 0.4)
      ['hala on the shore (< 35 m) or at a village', share(fixed.hala, (t) => ground.metres(t.x, t.z) < 35 || villageNear(t.x, t.z, 0.9)), 0.9],
      ['hala below 610 m', share(fixed.hala, (t) => ground.metres(t.x, t.z) < 610), 1],
      ['hau by water (stream, ʻauwai, pond, estuary)', share(fixed.hau, (t) => waterNear(t.x, t.z)), 0.75],
      ['niu at a village or on the shore (< 35 m)', share(fixed.niu, (t) => villageNear(t.x, t.z, 0.9) || ground.metres(t.x, t.z) < 35), 0.95],
      ['milo and kou at the coast (< 60 m)', share([...(fixed.milo || []), ...(fixed.kou || [])], (t) => ground.metres(t.x, t.z) < 60), 0.95],
      ['ʻōhiʻa ʻai below 550 m', share(fixed.ohiaai, (t) => ground.metres(t.x, t.z) < 550), 1],
      ['kukui below 670 m', share(fixed.kukui, (t) => ground.metres(t.x, t.z) < 670), 1],
    ]
    for (const [what, v, need] of fixedChecks) {
      const bad = v < need
      if (bad) flags++
      console.log(`   ${bad ? '!' : ' '} ${what.padEnd(50)} ${fmt(100 * v)}%  (want ≥ ${(100 * need).toFixed(0)}%)`)
    }
    const ki = (fixed.ki || []).length
    const kiRed = (fixed.kiRed || []).length
    const red = pct(kiRed, ki + kiRed)
    console.log(`   ${red > 5 ? '!' : ' '} ${'red kī (≤ 5% until a source confirms it)'.padEnd(50)} ${fmt(red)}%`)
    if (red > 5) flags++
    const loulu = (fixed.loulu || []).length
    console.log(`   ${loulu < 100 || loulu > 450 ? '!' : ' '} ${'loulu (spec target 150–400)'.padEnd(50)} ${String(loulu).padStart(5)}`)
    if (loulu < 100 || loulu > 450) flags++
  }

  // the corrections the research asked for
  console.log('\n  corrections the research asked for')
  const zsum = (A, ids, ks) => ids.reduce((a, id) => a + ks.reduce((b, k) => b + A[ZI[id]][SI[k]], 0), 0)
  const all = (A, ids) => zsum(A, ids, TREES)
  const breachOf = (k, what) => breach[RANGE.findIndex((q) => q[0] === k && q[1].startsWith(what))].code
  const floorOhia = OHIA_FORMS.map((k) => breachOf(k, 'on a farmed valley'))
  const D12 = ['D1', 'D2']
  const kukAi = pct(zsum(code, D12, ['kukui', 'ohiaai']), all(code, D12))
  const kuk = pct(zsum(code, D12, ['kukui']), all(code, D12))
  const aiShare = pct(zsum(code, D12, ['ohiaai']), all(code, D12))
  const F = code[ZI.F]
  const fT = F[SI.ohia] + F[SI.koa] + F[SI.ohiaKrumm] + F[SI.olapa]
  const hapF = F[HAPUU] / Math.max(1, fT)
  const G = code[ZI.G]
  const gT = TREES.reduce((a, k) => a + G[SI[k]], 0)
  const krummOlapa = pct(G[SI.ohiaKrumm] + G[SI.olapa], gT)
  const olapa = pct(G[SI.olapa], gT)
  const tallG = pct(G[SI.ohia], gT)
  const ridgeG = breachOf('ohia', 'tall on')
  const subalpine = ['koa', 'lama', 'aalii', 'wiliwili'].reduce((a, k) => a + breach[RANGE.findIndex((q) => q[0] === k && q[1].includes('1,300'))].code, 0)
  const B = code[ZI.B]
  const bT = TREES.reduce((a, k) => a + B[SI[k]], 0)
  const dry4 = ['wiliwili', 'lama', 'aalii', 'ohiaDry'].map((k) => pct(B[SI[k]], bT))
  const hauC = cards.hau
  const hauBank = quant(hauC.bank, 0.5)
  const hauNear = hauC.bank.length ? hauC.bank.filter((b) => b < 0.3).length / hauC.bank.length : 1
  const halaCoast = (fixed.hala || []).length ? fixed.hala.filter((t) => ground.metres(t.x, t.z) < 35).length / fixed.hala.length : 1
  const K = code[ZI.K]
  const kT = TREES.reduce((a, k) => a + K[SI[k]], 0)
  const kDry = pct(K[SI.wiliwili] + K[SI.lama] + K[SI.aalii] + K[SI.ohiaDry], kT)
  // [what, enough trees to judge, passes, detail]
  const enough = (v) => v >= 100
  const checks = [
    // (as a range breach: a handful where the rain jitter crosses a boundary is no stand)
    ['no ʻōhiʻa lehua, any form, on the farmed valley floors (D1, by the loʻi)', true, floorOhia.every((v) => v <= 25), `${floorOhia[0]} tall, ${floorOhia[1]} dry form, ${floorOhia[2]} stunted`],
    ['kukui and ʻōhiʻa ʻai fill the windward lowland valleys and gulches (D1+D2)', all(code, D12) >= 300, kukAi >= 50 && kuk >= 10 && aiShare >= 8, `kukui ${kuk.toFixed(0)}%, ʻōhiʻa ʻai ${aiShare.toFixed(0)}%`],
    ['ʻōhiʻa ʻai in groves (≥ 40% of its neighbours within 35 m are ʻōhiʻa ʻai)', enough(clumpAi.n), clumpAi.near >= 0.4, `${(100 * clumpAi.near).toFixed(0)}% (its share of the lowland ${(100 * clumpAi.share).toFixed(0)}%)`],
    ['hāpuʻu under the wet ʻōhiʻa (F: 0.3–0.65 per canopy tree)', enough(fT), hapF >= 0.3 && hapF <= 0.65, `${hapF.toFixed(2)} per canopy tree`],
    ['stunted ʻōhiʻa and ʻōlapa at the summit (G: ≥ 85%, ʻōlapa 20–35%, tall ≤ 10%)', enough(gT), krummOlapa >= 85 && olapa >= 20 && olapa <= 35 && tallG <= 10, `${krummOlapa.toFixed(0)}% (ʻōlapa ${olapa.toFixed(0)}%), tall ${tallG.toFixed(1)}%`],
    ['no tall ʻōhiʻa on the summit ridges', true, ridgeG === 0, `${ridgeG} trees`],
    ['no subalpine māmane/naio belt (no koa, lama, ʻaʻaliʻi, wiliwili above 1,300 m)', true, subalpine === 0, `${subalpine} trees`],
    ['dry leeward: wiliwili, lama, ʻaʻaliʻi and dry-form ʻōhiʻa each ≥ 8% (B)', enough(bT), dry4.every((v) => v >= 8), dry4.map((v) => v.toFixed(0) + '%').join(', ')],
    ['the kula is dry ground (K: those four ≥ 60% of its trees, spec §3)', kT >= 30, kDry >= 60, `${kDry.toFixed(0)}% of ${thousands(kT)} trees`],
    ['hau along the streams (median ≤ 15 m from a bank, ≥ 95% within 30 m)', hauC.n >= 30, hauBank <= 0.15 && hauNear >= 0.95, hauC.n ? `median ${(hauBank * 100).toFixed(0)} m, ${(100 * hauNear).toFixed(0)}% within 30 m` : 'no hau'],
    ['hala at the coast (≥ 50% of the planted hala on the shore, < 35 m)', !area, halaCoast >= 0.5, `${(100 * halaCoast).toFixed(0)}%`],
  ]
  for (const [what, judged, ok, detail] of checks) {
    if (judged && !ok) flags++
    console.log(`   ${!judged ? 'n/a ' : ok ? 'ok  ' : 'FAIL'} ${what.padEnd(82)} ${detail}`)
  }
  console.log(`\n  seed ${ctx.seed}${area ? `, ${area.label}` : ''}: ${flags} flagged`)
  return flags
}

let total = 0
for (const seed of seeds) {
  const ctx = prepare(seed)
  for (const area of areas) total += report(ctx, tally(ctx, area))
}
console.log(`\ntotal flagged: ${total}`)
