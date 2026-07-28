import * as THREE from 'three'
import { restPositions } from './rig.js'

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
 * How deep into the palm the held rod's centreline sits: half the hand's
 * thickness, plus whatever the grip's own radius is (passed per weapon).
 */
const PALM_DEPTH = 0.006

/** How far down the metacarpals the rod crosses, as a fraction of their length. */
const GRIP_ALONG = 0.68

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
export function handGripSocket(side, { gripRadius = 0.014, rest = restPositions() } = {}) {
  const hand = rest[`hand${side}`]
  const rel = (name) => new THREE.Vector3().subVectors(rest[name], hand)

  const index = rel(`index${side}0`)
  const mid = rel(`mid${side}0`)
  const ring = rel(`ring${side}0`)

  const fingers = index.clone().add(mid).add(ring).divideScalar(3)
  const span = fingers.length()
  fingers.normalize()

  // Across the knuckles, ring -> index.
  const axis = new THREE.Vector3().subVectors(index, ring).normalize()

  // Palm normal: square to both, flipped on the right so the two mirrored hands
  // both end up facing the same way. (Mirror-image bases have opposite
  // handedness; this is the one place that has to be said out loud.)
  const normal = new THREE.Vector3()
    .crossVectors(fingers, axis)
    .multiplyScalar(side === 'L' ? 1 : -1)
    .normalize()

  const origin = new THREE.Vector3()
    .addScaledVector(fingers, span * GRIP_ALONG)
    .addScaledVector(normal, PALM_DEPTH + gripRadius)

  return { ...frame(origin, axis, normal, `grip${side}`), fingers, span }
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

  // In the bind pose the arms are out sideways with the palms down, so "away
  // from the arm" is the same -Y the palm faces. Stated outright rather than
  // derived from a cross product that flips between the two sides.
  const outward = new THREE.Vector3(0, -1, 0)
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
