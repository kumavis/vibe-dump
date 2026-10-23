// The works bake (DATA.md, "Works, dated"): joins the hand-written dates
// table (works-dates.mjs) to the geometry of the open layers and the traced
// lines (works-traced.mjs), simplifies to about 10 m, splits by island pack,
// and writes public/data/works/<island>.geojson and works/manifest.json.
// Nothing else under public/data is touched.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Ledger } from './fetch.mjs'
import { standardName } from './geo.mjs'
import {
  areaOf, bboxOfCoords, carve, edgeDistance, inPolygon, ringArea, clipLineToBox, clipPolygonToBox, joinLines, lengthOf, linesOf, polygonsOf,
  rectangleAxis, roundGeometry, simplifyLine, simplifyPolygon, union, wind, xy,
} from './works-geom.mjs'
import { LAYERS, layerSource, readLayer } from './works-sources.mjs'
import { KINDS, ABOUT, WORKS, BLOCKS, BLOCK_BASES } from './works-dates.mjs'
import { BLOCK_SHEETS, OSM_SOURCE, datesBySheets, readBuildings, useOf } from './works-osm.mjs'
import { TRACED, ZONES } from './works-traced.mjs'

export const TOLERANCE_METRES = 10
export const BUDGET_BYTES = 1.5e6
const FEET = 0.3048
const LANE_METRES = 3.6

/** Lazily read layers from the downloads; `land` is the moku polygons of public/data/boundaries. */
function layerCache(dir, data) {
  const cache = new Map()
  return (key) => {
    if (!cache.has(key)) {
      if (key === 'land') cache.set(key, JSON.parse(readFileSync(join(data, 'boundaries', 'moku.geojson'), 'utf8')).features.map((f) => f.geometry))
      else cache.set(key, readLayer(dir, key))
    }
    return cache.get(key)
  }
}

const asList = (v) => (Array.isArray(v) ? v : [v])

/** The geometry an entry's `geom` describes, before simplification. Returns { geometry, precision, layer }. */
function resolve(entry, layer) {
  const g = entry.geom
  if (!g) throw new Error(`${entry.id}: no geom`)
  // a layer's own features, by its key field
  if (g.layer) {
    const L = LAYERS[g.layer]
    const keys = asList(g.key)
    const feats = layer(g.layer).filter((f) => keys.includes(f.properties[L.key]))
    const found = new Set(feats.map((f) => f.properties[L.key]))
    const missing = keys.filter((k) => !found.has(k))
    if (missing.length) throw new Error(`${entry.id}: ${g.layer} has no feature with ${L.key} ${missing.map((m) => `“${m}”`).join(', ')}`)
    let geoms = feats.map((f) => f.geometry)
    // a line layer (the county's road centrelines): its features joined end to end
    if (geoms.every((x) => /LineString/.test(x.type))) {
      if (g.within || g.outside) throw new Error(`${entry.id}: zones carve polygons, not lines`)
      return { lines: joinLines(geoms.flatMap(linesOf), 25), precision: 'exact', layer: { source: L.id, key: keys.length === 1 ? keys[0] : keys } }
    }
    const polys = geoms.every((x) => /Polygon/.test(x.type))
    if (!polys) throw new Error(`${entry.id}: ${g.layer} gives ${geoms[0].type}, not polygons`)
    let geometry
    if (g.within || g.outside) {
      geometry = carve(geoms, { within: asList(g.within || []).map(zone), outside: asList(g.outside || []).map(zone) })
    } else if (geoms.length > 1) geometry = union(geoms)
    else geometry = geoms[0]
    return {
      geometry,
      precision: g.within || g.outside ? 'mapped' : 'exact',
      layer: { source: L.id, key: keys.length === 1 ? keys[0] : keys, ...(g.within ? { within: g.within } : {}), ...(g.outside ? { outside: g.outside } : {}) },
    }
  }
  // a runway from the FAA, as its centreline
  if (g.runway) {
    const ap = layer('faaAirports').find((f) => f.properties.IDENT === g.runway.airport)
    if (!ap) throw new Error(`${entry.id}: no FAA airport ${g.runway.airport}`)
    const rw = layer('faaRunways').find((f) => f.properties.AIRPORT_ID === ap.properties.GLOBAL_ID && f.properties.DESIGNATOR === g.runway.designator)
    if (!rw) throw new Error(`${entry.id}: no runway ${g.runway.designator} at ${g.runway.airport}`)
    const ax = rectangleAxis(rw.geometry)
    const unit = rw.properties.DIM_UOM === 'M' ? 1 : FEET
    return {
      geometry: { type: 'LineString', coordinates: ax.line },
      precision: 'exact',
      width: Math.round(rw.properties.WIDTH * unit),
      layer: { source: LAYERS.faaRunways.id, key: `${g.runway.airport} ${g.runway.designator}` },
    }
  }
  // a State route from the HPMS centrelines, by route and milepost or name
  if (g.route) {
    const r = g.route
    const segs = layer('hpms').filter((f) => {
      const p = f.properties
      if (p.route_id !== r.id) return false
      if (r.island && p.island !== r.island) return false
      if (r.names && !r.names.includes(p.route_name)) return false
      if (r.mp && !(p.bmp >= r.mp[0] - 0.005 && p.emp <= r.mp[1] + 0.005)) return false
      return true
    })
    if (!segs.length) throw new Error(`${entry.id}: no HPMS segment for route ${r.id}${r.mp ? ` mileposts ${r.mp}` : ''}`)
    const pieces = segs.flatMap((f) => linesOf(f.geometry))
    const joined = joinLines(pieces, 25)
    const lanes = mode(segs.map((f) => f.properties.through_lanes).filter((v) => v > 0))
    return {
      lines: joined,
      precision: 'exact',
      lanes,
      layer: { source: LAYERS.hpms.id, key: `${r.id}${r.mp ? ` mp ${r.mp[0]}–${r.mp[1]}` : ''}${r.names ? ` (${r.names.join(', ')})` : ''}` },
    }
  }
  // charted shoreline construction over a harbour
  if (g.enc) {
    const e = g.enc
    const feats = layer('encLines').filter((f) => {
      const p = f.properties
      if (p.harbour !== e.harbour || p.scale !== e.scale || !asList(e.catslc).includes(p.CATSLC)) return false
      if (e.name && p.OBJNAM !== e.name) return false
      const b = bboxOfCoords(f.geometry)
      const c = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]
      return !e.box || (c[0] >= e.box[0] && c[0] <= e.box[2] && c[1] >= e.box[1] && c[1] <= e.box[3])
    })
    if (!feats.length) throw new Error(`${entry.id}: no charted ${e.catslc} at ${e.scale} scale over ${e.harbour}${e.box ? ' in its box' : ''}`)
    let lines = feats.flatMap((f) => linesOf(f.geometry))
    if (!lines.length) lines = feats.flatMap((f) => polygonsOf(f.geometry).map((p) => rectangleAxis({ type: 'Polygon', coordinates: p }).line))
    return { lines: joinLines(lines, 20), precision: 'exact', layer: { source: LAYERS.encLines.id, key: `${e.harbour} ${e.scale} ${asList(e.catslc).join("/")}${e.name ? ` “${e.name}”` : ""}` } }
  }
  // a hand-drawn zone with the land taken away (the moku polygons): a harbour's waters
  if (g.zone) {
    if (!g.minusLand) throw new Error(`${entry.id}: a zone alone is a carving tool, not a shape`)
    const geometry = carve([zone(g.zone)], { outside: layer('land') }, 6)
    return { geometry, precision: 'inferred', layer: { source: 'traced', key: g.zone, sheet: ZONES[g.zone].sheet, minus: 'boundaries/moku.geojson' } }
  }
  // traced by hand from a sheet
  if (g.traced) {
    const t = TRACED[g.traced]
    if (!t) throw new Error(`${entry.id}: no traced shape ${g.traced}`)
    const geometry = t.type === 'Polygon' ? wind({ type: 'Polygon', coordinates: [close(t.coordinates)] }) : { type: 'LineString', coordinates: t.coordinates }
    return { geometry, precision: t.precision || 'mapped', width: t.width, layer: { source: 'traced', key: g.traced, sheet: t.sheet } }
  }
  throw new Error(`${entry.id}: geom ${JSON.stringify(g)} is not understood`)
}

const close = (r) => (r[0][0] === r.at(-1)[0] && r[0][1] === r.at(-1)[1] ? r : [...r, r[0]])

function zone(id) {
  const z = ZONES[id]
  if (!z) throw new Error(`no zone ${id}`)
  return { type: 'Polygon', coordinates: [close(z.coordinates)] }
}

function mode(vals) {
  const m = new Map()
  for (const v of vals) m.set(v, (m.get(v) || 0) + 1)
  let best = null
  let n = 0
  for (const [v, c] of m) if (c > n || (c === n && v > best)) [best, n] = [v, c]
  return best
}

/** Cut a line where two portals fall on it (each portal projected onto its nearest segment): [before, inside, after]. */
function cutAt(line, a, b) {
  const near = (p) => {
    const [px, pz] = xy(p)
    let best = { s: 0, t: 0, d: Infinity }
    for (let s = 0; s + 1 < line.length; s++) {
      const [x0, z0] = xy(line[s])
      const [x1, z1] = xy(line[s + 1])
      const L2 = (x1 - x0) ** 2 + (z1 - z0) ** 2
      const t = L2 ? Math.max(0, Math.min(1, ((px - x0) * (x1 - x0) + (pz - z0) * (z1 - z0)) / L2)) : 0
      const d = Math.hypot(x0 + t * (x1 - x0) - px, z0 + t * (z1 - z0) - pz)
      if (d < best.d) best = { s, t, d }
    }
    const [c0, c1] = [line[best.s], line[best.s + 1]]
    return { ...best, at: best.s + best.t, pt: [c0[0] + best.t * (c1[0] - c0[0]), c0[1] + best.t * (c1[1] - c0[1])] }
  }
  let i = near(a)
  let j = near(b)
  if (i.at > j.at) [i, j] = [j, i]
  const before = [...line.slice(0, i.s + 1), i.pt]
  const inside = [i.pt, ...line.slice(i.s + 1, j.s + 1), j.pt]
  const after = [j.pt, ...line.slice(j.s + 1)]
  const clean = (l) => l.filter((c, k) => k === 0 || c[0] !== l[k - 1][0] || c[1] !== l[k - 1][1])
  return { before: clean(before), inside: clean(inside), after: clean(after), miss: Math.max(i.d, j.d) }
}

/** The pack whose bounds hold the most of a geometry's bounding box. */
function packFor(geometry, packs, entry) {
  if (entry.island) return packs.find((p) => p.id === entry.island)
  const [w, s, e, n] = bboxOfCoords(geometry)
  let best = null
  let ba = 0
  for (const p of packs) {
    const [pw, ps, pe, pn] = p.bounds
    const a = Math.max(0, Math.min(e, pe) - Math.max(w, pw)) * Math.max(0, Math.min(n, pn) - Math.max(s, ps))
    const pt = (e - w) * (n - s) === 0 && w >= pw && e <= pe && s >= ps && n <= pn
    if (a > ba || (pt && !best)) [best, ba] = [p, a || 1]
  }
  return best
}

const ORDER = ['military', 'airport', 'highway', 'rail', 'harbour']

/** Feature properties in the contract's order. */
function properties(entry, extra) {
  const p = {
    id: extra.id,
    kind: entry.kind,
    part: entry.part,
    group: entry.group,
    name: standardName(entry.name),
    ...(entry.alt?.length ? { alt: entry.alt.map(standardName) } : {}),
    owner: entry.owner,
    from: entry.from,
    to: entry.to ?? null,
    ...(entry.built ? { built: entry.built } : {}),
    datePrecision: entry.datePrecision,
    ...(entry.by ? { by: entry.by } : {}),
    precision: entry.precision || extra.precision,
    ...(extra.width ? { width: extra.width } : {}),
    ...(entry.class ? { class: entry.class } : {}),
    ...(extra.lanes ? { lanes: extra.lanes } : {}),
    ...(entry.storeys ? { storeys: entry.storeys } : {}),
    ...(entry.use ? { use: entry.use } : {}),
    sources: entry.sources,
    note: entry.note,
    layer: extra.layer,
  }
  return p
}

/** Turn one table entry into its features (a route or a breakwater may give several pieces). */
function featuresOf(entry, layer, packs) {
  const r = resolve(entry, layer)
  const out = []
  const isLine = ['runway', 'pier', 'breakwater', 'road', 'tunnel', 'line'].includes(entry.part)
  if (!isLine) {
    let geom = simplifyPolygon(r.geometry, TOLERANCE_METRES, entry.minArea ?? 400)
    if (!polygonsOf(geom).length) throw new Error(`${entry.id}: nothing left after simplifying`)
    const pack = packFor(geom, packs, entry)
    if (!pack) throw new Error(`${entry.id}: lies in no island pack`)
    const clipped = clipPolygonToBox(geom, pack.bounds)
    if (!clipped) throw new Error(`${entry.id}: nothing inside the ${pack.id} pack`)
    out.push({ pack: pack.id, feature: { type: 'Feature', properties: properties(entry, { id: entry.id, precision: r.precision, layer: r.layer }), geometry: roundGeometry(clipped) } })
    return out
  }
  let lines = r.lines || linesOf(r.geometry)
  lines = lines.map((l) => simplifyLine(l, TOLERANCE_METRES)).filter((l) => lengthOf(l) >= (entry.minLength ?? 30))
  if (entry.keep === 'longest') lines = [lines.reduce((m, l) => (lengthOf(l) > lengthOf(m) ? l : m))]
  const width = entry.width ?? r.width ?? (r.lanes ? Math.round(r.lanes * LANE_METRES + 2) : undefined)
  if (!width) throw new Error(`${entry.id}: a ${entry.part} needs a width`)
  const pieces = []
  for (const l of lines) {
    // tunnels: cut the road at each tunnel's portals
    let rest = [l]
    for (const t of entry.tunnels || []) {
      const next = []
      for (const seg of rest) {
        const c = cutAt(seg, ...t.portals)
        if (c.miss > 150 || c.inside.length < 2) {
          next.push(seg)
          continue
        }
        if (c.before.length >= 2) next.push(c.before)
        pieces.push({ line: c.inside, tunnel: t })
        if (c.after.length >= 2) next.push(c.after)
        t.found = true
      }
      rest = next
    }
    for (const seg of rest) pieces.push({ line: seg })
  }
  for (const t of entry.tunnels || []) if (!t.found) throw new Error(`${entry.id}: tunnel ${t.id} not found on the line`)
  let k = 0
  for (const pc of pieces) {
    const g = { type: 'LineString', coordinates: pc.line }
    const pack = packFor(g, packs, entry)
    if (!pack) throw new Error(`${entry.id}: lies in no island pack`)
    for (const part of clipLineToBox(pc.line, pack.bounds)) {
      if (pc.tunnel) {
        const t = pc.tunnel
        const te = { ...entry, alt: undefined, built: undefined, ...t, part: 'tunnel', kind: entry.kind, group: entry.group, owner: t.owner || entry.owner, sources: t.sources || entry.sources }
        out.push({ pack: pack.id, feature: { type: 'Feature', properties: properties(te, { id: t.id, precision: t.precision || r.precision, layer: r.layer, width, lanes: r.lanes }), geometry: roundGeometry({ type: 'LineString', coordinates: part }) } })
      } else {
        k++
        const id = k === 1 ? entry.id : `${entry.id}-${k}`
        out.push({ pack: pack.id, feature: { type: 'Feature', properties: properties(entry, { id, precision: r.precision, layer: r.layer, width, lanes: r.lanes }), geometry: roundGeometry({ type: 'LineString', coordinates: part }) } })
      }
    }
  }
  return out
}


// ---------------------------------------------------------------------------
// Blocks (works-dates.mjs BLOCKS): OSM footprints on a base's land, dated by the sheets

const BLOCK_TOLERANCE = 5 // metres
const BLOCK_EDGE = 20 // a footprint's corners may stand this far outside its land (the land is simplified to 10 m)

const yearOwner = (table, y) => table.reduce((o, [from, who]) => (y >= from ? who : o), table[0][1])

function blocksOf(B, lands, dir, ledger) {
  const base = BLOCK_BASES[B.base]
  const lands0 = B.within.map((id) => {
    const f = lands.get(id)
    if (!f) throw new Error(`blocks ${B.id}: no land ${id}`)
    return f
  })
  const inLand = (f, c) => inPolygon(f.geometry, c) || edgeDistance(f.geometry, c) <= BLOCK_EDGE
  const mapYear = Number((ledger.get(join(dir, 'osm', `${B.base}-00.xml`))?.fetched || '').slice(0, 4))
  const found = []
  const all = readBuildings(dir, B.base)
  for (const b of all) {
    const ring = b.ring
    const cx = ring.slice(0, -1).reduce((s, p) => s + p[0], 0) / (ring.length - 1)
    const cy = ring.slice(0, -1).reduce((s, p) => s + p[1], 0) / (ring.length - 1)
    // every land of the table that holds it: their years bound the block's
    const held = lands0.filter((f) => inPolygon(f.geometry, [cx, cy]))
    if (!held.length || !ring.every((c) => held.some((f) => inLand(f, c)))) continue
    held.sort((a, b) => a.properties.from - b.properties.from)
    found.push({ b, held, area: Math.abs(ringArea(ring)) })
  }
  found.sort((a, b) => b.area - a.area || (a.b.id < b.b.id ? -1 : 1))
  // the sheets are registered on the base box's three hundred largest buildings
  const register = all.map((b) => [Math.abs(ringArea(b.ring)), b.ring]).sort((a, b) => b[0] - a[0]).slice(0, 300).map((x) => x[1])
  const pool = found.slice(0, B.max * 2)
  const { verdicts, shifts } = datesBySheets(dir, B.base, base.box, base.sheets, pool.map((c) => c.b.ring), register)
  const out = []
  for (const [i, { b, held }] of pool.entries()) {
    if (out.length >= B.max) break
    const g = simplifyPolygon({ type: 'Polygon', coordinates: [b.ring] }, BLOCK_TOLERANCE)
    if (!polygonsOf(g).length) continue
    const sheet = verdicts[i]
    const special = i === 0 && B.largest
    const landFrom = held[0].properties.from
    const landTo = held.some((f) => f.properties.to === null) ? null : Math.max(...held.map((f) => f.properties.to))
    const seen = sheet ? BLOCK_SHEETS[sheet].year : mapYear
    // standing by a sheet's year on land taken later: it is the military's from the taking
    const taken = !special && seen < landFrom
    const from = special?.from ?? Math.max(seen, landFrom)
    if (landTo !== null && from > landTo) continue // first seen after the land was given up: not the military's
    const kind = b.tags.building
    const levels = Number.parseInt(b.tags['building:levels'], 10)
    const storeys = Number.isInteger(levels) && levels > 0 ? levels : kind === 'hangar' ? 1 : undefined
    const what = kind === 'hangar' ? 'hangar' : /^(barracks|dormitory)$/.test(kind) ? 'barracks' : 'building'
    const owners = B.ownersWithin?.[held[0].properties.id] || B.owners
    const entry = {
      kind: 'military',
      part: 'block',
      group: held[0].properties.group,
      name: special?.name || `${B.name} ${what}`,
      alt: special?.alt,
      owner: yearOwner(owners, from),
      from,
      to: landTo,
      datePrecision: special?.datePrecision || (taken ? 'year' : 'by'),
      by: special || taken ? undefined : sheet || OSM_SOURCE.id,
      storeys,
      use: useOf(b.tags),
      sources: [OSM_SOURCE.id, ...(sheet && !special ? [sheet] : []), ...B.sources],
      note: special?.note || B.note,
    }
    const id = `${B.id}-block-${String(out.length + 1).padStart(3, '0')}`
    out.push({ type: 'Feature', properties: properties(entry, { id, precision: 'exact', layer: { source: OSM_SOURCE.id, key: b.id } }), geometry: roundGeometry(g) })
  }
  return { features: out, shifts }
}

export function bakeWorks({ dir, data, log }) {
  const ledger = new Ledger(dir)
  const manifest = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const packs = manifest.packs.filter((p) => p.kind === 'island')
  const layer = layerCache(dir, data)
  const byPack = {}
  const problems = []
  for (const entry of WORKS) {
    try {
      for (const { pack, feature } of featuresOf(entry, layer, packs)) (byPack[pack] ||= []).push(feature)
    } catch (e) {
      problems.push(e.message)
    }
  }
  // the blocks stand on the land just baked
  const lands = new Map()
  const packOf = new Map()
  for (const [pack, feats] of Object.entries(byPack)) {
    for (const f of feats) {
      if (f.properties.part !== 'land') continue
      lands.set(f.properties.id, f)
      packOf.set(f.properties.id, pack)
    }
  }
  let blockCount = 0
  if (!problems.length) {
    for (const B of BLOCKS) {
      try {
        const { features: feats, shifts } = blocksOf(B, lands, dir, ledger)
        for (const f of feats) (byPack[packOf.get(B.within[0])] ||= []).push(f)
        blockCount += feats.length
        const years = {}
        for (const f of feats) years[f.properties.from] = (years[f.properties.from] || 0) + 1
        log(`  blocks ${B.id}: ${feats.length} (${Object.entries(years).map(([y, n]) => `${y} ${n}`).join(', ')}); sheets shifted ${Object.entries(shifts).map(([k, v]) => `${k} ${v.join('/')} m`).join(', ')}`)
      } catch (e) {
        problems.push(e.message)
      }
    }
  }
  if (problems.length) throw new Error(`the works table does not bake:\n  ${problems.join('\n  ')}`)
  const out = join(data, 'works')
  if (existsSync(out)) for (const f of readdirSync(out)) rmSync(join(out, f))
  mkdirSync(out, { recursive: true })
  const files = []
  const stats = {}
  for (const p of packs) {
    const feats = byPack[p.id]
    if (!feats?.length) continue
    feats.sort((a, b) => ORDER.indexOf(a.properties.kind) - ORDER.indexOf(b.properties.kind) || a.properties.group.localeCompare(b.properties.group) || a.properties.from - b.properties.from || a.properties.id.localeCompare(b.properties.id))
    const file = `${p.id}.geojson`
    writeFileSync(join(out, file), JSON.stringify({ type: 'FeatureCollection', island: p.id, features: feats }) + '\n')
    files.push(file)
    stats[p.id] = {}
    for (const k of ORDER) {
      const n = feats.filter((f) => f.properties.kind === k).length
      if (n) stats[p.id][k] = n
    }
    for (const part of ['block', 'range']) {
      const n = feats.filter((f) => f.properties.part === part).length
      if (n) stats[p.id][`${part}s`] = n
    }
    stats[p.id].datedBy = feats.filter((f) => f.properties.datePrecision === 'by').length
    stats[p.id].bytes = JSON.stringify({ type: 'FeatureCollection', island: p.id, features: feats }).length + 1
    log(`  ${file}: ${feats.length} features (${Object.entries(stats[p.id]).filter(([k]) => ORDER.includes(k)).map(([k, v]) => `${k} ${v}`).join(', ')}), ${(stats[p.id].bytes / 1024).toFixed(0)} KB`)
  }
  const used = new Set()
  for (const feats of Object.values(byPack)) for (const f of feats) if (f.properties.layer.source !== 'traced') used.add(f.properties.layer.source)
  const sources = Object.keys(LAYERS).filter((k) => used.has(LAYERS[k].id)).map((k) => layerSource(ledger, dir, k))
  if (blockCount) sources.push({ ...OSM_SOURCE, fetched: ledger.get(join(dir, 'osm', `${BLOCKS[0].base}-00.xml`))?.fetched, boxes: BLOCK_BASES })
  const traced = [...new Set(Object.values(byPack).flat().filter((f) => f.properties.layer.source === 'traced').map((f) => f.properties.layer.sheet))].sort()
  const m = {
    about: ABOUT,
    baked: new Date().toISOString().slice(0, 10),
    tolerance: TOLERANCE_METRES,
    files,
    kinds: KINDS,
    sources,
    tracedFrom: traced,
    stats,
  }
  writeFileSync(join(out, 'manifest.json'), JSON.stringify(m, null, 1) + '\n')
  const bytes = readdirSync(out).reduce((s, f) => s + readFileSync(join(out, f)).length, 0)
  log(`  works/: ${files.length} files and the manifest, ${(bytes / 1024).toFixed(0)} KB (budget ${(BUDGET_BYTES / 1024).toFixed(0)} KB)`)
  if (bytes > BUDGET_BYTES) throw new Error(`works/ is ${bytes} bytes, over the ${BUDGET_BYTES} budget`)
  return m
}
