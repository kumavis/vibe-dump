#!/usr/bin/env node
// Named buildings for Holo i ke Au (DATA.md "Landmarks, dated"): each at its
// footprint from the year it was finished to the year it went, so the town's
// lots yield to it in those years.
//
//   node packages/holo-i-ke-au/tools/bake-landmarks.mjs --all        download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-landmarks.mjs --download   fetch each footprint from the OSM API (a call every 1.5 s)
//   node packages/holo-i-ke-au/tools/bake-landmarks.mjs --bake       write public/data/landmarks.json
//   node packages/holo-i-ke-au/tools/bake-landmarks.mjs --check      run tools/check-data.mjs (which reads landmarks.json back)
//   node packages/holo-i-ke-au/tools/bake-landmarks.mjs --clean      delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_LANDMARKS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/landmarks-downloads). Keep it outside the repo.
//
// The names, dates and sources are hand-written in lib/landmarks-table.mjs;
// the footprints are OpenStreetMap's, fetched by element id, or drawn from
// another entry's where a source places a building but no outline was read.
// Like `npm run thumbnails`, a by-hand step whose output is committed.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { Ledger, fetchTo, sleep, today } from './lib/fetch.mjs'
import { LANDMARKS, TYPES } from './lib/landmarks-table.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')
const OUT = join(DATA, 'landmarks.json')
const OSM_API = 'https://api.openstreetmap.org/api/0.6'
const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_LANDMARKS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'landmarks-downloads'))
  return a
}

/** The OSM elements an entry's footprint is made of. */
const refsOf = (L) => (L.geom.osm ? [L.geom.osm].flat() : [])
const fileOf = (dir, ref) => join(dir, `${ref.replace('/', '-')}.json`)
const urlOf = (ref) => (ref.startsWith('node/') ? `${OSM_API}/${ref}.json` : `${OSM_API}/${ref}/full.json`)

function download(dir) {
  const ledger = new Ledger(dir)
  for (const L of LANDMARKS) {
    for (const ref of refsOf(L)) {
      const r = fetchTo(ledger, urlOf(ref), fileOf(dir, ref), { maxTime: 120 })
      if (!r.ok) throw new Error(`${L.id}: HTTP ${r.status} for ${urlOf(ref)}`)
      log(`  ${L.id}: ${ref}${r.cached ? ' (kept)' : ''}`)
      if (!r.cached) sleep(1500)
    }
  }
}

// --- geometry -----------------------------------------------------------------

const KX = (lat) => 111320 * Math.cos((lat * Math.PI) / 180)
const KY = 110574
/** A ring's principal axes in metres about its centroid: centre [lon, lat], turn (radians, east toward north), length and width. */
function axes(ring) {
  const lat0 = ring[0][1]
  const kx = KX(lat0)
  const pts = ring.slice(0, -1).map(([x, y]) => [x * kx, y * KY])
  let cx = 0
  let cy = 0
  for (const [x, y] of pts) {
    cx += x / pts.length
    cy += y / pts.length
  }
  // (the turn that boxes the ring tightest, to a degree: a footprint's own walls, not its vertices' spread)
  let best = null
  for (let d = 0; d < 180; d++) {
    const th = (d * Math.PI) / 180
    const ux = [Math.cos(th), Math.sin(th)]
    let u0 = Infinity
    let u1 = -Infinity
    let v0 = Infinity
    let v1 = -Infinity
    for (const [x, y] of pts) {
      const u = (x - cx) * ux[0] + (y - cy) * ux[1]
      const v = -(x - cx) * ux[1] + (y - cy) * ux[0]
      u0 = Math.min(u0, u)
      u1 = Math.max(u1, u)
      v0 = Math.min(v0, v)
      v1 = Math.max(v1, v)
    }
    const area = (u1 - u0) * (v1 - v0)
    if (!best || area < best.area) best = { area, th, u0, u1, v0, v1 }
  }
  let { th, u0, u1, v0, v1 } = best
  if (v1 - v0 > u1 - u0) {
    // (its length along the long side)
    ;[u0, u1, v0, v1] = [v0, v1, -u1, -u0]
    th += Math.PI / 2
  }
  const mu = (u0 + u1) / 2
  const mv = (v0 + v1) / 2
  const x = cx + mu * Math.cos(th) - mv * Math.sin(th)
  const y = cy + mu * Math.sin(th) + mv * Math.cos(th)
  return { centre: [x / kx, y / KY], turn: th, L: u1 - u0, W: v1 - v0 }
}

/** A box of L × W metres turned by `turn` about [lon, lat], as a closed ring. */
function boxRing([lon, lat], turn, L, W) {
  const kx = KX(lat)
  const c = Math.cos(turn)
  const s = Math.sin(turn)
  const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]].map(([u, v]) => {
    const dx = (u * L) / 2
    const dy = (v * W) / 2
    return [lon + (dx * c - dy * s) / kx, lat + (dx * s + dy * c) / KY]
  })
  return ring
}

const round = (v) => Math.round(v * 1e7) / 1e7
const roundRing = (r) => r.map(([x, y]) => [round(x), round(y)])

/** The footprint of an OSM element as GeoJSON, from its downloaded JSON. */
function osmGeometry(dir, ref, size) {
  const j = JSON.parse(readFileSync(fileOf(dir, ref), 'utf8'))
  const nodes = new Map()
  const ways = new Map()
  let rel = null
  for (const e of j.elements) {
    if (e.type === 'node') nodes.set(e.id, [e.lon, e.lat])
    else if (e.type === 'way') ways.set(e.id, e.nodes)
    else if (e.type === 'relation') rel = e
  }
  const [type, id] = ref.split('/')
  if (type === 'node') {
    if (!size) throw new Error(`${ref}: a point needs a size`)
    return { type: 'Polygon', coordinates: [roundRing(boxRing(nodes.get(Number(id)), 0, size[0], size[1]))] }
  }
  const ringOf = (wid) => {
    const r = ways.get(wid).map((n) => nodes.get(n))
    if (r.some((p) => !p)) throw new Error(`${ref}: way ${wid} lacks a node`)
    return roundRing(r)
  }
  if (type === 'way') return { type: 'Polygon', coordinates: [ringOf(Number(id))] }
  // a relation: its outer ways, each closed on its own (the barracks' wall is mapped so)
  const outers = rel.members.filter((m) => m.type === 'way' && m.role === 'outer').map((m) => ringOf(m.ref))
  if (outers.some((r) => r[0][0] !== r.at(-1)[0] || r[0][1] !== r.at(-1)[1])) throw new Error(`${ref}: an outer way is not closed`)
  return outers.length === 1 ? { type: 'Polygon', coordinates: [outers[0]] } : { type: 'MultiPolygon', coordinates: outers.map((r) => [r]) }
}

const outerRings = (g) => (g.type === 'Polygon' ? [g.coordinates[0]] : g.coordinates.map((p) => p[0]))

function bake(dir) {
  const byId = new Map(LANDMARKS.map((L) => [L.id, L]))
  const geoms = new Map()
  const ledger = new Ledger(dir)
  const geomOf = (L) => {
    if (geoms.has(L.id)) return geoms.get(L.id)
    let g
    if (Array.isArray(L.geom.osm)) g = { type: 'MultiPolygon', coordinates: L.geom.osm.flatMap((ref) => outerRings(osmGeometry(dir, ref, L.geom.size)).map((r) => [r])) }
    else if (L.geom.osm) g = osmGeometry(dir, L.geom.osm, L.geom.size)
    else if (L.geom.like) {
      const other = byId.get(L.geom.like)
      if (!other) throw new Error(`${L.id}: like “${L.geom.like}” is not an entry`)
      const a = axes(outerRings(geomOf(other)).sort((p, q) => q.length - p.length)[0])
      const [Lm, Wm] = L.geom.size ?? [a.L * L.geom.along, a.W]
      g = { type: 'Polygon', coordinates: [roundRing(boxRing(a.centre, a.turn, Lm, Wm))] }
    } else throw new Error(`${L.id}: no geom`)
    geoms.set(L.id, g)
    return g
  }
  const features = []
  for (const L of LANDMARKS) {
    if (!TYPES.includes(L.type)) throw new Error(`${L.id}: type ${L.type} is not ${TYPES.join(' | ')}`)
    const g = geomOf(L)
    const { geom, ...p } = L
    const layer = geom.osm ? { source: 'osm-landmark-footprints', key: [geom.osm].flat().join(' ') } : { source: 'inferred', from: geom.like }
    const precision = geom.osm ? ([geom.osm].flat()[0].startsWith('node/') ? 'mapped' : 'exact') : 'inferred'
    features.push({ type: 'Feature', geometry: g, properties: { ...p, island: p.island ?? 'oahu', precision, layer } })
  }
  const fetched = [...new Set(LANDMARKS.flatMap(refsOf).map((ref) => ledger.get(fileOf(dir, ref))?.fetched).filter(Boolean))].sort()
  const out = {
    about: 'Named buildings, each at its footprint from the year it stood finished to the year it went (DATA.md “Landmarks, dated”); written by tools/bake-landmarks.mjs from tools/lib/landmarks-table.mjs.',
    baked: today(),
    types: TYPES,
    sources: [
      {
        id: 'osm-landmark-footprints',
        title: 'OpenStreetMap building outlines, by element id from the OSM API (api.openstreetmap.org/api/0.6)',
        url: 'https://www.openstreetmap.org/',
        licence: 'Open Database License (ODbL) 1.0; © OpenStreetMap contributors, https://www.openstreetmap.org/copyright',
        fetched: fetched.at(-1) ?? null,
      },
    ],
    type: 'FeatureCollection',
    features,
  }
  writeFileSync(OUT, JSON.stringify(out) + '\n')
  log(`  wrote ${OUT} (${features.length} buildings, ${(readFileSync(OUT).length / 1024).toFixed(1)} KB)`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-landmarks.mjs --download | --bake | --check | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    log(`downloads: ${args.downloads}`)
    download(args.downloads)
  }
  if (f.has('bake') || f.has('all')) {
    if (!existsSync(args.downloads)) throw new Error(`no downloads at ${args.downloads}: run --download first`)
    log('landmarks:')
    bake(args.downloads)
  }
  if (f.has('check') || f.has('all')) {
    const r = spawnSync(process.execPath, [join(HERE, 'check-data.mjs')], { stdio: 'inherit' })
    if (r.status !== 0) process.exit(1)
  }
  if (f.has('clean') || f.has('all')) {
    rmSync(args.downloads, { recursive: true, force: true })
    log(`deleted ${args.downloads}`)
  }
}

main().catch((e) => {
  console.error(e.stack || String(e))
  process.exit(1)
})
