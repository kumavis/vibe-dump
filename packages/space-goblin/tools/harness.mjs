import * as THREE from 'three'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { buildSkeleton, restPositions } from '../src/rig.js'
import { runPose, idlePose, comboPose, skidPose, buildClips } from '../src/anim.js'
import { mate, frame } from '../src/attach.js'
import { MOUNTS } from '../src/character.js'
import { buildCleaver, buildPistol, buildBuckler } from '../src/weapons.js'

// ---------------------------------------------------------------------------
// The bit every check stands on: a skeleton, the pose functions, and enough
// vector maths to ask geometric questions of them.
//
// All of this runs in plain node. `rig.js`, `anim.js`, `attach.js`,
// `weapons.js` and the pure half of `character.js` import nothing but three, so
// the whole suite is forward kinematics and arithmetic — no canvas, no
// WebGLRenderer, no headless browser, no screenshots to eyeball. That is the
// point: the bugs this suite exists to catch (a goblin running backwards, a
// cleaver held through the palm) are *numeric* bugs that a render happily
// shows you without complaining.
// ---------------------------------------------------------------------------

export const DEG = 180 / Math.PI
export const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')

// ---------------------------------------------------------------------------
// Reading constants back out of modules that cannot be imported here
// ---------------------------------------------------------------------------

const sourceCache = new Map()

/** Read a source file under the package root. */
export function source(relative) {
  if (!sourceCache.has(relative)) sourceCache.set(relative, readFileSync(join(SRC, relative), 'utf8'))
  return sourceCache.get(relative)
}

/**
 * Pull a top-level array literal out of a module by name and evaluate it.
 *
 * Used for `COLLIDERS`, which `character.js` keeps module-private. Copying the
 * table in here would be worse: a copy silently rots the moment somebody adds a
 * capsule, and then the self-intersection family is checking a body the goblin
 * no longer has. Parsing fails loudly instead, which is the behaviour we want.
 */
export function arrayLiteral(relative, name) {
  const src = source(relative)
  const start = src.indexOf(`const ${name} = [`)
  if (start < 0) {
    throw new Error(
      `tools: ${relative} no longer declares "const ${name} = [". Either export it and import it here, or update this reader.`,
    )
  }
  let i = src.indexOf('[', start)
  let depth = 0
  for (let j = i; j < src.length; j++) {
    if (src[j] === '[') depth++
    else if (src[j] === ']' && --depth === 0) {
      // eslint-disable-next-line no-new-func -- a literal from our own source tree
      return new Function(`return ${src.slice(i, j + 1)}`)()
    }
  }
  throw new Error(`tools: unterminated array literal for ${name} in ${relative}`)
}

/** Pull a top-level `const NAME = <number>` out of a module by name. */
export function numberLiteral(relative, name) {
  const m = source(relative).match(new RegExp(`const ${name}\\s*=\\s*(-?[0-9.]+)`))
  if (!m) throw new Error(`tools: ${relative} no longer declares "const ${name} = <number>"`)
  return Number(m[1])
}

/**
 * The capsules the cloth and strap solver collides against — the closest thing
 * the goblin has to a body, and what the self-intersection family samples.
 * Read out of `character.js` rather than duplicated. See `arrayLiteral`.
 */
export const COLLIDERS = arrayLiteral('src/character.js', 'COLLIDERS')

/**
 * The ground speed `main.js` scrolls the world at. It cannot be imported —
 * `main.js` touches the DOM at module scope — so it is read from the source.
 * The run clip has to agree with this number or the feet skate.
 */
export const RUN_SPEED = numberLiteral('main.js', 'RUN_SPEED')

// ---------------------------------------------------------------------------
// Rig + FK
// ---------------------------------------------------------------------------

export const REST = restPositions()

export function makeRig() {
  const { root, bones, byName } = buildSkeleton()
  return { root, bones, byName }
}

/**
 * Drive the rig from one sample of a pose function. Bones the pose does not
 * mention go back to their rest rotation, exactly as three's mixer leaves them
 * when no track writes to them.
 */
export function applyPose(rig, pose) {
  for (const b of rig.bones) b.quaternion.identity()
  rig.byName.hips.position.copy(REST.hips)
  for (const [name, value] of Object.entries(pose)) {
    if (name === 'hipsPos') {
      rig.byName.hips.position.set(REST.hips.x + value.x, REST.hips.y + value.y, REST.hips.z + value.z)
      continue
    }
    const bone = rig.byName[name]
    if (bone) bone.quaternion.copy(value)
  }
  rig.root.updateMatrixWorld(true)
  return rig
}

const _p = new THREE.Vector3()

/** World position of a bone, as a fresh vector. */
export function bonePos(rig, name, out = new THREE.Vector3()) {
  const bone = rig.byName[name]
  if (!bone) throw new Error(`tools: no bone "${name}"`)
  return out.setFromMatrixPosition(bone.matrixWorld)
}

// ---------------------------------------------------------------------------
// Clips
//
// Sample counts are per clip rather than a global constant: `run` is 0.56 s and
// every check in the locomotion family reads velocities off it, so it gets the
// densest sampling; `idle` is 4.2 s of slow breathing and does not need it.
// The whole suite is ~1000 FK evaluations, which is a few hundred milliseconds.
// ---------------------------------------------------------------------------

export const CLIPS = [
  { name: 'run', pose: runPose, duration: 0.56, samples: 240, loops: true },
  { name: 'idle', pose: idlePose, duration: 4.2, samples: 120, loops: true },
  { name: 'combo', pose: comboPose, duration: 2.1, samples: 240, loops: false },
  { name: 'skid', pose: skidPose, duration: 0.3, samples: 60, loops: false },
]

/** The baked AnimationClips, as `character.js` builds them. */
export const BAKED = buildClips()

export const sharedRig = makeRig()

// ---------------------------------------------------------------------------
// Weapons, seated the way the running scene seats them
// ---------------------------------------------------------------------------

export const GEARS = { cleaver: buildCleaver(), buckler: buildBuckler(), pistol: buildPistol() }

/** `character.js`'s private `trimmed()`: the socket a trim actually asks for. */
export function trimmed(socket, { slide = 0, lift = 0 } = {}) {
  return frame(
    socket.origin.clone().addScaledVector(socket.axis, slide).addScaledVector(socket.normal, lift),
    socket.axis,
    socket.normal,
    socket.label,
  )
}

/**
 * Every weapon, with the transform `character.js` would give it.
 *
 * A mount may state `placed` — a raw `{ position, quaternion }` — instead of
 * leaving it to `mate()`. Nothing in `src/` does, and nothing should: the whole
 * argument of `attach.js` is that a placement is solved, not typed. The seam
 * exists so a *proposed* placement can be measured against the socket without
 * being installed, which is how the pre-fix euler triple was replayed against
 * this suite (see README, "proving the suite has teeth").
 */
export function mounts() {
  const out = {}
  for (const [name, gear] of Object.entries(GEARS)) {
    const mount = MOUNTS[name](gear)
    const placed = mount.placed || mate(mount.socket, mount.plug, mount.trim)
    out[name] = { name, gear, ...mount, placed }
    out[name].matrix = new THREE.Matrix4().compose(
      placed.position,
      placed.quaternion,
      new THREE.Vector3(1, 1, 1),
    )
  }
  return out
}

/** World matrix of a mounted weapon at the current pose. */
export function weaponMatrix(rig, mount, out = new THREE.Matrix4()) {
  return out.multiplyMatrices(rig.byName[mount.bone].matrixWorld, mount.matrix)
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/** A collider row `[bone, a, b, r]`, resolved to world space at the current pose. */
export function capsuleWorld(rig, [bone, a, b, r]) {
  return {
    bone,
    a: new THREE.Vector3(...a).applyMatrix4(rig.byName[bone].matrixWorld),
    b: new THREE.Vector3(...b).applyMatrix4(rig.byName[bone].matrixWorld),
    r,
  }
}

/** Distance from a point to a segment. */
export function pointSegDist(p, a, b) {
  const ab = _p.subVectors(b, a)
  const t = THREE.MathUtils.clamp(new THREE.Vector3().subVectors(p, a).dot(ab) / (ab.lengthSq() || 1), 0, 1)
  return new THREE.Vector3().copy(a).addScaledVector(ab, t).distanceTo(p)
}

/** Signed clearance from a point to a capsule: negative means inside it. */
export function pointCapsuleDist(p, cap) {
  return pointSegDist(p, cap.a, cap.b) - cap.r
}

/**
 * Closest distance between two segments. The standard clamped-parameter
 * solution; degenerate (zero-length) segments fall through to the point case.
 */
export function segSegDist(p1, q1, p2, q2) {
  const d1 = new THREE.Vector3().subVectors(q1, p1)
  const d2 = new THREE.Vector3().subVectors(q2, p2)
  const r = new THREE.Vector3().subVectors(p1, p2)
  const a = d1.dot(d1)
  const e = d2.dot(d2)
  const f = d2.dot(r)
  if (a < 1e-12 && e < 1e-12) return r.length()
  let s = 0
  let t = 0
  if (a < 1e-12) {
    t = THREE.MathUtils.clamp(f / e, 0, 1)
  } else {
    const c = d1.dot(r)
    if (e < 1e-12) {
      s = THREE.MathUtils.clamp(-c / a, 0, 1)
    } else {
      const b = d1.dot(d2)
      const den = a * e - b * b
      s = den > 1e-12 ? THREE.MathUtils.clamp((b * f - c * e) / den, 0, 1) : 0
      t = (b * s + f) / e
      if (t < 0) {
        t = 0
        s = THREE.MathUtils.clamp(-c / a, 0, 1)
      } else if (t > 1) {
        t = 1
        s = THREE.MathUtils.clamp((b - c) / a, 0, 1)
      }
    }
  }
  return new THREE.Vector3()
    .copy(p1)
    .addScaledVector(d1, s)
    .distanceTo(new THREE.Vector3().copy(p2).addScaledVector(d2, t))
}

/** Signed clearance from a segment to a capsule: negative means it is inside. */
export function segCapsuleDist(a, b, cap) {
  return segSegDist(a, b, cap.a, cap.b) - cap.r
}

// ---------------------------------------------------------------------------
// Feet
// ---------------------------------------------------------------------------

/**
 * The bones that can touch the ground. A digitigrade foot rolls: the toe tip
 * lands first, the ball takes the weight, and the raised heel never touches at
 * all in a sprint — so "where the foot meets the floor" is whichever of these
 * is lowest, and it changes identity mid-stance.
 */
export const FOOT_MARKERS = {
  L: ['toeTipL', 'toeL', 'heelL'],
  R: ['toeTipR', 'toeR', 'heelR'],
}

/** The lowest ground marker of one foot at the current pose. */
export function footContact(rig, side) {
  let best = null
  for (const name of FOOT_MARKERS[side]) {
    const p = bonePos(rig, name)
    if (!best || p.y < best.p.y) best = { name, p }
  }
  return best
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export const fmt = {
  m: (v, d = 4) => `${v.toFixed(d)} m`,
  mm: (v, d = 1) => `${(v * 1000).toFixed(d)} mm`,
  deg: (v, d = 2) => `${v.toFixed(d)}°`,
  pct: (v, d = 1) => `${(v * 100).toFixed(d)}%`,
  at: (clip, t) => `${clip} t=${t.toFixed(3)}`,
}
