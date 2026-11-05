// ---------------------------------------------------------------------------
// (F9b, DESIGN §4.2.5) Long hulls: a footprint of discs, turned with a facing.
//
// A long hull is not one disc. Its `footprint` (data/schema.js checks the
// record) is 2 or 3 discs [dx, dz, r] in the hull's own frame, listed front
// to back: +z is its front, and one of them, the body disc at [0, 0], is
// where the unit stands (`pos`). The hull faces one of the nav grid's eight
// headings, h = 0 facing +z and h = 2 facing +x (core/nav.js DIRS, its
// neighbour steps), and each disc stands at its offset turned by h·45°.
//
// No trig runs in play (§4.1 rule 24). The turned offsets are built here
// once, at load, from exact constants: the axis headings turn by 0 and ±1,
// the diagonals by Math.SQRT1_2, and the pivot's two sub-steps (h·45° + 15°
// and + 30°) by the sqrt forms of their cos and sin, (√6 ± √2)/4, √3/2 and
// ½. Math.sqrt is correctly rounded in every engine, so the tables are the
// same bits everywhere, where Math.cos(π/12) already differs from the sqrt
// form in its last bit in Node. Each turned offset is snapped to the 0.5"
// grid by sign(v)·round(|v|/cell), so a heading's discs sit on cell centres
// whenever the body does; an offset whose |v|/cell lies within 1e-9 of a
// half (where engines could round either way off a hair of error) is
// refused. Heading h + 4 is the negation of h, exactly: the constants turn
// by quadrants with exact negations, and the snap is odd.
//
// What the load derives, frozen as the unit type's `t.fp` (deriveFootprint):
//   id      '<race>.<unit>': the hull memo's key (core/nav.js hullMemo)
//   cell    0.5, the grid the offsets snap to (the nav's own)
//   discs   the record's discs, [[dx, dz, r]…], exactly as given
//   n, r    the disc count and each disc's radius, front to back
//   radii   the distinct radii (the radius classes, at most 3), in order
//           of first appearance; cls[q] is disc q's class (a plan's forbid
//           masks are one per class: core/actions/move.js forbidMask)
//   body    the body disc's index
//   H[h][q] = { ix, iz, r }: disc q's snapped offset at heading h, in
//           cells from the body's cell
//   S[h][…] = { ix, iz, need, q }: the pivot sweep from h to h + 1, each
//           disc's centre at the two intermediate angles (front to back,
//           15° before 30°), snapped to a cell, with the sub-cell error
//           folded into the clearance it needs there, the conservative
//           off-centre form: need = r − 0.06 + |p − centre(cell(p))|
//   R       the bounding radius: the farthest snapped disc's offset plus
//           its r (core/units.js relayout makes it the unit's r)
//   turn    inches a 45° pivot costs; rev, what a step backing up costs
//           per inch of a step forward
//   span    the largest offset of any table, in cells
// RULES_ID hashes it with the rest of the type (core/version.js), the
// record's discs among it: the tables are a function of them.
//
// And the helpers the rules measure a footprint by, on queries.js's door
// (each through core/dmath.js's hypot, never Math.hypot): discsOf(u), a
// unit's discs where it stands; clearOf(o, x, z, r), the least edge gap
// from a disc to a unit's discs; fpGap(a, b), the least edge gap between
// two units' discs. A round unit is its one disc to all three, the very
// expression the round rules write (`hypot(…) − o.r − r`), so a site that
// asks them only when one side has a footprint (§4.1 rule 26) changes
// nothing for two round units.
//
// `footprint` is read here alone (sim/flag-lint.mjs): data/schema.js hands
// the record in and keeps what comes back.
// ---------------------------------------------------------------------------
import { hypot } from './dmath.js'

// the grid offsets snap to: the nav's cell (core/nav.js NavGrid's default,
// the one every match builds)
export const CELL = 0.5
export const HEADINGS = 8

// cos and sin of k·15° for k = 0-5 (the first quadrant), from exact
// constants (rule 24): cos 15° = (√6 + √2)/4, sin 15° = (√6 − √2)/4,
// cos 30° = √3/2, 45° by Math.SQRT1_2, 60°'s cos ½
const C15 = (Math.sqrt(6) + Math.sqrt(2)) / 4, S15 = (Math.sqrt(6) - Math.sqrt(2)) / 4
const C30 = Math.sqrt(3) / 2, R2 = Math.SQRT1_2
const QCOS = [1, C15, C30, R2, 0.5, S15]
const QSIN = [0, S15, 0.5, R2, C30, C15]
// (0 − x, not −x: a turned 0 stays +0, so no table holds a −0)
const neg = (x) => 0 - x
// [cos, sin] of k·15° for k = 0-23: the quadrant's pair, turned a quarter at
// a time ((c, s) → (−s, c)), every value an exact negation of another
const TURNS = Object.freeze(Array.from({ length: 24 }, (_, k) => {
  let c = QCOS[k % 6], s = QSIN[k % 6]
  for (let q = 0; q < ((k / 6) | 0); q++) {
    const t = c
    c = neg(s)
    s = t
  }
  return Object.freeze([c, s])
}))
// cos 7.5°, the pivot gap's half-sample angle: √((1 + cos 15°)/2)
const C7_5 = Math.sqrt((1 + C15) / 2)

// an offset (dx, dz) of the hull's frame turned by k·15° into the table's:
// facing (sin θ, cos θ), so h = 2 (θ = 90°) turns the front, +z, to +x
function turned(dx, dz, k) {
  const [c, s] = TURNS[k]
  return { x: dx * c + dz * s, z: dz * c - dx * s }
}
// sign(v)·round(|v|/cell), never −0
function snap(v) {
  const k = Math.round(Math.abs(v) / CELL)
  return v < 0 && k ? -k : k
}
// whether |v|/cell falls within 1e-9 of a half (refused: a hair of error
// could round it either way)
function nearHalf(v) {
  const t = Math.abs(v) / CELL
  return Math.abs(t - Math.floor(t) - 0.5) < 1e-9
}
const len = (x, z) => Math.sqrt(x * x + z * z)

// Derive a footprint's tables from its record { discs, turn, rev } (checked
// for shape by data/schema.js: 2 or 3 discs of finite numbers), and measure
// what the schema's rules judge. `id` names it ('<race>.<unit>'). Returns
// { fp, figures }, fp the unit type's `t.fp` (frozen by defineRace) and
// figures the measurements:
//   halves      the offsets within 1e-9 of a half cell, as text (refused)
//   snap[h][q]  disc q's snap error at heading h, inches
//   connected[h][q]  the edge gap between discs q and q + 1 at heading h
//               (snapped; ≤ 0 is connected)
//   pivot[q]    disc q's pivot gap, from the exact constants: with d its
//               distance from the body, √((d + r)² + d² − 2·d·(d + r)·cos 7.5°)
//               − r, the worst point a 15° sample leaves uncovered, on the
//               disc's outer edge 7.5° from the nearer sample
//   symmetric   whether H[h + 4] and S[h + 4] negate H[h] and S[h] exactly
// Pure: the same record gives the same tables, bit for bit, on every engine.
export function deriveFootprint(rec, id) {
  const discs = rec.discs.map(([dx, dz, r]) => [dx, dz, r])
  const n = discs.length
  const radii = [], cls = []
  for (const [, , r] of discs) {
    let k = radii.indexOf(r)
    if (k < 0) k = radii.push(r) - 1
    cls.push(k)
  }
  const body = discs.findIndex(([dx, dz]) => dx === 0 && dz === 0)
  const halves = []
  // disc q's snapped cell offset at angle k·15°, and its error
  const place = (q, k) => {
    const [dx, dz] = discs[q]
    const p = turned(dx, dz, k)
    for (const [axis, v] of [['x', p.x], ['z', p.z]]) if (nearHalf(v)) halves.push(`disc ${q} at ${k * 15}°: ${axis} ${v}`)
    const ix = snap(p.x), iz = snap(p.z)
    return { ix, iz, err: len(p.x - ix * CELL, p.z - iz * CELL) }
  }
  const H = [], S = [], snapErr = [], connected = []
  for (let h = 0; h < HEADINGS; h++) {
    const at = discs.map((_, q) => place(q, 3 * h))
    H.push(at.map(({ ix, iz }, q) => ({ ix, iz, r: discs[q][2] })))
    snapErr.push(at.map((p) => p.err))
    connected.push(at.slice(1).map((b, q) => len((b.ix - at[q].ix) * CELL, (b.iz - at[q].iz) * CELL) - discs[q][2] - discs[q + 1][2]))
    const sweep = []
    for (let q = 0; q < n; q++) {
      for (const k of [3 * h + 1, 3 * h + 2]) {
        const { ix, iz, err } = place(q, k)
        sweep.push({ ix, iz, need: discs[q][2] - 0.06 + err, q })
      }
    }
    S.push(sweep)
  }
  let R = 0, span = 0
  for (const row of H) {
    for (const d of row) {
      R = Math.max(R, len(d.ix * CELL, d.iz * CELL) + d.r)
      span = Math.max(span, Math.abs(d.ix), Math.abs(d.iz))
    }
  }
  for (const row of S) for (const p of row) span = Math.max(span, Math.abs(p.ix), Math.abs(p.iz))
  const pivot = discs.map(([dx, dz, r]) => {
    const d = len(dx, dz)
    return Math.sqrt((d + r) * (d + r) + d * d - 2 * d * (d + r) * C7_5) - r
  })
  const negated = (a, b) => a.length === b.length && a.every((p, j) => b[j].ix === -p.ix && b[j].iz === -p.iz && ['r', 'need', 'q'].every((f) => b[j][f] === p[f]))
  let symmetric = true
  for (let h = 0; h < 4; h++) symmetric &&= negated(H[h], H[h + 4]) && negated(S[h], S[h + 4])
  const fp = {
    id, cell: CELL, discs, n, r: discs.map(([, , r]) => r), radii, cls, body,
    H, S, R, turn: rec.turn, rev: rec.rev, span,
  }
  return { fp, figures: { halves, snap: snapErr, connected, pivot, symmetric } }
}

// Whether (x, z) of a footprint's own frame lies inside one of its discs
// (data/schema.js: a transport's deckAt is inside the footprint).
export const insideDiscs = (discs, x, z) => discs.some(([dx, dz, r]) => hypot(x - dx, z - dz) <= r)

// A unit's discs where it stands, [{ x, z, r }] front to back: a footprint
// unit's at its facing (u.facing, 0-7), a round unit's one disc.
export function discsOf(u) {
  const fp = u.t.fp
  if (!fp) return [{ x: u.pos.x, z: u.pos.z, r: u.r }]
  return fp.H[u.facing].map((d) => ({ x: u.pos.x + d.ix * fp.cell, z: u.pos.z + d.iz * fp.cell, r: d.r }))
}

// The least edge gap from the disc (x, z, r) to unit o's discs (or its own
// one disc: then `hypot(…) − o.r − r`, the round rules' expression).
// Negative where they overlap.
export function clearOf(o, x, z, r) {
  const fp = o.t.fp
  if (!fp) return hypot(o.pos.x - x, o.pos.z - z) - o.r - r
  const row = fp.H[o.facing]
  let g = Infinity
  for (let q = 0; q < row.length; q++) {
    const d = row[q]
    const v = hypot(o.pos.x + d.ix * fp.cell - x, o.pos.z + d.iz * fp.cell - z) - d.r - r
    if (v < g) g = v
  }
  return g
}

// The least edge gap between two units' discs. The bounding circles come
// first (a footprint's R, a round unit's r): two round units get exactly
// `dist − a.r − b.r` (queries.js's gap); and when the bounding gap is
// already `far` or more, it is returned as it is, never below the discs'
// own (the bound is a lower bound), so a test against a threshold a margin
// under `far` reads the same either way. With `far` Infinity (the default)
// the discs' least gap is always measured.
export function fpGap(a, b, far = Infinity) {
  const ra = a.t.fp ? a.t.fp.R : a.r, rb = b.t.fp ? b.t.fp.R : b.r
  const g0 = hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) - ra - rb
  if (g0 >= far || (!a.t.fp && !b.t.fp)) return g0
  let g = Infinity
  for (const d of discsOf(a)) {
    const v = clearOf(b, d.x, d.z, d.r)
    if (v < g) g = v
  }
  return g
}
