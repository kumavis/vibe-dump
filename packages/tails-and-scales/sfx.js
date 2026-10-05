// Tiny synthesized sound kit — no audio files. Starts muted until the first
// user gesture (browsers insist), and remembers the mute toggle.

let ctx = null
let master = null
let muted = false
try {
  muted = localStorage.getItem('tails-and-scales:muted') === '1'
} catch {}

export function unlock() {
  if (ctx) return
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 0.5
    master.connect(ctx.destination)
  } catch {
    ctx = null
  }
}

export function toggleMute() {
  muted = !muted
  try {
    localStorage.setItem('tails-and-scales:muted', muted ? '1' : '0')
  } catch {}
  if (master) master.gain.value = muted ? 0 : 0.5
  return muted
}
export const isMuted = () => muted

function noise(dur) {
  const n = Math.floor(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, n, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  return src
}

function env(node, t0, a, peak, dur) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + a)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  node.connect(g)
  g.connect(master)
  return g
}

function burst({ dur = 0.3, freq = 800, type = 'lowpass', peak = 0.5, delay = 0, q = 1 }) {
  const t = ctx.currentTime + delay
  const src = noise(dur)
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  src.connect(f)
  env(f, t, 0.005, peak, dur)
  src.start(t)
}

function tone({ f0 = 440, f1 = f0, dur = 0.15, type = 'sine', peak = 0.2, delay = 0 }) {
  const t = ctx.currentTime + delay
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur)
  env(o, t, 0.01, peak, dur)
  o.start(t)
  o.stop(t + dur + 0.05)
}

const S = {
  dice(n = 3) {
    for (let i = 0; i < Math.min(6, n); i++) burst({ dur: 0.04, freq: 2500 + Math.random() * 2000, type: 'bandpass', q: 4, peak: 0.35, delay: i * 0.035 + Math.random() * 0.02 })
  },
  boom(big = 1) {
    burst({ dur: 0.5 + big * 0.5, freq: 300 + 200 / big, peak: 0.8 })
    tone({ f0: 90, f1: 30, dur: 0.5 + big * 0.3, type: 'sine', peak: 0.5 })
  },
  shot() {
    tone({ f0: 900, f1: 300, dur: 0.08, type: 'triangle', peak: 0.12 })
  },
  thwack() {
    burst({ dur: 0.07, freq: 1400, type: 'bandpass', q: 2, peak: 0.4 })
  },
  squeak() {
    tone({ f0: 1400, f1: 2400, dur: 0.12, type: 'sine', peak: 0.12 })
  },
  hiss() {
    burst({ dur: 0.35, freq: 5000, type: 'highpass', peak: 0.18 })
  },
  crumble() {
    burst({ dur: 0.8, freq: 500, peak: 0.45 })
    for (let i = 0; i < 4; i++) burst({ dur: 0.05, freq: 1200, type: 'bandpass', peak: 0.25, delay: 0.1 + i * 0.09 })
  },
  magic() {
    for (let i = 0; i < 4; i++) tone({ f0: 500 + i * 220, f1: 900 + i * 300, dur: 0.25, type: 'sine', peak: 0.08, delay: i * 0.06 })
  },
  fizzle() {
    tone({ f0: 600, f1: 120, dur: 0.35, type: 'sawtooth', peak: 0.06 })
  },
  fanfare() {
    ;[523, 659, 784, 1046].forEach((f, i) => tone({ f0: f, dur: 0.3, type: 'triangle', peak: 0.15, delay: i * 0.14 }))
  },
  click() {
    tone({ f0: 1200, f1: 900, dur: 0.04, type: 'square', peak: 0.04 })
  },
}

export const sfx = new Proxy(S, {
  get(target, key) {
    return (...args) => {
      if (!ctx || muted) return
      try {
        target[key](...args)
      } catch {}
    }
  },
})
