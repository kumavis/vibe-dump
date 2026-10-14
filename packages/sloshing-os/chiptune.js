// chiptune.js — a tiny keygen-style tracker: pulse-wave lead with echo,
// 12.5% arps, galloping bass, synth drums. Every note it plays is also an
// event the HydroAmp turns into a jet in its liquid, so the goo dances to the
// actual song. Until someone presses play it runs silently in "demo" mode
// (no AudioContext before a gesture), so the liquid still grooves.

const BPM = 138
const STEP = 60 / BPM / 4

const CHORDS = [
  [57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62], // Am F C G
]
const BASS = [45, 41, 48, 43]
const _ = -1
const LEAD = [
  [76, _, 76, _, 74, 72, _, 69, _, _, 72, _, 74, _, 76, _],
  [77, _, 76, _, 72, _, 69, _, 72, _, _, _, 69, _, 65, _],
  [67, _, 72, _, 76, _, 79, _, 77, _, 76, _, 72, _, 74, _],
  [74, _, _, _, 71, _, 74, _, 79, _, 77, _, 76, _, 74, _],
  [81, 79, 76, 79, 81, _, 84, _, 83, 81, 79, 76, 79, _, 81, _],
  [84, _, 81, _, 77, _, 81, _, 84, _, 86, 84, 81, _, 77, _],
  [79, _, 84, _, 88, _, 86, 84, 83, _, 84, _, 79, _, 76, _],
  [79, _, 83, _, 86, _, 83, _, 79, _, 74, _, 71, _, 74, _],
]
const KICK = [0, 6, 8]
const KICK_B = [0, 3, 6, 8, 11]
const SNARE = [4, 12]

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12)

export class Chip {
  constructor() {
    this.mode = 'demo' // demo (silent, visuals only) | play | pause
    this.ac = null
    this.step = 0
    this.next = 0
    this.pending = []
    this.listeners = []
    this.volume = 0.7
    this.started = performance.now() / 1000
    this.elapsed = 0
  }

  on(fn) { this.listeners.push(fn) }

  now() { return this.ac && this.mode === 'play' ? this.ac.currentTime : performance.now() / 1000 }

  setVolume(v) {
    this.volume = v
    if (this.master) this.master.gain.setTargetAtTime(v * 0.42, this.ac.currentTime, 0.02)
  }

  toggle() {
    if (this.mode === 'play') { this.mode = 'pause'; this.ac?.suspend(); return this.mode }
    if (!this.ac) this.initAudio()
    this.ac.resume()
    if (this.ac.state !== 'running') {
      // a touch pointerdown isn't user activation: start the context on the
      // release instead (unless pause was pressed in between)
      const kick = () => { if (this.mode === 'play') this.ac.resume() }
      for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) addEventListener(ev, kick, { once: true, capture: true })
    }
    this.mode = 'play'
    this.next = this.ac.currentTime + 0.06
    this.pending.length = 0
    return this.mode
  }

  skip(d) {
    this.step = ((Math.floor(this.step / 64) + d + 2) % 2) * 64
  }

  initAudio() {
    const ac = (this.ac = new (window.AudioContext || window.webkitAudioContext)())
    const comp = ac.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 4
    comp.connect(ac.destination)
    this.master = ac.createGain()
    this.master.gain.value = this.volume * 0.42
    this.master.connect(comp)
    // echo for the lead
    this.echo = ac.createDelay(1)
    this.echo.delayTime.value = STEP * 3
    const fb = ac.createGain()
    fb.gain.value = 0.32
    const lp = ac.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 2600
    this.echo.connect(lp)
    lp.connect(fb)
    fb.connect(this.echo)
    const wet = ac.createGain()
    wet.gain.value = 0.35
    lp.connect(wet)
    wet.connect(this.master)
    this.pulse = (duty) => {
      const N = 32, re = new Float32Array(N), im = new Float32Array(N)
      for (let n = 1; n < N; n++) re[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty)
      return ac.createPeriodicWave(re, im)
    }
    this.p25 = this.pulse(0.25)
    this.p12 = this.pulse(0.125)
    const len = ac.sampleRate * 0.5
    this.noise = ac.createBuffer(1, len, ac.sampleRate)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  }

  // ---- voices ----
  tone(t, freq, dur, { wave, type = 'square', vol = 0.2, echo = false, vib = 0, cutoff = 0 }) {
    const ac = this.ac
    const o = ac.createOscillator()
    if (wave) o.setPeriodicWave(wave)
    else o.type = type
    o.frequency.value = freq
    if (vib) {
      const l = ac.createOscillator()
      const lg = ac.createGain()
      l.frequency.value = 6
      lg.gain.value = vib
      l.connect(lg)
      lg.connect(o.detune)
      l.start(t + 0.08)
      l.stop(t + dur + 0.1)
    }
    const g = ac.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.004)
    g.gain.exponentialRampToValueAtTime(vol * 0.55, t + Math.min(dur, 0.12))
    g.gain.setValueAtTime(vol * 0.55, t + dur * 0.9)
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur + 0.04)
    let node = o
    if (cutoff) {
      const f = ac.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.setValueAtTime(cutoff * 3, t)
      f.frequency.exponentialRampToValueAtTime(cutoff, t + 0.08)
      o.connect(f)
      node = f
    }
    node.connect(g)
    g.connect(this.master)
    if (echo) g.connect(this.echo)
    o.start(t)
    o.stop(t + dur + 0.06)
  }

  kick(t) {
    const ac = this.ac
    const o = ac.createOscillator()
    o.frequency.setValueAtTime(170, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.9, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.32)
  }

  hiss(t, dur, vol, type, freq) {
    const ac = this.ac
    const s = ac.createBufferSource()
    s.buffer = this.noise
    const f = ac.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    const g = ac.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    s.connect(f)
    f.connect(g)
    g.connect(this.master)
    s.start(t, Math.random() * 0.3)
    s.stop(t + dur + 0.02)
  }

  // ---- sequencer ----
  schedule(t, step) {
    const bar = Math.floor(step / 16) % 8
    const s = step % 16
    const chord = CHORDS[bar % 4]
    const B = bar >= 4
    const ev = []
    const audible = this.mode === 'play' && this.ac

    const lead = LEAD[bar][s]
    if (lead > 0) {
      let len = 1
      while (s + len < 16 && LEAD[bar][s + len] === _) len++
      ev.push({ type: 'lead', note: lead, vel: 0.8 })
      if (audible) this.tone(t, hz(lead), len * STEP * 0.95, { wave: this.p25, vol: 0.16, echo: true, vib: len > 2 ? 14 : 0 })
    }
    const arpNote = chord[s % 3] + 12 + (s % 6 === 5 ? 12 : 0)
    ev.push({ type: 'arp', note: arpNote, vel: 0.3 })
    if (audible) this.tone(t, hz(arpNote), STEP * 0.6, { wave: this.p12, vol: 0.05 })
    if (s % 2 === 0) {
      const bn = BASS[bar % 4] + (s % 4 === 2 ? 12 : 0)
      ev.push({ type: 'bass', note: bn, vel: 0.6 })
      if (audible) this.tone(t, hz(bn), STEP * 1.6, { type: 'sawtooth', vol: 0.2, cutoff: 500 })
    }
    if ((B ? KICK_B : KICK).includes(s)) {
      ev.push({ type: 'kick', vel: 1 })
      if (audible) this.kick(t)
    }
    if (SNARE.includes(s)) {
      ev.push({ type: 'snare', vel: 1 })
      if (audible) { this.hiss(t, 0.16, 0.5, 'bandpass', 1900); this.tone(t, 190, 0.06, { type: 'triangle', vol: 0.25 }) }
    }
    if (s % 2 === 1 || (B && s % 4 === 2)) {
      ev.push({ type: 'hat', vel: 0.4 })
      if (audible) this.hiss(t, 0.045, 0.18, 'highpass', 7500)
    }
    for (const e of ev) this.pending.push([t, e])
  }

  // Call every frame: schedules ahead and fires the visual events that are due.
  tick() {
    if (this.mode === 'pause') return
    const now = this.now()
    if (this.next < now - 0.5) this.next = now // tab was asleep
    while (this.next < now + 0.12) {
      this.schedule(this.next, this.step)
      this.step = (this.step + 1) % 128
      this.next += STEP
      this.elapsed += STEP
    }
    for (let i = 0; i < this.pending.length; i++) {
      const [t, e] = this.pending[i]
      if (t <= now) {
        for (const fn of this.listeners) fn(e)
        this.pending.splice(i--, 1)
      }
    }
  }
}
