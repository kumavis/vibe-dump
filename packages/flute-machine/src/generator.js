// The improviser.
//
// The whole design rests on one idea: the unit of music is not the bar, it is
// the BREATH. A phrase begins when the player inhales and ends when the air
// runs out. Air is a budget in seconds; low notes cost more of it than high
// ones, long notes more than short ones. Nothing is quantised and there is no
// tempo — the music is free-metered by construction.
//
// That single rule is why one engine can produce both a two-second flurry and
// a forty-minute meditation: phrases are bounded by air, and the gaps between
// them are bounded by density. Turn density down and lengthen the notes and
// you get a drone; turn it up and shorten them and you get a scattering.

import { makeRng } from './rng.js'
import { SCALE_BY_ID, SCALES } from './theory.js'

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)
const clamp01 = (x) => clamp(x, 0, 1)
const sigmoid = (x) => 1 / (1 + Math.exp(-x))

export const CONTOURS = ['arch', 'sigh', 'question', 'static', 'cascade']

export const DEFAULT_SETTINGS = {
  registerLow: 62,
  registerHigh: 86,
  density: 0.45,
  breathiness: 0.32,
  motion: 0.4,
  pace: 0.4,
  vibrato: 0.5,
  space: 0.55,
  scale: 'dorian',
  root: 2, // D
  scaleAuto: true,
  rootAuto: true,
  automation: true,
  mode: 'endless', // 'endless' | 'burst'
  burstPhrases: 1,
}

// Rhythm multipliers, and how they are weighted per contour. A cascade wants
// short notes, a static phrase wants long ones; the phrase-final note always
// wants a long one, because that is how a player lands.
const LADDER = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5]
const LADDER_WEIGHTS = {
  base: [6, 14, 8, 26, 16, 14, 10, 6],
  cascade: [24, 30, 10, 20, 8, 4, 2, 2],
  static: [0, 2, 4, 10, 16, 24, 26, 18],
}

export class Improviser {
  constructor(settings = {}, seed = 1) {
    this.settings = { ...DEFAULT_SETTINGS, ...settings }
    this.seed = seed >>> 0
    this.rng = makeRng(this.seed)
    this.reset()
  }

  reset() {
    const s = this.settings
    this.phraseIndex = 0
    this.t = 0
    this.root = s.root
    this.scaleId = s.scale
    this.lastDegree = null
    this.lastArchetype = null
    this.repeatRun = 0
    this.rawClamps = 0
    this.drift = { center: 0, density: 0, motion: 0, pace: 0, dyn: 0, vib: 0 }
    // Phases for the slow "weather" term, derived from the seed so a session
    // reproduces exactly.
    const r = makeRng(this.seed ^ 0x5bf03635)
    this.macroPhase = [r() * Math.PI * 2, r() * Math.PI * 2, r() * Math.PI * 2]
    this.nextRootJump = 200 + r() * 240
    this.nextScaleJump = 150 + r() * 180
  }

  get scale() {
    return SCALE_BY_ID[this.scaleId] ?? SCALE_BY_ID['dorian']
  }

  /** MIDI number for an absolute scale degree. */
  midiOf(d) {
    const steps = this.scale.steps
    const L = steps.length
    const oct = Math.floor(d / L)
    const idx = ((d % L) + L) % L
    return this.root + 12 * oct + steps[idx]
  }

  /** Lowest degree whose pitch is at or above `midi`. */
  degreeNear(midi) {
    const steps = this.scale.steps
    const L = steps.length
    let best = 0
    let bestD = Infinity
    // Search a generous window of degrees around the target octave.
    const centerOct = Math.floor((midi - this.root) / 12)
    for (let o = centerOct - 1; o <= centerOct + 1; o++) {
      for (let i = 0; i < L; i++) {
        const d = o * L + i
        const diff = Math.abs(this.midiOf(d) - midi)
        if (diff < bestD) {
          bestD = diff
          best = d
        }
      }
    }
    return best
  }

  /** The slow, never-quite-repeating weather term. */
  macro(t) {
    const [p1, p2, p3] = this.macroPhase
    return (
      0.12 * Math.sin((2 * Math.PI * t) / 233 + p1) +
      0.09 * Math.sin((2 * Math.PI * t) / 389 + p2) +
      0.06 * Math.sin((2 * Math.PI * t) / 631 + p3)
    )
  }

  /**
   * Advance one Ornstein-Uhlenbeck channel. Exact discretisation, so the
   * behaviour does not depend on how long the last phrase happened to be.
   */
  ou(key, dt, tau, sigma, bound) {
    const a = 1 - Math.exp(-dt / tau)
    const b = sigma * Math.sqrt(1 - Math.exp((-2 * dt) / tau))
    let v = this.drift[key] + (0 - this.drift[key]) * a + b * this.rng.gauss(0, 1)
    this.drift[key] = clamp(v, -bound, bound)
  }

  /** Knob values plus automation, resolved for the phrase about to be built. */
  effective() {
    const s = this.settings
    const auto = s.automation
    const d = auto ? this.drift : { center: 0, density: 0, motion: 0, pace: 0, dyn: 0, vib: 0 }
    const m = auto ? this.macro(this.t) : 0

    const lo = Math.min(s.registerLow, s.registerHigh)
    const hi = Math.max(s.registerLow, s.registerHigh)
    const mid = (lo + hi) / 2
    const halfSpan = Math.max(2, (hi - lo) / 2)

    return {
      lo,
      hi,
      density: clamp01(s.density + d.density + 0.6 * m),
      motion: clamp01(s.motion + d.motion),
      pace: clamp01(s.pace + d.pace),
      vibrato: clamp01(s.vibrato + d.vib),
      dyn: d.dyn,
      macro: m,
      center: clamp(mid + d.center, lo + Math.min(2, halfSpan), hi - Math.min(2, halfSpan)),
    }
  }

  pickContour(e) {
    const lowness = clamp01((64 - e.center) / 16)
    const w = {
      arch: 0.28 + 0.1 * e.motion,
      sigh: 0.24 - 0.05 * e.motion + 0.1 * (1 - e.pace),
      question: 0.14 + 0.06 * e.motion,
      static: 0.1 + 0.3 * (1 - e.motion) + 0.25 * lowness,
      cascade: 0.08 + 0.5 * e.motion * e.pace,
    }
    const override = this.settings.contourWeights
    if (override) for (const k of CONTOURS) if (override[k] != null) w[k] = override[k]

    // Say something different from last time.
    if (this.lastArchetype) w[this.lastArchetype] *= this.repeatRun >= 2 ? 0 : 0.45
    return this.rng.weighted(CONTOURS, CONTOURS.map((k) => w[k]))
  }

  shape(contour, n) {
    const r = this.rng
    switch (contour) {
      case 'arch': {
        const A = 3 + 4 * r()
        return (u) => A * Math.sin(Math.PI * u)
      }
      case 'sigh': {
        const A = 3 + 5 * r()
        return (u) => -A * Math.pow(u, 0.7)
      }
      case 'question': {
        const A = 2 + 3 * r()
        return (u) => A * Math.pow(u, 1.4)
      }
      case 'cascade': {
        const A = 6 + 8 * r()
        return (u) => -A * u
      }
      default:
        return (u) => Math.round(1.2 * Math.sin(3 * Math.PI * u))
    }
  }

  noteCount(contour, e) {
    const ranges = {
      arch: [5, 11],
      sigh: [3, 8],
      question: [3, 6],
      static: [2, 5],
      cascade: [7, 20],
    }
    const override = this.settings.noteRange
    const [nMin, nMax] = override ?? ranges[contour]
    let n = nMin + Math.floor(Math.pow(this.rng(), 1.15) * (nMax - nMin + 1))
    n = Math.round(n * (0.55 + 0.9 * e.pace))
    return clamp(n, 2, 24)
  }

  /**
   * Build one phrase — one breath.
   * Returns note events with times relative to the phrase start.
   */
  nextPhrase() {
    const s = this.settings
    const r = this.rng
    const e = this.effective()

    const contour = this.pickContour(e)
    this.repeatRun = contour === this.lastArchetype ? this.repeatRun + 1 : 0
    this.lastArchetype = contour

    const nWanted = this.noteCount(contour, e)
    const shape = this.shape(contour, nWanted)

    const loDeg = this.degreeNear(e.lo)
    const hiDeg = this.degreeNear(e.hi)
    const centerDeg = this.degreeNear(e.center)

    let d0 = this.lastDegree ?? centerDeg
    d0 = clamp(d0, loDeg, hiDeg)

    // Breath capacity in seconds. Breathier playing burns air faster, so the
    // Breathiness knob shortens phrases without anyone asking it to.
    const B = (s.breathCapacity ?? 7.5) * Math.exp(r.gauss(0, 0.18)) * (1 + 0.35 * (1 - s.breathiness))
    const baseDur = (s.baseDur ?? 1.35) * Math.pow(2, -2 * e.pace)

    const notes = []
    let air = 0
    let t = 0
    let degree = d0
    let lastStep = 0
    let repeats = 0

    for (let i = 0; i < nWanted; i++) {
      const u = nWanted > 1 ? i / (nWanted - 1) : 0
      const isLast = i === nWanted - 1

      if (i > 0) {
        degree = this.walk(degree, d0 + shape(u), centerDeg, loDeg, hiDeg, e, lastStep)
        const step = degree - (notes.length ? this.degreeOf(notes[notes.length - 1]) : degree)
        lastStep = step
        repeats = step === 0 ? repeats + 1 : 0
      }

      // Land the phrase somewhere that sounds like an ending — except for a
      // question, which is forbidden the tonic. That prohibition is the whole
      // reason it sounds like a question.
      if (isLast && notes.length > 1) {
        degree = this.cadence(contour, degree, centerDeg, loDeg, hiDeg, e)
      }

      const midi = clamp(this.midiOf(degree), 36, 96)

      const rr = this.pickRhythm(contour, u, isLast)
      const rubato = 1 + r.gauss(0, 0.06) * (1 - 0.5 * e.pace)
      let duration = baseDur * rr * rubato

      const expr = this.ornament(contour, u, isLast, e, midi, lastStep, repeats, duration)
      const cost = this.airCost(duration, midi, s.breathiness, expr)

      // Out of air. If we are near the end of the breath, let the last note run
      // short and mark it — running out mid-note is a very human sound.
      if (air + cost > B && notes.length >= 1) {
        if (air > 0.7 * B && notes.length >= 2) {
          const left = Math.max(0.18, B - air)
          duration = Math.min(duration, left / (0.9 + 0.6 * s.breathiness))
          expr.fall = true
          notes.push(this.makeNote(t, duration, midi, contour, u, i, e, expr, degree))
          t += duration
          air = B
        }
        break
      }

      notes.push(this.makeNote(t, duration, midi, contour, u, i, e, expr, degree))
      air += cost

      // Articulation: a gap means the note is tongued, contiguous means it is
      // slurred and can carry portamento.
      const gap = r.chance(0.35 + 0.4 * e.motion) ? 0.025 + 0.09 * r() : 0
      if (gap > 0) {
        notes[notes.length - 1].duration = Math.max(0.06, duration - gap)
        notes[notes.length - 1].expr.tongue = 'hard'
      }
      t += duration
    }

    if (notes.length === 0) {
      // Degenerate settings; emit one honest note rather than an empty breath.
      notes.push(
        this.makeNote(0, baseDur, clamp(this.midiOf(centerDeg), 36, 96), contour, 0, 0, e, { tongue: 'soft' }, centerDeg)
      )
      t = baseDur
    }

    this.lastDegree = this.degreeOf(notes[notes.length - 1])
    const played = this.expand(notes)

    const restBreath = 0.55 + 0.9 * (air / B) + 0.4 * r()
    let restAfter = restBreath + 16 * Math.pow(1 - e.density, 1.8) * r.range(0.6, 1.6)
    // Occasional long hole. These are what make an hour feel composed rather
    // than merely continuous.
    if (s.mode === 'endless' && r.chance(0.02)) restAfter += r.range(12, 40)

    const duration = t
    const dt = duration + restAfter

    if (s.automation) {
      this.ou('center', dt, 95, 3.5, Math.max(3, (e.hi - e.lo) / 2 - 3))
      this.ou('density', dt, 140, 0.18, 0.35)
      this.ou('motion', dt, 110, 0.15, 0.3)
      this.ou('pace', dt, 180, 0.1, 0.25)
      this.ou('dyn', dt, 75, 0.08, 0.2)
      this.ou('vib', dt, 130, 0.12, 0.25)
      this.maybeModulate()
    }

    this.phraseIndex++
    this.t += dt

    return {
      notes: played,
      duration,
      restAfter,
      contour,
      info: {
        root: this.root,
        scale: this.scaleId,
        center: e.center,
        density: e.density,
        phraseIndex: this.phraseIndex,
      },
    }
  }

  degreeOf(note) {
    return note._degree
  }

  /**
   * Turn ornament flags into actual notes.
   *
   * This happens here rather than in the synth on purpose: once a trill is a
   * real sequence of events, the saved JSON, the exported MIDI and the
   * rendered WAV all agree about what was played. An ornament that only
   * existed inside the synth would vanish the moment you exported it.
   *
   * Continuation events carry `slur`, which tells the voice to change pitch
   * without re-attacking — the same thing a player does by moving fingers
   * while the air keeps flowing.
   */
  expand(notes) {
    const out = []
    const step = (midi, dir) => {
      // Move by one scale degree, not one semitone.
      const d = this.degreeNear(midi)
      return clamp(this.midiOf(d + dir), 36, 96)
    }

    for (const n of notes) {
      const e = n.expr
      const base = {
        midi: n.midi,
        velocity: n.velocity,
        tongue: e.tongue,
        bendCents: e.bendCents ?? 0,
        detuneCents: e.detuneCents ?? 0,
        portamento: e.portamento ?? 0,
        flutter: e.flutter ?? 0,
        fall: !!e.fall,
      }
      let t = n.time
      let left = n.duration

      if (e.grace && left > 0.14) {
        const g = Math.min(0.085, left * 0.3)
        out.push({ ...base, time: t, duration: g, midi: step(n.midi, e.grace), velocity: n.velocity * 0.72 })
        t += g
        left -= g
        base.slur = true
      }

      // A trill belongs on a note of ordinary length. On a ten-second drone
      // note it would be a hundred events and would not sound like a trill
      // anyway — that gesture is flutter-tongue, which is a pressure
      // modulation and costs no events at all.
      if (e.trill && left > 0.3 && left < 2.5) {
        const period = 1 / e.trill.rate
        const upper = step(n.midi, 1)
        const maxSegments = 20
        let i = 0
        while (left > 1e-3 && i < maxSegments) {
          const d = i === maxSegments - 1 ? left : Math.min(period / 2, left)
          out.push({
            ...base,
            time: t,
            duration: d,
            midi: i % 2 === 0 ? n.midi : upper,
            velocity: n.velocity * (i % 2 === 0 ? 1 : 0.9),
            slur: i > 0 || base.slur,
          })
          t += d
          left -= d
          i++
        }
        continue
      }

      if (e.mordent && left > 0.25) {
        const a = left * 0.5
        const b = Math.min(0.1, left * 0.2)
        out.push({ ...base, time: t, duration: a })
        out.push({ ...base, time: t + a, duration: b, midi: step(n.midi, e.mordent), slur: true, velocity: n.velocity * 0.88 })
        out.push({ ...base, time: t + a + b, duration: left - a - b, slur: true })
        continue
      }

      if (e.overblow && left > 0.3 && n.midi + 12 <= 96) {
        // The note cracks up an octave part-way through, which is what
        // overblowing actually sounds like.
        const a = left * 0.45
        out.push({ ...base, time: t, duration: a })
        out.push({ ...base, time: t + a, duration: left - a, midi: n.midi + 12, slur: true, velocity: n.velocity * 0.95 })
        continue
      }

      out.push({ ...base, time: t, duration: left })
    }

    // Nothing shorter than a grace note survives — a 3 ms event is a click,
    // not a pitch, and the tube cannot speak in that time anyway.
    const kept = out.filter((n) => n.duration >= 0.02)
    kept.sort((a, b) => a.time - b.time)
    return kept.length ? kept : out.slice(0, 1).map((n) => ({ ...n, duration: Math.max(0.08, n.duration) }))
  }

  makeNote(time, duration, midi, contour, u, i, e, expr, degree) {
    const s = this.settings
    let v
    switch (contour) {
      case 'arch':
        v = 0.34 + 0.34 * Math.pow(Math.sin(Math.PI * u), 0.8)
        break
      case 'sigh':
        v = 0.68 - 0.3 * u
        break
      case 'question':
        v = 0.4 + 0.22 * u
        break
      case 'cascade':
        v = 0.62 - 0.18 * u + (i % 3 === 0 ? 0.1 : 0)
        break
      default:
        v = 0.45 + 0.06 * Math.sin(3 * Math.PI * u)
    }
    v *= 0.85 + 0.3 * clamp01(0.5 + e.dyn + e.macro)
    v += this.rng.gauss(0, 0.05)
    v = clamp(v, 0.12, 0.98)

    return {
      time,
      duration,
      midi,
      velocity: v,
      expr: { tongue: 'legato', ...expr },
      _degree: degree,
    }
  }

  walk(degree, target, centerDeg, loDeg, hiDeg, e, lastStep) {
    const r = this.rng
    const sizes = [0, 1, 2, 3, 4]
    const weights = [
      0.1 * (1 - e.motion),
      0.55 - 0.15 * e.motion,
      0.22,
      0.08 + 0.1 * e.motion,
      0.05 + 0.2 * e.motion,
    ]
    let step = r.weighted(sizes, weights)
    if (step === 4) step = r.int(4, 6)

    // Leap and recover: the single highest-value rule for making a random walk
    // sound like a melody instead of a stumble.
    if (Math.abs(lastStep) >= 4) {
      step = Math.min(step, 2)
      const dir = lastStep > 0 ? -1 : 1
      if (r.chance(0.75)) return this.constrain(degree + dir * step, centerDeg, loDeg, hiDeg)
    }

    const err = target - degree
    const k = this.settings.gravity ?? 0.55
    const pUp = 0.75 * sigmoid(1.1 * err) + 0.25 * sigmoid(-k * (degree - centerDeg))
    const dir = r.chance(pUp) ? 1 : -1
    return this.constrain(degree + dir * step, centerDeg, loDeg, hiDeg)
  }

  /** Keep a degree inside the register window: fold, then mirror, then clamp. */
  constrain(d, centerDeg, loDeg, hiDeg) {
    const L = this.scale.steps.length
    if (d > hiDeg) {
      if (d - L >= loDeg) return d - L
      const mirrored = 2 * centerDeg - d
      if (mirrored >= loDeg && mirrored <= hiDeg) return mirrored
      this.rawClamps++
      return this.rawClamps > 1 ? ((this.rawClamps = 0), centerDeg) : hiDeg
    }
    if (d < loDeg) {
      if (d + L <= hiDeg) return d + L
      const mirrored = 2 * centerDeg - d
      if (mirrored >= loDeg && mirrored <= hiDeg) return mirrored
      this.rawClamps++
      return this.rawClamps > 1 ? ((this.rawClamps = 0), centerDeg) : loDeg
    }
    this.rawClamps = 0
    return d
  }

  cadence(contour, degree, centerDeg, loDeg, hiDeg, e) {
    const r = this.rng
    const L = this.scale.steps.length
    if (!r.chance(0.55 + 0.3 * (1 - e.motion))) return degree
    const targets = contour === 'question' ? [1, 2, 5] : [0, 4]
    const wantIdx = r.pick(targets) % L
    // Nearest degree with that scale index.
    const oct = Math.round((degree - wantIdx) / L)
    return this.constrain(oct * L + wantIdx, centerDeg, loDeg, hiDeg)
  }

  pickRhythm(contour, u, isLast) {
    if (isLast) {
      return this.rng.weighted(contour === 'static' ? [3, 5, 8] : [2, 3, 5], [40, 35, 25])
    }
    let w = LADDER_WEIGHTS[contour] ?? LADDER_WEIGHTS.base
    if (contour === 'sigh') {
      w = LADDER_WEIGHTS.base.map((x, i) => (LADDER[i] >= 2 ? x * (1 + 1.5 * u) : x))
    }
    return this.rng.weighted(LADDER, w)
  }

  airCost(duration, midi, breathiness, expr) {
    const registerFactor =
      1 + 0.55 * Math.max(0, (56 - midi) / 12) + 0.25 * Math.max(0, (midi - 84) / 12)
    let cost = duration * (0.9 + 0.6 * breathiness) * registerFactor
    if (expr.trill) cost += 0.15 * duration
    if (expr.flutter) cost += 0.35 * duration
    if (expr.overblow) cost += 0.2 * duration
    return cost
  }

  ornament(contour, u, isLast, e, midi, lastStep, repeats, duration) {
    const r = this.rng
    const s = this.settings
    const p = s.ornamentScale ?? 1
    const expr = {}

    // A repeated note has to be re-articulated or it sounds like a stuck key.
    if (repeats >= 1) {
      expr.tongue = 'hard'
      expr.detuneCents = r.range(-8, 8)
    }

    const grace = (0.1 + 0.3 * e.motion) * p
    const trill = (0.04 + 0.16 * e.motion) * p
    const mordent = (0.05 + 0.15 * e.motion) * p
    const porta = (s.portamento ?? 0.18 + 0.2 * (1 - e.motion)) * p
    const flutter = (s.flutter ?? 0.03 + 0.08 * s.breathiness) * p
    const overblow = (s.overblow ?? 0.04 + 0.08 * e.motion) * p

    if (duration > 0.35 && duration < 2.5 && r.chance(trill)) {
      expr.trill = { rate: 5 + 6 * e.motion + 3 * r() }
    } else if (duration > 0.22 && r.chance(mordent)) {
      expr.mordent = r.chance(0.5) ? 1 : -1
    }
    if (duration < 1.2 && r.chance(grace)) {
      expr.grace = r.chance(0.65) ? -1 : 1
    }
    if (r.chance(porta) && Math.abs(lastStep) <= 3 && lastStep !== 0) {
      expr.portamento = clamp(0.05 + 0.1 * r(), 0.02, 0.25)
    }
    if (duration > 0.7 && r.chance(flutter)) {
      expr.flutter = 22 + 8 * r()
    }
    if (r.chance(overblow) && midi + 12 <= 96) {
      expr.overblow = true
    }
    // Bending into a note from below: common on a low flute, rare up high.
    const scoopP = clamp01(0.1 + 0.35 * clamp01((64 - midi) / 16)) * p
    if (!isLast && r.chance(scoopP)) expr.bendCents = -r.range(15, 60)
    if (isLast && r.chance(0.12 * p)) expr.fallOff = true

    return expr
  }

  /** Slow, deliberate modulation: change key, or slide to a related mode. */
  maybeModulate() {
    const s = this.settings
    const r = this.rng
    if (s.rootAuto && this.t > this.nextRootJump) {
      // Fourths and fifths first — the moves that sound like the same music.
      this.root = (this.root + r.weighted([5, 7, 2, 10, 3, 9], [30, 30, 12, 12, 8, 8])) % 12
      this.nextRootJump = this.t + r.range(200, 440)
      this.lastDegree = null
    }
    if (s.scaleAuto && this.t > this.nextScaleJump) {
      const cur = new Set(this.scale.steps)
      const near = SCALES.filter((x) => {
        if (x.id === this.scaleId || x.id === 'chromatic') return false
        let shared = 0
        for (const st of x.steps) if (cur.has(st)) shared++
        return shared >= 3
      })
      if (near.length) this.scaleId = r.pick(near).id
      this.nextScaleJump = this.t + r.range(150, 330)
    }
  }
}

// ---------------------------------------------------------------------------
// Presets. Each is a complete settings object; the UI just applies one.
// ---------------------------------------------------------------------------

export const PRESETS = [
  {
    id: 'drone',
    name: 'Drone Flute',
    blurb: 'Low, bassy, sustained. Two or three very long notes, then a long silence.',
    settings: {
      mode: 'endless',
      registerLow: 43,
      registerHigh: 58,
      density: 0.3,
      breathiness: 0.42,
      motion: 0.1,
      pace: 0.08,
      vibrato: 0.26,
      space: 0.85,
      scale: 'minor-pentatonic',
      root: 9,
      scaleAuto: false,
      rootAuto: true,
      automation: true,
      gravity: 0.9,
      baseDur: 1.6,
      breathCapacity: 22,
      contourWeights: { static: 0.45, sigh: 0.3, arch: 0.2, question: 0.05, cascade: 0 },
      noteRange: [2, 4],
      portamento: 0.55,
      flutter: 0.25,
      overblow: 0.02,
    },
  },
  {
    id: 'ambient',
    name: 'Long Grass',
    blurb: 'Endless background music. Everything drifts, so it never settles into a pattern.',
    settings: {
      mode: 'endless',
      registerLow: 62,
      registerHigh: 86,
      density: 0.35,
      breathiness: 0.3,
      motion: 0.3,
      pace: 0.3,
      vibrato: 0.45,
      space: 0.7,
      scale: 'dorian',
      root: 2,
      scaleAuto: true,
      rootAuto: true,
      automation: true,
      gravity: 0.55,
    },
  },
  {
    id: 'smatterings',
    name: 'Smatterings',
    blurb: 'One breath, a dozen quick notes high up, and it stops. Press again for another.',
    settings: {
      mode: 'burst',
      burstPhrases: 1,
      registerLow: 72,
      registerHigh: 93,
      density: 0.85,
      breathiness: 0.22,
      motion: 0.85,
      pace: 0.85,
      vibrato: 0.22,
      space: 0.35,
      scale: 'major-pentatonic',
      root: 7,
      scaleAuto: false,
      rootAuto: false,
      automation: false,
      gravity: 0.4,
      baseDur: 0.6,
      breathCapacity: 4.5,
      contourWeights: { cascade: 0.4, arch: 0.32, question: 0.28, sigh: 0, static: 0 },
      noteRange: [9, 16],
      ornamentScale: 1.3,
    },
  },
  {
    id: 'bamboo',
    name: 'Bamboo Rain',
    blurb: 'Short gestures with wide gaps, mid-high — a shakuhachi practising in another room.',
    settings: {
      mode: 'endless',
      registerLow: 67,
      registerHigh: 88,
      density: 0.55,
      breathiness: 0.4,
      motion: 0.62,
      pace: 0.6,
      vibrato: 0.35,
      space: 0.55,
      scale: 'hirajoshi',
      root: 4,
      scaleAuto: true,
      rootAuto: true,
      automation: true,
      breathCapacity: 6,
      ornamentScale: 1.2,
    },
  },
  {
    id: 'cathedral',
    name: 'Cathedral Low',
    blurb: "The drone's louder sibling: same low band, denser, built on slow rising arches.",
    settings: {
      mode: 'endless',
      registerLow: 45,
      registerHigh: 64,
      density: 0.45,
      breathiness: 0.35,
      motion: 0.28,
      pace: 0.2,
      vibrato: 0.4,
      space: 0.9,
      scale: 'aeolian',
      root: 0,
      scaleAuto: true,
      rootAuto: true,
      automation: true,
      baseDur: 1.6,
      breathCapacity: 16,
      contourWeights: { arch: 0.38, sigh: 0.28, static: 0.24, question: 0.1, cascade: 0 },
      noteRange: [3, 6],
      portamento: 0.42,
    },
  },
]

export const PRESET_BY_ID = Object.fromEntries(PRESETS.map((p) => [p.id, p]))
