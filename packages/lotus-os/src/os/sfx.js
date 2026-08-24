// sfx.js — a very small synth. No samples, no files, nothing to download.
//
// Off by default: an interface that makes noise before being asked is rude.
// The AudioContext is not even constructed until the first sound is played,
// which by then is always inside a click handler, so autoplay policy is happy.

const VOICES = {
  // interface
  open: { type: 'triangle', notes: [523.25, 783.99], dur: 0.16, gain: 0.055, sweep: 1 },
  close: { type: 'triangle', notes: [659.25, 392.0], dur: 0.14, gain: 0.045, sweep: -1 },
  fold: { type: 'sine', notes: [440, 220], dur: 0.12, gain: 0.04, sweep: -1 },
  blip: { type: 'triangle', notes: [880], dur: 0.07, gain: 0.035 },
  warn: { type: 'square', notes: [196, 196], dur: 0.1, gain: 0.03, repeat: 2 },
  key: { noise: true, dur: 0.028, gain: 0.02, filter: 2400 },
  // the room
  latch: { type: 'square', notes: [1200], dur: 0.035, gain: 0.025, filter: 3000 },
  servo: { noise: true, dur: 0.18, gain: 0.02, filter: 900, sweepFilter: 2 },
}

export function createSfx(getEnabled) {
  let ctx = null
  let bus = null
  const loops = new Map()

  function ensure() {
    if (!getEnabled()) return null
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
      bus = ctx.createGain()
      bus.gain.value = 0.9
      bus.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    return ctx
  }

  function noiseBuffer(seconds = 0.4) {
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  function play(name, opts = {}) {
    const v = VOICES[name]
    if (!v || !ensure()) return
    const t0 = ctx.currentTime + (opts.delay ?? 0)
    const gain = (opts.gain ?? v.gain) * (opts.scale ?? 1)
    const reps = v.repeat ?? 1

    for (let r = 0; r < reps; r++) {
      const at = t0 + r * (v.dur * 1.6)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, at)
      g.gain.exponentialRampToValueAtTime(gain, at + 0.006)
      g.gain.exponentialRampToValueAtTime(0.0001, at + v.dur)

      let node
      if (v.noise) {
        node = ctx.createBufferSource()
        node.buffer = noiseBuffer(Math.max(0.2, v.dur * 2))
        const filt = ctx.createBiquadFilter()
        filt.type = 'bandpass'
        filt.frequency.setValueAtTime(v.filter ?? 1200, at)
        if (v.sweepFilter) filt.frequency.exponentialRampToValueAtTime((v.filter ?? 1200) * v.sweepFilter, at + v.dur)
        filt.Q.value = 0.9
        node.connect(filt)
        filt.connect(g)
      } else {
        node = ctx.createOscillator()
        node.type = v.type ?? 'sine'
        node.frequency.setValueAtTime(v.notes[0], at)
        if (v.notes.length > 1) node.frequency.exponentialRampToValueAtTime(v.notes[1], at + v.dur * 0.9)
        node.connect(g)
      }
      g.connect(bus)
      node.start(at)
      node.stop(at + v.dur + 0.05)
    }
  }

  /**
   * The bowl. Inharmonic partials with slightly detuned pairs so it beats the
   * way struck bronze does. Used once, when the room opens.
   */
  function bowl({ base = 174.6, dur = 5.5, gain = 0.09 } = {}) {
    if (!ensure()) return
    const t0 = ctx.currentTime
    const partials = [
      [1, 1, 1],
      [2.72, 0.55, 1.0015],
      [5.38, 0.28, 0.9988],
      [8.94, 0.13, 1.002],
    ]
    for (const [ratio, amp, detune] of partials) {
      for (const d of [1, detune]) {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = base * ratio * d
        const peak = gain * amp * 0.5
        g.gain.setValueAtTime(0.0001, t0)
        g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012)
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * (0.45 + 0.55 / ratio))
        osc.connect(g)
        g.connect(bus)
        osc.start(t0)
        osc.stop(t0 + dur + 0.2)
      }
    }
  }

  /** A running motor: filtered sawtooth plus a little bearing noise. */
  function startLoop(id, { freq = 62, gain = 0.028, filter = 520, noise = 0.35 } = {}) {
    if (loops.has(id) || !ensure()) return
    const out = ctx.createGain()
    out.gain.setValueAtTime(0.0001, ctx.currentTime)
    out.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.35)
    out.connect(bus)

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = filter
    osc.connect(lp)
    lp.connect(out)
    osc.start()

    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer(1.2)
    src.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = filter * 3.4
    bp.Q.value = 1.4
    const ng = ctx.createGain()
    ng.gain.value = gain * noise
    src.connect(bp)
    bp.connect(ng)
    ng.connect(bus)
    src.start()

    loops.set(id, { out, osc, src, ng })
  }

  function stopLoop(id) {
    const l = loops.get(id)
    if (!l || !ctx) return
    const t = ctx.currentTime
    l.out.gain.cancelScheduledValues(t)
    l.out.gain.setValueAtTime(Math.max(0.0001, l.out.gain.value), t)
    l.out.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
    l.ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
    setTimeout(() => {
      try {
        l.osc.stop()
        l.src.stop()
      } catch {
        /* already stopped */
      }
    }, 400)
    loops.delete(id)
  }

  function stopAll() {
    for (const id of [...loops.keys()]) stopLoop(id)
  }

  return { play, bowl, startLoop, stopLoop, stopAll, get enabled() { return getEnabled() } }
}
