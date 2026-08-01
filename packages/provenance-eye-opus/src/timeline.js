// ---------------------------------------------------------------------------
// The beat sheet.
//
// Two cycles — the golden one and the other one — expressed as a list of beats,
// each a duration plus a function from "progress through this beat" to the
// handful of numbers the scene actually cares about:
//
//   lid    0 = wide open, 1 = shut (drives both lids)
//   rad    strength of the beams / halo / backlight
//   petal  how far the sun corona has unfurled
//   alien  crossfade of iris, sclera and light colour
//   reach  how far the tentacles have grown
//   wink   upper-lid-only closure. With a single eye there is no other eye to
//          stay open, so the asymmetry has to live inside this one: the upper
//          lid travels the whole way, the lower barely moves, and the head
//          tips. That is the difference between a wink and a blink.
//
// Adjacent beats are written to agree at their shared boundary, so the whole
// loop is continuous without any easing machinery between beats.
//
// Everything is sampled from wall-clock elapsed time, never from a frame
// counter. On a software rasteriser this app may only draw a couple of frames
// in its first second; sampling wall-clock means the frame the gallery
// screenshots is the one the timeline says it should be, whatever the frame
// rate.
// ---------------------------------------------------------------------------

const sat = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
const es = (x) => {
  const k = sat(x)
  return k * k * (3 - 2 * k)
}

// Where the clock starts, in seconds into cycle 0: parked on the hero pose —
// corona fully out, eye half-lidded inside its own light. main.js holds the
// narrative clock here until the machine proves it can animate, so this is
// both the opening frame a visitor sees and the frame the gallery photographs.
export const START_OFFSET = 6.45

const NORMAL = [
  ['watching', 4.0, () => ({ lid: 0, rad: 0, petal: 0, blink: true })],
  ['closing', 0.6, (k) => ({ lid: es(k), rad: es(k) * 0.8, petal: es(sat((k - 0.35) / 0.65)) * 0.4 })],
  ['flare', 0.55, (k) => ({ lid: 1, rad: 0.8 + 0.2 * es(k), petal: 0.4 + 0.6 * es(k) })],
  [
    'radiant',
    4.2,
    (k) => ({
      // The eye opens back INTO its own light. A shut lid with a seam of glare
      // is a monstrance; a half-lidded eye burning at the centre of a gold
      // corona is the emblem, and it is the pose this whole app is built to be
      // photographed in.
      lid: 1 - 0.58 * es(sat(k * 2.4)),
      rad: 1 - 0.1 * es(sat((k - 0.6) / 0.4)),
      petal: 1,
    }),
  ],
  ['fading', 1.2, (k) => ({ lid: 0.42 * (1 - es(k)), rad: 0.9 * (1 - es(k)), petal: 1 - es(sat(k * 1.15)) })],
]

const ALIEN = [
  ['watching', 3.4, () => ({ lid: 0, rad: 0, petal: 0, blink: true })],
  ['closing', 0.5, (k) => ({ lid: es(k), rad: es(k) * 0.5 })],
  [
    'something else',
    1.7,
    (k) => ({
      // The lids crack while the tentacles are still growing, so the reveal is
      // one continuous event rather than a shut lens followed by an unrelated
      // opening.
      lid: 1 - 0.45 * es(sat((k - 0.45) / 0.55)),
      rad: 0.5 + 0.25 * es(k),
      alien: es(sat(k * 1.5)),
      reach: es(sat((k - 0.12) / 0.88)),
    }),
  ],
  ['not ours', 0.7, (k) => ({ lid: 0.55 * (1 - es(k)), rad: 0.75, alien: 1, reach: 1 })],
  ['not ours', 1.5, (k) => ({ lid: 0, rad: 0.75 - 0.25 * es(sat(k * 1.2)), alien: 1, reach: 1, blink: true })],
  [
    'it winks',
    0.85,
    (k) => ({
      // Snap shut, hang there a beat, drift back open. Fast down and slow up is
      // the other half of the cue; `wink` closes only the upper lid.
      lid: 0,
      rad: 0.5,
      alien: 1,
      reach: 1,
      wink: k < 0.28 ? es(k / 0.28) : 1 - es(sat((k - 0.46) / 0.54)),
    }),
  ],
  ['it winks', 0.9, () => ({ lid: 0, rad: 0.5, alien: 1, reach: 1, blink: true })],
  ['receding', 0.55, (k) => ({ lid: es(k), rad: 0.5, alien: 1, reach: 1 })],
  ['receding', 1.6, (k) => ({ lid: 1, rad: 0.5 * (1 - es(k)), alien: 1 - es(sat(k * 1.2)), reach: 1 - es(sat(k * 1.1)) })],
  ['opening', 0.7, (k) => ({ lid: 1 - es(k), rad: 0, petal: 0 })],
]

const totalOf = (beats) => beats.reduce((a, b) => a + b[1], 0)
const TOTAL = new Map([
  [NORMAL, totalOf(NORMAL)],
  [ALIEN, totalOf(ALIEN)],
])

// Seconds into a cycle at which the named beat begins.
const cueAt = (beats, name) => {
  let acc = 0
  for (const [label, dur] of beats) {
    if (label === name) return acc
    acc += dur
  }
  return 0
}

// The three states a viewer can steer between, in ring order, and where each
// one lives in the beat sheet. Every cue lands on a beat that opens with the
// lids already shut or already open — never mid-motion — so a jump can hide
// behind a blink without anything snapping.
export const PHASES = ['idle', 'sun', 'monster']
const CUES = {
  idle: [NORMAL, cueAt(NORMAL, 'watching')],
  sun: [NORMAL, cueAt(NORMAL, 'flare')],
  monster: [ALIEN, cueAt(ALIEN, 'something else')],
}

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Spontaneous blinks during the calm beats. Without them the eye only ever
// moves on the beat, which reads as a machine rather than as something alive.
function idleBlink(t) {
  const PERIOD = 3.3
  const n = Math.floor(t / PERIOD)
  // A cheap integer hash, so the blink schedule is identical in every run and
  // therefore identical in every screenshot.
  let h = (n * 374761393 + 668265263) >>> 0
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0
  const at = n * PERIOD + ((h >>> 8) / 16777216) * (PERIOD - 0.9)
  const d = t - at
  if (d < 0 || d > 0.2) return 0
  const k = d / 0.2
  return k < 0.4 ? es(k / 0.4) : 1 - es((k - 0.4) / 0.6)
}

export function createTimeline() {
  const rand = rng(0x6d2b79f5)
  // Two golden cycles, then the other one, so a visitor who stays twenty
  // seconds is guaranteed the tentacles rather than merely likely to get them.
  // After that it is a coin weighted toward gold, never alien twice running,
  // because the alien is only unsettling while it is rare.
  const kinds = [NORMAL, NORMAL, ALIEN]
  const kindAt = (i) => {
    while (kinds.length <= i) {
      const prev = kinds[kinds.length - 1]
      kinds.push(prev === ALIEN ? NORMAL : rand() < 0.38 ? ALIEN : NORMAL)
    }
    return kinds[i]
  }

  let index = 0
  let start = -START_OFFSET

  const out = {
    lid: 0,
    rad: 0,
    petal: 0,
    alien: 0,
    reach: 0,
    wink: 0,
  }

  const emit = (v, t) => {
    out.lid = v.lid ?? 0
    out.rad = v.rad ?? 0
    out.petal = v.petal ?? 0
    out.alien = v.alien ?? 0
    out.reach = v.reach ?? 0
    out.wink = v.wink ?? 0
    if (v.blink) out.lid = Math.max(out.lid, idleBlink(t))
    return out
  }

  return {
    // Drop the playhead onto a named phase. The cycle currently in progress is
    // rewritten to whichever kind that phase belongs to, so the loop carries on
    // normally from there rather than snapping back when the cycle ends.
    jumpTo(phase, t) {
      const cue = CUES[phase]
      if (!cue) return
      kinds[index] = cue[0]
      start = t - cue[1]
    },

    sample(t) {
      // Walk forward to the cycle containing t. Bounded so a tab that slept
      // for an hour cannot spin here.
      for (let guard = 0; guard < 4096; guard++) {
        const beats = kindAt(index)
        const total = TOTAL.get(beats)
        const local = t - start
        if (local < total) {
          let acc = 0
          for (const [, dur, fn] of beats) {
            if (local < acc + dur) return emit(fn(sat((local - acc) / dur)), t)
            acc += dur
          }
          return emit(beats[beats.length - 1][2](1), t)
        }
        start += total
        index++
      }
      return out
    },
  }
}
