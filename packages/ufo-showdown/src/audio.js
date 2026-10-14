// Every sound is synthesized on the spot with Web Audio — no files to fetch.
// The context is created on the first key press or click, since browsers keep
// audio locked until the page has been interacted with.

let ac = null
let master = null
let noiseBuf = null
let muted = false
// Throttle per sound name so twenty bullets landing in one frame are one tick.
const lastPlayed = new Map()

export function unlockAudio() {
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ac = new AC()
    master = ac.createGain()
    master.gain.value = muted ? 0 : 0.55
    const comp = ac.createDynamicsCompressor()
    master.connect(comp)
    comp.connect(ac.destination)
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  if (ac.state === 'suspended') ac.resume()
}

export function toggleMute() {
  muted = !muted
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.55, ac.currentTime, 0.02)
  return muted
}

export const isMuted = () => muted

function ready(name, gap) {
  if (!ac || muted) return false
  const now = ac.currentTime
  if (gap && now - (lastPlayed.get(name) ?? -1) < gap) return false
  lastPlayed.set(name, now)
  return true
}

function tone({ type = 'sine', from, to = from, dur, vol = 0.3, at = 0, attack = 0.005 }) {
  const t0 = ac.currentTime + at
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = type
  o.frequency.setValueAtTime(from, t0)
  if (to !== from) o.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g)
  g.connect(master)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

function noise({ dur, vol = 0.4, freq = 1200, to = 200, q = 0.8, at = 0 }) {
  const t0 = ac.currentTime + at
  const src = ac.createBufferSource()
  src.buffer = noiseBuf
  const f = ac.createBiquadFilter()
  f.type = 'lowpass'
  f.Q.value = q
  f.frequency.setValueAtTime(freq, t0)
  f.frequency.exponentialRampToValueAtTime(Math.max(to, 20), t0 + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(vol, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f)
  f.connect(g)
  g.connect(master)
  src.start(t0, Math.random() * 0.5)
  src.stop(t0 + dur + 0.05)
}

export const sfx = {
  select() {
    if (!ready('select', 0.03)) return
    tone({ type: 'square', from: 660, to: 990, dur: 0.08, vol: 0.12 })
  },
  start() {
    if (!ready('start')) return
    ;[523, 659, 784, 1047].forEach((f, i) => tone({ type: 'square', from: f, dur: 0.12, vol: 0.12, at: i * 0.07 }))
  },
  zap() {
    if (!ready('zap', 0.05)) return
    tone({ type: 'square', from: 1400, to: 500, dur: 0.06, vol: 0.035 })
  },
  hitTick() {
    if (!ready('tick', 0.06)) return
    tone({ type: 'triangle', from: 900, to: 600, dur: 0.05, vol: 0.08 })
  },
  ting() {
    if (!ready('ting', 0.09)) return
    tone({ type: 'sine', from: 2200, to: 1800, dur: 0.09, vol: 0.06 })
  },
  pop(size = 1) {
    if (!ready('pop', 0.04)) return
    noise({ dur: 0.25 * size + 0.1, vol: 0.35, freq: 2400, to: 160 })
    tone({ type: 'triangle', from: 300, to: 60, dur: 0.2 * size + 0.08, vol: 0.2 })
  },
  boom() {
    if (!ready('boom', 0.1)) return
    noise({ dur: 1.4, vol: 0.7, freq: 1600, to: 60, q: 1.2 })
    tone({ type: 'sine', from: 120, to: 30, dur: 1.2, vol: 0.5 })
  },
  hurt() {
    if (!ready('hurt', 0.1)) return
    tone({ type: 'sawtooth', from: 520, to: 70, dur: 0.5, vol: 0.2 })
    noise({ dur: 0.5, vol: 0.4, freq: 1800, to: 120 })
  },
  shieldPop() {
    if (!ready('shield', 0.1)) return
    tone({ type: 'sine', from: 1200, to: 300, dur: 0.3, vol: 0.2 })
  },
  bubble() {
    if (!ready('bubble', 0.05)) return
    tone({ type: 'sine', from: 380, to: 1300, dur: 0.12, vol: 0.25 })
    ;[784, 988, 1319].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.12, vol: 0.12, at: 0.08 + i * 0.06 }))
  },
  nova() {
    if (!ready('nova')) return
    tone({ type: 'sawtooth', from: 80, to: 900, dur: 0.6, vol: 0.18 })
    noise({ dur: 0.9, vol: 0.5, freq: 4000, to: 200 })
  },
  laserWarn() {
    if (!ready('lwarn', 0.3)) return
    tone({ type: 'square', from: 880, dur: 0.08, vol: 0.06 })
    tone({ type: 'square', from: 880, dur: 0.08, vol: 0.06, at: 0.16 })
  },
  laser() {
    if (!ready('laser', 0.2)) return
    tone({ type: 'sawtooth', from: 160, to: 110, dur: 0.8, vol: 0.16, attack: 0.02 })
    noise({ dur: 0.7, vol: 0.2, freq: 3000, to: 800 })
  },
  siren() {
    if (!ready('siren')) return
    for (let i = 0; i < 3; i++) {
      tone({ type: 'sawtooth', from: 440, to: 660, dur: 0.3, vol: 0.12, at: i * 0.6 })
      tone({ type: 'sawtooth', from: 660, to: 440, dur: 0.3, vol: 0.12, at: i * 0.6 + 0.3 })
    }
  },
  revive() {
    if (!ready('revive')) return
    ;[392, 523, 659, 784].forEach((f, i) => tone({ type: 'sine', from: f, dur: 0.2, vol: 0.16, at: i * 0.08 }))
  },
  clear() {
    if (!ready('clear')) return
    ;[523, 659, 784, 659, 784, 1047].forEach((f, i) => tone({ type: 'square', from: f, dur: 0.16, vol: 0.1, at: i * 0.11 }))
  },
  win() {
    if (!ready('win')) return
    const notes = [523, 523, 523, 698, 880, 784, 698, 1047]
    const at = [0, 0.15, 0.3, 0.45, 0.75, 1.05, 1.2, 1.35]
    notes.forEach((f, i) => tone({ type: 'square', from: f, dur: i === notes.length - 1 ? 0.8 : 0.14, vol: 0.12, at: at[i] }))
  },
  lose() {
    if (!ready('lose')) return
    ;[392, 330, 262, 196].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.35, vol: 0.18, at: i * 0.28 }))
  },
}
