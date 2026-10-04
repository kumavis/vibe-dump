import { FIELDS, STONES, stoneText, turns } from './lexicon.js'
import { CAPTION, WORD } from './field.js'
import { INK, PAPER_2, font } from './palette.js'
import { clamp01, inOutCubic, smooth } from './ease.js'

// What a letter may flicker through while it settles. Only the glosses and
// the stones' spellings flicker at all: an ancestor or a cognate is a claim
// about another language, and a flicker through letters would put a false
// one on the card for a frame, so those fade instead. English flickers in
// a–z. A Hawaiian word flickers in Hawaiian letters, in (C)V syllables as
// Hawaiian is written, with the short vowels twice over, since a kahakō is
// the rarer mark. A word in a gloss that only might be Hawaiian (ukulele, but
// also home or line) keeps to the letters the two alphabets share. The ʻokina
// is never one of the chances: a place settling into one flickers through
// consonants, so no flicker shows one doubled, closing a word or after a
// consonant.
const ENGLISH = { letters: 'abcdefghijklmnopqrstuvwxyz' }
const HAW = { vowels: 'aeiouaeiouāēīōū', consonants: 'hklmnpw' }
const SHARED = { vowels: 'aeiou', consonants: HAW.consonants }
const STONE = { vowels: HAW.vowels.toUpperCase(), consonants: HAW.consonants.toUpperCase() }
const LETTER = /[\p{L}ʻ]/u
const VOWEL = /[aeiouāēīōū]/iu

// What a slot shows when its source records nothing — an unresolved stone's
// sense, a root with no cognates on file, the word before a card's first
// turn: a quiet dash in the faintest ink, so an empty line reads as nothing
// recorded rather than as something missing. (A missing ancestor shows
// nothing at all: a dash there would sit where a starred form belongs.)
const NONE = '—'
const FAINT = 'var(--ink-3)'
// The open circle after a pending word on the "was" line, as style.css draws
// it there: 5px across with 4px of margin, and a pixel to spare.
const RING_PX = 10

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
        <div><b lang="haw"></b><span class="sense"></span><p class="pp"><span class="code"></span><i></i></p></div>
        <div><b lang="haw"></b><span class="sense"></span><p class="pp"><span class="code"></span><i></i></p></div>
      </div>
      <div class="card-cog"></div>
      <div class="card-hist">was <i style="color: ${FAINT}">${NONE}</i></div>`
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
        gloss: d.querySelector('.sense'),
        anc: d.querySelector('.pp'),
        code: d.querySelector('.code'),
        pp: d.querySelector('.pp i'),
      })),
      cog: q('.card-cog'),
      hist: q('.card-hist'),
      hot: null,
      tweens: [],
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
    // largest size (style.css sets it per screen), and the room and face of
    // each line that is fitted to its width — a stone's sense, the cognates,
    // the "was" line (none on a small screen, which hides it).
    const sense = note.parts[0].gloss
    // A sense is fitted to its column here, so its settled text never needs
    // style.css's ellipsis; while it decodes, a wide flicker is cut off
    // instead of showing one.
    for (const p of note.parts) p.gloss.style.textOverflow = 'clip'
    note.room = note.word.clientWidth || 200
    note.wordPx = parseFloat(getComputedStyle(note.word).getPropertyValue('--word')) || 36
    note.senseRoom = sense.clientWidth || 90
    note.senseFace = face(sense)
    note.cogRoom = note.cog.clientWidth || 200
    note.cogFace = face(note.cog)
    note.histRoom = note.hist.clientWidth
    note.histFace = face(note.hist)
    note.histWordFace = face(note.hist.querySelector('i'))

    // A word that has already turned opens on the stone that turned it; one
    // that hasn't, on the stone it will likely turn first (lead()).
    const e = pair.entry
    const prev = pair.history.at(-1)
    note.hot = prev ? (prev.a !== e.a ? 0 : 1) : lead(e)
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
    note.cogs = this.cognates(note, e)
    note.cog.textContent = cogLine(note.cogs)
    this.setHist(note, prev)
  }

  setField(note, e) {
    const f = FIELDS[e.field]
    note.field.innerHTML = `<i lang="haw">${esc(f.label)}</i><span class="dot">·</span><span class="sc">${esc(f.en)}</span>`
  }

  setPart(note, i, id) {
    note.parts[i].stone.textContent = stoneText(id)
    this.setAncestor(note.parts[i], id)
    this.setSense(note, note.parts[i], id)
  }

  setAncestor(p, id) {
    const pp = ancestor(id)
    p.code.textContent = pp.code
    p.pp.textContent = pp.form
  }

  // A stone's sense, fitted to its column (see clip()); a stone with none
  // recorded shows the dash, in the faint ink whichever stone is ruled.
  setSense(note, p, id) {
    const s = this.sense(note, id)
    p.gloss.textContent = s.text
    p.gloss.style.color = STONES[id].g ? '' : FAINT
    this.senseScale(note, p, s.scale)
  }

  sense(note, id) {
    const g = STONES[id].g
    if (!g) return { text: NONE, scale: 1 }
    this.measure.font = note.senseFace.font
    return clip(this.measure, g, note.senseRoom - 1, 0.9)
  }

  senseScale(note, p, scale) {
    p.gloss.style.fontSize = scale < 1 ? `${(note.senseFace.px * scale).toFixed(2)}px` : ''
  }

  setWord(note, w, e) {
    note.ks[0].textContent = w.a
    note.ks[1].textContent = w.b
    note.sep.textContent = w.sep
    note.word.classList.toggle('pending', e.ev === 'pending')
  }

  // The word the card's word last was, and its gloss, cut to the line at a
  // whole sense. Before the first turn the line says so with the dash, so the
  // foot of a new card reads as finished rather than as still loading. The
  // dash stands where the word will, in the word's face — a size up from the
  // line's — so the line is as tall without a word as with one.
  setHist(note, prev) {
    if (!prev) {
      note.hist.innerHTML = `was <i style="color: ${FAINT}">${NONE}</i>`
      return
    }
    const ring = prev.ev === 'pending'
    const m = this.measure
    m.font = note.histWordFace.font
    let room = note.histRoom - 1 - m.measureText(prev.word).width - (ring ? RING_PX : 0)
    m.font = note.histFace.font
    room -= m.measureText('was  ').width
    const gloss = room > 0 ? clip(m, prev.gloss, room).text : ''
    note.hist.innerHTML = `was <i lang="haw">${esc(prev.word)}</i>${ring ? '<i class="ring"></i>' : ''}${gloss ? ` ${esc(gloss)}` : ''}`
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

  // The cognates of the ruled stone, as many whole entries as fit on one
  // line: Māori wai · Tahitian vai · Sāmoan vai. The line is that stone's
  // alone — the other stone's would read as this one's — so a stone with none
  // recorded leaves it to the dash.
  cognates(note, e) {
    const fit = []
    this.measure.font = note.cogFace.font
    for (const c of STONES[note.hot ? e.b : e.a].cog) {
      if (fit.length && this.measure.measureText(cogLine([...fit, c])).width > note.cogRoom) break
      fit.push(c)
    }
    return fit
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

  // The turn on the card, `at` being when its word starts to flip. The word
  // itself flips, and changes while it is edge-on, at +0.3 s; whatever goes
  // with the word — its field, the "was" line — changes then too, unseen, so
  // no moment pairs the old word with the new word's facts or the reverse.
  // The ruled stone's spelling and sense decode together, so a settled new
  // spelling never sits over its old sense; its ancestor is gone while they
  // do, and comes back once the spelling has settled; its cognates follow
  // the stone down, one language at a time, once it has landed.
  startTurn(note, index, prev, e, at) {
    // A turn that comes before the last one has played out finishes it
    // first, so no slot is left mid-flicker or faded out.
    for (const tw of note.tweens) finish(tw)
    const k = note.ks[index]
    const w = spell(e)
    k.classList.remove('turn')
    void k.offsetWidth
    k.classList.add('turn')
    note.word.classList.add('glide')
    this.fit(note, w, e)
    // A turn can carry a word from one written word to two, or move an ʻokina
    // across the join, so the join is re-spelled with it.
    this.queue.push({ at: at + 0.3, run: () => this.setWord(note, w, e) })
    this.queue.push({ at: at + 0.7, run: () => note.word.classList.remove('glide') })
    note.pulse = at

    const id = index ? e.b : e.a
    const left = index ? prev.b : prev.a
    const part = note.parts[index]
    note.hot = index
    note.parts.forEach((p, i) => p.el.classList.toggle('hot', i === index))
    const cogs = this.cognates(note, e)
    const tweens = [
      decode(note.gloss, at + 0.1, 0.7, prose(prev.gloss, e.gloss)),
      decode(part.stone, at + 0.05, 0.5, plain(stoneText(left), stoneText(id), STONE)),
    ]
    // Two senses decode one into the other; a dash fades, being no word.
    const from = this.sense(note, left)
    const to = this.sense(note, id)
    if (STONES[left].g && STONES[id].g) {
      // Set for the smaller of the two while it decodes, so neither runs out
      // of its column on the way.
      this.senseScale(note, part, Math.min(from.scale, to.scale))
      tweens.push(decode(part.gloss, at + 0.05, 0.6, prose(from.text, to.text), () => this.setSense(note, part, id)))
    } else if (from.text !== to.text) {
      tweens.push(fade(part.gloss, at, [0.15, 0.25, 0.3], () => this.setSense(note, part, id)))
    }
    if (STONES[left].pp !== STONES[id].pp) tweens.push(fade(part.anc, at, [0.15, 0.4, 0.3], () => this.setAncestor(part, id)))
    if (cogLine(note.cogs) !== cogLine(cogs)) tweens.push(reveal(note.cog, at, cogs))
    note.cogs = cogs
    if (prev.field !== e.field) tweens.push(fade(note.field, at + 0.1, [0.15, 0.05, 0.3], () => this.setField(note, e)))
    tweens.push(fade(note.hist, at + 0.1, [0.15, 0.05, 0.35], () => this.setHist(note, prev)))
    note.tweens = tweens
  }

  // Place every card near its word, keep them off each other and the screen
  // chrome, then draw the leaders.
  //
  // A card rides rigidly with its word, at one of four corners round it (or,
  // on a short screen, level with it to one side), and only changes place
  // when the one it has has become clearly bad — mostly
  // covered or pushed off screen — for a moment, and not within a few seconds
  // of its last move. When it does move, the offset glides across; when it
  // doesn't, nothing about the card is re-decided frame to frame. Small
  // overlaps are tolerated rather than chased, and the screen edge is handled
  // by clamping, which slides instead of jumps.
  update(scene, now, dt, reserved) {
    // A step can queue the next; on a slow frame that one may be due already,
    // and it runs now, so a card never shows half of a turn for a frame.
    for (let due; (due = this.queue.filter((q) => q.at <= now)).length; ) {
      this.queue = this.queue.filter((q) => q.at > now)
      for (const q of due) q.run()
    }
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
      // A card beside its word clears the word's outer stone.
      note.beside = Math.abs(scene.project(p.x + WORD.slabs.hx, 1.0, p.z)[0] - note.ax) + 16
    }
    const live = this.list.filter((n) => !n.closing)
    const sides = this.h < SHORT ? [...CORNERS, 'e', 'w'] : CORNERS
    this.list.forEach((note, i) => {
      const { ax, ay } = note
      const [w, rawH] = sizes[i]
      // A gloss that wraps mid-scramble makes the card a line taller for a
      // moment. Place by the tallest the card has been, eased toward, so a
      // card above its word doesn't hop up and back down with its text.
      note.hMax = Math.max(note.hMax ?? 0, rawH)
      note.hs = note.hs == null ? rawH : note.hs + (note.hMax - note.hs) * (1 - Math.exp(-dt * 6))
      const h = note.hs
      const offsets = placements(w, h, note.below, note.beside)
      // Cost of a place, against where the other cards actually are.
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
      const best = () => sides.reduce((a, b) => (cost(b) < cost(a) ? b : a))

      if (!note.side) {
        note.side = best()
        note.from = offsets[note.side]
        note.fromEast = east(note.side)
        note.moved = now
        note.bad = 0
        note.el.classList.toggle('from-right', !east(note.side))
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
            note.el.classList.toggle('from-right', !east(next))
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

      for (const tw of note.tweens) run(tw, now)
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

// A stone's ancestor split into the proto-language and the form, 'PPN *wai'
// → PPN, *wai: the code is set in small capitals, the form in italic.
function ancestor(id) {
  const pp = STONES[id].pp
  const m = pp.match(/^(\S+) (\*.*)$/)
  return m ? { code: m[1], form: m[2] } : { code: '', form: pp }
}

// A spelling reduced to its bare letters: lower case, no kahakō, no ʻokina.
function bare(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\p{M}ʻ]/gu, '')
}

function esc(s) {
  return s.replace(/[&<>"]/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' }[c]};`)
}

// Where a card sits round its word: at a corner, above or below it, as in
// Jukugo. On a screen too short to hold a card above or below a word in the
// middle of the frame — a phone held sideways, style.css's short screen — it
// may also sit level with the word, to one side.
const CORNERS = ['ne', 'nw', 'se', 'sw']
const SHORT = 520
const east = (side) => (side.endsWith('e') ? 1 : 0)
const GAP_X = 44

// Card top-left relative to the anchor, for each place round the word. A
// card to one side is set a little high, so its leader climbs off the stone
// before it runs across.
function placements(w, h, below, beside) {
  return {
    ne: [GAP_X, -64 - h],
    nw: [-GAP_X - w, -64 - h],
    se: [GAP_X, below],
    sw: [-GAP_X - w, below],
    e: [beside, -74],
    w: [-beside - w, -74],
  }
}

function overlap(x, y, w, h, X, Y, W, H) {
  const ox = Math.max(0, Math.min(x + w, X + W) - Math.max(x, X))
  const oy = Math.max(0, Math.min(y + h, Y + H) - Math.max(y, Y))
  return ox * oy
}

// The cognate line as written: Māori wai · Tahitian vai; the dash for a
// stone with none recorded.
function cogLine(cogs) {
  return cogs.length ? cogs.map(([lang, form]) => `${lang} ${form}`).join(' · ') : NONE
}

// A line's face, for measuring its text off the page: the canvas font string,
// and the size in px.
function face(el) {
  const cs = getComputedStyle(el)
  return { font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, px: parseFloat(cs.fontSize) }
}

// The stone a card is ruled on before its word has turned. Its foot shows
// that stone's cognates from the moment it opens, so it takes a stone with
// cognates to show, and of two, the one with more words to turn to — the
// likelier to turn first. If the other turns instead, the rule and the line
// move to it with the turn, as they do on any turn.
function lead(e) {
  const score = (i) => (STONES[i ? e.b : e.a].cog.length ? 1000 : 0) + turns(e, i).length
  return score(1) > score(0) ? 1 : 0
}

// A gloss cut to `room` at a whole sense: 'assembly, gathering' → 'assembly'.
// Senses part at commas and semicolons outside brackets, so 'light (weight)'
// stays whole. A single sense too long by a little is set smaller, down to
// `least` of its size, rather than cut; beyond that it is cut after a word
// and marked so — never inside one, nor after a word that only leads into
// the next ('food bundle wrapped…', not '…wrapped in…').
const LEADS = /^(a|an|and|as|at|by|for|from|in|into|of|on|or|the|to|with)$/i
function clip(m, text, room, least = 1) {
  const fits = (s) => m.measureText(s).width <= room
  if (fits(text)) return { text, scale: 1 }
  const [first, ...rest] = senses(text)
  let out = first
  for (const s of rest) {
    if (!fits(out + s)) break
    out += s
  }
  if (fits(out)) return { text: out, scale: 1 }
  const scale = room / m.measureText(out).width
  if (scale >= least) return { text: out, scale }
  const words = out.split(' ')
  for (let n = words.length - 1; n > 1; n--) {
    if (LEADS.test(words[n - 1])) continue
    const cut = `${words.slice(0, n).join(' ').replace(/[,;:(]+$/, '')}…`
    if (fits(cut)) return { text: cut, scale: 1 }
  }
  return { text: `${words[0]}…`, scale: 1 }
}

// 'liver; desire, wish' → ['liver', '; desire', ', wish'].
function senses(text) {
  const out = ['']
  let depth = 0
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    depth += c === '(' ? 1 : c === ')' ? -1 : 0
    if (!depth && (c === ',' || c === ';') && text[i + 1] === ' ') out.push('')
    out[out.length - 1] += c
  }
  return out
}

// Every change on a card that takes time is a tween run from the frame loop:
// step(u) for u from 0 to 1 over [t0, t0 + dur], where step(1) leaves its
// slot as it is to stay.
function run(tw, now) {
  const u = (now - tw.t0) / tw.dur
  if (tw.done || u < 0) return
  tw.step(Math.min(1, u))
  tw.done = u >= 1
}

function finish(tw) {
  if (tw.done) return
  tw.step(1)
  tw.done = true
}

// A line decoding into new text (scramble()); `end` sets whatever else goes
// with the text it settles on.
function decode(el, t0, dur, s, end) {
  return {
    t0,
    dur,
    step(u) {
      el.textContent = u < 1 ? scramble(s, u) : s.text
      if (u >= 1) end?.()
    },
  }
}

// A slot fading out, changed while unseen, and fading back in: `out`, `hold`
// and `back` in seconds.
function fade(el, t0, [out, hold, back], swap) {
  const dur = out + hold + back
  let swapped = false
  return {
    t0,
    dur,
    step(u) {
      const s = u * dur
      if (s >= out && !swapped) {
        swapped = true
        swap()
      }
      el.style.opacity = u >= 1 ? '' : String(s < out ? 1 - smooth(s / out) : smooth(clamp01((s - out - hold) / back)))
    },
  }
}

// The cognate line going over to another stone's: the old line fades, and
// once the stone has landed the new one comes in a language at a time, each
// entry whole — a form is never shown half-spelt.
const COG = { out: 0.15, in: 0.6, each: 0.3, step: 0.14 }
function reveal(el, t0, cogs) {
  const entries = cogs.length ? cogs.map(([lang, form], j) => `${j ? ' · ' : ''}${lang} ${form}`) : [NONE]
  const dur = COG.in + (entries.length - 1) * COG.step + COG.each
  let spans = null
  return {
    t0,
    dur,
    step(u) {
      const s = u * dur
      if (u >= 1) {
        el.style.opacity = ''
        el.textContent = cogLine(cogs)
      } else if (s < COG.out) {
        el.style.opacity = String(1 - smooth(s / COG.out))
      } else {
        if (!spans) {
          el.textContent = ''
          el.style.opacity = ''
          spans = entries.map((t) => el.appendChild(Object.assign(document.createElement('span'), { textContent: t })))
        }
        spans.forEach((sp, j) => (sp.style.opacity = String(smooth(clamp01((s - COG.in - j * COG.step) / COG.each)))))
      }
    },
  }
}

// A scramble is a line with, place by place, the letters it may flicker
// through, and the text it settles on.

// One alphabet throughout: a stone's spelling.
function plain(from, to, set) {
  const n = Math.max([...from].length, [...to].length)
  return { from: [...from], to: [...to], sets: Array(n).fill(set), text: to }
}

// An English gloss, which may hold a Hawaiian word ('dam feeding an ʻauwai'):
// each word flickers in its own alphabet (alphabets()). A place past the end
// of the new text goes by the old.
function prose(from, to) {
  const f = [...from]
  const t = [...to]
  const af = alphabets(f)
  const at = alphabets(t)
  const sets = Array.from({ length: Math.max(f.length, t.length) }, (_, i) => (i < t.length ? at[i] : af[i]))
  return { from: f, to: t, sets, text: to }
}

// A letter only Hawaiian writes among these: an ʻokina or a kahakō vowel.
const MARKED = /[ʻāēīōū]/iu
// A word that could be Hawaiian as it is spelt: (C)V syllables in the letters
// Hawaiian and English share.
const MAYBE = /^(?:[hklmnpw]?[aeiou])+$/i

// The alphabet for each place in `chars`, word by word: Hawaiian for a word
// that is visibly Hawaiian, the shared letters for one that might be, a–z for
// the rest.
function alphabets(chars) {
  const out = chars.map(() => ENGLISH)
  for (let i = 0; i < chars.length; i++) {
    if (!LETTER.test(chars[i])) continue
    let j = i
    while (j < chars.length && LETTER.test(chars[j])) j++
    const word = chars.slice(i, j)
    out.fill(word.some((c) => MARKED.test(c)) ? HAW : MAYBE.test(word.join('')) ? SHARED : ENGLISH, i, j)
    i = j
  }
  return out
}

// Decode-style text change, at t from 0 to 1: places settle left to right,
// each one flickering through its alphabet until its turn comes. A letter the
// old and new text share in the same place holds still. Any other place
// flickers from the start, and never through the letter it is leaving, so no
// frame spells the old text back out beside the new: a stone already reading
// AHI over its old sense, still "firm".
function scramble({ from, to, sets }, t) {
  const n = Math.max(from.length, to.length)
  const settleAt = (i) => (i / n) * 0.75 + 0.2
  let len = Math.round(from.length + (to.length - from.length) * Math.min(1, t * 1.6))
  // A growing word shows one place past the letters that have settled, so
  // what settles is never left standing as its end.
  while (len < to.length && t >= settleAt(Math.max(0, len - 1))) len++
  // First what each place shows for certain, then chance for the rest, so a
  // random letter can see what stands on either side of it.
  const fixed = []
  for (let i = 0; i < len; i++) {
    if (t >= settleAt(i) || from[i] === to[i]) fixed.push(to[i] ?? '')
    // Spaces, the join point and punctuation take their places at once.
    else if (from[i] === ' ' || (to[i] !== undefined && !LETTER.test(to[i]))) fixed.push(to[i] ?? ' ')
    else fixed.push(null)
  }
  // A word cut short as it shrinks still ends on a vowel, not on whatever
  // letter of the old word the cut happens to leave.
  const last = len - 1
  if (sets[last]?.vowels && t < settleAt(last) && LETTER.test(fixed[last] ?? '') && !VOWEL.test(fixed[last])) {
    fixed[last] = null
  }
  let out = ''
  for (let i = 0; i < len; i++) {
    if (fixed[i] != null) {
      out += fixed[i]
      continue
    }
    const set = sets[i]
    let pool = set.letters
    if (to[i] === 'ʻ') pool = set.consonants
    else if (set.vowels) {
      // A vowel after a consonant or an ʻokina, before one, and to end a
      // word; elsewhere either: (C)V syllables, whatever chance brings.
      const next = fixed.slice(i + 1).find((c) => c !== '')
      const prev = out.at(-1) ?? ''
      const vowel =
        (LETTER.test(prev) && !VOWEL.test(prev)) || next === undefined || (next !== null && !VOWEL.test(next))
      pool = vowel || Math.random() < 0.5 ? set.vowels : set.consonants
    }
    pool = pool.split(from[i]).join('')
    out += pool[Math.floor(Math.random() * pool.length)]
  }
  return out
}
