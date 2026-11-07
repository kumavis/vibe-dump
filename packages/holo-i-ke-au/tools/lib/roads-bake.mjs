// The ground the highways were cut into and raised on, laid back for the
// years before each road (DATA.md, "Patches, on any pack", "Accepted
// extensions (restore)"). Writes `restore` patches: per pack and road
// section, the change from today's heights to the ground as it was, over the
// texels the road disturbed.
//
// For each pack the roads go on (the oahu island pack and the districts on
// it), and every highway `road` of the works (works/oahu.geojson; the works
// cut a road at its tunnels' portals, so the ground over a tunnel is never
// in a road's reach and only the portals' cuts are found):
//
// 1. How wide each side of each CHUNK of road the ground was disturbed: the
//    ground's curvature, averaged along the stretch at each distance from the
//    road's edge, against its mean further out. The breaks of slope at the
//    top of a cut and the toe of a fill run along the road and stand out of
//    the mean at their distance; the gullies that cross it average out. Out
//    to BAND, or JUNCTION_BAND at an interchange (where two roads meet, and
//    the ramps the works do not draw spread the grading). On the island pack,
//    whose texel is wider than a road, the road's strip alone.
// 2. Those texels, on land, off the shore and the pack's harbour patches.
// 3. The ground as it was: a thin plate (biharmonic) over them from today's
//    ground round them, which carries the slopes and the curvature of the
//    valley sides in across the corridor and meets today's ground at the edge
//    with no step; the membrane (Laplace), which cannot sag or bulge, where
//    the plate would leave the range of the undisturbed ground round it, and
//    on the island pack throughout.
// 4. Each texel goes to the road nearest it; each road section's texels are
//    one patch, dated by its section of the works: the earlier of the start
//    of its `built` and its `from`, when the grading began as far as the
//    works record it.
//
// The bake reads the packs' heights and the works, and writes only
// public/data/patches/roads/ and the restore entries of
// patches/manifest.json, which it puts at the end of the list, leaving every
// other entry as it was.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { KX, KZ, gridFromBounds } from './geo.mjs'
import { encodePNG, readPNG } from './png.mjs'
import { readPack } from './layers-raster.mjs'

export const DELTA = { scale: 0.01, offset: -327.68 } // the change, metres = (R·256 + G)·scale + offset; B the weight
const CORE = 8 // metres past a road's edge always taken (its shoulders)
const BAND = 90 // metres past its edge searched for its cut or fill
const JUNCTION_BAND = 200 // ... at an interchange
const OUTER = 50 // the ground's own curvature is read this far past the band
const CHUNK = 200 // metres of road over which the curvature is averaged, a side at a time
const RATIO = 1.5 // a distance is disturbed where the stretch's curvature there passes this times the ground's own ...
const MIN_CURV = 0.004 // ... and this (1/m)
const GAP = 3 // the disturbed ground ends this many texels before quiet ground does
const JUNCTION_RADIUS = 320 // metres round a meeting of two roads that count as its interchange
const MEET = 60 // an end of one road this close to another road is a meeting
const PORTAL = 40 // ... unless it is this close to a tunnel's end (the road goes on through the tunnel)
const MIN_TEXELS_M2 = 2500 // a road section's patch smaller than this (m²) on a pack is left out
const MIN_CHANGE = 3 // ... as is one that nowhere changes the ground by this much
const REACH = 150 // metres round a laid-back texel whose undisturbed ground bounds it
const COAST = 15 // metres from the sea a restore keeps (two texels at the least)
const SHORE = 0.5 // ground this low (today or as laid back) is the shore's, the harbour patches', not a road's

const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

/** The packs the roads go on: the oahu island pack and the Oʻahu districts. */
export function roadPacks(data) {
  const islands = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const out = [{ id: 'oahu', kind: 'island', entry: islands.packs.find((p) => p.id === 'oahu'), dataDir: data }]
  const dPath = join(data, 'districts', 'manifest.json')
  if (existsSync(dPath)) for (const d of JSON.parse(readFileSync(dPath, 'utf8')).districts) if (d.island === 'oahu') out.push({ id: d.id, kind: 'district', entry: d, dataDir: join(data, 'districts') })
  return out
}

/** The highway roads and tunnels of the works on Oʻahu. */
export function readRoads(data) {
  const g = JSON.parse(readFileSync(join(data, 'works', 'oahu.geojson'), 'utf8'))
  const hw = g.features.filter((f) => f.properties.kind === 'highway' && f.geometry.type === 'LineString')
  return { roads: hw.filter((f) => f.properties.part === 'road'), tunnels: hw.filter((f) => f.properties.part === 'tunnel') }
}

/** A road's year: the earlier of the start of its building and its opening. */
export const roadUntil = (p) => Math.min(p.from, ...(Array.isArray(p.built) ? [p.built[0]] : []))

/** A road's width in metres, as the app draws it (DATA.md "Works", Widths). */
const roadWidth = (p) => p.width ?? (p.lanes ? p.lanes * 3.6 + 2 : { interstate: 24, state: 12, county: 8 }[p.class] ?? 8)

/** Distance from (x, y) to segment a–b, all in metres. */
function segDist(x, y, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const L = dx * dx + dy * dy
  const t = L > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0
  return Math.hypot(x - ax - t * dx, y - ay - t * dy)
}
const lineDist = (x, y, pts) => {
  let d = Infinity
  for (let k = 1; k < pts.length; k++) d = Math.min(d, segDist(x, y, pts[k - 1][0], pts[k - 1][1], pts[k][0], pts[k][1]))
  return d
}

/** Where two roads meet (an end of one by another, not at a tunnel's portal), in lon/lat-free metres on the plane (KX, KZ). */
export function junctions(roads, tunnels) {
  const P = (c) => [c[0] * KX, -c[1] * KZ]
  const lines = roads.map((f) => f.geometry.coordinates.map(P))
  const portals = tunnels.flatMap((f) => [f.geometry.coordinates[0], f.geometry.coordinates.at(-1)].map(P))
  const out = []
  roads.forEach((f, a) => {
    for (const end of [lines[a][0], lines[a].at(-1)]) {
      if (portals.some((q) => Math.hypot(q[0] - end[0], q[1] - end[1]) < PORTAL)) continue
      const by = roads.map((g, b) => (b !== a && lineDist(end[0], end[1], lines[b]) < MEET ? g.properties.id : null)).filter(Boolean)
      if (by.length && !out.some((q) => Math.hypot(q.p[0] - end[0], q.p[1] - end[1]) < JUNCTION_RADIUS / 2)) out.push({ p: end, roads: [f.properties.id, ...by] })
    }
  })
  return out
}

// ---------------------------------------------------------------------------
// Solvers over a set of unknown texels, the rest held at their values

/**
 * Solve over the texels `U` (indices into a W × H field `f`, which holds the
 * known values everywhere else): `order` 1 a membrane (∇²u = 0), 2 a thin
 * plate (∇⁴u = 0), by conjugate gradients; `f` on U is the first guess and is
 * overwritten with the answer. Every texel of U must lie at least two texels
 * inside the field.
 */
export function solve(f, W, H, U, order, { tol = 1e-4, maxIter = 6000 } = {}) {
  const n = U.length
  if (!n) return 0
  const slot = new Int32Array(W * H).fill(-1)
  for (let k = 0; k < n; k++) slot[U[k]] = k
  // the texels the Laplacian is needed on for a thin plate: U and its four neighbours
  let S = U
  if (order === 2) {
    const seen = new Uint8Array(W * H)
    const s = []
    for (const o of U) for (const q of [o, o - 1, o + 1, o - W, o + W]) if (!seen[q]) (seen[q] = 1), s.push(q)
    S = Int32Array.from(s)
  }
  const lap = (g, o) => g[o - 1] + g[o + 1] + g[o - W] + g[o + W] - 4 * g[o]
  // A x for x on U (zero elsewhere): −∇² (membrane) or ∇⁴ (plate), restricted to U
  const field = new Float64Array(W * H)
  const L1 = new Float64Array(W * H)
  const apply = (x, out) => {
    for (let k = 0; k < n; k++) field[U[k]] = x[k]
    if (order === 1) for (let k = 0; k < n; k++) out[k] = -lap(field, U[k])
    else {
      for (const o of S) L1[o] = lap(field, o)
      for (let k = 0; k < n; k++) out[k] = lap(L1, U[k])
    }
    for (let k = 0; k < n; k++) field[U[k]] = 0
  }
  // b = −A k: the known values' pull on U
  const known = new Float64Array(W * H)
  for (const o of order === 1 ? U : S) for (const q of [o, o - 1, o + 1, o - W, o + W]) if (slot[q] < 0) known[q] = f[q]
  if (order === 2) for (const o of S) for (const q of [o - 1, o + 1, o - W, o + W]) for (const r of [q - 1, q + 1, q - W, q + W]) if (r >= 0 && r < W * H && slot[r] < 0) known[r] = f[r]
  const b = new Float64Array(n)
  if (order === 1) for (let k = 0; k < n; k++) b[k] = lap(known, U[k])
  else {
    for (const o of S) L1[o] = lap(known, o)
    for (let k = 0; k < n; k++) b[k] = -lap(L1, U[k])
  }
  const x = new Float64Array(n)
  for (let k = 0; k < n; k++) x[k] = f[U[k]]
  const r = new Float64Array(n)
  const p = new Float64Array(n)
  const Ap = new Float64Array(n)
  apply(x, Ap)
  let rr = 0
  let bb = 0
  for (let k = 0; k < n; k++) {
    r[k] = b[k] - Ap[k]
    p[k] = r[k]
    rr += r[k] * r[k]
    bb += b[k] * b[k]
  }
  const stop = tol * tol * Math.max(bb, 1e-12)
  let it = 0
  for (; it < maxIter && rr > stop; it++) {
    apply(p, Ap)
    let pAp = 0
    for (let k = 0; k < n; k++) pAp += p[k] * Ap[k]
    const a = rr / pAp
    let rr1 = 0
    for (let k = 0; k < n; k++) {
      x[k] += a * p[k]
      r[k] -= a * Ap[k]
      rr1 += r[k] * r[k]
    }
    const beta = rr1 / rr
    rr = rr1
    for (let k = 0; k < n; k++) p[k] = r[k] + beta * p[k]
  }
  for (let k = 0; k < n; k++) f[U[k]] = x[k]
  return it
}

// ---------------------------------------------------------------------------
// One pack

/** The weights the pack's harbour patches put on each texel, as one mask (any weight). */
function harbourMask(data, manifest, pk, W, H) {
  const m = new Uint8Array(W * H)
  for (const e of manifest.patches) {
    if (e.pack !== pk.id || e.kind === 'restore') continue
    const img = readPNG(join(data, e.file))
    if (img.width !== W || img.height !== H) continue
    for (let o = 0; o < W * H; o++) if (img.data[o * img.channels]) m[o] = 1
  }
  if (pk.kind === 'district') for (const q of pk.entry.patches || []) {
    const img = readPNG(join(data, 'districts', q.file))
    if (img.width !== W || img.height !== H) continue
    for (let o = 0; o < W * H; o++) if (img.data[o * img.channels]) m[o] = 1
  }
  return m
}

/** One pack's restore patches: [{ road, texels, box, bytes, stats }]. */
export function bakePack(pk, { roads, tunnels, joins, data, manifest, log }) {
  const P = readPack(pk.dataDir, pk.entry)
  const { W, H, metres } = P
  const grid = gridFromBounds(pk.entry.bounds, W, H)
  const [mx, mz] = grid.metresPerTexel
  const [west, , , north] = pk.entry.bounds
  // texel centres in metres on the plane: x east, y south, from the pack's north-west corner
  const toXY = (c) => [((c[0] - west) / grid.dLon) * mx, ((north - c[1]) / grid.dLat) * mz]
  const tx = (o) => ((o % W) + 0.5) * mx
  const ty = (o) => (Math.floor(o / W) + 0.5) * mz
  const step = Math.min(mx, mz)
  // (on the island pack a road is narrower than a texel: its strip at least half a texel's diagonal)
  const coreMin = 0.75 * Math.hypot(mx, mz)
  const lines = roads.map((f) => f.geometry.coordinates.map(toXY))
  const jxy = joins.map((j) => toXY([j.p[0] / KX, -j.p[1] / KZ]))
  const harbour = harbourMask(data, manifest, pk, W, H)

  // 1. for each texel near a road: the nearest road, how far from its line, on which side, how far along it
  const near = new Int16Array(W * H).fill(-1)
  const dist = new Float32Array(W * H).fill(Infinity)
  const side = new Int8Array(W * H)
  const along = new Float32Array(W * H)
  const lengths = []
  roads.forEach((f, ri) => {
    const hw = roadWidth(f.properties) / 2
    const pts = lines[ri]
    const far = hw + JUNCTION_BAND + OUTER
    let cum = 0
    for (let k = 1; k < pts.length; k++) {
      const [ax, ay] = pts[k - 1]
      const [bx, by] = pts[k]
      const dx = bx - ax
      const dy = by - ay
      const L2 = dx * dx + dy * dy
      const L = Math.sqrt(L2)
      const i0 = Math.max(2, Math.floor((Math.min(ax, bx) - far) / mx))
      const i1 = Math.min(W - 3, Math.ceil((Math.max(ax, bx) + far) / mx))
      const j0 = Math.max(2, Math.floor((Math.min(ay, by) - far) / mz))
      const j1 = Math.min(H - 3, Math.ceil((Math.max(ay, by) + far) / mz))
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const o = j * W + i
          const x = tx(o) - ax
          const y = ty(o) - ay
          const t = L2 > 0 ? Math.max(0, Math.min(1, (x * dx + y * dy) / L2)) : 0
          const d = Math.hypot(x - t * dx, y - t * dy) - hw
          if (d < dist[o]) {
            dist[o] = d
            near[o] = ri
            side[o] = x * dy - y * dx >= 0 ? 1 : 0
            along[o] = cum + t * L
          }
        }
      }
      cum += L
    }
    lengths.push(cum)
  })
  // (and off the sea's edge: the sea floor beside a coastal road would pull the plate down into it)
  const seaNear = new Uint8Array(W * H)
  const r = Math.max(2, Math.round(COAST / step))
  for (let o = 0; o < W * H; o++) {
    if (metres[o] > 0) continue
    const i = o % W
    const j = (o - i) / W
    for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
      const a = i + di
      const b = j + dj
      if (a >= 0 && b >= 0 && a < W && b < H) seaNear[b * W + a] = 1
    }
  }
  const land = (o) => metres[o] > SHORE && !harbour[o] && !seaNear[o]
  const inJunction = (x, y) => jxy.some(([jx, jy]) => Math.hypot(x - jx, y - jy) < JUNCTION_RADIUS)

  // 2. how far each side of each stretch of road the ground was disturbed:
  // where the ground's curvature, averaged along the stretch at each distance
  // from the road's edge, stands above what it is further out (the slope's
  // breaks at the top of a cut and the toe of a fill run along the road; the
  // gullies that cross it average out)
  const widths = roads.map((f, ri) => {
    const n = Math.max(1, Math.round(lengths[ri] / CHUNK))
    return { n, chunk: lengths[ri] / n, w: new Float32Array(n * 2).fill(0) }
  })
  const fine = step < 30
  if (fine) {
    const B = Math.ceil((JUNCTION_BAND + OUTER) / step)
    const sums = roads.map((f, ri) => ({ s: new Float64Array(widths[ri].n * 2 * B), c: new Uint32Array(widths[ri].n * 2 * B) }))
    for (let o = 0; o < W * H; o++) {
      const ri = near[o]
      if (ri < 0 || dist[o] >= B * step || !land(o)) continue
      const R = widths[ri]
      const c = Math.min(R.n - 1, Math.floor(along[o] / R.chunk))
      const b = Math.max(0, Math.floor(dist[o] / step))
      const k = (c * 2 + side[o]) * B + b
      const curv = Math.abs(metres[o - 1] + metres[o + 1] + metres[o - W] + metres[o + W] - 4 * metres[o]) / (step * step)
      sums[ri].s[k] += curv
      sums[ri].c[k]++
    }
    roads.forEach((f, ri) => {
      const R = widths[ri]
      const pts = lines[ri]
      for (let c = 0; c < R.n; c++) {
        // (a stretch at an interchange is searched further out: the ramps the works do not draw)
        const mid = pointAlong(pts, (c + 0.5) * R.chunk)
        const band = inJunction(mid[0], mid[1]) ? JUNCTION_BAND : BAND
        const nb = Math.ceil(band / step)
        const no = Math.ceil(OUTER / step)
        for (let sd = 0; sd < 2; sd++) {
          const at = (b) => {
            const k = (c * 2 + sd) * B + b
            return sums[ri].c[k] >= 3 ? sums[ri].s[k] / sums[ri].c[k] : NaN
          }
          let bs = 0
          let bn = 0
          for (let b = nb; b < nb + no && b < B; b++) if (Number.isFinite(at(b))) (bs += at(b)), bn++
          if (!bn) continue
          const base = bs / bn
          let last = -1
          let quiet = 0
          for (let b = 0; b < nb; b++) {
            const v = at(b)
            if (Number.isFinite(v) && v > base * RATIO + MIN_CURV) {
              last = b
              quiet = 0
            } else if (++quiet >= GAP) break
          }
          R.w[c * 2 + sd] = (last + 1) * step
        }
      }
      // (a stretch's width as the median of it and its neighbours: one odd stretch neither opens nor shuts the corridor)
      const w = Float32Array.from(R.w)
      for (let c = 0; c < R.n; c++)
        for (let sd = 0; sd < 2; sd++) {
          const v = [c - 1, c, c + 1].filter((q) => q >= 0 && q < R.n).map((q) => w[q * 2 + sd]).sort((a, b) => a - b)
          R.w[c * 2 + sd] = v[Math.floor(v.length / 2)]
        }
    })
  }
  // the disturbed ground: within each side's width of the road (its strip at least), on land, off the harbours
  const inside = (o) => o % W >= 2 && o % W < W - 2 && o >= 2 * W && o < (H - 2) * W
  const U2 = []
  for (let o = 0; o < W * H; o++) {
    const ri = near[o]
    if (ri < 0 || !land(o) || !inside(o)) continue
    const R = widths[ri]
    const c = Math.min(R.n - 1, Math.floor(along[o] / R.chunk))
    const reach = Math.max(CORE, R.w[c * 2 + side[o]] + step)
    if (dist[o] <= reach || dist[o] + roadWidth(roads[ri].properties) / 2 <= coreMin) U2.push(o)
  }
  if (!U2.length) return []
  // 3. the plate over it, from a membrane's guess; and 4. by road. A texel
  // the plate would lay at the shore, and a road whose patch is too small to
  // keep, go back to today's ground, and the plate is laid again without
  // them, so the texels kept never lean on ground that is not laid back
  let U = Int32Array.from(U2)
  let g
  let byRoad
  for (let pass = 0; ; pass++) {
    g = new Float64Array(metres)
    const it1 = solve(g, W, H, U, 1, { tol: 1e-7 })
    let it2 = 0
    if (fine) {
      // (the plate where it keeps within the undisturbed ground round it; the membrane, which always does, where it would not)
      const m = Float64Array.from(U, (o) => g[o])
      it2 = solve(g, W, H, U, 2, { tol: 1e-7, maxIter: 20000 })
      const inU = new Uint8Array(W * H)
      for (const o of U) inU[o] = 1
      const { lo, hi, at } = groundRange(metres, W, H, inU, Math.round(REACH / step), U)
      let held = 0
      U.forEach((o, k) => {
        const q = at(o)
        if (g[o] > hi[q] || g[o] < lo[q]) (g[o] = m[k]), held++
      })
      if (held) log(`    ${held} texels where the plate leaves the ground round it laid by the membrane`)
    }
    byRoad = new Map()
    for (const o of U) {
      const t = g[o]
      if (t <= SHORE) continue
      if (!byRoad.has(near[o])) byRoad.set(near[o], [])
      byRoad.get(near[o]).push([o, t - metres[o]])
    }
    for (const [ri, list] of byRoad) {
      const big = list.reduce((m, [, d]) => Math.max(m, Math.abs(d)), 0)
      if (list.length * mx * mz < MIN_TEXELS_M2 || big < MIN_CHANGE) {
        if (pass === 0) log(`    ${roads[ri].properties.id}: ${list.length} texels, at most ${big.toFixed(1)} m; left out`)
        byRoad.delete(ri)
      }
    }
    const kept = [...byRoad.values()].reduce((s, l) => s + l.length, 0)
    log(`  ${pk.id}: disturbed ${U.length} texels (membrane in ${it1} steps, plate in ${it2}), ${kept} kept`)
    if (kept === U.length || pass === 4) break
    U = Int32Array.from([...byRoad.values()].flatMap((l) => l.map(([o]) => o)))
  }
  const out = []
  for (const [ri, list] of byRoad) {
    const area = list.length * mx * mz
    const road = roads[ri].properties
    let i0 = W, j0 = H, i1 = -1, j1 = -1
    for (const [o] of list) {
      const i = o % W
      const j = (o - i) / W
      i0 = Math.min(i0, i)
      i1 = Math.max(i1, i)
      j0 = Math.min(j0, j)
      j1 = Math.max(j1, j)
    }
    const w = i1 - i0 + 1
    const h = j1 - j0 + 1
    const bytes = new Uint8Array(w * h * 3)
    const zero = Math.round(-DELTA.offset / DELTA.scale)
    for (let k = 0; k < w * h; k++) {
      bytes[k * 3] = zero >> 8
      bytes[k * 3 + 1] = zero & 255
    }
    let cut = 0, fill = 0, cutN = 0, fillN = 0, maxCut = 0, maxFill = 0
    for (const [o, dh] of list) {
      const i = o % W
      const j = (o - i) / W
      const v = Math.max(0, Math.min(65535, Math.round((dh - DELTA.offset) / DELTA.scale)))
      const k = (j - j0) * w + (i - i0)
      bytes[k * 3] = v >> 8
      bytes[k * 3 + 1] = v & 255
      bytes[k * 3 + 2] = 255
      // (a cut is ground taken away: the ground as it was stands higher)
      if (dh > 0) (cut += dh), cutN++, (maxCut = Math.max(maxCut, dh))
      else (fill -= dh), fillN++, (maxFill = Math.max(maxFill, -dh))
    }
    // the width the road disturbed: its texels' area over its length on the pack
    const len = lengthIn(lines[ri], W * mx, H * mz)
    out.push({
      road: roads[ri],
      box: [i0, j0, w, h],
      png: encodePNG(w, h, bytes, 3),
      stats: {
        texels: list.length,
        km2: round(area / 1e6, 3),
        meanWidthMetres: len > 0 ? Math.round(area / len) : null,
        cutTexels: cutN,
        fillTexels: fillN,
        meanCutMetres: cutN ? round(cut / cutN, 1) : 0,
        meanFillMetres: fillN ? round(fill / fillN, 1) : 0,
        maxCutMetres: round(maxCut, 1),
        maxFillMetres: round(maxFill, 1),
      },
    })
    log(`    ${road.id}: ${list.length} texels (${round(area / 1e6, 3)} km²), cut ${cutN} to ${maxCut.toFixed(1)} m, fill ${fillN} to ${maxFill.toFixed(1)} m`)
  }
  return out
}

/**
 * The lowest and highest undisturbed land (not `inU`, above the sea) within
 * R texels of each texel over the box round `U` (a square window, as two
 * running passes): { lo, hi, at(o) → its index in them }.
 */
export function groundRange(metres, W, H, inU, R, U) {
  let i0 = W, j0 = H, i1 = 0, j1 = 0
  for (const o of U) {
    const i = o % W
    const j = (o - i) / W
    i0 = Math.min(i0, i); i1 = Math.max(i1, i); j0 = Math.min(j0, j); j1 = Math.max(j1, j)
  }
  const x0 = Math.max(0, i0 - R), y0 = Math.max(0, j0 - R)
  const w = Math.min(W, i1 + R + 1) - x0
  const h = Math.min(H, j1 + R + 1) - y0
  const pass = (src, pick, init) => {
    const a = new Float32Array(w * h)
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      let v = init
      for (let d = Math.max(0, i - R); d <= Math.min(w - 1, i + R); d++) v = pick(v, src[j * w + d])
      a[j * w + i] = v
    }
    const b = new Float32Array(w * h)
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
      let v = init
      for (let d = Math.max(0, j - R); d <= Math.min(h - 1, j + R); d++) v = pick(v, a[d * w + i])
      b[j * w + i] = v
    }
    return b
  }
  const L = new Float32Array(w * h)
  const Hh = new Float32Array(w * h)
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const o = (y0 + j) * W + x0 + i
    const free = !inU[o] && metres[o] > 0
    L[j * w + i] = free ? metres[o] : Infinity
    Hh[j * w + i] = free ? metres[o] : -Infinity
  }
  return { lo: pass(L, Math.min, Infinity), hi: pass(Hh, Math.max, -Infinity), at: (o) => (Math.floor(o / W) - y0) * w + (o % W) - x0 }
}

/** The point `s` metres along a polyline. */
function pointAlong(pts, s) {
  for (let k = 1; k < pts.length; k++) {
    const L = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])
    if (s <= L || k === pts.length - 1) {
      const t = L > 0 ? Math.min(1, s / L) : 0
      return [pts[k - 1][0] + t * (pts[k][0] - pts[k - 1][0]), pts[k - 1][1] + t * (pts[k][1] - pts[k - 1][1])]
    }
    s -= L
  }
  return pts[0]
}

/** Length of a polyline (metres on the plane) inside a W × H box from the origin. */
function lengthIn(pts, Wm, Hm) {
  let L = 0
  for (let k = 1; k < pts.length; k++) {
    const [ax, ay] = pts[k - 1]
    const [bx, by] = pts[k]
    const mxp = (ax + bx) / 2
    const myp = (ay + by) / 2
    if (mxp >= 0 && myp >= 0 && mxp <= Wm && myp <= Hm) L += Math.hypot(bx - ax, by - ay)
  }
  return L
}

// ---------------------------------------------------------------------------
// The sources an entry cites

const LICENCES = {
  'hawaiihighways-oahu': 'quoted for its dates; text © its compilers',
  'shbie-2024': 'quoted for its dates; a State of Hawaiʻi Department of Transportation report',
}
function citeHistory(src, id, worksSources) {
  const s = src.find((q) => q.id === id)
  if (s) {
    const read = /Read on (\d{4}-\d{2}-\d{2})/.exec(s.note || '')?.[1]
    return {
      id,
      title: s.title,
      url: s.url,
      fetched: read || s.read || '2026-10-23',
      licence: LICENCES[id] || (/wikipedia/.test(id) ? 'quoted for its dates; text CC BY-SA 4.0 (Wikipedia; a tertiary source)' : 'quoted for its dates; text © its authors'),
    }
  }
  const w = worksSources.find((q) => q.id === id)
  return w ? { id, title: w.title, url: w.url, fetched: w.fetched, licence: w.licence } : null
}

// ---------------------------------------------------------------------------
// The bake

export function bakeRoads({ data, log }) {
  const t0 = Date.now()
  const mPath = join(data, 'patches', 'manifest.json')
  const manifest = JSON.parse(readFileSync(mPath, 'utf8'))
  const works = JSON.parse(readFileSync(join(data, 'works', 'manifest.json'), 'utf8'))
  const histories = JSON.parse(readFileSync(join(data, 'sources.json'), 'utf8'))
  const { roads, tunnels } = readRoads(data)
  const joins = junctions(roads, tunnels)
  log(`${roads.length} highway roads, ${tunnels.length} tunnels; interchanges at ${joins.map((j) => j.roads.join('/')).join(', ')}`)
  const outDir = join(data, 'patches', 'roads')
  mkdirSync(outDir, { recursive: true })
  const written = new Set()
  const entries = []
  for (const pk of roadPacks(data)) {
    log(`${pk.id} (${pk.entry.metresPerTexel[0].toFixed(1)} m)`)
    const packSources = (pk.entry.sources || []).filter((s) => s.url && s.licence).slice(0, 1)
    for (const r of bakePack(pk, { roads, tunnels, joins, data, manifest, log })) {
      const p = r.road.properties
      const id = `${pk.id}-road-${p.id}`
      const file = `patches/roads/${id}.png`
      writeFileSync(join(data, file), r.png)
      written.add(`${id}.png`)
      const until = roadUntil(p)
      const why = Array.isArray(p.built) && p.built[0] < p.from ? `its building began in ${p.built[0]} (it opened in ${p.from}; the works' \`built\`)` : `it opened in ${p.from} (the works' \`from\`; they record no earlier start of its building)`
      const s = r.stats
      entries.push({
        id,
        pack: pk.id,
        kind: 'restore',
        until,
        file,
        box: r.box,
        delta: DELTA,
        name: `the ground under ${p.name} (${p.id})`,
        works: p.id,
        note:
          `The cuts and fills of ${p.name}, works section \`${p.id}\`, laid back to the ground round them for the years before ${until}, when ${why}. ` +
          `Found on the pack's own heights: ${s.texels} texels (${s.km2} km², about ${s.meanWidthMetres ?? '?'} m across on average) lie within the width either side of the road where the ground's curvature, averaged along each ${CHUNK} m of it, stands above the ground's own further out, ` +
          `${s.cutTexels} cut (to ${s.maxCutMetres} m) and ${s.fillTexels} filled (to ${s.maxFillMetres} m); laid back by a thin plate from the undisturbed ground round them`,
        sources: [
          ...p.sources.map((q) => citeHistory(histories, q, works.sources)).filter(Boolean),
          ...packSources.map(({ id: sid, title, url, fetched, licence }) => ({ id: sid, title, url, fetched, licence })),
        ],
        stats: s,
      })
    }
  }
  // what is left over from an earlier bake
  for (const f of readdirSync(outDir)) if (f.endsWith('.png') && !written.has(f)) rmSync(join(outDir, f))
  // the manifest: every other entry as it was, ours at the end
  const kept = manifest.patches.filter((e) => e.kind !== 'restore')
  manifest.patches = [...kept, ...entries]
  manifest.baked = { ...manifest.baked, roads: 'tools/bake-roads.mjs' }
  writeFileSync(mPath, JSON.stringify(manifest, null, 2) + '\n')
  log(`wrote ${entries.length} restore patches (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
  return entries
}
