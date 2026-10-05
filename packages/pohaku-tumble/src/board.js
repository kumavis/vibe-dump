import { FIELDS, LEXICON, BY_STONE, LINK_MAX, turns, degree, compSize, unresolved } from './lexicon.js'
import { BOUNDS, CELL, WORD, JITTER, layoutPairs, tileOffsets, beside, linkPath, fieldAnchor, mulberry32 } from './field.js'
import { buildIsland, touchesUpland } from './island.js'

// How many words a pair remembers. A turn prefers a word outside them.
const HISTORY = 6
// A pair may go back to a word it showed lately only when no fresh word is
// free, and only once it has rested this long since its last turn. Shorter,
// and the return undoes a turn the viewer just watched (a card shows "C, was
// B" and the stone flips back to B moments after); the background beat
// already waits 6 s, so 6 s would never bind, and at 25 s a viewer watching
// one word still saw it go back. At a minute a return reads as the stone
// settling, not ping-pong. The rest holds for every word of the six, not just
// the last: when other pairs held all its ways out, a pair resting only from
// the last circled four or five words of its six every few seconds, in view,
// for a quarter of an hour, and a rest from each word as it was left still
// let it round six of them in a minute. On this list a pair is seldom left
// with only words it showed lately, so the rest costs little.
const REST = 60
// The lookahead on a candidate word: how many fresh words lie within three
// turns of it. Counting stops at 40; a word that leads nowhere keeps a tenth.
const REACH = { depth: 3, cap: 40, dead: 0.1 }
// Only words in a component of at least this many are dealt, so no pair opens
// in a little island of three words where every turn after the second repeats.
const COMPONENT_MIN = 12
// How many stones may show one root at once, while anything else will do.
// A few roots (*wai*, *paʻa*, *kai*) are in so many words that the deal's
// neighbour match piled six or seven of one onto a board of forty, and the
// turns, steering toward a root a neighbour already shows, piled them back up
// within minutes: a frame read as one root over and over. The opening is held
// to three; once the stones are turning the steering holds the lines near
// half by itself, and four leaves it the room to. A repeat (*laulau*) shows
// its root twice.
const FACES = { deal: 3, turn: 4 }
// The deal matches a word to a neighbour's root only while fewer than this
// share of the words down so far are on a line. Matching three words in five
// regardless, as Jukugo does, opened a quarter of the boards two thirds wired
// or more, well past the half the turns then steer the lines back to; with no
// match at all, a third of the words opened on a line. Held at half, nine
// openings in ten come down between .45 and .59 linked.
const WIRED = 0.5
// The opening deals a full repeat to at most one pair in sixteen, about their
// share of the dealable words, and never to two neighbouring pairs: side by
// side, ʻINO·ʻINO next to LAU·LAU, they read as a stutter.
const REPEATS = 1 / 16
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
// A word set down on a place can bury it. The small places — the fishpond,
// the loʻi, the house lots, the canoe house — are drawn about the size of a
// word; the lava flow is longer, but its lobes and rope lines are all there
// is of the ʻāina place. The words round one may hide no more than this share
// of its drawing between them, counting the floor their stones stand in front
// of on screen (WORD.hides). Counted on its bounding circle and a word's
// marks alone, a canoe house went two thirds under stone; the flow, not
// counted at all, went half under on the default floor.
const BURY = { fishpond: 0.15, loi: 0.15, kauhale: 0.15, halau: 0.15, lava: 0.2 }
// A field line longer than this doesn't cross the island to its place: it
// runs a short way toward it and ends in an arrow and the place's name, an
// off-page connector (floor.js fieldLink).
const FIELD_REACH = 12.5
// A connector runs STUB.most if its arrow and name land on bare floor there,
// or shorter, down to STUB.least, where they do. Rows of words are 3.6 apart
// and a word and its caption take 2.75 of that, so a connector heading for
// the next row ends between the rows or not at all.
const STUB = { most: 2.6, least: 1.2, step: 0.1 }
// A connector is turned aside, ten degrees at a time and sixty at most, when
// the upland leaves it no room to show, or its name no bare floor to land on.
const ASIDE = Math.PI / 18
const ASIDES = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6]
// The connector's name, as floor.js sets it: italic at 12 px, about 5.5 px a
// letter, centred 9 px past the arrow, running on the side it points; its
// letters reach 7 px above the middle and 4.5 below. It is sized for the
// smallest scale the camera shows the floor at, a phone's 34 px a unit less
// the zoom's breathing, and for the camera's yaw and pitch either way (view.js
// ppuFor, wander): wherever the camera is, the name stays inside its box.
const NAME = { letter: 5.5, gap: 9, up: 7, down: 4.5, ppu: 34 * 0.965 }
const DEG = Math.PI / 180
const LOOKS = [-8, 2].flatMap((yaw) => [52.5, 57.5].map((pitch) => ({ yaw: yaw * DEG, pitch: pitch * DEG })))

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
    // The drawings a word could bury, as sets of sample points, each held to
    // its share; a point once a word hides it is marked.
    this.buried = this.features
      .filter((f) => BURY[f.kind])
      .flatMap((f) => samples(f).map((pts) => ({ pts, share: BURY[f.kind], covered: new Set() })))
    const offsets = tileOffsets()
    const spots = layoutPairs(rng, (cell) => this.whole(cell))
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
      const box = hides(spot)
      for (const { pts, covered } of this.buried) pts.forEach((q, i) => inside(q, box) && covered.add(i))
    }
    return spot
  }

  // Whether the layout may leave the cell centred at `cell` empty: only if
  // neither it nor any cell round it reaches the upland or the compass. Next
  // to them the island has broken the grid already, and a hole there only
  // widens the bare ground. Left to chance, holes gathered round the upland
  // on some floors, and a phone held sideways, looking at the middle, saw one
  // word or none.
  whole([x, z]) {
    return this.clear({ x0: x - 1.5 * CELL.w, z0: z - 1.5 * CELL.h, x1: x + 1.5 * CELL.w, z1: z + 1.5 * CELL.h })
  }

  // Whether a word may be set down at p: clear of the upland and the compass,
  // and not where it would hide more of a place, with the words already round
  // it, than BURY allows.
  fits(p) {
    if (!this.clear(marks(p))) return false
    const box = hides(p)
    return this.buried.every(({ pts, share, covered }) => {
      let n = covered.size
      pts.forEach((q, i) => !covered.has(i) && inside(q, box) && n++)
      return n <= share * pts.length
    })
  }

  // Whether a box on the floor keeps off the upland, which is left alone
  // (DESIGN §3.2): no stone, caption or line reaches into it; and off the
  // star compass.
  clear(box) {
    if (touchesUpland(this.island, box.x0, box.z0, box.x1, box.z1)) return false
    const c = this.island.compass
    const dx = Math.max(box.x0 - c.x, 0, c.x - box.x1)
    const dz = Math.max(box.z0 - c.z, 0, c.z - box.z1)
    return Math.hypot(dx, dz) >= c.r * COMPASS_CLEAR
  }

  // The opening board. Words go down in random order, and while under half
  // of those down are on a line (WIRED), three words in five are picked to
  // share a root with something already nearby, so the first frame has
  // constellations in it rather than waiting for them.
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
  // Every word is picked first from those that keep the opening varied
  // (FACES, REPEATS), and from the rest only when none of those will do: on a
  // list too small for both, variety gives way before a pair is left empty.
  deal() {
    const rng = this.rng
    const ok = (e) => !e.nodeal && !this.used.has(e.word) && compSize(e) >= COMPONENT_MIN
    const pick = (list) => list[Math.floor(rng() * list.length)]
    const order = [...this.pairs]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    // What the opening shows so far: how many stones carry each root, and
    // which pairs hold a repeat.
    const faces = new Map()
    const repeats = new Set()
    const show = (pair, k) => {
      const { a, b } = pair.entry
      faces.set(a, (faces.get(a) ?? 0) + k)
      faces.set(b, (faces.get(b) ?? 0) + k)
      if (a === b) k > 0 ? repeats.add(pair) : repeats.delete(pair)
    }
    const most = Math.max(1, Math.floor(this.pairs.length * REPEATS))
    const varied = (pair) => (e) => {
      if (e.a !== e.b) return (faces.get(e.a) ?? 0) < FACES.deal && (faces.get(e.b) ?? 0) < FACES.deal
      if ((faces.get(e.a) ?? 0) + 2 > FACES.deal || repeats.size >= most) return false
      for (const q of repeats) if (beside(q, pair)) return false
      return true
    }
    const placed = []
    const empty = new Set()
    // Which of the words down so far are on a line: they share a root with
    // another, in reach, along a line desiredLinks would draw.
    const wired = new Set()
    const join = (pair) => {
      for (const q of placed) {
        for (const s of pair.tiles) {
          for (const t of q.tiles) {
            if (s.stone !== t.stone || unresolved(s.stone)) continue
            if (Math.hypot(s.x - t.x, s.z - t.z) <= LINK_MAX && this.lineClear(s, t, s.stone)) wired.add(pair).add(q)
          }
        }
      }
    }
    for (const pair of order) {
      let entry = null
      const fits = varied(pair)
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)
      if (near.length && wired.size < WIRED * placed.length && rng() < 0.6) {
        const q = pick(near)
        const stone = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_STONE.get(stone) ?? []).filter((e) => ok(e) && degree(e) >= 3 && fits(e))
        if (options.length) entry = pick(options)
      }
      for (const allow of [fits, () => true]) {
        for (let k = 5; !entry && k >= 2; k--) {
          const pool = LEXICON.filter((e) => ok(e) && degree(e) >= k && allow(e))
          if (pool.length) entry = pick(pool)
        }
      }
      if (!entry) {
        empty.add(pair)
        continue
      }
      this.setWord(pair, entry)
      show(pair, 1)
      join(pair)
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
  // it hasn't shown in its last six (tier 0) first; failing those, once it has
  // rested (REST), older words from the six (1); failing those, the word it
  // just left (2). A word on another pair is never a target, so no word shows
  // twice. `only` keeps them to one stone's turns.
  targets(pair, now, only = null) {
    const prev = pair.history.at(-1)?.word
    const rested = now - pair.turnedAt >= REST
    const out = []
    for (const index of only == null ? [0, 1] : [only]) {
      for (const entry of turns(pair.entry, index)) {
        if (this.used.has(entry.word)) continue
        let tier = 0
        if (pair.history.some((h) => h.word === entry.word)) {
          if (!rested) continue
          tier = entry.word === prev ? 2 : 1
        }
        out.push({ index, entry, tier })
      }
    }
    const best = Math.min(...out.map((o) => o.tier))
    return out.filter((o) => o.tier === best)
  }

  canTurn(pair, now) {
    return this.targets(pair, now).length > 0
  }

  // Can `pair` turn now and then again, inside a card's two beats? The second
  // turn comes a few seconds after the first, well inside the rest, so it
  // needs a word that is free and that the pair hasn't shown lately — the one
  // the first turn leaves is still on this pair, so never that.
  canTurnTwice(pair, now) {
    return this.targets(pair, now).some(({ entry }) =>
      [0, 1].some((i) =>
        turns(entry, i).some((e) => !this.used.has(e.word) && !pair.history.some((h) => h.word === e.word)),
      ),
    )
  }

  // Pick how `pair` turns over next: which stone, and into what. A turn that
  // would put a root on a fifth stone (FACES) is passed over while any other
  // will do. `linked` is the share of pairs on a shared-root line — the
  // Director passes the share of those in view. Weighted so it hovers around
  // half: below, turns that land on a root a neighbour already shows are
  // favoured; above 0.55, turns that cut a line are. A line counts only if
  // desiredLinks would draw it — not to an unsettled stone, nor across the
  // upland or the compass. Each weight is then scaled by how far the new word
  // can go on from here, so pairs walk into open country, not dead ends.
  // `only` keeps it to one stone, for a stone clicked in manual mode.
  chooseTurn(pair, now, linked = this.linkedFraction(), only = null) {
    let targets = this.targets(pair, now, only)
    if (!targets.length) return null
    const faces = new Map()
    for (const t of this.tiles) faces.set(t.stone, (faces.get(t.stone) ?? 0) + 1)
    const roomy = targets.filter(({ index, entry }) => (faces.get(index === 0 ? entry.a : entry.b) ?? 0) < FACES.turn)
    if (roomy.length) targets = roomy
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

  // Where the field line from `pair` to its place ends, worked out once for
  // each word and place: stones never move. It runs to the place's outline
  // (field.js fieldAnchor) if that is within FIELD_REACH and it gets there
  // clear of the upland, and of the compass on its way to another place.
  // Otherwise it is an off-page connector (`stub`).
  fieldEnd(key, pair, feature) {
    let out = this.fieldEnds.get(key)
    if (out) return out
    const end = fieldAnchor(feature, pair.x, pair.z)
    const toCompass = feature.kind === 'compass'
    const dist = Math.hypot(end[0] - pair.x, end[1] - pair.z)
    const room = this.reaches([pair.x, pair.z], end, toCompass) ?? Infinity
    const toward = Math.atan2(end[1] - pair.z, end[0] - pair.x)
    out =
      dist <= Math.min(FIELD_REACH, room)
        ? { end, stub: false }
        : this.connector(pair, toward, room, toCompass, FIELDS[feature.field].label)
    this.fieldEnds.set(key, out)
    return out
  }

  // A connector runs toward its place and stops 0.3 short of where it would
  // reach the upland or the compass (`room`, along `toward`). It ends where
  // it shows past its own stones and its arrow and the place's name land on
  // bare floor: pointing as near the place as it can (ASIDES), and as long as
  // it can. About one connector in sixty finds no such spot; it ends where
  // the least of its name lies on a word.
  connector(pair, toward, room, toCompass, name) {
    const from = [pair.x, pair.z]
    const tip = (a, len) => [pair.x + Math.cos(a) * len, pair.z + Math.sin(a) * len]
    const run = (k, a) =>
      Math.min(STUB.most, (k === 0 ? room : (this.reaches(from, tip(a, STUB.most + 0.3), toCompass) ?? Infinity)) - 0.3)
    let best = tip(toward, Math.max(0, run(0, toward)))
    let least = Infinity
    for (const k of ASIDES) {
      const a = toward + k * ASIDE
      for (let len = run(k, a); len >= STUB.least; len -= STUB.step) {
        if (len - underStones(a) < 0.3) continue
        const end = tip(a, len)
        const cover = this.cover(end, a, name)
        if (cover === 0) return { end, stub: true }
        if (cover < least) {
          least = cover
          best = end
        }
      }
    }
    return { end: best, stub: true }
  }

  // How much of a connector's name, and of its arrow's tip at `end`, heading
  // at `a`, lies on words — their captions and the floor their stones hide —
  // as an area of floor; Infinity if it reaches into the upland or onto the
  // compass.
  cover(end, a, name) {
    const box = nameBox(end, a, name)
    if (!this.clear(box)) return Infinity
    return this.pairs.reduce((sum, p) => sum + overlap(box, hides(p)), 0)
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

// The floor a connector's name may cover, and its arrow's tip at `end`: where
// floor.js would set the name, heading at `a` on the floor, through each of
// the camera's LOOKS at NAME's scale.
function nameBox([ex, ez], a, name) {
  const w = name.length * NAME.letter
  const ux = Math.cos(a)
  const uz = Math.sin(a)
  const box = { x0: ex, x1: ex, z0: ez, z1: ez }
  for (const { yaw, pitch } of LOOKS) {
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    const sp = Math.sin(pitch)
    // The heading on screen (Scene3D's projection), and the name's corners
    // round the tip, in pixels.
    const on = Math.atan2(sp * (sy * ux + cy * uz), cy * ux - sy * uz)
    const mx = Math.cos(on) * NAME.gap
    const my = Math.sin(on) * NAME.gap
    for (const px of Math.cos(on) >= 0 ? [mx, mx + w] : [mx - w, mx]) {
      for (const py of [my - NAME.up, my + NAME.down]) {
        // Back from the screen to the floor.
        const x = ex + (cy * px + (sy * py) / sp) / NAME.ppu
        const z = ez + (-sy * px + (cy * py) / sp) / NAME.ppu
        box.x0 = Math.min(box.x0, x)
        box.x1 = Math.max(box.x1, x)
        box.z0 = Math.min(box.z0, z)
        box.z1 = Math.max(box.z1, z)
      }
    }
  }
  return box
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
  return offset(WORD.marks, p.x, p.z)
}

// What a word at p keeps from the camera (WORD.hides).
function hides(p) {
  return offset(WORD.hides, p.x, p.z)
}

function offset(m, x, z) {
  return { x0: x + m.x0, z0: z + m.z0, x1: x + m.x1, z1: z + m.z1 }
}

function inside([x, z], box) {
  return x > box.x0 && x < box.x1 && z > box.z0 && z < box.z1
}

// The area two boxes share.
function overlap(a, b) {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
  const h = Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0)
  return w > 0 && h > 0 ? w * h : 0
}

// A place's drawing as sets of points: those of a 24 × 24 grid over it that
// fall inside the outlines SHAPES names, or in the house lots' rectangle; and
// 48 along each outline, counted on their own, since a word over a thin
// stretch of wall or lava edge buries much of the line but little of what it
// encloses. The canoe house's bounding circle is mostly bare sand, so a word
// could cover the shed and the canoe both and still leave most of the circle
// clear; the fishpond's circle is its water, and leaves out the ends of the
// wall that make it a pond.
const SHAPES = {
  halau: (p) => [p.shed, ...p.hulls],
  fishpond: (p) => [p.line],
  lava: (p) => [p.line],
  loi: (p) => [p.line],
}
function samples(place) {
  const shapes = SHAPES[place.kind]?.(place)
  const pts = shapes ? shapes.flat() : [[place.x - place.hw, place.z - place.hh], [place.x + place.hw, place.z + place.hh]]
  const xs = pts.map((p) => p[0])
  const zs = pts.map((p) => p[1])
  const [x0, x1, z0, z1] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)]
  const N = 24
  const out = []
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = x0 + ((x1 - x0) * (i + 0.5)) / N
      const z = z0 + ((z1 - z0) * (j + 0.5)) / N
      if (!shapes || shapes.some((s) => inPolygon(s, x, z))) out.push([x, z])
    }
  }
  return shapes ? [out, shapes.flatMap((s) => along(s, 48))] : [out]
}

// n points evenly spaced along a polyline.
function along(pts, n) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const out = []
  for (let k = 0, i = 1; k < n; k++) {
    const d = (cum.at(-1) * (k + 0.5)) / n
    while (cum[i] < d) i++
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
    out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t])
  }
  return out
}

function inPolygon(poly, x, z) {
  let odd = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) odd = !odd
  }
  return odd
}
