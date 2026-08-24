// A real TrueType binary, written in the browser with no dependencies.
//
// The table plumbing below is mechanical. The part worth reading is the outline
// conversion. The engine hands this module dense polygons — one round join is
// thirty vertices — and writing every vertex as an on-curve point gives a font
// that is both enormous and visibly faceted at text sizes. So each contour is
// simplified, its real corners are found by turn angle and kept on-curve, and
// every vertex surviving in between becomes an *off-curve* control point.
// TrueType's implied-midpoint rule then reads a run of off-curve points as a
// uniform quadratic B-spline: the polygon becomes a smooth curve for free, at
// roughly a fifth of the points. pushControls() cancels the undershoot that
// spline would otherwise have.
//
// Everything here is defensive by construction — a glyph that arrives full of
// NaN, or a million units wide, yields a smaller font, never a broken one.
import { clamp, simplify, toPathData } from '../geom/path.js'

/** Per-glyph ceilings; simple glyphs index points with uint16 and sign them. */
export const TTF_LIMITS = { maxPoints: 32767, maxContours: 32767 }

const SFNT = 0x00010000
const HEAD_MAGIC = 0x5f0f3cf5
const CHECKSUM_MAGIC = 0xb1b0afba
const EPOCH_1904 = 2082844800 // seconds from 1904-01-01 to the Unix epoch
const COORD_MAX = 16383 // keeps every delta inside int16, whatever arrives
const RDP_DIV = 512 // simplify tolerance = unitsPerEm / RDP_DIV
const CORNER_COS = Math.cos((40 * Math.PI) / 180)
const WELD = 1e-6
const CMAP_GAP = 3 // merging segments over a gap costs 2 bytes/code, a segment 8
const MAX_SEGS_BYTES = 0xffff // format 4 states its length in a uint16

// ── byte writer ──────────────────────────────────────────────────────────────

const makeWriter = (cap = 4096) => {
  let buf = new Uint8Array(cap)
  let view = new DataView(buf.buffer)
  let n = 0
  const need = (k) => {
    if (n + k <= buf.length) return
    let size = buf.length * 2
    while (size < n + k) size *= 2
    const next = new Uint8Array(size)
    next.set(buf.subarray(0, n))
    buf = next
    view = new DataView(buf.buffer)
  }
  return {
    get pos() {
      return n
    },
    u8(v) {
      need(1)
      buf[n++] = v & 0xff
    },
    u16(v) {
      need(2)
      view.setUint16(n, v & 0xffff)
      n += 2
    },
    i16(v) {
      need(2)
      view.setInt16(n, clamp(Math.round(v), -32768, 32767))
      n += 2
    },
    u32(v) {
      need(4)
      view.setUint32(n, v >>> 0)
      n += 4
    },
    tag(s) {
      need(4)
      for (let i = 0; i < 4; i++) buf[n++] = s.charCodeAt(i) & 0xff
    },
    bytes(b) {
      need(b.length)
      buf.set(b, n)
      n += b.length
    },
    zeros(k) {
      need(k)
      buf.fill(0, n, n + k)
      n += k
    },
    pad4() {
      const k = (4 - (n & 3)) & 3
      if (k) this.zeros(k)
    },
    done() {
      return buf.slice(0, n)
    },
  }
}

/** sfnt checksum: the table read as big-endian uint32s, summed mod 2^32. */
const checksum = (b, from = 0, to = b.length) => {
  let s = 0
  for (let i = from; i + 3 < to; i += 4) {
    s = (s + ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3])) >>> 0
  }
  return s >>> 0
}

// ── outline → quadratic contours ─────────────────────────────────────────────

// Scratch reused across every contour of every glyph: a 1,000-glyph export
// walks this path ~25,000 times and the nursery should not see any of it.
const S = {
  clean: new Float64Array(4096),
  x: new Float64Array(2048),
  y: new Float64Array(2048),
  px: new Float64Array(2048),
  py: new Float64Array(2048),
  on: new Uint8Array(2048),
}
const fitF = (k, n) => (S[k].length >= n ? S[k] : (S[k] = new Float64Array(n)))

/** Drop non-finite and coincident vertices, including across the closing edge. */
function cleanClosed(poly) {
  const m = poly.length >> 1
  const out = fitF('clean', poly.length)
  let k = 0
  for (let i = 0; i < m; i++) {
    const x = poly[i * 2]
    const y = poly[i * 2 + 1]
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue
    if (k >= 2 && Math.abs(x - out[k - 2]) < WELD && Math.abs(y - out[k - 1]) < WELD) continue
    out[k++] = x
    out[k++] = y
  }
  while (k >= 4 && Math.abs(out[0] - out[k - 2]) < WELD && Math.abs(out[1] - out[k - 1]) < WELD) k -= 2
  return out.subarray(0, k)
}

/** Points i0…i1 of a closed buffer, walking forward and wrapping. */
function chain(p, i0, i1, m) {
  const len = (i1 - i0 + m) % m
  const out = new Float64Array((len + 1) * 2)
  for (let k = 0; k <= len; k++) {
    const i = (i0 + k) % m
    out[k * 2] = p[i * 2]
    out[k * 2 + 1] = p[i * 2 + 1]
  }
  return out
}

/**
 * RDP for a *closed* ring. RDP pins its two endpoints, so the ring is cut at
 * the vertex farthest from the centroid and again at the vertex farthest from
 * that one — the two least droppable points on the shape — and the halves are
 * simplified independently.
 */
function simplifyClosed(p, tol) {
  const m = p.length >> 1
  if (m < 5) return p
  let cx = 0
  let cy = 0
  for (let i = 0; i < m; i++) {
    cx += p[i * 2]
    cy += p[i * 2 + 1]
  }
  cx /= m
  cy /= m
  let a = 0
  let best = -1
  for (let i = 0; i < m; i++) {
    const d = (p[i * 2] - cx) ** 2 + (p[i * 2 + 1] - cy) ** 2
    if (d > best) {
      best = d
      a = i
    }
  }
  let b = a
  best = -1
  for (let i = 0; i < m; i++) {
    const d = (p[i * 2] - p[a * 2]) ** 2 + (p[i * 2 + 1] - p[a * 2 + 1]) ** 2
    if (d > best) {
      best = d
      b = i
    }
  }
  if (b === a) b = (a + (m >> 1)) % m
  const s1 = simplify(chain(p, a, b, m), tol)
  const s2 = simplify(chain(p, b, a, m), tol)
  // both halves repeat the cut points; keep one copy of each
  const out = new Float64Array(s1.length + s2.length - 4)
  out.set(s1.subarray(0, s1.length - 2), 0)
  out.set(s2.subarray(0, s2.length - 2), s1.length - 2)
  return out
}

/**
 * Move each off-curve control outward so the spline hits the polygon.
 *
 * A quadratic segment with control P and endpoints E⁻, E⁺ reaches its extreme
 * at t = ½, where B(½) = (E⁻ + 2P + E⁺)/4. Under the implied-midpoint rule the
 * endpoint on a given side is the neighbour itself if that neighbour is
 * on-curve, else the midpoint (P + N)/2. Substituting gives
 *
 *     B(½) = α·P + β⁻·N⁻ + β⁺·N⁺,   β = ¼ (on-curve neighbour) or ⅛ (off),
 *                                   α = 1 − β⁻ − β⁺
 *
 * so the spline apex sits short of the polygon vertex V by exactly the pull of
 * its neighbours. Demanding B(½) = V and treating the neighbours as fixed at
 * their polygon positions solves to
 *
 *     P = V + ( β⁻·(V − N⁻) + β⁺·(V − N⁺) ) / α
 *
 * — one Jacobi step of the exact tridiagonal interpolation, which is all this
 * needs: the residual after one step is well under a font unit at these turn
 * angles.
 *
 * The correction points along V − ½(N⁻ + N⁺), and that is only the direction of
 * the undershoot while the two edges are of similar length. Where RDP leaves a
 * short edge beside a long one — a stroke's 600-unit flank meeting the 60-unit
 * chords of its cap — that vector swings round to lie along the long edge and
 * hauls the control a hundred units down it, bowing the curve tens of units off
 * the shape. The apex condition is simply the wrong demand there: at t = ½ the
 * curve is nowhere near V once the spacing is that lopsided. So the correction
 * fades with the ratio of the shorter edge to the longer, which is 1 exactly
 * when the derivation's uniform-spacing assumption holds and 0 when it fails
 * hardest.
 */
function pushControls(x, y, on, m) {
  // a separate pair of buffers: every control reads its neighbours' *polygon*
  // positions, so the corrections cannot be applied in place
  const bx = fitF('px', m)
  const by = fitF('py', m)
  for (let i = 0; i < m; i++) {
    bx[i] = x[i]
    by[i] = y[i]
  }
  for (let i = 0; i < m; i++) {
    if (on[i]) continue
    const p = (i + m - 1) % m
    const q = (i + 1) % m
    const bp = on[p] ? 0.25 : 0.125
    const bq = on[q] ? 0.25 : 0.125
    const a = 1 - bp - bq
    const dp = Math.hypot(x[i] - x[p], y[i] - y[p])
    const dq = Math.hypot(x[q] - x[i], y[q] - y[i])
    const hi = Math.max(dp, dq)
    const even = hi > WELD ? Math.min(dp, dq) / hi : 0
    const k = even / a
    bx[i] = x[i] + k * (bp * (x[i] - x[p]) + bq * (x[i] - x[q]))
    by[i] = y[i] + k * (bp * (y[i] - y[p]) + bq * (y[i] - y[q]))
  }
  for (let i = 0; i < m; i++) {
    x[i] = bx[i]
    y[i] = by[i]
  }
}

/**
 * One closed polygon in font units → the integer point list TrueType wants.
 * Returns null when nothing drawable survives.
 */
export function compileContour(poly, tol) {
  if (!poly || poly.length < 6) return null
  const src = simplifyClosed(cleanClosed(poly), tol)
  let m = src.length >> 1
  if (m < 3) return null

  const x = fitF('x', m)
  const y = fitF('y', m)
  const on = S.on.length >= m ? S.on : (S.on = new Uint8Array(m))
  for (let i = 0; i < m; i++) {
    x[i] = clamp(src[i * 2], -COORD_MAX, COORD_MAX)
    y[i] = clamp(src[i * 2 + 1], -COORD_MAX, COORD_MAX)
  }

  // corners stay on-curve; a degenerate edge has no direction, so call it one
  let nOn = 0
  let worst = 1
  let worstAt = 0
  for (let i = 0; i < m; i++) {
    const p = (i + m - 1) % m
    const q = (i + 1) % m
    const ax = x[i] - x[p]
    const ay = y[i] - y[p]
    const cxv = x[q] - x[i]
    const cyv = y[q] - y[i]
    const la = Math.hypot(ax, ay)
    const lb = Math.hypot(cxv, cyv)
    const d = la > WELD && lb > WELD ? (ax * cxv + ay * cyv) / (la * lb) : -1
    if (d < worst) {
      worst = d
      worstAt = i
    }
    if (d < CORNER_COS) {
      on[i] = 1
      nOn++
    } else on[i] = 0
  }
  // a contour of pure off-curve points is legal but fragile; anchor the sharpest
  if (!nOn) {
    on[worstAt] = 1
    nOn = 1
  }

  pushControls(x, y, on, m)

  // round, then weld anything the rounding collapsed (same spot, same kind)
  const ix = new Int16Array(m)
  const iy = new Int16Array(m)
  const io = new Uint8Array(m)
  let k = 0
  for (let i = 0; i < m; i++) {
    const px = Math.round(clamp(x[i], -COORD_MAX, COORD_MAX))
    const py = Math.round(clamp(y[i], -COORD_MAX, COORD_MAX))
    if (k > 0 && px === ix[k - 1] && py === iy[k - 1] && io[k - 1] === on[i]) continue
    ix[k] = px
    iy[k] = py
    io[k] = on[i]
    k++
  }
  while (k > 1 && ix[k - 1] === ix[0] && iy[k - 1] === iy[0] && io[k - 1] === io[0]) k--
  if (k < 3) return null

  // start on-curve: some rasterisers still assume the first point is one
  let rot = 0
  while (rot < k && !io[rot]) rot++
  if (rot >= k) rot = 0
  const ox = new Int16Array(k)
  const oy = new Int16Array(k)
  const oo = new Uint8Array(k)
  for (let i = 0; i < k; i++) {
    const j = (rot + i) % k
    ox[i] = ix[j]
    oy[i] = iy[j]
    oo[i] = io[j]
  }
  m = k
  return { x: ox, y: oy, on: oo, n: m }
}

// ── glyph assembly ───────────────────────────────────────────────────────────

const G = {
  x: new Int32Array(4096),
  y: new Int32Array(4096),
  on: new Uint8Array(4096),
  ends: new Uint16Array(256),
  flags: new Uint8Array(4096),
}
const fitG = (n) => {
  if (G.x.length >= n) return
  let size = G.x.length
  while (size < n) size *= 2
  const gx = new Int32Array(size)
  const gy = new Int32Array(size)
  const go = new Uint8Array(size)
  gx.set(G.x)
  gy.set(G.y)
  go.set(G.on)
  G.x = gx
  G.y = gy
  G.on = go
  G.flags = new Uint8Array(size)
}

/** Fill the G scratch from a glyph's contours; returns its metrics, or null. */
function compileGlyph(contours, tol) {
  let n = 0
  let nc = 0
  let xMin = Infinity
  let yMin = Infinity
  let xMax = -Infinity
  let yMax = -Infinity
  for (const poly of contours || []) {
    if (nc >= TTF_LIMITS.maxContours) break
    const c = compileContour(poly, tol)
    if (!c) continue
    if (n + c.n > TTF_LIMITS.maxPoints) break
    fitG(n + c.n)
    for (let i = 0; i < c.n; i++) {
      const px = c.x[i]
      const py = c.y[i]
      G.x[n] = px
      G.y[n] = py
      G.on[n] = c.on[i]
      n++
      if (px < xMin) xMin = px
      if (px > xMax) xMax = px
      if (py < yMin) yMin = py
      if (py > yMax) yMax = py
    }
    if (G.ends.length <= nc) {
      const e = new Uint16Array(G.ends.length * 2)
      e.set(G.ends)
      G.ends = e
    }
    G.ends[nc++] = n - 1
  }
  if (!nc) return null
  return { n, nc, xMin, yMin, xMax, yMax }
}

/** Serialise the G scratch as one simple glyph. */
function writeGlyph(w, m) {
  w.i16(m.nc)
  w.i16(m.xMin)
  w.i16(m.yMin)
  w.i16(m.xMax)
  w.i16(m.yMax)
  for (let c = 0; c < m.nc; c++) w.u16(G.ends[c])
  w.u16(0) // no instructions — this font is unhinted

  const f = G.flags
  let px = 0
  let py = 0
  for (let i = 0; i < m.n; i++) {
    const dx = G.x[i] - px
    const dy = G.y[i] - py
    px = G.x[i]
    py = G.y[i]
    let v = G.on[i] ? 0x01 : 0
    if (dx === 0) v |= 0x10
    else if (dx >= -255 && dx <= 255) v |= 0x02 | (dx > 0 ? 0x10 : 0)
    if (dy === 0) v |= 0x20
    else if (dy >= -255 && dy <= 255) v |= 0x04 | (dy > 0 ? 0x20 : 0)
    f[i] = v
  }
  for (let i = 0; i < m.n; ) {
    const v = f[i]
    let r = 0
    while (r < 255 && i + r + 1 < m.n && f[i + r + 1] === v) r++
    if (r) {
      w.u8(v | 0x08)
      w.u8(r)
      i += r + 1
    } else {
      w.u8(v)
      i++
    }
  }
  px = 0
  for (let i = 0; i < m.n; i++) {
    const dx = G.x[i] - px
    px = G.x[i]
    if (f[i] & 0x02) w.u8(Math.abs(dx))
    else if (!(f[i] & 0x10)) w.i16(dx)
  }
  py = 0
  for (let i = 0; i < m.n; i++) {
    const dy = G.y[i] - py
    py = G.y[i]
    if (f[i] & 0x04) w.u8(Math.abs(dy))
    else if (!(f[i] & 0x20)) w.i16(dy)
  }
  w.pad4()
}

/** The missing-glyph box, so an unmapped codepoint shows something honest. */
function notdefContours(upm) {
  const t = Math.max(1, Math.round(upm * 0.045))
  const x0 = Math.round(upm * 0.11)
  const x1 = Math.round(upm * 0.61)
  const y0 = 0
  const y1 = Math.round(upm * 0.7)
  // outer clockwise, hole counter-clockwise: the winding the caller's contours
  // already use once y has been flipped into font space
  return [
    Float64Array.from([x0, y0, x0, y1, x1, y1, x1, y0]),
    Float64Array.from([x0 + t, y0 + t, x1 - t, y0 + t, x1 - t, y1 - t, x0 + t, y1 - t]),
  ]
}

// ── cmap ─────────────────────────────────────────────────────────────────────

/** Segment the sorted (code, gid) pairs, merging over gaps short enough to pay. */
function segments(pairs, gap) {
  const segs = []
  for (let i = 0; i < pairs.length; ) {
    let j = i + 1
    while (j < pairs.length && pairs[j][0] - pairs[j - 1][0] <= 1 + gap) j++
    const start = pairs[i][0]
    const end = pairs[j - 1][0]
    let delta = (pairs[i][1] - start) & 0xffff
    let flat = end - start === j - i - 1
    for (let k = i; flat && k < j; k++) if (((pairs[k][0] + delta) & 0xffff) !== pairs[k][1]) flat = false
    const seg = { start, end, delta: flat ? delta : 0, ids: null }
    if (!flat) {
      seg.ids = new Uint16Array(end - start + 1)
      for (let k = i; k < j; k++) seg.ids[pairs[k][0] - start] = pairs[k][1]
    }
    segs.push(seg)
    i = j
  }
  segs.push({ start: 0xffff, end: 0xffff, delta: 1, ids: null })
  return segs
}

function cmapTable(pairs) {
  let segs = segments(pairs, CMAP_GAP)
  let ids = segs.reduce((a, s) => a + (s.ids ? s.ids.length : 0), 0)
  if (16 + segs.length * 8 + ids * 2 > MAX_SEGS_BYTES) {
    segs = segments(pairs, 0)
    ids = segs.reduce((a, s) => a + (s.ids ? s.ids.length : 0), 0)
  }
  const segCount = segs.length
  const sub = makeWriter(1024)
  const len = 16 + segCount * 8 + ids * 2
  const es = Math.floor(Math.log2(segCount))
  const sr = 2 * 2 ** es
  sub.u16(4)
  sub.u16(len)
  sub.u16(0) // language
  sub.u16(segCount * 2)
  sub.u16(sr)
  sub.u16(es)
  sub.u16(segCount * 2 - sr)
  for (const s of segs) sub.u16(s.end)
  sub.u16(0) // reservedPad
  for (const s of segs) sub.u16(s.start)
  for (const s of segs) sub.i16(s.delta > 32767 ? s.delta - 65536 : s.delta)
  // idRangeOffset counts bytes from its own slot to this segment's ids
  let at = 0
  for (let i = 0; i < segCount; i++) {
    if (!segs[i].ids) sub.u16(0)
    else {
      sub.u16((segCount - i) * 2 + at * 2)
      at += segs[i].ids.length
    }
  }
  for (const s of segs) if (s.ids) for (const g of s.ids) sub.u16(g)
  const body = sub.done()

  const w = makeWriter(body.length + 32)
  w.u16(0)
  w.u16(2)
  const off = 4 + 2 * 8
  for (const [p, e] of [
    [0, 3],
    [3, 1],
  ]) {
    w.u16(p)
    w.u16(e)
    w.u32(off)
  }
  w.bytes(body)
  return w.done()
}

// ── name ─────────────────────────────────────────────────────────────────────

const asciiOnly = (s) =>
  String(s ?? '')
    .replace(/[^\x20-\x7e]/g, '')
    .trim() || 'Untitled'

const utf16be = (s) => {
  const b = new Uint8Array(s.length * 2)
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    b[i * 2] = c >> 8
    b[i * 2 + 1] = c & 0xff
  }
  return b
}

const latin1 = (s) => {
  const b = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff
  return b
}

function nameTable(entries) {
  const recs = []
  for (const [id, value] of entries) {
    const s = asciiOnly(value)
    recs.push({ p: 1, e: 0, l: 0, id, data: latin1(s) })
    recs.push({ p: 3, e: 1, l: 0x409, id, data: utf16be(s) })
  }
  recs.sort((a, b) => a.p - b.p || a.e - b.e || a.l - b.l || a.id - b.id)
  const w = makeWriter(1024)
  w.u16(0)
  w.u16(recs.length)
  w.u16(6 + recs.length * 12)
  let off = 0
  for (const r of recs) {
    w.u16(r.p)
    w.u16(r.e)
    w.u16(r.l)
    w.u16(r.id)
    w.u16(r.data.length)
    w.u16(off)
    off += r.data.length
  }
  for (const r of recs) w.bytes(r.data)
  return w.done()
}

// ── OS/2 ─────────────────────────────────────────────────────────────────────

// Only the blocks this font can plausibly cover; the bits are advisory hints.
const UNICODE_BITS = [
  [0x0000, 0x007f, 0],
  [0x0080, 0x00ff, 1],
  [0x2000, 0x206f, 31],
  [0x3000, 0x303f, 48],
  [0x3040, 0x309f, 49],
  [0x30a0, 0x30ff, 50],
  [0x4e00, 0x9fff, 59],
]

function unicodeRanges(codes) {
  const r = [0, 0, 0, 0]
  for (const c of codes) {
    for (const [lo, hi, bit] of UNICODE_BITS) {
      if (c >= lo && c <= hi) r[bit >> 5] |= 1 << bit % 32
    }
  }
  return r
}

// ── the font ─────────────────────────────────────────────────────────────────

/**
 * Build an installable TrueType file.
 *
 * `spec` = { unitsPerEm, ascent, descent, familyName, styleName, version,
 * glyphs: [{ unicode, advance, contours }] }, where each contour is a closed
 * flat polygon in font units with y up. Glyph ids follow `glyphs` order, offset
 * by one for .notdef. Winding is preserved exactly as given.
 */
export function buildTTF(spec = {}) {
  const upm = Math.round(clamp(Number(spec.unitsPerEm) || 1024, 16, 16384))
  const ascent = Math.round(clamp(Number(spec.ascent ?? upm * 0.88) || 0, -32768, 32767))
  const descent = Math.round(clamp(Number(spec.descent ?? -upm * 0.12) || 0, -32768, 32767))
  const family = asciiOnly(spec.familyName || 'Kanji Lathe')
  const style = asciiOnly(spec.styleName || 'Regular')
  const version = asciiOnly(spec.version || '1.000')
  const tol = upm / RDP_DIV
  const secs = Math.floor((Number.isFinite(spec.created) ? spec.created : Date.now()) / 1000) + EPOCH_1904

  const src = Array.isArray(spec.glyphs) ? spec.glyphs : []
  const glyf = makeWriter(1 << 16)
  const offsets = [0]
  const advances = []
  const lsbs = []
  const bounds = []
  const pairs = []
  const seen = new Set()
  let maxPoints = 0
  let maxContours = 0
  let xMin = 0
  let yMin = 0
  let xMax = 0
  let yMax = 0
  let box = false

  const put = (contours, advance, code) => {
    const m = compileGlyph(contours, tol)
    if (m) {
      writeGlyph(glyf, m)
      if (m.n > maxPoints) maxPoints = m.n
      if (m.nc > maxContours) maxContours = m.nc
      if (!box) {
        xMin = m.xMin
        yMin = m.yMin
        xMax = m.xMax
        yMax = m.yMax
        box = true
      } else {
        if (m.xMin < xMin) xMin = m.xMin
        if (m.yMin < yMin) yMin = m.yMin
        if (m.xMax > xMax) xMax = m.xMax
        if (m.yMax > yMax) yMax = m.yMax
      }
    }
    offsets.push(glyf.pos)
    advances.push(Math.round(clamp(Number(advance) || 0, 0, 0xffff)))
    lsbs.push(m ? m.xMin : 0)
    bounds.push(m)
    if (Number.isFinite(code) && code >= 0 && code <= 0xffff && !seen.has(code)) {
      seen.add(code)
      pairs.push([code, offsets.length - 2])
    }
  }

  put(notdefContours(upm), Math.round(upm * 0.5), NaN)
  for (const g of src) put(g?.contours, g?.advance ?? upm, g?.unicode)

  const numGlyphs = advances.length
  const glyfData = glyf.done()
  pairs.sort((a, b) => a[0] - b[0])

  // loca: short form stores offset/2, so it needs even offsets and a table that
  // fits in 2·uint16 — every glyph is padded to 4 above, so only length decides
  const shortLoca = glyfData.length <= 0x1fffe
  const loca = makeWriter((numGlyphs + 1) * 4)
  for (const o of offsets) {
    if (shortLoca) loca.u16(o >> 1)
    else loca.u32(o)
  }

  // hmtx: trailing glyphs sharing one advance need only their sidebearing
  let numH = numGlyphs
  while (numH > 1 && advances[numH - 1] === advances[numH - 2]) numH--
  const hmtx = makeWriter(numH * 4 + (numGlyphs - numH) * 2 + 4)
  for (let i = 0; i < numGlyphs; i++) {
    if (i < numH) hmtx.u16(advances[i])
    hmtx.i16(lsbs[i])
  }

  const head = makeWriter(64)
  head.u32(0x00010000)
  head.u32(Math.round((parseFloat(version) || 1) * 65536))
  head.u32(0) // checkSumAdjustment, patched once the file exists
  head.u32(HEAD_MAGIC)
  head.u16(0x000b) // baseline at 0, lsb at 0, integer ppem
  head.u16(upm)
  head.u32(Math.floor(secs / 4294967296))
  head.u32(secs >>> 0)
  head.u32(Math.floor(secs / 4294967296))
  head.u32(secs >>> 0)
  head.i16(xMin)
  head.i16(yMin)
  head.i16(xMax)
  head.i16(yMax)
  head.u16(0) // macStyle
  head.u16(8) // lowestRecPPEM
  head.i16(2) // fontDirectionHint
  head.i16(shortLoca ? 0 : 1)
  head.i16(0) // glyphDataFormat

  let advMax = 0
  let lsbMin = 32767
  let rsbMin = 32767
  let extent = -32768
  for (let i = 0; i < numGlyphs; i++) {
    if (advances[i] > advMax) advMax = advances[i]
    if (!bounds[i]) continue
    if (lsbs[i] < lsbMin) lsbMin = lsbs[i]
    const rsb = advances[i] - bounds[i].xMax
    if (rsb < rsbMin) rsbMin = rsb
    if (bounds[i].xMax > extent) extent = bounds[i].xMax
  }
  if (!box) {
    lsbMin = 0
    rsbMin = 0
    extent = 0
  }

  const hhea = makeWriter(36)
  hhea.u32(0x00010000)
  hhea.i16(ascent)
  hhea.i16(descent)
  hhea.i16(0) // lineGap
  hhea.u16(advMax)
  hhea.i16(lsbMin)
  hhea.i16(rsbMin)
  hhea.i16(extent)
  hhea.i16(1) // caretSlopeRise
  hhea.i16(0)
  hhea.i16(0)
  for (let i = 0; i < 4; i++) hhea.i16(0)
  hhea.i16(0) // metricDataFormat
  hhea.u16(numH)

  const maxp = makeWriter(32)
  maxp.u32(0x00010000)
  maxp.u16(numGlyphs)
  maxp.u16(Math.min(maxPoints, 0xffff))
  maxp.u16(Math.min(maxContours, 0xffff))
  maxp.u16(0) // maxCompositePoints
  maxp.u16(0) // maxCompositeContours
  maxp.u16(2) // maxZones
  maxp.u16(0) // maxTwilightPoints
  maxp.u16(0) // maxStorage
  maxp.u16(0) // maxFunctionDefs
  maxp.u16(0) // maxInstructionDefs
  maxp.u16(0) // maxStackElements
  maxp.u16(0) // maxSizeOfInstructions
  maxp.u16(0) // maxComponentElements
  maxp.u16(0) // maxComponentDepth

  const fixed = advances.every((a) => a === advances[0])
  let avg = 0
  let avgN = 0
  for (const a of advances) {
    if (a > 0) {
      avg += a
      avgN++
    }
  }
  const ranges = unicodeRanges(seen)
  const first = pairs.length ? pairs[0][0] : 0
  const last = pairs.length ? pairs[pairs.length - 1][0] : 0
  const os2 = makeWriter(96)
  os2.u16(4)
  os2.i16(avgN ? avg / avgN : 0)
  os2.u16(400) // usWeightClass
  os2.u16(5) // usWidthClass
  os2.u16(0) // fsType: installable
  os2.i16(upm * 0.65)
  os2.i16(upm * 0.6)
  os2.i16(0)
  os2.i16(upm * 0.075)
  os2.i16(upm * 0.65)
  os2.i16(upm * 0.6)
  os2.i16(0)
  os2.i16(upm * 0.35)
  os2.i16(upm * 0.05)
  os2.i16(upm * 0.26)
  os2.i16(0) // sFamilyClass
  for (const p of [2, 11, 5, 9, 0, 0, 0, 0, 0, 0]) os2.u8(p) // PANOSE: sans, monospaced
  for (const r of ranges) os2.u32(r)
  os2.tag('KLTH')
  os2.u16(0x40) // fsSelection: regular
  os2.u16(first)
  os2.u16(last)
  os2.i16(ascent)
  os2.i16(descent)
  os2.i16(0) // sTypoLineGap
  os2.u16(Math.max(ascent, yMax, 0))
  os2.u16(Math.max(-descent, -yMin, 0))
  os2.u32((1 << 17) | (ranges[0] & 1)) // JIS/Japan, plus Latin-1 if any is here
  os2.u32(0)
  os2.i16(upm * 0.5) // sxHeight
  os2.i16(upm * 0.7) // sCapHeight
  os2.u16(0) // usDefaultChar
  os2.u16(32) // usBreakChar
  os2.u16(0) // usMaxContext

  const post = makeWriter(32)
  post.u32(0x00030000) // no glyph names — nothing here has one worth storing
  post.u32(0) // italicAngle
  post.i16(-Math.round(upm * 0.075))
  post.i16(Math.round(upm * 0.05))
  post.u32(fixed ? 1 : 0)
  post.u32(0)
  post.u32(0)
  post.u32(0)
  post.u32(0)

  const full = family + ' ' + style
  const psName = full.replace(/[^A-Za-z0-9]/g, '').slice(0, 60) || 'KanjiLathe'
  const name = nameTable([
    [1, family],
    [2, style],
    [3, full + ' ' + version],
    [4, full],
    [5, 'Version ' + version],
    [6, psName],
  ])

  return assemble([
    ['OS/2', os2.done()],
    ['cmap', cmapTable(pairs)],
    ['glyf', glyfData],
    ['head', head.done()],
    ['hhea', hhea.done()],
    ['hmtx', hmtx.done()],
    ['loca', loca.done()],
    ['maxp', maxp.done()],
    ['name', name],
    ['post', post.done()],
  ])
}

/** Table directory + payload, with every checksum and the head fixup. */
function assemble(tables) {
  tables.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
  const num = tables.length
  const dir = 12 + num * 16
  const pad = (n) => (n + 3) & ~3
  let total = dir
  const at = []
  for (const [, data] of tables) {
    at.push(total)
    total += pad(data.length)
  }

  const file = new Uint8Array(total)
  const view = new DataView(file.buffer)
  const es = Math.floor(Math.log2(num))
  const sr = 16 * 2 ** es
  view.setUint32(0, SFNT)
  view.setUint16(4, num)
  view.setUint16(6, sr)
  view.setUint16(8, es)
  view.setUint16(10, num * 16 - sr)

  let headAt = 0
  for (let i = 0; i < num; i++) {
    const [tag, data] = tables[i]
    file.set(data, at[i])
    const rec = 12 + i * 16
    for (let k = 0; k < 4; k++) file[rec + k] = tag.charCodeAt(k)
    view.setUint32(rec + 4, checksum(file, at[i], at[i] + pad(data.length)))
    view.setUint32(rec + 8, at[i])
    view.setUint32(rec + 12, data.length)
    if (tag === 'head') headAt = at[i]
  }
  // head's own checksum was taken with the adjustment field still zero, which is
  // exactly what the spec asks for; now make the whole file sum to the magic
  if (headAt) view.setUint32(headAt + 8, (CHECKSUM_MAGIC - checksum(file)) >>> 0)
  return file
}

// ── SVG ──────────────────────────────────────────────────────────────────────

const fmt = (v, prec) => {
  const s = v.toFixed(prec)
  return prec > 0 ? s.replace(/\.?0+$/, '') || '0' : s
}

/** Compiled contour → path data, reading off-curve runs as implied midpoints. */
function quadPath(c, prec) {
  let d = `M${fmt(c.x[0], prec)} ${fmt(c.y[0], prec)}`
  for (let i = 1; i <= c.n; i++) {
    const j = i % c.n
    if (c.on[j]) {
      d += `L${fmt(c.x[j], prec)} ${fmt(c.y[j], prec)}`
      continue
    }
    const k = (j + 1) % c.n
    const ex = c.on[k] ? c.x[k] : (c.x[j] + c.x[k]) / 2
    const ey = c.on[k] ? c.y[k] : (c.y[j] + c.y[k]) / 2
    d += `Q${fmt(c.x[j], prec)} ${fmt(c.y[j], prec)} ${fmt(ex, prec)} ${fmt(ey, prec)}`
    if (c.on[k]) i++
  }
  return d + 'Z'
}

/**
 * Closed polygons → a standalone SVG document. By default it draws the same
 * quadratics the .ttf carries, so the vector export and the font agree; pass
 * `smooth: false` for the raw polygons the engine produced. Input is assumed to
 * be y-up font units (as for buildTTF) and is flipped for SVG's y-down space.
 */
export function svgFromContours(contours, opts = {}) {
  const upm = Math.round(clamp(Number(opts.unitsPerEm) || 1024, 16, 16384))
  const size = Math.round(clamp(Number(opts.size) || 512, 1, 8192))
  const prec = Math.round(clamp(Number(opts.precision ?? 1), 0, 6))
  const smooth = opts.smooth !== false
  const yUp = opts.yUp !== false
  const fill = String(opts.fill || '#111').replace(/[<>"&]/g, '')
  const tol = upm / RDP_DIV
  let d = ''
  for (const poly of contours || []) {
    if (smooth) {
      const c = compileContour(poly, tol)
      if (c) d += quadPath(c, prec)
    } else {
      const clean = cleanClosed(poly)
      if (clean.length >= 6) d += toPathData(clean, true, prec)
    }
  }
  const title = opts.title ? `\n  <title>${String(opts.title).replace(/[<>&]/g, '')}</title>` : ''
  const bg = opts.background ? `\n  <rect width="${upm}" height="${upm}" fill="${String(opts.background).replace(/[<>"&]/g, '')}"/>` : ''
  // the flip lives in a transform so the path data stays in font units
  const open = yUp ? `<g transform="translate(0 ${upm}) scale(1 -1)">` : '<g>'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${upm} ${upm}" width="${size}" height="${size}">${title}${bg}
  ${open}<path d="${d}" fill="${fill}" fill-rule="nonzero"/></g>
</svg>
`
}
