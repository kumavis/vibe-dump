// ---------------------------------------------------------------------------
// The battlefield as rules data: chunks, line of sight and destruction.
//
// A chunk is the unit of line of sight, cover, movement blocking and
// destruction (recipes.js builds them; DESIGN §2.9 has the ChunkDef). It
// carries an oriented box (`shape`) used for line of sight and blast tests,
// an optional separate footprint (`nav`) for movement, and hit points.
// Blasts chip them; at zero they break: wall blocks shatter and the blocks
// above drop into the gap, trees topple into logs, hedges and crates burst.
//
// This is consensus code: no meshes, no clock, and no randomness but the
// board's layout stream. Destruction is instant here (a block's fall lowers
// shape.y at once, a toppled tree's log exists at once); what happened is
// reported, in order, as plain events (DESIGN §2.3) pushed onto the `out`
// array the caller passes (the match's G.out; none, null, for a quiet run),
// and the view (view/terrain.js) plays them: shudder, debris, the fall, the
// topple, the rubble pieces. Nothing is stored here to report through: the
// Terrain lives in the match state, which holds no closures (DESIGN §0.2
// #12).
//
//   terrain.clear    {}                         a new table
//   terrain.add      { def }                    a chunk joined (a board's, a
//                                               rubble pile's, a fallen tree's
//                                               log): def is { id, kind,
//                                               shape, look }, a copy of its
//                                               place and look as it joined
//                                               (F7a: and its surface, link,
//                                               base, supports, fallsAt and
//                                               on, where it has them)
//   terrain.hurt     { id, from, at }           it took damage and stands
//   terrain.destroy  { id, kind, from, at }     it broke (then its consequences)
//   terrain.collapse { drops: [{ id, dy }], by }   blocks fell into a gap
//   terrain.rubble   { id, from }               more rubble on a pile
//
// The events name chunks by id and carry what the view needs as values, so
// the view never reads a live chunk: it keeps each chunk's place and look
// from its add (a chunk never moves sideways; a collapse only lowers it),
// takes `at` (where a hurt or broken chunk stood when it was hit) for its
// debris, and reads whether a chunk stands and its height from the mirror
// (present/mirror.js), folded from these same events: a collapse's dust is
// where the block comes to rest after that drop. Chunk ids count from 1 on
// every new table.
//
// The Terrain takes the out per call (R5 kept that rather than emit(G, …),
// which would make it take the match): it is a rules object of its own,
// which sim/terrain-check.mjs drives without any match, and reporting
// through journal.js's emitTo is the same rule emit applies to G.out.
// ---------------------------------------------------------------------------
import { hypot, atan2 } from '../dmath.js'
import { emitTo } from '../journal.js'
import { SETS } from './sets.js'
import { scatter } from './recipes.js'
import { segmentHitsBox, distToBox } from './geom.js'

// where a chunk stands now, as a report carries it
const place = (c) => ({ x: c.shape.x, y: c.shape.y, z: c.shape.z })
// a chunk as it joins: what the view draws it from (a copy, so a later
// collapse lowering the chunk can't reach back into an event)
const defOf = (c) => ({ id: c.id, kind: c.kind, shape: { ...c.shape }, look: c.look })
// (F7a, DESIGN §4.2.4) and, for the pieces that have them (decks, stairs,
// ladders, posts: recipes.js), the height data the view draws them with and
// sim/terrain-check.mjs reads: `surface` (the walkable top), `link` (a
// ladder's foot and top), `base` (the floor a piece stands on), `supports`
// and `fallsAt` (a timber deck's posts) and `on` (a ladder's deck), copied
// like the shape. A chunk without them (every classic one) joins with the
// def it always had. (view/terrain.js's copy of defOf must carry the same,
// for a snap's sync to key the table by what an add carries.)
export const HEIGHT_FIELDS = Object.freeze(['surface', 'link', 'base', 'supports', 'fallsAt', 'on'])
const copy = (v) => (Array.isArray(v) ? v.map(copy) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])) : v)
const addDef = (c) => {
  const def = defOf(c)
  for (const k of HEIGHT_FIELDS) if (c[k] !== undefined) def[k] = copy(c[k])
  return def
}

// (S0b, DESIGN §4.2.2) The line-of-sight broadphase's bins: BIN-inch
// squares over the table, each listing (by place in `chunks`) every chunk
// whose bounding circle's box, PAD to spare, reaches into it. A chunk never
// moves sideways (a collapse only lowers it), so it is binned once, as it
// joins.
const BIN = 4, PAD = 0.01

export class Terrain {
  constructor(W, H) {
    this.W = W
    this.H = H
    this.nbx = Math.ceil(W / BIN)
    this.nbz = Math.ceil(H / BIN)
    this.clear()
  }

  clear(out = null) {
    this.chunks = []
    this.features = []
    this.nextId = 1
    this.dirty = true
    this.bins = Array.from({ length: this.nbx * this.nbz }, () => [])
    // (a query's scratch: the stamp it marks each chunk met with, and the
    // places of the chunks it met)
    this.seen = new Uint32Array(64)
    this.stamp = 0
    this.met = new Int32Array(64)
    emitTo(out, 'terrain.clear', {})
  }

  add(def, out = null) {
    const c = {
      id: this.nextId++, alive: true, destructible: def.hp !== Infinity, hp: def.hp ?? Infinity, maxHp: def.hp ?? Infinity,
      los: null, cover: false, navKind: null, ...def,
    }
    const s = c.shape
    s.reach = hypot(s.hx, s.hz) + 0.05
    const at = this.chunks.length
    this.chunks.push(c)
    if (at >= this.seen.length) {
      const seen = new Uint32Array(this.seen.length * 2)
      seen.set(this.seen)
      this.seen = seen
      this.met = new Int32Array(seen.length)
    }
    const [x0, x1] = this.binSpan(s.x - s.reach - PAD, s.x + s.reach + PAD, this.W, this.nbx)
    const [z0, z1] = this.binSpan(s.z - s.reach - PAD, s.z + s.reach + PAD, this.H, this.nbz)
    for (let bz = z0; bz <= z1; bz++) for (let bx = x0; bx <= x1; bx++) this.bins[bz * this.nbx + bx].push(at)
    emitTo(out, 'terrain.add', { def: addDef(c) })
    return c
  }

  // the bins (columns or rows) from lo to hi inches along a side `size`
  // long with `n` bins, kept on the table
  binSpan(lo, hi, size, n) {
    const at = (v) => Math.min(n - 1, Math.max(0, Math.floor((v + size / 2) / BIN)))
    return [at(lo), at(hi)]
  }

  // ── Generation ────────────────────────────────────────────────────────────
  // A new table: terrain set `set` (sets.js) scattered from the board seed by
  // its recipes (recipes.js scatter: the centre piece, then mirrored pairs of
  // features, every placement and every look drawn from the one layout
  // stream in a fixed order). The recipes add their chunks through `T.add`,
  // here this terrain's, reporting into `out`. (F7a) A set with works, forts
  // or an area scale reaches scatter's branches for them; classic never does.
  // A deck, stair, ladder or post carries its height fields on the chunk as
  // its def gave them (Object spread, below in add), so core/nav.js reads
  // them from the chunks.
  generate(seed, objectives, deployDepth, set = 'classic', out = null) {
    // (SETS has no prototype, so only a set's own name is in it)
    if (!(set in SETS)) throw new Error(`no terrain set "${set}" (there are ${Object.keys(SETS).join(', ')})`)
    this.clear(out)
    const T = { W: this.W, H: this.H, add: (def) => this.add(def, out) }
    this.features = scatter(T, SETS[set], seed, objectives, deployDepth)
    this.dirty = true
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  // Line of sight from a to b. Two obscuring things (trees, hedges...) in a
  // row block it; one gives the target cover. Obscurers hugging the shooter
  // are looked over.
  //
  // (S0b) Only the chunks binned where the segment passes are tested, in
  // the chunks' own order (so a blocker still returns as soon as it is met,
  // and `obscure`, a count, is what it was); with an end off the table,
  // every chunk is.
  //
  // (F7a) `why`, when given ({ block, obscure: [] }), hears the reasons as
  // they are met: the solid chunk that stopped the ray (its id), and each
  // obscuring chunk counted (its id). core/queries.js's sightInfo asks; the
  // verdict is the same either way.
  los(a, b, ignoreR = 1.3, why = null) {
    let obscure = 0
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z
    const L2 = dx * dx + dz * dz
    const n = this.near(a, b), every = n < 0, chunks = this.chunks, met = this.met
    for (let k = 0, N = every ? chunks.length : n; k < N; k++) {
      const c = chunks[every ? k : met[k]]
      if (!c.alive || !c.los) continue
      const s = c.shape
      // cheap 2D reject: shape's bounding circle vs the segment
      let t = L2 > 0 ? ((s.x - a.x) * dx + (s.z - a.z) * dz) / L2 : 0
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const px = a.x + dx * t - s.x, pz = a.z + dz * t - s.z
      if (px * px + pz * pz > s.reach * s.reach) continue
      if (!segmentHitsBox(a, dx, dy, dz, s)) continue
      if (c.los === 'block') {
        if (why) why.block = c.id
        return { blocked: true, obscure }
      }
      if (hypot(s.x - a.x, s.z - a.z) < ignoreR + s.reach * 0.5) continue
      obscure++
      if (why) why.obscure.push(c.id)
    }
    return { blocked: obscure >= 2, obscure }
  }

  // The chunks a segment from a to b may meet: every chunk in a bin the
  // segment (PAD to spare) passes through, each once, their places in
  // `met` in chunk order, and how many; -1 when an end is off the table
  // (every chunk, then).
  near(a, b) {
    const W = this.W, H = this.H
    const off = (p) => !(Math.abs(p.x) <= W / 2 && Math.abs(p.z) <= H / 2)
    if (off(a) || off(b)) return -1
    if (this.stamp === 0xffffffff) {
      this.seen.fill(0)
      this.stamp = 0
    }
    const stamp = ++this.stamp, seen = this.seen, met = this.met
    let n = 0
    const zlo = Math.min(a.z, b.z), zhi = Math.max(a.z, b.z)
    const [r0, r1] = this.binSpan(zlo - PAD, zhi + PAD, H, this.nbz)
    for (let r = r0; r <= r1; r++) {
      // the segment's x across this row of bins (PAD beyond it either way)
      const z0 = Math.max(zlo, r * BIN - H / 2 - PAD), z1 = Math.min(zhi, (r + 1) * BIN - H / 2 + PAD)
      let x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x)
      if (zhi - zlo > 1e-6) {
        const xa = a.x + ((b.x - a.x) * (z0 - a.z)) / (b.z - a.z), xb = a.x + ((b.x - a.x) * (z1 - a.z)) / (b.z - a.z)
        x0 = Math.max(x0, Math.min(xa, xb))
        x1 = Math.min(x1, Math.max(xa, xb))
      }
      const [c0, c1] = this.binSpan(x0 - PAD, x1 + PAD, W, this.nbx)
      for (let c = c0; c <= c1; c++) {
        for (const at of this.bins[r * this.nbx + c]) {
          if (seen[at] === stamp) continue
          seen[at] = stamp
          met[n++] = at
        }
      }
    }
    // in chunk order (an insertion sort: a handful each)
    for (let i = 1; i < n; i++) {
      const v = met[i]
      let j = i - 1
      while (j >= 0 && met[j] > v) {
        met[j + 1] = met[j]
        j--
      }
      met[j + 1] = v
    }
    return n
  }

  // ── Destruction ───────────────────────────────────────────────────────────

  // A blast centred on (x, z): every breakable chunk within r takes `dmg`
  // (half that out at the rim). Returns the chunks that broke. It walks a
  // copy of the chunk list (DESIGN §4.1 rule 6), so the rubble and logs it
  // makes are not hit by the same blast; a wrecker's smashing walks the live
  // list instead (core/actions/move.js smashAround). (F7a) `y`, the height
  // the blast is measured from: half an inch over the floor it lands on
  // (core/actions/shoot.js blastLands: 0.5 on a board without height, as it
  // always was).
  blast(x, z, r, dmg, { acid = false, y = 0.5 } = {}, out = null) {
    const broken = []
    for (const c of [...this.chunks]) {
      if (!c.alive || !c.destructible) continue
      const d = distToBox(x, y, z, c.shape)
      if (d > r) continue
      let amount = d < r * 0.6 ? dmg : Math.ceil(dmg / 2)
      if (acid && c.kind === 'block') amount += 1
      this.hurt(c, amount, { x, z }, out, broken)
    }
    return broken
  }

  hurt(c, amount, from, out = null, broken = []) {
    if (!c.alive || !c.destructible) return broken
    c.hp -= amount
    if (c.hp <= 0) {
      this.destroy(c, from, out)
      broken.push(c)
    } else {
      // scuffed (the view darkens and shudders it)
      emitTo(out, 'terrain.hurt', { id: c.id, from, at: place(c) })
    }
    return broken
  }

  destroy(c, from, out = null) {
    c.alive = false
    this.dirty = true
    emitTo(out, 'terrain.destroy', { id: c.id, kind: c.kind, from, at: place(c) })
    switch (c.kind) {
      case 'block':
        this.collapse(c.col, out)
        this.rubble(c.col, from, out)
        break
      case 'tree':
        this.topple(c, from, out)
        break
    }
  }

  // Blocks above a broken one fall into the gap.
  collapse(col, out = null) {
    col.blocks = col.blocks.filter((b) => b.alive).sort((a, b) => a.level - b.level)
    const drops = []
    let next = 0
    for (const b of col.blocks) {
      if (b.level > next) {
        const drop = (b.level - next) * col.by
        b.level = next
        b.shape.y -= drop
        drops.push({ id: b.id, dy: drop })
      }
      next = b.level + 1
    }
    if (drops.length) emitTo(out, 'terrain.collapse', { drops, by: col.by })
  }

  // A pile of rubble at the column's foot: one chunk per column, made by the
  // first block to break; every break adds to it (in the view only).
  rubble(col, from, out = null) {
    let r = col.rubble
    if (!r) {
      const st = col.style
      r = col.rubble = this.add({
        kind: 'rubble', hp: Infinity,
        shape: { x: col.x, y: 0.2, z: col.z, hx: col.w * 0.7, hy: 0.2, hz: 0.6, yaw: col.yaw },
        navKind: 'diff', los: 'obscure', cover: true,
        look: { piece: 'rubble', style: st },
      }, out)
      this.dirty = true
    }
    emitTo(out, 'terrain.rubble', { id: r.id, from })
  }

  // The tree keels over, away from the blow, into a log lying where it fell.
  topple(c, from, out = null) {
    const s = c.shape
    let dx = s.x - (from?.x ?? s.x - 1), dz = s.z - (from?.z ?? s.z)
    const L = hypot(dx, dz) || 1
    dx /= L
    dz /= L
    const len = c.trunkH
    const log = this.add({
      kind: 'log', hp: 2,
      shape: { x: s.x + dx * len * 0.5, y: c.trunkR, z: s.z + dz * len * 0.5, hx: len * 0.5, hy: c.trunkR, hz: c.trunkR + 0.05, yaw: atan2(-dz, dx) },
      navKind: 'diff', los: 'obscure', cover: true,
      // the tree's own trunk becomes it, falling along (dx, dz)
      look: { piece: 'fallen', tree: c.id, dx, dz },
    }, out)
    this.dirty = true
    return log
  }
}
