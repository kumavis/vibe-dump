// audio.js — three synthesized sounds, no samples. The context is created on
// the first user gesture; anything that fires before then is silent.
export class Sfx {
  constructor() {
    this.ctx = null
    this.master = null
    this.noiseBuf = null
  }

  unlock() {
    if (!this.ctx) {
      const C = window.AudioContext || window.webkitAudioContext
      if (!C) return
      this.ctx = new C()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.55
      this.master.connect(this.ctx.destination)
      const len = this.ctx.sampleRate * 2
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
      const d = this.noiseBuf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
  }

  noise() {
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuf
    src.loop = true
    return src
  }

  launch() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    const src = this.noise()
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 0.9
    bp.frequency.setValueAtTime(1400, t)
    bp.frequency.exponentialRampToValueAtTime(180, t + 0.6)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65)
    src.connect(bp).connect(g).connect(this.master)
    src.start(t)
    src.stop(t + 0.7)
  }

  explode(dist) {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    const vol = 1 / (1 + dist * 0.06)
    const src = this.noise()
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(2200, t)
    lp.frequency.exponentialRampToValueAtTime(60, t + 1.6)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(1.2 * vol, t + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
    src.connect(lp).connect(g).connect(this.master)
    src.start(t)
    src.stop(t + 1.9)

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(90, t)
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.7)
    const og = this.ctx.createGain()
    og.gain.setValueAtTime(0.0001, t)
    og.gain.exponentialRampToValueAtTime(0.9 * vol, t + 0.01)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
    osc.connect(og).connect(this.master)
    osc.start(t)
    osc.stop(t + 0.85)
  }
}
