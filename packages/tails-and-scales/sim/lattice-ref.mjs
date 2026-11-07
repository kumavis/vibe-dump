// (F9b, DESIGN §4.2.5, §4.2.9's P-lattice) The reference lattice: the long
// hulls' plan as DESIGN writes it, plainly, for sim/property.mjs to hold
// core/nav.js hullReach to, state for state. Written fresh from the
// formulas, beside the code it judges and sharing none of it:
//   - a state (c, h), index c·8 + h, stands when every disc q's cell (the
//     body's cell plus H[h][q]) is on the board, has clearance (clearHard
//     in wreck mode, clearAll else) ≥ r_q − 0.06 and, with height, cliff ≥
//     r_q − 0.06 and floor ≤ STEP, and lies outside forbid[cls[q]];
//   - the pivot from (c, h) to (c, h + 1) is clear when every sample of
//     S[h] (each disc's centre at h·45° + 15° and + 30°, snapped, its
//     sub-cell error in `need`) is on the board with clearance ≥ need and,
//     with height, cliff ≥ need and floor ≤ STEP, outside its disc's mask;
//   - a step onto a state costs double where any of its discs is on
//     difficult ground, or (wreck mode) ploughs: clearAll < r_q − 0.06;
//   - from each popped state, in rule 25's order: forward (c + DIRS[h], h)
//     at step·mul, reverse (c − DIRS[h], h) at step·rev·mul, pivot right
//     (c, h + 1) at turn if S[h] is clear, pivot left (c, h − 1) at turn if
//     S[h − 1] is clear, each onto a state that stands, within max; the
//     start state accepted as it stands, its distance from (sx, sz) to its
//     cell's centre.
// Every test is made afresh where it is asked: no memo, no touched list,
// the arrays filled. Its only borrowings are the footprint's tables (t.fp,
// which data-check derives afresh and holds to DESIGN's figures), the
// grid's arrays (what the lattice reads), its cell centres, and the binary
// heap's discipline: a lattice of 0.5" and 0.71" steps ties often, and
// rule 25 has ties pop as nav.reach's, so `prev` agrees only with the same
// heap. Its sift rules are restated below (the reach's: a parent's key ≤
// the new key stops a sift up; the smaller child, the right one only when
// strictly smaller, and a child's key ≥ the moved key stops a sift down).

// the heading steps, h = 0 facing +z, h = 2 facing +x (DESIGN §4.2.5)
const STEPS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
// a floor a ground hull may stand on (core/nav.js STEP)
const STEP = 0.4

class RefHeap {
  constructor() {
    this.ids = []
    this.keys = []
  }
  get size() {
    return this.ids.length
  }
  push(id, key) {
    const { ids, keys } = this
    let i = ids.length
    ids.push(id)
    keys.push(key)
    while (i > 0) {
      const p = (i - 1) >> 1
      if (keys[p] <= key) break
      ids[i] = ids[p]
      keys[i] = keys[p]
      i = p
    }
    ids[i] = id
    keys[i] = key
  }
  pop() {
    const { ids, keys } = this
    const top = [ids[0], keys[0]]
    const id = ids.pop(), key = keys.pop()
    if (ids.length) {
      let i = 0
      for (;;) {
        let c = 2 * i + 1
        if (c >= ids.length) break
        if (c + 1 < ids.length && keys[c + 1] < keys[c]) c++
        if (keys[c] >= key) break
        ids[i] = ids[c]
        keys[i] = keys[c]
        i = c
      }
      ids[i] = id
      keys[i] = key
    }
    return top
  }
}

// the cell at offset (ox, oz) cells from cell c, or -1 off the board
function cellAt(nav, c, ox, oz) {
  const x = (c % nav.nx) + ox, z = Math.floor(c / nav.nx) + oz
  return x < 0 || z < 0 || x >= nav.nx || z >= nav.nz ? -1 : z * nav.nx + x
}
// whether cell j gives a disc needing `need` of clearance its room
function roomy(nav, j, need, mode) {
  const cl = mode === 'wreck' ? nav.clearHard[j] : nav.clearAll[j]
  if (!(cl >= need)) return false
  return !nav.hasHeight || (nav.cliff[j] >= need && nav.floor[j] <= STEP)
}
const masked = (forbid, fp, q, j) => !!(forbid && forbid[fp.cls[q]] && forbid[fp.cls[q]][j])

export function stands(nav, fp, c, h, mode, forbid) {
  for (let q = 0; q < fp.n; q++) {
    const d = fp.H[h][q], j = cellAt(nav, c, d.ix, d.iz)
    if (j < 0 || !roomy(nav, j, d.r - 0.06, mode) || masked(forbid, fp, q, j)) return false
  }
  return true
}
export function sweeps(nav, fp, c, h, mode, forbid) {
  for (const p of fp.S[h]) {
    const j = cellAt(nav, c, p.ix, p.iz)
    if (j < 0 || !roomy(nav, j, p.need, mode) || masked(forbid, fp, p.q, j)) return false
  }
  return true
}
function doubles(nav, fp, c, h, mode) {
  for (let q = 0; q < fp.n; q++) {
    const d = fp.H[h][q], j = cellAt(nav, c, d.ix, d.iz)
    if (nav.diff[j] || (mode === 'wreck' && nav.clearAll[j] < d.r - 0.06)) return true
  }
  return false
}

// The plain lattice: { dist, prev, start } of N·8 by state, as hullReach's.
export function refLattice(nav, sx, sz, h0, fp, { max, mode = 'walk', forbid = null }) {
  const N8 = nav.N * 8
  const dist = new Float64Array(N8).fill(Infinity), prev = new Int32Array(N8).fill(-1)
  const c0 = nav.index(sx, sz)
  if (c0 < 0) return { dist, prev, start: -1 }
  const s0 = c0 * 8 + h0
  dist[s0] = Math.hypot(sx - nav.x(c0), sz - nav.z(c0))
  const heap = new RefHeap()
  heap.push(s0, dist[s0])
  const relax = (s, t, nd) => {
    if (nd <= max && nd < dist[t]) {
      dist[t] = nd
      prev[t] = s
      heap.push(t, nd)
    }
  }
  while (heap.size) {
    const [s, d] = heap.pop()
    if (d > dist[s]) continue
    const c = Math.floor(s / 8), h = s % 8
    const [dx, dz] = STEPS[h]
    const step = (h % 2 ? Math.SQRT2 : 1) * nav.cell
    for (const [sign, cost] of [[1, (mul) => step * mul], [-1, (mul) => step * fp.rev * mul]]) {
      const j = cellAt(nav, c, sign * dx, sign * dz)
      if (j >= 0 && stands(nav, fp, j, h, mode, forbid)) relax(s, j * 8 + h, d + cost(doubles(nav, fp, j, h, mode) ? 2 : 1))
    }
    const right = (h + 1) % 8, left = (h + 7) % 8
    if (sweeps(nav, fp, c, h, mode, forbid) && stands(nav, fp, c, right, mode, forbid)) relax(s, c * 8 + right, d + fp.turn)
    if (sweeps(nav, fp, c, left, mode, forbid) && stands(nav, fp, c, left, mode, forbid)) relax(s, c * 8 + left, d + fp.turn)
  }
  return { dist, prev, start: s0 }
}
