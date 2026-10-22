#!/usr/bin/env node
// Zoning rasters for Holo i ke Au (DATA.md, "Zoning, for the settlements"):
// each county's zoning generalized to a dozen building-form classes, and the
// State Land Use Districts, as class rasters on exactly the island packs'
// grids, so the present-day settlements know where the towers, the business
// district, the resort strip and the industrial land belong.
//
//   node packages/holo-i-ke-au/tools/bake-zoning.mjs --all           download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-zoning.mjs --download      fetch the six zoning, height and district layers (~22 MB, under a minute)
//   node packages/holo-i-ke-au/tools/bake-zoning.mjs --bake          write the rasters and the manifest's `zoning` entry
//   node packages/holo-i-ke-au/tools/bake-zoning.mjs --check         read them back, check them, print the sanity table
//   node packages/holo-i-ke-au/tools/bake-zoning.mjs --preview DIR   tint each island by class over shaded relief, with a legend
//   node packages/holo-i-ke-au/tools/bake-zoning.mjs --clean         delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_ZONING_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/zoning-downloads). Keep it outside the repo.
//
// It reads the island packs that tools/bake.mjs wrote (manifest.json and each
// height.png, for the grid and the land), and writes only
// public/data/layers/<island>/now-zoning.png and lud.png and the top-level
// `zoning` key of public/data/layers/manifest.json, leaving every other key of
// that file as it stands. Like `npm run thumbnails`, a by-hand step whose
// output is committed; nothing here runs at app runtime.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { bboxOf } from './lib/geo.mjs'
import { writeGreyPNG } from './lib/png.mjs'
import { readPack, samplesFor } from './lib/layers-raster.mjs'
import { CLASSES, COUNTIES, LUD, LUD_FROM_YEAR, N_CLASSES, N_LUD, classify, ludOf, rulesText } from './lib/zoning-classes.mjs'
import { MIN_CLASSED, baseFeet, classShares, majority, paint, within } from './lib/zoning-raster.mjs'
import { COUNTY_OF, LAYERS, domainNames, downloadAll, downloaded, layerSource, readVector } from './lib/zoning-sources.mjs'
import { check, preview } from './lib/zoning-check.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')
const OUT = join(DATA, 'layers')
const SAMPLE_METRES = 8

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
  a.downloads = resolve(a.downloads || process.env.HOLO_ZONING_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'zoning-downloads'))
  return a
}

// ---------------------------------------------------------------------------
// --bake

const centreOf = (f) => [(f._bbox[0] + f._bbox[2]) / 2, (f._bbox[1] + f._bbox[3]) / 2]

/**
 * The layers manifest, parsed, provided it is exactly what
 * JSON.stringify(…, null, 2) writes: then setting one key and writing it back
 * leaves every other byte of the file as it was.
 */
function readLayersManifest(path) {
  const text = readFileSync(path, 'utf8')
  const json = JSON.parse(text)
  if (JSON.stringify(json, null, 2) + '\n' !== text) throw new Error(`${path} is not as JSON.stringify(…, null, 2) writes it; refusing to rewrite it`)
  return json
}

/** The packs whose samples are coarser than SAMPLE_METRES, for the rule text: "19 m on Hawaiʻi, whose texels are 150 m". */
function coarse(packs, samples) {
  const out = []
  for (const p of packs) {
    const m = p.metresPerTexel[0] / samples[p.id]
    if (m > SAMPLE_METRES * 1.5) out.push(`${Math.round(m)} m on ${p.name}, whose texels are ${Math.round(p.metresPerTexel[0])} m`)
  }
  return out.length ? out.join('; ') : 'on every pack'
}

/** Where a deferred rule's choice is recorded in the mapping. */
function whenText(rule, cls) {
  if (rule.by === 'lud') {
    const from = Object.entries(rule.classes).filter(([, c]) => c === cls).map(([l]) => LUD[l].label)
    return from.length ? `in the State ${from.join(' or ')} district` : 'outside every State district'
  }
  if (rule.by === 'height') return cls === rule.high ? `height limit ${rule.atLeast} ft or more` : `height limit under ${rule.atLeast} ft, or none mapped`
  return undefined
}

/**
 * One pack's zoning: paint each feature's class label into the samples,
 * settle the deferred rules per sample, take each texel's commonest class.
 * Returns { classes, tally, labels, classed } (classed: land texels with a class).
 */
function zoningRaster(P, s, county, features, ludS, src) {
  const labelIndex = new Map()
  const labels = [null]
  for (const f of features) {
    const c = f._class
    const k = `${c.code}\u0000${c.name}\u0000${typeof c.rule === 'number' ? c.rule : c.rule.by}\u0000${c.when || ''}`
    if (!labelIndex.has(k)) {
      labelIndex.set(k, labels.length)
      labels.push(c)
    }
    f._label = labelIndex.get(k)
  }
  if (labels.length > 65535) throw new Error(`${P.id}: too many class labels`)
  const lab = paint(features, P.grid, s, (f) => f._label, Uint16Array)
  const feet = county === 'honolulu' ? paint(within(src.honoluluHeight.features, P.grid.bounds), P.grid, s, (f) => Math.min(65535, baseFeet(f.properties.height_label)), Uint16Array) : null
  const direct = new Int16Array(labels.length).fill(-1)
  labels.forEach((c, L) => {
    if (c && typeof c.rule === 'number') direct[L] = c.rule
  })
  const classOf = (L, k) => {
    const d = direct[L]
    if (d >= 0) return d
    const r = labels[L].rule
    if (r.by === 'lud') return r.classes[ludS[k]] ?? 0
    return feet && feet[k] >= r.atLeast ? r.high : r.low
  }
  const z = majority(lab, labels.length - 1, classOf, P.grid, s, N_CLASSES, P.land)
  let classed = 0
  for (let o = 0; o < P.N; o++) if (z.classes[o]) classed++
  return { ...z, labels, classed }
}

async function bake(dir) {
  const t0 = Date.now()
  if (!downloaded(dir)) throw new Error(`nothing downloaded in ${dir}; run --download first`)
  const ledger = new Ledger(dir)
  const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
  const lmPath = join(OUT, 'manifest.json')
  readLayersManifest(lmPath)

  log('reading the layers:')
  const src = {}
  for (const key of Object.keys(LAYERS)) {
    src[key] = readVector(dir, key)
    log(`  ${key}: ${src[key].features.length} features`)
  }
  const domain = domainNames(dir, 'maui', 'ZONE_CLASS')

  // Classify every feature up front: an unknown code stops the bake here.
  const unknown = new Set()
  for (const county of Object.keys(COUNTIES)) {
    for (const f of src[county].features) {
      f._bbox = bboxOf(f.geometry)
      const c = classify(county, f.properties, centreOf(f), domain)
      if (c.rule === undefined) unknown.add(`${county}: ${c.code || '(empty)'}`)
      f._class = c
    }
  }
  if (unknown.size) throw new Error(`county classes with no rule in lib/zoning-classes.mjs:\n  ${[...unknown].join('\n  ')}`)
  const badLud = [...new Set(src.slud.features.map((f) => f.properties.ludcode).filter((c) => !ludOf(c)))]
  if (badLud.length) throw new Error(`State Land Use District codes outside U, R, A, C: ${badLud.join(', ')}`)

  const packs = manifest.packs.filter((p) => p.kind === 'island')
  const islands = {}
  const tallies = {} // county -> Map(key -> { code, name, cls, when, km2 })
  const ludTally = new Map()
  const samples = {}
  for (const pack of packs) {
    const P = readPack(DATA, pack)
    const s = samplesFor(P.texelMetres, SAMPLE_METRES, 8)
    samples[pack.id] = s
    const sampleKm2 = P.texelKm2 / (s * s)
    log(`${pack.id}: ${P.W}x${P.H} at ${P.texelMetres.toFixed(1)} m, ${s}x${s} samples a texel`)
    mkdirSync(join(OUT, pack.id), { recursive: true })
    const entry = { pack: pack.id, size: pack.size, bounds: pack.bounds }

    // State Land Use Districts: the sample holds the district's value itself
    const ludFeatures = within(src.slud.features, pack.bounds)
    const ludS = paint(ludFeatures, P.grid, s, (f) => ludOf(f.properties.ludcode), Uint8Array)
    const lud = majority(ludS, N_LUD, (L) => L, P.grid, s, N_LUD, P.land)
    for (let c = 1; c <= N_LUD; c++) ludTally.set(c, (ludTally.get(c) || 0) + lud.tally[c * (N_LUD + 1) + c] * sampleKm2)
    const ludFile = `${pack.id}/lud.png`
    writeGreyPNG(join(OUT, ludFile), P.W, P.H, lud.classes)
    entry.lud = {
      file: ludFile,
      size: pack.size,
      source: LAYERS.slud.id,
      fetched: ledger.get(join(dir, 'vectors', 'slud-layer.json'))?.fetched,
      stats: classShares(lud.classes, P.land, N_LUD),
    }

    // County zoning
    const county = COUNTY_OF[pack.id]
    const features = within(src[county].features, pack.bounds)
    const z = features.length ? zoningRaster(P, s, county, features, ludS, src) : null
    if (!z || z.classed === 0) {
      entry.zoning = null
      entry.zoningNote =
        pack.id === 'kahoolawe'
          ? 'No county zoning: the County of Maui layer maps none on Kahoʻolawe, which the State holds as the Kahoʻolawe Island Reserve. The app falls back to density and value alone.'
          : pack.id === 'niihau'
            ? 'No county zoning: the County of Kauaʻi layer maps none on Niʻihau. The app falls back to density and value alone.'
            : `No features of the ${LAYERS[county].county} layer fall in this pack.`
      rmSync(join(OUT, pack.id, 'now-zoning.png'), { force: true })
      log(`  zoning: none in the ${county} layer here; LUD written`)
      islands[pack.id] = entry
      continue
    }
    const file = `${pack.id}/now-zoning.png`
    writeGreyPNG(join(OUT, file), P.W, P.H, z.classes)
    const T = (tallies[county] ||= new Map())
    z.labels.forEach((c, L) => {
      if (!c) return
      for (let cls = 0; cls <= N_CLASSES; cls++) {
        const n = z.tally[L * (N_CLASSES + 1) + cls]
        if (!n) continue
        const when = typeof c.rule === 'object' ? whenText(c.rule, cls) : c.when
        const key = `${c.code}\u0000${cls}\u0000${when || ''}`
        const e = T.get(key) || { code: c.code, ...(c.name ? { name: c.name } : {}), cls, ...(when ? { when } : {}), km2: 0 }
        e.km2 += n * sampleKm2
        T.set(key, e)
      }
    })
    entry.zoning = {
      file,
      size: pack.size,
      source: LAYERS[county].id,
      mapping: county,
      fetched: ledger.get(join(dir, 'vectors', `${county}-layer.json`))?.fetched,
      ...(county === 'honolulu' ? { alsoReads: [LAYERS.honoluluHeight.id] } : county === 'maui' ? { alsoReads: [LAYERS.slud.id] } : {}),
      stats: classShares(z.classes, P.land, N_CLASSES),
    }
    const top = Object.entries(entry.zoning.stats.share).sort((a, b) => b[1] - a[1]).slice(0, 4)
    log(`  zoning: ${features.length} features, ${z.labels.length - 1} labels; land classed ${(entry.zoning.stats.classed * 100).toFixed(1)}%; ${top.map(([c, v]) => `${CLASSES[c].key} ${(v * 100).toFixed(1)}%`).join(', ')}`)
    islands[pack.id] = entry
  }

  // the mapping, as fed: per county, per class number, the county's own class names and the land they covered
  const mapping = {}
  for (const county of Object.keys(COUNTIES)) {
    const classes = {}
    for (let c = 0; c <= N_CLASSES; c++) classes[c] = []
    for (const e of tallies[county]?.values() || []) {
      const { cls, km2, ...rest } = e
      if (km2 < 0.005) continue
      classes[cls].push({ ...rest, km2: round(km2, 2) })
    }
    for (const c of Object.keys(classes)) {
      classes[c].sort((a, b) => b.km2 - a.km2 || a.code.localeCompare(b.code))
      classes[c] = classes[c].map((e) => `${e.code}${e.name ? ` (${e.name})` : ''}${e.when ? `, ${e.when}` : ''}: ${e.km2} km²`)
      if (!classes[c].length) delete classes[c]
    }
    mapping[county] = {
      layer: LAYERS[county].id,
      classField: LAYERS[county].field,
      classes,
      rules: rulesText(county).filter((r) => r.why),
      note: 'per class number, every class of the county layer that fed it, as "code (name), when a rule chose: km² of pack land it covered" (sampled; under 0.005 km² left out); 0 lists what counts as no class',
    }
  }
  mapping.slud = {
    layer: LAYERS.slud.id,
    classField: LAYERS.slud.field,
    classes: Object.fromEntries(LUD.slice(1).map((l) => [l.n, [`${l.code} (${l.label[0].toUpperCase() + l.label.slice(1)}): ${round(ludTally.get(l.n) || 0, 1)} km²`]])),
  }

  const sources = Object.fromEntries(Object.keys(LAYERS).map((k) => [k, layerSource(ledger, dir, k)]))
  let bytes = 0
  let files = 0
  for (const e of Object.values(islands)) {
    for (const l of [e.zoning, e.lud]) {
      if (!l) continue
      bytes += statSync(join(OUT, l.file)).size
      files++
    }
  }
  const zoning = {
    about:
      'Zoning for the present-day settlements: what kind of building stands where. Per island pack, the county’s zoning ' +
      'generalized to twelve building-form classes (now-zoning.png) and the State Land Use District (lud.png), each an 8-bit ' +
      'greyscale PNG of class numbers with exactly the bounds and size of its pack in ../manifest.json (texel registration as ' +
      'DATA.md has it), 0 over sea. Class numbers are categories, not amounts: sample them nearest, never filtered.',
    encoding: {
      zoning: {
        file: '<island>/now-zoning.png',
        keyframes: ['now'],
        classes: Object.fromEntries(CLASSES.map((c) => [c.n, c.label])),
      },
      lud: {
        file: '<island>/lud.png',
        fromYear: LUD_FROM_YEAR,
        classes: Object.fromEntries(LUD.map((c) => [c.n, c.label])),
        note: 'the State Land Use Law (Act 187, 1961) put every acre in one of four districts; the app applies them to years from 1964 on',
      },
    },
    rule:
      `A texel takes the class covering most of its area: it is split into s × s samples about ${SAMPLE_METRES} m apart ` +
      `(${coarse(packs, samples)}), each sample takes the class of the polygon over its centre, and the ` +
      `commonest class among the samples wins, provided classed samples cover at least ${MIN_CLASSED * 100}% of the texel; ` +
      'otherwise, and wherever the pack is sea, the value is 0. Roads, streams, drainage and land a county marks as not zoned ' +
      'count as no class, so a road through a town takes the town’s class. A pack holds the slivers of neighbours in its box; ' +
      'they are classed by their own county’s layer or left 0.',
    sources,
    mapping,
    islands,
    stats: { files, bytes },
    baked: {
      tool: 'tools/bake-zoning.mjs',
      packManifest: 'manifest.json',
      samplesPerTexelSide: samples,
      minClassed: MIN_CLASSED,
    },
  }

  // Only the `zoning` key of the layers manifest changes; re-read it now so
  // whatever else moved in it meanwhile is kept.
  const lm = readLayersManifest(lmPath)
  lm.zoning = zoning
  writeFileSync(lmPath, JSON.stringify(lm, null, 2) + '\n')
  log(`wrote ${files} rasters (${(bytes / 1024).toFixed(0)} KB) and the zoning entry of ${lmPath} (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
}

// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'preview', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-zoning.mjs --download | --bake | --check | --preview DIR | --clean | --all  [--downloads DIR]')
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
