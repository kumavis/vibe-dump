// The audio engine: builds the graph, schedules notes, renders exports.
//
// Live playback and WAV export run through the *same* graph builder, which is
// the only reason an exported file sounds like what you heard. The difference
// is how notes reach the voices: live, they are posted a couple of seconds
// ahead; offline, the entire score is handed over at construction, because an
// OfflineAudioContext drains faster than messages can be delivered and posting
// to its port is a race you lose.

import dspSource from './flute-dsp.js?raw'
import workletSource from './flute-worklet.js?raw'
import { makeRng } from './rng.js'

// The worklet module is assembled at runtime from the same two files the app
// imports normally, with the module keywords stripped: a worklet has no module
// resolution, so it needs one self-contained script. Shipping it as a Blob
// rather than as an emitted asset means there is no URL to resolve and no
// chance of a 404 under a Pages sub-path.
let workletBlobUrl = null
function getWorkletUrl() {
  if (!workletBlobUrl) {
    const src = dspSource.replace(/^export\s+/gm, '') + '\n' + workletSource.replace(/^export\s+/gm, '')
    workletBlobUrl = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))
  }
  return workletBlobUrl
}

/**
 * A room, as an impulse response.
 *
 * Built from seeded noise so the live sound and the exported file get exactly
 * the same room, and shaped so early reflections arrive before the tail — a
 * plain decaying-noise burst sounds like a cheap plate.
 */
function makeImpulse(ctx, seconds, seed = 12345) {
  const rate = ctx.sampleRate
  const len = Math.max(1, Math.floor(seconds * rate))
  const buf = ctx.createBuffer(2, len, rate)
  const rng = makeRng(seed)
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch)
    let lp = 0
    for (let i = 0; i < len; i++) {
      const t = i / len
      // Lowpassed noise: a real room loses its highs faster than its lows.
      const n = rng() * 2 - 1
      lp += 0.34 * (n - lp)
      const decay = Math.pow(1 - t, 2.6)
      // A short build at the very start reads as distance rather than as a
      // click sitting on top of the note.
      const onset = Math.min(1, i / (0.012 * rate))
      data[i] = lp * decay * onset
    }
  }
  return buf
}

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)

/** Reverb length in seconds, from the Space knob. */
export const spaceSeconds = (space) => 0.35 + 4.4 * Math.pow(clamp(space, 0, 1), 1.6)

/**
 * Assemble the graph. Returns the node the caller should feed and the node it
 * should read from; used identically online and offline.
 */
function buildGraph(ctx, { space = 0.55, gain = 0.9, seed = 12345, analyser = false } = {}) {
  const input = ctx.createGain()
  // The waveguide's natural output sits around -25 dBFS: the cubic saturates
  // at a low amplitude and that is what keeps it stable, so the level has to
  // be made up here rather than by pushing the model harder. Set for the
  // common case of one or two notes sounding; the limiter picks up the rare
  // moments when four breaths overlap.
  input.gain.value = 18

  const dry = ctx.createGain()
  const wet = ctx.createGain()
  const wetMix = 0.05 + 0.38 * clamp(space, 0, 1)
  dry.gain.value = 1 - 0.45 * wetMix
  wet.gain.value = wetMix

  const convolver = ctx.createConvolver()
  convolver.normalize = true
  convolver.buffer = makeImpulse(ctx, spaceSeconds(space), seed)

  // A gentle shelf: the model radiates a little more edge than a flute in a
  // room does, and this is cheaper than tuning the radiation filter per note.
  const tilt = ctx.createBiquadFilter()
  tilt.type = 'highshelf'
  tilt.frequency.value = 4200
  tilt.gain.value = -4

  const master = ctx.createGain()
  master.gain.value = gain

  // Not for loudness — just a backstop so a stack of overlapping breaths in a
  // big room can never clip the export.
  const limiter = ctx.createDynamicsCompressor()
  // Sits above a single note (which peaks near -11 dBFS) and only engages
  // when several breaths overlap, so ordinary playing is untouched and a
  // four-voice stack still cannot clip the export.
  limiter.threshold.value = -6
  limiter.knee.value = 3
  limiter.ratio.value = 12
  limiter.attack.value = 0.003
  limiter.release.value = 0.2

  input.connect(tilt)
  tilt.connect(dry)
  tilt.connect(convolver)
  convolver.connect(wet)
  dry.connect(master)
  wet.connect(master)
  master.connect(limiter)

  let tap = null
  if (analyser) {
    tap = ctx.createAnalyser()
    tap.fftSize = 2048
    tap.smoothingTimeConstant = 0.75
    limiter.connect(tap)
  }
  limiter.connect(ctx.destination)

  return { input, master, dry, wet, convolver, analyser: tap }
}

/** Turn score events (seconds) into worklet events (frames). */
function toFrames(events, sampleRate, offsetSeconds = 0, idBase = 0) {
  return events.map((n, i) => ({
    id: idBase + i,
    on: Math.round((offsetSeconds + n.t) * sampleRate),
    off: Math.round((offsetSeconds + n.t + n.d) * sampleRate),
    midi: n.midi,
    velocity: n.vel,
    slur: !!n.slur,
    bendCents: n.bendCents || 0,
    bendTime: n.portamento || 0.12,
    flutter: n.flutter || 0,
    seed: (0x9e3779b9 ^ Math.imul(idBase + i + 1, 2654435761)) >>> 0,
  }))
}

export class FluteEngine {
  constructor() {
    this.ctx = null
    this.node = null
    this.graph = null
    this.ready = false
    this.usingWorklet = false
    this.nextId = 0
    this.tone = { breathiness: 0.4, vibrato: 0.5, brightness: 0.5 }
    this.space = 0.55
    this.seed = 12345
  }

  async init({ space = 0.55, gain = 0.9, seed = 12345 } = {}) {
    if (this.ready) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    this.ctx = new Ctx({ latencyHint: 'playback' })
    this.space = space
    this.seed = seed
    this.graph = buildGraph(this.ctx, { space, gain, seed, analyser: true })

    try {
      await this.ctx.audioWorklet.addModule(getWorkletUrl())
      this.node = new AudioWorkletNode(this.ctx, 'flute-voice', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions: { polyphony: 4, tone: this.tone },
      })
      this.node.connect(this.graph.input)
      this.usingWorklet = true
    } catch (err) {
      // Some environments refuse blob: worklet modules. Rather than fail, drop
      // to a voice built from ordinary Web Audio nodes — less characterful,
      // but it plays.
      console.warn('AudioWorklet unavailable, using the node-graph voice:', err)
      this.fallback = new NodeVoiceBank(this.ctx, this.graph.input)
      this.usingWorklet = false
    }
    this.ready = true
  }

  get analyser() {
    return this.graph?.analyser ?? null
  }

  get currentTime() {
    return this.ctx ? this.ctx.currentTime : 0
  }

  async resume() {
    if (this.ctx && this.ctx.state !== 'running') await this.ctx.resume()
  }

  async suspend() {
    if (this.ctx && this.ctx.state === 'running') await this.ctx.suspend()
  }

  setTone(tone) {
    this.tone = { ...this.tone, ...tone }
    if (this.node) this.node.port.postMessage({ type: 'tone', tone: this.tone })
    if (this.fallback) this.fallback.tone = this.tone
  }

  setSpace(space) {
    if (!this.graph || Math.abs(space - this.space) < 0.01) return
    this.space = space
    this.graph.convolver.buffer = makeImpulse(this.ctx, spaceSeconds(space), this.seed)
    const wetMix = 0.05 + 0.38 * clamp(space, 0, 1)
    this.graph.wet.gain.value = wetMix
    this.graph.dry.gain.value = 1 - 0.45 * wetMix
  }

  setGain(g) {
    if (this.graph) this.graph.master.gain.value = g
  }

  /** Schedule notes whose `t` is relative to `atSeconds` on the context clock. */
  schedule(notes, atSeconds) {
    if (!notes.length) return
    const id = this.nextId
    this.nextId += notes.length
    if (this.usingWorklet) {
      const events = toFrames(notes, this.ctx.sampleRate, atSeconds, id)
      this.node.port.postMessage({ type: 'schedule', events })
    } else {
      this.fallback.schedule(notes, atSeconds)
    }
  }

  /** Forget scheduled notes that have not begun yet. */
  cancelAfter(atSeconds) {
    if (this.usingWorklet && this.node) {
      this.node.port.postMessage({ type: 'cancelAfter', frame: Math.round(atSeconds * this.ctx.sampleRate) })
    }
    if (this.fallback) this.fallback.cancelAfter(atSeconds)
  }

  panic() {
    if (this.usingWorklet && this.node) this.node.port.postMessage({ type: 'panic' })
    if (this.fallback) this.fallback.panic()
  }

  /**
   * Render a complete score to an AudioBuffer, faster than real time.
   *
   * The whole score goes in via processorOptions rather than the port: an
   * offline context renders as fast as it can and would outrun the messages.
   */
  static async renderOffline(score, { space = 0.55, tone = {}, seed = 12345, tail = null, sampleRate = 48000 } = {}) {
    const last = score.reduce((m, n) => Math.max(m, n.t + n.d), 0)
    const tailSeconds = tail ?? spaceSeconds(space) + 0.6
    const duration = Math.max(0.5, last + tailSeconds)
    const frames = Math.ceil(duration * sampleRate)

    const ctx = new OfflineAudioContext(2, frames, sampleRate)
    const graph = buildGraph(ctx, { space, gain: 0.9, seed })

    await ctx.audioWorklet.addModule(getWorkletUrl())
    const node = new AudioWorkletNode(ctx, 'flute-voice', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      processorOptions: {
        polyphony: 4,
        tone,
        score: toFrames(score, sampleRate, 0, 0),
      },
    })
    node.connect(graph.input)

    return ctx.startRendering()
  }
}

// ---------------------------------------------------------------------------
// The fallback voice.
//
// Only used when the AudioWorklet module cannot be loaded. It is a plain
// subtractive flute: a harmonic stack through a lowpass that tracks breath
// pressure, plus band-passed noise for air. It does not model anything, but it
// is recognisably the same instrument and it works everywhere.
// ---------------------------------------------------------------------------

class NodeVoiceBank {
  constructor(ctx, destination) {
    this.ctx = ctx
    this.dest = destination
    this.tone = { breathiness: 0.4, vibrato: 0.5 }
    this.active = []

    // One noise buffer, shared and looped by every voice.
    const len = Math.floor(ctx.sampleRate * 2)
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    const rng = makeRng(4242)
    for (let i = 0; i < len; i++) d[i] = rng() * 2 - 1

    // A flute's harmonic stack: strong fundamental, everything else well down.
    const real = new Float32Array([0, 1, 0.18, 0.08, 0.03, 0.015, 0.008])
    const imag = new Float32Array(real.length)
    this.wave = ctx.createPeriodicWave(real, imag, { disableNormalization: false })
  }

  schedule(notes, at) {
    for (const n of notes) this.play(n, at + n.t)
  }

  play(n, when) {
    const ctx = this.ctx
    const t0 = Math.max(when, ctx.currentTime + 0.005)
    const dur = Math.max(0.05, n.d)
    const hz = 440 * Math.pow(2, (n.midi - 69) / 12)
    const breath = this.tone.breathiness ?? 0.4
    const vib = this.tone.vibrato ?? 0.5

    const osc = ctx.createOscillator()
    osc.setPeriodicWave(this.wave)
    osc.frequency.value = hz
    if (n.bendCents) {
      osc.frequency.setValueAtTime(hz * Math.pow(2, n.bendCents / 1200), t0)
      osc.frequency.exponentialRampToValueAtTime(hz, t0 + Math.max(0.03, n.portamento || 0.12))
    }

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.Q.value = 0.6
    const bright = clamp(hz * (3 + 4 * n.vel), 700, 9000)
    lp.frequency.setValueAtTime(bright * 0.55, t0)
    lp.frequency.linearRampToValueAtTime(bright, t0 + 0.08)

    const air = ctx.createBufferSource()
    air.buffer = this.noise
    air.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = clamp(hz * 2.2, 400, 7000)
    bp.Q.value = 0.8
    const airGain = ctx.createGain()

    const g = ctx.createGain()
    const peak = 0.22 * (0.35 + 0.65 * n.vel)
    const attack = clamp(0.06 - 0.00045 * (n.midi - 48), 0.008, 0.09)
    const release = clamp(0.22 - 0.0016 * (n.midi - 48), 0.05, 0.3)

    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(peak * 1.1, t0 + attack)
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack + 0.09)
    g.gain.setValueAtTime(peak, Math.max(t0 + attack + 0.09, t0 + dur))
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release)

    // Chiff: a burst of air at the start, then a steady breathy floor.
    const chiff = 0.5 * (0.4 + breath)
    airGain.gain.setValueAtTime(0.0001, t0)
    airGain.gain.exponentialRampToValueAtTime(chiff * peak, t0 + 0.012)
    airGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.35 * breath * peak), t0 + 0.14)
    airGain.gain.setValueAtTime(Math.max(0.0002, 0.35 * breath * peak), Math.max(t0 + 0.15, t0 + dur))
    airGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release)

    // Vibrato, swelling in the way a player's does.
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 5.2
    const lfoGain = ctx.createGain()
    lfoGain.gain.setValueAtTime(0, t0)
    lfoGain.gain.linearRampToValueAtTime(hz * 0.006 * vib * 2, t0 + Math.min(dur, 0.6))
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)

    osc.connect(lp)
    lp.connect(g)
    air.connect(bp)
    bp.connect(airGain)
    airGain.connect(g)
    g.connect(this.dest)

    const stop = t0 + dur + release + 0.05
    osc.start(t0)
    osc.stop(stop)
    lfo.start(t0)
    lfo.stop(stop)
    air.start(t0)
    air.stop(stop)

    const rec = { osc, lfo, air, g, stop, t0 }
    this.active.push(rec)
    osc.onended = () => {
      const i = this.active.indexOf(rec)
      if (i >= 0) this.active.splice(i, 1)
      try {
        g.disconnect()
      } catch {}
    }
  }

  cancelAfter(atSeconds) {
    for (const r of this.active.slice()) {
      if (r.t0 <= atSeconds) continue
      try {
        r.osc.stop(atSeconds)
        r.lfo.stop(atSeconds)
        r.air.stop(atSeconds)
      } catch {}
    }
  }

  panic() {
    const now = this.ctx.currentTime
    for (const r of this.active) {
      try {
        r.g.gain.cancelScheduledValues(now)
        r.g.gain.setTargetAtTime(0.0001, now, 0.05)
        r.osc.stop(now + 0.4)
        r.lfo.stop(now + 0.4)
        r.air.stop(now + 0.4)
      } catch {}
    }
  }
}
