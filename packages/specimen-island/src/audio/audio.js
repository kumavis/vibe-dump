// Procedural sound: every gunshot, footstep, roar and cricket is synthesised
// with Web Audio at runtime — no samples. Positional sounds get distance
// attenuation, stereo pan and distance muffling from the listener's pose.

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

export class Audio {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.volume = 0.8
    this.listener = { x: 0, y: 0, z: 0, yaw: 0 }
    this.loops = []
    this.birdT = 2
    this.roarT = 30
    this.heartT = 0
    this.frogT = 3
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = (this.ctx = new AC())
    this.master = ctx.createGain()
    this.master.gain.value = this.volume
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 4
    this.master.connect(comp).connect(ctx.destination)
    // a shared second of white noise
    const len = ctx.sampleRate * 2
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    // echo bus for gunshots and roars
    this.echo = ctx.createDelay(1)
    this.echo.delayTime.value = 0.32
    const fb = ctx.createGain()
    fb.gain.value = 0.32
    const ef = ctx.createBiquadFilter()
    ef.type = 'lowpass'
    ef.frequency.value = 1400
    this.echo.connect(ef).connect(fb).connect(this.echo)
    ef.connect(this.master)
    this.startAmbience()
  }

  setVolume(v) {
    this.volume = v
    if (this.master) this.master.gain.value = v
  }

  setListener(pos, yaw) {
    this.listener.x = pos.x
    this.listener.y = pos.y
    this.listener.z = pos.z
    this.listener.yaw = yaw
  }

  // Gain/pan/muffle for a world position.
  spatial(pos, maxDist) {
    if (!pos) return { gain: 1, pan: 0, cutoff: 20000 }
    const L = this.listener
    const dx = pos.x - L.x
    const dz = pos.z - L.z
    const dy = (pos.y ?? L.y) - L.y
    const d = Math.hypot(dx, dy, dz)
    const g = Math.pow(clamp(1 - d / maxDist, 0, 1), 1.7)
    // right vector of a camera with this yaw
    const rx = Math.cos(L.yaw)
    const rz = -Math.sin(L.yaw)
    const pan = d > 0.5 ? clamp((dx * rx + dz * rz) / d, -1, 1) * 0.85 : 0
    return { gain: g, pan, cutoff: clamp(18000 - d * 40, 600, 18000) }
  }

  // Route a source node to the master through gain/pan/filter.
  out(node, pos, maxDist, volume, echo = 0) {
    const ctx = this.ctx
    const s = this.spatial(pos, maxDist)
    if (s.gain * volume < 0.002) return null
    const g = ctx.createGain()
    g.gain.value = s.gain * volume
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = s.cutoff
    const p = ctx.createStereoPanner()
    p.pan.value = s.pan
    node.connect(f).connect(g).connect(p).connect(this.master)
    if (echo) {
      const e = ctx.createGain()
      e.gain.value = echo * s.gain * volume
      p.connect(e).connect(this.echo)
    }
    return g
  }

  burst({ dur = 0.1, type = 'bandpass', freq = 1000, q = 1, vol = 0.5, attack = 0.002, pos, max = 60, echo = 0, sweep = 0, delay = 0 }) {
    const ctx = this.ctx
    const t = ctx.currentTime + delay
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.playbackRate.value = 0.8 + Math.random() * 0.4
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.setValueAtTime(freq, t)
    if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, freq * sweep), t + dur)
    f.Q.value = q
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(1, t + attack)
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f).connect(env)
    if (!this.out(env, pos, max, vol, echo)) return
    src.start(t, Math.random() * 1.5)
    src.stop(t + dur + 0.05)
  }

  tone({ type = 'sine', f0 = 440, f1 = f0, dur = 0.2, vol = 0.3, attack = 0.005, pos, max = 60, echo = 0, delay = 0, vibrato = 0, filter = 0 }) {
    const ctx = this.ctx
    const t = ctx.currentTime + delay
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f0, t)
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur)
    if (vibrato) {
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 5.5
      const lg = ctx.createGain()
      lg.gain.value = f0 * vibrato
      lfo.connect(lg).connect(o.frequency)
      lfo.start(t)
      lfo.stop(t + dur + 0.05)
    }
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(1, t + attack)
    env.gain.setValueAtTime(1, t + Math.max(attack, dur * 0.6))
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    let node = o
    if (filter) {
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = filter
      o.connect(f)
      node = f
    }
    node.connect(env)
    if (!this.out(env, pos, max, vol, echo)) return
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  play(name, opts = {}) {
    if (!this.ctx || !this.enabled) return
    const pos = opts.pos
    switch (name) {
      case 'pistol':
        this.burst({ dur: 0.09, type: 'highpass', freq: 1800, vol: 0.35 })
        this.tone({ type: 'square', f0: 900, f1: 300, dur: 0.03, vol: 0.05 })
        break
      case 'rifle':
        this.burst({ dur: 0.16, type: 'bandpass', freq: 900, q: 0.7, vol: 0.5, sweep: 0.4 })
        this.tone({ f0: 140, f1: 60, dur: 0.1, vol: 0.25 })
        break
      case 'hunting':
        this.burst({ dur: 0.6, type: 'lowpass', freq: 3500, vol: 1, echo: 0.8, sweep: 0.15 })
        this.tone({ f0: 110, f1: 35, dur: 0.35, vol: 0.7 })
        this.burst({ dur: 0.08, type: 'highpass', freq: 3000, vol: 0.12, delay: 0.55 })
        break
      case 'shotgun':
        this.burst({ dur: 0.7, type: 'lowpass', freq: 2600, vol: 1, echo: 0.9, sweep: 0.12 })
        this.tone({ f0: 90, f1: 30, dur: 0.4, vol: 0.8 })
        this.burst({ dur: 0.06, type: 'bandpass', freq: 1400, q: 3, vol: 0.2, delay: 0.42 })
        this.burst({ dur: 0.06, type: 'bandpass', freq: 1100, q: 3, vol: 0.2, delay: 0.55 })
        break
      case 'reload':
        for (let i = 0; i < 3; i++) this.burst({ dur: 0.04, type: 'bandpass', freq: 2200 + i * 400, q: 6, vol: 0.18, delay: i * 0.28 + 0.1 })
        break
      case 'empty':
      case 'click':
        this.burst({ dur: 0.03, type: 'bandpass', freq: 3000, q: 8, vol: 0.2 })
        break
      case 'switch':
        this.burst({ dur: 0.06, type: 'bandpass', freq: 1200, q: 3, vol: 0.12 })
        break
      case 'dartHit':
        this.tone({ f0: 220, f1: 90, dur: 0.07, vol: 0.4, pos, max: 70 })
        break
      case 'dartMiss':
        this.burst({ dur: 0.05, type: 'bandpass', freq: 900, q: 2, vol: 0.3, pos, max: 50 })
        break
      case 'ricochet':
        this.tone({ f0: 2600, f1: 1100, dur: 0.25, vol: 0.2, pos, max: 70 })
        break
      case 'fleshHit':
        this.burst({ dur: 0.12, type: 'lowpass', freq: 500, vol: 0.5, pos, max: 120 })
        break
      case 'stone':
        this.burst({ dur: 0.04, type: 'bandpass', freq: 1700, q: 5, vol: 0.5, pos, max: 70 })
        this.burst({ dur: 0.03, type: 'bandpass', freq: 1300, q: 5, vol: 0.3, pos, max: 70, delay: 0.09 })
        break
      case 'flare':
        this.burst({ dur: 1.4, type: 'highpass', freq: 2800, vol: 0.35, pos, max: 60, attack: 0.05 })
        break
      case 'throw':
        this.burst({ dur: 0.18, type: 'bandpass', freq: 600, q: 1, vol: 0.12, sweep: 2 })
        break
      case 'scan':
        this.tone({ f0: 880, dur: 0.08, vol: 0.12 })
        this.tone({ f0: 1320, dur: 0.12, vol: 0.12, delay: 0.1 })
        break
      case 'sample':
        this.tone({ f0: 660, dur: 0.25, vol: 0.14 })
        this.tone({ f0: 990, dur: 0.4, vol: 0.12, delay: 0.12 })
        break
      case 'objective':
        this.tone({ type: 'triangle', f0: 523, dur: 0.3, vol: 0.15 })
        this.tone({ type: 'triangle', f0: 659, dur: 0.3, vol: 0.15, delay: 0.15 })
        this.tone({ type: 'triangle', f0: 784, dur: 0.6, vol: 0.15, delay: 0.3 })
        break
      case 'penalty':
        this.tone({ type: 'sawtooth', f0: 220, f1: 110, dur: 0.6, vol: 0.12, filter: 900 })
        break
      case 'hurt':
        this.burst({ dur: 0.15, type: 'lowpass', freq: 400, vol: 0.6 })
        this.tone({ type: 'sawtooth', f0: 160, f1: 95, dur: 0.22, vol: 0.12, filter: 800 })
        break
      case 'splash':
        this.burst({ dur: 0.6, type: 'lowpass', freq: 1300, vol: 0.5, pos, max: 60, sweep: 0.4 })
        break
      case 'jump':
        this.burst({ dur: 0.08, type: 'lowpass', freq: 500, vol: 0.12 })
        break
      case 'land':
        this.burst({ dur: 0.12, type: 'lowpass', freq: 380, vol: 0.35 })
        break
      case 'crate':
      case 'locker':
        this.burst({ dur: 0.2, type: 'bandpass', freq: 600, q: 4, vol: 0.4 })
        this.tone({ type: 'square', f0: 180, f1: 150, dur: 0.12, vol: 0.06, filter: 1200 })
        break
      case 'medkit':
        this.burst({ dur: 0.3, type: 'highpass', freq: 2500, vol: 0.15, sweep: 0.6 })
        break
      case 'pump':
        this.tone({ type: 'sawtooth', f0: 70, f1: 95, dur: 2.2, vol: 0.12, filter: 500, pos, max: 40 })
        break
      case 'heartbeat':
        this.tone({ f0: 62, f1: 40, dur: 0.12, vol: 0.35 })
        this.tone({ f0: 58, f1: 38, dur: 0.12, vol: 0.25, delay: 0.22 })
        break
      case 'toast':
        this.tone({ f0: 1200, dur: 0.06, vol: 0.05 })
        break
    }
  }

  step(surface, intensity) {
    if (!this.ctx || !this.enabled) return
    const v = 0.08 + intensity * 0.14
    if (surface === 'brush') this.burst({ dur: 0.16, type: 'bandpass', freq: 2600, q: 0.8, vol: v * 1.4 })
    else if (surface === 'water') this.burst({ dur: 0.22, type: 'bandpass', freq: 800, q: 1, vol: v * 1.4, sweep: 0.5 })
    else if (surface === 'gravel') this.burst({ dur: 0.07, type: 'bandpass', freq: 1900, q: 1.5, vol: v })
    else this.burst({ dur: 0.07, type: 'lowpass', freq: 650, vol: v * 1.1 })
  }

  // Dinosaur voices from a few synthesis recipes, pitched by body size.
  voice(sp, kind, pos) {
    if (!this.ctx || !this.enabled) return
    const s = sp.sound
    const p = s.pitch * (0.9 + Math.random() * 0.2)
    const max = 120 + s.size * 380
    const vol = 0.25 + s.size * 0.6
    const short = kind === 'attack' || kind === 'alarm'
    switch (s.voice) {
      case 'roar': {
        const dur = short ? 0.7 : 2.4
        this.tone({ type: 'sawtooth', f0: 140 * p, f1: 70 * p, dur, vol: vol * 0.8, attack: 0.15, pos, max, echo: 0.6, filter: 700, vibrato: 0.04 })
        this.tone({ type: 'sawtooth', f0: 70 * p, f1: 45 * p, dur, vol: vol * 0.8, attack: 0.2, pos, max, filter: 400 })
        this.burst({ dur, type: 'bandpass', freq: 420 * p, q: 1.2, vol: vol * 0.7, attack: 0.15, pos, max, sweep: 0.6 })
        break
      }
      case 'bellow': {
        const dur = short ? 0.5 : 1.3
        this.tone({ type: 'sawtooth', f0: 170 * p, f1: 120 * p, dur, vol: vol * 0.6, attack: 0.08, pos, max, filter: 650, echo: 0.3 })
        this.burst({ dur, type: 'bandpass', freq: 300 * p, q: 2, vol: vol * 0.5, attack: 0.1, pos, max })
        break
      }
      case 'horn': {
        const dur = short ? 0.6 : 1.6
        this.tone({ type: 'triangle', f0: 230 * p, f1: 210 * p, dur, vol: vol * 0.7, attack: 0.25, pos, max, echo: 0.5, vibrato: 0.02 })
        this.tone({ type: 'sine', f0: 460 * p, f1: 420 * p, dur, vol: vol * 0.25, attack: 0.3, pos, max })
        break
      }
      case 'honk':
        this.tone({ type: 'square', f0: 520 * p, f1: 380 * p, dur: 0.22, vol: vol * 0.3, pos, max, filter: 1800 })
        if (!short) this.tone({ type: 'square', f0: 560 * p, f1: 400 * p, dur: 0.2, vol: vol * 0.25, pos, max, filter: 1800, delay: 0.28 })
        break
      case 'screech':
        this.tone({ type: 'sawtooth', f0: 700 * p, f1: 1100 * p, dur: short ? 0.25 : 0.55, vol: vol * 0.45, pos, max, filter: 3500, vibrato: 0.08, echo: 0.2 })
        this.burst({ dur: 0.4, type: 'bandpass', freq: 2200, q: 2, vol: vol * 0.3, pos, max })
        break
      case 'chirp':
        for (let i = 0; i < 3; i++) this.tone({ f0: 2200 * p * 0.5, f1: 3200 * p * 0.5, dur: 0.07, vol: vol * 0.4, pos, max, delay: i * 0.1 })
        break
      case 'hiss':
        this.burst({ dur: short ? 0.4 : 0.9, type: 'highpass', freq: 2800, vol: vol * 0.6, attack: 0.05, pos, max })
        this.tone({ type: 'square', f0: 340 * p, f1: 300 * p, dur: 0.6, vol: vol * 0.12, pos, max, filter: 1500, vibrato: 0.3 })
        break
      case 'grunt':
        this.tone({ type: 'sawtooth', f0: 110 * p, f1: 75 * p, dur: short ? 0.3 : 0.6, vol: vol * 0.6, pos, max, filter: 500 })
        break
    }
  }

  // Persistent positional loop (generator hum).
  loopAt(kind, pos) {
    if (!this.ctx) return
    const ctx = this.ctx
    const g = ctx.createGain()
    g.gain.value = 0
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 320
    for (const fr of [50, 100, 150]) {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = fr + Math.random()
      const og = ctx.createGain()
      og.gain.value = 0.3 / (fr / 50)
      o.connect(og).connect(f)
      o.start()
    }
    const p = ctx.createStereoPanner()
    f.connect(g).connect(p).connect(this.master)
    this.loops.push({ g, p, pos, max: 45, vol: 0.35 })
  }

  setRotor(rpm, pos, inside) {
    if (!this.ctx) return
    const ctx = this.ctx
    if (!this.rotor) {
      const src = ctx.createBufferSource()
      src.buffer = this.noise
      src.loop = true
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = 380
      const chop = ctx.createGain()
      const lfo = ctx.createOscillator()
      lfo.type = 'square'
      const lg = ctx.createGain()
      lg.gain.value = 0.5
      lfo.connect(lg).connect(chop.gain)
      chop.gain.value = 0.5
      const whine = ctx.createOscillator()
      whine.type = 'sine'
      const wg = ctx.createGain()
      wg.gain.value = 0.04
      const g = ctx.createGain()
      g.gain.value = 0
      const p = ctx.createStereoPanner()
      src.connect(f).connect(chop).connect(g)
      whine.connect(wg).connect(g)
      g.connect(p).connect(this.master)
      src.start()
      lfo.start()
      whine.start()
      this.rotor = { g, p, lfo, whine }
    }
    const r = this.rotor
    const s = inside ? { gain: 1, pan: 0 } : this.spatial(pos, 450)
    r.g.gain.setTargetAtTime(rpm * s.gain * (inside ? 0.9 : 1.4), ctx.currentTime, 0.1)
    r.p.pan.setTargetAtTime(s.pan, ctx.currentTime, 0.1)
    r.lfo.frequency.setTargetAtTime(2 + rpm * 9, ctx.currentTime, 0.2)
    r.whine.frequency.setTargetAtTime(300 + rpm * 900, ctx.currentTime, 0.3)
  }

  startAmbience() {
    const ctx = this.ctx
    const mk = (type, freq, q, vol) => {
      const src = ctx.createBufferSource()
      src.buffer = this.noise
      src.loop = true
      src.playbackRate.value = 0.5 + Math.random() * 0.2
      const f = ctx.createBiquadFilter()
      f.type = type
      f.frequency.value = freq
      f.Q.value = q
      const g = ctx.createGain()
      g.gain.value = vol
      src.connect(f).connect(g).connect(this.master)
      src.start()
      return { g, f }
    }
    this.wind = mk('lowpass', 380, 0.5, 0.05)
    this.surf = mk('lowpass', 520, 0.7, 0)
    this.insects = mk('bandpass', 4600, 9, 0.012)
    const trem = ctx.createOscillator()
    trem.frequency.value = 17
    const tg = ctx.createGain()
    tg.gain.value = 0.008
    trem.connect(tg).connect(this.insects.g.gain)
    trem.start()
  }

  // Ambience and positional loops, once per frame.
  update(dt, G) {
    if (!this.ctx || this.ctx.state !== 'running') return
    const t = this.ctx.currentTime
    const day = G.sky.light
    const alt = G.heli?.piloted ? G.heli.pos.y - G.island.heightAt(G.heli.pos.x, G.heli.pos.z) : 0
    this.wind.g.gain.setTargetAtTime(0.03 + 0.03 * Math.sin(t * 0.13) + 0.02 * Math.sin(t * 0.41) + Math.min(0.08, alt / 2000), t, 0.5)
    this.insects.g.gain.setTargetAtTime((1.4 - day) * 0.014, t, 1)
    const L = this.listener
    const coast = Math.hypot(L.x, L.z) > 560 && G.island.heightAt(L.x, L.z) < 12 ? 1 : 0
    this.surf.g.gain.setTargetAtTime(coast * (0.05 + 0.04 * Math.sin(t * 0.35)), t, 1.5)
    for (const l of this.loops) {
      const s = this.spatial(l.pos, l.max)
      l.g.gain.setTargetAtTime(s.gain * l.vol, t, 0.2)
      l.p.pan.setTargetAtTime(s.pan, t, 0.2)
    }
    // birds by day, frogs by night
    this.birdT -= dt
    if (this.birdT <= 0) {
      this.birdT = 0.8 + Math.random() * 3.5
      const a = Math.random() * Math.PI * 2
      const pos = { x: L.x + Math.cos(a) * 30, y: L.y + 10, z: L.z + Math.sin(a) * 30 }
      if (day > 0.5) {
        const f = 1800 + Math.random() * 2500
        const n = 1 + Math.floor(Math.random() * 4)
        for (let i = 0; i < n; i++) this.tone({ f0: f, f1: f * (0.7 + Math.random() * 0.8), dur: 0.08 + Math.random() * 0.1, vol: 0.06, pos, max: 80, delay: i * 0.13 })
      } else {
        this.tone({ type: 'square', f0: 180 + Math.random() * 80, f1: 140, dur: 0.12, vol: 0.05, pos, max: 80, filter: 700 })
      }
    }
    // the island reminds you it is not empty
    this.roarT -= dt
    if (this.roarT <= 0) {
      this.roarT = 35 + Math.random() * 60
      const pool = ['tyrannosaurus', 'parasaurolophus', 'triceratops', 'velociraptor', 'brachiosaurus']
      const sp = G.species[pool[Math.floor(Math.random() * pool.length)]]
      const a = Math.random() * Math.PI * 2
      this.voice(sp, 'roar', { x: L.x + Math.cos(a) * 300, y: L.y, z: L.z + Math.sin(a) * 300 })
    }
    // heartbeat when something is hunting you
    const hunted = G.ecology.active.some((c) => c.brain.state === 'hunt' && c.brain.data.target === 'player' && Math.hypot(c.pos.x - L.x, c.pos.z - L.z) < 45)
    if (hunted) {
      this.heartT -= dt
      if (this.heartT <= 0) {
        this.heartT = 0.62
        this.play('heartbeat')
      }
    }
  }
}
