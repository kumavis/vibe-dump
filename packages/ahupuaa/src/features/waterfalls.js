// Wailele: the island's waterfalls.
//
// The generator's streams already know where they drop steeply; this finds
// those drops and hangs water off them. Three kinds:
//
//   heroes   — the few great plunges (≤ 4), where a big stream leaves a
//              hanging valley. Their headwall is cut into the heightfield
//              before the terrain is built, so the land itself has the
//              horseshoe cliff behind the sheet and the bowl it lands in,
//              and everything else (shadow, trees, the stream ribbon) sees
//              the same ground.
//   streams  — every other stream reach that drops 60 m or more: a smaller
//              curtain hugging its ramp, with a pool at the foot.
//   threads  — the horsetails: hundreds of thin falls on the windward pali,
//              on walls no traced stream runs down. They run only after
//              rain on their own slope, and they are gone by the next dry
//              afternoon — leaving dark wet streaks a while longer.
//
// Each fall is one strip of quads down a spine of stations, turned to face
// the camera about its own axis (so it reads as a column of falling water
// from any side), and shaded in flight time: the pattern at depth d belongs
// to water that left the lip T(d) seconds ago, so it crawls over the brink
// and races near the foot, as real falls do. Pools, wet rock and the mist
// share the same few buffers; the whole system is two draw calls.

import * as THREE from 'three'
import { WORLD, HALF, HEIGHT_RES, HYDRO_RES, Y_PER_M } from '../config.js'
import { constants, noise, heightFetch, lighting } from '../render/shaders/common.glsl.js'
import { layStreams } from './streams.js'

const TEX = WORLD / HEIGHT_RES // one height texel, world units
const CELL = WORLD / HYDRO_RES // one hydrology cell
const HALF_TEX = TEX * 0.5
const UNDERCUT = 0.12 // world units behind a hero's sheet
const RIM_BEND = 1.6 // how far the headwall's rim curls back downstream, per unit² off the axis
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const wrapAngle = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2))
const hash01 = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** Bilinear height in metres, exactly as Terrain.metresAt reads it. */
function bilinear(arr, N, x, z) {
  let fx = ((x + HALF) / WORLD) * N - 0.5
  let fz = ((z + HALF) / WORLD) * N - 0.5
  if (fx < 0) fx = 0
  if (fz < 0) fz = 0
  if (fx > N - 1.001) fx = N - 1.001
  if (fz > N - 1.001) fz = N - 1.001
  const i = fx | 0
  const j = fz | 0
  const tx = fx - i
  const tz = fz - j
  const k = j * N + i
  const a = arr[k] + (arr[k + 1] - arr[k]) * tx
  const b = arr[k + N] + (arr[k + N + 1] - arr[k + N]) * tx
  return a + (b - a) * tz
}

const cellOf = (x, z) => {
  const i = clamp(Math.floor((x + HALF) / CELL), 0, HYDRO_RES - 1)
  const j = clamp(Math.floor((z + HALF) / CELL), 0, HYDRO_RES - 1)
  return j * HYDRO_RES + i
}

function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz || 1e-9
  const t = clamp(((px - ax) * dx + (pz - az) * dz) / l2, 0, 1)
  return Math.hypot(ax + dx * t - px, az + dz * t - pz)
}

function polyDist(px, pz, pts) {
  let best = Infinity
  for (let i = 1; i < pts.length; i++) best = Math.min(best, segDist(px, pz, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]))
  return best
}

/** Seconds to fall d metres from rest, with air drag capping the speed at vt. */
export function fallTime(d, vt) {
  const d0 = (vt * vt) / 19.62
  return d <= d0 ? Math.sqrt(Math.max(0, d) / 4.905) : vt / 9.81 + (d - d0) / vt
}

/** Point and segment on a laid line at arc length s (clamped to its ends). */
function lineAt(line, s, out = [0, 0]) {
  const { pts, along } = line
  const n = pts.length
  if (s <= 0) {
    out[0] = pts[0][0]
    out[1] = pts[0][1]
    return 0
  }
  let lo = 0
  let hi = n - 1
  if (s >= along[hi]) {
    out[0] = pts[hi][0]
    out[1] = pts[hi][1]
    return hi - 1
  }
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (along[m] <= s) lo = m
    else hi = m
  }
  const t = (s - along[lo]) / (along[hi] - along[lo] || 1)
  out[0] = pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t
  out[1] = pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t
  return lo
}

// --- planning: where the falls are ---------------------------------------------------------------

const STEP = 0.1 // detection resample, world units (10 m)

/**
 * Steep reaches of the laid streams. A reach is a run of 10 m samples whose
 * gradient over the next 40 m is beyond 0.8 (≈ 39°); short easings inside it
 * are ledges of one fall, not two falls. The lip is the convex brink just
 * above where the run starts; the base is where the channel flattens out.
 */
function detect(lines, hDet, masked) {
  const out = []
  const xy = [0, 0]
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]
    const total = line.along[line.along.length - 1]
    const n = Math.floor(total / STEP) + 1
    if (n < 8) continue
    const xs = new Float64Array(n)
    const zs = new Float64Array(n)
    const hs = new Float64Array(n)
    const seg = new Int32Array(n)
    for (let k = 0; k < n; k++) {
      seg[k] = lineAt(line, k * STEP, xy)
      xs[k] = xy[0]
      zs[k] = xy[1]
      hs[k] = hDet(xy[0], xy[1])
    }
    const m = n - 4
    const g = new Float64Array(n)
    for (let k = 0; k < m; k++) g[k] = (hs[k] - hs[k + 4]) / 40
    let k = 0
    while (k < m) {
      if (!(g[k] > 0.8) || hs[k] < 2) {
        k++
        continue
      }
      const start = k
      let r = k
      while (r < m && g[r] > 0.8) r++
      let end = r - 1
      const gaps = []
      for (;;) {
        let q = end + 1
        while (q < m && g[q] <= 0.8 && q - (end + 1) <= 5) q++
        if (q < m && g[q] > 0.8 && q - (end + 1) <= 5) {
          gaps.push(end + 1)
          while (q < m && g[q] > 0.8) q++
          end = q - 1
        } else break
      }
      k = end + 1
      // the convex brink: where the gradient picks up fastest
      let lip = start
      let bestC = -Infinity
      for (let i = Math.max(1, start - 2); i <= start; i++) {
        const c = g[i + 1] - g[i - 1]
        if (c > bestC) {
          bestC = c
          lip = i
        }
      }
      let base = Math.min(n - 1, end + 4)
      for (let b = end; b <= Math.min(n - 3, end + 4); b++) {
        if (g[b] < 0.3 && g[b + 1] < 0.3 && g[b + 2] < 0.3) {
          base = b
          break
        }
      }
      const drop = hs[lip] - hs[base]
      if (drop < 60) continue
      // never a fall among the loʻi: where the paddies sit in a trench the
      // drawn ground and the ground read here disagree
      let inTrench = false
      for (let q = lip; q <= base && !inTrench; q++) if (masked(xs[q], zs[q])) inTrench = true
      if (inTrench) continue
      const A = line.area[seg[lip]]
      out.push({
        laid: li,
        sLip: lip * STEP,
        sBase: base * STEP,
        lip: [xs[lip], hs[lip], zs[lip]],
        base: [xs[base], hs[base], zs[base]],
        drop,
        A,
        per: clamp((Math.log10(A) - 0.35) / 0.9, 0, 1),
        ledges: gaps.filter((j) => j > lip && j < base).map((j) => hs[lip] - hs[j]).filter((d) => d > 8 && d < drop - 8),
        samples: { xs, zs, hs, i0: lip, i1: base },
      })
    }
  }
  return out
}

/**
 * Plan every fall on the island. Pure (no GL): reads the generated data, cuts
 * the hero headwalls into `island.data.height` (and repacks the normals there)
 * when `carve` is on, and returns the falls, the horsetail threads and the
 * stretches of stream ribbon the falls replace.
 */
export function planFalls(island, opts = {}) {
  const carve = opts.carve !== false
  const t0 = performance.now()
  const { data, meta } = island
  const H = data.height
  const hm = (x, z) => bilinear(H, HEIGHT_RES, x, z)
  const h1 = (x, z) => bilinear(data.height1024, HYDRO_RES, x, z)
  const lines = layStreams(meta, data)
  const tLay = performance.now()

  // Loʻi pressed far below the valley floor they sit on are a trench in the
  // heightfield, not a valley: read the coarse ground there instead, and never
  // put a hero over one.
  const trenchMask = new Uint8Array(HYDRO_RES * HYDRO_RES)
  let trench = false
  const paddyCentres = []
  for (const complex of meta.sites.loi) {
    for (const p of complex.paddies) {
      const cx = (p.quad[0][0] + p.quad[1][0] + p.quad[2][0] + p.quad[3][0]) / 4
      const cz = (p.quad[0][1] + p.quad[1][1] + p.quad[2][1] + p.quad[3][1]) / 4
      paddyCentres.push([cx, cz])
      if (p.level < h1(cx, cz) - 25) {
        trench = true
        const r = 0.3
        for (let j = Math.floor((cz - r + HALF) / CELL); j <= Math.floor((cz + r + HALF) / CELL); j++) {
          for (let i = Math.floor((cx - r + HALF) / CELL); i <= Math.floor((cx + r + HALF) / CELL); i++) {
            if (i < 0 || j < 0 || i >= HYDRO_RES || j >= HYDRO_RES) continue
            if (Math.hypot(-HALF + (i + 0.5) * CELL - cx, -HALF + (j + 0.5) * CELL - cz) <= r) trenchMask[j * HYDRO_RES + i] = 1
          }
        }
      }
    }
  }
  const hDet = (x, z) => (trenchMask[cellOf(x, z)] ? h1(x, z) : hm(x, z))
  const sites = [
    ...meta.sites.houses.map((h) => [h.x, h.z]),
    ...meta.sites.villages.map((v) => [v.x, v.z]),
    ...meta.sites.heiau.map((h) => [h.x, h.z]),
    ...paddyCentres,
  ]

  const masked = (x, z) => trenchMask[cellOf(x, z)] === 1
  let falls = detect(lines, hDet, masked)
  const tDetect = performance.now()

  // --- heroes ---
  const model = meta.ahupuaa.find((a) => a.id === meta.sites.model)
  const trunk = model?.trunk || []
  const trunkXZ = trunk.map((p) => [p[0], p[1]])
  const cands = []
  for (const f of falls) {
    const nearTrunk = trunkXZ.length > 1 && polyDist(f.lip[0], f.lip[2], trunkXZ) < 1.5
    const isModel = nearTrunk && f.A >= 2 && f.drop >= 100
    if (!isModel && !(f.A >= 3 && f.drop >= 120)) continue
    // a straight axis from the lip: pull the base upstream until the stream
    // between them stays within 0.35 of it
    const { xs, zs, hs, i0, i1 } = f.samples
    let b = -1
    for (let bb = i1; bb > i0; bb--) {
      let ok = true
      for (let q = i0 + 1; q < bb && ok; q++) if (segDist(xs[q], zs[q], xs[i0], zs[i0], xs[bb], zs[bb]) > 0.35) ok = false
      if (ok) {
        b = bb
        break
      }
    }
    if (b < 0) continue
    const L = [xs[i0], zs[i0]]
    const B = [xs[b], zs[b]]
    const len = Math.hypot(B[0] - L[0], B[1] - L[1])
    const D = hs[i0] - hs[b]
    if (D < 100 || len < 0.6) continue
    const ux = (B[0] - L[0]) / len
    const uz = (B[1] - L[1]) / len
    const shape = heroShape(D, f.A, f.per)
    const pool = [L[0] + ux * shape.sLand, L[1] + uz * shape.sLand]
    // guards: no trench in the corridor, no people in the way
    const wBase = shape.wBase
    let bad = false
    const r = wBase + 0.5
    const ci0 = Math.floor((Math.min(L[0], B[0]) - r + HALF) / CELL)
    const ci1 = Math.floor((Math.max(L[0], B[0]) + r + HALF) / CELL)
    const cj0 = Math.floor((Math.min(L[1], B[1]) - r + HALF) / CELL)
    const cj1 = Math.floor((Math.max(L[1], B[1]) + r + HALF) / CELL)
    for (let j = Math.max(0, cj0); j <= Math.min(HYDRO_RES - 1, cj1) && !bad; j++) {
      for (let i = Math.max(0, ci0); i <= Math.min(HYDRO_RES - 1, ci1) && !bad; i++) {
        if (!trenchMask[j * HYDRO_RES + i]) continue
        const x = -HALF + (i + 0.5) * CELL
        const z = -HALF + (j + 0.5) * CELL
        if (segDist(x, z, L[0], L[1], B[0], B[1]) <= wBase || Math.hypot(x - pool[0], z - pool[1]) <= shape.poolR + 0.5) bad = true
      }
    }
    if (bad) continue
    if (sites.some((p) => segDist(p[0], p[1], L[0], L[1], B[0], B[1]) <= wBase + 0.3)) continue
    const yB = hs[b]
    const yL = hs[i0]
    const score = Math.pow(D, 0.7) * Math.sqrt(f.A) * (yB < 650 ? 1.5 : 0.6) * (yL < 700 ? 1.3 : 1) * (isModel ? 3 : 1)
    cands.push({ f, L, B, len, D, b, isModel, score, ux, uz })
  }
  cands.sort((a, b) => b.score - a.score)
  const heroes = []
  for (const c of cands) {
    if (heroes.length >= 4) break
    if (heroes.some((h) => Math.hypot(h.L[0] - c.L[0], h.L[1] - c.L[1]) < 8)) continue
    heroes.push(c)
  }
  // the tour's wao akua stop looks at one: the model valley's own, else the
  // one nearest where the stop used to look
  let akuaIdx = heroes.findIndex((h) => h.isModel)
  if (akuaIdx < 0 && heroes.length) {
    let best = trunk[0]
    for (const p of trunk) if (Math.abs(p[2] - 260) < Math.abs(best[2] - 260)) best = p
    const ax = best ? best[0] : 0
    const az = best ? best[1] : 0
    akuaIdx = 0
    for (let i = 1; i < heroes.length; i++) if (Math.hypot(heroes[i].L[0] - ax, heroes[i].L[1] - az) < Math.hypot(heroes[akuaIdx].L[0] - ax, heroes[akuaIdx].L[1] - az)) akuaIdx = i
  }
  if (akuaIdx > 0) heroes.unshift(heroes.splice(akuaIdx, 1)[0])

  // --- carve the headwalls ---
  const carved = []
  const heroFalls = []
  for (const c of heroes) {
    const f = c.f
    const line = lines[f.laid]
    const yL = c.f.samples.hs[c.f.samples.i0]
    const yB = c.f.samples.hs[c.b]
    const shape = heroShape(c.D, f.A, f.per)
    if (carve) carved.push(carveHero(H, data.normals, c.L, c.B, yL, yB, shape, sites))
    // where the ground is now
    const lipM = hm(c.L[0], c.L[1])
    const baseM = hm(c.B[0], c.B[1])
    const px = c.L[0] + c.ux * shape.sLand
    const pz = c.L[1] + c.uz * shape.sLand
    let rimMin = Infinity
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2
      rimMin = Math.min(rimMin, hm(px + Math.cos(a) * shape.poolR, pz + Math.sin(a) * shape.poolR))
    }
    const floorM = hm(px, pz)
    const water = Math.max(rimMin - 0.5, floorM + 1)
    // the stream position nearest the pool
    let sPool = f.sLip
    let bd = Infinity
    for (let i = 0; i < line.pts.length; i++) {
      const d = Math.hypot(line.pts[i][0] - px, line.pts[i][1] - pz)
      if (d < bd && line.along[i] >= f.sLip) {
        bd = d
        sPool = line.along[i]
      }
    }
    heroFalls.push({
      kind: 0,
      laid: f.laid,
      src: line.src,
      sLip: f.sLip,
      sBase: f.sLip + c.len,
      sPool,
      lip: [c.L[0], lipM, c.L[1]],
      base: [c.B[0], baseM, c.B[1]],
      drop: lipM - water,
      A: f.A,
      per: f.per,
      ledges: [],
      model: c.isModel,
      face: [c.ux, c.uz],
      pool: [px, water, pz],
      poolR: shape.poolR,
      carve: { faceRun: shape.faceRun, faceFrac: shape.faceFrac, wFace: shape.wFace, sLand: shape.sLand, yF: yB + (1 - shape.faceFrac) * (yL - yB) },
    })
  }
  const tCarve = performance.now()

  // hanging tributaries on the new walls become falls too; whatever overlaps a
  // hero is the hero
  if (carved.length) falls = detect(lines, hDet, masked)
  const streamFalls = []
  for (const f of falls) {
    if (heroFalls.some((h) => (h.laid === f.laid && f.sBase >= h.sLip - 0.1 && f.sLip <= h.sPool) || Math.hypot(h.lip[0] - f.lip[0], h.lip[2] - f.lip[2]) < 0.4)) continue
    delete f.samples
    f.kind = 1
    f.src = lines[f.laid].src
    streamFalls.push(f)
  }
  streamFalls.sort((a, b) => b.drop - a.drop)
  // (a fall's own sheet is sized and fed by the drainage right at its lip;
  // the tongue it grows from matches the ribbon above, sized by its line's)
  const all = [...heroFalls, ...streamFalls].slice(0, MAX_FALLS)
  for (const f of all) {
    f.rain = data.rain[cellOf(f.lip[0], f.lip[2])]
    f.ribbonA = lines[f.laid].lineA
  }

  // --- horsetails ---
  const tThreads0 = performance.now()
  const threads = planThreads(lines, all, data, hm)
  const tThreads = performance.now()

  // The ribbon gives way to each fall: it fades out over the last few metres
  // to the brink while the fall fades in over the same stretch (each
  // station's `hand`, from `f.hand`), and fades back in below — a stream
  // fall's ribbon over the stretch where its foot fades out, a hero's out of
  // its pool. (h0..h1 is hidden; r0 and r1 are the fades either side.)
  const cuts = new Map()
  const cut = (laid, h0, h1, r0, r1, level) => {
    if (!cuts.has(laid)) cuts.set(laid, [])
    cuts.get(laid).push({ h0, h1, r0, r1, level })
  }
  for (const f of all) {
    let s1 = f.kind === 0 ? f.sPool : f.sBase
    if (f.kind === 0 && carve) {
      // the stream line wanders up to 0.35 off the hero's axis, so below the
      // pool it can run along the foot of a notch wall; it resumes only where
      // it is down on the notch floor again
      const { pts, along } = lines[f.laid]
      for (let i = 0; i < pts.length; i++) {
        if (along[i] <= s1 || along[i] > f.sPool + 1.2) continue
        const px = pts[i][0] - f.lip[0]
        const pz = pts[i][1] - f.lip[2]
        const sa = px * f.face[0] + pz * f.face[1]
        if (hm(pts[i][0], pts[i][1]) - hm(f.lip[0] + f.face[0] * sa, f.lip[2] + f.face[1] * sa) > 4) s1 = along[Math.min(pts.length - 1, i + 1)]
        else break
      }
    }
    // (a hero's outflow also carries its pool's level: no stretch of ribbon
    // just below may stand higher than the water it flows out of)
    // (a hero's tongue is all there is above its brink; a stream fall hugs
    // its ramp, so the ribbon draped down that ramp can hand over to it more
    // gently, over its first ten metres or so)
    const a = Math.max(0, f.sLip - (f.kind === 0 ? 0.06 : 0.03))
    const h0 = f.kind === 0 ? f.sLip : Math.min(f.sLip + 0.12, (f.sLip + f.sBase) / 2)
    const h1 = f.kind === 0 ? s1 : Math.max(h0, s1 - 0.15)
    const r1 = f.kind === 0 ? 0.05 : s1 - h1
    cut(f.laid, h0, h1, h0 - a, r1, f.kind === 0 ? f.pool[1] : undefined)
    // what the fall needs to do its half of the cross-fade
    f.hand = { a, b: h0, c: f.kind === 0 ? Infinity : h1, d: f.kind === 0 ? Infinity : h1 + r1 }
  }
  // and any other stream that would run over the rim of a hero's notch and
  // down its new walls stops at the rim (its water joins the spray)
  if (carve) {
    for (const h of heroFalls) {
      const [ux, uz] = h.face
      const len = Math.hypot(h.base[0] - h.lip[0], h.base[2] - h.lip[2])
      const inside = (x, z) => {
        const px = x - h.lip[0]
        const pz = z - h.lip[2]
        const s = px * ux + pz * uz
        const c = -px * uz + pz * ux
        return s > -0.05 && s < len && Math.abs(c) < 0.8 * (h.carve.wFace + ((1.4 - h.carve.wFace) * Math.max(0, s)) / len)
      }
      for (let li = 0; li < lines.length; li++) {
        if (li === h.laid) continue
        const { pts, along } = lines[li]
        let start = -1
        for (let i = 0; i <= pts.length; i++) {
          const inn = i < pts.length && inside(pts[i][0], pts[i][1])
          if (inn && start < 0) start = i
          if (!inn && start >= 0) {
            cut(li, along[Math.max(0, start - 1)], along[Math.min(pts.length - 1, i)], 0.04, 0.04)
            start = -1
          }
        }
      }
    }
  }

  const t1 = performance.now()
  return {
    falls: all,
    threads,
    cuts,
    carved,
    lines,
    akua: heroFalls.length ? 0 : -1,
    trench,
    ms: { lay: tLay - t0, detect: tDetect - tLay, carve: tCarve - tDetect, threads: tThreads - tThreads0, total: t1 - t0 },
  }
}

/** The proportions of a hero's headwall, plunge and pool, from its drop. */
function heroShape(D, A, per) {
  const faceFrac = 0.82
  const faceRun = 0.1
  const wFace = clamp(0.3 + 0.0025 * D, 0.7, 1.1)
  const wBase = 1.4
  const poolR = clamp(0.05 + 0.0005 * D + 0.02 * Math.sqrt(A), 0.06, 0.3)
  const v0 = 2.2 + 3.5 * per + 1.5 // as the drawn sheet leaves its lip
  // where the sheet lands, measured from the lip (the face starts half a texel in)
  const sLand = HALF_TEX + clamp(v0 * fallTime(faceFrac * D, 30) * 0.01, faceRun + 0.06, faceRun + 0.3)
  return { faceFrac, faceRun, wFace, wBase, poolR, v0, sLand }
}

/**
 * Cut a hero's headwall: a near-vertical face for the top 82% of the drop, an
 * apron of talus below it, a bowl where the water lands, and amphitheatre
 * walls either side. Only ever lowers the ground.
 */
function carveHero(h, normals, L, B, yL, yB, shape, sites) {
  const N = HEIGHT_RES
  const { faceRun, faceFrac, wFace, wBase, poolR, sLand } = shape
  const len = Math.hypot(B[0] - L[0], B[1] - L[1])
  const ux = (B[0] - L[0]) / len
  const uz = (B[1] - L[1]) / len
  const D = yL - yB
  const yF = yB + (1 - faceFrac) * D
  const pad = 2
  const i0 = Math.max(1, Math.floor((Math.min(L[0], B[0]) - pad + HALF) / TEX))
  const i1 = Math.min(N - 2, Math.ceil((Math.max(L[0], B[0]) + pad + HALF) / TEX))
  const j0 = Math.max(1, Math.floor((Math.min(L[1], B[1]) - pad + HALF) / TEX))
  const j1 = Math.min(N - 2, Math.ceil((Math.max(L[1], B[1]) + pad + HALF) / TEX))
  const near = sites.filter((p) => p[0] > -HALF + i0 * TEX - 0.5 && p[0] < -HALF + i1 * TEX + 0.5 && p[1] > -HALF + j0 * TEX - 0.5 && p[1] < -HALF + j1 * TEX + 0.5)
  let texels = 0
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const x = -HALF + (i + 0.5) * TEX
      const z = -HALF + (j + 0.5) * TEX
      const px = x - L[0]
      const pz = z - L[1]
      const s = px * ux + pz * uz
      const c = -px * uz + pz * ux
      // the rim bends back downstream either side of the notch (a horseshoe,
      // not a box), and starts half a texel in so the bilinear ground keeps
      // the brink at the lip's own height
      const sh = s - HALF_TEX - RIM_BEND * c * c
      if (sh < 0 || s > len) continue
      if (near.some((p) => Math.hypot(p[0] - x, p[1] - z) < 0.3)) continue
      let ya = sh < faceRun ? yL + (yF - yL) * (sh / faceRun) : yF + ((yB - yF) * (sh - faceRun)) / Math.max(0.1, len - faceRun)
      const pd = Math.hypot(s - sLand, c) / (poolR * 1.1)
      if (pd < 1) ya -= 6 * (1 - pd * pd) // the plunge bowl
      const W = wFace + ((wBase - wFace) * s) / len
      // amphitheatre walls; downstream the cut eases back into the valley
      const k = (1 - smooth(0.55 * W, W, Math.abs(c))) * (1 - smooth(len - 0.45, len, s))
      const c0 = j * N + i
      const t = h[c0] + (ya - h[c0]) * k
      if (t < h[c0]) {
        h[c0] = t
        texels++
      }
    }
  }
  // the normals there, as the generator packs them (keeping its AO)
  const dx = WORLD / N
  for (let j = j0 - 1; j <= j1 + 1; j++) {
    for (let i = i0 - 1; i <= i1 + 1; i++) {
      const c = j * N + i
      const ex = h[j * N + Math.min(N - 1, i + 1)] - h[j * N + Math.max(0, i - 1)]
      const ez = h[Math.min(N - 1, j + 1) * N + i] - h[Math.max(0, j - 1) * N + i]
      const nx = (-ex * Y_PER_M) / (2 * dx)
      const nz = (-ez * Y_PER_M) / (2 * dx)
      const l = Math.hypot(nx, 1, nz)
      normals[c * 4] = Math.round(((nx / l) * 0.5 + 0.5) * 255)
      normals[c * 4 + 1] = Math.round(((1 / l) * 0.5 + 0.5) * 255)
      normals[c * 4 + 2] = Math.round(((nz / l) * 0.5 + 0.5) * 255)
    }
  }
  return { i0, i1, j0, j1, texels }
}

/**
 * Horsetails: seeds on the steep, very wet walls that no traced stream runs
 * down, each followed straight down the fall line until the wall eases off.
 */
function planThreads(lines, falls, data, hm) {
  const N = HYDRO_RES
  const rain = data.rain
  // laid stream points in a 0.25 hash, for "is there a stream here already"
  const HC = 0.25
  const hk = (x, z) => Math.floor((x + HALF) / HC) * 4096 + Math.floor((z + HALF) / HC)
  const laidHash = new Map()
  const xy = [0, 0]
  for (const line of lines) {
    const total = line.along[line.along.length - 1]
    for (let s = 0; s <= total; s += 0.1) {
      lineAt(line, s, xy)
      const k = hk(xy[0], xy[1])
      let a = laidHash.get(k)
      if (!a) laidHash.set(k, (a = []))
      a.push(xy[0], xy[1])
    }
  }
  const nearLaid = (x, z, r, out) => {
    const ci = Math.floor((x + HALF) / HC)
    const cj = Math.floor((z + HALF) / HC)
    let best = r
    let found = false
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const a = laidHash.get((ci + di) * 4096 + cj + dj)
        if (!a) continue
        for (let q = 0; q < a.length; q += 2) {
          const d = Math.hypot(a[q] - x, a[q + 1] - z)
          if (d < best) {
            best = d
            found = true
            if (out) {
              out[0] = a[q]
              out[1] = a[q + 1]
            }
          }
        }
      }
    }
    return found
  }
  // corridors of the curtain falls (a hero's takes in the walls of its notch:
  // a thread there would hang across the sheet like a wire)
  const corridors = falls.map((f) => {
    const r = f.kind === 0 ? 1.4 : 0.6
    return { a: f.lip, b: f.base, r, x0: Math.min(f.lip[0], f.base[0]) - r, x1: Math.max(f.lip[0], f.base[0]) + r, z0: Math.min(f.lip[2], f.base[2]) - r, z1: Math.max(f.lip[2], f.base[2]) + r }
  })
  const nearFall = (x, z) => corridors.some((c) => x > c.x0 && x < c.x1 && z > c.z0 && z < c.z1 && segDist(x, z, c.a[0], c.a[2], c.b[0], c.b[2]) < c.r)
  const grad = (x, z, out) => {
    const e = 0.05
    out[0] = (hm(x + e, z) - hm(x - e, z)) / (2 * e * 100)
    out[1] = (hm(x, z + e) - hm(x, z - e)) / (2 * e * 100)
    return Math.hypot(out[0], out[1])
  }
  // bbox of the very wet ground
  let bi0 = N
  let bi1 = -1
  let bj0 = N
  let bj1 = -1
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      if (rain[j * N + i] > 2500) {
        if (i < bi0) bi0 = i
        if (i > bi1) bi1 = i
        if (j < bj0) bj0 = j
        if (j > bj1) bj1 = j
      }
    }
  }
  const cand = []
  const gr = [0, 0]
  const buf = new Float64Array(3 * 404)
  const lattice = 4 * TEX
  for (let z0 = -HALF + (bj0 + 0.5) * CELL; z0 <= -HALF + (bj1 + 0.5) * CELL; z0 += lattice) {
    for (let x0 = -HALF + (bi0 + 0.5) * CELL; x0 <= -HALF + (bi1 + 0.5) * CELL; x0 += lattice) {
      // (jittered, so the threads on a wall don't line up like a comb)
      const x = x0 + (hash01(x0 * 13.7 + z0 * 3.1) - 0.5) * lattice
      const z = z0 + (hash01(x0 * 5.3 - z0 * 11.9) - 0.5) * lattice
      const r = rain[cellOf(x, z)]
      if (r <= 2500) continue
      const h0 = hm(x, z)
      if (h0 <= 60) continue
      if (grad(x, z, gr) <= 1.2) continue
      if (nearLaid(x, z, 0.25) || nearFall(x, z)) continue
      // trace down the fall line
      // (traced into a scratch buffer: most traces are thrown away)
      buf[0] = x
      buf[1] = h0
      buf[2] = z
      let np = 1
      let px = x
      let pz = z
      let ph = h0
      let shallow = 0
      let steepDrop = 0
      let eased = false
      for (let s = 0; s < 400; s++) {
        const gm = grad(px, pz, gr)
        if (gm < 1e-6) break
        const nx = px - (gr[0] / gm) * 0.05
        const nz = pz - (gr[1] / gm) * 0.05
        const nh = hm(nx, nz)
        if (nh >= ph) break
        const g = (ph - nh) / 5
        if (g >= 0.9) {
          steepDrop += ph - nh
          shallow = 0
        } else shallow++
        px = nx
        pz = nz
        ph = nh
        buf[np * 3] = px
        buf[np * 3 + 1] = ph
        buf[np * 3 + 2] = pz
        np++
        if (shallow >= 3) {
          eased = true
          break
        }
        if (s > 2 && nearLaid(px, pz, 0.25, xy)) {
          // run on into the stream it feeds
          buf[np * 3] = xy[0]
          buf[np * 3 + 1] = hm(xy[0], xy[1])
          buf[np * 3 + 2] = xy[1]
          np++
          break
        }
        if (ph < 3) break
      }
      if (steepDrop < 140) continue
      if (eased) np -= 3
      if (np < 4) continue
      let crosses = false
      for (let q = 2; q < np && !crosses; q += 2) crosses = nearFall(buf[q * 3], buf[q * 3 + 2])
      if (crosses) continue
      const pts = []
      for (let q = 0; q < np; q++) pts.push([buf[q * 3], buf[q * 3 + 1], buf[q * 3 + 2]])
      // the brink bonus: a wall that starts from gentler ground above
      const gm0 = grad(x, z, gr)
      const gu = grad(x + (gr[0] / gm0) * 0.4, z + (gr[1] / gm0) * 0.4, gr)
      const drop = pts[0][1] - pts[pts.length - 1][1]
      cand.push({ pts, drop, rain: r, score: drop * Math.sqrt(r / 3000) * (gu < 0.8 ? 1.4 : 1), room: 0.35 + 0.5 * hash01(x * 7.1 + z * 17.3) })
    }
  }
  cand.sort((a, b) => b.score - a.score)
  // thin out: seeds apart, paths not running down the same gully
  const claimed = new Set()
  const PC = 0.3
  const pk = (x, z) => Math.floor((x + HALF) / PC) * 4096 + Math.floor((z + HALF) / PC)
  const kept = []
  for (const c of cand) {
    if (kept.length >= 300) break
    const [sx, , sz] = c.pts[0]
    // at least 0.7 apart, more for some, so the spacing is irregular
    if (kept.some((k) => Math.abs(k.pts[0][0] - sx) < 1.7 && Math.abs(k.pts[0][2] - sz) < 1.7 && Math.hypot(k.pts[0][0] - sx, k.pts[0][2] - sz) < k.room + c.room)) continue
    const cells = new Set()
    for (let i = 3; i < c.pts.length; i++) cells.add(pk(c.pts[i][0], c.pts[i][2]))
    let shared = 0
    for (const k of cells) if (claimed.has(k)) shared++
    if (shared > 3) continue
    for (const k of cells) claimed.add(k)
    kept.push(c)
  }
  // one point per 25 m of drop (at least six)
  for (const c of kept) {
    const p = c.pts
    const n = Math.max(6, Math.round(c.drop / 25))
    const out = [p[0]]
    let q = 1
    for (let k = 1; k < n - 1; k++) {
      const target = p[0][1] - (c.drop * k) / (n - 1)
      while (q < p.length - 1 && p[q][1] > target) q++
      const a = p[q - 1]
      const b = p[q]
      const t = clamp((a[1] - target) / (a[1] - b[1] || 1), 0, 1)
      out.push([a[0] + (b[0] - a[0]) * t, target, a[2] + (b[2] - a[2]) * t])
    }
    out.push(p[p.length - 1])
    c.pts = out
  }
  // which run first: the biggest catchments fill first
  const area = data.area
  for (const c of kept) {
    const f = c.pts[c.pts.length - 1]
    const ci = Math.floor((f[0] + HALF) / CELL)
    const cj = Math.floor((f[2] + HALF) / CELL)
    let A = 0
    for (let j = Math.max(0, cj - 1); j <= Math.min(N - 1, cj + 1); j++) for (let i = Math.max(0, ci - 1); i <= Math.min(N - 1, ci + 1); i++) A = Math.max(A, area[j * N + i])
    c.A = A
  }
  const byA = [...kept].sort((a, b) => b.A - a.A)
  const hero = falls.find((f) => f.kind === 0)
  const out = kept.map((c) => {
    const rank = byA.indexOf(c) / Math.max(1, byA.length - 1)
    const id = Math.round(c.pts[0][0] * 37 + c.pts[0][2] * 101)
    const dx = c.pts[1][0] - c.pts[0][0]
    const dz = c.pts[1][2] - c.pts[0][2]
    const dl = Math.hypot(dx, dz) || 1
    const near = hero && Math.hypot(c.pts[0][0] - hero.pool[0], c.pts[0][2] - hero.pool[2]) < 25
    return {
      kind: 2,
      pts: c.pts,
      lip: c.pts[0],
      base: c.pts[c.pts.length - 1],
      drop: c.drop,
      A: c.A,
      rain: c.rain,
      thr: 0.35 + 0.6 * Math.pow(rank, 0.8) + (hash01(id) - 0.5) * 0.15,
      prio: c.drop * Math.sqrt(c.rain / 3000) * (near ? 2 : 1),
      // the slope that feeds it: the lip, and the ground above
      catch: [c.pts[0][0], c.pts[0][2], c.pts[0][0] - (dx / dl) * 1.5, c.pts[0][2] - (dz / dl) * 1.5],
    }
  })
  out.sort((a, b) => b.prio - a.prio)
  return out
}

// --- drawing ------------------------------------------------------------------------------------

const MAX_FALLS = 512 // state texture width: one texel per fall
const MIST_CAP = 512
const RING_C = Array.from({ length: 8 }, (_, q) => Math.cos((q / 8) * Math.PI * 2))
const RING_S = Array.from({ length: 8 }, (_, q) => Math.sin((q / 8) * Math.PI * 2))
const THREADS_BY_LEVEL = [60, 120, 220, 1e9]
const MIST_BY_LEVEL = [0.25, 0.5, 0.75, 1]

const mainVertex = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
in vec3 aAxis;
in vec3 aFace;
in vec4 aFall;   // s metres from the lip, T seconds of flight, half-width (units), kind
in vec4 aMeta;   // fall id, seed, side (-1/+1, or lateral / radius fraction), contact (pool: angle)
in vec3 aMore;   // along 0..1, metres to the foot, hand-over from the ribbon (0..1, linear)
in vec4 aLift;   // how far each coarser terrain LOD stands above this point
uniform sampler2D uState;   // per fall: r flow, g water front, b wet-rock memory
uniform float uPx;          // world size of one drawing-buffer pixel at distance 1
uniform float uLodRange;    // the terrain's finest LOD range
uniform float uWaterTime;
uniform vec2 uWindVec;
out vec3 vWorld;
out vec3 vSide;
out vec3 vN;
out vec2 vPool;
out vec4 vA; // x across (|u| <= 1 water, beyond: veil), y s metres, z T, w half-width metres (pool: R)
out vec4 vB; // x flow, y seed, z contact, w coverage
out vec4 vC; // x veil extent, y sun visibility, z metres to the foot, w along
out vec4 vD; // x kind, y front, z wet, w distance fade
out float vTurb; // how muddy the water runs after a storm
out float vHand;
void main() {
  float kind = aFall.w;
  float dist0 = length(cameraPosition - position);
  // (after a storm the windward pali streaming with threads is a sight from
  // across a valley, so they carry nearly as far as the stream falls; their
  // coverage fade below keeps them from shimmering out there)
  float fade = 1.0 - (kind < 0.5 ? smoothstep(100.0, 150.0, dist0) : (kind > 1.5 && kind < 2.5) ? smoothstep(65.0, 100.0, dist0) : smoothstep(70.0, 110.0, dist0));
  if (fade <= 0.0) {
    // out of range: skip the rest (most of the island's falls, most frames)
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  vec4 st = texelFetch(uState, ivec2(int(aMeta.x + 0.5), 0), 0);
  float flow = st.r;
  vec3 C = position;
  vec3 p = position;
  float cov = 1.0;
  float veilMax = 1.0;
  float u = aMeta.z;
  vSide = aFace;
  vN = aAxis;
  vPool = vec2(0.0);
  if (kind < 2.5) {
    float s = max(aFall.x, 0.0);
    float freeK = 1.0 - aMeta.w;
    // a free-falling sheet bows a little downwind in slow gusts, never into the rock
    float fallen = s * Y_PER_M;
    float gust = 0.75 + 0.25 * sin(uWaterTime * 0.7 + aMeta.y * 37.0);
    vec2 drift = uWindVec * 0.012 * fallen * sqrt(fallen) * gust * freeK / (0.5 + flow);
    drift -= aFace.xz * min(0.0, dot(drift, aFace.xz));
    C.xz += drift;
    vec3 V = normalize(cameraPosition - C);
    vec3 F = normalize(cross(aFace, aAxis));
    vec3 P = cross(aAxis, V);
    float lp = length(P);
    P = lp > 1e-4 ? P / lp : F;
    vec3 Nf = normalize(cross(aAxis, F));
    // (a horsetail wanders a few metres either way down its wall, round the
    // ledges and buttresses the heightfield is too coarse to have)
    if (kind > 1.5) C += F * (vnoise(vec2(aMeta.y * 31.0, aFall.x * 0.015)) - 0.5) * 0.08;
    // how full it runs: a hero swings from a thin dry-season ribbon to a
    // roaring, veiled torrent in spate; the tongue over its brink keeps to the
    // width of the stream ribbon it grows from
    float wStream = 0.45 + 0.55 * sqrt(flow);
    float wHero = 0.2 + 0.8 * smoothstep(0.2, 0.95, flow);
    float hw = aFall.z * (kind < 0.5 ? mix(wStream, wHero, smoothstep(0.0, 15.0, aFall.x)) : wStream);
    // (a cascade gathers and spreads over its steps rather than running as an
    // even tube; its tongue still matches the ribbon above)
    if (kind > 0.5 && kind < 1.5) hw *= mix(1.0, 0.65 + 0.7 * vnoise(vec2(aMeta.y * 19.0, aFall.x * 0.025)), smoothstep(0.0, 10.0, aFall.x));
    float ht = hw * mix(0.45, 0.25, aMeta.w);
    // an elliptic column: its exact outline from whichever side it's seen
    float rad = length(vec2(hw * dot(F, P), ht * dot(Nf, P)));
    float veil = kind < 0.5 ? (0.15 + 0.9 * smoothstep(10.0, 150.0, s) * freeK) * mix(0.35, 1.2, smoothstep(0.35, 0.95, flow)) : (kind < 1.5 ? 0.1 : 1.4);
    float ext = rad * (1.0 + veil);
    // never thinner than a pixel or so: fade it instead, so far threads don't shimmer
    float minExt = (kind > 1.5 ? 0.62 : 0.8) * uPx * dist0;
    cov = clamp(ext / max(minExt, 1e-6), 0.0, 1.0);
    float live = kind > 1.5 ? max(flow, st.b) : flow; // threads keep a dark streak when dry
    ext = max(ext, minExt) * step(0.03, live);
    p = C + P * aMeta.z * ext;
    // (and where it is fattened so, the water itself fills the strip, its
    // veil shrinking to nothing: drawn at its true width, the core would
    // fall between pixel centres and leave the veil, or a thread's wet
    // fringe, to stand in for it as a grey line)
    veilMax = 1.0 + veil * cov;
    u = aMeta.z * veilMax;
    vSide = P;
  } else if (kind > 3.5) {
    vPool = vec2(cos(aMeta.w), sin(aMeta.w)) * aMeta.z * aFall.z * 100.0; // pool metres, +x to the outlet
  }
  // depth only (the screen position stays put): far off, the terrain's coarse
  // LODs fill a narrow notch in, and the water must not drown in it
  vec3 toCam = cameraPosition - p;
  float d = length(toCam);
  float bias;
  if (kind > 3.5) bias = min(d * 0.005, 0.5); // (pools lie flat in their own bowl)
  else if (aFall.x < 0.0) bias = min(d * 0.015, 1.2);
  else {
    float q = log2(max(d, 1e-3) / uLodRange) + 1.0;
    float l = clamp(q, 0.0, 2.999);
    float lf = l < 1.0 ? mix(aLift.x, aLift.y, l) : l < 2.0 ? mix(aLift.y, aLift.z, l - 1.0) : mix(aLift.z, aLift.w, l - 2.0);
    lf *= 1.0 + max(0.0, q - 3.0);
    bias = min(2.0, d * 0.002 + lf * 1.8);
  }
  p += toCam / max(d, 1e-3) * bias;
  vWorld = p;
  vA = vec4(u, aFall.x, aFall.y, aFall.z * 100.0);
  vB = vec4(flow, aMeta.y, aMeta.w, cov);
  vC = vec4(veilMax, sunVisibility(C - aFace * 0.03), aMore.y, aMore.x);
  vD = vec4(kind, st.g, st.b, fade);
  vTurb = st.a;
  vHand = aMore.z;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`

const mainFragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
uniform int uDebug;
uniform float uWaterTime;
uniform float uNightK;
in vec3 vWorld;
in vec3 vSide;
in vec3 vN;
in vec2 vPool;
in vec4 vA;
in vec4 vB;
in vec4 vC;
in vec4 vD;
in float vTurb;
in float vHand;
float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}
// foam: irregular drifting patches, not a cellular paving
float foamAt(vec2 q) {
  float n = vnoise(q) * 0.55 + vnoise(q * 2.3 + 1.7) * 0.3 + vnoise(q * 5.1 + 4.1) * 0.15;
  return smoothstep(0.42, 0.72, n);
}
void main() {
  float kind = vD.x;
  float flow = vB.x;
  float fade = vD.w;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 sun = uSunColor * vC.y;
  // by night white water is pale grey, lit by the moon and sky like the rock
  // around it, but dimmed so it stands about as far above the rock as it does
  // by day: a faint pale stripe, never a lamp
  float day = smoothstep(-0.12, 0.08, uSunDir.y);
  float night = mix(uNightK, 1.0, day);
  // after a storm the water runs faintly brown with the soil it carries
  vec3 mud = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), 0.5 * vTurb);
  if (kind > 3.5) {
    // the plunge pool: foam boiling out from the landing toward the outlet,
    // advected in two phases half a cycle apart so it never visibly resets
    vec2 q = vPool;
    float R = vA.w;
    float r = length(q) / R;
    if (r > 1.0) discard;
    vec2 vel = normalize(q + 1e-3) * (1.0 - r) * 3.0 + vec2(1.2, 0.0);
    float t = uWaterTime * 0.5;
    float p1 = fract(t);
    float p2 = fract(t + 0.5);
    float wB = abs(p1 - 0.5) * 2.0;
    float sd = vB.y * 13.0;
    float fa = foamAt((q - vel * p1 * 2.0) * 0.25 + sd);
    float fb = foamAt((q - vel * p2 * 2.0) * 0.25 + sd + 0.5);
    float fm = mix(fa, fb, wB);
    float foam = mix(0.45, fm, 1.0 - smoothstep(0.3, 0.7, length(fwidth(q * 0.25))));
    // the boil where the sheet lands, ragged at its edge, and foam drifting out
    float boil = smoothstep(0.15, 0.55, 1.0 - r / 0.5 + (fm - 0.5) * 0.5);
    float cover = clamp(boil + foam * (1.0 - smoothstep(0.3, 1.0, r)) * 0.7, 0.0, 1.0) * smoothstep(0.06, 0.3, flow);
    float Fw = 0.04 + 0.96 * pow(1.0 - max(V.y, 0.0), 5.0);
    // (dark, deep water in a shaded bowl: it mirrors the walls around it more
    // than the open sky)
    vec3 deep = mix(vec3(0.02, 0.035, 0.03), vec3(0.05, 0.04, 0.025), vTurb);
    // (seen low across the pool it mirrors the walls of its bowl, not the sky,
    // so it never reads as a bright plate)
    vec3 Rw = reflect(-V, vec3(0.0, 1.0, 0.0));
    vec3 mirror = mix(deep * uSkyColor * 0.6, skyMap(Rw) * 0.35, smoothstep(0.08, 0.45, Rw.y));
    vec3 water = mix(deep * (uSkyColor + sun * max(uSunDir.y, 0.0) * 0.3), mirror, Fw * 0.5);
    vec3 white = vec3(0.78, 0.82, 0.84) * mud * (sun * max(uSunDir.y, 0.0) * 0.8 + uSkyColor + uMoonColor * 0.3) * night;
    // a soft, ragged shore
    float shore = 1.0 - smoothstep(0.45, 1.0, r + (fm - 0.5) * 0.35);
    gl_FragColor = vec4(mix(water, white, cover), shore * mix(0.7, 1.0, cover) * fade);
    return;
  }
  if (kind > 2.5) {
    // a hero's headwall: dark basalt laid down flow on flow, so it is banded
    // across with ledges where moss and ferns take hold, and fluted down by
    // the water; fading out at the rim, the flanks and the foot
    vec3 N = normalize(vN);
    float lat = vA.x;
    float dM = vA.y;
    float xm = lat * vA.w;
    float flow0 = vnoise(vec2(xm * 0.02 + vB.y * 7.0, dM * 0.09));
    float layer = smoothstep(0.35, 0.65, flow0);
    float ledge = smoothstep(0.02, 0.1, abs(fract(dM * 0.09 + flow0 * 0.6) - 0.5) - 0.38);
    float flute = vnoise(vec2(xm * 0.35, dM * 0.012)) * 0.6 + vnoise(vec2(xm * 1.1 + 3.0, dM * 0.04)) * 0.4;
    // (out toward the flanks, out of the spray's reach, the ferns win, as the
    // terrain's own green pali do; the edge wanders)
    float side = abs(lat) + (vnoise(vec2(dM * 0.04, lat * 2.0 + vB.y * 5.0)) - 0.5) * 0.35;
    float moss = clamp(smoothstep(0.5, 0.75, vnoise(vec2(xm * 0.08 + 11.0, dM * 0.05)) + ledge * 0.35) + ledge * 0.4 + smoothstep(0.25, 0.85, side) * 0.7, 0.0, 1.0);
    // (the water keeps the rock behind the sheet bare)
    float wetZ = 1.0 - smoothstep(0.6, 1.0, abs(lat) / max(vA.z, 1e-3));
    moss *= 1.0 - wetZ * 0.9;
    vec3 rock = mix(vec3(0.028, 0.025, 0.023), vec3(0.06, 0.052, 0.045), layer * 0.6 + flute * 0.4);
    vec3 albedo = mix(rock, vec3(0.04, 0.095, 0.025), moss * 0.9);
    vec3 lit = albedo * (sun * max(dot(N, uSunDir), 0.0) + ambientLight(N) + uMoonColor * max(dot(N, uMoonDir), 0.0));
    float aRock = vB.z * (1.0 - smoothstep(0.4, 1.0, side)) * smoothstep(0.0, 8.0, dM) * smoothstep(0.0, 15.0, vC.z) * 0.85;
    // and in a strip behind the sheet, wet: darker, glistening at grazing angles
    // (a thin sheen, not a mirror: wet rock is rough)
    vec3 Rf = reflect(-V, N);
    float Fr = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
    vec3 cw = vec3(0.012, 0.018, 0.012) * ambientLight(N) + skyMap(Rf) * min(Fr, 0.25) * 0.25 + sun * pow(max(dot(Rf, uSunDir), 0.0), 40.0) * 0.12;
    // (by night there's no sheen to tell wet rock from dry)
    float aw = (1.0 - smoothstep(0.5, 1.0, abs(lat) / max(vA.z, 1e-3))) * 0.5 * max(flow, vD.z) * day * smoothstep(0.0, 4.0, dM);
    float A = aRock + aw * (1.0 - aRock);
    vec3 c = (lit * aRock * (1.0 - aw) + cw * aw) / max(A, 1e-4);
    if (uDebug == 4) { c = vec3(2.0, 2.0, 0.0) * aRock; A = 1.0; }
    gl_FragColor = vec4(c, A * fade);
    return;
  }
  float along = vC.w;
  float front = vD.y;
  if (along > front) discard; // the water hasn't got this far yet
  float u = vA.x;
  float s = vA.y;
  float hwM = vA.w;
  float seed = vB.y;
  float contact = vB.z;
  float cov = vB.w;
  float veilMax = vC.x;
  float au = abs(u);
  // when the water passing here left the lip: the pattern rides down with it,
  // crawling over the brink and racing, stretched, near the foot
  float tau = uWaterTime - vA.z;
  float x = u * hwM / 1.4 + seed * 61.0; // strands ~1.4 m apart
  float y = tau * 0.9;
  // drop the octaves finer than ~2 px, replacing them with their mean
  float k1 = 1.0 - smoothstep(0.35, 0.7, max(fwidth(x), fwidth(y)));
  float k2 = 1.0 - smoothstep(0.35, 0.7, max(fwidth(x) * 2.3, fwidth(y) * 3.1));
  float n = 0.5 + (vnoise(vec2(x, y)) - 0.5) * k1 + (vnoise(vec2(x * 2.3 + 5.2, y * 3.1)) - 0.5) * 0.6 * k2;
  // thick strands and thin ones: the sheet opens up as it falls and spreads
  float open = smoothstep(0.0, 30.0 + 120.0 * flow, s) * mix(1.0, 0.6, contact);
  float thick = smoothstep(0.2 + 0.25 * open, 0.75, n);
  float e = au + (vnoise(vec2(tau * 2.2, seed * 17.0 + u * 2.0)) - 0.5) * mix(0.08, 0.5, smoothstep(0.0, 120.0, s)) * k1;
  float edge = 1.0 - smoothstep(0.7, 1.05, e);
  float chord = sqrt(max(0.0, 1.0 - au * au));
  float aCore = edge * (1.0 - exp(-chord * mix(3.5, 1.8, smoothstep(0.0, 200.0, s)))) * mix(1.0, mix(0.85, 0.35, open) + (1.0 - mix(0.85, 0.35, open)) * thick, 0.35 + 0.65 * k1);
  aCore *= mix(1.0, 0.35, smoothstep(150.0, 400.0, s) * (1.0 - flow) * (1.0 - contact));
  if (kind > 0.5 && kind < 1.5) {
    // a cascade sliding down its ramp is broken water over rock, not a solid
    // tube: thinner where it hugs the rock, and in bright and faint stretches
    // (static ledges, and surges riding down with the water) at a scale that
    // still reads from across a valley
    float run = smoothstep(0.38, 0.62, 0.65 * vnoise(vec2(seed * 9.0 + 2.3, s * 0.03)) + 0.35 * vnoise(vec2(seed * 3.0, tau * 0.18)));
    // (and streaked lengthwise like the ribbon it grows from, while there
    // are pixels enough across it to show it)
    float xs = u * 2.2 + seed * 5.0;
    float streak = smoothstep(0.3, 0.7, vnoise(vec2(xs, s * 0.02 - tau * 0.4)));
    float kS = 1.0 - smoothstep(0.3, 0.7, fwidth(xs));
    aCore *= mix(1.0, 0.65, contact) * mix(0.25, 1.0, run) * mix(1.0, 0.45 + 0.55 * streak, kS) * mix(0.75 + 0.25 * thick, 1.0, k1);
  }
  float spate = smoothstep(0.35, 0.95, flow);
  float aVeil = kind < 0.5 ? (1.0 - smoothstep(0.3, 1.0, au / veilMax)) * mix(0.12, 0.35, smoothstep(15.0, 160.0, s)) * mix(0.45, 1.25, spate) * (1.0 - 0.6 * contact) * (0.6 + 0.4 * vnoise(vec2(u * 1.5 + seed * 9.0, tau * 0.7))) : 0.0;
  float a0 = 1.0 - (1.0 - aCore) * (1.0 - aVeil);
  if (kind < 0.5) {
    // in spate a second, broken strand peels off one side of the sheet
    float sd = fract(seed * 5.3) < 0.5 ? -1.0 : 1.0;
    float us = sd * (1.0 + 0.45 * (veilMax - 1.0));
    float strand = (1.0 - smoothstep(0.08, 0.2, abs(u - us + (vnoise(vec2(tau * 0.8, seed * 7.0)) - 0.5) * 0.12)));
    strand *= smoothstep(0.72, 0.95, flow) * smoothstep(8.0, 40.0, s) * (1.0 - contact);
    strand *= smoothstep(0.3, 0.6, vnoise(vec2(seed * 3.0 + sd, tau * 1.3))) * (0.5 + 0.5 * thick);
    a0 = 1.0 - (1.0 - a0) * (1.0 - 0.6 * strand);
  }
  // the foot: a stream fall fades out into the ribbon that carries on below
  // it; a hero's landing hides in its own spray, raggedly
  if (kind > 0.5 && kind < 1.5) a0 *= smoothstep(0.0, 20.0, vC.z);
  else if (kind < 0.5) a0 *= mix(0.12, 1.0, smoothstep(0.0, 22.0, vC.z + (vnoise(vec2(u * 2.5 + seed * 11.0, tau * 1.7)) - 0.5) * 14.0));
  if (kind > 1.5) {
    // a horsetail is a thread of white pulses, never a painted line: bright
    // where it drops free, faint where it slides over the rock between, and
    // drying it breaks into dashes and drips
    float seg = smoothstep(0.47, 0.6, vnoise(vec2(seed * 13.0 + 3.7, s * 0.022)) * 0.75 + vnoise(vec2(seed * 5.0, s * 0.08)) * 0.25);
    a0 *= mix(0.03, 1.0, seg) * smoothstep(0.0, 40.0, vC.z) * mix(0.45, 1.0, smoothstep(0.25, 0.75, vnoise(vec2(seed * 7.0, tau * 1.7))) * k1 + 0.5 * (1.0 - k1)) * (0.55 + 0.45 * fract(seed * 7.31));
    a0 *= smoothstep(1.0 - flow * 1.6, 1.15 - flow * 1.6, vnoise(vec2(seed * 13.0, along * 22.0 - uWaterTime * (1.0 + 2.0 * along))));
  }
  vec3 L = uSunDir;
  float uc = clamp(u, -1.0, 1.0);
  vec3 N = normalize(vSide * uc + V * sqrt(max(0.0, 1.0 - uc * uc)));
  vec3 col = vec3(0.78, 0.82, 0.84) * mud * (0.8 + 0.3 * thick) * (1.0 + 0.2 * contact) * (sun * clamp((dot(N, L) + 0.6) / 1.6, 0.0, 1.0) + ambientLight(N) + uMoonColor * max(dot(N, uMoonDir), 0.0));
  // thin water glows when the sun is behind it
  col += sun * hg(dot(-V, L), 0.6) * 0.05 * clamp(4.0 * a0 * (1.0 - a0) + aVeil, 0.0, 1.0);
  // smooth green glassy water over the brink
  // (only a few metres of it: lower down, against a dark wall, glass reads
  // as a gap in the fall)
  float lip = (1.0 - smoothstep(1.0, 7.0, s)) * (1.0 - contact) * k1;
  float Fr = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  col = mix(col, mix(vec3(0.08, 0.11, 0.09) * (sun * max(dot(N, L), 0.0) + uSkyColor), skyMap(reflect(-V, N)), 0.3 + 0.6 * Fr), lip * 0.45);
  a0 = mix(a0, max(a0, 0.85 * edge), lip);
  // glints
  col += sun * step(0.992, hash12(floor(vec2(x * 2.0, tau * 9.0)))) * k2 * pow(max(dot(reflect(-L, N), V), 0.0), 4.0) * 2.0;
  if (front < 1.0) col *= 1.0 + 0.5 * smoothstep(front - 0.06, front, along); // the leading slug
  col *= night;
  float dCam = length(cameraPosition - vWorld);
  float a = a0 * cov * smoothstep(0.03, 0.3, flow) * fade * smoothstep(0.05, 0.4, dCam);
  if (kind < 1.5) {
    // the hand-over from the stream ribbon: the tongue fades in over the
    // stretch where the ribbon fades out, starts out as translucent as the
    // ribbon is drawn (fainter with distance, as it is), and becomes the
    // fall over its first metres (tens of metres from across a valley, where
    // a few metres are a pixel)
    float ribbonA = 0.6 * (1.0 - 0.8 * smoothstep(12.0, 60.0, dCam));
    float rl = 1.0 - smoothstep(0.0, mix(6.0, 35.0, smoothstep(15.0, 60.0, dCam)), s);
    a *= smoothstep(0.0, 0.85, vHand) * mix(1.0, ribbonA, rl);
    // (and a stream fall, like its stream, is a sheen from far off rather
    // than a painted line)
    if (kind > 0.5) a *= 1.0 - 0.5 * smoothstep(20.0, 80.0, dCam);
  } else a *= smoothstep(-3.0, 2.0, s);
  if (kind > 1.5) {
    // the wet-rock fringe around a thread, outlasting the water (faint while
    // it runs: from any distance the two would merge into a grey line)
    float aw = vD.z * 0.3 * (1.0 - smoothstep(0.7, 1.0, au / veilMax)) * cov * fade * day * mix(1.0, 0.25, smoothstep(0.1, 0.6, flow));
    // (wet rock is darker than the dry rock around it, lit as the wall is,
    // with only a hint of sheen: it must never read as a pale line)
    vec3 cw = vec3(0.014, 0.018, 0.013) * (sun * 0.5 + ambientLight(N)) + skyMap(reflect(-V, N)) * 0.008;
    float A = a + aw * (1.0 - a);
    col = (col * a + cw * aw * (1.0 - a)) / max(A, 1e-4);
    a = A;
  }
  if (uDebug == 1) { col = vec3(fract(tau * 0.5)) * 2.0; a = 1.0; }
  if (uDebug == 2) { col = vec3(cov, k1, k2) * 2.0; a = 1.0; }
  if (uDebug == 3) { col = vec3(vC.y) * 2.0; a = 1.0; }
  if (uDebug == 4) { col = kind < 0.5 ? vec3(2.0, 0.0, 0.0) : kind < 1.5 ? vec3(0.0, 2.0, 0.0) : vec3(0.0, 0.0, 2.0); a = 1.0; }
  if (uDebug == 5) { col = vec3(flow) * 2.0; a = 1.0; }
  if (uDebug == 6) { col = vec3(a) * 2.0; a = 1.0; }
  if (a < 0.003) discard;
  gl_FragColor = vec4(col, a);
}
`

const mistVertex = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
in vec3 iOrigin;
in vec4 iKind; // kind (0 plunge, 1 spray off the sheet, 2 ledge), seed, radius (units), fall id
in vec3 iFace;
uniform sampler2D uState;
uniform float uPx;
uniform float uWaterTime;
uniform vec2 uWindVec;
out vec4 vP; // x alpha, y seed, z age, w kind
out vec2 vQ;
out vec3 vWorld;
out float vSun;
void main() {
  float kind = iKind.x;
  float seed = iKind.y;
  float R = iKind.z;
  float flow = texelFetch(uState, ivec2(int(iKind.w + 0.5), 0), 0).r;
  float life = mix(5.0, 10.0, hash12(vec2(seed, 3.1)));
  // a fall in spate throws far more spray than the same fall in a dry spell
  float full = smoothstep(0.3, 0.95, flow);
  R *= mix(0.6, 1.2, full);
  float age = fract(uWaterTime / life + seed * 7.31);
  vec2 radial = vec2(cos(seed * 81.7), sin(seed * 81.7));
  vec2 wind = uWindVec * 0.09; // units per second
  vec3 p = iOrigin;
  float r = R;
  float a = 1.0;
  if (kind < 0.5 || kind > 1.5) {
    // the plunge: out from the impact, off the rock, rising
    p.xz += radial * R * 0.9 * sqrt(age) + iFace.xz * R * (0.3 + 0.9 * age) + wind * 0.35 * age * life;
    p.y += R * (0.1 + 1.1 * age);
    r = R * mix(0.55, 1.5, age);
  } else {
    // spray shed by the falling sheet: sinks, and blows downwind
    p.y -= 2.5 * Y_PER_M * age * life;
    p.xz += iFace.xz * R * 0.6 * age + wind * 0.6 * age * life;
    r = R * mix(0.6, 1.4, age);
  }
  p += (vec3(vnoise(vec2(seed * 40.0, uWaterTime * 0.3)), vnoise(vec2(seed * 50.0, uWaterTime * 0.25)), vnoise(vec2(seed * 60.0, uWaterTime * 0.3))) - 0.5) * R * 0.5;
  a *= smoothstep(0.0, 0.18, age) * (1.0 - smoothstep(0.45, 1.0, age)) * smoothstep(0.2, 0.9, flow) * (0.5 + 0.5 * flow);
  float dist = distance(cameraPosition, p);
  a *= smoothstep(2.0, 4.0, r / (uPx * dist)) * smoothstep(r * 0.6, r * 1.8, dist) * (1.0 - smoothstep(40.0, 60.0, dist));
  if (a < 0.003) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  // the card stands at the front of its own puff, so it never slices into the rock
  p += normalize(cameraPosition - p) * min(r * 0.8, dist * 0.5);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wp = p + (right * position.x + up * position.y * (kind > 0.5 && kind < 1.5 ? 1.5 : 1.0)) * r;
  vSun = sunVisibility(iOrigin);
  vP = vec4(a, seed, age, kind);
  vQ = position.xy;
  vWorld = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`

const mistFragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
uniform sampler2D uPuff;
uniform float uBow;
uniform float uNightK;
in vec4 vP;
in vec2 vQ;
in vec3 vWorld;
in float vSun;
float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}
// the primary bow only: violet inside at ~40.6 deg, red outside at ~42.3 deg
vec3 sprayBow(float deg) {
  float x = (deg - 40.4) / 2.1;
  if (x < -0.3 || x > 1.3) return vec3(0.0);
  return vec3(smoothstep(0.55, 0.9, x) * (1.0 - smoothstep(0.95, 1.2, x)),
              smoothstep(0.25, 0.55, x) * (1.0 - smoothstep(0.6, 0.85, x)),
              smoothstep(-0.25, 0.05, x) * (1.0 - smoothstep(0.25, 0.55, x)));
}
void main() {
  float r2 = dot(vQ, vQ);
  if (r2 >= 1.0) discard;
  float cs = cos(vP.y * 40.0);
  float sn = sin(vP.y * 40.0);
  vec2 q = mat2(cs, sn, -sn, cs) * vQ;
  float a = (1.0 - r2) * (1.0 - r2) * texture(uPuff, q * 0.5 + 0.5 + vec2(vP.z * 0.05, vP.y)).r * vP.x * 0.3;
  if (a < 0.002) discard;
  vec3 rd = normalize(vWorld - cameraPosition);
  float cosS = dot(rd, uSunDir);
  float phase = mix(hg(cosS, 0.62), hg(cosS, -0.22), 0.3) * 0.75 + 0.25;
  vec3 sun = uSunColor * vSun;
  vec3 col = vec3(0.92) * (sun * phase * 0.15 * (0.6 + 0.4 * (vQ.y * 0.5 + 0.5)) + uSkyColor * 0.9 + uMoonColor * 0.6) * mix(uNightK, 1.0, smoothstep(-0.12, 0.08, uSunDir.y));
  col += sprayBow(degrees(acos(clamp(-cosS, -1.0, 1.0)))) * sun * uBow * (vP.w > 0.5 && vP.w < 1.5 ? 0.6 : 1.0) * smoothstep(-0.02, 0.06, uSunDir.y);
  gl_FragColor = vec4(col, a);
}
`

/** Tileable value noise (4 octaves) for the mist puffs. */
function puffTexture() {
  const S = 64
  const out = new Uint8Array(S * S)
  const lat = (n, i, j) => hash01(((i % n) + n) % n * 157 + (((j % n) + n) % n) * 311 + n * 17)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let v = 0
      let amp = 0.5
      for (let o = 0; o < 4; o++) {
        const n = 4 << o
        const fx = (x / S) * n
        const fy = (y / S) * n
        const i = Math.floor(fx)
        const j = Math.floor(fy)
        const tx = fx - i
        const ty = fy - j
        const sx = tx * tx * (3 - 2 * tx)
        const sy = ty * ty * (3 - 2 * ty)
        const a = lat(n, i, j) + (lat(n, i + 1, j) - lat(n, i, j)) * sx
        const b = lat(n, i, j + 1) + (lat(n, i + 1, j + 1) - lat(n, i, j + 1)) * sx
        v += (a + (b - a) * sy) * amp
        amp *= 0.5
      }
      out[y * S + x] = Math.round(clamp((v / 0.9375 - 0.25) / 0.6, 0, 1) * 255)
    }
  }
  const t = new THREE.DataTexture(out, S, S, THREE.RedFormat, THREE.UnsignedByteType)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.minFilter = THREE.LinearFilter
  t.magFilter = THREE.LinearFilter
  t.needsUpdate = true
  return t
}

export class Waterfalls {
  constructor(app, plan) {
    const t0 = performance.now()
    this.app = app
    this.plan = plan
    this.enabled = true
    this.debugTime = null
    this.list = plan.falls
    this.threads = plan.threads.slice(0, Math.max(0, MAX_FALLS - plan.falls.length))
    this.nCurtain = plan.falls.length
    this.n = this.nCurtain + this.threads.length
    this.stuck = 0
    this.nodeKey = new Int32Array(16384).fill(-1)
    this.nodeVal = new Float64Array(16384)
    this.build()
    this.buildState()
    this.buildMist()
    this.clearVegetation()
    this.group = new THREE.Group()
    this.group.add(this.mesh, this.mist)
    // what the tour needs to frame each hero (world units)
    this.heroes = []
    for (let i = 0; i < this.nCurtain; i++) {
      const h = this.list[i]
      if (h.kind !== 0) continue
      this.heroes.push({
        index: i,
        model: h.model,
        src: h.src,
        lip: new THREE.Vector3(h.lip[0], h.lip[1] * Y_PER_M, h.lip[2]),
        base: new THREE.Vector3(h.pool[0], h.pool[1] * Y_PER_M, h.pool[2]),
        pool: new THREE.Vector3(h.pool[0], h.pool[1] * Y_PER_M, h.pool[2]),
        poolR: h.poolR,
        face: h.face,
        per: h.per,
        rain: h.rain,
        mist: new THREE.Vector3(h.pool[0], h.pool[1] * Y_PER_M + 0.35 * (h.lip[1] - h.pool[1]) * Y_PER_M, h.pool[2]),
      })
    }
    this.hero = this.heroes[0] || null
    this.heroView = null
    this.lastStop = -1
    this.frustum = new THREE.Frustum()
    this.projView = new THREE.Matrix4()
    this.tmp = new THREE.Vector3()
    this.setQuality(app.quality ? app.quality.level : 2)
    this.buildMs = performance.now() - t0
    this.settle()
    if (import.meta.env?.DEV) console.log('WF', JSON.stringify(this.stats))
  }

  /** The hero the tour frames (views.js may pick another if this one can't be seen). */
  setHero(h, info = null) {
    this.hero = h
    this.heroView = info
  }

  // fine: the ground as drawn up close; coarse(L): the ground as LOD L draws
  // it (both triangulations, since the terrain alternates its diagonal)
  fine(x, z) {
    return Math.max(this.app.terrain.metresAt(x, z), this.coarse(0, x, z))
  }

  coarse(L, x, z) {
    const sp = TEX * (1 << L)
    const fx = (x + HALF) / sp
    const fz = (z + HALF) / sp
    const i = Math.floor(fx)
    const j = Math.floor(fz)
    const tx = fx - i
    const tz = fz - j
    const h00 = this.node(L, i, j)
    const h10 = this.node(L, i + 1, j)
    const h01 = this.node(L, i, j + 1)
    const h11 = this.node(L, i + 1, j + 1)
    const bil = h00 + (h10 - h00) * tx + (h01 - h00) * tz + (h00 - h10 - h01 + h11) * tx * tz
    const t1 = tx + tz <= 1 ? h00 + (h10 - h00) * tx + (h01 - h00) * tz : h11 + (h01 - h11) * (1 - tx) + (h10 - h11) * (1 - tz)
    const t2 = tx >= tz ? h00 + (h10 - h00) * tx + (h11 - h10) * tz : h00 + (h01 - h00) * tz + (h11 - h01) * tx
    return Math.max(bil, t1, t2)
  }

  // the terrain's vertex height at lattice node (i, j) of LOD L, through a
  // small direct-mapped cache (a fall's stations keep asking for the same few)
  node(L, i, j) {
    const key = ((L * 4096 + j) * 4096 + i) | 0
    const slot = (Math.imul(i, 73856093) ^ Math.imul(j, 19349663) ^ Math.imul(L, 83492791)) & 16383
    if (this.nodeKey[slot] === key) return this.nodeVal[slot]
    const sp = TEX * (1 << L)
    const v = this.app.terrain.metresAt(-HALF + i * sp, -HALF + j * sp)
    this.nodeKey[slot] = key
    this.nodeVal[slot] = v
    return v
  }

  /** The polyline a fall's spine follows, and where its lip sits along it. */
  axisOf(f) {
    const xy = [0, 0]
    if (f.kind === 0) {
      lineAt(this.plan.lines[f.laid], Math.max(0, f.sLip - 0.08), xy)
      return { poly: [[xy[0], xy[1]], [f.lip[0], f.lip[2]], [f.base[0], f.base[2]]], lipAt: Math.hypot(xy[0] - f.lip[0], xy[1] - f.lip[2]) }
    }
    if (f.kind === 1) {
      const line = this.plan.lines[f.laid]
      const s0 = Math.max(0, f.sLip - 0.03)
      const poly = []
      lineAt(line, s0, xy)
      poly.push([xy[0], xy[1]])
      for (let i = 0; i < line.pts.length; i++) if (line.along[i] > s0 + 1e-4 && line.along[i] < f.sBase - 1e-4) poly.push([line.pts[i][0], line.pts[i][1]])
      lineAt(line, f.sBase, xy)
      poly.push([xy[0], xy[1]])
      return { poly, lipAt: f.sLip - s0 }
    }
    const p = f.pts
    const dx = p[1][0] - p[0][0]
    const dz = p[1][2] - p[0][2]
    const dl = Math.hypot(dx, dz) || 1
    return { poly: [[p[0][0] - (dx / dl) * 0.05, p[0][2] - (dz / dl) * 0.05], ...p.map((q) => [q[0], q[2]])], lipAt: 0.05 }
  }

  /**
   * One fall's stations, lip to foot: where the water is at each depth (the
   * ballistic throw off the lip, or the rock it slides down, whichever is
   * further out), how long it has been falling, how wide it is, and how far
   * each coarser terrain LOD would stand above it.
   */
  spine(f, id) {
    const kind = f.kind
    const { poly, lipAt } = this.axisOf(f)
    // resample the axis every 0.02
    const ax = []
    const az = []
    const sg = []
    let acc = 0
    for (let i = 0; i < poly.length; i++) {
      if (i > 0) acc += Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1])
      poly[i].s = acc
    }
    const total = acc
    const ds = kind === 2 ? 0.04 : 0.02
    for (let s = 0; s <= total + 1e-6; s += ds) {
      let k = 1
      while (k < poly.length - 1 && poly[k].s < s) k++
      const a = poly[k - 1]
      const b = poly[k]
      const t = clamp((s - a.s) / (b.s - a.s || 1), 0, 1)
      ax.push(a[0] + (b[0] - a[0]) * t)
      az.push(a[1] + (b[1] - a[1]) * t)
      sg.push(s - lipAt)
    }
    const n = ax.length
    const at = (sigma, out) => {
      const fk = (sigma + lipAt) / ds
      let k = Math.floor(fk)
      if (k < 0) k = 0
      if (k > n - 2) k = n - 2
      const t = fk - k
      out[0] = ax[k] + (ax[k + 1] - ax[k]) * t
      out[1] = az[k] + (az[k + 1] - az[k]) * t
      const dx = ax[k + 1] - ax[k]
      const dz = az[k + 1] - az[k]
      const l = Math.hypot(dx, dz) || 1
      out[2] = dx / l
      out[3] = dz / l
      return out
    }
    const lipK = Math.round(lipAt / ds)
    const yT = new Float64Array(n)
    for (let k = 0; k < n; k++) yT[k] = this.fine(ax[k], az[k]) * Y_PER_M
    const yL = yT[lipK]
    for (let k = lipK + 1; k < n; k++) yT[k] = Math.min(yT[k], yT[k - 1])
    const sigmaT = (y) => {
      for (let k = lipK + 1; k < n; k++) {
        if (yT[k] <= y) {
          const t = (yT[k - 1] - y) / (yT[k - 1] - yT[k] || 1)
          return sg[k - 1] + (sg[k] - sg[k - 1]) * t
        }
      }
      return sg[n - 1]
    }
    // the kind's numbers
    const per = f.per ?? 0
    const A = f.A
    let v0, vt, W0, spread
    if (kind === 0) {
      // (a hero leaves its lip a little faster than its stream runs: the
      // heightfield's face can't overhang, so the throw carries it clear)
      v0 = 2.2 + 3.5 * per + 1.5
      vt = 30
      W0 = clamp(0.08 + 0.03 * Math.sqrt(A), 0.1, 0.22)
      spread = 1.7
    } else if (kind === 1) {
      v0 = 1.2 + 2.8 * per
      vt = 14 + 14 * per
      W0 = clamp(0.03 + 0.02 * Math.sqrt(A), 0.04, 0.12)
      spread = 1.4
    } else {
      v0 = 0.6
      vt = 9
      W0 = 0.005 + 0.012 * clamp(A / 0.07, 0, 1)
      spread = 1.25
    }
    const drop = f.drop
    const N = kind === 0 ? 36 : kind === 1 ? clamp(Math.round(drop / 10), 12, 28) : Math.max(6, Math.round(drop / 25))
    const depths = []
    for (let k = 0; k <= N; k++) depths.push(kind === 2 ? (drop * k) / N : drop * (k / N) * (k / N))
    // (the quadratic spacing leaves the foot coarse, where a sheet bends
    // into its pool or a cascade hands back to its ribbon: a few more there)
    if (kind === 0) for (const e of [16, 10, 5, 2.5]) depths.push(drop - e)
    else if (kind === 1) for (const e of [20, 10, 4]) if (drop > 3 * e) depths.push(drop - e)
    const ledges = (f.ledges || []).slice(0, 3)
    for (const d of ledges) depths.push(d)
    depths.sort((a, b) => a - b)
    for (let k = depths.length - 2; k > 0; k--) if (depths[k + 1] - depths[k] < 1 && !ledges.includes(depths[k])) depths.splice(k, 1)
    const veilMax = kind === 0 ? 1.05 : kind === 1 ? 0.1 : 1.4
    const offK = kind === 2 ? 0.15 : 0.3
    const P = [0, 0, 0, 0]
    const st = []
    // a station lives at arc position `sig` along the axis (extrapolated past
    // either end) and `lat` to its side; x, z and its heading follow from those
    const put = (s) => {
      at(s.sig, P)
      s.fx = P[2]
      s.fz = P[3]
      s.x = P[0] - P[3] * s.lat
      s.z = P[1] + P[2] * s.lat
    }
    // the tongue: the water sliding over the brink, as wide as the stream
    // ribbon it takes over from looks, widening (or narrowing) to the fall's
    // own width over its first 20 m (the ribbon is drawn 1.4 times its
    // half-width each side on a steep, but its edges thin out; a hero's
    // tongue is narrower still, as it gathers to the brink)
    const ribbon = Math.min(0.11, 0.009 * Math.sqrt(f.ribbonA ?? A) + 0.012) * (kind === 0 ? 0.9 : 1.25)
    const poolSig = kind === 0 ? (f.pool[0] - f.lip[0]) * f.face[0] + (f.pool[2] - f.lip[2]) * f.face[1] : Infinity
    const t0 = kind === 0 ? -0.06 : -0.03
    at(t0, P)
    // (a steep ribbon is drawn a few metres proud of its bed, so a hero's
    // tongue picks it up at that height)
    st.push({ x: P[0], y: this.fine(P[0], P[1]) * Y_PER_M + (kind === 0 ? 0.035 : 0.012), z: P[1], fx: P[2], fz: P[3], d: 0, hw: kind === 0 ? Math.min(ribbon, 0.5 * W0) : ribbon, contact: 1, tongue: -1, sig: t0 })
    at(0, P)
    const hwLip = kind === 0 ? Math.min(0.5 * W0, Math.max(ribbon, 0.35 * W0)) : kind === 1 ? ribbon : Math.min(0.5 * W0, ribbon * 0.4 + 0.3 * W0)
    st.push({ x: P[0], y: yL + 0.004, z: P[1], fx: P[2], fz: P[3], d: 0, hw: hwLip, contact: 1, tongue: 0, sig: 0 })
    for (const d of depths) {
      const y = yL - d * Y_PER_M
      const sb = v0 * fallTime(d, vt) * 0.01
      const stt = sigmaT(y)
      let hw = 0.5 * W0 * (1 + ((spread - 1) * d) / Math.max(1, drop))
      if (kind < 2) hw *= hwLip / (0.5 * W0) + (1 - hwLip / (0.5 * W0)) * smooth(0, kind === 0 ? 18 : 20, d)
      const off = 0.006 + offK * hw
      // (a hero lands in its pool: down in the bowl the drawn ground, read
      // coarsely, would otherwise push its foot out past the far rim)
      const rock = Math.min(stt + off, poolSig)
      const sc = Math.max(sb, rock)
      // (a hero's headwall is taken to be undercut, as plunge pools undercut
      // them: the heightfield can't overhang, so the sheet is placed clear of
      // the drawn rock but shaded and timed as falling free)
      // (and where its pool stops it, a hero is landing in water, not on rock:
      // a sudden 'contact' there would draw a bright line across the sheet)
      const contact = kind === 0 && stt + off > poolSig ? 0 : 1 - smooth(0, 0.03, sb + (kind === 0 ? UNDERCUT : 0) - rock)
      const s = { y, d, hw, contact, ledge: ledges.includes(d), sig: sc, lat: 0 }
      put(s)
      st.push(s)
    }
    // clearance: nudge each station out from the rock until its whole
    // cross-section (with veil) is in the air
    const tan = (k, out) => {
      const a = st[Math.max(0, k - 1)]
      const b = st[Math.min(st.length - 1, k + 1)]
      out[0] = b.x - a.x
      out[1] = b.y - a.y
      out[2] = b.z - a.z
      const l = Math.hypot(out[0], out[1], out[2]) || 1
      out[0] /= l
      out[1] /= l
      out[2] /= l
      return out
    }
    const tv = [0, 0, 0]
    // (the foot meets its pool, so the last few metres may touch: they keep
    // the offset the stations above them needed, rather than snapping back)
    const footD = drop - (4 + 0.03 * drop)
    const ringStep = kind === 2 ? 2 : 1
    for (let k = 2; k < st.length; k++) {
      const s = st[k]
      // falling water never swings back toward the rock it left
      const prev = st[k - 1]
      if (k > 2 && prev.sig > s.sig) {
        s.sig = prev.sig
        s.lat = prev.lat
        put(s)
      }
      // (and right over the brink a hero's water is still on its lip)
      if (s.d > footD || (kind === 0 && s.d < 3)) continue
      tan(k, tv)
      const Fx = -s.fz
      const Fz = s.fx
      // Nf = tan × F (F horizontal)
      let nx = tv[1] * Fz - tv[2] * 0
      let ny = tv[2] * Fx - tv[0] * Fz
      let nz = tv[0] * 0 - tv[1] * Fx
      const nl = Math.hypot(nx, ny, nz) || 1
      nx /= nl
      ny /= nl
      nz /= nl
      // a hero's veil must clear its wall (as wide as the shader ever draws it
      // there: little over the brink, most mid-fall, and near the foot it may
      // brush the apron); a stream or thread may tuck its edges into the gully
      // it runs down
      const vk = kind === 0 ? 1 + (0.15 + 0.9 * smooth(10, 150, s.d)) * veilMax * (1 - smooth(0.55 * drop, footD, s.d)) : 1
      const A1 = s.hw * vk
      const A2 = s.hw * (0.45 + (0.25 - 0.45) * s.contact) * vk
      const sig0 = s.sig
      const lat0 = s.lat
      let steps = 0
      for (; steps < 80; steps++) {
        let hit = false
        let side = 0
        for (let q = 0; q < 8; q += ringStep) {
          const c = RING_C[q]
          const sn = RING_S[q]
          const px = s.x + Fx * A1 * c + nx * A2 * sn
          const py = s.y + ny * A2 * sn
          const pz = s.z + Fz * A1 * c + nz * A2 * sn
          if (py < this.fine(px, pz) * Y_PER_M + 0.004) {
            hit = true
            side += c
          }
        }
        if (!hit) break
        // out from the rock; a stream pinned against one wall of its gorge
        // also edges away from that wall
        const lat = kind === 0 ? 0 : side > 0.5 ? -0.004 : side < -0.5 ? 0.004 : 0
        s.sig += 0.005
        s.lat += lat
        put(s)
      }
      if (steps >= 80) {
        // nowhere clear within reach: better on its line than far off it
        this.stuck++
        s.sig = sig0
        s.lat = lat0
        put(s)
      }
    }
    // Smooth what the clearance did, so the sheet bends rather than kinks: a
    // 1-2-1 pass over the arc positions that may only ever push a station
    // further out (never back into the rock it was nudged clear of), and a
    // plain one over the sideways offsets.
    const n2 = st.length
    if (n2 > 4) {
      const floor = st.map((s) => s.sig ?? 0)
      for (let it = 0; it < 4; it++) {
        let a = st[2].sig
        for (let k = 3; k < n2; k++) {
          const b = st[k].sig
          const c = k + 1 < n2 ? st[k + 1].sig : b
          st[k].sig = Math.max(floor[k], (a + 2 * b + c) / 4)
          a = b
        }
        let la = st[2].lat
        for (let k = 3; k < n2 - 1; k++) {
          const lb = st[k].lat
          st[k].lat = (la + 2 * lb + st[k + 1].lat) / 4
          la = lb
        }
      }
      // (a stream fall's foot steps back over its channel, where the ribbon
      // that carries on below it fades in)
      if (kind === 1) {
        const footLen = Math.min(25, 0.25 * drop)
        for (let k = 2; k < n2; k++) st[k].lat *= 1 - smooth(drop - footLen, drop, st[k].d)
      }
      for (let k = 2; k < n2; k++) put(st[k])
    }
    // the fall's half of the cross-fade with its ribbon (planFalls): how far
    // through the ribbon's fade-out above (and a stream fall's fade-in below)
    // the stream at each station is
    for (const s of st) {
      s.hand = 1
      if (!f.hand || kind === 2) continue
      if (kind === 0 && s.sig > 0) continue
      const sS = f.sLip + s.sig
      const h = f.hand
      let t = clamp((sS - h.a) / Math.max(1e-6, h.b - h.a), 0, 1)
      if (kind === 1) t = Math.min(t, 1 - clamp((sS - h.c) / Math.max(1e-6, h.d - h.c), 0, 1))
      s.hand = t
    }
    // flight time and path length, metre by metre: drag toward the terminal
    // speed in free fall, a slower slide where the water rides the rock, and a
    // fresh start after a ledge
    let v = v0
    let T = 0
    let S = 0
    st[0].T = -0.4
    st[0].s = -3
    st[1].T = 0
    st[1].s = 0
    for (let k = 2; k < st.length; k++) {
      const a = st[k - 1]
      const b = st[k]
      const dh = Math.hypot(b.x - a.x, b.z - a.z) * 100
      const dv = (a.y - b.y) / Y_PER_M
      const ds = Math.hypot(dh, dv)
      const sub = Math.max(1, Math.ceil(ds))
      // water riding the rock is held back by it, less so the steeper the
      // rock: a cascade down a 45° ramp tops out near 9 m/s, a sheet down a
      // near-vertical face falls almost freely
      const grade = dv / Math.max(0.5, dh)
      const vs = b.contact > 0.5 ? 9 + (vt - 9) * smooth(1.5, 5, grade) : vt
      for (let q = 0; q < sub; q++) {
        v = Math.sqrt(Math.max(0.25, v * v + 2 * 9.81 * (dv / sub) * (1 - (v * v) / (vs * vs))))
        T += ds / sub / Math.max(0.5, v)
      }
      S += ds
      b.T = T
      b.s = S
      if (b.ledge) v = 2.5
    }
    // final tangents, and the lift each coarse LOD would need
    for (let k = 0; k < st.length; k++) {
      const s = st[k]
      tan(k, tv)
      s.tx = tv[0]
      s.ty = tv[1]
      s.tz = tv[2]
      const Fx = -s.fz
      const Fz = s.fx
      s.lift = [0, 0, 0, 0]
      for (let L = 0; L < 4; L++) {
        let m = this.coarse(L, s.x, s.z) * Y_PER_M + 0.01 - s.y
        // (the sheet's edges only matter where the lattice is finer than it is wide)
        if (kind !== 2 && L < 2) {
          m = Math.max(m, this.coarse(L, s.x - Fx * s.hw, s.z - Fz * s.hw) * Y_PER_M + 0.01 - s.y)
          m = Math.max(m, this.coarse(L, s.x + Fx * s.hw, s.z + Fz * s.hw) * Y_PER_M + 0.01 - s.y)
        }
        s.lift[L] = Math.max(0, m)
      }
      s.along = clamp(s.d / Math.max(1, drop), 0, 1)
      s.toBase = drop - s.d
    }
    return { st, W0, yL, at, sigmaT, drop }
  }

  build() {
    // one growable typed buffer per attribute, written in place (the build
    // runs before the first frame, so it mustn't churn the garbage collector)
    let cap = 16384
    const B = { pos: new Float32Array(cap * 3), axis: new Float32Array(cap * 3), face: new Float32Array(cap * 3), fall: new Float32Array(cap * 4), meta: new Float32Array(cap * 4), more: new Float32Array(cap * 3), lift: new Float32Array(cap * 4) }
    const SIZES = { pos: 3, axis: 3, face: 3, fall: 4, meta: 4, more: 3, lift: 4 }
    let nv = 0
    const vtx = (x, y, z, axX, axY, axZ, fcX, fcZ, s, T, hw, kind, id, seed, side, contact, along, toBase, lift, hand = 1) => {
      if (nv >= cap) {
        cap *= 2
        for (const k in B) {
          const a = new Float32Array(cap * SIZES[k])
          a.set(B[k])
          B[k] = a
        }
      }
      const i3 = nv * 3
      const i4 = nv * 4
      B.pos[i3] = x
      B.pos[i3 + 1] = y
      B.pos[i3 + 2] = z
      B.axis[i3] = axX
      B.axis[i3 + 1] = axY
      B.axis[i3 + 2] = axZ
      B.face[i3] = fcX
      B.face[i3 + 2] = fcZ
      B.fall[i4] = s
      B.fall[i4 + 1] = T
      B.fall[i4 + 2] = hw
      B.fall[i4 + 3] = kind
      B.meta[i4] = id
      B.meta[i4 + 1] = seed
      B.meta[i4 + 2] = side
      B.meta[i4 + 3] = contact
      B.more[nv * 3] = along
      B.more[nv * 3 + 1] = toBase
      B.more[nv * 3 + 2] = hand
      if (lift) {
        B.lift[i4] = lift[0]
        B.lift[i4 + 1] = lift[1]
        B.lift[i4 + 2] = lift[2]
        B.lift[i4 + 3] = lift[3]
      }
      return nv++
    }
    const iDecal = []
    const iPool = []
    const iHero = []
    const iStream = []
    const iThread = []
    const threadStart = []
    this.stations = [] // station centres of the curtains, for clearing trees
    this.pools = [] // [x, z, R]
    this.mistSrc = [] // per curtain fall: what its mist needs
    const pool = (id, seed, cx, cz, R, ox, oz, flatY) => {
      const phi = Math.atan2(oz, ox)
      const c = vtx(cx, flatY ?? this.fine(cx, cz) * Y_PER_M + 0.003, cz, 0, 1, 0, ox, oz, 0, 0, R, 4, id, seed, 0, 0, 1, 0, null)
      for (let k = 0; k <= 16; k++) {
        const a = (k / 16) * Math.PI * 2
        const x = cx + Math.cos(phi + a) * R
        const z = cz + Math.sin(phi + a) * R
        vtx(x, flatY ?? this.fine(x, z) * Y_PER_M + 0.003, z, 0, 1, 0, ox, oz, 0, 0, R, 4, id, seed, 1, a, 1, 0, null)
        if (k > 0) iPool.push(c, c + k, c + k + 1)
      }
      this.pools.push([cx, cz, R])
    }
    const curtain = (sp, id, seed, list, kind) => {
      const st = sp.st
      let prev = -1
      for (let k = 0; k < st.length; k++) {
        const s = st[k]
        const a = vtx(s.x, s.y, s.z, s.tx, s.ty, s.tz, s.fx, s.fz, s.s, s.T, s.hw, kind, id, seed, -1, s.contact, s.along, s.toBase, s.lift, s.hand)
        vtx(s.x, s.y, s.z, s.tx, s.ty, s.tz, s.fx, s.fz, s.s, s.T, s.hw, kind, id, seed, 1, s.contact, s.along, s.toBase, s.lift, s.hand)
        if (prev >= 0) list.push(prev, prev + 1, a, prev + 1, a + 1, a)
        prev = a
        if (kind !== 2) this.stations.push(s.x, s.z)
      }
    }
    const P = [0, 0, 0, 0]
    for (let id = 0; id < this.nCurtain; id++) {
      const f = this.list[id]
      const seed = hash01(id * 7.13 + 1.7)
      const sp = this.spine(f, id)
      f.W0 = sp.W0
      curtain(sp, id, seed, f.kind === 0 ? iHero : iStream, f.kind)
      // the pool, and its outlet down the stream
      const line = this.plan.lines[f.laid]
      const sOut = f.kind === 0 ? f.sPool : f.sBase
      const q0 = [0, 0]
      const q1 = [0, 0]
      lineAt(line, sOut, q0)
      lineAt(line, sOut + 0.15, q1)
      let ox = q1[0] - q0[0]
      let oz = q1[1] - q0[1]
      const ol = Math.hypot(ox, oz)
      if (ol < 1e-4) {
        ox = f.face ? f.face[0] : 1
        oz = f.face ? f.face[1] : 0
      } else {
        ox /= ol
        oz /= ol
      }
      const D = f.drop
      const R = f.kind === 0 ? f.poolR : clamp(0.05 + 0.0005 * D + 0.02 * Math.sqrt(f.A), 0.06, 0.3)
      const last = sp.st[sp.st.length - 1]
      const cx = f.kind === 0 ? f.pool[0] : last.x
      const cz = f.kind === 0 ? f.pool[2] : last.z
      // a stream fall only pools where its foot is level ground, and not
      // where the next fall down the stream begins
      const e = 0.05
      const grade = Math.hypot(this.fine(cx + e, cz) - this.fine(cx - e, cz), this.fine(cx, cz + e) - this.fine(cx, cz - e)) / (2 * e * 100)
      const crowded = this.list.some((g) => g !== f && Math.hypot(g.lip[0] - cx, g.lip[2] - cz) < R + 0.4)
      if (f.kind === 0 || (grade < 0.35 && !crowded)) pool(id, seed, cx, cz, R, ox, oz, f.kind === 0 ? f.pool[1] * Y_PER_M : undefined)
      f.poolAt = [cx, f.kind === 0 ? f.pool[1] : this.fine(cx, cz), cz, R]
      // boils at the foot of each ledge
      for (const d of (f.ledges || []).slice(0, 3)) {
        sp.at(sp.sigmaT(sp.yL - d * Y_PER_M), P)
        const gl = Math.hypot(this.fine(P[0] + e, P[1]) - this.fine(P[0] - e, P[1]), this.fine(P[0], P[1] + e) - this.fine(P[0], P[1] - e)) / (2 * e * 100)
        if (gl < 0.35) pool(id, seed + 0.37, P[0], P[1], R * 0.6, P[2], P[3])
      }
      // the headwall itself: a skin over the carved face (the terrain's own
      // shading, all in plan, smears down a face this steep into a smooth
      // panel), dark basalt in lava-flow layers with moss on the ledges,
      // and wet, glistening rock in a strip behind the sheet
      if (f.kind === 0) {
        const Fx = -f.face[1]
        const Fz = f.face[0]
        const rows = []
        const dMax = f.lip[1] - f.carve.yF
        const cMax = 0.6 * f.carve.wFace
        const COLS = 13
        const wetFrac = (1.1 * sp.W0) / cMax
        for (let d = 0; d <= dMax + 1e-6; d += 8) {
          const y = sp.yL - d * Y_PER_M
          sp.at(sp.sigmaT(y), P)
          const row = []
          for (let ci = 0; ci < COLS; ci++) {
            const l = (ci / (COLS - 1)) * 2 - 1
            let x = P[0] + Fx * l * cMax
            let z = P[1] + Fz * l * cMax
            // find the rock face at this height (round the horseshoe it lies
            // further downstream the further out it is)
            const inside = this.fine(x, z) * Y_PER_M >= y
            const dir = inside ? 1 : -1
            let lx = x
            let lz = z
            let found = false
            for (let q = 0; q < 200; q++) {
              const nx = x + f.face[0] * 0.005 * dir
              const nz = z + f.face[1] * 0.005 * dir
              const nIn = this.fine(nx, nz) * Y_PER_M >= y
              if (dir < 0) {
                if (nIn) {
                  found = true
                  break
                }
                lx = nx
                lz = nz
              } else if (!nIn) {
                lx = nx
                lz = nz
                found = true
                break
              }
              x = nx
              z = nz
            }
            if (!found) {
              row.push(-1)
              continue
            }
            const e = 0.02
            const gx = ((this.fine(lx + e, lz) - this.fine(lx - e, lz)) * Y_PER_M) / (2 * e)
            const gz = ((this.fine(lx, lz + e) - this.fine(lx, lz - e)) * Y_PER_M) / (2 * e)
            const nl = Math.hypot(gx, 1, gz)
            const n = [-gx / nl, 1 / nl, -gz / nl]
            const vxp = lx + n[0] * 0.004
            const vyp = y + n[1] * 0.004
            const vzp = lz + n[2] * 0.004
            const lift = [0, 0, 0, 0]
            for (let L = 0; L < 4; L++) lift[L] = Math.max(0, this.coarse(L, vxp, vzp) * Y_PER_M + 0.01 - vyp)
            // (s: metres below the brink; T: the wet strip's half-width, as a
            // fraction of the skin's; contact: how much of a face it is here)
            row.push(vtx(vxp, vyp, vzp, n[0], n[1], n[2], f.face[0], f.face[1], d, wetFrac, cMax, 3, id, seed, l, 1 - smooth(0.5, 0.8, n[1]), d / f.drop, f.drop - d, lift))
          }
          rows.push(row)
        }
        for (let r = 1; r < rows.length; r++) {
          for (let c = 0; c < COLS - 1; c++) {
            const a = rows[r - 1][c]
            const b = rows[r - 1][c + 1]
            const cc = rows[r][c]
            const dd = rows[r][c + 1]
            if (a < 0 || b < 0 || cc < 0 || dd < 0) continue
            iDecal.push(a, b, cc, b, dd, cc)
          }
        }
      }
      this.mistSrc.push({ id, f, sp, ox, oz })
    }
    for (let k = 0; k < this.threads.length; k++) {
      const f = this.threads[k]
      const id = this.nCurtain + k
      const sp = this.spine(f, id)
      threadStart.push(iThread.length)
      curtain(sp, id, hash01(id * 3.77 + 0.3), iThread, 2)
    }
    threadStart.push(iThread.length)
    // draw order: wet rock, pools, heroes, streams, then the threads by
    // priority (so a quality level is just a shorter draw range)
    const total = iDecal.length + iPool.length + iHero.length + iStream.length + iThread.length
    const index = nv > 65535 ? new Uint32Array(total) : new Uint16Array(total)
    let o = 0
    for (const part of [iDecal, iPool, iHero, iStream, iThread]) {
      index.set(part, o)
      o += part.length
    }
    const base = total - iThread.length
    this.decalIdx = iDecal.length // (the headwalls come first, so the slowest level can skip them)
    this.threadIdx = threadStart.map((s) => base + s)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(B.pos.slice(0, nv * 3), 3))
    g.setAttribute('aAxis', new THREE.BufferAttribute(B.axis.slice(0, nv * 3), 3))
    g.setAttribute('aFace', new THREE.BufferAttribute(B.face.slice(0, nv * 3), 3))
    g.setAttribute('aFall', new THREE.BufferAttribute(B.fall.slice(0, nv * 4), 4))
    g.setAttribute('aMeta', new THREE.BufferAttribute(B.meta.slice(0, nv * 4), 4))
    g.setAttribute('aMore', new THREE.BufferAttribute(B.more.slice(0, nv * 3), 3))
    g.setAttribute('aLift', new THREE.BufferAttribute(B.lift.slice(0, nv * 4), 4))
    g.setIndex(new THREE.BufferAttribute(index, 1))
    this.verts = nv
    this.tris = total / 3
    const app = this.app
    this.uniforms = {
      ...app.shared.uniforms,
      uHeight: { value: app.terrain.heightTex },
      uState: { value: null },
      uPx: { value: 0.001 },
      uLodRange: { value: app.terrain.range0 },
      uWaterTime: { value: 0 },
      uDebug: { value: 0 },
      uPuff: { value: null },
      uBow: { value: 0.05 },
      uNightK: { value: 0.35 },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: mainVertex,
      fragmentShader: mainFragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -10,
    })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 3
  }

  /** Per-fall state, one texel each: r flow, g water front, b wet rock. */
  buildState() {
    const n = this.n
    const W = this.app.weather
    this.state = new Float32Array(MAX_FALLS * 4)
    this.stateTex = new THREE.DataTexture(this.state, MAX_FALLS, 1, THREE.RGBAFormat, THREE.FloatType)
    this.stateTex.minFilter = THREE.NearestFilter
    this.stateTex.magFilter = THREE.NearestFilter
    this.stateTex.generateMipmaps = false
    this.stateTex.needsUpdate = true
    this.uniforms.uState.value = this.stateTex
    this.kind = new Uint8Array(n)
    this.per = new Float32Array(n)
    this.thr = new Float32Array(n)
    this.cell = new Int32Array(n)
    this.c1 = new Int32Array(n)
    this.cU1 = new Int32Array(n)
    this.cU2 = new Int32Array(n)
    this.w0 = new Float32Array(n)
    this.lenY = new Float32Array(n)
    this.flow = new Float32Array(n)
    this.front = new Float32Array(n)
    this.wet = new Float32Array(n)
    this.spate = new Float32Array(n)
    this.primed = new Float32Array(n)
    this.turb = new Float32Array(n)
    this.px = new Float32Array(n)
    this.pz = new Float32Array(n)
    this.mid = new Float32Array(n * 3)
    const G = W.G
    const cellAt = (x, z) => clamp(Math.floor((z - W.origin) / W.cell), 0, G - 1) * G + clamp(Math.floor((x - W.origin) / W.cell), 0, G - 1)
    const xy = [0, 0]
    for (let i = 0; i < n; i++) {
      const f = i < this.nCurtain ? this.list[i] : this.threads[i - this.nCurtain]
      this.kind[i] = f.kind
      this.per[i] = f.per ?? 0
      this.thr[i] = f.thr ?? 0
      this.cell[i] = cellAt(f.lip[0], f.lip[2])
      if (f.kind !== 2) {
        // (the weather's cells are four units across: a lip can sit just
        // outside the rain band that is soaking the slopes it drains)
        const line = this.plan.lines[f.laid]
        lineAt(line, f.sLip - 1, xy)
        this.cU1[i] = cellAt(xy[0], xy[1])
        lineAt(line, f.sLip - 2.5, xy)
        this.cU2[i] = cellAt(xy[0], xy[1])
      }
      this.lenY[i] = f.drop * Y_PER_M
      this.px[i] = f.lip[0]
      this.pz[i] = f.lip[2]
      this.mid[i * 3] = (f.lip[0] + f.base[0]) / 2
      this.mid[i * 3 + 1] = ((f.lip[1] + f.base[1]) / 2) * Y_PER_M
      this.mid[i * 3 + 2] = (f.lip[2] + f.base[2]) / 2
      if (f.kind === 2) {
        this.cell[i] = cellAt(f.catch[0], f.catch[1])
        this.c1[i] = cellAt(f.catch[2], f.catch[3])
        this.w0[i] = 0.6
      }
    }
  }

  /** ʻEhu: the spray, as a few hundred soft camera-facing puffs. */
  buildMist() {
    const items = []
    const wind = this.app.weather.wind
    const P = [0, 0, 0, 0]
    this.mistAnchors = []
    for (const { id, f, sp, ox, oz } of this.mistSrc) {
      const H = f.drop
      const per = f.per ?? 0
      // (every hero has its spray, however small its catchment)
      if (f.kind > 1 || H < 100 || (per < 0.2 && f.kind !== 0)) continue
      const Wm = sp.W0 * 100
      const Rb = clamp((15 + 0.25 * H) * (0.4 + 0.6 * Math.max(per, f.kind === 0 ? 0.4 : 0)) * Math.sqrt(Wm / 10), 10, 90)
      const count = f.kind === 0 ? Math.round(clamp(6 + H / 25, 6, 40) * Math.sqrt(Wm / 8)) : Math.min(4, Math.round(clamp(6 + H / 25, 6, 40) * Math.sqrt(Wm / 8)))
      const [cx, cy, cz] = f.poolAt
      const mine = []
      for (let k = 0; k < count; k++) {
        const r1 = hash01(id * 91.3 + k * 7.7)
        const r2 = hash01(id * 13.1 + k * 3.3 + 0.5)
        const rad = (0.35 + 0.25 * hash01(id * 5.3 + k * 1.9)) * Rb * 0.01
        const a = r1 * Math.PI * 2
        const o = Math.sqrt(r2) * 0.3 * Rb * 0.01
        mine.push([0, cx + Math.cos(a) * o, cy * Y_PER_M + rad * 0.5, cz + Math.sin(a) * o, rad, ox, oz])
      }
      if (f.kind === 0) {
        // spray shed by the sheet on the way down, on its downwind side
        const nS = Math.round(clamp(H / 40, 2, 10))
        for (let k = 0; k < nS; k++) {
          const d = H * (0.3 + 0.65 * Math.sqrt(hash01(id * 3.1 + k * 11.7)))
          let q = 2
          while (q < sp.st.length - 1 && sp.st[q].d < d) q++
          const s = sp.st[q]
          const Fx = -s.fz
          const Fz = s.fx
          const side = Fx * wind.x + Fz * wind.y >= 0 ? 1 : -1
          const R = (1.2 + 1.3 * hash01(id * 7.9 + k * 2.3)) * s.hw
          mine.push([1, s.x + s.fx * 0.5 * s.hw + Fx * side * s.hw * 0.5, s.y, s.z + s.fz * 0.5 * s.hw + Fz * side * s.hw * 0.5, R, s.fx, s.fz])
        }
      }
      for (const d of (f.ledges || []).slice(0, 3)) {
        sp.at(sp.sigmaT(sp.yL - d * Y_PER_M), P)
        mine.push([2, P[0], this.fine(P[0], P[1]) * Y_PER_M + Rb * 0.0025, P[1], Rb * 0.005, P[2], P[3]])
      }
      mine.forEach((m, k) => items.push({ m, id, key: (k + 0.5) / mine.length + 0.01 * hash01(id * 17.3 + k) }))
      this.mistAnchors.push(cx, cy * Y_PER_M, cz)
    }
    items.sort((a, b) => a.key - b.key)
    const n = Math.min(MIST_CAP, items.length)
    const origin = new Float32Array(MIST_CAP * 3)
    const kind = new Float32Array(MIST_CAP * 4)
    const face = new Float32Array(MIST_CAP * 3)
    for (let k = 0; k < n; k++) {
      const { m, id } = items[k]
      origin.set([m[1], m[2], m[3]], k * 3)
      kind.set([m[0], hash01(k * 1.618 + id * 0.31), m[4], id], k * 4)
      face.set([m[5], 0, m[6]], k * 3)
    }
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3))
    g.setIndex([0, 1, 2, 0, 2, 3])
    g.setAttribute('iOrigin', new THREE.InstancedBufferAttribute(origin, 3))
    g.setAttribute('iKind', new THREE.InstancedBufferAttribute(kind, 4))
    g.setAttribute('iFace', new THREE.InstancedBufferAttribute(face, 3))
    g.instanceCount = n
    this.nMist = n
    this.mistAnchors = new Float32Array(this.mistAnchors)
    this.uniforms.uPuff.value = puffTexture()
    this.mistMaterial = new THREE.ShaderMaterial({
      vertexShader: mistVertex,
      fragmentShader: mistFragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.mist = new THREE.Mesh(g, this.mistMaterial)
    this.mist.frustumCulled = false
    this.mist.renderOrder = 4
  }

  /** No trees standing in a fall, its pool or a hero's notch. */
  clearVegetation() {
    const veg = this.app.vegetation
    if (!veg || !veg.cleared) return
    const N = HYDRO_RES
    const m = veg.cleared
    const stamp = (x, z, r, test) => {
      const i0 = Math.max(0, Math.floor((x - r + HALF) / CELL))
      const i1 = Math.min(N - 1, Math.floor((x + r + HALF) / CELL))
      const j0 = Math.max(0, Math.floor((z - r + HALF) / CELL))
      const j1 = Math.min(N - 1, Math.floor((z + r + HALF) / CELL))
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const cx = -HALF + (i + 0.5) * CELL
          const cz = -HALF + (j + 0.5) * CELL
          if (test ? test(cx, cz) : Math.hypot(cx - x, cz - z) <= r) m[j * N + i] = 1
        }
      }
    }
    for (let k = 0; k < this.stations.length; k += 2) stamp(this.stations[k], this.stations[k + 1], 0.2)
    for (const [x, z, R] of this.pools) stamp(x, z, R + 0.1)
    const xy = [0, 0]
    for (const f of this.list) {
      if (f.kind !== 0) continue
      // below the pool the stream runs out over open boulders, so the fall
      // can be seen from down its valley
      const line = this.plan.lines[f.laid]
      for (let s = f.sPool; s < f.sPool + 1.6; s += 0.1) {
        lineAt(line, s, xy)
        stamp(xy[0], xy[1], 0.32 - 0.12 * ((s - f.sPool) / 1.6))
      }
      // the notch itself: its floor and the foot of its walls are bare rock
      const [ux, uz] = f.face
      const w = 0.75 * f.carve.wFace
      const s1 = f.carve.faceRun + 0.6
      stamp(f.lip[0] + ux * s1 * 0.5, f.lip[2] + uz * s1 * 0.5, s1 + w, (x, z) => {
        const px = x - f.lip[0]
        const pz = z - f.lip[2]
        const s = px * ux + pz * uz
        const c = -px * uz + pz * ux
        return s >= -0.1 && s <= s1 && Math.abs(c) < w
      })
    }
    // and the near-vertical walls of the amphitheatre round a hero hold no
    // trees at all (the forest keeps a few on any steep pali, which here, in
    // front of the bare headwall, would hang off the rock like lollipops)
    const T = this.app.terrain
    const nv = new THREE.Vector3()
    for (const f of this.list) {
      if (f.kind !== 0) continue
      const [ax, , az] = f.lip
      const [bx, , bz] = f.pool
      stamp((ax + bx) / 2, (az + bz) / 2, 1.8, (x, z) => segDist(x, z, ax, az, bx, bz) < 1.5 && T.normalAt(x, z, nv).y < 0.45)
    }
  }

  /**
   * Clear the trees out of a sight line, from `a` to each of `targets`
   * (world points), wherever the line runs low enough over the ground for a
   * crown to stand in it. The tour uses this so the fall it frames isn't
   * seen through a hedge.
   */
  clearSight(a, targets) {
    const veg = this.app.vegetation
    if (!veg || !veg.cleared) return
    const T = this.app.terrain
    const m = veg.cleared
    const N = HYDRO_RES
    let changed = false
    for (const b of targets) {
      const len = Math.hypot(b.x - a.x, b.z - a.z)
      const n = Math.ceil(len / (CELL * 0.4))
      for (let k = 1; k < n; k++) {
        const t = k / n
        const x = a.x + (b.x - a.x) * t
        const z = a.z + (b.z - a.z) * t
        const y = a.y + (b.y - a.y) * t
        if (y - Math.max(0, T.heightAt(x, z)) > 0.6) continue
        // (a cell's trees stand anywhere in it: clear the line's neighbours too)
        for (const [ox, oz] of [[0, 0], [CELL * 0.5, 0], [-CELL * 0.5, 0], [0, CELL * 0.5], [0, -CELL * 0.5]]) {
          const i = Math.floor((x + ox + HALF) / CELL)
          const j = Math.floor((z + oz + HALF) / CELL)
          if (i < 0 || j < 0 || i >= N || j >= N || m[j * N + i]) continue
          m[j * N + i] = 1
          changed = true
        }
      }
    }
    // (forest tiles read the mask when they're built; drop any built already)
    if (changed && veg.tiles) {
      veg.tiles.clear()
      veg.lastSelection = ''
    }
  }

  /** Rainfall a thread's slope has had lately, in the weather's units. */
  raw(i) {
    const R = this.app.weather.rain
    return Math.min(1.5, (R[this.cell[i]] * this.w0[i] + R[this.c1[i]] * (1 - this.w0[i])) / 1.2)
  }

  targetOf(i, flowAll) {
    if (this.kind[i] === 2) {
      const eff = Math.max(this.spate[i], this.primed[i])
      return smooth(this.thr[i], this.thr[i] + 0.3, eff)
    }
    // the stream ribbons' own law, so a stream fall and its stream agree; a
    // hero, fed by its own catchment, sinks lower between rains and rises
    // faster in a storm
    const rain = this.wetOf(i) * 1.4 + flowAll * 0.5
    return Math.min(1, this.kind[i] === 0 ? this.per[i] * 0.5 + rain * 1.5 : this.per[i] + rain)
  }

  /** How wet a fall's catchment is: the ground at its lip and up its stream. */
  wetOf(i) {
    const w = this.app.weather.wet
    return (w[this.cell[i]] + w[this.cU1[i]] + w[this.cU2[i]]) / 3
  }

  /**
   * Mud in the water: a trade-wind shower runs off nearly clear; a Kona
   * storm's downpour on the slopes above washes the soil in.
   */
  turbOf(i) {
    if (this.kind[i] === 2) return 0
    const W = this.app.weather
    const r = W.rain
    return smooth(0.3, 0.8, Math.max(r[this.cell[i]], r[this.cU1[i]], r[this.cU2[i]])) * (W.regime === 'kona' ? 1 : 0.25)
  }

  /**
   * The tour arrives a little after the rain: walls near the stop it opens
   * start running at once, rather than half a simulated hour later — but
   * only those whose slope the weather is actually wetting.
   */
  prime(target, r, k) {
    const W = this.app.weather
    for (let i = this.nCurtain; i < this.n; i++) {
      const dx = this.px[i] - target.x
      const dz = this.pz[i] - target.z
      if (dx * dx + dz * dz >= r * r) continue
      const kk = k * smooth(0.1, 0.45, Math.max(this.raw(i), W.wet[this.cell[i]]))
      if (this.primed[i] < kk) this.primed[i] = kk
    }
  }

  primeStop() {
    const ui = this.app.ui
    if (!ui || !ui.stops) return
    this.lastStop = ui.index
    const v = ui.views[ui.stops[ui.index]?.id]
    if (v && v.spate) this.prime(v.target, 40, v.spate)
  }

  /** Jump every fall to its steady state for the weather as it is now. */
  settle() {
    const flowAll = this.app.streams ? this.app.streams.uniforms.uFlowAll.value : 0
    for (let i = this.nCurtain; i < this.n; i++) this.spate[i] = this.raw(i)
    // (a stop the tour just opened still primes its walls)
    const ui = this.app.ui
    if (ui && ui.index !== this.lastStop) this.primeStop()
    for (let i = 0; i < this.n; i++) {
      const t = this.targetOf(i, flowAll)
      this.flow[i] = t
      this.front[i] = t > 0.05 ? 1.15 : 0
      this.wet[i] = t
      this.turb[i] = this.turbOf(i)
      this.state[i * 4] = t
      this.state[i * 4 + 1] = this.front[i]
      this.state[i * 4 + 2] = t
      this.state[i * 4 + 3] = this.turb[i]
    }
    this.stateTex.needsUpdate = true
  }

  update(dt) {
    const app = this.app
    const sim = dt * app.clock.speed
    const up = 1 - Math.exp(-sim / 1800) // rises in half an hour (sim)
    const down = 1 - Math.exp(-sim / 10800) // falls over three
    const ease = 1 - Math.exp(-dt / 2) // never pops, even when the clock jumps
    const wetK = Math.exp(-sim / 21600)
    const flowAll = app.streams.uniforms.uFlowAll.value
    const ui = app.ui
    if (ui && ui.index !== this.lastStop) this.primeStop()
    const S = this.state
    let dirty = false
    for (let i = 0; i < this.n; i++) {
      if (this.kind[i] === 2) {
        const raw = this.raw(i)
        this.spate[i] += (raw - this.spate[i]) * (raw > this.spate[i] ? up : down)
        this.primed[i] -= this.primed[i] * down
      }
      const target = this.targetOf(i, flowAll)
      this.flow[i] += (target - this.flow[i]) * ease
      if (target > 0.05) this.front[i] = Math.min(1.15, this.front[i] + dt / (2 + 4 * this.lenY[i]))
      else if (this.flow[i] < 0.03) this.front[i] = 0
      this.wet[i] = Math.max(this.flow[i], this.wet[i] * wetK)
      const tb = this.turbOf(i)
      this.turb[i] += (tb - this.turb[i]) * (tb > this.turb[i] ? up : down)
      const k = i * 4
      if (Math.abs(S[k] - this.flow[i]) > 1e-4 || Math.abs(S[k + 1] - this.front[i]) > 1e-4 || Math.abs(S[k + 2] - this.wet[i]) > 1e-4 || Math.abs(S[k + 3] - this.turb[i]) > 1e-3) {
        S[k] = this.flow[i]
        S[k + 1] = this.front[i]
        S[k + 2] = this.wet[i]
        S[k + 3] = this.turb[i]
        dirty = true
      }
    }
    if (dirty) this.stateTex.needsUpdate = true
    const u = this.uniforms
    const cam = app.camera
    u.uLodRange.value = app.terrain.range0
    u.uPx.value = (2 * Math.tan((cam.fov / 2) * (Math.PI / 180))) / Math.max(1, app.renderer.domElement.height)
    u.uWaterTime.value = this.debugTime ?? app.time
    const p = cam.position
    const alt = p.y - Math.max(0, app.terrain.heightAt(p.x, p.z))
    this.group.visible = this.enabled && alt < 90
    let near = Infinity
    const A = this.mistAnchors
    for (let k = 0; k < A.length; k += 3) {
      const dx = A[k] - p.x
      const dy = A[k + 1] - p.y
      const dz = A[k + 2] - p.z
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 < near) near = d2
    }
    this.mist.visible = this.group.visible && near < 3600
    this.holdOrbit()
  }

  /**
   * The tour's wailele stop can see its fall only across part of a turn
   * round it (views.js works the arc out: beyond it the notch hides the
   * fall, and the camera would run into the valley walls and the forest). So
   * while the stop idles, its slow orbit swings back and forth across that
   * arc, easing to a stop at each end, instead of carrying on.
   */
  holdOrbit() {
    const ui = this.app.ui
    const rig = this.app.rig
    if (!ui || !ui.stops || !rig || rig.flight || !rig.autoOrbit) return
    const v = ui.views[ui.stops[ui.index]?.id]
    if (!v || !v.orbit) return
    const portrait = typeof innerWidth === 'number' && innerWidth < innerHeight
    const arc = (portrait && v.orbitPortrait) || v.orbit
    const lo = arc[0] - v.yaw
    const hi = arc[1] - v.yaw
    const at = wrapAngle(rig.goal.yaw - v.yaw)
    let dir = rig.autoOrbit > 0 ? 1 : -1
    if (dir > 0 && at >= hi) dir = -1
    else if (dir < 0 && at <= lo) dir = 1
    // (slow near either end, arriving or leaving; a camera the user turned
    // off the arc comes back at the usual pace)
    const room = at < lo - 0.05 || at > hi + 0.05 ? 1 : Math.max(0, Math.min(hi - at, at - lo))
    rig.autoOrbit = dir * (v.distance < 60 ? 0.012 : 0.02) * (0.15 + 0.85 * smooth(0, 0.12, room))
  }

  /** Fewer threads and puffs on slower machines, and no headwall skin on the slowest (draw ranges only). */
  setQuality(level) {
    const L = clamp(level | 0, 0, 3)
    const nT = Math.min(THREADS_BY_LEVEL[L], this.threads.length)
    const start = L === 0 ? this.decalIdx : 0
    this.mesh.geometry.setDrawRange(start, this.threadIdx[nT] - start)
    this.mist.geometry.instanceCount = Math.round(this.nMist * MIST_BY_LEVEL[L])
  }

  setDebug(n) {
    this.uniforms.uDebug.value = n | 0
  }

  /** Dev: put the camera in front of fall i (yaw relative to its face). */
  frame(i, dist, dyaw = 0, pitch = 0.15, lift = 0) {
    const f = i < this.nCurtain ? this.list[i] : this.threads[i - this.nCurtain]
    const p = f.poolAt || f.base
    const fx = f.face ? f.face[0] : f.base[0] - f.lip[0]
    const fz = f.face ? f.face[1] : f.base[2] - f.lip[2]
    const yaw = Math.atan2(fx, fz) + dyaw
    const r = this.app.rig
    for (const st of [r.goal, r.state]) {
      st.target.set(p[0], Math.max(0, this.app.terrain.heightAt(p[0], p[2])), p[2])
      st.distance = dist
      st.yaw = yaw
      st.pitch = pitch
      st.lift = lift
    }
    r.flight = null
    r.autoOrbit = 0
  }

  get stats() {
    const app = this.app
    let on = 0
    let inView = 0
    if (app.camera) {
      app.camera.updateMatrixWorld()
      this.projView.multiplyMatrices(app.camera.projectionMatrix, app.camera.matrixWorldInverse)
      this.frustum.setFromProjectionMatrix(this.projView)
    }
    for (let i = this.nCurtain; i < this.n; i++) {
      if (this.flow[i] <= 0.5) continue
      on++
      this.tmp.set(this.mid[i * 3], this.mid[i * 3 + 1], this.mid[i * 3 + 2])
      if (this.frustum.containsPoint(this.tmp) && this.tmp.distanceTo(app.camera.position) < 70) inView++
    }
    const heroes = this.list.filter((f) => f.kind === 0)
    return {
      heroes: heroes.length,
      model: heroes.some((f) => f.model),
      akuaLine: this.hero ? this.hero.src : -1,
      akuaHero: this.heroes.indexOf(this.hero),
      akuaView: this.heroView,
      stream: this.nCurtain - heroes.length,
      threads: this.threads.length,
      threadsOn: on,
      inView,
      mist: this.nMist,
      verts: this.verts,
      tris: this.tris,
      stuck: this.stuck,
      carvedTexels: this.plan.carved.reduce((s, c) => s + c.texels, 0),
      trench: this.plan.trench,
      planMs: Math.round(this.plan.ms.total),
      buildMs: Math.round(this.buildMs || 0),
      cutTris: app.streams ? app.streams.cutTris : -1,
    }
  }
}
