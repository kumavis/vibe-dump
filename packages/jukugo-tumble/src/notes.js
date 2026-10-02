import { MEANING, FIELDS } from './lexicon.js'
import { clamp01, inOutCubic, smooth } from './ease.js'

const INK = '#141414'
const PAPER = '#ecebe7'
const LATIN = 'abcdefghijklmnopqrstuvwxyz'
const KANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわん'

// Notes are HTML cards floating over the scene, each tied back to its word by
// a leader line drawn on the HUD canvas. They are screen-space on purpose:
// the floor is for drawing, the notes are for reading.
export class Notes {
  constructor(root, canvas) {
    this.root = root
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
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
      <div class="card-word"><span class="k"></span><span class="k"></span></div>
      <div class="card-read"><span class="kana"></span><span class="ro"></span></div>
      <div class="card-gloss"></div>
      <div class="card-parts"><div><b></b><span></span></div><div><b></b><span></span></div></div>
      <div class="card-hist"></div>`
    this.root.appendChild(el)
    const q = (s) => el.querySelector(s)
    const note = {
      pair,
      el,
      no: q('.no'),
      field: q('.field'),
      ks: [...el.querySelectorAll('.k')],
      kana: q('.kana'),
      ro: q('.ro'),
      gloss: q('.card-gloss'),
      parts: [...el.querySelectorAll('.card-parts div')],
      hist: q('.card-hist'),
      scrambles: [],
      t0: now,
      closing: null,
      x: null,
      y: null,
      side: null,
      pulse: -10,
    }
    this.fill(note, pair.entry)
    note.no.textContent = `No.${String(pair.id + 1).padStart(3, '0')}`
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

  fill(note, e) {
    note.ks[0].textContent = e.a
    note.ks[1].textContent = e.b
    note.kana.textContent = e.kana
    note.ro.textContent = e.romaji
    note.gloss.textContent = e.gloss
    this.setField(note, e)
    for (const i of [0, 1]) this.setPart(note, i, i ? e.b : e.a)
    const prev = note.pair.history.at(-1)
    note.hist.innerHTML = prev ? `was <b>${prev.word}</b> ${prev.gloss}` : '&nbsp;'
  }

  setField(note, e) {
    const f = FIELDS[e.field]
    note.field.innerHTML = `<b>${f.label}</b>${f.en}`
  }

  setPart(note, i, char) {
    const div = note.parts[i]
    div.querySelector('b').textContent = char
    div.querySelector('span').textContent = MEANING.get(char) ?? ''
  }

  // The word on `pair` just turned its `index` block from `prev` to its
  // current entry; play the same turn on the card, timed to the block. Queued
  // and run from the frame loop rather than timers, so the card can't drift
  // out of step with the block when frames are slow.
  turn(pair, index, prev, at) {
    const note = this.list.find((n) => n.pair === pair && !n.closing)
    if (!note) return
    this.queue.push({ at, run: () => this.startTurn(note, index, prev, pair.entry, at) })
  }

  startTurn(note, index, prev, e, at) {
    const k = note.ks[index]
    k.classList.remove('turn')
    void k.offsetWidth
    k.classList.add('turn')
    this.queue.push({ at: at + 0.3, run: () => (k.textContent = index ? e.b : e.a) })
    note.pulse = at
    note.scrambles = [
      { el: note.kana, from: prev.kana, to: e.kana, t0: at, dur: 0.55, set: KANA },
      { el: note.ro, from: prev.romaji, to: e.romaji, t0: at + 0.05, dur: 0.55, set: LATIN },
      { el: note.gloss, from: prev.gloss, to: e.gloss, t0: at + 0.1, dur: 0.7, set: LATIN },
    ]
    this.setPart(note, index, index ? e.b : e.a)
    note.parts.forEach((d, i) => d.classList.toggle('hot', i === index))
    this.setField(note, e)
    note.hist.innerHTML = `was <b>${prev.word}</b> ${prev.gloss}`
  }

  // Place every card near its word, keep them off each other and the screen
  // chrome, then draw the leaders.
  update(scene, now, dt, reserved) {
    const due = this.queue.filter((q) => q.at <= now)
    this.queue = this.queue.filter((q) => q.at > now)
    for (const q of due) q.run()
    const placed = []
    // Read every card's size before writing any position, so the browser lays
    // out once per frame rather than once per card.
    const sizes = this.list.map((n) => [n.el.offsetWidth || 212, n.el.offsetHeight || 150])
    this.list.forEach((note) => {
      const p = note.pair
      const [ax, ay] = scene.project(p.x, 1.0, p.z)
      note.ax = ax
      note.ay = ay
    })
    this.list.forEach((note, i) => {
      const { ax, ay } = note
      const [w, h] = sizes[i]
      const gapX = 44
      const options = {
        ne: [ax + gapX, ay - 64 - h],
        nw: [ax - gapX - w, ay - 64 - h],
        se: [ax + gapX, ay + 70],
        sw: [ax - gapX - w, ay + 70],
      }
      const cost = (x, y) => {
        let c = 0
        for (const r of placed) c += overlap(x, y, w, h, r.x, r.y, r.w, r.h) * 3
        for (const r of reserved) c += overlap(x, y, w, h, r.x, r.y, r.w, r.h) * 2
        c += (w * h - overlap(x, y, w, h, 8, 8, this.w - 16, this.h - 16)) * 4
        for (const other of this.list) {
          if (other !== note && other.ax != null) c += overlap(x, y, w, h, other.ax - 20, other.ay - 20, 40, 40) * 2
        }
        return c
      }
      let best = note.side
      let bestCost = best ? cost(...options[best]) * 0.7 : Infinity
      for (const side of Object.keys(options)) {
        const c = cost(...options[side])
        if (c < bestCost) {
          best = side
          bestCost = c
        }
      }
      note.side = best
      const [tx, ty] = options[best]
      if (note.x == null) {
        note.x = tx
        note.y = ty
      } else {
        const k = 1 - Math.exp(-dt * 7)
        note.x += (tx - note.x) * k
        note.y += (ty - note.y) * k
      }
      note.w = w
      note.h = h
      placed.push({ x: tx, y: ty, w, h })
      note.el.style.transform = `translate3d(${note.x.toFixed(1)}px, ${note.y.toFixed(1)}px, 0)`
      note.el.classList.toggle('from-right', best === 'nw' || best === 'sw')

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
      const east = note.side === 'ne' || note.side === 'se'
      const sx = east ? 1 : -1
      const attachX = east ? note.x : note.x + note.w
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
        ctx.fillStyle = PAPER
        ctx.fill()
        ctx.stroke()
      }
    }
  }
}

function overlap(x, y, w, h, X, Y, W, H) {
  const ox = Math.max(0, Math.min(x + w, X + W) - Math.max(x, X))
  const oy = Math.max(0, Math.min(y + h, Y + H) - Math.max(y, Y))
  return ox * oy
}

// Decode-style text change: characters settle left to right, each one
// flickering through random letters until its turn comes.
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
    if (t >= settle) out += to[i] ?? ''
    else if (t < settle - 0.35 && i < from.length) out += from[i]
    else if (to[i] === ' ' || from[i] === ' ') out += ' '
    else out += s.set[Math.floor(Math.random() * s.set.length)]
  }
  s.el.textContent = out
}
