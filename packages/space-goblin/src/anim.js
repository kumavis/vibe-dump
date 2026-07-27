import * as THREE from 'three'
import { restPositions } from './rig.js'

// ---------------------------------------------------------------------------
// Animation
//
// There is no imported FBX here: every clip is a *procedural pose function*
// sampled onto keyframes and handed to three's AnimationMixer, so we get real
// clip blending and crossfades while authoring the motion as maths.
//
// Poses are quaternions, never euler triples. Euler order is a constant source
// of "why is the arm inside the ribcage" bugs, so `seq()` composes rotations
// about the *parent's fixed axes* in the order written: seq(Z(-1.3), X(0.4))
// reads as "drop the arm to the side, then swing it back", and means exactly
// that regardless of the bone.
// ---------------------------------------------------------------------------

const AXES = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}

const X = (a) => new THREE.Quaternion().setFromAxisAngle(AXES.x, a)
const Y = (a) => new THREE.Quaternion().setFromAxisAngle(AXES.y, a)
const Z = (a) => new THREE.Quaternion().setFromAxisAngle(AXES.z, a)

/** Compose rotations about fixed parent axes, applied left to right. */
function seq(...qs) {
  const out = new THREE.Quaternion()
  for (const q of qs) out.premultiply(q)
  return out
}

const REST = restPositions()

// ---- scalar curves --------------------------------------------------------

/** Clamped keyframe curve: stops are [t, value], smoothly interpolated. */
function k(stops, t) {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, v0] = stops[i - 1]
      const [t1, v1] = stops[i]
      const u = (t - t0) / (t1 - t0 || 1)
      return v0 + (v1 - v0) * (u * u * (3 - 2 * u))
    }
  }
  return stops[stops.length - 1][1]
}

/** Cyclic version: `t` wraps, and the last stop meets the first. */
function kc(stops, t) {
  const w = ((t % 1) + 1) % 1
  return k(stops, w)
}

const TAU = Math.PI * 2

// ---------------------------------------------------------------------------
// Pose vocabulary
// ---------------------------------------------------------------------------

/** Mirror a left-side pose entry onto the right (negate the Y and Z axes). */
function mirrorQ(q) {
  return new THREE.Quaternion(q.x, -q.y, -q.z, q.w)
}

/**
 * One leg. `ph` is the leg's own phase: 0 = foot strike, ~0.28 = toe-off,
 * ~0.5 = knee-to-chest recovery, ~0.85 = reaching for the next strike.
 */
function legPose(pose, side, ph, { stride = 1, lift = 1 } = {}) {
  const s = side === 'L' ? 1 : -1
  const thigh = kc(
    [
      [0, -0.62],
      [0.12, -0.3],
      [0.28, 0.46],
      [0.42, 0.3],
      [0.58, -0.42],
      [0.78, -0.86],
      [0.9, -0.76],
      [1, -0.62],
    ],
    ph,
  )
  const shin = kc(
    [
      [0, 0.34],
      [0.12, 0.6],
      [0.28, 0.26],
      [0.42, 1.9],
      [0.58, 1.62],
      [0.78, 0.6],
      [0.9, 0.24],
      [1, 0.34],
    ],
    ph,
  )
  const ankle = kc(
    [
      [0, -0.2],
      [0.12, 0.1],
      [0.28, -0.62],
      [0.42, -0.3],
      [0.58, 0.22],
      [0.78, 0.2],
      [0.9, -0.02],
      [1, -0.2],
    ],
    ph,
  )
  const toe = kc(
    [
      [0, 0.12],
      [0.14, 0.14],
      [0.28, 0.62],
      [0.4, 0.1],
      [0.7, -0.1],
      [1, 0.12],
    ],
    ph,
  )
  // A little abduction so the legs clear each other at the crossover.
  const splay = 0.07 + 0.05 * Math.sin(ph * TAU)

  pose[`thigh${side}`] = seq(Z(-s * splay), X(thigh * stride))
  pose[`shin${side}`] = X(shin * lift)
  pose[`foot${side}`] = X(ankle)
  pose[`toe${side}`] = X(toe)
}

/** Curl the fingers into a fist / around a grip. `g` 0 = open, 1 = closed. */
function handPose(pose, side, g, { thumb = g, spread = 0 } = {}) {
  const s = side === 'L' ? 1 : -1
  const digits = [
    ['index', 1.0, 0.02],
    ['mid', 1.05, 0],
    ['ring', 1.0, -0.03],
  ]
  for (const [name, scale, off] of digits) {
    pose[`${name}${side}0`] = seq(Y(-s * (off + spread)), Z(-s * 1.05 * g * scale))
    pose[`${name}${side}1`] = Z(-s * 1.25 * g * scale)
    pose[`${name}${side}2`] = Z(-s * 0.9 * g * scale)
  }
  pose[`thumb${side}0`] = seq(Y(-s * 0.55), Z(-s * (0.35 + 0.55 * thumb)))
  pose[`thumb${side}1`] = Z(-s * 0.75 * thumb)
  pose[`thumb${side}2`] = Z(-s * 0.6 * thumb)
}

/**
 * One arm, in shoulder-polar terms:
 *   down   — 0 is straight out sideways (bind pose), 1.35 hangs at the side
 *   swing  — positive drives the elbow backwards
 *   out    — positive pushes the arm away from the ribs
 *   bend   — elbow flexion
 */
function armPose(pose, side, { down = 1.3, swing = 0, out = 0, bend = 0.3, twist = 0, wrist = null, clav = 0 }) {
  const s = side === 'L' ? 1 : -1
  pose[`clavicle${side}`] = seq(Z(s * clav * 0.6), Y(-s * clav * 0.5))
  pose[`upperarm${side}`] = seq(Z(-s * down), Y(-s * out), X(swing), Y(-s * twist))
  pose[`forearm${side}`] = Y(-s * bend)
  pose[`hand${side}`] = wrist || new THREE.Quaternion()
}

/** Spine lean + counter-rotation, distributed over the three spine bones. */
function spinePose(pose, { lean = 0, twist = 0, side = 0, crunch = 0 }) {
  const w = [0.28, 0.32, 0.4]
  const names = ['spine01', 'spine02', 'chest']
  for (let i = 0; i < 3; i++) {
    pose[names[i]] = seq(X(lean * w[i] + crunch * w[i]), Y(twist * w[i]), Z(side * w[i]))
  }
}

function headPose(pose, { pitch = 0, yaw = 0, roll = 0, jaw = 0, neck = 0.5 }) {
  pose.neck = seq(X(pitch * neck), Y(yaw * 0.45), Z(roll * 0.4))
  pose.head = seq(X(pitch * (1 - neck)), Y(yaw * 0.55), Z(roll * 0.6))
  pose.jaw = X(-jaw * 0.75)
}

// ---------------------------------------------------------------------------
// Clips
// ---------------------------------------------------------------------------

/** The sprint. One cycle = two strides; left foot strikes at t = 0. */
export function runPose(t) {
  const pose = {}
  const p = ((t % 1) + 1) % 1

  legPose(pose, 'L', p)
  legPose(pose, 'R', p + 0.5)

  // Vertical bob: lowest just after each foot strike, highest mid-flight. Kept
  // shallow on purpose — any deeper and the planted foot sinks through the
  // ground at mid-stance, which no amount of ankle work hides.
  const bob = -0.02 - 0.016 * Math.cos(2 * TAU * (p - 0.12))
  // The pelvis also surges forward/back a hair each stride.
  const surge = 0.012 * Math.sin(2 * TAU * (p - 0.05))
  pose.hipsPos = new THREE.Vector3(0.008 * Math.sin(TAU * p), bob, surge)

  // Pelvis: yaws with the forward leg, drops on the swing side.
  pose.hips = seq(X(0.14), Y(-0.2 * Math.cos(TAU * p)), Z(0.1 * Math.cos(TAU * p)))

  // Chest counter-rotates against the pelvis — the engine of the arm swing.
  spinePose(pose, {
    lean: 0.34,
    twist: 0.26 * Math.cos(TAU * p),
    side: -0.05 * Math.cos(TAU * p),
    crunch: 0.03 * Math.cos(2 * TAU * p),
  })

  // Head stays level and locked forward while everything under it thrashes.
  headPose(pose, {
    pitch: -0.42 + 0.05 * Math.cos(2 * TAU * (p - 0.1)),
    yaw: -0.1 * Math.cos(TAU * p),
    roll: 0.06 * Math.cos(TAU * p),
    jaw: 0.12 + 0.08 * Math.max(0, Math.cos(2 * TAU * p)),
    neck: 0.45,
  })

  // Arms drive opposite the legs. The right arm carries the cleaver, so it
  // swings tighter and higher than the left.
  const swingL = 0.95 * Math.cos(TAU * p)
  const swingR = 0.95 * Math.cos(TAU * (p + 0.5))
  armPose(pose, 'L', {
    down: 1.24,
    swing: swingL,
    out: 0.22 + 0.07 * Math.cos(TAU * p),
    bend: 1.12 + 0.34 * Math.max(0, -swingL),
    clav: 0.1 * Math.cos(TAU * p),
  })
  armPose(pose, 'R', {
    down: 1.16,
    swing: swingR * 0.8 - 0.1,
    out: 0.28 + 0.06 * Math.cos(TAU * (p + 0.5)),
    bend: 0.92 + 0.26 * Math.max(0, -swingR),
    twist: 0.25,
    clav: 0.1 * Math.cos(TAU * (p + 0.5)),
  })
  handPose(pose, 'L', 0.78 + 0.12 * Math.cos(TAU * p))
  handPose(pose, 'R', 1)

  return pose
}

/** Panting, weight-shifting guard stance. */
export function idlePose(t) {
  const pose = {}
  // Whole-number frequencies so the baked clip meets itself at the loop point.
  const b = Math.sin(t * TAU * 3) // breath
  const s = Math.sin(t * TAU) // slow weight shift

  pose.thighL = seq(Z(-0.1), X(-0.34 + 0.03 * s))
  pose.shinL = X(0.5 - 0.04 * s)
  pose.footL = X(-0.14)
  pose.toeL = X(0.1)
  pose.thighR = seq(Z(0.16), Y(-0.3), X(0.12 - 0.03 * s))
  pose.shinR = X(0.34 + 0.05 * s)
  pose.footR = X(-0.06)
  pose.toeR = X(0.16)

  pose.hipsPos = new THREE.Vector3(0.02 * s, -0.055 + 0.008 * b, -0.01)
  pose.hips = seq(X(0.1), Y(0.12), Z(0.05 * s))
  spinePose(pose, { lean: 0.3 + 0.03 * b, twist: -0.18, side: -0.04 * s })
  headPose(pose, {
    pitch: -0.34 - 0.05 * b,
    yaw: 0.16 + 0.1 * Math.sin(t * TAU * 2),
    roll: 0.04 * s,
    jaw: 0.14 + 0.12 * Math.max(0, b),
  })

  armPose(pose, 'L', { down: 1.22, swing: -0.28, out: 0.3, bend: 1.35 + 0.06 * b, clav: 0.06 })
  armPose(pose, 'R', { down: 1.0, swing: -0.42, out: 0.42, bend: 1.5 + 0.05 * b, twist: 0.3, clav: 0.08 })
  handPose(pose, 'L', 0.55 + 0.08 * b)
  handPose(pose, 'R', 1)
  return pose
}

/**
 * The fight: a three-beat melee burst danced over one plant.
 *   0.00-0.22  skid to a plant, wind the cleaver up over the shoulder
 *   0.22-0.42  overhead chop, hips and spine snapping through it
 *   0.42-0.62  recover, coil for the backhand
 *   0.62-0.80  backhand slash across the body, weight onto the back foot
 *   0.80-1.00  roar into a lunging thrust, then settle back to run posture
 */
export function comboPose(t) {
  const pose = {}
  const p = THREE.MathUtils.clamp(t, 0, 1)

  // ---- lower body: plant, twist, lunge ----
  const plant = k(
    [
      [0, 0.5],
      [0.18, 1],
      [0.8, 1],
      [1, 0.35],
    ],
    p,
  )
  const lunge = k(
    [
      [0.78, 0],
      [0.88, 1],
      [1, 0.5],
    ],
    p,
  )
  const crouch = k(
    [
      [0, 0.2],
      [0.2, 1],
      [0.38, 0.35],
      [0.6, 0.8],
      [0.72, 0.3],
      [0.88, 0.9],
      [1, 0.4],
    ],
    p,
  )

  pose.thighL = seq(Z(-0.16), X(-0.5 - 0.35 * plant - 0.45 * lunge))
  pose.shinL = X(0.62 + 0.5 * crouch - 0.3 * lunge)
  pose.footL = X(-0.16 - 0.2 * crouch + 0.25 * lunge)
  pose.toeL = X(0.14 + 0.3 * lunge)

  pose.thighR = seq(Z(0.2), Y(-0.42), X(0.34 + 0.25 * plant))
  pose.shinR = X(0.5 + 0.55 * crouch)
  pose.footR = X(-0.1 - 0.35 * crouch)
  pose.toeR = X(0.2 + 0.5 * crouch)

  pose.hipsPos = new THREE.Vector3(
    0.03 * k([[0, 0], [0.3, -1], [0.7, 1], [1, 0]], p),
    -0.06 - 0.075 * crouch,
    0.05 * lunge - 0.02,
  )

  // Torso twist is the whole story: wind up one way, snap through the other.
  const twist = k(
    [
      [0, 0],
      [0.2, 0.72],
      [0.4, -0.5],
      [0.58, -0.62],
      [0.74, 0.55],
      [0.86, 0.1],
      [1, 0],
    ],
    p,
  )
  const chop = k(
    [
      [0, 0],
      [0.2, -0.42],
      [0.4, 0.62],
      [0.56, 0.2],
      [0.72, 0.3],
      [0.86, -0.1],
      [1, 0.1],
    ],
    p,
  )
  pose.hips = seq(X(0.12 + 0.1 * lunge), Y(twist * 0.42), Z(0.06 * twist))
  spinePose(pose, {
    lean: 0.26 + chop * 0.5,
    twist: -twist * 0.75,
    side: twist * 0.12,
    crunch: 0.12 * crouch,
  })

  // ---- head: eyes on the target through the whole combo, roar at the end ----
  const roar = k(
    [
      [0.76, 0],
      [0.86, 1],
      [0.96, 0.8],
      [1, 0.2],
    ],
    p,
  )
  headPose(pose, {
    pitch: -0.3 - chop * 0.35 + roar * 0.25,
    yaw: twist * 0.45,
    roll: -twist * 0.18,
    jaw: 0.16 + roar * 1.0 + 0.2 * Math.max(0, chop),
    neck: 0.4,
  })

  // ---- weapon arm ----
  // Wind the cleaver up behind the right shoulder, then throw it down and
  // across. `armSwing` runs the elbow through the arc; `bend` opens on impact.
  const rDown = k(
    [
      [0, 1.0],
      [0.2, 0.05],
      [0.36, 1.5],
      [0.5, 0.85],
      [0.62, 0.35],
      [0.76, 1.35],
      [0.88, 0.75],
      [1, 1.0],
    ],
    p,
  )
  const rSwing = k(
    [
      [0, -0.3],
      [0.2, 1.15],
      [0.36, -1.15],
      [0.5, -0.55],
      [0.62, 0.95],
      [0.76, -1.05],
      [0.88, -0.85],
      [1, -0.3],
    ],
    p,
  )
  const rOut = k(
    [
      [0, 0.35],
      [0.2, 0.5],
      [0.36, 0.12],
      [0.62, 0.62],
      [0.76, 0.05],
      [1, 0.35],
    ],
    p,
  )
  const rBend = k(
    [
      [0, 1.4],
      [0.2, 2.1],
      [0.36, 0.45],
      [0.5, 1.1],
      [0.62, 1.9],
      [0.76, 0.5],
      [0.88, 1.3],
      [1, 1.4],
    ],
    p,
  )
  armPose(pose, 'R', {
    down: rDown,
    swing: rSwing,
    out: rOut,
    bend: rBend,
    twist: 0.3 + 0.35 * chop,
    clav: 0.18 * (1 - rDown),
  })

  // ---- shield arm: braces across the body, punches out on the roar ----
  const lDown = k(
    [
      [0, 1.15],
      [0.24, 0.72],
      [0.42, 0.95],
      [0.62, 0.6],
      [0.84, 0.5],
      [1, 1.15],
    ],
    p,
  )
  armPose(pose, 'L', {
    down: lDown,
    swing: k([[0, -0.3], [0.24, -0.85], [0.5, -0.5], [0.72, -1.0], [0.88, -1.25], [1, -0.3]], p),
    out: k([[0, 0.3], [0.3, 0.15], [0.7, 0.35], [0.88, 0.1], [1, 0.3]], p),
    bend: k([[0, 1.4], [0.24, 2.0], [0.5, 1.6], [0.78, 1.9], [0.9, 0.8], [1, 1.4]], p),
    clav: 0.12,
  })

  handPose(pose, 'R', 1)
  handPose(pose, 'L', k([[0, 0.7], [0.5, 0.9], [0.84, 0.35], [1, 0.7]], p), { spread: 0.25 })
  return pose
}

/** A short skid used to blend out of the run and into the combo. */
export function skidPose(t) {
  const pose = comboPose(0)
  const p = THREE.MathUtils.clamp(t, 0, 1)
  pose.hipsPos = new THREE.Vector3(0, -0.05 - 0.03 * p, 0)
  return pose
}

// ---------------------------------------------------------------------------
// Baking
// ---------------------------------------------------------------------------

/**
 * Sample a pose function onto an AnimationClip.
 *
 * @param {string} name
 * @param {number} duration seconds
 * @param {(t:number) => object} poseFn  receives normalised time 0..1
 * @param {object} [o]
 * @param {number} [o.fps=30]
 * @param {boolean} [o.loop=false]  duplicate the first frame at the end
 */
export function bakeClip(name, duration, poseFn, { fps = 30, loop = false } = {}) {
  const frames = Math.max(2, Math.round(duration * fps))
  const times = []
  /** @type {Record<string, number[]>} */
  const quatTracks = {}
  const posTracks = {}

  for (let i = 0; i <= frames; i++) {
    const t = i / frames
    times.push(t * duration)
    const pose = poseFn(loop ? (i === frames ? 0 : t) : t)
    for (const [bone, value] of Object.entries(pose)) {
      if (bone === 'hipsPos') {
        const rest = REST.hips
        const arr = (posTracks.hips ||= [])
        arr.push(rest.x + value.x, rest.y + value.y, rest.z + value.z)
        continue
      }
      const arr = (quatTracks[bone] ||= [])
      arr.push(value.x, value.y, value.z, value.w)
    }
  }

  const tracks = []
  for (const [bone, values] of Object.entries(quatTracks)) {
    if (values.length !== (frames + 1) * 4) {
      throw new Error(`space-goblin: clip "${name}" pose function set "${bone}" on only some frames`)
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(`${bone}.quaternion`, times, values))
  }
  for (const [bone, values] of Object.entries(posTracks)) {
    tracks.push(new THREE.VectorKeyframeTrack(`${bone}.position`, times, values))
  }
  return new THREE.AnimationClip(name, duration, tracks)
}

/** Every clip the show uses. */
export function buildClips({ runDuration = 0.56, comboDuration = 2.1 } = {}) {
  return {
    run: bakeClip('run', runDuration, runPose, { fps: 60, loop: true }),
    idle: bakeClip('idle', 4.2, idlePose, { fps: 24, loop: true }),
    combo: bakeClip('combo', comboDuration, comboPose, { fps: 60 }),
    skid: bakeClip('skid', 0.3, skidPose, { fps: 30 }),
  }
}

export { seq, X, Y, Z, k, kc, legPose, armPose, handPose, spinePose, headPose, mirrorQ }
