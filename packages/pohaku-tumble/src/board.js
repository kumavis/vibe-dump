import { LEXICON, BY_STONE, LINK_MAX, turns, degree, compSize, unresolved } from './lexicon.js'
import { BOUNDS, layoutPairs, tileOffsets, linkPath, mulberry32 } from './field.js'
import { buildIsland, featureAnchor, touchesUpland } from './island.js'

// How many words a pair remembers. A turn prefers a word outside them.
const HISTORY = 6
// A pair may go back to the word it just left only when nothing else is legal,
// and only after resting this long. Shorter, and the return undoes a turn the
// viewer just watched (a card shows "C, was B" and the stone flips back to B
// moments after); the background beat already waits 6 s, so 6 s would never
// bind. At 25 s a return reads as the stone settling, not ping-pong.
const REST = 25
// The lookahead on a candidate word: how many fresh words lie within three
// turns of it. Counting stops at 40; a word that leads nowhere keeps a tenth.
const REACH = { depth: 3, cap: 40, dead: 0.1 }
// Only words in a component of at least this many are dealt, so no pair opens
// in a little island of three words where every turn after the second repeats.
const COMPONENT_MIN = 12
// What a word covers on the floor around its centre: the two slabs, the
// number above them and the caption typed in beneath, with its gloss running
// on to the right.
const FOOTPRINT = { x0: -1.7, x1: 2, z0: -0.8, z1: 1.3 }
// How close a line may run to the upland's edge.
const MARGIN = 0.12

export class Board {
  constructor(seed) {
    const rng = mulberry32(seed)
    this.rng = rng
    this.island = buildIsland(seed, BOUNDS)
    this.features = this.island.places
    this.featureOf = new Map(this.features.map((f) => [f.field, f]))
    // The upland is left alone (DESIGN §3.2): no stone, caption or line
    // reaches into it. A cell over it stays empty.
    const F = FOOTPRINT
    const clear = (p) => !touchesUpland(this.island, p.x + F.x0, p.z + F.z0, p.x + F.x1, p.z + F.z1)
    // Stones never move, so whether a line between two of them keeps off the
    // upland is worked out once per line and kept.
    this.clearPaths = new Map()
    this.rooms = new Map()
    const offsets = tileOffsets()
    this.pairs = layoutPairs(rng).filter(clear).map((p, id) => ({
      id,
      ...p,
      entry: null,
      history: [],
      turnedAt: -Infinity,
      tiles: offsets.map(([dx, dz], index) => ({
        id: id * 2 + index,
        pair: id,
        index,
        x: p.x + dx,
        z: p.z + dz,
        stone: '',
      })),
    }))
    this.tiles = this.pairs.flatMap((p) => p.tiles)
    this.used = new Set()
    this.turnCount = 0
    this.deal()
  }

  // The opening board. Words go down in random order, and about half the time
  // a word is picked to share a root with something already nearby, so the
  // first frame has constellations in it rather than waiting for them.
  //
  // It never hangs: the five-way bound is a preference that steps down to two
  // (every playable word turns at least two ways), and a pair that finds no
  // word at all is left out before any scene object exists. Words marked
  // `nodeal` are never an opening word, though a pair may turn into one.
  deal() {
    const rng = this.rng
    const ok = (e) => !e.nodeal && !this.used.has(e.word) && compSize(e) >= COMPONENT_MIN
    const pick = (list) => list[Math.floor(rng() * list.length)]
    const order = [...this.pairs]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const placed = []
    const empty = new Set()
    for (const pair of order) {
      let entry = null
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)
      if (near.length && rng() < 0.6) {
        const q = pick(near)
        const stone = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_STONE.get(stone) ?? []).filter((e) => ok(e) && degree(e) >= 3)
        if (options.length) entry = pick(options)
      }
      for (let k = 5; !entry && k >= 2; k--) {
        const pool = LEXICON.filter((e) => ok(e) && degree(e) >= k)
        if (pool.length) entry = pick(pool)
      }
      if (!entry) {
        empty.add(pair)
        continue
      }
      this.setWord(pair, entry)
      placed.push(pair)
    }
    if (empty.size) {
      this.pairs = this.pairs.filter((p) => !empty.has(p))
      this.pairs.forEach((p, id) => {
        p.id = id
        p.tiles.forEach((t, index) => {
          t.id = id * 2 + index
          t.pair = id
        })
      })
      this.tiles = this.pairs.flatMap((p) => p.tiles)
    }
  }

  setWord(pair, entry) {
    if (pair.entry) {
      this.used.delete(pair.entry.word)
      pair.history.push(pair.entry)
      if (pair.history.length > HISTORY) pair.history.shift()
    }
    pair.entry = entry
    this.used.add(entry.word)
    pair.tiles[0].stone = entry.a
    pair.tiles[1].stone = entry.b
  }

  // Every word `pair` may turn into at `now`, in the best tier on offer: words
  // it hasn't shown in its last six (tier 0) first; failing those, older words
  // from the six (1); failing those, once rested, the word it just left (2).
  // A word on another pair is never a target, so no word shows twice.
  targets(pair, now) {
    const prev = pair.history.at(-1)?.word
    const rested = now - pair.turnedAt >= REST
    const out = []
    for (const index of [0, 1]) {
      for (const entry of turns(pair.entry, index)) {
        if (this.used.has(entry.word)) continue
        let tier = 0
        if (entry.word === prev) {
          if (!rested) continue
          tier = 2
        } else if (pair.history.some((h) => h.word === entry.word)) tier = 1
        out.push({ index, entry, tier })
      }
    }
    const best = Math.min(...out.map((o) => o.tier))
    return out.filter((o) => o.tier === best)
  }

  canTurn(pair, now) {
    return this.targets(pair, now).length > 0
  }

  // Can `pair` turn now and then again, inside a card's two beats, without
  // going back? The card's second turn comes well inside the rest.
  canTurnTwice(pair, now) {
    return this.targets(pair, now).some(({ entry }) =>
      [0, 1].some((i) => turns(entry, i).some((e) => !this.used.has(e.word))),
    )
  }

  // Pick how `pair` turns over next: which stone, and into what. `linked` is
  // the share of pairs on a shared-root line — the Director passes the share
  // of those in view. Weighted so it hovers around half: below, turns that
  // land on a root a neighbour already shows are favoured; above 0.55, turns
  // that cut a line are. Each weight is then scaled by how far the new word
  // can go on from here, so pairs walk into open country, not dead ends.
  chooseTurn(pair, now, linked = this.linkedFraction()) {
    const targets = this.targets(pair, now)
    if (!targets.length) return null
    const near = pair.tiles.map((tile) =>
      this.tiles.filter((t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX),
    )
    const options = targets.map(({ index, entry, tier }) => {
      const leaving = pair.tiles[index].stone
      const arriving = index === 0 ? entry.a : entry.b
      const joins = near[index].some((t) => t.stone === arriving)
      const breaks = near[index].some((t) => t.stone === leaving)
      let w = 1
      if (joins) w += linked < 0.5 ? 6 : linked > 0.55 ? 0 : 1.5
      if (breaks && linked > 0.55) w += 3
      if (entry.field !== pair.entry.field) w += 0.6
      const n = this.reach(pair, entry)
      w *= n === 0 ? REACH.dead : n
      return { index, entry, tier, w }
    })
    let r = Math.random() * options.reduce((s, o) => s + o.w, 0)
    for (const o of options) if ((r -= o.w) <= 0) return o
    return options.at(-1)
  }

  // How many words `pair` could still reach within three turns after landing
  // on `entry`, walking only through words that are free and that it hasn't
  // shown lately.
  reach(pair, entry) {
    const seen = new Set(pair.history.map((h) => h.word)).add(pair.entry.word).add(entry.word)
    let frontier = [entry]
    let n = 0
    for (let d = 0; d < REACH.depth && frontier.length; d++) {
      const next = []
      for (const x of frontier) {
        for (const i of [0, 1]) {
          for (const y of turns(x, i)) {
            if (seen.has(y.word) || this.used.has(y.word)) continue
            seen.add(y.word)
            next.push(y)
            if (++n >= REACH.cap) return n
          }
        }
      }
      frontier = next
    }
    return n
  }

  turn(pair, choice, now) {
    this.setWord(pair, choice.entry)
    pair.turnedAt = now
    this.turnCount++
  }

  // Ids of the pairs on at least one shared-root line.
  linkedPairs() {
    const out = new Set()
    for (const l of this.desiredLinks().values()) if (l.kind === 'pair') out.add(l.a.pair).add(l.b.pair)
    return out
  }

  linkedFraction() {
    return this.linkedPairs().size / Math.max(1, this.pairs.length)
  }

  // The links the floor should be showing for the words as they stand.
  //
  // Stones showing the same root are joined by a minimum spanning tree — the
  // shortest set of lines that connects every stone in reach — so a root on
  // five stones costs four lines, not ten. Same root means the same id: *lua*
  // "two" never links to *lua* "pit", and a stone whose sense is unsettled
  // links to nothing. Two stones whose line would cross the upland are out of
  // reach of each other. A word with no shared root runs a line to its
  // field's place on the island instead, with the room it has before the
  // upland, so a line that can't get round it stops short.
  desiredLinks() {
    const byStone = new Map()
    for (const t of this.tiles) {
      if (unresolved(t.stone)) continue
      let list = byStone.get(t.stone)
      if (!list) byStone.set(t.stone, (list = []))
      list.push(t)
    }
    const out = new Map()
    const wired = new Set()
    for (const [stone, tiles] of byStone) {
      if (tiles.length < 2) continue
      const edges = []
      for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
          if (tiles[i].pair === tiles[j].pair) continue
          const [a, b] = tiles[i].id < tiles[j].id ? [tiles[i], tiles[j]] : [tiles[j], tiles[i]]
          const d = Math.hypot(a.x - b.x, a.z - b.z)
          if (d <= LINK_MAX && this.pathClear(`p:${a.id}-${b.id}:${stone}`, a, b)) edges.push([d, i, j])
        }
      }
      edges.sort((a, b) => a[0] - b[0])
      const parent = tiles.map((_, i) => i)
      const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
      for (const [, i, j] of edges) {
        const ri = find(i)
        const rj = find(j)
        if (ri === rj) continue
        parent[ri] = rj
        const [a, b] = tiles[i].id < tiles[j].id ? [tiles[i], tiles[j]] : [tiles[j], tiles[i]]
        const key = `p:${a.id}-${b.id}:${stone}`
        out.set(key, { key, kind: 'pair', stone, a, b })
        wired.add(a.pair).add(b.pair)
      }
    }
    for (const pair of this.pairs) {
      if (wired.has(pair.id)) continue
      const field = pair.entry.field
      const key = `f:${pair.id}:${field}`
      const feature = this.featureOf.get(field)
      out.set(key, { key, kind: 'field', pair, feature, room: this.room(key, pair, feature) })
    }
    return out
  }

  // Does the line `key` from stone a to stone b keep off the upland, along
  // the path it will actually be drawn on?
  pathClear(key, a, b) {
    let ok = this.clearPaths.get(key)
    if (ok === undefined) {
      const pts = linkPath(key, a, b)
      ok = pts.every((p, i) => i === 0 || !this.reachesUpland(pts[i - 1], p))
      this.clearPaths.set(key, ok)
    }
    return ok
  }

  // How far a field line from `pair` toward its place can run before it
  // would reach into the upland: Infinity if it gets there clear.
  room(key, pair, feature) {
    let room = this.rooms.get(key)
    if (room === undefined) {
      const [x, z] = featureAnchor(feature, pair.x, pair.z)
      room = this.reachesUpland([pair.x, pair.z], [x, z]) ?? Infinity
      this.rooms.set(key, room)
    }
    return room
  }

  // Walking from p toward q, the distance at which a line comes within MARGIN
  // of the upland, or null if it never does.
  reachesUpland([px, pz], [qx, qz]) {
    const len = Math.hypot(qx - px, qz - pz)
    const n = Math.ceil(len / 0.1)
    for (let i = 0; i <= n; i++) {
      const x = px + ((qx - px) * i) / n
      const z = pz + ((qz - pz) * i) / n
      if (touchesUpland(this.island, x - MARGIN, z - MARGIN, x + MARGIN, z + MARGIN)) return (len * i) / n
    }
    return null
  }
}
