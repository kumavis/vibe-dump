// Footsteps. A step is three things a listener reads as feet: a heel strike
// (a short thump of low noise), a toe/scuff 60–90 ms later, and the surface
// itself — rustling leaves, a gravel crunch, the knock of a deck board, a
// splash. Each step varies a little in pitch and timing, is panned to the foot
// that lands, and gets louder with speed (sprint) and quieter crouched.
//
// The body of every impact sits in 150–500 Hz, which small speakers still
// play; anything lower is only weight for headphones. Boards and plates ring
// as noise through resonant filters, not as sine notes, and keep one pitch per
// object (`tune`), so walking a deck sounds like one deck, not a xylophone.
//
// Everything is scheduled into any AudioContext and destination, so the same
// code plays in the game and renders into an OfflineAudioContext for testing.
//
// Levels in the recipes: a tone's `gain` is its peak; a noise grain's or a
// resonance's `gain` is roughly its RMS at the top of its envelope.

// Overall level of a step before the master bus, and how far feet pan apart.
const STEP_GAIN = 1
const STEP_PAN = 0.1

export const SURFACES = ['dirt', 'sand', 'grass', 'brush', 'gravel', 'rock', 'wood', 'concrete', 'metal', 'water', 'swim']

export function makeNoise(ctx, seconds = 2) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return buf
}

// One step into `dest`. `side` is -1 (left foot) or 1 (right); `intensity` is
// 0.35 crouched, 0.65 walking, 1 sprinting; `tune` (0–1) is the pitch of the
// thing underfoot — the same deck or bench passes the same value every step.
export function playStep(ctx, dest, noise, surface, { intensity = 0.65, side = 1, t = ctx.currentTime + 0.005, rnd = Math.random, tune } = {}) {
  const bus = ctx.createGain()
  bus.gain.value = STEP_GAIN * (side > 0 ? 1 : 0.9)
  const pan = ctx.createStereoPanner()
  pan.pan.value = side * STEP_PAN
  bus.connect(pan).connect(dest)
  // a creeping foot is placed rather than struck: much quieter (~8 dB under a
  // walk, as the noise it makes is 2.5 m against 9 m), darker, a softer heel
  const creep = intensity < 0.45
  const s = {
    ctx,
    out: bus,
    noise,
    rnd,
    k: creep ? 0.3 : 0.2 + 0.8 * intensity, // walk 0.72, sprint 1
    hard: creep ? 0.6 : 0.7 + 0.5 * intensity, // a fast foot lands brighter
    heel: creep ? 0.7 : 1,
    p: 0.97 + rnd() * 0.06, // per-step pitch, ±3%
    tune: tune ?? rnd(),
  }
  const heel = t + rnd() * 0.012
  // heel-to-toe roll: quicker at a sprint, slower creeping
  const roll = (0.06 + rnd() * 0.03) * (intensity > 0.9 ? 0.8 : creep ? 1.25 : 1)
  ;(RECIPES[surface] || RECIPES.dirt)(s, heel, heel + roll)
}

// ---------------------------------------------------------------- building blocks

function env(ctx, t, peak, attack, decay) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  return g
}

// White noise keeps only a slice of its power through a filter; this undoes
// that so a grain's gain means the same at any width.
function bandNorm(sampleRate, type, freq, q) {
  const nyq = sampleRate / 2
  const bw = type === 'lowpass' ? freq : type === 'highpass' ? nyq - freq : freq / q
  return 1 / (0.577 * Math.sqrt(Math.min(1, Math.max(50, bw) / nyq)))
}

// filtered noise grain
function grain(s, t, { type = 'bandpass', freq, q = 1, gain, attack = 0.002, dur, sweep = 0 }) {
  const { ctx, noise } = s
  const src = ctx.createBufferSource()
  src.buffer = noise
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.setValueAtTime(freq, t)
  if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(30, freq * sweep), t + attack + dur)
  f.Q.value = q
  src.connect(f).connect(env(ctx, t, gain * bandNorm(ctx.sampleRate, type, freq, q), attack, dur)).connect(s.out)
  src.start(t, Math.random() * Math.max(0, noise.duration - 0.6))
  src.stop(t + attack + dur + 0.02)
}

// decaying sine: weight under a heel, a bubble
function tone(s, t, { f0, f1 = f0, gain, attack = 0.002, decay }) {
  const { ctx } = s
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(f0, t)
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + attack + decay)
  o.connect(env(ctx, t, gain, attack, decay)).connect(s.out)
  o.start(t)
  o.stop(t + attack + decay + 0.02)
}

// A resonance struck by a few milliseconds of noise: a board, a plate, a slab.
// It rings for about q / (pi f) seconds per neper, a band of noise rather than
// a pure line, so it colours the knock instead of playing a note.
const BURST = 0.004
function ring(s, t, { f, q, gain }) {
  const { ctx, noise } = s
  // how much of a burst this short survives a band f/q wide (a linear-ramp
  // burst is worth BURST/3 of steady noise)
  const keep = 0.577 * ((2 * Math.PI * f) / q) * Math.sqrt(BURST / 3 / (2 * ctx.sampleRate))
  const src = ctx.createBufferSource()
  src.buffer = noise
  const e = ctx.createGain()
  e.gain.setValueAtTime(0, t)
  e.gain.linearRampToValueAtTime(gain / keep, t + 0.0005)
  e.gain.linearRampToValueAtTime(0, t + BURST)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = f
  bp.Q.value = q
  src.connect(e).connect(bp).connect(s.out)
  src.start(t, Math.random() * Math.max(0, noise.duration - 0.6))
  src.stop(t + BURST + (7 * q) / (Math.PI * f)) // until it is 60 dB down
}

// A scatter of tiny clicks, denser at the start: gravel, grit, sand. Each is a
// few milliseconds of band-passed noise; they are written straight into one
// buffer and played as one source, so a crunch of twenty stones costs one node.
function clicks(s, t, { n, spread, lo, hi, gain, q = 2.5, dur = 0.004 }) {
  const { ctx } = s
  const sr = ctx.sampleRate
  const r = s.rnd
  const pre = Math.ceil(0.002 * sr) // filter run-in, so each click starts settled
  const buf = ctx.createBuffer(1, Math.ceil((spread + dur * 1.6 + 0.01) * sr), sr)
  const out = buf.getChannelData(0)
  for (let i = 0; i < n; i++) {
    const at = Math.floor(Math.pow(r(), 1.7) * spread * sr)
    const f = lo * Math.pow(hi / lo, r())
    const peak = gain * (0.3 + 0.7 * r()) * bandNorm(sr, 'bandpass', f, q)
    const attack = Math.round(0.0008 * sr)
    const decay = dur * (0.6 + r()) * sr
    // RBJ band-pass (constant 0 dB peak), the filter a BiquadFilterNode runs
    const w = (2 * Math.PI * f) / sr
    const al = Math.sin(w) / (2 * q)
    const b0 = al / (1 + al)
    const a1 = (-2 * Math.cos(w)) / (1 + al)
    const a2 = (1 - al) / (1 + al)
    let x1 = 0
    let x2 = 0
    let y1 = 0
    let y2 = 0
    // the grain envelope: exponential rise from -80 dB, exponential fall back
    let g = 0.0001
    const rise = Math.pow(peak / 0.0001, 1 / attack)
    const fall = Math.pow(0.0001 / peak, 1 / decay)
    const len = Math.min(out.length - at, Math.ceil(attack + decay))
    for (let j = -pre; j < len; j++) {
      const x = Math.random() * 2 - 1
      const y = b0 * (x - x2) - a1 * y1 - a2 * y2
      x2 = x1
      x1 = x
      y2 = y1
      y1 = y
      if (j < 0) continue
      out[at + j] += y * g
      g *= j < attack ? rise : fall
    }
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(s.out)
  src.start(t)
}

// The heel strike common to every shod foot on solid ground: a short burst of
// low noise centred in 150–500 Hz (the thud), with a quiet falling sine under
// it for weight on headphones. `body` is the thud's centre.
function heelStrike(s, t, { body = 260, gain, decay = 0.035, weight = 0.3 }) {
  const g = gain * s.k * s.heel
  grain(s, t, { freq: body * s.hard, q: 0.8, gain: g, attack: 0.0015, dur: decay })
  tone(s, t, { f0: 120 * s.p, f1: 65 * s.p, gain: g * weight, attack: 0.003, decay: 0.05 })
}

// a metal plate's partials (ratio, level): dense and inharmonic, not a bar's
const PLATE = [
  [1, 0.024],
  [1.41, 0.02],
  [1.73, 0.016],
  [2.33, 0.013],
  [2.9, 0.01],
  [3.9, 0.007],
]

// ---------------------------------------------------------------- surfaces

const RECIPES = {
  // packed earth: dull thud, soft grit, a short scuff on the toe
  dirt(s, heel, toe) {
    heelStrike(s, heel, { body: 240, gain: 0.11 })
    clicks(s, heel + 0.004, { n: 4, spread: 0.05, lo: 2500, hi: 6000, gain: 0.03 * s.k })
    grain(s, toe, { freq: 320 * s.p, q: 0.9, gain: 0.05 * s.k * s.heel, attack: 0.002, dur: 0.03 })
    grain(s, toe, { freq: 900 * s.p, q: 0.9, gain: 0.04 * s.k, attack: 0.003, dur: 0.04 })
  },

  // beach: a soft thud and the hiss of sand giving way
  sand(s, heel, toe) {
    heelStrike(s, heel, { body: 200, gain: 0.08, decay: 0.04 })
    grain(s, heel + 0.006, { freq: 2200 * s.p, q: 0.6, gain: 0.035 * s.k, attack: 0.008, dur: 0.1, sweep: 0.7 })
    clicks(s, heel + 0.01, { n: 10, spread: 0.08, lo: 1800, hi: 4500, gain: 0.03 * s.k, q: 1.5 })
    grain(s, toe, { freq: 1500 * s.p, q: 0.7, gain: 0.03 * s.k, attack: 0.006, dur: 0.06 })
  },

  // short grass: soft ground under a swish of blades
  grass(s, heel, toe) {
    heelStrike(s, heel, { body: 220, gain: 0.09, decay: 0.035 })
    grain(s, heel + 0.004, { freq: 3200 * s.p, q: 0.8, gain: 0.045 * s.k, attack: 0.006, dur: 0.09, sweep: 0.8 })
    grain(s, heel + 0.03 + s.rnd() * 0.03, { freq: 4500, q: 1.2, gain: 0.03 * s.k, attack: 0.004, dur: 0.05 })
    grain(s, toe, { freq: 2800 * s.p, q: 0.9, gain: 0.035 * s.k, attack: 0.003, dur: 0.05 })
  },

  // ferns and tall grass: a footfall first, then leaves brushing the shin —
  // short, so the thud stays the event and steps never smear into a hiss;
  // now and then a twig
  brush(s, heel, toe) {
    const r = s.rnd
    heelStrike(s, heel, { body: 230, gain: 0.145, decay: 0.04 })
    grain(s, heel + 0.003, { freq: 2200 * s.p, q: 0.6, gain: 0.04 * s.k, attack: 0.004, dur: 0.1, sweep: 1.3 })
    const n = 3 + Math.floor(r() * 3)
    for (let i = 0; i < n; i++) {
      grain(s, heel + 0.005 + r() * 0.09, { freq: 1500 + r() * 3000, q: 0.8 + r() * 0.8, gain: (0.02 + r() * 0.025) * s.k, attack: 0.002 + r() * 0.004, dur: 0.025 + r() * 0.04 })
    }
    if (r() < 0.18) grain(s, heel + 0.02 + r() * 0.06, { freq: 2600 + r() * 1500, q: 4, gain: 0.1 * s.k, attack: 0.0008, dur: 0.008 })
    // the toe: a short scuff through the stems and a leaf or two
    grain(s, toe, { freq: 2600 * s.p, q: 0.8, gain: 0.03 * s.k, attack: 0.002, dur: 0.04 })
    grain(s, toe + 0.01 + r() * 0.02, { freq: 1800 + r() * 2000, q: 1.2, gain: 0.015 * s.k, attack: 0.002, dur: 0.03 })
  },

  // the road: a granular crunch of many tiny stones, on the heel and again on the toe
  gravel(s, heel, toe) {
    heelStrike(s, heel, { body: 280, gain: 0.08, decay: 0.035 })
    clicks(s, heel, { n: 12 + Math.floor(s.rnd() * 5), spread: 0.1, lo: 1800, hi: 6500, gain: 0.09 * s.k })
    grain(s, heel + 0.004, { freq: 2600, q: 0.6, gain: 0.02 * s.k, attack: 0.004, dur: 0.08 })
    clicks(s, toe, { n: 7 + Math.floor(s.rnd() * 3), spread: 0.06, lo: 2200, hi: 7000, gain: 0.07 * s.k })
  },

  // bare rock: hard, with a scrape of grit
  rock(s, heel, toe) {
    heelStrike(s, heel, { body: 360, gain: 0.08, decay: 0.025 })
    grain(s, heel, { type: 'highpass', freq: 2400 * s.hard, q: 0.7, gain: 0.06 * s.k, attack: 0.0008, dur: 0.012 })
    clicks(s, heel + 0.005, { n: 5, spread: 0.05, lo: 2500, hi: 7000, gain: 0.05 * s.k })
    grain(s, toe, { freq: 3400, q: 0.8, gain: 0.03 * s.k, attack: 0.003, dur: 0.04 })
  },

  // decks, bridges, towers: the hollow knock of a board on its joists — a low
  // thud, the contact click, and the board's own band ringing for a few cycles
  wood(s, heel, toe) {
    const f = (170 + s.tune * 110) * s.p
    heelStrike(s, heel, { body: 190, gain: 0.12, decay: 0.045 })
    grain(s, heel, { freq: 2400, q: 1.2, gain: 0.055 * s.k * s.hard, attack: 0.0008, dur: 0.012 })
    ring(s, heel, { f, q: 6, gain: 0.06 * s.k * s.heel })
    ring(s, heel, { f: f * 2.3, q: 5, gain: 0.025 * s.k * s.hard })
    // the toe: a scuff and a softer knock of the same board, never a new note
    grain(s, toe, { freq: 3000, q: 1.2, gain: 0.03 * s.k, attack: 0.0008, dur: 0.01 })
    ring(s, toe, { f, q: 6, gain: 0.02 * s.k })
  },

  // floors and the helipad: a sharp click and slap with a faint slab ring
  concrete(s, heel, toe) {
    heelStrike(s, heel, { body: 420, gain: 0.06, decay: 0.025 })
    grain(s, heel, { type: 'highpass', freq: 2500 * s.hard, q: 0.7, gain: 0.08 * s.k * s.hard, attack: 0.0008, dur: 0.012 })
    grain(s, heel + 0.001, { freq: 1400 * s.p, q: 1.4, gain: 0.07 * s.k, attack: 0.001, dur: 0.03 })
    ring(s, heel, { f: 760 * s.p, q: 14, gain: 0.025 * s.k })
    grain(s, toe, { type: 'highpass', freq: 3200, q: 0.7, gain: 0.05 * s.k, attack: 0.0008, dur: 0.008 })
    grain(s, toe + 0.004, { freq: 3500, q: 0.8, gain: 0.025 * s.k, attack: 0.003, dur: 0.035 })
  },

  // roofs, grates, painted steel benches: a click and a plate's dense, damped
  // ring under the thud — one pitch per object
  metal(s, heel, toe) {
    const f = (330 + s.tune * 170) * s.p
    heelStrike(s, heel, { body: 320, gain: 0.08, decay: 0.03 })
    grain(s, heel, { type: 'highpass', freq: 3000, q: 0.7, gain: 0.07 * s.k * s.hard, attack: 0.0008, dur: 0.01 })
    for (const [m, g] of PLATE) ring(s, heel, { f: f * m, q: 28, gain: g * s.k })
    grain(s, toe, { type: 'highpass', freq: 3500, q: 0.7, gain: 0.04 * s.k, attack: 0.0008, dur: 0.008 })
    ring(s, toe, { f: f * 1.41, q: 28, gain: 0.008 * s.k })
  },

  // shallows: a splash on the way in, a slosh around the shin, a few bubbles
  water(s, heel, toe) {
    const r = s.rnd
    tone(s, heel, { f0: 90 * s.p, f1: 50 * s.p, gain: 0.05 * s.k, attack: 0.004, decay: 0.06 })
    grain(s, heel, { freq: 1400 * s.p, q: 0.7, gain: 0.08 * s.k, attack: 0.004, dur: 0.18, sweep: 0.45 })
    grain(s, heel, { type: 'highpass', freq: 3500, q: 0.5, gain: 0.03 * s.k, attack: 0.003, dur: 0.1 })
    grain(s, heel + 0.09 + r() * 0.05, { freq: 550 * s.p, q: 1.2, gain: 0.06 * s.k, attack: 0.03, dur: 0.22, sweep: 1.3 })
    for (let i = 0; i < 3; i++) {
      const f = 600 + r() * 700
      tone(s, heel + 0.05 + r() * 0.2, { f0: f, f1: f * 1.6, gain: 0.02 * s.k, attack: 0.002, decay: 0.03 })
    }
    grain(s, toe + 0.04, { freq: 900, q: 1, gain: 0.04 * s.k, attack: 0.02, dur: 0.1 })
  },

  // swimming: a stroke, no feet
  swim(s, heel) {
    const r = s.rnd
    grain(s, heel, { freq: 700 * s.p, q: 0.8, gain: 0.07 * s.k, attack: 0.05, dur: 0.35, sweep: 1.5 })
    grain(s, heel + 0.12, { freq: 1600, q: 0.6, gain: 0.025 * s.k, attack: 0.03, dur: 0.2, sweep: 0.6 })
    for (let i = 0; i < 4; i++) {
      const f = 500 + r() * 900
      tone(s, heel + 0.1 + r() * 0.3, { f0: f, f1: f * 1.7, gain: 0.02 * s.k, attack: 0.002, decay: 0.035 })
    }
  },
}
