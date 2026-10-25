// Where people lived and worked, found by reading the land the way a konohiki
// would: loʻi on the flat, wet, stream-fed valley floors; the kauhale near the
// stream mouth on level ground behind the beach; a heiau on a commanding point;
// a fishpond walled off from the reef flat beside the stream, where fresh water
// keeps it brackish and rich; dryland field systems on the leeward slopes where
// rain is too scarce for loʻi; and the chiefly centre on a sunny leeward bay,
// with its hōlua slide and, out on a lava point, the puʻuhonua.

import { cellSize, toWorld, distanceTransform, sample, D8X, D8Y, cellIndex } from './grid.js'
import { mulberry32, smoothstep } from './noise.js'
import { layTerraces } from './loi.js'
import { HEIAU, HOUSE, Placer, keepOut, addLoi, addPond, addHolua, drawnMetres, paepae, heiauHalf } from './footing.js'

/** Grid helpers over the hydrology-resolution fields. */
function fields(T, D, N) {
  const h = T.h
  const NN = N * N
  const cs = cellSize(N)
  const dxM = cs * 100
  const slope = new Float32Array(NN)
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const c = j * N + i
      slope[c] = Math.hypot(h[c + 1] - h[c - 1], h[c + N] - h[c - N]) / (2 * dxM)
    }
  }
  const toSea = distanceTransform(N, (c) => h[c] <= 0) // cells, inland
  const stream = new Uint8Array(NN)
  for (const s of T.streams) for (const p of s.pts) {
    const c = cellIndex(N, p[0], p[1])
    if (c >= 0 && h[c] > 0) stream[c] = 1
  }
  const toStream = distanceTransform(N, (c) => stream[c] === 1)
  return { h, slope, toSea, toStream, rain: T.rain, area: T.route.area, label: D.label, N, cs, dxM }
}

const at = (F, arr, x, z) => {
  const c = cellIndex(F.N, x, z)
  return c < 0 ? 0 : arr[c]
}

/** The cell where an ahupuaʻa's biggest stream meets the sea. */
function mainMouth(F, T, id) {
  const { rcv, order, count, area } = T.route
  let best = -1
  let ba = 0
  for (let q = 0; q < count; q++) {
    const c = order[q]
    if (F.label[c] !== id) continue
    const r = rcv[c]
    if ((r === c || F.h[r] <= 0) && area[c] > ba) {
      ba = area[c]
      best = c
    }
  }
  return best
}

/** Walk up the trunk stream from a mouth, always taking the biggest tributary. */
function trunkFrom(F, T, mouth, maxMetres = 420) {
  const { rcv, area } = T.route
  const N = F.N
  const path = [mouth]
  let c = mouth
  for (let step = 0; step < 900; step++) {
    const i = c % N
    const j = (c / N) | 0
    let best = -1
    let ba = 0
    for (let d = 0; d < 8; d++) {
      const ni = i + D8X[d]
      const nj = j + D8Y[d]
      if (ni < 1 || nj < 1 || ni >= N - 1 || nj >= N - 1) continue
      const n = nj * N + ni
      if (rcv[n] === c && area[n] > ba) {
        ba = area[n]
        best = n
      }
    }
    if (best < 0 || F.h[best] > maxMetres || ba < 0.4) break
    path.push(best)
    c = best
  }
  return path.map((c) => ({ c, x: toWorld(N, c % N), z: toWorld(N, (c / N) | 0), h: F.h[c], area: area[c] }))
}

/** Best cell by `score` within `r` world units of (x, z). */
function bestNear(F, x, z, r, score) {
  const N = F.N
  const cs = F.cs
  const ci = Math.round((x + 180) / cs - 0.5)
  const cj = Math.round((z + 180) / cs - 0.5)
  const R = Math.ceil(r / cs)
  let best = null
  let bs = -Infinity
  for (let dj = -R; dj <= R; dj++) {
    for (let di = -R; di <= R; di++) {
      if (di * di + dj * dj > R * R) continue
      const i = ci + di
      const j = cj + dj
      if (i < 1 || j < 1 || i >= N - 1 || j >= N - 1) continue
      const c = j * N + i
      const s = score(c, toWorld(N, i), toWorld(N, j))
      if (s > bs) {
        bs = s
        best = { c, x: toWorld(N, i), z: toWorld(N, j), score: s }
      }
    }
  }
  return best
}

/** Local prominence: how far a cell stands above the ground ~r cells around. */
function prominence(F, c, r = 8) {
  const N = F.N
  const i = c % N
  const j = (c / N) | 0
  let s = 0
  let n = 0
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2
    const ii = Math.round(i + Math.cos(a) * r)
    const jj = Math.round(j + Math.sin(a) * r)
    if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue
    s += Math.max(0, F.h[jj * N + ii])
    n++
  }
  return F.h[c] - s / Math.max(1, n)
}

export function placeSites(T, D, height, N2, ahu, trail, seed, lines = []) {
  const N = T.h.length === 1024 * 1024 ? 1024 : Math.sqrt(T.h.length)
  const F = fields(T, D, N)
  const rand = mulberry32(seed + 9001)
  const info = D.info
  const lagoonAt = (x, z) => at(F, T.coast.lagoon, x, z)
  const reefAt = (x, z) => at(F, T.coast.reefWidth, x, z)

  const ahupuaa = info.map((a) => {
    const mouth = mainMouth(F, T, a.id)
    const mx = mouth >= 0 ? toWorld(N, mouth % N) : a.coastX
    const mz = mouth >= 0 ? toWorld(N, (mouth / N) | 0) : a.coastZ
    const trunk = mouth >= 0 ? trunkFrom(F, T, mouth) : []
    const rainLow = trunk.length ? trunk.slice(0, 30).reduce((s, p) => s + at(F, F.rain, p.x, p.z), 0) / Math.min(30, trunk.length) : 500
    return { ...a, mouth: [mx, mz], mouthArea: mouth >= 0 ? T.route.area[mouth] : 0, trunk, rainLow }
  })

  // The model ahupuaʻa the tour walks down: windward, big perennial stream,
  // reaching the summit cloud, opening onto the lagoon.
  let model = null
  let ms = -Infinity
  for (const a of ahupuaa) {
    if (a.moku !== 0) continue
    const s = Math.sqrt(a.mouthArea) * 2 + a.top / 300 + lagoonAt(a.coastX, a.coastZ) * 6 + Math.min(a.trunk.length, 160) / 40
    if (s > ms) {
      ms = s
      model = a
    }
  }

  const villages = []
  const loi = []
  const heiau = []
  const ponds = []
  const canoes = []
  const koa = []
  const houses = []
  const surf = []
  // what the loʻi already cover, so nothing else is built in a paddy
  const loiAt = []
  const onLoi = (x, z) => loiAt.some((f) => f(x, z))
  // the ground as it will be drawn, and what is on it so far, for the heiau
  // (each building is settled onto the final ground once it's all made: see
  // footing.js; a heiau's site has to be chosen with it in mind)
  const ground = new Placer((x, z) => drawnMetres(height, N2, x, z), keepOut(lines))
  let blocked = 0
  const stand = (list) => {
    for (const h of list) {
      const [L, W] = HOUSE[h.kind] || HOUSE.noa
      const [hx, hz] = paepae(L * (h.scale || 1), W * (h.scale || 1))
      ground.block(h.x, h.z, h.rot, hx, hz)
    }
  }

  for (const a of ahupuaa) {
    const isModel = a === model
    const [mx, mz] = a.mouth
    // --- the kauhale: level ground just back from the shore, off the stream ---
    const v = bestNear(F, mx, mz, isModel ? 9 : 7, (c, x, z) => {
      const h = F.h[c]
      if (h < 1.5 || h > 30 || F.label[c] !== a.id) return -Infinity
      const sea = F.toSea[c] * F.cs
      const st = F.toStream[c] * F.cs
      return -F.slope[c] * 40 - Math.abs(sea - 2.2) * 0.8 - Math.max(0, 0.8 - st) * 6 - Math.hypot(x - mx, z - mz) * 0.15
    })
    if (!v) continue
    const village = { id: a.id, x: v.x, z: v.z, moku: a.moku, model: isModel, size: isModel ? 9 : 4 + Math.floor(rand() * 4) }
    villages.push(village)
    // houses in a loose cluster
    for (let k = 0; k < village.size; k++) {
      const p = bestNear(F, v.x + (rand() - 0.5) * 2.6, v.z + (rand() - 0.5) * 2.6, 1.2, (c, x, z) => {
        if (F.h[c] < 1.2 || F.slope[c] > 0.12) return -Infinity
        if (houses.some((hh) => Math.hypot(hh.x - x, hh.z - z) < 0.22)) return -Infinity
        return -F.slope[c] * 20 + rand() * 0.5
      })
      if (p) houses.push({ x: p.x, z: p.z, rot: rand() * Math.PI, kind: k === 0 ? 'mua' : k === 1 ? 'noa' : k === 2 ? 'aina' : k === 3 && rand() < 0.6 ? 'kuku' : 'noa', village: a.id, scale: 0.85 + rand() * 0.35 })
    }

    // --- loʻi on wet, stream-fed valley floors ---
    const wet = a.rainLow > 1400 && a.mouthArea > 3
    if (wet && a.trunk.length > 12) {
      const t = layTerraces({
        height,
        N2,
        trunk: a.trunk.slice(0, isModel ? 140 : 90),
        lines,
        houses,
        label: (x, z) => at(F, F.label, x, z),
        id: a.id,
        // (their own dice, so the rest of the land doesn't shift with them)
        rand: mulberry32(seed + 7001 + a.id),
      })
      if (t.paddies.length > 6) {
        loiAt.push(t.occupied)
        loi.push({ id: a.id, model: isModel, paddies: t.paddies, auwai: t.auwai, cut: t.cut })
        addLoi(ground.K, t)
        // a farming household or two up among the terraces, on dry ground
        const mid = t.paddies[Math.floor(t.paddies.length * 0.5)]
        const p = bestNear(F, mid.c[0], mid.c[1], 2.4, (c, x, z) => (F.h[c] > 2 && F.slope[c] < 0.2 && F.toStream[c] * F.cs > 1.2 && !onLoi(x, z) && !onLoi(x + 0.18, z + 0.12) ? -F.slope[c] * 10 - F.toStream[c] * F.cs * 0.3 : -Infinity))
        if (p) for (let k = 0; k < 2; k++) houses.push({ x: p.x + k * 0.18, z: p.z + k * 0.12, rot: rand() * Math.PI, kind: 'noa', village: a.id, scale: 0.8 })
      }
    }

    // --- heiau: a commanding spot near the village, set back from the brink ---
    stand(houses.slice(blocked))
    blocked = houses.length
    if (isModel || rand() < 0.45) {
      const hs = heiauSite(F, ground, a.id, v, isModel, onLoi)
      if (hs) {
        const kind = isModel ? 'luakini' : rand() < 0.5 ? 'mapele' : 'koa-heiau'
        // (the model's heiau is a tour stop: it stands even if nowhere quite
        // serves, and is settled as best it can be later)
        if (hs.fits || isModel) heiau.push({ x: hs.x, z: hs.z, id: a.id, kind, rot: hs.rot, model: isModel })
      }
    }

    // --- fishpond: walled off from the reef flat beside the stream mouth ---
    const reef = reefAt(mx, mz)
    if ((reef > 380 && rand() < 0.75) || isModel) {
      let pond = null
      // the model ahupuaʻa must have one: try both sides and smaller walls
      const tries = isModel ? [4.2, 3.6, 3.0, 2.5, 2.0, 1.6] : [2.2 + rand() * 1.6]
      for (const r of tries) {
        for (const side of isModel ? [1, -1] : [rand() < 0.5 ? -1 : 1]) {
          pond = pond || fishpond(F, T, mx, mz, a.id, r, rand, side, isModel ? 5.5 : 3.2)
        }
      }
      if (pond) {
        ponds.push({ ...pond, id: a.id, model: isModel })
        addPond(ground.K, pond)
      }
    }

    // --- canoes drawn up on the beach, a canoe house, and the fishing shrine ---
    const beach = bestNear(F, v.x, v.z, 5, (c, x, z) => {
      const h = F.h[c]
      if (h <= 0.3 || h > 3.5) return -Infinity
      const sea = F.toSea[c] * F.cs
      return -Math.abs(sea - 0.45) * 3 - Math.hypot(x - v.x, z - v.z) * 0.3 + at(F, T.coast.sand, x, z) * 2
    })
    if (beach) {
      // face the canoes down the beach toward the water
      const toW = seaward(F, beach.c)
      canoes.push({ x: beach.x, z: beach.z, dir: toW, n: isModel ? 4 : 1 + Math.floor(rand() * 3), house: true, village: a.id })
      const k = bestNear(F, beach.x, beach.z, 4, (c, x, z) => {
        const h = F.h[c]
        if (h < 1 || h > 12) return -Infinity
        return prominence(F, c, 4) * 0.2 - F.toSea[c] * F.cs * 1.2 - Math.abs(Math.hypot(x - beach.x, z - beach.z) - 2) * 0.5
      })
      if (k) koa.push({ x: k.x, z: k.z, id: a.id })
    }

    // --- a surf break where swell meets the reef crest offshore ---
    if (rand() < 0.5 || isModel) {
      const s = surfBreak(F, T, v.x, v.z)
      if (s) surf.push({ ...s, id: a.id })
    }
  }

  // --- fishpond country: wide, shallow reef flats get a string of loko kuapā ---
  for (let k = 0; k < trail.length; k += 3) {
    const [tx, tz] = trail[k]
    const c = cellIndex(N, tx, tz)
    if (c < 0) continue
    // nearest shoreline point seaward of the trail
    const dir = seaward(F, c)
    let sx = tx
    let sz = tz
    for (let d = 0; d < 6; d += 0.2) {
      sx = tx + Math.cos(dir) * d
      sz = tz + Math.sin(dir) * d
      if (sample(F.h, N, sx, sz) <= 0) break
    }
    if (reefAt(sx, sz) < 850 || ponds.some((p) => Math.hypot(p.cx - sx, p.cz - sz) < 7)) continue
    if (ponds.length > 18 || rand() < 0.35) continue
    const sc = cellIndex(N, sx - Math.cos(dir) * 0.3, sz - Math.sin(dir) * 0.3)
    if (sc < 0 || F.h[sc] <= 0) continue
    const pond = fishpond(F, T, sx - Math.cos(dir) * 0.3, sz - Math.sin(dir) * 0.3, F.label[sc], 1.6 + rand() * 1.4, rand)
    if (pond) {
      ponds.push({ ...pond, id: F.label[sc], model: false })
      addPond(ground.K, pond)
    }
  }

  // --- the chiefly centre on the leeward coast ---
  const kona = villages.filter((v) => v.moku === 2)
  let alii = null
  let as = -Infinity
  for (const v of kona) {
    const s = at(F, T.coast.sand, v.x, v.z) * 3 - Math.abs(v.z - 60) * 0.02 + rand() * 0.5
    if (s > as) {
      as = s
      alii = v
    }
  }
  let puuhonua = null
  let holua = null
  const saltpans = []
  if (alii) {
    alii.alii = true
    alii.size += 3
    for (let k = 0; k < 4; k++) {
      const p = bestNear(F, alii.x + (rand() - 0.5) * 3, alii.z + (rand() - 0.5) * 3, 1.6, (c, x, z) => (F.h[c] > 1.5 && F.slope[c] < 0.1 && !houses.some((hh) => Math.hypot(hh.x - x, hh.z - z) < 0.25) ? -F.slope[c] * 20 : -Infinity))
      if (p) houses.push({ x: p.x, z: p.z, rot: rand() * Math.PI, kind: k === 0 ? 'alii' : 'noa', village: alii.id, scale: k === 0 ? 1.5 : 1.05 })
    }
    // puʻuhonua: a point of land on this coast, walled off from the inland side
    const pt = bestNear(F, alii.x, alii.z, 26, (c, x, z) => {
      const h = F.h[c]
      if (h < 0.8 || h > 9 || Math.hypot(x - alii.x, z - alii.z) < 5) return -Infinity
      // a point: sea on many sides within ~300 m
      let seaN = 0
      for (let k = 0; k < 16; k++) {
        const ang = (k / 16) * Math.PI * 2
        if (sample(F.h, N, x + Math.cos(ang) * 3, z + Math.sin(ang) * 3) <= 0) seaN++
      }
      return seaN - Math.hypot(x - alii.x, z - alii.z) * 0.08 - F.slope[c] * 10
    })
    if (pt) puuhonua = { x: pt.x, z: pt.z, dir: seaward(F, pt.c) }
    // hōlua: a long straight run down a steady slope inland of the chief's bay
    const top = bestNear(F, alii.x, alii.z, 30, (c, x, z) => {
      const h = F.h[c]
      if (h < 140 || h > 360) return -Infinity
      const dir = seaward(F, c)
      const len = 11
      const ex = x + Math.cos(dir) * len
      const ez = z + Math.sin(dir) * len
      const drop = h - sample(F.h, N, ex, ez)
      const mid = sample(F.h, N, (x + ex) / 2, (z + ez) / 2)
      const straight = Math.abs(mid - (h + (h - drop)) / 2)
      if (drop < 80) return -Infinity
      return drop * 0.02 - straight * 0.15 - Math.hypot(x - alii.x, z - alii.z) * 0.06
    })
    if (top) {
      const dir = seaward(F, top.c)
      holua = { x0: top.x, z0: top.z, x1: top.x + Math.cos(dir) * 11, z1: top.z + Math.sin(dir) * 11 }
      addHolua(ground.K, holua)
    }
    // salt pans on the dry shore beside the bay
    for (let k = 0; k < 2; k++) {
      const sp = bestNear(F, alii.x + (rand() - 0.5) * 16, alii.z + (rand() - 0.5) * 16, 6, (c, x, z) => {
        const h = F.h[c]
        if (h < 0.5 || h > 3 || at(F, F.rain, x, z) > 900) return -Infinity
        return -F.slope[c] * 50 - F.toSea[c] * F.cs * 0.8
      })
      if (sp) saltpans.push({ x: sp.x, z: sp.z, dir: seaward(F, sp.c) })
    }
  }

  // Dryland field system (kula): the leeward slopes between the coast and the
  // forest, where 750–2000 mm of rain grew ʻuala but not loʻi.
  const fieldMask = new Uint8Array(N * N)
  for (let c = 0; c < N * N; c++) {
    const h = F.h[c]
    if (h < 60 || h > 760) continue
    const m = D.mokuOf[F.label[c]] - 1
    if (m !== 2 && m !== 3) continue
    const r = F.rain[c]
    const k = smoothstep(650, 950, r) * (1 - smoothstep(1800, 2400, r)) * (1 - smoothstep(0.2, 0.36, F.slope[c])) * smoothstep(0.6, 2.0, F.toStream[c] * F.cs)
    fieldMask[c] = Math.round(255 * k)
  }

  return { ground, model: model ? model.id : 1, ahupuaa: ahupuaa.map(({ trunk, ...a }) => ({ ...a, trunk: trunk.filter((_, i) => i % 3 === 0).map((p) => [p.x, p.z, p.h]) })), villages, loi, heiau, ponds, canoes, koa, houses, surf, alii, puuhonua, holua, saltpans, fieldMask }
}

/**
 * A heiau's site near the village: the most commanding ground (standing well
 * above what's around it, and close by) where its platform fits as the ground
 * will be drawn: off the water and the paddies, its relief within what a
 * terraced platform takes up, and back from any brink. Null if there's no
 * ground for one at all; `fits` false if there is but none of it serves (the
 * best of it, then).
 */
function heiauSite(F, ground, id, v, isModel, onLoi) {
  const N = F.N
  const cs = F.cs
  const ci = Math.round((v.x + 180) / cs - 0.5)
  const cj = Math.round((v.z + 180) / cs - 0.5)
  const R = Math.ceil((isModel ? 14 : 10) / cs)
  const cands = []
  for (let dj = -R; dj <= R; dj++) {
    for (let di = -R; di <= R; di++) {
      if (di * di + dj * dj > R * R) continue
      const i = ci + di
      const j = cj + dj
      if (i < 1 || j < 1 || i >= N - 1 || j >= N - 1) continue
      const c = j * N + i
      const x = toWorld(N, i)
      const z = toWorld(N, j)
      const h = F.h[c]
      if (h < 6 || h > 160 || F.label[c] !== id || F.slope[c] > 0.16 || onLoi(x, z)) continue
      cands.push({ x, z, s: prominence(F, c, 9) * 0.08 - F.slope[c] * 20 - Math.hypot(x - v.x, z - v.z) * 0.12 })
    }
  }
  if (!cands.length) return null
  cands.sort((a, b) => b.s - a.s)
  const big = isModel
  const [hx, hz] = heiauHalf(big)
  const rise = (big ? HEIAU.big : HEIAU.small).rise
  // (of the first few that fit, the one that asks least of its builders: a
  // heiau on a shoulder of level ground over one terraced up a knoll, and
  // one with a tall sheer wall left on a side without terraces least of all)
  const g = ground.g
  let best = null
  let fits = 0
  for (let k = 0; k < Math.min(cands.length, 400) && fits < 6; k++) {
    const { x, z, s } = cands[k]
    // facing the village, or near it; or turned square to the slope, its long
    // sides along the contours, where it has least to make up and the one
    // side that faces down the slope takes the terraces
    const face = Math.atan2(v.x - x, v.z - z)
    let square = Math.atan2(g(x + 0.25, z) - g(x - 0.25, z), g(x, z - 0.25) - g(x, z + 0.25))
    if (Math.cos(square - face) < 0) square += Math.PI
    let here = null
    for (const rot of [face, face + 0.3, face - 0.3, square, face + Math.PI / 2]) {
      const f = ground.fit(big ? 'luakini' : 'heiau', x, z, rot, hx, hz, { rise })
      if (!f) continue
      const score = s - f.relief * 0.35 - f.wall * 0.2
      if (!here || score > here.score) here = { f, score }
    }
    if (!here) continue
    fits++
    if (!best || here.score > best.score) best = here
  }
  if (best) {
    const { f } = best
    ground.take(f)
    return { x: f.x, z: f.z, rot: f.rot, fits: true }
  }
  const { x, z } = cands[0]
  return { x, z, rot: Math.atan2(v.x - x, v.z - z), fits: false }
}

/** Direction (radians, atan2 z/x) from a land cell toward the nearest sea. */
function seaward(F, c) {
  const N = F.N
  const i = c % N
  const j = (c / N) | 0
  const d = F.toSea
  const gx = (d[j * N + Math.min(N - 1, i + 1)] - d[j * N + Math.max(0, i - 1)]) / 2
  const gz = (d[Math.min(N - 1, j + 1) * N + i] - d[Math.max(0, j - 1) * N + i]) / 2
  return Math.atan2(-gz, -gx)
}

/**
 * A loko kuapā: a curved wall of stacked stone from the shore out across the
 * reef flat and back, a little to one side of the stream mouth, with mākāhā
 * (sluice gates) in it. Returns the wall polyline and the enclosed pond's
 * centre/radius for the water mask.
 */
function fishpond(F, T, mx, mz, id, radius, rand, side = rand() < 0.5 ? -1 : 1, maxDepth = 3.2) {
  const N = F.N
  // walk along the shore a little to one side of the mouth
  const c0 = cellIndex(N, mx, mz)
  if (c0 < 0) return null
  const sea = seaward(F, c0)
  const ax = Math.cos(sea)
  const az = Math.sin(sea)
  // along-shore direction
  const lx = -az * side
  const lz = ax * side
  const cx = mx + lx * (radius + 0.8)
  const cz = mz + lz * (radius + 0.8)
  // pond centre sits on the shoreline; the wall bows out over the reef flat
  const wall = []
  const n = 28
  for (let k = 0; k <= n; k++) {
    const t = k / n
    const ang = -Math.PI / 2 + Math.PI * t
    const r = radius * (1 + 0.08 * Math.sin(t * 9.0 + rand()))
    const along = Math.sin(ang) * r
    const out = Math.cos(ang) * r * 0.85
    wall.push([cx + lx * along + ax * out, cz + lz * along + az * out])
  }
  // the ends must land on dry ground and the middle must stay in shallow water
  const deepest = wall.reduce((m, p) => Math.min(m, sample(F.h, N, p[0], p[1])), 0)
  if (deepest < -maxDepth) return null
  // and the pond must actually enclose water, not dry land
  const wet = sample(F.h, N, cx + ax * radius * 0.4, cz + az * radius * 0.4)
  if (wet > 0) return null
  const gates = [0.3 + rand() * 0.1, 0.62 + rand() * 0.1]
  return { wall, gates, cx, cz, r: radius, ax, az }
}

/** Reef crest offshore of (x, z) facing the open swell. */
function surfBreak(F, T, x, z) {
  const N = F.N
  const c0 = cellIndex(N, x, z)
  if (c0 < 0) return null
  const dir = seaward(F, c0)
  const W = T.coast.reefWidth[c0] / 100
  for (let d = 2; d < W + 8; d += 0.3) {
    const px = x + Math.cos(dir) * d
    const pz = z + Math.sin(dir) * d
    const h0 = sample(F.h, N, px, pz)
    const h1 = sample(F.h, N, px + Math.cos(dir) * 0.8, pz + Math.sin(dir) * 0.8)
    if (h0 < 0 && h0 > -1.2 && h1 < h0 - 1.5) return { x: px, z: pz, dir }
  }
  return null
}
