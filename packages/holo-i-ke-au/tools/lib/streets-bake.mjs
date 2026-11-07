// The streets bake (DATA.md, "Streets, dated"): each of today's street
// segments in a town, looked for on each dated sheet over the town, and
// dated by the oldest sheet that draws it.
//
// How a street is looked for. Each sheet is read as ink and paper: a pixel
// darker than INK of the sheet's paper (its 80th percentile of brightness
// over the tile) is ink, and a pixel the service holds no sheet for is not
// read at all. A segment is cut into pieces of about PIECE metres and each
// piece sampled every pixel along it, short of the crossings at its ends
// (where a drawn street's lines break for the street across). A street drawn
// on a sheet, whatever its symbol (two lines, a filled band, a single line),
// is ink in a line along the piece at some offset from it within OFFSET
// metres, and paper along it at some offset within OPEN metres: so a piece
// is found where, at some offset, at least LINE of its samples are ink (or
// within a pixel of ink, so a line drawn a pixel off still counts), and at
// some other, at least CLEAR of them are paper. Open paper with no line
// fails the first; a solid block of buildings, or hachures, or lettering,
// fail one or the other.
//
// How a sheet is registered. The State GIS georeferenced the sheets as a
// whole; over a town an old one can be a few hundred metres off, and the
// datum of the older surveys is not today's. So each sheet is moved over the
// town by the shift that finds the most of today's streets on it (a search
// of SEARCH metres by 20 m, then 5 m and a pixel, over a sample of the pieces), and then over
// each CELL of the town by the shift within REFINE of that which finds the
// most there, where the cell has enough pieces to say (MIN_CELL), else by the
// town's. The shift found is written into the manifest for each sheet.
//
// How a street is dated. A piece is found or not on each sheet that covers
// it; it is dated by the oldest sheet that finds it, provided at least half
// the later sheets that cover it find it too, and, for an old sheet, that
// another old sheet finds it too where two or more cover it (so a line on an old sheet that
// no later sheet bears out does not date a street). A segment is dated by
// the year by which half its dated length is dated, where at least DATED of
// its length is dated at all (a piece no sheet finds, under a label or a
// symbol, says nothing either way); one that falls short of that is dated by
// the centreline layer itself (the year it was drawn up). Every date is a
// `by`: the street was there by then, and the sheet before (`after`) did not
// draw it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { inflateSync } from 'node:zlib'
import { writePNG } from './png.mjs'
import { CENTRELINES, SHEET_PIXEL, TOWNS, centrelineSource, sheetGrid, townPaths, townSheets } from './streets-sources.mjs'
import { placeMap, registeredPaths, warpTile } from './streets-registered.mjs'

const PIECE = 80
// (dark enough that the contours, printed brown, are not ink: a subdivision on a
// hillside follows them; a sheet may set its own, as the grey scan of 1927 does)
const INK = 0.65
const END_TRIM = 7
const OFFSET = 15
const OPEN = 10
const LINE = 0.62
const CLEAR = 0.6
// the Government Survey's island maps, at about 1:60,000, draw their streets
// small, among hachures, stippled reefs and lettering, on georeferencing a
// few hundred metres loose: a street is found on one only where its line is
// unbroken without the pixel's grace, and (where two or more of them cover
// it) on another of them too
const OLD = { line: 0.75, clear: 0.65 }
// a registered map's texture: ink over this share of a patch TEXTURE_R pixels either way (untexture)
const TEXTURE = 0.22
const TEXTURE_R = 20
// a segment is dated by its sheets when at least this share of its length is found on one
const DATED = 0.3
const SEARCH = { old: 300, new: 80 }
// what a move to the edge of a search costs, in found pieces per piece searched
const MOVE = 0.05
const REFINE = { old: 75, new: 20 }
const CELL = 1200
const MIN_CELL = 40
const SIMPLIFY = 2
const KY = 110574
const KX = (lat) => Math.cos((lat * Math.PI) / 180) * 111320
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d

// --- reading the sheets -------------------------------------------------------------

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

/** Any 8-bit non-interlaced PNG (grey, RGB, palette, grey+alpha, RGBA) as RGBA bytes. */
export function readAnyPNG(path) {
  const buf = readFileSync(path)
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error(`${path}: not a PNG`)
  let off = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let ct = -1
  let interlace = 0
  let plte = null
  let trns = null
  const idat = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString('latin1', off + 4, off + 8)
    const body = buf.subarray(off + 8, off + 8 + len)
    if (type === 'IHDR') {
      width = body.readUInt32BE(0)
      height = body.readUInt32BE(4)
      bitDepth = body[8]
      ct = body[9]
      interlace = body[12]
    } else if (type === 'PLTE') plte = body
    else if (type === 'tRNS') trns = body
    else if (type === 'IDAT') idat.push(body)
    else if (type === 'IEND') break
    off += 12 + len
  }
  if (interlace) throw new Error(`${path}: interlaced`)
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ct]
  if (!ch) throw new Error(`${path}: colour type ${ct}`)
  if (bitDepth !== 8 && !(ct === 3 && [1, 2, 4].includes(bitDepth))) throw new Error(`${path}: bit depth ${bitDepth}`)
  const raw = inflateSync(Buffer.concat(idat))
  const bpp = ct === 3 ? 1 : ch
  const stride = ct === 3 ? Math.ceil((width * bitDepth) / 8) : width * ch
  const data = new Uint8Array(stride * height)
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    const row = data.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : null
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? row[i - bpp] : 0
      const b = prev ? prev[i] : 0
      const c = prev && i >= bpp ? prev[i - bpp] : 0
      const p = f === 0 ? 0 : f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : paeth(a, b, c)
      row[i] = (src[i] + p) & 255
    }
  }
  const out = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4
      let r
      let g
      let b
      let al = 255
      if (ct === 3) {
        const bit = x * bitDepth
        const byte = data[y * stride + (bit >> 3)]
        const idx = bitDepth === 8 ? byte : (byte >> (8 - bitDepth - (bit & 7))) & ((1 << bitDepth) - 1)
        r = plte[idx * 3]
        g = plte[idx * 3 + 1]
        b = plte[idx * 3 + 2]
        if (trns && idx < trns.length) al = trns[idx]
      } else {
        const s = y * stride + x * ch
        if (ch <= 2) r = g = b = data[s]
        else {
          r = data[s]
          g = data[s + 1]
          b = data[s + 2]
        }
        if (ch === 2) al = data[s + 1]
        if (ch === 4) al = data[s + 3]
      }
      out[o] = r
      out[o + 1] = g
      out[o + 2] = b
      out[o + 3] = al
    }
  }
  return { width, height, rgba: out }
}

/** A tile of a sheet read quadrangle by quadrangle: each pixel from the quadrangle whose neat line holds it, none outside them all. */
function readQuads(p, sheet, t, k) {
  const imgs = sheet.quads.map((q) => ({ q, img: readAnyPNG(p.sheet(sheet.year, k, q.lock)) }))
  const rgba = new Uint8Array(t.w * t.h * 4)
  const [w, s, e, n] = t.bounds
  for (let y = 0; y < t.h; y++) {
    const lat = n - ((y + 0.5) / t.h) * (n - s)
    for (let x = 0; x < t.w; x++) {
      const lon = w + ((x + 0.5) / t.w) * (e - w)
      const hit = imgs.find(({ q }) => lon >= q.neat[0] && lon < q.neat[2] && lat >= q.neat[1] && lat < q.neat[3])
      if (!hit) continue
      const o = (y * t.w + x) * 4
      rgba.set(hit.img.rgba.subarray(o, o + 4), o)
    }
  }
  return { width: t.w, height: t.h, rgba }
}

/**
 * A sheet over the town's grid as 0 (no sheet), 1 (paper) and 2 (ink), and
 * a copy of its brightness for the drawings.
 */
function readSheet(dir, town, sheet, grid) {
  const p = townPaths(dir, town)
  const ink = new Uint8Array(grid.W * grid.H)
  const lum = new Uint8Array(grid.W * grid.H)
  grid.tiles.forEach((t, k) => {
    const img = sheet.registered ? warpTile(sheet.scan, sheet.registered, sheet.place, t) : sheet.quads ? readQuads(p, sheet, t, k) : readAnyPNG(p.sheet(sheet.year, k))
    if (img.width !== t.w || img.height !== t.h) throw new Error(`${town.id} ${sheet.year} tile ${k}: ${img.width}×${img.height}, wanted ${t.w}×${t.h}`)
    const n = t.w * t.h
    const L = new Uint8Array(n)
    const hist = new Uint32Array(256)
    let covered = 0
    for (let i = 0; i < n; i++) {
      const o = i * 4
      const v = Math.round(0.299 * img.rgba[o] + 0.587 * img.rgba[o + 1] + 0.114 * img.rgba[o + 2])
      L[i] = v
      // (no sheet: transparent, or the services' pure black fill)
      if (img.rgba[o + 3] < 128 || (img.rgba[o] === 0 && img.rgba[o + 1] === 0 && img.rgba[o + 2] === 0 && sheet.blackIsNone)) continue
      hist[v]++
      covered++
    }
    let acc = 0
    let paper = 255
    for (let v = 0; v < 256; v++) {
      acc += hist[v]
      if (acc >= covered * 0.8) {
        paper = v
        break
      }
    }
    const cut = paper * (sheet.ink ?? INK)
    for (let y = 0; y < t.h; y++) {
      for (let x = 0; x < t.w; x++) {
        const i = y * t.w + x
        const g = (t.y + y) * grid.W + t.x + x
        lum[g] = L[i]
        if (img.rgba[i * 4 + 3] < 128) continue
        ink[g] = L[i] < cut ? 2 : 1
      }
    }
  })
  // (a registered map's textures, hachured slopes above all, read as no sheet: a street up a slope runs with its hachures)
  if (sheet.registered) untexture(ink, grid)
  // ink within a pixel (a cross), for the line test: a drawn line a pixel off the piece's own line still counts
  // (not on an old sheet, whose own line is the test)
  const th = sheet.old ? OLD : { line: LINE, clear: CLEAR }
  const near = new Uint8Array(grid.W * grid.H)
  if (sheet.old) {
    for (let i = 0; i < near.length; i++) near[i] = ink[i] === 2 ? 1 : 0
    return { ink, lum, near, th }
  }
  for (let y = 1; y < grid.H - 1; y++) {
    for (let x = 1; x < grid.W - 1; x++) {
      const i = y * grid.W + x
      near[i] = ink[i] === 2 || ink[i - 1] === 2 || ink[i + 1] === 2 || ink[i - grid.W] === 2 || ink[i + grid.W] === 2 ? 1 : 0
    }
  }
  return { ink, lum, near, th }
}

/**
 * Where a sheet's ink is denser than TEXTURE over a patch TEXTURE_R pixels
 * either way, the sheet is read as not there (0): a street's two lines, or
 * a block's buildings, are well under it, hachures and stipple over it.
 */
function untexture(ink, grid) {
  const { W, H } = grid
  const R = TEXTURE_R
  const sat = new Float64Array((W + 1) * (H + 1))
  for (let y = 0; y < H; y++) {
    let row = 0
    for (let x = 0; x < W; x++) {
      row += ink[y * W + x] === 2 ? 1 : 0
      sat[(y + 1) * (W + 1) + x + 1] = sat[y * (W + 1) + x + 1] + row
    }
  }
  for (let y = 0; y < H; y++) {
    const y0 = Math.max(0, y - R)
    const y1 = Math.min(H, y + R + 1)
    for (let x = 0; x < W; x++) {
      if (!ink[y * W + x]) continue
      const x0 = Math.max(0, x - R)
      const x1 = Math.min(W, x + R + 1)
      const n = sat[y1 * (W + 1) + x1] - sat[y0 * (W + 1) + x1] - sat[y1 * (W + 1) + x0] + sat[y0 * (W + 1) + x0]
      if (n / ((x1 - x0) * (y1 - y0)) > TEXTURE) ink[y * W + x] = 0
    }
  }
}

// --- the streets ---------------------------------------------------------------------

/** Today's segments in the town (their middle in its box), in sheet pixels, with their pieces. */
export function readSegments(dir, town, grid) {
  const L = CENTRELINES[town.island]
  const p = townPaths(dir, town)
  const [w, s, e, n] = town.bounds
  const kx = KX(grid.lat) / SHEET_PIXEL
  const ky = KY / SHEET_PIXEL
  const toPx = ([lon, lat]) => [(lon - grid.bounds[0]) * kx, (grid.bounds[3] - lat) * ky]
  const segs = []
  const seen = new Set()
  for (let page = 0; existsSync(p.centrelines(page)); page++) {
    const fc = JSON.parse(readFileSync(p.centrelines(page), 'utf8'))
    for (const f of fc.features) {
      const a = f.properties || {}
      if (seen.has(a.objectid)) continue
      seen.add(a.objectid)
      if (!L.keep(a) || !f.geometry) continue
      const lines = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : []
      for (const line of lines) {
        if (line.length < 2) continue
        const mid = line[Math.floor(line.length / 2)]
        if (mid[0] < w || mid[0] >= e || mid[1] < s || mid[1] >= n) continue
        const px = line.map(toPx)
        let len = 0
        for (let i = 1; i < px.length; i++) len += Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1])
        if (len * SHEET_PIXEL < 12) continue
        segs.push({ oid: a.objectid, name: a.fullname.trim(), arterial: !!L.arterial(a), lonlat: line, px, len: len * SHEET_PIXEL })
      }
    }
  }
  segs.sort((a, b) => a.oid - b.oid || a.lonlat[0][0] - b.lonlat[0][0])
  for (const g of segs) g.pieces = piecesOf(g)
  return segs
}

/** A segment's pieces: samples a pixel apart along it, short of its ends, with the normal at each. */
function piecesOf(g) {
  const P = g.px
  const cum = [0]
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
  const total = cum[cum.length - 1]
  const trim = END_TRIM / SHEET_PIXEL
  const usable = total - 2 * trim
  if (usable < 4) return []
  const np = Math.max(1, Math.round((usable * SHEET_PIXEL) / PIECE))
  const at = (d) => {
    let i = 1
    while (i < cum.length - 1 && cum[i] < d) i++
    const t = (d - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
    const dx = P[i][0] - P[i - 1][0]
    const dy = P[i][1] - P[i - 1][1]
    const L = Math.hypot(dx, dy) || 1
    return [P[i - 1][0] + dx * t, P[i - 1][1] + dy * t, -dy / L, dx / L]
  }
  const pieces = []
  for (let k = 0; k < np; k++) {
    const d0 = trim + (usable * k) / np
    const d1 = trim + (usable * (k + 1)) / np
    const m = Math.max(2, Math.round(d1 - d0))
    const xs = new Float32Array(m * 4)
    for (let q = 0; q < m; q++) xs.set(at(d0 + ((d1 - d0) * (q + 0.5)) / m), q * 4)
    pieces.push({ s: xs, n: m, len: ((d1 - d0) / usable) * g.len })
  }
  return pieces
}

const OFFS = (() => {
  const o = []
  for (let v = -OFFSET / SHEET_PIXEL; v <= OFFSET / SHEET_PIXEL + 1e-9; v++) o.push(v)
  return o
})()
const OPEN_PX = OPEN / SHEET_PIXEL

/**
 * A piece on a sheet moved by (sx, sy) pixels: { line, clear } or null where
 * the sheet does not cover it. `every`: read every nth sample (the search).
 */
function scorePiece(pc, sh, grid, sx, sy, every = 1, ostep = 1) {
  const W = grid.W
  const H = grid.H
  const ink = sh.ink
  const near = sh.near
  let line = 0
  let clear = 0
  let cov = 0
  let tot = 0
  for (let oi = 0; oi < OFFS.length; oi += ostep) {
    const o = OFFS[oi]
    let k = 0
    let kn = 0
    let c = 0
    let m = 0
    for (let q = 0; q < pc.n; q += every) {
      const b = q * 4
      const x = Math.round(pc.s[b] + pc.s[b + 2] * o + sx)
      const y = Math.round(pc.s[b + 1] + pc.s[b + 3] * o + sy)
      m++
      if (x < 0 || y < 0 || x >= W || y >= H) continue
      const v = ink[y * W + x]
      if (!v) continue
      c++
      if (v === 2) k++
      if (near[y * W + x]) kn++
    }
    if (o === 0) {
      cov = c
      tot = m
    }
    if (c < m * 0.7) continue
    // (the line within a pixel either way, the open ground exact)
    if (kn / c > line) line = kn / c
    if (Math.abs(o) <= OPEN_PX && 1 - k / c > clear) clear = 1 - k / c
  }
  if (cov < tot * 0.7) return null
  return { line, clear }
}

const found = (r, th) => !!r && r.line >= th.line && r.clear >= th.clear
// the search's own measure: smooth, so a near miss still counts for a little
const near = (r, th) => (r ? Math.min(r.line / th.line, r.clear / th.clear, 1) ** 4 : 0)

/** The shift (pixels) within `radius` metres of (cx, cy) by `step` metres that finds most of the pieces. */
function search(pieces, sh, grid, cx, cy, radius, step) {
  const R = Math.round(radius / step)
  const st = step / SHEET_PIXEL
  let best = { sx: cx, sy: cy, v: -1 }
  for (let j = -R; j <= R; j++) {
    for (let i = -R; i <= R; i++) {
      const sx = cx + i * st
      const sy = cy + j * st
      let v = 0
      for (const pc of pieces) v += near(scorePiece(pc, sh, grid, sx, sy, 2, 2), sh.th)
      // (a move costs a little, growing with its square: the State's georeferencing stands unless the streets say otherwise)
      if (R > 0) v -= MOVE * pieces.length * (Math.hypot(i, j) / R) ** 2
      // (ties to the smaller move)
      if (v > best.v + 1e-9 || (Math.abs(v - best.v) < 1e-9 && Math.hypot(sx, sy) < Math.hypot(best.sx, best.sy))) best = { sx, sy, v }
    }
  }
  return best
}

/** A fair sample of n pieces (every kth). */
const sampleOf = (list, n) => (list.length <= n ? list : list.filter((_, i) => i % Math.ceil(list.length / n) === 0))

/** Register a sheet over the town: its shift as a whole, then per cell. */
function register(segs, sh, sheet, grid, log) {
  const all = segs.flatMap((g) => g.pieces)
  const kind = sheet.old ? 'old' : 'new'
  const coarse = search(sampleOf(all, 300), sh, grid, 0, 0, SEARCH[kind], 20)
  const mid = search(sampleOf(all, 600), sh, grid, coarse.sx, coarse.sy, 20, 5)
  const fine = search(sampleOf(all, 900), sh, grid, mid.sx, mid.sy, 5, SHEET_PIXEL)
  const cellPx = CELL / SHEET_PIXEL
  const nx = Math.ceil(grid.W / cellPx)
  const ny = Math.ceil(grid.H / cellPx)
  const cells = new Map()
  for (const pc of all) {
    const k = Math.min(ny - 1, Math.floor(pc.s[1] / cellPx)) * nx + Math.min(nx - 1, Math.floor(pc.s[0] / cellPx))
    if (!cells.has(k)) cells.set(k, [])
    cells.get(k).push(pc)
  }
  const shifts = new Map()
  let moved = 0
  for (const [k, list] of cells) {
    let s = { sx: fine.sx, sy: fine.sy }
    if (list.length >= MIN_CELL) {
      const step = sheet.old ? 5 : SHEET_PIXEL
      const b = search(sampleOf(list, 150), sh, grid, fine.sx, fine.sy, REFINE[kind], step)
      s = { sx: b.sx, sy: b.sy }
      moved++
    }
    shifts.set(k, s)
    for (const pc of list) pc.shift = s
  }
  const m = (v) => round(v * SHEET_PIXEL, 1)
  const out = {
    shift: [m(fine.sx), m(-fine.sy)],
    // (each cell as [column, row, east, north], the cells counted from the export's north-west corner)
    cells: [...shifts.entries()].sort((a, b) => a[0] - b[0]).map(([k, s]) => [k % nx, Math.floor(k / nx), m(s.sx), m(-s.sy)]),
    cellsOwn: moved,
    cellMetres: CELL,
  }
  log(`    ${sheet.year}: shift ${out.shift.join(', ')} m (east, north); ${moved} of ${cells.size} cells their own`)
  return out
}

// --- the bake -------------------------------------------------------------------------

/** Douglas–Peucker on lon/lat in metres. */
function simplify(line, lat, tol) {
  const kx = KX(lat)
  const P = line.map(([lon, la]) => [lon * kx, la * KY])
  const keep = new Uint8Array(P.length)
  keep[0] = keep[P.length - 1] = 1
  const stack = [[0, P.length - 1]]
  // (a loop, its ends one point: cut at its farthest point from them, and each half simplified)
  if (P.length > 2 && Math.hypot(P[0][0] - P.at(-1)[0], P[0][1] - P.at(-1)[1]) < tol) {
    let far = 1
    for (let i = 1; i < P.length - 1; i++) if (Math.hypot(P[i][0] - P[0][0], P[i][1] - P[0][1]) > Math.hypot(P[far][0] - P[0][0], P[far][1] - P[0][1])) far = i
    keep[far] = 1
    stack.length = 0
    stack.push([0, far], [far, P.length - 1])
  }
  while (stack.length) {
    const [a, b] = stack.pop()
    let dm = 0
    let im = -1
    const [ax, ay] = P[a]
    const [bx, by] = P[b]
    const L = Math.hypot(bx - ax, by - ay) || 1e-9
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - P[i][1]) - (ax - P[i][0]) * (by - ay)) / L
      if (d > dm) {
        dm = d
        im = i
      }
    }
    if (dm > tol && im > 0) {
      keep[im] = 1
      stack.push([a, im], [im, b])
    }
  }
  return line.filter((_, i) => keep[i]).map(([lon, la]) => [round(lon, 5), round(la, 5)])
}

/**
 * Runs of one street, class and dating joined where they meet end to end and
 * no third run of that kind meets them there; their `seen` summed.
 */
function joinRuns(runs) {
  const keyOf = (r) => `${r.name}|${r.arterial}|${r.from}|${r.by}|${r.after}`
  const pt = (c) => `${c[0].toFixed(6)},${c[1].toFixed(6)}`
  const groups = new Map()
  for (const r of runs) {
    const k = keyOf(r)
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k).push(r)
  }
  const out = []
  for (const list of groups.values()) {
    const ends = new Map()
    list.forEach((r, i) => {
      for (const c of [r.lonlat[0], r.lonlat.at(-1)]) {
        const k = pt(c)
        if (!ends.has(k)) ends.set(k, [])
        ends.get(k).push(i)
      }
    })
    const used = new Uint8Array(list.length)
    for (let i = 0; i < list.length; i++) {
      if (used[i]) continue
      used[i] = 1
      const r = list[i]
      let line = r.lonlat.slice()
      const seen = r.seen.map((q) => ({ ...q }))
      let len = r.len
      // (on from either end while the next run is the only one there)
      for (const forward of [true, false]) {
        for (;;) {
          const end = forward ? line.at(-1) : line[0]
          const at = ends.get(pt(end))
          if (at.length !== 2) break
          const j = at.find((q) => !used[q])
          if (j === undefined) break
          used[j] = 1
          const q = list[j]
          let add = q.lonlat
          if (forward) {
            if (pt(add[0]) !== pt(end)) add = add.slice().reverse()
            line = line.concat(add.slice(1))
          } else {
            if (pt(add.at(-1)) !== pt(end)) add = add.slice().reverse()
            line = add.slice(0, -1).concat(line)
          }
          q.seen.forEach((v, k) => {
            seen[k].len += v.len
            seen[k].cov += v.cov
          })
          len += q.len
        }
      }
      out.push({ ...r, lonlat: line, seen, len })
    }
  }
  return out
}

/** A piece's year: the oldest sheet that finds it, borne out by at least half the later sheets that cover it. */
function pieceYear(flags, sheets) {
  // (the old sheets that cover the piece, and those that find it)
  let oldCov = 0
  let oldYes = 0
  sheets.forEach((s, q) => {
    if (!s.old || flags[q] === null) return
    oldCov++
    if (flags[q] === 1) oldYes++
  })
  for (let k = 0; k < sheets.length; k++) {
    if (flags[k] !== 1) continue
    if (sheets[k].old && oldCov >= 2 && oldYes < 2) continue
    let later = 0
    let yes = 0
    for (let q = k + 1; q < sheets.length; q++) {
      // (an island map at 1:60,000 that does not draw a street says little either way: the later sheets that bear a date out are the larger ones)
      if (flags[q] === null || (sheets[q].old && !sheets[k].old)) continue
      later++
      if (flags[q] === 1) yes++
    }
    if (!later || yes >= later / 2) return k
  }
  return -1
}

async function bakeTown(dir, town, ledger, log, draw = null) {
  const t0 = Date.now()
  const grid = sheetGrid(town)
  const sheets = townSheets(town)
  const segs = readSegments(dir, town, grid)
  const npieces = segs.reduce((s, g) => s + g.pieces.length, 0)
  log(`  ${town.id}: ${segs.length} segments, ${npieces} pieces, ${grid.W}×${grid.H} px`)
  const regs = []
  for (const g of segs) for (const pc of g.pieces) pc.flags = []
  for (const sheet of sheets) {
    // (a registered map placed on today's streets first: streets-registered.mjs)
    if (sheet.registered) {
      const img = readAnyPNG(registeredPaths.png(dir, sheet.registered))
      const grey = new Uint8Array(img.width * img.height)
      for (let i = 0; i < grey.length; i++) grey[i] = img.rgba[i * 4]
      sheet.scan = { width: img.width, height: img.height, grey }
      sheet.place = placeMap(sheet.scan, sheet.registered, segs, grid, SHEET_PIXEL, log)
    }
    const sh = readSheet(dir, town, sheet, grid)
    sheet.scan = null
    const reg = register(segs, sh, sheet, grid, log)
    let nf = 0
    let nc = 0
    for (const g of segs) {
      for (const pc of g.pieces) {
        const r = scorePiece(pc, sh, grid, pc.shift.sx, pc.shift.sy)
        pc.flags.push(r === null ? null : found(r, sh.th) ? 1 : 0)
        if (r !== null) nc++
        if (found(r, sh.th)) nf++
      }
    }
    reg.found = nc ? round(nf / nc, 3) : null
    regs.push(reg)
    if (draw) drawSheet(draw, town, sheet, segs, sh, grid, log)
  }
  // the segments' years
  const L = CENTRELINES[town.island]
  const features = []
  const runs = []
  const byYear = {}
  let n = 0
  for (const g of segs) {
    // (the length dated by each sheet, and by none)
    const share = new Float64Array(sheets.length + 1)
    const seen = sheets.map(() => ({ len: 0, cov: 0 }))
    let total = 0
    for (const pc of g.pieces) {
      const k = pieceYear(pc.flags, sheets)
      share[k < 0 ? sheets.length : k] += pc.len
      total += pc.len
      pc.flags.forEach((f, q) => {
        if (f === null) return
        seen[q].cov += pc.len
        if (f === 1) seen[q].len += pc.len
      })
    }
    // (by half the length some sheet dates, where that is enough of it; else by the layer)
    let k = sheets.length
    const dl = total - share[sheets.length]
    if (total > 0 && dl >= total * DATED) {
      let acc = 0
      for (let q = 0; q < sheets.length; q++) {
        acc += share[q]
        if (acc >= dl / 2 - 1e-6) {
          k = q
          break
        }
      }
    }
    const dated = k < sheets.length
    const from = dated ? sheets[k].year : L.asOf
    // (the sheet before it that covers the street and does not find it)
    let after = null
    for (let q = (dated ? k : sheets.length) - 1; q >= 0; q--) {
      if (seen[q].cov > 0) {
        after = sheets[q].source
        break
      }
    }
    const by = dated ? sheets[k].source : L.id
    runs.push({ name: g.name, arterial: g.arterial, from, by, after, seen, lonlat: g.lonlat, len: g.len })
    byYear[from] = round((byYear[from] || 0) + g.len / 1000, 2)
  }
  // a street's segments of one date joined end to end where nothing else of that street and date meets them
  for (const r of joinRuns(runs)) {
    const sources = [...new Set([L.id, r.by, ...(r.after ? [r.after] : [])])]
    features.push({
      type: 'Feature',
      properties: {
        id: `${town.id}-${++n}`,
        town: town.id,
        layerName: r.name,
        class: r.arterial ? 'arterial' : 'street',
        from: r.from,
        to: null,
        datePrecision: 'by',
        by: r.by,
        after: r.after,
        seen: r.seen.map((q) => (q.cov > 0 ? round(q.len / q.cov, 2) : null)),
        sources,
      },
      geometry: { type: 'LineString', coordinates: simplify(r.lonlat, grid.lat, SIMPLIFY) },
    })
  }
  log(`  ${town.id}: km by year ${JSON.stringify(byYear)} (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
  return {
    fc: { type: 'FeatureCollection', town: town.id, features },
    entry: {
      id: town.id,
      name: town.name,
      island: town.island,
      bounds: town.bounds,
      file: `${town.id}.geojson`,
      centrelines: L.id,
      sheets: sheets.map((s, q) => ({ year: s.year, ...(s.key ? { key: s.key } : {}), source: s.source, service: s.service, ...(s.place ? { placed: { registeredMap: s.registered.rm, scale: s.registered.scale, transform: [s.place.a, s.place.b, s.place.c, s.place.d, s.place.e, s.place.f].map((v) => round(v, 6)), turn: s.place.turn, metresPerPixel: s.place.metres, printed: s.place.printed, score: s.place.score, mask: s.registered.mask || [] } } : {}), ...(s.lock ? { raster: s.lock } : {}), ...(s.quads ? { quads: s.quads.map((q) => ({ raster: q.lock, neat: q.neat })) } : {}), old: !!s.old, ink: s.ink ?? INK, ...regs[q] })),
      stats: { segments: features.length, km: round(segs.reduce((s, g) => s + g.len, 0) / 1000, 1), kmBy: byYear },
    },
  }
}

const ABOUT =
  'Today’s street centrelines of each town, each segment dated by the oldest georeferenced sheet over the town that draws it ' +
  '(the Government Survey’s maps of the islands from 1881 to 1903, the U.S. Geological Survey’s quadrangles from 1910 to 1963 and of about 2000), ' +
  'found on each sheet by its line, and borne out by the later sheets. Every date is a date by which the street was there.'
const RULE =
  `Each segment is cut into pieces of about ${PIECE} m, sampled every ${SHEET_PIXEL} m along it, ${END_TRIM} m short of its ends. ` +
  `A sheet pixel is ink where it is darker than ${INK} of the sheet's paper (the 80th percentile of brightness over the export tile), or the share the sheet's own \`ink\` gives. ` +
  `A piece is found on a sheet where, at some offset within ${OFFSET} m of it, at least ${LINE * 100}% of its samples are ink or within a pixel of ink, and at some offset within ${OPEN} m, at least ${CLEAR * 100}% are paper. ` +
  `Each sheet is first moved over the town by the shift that finds the most pieces (searched within ${SEARCH.old} m for the Government Survey's island maps, ${SEARCH.new} m for the quadrangles, by 20 m, then by 5 m and by a pixel), then over each ${CELL} m cell holding at least ${MIN_CELL} pieces by its own shift within ${REFINE.old} or ${REFINE.new} m of that; each move costs as many pieces as ${MOVE * 100}% of those searched at the edge of its search, less nearer in, so a sheet stays where the State placed it unless the streets say otherwise. ` +
  `A piece is found on one of the Government Survey's island maps only where at least ${OLD.line * 100}% of its samples are ink, without the pixel's grace, and ${OLD.clear * 100}% paper; it is dated by the oldest sheet that finds it, if at least half the later sheets that cover it find it too and, for an island map, another island map finds it too where two or more cover it; a segment by the year by which half its dated length is dated, where at least ${DATED * 100}% of its length is dated at all; any other segment by the centreline layer’s own year.`

export async function bakeStreets({ dir, out, towns, ledger, log, draw = null }) {
  if (draw) mkdirSync(draw, { recursive: true })
  mkdirSync(out, { recursive: true })
  const mPath = join(out, 'manifest.json')
  const old = existsSync(mPath) ? JSON.parse(readFileSync(mPath, 'utf8')) : null
  const entries = new Map((old?.towns || []).map((t) => [t.id, t]))
  for (const town of towns) {
    const { fc, entry } = await bakeTown(dir, town, ledger, log, draw)
    writeFileSync(join(out, entry.file), JSON.stringify(fc) + '\n')
    entries.set(town.id, entry)
  }
  const islands = [...new Set(TOWNS.map((t) => t.island))]
  const centrelines = Object.fromEntries(islands.filter((i) => i !== 'molokai').map((i) => [i, centrelineSource(ledger, dir, i)]))
  const m = {
    about: ABOUT,
    rule: RULE,
    baked: new Date().toISOString().slice(0, 10),
    tool: 'tools/bake-streets.mjs',
    centrelines,
    towns: TOWNS.filter((t) => entries.has(t.id)).map((t) => entries.get(t.id)),
  }
  writeFileSync(mPath, JSON.stringify(m, null, 2) + '\n')
  log(`wrote ${mPath}`)
}

// --- the drawings ---------------------------------------------------------------------

/** A town over one of its sheets, halved: the sheet greyed, the pieces found green, not found red, not covered blue. */
function drawSheet(into, town, sheet, segs, sh, grid, log) {
  const W = Math.ceil(grid.W / 2)
  const H = Math.ceil(grid.H / 2)
  const rgb = new Uint8Array(W * H * 3)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = sh.lum[y * 2 * grid.W + x * 2]
    rgb.fill(150 + (v * 105) / 255, (y * W + x) * 3, (y * W + x) * 3 + 3)
  }
  for (const g of segs) {
    for (const pc of g.pieces) {
      const f = pc.flags.at(-1)
      const col = f === null ? [120, 120, 220] : f === 1 ? [0, 150, 0] : [220, 0, 0]
      for (let q = 0; q < pc.n; q++) {
        const x = Math.round((pc.s[q * 4] + pc.shift.sx) / 2)
        const y = Math.round((pc.s[q * 4 + 1] + pc.shift.sy) / 2)
        if (x < 0 || y < 0 || x >= W || y >= H) continue
        rgb.set(col, (y * W + x) * 3)
      }
    }
  }
  const f = join(into, `${town.id}-${sheet.key ?? sheet.year}.png`)
  writePNG(f, W, H, rgb)
  log(`    ${f}`)
}
