// A handful of synthesised sounds — no samples. Everything is quiet and
// bell-like; the context is only created on the first gesture, as browsers
// require.

let ctx = null
let master = null
let muted = false
try {
  muted = localStorage.getItem('cosmic-booster:muted') === '1'
} catch {}

function ensure() {
  if (ctx) return ctx.state === 'suspended' ? (ctx.resume(), ctx) : ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.5
  const comp = ctx.createDynamicsCompressor()
  master.connect(comp)
  comp.connect(ctx.destination)
  return ctx
}

export function isMuted() {
  return muted
}
export function setMuted(m) {
  muted = m
  try {
    localStorage.setItem('cosmic-booster:muted', m ? '1' : '0')
  } catch {}
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.5, ctx.currentTime, 0.05)
}

function noiseBuffer(sec) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return b
}

function bell(freq, t, dur = 1.6, gain = 0.12, type = 'sine') {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(master)
  o.start(t)
  o.stop(t + dur + 0.05)
  // a slightly inharmonic partial makes it shimmer like glass
  const o2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  o2.frequency.value = freq * 2.76
  g2.gain.setValueAtTime(0, t)
  g2.gain.linearRampToValueAtTime(gain * 0.35, t + 0.005)
  g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.5)
  o2.connect(g2)
  g2.connect(master)
  o2.start(t)
  o2.stop(t + dur)
}

function whoosh(t, dur, f0, f1, gain = 0.12, q = 1.2) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(dur)
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = q
  f.frequency.setValueAtTime(f0, t)
  f.frequency.exponentialRampToValueAtTime(f1, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f)
  f.connect(g)
  g.connect(master)
  src.start(t)
}

// pentatonic, climbing through the pack
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]
const note = (i, base = 523.25) => base * Math.pow(2, SCALE[i % SCALE.length] / 12)

export const sfx = {
  unlock() {
    ensure()
  },
  crinkle() {
    if (!ensure()) return
    const t = ctx.currentTime
    whoosh(t, 0.12, 3000, 6000, 0.05, 3)
  },
  tear(progress) {
    if (!ensure()) return
    const t = ctx.currentTime
    whoosh(t, 0.09, 1800 + progress * 2500, 4000 + progress * 3000, 0.07, 2.5)
  },
  rip() {
    if (!ensure()) return
    const t = ctx.currentTime
    whoosh(t, 0.35, 900, 7000, 0.22, 0.9)
    for (let i = 0; i < 5; i++) bell(note(i * 2, 659.25), t + 0.12 + i * 0.05, 1.8, 0.05)
  },
  swish() {
    if (!ensure()) return
    whoosh(ctx.currentTime, 0.3, 600, 2600, 0.08, 1)
  },
  reveal(i, rank) {
    if (!ensure()) return
    const t = ctx.currentTime
    bell(note(i), t, 1.8, 0.09)
    bell(note(i + 2), t + 0.07, 1.6, 0.05)
    if (rank >= 2) for (let k = 0; k < 4; k++) bell(note(i + 4 + k * 2, 1046.5), t + 0.15 + k * 0.06, 1.4, 0.035)
  },
  gather() {
    // the build before the chase card: a rising swell and a low drone
    if (!ensure()) return
    const t = ctx.currentTime
    whoosh(t, 2.2, 200, 4000, 0.16, 0.7)
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(55, t)
    o.frequency.exponentialRampToValueAtTime(38, t + 2.4)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.28, t + 1.6)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + 3.3)
  },
  chase() {
    if (!ensure()) return
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.setValueAtTime(90, t)
    o.frequency.exponentialRampToValueAtTime(30, t + 1.2)
    g.gain.setValueAtTime(0.4, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + 1.5)
    const chord = [0, 4, 7, 11, 14, 19]
    chord.forEach((s, k) => bell(392 * Math.pow(2, s / 12), t + 0.04 + k * 0.07, 3.2, 0.06))
    for (let k = 0; k < 12; k++) bell(1568 * Math.pow(2, SCALE[k % 6] / 12), t + 0.4 + k * 0.08, 1.2, 0.02)
  },
  hover() {
    if (!ensure()) return
    bell(2093 + Math.random() * 400, ctx.currentTime, 0.5, 0.012)
  },
}
