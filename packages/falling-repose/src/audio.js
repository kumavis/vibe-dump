// The score. Everything is synthesised — no samples, no files.
//
//   shepard  an endless Shepard–Risset glissando, falling, in an AudioWorklet.
//            "Modified": it catches on the current chord's tones and lingers
//            there before slipping on, so the fall is fast, then slow, then
//            fast. When time runs backwards it climbs.
//   pad      slow chords over a bass that walks down a step at a time and
//            starts again — a quasi-Shepard of its own, and an old, familiar one
//   air      noise breathed through resonators tuned to the chord: a choir
//            with no words
//   bells    a falling four-note figure, half-remembered — sometimes forwards,
//            sometimes swelling in reverse
//   wind     the rush of the fall, as loud as the fall is fast
//
// One clock drives all of it — the same one that moves the picture — so when
// time stops, the music's clock stops with it.

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
const CHORD_LEN = 12.5 // music-seconds
const LEVEL = 0.62

// The figure: F# E D A, the top of the descending line, and its relatives.
const MOTIFS = [
  [66, 64, 62, 57],
  [66, 64, 62],
  [62, 61, 59, 57],
  [69, 66, 64, 62],
  [66, 64],
]

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12)

function makeImpulse(ctx, seconds = 7.5) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const buf = ctx.createBuffer(2, len, sr)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    let lp = 0
    let seed = ch ? 91 : 17
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1
    const pre = Math.floor(sr * 0.028)
    for (let i = pre; i < len; i++) {
      const t = (i - pre) / sr
      // the tail darkens as it dies, like a big soft room under water
      const k = 0.55 - 0.5 * Math.min(1, t / seconds)
      lp += (rnd() - lp) * k
      d[i] = lp * Math.exp((-6.9 * t) / (seconds * 0.82)) * (t < 0.06 ? t / 0.06 : 1)
    }
    // a few early reflections
    for (const [ms, g] of [
      [11, 0.5],
      [23, 0.32],
      [37, 0.24],
      [53, 0.16],
    ]) {
      const i = Math.floor(sr * (ms + (ch ? 4 : 0)) * 0.001)
      if (i < len) d[i] += g * (ch ? -1 : 1)
    }
  }
  return buf
}

function noiseBuffer(ctx, seconds = 6) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const buf = ctx.createBuffer(2, len, sr)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    // pink-ish (Paul Kellet's economy filter)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046
      b1 = 0.963 * b1 + w * 0.2965164
      b2 = 0.57 * b2 + w * 1.0526913
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.12
    }
  }
  return buf
}

export class Score {
  constructor() {
    this.started = false
    this.muted = false
    this.ctx = null
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
    if (ctx.audioWorklet) {
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
    this.master.gain.setTargetAtTime(LEVEL, now + 0.05, 2.2)

    this.dry = g(1)
    this.dry.connect(this.master)
    this.verb = ctx.createConvolver()
    this.verb.buffer = makeImpulse(ctx)
    this.verbIn = g(1)
    const verbOut = g(0.75)
    this.verbIn.connect(this.verb).connect(verbOut).connect(this.master)

    // echoes for the bells: two taps that drift apart, darkening each time
    this.echoIn = g(1)
    const dl = ctx.createDelay(3), dr = ctx.createDelay(3)
    dl.delayTime.value = 0.61
    dr.delayTime.value = 0.89
    const fb = g(0.42), tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 2200
    const merge = ctx.createChannelMerger(2)
    this.echoIn.connect(dl)
    dl.connect(dr)
    dr.connect(tone).connect(fb).connect(dl)
    dl.connect(merge, 0, 0)
    dr.connect(merge, 0, 1)
    const echoOut = g(0.5)
    merge.connect(echoOut)
    echoOut.connect(this.dry)
    echoOut.connect(this.verbIn)

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

    // shepard
    this.shepGain = g(0)
    const shepTone = ctx.createBiquadFilter()
    shepTone.type = 'lowpass'
    shepTone.frequency.value = 2600
    shepTone.Q.value = 0.4
    if (this.hasShepard) {
      this.shep = new AudioWorkletNode(ctx, 'shepard', { numberOfInputs: 0, outputChannelCount: [2] })
      this.shep.connect(shepTone)
    }
    shepTone.connect(this.shepGain)
    const shepDry = g(0.35)
    this.shepGain.connect(shepDry).connect(this.dry)
    this.shepGain.connect(this.verbIn)

    // pad
    const harm = [0, 1, 0.45, 0.24, 0.14, 0.085, 0.05, 0.03, 0.018, 0.01, 0.006]
    this.wave = ctx.createPeriodicWave(new Float32Array(harm.length), new Float32Array(harm))
    this.padFilter = ctx.createBiquadFilter()
    this.padFilter.type = 'lowpass'
    this.padFilter.frequency.value = 900
    this.padFilter.Q.value = 0.5
    this.padBus = g(0.11)
    this.padFilter.connect(this.padBus)
    this.padBus.connect(this.dry)
    const padSend = g(0.9)
    this.padBus.connect(padSend).connect(this.verbIn)
    this.voices = []

    // sub
    // the walking bass: an octave up where small speakers can carry it, and
    // its true pitch underneath for anyone who can feel it. Both only ever
    // step down, until the cadence lifts them home.
    this.subGain = g(0)
    this.subGain.connect(this.dry)
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
    const noise = noiseBuffer(ctx)
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
      const lvl = g(1.6)
      this.airSrc.connect(bp).connect(lvl).connect(this.airBus)
      this.air.push(bp)
    }
    this.airBus.connect(this.verbIn)
    const airDry = g(0.25)
    this.airBus.connect(airDry).connect(this.dry)
    this.airSrc.start(now)

    // wind
    this.windSrc = ctx.createBufferSource()
    this.windSrc.buffer = noise
    this.windSrc.loop = true
    this.windSrc.playbackRate.value = 0.7
    this.windBand = ctx.createBiquadFilter()
    this.windBand.type = 'bandpass'
    this.windBand.Q.value = 0.7
    this.windBand.frequency.value = 400
    const windLow = ctx.createBiquadFilter()
    windLow.type = 'lowpass'
    windLow.frequency.value = 1400
    this.windGain = g(0)
    this.windPan = ctx.createStereoPanner()
    this.windSrc.connect(this.windBand).connect(windLow).connect(this.windGain).connect(this.windPan)
    this.windPan.connect(this.dry)
    const windSend = g(0.3)
    this.windPan.connect(windSend).connect(this.verbIn)
    this.windSrc.start(now)

    // bells
    this.bellBus = g(0.16)
    this.bellBus.connect(this.dry)
    const bellSend = g(0.8)
    this.bellBus.connect(bellSend).connect(this.verbIn)
    const bellEcho = g(0.55)
    this.bellBus.connect(bellEcho).connect(this.echoIn)

    // state
    this.lastNow = now
    this.mtime = 0
    this.chordIndex = -1
    this.nextChord = 0
    this.nextMotif = 9
    this.motifCount = 0
    this.inSusp = false
    this.lastWall = null
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
    // let the last chord go slowly
    for (const v of this.voices) {
      v.env.gain.cancelScheduledValues(at)
      v.env.gain.setTargetAtTime(0, at, 2.4)
      for (const o of v.osc) o.stop(at + 14)
    }
    this.voices = []
    C.notes.forEach((m, k) => {
      const env = ctx.createGain()
      env.gain.value = 0
      const level = (0.32 / Math.sqrt(C.notes.length)) * (1 - k * 0.09)
      env.gain.setValueAtTime(0, at)
      env.gain.setTargetAtTime(level, at, 1.6)
      env.connect(this.padFilter)
      const osc = [-1, 1].map((side) => {
        const o = ctx.createOscillator()
        o.setPeriodicWave(this.wave)
        o.frequency.value = mtof(m)
        // wider chorus up high, tighter down low where beating turns to wobble
        o.detune.value = side * (m < 48 ? 2.5 : 5 + Math.random() * 3)
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

  bell(at, midi, vel, reversed) {
    const ctx = this.ctx
    const f = mtof(midi)
    const partials = [
      [1, 1, 3.8],
      [2, 0.32, 2.2],
      [3, 0.1, 1.2],
      [4.16, 0.05, 0.7],
      [5.43, 0.025, 0.45],
    ]
    for (const [ratio, amp, decay] of partials) {
      const o = ctx.createOscillator()
      o.frequency.value = f * ratio
      this.tapeBus.connect(o.detune)
      const e = ctx.createGain()
      e.gain.value = 0
      const peak = vel * amp
      if (reversed) {
        // swells out of nothing and is cut off, leaving only its echo
        const dur = Math.min(2.6, decay * 0.75 + 0.6)
        e.gain.setValueAtTime(0.00001, at)
        e.gain.exponentialRampToValueAtTime(peak, at + dur)
        e.gain.linearRampToValueAtTime(0, at + dur + 0.05)
        o.start(at)
        o.stop(at + dur + 0.1)
      } else {
        e.gain.setValueAtTime(0, at)
        e.gain.linearRampToValueAtTime(peak, at + 0.008)
        e.gain.setTargetAtTime(0, at + 0.008, decay / 4)
        o.start(at)
        o.stop(at + decay * 1.6 + 0.2)
      }
      o.connect(e).connect(this.bellBus)
      this.unhookOnEnd(o)
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

  motif(at, spacing, reversed, which) {
    const notes = MOTIFS[which % MOTIFS.length]
    let t = at
    notes.forEach((m, i) => {
      const vel = 0.75 - i * 0.08 + Math.random() * 0.1
      this.bell(t, m, vel, reversed)
      if (Math.random() < 0.35) this.bell(t + 0.004, m - 12, vel * 0.4, reversed)
      t += spacing * (0.85 + Math.random() * 0.3) * (i === notes.length - 2 ? 1.5 : 1)
    })
  }

  // Called every frame with the shared clock.
  update(clock) {
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

    // music's own clock crawls when time does, but never runs backwards
    this.mtime += dt * Math.max(0.05, Math.min(1.8, Math.abs(rate)))
    if (this.mtime >= this.nextChord) {
      this.chordIndex++
      this.chord(this.chordIndex, at)
      this.nextChord += CHORD_LEN
    }

    // the glide: an octave a minute, faster in a rush, climbing when time reverses
    const shep = this.shep?.parameters
    if (shep) {
      set(shep.get('rate'), -0.022 * rate * (1 + 0.6 * clock.rush), 0.4)
      set(shep.get('fifth'), 0.25 + 0.5 * clock.susp, 1)
      set(shep.get('center'), 8.1 + 0.4 * Math.sin(T / 41) + 0.3 * clock.rush, 2)
    }
    // it drifts in and out of the texture on its own long tide
    const tide = 0.5 + 0.5 * Math.sin((T / 97) * Math.PI * 2 - 1.2)
    const shepLevel = 0.05 + 0.85 * tide * tide + 0.4 * clock.rush + 0.35 * clock.susp
    set(this.shepGain.gain, Math.min(1, shepLevel) * 0.55, 1.5)

    // the pad opens with the light
    const swell = clock.swell
    const cutoff = (650 + 700 * (0.5 + 0.5 * Math.sin(T / 23)) + 1300 * swell + 900 * clock.rush) * (1 - 0.45 * clock.hold)
    set(this.padFilter.frequency, cutoff, 0.8)
    set(this.subGain.gain, 0.15 + 0.06 * swell, 1)
    set(this.airBus.gain, 0.05 + 0.12 * swell + 0.03 * Math.max(0, Math.sin(T / 31)), 1.5)

    // tape: hold sags the pitch and deepens the wobble
    set(this.tape.offset, -38 * clock.hold - 8 * clock.susp, 0.6)
    set(this.wowDepth.gain, 3 + 14 * clock.hold + 6 * clock.susp, 0.6)
    set(this.wow.frequency, 0.12 + 0.25 * Math.max(0, Math.min(1.5, rate)), 0.6)

    // wind is speed made audible
    const v = Math.max(0, rate)
    set(this.windGain.gain, 0.035 * Math.pow(v, 1.6) + 0.06 * clock.rush, 0.5)
    set(this.windBand.frequency, 220 + 420 * Math.min(2, v) + 600 * clock.rush, 0.5)
    set(this.windPan.pan, 0.5 * Math.sin(T / 7.3), 0.5)

    // bells: the figure returns every so often, unhurried
    if (this.mtime >= this.nextMotif && clock.susp < 0.05) {
      const spacing = 0.95 / Math.max(0.35, Math.min(1.6, rate))
      this.motif(at, spacing, Math.random() < 0.2, this.motifCount++)
      this.nextMotif = this.mtime + 16 + Math.random() * 22
    } else if (Math.random() < dt / 9 && clock.susp < 0.05) {
      // a stray note from the current chord, high and quiet
      const C = CHORDS[Math.max(0, this.chordIndex) % CHORDS.length]
      const m = C.notes[Math.floor(Math.random() * C.notes.length)] + 24
      this.bell(at, m, 0.18 + Math.random() * 0.15, Math.random() < 0.3)
    }
    // in a suspension: the whole figure, slowly, backwards
    if (clock.susp > 0.6 && !this.inSusp) {
      this.inSusp = true
      this.motif(at + 0.5, 2.4, true, 0)
    } else if (clock.susp < 0.1) this.inSusp = false
  }
}
