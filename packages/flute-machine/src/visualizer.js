// The canvas: a bank of air columns in a dark hall.
//
// The flute is not drawn as a flute. It is drawn as what a flute actually is —
// a column of air with a standing wave in it. The bank crossfades from ember
// amber on the left (the low, drone end) to cold cyan on the right (the high,
// smattering end), which makes the picture double as a readout of the register
// window: the lit span *is* the range the machine is playing in.
//
// Every column has a non-zero idle level driven by smooth noise, so the scene
// is composed and alive before any audio exists. That matters more than it
// sounds: the gallery screenshots this page headlessly, with no user gesture,
// which means with no audio at all.

const COLUMN_LOW = 40 // MIDI at the left edge
const COLUMN_HIGH = 96 // MIDI at the right edge

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)

// Cheap smooth 1D value noise — enough to give the column tops an organic
// silhouette instead of a flat row.
function hash(n) {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}
function noise1(x) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return lerp(hash(i), hash(i + 1), u)
}
function fbm(x, t) {
  return 0.6 * noise1(x + t) + 0.3 * noise1(x * 2.1 - t * 0.7) + 0.1 * noise1(x * 4.3 + t * 1.3)
}

const AMBER = [255, 178, 107]
const CYAN = [126, 214, 255]
const mixColor = (u) => [
  Math.round(lerp(AMBER[0], CYAN[0], u)),
  Math.round(lerp(AMBER[1], CYAN[1], u)),
  Math.round(lerp(AMBER[2], CYAN[2], u)),
]

export class Visualizer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.w = 0
    this.h = 0
    this.t = 0
    this.analyser = null
    this.freq = null
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.range = { lo: 62, hi: 86 }
    this.energy = 0
    this.notes = [] // recent note flashes: { u, life }

    this.motes = []
    this.resize()
    window.addEventListener('resize', () => this.resize())

    // Warm the scene up so the very first painted frame already has motes
    // spread through the hall rather than stacked at the bottom.
    for (let i = 0; i < 240; i++) this.stepMotes(1 / 30)
    this.t = 3.2
  }

  setAnalyser(analyser) {
    this.analyser = analyser
    this.freq = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
  }

  setRange(lo, hi) {
    this.range.lo = lo
    this.range.hi = hi
  }

  /** Flash a column when a note starts. */
  noteOn(midi, velocity) {
    const u = clamp((midi - COLUMN_LOW) / (COLUMN_HIGH - COLUMN_LOW), 0, 1)
    this.notes.push({ u, life: 1, vel: velocity })
    if (this.notes.length > 40) this.notes.shift()
  }

  resize() {
    const r = this.canvas.getBoundingClientRect()
    this.w = Math.max(1, Math.floor(r.width))
    this.h = Math.max(1, Math.floor(r.height))
    this.canvas.width = Math.floor(this.w * this.dpr)
    this.canvas.height = Math.floor(this.h * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.columns = clamp(Math.round(this.w / 70), 12, 24)
    const want = this.reduced ? 120 : 460
    while (this.motes.length < want) this.motes.push(this.newMote(true))
    this.motes.length = want
  }

  newMote(anywhere) {
    return {
      x: Math.random() * (this.w || 800),
      y: anywhere ? Math.random() * (this.h || 600) : (this.h || 600) + 8,
      r: 0.6 + Math.random() * 1.6,
      a: 0.05 + Math.random() * 0.3,
      vy: -(4 + Math.random() * 12),
    }
  }

  stepMotes(dt) {
    const h = this.h || 600
    const w = this.w || 800
    for (const m of this.motes) {
      m.y += m.vy * dt
      m.x += Math.sin(m.y * 0.004 + this.t * 0.11) * 12 * dt
      if (m.y < -8) {
        m.y = h + 8
        m.x = Math.random() * w
      }
      if (m.x < -8) m.x = w + 8
      if (m.x > w + 8) m.x = -8
    }
  }

  /** Per-column level: an idle baseline plus whatever the audio is doing. */
  levels() {
    const n = this.columns
    const out = new Float32Array(n)
    let audio = null
    if (this.analyser && this.freq) {
      this.analyser.getByteFrequencyData(this.freq)
      audio = this.freq
    }
    for (let i = 0; i < n; i++) {
      const u = n > 1 ? i / (n - 1) : 0
      let v = 0.18 + 0.34 * fbm(i * 0.37, this.t * 0.06)
      if (audio) {
        // Map the column to the frequency bin of the pitch it stands for.
        const midi = lerp(COLUMN_LOW, COLUMN_HIGH, u)
        const hz = 440 * Math.pow(2, (midi - 69) / 12)
        const bin = clamp(Math.round((hz / (this.sampleRate || 48000 / 2)) * audio.length * 2), 0, audio.length - 1)
        let acc = 0
        for (let k = -1; k <= 1; k++) acc = Math.max(acc, audio[clamp(bin + k, 0, audio.length - 1)])
        v += (acc / 255) * 1.5
      }
      for (const f of this.notes) {
        const d = Math.abs(f.u - u)
        if (d < 0.09) v += (1 - d / 0.09) * f.life * 0.9 * (0.4 + f.vel)
      }
      out[i] = v
    }
    return out
  }

  draw(dt) {
    const ctx = this.ctx
    const w = this.w
    const h = this.h
    if (!w || !h) return

    this.t += dt
    this.stepMotes(dt)
    for (const f of this.notes) f.life -= dt * 1.6
    this.notes = this.notes.filter((f) => f.life > 0)

    // 1. The hall.
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#05070b')
    g.addColorStop(0.55, '#0a1018')
    g.addColorStop(1, '#070a10')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    const pool = ctx.createRadialGradient(w * 0.5, h * 0.72, 0, w * 0.5, h * 0.72, w * 0.7)
    pool.addColorStop(0, 'rgba(60,110,160,0.10)')
    pool.addColorStop(1, 'rgba(60,110,160,0)')
    ctx.fillStyle = pool
    ctx.fillRect(0, 0, w, h)

    // 2. The air columns.
    const levels = this.levels()
    const n = this.columns
    const step = w / (n + 1)
    ctx.globalCompositeOperation = 'lighter'
    let energy = 0

    for (let i = 0; i < n; i++) {
      const u = n > 1 ? i / (n - 1) : 0
      const midi = lerp(COLUMN_LOW, COLUMN_HIGH, u)
      const inRange = midi >= this.range.lo - 1 && midi <= this.range.hi + 1
      const a = clamp(levels[i], 0, 2.2)
      energy += a
      const [r, gg, b] = mixColor(u)
      const c = `${r},${gg},${b}`
      const alpha = inRange ? 1 : 0.1
      const x = step * (i + 1)
      const bw = 18 + 26 * Math.min(a, 1.4)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, `rgba(${c},0)`)
      grad.addColorStop(0.45, `rgba(${c},${0.22 * alpha})`)
      grad.addColorStop(0.62, `rgba(255,255,255,${0.4 * Math.min(a, 1.2) * alpha})`)
      grad.addColorStop(0.85, `rgba(${c},${0.1 * alpha})`)
      grad.addColorStop(1, `rgba(${c},0)`)
      ctx.fillStyle = grad
      ctx.fillRect(x - bw / 2, 0, bw, h)

      ctx.save()
      ctx.shadowBlur = 18
      ctx.shadowColor = `rgba(${c},${0.9 * alpha})`
      ctx.fillStyle = `rgba(255,255,255,${0.55 * Math.min(a, 1.3) * alpha})`
      ctx.fillRect(x - 0.75, h * 0.12, 1.5, h * 0.76)
      ctx.restore()
    }
    this.energy = energy / n

    // 3. Breath motes, brighter inside a lit column.
    for (const m of this.motes) {
      const u = clamp(m.x / w, 0, 1)
      const midi = lerp(COLUMN_LOW, COLUMN_HIGH, u)
      const near = Math.abs(((m.x % step) - step / 2) / (step / 2))
      const lit = midi >= this.range.lo && midi <= this.range.hi && near > 0.55
      const [r, gg, b] = mixColor(u)
      const alpha = m.a * (lit ? 1.8 : 1)
      ctx.fillStyle = lit ? `rgba(${r},${gg},${b},${alpha})` : `rgba(200,230,255,${alpha})`
      ctx.beginPath()
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
      ctx.fill()
    }

    // 4. The breath ribbon — one long held exhale across the lower third.
    const amp = 14 + 26 * clamp(this.energy - 0.3, 0, 1.4)
    for (let k = 0; k < 3; k++) {
      ctx.beginPath()
      ctx.lineWidth = [1.6, 1.0, 0.6][k]
      ctx.strokeStyle = `rgba(169,230,255,${[0.35, 0.18, 0.1][k]})`
      for (let x = 0; x <= w; x += 6) {
        const y = h * 0.72 + k * 6 + Math.sin(x * 0.006 + this.t * 0.55 + k * 0.12) * amp
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    ctx.globalCompositeOperation = 'source-over'

    // 5. Vignette.
    const v = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.75)
    v.addColorStop(0.38, 'rgba(0,0,0,0)')
    v.addColorStop(1, 'rgba(0,0,0,0.58)')
    ctx.fillStyle = v
    ctx.fillRect(0, 0, w, h)
  }

  start() {
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      this.draw(dt)
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }
}
