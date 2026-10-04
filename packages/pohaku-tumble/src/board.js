import { LEXICON, BY_STONE, LINK_MAX, turns, degree, compSize, unresolved } from './lexicon.js'
import { BOUNDS, WORD, JITTER, layoutPairs, tileOffsets, beside, linkPath, fieldAnchor, mulberry32 } from './field.js'
import { buildIsland, touchesUpland } from './island.js'

// How many words a pair remembers. A turn prefers a word outside them.
const HISTORY = 6
// A pair may go back to the word it just left only when nothing else is legal,
// and only after resting this long. Shorter, and the return undoes a turn the
// viewer just watched (a card shows "C, was B" and the stone flips back to B
// moments after); the background beat already waits 6 s, so 6 s would never
// bind, and at 25 s a viewer watching one word still saw it go back. At a
// minute a return reads as the stone settling, not ping-pong. It costs
// nothing: on this list a pair is almost never left with only the way back.
const REST = 60
// The lookahead on a candidate word: how many fresh words lie within three
// turns of it. Counting stops at 40; a word that leads nowhere keeps a tenth.
const REACH = { depth: 3, cap: 40, dead: 0.1 }
// Only words in a component of at least this many are dealt, so no pair opens
// in a little island of three words where every turn after the second repeats.
const COMPONENT_MIN = 12
// The opening shows no stone on more than this many faces: a few roots (*wai*,
// *paʻa*, *kai*) are in so many words that the deal's neighbour match piled
// six or seven of one onto a board of forty, and a frame read as one root
// over and over. A repeat (*laulau*) shows its stone twice. And repeats
// themselves, which read as a stutter side by side, open on at most one pair
// in sixteen — about their share of the dealable words — and never in
// neighbouring cells. Both give way, on a list too small to meet them, before
// a pair would be left empty.
const DEAL_FACES = 3
const DEAL_REPEATS = 1 / 16
// How close a line may run to the upland's edge.
const MARGIN = 0.12
// The star compass is the lani place, and the one place whose drawing is the
// point: thirty-two named houses round a rim, a star rising and setting in
// houses of the same name. No word is set down on it, nor on its rim ticks or
// the credit just outside. No line crosses it either: a line keeps this much
// further out again, about half its shared-root capsule, so the capsule at a
// line's middle can't sit on the house names or the credit.
const COMPASS_CLEAR = 1.12
const CAPSULE = 0.2
// The small places — the fishpond, the loʻi, the house lots, the canoe house —
// are drawn about the size of a word, and a word set down on one buries it.
// The words round one may cover no more than this share of it between them.
const SMALL = new Set(['fishpond', 'loi', 'kauhale', 'halau'])
const BURY = 0.15
// The step a field connector is turned aside by when the upland leaves it no
// room to show.
const ASIDE = Math.PI / 18

export class Board {
  constructor(seed) {
    const rng = mulberry32(seed)
    this.rng = rng
    this.island = buildIsland(seed, BOUNDS)
    this.features = this.island.places
    this.featureOf = new Map(this.features.map((f) => [f.field, f]))
    // Stones never move, so whether a line between two of them keeps off the
    // upland, and where a word's field line ends, are worked out once each
    // and kept.
    this.clearPaths = new Map()
    this.fieldEnds = new Map()
    // The small places' drawings as sample points; a point once a word
    // covers it is marked.
    this.small = this.features.filter((f) => SMALL.has(f.kind)).map((f) => ({ pts: samples(f), covered: new Set() }))
    const offsets = tileOffsets()
    const spots = layoutPairs(rng)
      .map((p) => this.settle(p))
      .filter(Boolean)
    this.pairs = spots.map(({ x, z, dir }, id) => ({
      id,
      x,
      z,
      dir,
      entry: null,
      history: [],
      turnedAt: -Infinity,
      tiles: offsets.map(([dx, dz], index) => ({
        id: id * 2 + index,
        pair: id,
        index,
        x: x + dx,
        z: z + dz,
        stone: '',
      })),
    }))
    this.tiles = this.pairs.flatMap((p) => p.tiles)
    this.used = new Set()
    this.turnCount = 0
    this.deal()
  }

  // Where in its cell the word laid out at p stands: there if it fits,
  // otherwise the nearest spot within the cell's jitter that does; failing
  // that, nowhere, and the cell stays empty.
  settle(p) {
    let spot = this.fits(p) ? p : null
    if (!spot) {
      const spots = []
      for (let i = -4; i <= 4; i++) {
        for (let j = -4; j <= 4; j++) {
          spots.push({ ...p, x: p.cell[0] + (i / 4) * JITTER.x, z: p.cell[1] + (j / 4) * JITTER.z })
        }
      }
      spots.sort((a, b) => Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z))
      spot = spots.find((q) => this.fits(q)) ?? null
    }
    if (spot) {
      const box = marks(spot)
      for (const { pts, covered } of this.small) pts.forEach((q, i) => inside(q, box) && covered.add(i))
    }
    return spot
  }

  // Whether a word may be set down at p. The upland is left alone (DESIGN
  // §3.2): no stone, caption or line reaches into it. Nor is any word set on
  // the star compass, or where it would take a small place, with the words
  // already round it, past BURY.
  fits(p) {
    const box = marks(p)
    if (touchesUpland(this.island, box.x0, box.z0, box.x1, box.z1)) return false
    const c = this.island.compass
    const dx = Math.max(box.x0 - c.x, 0, c.x - box.x1)
    const dz = Math.max(box.z0 - c.z, 0, c.z - box.z1)
    if (Math.hypot(dx, dz) < c.r * COMPASS_CLEAR) return false
    return this.small.every(({ pts, covered }) => {
      let n = covered.size
      pts.forEach((q, i) => !covered.has(i) && inside(q, box) && n++)
      return n <= BURY * pts.length
    })
  }

  // The opening board. Words go down in random order, and about half the time
  // a word is picked to share a root with something already nearby, so the
  // first frame has constellations in it rather than waiting for them.
  //
  // It never hangs: the five-way bound is a preference that steps down to two
  // (every playable word turns at least two ways), and a pair that finds no
  // word at all is left out before any scene object exists. Words marked
  // `nodeal` are never an opening word, though a pair may turn into one.
  //
  // The neighbour match can pull a whole small root family onto the board
  // together — all six *hōkū* words, say — and then a pair whose every turn
  // is a word another pair holds can't move at all, rested or not. Such a
  // pair is dealt again, from words with a turn still free. A new word can
  // take another pair's last free turn, so this runs again, a few times at
  // most; on any real list it settles in one.
  //
  // Every choice is made first among the words that keep the opening varied
  // (DEAL_FACES, DEAL_REPEATS), and only from the rest when none of those
  // will do.
  deal() {
    const rng = this.rng
    const ok = (e) => !e.nodeal && !this.used.has(e.word) && compSize(e) >= COMPONENT_MIN
    const pick = (list) => list[Math.floor(rng() * list.length)]
    const order = [...this.pairs]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    // What the opening shows so far: faces per stone, and the pairs on a repeat.
    const faces = new Map()
    const repeats = new Set()
    const show = (pair, k) => {
      const { a, b } = pair.entry
      faces.set(a, (faces.get(a) ?? 0) + k)
      faces.set(b, (faces.get(b) ?? 0) + k)
      if (a === b) k > 0 ? repeats.add(pair) : repeats.delete(pair)
    }
    const maxRepeats = Math.max(1, Math.floor(this.pairs.length * DEAL_REPEATS))
    const varied = (pair) => (e) => {
      const k = e.a === e.b ? 2 : 1
      if ((faces.get(e.a) ?? 0) + k > DEAL_FACES || (faces.get(e.b) ?? 0) + k > DEAL_FACES) return false
      return e.a !== e.b || (repeats.size < maxRepeats && ![...repeats].some((q) => beside(q, pair)))
    }
    const anything = () => true
    const placed = []
    const empty = new Set()
    for (const pair of order) {
      let entry = null
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)
      if (near.length && rng() < 0.6) {
        const q = pick(near)
        const stone = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_STONE.get(stone) ?? []).filter((e) => ok(e) && degree(e) >= 3 && varied(pair)(e))
        if (options.length) entry = pick(options)
      }
      for (const fits of [varied(pair), anything]) {
        for (let k = 5; !entry && k >= 2; k--) {
          const pool = LEXICON.filter((e) => ok(e) && degree(e) >= k && fits(e))
          if (pool.length) entry = pick(pool)
        }
      }
      if (!entry) {
        empty.add(pair)
        continue
      }
      this.setWord(pair, entry)
      show(pair, 1)
      placed.push(pair)
    }
    const free = (e) => [0, 1].some((i) => turns(e, i).some((t) => !this.used.has(t.word)))
    for (let pass = 0; pass < 4; pass++) {
      const frozen = placed.filter((p) => !this.canTurn(p, Infinity))
      if (!frozen.length) break
      for (const pair of frozen) {
        show(pair, -1)
        const pool = LEXICON.filter((e) => ok(e) && free(e))
        const better = pool.filter(varied(pair))
        if (pool.length) this.redeal(pair, pick(better.length ? better : pool))
        show(pair, 1)
      }
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

  // Swap a dealt word for another before anything has been shown: no history.
  redeal(pair, entry) {
    this.used.delete(pair.entry.word)
    pair.entry = null
    this.setWord(pair, entry)
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
  // that cut a line are. A line counts only if desiredLinks would draw it —
  // not to an unsettled stone, nor across the upland or the compass. Each
  // weight is then scaled by how far the new word can go on from here, so
  // pairs walk into open country, not dead ends.
  chooseTurn(pair, now, linked = this.linkedFraction()) {
    const targets = this.targets(pair, now)
    if (!targets.length) return null
    const near = pair.tiles.map((tile) =>
      this.tiles.filter((t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX),
    )
    const wired = (index, stone) =>
      !unresolved(stone) && near[index].some((t) => t.stone === stone && this.lineClear(pair.tiles[index], t, stone))
    const options = targets.map(({ index, entry, tier }) => {
      const joins = wired(index, index === 0 ? entry.a : entry.b)
      const breaks = wired(index, pair.tiles[index].stone)
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
  // links to nothing. Two stones whose line would cross the upland or the
  // star compass are out of reach of each other. A word with no shared root
  // runs a line to its field's place on the island instead, with the room it
  // has before either, so a line that can't get round them stops short.
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
          const d = Math.hypot(tiles[i].x - tiles[j].x, tiles[i].z - tiles[j].z)
          if (d <= LINK_MAX && this.lineClear(tiles[i], tiles[j], stone)) edges.push([d, i, j])
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
        const [a, b] = ordered(tiles[i], tiles[j])
        const key = lineKey(a, b, stone)
        out.set(key, { key, kind: 'pair', stone, a, b })
        wired.add(a.pair).add(b.pair)
      }
    }
    for (const pair of this.pairs) {
      if (wired.has(pair.id)) continue
      const field = pair.entry.field
      const key = `f:${pair.id}:${field}`
      const feature = this.featureOf.get(field)
      out.set(key, { key, kind: 'field', pair, feature, ...this.fieldEnd(key, pair, feature) })
    }
    return out
  }

  // Would a line joining stones s and t, both showing `stone`, keep off the
  // upland and the compass, along the path it would actually be drawn on?
  lineClear(s, t, stone) {
    const [a, b] = ordered(s, t)
    const key = lineKey(a, b, stone)
    let ok = this.clearPaths.get(key)
    if (ok === undefined) {
      const pts = linkPath(key, a, b)
      ok = pts.every((p, i) => i === 0 || this.reaches(pts[i - 1], p) === null)
      this.clearPaths.set(key, ok)
    }
    return ok
  }

  // Where the field line from `pair` lands on its place (field.js
  // fieldAnchor), and how far it can run toward it before it would reach into
  // the upland, or across the compass on its way to another place: Infinity
  // if it gets there clear. links.js cuts a line that can't get there down to
  // a connector 0.3 short; if that would end under the word's own stones, the
  // connector is turned aside, ten degrees at a time, until it has room to
  // show.
  fieldEnd(key, pair, feature) {
    let out = this.fieldEnds.get(key)
    if (out) return out
    const from = [pair.x, pair.z]
    const end = fieldAnchor(feature, pair.x, pair.z)
    const toCompass = feature.kind === 'compass'
    out = { end, room: this.reaches(from, end, toCompass) ?? Infinity }
    const dist = Math.hypot(end[0] - pair.x, end[1] - pair.z)
    const toward = Math.atan2(end[1] - pair.z, end[0] - pair.x)
    const shows = (room, a) => room >= dist || room - 0.3 - underStones(a) >= 0.3
    for (let k = 1; k <= 12 && !shows(out.room, toward); k++) {
      const a = toward + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * ASIDE
      const to = [pair.x + Math.cos(a) * dist, pair.z + Math.sin(a) * dist]
      // Always a connector: a turned line doesn't reach the place.
      const room = Math.min(this.reaches(from, to, toCompass) ?? Infinity, dist - 0.01)
      if (shows(room, a)) {
        out = { end: to, room }
        break
      }
    }
    this.fieldEnds.set(key, out)
    return out
  }

  // Walking from p toward q, the distance at which a line first reaches ground
  // it must keep off — within MARGIN of the upland, or the compass's clearance
  // unless the compass is where it is going — or null if it never does.
  reaches(p, q, toCompass = false) {
    const u = this.reachesUpland(p, q)
    const c = toCompass ? null : this.reachesCompass(p, q)
    return u === null ? c : c === null ? u : Math.min(u, c)
  }

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

  // Where the segment p→q first enters the circle a line keeps out of round
  // the compass, as a distance from p.
  reachesCompass([px, pz], [qx, qz]) {
    const c = this.island.compass
    const R = c.r * COMPASS_CLEAR + CAPSULE
    const dx = qx - px
    const dz = qz - pz
    const fx = px - c.x
    const fz = pz - c.z
    const a = dx * dx + dz * dz
    const b = fx * dx + fz * dz
    const k = fx * fx + fz * fz - R * R
    if (k <= 0) return 0
    const disc = b * b - a * k
    if (disc < 0 || a === 0) return null
    const t = (-b - Math.sqrt(disc)) / a
    return t >= 0 && t <= 1 ? t * Math.sqrt(a) : null
  }
}

// How far a line from a word's centre runs under its stones, heading at
// angle a.
function underStones(a) {
  const { hx, hz } = WORD.slabs
  return Math.min(hx / Math.abs(Math.cos(a) || 1e-9), hz / Math.abs(Math.sin(a) || 1e-9))
}

// A line's two stones in id order, and its key: the key picks the line's
// route (field.js linkPath), so every caller must build it the same way.
function ordered(s, t) {
  return s.id < t.id ? [s, t] : [t, s]
}

function lineKey(a, b, stone) {
  return `p:${a.id}-${b.id}:${stone}`
}

// What a word at p covers on the floor: its stones and the marks round them.
function marks(p) {
  const m = WORD.marks
  return { x0: p.x + m.x0, z0: p.z + m.z0, x1: p.x + m.x1, z1: p.z + m.z1 }
}

function inside([x, z], box) {
  return x > box.x0 && x < box.x1 && z > box.z0 && z < box.z1
}

// A small place's drawing as a 24 × 24 grid of points: over its rectangle if
// it has one (the house lots), its circle otherwise.
function samples(place) {
  const N = 24
  const hw = place.hw ?? place.r
  const hh = place.hh ?? place.r
  const out = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = place.x + hw * ((2 * i + 1) / N - 1)
      const z = place.z + hh * ((2 * j + 1) / N - 1)
      if (place.hw == null && Math.hypot(x - place.x, z - place.z) > place.r) continue
      out.push([x, z])
    }
  }
  return out
}
