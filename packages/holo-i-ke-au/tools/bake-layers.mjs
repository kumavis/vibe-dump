#!/usr/bin/env node
// The era layers for Holo i ke Au (DESIGN.md §2, §5.5; DATA.md "Era layers"):
// cultivation, settlement and forest masks per island for a few keyframes,
// on exactly the island packs' grids, for the app to blend over the
// terrain at far and mid zoom.
//
//   node packages/holo-i-ke-au/tools/bake-layers.mjs --all           download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-layers.mjs --download      fetch every source (~490 MB, about a minute)
//   node packages/holo-i-ke-au/tools/bake-layers.mjs --bake          write public/data/layers/ from the downloads
//   node packages/holo-i-ke-au/tools/bake-layers.mjs --check         read public/data/layers/ back and check it
//   node packages/holo-i-ke-au/tools/bake-layers.mjs --preview DIR   tint the layers over shaded relief, per island
//   node packages/holo-i-ke-au/tools/bake-layers.mjs --clean         delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_LAYERS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/layers-downloads). Keep it outside the repo.
//
// It reads the island packs that tools/bake.mjs wrote (manifest.json, each
// height.png and rain.png, boundaries/), so run that bake first. It writes
// only public/data/layers/. Like `npm run thumbnails`, a by-hand step whose
// output is committed; nothing here runs at app runtime.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { ISLANDS } from './lib/geo.mjs'
import { readPNG, writeGreyPNG, writePNG } from './lib/png.mjs'
import { readPack } from './lib/layers-raster.mjs'
import {
  CAH_FOREST,
  DISTRICTS_1896,
  ISLAND_POP,
  KAHOOLAWE_BACKCAST,
  KEYFRAMES,
  NOT_CROPS,
  POP_SOURCES,
  RULES,
  TOWNS_1896,
  caneWeight,
  contactWeight,
  cultivation,
  eruptionYear,
  forest,
  packInputs,
  townWeight,
} from './lib/layers-model.mjs'
import { CAH, VECTORS, cahSource, downloadAll, layerPaths, readCahClasses, readVector, vectorSource } from './lib/layers-sources.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')
const OUT = join(DATA, 'layers')
const MAX_BYTES = 8 * 1024 * 1024

// Settlement encoding: value = 255 · ln(1 + d/D0) / ln(1 + DMAX/D0), d in people per km².
const D0 = 2
const DMAX = 50000
const LN = Math.log(1 + DMAX / D0)
const encodeDensity = (d) => Math.max(0, Math.min(255, Math.round((255 * Math.log(1 + Math.max(0, d) / D0)) / LN)))
const decodeDensity = (v) => D0 * (Math.exp((v / 255) * LN) - 1)

// Niʻihau has no Rainfall Atlas grid; its land is taken as this dry.
const RAIN_FALLBACK_MM = 500

const log = (...m) => console.log(...m)
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, preview: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--preview') {
      a.flags.add('preview')
      a.preview = argv[++i]
      if (!a.preview) throw new Error('--preview needs a directory')
    } else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_LAYERS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'layers-downloads'))
  return a
}

// ---------------------------------------------------------------------------
// How each keyframe's layers are made, written out for the manifest

function methods(ledger, dir, kahoolawe1778) {
  const v = (key, extra) => vectorSource(ledger, dir, key, extra)
  const cah = (extra) => cahSource(ledger, dir, extra)
  const pop = (id, extra = {}) => ({ ...POP_SOURCES[id], ...extra })
  const boundaries = {
    id: 'holo-boundaries',
    title: 'boundaries/moku.geojson and boundaries/ahupuaa.geojson (State GIS layers, as baked by tools/bake.mjs)',
    url: 'boundaries/',
    note: 'island and moku of every land texel, for scaling the counts',
  }
  const kuleanaRule =
    `Land Commission Award parcels under ${RULES.kuleanaMaxHa} ha (kuleana size), as the share of each texel they cover, ` +
    `blurred with a ${RULES.kuleanaSigma} m Gaussian and multiplied by ${RULES.kuleanaGain} (capped at 1)`
  const pondRule =
    `fishpond shore: land within ${RULES.pondShoreMetres} m of the sea and below ${RULES.pondMaxElevation} m where the sea ` +
    `within about 350 m is mostly no deeper than ${-RULES.pondShallowDepth} m (a reef flat or sheltered shallows; share ` +
    `${RULES.pondShallowShare[0]}–${RULES.pondShallowShare[1]} ramps 0–1), counted at ${RULES.fishpondShore}: where a loko ` +
    'kuapā could be walled off, not a map of ponds (no statewide inventory exists)'
  const V = RULES.valley
  const tradAgRule =
    `the Traditional Agriculture zones: loʻi counted at ${RULES.loi}, dryland at ${RULES.dryland}, agroforestry at ` +
    `${RULES.agroforestry} of the texel`
  const valleyRule =
    'valley-floor and coastal-plain loʻi read from the pack, counted at 1, because the published zones run on modern soils ' +
    'and stop where those are mapped as urban land or fill (Waikīkī and Honolulu fall outside them): ground on alluvium, ' +
    `lagoon deposits or fill (the geologic map's units, blurred ${V.substrateBlur} m, times ${V.substrateGain}), below ` +
    `${V.elevation[0]}–${V.elevation[1]} m, flatter than ${V.slope[0]}–${V.slope[1]}, no more than ${V.aboveStream[0]}–` +
    `${V.aboveStream[1]} m above the stream it drains to, where that stream gathers ${V.flow[0] / 1e6}–${V.flow[1] / 1e6} ` +
    `million m³ of rain a year from a catchment averaging ${V.catchmentRain[0]}–${V.catchmentRain[1]} mm (each range a ` +
    'smooth ramp; the flow is routed over the pack heights after filling pits)'
  return {
    contact: {
      cultivation: {
        method: 'modelled',
        rule:
          `The largest of: ${tradAgRule}; ${valleyRule}; ${kuleanaRule} (the parcels claimed in 1848–1855 were lands ` +
          'long in use; how well each model finds them is in baked.calibration); ' +
          `${pondRule}. Niʻihau and Kahoʻolawe lie outside the agriculture model, so only the pond shore and the few ` +
          'awards there mark them.',
        sources: [v('tradAg'), v('geology'), v('lca')],
      },
      settlement: {
        method: 'modelled',
        rule:
          'A weight per texel, 0.5 × cultivation blurred at 400 m (people lived among their fields) + 0.35 × a coastal band ' +
          'exp(−distance to sea / 600 m), fading out between 60 and 150 m elevation, times 0.4–1.0 by rain (500–1500 mm) + ' +
          `0.15 × the kuleana parcels + ${RULES.settleFloor} × the rain factor everywhere (people lived thinly on all habitable ` +
          'land); times habitability (none on slopes steeper than about 35°, fading out between 800 and ' +
          '1,600 m) and 0.3 on lava younger than 50–200 years. Each island’s weights are scaled so that the island holds ' +
          'King’s figure. Kahoʻolawe, which King leaves out, is back-cast from the 80 people the 1832 census counted there ' +
          `by the ratio of King’s 400,000 to the 1832 total of 130,313: ${kahoolawe1778} people.`,
        populations: { ...ISLAND_POP.contact, kahoolawe: kahoolawe1778 },
        sources: [pop('king-1784-v3'), pop('thrum-1890-annual', { note: 'the 1832 census by island (Kahoʻolawe 80, all islands 130,313), read on the page image' }), boundaries],
      },
      forest: {
        method: 'modelled',
        rule:
          'Closed native forest where the rain allows it (0 at 700 mm a year rising to full at 1,500 mm: the bake’s ramp, set so ' +
          'that Cuddihy and Stone’s line between dry and mesic forest, 1,250 mm as packages/ahupuaa/FOREST.md uses it, falls ' +
          'near its top, since dry forest was mostly open), below the tree line (full to 1,900 m, ' +
          'none by 2,700 m), back from the shore (30–250 m), and on lava old enough to have grown forest (wet ground in 60–300 ' +
          'years, dry ground in 400–2,000). Then cleared as FOREST.md §1 has it from Kirch: below 460 m mostly farmed or burned ' +
          `(${RULES.lowlandKeep} kept, rising to ${RULES.lowlandRemoteKeep} where the nearest field is 1.5–6 km away), essentially ` +
          'untouched above 760 m, a ramp between; and never on cultivated ground. Wherever native forest still stands today ' +
          '(CAH) on ground no lava has covered since 1778, it stood then too, so the layer is never less than that. Niʻihau has ' +
          'no rain grid and is taken as dry.',
        sources: [cah({ note: `${CAH.note}; used here as a floor: native forest standing now stood in 1778` }), v('geology'), v('tradAg'), v('lca')],
      },
    },
    mahele: {
      cultivation: {
        method: 'mixed',
        rule:
          `Mapped: ${kuleanaRule}. Modelled: the contact loʻi kept at ${RULES.loiKept1853[0]}–${RULES.loiKept1853[1]} (more ` +
          `where kuleana were claimed within about a kilometre), dryland zones at ${RULES.dryland1853}, agroforestry at ` +
          `${RULES.agroforestry1853}, the fishpond shore at ${RULES.ponds1853} of its contact weight (between the 488 ponds ` +
          'thought to have stood before contact and the 360 of the 1901 inventory, both as the 2025 fishpond bill HB309 gives ' +
          'them). The largest of these.',
        sources: [v('lca'), v('tradAg'), v('geology')],
      },
      settlement: {
        method: 'mixed',
        rule:
          'Mapped: the 1853 census by island. Modelled: within each island, 0.6 of the people spread in proportion to the ' +
          'kuleana parcels (where the 1848–1855 claimants lived and farmed) and 0.4 by the contact weights (where the awards ' +
          'are thinly digitised, as on Hawaiʻi Island, this carries the pattern). Kahoʻolawe has no 1853 entry and is left empty.',
        populations: ISLAND_POP.mahele,
        sources: [pop('thrum-1890-annual'), v('lca'), boundaries],
      },
    },
    kingdom: {
      cultivation: {
        method: 'mixed',
        rule:
          'Mapped: the 1900 sugar cane and pineapple lands, as the share of the texel. Modelled: the contact loʻi kept at ' +
          `${RULES.loiKept1896[0]}–${RULES.loiKept1896[1]} (more where kuleana were claimed nearby; this counts loʻi turned to ` +
          `rice as cultivated), the dryland zones at ${RULES.dryland1896} (the leeward field systems were long abandoned), ` +
          `agroforestry at ${RULES.agroforestry1896}, the fishpond shore at ${round(RULES.ponds1896, 2)} of its contact weight ` +
          '(360 of 488 ponds, HB309, 2025). The largest of these. Pasture is not cultivation and is left out; Kona coffee, ' +
          'which the 1896 census credits with Kona’s growth, has no map and is left out.',
        sources: [v('sugar1900'), v('pine1900'), v('tradAg'), v('geology'), v('lca')],
      },
      settlement: {
        method: 'mixed',
        rule:
          'Mapped: the 1896 census by district, joined to moku (exactly on Oʻahu and Hawaiʻi Island, approximately on Maui and ' +
          'Kauaʻi). Modelled: within each district, the towns take a share into a soft disc (Honolulu 0.6 of its district, ' +
          'Hilo 0.3, Lahaina 0.4, Wailuku 0.2 and Kahului 0.1, Līhuʻe 0.15, Waimea 0.15, Kailua 0.1: the bake’s assumption) ' +
          'and Kalaupapa 1,100 people (NPS: "over 1,100" at Kalawao in 1888–1902); the rest spreads 0.4 by nearness to the ' +
          '1900 cane (plantation camps and mills, within about a kilometre), 0.35 by the kuleana parcels and 0.25 by the ' +
          'contact weights, renormalised where a district has no cane.',
        districts: DISTRICTS_1896,
        towns: TOWNS_1896,
        sources: [pop('census-1896'), pop('nps-kalaupapa'), v('sugar1900'), v('lca'), boundaries],
      },
      forest: {
        method: 'mixed',
        rule:
          'Between two bounds. Upper: the contact forest less the 1900 cane and pineapple lands and less lava erupted from 1778 ' +
          'to 1896. Lower: the native forest standing now (CAH), which cannot have been absent in 1896. Inside the forest ' +
          `reserves (proclaimed from 1904 on around the forest still standing) the layer takes ${RULES.reserveKeep} of the way ` +
          `from lower to upper; outside them ${RULES.outsideKeep}, for the cattle, fire and clearing of the century. The ` +
          'reserve boundaries are today’s, fitted to modern tax maps.',
        sources: [v('sugar1900'), v('pine1900'), v('reserves'), v('geology'), cah()],
      },
    },
    now: {
      cultivation: {
        method: 'mapped',
        rule: `The 2020 agricultural land use baseline, as the share of the texel in crops: every category except ${NOT_CROPS.join(', ')}. Taro and aquaculture count.`,
        sources: [v('ag2020')],
      },
      settlement: {
        method: 'mapped',
        rule:
          'The 2020 census count of each block group, spread over its developed land by the CAH classes (high intensity 1, ' +
          'medium 0.6, low 0.3, open space 0.05; a block group with no developed land spreads evenly).',
        sources: [v('blockGroups'), cah()],
      },
      forest: {
        method: 'mapped',
        rule:
          'Native forest in the CAH land cover, as canopy share: closed native forest 1, low-stature wet ʻōhiʻa 0.8, open ' +
          'native forest 0.6, mixed native–alien forest 0.5, native woodland and mesic–dry forest–shrubland 0.4. Alien forest ' +
          'and plantations count 0.',
        classes: CAH_FOREST,
        sources: [cah()],
      },
    },
  }
}

/** Which keyframes serve each era of eras.json, per layer. */
function eraMap() {
  const eras = JSON.parse(readFileSync(join(DATA, 'eras.json'), 'utf8'))
  const out = {}
  for (const era of eras) {
    const y = era.year
    const entry = {}
    for (const layer of ['cultivation', 'settlement', 'forest']) {
      const ks = KEYFRAMES.filter((k) => k.layers.includes(layer))
      if (era.id === 'coda' || y >= 1970) entry[layer] = { keyframe: 'now' }
      else if (y <= ks[0].year) entry[layer] = { keyframe: ks[0].id, ...(y < 1450 ? { note: 'before the leeward field systems: see the contact keyframe note' } : {}) }
      else {
        let a = ks[0]
        let b = ks[ks.length - 1]
        for (let i = 0; i + 1 < ks.length; i++) if (y >= ks[i].year && y <= ks[i + 1].year) [a, b] = [ks[i], ks[i + 1]]
        entry[layer] = { from: a.id, to: b.id, t: round((y - a.year) / (b.year - a.year), 3) }
      }
    }
    out[era.id] = { year: y, ...entry }
  }
  return out
}

// ---------------------------------------------------------------------------
// --bake

const fracStats = (bytes, land, texelKm2) => {
  let n = 0
  let sum = 0
  let half = 0
  for (let o = 0; o < land.length; o++) {
    if (!land[o]) continue
    n++
    sum += bytes[o]
    if (bytes[o] >= 128) half++
  }
  return { landFraction: round(sum / 255 / n, 4), overHalf: round(half / n, 4), areaKm2: round((sum / 255) * texelKm2, 1) }
}

const densityStats = (bytes, land, texelKm2) => {
  let n = 0
  let people = 0
  let over = 0
  let peak = 0
  let sum = 0
  for (let o = 0; o < land.length; o++) {
    if (!land[o]) continue
    n++
    const d = decodeDensity(bytes[o])
    people += d * texelKm2
    sum += bytes[o]
    if (d >= 10) over++
    if (d > peak) peak = d
  }
  return { landFraction: round(sum / 255 / n, 4), people: Math.round(people), peakPerKm2: Math.round(peak), over10PerKm2: round(over / n, 4) }
}

/**
 * How well the two loʻi and field models find the 1848–1855 kuleana: the
 * share of the parcels’ area inside the published zones, inside the
 * valley-floor rule, and inside either (texels at 0.5 or more).
 */
function calibration(I) {
  let K = 0
  let zones = 0
  let valley = 0
  let either = 0
  let zoneLoi = 0
  let valleyLoi = 0
  let anyZone = 0
  for (let o = 0; o < I.N; o++) {
    if (!I.land[o] || I.island[o] !== I.id) continue
    const A = I.texelKm2
    const k = I.kuleanaRaw[o] * A
    const z = I.loiZone[o] >= 0.5 || I.dryland[o] >= 0.5 || I.agroforestry[o] >= 0.5
    const v = I.valleyLoi[o] >= 0.5
    K += k
    if (z) zones += k
    if (v) valley += k
    if (z || v) either += k
    zoneLoi += I.loiZone[o] * A
    valleyLoi += I.valleyLoi[o] * A
    anyZone += Math.max(I.loiZone[o], I.dryland[o], I.agroforestry[o]) * A
  }
  const share = (x) => (K > 0 ? round(x / K, 3) : null)
  return {
    kuleanaKm2: round(K, 2),
    kuleanaInPublishedZones: share(zones),
    kuleanaInValleyRule: share(valley),
    kuleanaInEither: share(either),
    publishedZonesKm2: round(anyZone, 1),
    publishedLoiKm2: round(zoneLoi, 1),
    valleyRuleLoiKm2: round(valleyLoi, 1),
  }
}

async function bake(dir) {
  const t0 = Date.now()
  const ledger = new Ledger(dir)
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
  const ahupuaa = JSON.parse(readFileSync(join(DATA, 'boundaries', 'ahupuaa.geojson'), 'utf8'))
  const moku = JSON.parse(readFileSync(join(DATA, 'boundaries', 'moku.geojson'), 'utf8'))
  const mokuKeys = new Set(moku.features.map((f) => f.properties.mokuKey))
  for (const d of DISTRICTS_1896) for (const k of d.moku) if (!mokuKeys.has(k)) throw new Error(`1896 district ${d.name}: no moku ${k} in moku.geojson`)
  const districtOf = new Map()
  DISTRICTS_1896.forEach((d, i) => d.moku.forEach((k) => districtOf.set(k, i)))
  for (const k of mokuKeys) if (!districtOf.has(k)) throw new Error(`moku ${k} is in no 1896 district`)

  if (!existsSync(layerPaths(dir).cahTif)) throw new Error(`nothing downloaded in ${dir}; run --download first`)
  const classes = readCahClasses(dir)
  for (const [v, name] of [[1, 'Closed ohia wet forest'], [44, 'High intensity developed'], [47, 'Very sparse vegetation to unvegetated']]) {
    if (classes[v]?.detailed !== name) throw new Error(`CAH value table: class ${v} is "${classes[v]?.detailed}", expected "${name}"`)
  }
  log('reading the vector layers:')
  const src = {
    ahupuaa,
    moku,
    cahTif: layerPaths(dir).cahTif,
    rainFallbackMm: RAIN_FALLBACK_MM,
  }
  for (const key of Object.keys(VECTORS)) {
    src[key] = readVector(dir, key)
    log(`  ${key}: ${src[key].features.length} features`)
  }
  for (const f of src.geology.features) f.properties._year = eruptionYear(f.properties.age_range, f.properties.name)
  const bgPop = src.blockGroups.features.map((f) => Number(f.properties.POP100) || 0)

  const packs = manifest.packs.filter((p) => p.kind === 'island')
  if (packs.length !== ISLANDS.length) throw new Error(`manifest has ${packs.length} island packs, expected ${ISLANDS.length}`)
  mkdirSync(OUT, { recursive: true })

  // Pass 1: inputs, cultivation and forest per pack; settlement weights and
  // their sums over each island's own texels in its own pack.
  const state = []
  const sum = { contact: {}, maheleK: {}, maheleC: {}, district: DISTRICTS_1896.map(() => ({ K: 0, C: 0, cane: 0 })), towns: TOWNS_1896.map(() => 0), bg: new Float64Array(bgPop.length), bgN: new Float64Array(bgPop.length) }
  const islandStats = {}
  for (const pack of packs) {
    log(`${pack.id}: ${pack.size.join('x')} at ${pack.metresPerTexel[0]} m`)
    const P = readPack(DATA, pack)
    const I = await packInputs(P, src, log)
    const cult = {}
    for (const k of KEYFRAMES) cult[k.id] = cultivation(I, k.id)
    const fores = { contact: forest(I, 'contact', cult), kingdom: forest(I, 'kingdom', cult), now: forest(I, 'now', cult) }
    const dir2 = join(OUT, pack.id)
    mkdirSync(dir2, { recursive: true })
    const entry = { pack: pack.id, size: pack.size, bounds: pack.bounds, layers: {} }
    if (I.rainNote) entry.note = I.rainNote
    for (const k of KEYFRAMES) {
      entry.layers[k.id] = {}
      for (const layer of ['cultivation', 'forest']) {
        if (!k.layers.includes(layer)) continue
        const vals = layer === 'cultivation' ? cult[k.id] : fores[k.id]
        const bytes = new Uint8Array(P.N)
        for (let o = 0; o < P.N; o++) bytes[o] = P.land[o] ? Math.round(vals[o] * 255) : 0
        const file = `${pack.id}/${k.id}-${layer}.png`
        writeGreyPNG(join(OUT, file), P.W, P.H, bytes)
        entry.layers[k.id][layer] = { file, stats: fracStats(bytes, P.land, P.texelKm2) }
      }
    }
    // settlement weights
    const wC = contactWeight(I, cult.contact)
    const wK = new Float32Array(P.N)
    for (let o = 0; o < P.N; o++) wK[o] = P.land[o] ? I.kuleana[o] : 0
    const wCane = caneWeight(I)
    const townW = TOWNS_1896.map((t) => townWeight(I, t))
    const A = P.texelKm2
    for (let o = 0; o < P.N; o++) {
      if (!P.land[o] || I.island[o] !== pack.id) continue
      const isl = I.island[o]
      sum.contact[isl] = (sum.contact[isl] || 0) + wC[o] * A
      sum.maheleK[isl] = (sum.maheleK[isl] || 0) + wK[o] * A
      sum.maheleC[isl] = (sum.maheleC[isl] || 0) + wC[o] * A
      const d = districtOf.get(I.mokuKey[o])
      if (d === undefined) continue
      sum.district[d].K += wK[o] * A
      sum.district[d].C += wC[o] * A
      sum.district[d].cane += wCane[o] * A
      TOWNS_1896.forEach((t, ti) => {
        if (DISTRICTS_1896[d].name === t.district) sum.towns[ti] += townW[ti][o] * A
      })
      const b = I.bg[o]
      if (b >= 0) {
        sum.bg[b] += I.cah.dev[o] * A
        sum.bgN[b] += A
      }
    }
    state.push({ pack, P: { W: P.W, H: P.H, N: P.N, land: P.land, texelKm2: P.texelKm2 }, island: I.island, mokuKey: I.mokuKey, bg: I.bg, dev: I.cah.dev, wC, wK, wCane, townW, entry })
    islandStats[pack.id] = calibration(I)
    log(`    cultivation and forest written (${((Date.now() - t0) / 1000).toFixed(0)} s so far)`)
  }

  // Kahoʻolawe in 1778, which King leaves out: its 1832 count back-cast by
  // the ratio of King's total to the 1832 census.
  const pop1778 = { ...ISLAND_POP.contact }
  pop1778.kahoolawe = Math.round((KAHOOLAWE_BACKCAST.count1832 * KAHOOLAWE_BACKCAST.king) / KAHOOLAWE_BACKCAST.total1832 / 10) * 10

  // Pass 2: settlement in people per km², encoded.
  const dTowns = TOWNS_1896.map((t) => DISTRICTS_1896.findIndex((d) => d.name === t.district))
  for (const s of state) {
    const { P, pack, entry } = s
    const dens = { contact: new Float32Array(P.N), mahele: new Float32Array(P.N), kingdom: new Float32Array(P.N), now: new Float32Array(P.N) }
    for (let o = 0; o < P.N; o++) {
      if (!P.land[o]) continue
      const isl = s.island[o]
      // contact
      dens.contact[o] = sum.contact[isl] > 0 ? (pop1778[isl] * s.wC[o]) / sum.contact[isl] : 0
      // mahele
      const pm = ISLAND_POP.mahele[isl]
      const sk = sum.maheleK[isl]
      const sc = sum.maheleC[isl]
      dens.mahele[o] = sk > 0 ? pm * ((0.6 * s.wK[o]) / sk + (0.4 * s.wC[o]) / sc) : sc > 0 ? (pm * s.wC[o]) / sc : 0
      // kingdom (an islet outside every moku polygon has no district and stays empty)
      const di = districtOf.get(s.mokuKey[o])
      const D = DISTRICTS_1896[di]
      if (D) {
        const S = sum.district[di]
        let rest = D.pop
        let town = 0
        TOWNS_1896.forEach((t, ti) => {
          if (dTowns[ti] !== di) return
          const people = t.people ?? t.share * D.pop
          rest -= people
          if (sum.towns[ti] > 0) town += (people * s.townW[ti][o]) / sum.towns[ti]
        })
        const parts = [
          [0.4, s.wCane[o], S.cane],
          [0.35, s.wK[o], S.K],
          [0.25, s.wC[o], S.C],
        ].filter(([, , tot]) => tot > 0)
        const wsum = parts.reduce((a, [w]) => a + w, 0)
        let spread = 0
        for (const [w, v, tot] of parts) spread += (w / wsum) * (v / tot)
        dens.kingdom[o] = town + rest * spread
      }
      // now
      const b = s.bg[o]
      if (b >= 0 && sum.bgN[b] > 0) dens.now[o] = sum.bg[b] > 0 ? (bgPop[b] * s.dev[o]) / sum.bg[b] : bgPop[b] / sum.bgN[b]
    }
    for (const k of KEYFRAMES) {
      const bytes = new Uint8Array(P.N)
      for (let o = 0; o < P.N; o++) bytes[o] = P.land[o] ? encodeDensity(dens[k.id][o]) : 0
      const file = `${pack.id}/${k.id}-settlement.png`
      writeGreyPNG(join(OUT, file), P.W, P.H, bytes)
      entry.layers[k.id].settlement = { file, stats: densityStats(bytes, P.land, P.texelKm2) }
    }
    // order the layers as the keyframes list them
    for (const k of KEYFRAMES) entry.layers[k.id] = Object.fromEntries(k.layers.map((l) => [l, entry.layers[k.id][l]]))
  }

  // manifest
  const how = methods(ledger, dir, pop1778.kahoolawe)
  const islands = {}
  for (const s of state) {
    const e = s.entry
    for (const k of KEYFRAMES) for (const l of k.layers) e.layers[k.id][l] = { file: e.layers[k.id][l].file, method: how[k.id][l].method, stats: e.layers[k.id][l].stats }
    islands[s.pack.id] = e
  }
  const sizeOf = (f) => statSync(join(OUT, f)).size
  let bytes = 0
  for (const e of Object.values(islands)) for (const k of Object.values(e.layers)) for (const l of Object.values(k)) bytes += sizeOf(l.file)
  const layersManifest = {
    about:
      'Per-era land-use masks for each island pack (DESIGN.md §2 and §5.5), for blending over the terrain at far and mid ' +
      'zoom. Each mask is an 8-bit greyscale PNG with exactly the bounds and size of its island pack in ../manifest.json, ' +
      'so it is sampled with the same texel registration (DATA.md); 0 over sea. Where a layer is modelled rather than ' +
      'mapped, `method` says so and `methods` writes the rule out; the app labels it.',
    encoding: {
      cultivation: 'value / 255 = share of the texel cultivated (loʻi, dryland fields, crops; fishponds counted with their shore)',
      forest: 'value / 255 = share of the texel under native forest canopy',
      settlement: {
        kind: 'log density',
        d0: D0,
        dMax: DMAX,
        decode: 'people per km² = d0 × (exp(value / 255 × ln(1 + dMax / d0)) − 1); 0 is nobody, 255 is dMax or more',
      },
    },
    keyframes: KEYFRAMES,
    eras: eraMap(),
    methods: how,
    islands,
    stats: { files: Object.values(islands).length * KEYFRAMES.reduce((a, k) => a + k.layers.length, 0), bytes },
    baked: {
      tool: 'tools/bake-layers.mjs',
      packManifest: 'manifest.json',
      kuleanaParcels: src.lca.features.filter((f) => f.properties._areaM2 < RULES.kuleanaMaxHa * 1e4).length,
      calibration: islandStats,
      calibrationNote:
        'For each island, the area of Land Commission Award parcels under 5 ha (kuleana size) and the share of it lying where ' +
        'the published Traditional Agriculture zones, the valley-floor loʻi rule, or either reach 0.5. The parcels are 1848–1855 ' +
        'evidence of land in use; much of what they miss is kula (dryland) and house lots outside both models.',
    },
  }
  // tools/bake-zoning.mjs keeps its own entry in this file under `zoning`;
  // carry it over, since this bake rewrites everything else from scratch
  const prior = join(OUT, 'manifest.json')
  if (existsSync(prior)) {
    const z = JSON.parse(readFileSync(prior, 'utf8')).zoning
    if (z) layersManifest.zoning = z
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(layersManifest, null, 2) + '\n')
  log(`wrote ${join(OUT, 'manifest.json')} (${(bytes / 1048576).toFixed(2)} MB of masks, ${((Date.now() - t0) / 1000).toFixed(0)} s)`)
  printTable(layersManifest)
}

function printTable(m) {
  const head = ['island', ...KEYFRAMES.flatMap((k) => k.layers.map((l) => `${k.id}.${l.slice(0, 5)}`))]
  log(head.map((h, i) => (i ? h.padStart(15) : h.padEnd(10))).join(''))
  for (const [id, e] of Object.entries(m.islands)) {
    const cells = KEYFRAMES.flatMap((k) =>
      k.layers.map((l) => {
        const s = e.layers[k.id][l].stats
        return (l === 'settlement' ? `${s.people}` : `${(s.landFraction * 100).toFixed(1)}%`).padStart(15)
      }),
    )
    log(id.padEnd(10) + cells.join(''))
  }
  log('(cultivation and forest: mean share of the pack’s land; settlement: people in the pack)')
}

// ---------------------------------------------------------------------------
// --check

function check() {
  let failures = 0
  const fail = (msg) => {
    failures++
    log(`  FAIL ${msg}`)
  }
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
  const lm = JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8'))
  const methodsOk = new Set(['mapped', 'modelled', 'mixed'])
  for (const k of lm.keyframes) {
    for (const l of k.layers) {
      const how = lm.methods?.[k.id]?.[l]
      if (!how) fail(`${k.id}.${l}: no method`)
      else {
        if (!methodsOk.has(how.method)) fail(`${k.id}.${l}: method "${how.method}"`)
        if (how.method !== 'mapped' && !(how.rule && how.rule.length > 80)) fail(`${k.id}.${l}: ${how.method} but no rule written out`)
        if (!how.sources?.length) fail(`${k.id}.${l}: no sources`)
        for (const s of how.sources || []) if (!s.title || !s.url || (!s.licence && s.id !== 'holo-boundaries')) fail(`${k.id}.${l}: source ${s.id} lacks title, url or licence`)
      }
    }
  }
  for (const [eraId, e] of Object.entries(lm.eras)) for (const l of ['cultivation', 'settlement', 'forest']) if (!e[l]) fail(`era ${eraId}: no ${l}`)
  log('island      keyframe  cultivation   forest   settlement (people, peak /km²)')
  for (const pack of manifest.packs.filter((p) => p.kind === 'island')) {
    const e = lm.islands[pack.id]
    if (!e) {
      fail(`no layers for ${pack.id}`)
      continue
    }
    if (JSON.stringify(e.bounds) !== JSON.stringify(pack.bounds) || JSON.stringify(e.size) !== JSON.stringify(pack.size)) fail(`${pack.id}: bounds or size differ from the pack`)
    const [W, H] = pack.size
    const h = readPNG(join(DATA, pack.height.file))
    const land = new Uint8Array(W * H)
    for (let o = 0; o < W * H; o++) land[o] = (h.data[o * 3] * 256 + h.data[o * 3 + 1]) * pack.height.scale + pack.height.offset > 0 ? 1 : 0
    const texelKm2 = (pack.metresPerTexel[0] * pack.metresPerTexel[1]) / 1e6
    for (const k of lm.keyframes) {
      const cells = []
      for (const l of ['cultivation', 'forest', 'settlement']) {
        if (!k.layers.includes(l)) {
          cells.push('—'.padStart(l === 'settlement' ? 22 : 11))
          continue
        }
        const entry = e.layers[k.id]?.[l]
        if (!entry) {
          fail(`${pack.id} ${k.id}.${l}: missing`)
          continue
        }
        let img
        try {
          img = readPNG(join(OUT, entry.file))
        } catch (err) {
          fail(`${entry.file}: ${err.message}`)
          continue
        }
        if (img.channels !== 1) fail(`${entry.file}: not greyscale`)
        if (img.width !== W || img.height !== H) fail(`${entry.file}: ${img.width}x${img.height}, pack is ${W}x${H}`)
        let onSea = 0
        for (let o = 0; o < W * H; o++) if (!land[o] && img.data[o]) onSea++
        if (onSea) fail(`${entry.file}: ${onSea} texels with a value over sea`)
        const st = l === 'settlement' ? densityStats(img.data, land, texelKm2) : fracStats(img.data, land, texelKm2)
        for (const [key, v] of Object.entries(entry.stats)) if (Math.abs(st[key] - v) > Math.max(1e-3, Math.abs(v) * 1e-3)) fail(`${entry.file}: stats.${key} ${v}, read back ${st[key]}`)
        if (entry.method !== lm.methods[k.id][l].method) fail(`${entry.file}: method differs from methods.${k.id}.${l}`)
        cells.push(l === 'settlement' ? `${String(st.people).padStart(9)} ${String(st.peakPerKm2).padStart(6)} /km²` : `${(st.landFraction * 100).toFixed(1).padStart(9)}%`)
      }
      log(`${pack.id.padEnd(11)} ${k.id.padEnd(9)} ${cells.join('  ')}`)
    }
  }
  // the archipelago's people, against the figures
  for (const k of lm.keyframes.filter((k) => k.layers.includes('settlement'))) {
    let people = 0
    for (const e of Object.values(lm.islands)) people += e.layers[k.id].settlement.stats.people
    log(`${k.id}: ${people} people in the packs (neighbouring packs overlap at Kahoʻolawe and Molokini, so this can run slightly over the figures)`)
  }
  // budget
  let bytes = 0
  const walk = (d) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, f.name)
      if (f.isDirectory()) walk(p)
      else bytes += statSync(p).size
    }
  }
  walk(OUT)
  log(`public/data/layers/: ${(bytes / 1048576).toFixed(2)} MB (budget ${MAX_BYTES / 1048576} MB)`)
  if (bytes > MAX_BYTES) fail(`public/data/layers/ is ${(bytes / 1048576).toFixed(2)} MB, over ${MAX_BYTES / 1048576} MB`)
  if (failures) {
    log(`${failures} failure(s)`)
    process.exit(1)
  }
  log('layers check passed')
}

// ---------------------------------------------------------------------------
// --preview

const TINT = { forest: [28, 92, 40], cultivation: [235, 170, 40], settlement: [205, 25, 60] }
// settlement shows from about 5 people per km² and is full at about 5,000
const settleAlpha = (v) => Math.min(1, Math.max(0, (v - 30) / 170)) * 0.9

function preview(outDir) {
  const OUTP = resolve(outDir)
  mkdirSync(OUTP, { recursive: true })
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
  const lm = JSON.parse(readFileSync(join(OUT, 'manifest.json'), 'utf8'))
  const moku = JSON.parse(readFileSync(join(DATA, 'boundaries', 'moku.geojson'), 'utf8'))
  const kingdomYear = lm.keyframes.find((k) => k.id === 'kingdom').year
  const contactYear = lm.keyframes.find((k) => k.id === 'contact').year
  for (const pack of manifest.packs.filter((p) => p.kind === 'island')) {
    const e = lm.islands[pack.id]
    const [W, H] = pack.size
    const h = readPNG(join(DATA, pack.height.file))
    const m = new Float32Array(W * H)
    for (let o = 0; o < W * H; o++) m[o] = (h.data[o * 3] * 256 + h.data[o * 3 + 1]) * pack.height.scale + pack.height.offset
    const [mx, mz] = pack.metresPerTexel
    const relief = new Float32Array(W * H)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const o = y * W + x
        const at = (i, j) => Math.max(0, m[Math.max(0, Math.min(H - 1, j)) * W + Math.max(0, Math.min(W - 1, i))])
        const nx = (-(at(x + 1, y) - at(x - 1, y)) / (2 * mx)) * 2
        const ny = (-(at(x, y + 1) - at(x, y - 1)) / (2 * mz)) * 2
        relief[o] = Math.max(0, (nx * -0.5 + ny * -0.6 + 0.62) / Math.hypot(nx, ny, 1) / Math.hypot(0.5, 0.6, 0.62))
      }
    }
    const panels = []
    for (const k of lm.keyframes) {
      const get = (l) => (e.layers[k.id][l] ? readPNG(join(OUT, e.layers[k.id][l].file)).data : null)
      let fo = get('forest')
      let foNote = ''
      if (!fo) {
        // the app interpolates forest across this keyframe; so does the preview
        const a = readPNG(join(OUT, e.layers.contact.forest.file)).data
        const b = readPNG(join(OUT, e.layers.kingdom.forest.file)).data
        const t = (k.year - contactYear) / (kingdomYear - contactYear)
        fo = new Uint8Array(W * H)
        for (let o = 0; o < W * H; o++) fo[o] = Math.round(a[o] + (b[o] - a[o]) * t)
        foNote = ' (forest interpolated)'
      }
      const cu = get('cultivation')
      const se = get('settlement')
      const rgb = new Uint8Array(W * H * 3)
      for (let o = 0; o < W * H; o++) {
        if (m[o] <= 0) {
          rgb.set([24, 40, 64], o * 3)
          continue
        }
        const s = 0.45 + 0.6 * relief[o]
        let c = [205 * s, 200 * s, 188 * s]
        const mix = (tint, a) => (c = c.map((v, i) => v * (1 - a) + tint[i] * s * a))
        mix(TINT.forest, (fo[o] / 255) * 0.8)
        mix(TINT.cultivation, (cu[o] / 255) * 0.85)
        mix(TINT.settlement, settleAlpha(se[o]))
        rgb.set(c.map((v) => Math.max(0, Math.min(255, Math.round(v)))), o * 3)
      }
      drawMoku(rgb, W, H, pack, moku)
      const file = join(OUTP, `${pack.id}-${k.id}.png`)
      writePNG(file, W, H, rgb)
      panels.push(rgb)
      log(`${file}${foNote}`)
    }
    // the keyframes side by side at half size, for comparing
    const strip = mosaic([panels], W, H)
    writePNG(join(OUTP, `${pack.id}.png`), strip.W, strip.H, strip.rgb)
    log(`${join(OUTP, `${pack.id}.png`)} (${lm.keyframes.map((k) => k.id).join(', ')}, left to right)`)
    // and each layer alone: a row per keyframe, a column per layer
    const rows = lm.keyframes.map((k) =>
      ['cultivation', 'settlement', 'forest'].map((l) => {
        const rgb = new Uint8Array(W * H * 3)
        const v = e.layers[k.id][l] ? readPNG(join(OUT, e.layers[k.id][l].file)).data : null
        for (let o = 0; o < W * H; o++) {
          if (m[o] <= 0) {
            rgb.set([24, 40, 64], o * 3)
            continue
          }
          const s = 0.45 + 0.6 * relief[o]
          const a = v ? (l === 'settlement' ? settleAlpha(v[o]) : (v[o] / 255) * 0.9) : 0
          const base = v ? 190 : 120
          rgb.set(TINT[l].map((t) => Math.max(0, Math.min(255, Math.round((base * (1 - a) + t * a) * s)))), o * 3)
        }
        return rgb
      }),
    )
    const grid = mosaic(rows, W, H)
    writePNG(join(OUTP, `${pack.id}-layers.png`), grid.W, grid.H, grid.rgb)
    log(`${join(OUTP, `${pack.id}-layers.png`)} (rows ${lm.keyframes.map((k) => k.id).join(', ')}; columns cultivation, settlement, forest)`)
  }
}

/** Panels (rows of W × H RGB images) at half size in a grid, with white gaps. */
function mosaic(rows, W, H) {
  const hw = Math.ceil(W / 2)
  const hh = Math.ceil(H / 2)
  const gap = 6
  const cols = Math.max(...rows.map((r) => r.length))
  const MW = cols * hw + (cols - 1) * gap
  const MH = rows.length * hh + (rows.length - 1) * gap
  const rgb = new Uint8Array(MW * MH * 3).fill(255)
  rows.forEach((row, r) =>
    row.forEach((p, n) => {
      for (let y = 0; y < hh; y++) {
        for (let x = 0; x < hw; x++) {
          for (let c = 0; c < 3; c++) {
            let t = 0
            let q = 0
            for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
              const sx = 2 * x + dx
              const sy = 2 * y + dy
              if (sx < W && sy < H) {
                t += p[(sy * W + sx) * 3 + c]
                q++
              }
            }
            rgb[((r * (hh + gap) + y) * MW + n * (hw + gap) + x) * 3 + c] = Math.round(t / q)
          }
        }
      }
    }),
  )
  return { W: MW, H: MH, rgb }
}

function drawMoku(rgb, W, H, pack, fc) {
  const [w, , , n] = pack.bounds
  const dLon = (pack.bounds[2] - w) / W
  const dLat = (n - pack.bounds[1]) / H
  for (const f of fc.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const poly of polys) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length - 1; i++) {
          const x0 = (ring[i][0] - w) / dLon
          const y0 = (n - ring[i][1]) / dLat
          const x1 = (ring[i + 1][0] - w) / dLon
          const y1 = (n - ring[i + 1][1]) / dLat
          const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))))
          for (let s = 0; s <= steps; s++) {
            const x = Math.floor(x0 + ((x1 - x0) * s) / steps)
            const y = Math.floor(y0 + ((y1 - y0) * s) / steps)
            if (x < 0 || y < 0 || x >= W || y >= H) continue
            const o = (y * W + x) * 3
            for (let c = 0; c < 3; c++) rgb[o + c] = Math.round(rgb[o + c] * 0.35)
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'preview', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-layers.mjs --download | --bake | --check | --preview DIR | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    mkdirSync(args.downloads, { recursive: true })
    log(`downloads: ${args.downloads}`)
    downloadAll(new Ledger(args.downloads), args.downloads, log)
  }
  if (f.has('bake') || f.has('all')) await bake(args.downloads)
  if (f.has('check') || f.has('all')) check()
  if (f.has('preview')) preview(args.preview)
  if (f.has('clean') || f.has('all')) {
    rmSync(args.downloads, { recursive: true, force: true })
    log(`deleted ${args.downloads}`)
  }
}

main().catch((e) => {
  console.error(e.stack || String(e))
  process.exit(1)
})
