import { FIELDS, STONES, stoneText } from './lexicon.js'
import { INK, PAPER_2, font } from './palette.js'
import { clamp01, inOutCubic, smooth } from './ease.js'

// What a letter flickers through while it settles. Hawaiian has thirteen
// letters and five long vowels, and the ʻokina is one of them; the glosses
// and cognates are English and other Polynesian spellings.
const HAW = 'aeiouāēīōūhklmnpwʻ'
const LATIN = 'abcdefghijklmnopqrstuvwxyzāēīōū'

// Notes are HTML cards floating over the scene, each tied back to its word by
// a leader line drawn on the HUD canvas. They are screen-space on purpose:
// the floor is for drawing, the notes are for reading.
export class Notes {
  constructor(root, canvas) {
    this.root = root
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    // Text is measured here, not in the page, so fitting a word never forces
    // a layout.
    this.measure = document.createElement('canvas').getContext('2d')
    this.list = []
    this.queue = []
    this.dpr = 1
  }

  resize(w, h, dpr) {
    this.w = w
    this.h = h
    this.dpr = dpr
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
  }

  has(pair) {
    return this.list.some((n) => n.pair === pair && !n.closing)
  }

  noted() {
    return new Set(this.list.filter((n) => !n.closing).map((n) => n.pair))
  }

  open(pair, now) {
    const el = document.createElement('div')
    el.className = 'card'
    el.innerHTML = `
      <div class="card-head"><span class="no"></span><span class="rule"></span><span class="field"></span></div>
      <div class="card-word" lang="haw"><span class="k"></span><span class="sep"></span><span class="k"></span><i class="ring"></i></div>
      <div class="card-gloss"></div>
      <div class="card-parts">
        <div><p><b lang="haw"></b><i class="pp"></i></p><span></span></div>
        <div><p><b lang="haw"></b><i class="pp"></i></p><span></span></div>
      </div>
      <div class="card-cog"></div>
      <div class="card-hist"></div>`
    this.root.appendChild(el)
    const q = (s) => el.querySelector(s)
    const note = {
      pair,
      el,
      no: q('.no'),
      field: q('.field'),
      word: q('.card-word'),
      ks: [...el.querySelectorAll('.k')],
      sep: q('.sep'),
      gloss: q('.card-gloss'),
      parts: [...el.querySelectorAll('.card-parts > div')].map((d) => ({
        el: d,
        stone: d.querySelector('b'),
        pp: d.querySelector('.pp'),
        gloss: d.querySelector('span'),
      })),
      cog: q('.card-cog'),
      hist: q('.card-hist'),
      hot: null,
      scrambles: [],
      t0: now,
      closing: null,
      x: null,
      y: null,
      side: null,
      from: null,
      offset: null,
      moved: 0,
      bad: 0,
      pulse: -10,
    }
    // Read the card's measure once, while it's new: the room the word has, its
    // largest size (style.css sets it per screen), and the cognate line's face.
    const cs = getComputedStyle(note.cog)
    note.room = note.word.clientWidth || 200
    note.wordPx = parseFloat(getComputedStyle(note.word).getPropertyValue('--word')) || 36
    note.cogRoom = note.cog.clientWidth || 200
    note.cogFont = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`

    // A word that has already turned opens on the stone that turned it.
    const e = pair.entry
    const prev = pair.history.at(-1)
    if (prev) note.hot = prev.a !== e.a ? 0 : 1
    this.fill(note, e, prev)
    note.no.textContent = `No. ${String(pair.id + 1).padStart(3, '0')}`
    this.list.push(note)
    // The leader draws out first; the card unfolds from where it lands.
    this.queue.push({ at: now + 0.32, run: () => el.classList.add('open') })
    return note
  }

  close(note, now) {
    if (note.closing) return
    note.closing = now
    note.el.classList.remove('open')
  }

  fill(note, e, prev) {
    const w = spell(e)
    this.setWord(note, w, e)
    this.fit(note, w, e)
    note.gloss.textContent = e.gloss
    this.setField(note, e)
    for (const i of [0, 1]) this.setPart(note, i, i ? e.b : e.a)
    note.parts.forEach((p, i) => p.el.classList.toggle('hot', i === note.hot))
    note.cogText = this.cognates(note, e)
    note.cog.textContent = note.cogText
    this.setHist(note, prev)
  }

  setField(note, e) {
    const f = FIELDS[e.field]
    note.field.innerHTML = `<i lang="haw">${esc(f.label)}</i><span class="dot">·</span><span class="sc">${esc(f.en)}</span>`
  }

  setPart(note, i, id) {
    const p = note.parts[i]
    p.stone.textContent = stoneText(id)
    p.pp.textContent = STONES[id].pp
    p.gloss.textContent = STONES[id].g
  }

  setWord(note, w, e) {
    note.ks[0].textContent = w.a
    note.ks[1].textContent = w.b
    note.sep.textContent = w.sep
    note.word.classList.toggle('pending', e.ev === 'pending')
  }

  setHist(note, prev) {
    note.hist.innerHTML = prev
      ? `was <i lang="haw">${esc(prev.word)}</i>${prev.ev === 'pending' ? '<i class="ring"></i>' : ''} ${esc(prev.gloss)}`
      : '&nbsp;'
  }

  // Size the word to its card. Roots run from one letter to eight, and a word
  // from two letters to fourteen, so each root's box is set to its own width
  // in em — measured once here — and the whole word scales down only when it
  // wouldn't otherwise fit. During a turn the boxes and the size glide, so the
  // stone that stays put slides over rather than jumping when its neighbour
  // changes length.
  fit(note, w, e) {
    const m = this.measure
    m.font = font(100, { weight: 600 })
    const ems = [m.measureText(w.a).width / 100, m.measureText(w.b).width / 100]
    m.font = font(100)
    const total = ems[0] + ems[1] + m.measureText(w.sep).width / 100 + (e.ev === 'pending' ? 0.36 : 0)
    note.ks.forEach((k, i) => (k.style.width = `${ems[i].toFixed(3)}em`))
    note.word.style.fontSize = `${Math.min(note.wordPx, (note.room - 2) / total).toFixed(2)}px`
  }

  // One line of the cognates of the stone that turned, as many whole entries
  // as fit: Māori wai · Tahitian vai · Sāmoan vai. A stone with none recorded
  // lends the line to the other stone; their forms show plainly which root
  // they belong to.
  cognates(note, e) {
    const ids = note.hot === 1 ? [e.b, e.a] : [e.a, e.b]
    const cog = ids.map((id) => STONES[id].cog).find((c) => c.length)
    if (!cog) return '\u00a0'
    this.measure.font = note.cogFont
    let line = ''
    for (const [lang, form] of cog) {
      const next = line ? `${line} · ${lang} ${form}` : `${lang} ${form}`
      if (line && this.measure.measureText(next).width > note.cogRoom) break
      line = next
    }
    return line
  }

  // The word on `pair` just turned its `index` stone from `prev` to its
  // current entry; play the same turn on the card, timed to the stone. Queued
  // and run from the frame loop rather than timers, so the card can't drift
  // out of step with the stone when frames are slow.
  turn(pair, index, prev, at) {
    const note = this.list.find((n) => n.pair === pair && !n.closing)
    if (!note) return
    this.queue.push({ at, run: () => this.startTurn(note, index, prev, pair.entry, at) })
  }

  startTurn(note, index, prev, e, at) {
    const k = note.ks[index]
    const w = spell(e)
    k.classList.remove('turn')
    void k.offsetWidth
    k.classList.add('turn')
    note.word.classList.add('glide')
    this.fit(note, w, e)
    // The new root lands at the flip's midpoint, edge-on and unreadable. The
    // join is re-spelled then too: a turn can carry a word from one written
    // word to two, or move an ʻokina across the join.
    this.queue.push({ at: at + 0.3, run: () => this.setWord(note, w, e) })
    this.queue.push({ at: at + 0.7, run: () => note.word.classList.remove('glide') })
    note.pulse = at

    const id = index ? e.b : e.a
    const left = index ? prev.b : prev.a
    const part = note.parts[index]
    note.hot = index
    note.parts.forEach((p, i) => p.el.classList.toggle('hot', i === index))
    const cog = this.cognates(note, e)
    note.scrambles = [
      { el: note.gloss, from: prev.gloss, to: e.gloss, t0: at + 0.1, dur: 0.7, set: LATIN },
      { el: part.stone, from: stoneText(left), to: stoneText(id), t0: at + 0.05, dur: 0.5, set: HAW.toUpperCase() },
      { el: part.pp, from: STONES[left].pp, to: STONES[id].pp, t0: at + 0.08, dur: 0.5, set: HAW },
      { el: part.gloss, from: STONES[left].g, to: STONES[id].g, t0: at + 0.1, dur: 0.6, set: LATIN },
      { el: note.cog, from: note.cogText, to: cog, t0: at + 0.18, dur: 0.75, set: LATIN },
    ]
    note.cogText = cog
    this.setField(note, e)
    this.setHist(note, prev)
  }

  // Place every card near its word, keep them off each other and the screen
  // chrome, then draw the leaders.
  //
  // A card rides rigidly with its word, at one of four corners round it, and
  // only changes corner when the one it has has become clearly bad — mostly
  // covered or pushed off screen — for a moment, and not within a few seconds
  // of its last move. When it does move, the offset glides across; when it
  // doesn't, nothing about the card is re-decided frame to frame. Small
  // overlaps are tolerated rather than chased, and the screen edge is handled
  // by clamping, which slides instead of jumps.
  update(scene, now, dt, reserved) {
    const due = this.queue.filter((q) => q.at <= now)
    this.queue = this.queue.filter((q) => q.at > now)
    for (const q of due) q.run()
    // Read every card's size before writing any position, so the browser lays
    // out once per frame rather than once per card.
    const sizes = this.list.map((n) => [n.el.offsetWidth || 236, n.el.offsetHeight || 180])
    for (const note of this.list) {
      const p = note.pair
      ;[note.ax, note.ay] = scene.project(p.x, 1.0, p.z)
      // A card below its word starts under the word's caption (the word and
      // its gloss, typed on the floor in front of the stones), which grows on
      // screen with the zoom.
      note.below = Math.max(70, scene.project(p.x, 0, p.z + CAPTION)[1] - note.ay + 8)
    }
    const live = this.list.filter((n) => !n.closing)
    this.list.forEach((note, i) => {
      const { ax, ay } = note
      const [w, rawH] = sizes[i]
      // A gloss that wraps mid-scramble makes the card a line taller for a
      // moment. Place by the tallest the card has been, eased toward, so a
      // card above its word doesn't hop up and back down with its text.
      note.hMax = Math.max(note.hMax ?? 0, rawH)
      note.hs = note.hs == null ? rawH : note.hs + (note.hMax - note.hs) * (1 - Math.exp(-dt * 6))
      const h = note.hs
      const offsets = cornerOffsets(w, h, note.below)
      // Cost of a corner, against where the other cards actually are.
      const cost = (side) => {
        const x = ax + offsets[side][0]
        const y = ay + offsets[side][1]
        let c = 0
        for (const o of live) {
          if (o === note || o.x == null) continue
          c += overlap(x, y, w, h, o.x, o.y, o.w, o.h) * 3
          c += overlap(x, y, w, h, o.ax - 20, o.ay - 20, 40, 40) * 2
        }
        for (const r of reserved) c += overlap(x, y, w, h, r.x, r.y, r.w, r.h) * 2
        c += (w * h - overlap(x, y, w, h, 8, 8, this.w - 16, this.h - 16)) * 2
        return c
      }
      const best = () => SIDES.reduce((a, b) => (cost(b) < cost(a) ? b : a))

      if (!note.side) {
        note.side = best()
        note.from = offsets[note.side]
        note.fromEast = east(note.side)
        note.moved = now
        note.bad = 0
        note.el.classList.toggle('from-right', note.side[1] === 'w')
      } else if (!note.closing) {
        const here = cost(note.side)
        note.bad = here > w * h * 0.18 ? note.bad + dt : 0
        if (note.bad > 0.5 && now - note.moved > 3) {
          const next = best()
          if (next !== note.side && cost(next) < here * 0.4) {
            note.from = note.offset
            note.fromEast = note.east
            note.side = next
            note.moved = now
            note.bad = 0
            note.el.classList.toggle('from-right', next[1] === 'w')
          }
        }
      }

      const u = inOutCubic(clamp01((now - note.moved) / 0.6))
      const to = offsets[note.side]
      note.offset = [note.from[0] + (to[0] - note.from[0]) * u, note.from[1] + (to[1] - note.from[1]) * u]
      // Which edge the leader lands on, 1 = left edge (card east of its word),
      // gliding with the card when it changes corner.
      note.east = note.fromEast + (east(note.side) - note.fromEast) * u
      note.x = Math.max(8, Math.min(this.w - w - 8, ax + note.offset[0]))
      note.y = Math.max(8, Math.min(this.h - h - 8, ay + note.offset[1]))
      note.w = w
      note.h = rawH
      note.el.style.transform = `translate3d(${note.x.toFixed(1)}px, ${note.y.toFixed(1)}px, 0)`

      for (const s of note.scrambles) scramble(s, now)
    })
    for (const n of this.list) if (n.closing && now - n.closing >= 0.9) n.el.remove()
    this.list = this.list.filter((n) => !n.closing || now - n.closing < 0.9)
    this.draw(now)
  }

  draw(now) {
    const ctx = this.ctx
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const note of this.list) {
      const { ax, ay } = note
      const attachX = note.x + note.w * (1 - note.east)
      const sx = attachX >= ax ? 1 : -1
      const attachY = note.y + 34
      const dy = attachY - ay
      let ex = ax + sx * Math.abs(dy)
      if (sx * (ex - attachX) > -12) ex = attachX - sx * 12
      const pts = [
        [ax, ay],
        [ex, attachY],
        [attachX, attachY],
      ]
      let p = inOutCubic(clamp01((now - note.t0) / 0.38))
      if (note.closing) p = Math.min(p, 1 - inOutCubic(clamp01((now - note.closing - 0.4) / 0.35)))
      if (p <= 0) continue
      const lens = [Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), Math.abs(pts[2][0] - pts[1][0])]
      let left = (lens[0] + lens[1]) * p
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      for (let i = 0; i < 2 && left > 0; i++) {
        const k = Math.min(1, left / (lens[i] || 1))
        ctx.lineTo(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k)
        left -= lens[i]
      }
      ctx.strokeStyle = INK
      ctx.lineWidth = 1
      ctx.stroke()

      // The anchor: a dot on top of the word, ringed, and a ring that spreads
      // out when the word turns.
      const a = smooth(clamp01(p * 3))
      ctx.beginPath()
      ctx.arc(ax, ay, 3.2 * a, 0, Math.PI * 2)
      ctx.fillStyle = INK
      ctx.fill()
      ctx.beginPath()
      ctx.arc(ax, ay, 7 * a, 0, Math.PI * 2)
      ctx.strokeStyle = INK
      ctx.stroke()
      const u = (now - note.pulse) / 0.9
      if (u >= 0 && u < 1) {
        ctx.beginPath()
        ctx.arc(ax, ay, 7 + 26 * smooth(u), 0, Math.PI * 2)
        ctx.globalAlpha = 1 - u
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      if (p >= 1 && !note.closing) {
        ctx.beginPath()
        ctx.arc(attachX, attachY, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = PAPER_2
        ctx.fill()
        ctx.stroke()
      }
    }
  }
}

// The word as written, cut where its two stones meet. Usually the stones
// spell it exactly — wai + maka, or hale + pule with Pukui & Elbert's space —
// but a compound can drop or gain an ʻokina or a kahakō at the join (ala +
// ʻula is written alaula; maka + ala, makaʻala), so the cut is found by
// counting bare letters: case, kahakō and ʻokina set aside. An ʻokina at the
// join goes with the root it begins. The cut is shown with a light point,
// as a dictionary marks a headword's parts; a word written as two keeps its
// space.
function spell(e) {
  const w = e.word
  const n = bare(STONES[e.a].s).length
  if (bare(w).replace(/ /g, '') === bare(STONES[e.a].s) + bare(STONES[e.b].s)) {
    let seen = 0
    let i = 0
    while (seen < n) if (bare(w[i++]) && w[i - 1] !== ' ') seen++
    const b = w.slice(i)
    if (b[0] === ' ') return { a: w.slice(0, i), sep: ' ', b: b.slice(1) }
    return { a: w.slice(0, i), sep: '·', b }
  }
  // Nothing to cut by: the whole word rides on the first stone.
  return { a: w, sep: '', b: '' }
}

// A spelling reduced to its bare letters: lower case, no kahakō, no ʻokina.
function bare(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\p{M}ʻ]/gu, '')
}

function esc(s) {
  return s.replace(/[&<>"]/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' }[c]};`)
}

const SIDES = ['ne', 'nw', 'se', 'sw']
const east = (side) => (side[1] === 'e' ? 1 : 0)
const GAP_X = 44
// How far in front of a word's centre its caption ends on the floor: half a
// slab, the caption's offset and its two lines (floor.js, pairMarks).
const CAPTION = 1.45

// Card top-left relative to the anchor, for each corner round the word.
function cornerOffsets(w, h, below) {
  return {
    ne: [GAP_X, -64 - h],
    nw: [-GAP_X - w, -64 - h],
    se: [GAP_X, below],
    sw: [-GAP_X - w, below],
  }
}

function overlap(x, y, w, h, X, Y, W, H) {
  const ox = Math.max(0, Math.min(x + w, X + W) - Math.max(x, X))
  const oy = Math.max(0, Math.min(y + h, Y + H) - Math.max(y, Y))
  return ox * oy
}

// Decode-style text change: characters settle left to right, each one
// flickering through random letters until its turn comes. A letter the old
// and new text share in the same place holds still, so a cognate line that
// keeps its languages only re-spells the forms.
function scramble(s, now) {
  const t = (now - s.t0) / s.dur
  if (t < 0) return
  if (t >= 1) {
    if (!s.done) {
      s.el.textContent = s.to
      s.done = true
    }
    return
  }
  const from = [...s.from]
  const to = [...s.to]
  const n = Math.max(from.length, to.length)
  const len = Math.round(from.length + (to.length - from.length) * Math.min(1, t * 1.6))
  let out = ''
  for (let i = 0; i < len; i++) {
    const settle = (i / n) * 0.75 + 0.2
    if (t >= settle || from[i] === to[i]) out += to[i] ?? ''
    else if (t < settle - 0.35 && i < from.length) out += from[i]
    else if (to[i] === ' ' || from[i] === ' ' || to[i] === '·') out += to[i] ?? ' '
    else out += s.set[Math.floor(Math.random() * s.set.length)]
  }
  s.el.textContent = out
}
