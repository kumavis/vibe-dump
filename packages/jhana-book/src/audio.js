// audio.js — one slow drone per spread (Web Audio, muted by default).
//
// Per voice: a sine and a triangle a few cents apart with a slow drift, through
// a gain that has its own slow LFO so voices breathe in and out of each other.
// All voices → one lowpass (opened by `brightness` and the breath) → dry +
// generated-impulse reverb → master with 2 s fades. Every change is a
// setTargetAtTime ramp, so nothing ever clicks.

const MAX_VOICES = 5
const GLIDE = 1.0 // time constant (s): ~95 % of a change lands in 3 s
export const DEFAULT_AUDIO = { root: 98, intervals: [0, 7, 12], brightness: 0.35, shimmer: 0.2, breathe: 0.5 }

function impulse(ctx, seconds) {
  const rate = ctx.sampleRate
  const len = Math.floor(seconds * rate)
  const buf = ctx.createBuffer(2, len, rate)
  let seed = 1234567
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296 - 0.5
  }
  const pre = Math.floor(0.012 * rate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    let y = 0
    for (let i = pre; i < len; i++) {
      const t = (i - pre) / (len - pre)
      // one-pole lowpass that closes over time: a dark, soft tail
      const a = 0.55 - 0.5 * t
      y += a * (rnd() - y)
      d[i] = y * Math.exp(-6.9 * t) * 1.6
    }
  }
  return buf
}

export class Drone {
  constructor() {
    this.ctx = null
    this.on = false
    this.params = { ...DEFAULT_AUDIO }
    this.bright = this.params.brightness
    this.breathe = this.params.breathe
    this.voices = []
    this._suspendTimer = 0
  }

  init() {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return false
    const ctx = new AC()
    this.ctx = ctx
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.Q.value = 0.5
    filter.frequency.value = 600
    const dry = ctx.createGain()
    dry.gain.value = 0.62
    const wet = ctx.createGain()
    wet.gain.value = 0.42
    const verb = ctx.createConvolver()
    verb.buffer = impulse(ctx, 4.2)
    filter.connect(dry).connect(master)
    filter.connect(verb).connect(wet).connect(master)
    this.master = master
    this.filter = filter

    for (let i = 0; i < MAX_VOICES; i++) {
      const out = ctx.createGain()
      out.gain.value = 0
      out.connect(filter)
      const a = ctx.createOscillator()
      a.type = 'sine'
      const b = ctx.createOscillator()
      b.type = 'triangle'
      const bGain = ctx.createGain()
      bGain.gain.value = 0.3
      a.detune.value = 4
      b.detune.value = -4
      a.connect(out)
      b.connect(bGain).connect(out)
      // slow pitch drift, opposite on the two oscillators (a gentle beating)
      const drift = ctx.createOscillator()
      drift.frequency.value = 0.023 + 0.011 * i
      const driftDepth = ctx.createGain()
      driftDepth.gain.value = 2
      const driftInv = ctx.createGain()
      driftInv.gain.value = -1
      drift.connect(driftDepth)
      driftDepth.connect(a.detune)
      driftDepth.connect(driftInv).connect(b.detune)
      // each voice's own breathing LFO (0.04–0.12 Hz)
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.04 + ((i * 0.37) % 1) * 0.08
      const lfoDepth = ctx.createGain()
      lfoDepth.gain.value = 0
      lfo.connect(lfoDepth).connect(out.gain)
      const t0 = ctx.currentTime + 0.02
      for (const o of [a, b, drift, lfo]) o.start(t0)
      this.voices.push({ out, a, b, driftDepth, lfoDepth })
    }
    this.apply(this.params, true)
    return true
  }

  // Glide to a spread's drone (or set it outright on first build).
  apply(p, instant = false) {
    this.params = { ...DEFAULT_AUDIO, ...(p || {}) }
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const ivs = (this.params.intervals || [0]).slice(0, MAX_VOICES)
    const shimmer = Math.min(1, Math.max(0, this.params.shimmer))
    const n = Math.max(1, ivs.length)
    this.voices.forEach((v, i) => {
      const on = i < ivs.length
      const f = this.params.root * Math.pow(2, (on ? ivs[i] : ivs[ivs.length - 1] || 0) / 12)
      const level = on ? (0.15 / Math.sqrt(n)) * (1 - 0.1 * i) : 0
      const set = (param, value) => {
        if (instant) param.setValueAtTime(value, now)
        else param.setTargetAtTime(value, now, GLIDE)
      }
      set(v.a.frequency, f)
      set(v.b.frequency, f)
      set(v.out.gain, level)
      set(v.lfoDepth.gain, level * (0.3 + 0.5 * shimmer))
      set(v.driftDepth.gain, 1.5 + 6 * shimmer)
    })
  }

  setSpread(p) {
    this.apply(p, false)
  }

  toggle() {
    if (!this.ctx && !this.init()) return false
    this.on = !this.on
    const ctx = this.ctx
    clearTimeout(this._suspendTimer)
    if (this.on) {
      ctx.resume()
      this.master.gain.cancelScheduledValues(ctx.currentTime)
      this.master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.55) // ≈ 2 s fade in
    } else {
      this.master.gain.cancelScheduledValues(ctx.currentTime)
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.5) // ≈ 2 s fade out
      this._suspendTimer = setTimeout(() => !this.on && ctx.suspend(), 3000)
    }
    return this.on
  }

  // Per frame: the filter follows brightness (gliding) and the breath.
  update(dt, breath) {
    if (!this.ctx || !this.on) return
    const k = 1 - Math.exp(-dt / GLIDE)
    this.bright += (this.params.brightness - this.bright) * k
    this.breathe += (this.params.breathe - this.breathe) * k
    const cutoff = 170 * Math.pow(2, this.bright * 4.3) * Math.pow(2, this.breathe * breath * 1.4)
    this.filter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.12)
  }
}
