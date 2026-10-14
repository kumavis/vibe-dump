// Footsteps. A step is three things a listener reads as feet: a heel strike
// (a low thump that dies fast), a toe/scuff 60–90 ms later, and the surface
// itself — rustling leaves, a gravel crunch, the hollow knock of a deck board,
// a splash. Each step varies a little in pitch and timing, alternates left and
// right, and gets louder with speed (sprint) and softer crouched.
//
// Everything is scheduled into any AudioContext and destination, so the same
// code plays in the game and renders into an OfflineAudioContext for testing.
//
// Levels in the recipes: a tone's `gain` is its peak; a noise grain's `gain`
// is roughly its RMS at the top of its envelope, whatever the filter width.

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
// 0.35 crouched, 0.65 walking, 1 sprinting.
export function playStep(ctx, dest, noise, surface, { intensity = 0.65, side = 1, t = ctx.currentTime + 0.005, rnd = Math.random } = {}) {
  const bus = ctx.createGain()
  bus.gain.value = STEP_GAIN * (side > 0 ? 1 : 0.9)
  const pan = ctx.createStereoPanner()
  pan.pan.value = side * STEP_PAN
  bus.connect(pan).connect(dest)
  const s = {
    ctx,
    out: bus,
    noise,
    rnd,
    k: 0.2 + 0.8 * intensity, // loudness by gait: crouch ~0.5, walk ~0.7, sprint 1
    hard: 0.7 + 0.5 * intensity, // a fast foot lands brighter
    p: 0.93 + rnd() * 0.14, // per-step pitch
  }
  const heel = t + rnd() * 0.012
  // heel-to-toe roll: quicker at a sprint, slower creeping
  const roll = (0.06 + rnd() * 0.03) * (intensity > 0.9 ? 0.8 : intensity < 0.45 ? 1.25 : 1)
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
function bandNorm(ctx, type, freq, q) {
  const nyq = ctx.sampleRate / 2
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
  src.connect(f).connect(env(ctx, t, gain * bandNorm(ctx, type, freq, q), attack, dur)).connect(s.out)
  src.start(t, Math.random() * Math.max(0, noise.duration - 0.6))
  src.stop(t + attack + dur + 0.02)
}

// decaying sine: the heel's thump (pitch falling) and the modes of a knock or a ring
function tone(s, t, { f0, f1 = f0, gain, attack = 0.002, decay }) {
  const { ctx } = s
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(f0, t)
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + attack + decay)
  o.connect(env(ctx, t, gain, attack, decay)).connect(s.out)
  o.start(t)
  o.stop(t + attack + decay + 0.02)
}

// a scatter of tiny clicks, denser at the start: gravel, grit, sand
function clicks(s, t, { n, spread, lo, hi, gain, q = 2.5, dur = 0.004 }) {
  const r = s.rnd
  for (let i = 0; i < n; i++) {
    grain(s, t + Math.pow(r(), 1.7) * spread, {
      freq: lo * Math.pow(hi / lo, r()),
      q,
      gain: gain * (0.3 + 0.7 * r()),
      attack: 0.0008,
      dur: dur * (0.6 + r()),
    })
  }
}

// the heel strike common to every shod foot on solid ground: a falling sine
// thump and a short burst of low noise
function heelStrike(s, t, { f = 125, gain, decay = 0.07, thud = 400, thudGain }) {
  tone(s, t, { f0: f * s.p, f1: f * 0.5 * s.p, gain: gain * s.k, attack: 0.003, decay })
  grain(s, t, { type: 'lowpass', freq: thud * s.hard, q: 0.7, gain: thudGain * s.k, attack: 0.002, dur: 0.05 })
}

// ---------------------------------------------------------------- surfaces

const RECIPES = {
  // packed earth: dull thud, soft grit, a short scuff on the toe
  dirt(s, heel, toe) {
    heelStrike(s, heel, { gain: 0.13, thudGain: 0.07 })
    clicks(s, heel + 0.004, { n: 4, spread: 0.05, lo: 2500, hi: 6000, gain: 0.03 * s.k })
    tone(s, toe, { f0: 160 * s.p, f1: 95 * s.p, gain: 0.05 * s.k, decay: 0.04 })
    grain(s, toe, { freq: 800 * s.p, q: 0.9, gain: 0.045 * s.k, attack: 0.004, dur: 0.05 })
  },

  // beach: a soft thud and the hiss of sand giving way
  sand(s, heel, toe) {
    heelStrike(s, heel, { f: 105, gain: 0.08, decay: 0.065, thud: 300, thudGain: 0.05 })
    grain(s, heel + 0.006, { freq: 2200 * s.p, q: 0.6, gain: 0.035 * s.k, attack: 0.012, dur: 0.12, sweep: 0.7 })
    clicks(s, heel + 0.01, { n: 10, spread: 0.1, lo: 1800, hi: 4500, gain: 0.03 * s.k, q: 1.5 })
    grain(s, toe, { freq: 1500 * s.p, q: 0.7, gain: 0.03 * s.k, attack: 0.01, dur: 0.08 })
  },

  // short grass: soft ground under a swish of blades
  grass(s, heel, toe) {
    heelStrike(s, heel, { f: 115, gain: 0.08, decay: 0.06, thud: 320, thudGain: 0.045 })
    grain(s, heel + 0.005, { freq: 3200 * s.p, q: 0.8, gain: 0.05 * s.k, attack: 0.02, dur: 0.12, sweep: 0.8 })
    grain(s, heel + 0.03 + s.rnd() * 0.04, { freq: 4500, q: 1.2, gain: 0.03 * s.k, attack: 0.008, dur: 0.06 })
    grain(s, toe, { freq: 2800 * s.p, q: 0.9, gain: 0.04 * s.k, attack: 0.015, dur: 0.09 })
  },

  // ferns and tall grass: leaves dragging past the legs, now and then a twig
  brush(s, heel, toe) {
    const r = s.rnd
    heelStrike(s, heel, { f: 110, gain: 0.06, decay: 0.055, thud: 300, thudGain: 0.035 })
    grain(s, heel, { freq: 2000 * s.p, q: 0.5, gain: 0.045 * s.k, attack: 0.04, dur: 0.24, sweep: 1.5 })
    const n = 5 + Math.floor(r() * 3)
    for (let i = 0; i < n; i++) {
      grain(s, heel + r() * 0.24, { freq: 1500 + r() * 3200, q: 0.7 + r() * 0.9, gain: (0.025 + r() * 0.035) * s.k, attack: 0.008 + r() * 0.02, dur: 0.04 + r() * 0.09 })
    }
    if (r() < 0.18) grain(s, heel + 0.03 + r() * 0.08, { freq: 2600 + r() * 1500, q: 4, gain: 0.12 * s.k, attack: 0.0008, dur: 0.008 })
    grain(s, toe, { freq: 2400 * s.p, q: 0.8, gain: 0.035 * s.k, attack: 0.02, dur: 0.12 })
  },

  // the road: a granular crunch of many tiny stones, on the heel and again on the toe
  gravel(s, heel, toe) {
    heelStrike(s, heel, { f: 120, gain: 0.07, decay: 0.055, thud: 450, thudGain: 0.04 })
    clicks(s, heel, { n: 12 + Math.floor(s.rnd() * 5), spread: 0.11, lo: 1800, hi: 6500, gain: 0.09 * s.k })
    grain(s, heel + 0.004, { freq: 2600, q: 0.6, gain: 0.02 * s.k, attack: 0.006, dur: 0.1 })
    clicks(s, toe, { n: 7 + Math.floor(s.rnd() * 3), spread: 0.07, lo: 2200, hi: 7000, gain: 0.07 * s.k })
  },

  // bare rock: hard, with a scrape of grit
  rock(s, heel, toe) {
    heelStrike(s, heel, { f: 145, gain: 0.07, decay: 0.04, thud: 700, thudGain: 0.05 })
    grain(s, heel, { type: 'highpass', freq: 2400 * s.hard, q: 0.7, gain: 0.06 * s.k, attack: 0.0008, dur: 0.012 })
    clicks(s, heel + 0.005, { n: 5, spread: 0.06, lo: 2500, hi: 7000, gain: 0.05 * s.k })
    grain(s, toe, { freq: 3400, q: 0.8, gain: 0.03 * s.k, attack: 0.004, dur: 0.05 })
  },

  // decks, bridges, towers: a hollow knock — the board rings at 180–300 Hz
  wood(s, heel, toe) {
    const f = (180 + s.rnd() * 120) * s.p
    tone(s, heel, { f0: 140 * s.p, f1: 85 * s.p, gain: 0.07 * s.k, attack: 0.003, decay: 0.045 })
    grain(s, heel, { freq: 2400, q: 1.2, gain: 0.05 * s.k * s.hard, attack: 0.0008, dur: 0.012 })
    tone(s, heel, { f0: f, f1: f * 0.97, gain: 0.15 * s.k, attack: 0.0015, decay: 0.16 })
    tone(s, heel, { f0: f * 2.32, gain: 0.06 * s.k, attack: 0.0015, decay: 0.07 })
    tone(s, heel, { f0: f * 3.9, gain: 0.025 * s.k, attack: 0.001, decay: 0.035 })
    grain(s, heel, { type: 'lowpass', freq: 600, q: 0.8, gain: 0.04 * s.k, attack: 0.002, dur: 0.05 })
    tone(s, toe, { f0: f * 1.22, f1: f * 1.18, gain: 0.07 * s.k, attack: 0.0015, decay: 0.08 })
    grain(s, toe, { freq: 3000, q: 1.2, gain: 0.03 * s.k, attack: 0.0008, dur: 0.008 })
  },

  // floors and the helipad: a sharp click and slap with a faint slab ring
  concrete(s, heel, toe) {
    heelStrike(s, heel, { f: 150, gain: 0.06, decay: 0.035, thud: 800, thudGain: 0.04 })
    grain(s, heel, { type: 'highpass', freq: 2500 * s.hard, q: 0.7, gain: 0.08 * s.k * s.hard, attack: 0.0008, dur: 0.012 })
    grain(s, heel + 0.001, { freq: 1400 * s.p, q: 1.4, gain: 0.07 * s.k, attack: 0.001, dur: 0.03 })
    tone(s, heel, { f0: 760 * s.p, gain: 0.015 * s.k, attack: 0.001, decay: 0.09 })
    tone(s, heel, { f0: 1900 * s.p, gain: 0.01 * s.k, attack: 0.001, decay: 0.06 })
    grain(s, toe, { type: 'highpass', freq: 3200, q: 0.7, gain: 0.05 * s.k, attack: 0.0008, dur: 0.008 })
    grain(s, toe + 0.004, { freq: 3500, q: 0.8, gain: 0.025 * s.k, attack: 0.004, dur: 0.04 })
  },

  // roofs, grates, painted steel: a click and an inharmonic plate ring
  metal(s, heel, toe) {
    const f = (420 + s.rnd() * 90) * s.p
    heelStrike(s, heel, { f: 140, gain: 0.05, decay: 0.045, thud: 700, thudGain: 0.035 })
    grain(s, heel, { type: 'highpass', freq: 3000, q: 0.7, gain: 0.07 * s.k * s.hard, attack: 0.0008, dur: 0.01 })
    const modes = [
      [1, 0.045, 0.28],
      [2.76, 0.03, 0.2],
      [5.4, 0.02, 0.14],
      [8.93, 0.012, 0.09],
    ]
    for (const [m, g, d] of modes) tone(s, heel, { f0: f * m, gain: g * s.k, attack: 0.001, decay: d })
    grain(s, toe, { type: 'highpass', freq: 3500, q: 0.7, gain: 0.04 * s.k, attack: 0.0008, dur: 0.008 })
    for (const [m, g, d] of modes.slice(0, 2)) tone(s, toe, { f0: f * m * 1.06, gain: g * 0.4 * s.k, attack: 0.001, decay: d * 0.6 })
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
