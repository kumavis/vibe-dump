// Game state: the deck, the turn, the score. Knows nothing about Three.js.
//
// The ground is flat. Every tile in the garden, the opening massif included,
// sits at the same height — the peak is a feature standing on that ground, not a
// bulge in it. So there is no terrain field here at all, only a per-cell random
// number the renderer scatters trees and rocks with.

import {
  KEY_A,
  KEY_B,
  KEY_K,
  PORT_SLOTS,
  kiteCentre,
  placementKeys,
  candidatePlacements,
  neighbourKeys,
} from './hat.js'
import { Board, PLAINS, BIOME_NAME, openScore } from './board.js'
import { seedGarden, siteNear, townTile, makeTile, fitTile, campTile, CAMPS, mulberry32 } from './tiles.js'

export const START_TILES = 42

/** How often the deck offers a camp rather than plain ground. */
const CAMP_CHANCE = 0.1

const MILL_NAMES = [
  'the mill',
  'the fulling mill',
  'the sawmill',
  'the oil mill',
  'the paper mill',
  'the forge hammer',
  'the last mill on the river',
]

/**
 * The errands, as many as the garden lasts for. Each puts a small town on the
 * board on its own, a short way further down the valley, with a dry leat and a
 * tailrace — and asks you to carry the water to it. Turning its wheel pays,
 * and the next town is sited from the tailrace it just started.
 *
 * A written list of two ran out, and the mill was the only one most gardens ever
 * saw; a river you are still extending on the fortieth tile is a better spine
 * for the game than one that stops paying on the fifth.
 */
export function questAt(i) {
  const name = MILL_NAMES[Math.min(i, MILL_NAMES.length - 1)]
  return {
    key: `mill-${i}`,
    index: i,
    title: i === 0 ? 'Turn the mill wheel' : `Reach ${name}`,
    hint: i === 0 ? 'Carry the headwater down to the mill.' : 'Carry the water on, wheel to wheel.',
    hops: 2,
    dist: 7 + Math.min(i, 3),
    // each one a little further round, so the chain walks the garden rather
    // than running off in a straight line
    turn: i === 0 ? 0 : (i % 2 ? 0.85 : -0.7),
    score: 320 + i * 260,
    tiles: 6 + i,
    unlock: i === 0 ? 'choice' : null,
    unlockNote: i === 0 ? 'The village will now offer you a choice of two tiles.' : '',
  }
}

export class Game {
  constructor(seed = 1) {
    this.seed = seed
    this.rnd = mulberry32(seed)
    this.board = new Board()
    /** key → 0..1, so a tile's trees land in the same place on every reload */
    this.jitter = new Map()
    this.score = 0
    this.tilesLeft = START_TILES
    this.placed = 0
    this.sealedCount = 0
    this.best = { size: 0, biome: PLAINS }
    this.queue = []
    this.log = []
    this.over = false

    this._seed()
    this._refillQueue()
  }

  _remember(cells) {
    for (const key of cells) this.jitter.set(key, this.rnd())
  }

  _seed() {
    const seeded = seedGarden()
    seeded.tiles.forEach((s, ti) => {
      const res = this.board.place(s.orient, s.ta, s.tb, s.tile, ti)
      this._remember(res.cells)
    })
    this.headwater = seeded.headwater
    this.summit = seeded.summit
    this.sites = []
    this.questIndex = 0
    this.canChoose = false
    // The stone under the peak is already ringed by the seed. Freeze it without
    // paying for it — the score should be what the player built.
    for (const key of this.board.filled) {
      const r = this.board.find(key)
      if (this.board.ropen.get(r) === 0) this.board.sealed.add(r)
    }
    this.placed = 3
    this._openSite(0)
  }

  /**
   * Put the next objective's town on the board, standing on its own with a gap
   * of open ground between it and everything else — and, above all, somewhere
   * the water could actually get to.
   *
   * Choosing the spot by distance alone does not work, and it is worth saying
   * why. The hat carries its river across the six long sides of its outline, so
   * the set of places a stream can be carried to is spiky rather than round: a
   * town four units off can be unreachable while one eight units off is two
   * tiles' work. Picked by distance, the mill went dry in three gardens out of
   * five and nothing on screen could have told you which. So the errand is set
   * the other way round — walk `hops` hats out from the water, and put the town
   * where the water can arrive.
   */
  _openSite(i) {
    const q = questAt(i)
    this.quest = null
    if (!this.headwater) return
    const prev = this.sites[this.sites.length - 1]
    // From the last mill's tailrace, not its leat: the water has crossed the
    // town and comes out the far side, and that is where the next reach starts.
    const from = prev ? (prev.tail?.mid ?? prev.mid) : this.headwater.mid
    // Walk out from wherever the mountain's water currently ends. After the
    // first errand that is *not* the town's leat any more — the leat is joined,
    // so it has stopped being a mouth — but one of the open ends of the same
    // river, the one nearest the town you have just finished.
    const root = this.board.riverFind(this.headwater.edge)
    let fromMouth = null
    let bestD = Infinity
    for (const [edge, m] of this.board.openMouths) {
      if (this.board.riverFind(edge) !== root) continue
      const [x, z] = kiteCentre(KEY_A(m[0]), KEY_B(m[0]), KEY_K(m[0]))
      const d = Math.hypot(x - from[0], z - from[1])
      if (d < bestD) {
        bestD = d
        fromMouth = m
      }
    }
    if (!fromMouth) return
    const base = Math.atan2(from[1] - this.summit[1], from[0] - this.summit[0])
    // Rings out from where the water is now, the intended heading first. A later
    // town has a garden in the way, and one slightly off the mark beats one that
    // cannot be reached.
    const targets = []
    for (const spread of [0, 0.4, -0.4, 0.85, -0.85, 1.4, -1.4]) {
      for (const scale of [1, 1.25, 0.8, 1.55]) {
        const ang = base + q.turn + spread
        targets.push([from[0] + Math.cos(ang) * q.dist * scale, from[1] + Math.sin(ang) * q.dist * scale])
      }
    }
    for (const hops of [q.hops, q.hops + 1]) {
      for (const [tx, tz] of targets) if (this._trySite(q, i, tx, tz, from, fromMouth, hops)) return
    }
    // Nowhere in reach at all: rather than an errand that cannot be run, take the
    // best spot going and let the confluence piece do the work.
    for (const [tx, tz] of targets) if (this._trySite(q, i, tx, tz, from, null, 0)) return
  }

  _trySite(q, i, tx, tz, from, fromMouth, hops) {
    // A town whose leat has nowhere to run would be a mouth nothing can ever
    // continue, so take the nearest spot that actually works rather than the
    // nearest spot outright.
    for (const site of siteNear(tx, tz, this.board.filled, 12)) {
      const town = townTile(site, from[0], from[1])
      const added = new Set(site.cells)
      if (!this.board.leavesRoom(site.cells, added)) continue
      const xs = this.board.crossings(site.orient, site.ta, site.tb, site.cells, [])
      const x = xs.find((c) => c.slot === town.slot)
      if (!x || this.board.filled.has(x.far)) continue
      // Only the leat has to work now. The tailrace is not opened until the
      // wheel turns, and which side it comes out of is settled then — insisting
      // on it here threw away good sites for water that was not coming yet.
      if (!this.board._continuable(x.far, 1 - x.side, added)) continue
      // The town's own eight kites are off the table for the river that has to
      // reach it — otherwise the search happily routes the water straight
      // through the ground the town is about to stand on.
      if (fromMouth && !this.board.canCarryTo(fromMouth[0], fromMouth[1], x.far, 1 - x.side, hops, added)) continue
      const res = this.board.place(site.orient, site.ta, site.tb, town.tile, 900 + i)
      this._remember(res.cells)
      const entry = {
        ...q,
        hub: site.hub,
        mid: town.mid,
        edge: town.edge,
        tail: town.tail,
        cells: res.cells,
        tileIndex: this.board.tiles.length - 1,
        done: false,
      }
      this.sites.push(entry)
      this.quest = entry
      return true
    }
    return false
  }

  /** Has the water reached the town yet? */
  _checkQuest() {
    const q = this.quest
    if (!q || q.done) return null
    if (!this.board.riverConnected(this.headwater.edge, q.edge)) return null
    q.done = true
    this.score += q.score
    this.tilesLeft += q.tiles
    if (q.unlock === 'choice') this.canChoose = true
    this.log.unshift(`${q.title} · +${q.score}`)
    // The wheel turns, so the tailrace starts running. Its intended side may
    // have been built over while the water was on its way; any free crossing on
    // the far side of the town will do, and if there is none the water simply
    // ends here and the next mill is sited from the leat.
    for (const slot of [q.tail.slot, ...PORT_SLOTS]) {
      const x = this.board.openCrossing(q.tileIndex, slot)
      if (!x) continue
      q.tail = { edge: x.edge, slot, mid: this.centreOf(x.far) }
      break
    }
    this.questIndex += 1
    this._openSite(this.questIndex)
    return q
  }

  /** Once the mill turns, the village lets you take the other tile instead. */
  swapNext() {
    if (!this.canChoose || this.over || this.queue.length < 2) return false
    const t = this.queue[0]
    this.queue[0] = this.queue[1]
    this.queue[1] = t
    this._fits = null
    this._ensurePlayable()
    return true
  }

  // --- the deck --------------------------------------------------------------

  _refillQueue() {
    while (this.queue.length < 3) this.queue.push(this._deal())
    this._ensurePlayable()
  }

  /** One tile off the top. Mostly ordinary ground; now and then a camp, which
   *  may only be laid where the cover it lives off already is. */
  _deal() {
    if (this.placed > 8 && this.rnd() < CAMP_CHANCE) {
      return campTile(CAMPS[Math.floor(this.rnd() * CAMPS.length)])
    }
    return makeTile(this.rnd)
  }

  /**
   * Where this tile may go — every placement the board's own rules allow, with
   * no extra restriction on rivers.
   *
   * Forcing a stream tile to join an open mouth *does* make one coherent river,
   * and it was the rule here for a while. It also left exactly one legal
   * placement on a stream turn, every time: joining means landing a specific
   * port slot on a specific edge, and the board's other rules trim what is left
   * to a single answer. The river then went wherever the deck sent it and the
   * player could not steer it anywhere. So the guarantee moved into the deck —
   * see _ensurePlayable, which only ever hands out a stream that *can* be
   * carried on — and joining is ranked first and paid for rather than forced.
   */
  _legalFor(tile) {
    const fits = this.board.legalPlacements(tile)
    const q = this.quest
    if (!q || q.done) return fits
    // The leat is a stream like any other, and the garden's own rule is that you
    // may not wall a stream in. A town is placed where the water could reach it
    // in two hats, but two hats is a *specific* piece of open ground, and paving
    // it over is exactly walling the leat in — a third of errands used to die
    // that way, silently, several turns before anyone could tell. So a placement
    // that leaves the mill no route at all is refused, unless it is itself
    // carrying the water on.
    const wants = this._questTargets(q)
    const ends = this._riverEnds()
    if (ends.length === 0 || wants.length === 0) return fits
    const slack = q.hops + 1
    const root = this.board.riverFind(this.headwater.edge)
    const qRoot = this.board.riverFind(q.edge)
    const route = (from, added) => {
      for (const m of from) {
        if (added.has(m[0])) continue
        for (const w of wants) {
          if (added.has(w[0])) continue
          const r = this.board.routeTo(m[0], m[1], w[0], w[1], slack, added)
          if (r) return r
        }
      }
      return null
    }
    const reaches = (from, added) => route(from, added) !== null
    const witness = route(ends, NONE)
    if (!witness) return fits // already lost — do not punish for it

    return fits.filter((f) => {
      // A placement that does not touch the ground one working route stands on
      // cannot have broken it. That is most of them, and it turns a search per
      // candidate into a set lookup per candidate.
      if (!f.cells.some((c) => witness.cells.has(c))) return true
      const added = new Set(f.cells)
      // The route as it stands, minus the ground this tile would take.
      if (reaches(ends, added)) return true
      // …or the tile is itself the next step, in which case the route carries on
      // from the mouths it opens. Testing only the first of those — which is
      // what "let anything that joins a river through" amounted to — waved
      // through every stream laid on some unrelated pond, and one of those paving
      // the mill's only approach on turn one is how a third of errands died.
      if (tile.ports.size === 0) return false
      const opened = []
      let joins = false
      for (const x of this.board.crossings(f.o, f.ta, f.tb, f.cells, [])) {
        if (!tile.ports.has(x.slot)) continue
        if (!this.board.filled.has(x.far)) opened.push([x.far, 1 - x.side])
        else if (this.board.ports.has(x.edge)) {
          const r = this.board.riverFind(x.edge)
          if (r === root) joins = true
          else if (r === qRoot) return true // it *is* the confluence
        }
      }
      return joins && reaches(opened, added)
    })
  }

  /**
   * Where the water has to arrive for the errand in hand.
   *
   * The leat, while it is still open — that is the near side of the mill, the
   * side the river is coming from. Not the tailrace, even though the two are one
   * network: the tailrace is the outflow on the far side of the town, and aiming
   * at it sends the deck round the back of a building it could have met head on.
   * If a passing pond takes the leat's mouth over the errand is not lost, so fall
   * back to the rest of the town's water, tailrace last.
   */
  _questTargets(q) {
    const leat = this.board.openMouths.get(q.edge)
    if (leat) return [leat]
    const tail = q.tail ? this.board.openMouths.get(q.tail.edge) : null
    const rest = this._endsOf(q.edge).filter((m) => !tail || m[0] !== tail[0] || m[1] !== tail[1])
    return rest.length ? rest : this._endsOf(q.edge)
  }

  /** The open ends of whichever river `edge` belongs to. */
  _endsOf(edge) {
    const out = []
    if (!edge || !this.board.riverParent.has(edge)) return out
    const root = this.board.riverFind(edge)
    for (const [e, m] of this.board.openMouths) if (this.board.riverFind(e) === root) out.push(m)
    return out
  }

  _riverEnds() {
    return this.headwater ? this._endsOf(this.headwater.edge) : []
  }

  /** Does this tile have anywhere it could carry the river on? */
  _canJoin(tile, fits) {
    if (tile.ports.size === 0) return true
    return fits.some((f) => this.board.joinsRiver(f.o, f.ta, f.tb, tile.ports, f.cells))
  }

  /**
   * The tile in hand must always have somewhere to go. If the deck's offering
   * has nowhere left, cut one to fit an actual gap instead: exactly the river
   * crossings the board demands there and no others, which is always placeable.
   */
  _ensurePlayable() {
    const tile = this.queue[0]
    if (!tile) return
    let fits = this._legalFor(tile)
    // The moment the two rivers are one tile apart, that tile is what the deck
    // hands you — whatever it was about to deal. Gating this on already holding a
    // stream wasted the chance five turns in six, and a confluence you can see
    // but never be dealt is worse than no errand at all.
    const bridge = this._cutBridge()
    if (bridge) {
      this.queue[0] = bridge.tile
      this._fits = bridge.fits
      return
    }
    // While an errand is running, the stream in hand is cut for it. A tile dealt
    // at random can be laid to start a pond in an empty corner, and measured over
    // a whole game that is what it does: the mountain's river sat exactly where
    // it was while eight unrelated ponds opened around it. Cutting for the errand
    // does not lay the tile — where it goes is still the player's choice, and any
    // legal spot still counts — it only makes sure the piece in hand is one that
    // could carry the water on. A few land turns are turned over to it too, so an
    // errand about rivers is dealt rivers often enough to finish.
    if (this.quest && !this.quest.done && (tile.ports.size > 0 || this.rnd() < 0.25)) {
      const aim = this._cutStream()
      if (aim) {
        this.queue[0] = aim.tile
        this._fits = aim.fits
        return
      }
    }
    if (tile.ports.size > 0 && !this._canJoin(tile, fits)) {
      const cut = this._cutStream()
      if (cut) {
        this.queue[0] = cut.tile
        this._fits = cut.fits
        return
      }
      const land = makeTile(this.rnd, 0)
      const lf = this._legalFor(land)
      if (lf.length > 0) {
        this.queue[0] = land
        this._fits = lf
        return
      }
    }
    if (fits.length > 0) {
      this._fits = fits
      return
    }
    const spots = candidatePlacements(this.board.filled)
    for (let attempt = 0; attempt < spots.length; attempt++) {
      const spot = spots[Math.floor(this.rnd() * spots.length)]
      const cells = placementKeys(spot.o, spot.ta, spot.tb)
      const want = this.board.demandedPorts(spot.o, spot.ta, spot.tb, cells)
      if (!want) continue
      const fitted = fitTile(want, this.rnd)
      const check = this._legalFor(fitted)
      if (check.length > 0) {
        this.queue[0] = fitted
        this._fits = check
        return
      }
    }
    this._fits = []
  }

  /** Re-cut the stream in hand around a crossing the board is actually waiting
   *  for, so that a river tile is always a river tile you can lay. */
  /**
   * When the mountain's river and the town's leat are one tile apart, offer the
   * piece that joins them. It is not a free win — the player still has to see it
   * and lay it — but it stops an errand ending two kites short because no hat in
   * the deck happened to have its crossings in the right two places.
   */
  _cutBridge() {
    const q = this.quest
    if (!q || q.done || !this.headwater) return null
    if (!this.board.riverParent.has(this.headwater.edge) || !this.board.riverParent.has(q.edge)) return null
    const hwRoot = this.board.riverFind(this.headwater.edge)
    const qRoot = this.board.riverFind(q.edge)
    if (hwRoot === qRoot) return null
    for (const c of candidatePlacements(this.board.filled)) {
      const cells = placementKeys(c.o, c.ta, c.tb)
      const xs = this.board.crossings(c.o, c.ta, c.tb, cells, [])
      const ports = new Set()
      let meetsHw = false
      let meetsQ = false
      for (const x of xs) {
        if (!this.board.filled.has(x.far) || !this.board.ports.has(x.edge)) continue
        ports.add(x.slot) // parity: every crossing already there must be met
        const r = this.board.riverFind(x.edge)
        if (r === hwRoot) meetsHw = true
        else if (r === qRoot) meetsQ = true
      }
      if (!meetsHw || !meetsQ) continue
      if (!this.board.placeable(c.o, c.ta, c.tb, ports, cells)) continue
      const tile = fitTile(ports, this.rnd)
      tile.kind = 'confluence'
      const fits = this._legalFor(tile)
      if (fits.length > 0) return { tile, fits }
    }
    return null
  }

  /**
   * Cut a stream around a crossing the board is actually waiting for.
   *
   * Guessing a port set and hoping it lands on a mouth was the old way, and it
   * failed often enough to matter: a guess that cannot join is thrown away for a
   * land tile, so a garden with only a few open mouths quietly stopped being
   * dealt any river at all and the errand died on the vine. So the tile is built
   * from the mouth outwards instead — take a real continuation, ask the board
   * which crossings it demands there, and cut exactly those. That tile joins by
   * construction. A couple of extra mouths on crossings facing open ground keep
   * the water travelling rather than ending here.
   */
  _cutStream() {
    const stuck = this.board.stuckMouths()
    // The two rivers the errand is about: the mountain's, and the town's leat.
    const hwRoot =
      this.headwater && this.board.riverParent.has(this.headwater.edge) ? this.board.riverFind(this.headwater.edge) : null
    const qRoot =
      this.quest && !this.quest.done && this.board.riverParent.has(this.quest.edge)
        ? this.board.riverFind(this.quest.edge)
        : null

    let options = []
    for (const [edge, m] of this.board.openMouths) {
      if (stuck.has(edge)) continue
      const root = this.board.riverFind(edge)
      for (const c of this.board.continuations(m[0], m[1])) options.push({ ...c, root, w: 1 })
    }
    if (options.length === 0) return null

    // With an errand running, the deck stops guessing. Aiming the water "at the
    // town" was two guesses deep and wrong at both: the nearest step is often
    // not a step on any route the hat's geometry actually allows, and the tile
    // cut for it paved the one approach the mill had. So the board is asked for
    // a route outright, and the piece in hand is cut for its *first hat*. That
    // is the errand made concrete: two or three specific tiles, offered one at a
    // time, each one still yours to place wherever you like.
    const wants = this.quest && !this.quest.done ? this._questTargets(this.quest) : []
    const aiming = wants.length > 0 && hwRoot !== null && qRoot !== null && hwRoot !== qRoot
    if (aiming) {
      const steps = []
      for (const m of this._riverEnds()) {
        for (const w of wants) {
          const step = this.board.routeTo(m[0], m[1], w[0], w[1], this.quest.hops + 1)
          if (step) steps.push({ ...step.first, root: hwRoot, w: 1 })
        }
      }
      if (steps.length) options = [...steps, ...options]
      else options.sort((a, b) => (b.root === hwRoot) - (a.root === hwRoot))
    }
    const total = options.reduce((s, o) => s + o.w, 0)

    let best = null
    const tries = aiming ? options.length : 24
    for (let attempt = 0; attempt < tries; attempt++) {
      let pick = options[attempt]
      if (!aiming) {
        let r = this.rnd() * total
        pick = options[options.length - 1]
        for (const o of options) {
          r -= o.w
          if (r <= 0) {
            pick = o
            break
          }
        }
      }
      const cells = placementKeys(pick.o, pick.ta, pick.tb)
      const want = this.board.demandedPorts(pick.o, pick.ta, pick.tb, cells)
      if (!want || !want.has(pick.slot)) continue
      const ports = new Set(want)
      // Extra mouths only where the crossing faces open ground: anywhere else
      // would break the parity that makes this tile placeable here. At least one
      // is compulsory — a tile whose every port is already spoken for *caps* the
      // river it joins, and a capped river can never be carried any further. The
      // deck dealt one of those on average once a game, and the errand it capped
      // was over without anything on screen saying so.
      const free = this.board
        .crossings(pick.o, pick.ta, pick.tb, cells, [])
        .filter((x) => !this.board.filled.has(x.far) && !ports.has(x.slot))
      for (let i = free.length - 1; i > 0; i--) {
        const j = Math.floor(this.rnd() * (i + 1))
        ;[free[i], free[j]] = [free[j], free[i]]
      }
      for (const x of free) {
        if (ports.size >= 3) break
        if (ports.size > want.size && this.rnd() > 0.45) break
        ports.add(x.slot)
      }
      if (!this.board.placeable(pick.o, pick.ta, pick.tb, ports, cells)) continue
      const tile = fitTile(ports, this.rnd)
      tile.kind = 'stream'
      const fits = this._legalFor(tile)
      if (!this._canJoin(tile, fits)) continue
      if (aiming) return { tile, fits }
      if (!best || fits.length > best.fits.length) best = { tile, fits }
      if (best.fits.length >= 12) break
    }
    return best
  }

  get tile() {
    return this.queue[0]
  }

  /** Every legal placement for the tile in hand, cached per turn. */
  get fits() {
    if (!this._fits) this._ensurePlayable()
    return this._fits
  }

  /** Swap the tile in hand for a fresh one. Costs a tile from the stack. */
  reroll() {
    if (this.over || this.tilesLeft <= 1) return false
    this.tilesLeft -= 1
    this.queue.shift()
    this._fits = null
    this._refillQueue()
    return true
  }

  // --- choosing where to put it ---------------------------------------------

  /**
   * Rank the placements that cover `cell`, best first: the one that agrees with
   * its neighbours most, with snugness as the tie-break so the garden stays
   * compact. Hovering a spot and taking the top answer should feel like the
   * tile turned itself the right way round.
   */
  fitsAtCell(cellKey) {
    if (!this.tile) return []
    const out = []
    for (const f of this.fits) {
      if (!f.cells.includes(cellKey)) continue
      out.push({ ...f, ...this._harmony(f.o, f.cells, this.tile) })
    }
    out.sort((a, b) => b.joins - a.joins || b.match - a.match || b.touch - a.touch || a.o - b.o)
    return out
  }

  /** Shared edges, how many of them agree, and how many river crossings meet.
   *  The orientation matters: reflecting the hat swaps which of a kite's two
   *  long sides faces out, so a crossing computed at orient 0 lands on the wrong
   *  edge for any of the six mirrored placements. */
  _harmony(orient, cells, tile) {
    let match = 0
    let touch = 0
    const own = new Set(cells)
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), nbBuf)
      for (let j = 0; j < 4; j++) {
        const m = nbBuf[j]
        if (own.has(m) || !this.board.filled.has(m)) continue
        touch++
        if (this.board.biome.get(m) === tile.biomes[i]) match++
      }
    }
    let joins = 0
    for (const x of this.board.crossings(orient, 0, 0, cells, [])) {
      if (tile.ports.has(x.slot) && this.board.filled.has(x.far) && this.board.ports.has(x.edge)) joins++
    }
    return { match, touch, joins }
  }

  // --- taking the turn -------------------------------------------------------

  place(fit) {
    if (this.over) return null
    const tile = this.tile
    const h = this._harmony(fit.o, fit.cells, tile)
    const perfect = h.touch > 0 && h.match === h.touch

    const res = this.board.place(fit.o, fit.ta, fit.tb, tile, this.placed)
    this._remember(res.cells)
    this.placed += 1
    this.tilesLeft -= 1

    // Every edge that meets its like pays a little, and every stream you carry
    // on pays more. It is the heartbeat of the turn; sealing is the occasion.
    const fitScore = h.match * 3 + res.joined * 6 + (perfect ? 12 : 0)
    this.score += fitScore

    let gained = fitScore
    let bonus = 0
    const announce = []
    for (const r of res.closed) {
      this.score += r.score
      gained += r.score
      bonus += r.tiles
      this.sealedCount += 1
      if (r.size > this.best.size) this.best = { size: r.size, biome: r.biome }
      if (r.size >= 3) {
        announce.push(r)
        this.log.unshift(`${BIOME_NAME[r.biome]} sealed · ${r.size} kites · +${r.score}`)
      }
    }
    // A camp could only be laid where its cover already was, so it has earned
    // its bounty simply by being here.
    const camp = tile.camp ?? null
    if (camp) {
      this.score += camp.score
      gained += camp.score
      bonus += camp.tiles
      this.camps = (this.camps ?? 0) + 1
      this.log.unshift(`${camp.title} · +${camp.score}`)
    }
    const quest = this._checkQuest()
    if (quest) {
      gained += quest.score
      bonus += quest.tiles
    }
    this.tilesLeft += bonus
    this.log.length = Math.min(this.log.length, 5)

    this.queue.shift()
    this._fits = null
    this._refillQueue()
    if (this.tilesLeft <= 0 || this.fits.length === 0) this.finish()
    return { ...res, gained, fitScore, perfect, bonus, announce, quest, camp, ...h, joined: res.joined }
  }

  /** The largest region still open, for the HUD's "growing" line. */
  biggestOpen() {
    let best = null
    for (const r of this.board.allRegions()) {
      if (r.sealed) continue
      if (!best || r.size > best.size) best = r
    }
    return best
  }

  /** Put the garden down: open regions pay out at a third, and that is the end. */
  finish() {
    if (this.over) return
    this.over = true
    this.openTally = []
    for (const r of this.board.allRegions()) {
      if (r.sealed || r.size < 3) continue
      const s = openScore(r.size, r.biome)
      this.score += s
      this.openTally.push({ ...r, score: s })
    }
    this.openTally.sort((a, b) => b.score - a.score)
  }

  /** World XZ of a cell's centre, unscaled — for popping numbers over things. */
  centreOf(key) {
    return kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
  }
}

// Kept out of the class so the hot path stays monomorphic.
const nbBuf = [0, 0, 0, 0]
const NONE = new Set()
