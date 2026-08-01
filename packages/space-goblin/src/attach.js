import * as THREE from 'three'
import { buildSkeleton, restPositions } from './rig.js'
import { handPose } from './anim.js'

// ---------------------------------------------------------------------------
// Sockets and plugs — how a held thing knows where to sit
//
// The first version attached the cleaver with a hand-searched euler triple.
// It was searched against a *proxy* objective ("the tip should end up roughly
// here over the run cycle") rather than against the thing that actually
// matters, which is that the handle passes through the fist. Measured after the
// fact, that triple put the grip axis 98° away from the hand's — the goblin was
// holding a cleaver that ran along his fingers and out through his palm, and
// the fist was closed on nothing.
//
// The fix is to stop searching. A grip is a *constraint*, and constraints are
// solved, not tuned:
//
//   • a bone publishes a SOCKET  — an oriented frame in its own local space
//   • a prop publishes a PLUG    — an oriented frame in its own local space
//   • `mate(socket, plug)` returns the one transform that makes them coincide
//
// What's left over after mating is a single readable dial — `roll`, radians
// about the grip axis — instead of three coupled euler angles. Anything that
// still looks wrong after that is an animation problem (the wrist), not an
// attachment problem, and should be fixed in `anim.js` where it belongs.
//
// A frame is `{ origin, axis, normal }`:
//   • `axis`   the long axis. For a grip: from pommel towards the business end.
//   • `normal` the roll reference. For a grip: the way the palm faces / the way
//              the cutting edge points. Only its component perpendicular to
//              `axis` is used, so it never has to be exactly square.
// ---------------------------------------------------------------------------

const _x = new THREE.Vector3()
const _y = new THREE.Vector3()
const _z = new THREE.Vector3()
const _m = new THREE.Matrix4()

const v3 = (v) => (v instanceof THREE.Vector3 ? v.clone() : new THREE.Vector3().fromArray(v))

/**
 * Build a frame. Vectors may be arrays or Vector3s; `normal` is orthonormalised
 * against `axis`, so callers can pass an approximate one.
 *
 * @param {THREE.Vector3|number[]} origin
 * @param {THREE.Vector3|number[]} axis
 * @param {THREE.Vector3|number[]} normal
 * @param {string} [label]
 */
export function frame(origin, axis, normal, label = '') {
  const a = v3(axis).normalize()
  const n = v3(normal)
  n.addScaledVector(a, -n.dot(a))
  if (n.lengthSq() < 1e-12) {
    throw new Error(`attach: frame "${label}" has a normal parallel to its axis`)
  }
  return { origin: v3(origin), axis: a, normal: n.normalize(), label }
}

/** The frame's rotation, as a quaternion taking (+X, +Y, +Z) to (axis, normal, axis x normal). */
export function frameQuaternion(f, out = new THREE.Quaternion()) {
  _x.copy(f.axis)
  _y.copy(f.normal)
  _z.crossVectors(_x, _y)
  _m.makeBasis(_x, _y, _z)
  return out.setFromRotationMatrix(_m)
}

/**
 * The transform that seats `plug` (in the prop's local space) into `socket`
 * (in the bone's local space).
 *
 * @param {ReturnType<frame>} socket
 * @param {ReturnType<frame>} plug
 * @param {object} [trim]
 * @param {number} [trim.roll]   radians about the socket axis — the one dial a
 *                               human should ever need: "which way does the
 *                               edge face".
 * @param {number} [trim.slide]  metres along the socket axis; + pushes the
 *                               business end away from the hand.
 * @param {number} [trim.lift]   metres along the socket normal; + lifts the
 *                               prop off the palm.
 * @returns {{ position: THREE.Vector3, quaternion: THREE.Quaternion }}
 */
export function mate(socket, plug, { roll = 0, slide = 0, lift = 0 } = {}) {
  const qs = frameQuaternion(socket)
  const qp = frameQuaternion(plug)
  const quaternion = qs.multiply(qp.invert())
  if (roll) {
    quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(socket.axis, roll))
  }
  const position = socket.origin
    .clone()
    .addScaledVector(socket.axis, slide)
    .addScaledVector(socket.normal, lift)
    .sub(plug.origin.clone().applyQuaternion(quaternion))
  return { position, quaternion }
}

// ---------------------------------------------------------------------------
// Hand grip sockets, derived from the rig rather than typed in
// ---------------------------------------------------------------------------

/**
 * Where a held rod actually sits, measured off the closed fist rather than
 * guessed.
 *
 * The first version of this file guessed: half a hand-thickness (6 mm) plus the
 * grip's radius. That put the cleaver's centreline 20.5 mm off the metacarpal
 * line, and an independent pass measuring against the *skinned* hand found 12.8
 * mm of handle buried in the palm flesh with the fingers closing on 9–18 mm of
 * air. Guessing an anatomical number is the same mistake as guessing an euler
 * triple; it just hides better.
 *
 * So the socket asks the rig. `handPose(side, 1)` is what closes the fist, so
 * forward-kinematic the digits under it and measure the loop they enclose: the
 * rod's centreline is the midpoint between the metacarpal line and the curled
 * fingertips, on both axes. That lands at 36.6 mm deep, within 5 mm of the 41.5
 * mm the skin-space measurement independently arrived at.
 */
const fistCache = new Map()

function fistLoop(side) {
  if (fistCache.has(side)) return fistCache.get(side)
  const { root, byName } = buildSkeleton()
  const pose = {}
  handPose(pose, side, 1)
  for (const [name, q] of Object.entries(pose)) byName[name].quaternion.copy(q)
  root.updateMatrixWorld(true)

  const hand = byName[`hand${side}`]
  const inv = new THREE.Matrix4().copy(hand.matrixWorld).invert()
  const posed = (name) =>
    new THREE.Vector3().setFromMatrixPosition(byName[name].matrixWorld).applyMatrix4(inv)

  const knuckles = new THREE.Vector3()
  for (const d of ['index', 'mid', 'ring']) knuckles.add(posed(`${d}${side}0`))
  knuckles.divideScalar(3)
  const span = knuckles.length()
  const fingers = knuckles.clone().normalize()
  const axis = posed(`index${side}0`).sub(posed(`ring${side}0`)).normalize()
  const normal = new THREE.Vector3()
    .crossVectors(fingers, axis)
    .multiplyScalar(side === 'L' ? 1 : -1)
    .normalize()

  // Where the curled fingertips end up, in the hand's own (fingers, normal) plane.
  let depth = 0
  let along = 0
  for (const d of ['index', 'mid', 'ring']) {
    const tip = posed(`${d}${side}2`)
    depth += tip.dot(normal)
    along += tip.dot(fingers)
  }
  const loop = {
    span,
    fingers,
    axis,
    normal,
    /** depth of the rod's centreline below the metacarpal line */
    depth: depth / 3 / 2,
    /** how far along the fingers it crosses */
    along: (span + along / 3) / 2,
    /** the largest rod this fist can close around, in bone space */
    enclosed: depth / 3 / 2,
  }
  fistCache.set(side, loop)
  return loop
}

/**
 * The grip socket of a hand, in that hand bone's local space.
 *
 * Everything here is measured off the finger bones, so the socket tracks the
 * rig instead of drifting away from it:
 *
 *   • `fingers`  wrist -> mean knuckle. The hand's long axis.
 *   • `axis`     ring knuckle -> index knuckle. This is the line a held rod
 *                lies along, and it is also exactly the axis `handPose` curls
 *                the digits about, which is the real proof it is right. It
 *                points towards the index/thumb side, so a blade seated on it
 *                exits the *top* of the fist.
 *   • `normal`   the way the palm faces — the direction the fingertips travel
 *                as they close.
 *
 * @param {'L'|'R'} side
 * @param {object} [o]
 * @param {number} [o.gripRadius=0.014] radius of the thing being held
 * @param {Record<string, THREE.Vector3>} [o.rest]
 */
export function handGripSocket(side, { gripRadius = 0.014 } = {}) {
  const { span, fingers, axis, normal, depth, along, enclosed } = fistLoop(side)

  const origin = new THREE.Vector3()
    .addScaledVector(fingers, along)
    .addScaledVector(normal, depth)

  if (gripRadius > enclosed) {
    console.warn(
      `attach: a ${(gripRadius * 1000).toFixed(1)} mm grip does not fit the ${side} fist, ` +
        `which closes around ${(enclosed * 1000).toFixed(1)} mm`,
    )
  }

  return { ...frame(origin, axis, normal, `grip${side}`), fingers, span, enclosed, slack: enclosed - gripRadius }
}

/**
 * The strap socket of a forearm — where a buckler's inner face sits.
 *
 * `axis` is the shield's outward normal (away from the arm, the way the boss
 * points) and `normal` is "up" across the shield's face, taken along the
 * forearm towards the hand.
 *
 * @param {'L'|'R'} side
 * @param {object} [o]
 * @param {number} [o.along=0.55] fraction of the forearm, elbow -> wrist
 * @param {number} [o.clearance=0.045] metres from the bone axis to the shield's inner face
 */
export function forearmStrapSocket(side, { along = 0.55, clearance = 0.045, rest = restPositions() } = {}) {
  const elbow = rest[`forearm${side}`]
  const wrist = rest[`hand${side}`]
  const bone = new THREE.Vector3().subVectors(wrist, elbow)
  const length = bone.length()
  bone.normalize()

  // A shield straps to the BACK of the forearm, not the palm side.
  //
  // This shipped backwards. The comment here used to say "away from the arm is
  // the same -Y the palm faces", which quietly equates two different things:
  // -Y is where the palm looks, and a buckler mounted there rides the inside of
  // the wrist, where it fouls his own body and where no shield has ever been
  // worn. The back of the forearm is +Y in the bind pose (arms out sideways,
  // palms down), and `socket.axis . handGripSocket().normal` is the one-line
  // test — it wants to be about -1, and it was +0.997.
  const outward = new THREE.Vector3(0, 1, 0)
  const origin = new THREE.Vector3()
    .addScaledVector(bone, length * along)
    .addScaledVector(outward, clearance)

  return { ...frame(origin, outward, bone, `strap${side}`), length }
}

// ---------------------------------------------------------------------------
// Diagnostics — the half of this file that earns its keep
// ---------------------------------------------------------------------------

const DEG = 180 / Math.PI

/**
 * How badly a proposed transform misses a socket. Feed it whatever a prop is
 * actually attached with and it reports, in degrees and millimetres, the thing
 * a render will not show you.
 *
 * @param {ReturnType<frame>} socket
 * @param {ReturnType<frame>} plug
 * @param {{position: THREE.Vector3, quaternion: THREE.Quaternion}} placed
 */
export function socketError(socket, plug, placed) {
  const axis = plug.axis.clone().applyQuaternion(placed.quaternion)
  const normal = plug.normal.clone().applyQuaternion(placed.quaternion)
  const origin = plug.origin.clone().applyQuaternion(placed.quaternion).add(placed.position)
  const offset = new THREE.Vector3().subVectors(origin, socket.origin)
  return {
    /** angle between the grip's long axis and the socket's, in degrees */
    axisDeg: axis.angleTo(socket.axis) * DEG,
    /** roll about the axis, in degrees */
    rollDeg: normal.angleTo(socket.normal) * DEG,
    /** how far the grip centre sits from the socket centre, in metres */
    offset: offset.length(),
    /** signed components of that miss, along the socket's own basis */
    alongAxis: offset.dot(socket.axis),
    alongNormal: offset.dot(socket.normal),
    origin,
    axis,
  }
}

/** Pretty one-liner for a check suite or a console dump. */
export function formatSocketError(name, e) {
  return `${name.padEnd(10)} axis ${e.axisDeg.toFixed(1).padStart(6)}°  roll ${e.rollDeg
    .toFixed(1)
    .padStart(6)}°  offset ${(e.offset * 1000).toFixed(1).padStart(5)} mm`
}
