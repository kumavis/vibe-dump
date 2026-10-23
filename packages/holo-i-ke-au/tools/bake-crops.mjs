#!/usr/bin/env node
// Crop classes for Holo i ke Au (DATA.md, "Crops, on the era layers"): what
// grows on each land texel of each island pack at each era keyframe (loʻi,
// dryland fields, rice, cane, pineapple, pasture, orchard, lawn), as class
// rasters beside the era layers' masks, so the ground can draw rice where
// there was rice and pasture where cattle grazed, not taro everywhere.
//
//   node packages/holo-i-ke-au/tools/bake-crops.mjs --all           download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-crops.mjs --download      fetch every input (~500 MB, nearly all of it the CAH GeoTIFF)
//   node packages/holo-i-ke-au/tools/bake-crops.mjs --bake          write the rasters and the manifest's `crops` entry
//   node packages/holo-i-ke-au/tools/bake-crops.mjs --check         read them back and check them, with a sanity table
//   node packages/holo-i-ke-au/tools/bake-crops.mjs --preview DIR   tint each island by class over shaded relief, keyframes side by side
//   node packages/holo-i-ke-au/tools/bake-crops.mjs --clean         delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_CROPS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/crops-downloads). Keep it outside the repo.
//
// It reads the island packs that tools/bake.mjs wrote (manifest.json, each
// height.png and rain.png, boundaries/), the era layers' cultivation and
// forest masks that tools/bake-layers.mjs wrote and the zoning rasters of
// tools/bake-zoning.mjs, so run those first. It writes only
// public/data/layers/<island>/<keyframe>-crop.png and the top-level `crops`
// key of public/data/layers/manifest.json, leaving every other key as it
// stands. Like `npm run thumbnails`, a by-hand step whose output is
// committed; nothing here runs at app runtime.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { ISLANDS } from './lib/geo.mjs'
import { readPNG, writeGreyPNG } from './lib/png.mjs'
import { readPack, sampleCah, samplesFor } from './lib/layers-raster.mjs'
import { KEYFRAMES, RULES, fieldInputs } from './lib/layers-model.mjs'
import {
  CLASSES,
  COFFEE_1896,
  N_CLASSES,
  PLANTATIONS_1853,
  PLANTATIONS_1853_LEFT_OUT,
  PLANTATION_ACRES_1853,
  RANCHES_1853,
  RANCHES_1853_LEFT_OUT,
  RANCHES_1896,
  RANCHES_1896_SOURCE,
  RICE_1896,
  RICE_LEFT_OUT,
  RICE_TOTALS,
  RICE_TOTALS_SOURCE,
  UNCULTIVATED_OK,
  WANTED,
} from './lib/crops-history.mjs'
import { ACRE_KM2, ALUM_READ, CROP_RULES, NOW_CLASSES, classStats, cropClasses, cropInputs } from './lib/crops-model.mjs'
import { CROP_VECTORS, FIELD_KEYS, downloadAll, downloaded, layerPaths, readCahClasses, readVector, sourceOf } from './lib/crops-sources.mjs'
import { check, preview } from './lib/crops-check.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')
const OUT = join(DATA, 'layers')
// as tools/bake-layers.mjs takes Niʻihau, which has no rain grid
const RAIN_FALLBACK_MM = 500
// the day the historical sources below were read for this bake
const READ_ON = '2026-10-23'

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
  a.downloads = resolve(a.downloads || process.env.HOLO_CROPS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'crops-downloads'))
  return a
}

/** The layers manifest, parsed, provided it is exactly what JSON.stringify(…, null, 2) writes (as bake-zoning.mjs requires). */
function readLayersManifest(path) {
  const text = readFileSync(path, 'utf8')
  const json = JSON.parse(text)
  if (JSON.stringify(json, null, 2) + '\n' !== text) throw new Error(`${path} is not as JSON.stringify(…, null, 2) writes it; refusing to rewrite it`)
  return json
}

// ---------------------------------------------------------------------------
// Sources: the data layers (with the ledger's dates) and the historical
// record (from sources.json, with the terms each is used under)

const HISTORICAL = {
  'thrum-annual-1902': 'public domain (1901)',
  'thrum-annual-1895': 'public domain (1894)',
  'thrum-annual-1900': 'public domain (1899)',
  'glick-1980-sojourners': '© University of Hawaiʻi Press, read on its open-access Manifold edition (2017); figures and places cited, nothing copied',
  'nrhp-hanalei-pier': 'public domain (U.S. National Park Service)',
  'kelley-1914-rice-soils': 'public domain (U.S. Department of Agriculture)',
  'nrhp-koloa-mill': 'public domain (U.S. National Park Service)',
  'nrhp-haiku-mill': 'public domain (U.S. National Park Service)',
  'mauiwine-ulupalakua-history': '© MauiWine; facts cited, nothing copied',
  'wikipedia-parker-ranch': 'CC BY-SA 4.0 (Wikipedia); facts cited, tertiary',
  'wikipedia-kualoa-ranch': 'CC BY-SA 4.0 (Wikipedia); facts cited, tertiary',
  'wikipedia-valdemar-knudsen': 'CC BY-SA 4.0 (Wikipedia); facts cited, tertiary',
  'to-hawaii-hana': '© to-hawaii.com; facts cited, tertiary',
  'imagesofoldhawaii-pioneer-mill': '© Images of Old Hawaiʻi; facts cited, tertiary',
  'usgs-topo-1927-oahu': 'public domain (U.S. Geological Survey)',
  'usgs-topo-1910-kauai': 'public domain (U.S. Geological Survey)',
  'kirc-history': 'State of Hawaiʻi web page (Kahoʻolawe Island Reserve Commission); facts cited',
  'coulter-chun-1937-rice': 'not read',
  'coulter-1931-land-1853': 'not read',
  'maclennan-1995-maui-plantations': 'not read',
  'char-1988-chinese-sites': 'not read',
}

function historicalSources(ids) {
  const all = JSON.parse(readFileSync(join(DATA, 'sources.json'), 'utf8'))
  const byId = new Map(all.map((s) => [s.id, s]))
  const out = {}
  for (const id of ids) {
    const s = byId.get(id)
    if (!s) throw new Error(`crops: source ${id} is not in sources.json`)
    if (!(id in HISTORICAL)) throw new Error(`crops: no terms recorded for source ${id}`)
    out[id] = {
      id,
      title: s.title,
      author: s.author,
      ...(s.year ? { year: s.year } : {}),
      url: s.url,
      licence: HISTORICAL[id],
      ...(s.opened ? { fetched: READ_ON } : {}),
      opened: s.opened,
      sourcesJson: true,
      ...(s.tertiary ? { tertiary: true } : {}),
    }
  }
  return out
}

/** Every sources.json id the crops cite, in the order they first appear. */
function citedIds() {
  const ids = []
  const add = (list) => (list || []).forEach((id) => ids.includes(id) || ids.push(id))
  for (const p of PLANTATIONS_1853) add(p.sources)
  for (const p of PLANTATIONS_1853_LEFT_OUT) add(p.sources)
  for (const r of RANCHES_1853) add(r.sources)
  for (const r of RANCHES_1853_LEFT_OUT) add(r.sources)
  add([RANCHES_1896_SOURCE])
  for (const r of RANCHES_1896) add(r.sources)
  add([RICE_TOTALS_SOURCE])
  for (const d of RICE_1896) add(d.sources)
  for (const d of RICE_LEFT_OUT) add(d.sources)
  add(COFFEE_1896.kona.sources)
  add(COFFEE_1896.olaa.sources)
  for (const d of COFFEE_1896.leftOut) add(d.sources)
  add(['usgs-topo-1910-kauai'])
  add(WANTED)
  return ids
}

// ---------------------------------------------------------------------------
// How each keyframe's classes are made, written out for the manifest

const pct = (v) => `${Math.round(v * 100)}%`
const F = CROP_RULES

function methods() {
  const fieldRule = (key) =>
    `Where the ${key} cultivation mask (layers/<island>/${key}-cultivation.png) is above 0, the term of its rule that is largest ` +
    'there names the field: the loʻi rule (the Kurashima–Kirch loʻi zones and the valley-floor and coastal-plain rule) gives loʻi (1); ' +
    'the dryland and agroforestry zones give dryland (2); the kuleana parcels give loʻi where the loʻi rule reaches ' +
    `${F.kuleanaLoi} there and dryland elsewhere; the fishpond shore gives 0 (a pond’s shore, no crop: the app draws its default)`
  const grass =
    `the lower, drier part of the bounds: below ${F.grass.maxElevation.toLocaleString('en-US')} m, with ${F.grass.rainMm[0]}–${F.grass.rainMm[1].toLocaleString('en-US')} mm of ` +
    `rain a year (neither the bare leeward coast nor the wet forest belt), outside the keyframe’s forest (under ${pct(F.grass.maxForest)}) ` +
    `and fields (cultivation under ${pct(F.grass.maxCultivation)})`
  return {
    contact: {
      method: 'modelled',
      rule: `${fieldRule('contact')}. Nothing else grows at contact: classes 1, 2 and 0 only.`,
      classes: [1, 2],
      limits:
        'As good as the cultivation model beneath it (RESEARCH §9): the dryland zones are the published model of the leeward field ' +
        'systems, not their surveyed footprints; East Hawaiʻi and windward East Maui are thin; the loʻi/dryland line follows which ' +
        'term of the model is largest, not a field survey.',
      sources: ['holo-layers', 'tradAg', 'geology', 'lca'],
    },
    mahele: {
      method: 'modelled',
      rule:
        `${fieldRule('mahele')}, the abandonment since contact being already in the mask’s lower weights. Cane (4): each plantation ` +
        `grinding by 1853 (${PLANTATIONS_1853.map((p) => p.name).join(', ')}) drawn as ${PLANTATION_ACRES_1853} acres (no acreage for 1853 ` +
        `was found for any of them, so every one takes this nominal figure) of the land nearest its mill below ${F.plantation.maxElevation} m and ` +
        `flatter than ${pct(F.plantation.maxSlope)}, not loʻi, land that was cane in 1900 counting as ${1 / F.plantation.cane1900Weight} times ` +
        `nearer; the 1853 cultivation mask has no cane, so these texels may be 0 in it. Pasture (6): the ranches by 1853 ` +
        `(${RANCHES_1853.map((r) => `${r.name}, ${r.since}`).join('; ')}), whose grazed land is not known, only their bounds (the ` +
        `ahupuaʻa named in record.ranches1853), so ${grass}. No rice: it was started in 1858 (record.leftOut).`,
      classes: [1, 2, 4, 6],
      limits:
        'The plantations are discs of a nominal size around their towns; Hilo’s mills and the East Maui plantation are left out ' +
        '(record.leftOut says why). Pasture is three ranches; the wild cattle of the Waimea plains and Mauna Kea, the herds kept ' +
        'across every island, are not drawn.',
      sources: ['holo-layers', 'tradAg', 'geology', 'lca', 'sugar1900', 'holo-boundaries'],
    },
    kingdom: {
      method: 'mixed',
      rule:
        `Mapped: cane (4) and pineapple (5) where the 1900 cane and pineapple lands are the largest term of the kingdom cultivation ` +
        `mask. Modelled: ${fieldRule('kingdom').replace(/^Where/, 'elsewhere, where')}. Rice (3): in each district an opened ` +
        `source puts rice in (record.rice1896), the cultivated texels classed loʻi, dryland or none that lie below ` +
        `${F.rice.maxElevation} m and flatter than ${pct(F.rice.maxSlope)}, on loʻi ground (the loʻi rule ` +
        `at ${F.rice.loi} or more) or wet ground (alluvium, lagoon deposits or fill at ${F.rice.wetGround} or more): “the lowest flats ` +
        'found at the outlets of valleys and close on the sea”; where the 1892 figure of a district is known (Hanalei and Waiʻoli ' +
        '750 acres, Mokulēʻia 738, Kailua and Waimānalo 400) up to that figure, the old loʻi first (the strongest loʻi rule, then the ' +
        'lowest ground: the rice took over abandoned taro land first), and there rice may take land that ' +
        `was cane by 1900. Coffee (7): in Kona, the land that was at least ${pct(F.alumShare)} coffee (O-5) in 1978–80, read back; at Olaʻa, ` +
        `${round(COFFEE_1896.olaa.acres, 1).toLocaleString('en-US')} acres (the 1897 count of coffee land a year old or more) of the land between 1,500 and 2,500 feet nearest ` +
        'the Volcano Road; the kingdom cultivation mask leaves coffee out, so these texels may be 0 in it. Pasture (6): in the bounds of ' +
        `each ranch of the Annual’s list (record.ranches1896: the moku of its listed district), the land that was at least ` +
        `${pct(F.alumShare)} grazing (A-1) in 1978–80, read back, where in 1896 it was under ${pct(F.grass.maxCultivation)} cultivated ` +
        `and under ${pct(F.grass.maxForest)} forest and not cane, pineapple, rice or coffee; on Lānaʻi, Niʻihau and Kahoʻolawe, ` +
        'whole-island sheep and cattle ranges the 1978–80 map cannot give back (it leaves out Niʻihau and Kahoʻolawe, and Lānaʻi ' +
        `was pineapple by then), all the land below ${F.grass.maxElevation.toLocaleString('en-US')} m that is neither forest nor field.`,
      classes: [1, 2, 3, 4, 5, 6, 7],
      limits:
        'Cane and pineapple are of 1900, four years on. Kahoʻolawe’s range is the KIRC timeline’s “first of many ranch leases” ' +
        'from 1858 and its late-1890s stock, not a map. Rice is placed by rule inside districts, not mapped: no map of the rice ' +
        'fields of the 1890s was found, and the 1927 sheets show what was left after annexation turned rice land to cane (none at ' +
        'Mokulēʻia or Waikīkī by then). Its districts are the ones a source names; Maui, Hawaiʻi Island and Koʻolauloa grew rice ' +
        'too, unplaced. Where no figure caps a district (Waikīkī, the ʻEwa shore, Kāneʻohe and the rest) all the land on the rule ' +
        'is rice, which likely overstates Oʻahu, whose lowlands also held taro, ponds and pasture. Pasture is the grazing of 1978–80 read back into the 1890s ranches’ districts: right where the ranches ' +
        'kept their land, wrong where grazing spread after 1896 (cleared forest) or gave way (pineapple, towns). Kona’s coffee is ' +
        'the coffee of 1980 read back, more than the 1,150 acres estimated for 1892 and probably less than the 1890s boom planted.',
      sources: ['holo-layers', 'sugar1900', 'pine1900', 'tradAg', 'geology', 'lca', 'alum', 'holo-boundaries'],
    },
    now: {
      method: 'mapped',
      rule:
        'The 2020 agricultural baseline: each texel takes the group of categories covering most of it (mapping.now) when the groups ' +
        `together cover ${pct(F.nowMinShare)} of it or the now cultivation mask is above 0: taro loʻi (1); pineapple (5); orchard, ` +
        'coffee, macadamia, fruit, flowers, seed and diversified crops (7); pasture and dairy (6). No cane: the last plantation closed in ' +
        `2016, and the 14 acres the layer still calls Sugar count as 7. Lawn (8): where no crop is, the CAH land cover’s developed open space covers ${pct(F.lawnOpenShare)} of the texel and ` +
        `either the county zones it parks and open space (now-zoning.png class 12) or a golf course lies within ${F.golfRadius} m ` +
        '(scaled by the square root of its holes over 18) of the point the State layer gives it.',
      classes: [1, 5, 6, 7, 8],
      limits:
        'The baseline maps commercial agriculture only (household gardens and small loʻi are not in it). The lawns need two sources ' +
        'to agree, so a park the zoning misses or turf the land cover of about 2010 calls something else is not lawn; the golf ' +
        'courses are points, so a course’s lawn is the open space near its point. Kahoʻolawe and Niʻihau have no zoning and no ' +
        'golf, so no lawn.',
      sources: ['ag2020', 'cah', 'golf', 'holo-zoning', 'holo-layers'],
    },
  }
}

/** Which keyframe serves each era of eras.json: the nearest by year, the coda and anything from 1970 on the present. */
function eraMap() {
  const eras = JSON.parse(readFileSync(join(DATA, 'eras.json'), 'utf8'))
  const out = {}
  for (const era of eras) {
    const y = era.year
    let k = KEYFRAMES[0]
    if (era.id === 'coda' || y >= 1970) k = KEYFRAMES.find((x) => x.id === 'now')
    else for (const x of KEYFRAMES) if (Math.abs(x.year - y) < Math.abs(k.year - y)) k = x
    out[era.id] = { year: y, keyframe: k.id }
  }
  return out
}

/** Check that every ahupuaʻa and moku the record names exists as named. */
function checkPlaces(ahupuaa, moku) {
  const byGis = new Map(ahupuaa.features.map((f) => [f.properties.gisId, f.properties]))
  const mokuKeys = new Set(moku.features.map((f) => f.properties.mokuKey))
  const bad = []
  const visit = (what, x) => {
    for (const [id, name] of x.ahupuaa || []) {
      const p = byGis.get(id)
      if (!p) bad.push(`${what}: no ahupuaʻa ${id}`)
      else if (p.name !== name || p.islandId !== x.island) bad.push(`${what}: ahupuaʻa ${id} is ${p.name} on ${p.islandId}, not ${name} on ${x.island}`)
    }
    for (const k of x.moku || []) {
      if (!mokuKeys.has(k)) bad.push(`${what}: no moku ${k}`)
      else if (!k.startsWith(`${x.island}:`)) bad.push(`${what}: moku ${k} is not on ${x.island}`)
    }
  }
  for (const r of RANCHES_1853) visit(`1853 ranch ${r.name}`, r)
  for (const r of RANCHES_1896) visit(`1896 ranch ${r.name}`, r)
  for (const d of RICE_1896) visit(`rice district ${d.name}`, d)
  visit('Olaʻa coffee', { ...COFFEE_1896.olaa, island: 'hawaii' })
  visit('Kona coffee', { moku: [COFFEE_1896.kona.moku], island: 'hawaii' })
  if (bad.length) throw new Error(`places in lib/crops-history.mjs that the boundary files do not hold:\n  ${bad.join('\n  ')}`)
}

// ---------------------------------------------------------------------------
// --bake

const maskBytes = (file, W, H) => {
  const img = readPNG(join(OUT, file))
  if (img.channels !== 1 || img.width !== W || img.height !== H) throw new Error(`${file}: not a ${W}x${H} greyscale mask`)
  return img.data
}

async function bake(dir) {
  const t0 = Date.now()
  if (!downloaded(dir)) throw new Error(`nothing downloaded in ${dir}; run --download first`)
  const ledger = new Ledger(dir)
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
  const lmPath = join(OUT, 'manifest.json')
  const lm0 = readLayersManifest(lmPath)
  if (!lm0.islands) throw new Error('layers/manifest.json has no islands: run tools/bake-layers.mjs first')
  const ahupuaa = JSON.parse(readFileSync(join(DATA, 'boundaries', 'ahupuaa.geojson'), 'utf8'))
  const moku = JSON.parse(readFileSync(join(DATA, 'boundaries', 'moku.geojson'), 'utf8'))
  checkPlaces(ahupuaa, moku)
  const cahClasses = readCahClasses(dir)
  if (cahClasses[43]?.detailed !== 'Developed open space') throw new Error(`CAH value table: class 43 is "${cahClasses[43]?.detailed}", expected "Developed open space"`)

  log('reading the layers:')
  const src = { ahupuaa, moku, rainFallbackMm: RAIN_FALLBACK_MM }
  for (const key of [...FIELD_KEYS, ...Object.keys(CROP_VECTORS)]) {
    src[key] = readVector(dir, key)
    log(`  ${key}: ${src[key].features.length} features`)
  }
  const packs = manifest.packs.filter((p) => p.kind === 'island')
  if (packs.length !== ISLANDS.length) throw new Error(`manifest has ${packs.length} island packs, expected ${ISLANDS.length}`)
  const contact = KEYFRAMES.find((k) => k.id === 'contact')
  const kingdom = KEYFRAMES.find((k) => k.id === 'kingdom')
  const mahele = KEYFRAMES.find((k) => k.id === 'mahele')
  const tMahele = (mahele.year - contact.year) / (kingdom.year - contact.year)
  const how = methods()

  const islands = {}
  const reports = {}
  for (const pack of packs) {
    const P = readPack(DATA, pack)
    log(`${pack.id}: ${P.W}x${P.H} at ${P.texelMetres.toFixed(1)} m`)
    const e = lm0.islands[pack.id]
    if (!e) throw new Error(`layers/manifest.json has no layers for ${pack.id}: run tools/bake-layers.mjs first`)
    const I = fieldInputs(P, src)
    const cult = {}
    for (const k of KEYFRAMES) cult[k.id] = maskBytes(e.layers[k.id].cultivation.file, P.W, P.H)
    const fc = maskBytes(e.layers.contact.forest.file, P.W, P.H)
    const fk = maskBytes(e.layers.kingdom.forest.file, P.W, P.H)
    const fm = new Uint8Array(P.N)
    for (let o = 0; o < P.N; o++) fm[o] = Math.round(fc[o] + (fk[o] - fc[o]) * tMahele)
    const zf = lm0.zoning?.islands?.[pack.id]?.zoning?.file
    const zoning = zf ? maskBytes(zf, P.W, P.H) : null
    const cah = await sampleCah(layerPaths(dir).cahTif, P.grid, samplesFor(P.texelMetres, 15, 10), { open: { 43: 1 } })
    const X = cropInputs(I, src, { cult, forest: { contact: fc, mahele: fm, kingdom: fk }, zoning }, cah.open)
    const entry = { pack: pack.id, size: pack.size, bounds: pack.bounds, layers: {} }
    // km² as the checks compute them, from the manifest's metres per texel
    const statKm2 = (pack.metresPerTexel[0] * pack.metresPerTexel[1]) / 1e6
    reports[pack.id] = {}
    for (const k of KEYFRAMES) {
      const { classes, report } = cropClasses(I, X, k.id)
      const file = `${pack.id}/${k.id}-crop.png`
      writeGreyPNG(join(OUT, file), P.W, P.H, classes)
      entry.layers[k.id] = { file, method: how[k.id].method, stats: classStats(classes, P.land, statKm2, N_CLASSES) }
      if (Object.keys(report).length) reports[pack.id][k.id] = report
      const km = entry.layers[k.id].stats.km2
      log(`  ${k.id.padEnd(8)} ${Object.entries(km).map(([c, v]) => `${CLASSES[c].key} ${v}`).join(', ') || '(none)'}`)
    }
    if (zoning === null) entry.note = 'no zoning raster for this pack (DATA.md, "Zoning"), so no lawn from parks; no golf course in the State layer here either'
    islands[pack.id] = entry
  }

  // the record as drawn, per pack (packs overlap at Kahoʻolawe and Molokini; each figure is its own island's pack)
  const own = (fn) => {
    const out = {}
    for (const [id, r] of Object.entries(reports)) {
      const v = fn(r, id)
      if (v !== undefined) Object.assign(out, v)
    }
    return out
  }
  const plantDrawn = own((r) => r.mahele?.plantations)
  const r53Drawn = own((r, id) => (r.mahele?.ranches ? Object.fromEntries(Object.entries(r.mahele.ranches).filter(([k]) => RANCHES_1853.find((x) => x.id === k)?.island === id)) : undefined))
  const riceDrawn = own((r, id) => (r.kingdom?.rice ? Object.fromEntries(Object.entries(r.kingdom.rice).filter(([k]) => RICE_1896.find((x) => x.id === k)?.island === id)) : undefined))
  const r96Drawn = {}
  for (const [id, r] of Object.entries(reports)) for (const [names, v] of Object.entries(r.kingdom?.ranches || {})) if (v.island === id) r96Drawn[names] = v
  const coffeeDrawn = reports.hawaii?.kingdom?.coffee
  const riceTotal = Object.values(riceDrawn).reduce((a, d) => a + d.acres, 0)
  const rice1896 = Math.round(RICE_TOTALS[1890] + ((RICE_TOTALS[1900] - RICE_TOTALS[1890]) * 6) / 10)

  const ids = citedIds()
  const keyToId = {}
  const dataSources = {}
  for (const k of [...FIELD_KEYS, ...Object.keys(CROP_VECTORS), 'cah']) {
    const s = sourceOf(ledger, dir, k)
    keyToId[k] = s.id
    dataSources[s.id] = s
  }
  // each keyframe's sources: its data layers by id, then the record it draws on
  const history = {
    mahele: [...PLANTATIONS_1853, ...PLANTATIONS_1853_LEFT_OUT, ...RANCHES_1853, ...RANCHES_1853_LEFT_OUT].flatMap((x) => x.sources).concat([RICE_TOTALS_SOURCE]),
    kingdom: [RANCHES_1896_SOURCE, ...RANCHES_1896.flatMap((r) => r.sources || []), RICE_TOTALS_SOURCE, ...RICE_1896.flatMap((d) => d.sources), ...RICE_LEFT_OUT.flatMap((d) => d.sources), ...COFFEE_1896.kona.sources, ...COFFEE_1896.olaa.sources, 'usgs-topo-1910-kauai', ...WANTED.filter((w) => w !== 'coulter-1931-land-1853' && w !== 'maclennan-1995-maui-plantations')],
  }
  history.mahele.push('coulter-1931-land-1853')
  for (const [k, m] of Object.entries(how)) m.sources = [...new Set([...m.sources.map((x) => keyToId[x] || x), ...(history[k] || [])])]
  const internal = {
    'holo-layers': {
      id: 'holo-layers',
      title: 'The era layers’ own cultivation and forest masks (layers/<island>/<keyframe>-cultivation.png, -forest.png), as tools/bake-layers.mjs baked them',
      url: 'layers/',
      licence: 'this project’s own bake; its sources are in this manifest’s methods',
      note: 'read back from the PNGs, so a class stands where the app sees cultivation; the 1853 forest is interpolated as the app interpolates it',
    },
    'holo-zoning': {
      id: 'holo-zoning',
      title: 'The zoning rasters (layers/<island>/now-zoning.png), as tools/bake-zoning.mjs baked them from each county’s zoning',
      url: 'layers/',
      licence: 'this project’s own bake; the counties’ terms are in this manifest’s zoning.sources',
      note: 'class 12, parks and open space',
    },
    'holo-boundaries': {
      id: 'holo-boundaries',
      title: 'boundaries/moku.geojson and boundaries/ahupuaa.geojson (State GIS layers, as baked by tools/bake.mjs)',
      url: 'boundaries/',
      licence: 'State of Hawaiʻi Statewide GIS Program open data',
      note: 'the ahupuaʻa and moku the ranches, rice districts and coffee lands are bounded by',
    },
  }
  const sizeOf = (f) => statSync(join(OUT, f)).size
  let bytes = 0
  let files = 0
  for (const e of Object.values(islands)) for (const l of Object.values(e.layers)) {
    bytes += sizeOf(l.file)
    files++
  }
  const crops = {
    about:
      'What grows on each land texel at each era keyframe: per island pack and keyframe, an 8-bit greyscale PNG of class ' +
      'numbers with exactly the bounds and size of its pack in ../manifest.json (texel registration as DATA.md has it), 0 over ' +
      'sea. Class numbers are categories: sample them nearest, never filtered, and take the nearest keyframe for an era (eras), ' +
      'never a blend of bytes. A texel with cultivation above 0 and class 0 is drawn as the era’s default; pasture and lawn may ' +
      'stand where the cultivation mask is 0, and so may two classes the cultivation masks leave out (uncultivated). Where a ' +
      'class is modelled rather than mapped, methods says so and writes the rule out.',
    encoding: {
      file: '<island>/<keyframe>-crop.png',
      classes: Object.fromEntries(CLASSES.map((c) => [c.n, c.label])),
      keys: Object.fromEntries(CLASSES.map((c) => [c.n, c.key])),
      uncultivated: UNCULTIVATED_OK,
      sample: 'nearest',
    },
    keyframes: KEYFRAMES.map((k) => k.id),
    eras: eraMap(),
    methods: how,
    record: {
      plantations1853: {
        acresEach: PLANTATION_ACRES_1853,
        plantations: PLANTATIONS_1853.map((p) => ({ ...p, acresDrawn: plantDrawn[p.id]?.acres ?? 0 })),
      },
      ranches1853: RANCHES_1853.map((r) => ({ ...r, ahupuaa: r.ahupuaa.map(([gisId, name]) => ({ gisId, name })), km2Drawn: r53Drawn[r.id]?.km2 ?? 0 })),
      ranches1896: {
        source: RANCHES_1896_SOURCE,
        listedAs: 'List of Principal Stock and Sheep Ranches throughout the Islands, Hawaiian Annual for 1902, p. 42: ranch, character, location as printed',
        ranches: RANCHES_1896.map((r) => ({ ...r, ...(r.ahupuaa ? { ahupuaa: r.ahupuaa.map(([gisId, name]) => ({ gisId, name })) } : {}), grazed: r.grazed || 'alum' })),
        drawn: r96Drawn,
        note: 'ranches sharing bounds are drawn together; km² is pasture drawn in those bounds on their island’s own pack',
      },
      rice1896: {
        totals: { acres: RICE_TOTALS, source: RICE_TOTALS_SOURCE, interpolated1896: rice1896 },
        districts: RICE_1896.map((d) => ({
          ...d,
          ahupuaa: d.ahupuaa?.map(([gisId, name]) => ({ gisId, name })),
          acresDrawn: riceDrawn[d.id]?.acres ?? 0,
          acresOnRule: riceDrawn[d.id]?.candidateAcres ?? 0,
        })),
        acresDrawn: riceTotal,
        note:
          `drawn ${riceTotal} acres against about ${rice1896} for 1896 (interpolated between 1890 and 1900); the rest grew in districts ` +
          'no source read names (leftOut)',
      },
      coffee1896: {
        kona: { ...COFFEE_1896.kona, acresDrawn: coffeeDrawn?.konaAcres ?? 0, readBack: `1978–80 ${ALUM_READ.coffee.join(', ')}` },
        olaa: { ...COFFEE_1896.olaa, ahupuaa: COFFEE_1896.olaa.ahupuaa.map(([gisId, name]) => ({ gisId, name })), acresDrawn: coffeeDrawn?.olaaAcres ?? 0 },
      },
      leftOut: [...PLANTATIONS_1853_LEFT_OUT, ...RANCHES_1853_LEFT_OUT, ...RICE_LEFT_OUT, ...COFFEE_1896.leftOut],
    },
    mapping: {
      now: { field: 'crops_2020', classes: NOW_CLASSES },
      alum: { field: 'commodity', readBack: { pasture: ALUM_READ.grazing, coffee: ALUM_READ.coffee } },
      cah: { open: 43, name: cahClasses[43].detailed },
    },
    rules: { ...CROP_RULES, valleyLoi: RULES.valley },
    sources: { ...dataSources, ...internal, ...historicalSources(ids) },
    islands,
    stats: { files, bytes },
    baked: { tool: 'tools/bake-crops.mjs', packManifest: 'manifest.json', acreKm2: ACRE_KM2, lawn: Object.fromEntries(Object.entries(reports).map(([id, r]) => [id, r.now?.lawn])) },
  }
  // Only the `crops` key of the layers manifest changes; re-read it now so
  // whatever else moved in it meanwhile is kept.
  const lm = readLayersManifest(lmPath)
  lm.crops = crops
  writeFileSync(lmPath, JSON.stringify(lm, null, 2) + '\n')
  log(`wrote ${files} crop rasters (${(bytes / 1024).toFixed(0)} KB) and the crops entry of ${lmPath} (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
  log(`rice drawn ${riceTotal} acres (1896 about ${rice1896}); coffee Kona ${coffeeDrawn?.konaAcres} acres, Olaʻa ${coffeeDrawn?.olaaAcres}`)
}

// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'preview', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-crops.mjs --download | --bake | --check | --preview DIR | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    mkdirSync(args.downloads, { recursive: true })
    log(`downloads: ${args.downloads}`)
    downloadAll(new Ledger(args.downloads), args.downloads, log)
  }
  if (f.has('bake') || f.has('all')) await bake(args.downloads)
  if (f.has('check') || f.has('all')) {
    if (!check({ data: DATA, log })) process.exit(1)
  }
  if (f.has('preview')) preview({ data: DATA, out: resolve(args.preview), log })
  if (f.has('clean') || f.has('all')) {
    if (existsSync(args.downloads)) rmSync(args.downloads, { recursive: true, force: true })
    log(`deleted ${args.downloads}`)
  }
}

main().catch((e) => {
  console.error(e.stack || String(e))
  process.exit(1)
})
