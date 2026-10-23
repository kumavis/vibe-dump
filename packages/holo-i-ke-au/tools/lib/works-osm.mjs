// Buildings for the works' blocks (DATA.md, "Works, dated"): OpenStreetMap's
// building footprints over each base, fetched from the OSM API's map call in
// tiles of at most 0.02° (the Overpass API and the regional extracts refused
// this session), and the State's georeferenced sheets exported over the same
// boxes, so the bake can date each footprint by the first sheet that draws a
// building on it.
//
// Downloads are untrusted data: the XML is read with a few regular
// expressions into plain numbers and strings, and nothing in it is executed.
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo, sleep } from './fetch.mjs'
import { readPNG } from './png.mjs'

export const OSM_API = 'https://api.openstreetmap.org/api/0.6/map'
export const OSM_SOURCE = {
  id: 'osm-buildings',
  title: 'OpenStreetMap building footprints, from the OSM API map call (api.openstreetmap.org/api/0.6/map) over each base',
  url: 'https://www.openstreetmap.org/',
  licence: 'Open Database License (ODbL) 1.0; © OpenStreetMap contributors, https://www.openstreetmap.org/copyright',
  note: 'closed ways tagged building, with building:levels where mapped; the buildings standing when they were mapped, dated by the sheets',
}

/** The sheets the blocks are dated by, oldest first: the year each stands for, how far (m) it is searched for its registration, its image service. */
export const BLOCK_SHEETS = {
  'state-gis-oahu-1943': { year: 1943, search: 45, service: 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/Oahu_1943/ImageServer' },
  'usgs-topo-2000-oahu': { year: 2000, search: 20, tinted: true, service: 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/USGS_topos_2000/ImageServer' },
}
export const SHEET_DEG = 0.00002 // the sheets are exported at about 2 m a pixel
const NEAR = 20 // metres round a footprint in which a sheet must show the ground built up

const TILE = 0.02
const tiles = ([w, s, e, n]) => {
  const out = []
  for (let x = w; x < e - 1e-9; x += TILE) for (let y = s; y < n - 1e-9; y += TILE) out.push([x, y, Math.min(e, x + TILE), Math.min(n, y + TILE)])
  return out
}
const osmFile = (dir, base, i) => join(dir, 'osm', `${base}-${String(i).padStart(2, '0')}.xml`)
const sheetFile = (dir, base, sheet) => join(dir, 'sheets', `${base}-${sheet}.png`)

/** The extent and size of a sheet export over a box, on the grid the bake reads it back with. */
export function sheetGrid([w, s, e, n]) {
  const W = Math.round((e - w) / SHEET_DEG)
  const H = Math.round((n - s) / SHEET_DEG)
  return { w, n, W, H }
}

/** Fetch the OSM tiles and the sheet exports for every base in the table. */
export function downloadBlocks(ledger, dir, blocks, log) {
  mkdirSync(join(dir, 'osm'), { recursive: true })
  mkdirSync(join(dir, 'sheets'), { recursive: true })
  let n = 0
  for (const b of blocks) {
    tiles(b.box).forEach((t, i) => {
      const url = `${OSM_API}?bbox=${t.map((v) => v.toFixed(5)).join(',')}`
      const r = fetchTo(ledger, url, osmFile(dir, b.base, i), { force: true, maxTime: 300 })
      if (!r.ok) throw new Error(`OSM ${b.base} tile ${i}: HTTP ${r.status}`)
      n++
      sleep(1500) // the API's usage policy: a few calls, spaced
    })
    for (const sheet of b.sheets) {
      const { W, H } = sheetGrid(b.box)
      const [w, s, e, n2] = b.box
      const e2 = w + W * SHEET_DEG
      const s2 = n2 - H * SHEET_DEG
      const url = `${BLOCK_SHEETS[sheet].service}/exportImage?bbox=${w},${s2},${e2},${n2}&bboxSR=4326&imageSR=4326&size=${W},${H}&format=png&f=image`
      const r = fetchTo(ledger, url, sheetFile(dir, b.base, sheet), { force: true, maxTime: 300 })
      if (!r.ok) throw new Error(`sheet ${sheet} over ${b.base}: HTTP ${r.status}`)
    }
  }
  log(`  osm: ${n} tiles over ${blocks.length} bases, and the sheets over each`)
}

/** Every building of a base's tiles: { id, tags, ring } with ring as closed [lon, lat] positions. */
export function readBuildings(dir, base) {
  const nodes = new Map()
  const ways = new Map()
  for (let i = 0; existsSync(osmFile(dir, base, i)); i++) {
    const xml = readFileSync(osmFile(dir, base, i), 'utf8')
    for (const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="(-?[\d.]+)" lon="(-?[\d.]+)"/g)) nodes.set(m[1], [Number(m[3]), Number(m[2])])
    for (const m of xml.matchAll(/<way id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g)) {
      if (ways.has(m[1])) continue
      const refs = [...m[2].matchAll(/<nd ref="(\d+)"/g)].map((r) => r[1])
      const tags = Object.fromEntries([...m[2].matchAll(/<tag k="([^"]*)" v="([^"]*)"/g)].map((t) => [t[1], t[2]]))
      ways.set(m[1], { refs, tags })
    }
  }
  if (!ways.size) throw new Error(`osm ${base}: not downloaded (run --download)`)
  const out = []
  for (const [id, w] of ways) {
    if (!w.tags.building || w.tags.building === 'no') continue
    if (w.refs.length < 4 || w.refs[0] !== w.refs.at(-1)) continue
    const ring = w.refs.map((r) => nodes.get(r))
    if (ring.some((p) => !p)) continue
    out.push({ id: `way/${id}`, tags: w.tags, ring })
  }
  return out
}

/**
 * The sheets' verdict on a base's footprints: for each, the first sheet (oldest
 * first) that shows the ground built up where it stands — within NEAR metres of
 * the footprint, at least 15% of the sheet drawn in building black (the sheets
 * draw a building as a dark shape), or, on a sheet that tints built-up ground
 * and draws only some buildings inside the tint (the 2000 sheet), half of it in
 * black or the tint. The sheets sit some tens of metres off today's
 * map, so each is first registered to the footprints by the shift, within its
 * `search` radius, that makes them stand out most (the footprints' darkness
 * less that of the ground round them, summed). `register` are the rings used
 * for that (all the base's mapped buildings of any size), `rings` those judged.
 * Returns { verdicts: [sheet id or null per ring], shifts: { sheet: [east m, north m] } }.
 */
export function datesBySheets(dir, base, box, sheets, rings, register) {
  const g = sheetGrid(box)
  const kx = 111320 * Math.cos((21 * Math.PI) / 180)
  const m = (v) => v / kx / SHEET_DEG
  // inside: the footprint grown by 3 m; round: the band 8–16 m outside it; each thinned to at most 200 pixels
  const sample = (ring) => {
    const px = ring.map(([lon, lat]) => [(lon - g.w) / SHEET_DEG, (g.n - lat) / SHEET_DEG])
    const pad = m(Math.max(16, NEAR))
    const x0 = Math.floor(Math.min(...px.map((p) => p[0])) - pad)
    const x1 = Math.ceil(Math.max(...px.map((p) => p[0])) + pad)
    const y0 = Math.floor(Math.min(...px.map((p) => p[1])) - pad)
    const y1 = Math.ceil(Math.max(...px.map((p) => p[1])) + pad)
    const inside = []
    const round = []
    const near = []
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const ins = inRing(px, x + 0.5, y + 0.5)
        const d = ins ? 0 : edge(px, x + 0.5, y + 0.5)
        if (ins || d <= m(3)) inside.push([x, y])
        else if (d >= m(8) && d <= m(16)) round.push([x, y])
        if (ins || d <= m(NEAR)) near.push([x, y])
      }
    }
    const thin = (a) => a.filter((_, i) => i % Math.max(1, Math.ceil(a.length / 200)) === 0)
    return { inside: thin(inside), round: thin(round), near: thin(near) }
  }
  const judged = rings.map(sample)
  const reg = register.map(sample)
  const verdicts = rings.map(() => null)
  const shifts = {}
  for (const sheet of sheets) {
    const im = loadSheet(dir, base, sheet)
    if (!im) continue
    const darkAt = (x, y) => (x < 0 || y < 0 || x >= im.W || y >= im.H ? 0 : im.lum[y * im.W + x] < 0.35 ? 1 : 0)
    const frac = (pts, dx, dy) => (pts.length ? pts.reduce((s, [x, y]) => s + darkAt(x + dx, y + dy), 0) / pts.length : 0)
    const stand = (s, dx, dy) => frac(s.inside, dx, dy) - frac(s.round, dx, dy)
    const score = (dx, dy) => reg.reduce((t, s) => t + stand(s, dx, dy), 0)
    const R = Math.ceil(m(BLOCK_SHEETS[sheet].search))
    let best = [0, 0]
    let bs = -Infinity
    for (let dy = -R; dy <= R; dy += 2) for (let dx = -R; dx <= R; dx += 2) {
      const sc = score(dx, dy)
      if (sc > bs) [bs, best] = [sc, [dx, dy]]
    }
    const [bx, by] = best
    for (let dy = by - 1; dy <= by + 1; dy++) for (let dx = bx - 1; dx <= bx + 1; dx++) {
      const sc = score(dx, dy)
      if (sc > bs) [bs, best] = [sc, [dx, dy]]
    }
    // the shift moves the footprints onto the sheet: east is +x, north is −y
    shifts[sheet] = [Math.round(best[0] * SHEET_DEG * kx), Math.round(-best[1] * SHEET_DEG * 110700)]
    const ok = (x, y) => x >= 0 && y >= 0 && x < im.W && y < im.H
    const black = (x, y) => (ok(x, y) && im.lum[y * im.W + x] < 0.35 ? 1 : 0)
    const tinted = (x, y) => (ok(x, y) && im.tint[y * im.W + x] ? 1 : 0)
    judged.forEach((s, i) => {
      if (verdicts[i] !== null || s.near.length < 4) return
      const b = s.near.reduce((t, [x, y]) => t + black(x + best[0], y + best[1]), 0) / s.near.length
      const t = BLOCK_SHEETS[sheet].tinted ? s.near.reduce((u, [x, y]) => u + tinted(x + best[0], y + best[1]), 0) / s.near.length : 0
      if (b >= 0.15 || b + t >= 0.5) verdicts[i] = sheet
    })
  }
  return { verdicts, shifts }
}

const cache = new Map()
function loadSheet(dir, base, sheet) {
  const k = `${base}/${sheet}`
  if (!cache.has(k)) {
    const f = sheetFile(dir, base, sheet)
    if (!existsSync(f)) cache.set(k, null)
    else {
      const im = readPNG(f)
      const lum = new Float32Array(im.width * im.height)
      const tint = new Uint8Array(im.width * im.height)
      for (let i = 0; i < lum.length; i++) {
        const c = im.channels
        const a = c === 4 ? im.data[i * c + 3] / 255 : c === 2 ? im.data[i * c + 1] / 255 : 1
        const r = c >= 3 ? im.data[i * c] : im.data[i * c]
        const gr = c >= 3 ? im.data[i * c + 1] : im.data[i * c]
        const b = c >= 3 ? im.data[i * c + 2] : im.data[i * c]
        lum[i] = a < 0.5 ? 1 : (0.3 * r + 0.59 * gr + 0.11 * b) / 255
        tint[i] = a >= 0.5 && Math.max(r, gr, b) - Math.min(r, gr, b) < 14 && lum[i] > 0.66 && lum[i] < 0.86 ? 1 : 0
      }
      cache.set(k, { W: im.width, H: im.height, lum, tint })
    }
  }
  return cache.get(k)
}

function inRing(r, x, y) {
  let c = false
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i]
    const [xj, yj] = r[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}
function edge(r, x, y) {
  let best = Infinity
  for (let i = 1; i < r.length; i++) {
    const [ax, ay] = r[i - 1]
    const [bx, by] = r[i]
    const L2 = (bx - ax) ** 2 + (by - ay) ** 2
    const t = L2 ? Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / L2)) : 0
    best = Math.min(best, Math.hypot(ax + t * (bx - ax) - x, ay + t * (by - ay) - y))
  }
  return best
}
