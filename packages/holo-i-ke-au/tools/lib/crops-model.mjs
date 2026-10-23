// The rules behind the crop classes (DATA.md, "Crops, on the era layers"):
// for each keyframe, what grows on each land texel of a pack. Every number
// here is read from a source named in crops-history.mjs or is a modelling
// choice, and the rule text the manifest prints is built from the same
// constants.
//
// A texel's class follows the keyframe's own cultivation mask (as baked by
// tools/bake-layers.mjs, read back from its PNG) wherever that is above 0,
// and takes the kind of field from the term that made the mask there (the
// cultivationTerms of layers-model.mjs): loʻi where the loʻi rule is the
// largest, dryland where the field zones are, cane and pineapple where the
// 1900 lands are. On that the history is laid: the plantations of 1853,
// rice, coffee and the ranches of 1896, and for now the 2020 baseline and
// the lawns.
import { CULTIVATION_TERMS, cultivationTerms } from './layers-model.mjs'
import { coverage, featureIndex } from './layers-raster.mjs'
import { KX, KZ } from './geo.mjs'
import { C, COFFEE_1896, PLANTATIONS_1853, PLANTATION_ACRES_1853, RANCHES_1853, RANCHES_1896, RICE_1896 } from './crops-history.mjs'

export const ACRE_KM2 = 0.0040468564224

/** Modelling constants, gathered so the manifest can print them. */
export const CROP_RULES = {
  // a texel whose cultivation comes from the kuleana parcels is loʻi where the loʻi rule gives it at least this much
  kuleanaLoi: 0.25,
  // the lower, drier part of a ranch's bounds, where only the bounds are known
  grass: { maxElevation: 2000, rainMm: [400, 2000], maxForest: 0.5, maxCultivation: 0.25 },
  // pasture read back from 1978–80 grazing land: a texel at least half grazing then, under a quarter cultivated and under half forest in 1896
  alumShare: 0.5,
  // plantations of 1853: cane land within reach of the mill, flat and low
  plantation: { maxElevation: 300, maxSlope: 0.15, cane1900Weight: 0.5 },
  // rice: the lowest flats, at the outlets of valleys and close on the sea; where a district's figure caps it, the old loʻi first
  rice: { maxElevation: 15, maxSlope: 0.06, loi: 0.25, wetGround: 0.5 },
  // now: a texel takes the 2020 group covering most of it when the groups cover at least this share, or it is cultivated
  nowMinShare: 0.25,
  // lawn: CAH developed open space over at least half the texel, in a park or open-space zone or near a golf course
  lawnOpenShare: 0.5,
  golfRadius: 600, // metres for 18 holes, scaled by the square root of the holes
}

/** The 2020 baseline's categories (crops_2020), each to its class; 0 is no class. The bake stops on any other. */
export const NOW_CLASSES = {
  Taro: C.loi,
  Pineapple: C.pineapple,
  Pasture: C.pasture,
  Dairy: C.pasture,
  Coffee: C.orchard,
  'Macadamia Nuts': C.orchard,
  'Tropical Fruits': C.orchard,
  Papaya: C.orchard,
  Banana: C.orchard,
  'Diversified Crop': C.orchard,
  'Flowers / Foliage / Landscape': C.orchard,
  'Seed Production': C.orchard,
  // the 14 acres the 2020 layer still calls Sugar are small fields after the last plantation closed in 2016; class 4 ends with the plantations
  Sugar: C.orchard,
  'Commercial Forestry': C.none,
  Aquaculture: C.none,
}
/** The 2020 groups in the order ties go. */
const NOW_GROUPS = [C.loi, C.pineapple, C.orchard, C.pasture]

/** 1978–80 commodity codes read back to 1896. */
export const ALUM_READ = { grazing: ['A-1'], coffee: ['O-5'] }

// ---------------------------------------------------------------------------
// helpers

const metresBetween = (lon0, lat0, lon1, lat1) => Math.hypot((lon1 - lon0) * KX, (lat1 - lat0) * KZ)

/** Distance in metres from (lon, lat) to a polyline of [lon, lat]. */
function toPolyline(lon, lat, line) {
  let best = Infinity
  for (let i = 0; i + 1 < line.length; i++) {
    const [ax, az] = [line[i][0] * KX, line[i][1] * KZ]
    const [bx, bz] = [line[i + 1][0] * KX, line[i + 1][1] * KZ]
    const [px, pz] = [lon * KX, lat * KZ]
    const dx = bx - ax
    const dz = bz - az
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz)))
    best = Math.min(best, Math.hypot(px - ax - t * dx, pz - az - t * dz))
  }
  return best
}

/** Per texel: does it lie in these bounds (ahupuaʻa gisIds, moku keys, or the whole island) on this island? */
function boundsMask(I, ahuGis, island, { ahupuaa, moku, wholeIsland }) {
  const ids = new Set((ahupuaa || []).map(([id]) => id))
  const mk = new Set(moku || [])
  const out = new Uint8Array(I.N)
  for (let o = 0; o < I.N; o++) {
    if (!I.land[o] || I.island[o] !== island) continue
    if (wholeIsland || (ids.size && ids.has(ahuGis[o])) || (mk.size && mk.has(I.mokuKey[o]))) out[o] = 1
  }
  return out
}

/** Take candidates in order of score until `km2` is reached; returns the texels taken. */
function takeNearest(cands, score, texelKm2, km2) {
  const order = cands.slice().sort((a, b) => score[a] - score[b] || a - b)
  const n = Math.min(order.length, Math.round(km2 / texelKm2))
  return order.slice(0, n)
}

// ---------------------------------------------------------------------------
// the pack's inputs beyond the field rules

/**
 * Everything the class rules read on one pack besides fieldInputs:
 * cultivation and forest bytes per keyframe (from the baked masks), the
 * zoning raster, the ahupuaʻa under each texel, the 2020 groups, the 1978–80
 * grazing and coffee, the golf courses and the CAH open space.
 */
export function cropInputs(I, src, masks, cahOpen) {
  const { grid, N } = I
  const s = I.s
  // ahupuaʻa under each texel centre (gisId), for the bounds that name ahupuaʻa
  const idx = featureIndex(src.ahupuaa.features, grid)
  const ahuGis = new Int32Array(N).fill(-1)
  for (let o = 0; o < N; o++) if (idx[o] >= 0) ahuGis[o] = src.ahupuaa.features[idx[o]].properties.gisId
  // 2020 groups
  const unknown = [...new Set(src.ag2020.features.map((f) => f.properties.crops_2020))].filter((c) => !(c in NOW_CLASSES))
  if (unknown.length) throw new Error(`2020 categories with no class in lib/crops-model.mjs: ${unknown.join(', ')}`)
  const nowGroup = {}
  for (const g of NOW_GROUPS) nowGroup[g] = coverage(src.ag2020.features, grid, s, (f) => NOW_CLASSES[f.properties.crops_2020] === g)
  // 1978–80
  const code = (f) => String(f.properties.commodity || '').trim()
  const alumGrazing = coverage(src.alum.features, grid, s, (f) => ALUM_READ.grazing.includes(code(f)))
  const alumCoffee = coverage(src.alum.features, grid, s, (f) => ALUM_READ.coffee.includes(code(f)))
  // golf: within a radius of each course, by its holes
  const golf = new Uint8Array(N)
  const golfHere = []
  for (const f of src.golf.features) {
    if (f.geometry?.type !== 'Point') continue
    const [lon, lat] = f.geometry.coordinates
    if (lon < grid.bounds[0] || lon > grid.bounds[2] || lat < grid.bounds[1] || lat > grid.bounds[3]) continue
    const holes = Number(f.properties.numholes) || 18
    const r = CROP_RULES.golfRadius * Math.sqrt(holes / 18)
    golfHere.push({ name: f.properties.name, holes, r })
    const i0 = Math.floor((lon - grid.bounds[0]) / grid.dLon)
    const j0 = Math.floor((grid.bounds[3] - lat) / grid.dLat)
    const di = Math.ceil(r / grid.metresPerTexel[0]) + 1
    const dj = Math.ceil(r / grid.metresPerTexel[1]) + 1
    for (let j = Math.max(0, j0 - dj); j <= Math.min(grid.H - 1, j0 + dj); j++) {
      for (let i = Math.max(0, i0 - di); i <= Math.min(grid.W - 1, i0 + di); i++) {
        if (metresBetween(lon, lat, grid.lonAt(i), grid.latAt(j)) <= r) golf[j * grid.W + i] = 1
      }
    }
  }
  return { ahuGis, nowGroup, alumGrazing, alumCoffee, golf, golfHere, cahOpen, ...masks }
}

// ---------------------------------------------------------------------------
// the classes

/** The field classes from the cultivation terms where the keyframe's mask is above 0. */
function fieldClasses(I, X, key) {
  const names = CULTIVATION_TERMS[key]
  const t = new Float64Array(names.length)
  const cls = new Uint8Array(I.N)
  const cult = X.cult[key]
  for (let o = 0; o < I.N; o++) {
    if (!I.land[o] || !cult[o]) continue
    cultivationTerms(I, key, o, t)
    let k = 0
    for (let n = 1; n < t.length; n++) if (t[n] > t[k]) k = n
    const term = names[k]
    if (term === 'loi') cls[o] = C.loi
    else if (term === 'dryland' || term === 'agroforestry') cls[o] = C.dryland
    else if (term === 'kuleana') cls[o] = I.loi[o] >= CROP_RULES.kuleanaLoi ? C.loi : C.dryland
    else if (term === 'cane') cls[o] = C.cane
    else if (term === 'pineapple') cls[o] = C.pineapple
    else cls[o] = C.none // the pond shore: a fishpond's shore, of no crop
  }
  return cls
}

/** The lower, drier part of a ranch's bounds: below the forest and the wet uplands, above the bare leeward coast, outside the fields. */
function grassland(I, o, forestByte, cultByte) {
  const g = CROP_RULES.grass
  return islandRange(I, o, forestByte, cultByte) && I.rain[o] >= g.rainMm[0] && I.rain[o] < g.rainMm[1]
}

/** A whole-island sheep range: everything below the tree line that is neither forest nor field. */
function islandRange(I, o, forestByte, cultByte) {
  const g = CROP_RULES.grass
  return I.metres[o] < g.maxElevation && forestByte < g.maxForest * 255 && cultByte < g.maxCultivation * 255
}

/**
 * The classes of one pack at one keyframe. Returns { classes, report },
 * where the report holds what the history drew here (acres per plantation,
 * district, ranch bounds and coffee land).
 */
export function cropClasses(I, X, key) {
  const { N, land, texelKm2 } = I
  const report = {}
  let cls
  if (key === 'contact') {
    cls = fieldClasses(I, X, 'contact')
  } else if (key === 'mahele') {
    cls = fieldClasses(I, X, 'mahele')
    // cane at the plantations of 1853
    report.plantations = {}
    const PR = CROP_RULES.plantation
    for (const p of PLANTATIONS_1853) {
      const cands = []
      const score = new Float64Array(N)
      for (let o = 0; o < N; o++) {
        if (!land[o] || I.island[o] !== p.island || cls[o] === C.loi) continue
        if (I.metres[o] > PR.maxElevation || I.slope[o] > PR.maxSlope) continue
        score[o] = metresBetween(p.lon, p.lat, I.grid.lonAt(o % I.W), I.grid.latAt(Math.floor(o / I.W))) * (I.sugar1900[o] >= 0.5 ? PR.cane1900Weight : 1)
        cands.push(o)
      }
      if (!cands.length) continue
      const took = takeNearest(cands, score, texelKm2, PLANTATION_ACRES_1853 * ACRE_KM2)
      for (const o of took) cls[o] = C.cane
      report.plantations[p.id] = { acres: Math.round((took.length * texelKm2) / ACRE_KM2) }
    }
    // pasture at the ranches of 1853: the lower, drier part of their bounds
    report.ranches = {}
    for (const r of RANCHES_1853) {
      const inB = boundsMask(I, X.ahuGis, r.island, r)
      let n = 0
      for (let o = 0; o < N; o++) {
        if (!inB[o] || cls[o] === C.cane) continue
        if (!grassland(I, o, X.forest.mahele[o], X.cult.mahele[o])) continue
        cls[o] = C.pasture
        n++
      }
      if (inB.some((v) => v)) report.ranches[r.id] = { km2: round(n * texelKm2, 2) }
    }
  } else if (key === 'kingdom') {
    cls = fieldClasses(I, X, 'kingdom')
    // rice in the districts the record names
    report.rice = {}
    const RR = CROP_RULES.rice
    for (const d of RICE_1896) {
      const inB = boundsMask(I, X.ahuGis, d.island, d)
      const cands = []
      const score = new Float64Array(N)
      for (let o = 0; o < N; o++) {
        if (!inB[o] || !X.cult.kingdom[o]) continue
        const ok = cls[o] === C.loi || cls[o] === C.dryland || cls[o] === C.none || (d.acres1892 && cls[o] === C.cane)
        if (!ok || I.metres[o] > RR.maxElevation || I.slope[o] > RR.maxSlope) continue
        if (!(I.loi[o] >= RR.loi || I.wetGround[o] >= RR.wetGround)) continue
        // the old loʻi first (where the loʻi rule is strongest), then the lowest
        score[o] = -I.loi[o] + I.metres[o] / 1000
        cands.push(o)
      }
      if (!inB.some((v) => v)) continue
      const took = d.acres1892 ? takeNearest(cands, score, texelKm2, d.acres1892 * ACRE_KM2) : cands
      for (const o of took) cls[o] = C.rice
      report.rice[d.id] = {
        acres: Math.round((took.length * texelKm2) / ACRE_KM2),
        candidateAcres: Math.round((cands.length * texelKm2) / ACRE_KM2),
      }
    }
    // coffee: Kona read back from 1978–80, Olaʻa along the Volcano Road
    const kept = (c) => c === C.loi || c === C.rice || c === C.cane || c === C.pineapple
    if (I.island.some((x) => x === 'hawaii')) {
      let kona = 0
      for (let o = 0; o < N; o++) {
        if (!land[o] || I.island[o] !== 'hawaii' || I.mokuKey[o] !== COFFEE_1896.kona.moku || kept(cls[o])) continue
        if (X.alumCoffee[o] < CROP_RULES.alumShare) continue
        cls[o] = C.orchard
        kona++
      }
      const O = COFFEE_1896.olaa
      const inB = boundsMask(I, X.ahuGis, 'hawaii', O)
      const cands = []
      const score = new Float64Array(N)
      for (let o = 0; o < N; o++) {
        if (!inB[o] || kept(cls[o]) || I.metres[o] < O.elevation[0] || I.metres[o] > O.elevation[1]) continue
        score[o] = toPolyline(I.grid.lonAt(o % I.W), I.grid.latAt(Math.floor(o / I.W)), O.road)
        cands.push(o)
      }
      const took = takeNearest(cands, score, texelKm2, O.acres * ACRE_KM2)
      for (const o of took) cls[o] = C.orchard
      if (kona || took.length) report.coffee = { konaAcres: Math.round((kona * texelKm2) / ACRE_KM2), olaaAcres: Math.round((took.length * texelKm2) / ACRE_KM2) }
    }
    // pasture at the ranches of the 1890s
    report.ranches = {}
    const groups = new Map()
    for (const r of RANCHES_1896) {
      const k = `${r.island}|${r.wholeIsland ? 'island' : ''}|${(r.moku || []).join(',')}|${(r.ahupuaa || []).map(([id]) => id).join(',')}|${r.grazed || 'alum'}`
      if (!groups.has(k)) groups.set(k, { r, names: [] })
      groups.get(k).names.push(r.name)
    }
    for (const { r, names } of groups.values()) {
      const inB = boundsMask(I, X.ahuGis, r.island, r)
      if (!inB.some((v) => v)) continue
      let n = 0
      for (let o = 0; o < N; o++) {
        if (!inB[o] || !(cls[o] === C.none || cls[o] === C.loi || cls[o] === C.dryland)) continue
        if (X.cult.kingdom[o] >= CROP_RULES.grass.maxCultivation * 255 || X.forest.kingdom[o] >= CROP_RULES.grass.maxForest * 255) continue
        const ok = r.grazed === 'island' ? islandRange(I, o, X.forest.kingdom[o], X.cult.kingdom[o]) : X.alumGrazing[o] >= CROP_RULES.alumShare
        if (!ok) continue
        cls[o] = C.pasture
        n++
      }
      report.ranches[names.join(', ')] = { island: r.island, bounds: r.wholeIsland ? 'the whole island' : r.ahupuaa ? r.ahupuaa.map(([, name]) => name) : r.moku, grazed: r.grazed || 'alum', km2: round(n * texelKm2, 2) }
    }
  } else if (key === 'now') {
    cls = new Uint8Array(N)
    const lawn = { zoning: 0, golf: 0 }
    for (let o = 0; o < N; o++) {
      if (!land[o]) continue
      let best = 0
      let bestV = 0
      let sum = 0
      for (const g of NOW_GROUPS) {
        const v = X.nowGroup[g][o]
        sum += v
        if (v > bestV) {
          bestV = v
          best = g
        }
      }
      if (best && (sum >= CROP_RULES.nowMinShare || X.cult.now[o])) {
        cls[o] = best
        continue
      }
      if (X.cahOpen[o] < CROP_RULES.lawnOpenShare) continue
      if (X.zoning && X.zoning[o] === 12) {
        cls[o] = C.lawn
        lawn.zoning++
      } else if (X.golf[o]) {
        cls[o] = C.lawn
        lawn.golf++
      }
    }
    report.lawn = { zoningKm2: round(lawn.zoning * texelKm2, 2), golfKm2: round(lawn.golf * texelKm2, 2), golfCourses: X.golfHere.length }
  }
  for (let o = 0; o < N; o++) if (!land[o]) cls[o] = 0
  return { classes: cls, report }
}

const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

/** Texels and km² per class over the pack's land. */
export function classStats(classes, land, texelKm2, n) {
  const count = new Array(n + 1).fill(0)
  let L = 0
  for (let o = 0; o < land.length; o++) {
    if (!land[o]) continue
    L++
    count[classes[o]]++
  }
  const texels = {}
  const km2 = {}
  for (let c = 1; c <= n; c++) {
    if (!count[c]) continue
    texels[c] = count[c]
    km2[c] = round(count[c] * texelKm2, 2)
  }
  return { landTexels: L, classedTexels: L - count[0], texels, km2 }
}

