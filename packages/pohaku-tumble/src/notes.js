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
// is never one of the chances, as it would come doubled, closing a word or
// after a consonant: a place settling into one flickers through consonants,
// or through vowels where a consonant can't stand.
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
// A turn on a card, in seconds from when its word starts to flip: the turned
// stone's ancestor, cognates and any sense that fades rather than decodes are
// gone by 0.15 s; its spelling decodes from then and has settled by 0.57 s,
// when what faded comes back. AWAY is that fade: out, hold, back (fade()).
const TURN = { gone: 0.15, settled: 0.57 }
const AWAY = [TURN.gone, TURN.settled - TURN.gone, 0.3]

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
      hiding: null,
      pulse: -10,
    }
    // Read the card's measure once, while it's new: the room the word has, its
    // largest size (style.css sets it per screen), and the room and face of
    // each line that is fitted to its width — the gloss, a stone's sense and
    // ancestor, the cognates, the "was" line (none on a small screen, which
    // hides it).
    const { gloss: sense, anc, code, pp } = note.parts[0]
    // A sense or an ancestor is fitted to its column here, so its settled
    // text never needs style.css's ellipsis; while a sense decodes, a wide
    // flicker is cut off instead of showing one.
    for (const p of note.parts) p.gloss.style.textOverflow = p.anc.style.textOverflow = 'clip'
    note.room = note.word.clientWidth || 200
    note.wordPx = parseFloat(getComputedStyle(note.word).getPropertyValue('--word')) || 36
    note.glossRoom = note.gloss.clientWidth || 200
    note.glossFace = face(note.gloss)
    note.glossLine = parseFloat(getComputedStyle(note.gloss).lineHeight) || 20
    note.senseRoom = sense.clientWidth || 90
    note.senseFace = face(sense)
    // The height a sense wraps into on a stone with no ancestor: its own line
    // and the ancestor's.
    note.senseTwo = sense.getBoundingClientRect().height + anc.getBoundingClientRect().height
    note.ppFace = face(pp)
    const cs = getComputedStyle(code)
    note.codeFace = {
      font: `normal small-caps ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
      track: parseFloat(cs.letterSpacing) || 0,
      gap: parseFloat(cs.marginRight) || 0,
    }
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
    // The leader draws out first; the card unfolds from where it lands —
    // unless it was closed in the meantime, as when a second stone is tapped
    // on a one-card screen, and then it never shows at all.
    this.queue.push({ at: now + 0.32, run: () => note.closing || el.classList.add('open') })
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
    this.setSize(note, this.fit(note, w, e))
    note.gloss.textContent = e.gloss
    this.setField(note, e)
    for (const i of [0, 1]) this.setPart(note, i, i ? e.b : e.a)
    note.parts.forEach((p, i) => p.el.classList.toggle('hot', i === note.hot))
    note.cogs = this.cognates(note, e, note.hot)
    note.cog.textContent = cogLine(note.cogs)
    this.setHist(note, prev)
  }

  setField(note, e) {
    const f = FIELDS[e.field]
    note.field.innerHTML = `<i lang="haw">${esc(f.label)}</i><span class="dot">·</span><span class="sc">${esc(f.en)}</span>`
  }

  setPart(note, i, id) {
    note.parts[i].stone.textContent = stoneText(id)
    this.setAncestor(note, note.parts[i], id)
    this.setSense(note, note.parts[i], id)
  }

  // A stone's ancestor, PPN *wai. A starred form is a reconstruction, and
  // cut short it would be a different one, so one too long for its column —
  // on the small card, PPN *maqa-maqa — is set smaller rather than cut.
  setAncestor(note, p, id) {
    const { code, form } = ancestor(id)
    p.code.textContent = code
    p.pp.textContent = form
    const m = this.measure
    m.font = note.codeFace.font
    // The code is set in all small capitals: measured as lower case in small
    // capitals, which is the same letters.
    let width = code ? m.measureText(code.toLowerCase()).width + code.length * note.codeFace.track + note.codeFace.gap : 0
    m.font = note.ppFace.font
    width += m.measureText(form).width
    const scale = Math.min(1, (note.senseRoom - 1) / width)
    p.anc.style.fontSize = scale < 1 ? `${(note.ppFace.px * scale).toFixed(2)}px` : ''
  }

  // A stone's sense, fitted to its column (sense()); a stone with none
  // recorded shows the dash, in the faint ink whichever stone is ruled. A
  // sense wrapped onto the ancestor's line takes that line's place, and sets
  // its two lines in the height of the two.
  setSense(note, p, id) {
    const s = this.sense(note, id)
    p.gloss.textContent = s.text
    p.gloss.style.color = STONES[id].g ? '' : FAINT
    p.gloss.style.whiteSpace = s.two ? 'pre' : ''
    p.gloss.style.lineHeight = s.two ? `${(note.senseTwo / 2).toFixed(2)}px` : ''
    p.anc.style.display = s.two ? 'none' : ''
    this.senseScale(note, p, s.scale)
  }

  // A sense too long for its line keeps its whole text where the stone has
  // no ancestor to show, by wrapping onto the line the ancestor would take:
  // ʻAHA 'assembly, / gathering'. Under an ancestor it is cut to the line at
  // a whole sense (clip()).
  sense(note, id) {
    const { g, pp } = STONES[id]
    if (!g) return { text: NONE, scale: 1 }
    const m = this.measure
    const room = note.senseRoom - 1
    m.font = note.senseFace.font
    if (!pp && m.measureText(g).width > room) {
      const lines = wrap(m, g, room)
      if (lines) return { text: lines, scale: 1, two: true }
    }
    return clip(m, g, room, 0.9)
  }

  senseScale(note, p, scale) {
    p.gloss.style.fontSize = scale < 1 ? `${(note.senseFace.px * scale).toFixed(2)}px` : ''
  }

  width(f, s) {
    this.measure.font = f.font
    return this.measure.measureText(s).width
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
  // wouldn't otherwise fit. During a turn the boxes and the size glide
  // (flip()), so the stone that stays put slides over rather than jumping
  // when its neighbour changes length.
  fit(note, w, e) {
    const m = this.measure
    m.font = font(100, { weight: 600 })
    const ems = [m.measureText(w.a).width / 100, m.measureText(w.b).width / 100]
    m.font = font(100)
    const total = ems[0] + ems[1] + m.measureText(w.sep).width / 100 + (e.ev === 'pending' ? 0.36 : 0)
    return { ems, px: Math.min(note.wordPx, (note.room - 2) / total) }
  }

  setSize(note, size) {
    note.size = size
    note.ks.forEach((k, i) => (k.style.width = `${size.ems[i].toFixed(3)}em`))
    note.word.style.fontSize = `${size.px.toFixed(2)}px`
  }

  // The cognates of the ruled stone, `hot`, as many whole entries as fit on
  // one line: Māori wai · Tahitian vai · Sāmoan vai. The line is that stone's
  // alone — the other stone's would read as this one's — so a stone with none
  // recorded leaves it to the dash.
  cognates(note, e, hot) {
    const fit = []
    this.measure.font = note.cogFace.font
    for (const c of STONES[hot ? e.b : e.a].cog) {
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
  // itself flips, and changes while it is edge-on, 0.31 s in; whatever goes
  // with the word — its field, the "was" line — changes just before, unseen,
  // so no moment pairs the old word with the new word's facts or the reverse.
  // The turned stone's ancestor and cognates fade first; its spelling and
  // sense decode only once they are gone (TURN), so no flicker of a spelling
  // stands beside the old stone's ancestor, nor the settled new one beside
  // its old sense. The ancestor comes back once the spelling has settled, the
  // cognates a language at a time once the stone has landed.
  startTurn(note, index, prev, e, at) {
    // A turn that comes before the last one has played out finishes it
    // first, so no slot is left mid-flicker or faded out.
    for (const tw of note.tweens) finish(tw)
    const w = spell(e)
    const size = this.fit(note, w, e)
    // A turn can carry a word from one written word to two, or move an ʻokina
    // across the join, so the join is re-spelled with it.
    const tweens = [flip(note, index, note.size, size, at, () => this.setWord(note, w, e))]
    note.size = size
    note.pulse = at

    const id = index ? e.b : e.a
    const left = index ? prev.b : prev.a
    const part = note.parts[index]
    const cogs = this.cognates(note, e, index)
    // The gloss keeps one height while it decodes — two lines throughout if
    // either text needs two, else one — so a run of wide flicker never wraps
    // it for a frame and the card doesn't hop. A gloss that grows takes its
    // second line as the word starts to flip; one that shrinks gives it up
    // once it has settled.
    // (A canvas measures a line within a fraction of a pixel of the page; a
    // gloss that close to the edge counts as one line, so a wrong guess
    // only moves the card's one change of height to the end of the decode.)
    const two = [prev.gloss, e.gloss].some((s) => this.width(note.glossFace, s) > note.glossRoom + 0.5)
    note.gloss.style.minHeight = two ? `${2 * note.glossLine}px` : ''
    note.gloss.style.whiteSpace = two ? '' : 'nowrap'
    tweens.push(
      decode(note.gloss, at + 0.1, 0.7, prose(prev.gloss, e.gloss), () => {
        note.gloss.style.minHeight = ''
        note.gloss.style.whiteSpace = ''
      }),
      decode(part.stone, at + TURN.gone, TURN.settled - TURN.gone, plain(stoneText(left), stoneText(id), STONE)),
    )
    // Two senses on one line decode one into the other. A dash fades, being
    // no word, and so does a sense on two lines, which a decode would break
    // in a different place every frame.
    const from = this.sense(note, left)
    const to = this.sense(note, id)
    if (STONES[left].g && STONES[id].g && !from.two && !to.two) {
      // Set for the smaller of the two while it decodes, so neither runs out
      // of its column on the way.
      this.senseScale(note, part, Math.min(from.scale, to.scale))
      tweens.push(decode(part.gloss, at + TURN.gone, 0.5, prose(from.text, to.text), () => this.setSense(note, part, id)))
    } else if (from.text !== to.text) {
      tweens.push(fade(part.gloss, at, AWAY, () => this.setSense(note, part, id)))
    }
    if (STONES[left].pp !== STONES[id].pp) {
      tweens.push(fade(part.anc, at, AWAY, () => this.setAncestor(note, part, id)))
    }
    // The rule moves to the turned stone once the old cognate line has faded
    // from under it: that line is the other stone's, and for no frame reads
    // as this one's — not even when the two stones share it, since the
    // turned one is still spelling its old root.
    const rule = () => {
      note.hot = index
      note.parts.forEach((p, i) => p.el.classList.toggle('hot', i === index))
    }
    if (note.hot !== index || cogLine(note.cogs) !== cogLine(cogs)) {
      tweens.push(reveal(note.cog, at, cogs))
      this.queue.push({ at: at + TURN.gone, run: rule })
    } else rule()
    note.cogs = cogs
    // The field and the "was" line fade out from 0.1 s to 0.25 s, are changed
    // then, and stay gone until the word is edge-on, coming back with it.
    const unseen = [0.15, FLIP.dur / 2 - 0.25]
    if (prev.field !== e.field) tweens.push(fade(note.field, at + 0.1, [...unseen, 0.3], () => this.setField(note, e)))
    tweens.push(fade(note.hist, at + 0.1, [...unseen, 0.35], () => this.setHist(note, prev)))
    note.tweens = tweens
  }

  // Keep every card by its word (place()), run its tweens, then draw the
  // leaders.
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
    this.list.forEach((note, i) => {
      const p = note.pair
      ;[note.ax, note.ay] = scene.project(p.x, 1.0, p.z)
      note.marks = wordBox(scene, p)
      const [w, h] = sizes[i]
      note.w = w
      // A gloss that wraps mid-scramble makes the card a line taller for a
      // moment. Place by the tallest the card has been, eased toward, so a
      // card above its word doesn't hop up and back down with its text.
      note.hMax = Math.max(note.hMax ?? 0, h)
      note.hs = note.hs == null ? h : note.hs + (note.hMax - note.hs) * (1 - Math.exp(-dt * 6))
      // A card below its word starts under the word's caption (the word and
      // its gloss, typed on the floor in front of the stones), which grows on
      // screen with the zoom; a card beside it clears the stones and the
      // caption both.
      const below = Math.max(70, note.marks.y + note.marks.h - note.ay + 8)
      const beside = Math.max(note.marks.x + note.marks.w - note.ax, note.ax - note.marks.x) + 16
      note.offsets = placements(w, note.hs, below, beside)
    })
    // A card closed before it was ever placed is placed all the same, for its
    // leader to draw out to and back from.
    this.place(this.list.filter((n) => !n.closing || !n.side), now, reserved)
    for (const note of this.list) {
      const u = inOutCubic(clamp01((now - note.moved) / PLACE.glide))
      const to = note.offsets[note.side]
      note.offset = [note.from[0] + (to[0] - note.from[0]) * u, note.from[1] + (to[1] - note.from[1]) * u]
      // Which edge the leader lands on, 1 = left edge (card east of its word),
      // gliding with the card when it changes corner.
      note.east = note.fromEast + (east(note.side) - note.fromEast) * u
      note.x = clamp(note.ax + note.offset[0], 8, this.w - note.w - 8)
      note.y = clamp(note.ay + note.offset[1], 8, this.h - note.hs - 8)
      note.el.style.transform = `translate3d(${note.x.toFixed(1)}px, ${note.y.toFixed(1)}px, 0)`
      for (const tw of note.tweens) run(tw, now)
    }
    for (const n of this.list) if (n.closing && now - n.closing >= 0.9) n.el.remove()
    this.list = this.list.filter((n) => !n.closing || now - n.closing < 0.9)
    this.draw(now)
  }

  // Where the open cards stand. A card rides rigidly with its word, at one of
  // four corners round it or level with it to one side, and nothing about
  // where is re-decided frame to frame — until a card opens, or one comes to
  // hide text by more than a sliver, for a moment: runs under a plate, onto
  // another card or onto its own word. Then the cards on screen are placed
  // together, each at the place round its word that, all told, hides least;
  // but a card moves only where that is worth the move — readily if it is the
  // one hiding text, less so to make room for another, and the newest first,
  // the older having been read longest. A moved card glides across (update()).
  // A place is judged where the card would really stand, slid back from the
  // screen's edge, which can put it on its own word or under a plate; the
  // sliding is done by clamping, so it slides rather than jumps.
  place(live, now, reserved) {
    const at = (n, side) => ({
      x: clamp(n.ax + n.offsets[side][0], 8, this.w - n.w - 8),
      y: clamp(n.ay + n.offsets[side][1], 8, this.h - n.hs - 8),
      w: n.w,
      h: n.hs,
    })
    // What a card standing at `b` hides, or is hidden by, of what stays put:
    // its own word, which is what it is there to show, twice over; the
    // plates; the compass.
    const fixed = (n, b) => reserved.reduce((c, r) => c + overlap(b, r), overlap(b, n.marks) * 2)
    // Whether anything is wrong: a new card, or a card that has hidden more
    // than a sliver for a moment, counting the other cards where they are
    // going rather than where they are on the way, with a little air round
    // each. The moment is kept by the clock rather than by summing frames,
    // which on a slow machine come too few to sum to it.
    const bad = (n) => n.hiding != null && now - n.hiding > PLACE.wait
    let wake = false
    for (const n of live) {
      if (!n.side) wake = true
      else if (now - n.moved >= PLACE.glide) {
        const b = at(n, n.side)
        let hidden = fixed(n, b)
        for (const o of live) if (o !== n && o.side) hidden += overlap(b, at(o, o.side), PLACE.air)
        n.hiding = hidden > b.w * b.h * PLACE.cover ? (n.hiding ?? now) : null
        if (bad(n)) wake = true
      }
    }
    if (!wake) return
    // Each card's places — only the one it is gliding to, while it glides —
    // and what each costs it alone: chiefly what it hides; then, for less,
    // lying on the word another card is tied to, being slid in from the
    // screen's edge, standing to one side where a corner would do on a screen
    // tall enough for one, and moving at all.
    const opts = live.map((n) => {
      const newer = live.filter((o) => o.t0 > n.t0).length
      const moving = (bad(n) ? PLACE.move : PLACE.room) + PLACE.age * newer
      return (!n.side || now - n.moved >= PLACE.glide ? SIDES : [n.side]).map((side) => {
        const b = at(n, side)
        let c = fixed(n, b) * 3
        for (const o of live) if (o !== n) c += overlap(b, o.marks) * 2
        c += (Math.abs(b.x - n.ax - n.offsets[side][0]) * b.h + Math.abs(b.y - n.ay - n.offsets[side][1]) * b.w) / 2
        if (!CORNERS.includes(side) && this.h >= SHORT) c += b.w * b.h * PLACE.aside
        if (n.side && side !== n.side) c += b.w * b.h * moving
        return { side, b, c }
      })
    })
    // Then every combination of places — four cards at most, at six places
    // each — adding what two cards cost each other where they overlap.
    let best = null
    let least = Infinity
    const pick = []
    const search = (i, sum) => {
      if (sum >= least) return
      if (i === live.length) {
        best = [...pick]
        least = sum
        return
      }
      for (const o of opts[i]) {
        let c = sum + o.c
        for (let j = 0; j < i; j++) c += overlap(o.b, pick[j].b, PLACE.air) * 3
        pick[i] = o
        search(i + 1, c)
      }
    }
    search(0, 0)
    live.forEach((n, i) => best[i].side !== n.side && this.move(n, best[i].side, now))
  }

  // Send a card to another place round its word, or to its first; it glides
  // there from wherever it is (update()).
  move(note, side, now) {
    note.from = note.offset ?? note.offsets[side]
    note.fromEast = note.east ?? east(side)
    note.side = side
    note.moved = now
    note.hiding = null
    note.el.classList.toggle('from-right', !east(side))
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
// Jukugo, or level with the word, to one side. On a screen too short to hold
// a card above or below a word in the middle of the frame — a phone held
// sideways, style.css's short screen — a side is as good a place as a corner;
// on a taller one it is taken where it hides less than the corners would.
const CORNERS = ['ne', 'nw', 'se', 'sw']
const SIDES = [...CORNERS, 'e', 'w']
const SHORT = 520
const east = (side) => (side.endsWith('e') ? 1 : 0)
const GAP_X = 44
// How the cards are placed (place()). A card that hides more than `cover`
// of its area for `wait` seconds has the cards placed again. A move costs a card
// `move` of its area if it is the one hiding text, `room` if it moves to make
// room for another, and `age` more for each card newer than it; and it moves
// no more until it has glided across, over `glide`. Another card counts with
// `air` px round it, and on a tall screen a side costs `aside` of the card's
// area over a corner.
const PLACE = { cover: 0.02, wait: 0.25, move: 0.05, room: 0.12, age: 0.02, glide: 0.6, air: 6, aside: 0.05 }

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

// A word's box on screen: the tops of its stones down to the foot of its
// caption.
function wordBox(scene, p) {
  const { hx, hz } = WORD.slabs
  const pts = [
    scene.project(p.x - hx, 1, p.z - hz),
    scene.project(p.x + hx, 1, p.z - hz),
    scene.project(p.x - hx, 0, p.z + CAPTION),
    scene.project(p.x + hx, 0, p.z + CAPTION),
  ]
  const xs = pts.map((q) => q[0])
  const ys = pts.map((q) => q[1])
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

// The area two boxes share, the second taken `pad` px larger all round.
function overlap(a, b, pad = 0) {
  const ox = Math.min(a.x + a.w, b.x + b.w + pad) - Math.max(a.x, b.x - pad)
  const oy = Math.min(a.y + a.h, b.y + b.h + pad) - Math.max(a.y, b.y - pad)
  return Math.max(0, ox) * Math.max(0, oy)
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

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
// and marked so — never inside one, nor inside brackets, nor after a word
// that only leads into the next ('food bundle wrapped…', not '…wrapped in…';
// 'period…', not 'period (punctuation…').
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
    const head = words.slice(0, n).join(' ')
    if (LEADS.test(words[n - 1]) || head.split('(').length !== head.split(')').length) continue
    const cut = `${head.replace(/[,;:(]+$/, '')}…`
    if (fits(cut)) return { text: cut, scale: 1 }
  }
  return { text: `${words[0]}…`, scale: 1 }
}

// A sense broken onto two lines at a word, as many words on the first as fit
// ('draw back,' / 'recede'); null if its first word alone doesn't fit.
// A second line still too long is cut as clip() cuts.
function wrap(m, text, room) {
  const words = text.split(' ')
  const fits = (s) => m.measureText(s).width <= room
  if (!fits(words[0])) return null
  let n = 1
  while (n < words.length && fits(words.slice(0, n + 1).join(' '))) n++
  return `${words.slice(0, n).join(' ')}\n${clip(m, words.slice(n).join(' '), room).text}`
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

// The word's turn, played as the stone's: the turned root rolls forward to
// edge-on, is re-spelled there (`swap`), and rolls back up, while both roots'
// boxes and the word's size glide from `from` to `to` (fit()). It runs on
// the card's clock with everything else on it: a CSS animation keeps the
// page's own time, and on a slow frame would show the old root rolling back
// up, or cut down to the new root's box.
const FLIP = { dur: 0.62, glide: 0.6 }
function flip(note, index, from, to, t0, swap) {
  const k = note.ks[index]
  let swapped = false
  return {
    t0,
    dur: FLIP.dur,
    step(u) {
      const g = inOutCubic(clamp01((u * FLIP.dur) / FLIP.glide))
      note.word.style.fontSize = `${(from.px + (to.px - from.px) * g).toFixed(2)}px`
      note.ks.forEach((box, i) => {
        box.style.width = `${(from.ems[i] + (to.ems[i] - from.ems[i]) * g).toFixed(3)}em`
        // Letters that don't fit a gliding box yet are cut at its sides
        // rather than spilling over the other root.
        box.style.clipPath = u < 1 ? 'inset(-0.4em -0.03em)' : ''
      })
      const back = u >= 0.5
      if (back && !swapped) {
        swapped = true
        swap()
      }
      const r = inOutCubic(back ? u * 2 - 1 : u * 2)
      k.style.transform = u < 1 ? `rotateX(${back ? 90 * (1 - r) : -90 * r}deg)` : ''
      k.style.opacity = u < 1 ? String(back ? 0.2 + 0.8 * r : 1 - 0.8 * r) : ''
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
const COG = { in: 0.6, each: 0.3, step: 0.14 }
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
      } else if (s < TURN.gone) {
        el.style.opacity = String(1 - smooth(s / TURN.gone))
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
// of the new text goes by the old — except where, as the old text shrinks
// away, it runs straight on from the new text's last word, up to the old
// text's next space: that is one run of letters on screen, and takes the new
// word's alphabet whole, so no flicker is half English and half Hawaiian.
function prose(from, to) {
  const f = [...from]
  const t = [...to]
  const af = alphabets(f)
  const at = alphabets(t)
  const space = f.indexOf(' ', t.length)
  const join = !LETTER.test(t.at(-1) ?? '') ? t.length : space < 0 ? f.length : space
  const sets = Array.from({ length: Math.max(f.length, t.length) }, (_, i) =>
    i < t.length ? at[i] : i < join ? at[t.length - 1] : af[i],
  )
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
// flickers from the start, and never through the letter it is leaving nor
// the one it is settling into, so no frame spells the old text back out
// beside the new, nor the new text before it has settled: a stone already
// reading AHI, by chance, over its old sense, still "firm".
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
    if (set.vowels) {
      // A vowel after a consonant or an ʻokina, before one, and to end a
      // word; elsewhere either: (C)V syllables, whatever chance brings. A
      // place still to settle into an ʻokina stands in for it with a
      // consonant wherever one may stand, and the place before it takes a
      // vowel.
      const next = fixed.slice(i + 1).find((c) => c !== '')
      const prev = out.at(-1) ?? ''
      const afterConsonant = LETTER.test(prev) && !VOWEL.test(prev)
      const beforeOkina = i + 1 < len && fixed[i + 1] === null && to[i + 1] === 'ʻ'
      const vowel = afterConsonant || next === undefined || beforeOkina || (next !== null && !VOWEL.test(next))
      pool = vowel || (to[i] !== 'ʻ' && Math.random() < 0.5) ? set.vowels : set.consonants
    }
    pool = [...pool].filter((c) => c !== from[i] && c !== to[i]).join('')
    out += pool[Math.floor(Math.random() * pool.length)]
  }
  return out
}
