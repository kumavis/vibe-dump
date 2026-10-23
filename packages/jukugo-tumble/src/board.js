import { LEXICON, BY_CHAR, FIELDS, turns, degree } from './lexicon.js'
import { layoutPairs, layoutFeatures, tileOffsets, mulberry32 } from './field.js'

// Longest line two blocks showing the same character will run to each other.
// Past this they are strangers, so a common character makes a few separate
// constellations across the floor instead of one web.
export const LINK_MAX = 11.5

export class Board {
  constructor(seed) {
    const rng = mulberry32(seed)
    this.rng = rng
    this.features = layoutFeatures(rng, Object.keys(FIELDS))
    this.featureOf = new Map(this.features.map((f) => [f.field, f]))
    this.pairs = layoutPairs(rng).map((p, id) => ({
      id,
      ...p,
      entry: null,
      history: [],
      tiles: tileOffsets(p.dir).map(([dx, dz], index) => ({
        id: id * 2 + index,
        pair: id,
        index,
        x: p.x + dx,
        z: p.z + dz,
        char: '',
      })),
    }))
    this.tiles = this.pairs.flatMap((p) => p.tiles)
    this.used = new Set()
    this.turnCount = 0
    this.deal()
  }

  // The opening board. Words go down in random order, and about half the time
  // a word is picked to share a character with something already nearby, so
  // the first frame has constellations in it rather than waiting for them.
  deal() {
    const rng = this.rng
    const order = [...this.pairs].sort(() => rng() - 0.5)
    const pool = LEXICON.filter((e) => degree(e) >= 5)
    const placed = []
    for (const pair of order) {
      let entry = null
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)
      if (near.length && rng() < 0.6) {
        const q = near[Math.floor(rng() * near.length)]
        const c = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_CHAR.get(c) ?? []).filter((e) => !this.used.has(e.word) && degree(e) >= 3)
        if (options.length) entry = options[Math.floor(rng() * options.length)]
      }
      while (!entry || this.used.has(entry.word)) entry = pool[Math.floor(rng() * pool.length)]
      this.setWord(pair, entry)
      placed.push(pair)
    }
  }

  setWord(pair, entry) {
    if (pair.entry) {
      this.used.delete(pair.entry.word)
      pair.history.push(pair.entry)
      if (pair.history.length > 6) pair.history.shift()
    }
    pair.entry = entry
    this.used.add(entry.word)
    pair.tiles[0].char = entry.a
    pair.tiles[1].char = entry.b
  }

  // Pick how `pair` turns over next: which block, and into what. Weighted so
  // the floor hovers around half its words being wired to another word — when
  // fewer are, turns that land on a character a neighbour already shows are
  // favoured; when more are, turns that cut a link get a nudge instead.
  //
  // `only` keeps it to one block, for a block clicked in manual mode. That
  // block may go back to the word the pair just left, if nothing else will do.
  chooseTurn(pair, only = null) {
    const linked = this.linkedFraction()
    const prev = pair.history.at(-1)?.word
    let options = []
    for (const index of only == null ? [0, 1] : [only]) {
      const tile = pair.tiles[index]
      const near = this.tiles.filter(
        (t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX,
      )
      const breaks = near.some((t) => t.char === tile.char)
      for (const entry of turns(pair.entry, index)) {
        if (this.used.has(entry.word) || (entry.word === prev && only == null)) continue
        const c = index === 0 ? entry.a : entry.b
        const joins = near.some((t) => t.char === c)
        let w = 1
        if (joins) w += linked < 0.5 ? 6 : 1.5
        if (breaks && linked > 0.55) w += 1.5
        if (entry.field !== pair.entry.field) w += 0.6
        // Words that can keep turning make for a livelier board later.
        w *= Math.min(1.5, 0.6 + degree(entry) / 20)
        options.push({ index, entry, w })
      }
    }
    if (options.some((o) => o.entry.word !== prev)) options = options.filter((o) => o.entry.word !== prev)
    if (!options.length) return null
    let r = Math.random() * options.reduce((s, o) => s + o.w, 0)
    for (const o of options) if ((r -= o.w) <= 0) return o
    return options.at(-1)
  }

  turn(pair, choice) {
    this.setWord(pair, choice.entry)
    this.turnCount++
  }

  linkedFraction() {
    const linked = new Set()
    for (const l of this.desiredLinks().values()) if (l.kind === 'pair') linked.add(l.a.pair).add(l.b.pair)
    return linked.size / this.pairs.length
  }

  // The links the floor should be showing for the words as they stand.
  //
  // Blocks showing the same character are joined by a minimum spanning tree —
  // the shortest set of lines that connects every block in reach — so a
  // character on five blocks costs four lines, not ten. A word with no shared
  // character runs a line to the diagram of its semantic field instead.
  desiredLinks() {
    const byChar = new Map()
    for (const t of this.tiles) {
      let list = byChar.get(t.char)
      if (!list) byChar.set(t.char, (list = []))
      list.push(t)
    }
    const out = new Map()
    const wired = new Set()
    for (const [char, tiles] of byChar) {
      if (tiles.length < 2) continue
      const edges = []
      for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
          if (tiles[i].pair === tiles[j].pair) continue
          const d = Math.hypot(tiles[i].x - tiles[j].x, tiles[i].z - tiles[j].z)
          if (d <= LINK_MAX) edges.push([d, i, j])
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
        const key = `p:${a.id}-${b.id}:${char}`
        out.set(key, { key, kind: 'pair', char, a, b })
        wired.add(a.pair).add(b.pair)
      }
    }
    for (const pair of this.pairs) {
      if (wired.has(pair.id)) continue
      const field = pair.entry.field
      const key = `f:${pair.id}:${field}`
      out.set(key, { key, kind: 'field', pair, feature: this.featureOf.get(field) })
    }
    return out
  }
}
