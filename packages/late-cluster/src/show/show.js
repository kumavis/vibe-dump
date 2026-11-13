// The `show` object a segment directs: timeline lookups (cues, lines, sfx, music), shots and
// puppets, and the drawing kit. One Show per loaded segment; the stage calls frame(t) every frame
// and then draws it. See README.md → "Authoring a segment" for the API as segment authors see it.
import { Puppet } from './puppet.js'
import { SHOTS, MARKS, TILE, HOUSE_IDS } from '../stage/shots.js'
import { lookFor, defineLook } from '../looks.js'
import { CAST } from '../cast.js'
import * as kit from '../kit/draw.js'
import { clamp, lerp, unlerp, smoothstep, ease, tween, window01, pulse, rng, noise1, hashSeed } from '../kit/ease.js'

const LAUGH_RE = /^(applause|laugh|biglaugh|chuckle|cheer)/i
const BAND_IDS = ['hy', 'al', 'pete', 'dee']

/** look target → azimuth */
const AZ_RIGHT = 0.6, AZ_LEFT = Math.PI - 0.6

export class Show {
  /**
   * @param o.module    the segment module (index.js default export) — may be {} for built-ins
   * @param o.cues      cues.json (or null: nothing rendered yet)
   * @param o.tele      decoded telemetry ({ blocks }) or null
   * @param o.puppets   shared Map id → Puppet (puppets persist across segments)
   */
  constructor({ module, cues, tele, puppets }) {
    this.module = module
    this.cues = cues ?? { id: module.id, title: module.title, duration: module.duration ?? 30, lines: [], cues: {}, sfx: [], music: [] }
    this.id = module.id ?? this.cues.id
    this.title = module.title ?? cues?.title ?? this.id
    this.duration = this.cues.duration ?? module.duration ?? 30
    this.teleFile = tele
    this.puppets = puppets
    this.lines = (this.cues.lines ?? []).slice().sort((a, b) => a.t0 - b.t0)
    this.lineById = new Map(this.lines.filter((l) => l.id).map((l) => [l.id, l]))
    this.sfxList = this.cues.sfx ?? []
    this.musicList = this.cues.music ?? []
    this._warned = new Set()

    // who's in it: the host, every speaker, and anyone the module asks for
    const cast = ['larry']
    for (const l of this.lines) if (l.who && !cast.includes(l.who)) cast.push(l.who)
    for (const id of module.cast ?? []) if (!cast.includes(id)) cast.push(id)
    this.cast = cast
    this.guests = (module.guests ?? cast.filter((id) => !HOUSE_IDS.includes(id))).slice()

    // the drawing kit & helpers, as documented
    this.draw = kit
    this.P = kit.P
    this.ease = ease
    this.clamp = clamp
    this.lerp = lerp
    this.unlerp = unlerp
    this.smoothstep = smoothstep
    this.tween = tween
    this.window = window01
    this.pulse = pulse
    this.noise = noise1
    this.SHOTS = SHOTS
    this.MARKS = MARKS
    this.TILE = TILE
    this.CAST = CAST
    this.defineLook = defineLook

    // per-segment state
    this.set = { ...(module.set ?? {}) }
    this.nameplate = module.nameplate
    this.captions = true
    this.onAir = true
    this.t = 0
    this.dt = 0
    this.wall = 0
    this._cur = null
    this._trans = null
    this._lastPlace = {}
    this._frame = this._newFrame()
    this.layout = null
    this.cam = { x: 1000, y: 560, zoom: 1 }
    this.panel = null
    this.audience = 0
    this.cut = true
    this._declShots = (module.shots ?? []).map((s) => (typeof s === 'string' ? { at: 0, shot: s } : s))
    this._buildSpans()
  }

  _newFrame() {
    return { shot: null, cam: null, over: {}, chyrons: [], caption: undefined, sign: null }
  }

  /** attach each puppet's telemetry spans for this segment */
  _buildSpans() {
    for (const id of this.cast) this.puppet(id)
    for (const p of this.puppets.values()) p.spans = []
    const blocks = this.teleFile?.blocks ?? []
    for (const l of this.lines) {
      if (!(l.tele >= 0) || !blocks[l.tele]) continue
      const b = blocks[l.tele]
      const p = this._puppet(l.who)
      p.spans.push({ start: l.teleT0, end: l.teleT0 + b.duration, block: b, line: l })
    }
  }

  _puppet(id) {
    let p = this.puppets.get(id)
    if (!p) {
      p = new Puppet(id)
      this.puppets.set(id, p)
    }
    return p
  }

  _warn(msg) {
    if (this._warned.has(msg)) return
    this._warned.add(msg)
    console.warn(`[${this.id}] ${msg}`)
  }

  // ================================================================= timeline lookups

  /**
   * Time (s) of a cue: a name in cues.json "cues", a line id (its t0), "<lineId>.end" (its t1), a
   * music block id, an sfx name ("laugh-2", or "laugh" for the first laugh), or a number (returned
   * as is). Unknown names warn once and return Infinity (never reached).
   */
  at(name) {
    if (typeof name === 'number') return name
    if (name == null) return 0
    const c = this.cues.cues?.[name]
    if (c !== undefined) return c
    if (name.endsWith('.end')) {
      const l = this.lineById.get(name.slice(0, -4))
      if (l) return l.t1
    }
    const l = this.lineById.get(name)
    if (l) return l.t0
    const m = this.musicList.find((m) => m.id === name)
    if (m) return m.t0
    // an sfx: "laugh-2" exactly, or "laugh" for the first laugh-N
    const s = this.sfxList.find((s) => s.name === name) ?? this.sfxList.find((s) => s.name.startsWith(name + '-'))
    if (s) return s.t0
    this._warn(`unknown cue "${name}"`)
    return Infinity
  }

  /** seconds since a cue (negative before it) */
  since(name) {
    return this.t - this.at(name)
  }

  /** true between two cues (or times) */
  between(a, b) {
    return this.t >= this.at(a) && this.t < this.at(b)
  }

  /** 0..1 progress from cue a to cue b — a number b is a duration: progress('chart-in', 1.5) */
  progress(a, b) {
    const t0 = this.at(a)
    const t1 = typeof b === 'number' ? t0 + b : this.at(b)
    return unlerp(t0, t1, this.t)
  }

  /**
   * A line by id: { ...line, active, progress (0..1 over t0..t1), done, word (index of the word
   * being said, −1) }. Unknown ids warn once and return an inert line.
   */
  line(id) {
    const l = this.lineById.get(id)
    if (!l) {
      this._warn(`unknown line "${id}"`)
      return { id, t0: Infinity, t1: Infinity, active: false, progress: 0, done: false, word: -1, words: [] }
    }
    return this._lineState(l)
  }

  _lineState(l) {
    const t = this.t
    let word = -1
    if (l.words) for (let i = 0; i < l.words.length; i++) if (t >= l.words[i][0]) word = i
    return { ...l, active: t >= l.t0 && t < l.t1, progress: unlerp(l.t0, l.t1, t), done: t >= l.t1, word }
  }

  /** lines being performed right now */
  get active() {
    const t = this.t
    return this.lines.filter((l) => t >= l.t0 && t < l.t1)
  }

  /** is this cast member performing a line now */
  speaking(who) {
    const t = this.t
    return this.lines.some((l) => l.who === who && t >= l.t0 && t < l.t1)
  }

  /** who has the floor: the speaker of the most recently started say/sing/shout line (or null) */
  get speaker() {
    let best = null
    const t = this.t
    for (const l of this.lines) if (t >= l.t0 && t < l.t1 && l.kind !== 'beat' && (!best || l.t0 >= best.t0)) best = l
    return best?.who ?? null
  }

  /** the last line (by anyone, or by `who`) that has started */
  lastLine(who) {
    let best = null
    for (const l of this.lines) if (l.t0 <= this.t && (!who || l.who === who)) best = l
    return best ? this._lineState(best) : null
  }

  /** an sfx entry active now whose name starts with `prefix` → { name, t0, t1, progress } or null */
  sfx(prefix) {
    const t = this.t
    const e = this.sfxList.find((s) => s.name.startsWith(prefix) && t >= s.t0 && t < s.t1)
    return e ? { ...e, progress: unlerp(e.t0, e.t1, t) } : null
  }

  /** a music block by id (or the one playing now) → { id, t0, bpm, beats, beat, n, phase, bar, pulse, progress, active } */
  musicState(id) {
    const t = this.t
    const m = id ? this.musicList.find((m) => m.id === id) : this.musicList.find((m) => t >= m.t0 && t < m.t0 + (m.beats * 60) / m.bpm)
    if (!m) return null
    const spb = 60 / m.bpm
    const beat = (t - m.t0) / spb
    const n = Math.floor(beat)
    const phase = beat - n
    const len = m.beats * spb
    return { id: m.id, t0: m.t0, t1: m.t0 + len, bpm: m.bpm, beats: m.beats, beat, n, phase, bar: Math.floor(n / 4), pulse: beat >= 0 ? Math.exp(-phase * 4.5) : 0, progress: unlerp(m.t0, m.t0 + len, t), active: t >= m.t0 && t < m.t0 + len }
  }

  // ================================================================= direction

  /**
   * Choose the shot for this frame: show.shot('guest', { guest: 'ganweaving' }).
   * opts.push (s) eases the camera/puppets from the previous shot instead of cutting;
   * opts.since (s or cue) pins when the change happened (otherwise: the first frame it's asked for).
   */
  shot(name, opts = {}) {
    this._frame.shot = this._req(name, opts)
    return this
  }

  /** shorthand for show.shot('closeup', { who }) */
  closeup(who, opts = {}) {
    return this.shot('closeup', { ...opts, who })
  }

  _req(name, opts) {
    const { push, since, ...rest } = opts
    // numeric options (popUp, zoom, …) may be animated every frame without counting as a new shot
    const key = name + JSON.stringify(Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'number')))
    return { name, opts: rest, key, push: push ?? 0, since: since === undefined ? undefined : this.at(since) }
  }

  /** override the camera this frame: { x, y, zoom } (any subset), world units */
  camera(c) {
    this._frame.cam = { ...(this._frame.cam ?? {}), ...c }
    return this
  }

  /** a puppet handle (creates the puppet if needed) */
  puppet(id) {
    const p = this._puppet(id)
    const show = this
    const over = () => (show._frame.over[id] ??= {})
    return {
      id,
      get name() {
        return p.name
      },
      get color() {
        return p.color
      },
      get look() {
        return p.look
      },
      get speaking() {
        return p.speaking
      },
      /** where it is on screen: { x, y, size } (stage units, head centre) or null */
      get screen() {
        return p.screen
      },
      /** put it somewhere this frame (merged over the shot's placement): { x, y, scale, look, z, floor } */
      place(pl) {
        Object.assign((over().place ??= {}), pl)
        return this
      },
      /** 'camera' | 'left' | 'right' | castId | azimuth (rad) */
      lookAt(target) {
        over().look = target
        return this
      },
      /** offsets this frame (radians): chin up (+) / down, tilt to its right shoulder (+) */
      nod(v) {
        over().nod = (over().nod ?? 0) + v
        return this
      },
      tilt(v) {
        over().tilt = (over().tilt ?? 0) + v
        return this
      },
      hide() {
        over().hidden = true
        return this
      },
      show() {
        over().hidden = false
        return this
      },
      /** bob on the music's beat (default on) */
      bob(on = true) {
        p.bobOff = !on
        return this
      },
      /**
       * an effect this frame: 'hologram' (translucent, scanlines, glitches; o: { amount 0..1 —
       * animate it to flicker out —, flicker 0..1, scan 0..1, tint }), 'monitor' (dimmed, scanlines:
       * for heads inside a tvFrame), or 'none' (overrides a look's default fx)
       */
      fx(kind, o = {}) {
        over().fx = { kind, ...o }
        return this
      },
      /** jitter it this frame (stage px) */
      shake(amount = 4) {
        over().shake = amount
        return this
      },
      /** scale its head and body this frame (multiplies the shot's scale; tween it for grow/shrink gags) */
      scaleTo(k) {
        over().scaleTo = k
        return this
      },
      /** parameters for the look's prop this frame, e.g. Abel's contraption: .prop({ unveil: 0..1 }) */
      prop(params) {
        over().prop = { ...(over().prop ?? {}), ...params }
        return this
      },
      /** change its look for good: { color, costume: {kind,…}, head, scale } */
      dress(look) {
        p.dress(look)
        return this
      },
    }
  }

  /** the default spot of a cast member (or where it was last placed) */
  markOf(id) {
    if (this._lastPlace[id]) return this._lastPlace[id]
    if (id === 'larry') return { ...MARKS.desk, scale: 1, look: 'camera' }
    if (MARKS.band[id]) return { ...MARKS.band[id], scale: 0.92, look: 'camera' }
    if (id === 'sibyl') return { ...MARKS.anncr, scale: 0.9, look: 'camera' }
    const gi = Math.max(0, this.guests.indexOf(id))
    const seat = [MARKS.chair, ...MARKS.couch][Math.min(2, gi)]
    return { ...seat, scale: 1, look: 'larry' }
  }

  /**
   * A lower-third for a cast member (or { name, title, color }) between two times/cues:
   * show.chyron('ganweaving', { from: 'guest-in', dur: 6 })   // or { from, to } (cues or seconds)
   */
  chyron(who, o = {}) {
    const spec = typeof who === 'string' ? { id: who } : who
    const from = this.at(o.from ?? 0)
    const to = o.to !== undefined ? this.at(o.to) : from + (o.dur ?? 5)
    this._frame.chyrons.push({ spec, from, to, opts: o })
    return this
  }

  /** replace the caption this frame (null hides it): show.caption('♪ instrumental ♪', 'hy') */
  caption(text, who) {
    this._frame.caption = text === null ? null : { text, who }
    return this
  }

  /** light the APPLAUSE/LAUGH sign yourself this frame: show.sign('APPLAUSE', 1) */
  sign(text = 'APPLAUSE', level = 1) {
    this._frame.sign = { text, level }
    return this
  }

  /** a seeded random source (stable per segment + seed) */
  rng(seed = 0) {
    return rng(hashSeed(`${this.id}:${seed}`))
  }

  /** world → stage coordinates */
  toScreen(x, y) {
    const c = this.cam
    return [(x - c.x) * c.zoom + 640, (y - c.y) * c.zoom + 360]
  }

  /** run fn with ctx in world coordinates (things that live in the studio and move with the camera) */
  world(ctx, fn) {
    const c = this.cam
    ctx.save()
    ctx.translate(640 - c.x * c.zoom, 360 - c.y * c.zoom)
    ctx.scale(c.zoom, c.zoom)
    try {
      fn(ctx)
    } finally {
      ctx.restore()
    }
  }

  /** where a puppet's head is on screen: { x, y, size, mouth: [x,y], crown: [x,y] } or null */
  headOf(id) {
    const p = this.puppets.get(id)
    if (!p?.screen || !p.visible || !p.head) return null
    const s = p.screen
    const m = p.head.mouth()
    const c = p.head.crown()
    const k = s.size / p.head.tile
    return { x: s.x, y: s.y, size: s.size, mouth: [s.x - s.size / 2 + m[0] * k, s.y - s.size / 2 + m[1] * k], crown: [s.x - s.size / 2 + c.x * k, s.y - s.size / 2 + c.y * k] }
  }

  // ================================================================= per-frame evaluation (stage-internal)

  /** reset smoothing (after a seek) */
  resetMotion() {
    this.cut = true
    this._cur = null
    this._trans = null
    for (const id of this.cast) {
      const p = this.puppets.get(id)
      p.az = NaN
      p.head?.resetMotion()
    }
  }

  /** evaluate the frame at segment time t: direction, layout, puppets (no drawing) */
  frame(t, dt, opts = {}) {
    this.t = t
    this.dt = dt
    this.wall = t + 1000
    this._frame = this._newFrame()
    this.music = this.musicState()
    this.beat = this.music ? { phase: this.music.phase, n: this.music.n, pulse: this.music.pulse, bar: this.music.bar } : { phase: 0, n: -1, pulse: 0, bar: -1 }
    // laughter & applause
    let lv = 0, applause = false
    for (const s of this.sfxList) {
      if (!LAUGH_RE.test(s.name)) continue
      const w = window01(t, s.t0, s.t1, 0.5) * (/^chuckle/i.test(s.name) ? 0.55 : 1)
      if (w > lv) {
        lv = w
        applause = /^(applause|cheer)/i.test(s.name)
      }
    }
    this.laughing = lv
    this.signText = applause ? 'APPLAUSE' : 'LAUGH'

    // the segment directs
    const decl = this._declShot(t)
    if (decl) this._frame.shot = decl
    try {
      this.module.direct?.(t, this)
    } catch (e) {
      this._warn(`direct() threw: ${e?.message ?? e}`)
      console.error(e)
    }
    if (this._frame.sign) {
      this.laughing = Math.max(this.laughing, this._frame.sign.level)
      this.signText = this._frame.sign.text
    }
    this._builtState(t)
    this._resolveLayout(t)
    this._updatePuppets(t, dt, opts)
    this._captionState(t)
  }

  /** the episode-long BUILT counter: from + bumps passed (module.built = { from, bumps: [cue…] }) */
  _builtState(t) {
    const b = this.module.built
    if (!b) {
      this.built = null
      this.builtNow = null
      return
    }
    let n = b.from ?? 0, last = -Infinity
    for (const c of b.bumps ?? []) {
      const at = this.at(c)
      if (at <= t) {
        n++
        last = Math.max(last, at)
      }
    }
    this.built = n
    this.builtNow = { n, age: t - last, seed: Math.floor(last * 1000) }
  }

  /** the disclaimer footer: module.disclaimer = 'text' | { text, from, dur } → { text, alpha } or null */
  get disclaimerNow() {
    const d = this.module.disclaimer
    if (!d) return null
    const spec = typeof d === 'string' ? { text: d } : d
    const from = this.at(spec.from ?? 0), dur = spec.dur ?? 6
    const a = window01(this.t, from, from + dur, 0.6)
    return a > 0 ? { text: spec.text, alpha: a } : null
  }

  _declShot(t) {
    let cur = null
    for (const s of this._declShots) {
      const at = this.at(s.at ?? 0) + (s.after ?? 0)
      if (at <= t && (!cur || at >= cur.at)) cur = { ...s, at }
    }
    if (!cur) return null
    const { at, after, shot, push, ...opts } = cur
    return this._req(shot, { ...opts, push, since: at })
  }

  _evalShot(req) {
    const fn = SHOTS[req.name]
    if (!fn) {
      this._warn(`unknown shot "${req.name}"`)
      return SHOTS.desk(this, {})
    }
    return fn(this, req.opts)
  }

  _resolveLayout(t) {
    const req = this._frame.shot ?? this._req(this.module.defaultShot ?? 'desk', {})
    if (!this._cur || this._cur.key !== req.key) {
      const push = req.push > 0 && this._cur
      this._trans = push ? { from: this._cur, start: req.since ?? t, dur: req.push } : null
      if (!push) this.cut = true
      this._cur = req
    } else {
      // same shot: take this frame's (possibly animated) options, keep when it started
      this._cur = { ...req, since: this._cur.since }
    }
    let L = this._evalShot(this._cur)
    if (this._trans) {
      const u = (t - this._trans.start) / this._trans.dur
      if (u >= 1 || u < 0) this._trans = null
      else L = blendLayouts(this._evalShot(this._trans.from), L, ease.inOutCubic(u))
    }
    // overrides
    const cam = { ...L.cam, ...(this._frame.cam ?? {}) }
    // idle camera drift
    if (this.module.drift !== false) {
      cam.x += (7 * noise1(t * 0.11, 11)) / cam.zoom
      cam.y += (4 * noise1(t * 0.09, 12)) / cam.zoom
      cam.zoom *= 1 + 0.006 * noise1(t * 0.07, 13)
    }
    const place = { ...L.place }
    for (const [id, o] of Object.entries(this._frame.over)) {
      if (o.place) place[id] = { ...(place[id] ?? this.markOf(id)), ...o.place }
      if (o.hidden === true) delete place[id]
      else if (o.hidden === false && !place[id]) place[id] = this.markOf(id)
    }
    this.layout = L
    this.setNow = { ...(L.set ?? {}), ...this.set }
    this.monitors = L.monitors ?? []
    this.cam = cam
    this.place = place
    this.panel = L.panel ?? null
    this.audience = L.audience ?? 0
  }

  _resolveAz(id, look, me) {
    if (typeof look === 'number') return look
    if (look === 'right') return AZ_RIGHT
    if (look === 'left') return AZ_LEFT
    if (look === 'camera' || look == null) {
      // a touch of three-quarter, turned towards the middle of the frame
      // never quite square on: from the front the head's midline section fades out
      const sx = (me.x - this.cam.x) * this.cam.zoom
      const side = Math.abs(sx) > 40 ? Math.sign(sx) : me.camSide ?? -1
      return Math.PI / 2 + side * (0.36 + 0.12 * clamp(Math.abs(sx) / 400, 0, 1))
    }
    const other = this.place[look]
    if (!other) return Math.PI / 2
    return other.x >= me.x ? AZ_RIGHT : AZ_LEFT
  }

  _updatePuppets(t, dt, opts) {
    const cam = this.cam
    const step = this.music?.active ? Math.floor(this.music.beat * 4) % 16 : -1
    const snap = this.cut
    this.cut = false
    for (const p of this.puppets.values()) {
      const pl = this.place[p.id]
      if (!pl) {
        p.visible = false
        p.screen = null
        continue
      }
      // remember where it stood (markOf → closeups), but not a spot inside a monitor/PiP (clipped)
      if (!pl.clip) this._lastPlace[p.id] = { x: pl.x, y: pl.y, scale: pl.scale ?? 1, look: pl.look }
      const o = this._frame.over[p.id] ?? {}
      const seed = hashSeed(p.id) % 997
      const scale = (pl.scale ?? 1) * (p.look.scale ?? 1) * (o.scaleTo ?? 1)
      const size = TILE * scale * cam.zoom
      // breathing and idle drift (pure functions of t)
      const breathe = 0.5 + 0.5 * Math.sin((t * 2 * Math.PI) / 4.4 + seed)
      const sh = o.shake ?? 0
      const sx = (pl.x - cam.x) * cam.zoom + 640 + (sh ? sh * noise1(t * 37, seed + 21) : 0)
      const sy = (pl.y - cam.y) * cam.zoom + 360 - breathe * 0.006 * size + (sh ? sh * noise1(t * 41, seed + 22) : 0)
      // effects: this frame's, else the placement's, else the look's default
      const fx = o.fx ?? pl.fx ?? (p.look.fx ? { kind: p.look.fx } : null)
      p.fx = fx && fx.kind !== 'none' ? fx : null
      p.propParams = o.prop ?? null
      p.place = pl
      p.screen = { x: sx, y: sy, size }
      p.visible = sx > -size && sx < 1280 + size && sy > -size && sy < 720 + size * 1.2
      p.breathe = breathe
      if (!p.visible) continue
      // where it looks
      const lookT = o.look ?? pl.look
      const glance = 0.07 * noise1(t * 0.31, seed) + 0.04 * noise1(t * 1.1, seed + 5)
      const azT = this._resolveAz(p.id, lookT, pl) + glance
      if (snap || !Number.isFinite(p.az)) p.az = azT
      else p.az += (azT - p.az) * (1 - Math.exp(-dt / 0.2))
      // what it says
      p.sample(t, step)
      // paused: the head keeps its shape, the voice and the face come to rest (as upstream's duet page)
      if (opts.paused) p.tele = null
      let nod = (o.nod ?? 0) + 0.025 * noise1(t * 0.23, seed + 9)
      const tilt = (o.tilt ?? 0) + 0.03 * noise1(t * 0.17, seed + 3)
      if (this.music?.active && !p.bobOff) nod -= 0.07 * this.music.pulse
      p.nod = nod
      p.tilt = tilt
      const head = p.ensureHead()
      const lw = clamp(Math.sqrt(size / 330), 0.72, 1.35)
      head.aim(p.az, 0.13 + (o.el ?? 0), size, lw)
      // small idle heads tick at half rate when frames are tight
      if (!opts.full && !p.tele && size < 200 && opts.light && (p.skip ^= 1)) continue
      head.update(dt, dt, p.tele, p.artic, nod, tilt)
    }
  }

  _captionState(t) {
    const ov = this._frame.caption
    if (ov === null) return (this.captionNow = null)
    if (ov) {
      const p = ov.who ? this._puppet(ov.who) : null
      return (this.captionNow = { who: ov.who, name: p?.name ?? '', color: p?.color ?? kit.P.white, text: ov.text, words: null, word: -1, alpha: 1 })
    }
    let best = null
    for (const l of this.lines) {
      if (l.caption === false || l.kind === 'beat') continue
      if (t >= l.t0 - 0.05 && t < l.t1 + 0.7 && (!best || l.t0 >= best.t0)) best = l
    }
    if (!best) return (this.captionNow = null)
    const p = this._puppet(best.who)
    let word = -1
    if (best.words) for (let i = 0; i < best.words.length; i++) if (t >= best.words[i][0]) word = i
    const alpha = Math.min(smoothstep(best.t0 - 0.05, best.t0 + 0.1, t), 1 - smoothstep(best.t1 + 0.4, best.t1 + 0.7, t))
    this.captionNow = { who: best.who, name: p.name, color: p.color, text: best.text, words: best.words, word, alpha, kind: best.kind, done: t >= best.t1 }
  }
}

function blendLayouts(A, B, u) {
  const zoom = Math.exp(lerp(Math.log(A.cam.zoom), Math.log(B.cam.zoom), u))
  // keep the framing's centre moving consistently with the zoom
  const cam = { x: lerp(A.cam.x, B.cam.x, u), y: lerp(A.cam.y, B.cam.y, u), zoom }
  const place = {}
  for (const id of new Set([...Object.keys(A.place), ...Object.keys(B.place)])) {
    const a = A.place[id], b = B.place[id]
    if (a && b) {
      const far = Math.hypot(a.x - b.x, a.y - b.y) > 300
      place[id] = far ? (u < 0.5 ? a : b) : { ...b, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), scale: lerp(a.scale ?? 1, b.scale ?? 1, u) }
    } else place[id] = a ?? b
  }
  return { cam, place, audience: lerp(A.audience ?? 0, B.audience ?? 0, u), panel: u > 0.5 ? B.panel : A.panel }
}

export { BAND_IDS, lookFor }
