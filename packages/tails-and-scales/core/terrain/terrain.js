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
// reported, synchronously and in order, to `sink` (when set) as plain
// events, and the view (view/terrain.js) plays them: shudder, debris, the
// fall, the topple, the rubble pieces.
//
//   terrain.clear    {}                    a new table
//   terrain.add      { c }                 a chunk joined (a board's, a rubble
//                                          pile's, a fallen tree's log)
//   terrain.hurt     { c, from }           it took damage and stands
//   terrain.destroy  { c, from }           it broke (then its consequences)
//   terrain.collapse { drops: [{ c, dy }], by }   blocks fell into a gap
//   terrain.rubble   { c, from }           more rubble on a pile
//
// The events carry the live chunk, and the view reads it as each one comes.
// R5 makes them the match's event stream (DESIGN §2.3), by id and carrying
// the values the view needs, and from R4 they go through the match's `out`
// rather than a callback stored here. Chunk ids count from 1 on every new
// table.
// ---------------------------------------------------------------------------
import { hypot } from '../dmath.js'
import { SETS } from './sets.js'
import { scatter } from './recipes.js'
import { segmentHitsBox, distToBox } from './geom.js'

export class Terrain {
  constructor(W, H) {
    this.W = W
    this.H = H
    this.chunks = []
    this.features = []
    this.dirty = true
    this.nextId = 1
    // (event) => {}, synchronous: the view hears every change as it happens.
    // R3's only: a closure can't live in the match state, so from R4 the
    // reports go into the match's `out` instead (DESIGN R4 row)
    this.sink = null
  }

  emit(t, payload) {
    if (this.sink) this.sink({ t, ...payload })
  }

  clear() {
    this.chunks = []
    this.features = []
    this.nextId = 1
    this.dirty = true
    this.emit('terrain.clear', {})
  }

  add(def) {
    const c = {
      id: this.nextId++, alive: true, destructible: def.hp !== Infinity, hp: def.hp ?? Infinity, maxHp: def.hp ?? Infinity,
      los: null, cover: false, navKind: null, ...def,
    }
    const s = c.shape
    s.reach = hypot(s.hx, s.hz) + 0.05
    this.chunks.push(c)
    this.emit('terrain.add', { c })
    return c
  }

  // ── Generation ────────────────────────────────────────────────────────────
  // A new table: terrain set `set` (sets.js) scattered from the board seed by
  // its recipes (recipes.js scatter: the centre piece, then mirrored pairs of
  // features, every placement and every look drawn from the one layout
  // stream in a fixed order).
  generate(seed, objectives, deployDepth, set = 'classic') {
    // (SETS has no prototype, so only a set's own name is in it)
    if (!(set in SETS)) throw new Error(`no terrain set "${set}" (there are ${Object.keys(SETS).join(', ')})`)
    this.clear()
    this.features = scatter(this, SETS[set], seed, objectives, deployDepth)
    this.dirty = true
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  // Line of sight from a to b. Two obscuring things (trees, hedges...) in a
  // row block it; one gives the target cover. Obscurers hugging the shooter
  // are looked over.
  los(a, b, ignoreR = 1.3) {
    let obscure = 0
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z
    const L2 = dx * dx + dz * dz
    for (const c of this.chunks) {
      if (!c.alive || !c.los) continue
      const s = c.shape
      // cheap 2D reject: shape's bounding circle vs the segment
      let t = L2 > 0 ? ((s.x - a.x) * dx + (s.z - a.z) * dz) / L2 : 0
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const px = a.x + dx * t - s.x, pz = a.z + dz * t - s.z
      if (px * px + pz * pz > s.reach * s.reach) continue
      if (!segmentHitsBox(a, dx, dy, dz, s)) continue
      if (c.los === 'block') return { blocked: true, obscure }
      if (hypot(s.x - a.x, s.z - a.z) < ignoreR + s.reach * 0.5) continue
      obscure++
    }
    return { blocked: obscure >= 2, obscure }
  }

  // ── Destruction ───────────────────────────────────────────────────────────

  // A blast centred on (x, z): every breakable chunk within r takes `dmg`
  // (half that out at the rim). Returns the chunks that broke. It walks a
  // copy of the chunk list (DESIGN §4.1 rule 6), so the rubble and logs it
  // makes are not hit by the same blast; a wrecker's smashing walks the live
  // list instead (main.js smashAround).
  blast(x, z, r, dmg, { acid = false } = {}) {
    const broken = []
    for (const c of [...this.chunks]) {
      if (!c.alive || !c.destructible) continue
      const d = distToBox(x, 0.5, z, c.shape)
      if (d > r) continue
      let amount = d < r * 0.6 ? dmg : Math.ceil(dmg / 2)
      if (acid && c.kind === 'block') amount += 1
      this.hurt(c, amount, { x, z }, broken)
    }
    return broken
  }

  hurt(c, amount, from, broken = []) {
    if (!c.alive || !c.destructible) return broken
    c.hp -= amount
    if (c.hp <= 0) {
      this.destroy(c, from)
      broken.push(c)
    } else {
      // scuffed (the view darkens and shudders it)
      this.emit('terrain.hurt', { c, from })
    }
    return broken
  }

  destroy(c, from) {
    c.alive = false
    this.dirty = true
    this.emit('terrain.destroy', { c, from })
    switch (c.kind) {
      case 'block':
        this.collapse(c.col)
        this.rubble(c.col, from)
        break
      case 'tree':
        this.topple(c, from)
        break
    }
  }

  // Blocks above a broken one fall into the gap.
  collapse(col) {
    col.blocks = col.blocks.filter((b) => b.alive).sort((a, b) => a.level - b.level)
    const drops = []
    let next = 0
    for (const b of col.blocks) {
      if (b.level > next) {
        const drop = (b.level - next) * col.by
        b.level = next
        b.shape.y -= drop
        drops.push({ c: b, dy: drop })
      }
      next = b.level + 1
    }
    if (drops.length) this.emit('terrain.collapse', { drops, by: col.by })
  }

  // A pile of rubble at the column's foot: one chunk per column, made by the
  // first block to break; every break adds to it (in the view only).
  rubble(col, from) {
    let r = col.rubble
    if (!r) {
      const st = col.style
      r = col.rubble = this.add({
        kind: 'rubble', hp: Infinity,
        shape: { x: col.x, y: 0.2, z: col.z, hx: col.w * 0.7, hy: 0.2, hz: 0.6, yaw: col.yaw },
        navKind: 'diff', los: 'obscure', cover: true,
        look: { piece: 'rubble', style: st },
      })
      this.dirty = true
    }
    this.emit('terrain.rubble', { c: r, from })
  }

  // The tree keels over, away from the blow, into a log lying where it fell.
  topple(c, from) {
    const s = c.shape
    let dx = s.x - (from?.x ?? s.x - 1), dz = s.z - (from?.z ?? s.z)
    const L = hypot(dx, dz) || 1
    dx /= L
    dz /= L
    const len = c.trunkH
    const log = this.add({
      kind: 'log', hp: 2,
      shape: { x: s.x + dx * len * 0.5, y: c.trunkR, z: s.z + dz * len * 0.5, hx: len * 0.5, hy: c.trunkR, hz: c.trunkR + 0.05, yaw: Math.atan2(-dz, dx) },
      navKind: 'diff', los: 'obscure', cover: true,
      // the tree's own trunk becomes it, falling along (dx, dz)
      look: { piece: 'fallen', tree: c.id, dx, dz },
    })
    this.dirty = true
    return log
  }
}
