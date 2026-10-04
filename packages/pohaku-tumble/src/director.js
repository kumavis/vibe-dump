// Decides what happens when: which word turns next, which words carry a note,
// and when the lines get rewired. Two rhythms run at once — a background
// pulse of turns anywhere in view, and the noted words, which turn on a slower
// beat so each card gets to show its word changing.

const ROLL = 0.86

export class Director {
  constructor({ board, scene, links, notes, ripples }) {
    this.board = board
    this.scene = scene
    this.links = links
    this.notes = notes
    this.ripples = ripples
    this.paused = false
    this.lastTurn = new Map()
    this.meta = new Map()
  }

  start(now) {
    this.t0 = now
    this.nextBackground = now + 3.6
    this.nextNoteCheck = now + 1.7
  }

  capacity() {
    const w = this.scene.w
    return w < 520 ? 1 : w < 700 ? 2 : w < 1440 ? 3 : 4
  }

  // Pairs whose middle is comfortably on screen.
  inView(margin = 0.1) {
    const { w, h } = this.scene
    return this.board.pairs.filter((p) => {
      const [x, y] = this.scene.project(p.x, 0.5, p.z)
      return x > w * margin && x < w * (1 - margin) && y > h * (margin + 0.06) && y < h * (1 - margin - 0.04)
    })
  }

  // Busy blocks: mid-tumble, or still falling in at the start.
  rolling(pair) {
    return pair.tiles.some((t) => this.scene.block(t).roll || this.scene.block(t).drop)
  }

  // Turn one block of `pair` over. Lines on the turning block let go at
  // once; the new ones wait for it to land.
  turnPair(pair, now) {
    if (this.rolling(pair)) return false
    const choice = this.board.chooseTurn(pair)
    if (!choice) return false
    const prev = pair.entry
    const tile = pair.tiles[choice.index]
    this.board.turn(pair, choice)
    const start = now + 0.12
    const land = this.scene.block(tile).turn(tile.char, start, ROLL)
    const e = pair.entry
    const cap = pair.caption
    pair.caption = {
      prev1: cap.text1,
      prev2: cap.text2,
      text1: e.romaji.toUpperCase(),
      text2: e.gloss,
      t0: start + ROLL * 0.62,
    }
    this.notes.turn(pair, choice.index, prev, start + ROLL * 0.32)
    this.ripples.push({ x: tile.x, z: tile.z, t0: land - 0.1, dur: 0.95 })
    const landOf = (t) => this.scene.block(t).landsAt()
    this.links.sync(this.board.desiredLinks(), now, {
      origin: tile.id,
      holdUntil: (d) =>
        d.kind === 'pair' ? Math.max(landOf(d.a), landOf(d.b)) : Math.max(...d.pair.tiles.map(landOf)),
    })
    this.lastTurn.set(pair, now)
    return true
  }

  openNote(pair, now) {
    const note = this.notes.open(pair, now)
    this.meta.set(note, { nextTurn: now + 1.15, turnsLeft: 2 })
    return note
  }

  // A clicked block turns now, and gets a note if it hasn't one.
  poke(pair, now) {
    if (!this.notes.has(pair)) {
      const open = this.notes.list.filter((n) => !n.closing)
      if (open.length >= this.capacity()) this.notes.close(open[0], now)
      this.openNote(pair, now)
    }
    const note = this.notes.list.find((n) => n.pair === pair && !n.closing)
    if (note) {
      const m = this.meta.get(note)
      m.nextTurn = now + 4.5
      m.turnsLeft = Math.max(m.turnsLeft, 1)
    }
    this.turnPair(pair, now)
  }

  update(now) {
    this.ripples.splice(0, this.ripples.length, ...this.ripples.filter((r) => now - r.t0 < r.dur))
    if (this.paused) return

    const visible = this.inView()
    const roughlyVisible = new Set(this.inView(-0.05))

    // Noted words: turn on their own beat, retire after a couple of turns or
    // once the camera has drifted off them.
    for (const note of this.notes.list) {
      if (note.closing) continue
      const m = this.meta.get(note)
      if (!roughlyVisible.has(note.pair)) {
        this.notes.close(note, now)
        continue
      }
      if (now < m.nextTurn) continue
      if (m.turnsLeft > 0) {
        if (this.turnPair(note.pair, now)) {
          m.turnsLeft--
          m.nextTurn = now + (m.turnsLeft > 0 ? 4.2 + Math.random() * 1.6 : 3.4)
        } else {
          // Mid-roll: try again shortly. Nowhere left to turn: retire it.
          m.nextTurn = now + 0.6
          if (!this.rolling(note.pair)) m.turnsLeft = 0
        }
      } else {
        this.notes.close(note, now)
      }
    }

    if (now >= this.nextNoteCheck) {
      this.nextNoteCheck = now + 0.45
      const open = this.notes.list.filter((n) => !n.closing)
      if (open.length < this.capacity()) {
        const pair = this.pickForNote(visible, open, now)
        if (pair) {
          this.openNote(pair, now)
          this.nextNoteCheck = now + 0.9 + Math.random() * 0.8
        }
      }
    }

    if (now >= this.nextBackground) {
      const noted = this.notes.noted()
      const pool = visible.filter(
        (p) => !noted.has(p) && !this.rolling(p) && now - (this.lastTurn.get(p) ?? -99) > 6,
      )
      if (pool.length) this.turnPair(pool[Math.floor(Math.random() * pool.length)], now)
      this.nextBackground = now + 1.5 + Math.random() * 1.1
    }
  }

  // A good word to annotate: well inside the frame, not crowding an existing
  // note, and not one that just turned.
  pickForNote(visible, open, now) {
    const inner = new Set(this.inView(0.2))
    const anchors = open.map((n) => this.scene.project(n.pair.x, 1, n.pair.z))
    let best = null
    let bestScore = -Infinity
    for (const p of visible) {
      if (!inner.has(p) || this.notes.has(p) || this.rolling(p)) continue
      const [x, y] = this.scene.project(p.x, 1, p.z)
      let far = Infinity
      for (const [ax, ay] of anchors) far = Math.min(far, Math.hypot(ax - x, ay - y))
      const score = Math.min(far, 420) + Math.random() * 160 - (now - (this.lastTurn.get(p) ?? -99) < 4 ? 300 : 0)
      if (score > bestScore) {
        best = p
        bestScore = score
      }
    }
    return best
  }
}
