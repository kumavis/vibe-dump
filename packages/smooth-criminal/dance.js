import * as THREE from 'three'
import { FOOT_DROP, FOOT_TIP, ANKLE_HEIGHT } from './figure.js'

const { lerp, degToRad: rad, radToDeg: deg } = THREE.MathUtils

const HIP_Y = 0.6
const THIGH = 0.28
const SHIN = 0.26

// ---------------------------------------------------------------------------
// Curve helpers. Every move is written as a pure function of its own local
// time u ∈ [0,1], so these four do all the timing work:
//   ramp(u,a,b)  0 before a, smoothly 1 after b   — a gesture starting
//   bump(u,a,b)  0 → 1 → 0 across [a,b]           — a gesture that comes back
//   hold(a,b,c,d) ramp up then ramp back down     — a gesture that is held
// ---------------------------------------------------------------------------
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
const smooth = (x) => {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}
const ramp = (u, a, b) => smooth((u - a) / (b - a))
const acos = (x) => Math.acos(x < -1 ? -1 : x > 1 ? 1 : x)
const bump = (u, a, b) => Math.sin(Math.PI * clamp01((u - a) / (b - a)))
const hold = (u, a, b, c, d) => ramp(u, a, b) * (1 - ramp(u, c, d))

// How far the body has to rise so a plantar-flexed foot stays on the stage
// instead of driving its toe through it.
const toeLift = (angleDeg) => {
  const t = rad(angleDeg)
  return FOOT_DROP * Math.cos(t) + FOOT_TIP * Math.sin(t) - FOOT_DROP
}

// ---------------------------------------------------------------------------
// Two-bone leg IK.
//
// Nearly every pose here is defined by where a FOOT is, not by what the knee
// is doing — a dip in the groove, a stride, a foot rolling onto its toe. So
// solve the leg backwards: given the ankle's target (relative to the figure,
// `footZ` ahead of the hips, `lift` above the stage) work out the hip pitch and
// knee bend that put it there, then set the ankle so the sole stays flat.
//
// The flat-sole trick falls out of the chain: the three X rotations are
// -pitch, +knee and +ankle, so the foot is level exactly when
// ankle = pitch − knee. `opts.ankle` then adds plantar flexion on top.
// ---------------------------------------------------------------------------
function plantLeg(p, key, footZ, opts = {}) {
  const lift = opts.lift ?? 0
  const fy = HIP_Y + p.rootY - ANKLE_HEIGHT - lift // hip height above the ankle
  const d = Math.min(Math.max(Math.hypot(footZ, fy), 0.08), THIGH + SHIN - 0.0006)
  const theta = deg(Math.atan2(footZ, fy))
  const alpha = deg(acos((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d)))
  const gamma = deg(acos((THIGH * THIGH + SHIN * SHIN - d * d) / (2 * THIGH * SHIN)))
  const pitch = theta + alpha
  const knee = 180 - gamma
  p[`leg${key}Pitch`] = pitch
  p[`knee${key}`] = knee
  p[`ankle${key}`] = pitch - knee + (opts.ankle ?? 0)
  p[`leg${key}Spread`] = opts.spread ?? 2.5
}

// A two-feet-planted stance with an optional stagger, used by the moves that
// stay put.
function stance(p, spread = 0.02, opts = {}) {
  plantLeg(p, 'L', spread, opts)
  plantLeg(p, 'R', -spread, opts)
}

// The idle pulse everything else sits on top of: a dip on the beat, weight
// rocking side to side, shoulders counter-rotating against the hips.
function groove(p, u, beats, amt = 1) {
  const b = u * beats * Math.PI * 2
  p.rootY -= 0.011 * amt * (0.5 - 0.5 * Math.cos(b))
  p.hipsRoll += 5 * amt * Math.sin(b)
  p.hipsYaw += 3 * amt * Math.sin(b)
  p.spineRoll -= 3.5 * amt * Math.sin(b)
  p.spineYaw -= 2.5 * amt * Math.sin(b)
  p.neckRoll += 2 * amt * Math.sin(b)
}

// ---------------------------------------------------------------------------
// The routine. Six moves, looped: the figure works its way to the back of the
// stage on the moonwalk and spins back to the middle, so the loop closes
// where it opened.
// ---------------------------------------------------------------------------
const BACK_Z = -0.8

// Arm poses that have to hit a specific point in space — the gloved hand on the
// hat brim, both hands wrapped over the chest — were solved against the rig
// rather than eyeballed, since the shoulder's three channels interact. Each is
// [spread, twist, pitch, elbow]; `reachArm` blends the rest pose into one.
const ARM_REST = [10, -8, -6, 14]
const ARM_BRIM = [103, 72, 29, 117] // gloved hand on the right side of the brim
const ARM_CHEST_R = [51, -28, 79, 127] // wrapped across the chest for a turn
const ARM_CHEST_L = [79, -14, 82, 129]

function reachArm(p, key, target, k) {
  p[`arm${key}Spread`] = lerp(ARM_REST[0], target[0], k)
  p[`arm${key}Twist`] = lerp(ARM_REST[1], target[1], k)
  p[`arm${key}Pitch`] = lerp(ARM_REST[2], target[2], k)
  p[`elbow${key}`] = lerp(ARM_REST[3], target[3], k)
}

// 1 — HAT TILT. Feet planted, grooving; the gloved hand comes up and pulls the
// brim down over the eyes.
function hatTilt(u, p) {
  const reach = hold(u, 0.08, 0.32, 0.76, 0.96)
  groove(p, u, 4)
  p.rootY -= 0.01 * reach

  reachArm(p, 'R', ARM_BRIM, reach)

  p.armLSpread = 10 + 5 * reach
  p.armLPitch = -6 + 9 * Math.sin(u * Math.PI * 4)
  p.elbowL = 14 + 12 * reach

  p.hatTilt = 15 * reach
  p.hatRoll = -7 * reach
  p.neckPitch = 7 * reach
  p.neckYaw = -11 * reach
  p.neckRoll -= 5 * reach

  stance(p, 0.03)
}

// 2 — TOE SPIN. Drop into the prep, rise onto both toes, whip round once, snap
// out of it with the arms flung open.
function toeSpin(u, p) {
  const prep = bump(u, 0, 0.22)
  const spin = ramp(u, 0.16, 0.8)
  const toe = hold(u, 0.1, 0.28, 0.82, 0.96)
  const land = bump(u, 0.78, 1)
  const tuck = bump(u, 0.14, 0.84)

  p.rootYaw = 360 * spin
  const ankle = 54 * toe
  const lift = toeLift(ankle)
  p.rootY = lift - 0.045 * prep - 0.03 * land

  p.spineRoll = -4 * tuck
  p.neckYaw = -14 * tuck
  p.hipsYaw = 6 * tuck

  // Arms wrap in tight through the turn, then fly open on the landing.
  const open = Math.max(prep, land)
  reachArm(p, 'L', ARM_CHEST_L, tuck)
  reachArm(p, 'R', ARM_CHEST_R, tuck)
  p.armLSpread += 42 * open
  p.armRSpread += 46 * open
  p.armLPitch -= 14 * open
  p.armRPitch -= 16 * open
  p.elbowL -= 6 * open
  p.elbowR -= 6 * open

  stance(p, 0.012, { ankle, lift })
}

// 3 — THE LEAN. The whole body pivots forward about the floor line while the
// soles stay flat on the stage — `p.lean` drives the rig's floor-level pivot
// and the ankles counter-rotate by exactly the same angle.
function theLean(u, p) {
  const wind = bump(u, 0, 0.16)
  const tilt = 34 * hold(u, 0.14, 0.44, 0.7, 0.92)
  // A held lean is never quite still.
  const tremble = 0.55 * Math.sin(u * 52) * hold(u, 0.4, 0.5, 0.68, 0.78)
  p.lean = tilt + tremble

  // The body swings up off the ankle joint as it goes over; drop it back down
  // so the soles keep contact.
  p.rootY = ANKLE_HEIGHT * (1 - Math.cos(rad(p.lean))) - 0.035 * wind
  const go = tilt / 34

  // Arms locked down and slightly back, chin up, hat on tight.
  p.armLPitch = -6 - 16 * go
  p.armRPitch = -6 - 18 * go
  p.armLSpread = 10 + 6 * go
  p.armRSpread = 10 + 7 * go
  p.elbowL = 14 - 8 * go
  p.elbowR = 14 - 9 * go
  p.spinePitch = -3 * go
  p.neckPitch = -7 * go
  p.hatTilt = -4 * go

  stance(p, 0.014, { ankle: -p.lean })
}

// 4 — MOONWALK. Four steps backwards. Each step the flat foot slides back past
// the other, which is up on its toe and stationary on the stage; then they
// swap. The stride is tuned so the toe foot really does hold still: it travels
// forward relative to the body by exactly the distance the body travels back.
const STEPS = 4
const STRIDE = 0.2 // = |BACK_Z| / STEPS, which is what keeps the toe foot planted

function moonwalk(u, p) {
  p.rootZ = BACK_Z * ramp(u, 0.06, 0.94)

  const s = clamp01((u - 0.05) / 0.88) * STEPS
  const i = Math.min(Math.floor(s), STEPS - 1)
  const f = s - i
  const slide = i % 2 === 0 ? 'L' : 'R'
  const toe = slide === 'L' ? 'R' : 'L'

  const front = STRIDE / 2
  const back = -STRIDE / 2
  // Weight settles onto the sliding foot at the end of each step.
  const drop = 0.016 * bump(f, 0, 1)
  p.rootY = -0.012 - drop

  // Sliding foot: flat, straight back.
  plantLeg(p, slide, lerp(front, back, ramp(f, 0.04, 0.86)), { spread: 3 })
  // Toe foot: snaps up onto the toe, rolls flat again as it ends up in front.
  const flex = 46 * hold(f, 0, 0.14, 0.6, 0.96)
  plantLeg(p, toe, lerp(back, front, f), { ankle: flex, lift: toeLift(flex), spread: 3 })

  // Hips and shoulders counter-rotate; arms swing against the legs.
  const sway = Math.sin((i + f) * Math.PI)
  const side = slide === 'L' ? 1 : -1
  p.hipsRoll = 5 * side * sway
  p.hipsYaw = -7 * side * sway
  p.spineYaw = 9 * side * sway
  p.spineRoll = -3 * side * sway
  p.neckYaw = -4 * side * sway
  p.armLPitch = -4 + 26 * side * sway
  p.armRPitch = -4 - 26 * side * sway
  p.elbowL = 20 + 10 * side * sway
  p.elbowR = 20 - 10 * side * sway
  p.armLSpread = 11
  p.armRSpread = 11
}

// 5 — KICK & POINT. Plant on the left, snap the right leg out and throw the
// gloved hand up on the same beat.
function kickPoint(u, p) {
  p.rootZ = BACK_Z
  const wind = bump(u, 0, 0.36)
  const kick = hold(u, 0.3, 0.46, 0.7, 0.92)

  p.rootY = -0.03 * wind - 0.012 * kick
  p.rootX = 0.035 * kick // weight over the standing leg
  p.hipsRoll = -9 * kick
  p.hipsYaw = 10 * kick
  p.spineYaw = -8 * kick
  p.spinePitch = -9 * kick
  p.neckPitch = -12 * kick
  p.neckYaw = 6 * kick
  p.hatTilt = -8 * kick

  // Gloved hand punches up and out; the other arm counterweights, low and back.
  p.armRSpread = 12 + 138 * kick
  p.armRPitch = -4 + 20 * kick
  p.armRTwist = -8 - 20 * kick
  p.elbowR = 12 - 8 * kick
  p.armLSpread = 10 + 18 * kick
  p.armLPitch = -6 - 34 * kick
  p.elbowL = 14 + 16 * kick

  plantLeg(p, 'L', 0.03 - 0.05 * kick, { spread: 4 })
  // Free leg — no ground contact, so it is posed directly.
  p.legRPitch = 6 * wind + 74 * kick
  p.legRSpread = 3 + 9 * kick
  p.kneeR = 26 * wind + 8 * kick
  p.ankleR = 4 + 26 * kick
}

// 6 — SPIN HOME. One more turn, riding back to the middle of the stage, and
// close the loop by lifting the hat.
function spinHome(u, p) {
  const spin = ramp(u, 0.04, 0.5)
  const toe = hold(u, 0.02, 0.16, 0.48, 0.62)
  const tip = hold(u, 0.48, 0.64, 0.74, 0.88)
  const tuck = bump(u, 0.02, 0.54)

  p.rootYaw = 360 * spin
  p.rootZ = BACK_Z * (1 - ramp(u, 0.04, 0.56))

  const ankle = 50 * toe
  const lift = toeLift(ankle)
  p.rootY = lift - 0.02 * tip

  // The turn wraps both arms in; once it is done the gloved hand goes hunting
  // for the brim. The two windows never overlap, so they can just be sequenced.
  reachArm(p, 'L', ARM_CHEST_L, tuck)
  reachArm(p, 'R', ARM_CHEST_R, tuck)
  if (tip > 0) reachArm(p, 'R', ARM_BRIM, tip)

  p.hatLift = 0.06 * tip
  p.hatTilt = 26 * tip
  p.spinePitch = 15 * tip
  p.neckPitch = 9 * tip
  p.spineYaw = -6 * tuck

  stance(p, 0.02, { ankle, lift })
}

export const MOVES = [
  { name: 'hat tilt', dur: 3.0, pose: hatTilt },
  { name: 'toe spin', dur: 2.6, pose: toeSpin },
  { name: 'the lean', dur: 4.2, pose: theLean },
  { name: 'moonwalk', dur: 5.0, pose: moonwalk },
  { name: 'kick & point', dur: 2.6, pose: kickPoint },
  { name: 'hat off', dur: 3.2, pose: spinHome },
]

export const LOOP = MOVES.reduce((sum, m) => sum + m.dur, 0)

export function restPose() {
  return {
    rootX: 0, rootY: 0, rootZ: 0, rootYaw: 0, lean: 0,
    hipsPitch: 0, hipsYaw: 0, hipsRoll: 0,
    spinePitch: 0, spineYaw: 0, spineRoll: 0,
    neckPitch: 0, neckYaw: 0, neckRoll: 0,
    armLPitch: -6, armLTwist: -8, armLSpread: 10, elbowL: 14,
    armRPitch: -6, armRTwist: -8, armRSpread: 10, elbowR: 14,
    legLPitch: 0, legLTwist: 0, legLSpread: 2.5, kneeL: 4, ankleL: 0,
    legRPitch: 0, legRTwist: 0, legRSpread: 2.5, kneeR: 4, ankleR: 0,
    hatTilt: 0, hatRoll: 0, hatLift: 0,
  }
}

const KEYS = Object.keys(restPose())
const BLEND = 0.36 // seconds of crossfade at every move boundary

// Yaw is the one channel that wraps: a spin ends on 360 and the next move
// starts at 0, which is the same pose. Always take the short way round.
function lerpAngle(a, b, t) {
  const d = ((((b - a + 180) % 360) + 360) % 360) - 180
  return a + d * t
}

export function moveAt(t) {
  const time = ((t % LOOP) + LOOP) % LOOP
  let i = 0
  let start = 0
  while (i < MOVES.length - 1 && time >= start + MOVES[i].dur) {
    start += MOVES[i].dur
    i++
  }
  return { index: i, start, local: time - start, move: MOVES[i] }
}

// Sample the routine at loop time `t`. Inside the last BLEND seconds of a move
// the next move's opening pose is crossfaded in, so transitions never snap —
// which also means each move only has to be right about where it *starts*.
export function samplePose(t) {
  const { local, move, index } = moveAt(t)
  const p = restPose()
  move.pose(clamp01(local / move.dur), p)

  const tail = move.dur - local
  if (tail < BLEND) {
    const next = MOVES[(index + 1) % MOVES.length]
    const q = restPose()
    next.pose(0, q)
    const k = smooth(1 - tail / BLEND)
    for (const key of KEYS) {
      p[key] = key === 'rootYaw' ? lerpAngle(p[key], q[key], k) : lerp(p[key], q[key], k)
    }
  }
  return p
}
