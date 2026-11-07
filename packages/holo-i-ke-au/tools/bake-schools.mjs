#!/usr/bin/env node
// Schools for Holo i ke Au (DATA.md, "Schools, dated"; ISSUES.md 11): every
// school the record dates and places, from the year it opened to the year it
// closed or moved, as dated landmarks of kind "school".
//
//   node packages/holo-i-ke-au/tools/bake-schools.mjs --all        download, bake, check, delete the downloads (a minute or two)
//   node packages/holo-i-ke-au/tools/bake-schools.mjs --download   the State's three school layers and the OSM grounds the table names (about 1 MB)
//   node packages/holo-i-ke-au/tools/bake-schools.mjs --bake       write public/data/schools.json
//   node packages/holo-i-ke-au/tools/bake-schools.mjs --check      read it back and run tools/check-data.mjs
//   node packages/holo-i-ke-au/tools/bake-schools.mjs --clean      delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_SCHOOLS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/schools-downloads). Keep it outside the repo.
//
// The names, years, kinds, sources and notes are hand-written in
// lib/schools-table.json, one row per placement (a school that moved is a
// row per site, the rows sharing a `group`), each joined to its place by the
// layer's own object id (`at: { layer, key }`) or given its own lon/lat with
// the source it was read from (`at: { lonlat, precision, source, key }`), and
// to its grounds by an OpenStreetMap way or relation id (`footprint`). The
// table also holds the sources it cites (the shape of sources.json's
// entries) and the schools dated but not placed. The bake reads
// public/data/manifest.json for the island packs' bounds and
// boundaries/moku.geojson for the land, and writes only
// public/data/schools.json. A by-hand step whose output is committed, like
// the other bakes; nothing here runs at app runtime.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { Ledger, fetchTo, today } from './lib/fetch.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')
const TABLE = join(HERE, 'lib', 'schools-table.json')
const OUT = join(DATA, 'schools.json')
const BUDGET = 1.2e6 // bytes
const SIMPLIFY_M = 4 // the grounds, simplified to this (metres)
const POINT_IN_GROUNDS_M = 250 // a school's point within this of its grounds

const GIS = 'https://geodata.hawaii.gov/arcgis/rest/services/Infrastructure/MapServer'
const LAYERS = {
  public: { n: 7, id: 'hawaii-gis-public-schools' },
  private: { n: 8, id: 'hawaii-gis-private-schools' },
  post: { n: 27, id: 'hawaii-gis-postsecondary' },
}
const OVERPASS = ['https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass-api.de/api/interpreter']

const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_SCHOOLS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'schools-downloads'))
  return a
}

const table = () => JSON.parse(readFileSync(TABLE, 'utf8'))
const layerFile = (dir, k) => join(dir, `gis-${k}.geojson`)
const osmFile = (dir) => join(dir, 'osm-grounds.json')
const osmIds = (t) => [...new Set(t.rows.map((r) => r.footprint).filter((f) => typeof f === 'string'))].sort()

function download(dir) {
  const L = new Ledger(dir)
  for (const [k, { n }] of Object.entries(LAYERS)) {
    const url = `${GIS}/${n}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=2000`
    const r = fetchTo(L, url, layerFile(dir, k), { maxTime: 300 })
    if (!r.ok) throw new Error(`layer ${n}: HTTP ${r.status}`)
    log(`  ${k} layer ${n}${r.cached ? ' (kept)' : ''}`)
  }
  const ids = osmIds(table())
  const ways = ids.filter((s) => s.startsWith('way/')).map((s) => s.slice(4))
  const rels = ids.filter((s) => s.startsWith('relation/')).map((s) => s.slice(9))
  const q = `[out:json][timeout:200];(${ways.length ? `way(id:${ways.join(',')});` : ''}${rels.length ? `relation(id:${rels.join(',')});` : ''});out geom tags;`
  let ok = false
  for (const base of OVERPASS) {
    try {
      const r = fetchTo(L, `${base}?data=${encodeURIComponent(q)}`, osmFile(dir), { maxTime: 400 })
      if (r.ok) {
        ok = true
        log(`  OSM grounds: ${ways.length} ways, ${rels.length} relations${r.cached ? ' (kept)' : ''} from ${base}`)
        break
      }
    } catch (e) {
      log(`  ${base}: ${e.message}`)
    }
  }
  if (!ok) throw new Error('no Overpass server answered for the grounds; run --download again')
}

// --- geometry -------------------------------------------------------------------

const LAT0 = 20.5
const MX = Math.cos((LAT0 * Math.PI) / 180) * 111320
const MZ = 110574
const metres = ([lon, lat], [lon0, lat0]) => [(lon - lon0) * MX, (lat - lat0) * MZ]

function inRing(ring, [x, y]) {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

function edgeMetres(ring, p) {
  let best = Infinity
  for (let i = 0; i + 1 < ring.length; i++) {
    const a = metres(ring[i], p)
    const b = metres(ring[i + 1], p)
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, -(a[0] * dx + a[1] * dy) / (dx * dx + dy * dy || 1)))
    best = Math.min(best, Math.hypot(a[0] + t * dx, a[1] + t * dy))
  }
  return best
}

/** Douglas–Peucker in metres about the ring's first point; the ring stays closed. */
function simplify(ring, tol) {
  const o = ring[0]
  const P = ring.map((c) => metres(c, o))
  const keep = new Uint8Array(P.length)
  keep[0] = keep[P.length - 1] = 1
  const stack = [[0, P.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    let best = -1
    let at = -1
    for (let i = a + 1; i < b; i++) {
      const [x0, y0] = P[a]
      const [x1, y1] = P[b]
      const dx = x1 - x0
      const dy = y1 - y0
      const L = Math.hypot(dx, dy)
      const d = L < 1e-9 ? Math.hypot(P[i][0] - x0, P[i][1] - y0) : Math.abs(dy * P[i][0] - dx * P[i][1] + x1 * y0 - y1 * x0) / L
      if (d > best) {
        best = d
        at = i
      }
    }
    if (best > tol) {
      keep[at] = 1
      stack.push([a, at], [at, b])
    }
  }
  const out = ring.filter((_, i) => keep[i]).map(([x, y]) => [+x.toFixed(6), +y.toFixed(6)])
  return out.length >= 4 ? out : ring.map(([x, y]) => [+x.toFixed(6), +y.toFixed(6)])
}

function ringArea(ring) {
  const o = ring[0]
  let a = 0
  for (let i = 0; i + 1 < ring.length; i++) {
    const p = metres(ring[i], o)
    const q = metres(ring[i + 1], o)
    a += p[0] * q[1] - q[0] * p[1]
  }
  return Math.abs(a / 2)
}

/** An OSM element's outer ring, closed, [lon, lat]. */
function outerRing(el) {
  let ring = null
  if (el.type === 'way' && el.geometry) ring = el.geometry.map((p) => [p.lon, p.lat])
  else if (el.type === 'relation') {
    const outers = (el.members || []).filter((m) => m.role === 'outer' && m.geometry).map((m) => m.geometry.map((p) => [p.lon, p.lat]))
    // (stitch the outer ways end to end; keep the longest closed ring)
    const rings = []
    let cur = null
    for (const w of outers) {
      if (!cur) cur = w.slice()
      else if (sameAt(cur[cur.length - 1], w[0])) cur.push(...w.slice(1))
      else if (sameAt(cur[cur.length - 1], w[w.length - 1])) cur.push(...w.slice(0, -1).reverse())
      else {
        rings.push(cur)
        cur = w.slice()
      }
      if (cur && sameAt(cur[0], cur[cur.length - 1])) {
        rings.push(cur)
        cur = null
      }
    }
    if (cur) rings.push(cur)
    ring = rings.sort((a, b) => b.length - a.length)[0] || null
  }
  if (!ring || ring.length < 4) return null
  if (!sameAt(ring[0], ring[ring.length - 1])) ring.push(ring[0])
  return ring
}
const sameAt = (a, b) => Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9

// --- the bake -------------------------------------------------------------------

function bake(dir) {
  const T = table()
  const man = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'))
  const packs = new Map(man.packs.filter((p) => p.kind === 'island').map((p) => [p.id, p.bounds]))
  const ledger = new Ledger(dir)
  const layers = {}
  const layerMeta = []
  for (const [k, { n, id }] of Object.entries(LAYERS)) {
    const f = layerFile(dir, k)
    if (!existsSync(f)) throw new Error(`no ${f}: run --download`)
    const fc = JSON.parse(readFileSync(f, 'utf8'))
    layers[k] = new Map(fc.features.map((q) => [q.properties.objectid, q]))
    layerMeta.push({ id, layer: `${GIS}/${n}`, fetched: ledger.get(f)?.fetched ?? today(), features: fc.features.length })
  }
  const osm = new Map()
  if (existsSync(osmFile(dir))) for (const el of JSON.parse(readFileSync(osmFile(dir), 'utf8')).elements || []) osm.set(`${el.type}/${el.id}`, el)
  const problems = []
  const features = []
  for (const r of T.rows) {
    let pt = null
    let precision = 'exact'
    let layer
    if (r.at?.layer) {
      const q = layers[r.at.layer]?.get(r.at.key)
      if (!q) {
        problems.push(`${r.id}: no ${r.at.layer} feature ${r.at.key}`)
        continue
      }
      pt = q.geometry.coordinates.map((v) => +v.toFixed(6))
      layer = { source: LAYERS[r.at.layer].id, key: `objectid ${r.at.key}` }
    } else if (Array.isArray(r.at?.lonlat)) {
      pt = r.at.lonlat
      precision = r.at.precision || 'inferred'
      layer = { source: r.at.source, key: r.at.key }
    } else {
      problems.push(`${r.id}: no place`)
      continue
    }
    const b = packs.get(r.island)
    if (!b || pt[0] < b[0] || pt[0] > b[2] || pt[1] < b[1] || pt[1] > b[3]) problems.push(`${r.id}: its point lies outside the ${r.island} pack`)
    let geometry = { type: 'Point', coordinates: pt }
    let grounds = null
    if (typeof r.footprint === 'string') {
      const el = osm.get(r.footprint)
      const ring = el && outerRing(el)
      if (!ring) problems.push(`${r.id}: no grounds ${r.footprint} in the OSM download`)
      else {
        const inside = inRing(ring, pt)
        const d = inside ? 0 : edgeMetres(ring, pt)
        if (d > POINT_IN_GROUNDS_M) problems.push(`${r.id}: its point is ${Math.round(d)} m from its grounds ${r.footprint}`)
        else {
          const s = simplify(ring, SIMPLIFY_M)
          // (wound counter-clockwise, as RFC 7946 wants an outer ring)
          let signed = 0
          for (let k = 0; k + 1 < s.length; k++) signed += s[k][0] * s[k + 1][1] - s[k + 1][0] * s[k][1]
          if (signed < 0) s.reverse()
          geometry = { type: 'Polygon', coordinates: [s] }
          grounds = { source: 'openstreetmap-grounds', key: r.footprint, area: Math.round(ringArea(s)) }
        }
      }
    }
    const p = {
      id: r.id,
      kind: 'school',
      name: r.name,
      ...(r.label ? { label: r.label } : {}),
      ...(r.alt ? { alt: r.alt } : {}),
      type: r.type,
      ...(r.opened_as ? { opened_as: r.opened_as } : {}),
      island: r.island,
      at: pt,
      from: r.from,
      to: r.to ?? null,
      datePrecision: r.datePrecision,
      ...(r.by ? { by: r.by } : {}),
      precision,
      ...(r.group ? { group: r.group } : {}),
      ...(r.grades ? { grades: r.grades } : {}),
      ...(r.pupils ? { pupils: r.pupils } : {}),
      ...(r.look ? { look: r.look } : {}),
      layer,
      ...(grounds ? { grounds } : {}),
      sources: r.sources,
      ...(r.note ? { note: r.note } : {}),
    }
    features.push({ type: 'Feature', properties: p, geometry })
  }
  if (problems.length) {
    for (const m of problems) console.error(`  ${m}`)
    throw new Error(`${problems.length} rows did not join; nothing written`)
  }
  features.sort((a, b) => a.properties.island.localeCompare(b.properties.island) || a.properties.from - b.properties.from || a.properties.id.localeCompare(b.properties.id))
  const stats = {}
  for (const f of features) {
    const p = f.properties
    const s = (stats[p.island] ??= { schools: 0, grounds: 0, standing: 0, by: 0, types: {} })
    s.schools++
    if (f.geometry.type === 'Polygon') s.grounds++
    if (p.to === null) s.standing++
    if (p.datePrecision === 'by') s.by++
    s.types[p.type] = (s.types[p.type] || 0) + 1
  }
  const out = {
    type: 'FeatureCollection',
    about: 'The schools of the islands, each from the year it opened to the year it closed or moved (DATA.md “Schools, dated”). A school that moved is a feature per site, sharing a group. Baked by tools/bake-schools.mjs from tools/lib/schools-table.json.',
    baked: today(),
    tolerance: SIMPLIFY_M,
    layers: [
      ...layerMeta,
      { id: 'openstreetmap-grounds', layer: 'OpenStreetMap ways and relations tagged amenity=school, college or university, by id, through the Overpass API', licence: 'ODbL 1.0, © OpenStreetMap contributors', fetched: ledger.get(osmFile(dir))?.fetched ?? today(), features: osm.size },
    ],
    sources: T.sources,
    unplaced: T.unplaced,
    stats,
    features,
  }
  const text = JSON.stringify(out) + '\n'
  if (text.length > BUDGET) throw new Error(`schools.json would be ${(text.length / 1e6).toFixed(2)} MB, over the ${BUDGET / 1e6} MB budget`)
  writeFileSync(OUT, text)
  log(`  wrote ${OUT}: ${features.length} schools, ${(text.length / 1024).toFixed(0)} KB, ${T.unplaced.length} dated but not placed`)
  for (const [k, s] of Object.entries(stats)) log(`    ${k.padEnd(8)} ${String(s.schools).padStart(3)} (${s.grounds} with grounds, ${s.standing} standing, ${s.by} dated by a record) ${JSON.stringify(s.types)}`)
}

function check() {
  const r = spawnSync(process.execPath, [join(HERE, 'check-data.mjs')], { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status || 1)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-schools.mjs --download | --bake | --check | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    log(`download → ${args.downloads}`)
    download(args.downloads)
  }
  if (f.has('bake') || f.has('all')) {
    log('bake')
    bake(args.downloads)
  }
  if (f.has('check') || f.has('all')) check()
  if (f.has('clean') || f.has('all')) rmSync(args.downloads, { recursive: true, force: true })
}

main()
