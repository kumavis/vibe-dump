// The score. Everything is synthesised — no samples, no files — and all of it
// sounds inside the hall: a convolution reverb the size of the place, twelve
// seconds of dark concrete tail, with the flutter of its parallel walls.
//
//   shepard  the endless falling glissando from Falling Repose, in an
//            AudioWorklet, catching on the chord tones and lingering there.
//            Far off now: mostly reverb.
//   pad      slow chords over a bass that walks down a step at a time
//   air      noise breathed through resonators tuned to the chord: a choir
//            with no words
//   hall     the room itself: the low, slow breathing of a great volume of
//            air shut in concrete
//   dust     what the motes in the light would sound like if they did: tiny
//            glassy grains, pitched to the chord, falling as the dust falls,
//            and hanging in the air, drawn out, when time stops
//   breath   a candle blown out — a soft breath and the small sound of a flame
//            going, let loose in the reverb. It comes when time stops.
//
// One clock drives all of it — the same one that moves the picture — so when
// time stops, the music's clock stops with it.
//
// `layers` picks which of these play (all of them by default), so they can be
// heard alone or left out: ?layers=dust,breath,hall

const WORKLET = /* js */ `
const TABLE = 4096
const SIN = new Float32Array(TABLE + 1)
for (let i = 0; i <= TABLE; i++) SIN[i] = Math.sin((i / TABLE) * Math.PI * 2)
function sinT(ph) {
  const x = ph * TABLE
  const i = x | 0
  return SIN[i] + (SIN[i + 1] - SIN[i]) * (x - i)
}

class Shepard extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'rate', defaultValue: -0.016, minValue: -2, maxValue: 2, automationRate: 'k-rate' },
      { name: 'center', defaultValue: 8.1, minValue: 4, maxValue: 13, automationRate: 'k-rate' },
      { name: 'width', defaultValue: 1.0, minValue: 0.3, maxValue: 3, automationRate: 'k-rate' },
      { name: 'linger', defaultValue: 0.9, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'fifth', defaultValue: 0.3, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ]
  }
  constructor() {
    super()
    this.N = 10
    this.base = 18.354 // D0: the glide's octaves are Ds
    this.logBase = Math.log2(this.base)
    this.pos = 0.58
    this.ph = new Float64Array(this.N * 4)
    for (let i = 0; i < this.ph.length; i++) this.ph[i] = Math.random()
    this.chord = [0, 4, 7]
    this.port.onmessage = (e) => {
      if (e.data && e.data.chord) this.chord = e.data.chord
    }
  }
  amp(oct, center, width) {
    const d = (this.logBase + oct - center) / width
    return Math.exp(-0.5 * d * d)
  }
  voice(L, R, k, oa, ob, mul, gain, center, width) {
    const n = L.length
    const lb = Math.log2(mul)
    const a0 = this.amp(oa + lb, center, width) * gain
    const a1 = this.amp(ob + lb, center, width) * gain
    if (a0 < 1e-5 && a1 < 1e-5) return
    const f0 = this.base * mul * Math.pow(2, oa)
    const f1 = this.base * mul * Math.pow(2, ob)
    let pL = this.ph[k], pR = this.ph[k + 1]
    for (let i = 0; i < n; i++) {
      const t = i / n
      const f = f0 + (f1 - f0) * t
      const a = a0 + (a1 - a0) * t
      pL += (f * 0.9986) / sampleRate
      pR += (f * 1.0014) / sampleRate
      if (pL >= 1) pL -= Math.floor(pL)
      if (pR >= 1) pR -= Math.floor(pR)
      let p2L = pL * 2, p2R = pR * 2
      if (p2L >= 1) p2L -= 1
      if (p2R >= 1) p2R -= 1
      L[i] += a * (sinT(pL) + 0.14 * sinT(p2L))
      R[i] += a * (sinT(pR) + 0.14 * sinT(p2R))
    }
    this.ph[k] = pL
    this.ph[k + 1] = pR
  }
  process(inputs, outputs, p) {
    const out = outputs[0]
    const L = out[0]
    const R = out[1] || out[0]
    const n = L.length
    const rate = p.rate[0], center = p.center[0], width = p.width[0]
    const linger = p.linger[0], fifth = p.fifth[0]

    // How close is the glide to one of the chord's tones? Close → slow.
    const pc = (((this.pos % 1) + 1) % 1) * 12
    let near = 6
    for (const c of this.chord) {
      const d = (((pc - c) % 12) + 12) % 12
      near = Math.min(near, d, 12 - d)
    }
    const caught = Math.exp(-(near * near) / (2 * 0.3 * 0.3))
    const slow = (1 - linger * 0.96 * caught) / (1 - linger * 0.96 * 0.2)
    const p0 = this.pos
    const p1 = p0 + (rate * slow * n) / sampleRate
    this.pos = p1

    const N = this.N
    const norm = 0.36 / width
    for (let v = 0; v < N; v++) {
      const o1 = (((v + p1) % N) + N) % N
      let o0 = (((v + p0) % N) + N) % N
      if (Math.abs(o1 - o0) > 1) o0 = o1 // wrapped round the far edge, where it's silent
      this.voice(L, R, v * 4, o0, o1, 1, norm, center, width)
      if (fifth > 0.001) this.voice(L, R, v * 4 + 2, o0, o1, 1.5, norm * fifth * caught, center, width)
    }
    return true
  }
}
registerProcessor('shepard', Shepard)
`

// D major. The bass walks D C# B A G F# E A and round again.
// [bass, ...voicing] as MIDI notes; `pcs` are the chord tones the glide can
// catch on, as semitones above D.
const CHORDS = [
  { bass: 38, notes: [45, 54, 57, 64], pcs: [0, 4, 7] }, // D add9
  { bass: 37, notes: [45, 52, 57, 61], pcs: [7, 11, 2] }, // A/C#
  { bass: 35, notes: [42, 50, 54, 61], pcs: [9, 0, 4] }, // Bm add9
  { bass: 33, notes: [42, 49, 54, 57], pcs: [4, 7, 11] }, // F#m/A
  { bass: 31, notes: [38, 47, 54, 57], pcs: [5, 9, 0, 4] }, // Gmaj7 add9
  { bass: 30, notes: [45, 50, 54, 64], pcs: [0, 4, 7] }, // D/F#
  { bass: 28, notes: [43, 50, 54, 59], pcs: [2, 5, 9, 0] }, // Em7 add9
  { bass: 33, notes: [40, 50, 52, 55], pcs: [7, 0, 2, 5] }, // A7sus4
]
const CHORD_LEN = 14 // music-seconds: a little slower than the fall, for the room
const LEVEL = 0.6

export const LAYERS = ['shepard', 'pad', 'air', 'hall', 'dust', 'breath']

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12)

// A seeded generator, so the hall sounds the same every visit.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// The hall's impulse response. Concrete keeps the lows for a very long time
// and the air eats the highs, so the tail is three bands of noise dying at
// their own rates: thirteen seconds below 400 Hz, nine in the middle, three
// and a half above 3 kHz. Before it, the first reflections come late and
// sparse, the way they do in a room this big, and the tail carries a faint
// flutter from the parallel walls 92 m apart and the floor and ceiling 30 m
// apart.
function cathedral(ctx, seconds = 12) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const buf = ctx.createBuffer(2, len, sr)
  const pre = 0.045
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    const r = rng(ch ? 7919 : 104729)
    const a400 = 1 - Math.exp((-2 * Math.PI * 400) / sr)
    const a3k = 1 - Math.exp((-2 * Math.PI * 3000) / sr)
    let lo = 0, hi = 0
    const p0 = Math.floor(sr * pre)
    for (let i = p0; i < len; i++) {
      const t = (i - p0) / sr
      const n = r() * 2 - 1
      lo += (n - lo) * a400
      hi += (n - hi) * a3k
      const low = lo, mid = hi - lo, high = n - hi
      const e = (rt) => Math.exp((-6.9 * t) / rt)
      // the diffuse tail builds up over the first fifth of a second
      const build = 1 - Math.exp(-t / 0.07)
      const flutter = 1 + 0.18 * Math.exp(-t / 2.5) * (Math.cos((2 * Math.PI * t) / 0.268) + 0.6 * Math.cos((2 * Math.PI * t) / 0.175))
      d[i] = (low * 2.2 * e(13) + mid * 1.1 * e(9) + high * 0.5 * e(3.5)) * build * flutter
    }
    // early reflections: floor, near piers, the side walls, the far end
    for (let k = 0; k < 26; k++) {
      const ms = 48 + Math.pow(r(), 0.8) * 320
      const i = Math.floor(sr * (pre + ms * 0.001))
      if (i < len) d[i] += (r() < 0.5 ? -1 : 1) * 0.55 * Math.exp(-ms / 260) * (0.4 + 0.6 * r())
    }
  }
  return buf
}

function noiseBuffer(ctx, seconds = 6, seed = 1) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const buf = ctx.createBuffer(2, len, sr)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    const r = rng(seed * 31 + ch)
    // pink-ish (Paul Kellet's economy filter)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < len; i++) {
      const w = r() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046
      b1 = 0.963 * b1 + w * 0.2965164
      b2 = 0.57 * b2 + w * 1.0526913
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.12
    }
  }
  return buf
}

export class Score {
  constructor({ layers = LAYERS } = {}) {
    this.started = false
    this.muted = false
    this.ctx = null
    this.on = new Set(layers)
    this.rand = rng(2718)
  }

  // Must be called from inside a user gesture for a live context. An offline
  // context can be passed in to render the score without a page.
  async start(ctx) {
    if (this.started) return
    this.started = true
    const live = !ctx
    if (live) {
      const AC = window.AudioContext || window.webkitAudioContext
      ctx = new AC({ latencyHint: 'playback' })
      ctx.resume()
    }
    this.ctx = ctx
    // Without AudioWorklet there's no glide, but everything else still plays.
    this.hasShepard = false
    if (ctx.audioWorklet && this.on.has('shepard')) {
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }))
      try {
        await ctx.audioWorklet.addModule(url)
        this.hasShepard = true
      } catch (err) {
        console.warn('shepard worklet unavailable:', err)
      }
      URL.revokeObjectURL(url)
    }
    this.build()
    this.live = live
  }

  build() {
    const ctx = this.ctx
    const now = ctx.currentTime
    const g = (v = 1) => {
      const n = ctx.createGain()
      n.gain.value = v
      return n
    }
    this.g = g

    // master
    this.master = g(0)
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -20
    comp.knee.value = 18
    comp.ratio.value = 2.6
    comp.attack.value = 0.04
    comp.release.value = 0.6
    this.master.connect(comp).connect(ctx.destination)
    this.master.gain.setValueAtTime(0, now)
    this.master.gain.linearRampToValueAtTime(0.0001, now + 0.05)
    this.master.gain.setTargetAtTime(LEVEL, now + 0.05, 2.6)

    this.dry = g(1)
    this.dry.connect(this.master)
    this.verb = ctx.createConvolver()
    this.verb.buffer = cathedral(ctx)
    this.verbIn = g(1)
    const verbOut = g(1.0)
    this.verbIn.connect(this.verb).connect(verbOut).connect(this.master)

    // tape: one slow wobble and one offset shared by every pitched voice, so
    // holding time sags the whole score like a slowing reel
    this.tape = ctx.createConstantSource()
    this.tape.offset.value = 0
    this.wow = ctx.createOscillator()
    this.wow.frequency.value = 0.31
    this.wowDepth = g(4)
    this.wow.connect(this.wowDepth)
    this.tapeBus = g(1)
    this.tape.connect(this.tapeBus)
    this.wowDepth.connect(this.tapeBus)
    this.tape.start(now)
    this.wow.start(now)

    const noise = noiseBuffer(ctx, 6, 1)
    this.noise = noise

    // shepard: far off, in the reverb more than out of it
    this.shepGain = g(0)
    const shepTone = ctx.createBiquadFilter()
    shepTone.type = 'lowpass'
    shepTone.frequency.value = 2200
    shepTone.Q.value = 0.4
    if (this.hasShepard) {
      this.shep = new AudioWorkletNode(ctx, 'shepard', { numberOfInputs: 0, outputChannelCount: [2] })
      this.shep.connect(shepTone)
    }
    shepTone.connect(this.shepGain)
    this.shepGain.connect(g(0.18)).connect(this.dry)
    this.shepGain.connect(this.verbIn)

    // pad
    const harm = [0, 1, 0.45, 0.24, 0.14, 0.085, 0.05, 0.03, 0.018, 0.01, 0.006]
    this.wave = ctx.createPeriodicWave(new Float32Array(harm.length), new Float32Array(harm))
    this.padFilter = ctx.createBiquadFilter()
    this.padFilter.type = 'lowpass'
    this.padFilter.frequency.value = 800
    this.padFilter.Q.value = 0.5
    this.padBus = g(this.on.has('pad') ? 0.055 : 0)
    this.padFilter.connect(this.padBus)
    this.padBus.connect(g(0.6)).connect(this.dry)
    this.padBus.connect(this.verbIn)
    this.voices = []

    // the walking bass: an octave up where small speakers can carry it, and
    // its true pitch underneath for anyone who can feel it
    this.subGain = g(0)
    this.subGain.connect(this.dry)
    this.subGain.connect(g(0.3)).connect(this.verbIn)
    this.subs = [
      [12, 0.62],
      [0, 0.5],
    ].map(([shift, level]) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = mtof(CHORDS[0].bass + shift)
      const lv = g(level)
      o.connect(lv).connect(this.subGain)
      this.tapeBus.connect(o.detune)
      o.start(now)
      return { o, shift }
    })

    // air choir
    this.airSrc = ctx.createBufferSource()
    this.airSrc.buffer = noise
    this.airSrc.loop = true
    this.airBus = g(0)
    this.air = []
    for (let i = 0; i < 4; i++) {
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.Q.value = 34
      bp.frequency.value = 440
      this.airSrc.connect(bp).connect(g(1.6)).connect(this.airBus)
      this.air.push(bp)
    }
    this.airBus.connect(this.verbIn)
    this.airBus.connect(g(0.2)).connect(this.dry)
    this.airSrc.start(now)

    // the hall: a very low, slow breathing of air, felt more than heard, and
    // above it the faintest hiss of a large quiet room
    this.hallSrc = ctx.createBufferSource()
    this.hallSrc.buffer = noiseBuffer(ctx, 7, 2)
    this.hallSrc.loop = true
    this.hallSrc.playbackRate.value = 0.5
    this.hallLow = ctx.createBiquadFilter()
    this.hallLow.type = 'lowpass'
    this.hallLow.frequency.value = 140
    this.hallLow.Q.value = 0.6
    const hallHiss = ctx.createBiquadFilter()
    hallHiss.type = 'bandpass'
    hallHiss.frequency.value = 5200
    hallHiss.Q.value = 0.5
    this.hallGain = g(0)
    this.hallSrc.connect(this.hallLow).connect(this.hallGain)
    this.hallSrc.connect(hallHiss).connect(g(0.05)).connect(this.hallGain)
    this.hallGain.connect(this.dry)
    this.hallGain.connect(g(0.5)).connect(this.verbIn)
    this.hallSrc.start(now)

    // dust and breath have buses of their own, mostly reverb
    this.dustBus = g(0)
    this.dustBus.connect(g(0.35)).connect(this.dry)
    this.dustBus.connect(this.verbIn)
    this.breathBus = g(this.on.has('breath') ? 1 : 0)
    this.breathBus.connect(g(0.4)).connect(this.dry)
    this.breathBus.connect(g(1.3)).connect(this.verbIn)

    // state
    this.lastNow = now
    this.mtime = 0
    this.chordIndex = -1
    this.nextChord = 0
    this.nextGrain = now + 2
    this.inSusp = false
    this.held = false
    this.lastBreath = -100
  }

  setMuted(m) {
    this.muted = m
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    if (m) {
      this.master.gain.setTargetAtTime(0, now, 0.25)
      if (this.live) setTimeout(() => this.muted && this.ctx.suspend(), 1500)
    } else {
      this.ctx.resume()
      this.master.gain.setTargetAtTime(LEVEL, now, 0.8)
    }
  }

  // Pause with the page: rAF stops when hidden, and so does the clock.
  setHidden(hidden) {
    if (!this.ctx || !this.live || this.muted) return
    if (hidden) this.ctx.suspend()
    else this.ctx.resume()
  }

  chord(i, at) {
    const ctx = this.ctx
    const C = CHORDS[i % CHORDS.length]
    this.current = C
    // let the last chord go slowly
    for (const v of this.voices) {
      v.env.gain.cancelScheduledValues(at)
      v.env.gain.setTargetAtTime(0, at, 2.8)
      for (const o of v.osc) o.stop(at + 16)
    }
    this.voices = []
    if (this.on.has('pad'))
      C.notes.forEach((m, k) => {
        const env = ctx.createGain()
        env.gain.value = 0
        const level = (0.32 / Math.sqrt(C.notes.length)) * (1 - k * 0.09)
        env.gain.setValueAtTime(0, at)
        env.gain.setTargetAtTime(level, at, 2.2)
        env.connect(this.padFilter)
        const osc = [-1, 1].map((side) => {
          const o = ctx.createOscillator()
          o.setPeriodicWave(this.wave)
          o.frequency.value = mtof(m)
          // wider chorus up high, tighter down low where beating turns to wobble
          o.detune.value = side * (m < 48 ? 2.5 : 5 + this.rand() * 3)
          this.tapeBus.connect(o.detune)
          const pan = ctx.createStereoPanner()
          pan.pan.value = side * (0.25 + k * 0.1)
          o.connect(pan).connect(env)
          o.start(at)
          this.unhookOnEnd(o)
          return o
        })
        this.voices.push({ env, osc })
      })
    // the bass glides down to its next step
    for (const { o, shift } of this.subs) o.frequency.setTargetAtTime(mtof(C.bass + shift), at, 0.9)
    // the choir retunes to the upper chord tones
    this.air.forEach((bp, k) => {
      const m = C.notes[k % C.notes.length] + 12
      bp.frequency.setTargetAtTime(mtof(m), at, 1.4)
    })
    this.shep?.port.postMessage({ chord: C.pcs })
  }

  // One mote of sound: a short sine grain high above the chord, with a soft
  // window so it has no click. `hang` draws it out — the dust when time stops.
  grain(at, hang) {
    const ctx = this.ctx
    const C = this.current ?? CHORDS[0]
    const r = this.rand
    const pick = C.notes[Math.floor(r() * C.notes.length)]
    const m = pick + 24 + 12 * Math.floor(r() * 2.2)
    const dur = hang ? 0.6 + r() * 1.6 : 0.025 + r() * r() * 0.08
    const peak = (hang ? 0.05 : 0.11) * (0.3 + r() * 0.7) * Math.pow(2, -(m - 80) / 24)
    const o = ctx.createOscillator()
    o.frequency.value = mtof(m)
    // the falling dust: each grain slips a little downward as it sounds
    o.detune.setValueAtTime(r() * 20 - 10, at)
    o.detune.linearRampToValueAtTime(hang ? -6 : -30 - r() * 40, at + dur)
    const e = ctx.createGain()
    e.gain.value = 0
    e.gain.setValueAtTime(0, at)
    e.gain.linearRampToValueAtTime(peak, at + dur * (hang ? 0.4 : 0.18))
    e.gain.linearRampToValueAtTime(0, at + dur)
    const pan = ctx.createStereoPanner()
    pan.pan.value = (r() * 2 - 1) * 0.85
    o.connect(e).connect(pan).connect(this.dustBus)
    o.start(at)
    o.stop(at + dur + 0.05)
    o.onended = () => {
      o.disconnect()
      e.disconnect()
      pan.disconnect()
    }
  }

  // A candle blown out: a breath through pursed lips — noise through a band
  // that falls as the breath runs out — then the small soft sound of the flame
  // going. Dry it is half a second; in this hall it takes ten to die.
  breath(at, strength = 1) {
    const ctx = this.ctx
    const r = this.rand
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const off = r() * (this.noise.duration - 2)
    const len = 0.55 + r() * 0.25
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.Q.value = 0.8
    band.frequency.setValueAtTime(1500 + r() * 500, at)
    band.frequency.exponentialRampToValueAtTime(520, at + len)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 260
    const e = ctx.createGain()
    e.gain.value = 0
    e.gain.setValueAtTime(0, at)
    e.gain.linearRampToValueAtTime(0.9 * strength, at + 0.05)
    e.gain.setTargetAtTime(0.35 * strength, at + 0.05, 0.12)
    e.gain.setTargetAtTime(0, at + len * 0.55, len * 0.18)
    const pan = ctx.createStereoPanner()
    pan.pan.value = (r() - 0.5) * 0.3
    src.connect(hp).connect(band).connect(e).connect(pan).connect(this.breathBus)
    src.start(at, off, len + 1)
    // the flame going out: a low soft puff as the air closes in
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(95, at + len * 0.5)
    o.frequency.exponentialRampToValueAtTime(48, at + len * 0.5 + 0.18)
    const pe = ctx.createGain()
    pe.gain.value = 0
    pe.gain.setValueAtTime(0, at + len * 0.5)
    pe.gain.linearRampToValueAtTime(0.22 * strength, at + len * 0.5 + 0.015)
    pe.gain.setTargetAtTime(0, at + len * 0.5 + 0.02, 0.05)
    o.connect(pe).connect(pan)
    o.start(at + len * 0.5)
    o.stop(at + len * 0.5 + 0.5)
    src.onended = () => {
      src.disconnect()
      hp.disconnect()
      band.disconnect()
      e.disconnect()
    }
    o.onended = () => {
      o.disconnect()
      pe.disconnect()
      pan.disconnect()
    }
  }

  // Every pitched voice listens to the tape bus; once a voice has finished,
  // cut it loose so the bus doesn't keep it alive.
  unhookOnEnd(o) {
    o.onended = () => {
      try {
        this.tapeBus.disconnect(o.detune)
      } catch {}
      o.disconnect()
    }
  }

  // Called every frame with the shared clock. `light` is how much of the sun
  // is in the frame (0..1), so the dust is loudest when the shafts are in view.
  update(clock, light = 1) {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const now = ctx.currentTime
    const dt = Math.max(0, Math.min(0.25, now - this.lastNow))
    this.lastNow = now
    if (dt === 0 && this.chordIndex >= 0) return
    const T = clock.wall
    const rate = clock.rate
    const at = now + 0.03
    const set = (param, v, tau = 0.25) => param.setTargetAtTime(v, now, tau)
    const on = (k) => (this.on.has(k) ? 1 : 0)

    // music's own clock crawls when time does, but never runs backwards
    this.mtime += dt * Math.max(0.05, Math.min(1.8, Math.abs(rate)))
    if (this.mtime >= this.nextChord) {
      this.chordIndex++
      this.chord(this.chordIndex, at)
      this.nextChord += CHORD_LEN
    }

    // the glide: an octave a minute, climbing when time reverses
    const shep = this.shep?.parameters
    if (shep) {
      set(shep.get('rate'), -0.02 * rate * (1 + 0.6 * clock.rush), 0.4)
      set(shep.get('fifth'), 0.25 + 0.5 * clock.susp, 1)
      set(shep.get('center'), 7.9 + 0.4 * Math.sin(T / 41) + 0.3 * clock.rush, 2)
    }
    // it drifts in and out on its own long tide
    const tide = 0.5 + 0.5 * Math.sin((T / 97) * Math.PI * 2 - 1.2)
    const shepLevel = 0.05 + 0.8 * tide * tide + 0.3 * clock.rush + 0.35 * clock.susp
    set(this.shepGain.gain, on('shepard') * Math.min(1, shepLevel) * 0.17, 1.5)

    // the pad opens with the light
    const swell = clock.swell
    const cutoff = (550 + 600 * (0.5 + 0.5 * Math.sin(T / 23)) + 1100 * swell + 600 * clock.rush) * (1 - 0.45 * clock.hold)
    set(this.padFilter.frequency, cutoff, 0.8)
    set(this.subGain.gain, on('pad') * (0.08 + 0.03 * swell), 1)
    set(this.airBus.gain, on('air') * (0.08 + 0.18 * swell + 0.05 * Math.max(0, Math.sin(T / 31))), 1.5)

    // the room breathes on its own slow cycle, deeper when time is held
    const breathe = 0.5 + 0.5 * Math.sin(T / 11.3) * Math.sin(T / 29 + 1)
    set(this.hallGain.gain, on('hall') * (0.08 + 0.06 * breathe + 0.05 * clock.hold), 2)
    set(this.hallLow.frequency, 90 + 70 * breathe, 2)

    // tape: hold sags the pitch and deepens the wobble
    set(this.tape.offset, -38 * clock.hold - 8 * clock.susp, 0.6)
    set(this.wowDepth.gain, 3 + 14 * clock.hold + 6 * clock.susp, 0.6)
    set(this.wow.frequency, 0.12 + 0.25 * Math.max(0, Math.min(1.5, rate)), 0.6)

    // dust: grains come as fast as the dust falls; when time stops they hang
    const still = Math.max(clock.hold, clock.susp)
    set(this.dustBus.gain, on('dust') * (0.7 + 0.7 * light), 1)
    if (on('dust')) {
      const perSec = 2 + 9 * Math.min(1.5, Math.max(0, rate)) * (1 - still) + 1.2 * still
      // schedule a little ahead, never a burst to catch up after a stall
      if (this.nextGrain < now) this.nextGrain = now
      while (this.nextGrain < now + 0.12) {
        this.grain(this.nextGrain, this.rand() < still)
        this.nextGrain += -Math.log(1 - this.rand()) / perSec
      }
    }

    // breath: as time comes to a stop — a suspension, or a held press
    if (on('breath')) {
      const stopping = (clock.susp > 0.35 && !this.inSusp) || (clock.holding && !this.held)
      if (stopping && T - this.lastBreath > 6) {
        this.breath(at + 0.05, clock.holding ? 0.8 : 1)
        this.lastBreath = T
      }
    }
    if (clock.susp > 0.35) this.inSusp = true
    else if (clock.susp < 0.1) this.inSusp = false
    this.held = clock.holding
  }
}
