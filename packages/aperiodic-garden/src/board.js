// Board state: which kite cells are filled, what grows on them, where the river
// runs, and which biome regions have been sealed off.
//
// Everything here is incremental. A placement touches eight cells, so scoring
// must cost O(8 · 4) rather than O(board) — otherwise the two-hundredth tile
// costs two hundred times the first. The trick is a union-find over kite cells
// that carries, at each root, the number of *open edges* the region still has:
// (kite, direction) pairs facing an empty cell. A region is closed exactly when
// that count reaches zero, and because cells are never removed a closed region
// can never re-open or merge with anything — so it scores once and freezes.
//
// Water is not one of the biomes. The river is a line: a set of long kite edges
// it crosses, drawn as a ribbon from each crossing to the tile's hub. Biomes
// never constrain a placement — meadow may butt onto forest all day, it just
// costs you the region. Only three things make a placement illegal, and all
// three are about keeping the garden playable rather than tidy:
//
//   1. it must not overlap anything;
//   2. every shared long edge must agree about whether a river crosses it;
//   3. it must leave the board fillable — every empty cell near it still has
//      some hat that could cover it, and no river end is walled in.

import {
  KEY_A,
  KEY_B,
  KEY_K,
  ORIENT_KITES,
  PORT_SIDE,
  longEdgeId,
  neighbourKeys,
  candidatePlacements,
  placementKeys,
  worldSide,
} from './hat.js'

export const PLAINS = 0
export const FOREST = 1
export const HILLS = 2
export const VILLAGE = 3
export const SCREE = 4

export const BIOME_NAME = ['meadow', 'forest', 'hills', 'hamlet', 'scree']

/** How much a sealed region of each biome is worth per kite². Hamlets are the
 *  scarcest cover in the deck, so they pay best. */
export const BIOME_MULT = [1.0, 1.15, 1.3, 1.85, 1.4]

/** Points for sealing off `n` kites of biome `b`. Superlinear, so one big
 *  meadow beats four small ones — the whole reason to plan ahead. */
export function regionScore(n, b) {
  return Math.round(n * (n + 2) * BIOME_MULT[b])
}

/**
 * What an *unsealed* region is worth when the garden is put down. Sealing pays
 * more than three times as much, so closing is always the better move — but a
 * sprawling open meadow you never quite ringed still counts for something,
 * which is what stops the last ten tiles being played at random.
 */
export const OPEN_RATE = 0.3
export function openScore(n, b) {
  return Math.round(n * (n + 2) * BIOME_MULT[b] * OPEN_RATE)
}

/** Bonus tiles granted for sealing a region — the tile economy's only faucet. */
export function regionTiles(n) {
  if (n >= 21) return 4
  if (n >= 13) return 3
  if (n >= 7) return 2
  if (n >= 3) return 1
  return 0
}

/** How far apart two kites of one hat can be, in neighbour-steps. Computed from
 *  the shape rather than eyeballed: it is exactly how far a placement's
 *  influence on what can still be covered reaches. */
export const HAT_REACH = (() => {
  const cells = placementKeys(0, 0, 0)
  const nb = []
  let worst = 0
  for (const start of cells) {
    const seen = new Set([start])
    let ring = [start]
    for (let step = 1; step <= 8 && ring.length; step++) {
      const next = []
      for (const key of ring) {
        neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), nb)
        for (let j = 0; j < 4; j++) {
          if (seen.has(nb[j])) continue
          seen.add(nb[j])
          next.push(nb[j])
          if (cells.includes(nb[j])) worst = Math.max(worst, step)
        }
      }
      ring = next
    }
  }
  return worst
})()

const NO_CELLS = new Set()

/** An open mouth, as one number: the empty cell plus which of its two long
 *  sides the water is waiting on. */
export const MOUTH_KEY = (cell, side) => cell * 2 + side

export class Board {
  constructor() {
    /** key → biome */
    this.biome = new Map()
    /** key → the index of the tile that placed it */
    this.owner = new Map()
    /** every filled cell, for the placement enumerator */
    this.filled = new Set()
    /** long-edge ids the river crosses */
    this.ports = new Set()
    /** edge id → [empty cell, its side] for every river mouth still open */
    this.openMouths = new Map()
    /** union-find over port edges: two edges share a root when water can run
     *  from one to the other. Every branch of a tile meets at its hub, so a
     *  tile's crossings are all one set; a crossing shared by two tiles is one
     *  edge id, so the two tiles' networks merge by themselves. */
    this.riverParent = new Map()
    /** union-find over filled cells */
    this.parent = new Map()
    this.rsize = new Map()
    this.ropen = new Map()
    /** roots whose score has already been banked */
    this.sealed = new Set()
    /** root → the cell that carries its pennant, once sealed */
    this.landmarks = new Map()
    this.tiles = [] // {orient, ta, tb, cells, biomes, ports, flipped}
    this._stuck = new Set()
    this._stuckAt = -1
    this._nb = []
    this._nb2 = []
  }

  find(x) {
    let r = x
    while (this.parent.get(r) !== r) r = this.parent.get(r)
    let c = x
    while (this.parent.get(c) !== r) {
      const n = this.parent.get(c)
      this.parent.set(c, r)
      c = n
    }
    return r
  }

  union(a, b) {
    let ra = this.find(a)
    let rb = this.find(b)
    if (ra === rb) return ra
    if (this.rsize.get(ra) < this.rsize.get(rb)) [ra, rb] = [rb, ra]
    this.parent.set(rb, ra)
    this.rsize.set(ra, this.rsize.get(ra) + this.rsize.get(rb))
    this.ropen.set(ra, this.ropen.get(ra) + this.ropen.get(rb))
    this.rsize.delete(rb)
    this.ropen.delete(rb)
    return ra
  }

  riverFind(e) {
    let r = e
    while (this.riverParent.get(r) !== r) r = this.riverParent.get(r)
    let c = e
    while (this.riverParent.get(c) !== r) {
      const n = this.riverParent.get(c)
      this.riverParent.set(c, r)
      c = n
    }
    return r
  }

  /** Can water run from one crossing to the other? */
  riverConnected(a, b) {
    if (!this.riverParent.has(a) || !this.riverParent.has(b)) return false
    return this.riverFind(a) === this.riverFind(b)
  }

  // --- where a tile's river crossings land ----------------------------------

  /**
   * For a placement, the world-space river crossings it would make: one entry
   * per port slot, whether or not the tile actually carries a river there.
   * `{ slot, cell, side, edge, far }` — `far` being the cell on the other side.
   */
  crossings(orient, ta, tb, cells = placementKeys(orient, ta, tb), out = []) {
    out.length = 0
    const flipped = orient >= 6
    for (let i = 0; i < 8; i++) {
      const s = PORT_SIDE[i]
      if (s === null) continue
      const side = worldSide(s, flipped)
      const key = cells[i]
      const a = KEY_A(key)
      const b = KEY_B(key)
      const k = KEY_K(key)
      neighbourKeys(a, b, k, this._nb)
      out.push({ slot: i, cell: key, side, edge: longEdgeId(a, b, k, side), far: this._nb[side] })
    }
    return out
  }

  // --- legality -------------------------------------------------------------

  /** Rule 2 on its own: does the river agree along every edge already built? */
  matchesRiver(orient, ta, tb, ports, cells = placementKeys(orient, ta, tb)) {
    for (let i = 0; i < 8; i++) if (this.filled.has(cells[i])) return false
    const xs = this.crossings(orient, ta, tb, cells, [])
    for (const x of xs) {
      if (!this.filled.has(x.far)) continue
      if (this.ports.has(x.edge) !== ports.has(x.slot)) return false
    }
    return true
  }

  /** Does this placement's river actually meet the river already on the board? */
  joinsRiver(orient, ta, tb, ports, cells = placementKeys(orient, ta, tb)) {
    for (const x of this.crossings(orient, ta, tb, cells, [])) {
      if (ports.has(x.slot) && this.filled.has(x.far) && this.ports.has(x.edge)) return true
    }
    return false
  }

  /**
   * The full test: rules 1–3. Split out from matchesRiver because the first two
   * are cheap enough to run over every candidate, while rule 3 walks the empty
   * space around the placement and is only worth paying for once a tile has
   * survived the others.
   */
  placeable(orient, ta, tb, ports, cells = placementKeys(orient, ta, tb)) {
    if (!this.matchesRiver(orient, ta, tb, ports, cells)) return false
    const added = new Set(cells)
    return this.leavesRoom(cells, added) && this.streamsCanFlow(orient, ta, tb, ports, cells, added)
  }

  /** Every legal placement for one tile. */
  legalPlacements(tile) {
    const out = []
    for (const c of candidatePlacements(this.filled)) {
      const cells = placementKeys(c.o, c.ta, c.tb)
      // cheap and it prunes hard, so it goes first
      if (tile.demand && !this.meetsDemand(cells, tile.demand)) continue
      if (this.placeable(c.o, c.ta, c.tb, tile.ports, cells)) out.push({ ...c, cells })
    }
    return out
  }

  /** Does this spot already have enough of the cover a camp tile lives off?
   *  Counted in shared edges, so a camp has to sit *in* the wood rather than
   *  touch one corner of it. */
  meetsDemand(cells, { biome, wants }) {
    const own = new Set(cells)
    let n = 0
    for (const key of cells) {
      neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), this._nb)
      for (let j = 0; j < 4; j++) {
        const m = this._nb[j]
        if (own.has(m) || !this.filled.has(m)) continue
        if (this.biome.get(m) === biome && ++n >= wants) return true
      }
    }
    return false
  }

  /**
   * Rule 3a — no stranded ground. Every empty cell near this placement must
   * still be coverable: some hat, somewhere, able to lie over it with all eight
   * of its kites on empty ground.
   *
   * This used to be a flood fill looking for *enclosed* pockets too small or too
   * awkward for a hat, and it let the common case straight through. The gaps
   * that actually appear are not enclosed at all — they are notches a kite or
   * two deep along the edge of the garden, wide open to the plane and yet too
   * pinched for any hat to reach into. A fill walks out of one into open ground
   * and calls the whole thing roomy. Asking the question cell by cell instead
   * catches both, and says what the rule means: no space you cannot fill.
   *
   * Four rings, and four is not a guess: two kites of one hat are at most four
   * neighbour-steps apart (measured from HAT_KITES, not assumed), so a placement
   * can only take away the last hat covering a cell within four steps of it.
   * Two rings looked like plenty and let a stranding through in fourteen games
   * out of twenty.
   */
  leavesRoom(cells, added) {
    for (const key of this._nearby(cells, added)) {
      if (!this._coverable(key, added)) return false
    }
    return true
  }

  /** The empty cells a placement could possibly strand: everything within one
   *  hat's reach of it. */
  _nearby(cells, added) {
    let ring = cells
    const out = []
    const seen = new Set(cells)
    for (let step = 0; step < HAT_REACH; step++) {
      const next = []
      for (const key of ring) {
        neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), this._nb)
        for (let j = 0; j < 4; j++) {
          const m = this._nb[j]
          if (seen.has(m)) continue
          seen.add(m)
          if (this.filled.has(m) || added.has(m)) continue
          out.push(m)
          next.push(m)
        }
      }
      ring = next
    }
    return out
  }

  /** Could any hat at all lie over `cell`? */
  _coverable(cell, added) {
    const fa = KEY_A(cell)
    const fb = KEY_B(cell)
    const fk = KEY_K(cell)
    for (let o = 0; o < 12; o++) {
      const base = ORIENT_KITES[o]
      for (let i = 0; i < 8; i++) {
        if (base[i][2] !== fk) continue
        const ta = fa - base[i][0]
        const tb = fb - base[i][1]
        let free = true
        for (let j = 0; j < 8; j++) {
          const kk = base[j]
          const key = ((kk[0] + ta + 1024) << 15) | ((kk[1] + tb + 1024) << 3) | kk[2]
          if (this.filled.has(key) || added.has(key)) {
            free = false
            break
          }
        }
        if (free) return true
      }
    }
    return false
  }

  /**
   * Rule 3b — no walled-in stream. Every river mouth this tile opens must still
   * have somewhere to go: an empty cell across it that some hat could cover with
   * a crossing on that same edge. A river may end at a spring, but it may never
   * be bricked up.
   */
  streamsCanFlow(orient, ta, tb, ports, cells, added) {
    // Every mouth this tile opens must have somewhere to go…
    const consumed = new Set()
    for (const x of this.crossings(orient, ta, tb, cells, [])) {
      if (!ports.has(x.slot)) continue
      if (this.filled.has(x.far)) {
        consumed.add(x.edge) // this crossing meets one already built
        continue
      }
      // the shared edge is side `x.side` from here, so the other side from there
      if (!this._continuable(x.far, 1 - x.side, added)) return false
    }
    // …and so must every mouth already open elsewhere. Checking only the mouths
    // this tile happens to touch is not enough: a hat covers eight cells, so it
    // can take away the last way of continuing a mouth two cells away without
    // ever bordering it. The open set is small, so check all of it — but skip
    // any mouth that was *already* stuck, or one bad mouth would veto every
    // move on the board and the garden would seize up with tiles still in hand.
    const stuck = this.stuckMouths()
    for (const [edge, m] of this.openMouths) {
      if (consumed.has(edge) || added.has(m[0]) || stuck.has(edge)) continue
      if (!this._continuable(m[0], m[1], added)) return false
    }
    return true
  }

  /**
   * Mouths that already have nowhere to go. No placement can be blamed for
   * these, so none may be rejected on their account. Cached against the board's
   * size, which only ever grows.
   */
  stuckMouths() {
    if (this._stuckAt === this.filled.size) return this._stuck
    const stuck = new Set()
    for (const [edge, m] of this.openMouths) {
      if (!this._continuable(m[0], m[1], NO_CELLS)) stuck.add(edge)
    }
    this._stuck = stuck
    this._stuckAt = this.filled.size
    return stuck
  }

  /** Could any hat cover `cell` with a river crossing on `side` of it? */
  _continuable(cell, side, added) {
    const fa = KEY_A(cell)
    const fb = KEY_B(cell)
    const fk = KEY_K(cell)
    for (let o = 0; o < 12; o++) {
      const flipped = o >= 6
      const base = ORIENT_KITES[o]
      for (let i = 0; i < 8; i++) {
        const s = PORT_SIDE[i]
        if (s === null || worldSide(s, flipped) !== side) continue
        if (base[i][2] !== fk) continue
        const ta = fa - base[i][0]
        const tb = fb - base[i][1]
        let free = true
        for (let j = 0; j < 8; j++) {
          const kk = base[j]
          const key = ((kk[0] + ta + 1024) << 15) | ((kk[1] + tb + 1024) << 3) | kk[2]
          if (this.filled.has(key) || added.has(key)) {
            free = false
            break
          }
        }
        if (free) return true
      }
    }
    return false
  }

  /**
   * Every way a hat could cover `cell` with a river crossing on `side` of it.
   * The same enumeration as _continuable, but collecting rather than stopping at
   * the first — the deck uses it to cut a stream tile that carries the river on.
   */
  continuations(cell, side) {
    const out = []
    const fa = KEY_A(cell)
    const fb = KEY_B(cell)
    const fk = KEY_K(cell)
    for (let o = 0; o < 12; o++) {
      const flipped = o >= 6
      const base = ORIENT_KITES[o]
      for (let i = 0; i < 8; i++) {
        const sd = PORT_SIDE[i]
        if (sd === null || worldSide(sd, flipped) !== side) continue
        if (base[i][2] !== fk) continue
        const ta = fa - base[i][0]
        const tb = fb - base[i][1]
        let free = true
        for (let j = 0; j < 8; j++) {
          const kk = base[j]
          const key = ((kk[0] + ta + 1024) << 15) | ((kk[1] + tb + 1024) << 3) | kk[2]
          if (this.filled.has(key)) {
            free = false
            break
          }
        }
        if (free) out.push({ o, ta, tb, slot: i })
      }
    }
    return out
  }

  /** Every mouth a hat placed here could take its water from — one per port
   *  slot, as MOUTH_KEY(cell, side). A hat laid on any of these carries that
   *  mouth's river on. */
  servedMouths(orient, cells) {
    const flipped = orient >= 6
    const out = []
    for (let i = 0; i < 8; i++) {
      const s = PORT_SIDE[i]
      if (s !== null) out.push(MOUTH_KEY(cells[i], worldSide(s, flipped)))
    }
    return out
  }

  /**
   * Could the water be carried from one open mouth to another in at most `hops`
   * hats? Cells in `avoid` count as occupied, so a town can ask whether the
   * water could reach it *without* running through the ground it is about to
   * stand on.
   *
   * This is what tells a short errand from a hopeless one, and distance across
   * the board does not: the hat's crossings sit only on the six long sides of
   * its outline, so where a river can actually go is far spikier than a circle
   * round its mouth — a town four units away can be unreachable while one eight
   * units off is two tiles' work.
   *
   * The last hat is the interesting one. A mouth is an empty cell with water
   * waiting on one of its two long sides, and a hat covering that cell has a
   * port on only one of them, so the two mouths cannot simply be walked into
   * each other: the closing hat has to serve the destination *and* one of the
   * mouths the chain has opened. So the search grows the chain's frontier and
   * asks, at every step, whether any hat that would close the destination also
   * serves something on it.
   */
  routeTo(fromCell, fromSide, toCell, toSide, hops, avoid = NO_CELLS) {
    const closers = []
    for (const c of this.continuations(toCell, toSide)) {
      const cells = placementKeys(c.o, c.ta, c.tb)
      if (cells.some((key) => avoid.has(key))) continue
      closers.push({ place: c, cells, serves: new Set(this.servedMouths(c.o, cells)) })
    }
    if (closers.length === 0) return null

    let level = [{ cell: fromCell, side: fromSide, used: avoid, first: null, laid: [] }]
    for (let step = 0; step < hops && level.length; step++) {
      for (const st of level) {
        const key = MOUTH_KEY(st.cell, st.side)
        for (const h of closers) {
          if (!h.serves.has(key)) continue
          if (h.cells.some((c) => st.used.has(c))) continue
          // The ground this route needs. Whoever asked can then wave through
          // every placement that does not touch it, instead of running the
          // search again for each of a hundred candidates.
          return { first: st.first ?? h.place, cells: new Set([...st.laid, ...h.cells]) }
        }
      }
      if (step + 1 >= hops) break
      const next = []
      for (const st of level) {
        for (const c of this.continuations(st.cell, st.side)) {
          const cells = placementKeys(c.o, c.ta, c.tb)
          if (cells.some((key) => st.used.has(key))) continue
          const used = new Set(st.used)
          for (const key of cells) used.add(key)
          const first = st.first ?? c
          const laid = [...st.laid, ...cells]
          for (const x of this.crossings(c.o, c.ta, c.tb, cells, [])) {
            if (x.slot === c.slot || this.filled.has(x.far) || used.has(x.far)) continue
            next.push({ cell: x.far, side: 1 - x.side, used, first, laid })
          }
        }
      }
      // A full breadth at three hops is tens of thousands of hats; a wide even
      // sample of it answers "could the water get there" just as well. Thinned
      // by stride rather than by chance, so a seeded garden still replays.
      if (next.length > 700) {
        const stride = Math.ceil(next.length / 700)
        const thin = []
        for (let j = 0; j < next.length; j += stride) thin.push(next[j])
        level = thin
      } else level = next
    }
    return null
  }

  canCarryTo(fromCell, fromSide, toCell, toSide, hops, avoid = NO_CELLS) {
    return this.routeTo(fromCell, fromSide, toCell, toSide, hops, avoid) !== null
  }

  /**
   * Start a new crossing on a tile already laid — the tailrace a mill opens
   * once its wheel turns. Refuses if the ground across it is taken or has
   * nowhere to carry the water on, because that would leave a mouth no
   * placement could ever satisfy and seize the board up.
   */
  openCrossing(tileIndex, slot) {
    const t = this.tiles[tileIndex]
    if (!t || t.ports.has(slot)) return null
    const x = this.crossings(t.orient, t.ta, t.tb, t.cells, []).find((c) => c.slot === slot)
    if (!x || this.filled.has(x.far)) return null
    if (!this._continuable(x.far, 1 - x.side, NO_CELLS)) return null

    t.ports.add(slot)
    this.ports.add(x.edge)
    if (!this.riverParent.has(x.edge)) this.riverParent.set(x.edge, x.edge)
    // the tile's crossings all meet at its hub, so this joins the water it has
    for (const other of this.crossings(t.orient, t.ta, t.tb, t.cells, [])) {
      if (other.slot === slot || !t.ports.has(other.slot)) continue
      const ra = this.riverFind(other.edge)
      const rb = this.riverFind(x.edge)
      if (ra !== rb) this.riverParent.set(rb, ra)
    }
    this.openMouths.set(x.edge, [x.far, 1 - x.side])
    this._stuckAt = -1
    return x
  }

  /**
   * The river crossings the board forces at a spot: the port slots that *must*
   * carry a river because the tile already across that edge does. A tile built
   * with exactly this set is always placeable here as far as the river goes —
   * every forced crossing is met, and no unforced one is opened — which is what
   * makes a dead end impossible.
   */
  demandedPorts(orient, ta, tb, cells = placementKeys(orient, ta, tb)) {
    const want = new Set()
    for (let i = 0; i < 8; i++) if (this.filled.has(cells[i])) return null
    for (const x of this.crossings(orient, ta, tb, cells, [])) {
      if (this.filled.has(x.far) && this.ports.has(x.edge)) want.add(x.slot)
    }
    return want
  }

  // --- placement ------------------------------------------------------------

  /** Drop a tile. Returns { closed, cells, joined } — `joined` counting the
   *  river crossings that met a river already on the board. */
  place(orient, ta, tb, tile, tileIndex) {
    const cells = placementKeys(orient, ta, tb)
    this.tiles.push({
      orient,
      ta,
      tb,
      cells,
      biomes: tile.biomes.slice(),
      ports: new Set(tile.ports),
      flipped: orient >= 6,
    })

    let joined = 0
    let firstEdge = null
    for (const x of this.crossings(orient, ta, tb, cells, [])) {
      if (!tile.ports.has(x.slot)) continue
      this.ports.add(x.edge)
      if (!this.riverParent.has(x.edge)) this.riverParent.set(x.edge, x.edge)
      // every branch of this tile meets at its hub, so they are one network
      if (firstEdge === null) firstEdge = x.edge
      else {
        const ra = this.riverFind(firstEdge)
        const rb = this.riverFind(x.edge)
        if (ra !== rb) this.riverParent.set(rb, ra)
      }
      if (this.filled.has(x.far)) {
        joined++
        this.openMouths.delete(x.edge) // the two halves have met
      } else {
        this.openMouths.set(x.edge, [x.far, 1 - x.side])
      }
    }

    const touched = this._addCells(cells, tile.biomes, tileIndex)
    const closed = this._collectSealed(touched)
    return { closed, cells, joined }
  }

  _addCells(cells, biomes, tileIndex) {
    const touched = new Set()
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      this.filled.add(key)
      this.biome.set(key, biomes[i])
      this.owner.set(key, tileIndex)
      this.parent.set(key, key)
      this.rsize.set(key, 1)
      this.ropen.set(key, 0)
    }
    const isNew = new Set(cells)
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      const b = biomes[i]
      neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), this._nb)
      for (let j = 0; j < 4; j++) {
        const m = this._nb[j]
        if (!this.filled.has(m)) {
          const r = this.find(key)
          this.ropen.set(r, this.ropen.get(r) + 1)
          continue
        }
        if (!isNew.has(m)) {
          const rm = this.find(m)
          this.ropen.set(rm, this.ropen.get(rm) - 1)
          touched.add(rm)
        }
        if (this.biome.get(m) === b) touched.add(this.union(key, m))
      }
      touched.add(this.find(key))
    }
    return touched
  }

  _collectSealed(touched) {
    const out = []
    const done = new Set()
    for (const r0 of touched) {
      const r = this.find(r0)
      if (done.has(r) || this.sealed.has(r)) continue
      done.add(r)
      if (this.ropen.get(r) !== 0) continue
      this.sealed.add(r)
      const size = this.rsize.get(r)
      const biome = this.biome.get(r)
      if (size >= 3) this.landmarks.set(r, this._heart(r))
      out.push({ root: r, size, biome, score: regionScore(size, biome), tiles: regionTiles(size) })
    }
    return out
  }

  /** The cell of a region nearest its own centre — where its pennant goes. */
  _heart(root) {
    const cells = this.regionCells(root)
    let aa = 0
    let ab = 0
    for (const k of cells) {
      aa += KEY_A(k)
      ab += KEY_B(k)
    }
    aa /= cells.length
    ab /= cells.length
    let best = cells[0]
    let bestD = Infinity
    for (const k of cells) {
      const da = KEY_A(k) - aa
      const db = KEY_B(k) - ab
      const d = da * da + da * db + db * db
      if (d < bestD) {
        bestD = d
        best = k
      }
    }
    return best
  }

  /** Every region on the board, sealed or not. */
  allRegions() {
    const out = []
    const seen = new Set()
    for (const key of this.filled) {
      const r = this.find(key)
      if (seen.has(r)) continue
      seen.add(r)
      out.push({ root: r, size: this.rsize.get(r), biome: this.biome.get(key), sealed: this.sealed.has(r) })
    }
    return out
  }

  /** Every cell of the region containing `key` — only needed for the "region
   *  sealed" flourish, so a plain scan is fine. */
  regionCells(key) {
    const root = this.find(key)
    const out = []
    for (const k of this.filled) if (this.find(k) === root) out.push(k)
    return out
  }
}
